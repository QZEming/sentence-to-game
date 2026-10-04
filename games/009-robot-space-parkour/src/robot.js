/** A small ceramic exploration robot. Forward is local -Z, feet rest at y = 0. */
export function createRobot(THREE, scene) {
  const group = new THREE.Group();
  group.name = 'ORBI exploration robot';
  const geometries = new Map();
  const material = (color, roughness = 0.5, metalness = 0.1, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  const white = material(0xe6eeed, 0.31, 0.2);
  const orange = material(0xff9b35, 0.34, 0.24);
  const orangeDark = material(0xc95516, 0.4, 0.3);
  const dark = material(0x182b39, 0.46, 0.55);
  const rubber = material(0x223640, 0.8, 0.15);
  const metal = material(0x75909b, 0.3, 0.75);
  const visor = material(0x071e2d, 0.13, 0.67, { envMapIntensity: 1.8 });
  const glow = material(0x81ffff, 0.2, 0.15, { emissive: 0x1deefb, emissiveIntensity: 1.6 });
  const coreMaterial = material(0xc0ffff, 0.25, 0.1, { emissive: 0x2ae7f4, emissiveIntensity: 1.1 });
  const reflection = material(0x96d5e3, 0.2, 0.4, { transparent: true, opacity: 0.34 });

  function roundedGeometry(width, height, depth, radius = 0.04) {
    const key = `${width}:${height}:${depth}:${radius}`;
    if (geometries.has(key)) return geometries.get(key);
    const geometry = new THREE.BoxGeometry(width, height, depth, 8, 8, 8);
    const positions = geometry.attributes.position;
    const half = [width / 2, height / 2, depth / 2];
    const r = Math.min(radius, ...half);
    const point = new THREE.Vector3();
    const core = new THREE.Vector3();
    for (let i = 0; i < positions.count; i++) {
      point.fromBufferAttribute(positions, i);
      core.set(
        THREE.MathUtils.clamp(point.x, -half[0] + r, half[0] - r),
        THREE.MathUtils.clamp(point.y, -half[1] + r, half[1] - r),
        THREE.MathUtils.clamp(point.z, -half[2] + r, half[2] - r),
      );
      point.sub(core).normalize().multiplyScalar(r).add(core);
      positions.setXYZ(i, point.x, point.y, point.z);
    }
    geometry.computeVertexNormals();
    geometries.set(key, geometry);
    return geometry;
  }

  function mesh(parent, geometry, mat, x = 0, y = 0, z = 0) {
    const result = new THREE.Mesh(geometry, mat);
    result.position.set(x, y, z);
    result.castShadow = true;
    result.receiveShadow = true;
    parent.add(result);
    return result;
  }
  const box = (parent, width, height, depth, mat, x = 0, y = 0, z = 0, radius = 0.04) =>
    mesh(parent, roundedGeometry(width, height, depth, radius), mat, x, y, z);
  const ball = (parent, radius, mat, x, y, z) =>
    mesh(parent, new THREE.SphereGeometry(radius, 16, 12), mat, x, y, z);
  const cylinder = (parent, radius, height, mat, x, y, z) =>
    mesh(parent, new THREE.CylinderGeometry(radius, radius, height, 20), mat, x, y, z);

  const body = new THREE.Group();
  body.position.y = 0.67;
  group.add(body);
  box(body, 0.59, 0.51, 0.43, white, 0, 0.19, 0, 0.095);
  box(body, 0.48, 0.12, 0.37, dark, 0, -0.052, 0.008);
  box(body, 0.24, 0.07, 0.41, orange, 0, 0.4, -0.005, 0.025);
  box(body, 0.36, 0.25, 0.06, dark, 0, 0.2, -0.216, 0.05);
  box(body, 0.055, 0.25, 0.05, orange, -0.242, 0.2, -0.208, 0.02);
  box(body, 0.055, 0.25, 0.05, orange, 0.242, 0.2, -0.208, 0.02);
  mesh(body, new THREE.TorusGeometry(0.073, 0.013, 8, 24), metal, 0, 0.219, -0.257);
  const core = mesh(body, new THREE.CircleGeometry(0.06, 24), coreMaterial, 0, 0.219, -0.273);
  core.rotation.y = Math.PI;
  for (let i = 0; i < 3; i++) box(body, 0.044, 0.016, 0.012, glow, -0.058 + i * 0.058, 0.12, -0.251, 0.005);
  cylinder(body, 0.09, 0.12, dark, 0, 0.468, 0);
  cylinder(body, 0.11, 0.036, metal, 0, 0.489, 0);

  const head = new THREE.Group();
  head.position.set(0, 0.66, -0.015);
  body.add(head);
  box(head, 0.77, 0.59, 0.58, white, 0, 0, 0, 0.15);
  box(head, 0.22, 0.044, 0.39, orange, 0, 0.286, 0.004, 0.02);
  box(head, 0.706, 0.388, 0.095, dark, 0, -0.008, -0.262, 0.08);
  box(head, 0.666, 0.349, 0.067, visor, 0, -0.005, -0.299, 0.075);
  const eyes = new THREE.Group();
  eyes.position.set(0, 0.012, -0.338);
  head.add(eyes);
  box(eyes, 0.079, 0.105, 0.015, glow, -0.14, 0, 0, 0.028);
  box(eyes, 0.079, 0.105, 0.015, glow, 0.14, 0, 0, 0.028);
  box(head, 0.084, 0.015, 0.012, glow, 0, -0.087, -0.34, 0.006);
  const highlight = box(head, 0.18, 0.018, 0.008, reflection, -0.175, 0.112, -0.338, 0.007);
  highlight.rotation.z = -0.15;
  box(head, 0.072, 0.012, 0.008, reflection, 0.23, -0.115, -0.338, 0.005);

  [-1, 1].forEach((side) => {
    const ear = cylinder(head, 0.123, 0.112, orangeDark, side * 0.39, 0.016, 0.007);
    ear.rotation.z = Math.PI / 2;
    const cap = cylinder(head, 0.103, 0.067, orange, side * 0.443, 0.016, 0.007);
    cap.rotation.z = Math.PI / 2;
    const inset = cylinder(head, 0.052, 0.009, dark, side * 0.481, 0.016, 0.007);
    inset.rotation.z = Math.PI / 2;
    const status = cylinder(head, 0.024, 0.012, glow, side * 0.488, 0.016, 0.007);
    status.rotation.z = Math.PI / 2;
    box(head, 0.12, 0.023, 0.024, orange, side * 0.238, -0.221, -0.209, 0.009);
  });
  const antenna = new THREE.Group();
  antenna.position.set(0.24, 0.24, 0.045);
  antenna.rotation.z = -0.13;
  head.add(antenna);
  cylinder(antenna, 0.028, 0.062, dark, 0, 0.03, 0);
  cylinder(antenna, 0.012, 0.135, metal, 0, 0.095, 0);
  ball(antenna, 0.034, glow, 0, 0.17, 0);

  const arms = [];
  [-1, 1].forEach((side) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.355, 0.305, 0.012);
    body.add(shoulder);
    ball(shoulder, 0.092, dark, 0, 0, 0);
    box(shoulder, 0.163, 0.19, 0.183, orange, side * 0.023, -0.068, 0, 0.05);
    const elbow = new THREE.Group();
    elbow.position.y = -0.202;
    shoulder.add(elbow);
    ball(elbow, 0.061, metal, 0, 0, 0);
    box(elbow, 0.126, 0.18, 0.134, white, 0, -0.097, 0, 0.043);
    box(elbow, 0.15, 0.095, 0.16, dark, 0, -0.224, -0.016, 0.04);
    box(elbow, 0.103, 0.048, 0.17, orange, 0, -0.221, -0.015, 0.02);
    box(elbow, 0.015, 0.053, 0.015, metal, side * 0.025, -0.236, -0.1, 0.005);
    arms.push({ shoulder, elbow, side });
  });

  const legs = [];
  [-1, 1].forEach((side) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.17, 0.56, 0);
    group.add(hip);
    ball(hip, 0.083, dark, 0, 0, 0);
    box(hip, 0.152, 0.21, 0.165, white, 0, -0.105, 0, 0.045);
    const knee = new THREE.Group();
    knee.position.y = -0.22;
    hip.add(knee);
    const kneecap = cylinder(knee, 0.07, 0.177, dark, 0, 0, 0);
    kneecap.rotation.z = Math.PI / 2;
    box(knee, 0.163, 0.175, 0.183, orange, 0, -0.106, -0.013, 0.045);
    box(knee, 0.052, 0.085, 0.014, white, 0, -0.093, -0.106, 0.009);
    const foot = new THREE.Group();
    foot.position.set(0, -0.22, 0);
    knee.add(foot);
    box(foot, 0.251, 0.17, 0.365, white, 0, -0.035, -0.078, 0.055);
    box(foot, 0.254, 0.051, 0.369, rubber, 0, -0.095, -0.078, 0.018);
    box(foot, 0.171, 0.069, 0.04, orange, 0, -0.022, -0.256, 0.019);
    box(foot, 0.087, 0.018, 0.012, glow, 0, -0.008, -0.279, 0.005);
    legs.push({ hip, knee, foot, side });
  });

  const backpack = new THREE.Group();
  backpack.position.set(0, 0.19, 0.269);
  body.add(backpack);
  box(backpack, 0.427, 0.397, 0.208, dark, 0, 0, 0, 0.065);
  box(backpack, 0.237, 0.31, 0.079, orange, 0, 0.018, 0.117, 0.035);
  for (let i = 0; i < 3; i++) box(backpack, 0.143, 0.021, 0.014, rubber, 0, 0.08 - i * 0.063, 0.159, 0.006);
  const flames = [];
  const flameMaterial = new THREE.MeshBasicMaterial({
    color: 0x1dbdff, transparent: true, opacity: 0.57,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const flameCoreMaterial = new THREE.MeshBasicMaterial({
    color: 0xbcffff, transparent: true, opacity: 0.88,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  [-1, 1].forEach((side) => {
    cylinder(backpack, 0.086, 0.34, white, side * 0.173, 0.005, 0.066);
    cylinder(backpack, 0.097, 0.066, orange, side * 0.173, 0.141, 0.066);
    cylinder(backpack, 0.093, 0.063, metal, side * 0.173, -0.162, 0.066);
    cylinder(backpack, 0.065, 0.014, glow, side * 0.173, -0.199, 0.066);
    const jet = new THREE.Group();
    jet.position.set(side * 0.173, -0.206, 0.066);
    backpack.add(jet);
    const outer = mesh(jet, new THREE.ConeGeometry(0.072, 0.35, 12), flameMaterial, 0, -0.175, 0);
    outer.rotation.z = Math.PI;
    outer.castShadow = false;
    outer.receiveShadow = false;
    const inner = mesh(jet, new THREE.ConeGeometry(0.045, 0.235, 12), flameCoreMaterial, 0, -0.116, 0);
    inner.rotation.z = Math.PI;
    inner.castShadow = false;
    inner.receiveShadow = false;
    jet.visible = false;
    flames.push(jet);
  });

  if (scene) scene.add(group);
  let clock = 0;
  let stride = 0;
  let run = 0;
  let airborne = 0;
  let dash = 0;
  const mix = THREE.MathUtils.lerp;

  function update(dt, state = {}) {
    const delta = Math.max(0, Math.min(Number.isFinite(dt) ? dt : 0, 0.1));
    clock = Number.isFinite(state.time) ? state.time : clock + delta;
    const speed = Math.abs(Number.isFinite(state.speed) ? state.speed : 0);
    const moving = Math.min(1, speed / 9);
    const grounded = state.grounded !== false;
    const smoothing = 1 - Math.exp(-delta * 12);
    run = mix(run, grounded ? moving : moving * 0.2, smoothing);
    airborne = mix(airborne, grounded ? 0 : 1, smoothing);
    dash = mix(dash, state.dashing ? 1 : 0, smoothing);
    stride += delta * (7 + Math.min(speed, 25) * 0.67);
    const swing = Math.sin(stride);
    const breathing = Math.sin(clock * 2.1);
    const bounce = Math.abs(Math.cos(stride)) * run * 0.055;

    body.position.y = 0.67 + breathing * 0.011 * (1 - run) + bounce + airborne * 0.018;
    body.rotation.x = -0.055 * run - 0.24 * dash + airborne * 0.035;
    body.rotation.z = swing * run * 0.042;
    head.rotation.x = 0.025 * breathing - 0.04 * airborne;
    head.rotation.y = Math.sin(clock * 0.6) * 0.035 * (1 - run);
    head.rotation.z = -swing * run * 0.025 + Math.sin(clock * 1.4) * 0.018 * (1 - run);
    antenna.rotation.z = -0.13 + Math.sin(clock * 7.1) * (0.018 + run * 0.04);
    // A short natural blink approximately once every four seconds.
    const blinkPhase = (clock + 0.7) % 4.7;
    eyes.scale.y = blinkPhase > 4.53 ? Math.max(0.1, Math.abs(blinkPhase - 4.615) / 0.085) : 1;
    eyes.rotation.z = dash * -0.055;
    coreMaterial.emissiveIntensity = 1.1 + Math.sin(clock * 3.8) * 0.22 + dash * 1.2;

    arms.forEach(({ shoulder, elbow, side }) => {
      shoulder.rotation.x = -swing * side * run * 0.64 + airborne * 0.22 - dash * 0.63;
      shoulder.rotation.z = side * (0.035 + airborne * 0.24 + dash * 0.14);
      elbow.rotation.x = 0.15 + run * 0.24 + airborne * 0.43;
    });
    legs.forEach(({ hip, knee, foot, side }) => {
      const phase = swing * side;
      hip.rotation.x = phase * run * 0.64 - airborne * (0.23 + side * 0.12) + dash * 0.35;
      hip.rotation.z = side * airborne * 0.055;
      knee.rotation.x = -Math.max(0, -phase) * run * 0.77 - airborne * 0.58;
      foot.rotation.x = Math.max(0, phase) * run * 0.17 + airborne * 0.17;
      hip.position.y = 0.56 + bounce;
    });
    const firing = !grounded || Boolean(state.dashing);
    flames.forEach((jet, index) => {
      jet.visible = firing;
      jet.scale.y = (state.dashing ? 2.2 : state.lowGravity ? 0.72 : state.jumps > 1 ? 1.4 : 1)
        * (0.9 + Math.sin(clock * 47 + index * 2.4) * 0.14);
      jet.scale.x = jet.scale.z = 0.92 + Math.sin(clock * 31 + index) * 0.08;
    });
    // Flicker individual meshes so the caller retains control of root visibility.
    const visible = !state.invulnerable || Math.floor(clock * 13) % 3 !== 0;
    body.visible = visible;
    legs.forEach(({ hip }) => { hip.visible = visible; });
  }

  return { group, update };
}
