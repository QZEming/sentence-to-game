/**
 * Optical rules shared by the renderer and the game.
 * Coordinates are in the horizontal x/z plane, angles describe mirror surfaces
 * in degrees modulo 180. Light colors are 'gold', 'blue', and 'rose'.
 * Filters tint gold, pass matching light, and absorb other colors. A prism
 * splits gold into blue (-90 degrees) and rose (+90 degrees); colored light
 * passes through. A plate removes the obstacle with that plateId while active.
 */
const EPSILON = 1e-5;
const BOUNDS = 9.5;
const MIRROR_HALF_LENGTH = 0.95;
const RECEIVER_RADIUS = 0.55;

const emptyParts = { plates: [], obstacles: [], filters: [], prisms: [] };

export const LEVELS = [
  {
    ...emptyParts,
    id: 'first-light', name: '第一缕光', subtitle: '01 / 苏醒林地',
    description: '森林的星门沉睡了。转动古老的镜子，让晨光唤醒月石。',
    hint: '光从西边而来。让镜面斜向左上，把光折向北方的月石。',
    theme: 'meadow', spawn: { x: -5, z: 5 },
    source: { x: -7, z: 2, dx: 1, dz: 0, color: 'gold' },
    mirrors: [{ id: 'm1', x: -1, z: 2, angle: 45, solutionAngle: 135 }],
    receivers: [{ id: 'r1', x: -1, z: -6, color: 'gold' }],
    wisps: [{ id: 'w1', x: -5, z: 0 }, { id: 'w2', x: 2, z: 3 }, { id: 'w3', x: 3, z: -4 }],
    gate: { x: 5, z: -6 },
  },
  {
    ...emptyParts,
    id: 'silver-trail', name: '银色回廊', subtitle: '02 / 苔藓回廊',
    description: '三面镜子藏在苔藓之间。让一束光沿着回廊，转过三个弯。',
    hint: '依次把光引向北、东、南。观察每一段光线的终点，再调整下一面镜子。',
    theme: 'moss', spawn: { x: -6, z: 6 },
    source: { x: -7, z: 4, dx: 1, dz: 0, color: 'gold' },
    mirrors: [
      { id: 'm1', x: -3, z: 4, angle: 0, solutionAngle: 135 },
      { id: 'm2', x: -3, z: -3, angle: 90, solutionAngle: 135 },
      { id: 'm3', x: 4, z: -3, angle: 135, solutionAngle: 45 },
    ],
    receivers: [{ id: 'r1', x: 4, z: 5, color: 'gold' }],
    obstacles: [{ id: 'rock1', x: 0, z: 0, radius: 1 }],
    wisps: [{ id: 'w1', x: -6, z: -4 }, { id: 'w2', x: 0, z: -5 }, { id: 'w3', x: 6, z: 0 }],
    gate: { x: 7, z: 6 },
  },
  {
    ...emptyParts,
    id: 'blue-hour', name: '蓝色时刻', subtitle: '03 / 蓝蕨幽谷',
    description: '蓝色月石只回应同色的光。穿过晶片，把晨光染成森林的夜色。',
    hint: '蓝色晶片会改变光的颜色。两面镜子都朝同一条斜线摆放，光就能绕过岩石。',
    theme: 'blue', spawn: { x: -6, z: 6 },
    source: { x: -7, z: 3, dx: 1, dz: 0, color: 'gold' },
    filters: [{ id: 'f1', x: -5, z: 3, color: 'blue' }],
    mirrors: [
      { id: 'm1', x: -2, z: 3, angle: 45, solutionAngle: 135 },
      { id: 'm2', x: -2, z: -3, angle: 0, solutionAngle: 135 },
    ],
    receivers: [{ id: 'r1', x: 5, z: -3, color: 'blue' }],
    obstacles: [{ id: 'rock1', x: 1.5, z: 0, radius: 1.2 }, { id: 'rock2', x: 4.5, z: 3.5, radius: 0.7 }],
    wisps: [{ id: 'w1', x: -6, z: -2 }, { id: 'w2', x: 1, z: 5 }, { id: 'w3', x: 5, z: -6 }],
    gate: { x: 7, z: -5 },
  },
  {
    ...emptyParts,
    id: 'twin-stars', name: '双星共鸣', subtitle: '04 / 棱晶花园',
    description: '一束晨光，两颗星星。棱晶会分出蓝与粉，让两颗月石同时闪耀。',
    hint: '棱晶将光分向南北。北面的镜子把蓝光送往东；南面的镜子把粉光也送往东。',
    theme: 'rose', spawn: { x: -6, z: 6 },
    source: { x: -7, z: 0, dx: 1, dz: 0, color: 'gold' },
    prisms: [{ id: 'prism1', x: -2, z: 0 }],
    mirrors: [
      { id: 'm1', x: -2, z: -4, angle: 45, solutionAngle: 135 },
      { id: 'm2', x: -2, z: 4, angle: 135, solutionAngle: 45 },
    ],
    receivers: [{ id: 'r1', x: 5, z: -4, color: 'blue' }, { id: 'r2', x: 5, z: 4, color: 'rose' }],
    wisps: [{ id: 'w1', x: -6, z: -5 }, { id: 'w2', x: 1, z: 0 }, { id: 'w3', x: 7, z: 1 }],
    gate: { x: 7, z: -6 },
  },
  {
    ...emptyParts,
    id: 'heart-of-the-forest', name: '森林之心', subtitle: '05 / 古树圣所',
    description: '最后的光路被荆棘封锁。排好四面镜子，再踏上月纹石板，让双星唤醒森林。',
    hint: '先让晨光向北、向东进入棱晶。蓝光向西，粉光向东；最后站上东南方的月纹石板。',
    theme: 'heart', spawn: { x: -6, z: 6 },
    source: { x: -7, z: 0, dx: 1, dz: 0, color: 'gold' },
    mirrors: [
      { id: 'm1', x: -4, z: 0, angle: 45, solutionAngle: 135 },
      { id: 'm2', x: -4, z: -3, angle: 90, solutionAngle: 135 },
      { id: 'm3', x: 0, z: -6, angle: 135, solutionAngle: 45 },
      { id: 'm4', x: 0, z: 3, angle: 135, solutionAngle: 45 },
    ],
    prisms: [{ id: 'prism1', x: 0, z: -3 }],
    receivers: [{ id: 'r1', x: -6, z: -6, color: 'blue' }, { id: 'r2', x: 6, z: 3, color: 'rose' }],
    obstacles: [{ id: 'thorns1', x: 3, z: 3, radius: 0.8, plateId: 'p1' }, { id: 'rock1', x: 3.5, z: -1, radius: 0.85 }],
    plates: [{ id: 'p1', x: 5, z: 6, obstacleId: 'thorns1' }],
    wisps: [{ id: 'w1', x: -7, z: -3 }, { id: 'w2', x: 2, z: -6 }, { id: 'w3', x: 6, z: 0 }],
    gate: { x: 7, z: -5 },
  },
];

/** Return the reflected unit direction, exposing the same math to previews. */
export function reflectDirection(dx, dz, angle) {
  const radians = angle * Math.PI / 180;
  const nx = -Math.sin(radians), nz = Math.cos(radians);
  const dot = dx * nx + dz * nz;
  return { dx: dx - 2 * dot * nx, dz: dz - 2 * dot * nz };
}

function circleDistance(origin, direction, object, radius) {
  const ox = origin.x - object.x, oz = origin.z - object.z;
  const b = ox * direction.dx + oz * direction.dz;
  const c = ox * ox + oz * oz - radius * radius;
  const discriminant = b * b - c;
  if (discriminant < -EPSILON) return null;
  const root = Math.sqrt(Math.max(0, discriminant));
  const near = -b - root, far = -b + root;
  if (near > EPSILON) return near;
  if (far > EPSILON) return far;
  return null;
}

// Prisms and filters act at their centers' projection onto the ray, so a
// centered incoming beam also produces perfectly centered outgoing branches.
function opticDistance(origin, direction, object, radius) {
  const ox = object.x - origin.x, oz = object.z - origin.z;
  const along = ox * direction.dx + oz * direction.dz;
  const across = ox * direction.dz - oz * direction.dx;
  return along > EPSILON && Math.abs(across) <= radius ? along : null;
}

function boundsDistance(origin, direction) {
  const times = [];
  if (direction.dx > EPSILON) times.push((BOUNDS - origin.x) / direction.dx);
  if (direction.dx < -EPSILON) times.push((-BOUNDS - origin.x) / direction.dx);
  if (direction.dz > EPSILON) times.push((BOUNDS - origin.z) / direction.dz);
  if (direction.dz < -EPSILON) times.push((-BOUNDS - origin.z) / direction.dz);
  return Math.min(...times.filter(t => t > EPSILON));
}

/**
 * Pure, deterministic ray tracer. Angle overrides may be a plain object or Map;
 * activePlates may be an array or Set of plate IDs. Receivers absorb light even
 * when colors do not match. Repeated optical states terminate closed ray loops.
 */
export function traceLight(level, angles = {}, activePlates = []) {
  const segments = [];
  const litReceiverIds = new Set();
  const hitMirrorIds = new Set();
  const active = new Set(activePlates);
  const sourceLength = Math.hypot(level.source.dx, level.source.dz);
  if (!sourceLength) return { segments, litReceiverIds: [], hitMirrorIds: [] };
  const queue = [{
    x: level.source.x, z: level.source.z,
    dx: level.source.dx / sourceLength, dz: level.source.dz / sourceLength,
    color: level.source.color || 'gold',
  }];
  const visited = new Set();
  const mirrorAngle = mirror => angles instanceof Map
    ? (angles.get(mirror.id) ?? mirror.angle)
    : (angles[mirror.id] ?? mirror.angle);

  for (let index = 0; index < queue.length && index < 128; index++) {
    const ray = queue[index];
    let nearest = { kind: 'bounds', distance: boundsDistance(ray, ray) };
    const consider = (kind, object, distance) => {
      if (distance != null && distance > EPSILON && distance < nearest.distance - EPSILON) {
        nearest = { kind, object, distance };
      }
    };
    for (const mirror of level.mirrors || []) {
      const angle = mirrorAngle(mirror) * Math.PI / 180;
      const tx = Math.cos(angle), tz = Math.sin(angle), nx = -tz, nz = tx;
      const denominator = ray.dx * nx + ray.dz * nz;
      if (Math.abs(denominator) < EPSILON) continue;
      const distance = ((mirror.x - ray.x) * nx + (mirror.z - ray.z) * nz) / denominator;
      const side = (ray.x + ray.dx * distance - mirror.x) * tx + (ray.z + ray.dz * distance - mirror.z) * tz;
      if (Math.abs(side) <= MIRROR_HALF_LENGTH + EPSILON) consider('mirror', mirror, distance);
    }
    for (const receiver of level.receivers || []) {
      consider('receiver', receiver, circleDistance(ray, ray, receiver, RECEIVER_RADIUS));
    }
    for (const obstacle of level.obstacles || []) {
      if (obstacle.plateId && active.has(obstacle.plateId)) continue;
      consider('obstacle', obstacle, circleDistance(ray, ray, obstacle, obstacle.radius || 0.65));
    }
    for (const filter of level.filters || []) consider('filter', filter, opticDistance(ray, ray, filter, 0.6));
    for (const prism of level.prisms || []) consider('prism', prism, opticDistance(ray, ray, prism, 0.6));
    if (!Number.isFinite(nearest.distance)) continue;
    const point = { x: ray.x + ray.dx * nearest.distance, z: ray.z + ray.dz * nearest.distance };
    segments.push({ from: { x: ray.x, z: ray.z }, to: point, color: ray.color });
    if (nearest.kind === 'bounds' || nearest.kind === 'obstacle') continue;
    const object = nearest.object;
    if (nearest.kind === 'receiver') {
      if (object.color === ray.color) litReceiverIds.add(object.id);
      continue;
    }
    const state = [nearest.kind, object.id, ray.color, point.x.toFixed(4), point.z.toFixed(4), ray.dx.toFixed(4), ray.dz.toFixed(4)].join(':');
    if (visited.has(state)) continue;
    visited.add(state);
    const emit = (direction, color = ray.color) => queue.push({
      x: point.x + direction.dx * EPSILON * 4,
      z: point.z + direction.dz * EPSILON * 4,
      dx: direction.dx, dz: direction.dz, color,
    });
    if (nearest.kind === 'mirror') {
      hitMirrorIds.add(object.id);
      emit(reflectDirection(ray.dx, ray.dz, mirrorAngle(object)));
    } else if (nearest.kind === 'filter') {
      if (ray.color === 'gold' || ray.color === object.color) emit(ray, object.color);
    } else if (nearest.kind === 'prism') {
      if (ray.color === 'gold') {
        emit({ dx: ray.dz, dz: -ray.dx }, 'blue');
        emit({ dx: -ray.dz, dz: ray.dx }, 'rose');
      } else {
        emit(ray);
      }
    }
  }
  return { segments, litReceiverIds: [...litReceiverIds], hitMirrorIds: [...hitMirrorIds] };
}
