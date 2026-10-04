import * as THREE from './vendor/three.module.js';

const TAU = Math.PI * 2;
const clamp = THREE.MathUtils.clamp;

function material(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.04, ...extra });
}

function ellipsoid(parent, geometry, mat, position, scale) {
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  parent.add(mesh);
  return mesh;
}

// A closed, gently cambered foil. The perimeter lies in XZ; its two
// surfaces meet at the thin edge. Separate triangles give fins a subtle
// sculpted finish without making the animal look crystalline.
function foil(points, center, thickness, upper, lower) {
  const positions = [], colors = [];
  const top = new THREE.Color(upper), bottom = new THREE.Color(lower);
  const push = (x, y, z, c) => {
    positions.push(x, y, z);
    colors.push(c.r, c.g, c.b);
  };
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    push(center[0], thickness, center[1], top);
    push(b[0], 0, b[1], top);
    push(a[0], 0, a[1], top);
    push(center[0], -thickness * 0.65, center[1], bottom);
    push(a[0], 0, a[1], bottom);
    push(b[0], 0, b[1], bottom);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  // Both sides are visible even when the perimeter is mirrored.
  return new THREE.Mesh(g, material(0xffffff, { vertexColors: true, side: THREE.DoubleSide }));
}

function curveTube(points, radius, mat, segments = 24) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  return new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 5, false), mat);
}

function whaleBody() {
  // z, horizontal radius, vertical radius, vertical center.
  // A rounded, broad rostrum, deep chest, and long taper to the tail stock.
  const rings = [
    [-5.05, 0.06, 0.14, -0.10], [-4.94, 0.70, 0.61, -0.04],
    [-4.66, 1.20, 0.94, 0.06], [-4.15, 1.53, 1.14, 0.12],
    [-3.35, 1.72, 1.29, 0.13], [-2.20, 1.78, 1.37, 0.11],
    [-0.75, 1.69, 1.34, 0.08], [0.65, 1.48, 1.17, 0.05],
    [1.85, 1.12, 0.91, 0.02], [2.95, 0.77, 0.63, 0.00],
    [3.85, 0.48, 0.40, -0.01], [4.65, 0.33, 0.27, 0.00],
    [5.12, 0.28, 0.18, 0.00],
  ];
  const sides = 28, positions = [], colors = [], indices = [];
  const back = new THREE.Color(0x45697b);
  const flank = new THREE.Color(0x628696);
  const belly = new THREE.Color(0xb8ced0);
  const color = new THREE.Color();
  for (let j = 0; j < rings.length; j++) {
    const [z, rx, ry, cy] = rings[j];
    for (let i = 0; i <= sides; i++) {
      const theta = i / sides * TAU;
      const height = Math.cos(theta);
      positions.push(Math.sin(theta) * rx, cy + height * ry, z);
      color.copy(back).lerp(flank, Math.pow(1 - Math.abs(height), 2) * 0.65);
      color.lerp(belly, THREE.MathUtils.smoothstep(-height, 0.27, 0.63));
      colors.push(color.r, color.g, color.b);
      if (j < rings.length - 1 && i < sides) {
        const a = j * (sides + 1) + i, b = a + sides + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  // End caps keep the mesh closed at the rostrum and tail socket.
  for (let i = 1; i < sides - 1; i++) {
    indices.push(0, i, i + 1);
    const end = (rings.length - 1) * (sides + 1);
    indices.push(end, end + i + 1, end + i);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, material(0xffffff, { vertexColors: true, roughness: 0.6 }));
}

/** Approximately 11.5 units long; forward is local -Z, up is +Y.
 * animate accepts seconds, speed (normally 0..1), and signed turn (-1..1).
 * The root transform is exclusively owned by the caller.
 */
export function createWhale() {
  const group = new THREE.Group();
  group.name = 'whale';
  group.add(whaleBody());
  const sphere = new THREE.SphereGeometry(1, 12, 8);
  const dark = material(0x102e3e, { roughness: 0.65 });
  const eyeMaterial = material(0x051a23, { roughness: 0.12, metalness: 0.28 });
  const glint = material(0xb1ffef, { emissive: 0x71e3d1, emissiveIntensity: 0.6 });
  const marking = material(0x62cfce, { emissive: 0x35c8bd, emissiveIntensity: 0.48, roughness: 0.5 });

  // The thin mouth seam follows the broad head on both sides.
  for (const side of [-1, 1]) {
    group.add(curveTube([
      [0, -0.43, -4.95], [side * 0.8, -0.50, -4.72],
      [side * 1.31, -0.57, -4.10], [side * 1.57, -0.57, -3.40],
      [side * 1.65, -0.54, -2.65],
    ], 0.025, dark));
    ellipsoid(group, sphere, eyeMaterial, [side * 1.67, 0.03, -3.46], [0.095, 0.13, 0.17]);
    ellipsoid(group, sphere, glint, [side * 1.750, 0.072, -3.51], [0.023, 0.032, 0.038]);
    ellipsoid(group, sphere, dark, [side * 0.12, 1.414, -3.31], [0.070, 0.020, 0.14]);
  }

  // Restrained bioluminescent freckles, batched into a single draw call.
  const spots = new THREE.InstancedMesh(sphere, marking, 10);
  const dummy = new THREE.Object3D();
  let spotIndex = 0;
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const z = -1.6 + i * 0.43;
      const x = 1.67 - i * 0.031;
      dummy.position.set(side * x, 0.46 - i * 0.028, z);
      dummy.rotation.set(0, 0, side * -0.22);
      dummy.scale.set(0.034, 0.065 - i * 0.005, 0.13 - i * 0.011);
      dummy.updateMatrix();
      spots.setMatrixAt(spotIndex++, dummy.matrix);
    }
  }
  group.add(spots);

  const flippers = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 1.40, -0.59, -1.82);
    const fin = foil([
      [0, -0.22], [0.78, -0.28], [1.85, 0.16], [3.25, 1.00],
      [3.38, 1.32], [2.79, 1.48], [1.35, 0.96], [0, 0.48],
    ], [1.13, 0.43], 0.15, 0x527b8b, 0xc5dbdb);
    fin.scale.x = side;
    pivot.rotation.z = side * -0.14;
    pivot.add(fin);
    group.add(pivot);
    flippers.push({ pivot, side });
  }

  const dorsal = foil([
    [0, -0.42], [0.34, -0.35], [0.88, -0.06], [1.12, 0.24],
    [0.68, 0.30], [0.27, 0.80], [0, 1.05],
  ], [0.28, 0.25], 0.11, 0x3b5e70, 0x3b5e70);
  dorsal.rotation.z = Math.PI / 2;
  dorsal.position.set(0, 1.09, 0.48);
  group.add(dorsal);

  const tailPivot = new THREE.Group();
  tailPivot.position.set(0, 0, 4.65);
  const tail = foil([
    [0, -0.20], [0.60, 0.12], [1.61, 0.22], [2.82, 0.55],
    [3.04, 0.79], [2.30, 1.17], [1.12, 1.31], [0.35, 0.99],
    [0, 0.79], [-0.35, 0.99], [-1.12, 1.31], [-2.30, 1.17],
    [-3.04, 0.79], [-2.82, 0.55], [-1.61, 0.22], [-0.60, 0.12],
  ], [0, 0.43], 0.22, 0x426779, 0x9fbcbf);
  tailPivot.add(tail);
  group.add(tailPivot);

  return {
    group,
    animate(time, speed = 0.5, turn = 0) {
      const effort = clamp(Math.abs(speed), 0, 1.5);
      const stroke = time * 1.55;
      tailPivot.rotation.x = Math.sin(stroke) * (0.13 + effort * 0.17);
      tailPivot.rotation.y = clamp(turn, -1, 1) * 0.14;
      for (const { pivot, side } of flippers) {
        pivot.rotation.z = side * (-0.14 + Math.sin(stroke - 0.85) * (0.05 + effort * 0.075));
        pivot.rotation.x = Math.sin(stroke - 0.45) * 0.055 + side * clamp(turn, -1, 1) * 0.11;
      }
    },
  };
}

/** Bell radius 1.6. Eight continuously deformed tentacles share one draw call. */
export function createJellyfish(color = 0x71eddd) {
  const group = new THREE.Group();
  group.name = 'jellyfish';
  const bell = new THREE.Group();
  group.add(bell);
  const domeMaterial = material(color, {
    transparent: true, opacity: 0.35, depthWrite: false,
    side: THREE.DoubleSide, emissive: color, emissiveIntensity: 0.42, roughness: 0.28,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 12, 0, TAU, 0, Math.PI / 2), domeMaterial);
  dome.scale.y = 0.64;
  bell.add(dome);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.57, 0.053, 5, 32), material(color, {
    emissive: color, emissiveIntensity: 0.8, transparent: true, opacity: 0.78,
  }));
  rim.rotation.x = Math.PI / 2;
  bell.add(rim);
  ellipsoid(bell, new THREE.SphereGeometry(1, 12, 8), material(color, {
    emissive: color, emissiveIntensity: 0.95, transparent: true, opacity: 0.6,
  }), [0, 0.26, 0], [0.44, 0.35, 0.44]);

  const count = 8, segments = 16, sides = 5;
  const positions = new Float32Array(count * (segments + 1) * sides * 3);
  const normals = new Float32Array(positions.length);
  const indices = [];
  for (let tentacle = 0; tentacle < count; tentacle++) {
    for (let j = 0; j <= segments; j++) {
      for (let k = 0; k < sides; k++) {
        const vertex = (tentacle * (segments + 1) + j) * sides + k;
        normals[vertex * 3] = Math.cos(k / sides * TAU);
        normals[vertex * 3 + 2] = Math.sin(k / sides * TAU);
        if (j < segments) {
          const next = (tentacle * (segments + 1) + j) * sides + (k + 1) % sides;
          indices.push(vertex, next, vertex + sides, next, next + sides, vertex + sides);
        }
      }
    }
  }
  const tentacleGeometry = new THREE.BufferGeometry();
  tentacleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  tentacleGeometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  tentacleGeometry.setIndex(indices);
  tentacleGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, -2, 0), 4.6);
  const tentacles = new THREE.Mesh(tentacleGeometry, material(color, {
    emissive: color, emissiveIntensity: 0.65, transparent: true, opacity: 0.73, roughness: 0.7,
  }));
  group.add(tentacles);

  const animate = time => {
    const pulse = Math.sin(time * 1.6);
    bell.scale.set(1 + pulse * 0.045, 1 - pulse * 0.065, 1 + pulse * 0.045);
    let p = 0;
    for (let t = 0; t < count; t++) {
      const phase = t / count * TAU;
      const length = 3.15 + (t % 3) * 0.48;
      const rootX = Math.cos(phase) * 1.13 * bell.scale.x;
      const rootZ = Math.sin(phase) * 1.13 * bell.scale.z;
      for (let j = 0; j <= segments; j++) {
        const u = j / segments;
        const radius = 0.043 * (1 - u * 0.76);
        const bend = u * u;
        const x = rootX + Math.sin(time * 1.35 + phase + u * 4.7) * 0.51 * bend;
        const z = rootZ + Math.cos(time * 1.1 + phase * 1.3 + u * 4.4) * 0.43 * bend;
        const y = -length * u + Math.sin(time * 1.6 + u * 3 + phase) * 0.10 * u;
        for (let k = 0; k < sides; k++) {
          const a = k / sides * TAU;
          positions[p++] = x + Math.cos(a) * radius;
          positions[p++] = y;
          positions[p++] = z + Math.sin(a) * radius;
        }
      }
    }
    tentacleGeometry.attributes.position.needsUpdate = true;
  };
  animate(0);
  return { group, animate };
}

/** Wingspan about 5.3 units; forward is local -Z. */
export function createManta() {
  const group = new THREE.Group();
  group.name = 'manta';
  const bodyMaterial = material(0x244e61, { roughness: 0.62 });
  const bellyMaterial = material(0xaac8cd, { roughness: 0.8 });
  const sphere = new THREE.SphereGeometry(1, 12, 8);
  ellipsoid(group, sphere, bodyMaterial, [0, 0, -0.12], [0.57, 0.22, 1.05]);
  ellipsoid(group, sphere, bellyMaterial, [0, -0.095, -0.17], [0.47, 0.15, 0.9]);
  const wings = [];
  for (const side of [-1, 1]) {
    const wing = foil([
      [0, -0.84], [0.69, -1.02], [1.62, -0.60], [2.62, 0.11],
      [2.55, 0.50], [1.61, 0.42], [0.64, 0.83], [0, 0.79],
    ], [0.74, 0.05], 0.15, 0x315f72, 0xb4ced0);
    const pivot = new THREE.Group();
    wing.scale.x = side;
    pivot.add(wing);
    group.add(pivot);
    wings.push({ pivot, side });
    // Short curled cephalic fins distinguish a manta from a generic ray.
    group.add(curveTube([
      [side * 0.37, -0.01, -0.80], [side * 0.49, -0.01, -1.18],
      [side * 0.37, 0.035, -1.41], [side * 0.25, 0.025, -1.28],
    ], 0.087, bodyMaterial, 10));
  }
  const tail = curveTube([[0, 0, 0.69], [0, 0.02, 1.41], [0.10, 0.08, 2.18], [0.22, 0.17, 2.91]], 0.038, bodyMaterial, 14);
  group.add(tail);
  return {
    group,
    animate(time) {
      for (const { pivot, side } of wings) {
        pivot.rotation.z = side * Math.sin(time * 1.7) * 0.24;
        pivot.rotation.x = Math.sin(time * 1.7 - 0.5) * 0.045;
      }
      tail.rotation.y = Math.sin(time * 1.35 - 0.7) * 0.09;
    },
  };
}
