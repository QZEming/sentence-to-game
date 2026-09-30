import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const TAU = Math.PI * 2;
const DEFAULT_PALETTE = {
  ground: "#bbdbad",
  grass: "#b5d897",
  path: "#ffdec3",
  water: "#8cdde2",
  sky: "#eff5e8",
  fog: "#eff5e8",
  accent: "#f4a7c0",
  tree: "#87bd8e",
};

function pointSegmentDistance(x, z, a, b) {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const den = dx * dx + dz * dz;
  const t =
    den > 0
      ? THREE.MathUtils.clamp(((x - a.x) * dx + (z - a.z) * dz) / den, 0, 1)
      : 0;
  return Math.hypot(x - a.x - dx * t, z - a.z - dz * t);
}

function roundedRectangle(width, depth, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -depth / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + depth - radius);
  shape.quadraticCurveTo(x + width, y + depth, x + width - radius, y + depth);
  shape.lineTo(x + radius, y + depth);
  shape.quadraticCurveTo(x, y + depth, x, y + depth - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function starShape(outer = 1, inner = 0.46) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i += 1) {
    const angle = Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? outer : inner;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

function randomFrom(seed) {
  let value = 2166136261;
  for (const letter of String(seed)) {
    value ^= letter.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A disposable island; lighting and controls belong to the caller. */
export function createWorld(scene, level, { lowQuality = false } = {}) {
  const palette = { ...DEFAULT_PALETTE, ...(level.palette || {}) };
  const themeNames = ["meadow", "brook", "grove", "frost", "starlight"];
  const theme = themeNames.includes(level.id)
    ? level.id
    : themeNames[level.index || 0] || "meadow";
  const random = randomFrom(level.id || theme);
  const paths = level.paths || [];
  const pads = level.pads || [];
  const corePoint = level.core || { x: 12, z: 0 };
  const root = new THREE.Group();
  root.name = "Sugarlight island: " + String(level.id || theme);
  scene.add(root);
  const prototypes = new Set();
  const buckets = new Map();
  const materialCache = new Map();
  const animated = [];
  const occupied = new Set();
  const padMeshes = new Map();
  const pickables = [];
  let selectedPadId = null;
  let disposed = false;

  const proto = (g) => {
    prototypes.add(g);
    return g;
  };
  const sphere = proto(
    new THREE.SphereGeometry(1, lowQuality ? 10 : 14, lowQuality ? 7 : 10),
  );
  const cylinder = proto(new THREE.CylinderGeometry(1, 1, 1, 14));
  const cone = proto(new THREE.ConeGeometry(1, 1, 12));
  const box = proto(new THREE.BoxGeometry(1, 1, 1));
  const rock = proto(new THREE.IcosahedronGeometry(1, 0));
  const crystal = proto(new THREE.OctahedronGeometry(1, 0));
  const star = proto(
    new THREE.ExtrudeGeometry(starShape(), {
      depth: 0.24,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.09,
      curveSegments: 6,
    }),
  );
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const rotation = new THREE.Euler();

  function tint(value, amount) {
    return new THREE.Color(value).lerp(
      new THREE.Color(amount >= 0 ? "#ffffff" : "#283b52"),
      Math.abs(amount),
    );
  }

  function material(key) {
    if (!materialCache.has(key)) {
      const options = { vertexColors: true, roughness: 0.92, metalness: 0.015 };
      if (key === "glow") {
        options.emissive = new THREE.Color("#ffffff");
        options.emissiveIntensity = 0.22;
      }
      if (key === "water") {
        options.roughness = 0.38;
        options.metalness = 0.06;
      }
      materialCache.set(key, new THREE.MeshStandardMaterial(options));
    }
    return materialCache.get(key);
  }

  // Bake static ornaments into a small set of material batches.
  function add(
    geometry,
    x,
    y,
    z,
    sx,
    sy,
    sz,
    color,
    bucket = "flora",
    rx = 0,
    ry = 0,
    rz = 0,
  ) {
    const copy = geometry.clone();
    position.set(x, y, z);
    scale.set(sx, sy, sz);
    rotation.set(rx, ry, rz);
    quaternion.setFromEuler(rotation);
    matrix.compose(position, quaternion, scale);
    copy.applyMatrix4(matrix);
    const flat = copy.index ? copy.toNonIndexed() : copy;
    if (flat !== copy) copy.dispose();
    for (const key of Object.keys(flat.attributes)) {
      if (key !== "position" && key !== "normal") flat.deleteAttribute(key);
    }
    if (!flat.getAttribute("normal")) flat.computeVertexNormals();
    const colorValue =
      color instanceof THREE.Color ? color : new THREE.Color(color);
    const vertexColors = new Float32Array(
      flat.getAttribute("position").count * 3,
    );
    for (let index = 0; index < vertexColors.length; index += 3) {
      vertexColors[index] = colorValue.r;
      vertexColors[index + 1] = colorValue.g;
      vertexColors[index + 2] = colorValue.b;
    }
    flat.setAttribute("color", new THREE.BufferAttribute(vertexColors, 3));
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket).push(flat);
  }

  function flush(bucket, target = root, materialKey = bucket) {
    const geometries = buckets.get(bucket);
    if (!geometries?.length) return null;
    const merged = mergeGeometries(geometries, false);
    for (const geometry of geometries) geometry.dispose();
    buckets.delete(bucket);
    if (!merged) throw new Error("Could not merge island geometry: " + bucket);
    merged.computeBoundingSphere();
    const mesh = new THREE.Mesh(merged, material(materialKey));
    mesh.name = "Island batch: " + bucket;
    mesh.castShadow =
      !lowQuality &&
      !["cloud", "water", "glow", "ground"].includes(materialKey);
    mesh.receiveShadow = materialKey !== "cloud" && materialKey !== "glow";
    target.add(mesh);
    return mesh;
  }

  function pill(x, y, z, radius, height, color, bucket = "flora") {
    add(
      cylinder,
      x,
      y,
      z,
      radius,
      Math.max(0.01, height - radius * 2),
      radius,
      color,
      bucket,
    );
    add(
      sphere,
      x,
      y + height / 2 - radius,
      z,
      radius,
      radius,
      radius,
      color,
      bucket,
    );
    add(
      sphere,
      x,
      y - height / 2 + radius,
      z,
      radius,
      radius,
      radius,
      color,
      bucket,
    );
  }

  function roadDistance(x, z) {
    let distance = Infinity;
    for (const path of paths) {
      for (let i = 1; i < path.length; i += 1) {
        distance = Math.min(
          distance,
          pointSegmentDistance(x, z, path[i - 1], path[i]),
        );
      }
    }
    return distance;
  }

  function clear(x, z, radius = 0.5) {
    if (Math.abs(x) > 15 - radius || Math.abs(z) > 10.8 - radius) return false;
    if (Math.abs(x) > 12.1 && Math.abs(z) > 8.0) return false;
    if (roadDistance(x, z) < 1.15 + radius) return false;
    if (Math.hypot(x - corePoint.x, z - corePoint.z) < 1.6 + radius)
      return false;
    return pads.every(
      (pad) => Math.hypot(x - pad.x, z - pad.z) > 0.95 + radius,
    );
  }

  function landmarkPlace(preferredX, preferredZ, radius) {
    if (clear(preferredX, preferredZ, radius))
      return { x: preferredX, z: preferredZ };
    let best = null;
    let distance = Infinity;
    for (let x = -13; x <= 13; x += 1) {
      for (let z = -9; z <= 9; z += 1) {
        if (!clear(x, z, radius)) continue;
        const score = Math.hypot(x - preferredX, z - preferredZ);
        if (score < distance) {
          distance = score;
          best = { x, z };
        }
      }
    }
    return best;
  }

  // The flat playable top is y = 0.25.
  const islandShape = roundedRectangle(31.8, 22.8, 3.5);
  const islandBody = proto(
    new THREE.ExtrudeGeometry(islandShape, {
      depth: 1.22,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.22,
      bevelThickness: 0.2,
      steps: 1,
      curveSegments: 8,
    }),
  );
  add(
    islandBody,
    0,
    -1.18,
    0,
    1,
    1,
    1,
    tint(palette.ground, -0.28),
    "terrain",
    -Math.PI / 2,
  );
  const islandTop = proto(new THREE.ShapeGeometry(islandShape, 10));
  add(islandTop, 0, 0.25, 0, 1, 1, 1, palette.ground, "ground", -Math.PI / 2);
  const lowerShape = roundedRectangle(30.8, 21.8, 3.4);
  const islandStripe = proto(
    new THREE.ExtrudeGeometry(lowerShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.15,
      bevelThickness: 0.08,
      curveSegments: 6,
    }),
  );
  add(
    islandStripe,
    0,
    -0.93,
    0,
    1,
    1,
    1,
    tint(palette.path, 0.32),
    "terrain",
    -Math.PI / 2,
  );
  for (let i = 0; i < 16; i += 1) {
    const angle = (i / 16) * TAU;
    const x = Math.cos(angle) * (10 + random() * 4);
    const z = Math.sin(angle) * (7 + random() * 2.6);
    add(
      rock,
      x,
      -1.45 - random() * 1.5,
      z,
      0.45 + random() * 0.5,
      0.7 + random(),
      0.4 + random() * 0.5,
      tint(palette.ground, -0.2 - random() * 0.18),
      "terrain",
      random(),
      random(),
      random(),
    );
  }

  for (let i = 0; i < 9; i += 1) {
    const angle = (i / 9) * TAU + 0.25;
    const x = Math.cos(angle) * (20 + random() * 4);
    const z = Math.sin(angle) * (15 + random() * 2.5);
    const y = -3.6 - random() * 1.6;
    for (let j = 0; j < 4; j += 1) {
      add(
        sphere,
        x + (j - 1.5) * 1.35,
        y + Math.sin(j * 1.4) * 0.35,
        z,
        1.9,
        0.75 + random() * 0.35,
        1.3,
        tint("#fff5ef", random() * 0.1),
        "cloud",
      );
    }
  }

  function ribbon(points, width, height, color, bucket) {
    const vertices = [];
    const indices = [];
    for (let i = 0; i < points.length; i += 1) {
      const previous = points[Math.max(0, i - 1)];
      const next = points[Math.min(points.length - 1, i + 1)];
      const dx = next.x - previous.x;
      const dz = next.z - previous.z;
      const length = Math.hypot(dx, dz) || 1;
      const nx = ((-dz / length) * width) / 2;
      const nz = ((dx / length) * width) / 2;
      vertices.push(
        points[i].x + nx,
        height,
        points[i].z + nz,
        points[i].x - nx,
        height,
        points[i].z - nz,
      );
      if (i) {
        const k = i * 2;
        indices.push(k - 2, k, k - 1, k - 1, k, k + 1);
      }
    }
    const geometry = proto(new THREE.BufferGeometry());
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    add(geometry, 0, 0, 0, 1, 1, 1, color, bucket);
  }

  if (theme === "brook") {
    const stream = [];
    for (let i = 0; i <= 32; i += 1) {
      const x = -15.1 + (i * 30.2) / 32;
      stream.push({ x, z: -7.6 + Math.sin(x * 0.36) * 1.05 });
    }
    ribbon(stream, 2.85, 0.253, "#d9ead2", "ground");
    ribbon(stream, 2.15, 0.257, palette.water, "water");
    ribbon(stream, 0.15, 0.26, tint(palette.water, 0.5), "water");
  }

  const renderedRoadPoints = new Set();
  const renderedRoadSegments = new Set();
  for (const path of paths) {
    for (let i = 0; i < path.length; i += 1) {
      const point = path[i];
      const pointKey = point.x + "," + point.z;
      if (!renderedRoadPoints.has(pointKey)) {
        renderedRoadPoints.add(pointKey);
        add(
          cylinder,
          point.x,
          0.262,
          point.z,
          1.065,
          0.016,
          1.065,
          tint(palette.path, -0.12),
          "road",
        );
        add(
          cylinder,
          point.x,
          0.277,
          point.z,
          0.92,
          0.018,
          0.92,
          palette.path,
          "road",
        );
      }
      if (i === 0) continue;
      const a = path[i - 1];
      const segmentKey = [a.x + "," + a.z, pointKey].sort().join("|");
      if (renderedRoadSegments.has(segmentKey)) continue;
      renderedRoadSegments.add(segmentKey);
      const dx = point.x - a.x;
      const dz = point.z - a.z;
      const distance = Math.hypot(dx, dz);
      const yaw = Math.atan2(dx, dz);
      const x = (a.x + point.x) / 2;
      const z = (a.z + point.z) / 2;
      add(
        box,
        x,
        0.261,
        z,
        2.13,
        0.018,
        distance,
        tint(palette.path, -0.12),
        "road",
        0,
        yaw,
      );
      add(
        box,
        x,
        0.277,
        z,
        1.84,
        0.018,
        distance,
        palette.path,
        "road",
        0,
        yaw,
      );
      const count = Math.max(1, Math.floor(distance / 1.08));
      for (let tile = 0; tile < count; tile += 1) {
        const t = (tile + 0.5) / count;
        const tx = a.x + dx * t;
        const tz = a.z + dz * t;
        const waterCrossing =
          theme === "brook" &&
          Math.abs(tz - (-7.6 + Math.sin(tx * 0.36) * 1.05)) < 1.22;
        add(
          box,
          tx,
          0.29,
          tz,
          waterCrossing ? 2.05 : 1.5,
          0.015,
          waterCrossing ? 0.69 : 0.55,
          waterCrossing
            ? "#c99c88"
            : tint(palette.path, tile % 2 ? 0.13 : 0.07),
          "road",
          0,
          yaw,
        );
      }
    }
  }

  function flower(x, z, size = 1, color = palette.accent) {
    const y = 0.29;
    add(
      cylinder,
      x,
      y + 0.2 * size,
      z,
      0.025 * size,
      0.4 * size,
      0.025 * size,
      "#6da97e",
    );
    for (let i = 0; i < 5; i += 1) {
      const a = (i / 5) * TAU;
      add(
        sphere,
        x + Math.cos(a) * 0.115 * size,
        y + 0.39 * size,
        z + Math.sin(a) * 0.115 * size,
        0.11 * size,
        0.05 * size,
        0.11 * size,
        color,
      );
    }
    add(
      sphere,
      x,
      y + 0.43 * size,
      z,
      0.075 * size,
      0.06 * size,
      0.075 * size,
      "#ffe8a5",
    );
    add(
      sphere,
      x + 0.1 * size,
      y + 0.15 * size,
      z,
      0.13 * size,
      0.035 * size,
      0.065 * size,
      "#77b384",
      "flora",
      0,
      0,
      0.25,
    );
  }

  function bush(x, z, size, color) {
    for (let i = 0; i < 3; i += 1) {
      const a = i * 2.2;
      add(
        sphere,
        x + Math.cos(a) * size * 0.25,
        0.35 + size * 0.35,
        z + Math.sin(a) * size * 0.25,
        size * 0.52,
        size * (i === 0 ? 0.58 : 0.42),
        size * 0.5,
        tint(color, i * 0.04),
      );
    }
  }

  function tree(x, z, size, color = palette.tree) {
    pill(x, 0.25 + size * 0.68, z, size * 0.11, size * 1.25, "#b58f80");
    add(
      sphere,
      x,
      0.25 + size * 1.85,
      z,
      size * 0.73,
      size * 0.87,
      size * 0.65,
      color,
    );
    add(
      sphere,
      x - size * 0.4,
      0.25 + size * 1.46,
      z + size * 0.04,
      size * 0.51,
      size * 0.52,
      size * 0.5,
      tint(color, 0.1),
    );
    add(
      sphere,
      x + size * 0.4,
      0.25 + size * 1.55,
      z - size * 0.04,
      size * 0.49,
      size * 0.55,
      size * 0.48,
      tint(color, -0.06),
    );
    for (let i = 0; i < 3; i += 1) {
      add(
        sphere,
        x + (random() - 0.5) * size,
        0.25 + size * (1.4 + random() * 0.5),
        z + size * 0.58,
        size * 0.095,
        size * 0.095,
        size * 0.095,
        "#ffe6b6",
      );
    }
  }

  function mushroom(x, z, size, color = palette.accent, face = false) {
    pill(x, 0.25 + size * 0.56, z, size * 0.24, size * 1.1, "#f8e6d8");
    add(
      sphere,
      x,
      0.25 + size * 1.12,
      z,
      size * 0.88,
      size * 0.46,
      size * 0.82,
      color,
    );
    add(
      sphere,
      x,
      0.25 + size * 0.98,
      z,
      size * 0.73,
      size * 0.1,
      size * 0.71,
      "#fff0d9",
    );
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * TAU;
      add(
        sphere,
        x + Math.cos(a) * size * 0.51,
        0.25 + size * 1.42,
        z + Math.sin(a) * size * 0.4,
        size * 0.125,
        size * 0.035,
        size * 0.11,
        "#ffe7ce",
        "flora",
        0,
        a,
      );
    }
    if (face) {
      for (const side of [-1, 1]) {
        add(
          sphere,
          x + side * size * 0.1,
          0.25 + size * 0.6,
          z + size * 0.235,
          size * 0.04,
          size * 0.06,
          size * 0.025,
          "#625269",
        );
        add(
          sphere,
          x + side * size * 0.19,
          0.25 + size * 0.48,
          z + size * 0.2,
          size * 0.07,
          size * 0.025,
          size * 0.02,
          "#eda2b2",
        );
      }
    }
  }

  function snowTree(x, z, size) {
    pill(x, 0.25 + size * 0.35, z, size * 0.11, size * 0.7, "#a58a9e");
    for (let i = 0; i < 3; i += 1) {
      const width = size * (0.77 - i * 0.17);
      const y = 0.25 + size * (0.8 + i * 0.48);
      add(
        cone,
        x,
        y,
        z,
        width,
        size * 0.95,
        width,
        i === 0 ? "#91bfcd" : "#c1dfde",
      );
      add(
        cone,
        x,
        y + size * 0.21,
        z,
        width * 0.82,
        size * 0.57,
        width * 0.82,
        "#f9f7f0",
      );
    }
    add(
      sphere,
      x,
      0.25 + size * 2.29,
      z,
      size * 0.105,
      size * 0.12,
      size * 0.105,
      "#ffe8ae",
      "glow",
    );
  }

  function lantern(x, z, size = 1, color = "#ffe5aa") {
    pill(
      x,
      0.25 + size * 0.65,
      z,
      size * 0.065,
      size * 1.3,
      "#958cb1",
      "architecture",
    );
    add(
      cylinder,
      x,
      0.29,
      z,
      size * 0.3,
      size * 0.08,
      size * 0.3,
      "#d4c8ea",
      "architecture",
    );
    add(
      star,
      x,
      0.25 + size * 1.65,
      z - size * 0.07,
      size * 0.32,
      size * 0.32,
      size * 0.32,
      color,
      "glow",
      0,
      0.2,
    );
    add(
      sphere,
      x,
      0.25 + size * 1.24,
      z,
      size * 0.09,
      size * 0.12,
      size * 0.09,
      "#b2e3d5",
      "architecture",
    );
  }

  const landmark = landmarkPlace(-7, -8.5, theme === "starlight" ? 1.65 : 1.3);
  if (landmark && theme === "meadow") {
    const { x, z } = landmark;
    add(cone, x, 1.46, z, 0.9, 2.4, 0.9, "#fff0d1", "architecture");
    add(cone, x, 2.97, z, 1.08, 0.95, 1.08, "#edacc0", "architecture");
    add(box, x, 0.8, z + 0.7, 0.45, 0.8, 0.14, "#a2829e", "architecture");
    add(
      sphere,
      x + 0.47,
      1.77,
      z + 0.51,
      0.2,
      0.24,
      0.07,
      "#afdae1",
      "architecture",
    );
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(x, 2.48, z + 0.7);
    root.add(rotorGroup);
    for (let i = 0; i < 4; i += 1) {
      const a = (i * Math.PI) / 2;
      add(
        box,
        Math.sin(a) * 0.67,
        Math.cos(a) * 0.67,
        0,
        0.28,
        1.08,
        0.12,
        "#fff5df",
        "windmill-rotor",
        0,
        0,
        -a,
      );
      add(
        box,
        Math.sin(a) * 0.92,
        Math.cos(a) * 0.92,
        0.075,
        0.24,
        0.26,
        0.03,
        "#f8c4b8",
        "windmill-rotor",
        0,
        0,
        -a,
      );
    }
    add(sphere, 0, 0, 0.11, 0.21, 0.21, 0.12, "#e9b870", "windmill-rotor");
    flush("windmill-rotor", rotorGroup, "architecture");
    animated.push({ kind: "rotor", object: rotorGroup, speed: 0.3 });
  } else if (landmark && theme === "brook") {
    const { x, z } = landmark;
    add(sphere, x, 0.7, z, 1.22, 0.52, 0.95, "#e2ece2", "architecture");
    add(sphere, x, 1.19, z, 0.92, 0.34, 0.79, "#afd9d4", "architecture");
    add(sphere, x, 1.55, z, 0.68, 0.2, 0.58, "#d5eeee", "architecture");
    add(star, x, 1.91, z, 0.36, 0.36, 0.36, "#ffe2a5", "glow");
    for (const side of [-1, 1]) {
      add(
        sphere,
        x + side * 0.48,
        0.88,
        z + 0.7,
        0.23,
        0.17,
        0.17,
        "#a3d5c2",
        "architecture",
      );
      add(
        sphere,
        x + side * 0.31,
        1.24,
        z + 0.7,
        0.065,
        0.1,
        0.06,
        "#4d7682",
        "architecture",
      );
    }
  } else if (landmark && theme === "grove") {
    const { x, z } = landmark;
    mushroom(x, z, 2.0, "#c095d6", true);
    add(
      sphere,
      x,
      0.68,
      z + 0.48,
      0.38,
      0.48,
      0.045,
      "#836ba5",
      "architecture",
    );
    add(sphere, x + 0.13, 0.73, z + 0.54, 0.05, 0.05, 0.04, "#ffe8ae", "glow");
    lantern(x - 1.2, z + 0.5, 0.7, "#b8f1e6");
  } else if (landmark && theme === "frost") {
    const { x, z } = landmark;
    const dome = proto(
      new THREE.SphereGeometry(1, 18, 8, 0, TAU, 0, Math.PI / 2),
    );
    add(dome, x, 0.26, z, 1.45, 1.6, 1.35, "#f3f4f4", "architecture");
    add(sphere, x, 0.71, z + 1.15, 0.48, 0.6, 0.31, "#d4e3ec", "architecture");
    add(sphere, x, 0.68, z + 1.38, 0.31, 0.47, 0.03, "#8798c2", "architecture");
    for (const side of [-1, 1]) {
      add(
        sphere,
        x + side * 0.63,
        1.0,
        z + 0.87,
        0.11,
        0.16,
        0.035,
        "#7592ad",
        "architecture",
      );
      add(
        sphere,
        x + side * 0.87,
        0.78,
        z + 0.75,
        0.17,
        0.07,
        0.03,
        "#ecc1d0",
        "architecture",
      );
    }
    add(star, x, 1.96, z - 0.03, 0.32, 0.32, 0.32, "#ffe6ad", "glow");
  } else if (landmark && theme === "starlight") {
    const { x, z } = landmark;
    add(box, x, 0.93, z, 2.35, 1.36, 1.0, "#d9ccef", "architecture");
    for (const side of [-1, 1]) {
      pill(x + side * 1.14, 1.18, z, 0.48, 1.86, "#eee2f4", "architecture");
      add(
        cone,
        x + side * 1.14,
        2.55,
        z,
        0.68,
        1.06,
        0.68,
        "#a9bedf",
        "architecture",
      );
      add(star, x + side * 1.14, 3.16, z, 0.22, 0.22, 0.22, "#ffe9ae", "glow");
    }
    add(sphere, x, 0.89, z + 0.54, 0.5, 0.64, 0.06, "#9489b8", "architecture");
    add(star, x, 1.87, z + 0.59, 0.36, 0.36, 0.23, "#fff0ad", "glow");
    for (const side of [-1, 1]) {
      add(
        sphere,
        x + side * 0.78,
        1.24,
        z + 0.53,
        0.12,
        0.21,
        0.05,
        "#a3cdda",
        "architecture",
      );
    }
  }

  const usedDecorations = landmark ? [{ ...landmark, radius: 2.5 }] : [];
  for (let i = 0; i < 145; i += 1) {
    const x = (random() - 0.5) * 28;
    const z = (random() - 0.5) * 19.6;
    if (z > 4.5 && Math.abs(x) < 10) continue;
    const size = 0.63 + random() * 0.45;
    const radius = size * 0.8;
    if (!clear(x, z, radius)) continue;
    if (
      usedDecorations.some(
        (item) =>
          Math.hypot(item.x - x, item.z - z) < item.radius + radius + 0.25,
      )
    )
      continue;
    usedDecorations.push({ x, z, radius });
    if (theme === "grove")
      mushroom(x, z, size * 1.12, i % 2 ? "#b18dcd" : "#e5a5c9", i % 4 === 0);
    else if (theme === "frost") snowTree(x, z, size);
    else if (theme === "starlight") {
      if (i % 3 === 0) tree(x, z, size * 0.8, "#b2afd9");
      else lantern(x, z, size, i % 2 ? "#ffe4af" : "#bbf0dc");
    } else
      tree(x, z, size, i % 3 === 0 ? tint(palette.accent, 0.12) : palette.tree);
    if (usedDecorations.length >= (lowQuality ? 18 : 25)) break;
  }

  for (let i = 0; i < (lowQuality ? 78 : 120); i += 1) {
    const x = (random() - 0.5) * 29.5;
    const z = (random() - 0.5) * 21;
    if (!clear(x, z, 0.22)) continue;
    if (
      usedDecorations.some(
        (item) => Math.hypot(item.x - x, item.z - z) < item.radius * 0.65,
      )
    )
      continue;
    const size = 0.55 + random() * 0.45;
    if (theme === "frost") {
      if (i % 3)
        add(rock, x, 0.33, z, size * 0.35, size * 0.18, size * 0.35, "#f8f7f3");
      else {
        add(
          crystal,
          x,
          0.25 + size * 0.45,
          z,
          size * 0.23,
          size * 0.6,
          size * 0.23,
          "#bbdce7",
          "glow",
          0.08,
          random(),
          0.12,
        );
        add(
          crystal,
          x + 0.22,
          0.25 + size * 0.24,
          z + 0.13,
          size * 0.17,
          size * 0.32,
          size * 0.17,
          "#e2c9e9",
          "glow",
          0.2,
          0,
          -0.2,
        );
      }
    } else if (theme === "grove") {
      if (i % 3 === 0) mushroom(x, z, size * 0.48, "#abdcd4");
      else
        add(
          sphere,
          x,
          0.32,
          z,
          size * 0.25,
          size * 0.12,
          size * 0.26,
          i % 2 ? "#a498c3" : "#809fad",
        );
    } else if (theme === "starlight") {
      if (i % 3 === 0)
        add(
          star,
          x,
          0.34,
          z,
          size * 0.2,
          size * 0.2,
          size * 0.18,
          "#efdfaf",
          "architecture",
          -Math.PI / 2,
          0,
          random(),
        );
      else flower(x, z, size * 0.8, i % 2 ? "#c7c0ed" : "#f6c8d7");
    } else if (i % 4 === 0) bush(x, z, size * 0.48, palette.tree);
    else flower(x, z, size, i % 2 ? palette.accent : "#fff5cf");
  }

  const entrances = [];
  for (const path of paths) {
    if (path.length < 2) continue;
    const entry = path[0];
    if (
      entrances.some(
        (point) => Math.hypot(point.x - entry.x, point.z - entry.z) < 0.4,
      )
    )
      continue;
    entrances.push(entry);
    const next = path[1];
    const yaw = Math.atan2(next.x - entry.x, next.z - entry.z);
    const rightX = Math.cos(yaw);
    const rightZ = -Math.sin(yaw);
    for (const side of [-1, 1]) {
      const x = entry.x + rightX * side * 1.3;
      const z = entry.z + rightZ * side * 1.3;
      pill(x, 0.94, z, 0.15, 1.38, "#f4e7df", "architecture");
      add(sphere, x, 1.65, z, 0.35, 0.29, 0.34, palette.accent, "architecture");
      add(
        cylinder,
        x,
        0.33,
        z,
        0.31,
        0.14,
        0.31,
        tint(palette.accent, 0.2),
        "architecture",
      );
    }
    const arch = proto(new THREE.TorusGeometry(1.3, 0.105, 6, 20, Math.PI));
    add(
      arch,
      entry.x,
      1.35,
      entry.z,
      1,
      1,
      1,
      tint(palette.accent, 0.3),
      "architecture",
      0,
      yaw,
    );
    add(
      star,
      entry.x,
      2.81,
      entry.z,
      0.28,
      0.28,
      0.28,
      "#ffe9b3",
      "glow",
      0,
      yaw,
    );
  }

  const padGeometry = new THREE.CylinderGeometry(0.79, 0.85, 0.065, 28);
  for (const pad of pads) {
    add(
      cylinder,
      pad.x,
      0.272,
      pad.z,
      0.96,
      0.035,
      0.96,
      tint(palette.path, -0.15),
      "architecture",
    );
    add(
      cylinder,
      pad.x,
      0.292,
      pad.z,
      0.9,
      0.045,
      0.9,
      "#fff1d9",
      "architecture",
    );
    const padMaterial = new THREE.MeshStandardMaterial({
      color: "#e7d8ba",
      roughness: 0.93,
      emissive: "#ffe9ab",
      emissiveIntensity: 0,
    });
    const mesh = new THREE.Mesh(padGeometry, padMaterial);
    mesh.position.set(pad.x, 0.294, pad.z);
    mesh.userData.padId = pad.id;
    mesh.name = "Build pad " + pad.id;
    mesh.receiveShadow = !lowQuality;
    root.add(mesh);
    padMeshes.set(pad.id, mesh);
    pickables.push(mesh);
    for (let i = 0; i < 4; i += 1) {
      const a = (i * Math.PI) / 2;
      add(
        sphere,
        pad.x + Math.sin(a) * 0.88,
        0.336,
        pad.z + Math.cos(a) * 0.88,
        0.045,
        0.035,
        0.045,
        "#fff7e3",
        "architecture",
      );
    }
  }

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(31.6, 22.6),
    new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }),
  );
  ground.name = "Island ground hit plane";
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0.25;
  ground.userData.ground = true;
  root.add(ground);

  const core = new THREE.Group();
  core.name = "Star lantern core";
  core.position.set(corePoint.x, 0, corePoint.z);
  root.add(core);
  add(cylinder, 0, 0.39, 0, 0.95, 0.25, 0.95, "#e5c9ae", "core");
  add(cylinder, 0, 0.52, 0, 0.83, 0.1, 0.83, "#fff1d2", "core");
  add(sphere, 0, 1.12, 0, 0.64, 0.69, 0.52, "#ffe5a1", "core");
  add(
    sphere,
    -0.58,
    0.94,
    0.02,
    0.23,
    0.16,
    0.22,
    "#ffe5a1",
    "core",
    0,
    0,
    -0.3,
  );
  add(sphere, 0.58, 0.94, 0.02, 0.23, 0.16, 0.22, "#ffe5a1", "core", 0, 0, 0.3);
  for (const side of [-1, 1]) {
    add(
      sphere,
      side * 0.36,
      0.97,
      0.445,
      0.115,
      0.055,
      0.022,
      "#ee9ea6",
      "core",
    );
    add(sphere, side * 0.24, 0.61, 0.26, 0.18, 0.11, 0.24, "#e9b69e", "core");
  }
  const smileCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.09, 1.005, 0.508),
    new THREE.Vector3(0, 0.92, 0.54),
    new THREE.Vector3(0.09, 1.005, 0.508),
  );
  const smile = proto(new THREE.TubeGeometry(smileCurve, 8, 0.019, 5, false));
  add(smile, 0, 0, 0, 1, 1, 1, "#765a64", "core");
  flush("core", core, "architecture");
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: "#625164",
    roughness: 0.65,
  });
  const eyeGeometry = new THREE.SphereGeometry(1, 10, 8);
  const eyes = [];
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(side * 0.2, 1.16, 0.483);
    eye.scale.set(0.062, 0.096, 0.034);
    core.add(eye);
    eyes.push(eye);
    add(
      sphere,
      side * 0.2 - 0.013,
      1.188,
      0.517,
      0.018,
      0.024,
      0.01,
      "#fffbee",
      "core-highlights",
    );
  }
  const eyeHighlights = flush("core-highlights", core, "architecture");
  const crownGroup = new THREE.Group();
  crownGroup.position.set(0, 1.99, 0);
  core.add(crownGroup);
  add(star, 0, 0, -0.05, 0.37, 0.37, 0.37, "#ffe793", "core-crown");
  flush("core-crown", crownGroup, "glow");
  animated.push({
    kind: "core",
    object: core,
    crown: crownGroup,
    eyes,
    highlights: eyeHighlights,
  });

  const selection = new THREE.Group();
  selection.name = "Selection range";
  selection.visible = false;
  root.add(selection);
  const rangeMaterial = new THREE.MeshBasicMaterial({
    color: "#b7edc6",
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const rangeRing = new THREE.Mesh(
    new THREE.RingGeometry(0.987, 1, 80),
    rangeMaterial,
  );
  rangeRing.rotation.x = -Math.PI / 2;
  rangeRing.position.y = 0.341;
  selection.add(rangeRing);
  const rangeFillMaterial = new THREE.MeshBasicMaterial({
    color: "#b7edc6",
    transparent: true,
    opacity: 0.085,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const rangeFill = new THREE.Mesh(
    new THREE.CircleGeometry(0.987, 64),
    rangeFillMaterial,
  );
  rangeFill.rotation.x = -Math.PI / 2;
  rangeFill.position.y = 0.337;
  selection.add(rangeFill);
  const padRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.9, 0.032, 6, 40),
    new THREE.MeshBasicMaterial({
      color: "#fff0a8",
      transparent: true,
      opacity: 0.94,
      depthWrite: false,
    }),
  );
  padRing.rotation.x = Math.PI / 2;
  padRing.position.y = 0.37;
  padRing.visible = false;
  root.add(padRing);

  const rally = new THREE.Group();
  rally.name = "Hero rally flag";
  rally.visible = false;
  root.add(rally);
  add(cylinder, 0, 0.028, 0, 0.36, 0.045, 0.36, "#c2e6d3", "rally");
  pill(0, 0.43, 0, 0.033, 0.85, "#f8f1d7", "rally");
  add(sphere, 0, 0.86, 0, 0.072, 0.072, 0.072, "#ffe9a2", "rally");
  const flagShape = new THREE.Shape();
  flagShape.moveTo(0, 0);
  flagShape.lineTo(0.44, -0.13);
  flagShape.lineTo(0, -0.3);
  flagShape.closePath();
  const flagGeometry = proto(
    new THREE.ExtrudeGeometry(flagShape, { depth: 0.035, bevelEnabled: false }),
  );
  add(flagGeometry, 0.025, 0.77, 0, 1, 1, 1, "#6db99b", "rally");
  flush("rally", rally, "architecture");

  const particleCount = lowQuality ? 10 : 28;
  const particleGeometry =
    theme === "frost"
      ? new THREE.OctahedronGeometry(0.037)
      : new THREE.SphereGeometry(0.034, 5, 4);
  const particleMaterial = new THREE.MeshBasicMaterial({
    color: theme === "frost" ? "#ffffff" : "#fff1bc",
  });
  const particles = new THREE.InstancedMesh(
    particleGeometry,
    particleMaterial,
    particleCount,
  );
  particles.name = "Island ambient motes";
  particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  particles.frustumCulled = false;
  const particleSeeds = [];
  for (let i = 0; i < particleCount; i += 1) {
    particleSeeds.push({
      x: (random() - 0.5) * 28,
      z: (random() - 0.5) * 18,
      y: 0.6 + random() * 2.0,
      phase: random() * TAU,
      size: 0.65 + random() * 0.9,
    });
  }
  root.add(particles);

  for (const bucket of Array.from(buckets.keys())) {
    flush(
      bucket,
      root,
      ["water", "cloud", "glow", "ground"].includes(bucket)
        ? bucket
        : bucket === "terrain"
          ? "terrain"
          : "flora",
    );
  }
  for (const geometry of prototypes) geometry.dispose();
  prototypes.clear();

  function refreshPads() {
    for (const [id, mesh] of padMeshes) {
      const isOccupied = occupied.has(id);
      mesh.material.color.set(isOccupied ? "#beaf9c" : "#e7d8ba");
      mesh.material.emissiveIntensity = id === selectedPadId ? 0.3 : 0;
    }
  }

  function setSelection(value) {
    selectedPadId = value?.padId ?? null;
    const pad =
      selectedPadId === null
        ? null
        : pads.find((item) => item.id === selectedPadId);
    const x = Number.isFinite(value?.x) ? value.x : pad?.x;
    const z = Number.isFinite(value?.z) ? value.z : pad?.z;
    const radius = Number.isFinite(value?.range) ? Math.max(0, value.range) : 0;
    const visible = Boolean(value) && Number.isFinite(x) && Number.isFinite(z);
    selection.visible = visible && radius > 0;
    if (visible) {
      selection.position.set(x, 0, z);
      rangeRing.scale.setScalar(radius);
      rangeFill.scale.setScalar(radius);
      rangeFill.visible = !lowQuality;
      const color = value.valid === false ? "#f69ea2" : "#aee6c6";
      rangeMaterial.color.set(color);
      rangeFillMaterial.color.set(color);
    }
    padRing.visible = Boolean(pad);
    if (pad) padRing.position.set(pad.x, 0.37, pad.z);
    refreshPads();
  }

  function setOccupied(towers = []) {
    occupied.clear();
    const values =
      towers instanceof Map
        ? towers.values()
        : towers instanceof Set
          ? towers.values()
          : Array.isArray(towers)
            ? towers
            : Object.values(towers || {});
    for (const tower of values) {
      const id =
        typeof tower === "string" ? tower : (tower?.padId ?? tower?.pad);
      if (id !== undefined && id !== null) occupied.add(id);
    }
    refreshPads();
  }

  function setRally(x, z) {
    rally.visible = Number.isFinite(x) && Number.isFinite(z);
    if (rally.visible) rally.position.set(x, 0.27, z);
  }

  function update(dt, time) {
    if (disposed) return;
    const elapsed = Number.isFinite(time) ? time : 0;
    for (const entry of animated) {
      if (entry.kind === "rotor")
        entry.object.rotation.z = -elapsed * entry.speed;
      if (entry.kind === "core") {
        entry.object.position.y = Math.sin(elapsed * 1.8) * 0.024;
        entry.crown.rotation.z = Math.sin(elapsed * 0.9) * 0.085;
        entry.crown.position.y = 1.99 + Math.sin(elapsed * 2.1) * 0.06;
        const cycle = elapsed % 5.8;
        const blinking = cycle > 5.4 && cycle < 5.54;
        for (const eye of entry.eyes) eye.scale.y = blinking ? 0.014 : 0.096;
        if (entry.highlights) entry.highlights.visible = !blinking;
      }
    }
    if (padRing.visible) {
      const pulse = 1 + Math.sin(elapsed * 3.3) * 0.027;
      padRing.scale.set(pulse, pulse, pulse);
    }
    if (rally.visible) rally.rotation.y = Math.sin(elapsed * 1.7) * 0.1;
    for (let i = 0; i < particleSeeds.length; i += 1) {
      const particle = particleSeeds[i];
      const px = particle.x + Math.sin(elapsed * 0.24 + particle.phase) * 0.23;
      const pz = particle.z + Math.cos(elapsed * 0.2 + particle.phase) * 0.22;
      const py =
        theme === "frost"
          ? 0.45 + ((particle.y + 3 - ((elapsed * 0.16) % 3)) % 3)
          : particle.y + Math.sin(elapsed * 0.9 + particle.phase) * 0.2;
      position.set(px, py, pz);
      quaternion.setFromEuler(
        rotation.set(0, elapsed * 0.2 + particle.phase, 0),
      );
      scale.setScalar(particle.size);
      matrix.compose(position, quaternion, scale);
      particles.setMatrixAt(i, matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    scene.remove(root);
    const geometries = new Set();
    const materials = new Set();
    root.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) {
        for (const value of Array.isArray(object.material)
          ? object.material
          : [object.material])
          materials.add(value);
      }
    });
    for (const geometry of geometries) geometry.dispose();
    for (const value of materials) value.dispose();
    root.clear();
    pickables.length = 0;
    padMeshes.clear();
    occupied.clear();
    animated.length = 0;
    particleSeeds.length = 0;
  }

  update(0, 0);
  return {
    pickables,
    ground,
    update,
    setSelection,
    setOccupied,
    setRally,
    dispose,
  };
}
