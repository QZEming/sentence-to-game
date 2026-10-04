export const PLAYER_RADIUS = 0.38;
export const PLAYER_HEIGHT = 1.65;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export class Controller {
  constructor(platforms, emit = () => {}) {
    this.platforms = platforms;
    this.emit = emit;
    this.position = { x: 0, y: 0.05, z: 4 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.facing = { x: 0, z: -1 };
    this.reset(this.position);
  }
  reset(position) {
    Object.assign(this.position, position);
    Object.assign(this.velocity, { x: 0, y: 0, z: 0 });
    this.grounded = false;
    this.jumps = 0;
    this.coyote = 0;
    this.jumpBuffer = 0;
    this.dashRemaining = 0;
    this.dashCooldown = 0;
    this.ground = null;
    this.lastGroundPosition = null;
  }
  jump() { this.jumpBuffer = 0.14; }
  dash() {
    if (this.dashCooldown > 0) return false;
    this.dashRemaining = 0.22;
    this.dashCooldown = 1.05;
    this.dashDirection = { ...this.facing };
    this.velocity.y = Math.max(this.velocity.y, 1.1);
    this.emit('dash');
    return true;
  }
  step(dt, input = {}, lowGravity = false) {
    const p = this.position, v = this.velocity;
    this.dashCooldown = Math.max(0, this.dashCooldown - dt);
    this.dashRemaining = Math.max(0, this.dashRemaining - dt);
    this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
    this.coyote = Math.max(0, this.coyote - dt);
    if (this.ground && this.lastGroundPosition) {
      p.x += this.ground.mesh.position.x - this.lastGroundPosition.x;
      p.y += this.ground.mesh.position.y - this.lastGroundPosition.y;
      p.z += this.ground.mesh.position.z - this.lastGroundPosition.z;
    }
    let dx = input.x || 0, dz = input.z || 0;
    const length = Math.hypot(dx, dz);
    if (length > 0) {
      dx /= Math.max(1, length); dz /= Math.max(1, length);
      this.facing = { x: dx / Math.hypot(dx, dz), z: dz / Math.hypot(dx, dz) };
    }
    const dash = this.dashRemaining > 0;
    const speed = input.sprint ? 11 : 8;
    const damping = 1 - Math.exp(-(this.grounded ? 16 : 7) * dt);
    v.x += (dx * speed - v.x) * damping;
    v.z += (dz * speed - v.z) * damping;
    if (this.jumpBuffer > 0) {
      const first = this.grounded || this.coyote > 0;
      if (first || this.jumps < 2) {
        this.jumps = first ? 1 : 2;
        v.y = lowGravity ? 8.5 : (this.jumps === 2 ? 10.1 : 10.5);
        this.grounded = false;
        this.ground = null;
        this.coyote = 0;
        this.jumpBuffer = 0;
        this.emit(this.jumps === 1 ? 'jump' : 'doubleJump');
      }
    }
    if (dash) {
      v.x = this.dashDirection.x * 23;
      v.z = this.dashDirection.z * 23;
      v.y = Math.max(v.y, 0.5);
    } else v.y -= (lowGravity ? 11.5 : 24) * dt;

    // Separate each horizontal axis so contact slides along walls instead of sticking.
    const priorY = p.y;
    for (const axis of ['x', 'z']) {
      p[axis] += v[axis] * dt;
      for (const platform of this.platforms) {
        if (platform.mesh.visible === false) continue;
        const q = platform.mesh.position, top = q.y + platform.h / 2;
        if (p.y >= top - 0.05 || p.y + PLAYER_HEIGHT <= q.y - platform.h / 2 + 0.03) continue;
        const ex = platform.w / 2 + PLAYER_RADIUS, ez = platform.d / 2 + PLAYER_RADIUS;
        if (Math.abs(p.x - q.x) < ex && Math.abs(p.z - q.z) < ez) {
          const extent = axis === 'x' ? ex : ez;
          p[axis] = q[axis] + (v[axis] > 0 ? -extent : extent);
          v[axis] = 0;
        }
      }
    }
    p.y += v.y * dt;
    const wasGrounded = this.grounded;
    this.grounded = false;
    this.ground = null;
    let landing = null;
    for (const platform of this.platforms) {
      if (platform.mesh.visible === false) continue;
      const q = platform.mesh.position;
      if (Math.abs(p.x - q.x) >= platform.w / 2 + PLAYER_RADIUS * 0.7 ||
          Math.abs(p.z - q.z) >= platform.d / 2 + PLAYER_RADIUS * 0.7) continue;
      const top = q.y + platform.h / 2;
      const bottom = q.y - platform.h / 2;
      if (v.y <= 0 && priorY >= top - 0.14 && p.y <= top + 0.01 && (!landing || top > landing.top)) {
        landing = { platform, top };
      } else if (v.y > 0 && priorY + PLAYER_HEIGHT <= bottom + 0.05 && p.y + PLAYER_HEIGHT >= bottom) {
        p.y = bottom - PLAYER_HEIGHT;
        v.y = 0;
      }
    }
    if (landing) {
      p.y = landing.top;
      if (landing.platform.type === 'bounce') {
        v.y = 15; this.jumps = 1; this.emit('doubleJump');
      } else {
        if (!wasGrounded && v.y < -3) this.emit('land');
        v.y = 0; this.grounded = true; this.jumps = 0; this.coyote = 0.12;
        this.ground = landing.platform;
        this.lastGroundPosition = { ...landing.platform.mesh.position };
      }
    } else if (wasGrounded) this.coyote = 0.12;
    if (!this.grounded && this.coyote <= 0 && this.jumps === 0) this.jumps = 1;
    v.y = clamp(v.y, -32, 18);
    return p;
  }
}

export function intersectsHazard(position, hazard) {
  if (!hazard.active || hazard.mesh.visible === false) return false;
  const q = hazard.mesh.position;
  return Math.abs(position.x - q.x) < hazard.w / 2 + PLAYER_RADIUS * 0.8 &&
    Math.abs(position.z - q.z) < hazard.d / 2 + PLAYER_RADIUS * 0.8 &&
    position.y < q.y + hazard.h / 2 && position.y + PLAYER_HEIGHT > q.y - hazard.h / 2;
}
