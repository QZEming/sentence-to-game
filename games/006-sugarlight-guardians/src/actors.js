import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// GPU resources are owned by one actor; pastel colors are vertex attributes,
// allowing detailed models to use only 3–7 draw calls, including contact shadows.
const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);
const WHITE = 0xfff9e9;
const INK = 0x29344c;
let sequence = 0;
const TOWER_COLORS = {
  carrot: { primary: 0xffa252, secondary: 0x9edcb1, accent: 0x73b795 },
  berry: { primary: 0xef829c, secondary: 0xcbb2ed, accent: 0x8ccfa0 },
  frost: { primary: 0x9edbea, secondary: 0xc6bff1, accent: 0x89c7b1 },
  spark: { primary: 0x94cfb1, secondary: 0xaddbe1, accent: 0xeed781 },
  honey: { primary: 0xf3c56c, secondary: 0xf0a76d, accent: 0xa4cf96 },
  bloom: { primary: 0xd2a8df, secondary: 0xf5afbf, accent: 0x9acbb4 },
};
const ENEMY_COLORS = {
  puff: { primary: 0xc7b4e5, secondary: 0xa497d2, accent: 0xf5d68d },
  hopper: { primary: 0xcdbce9, secondary: 0xb397d3, accent: 0xf6d5a4 },
  shell: { primary: 0xb1b8da, secondary: 0x8e9bbc, accent: 0xb7d6ad },
  moth: { primary: 0xbab1e2, secondary: 0xe0bce5, accent: 0xf4dba2 },
  shaman: { primary: 0xac9acf, secondary: 0xcfb6df, accent: 0xbfd69e },
  splitter: { primary: 0xa9d9e3, secondary: 0xa69ddd, accent: 0xd8bbeb },
  boss: { primary: 0xaf9ccd, secondary: 0x8f87b8, accent: 0xf0d18a },
};
const HERO_COLORS = {
  momo: { primary: 0xeea6bb, secondary: 0xcbaadc, accent: 0x94cdae },
  pip: { primary: 0xeeb078, secondary: 0xd68f65, accent: 0x9acfb9 },
  bao: { primary: 0xa8bbd9, secondary: 0x7f96bd, accent: 0x9dc69b },
};
function finite(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}
function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}
function angleDifference(target, current) {
  return Math.atan2(Math.sin(target - current), Math.cos(target - current));
}

function makeActor(colors, label, options = {}) {
  const group = new THREE.Group();
  group.name = label;
  const ownedGeometry = new Set();
  const ownedMaterials = new Map();
  const ownedTextures = new Set();
  const palette = {
    cream: WHITE,
    dark: INK,
    pink: 0xf0a4b8,
    gold: 0xf6d98b,
    ...colors,
  };
  const phase = (sequence++ * 2.3999632297) % TAU;
  let disposed = false;
  function materialKey(name) {
    if (name === "dark" || name === "gold" || name === "bubble") return name;
    if (options.transparentPrimary && name === "primary") return "bubble";
    return "pastel";
  }
  function material(name) {
    const key = materialKey(name);
    if (ownedMaterials.has(key)) return ownedMaterials.get(key);
    const result = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: key === "dark" ? 0.3 : 0.76,
      metalness: key === "gold" ? 0.12 : 0,
      emissive: key === "gold" ? palette.gold : 0x000000,
      emissiveIntensity: key === "gold" ? 0.1 : 0,
    });
    result.name = label + ":" + key;
    ownedMaterials.set(key, result);
    return result;
  }
  function build(parent, draw) {
    const bins = new Map();
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const position = new THREE.Vector3();
    const scaling = new THREE.Vector3();
    function add(
      name,
      geometry,
      at = [0, 0, 0],
      scale = [1, 1, 1],
      rotation = [0, 0, 0],
    ) {
      let ready = geometry;
      if (geometry.index) {
        ready = geometry.toNonIndexed();
        geometry.dispose();
      }
      position.fromArray(at);
      scaling.fromArray(scale);
      quaternion.setFromEuler(new THREE.Euler(...rotation));
      matrix.compose(position, quaternion, scaling);
      ready.applyMatrix4(matrix);
      const color = new THREE.Color(palette[name] ?? WHITE);
      const count = ready.getAttribute("position").count;
      const values = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        values[i * 3] = color.r;
        values[i * 3 + 1] = color.g;
        values[i * 3 + 2] = color.b;
      }
      ready.setAttribute("color", new THREE.BufferAttribute(values, 3));
      for (const key of Object.keys(ready.attributes)) {
        if (!["position", "normal", "uv", "color"].includes(key))
          ready.deleteAttribute(key);
      }
      const key = materialKey(name);
      if (!bins.has(key)) bins.set(key, []);
      bins.get(key).push(ready);
    }
    const p = {
      ball(name, at, scale = [1, 1, 1], rotation = [0, 0, 0], segments = 12) {
        add(
          name,
          new THREE.SphereGeometry(1, segments, 8),
          at,
          scale,
          rotation,
        );
      },
      cylinder(
        name,
        at,
        radius,
        height,
        rotation = [0, 0, 0],
        topRadius = radius,
        sides = 12,
      ) {
        add(
          name,
          new THREE.CylinderGeometry(topRadius, radius, height, sides),
          at,
          [1, 1, 1],
          rotation,
        );
      },
      cone(name, at, radius, height, rotation = [0, 0, 0], sides = 10) {
        add(
          name,
          new THREE.ConeGeometry(radius, height, sides),
          at,
          [1, 1, 1],
          rotation,
        );
      },
      box(name, at, size, rotation = [0, 0, 0]) {
        add(name, new THREE.BoxGeometry(...size), at, [1, 1, 1], rotation);
      },
      ring(name, at, radius, tube, rotation = [0, 0, 0], arc = TAU) {
        add(
          name,
          new THREE.TorusGeometry(radius, tube, 5, 16, arc),
          at,
          [1, 1, 1],
          rotation,
        );
      },
      star(name, at, radius = 0.13, rotation = [0, 0, 0]) {
        const outline = new THREE.Shape();
        for (let i = 0; i < 10; i++) {
          const angle = Math.PI / 2 + (i * Math.PI) / 5;
          const r = radius * (i % 2 ? 0.46 : 1);
          const x = Math.cos(angle) * r,
            y = Math.sin(angle) * r;
          if (i === 0) outline.moveTo(x, y);
          else outline.lineTo(x, y);
        }
        outline.closePath();
        const geometry = new THREE.ExtrudeGeometry(outline, {
          depth: 0.036,
          steps: 1,
          bevelEnabled: true,
          bevelThickness: 0.015,
          bevelSize: 0.012,
          bevelSegments: 1,
          curveSegments: 1,
        });
        geometry.translate(0, 0, -0.018);
        add(name, geometry, at, [1, 1, 1], rotation);
      },
      leaf(name, at, size = [0.1, 0.24, 0.055], rotation = [0, 0, 0]) {
        add(name, new THREE.SphereGeometry(1, 8, 6), at, size, rotation);
      },
      stick(name, start, end, radius = 0.025) {
        const a = new THREE.Vector3(...start),
          b = new THREE.Vector3(...end);
        const delta = b.clone().sub(a);
        if (delta.lengthSq() < 1e-8) return;
        const geometry = new THREE.CylinderGeometry(
          radius,
          radius,
          delta.length(),
          7,
        );
        const q = new THREE.Quaternion().setFromUnitVectors(
          UP,
          delta.normalize(),
        );
        geometry.applyQuaternion(q);
        geometry.translate(...a.add(b).multiplyScalar(0.5).toArray());
        add(name, geometry);
      },
      face(y, z, spread = 0.11, scale = 1, centerX = 0) {
        for (const sign of [-1, 1]) {
          const x = centerX + sign * spread;
          p.ball(
            "dark",
            [x, y, z],
            [0.032 * scale, 0.046 * scale, 0.025 * scale],
          );
          p.ball(
            "cream",
            [x - 0.008 * scale, y + 0.015 * scale, z + 0.021 * scale],
            [0.009 * scale, 0.012 * scale, 0.007 * scale],
            [0, 0, 0],
            8,
          );
          p.ball(
            "pink",
            [
              centerX + sign * (spread + 0.068 * scale),
              y - 0.055 * scale,
              z - 0.015 * scale,
            ],
            [0.054 * scale, 0.027 * scale, 0.017 * scale],
            [0, 0, sign * 0.12],
          );
        }
        p.ball(
          "dark",
          [centerX, y - 0.071 * scale, z + 0.009 * scale],
          [0.025 * scale, 0.014 * scale, 0.014 * scale],
          [0, 0, 0],
          8,
        );
      },
    };
    draw(p);
    for (const [name, pieces] of bins) {
      const merged = mergeGeometries(pieces, false);
      for (const piece of pieces) piece.dispose();
      if (!merged)
        throw new Error(
          "Could not merge actor geometry: " + label + "/" + name,
        );
      merged.computeBoundingSphere();
      ownedGeometry.add(merged);
      const mesh = new THREE.Mesh(merged, material(name));
      mesh.name = label + ":" + name;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
    }
  }
  function shadow(radius, opacity = 0.17) {
    const size = 32,
      pixels = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const r = Math.hypot(
          (x + 0.5 - size / 2) / (size / 2),
          (y + 0.5 - size / 2) / (size / 2),
        );
        const alpha = Math.pow(Math.max(0, 1 - r * r), 2),
          index = (y * size + x) * 4;
        pixels[index] = 50;
        pixels[index + 1] = 51;
        pixels[index + 2] = 76;
        pixels[index + 3] = Math.round(alpha * 255);
      }
    const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    ownedTextures.add(texture);
    const geometry = new THREE.PlaneGeometry(radius * 2, radius * 2);
    ownedGeometry.add(geometry);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
      transparent: true,
      opacity,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    ownedMaterials.set("contact-shadow", mat);
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.012;
    mesh.renderOrder = 1;
    mesh.name = label + ":contact-shadow";
    mesh.userData.decorative = true;
    group.add(mesh);
    return mesh;
  }
  return {
    group,
    phase,
    build,
    shadow,
    material,
    dispose() {
      if (disposed) return;
      disposed = true;
      group.removeFromParent();
      for (const geometry of ownedGeometry) geometry.dispose();
      for (const mat of ownedMaterials.values()) mat.dispose();
      for (const texture of ownedTextures) texture.dispose();
      group.clear();
      ownedGeometry.clear();
      ownedMaterials.clear();
      ownedTextures.clear();
    },
  };
}

function towerBase(rig, level) {
  rig.build(rig.group, (p) => {
    p.cylinder("cream", [0, 0.065, 0], 0.61, 0.13, [0, 0, 0], 0.57, 16);
    p.ring("secondary", [0, 0.115, 0], 0.5, 0.047, [Math.PI / 2, 0, 0]);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      p.ball(
        "cream",
        [Math.sin(a) * 0.51, 0.115, Math.cos(a) * 0.51],
        [0.095, 0.05, 0.095],
        [0, 0, 0],
        8,
      );
    }
    if (level >= 2)
      for (const x of [-0.22, 0, 0.22])
        p.ball(
          "secondary",
          [x, 0.105, 0.552],
          [0.043, 0.04, 0.027],
          [0, 0, 0],
          8,
        );
  });
}
function branchOrnament(p, level, branch, top, width = 0.4) {
  if (level < 2) return;
  p.star("gold", [0, 0.22, 0.48], 0.086);
  if (level < 3) return;
  if (branch === "b") {
    for (const side of [-1, 1]) {
      p.leaf(
        "accent",
        [side * width, top - 0.15, 0],
        [0.085, 0.26, 0.06],
        [0, 0, -side * 0.65],
      );
      p.ball(
        "cream",
        [side * width * 1.18, top + 0.04, 0],
        [0.075, 0.075, 0.075],
        [0, 0, 0],
        8,
      );
    }
    p.ring("secondary", [0, top - 0.25, 0], width + 0.06, 0.025, [
      Math.PI / 2,
      0,
      0,
    ]);
  } else {
    p.star("gold", [0, top + 0.1, 0.025], 0.18);
    for (const side of [-1, 1])
      p.cone("gold", [side * width * 0.55, top - 0.01, -0.03], 0.075, 0.2);
  }
}
function carrotTower(p, level, branch) {
  p.ball("secondary", [0, 0.24, 0], [0.35, 0.25, 0.3]);
  p.ball("cream", [0, 0.68, -0.12], [0.25, 0.25, 0.22]);
  for (const side of [-1, 1]) {
    p.ball(
      "cream",
      [side * 0.13, 1.005, -0.15],
      [0.09, 0.26, 0.078],
      [0, 0, -side * 0.14],
    );
    p.ball(
      "pink",
      [side * 0.13, 1.025, -0.087],
      [0.046, 0.17, 0.017],
      [0, 0, -side * 0.14],
    );
    p.ball("cream", [side * 0.29, 0.32, 0.17], [0.115, 0.1, 0.14]);
  }
  p.face(0.71, 0.091, 0.084, 0.86);
  const barrels = level >= 3 && branch === "b" ? [-0.17, 0.17] : [0];
  for (const x of barrels) {
    p.cone(
      "primary",
      [x, 0.35, 0.4],
      barrels.length > 1 ? 0.14 : 0.19,
      0.75,
      [Math.PI / 2, 0, 0],
      12,
    );
    for (let j = 0; j < 3; j++)
      p.leaf(
        "accent",
        [x + (j - 1) * 0.075, 0.41 + j * 0.025, -0.03],
        [0.04, 0.16, 0.047],
        [0.45, 0, (j - 1) * -0.55],
      );
  }
  p.ring("secondary", [0, 0.26, 0.34], 0.37, 0.035, [0, 0, 0], Math.PI);
  p.stick("cream", [-0.36, 0.26, 0.34], [0.36, 0.26, 0.34], 0.014);
  if (level >= 2)
    for (const side of [-1, 1]) {
      p.cone("primary", [side * 0.35, 0.45, -0.17], 0.065, 0.27, [
        0.3,
        0,
        -side * 0.3,
      ]);
      p.leaf(
        "accent",
        [side * 0.37, 0.64, -0.18],
        [0.05, 0.1, 0.025],
        [0, 0, -side * 0.4],
      );
    }
  branchOrnament(p, level, branch, 1.24, 0.4);
}
function berryTower(p, level, branch) {
  p.ball("primary", [0, 0.49, 0], [0.45, 0.5, 0.4]);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * TAU;
    p.leaf(
      "accent",
      [Math.sin(angle) * 0.13, 0.91, Math.cos(angle) * 0.13],
      [0.105, 0.23, 0.046],
      [0.58, angle, 0],
    );
  }
  p.cylinder("cream", [0, 0.3, 0.47], 0.18, 0.35, [Math.PI / 2, 0, 0]);
  p.cylinder("dark", [0, 0.3, 0.652], 0.117, 0.018, [Math.PI / 2, 0, 0]);
  p.ring("secondary", [0, 0.3, 0.644], 0.17, 0.029);
  p.face(0.66, 0.366, 0.13, 1);
  for (const [x, y, z] of [
    [-0.28, 0.4, 0.27],
    [0.28, 0.4, 0.27],
    [-0.19, 0.18, 0.29],
    [0.19, 0.18, 0.29],
    [-0.33, 0.62, 0.24],
    [0.33, 0.62, 0.24],
  ])
    p.ball("cream", [x, y, z], [0.025, 0.044, 0.016], [0, 0, -x * 0.8], 8);
  if (level >= 2)
    for (const side of [-1, 1]) {
      p.ball("secondary", [side * 0.4, 0.23, -0.08], [0.16, 0.16, 0.16]);
      p.star("cream", [side * 0.4, 0.24, 0.067], 0.063);
      if (level >= 3 && branch === "b") {
        p.ball("primary", [side * 0.48, 0.55, 0.04], [0.14, 0.15, 0.14]);
        p.leaf(
          "accent",
          [side * 0.48, 0.73, 0.03],
          [0.09, 0.08, 0.035],
          [0, 0, side * 0.5],
        );
      }
    }
  branchOrnament(p, level, branch, 1.15, 0.4);
}
function frostTower(p, level, branch) {
  p.cylinder("accent", [0, 0.4, 0], 0.065, 0.72);
  for (const side of [-1, 1])
    p.leaf(
      "accent",
      [side * 0.17, 0.36, 0],
      [0.105, 0.28, 0.057],
      [0.18, 0, -side * 0.8],
    );
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * TAU;
    p.ball(
      "primary",
      [Math.sin(angle) * 0.29, 0.87 + Math.cos(angle) * 0.29, 0],
      [0.19, 0.26, 0.12],
      [0, 0, -angle],
    );
  }
  p.ball("cream", [0, 0.87, 0.105], [0.24, 0.24, 0.15]);
  p.face(0.9, 0.249, 0.084, 0.8);
  p.ball("secondary", [0, 0.55, 0.06], [0.11, 0.075, 0.1]);
  if (level >= 2)
    for (const side of [-1, 1]) {
      p.cone(
        "secondary",
        [side * 0.4, 0.36, 0.02],
        0.095,
        0.34,
        [0, 0, -side * 0.22],
        6,
      );
      p.ball(
        "primary",
        [side * 0.43, 0.65, 0.01],
        [0.065, 0.085, 0.065],
        [0, 0, 0],
        8,
      );
    }
  branchOrnament(p, level, branch, 1.32, 0.44);
}
function sparkTower(p, level, branch) {
  p.cylinder("secondary", [0, 0.41, 0], 0.15, 0.74, [0, 0, 0], 0.11);
  p.ball("primary", [0, 0.83, 0], [0.43, 0.42, 0.36]);
  for (const side of [-1, 1]) {
    p.ball("primary", [side * 0.3, 0.7, -0.035], [0.23, 0.25, 0.24]);
    p.leaf(
      "secondary",
      [side * 0.3, 0.97, -0.04],
      [0.07, 0.19, 0.04],
      [0, 0, -side * 0.55],
    );
    p.stick("secondary", [side * 0.1, 0.45, 0], [side * 0.38, 0.67, 0], 0.047);
  }
  p.face(0.85, 0.349, 0.127, 1);
  p.ball("gold", [0, 1.29, 0], [0.16, 0.19, 0.16]);
  p.ring("cream", [0, 1.31, 0], 0.2, 0.023);
  p.leaf("accent", [0.08, 1.51, -0.01], [0.07, 0.115, 0.04], [0, 0, -0.55]);
  if (level >= 2)
    for (const side of [-1, 1]) {
      p.ball("gold", [side * 0.36, 0.48, 0.16], [0.085, 0.11, 0.085]);
      p.leaf(
        "cream",
        [side * 0.46, 0.52, 0.15],
        [0.115, 0.056, 0.025],
        [0, 0, side * 0.25],
      );
      p.stick(
        "secondary",
        [side * 0.28, 0.73, 0.02],
        [side * 0.36, 0.54, 0.16],
        0.018,
      );
    }
  branchOrnament(p, level, branch, 1.56, 0.41);
}
function bee(p, at, scale = 1) {
  const [x, y, z] = at;
  p.ball("gold", [x, y, z], [0.11 * scale, 0.075 * scale, 0.08 * scale]);
  p.ring("dark", [x, y, z], 0.067 * scale, 0.014 * scale, [0, Math.PI / 2, 0]);
  for (const side of [-1, 1])
    p.ball(
      "cream",
      [x + side * 0.05 * scale, y + 0.09 * scale, z - 0.025 * scale],
      [0.045 * scale, 0.09 * scale, 0.018 * scale],
      [0, 0, -side * 0.4],
    );
  p.ball(
    "dark",
    [x + 0.07 * scale, y + 0.012 * scale, z + 0.054 * scale],
    [0.011 * scale, 0.014 * scale, 0.01 * scale],
    [0, 0, 0],
    8,
  );
}
function honeyTower(p, level, branch) {
  p.ball("primary", [0, 0.45, 0], [0.43, 0.43, 0.41]);
  p.cylinder("cream", [0, 0.83, 0], 0.38, 0.1, [0, 0, 0], 0.36, 16);
  p.ring("secondary", [0, 0.79, 0], 0.36, 0.043, [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    p.ball(
      "gold",
      [Math.sin(a) * 0.345, 0.72, Math.cos(a) * 0.345],
      [0.066, 0.12 + (i % 2) * 0.035, 0.066],
    );
  }
  p.face(0.46, 0.399, 0.126, 1);
  p.ball("cream", [0, 0.9, 0], [0.13, 0.045, 0.13]);
  bee(p, [0.02, 1.05, 0.03], 1.15);
  if (level >= 2)
    for (const side of [-1, 1]) {
      bee(p, [side * 0.38, 0.83, 0.06], 0.8);
      p.leaf(
        "accent",
        [side * 0.37, 0.23, -0.03],
        [0.075, 0.19, 0.045],
        [0, 0, -side * 0.65],
      );
    }
  if (level >= 3 && branch === "b")
    for (const side of [-1, 1]) {
      p.ball("pink", [side * 0.49, 0.43, 0.06], [0.13, 0.13, 0.06]);
      p.ball("gold", [side * 0.49, 0.43, 0.112], [0.055, 0.055, 0.03]);
    }
  branchOrnament(p, level, branch, 1.27, 0.42);
}
function bloomTower(p, level, branch) {
  p.cylinder("cream", [0, 0.43, 0], 0.38, 0.71, [0, 0, 0], 0.36, 16);
  p.ball("primary", [0, 0.94, 0], [0.55, 0.32, 0.5]);
  p.ring("secondary", [0, 0.83, 0], 0.43, 0.065, [Math.PI / 2, 0, 0]);
  p.ball("secondary", [0, 0.22, 0.364], [0.13, 0.18, 0.037]);
  p.ball("gold", [0.055, 0.21, 0.402], [0.025, 0.025, 0.025], [0, 0, 0], 8);
  p.face(0.61, 0.369, 0.11, 0.95);
  for (const side of [-1, 1]) {
    p.ball(
      "cream",
      [side * 0.25, 1.04, 0.276],
      [0.065, 0.044, 0.025],
      [0.12, -side * 0.3, 0],
      8,
    );
    p.leaf(
      "accent",
      [side * 0.3, 0.23, 0.24],
      [0.07, 0.17, 0.04],
      [0, 0, -side * 0.75],
    );
  }
  p.star("gold", [0, 1.33, 0], 0.13);
  if (level >= 2)
    for (const side of [-1, 1]) {
      p.cylinder("cream", [side * 0.41, 0.28, -0.065], 0.17, 0.35);
      p.ball("secondary", [side * 0.41, 0.51, -0.065], [0.24, 0.15, 0.21]);
      p.ball("gold", [side * 0.42, 0.28, 0.1], [0.053, 0.078, 0.024]);
    }
  branchOrnament(p, level, branch, 1.44, 0.47);
}
const TOWER_BUILDERS = {
  carrot: carrotTower,
  berry: berryTower,
  frost: frostTower,
  spark: sparkTower,
  honey: honeyTower,
  bloom: bloomTower,
};
export function createTower(type, level = 1, branch = null) {
  const towerType = Object.hasOwn(TOWER_BUILDERS, type) ? type : "carrot";
  const tier = clamp(Math.round(finite(level, 1)), 1, 3);
  const choice = branch === "b" ? "b" : branch === "a" ? "a" : null;
  const rig = makeActor(TOWER_COLORS[towerType], "tower-" + towerType);
  towerBase(rig, tier);
  const head = new THREE.Group();
  head.name = "rotating-tower-head";
  head.position.y = 0.16;
  rig.group.add(head);
  rig.build(head, (p) => TOWER_BUILDERS[towerType](p, tier, choice));
  rig.shadow(0.83);
  rig.group.userData.actor = {
    kind: "tower",
    type: towerType,
    level: tier,
    branch: choice,
  };
  let initialized = false,
    yaw = 0;
  const gold = rig.material("gold");
  return {
    group: rig.group,
    update(data = {}, dt = 0, time = 0) {
      rig.group.position.set(finite(data.x), 0.3, finite(data.z));
      const targetYaw = finite(data.angle, yaw);
      if (!initialized) {
        yaw = targetYaw;
        initialized = true;
      } else
        yaw +=
          angleDifference(targetYaw, yaw) *
          (1 - Math.exp(-Math.max(0, dt) * 14));
      head.rotation.y = yaw;
      const flash = clamp(finite(data.flash), 0, 1),
        pulse = Math.sin(finite(time) * 2.2 + rig.phase);
      head.position.y = 0.16 + pulse * 0.012 - flash * 0.045;
      head.scale.set(1 + flash * 0.035, 1 - flash * 0.055, 1 + flash * 0.035);
      gold.emissiveIntensity = 0.13 + Math.max(0, pulse) * 0.12 + flash * 0.65;
    },
    dispose: rig.dispose,
  };
}

function puffEnemy(p) {
  p.ball("primary", [0, 0.39, 0], [0.35, 0.32, 0.32]);
  for (const side of [-1, 1]) {
    p.ball("primary", [side * 0.26, 0.38, -0.025], [0.17, 0.2, 0.2]);
    p.ball("secondary", [side * 0.16, 0.09, 0.09], [0.13, 0.09, 0.18]);
    p.ball("primary", [side * 0.13, 0.67, -0.045], [0.13, 0.14, 0.12]);
  }
  p.ring("cream", [0, 0.72, 0.05], 0.079, 0.025, [0, 0, -0.4], Math.PI * 1.6);
  p.face(0.46, 0.298, 0.103, 0.95);
}
function hopperEnemy(p) {
  p.ball("primary", [0, 0.38, 0], [0.3, 0.3, 0.27]);
  p.ball("cream", [0, 0.25, 0.239], [0.16, 0.125, 0.033]);
  for (const side of [-1, 1]) {
    p.ball(
      "primary",
      [side * 0.13, 0.83, -0.025],
      [0.1, 0.3, 0.078],
      [0, 0, -side * 0.15],
    );
    p.ball(
      "pink",
      [side * 0.13, 0.85, 0.041],
      [0.046, 0.21, 0.018],
      [0, 0, -side * 0.15],
    );
    p.ball("secondary", [side * 0.18, 0.09, 0.13], [0.14, 0.085, 0.2]);
  }
  p.ball("cream", [0.23, 0.23, -0.18], [0.14, 0.14, 0.14]);
  p.face(0.46, 0.25, 0.095, 0.9);
  p.star("cream", [-0.2, 0.67, 0.049], 0.065, [0, 0, 0.25]);
}
function shellEnemy(p) {
  p.ball("primary", [0, 0.35, -0.04], [0.43, 0.3, 0.39]);
  p.ring("secondary", [0, 0.23, -0.04], 0.36, 0.055, [Math.PI / 2, 0, 0]);
  for (const x of [-1, 1])
    for (const z of [-1, 1])
      p.ball("accent", [x * 0.28, 0.12, z * 0.24], [0.14, 0.105, 0.16]);
  p.ball("cream", [0, 0.3, 0.34], [0.23, 0.22, 0.22]);
  p.face(0.34, 0.549, 0.084, 0.82);
  p.ball("secondary", [0, 0.6, -0.05], [0.17, 0.055, 0.19]);
  for (const side of [-1, 1])
    p.ball(
      "secondary",
      [side * 0.25, 0.49, -0.085],
      [0.105, 0.066, 0.19],
      [0, 0, -side * 0.53],
    );
  p.leaf("accent", [0.13, 0.7, -0.065], [0.07, 0.15, 0.035], [0, 0, -0.7]);
  p.ball("pink", [0, 0.698, -0.04], [0.075, 0.065, 0.075]);
}
function mothEnemy(p) {
  p.ball("cream", [0, 0.36, 0], [0.15, 0.28, 0.13]);
  p.ball("primary", [0, 0.65, 0.02], [0.2, 0.19, 0.18]);
  p.face(0.68, 0.183, 0.07, 0.74);
  for (const side of [-1, 1]) {
    p.stick(
      "secondary",
      [side * 0.07, 0.81, 0],
      [side * 0.15, 0.99, 0.015],
      0.016,
    );
    p.ball(
      "gold",
      [side * 0.15, 0.99, 0.015],
      [0.04, 0.043, 0.04],
      [0, 0, 0],
      8,
    );
  }
  p.ball("gold", [0, 0.21, 0.07], [0.078, 0.09, 0.078]);
}
function shamanEnemy(p) {
  p.ball("cream", [0, 0.31, 0], [0.235, 0.29, 0.21]);
  p.ball("primary", [0, 0.66, -0.015], [0.44, 0.24, 0.39]);
  p.ring("secondary", [0, 0.56, -0.015], 0.32, 0.052, [Math.PI / 2, 0, 0]);
  p.face(0.36, 0.201, 0.085, 0.87);
  for (const [x, y, z] of [
    [-0.2, 0.77, 0.13],
    [0.14, 0.84, 0.02],
    [0.28, 0.7, 0.17],
    [-0.09, 0.72, 0.315],
  ])
    p.ball("cream", [x, y, z], [0.068, 0.03, 0.059]);
  p.stick("accent", [0.31, 0.05, 0.04], [0.36, 0.83, 0.03], 0.028);
  p.leaf("accent", [0.4, 0.79, 0.026], [0.055, 0.13, 0.03], [0, 0, -0.7]);
  p.ball("secondary", [0.35, 0.89, 0.03], [0.084, 0.094, 0.077]);
  p.ball("cream", [0.26, 0.37, 0.051], [0.09, 0.07, 0.09]);
  for (const side of [-1, 1])
    p.ball("secondary", [side * 0.13, 0.065, 0.055], [0.1, 0.065, 0.13]);
}
function splitterEnemy(p) {
  p.ball("primary", [0, 0.4, 0], [0.36, 0.36, 0.33], [0, 0, 0], 16);
  p.face(0.44, 0.322, 0.103, 0.94);
  p.ball("cream", [-0.15, 0.61, 0.233], [0.065, 0.087, 0.014], [0, 0.15, -0.4]);
  p.ball("cream", [-0.05, 0.69, 0.175], [0.028, 0.04, 0.013], [0, 0, -0.3], 8);
  for (const side of [-1, 1]) {
    p.ball("secondary", [side * 0.17, 0.076, 0.08], [0.13, 0.076, 0.14]);
    p.ball("primary", [side * 0.32, 0.6, -0.08], [0.15, 0.15, 0.15]);
  }
  p.ball("primary", [0.15, 0.78, -0.05], [0.105, 0.105, 0.105]);
}
function bossEnemy(p) {
  p.ball("primary", [0, 0.72, 0], [0.65, 0.57, 0.56]);
  for (const side of [-1, 1]) {
    p.ball("primary", [side * 0.49, 0.69, -0.025], [0.28, 0.36, 0.31]);
    p.ball("primary", [side * 0.43, 1.1, -0.055], [0.22, 0.24, 0.22]);
    p.ball("secondary", [side * 0.31, 0.16, 0.11], [0.23, 0.15, 0.29]);
    p.ball(
      "cream",
      [side * 0.23, 0.98, 0.468],
      [0.075, 0.027, 0.024],
      [0, 0, side * 0.16],
    );
  }
  p.face(0.84, 0.53, 0.185, 1.5);
  p.ball("pink", [0, 0.32, 0.37], [0.46, 0.12, 0.2]);
  p.star("gold", [0, 0.32, 0.566], 0.12);
  p.cylinder("gold", [0, 1.28, 0], 0.3, 0.12, [0, 0, 0], 0.34);
  for (const x of [-0.25, 0, 0.25]) {
    p.cone(
      "gold",
      [x, 1.48 + (x === 0 ? 0.035 : 0), 0],
      0.105,
      x === 0 ? 0.38 : 0.3,
      [0, 0, -x * 0.35],
    );
    p.ball(
      "pink",
      [x * 1.1, 1.65 + (x === 0 ? 0.035 : -0.025), 0],
      [0.045, 0.045, 0.045],
      [0, 0, 0],
      8,
    );
  }
  p.ball("cream", [-0.3, 1.2, 0.275], [0.14, 0.14, 0.1]);
}
const ENEMY_BUILDERS = {
  puff: puffEnemy,
  hopper: hopperEnemy,
  shell: shellEnemy,
  moth: mothEnemy,
  shaman: shamanEnemy,
  splitter: splitterEnemy,
  boss: bossEnemy,
};
export function createEnemy(type) {
  const enemyType = Object.hasOwn(ENEMY_BUILDERS, type) ? type : "puff";
  const rig = makeActor(ENEMY_COLORS[enemyType], "enemy-" + enemyType, {
    transparentPrimary: enemyType === "splitter",
  });
  const body = new THREE.Group();
  body.name = "animated-enemy";
  rig.group.add(body);
  rig.build(body, ENEMY_BUILDERS[enemyType]);
  const wings = [];
  if (enemyType === "moth")
    for (const side of [-1, 1]) {
      const wing = new THREE.Group();
      wing.position.set(side * 0.1, 0.46, -0.035);
      rig.build(wing, (p) => {
        p.ball(
          "secondary",
          [side * 0.23, 0.12, 0],
          [0.27, 0.3, 0.048],
          [0, 0, -side * 0.35],
        );
        p.ball(
          "primary",
          [side * 0.18, -0.16, 0.008],
          [0.21, 0.18, 0.045],
          [0, 0, side * 0.35],
        );
        p.ball("secondary", [side * 0.19, -0.16, 0.049], [0.07, 0.075, 0.012]);
      });
      body.add(wing);
      wings.push({ group: wing, side });
    }
  if (enemyType === "splitter") {
    const bubble = rig.material("primary");
    bubble.transparent = true;
    bubble.opacity = 0.86;
    bubble.depthWrite = false;
    bubble.roughness = 0.2;
    bubble.metalness = 0.06;
  }
  const isBoss = enemyType === "boss";
  const groundShadow = rig.shadow(
    isBoss ? 1.02 : enemyType === "moth" ? 0.59 : 0.61,
    enemyType === "moth" ? 0.1 : 0.17,
  );
  rig.group.userData.actor = { kind: "enemy", type: enemyType };
  let lastX = null,
    lastZ = null,
    stride = rig.phase,
    yaw = 0;
  const primary = rig.material("primary");
  return {
    group: rig.group,
    update(data = {}, dt = 0, time = 0) {
      const x = finite(data.x),
        z = finite(data.z),
        delta = clamp(finite(dt), 0, 0.2);
      const distance = lastX === null ? 0 : Math.hypot(x - lastX, z - lastZ);
      const speed = delta > 0 ? Math.min(5, distance / delta) : 0,
        moving = Math.min(1, speed * 2);
      lastX = x;
      lastZ = z;
      stride += delta * (3 + Math.min(speed, 3) * 6);
      const flying = enemyType === "moth" || data.flying === true;
      const hover = flying
        ? 0.9 + Math.sin(finite(time) * 3 + rig.phase) * 0.09
        : 0;
      rig.group.position.set(x, 0.3 + hover, z);
      yaw = finite(data.heading, finite(data.angle, yaw));
      rig.group.rotation.y = yaw;
      const hop = enemyType === "hopper" ? 0.105 : isBoss ? 0.025 : 0.046;
      body.position.y = flying
        ? 0
        : Math.abs(Math.sin(stride)) * hop * moving +
          Math.sin(finite(time) * 2.1 + rig.phase) * 0.008;
      body.rotation.z = flying
        ? Math.sin(finite(time) * 2.5 + rig.phase) * 0.07
        : Math.sin(stride) * 0.055 * moving;
      body.rotation.x = flying ? 0.12 : Math.cos(stride * 2) * 0.024 * moving;
      const squash = Math.sin(stride * 2) * 0.025 * moving;
      body.scale.set(1 - squash * 0.5, 1 + squash, 1 - squash * 0.5);
      groundShadow.position.y = 0.012 - hover;
      for (const wing of wings)
        wing.group.rotation.y =
          wing.side * (0.16 + Math.sin(finite(time) * 15 + rig.phase) * 0.65);
      const chilled =
        Number.isFinite(data.slow) && data.slow >= 0 && data.slow < 1;
      primary.emissive.setHex(chilled ? 0x84c9dc : 0x000000);
      primary.emissiveIntensity = chilled ? 0.2 : 0;
    },
    dispose: rig.dispose,
  };
}

function heroFeet(p, color) {
  for (const side of [-1, 1]) {
    p.ball(color, [side * 0.14, 0.075, 0.07], [0.12, 0.075, 0.155]);
    p.ball(
      color,
      [side * 0.24, 0.37, 0.01],
      [0.09, 0.155, 0.095],
      [0, 0, side * 0.25],
    );
  }
}
function momoHero(p) {
  p.ball("primary", [0, 0.33, -0.01], [0.245, 0.27, 0.205]);
  p.ball("cream", [0, 0.65, 0], [0.27, 0.26, 0.245]);
  heroFeet(p, "cream");
  for (const side of [-1, 1]) {
    p.ball(
      "cream",
      [side * 0.125, 0.985, -0.025],
      [0.095, 0.25, 0.076],
      [0, 0, -side * 0.12],
    );
    p.ball(
      "pink",
      [side * 0.125, 1.002, 0.04],
      [0.045, 0.175, 0.017],
      [0, 0, -side * 0.12],
    );
  }
  p.face(0.68, 0.23, 0.09, 0.93);
  p.ball("cream", [0, 0.3, 0.187], [0.14, 0.14, 0.025]);
  p.ball("cream", [0.14, 0.26, -0.2], [0.105, 0.105, 0.105]);
  p.ball("secondary", [-0.14, 1.13, 0.063], [0.11, 0.053, 0.04], [0, 0, 0.45]);
  p.ball(
    "secondary",
    [-0.24, 1.12, 0.063],
    [0.095, 0.053, 0.04],
    [0, 0, -0.45],
  );
  p.ball("gold", [-0.19, 1.115, 0.094], [0.036, 0.036, 0.028], [0, 0, 0], 8);
  p.star("gold", [0, 0.44, 0.21], 0.062);
}
function pipHero(p) {
  p.ball("primary", [0, 0.34, -0.01], [0.235, 0.28, 0.205]);
  p.ball("primary", [0, 0.69, 0], [0.285, 0.255, 0.24]);
  heroFeet(p, "secondary");
  p.ball("cream", [0, 0.31, 0.18], [0.13, 0.16, 0.037]);
  for (const side of [-1, 1]) {
    p.cone(
      "primary",
      [side * 0.19, 0.96, -0.045],
      0.13,
      0.34,
      [0, 0, -side * 0.21],
      10,
    );
    p.cone(
      "cream",
      [side * 0.19, 0.98, 0.022],
      0.066,
      0.22,
      [0, 0, -side * 0.21],
      8,
    );
    p.ball(
      "cream",
      [side * 0.12, 0.61, 0.19],
      [0.15, 0.105, 0.085],
      [0, 0, -side * 0.22],
    );
  }
  p.face(0.72, 0.224, 0.1, 0.9);
  p.ball("dark", [0, 0.606, 0.285], [0.043, 0.025, 0.035], [0, 0, 0], 8);
  p.ball("primary", [-0.3, 0.32, -0.18], [0.16, 0.32, 0.18], [0.2, 0, -0.7]);
  p.ball("cream", [-0.455, 0.515, -0.15], [0.135, 0.13, 0.145], [0, 0, -0.4]);
  p.ring("accent", [0, 0.48, 0], 0.18, 0.048, [Math.PI / 2, 0, 0]);
  p.leaf("accent", [0.18, 0.34, -0.125], [0.078, 0.18, 0.029], [0.2, 0, -0.45]);
  p.star("gold", [0.15, 0.45, 0.176], 0.055);
}
function baoHero(p) {
  p.ball("primary", [0, 0.34, -0.015], [0.26, 0.28, 0.22]);
  p.ball("cream", [0, 0.68, 0], [0.29, 0.27, 0.26]);
  heroFeet(p, "dark");
  for (const side of [-1, 1]) {
    p.ball("dark", [side * 0.22, 0.88, -0.03], [0.105, 0.11, 0.088]);
    p.ball(
      "dark",
      [side * 0.11, 0.699, 0.238],
      [0.08, 0.103, 0.028],
      [0, 0, -side * 0.2],
    );
    p.ball(
      "cream",
      [side * 0.11 - 0.012, 0.728, 0.266],
      [0.017, 0.022, 0.011],
      [0, 0, 0],
      8,
    );
    p.ball("pink", [side * 0.2, 0.605, 0.208], [0.049, 0.025, 0.018]);
  }
  p.ball("dark", [0, 0.619, 0.269], [0.035, 0.024, 0.026], [0, 0, 0], 8);
  p.ball("dark", [0, 0.567, 0.239], [0.024, 0.012, 0.014], [0, 0, 0], 8);
  p.ball("cream", [0, 0.3, 0.195], [0.145, 0.145, 0.04]);
  p.ring("secondary", [0, 0.46, -0.008], 0.22, 0.038, [Math.PI / 2, 0, 0]);
  p.star("gold", [0, 0.41, 0.224], 0.062);
}
function heroWeapon(rig, parent, type) {
  const weapon = new THREE.Group();
  weapon.name = "hero-tool";
  weapon.position.set(0.29, 0.38, 0.045);
  parent.add(weapon);
  rig.build(weapon, (p) => {
    if (type === "momo") {
      p.stick("accent", [0, -0.24, 0], [0, 0.45, 0], 0.024);
      p.star("gold", [0, 0.52, 0], 0.12);
      p.leaf("accent", [0.075, 0.26, 0], [0.04, 0.13, 0.025], [0, 0, -0.65]);
    } else if (type === "pip") {
      p.stick("gold", [0, -0.19, 0], [0, 0.19, 0], 0.029);
      p.ring("gold", [0, 0.25, 0], 0.115, 0.026, [0, 0, 0], Math.PI);
      p.stick("accent", [-0.115, 0.25, 0], [0.115, 0.25, 0], 0.013);
      p.ball("accent", [0, 0.245, 0.024], [0.04, 0.033, 0.024], [0, 0, 0], 8);
    } else {
      p.stick("accent", [0, -0.3, 0], [0, 0.62, 0], 0.035);
      for (const y of [-0.15, 0.08, 0.31])
        p.cylinder("gold", [0, y, 0], 0.041, 0.025);
      p.leaf("accent", [0.065, 0.5, 0], [0.044, 0.15, 0.025], [0, 0, -0.7]);
      p.leaf("accent", [-0.06, 0.37, 0], [0.04, 0.13, 0.025], [0, 0, 0.8]);
      p.ball("gold", [0, 0.67, 0], [0.065, 0.075, 0.065], [0, 0, 0], 8);
    }
  });
  return weapon;
}
const HERO_BUILDERS = { momo: momoHero, pip: pipHero, bao: baoHero };
export function createHero(type) {
  const heroType = Object.hasOwn(HERO_BUILDERS, type) ? type : "momo";
  const rig = makeActor(HERO_COLORS[heroType], "hero-" + heroType);
  const body = new THREE.Group();
  body.name = "animated-hero";
  rig.group.add(body);
  rig.build(body, HERO_BUILDERS[heroType]);
  const tool = heroWeapon(rig, body, heroType);
  const badge = new THREE.Group();
  badge.name = "hero-level-stars";
  rig.build(badge, (p) => {
    p.star("gold", [-0.16, 0, 0], 0.065, [0, 0, 0.15]);
    p.star("gold", [0, 0.08, 0], 0.09);
    p.star("gold", [0.16, 0, 0], 0.065, [0, 0, -0.15]);
  });
  badge.position.set(0, 1.34, 0);
  badge.visible = false;
  rig.group.add(badge);
  rig.shadow(0.57);
  rig.group.userData.actor = { kind: "hero", type: heroType };
  let lastX = null,
    lastZ = null,
    yaw = 0,
    stride = rig.phase;
  const gold = rig.material("gold");
  return {
    group: rig.group,
    update(data = {}, dt = 0, time = 0) {
      const x = finite(data.x),
        z = finite(data.z),
        delta = clamp(finite(dt), 0, 0.2);
      const distance = lastX === null ? 0 : Math.hypot(x - lastX, z - lastZ);
      const speed = delta > 0 ? Math.min(6, distance / delta) : 0,
        moving = Math.min(1, speed * 1.8);
      const first = lastX === null;
      const travelYaw =
        distance > 0.0001 && !first ? Math.atan2(x - lastX, z - lastZ) : yaw;
      lastX = x;
      lastZ = z;
      let targetYaw = finite(data.angle, travelYaw);
      if (
        !Number.isFinite(data.angle) &&
        Number.isFinite(data.targetX) &&
        Number.isFinite(data.targetZ)
      ) {
        const dx = data.targetX - x,
          dz = data.targetZ - z;
        if (Math.hypot(dx, dz) > 0.05) targetYaw = Math.atan2(dx, dz);
      }
      yaw = first
        ? targetYaw
        : yaw + angleDifference(targetYaw, yaw) * (1 - Math.exp(-delta * 13));
      rig.group.position.set(x, 0.3, z);
      rig.group.rotation.y = yaw;
      stride += delta * (3 + Math.min(speed, 4) * 5);
      const flash = clamp(finite(data.flash), 0, 1);
      body.position.y =
        Math.abs(Math.sin(stride)) * 0.055 * moving +
        Math.sin(finite(time) * 2.3 + rig.phase) * 0.008;
      body.rotation.z = Math.sin(stride) * 0.07 * moving;
      body.rotation.x = -flash * 0.11;
      tool.rotation.x = -flash * 0.95 + Math.sin(stride) * 0.16 * moving;
      tool.rotation.z = -0.11 + Math.sin(finite(time) * 2 + rig.phase) * 0.035;
      const tier = Math.max(1, finite(data.level, 1));
      badge.visible = tier >= 2;
      badge.position.y =
        1.33 + Math.sin(finite(time) * 2.1 + rig.phase) * 0.035;
      badge.scale.setScalar(tier >= 3 ? 1 : 0.72);
      badge.rotation.y = Math.sin(finite(time) * 1.5 + rig.phase) * 0.18;
      gold.emissiveIntensity = 0.16 + flash * 0.65;
    },
    dispose: rig.dispose,
  };
}
