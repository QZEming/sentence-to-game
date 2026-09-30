import * as THREE from "three";
import "./styles.css";
import { createWorld } from "./world.js";
import { createRider } from "./rider.js";
import { createUI } from "./ui.js";
import { createAudio } from "./audio.js";
import { getTrackFrame, TRACK_LENGTH, ROAD_HEIGHT } from "./track.js";
import { createGameState, stepGame, TARGET_FISH } from "./game.js";

const input = {
  forward: false,
  brake: false,
  left: false,
  right: false,
  jump: false,
  boost: false,
};
const heldKeys = new Set();
const touchPointers = new Map();
let jumpQueued = false;
let mode = "loading";
let state = createGameState();
let best = 0;
let cameraMode = 0;
let simulationTime = 0;
let menuTime = 0;
let impact = 0;
let accumulator = 0;
const sound = createAudio();
try {
  best = Number(localStorage.getItem("pelican-pedal-best") || 0);
} catch {}

const ui = createUI({
  onStart: () => start(false),
  onFreeRide: () => start(true),
  onRestart: () => start(state.freeRide),
  onPause: () => pause(),
  onResume: () => resume(),
  onSound: () => ui.setSound(sound.toggle()),
  onCamera: () => toggleCamera(),
});

let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#game-canvas"),
    antialias: true,
    powerPreference: "high-performance",
  });
} catch {
  ui.showError(
    "浏览器暂时无法开启 3D 画面。请开启硬件加速，或使用支持 WebGL 的新版浏览器。",
  );
  throw new Error("WebGL is unavailable");
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#a9dfdf");
scene.fog = new THREE.Fog("#b0e1de", 170, 520);
const camera = new THREE.PerspectiveCamera(
  46,
  innerWidth / innerHeight,
  0.1,
  950,
);
const hemi = new THREE.HemisphereLight("#fff5dc", "#5b9b98", 2.5);
scene.add(hemi);
const sun = new THREE.DirectionalLight("#fff2d4", 3.8);
sun.position.set(-75, 115, 70);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -45;
sun.shadow.camera.right = 45;
sun.shadow.camera.top = 45;
sun.shadow.camera.bottom = -45;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 250;
sun.shadow.bias = -0.0005;
sun.shadow.normalBias = 0.06;
scene.add(sun, sun.target);

const world = createWorld(scene);
const rider = createRider();
scene.add(rider.group);

// A soft contact shadow keeps the rider connected to the ground during jumps.
const shadowCanvas = document.createElement("canvas");
shadowCanvas.width = shadowCanvas.height = 64;
const shadowContext = shadowCanvas.getContext("2d");
const gradient = shadowContext.createRadialGradient(32, 32, 0, 32, 32, 32);
gradient.addColorStop(0, "rgba(11,60,54,.36)");
gradient.addColorStop(1, "rgba(11,60,54,0)");
shadowContext.fillStyle = gradient;
shadowContext.fillRect(0, 0, 64, 64);
const shadow = new THREE.Mesh(
  new THREE.PlaneGeometry(3.6, 5),
  new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(shadowCanvas),
    transparent: true,
    depthWrite: false,
  }),
);
shadow.rotation.x = -Math.PI / 2;
scene.add(shadow);

const particleCount = 180;
const particlePositions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);
const particles = Array.from({ length: particleCount }, () => ({
  life: 0,
  velocity: new THREE.Vector3(),
}));
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
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  }),
);
particleMesh.frustumCulled = false;
scene.add(particleMesh);
let particleCursor = 0;
for (let i = 0; i < particleCount; i++) particlePositions[i * 3 + 1] = -100;
function burst(position, color = "#ffd66e", count = 16) {
  const c = new THREE.Color(color);
  for (let j = 0; j < count; j++) {
    const i = particleCursor++ % particleCount;
    particles[i].life = 0.5 + Math.random() * 0.5;
    particles[i].velocity.set(
      (Math.random() - 0.5) * 7,
      2 + Math.random() * 6,
      (Math.random() - 0.5) * 7,
    );
    particlePositions.set([position.x, position.y + 1.4, position.z], i * 3);
    particleColors.set([c.r, c.g, c.b], i * 3);
  }
  particleGeometry.attributes.color.needsUpdate = true;
}

function clearInput() {
  heldKeys.clear();
  touchPointers.clear();
  jumpQueued = false;
  for (const key of Object.keys(input)) input[key] = false;
  for (const button of document.querySelectorAll("[data-control]"))
    button.classList.remove("pressed");
}
function start(freeRide) {
  if (!world) return;
  state = createGameState(freeRide);
  state.speed = 5;
  world.reset();
  clearInput();
  accumulator = 0;
  lastTime = performance.now();
  impact = 0;
  mode = "playing";
  ui.setMode(mode);
  sound.unlock();
  sound.play("start");
  ui.toast(
    freeRide ? "海风不限时，享受这段路吧。" : "收集 12 条鱼，再绕岛一圈！",
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
  sound.update(0, false);
}
function resume() {
  if (mode !== "paused") return;
  mode = "playing";
  accumulator = 0;
  lastTime = performance.now();
  clearInput();
  ui.setMode(mode);
}
function toggleCamera() {
  cameraMode = (cameraMode + 1) % 2;
  ui.setCamera(cameraMode ? "全景视角" : "跟随视角");
}
function finish() {
  mode = "finished";
  clearInput();
  if (state.score > best) {
    best = state.score;
    try {
      localStorage.setItem("pelican-pedal-best", String(best));
    } catch {}
  }
  ui.setMode(mode, {
    success: state.success,
    fish: state.fish,
    score: state.score,
    best,
    time: state.time,
    reason: state.success
      ? "今日的海风与鲜鱼，都被你收入囊中。"
      : state.fish < TARGET_FISH
        ? "鲜鱼还差一点，再兜一圈就更熟练啦。"
        : "鱼已经够啦，下次加速完成环岛！",
    freeRide: state.freeRide,
  });
  if (state.success) burst(rider.group.position, "#ffd260", 100);
}

const keyMap = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "brake",
  ArrowDown: "brake",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  Space: "jump",
  ShiftLeft: "boost",
  ShiftRight: "boost",
};
function refreshInput() {
  for (const action of Object.keys(input)) {
    input[action] =
      mode === "playing" &&
      (Object.entries(keyMap).some(
        ([key, value]) => value === action && heldKeys.has(key),
      ) ||
        [...touchPointers.values()].some(
          (control) =>
            control === action || (action === "forward" && control === "boost"),
        ));
  }
}
window.addEventListener("keydown", (event) => {
  if (keyMap[event.code]) {
    if (mode === "playing") event.preventDefault();
    heldKeys.add(event.code);
    if (mode === "playing" && keyMap[event.code] === "jump" && !event.repeat)
      jumpQueued = true;
    refreshInput();
  }
  if (event.repeat) return;
  if (event.code === "KeyP" || event.code === "Escape")
    mode === "playing" ? pause() : resume();
  if (event.code === "KeyR" && mode !== "menu" && mode !== "loading")
    start(state.freeRide);
  if (event.code === "KeyC") toggleCamera();
  if (event.code === "KeyM") ui.setSound(sound.toggle());
});
window.addEventListener("keyup", (event) => {
  heldKeys.delete(event.code);
  if (keyMap[event.code]) refreshInput();
});
window.addEventListener("blur", () => {
  heldKeys.clear();
  clearInput();
  pause();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
});
for (const button of document.querySelectorAll("[data-control]")) {
  const control = button.dataset.control;
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (mode !== "playing") return;
    button.setPointerCapture(event.pointerId);
    touchPointers.set(event.pointerId, control);
    if (control === "jump") jumpQueued = true;
    refreshInput();
    button.classList.add("pressed");
  });
  const release = (event) => {
    touchPointers.delete(event.pointerId);
    refreshInput();
    button.classList.toggle(
      "pressed",
      [...touchPointers.values()].includes(control),
    );
  };
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
}

const cameraTarget = new THREE.Vector3();
const desiredCamera = new THREE.Vector3();
function updateCamera(dt, snap = false) {
  const showingMenu = mode === "menu" || mode === "loading";
  const frame = getTrackFrame(
    showingMenu ? 18 : state.distance,
    showingMenu ? 0 : state.lateral,
  );
  if (showingMenu) {
    const isMobile = innerWidth < 700;
    desiredCamera
      .copy(frame.position)
      .addScaledVector(frame.tangent, 8)
      .addScaledVector(frame.right, isMobile ? -17 : -14);
    desiredCamera.y += isMobile ? 7 : 5.5;
    cameraTarget
      .copy(frame.position)
      .addScaledVector(frame.right, isMobile ? 0 : -4.5);
    cameraTarget.y += isMobile ? -3 : 2;
  } else {
    desiredCamera
      .copy(frame.position)
      .addScaledVector(frame.tangent, cameraMode ? -20 : -11.5)
      .addScaledVector(frame.right, cameraMode ? 5 : 0);
    desiredCamera.y += (cameraMode ? 13 : 6.2) + state.height * 0.45;
    const lookFrame = getTrackFrame(
      state.distance + (cameraMode ? 11 : 10),
      state.lateral * 0.65,
    );
    cameraTarget.copy(lookFrame.position);
    cameraTarget.y += 2 + state.height * 0.3;
  }
  camera.position.lerp(desiredCamera, snap ? 1 : 1 - Math.exp(-dt * 5));
  if (impact > 0) {
    camera.position.x += (Math.random() - 0.5) * impact * 0.3;
    camera.position.y += (Math.random() - 0.5) * impact * 0.2;
  }
  camera.lookAt(cameraTarget);
  const targetFov = mode === "playing" && state.boosting ? 53 : 46;
  camera.fov = THREE.MathUtils.lerp(
    camera.fov,
    targetFov,
    1 - Math.exp(-dt * 4),
  );
  camera.updateProjectionMatrix();
}
function handleEvents(events) {
  for (const event of events) {
    sound.play(event.type);
    if (event.type === "fish") {
      event.item.mesh.visible = false;
      burst(event.item.mesh.position);
      if (event.combo > 1)
        ui.toast(`${event.combo} 连收！ +${event.points}`, "fish");
      else ui.toast("鲜鱼 +1  ·  加速能量恢复", "fish");
      if (state.fish === TARGET_FISH && !state.freeRide)
        ui.toast("鱼够啦！完成环岛就能回家。", "success");
    }
    if (event.type === "hit") {
      impact = 1;
      burst(rider.group.position, "#ff815f", 12);
      ui.toast("哎呀！按空格跳过路障", "warning");
    }
    if (event.type === "ramp") ui.toast("起飞！展开你的翅膀", "success");
    if (event.type === "land")
      ui.toast(`漂亮落地  +${event.points}`, "success");
    if (event.type === "lap") {
      if (state.freeRide) {
        world.reset();
        ui.toast(`第 ${state.lap} 圈完成，鲜鱼补货！`, "success");
      } else if (state.fish < TARGET_FISH)
        ui.toast(`环岛完成，还差 ${TARGET_FISH - state.fish} 条鱼！`, "info");
    }
    if (event.type === "finish") finish();
  }
}

let lastTime = performance.now();
let hudTimer = 0;
function animate(now) {
  requestAnimationFrame(animate);
  const elapsed = Math.max(0, (now - lastTime) / 1000);
  const dt = Math.min(elapsed, 0.1);
  lastTime = now;
  if (mode !== "paused") simulationTime += dt;
  if (mode === "menu") menuTime += dt;
  if (mode === "playing") {
    // Preserve the real deadline even when a slow renderer skips simulation time.
    if (!state.freeRide)
      state.time = Math.max(0, state.time - Math.max(0, elapsed - dt));
    accumulator += dt;
    while (accumulator >= 1 / 120 && mode === "playing") {
      const controls = { ...input, jump: input.jump || jumpQueued };
      jumpQueued = false;
      handleEvents(stepGame(state, controls, 1 / 120, TRACK_LENGTH, world));
      accumulator -= 1 / 120;
    }
  }
  const preview = mode === "menu" || mode === "loading";
  const frame = getTrackFrame(
    preview ? 18 : state.distance,
    preview ? 0 : state.lateral,
  );
  let rampLift = 0;
  let rampPitch = 0;
  if (!preview && state.height === 0) {
    const distanceOnLap = state.distance % TRACK_LENGTH;
    for (const ramp of world.ramps) {
      const approach = ramp.distance - distanceOnLap;
      if (
        approach > 0 &&
        approach < ramp.length &&
        Math.abs(state.lateral - ramp.lateral) < ramp.width / 2
      ) {
        rampLift = (1 - approach / ramp.length) * ramp.height;
        rampPitch = -Math.atan2(ramp.height, ramp.length);
      }
    }
  }
  rider.group.position.copy(frame.position);
  rider.group.position.y += preview
    ? Math.sin(menuTime * 1.5) * 0.025
    : state.height + rampLift;
  rider.group.rotation.set(0, frame.yaw, 0);
  rider.group.rotateX(rampPitch);
  rider.group.rotateZ(preview ? -0.035 : -state.steer * 0.1);
  rider.group.visible = !(
    mode === "playing" &&
    state.invulnerable > 0 &&
    Math.floor(state.invulnerable * 12) % 2 === 0
  );
  rider.update(mode === "paused" ? 0 : dt, {
    speed: preview ? 1.5 : state.speed,
    steer: state.steer,
    jump: state.height,
    time: simulationTime,
    boost: state.boosting,
  });
  shadow.position.copy(frame.position);
  shadow.position.y = ROAD_HEIGHT + 0.035;
  shadow.rotation.z = frame.yaw;
  shadow.material.opacity = 1 - Math.min(state.height / 8, 0.7);
  const shadowScale = 1 + state.height * 0.12;
  shadow.scale.set(shadowScale, shadowScale, 1);
  sun.position.copy(frame.position).add(new THREE.Vector3(-65, 100, 60));
  sun.target.position.copy(frame.position);
  world.update(simulationTime, mode === "paused" ? 0 : dt);
  for (let i = 0; i < particleCount; i++) {
    const particle = particles[i];
    if (particle.life <= 0) continue;
    particle.life -= dt;
    particle.velocity.y -= dt * 10;
    particlePositions[i * 3] += particle.velocity.x * dt;
    particlePositions[i * 3 + 1] += particle.velocity.y * dt;
    particlePositions[i * 3 + 2] += particle.velocity.z * dt;
    if (particle.life <= 0) particlePositions[i * 3 + 1] = -100;
  }
  particleGeometry.attributes.position.needsUpdate = true;
  impact = Math.max(0, impact - dt * 2.5);
  updateCamera(dt);
  sound.update(state.speed, mode === "playing");
  hudTimer += dt;
  if (hudTimer > 0.08) {
    ui.update({
      speed: Math.round(state.speed * 3.6),
      fish: state.fish,
      targetFish: TARGET_FISH,
      time: state.time,
      progress: state.freeRide
        ? (state.distance % TRACK_LENGTH) / TRACK_LENGTH
        : Math.min(1, state.distance / TRACK_LENGTH),
      boost: state.boost,
      combo: state.combo,
      score: state.score,
      airborne: state.height > 0.1,
      freeRide: state.freeRide,
      best,
    });
    ui.drawMap((state.distance % TRACK_LENGTH) / TRACK_LENGTH, world.fish);
    hudTimer = 0;
  }
  renderer.render(scene, camera);
}
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  updateCamera(1, true);
});
renderer.domElement.addEventListener("webglcontextlost", (event) => {
  event.preventDefault();
  pause();
  ui.showError("3D 画面暂时中断，请刷新页面重新出发。");
});

mode = "menu";
for (const fish of world.fish)
  if (fish.distance < 36) fish.mesh.visible = false;
ui.setMode(mode);
ui.setSound(false);
updateCamera(1, true);
requestAnimationFrame(animate);

// Read-only diagnostics for development and automated browser smoke checks.
if (import.meta.env.DEV) {
  window.__pelican = {
    get state() {
      return { ...state, mode, trackLength: TRACK_LENGTH };
    },
    get rendererInfo() {
      return {
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
      };
    },
  };
}
