import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);
const CAR_FORMS = {
  comet: {
    sections: [
      [-2.18, 0.74, 0.62],
      [-1.82, 0.91, 0.74],
      [-1.27, 0.955, 0.85],
      [-0.72, 0.88, 0.79],
      [0, 0.86, 0.72],
      [0.68, 0.89, 0.75],
      [1.27, 0.955, 0.83],
      [1.78, 0.85, 0.65],
      [2.18, 0.64, 0.52],
    ],
    roof: 1.17,
    cabinFront: 0.73,
    cabinRear: -1.13,
    roofFront: 0.06,
    roofRear: -0.62,
    roofWidth: 0.56,
    axle: 1.27,
    spokes: 5,
    wing: false,
  },
  vector: {
    sections: [
      [-2.2, 0.83, 0.7],
      [-1.82, 0.95, 0.77],
      [-1.27, 0.96, 0.83],
      [-0.64, 0.87, 0.77],
      [0, 0.85, 0.69],
      [0.65, 0.92, 0.72],
      [1.27, 0.96, 0.82],
      [1.78, 0.9, 0.61],
      [2.2, 0.76, 0.45],
    ],
    roof: 1.11,
    cabinFront: 0.73,
    cabinRear: -1.11,
    roofFront: 0.07,
    roofRear: -0.54,
    roofWidth: 0.53,
    axle: 1.27,
    spokes: 6,
    wing: true,
  },
  tempest: {
    sections: [
      [-2.2, 0.7, 0.63],
      [-1.85, 0.91, 0.74],
      [-1.28, 0.96, 0.86],
      [-0.66, 0.92, 0.81],
      [0, 0.88, 0.77],
      [0.66, 0.9, 0.81],
      [1.28, 0.95, 0.85],
      [1.84, 0.88, 0.73],
      [2.2, 0.71, 0.6],
    ],
    roof: 1.19,
    cabinFront: 0.47,
    cabinRear: -1.3,
    roofFront: -0.12,
    roofRear: -0.76,
    roofWidth: 0.58,
    axle: 1.28,
    spokes: 7,
    wing: false,
  },
};

function stripGeometry(rows, closed = false) {
  const positions = [];
  const indices = [];
  const count = rows[0].length;
  rows.forEach((row) => row.forEach((point) => positions.push(...point)));
  for (let row = 0; row < rows.length - 1; row += 1) {
    for (let column = 0; column < count - (closed ? 0 : 1); column += 1) {
      const a = row * count + column;
      const b = row * count + ((column + 1) % count);
      const c = (row + 1) * count + column;
      const d = (row + 1) * count + ((column + 1) % count);
      indices.push(a, c, b, b, c, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function loftBody(form) {
  const rows = [];
  const curve = new THREE.CatmullRomCurve3(
    form.sections.map(
      ([z, width, height]) => new THREE.Vector3(width, height, z),
    ),
    false,
    "catmullrom",
    0.16,
  );
  for (let i = 0; i <= 96; i += 1) {
    const section = curve.getPoint(i / 96);
    const { x: width, y: top, z } = section;
    let bottom = 0.235;
    for (const axle of [-form.axle, form.axle]) {
      const distance = Math.abs(z - axle);
      if (distance < 0.42)
        bottom = Math.max(bottom, 0.34 + Math.sqrt(0.42 ** 2 - distance ** 2));
    }
    const archShoulder = Math.max(top, bottom + 0.055);
    rows.push([
      [-width * 0.97, bottom, z],
      [-width, Math.max(bottom + 0.025, archShoulder - 0.105), z],
      [-width * 0.94, archShoulder - 0.016, z],
      [-width * 0.76, archShoulder + 0.007, z],
      [-width * 0.52, top - 0.028, z],
      [0, top - 0.045, z],
      [width * 0.52, top - 0.028, z],
      [width * 0.76, archShoulder + 0.007, z],
      [width * 0.94, archShoulder - 0.016, z],
      [width, Math.max(bottom + 0.025, archShoulder - 0.105), z],
      [width * 0.97, bottom, z],
    ]);
  }
  const skin = stripGeometry(rows);
  const capParts = [skin];
  for (const index of [0, rows.length - 1]) {
    const row = rows[index];
    const z = row[0][2];
    const center = [0, 0.36, z];
    const positions = [];
    for (let i = 0; i < row.length; i += 1) {
      const next = (i + 1) % row.length;
      const triangle =
        index === 0 ? [center, row[i], row[next]] : [center, row[next], row[i]];
      triangle.forEach((point) => positions.push(...point));
    }
    const cap = new THREE.BufferGeometry();
    cap.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    cap.computeVertexNormals();
    capParts.push(cap);
  }
  return merge(capParts);
}

function roundBox(width, height, depth, radius = 0.035) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width * 0.35, height * 0.35);
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.003, depth - r),
    bevelEnabled: true,
    bevelThickness: r / 2,
    bevelSize: r / 2,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 3,
  });
  geometry.translate(0, 0, -(depth - r) / 2);
  return geometry;
}

function beam(start, end, radius = 0.025, sides = 6) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const vector = to.clone().sub(from);
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    vector.length(),
    sides,
  );
  geometry.applyQuaternion(
    new THREE.Quaternion().setFromUnitVectors(UP, vector.normalize()),
  );
  geometry.translate(...from.add(to).multiplyScalar(0.5).toArray());
  return geometry;
}

function quad(a, b, c, d) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([...a, ...b, ...c, ...d], 3),
  );
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  geometry.computeVertexNormals();
  return geometry;
}

function merge(parts) {
  const normalised = parts.map((part) => {
    const converted = part.index ? part.toNonIndexed() : part;
    for (const name of Object.keys(converted.attributes)) {
      if (name !== "position" && name !== "normal")
        converted.deleteAttribute(name);
    }
    if (part !== converted) part.dispose();
    return converted;
  });
  const result = mergeGeometries(normalised, false);
  normalised.forEach((geometry) => geometry.dispose());
  return result;
}

/** Original, procedurally sculpted sports cars. Local +Z is the nose. */
export function createCar(
  model = "comet",
  color = 0x7de9cb,
  { ghost = false, detail = "high" } = {},
) {
  const form = CAR_FORMS[model] || CAR_FORMS.comet;
  const group = new THREE.Group();
  group.name = `apex-${model}${ghost ? "-ghost" : ""}`;
  const roadTilt = new THREE.Group();
  const body = new THREE.Group();
  group.add(roadTilt);
  roadTilt.add(body);
  // A soft contact shadow keeps the tires grounded when shadow maps are disabled.
  // It follows the road pitch independently of the chassis suspension animation.
  let contactTexture = null;
  if (!ghost) {
    const width = 64;
    const height = 128;
    const pixels = new Uint8Array(width * height * 4);
    for (let v = 0; v < height; v += 1) {
      for (let u = 0; u < width; u += 1) {
        const x = ((u + 0.5) / width - 0.5) * 2.7;
        const z = ((v + 0.5) / height - 0.5) * 5.2;
        let shade = 0.32 * Math.exp(-1.3 * ((x / 0.95) ** 4 + (z / 1.95) ** 4));
        for (const wheelX of [-0.855, 0.855]) {
          for (const wheelZ of [-form.axle, form.axle]) {
            shade +=
              0.36 *
              Math.exp(
                -2 * (((x - wheelX) / 0.32) ** 2 + ((z - wheelZ) / 0.43) ** 2),
              );
          }
        }
        const index = (v * width + u) * 4;
        pixels[index + 3] = Math.round(Math.min(0.61, shade) * 255);
      }
    }
    contactTexture = new THREE.DataTexture(
      pixels,
      width,
      height,
      THREE.RGBAFormat,
    );
    contactTexture.magFilter = THREE.LinearFilter;
    contactTexture.minFilter = THREE.LinearFilter;
    contactTexture.needsUpdate = true;
    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(2.7, 5.2).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({
        map: contactTexture,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
        toneMapped: false,
      }),
    );
    contact.name = "soft-contact-shadow";
    contact.position.y = 0.018;
    roadTilt.add(contact);
  }
  const material = (settings, physical = false) => {
    const Constructor = physical
      ? THREE.MeshPhysicalMaterial
      : THREE.MeshStandardMaterial;
    return new Constructor(
      ghost
        ? {
            ...settings,
            color: 0x72edff,
            emissive: 0x177588,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.24,
            depthWrite: false,
            roughness: 0.3,
          }
        : settings,
    );
  };
  const paint = material(
    {
      color,
      metalness: 0.73,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
    },
    true,
  );
  const carbon = material({
    color: 0x101920,
    metalness: 0.38,
    roughness: 0.4,
    side: THREE.DoubleSide,
  });
  const glass = material({
    color: 0x244453,
    metalness: 0.45,
    roughness: 0.1,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const interior = material({
    color: 0x20282c,
    roughness: 0.86,
    metalness: 0.1,
  });
  const chrome = material({ color: 0xd7e1e8, metalness: 0.9, roughness: 0.22 });
  const tire = material({ color: 0x13161a, roughness: 0.94, metalness: 0.02 });
  const brake = material({ color: 0xff472e, metalness: 0.25, roughness: 0.32 });
  const headlights = material({
    color: 0xd2faff,
    emissive: 0x94e8ff,
    emissiveIntensity: 3.0,
    roughness: 0.2,
  });
  const rearLights = material({
    color: 0xff2c30,
    emissive: 0xff1423,
    emissiveIntensity: 1.8,
    roughness: 0.2,
  });
  const exhaustMaterial = new THREE.MeshBasicMaterial({
    color: ghost ? 0x62eeff : 0x419cff,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xd4fdff,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const batches = new Map();
  function add(mat, geometry, position, rotation, scale) {
    if (scale) geometry.scale(...scale);
    if (rotation) {
      geometry.applyMatrix4(
        new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rotation)),
      );
    }
    if (position) geometry.translate(...position);
    if (!batches.has(mat)) batches.set(mat, []);
    batches.get(mat).push(geometry);
  }
  add(paint, loftBody(form));
  add(carbon, roundBox(1.44, 0.12, 3.92), [0, 0.235, 0]);

  // The curved glass canopy sits between painted roof rails and four pillars.
  const f = form.cabinFront;
  const r = form.cabinRear;
  const rf = form.roofFront;
  const rr = form.roofRear;
  const rw = form.roofWidth;
  const roof = form.roof;
  const glassRows = [];
  const canopy = [
    [r, 0.715, 0.795, 0.01],
    [r + 0.12, 0.735, 0.79, 0.11],
    [rr - 0.05, 0.695, 0.78, roof - 0.8],
    [rr + 0.1, 0.69, 0.775, roof - 0.775],
    [rf - 0.08, 0.67, 0.76, roof - 0.77],
    [rf + 0.1, 0.685, 0.755, roof - 0.85],
    [f - 0.09, 0.72, 0.75, 0.07],
    [f, 0.7, 0.745, 0.01],
  ];
  for (const [z, width, base, height] of canopy) {
    const row = [];
    for (let i = 0; i <= 18; i += 1) {
      const angle = (Math.PI * i) / 18;
      row.push([
        -Math.cos(angle) * width,
        base + Math.sin(angle) ** 0.55 * height,
        z,
      ]);
    }
    glassRows.push(row);
  }
  add(glass, stripGeometry(glassRows));
  const roofRows = [];
  for (let i = 0; i <= 10; i += 1) {
    const t = i / 10;
    const z = rr + (rf - rr) * t;
    const row = [];
    for (let j = 0; j <= 12; j += 1) {
      const across = (j / 12 - 0.5) * 2;
      row.push([
        across * rw,
        roof - across * across * 0.065 + Math.sin(t * Math.PI) * 0.009,
        z,
      ]);
    }
    roofRows.push(row);
  }
  add(paint, stripGeometry(roofRows));
  for (const side of [-1, 1]) {
    add(
      paint,
      beam([side * 0.705, 0.758, f], [side * rw, roof - 0.064, rf], 0.027),
    );
    add(
      paint,
      beam([side * rw, roof - 0.064, rr], [side * 0.717, 0.8, r], 0.043),
    );
    add(
      paint,
      beam([side * rw, roof - 0.06, rr], [side * rw, roof - 0.06, rf], 0.029),
    );
    add(
      carbon,
      beam(
        [side * 0.721, 0.775, r + 0.12],
        [side * 0.705, 0.755, f - 0.02],
        0.02,
      ),
    );
    add(
      carbon,
      beam(
        [side * 0.704, 0.775, rr + 0.06],
        [side * rw, roof - 0.07, rr + 0.1],
        0.022,
      ),
    );
    add(carbon, roundBox(0.1, 0.1, 1.64), [side * 0.891, 0.3, -0.01]);
    add(
      carbon,
      beam(
        [side * 0.78, 0.79, f - 0.12],
        [side * 1.005, 0.85, f - 0.15],
        0.024,
      ),
    );
    add(paint, roundBox(0.185, 0.074, 0.17), [side * 1.0, 0.865, f - 0.16]);
    add(chrome, roundBox(0.14, 0.044, 0.005), [side * 1.0, 0.866, f - 0.247]);
    // Black intake opening and a painted flying buttress behind each door.
    const sx = side * (model === "tempest" ? 0.927 : 0.899);
    add(
      carbon,
      quad(
        [sx, 0.43, -0.76],
        [sx, 0.69, -0.87],
        [sx, 0.65, -0.39],
        [sx, 0.48, -0.27],
      ),
    );
    add(paint, beam([sx, 0.45, -0.76], [sx, 0.69, -0.37], 0.023));
    add(chrome, roundBox(0.018, 0.023, 0.13), [side * 0.864, 0.684, -0.14]);
    // Small front-fender vents read especially well in the showcase view.
    for (let i = 0; i < 3; i += 1) {
      add(
        carbon,
        roundBox(0.19, 0.012, 0.031, 0.008),
        [side * 0.76, 0.829 + i * 0.002, 1.03 + i * 0.079],
        [0, side * -0.22, 0],
      );
    }
  }

  // A real cockpit rather than an empty transparent shell.
  if (!ghost) {
    for (const side of [-1, 1]) {
      add(interior, roundBox(0.42, 0.12, 0.5, 0.05), [
        side * 0.35,
        0.58,
        -0.36,
      ]);
      add(
        interior,
        roundBox(0.4, 0.4, 0.14, 0.07),
        [side * 0.35, 0.77, -0.65],
        [-0.16, 0, 0],
      );
      add(interior, roundBox(0.2, 0.16, 0.12, 0.04), [
        side * 0.35,
        0.98,
        -0.68,
      ]);
    }
    add(interior, roundBox(1.2, 0.1, 0.3), [0, 0.79, f - 0.14]);
    add(interior, roundBox(0.16, 0.18, 0.64), [0, 0.64, -0.26]);
    add(
      brake,
      new THREE.SphereGeometry(0.12, 12, 8),
      [-0.35, 1.005, -0.39],
      null,
      [0.88, 1, 0.95],
    );
    add(
      carbon,
      new THREE.SphereGeometry(0.107, 10, 6, 0, Math.PI),
      [-0.35, 1.017, -0.355],
      [0.05, 0, 0],
      [0.96, 0.44, 1],
    );
    add(
      interior,
      new THREE.TorusGeometry(0.105, 0.018, 6, 16),
      [-0.35, 0.8, 0.0],
      [0.25, 0, 0],
    );
  }

  const nose = form.sections[form.sections.length - 1];
  const frontY = nose[2] - 0.055;
  const frontZ = model === "tempest" ? 2.125 : 2.07;
  add(carbon, roundBox(1.4, 0.08, 0.21), [0, 0.253, 2.02]);
  add(carbon, roundBox(0.66, 0.145, 0.12), [0, frontY - 0.125, 2.198]);
  add(carbon, roundBox(1.65, 0.07, 0.27), [0, 0.26, -2.075]);
  for (const side of [-1, 1]) {
    const lightA = [side * 0.39, frontY + 0.052, frontZ + 0.018];
    const lightB = [side * 0.74, frontY + 0.11, frontZ - 0.14];
    add(carbon, beam(lightA, lightB, 0.048, 6));
    add(
      headlights,
      beam(
        [lightA[0], lightA[1] + 0.012, lightA[2] + 0.023],
        [lightB[0], lightB[1] + 0.015, lightB[2] + 0.023],
        0.018,
        6,
      ),
    );
    if (model === "vector") {
      add(
        headlights,
        beam(
          [side * 0.74, frontY + 0.122, frontZ - 0.115],
          [side * 0.8, frontY + 0.07, frontZ - 0.12],
          0.014,
        ),
      );
    } else if (model === "tempest") {
      add(
        headlights,
        beam(
          [side * 0.4, frontY + 0.012, frontZ + 0.038],
          [side * 0.72, frontY + 0.062, frontZ - 0.105],
          0.013,
        ),
      );
    }
    add(carbon, roundBox(0.24, 0.12, 0.14), [side * 0.5, frontY - 0.1, 2.189]);
    const rearY = form.sections[0][2] - 0.06;
    add(carbon, roundBox(0.59, 0.085, 0.06), [side * 0.43, rearY, -2.183]);
    add(rearLights, roundBox(0.53, 0.025, 0.065, 0.008), [
      side * 0.43,
      rearY + 0.005,
      -2.212,
    ]);
    if (model === "comet") {
      add(rearLights, roundBox(0.032, 0.074, 0.057, 0.008), [
        side * 0.684,
        rearY - 0.021,
        -2.205,
      ]);
    }
    const exhaust = new THREE.TorusGeometry(0.076, 0.014, 6, 14);
    add(chrome, exhaust, [side * 0.55, 0.33, -2.226]);
    add(
      carbon,
      new THREE.CylinderGeometry(0.064, 0.064, 0.055, 12),
      [side * 0.55, 0.33, -2.21],
      [Math.PI / 2, 0, 0],
    );
  }
  for (let i = -2; i <= 2; i += 1)
    add(
      carbon,
      roundBox(0.028, 0.13, 0.32, 0.007),
      [i * 0.2, 0.275, -2.01],
      [0.11, 0, 0],
    );
  // Badges and center rear marker are deliberately original, without licensed marks.
  add(
    chrome,
    new THREE.OctahedronGeometry(0.047),
    [0, frontY + 0.098, 1.91],
    null,
    [0.8, 0.2, 1],
  );
  add(chrome, roundBox(0.21, 0.048, 0.012, 0.009), [0, 0.43, -2.232]);
  if (form.wing) {
    for (const side of [-1, 1]) {
      add(
        carbon,
        roundBox(0.04, 0.24, 0.09),
        [side * 0.56, 0.93, -1.75],
        [-0.25, 0, 0],
      );
      add(paint, roundBox(0.028, 0.12, 0.38), [side * 0.9, 1.095, -1.77]);
    }
    add(carbon, roundBox(1.85, 0.052, 0.35), [0, 1.07, -1.77], [-0.08, 0, 0]);
  } else {
    add(
      paint,
      roundBox(model === "tempest" ? 1.45 : 1.3, 0.055, 0.16),
      [0, model === "tempest" ? 0.735 : 0.715, -1.96],
      [-0.13, 0, 0],
    );
  }
  for (const [mat, geometries] of batches) {
    const mesh = new THREE.Mesh(merge(geometries), mat);
    mesh.castShadow = !ghost;
    mesh.receiveShadow = !ghost;
    if (mat === glass) mesh.renderOrder = 2;
    body.add(mesh);
  }

  // Four independent wheel assemblies: one merged tire and one merged alloy each.
  const profile = [
    [0.235, -0.125],
    [0.277, -0.137],
    [0.314, -0.12],
    [0.337, -0.085],
    [0.34, -0.045],
    [0.34, 0.045],
    [0.337, 0.085],
    [0.314, 0.12],
    [0.277, 0.137],
    [0.235, 0.125],
  ].map(([radius, axial]) => new THREE.Vector2(radius, axial));
  const tireParts = [
    new THREE.LatheGeometry(profile, detail === "low" ? 20 : 32).rotateZ(
      Math.PI / 2,
    ),
  ];
  tireParts.push(
    new THREE.CylinderGeometry(0.234, 0.234, 0.225, 24).rotateZ(Math.PI / 2),
  );
  for (const side of [-1, 1]) {
    tireParts.push(
      new THREE.TorusGeometry(0.29, 0.0035, 3, 28)
        .rotateY(Math.PI / 2)
        .translate(side * 0.131, 0, 0),
    );
    tireParts.push(
      new THREE.TorusGeometry(0.275, 0.0035, 3, 28)
        .rotateY(Math.PI / 2)
        .translate(side * 0.136, 0, 0),
    );
  }
  const tireGeometry = merge(tireParts);
  const rimParts = [];
  for (const side of [-1, 1]) {
    rimParts.push(
      new THREE.TorusGeometry(0.23, 0.014, 6, 28)
        .rotateY(Math.PI / 2)
        .translate(side * 0.14, 0, 0),
    );
    rimParts.push(
      new THREE.CylinderGeometry(0.067, 0.067, 0.022, 12)
        .rotateZ(Math.PI / 2)
        .translate(side * 0.146, 0, 0),
    );
    for (let spoke = 0; spoke < form.spokes; spoke += 1) {
      const angle = (spoke / form.spokes) * TAU;
      const forks = model === "comet" ? [-0.12, 0.12] : [0];
      for (const fork of forks) {
        const a = angle + fork;
        const spokeGeometry = new THREE.BoxGeometry(
          0.025,
          0.192,
          model === "tempest" ? 0.043 : 0.031,
        );
        spokeGeometry.rotateX(a + 0.15 * side);
        spokeGeometry.translate(
          side * 0.144,
          Math.cos(a) * 0.13,
          Math.sin(a) * 0.13,
        );
        rimParts.push(spokeGeometry);
      }
      rimParts.push(
        new THREE.SphereGeometry(0.009, 5, 4).translate(
          side * 0.161,
          Math.cos(angle) * 0.047,
          Math.sin(angle) * 0.047,
        ),
      );
    }
  }
  const rimGeometry = merge(rimParts);
  const wheels = [];
  for (const z of [-form.axle, form.axle]) {
    for (const side of [-1, 1]) {
      const steering = new THREE.Group();
      steering.position.set(side * 0.855, 0.34, z);
      const rolling = new THREE.Group();
      const rubber = new THREE.Mesh(tireGeometry, tire);
      const alloy = new THREE.Mesh(rimGeometry, chrome);
      rubber.castShadow = !ghost;
      alloy.castShadow = !ghost;
      rolling.add(rubber, alloy);
      steering.add(rolling);
      roadTilt.add(steering);
      wheels.push({ steering, rolling, front: z > 0 });
    }
  }
  const flameGroup = new THREE.Group();
  const outerParts = [];
  const coreParts = [];
  for (const side of [-1, 1]) {
    outerParts.push(
      new THREE.ConeGeometry(0.088, 0.63, 10, 1, true)
        .rotateX(-Math.PI / 2)
        .translate(side * 0.55, 0.33, -2.54),
    );
    coreParts.push(
      new THREE.ConeGeometry(0.046, 0.39, 8, 1, true)
        .rotateX(-Math.PI / 2)
        .translate(side * 0.55, 0.33, -2.4),
    );
  }
  flameGroup.add(
    new THREE.Mesh(merge(outerParts), exhaustMaterial),
    new THREE.Mesh(merge(coreParts), coreMaterial),
  );
  flameGroup.visible = false;
  body.add(flameGroup);
  let disposed = false;
  let currentSteer = 0;
  return {
    group,
    update(dt, entity, time = 0) {
      if (disposed || !entity) return;
      group.position.set(entity.x || 0, entity.y || 0, entity.z || 0);
      group.rotation.y = entity.yaw || 0;
      roadTilt.rotation.x = -(entity.pitch || 0);
      const speed = Number.isFinite(entity.velocity)
        ? entity.velocity
        : Math.abs(entity.speed || 0);
      const steer = entity.steer || 0;
      const easing = 1 - Math.exp(-Math.max(0, dt) * 16);
      currentSteer += (steer - currentSteer) * easing;
      body.rotation.z = THREE.MathUtils.clamp(
        entity.roll || currentSteer * Math.min(speed / 42, 1) * 0.035,
        -0.09,
        0.09,
      );
      body.rotation.x =
        (entity.brake || 0) * 0.009 - (entity.boosting ? 0.006 : 0);
      body.position.y =
        speed > 0.5 ? Math.sin(time * 19) * Math.min(speed / 60, 1) * 0.005 : 0;
      for (const wheel of wheels) {
        wheel.steering.rotation.y = wheel.front ? -currentSteer * 0.47 : 0;
        wheel.rolling.rotation.x = entity.wheelSpin || 0;
      }
      if (!ghost)
        rearLights.emissiveIntensity = (entity.brake || 0) > 0.1 ? 5.5 : 1.8;
      flameGroup.visible = !!entity.boosting && !entity.finished;
      if (flameGroup.visible) {
        const flicker =
          0.86 + Math.sin(time * 83) * 0.09 + Math.sin(time * 137) * 0.05;
        exhaustMaterial.opacity = 0.65 + flicker * 0.16;
        flameGroup.children[0].scale.z = flicker;
        flameGroup.children[0].position.z = -2.225 * (1 - flicker);
        const coreLength = 0.9 + flicker * 0.1;
        flameGroup.children[1].scale.z = coreLength;
        flameGroup.children[1].position.z = -2.205 * (1 - coreLength);
      }
    },
    setColor(hex) {
      if (!ghost) paint.color.set(hex);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      const geometries = new Set();
      const materials = new Set();
      group.traverse((object) => {
        if (object.isMesh) {
          geometries.add(object.geometry);
          const list = Array.isArray(object.material)
            ? object.material
            : [object.material];
          list.forEach((mat) => materials.add(mat));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((mat) => mat.dispose());
      contactTexture?.dispose();
      group.removeFromParent();
      group.clear();
    },
  };
}
