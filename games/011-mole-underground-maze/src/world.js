import * as THREE from 'three';

export const TILE = 2.2;

const key = (x, z) => `${x},${z}`;
function seededRandom(seed) {
  return () => {
    let n = (seed += 0x6d2b79f5);
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

/** All coordinates in the returned game data are cells; scene positions use TILE. */
export function createWorld(scene, level = 1) {
  const random = seededRandom(19873 + level * 4769);
  const root = new THREE.Group();
  root.name = 'The Hollow — underground world';
  scene.add(root);
  const geometries = new Set();
  const materials = new Set();
  const geo = (geometry) => (geometries.add(geometry), geometry);
  const mat = (parameters) => {
    const material = new THREE.MeshStandardMaterial(parameters);
    materials.add(material);
    return material;
  };
  const basic = (parameters) => {
    const material = new THREE.MeshBasicMaterial(parameters);
    materials.add(material);
    return material;
  };
  const mesh = (geometry, material, parent = root) => {
    const result = new THREE.Mesh(geometry, material);
    result.castShadow = true;
    result.receiveShadow = true;
    parent.add(result);
    return result;
  };
  const box = geo(new THREE.BoxGeometry(1, 1, 1));
  const sphere = geo(new THREE.SphereGeometry(1, 10, 7));
  const pebble = geo(new THREE.DodecahedronGeometry(1, 0));
  const cylinder = geo(new THREE.CylinderGeometry(1, 1, 1, 8));
  const cone = geo(new THREE.ConeGeometry(1, 1, 7));
  const crystal = geo(new THREE.OctahedronGeometry(1, 0));
  const ringGeometry = geo(new THREE.TorusGeometry(1, 0.035, 5, 28));
  const white = mat({ color: '#d5f9de', roughness: 0.6 });
  const wood = mat({ color: '#6a4c32', roughness: 1 });
  const woodLight = mat({ color: '#ad8250', roughness: 0.95 });
  const iron = mat({ color: '#303b3b', metalness: 0.7, roughness: 0.5 });
  const gold = mat({ color: '#eab650', metalness: 0.55, roughness: 0.35 });
  const moss = mat({ color: '#537c49', roughness: 1, flatShading: true });
  const mossDark = mat({ color: '#314b37', roughness: 1, flatShading: true });
  const glowCyan = mat({ color: '#90ffff', emissive: '#25d8bc', emissiveIntensity: 1.15, roughness: 0.25, metalness: 0.18, flatShading: true });
  const glowTurquoise = mat({ color: '#60d8b6', emissive: '#29c6ac', emissiveIntensity: 0.48, roughness: 0.4, flatShading: true });
  const glowAmber = mat({ color: '#ffe7a4', emissive: '#ffc766', emissiveIntensity: 1.4, roughness: 0.32 });
  const glowPink = mat({ color: '#f3bec9', emissive: '#c975a4', emissiveIntensity: 0.35, roughness: 0.55 });
  const mushroomStem = mat({ color: '#92b4a1', roughness: 1 });
  const darkStone = mat({ color: '#273d36', roughness: 1, flatShading: true });
  const stoneTones = ['#344940', '#3b5147', '#31473e', '#42564a', '#2c4039'].map((color) => mat({ color, roughness: 1, flatShading: true }));
  const dirtTones = ['#775b43', '#88694b', '#68533f'].map((color) => mat({ color, roughness: 1, flatShading: true }));
  const groundTones = ['#435548', '#45584a', '#405346', '#495b4c', '#3c5145', '#465449'].map((color) => mat({ color, roughness: 1 }));
  const glowGround = basic({ color: '#5bc7a2', transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide });
  const size = 25;
  const grid = Array.from({ length: size }, () => Array(size).fill(1));
  const stack = [[1, 1]];
  grid[1][1] = 0;
  while (stack.length) {
    const [x, z] = stack[stack.length - 1];
    const options = [[2, 0], [-2, 0], [0, 2], [0, -2]].filter(([dx, dz]) => x + dx > 0 && x + dx < size - 1 && z + dz > 0 && z + dz < size - 1 && grid[z + dz][x + dx] === 1);
    if (!options.length) { stack.pop(); continue; }
    const [dx, dz] = options[Math.floor(random() * options.length)];
    grid[z + dz / 2][x + dx / 2] = 0;
    grid[z + dz][x + dx] = 0;
    stack.push([x + dx, z + dz]);
  }
  for (let z = 9; z <= 17; z++) for (let x = 8; x <= 16; x++) grid[z][x] = 0;
  // Small pockets make the tunnels feel excavated rather than mathematically regular.
  for (const [cx, cz] of [[5, 5], [19, 19], [20, 5], [5, 19]]) {
    for (let z = cz - 1; z <= cz + 1; z++) for (let x = cx - 1; x <= cx + 1; x++) grid[z][x] = 0;
  }
  for (let z = 1; z < size - 1; z++) for (let x = 1; x < size - 1; x++) {
    if (grid[z][x] === 1 && ((grid[z][x - 1] === 0 && grid[z][x + 1] === 0) || (grid[z - 1][x] === 0 && grid[z + 1][x] === 0)) && random() < 0.24) grid[z][x] = 2;
  }
  const spawn = { x: 12, z: 14 };
  const camp = { x: 12, z: 15 };
  const exit = { x: 21, z: 3 };
  const wallMeshes = new Map();
  const collectibles = [];
  const enemies = [];
  const decorations = [];
  const temp = new THREE.Object3D();

  // The slight bevels catch the lantern and skylight, keeping the cave readable.
  const rockShape = new THREE.Shape();
  rockShape.moveTo(-0.39, -0.4); rockShape.lineTo(0.37, -0.4);
  rockShape.lineTo(0.42, 0.31); rockShape.lineTo(0.3, 0.4);
  rockShape.lineTo(-0.32, 0.4); rockShape.lineTo(-0.42, 0.27); rockShape.closePath();
  const rockGeometry = geo(new THREE.ExtrudeGeometry(rockShape, { depth: 0.78, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.11, bevelThickness: 0.11 }));
  rockGeometry.translate(0, 0, -0.39);
  const ground = mesh(box, darkStone);
  ground.position.set(12 * TILE, -0.72, 12 * TILE);
  ground.scale.set(size * TILE, 1.35, size * TILE);
  ground.castShadow = false;

  // One instanced draw per ground shade, with small scattered faceted grit.
  const floorBuckets = Array.from({ length: groundTones.length }, () => []);
  const gritLocations = [];
  for (let z = 0; z < size; z++) for (let x = 0; x < size; x++) {
    floorBuckets[Math.floor(random() * groundTones.length)].push([x, z]);
    if (!grid[z][x]) for (let i = 0; i < 3; i++) gritLocations.push([x * TILE + (random() - 0.5) * 1.8, z * TILE + (random() - 0.5) * 1.8, random()]);
  }
  floorBuckets.forEach((locations, i) => {
    const tiles = new THREE.InstancedMesh(box, groundTones[i], locations.length);
    tiles.receiveShadow = true;
    locations.forEach(([x, z], index) => {
      temp.position.set(x * TILE, -0.075, z * TILE);
      temp.rotation.set(0, 0, 0); temp.scale.set(TILE + 0.005, 0.16, TILE + 0.005);
      temp.updateMatrix(); tiles.setMatrixAt(index, temp.matrix);
    });
    root.add(tiles);
  });
  const grit = new THREE.InstancedMesh(pebble, stoneTones[3], gritLocations.length);
  grit.receiveShadow = true;
  gritLocations.forEach(([x, z, variation], index) => {
    temp.position.set(x, 0.035, z); temp.rotation.set(0, variation * 8, variation);
    temp.scale.set(0.025 + variation * 0.06, 0.022 + variation * 0.018, 0.05 + variation * 0.07);
    temp.updateMatrix(); grit.setMatrixAt(index, temp.matrix);
  });
  root.add(grit);

  function littleRock(parent, x, y, z, scale, material = mossDark) {
    const item = mesh(pebble, material, parent);
    item.position.set(x, y, z); item.rotation.set(random(), random() * 6, random());
    item.scale.set(scale, scale * (0.45 + random() * 0.4), scale * 0.85);
    return item;
  }
  function gemCluster(parent, x, y, z, scale = 1) {
    const group = new THREE.Group(); group.position.set(x, y, z); parent.add(group);
    for (let i = 0; i < 3; i++) {
      const gem = mesh(crystal, i === 1 ? glowCyan : glowTurquoise, group);
      const height = (i === 1 ? 0.76 : 0.45) * scale;
      gem.position.set((i - 1) * 0.24 * scale, height * 0.47, (i % 2) * 0.09 * scale);
      gem.scale.set(0.18 * scale, height, 0.17 * scale);
      gem.rotation.set(i === 0 ? -0.22 : 0.08, i * 0.7, (i - 1) * -0.22);
    }
    littleRock(group, 0, 0.04, 0, 0.42 * scale, darkStone);
    return group;
  }
  function mushroom(parent, x, y, z, scale = 1, material = glowTurquoise) {
    const group = new THREE.Group(); group.position.set(x, y, z); parent.add(group);
    const stalk = mesh(cylinder, mushroomStem, group);
    stalk.position.y = 0.21 * scale; stalk.scale.set(0.05 * scale, 0.42 * scale, 0.05 * scale);
    stalk.rotation.z = -0.1;
    const cap = mesh(sphere, material, group);
    cap.position.set(0.02 * scale, 0.41 * scale, 0); cap.scale.set(0.28 * scale, 0.125 * scale, 0.27 * scale);
    for (let i = 0; i < 4; i++) {
      const dot = mesh(sphere, white, group);
      const angle = i * Math.PI / 2;
      dot.position.set(Math.cos(angle) * 0.12 * scale, 0.505 * scale, Math.sin(angle) * 0.12 * scale);
      dot.scale.setScalar(0.028 * scale);
    }
    return group;
  }

  for (let z = 0; z < size; z++) for (let x = 0; x < size; x++) {
    if (!grid[z][x]) continue;
    const soil = grid[z][x] === 2;
    const wall = new THREE.Group();
    wall.name = soil ? `Diggable soil ${x},${z}` : `Cave rock ${x},${z}`;
    wall.position.set(x * TILE, 0, z * TILE);
    wall.userData = { x, z, diggable: soil };
    root.add(wall); wallMeshes.set(key(x, z), wall);
    const boundary = x === 0 || z === 0 || x === size - 1 || z === size - 1;
    const chamberFront = (z === 18 && x >= 7 && x <= 17) || (x === 17 && z >= 9 && z <= 18);
    const height = (soil ? 1.35 : chamberFront ? 1.35 : boundary ? 2.35 : 1.75) + random() * (soil ? 0.25 : 0.65);
    const block = mesh(rockGeometry, soil ? dirtTones[Math.floor(random() * dirtTones.length)] : stoneTones[Math.floor(random() * stoneTones.length)], wall);
    block.position.set(0, height / 2 - 0.04, 0);
    block.scale.set(TILE * 1.025, height, TILE * 1.025);
    block.rotation.y = Math.floor(random() * 4) * Math.PI / 2;
    if (soil) {
      // Pale seams make diggable earth visually distinct from solid stone.
      for (let i = 0; i < 3; i++) {
        const seam = mesh(box, dirtTones[(i + 1) % 3], wall);
        seam.position.set((random() - 0.5) * 0.15, 0.25 + i * 0.4, 0);
        seam.scale.set(TILE * 0.98, 0.055, TILE * 0.98);
      }
      for (let i = 0; i < 3; i++) littleRock(wall, (random() - 0.5) * 1.6, height - 0.1, (random() - 0.5) * 1.6, 0.14 + random() * 0.16, dirtTones[1]);
    } else {
      if (random() < 0.63) {
        const crown = mesh(pebble, random() < 0.6 ? mossDark : moss, wall);
        crown.position.set((random() - 0.5) * 0.5, height - 0.08, (random() - 0.5) * 0.5);
        crown.scale.set(0.76 + random() * 0.23, 0.1 + random() * 0.11, 0.8);
        crown.rotation.y = random() * 6;
      }
      if (random() < 0.13 && !boundary) gemCluster(wall, (random() - 0.5) * 0.9, height - 0.12, (random() - 0.5) * 0.8, 0.55 + random() * 0.35);
    }
  }

  // Little moss islands, roots and glowing fungi soften the chamber's edges.
  const chamberPlants = [[8.25, 9.45], [9.1, 9.2], [11.1, 9.1], [15.5, 9.25], [16.5, 10.4], [8.1, 12.7], [8.15, 15.6], [9.1, 17.2], [14.9, 17.3], [16.2, 16.9], [16.65, 13.7], [10.15, 11.25]];
  for (const [x, z] of chamberPlants) {
    for (let i = 0; i < 4; i++) littleRock(root, x * TILE + (random() - 0.5) * 0.9, 0.05, z * TILE + (random() - 0.5) * 0.9, 0.22 + random() * 0.2, i === 1 ? stoneTones[2] : mossDark);
    mushroom(root, x * TILE + 0.15, 0.03, z * TILE - 0.1, 0.8 + random() * 0.6, random() < 0.18 ? glowPink : glowTurquoise);
    mushroom(root, x * TILE - 0.3, 0.02, z * TILE + 0.2, 0.4 + random() * 0.4);
  }
  gemCluster(root, 8.65 * TILE, 0.01, 10.1 * TILE, 1.35);
  gemCluster(root, 16.5 * TILE, 0.01, 12 * TILE, 1.15);
  gemCluster(root, 14.9 * TILE, 0.01, 9.5 * TILE, 1.05);

  const grassGeometry = geo(new THREE.ConeGeometry(0.045, 0.34, 3));
  const grassLocations = [];
  for (let i = 0; i < 160; i++) {
    const x = 8 + random() * 8.6, z = 9 + random() * 8.5;
    if (x < 9.5 || x > 15.3 || z < 10.3 || z > 16.7) grassLocations.push([x * TILE, z * TILE, random()]);
  }
  const grasses = new THREE.InstancedMesh(grassGeometry, moss, grassLocations.length);
  grassLocations.forEach(([x, z, t], i) => {
    temp.position.set(x, 0.09, z); temp.scale.set(1 + t, 0.6 + t, 1); temp.rotation.set(t * 0.6, t * 6, t * 0.4);
    temp.updateMatrix(); grasses.setMatrixAt(i, temp.matrix);
  });
  root.add(grasses);

  // A shallow mineral pool can be crossed; it is visual scenery, not collision.
  const poolShape = new THREE.Shape();
  poolShape.moveTo(-1.6, -0.5);
  poolShape.bezierCurveTo(-2.2, 0.2, -1.3, 1.35, -0.3, 1.1);
  poolShape.bezierCurveTo(0.45, 1.4, 2.2, 0.7, 1.9, -0.2);
  poolShape.bezierCurveTo(1.4, -1.1, -0.8, -1.4, -1.6, -0.5);
  const waterGeometry = geo(new THREE.ShapeGeometry(poolShape, 24));
  const waterMaterial = mat({ color: '#287f71', emissive: '#1b6658', emissiveIntensity: 0.3, metalness: 0.7, roughness: 0.22, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
  const water = mesh(waterGeometry, waterMaterial);
  water.rotation.x = -Math.PI / 2; water.position.set(10.1 * TILE, 0.016, 11 * TILE); water.castShadow = false;
  for (let i = 0; i < 12; i++) {
    const angle = i / 12 * Math.PI * 2;
    littleRock(root, water.position.x + Math.cos(angle) * 1.95, 0.07, water.position.z + Math.sin(angle) * 1.25, 0.15 + random() * 0.16, i % 3 === 0 ? moss : stoneTones[2]);
  }
  const rippleMaterial = basic({ color: '#83f5c8', transparent: true, opacity: 0.19, depthWrite: false });
  for (let i = 0; i < 3; i++) {
    const ripple = mesh(ringGeometry, rippleMaterial);
    ripple.rotation.x = -Math.PI / 2; ripple.scale.setScalar(0.35 + i * 0.31);
    ripple.position.set(water.position.x - 0.1, 0.029 + i * 0.001, water.position.z);
    ripple.castShadow = false;
  }

  function beam(parent, a, b, width, material = wood) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const result = mesh(box, material, parent);
    result.position.copy(start).add(end).multiplyScalar(0.5);
    result.scale.set(width, start.distanceTo(end), width);
    result.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
    return result;
  }
  function mineSupport(x, z, rotation = 0) {
    const support = new THREE.Group(); root.add(support);
    support.position.set(x * TILE, 0, z * TILE); support.rotation.y = rotation;
    beam(support, [-0.95, 0, 0], [-0.9, 2.35, 0], 0.22);
    beam(support, [0.95, 0, 0], [0.9, 2.35, 0], 0.22);
    beam(support, [-1.2, 2.28, 0], [1.2, 2.28, 0], 0.26, woodLight);
    beam(support, [-0.91, 1.65, 0], [-0.35, 2.27, 0], 0.13);
    beam(support, [0.91, 1.65, 0], [0.35, 2.27, 0], 0.13);
    for (const dx of [-0.92, 0.92]) for (const y of [0.35, 1.55]) {
      const brace = mesh(box, iron, support); brace.position.set(dx, y, 0); brace.scale.set(0.245, 0.1, 0.25);
    }
    return support;
  }
  mineSupport(12, 8.8);
  mineSupport(7.6, 13, Math.PI / 2);
  mineSupport(15.7, 17.65);
  mineSupport(20.9, 5.1);

  function lantern(parent, x, y, z, scale = 1) {
    const group = new THREE.Group(); group.position.set(x, y, z); group.scale.setScalar(scale); parent.add(group);
    const light = mesh(cylinder, glowAmber, group); light.scale.set(0.15, 0.28, 0.15);
    for (const dy of [-0.18, 0.18]) {
      const cap = mesh(cylinder, iron, group); cap.position.y = dy; cap.scale.set(0.21, 0.08, 0.21);
    }
    for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) beam(group, [Math.cos(angle) * 0.17, -0.15, Math.sin(angle) * 0.17], [Math.cos(angle) * 0.17, 0.15, Math.sin(angle) * 0.17], 0.035, iron);
    const handle = mesh(ringGeometry, iron, group); handle.position.y = 0.32; handle.scale.setScalar(0.13);
    return group;
  }
  const campGroup = new THREE.Group(); root.add(campGroup); campGroup.position.set(camp.x * TILE, 0, camp.z * TILE); camp.mesh = campGroup;
  const campHalo = mesh(geo(new THREE.RingGeometry(0.85, 0.9, 48)), glowGround, campGroup);
  campHalo.rotation.x = -Math.PI / 2; campHalo.position.y = 0.025; campHalo.castShadow = false;
  function crate(parent, x, z, scale = 1) {
    const crateGroup = new THREE.Group(); crateGroup.position.set(x, 0.32 * scale, z); crateGroup.scale.setScalar(scale); parent.add(crateGroup);
    const body = mesh(box, wood, crateGroup); body.scale.set(0.73, 0.64, 0.64);
    for (const dx of [-0.27, 0.27]) {
      const strap = mesh(box, woodLight, crateGroup); strap.position.set(dx, 0, 0.33); strap.scale.set(0.09, 0.67, 0.045);
    }
    beam(crateGroup, [-0.31, -0.26, 0.365], [0.3, 0.25, 0.365], 0.075, woodLight);
    const lid = mesh(box, woodLight, crateGroup); lid.position.y = 0.34; lid.scale.set(0.76, 0.055, 0.67);
    return crateGroup;
  }
  crate(campGroup, -0.9, 0.55, 0.95);
  const smallerCrate = crate(campGroup, -1.52, 0.85, 0.64); smallerCrate.rotation.y = -0.2;
  lantern(campGroup, -0.85, 1.03, 0.55, 0.85);
  const blanket = mat({ color: '#a7925e', roughness: 1 });
  const bed = mesh(box, blanket, campGroup); bed.position.set(0.55, 0.07, 0.6); bed.scale.set(0.63, 0.1, 1.15); bed.rotation.y = -0.15;
  const bedroll = mesh(cylinder, blanket, campGroup); bedroll.position.set(0.48, 0.19, 0.11); bedroll.scale.set(0.16, 0.71, 0.16); bedroll.rotation.z = Math.PI / 2;
  beam(campGroup, [1.24, 0.1, 0.78], [1.0, 1.06, 0.67], 0.065, woodLight);
  beam(campGroup, [0.7, 1.02, 0.68], [1.34, 1.17, 0.68], 0.09, iron);
  // A small pennant makes the rest point recognizable even when zoomed out.
  beam(campGroup, [-1.65, 0, -0.15], [-1.65, 1.65, -0.15], 0.055, woodLight);
  const flagShape = new THREE.Shape(); flagShape.moveTo(0, 0); flagShape.lineTo(0.61, -0.12); flagShape.lineTo(0.44, -0.28); flagShape.lineTo(0, -0.31); flagShape.closePath();
  const flag = mesh(geo(new THREE.ShapeGeometry(flagShape)), mat({ color: '#d5a355', roughness: 1, side: THREE.DoubleSide }), campGroup);
  flag.position.set(-1.65, 1.6, -0.15);
  const warmLight = new THREE.PointLight('#ffcb79', 4.2, 8, 2); warmLight.position.set(camp.x * TILE - 0.85, 1.35, camp.z * TILE + 0.55); root.add(warmLight);
  const poolLight = new THREE.PointLight('#55f4c9', 2.0, 6, 2); poolLight.position.set(water.position.x, 0.8, water.position.z); root.add(poolLight);

  // Ancient stone gateway, with a living green veil and amber socket ornaments.
  const portal = new THREE.Group(); root.add(portal); portal.position.set(exit.x * TILE, 0, exit.z * TILE); exit.mesh = portal;
  const portalStone = mat({ color: '#617263', roughness: 0.88, flatShading: true });
  for (const dx of [-0.84, 0.84]) {
    const base = mesh(rockGeometry, portalStone, portal); base.position.set(dx, 0.2, 0); base.scale.set(0.57, 0.4, 0.72);
    const pillar = mesh(rockGeometry, portalStone, portal); pillar.position.set(dx, 1.18, 0); pillar.scale.set(0.4, 1.85, 0.55);
    for (const y of [0.65, 1.25, 1.84]) {
      const rune = mesh(crystal, glowAmber, portal); rune.position.set(dx, y, 0.3); rune.scale.set(0.07, 0.115, 0.025);
    }
  }
  for (let i = 0; i < 7; i++) {
    const angle = i / 6 * Math.PI;
    const archStone = mesh(rockGeometry, portalStone, portal);
    archStone.position.set(Math.cos(angle) * 0.84, 1.92 + Math.sin(angle) * 0.8, 0);
    archStone.rotation.z = angle - Math.PI / 2; archStone.scale.set(0.47, 0.42, 0.57);
  }
  const portalMaterial = basic({ color: '#58e5b2', transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false });
  const portalVeil = mesh(geo(new THREE.PlaneGeometry(1.43, 2.14)), portalMaterial, portal);
  portalVeil.position.set(0, 1.15, -0.09); portalVeil.castShadow = false;
  const portalHalo = mesh(ringGeometry, glowTurquoise, portal); portalHalo.position.set(0, 1.32, 0.03); portalHalo.scale.set(0.57, 0.91, 0.57);
  portalHalo.castShadow = false;
  const portalLight = new THREE.PointLight('#5effb1', 3.0, 6.5, 2); portalLight.position.set(0, 1.2, 0.4); portal.add(portalLight);
  const step = mesh(box, portalStone, portal); step.position.set(0, 0.07, 0.1); step.scale.set(2.2, 0.13, 0.85);
  gemCluster(portal, -1.32, 0, 0.1, 0.65); mushroom(portal, 1.3, 0, 0.15, 0.85);

  // Pickups share geometry and materials, but every pickup has its own root.
  const reserved = new Set([key(spawn.x, spawn.z), key(camp.x, camp.z), key(exit.x, exit.z)]);
  const walkable = [];
  for (let z = 1; z < size - 1; z++) for (let x = 1; x < size - 1; x++) if (!grid[z][x] && !reserved.has(key(x, z))) walkable.push({ x, z });
  function pickup(type, x, z) {
    reserved.add(key(x, z));
    const group = new THREE.Group(); root.add(group); group.position.set(x * TILE, 0.68, z * TILE);
    group.name = `${type} pickup`;
    if (type === 'crystal') {
      const body = mesh(crystal, glowCyan, group); body.scale.set(0.27, 0.45, 0.27); body.rotation.z = 0.1;
      const shard = mesh(crystal, glowTurquoise, group); shard.position.set(0.2, -0.12, 0.02); shard.scale.set(0.12, 0.24, 0.12); shard.rotation.z = -0.32;
      const halo = mesh(ringGeometry, glowTurquoise, group); halo.rotation.x = Math.PI / 2; halo.position.y = -0.48; halo.scale.setScalar(0.34); halo.castShadow = false;
    } else if (type === 'relic') {
      const frame = mesh(geo(new THREE.TorusGeometry(0.34, 0.07, 6, 12)), gold, group); frame.rotation.z = Math.PI / 6;
      const heart = mesh(crystal, glowAmber, group); heart.scale.set(0.14, 0.23, 0.11);
      for (let i = 0; i < 3; i++) {
        const node = mesh(crystal, glowAmber, group); const angle = i * Math.PI * 2 / 3 + Math.PI / 2;
        node.position.set(Math.cos(angle) * 0.35, Math.sin(angle) * 0.35, 0); node.scale.setScalar(0.075);
      }
    } else {
      mushroom(group, 0, -0.27, 0, 1.25, glowPink);
      const halo = mesh(ringGeometry, glowPink, group); halo.rotation.x = -Math.PI / 2; halo.position.y = -0.47; halo.scale.setScalar(0.32); halo.castShadow = false;
    }
    collectibles.push({ id: `${type}-${level}-${collectibles.length}`, type, x, z, mesh: group, collected: false });
  }
  [[11, 13], [14, 12], [15, 16], [10, 16], [13, 10]].forEach(([x, z]) => pickup('crystal', x, z));
  const shuffled = walkable.slice().sort(() => random() - 0.5);
  function pickCell(minDistance = 0, farFromPickups = 2.1, quadrant = -1) {
    let best = null;
    for (const cell of shuffled) {
      if (reserved.has(key(cell.x, cell.z))) continue;
      if (Math.hypot(cell.x - spawn.x, cell.z - spawn.z) < minDistance) continue;
      if (quadrant >= 0 && ((cell.x < 12 ? 0 : 1) + (cell.z < 12 ? 0 : 2)) !== quadrant) continue;
      if (collectibles.some((item) => Math.hypot(item.x - cell.x, item.z - cell.z) < farFromPickups)) continue;
      best = cell; break;
    }
    return best || shuffled.find((cell) => !reserved.has(key(cell.x, cell.z))) || { x: 1, z: 1 };
  }
  for (let i = 0; i < 3; i++) { const cell = pickCell(10, 4, [0, 1, 3][i]); pickup('relic', cell.x, cell.z); }
  for (let i = 0; i < 11; i++) { const cell = pickCell(5, 2.3, i % 4); pickup('crystal', cell.x, cell.z); }
  for (let i = 0; i < 5; i++) { const cell = pickCell(i === 0 ? 3 : 7, 2.2); pickup('mushroom', cell.x, cell.z); }

  const beetleShell = mat({ color: '#954c43', roughness: 0.55, metalness: 0.18, flatShading: true });
  const beetleBody = mat({ color: '#352e30', roughness: 0.7 });
  const beetleEyes = mat({ color: '#ffe4a1', emissive: '#ff9d46', emissiveIntensity: 0.9 });
  for (let i = 0; i < 4; i++) {
    const cell = pickCell(9, 1.8, i);
    reserved.add(key(cell.x, cell.z));
    const group = new THREE.Group(); root.add(group); group.position.set(cell.x * TILE, 0, cell.z * TILE);
    group.name = `Cave beetle ${i + 1}`;
    const body = mesh(sphere, beetleBody, group); body.position.y = 0.24; body.scale.set(0.35, 0.23, 0.47);
    const shell = mesh(sphere, beetleShell, group); shell.position.set(0, 0.31, -0.07); shell.scale.set(0.38, 0.26, 0.4);
    const seam = mesh(box, beetleBody, group); seam.position.set(0, 0.548, -0.07); seam.scale.set(0.025, 0.02, 0.45);
    const head = mesh(sphere, beetleBody, group); head.position.set(0, 0.26, 0.42); head.scale.set(0.22, 0.19, 0.2);
    for (const dx of [-0.105, 0.105]) {
      const eye = mesh(sphere, beetleEyes, group); eye.position.set(dx, 0.32, 0.578); eye.scale.set(0.052, 0.052, 0.028);
      beam(group, [dx, 0.37, 0.49], [dx * 1.8, 0.63, 0.57], 0.028, beetleBody);
    }
    const legs = [];
    for (const side of [-1, 1]) for (let leg = 0; leg < 3; leg++) {
      const legGroup = new THREE.Group(); group.add(legGroup); legGroup.position.set(side * 0.23, 0.22, (leg - 1) * 0.27);
      beam(legGroup, [0, 0, 0], [side * 0.27, -0.01, -0.08], 0.045, beetleBody);
      beam(legGroup, [side * 0.27, -0.01, -0.08], [side * 0.36, -0.2, 0.02], 0.033, beetleBody);
      legs.push(legGroup);
    }
    group.userData.legs = legs;
    enemies.push({ id: `beetle-${i}`, x: cell.x, z: cell.z, mesh: group, home: { x: cell.x, z: cell.z }, phase: random() * Math.PI * 2 });
  }

  // Quiet floating spores provide motion without extra dynamic lights.
  const sporeMaterial = basic({ color: '#bcffe0', transparent: true, opacity: 0.72, depthWrite: false });
  const sporeGeometry = geo(new THREE.SphereGeometry(0.025, 5, 4));
  for (let i = 0; i < 38; i++) {
    const spore = mesh(sporeGeometry, sporeMaterial);
    spore.position.set((8 + random() * 9) * TILE, 0.3 + random() * 2.5, (9 + random() * 9) * TILE);
    spore.castShadow = false; spore.receiveShadow = false;
    decorations.push({ mesh: spore, type: 'spore', baseY: spore.position.y, phase: random() * Math.PI * 2 });
  }

  let disposed = false;
  function dispose() {
    if (disposed) return;
    disposed = true;
    root.traverse((object) => {
      if (object.isInstancedMesh) object.dispose();
    });
    root.removeFromParent();
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
  }
  return { root, grid, size, spawn, exit, camp, wallMeshes, collectibles, enemies, decorations, dispose };
}
// Integrator: THREE must already be imported. The model faces +Z.
export function createMole() {
  const mole = new THREE.Group();
  mole.name = 'mole';

  const mat = {
    fur: new THREE.MeshStandardMaterial({ color: 0x755046, roughness: 0.86 }),
    face: new THREE.MeshStandardMaterial({ color: 0x936354, roughness: 0.9 }),
    belly: new THREE.MeshStandardMaterial({ color: 0xbe9174, roughness: 0.96 }),
    snout: new THREE.MeshStandardMaterial({ color: 0xe1a295, roughness: 0.73 }),
    blush: new THREE.MeshStandardMaterial({ color: 0xcb817e, roughness: 0.88 }),
    nose: new THREE.MeshStandardMaterial({ color: 0x684244, roughness: 0.56 }),
    eyes: new THREE.MeshStandardMaterial({ color: 0x201b24, roughness: 0.14, metalness: 0.1 }),
    shine: new THREE.MeshBasicMaterial({ color: 0xfff9e6 }),
    claws: new THREE.MeshStandardMaterial({ color: 0xf5dec0, roughness: 0.65 }),
    helmet: new THREE.MeshStandardMaterial({ color: 0xf5ba43, roughness: 0.38, metalness: 0.12 }),
    helmetRim: new THREE.MeshStandardMaterial({ color: 0xb8792b, roughness: 0.47, metalness: 0.18 }),
    lampRing: new THREE.MeshStandardMaterial({ color: 0x6f6260, roughness: 0.45, metalness: 0.4 }),
    lamp: new THREE.MeshStandardMaterial({ color: 0xfff2c0, emissive: 0xffd487, emissiveIntensity: 1.6, roughness: 0.15 }),
    pack: new THREE.MeshStandardMaterial({ color: 0x547a72, roughness: 0.91 }),
    packEdge: new THREE.MeshStandardMaterial({ color: 0x355c56, roughness: 0.92 }),
    leather: new THREE.MeshStandardMaterial({ color: 0x67493a, roughness: 0.95 }),
  };
  const round = new THREE.SphereGeometry(1, 16, 12);
  const smallRound = new THREE.SphereGeometry(1, 10, 8);
  const clawGeometry = new THREE.ConeGeometry(0.028, 0.1, 6);
  const buckleGeometry = new THREE.BoxGeometry(0.044, 0.044, 0.021);

  function mesh(geometry, material, parent, name, position, scale) {
    const part = new THREE.Mesh(geometry, material);
    part.name = name;
    if (position) part.position.set(...position);
    if (scale) part.scale.set(...scale);
    part.castShadow = true;
    part.receiveShadow = true;
    parent.add(part);
    return part;
  }
  function sphere(parent, name, material, position, scale, small = false) {
    return mesh(small ? smallRound : round, material, parent, name, position, scale);
  }

  const body = new THREE.Group();
  body.name = 'body';
  body.position.y = 0.47;
  mole.add(body);
  sphere(body, 'roundBody', mat.fur, [0, 0, 0], [0.32, 0.375, 0.275]);
  sphere(body, 'bellyPatch', mat.belly, [0, -0.05, 0.205], [0.224, 0.256, 0.083]);

  const head = new THREE.Group();
  head.name = 'head';
  head.position.set(0, 0.81, 0.035);
  mole.add(head);
  sphere(head, 'face', mat.face, [0, 0, 0], [0.286, 0.265, 0.273]);
  for (const side of [-1, 1]) {
    sphere(head, `${side < 0 ? 'left' : 'right'}Ear`, mat.fur,
      [side * 0.261, 0.02, -0.017], [0.074, 0.095, 0.046], true);
    sphere(head, `${side < 0 ? 'left' : 'right'}InnerEar`, mat.snout,
      [side * 0.283, 0.027, 0.012], [0.037, 0.055, 0.025], true);
  }
  sphere(head, 'snout', mat.snout, [0, -0.053, 0.247], [0.232, 0.147, 0.164]);
  sphere(head, 'nose', mat.nose, [0, -0.005, 0.39], [0.071, 0.046, 0.04], true);
  sphere(head, 'noseHighlight', mat.blush, [-0.019, 0.008, 0.424], [0.021, 0.009, 0.005], true);
  for (const side of [-1, 1]) {
    const sideName = side < 0 ? 'left' : 'right';
    sphere(head, `${sideName}Cheek`, mat.blush,
      [side * 0.163, -0.065, 0.359], [0.044, 0.022, 0.012], true);
    sphere(head, `${sideName}Eye`, mat.eyes,
      [side * 0.159, 0.089, 0.226], [0.047, 0.057, 0.035], true);
    sphere(head, `${sideName}EyeGlint`, mat.shine,
      [side * 0.159 - 0.012, 0.111, 0.255], [0.013, 0.016, 0.009], true);
    sphere(head, `${sideName}EyeGlintSmall`, mat.shine,
      [side * 0.159 + 0.015, 0.074, 0.255], [0.006, 0.007, 0.006], true);
    const brow = sphere(head, `${sideName}Brow`, mat.fur,
      [side * 0.156, 0.161, 0.204], [0.059, 0.018, 0.025], true);
    brow.rotation.z = side * -0.12;
  }
  // A shallow curved smile nestles just under the pink muzzle.
  const smile = mesh(new THREE.TorusGeometry(0.073, 0.008, 5, 12, Math.PI), mat.nose,
    head, 'smile', [0, -0.098, 0.377]);
  smile.rotation.z = Math.PI;

  const helmet = new THREE.Group();
  helmet.name = 'helmet';
  helmet.position.set(0, 0.208, -0.006);
  head.add(helmet);
  mesh(new THREE.SphereGeometry(0.308, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    mat.helmet, helmet, 'helmetDome', [0, 0, 0], [1, 0.9, 1]);
  mesh(new THREE.CylinderGeometry(0.321, 0.335, 0.035, 20), mat.helmetRim,
    helmet, 'helmetBrim', [0, 0, 0]);
  mesh(new THREE.CylinderGeometry(0.329, 0.335, 0.021, 20), mat.helmet,
    helmet, 'helmetBrimTop', [0, 0.014, 0]);
  // Raised crest and paired metal rivets make the silhouette readable from behind.
  const crest = mesh(new THREE.TorusGeometry(0.297, 0.016, 5, 18, Math.PI), mat.helmetRim,
    helmet, 'helmetCrest', [0, 0.012, 0]);
  crest.rotation.y = Math.PI / 2;
  crest.scale.y = 0.9;
  for (const side of [-1, 1]) {
    sphere(helmet, 'helmetRivet', mat.helmetRim,
      [side * 0.309, 0.025, 0], [0.014, 0.014, 0.014], true);
  }
  const lampHousing = mesh(new THREE.CylinderGeometry(0.08, 0.086, 0.065, 12),
    mat.lampRing, helmet, 'lampHousing', [0, 0.09, 0.287]);
  lampHousing.rotation.x = Math.PI / 2;
  mesh(new THREE.TorusGeometry(0.064, 0.011, 6, 16), mat.helmet,
    helmet, 'lampBezel', [0, 0.09, 0.326]);
  sphere(helmet, 'headlampLens', mat.lamp, [0, 0.09, 0.329], [0.059, 0.059, 0.015], true);
  sphere(helmet, 'headlampGlint', mat.shine, [-0.017, 0.11, 0.342], [0.019, 0.009, 0.004], true);

  // Hands pivot at the shoulders and feet pivot at the hips for easy walking/digging.
  const limbRefs = {};
  for (const side of [-1, 1]) {
    const sideName = side < 0 ? 'left' : 'right';
    const hand = new THREE.Group();
    hand.name = `${sideName}Arm`;
    hand.position.set(side * 0.292, 0.53, 0.013);
    hand.rotation.z = side * 0.16;
    mole.add(hand);
    sphere(hand, `${sideName}UpperArm`, mat.fur, [0, -0.067, 0.018], [0.088, 0.14, 0.096], true);
    sphere(hand, `${sideName}Paw`, mat.face, [side * 0.015, -0.168, 0.059], [0.094, 0.065, 0.104], true);
    for (let digit = -1; digit <= 1; digit++) {
      const claw = mesh(clawGeometry, mat.claws, hand, `${sideName}HandClaw`,
        [side * 0.015 + digit * 0.048, -0.187, 0.141], [0.73, 0.72, 0.73]);
      claw.rotation.x = Math.PI / 2;
    }
    limbRefs[`${sideName}Arm`] = hand;

    const foot = new THREE.Group();
    foot.name = `${sideName}Foot`;
    foot.position.set(side * 0.154, 0.115, 0.016);
    mole.add(foot);
    sphere(foot, `${sideName}FootPad`, mat.fur, [0, -0.015, 0.045], [0.12, 0.087, 0.178], true);
    for (let digit = -1; digit <= 1; digit++) {
      const claw = mesh(clawGeometry, mat.claws, foot, `${sideName}ToeClaw`,
        [digit * 0.055, -0.04, 0.199], [0.72, 0.78, 0.72]);
      claw.rotation.x = Math.PI / 2;
    }
    limbRefs[`${sideName}Foot`] = foot;
  }

  const backpack = new THREE.Group();
  backpack.name = 'backpack';
  backpack.position.set(0, 0.52, -0.271);
  mole.add(backpack);
  sphere(backpack, 'packBody', mat.pack, [0, -0.025, -0.058], [0.236, 0.245, 0.124]);
  sphere(backpack, 'packFlap', mat.packEdge, [0, 0.12, -0.139], [0.235, 0.119, 0.042]);
  for (const side of [-1, 1]) {
    mesh(new THREE.BoxGeometry(0.034, 0.28, 0.016), mat.leather,
      backpack, 'packStrap', [side * 0.12, -0.002, -0.173]);
    mesh(buckleGeometry, mat.helmet, backpack, 'packBuckle', [side * 0.12, -0.038, -0.186]);
    sphere(backpack, 'packSidePocket', mat.packEdge,
      [side * 0.222, -0.061, -0.047], [0.066, 0.109, 0.082], true);
  }
  const roll = mesh(new THREE.CylinderGeometry(0.066, 0.066, 0.38, 10), mat.belly,
    backpack, 'bedroll', [0, 0.206, -0.079]);
  roll.rotation.z = Math.PI / 2;
  for (const side of [-1, 1]) {
    const tie = mesh(new THREE.TorusGeometry(0.067, 0.008, 5, 10), mat.leather,
      backpack, 'bedrollTie', [side * 0.13, 0.206, -0.079]);
    tie.rotation.y = Math.PI / 2;
  }

  // Runtime can animate these directly without name lookups. Rest values are retained.
  mole.userData = {
    body, head, helmet, backpack, ...limbRefs,
    rest: { bodyY: body.position.y, headY: head.position.y,
      armZ: 0.16, footY: 0.115, backpackY: backpack.position.y },
    headlamp: helmet.getObjectByName('headlampLens'),
  };
  return mole;
}
