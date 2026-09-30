import * as THREE from "three";
import {
  TRACK_LENGTH,
  ROAD_WIDTH,
  ROAD_HEIGHT,
  getTrackFrame,
} from "./track.js";

const UP = new THREE.Vector3(0, 1, 0);
const FORWARD = new THREE.Vector3(0, 0, 1);
const palette = {
  sand: "#f3dfad",
  sandSide: "#d9c594",
  grass: "#94c779",
  road: "#445c66",
  cream: "#fff4da",
  teal: "#268b92",
  coral: "#e97459",
  gold: "#ffd458",
};

function standard(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...options });
}

// Every small decorative assembly is one geometry, keeping the island inexpensive to draw.
function bake(parts) {
  const positions = [],
    normals = [],
    colors = [];
  for (const {
    geometry,
    color,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
  } of parts) {
    const g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3(...position),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
      new THREE.Vector3(...scale),
    );
    g.applyMatrix4(matrix);
    if (!g.attributes.normal) g.computeVertexNormals();
    const c = new THREE.Color(color);
    positions.push(...g.attributes.position.array);
    normals.push(...g.attributes.normal.array);
    for (let i = 0; i < g.attributes.position.count; i++)
      colors.push(c.r, c.g, c.b);
    g.dispose();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function piece(geometry, color, position, scale, rotation) {
  return { geometry, color, position, scale, rotation };
}

function seededRandom(seed = 719) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function roadRibbon(offset, width, y, material, segments = 420) {
  const vertices = [],
    indices = [];
  for (let i = 0; i <= segments; i++) {
    const distance = (i / segments) * TRACK_LENGTH;
    for (const side of [-1, 1]) {
      const p = getTrackFrame(distance, offset + (side * width) / 2).position;
      vertices.push(p.x, y, p.z);
    }
    if (i < segments) {
      const k = i * 2;
      indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

function coastalRing(scale, width, y, material, phase = 0) {
  const vertices = [],
    indices = [];
  const n = 240;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const p = getTrackFrame((i / n) * TRACK_LENGTH).position;
    const radial = new THREE.Vector3(p.x, 0, p.z).normalize();
    const variation = Math.sin(a * 13 + phase) * 0.42 + Math.sin(a * 21) * 0.2;
    for (const side of [-1, 1]) {
      const offset = variation + (side * width) / 2;
      vertices.push(
        p.x * scale + radial.x * offset,
        y,
        p.z * scale + radial.z * offset,
      );
    }
    if (i < n) {
      const k = i * 2;
      indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

function islandSurface(scale, y, color, roughEdge = 0) {
  const shape = new THREE.Shape();
  const count = 240;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const p = getTrackFrame((i / count) * TRACK_LENGTH).position;
    const s = scale + roughEdge * (Math.sin(7 * a) + 0.35 * Math.sin(19 * a));
    if (i === 0) shape.moveTo(p.x * s, -p.z * s);
    else shape.lineTo(p.x * s, -p.z * s);
  }
  shape.closePath();
  const geometry = new THREE.ShapeGeometry(shape, 1);
  geometry.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(
    geometry,
    standard(color, { side: THREE.DoubleSide }),
  );
  mesh.position.y = y;
  mesh.receiveShadow = true;
  return mesh;
}

function fishGeometry() {
  const sphere = new THREE.SphereGeometry(1, 10, 7);
  const parts = [
    piece(sphere, "#ffcc42", [0, 0, 0], [0.45, 0.56, 0.82]),
    piece(
      new THREE.ConeGeometry(0.57, 0.72, 3),
      "#efa839",
      [0, 0, -0.91],
      [0.82, 1, 1],
      [Math.PI / 2, 0, Math.PI / 2],
    ),
    piece(
      new THREE.ConeGeometry(0.3, 0.5, 3),
      "#efaa36",
      [0, 0.5, -0.1],
      [0.28, 1, 1],
      [0.05, 0, -0.15],
    ),
  ];
  for (const side of [-1, 1]) {
    parts.push(
      piece(sphere, "#fff9e8", [side * 0.365, 0.15, 0.37], [0.13, 0.15, 0.15]),
    );
    parts.push(
      piece(sphere, "#253d47", [side * 0.47, 0.16, 0.39], [0.05, 0.075, 0.078]),
    );
  }
  return bake(parts);
}

function coneGeometry() {
  return bake([
    piece(new THREE.BoxGeometry(1.5, 0.17, 1.5), "#344952", [0, 0.085, 0]),
    piece(
      new THREE.CylinderGeometry(0.15, 0.57, 1.45, 8),
      "#f18443",
      [0, 0.88, 0],
    ),
    piece(
      new THREE.CylinderGeometry(0.3, 0.39, 0.3, 8),
      "#fff1cf",
      [0, 0.97, 0],
    ),
  ]);
}

function crateGeometry() {
  const parts = [
    piece(new THREE.BoxGeometry(1.8, 1.8, 1.8), "#c2915f", [0, 0.9, 0]),
  ];
  for (const sign of [-1, 1]) {
    for (const y of [0.18, 1.61]) {
      parts.push(
        piece(new THREE.BoxGeometry(1.98, 0.2, 0.13), "#e5bb7b", [
          0,
          y,
          sign * 0.94,
        ]),
      );
      parts.push(
        piece(new THREE.BoxGeometry(0.13, 0.2, 1.98), "#e5bb7b", [
          sign * 0.94,
          y,
          0,
        ]),
      );
    }
    parts.push(
      piece(
        new THREE.BoxGeometry(0.19, 2.03, 0.14),
        "#f1c98d",
        [0, 0.9, sign * 0.96],
        [1, 1, 1],
        [0, 0, (sign * Math.PI) / 4],
      ),
    );
  }
  return bake(parts);
}

function rampGeometry(width, length, height) {
  const w = width / 2,
    l = length / 2;
  const vertices = [
    -w,
    0.04,
    -l,
    w,
    0.04,
    -l,
    -w,
    height,
    l,
    w,
    0.04,
    -l,
    w,
    height,
    l,
    -w,
    height,
    l,
    -w,
    0,
    -l,
    -w,
    height,
    l,
    -w,
    0,
    l,
    w,
    0,
    -l,
    w,
    0,
    l,
    w,
    height,
    l,
    -w,
    0,
    l,
    -w,
    height,
    l,
    w,
    height,
    l,
    -w,
    0,
    l,
    w,
    height,
    l,
    w,
    0,
    l,
  ];
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  g.computeVertexNormals();
  return g;
}

function houseGeometry(roofColor, variant = 0) {
  const parts = [];
  const box = new THREE.BoxGeometry(1, 1, 1);
  const height = variant ? 6.8 : 5.4;
  parts.push(
    piece(
      box,
      variant ? "#f8e5c8" : "#fff3dc",
      [0, height / 2, 0],
      [8, height, 7],
    ),
  );
  parts.push(piece(box, "#dec49d", [0, 0.18, 0], [8.5, 0.36, 7.5]));
  for (const side of [-1, 1]) {
    parts.push(
      piece(
        box,
        roofColor,
        [0, height + 0.8, side * 1.95],
        [9.3, 0.42, 4.5],
        [side * 0.42, 0, 0],
      ),
    );
    parts.push(
      piece(
        box,
        "#27818a",
        [side * 2.55, height * 0.57, 3.54],
        [1.55, 1.8, 0.1],
      ),
    );
    parts.push(
      piece(
        box,
        "#fff5df",
        [side * 2.55, height * 0.57, 3.62],
        [0.1, 1.84, 0.1],
      ),
    );
    parts.push(
      piece(
        box,
        "#fff5df",
        [side * 2.55, height * 0.57, 3.62],
        [1.6, 0.1, 0.1],
      ),
    );
    for (const shutter of [-1, 1]) {
      parts.push(
        piece(
          box,
          roofColor,
          [side * 2.55 + shutter * 1.01, height * 0.57, 3.62],
          [0.43, 1.9, 0.16],
        ),
      );
    }
    parts.push(
      piece(box, "#327e80", [side * 4.04, height * 0.57, 0], [0.1, 1.65, 1.7]),
    );
  }
  parts.push(piece(box, "#2c7f82", [0, 1.45, 3.56], [1.5, 2.9, 0.13]));
  parts.push(
    piece(new THREE.SphereGeometry(0.09, 6, 4), "#efc567", [0.47, 1.4, 3.67]),
  );
  parts.push(piece(box, "#e8d1a7", [0, 0.17, 4.1], [2.5, 0.34, 1.3]));
  // A little striped awning makes the houses read as a friendly seaside village.
  for (let i = 0; i < 6; i++) {
    parts.push(
      piece(
        box,
        i % 2 ? "#fff1d6" : roofColor,
        [-1.25 + i * 0.5, 3.1, 4.22],
        [0.5, 0.12, 1.65],
        [-0.16, 0, 0],
      ),
    );
  }
  return bake(parts);
}

function leafGeometry() {
  const p = [
    0, 0, 0, 2.2, 0.9, 0, 4.4, 0.55, 0, 6.2, -0.75, 0, 2.1, 0.6, -0.8, 4.2,
    0.27, -0.62, 2.1, 0.6, 0.8, 4.2, 0.27, 0.62,
  ];
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  g.setIndex([
    0, 4, 1, 0, 1, 6, 1, 4, 5, 1, 5, 2, 1, 2, 7, 1, 7, 6, 2, 5, 3, 2, 3, 7,
  ]);
  g.computeVertexNormals();
  return g;
}

function makeSignTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  context.fillStyle = "#fff5dc";
  context.fillRect(0, 0, 1024, 160);
  context.fillStyle = "#e97459";
  context.fillRect(0, 145, 1024, 15);
  context.font = "900 74px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#257d82";
  context.fillText("PELICAN COAST", 512, 80);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if ((i + j) % 2 === 0) {
        context.fillRect(20 + i * 20, 45 + j * 20, 20, 20);
        context.fillRect(944 + i * 20, 45 + j * 20, 20, 20);
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function createWorld(scene) {
  const random = seededRandom();
  const world = new THREE.Group();
  world.name = "Pelican Coast";
  scene.add(world);
  const vertexMaterial = standard("#ffffff", { vertexColors: true });
  const box = new THREE.BoxGeometry(1, 1, 1);
  const sphere = new THREE.SphereGeometry(1, 9, 6);
  const dummy = new THREE.Object3D();
  function add(
    geometry,
    material,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    cast = true,
  ) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    world.add(mesh);
    return mesh;
  }
  function atTrack(mesh, distance, lateral = 0, elevation = 0) {
    const frame = getTrackFrame(distance, lateral);
    mesh.position.copy(frame.position);
    mesh.position.y += elevation;
    mesh.quaternion.setFromUnitVectors(FORWARD, frame.tangent);
    return mesh;
  }
  function inside(distance, offset) {
    const frame = getTrackFrame(distance);
    const sign = frame.right.dot(frame.position) > 0 ? -1 : 1;
    return getTrackFrame(distance, sign * offset).position;
  }
  const trackSamples = Array.from(
    { length: 180 },
    (_, i) => getTrackFrame((i / 180) * TRACK_LENGTH).position,
  );
  function clearOfRoad(x, z, clearance = 16) {
    return trackSamples.every(
      (p) => (p.x - x) ** 2 + (p.z - z) ** 2 > clearance ** 2,
    );
  }

  // Ocean, softly scalloped beaches and a sheltered green heart.
  const oceanMaterial = standard("#39b8c6", {
    roughness: 0.38,
    metalness: 0.07,
  });
  const ocean = add(
    new THREE.PlaneGeometry(2400, 2400),
    oceanMaterial,
    [0, -0.4, 0],
    [1, 1, 1],
    false,
  );
  ocean.rotation.x = -Math.PI / 2;
  const shallows = islandSurface(1.31, -0.32, "#64ced0", 0.008);
  world.add(shallows);
  world.add(islandSurface(1.215, -0.18, "#b3e0cf", 0.006));
  world.add(islandSurface(1.18, 0.07, palette.sand, 0.006));
  world.add(islandSurface(0.785, 0.11, "#a3ce86", 0.012));
  world.add(islandSurface(0.72, 0.12, palette.grass, 0.02));
  const foamMaterial = standard("#edfff0", {
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  world.add(coastalRing(1.185, 0.7, 0.085, foamMaterial));
  world.add(coastalRing(1.25, 0.38, -0.15, foamMaterial, 1));

  const waves = new THREE.InstancedMesh(
    box,
    standard("#b5e7dc", { transparent: true, opacity: 0.46 }),
    115,
  );
  const wavePositions = [];
  for (let i = 0; i < 115; i++) {
    const a = random() * Math.PI * 2,
      radius = 155 + random() * 270;
    const position = new THREE.Vector3(
      Math.cos(a) * radius * 1.15,
      -0.28,
      Math.sin(a) * radius,
    );
    wavePositions.push({
      position,
      scale: 2 + random() * 6,
      phase: random() * Math.PI * 2,
    });
    dummy.position.copy(position);
    dummy.scale.set(wavePositions[i].scale, 0.018, 0.18 + random() * 0.16);
    dummy.rotation.set(0, -0.12, 0);
    dummy.updateMatrix();
    waves.setMatrixAt(i, dummy.matrix);
  }
  waves.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  world.add(waves);

  // Road surface and markings follow the actual playable spline.
  world.add(
    roadRibbon(
      0,
      ROAD_WIDTH + 1.4,
      ROAD_HEIGHT - 0.13,
      standard("#c7bc9d", { side: THREE.DoubleSide }),
    ),
  );
  world.add(
    roadRibbon(
      0,
      ROAD_WIDTH,
      ROAD_HEIGHT,
      standard(palette.road, { side: THREE.DoubleSide }),
    ),
  );
  const paintMaterial = standard("#fff1cd", { side: THREE.DoubleSide });
  for (const side of [-1, 1])
    world.add(
      roadRibbon(
        side * (ROAD_WIDTH / 2 - 0.42),
        0.2,
        ROAD_HEIGHT + 0.018,
        paintMaterial,
      ),
    );
  const dashCount = Math.floor(TRACK_LENGTH / 8);
  const dashes = new THREE.InstancedMesh(box, paintMaterial, dashCount);
  for (let i = 0; i < dashCount; i++) {
    const f = getTrackFrame(((i + 0.5) * TRACK_LENGTH) / dashCount);
    dummy.position.copy(f.position);
    dummy.position.y += 0.023;
    dummy.quaternion.setFromUnitVectors(FORWARD, f.tangent);
    dummy.scale.set(0.23, 0.018, 3);
    dummy.updateMatrix();
    dashes.setMatrixAt(i, dummy.matrix);
  }
  world.add(dashes);

  // A quiet lagoon and a little timber jetty in the island's middle.
  const lagoonRim = add(
    new THREE.CircleGeometry(28, 42),
    standard("#e7d6a4"),
    [-5, 0.145, -7],
    [1.22, 1, 1],
    false,
  );
  lagoonRim.rotation.x = -Math.PI / 2;
  const lagoon = add(
    new THREE.CircleGeometry(25, 42),
    standard("#55b9b1", { roughness: 0.3 }),
    [-5, 0.17, -7],
    [1.22, 1, 1],
    false,
  );
  lagoon.rotation.x = -Math.PI / 2;
  const dockParts = [];
  for (let i = 0; i < 11; i++)
    dockParts.push(
      piece(
        box,
        i % 2 ? "#d1ac78" : "#dfbd86",
        [0, 0.58, i * 0.9],
        [4.6, 0.22, 0.8],
      ),
    );
  for (const x of [-2.05, 2.05])
    for (const z of [0, 4.5, 9])
      dockParts.push(
        piece(new THREE.CylinderGeometry(0.17, 0.2, 1.5, 7), "#f9e7c2", [
          x,
          0.62,
          z,
        ]),
      );
  add(bake(dockParts), vertexMaterial, [-3, 0, 14]);

  // Village buildings sit on the inside of the course, with their doors toward the coast.
  const houseGeometries = [
    houseGeometry("#ec8967"),
    houseGeometry("#df7458", 1),
    houseGeometry("#d5a95e"),
  ];
  for (let i = 0; i < 12; i++) {
    const distance = TRACK_LENGTH * (0.11 + i * 0.071);
    const p = inside(distance, 28 + (i % 3) * 7);
    if (!clearOfRoad(p.x, p.z, 19)) continue;
    const s = 0.85 + random() * 0.27;
    const house = add(
      houseGeometries[i % 3],
      vertexMaterial,
      [p.x, 0.15, p.z],
      [s, s, s],
    );
    house.rotation.y = Math.atan2(p.x, p.z);
    const radial = new THREE.Vector3(p.x, 0, p.z).normalize();
    const path = add(
      box,
      standard("#ead5a4"),
      [p.x + radial.x * 8, 0.13, p.z + radial.z * 8],
      [2.8, 0.055, 8],
      false,
    );
    path.rotation.y = house.rotation.y;
  }

  // A white-and-coral lighthouse is the landmark visible from the whole circuit.
  const lighthousePosition = inside(TRACK_LENGTH * 0.58, 33);
  const lighthouseParts = [
    piece(
      new THREE.CylinderGeometry(4.3, 5.1, 0.7, 14),
      "#e4cd9e",
      [0, 0.35, 0],
    ),
  ];
  for (let i = 0; i < 7; i++) {
    const bottom = 3.35 - i * 0.14;
    lighthouseParts.push(
      piece(
        new THREE.CylinderGeometry(bottom - 0.14, bottom, 2.6, 16),
        i % 2 ? "#ed8268" : "#fff0d4",
        [0, 2 + i * 2.6, 0],
      ),
    );
  }
  lighthouseParts.push(
    piece(
      new THREE.CylinderGeometry(3.7, 3.5, 0.65, 16),
      "#fff1d7",
      [0, 20, 0],
    ),
  );
  lighthouseParts.push(
    piece(
      new THREE.CylinderGeometry(2.2, 2.2, 3.1, 12),
      "#387d88",
      [0, 21.8, 0],
    ),
  );
  lighthouseParts.push(
    piece(new THREE.ConeGeometry(3.55, 2.9, 16), "#db745d", [0, 24.3, 0]),
  );
  lighthouseParts.push(
    piece(new THREE.SphereGeometry(0.5, 8, 5), "#f4bd5e", [0, 25.95, 0]),
  );
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    lighthouseParts.push(
      piece(new THREE.CylinderGeometry(0.08, 0.08, 1.55, 5), "#fff0d4", [
        Math.sin(a) * 3.32,
        21,
        Math.cos(a) * 3.32,
      ]),
    );
    lighthouseParts.push(
      piece(new THREE.CylinderGeometry(0.1, 0.1, 3.1, 5), "#fff0d4", [
        Math.sin(a) * 2.22,
        21.8,
        Math.cos(a) * 2.22,
      ]),
    );
  }
  lighthouseParts.push(
    piece(
      new THREE.TorusGeometry(3.32, 0.09, 4, 16),
      "#fff0d4",
      [0, 21.75, 0],
      [1, 1, 1],
      [Math.PI / 2, 0, 0],
    ),
  );
  lighthouseParts.push(
    piece(box, "#296f77", [0, 2.1, 3.32], [1.65, 3.15, 0.14]),
  );
  for (const y of [7, 13, 17])
    lighthouseParts.push(
      piece(box, "#367883", [0, y, 3.34 - (y / 2.6) * 0.14], [0.65, 1.2, 0.2]),
    );
  add(bake(lighthouseParts), vertexMaterial, [
    lighthousePosition.x,
    0.15,
    lighthousePosition.z,
  ]);
  add(
    sphere,
    standard("#ffe6a1", { emissive: "#ffd378", emissiveIntensity: 0.5 }),
    [lighthousePosition.x, 21.75, lighthousePosition.z],
    [1.45, 1.3, 1.45],
    false,
  );

  // Bent trunks, sculpted fronds and coconuts are instanced across the island.
  const palmPositions = [];
  for (let i = 0; i < 38; i++) {
    const p = inside(((i + 0.3) / 38) * TRACK_LENGTH, 15 + random() * 11);
    if (clearOfRoad(p.x, p.z, 12))
      palmPositions.push({
        x: p.x,
        z: p.z,
        height: 7 + random() * 5,
        angle: random() * Math.PI * 2,
      });
  }
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    palmPositions.push({
      x: -5 + Math.sin(a) * 39,
      z: -7 + Math.cos(a) * 32,
      height: 8 + random() * 4,
      angle: random() * Math.PI * 2,
    });
  }
  const trunks = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(1, 1.08, 1, 7),
    standard("#cfa97a"),
    palmPositions.length * 5,
  );
  const leaves = new THREE.InstancedMesh(
    leafGeometry(),
    standard("#479b66", { side: THREE.DoubleSide }),
    palmPositions.length * 7,
  );
  const coconuts = new THREE.InstancedMesh(
    sphere,
    standard("#99774b"),
    palmPositions.length * 3,
  );
  trunks.castShadow = true;
  leaves.castShadow = true;
  trunks.receiveShadow = true;
  palmPositions.forEach((p, i) => {
    const direction = new THREE.Vector3(
      Math.sin(p.angle),
      0,
      Math.cos(p.angle),
    );
    for (let segment = 0; segment < 5; segment++) {
      const t0 = segment / 5,
        t1 = (segment + 1) / 5;
      const a = new THREE.Vector3(
        p.x + direction.x * t0 * t0 * 1.5,
        0.15 + p.height * t0,
        p.z + direction.z * t0 * t0 * 1.5,
      );
      const b = new THREE.Vector3(
        p.x + direction.x * t1 * t1 * 1.5,
        0.15 + p.height * t1,
        p.z + direction.z * t1 * t1 * 1.5,
      );
      dummy.position.copy(a).add(b).multiplyScalar(0.5);
      dummy.quaternion.setFromUnitVectors(UP, b.clone().sub(a).normalize());
      dummy.scale.set(
        0.37 - t0 * 0.13,
        a.distanceTo(b) + 0.05,
        0.37 - t0 * 0.13,
      );
      dummy.updateMatrix();
      trunks.setMatrixAt(i * 5 + segment, dummy.matrix);
    }
    const top = new THREE.Vector3(
      p.x + direction.x * 1.5,
      p.height + 0.15,
      p.z + direction.z * 1.5,
    );
    for (let j = 0; j < 7; j++) {
      dummy.position.copy(top);
      dummy.rotation.set(
        0,
        p.angle + (j / 7) * Math.PI * 2,
        0.1 + (j % 2) * 0.14,
      );
      const s = 0.7 + p.height / 30;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      leaves.setMatrixAt(i * 7 + j, dummy.matrix);
    }
    for (let j = 0; j < 3; j++) {
      const a = p.angle + (j / 3) * Math.PI * 2;
      dummy.position
        .copy(top)
        .add(new THREE.Vector3(Math.sin(a) * 0.37, -0.22, Math.cos(a) * 0.37));
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(0.32);
      dummy.updateMatrix();
      coconuts.setMatrixAt(i * 3 + j, dummy.matrix);
    }
  });
  world.add(trunks, leaves, coconuts);

  // Sunshades, beach chairs, coastal rocks, and a few flowering shrubs.
  const parasolGeometry = new THREE.ConeGeometry(3.2, 1.2, 10, 1, true);
  const beachDecor = [];
  for (let i = 0; i < 8; i++) {
    const d = TRACK_LENGTH * (0.17 + i * 0.074);
    const f = getTrackFrame(d);
    const radial = new THREE.Vector3(f.position.x, 0, f.position.z).normalize();
    const p = f.position.clone().addScaledVector(radial, 13.5);
    if (!clearOfRoad(p.x, p.z, 11)) continue;
    const color = i % 2 ? "#f5bd66" : "#ee9278";
    beachDecor.push(piece(parasolGeometry, color, [p.x, 4, p.z]));
    beachDecor.push(
      piece(new THREE.CylinderGeometry(0.08, 0.1, 3.75, 6), "#fff1d2", [
        p.x,
        1.92,
        p.z,
      ]),
    );
    for (const side of [-1, 1]) {
      beachDecor.push(
        piece(box, "#fff1d2", [p.x + side * 1.6, 0.5, p.z], [1.05, 0.2, 2.4]),
      );
      beachDecor.push(
        piece(box, color, [p.x + side * 1.6, 0.64, p.z], [0.8, 0.11, 2.3]),
      );
      beachDecor.push(
        piece(
          box,
          color,
          [p.x + side * 1.6, 1.03, p.z - 1],
          [0.8, 1, 0.16],
          [-0.3, 0, 0],
        ),
      );
    }
  }
  add(
    bake(beachDecor),
    standard("#ffffff", { vertexColors: true, side: THREE.DoubleSide }),
  );
  const rocks = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 0),
    standard("#a3b5a9", { flatShading: true }),
    43,
  );
  for (let i = 0; i < 43; i++) {
    const d = ((i + 0.5) / 43) * TRACK_LENGTH;
    const p = getTrackFrame(d).position;
    const factor = 1.13 + random() * 0.06;
    dummy.position.set(p.x * factor, 0.2, p.z * factor);
    dummy.rotation.set(random(), random() * 6, random());
    const s = 0.8 + random() * 1.5;
    dummy.scale.set(s * 1.3, s * 0.7, s);
    dummy.updateMatrix();
    rocks.setMatrixAt(i, dummy.matrix);
  }
  rocks.castShadow = true;
  rocks.receiveShadow = true;
  world.add(rocks);

  const shrubCount = 45;
  const shrubs = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 1),
    standard("#70b17a", { flatShading: true }),
    shrubCount,
  );
  for (let i = 0; i < shrubCount; i++) {
    const a = random() * Math.PI * 2,
      radius = 41 + random() * 25;
    dummy.position.set(Math.sin(a) * radius, 0.65, Math.cos(a) * radius);
    dummy.rotation.set(0, random() * 6, 0);
    dummy.scale.set(1.8 + random() * 1.8, 1.3, 1.8 + random());
    dummy.updateMatrix();
    shrubs.setMatrixAt(i, dummy.matrix);
  }
  shrubs.castShadow = true;
  world.add(shrubs);

  // A low fence is useful visual guidance on the wider coastal bends.
  const bollardParts = [];
  for (let i = 0; i < 28; i++) {
    const d = 35 + (i / 28) * (TRACK_LENGTH - 60);
    const frame = getTrackFrame(d);
    const outsideSign = frame.right.dot(frame.position) > 0 ? 1 : -1;
    const p = getTrackFrame(d, outsideSign * (ROAD_WIDTH / 2 + 1.8)).position;
    bollardParts.push(
      piece(new THREE.CylinderGeometry(0.15, 0.2, 1.55, 6), "#fff1d5", [
        p.x,
        0.9,
        p.z,
      ]),
    );
    bollardParts.push(
      piece(new THREE.CylinderGeometry(0.18, 0.18, 0.25, 6), "#e78867", [
        p.x,
        1.44,
        p.z,
      ]),
    );
  }
  add(bake(bollardParts), vertexMaterial);

  // Distant scenery gives the horizon a sense of place without obstructing play.
  const islandMat = standard("#82bfa9", { flatShading: true });
  const islandRockMat = standard("#8ebbad", { flatShading: true });
  for (const [x, z, s] of [
    [-310, -260, 1],
    [300, -320, 1.5],
    [420, 110, 1.1],
    [-390, 90, 0.7],
  ]) {
    add(
      new THREE.SphereGeometry(1, 9, 5),
      islandRockMat,
      [x, -1.3, z],
      [42 * s, 11 * s, 25 * s],
      false,
    );
    add(
      new THREE.SphereGeometry(1, 9, 5),
      islandMat,
      [x + 3, 1, z - 3],
      [31 * s, 10 * s, 18 * s],
      false,
    );
  }
  const cloudClusters = [
    [-260, 63, -330],
    [70, 77, -390],
    [320, 59, -230],
    [360, 69, 230],
    [-300, 75, 260],
    [-80, 68, 400],
    [190, 89, 400],
  ];
  const clouds = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 9, 6),
    standard("#fff9e9", { flatShading: true }),
    cloudClusters.length * 5,
  );
  cloudClusters.forEach((p, i) => {
    for (let j = 0; j < 5; j++) {
      dummy.position.set(
        p[0] + (j - 2) * 10,
        p[1] + Math.sin((j / 4) * Math.PI) * 5,
        p[2],
      );
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(12, 5 + (j % 3) * 2, 7);
      dummy.updateMatrix();
      clouds.setMatrixAt(i * 5 + j, dummy.matrix);
    }
  });
  world.add(clouds);

  const boatParts = [
    piece(sphere, "#fff1d5", [0, 0.2, 0], [2, 0.75, 5]),
    piece(box, "#e98b6b", [0, 0.75, 0], [2.5, 0.2, 5.4]),
    piece(
      new THREE.CylinderGeometry(0.09, 0.09, 11, 6),
      "#f9e9c5",
      [0, 5.9, 0],
    ),
  ];
  const sail = new THREE.BufferGeometry();
  sail.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([0, 1.1, 0, 0, 11, 0, 0, 1.1, -5.8], 3),
  );
  sail.computeVertexNormals();
  boatParts.push(piece(sail, "#fff4d6"));
  const sailSmall = new THREE.BufferGeometry();
  sailSmall.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [0, 1.1, 0.5, 0, 9.5, 0.5, 0, 1.1, 4.2],
      3,
    ),
  );
  sailSmall.computeVertexNormals();
  boatParts.push(piece(sailSmall, "#ef9d76"));
  const boatGeometry = bake(boatParts);
  const boatMaterial = standard("#ffffff", {
    vertexColors: true,
    side: THREE.DoubleSide,
  });
  const boats = [];
  for (const [x, z, angle] of [
    [205, 10, 0.65],
    [-195, -155, -0.8],
    [120, -210, 1.1],
  ]) {
    const boat = add(boatGeometry, boatMaterial, [x, -0.35, z]);
    boat.rotation.y = angle;
    boats.push(boat);
  }

  // Finish gate and painted checkerboard sit exactly at the logical lap boundary.
  const arch = new THREE.Group();
  const archParts = [];
  for (const side of [-1, 1]) {
    archParts.push(
      piece(box, "#f7edda", [side * 8.75, 4.6, 0], [0.65, 9.2, 0.65]),
    );
    archParts.push(
      piece(box, "#e7876a", [side * 8.75, 0.4, 0], [1.1, 0.8, 1.1]),
    );
    archParts.push(
      piece(box, "#2c858b", [side * 8.75, 7.65, 0], [0.8, 0.35, 0.8]),
    );
  }
  archParts.push(piece(box, "#2c858b", [0, 9.2, 0], [18.3, 0.33, 0.7]));
  archParts.push(piece(box, "#fff0d2", [0, 8.25, 0], [17, 1.65, 0.36]));
  const archSolid = new THREE.Mesh(bake(archParts), vertexMaterial);
  archSolid.castShadow = true;
  arch.add(archSolid);
  const signMaterial = standard("#ffffff", {
    map: makeSignTexture(),
    roughness: 1,
  });
  for (const side of [-1, 1]) {
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(16.8, 2.625),
      signMaterial,
    );
    sign.position.set(0, 8.25, side * 0.19);
    sign.scale.y = 0.6;
    if (side < 0) sign.rotation.y = Math.PI;
    arch.add(sign);
  }
  atTrack(arch, 0, 0, -ROAD_HEIGHT + 0.12);
  world.add(arch);
  const finishParts = [];
  for (let row = 0; row < 3; row++)
    for (let column = 0; column < 14; column++) {
      finishParts.push(
        piece(
          box,
          (row + column) % 2 ? "#fff1d7" : "#324f59",
          [(column - 6.5) * 0.92, 0.03, (row - 1) * 0.92],
          [0.92, 0.018, 0.92],
        ),
      );
    }
  const finish = new THREE.Mesh(bake(finishParts), vertexMaterial);
  atTrack(finish, 0);
  finish.receiveShadow = true;
  world.add(finish);

  // Playable pickups and hazards use the same distance/lateral coordinate system as the rider.
  const ramps = [];
  for (const [fraction, lateral] of [
    [0.205, -4],
    [0.43, 4],
    [0.645, 0],
    [0.855, -4],
  ]) {
    const distance = TRACK_LENGTH * fraction;
    const width = 4.2,
      length = 7,
      height = 1.55;
    const group = new THREE.Group();
    const ramp = new THREE.Mesh(
      rampGeometry(width, length, height),
      standard("#f3bc54", { side: THREE.DoubleSide }),
    );
    ramp.castShadow = true;
    ramp.receiveShadow = true;
    group.add(ramp);
    const slope = Math.atan2(height - 0.04, length);
    for (const z of [-1.55, 0.55]) {
      for (const sign of [-1, 1]) {
        const stripe = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 0.035, 0.25),
          paintMaterial,
        );
        stripe.position.set(
          sign * 0.52,
          0.07 + ((z + length / 2) / length) * (height - 0.04),
          z,
        );
        stripe.rotation.set(-slope, sign * -0.5, 0);
        group.add(stripe);
      }
    }
    // The logical distance marks the crest: the rider launches when reaching it.
    atTrack(group, distance - length / 2, lateral);
    world.add(group);
    ramps.push({ mesh: group, distance, lateral, width, length, height });
  }

  const fish = [];
  const goldenFish = fishGeometry();
  const fishMaterial = standard("#ffffff", {
    vertexColors: true,
    roughness: 0.42,
    metalness: 0.12,
    emissive: "#7d4200",
    emissiveIntensity: 0.16,
  });
  for (let i = 0; i < 42; i++) {
    let distance = 20 + (i * (TRACK_LENGTH - 35)) / 42;
    let lateral = [-4, 0, 4, 0][Math.floor(i / 3) % 4];
    let elevation = 1.8;
    for (const ramp of ramps) {
      if (Math.abs(distance - ramp.distance) < 11) {
        lateral = ramp.lateral;
        if (distance > ramp.distance - 3) elevation = 3;
      }
    }
    const mesh = new THREE.Mesh(goldenFish, fishMaterial);
    mesh.castShadow = true;
    atTrack(mesh, distance, lateral, elevation);
    mesh.rotation.y += Math.PI / 2;
    const baseY = mesh.position.y,
      baseRotation = mesh.rotation.y;
    world.add(mesh);
    fish.push({
      mesh,
      distance,
      lateral,
      collected: false,
      baseY,
      baseRotation,
      phase: i * 0.71,
    });
  }

  const obstacles = [];
  const cone = coneGeometry(),
    crate = crateGeometry();
  for (let i = 0; i < 13; i++) {
    let distance = 66 + (i * (TRACK_LENGTH - 102)) / 13;
    const lateral = [-4, 4, 0, 4, -4, 0][i % 6];
    if (
      ramps.some(
        (ramp) =>
          Math.abs(ramp.distance - distance) < 17 &&
          Math.abs(ramp.lateral - lateral) < 3,
      )
    )
      distance += 19;
    if (
      fish.some(
        (item) =>
          Math.abs(item.distance - distance) < 5 && item.lateral === lateral,
      )
    )
      distance += 7;
    const type = i % 3 === 2 ? "crate" : "cone";
    const mesh = new THREE.Mesh(
      type === "crate" ? crate : cone,
      vertexMaterial,
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    atTrack(mesh, distance, lateral);
    world.add(mesh);
    obstacles.push({
      mesh,
      distance,
      lateral,
      radius: type === "crate" ? 1.05 : 0.85,
      type,
    });
  }

  return {
    fish,
    obstacles,
    ramps,
    update(time, dt) {
      for (const item of fish) {
        if (item.collected) continue;
        item.mesh.position.y =
          item.baseY + Math.sin(time * 2.5 + item.phase) * 0.2;
        item.mesh.rotation.y =
          item.baseRotation + Math.sin(time * 1.2 + item.phase) * 0.27;
        item.mesh.rotation.z = Math.sin(time * 2 + item.phase) * 0.08;
      }
      foamMaterial.opacity = 0.48 + Math.sin(time * 0.72) * 0.13;
      boats.forEach((boat, i) => {
        boat.position.y = -0.35 + Math.sin(time * 1.3 + i * 2) * 0.15;
        boat.rotation.z = Math.sin(time * 0.8 + i * 2) * 0.035;
      });
      clouds.rotation.y = Math.sin(time * 0.006) * 0.035;
      // Shared instances keep this water animation to a single draw call.
      for (let i = 0; i < wavePositions.length; i++) {
        const wave = wavePositions[i];
        dummy.position.copy(wave.position);
        dummy.position.z += Math.sin(time * 0.5 + wave.phase) * 0.8;
        dummy.scale.set(
          wave.scale * (0.86 + Math.sin(time * 0.7 + wave.phase) * 0.14),
          0.018,
          0.2,
        );
        dummy.rotation.set(0, -0.12, 0);
        dummy.updateMatrix();
        waves.setMatrixAt(i, dummy.matrix);
      }
      waves.instanceMatrix.needsUpdate = true;
    },
    reset() {
      for (const item of fish) {
        item.collected = false;
        item.mesh.visible = true;
      }
    },
  };
}
