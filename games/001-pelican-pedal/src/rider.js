import * as THREE from "three";

// All geometry is drawn locally: +Z is forward and the road is y = 0.
export function createRider() {
  const group = new THREE.Group();
  group.name = "Pip the pelican and his bicycle";
  const palette = {
    ivory: 0xfff4dc,
    feather: 0xf4e7cb,
    featherLight: 0xfffbef,
    beak: 0xffb52e,
    beakLight: 0xffd163,
    pouch: 0xf7a647,
    coral: 0xef6755,
    coralDark: 0xc9473e,
    teal: 0x278d8a,
    tealDark: 0x176768,
    rubber: 0x253a43,
    metal: 0xe2e4d7,
    saddle: 0x744b3c,
    eye: 0x182d36,
  };
  const materials = {};
  for (const [name, color] of Object.entries(palette)) {
    materials[name] = new THREE.MeshStandardMaterial({
      color,
      roughness: name === "metal" ? 0.38 : 0.8,
      metalness: name === "metal" ? 0.45 : 0,
      flatShading: true,
    });
  }
  const v = (x, y, z) => new THREE.Vector3(x, y, z);
  const up = v(0, 1, 0);
  const addMesh = (geometry, material, parent = group) => {
    const mesh = new THREE.Mesh(geometry, materials[material] || material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const ellipsoid = (parent, material, position, scale, detail = 12) => {
    const mesh = addMesh(
      new THREE.SphereGeometry(1, detail, 8),
      material,
      parent,
    );
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    return mesh;
  };
  const tube = (parent, a, b, radius, material, segments = 8) => {
    const mesh = addMesh(
      new THREE.CylinderGeometry(radius, radius, 1, segments),
      material,
      parent,
    );
    align(mesh, a, b);
    return mesh;
  };
  function align(mesh, a, b) {
    const delta = new THREE.Vector3().subVectors(b, a);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(up, delta.clone().normalize());
    mesh.scale.y = delta.length();
  }
  const bike = new THREE.Group();
  bike.name = "Coral bicycle";
  group.add(bike);

  const wheelRadius = 0.64;
  const makeWheel = (z) => {
    const wheel = new THREE.Group();
    wheel.position.set(0, 0.66, z);
    bike.add(wheel);
    const tire = addMesh(
      new THREE.TorusGeometry(wheelRadius - 0.047, 0.067, 8, 40),
      "rubber",
      wheel,
    );
    tire.rotation.y = Math.PI / 2;
    const sidewall = addMesh(
      new THREE.TorusGeometry(0.588, 0.022, 6, 40),
      "ivory",
      wheel,
    );
    sidewall.rotation.y = Math.PI / 2;
    const rim = addMesh(
      new THREE.TorusGeometry(0.558, 0.019, 6, 40),
      "metal",
      wheel,
    );
    rim.rotation.y = Math.PI / 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const side = i % 2 ? 0.045 : -0.045;
      tube(
        wheel,
        v(side, 0, 0),
        v(0, Math.sin(angle) * 0.55, Math.cos(angle) * 0.55),
        0.009,
        "metal",
        4,
      );
    }
    tube(wheel, v(-0.13, 0, 0), v(0.13, 0, 0), 0.065, "metal");
    // The tiny ochre valve gives the rotation a readable visual accent.
    tube(wheel, v(0, 0.51, 0), v(0, 0.565, 0), 0.015, "beak");
    return wheel;
  };
  const rearWheel = makeWheel(-0.95);
  const frontWheel = makeWheel(0.95);
  const rearAxle = v(0, 0.66, -0.95);
  const frontAxle = v(0, 0.66, 0.95);
  const crankCenter = v(0, 0.91, -0.08);
  const seatJoint = v(0, 1.52, -0.43);
  const frontTop = v(0, 1.53, 0.64);
  const frontBottom = v(0, 1.3, 0.72);
  tube(bike, crankCenter, seatJoint, 0.055, "coral");
  tube(bike, seatJoint, frontTop, 0.052, "coral");
  tube(bike, crankCenter, frontBottom, 0.061, "coral");
  tube(bike, frontTop, frontBottom, 0.07, "coralDark");
  for (const side of [-1, 1]) {
    tube(
      bike,
      v(side * 0.1, 0.91, -0.08),
      v(side * 0.12, 0.66, -0.95),
      0.028,
      "coral",
    );
    tube(
      bike,
      seatJoint.clone().add(v(side * 0.045, 0, 0)),
      v(side * 0.12, 0.66, -0.95),
      0.027,
      "coral",
    );
    tube(
      bike,
      v(side * 0.075, 1.35, 0.71),
      v(side * 0.13, 0.66, 0.95),
      0.033,
      "coral",
    );
  }
  tube(bike, seatJoint, v(0, 1.72, -0.51), 0.035, "metal");
  ellipsoid(bike, "saddle", [0, 1.75, -0.48], [0.24, 0.085, 0.31]);
  ellipsoid(bike, "coralDark", [0, 1.8, -0.47], [0.23, 0.023, 0.28]);
  tube(bike, frontTop, v(0, 1.77, 0.55), 0.033, "metal");
  tube(bike, v(0, 1.77, 0.55), v(0, 1.86, 0.81), 0.035, "metal");
  tube(bike, v(-0.45, 1.86, 0.81), v(0.45, 1.86, 0.81), 0.031, "metal");
  for (const side of [-1, 1]) {
    tube(
      bike,
      v(side * 0.32, 1.86, 0.81),
      v(side * 0.49, 1.86, 0.81),
      0.05,
      "tealDark",
    );
    tube(
      bike,
      v(side * 0.49, 1.86, 0.81),
      v(side * 0.49, 1.74, 0.92),
      0.038,
      "tealDark",
    );
    tube(
      bike,
      v(side * 0.49, 1.74, 0.92),
      v(side * 0.49, 1.68, 0.82),
      0.038,
      "tealDark",
    );
  }
  // A copper bell, a little headlight, and a bottle on the down tube.
  ellipsoid(bike, "beak", [-0.22, 1.925, 0.8], [0.07, 0.045, 0.07]);
  tube(bike, v(0, 1.45, 0.69), v(0, 1.45, 0.84), 0.09, "tealDark");
  ellipsoid(bike, "beakLight", [0, 1.45, 0.855], [0.075, 0.075, 0.025]);
  const bottle = ellipsoid(
    bike,
    "ivory",
    [0, 1.17, 0.16],
    [0.065, 0.16, 0.065],
  );
  bottle.rotation.x = -0.6;
  tube(bike, v(0, 1.28, 0.22), v(0, 1.32, 0.245), 0.035, "teal");
  tube(bike, v(-0.055, 1.03, 0.04), v(-0.055, 1.21, 0.18), 0.014, "coralDark");

  const chainring = addMesh(
    new THREE.TorusGeometry(0.185, 0.026, 6, 20),
    "metal",
    bike,
  );
  chainring.rotation.y = Math.PI / 2;
  chainring.position.copy(crankCenter).add(v(0.16, 0, 0));
  const rearCog = addMesh(
    new THREE.TorusGeometry(0.085, 0.018, 5, 16),
    "metal",
    bike,
  );
  rearCog.rotation.y = Math.PI / 2;
  rearCog.position.copy(rearAxle).add(v(0.16, 0, 0));
  tube(bike, v(0.16, 1.083, -0.1), v(0.16, 0.74, -0.97), 0.016, "rubber", 5);
  tube(bike, v(0.16, 0.733, -0.07), v(0.16, 0.58, -0.95), 0.016, "rubber", 5);

  const bird = new THREE.Group();
  bird.name = "Pip";
  group.add(bird);
  const body = ellipsoid(
    bird,
    "ivory",
    [0, 2.21, -0.34],
    [0.48, 0.62, 0.65],
    16,
  );
  body.rotation.x = -0.16;
  ellipsoid(bird, "featherLight", [0, 2.14, 0.03], [0.37, 0.47, 0.37]);
  // Fan of pointed tail feathers visible above the back wheel.
  for (let i = -1; i <= 1; i++) {
    const tail = ellipsoid(
      bird,
      i === 0 ? "ivory" : "feather",
      [i * 0.12, 2.13, -0.94],
      [0.15, 0.115, 0.4],
    );
    tail.rotation.x = -0.25;
    tail.rotation.y = i * 0.18;
  }
  const neck = ellipsoid(bird, "ivory", [0, 2.76, 0.15], [0.235, 0.52, 0.24]);
  neck.rotation.x = 0.2;
  ellipsoid(bird, "featherLight", [0, 3.15, 0.29], [0.29, 0.32, 0.32], 16);
  const head = new THREE.Group();
  head.position.set(0, 3.23, 0.37);
  bird.add(head);
  ellipsoid(head, "ivory", [0, 0, 0], [0.32, 0.31, 0.36], 16);
  ellipsoid(head, "featherLight", [0, -0.07, 0.21], [0.255, 0.21, 0.24]);

  // Custom faceted beak: wide at its root, tapering into a hooked golden tip.
  function taperedBeak() {
    const positions = [
      -0.225, 0.0, 0.22, 0.225, 0.0, 0.22, 0.17, -0.03, 0.92, -0.17, -0.03,
      0.92, -0.04, -0.09, 1.34, 0.04, -0.09, 1.34, 0, 0.13, 0.28, 0, 0.075,
      0.84, 0, -0.025, 1.33,
    ];
    const indices = [
      0, 6, 1, 0, 3, 7, 0, 7, 6, 1, 6, 7, 1, 7, 2, 3, 4, 8, 3, 8, 7, 2, 7, 8, 2,
      8, 5, 4, 5, 8, 0, 1, 2, 0, 2, 3, 3, 2, 5, 3, 5, 4,
    ];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }
  addMesh(taperedBeak(), "beakLight", head);
  const pouch = ellipsoid(
    head,
    "pouch",
    [0, -0.16, 0.61],
    [0.213, 0.22, 0.48],
    12,
  );
  pouch.rotation.x = -0.11;
  tube(head, v(-0.21, -0.025, 0.25), v(-0.027, -0.1, 1.31), 0.013, "beak", 5);
  tube(head, v(0.21, -0.025, 0.25), v(0.027, -0.1, 1.31), 0.013, "beak", 5);
  ellipsoid(head, "beak", [0, -0.075, 1.325], [0.052, 0.08, 0.05]);
  for (const side of [-1, 1]) {
    ellipsoid(
      head,
      "featherLight",
      [side * 0.266, 0.075, 0.19],
      [0.082, 0.096, 0.09],
    );
    ellipsoid(head, "eye", [side * 0.312, 0.085, 0.219], [0.034, 0.061, 0.049]);
    ellipsoid(
      head,
      "featherLight",
      [side * 0.333, 0.108, 0.24],
      [0.012, 0.018, 0.014],
      8,
    );
    // Slightly arched brows lend a cheerful, determined expression.
    tube(
      head,
      v(side * 0.272, 0.177, 0.16),
      v(side * 0.307, 0.164, 0.26),
      0.018,
      "feather",
    );
  }
  const helmet = addMesh(
    new THREE.SphereGeometry(0.346, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    "teal",
    head,
  );
  helmet.position.y = 0.115;
  helmet.scale.set(1, 0.68, 1.08);
  const helmetRim = addMesh(
    new THREE.TorusGeometry(0.342, 0.019, 5, 24),
    "tealDark",
    head,
  );
  helmetRim.rotation.x = Math.PI / 2;
  helmetRim.position.y = 0.114;
  helmetRim.scale.y = 1.08;
  const helmetStripe = addMesh(
    new THREE.TorusGeometry(0.346, 0.018, 5, 24, Math.PI),
    "ivory",
    head,
  );
  helmetStripe.rotation.y = Math.PI / 2;
  helmetStripe.position.y = 0.115;
  helmetStripe.scale.y = 0.68;
  helmetStripe.scale.x = 1.08;
  for (const side of [-1, 1]) {
    tube(
      head,
      v(side * 0.3, 0.12, -0.01),
      v(side * 0.24, -0.21, 0.02),
      0.017,
      "tealDark",
      5,
    );
    tube(
      head,
      v(side * 0.24, -0.21, 0.02),
      v(0, -0.27, 0.09),
      0.017,
      "tealDark",
      5,
    );
  }
  const scarf = addMesh(
    new THREE.TorusGeometry(0.23, 0.071, 6, 14),
    "teal",
    bird,
  );
  scarf.position.set(0, 2.88, 0.17);
  scarf.rotation.x = Math.PI / 2;
  scarf.scale.y = 0.9;
  ellipsoid(bird, "tealDark", [-0.2, 2.87, 0.11], [0.11, 0.095, 0.09]);
  const ribbons = [];
  for (let i = 0; i < 2; i++) {
    const ribbon = new THREE.Group();
    ribbon.position.set(-0.2 - i * 0.065, 2.875 - i * 0.04, 0.09);
    bird.add(ribbon);
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(-0.03, -0.56 - i * 0.12);
    shape.lineTo(0.035, -0.49 - i * 0.12);
    shape.lineTo(0.1, -0.61 - i * 0.12);
    shape.lineTo(0.13, 0);
    shape.closePath();
    const cloth = addMesh(
      new THREE.ShapeGeometry(shape),
      new THREE.MeshStandardMaterial({
        color: i ? palette.tealDark : palette.teal,
        side: THREE.DoubleSide,
        roughness: 1,
        flatShading: true,
      }),
      ribbon,
    );
    cloth.rotation.x = Math.PI / 2;
    ribbons.push(ribbon);
  }

  // Wings consist of two overlapping feather forms with a small fan at the wrist.
  const wings = [-1, 1].map((side) => {
    const upper = ellipsoid(bird, "feather", [0, 0, 0], [0.17, 1, 0.2]);
    const lower = ellipsoid(bird, "ivory", [0, 0, 0], [0.125, 1, 0.15]);
    const tips = new THREE.Group();
    bird.add(tips);
    for (let i = 0; i < 3; i++) {
      const feather = ellipsoid(
        tips,
        i === 1 ? "featherLight" : "feather",
        [side * (i - 1) * 0.063, 0, 0.025 + i * 0.024],
        [0.045, 0.035, 0.14],
      );
      feather.rotation.y = side * (i - 1) * 0.12;
    }
    return { side, upper, lower, tips };
  });
  function poseWing(wing, lift, time) {
    const { side, upper, lower, tips } = wing;
    const shoulder = v(side * 0.39, 2.49, -0.28);
    const elbow = v(
      side * (0.5 + lift * 0.32),
      2.19 + lift * 0.44,
      0.22 - lift * 0.23,
    );
    const wrist = v(
      side * (0.46 + lift * 0.58),
      1.9 + lift * 1.01,
      0.78 - lift * 0.22,
    );
    wrist.y += Math.sin(time * 3 + side) * 0.009;
    // Ellipsoids have unit radius, so their longitudinal scale is half a segment.
    align(upper, shoulder, elbow);
    upper.scale.y = shoulder.distanceTo(elbow) * 0.64;
    align(lower, elbow, wrist);
    lower.scale.y = elbow.distanceTo(wrist) * 0.68;
    tips.position.copy(wrist);
    tips.rotation.z = -side * lift * 0.8;
    tips.rotation.x = lift * 0.3;
  }
  const legs = [-1, 1].map((side) => {
    const upper = tube(group, v(0, 0, 0), v(0, 1, 0), 0.07, "beak");
    const lower = tube(group, v(0, 0, 0), v(0, 1, 0), 0.048, "beak");
    const knee = ellipsoid(
      group,
      "beakLight",
      [0, 0, 0],
      [0.079, 0.078, 0.078],
    );
    const crank = tube(bike, v(0, 0, 0), v(0, 1, 0), 0.028, "metal");
    const pedal = addMesh(
      new THREE.BoxGeometry(0.2, 0.045, 0.16),
      "tealDark",
      bike,
    );
    const foot = new THREE.Group();
    group.add(foot);
    const footShape = new THREE.Shape();
    footShape.moveTo(-0.055, -0.11);
    footShape.lineTo(-0.15, 0.17);
    footShape.lineTo(-0.065, 0.13);
    footShape.lineTo(0, 0.23);
    footShape.lineTo(0.065, 0.14);
    footShape.lineTo(0.15, 0.18);
    footShape.lineTo(0.055, -0.11);
    footShape.closePath();
    const webbing = addMesh(
      new THREE.ExtrudeGeometry(footShape, {
        depth: 0.038,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.012,
        bevelSegments: 1,
        steps: 1,
      }),
      "beak",
      foot,
    );
    webbing.rotation.x = Math.PI / 2;
    for (let toe = -1; toe <= 1; toe++) {
      tube(
        foot,
        v(0, 0.015, -0.07),
        v(toe * 0.12, 0.015, toe === 0 ? 0.2 : 0.15),
        0.018,
        "beakLight",
        5,
      );
    }
    return { side, upper, lower, knee, crank, pedal, foot };
  });

  let pedalPhase = 0;
  let wheelAngle = 0;
  const state = { speed: 0, steer: 0, jump: 0, time: 0, boost: false };
  function update(dt, nextState = {}) {
    Object.assign(state, nextState);
    const time = Number.isFinite(state.time) ? state.time : 0;
    const speed = Math.max(0, Number(state.speed) || 0);
    const jump = Math.max(0, Math.min(1, Number(state.jump) || 0));
    const steer = Math.max(-1, Math.min(1, Number(state.steer) || 0));
    const boost = state.boost ? 1 : 0;
    const step = Math.min(Math.max(Number(dt) || 0, 0), 0.1);
    pedalPhase += step * (speed > 0.1 ? 3.4 + speed * 0.33 + boost * 1.5 : 0);
    wheelAngle += (step * speed) / wheelRadius;
    rearWheel.rotation.x = wheelAngle;
    frontWheel.rotation.x = wheelAngle;
    const wobble = Math.sin(pedalPhase * 2) * Math.min(speed * 0.0017, 0.014);
    bird.position.y = wobble;
    bird.rotation.z =
      -steer * 0.035 + Math.sin(pedalPhase) * Math.min(speed * 0.0008, 0.008);
    head.rotation.y = steer * 0.1;
    head.rotation.x = Math.sin(time * 1.8) * 0.012 - boost * 0.035;
    ribbons.forEach((ribbon, i) => {
      ribbon.rotation.x = Math.sin(time * (8 + boost * 4) - i) * 0.12 + 0.06;
      ribbon.rotation.y = Math.sin(time * 6 + i) * 0.1 + steer * 0.12;
      ribbon.rotation.z = 0.1 + Math.sin(time * 7 + i) * 0.06;
    });
    for (const wing of wings) poseWing(wing, jump, time);
    for (const leg of legs) {
      const phase = pedalPhase + (leg.side === 1 ? 0 : Math.PI);
      const pedalPoint = v(
        leg.side * 0.29,
        crankCenter.y + Math.sin(phase) * 0.245,
        crankCenter.z + Math.cos(phase) * 0.245,
      );
      const hip = v(leg.side * 0.28, 1.96 + wobble, -0.4);
      const knee = v(
        leg.side * 0.32,
        1.43 + Math.sin(phase) * 0.1,
        0.01 + Math.cos(phase) * 0.1,
      );
      const ankle = pedalPoint.clone().add(v(0, 0.105, -0.055));
      align(leg.upper, hip, knee);
      align(leg.lower, knee, ankle);
      leg.knee.position.copy(knee);
      align(
        leg.crank,
        crankCenter.clone().add(v(leg.side * 0.18, 0, 0)),
        pedalPoint,
      );
      leg.pedal.position.copy(pedalPoint);
      leg.foot.position.copy(pedalPoint).add(v(0, 0.082, 0.035));
      leg.foot.rotation.x = Math.cos(phase) * 0.1;
    }
  }
  update(0);
  return { group, update };
}
