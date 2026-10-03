import * as THREE from 'three';

// Tiny, hand-built clay figurines. Geometry and materials are shared so a whole
// parade of dream puffs remains inexpensive to draw.
const geometryCache = new Map();
const materialCache = new Map();
const ink = '#393447';
const cream = '#fff4dc';

function geometry(key, create) {
  if (!geometryCache.has(key)) geometryCache.set(key, create());
  return geometryCache.get(key);
}

function material(color, options = {}) {
  const key = `${color}:${JSON.stringify(options)}`;
  if (!materialCache.has(key)) {
    materialCache.set(key, new THREE.MeshStandardMaterial({
      color, roughness: 0.83, metalness: 0, ...options,
    }));
  }
  return materialCache.get(key);
}

function mesh(parent, geo, color, position, scale = [1, 1, 1], options) {
  const object = new THREE.Mesh(geo, material(color, options));
  object.position.set(...position);
  object.scale.set(...scale);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

function ball(parent, color, position, scale, options) {
  return mesh(parent, geometry('sphere', () => new THREE.SphereGeometry(1, 16, 12)),
    color, position, scale, options);
}

function stick(parent, color, from, to, radius = 0.04) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const object = mesh(parent,
    geometry('stick', () => new THREE.CylinderGeometry(1, 1, 1, 10)),
    color, a.clone().add(b).multiplyScalar(0.5).toArray(), [radius, a.distanceTo(b), radius]);
  object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
  return object;
}

function ring(parent, color, position, radius, tube = 0.045, horizontal = false, options) {
  const key = `torus:${radius}:${tube}`;
  const object = mesh(parent, geometry(key, () => new THREE.TorusGeometry(radius, tube, 7, 24)),
    color, position, [1, 1, 1], options);
  if (horizontal) object.rotation.x = Math.PI / 2;
  return object;
}

function star(parent, color, position, size = 0.16, options) {
  const geo = geometry('star', () => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const angle = Math.PI / 2 + i * Math.PI / 5;
      const radius = i % 2 ? 0.45 : 1;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
    }
    shape.closePath();
    const result = new THREE.ExtrudeGeometry(shape, {
      depth: 0.22, bevelEnabled: true, bevelSize: 0.065,
      bevelThickness: 0.065, bevelSegments: 2, steps: 1,
    });
    result.translate(0, 0, -0.11);
    return result;
  });
  return mesh(parent, geo, color, position, [size, size, size], options);
}

function line(parent, color, points, radius = 0.016) {
  const key = `line:${radius}:${JSON.stringify(points)}`;
  return mesh(parent, geometry(key, () => new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), 10, radius, 5, false,
  )), color, [0, 0, 0]);
}

function eyes(parent, { y = 0, z = 0.37, spread = 0.15, size = 0.048, sleepy = false } = {}) {
  for (const side of [-1, 1]) {
    if (sleepy) {
      line(parent, ink, [[side * spread - 0.047, y + 0.015, z],
        [side * spread, y - 0.005, z + 0.013], [side * spread + 0.047, y + 0.015, z]]);
    } else {
      ball(parent, ink, [side * spread, y, z], [size, size * 1.2, size * 0.42]);
      ball(parent, '#ffffff', [side * spread - size * 0.23, y + size * 0.4, z + size * 0.39],
        [size * 0.27, size * 0.28, size * 0.15]);
    }
    ball(parent, '#f2b8b4', [side * (spread + 0.078), y - 0.09, z - 0.012],
      [0.071, 0.038, 0.02]);
  }
}

function smile(parent, y, z, width = 0.047) {
  line(parent, ink, [[-width, y + 0.015, z], [0, y, z + 0.006], [width, y + 0.015, z]], 0.011);
}

function feet(parent, color, spread = 0.2) {
  return [-1, 1].map(side => ball(parent, color, [side * spread, 0.11, 0.1], [0.19, 0.11, 0.26]));
}

function scarf(parent, color, y = 0.76, size = 0.3) {
  ring(parent, color, [0, y, 0], size, 0.083, true);
  const tail = ball(parent, color, [0.18, y - 0.22, 0.32], [0.105, 0.25, 0.045]);
  tail.rotation.z = 0.18;
  ball(parent, color, [0.235, y - 0.055, 0.26], [0.12, 0.1, 0.07]);
  for (const x of [0.132, 0.181, 0.23]) {
    stick(parent, color, [x, y - 0.4, 0.32], [x - 0.012, y - 0.48, 0.32], 0.018);
  }
}

function ear(parent, color, position, scale = [1, 1, 1]) {
  const geo = geometry('roundedEar', () => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.18, 0);
    shape.quadraticCurveTo(-0.205, 0.05, -0.13, 0.22);
    shape.quadraticCurveTo(-0.055, 0.41, 0.015, 0.34);
    shape.quadraticCurveTo(0.18, 0.16, 0.18, 0);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.12, bevelEnabled: true, bevelSize: 0.04,
      bevelThickness: 0.04, bevelSegments: 2, curveSegments: 7,
    });
  });
  return mesh(parent, geo, color, position, scale);
}

function bunny(root) {
  const coat = '#fff2dc';
  const body = ball(root, coat, [0, 0.53, 0], [0.34, 0.47, 0.29]);
  ball(root, '#ffffff', [0, 0.47, 0.247], [0.22, 0.27, 0.06]);
  const paws = feet(root, coat);
  ball(root, '#fffaf0', [0, 0.44, -0.31], [0.17, 0.18, 0.17]);
  const head = new THREE.Group();
  head.position.y = 1.02;
  root.add(head);
  ball(head, coat, [0, 0, 0], [0.405, 0.355, 0.34]);
  for (const side of [-1, 1]) {
    const bunnyEar = new THREE.Group();
    bunnyEar.position.set(side * 0.2, 0.24, -0.025);
    bunnyEar.rotation.z = side * -0.17;
    head.add(bunnyEar);
    ball(bunnyEar, coat, [0, 0.275, 0], [0.13, 0.39, 0.12]);
    ball(bunnyEar, '#f4c2bb', [0, 0.29, 0.097], [0.073, 0.285, 0.021]);
  }
  eyes(head, { y: 0.015, z: 0.326, spread: 0.145 });
  ball(head, '#c28d89', [0, -0.065, 0.361], [0.035, 0.025, 0.023]);
  smile(head, -0.115, 0.345);
  scarf(root, '#efbb66');
  const arm = ball(root, coat, [-0.335, 0.6, 0.045], [0.115, 0.24, 0.13]);
  arm.rotation.z = -0.28;
  const weapon = new THREE.Group();
  root.add(weapon);
  stick(weapon, '#c9964d', [0.42, 0.42, 0.13], [0.58, 1.64, 0.13], 0.035);
  star(weapon, '#ffe59c', [0.59, 1.72, 0.13], 0.23, { emissive: '#ecb74c', emissiveIntensity: 0.25 });
  star(weapon, '#fff8d5', [0.59, 1.72, 0.171], 0.115);
  ball(root, coat, [0.4, 0.82, 0.14], [0.125, 0.13, 0.125]);
  return { body, head, weapon, feet: paws };
}

function cat(root) {
  const coat = '#a6dacb';
  const body = ball(root, coat, [0, 0.52, 0], [0.34, 0.44, 0.28]);
  ball(root, '#e5f0d9', [0, 0.47, 0.25], [0.21, 0.26, 0.05]);
  const paws = feet(root, coat);
  const tail = line(root, coat, [[-0.2, 0.3, -0.19], [-0.47, 0.35, -0.3],
    [-0.58, 0.57, -0.27], [-0.5, 0.72, -0.2]], 0.086);
  const head = new THREE.Group();
  head.position.y = 1.03;
  root.add(head);
  ball(head, coat, [0, 0, 0], [0.42, 0.35, 0.335]);
  for (const side of [-1, 1]) {
    const outer = ear(head, coat, [side * 0.25, 0.19, -0.08]);
    outer.rotation.z = side * -0.18;
    const inner = ear(head, '#eed0cb', [side * 0.25, 0.24, 0.079], [0.5, 0.58, 0.25]);
    inner.rotation.z = side * -0.18;
    for (let i = 0; i < 2; i++) {
      stick(head, '#709f99', [side * 0.25, -0.06 - i * 0.055, 0.285],
        [side * 0.36, -0.042 - i * 0.078, 0.24], 0.009);
    }
  }
  eyes(head, { y: 0.014, z: 0.322 });
  ball(head, '#ad8090', [0, -0.057, 0.348], [0.035, 0.025, 0.019]);
  line(head, ink, [[-0.075, -0.097, 0.333], [-0.037, -0.118, 0.344],
    [0, -0.087, 0.35], [0.037, -0.118, 0.344], [0.075, -0.097, 0.333]], 0.01);
  scarf(root, '#aaa0d5');
  ball(root, coat, [-0.3, 0.61, 0.1], [0.12, 0.23, 0.13]).rotation.z = -0.24;
  const weapon = new THREE.Group();
  root.add(weapon);
  stick(weapon, '#ac90bf', [0.41, 0.43, 0.17], [0.54, 1.25, 0.17], 0.034);
  ring(weapon, '#e0c2ef', [0.55, 1.43, 0.17], 0.185, 0.035);
  ball(weapon, '#d1fbef', [0.55, 1.43, 0.17], [0.15, 0.15, 0.025],
    { transparent: true, opacity: 0.48, roughness: 0.25, depthWrite: false });
  ball(weapon, '#d2f7ee', [0.69, 1.77, 0.09], [0.11, 0.11, 0.11],
    { transparent: true, opacity: 0.63, roughness: 0.18, depthWrite: false });
  ball(weapon, '#ffffff', [0.658, 1.803, 0.181], [0.024, 0.034, 0.012]);
  ball(root, coat, [0.41, 0.81, 0.17], [0.12, 0.14, 0.12]);
  return { body, head, tail, weapon, feet: paws };
}

function bear(root) {
  const coat = '#e8b384';
  const body = ball(root, coat, [0, 0.5, 0], [0.39, 0.43, 0.32]);
  ball(root, '#f8d9aa', [0, 0.49, 0.26], [0.28, 0.28, 0.09]);
  const paws = feet(root, coat, 0.23);
  const head = new THREE.Group();
  head.position.y = 1.05;
  root.add(head);
  ball(head, coat, [0, 0, 0], [0.435, 0.36, 0.34]);
  for (const side of [-1, 1]) {
    ball(head, coat, [side * 0.32, 0.28, -0.025], [0.17, 0.175, 0.12]);
    ball(head, '#bf8d70', [side * 0.32, 0.287, 0.079], [0.092, 0.093, 0.035]);
  }
  eyes(head, { y: 0.035, z: 0.322, spread: 0.165 });
  ball(head, '#fae0b7', [0, -0.09, 0.305], [0.18, 0.135, 0.086]);
  ball(head, '#705247', [0, -0.048, 0.391], [0.055, 0.038, 0.024]);
  smile(head, -0.136, 0.387, 0.045);
  scarf(root, '#d79186', 0.75, 0.32);
  const weapon = new THREE.Group();
  weapon.position.set(0, 0.49, 0.38);
  root.add(weapon);
  ball(weapon, '#cf8b52', [0, 0, 0], [0.235, 0.26, 0.21]);
  ball(weapon, '#edbc75', [0, -0.005, 0.13], [0.193, 0.215, 0.105]);
  mesh(weapon, geometry('jarLid', () => new THREE.CylinderGeometry(0.22, 0.22, 0.065, 16)),
    '#f4d29a', [0, 0.24, 0]);
  ring(weapon, '#b7794d', [0, 0.205, 0], 0.203, 0.028, true);
  ball(weapon, '#fff0c6', [0, 0, 0.22], [0.137, 0.123, 0.013]);
  star(weapon, '#dfaa58', [0, 0.006, 0.238], 0.092);
  for (const side of [-1, 1]) {
    ball(root, coat, [side * 0.275, 0.57, 0.34], [0.15, 0.195, 0.155]).rotation.z = side * -0.6;
  }
  // A tiny confection perched by one ear makes the silhouette unmistakable.
  star(head, '#f9df93', [-0.31, 0.375, 0.1], 0.095);
  return { body, head, weapon, feet: paws };
}

function owl(root) {
  const coat = '#b8a4d4';
  const body = ball(root, coat, [0, 0.65, 0], [0.435, 0.56, 0.35]);
  const paws = [-1, 1].map(side => ball(root, '#dfa970', [side * 0.19, 0.075, 0.135], [0.14, 0.075, 0.18]));
  const head = new THREE.Group();
  head.position.y = 1.04;
  root.add(head);
  ball(head, coat, [0, 0, 0], [0.43, 0.34, 0.33]);
  for (const side of [-1, 1]) {
    ear(head, coat, [side * 0.27, 0.17, -0.12], [0.65, 0.64, 0.8]).rotation.z = side * -0.42;
    ball(head, '#f3e9e9', [side * 0.172, 0.016, 0.252], [0.214, 0.234, 0.115]);
  }
  eyes(head, { y: 0.026, z: 0.367, spread: 0.17, size: 0.057 });
  ball(head, '#e8b371', [0, -0.073, 0.385], [0.063, 0.091, 0.054]);
  ball(root, '#dfd1e4', [0, 0.56, 0.282], [0.3, 0.32, 0.09]);
  for (const [x, y] of [[-0.1, 0.68], [0.1, 0.68], [0, 0.52]]) {
    line(root, '#b09ac5', [[x - 0.045, y, 0.373], [x, y - 0.034, 0.381], [x + 0.045, y, 0.373]], 0.013);
  }
  const wings = [-1, 1].map(side => {
    const wing = ball(root, '#a08bbf', [side * 0.36, 0.67, 0.015], [0.155, 0.32, 0.22]);
    wing.rotation.z = side * 0.26;
    return wing;
  });
  ring(root, '#e5c382', [0, 0.83, 0], 0.315, 0.034, true);
  star(root, '#ffe4a5', [0, 0.8, 0.358], 0.087);
  const weapon = new THREE.Group();
  root.add(weapon);
  stick(weapon, '#9d7a77', [0.36, 0.76, 0.16], [0.66, 1.1, 0.16], 0.027);
  ring(weapon, '#c19460', [0.68, 0.94, 0.17], 0.095, 0.022);
  ball(weapon, '#ffeab0', [0.68, 0.7, 0.17], [0.185, 0.235, 0.16],
    { emissive: '#ffc96d', emissiveIntensity: 0.65, roughness: 0.6 });
  for (const y of [0.5, 0.9]) {
    mesh(weapon, geometry('lanternCap', () => new THREE.CylinderGeometry(0.135, 0.17, 0.065, 8)),
      '#c79462', [0.68, y, 0.17]);
  }
  for (const side of [-1, 1]) {
    line(weapon, '#cea16a', [[0.68 + side * 0.11, 0.51, 0.27],
      [0.68 + side * 0.145, 0.7, 0.29], [0.68 + side * 0.11, 0.89, 0.27]], 0.015);
  }
  star(weapon, '#fff6cf', [0.68, 0.72, 0.335], 0.065);
  return { body, head, wings, weapon, feet: paws };
}

export function makeTower(type, level = 1) {
  const root = new THREE.Group();
  root.name = `guardian-${type}`;
  root.userData.type = type;
  root.userData.level = level;
  const builders = { bunny, cat, bear, owl };
  root.userData.animParts = (builders[type] || bunny)(root);
  if (level > 1) {
    const ribbon = new THREE.Group();
    root.add(ribbon);
    for (let i = 0; i < Math.min(level - 1, 3); i++) {
      star(ribbon, '#ffdf86', [-0.31 + i * 0.11, 0.42 + i * 0.055, 0.27], 0.065,
        { emissive: '#d6aa44', emissiveIntensity: 0.16 });
    }
    root.userData.animParts.ribbon = ribbon;
  }
  return root;
}

const enemyPalettes = {
  puff: { coat: '#a09bbd', tuft: '#bdb5cf', paws: '#7d789e' },
  runner: { coat: '#cf99ba', tuft: '#e7bdd0', paws: '#a66e97' },
  shell: { coat: '#9bb9bd', tuft: '#c5d7cf', paws: '#718e9a' },
  healer: { coat: '#e5b2c4', tuft: '#f3cfda', paws: '#b18ca9' },
  boss: { coat: '#857498', tuft: '#a08aae', paws: '#605676' },
};

export function makeEnemy(kind = 'puff') {
  const root = new THREE.Group();
  root.name = `dream-${kind}`;
  root.userData.kind = kind;
  const palette = enemyPalettes[kind] || enemyPalettes.puff;
  const body = new THREE.Group();
  root.add(body);
  const runner = kind === 'runner';
  const boss = kind === 'boss';
  const shell = kind === 'shell';
  ball(body, palette.coat, [0, 0.37, 0], [0.34, runner ? 0.285 : 0.325, 0.3]);
  const paws = [-1, 1].map(side => ball(root, palette.paws,
    [side * 0.2, 0.068, 0.04], [0.13, 0.069, 0.17]));
  // Broad cotton lobes read as soft wool even from the elevated game camera.
  for (const [x, y, z, size] of [
    [-0.25, 0.27, -0.025, 0.17], [0.25, 0.27, -0.025, 0.17],
    [-0.23, 0.5, -0.075, 0.16], [0.23, 0.5, -0.075, 0.16],
    [-0.13, 0.63, -0.05, 0.145], [0.09, 0.64, -0.055, 0.15],
    [0, 0.34, -0.235, 0.15],
  ]) ball(body, palette.coat, [x, y, z], [size, size * 0.93, size]);
  if (kind === 'puff' || boss) {
    const tuft = ball(body, palette.tuft, [-0.025, 0.725, -0.025], [0.076, 0.15, 0.066]);
    tuft.rotation.z = -0.42;
    ball(body, palette.tuft, [0.045, 0.707, -0.02], [0.052, 0.098, 0.05]).rotation.z = 0.44;
  }
  eyes(body, { y: 0.395, z: 0.282, spread: 0.122, size: 0.043, sleepy: kind === 'healer' });
  if (boss) {
    ball(body, '#4c405a', [0, 0.29, 0.301], [0.035, 0.034, 0.017]);
    for (const side of [-1, 1]) {
      ball(body, '#fff1d9', [side * 0.042, 0.245, 0.297], [0.018, 0.029, 0.014]);
      const horn = mesh(body, geometry('horn', () => new THREE.ConeGeometry(0.086, 0.25, 8)),
        '#e6bd9e', [side * 0.3, 0.69, -0.01]);
      horn.rotation.z = side * -0.55;
    }
    const crown = new THREE.Group();
    crown.position.set(0, 0.75, -0.02);
    crown.rotation.z = -0.14;
    body.add(crown);
    ring(crown, '#d9b56f', [0, 0, 0], 0.145, 0.04, true);
    for (const x of [-0.115, 0, 0.115]) {
      const tip = mesh(crown, geometry('crownTip', () => new THREE.ConeGeometry(0.055, 0.15, 4)),
        '#f0cc85', [x, 0.075, 0.065]);
      ball(crown, '#ffebbb', [x, 0.145, 0.065], [0.021, 0.024, 0.021]);
      tip.rotation.y = Math.PI / 4;
    }
    root.scale.setScalar(1.62);
  } else {
    smile(body, 0.288, 0.303, 0.036);
  }
  if (runner) {
    // A swept-back pair of ears, tiny sneakers and a silk comet scarf.
    for (const side of [-1, 1]) {
      const tuft = ball(body, palette.tuft, [side * 0.17, 0.71, -0.085], [0.074, 0.2, 0.062]);
      tuft.rotation.x = -0.6;
      tuft.rotation.z = side * -0.28;
      ball(root, '#f9ddd2', [side * 0.2, 0.073, 0.131], [0.13, 0.065, 0.11]);
    }
    const ribbon = ball(body, '#f4cf86', [0.29, 0.39, -0.26], [0.31, 0.045, 0.07]);
    ribbon.rotation.y = -0.52;
    star(body, '#fff0bc', [0.275, 0.45, 0.172], 0.062);
  }
  if (shell) {
    ball(body, '#78939f', [0, 0.46, -0.12], [0.38, 0.35, 0.28]);
    for (const [x, y, z] of [[-0.22, 0.6, -0.22], [0, 0.71, -0.15], [0.22, 0.6, -0.22],
      [-0.33, 0.42, -0.06], [0.33, 0.42, -0.06]]) {
      const plate = ball(body, '#abc0c1', [x, y, z], [0.14, 0.09, 0.14]);
      plate.rotation.z = -x * 2;
    }
    ball(body, '#cbd4c4', [0, 0.68, 0.065], [0.2, 0.085, 0.105]);
  }
  if (kind === 'healer') {
    const hat = new THREE.Group();
    hat.position.set(0.025, 0.68, -0.025);
    hat.rotation.z = -0.1;
    body.add(hat);
    ball(hat, '#a678ac', [0, 0.035, 0], [0.38, 0.195, 0.3]);
    ball(hat, '#f5d3d9', [0, -0.02, 0], [0.385, 0.055, 0.303]);
    for (const [x, y, z, size] of [[-0.16, 0.158, 0.15, 0.06], [0.13, 0.192, 0.04, 0.077],
      [0.22, 0.11, 0.17, 0.045], [-0.09, 0.2, -0.09, 0.039]]) {
      ball(hat, '#f8e5d1', [x, y, z], [size, 0.022, size]);
    }
    ball(body, '#c6e5c7', [0.32, 0.37, 0.06], [0.095, 0.12, 0.08]);
    stick(body, '#faf1d8', [0.32, 0.32, 0.137], [0.32, 0.42, 0.137], 0.015);
    stick(body, '#faf1d8', [0.275, 0.37, 0.137], [0.365, 0.37, 0.137], 0.015);
  }
  root.userData.animParts = { body, feet: paws };
  return root;
}
