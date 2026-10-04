/** A complete, texture-free derelict station course. World units are metres. */
export function createWorld(THREE, scene) {
  const platforms = [], hazards = [], pickups = [], checkpoints = [];
  const animated = [], pickupMotion = [], hazardMotion = [];
  const clockRings = [];
  const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
  scene.background = new THREE.Color(0x040812);
  scene.fog = new THREE.FogExp2(0x040b17, 0.0058);

  const metal = new THREE.MeshStandardMaterial({ color: 0x283944, metalness: .72, roughness: .48 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x101c27, metalness: .75, roughness: .55 });
  const deck = new THREE.MeshStandardMaterial({ color: 0x71848b, metalness: .52, roughness: .68 });
  const deckDark = new THREE.MeshStandardMaterial({ color: 0x3f515b, metalness: .6, roughness: .6 });
  const orange = new THREE.MeshStandardMaterial({ color: 0xc16932, metalness: .45, roughness: .6 });
  const cyan = new THREE.MeshStandardMaterial({ color: 0x72f8ff, emissive: 0x0bc2e5, emissiveIntensity: 1.8, metalness: .2, roughness: .35 });
  const blue = new THREE.MeshStandardMaterial({ color: 0x86abff, emissive: 0x245beb, emissiveIntensity: 2, roughness: .25 });
  const amber = new THREE.MeshStandardMaterial({ color: 0xffbf5b, emissive: 0xed7415, emissiveIntensity: 1.8, roughness: .3 });
  const green = new THREE.MeshStandardMaterial({ color: 0xa1ffe6, emissive: 0x37dfa7, emissiveIntensity: 1.6, roughness: .3 });
  const boltGeometry = new THREE.CylinderGeometry(.055, .055, .06, 5);

  function box(w, h, d, material, x = 0, y = 0, z = 0, parent = scene) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function tube(radius, width, material, x, y, z, parent = scene, arc = Math.PI * 2) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, width, 6, 64, arc), material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  function cylinder(rt, rb, h, material, x, y, z, parent = scene, sides = 12) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, sides), material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  function sign(text, sub, x, y, z, width = 8, accent = '#73f1ff', parent = scene) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a1825'; ctx.fillRect(0, 0, 1024, 256);
    ctx.fillStyle = accent; ctx.fillRect(0, 0, 9, 256);
    ctx.strokeStyle = '#425767'; ctx.lineWidth = 3; ctx.strokeRect(22, 14, 989, 226);
    ctx.fillStyle = accent; ctx.font = '700 66px Arial, sans-serif'; ctx.fillText(text, 48, 105);
    ctx.fillStyle = '#95aebd'; ctx.font = '500 31px Arial, sans-serif'; ctx.fillText(sub, 50, 178);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 4), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
    mesh.position.set(x, y, z); parent.add(mesh);
    return mesh;
  }

  function platform(x, top, z, w, d, type = 'solid', region = 0) {
    const h = type === 'moving' ? 1.05 : 1.4;
    const mesh = box(w, h, d, metal, x, top - h / 2, z);
    mesh.castShadow = true;
    const glow = region === 1 ? amber : region === 2 ? blue : cyan;
    // Deck plates leave seams so speed and depth remain legible.
    const plateCount = Math.max(2, Math.round(w / 2.5));
    for (let i = 0; i < plateCount; i++) {
      const pw = (w - .7) / plateCount;
      box(pw - .07, .08, d - .8, i % 2 ? deckDark : deck,
        -w / 2 + .35 + pw * (i + .5), h / 2 + .04, 0, mesh);
    }
    box(.17, .13, d - .7, glow, -w / 2 + .25, h / 2 + .085, 0, mesh);
    box(.17, .13, d - .7, glow, w / 2 - .25, h / 2 + .085, 0, mesh);
    box(w - .7, .13, .17, glow, 0, h / 2 + .085, -d / 2 + .25, mesh);
    box(w - .7, .13, .17, glow, 0, h / 2 + .085, d / 2 - .25, mesh);
    box(w + .22, .38, .25, dark, 0, -h / 2 + .15, -d / 2, mesh);
    box(w + .22, .38, .25, dark, 0, -h / 2 + .15, d / 2, mesh);
    for (const sx of [-1, 1]) {
      box(.3, .55, d * .52, dark, sx * (w / 2 + .04), -.12, 0, mesh);
      box(.32, .18, .85, glow, sx * (w / 2 + .07), -.18, -d * .22, mesh);
      for (const sz of [-1, 1]) {
        const bolt = new THREE.Mesh(boltGeometry, dark);
        bolt.position.set(sx * (w / 2 - .5), h / 2 + .09, sz * (d / 2 - .5));
        mesh.add(bolt);
      }
    }
    // Under-deck supports give the floating platforms physical weight.
    const support = cylinder(.65, .3, 3.5, dark, 0, -h / 2 - 1.75, 0, mesh);
    support.rotation.z = .12;
    const result = { mesh, w, h, d, type, baseY: mesh.position.y, top, region };
    platforms.push(result);
    return result;
  }

  const layout = [
    [0, 0, 0, 12, 18],
    [-1, .5, -16, 8, 8],
    [3, 1.1, -29, 8, 9],
    [-3, 1.1, -42, 9, 9],
    [-2, 1.8, -54, 8, 7, 'moving'],
    [2, 1, -66, 9, 9],
    [0, .5, -80, 13, 14],
    [-3, 1.3, -94, 9, 8, 'solid', 1],
    [-3, 2.2, -108, 9, 10, 'solid', 1],
    [3, 1.5, -123, 10, 11, 'solid', 1],
    [-3, .8, -137, 10, 10, 'solid', 1],
    [0, .8, -153, 13, 14, 'solid', 1],
    [-3, 1.2, -168, 9, 9, 'solid', 2],
    [3, 2, -181, 10, 9, 'solid', 2],
    [0, 1.4, -194, 9, 8, 'moving', 2],
    [-3, .5, -207, 11, 10, 'solid', 2],
    [0, 0, -222, 15, 16, 'solid', 2],
  ];
  layout.forEach(args => platform(...args));
  // Optional launch pad branches right from the final checkpoint.
  const boostPad = platform(9, 1.3, -169, 4.4, 6, 'bounce', 2);
  const boostRing = tube(1.45, .06, blue, 9, 1.46, -169);
  boostRing.rotation.x = Math.PI / 2;
  for (const side of [-1, 1]) {
    const chevron = box(.12, .04, 1.6, cyan, 9 + side * .5, 1.48, -169);
    chevron.rotation.y = side * .68;
  }
  sign('BOOST', 'OPTIONAL ROUTE', 10.2, 4.6, -172, 4.4, '#a8b5ff');
  for (const index of [4, 14]) {
    const p = platforms[index], origin = p.mesh.position.clone();
    const amplitude = index === 4 ? 2.6 : 2.4;
    animated.push((t) => { p.mesh.position.x = origin.x + Math.sin(t * .72 + index) * amplitude; });
    const rail = box(amplitude * 2 + 2, .28, .28, metal, origin.x, origin.y - 3, origin.z);
    box(amplitude * 2 + 2, .045, .06, index === 4 ? cyan : blue, origin.x, rail.position.y + .17, origin.z);
  }

  function pickup(type, x, y, z, label = '') {
    const mat = type === 'core' ? amber : type === 'log' ? blue : cyan;
    const geometry = type === 'core' ? new THREE.IcosahedronGeometry(.55, 0)
      : type === 'log' ? new THREE.OctahedronGeometry(.35, 0) : new THREE.OctahedronGeometry(.23, 0);
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z); scene.add(mesh);
    if (type === 'core') {
      const ring = tube(.84, .04, mat, 0, 0, 0, mesh); ring.rotation.x = Math.PI / 2;
      const ring2 = tube(.84, .024, mat, 0, 0, 0, mesh); ring2.rotation.y = Math.PI / 2;
      const plinth = cylinder(.95, 1.15, .2, dark, x, y - 1.45, z);
      tube(.8, .04, mat, 0, .12, 0, plinth).rotation.x = Math.PI / 2;
    }
    const item = { mesh, type, value: type === 'core' ? 500 : type === 'log' ? 150 : 25, label };
    pickups.push(item); pickupMotion.push({ mesh, y, seed: pickups.length * .73, type });
    return item;
  }
  // Strings of energy guide each jump without forcing a narrow landing.
  platforms.forEach((p, i) => {
    if (p.type === 'moving' || i === 16) return;
    for (const frac of [.26, -.24]) {
      pickup('cell', p.mesh.position.x + (i % 2 ? .8 : -.8), p.top + 1, p.mesh.position.z + p.d * frac);
    }
  });
  pickup('core', -3, 2.8, -42, '停泊舱导航核心');
  pickup('core', 3, 3.2, -123, '反应堆能源核心');
  pickup('core', -3, 2.2, -207, '遗迹通讯核心');
  pickup('log', 4.7, 1.1, 1.5, '维修记录 01：撤离完成。R-07，如果你醒来，请跟着蓝色的灯走。');
  pickup('log', 4.3, 1.8, -80, '事故记录 02：重力环已经断裂。备用核心还在，我们给你留了一艘船。');
  pickup('log', -4.2, 2.1, -153, '航行记录 03：你不是被遗忘的机器。带上我们的星图，回家吧。');

  function checkpoint(index, x, top, z, name) {
    const mesh = new THREE.Group(); mesh.position.set(x, top, z); scene.add(mesh);
    const ring = tube(1.24, .055, cyan, 0, .12, 0, mesh); ring.rotation.x = Math.PI / 2;
    const pad = cylinder(1.1, 1.2, .12, dark, 0, .04, 0, mesh, 32);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x4ddcff, transparent: true, opacity: .085, depthWrite: false, side: THREE.DoubleSide });
    cylinder(1.02, 1.02, 3.2, beamMat, 0, 1.65, 0, mesh, 24);
    for (let j = 0; j < 3; j++) {
      const light = box(.09, .11, .46, cyan, -.55 + j * .55, .15, -.05, mesh);
      light.rotation.y = -.45;
    }
    checkpoints.push({ mesh, spawn: v3(x, top + .05, z), index, name });
  }
  checkpoint(0, 0, 0, 4, '停泊舱 / DOCK 07');
  checkpoint(1, 0, .5, -77.5, '反应堆 / REACTOR');
  checkpoint(2, 0, .8, -150.5, '失重遗迹 / THE DRIFT');

  function laser(p, z, phase = 0) {
    const x = p.mesh.position.x, y = p.top + .9;
    const material = new THREE.MeshStandardMaterial({ color: 0xff727c, emissive: 0xff143d, emissiveIntensity: 3, transparent: true, opacity: .96 });
    const mesh = box(p.w - .6, .16, .19, material, x, y, z);
    const haze = box(p.w - .6, .38, .25, new THREE.MeshBasicMaterial({ color: 0xff174a, opacity: .12, transparent: true, depthWrite: false }), 0, 0, 0, mesh);
    const indicators = [];
    for (const side of [-1, 1]) {
      box(.35, 1.5, .52, dark, x + side * (p.w / 2 - .25), p.top + .75, z);
      indicators.push(box(.4, .24, .6, material, x + side * (p.w / 2 - .25), y, z));
    }
    const hazard = { mesh, w: p.w - .6, h: .16, d: .19, type: 'laser', active: true };
    hazards.push(hazard);
    hazardMotion.push((t) => {
      const cycle = (t + phase) % 5.2;
      hazard.active = cycle < 2.7;
      mesh.visible = hazard.active;
      material.emissiveIntensity = hazard.active ? 2.5 + Math.sin(t * 20) * .4 : .1;
      material.color.setHex(hazard.active ? 0xff727c : 0x29545b);
    });
  }
  laser(platforms[2], -29, .5);
  laser(platforms[7], -94, 2.1);
  laser(platforms[13], -181, 1.3);

  function crusher(p, z, phase) {
    const x = p.mesh.position.x;
    const mesh = box(4.1, 1.5, 2.8, metal, x, p.top + 7, z);
    mesh.castShadow = true;
    box(4.2, .12, 2.9, amber, 0, -.73, 0, mesh);
    box(2.2, 1.1, 2.9, orange, 0, -.1, 0, mesh);
    const piston = cylinder(.26, .26, 5.1, deckDark, x, p.top + 6.7, z);
    for (const side of [-1, 1]) box(.42, 8, .65, metal, x + side * (p.w / 2 - .4), p.top + 4, z);
    box(p.w + .5, .65, 1, metal, x, p.top + 8, z);
    const mark = box(4.4, .015, 3.1, new THREE.MeshBasicMaterial({ color: 0xff793f, transparent: true, opacity: .22 }), x, p.top + .095, z);
    const hazard = { mesh, w: 4.1, h: 1.5, d: 2.8, type: 'crusher', active: false };
    hazards.push(hazard);
    hazardMotion.push((t) => {
      const c = (t + phase) % 6.3;
      let down = 0;
      if (c > 2.3 && c < 2.7) down = (c - 2.3) / .4;
      else if (c >= 2.7 && c < 3.75) down = 1;
      else if (c >= 3.75 && c < 5.1) down = 1 - (c - 3.75) / 1.35;
      mesh.position.y = p.top + 6.3 - down * 5.48;
      hazard.active = down > .62;
      mark.material.opacity = c > 1.65 && c < 3.8 ? .4 + Math.sin(t * 18) * .12 : .12;
      piston.scale.y = Math.max(.08, (p.top + 8 - mesh.position.y) / 5.1);
      piston.position.y = (p.top + 8 + mesh.position.y) / 2;
    });
  }
  crusher(platforms[8], -108, 0);
  crusher(platforms[10], -136.7, 2.7);

  // Dock skeleton: open ribs frame the stars without hiding the course.
  for (let i = 0; i < 5; i++) {
    const z = 3 - i * 18;
    for (const side of [-1, 1]) {
      box(1.2, 23, 1.1, metal, side * 15, 4.5, z);
      const diagonal = box(.7, 9, .7, dark, side * 12.5, 14.5, z);
      diagonal.rotation.z = side * .65;
      box(.18, 8, .13, cyan, side * 14.34, 5, z + .57);
      box(1.8, 2.4, 3, dark, side * 15, -5, z);
    }
    box(29.6, 1.3, 1.1, metal, 0, 18.6, z);
    box(15, .16, .13, cyan, 0, 17.88, z + .57);
  }
  for (const side of [-1, 1]) {
    box(1, 1.3, 85, metal, side * 15, -7, -33);
    box(.3, .3, 85, cyan, side * 14.6, -6.28, -33);
    box(1.1, .7, 84, dark, side * 15, 17.6, -34);
    // Incomplete hull panels leave generous windows onto the nebula.
    for (let i = 0; i < 4; i++) {
      box(.3, 8, 9, dark, side * 16.2, -1, -12 - i * 20);
    }
  }
  sign('ORBITAL / 07', 'DEEP SPACE RESEARCH · ABANDONED', -8.2, 6.7, -7, 10);
  sign('01  /  DOCK', 'FOLLOW THE BLUE LIGHT', 8.6, 4.8, -44, 7);
  sign('02  /  REACTOR', 'CAUTION · UNSTABLE POWER', 7.8, 6.2, -86, 9, '#ffbc6a');
  sign('03  /  THE DRIFT', 'ESCAPE POD · 70 METRES', -8.8, 5.3, -157, 8, '#a8b5ff');

  // The exposed reactor is a huge sequence of segmented rings.
  for (let k = 0; k < 3; k++) {
    const z = -104 - k * 15;
    tube(19, .72, metal, 0, 3, z);
    tube(17.7, .15, orange, 0, 3, z);
    const rotor = new THREE.Group(); rotor.position.set(0, 3, z); scene.add(rotor);
    for (let j = 0; j < 8; j++) {
      const arc = tube(18.2, .1, amber, 0, 0, 0, rotor, .36);
      arc.rotation.z = j * Math.PI / 4;
      const a = j * Math.PI / 4;
      const block = box(1.25, 2.6, 2.2, dark, Math.cos(a) * 19, Math.sin(a) * 19, 0, rotor);
      block.rotation.z = a - Math.PI / 2;
    }
    clockRings.push({ mesh: rotor, speed: k % 2 ? -.045 : .035 });
  }
  cylinder(2, 2, 23, dark, 14, 2, -118, scene, 20);
  cylinder(1.34, 1.34, 23.4, new THREE.MeshStandardMaterial({ color: 0xffbe4c, emissive: 0xff651b, emissiveIntensity: 2.8, roughness: .2 }), 14, 2, -118, scene, 20);
  for (let j = 0; j < 7; j++) {
    const ring = tube(2.2, .2, metal, 14, -8 + j * 3.5, -118); ring.rotation.x = Math.PI / 2;
  }
  const reactorLight = new THREE.PointLight(0xff7a30, 22, 40, 2); reactorLight.position.set(10, 7, -117); scene.add(reactorLight);

  // Shattered orbital rings and drifting hull in the final open-air section.
  for (let i = 0; i < 3; i++) {
    const ring = tube(22 - i, .55, metal, i % 2 ? 4 : -4, 5 + i * 3, -171 - i * 22, scene, Math.PI * 1.3);
    ring.rotation.set(.12 * i, -.1 * i, 1.4 + i * .9);
    const line = tube(21.5 - i, .07, blue, ring.position.x, ring.position.y, ring.position.z, scene, Math.PI * 1.2);
    line.rotation.copy(ring.rotation);
  }
  // Seeded debris and star positions make screenshots and retries reproducible.
  let seed = 90713;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  const debrisGeometry = new THREE.BoxGeometry(1, 1, 1);
  const debris = new THREE.InstancedMesh(debrisGeometry, dark, 95);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 95; i++) {
    const side = rand() > .5 ? 1 : -1;
    dummy.position.set(side * (11 + rand() * 35), -6 - rand() * 21, 22 - rand() * 287);
    dummy.scale.set(1 + rand() * 6, .4 + rand() * 2.5, 1 + rand() * 8);
    dummy.rotation.set(rand() * 3, rand() * 3, rand() * 3); dummy.updateMatrix(); debris.setMatrixAt(i, dummy.matrix);
  }
  scene.add(debris);
  const starPositions = new Float32Array(1600 * 3), starColors = new Float32Array(1600 * 3);
  for (let i = 0; i < 1600; i++) {
    starPositions[i * 3] = (rand() - .5) * 1000;
    starPositions[i * 3 + 1] = (rand() - .38) * 620;
    starPositions[i * 3 + 2] = -150 + (rand() - .5) * 950;
    const warm = rand(); starColors[i * 3] = .62 + warm * .38;
    starColors[i * 3 + 1] = .72 + warm * .22; starColors[i * 3 + 2] = 1;
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ size: .6, vertexColors: true, transparent: true, opacity: .85, sizeAttenuation: true, fog: false, depthWrite: false })));

  const planet = new THREE.Mesh(new THREE.SphereGeometry(63, 48, 32), new THREE.MeshStandardMaterial({ color: 0x365267, metalness: .08, roughness: .95, emissive: 0x061523, emissiveIntensity: .7, fog: false }));
  planet.position.set(-119, 37, -283); scene.add(planet);
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(64.7, 48, 32), new THREE.MeshBasicMaterial({ color: 0x71c8e8, transparent: true, opacity: .08, side: THREE.BackSide, depthWrite: false, fog: false }));
  atmosphere.position.copy(planet.position); scene.add(atmosphere);
  const planetRing = new THREE.Mesh(new THREE.RingGeometry(78, 99, 96), new THREE.MeshBasicMaterial({ color: 0x597787, transparent: true, opacity: .32, side: THREE.DoubleSide, fog: false, depthWrite: false }));
  planetRing.position.copy(planet.position); planetRing.rotation.set(1.12, .18, -.42); scene.add(planetRing);

  // Escape gate: a vertical silhouette visible well before the last jump.
  const goalMesh = new THREE.Group(); goalMesh.position.set(0, 0, -225); scene.add(goalMesh);
  for (const side of [-1, 1]) {
    box(.85, 6.5, 1.6, metal, side * 3.2, 3.25, 0, goalMesh);
    box(.16, 5.4, 1.68, green, side * 2.72, 3.1, 0, goalMesh);
    box(1.4, 1.1, 2.1, dark, side * 3.2, .55, 0, goalMesh);
  }
  box(7.2, .9, 1.6, metal, 0, 6.45, 0, goalMesh);
  box(5.3, .14, 1.65, green, 0, 5.95, 0, goalMesh);
  box(5.5, .04, 1.9, green, 0, .14, 0, goalMesh);
  const portal = new THREE.Mesh(new THREE.PlaneGeometry(5.3, 5.5), new THREE.MeshBasicMaterial({ color: 0x4cdbbf, transparent: true, opacity: .1, side: THREE.DoubleSide, depthWrite: false }));
  portal.position.set(0, 3.1, 0); goalMesh.add(portal);
  sign('EXODUS / RESCUE', 'INSERT 3 CORES · RETURN HOME', 0, 7.9, 0, 9, '#95ffe2', goalMesh);
  const goal = { mesh: goalMesh, position: v3(0, 0, -224) };
  const escapeLight = new THREE.PointLight(0x66ffdd, 13, 18, 2); escapeLight.position.set(0, 4, -224); scene.add(escapeLight);

  function update(t, dt) {
    animated.forEach(fn => fn(t, dt));
    hazardMotion.forEach(fn => fn(t, dt));
    for (const item of pickupMotion) {
      item.mesh.position.y = item.y + Math.sin(t * 2.5 + item.seed) * (item.type === 'core' ? .2 : .13);
      item.mesh.rotation.y = t * (item.type === 'core' ? .7 : 1.7) + item.seed;
      if (item.type === 'core') item.mesh.rotation.z = Math.sin(t * 1.2) * .15;
    }
    for (const item of clockRings) item.mesh.rotation.z = t * item.speed;
    portal.material.opacity = .08 + (Math.sin(t * 2) + 1) * .035;
  }
  update(0, 0);
  return { platforms, hazards, pickups, checkpoints, goal, update, totalCores: 3 };
}
