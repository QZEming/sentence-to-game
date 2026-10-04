import * as THREE from 'three';

// Everything in the clearing is handmade geometry: no textures or remote assets.
const COLORS = { gold: 0xf4cd79, blue: 0x79d4f4, rose: 0xec94ba };
const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: .85, flatShading: true, ...extra });
const rockMat = mat(0x5b6960);
const stoneMat = mat(0x70796b);
const darkStoneMat = mat(0x354f4b);
const brassMat = mat(0xcaaa66, { metalness: .65, roughness: .35 });
const darkBrassMat = mat(0x806d43, { metalness: .5, roughness: .6 });
const woodMat = mat(0x615549);
const glowMat = (color, strength = .75) => mat(color, { emissive: color, emissiveIntensity: strength, roughness: .25 });
const colorOf = (value = 'gold') => COLORS[value] ?? value;

function mesh(parent, geo, material, x = 0, y = 0, z = 0) {
  const item = new THREE.Mesh(geo, material);
  item.position.set(x, y, z); item.castShadow = true; item.receiveShadow = true;
  parent.add(item); return item;
}
function box(parent, size, material, x = 0, y = 0, z = 0) {
  return mesh(parent, new THREE.BoxGeometry(...size), material, x, y, z);
}
function cylinder(parent, top, bottom, height, material, x = 0, y = 0, z = 0, sides = 8) {
  return mesh(parent, new THREE.CylinderGeometry(top, bottom, height, sides), material, x, y, z);
}
function sphere(parent, radius, material, x = 0, y = 0, z = 0, detail = 1) {
  return mesh(parent, new THREE.IcosahedronGeometry(radius, detail), material, x, y, z);
}
function torus(parent, radius, tube, material, x = 0, y = 0, z = 0) {
  return mesh(parent, new THREE.TorusGeometry(radius, tube, 6, 40), material, x, y, z);
}
function objectAt(data) {
  const group = new THREE.Group(); group.position.set(data.x || 0, 0, data.z || 0); return group;
}
function pedestal(parent, radius = .6) {
  cylinder(parent, radius, radius * 1.12, .16, darkStoneMat, 0, .08, 0, 6);
  cylinder(parent, radius * .92, radius, .13, stoneMat, 0, .215, 0, 6);
  cylinder(parent, radius * .65, radius * .76, .06, darkBrassMat, 0, .31, 0, 8);
}
function seeded(seed = 413) {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}

export function createForest(scene) {
  const forest = new THREE.Group(); scene.add(forest);
  const random = seeded();
  const ambient = [];
  const segments = 64;
  const rim = Array.from({ length: segments }, (_, i) => {
    const a = i / segments * Math.PI * 2;
    return 10.8 + Math.sin(a * 5) * .28 + Math.sin(a * 9 + 2) * .18 + random() * .12;
  });

  // Low, softly faceted moss lawn. Tiny color variation keeps it legible at game scale.
  const groundPositions = [], groundColors = [];
  const moss = new THREE.Color(0x637455);
  const ringPoint = (ring, i) => {
    const a = (i % segments) / segments * Math.PI * 2;
    const r = rim[i % segments] * ring / 5;
    return [Math.cos(a) * r, -.015, Math.sin(a) * r];
  };
  function lawnTriangle(a, b, c) {
    groundPositions.push(...a, ...b, ...c);
    // Color is a smooth function of world position, so adjacent triangles agree
    // at their shared vertices and never reveal a distracting radial fan.
    for (const point of [a, b, c]) {
      const variation = 1 + Math.sin(point[0] * .51 + point[2] * .29) * .017 + Math.sin(point[2] * .73 - point[0] * .17) * .012;
      groundColors.push(moss.r * variation, moss.g * variation, moss.b * variation);
    }
  }
  for (let i = 0; i < segments; i++) lawnTriangle([0, -.015, 0], ringPoint(1, i + 1), ringPoint(1, i));
  for (let ring = 1; ring < 5; ring++) for (let i = 0; i < segments; i++) {
    lawnTriangle(ringPoint(ring, i), ringPoint(ring, i + 1), ringPoint(ring + 1, i));
    lawnTriangle(ringPoint(ring, i + 1), ringPoint(ring + 1, i + 1), ringPoint(ring + 1, i));
  }
  const groundGeometry = new THREE.BufferGeometry();
  groundGeometry.setAttribute('position', new THREE.Float32BufferAttribute(groundPositions, 3));
  groundGeometry.setAttribute('color', new THREE.Float32BufferAttribute(groundColors, 3));
  groundGeometry.computeVertexNormals();
  mesh(forest, groundGeometry, mat(0xffffff, { vertexColors: true }));

  // Uneven strata taper into a floating stone island.
  const cliffColors = [0x334842, 0x3e5148, 0x536052, 0x46574c, 0x354e49, 0x69705a].map(c => new THREE.Color(c));
  const cliffPositions = [], cliffVertexColors = [];
  const rings = [[], [], [], []];
  for (let i = 0; i < segments; i++) {
    const a = i / segments * Math.PI * 2;
    [1, 1.015, .89, .57].forEach((scale, ri) => {
      const r = rim[i] * scale;
      rings[ri].push([Math.cos(a) * r, [0, -.65, -2.25, -3.7][ri] - (ri ? random() * .35 : 0), Math.sin(a) * r]);
    });
  }
  const cliffTri = (a, b, c) => {
    cliffPositions.push(...a, ...b, ...c);
    const col = cliffColors[Math.floor(random() * cliffColors.length)];
    for (let j = 0; j < 3; j++) cliffVertexColors.push(col.r, col.g, col.b);
  };
  for (let r = 0; r < 3; r++) for (let i = 0; i < segments; i++) {
    const n = (i + 1) % segments;
    cliffTri(rings[r][i], rings[r][n], rings[r + 1][i]);
    cliffTri(rings[r][n], rings[r + 1][n], rings[r + 1][i]);
  }
  for (let i = 0; i < segments; i++) cliffTri(rings[3][i], rings[3][(i + 1) % segments], [0, -5.2, 0]);
  const cliffGeometry = new THREE.BufferGeometry();
  cliffGeometry.setAttribute('position', new THREE.Float32BufferAttribute(cliffPositions, 3));
  cliffGeometry.setAttribute('color', new THREE.Float32BufferAttribute(cliffVertexColors, 3));
  cliffGeometry.computeVertexNormals();
  mesh(forest, cliffGeometry, mat(0xffffff, { vertexColors: true }));

  const pineMaterials = [mat(0x1e5047), mat(0x245d4e), mat(0x32705b), mat(0x437965)];
  const trunkMat = mat(0x64553e);
  function pine(x, z, height, hue = 0) {
    const group = new THREE.Group(); group.position.set(x, 0, z); forest.add(group);
    cylinder(group, .105, .2, height * .61, trunkMat, 0, height * .305, 0, 6);
    for (let k = 0; k < 3; k++) {
      const radius = height * (.23 - k * .045);
      const cone = mesh(group, new THREE.ConeGeometry(radius, height * .49, 7), pineMaterials[(hue + k) % pineMaterials.length], 0, height * (.4 + k * .19), 0);
      cone.rotation.y = k * .35 + random();
    }
    // Slanted roots make each tree feel planted rather than dropped on the island.
    for (let k = 0; k < 3; k++) {
      const a = k / 3 * Math.PI * 2;
      const root = cylinder(group, .06, .11, .55, trunkMat, Math.cos(a) * .13, .16, Math.sin(a) * .13, 5);
      root.rotation.z = Math.cos(a) * .7; root.rotation.x = Math.sin(a) * .7;
    }
  }
  // A high canopy at the back and shorter growth by the front preserve the play area.
  for (let i = 0; i < 32; i++) {
    const a = i / 32 * Math.PI * 2 + (random() - .5) * .08;
    const r = 9.55 + random() * .7;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (z > 6 && Math.abs(x) < 6.5) continue;
    const height = z > 3 ? 2.4 + random() * 1.2 : 3.1 + random() * 2.35;
    pine(x, z, height, i % 2);
  }
  pine(-7.8, -8.1, 4.9); pine(6.8, -8.3, 5.1, 1); pine(-9.2, -3.2, 4.6, 1);

  // Curving patches of worn earth, with an irregular rather than grid-shaped edge.
  const pathMaterial = mat(0x89937a, { transparent: true, opacity: .115, depthWrite: false });
  for (let i = 0; i < 31; i++) {
    const z = -7.6 + i * .48;
    const x = Math.sin(z * .5) * 1.4;
    const patch = mesh(forest, new THREE.CircleGeometry(.59 + random() * .28, 7), pathMaterial, x, .001 + i * .00005, z);
    patch.rotation.x = -Math.PI / 2; patch.rotation.z = random() * Math.PI; patch.scale.x = 1.4;
    patch.castShadow = false;
  }

  // Grass blades are batched into a single colored mesh to keep animation smooth.
  const grassPositions = [], grassColors = [];
  const grassPalette = [0x92a36c, 0x7e9563, 0x536d50, 0xb6b788].map(c => new THREE.Color(c));
  for (let i = 0; i < 1150; i++) {
    const a = random() * Math.PI * 2;
    const r = Math.sqrt(random()) * 10.55;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (r < 7.5 && random() > .14) continue;
    for (let blade = 0; blade < 3; blade++) {
      const ba = random() * Math.PI * 2;
      const width = .025 + random() * .025, height = .13 + random() * .19;
      const dx = Math.cos(ba) * width, dz = Math.sin(ba) * width;
      grassPositions.push(x - dx, .015, z - dz, x + dx, .015, z + dz, x + Math.cos(ba + .8) * height * .35, height, z + Math.sin(ba + .8) * height * .35);
      const color = grassPalette[Math.floor(random() * grassPalette.length)];
      for (let j = 0; j < 3; j++) grassColors.push(color.r, color.g, color.b);
    }
  }
  const grassGeo = new THREE.BufferGeometry();
  grassGeo.setAttribute('position', new THREE.Float32BufferAttribute(grassPositions, 3));
  grassGeo.setAttribute('color', new THREE.Float32BufferAttribute(grassColors, 3));
  grassGeo.computeVertexNormals();
  const grass = mesh(forest, grassGeo, mat(0xffffff, { vertexColors: true, side: THREE.DoubleSide })); grass.castShadow = false;

  // Irregular translucent moss islands soften the lawn without adding clutter.
  // Their low opacity and shared geometry make these ground cover rather than
  // obstacles, and keep the clearing quiet around the optical puzzle pieces.
  const mossPositions = [];
  for (let i = 0; i < 40; i++) {
    const angle = random() * Math.PI * 2;
    const r = i < 28 ? 7.8 + random() * 2.2 : 2 + random() * 5.2;
    const x = Math.cos(angle) * r, z = Math.sin(angle) * r;
    const width = .32 + random() * .6, depth = .3 + random() * .5;
    const outline = Array.from({ length: 9 }, (_, j) => {
      const a = j / 9 * Math.PI * 2, size = .8 + random() * .35;
      return [x + Math.cos(a) * width * size, .003, z + Math.sin(a) * depth * size];
    });
    for (let j = 0; j < outline.length; j++) mossPositions.push(x, .003, z, ...outline[(j + 1) % outline.length], ...outline[j]);
  }
  const mossGeometry = new THREE.BufferGeometry();
  mossGeometry.setAttribute('position', new THREE.Float32BufferAttribute(mossPositions, 3)); mossGeometry.computeVertexNormals();
  const mossCover = mesh(forest, mossGeometry, mat(0x839260, { transparent: true, opacity: .13, depthWrite: false })); mossCover.castShadow = false;

  // Broad fern leaves complement the fine grass, all in one inexpensive mesh.
  const fernPositions = [], fernColors = [];
  const fernColor = new THREE.Color();
  const fernTriangle = (a, b, c, shade) => {
    fernPositions.push(...a, ...b, ...c); fernColor.setHex(shade);
    for (let j = 0; j < 3; j++) fernColors.push(fernColor.r, fernColor.g, fernColor.b);
  };
  const fernSites = [[-8.2,-5.2],[-9.1,-1.4],[-8.8,2.4],[-7.8,4.8],[-3.2,9.3],[.8,9.5],[4.5,8.3],[8.7,3.2],[9.3,-.8],[8.4,-4.9],[4.1,-8.6],[.3,-9.3],[-4.2,-8.5]];
  for (const [siteX, siteZ] of fernSites) for (let plant = 0; plant < 2; plant++) {
    const x = siteX + (random() - .5) * .45, z = siteZ + (random() - .5) * .45;
    const size = .66 + random() * .35;
    for (let frond = 0; frond < 5; frond++) {
      const a = frond / 5 * Math.PI * 2 + random() * .3;
      const direction = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
      const sideways = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));
      for (let leaf = 0; leaf < 4; leaf++) {
        const progress = .2 + leaf * .18;
        const center = new THREE.Vector3(x, .045, z).addScaledVector(direction, progress * size * .65);
        center.y += Math.sin(progress * Math.PI * .83) * size * .36;
        const length = (1 - progress * .78) * size * .18;
        for (const side of [-1, 1]) {
          const tip = center.clone().addScaledVector(sideways, length * side).addScaledVector(direction, length * .45); tip.y += .025;
          const front = center.clone().addScaledVector(direction, .065 * size);
          const back = center.clone().addScaledVector(direction, -.038 * size);
          fernTriangle(back.toArray(), tip.toArray(), front.toArray(), leaf % 2 ? 0x6a925f : 0x7a9d68);
        }
      }
    }
  }
  const fernGeometry = new THREE.BufferGeometry();
  fernGeometry.setAttribute('position', new THREE.Float32BufferAttribute(fernPositions, 3));
  fernGeometry.setAttribute('color', new THREE.Float32BufferAttribute(fernColors, 3)); fernGeometry.computeVertexNormals();
  const ferns = mesh(forest, fernGeometry, mat(0xffffff, { vertexColors: true, side: THREE.DoubleSide })); ferns.castShadow = false;

  const pebbleGeo = new THREE.DodecahedronGeometry(1, 0);
  const pebbles = new THREE.InstancedMesh(pebbleGeo, mat(0x89917d), 85);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 85; i++) {
    const a = random() * Math.PI * 2, r = 7.7 + random() * 2.7;
    const size = .06 + random() * .2;
    dummy.position.set(Math.cos(a) * r, size * .35, Math.sin(a) * r);
    dummy.scale.set(size * 1.5, size * .7, size); dummy.rotation.set(random(), random(), random()); dummy.updateMatrix();
    pebbles.setMatrixAt(i, dummy.matrix);
  }
  pebbles.castShadow = true; pebbles.receiveShadow = true; forest.add(pebbles);

  const capMaterial = mat(0xd47d63), stemMaterial = mat(0xd5c6a0);
  const flowerColors = [mat(0xefcb74), mat(0xc898b2), mat(0xa7cbd1)];
  for (let i = 0; i < 32; i++) {
    const a = random() * Math.PI * 2, r = 8.1 + random() * 2;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (i % 3 === 0) {
      cylinder(forest, .028, .038, .18, stemMaterial, x, .1, z, 5);
      const cap = sphere(forest, .13, capMaterial, x, .21, z); cap.scale.y = .55;
      sphere(forest, .025, stemMaterial, x - .045, .269, z + .014, 0);
      sphere(forest, .018, stemMaterial, x + .038, .27, z - .032, 0);
    } else {
      cylinder(forest, .012, .018, .25, pineMaterials[2], x, .125, z, 3);
      for (let j = 0; j < 4; j++) {
        const pa = j / 4 * Math.PI * 2;
        const petal = sphere(forest, .052, flowerColors[i % 3], x + Math.cos(pa) * .047, .255, z + Math.sin(pa) * .047, 0);
        petal.scale.y = .55;
      }
    }
  }

  // Carved warm lanterns mark the entrance to the clearing.
  const lanternGlow = glowMat(0xffd883, 1.7);
  const lanterns = [[-8.4, 4.8], [7.9, 5.8], [-5.7, -8.6], [5.2, -8.8]];
  lanterns.forEach(([x, z]) => {
    cylinder(forest, .26, .36, .2, darkStoneMat, x, .1, z, 6);
    cylinder(forest, .07, .1, .65, darkBrassMat, x, .48, z, 6);
    cylinder(forest, .22, .22, .28, lanternGlow, x, .91, z, 6);
    cylinder(forest, .32, .23, .12, brassMat, x, 1.1, z, 6);
    mesh(forest, new THREE.ConeGeometry(.33, .24, 6), darkBrassMat, x, 1.25, z);
    for (let j = 0; j < 4; j++) {
      const a = j * Math.PI / 2;
      cylinder(forest, .022, .022, .34, darkBrassMat, x + Math.cos(a) * .18, .92, z + Math.sin(a) * .18, 4);
    }
    const light = new THREE.PointLight(0xffce78, .9, 3.5, 2); light.position.set(x, 1, z); forest.add(light);
  });

  // A small turquoise fairy pool sits beyond the active puzzle at the near edge.
  const pool = new THREE.Group(); pool.position.set(-5.8, .015, 7.8); pool.rotation.y = -.4; forest.add(pool);
  const water = mesh(pool, new THREE.CircleGeometry(1.55, 40), mat(0x397f77, { metalness: .45, roughness: .2, transparent: true, opacity: .88 }), 0, .007, 0);
  water.rotation.x = -Math.PI / 2; water.scale.set(1.15, .7, 1); water.castShadow = false;
  for (let i = 0; i < 17; i++) {
    const a = i / 17 * Math.PI * 2, r = 1.5 + random() * .1;
    const stone = sphere(pool, .24 + random() * .1, rockMat, Math.cos(a) * r * 1.12, .1, Math.sin(a) * r * .69, 0);
    stone.scale.y = .6; stone.rotation.y = random() * 3;
  }
  for (let i = 0; i < 3; i++) {
    const ripple = torus(pool, .25 + i * .23, .008, mat(0x98ccc0, { transparent: true, opacity: .25 }), -.3, .025, .1);
    ripple.rotation.x = -Math.PI / 2;
    ambient.push(t => { ripple.material.opacity = .1 + .12 * Math.sin(t * 1.3 - i); });
  }
  for (let i = 0; i < 3; i++) {
    const lily = cylinder(pool, .19, .19, .015, mat(0x8aab72), .5 + i * .22, .033, -.3 + i * .15, 7);
    lily.rotation.y = i;
    if (i === 1) sphere(pool, .095, flowerColors[1], .72, .095, -.15, 0).scale.y = .65;
  }
  // Three flat stones afford a picturesque passage beside the water.
  for (let i = 0; i < 4; i++) {
    const step = cylinder(forest, .36, .43, .14, stoneMat, -3.9 + i * .7, .06, 8.3 + Math.sin(i) * .2, 6);
    step.scale.z = .65; step.rotation.y = i * .4;
  }

  // Floating spores create subtle life without obscuring the beam paths.
  const sporeCount = 55, sporePositions = new Float32Array(sporeCount * 3), sporeBase = [];
  for (let i = 0; i < sporeCount; i++) {
    const a = random() * Math.PI * 2, r = 3 + random() * 7;
    sporeBase.push([Math.cos(a) * r, .5 + random() * 3.5, Math.sin(a) * r, random() * 6]);
  }
  const sporeGeo = new THREE.BufferGeometry(); sporeGeo.setAttribute('position', new THREE.BufferAttribute(sporePositions, 3));
  const spores = new THREE.Points(sporeGeo, new THREE.PointsMaterial({ color: 0xf2d99a, size: .046, transparent: true, opacity: .68, depthWrite: false }));
  forest.add(spores);
  return {
    group: forest,
    ambientUpdate(t) {
      ambient.forEach(update => update(t));
      for (let i = 0; i < sporeCount; i++) {
        const [x, y, z, phase] = sporeBase[i];
        sporePositions[i * 3] = x + Math.sin(t * .17 + phase) * .3;
        sporePositions[i * 3 + 1] = y + Math.sin(t * .45 + phase) * .22;
        sporePositions[i * 3 + 2] = z + Math.cos(t * .2 + phase) * .24;
      }
      sporeGeo.attributes.position.needsUpdate = true;
    },
  };
}

export function createFox() {
  const fox = new THREE.Group();
  const orange = mat(0xda783b), lightOrange = mat(0xed9752), darkOrange = mat(0xb85028);
  const cream = mat(0xf3dfb4), earInner = mat(0x6e473e), black = mat(0x283a36), white = mat(0xffffff);
  const body = new THREE.Group(); fox.add(body);
  const torso = sphere(body, .36, orange, 0, .47, -.08, 1); torso.scale.set(.73, .95, 1.36);
  const chest = sphere(body, .27, cream, 0, .48, .19, 1); chest.scale.set(.77, 1.05, .55);
  const head = new THREE.Group(); head.position.set(0, .83, .26); body.add(head);
  const skull = sphere(head, .3, lightOrange, 0, 0, 0, 1); skull.scale.set(1.02, .9, 1.02);
  // The pale cheek triangles and pointed muzzle give the fox its signature silhouette.
  for (const side of [-1, 1]) {
    const cheek = sphere(head, .2, cream, side * .14, -.065, .16, 0); cheek.scale.set(.9, .65, 1);
    const ear = mesh(head, new THREE.ConeGeometry(.14, .36, 3), orange, side * .2, .24, -.055);
    ear.rotation.z = -side * .16; ear.rotation.y = Math.PI;
    const inside = mesh(head, new THREE.ConeGeometry(.083, .245, 3), earInner, side * .203, .252, -.005);
    inside.scale.z = .25; inside.rotation.z = -side * .16;
    const eye = sphere(head, .045, black, side * .163, .02, .236, 1); eye.scale.set(.77, 1.08, .65);
    sphere(head, .012, white, side * .16 - .008, .035, .263, 0);
    const brow = box(head, [.07, .022, .018], darkOrange, side * .17, .092, .224); brow.rotation.z = side * .12;
  }
  const muzzle = mesh(head, new THREE.ConeGeometry(.125, .26, 4), cream, 0, -.084, .305);
  muzzle.rotation.x = Math.PI / 2;
  const nose = sphere(head, .056, black, 0, -.077, .432, 0); nose.scale.set(1, .68, .7);
  const legs = [];
  for (let i = 0; i < 4; i++) {
    const side = i % 2 ? 1 : -1, front = i < 2;
    const leg = new THREE.Group(); leg.position.set(side * .185, .4, front ? .2 : -.33); body.add(leg);
    cylinder(leg, .075, .065, .23, orange, 0, -.09, 0, 5);
    cylinder(leg, .065, .073, .15, black, 0, -.265, .018, 5);
    const paw = sphere(leg, .088, black, 0, -.329, .043, 0); paw.scale.set(.85, .55, 1.2);
    legs.push(leg);
  }
  const tail = new THREE.Group(); tail.position.set(0, .5, -.43); body.add(tail);
  const tailBody = sphere(tail, .29, orange, 0, .02, -.3, 1); tailBody.scale.set(.76, .87, 1.8); tailBody.rotation.x = -.15;
  const tailTip = mesh(tail, new THREE.ConeGeometry(.22, .5, 7), cream, 0, .1, -.77);
  tailTip.rotation.x = -Math.PI / 2 - .18;
  tail.rotation.z = -.16;
  const scarf = torus(body, .185, .046, mat(0x477e72), 0, .7, .22); scarf.rotation.x = Math.PI / 2;
  const pendant = sphere(body, .045, glowMat(0xf7da8d, .35), 0, .56, .33, 0);
  fox.userData.animate = (t, moving = false) => {
    const speed = moving ? 12 : 2;
    body.position.y = moving ? Math.abs(Math.sin(t * speed)) * .045 : Math.sin(t * speed) * .011;
    legs.forEach((leg, i) => { leg.rotation.x = moving ? Math.sin(t * speed + (i === 0 || i === 3 ? 0 : Math.PI)) * .48 : 0; });
    tail.rotation.y = Math.sin(t * (moving ? 5 : 1.8)) * (moving ? .25 : .14);
    tail.rotation.x = .12 + Math.sin(t * 2.5) * .055;
    head.rotation.z = moving ? 0 : Math.sin(t * .8) * .028;
    pendant.material.emissiveIntensity = .35 + Math.sin(t * 2) * .12;
  };
  return fox;
}

export function createMirror(data) {
  const group = objectAt(data); pedestal(group, .57);
  const footRing = torus(group, .48, .028, brassMat, 0, .326, 0); footRing.rotation.x = -Math.PI / 2;
  cylinder(group, .07, .12, .52, brassMat, 0, .53, 0, 8);
  const rotor = new THREE.Group(); group.add(rotor);
  const glass = mat(0xc2e4d9, { metalness: .8, roughness: .18, emissive: 0x4a8a88, emissiveIntensity: .16, side: THREE.DoubleSide });
  const backing = cylinder(rotor, .775, .775, .1, darkBrassMat, 0, 1.35, 0, 48); backing.rotation.x = Math.PI / 2; backing.scale.x = 1.14;
  for (const side of [-1, 1]) {
    const surface = mesh(rotor, new THREE.CircleGeometry(.77, 48), glass, 0, 1.35, side * .052); surface.scale.x = 1.14;
    const innerRim = torus(rotor, .737, .015, glowMat(0xf2dfa5, .35), 0, 1.35, side * .068); innerRim.scale.x = 1.14;
  }
  const rim = torus(rotor, .8, .088, brassMat, 0, 1.35, 0); rim.scale.x = 1.14;
  const finial = sphere(rotor, .12, brassMat, 0, 2.24, 0, 0); finial.scale.set(.8, 1.3, .8);
  for (const side of [-1, 1]) {
    sphere(rotor, .09, brassMat, side * .92, 1.35, 0, 1);
    cylinder(rotor, .026, .026, .8, darkBrassMat, side * .87, .89, 0, 6);
  }
  // A diagonal silver glint remains subtle so the actual beam is always readable.
  const glint = box(rotor, [.035, .82, .009], mat(0xf4f3cb, { transparent: true, opacity: .42, depthWrite: false }), -.22, 1.47, .062); glint.rotation.z = -.5;
  const glint2 = box(rotor, [.018, .46, .009], mat(0xf4f3cb, { transparent: true, opacity: .25, depthWrite: false }), -.32, 1.51, .064); glint2.rotation.z = -.5;
  const selectMaterial = glowMat(0xf7df9f, 1.3); selectMaterial.transparent = true; selectMaterial.opacity = .9;
  const selectionRing = torus(group, .75, .024, selectMaterial, 0, .055, 0); selectionRing.rotation.x = -Math.PI / 2; selectionRing.visible = false;
  group.userData.rotor = rotor;
  group.userData.setAngle = degrees => { rotor.rotation.y = -degrees * Math.PI / 180; };
  group.userData.setSelected = value => { selectionRing.visible = value; glass.emissiveIntensity = value ? .32 : .16; };
  group.userData.setAngle(data.angle || 0);
  return group;
}

export function createSource(data) {
  const group = objectAt(data); pedestal(group, .69);
  const color = colorOf(data.color);
  const stone = cylinder(group, .24, .36, .76, darkStoneMat, 0, .69, 0, 6);
  cylinder(group, .33, .3, .12, brassMat, 0, 1.09, 0, 6);
  const sun = new THREE.Group(); sun.position.y = 1.35; group.add(sun);
  // Face the sun aperture perpendicular to the light's outgoing direction.
  sun.rotation.y = Math.atan2(data.dx ?? 1, data.dz ?? 0);
  const glow = glowMat(color, 1.5);
  const core = sphere(sun, .205, glow, 0, 0, 0, 2);
  torus(sun, .35, .045, brassMat);
  torus(sun, .46, .016, darkBrassMat);
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    const ray = mesh(sun, new THREE.ConeGeometry(.053, .18, 4), brassMat, Math.cos(a) * .48, Math.sin(a) * .48, 0);
    ray.rotation.z = a - Math.PI / 2;
  }
  const glowLight = new THREE.PointLight(color, 1.1, 3); glowLight.position.y = 1.45; group.add(glowLight);
  group.userData.core = core; group.userData.stone = stone;
  return group;
}

export function createReceiver(data) {
  const group = objectAt(data); pedestal(group, .61);
  const color = colorOf(data.color);
  cylinder(group, .22, .32, .58, darkStoneMat, 0, .62, 0, 6);
  cylinder(group, .35, .29, .1, brassMat, 0, .94, 0, 6);
  const jewelMat = mat(color, { metalness: .18, roughness: .2, emissive: color, emissiveIntensity: .12 });
  const jewel = mesh(group, new THREE.OctahedronGeometry(.36, 0), jewelMat, 0, 1.35, 0); jewel.scale.y = 1.24;
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2;
    const arm = cylinder(group, .035, .055, .66, brassMat, Math.cos(a) * .31, 1.14, Math.sin(a) * .31, 5);
    arm.rotation.x = Math.sin(a) * .26; arm.rotation.z = -Math.cos(a) * .26;
    sphere(group, .064, brassMat, Math.cos(a) * .4, 1.46, Math.sin(a) * .4, 0);
  }
  const ring = torus(group, .46, .024, brassMat, 0, 1.34, 0); ring.rotation.x = Math.PI / 2;
  const haloMaterial = glowMat(color, 1.2);
  const halo = torus(group, .66, .025, haloMaterial, 0, .038, 0); halo.rotation.x = -Math.PI / 2; halo.visible = false;
  const light = new THREE.PointLight(color, 0, 3); light.position.y = 1.5; group.add(light);
  group.userData.setLit = lit => { jewelMat.emissiveIntensity = lit ? 1.9 : .12; halo.visible = !!lit; light.intensity = lit ? 1.2 : 0; };
  return group;
}

export function createPrism(data) {
  const group = objectAt(data); pedestal(group, .6);
  cylinder(group, .1, .2, .49, brassMat, 0, .54, 0, 6);
  const prismMaterial = mat(0xb8e7da, { metalness: .35, roughness: .12, transparent: true, opacity: .86, emissive: 0x71aabe, emissiveIntensity: .28, side: THREE.DoubleSide });
  const crystal = mesh(group, new THREE.OctahedronGeometry(.55, 0), prismMaterial, 0, 1.35, 0); crystal.scale.set(.85, 1.3, .85); crystal.rotation.y = Math.PI / 4;
  const outline = new THREE.LineSegments(new THREE.EdgesGeometry(crystal.geometry), new THREE.LineBasicMaterial({ color: 0xd1efdf, transparent: true, opacity: .75 })); outline.scale.copy(crystal.scale); outline.position.copy(crystal.position); outline.rotation.copy(crystal.rotation); group.add(outline);
  for (const [x, color] of [[-.3, COLORS.blue], [.3, COLORS.rose]]) sphere(group, .055, glowMat(color), x, .33, .22, 0);
  const orbit = torus(group, .59, .019, brassMat, 0, 1.35, 0); orbit.rotation.x = Math.PI / 2; orbit.rotation.z = .28;
  return group;
}

export function createFilter(data) {
  const group = objectAt(data); pedestal(group, .54);
  const color = colorOf(data.color || 'blue');
  cylinder(group, .075, .12, .6, brassMat, 0, .55, 0, 8);
  const rotor = new THREE.Group(); group.add(rotor); rotor.rotation.y = -(data.angle ?? 90) * Math.PI / 180;
  const film = mesh(rotor, new THREE.CircleGeometry(.56, 6), mat(color, { transparent: true, opacity: .6, emissive: color, emissiveIntensity: .35, metalness: .3, roughness: .15, side: THREE.DoubleSide }), 0, 1.35, 0);
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(film.geometry), new THREE.LineBasicMaterial({ color: 0xf2d995 })); edge.position.copy(film.position); rotor.add(edge);
  torus(rotor, .62, .04, brassMat, 0, 1.35, 0);
  sphere(rotor, .065, glowMat(color, .7), 0, 1.99, 0, 0);
  return group;
}

export function createPlate(data) {
  const group = objectAt(data);
  cylinder(group, .72, .79, .11, darkStoneMat, 0, .045, 0, 8);
  const disk = cylinder(group, .6, .62, .09, brassMat, 0, .12, 0, 8);
  const runeMat = glowMat(0xe1c684, .2);
  const ring = torus(group, .43, .018, runeMat, 0, .171, 0); ring.rotation.x = -Math.PI / 2;
  // Four paw-shaped jewels communicate that a creature must stand here.
  const paw = sphere(group, .115, runeMat, 0, .173, .09, 1); paw.scale.set(1.1, .15, .85);
  for (let i = 0; i < 3; i++) {
    const toe = sphere(group, .048, runeMat, (i - 1) * .095, .174, -.085 + Math.abs(i - 1) * .035, 1); toe.scale.y = .18;
  }
  group.userData.setActive = active => { disk.position.y = active ? .087 : .12; runeMat.emissiveIntensity = active ? 1.6 : .2; runeMat.color.set(active ? 0xacf1d0 : 0xe1c684); };
  return group;
}

export function createObstacle(data) {
  const group = objectAt(data);
  const gate = new THREE.Group(); group.add(gate);
  const width = data.width || (data.radius || .65) * 1.8;
  const depth = (data.radius || .65) * 1.3;
  const slab = box(gate, [width, 1.85, depth], darkStoneMat, 0, .925, 0); slab.rotation.z = .025;
  box(gate, [width + .12, .18, depth + .13], stoneMat, 0, 1.85, 0);
  box(gate, [width + .2, .15, depth + .17], stoneMat, 0, .12, 0);
  const rune = glowMat(0xc5b278, .22);
  const inset = torus(gate, .19, .024, rune, 0, 1.12, depth / 2 + .03);
  box(gate, [.034, .61, .025], rune, 0, .87, depth / 2 + .03);
  for (let i = 0; i < 3; i++) {
    const crack = box(gate, [.25, .014, .013], rockMat, (i % 2 ? -.22 : .24), .44 + i * .45, depth / 2 + .016); crack.rotation.z = .4;
  }
  if (data.plateId) {
    const thornMaterial = mat(0x485343);
    for (let i = 0; i < 5; i++) {
      const branch = cylinder(gate, .032, .069, 1.48, thornMaterial, (i - 2) * width * .2, .86, depth / 2 + .08, 5);
      branch.rotation.z = (i % 2 ? 1 : -1) * .28;
      const thorn = mesh(gate, new THREE.ConeGeometry(.075, .26, 4), thornMaterial, (i - 2) * width * .2 + .1, .82 + (i % 2) * .3, depth / 2 + .14);
      thorn.rotation.z = -.9;
    }
  } else {
    const mossMaterial = mat(0x647b50);
    for (let i = 0; i < 4; i++) {
      const moss = sphere(gate, .16, mossMaterial, (i - 1.5) * width * .22, 1.94, (i % 2 ? -.1 : .1), 0);
      moss.scale.set(1.5, .3, 1);
    }
  }
  if (data.angle !== undefined) group.rotation.y = -data.angle * Math.PI / 180;
  group.userData.setOpen = open => { gate.position.y = open ? -1.79 : 0; inset.material.emissiveIntensity = open ? 1.5 : .22; };
  return group;
}

export function createGate(data) {
  const group = objectAt(data);
  const portal = new THREE.Group(); group.add(portal);
  // Nine voussoirs form an actual open arch rather than a closed ring.
  for (const side of [-1, 1]) {
    box(group, [.57, .22, .82], darkStoneMat, side * 1.02, .11, 0);
    for (let i = 0; i < 3; i++) box(group, [.43 - i * .015, .49, .52], i % 2 ? stoneMat : rockMat, side * 1.02, .46 + i * .49, 0);
    box(group, [.53, .17, .61], brassMat, side * 1.02, 1.77, 0);
  }
  for (let i = 0; i < 9; i++) {
    const a = i / 8 * Math.PI;
    const segment = box(group, [.42, .48, .57], i === 4 ? stoneMat : rockMat, Math.cos(a) * 1.02, 1.81 + Math.sin(a) * 1.02, 0);
    segment.rotation.z = a - Math.PI / 2;
  }
  const gemMaterial = glowMat(0x89d2c5, .15);
  const keystone = mesh(group, new THREE.OctahedronGeometry(.16, 0), gemMaterial, 0, 2.86, .31); keystone.scale.z = .35;
  const portalShape = new THREE.Shape();
  portalShape.moveTo(-.81, .12); portalShape.lineTo(.81, .12); portalShape.lineTo(.81, 1.78); portalShape.absarc(0, 1.78, .81, 0, Math.PI, false); portalShape.lineTo(-.81, .12);
  const portalMaterial = new THREE.MeshBasicMaterial({ color: 0x7ee9ce, transparent: true, opacity: .4, side: THREE.DoubleSide, depthWrite: false });
  const veil = mesh(portal, new THREE.ShapeGeometry(portalShape), portalMaterial, 0, 0, .015); veil.castShadow = false; veil.visible = false;
  const portalInner = new THREE.Line(new THREE.BufferGeometry().setFromPoints(portalShape.getPoints(40).map(p => new THREE.Vector3(p.x, p.y, .032))), new THREE.LineBasicMaterial({ color: 0x9ce7d1, transparent: true, opacity: .23 })); group.add(portalInner);
  const vinesMat = mat(0x315f49);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const leaf = sphere(group, .12, vinesMat, side * (1.22 + Math.sin(i * 1.8) * .12), .55 + i * .35, .24, 0); leaf.scale.set(1.2, .6, .6); leaf.rotation.z = side * .6;
    }
  }
  cylinder(group, .98, 1.09, .14, darkStoneMat, 0, .025, .13, 8).scale.z = .62;
  const light = new THREE.PointLight(0x89ead1, 0, 5); light.position.set(0, 1.5, 0); group.add(light);
  group.userData.setOpen = open => {
    veil.visible = !!open; gemMaterial.emissiveIntensity = open ? 1.8 : .15;
    portalInner.material.opacity = open ? .95 : .23; light.intensity = open ? 2 : 0;
  };
  if (data.angle !== undefined) group.rotation.y = -data.angle * Math.PI / 180;
  return group;
}
