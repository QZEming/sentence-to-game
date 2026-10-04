export function createParticles(THREE, scene) {
  const max = 360;
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, '#fff'); gradient.addColorStop(0.2, '#fff'); gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 32, 32);
  const positions = new Float32Array(max * 3), colors = new Float32Array(max * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size: 0.23, map: new THREE.CanvasTexture(canvas), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const points = new THREE.Points(geometry, material); points.frustumCulled = false; scene.add(points);
  const particles = []; let index = 0;
  for (let i = 0; i < max; i++) { positions[i * 3 + 1] = -1000; particles.push({ life: 0 }); }
  return {
    burst(p, color = 0x73f5ff, count = 18, power = 3) {
      const c = new THREE.Color(color);
      for (let n = 0; n < count; n++) {
        const i = index++ % max;
        particles[i] = { x: p.x, y: p.y + 0.5, z: p.z, vx: (Math.random() - 0.5) * power, vy: Math.random() * power, vz: (Math.random() - 0.5) * power, life: 0.4 + Math.random() * 0.5, color: c };
      }
    },
    update(dt) {
      particles.forEach((p, i) => {
        p.life -= dt;
        if (p.life <= 0) { positions[i * 3 + 1] = -1000; return; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.vy -= dt * 2;
        positions.set([p.x, p.y, p.z], i * 3);
        const fade = Math.min(1, p.life * 3);
        colors.set([p.color.r * fade, p.color.g * fade, p.color.b * fade], i * 3);
      });
      geometry.attributes.position.needsUpdate = true; geometry.attributes.color.needsUpdate = true;
    }
  };
}
