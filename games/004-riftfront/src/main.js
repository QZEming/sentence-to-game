import * as THREE from "three";
import { MAPS, WEAPONS, WEAPON_ORDER } from "./data.js";
import { createMatch, stepMatch, command } from "./game.js";
import { createArena } from "./world.js";
import { createSoldier, createViewModel } from "./actors.js";
import { createUI } from "./ui.js";
import { createAudio } from "./audio.js";
import "./styles.css";

const canvas = document.querySelector("#game-canvas");
const sound = createAudio();
const SAVE_KEY = "riftfront-record-v1";
const clamp = THREE.MathUtils.clamp;
const keys = new Set();
const held = new Map();
const edges = new Set();
const soldiers = new Map();
const grenadeModels = new Map();
const effects = [];
let mode = "loading";
let state;
let arena;
let arenaId;
let renderer;
let scene;
let camera;
let viewScene;
let viewCamera;
let viewModel;
let yaw = Math.PI;
let pitch = 0;
let sensitivity = 1;
let mouseFire = false;
let mouseAim = false;
let touchAim = false;
let drag = null;
let mousePointerId = 1;
let dragFallback = false;
let ignoreUnlock = false;
let recorded = false;
let lowQuality = matchMedia("(pointer: coarse)").matches;
let visualTime = 0;
let previousTime = performance.now();
let uiTimer = 0;
let footstepTime = 0;
let sampleTime = 0;
let samples = 0;
let record = readRecord();
let lastOptions = {
  mode: "team",
  map: "harbor",
  difficulty: "normal",
  class: "assault",
};

const ui = createUI({
  onStart: start,
  onPause: pause,
  onResume: resume,
  onMenu: menu,
  onRestart: () => start(lastOptions),
  onSound: () => {
    sound.setEnabled(!sound.enabled);
    ui.setSound(sound.enabled);
  },
  onInput: inputAction,
  onAction: (action, payload) => {
    if (!state) return;
    if (action === "upgrade" && state.phase !== "intermission") return;
    if (action === "endTraining" && state.options.mode !== "training") return;
    processEvents(command(state, action, payload));
    if (action === "upgrade" && state.phase === "playing") {
      mode = "playing";
      ui.setMode(mode);
      requestLock();
    }
    ui.update(state, record);
  },
});

function readRecord() {
  const clean = {
    matches: 0,
    wins: 0,
    totalKills: 0,
    bestKills: 0,
    bestWave: 0,
    shots: 0,
    hits: 0,
  };
  try {
    const data = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
    for (const key of Object.keys(clean)) {
      if (Number.isFinite(data[key]))
        clean[key] = clamp(Math.floor(data[key]), 0, 1e9);
    }
  } catch {
    /* Private browsing and corrupted records do not block play. */
  }
  return clean;
}

function saveRecord() {
  if (recorded || state.options.mode === "training") return;
  recorded = true;
  const stats = state.player.stats;
  record.matches++;
  record.wins += state.winner === 0 ? 1 : 0;
  record.totalKills += stats.kills;
  record.bestKills = Math.max(record.bestKills, stats.kills);
  if (state.options.mode === "survival")
    record.bestWave = Math.max(record.bestWave, state.wave);
  record.shots += stats.shots;
  record.hits += stats.hits;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(record));
  } catch {
    /* Session records remain available. */
  }
}

function clearInput() {
  keys.clear();
  held.clear();
  edges.clear();
  mouseFire = false;
  mouseAim = false;
  touchAim = false;
  drag = null;
  ui.setScoreboard(false);
  document
    .querySelectorAll("[data-control].pressed")
    .forEach((node) => node.classList.remove("pressed"));
}

function releaseLock() {
  if (document.pointerLockElement === canvas) {
    ignoreUnlock = true;
    document.exitPointerLock();
  }
}

function requestLock() {
  if (mode !== "playing") return;
  if (matchMedia("(pointer: coarse)").matches || !canvas.requestPointerLock) {
    dragFallback = true;
    return;
  }
  try {
    const result = canvas.requestPointerLock();
    result?.catch(() => {
      dragFallback = true;
    });
  } catch {
    dragFallback = true;
  }
}

function start(options = lastOptions) {
  if (!renderer) return;
  sound.unlock();
  lastOptions = { ...options };
  sensitivity = clamp(Number(options.sensitivity) || 1, 0.5, 2);
  clearInput();
  clearEffects();
  state = createMatch(options);
  recorded = false;
  yaw = state.player.yaw;
  pitch = state.player.pitch;
  if (arenaId !== state.options.map) {
    arena?.dispose();
    arenaId = state.options.map;
    arena = createArena(scene, arenaId);
    arena.setQuality(lowQuality);
  }
  for (const actor of soldiers.values()) actor.dispose?.();
  soldiers.clear();
  mode = "playing";
  ui.setMode(mode);
  ui.update(state, record);
  viewModel.setWeapon(state.player.weapon);
  requestLock();
}

function pause() {
  if (mode !== "playing") return;
  mode = "paused";
  clearInput();
  releaseLock();
  ui.setMode(mode);
  ui.update(state, record);
}

function resume() {
  if (mode !== "paused") return;
  clearInput();
  mode = "playing";
  ui.setMode(mode);
  requestLock();
}

function menu() {
  clearInput();
  releaseLock();
  mode = "menu";
  clearEffects();
  ui.setMode(mode);
  ui.update(state, record);
}

function inputAction(action) {
  if (action === "pause") {
    pause();
    return;
  }
  if (mode !== "playing") return;
  sound.unlock();
  if (action === "aim") touchAim = !touchAim;
  else if (action === "cycleWeapon") cycleWeapon(1);
  else if (action === "scoreboard")
    ui.setScoreboard(document.querySelector("#scoreboard-overlay").hidden);
  else edges.add(action);
}

function cycleWeapon(direction) {
  if (mode !== "playing") return;
  const index = WEAPON_ORDER.indexOf(state.player.weapon);
  processEvents(
    command(state, "switchWeapon", {
      id: WEAPON_ORDER[
        (index + direction + WEAPON_ORDER.length) % WEAPON_ORDER.length
      ],
    }),
  );
}

function isHeld(name) {
  return [...held.values()].includes(name);
}
function gameInput() {
  const forward =
    Number(keys.has("KeyW") || keys.has("ArrowUp") || isHeld("forward")) -
    Number(keys.has("KeyS") || keys.has("ArrowDown") || isHeld("back"));
  const right =
    Number(keys.has("KeyD") || keys.has("ArrowRight") || isHeld("right")) -
    Number(keys.has("KeyA") || keys.has("ArrowLeft") || isHeld("left"));
  const input = {
    moveX: Math.sin(yaw) * forward - Math.cos(yaw) * right,
    moveZ: Math.cos(yaw) * forward + Math.sin(yaw) * right,
    yaw,
    pitch,
    fire: mouseFire || isHeld("fire"),
    aim: mouseAim || touchAim,
    sprint: keys.has("ShiftLeft") || keys.has("ShiftRight") || isHeld("sprint"),
    crouch:
      keys.has("KeyC") ||
      keys.has("ControlLeft") ||
      keys.has("ControlRight") ||
      isHeld("crouch"),
  };
  for (const edge of edges) input[edge] = true;
  edges.clear();
  return input;
}

function look(dx, dy) {
  const slow = state?.player.aiming ? 0.55 : 1;
  yaw -= dx * 0.0022 * sensitivity * slow;
  pitch = clamp(pitch - dy * 0.0022 * sensitivity * slow, -1.45, 1.45);
  yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw));
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
  if (mode !== "playing") return;
  if (
    /^(Key[WASDCRGVF]|Arrow|Space|Shift|Control|Digit[1-5]|Tab)/.test(
      event.code,
    )
  )
    event.preventDefault();
  keys.add(event.code);
  if (event.repeat) return;
  const action = {
    Space: "jump",
    KeyR: "reload",
    KeyG: "grenade",
    KeyV: "slide",
    KeyF: "melee",
  }[event.code];
  if (action) inputAction(action);
  if (/^Digit[1-5]$/.test(event.code))
    processEvents(
      command(state, "switchWeapon", {
        id: WEAPON_ORDER[Number(event.code.slice(-1)) - 1],
      }),
    );
  if (event.code === "Tab") ui.setScoreboard(true);
});
document.addEventListener("keyup", (event) => {
  keys.delete(event.code);
  if (event.code === "Tab") {
    event.preventDefault();
    ui.setScoreboard(false);
  }
});
document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement === canvas) {
    dragFallback = false;
    ignoreUnlock = false;
  } else if (ignoreUnlock) ignoreUnlock = false;
  else if (mode === "playing" && !dragFallback) pause();
});
document.addEventListener("pointerlockerror", () => {
  dragFallback = true;
  if (mode === "playing")
    ui.toast("鼠标捕获不可用：按住右键拖动瞄准，左键开火", "info");
});
document.addEventListener("mousemove", (event) => {
  if (mode === "playing" && document.pointerLockElement === canvas)
    look(event.movementX, event.movementY);
});
canvas.addEventListener("contextmenu", (event) => event.preventDefault());
canvas.addEventListener("pointerdown", (event) => {
  if (mode !== "playing") return;
  sound.unlock();
  if (event.pointerType === "touch") {
    event.preventDefault();
    if (!drag) {
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    }
    return;
  }
  mousePointerId = event.pointerId;
  if (document.pointerLockElement !== canvas && !dragFallback) {
    requestLock();
    return;
  }
  if (event.button === 0) mouseFire = true;
  if (event.button === 2) {
    mouseAim = true;
    if (document.pointerLockElement !== canvas) {
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    }
  }
});
// Mouse button chords need mouse events: pointerdown/up only cover the first
// pressed button and the last released button, which breaks ADS + firing.
canvas.addEventListener("mousedown", (event) => {
  if (
    mode !== "playing" ||
    (document.pointerLockElement !== canvas && !dragFallback)
  )
    return;
  if (event.button === 0) mouseFire = true;
  if (event.button === 2) {
    mouseAim = true;
    if (document.pointerLockElement !== canvas) {
      drag = { id: mousePointerId, x: event.clientX, y: event.clientY };
      try {
        canvas.setPointerCapture(mousePointerId);
      } catch {
        /* A detached mouse may have no active pointer. */
      }
    }
  }
});
window.addEventListener("mouseup", (event) => {
  if (event.button === 0) mouseFire = false;
  if (event.button === 2) {
    mouseAim = false;
    if (drag?.id === mousePointerId) drag = null;
  }
});
canvas.addEventListener("pointermove", (event) => {
  if (
    mode !== "playing" ||
    !drag ||
    drag.id !== event.pointerId ||
    document.pointerLockElement === canvas
  )
    return;
  look(event.clientX - drag.x, event.clientY - drag.y);
  drag.x = event.clientX;
  drag.y = event.clientY;
});
window.addEventListener("pointerup", (event) => {
  if (event.pointerType !== "touch") {
    if (event.button === 0) mouseFire = false;
    if (event.button === 2) mouseAim = false;
  }
  if (drag?.id === event.pointerId) drag = null;
  releaseHeld(event);
});
window.addEventListener("pointercancel", (event) => {
  if (drag?.id === event.pointerId) drag = null;
  if (event.pointerType !== "touch") {
    mouseFire = false;
    mouseAim = false;
  }
  releaseHeld(event);
});
canvas.addEventListener(
  "wheel",
  (event) => {
    if (mode !== "playing") return;
    event.preventDefault();
    cycleWeapon(event.deltaY > 0 ? 1 : -1);
  },
  { passive: false },
);
document.querySelectorAll("[data-control]").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    if (mode !== "playing") return;
    event.preventDefault();
    sound.unlock();
    button.setPointerCapture(event.pointerId);
    held.set(event.pointerId, button.dataset.control);
    button.classList.add("pressed");
  });
  button.addEventListener("lostpointercapture", releaseHeld);
});
function releaseHeld(event) {
  const name = held.get(event.pointerId);
  held.delete(event.pointerId);
  if (name && !isHeld(name))
    document
      .querySelector(`[data-control="${name}"]`)
      ?.classList.remove("pressed");
}
window.addEventListener("blur", () => {
  clearInput();
  if (mode === "playing") pause();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
  previousTime = performance.now();
});

function tracer(event) {
  if (!event.from || !event.to || effects.length > (lowQuality ? 70 : 130))
    return;
  const color = event.team === 0 ? 0x9af5df : 0xffac79;
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(event.from.x, event.from.y, event.from.z),
    new THREE.Vector3(event.to.x, event.to.y, event.to.z),
  ]);
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const line = new THREE.Line(geometry, mat);
  scene.add(line);
  effects.push({ object: line, life: 0.065, max: 0.065 });
  if (event.hit && event.hit !== "none") {
    const spark = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.035, 0),
      new THREE.MeshBasicMaterial({
        color: event.hit === "enemy" ? 0xffeeae : color,
        transparent: true,
      }),
    );
    spark.position.set(event.to.x, event.to.y, event.to.z);
    scene.add(spark);
    effects.push({
      object: spark,
      life: 0.13,
      max: 0.13,
      velocity: new THREE.Vector3(0, 0.7, 0),
    });
  }
}

function explosion(position) {
  for (let i = 0; i < (lowQuality ? 8 : 15); i++) {
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(i ? 0.12 : 0.65, 0),
      new THREE.MeshBasicMaterial({
        color: i % 2 ? 0xffa864 : 0xffe5ab,
        transparent: true,
        depthWrite: false,
      }),
    );
    mesh.position.set(position.x, position.y, position.z);
    scene.add(mesh);
    const phi = i * 2.3999;
    effects.push({
      object: mesh,
      life: i ? 0.6 : 0.25,
      max: i ? 0.6 : 0.25,
      expand: i === 0,
      velocity: i
        ? new THREE.Vector3(
            Math.sin(phi) * 5,
            1 + Math.random() * 4,
            Math.cos(phi) * 5,
          )
        : null,
    });
  }
}

function processEvents(events = []) {
  for (const event of events) {
    if (event.type === "shot") {
      tracer(event);
      if (!event.pellet) {
        if (event.actor === "player") {
          viewModel.flash();
          sound.play("fire", event.weapon);
        } else
          sound.play(
            "fire",
            event.weapon,
            Math.hypot(
              event.from.x - state.player.x,
              event.from.z - state.player.z,
            ),
          );
      }
    } else if (event.type === "hit") {
      ui.hitMarker(event.headshot, event.killed);
      sound.play(event.headshot ? "headshot" : "hit");
    } else if (event.type === "damage" && event.target === "player") {
      const angle = event.from
        ? yaw -
          Math.atan2(
            event.from.x - state.player.x,
            event.from.z - state.player.z,
          )
        : 0;
      ui.damageIndicator(angle, event.amount);
      sound.play("hurt");
    } else if (event.type === "explosion") {
      explosion(event.position);
      sound.play(
        "explosion",
        "",
        Math.hypot(
          event.position.x - state.player.x,
          event.position.z - state.player.z,
        ),
      );
    } else if (event.type === "toast") ui.toast(event.message, event.tone);
    else if (
      event.type === "sound" &&
      !["fire", "hurt", "hit", "explosion"].includes(event.name)
    )
      sound.play(event.name);
    else if (event.type === "respawn" && event.actor === "player") {
      yaw = state.player.yaw;
      pitch = state.player.pitch;
      clearInput();
    } else if (event.type === "intermission") {
      mode = "intermission";
      clearInput();
      releaseLock();
      ui.setMode(mode);
      ui.update(state, record);
    } else if (event.type === "resume") {
      mode = "playing";
      ui.setMode(mode);
    } else if (event.type === "finish") {
      mode = "finished";
      clearInput();
      releaseLock();
      saveRecord();
      ui.setMode(mode);
      ui.update(state, record);
    }
  }
}

function disposeEffect(effect) {
  scene.remove(effect.object);
  effect.object.geometry.dispose();
  effect.object.material.dispose();
}
function clearEffects() {
  for (const effect of effects) disposeEffect(effect);
  effects.length = 0;
  for (const mesh of grenadeModels.values()) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
  grenadeModels.clear();
}

function renderActors(dt) {
  const active = new Set();
  for (const entity of state.bots) {
    active.add(entity.id);
    let actor = soldiers.get(entity.id);
    if (!actor) {
      actor = createSoldier(entity.team, {
        name: entity.name,
        variant: ["assault", "recon", "heavy"].indexOf(entity.class) + 1,
      });
      soldiers.set(entity.id, actor);
      scene.add(actor.group);
    }
    actor.group.visible = entity.alive;
    if (entity.alive) actor.update(dt, entity, visualTime, camera);
  }
  for (const [id, actor] of soldiers) {
    if (!active.has(id)) {
      actor.dispose?.();
      scene.remove(actor.group);
      soldiers.delete(id);
    }
  }
  const grenades = new Set();
  for (const grenade of state.grenades) {
    grenades.add(grenade.id);
    let mesh = grenadeModels.get(grenade.id);
    if (!mesh) {
      mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.13, 1),
        new THREE.MeshStandardMaterial({
          color: 0xf4c86b,
          emissive: 0xff572e,
          emissiveIntensity: 0.4,
          roughness: 0.3,
          metalness: 0.7,
        }),
      );
      grenadeModels.set(grenade.id, mesh);
      scene.add(mesh);
    }
    mesh.position.set(grenade.x, grenade.y, grenade.z);
    mesh.rotation.set(visualTime * 9, visualTime * 4, visualTime * 2);
    mesh.material.emissiveIntensity = 0.6 + Math.sin(visualTime * 28) * 0.5;
  }
  for (const [id, mesh] of grenadeModels) {
    if (!grenades.has(id)) {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
      grenadeModels.delete(id);
    }
  }
}

function resize() {
  if (!renderer) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, lowQuality ? 1 : 1.5));
  renderer.setSize(width, height, false);
  camera.aspect = viewCamera.aspect = width / height;
  camera.updateProjectionMatrix();
  viewCamera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);

function frame(now) {
  requestAnimationFrame(frame);
  const dt = clamp((now - previousTime) / 1000, 0, 0.12);
  previousTime = now;
  if (!renderer || !state || document.hidden) return;
  const running = mode === "playing";
  if (running) processEvents(stepMatch(state, gameInput(), dt));
  const animationDt = ["paused", "intermission", "finished"].includes(mode)
    ? 0
    : dt;
  visualTime += animationDt;
  arena.update(animationDt, state);
  const player = state.player;
  if (mode === "menu") {
    camera.position.set(23 + Math.sin(visualTime * 0.08) * 3, 13.5, 33);
    camera.lookAt(-7, 1.8, 1);
    camera.fov = 62;
  } else {
    const bob =
      player.onGround && player.alive && running
        ? Math.sin(visualTime * 11) *
          Math.min(player.speed || 0, 7) *
          0.0025 *
          (player.aiming ? 0.15 : 1)
        : 0;
    camera.position.set(player.x, player.y + player.eyeHeight + bob, player.z);
    camera.lookAt(
      player.x + Math.sin(yaw) * Math.cos(pitch),
      camera.position.y + Math.sin(pitch),
      player.z + Math.cos(yaw) * Math.cos(pitch),
    );
    const targetFov = player.aiming
      ? WEAPONS[player.weapon].adsFov
      : player.sprinting
        ? 80
        : 74;
    camera.fov = THREE.MathUtils.lerp(
      camera.fov,
      targetFov,
      1 - Math.exp(-dt * 12),
    );
  }
  camera.updateProjectionMatrix();
  renderActors(animationDt);
  for (let i = effects.length - 1; i >= 0; i--) {
    const effect = effects[i];
    effect.life -= animationDt;
    if (effect.life <= 0) {
      disposeEffect(effect);
      effects.splice(i, 1);
      continue;
    }
    effect.object.material.opacity = effect.life / effect.max;
    if (effect.velocity) {
      effect.object.position.addScaledVector(effect.velocity, animationDt);
      effect.velocity.y -= animationDt * 9;
    }
    if (effect.expand)
      effect.object.scale.setScalar(1 + (1 - effect.life / effect.max) * 8);
  }
  viewModel.update(animationDt, player, visualTime);
  if (running && player.alive && player.onGround && player.speed > 1.2) {
    footstepTime += dt * player.speed;
    if (footstepTime > 2.5) {
      footstepTime = 0;
      sound.play("step");
    }
  }
  uiTimer += dt;
  if (uiTimer > 0.07) {
    ui.update(state, record);
    uiTimer = 0;
  }
  renderer.info.autoReset = false;
  renderer.info.reset();
  renderer.clear();
  renderer.render(scene, camera);
  if (mode !== "menu" && player.alive) {
    renderer.clearDepth();
    renderer.render(viewScene, viewCamera);
  }
  if (!lowQuality && dt > 0 && mode === "playing") {
    sampleTime += dt;
    samples++;
    if (samples >= 70) {
      if (sampleTime / samples > 0.045) {
        lowQuality = true;
        renderer.shadowMap.enabled = false;
        arena.setQuality(true);
        resize();
      }
      sampleTime = 0;
      samples = 0;
    }
  }
}

try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.autoClear = false;
  renderer.shadowMap.enabled = !lowQuality;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(74, 1, 0.08, 600);
  viewScene = new THREE.Scene();
  viewCamera = new THREE.PerspectiveCamera(55, 1, 0.025, 10);
  viewScene.add(viewCamera);
  viewScene.add(new THREE.HemisphereLight(0xe3f5ff, 0x61665e, 2.5));
  const gunLight = new THREE.DirectionalLight(0xffe4c1, 3);
  gunLight.position.set(-2, 4, 2);
  viewScene.add(gunLight);
  viewModel = createViewModel(viewCamera);
  state = createMatch(lastOptions);
  arenaId = state.options.map;
  arena = createArena(scene, arenaId);
  arena.setQuality(lowQuality);
  resize();
  mode = "menu";
  ui.setMode(mode);
  ui.setSound(sound.enabled);
  ui.update(state, record);
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    pause();
    ui.showError("图形上下文已中断，请刷新页面重新进入。");
  });
  // Read-only snapshots support diagnostics without exposing a gameplay cheat API.
  Object.defineProperty(window, "__riftfront", {
    value: Object.freeze({
      get state() {
        return structuredClone({
          ...state,
          mode,
          record,
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
  ui.showError("3D 场景启动失败，请使用支持 WebGL 2 的新版浏览器重试。");
}
