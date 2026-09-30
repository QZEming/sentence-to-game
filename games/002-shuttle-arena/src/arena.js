import * as THREE from "three";

const PALETTE = {
  navy: 0x0b1827,
  steel: 0x24364b,
  aisle: 0x152b38,
  teal: 0x147c73,
  lime: 0xc7f564,
  coral: 0xff805d,
  white: 0xebfff4,
};

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...options });
}

function box(parent, width, height, depth, x, y, z, mat, shadow = false) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = shadow;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeTexture(width, height, draw) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  draw(context, canvas);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { texture, context, canvas };
}

function floor(parent, width, depth, x, y, z, mat) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function instances(parent, geometry, mat, placements, shadow = false) {
  const mesh = new THREE.InstancedMesh(geometry, mat, placements.length);
  const dummy = new THREE.Object3D();
  placements.forEach((placement, index) => {
    dummy.position.set(...placement.position);
    dummy.scale.set(...(placement.scale || [1, 1, 1]));
    dummy.rotation.set(...(placement.rotation || [0, 0, 0]));
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
    if (placement.color !== undefined)
      mesh.setColorAt(index, new THREE.Color(placement.color));
  });
  mesh.castShadow = shadow;
  mesh.receiveShadow = true;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  parent.add(mesh);
  return mesh;
}

function paintedLines(parent) {
  const points = [];
  const rectangle = (left, right, near, far) => {
    points.push(left, 0.017, near, right, 0.017, near, right, 0.017, far);
    points.push(left, 0.017, near, right, 0.017, far, left, 0.017, far);
  };
  const width = 0.04;
  const across = (z, extent = 3.05) =>
    rectangle(-extent, extent, z - width / 2, z + width / 2);
  const lengthwise = (x, a = -6.7, b = 6.7) =>
    rectangle(x - width / 2, x + width / 2, a, b);
  [-3.05, -2.59, 2.59, 3.05].forEach((x) => lengthwise(x));
  [-6.7, -5.94, -1.98, 1.98, 5.94, 6.7].forEach((z) => across(z));
  lengthwise(0, -6.7, -1.98);
  lengthwise(0, 1.98, 6.7);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3),
  );
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: PALETTE.white,
      side: THREE.DoubleSide,
    }),
  );
  parent.add(mesh);
}

function addBanner(
  parent,
  text,
  caption,
  accent,
  width,
  x,
  y,
  z,
  rotation = 0,
) {
  const { texture } = makeTexture(1024, 192, (ctx) => {
    ctx.fillStyle = "#132839";
    ctx.fillRect(0, 0, 1024, 192);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 13, 192);
    ctx.textAlign = "center";
    ctx.font = "900 70px Arial, sans-serif";
    ctx.fillText(text, 516, 102);
    ctx.fillStyle = "#a6b9bd";
    ctx.font = "500 26px Arial, sans-serif";
    ctx.fillText(caption, 516, 148);
  });
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, (width * 192) / 1024),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }),
  );
  mesh.position.set(x, y, z);
  mesh.rotation.y = rotation;
  parent.add(mesh);
  return mesh;
}

/** A compact, self-contained badminton venue; coordinates and sizes are in metres. */
export function createArena(scene) {
  const arena = new THREE.Group();
  arena.name = "Shuttle Arena — Court 02";
  scene.add(arena);
  const dark = material(PALETTE.navy);
  const steel = material(PALETTE.steel, { metalness: 0.35, roughness: 0.52 });
  const pale = material(PALETTE.white);
  const lime = material(PALETTE.lime, {
    emissive: PALETTE.lime,
    emissiveIntensity: 0.12,
  });
  const coral = material(PALETTE.coral);
  const aisle = material(PALETTE.aisle);
  const woodTexture = makeTexture(1024, 1024, (ctx) => {
    ctx.fillStyle = "#a77e52";
    ctx.fillRect(0, 0, 1024, 1024);
    for (let row = 0; row < 32; row += 1) {
      const lightness = 47 + ((row * 17) % 12);
      ctx.fillStyle = `hsl(34, 32%, ${lightness}%)`;
      ctx.fillRect(0, row * 32, 1024, 31);
      ctx.strokeStyle = "rgba(56, 38, 17, .18)";
      ctx.lineWidth = 1;
      for (let grain = 0; grain < 4; grain += 1) {
        ctx.beginPath();
        ctx.moveTo(0, row * 32 + 5 + grain * 7);
        ctx.bezierCurveTo(
          220,
          row * 32 + grain * 7,
          790,
          row * 32 + 11 + grain * 7,
          1024,
          row * 32 + 4 + grain * 7,
        );
        ctx.stroke();
      }
      for (let join = 0; join < 5; join += 1) {
        ctx.fillStyle = "rgba(52, 38, 24, .25)";
        ctx.fillRect((row % 3) * 97 + join * 256, row * 32, 1, 32);
      }
    }
  }).texture;
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(4, 4);
  floor(
    arena,
    36,
    35,
    0,
    -0.065,
    0,
    material(0xd7b990, { map: woodTexture, roughness: 0.68 }),
  );
  floor(arena, 28, 3.4, 0, -0.06, -9.9, aisle);
  floor(arena, 5, 24, -7.3, -0.055, 0, aisle);
  floor(arena, 5, 24, 7.3, -0.055, 0, aisle);
  floor(arena, 10.2, 17.7, 0, -0.026, 0, material(0x15584f));
  floor(arena, 9.8, 17.3, 0, -0.019, 0, material(0x1b8a73));
  floor(arena, 6.1, 13.4, 0, 0, 0, material(PALETTE.teal, { roughness: 0.96 }));
  floor(arena, 5.18, 4.72, 0, 0.004, -4.34, material(0x16847a));
  floor(arena, 5.18, 4.72, 0, 0.004, 4.34, material(0x16847a));
  paintedLines(arena);

  // Arena marks occupy the runoff zone, leaving the shuttle's play area uncluttered.
  const courtMark = makeTexture(1024, 160, (ctx) => {
    ctx.clearRect(0, 0, 1024, 160);
    ctx.fillStyle = "#b5e0ba";
    ctx.textAlign = "center";
    ctx.font = "900 74px Arial, sans-serif";
    ctx.fillText("SHUTTLE ARENA", 512, 100);
    ctx.font = "500 22px Arial, sans-serif";
    ctx.fillText("COURT 02  /  EVERY RALLY COUNTS", 512, 139);
  }).texture;
  for (const end of [-1, 1]) {
    const mark = floor(
      arena,
      4.3,
      0.68,
      0,
      0.014,
      end * 7.65,
      new THREE.MeshBasicMaterial({
        map: courtMark,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      }),
    );
    if (end < 0) mark.rotation.z = Math.PI;
  }

  // A real mesh net, with a slim white top tape and full-height posts.
  const netVertices = [];
  for (let x = -3.15; x <= 3.151; x += 0.105)
    netVertices.push(x, 0.78, 0, x, 1.51, 0);
  for (let y = 0.78; y <= 1.52; y += 0.092)
    netVertices.push(-3.15, y, 0, 3.15, y, 0);
  const netGeometry = new THREE.BufferGeometry();
  netGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(netVertices, 3),
  );
  const net = new THREE.LineSegments(
    netGeometry,
    new THREE.LineBasicMaterial({
      color: 0x1d3337,
      transparent: true,
      opacity: 0.57,
      depthWrite: false,
    }),
  );
  arena.add(net);
  box(arena, 6.37, 0.046, 0.025, 0, 1.535, 0, pale);
  box(arena, 6.34, 0.019, 0.019, 0, 0.77, 0, steel);
  const posts = [-1, 1].map((side) => ({ position: [side * 3.2, 0.775, 0] }));
  instances(
    arena,
    new THREE.CylinderGeometry(0.034, 0.042, 1.55, 10),
    lime,
    posts,
    true,
  );
  instances(
    arena,
    new THREE.BoxGeometry(0.25, 0.05, 0.32),
    steel,
    [-1, 1].map((side) => ({ position: [side * 3.2, 0.027, 0] })),
    true,
  );

  // Bleachers are batched by material. Front rows have a clear view over the court.
  const bleachers = [];
  const riserStripes = [];
  const seats = [];
  const torsos = [];
  const heads = [];
  const legs = [];
  const shirts = [
    0x83b9bd, 0xe5b975, 0xf78370, 0xc9eaaa, 0x315778, 0xd0dedb, 0x687db7,
    0xa8759b,
  ];
  const skin = [0xe8b38e, 0xb77c57, 0x87593e, 0xf2c6a5, 0xc99775];
  const placeSpectator = (x, y, z, angle, index) => {
    seats.push({
      position: [x, y + 0.29, z],
      scale: [0.46, 0.1, 0.46],
      color:
        index % 8 === 0 ? PALETTE.coral : index % 6 === 0 ? 0x3e7772 : 0x334a5b,
    });
    if ((index * 31 + 7) % 13 === 0) return;
    const variation = ((index * 17) % 11) * 0.008;
    const facingX = Math.sin(angle);
    const facingZ = Math.cos(angle);
    torsos.push({
      position: [x, y + 0.56 + variation, z],
      scale: [0.28, 0.38 + variation, 0.23],
      rotation: [0, angle, 0],
      color: shirts[(index * 7) % shirts.length],
    });
    heads.push({
      position: [x, y + 0.86 + variation * 1.5, z],
      scale: [0.11, 0.14, 0.11],
      color: skin[(index * 3) % skin.length],
    });
    for (const side of [-1, 1])
      legs.push({
        position: [
          x + Math.cos(angle) * side * 0.084 + facingX * 0.13,
          y + 0.19,
          z - Math.sin(angle) * side * 0.084 + facingZ * 0.13,
        ],
        scale: [0.087, 0.3, 0.1],
        color: 0x1f3040,
      });
  };
  let person = 0;
  for (const side of [-1, 1]) {
    for (let row = 0; row < 5; row += 1) {
      const x = side * (7.3 + row * 1.05);
      const y = 0.23 + row * 0.49;
      bleachers.push({
        position: [x, (y - 0.07) / 2, -1.7],
        scale: [1.08, y + 0.07, 19.6],
      });
      riserStripes.push({
        position: [x - side * 0.51, y - 0.095, -1.7],
        scale: [0.025, 0.047, 19.6],
      });
      for (let seat = 0; seat < 27; seat += 1) {
        if (seat === 8 || seat === 9 || seat === 20) continue;
        placeSpectator(
          x,
          y,
          -10.95 + seat * 0.71,
          side < 0 ? Math.PI / 2 : -Math.PI / 2,
          person++,
        );
      }
    }
  }
  for (let row = 0; row < 4; row += 1) {
    const y = 0.23 + row * 0.49;
    const z = -12.4 - row * 1.02;
    bleachers.push({
      position: [0, (y - 0.07) / 2, z],
      scale: [14.8, y + 0.07, 1.05],
    });
    riserStripes.push({
      position: [0, y - 0.095, z + 0.51],
      scale: [14.8, 0.047, 0.025],
    });
    for (let seat = 0; seat < 21; seat += 1) {
      if (seat === 10) continue;
      placeSpectator(-7.05 + seat * 0.705, y, z, 0, person++);
    }
  }
  instances(arena, new THREE.BoxGeometry(1, 1, 1), steel, bleachers);
  instances(
    arena,
    new THREE.BoxGeometry(1, 1, 1),
    material(0x62817e),
    riserStripes,
  );
  const detailGroup = new THREE.Group();
  arena.add(detailGroup);
  instances(
    detailGroup,
    new THREE.BoxGeometry(1, 1, 1),
    material(0xffffff),
    seats,
  );
  instances(
    detailGroup,
    new THREE.BoxGeometry(1, 1, 1),
    material(0xffffff),
    torsos,
  );
  instances(
    detailGroup,
    new THREE.IcosahedronGeometry(1, 0),
    material(0xffffff),
    heads,
  );
  instances(
    detailGroup,
    new THREE.BoxGeometry(1, 1, 1),
    material(0xffffff),
    legs,
  );

  // Retaining walls, lit architectural ribs, and a quiet dark rear backdrop.
  box(arena, 35, 6.7, 0.35, 0, 3.2, -17.2, dark);
  box(arena, 0.3, 4.9, 28, -14.3, 2.3, -3.3, dark);
  box(arena, 0.3, 4.9, 28, 14.3, 2.3, -3.3, dark);
  const ribs = [];
  const ribLights = [];
  for (let x = -15; x <= 15; x += 5) {
    ribs.push({ position: [x, 3.3, -16.94], scale: [0.15, 6.5, 0.25] });
    ribLights.push({
      position: [x + 0.12, 3.7, -16.77],
      scale: [0.035, 3.4, 0.04],
    });
  }
  instances(arena, new THREE.BoxGeometry(1, 1, 1), steel, ribs);
  instances(
    arena,
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x419783 }),
    ribLights,
  );
  addBanner(
    arena,
    "SHUTTLE ARENA",
    "PLAY THE MOMENT.",
    "#c7f564",
    6.4,
    -9.5,
    4.55,
    -16.95,
  );
  addBanner(
    arena,
    "COURT 02",
    "SENTENCE TO GAME  /  ORIGINAL SERIES",
    "#ff805d",
    5.9,
    9.65,
    4.55,
    -16.95,
  );

  // Low courtside advertising has no collision or impact on playable boundaries.
  for (const side of [-1, 1]) {
    for (const z of [-5, 4.8]) {
      const banner = new THREE.Group();
      banner.position.set(side * 5.85, 0, z);
      banner.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
      arena.add(banner);
      box(banner, 4.1, 0.64, 0.1, 0, 0.33, 0, dark);
      addBanner(
        banner,
        z < 0 ? "FEEL THE RALLY" : "FLY HIGH.",
        "SHUTTLE ARENA   /   002",
        z < 0 ? "#c7f564" : "#ff805d",
        3.94,
        0,
        0.34,
        0.056,
      );
    }
  }

  // Suspended fixtures: no opaque ceiling, so the camera retains a clean court view.
  const trusses = [];
  const fixtures = [];
  const lightPanels = [];
  const hangers = [];
  for (const z of [-8.6, 0, 8.6]) {
    trusses.push({ position: [0, 9.4, z], scale: [27.8, 0.12, 0.14] });
    trusses.push({ position: [0, 9.78, z], scale: [27.8, 0.08, 0.08] });
    for (const x of [-14, 14])
      hangers.push({ position: [x, 4.9, z], scale: [0.17, 9.8, 0.17] });
    for (const x of [-5.8, 5.8]) {
      fixtures.push({ position: [x, 9.19, z], scale: [2.05, 0.21, 0.58] });
      lightPanels.push({ position: [x, 9.076, z], scale: [1.83, 0.016, 0.42] });
    }
    for (let x = -13; x < 14; x += 1.5) {
      trusses.push({
        position: [x, 9.59, z],
        scale: [0.042, 0.56, 0.042],
        rotation: [0, 0, Math.PI / 4],
      });
    }
  }
  const overhead = new THREE.Group();
  arena.add(overhead);
  instances(overhead, new THREE.BoxGeometry(1, 1, 1), steel, trusses);
  instances(overhead, new THREE.BoxGeometry(1, 1, 1), dark, hangers);
  instances(overhead, new THREE.BoxGeometry(1, 1, 1), dark, fixtures);
  instances(
    overhead,
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xfff8e6 }),
    lightPanels,
  );

  // Umpire chair and equipment boxes sit outside the sideline.
  const chairFrame = [];
  for (const dx of [-0.24, 0.24]) {
    for (const dz of [-0.3, 0.3])
      chairFrame.push({
        position: [-4.03 + dx, 0.8, dz],
        scale: [0.045, 1.6, 0.045],
      });
  }
  for (let rung = 0; rung < 4; rung += 1)
    chairFrame.push({
      position: [-4.03, 0.24 + rung * 0.34, 0.3],
      scale: [0.48, 0.04, 0.05],
    });
  instances(arena, new THREE.BoxGeometry(1, 1, 1), pale, chairFrame);
  box(arena, 0.68, 0.12, 0.72, -4.03, 1.63, 0, steel);
  box(arena, 0.1, 0.48, 0.72, -4.36, 1.88, 0, coral);
  box(arena, 1.65, 0.38, 0.55, 4.45, 0.19, 3.1, steel);
  box(arena, 1.72, 0.09, 0.62, 4.45, 0.425, 3.1, coral);
  box(arena, 0.58, 0.32, 0.58, 4.35, 0.16, 4.2, dark);
  instances(
    arena,
    new THREE.CylinderGeometry(0.06, 0.07, 0.25, 8),
    lime,
    [0, 1, 2].map((i) => ({ position: [4.2 + i * 0.14, 0.48, 4.2] })),
  );

  const scoreSurface = makeTexture(1400, 420, () => {});
  const scoreboard = new THREE.Group();
  scoreboard.position.set(0, 5.15, -16.72);
  arena.add(scoreboard);
  box(scoreboard, 9.2, 2.98, 0.22, 0, 0, -0.1, steel);
  box(scoreboard, 9.4, 0.06, 0.28, 0, 1.52, -0.06, lime);
  box(scoreboard, 9.4, 0.035, 0.28, 0, -1.52, -0.06, coral);
  const scorePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(8.9, 2.67),
    new THREE.MeshBasicMaterial({ map: scoreSurface.texture }),
  );
  scorePlane.position.z = 0.02;
  scoreboard.add(scorePlane);
  let lastScoreKey = "";
  const scorePair = (value) => {
    if (Array.isArray(value)) return [value[0] || 0, value[1] || 0];
    if (value && typeof value === "object")
      return [
        value.player ?? value.you ?? value.home ?? 0,
        value.ai ?? value.opponent ?? value.away ?? 0,
      ];
    return [0, 0];
  };
  function updateScore(state) {
    const score = scorePair(state.score || state.scores);
    const games = scorePair(state.games || state.sets);
    const server = state.server;
    const key = `${score.join(":")}/${games.join(":")}/${server}`;
    if (key === lastScoreKey) return;
    lastScoreKey = key;
    const ctx = scoreSurface.context;
    ctx.fillStyle = "#081521";
    ctx.fillRect(0, 0, 1400, 420);
    ctx.fillStyle = "#6d9295";
    ctx.textAlign = "center";
    ctx.font = "600 29px Arial, sans-serif";
    ctx.fillText("SHUTTLE ARENA     /     COURT 02", 700, 53);
    ctx.fillStyle = "#19333d";
    ctx.fillRect(68, 80, 1264, 2);
    ctx.fillRect(699, 108, 2, 220);
    ctx.font = "700 31px Arial, sans-serif";
    ctx.fillStyle = "#c7f564";
    ctx.fillText("YOU", 359, 134);
    ctx.fillStyle = "#ff805d";
    ctx.fillText("RIVAL", 1041, 134);
    ctx.font = "900 154px Arial, sans-serif";
    ctx.fillStyle = "#effcf1";
    ctx.fillText(String(score[0]).padStart(2, "0"), 359, 291);
    ctx.fillText(String(score[1]).padStart(2, "0"), 1041, 291);
    ctx.font = "600 23px Arial, sans-serif";
    ctx.fillStyle = "#89a4aa";
    ctx.fillText(`GAMES  ${games[0]}`, 359, 345);
    ctx.fillText(`GAMES  ${games[1]}`, 1041, 345);
    ctx.fillStyle = "#284751";
    ctx.fillRect(68, 365, 1264, 2);
    ctx.font = "500 20px Arial, sans-serif";
    ctx.fillStyle = "#75979b";
    ctx.fillText("ONE SENTENCE.  ENDLESS POSSIBILITIES.", 700, 397);
    if (server !== undefined && server !== null) {
      const isPlayer =
        server === 0 ||
        server === "player" ||
        server === "you" ||
        server === "home";
      ctx.fillStyle = isPlayer ? "#c7f564" : "#ff805d";
      ctx.beginPath();
      ctx.arc(isPlayer ? 267 : 930, 124, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    scoreSurface.texture.needsUpdate = true;
  }

  // Point celebrations affect only trim, never the lighting of a live rally.
  const trimMaterial = new THREE.MeshBasicMaterial({ color: PALETTE.lime });
  const trimPositions = [-1, 1].map((side) => ({
    position: [side * 5.12, 0.023, 0],
    scale: [0.025, 0.025, 17.7],
  }));
  instances(arena, new THREE.BoxGeometry(1, 1, 1), trimMaterial, trimPositions);
  let celebrationEnd = -Infinity;
  let clock = 0;
  updateScore({});

  return {
    update(time, state = {}) {
      clock = time;
      updateScore(state);
      if (clock < celebrationEnd) {
        const pulse = 0.6 + Math.sin((celebrationEnd - clock) * 18) * 0.4;
        trimMaterial.color.lerpColors(
          new THREE.Color(PALETTE.white),
          new THREE.Color(trimMaterial.userData.pointColor || PALETTE.lime),
          pulse,
        );
      } else {
        trimMaterial.color.setHex(PALETTE.lime);
      }
    },
    flashPoint(side) {
      trimMaterial.userData.pointColor =
        side === "player" || side === 0 || side === "you"
          ? PALETTE.lime
          : PALETTE.coral;
      celebrationEnd = clock + 1.4;
    },
    setQuality(low) {
      // Keep the instanced crowd visible; remove overhead details on small GPUs.
      overhead.visible = !low;
      net.material.opacity = low ? 0.35 : 0.57;
    },
  };
}
