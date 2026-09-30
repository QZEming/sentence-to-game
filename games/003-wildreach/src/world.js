import * as THREE from "three";
import {
  WORLD,
  heightAt,
  regionAt,
  LOCATIONS,
  SOLIDS,
  TREES,
  RESOURCE_SPAWNS,
  CHESTS,
} from "./data.js";

// A deliberately small palette ties the procedural landscape together. Geometry
// with the same silhouette/material is batched, including the village details.
const PALETTE = {
  meadow: 0x86ad63,
  forest: 0x507f58,
  lake: 0x95b785,
  desert: 0xd9bc83,
  snow: 0xd9e8dd,
  ruins: 0x859b7e,
  stone: 0xe5debd,
  stoneDark: 0xa5ab97,
  wood: 0x735338,
  roof: 0xb86745,
  foliage: 0x427853,
};
const hash = (x, z, seed = 0) => {
  const n = Math.sin(x * 127.1 + z * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
};
const dummy = new THREE.Object3D();
const tempColor = new THREE.Color();
const materials = new Map();
function material(color, options = {}) {
  const key = `${color}:${JSON.stringify(options)}`;
  if (!materials.has(key))
    materials.set(
      key,
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.93,
        ...options,
      }),
    );
  return materials.get(key);
}
const geometries = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cylinder: new THREE.CylinderGeometry(1, 1, 1, 8),
  cone: new THREE.ConeGeometry(1, 1, 7),
  sphere: new THREE.IcosahedronGeometry(1, 1),
  rock: new THREE.IcosahedronGeometry(1, 0),
};

export function createWorld(scene) {
  const group = new THREE.Group();
  scene.add(group);
  const batches = new Map();
  const add = (
    shape,
    color,
    x,
    y,
    z,
    sx = 1,
    sy = 1,
    sz = 1,
    rx = 0,
    ry = 0,
    rz = 0,
  ) => {
    const key = `${shape}:${color}`;
    if (!batches.has(key)) batches.set(key, { shape, color, transforms: [] });
    batches.get(key).transforms.push([x, y, z, sx, sy, sz, rx, ry, rz]);
  };
  const box = (color, x, y, z, sx, sy, sz, ry = 0) =>
    add("box", color, x, y, z, sx, sy, sz, 0, ry);
  const paths = [
    [
      [0, 48],
      [0, 31],
      [-10, 18],
      [-29, 8],
      [-51, -9],
    ],
    [
      [0, 31],
      [20, 17],
      [38, -3],
      [55, -29],
    ],
    [
      [-29, 8],
      [-42, -25],
      [-59, -65],
    ],
    [
      [0, 31],
      [16, 35],
      [28, 46],
    ],
  ];
  function pathDistance(x, z) {
    let nearest = 1e3;
    for (const path of paths)
      for (let i = 1; i < path.length; i++) {
        const a = path[i - 1];
        const b = path[i];
        const dx = b[0] - a[0];
        const dz = b[1] - a[1];
        const t = THREE.MathUtils.clamp(
          ((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz),
          0,
          1,
        );
        nearest = Math.min(
          nearest,
          Math.hypot(x - a[0] - t * dx, z - a[1] - t * dz),
        );
      }
    return nearest;
  }
  const groundGeo = new THREE.PlaneGeometry(WORLD.size, WORLD.size, 160, 160);
  groundGeo.rotateX(-Math.PI / 2);
  const position = groundGeo.attributes.position;
  const groundColors = new Float32Array(position.count * 3);
  const pathColor = new THREE.Color(0xc5b990);
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const z = position.getZ(i);
    const y = heightAt(x, z);
    const region = regionAt(x, z);
    position.setY(i, y);
    tempColor.set(PALETTE[region] || PALETTE.meadow);
    const variation =
      hash(x, z) * 0.095 + Math.sin(x * 0.06 + z * 0.08) * 0.035;
    tempColor.offsetHSL(variation * 0.05, variation * 0.2, variation - 0.045);
    if (y < WORLD.water + 0.7) tempColor.lerp(pathColor, 0.55);
    if (pathDistance(x, z) < 1.8 && region !== "snow" && y > WORLD.water) {
      tempColor.lerp(pathColor, 0.75);
    }
    tempColor.toArray(groundColors, i * 3);
  }
  groundGeo.setAttribute("color", new THREE.BufferAttribute(groundColors, 3));
  groundGeo.computeVertexNormals();
  const ground = new THREE.Mesh(
    groundGeo,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
  );
  ground.receiveShadow = true;
  group.add(ground);

  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x65c4bf,
    transparent: true,
    opacity: 0.81,
    roughness: 0.24,
    metalness: 0.1,
    depthWrite: false,
  });
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD.size, WORLD.size, 36, 36),
    waterMat,
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = WORLD.water;
  water.receiveShadow = true;
  group.add(water);
  const ripplePositions = [];
  for (let i = 0; i < 170; i++) {
    const x = (hash(i, 40) - 0.5) * 216;
    const z = (hash(i, 41) - 0.5) * 216;
    if (heightAt(x, z) > WORLD.water - 0.25) continue;
    const length = 0.6 + hash(i, 42) * 1.8;
    ripplePositions.push(x - length, 0, z, x + length, 0, z);
  }
  const rippleGeo = new THREE.BufferGeometry();
  rippleGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(ripplePositions, 3),
  );
  const ripples = new THREE.LineSegments(
    rippleGeo,
    new THREE.LineBasicMaterial({
      color: 0xd8ece0,
      transparent: true,
      opacity: 0.4,
    }),
  );
  ripples.position.y = WORLD.water + 0.055;
  group.add(ripples);

  // A mountain silhouette behind the playable island gives the horizon depth.
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const radius = 146 + hash(i, 1) * 18;
    const h = 18 + hash(i, 2) * 29;
    add(
      "cone",
      i % 3 ? 0x99b7b1 : 0xadc6bc,
      Math.sin(a) * radius,
      h * 0.22 - 5,
      Math.cos(a) * radius,
      18 + hash(i, 4) * 16,
      h,
      18 + hash(i, 5) * 16,
      0,
      a,
    );
  }

  for (const tree of TREES) {
    const { x, z } = tree;
    const s = tree.scale || 1;
    // The south entrance is a clearing, keeping the initial chase camera and
    // both village roofs visible instead of burying them inside pine branches.
    if (Math.abs(x) < 16 && z > 44 && z < 65) continue;
    const y = heightAt(x, z);
    const region = regionAt(x, z);
    if (y < WORLD.water + 0.1) continue;
    const pine = tree.type === "pine" || region === "snow";
    const desert = region === "desert" || tree.type === "palm";
    add("cylinder", PALETTE.wood, x, y + 1.5 * s, z, 0.24 * s, 3 * s, 0.24 * s);
    if (pine) {
      for (let j = 0; j < 3; j++) {
        const r = (2.25 - j * 0.5) * s;
        add(
          "cone",
          region === "snow" && j > 0 ? 0xd7e8db : 0x416b5b,
          x,
          y + (2.7 + j * 1.2) * s,
          z,
          r,
          3.6 * s,
          r,
        );
      }
    } else if (desert) {
      for (let j = 0; j < 5; j++) {
        const a = (j * Math.PI * 2) / 5;
        add(
          "sphere",
          0x899d57,
          x + Math.sin(a) * s,
          y + 3.4 * s,
          z + Math.cos(a) * s,
          0.45 * s,
          0.22 * s,
          2.1 * s,
          0,
          a,
          0.25,
        );
      }
    } else {
      const color =
        tree.type === "gold" || hash(x, z, 2) > 0.83
          ? 0xadb858
          : hash(x, z) > 0.5
            ? 0x528453
            : 0x6a945b;
      add("sphere", color, x, y + 3.7 * s, z, 2.05 * s, 2.1 * s, 1.9 * s);
      add(
        "sphere",
        color,
        x - 0.9 * s,
        y + 3.1 * s,
        z + 0.3 * s,
        1.45 * s,
        1.4 * s,
        1.45 * s,
      );
    }
  }

  // Small details stay instanced: wildflowers, grass tufts, stones and reeds.
  for (let i = 0; i < 1350; i++) {
    const x = (hash(i, 11) - 0.5) * 211;
    const z = (hash(i, 12) - 0.5) * 211;
    const y = heightAt(x, z);
    const region = regionAt(x, z);
    if (
      SOLIDS.some(
        (s) =>
          Math.abs(x - s.x) < s.width / 2 + 1 &&
          Math.abs(z - s.z) < s.depth / 2 + 1,
      )
    )
      continue;
    if (y < WORLD.water + 0.15 || pathDistance(x, z) < 2) continue;
    if (region === "snow" || region === "desert" || i % 8 === 0) {
      const scale = 0.16 + hash(i, 15) * 0.8;
      add(
        "rock",
        region === "snow" ? 0xbac9bd : 0x9c9f87,
        x,
        y + scale * 0.25,
        z,
        scale,
        scale * 0.6,
        scale * 0.8,
      );
    } else if (i % 3 === 0) {
      add(
        "sphere",
        i % 2 ? 0xe9db8b : 0xddb8a4,
        x,
        y + 0.25,
        z,
        0.14,
        0.15,
        0.14,
      );
      add("cylinder", 0x68894f, x, y + 0.12, z, 0.035, 0.24, 0.035);
    } else {
      add(
        "cone",
        i % 2 ? 0x7f9e56 : 0x9bb360,
        x,
        y + 0.24,
        z,
        0.2,
        0.55,
        0.15,
        0,
        hash(i, 16) * 6,
      );
    }
  }

  // Solid dimensions are shared with locomotion, so every wall can be climbed
  // to the same visible roof height, without invisible decorative obstacles.
  for (const solid of SOLIDS) {
    const { x, z, width: w, depth: d, height: h } = solid;
    const y = heightAt(x, z);
    const tower = solid.id.includes("tower");
    const hut =
      solid.id.includes("hut") ||
      solid.id.includes("house") ||
      solid.id.includes("shop");
    // The cap owns the roof surface at y + h. Ending the wall below that cap
    // prevents coplanar beige/terracotta faces from flickering in the menu.
    const wallHeight = h - (tower ? 0.32 : 0.24);
    box(
      tower ? PALETTE.stone : hut ? 0xe8dfbe : PALETTE.stoneDark,
      x,
      y + wallHeight / 2,
      z,
      w,
      wallHeight,
      d,
    );
    if (tower) {
      box(PALETTE.stoneDark, x, y + 0.25, z, w + 0.65, 0.5, d + 0.65);
      box(PALETTE.stone, x, y + h - 0.16, z, w + 0.5, 0.32, d + 0.5);
      for (let j = 1; j < h; j += 1.6) {
        box(0xc4bea1, x, y + j, z + d / 2 + 0.013, w, 0.07, 0.026);
      }
      for (const side of [-1, 1]) {
        box(
          0x3c7773,
          x + side * w * 0.28,
          y + h * 0.66,
          z + d / 2 + 0.04,
          0.34,
          h * 0.38,
          0.035,
        );
        box(
          PALETTE.wood,
          x + side * 0.36,
          y + h / 2,
          z + d / 2 + 0.12,
          0.07,
          h,
          0.09,
        );
      }
      for (let step = 0.4; step < h; step += 0.45)
        box(0xc4bea1, x, y + step, z + d / 2 + 0.16, 0.78, 0.075, 0.11);
    } else if (hut) {
      // Flat terracotta tile roofs retain a usable, collision-aligned rooftop.
      box(PALETTE.roof, x, y + h - 0.12, z, w + 0.6, 0.24, d + 0.6);
      for (const side of [-1, 1]) {
        box(
          PALETTE.wood,
          x + side * w * 0.38,
          y + h * 0.47,
          z + d / 2 + 0.03,
          0.16,
          h * 0.9,
          0.09,
        );
        box(
          0x3d6d66,
          x + side * w * 0.23,
          y + h * 0.57,
          z + d / 2 + 0.04,
          w * 0.15,
          h * 0.27,
          0.1,
        );
      }
      box(PALETTE.wood, x, y + 1.02, z + d / 2 + 0.06, 0.9, 2.04, 0.12);
      box(0xcdb880, x, y + 0.08, z + d / 2 + 0.5, 1.6, 0.16, 0.9);
    } else {
      box(PALETTE.stone, x, y + h - 0.12, z, w + 0.2, 0.24, d + 0.2);
      box(0x719172, x, y + h + 0.02, z, w * 0.8, 0.04, d * 0.85);
    }
  }

  const beaconViews = [];
  const towerViews = [];
  const flameViews = [];
  const ringGeo = new THREE.TorusGeometry(1, 0.035, 4, 32);
  for (const location of LOCATIONS) {
    // Leave the exact spawn point beside the campfire clear for the adventurer.
    const loc =
      location.type === "camp" ? { ...location, z: location.z - 2 } : location;
    const { x, z } = loc;
    const y = heightAt(x, z);
    if (loc.type === "beacon") {
      const color =
        loc.id === "wind" ? 0x9adfcd : loc.id === "ember" ? 0xffb66d : 0xaddffd;
      add("cylinder", PALETTE.stone, x, y + 0.12, z, 3.2, 0.24, 3.2);
      add("cylinder", PALETTE.stoneDark, x, y + 0.4, z, 1.1, 0.6, 1.1);
      add("cylinder", PALETTE.stone, x, y + 1.45, z, 0.55, 1.7, 0.55);
      const gem = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.65),
        material(color, {
          emissive: color,
          emissiveIntensity: 0.65,
          roughness: 0.3,
        }),
      );
      gem.position.set(x, y + 3.15, z);
      group.add(gem);
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.26, 0.65, 60, 12, 1, true),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.08,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      beam.position.set(x, y + 32, z);
      group.add(beam);
      const halo = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.65,
        }),
      );
      halo.position.set(x, y + 2.7, z);
      halo.rotation.x = Math.PI / 2;
      halo.scale.setScalar(1.35);
      group.add(halo);
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2 + Math.PI / 4;
        box(
          PALETTE.stone,
          x + Math.sin(a) * 2.35,
          y + 1.2,
          z + Math.cos(a) * 2.35,
          0.35,
          2.4,
          0.35,
          a,
        );
      }
      beaconViews.push({ id: loc.id, gem, beam, halo, baseY: y });
    } else if (loc.type === "tower") {
      const solid = SOLIDS.find(
        (s) =>
          s.id === loc.id || (Math.abs(s.x - x) < 3 && Math.abs(s.z - z) < 3),
      );
      const top = y + (solid?.height || 9);
      const orb = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.5),
        material(0x91d3c0, {
          emissive: 0x67aa95,
          emissiveIntensity: 0.6,
        }).clone(),
      );
      orb.position.set(x, top + 1, z);
      group.add(orb);
      towerViews.push({ id: loc.id, orb, y: top + 1 });
      add("cylinder", PALETTE.wood, x + 1.15, top + 1.6, z, 0.055, 3.2, 0.055);
      box(0x478e83, x + 1.7, top + 2.6, z, 1.05, 0.65, 0.035);
    } else if (loc.type === "camp" || loc.type === "cook") {
      for (let j = 0; j < 7; j++) {
        const a = (j * Math.PI * 2) / 7;
        add(
          "rock",
          PALETTE.stoneDark,
          x + Math.sin(a) * 0.72,
          y + 0.12,
          z + Math.cos(a) * 0.72,
          0.27,
          0.22,
          0.23,
        );
      }
      add(
        "cylinder",
        PALETTE.wood,
        x,
        y + 0.15,
        z,
        0.15,
        1.25,
        0.15,
        0,
        0,
        Math.PI / 2,
      );
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.36, 0.85, 5),
        material(0xffb867, { emissive: 0xff7435, emissiveIntensity: 1.3 }),
      );
      flame.position.set(x, y + 0.6, z);
      group.add(flame);
      flameViews.push({ flame, y: y + 0.6 });
      if (loc.type === "cook") {
        add("sphere", 0x505c58, x, y + 0.7, z, 0.55, 0.32, 0.55);
        for (const side of [-1, 1])
          add(
            "cylinder",
            PALETTE.wood,
            x + side * 0.8,
            y + 0.95,
            z,
            0.06,
            1.9,
            0.06,
          );
        add(
          "cylinder",
          PALETTE.wood,
          x,
          y + 1.9,
          z,
          0.06,
          1.8,
          0.06,
          0,
          0,
          Math.PI / 2,
        );
      }
    } else if (loc.type === "shop") {
      box(0xa47e51, x, y + 0.42, z, 2.6, 0.84, 1.15);
      box(0xd9c58e, x, y + 0.9, z, 2.85, 0.14, 1.4);
      for (const side of [-1, 1])
        box(PALETTE.wood, x + side * 1.3, y + 1.5, z, 0.1, 3, 0.1);
      box(0x83a78b, x, y + 3, z, 3.1, 0.15, 2.1);
      for (let j = 0; j < 5; j++)
        add(
          "sphere",
          j % 2 ? 0xc8a764 : 0xc96f4d,
          x - 0.9 + j * 0.42,
          y + 1.1,
          z,
          0.16,
          0.2,
          0.16,
        );
    } else if (loc.type === "npc") {
      // The courier has a distinct saffron poncho and a parcel cart.
      add("cylinder", 0xcead58, x, y + 0.85, z, 0.32, 1.1, 0.32);
      add("sphere", 0xc99775, x, y + 1.62, z, 0.24, 0.27, 0.24);
      add("cone", 0x746846, x, y + 1.91, z, 0.38, 0.26, 0.38);
      for (const side of [-1, 1])
        box(0x51483a, x + side * 0.15, y + 0.2, z, 0.17, 0.4, 0.2);
      box(0x9b7952, x + 1.2, y + 0.48, z, 0.95, 0.7, 0.8);
      box(0xbbaa7a, x + 1.2, y + 0.96, z, 0.6, 0.26, 0.56);
    } else if (loc.type === "boss") {
      // The arena is a decorative paving layer, not a raised collision solid.
      // Follow the same terrain function as actors so feet never sink below it.
      const arenaGeometry = new THREE.RingGeometry(0, 10, 64, 8);
      arenaGeometry.rotateX(-Math.PI / 2);
      const arenaPositions = arenaGeometry.attributes.position;
      for (let i = 0; i < arenaPositions.count; i++) {
        arenaPositions.setY(
          i,
          heightAt(x + arenaPositions.getX(i), z + arenaPositions.getZ(i)) +
            0.03,
        );
      }
      arenaGeometry.computeVertexNormals();
      const arenaFloor = new THREE.Mesh(arenaGeometry, material(0x89918b));
      arenaFloor.position.set(x, 0, z);
      arenaFloor.receiveShadow = true;
      group.add(arenaFloor);
      for (let j = 0; j < 10; j++) {
        const a = j * Math.PI * 0.2;
        // Keep the south approach open so the chase camera can see the duel.
        if (Math.cos(a) > 0.35) continue;
        add(
          "cylinder",
          PALETTE.stone,
          x + Math.sin(a) * 9.4,
          y + 2.4,
          z + Math.cos(a) * 9.4,
          0.62,
          4.8,
          0.62,
        );
      }
    }
  }

  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(1.65, 1.65, 0.11, 8),
    material(0x87b7a9, { emissive: 0x254a40, emissiveIntensity: 0.4 }),
  );
  plate.position.set(-51, heightAt(-51, -9) + 0.09, -9);
  group.add(plate);
  const torchY = heightAt(55, -29);
  add("cylinder", PALETTE.wood, 55, torchY + 0.7, -29, 0.18, 1.4, 0.18);
  const emberFlame = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 1.25, 6),
    material(0xffaf56, { emissive: 0xff723a, emissiveIntensity: 1.5 }),
  );
  emberFlame.position.set(55, torchY + 1.8, -29);
  emberFlame.visible = false;
  group.add(emberFlame);
  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.9),
    material(0x8cd8e2, {
      emissive: 0x3c95b7,
      emissiveIntensity: 0.5,
      roughness: 0.2,
    }),
  );
  crystal.position.set(-59, heightAt(-59, -65) + 1.4, -65);
  crystal.scale.set(0.65, 1.3, 0.65);
  group.add(crystal);

  for (const { shape, color, transforms } of batches.values()) {
    const mesh = new THREE.InstancedMesh(
      geometries[shape],
      material(color),
      transforms.length,
    );
    transforms.forEach((t, index) => {
      dummy.position.set(t[0], t[1], t[2]);
      dummy.scale.set(t[3], t[4], t[5]);
      dummy.rotation.set(t[6], t[7], t[8]);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.computeBoundingSphere();
    group.add(mesh);
  }

  const pickupColors = {
    apple: 0xdc7458,
    mushroom: 0xd5ad85,
    herb: 0xaacb63,
    wood: 0xa78755,
    ore: 0x97c2c2,
    meat: 0xe1a693,
    coin: 0xe7c264,
    arrow: 0xc5d9b2,
    spirit: 0x9de5cc,
  };
  const pickupMeshes = new Map();
  for (const type of new Set([
    ...RESOURCE_SPAWNS.map((p) => p.type),
    ...Object.keys(pickupColors),
  ])) {
    const mesh = new THREE.InstancedMesh(
      type === "wood" || type === "arrow" ? geometries.box : geometries.rock,
      material(pickupColors[type] || 0xebce91, {
        emissive: pickupColors[type] || 0xebce91,
        emissiveIntensity: 0.18,
      }),
      256,
    );
    mesh.count = 0;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    group.add(mesh);
    pickupMeshes.set(type, mesh);
  }
  const chestViews = new Map();
  for (const chest of CHESTS) {
    const c = new THREE.Group();
    const y = heightAt(chest.x, chest.z);
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 0.58, 0.72),
      material(0x99734b),
    );
    body.position.y = 0.29;
    const lid = new THREE.Group();
    lid.position.set(0, 0.59, -0.36);
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(1.09, 0.18, 0.76),
      material(0xc3a36a),
    );
    top.position.z = 0.36;
    lid.add(top);
    const lock = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.3, 0.06),
      material(0xe5cc83),
    );
    lock.position.set(0, 0.5, 0.39);
    c.add(body, lid, lock);
    c.position.set(chest.x, y, chest.z);
    group.add(c);
    chestViews.set(chest.id, { group: c, lid });
  }
  const metal = new THREE.Group();
  const metalBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    material(0x869b99, { metalness: 0.45, roughness: 0.45 }),
  );
  metalBody.position.y = 0.75;
  metalBody.castShadow = true;
  metal.add(metalBody);
  const metalEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(metalBody.geometry),
    new THREE.LineBasicMaterial({ color: 0xd4ead4 }),
  );
  metalEdges.position.y = 0.75;
  metal.add(metalEdges);
  group.add(metal);
  const iceColumns = new THREE.InstancedMesh(
    geometries.box,
    material(0x99e5ed, {
      transparent: true,
      opacity: 0.73,
      roughness: 0.22,
      metalness: 0.05,
      emissive: 0x3f858e,
      emissiveIntensity: 0.2,
    }),
    3,
  );
  iceColumns.count = 0;
  iceColumns.frustumCulled = false;
  iceColumns.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  group.add(iceColumns);

  const clouds = new THREE.InstancedMesh(
    geometries.sphere,
    new THREE.MeshStandardMaterial({
      color: 0xf5f1da,
      roughness: 1,
      flatShading: false,
    }),
    90,
  );
  for (let i = 0; i < 90; i++) {
    const cluster = Math.floor(i / 5);
    const part = i % 5;
    dummy.position.set(
      (hash(cluster, 20) - 0.5) * 245 + part * 3.4,
      45 + hash(cluster, 21) * 16,
      (hash(cluster, 22) - 0.5) * 245,
    );
    dummy.scale.set(4.2 + hash(i, 23) * 2, 1.6 + hash(i, 24), 3.2);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    clouds.setMatrixAt(i, dummy.matrix);
  }
  group.add(clouds);
  const sun = new THREE.DirectionalLight(0xffeed2, 2.8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -36,
    right: 36,
    top: 36,
    bottom: -36,
    near: 1,
    far: 170,
  });
  sun.shadow.bias = -0.0007;
  sun.shadow.normalBias = 0.055;
  scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight(0xd7eee4, 0x6f8563, 2.3);
  scene.add(hemi);
  scene.background = new THREE.Color(0xb9d9d1);
  scene.fog = new THREE.Fog(0xb9d9d1, 100, 235);
  const daySky = new THREE.Color(0xb9d9d1);
  const nightSky = new THREE.Color(0x233d51);
  const stormSky = new THREE.Color(0x748e93);
  const starPositions = [];
  for (let i = 0; i < 240; i++) {
    const azimuth = hash(i, 51) * Math.PI * 2;
    const altitude = 0.12 + hash(i, 52) * 1.35;
    starPositions.push(
      Math.sin(azimuth) * Math.cos(altitude) * 225,
      Math.sin(altitude) * 225,
      Math.cos(azimuth) * Math.cos(altitude) * 225,
    );
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3),
  );
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      color: 0xf6edcb,
      size: 0.42,
      transparent: true,
      opacity: 0,
      fog: false,
      depthWrite: false,
    }),
  );
  group.add(stars);

  const weatherPositions = new Float32Array(650 * 3);
  const weatherGeo = new THREE.BufferGeometry();
  weatherGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(weatherPositions, 3),
  );
  const weatherMat = new THREE.PointsMaterial({
    color: 0xd6edf1,
    size: 0.12,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const weatherParticles = new THREE.Points(weatherGeo, weatherMat);
  weatherParticles.frustumCulled = false;
  group.add(weatherParticles);
  let elapsed = 0;
  let lowQuality = false;
  let frame = 0;

  return {
    update(dt, state) {
      elapsed += dt;
      frame++;
      if (!state) return;
      const p = state.player;
      const daylight = THREE.MathUtils.clamp(
        Math.sin(((state.time - 6) / 24) * Math.PI * 2) * 1.2,
        0,
        1,
      );
      const rainy = state.weather !== "clear";
      const stormy = state.weather === "storm";
      const lightning =
        stormy &&
        state.effects?.some(
          (effect) => effect.type === "lightning" && effect.life > 0,
        );
      scene.background.copy(nightSky).lerp(daySky, daylight);
      if (rainy) {
        tempColor.copy(stormSky).multiplyScalar(0.38 + daylight * 0.62);
        scene.background.lerp(tempColor, stormy ? 0.65 : 0.36);
      }
      if (lightning) scene.background.lerp(tempColor.set(0xe4eeee), 0.55);
      stars.material.opacity = (1 - daylight) * (rainy ? 0.18 : 0.8);
      stars.visible = stars.material.opacity > 0.02;
      scene.fog.color.copy(scene.background);
      scene.fog.near = stormy ? 70 : rainy ? 85 : 100;
      scene.fog.far = stormy ? 195 : rainy ? 215 : 235;
      hemi.intensity = 0.65 + daylight * 1.7;
      sun.intensity =
        (0.18 + daylight * 2.7) * (stormy ? 0.42 : rainy ? 0.65 : 1) +
        (lightning ? 2 : 0);
      sun.color.set(daylight < 0.3 ? 0xd4dfed : 0xffeed2);
      sun.position.set(p.x + 36, 62 + daylight * 20, p.z + 28);
      sun.target.position.set(p.x, 0, p.z);
      clouds.position.x = Math.sin(elapsed * 0.008) * 12;
      clouds.material.color.set(
        stormy ? 0xaab8b4 : rainy ? 0xc5cec4 : 0xf5f1da,
      );
      water.position.y = WORLD.water + Math.sin(elapsed * 0.7) * 0.025;
      ripples.position.y = water.position.y + 0.045;
      ripples.material.opacity = 0.3 + Math.sin(elapsed * 0.5) * 0.1;
      waterMat.color.set(daylight > 0.3 ? 0x65c4bf : 0x467d89);
      for (const view of beaconViews) {
        const activated = state.progress.beacons.includes(view.id);
        view.gem.rotation.y = elapsed * 0.5;
        view.gem.position.y =
          view.baseY + 3.15 + Math.sin(elapsed * 1.4) * 0.16;
        view.beam.material.opacity = activated
          ? 0.22 + Math.sin(elapsed * 2) * 0.025
          : 0.07;
        view.halo.rotation.z = elapsed * 0.4;
        view.halo.scale.setScalar(activated ? 1.65 : 1.35);
      }
      for (const view of towerViews) {
        view.orb.rotation.y = elapsed * 0.7;
        view.orb.position.y = view.y + Math.sin(elapsed * 1.5) * 0.12;
        view.orb.material.emissiveIntensity = state.progress.towers.includes(
          view.id,
        )
          ? 1.1
          : 0.25;
      }
      for (const { flame, y } of flameViews) {
        flame.scale.set(
          1 + Math.sin(elapsed * 8) * 0.1,
          1 + Math.sin(elapsed * 12) * 0.12,
          1,
        );
        flame.position.y = y + Math.sin(elapsed * 9) * 0.04;
      }
      emberFlame.visible = state.puzzles.ember;
      emberFlame.scale.y = 1 + Math.sin(elapsed * 10) * 0.12;
      plate.material.emissiveIntensity = state.puzzles.wind ? 1.3 : 0.3;
      crystal.rotation.y = elapsed * 0.45;
      crystal.material.emissiveIntensity = state.puzzles.frost ? 1.8 : 0.4;
      const block = state.objects.find((o) => o.id === "wind-block");
      if (block) {
        metal.position.set(
          block.x,
          block.y ?? heightAt(block.x, block.z),
          block.z,
        );
        metalBody.material.emissive.set(block.held ? 0x407a84 : 0x000000);
      }
      iceColumns.count = 0;
      for (const object of state.objects) {
        if (object.type !== "ice" || iceColumns.count === 3) continue;
        dummy.position.set(object.x, object.y + 0.625, object.z);
        // Match iceFloor's 1.9m half-width, including the outer walkable lip.
        dummy.scale.set(3.8, 1.25, 3.8);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        iceColumns.setMatrixAt(iceColumns.count++, dummy.matrix);
      }
      iceColumns.instanceMatrix.needsUpdate = true;
      for (const chest of state.chests) {
        const view = chestViews.get(chest.id);
        if (!view) continue;
        view.lid.rotation.x = THREE.MathUtils.damp(
          view.lid.rotation.x,
          chest.open ? -1.75 : 0,
          8,
          dt,
        );
      }
      // Resource transforms are cheap; throttle them in the adaptive graphics mode.
      if (!lowQuality || frame % 2 === 0) {
        for (const mesh of pickupMeshes.values()) mesh.count = 0;
        for (const pickup of state.pickups) {
          if (!pickup.active) continue;
          const mesh = pickupMeshes.get(pickup.type);
          if (!mesh || mesh.count >= 256) continue;
          const wood = pickup.type === "wood";
          dummy.position.set(
            pickup.x,
            (pickup.y ?? heightAt(pickup.x, pickup.z)) +
              0.34 +
              Math.sin(elapsed * 2 + pickup.x) * 0.1,
            pickup.z,
          );
          dummy.scale.set(
            wood ? 0.62 : 0.28,
            wood ? 0.2 : 0.3,
            wood ? 0.23 : 0.28,
          );
          dummy.rotation.set(wood ? 0.12 : 0, elapsed * 0.6 + pickup.z, 0);
          dummy.updateMatrix();
          mesh.setMatrixAt(mesh.count++, dummy.matrix);
        }
        for (const mesh of pickupMeshes.values())
          mesh.instanceMatrix.needsUpdate = true;
      }
      const snowy = regionAt(p.x, p.z) === "snow";
      weatherParticles.visible = rainy || snowy;
      if (weatherParticles.visible) {
        const count = lowQuality ? 280 : 650;
        weatherGeo.setDrawRange(0, count);
        weatherMat.size = snowy ? 0.13 : 0.065;
        for (let i = 0; i < count; i++) {
          weatherPositions[i * 3] =
            p.x +
            (hash(i, 30) - 0.5) * 48 +
            Math.sin(elapsed + i) * (snowy ? 0.8 : 0.1);
          weatherPositions[i * 3 + 1] =
            p.y +
            ((((hash(i, 31) * 24 - elapsed * (snowy ? 1.2 : 14)) % 24) + 24) %
              24) -
            2;
          weatherPositions[i * 3 + 2] = p.z + (hash(i, 32) - 0.5) * 48;
        }
        weatherGeo.attributes.position.needsUpdate = true;
      }
    },
    setQuality(low) {
      lowQuality = low;
      sun.castShadow = !low;
      // Keep every landmark and tree: only expensive shading is reduced.
      waterMat.roughness = low ? 0.65 : 0.24;
    },
    dispose() {
      scene.remove(group, sun, sun.target, hemi);
      group.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
      });
    },
  };
}
