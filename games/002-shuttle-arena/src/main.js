import * as THREE from "three";
import "./styles.css";
import { createArena } from "./arena.js";
import { createAthlete, createShuttle } from "./athlete.js";
import { createMatch, stepMatch } from "./game.js";
import { createUI } from "./ui.js";
import { createAudio } from "./audio.js";

const canvas = document.querySelector("#game-canvas");
const sound = createAudio();
let mode = "loading";
let match = createMatch({ mode: "quick", difficulty: "normal", assist: true });
let demo = createMatch({ mode: "training", difficulty: "easy", assist: true });
let activeOptions = { mode: "quick", difficulty: "normal", assist: true };
let cameraMode = 0;
let visualTime = 0;
let accumulator = 0;
let lastTime = performance.now();
let lastPhase = "";
let matchRecorded = false;
let aimX = 0;
let aimDepth = 0;
let pendingShot = null;
let pendingServe = false;
let pendingContinue = false;
let shake = 0;
const keys = new Set();
const pointers = new Map();
const record = { wins: 0, matches: 0, bestRally: 0 };
try {
  const saved = JSON.parse(
    localStorage.getItem("shuttle-arena-record-v1") || "{}",
  );
  for (const key of Object.keys(record))
    if (Number.isFinite(saved[key])) record[key] = Math.max(0, saved[key]);
} catch {}

const ui = createUI({
  onStart: (options) => start(options),
  onPause: pause,
  onResume: resume,
  onRestart: () => start(activeOptions),
  onMenu: showMenu,
  onContinue: () => {
    pendingContinue = true;
    mode = "playing";
    ui.setMode(mode);
    lastTime = performance.now();
  },
  onSound: () => ui.setSound(sound.toggle()),
  onCamera: toggleCamera,
  onAssist: (enabled) => setAssist(enabled),
  onShot: (shot) => queueShot(shot),
  onServe: () => {
    if (mode === "playing") {
      pendingServe = true;
      sound.unlock();
    }
  },
  onAim: (delta) => {
    aimX = THREE.MathUtils.clamp(aimX + delta * 0.38, -1, 1);
  },
});

let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
} catch {
  ui.showError(
    "浏览器暂时无法开启 3D 球场。请使用支持 WebGL 的现代浏览器，并开启硬件加速。",
  );
  throw new Error("WebGL unavailable");
}
renderer.setPixelRatio(
  Math.min(devicePixelRatio, innerWidth < 700 ? 1.4 : 1.7),
);
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#0b1923");
scene.fog = new THREE.Fog("#0b1923", 33, 75);
const camera = new THREE.PerspectiveCamera(
  43,
  innerWidth / innerHeight,
  0.1,
  100,
);
scene.add(new THREE.HemisphereLight("#e5fff6", "#334044", 1.8));
const keyLight = new THREE.DirectionalLight("#fff0da", 3);
keyLight.position.set(-6, 16, 7);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
Object.assign(keyLight.shadow.camera, {
  left: -11,
  right: 11,
  top: 12,
  bottom: -12,
  near: 1,
  far: 40,
});
keyLight.shadow.bias = -0.0005;
keyLight.shadow.normalBias = 0.035;
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight("#87e8ff", 1.1);
fillLight.position.set(7, 9, -9);
scene.add(fillLight);
const arena = createArena(scene);
const athletes = [
  createAthlete({ color: "#25b6a6", accent: "#e7fa84", skin: "#d7a27f" }),
  createAthlete({ color: "#ef795f", accent: "#fff0db", skin: "#bc886a" }),
];
for (const athlete of athletes) scene.add(athlete.group);
const shuttle = createShuttle();
scene.add(shuttle.group);

const markerMaterial = new THREE.MeshBasicMaterial({
  color: "#e3fa89",
  transparent: true,
  opacity: 0.75,
  depthWrite: false,
});
function ring(radius, thickness, material) {
  const mesh = new THREE.Mesh(
    new THREE.RingGeometry(radius - thickness, radius, 48),
    material,
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.025;
  scene.add(mesh);
  return mesh;
}
const aimMarker = ring(0.37, 0.065, markerMaterial);
const landingMarker = ring(
  0.43,
  0.035,
  new THREE.MeshBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  }),
);
const playerHalo = ring(
  0.63,
  0.065,
  new THREE.MeshBasicMaterial({
    color: "#d9f877",
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  }),
);
const ballShadow = new THREE.Mesh(
  new THREE.CircleGeometry(0.12, 24),
  new THREE.MeshBasicMaterial({
    color: "#052e29",
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  }),
);
ballShadow.rotation.x = -Math.PI / 2;
scene.add(ballShadow);
const trailCount = 28;
const trailPositions = new Float32Array(trailCount * 3);
const trailGeometry = new THREE.BufferGeometry();
trailGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(trailPositions, 3),
);
const trail = new THREE.Line(
  trailGeometry,
  new THREE.LineBasicMaterial({
    color: "#d6ffd3",
    transparent: true,
    opacity: 0.4,
  }),
);
trail.frustumCulled = false;
scene.add(trail);
const particles = Array.from({ length: 90 }, () => ({
  life: 0,
  velocity: new THREE.Vector3(),
}));
const particlePositions = new Float32Array(particles.length * 3);
const particleColors = new Float32Array(particles.length * 3);
for (let i = 0; i < particles.length; i++) particlePositions[i * 3 + 1] = -100;
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(particlePositions, 3),
);
particleGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(particleColors, 3),
);
const particleMesh = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({
    size: 0.07,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  }),
);
particleMesh.frustumCulled = false;
scene.add(particleMesh);
let particleCursor = 0;
function burst(position, color = "#e7fa84", count = 14) {
  const c = new THREE.Color(color);
  for (let n = 0; n < count; n++) {
    const i = particleCursor++ % particles.length;
    particles[i].life = 0.3 + Math.random() * 0.35;
    particles[i].velocity.set(
      (Math.random() - 0.5) * 3,
      Math.random() * 2,
      (Math.random() - 0.5) * 3,
    );
    particlePositions.set([position.x, position.y, position.z], i * 3);
    particleColors.set([c.r, c.g, c.b], i * 3);
  }
  particleGeometry.attributes.color.needsUpdate = true;
}
function resetTrail() {
  for (let i = 0; i < trailCount; i++)
    trailPositions.set(
      [match.shuttle.x, match.shuttle.y, match.shuttle.z],
      i * 3,
    );
}

function clearInput() {
  keys.clear();
  pointers.clear();
  pendingShot = null;
  pendingServe = false;
  pendingContinue = false;
  for (const button of document.querySelectorAll("[data-control]"))
    button.classList.remove("pressed");
}
function saveRecord() {
  record.bestRally = Math.max(record.bestRally, match.longestRally || 0);
  try {
    localStorage.setItem("shuttle-arena-record-v1", JSON.stringify(record));
  } catch {}
}
function start(options = activeOptions) {
  saveRecord();
  activeOptions = { ...activeOptions, ...options };
  match = createMatch(activeOptions);
  lastPhase = match.phase;
  matchRecorded = false;
  mode = "playing";
  accumulator = 0;
  lastTime = performance.now();
  aimX = aimDepth = 0;
  clearInput();
  resetTrail();
  ui.setMode(mode);
  ui.update({ ...match, record });
  sound.unlock();
  ui.toast(
    activeOptions.mode === "training"
      ? "自由训练：对手会喂球，试试三种击球。"
      : "按空格发球，把第一分握在手里。",
    "info",
  );
  updateCamera(1, true);
  document.activeElement?.blur();
}
function pause() {
  if (mode !== "playing") return;
  mode = "paused";
  clearInput();
  ui.setMode(mode);
}
function resume() {
  if (mode !== "paused") return;
  clearInput();
  lastTime = performance.now();
  accumulator = 0;
  mode = "playing";
  ui.setMode(mode);
}
function showMenu() {
  saveRecord();
  clearInput();
  mode = "menu";
  demo = createMatch({ mode: "training", difficulty: "easy", assist: true });
  accumulator = 0;
  lastTime = performance.now();
  ui.setMode(mode);
  updateCamera(1, true);
}
function setAssist(enabled) {
  match.options.assist = Boolean(enabled);
  activeOptions.assist = Boolean(enabled);
  if (mode === "playing")
    ui.toast(
      enabled ? "辅助步伐开启 · 专注击球时机" : "手动步伐 · 用 WASD 移动接球",
      "info",
    );
}
function toggleCamera() {
  cameraMode = (cameraMode + 1) % 2;
  ui.setCamera(cameraMode ? "转播视角" : "底线视角");
}
function queueShot(shot) {
  if (mode !== "playing") return;
  if (match.phase === "serve") pendingServe = true;
  else pendingShot = shot;
  sound.unlock();
}

const moves = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "back",
  ArrowDown: "back",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  ShiftLeft: "sprint",
  ShiftRight: "sprint",
};
function held(action) {
  return (
    [...pointers.values()].includes(action) ||
    Object.entries(moves).some(
      ([code, control]) => control === action && keys.has(code),
    )
  );
}
window.addEventListener("keydown", (event) => {
  if (
    mode === "playing" &&
    (moves[event.code] ||
      ["Space", "KeyJ", "KeyK", "KeyQ", "KeyE"].includes(event.code))
  )
    event.preventDefault();
  keys.add(event.code);
  if (event.repeat) return;
  if (event.code === "Space") {
    if (mode === "gameOver") {
      pendingContinue = true;
      mode = "playing";
      ui.setMode(mode);
      lastTime = performance.now();
    } else queueShot("clear");
  }
  if (event.code === "KeyJ") queueShot("drop");
  if (event.code === "KeyK") queueShot("smash");
  if (event.code === "KeyP" || event.code === "Escape")
    mode === "playing" ? pause() : resume();
  if (
    event.code === "KeyR" &&
    ["playing", "paused", "gameOver", "matchOver"].includes(mode)
  )
    start(activeOptions);
  if (event.code === "KeyC") toggleCamera();
  if (event.code === "KeyM") ui.setSound(sound.toggle());
  if (event.code === "KeyH" && mode === "playing")
    setAssist(!match.options.assist);
});
window.addEventListener("keyup", (event) => keys.delete(event.code));
window.addEventListener("blur", () => {
  clearInput();
  pause();
});
window.addEventListener("pagehide", saveRecord);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
});
for (const button of document.querySelectorAll("[data-control]")) {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (mode !== "playing") return;
    button.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, button.dataset.control);
    button.classList.add("pressed");
  });
  const release = (event) => {
    pointers.delete(event.pointerId);
    button.classList.toggle(
      "pressed",
      [...pointers.values()].includes(button.dataset.control),
    );
  };
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
}
const raycaster = new THREE.Raycaster();
const courtPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const pointer = new THREE.Vector2();
const intersection = new THREE.Vector3();
canvas.addEventListener("pointerdown", (event) => {
  if (mode !== "playing") return;
  pointer.set(
    (event.clientX / innerWidth) * 2 - 1,
    1 - (event.clientY / innerHeight) * 2,
  );
  raycaster.setFromCamera(pointer, camera);
  if (
    raycaster.ray.intersectPlane(courtPlane, intersection) &&
    intersection.z < -0.25 &&
    intersection.z > -7.5
  ) {
    const shot = match.players[0].swingType || "clear";
    const baseDepth = shot === "drop" ? 1.75 : shot === "smash" ? 4.3 : 5.1;
    const depthRange = shot === "drop" ? 0.9 : 1.25;
    aimX = THREE.MathUtils.clamp(intersection.x / 2.14, -1, 1);
    aimDepth = THREE.MathUtils.clamp(
      (-intersection.z - baseDepth) / depthRange,
      -1,
      1,
    );
  }
});

function processEvents(events) {
  for (const event of events) {
    sound.play(event.type, event);
    if (event.type === "hit") {
      burst(
        event.position || match.shuttle,
        event.side === 0 ? "#e7fa84" : "#ffaf91",
        event.shot === "smash" ? 24 : 10,
      );
      if (event.shot === "smash") shake = 0.3;
      if (event.side === 0 && event.quality === "完美")
        ui.toast(event.shot === "smash" ? "完美杀球！" : "完美击球", "success");
    }
    if (event.type === "miss") ui.toast("挥空了，再靠近球一些。", "warning");
    if (event.type === "point") {
      arena.flashPoint(event.winner);
      ui.toast(
        `${event.winner === 0 ? "你得分" : "对手得分"} · ${event.reason || match.reason}`,
        event.winner === 0 ? "success" : "warning",
      );
      saveRecord();
    }
  }
  if (match.phase !== lastPhase) {
    if (match.phase === "gameOver") {
      mode = "gameOver";
      clearInput();
      ui.setMode(mode, { ...match, record });
    }
    if (match.phase === "matchOver") {
      if (!matchRecorded) {
        record.matches++;
        if (match.winner === 0) record.wins++;
        matchRecorded = true;
        saveRecord();
      }
      mode = "matchOver";
      clearInput();
      ui.setMode(mode, { ...match, record });
    }
    if (match.phase === "serve") resetTrail();
    lastPhase = match.phase;
  }
}

const desiredCamera = new THREE.Vector3();
const cameraTarget = new THREE.Vector3();
const targetSmooth = new THREE.Vector3();
function updateCamera(dt, snap = false) {
  const mobile = innerWidth < 700 && innerHeight > innerWidth;
  if (mode === "menu" || mode === "loading") {
    desiredCamera.set(
      (mobile ? 10 : 12) * (cameraMode ? -1 : 1),
      mobile ? 16 : 13,
      mobile ? 22 : 18,
    );
    cameraTarget.set(mobile ? 0 : -3.8, mobile ? -3.5 : 0.4, mobile ? -0.5 : 0);
  } else if (cameraMode === 1) {
    desiredCamera.set(mobile ? 6 : 13, mobile ? 18 : 14, mobile ? 27 : 20);
    cameraTarget.set(0, 2, 0);
  } else {
    desiredCamera.set(mobile ? 0 : 0.4, mobile ? 18 : 14, mobile ? 27 : 21);
    cameraTarget.set(0, 2, mobile ? 0.7 : -0.5);
  }
  const blend = snap ? 1 : 1 - Math.exp(-dt * 4);
  camera.position.lerp(desiredCamera, blend);
  targetSmooth.lerp(cameraTarget, blend);
  if (shake > 0 && mode === "playing")
    camera.position.x += (Math.random() - 0.5) * shake * 0.12;
  camera.lookAt(targetSmooth);
  camera.fov = mobile
    ? 46
    : innerWidth / innerHeight > 2
      ? 52
      : mode === "menu"
        ? 43
        : 48;
  camera.updateProjectionMatrix();
}
let hudTimer = 0;
let graphicsLow = false;
let frameTotal = 0;
let frameCount = 0;
function animate(now) {
  requestAnimationFrame(animate);
  const elapsed = Math.max(0, (now - lastTime) / 1000);
  const dt = Math.min(elapsed, 0.12);
  lastTime = now;
  const running = mode === "playing" || mode === "menu";
  if (running) visualTime += dt;
  if (running) {
    accumulator += dt;
    if (mode === "playing")
      aimX = THREE.MathUtils.clamp(
        aimX +
          ((keys.has("KeyE") ? 1 : 0) - (keys.has("KeyQ") ? 1 : 0)) * dt * 1.6,
        -1,
        1,
      );
    while (accumulator >= 1 / 120 && (mode === "playing" || mode === "menu")) {
      if (mode === "menu") {
        stepMatch(
          demo,
          {
            shot: demo.canHit ? "clear" : null,
            serve: true,
            continue: true,
            aimX: Math.sin(visualTime * 0.2) * 0.45,
          },
          1 / 120,
        );
      } else {
        const controls = {
          moveX: (held("right") ? 1 : 0) - (held("left") ? 1 : 0),
          moveZ: (held("back") ? 1 : 0) - (held("forward") ? 1 : 0),
          sprint: held("sprint"),
          shot: pendingShot,
          serve: pendingServe,
          continue: pendingContinue,
          aimX,
          aimDepth,
        };
        pendingShot = null;
        pendingServe = false;
        pendingContinue = false;
        processEvents(stepMatch(match, controls, 1 / 120));
      }
      accumulator -= 1 / 120;
    }
  }
  const current = mode === "menu" || mode === "loading" ? demo : match;
  for (let i = 0; i < athletes.length; i++) {
    const player = current.players[i];
    const athlete = athletes[i];
    athlete.group.position.set(player.x, 0, player.z);
    athlete.group.rotation.y = i === 0 ? Math.PI : 0;
    athlete.update(running ? dt : 0, {
      speed: player.movement || 0,
      swing: player.swing || 0,
      shot: player.swingType || "clear",
      time: visualTime,
      serving: current.phase === "serve" && current.server === i,
      winner: mode === "matchOver" && match.winner === i,
      energy: player.energy,
    });
  }
  const ball = current.shuttle;
  shuttle.group.position.set(ball.x, ball.y, ball.z);
  shuttle.group.visible = current.phase !== "point" || current.pointTimer > 0.4;
  shuttle.update(running ? dt : 0, {
    vx: ball.vx,
    vy: ball.vy,
    vz: ball.vz,
    time: visualTime,
  });
  const activeBall = current.phase === "rally" && ball.active;
  trail.visible = activeBall;
  if (running) {
    for (let i = trailCount - 1; i > 0; i--) {
      for (let axis = 0; axis < 3; axis++)
        trailPositions[i * 3 + axis] = trailPositions[(i - 1) * 3 + axis];
    }
    trailPositions.set([ball.x, ball.y, ball.z], 0);
    trailGeometry.attributes.position.needsUpdate = true;
  }
  ballShadow.position.set(ball.x, 0.025, ball.z);
  ballShadow.visible = shuttle.group.visible;
  ballShadow.scale.setScalar(1 + Math.min(ball.y, 8) * 0.09);
  aimMarker.position.set(current.target?.x ?? 0, 0.03, current.target?.z ?? -4);
  aimMarker.visible = mode === "playing";
  aimMarker.scale.setScalar(1 + Math.sin(visualTime * 4) * 0.07);
  landingMarker.visible =
    mode === "playing" &&
    activeBall &&
    ball.lastHit === 1 &&
    Boolean(current.landing);
  if (current.landing)
    landingMarker.position.set(current.landing.x, 0.027, current.landing.z);
  playerHalo.position.set(current.players[0].x, 0.032, current.players[0].z);
  playerHalo.visible = mode === "playing" && current.canHit;
  playerHalo.scale.setScalar(1 + Math.sin(visualTime * 12) * 0.07);
  arena.update(visualTime, current);
  for (let i = 0; i < particles.length; i++) {
    if (!running || particles[i].life <= 0) continue;
    particles[i].life -= dt;
    particles[i].velocity.y -= dt * 4;
    particlePositions[i * 3] += particles[i].velocity.x * dt;
    particlePositions[i * 3 + 1] += particles[i].velocity.y * dt;
    particlePositions[i * 3 + 2] += particles[i].velocity.z * dt;
    if (particles[i].life <= 0) particlePositions[i * 3 + 1] = -100;
  }
  particleGeometry.attributes.position.needsUpdate = true;
  shake = Math.max(0, shake - dt);
  updateCamera(dt);
  hudTimer += dt;
  if (hudTimer >= 0.07) {
    ui.update({ ...match, record });
    hudTimer = 0;
  }
  renderer.render(scene, camera);
  // Reduce rendering cost automatically on phones and software WebGL renderers.
  if (!graphicsLow && elapsed > 0 && elapsed < 1) {
    frameTotal += elapsed;
    frameCount++;
    if (frameCount >= 70 && frameTotal / frameCount > 0.044) {
      graphicsLow = true;
      renderer.setPixelRatio(1);
      keyLight.shadow.mapSize.set(512, 512);
      keyLight.shadow.map?.dispose();
      keyLight.shadow.map = null;
      arena.setQuality(true);
    }
  }
}
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  renderer.setSize(innerWidth, innerHeight);
  updateCamera(1, true);
});
canvas.addEventListener("webglcontextlost", (event) => {
  event.preventDefault();
  pause();
  ui.showError("3D 球场暂时中断，请刷新页面重新进入。");
});
mode = "menu";
ui.setMode(mode);
ui.setSound(true);
ui.setCamera("底线视角");
updateCamera(1, true);
requestAnimationFrame(animate);

if (import.meta.env.DEV) {
  window.__shuttle = {
    get state() {
      return structuredClone({ ...match, mode, record });
    },
    get rendererInfo() {
      return {
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        lowQuality: graphicsLow,
      };
    },
  };
}
