import * as THREE from './vendor/three.module.js';

// The art and collision surface share this function. Village clearings are flat
// so a landed basket stays flush with its destination platform.
const VILLAGE_LAYOUT = [
  { id: 'harbor', name: '松风港', x: 0, z: 0, y: 8, accent: '#b35d42', altitude: '山谷总站' },
  { id: 'willow', name: '溪木村', x: 180, z: -230, y: 25, accent: '#4d8671', altitude: '河谷村落' },
  { id: 'ridge', name: '云脊镇', x: -270, z: -340, y: 69, accent: '#476879', altitude: '高山集市' },
  { id: 'snow', name: '雪顶驿', x: 310, z: 250, y: 91, accent: '#997c63', altitude: '雪山驿站' },
  { id: 'lake', name: '镜湖村', x: -330, z: 170, y: 13, accent: '#678b83', altitude: '湖畔村落' },
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const riverX = (z) => 65 + 70 * Math.sin(z * .0049) + 18 * Math.sin(z * .016 + 1);
const lake = { x: -408, z: 188, rx: 67, rz: 91, water: 3.1 };

export function heightAt(x, z) {
  let h = 15 + 9 * Math.sin(x * .009) * Math.cos(z * .007)
    + 6 * Math.sin(x * .021 + z * .010) + 4 * Math.cos(z * .023 - x * .005);
  h += 55 * Math.exp(-((x + 285) ** 2 / 25000 + (z + 330) ** 2 / 35000));
  h += 83 * Math.exp(-((x - 335) ** 2 / 26500 + (z - 280) ** 2 / 38000));
  h += 35 * Math.exp(-((x - 420) ** 2 / 24000 + (z + 360) ** 2 / 30000));
  const radius = Math.hypot(x, z);
  const rim = smooth(460, 1060, radius);
  h += rim * (205 + 75 * Math.sin(x * .008 + z * .003) + 50 * Math.cos(z * .011 - x * .005));
  h = mix(1.0, h, smooth(12, 39, Math.abs(x - riverX(z))));
  const lakeDistance = Math.hypot((x - lake.x) / lake.rx, (z - lake.z) / lake.rz);
  h = mix(1.1, h, smooth(.88, 1.22, lakeDistance));
  for (const village of VILLAGE_LAYOUT) {
    const d = Math.hypot(x - village.x, z - village.z);
    h = mix(village.y, h, smooth(48, 78, d));
  }
  return h;
}

function seeded(seed = 717) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}

export function createWorld(scene) {
  const random = seeded();
  const root = new THREE.Group();
  root.name = 'Mountain air mail world';
  scene.add(root);
  scene.background = new THREE.Color('#c8e0df');
  scene.fog = new THREE.Fog('#c8e0df', 480, 1750);

  const materials = {};
  const bakedSourceGeometries = new Set();
  const mat = (key, color, options = {}) => materials[key] || (materials[key] = new THREE.MeshStandardMaterial({
    color, roughness: .88, flatShading: true, ...options,
  }));
  const wood = mat('wood', '#8a6440');
  const darkWood = mat('darkWood', '#604632');
  const cream = mat('cream', '#efe4c6');
  const wall = mat('wall', '#e5d7b9');
  const stone = mat('stone', '#acb8a7');
  const iron = mat('iron', '#354842', { metalness: .3 });
  const brass = mat('brass', '#cda967', { metalness: .45, roughness: .48 });
  const glow = mat('glow', '#ffcf78', { emissive: '#ffb84c', emissiveIntensity: .9 });
  const snow = mat('snow', '#eff0dd');
  const unitBox = new THREE.BoxGeometry(1, 1, 1);

  function mesh(geometry, material, parent = root) {
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function box(parent, material, x, y, z, sx, sy, sz) {
    const object = mesh(unitBox, material, parent);
    object.position.set(x, y, z);
    object.scale.set(sx, sy, sz);
    return object;
  }
  function rod(parent, start, end, radius, material, segments = 5) {
    const delta = end.clone().sub(start);
    const object = mesh(new THREE.CylinderGeometry(radius, radius, delta.length(), segments), material, parent);
    object.position.copy(start).add(end).multiplyScalar(.5);
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
    return object;
  }
  // Bake the little architectural pieces by material. Their authored hierarchy
  // stays readable, while the finished towns render in a few dozen draw calls.
  function bakeStatics(groups, destination, excluded = []) {
    destination.updateWorldMatrix(true, true);
    const inverse = destination.matrixWorld.clone().invert();
    const batches = new Map();
    const candidates = [];
    for (const group of groups) group.traverse(object => {
      if (!object.isMesh || object.isInstancedMesh || Array.isArray(object.material) || object.material.vertexColors) return;
      let ancestor = object;
      while (ancestor) {
        if (excluded.includes(ancestor)) return;
        ancestor = ancestor.parent;
      }
      candidates.push(object);
    });
    const vertex = new THREE.Vector3(), normal = new THREE.Vector3();
    for (const object of candidates) {
      const geometry = object.geometry;
      const positions = geometry.attributes.position, normals = geometry.attributes.normal;
      if (!positions || !normals) continue;
      let batch = batches.get(object.material);
      if (!batch) { batch = { positions: [], normals: [], castShadow: false }; batches.set(object.material, batch); }
      batch.castShadow ||= object.castShadow;
      const matrix = inverse.clone().multiply(object.matrixWorld);
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);
      const count = geometry.index ? geometry.index.count : positions.count;
      for (let i = 0; i < count; i++) {
        const index = geometry.index ? geometry.index.getX(i) : i;
        vertex.fromBufferAttribute(positions, index).applyMatrix4(matrix);
        normal.fromBufferAttribute(normals, index).applyMatrix3(normalMatrix).normalize();
        batch.positions.push(vertex.x, vertex.y, vertex.z);
        batch.normals.push(normal.x, normal.y, normal.z);
      }
      bakedSourceGeometries.add(geometry);
      object.removeFromParent();
    }
    for (const [material, batch] of batches) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(batch.positions, 3));
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(batch.normals, 3));
      const object = mesh(geometry, material, destination);
      object.castShadow = batch.castShadow;
    }
  }

  const hemisphere = new THREE.HemisphereLight('#fff2d5', '#6c8878', 2.5);
  scene.add(hemisphere);
  const sunlight = new THREE.DirectionalLight('#ffebc4', 3.3);
  sunlight.position.set(-220, 380, 220);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(2048, 2048);
  Object.assign(sunlight.shadow.camera, { left: -380, right: 380, top: 380, bottom: -380, near: 1, far: 950 });
  sunlight.shadow.normalBias = 1.3;
  sunlight.shadow.bias = -.00025;
  sunlight.shadow.radius = 3;
  sunlight.target.position.set(0, 20, 0);
  scene.add(sunlight, sunlight.target);

  // A generous triangulated landscape keeps the flight view coherent in every direction.
  const terrainGeometry = new THREE.PlaneGeometry(2500, 2500, 180, 180);
  terrainGeometry.rotateX(-Math.PI / 2);
  const positions = terrainGeometry.attributes.position;
  const terrainColors = [];
  const palette = {
    grass: new THREE.Color('#7e9c6b'), meadow: new THREE.Color('#a6b37a'),
    hillside: new THREE.Color('#8b9b75'), cliff: new THREE.Color('#84968c'),
    peak: new THREE.Color('#dce3d8'), shore: new THREE.Color('#bdc394'),
  };
  const workingColor = new THREE.Color();
  for (let i = 0; i < positions.count; i++) {
    let x = positions.getX(i), z = positions.getZ(i);
    if (Math.abs(x) < 1240 && Math.abs(z) < 1240) {
      x += (random() - .5) * 4;
      z += (random() - .5) * 4;
    }
    const y = heightAt(x, z);
    positions.setXYZ(i, x, y, z);
    const texture = .5 + .25 * Math.sin(x * .061 + z * .032) + .25 * Math.sin(z * .083 - x * .025);
    workingColor.copy(palette.grass).lerp(palette.meadow, texture * .65);
    workingColor.lerp(palette.hillside, smooth(35, 120, y));
    workingColor.lerp(palette.cliff, smooth(100, 250, y));
    workingColor.lerp(palette.peak, smooth(205, 290, y + 15 * Math.sin(x * .027)));
    if (Math.abs(x - riverX(z)) < 23 || Math.hypot((x - lake.x) / lake.rx, (z - lake.z) / lake.rz) < 1.12) {
      workingColor.lerp(palette.shore, .65);
    }
    for (const village of VILLAGE_LAYOUT) {
      const d = Math.hypot(x - village.x, z - village.z);
      if (d < 50) workingColor.lerp(new THREE.Color(village.id === 'snow' ? '#d2d3b8' : '#bdbe8b'), .50 * (1 - smooth(35, 50, d)));
    }
    workingColor.multiplyScalar(.94 + random() * .1);
    terrainColors.push(workingColor.r, workingColor.g, workingColor.b);
  }
  terrainGeometry.setAttribute('color', new THREE.Float32BufferAttribute(terrainColors, 3));
  terrainGeometry.computeVertexNormals();
  const terrain = mesh(terrainGeometry, mat('terrain', '#ffffff', { vertexColors: true }));
  terrain.castShadow = false;
  terrain.name = 'Faceted alpine terrain';

  // Both water surfaces sit in carved terrain basins, with pale, irregular shores.
  const waterMat = mat('water', '#669e99', { roughness: .38, metalness: .03, transparent: true, opacity: .88 });
  const waterPositions = [], waterIndices = [];
  for (let i = 0; i <= 180; i++) {
    const z = -1250 + i / 180 * 2500;
    const halfWidth = 12.5 + 2 * Math.sin(z * .031);
    waterPositions.push(riverX(z) - halfWidth, 2.3, z, riverX(z) + halfWidth, 2.3, z);
    if (i < 180) { const n = i * 2; waterIndices.push(n, n + 2, n + 1, n + 1, n + 2, n + 3); }
  }
  const riverGeometry = new THREE.BufferGeometry();
  riverGeometry.setAttribute('position', new THREE.Float32BufferAttribute(waterPositions, 3));
  riverGeometry.setIndex(waterIndices);
  riverGeometry.computeVertexNormals();
  const river = mesh(riverGeometry, waterMat);
  river.castShadow = false;
  const lakeMesh = mesh(new THREE.CircleGeometry(1, 44), waterMat);
  lakeMesh.rotation.x = -Math.PI / 2;
  lakeMesh.scale.set(lake.rx * .99, lake.rz * .99, 1);
  lakeMesh.position.set(lake.x, lake.water, lake.z);
  lakeMesh.castShadow = false;
  const rippleMat = new THREE.LineBasicMaterial({ color: '#d3e8d0', transparent: true, opacity: .32 });
  for (let i = 0; i < 34; i++) {
    const z = -650 + i * 38;
    const x = riverX(z) + (random() - .5) * 13;
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x - 1, 2.39, z - 2), new THREE.Vector3(x + 1.2, 2.39, z), new THREE.Vector3(x + .5, 2.39, z + 5),
    ]), rippleMat);
    root.add(line);
  }

  // Ridgelines add the recognizable pointed silhouettes beyond the playable valley.
  const mountainMats = [mat('mountain0', '#a1b7ae'), mat('mountain1', '#91a99f'), mat('mountain2', '#819d94')];
  for (let i = 0; i < 24; i++) {
    const a = i / 24 * Math.PI * 2 + .05 * random();
    const radius = 900 + random() * 290;
    const x = Math.cos(a) * radius, z = Math.sin(a) * radius;
    const peakHeight = 210 + random() * 280;
    const width = 145 + random() * 180;
    const ground = heightAt(x, z) - 70;
    const peak = mesh(new THREE.ConeGeometry(width, peakHeight, 5), mountainMats[i % 3]);
    peak.position.set(x, ground + peakHeight / 2, z);
    peak.rotation.y = random() * Math.PI;
    peak.castShadow = false;
    const cap = mesh(new THREE.ConeGeometry(width * .33, peakHeight * .33, 5), snow);
    cap.position.set(x, ground + peakHeight * .835, z);
    cap.rotation.y = peak.rotation.y;
    cap.castShadow = false;
  }

  // Forests are instanced: hundreds of trees need only three draw calls.
  const treeCount = 950;
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(.6, .85, 5, 5), darkWood, treeCount);
  const pineMat = mat('pine', '#3c6754');
  const crownLower = new THREE.InstancedMesh(new THREE.ConeGeometry(3.3, 8.5, 6), pineMat, treeCount);
  const crownUpper = new THREE.InstancedMesh(new THREE.ConeGeometry(2.5, 7, 6), pineMat, treeCount);
  const dummy = new THREE.Object3D();
  const pineColor = new THREE.Color();
  let treeIndex = 0;
  for (let tries = 0; treeIndex < treeCount && tries < 16000; tries++) {
    const x = (random() - .5) * 1550, z = (random() - .5) * 1550;
    const y = heightAt(x, z);
    if (Math.hypot(x, z) > 790 || y > 183 || Math.abs(x - riverX(z)) < 35) continue;
    if (Math.hypot((x - lake.x) / lake.rx, (z - lake.z) / lake.rz) < 1.28) continue;
    if (VILLAGE_LAYOUT.some(v => Math.hypot(x - v.x, z - v.z) < 73)) continue;
    const scale = .72 + random() * 1.05;
    const angle = random() * Math.PI * 2;
    dummy.rotation.set(0, angle, 0);
    dummy.scale.set(scale, scale, scale);
    dummy.position.set(x, y + 2.5 * scale, z); dummy.updateMatrix(); trunks.setMatrixAt(treeIndex, dummy.matrix);
    dummy.position.y = y + 7 * scale; dummy.updateMatrix(); crownLower.setMatrixAt(treeIndex, dummy.matrix);
    dummy.position.y = y + 11.2 * scale; dummy.updateMatrix(); crownUpper.setMatrixAt(treeIndex, dummy.matrix);
    pineColor.setHSL(.37 + random() * .035, .22 + random() * .13, .24 + random() * .075);
    crownLower.setColorAt(treeIndex, pineColor);
    crownUpper.setColorAt(treeIndex, pineColor.clone().multiplyScalar(1.06));
    treeIndex++;
  }
  for (const trees of [trunks, crownLower, crownUpper]) {
    trees.count = treeIndex; trees.castShadow = true; trees.receiveShadow = true; root.add(trees);
  }

  const rocks = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), stone, 160);
  let rockIndex = 0;
  for (let i = 0; i < 350 && rockIndex < 160; i++) {
    const x = (random() - .5) * 1500, z = (random() - .5) * 1500;
    if (VILLAGE_LAYOUT.some(v => Math.hypot(x - v.x, z - v.z) < 61)) continue;
    if (heightAt(x, z) < 3.5) continue;
    const scale = 1 + random() * 4;
    dummy.position.set(x, heightAt(x, z) + .55 * scale, z);
    dummy.rotation.set(random(), random() * Math.PI, random());
    dummy.scale.set(scale * 1.4, scale, scale * .9); dummy.updateMatrix();
    rocks.setMatrixAt(rockIndex++, dummy.matrix);
  }
  rocks.count = rockIndex; rocks.castShadow = true; rocks.receiveShadow = true; root.add(rocks);

  function makeHouse(parent, x, z, scale, roofColor, angle = 0, snowy = false) {
    const house = new THREE.Group();
    house.position.set(x, 0, z); house.rotation.y = angle; house.scale.setScalar(scale); parent.add(house);
    box(house, stone, 0, .45, 0, 11, .9, 9);
    box(house, wall, 0, 3.5, 0, 10, 6.2, 8);
    // A roof prism, rather than a cone, gives the settlements their chalet character.
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-6, 0); roofShape.lineTo(0, 4.6); roofShape.lineTo(6, 0); roofShape.closePath();
    const roofGeometry = new THREE.ExtrudeGeometry(roofShape, { depth: 10, bevelEnabled: false });
    const roof = mesh(roofGeometry, mat('roof' + roofColor, roofColor), house);
    roof.position.set(0, 6.3, -5);
    box(house, darkWood, 0, 6.1, 0, 11.7, .5, 9.8);
    box(house, wood, 0, 2.0, 4.06, 2.3, 3.2, .2);
    box(house, cream, 0, 4.6, 4.13, 2.7, .4, .24);
    for (const windowX of [-3.3, 3.3]) {
      box(house, darkWood, windowX, 3.5, 4.08, 2, 2.1, .22);
      box(house, glow, windowX, 3.5, 4.22, 1.48, 1.55, .08);
      box(house, cream, windowX, 3.5, 4.29, .15, 1.7, .09);
      box(house, cream, windowX, 3.5, 4.29, 1.65, .13, .09);
    }
    box(house, darkWood, -5.1, 3.5, 0, .24, 5.7, .25);
    box(house, darkWood, 5.1, 3.5, 0, .24, 5.7, .25);
    box(house, stone, 3, 9.1, -1.5, 1.3, 3.4, 1.4);
    box(house, darkWood, 3, 10.8, -1.5, 1.7, .35, 1.8);
    if (snowy) {
      const snowCap = mesh(roofGeometry, snow, house);
      snowCap.position.copy(roof.position); snowCap.position.y += .23;
      snowCap.scale.set(1.02, 1.01, 1.02);
    }
    return house;
  }

  function makeCrate(parent, x, y, z, size = 2.8) {
    const crate = new THREE.Group(); crate.position.set(x, y, z); parent.add(crate);
    box(crate, mat('crate', '#c59c61'), 0, size * .5, 0, size, size, size);
    for (const side of [-1, 1]) {
      box(crate, wood, 0, size * .5, side * (size * .5 + .02), size + .1, size * .15, .12);
      box(crate, cream, side * size * .23, size * .5, 0, size * .10, size + .06, size + .08);
    }
    return crate;
  }

  const windsocks = [];
  const villageGroups = [];
  const villages = VILLAGE_LAYOUT.map(v => ({ ...v, padY: v.y + .10, landingRadius: 16 }));
  for (const village of villages) {
    const group = new THREE.Group(); group.position.set(village.x, village.y, village.z); root.add(group);
    group.name = village.name; villageGroups.push(group);
    const ground = mesh(new THREE.CylinderGeometry(20.5, 21.8, .7, 40), mat('padBase', '#b5b991'), group);
    ground.position.y = -.35;
    const pad = mesh(new THREE.CylinderGeometry(17.8, 17.8, .20, 40), mat('pad', '#6e8171'), group);
    pad.position.y = 0;
    const ring = mesh(new THREE.RingGeometry(15.8, 16.45, 48), cream, group);
    ring.rotation.x = -Math.PI / 2; ring.position.y = .112; ring.castShadow = false;
    // Landing marking: a simple cross and four approach chevrons remain clear from high above.
    box(group, cream, 0, .121, 0, 10, .025, 1.15);
    box(group, cream, 0, .123, 0, 1.15, .025, 10);
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      const lamp = mesh(new THREE.CylinderGeometry(.65, .8, 1.25, 6), brass, group);
      lamp.position.set(Math.sin(a) * 19.2, .9, Math.cos(a) * 19.2);
      const bulb = mesh(new THREE.SphereGeometry(.53, 6, 4), glow, group);
      bulb.position.copy(lamp.position); bulb.position.y += .75;
    }
    box(group, mat('path', '#c5c29a'), 0, .07, -27, 7.2, .12, 20);
    box(group, materials.path, -24, .06, 8, 22, .12, 5.5);
    makeHouse(group, -29, -23, 1.2, village.accent, .15, village.id === 'snow');
    makeHouse(group, 27, -25, .9, village.accent, -.3, village.id === 'snow');
    makeHouse(group, -33, 15, .8, '#83664e', .7, village.id === 'snow');
    if (village.id === 'harbor' || village.id === 'ridge') makeHouse(group, 6, -39, 1.3, '#a46447', Math.PI, false);
    // A little cargo shed and conspicuous colored canvas awning.
    for (const x of [27, 37]) for (const z of [13, 22]) box(group, wood, x, 4.3, z, .65, 8.6, .65);
    const awning = box(group, mat('awning' + village.accent, village.accent), 32, 8.7, 17.5, 12.5, .4, 11.5);
    awning.rotation.z = .065;
    makeCrate(group, 29.2, 0, 17, 3.0); makeCrate(group, 33, 0, 18.5, 3.4);
    makeCrate(group, 32.7, 3.4, 18.5, 2.7);
    box(group, wood, -22, 2.4, 28, .7, 4.8, .7);
    box(group, mat('sign', '#36554d'), -22, 4.1, 28, 6.8, 2.6, .42);
    for (let i = 0; i < 3; i++) box(group, cream, -23.7 + i * 1.6, 4.1, 28.25, .9, .7, .04);
    // Windsock gives the landing sites an animated, useful sense of wind direction.
    box(group, iron, 23, 6.1, -6, .25, 12.2, .25);
    const sockPivot = new THREE.Group(); sockPivot.position.set(23, 11.8, -6); group.add(sockPivot);
    const sockArm = rod(sockPivot, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.4, .3, 0), .09, iron);
    const sock = new THREE.Group(); sock.position.set(1.3, .3, 0); sockPivot.add(sock);
    for (let i = 0; i < 5; i++) {
      const segment = mesh(new THREE.CylinderGeometry(.73 - i * .075, .68 - i * .075, .83, 9, 1, true), i % 2 ? cream : mat('sock', '#b9664e', { side: THREE.DoubleSide }), sock);
      segment.rotation.z = -Math.PI / 2; segment.position.set(.42 + i * .81, -.05 * i, 0);
    }
    windsocks.push({ pivot: sockPivot, sock, phase: random() * 6 });
    // Timber fences suggest inhabited, cultivated clearings without blocking the pad.
    for (let n = 0; n < 6; n++) {
      const x = -18 + n * 6;
      box(group, wood, x, 1.5, -46, .4, 3, .4);
      if (n < 5) box(group, wood, x + 3, 1.65, -46, 6, .3, .28);
    }
  }

  // Covered cargo bridge across the river, visible immediately after departure.
  const bridgeZ = -75, bridgeX = riverX(bridgeZ), bridgeY = 13;
  const bridge = new THREE.Group(); bridge.position.set(bridgeX, bridgeY, bridgeZ); root.add(bridge);
  box(bridge, darkWood, 0, -.7, 0, 70, 1.4, 7.6);
  for (let i = 0; i < 35; i++) box(bridge, wood, -34 + i * 2, .06, 0, 1.7, .25, 7.7);
  for (const side of [-1, 1]) {
    box(bridge, darkWood, 0, 3.0, side * 3.8, 70, .45, .4);
    for (let i = 0; i < 8; i++) box(bridge, wood, -34 + i * 9.7, 1.5, side * 3.8, .5, 3.5, .5);
    for (const x of [-24, 24]) box(bridge, darkWood, x, -6.5, side * 2.8, 1.1, 13, 1.1);
  }
  bakeStatics([...villageGroups, bridge], root, windsocks.map(sock => sock.pivot));

  // Balloon: twelve broad stitched gores, a wicker basket and suspended cargo.
  const balloon = new THREE.Group(); balloon.name = 'The mountain courier'; root.add(balloon);
  const envelopePosition = [], envelopeColor = [];
  const profile = [[9.7, 2.8], [11.8, 5.4], [15.1, 8.2], [19.2, 10.35], [23, 11], [26.7, 9.8], [29.8, 7.6], [31.9, 4.4], [33, 0.3]];
  const colors = ['#a5463e', '#a5463e', '#eee3c8', '#eee3c8', '#a94d43', '#a94d43', '#e8dcc0', '#e8dcc0'];
  const seamPoints = [];
  for (let side = 0; side < 24; side++) {
    const angleA = side / 24 * Math.PI * 2, angleB = (side + 1) / 24 * Math.PI * 2;
    const c = new THREE.Color(colors[side % colors.length]);
    for (let ring = 0; ring < profile.length - 1; ring++) {
      const [ya, ra] = profile[ring], [yb, rb] = profile[ring + 1];
      const points = [
        [Math.cos(angleA) * ra, ya, Math.sin(angleA) * ra],
        [Math.cos(angleB) * ra, ya, Math.sin(angleB) * ra],
        [Math.cos(angleA) * rb, yb, Math.sin(angleA) * rb],
        [Math.cos(angleB) * rb, yb, Math.sin(angleB) * rb],
      ];
      for (const index of [0, 2, 1, 1, 2, 3]) {
        envelopePosition.push(...points[index]); envelopeColor.push(c.r, c.g, c.b);
      }
      if (side % 2 === 0) seamPoints.push(new THREE.Vector3(...points[0]).multiply(new THREE.Vector3(1.001, 1, 1.001)), new THREE.Vector3(...points[2]).multiply(new THREE.Vector3(1.001, 1, 1.001)));
    }
  }
  const envelopeGeometry = new THREE.BufferGeometry();
  envelopeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(envelopePosition, 3));
  envelopeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(envelopeColor, 3));
  envelopeGeometry.computeVertexNormals();
  mesh(envelopeGeometry, mat('envelope', '#ffffff', { vertexColors: true, roughness: .95, side: THREE.DoubleSide }), balloon);
  balloon.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seamPoints), new THREE.LineBasicMaterial({ color: '#786551', transparent: true, opacity: .28 })));
  const mouth = mesh(new THREE.CircleGeometry(2.78, 24), darkWood, balloon);
  mouth.rotation.x = Math.PI / 2; mouth.position.y = 9.73;
  const collar = mesh(new THREE.TorusGeometry(2.78, .22, 5, 24), darkWood, balloon);
  collar.rotation.x = Math.PI / 2; collar.position.y = 9.75;
  const topCap = mesh(new THREE.SphereGeometry(.65, 8, 5), cream, balloon);
  topCap.scale.y = .25; topCap.position.y = 33;

  const ropeMat = mat('rope', '#c4b388');
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    rod(balloon, new THREE.Vector3(x * 2.7, 2.8, z * 2.3), new THREE.Vector3(x * 2.1, 10.3, z * 2.1), .12, ropeMat);
    rod(balloon, new THREE.Vector3(x * 2.5, 2.4, z * 2.1), new THREE.Vector3(x * 2.5, 6.4, z * 2.1), .12, iron);
  }
  const wicker = mat('wicker', '#b78b52');
  const wickerLight = mat('wickerLight', '#ccaa71');
  box(balloon, darkWood, 0, .20, 0, 5.7, .4, 5.0);
  for (const side of [-1, 1]) {
    box(balloon, wicker, side * 2.73, 1.65, 0, .32, 2.8, 4.95);
    box(balloon, wicker, 0, 1.65, side * 2.33, 5.5, 2.8, .32);
    box(balloon, darkWood, side * 2.76, 3.05, 0, .46, .42, 5.1);
    box(balloon, darkWood, 0, 3.05, side * 2.4, 5.9, .42, .46);
    for (let i = 0; i < 5; i++) {
      box(balloon, wickerLight, side * 2.91, .55 + i * .48, 0, .06, .09, 4.65);
      box(balloon, wickerLight, 0, .55 + i * .48, side * 2.50, 5.4, .09, .06);
    }
    for (let i = 0; i < 7; i++) box(balloon, wood, -2.42 + i * .8, 1.60, side * 2.52, .07, 2.65, .07);
    for (let i = 0; i < 6; i++) box(balloon, wood, side * 2.94, 1.60, -2 + i * .8, .07, 2.65, .07);
  }
  // External sandbags make changes of load visually plausible.
  for (const x of [-2, 0, 2]) {
    const bag = mesh(new THREE.SphereGeometry(.53, 7, 5), mat('sandbag', '#d0ba86'), balloon);
    bag.scale.set(.95, 1.5, .75); bag.position.set(x, 1.95, 2.83);
    rod(balloon, new THREE.Vector3(x, 2.7, 2.84), new THREE.Vector3(x, 3.2, 2.3), .055, ropeMat);
  }
  box(balloon, iron, 0, 6.45, 0, 5.1, .22, .32);
  const burnerHead = mesh(new THREE.CylinderGeometry(.70, .85, .7, 8), iron, balloon);
  burnerHead.position.y = 6.4;
  const flame = new THREE.Group(); flame.position.y = 6.85; balloon.add(flame);
  const flameOuter = mesh(new THREE.ConeGeometry(.84, 3, 7), new THREE.MeshBasicMaterial({ color: '#ffb23f', transparent: true, opacity: .83 }), flame);
  flameOuter.position.y = 1.3;
  const flameCore = mesh(new THREE.ConeGeometry(.46, 2.4, 6), new THREE.MeshBasicMaterial({ color: '#fff1b3' }), flame);
  flameCore.position.y = 1;
  const fireLight = new THREE.PointLight('#ff9c36', 0, 22, 2); fireLight.position.y = 8; balloon.add(fireLight);
  const cargo = new THREE.Group(); balloon.add(cargo);
  const cargoItems = [];
  for (let i = 0; i < 6; i++) {
    const crate = makeCrate(cargo, -.8 + (i % 2) * 1.75, .42 + Math.floor(i / 4) * 1.6, -.9 + (Math.floor(i / 2) % 2) * 1.75, 1.55);
    cargoItems.push(crate);
  }
  const pilot = new THREE.Group(); pilot.position.set(-1.7, .7, -.85); balloon.add(pilot);
  box(pilot, mat('pilotCoat', '#436956'), 0, 2.05, 0, 1.0, 1.8, .7);
  const pilotHead = mesh(new THREE.SphereGeometry(.50, 8, 6), mat('skin', '#d5a577'), pilot);
  pilotHead.position.y = 3.3;
  const pilotCap = mesh(new THREE.SphereGeometry(.53, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), cream, pilot);
  pilotCap.position.y = 3.38;
  box(pilot, cream, 0, 3.44, -.27, 1.1, .11, .8);
  bakeStatics([balloon], balloon, [flame, cargo, pilot]);
  for (const crate of cargoItems) bakeStatics([crate], crate);

  const clouds = new THREE.Group(); clouds.name = 'Passing cloud islands'; root.add(clouds);
  const cloudMaterial = mat('cloud', '#f0eee2', { transparent: true, opacity: .76, depthWrite: false });
  const cloudGeometry = new THREE.IcosahedronGeometry(1, 1);
  const cloudGroups = [];
  for (let i = 0; i < 18; i++) {
    const cluster = new THREE.Group();
    const angle = i / 18 * Math.PI * 2, distance = 340 + random() * 780;
    cluster.position.set(Math.cos(angle) * distance, 205 + random() * 160, Math.sin(angle) * distance);
    const baseX = cluster.position.x;
    for (let puff = 0; puff < 5; puff++) {
      const object = mesh(cloudGeometry, cloudMaterial, cluster);
      const size = 12 + random() * 15;
      object.scale.set(size * (1.3 + random()), size * .6, size);
      object.position.set((puff - 2) * 21, random() * 6, (random() - .5) * 14);
      object.castShadow = false; object.receiveShadow = false;
    }
    clouds.add(cluster);
    bakeStatics([cluster], cluster);
    cluster.traverse(object => { if (object.isMesh) object.receiveShadow = false; });
    cloudGroups.push({ object: cluster, x: baseX, phase: random() * 6 });
  }

  const birds = new THREE.Group(); root.add(birds);
  const birdMaterial = mat('bird', '#49615a');
  const birdGeometry = new THREE.BufferGeometry();
  birdGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, -.15, -2, .3, 0, -.5, 0, .5, 0, 0, -.15, .5, 0, .5, 2, .3, 0], 3));
  birdGeometry.computeVertexNormals(); birdMaterial.side = THREE.DoubleSide;
  const birdFlock = [];
  for (let i = 0; i < 10; i++) {
    const bird = mesh(birdGeometry, birdMaterial, birds); bird.castShadow = false;
    birdFlock.push({ object: bird, phase: i * .51, offset: i * 3.1 });
  }

  let elapsed = 0;
  let burning = false;
  function updateBalloon(state) {
    balloon.position.set(state.x || 0, state.y ?? 8, state.z || 0);
    balloon.rotation.set(state.pitch || 0, state.heading || 0, state.roll || 0, 'YXZ');
    burning = Boolean(state.burner);
    flame.visible = burning;
    fireLight.intensity = burning ? 9 : 0;
    const count = clamp(Math.ceil(state.cargoCount ?? 0), 0, cargoItems.length);
    cargoItems.forEach((item, i) => { item.visible = i < count; });
  }
  function update(time, dt) {
    elapsed = Number.isFinite(time) ? time : elapsed + (dt || .016);
    for (const sock of windsocks) {
      sock.pivot.rotation.y = .35 + Math.sin(elapsed * .17 + sock.phase) * .38;
      sock.sock.rotation.z = Math.sin(elapsed * 3.3 + sock.phase) * .035 - .04;
    }
    for (const cloud of cloudGroups) {
      cloud.object.position.x = cloud.x + Math.sin(elapsed * .011 + cloud.phase) * 45;
    }
    for (const bird of birdFlock) {
      const phase = elapsed * .055 + bird.phase * .12;
      bird.object.position.set(-115 + Math.cos(phase) * (110 + bird.offset), 86 + Math.sin(elapsed * .3 + bird.phase) * 3 + bird.offset * .4, -160 + Math.sin(phase) * (75 + bird.offset));
      bird.object.rotation.set(Math.sin(elapsed * 5 + bird.phase) * .12, -phase, .1);
      bird.object.scale.y = .6 + Math.sin(elapsed * 5 + bird.phase) * .5;
    }
    if (burning) {
      flame.scale.set(.9 + Math.sin(elapsed * 28) * .1, .9 + Math.sin(elapsed * 34) * .16, .9 + Math.cos(elapsed * 25) * .1);
      fireLight.intensity = 8 + Math.sin(elapsed * 27) * 2;
    }
  }
  function dispose() {
    const geometries = new Set(), allMaterials = new Set();
    root.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => allMaterials.add(material));
    });
    geometries.forEach(geometry => geometry.dispose());
    bakedSourceGeometries.forEach(geometry => { if (!geometries.has(geometry)) geometry.dispose(); });
    allMaterials.forEach(material => material.dispose());
    scene.remove(root, hemisphere, sunlight, sunlight.target);
    sunlight.shadow.dispose();
  }
  updateBalloon({ x: 0, y: 8.8, z: 0, cargoCount: 4 });
  return { root, heightAt, villages, update, balloon, updateBalloon, clouds, terrain, river,
    balloonParts: { flame, cargo, cargoItems, envelopeGeometry, pilot }, lighting: { sunlight, hemisphere }, dispose };
}
