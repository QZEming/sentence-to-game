import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { MAPS, groundAt } from "./data.js";

const TEAM_COLORS = [0x48e4d0, 0xff755e];
const NEUTRAL = 0xffd282;
const TAU = Math.PI * 2;

// Everything solid inside the perimeter comes from the same cover definitions
// as collision and bullet tracing. Scenery is built beyond the play boundary.
export function createArena(scene, mapId = "harbor") {
  const map = MAPS[mapId] || MAPS.harbor;
  const desert = map.id === "desert";
  const { halfX, halfZ } = map.bounds;
  const group = new THREE.Group();
  group.name = `arena-${map.id}`;
  scene.add(group);
  const resources = new Set();
  const coverGroups = new Map();
  const pickupGroups = new Map();
  const objectiveGroups = new Map();
  const lights = [];
  const animated = [];
  const materialCache = new Map();
  let elapsed = 0;
  let lowQuality = false;

  const keep = (resource) => {
    resources.add(resource);
    return resource;
  };
  const standard = (color, roughness = 0.8, metalness = 0.05) => {
    const key = `${color}:${roughness}:${metalness}`;
    if (!materialCache.has(key))
      materialCache.set(
        key,
        keep(new THREE.MeshStandardMaterial({ color, roughness, metalness })),
      );
    return materialCache.get(key);
  };
  const basic = (color, options = {}) =>
    keep(new THREE.MeshBasicMaterial({ color, ...options }));
  const palette = {
    concrete: standard(desert ? 0xa89880 : 0xabb8b6),
    edge: standard(desert ? 0x696258 : 0x53676c),
    boundaryDetail: standard(desert ? 0x696258 : 0x53676c, 0.81),
    dark: standard(0x263c43, 0.65, 0.25),
    steel: standard(0x839a9a, 0.5, 0.5),
    light: standard(0xd6ddd0),
    teal: standard(desert ? 0x667d72 : 0x3c7c81, 0.68, 0.3),
    coral: standard(0xb86548, 0.7, 0.2),
    yellow: standard(0xdbad53, 0.72, 0.15),
    paint: standard(0xd8d3b4),
    black: standard(0x344346),
    crate: standard(0x96724b),
    sand: standard(0xbda785),
    rock: standard(0xa77655),
  };

  palette.boundaryDetail.userData.noShadow = true;

  const makeBatch = (parent = group) => ({ parent, materials: new Map() });
  const worldBatch = makeBatch();
  const addGeometry = (geometry, material, batch = worldBatch) => {
    if (!batch.materials.has(material)) batch.materials.set(material, []);
    batch.materials.get(material).push(geometry);
  };
  const transform = (geometry, x, y, z, rx = 0, ry = 0, rz = 0) => {
    geometry.rotateX(rx);
    geometry.rotateY(ry);
    geometry.rotateZ(rz);
    geometry.translate(x, y, z);
    return geometry;
  };
  const box = (x, y, z, w, h, d, mat, batch = worldBatch, ry = 0, rz = 0) => {
    addGeometry(
      transform(new THREE.BoxGeometry(w, h, d), x, y, z, 0, ry, rz),
      mat,
      batch,
    );
  };
  const cylinder = (
    x,
    y,
    z,
    top,
    bottom,
    h,
    mat,
    batch = worldBatch,
    segments = 10,
    rz = 0,
    rx = 0,
  ) => {
    addGeometry(
      transform(
        new THREE.CylinderGeometry(top, bottom, h, segments),
        x,
        y,
        z,
        rx,
        0,
        rz,
      ),
      mat,
      batch,
    );
  };
  const flush = (batch) => {
    for (const [material, geometries] of batch.materials) {
      const merged = mergeGeometries(geometries, false);
      for (const geometry of geometries) geometry.dispose();
      if (!merged) continue;
      keep(merged);
      const mesh = new THREE.Mesh(merged, material);
      mesh.castShadow = !material.userData.noShadow;
      mesh.receiveShadow = true;
      batch.parent.add(mesh);
    }
    batch.materials.clear();
  };
  const mesh = (geometry, material, parent = group) => {
    const item = new THREE.Mesh(keep(geometry), material);
    parent.add(item);
    return item;
  };
  const canvasTexture = (width, height, draw) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext("2d"), width, height);
    const texture = keep(new THREE.CanvasTexture(canvas));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  };
  const signTexture = (
    heading,
    subtitle,
    background = "#223b43",
    accent = "#72d3c2",
  ) =>
    canvasTexture(768, 256, (ctx, width, height) => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, 12, height);
      ctx.fillStyle = "#f0efdf";
      ctx.font = "800 96px system-ui, sans-serif";
      ctx.fillText(heading, 40, 122);
      ctx.font = "500 29px system-ui, sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillStyle = accent;
      ctx.fillText(subtitle, 43, 192);
      ctx.fillRect(width - 97, 40, 53, 8);
      ctx.fillRect(width - 97, 57, 53, 8);
    });
  const placard = (texture, x, y, z, w, h, yaw = 0, parent = group) => {
    const mat = keep(
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
    );
    const item = mesh(new THREE.PlaneGeometry(w, h), mat, parent);
    item.position.set(x, y, z);
    item.rotation.y = yaw;
    return item;
  };

  // A gradient sky keeps the skyline legible even when looking up to aim.
  const skyTop = new THREE.Color(desert ? 0x729da9 : 0x759cae);
  const skyBottom = new THREE.Color(desert ? 0xe4c79e : 0xd5dfd4);
  scene.background = skyBottom.clone();
  scene.fog = new THREE.Fog(desert ? 0xd5bba0 : 0xbbd2d1, 72, 255);
  const skyMaterial = keep(
    new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: skyTop },
        bottomColor: { value: skyBottom },
      },
      vertexShader:
        "varying vec3 vDirection; void main(){vDirection=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader:
        "uniform vec3 topColor; uniform vec3 bottomColor; varying vec3 vDirection; void main(){float t=smoothstep(-.08,.72,normalize(vDirection).y);gl_FragColor=vec4(mix(bottomColor,topColor,t),1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}",
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    }),
  );
  const sky = mesh(new THREE.SphereGeometry(380, 24, 12), skyMaterial);
  sky.renderOrder = -100;
  const hemi = new THREE.HemisphereLight(
    desert ? 0xd0e7ea : 0xc8e9ed,
    desert ? 0x8c674c : 0x516260,
    2.25,
  );
  const sun = new THREE.DirectionalLight(0xffecd1, 2.8);
  sun.position.set(desert ? -37 : -32, 55, 29);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {
    left: -halfX - 8,
    right: halfX + 8,
    top: halfZ + 8,
    bottom: -halfZ - 8,
    near: 1,
    far: 130,
  });
  sun.shadow.normalBias = 0.055;
  sun.shadow.bias = -0.0002;
  const fill = new THREE.DirectionalLight(desert ? 0xbbdaea : 0xb5e0e5, 0.55);
  fill.position.set(30, 18, -40);
  group.add(hemi, sun, sun.target, fill);
  lights.push(sun);
  const sunDisc = mesh(
    new THREE.CircleGeometry(8, 32),
    basic(0xffefd0, { fog: false }),
  );
  sunDisc.position.copy(sun.position).multiplyScalar(4.1);
  sunDisc.lookAt(0, 0, 0);

  const groundTexture = canvasTexture(1024, 1024, (ctx, width, height) => {
    ctx.fillStyle = desert ? "#b7a48b" : "#8f9f9f";
    ctx.fillRect(0, 0, width, height);
    // Deterministic, fine grain; no random map assets or asynchronous loading.
    for (let i = 0; i < 14000; i++) {
      const x = (i * 613 + 73) % width,
        y = (i * 337 + 89) % height;
      ctx.fillStyle = i % 2 ? "rgba(255,255,255,.035)" : "rgba(25,38,42,.035)";
      ctx.fillRect(x, y, 2 + (i % 3), 2);
    }
    ctx.strokeStyle = desert ? "rgba(91,78,61,.24)" : "rgba(41,65,69,.22)";
    ctx.lineWidth = 3;
    ctx.strokeRect(1, 1, width - 2, height - 2);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.strokeStyle = "rgba(236,238,215,.12)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(4, 5);
    ctx.lineTo(width - 4, 5);
    ctx.stroke();
  });
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set((halfX + 3) / 4, (halfZ + 3) / 4);
  const groundMaterial = keep(
    new THREE.MeshStandardMaterial({
      map: groundTexture,
      roughness: 0.96,
      metalness: 0.02,
    }),
  );
  const ground = mesh(
    new THREE.PlaneGeometry(halfX * 2 + 6, halfZ * 2 + 6),
    groundMaterial,
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.015;
  ground.receiveShadow = true;
  box(0, -0.42, 0, halfX * 2 + 6, 0.8, halfZ * 2 + 6, palette.edge);

  // Painted arena edge and lane markings. These have no height or collision.
  for (const side of [-1, 1]) {
    box(
      side * (halfX - 0.4),
      0.005,
      0,
      0.1,
      0.01,
      halfZ * 2 - 1,
      palette.paint,
    );
    box(
      0,
      0.005,
      side * (halfZ - 0.4),
      halfX * 2 - 1,
      0.01,
      0.1,
      palette.paint,
    );
    for (let z = -halfZ + 4; z < halfZ - 2; z += 6) {
      box(
        side * (halfX - 1),
        0.007,
        z,
        0.35,
        0.012,
        1.5,
        palette.yellow,
        worldBatch,
        0.6,
      );
    }
    const spawnZ = side * (halfZ - 5);
    const spawnPaint = standard(side > 0 ? 0x68cbbd : 0xd7866a);
    box(0, 0.007, spawnZ, 12, 0.012, 0.12, spawnPaint);
    for (let x = -6; x <= 6; x += 3)
      box(x, 0.01, spawnZ + side * 0.5, 0.7, 0.015, 0.16, spawnPaint);
  }

  // Make each cover object from its authoritative collision box.
  const coverLabel = signTexture(
    desert ? "FIELD / 04" : "PORT / 04",
    desert ? "FRONTIER LOGISTICS" : "RIFTFRONT FREIGHT",
  );
  const sectorLabel = signTexture(
    desert ? "RIFT STATION" : "DOCK CONTROL",
    "AUTHORIZED OPERATORS / 04",
    desert ? "#5b5144" : "#283f45",
    desert ? "#eccb8b" : "#8ccdc3",
  );
  for (const obstacle of map.obstacles) {
    const { x, z, w, d, h } = obstacle;
    const y = obstacle.y || 0;
    let batch = worldBatch;
    let parent = group;
    if (obstacle.hp > 0) {
      parent = new THREE.Group();
      parent.name = `breakable-${obstacle.id}`;
      group.add(parent);
      coverGroups.set(obstacle.id, parent);
      batch = makeBatch(parent);
    }
    const main = obstacle.color
      ? standard(
          obstacle.color,
          0.75,
          obstacle.type === "container" ? 0.3 : 0.05,
        )
      : obstacle.type === "container"
        ? Math.round(x + z) % 2
          ? palette.teal
          : palette.coral
        : obstacle.type === "crate"
          ? palette.crate
          : palette.concrete;
    box(x, y + h / 2, z, w, h, d, main, batch);
    const boundary = w > halfX * 1.5 || d > halfZ * 1.5;
    if (boundary) {
      // Expansion joints, recessed wall panels and safety bands add depth while
      // keeping the exact boundary collision silhouette intact.
      const alongX = w > d;
      const span = alongX ? w : d;
      for (let offset = -span / 2 + 1; offset < span / 2; offset += 4.5) {
        if (alongX) {
          box(
            x + offset,
            y + h / 2,
            z,
            0.1,
            h - 0.15,
            d + 0.09,
            palette.boundaryDetail,
            batch,
          );
        } else {
          box(
            x,
            y + h / 2,
            z + offset,
            w + 0.09,
            h - 0.15,
            0.1,
            palette.boundaryDetail,
            batch,
          );
        }
      }
      box(x, y + 0.36, z, w + 0.08, 0.7, d + 0.08, palette.boundaryDetail, batch);
      box(
        x,
        y + h - 0.21,
        z,
        w + 0.12,
        0.13,
        d + 0.12,
        palette.yellow,
        batch,
      );
      const faceZ = z > 0 ? z - d / 2 - 0.015 : z + d / 2 + 0.015;
      if (alongX)
        placard(
          sectorLabel,
          0,
          y + h * 0.56,
          faceZ,
          7.2,
          2.4,
          z > 0 ? Math.PI : 0,
        );
      else
        placard(
          sectorLabel,
          x > 0 ? x - w / 2 - 0.015 : x + w / 2 + 0.015,
          y + h * 0.56,
          0,
          7.2,
          2.4,
          x > 0 ? -Math.PI / 2 : Math.PI / 2,
        );
    } else if (obstacle.type === "container") {
      // Ribs and frames are inset within the collision silhouette.
      const alongX = w > d;
      if (alongX) {
        for (let xx = -w / 2 + 0.45; xx <= w / 2 - 0.25; xx += 0.62) {
          for (const side of [-1, 1])
            box(
              x + xx,
              y + h / 2,
              z + side * (d / 2 - 0.025),
              0.05,
              h - 0.22,
              0.06,
              palette.edge,
              batch,
            );
        }
      } else {
        for (let zz = -d / 2 + 0.45; zz <= d / 2 - 0.25; zz += 0.62) {
          for (const side of [-1, 1])
            box(
              x + side * (w / 2 - 0.025),
              y + h / 2,
              z + zz,
              0.06,
              h - 0.22,
              0.05,
              palette.edge,
              batch,
            );
        }
      }
      for (const xx of [-1, 1])
        for (const zz of [-1, 1]) {
          box(
            x + xx * (w / 2 - 0.08),
            y + h / 2,
            z + zz * (d / 2 - 0.08),
            0.17,
            h,
            0.17,
            palette.light,
            batch,
          );
        }
      for (const yy of [0.08, h - 0.08]) {
        box(x, y + yy, z + d / 2 - 0.05, w, 0.13, 0.1, palette.dark, batch);
        box(x, y + yy, z - d / 2 + 0.05, w, 0.13, 0.1, palette.dark, batch);
      }
      // Locking rods, inset door panels and handles give close-range cover a
      // believable scale without protruding into the playable lanes.
      const doorZ = z - d / 2 - 0.004;
      for (const offset of [-0.24, 0.24]) {
        box(
          x + offset * Math.min(w, 3),
          y + h / 2,
          doorZ,
          0.045,
          h - 0.3,
          0.025,
          palette.steel,
          batch,
        );
        box(
          x + offset * Math.min(w, 3),
          y + h * 0.48,
          doorZ - 0.016,
          0.23,
          0.075,
          0.035,
          palette.light,
          batch,
        );
      }
      box(x, y + h / 2, doorZ, 0.025, h - 0.12, 0.022, palette.dark, batch);
      // Roof ribs also explain that these are climbable solid surfaces.
      for (let zz = -d / 2 + 0.4; zz < d / 2; zz += 0.65)
        box(
          x,
          y + h - 0.015,
          z + zz,
          w - 0.28,
          0.03,
          0.035,
          palette.edge,
          batch,
        );
      if (h > 1.6 && w > 2.5)
        placard(
          coverLabel,
          x,
          y + h * 0.58,
          z + d / 2 + 0.012,
          Math.min(2.4, w * 0.5),
          0.8,
          0,
          parent,
        );
    } else if (obstacle.type === "crate") {
      for (const side of [-1, 1]) {
        box(
          x,
          y + h * 0.25,
          z + side * (d / 2 - 0.03),
          w,
          0.11,
          0.065,
          palette.dark,
          batch,
        );
        box(
          x,
          y + h * 0.76,
          z + side * (d / 2 - 0.03),
          w,
          0.11,
          0.065,
          palette.dark,
          batch,
        );
        box(
          x + side * (w / 2 - 0.03),
          y + h / 2,
          z,
          0.065,
          h,
          0.11,
          palette.dark,
          batch,
        );
      }
      box(x, y + h - 0.02, z, w, 0.045, 0.16, palette.yellow, batch);
      box(
        x,
        y + h / 2,
        z + d / 2 + 0.004,
        Math.min(0.4, w / 3),
        Math.min(0.35, h / 3),
        0.008,
        palette.yellow,
        batch,
      );
    } else if (obstacle.type === "platform") {
      box(x, y + h - 0.045, z, w, 0.09, d, palette.dark, batch);
      for (const side of [-1, 1]) {
        box(
          x + side * (w / 2 - 0.12),
          y + h - 0.005,
          z,
          0.13,
          0.015,
          d,
          palette.yellow,
          batch,
        );
        box(
          x,
          y + h - 0.005,
          z + side * (d / 2 - 0.12),
          w,
          0.015,
          0.13,
          palette.yellow,
          batch,
        );
      }
      for (let xx = -w / 2 + 1; xx < w / 2; xx += 2.5) {
        box(
          x + xx,
          y + h / 2,
          z + d / 2 - 0.04,
          0.18,
          h - 0.15,
          0.09,
          palette.edge,
          batch,
        );
        box(
          x + xx,
          y + h / 2,
          z - d / 2 + 0.04,
          0.18,
          h - 0.15,
          0.09,
          palette.edge,
          batch,
        );
      }
    } else {
      if (h > 3.5 && w > 4 && d > 4) {
        for (const side of [-1, 1]) {
          box(
            x,
            y + h * 0.68,
            z + side * (d / 2 + 0.007),
            w * 0.76,
            0.65,
            0.012,
            palette.dark,
            batch,
          );
          for (let vent = 0; vent < 6; vent++)
            box(
              x - w * 0.3 + vent * w * 0.12,
              y + h * 0.68,
              z + side * (d / 2 + 0.014),
              0.075,
              0.65,
              0.016,
              palette.steel,
              batch,
            );
        }
      }
      box(x, y + h - 0.06, z, w, 0.12, d, palette.edge, batch);
      for (let xx = -w / 2 + 0.7; xx < w / 2; xx += 1.5) {
        box(
          x + xx,
          y + h * 0.45,
          z + d / 2 + 0.004,
          0.36,
          Math.min(0.17, h / 4),
          0.008,
          palette.yellow,
          batch,
        );
        box(
          x + xx,
          y + h * 0.45,
          z - d / 2 - 0.004,
          0.36,
          Math.min(0.17, h / 4),
          0.008,
          palette.yellow,
          batch,
        );
      }
    }
    if (obstacle.hp > 0) flush(batch);
  }

  for (const ramp of map.ramps || []) {
    const { x, z, w, d, h, axis, rise } = ramp;
    const y = ramp.y || 0;
    const corners = [
      [-w / 2, -d / 2],
      [w / 2, -d / 2],
      [w / 2, d / 2],
      [-w / 2, d / 2],
    ];
    const vertices = [];
    for (const [xx, zz] of corners) vertices.push(x + xx, y, z + zz);
    for (const [xx, zz] of corners) {
      const t = axis === "x" ? xx / w + 0.5 : zz / d + 0.5;
      vertices.push(x + xx, y + h * (rise === -1 ? 1 - t : t), z + zz);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    geometry.setIndex([
      4, 7, 6, 4, 6, 5, 0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3,
      0, 4, 3, 4, 7, 0, 3, 2, 0, 2, 1,
    ]);
    geometry.computeVertexNormals();
    geometry.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute(new Array(16).fill(0), 2),
    );
    addGeometry(geometry, palette.edge);
    const length = axis === "x" ? w : d;
    for (let step = 0.45; step < length; step += 0.85) {
      const t = step / length;
      const top = y + h * (rise === -1 ? 1 - t : t);
      const xx = x + (axis === "x" ? -w / 2 + step : 0);
      const zz = z + (axis === "z" ? -d / 2 + step : 0);
      // Thin traction strips lie directly on the authoritative slope.
      box(
        xx,
        top + 0.012,
        zz,
        axis === "x" ? 0.07 : w - 0.18,
        0.018,
        axis === "z" ? 0.07 : d - 0.18,
        palette.yellow,
      );
    }
  }

  // Maps without solid perimeter walls use a visible boundary fence.
  if (
    !map.obstacles.some(
      (cover) => cover.w > halfX * 1.5 || cover.d > halfZ * 1.5,
    )
  ) {
    const fenceMaterial = keep(
      new THREE.MeshStandardMaterial({
        color: desert ? 0x69645c : 0x536d72,
        transparent: true,
        opacity: 0.75,
        roughness: 0.8,
        side: THREE.DoubleSide,
      }),
    );
    const fenceTexture = canvasTexture(128, 128, (ctx) => {
      ctx.clearRect(0, 0, 128, 128);
      ctx.strokeStyle = "#b4c1b2";
      ctx.lineWidth = 3;
      for (let x = -128; x <= 256; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 128, 128);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - 128, 128);
        ctx.stroke();
      }
    });
    fenceTexture.wrapS = fenceTexture.wrapT = THREE.RepeatWrapping;
    fenceMaterial.map = fenceTexture;
    fenceMaterial.alphaTest = 0.35;
    fenceMaterial.transparent = false;
    for (const side of [-1, 1]) {
      for (let z = -halfZ; z <= halfZ; z += 5) {
        cylinder(
          side * (halfX + 0.38),
          1.1,
          z,
          0.065,
          0.065,
          2.2,
          palette.steel,
        );
      }
      for (let x = -halfX; x <= halfX; x += 5) {
        cylinder(
          x,
          1.1,
          side * (halfZ + 0.38),
          0.065,
          0.065,
          2.2,
          palette.steel,
        );
      }
      box(side * (halfX + 0.38), 2.04, 0, 0.08, 0.08, halfZ * 2, palette.steel);
      box(0, 2.04, side * (halfZ + 0.38), halfX * 2, 0.08, 0.08, palette.steel);
      const sideGeo = new THREE.PlaneGeometry(halfZ * 2, 1.65);
      const sideUv = sideGeo.getAttribute("uv");
      for (let i = 0; i < sideUv.count; i++)
        sideUv.setXY(i, sideUv.getX(i) * halfZ, sideUv.getY(i) * 1.6);
      addGeometry(
        transform(sideGeo, side * (halfX + 0.4), 1.16, 0, 0, Math.PI / 2),
        fenceMaterial,
      );
      const endGeo = new THREE.PlaneGeometry(halfX * 2, 1.65);
      const endUv = endGeo.getAttribute("uv");
      for (let i = 0; i < endUv.count; i++)
        endUv.setXY(i, endUv.getX(i) * halfX, endUv.getY(i) * 1.6);
      addGeometry(
        transform(endGeo, 0, 1.16, side * (halfZ + 0.4)),
        fenceMaterial,
      );
    }
  }

  if (desert) {
    const sand = mesh(new THREE.PlaneGeometry(720, 720), palette.sand);
    sand.rotation.x = -Math.PI / 2;
    sand.position.y = -0.5;
    sand.receiveShadow = true;
    // Stepped, asymmetric mesas made from low-sided rock strata.
    for (let i = 0; i < 23; i++) {
      const angle = (i / 23) * TAU;
      const distance = 94 + ((i * 37) % 61);
      const x = Math.cos(angle) * distance,
        z = Math.sin(angle) * distance;
      const width = 10 + ((i * 13) % 20),
        height = 10 + ((i * 7) % 24);
      cylinder(
        x,
        height * 0.27 - 0.5,
        z,
        width * 0.75,
        width * 1.2,
        height * 0.54,
        palette.rock,
        worldBatch,
        5 + (i % 3),
      );
      cylinder(
        x + width * 0.07,
        height * 0.7 - 0.5,
        z,
        width * 0.6,
        width * 0.78,
        height * 0.34,
        palette.sand,
        worldBatch,
        5 + (i % 3),
      );
      cylinder(
        x + width * 0.07,
        height * 0.91 - 0.5,
        z,
        width * 0.52,
        width * 0.6,
        height * 0.1,
        palette.rock,
        worldBatch,
        5 + (i % 3),
      );
    }
    const towerX = -halfX - 10,
      towerZ = -halfZ - 6;
    box(towerX, 5.2, towerZ, 7, 10.4, 7, palette.concrete);
    box(towerX, 10.5, towerZ, 9, 0.6, 9, palette.dark);
    box(
      towerX,
      8.5,
      towerZ + 3.51,
      5.7,
      1.4,
      0.05,
      standard(0x334f54, 0.25, 0.3),
    );
    cylinder(towerX, 14, towerZ, 0.16, 0.32, 7, palette.steel);
    const dishGroup = new THREE.Group();
    group.add(dishGroup);
    dishGroup.position.set(towerX, 16.4, towerZ);
    const dish = mesh(
      new THREE.SphereGeometry(2.2, 16, 8, 0, TAU, 0, 0.48 * Math.PI),
      palette.light,
      dishGroup,
    );
    dish.rotation.z = Math.PI * 0.38;
    dish.scale.y = 0.35;
    const mast = mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.8, 6),
      palette.dark,
      dishGroup,
    );
    mast.rotation.z = Math.PI * 0.38;
    mast.position.set(-0.6, 0.2, 0);
    animated.push({ object: dishGroup, speed: 0.07 });
    const signs = signTexture(
      "OUTPOST 04",
      "RESEARCH / SECURITY DIVISION",
      "#394b45",
      "#ebc078",
    );
    placard(signs, towerX, 5.8, towerZ + 3.52, 6, 2);
    for (const x of [-20, 15]) {
      const z = halfZ + 9;
      box(x, 1.8, z, 12, 3.6, 6, palette.concrete);
      box(x, 3.7, z, 12.6, 0.2, 6.6, palette.dark);
      for (let xx = -4; xx <= 4; xx += 4)
        box(x + xx, 2, z - 3.02, 2.2, 1.1, 0.04, palette.teal);
      for (const xx of [-3, 3]) box(x + xx, 4.35, z, 2, 1.1, 2, palette.edge);
    }
    // Solar arrays are outside the fence; their silhouettes do not create cover.
    for (let i = 0; i < 7; i++) {
      const x = halfX + 8 + (i % 2) * 5,
        z = -24 + i * 7;
      cylinder(x, 1.6, z, 0.15, 0.15, 3.2, palette.dark);
      box(
        x,
        3.1,
        z,
        4.2,
        0.15,
        3.2,
        standard(0x304c60, 0.28, 0.45),
        worldBatch,
        0,
        -0.3,
      );
    }
  } else {
    const waterMaterial = keep(
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          fogColor: { value: scene.fog.color },
          nearColor: { value: new THREE.Color(0x315e6c) },
        },
        vertexShader:
          "varying vec3 vWorld; void main(){vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}",
        fragmentShader:
          "uniform float time; uniform vec3 fogColor; uniform vec3 nearColor; varying vec3 vWorld; void main(){float ripple=sin(vWorld.x*.9+time*.9)*sin(vWorld.z*.68-time*.55);float band=pow(max(0.,sin(vWorld.x*.22+vWorld.z*.67+time*.65)),18.);vec3 color=nearColor+vec3(.025,.045,.047)*ripple+vec3(.13,.14,.12)*band;float fog=smoothstep(70.,240.,length(vWorld.xz));gl_FragColor=vec4(mix(color,fogColor,fog),1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}",
      }),
    );
    const water = mesh(new THREE.PlaneGeometry(720, 720), waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.48;
    animated.push({ waterMaterial });
    // Gantry cranes and ships give the small competitive space a larger context.
    for (const side of [-1, 1]) {
      const x = side * (halfX + 17),
        z = side * 13 - 8;
      for (const dz of [-9, 9]) {
        box(x, 12, z + dz, 1.5, 24, 1.5, palette.yellow);
        box(x - side * 10, 12, z + dz, 1.5, 24, 1.5, palette.yellow);
        box(x - side * 5, 1, z + dz, 12, 1.2, 3, palette.dark);
      }
      box(x - side * 2, 24.5, z, 39, 1.6, 2.1, palette.yellow);
      box(x - side * 5, 22, z, 1.2, 1.2, 20, palette.yellow);
      for (let xx = -17; xx <= 17; xx += 3) {
        box(x + xx, 26, z, 0.14, 2.4, 0.14, palette.dark);
        box(
          x + xx + 1.5,
          26,
          z,
          0.1,
          3.7,
          0.1,
          palette.dark,
          worldBatch,
          0,
          -0.9,
        );
      }
      box(x, 27.2, z, 39, 0.13, 0.2, palette.dark);
      cylinder(
        x + side * 9,
        18,
        z,
        0.025,
        0.025,
        11,
        palette.dark,
        worldBatch,
        5,
      );
      box(x + side * 9, 12.5, z, 5.5, 0.4, 2.5, palette.yellow);
      box(x - side * 7, 23, z, 3, 2.5, 3, palette.teal);
    }
    const shipX = halfX + 31,
      shipZ = -8;
    box(shipX, 1.1, shipZ, 14, 3.8, 67, palette.dark);
    box(shipX, 3.05, shipZ, 13.5, 0.2, 66, palette.light);
    for (let row = 0; row < 4; row++)
      for (let column = 0; column < 3; column++) {
        box(
          shipX - 4.4 + column * 4.4,
          4.65,
          shipZ - 22 + row * 10,
          4.1,
          3.1,
          9.5,
          column % 2 ? palette.coral : palette.teal,
        );
        if (row < 3)
          box(
            shipX - 4.4 + column * 4.4,
            7.75,
            shipZ - 22 + row * 10,
            4.1,
            3.1,
            9.5,
            column % 2 ? palette.yellow : palette.light,
          );
      }
    box(shipX, 7.5, shipZ + 24, 11.5, 9, 7, palette.light);
    box(shipX, 9.1, shipZ + 20.48, 10, 1.7, 0.05, palette.teal);
    cylinder(shipX, 15, shipZ + 25, 0.13, 0.13, 9, palette.dark);
    const warehouseZ = -halfZ - 13;
    box(-8, 5, warehouseZ, 49, 10, 13, palette.edge);
    box(-8, 10.15, warehouseZ, 51, 0.3, 15, palette.light);
    for (let x = -27; x < 16; x += 7) {
      box(x, 3.2, warehouseZ + 6.54, 5, 6.4, 0.1, palette.dark);
      box(x, 7.8, warehouseZ + 6.54, 4.2, 1, 0.1, palette.teal);
    }
    const portSign = signTexture("NORTH DOCK", "CARGO TERMINAL / SECTOR 04");
    placard(portSign, -8, 8, warehouseZ + 6.6, 10.5, 3.5);
    for (let i = 0; i < 11; i++) {
      const x = -100 + i * 17,
        z = -125 - (i % 3) * 10;
      const h = 12 + ((i * 13) % 31);
      box(x, h / 2, z, 10 + (i % 5), h, 13 + (i % 3), palette.edge);
    }
    for (let i = 0; i < 9; i++) {
      const x = -halfX - 6,
        z = -halfZ + 4 + i * 8;
      cylinder(x, 0.1, z, 0.4, 0.5, 1, palette.yellow);
      cylinder(x, 0.64, z, 0.56, 0.56, 0.15, palette.dark);
    }
  }

  // Elevated floodlights are outside the playable boundary, never fake cover.
  for (const x of [-halfX - 1.5, halfX + 1.5])
    for (const z of [-halfZ + 8, halfZ - 8]) {
      cylinder(x, 5.3, z, 0.1, 0.17, 10.6, palette.steel);
      box(x, 10.5, z, 2.5, 0.22, 0.22, palette.dark);
      for (const offset of [-0.75, 0.75]) {
        box(x + offset, 10.25, z, 0.6, 0.5, 0.4, palette.dark);
        box(
          x + offset,
          10.21,
          z + (z > 0 ? -0.205 : 0.205),
          0.48,
          0.3,
          0.015,
          palette.light,
        );
      }
    }

  // Capture points use transparent holographic graphics rather than solid props.
  for (const objective of map.objectives || []) {
    const y = groundAt(map, objective.x, objective.z) + 0.02;
    const objectiveGroup = new THREE.Group();
    objectiveGroup.name = `objective-${objective.id}`;
    group.add(objectiveGroup);
    objectiveGroup.position.set(objective.x, y, objective.z);
    const colorMaterial = basic(NEUTRAL, {
      transparent: true,
      opacity: 0.74,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const circle = mesh(
      new THREE.RingGeometry(objective.radius - 0.09, objective.radius, 64),
      colorMaterial,
      objectiveGroup,
    );
    circle.rotation.x = -Math.PI / 2;
    const progressMaterial = basic(NEUTRAL, {
      transparent: true,
      opacity: 0.96,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const progressRing = mesh(
      new THREE.RingGeometry(
        objective.radius + 0.06,
        objective.radius + 0.21,
        64,
      ),
      progressMaterial,
      objectiveGroup,
    );
    progressRing.rotation.x = -Math.PI / 2;
    progressRing.position.y = 0.012;
    progressRing.geometry.setDrawRange(0, 0);
    const center = mesh(
      new THREE.RingGeometry(0.8, 0.89, 32),
      colorMaterial,
      objectiveGroup,
    );
    center.rotation.x = -Math.PI / 2;
    center.position.y = 0.005;
    const beaconMaterial = basic(NEUTRAL, {
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const beacon = mesh(
      new THREE.CylinderGeometry(0.09, 0.36, 3.3, 12, 1, true),
      beaconMaterial,
      objectiveGroup,
    );
    beacon.position.y = 1.65;
    const letterTexture = canvasTexture(256, 256, (ctx) => {
      ctx.clearRect(0, 0, 256, 256);
      ctx.fillStyle = "#f9f4dc";
      ctx.font = "800 150px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(objective.id, 128, 129);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 7;
      ctx.strokeRect(22, 22, 212, 212);
    });
    const spriteMaterial = keep(
      new THREE.SpriteMaterial({
        map: letterTexture,
        color: NEUTRAL,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    );
    const label = new THREE.Sprite(spriteMaterial);
    label.position.y = 3.5;
    label.scale.set(1.25, 1.25, 1);
    objectiveGroup.add(label);
    objectiveGroups.set(objective.id, {
      group: objectiveGroup,
      colorMaterial,
      beaconMaterial,
      spriteMaterial,
      progressMaterial,
      progressRing,
      label,
    });
    // Ground letters are useful navigation in every mode.
    const markingMaterial = basic(desert ? 0xe5d6b4 : 0xd0d8c4, {
      map: letterTexture,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const groundLabel = mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      markingMaterial,
    );
    groundLabel.position.set(objective.x, y + 0.008, objective.z);
    groundLabel.rotation.x = -Math.PI / 2;
  }

  const pickupColors = {
    health: 0x80edb4,
    armor: 0x79b9ff,
    ammo: 0xffd57e,
    grenade: 0xf3a47c,
  };
  for (const pickup of map.pickups || []) {
    const y = groundAt(map, pickup.x, pickup.z);
    const root = new THREE.Group();
    root.name = `pickup-${pickup.id}`;
    group.add(root);
    root.position.set(pickup.x, y + 0.62, pickup.z);
    const color = pickupColors[pickup.type] || NEUTRAL;
    const mat = standard(color, 0.45, 0.3);
    const glowMat = basic(color, {
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const base = mesh(new THREE.RingGeometry(0.35, 0.48, 24), glowMat);
    base.rotation.x = -Math.PI / 2;
    base.position.set(pickup.x, y + 0.026, pickup.z);
    if (pickup.type === "health") {
      const batch = makeBatch(root);
      box(0, 0, 0, 0.48, 0.17, 0.17, mat, batch);
      box(0, 0, 0, 0.17, 0.48, 0.17, mat, batch);
      flush(batch);
    } else if (pickup.type === "armor") {
      const shield = mesh(new THREE.OctahedronGeometry(0.35, 0), mat, root);
      shield.scale.set(1, 1.25, 0.45);
    } else if (pickup.type === "ammo") {
      const batch = makeBatch(root);
      for (const x of [-0.18, 0, 0.18]) {
        cylinder(x, 0, 0, 0.065, 0.065, 0.34, mat, batch, 7);
        cylinder(x, 0.21, 0, 0, 0.065, 0.09, palette.light, batch, 7);
      }
      flush(batch);
    } else {
      const grenade = mesh(new THREE.IcosahedronGeometry(0.23, 0), mat, root);
      grenade.rotation.z = 0.2;
      const stem = mesh(
        new THREE.BoxGeometry(0.1, 0.13, 0.09),
        palette.light,
        root,
      );
      stem.position.y = 0.24;
    }
    pickupGroups.set(pickup.id, {
      group: root,
      base,
      glowMat,
      y: y + 0.62,
      offset: pickup.x * 0.41 + pickup.z * 0.37,
    });
  }
  flush(worldBatch);

  function update(dt, state) {
    elapsed += Math.min(dt || 0, 0.12);
    for (const item of animated) {
      if (item.waterMaterial) item.waterMaterial.uniforms.time.value = elapsed;
      if (item.object) item.object.rotation.y = elapsed * item.speed;
    }
    for (const obstacle of state?.obstacles || []) {
      const item = coverGroups.get(obstacle.id);
      if (item) item.visible = !obstacle.destroyed;
    }
    for (const pickup of state?.pickups || []) {
      const item = pickupGroups.get(pickup.id);
      if (!item) continue;
      item.group.visible = pickup.active;
      item.group.position.y =
        item.y + Math.sin(elapsed * 2.4 + item.offset) * 0.11;
      item.group.rotation.y = elapsed * 0.9 + item.offset;
      item.glowMat.opacity = pickup.active ? 0.7 : 0.16;
    }
    for (const objective of state?.objectives || []) {
      const item = objectiveGroups.get(objective.id);
      if (!item) continue;
      item.group.visible = state.options?.mode === "control";
      const owner = objective.owner;
      const color = owner === 0 || owner === 1 ? TEAM_COLORS[owner] : NEUTRAL;
      item.colorMaterial.color.setHex(color);
      item.beaconMaterial.color.setHex(color);
      item.spriteMaterial.color.setHex(color);
      const progress = Math.max(0, Math.min(1, objective.progress || 0));
      item.progressRing.visible = progress > 0;
      item.progressRing.geometry.setDrawRange(0, Math.ceil(progress * 64) * 6);
      item.progressMaterial.color.setHex(
        TEAM_COLORS[objective.capturing] || NEUTRAL,
      );
      item.beaconMaterial.opacity = lowQuality
        ? 0.12
        : objective.contested
          ? 0.18 + Math.sin(elapsed * 8) * 0.1
          : 0.17;
      item.colorMaterial.opacity = objective.contested
        ? 0.5 + Math.sin(elapsed * 8) * 0.25
        : 0.7;
      item.label.position.y = 3.5 + Math.sin(elapsed * 1.8) * 0.07;
    }
  }

  function setQuality(low) {
    lowQuality = !!low;
    // Keep the complete arena and vistas on every device; reduce only shadows.
    const size = low ? 1024 : 2048;
    for (const light of lights) {
      if (light.shadow.mapSize.x === size) continue;
      light.shadow.mapSize.set(size, size);
      light.shadow.map?.dispose();
      light.shadow.map = null;
      light.shadow.needsUpdate = true;
    }
  }

  function dispose() {
    scene.remove(group);
    for (const light of lights) light.shadow?.map?.dispose();
    for (const resource of resources) resource.dispose();
    resources.clear();
  }

  return { group, update, setQuality, dispose };
}
