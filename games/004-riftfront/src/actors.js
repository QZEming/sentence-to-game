import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const TEAM = [0x48d9d2, 0xff765f];
const clamp = THREE.MathUtils.clamp;
const mix = THREE.MathUtils.lerp;

function material(color, metalness = 0, roughness = 0.7) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}

function box(parent, mat, size, at = [0, 0, 0], rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  mesh.position.set(...at);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(
  parent,
  mat,
  radius,
  length,
  at,
  alongZ = false,
  radiusTop = radius,
  sides = 10,
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radius, length, sides),
    mat,
  );
  mesh.position.set(...at);
  if (alongZ) mesh.rotation.x = Math.PI / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function bevelBox(parent, mat, size, at, bevel = 0.018) {
  const [outerW, outerH, d] = size;
  const w = outerW - bevel * 2;
  const h = outerH - bevel * 2;
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + bevel, -h / 2);
  shape.lineTo(w / 2 - bevel, -h / 2);
  shape.lineTo(w / 2, -h / 2 + bevel);
  shape.lineTo(w / 2, h / 2 - bevel);
  shape.lineTo(w / 2 - bevel, h / 2);
  shape.lineTo(-w / 2 + bevel, h / 2);
  shape.lineTo(-w / 2, h / 2 - bevel);
  shape.lineTo(-w / 2, -h / 2 + bevel);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: d - bevel * 2,
    bevelEnabled: true,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 1,
    steps: 1,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -d / 2 + bevel);
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(...at);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

// Parts with the same finish share one draw call. Animated parts stay separate.
function batchStatic(group) {
  group.updateMatrixWorld(true);
  const inverse = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const batches = new Map();
  const oldMeshes = [];
  group.traverse((node) => {
    if (!node.isMesh || Array.isArray(node.material)) return;
    const geometry = node.geometry.index
      ? node.geometry.toNonIndexed()
      : node.geometry.clone();
    geometry.applyMatrix4(
      new THREE.Matrix4().multiplyMatrices(inverse, node.matrixWorld),
    );
    if (!batches.has(node.material)) batches.set(node.material, []);
    batches.get(node.material).push(geometry);
    oldMeshes.push(node);
  });
  for (const mesh of oldMeshes) {
    mesh.removeFromParent();
    mesh.geometry.dispose();
  }
  for (const [mat, geometries] of batches) {
    const geometry = mergeGeometries(geometries, false);
    for (const item of geometries) item.dispose();
    if (!geometry) continue;
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
}

function disposeGroup(group) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  group.traverse((mesh) => {
    if (mesh.geometry) geometries.add(mesh.geometry);
    if (mesh.material) {
      for (const mat of Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material]) {
        materials.add(mat);
        if (mat.map) textures.add(mat.map);
      }
    }
  });
  for (const texture of textures) texture.dispose();
  for (const geometry of geometries) geometry.dispose();
  for (const mat of materials) mat.dispose();
  group.removeFromParent();
}

function makeFlash(parent, z, scale = 1) {
  const group = new THREE.Group();
  group.position.z = z;
  const white = new THREE.MeshBasicMaterial({
    color: 0xfff2be,
    transparent: true,
    opacity: 0.94,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const gold = white.clone();
  gold.color.set(0xffa94b);
  const core = new THREE.Mesh(
    new THREE.ConeGeometry(0.052 * scale, 0.25 * scale, 5),
    white,
  );
  core.rotation.x = -Math.PI / 2;
  core.position.z = -0.1 * scale;
  group.add(core);
  for (let i = 0; i < 3; i++) {
    const flare = new THREE.Mesh(
      new THREE.PlaneGeometry(0.26 * scale, 0.26 * scale),
      gold,
    );
    flare.position.z = -0.075 * scale;
    flare.rotation.z = (i * Math.PI) / 3;
    flare.scale.x = 0.25;
    group.add(flare);
  }
  group.visible = false;
  parent.add(group);
  return group;
}

/** Original weapon designs. Receivers sit at the origin, barrels point down -Z. */
function makeWeapon(id, simple = false) {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);
  const dark = material(0x33424d, 0.42, 0.4);
  const rubber = material(0x10181c, 0.02, 0.95);
  const steel = material(0xa4b2b7, 0.58, 0.29);
  const palette = {
    rifle: 0x66818a,
    smg: 0xccd7d1,
    shotgun: 0xbe9970,
    sniper: 0x79866b,
    pistol: 0xadb8be,
  };
  const armor = material(palette[id] || palette.rifle, 0.43, 0.45);
  const color =
    id === "shotgun" ? 0xff804f : id === "sniper" ? 0xc3ed77 : 0x50ddd0;
  const accent = material(color, 0.22, 0.45);
  const glow = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.65,
    metalness: 0.2,
    roughness: 0.3,
  });
  const magazine = new THREE.Group();
  group.add(magazine);
  const slide = new THREE.Group();
  group.add(slide);
  let muzzle = -0.69;
  let support = -0.33;
  let sightHeight = 0.14;
  const receiver = (size, at) =>
    simple ? box(body, armor, size, at) : bevelBox(body, armor, size, at);

  if (id === "pistol") {
    muzzle = -0.32;
    support = 0.07;
    sightHeight = 0.102;
    bevelBox(slide, armor, [0.093, 0.103, 0.38], [0, 0.015, -0.068], 0.012);
    box(body, dark, [0.083, 0.071, 0.23], [0, -0.063, -0.025]);
    box(body, rubber, [0.08, 0.17, 0.105], [0, -0.15, 0.065], [-0.16, 0, 0]);
    box(
      magazine,
      dark,
      [0.078, 0.17, 0.088],
      [0, -0.145, 0.065],
      [-0.16, 0, 0],
    );
    box(magazine, steel, [0.092, 0.023, 0.099], [0, -0.242, 0.083]);
    cylinder(body, dark, 0.027, 0.115, [0, 0.014, -0.275], true);
    box(body, dark, [0.018, 0.018, 0.016], [0, 0.084, -0.235]);
    box(body, glow, [0.012, 0.012, 0.012], [0, 0.095, -0.23]);
    box(body, dark, [0.082, 0.026, 0.018], [0, 0.083, 0.099]);
    for (const x of [-0.028, 0.028])
      box(body, glow, [0.009, 0.009, 0.012], [x, 0.099, 0.102]);
    if (!simple) {
      for (let i = 0; i < 5; i++)
        box(
          slide,
          dark,
          [0.003, 0.06, 0.009],
          [0.048, 0.027, 0.04 + i * 0.014],
        );
      box(body, dark, [0.085, 0.012, 0.103], [0, -0.158, -0.058]);
      box(body, dark, [0.012, 0.08, 0.012], [0.036, -0.12, -0.105]);
    }
  } else {
    const smg = id === "smg";
    const shotgun = id === "shotgun";
    const sniper = id === "sniper";
    const receiverLength = smg ? 0.3 : sniper ? 0.42 : 0.37;
    const receiverWidth = shotgun ? 0.14 : 0.128;
    receiver([receiverWidth, 0.135, receiverLength], [0, 0, -0.035]);
    box(body, dark, [0.1, 0.046, receiverLength + 0.02], [0, -0.072, -0.038]);
    box(body, rubber, [0.077, 0.19, 0.092], [0, -0.17, 0.065], [-0.22, 0, 0]);
    box(body, dark, [0.066, 0.035, 0.15], [0, -0.162, -0.045]);
    box(body, dark, [0.016, 0.084, 0.014], [0.036, -0.127, -0.115]);
    // Stock, comb, and recoil pad.
    const stockZ = smg ? 0.23 : 0.32;
    box(body, dark, [0.066, 0.071, smg ? 0.14 : 0.28], [0, 0, stockZ - 0.045]);
    receiver([0.102, 0.145, smg ? 0.14 : 0.21], [0, -0.025, stockZ + 0.025]);
    box(
      body,
      rubber,
      [0.11, 0.17, 0.038],
      [0, -0.031, stockZ + (smg ? 0.11 : 0.15)],
    );
    box(body, dark, [0.104, 0.036, 0.15], [0, 0.065, stockZ - 0.002]);
    // Handguard and barrel.
    const guardLength = smg ? 0.16 : shotgun ? 0.29 : sniper ? 0.32 : 0.28;
    const guardZ = smg ? -0.23 : -0.33;
    support = guardZ;
    receiver(
      [shotgun ? 0.142 : 0.116, shotgun ? 0.122 : 0.119, guardLength],
      [0, -0.008, guardZ],
    );
    const barrelEnd = smg ? -0.46 : shotgun ? -0.75 : sniper ? -0.96 : -0.7;
    const barrelStart = guardZ - guardLength / 2 + 0.035;
    const barrelLength = Math.abs(barrelEnd - barrelStart);
    cylinder(
      body,
      dark,
      shotgun ? 0.038 : 0.021,
      barrelLength,
      [0, 0.005, (barrelEnd + barrelStart) / 2],
      true,
    );
    muzzle = barrelEnd - (sniper ? 0.055 : 0.03);
    cylinder(
      body,
      dark,
      sniper ? 0.045 : 0.032,
      sniper ? 0.11 : 0.07,
      [0, 0.005, barrelEnd],
      true,
    );
    cylinder(
      body,
      steel,
      sniper ? 0.038 : 0.027,
      0.012,
      [0, 0.005, muzzle + 0.008],
      true,
    );
    cylinder(
      body,
      rubber,
      sniper ? 0.021 : 0.017,
      0.013,
      [0, 0.005, muzzle - 0.001],
      true,
    );
    // Color inlay on the visible side distinguishes the five loadouts at a glance.
    for (const side of [-1, 1])
      box(
        body,
        accent,
        [0.009, 0.036, 0.14],
        [side * (receiverWidth / 2 + 0.004), 0.012, -0.025],
      );
    box(
      body,
      steel,
      [0.012, 0.04, 0.069],
      [receiverWidth / 2 + 0.008, -0.027, 0.07],
    );
    if (shotgun) {
      cylinder(body, dark, 0.03, 0.45, [0, -0.061, -0.4], true);
      for (let i = 0; i < 5; i++)
        cylinder(
          body,
          accent,
          0.016,
          0.07,
          [0.09, 0.021, 0.045 - i * 0.032],
          false,
        );
      box(magazine, dark, [0.091, 0.16, 0.135], [0, -0.15, -0.125]);
      box(magazine, armor, [0.095, 0.03, 0.142], [0, -0.236, -0.125]);
    } else {
      const length = sniper ? 0.13 : smg ? 0.225 : 0.2;
      box(
        magazine,
        dark,
        [0.075, length, smg ? 0.069 : 0.117],
        [0, -0.115 - length / 2, -0.106],
        [smg ? 0 : 0.12, 0, 0],
      );
      box(
        magazine,
        armor,
        [0.082, 0.036, smg ? 0.078 : 0.124],
        [0, -0.115 - length, -0.106],
      );
      if (!simple)
        for (let i = 0; i < 3; i++)
          box(
            magazine,
            steel,
            [0.002, length * 0.58, 0.009],
            [0.04, -0.135 - length / 2, -0.143 + i * 0.033],
            [0.12, 0, 0],
          );
    }
    box(
      body,
      dark,
      [0.052, 0.028, smg ? 0.36 : 0.57],
      [0, 0.089, smg ? -0.1 : -0.14],
    );
    if (sniper) {
      sightHeight = 0.217;
      for (const z of [-0.13, 0.08])
        box(body, dark, [0.076, 0.079, 0.046], [0, 0.139, z]);
      cylinder(body, dark, 0.056, 0.34, [0, 0.214, -0.05], true);
      cylinder(body, armor, 0.076, 0.12, [0, 0.214, -0.239], true, 0.084);
      cylinder(body, dark, 0.067, 0.095, [0, 0.214, 0.157], true);
      const lens = material(0x316b78, 0.88, 0.16);
      cylinder(body, lens, 0.055, 0.007, [0, 0.214, 0.207], true);
      cylinder(body, dark, 0.037, 0.042, [0, 0.286, -0.04]);
      cylinder(body, steel, 0.026, 0.046, [0.071, 0.212, -0.043]);
      if (!simple) {
        for (const x of [-0.054, 0.054])
          box(
            body,
            dark,
            [0.023, 0.03, 0.22],
            [x, -0.083, -0.35],
            [0, 0, x > 0 ? 0.25 : -0.25],
          );
      }
    } else if (!shotgun) {
      // Open reflex sight: the reticle stays framed by a real, hollow housing.
      sightHeight = 0.184;
      box(body, dark, [0.105, 0.026, 0.09], [0, 0.119, -0.015]);
      for (const x of [-0.05, 0.05])
        box(body, armor, [0.014, 0.117, 0.037], [x, 0.178, -0.015]);
      box(body, armor, [0.1, 0.012, 0.037], [0, 0.235, -0.015]);
      if (!simple) {
        const lens = new THREE.MeshPhysicalMaterial({
          color: 0x65c8c2,
          transparent: true,
          opacity: 0.09,
          roughness: 0.16,
          metalness: 0.15,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const pane = new THREE.Mesh(
          new THREE.PlaneGeometry(0.087, 0.092),
          lens,
        );
        pane.position.set(0, 0.183, -0.014);
        body.add(pane);
      }
    } else {
      sightHeight = 0.13;
      box(body, dark, [0.013, 0.066, 0.024], [0, 0.109, -0.453]);
      box(body, glow, [0.012, 0.012, 0.025], [0, 0.146, -0.453]);
      for (const x of [-0.033, 0.033])
        box(body, dark, [0.012, 0.041, 0.032], [x, 0.118, 0.035]);
    }
    if (!simple) {
      for (let i = 0; i < (smg ? 3 : 6); i++) {
        box(
          body,
          rubber,
          [0.004, 0.043, 0.018],
          [0.061, -0.009, guardZ - guardLength / 2 + 0.03 + i * 0.037],
        );
        box(body, steel, [0.07, 0.011, 0.009], [0, 0.108, -0.405 + i * 0.046]);
      }
      for (const z of [-0.12, 0.096]) {
        const pin = cylinder(body, steel, 0.008, 0.003, [
          receiverWidth / 2 + 0.007,
          0.033,
          z,
        ]);
        pin.rotation.z = Math.PI / 2;
      }
      box(
        body,
        rubber,
        [0.011, 0.057, 0.12],
        [receiverWidth / 2 + 0.001, 0.017, -0.11],
      );
    }
  }
  batchStatic(body);
  batchStatic(magazine);
  batchStatic(slide);
  const flash = makeFlash(
    group,
    muzzle,
    id === "shotgun" ? 1.35 : id === "sniper" ? 1.1 : 0.8,
  );
  flash.position.y = id === "pistol" ? 0.014 : 0.005;
  return { group, magazine, slide, flash, muzzle, support, sightHeight };
}

function limb(parent, mat, start, length, width, cuffMat) {
  const pivot = new THREE.Group();
  pivot.position.set(...start);
  parent.add(pivot);
  box(pivot, mat, [width, length, width], [0, -length / 2, 0]);
  if (cuffMat)
    box(
      pivot,
      cuffMat,
      [width * 1.1, length * 0.29, width * 1.08],
      [0, -length * 0.69, width * 0.035],
    );
  return pivot;
}

/** A compact, articulated operator. Local +Z is forward and Y=0 is the sole. */
export function createSoldier(team, { name = "", variant = 0 } = {}) {
  const group = new THREE.Group();
  group.name = name || `operator-${team}`;
  const color = TEAM[team] || TEAM[0];
  const armor = material(color, 0.32, 0.48);
  const cloth = material(team === 0 ? 0x263c4b : 0x493638, 0.06, 0.86);
  const under = material(0x202933, 0.2, 0.67);
  const trim = material(0xd9e5df, 0.5, 0.37);
  const visor = new THREE.MeshStandardMaterial({
    color: 0x101f28,
    metalness: 0.83,
    roughness: 0.17,
    emissive: color,
    emissiveIntensity: 0.13,
  });
  const bright = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.95,
    roughness: 0.4,
  });
  const body = new THREE.Group();
  group.add(body);
  body.position.y = 0.91;
  const torso = new THREE.Group();
  body.add(torso);
  const shell = new THREE.Group();
  torso.add(shell);
  box(shell, cloth, [0.44, 0.46, 0.27], [0, 0.27, 0]);
  bevelBox(shell, armor, [0.4, 0.335, 0.105], [0, 0.29, 0.169], 0.026);
  box(shell, under, [0.32, 0.39, 0.115], [0, 0.28, -0.188]);
  box(shell, armor, [0.3, 0.22, 0.074], [0, 0.32, -0.269]);
  box(shell, under, [0.4, 0.102, 0.34], [0, 0.035, 0.02]);
  for (const x of [-0.11, 0.11]) {
    box(shell, under, [0.093, 0.13, 0.05], [x, 0.215, 0.245]);
    box(shell, trim, [0.03, 0.08, 0.005], [x, 0.238, 0.273]);
  }
  box(shell, bright, [0.16, 0.026, 0.012], [0, 0.43, 0.226]);
  batchStatic(shell);
  const head = new THREE.Group();
  head.position.y = 0.67;
  torso.add(head);
  bevelBox(head, armor, [0.325, 0.29, 0.32], [0, 0, 0.015], 0.047);
  bevelBox(head, visor, [0.298, 0.107, 0.052], [0, -0.009, 0.184], 0.018);
  box(head, under, [0.223, 0.065, 0.037], [0, -0.108, 0.168]);
  box(
    head,
    trim,
    [0.062, 0.014, 0.24],
    [variant % 2 ? 0.056 : -0.056, 0.156, 0.018],
  );
  for (const x of [-0.184, 0.184])
    box(head, under, [0.057, 0.124, 0.13], [x, -0.001, 0]);
  batchStatic(head);
  const leftArm = limb(torso, cloth, [-0.27, 0.42, 0], 0.33, 0.145, armor);
  const rightArm = limb(torso, cloth, [0.27, 0.42, 0], 0.33, 0.145, armor);
  const leftFore = limb(leftArm, under, [0, -0.3, 0], 0.28, 0.125, armor);
  const rightFore = limb(rightArm, under, [0, -0.3, 0], 0.28, 0.125, armor);
  box(leftFore, under, [0.119, 0.11, 0.135], [0, -0.3, 0.019]);
  box(rightFore, under, [0.119, 0.11, 0.135], [0, -0.3, 0.019]);
  const leftLeg = limb(body, cloth, [-0.119, -0.033, 0], 0.43, 0.167, armor);
  const rightLeg = limb(body, cloth, [0.119, -0.033, 0], 0.43, 0.167, armor);
  const leftShin = limb(leftLeg, under, [0, -0.43, 0], 0.37, 0.146, armor);
  const rightShin = limb(rightLeg, under, [0, -0.43, 0], 0.37, 0.146, armor);
  box(leftShin, under, [0.18, 0.145, 0.3], [0, -0.375, 0.062]);
  box(rightShin, under, [0.18, 0.145, 0.3], [0, -0.375, 0.062]);
  // Combine each rigid arm/leg section without merging its child joint.
  for (const part of [leftFore, rightFore, leftShin, rightShin])
    batchStatic(part);
  let weaponId =
    variant % 3 === 1 ? "smg" : variant % 3 === 2 ? "shotgun" : "rifle";
  let weapon = makeWeapon(weaponId, true);
  const weaponPivot = new THREE.Group();
  torso.add(weaponPivot);
  weaponPivot.position.set(0.15, 0.24, 0.38);
  weapon.group.rotation.y = Math.PI;
  weapon.group.scale.setScalar(0.75);
  weaponPivot.add(weapon.group);
  // Small overhead armor/health bar: normal depth testing keeps it behind cover.
  const health = new THREE.Group();
  health.position.set(0, 2.02, 0);
  const barBack = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 0.055),
    new THREE.MeshBasicMaterial({
      color: 0x17222a,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    }),
  );
  const bar = new THREE.Mesh(
    new THREE.PlaneGeometry(0.54, 0.027),
    new THREE.MeshBasicMaterial({ color, depthWrite: false }),
  );
  bar.position.z = 0.002;
  health.add(barBack, bar);
  group.add(health);
  const shield = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.4, 1.05, 3, 8),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
      wireframe: true,
    }),
  );
  shield.position.y = 0.96;
  group.add(shield);
  let flashLife = 0;
  let lastFire = 0;
  let lastShoot = 0;
  let gait = variant * 1.74;

  return {
    group,
    update(dt, entity, time, camera) {
      group.visible = entity.alive !== false;
      if (!group.visible) return;
      if (
        entity.weapon &&
        entity.weapon !== weaponId &&
        ["rifle", "smg", "shotgun", "sniper", "pistol"].includes(entity.weapon)
      ) {
        disposeGroup(weapon.group);
        weaponId = entity.weapon;
        weapon = makeWeapon(weaponId, true);
        weapon.group.rotation.y = Math.PI;
        weapon.group.scale.setScalar(0.75);
        weaponPivot.add(weapon.group);
      }
      group.position.set(entity.x || 0, entity.y || 0, entity.z || 0);
      group.rotation.y = entity.yaw || 0;
      const slide = entity.slideTimer > 0;
      const crouch = entity.crouching || entity.height < 1.45;
      const speed = entity.speed || Math.hypot(entity.vx || 0, entity.vz || 0);
      const moving = clamp(speed / 4.5, 0, 1);
      gait += dt * speed * 2.65;
      const gaitSin = Math.sin(gait);
      const duck = slide ? 0.64 : crouch ? 0.51 : 0;
      body.position.y = 0.91 - duck + Math.abs(gaitSin) * 0.031 * moving;
      torso.scale.y = slide ? 0.72 : 1;
      torso.rotation.x = slide
        ? -0.25
        : crouch
          ? 0.16
          : entity.sprinting
            ? 0.08
            : 0;
      torso.rotation.z = Math.cos(gait) * 0.035 * moving;
      head.rotation.x = clamp(-(entity.pitch || 0), -0.6, 0.6) * 0.7;
      const bend = crouch ? 1.2 : 0;
      leftLeg.rotation.x = gaitSin * 0.71 * moving - bend;
      rightLeg.rotation.x = -gaitSin * 0.71 * moving - bend;
      leftShin.rotation.x = Math.max(0, -gaitSin) * 0.65 * moving + bend * 2;
      rightShin.rotation.x = Math.max(0, gaitSin) * 0.65 * moving + bend * 2;
      if (slide) {
        leftLeg.rotation.x = -1.45;
        rightLeg.rotation.x = -1.32;
        leftShin.rotation.x = 0.3;
        rightShin.rotation.x = 2.64;
      }
      if (entity.onGround === false) {
        leftLeg.rotation.x = -0.31;
        rightLeg.rotation.x = 0.2;
        leftShin.rotation.x = 0.68;
        rightShin.rotation.x = 0.48;
      }
      const reload = entity.reloadTimer > 0;
      const reloading = reload ? Math.sin(time * 7) : 0;
      const pitch = clamp(entity.pitch || 0, -0.8, 0.8);
      leftArm.rotation.set(-0.92 - pitch * 0.6, -0.1, 0.57);
      rightArm.rotation.set(-0.1 - pitch * 0.6, 0.04, -0.25);
      leftFore.rotation.x = reload ? -0.75 + reloading * 0.35 : -0.5;
      rightFore.rotation.x = -1.44;
      weaponPivot.rotation.set(-pitch, reload ? -0.18 : 0, reload ? -0.4 : 0);
      weaponPivot.position.y = 0.24 + (reload ? -0.08 : 0);
      const fire = entity.fireTimer || 0;
      const shoot = entity.shootTimer || entity.flash || 0;
      if (fire > lastFire + 0.015 || shoot > lastShoot + 0.015)
        flashLife = 0.05;
      lastFire = fire;
      lastShoot = shoot;
      flashLife = Math.max(0, flashLife - dt);
      weapon.flash.visible = flashLife > 0;
      weaponPivot.position.z = 0.38 - (flashLife > 0 ? 0.035 : 0);
      weapon.flash.rotation.z = time * 83;
      const ratio = clamp(entity.health / (entity.maxHealth || 100), 0, 1);
      bar.scale.x = ratio;
      bar.position.x = (ratio - 1) * 0.27;
      health.position.y = (entity.height || 1.8) + 0.22;
      if (camera) {
        const cameraWorld = camera.getWorldPosition(new THREE.Vector3());
        health.lookAt(cameraWorld);
        health.visible =
          group.position.distanceTo(cameraWorld) < (team === 0 ? 28 : 18);
      }
      shield.visible = entity.invulnerable > 0;
      shield.material.opacity = 0.045 + Math.sin(time * 8) * 0.02;
    },
    flash() {
      flashLife = 0.075;
    },
    dispose() {
      disposeGroup(group);
    },
  };
}

function makeGlove(parent, at, left = false) {
  const glove = new THREE.Group();
  glove.position.set(...at);
  parent.add(glove);
  const cloth = material(0x253a41, 0.05, 0.82);
  const gloveMat = material(0x323d43, 0.14, 0.73);
  const armor = material(0x80a3a5, 0.35, 0.55);
  const strap = material(0x161f25, 0.03, 0.91);
  bevelBox(glove, gloveMat, [0.088, 0.091, 0.109], [0, 0, 0], 0.012);
  box(glove, armor, [0.062, 0.029, 0.075], [0, 0.055, 0.004]);
  for (let i = 0; i < 3; i++)
    box(glove, strap, [0.079, 0.014, 0.012], [0, -0.025, -0.031 + i * 0.027]);
  box(
    glove,
    gloveMat,
    [0.038, 0.065, 0.068],
    [left ? -0.05 : 0.05, 0.006, -0.015],
    [0, 0, left ? -0.34 : 0.34],
  );
  const forearm = cylinder(
    glove,
    cloth,
    0.065,
    0.38,
    [0.04 * (left ? -1 : 1), -0.11, 0.18],
    false,
    0.048,
  );
  forearm.rotation.x = -1.0;
  forearm.rotation.z = left ? -0.22 : 0.22;
  const cuff = cylinder(
    glove,
    strap,
    0.066,
    0.048,
    [0, -0.045, 0.071],
    false,
    0.058,
  );
  cuff.rotation.x = -1.0;
  if (left) {
    box(
      glove,
      armor,
      [0.075, 0.019, 0.078],
      [-0.01, -0.013, 0.133],
      [-0.25, 0, 0],
    );
    box(
      glove,
      new THREE.MeshStandardMaterial({
        color: 0x62ffe4,
        emissive: 0x29bfa5,
        emissiveIntensity: 0.4,
      }),
      [0.047, 0.006, 0.043],
      [-0.01, 0.002, 0.133],
      [-0.25, 0, 0],
    );
  }
  batchStatic(glove);
  return glove;
}

/** Attach to a dedicated, fixed-FOV overlay camera; render after clearDepth(). */
export function createViewModel(camera) {
  const group = new THREE.Group();
  group.name = "first-person-weapon";
  camera.add(group);
  const rig = new THREE.Group();
  group.add(rig);
  const weapons = new Map();
  for (const id of ["rifle", "smg", "shotgun", "sniper", "pistol"]) {
    const model = makeWeapon(id);
    model.group.visible = false;
    rig.add(model.group);
    weapons.set(id, model);
  }
  const rightHand = makeGlove(rig, [0.01, -0.174, 0.088]);
  const leftHand = makeGlove(rig, [-0.032, -0.092, -0.32], true);
  const muzzleLight = new THREE.PointLight(0xffb75e, 0, 2.2, 2);
  rig.add(muzzleLight);
  let current = null;
  let model = null;
  let flashLife = 0;
  let kick = 0;
  let ads = 0;
  let sprint = 0;
  let switchPose = 0;
  let lastFire = 0;
  let walk = 0;
  let swayX = 0;
  let swayY = 0;
  let lastYaw = null;
  let lastPitch = null;
  let lastReload = 0;
  let reloadTotal = 1;

  function setWeapon(id) {
    if (!weapons.has(id) || current === id) return;
    if (model) {
      model.group.visible = false;
      model.flash.visible = false;
    }
    current = id;
    model = weapons.get(id);
    model.group.visible = true;
    switchPose = 1;
    flashLife = 0;
    lastReload = 0;
    lastFire = 0;
  }

  function flash() {
    flashLife = 0.067;
    kick = Math.min(
      1.6,
      kick +
        (current === "shotgun"
          ? 1.05
          : current === "sniper"
            ? 1.25
            : current === "pistol"
              ? 0.74
              : 0.5),
    );
  }

  setWeapon("rifle");
  switchPose = 0;
  return {
    group,
    setWeapon,
    flash,
    update(dt, player, time) {
      if (player.weapon && current !== player.weapon) setWeapon(player.weapon);
      if (!model) return;
      const delta = clamp(dt || 0, 0, 0.12);
      const smooth = 1 - Math.exp(-delta * 14);
      ads = mix(
        ads,
        player.aiming && !player.reloadTimer && !player.sprinting ? 1 : 0,
        smooth,
      );
      sprint = mix(sprint, player.sprinting ? 1 : 0, smooth);
      switchPose = Math.max(0, switchPose - delta * 3.9);
      kick *= Math.exp(-delta * 15);
      flashLife = Math.max(0, flashLife - delta);
      // Keep the scope mask clean once the camera has settled into the optic.
      group.visible =
        player.alive !== false && !(current === "sniper" && ads > 0.87);
      const fire = player.fireTimer || 0;
      if (fire > lastFire + 0.017 && flashLife <= 0) flash();
      lastFire = fire;
      model.flash.visible = flashLife > 0;
      model.flash.rotation.z = time * 121;
      const flashScale = 0.8 + Math.sin(time * 187) * 0.18;
      model.flash.scale.setScalar(flashScale);
      muzzleLight.position.set(0, 0.07, model.muzzle + 0.025);
      muzzleLight.intensity =
        flashLife > 0 ? (current === "shotgun" ? 2.7 : 1.6) : 0;
      const speed = player.speed || Math.hypot(player.vx || 0, player.vz || 0);
      const moving = clamp(speed / 5, 0, 1);
      walk += delta * speed * 2.7;
      const bob = moving * (1 - ads * 0.88);
      const yaw = player.yaw || 0;
      const pitch = player.pitch || 0;
      if (lastYaw !== null && delta > 0) {
        const yawDelta = Math.atan2(
          Math.sin(yaw - lastYaw),
          Math.cos(yaw - lastYaw),
        );
        swayX = mix(swayX, clamp(yawDelta / delta, -2, 2) * -0.013, smooth);
        swayY = mix(
          swayY,
          clamp((pitch - lastPitch) / delta, -2, 2) * -0.013,
          smooth,
        );
      }
      lastYaw = yaw;
      lastPitch = pitch;
      const pistol = current === "pistol";
      // In ADS the real sight line (not the receiver) is centered on the reticle.
      const baseX = pistol ? 0.2 : 0.265;
      const baseY = pistol ? -0.18 : -0.235;
      const baseZ = pistol ? -0.73 : current === "sniper" ? -1.01 : -0.9;
      group.position.set(
        mix(baseX, 0, ads) +
          Math.sin(walk) * 0.012 * bob +
          swayX * (1 - ads * 0.75),
        mix(baseY, -model.sightHeight, ads) +
          Math.abs(Math.cos(walk)) * 0.012 * bob +
          swayY -
          sprint * 0.095 -
          switchPose * 0.32,
        mix(baseZ, pistol ? -0.55 : -0.64, ads) + kick * 0.043,
      );
      group.rotation.set(
        (1 - ads) * 0.035 + kick * 0.055 + sprint * 0.3 + switchPose * 0.65,
        mix(0.075, 0, ads),
        Math.sin(walk) * 0.018 * bob - sprint * 0.33,
      );
      const reload = player.reloadTimer || 0;
      if (reload > lastReload + 0.02)
        reloadTotal = player.reloadDuration || reload;
      lastReload = reload;
      const progress =
        reload > 0 ? clamp(1 - reload / Math.max(0.1, reloadTotal), 0, 1) : 0;
      const tilt = reload > 0 ? Math.sin(Math.PI * progress) : 0;
      rig.rotation.set(-0.13 * tilt, -0.16 * tilt, 0.62 * tilt);
      rig.position.set(-0.027 * tilt, -0.055 * tilt, 0.07 * tilt);
      const magOut =
        reload > 0
          ? Math.sin(clamp((progress - 0.1) / 0.7, 0, 1) * Math.PI)
          : 0;
      model.magazine.position.set(
        -magOut * 0.055,
        -magOut * 0.34,
        magOut * 0.04,
      );
      model.magazine.rotation.z = -magOut * 0.17;
      model.slide.position.z = pistol ? kick * 0.036 : 0;
      rightHand.position.set(
        pistol ? 0 : 0.01,
        pistol ? -0.145 : -0.174,
        pistol ? 0.076 : 0.088,
      );
      rightHand.rotation.set(pistol ? 0.04 : 0, 0, 0);
      leftHand.position.set(
        (pistol ? -0.038 : -0.032) - magOut * 0.034,
        (pistol ? -0.153 : -0.092) - magOut * 0.29,
        mix(pistol ? 0.062 : model.support, -0.085, tilt),
      );
      leftHand.rotation.set(
        pistol ? 0.08 : 0,
        pistol ? -0.3 : 0,
        -magOut * 0.35,
      );
      if (player.meleeTimer > 0) {
        const punch = Math.sin(clamp(player.meleeTimer / 0.35, 0, 1) * Math.PI);
        rig.position.z -= punch * 0.24;
        rig.rotation.y -= punch * 0.3;
      }
      if (player.slideTimer > 0) {
        group.position.y -= 0.07;
        group.rotation.z -= 0.22;
      }
    },
    dispose() {
      disposeGroup(group);
    },
  };
}
