import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const TAU = Math.PI * 2;
const clamp = THREE.MathUtils.clamp;
const material = (color, roughness = 0.75, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, ...extra });

function mesh(geometry, mat, parent, x = 0, y = 0, z = 0) {
  const object = new THREE.Mesh(geometry, mat);
  object.position.set(x, y, z);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

function ellipsoid(parent, mat, x, y, z, sx, sy, sz, segments = 12) {
  const object = mesh(
    new THREE.SphereGeometry(1, segments, 8),
    mat,
    parent,
    x,
    y,
    z,
  );
  object.scale.set(sx, sy, sz);
  return object;
}

function joint(parent, x, y, z) {
  const object = new THREE.Group();
  object.position.set(x, y, z);
  parent.add(object);
  return object;
}

function limb(parent, mat, length, radiusTop, radiusBottom, y = 0) {
  return mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, length, 8),
    mat,
    parent,
    0,
    y - length / 2,
    0,
  );
}

function merged(parent, geometries, mat) {
  const geometry = mergeGeometries(geometries);
  geometries.forEach((part) => part.dispose());
  return mesh(geometry, mat, parent);
}

function lineBetween(a, b, radius = 0.003, sides = 5) {
  const direction = new THREE.Vector3().subVectors(b, a);
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    direction.length(),
    sides,
  );
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );
  geometry.applyQuaternion(quaternion);
  geometry.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
  return geometry;
}

function racket(parent, palette) {
  const group = joint(parent, 0, -0.025, 0);
  group.rotation.z = Math.PI;
  const graphite = material("#243348", 0.34, { metalness: 0.65 });
  const silver = material("#c6e4e6", 0.26, { metalness: 0.7 });
  const grip = material("#f4eee0");
  mesh(
    new THREE.CylinderGeometry(0.025, 0.023, 0.145, 8),
    grip,
    group,
    0,
    0.055,
    0,
  );
  mesh(
    new THREE.CylinderGeometry(0.008, 0.01, 0.25, 7),
    graphite,
    group,
    0,
    0.22,
    0,
  );
  const frame = mesh(
    new THREE.TorusGeometry(1, 0.055, 5, 28),
    palette.accent,
    group,
    0,
    0.5,
    0,
  );
  frame.scale.set(0.184, 0.249, 0.184);
  const inner = mesh(
    new THREE.TorusGeometry(1, 0.017, 4, 28),
    graphite,
    group,
    0,
    0.5,
    0,
  );
  inner.scale.set(0.171, 0.235, 0.171);
  const stringPoints = [];
  for (let i = -6; i <= 6; i += 1) {
    const x = i * 0.024;
    const yExtent = 0.233 * Math.sqrt(1 - (x / 0.17) ** 2);
    stringPoints.push(x, 0.5 - yExtent, 0, x, 0.5 + yExtent, 0);
  }
  for (let i = -8; i <= 8; i += 1) {
    const y = i * 0.025;
    const xExtent = 0.17 * Math.sqrt(1 - (y / 0.233) ** 2);
    stringPoints.push(-xExtent, 0.5 + y, 0.001, xExtent, 0.5 + y, 0.001);
  }
  const strings = new THREE.BufferGeometry();
  strings.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(stringPoints, 3),
  );
  group.add(
    new THREE.LineSegments(
      strings,
      new THREE.LineBasicMaterial({
        color: "#d7e5e3",
        transparent: true,
        opacity: 0.76,
      }),
    ),
  );
  const throat = [
    lineBetween(
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(-0.071, 0.28, 0),
      0.007,
    ),
    lineBetween(
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(0.071, 0.28, 0),
      0.007,
    ),
  ];
  merged(group, throat, silver);
  const wraps = [];
  for (let i = 0; i < 5; i += 1) {
    const wrap = new THREE.TorusGeometry(0.025, 0.002, 3, 8);
    wrap.rotateX(Math.PI / 2);
    wrap.translate(0, 0.003 + i * 0.026, 0);
    wraps.push(wrap);
  }
  merged(group, wraps, graphite);
  return group;
}

/** Local forward is +Z. The public root's position and orientation belong to the game. */
export function createAthlete({
  color = "#18b7a8",
  accent = "#d4ef6a",
  skin = "#d7a77c",
} = {}) {
  const group = new THREE.Group();
  group.name = "badminton-athlete";
  const body = joint(group, 0, 0, 0);
  const palette = {
    shirt: material(color),
    accent: material(accent),
    skin: material(skin),
    shorts: material("#21334a"),
    white: material("#f8f4e8"),
    sole: material("#acc2c4"),
    hair: material("#292322"),
    eye: material("#23282c"),
    blush: material("#b87960"),
  };
  // A shaped torso, rather than a capsule, gives the jersey a shoulder line and waist.
  const torso = joint(body, 0, 0.99, 0);
  const profile = [
    new THREE.Vector2(0.18, 0),
    new THREE.Vector2(0.2, 0.12),
    new THREE.Vector2(0.25, 0.4),
    new THREE.Vector2(0.23, 0.47),
    new THREE.Vector2(0.105, 0.51),
  ];
  const jersey = mesh(
    new THREE.LatheGeometry(profile, 12),
    palette.shirt,
    torso,
  );
  jersey.scale.z = 0.65;
  ellipsoid(torso, palette.shorts, 0, -0.035, 0, 0.214, 0.115, 0.13);
  mesh(
    new THREE.CylinderGeometry(0.073, 0.095, 0.115, 10),
    palette.skin,
    torso,
    0,
    0.54,
    0,
  );
  const collar = mesh(
    new THREE.TorusGeometry(0.088, 0.014, 4, 12),
    palette.accent,
    torso,
    0,
    0.517,
    0,
  );
  collar.rotation.x = Math.PI / 2;
  // Jersey trim and crest remain legible from the elevated follow camera.
  const chestTrim = mesh(
    new THREE.BoxGeometry(0.32, 0.038, 0.012),
    palette.accent,
    torso,
    0,
    0.33,
    0.154,
  );
  chestTrim.rotation.z = -0.13;
  mesh(
    new THREE.BoxGeometry(0.035, 0.095, 0.012),
    palette.white,
    torso,
    -0.097,
    0.2,
    0.146,
  );
  mesh(
    new THREE.BoxGeometry(0.069, 0.026, 0.012),
    palette.white,
    torso,
    -0.08,
    0.24,
    0.146,
  );
  const rearStripes = [-0.045, 0.045].map((x) =>
    new THREE.BoxGeometry(0.025, 0.18, 0.012).translate(x, 0.22, -0.15),
  );
  merged(torso, rearStripes, palette.accent);

  const head = joint(torso, 0, 0.69, 0);
  ellipsoid(head, palette.skin, 0, 0, 0, 0.16, 0.195, 0.145, 16);
  ellipsoid(head, palette.skin, 0, -0.022, 0.14, 0.035, 0.036, 0.034, 8);
  ellipsoid(head, palette.skin, -0.155, -0.006, 0, 0.032, 0.053, 0.025, 8);
  ellipsoid(head, palette.skin, 0.155, -0.006, 0, 0.032, 0.053, 0.025, 8);
  for (const side of [-1, 1]) {
    ellipsoid(
      head,
      palette.white,
      side * 0.064,
      0.028,
      0.127,
      0.032,
      0.02,
      0.018,
      8,
    );
    ellipsoid(
      head,
      palette.eye,
      side * 0.064,
      0.028,
      0.144,
      0.012,
      0.014,
      0.006,
      8,
    );
  }
  const details = [
    lineBetween(
      new THREE.Vector3(-0.091, 0.07, 0.128),
      new THREE.Vector3(-0.042, 0.075, 0.14),
      0.007,
    ),
    lineBetween(
      new THREE.Vector3(0.042, 0.075, 0.14),
      new THREE.Vector3(0.091, 0.07, 0.128),
      0.007,
    ),
  ];
  merged(head, details, palette.hair);
  merged(
    head,
    [
      lineBetween(
        new THREE.Vector3(-0.035, -0.081, 0.123),
        new THREE.Vector3(0.035, -0.081, 0.123),
        0.006,
      ),
    ],
    palette.blush,
  );
  const hair = mesh(
    new THREE.SphereGeometry(1, 14, 6, 0, TAU, 0, Math.PI * 0.48),
    palette.hair,
    head,
    0,
    0.022,
    -0.009,
  );
  hair.scale.set(0.165, 0.182, 0.153);
  ellipsoid(head, palette.hair, -0.05, 0.158, 0.065, 0.12, 0.053, 0.097, 10);
  const band = mesh(
    new THREE.CylinderGeometry(0.162, 0.166, 0.039, 16, 1, true),
    palette.accent,
    head,
    0,
    0.099,
    -0.006,
  );
  band.scale.z = 0.9;
  // A little tied cloth knot gives both silhouettes a sporting profile.
  const knot = mesh(
    new THREE.BoxGeometry(0.043, 0.058, 0.024),
    palette.accent,
    head,
    0.09,
    0.054,
    -0.141,
  );
  knot.rotation.z = 0.35;

  const arms = [];
  const legs = [];
  for (const side of [-1, 1]) {
    const shoulder = joint(torso, side * 0.245, 0.425, 0);
    ellipsoid(shoulder, palette.shirt, 0, -0.03, 0, 0.1, 0.12, 0.09);
    limb(shoulder, palette.skin, 0.29, 0.065, 0.049, -0.045);
    const sleeve = limb(shoulder, palette.shirt, 0.12, 0.091, 0.08, 0.006);
    sleeve.scale.z = 0.98;
    const elbow = joint(shoulder, 0, -0.32, 0);
    ellipsoid(elbow, palette.skin, 0, 0, 0, 0.052, 0.053, 0.05, 8);
    limb(elbow, palette.skin, 0.265, 0.052, 0.037);
    const wrist = joint(elbow, 0, -0.267, 0);
    mesh(
      new THREE.CylinderGeometry(0.041, 0.042, 0.064, 8),
      palette.white,
      elbow,
      0,
      -0.214,
      0,
    );
    ellipsoid(wrist, palette.skin, 0, -0.025, 0.009, 0.043, 0.06, 0.033, 8);
    if (side === -1) racket(wrist, palette);
    arms.push({ shoulder, elbow, wrist, side });

    const hip = joint(body, side * 0.119, 0.947, 0);
    limb(hip, palette.skin, 0.39, 0.083, 0.065);
    limb(hip, palette.shorts, 0.205, 0.112, 0.094, 0.012);
    const trim = mesh(
      new THREE.BoxGeometry(0.018, 0.178, 0.095),
      palette.accent,
      hip,
      side * 0.098,
      -0.095,
      0,
    );
    trim.rotation.z = side * 0.05;
    const knee = joint(hip, 0, -0.405, 0);
    ellipsoid(knee, palette.skin, 0, 0, 0.004, 0.062, 0.063, 0.063, 8);
    limb(knee, palette.skin, 0.37, 0.062, 0.043);
    mesh(
      new THREE.CylinderGeometry(0.06, 0.048, 0.17, 8),
      palette.white,
      knee,
      0,
      -0.295,
      0,
    );
    mesh(
      new THREE.CylinderGeometry(0.061, 0.061, 0.023, 8),
      palette.accent,
      knee,
      0,
      -0.228,
      0,
    );
    const shoe = joint(knee, 0, -0.405, 0.05);
    ellipsoid(shoe, palette.white, 0, 0, 0, 0.074, 0.063, 0.145, 10);
    mesh(
      new THREE.BoxGeometry(0.139, 0.026, 0.25),
      palette.sole,
      shoe,
      0,
      -0.04,
      0.012,
    );
    const laceParts = [0, 0.029, 0.058].map((z) =>
      new THREE.BoxGeometry(0.071, 0.008, 0.009).translate(
        0,
        0.053 - z * 0.18,
        z,
      ),
    );
    merged(shoe, laceParts, palette.accent);
    legs.push({ hip, knee, side });
  }

  let clock = 0;
  let gait = 0;
  const pose = (dt, state = {}) => {
    const delta = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.1);
    clock = Number.isFinite(state.time) ? state.time : clock + delta;
    const speed = clamp(state.speed || 0, 0, 1);
    const energy = clamp(state.energy ?? 1, 0, 1);
    gait += delta * (6.5 + speed * 8.5);
    const stride = Math.sin(gait);
    const breathing = Math.sin(clock * 2.8) * 0.007;
    body.position.y =
      -0.071 + Math.abs(Math.sin(gait)) * speed * 0.035 + breathing;
    body.rotation.set(
      -0.06 - speed * 0.09 - (1 - energy) * 0.08,
      Math.sin(gait) * speed * 0.055,
      0,
    );
    torso.rotation.set(0, Math.sin(gait) * speed * 0.055, 0);
    head.rotation.set(
      0.035 + (1 - energy) * 0.055,
      -torso.rotation.y * 0.65,
      0,
    );
    for (const leg of legs) {
      const cycle = stride * leg.side;
      leg.hip.rotation.set(cycle * speed * 0.57 - 0.06, 0, leg.side * 0.055);
      leg.knee.rotation.set(0.105 + Math.max(0, -cycle) * speed * 0.78, 0, 0);
    }
    for (const arm of arms) {
      arm.shoulder.rotation.set(
        -0.22 - stride * arm.side * speed * 0.42,
        0,
        arm.side * 0.15,
      );
      arm.elbow.rotation.set(-0.28 - speed * 0.24, 0, 0);
      arm.wrist.rotation.set(0, 0, 0);
    }
    const striking = arms[0];
    const balancing = arms[1];
    if (state.serving) {
      striking.shoulder.rotation.set(0.15, -0.15, -0.26);
      striking.elbow.rotation.x = -0.62;
      striking.wrist.rotation.z = -0.18;
      balancing.shoulder.rotation.x = -0.85;
      balancing.elbow.rotation.x = -0.45;
      torso.rotation.y = -0.11;
    }
    const swing = clamp(state.swing || 0, 0, 0.45);
    if (swing > 0) {
      const progress = 1 - swing / 0.45;
      const hit = Math.sin(Math.PI * progress);
      const follow = Math.sin(Math.PI * Math.min(1, progress * 1.45));
      if (state.shot === "smash") {
        striking.shoulder.rotation.set(
          -2.7 + progress * 2.12,
          -0.35 + progress * 0.65,
          -0.36 + hit * 0.17,
        );
        striking.elbow.rotation.x = -0.68 * (1 - follow) - 0.1;
        striking.wrist.rotation.x = -0.65 * follow;
        balancing.shoulder.rotation.set(-1.42 + progress, 0, 0.65);
        torso.rotation.set(
          0.04 + hit * 0.19,
          -0.25 + progress * 0.6,
          -hit * 0.08,
        );
        body.position.y += hit * 0.11;
      } else if (state.shot === "drop") {
        striking.shoulder.rotation.set(-1.94 + progress * 0.78, 0.22, -0.31);
        striking.elbow.rotation.x = -0.55 + follow * 0.41;
        striking.wrist.rotation.x = -0.42 * follow;
        balancing.shoulder.rotation.set(-0.45, 0, 0.45);
        torso.rotation.y = -0.17 + follow * 0.24;
      } else {
        striking.shoulder.rotation.set(
          -0.4 - follow * 0.85,
          -0.6 + progress * 1.2,
          -0.66 + follow * 0.31,
        );
        striking.elbow.rotation.x = -0.75 + follow * 0.57;
        striking.wrist.rotation.y = follow * 0.65;
        balancing.shoulder.rotation.z = 0.48;
        torso.rotation.y = -0.32 + progress * 0.7;
      }
      head.rotation.y = -torso.rotation.y * 0.4;
    }
    if (state.winner) {
      body.position.y += Math.max(0, Math.sin(clock * 7)) * 0.08;
      body.rotation.x = -0.04;
      striking.shoulder.rotation.set(
        -2.92,
        0,
        -0.27 + Math.sin(clock * 8) * 0.07,
      );
      striking.elbow.rotation.x = -0.12;
      balancing.shoulder.rotation.set(-2.34, 0, 0.68);
      balancing.elbow.rotation.x = -0.75;
      head.rotation.x = -0.13;
    }
  };
  pose(0);
  return { group, update: pose };
}

/** The cork points along +Y before the flight orientation is applied. */
export function createShuttle() {
  const group = new THREE.Group();
  group.name = "feather-shuttlecock";
  const feathers = material("#fffaf0", 0.82, { side: THREE.DoubleSide });
  const ribs = material("#ccd9d7");
  const cork = material("#e8c49a", 0.86);
  const white = material("#f7f4e8");
  mesh(
    new THREE.SphereGeometry(0.051, 12, 7, 0, TAU, 0, Math.PI / 2),
    cork,
    group,
    0,
    0.021,
    0,
  );
  mesh(
    new THREE.CylinderGeometry(0.051, 0.043, 0.038, 12),
    white,
    group,
    0,
    0.003,
    0,
  );
  mesh(
    new THREE.CylinderGeometry(0.045, 0.048, 0.017, 12),
    material("#153d42"),
    group,
    0,
    -0.024,
    0,
  );
  const featherParts = [];
  const ribParts = [];
  for (let i = 0; i < 16; i += 1) {
    const angle = (i / 16) * TAU;
    const radial = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
    const tangent = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
    const a = radial.clone().multiplyScalar(0.039).setY(-0.034);
    const b = radial.clone().multiplyScalar(0.091).setY(-0.162);
    const c = radial.clone().multiplyScalar(0.121).setY(-0.267);
    const tip = radial.clone().multiplyScalar(0.125).setY(-0.3);
    const left = b.clone().addScaledVector(tangent, 0.015);
    const right = b.clone().addScaledVector(tangent, -0.015);
    const upperLeft = c.clone().addScaledVector(tangent, 0.022);
    const upperRight = c.clone().addScaledVector(tangent, -0.022);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        [
          ...a,
          ...left,
          ...right,
          ...left,
          ...upperLeft,
          ...upperRight,
          ...left,
          ...upperRight,
          ...right,
          ...upperLeft,
          ...tip,
          ...upperRight,
        ],
        3,
      ),
    );
    geometry.computeVertexNormals();
    featherParts.push(geometry);
    ribParts.push(lineBetween(a, tip, 0.0016, 4));
    // Fine diagonals catch the light without relying on a texture.
    for (const t of [0.4, 0.57, 0.72, 0.85]) {
      const stem = a.clone().lerp(tip, t);
      const outer = stem
        .clone()
        .addScaledVector(tangent, 0.014)
        .addScaledVector(radial, 0.006);
      outer.y -= 0.015;
      ribParts.push(lineBetween(stem, outer, 0.0006, 3));
    }
  }
  merged(group, featherParts, feathers);
  merged(group, ribParts, ribs);
  const hoop = mesh(
    new THREE.TorusGeometry(0.063, 0.002, 3, 24),
    white,
    group,
    0,
    -0.089,
    0,
  );
  hoop.rotation.x = Math.PI / 2;
  group.scale.setScalar(1.25);
  const up = new THREE.Vector3(0, 1, 0);
  const velocity = new THREE.Vector3();
  const target = new THREE.Quaternion();
  const spin = new THREE.Quaternion();
  let roll = 0;
  return {
    group,
    update(dt, { vx = 0, vy = 0, vz = 0 } = {}) {
      const delta = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.1);
      velocity.set(vx, vy, vz);
      if (
        velocity.lengthSq() > 0.0001 &&
        Number.isFinite(velocity.lengthSq())
      ) {
        target.setFromUnitVectors(up, velocity.normalize());
        roll += delta * 9;
        spin.setFromAxisAngle(up, roll);
        target.multiply(spin);
        group.quaternion.slerp(target, 1 - Math.exp(-delta * 19));
      }
    },
  };
}
