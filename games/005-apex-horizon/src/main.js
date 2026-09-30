import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { CARS, COLORS, TRACKS, CHAMPIONSHIP_TRACKS } from "./data.js";
import { createTrack, sampleTrack, normalizeAngle } from "./track.js";
import { createRace, stepRace, command } from "./game.js";
import { createWorld } from "./world.js";
import { createCar } from "./cars.js";
import { createUI } from "./ui.js";
import { createAudio } from "./audio.js";
import "./styles.css";

const canvas = document.querySelector("#game-canvas");
const sound = createAudio();
const SAVE_KEY = "apex-horizon-record-v1";
const keys = new Set(),
  held = new Map(),
  models = new Map();
const clamp = THREE.MathUtils.clamp;
let renderer,
  scene,
  camera,
  world,
  worldKey,
  ghostModel,
  skids,
  skidCursor = 0;
let state,
  mode = "loading",
  lastOptions = {
    mode: "race",
    track: "coast",
    car: "comet",
    color: "mint",
    difficulty: "normal",
    weather: "clear",
    autoThrottle: matchMedia("(pointer:coarse)").matches,
  };
let record = readRecord(),
  recorded = false,
  cameraMode = 0,
  visualTime = 0,
  lastTime = performance.now(),
  uiTime = 0;
let lapSamples = [],
  ghostTimer = 0,
  ghostData = null,
  lowQuality = matchMedia("(pointer:coarse)").matches;
let frameTotal = 0,
  frameCount = 0,
  previewTimer;
const target = new THREE.Vector3(),
  desired = new THREE.Vector3(),
  forward = new THREE.Vector3(),
  right = new THREE.Vector3(),
  lookTarget = new THREE.Vector3();
const cameraNames = ["追逐视角", "引擎盖视角", "高位视角"];
const skidPrevious = new Map(),
  smoke = [];
let smokeTexture,
  smokeTimer = 0;
const ui = createUI({
  onStart: start,
  onPause: pause,
  onResume: resume,
  onRestart: () => start(lastOptions),
  onMenu: menu,
  onSound: toggleSound,
  onCamera: cycleCamera,
  onReset: reset,
  onNextRound: nextRound,
  onPreview: (options) => {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => preview(options), 100);
  },
});

function readRecord() {
  const value = { races: 0, wins: 0, bestLaps: {}, ghosts: {}, bestDrifts: {} };
  try {
    const data = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
    for (const field of ["races", "wins"])
      if (Number.isFinite(data[field]))
        value[field] = clamp(Math.floor(data[field]), 0, 1e7);
    for (const field of ["bestLaps", "bestDrifts"])
      for (const [key, n] of Object.entries(data[field] || {})) {
        if (
          /^(coast|alpine|city)\|(comet|vector|tempest)\|(clear|wet)$/.test(
            key,
          ) &&
          Number.isFinite(n) &&
          n > 0 &&
          n < 1e8
        )
          value[field][key] = n;
      }
    for (const [key, samples] of Object.entries(data.ghosts || {})) {
      if (
        !value.bestLaps[key] ||
        !Array.isArray(samples) ||
        samples.length < 2 ||
        samples.length > 2400
      )
        continue;
      if (
        samples.every(
          (p, i) =>
            ["t", "x", "y", "z", "yaw", "d"].every((k) =>
              Number.isFinite(p[k]),
            ) &&
            p.t >= 0 &&
            p.t < 600 &&
            (!i || p.t >= samples[i - 1].t),
        )
      )
        value.ghosts[key] = samples;
    }
  } catch {}
  return value;
}
function saveRecord() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(record));
  } catch {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ ...record, ghosts: {} }));
    } catch {}
  }
}
function recordKey() {
  return state.trackId + "|" + state.options.car + "|" + state.options.weather;
}
function clearInput() {
  keys.clear();
  held.clear();
  document
    .querySelectorAll("[data-control].pressed")
    .forEach((n) => n.classList.remove("pressed"));
}
function makeWorld() {
  const key = state.trackId + "|" + state.options.weather;
  if (key === worldKey) return;
  world?.dispose();
  worldKey = key;
  world = createWorld(scene, state.trackId, state.options.weather);
  world.setQuality(lowQuality);
}
function clearModels() {
  for (const model of models.values()) {
    model.dispose?.();
    scene.remove(model.group);
  }
  models.clear();
  ghostModel?.dispose?.();
  if (ghostModel) scene.remove(ghostModel.group);
  ghostModel = null;
}
function clearEffects() {
  for (const item of smoke) {
    scene.remove(item.sprite);
    item.sprite.material.dispose();
  }
  smoke.length = 0;
  skidPrevious.clear();
  skidCursor = 0;
  if (skids) {
    const zero = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < skids.count; i++) skids.setMatrixAt(i, zero);
    skids.instanceMatrix.needsUpdate = true;
  }
}
function prepare() {
  makeWorld();
  clearModels();
  clearEffects();
  clearInput();
  recorded = false;
  lapSamples = [];
  ghostTimer = 0;
  ghostData = record.ghosts[recordKey()] || null;
  if (state.options.mode === "time" && ghostData) {
    ghostModel = createCar(state.options.car, "#a8fff0", {
      ghost: true,
      detail: "low",
    });
    scene.add(ghostModel.group);
  }
  const p = state.player;
  camera.position.set(
    p.x - Math.sin(p.yaw) * 9,
    p.y + 4,
    p.z - Math.cos(p.yaw) * 9,
  );
  lookTarget.set(p.x, p.y + 1, p.z);
  ui.update(state, record);
}
function preview(options) {
  if (!renderer || mode !== "menu") return;
  lastOptions = { ...lastOptions, ...options };
  state = createRace(lastOptions);
  prepare();
  ui.update(state, record);
}
function start(options = lastOptions) {
  if (!renderer) return;
  clearTimeout(previewTimer);
  sound.unlock();
  lastOptions = { ...options };
  state = createRace(options);
  prepare();
  mode = "playing";
  ui.setMode(mode);
  ui.update(state, record);
}
function pause() {
  if (mode !== "playing") return;
  mode = "paused";
  clearInput();
  ui.setMode(mode);
  ui.update(state, record);
  sound.update(state.player, false);
}
function resume() {
  if (mode !== "paused") return;
  mode = "playing";
  clearInput();
  ui.setMode(mode);
}
function menu() {
  clearInput();
  mode = "menu";
  ui.setMode(mode);
  clearEffects();
  sound.update(state.player, false);
  preview(lastOptions);
}
function nextRound() {
  if (
    mode !== "finished" ||
    state.options.mode !== "championship" ||
    state.series.finished
  )
    return;
  const events = command(state, "nextRound");
  if (state.phase === "countdown") {
    prepare();
    mode = "playing";
    ui.setMode(mode);
    ui.update(state, record);
  }
  processEvents(events);
}
function toggleSound() {
  sound.setEnabled(!sound.enabled);
  ui.setSound(sound.enabled);
}
function cycleCamera() {
  cameraMode = (cameraMode + 1) % cameraNames.length;
  ui.setCamera(cameraNames[cameraMode]);
}
function reset() {
  if (mode === "playing" || mode === "paused") {
    processEvents(command(state, "reset"));
    ui.update(state, record);
  }
}
function heldControl(name) {
  return [...held.values()].includes(name);
}
function controls() {
  const brake =
    keys.has("KeyS") || keys.has("ArrowDown") || heldControl("brake");
  return {
    throttle:
      !brake &&
      (state.options.autoThrottle ||
        keys.has("KeyW") ||
        keys.has("ArrowUp") ||
        heldControl("throttle"))
        ? 1
        : 0,
    brake: brake ? 1 : 0,
    steer:
      Number(
        keys.has("KeyD") || keys.has("ArrowRight") || heldControl("right"),
      ) -
      Number(keys.has("KeyA") || keys.has("ArrowLeft") || heldControl("left")),
    handbrake: keys.has("Space") || heldControl("handbrake"),
    boost:
      keys.has("ShiftLeft") || keys.has("ShiftRight") || heldControl("boost"),
  };
}
document.addEventListener("keydown", (event) => {
  if (["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName)) return;
  if (event.code === "Escape" || event.code === "KeyP") {
    if (!event.repeat) {
      if (mode === "playing") pause();
      else if (event.code === "KeyP") resume();
    }
    event.preventDefault();
    return;
  }
  if (event.code === "KeyM" && !event.repeat) {
    toggleSound();
    return;
  }
  if (mode !== "playing") return;
  if (/^(Key[WASDCQR]|Arrow|Shift|Space)/.test(event.code))
    event.preventDefault();
  keys.add(event.code);
  if (event.repeat) return;
  if (event.code === "KeyC") cycleCamera();
  if (event.code === "KeyR") reset();
});
document.addEventListener("keyup", (event) => keys.delete(event.code));
document.querySelectorAll("[data-control]").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    if (mode !== "playing") return;
    event.preventDefault();
    sound.unlock();
    button.setPointerCapture(event.pointerId);
    held.set(event.pointerId, button.dataset.control);
    button.classList.add("pressed");
  });
  button.addEventListener("lostpointercapture", releaseControl);
});
function releaseControl(event) {
  const control = held.get(event.pointerId);
  held.delete(event.pointerId);
  if (control && !heldControl(control))
    document
      .querySelector('[data-control="' + control + '"]')
      ?.classList.remove("pressed");
}
window.addEventListener("pointerup", releaseControl);
window.addEventListener("pointercancel", releaseControl);
window.addEventListener("blur", () => {
  clearInput();
  pause();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
  lastTime = performance.now();
});
canvas.addEventListener("contextmenu", (event) => event.preventDefault());

function captureLap(force = false) {
  if (
    state.options.mode === "drift" ||
    state.phase !== "racing" ||
    !state.player.lapValid
  )
    return;
  const p = state.player;
  if (!force && ghostTimer < 0.1) return;
  ghostTimer = 0;
  let d = p.s;
  if (d > state.trackLength * 0.96 && p.lapTime < 4) d = 0;
  if (lapSamples.length < 2398)
    lapSamples.push({
      t: p.lapTime,
      x: p.x,
      y: p.y,
      z: p.z,
      yaw: p.yaw,
      pitch: p.pitch || 0,
      d,
    });
}
function finishLap(event) {
  if (event.actor !== "player" || state.options.mode === "drift") return;
  const key = recordKey(),
    old = record.bestLaps[key] || Infinity;
  if (event.valid && event.time > 0 && event.time < old) {
    record.bestLaps[key] = event.time;
    if (lapSamples.length > 8) {
      const p = event.position || state.player;
      lapSamples.push({
        t: event.time,
        x: p.x,
        y: p.y,
        z: p.z,
        yaw: p.yaw,
        pitch: p.pitch || 0,
        d: state.trackLength,
      });
      // A monotonic sample clock prevents interpolation across a reset or corrupted lap.
      const clean = lapSamples.filter(
        (s, i, a) =>
          Number.isFinite(s.t) && s.t <= event.time && (!i || s.t > a[i - 1].t),
      );
      if (clean.length > 8) {
        record.ghosts[key] = clean;
        ghostData = clean;
        if (state.options.mode === "time" && !ghostModel) {
          ghostModel = createCar(state.options.car, "#a8fff0", {
            ghost: true,
            detail: "low",
          });
          scene.add(ghostModel.group);
        }
      }
    }
    saveRecord();
    ui.toast("个人最佳圈速 · " + formatTime(event.time), "good");
  }
  lapSamples = event.position ? [{ t: 0, ...event.position, d: 0 }] : [];
  ghostTimer = 0;
}
function formatTime(t) {
  return Math.floor(t / 60) + ":" + (t % 60).toFixed(3).padStart(6, "0");
}
function processEvents(events = []) {
  for (const event of events) {
    if (event.type === "countdown") sound.play("countdown");
    else if (event.type === "go") {
      sound.play("go");
      const p = state.player;
      if (state.options.mode !== "drift")
        lapSamples = [
          {
            t: p.lapTime,
            x: p.x,
            y: p.y,
            z: p.z,
            yaw: p.yaw,
            pitch: p.pitch || 0,
            d: Math.max(0, p.progress),
          },
        ];
    } else if (event.type === "lap") {
      finishLap(event);
      if (event.actor === "player") sound.play("lap");
    } else if (event.type === "collision") {
      if (event.actor === "player") sound.play("collision", event.strength);
      if (event.position) addSmoke(event.position, 3, "#ecc893");
    } else if (event.type === "pickup" && event.actor === "player")
      sound.play("pickup");
    else if (event.type === "drift") sound.play("drift");
    else if (event.type === "toast") ui.toast(event.message, event.tone);
    else if (
      event.type === "sound" &&
      ![
        "countdown",
        "go",
        "lap",
        "pickup",
        "drift",
        "finish",
        "collision",
      ].includes(event.name)
    )
      sound.play(event.name);
    else if (event.type === "track") makeWorld();
    else if (event.type === "finish") {
      mode = "finished";
      clearInput();
      sound.play("finish");
      if (!recorded) {
        recorded = true;
        record.races++;
        if (
          ["race", "championship"].includes(state.options.mode) &&
          state.result?.rank === 1
        )
          record.wins++;
        if (state.options.mode === "drift")
          record.bestDrifts[recordKey()] = Math.max(
            record.bestDrifts[recordKey()] || 0,
            state.result?.score || state.player.drift.score || 0,
          );
        saveRecord();
      }
      ui.setMode(mode);
      ui.update(state, record);
    }
  }
}
function addSmoke(position, count = 1, color = "#d7e0dd") {
  if (smoke.length > 45) return;
  for (let i = 0; i < count; i++) {
    const mat = new THREE.SpriteMaterial({
      map: smokeTexture,
      color,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(position.x, position.y + 0.25, position.z);
    scene.add(sprite);
    smoke.push({
      sprite,
      life: 0.7,
      max: 0.7,
      size: 0.5 + Math.random() * 0.45,
      vx: (Math.random() - 0.5) * 1.4,
      vz: (Math.random() - 0.5) * 1.4,
    });
  }
}
function addSkid(car) {
  const position = new THREE.Vector3(
    car.x - Math.sin(car.yaw) * 1.3,
    car.y + 0.038,
    car.z - Math.cos(car.yaw) * 1.3,
  );
  const previous = skidPrevious.get(car.id);
  if (previous) {
    const length = position.distanceTo(previous);
    if (length > 0.25 && length < 7) {
      for (const side of [-1, 1]) {
        const obj = new THREE.Object3D();
        obj.position.copy(position).add(previous).multiplyScalar(0.5);
        obj.position.x += Math.cos(car.yaw) * side * 0.76;
        obj.position.z -= Math.sin(car.yaw) * side * 0.76;
        obj.rotation.y = Math.atan2(
          position.x - previous.x,
          position.z - previous.z,
        );
        obj.rotation.x = -Math.atan2(
          position.y - previous.y,
          Math.hypot(position.x - previous.x, position.z - previous.z),
        );
        obj.scale.set(1, 1, length);
        obj.updateMatrix();
        skids.setMatrixAt(skidCursor++ % skids.count, obj.matrix);
      }
      skids.instanceMatrix.needsUpdate = true;
      skidPrevious.set(car.id, position);
    }
  } else skidPrevious.set(car.id, position);
}
function updateGhost(dt) {
  state.ghostDelta = undefined;
  if (!ghostModel || !ghostData || state.options.mode !== "time") return;
  const t = state.player.lapTime;
  ghostModel.group.visible =
    mode !== "menu" && state.phase !== "countdown" && t <= ghostData.at(-1).t;
  if (!ghostModel.group.visible) return;
  let lo = 0,
    hi = ghostData.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (ghostData[mid].t < t) lo = mid + 1;
    else hi = mid;
  }
  const a = ghostData[Math.max(0, lo - 1)],
    b = ghostData[lo],
    u = clamp((t - a.t) / (b.t - a.t || 1), 0, 1);
  const entity = {
    ...state.player,
    x: THREE.MathUtils.lerp(a.x, b.x, u),
    y: THREE.MathUtils.lerp(a.y, b.y, u),
    z: THREE.MathUtils.lerp(a.z, b.z, u),
    yaw: a.yaw + normalizeAngle(b.yaw - a.yaw) * u,
    pitch: THREE.MathUtils.lerp(a.pitch || 0, b.pitch || 0, u),
    boosting: false,
    brake: 0,
    roll: 0,
  };
  ghostModel.update(dt, entity, visualTime);
  const distance = Math.max(
    0,
    state.player.progress - (state.player.lap - 1) * state.trackLength,
  );
  const sample = ghostData.find((p) => p.d >= distance);
  state.ghostDelta = sample ? state.player.lapTime - sample.t : undefined;
}
function updateCars(dt) {
  const active = new Set();
  for (const car of state.cars) {
    if (mode === "menu" && car.id !== "player") continue;
    active.add(car.id);
    let model = models.get(car.id);
    if (!model) {
      model = createCar(car.model, car.color, {
        detail: car.id === "player" ? "high" : "low",
      });
      models.set(car.id, model);
      scene.add(model.group);
    }
    model.group.visible = !(
      car.id === "player" &&
      mode !== "menu" &&
      cameraMode === 1
    );
    model.update(dt, car, visualTime);
    if (
      mode === "playing" &&
      (car.drifting || (car.brake > 0.7 && Math.abs(car.speed) > 12))
    )
      addSkid(car);
    else skidPrevious.delete(car.id);
  }
  for (const [id, model] of models)
    if (!active.has(id)) {
      model.dispose?.();
      scene.remove(model.group);
      models.delete(id);
    }
  updateGhost(dt);
}
function updateCamera(dt) {
  const p = state.player,
    rear = keys.has("KeyQ") || heldControl("rear");
  forward.set(Math.sin(p.yaw), 0, Math.cos(p.yaw));
  right.set(-Math.cos(p.yaw), 0, Math.sin(p.yaw));
  target.set(p.x, p.y + 0.8, p.z);
  if (mode === "menu") {
    const phase = Math.sin(visualTime * 0.13) * 0.16;
    const angle = p.yaw - 0.75 + phase;
    const portrait = innerWidth < 600;
    const distance = portrait ? 14 : 9.4;
    camera.position.set(
      p.x + Math.sin(angle) * distance,
      p.y + (portrait ? 4.8 : 3.25),
      p.z + Math.cos(angle) * distance,
    );
    camera.lookAt(target);
    const screenRight = new THREE.Vector3(1, 0, 0).applyQuaternion(
      camera.quaternion,
    );
    const offset = innerWidth > 900 ? 3.5 : innerWidth > 600 ? 2.3 : 0.25;
    const screenUp = new THREE.Vector3(0, 1, 0).applyQuaternion(
      camera.quaternion,
    );
    camera.lookAt(
      target
        .clone()
        .addScaledVector(screenRight, -offset)
        .addScaledVector(screenUp, portrait ? -3.6 : 0),
    );
    camera.fov = 48;
  } else {
    const speed = Math.abs(p.speed);
    const direction = rear ? -1 : 1;
    if (cameraMode === 1) {
      desired.copy(target).addScaledVector(forward, direction * 1.28);
      desired.y = p.y + 1.17;
      camera.position.copy(desired);
      lookTarget.copy(target).addScaledVector(forward, direction * 20);
      lookTarget.y += Math.sin(p.pitch || 0) * 20 * direction + 0.1;
    } else {
      const inTunnel = TRACKS[state.trackId].tunnels.some(
        (t) =>
          p.s / state.trackLength > t.from - 0.01 &&
          p.s / state.trackLength < t.to + 0.015,
      );
      const high = cameraMode === 2 && !inTunnel;
      const distance = high ? 15 : 7.3 + speed * 0.025;
      desired.copy(target).addScaledVector(forward, -distance * direction);
      desired.y = p.y + (high ? 9 : 3.5) + speed * 0.004;
      camera.position.lerp(desired, 1 - Math.exp(-dt * (rear ? 15 : 7)));
      const aim = target
        .clone()
        .addScaledVector(forward, direction * (cameraMode === 2 ? 7 : 5));
      aim.y += Math.sin(p.pitch || 0) * 5 * direction;
      lookTarget.lerp(aim, 1 - Math.exp(-dt * 10));
    }
    camera.lookAt(lookTarget);
    const fov =
      cameraMode === 1
        ? 76
        : 63 + Math.min(8, speed * 0.09) + (p.boosting ? 8 : 0);
    camera.fov = THREE.MathUtils.lerp(camera.fov, fov, 1 - Math.exp(-dt * 5));
  }
  camera.updateProjectionMatrix();
}
function resize() {
  if (!renderer) return;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, lowQuality ? 1 : 1.5));
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
function frame(now) {
  requestAnimationFrame(frame);
  const dt = clamp((now - lastTime) / 1000, 0, 0.1);
  lastTime = now;
  if (!renderer || !state || document.hidden) return;
  const running = mode === "playing";
  if (running) {
    ghostTimer += dt;
    captureLap();
    processEvents(stepRace(state, controls(), dt));
  }
  const animationDt = ["paused", "finished"].includes(mode) ? 0 : dt;
  visualTime += animationDt;
  world.update(animationDt, state);
  updateCars(animationDt);
  updateCamera(dt);
  smokeTimer += dt;
  if (running && state.player.drifting && smokeTimer > 0.055) {
    smokeTimer = 0;
    const p = state.player;
    addSmoke(
      {
        x: p.x - Math.sin(p.yaw) * 1.5,
        y: p.y,
        z: p.z - Math.cos(p.yaw) * 1.5,
      },
      1,
      state.options.weather === "wet" ? "#f1f3ee" : "#bec8c3",
    );
  }
  for (let i = smoke.length - 1; i >= 0; i--) {
    const item = smoke[i];
    item.life -= animationDt;
    if (item.life <= 0) {
      scene.remove(item.sprite);
      item.sprite.material.dispose();
      smoke.splice(i, 1);
      continue;
    }
    item.sprite.position.y += animationDt * 0.65;
    item.sprite.position.x += item.vx * animationDt;
    item.sprite.position.z += item.vz * animationDt;
    item.sprite.scale.setScalar(item.size + (1 - item.life / item.max) * 2);
    item.sprite.material.opacity = (0.26 * item.life) / item.max;
  }
  sound.update(state.player, mode === "playing" && state.phase === "racing");
  uiTime += dt;
  if (uiTime > 0.075) {
    ui.update(state, record);
    uiTime = 0;
  }
  renderer.render(scene, camera);
  if (!lowQuality && dt > 0 && running) {
    frameTotal += dt;
    frameCount++;
    if (frameCount >= 75) {
      if (frameTotal / frameCount > 0.043) {
        lowQuality = true;
        renderer.shadowMap.enabled = false;
        world.setQuality(true);
        resize();
      }
      frameTotal = 0;
      frameCount = 0;
    }
  }
}
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  const gl = renderer.getContext(),
    debugRenderer = gl.getExtension("WEBGL_debug_renderer_info");
  if (
    debugRenderer &&
    /swiftshader|llvmpipe|software/i.test(
      gl.getParameter(debugRenderer.UNMASKED_RENDERER_WEBGL),
    )
  )
    lowQuality = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !lowQuality;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(63, 1, 0.15, 4000);
  const pmrem = new THREE.PMREMGenerator(renderer),
    room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04, 0.1, 100, {
    size: lowQuality ? 128 : 256,
  });
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.72;
  room.dispose();
  pmrem.dispose();
  const smokeCanvas = document.createElement("canvas");
  smokeCanvas.width = smokeCanvas.height = 64;
  const ctx = smokeCanvas.getContext("2d"),
    gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,.6)");
  gradient.addColorStop(0.4, "rgba(255,255,255,.4)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  smokeTexture = new THREE.CanvasTexture(smokeCanvas);
  skids = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.17, 0.012, 1),
    new THREE.MeshBasicMaterial({
      color: 0x102326,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
    }),
    512,
  );
  skids.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  skids.frustumCulled = false;
  scene.add(skids);
  state = createRace(lastOptions);
  prepare();
  resize();
  mode = "menu";
  ui.setMode(mode);
  ui.setSound(sound.enabled);
  ui.setCamera(cameraNames[cameraMode]);
  ui.update(state, record);
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    pause();
    ui.showError("图形连接已中断，请刷新页面重新进入赛道。");
  });
  Object.defineProperty(window, "__apex", {
    value: Object.freeze({
      get state() {
        return structuredClone({
          ...state,
          mode,
          record: {
            ...record,
            ghosts: Object.fromEntries(
              Object.entries(record.ghosts).map(([k, v]) => [
                k,
                { samples: v.length, time: v.at(-1)?.t },
              ]),
            ),
          },
          cameraMode,
          graphics: lowQuality ? "low" : "high",
        });
      },
      get rendererInfo() {
        return {
          calls: renderer.info.render.calls,
          triangles: renderer.info.render.triangles,
          geometries: renderer.info.memory.geometries,
          textures: renderer.info.memory.textures,
        };
      },
    }),
  });
  requestAnimationFrame(frame);
} catch (error) {
  console.error(error);
  ui.showError("3D 赛道启动失败，请使用支持 WebGL 2 的新版浏览器。");
}
