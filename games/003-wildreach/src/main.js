import * as THREE from "three";
import "./styles.css";
import { WORLD, SPAWN, heightAt, SOLIDS, LOCATIONS } from "./data.js";
import {
  createGame,
  stepGame,
  command,
  serializeGame,
  restoreGame,
} from "./game.js";
import { createWorld } from "./world.js";
import { createHero, createEnemy, createHorse } from "./actors.js";
import { createUI } from "./ui.js";
import { createAudio } from "./audio.js";

const SAVE_KEY = "wildreach-save-v1";
const sound = createAudio();
let game = createGame();
let mode = "loading";
let saved = null;
try {
  const value = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
  if (value?.version === 1 && value.player) saved = restoreGame(value);
} catch {}
let hasSave = Boolean(saved);
if (saved) game = saved;
const keys = new Set(),
  pointers = new Map(),
  queued = new Set();
let accumulator = 0,
  lastTime = performance.now(),
  visualTime = 0,
  saveTimer = 0,
  uiTimer = 0;
let cameraYaw = Math.PI,
  cameraPitch = 0.31,
  cameraDistance = 9.5,
  shake = 0;
let dragging = null,
  graphicsLow = false,
  frameTotal = 0,
  frameCount = 0;
let activeEnemyId = null,
  previousPanelMode = "playing";
const ui = createUI({
  onStart: (newGame) => start(newGame),
  onResume: resume,
  onPause: pause,
  onMenu: showMenu,
  onSave: () => saveGame(true),
  onSound: () => ui.setSound(sound.toggle()),
  onOpen: (panel) => openPanel(panel),
  onClose: resume,
  onAction: (action, payload) => perform(action, payload),
  onInput: (action) => queue(action),
});
const canvas = document.querySelector("#game-canvas");
let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
} catch {
  ui.showError(
    "浏览器无法开启这片 3D 原野。请使用支持 WebGL 的现代浏览器，并开启硬件加速。",
  );
  throw new Error("WebGL unavailable");
}
renderer.setPixelRatio(
  Math.min(devicePixelRatio, innerWidth < 700 ? 1.3 : 1.6),
);
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#b8d7d0");
const camera = new THREE.PerspectiveCamera(
  55,
  innerWidth / innerHeight,
  0.1,
  300,
);
const world = createWorld(scene);
const hero = createHero();
scene.add(hero.group);
const horse = createHorse();
scene.add(horse.group);
const enemyActors = new Map();
for (const enemy of game.enemies) {
  const actor = createEnemy(enemy.type);
  enemyActors.set(enemy.id, actor);
  scene.add(actor.group);
}
const targetRing = new THREE.Mesh(
  new THREE.RingGeometry(0.65, 0.76, 32),
  new THREE.MeshBasicMaterial({
    color: "#f8d780",
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  }),
);
targetRing.rotation.x = -Math.PI / 2;
scene.add(targetRing);
const objectiveBeam = new THREE.Mesh(
  new THREE.CylinderGeometry(0.04, 0.04, 7, 6),
  new THREE.MeshBasicMaterial({
    color: "#fff4b0",
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  }),
);
scene.add(objectiveBeam);
const blob = new THREE.Mesh(
  new THREE.CircleGeometry(0.47, 24),
  new THREE.MeshBasicMaterial({
    color: "#21463a",
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  }),
);
blob.rotation.x = -Math.PI / 2;
scene.add(blob);
const projectileActors = new Map(),
  effectActors = new Map();
function makeProjectile(type) {
  const group = new THREE.Group();
  if (type === "orb") {
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.32, 1),
      new THREE.MeshBasicMaterial({ color: "#ffc091" }),
    );
    group.add(core);
    const halo = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.52, 1),
      new THREE.MeshBasicMaterial({
        color: "#ee8164",
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      }),
    );
    group.add(halo);
  } else if (type === "bomb") {
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.34, 1),
      new THREE.MeshStandardMaterial({
        color: "#5ec7da",
        emissive: "#1d819b",
        emissiveIntensity: 0.8,
        roughness: 0.3,
      }),
    );
    group.add(core);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.035, 4, 12),
      new THREE.MeshBasicMaterial({ color: "#e0ffff" }),
    );
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  } else {
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 1, 5),
      new THREE.MeshStandardMaterial({
        color: type === "enemyArrow" ? "#d76457" : "#7d5031",
      }),
    );
    shaft.rotation.x = Math.PI / 2;
    group.add(shaft);
    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.085, 0.23, 4),
      new THREE.MeshStandardMaterial({ color: "#e1e9da", metalness: 0.3 }),
    );
    tip.rotation.x = Math.PI / 2;
    tip.position.z = 0.6;
    group.add(tip);
    const feather = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.035, 0.23),
      new THREE.MeshStandardMaterial({ color: "#eaf2d4" }),
    );
    feather.position.z = -0.4;
    group.add(feather);
  }
  scene.add(group);
  return group;
}
function makeEffect(effect) {
  let mesh;
  if (effect.type === "slash") {
    mesh = new THREE.Mesh(
      new THREE.RingGeometry(0.74, 1, 28, 1, 0, Math.PI * 1.3),
      new THREE.MeshBasicMaterial({
        color: "#f8efd0",
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = -game.player.yaw;
  } else if (effect.type === "warning") {
    mesh = new THREE.Mesh(
      new THREE.RingGeometry(0.91, 1, 64),
      new THREE.MeshBasicMaterial({
        color: "#ed785d",
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    mesh.rotation.x = -Math.PI / 2;
  } else if (effect.type === "lightning") {
    mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.18, 24, 5),
      new THREE.MeshBasicMaterial({
        color: "#fff6c1",
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    );
  } else if (effect.type === "ice") {
    mesh = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.6, 3.6),
      new THREE.MeshStandardMaterial({
        color: "#9ee9ee",
        roughness: 0.24,
        metalness: 0.08,
        transparent: true,
        opacity: 0.78,
      }),
    );
  } else if (effect.type === "fire") {
    mesh = new THREE.Mesh(
      new THREE.ConeGeometry(effect.radius || 1.5, 2.4, 8),
      new THREE.MeshBasicMaterial({
        color: "#ffb85f",
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      }),
    );
  } else if (effect.type === "shockwave") {
    mesh = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.055, 4, 48),
      new THREE.MeshBasicMaterial({
        color: "#fd9b7b",
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      }),
    );
    mesh.rotation.x = Math.PI / 2;
  } else {
    const color =
      effect.type === "stasis"
        ? "#e8da86"
        : effect.type === "heal"
          ? "#b4f4b5"
          : effect.type === "explosion"
            ? "#ffd29a"
            : "#c9eee3";
    mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.4,
        wireframe: effect.type === "stasis",
        depthWrite: false,
      }),
    );
  }
  scene.add(mesh);
  return mesh;
}
function removeActor(map, id) {
  const actor = map.get(id);
  scene.remove(actor);
  actor.traverse((object) => {
    object.geometry?.dispose();
    if (object.material)
      for (const m of Array.isArray(object.material)
        ? object.material
        : [object.material])
        m.dispose();
  });
  map.delete(id);
}
function updateTransient(dt) {
  const projectileIds = new Set();
  for (const p of game.projectiles) {
    if (p.life <= 0) continue;
    projectileIds.add(p.id);
    if (!projectileActors.has(p.id))
      projectileActors.set(p.id, makeProjectile(p.type));
    const mesh = projectileActors.get(p.id);
    mesh.position.set(p.x, p.y, p.z);
    if (p.type !== "bomb" && (p.vx || p.vy || p.vz))
      mesh.lookAt(p.x + p.vx, p.y + p.vy, p.z + p.vz);
    else mesh.rotation.y = visualTime * 2;
  }
  for (const id of projectileActors.keys())
    if (!projectileIds.has(id)) removeActor(projectileActors, id);
  const effectIds = new Set();
  for (const effect of game.effects) {
    if (effect.life <= 0) continue;
    effectIds.add(effect.id);
    if (!effectActors.has(effect.id))
      effectActors.set(effect.id, makeEffect(effect));
    const mesh = effectActors.get(effect.id),
      fraction = Math.max(0, Math.min(1, effect.life / (effect.maxLife || 1)));
    mesh.position.set(
      effect.x,
      effect.y + (effect.type === "ice" ? 0.5 : effect.type === "fire" ? 1 : 0),
      effect.z,
    );
    if (effect.type === "warning") {
      mesh.scale.setScalar(effect.radius || 3);
      mesh.position.y = heightAt(effect.x, effect.z) + 0.1;
      mesh.material.opacity = 0.45 + Math.sin(visualTime * 17) * 0.25;
    } else if (effect.type === "lightning") {
      mesh.position.y += 12;
      mesh.material.opacity = Math.sin(visualTime * 60) > 0.1 ? 0.9 : 0.25;
    } else if (effect.type === "ice")
      mesh.scale.set(1, Math.min(1, fraction * 6), 1);
    else if (effect.type === "shockwave") {
      mesh.scale.setScalar((effect.radius || 6) * (1 - fraction));
      mesh.position.y = heightAt(effect.x, effect.z) + 0.2;
    } else if (effect.type === "fire")
      mesh.scale.setScalar(1 + Math.sin(visualTime * 14) * 0.1);
    else mesh.scale.setScalar((effect.radius || 1) * (1.2 - fraction * 0.7));
    if (!["warning", "lightning"].includes(effect.type))
      mesh.material.opacity =
        effect.type === "ice" ? 0.8 : Math.min(0.7, fraction * 0.8);
  }
  for (const id of effectActors.keys())
    if (!effectIds.has(id)) removeActor(effectActors, id);
}
function clearInput() {
  keys.clear();
  pointers.clear();
  queued.clear();
  dragging = null;
  for (const button of document.querySelectorAll("[data-control]"))
    button.classList.remove("pressed");
}
function saveGame(manual = false) {
  if (game.dead) {
    if (manual) ui.toast("恢复体力后，再记录旅程。", "warning");
    return;
  }
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializeGame(game)));
    hasSave = true;
    saved = null;
    saveTimer = 0;
    if (manual) ui.toast("旅程已保存到当前浏览器。", "success");
  } catch {
    if (manual) ui.toast("浏览器未能保存，请检查可用存储空间。", "warning");
  }
}
function start(newGame = false) {
  if (newGame) {
    game = createGame();
    saveTimer = 0;
  } else if (hasSave) {
    try {
      game = restoreGame(JSON.parse(localStorage.getItem(SAVE_KEY)));
    } catch {
      game = createGame();
    }
  }
  if (game.dead) processEvents(command(game, "respawn"));
  mode = "playing";
  clearInput();
  accumulator = 0;
  lastTime = performance.now();
  cameraYaw = Math.PI;
  cameraPitch = 0.31;
  ui.setMode(mode);
  ui.update(game);
  sound.unlock();
  updateCamera(1, true);
  document.activeElement?.blur();
  ui.toast(
    newGame || !hasSave
      ? "旅程开始 · WASD 移动，E 与营地的米拉交谈。"
      : "欢迎回到原野。你的旅程已恢复。",
    "info",
  );
  saveGame();
}
function pause() {
  if (mode !== "playing") return;
  clearInput();
  mode = "paused";
  ui.update(game);
  ui.setMode(mode);
  saveGame();
}
function resume() {
  if (mode === "menu" || mode === "loading" || mode === "error") return;
  if (game.dead) return;
  if (mode === "help" && previousPanelMode === "menu") {
    showMenu();
    return;
  }
  mode = "playing";
  clearInput();
  accumulator = 0;
  lastTime = performance.now();
  ui.setMode(mode);
  ui.update(game);
  sound.unlock();
}
function showMenu() {
  saveGame();
  clearInput();
  mode = "menu";
  ui.setMode(mode, { hasSave });
  ui.update(game);
}
function openPanel(panel, data) {
  if (
    !["inventory", "map", "cook", "shop", "dialogue", "help"].includes(panel) ||
    game.dead
  )
    return;
  previousPanelMode = mode;
  clearInput();
  mode = panel;
  ui.update(game);
  ui.setMode(mode, data);
  ui.update(game);
}
function perform(action, payload = {}) {
  if (action === "save") {
    saveGame(true);
    return;
  }
  if (action === "resume" || action === "close") {
    resume();
    return;
  }
  if (action === "menu") {
    showMenu();
    return;
  }
  const beforeX = game.player.x,
    beforeZ = game.player.z;
  processEvents(command(game, action, payload));
  if (action === "respawn") {
    mode = "playing";
    ui.setMode(mode);
    clearInput();
    lastTime = performance.now();
    accumulator = 0;
    updateCamera(1, true);
    saveGame();
  }
  if (
    action === "fastTravel" &&
    (beforeX !== game.player.x || beforeZ !== game.player.z)
  ) {
    resume();
    updateCamera(1, true);
    saveGame();
  }
  ui.update(game);
  if (
    ["cook", "buy", "eat", "equipWeapon", "equipArmor", "upgrade"].includes(
      action,
    )
  )
    saveGame();
}
function queue(action) {
  if (mode !== "playing") return;
  sound.unlock();
  if (action === "cycleRune") {
    perform(action);
    return;
  }
  queued.add(action);
}
function processEvents(events = []) {
  for (const event of events) {
    if (event.type === "toast") ui.toast(event.message, event.tone || "info");
    if (event.type === "sound") {
      sound.play(event.name);
      if (event.name === "hurt" || event.name === "hit")
        shake = Math.max(shake, event.name === "hurt" ? 0.5 : 0.15);
    }
    if (event.type === "panel") openPanel(event.panel, event);
    if (event.type === "save") saveGame();
    if (event.type === "death") {
      mode = "dead";
      clearInput();
      ui.update(game);
      ui.setMode(mode, game);
    }
    if (event.type === "victory") {
      mode = "victory";
      clearInput();
      ui.update(game);
      ui.setMode(mode, game);
      saveGame();
    }
  }
}
const directions = {
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
  KeyK: "block",
  Space: "climb",
};
const actionKeys = {
  Space: "jump",
  KeyJ: "attack",
  KeyF: "bow",
  KeyL: "dodge",
  KeyE: "interact",
  KeyQ: "rune",
  KeyR: "cycleRune",
};
function held(action) {
  return (
    [...pointers.values()].includes(action) ||
    Object.entries(directions).some(
      ([key, value]) => value === action && keys.has(key),
    )
  );
}
window.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey) return;
  if (mode === "playing" && (directions[event.code] || actionKeys[event.code]))
    event.preventDefault();
  keys.add(event.code);
  if (event.repeat) return;
  if (event.code === "Escape" || event.code === "KeyP") {
    event.preventDefault();
    if (mode === "playing") pause();
    else if (!["menu", "dead", "loading", "error"].includes(mode)) resume();
    return;
  }
  if (event.code === "KeyI") {
    if (mode === "playing") openPanel("inventory");
    else if (mode === "inventory") resume();
    return;
  }
  if (event.code === "KeyM") {
    if (mode === "playing") openPanel("map");
    else if (mode === "map") resume();
    return;
  }
  if (mode === "playing" && actionKeys[event.code])
    queue(actionKeys[event.code]);
});
window.addEventListener("keyup", (event) => keys.delete(event.code));
window.addEventListener("blur", () => {
  clearInput();
  pause();
});
window.addEventListener("pagehide", () => saveGame());
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
    if (button.dataset.input === "jump") {
      queue("jump");
      button.dataset.jumpQueued = "true";
    }
  });
  button.addEventListener("click", (event) => {
    if (button.dataset.jumpQueued) {
      event.stopPropagation();
      delete button.dataset.jumpQueued;
    }
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
canvas.addEventListener("contextmenu", (event) => event.preventDefault());
canvas.addEventListener("pointerdown", (event) => {
  if (mode !== "playing") return;
  if (event.pointerType === "touch" || event.button === 2) {
    dragging = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  } else if (event.button === 0) queue("attack");
});
canvas.addEventListener("pointermove", (event) => {
  if (!dragging || dragging.id !== event.pointerId || mode !== "playing")
    return;
  cameraYaw -= (event.clientX - dragging.x) * 0.005;
  cameraPitch = THREE.MathUtils.clamp(
    cameraPitch + (event.clientY - dragging.y) * 0.003,
    0.06,
    0.85,
  );
  dragging.x = event.clientX;
  dragging.y = event.clientY;
});
for (const name of ["pointerup", "pointercancel", "lostpointercapture"])
  canvas.addEventListener(name, (event) => {
    if (dragging?.id === event.pointerId) dragging = null;
  });
canvas.addEventListener(
  "wheel",
  (event) => {
    if (mode !== "playing") return;
    event.preventDefault();
    cameraDistance = THREE.MathUtils.clamp(
      cameraDistance + event.deltaY * 0.006,
      5,
      17,
    );
  },
  { passive: false },
);
const desiredCamera = new THREE.Vector3(),
  desiredTarget = new THREE.Vector3(),
  smoothTarget = new THREE.Vector3();
function terrainAtCamera(x, z) {
  let floor = heightAt(x, z);
  for (const solid of SOLIDS)
    if (
      Math.abs(x - solid.x) < solid.width / 2 + 0.2 &&
      Math.abs(z - solid.z) < solid.depth / 2 + 0.2
    )
      floor = Math.max(floor, heightAt(solid.x, solid.z) + solid.height);
  return floor;
}
function updateCamera(dt, snap = false) {
  const p = game.player,
    mobile = innerWidth < 650 && innerHeight > innerWidth;
  if (mode === "menu" || mode === "loading") {
    const x = SPAWN.x,
      z = SPAWN.z,
      y = heightAt(x, z);
    desiredCamera.set(
      x + (mobile ? 14 : 17) + Math.sin(visualTime * 0.06) * 2,
      y + (mobile ? 12 : 9),
      z + 18,
    );
    desiredTarget.set(x + (mobile ? -4 : -15), y + 2.5, z - 14);
  } else {
    const bossNear =
      game.progress.beacons.length >= 3 &&
      game.enemies.some(
        (enemy) =>
          enemy.type === "guardian" &&
          !enemy.dead &&
          Math.hypot(enemy.x - p.x, enemy.z - p.z) < 24,
      );
    const distance =
      (bossNear ? Math.max(12, cameraDistance) : cameraDistance) *
      (mobile ? 1.32 : 1);
    const horizontal = Math.cos(cameraPitch) * distance;
    desiredTarget.set(
      p.x,
      p.y + (p.mounted ? 2.2 : bossNear ? 2.5 : 1.45),
      p.z,
    );
    desiredCamera.set(
      p.x - Math.sin(cameraYaw) * horizontal,
      p.y + Math.sin(cameraPitch) * distance + 2.4,
      p.z - Math.cos(cameraYaw) * horizontal,
    );
    desiredCamera.y = Math.max(
      desiredCamera.y,
      terrainAtCamera(desiredCamera.x, desiredCamera.z) + 1.3,
      WORLD.water + 1.5,
    );
    // Keep the camera above intervening terrain and rooftops when cresting a hill.
    for (let i = 1; i <= 5; i++) {
      const t = i / 6,
        x = THREE.MathUtils.lerp(p.x, desiredCamera.x, t),
        z = THREE.MathUtils.lerp(p.z, desiredCamera.z, t);
      const floor = terrainAtCamera(x, z) + 0.55;
      const rayY = THREE.MathUtils.lerp(desiredTarget.y, desiredCamera.y, t);
      if (floor > rayY) desiredCamera.y += (floor - rayY) / t;
    }
  }
  const blend = snap ? 1 : 1 - Math.exp(-dt * 7);
  camera.position.lerp(desiredCamera, blend);
  smoothTarget.lerp(desiredTarget, blend);
  if (shake > 0 && mode === "playing") {
    camera.position.x += (Math.random() - 0.5) * shake * 0.25;
    camera.position.y += (Math.random() - 0.5) * shake * 0.16;
  }
  camera.lookAt(smoothTarget);
  camera.fov = mobile ? 61 : 55;
  camera.updateProjectionMatrix();
}
function updateActors(dt) {
  const p = game.player;
  hero.group.position.set(p.x, p.y + (p.mounted ? 0.95 : 0), p.z);
  hero.group.rotation.y = p.yaw;
  hero.update(dt, p, visualTime);
  const h = game.horse;
  horse.group.position.set(h.x, h.y, h.z);
  horse.group.rotation.y = h.yaw || 0;
  horse.group.visible = Math.hypot(h.x - p.x, h.z - p.z) < 75;
  horse.update(dt, { speed: p.mounted ? p.speed : 0, time: visualTime });
  let nearest = null,
    nearestDistance = Infinity;
  for (const enemy of game.enemies) {
    const actor = enemyActors.get(enemy.id);
    if (!actor) continue;
    const distance = Math.hypot(enemy.x - p.x, enemy.z - p.z);
    actor.group.visible = enemy.hp > 0 && !enemy.dead && distance < 72;
    if (actor.group.visible) {
      actor.group.position.set(enemy.x, enemy.y, enemy.z);
      actor.group.rotation.y = enemy.yaw;
      actor.update(dt, enemy, visualTime);
    }
    if (enemy.hp > 0 && !enemy.dead && distance < nearestDistance) {
      nearest = enemy;
      nearestDistance = distance;
    }
  }
  activeEnemyId = nearestDistance < 18 ? nearest?.id : null;
  targetRing.visible = mode === "playing" && nearestDistance < 18;
  if (targetRing.visible) {
    targetRing.position.set(nearest.x, nearest.y + 0.06, nearest.z);
    targetRing.scale.setScalar(nearest.type === "guardian" ? 2.3 : 1);
  }
  blob.position.set(p.x, Math.max(heightAt(p.x, p.z), WORLD.water) + 0.03, p.z);
  blob.visible = p.motion !== "swim";
  blob.material.opacity = p.motion === "glide" ? 0.1 : 0.22;
  const context = game.context;
  objectiveBeam.visible =
    mode === "playing" && Boolean(context) && context.distance < 7;
  if (objectiveBeam.visible) {
    const target =
      LOCATIONS.find((l) => l.id === context.id) ||
      game.pickups.find((l) => l.id === context.id) ||
      game.chests.find((l) => l.id === context.id);
    if (target)
      objectiveBeam.position.set(
        target.x,
        heightAt(target.x, target.z) + 3.5,
        target.z,
      );
    else objectiveBeam.visible = false;
  }
  updateTransient(dt);
}
function animate(now) {
  requestAnimationFrame(animate);
  const elapsed = Math.max(0, (now - lastTime) / 1000),
    dt = Math.min(elapsed, 0.12);
  lastTime = now;
  const running = mode === "playing";
  if (running || mode === "menu") visualTime += dt;
  if (running) {
    const horizontal = (held("right") ? 1 : 0) - (held("left") ? 1 : 0),
      forward = (held("forward") ? 1 : 0) - (held("back") ? 1 : 0);
    const moveX =
      -Math.cos(cameraYaw) * horizontal + Math.sin(cameraYaw) * forward;
    const moveZ =
      Math.sin(cameraYaw) * horizontal + Math.cos(cameraYaw) * forward;
    accumulator += dt;
    while (accumulator >= 1 / 60 && mode === "playing") {
      const aiming =
        held("block") ||
        ["attack", "bow", "rune"].some((action) => queued.has(action));
      const aimYaw = aiming
        ? cameraYaw
        : Math.hypot(moveX, moveZ) > 0.05
          ? Math.atan2(moveX, moveZ)
          : game.player.yaw;
      const input = {
        moveX,
        moveZ,
        sprint: held("sprint"),
        block: held("block"),
        climb: held("climb"),
        aimYaw,
      };
      for (const action of queued) input[action] = true;
      queued.clear();
      processEvents(stepGame(game, input, 1 / 60));
      accumulator -= 1 / 60;
    }
    saveTimer += dt;
    if (saveTimer >= 15) saveGame();
  }
  world.update(running || mode === "menu" ? dt : 0, game);
  updateActors(running ? dt : 0);
  updateCamera(dt);
  sound.update(dt, game, running);
  shake = Math.max(0, shake - dt * 1.5);
  uiTimer += dt;
  if (uiTimer >= 0.12) {
    ui.update(game);
    uiTimer = 0;
  }
  renderer.render(scene, camera);
  if (!graphicsLow && elapsed > 0 && elapsed < 1 && running) {
    frameTotal += elapsed;
    frameCount++;
    if (frameCount >= 70 && frameTotal / frameCount > 0.045) {
      graphicsLow = true;
      renderer.setPixelRatio(1);
      world.setQuality(true);
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
  ui.showError("3D 原野暂时中断。刷新页面后，可以从自动存档继续旅程。");
});
mode = "menu";
ui.setSound(true);
ui.setMode(mode, { hasSave });
ui.update(game);
world.update(0, game);
updateActors(0);
updateCamera(1, true);
requestAnimationFrame(animate);
if (import.meta.env.DEV) {
  window.__wildreach = {
    get state() {
      return structuredClone({ ...game, mode });
    },
    get rendererInfo() {
      return {
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        lowQuality: graphicsLow,
      };
    },
    get camera() {
      return {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        yaw: cameraYaw,
        pitch: cameraPitch,
      };
    },
  };
}
