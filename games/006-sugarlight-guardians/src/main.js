import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { LEVELS, TOWERS, HEROES, SPELLS } from "./data.js";
import {
  createGame,
  updateGame,
  act,
  getTowerStats,
  getLevel,
} from "./game.js";
import { createWorld } from "./world.js";
import { createTower, createEnemy, createHero } from "./actors.js";
import { createUI } from "./ui.js";
import { createAudio } from "./audio.js";
import {
  normalizeOptions,
  normalizeRecords,
  isUnlocked,
  recordRun,
} from "./progress.js";
import "./styles.css";

const SAVE_KEY = "sugarlight-guardians-progress-v1";
const canvas = document.querySelector("#game-canvas");
const sound = createAudio();
const models = { towers: new Map(), enemies: new Map() };
const zones = new Map();
const raycaster = new THREE.Raycaster(),
  pointer = new THREE.Vector2(),
  dummy = new THREE.Object3D();
let renderer,
  scene,
  camera,
  controls,
  world,
  heroModel,
  ghostBuild,
  ghostBuildType;
let state,
  mode = "loading",
  speed = 1,
  selectedPadId = null,
  pendingAction = null,
  hover = null;
let progress = readProgress(),
  lastOptions = normalizeOptions(progress.settings),
  soundEnabled = progress.sound;
let lastTime = performance.now(),
  visualTime = 0,
  uiTime = 0,
  pointerDown = null,
  previewTimer,
  lastPreviewKey;
let lowQuality = matchMedia("(pointer:coarse)").matches,
  frameCount = 0,
  frameTotal = 0;
let previewActors = [],
  pathMetrics = [];
let shotMesh,
  particleMesh,
  ringMesh,
  healthGeometry,
  healthBackMaterial,
  healthFrontMaterial,
  healthBossMaterial;
let shots = [],
  particles = [],
  rings = [];
const ui = createUI({ onAction: onUIAction });
const themes = {
  meadow: { sky: 0xf7ebda, light: 0xffefd4 },
  brook: { sky: 0xe1f2ef, light: 0xfff4dc },
  grove: { sky: 0xddd6ed, light: 0xe8e2ff },
  frost: { sky: 0xe9f2f8, light: 0xf4f5ff },
  starlight: { sky: 0xf4dfe9, light: 0xffe7dd },
};
let sunlight;

function readProgress() {
  try {
    return normalizeRecords(JSON.parse(localStorage.getItem(SAVE_KEY) || "{}"));
  } catch {
    return normalizeRecords();
  }
}
function saveProgress() {
  progress.settings = lastOptions;
  progress.sound = soundEnabled;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
  } catch {
    ui.toast("这次记录暂时无法保存，仍可继续守护。", "warning");
  }
}
function view() {
  const tower = state?.towers.find((t) => t.padId === selectedPadId);
  return {
    selectedPadId,
    selectedTowerId: tower?.id || null,
    pendingAction,
    speed,
    sound: soundEnabled,
    records: progress,
  };
}
function refreshUI() {
  if (state) ui.update(state, view());
}
function setMode(next) {
  mode = next;
  ui.setScreen(next);
  if (controls) {
    controls.enabled = next === "menu" || next === "playing";
    controls.autoRotate = next === "menu";
  }
  fitCamera();
}
function clearSelection() {
  selectedPadId = null;
  pendingAction = null;
  hover = null;
  if (ghostBuild) {
    scene.remove(ghostBuild.group);
    ghostBuild.dispose();
    ghostBuild = null;
  }
  ghostBuildType = null;
  world?.setSelection({});
  refreshUI();
}
function clearActors() {
  for (const collection of Object.values(models)) {
    for (const item of collection.values()) {
      scene.remove(item.model.group);
      item.model.dispose();
      if (item.bar) scene.remove(item.bar);
    }
    collection.clear();
  }
  if (heroModel) {
    scene.remove(heroModel.group);
    heroModel.dispose();
    heroModel = null;
  }
  for (const item of previewActors) {
    scene.remove(item.model.group);
    item.model.dispose();
  }
  previewActors = [];
  for (const zone of zones.values()) {
    scene.remove(zone.group);
    zone.material.dispose();
  }
  zones.clear();
}
function tagModel(model, tag) {
  model.group.traverse((object) => {
    Object.assign(object.userData, tag);
    if (object.isMesh)
      object.castShadow = !lowQuality && !object.material?.transparent;
  });
}
function prepare(options, preview = false) {
  clearTimeout(previewTimer);
  clearSelection();
  clearActors();
  world?.dispose();
  state = createGame(options);
  const level = getLevel(state.levelId);
  const theme = themes[level.id] || themes.meadow;
  scene.background = new THREE.Color(theme.sky);
  sunlight.color.setHex(theme.light);
  world = createWorld(scene, level, { lowQuality });
  world.setRally(
    state.hero.targetX ?? state.hero.x,
    state.hero.targetZ ?? state.hero.z,
  );
  shots = [];
  particles = [];
  rings = [];
  shotMesh.count = particleMesh.count = ringMesh.count = 0;
  controls.reset();
  controls.target.set(0, 0, 0);
  camera.position.set(26, 32, 35);
  camera.zoom = 1;
  controls.update();
  pathMetrics = level.paths.map((path) => {
    const lengths = [0];
    for (let i = 1; i < path.length; i++)
      lengths.push(
        lengths[i - 1] +
          Math.hypot(path[i].x - path[i - 1].x, path[i].z - path[i - 1].z),
      );
    return { path, lengths, total: lengths[lengths.length - 1] };
  });
  if (preview) {
    const types = ["carrot", "frost", "berry"];
    [1, 5, 9].forEach((index, i) => {
      const pad = level.pads[index % level.pads.length];
      act(state, { type: "build", padId: pad.id, towerType: types[i] });
    });
    ["puff", "hopper", "moth"].forEach((type, i) => {
      const model = createEnemy(type);
      scene.add(model.group);
      previewActors.push({ type, model, offset: i * 8 + 8 });
    });
  }
  syncModels(0);
  fitCamera();
  refreshUI();
}
function preview(options) {
  if (mode !== "menu" || !renderer) return;
  const next = normalizeOptions(options),
    key = JSON.stringify(next);
  if (key === lastPreviewKey) return;
  lastOptions = next;
  lastPreviewKey = key;
  prepare(next, true);
}
function start(options) {
  const next = normalizeOptions(options || lastOptions);
  if (next.mode === "story" && !isUnlocked(progress, next.levelId)) {
    ui.toast("先点亮上一章的星灯，就能开启这段旅程。");
    return;
  }
  sound.init();
  sound.setEnabled(soundEnabled);
  lastOptions = next;
  speed = 1;
  prepare(next);
  setMode("story");
  ui.showStory(getLevel(next.levelId));
  saveProgress();
  refreshUI();
}
function showMenu() {
  clearTimeout(previewTimer);
  setMode("menu");
  lastPreviewKey = JSON.stringify(lastOptions);
  prepare(lastOptions, true);
  ui.showMenu(progress, lastOptions);
  refreshUI();
}
function pause() {
  if (mode !== "playing") return;
  clearSelection();
  setMode("paused");
  refreshUI();
}
function resume() {
  if (mode !== "paused") return;
  lastTime = performance.now();
  setMode("playing");
  refreshUI();
}
function finish() {
  if (
    mode === "result" ||
    !state?.result ||
    !["won", "lost"].includes(state.phase)
  )
    return;
  clearSelection();
  progress = recordRun(progress, state);
  saveProgress();
  setMode("result");
  ui.showResult(state, progress);
  refreshUI();
}
function send(action) {
  if (mode !== "playing" || !state) return false;
  const result = act(state, action);
  if (!result.ok) {
    ui.toast(result.message || "暂时不能这样做。", "warning");
    sound.play("error");
    return false;
  }
  handleEvents(result.events || []);
  syncModels(0);
  refreshUI();
  if (state.result) finish();
  return true;
}
function chooseBuild(type) {
  if (mode !== "playing" || !TOWERS[type]) return;
  const occupied = state.towers.some((t) => t.padId === selectedPadId);
  if (selectedPadId && !occupied) {
    if (send({ type: "build", padId: selectedPadId, towerType: type }))
      pendingAction = null;
  } else {
    selectedPadId = null;
    pendingAction =
      pendingAction?.type === "build" && pendingAction.id === type
        ? null
        : { type: "build", id: type };
  }
  updateSelection();
  refreshUI();
}
function chooseSpell(id) {
  if (mode !== "playing" || !SPELLS[id]) return;
  if (id === "bell") {
    send({ type: "spell", spell: id });
    return;
  }
  if (state.mana < SPELLS[id].cost || state.spellCooldowns[id] > 0) {
    ui.toast(
      state.mana < SPELLS[id].cost
        ? "星能还不够，再唤醒一些团子吧。"
        : "这道魔法还在恢复。",
      "warning",
    );
    return;
  }
  selectedPadId = null;
  pendingAction =
    pendingAction?.type === "spell" && pendingAction.id === id
      ? null
      : { type: "spell", id };
  updateSelection();
  refreshUI();
}
function onUIAction(action) {
  if (!action || !renderer) return;
  switch (action.type) {
    case "preview":
      clearTimeout(previewTimer);
      previewTimer = setTimeout(() => preview(action.options), 90);
      return;
    case "start":
      start(action.options || ui.getOptions());
      return;
    case "storyContinue":
      if (mode === "story") {
        setMode("playing");
        lastTime = performance.now();
        refreshUI();
      }
      return;
    case "menu":
      showMenu();
      return;
    case "retry":
      start(lastOptions);
      return;
    case "nextLevel": {
      const index = LEVELS.findIndex((l) => l.id === state.levelId);
      if (LEVELS[index + 1])
        start({ ...lastOptions, mode: "story", levelId: LEVELS[index + 1].id });
      else showMenu();
      return;
    }
    case "pause":
      pause();
      return;
    case "resume":
      resume();
      return;
    case "sound":
      sound.init();
      soundEnabled = !soundEnabled;
      sound.setEnabled(soundEnabled);
      saveProgress();
      refreshUI();
      return;
    case "speed":
      if (mode === "playing") {
        speed = speed === 3 ? 1 : speed + 1;
        sound.play("click");
        refreshUI();
      }
      return;
    case "rotate": {
      const offset = camera.position.clone().sub(controls.target);
      offset.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        (Number(action.delta) || 1) * 0.22,
      );
      camera.position.copy(controls.target).add(offset);
      controls.update();
      return;
    }
    case "zoom":
      camera.zoom = THREE.MathUtils.clamp(
        camera.zoom - (Number(action.delta) || 1) * 0.15,
        0.65,
        1.8,
      );
      camera.updateProjectionMatrix();
      return;
    case "cancelSelection":
      clearSelection();
      return;
    case "selectBuild":
      chooseBuild(action.towerType);
      return;
    case "selectSpell":
      chooseSpell(action.spell);
      return;
    case "selectHero":
      if (mode !== "playing") return;
      selectedPadId = null;
      pendingAction =
        pendingAction?.type === "rally"
          ? null
          : { type: "rally", id: state.hero.type };
      updateSelection();
      refreshUI();
      return;
    case "sell": {
      if (send(action)) clearSelection();
      return;
    }
    case "startWave":
    case "autoWave":
    case "upgrade":
    case "priority":
      send(action);
      updateSelection();
      return;
  }
}
function pick(clientX, clientY, groundOnly = false) {
  if (!world || !camera) return null;
  const rect = canvas.getBoundingClientRect();
  pointer.set(
    ((clientX - rect.left) / rect.width) * 2 - 1,
    (-(clientY - rect.top) / rect.height) * 2 + 1,
  );
  raycaster.setFromCamera(pointer, camera);
  const objects = groundOnly
    ? [world.ground]
    : [
        ...world.pickables,
        ...[...models.towers.values()].map((item) => item.model.group),
        world.ground,
      ];
  const hits = raycaster.intersectObjects(objects.filter(Boolean), true);
  for (const hit of hits) {
    const { x, z } = hit.point;
    if (Math.abs(x) > 15.2 || Math.abs(z) > 12.2) continue;
    let object = hit.object,
      padId;
    while (object && !padId) {
      padId = object.userData.padId;
      object = object.parent;
    }
    if (!padId && !groundOnly) {
      const closest = getLevel(state.levelId).pads.find(
        (p) => Math.hypot(p.x - x, p.z - z) <= 0.95,
      );
      padId = closest?.id;
    }
    return { x, z, padId: padId || null };
  }
  return null;
}
function handleClick(event) {
  if (mode !== "playing") return;
  const ground =
    pendingAction?.type === "spell" || pendingAction?.type === "rally";
  const hit = pick(event.clientX, event.clientY, ground);
  if (!hit) return;
  hover = hit;
  if (pendingAction?.type === "spell") {
    if (send({ type: "spell", spell: pendingAction.id, x: hit.x, z: hit.z }))
      pendingAction = null;
  } else if (pendingAction?.type === "rally") {
    if (send({ type: "rally", x: hit.x, z: hit.z })) {
      world.setRally(state.hero.targetX, state.hero.targetZ);
      pendingAction = null;
    }
  } else if (hit.padId) {
    const tower = state.towers.find((t) => t.padId === hit.padId);
    selectedPadId = hit.padId;
    if (tower) pendingAction = null;
    else if (pendingAction?.type === "build") {
      if (
        send({ type: "build", padId: hit.padId, towerType: pendingAction.id })
      )
        pendingAction = null;
    }
  } else {
    selectedPadId = null;
    pendingAction = null;
  }
  updateSelection();
  refreshUI();
}
function updateSelection() {
  if (!world || !state) return;
  const level = getLevel(state.levelId);
  if (pendingAction?.type === "build") {
    const pad = level.pads.find((p) => p.id === hover?.padId);
    const valid = Boolean(
      pad &&
        !state.towers.some((t) => t.padId === pad.id) &&
        state.candy >= TOWERS[pendingAction.id].cost,
    );
    if (pad)
      world.setSelection({
        padId: pad.id,
        range: getTowerStats({ type: pendingAction.id, level: 1, branch: null })
          .range,
        valid,
        buildType: pendingAction.id,
      });
    else world.setSelection({});
    if (ghostBuildType !== pendingAction.id) {
      if (ghostBuild) {
        scene.remove(ghostBuild.group);
        ghostBuild.dispose();
      }
      ghostBuildType = pendingAction.id;
      ghostBuild = createTower(ghostBuildType);
      ghostBuild.group.traverse((object) => {
        if (object.isMesh && !object.userData.decorative) {
          object.castShadow = false;
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          for (const material of materials) {
            material.transparent = true;
            material.opacity = 0.46;
            material.depthWrite = false;
          }
        }
      });
      scene.add(ghostBuild.group);
    }
    ghostBuild.group.visible = Boolean(
      pad && !state.towers.some((t) => t.padId === pad.id),
    );
    if (pad)
      ghostBuild.update(
        { x: pad.x, z: pad.z, angle: 0, level: 1, flash: 0 },
        0,
        visualTime,
      );
  } else {
    if (ghostBuild) {
      scene.remove(ghostBuild.group);
      ghostBuild.dispose();
      ghostBuild = null;
      ghostBuildType = null;
    }
    if (pendingAction?.type === "spell" && hover) {
      world.setSelection({
        x: hover.x,
        z: hover.z,
        range: SPELLS[pendingAction.id].radius,
        valid: true,
      });
    } else if (pendingAction?.type === "rally" && hover) {
      world.setSelection({ x: hover.x, z: hover.z, range: 1.25, valid: true });
    } else {
      const pad = level.pads.find((p) => p.id === selectedPadId);
      const tower = state.towers.find((t) => t.padId === selectedPadId);
      if (pad)
        world.setSelection({
          padId: pad.id,
          range: tower ? getTowerStats(tower).range : 0,
          valid: true,
        });
      else world.setSelection({});
    }
  }
  canvas.style.cursor =
    mode === "playing" && pendingAction
      ? "crosshair"
      : hover?.padId
        ? "pointer"
        : "grab";
}
function createHealthBar(boss) {
  const group = new THREE.Group(),
    width = boss ? 1.7 : 0.88;
  const back = new THREE.Mesh(healthGeometry, healthBackMaterial);
  const front = new THREE.Mesh(
    healthGeometry,
    boss ? healthBossMaterial : healthFrontMaterial,
  );
  back.scale.set(width, 0.095, 1);
  front.scale.set(width, 0.075, 1);
  front.position.z = 0.008;
  back.renderOrder = front.renderOrder = 20;
  group.add(back, front);
  group.userData = { front, width };
  scene.add(group);
  return group;
}
function syncModels(dt) {
  if (!state || !scene) return;
  for (const [kind, factory] of [
    ["towers", createTower],
    ["enemies", createEnemy],
  ]) {
    const collection = models[kind],
      ids = new Set();
    for (const data of state[kind]) {
      ids.add(data.id);
      const key =
        data.type + ":" + (data.level || "") + ":" + (data.branch || "");
      let item = collection.get(data.id);
      if (item && item.key !== key) {
        scene.remove(item.model.group);
        item.model.dispose();
        if (item.bar) scene.remove(item.bar);
        collection.delete(data.id);
        item = null;
      }
      if (!item) {
        const model =
          kind === "towers"
            ? factory(data.type, data.level, data.branch)
            : factory(data.type);
        tagModel(
          model,
          kind === "towers"
            ? { towerId: data.id, padId: data.padId }
            : { enemyId: data.id },
        );
        scene.add(model.group);
        item = {
          model,
          key,
          bar:
            kind === "enemies"
              ? createHealthBar(data.boss || data.type === "boss")
              : null,
        };
        collection.set(data.id, item);
      }
      item.model.update(data, dt, visualTime);
      if (item.bar) {
        const ratio = THREE.MathUtils.clamp(
          data.hp / Math.max(1, data.maxHp),
          0,
          1,
        );
        item.bar.visible = ratio < 0.999 || data.boss || data.type === "boss";
        item.bar.position.set(
          data.x,
          data.boss || data.type === "boss" ? 2.8 : data.flying ? 2.35 : 1.8,
          data.z,
        );
        item.bar.quaternion.copy(camera.quaternion);
        const { front, width } = item.bar.userData;
        front.scale.x = width * ratio;
        front.position.x = (-width * (1 - ratio)) / 2;
      }
    }
    for (const [id, item] of collection) {
      if (!ids.has(id)) {
        scene.remove(item.model.group);
        item.model.dispose();
        if (item.bar) scene.remove(item.bar);
        collection.delete(id);
      }
    }
  }
  if (!heroModel) {
    heroModel = createHero(state.hero.type || state.options.hero);
    tagModel(heroModel, { hero: true });
    scene.add(heroModel.group);
  }
  heroModel.update(state.hero, dt, visualTime);
  world.setOccupied(state.towers);
  const zoneIds = new Set();
  for (const data of state.zones) {
    zoneIds.add(data.id);
    let item = zones.get(data.id);
    if (!item) {
      const material = new THREE.MeshBasicMaterial({
        color: 0x83dfe2,
        transparent: true,
        opacity: 0.17,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(zoneGeometry, material);
      mesh.rotation.x = -Math.PI / 2;
      const group = new THREE.Group();
      group.add(mesh);
      scene.add(group);
      item = { group, material };
      zones.set(data.id, item);
    }
    item.group.position.set(data.x, 0.315, data.z);
    item.group.scale.setScalar(data.radius);
    item.material.opacity = 0.12 + Math.sin(visualTime * 3) * 0.035;
  }
  for (const [id, item] of zones)
    if (!zoneIds.has(id)) {
      scene.remove(item.group);
      item.material.dispose();
      zones.delete(id);
    }
}
let zoneGeometry;
function makeEffects() {
  healthGeometry = new THREE.PlaneGeometry(1, 1);
  healthBackMaterial = new THREE.MeshBasicMaterial({
    color: 0x52485c,
    transparent: true,
    opacity: 0.8,
    depthTest: false,
    depthWrite: false,
  });
  healthFrontMaterial = new THREE.MeshBasicMaterial({
    color: 0x9eeb9c,
    depthTest: false,
    depthWrite: false,
  });
  healthBossMaterial = new THREE.MeshBasicMaterial({
    color: 0xf6a2d0,
    depthTest: false,
    depthWrite: false,
  });
  zoneGeometry = new THREE.CircleGeometry(1, 48);
  shotMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 7, 5),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    128,
  );
  particleMesh = new THREE.InstancedMesh(
    new THREE.OctahedronGeometry(1),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    256,
  );
  const ringGeometry = new THREE.RingGeometry(0.87, 1, 48);
  ringGeometry.rotateX(-Math.PI / 2);
  ringMesh = new THREE.InstancedMesh(
    ringGeometry,
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    32,
  );
  for (const mesh of [shotMesh, particleMesh, ringMesh]) {
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);
  }
}
function burst(x, z, color, count = 8) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2,
      velocity = 0.5 + Math.random() * 2;
    particles.push({
      x,
      y: 0.8,
      z,
      vx: Math.sin(angle) * velocity,
      vz: Math.cos(angle) * velocity,
      vy: 1 + Math.random() * 2,
      age: 0,
      duration: 0.65 + Math.random() * 0.5,
      color,
    });
  }
  if (particles.length > 256) particles.splice(0, particles.length - 256);
}
function pulse(x, z, radius, color) {
  rings.push({ x, z, radius, color, age: 0, duration: 0.65 });
  if (rings.length > 32) rings.shift();
}
function handleEvents(events) {
  for (const e of events) {
    const x = e.x ?? e.to?.x ?? 0,
      z = e.z ?? e.to?.z ?? 0;
    if (e.type === "shot" && e.from && e.to) {
      shots.push({
        from: e.from,
        to: e.to,
        color: e.color || "#ffd880",
        age: 0,
        duration: e.kind === "spark" ? 0.1 : 0.24,
      });
      if (shots.length > 128) shots.shift();
      sound.play("shot");
    } else if (e.type === "kill") {
      burst(x, z, e.color || "#ffe5a2", 7);
      sound.play("kill");
    } else if (e.type === "build" || e.type === "upgrade") {
      const tower = state.towers.find((t) => t.id === (e.towerId || e.id));
      burst(tower?.x ?? x, tower?.z ?? z, "#d2f3ae", 14);
      sound.play(e.type);
    } else if (e.type === "sell") {
      burst(x, z, "#ffe8a0", 8);
      sound.play("click");
    } else if (e.type === "spell") {
      const core = getLevel(state.levelId).core;
      pulse(
        e.spell === "bell" ? core.x : x,
        e.spell === "bell" ? core.z : z,
        SPELLS[e.spell]?.radius || 4,
        "#ecc0f6",
      );
      burst(x, z, "#fff2b0", 22);
      sound.play("spell");
    } else if (e.type === "leak") {
      const core = getLevel(state.levelId).core;
      pulse(core.x, core.z, 2, "#f2a2ab");
      sound.play("leak");
    } else if (e.type === "waveStart") {
      sound.play("waveStart");
      ui.toast("第 " + state.wave + " 波来了，守住星灯！");
    } else if (e.type === "waveClear") {
      sound.play("waveClear");
      ui.toast("这一波的团子都醒来啦！可以整理防线。");
    } else if (e.type === "win" || e.type === "lose") {
      sound.play(e.type);
      if (e.type === "win")
        for (const pad of getLevel(state.levelId).pads.slice(0, 8))
          burst(pad.x, pad.z, "#ffe5a2", 12);
    }
  }
}
function updateEffects(dt) {
  const color = new THREE.Color();
  shots = shots.filter((p) => (p.age += dt) < p.duration);
  shots.forEach((p, i) => {
    const t = p.age / p.duration;
    dummy.position.set(
      THREE.MathUtils.lerp(p.from.x, p.to.x, t),
      0.9 + Math.sin(t * Math.PI) * 0.65,
      THREE.MathUtils.lerp(p.from.z, p.to.z, t),
    );
    dummy.rotation.set(0, 0, 0);
    dummy.scale.setScalar(0.11);
    dummy.updateMatrix();
    shotMesh.setMatrixAt(i, dummy.matrix);
    shotMesh.setColorAt(i, color.set(p.color));
  });
  shotMesh.count = shots.length;
  particles = particles.filter((p) => (p.age += dt) < p.duration);
  particles.forEach((p, i) => {
    p.x += p.vx * dt;
    p.z += p.vz * dt;
    p.y += p.vy * dt;
    p.vy -= 4 * dt;
    dummy.position.set(p.x, Math.max(0.32, p.y), p.z);
    dummy.rotation.set(p.age * 3, p.age * 2, 0);
    dummy.scale.setScalar(0.12 * (1 - p.age / p.duration));
    dummy.updateMatrix();
    particleMesh.setMatrixAt(i, dummy.matrix);
    particleMesh.setColorAt(i, color.set(p.color));
  });
  particleMesh.count = particles.length;
  rings = rings.filter((p) => (p.age += dt) < p.duration);
  rings.forEach((p, i) => {
    dummy.position.set(p.x, 0.33, p.z);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.setScalar((0.15 + (p.age / p.duration) * 0.85) * p.radius);
    dummy.updateMatrix();
    ringMesh.setMatrixAt(i, dummy.matrix);
    ringMesh.setColorAt(i, color.set(p.color));
  });
  ringMesh.count = rings.length;
  for (const mesh of [shotMesh, particleMesh, ringMesh]) {
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }
}
function pathPoint(distance) {
  const metric = pathMetrics[0],
    d = ((distance % metric.total) + metric.total) % metric.total;
  let i = 1;
  while (i < metric.lengths.length - 1 && metric.lengths[i] < d) i++;
  const a = metric.path[i - 1],
    b = metric.path[i],
    t =
      (d - metric.lengths[i - 1]) /
      Math.max(0.001, metric.lengths[i] - metric.lengths[i - 1]);
  return {
    x: a.x + (b.x - a.x) * t,
    z: a.z + (b.z - a.z) * t,
    heading: Math.atan2(b.x - a.x, b.z - a.z),
  };
}
function fitCamera() {
  if (!renderer || !camera) return;
  const w = innerWidth,
    h = innerHeight,
    aspect = w / h,
    height = Math.max(innerHeight < 520 ? 34 : 28, 34 / aspect);
  camera.left = (-height * aspect) / 2;
  camera.right = (height * aspect) / 2;
  camera.top = height / 2;
  camera.bottom = -height / 2;
  const offsetX = mode === "menu" && w >= 960 ? -w * 0.14 : 0;
  const offsetY =
    mode === "menu" && w < 960
      ? Math.max(0, h / 2 - 175)
      : mode === "playing" && w < 620
        ? 45
        : 0;
  camera.setViewOffset(w, h, offsetX, offsetY, w, h);
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, lowQuality ? 1 : 1.6));
  renderer.setSize(w, h);
}
function frame(time) {
  requestAnimationFrame(frame);
  const dt = Math.max(0, Math.min(0.1, (time - lastTime) / 1000));
  lastTime = time;
  const animationDt = mode === "paused" || mode === "story" ? 0 : dt;
  visualTime += animationDt;
  if (mode === "playing") {
    const events = updateGame(state, dt * speed);
    handleEvents(events);
    if (state.result) finish();
  }
  if (mode === "menu")
    for (const item of previewActors) {
      const point = pathPoint(visualTime * 1.4 + item.offset);
      item.model.update(
        {
          ...point,
          type: item.type,
          hp: 1,
          maxHp: 1,
          speed: 1,
          flying: item.type === "moth",
          slow: 1,
        },
        dt,
        visualTime,
      );
    }
  controls.update();
  world?.update(animationDt, visualTime);
  syncModels(animationDt);
  updateEffects(animationDt);
  sound.update(dt, mode === "playing");
  uiTime += dt;
  if (uiTime > 0.08) {
    uiTime = 0;
    refreshUI();
    updateSelection();
  }
  renderer.render(scene, camera);
  if (!lowQuality && mode === "playing") {
    frameTotal += dt;
    frameCount++;
    if (frameCount >= 100) {
      if (frameTotal / frameCount > 0.043) {
        lowQuality = true;
        renderer.shadowMap.enabled = false;
        fitCamera();
      }
      frameTotal = 0;
      frameCount = 0;
    }
  }
}
function bindInput() {
  canvas.addEventListener("pointerdown", (event) => {
    pointerDown = {
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
      multi: !event.isPrimary,
      at: performance.now(),
    };
  });
  canvas.addEventListener("pointerup", (event) => {
    if (
      pointerDown &&
      pointerDown.id === event.pointerId &&
      !pointerDown.multi &&
      event.button === 0 &&
      Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) <
        7
    )
      handleClick(event);
    pointerDown = null;
  });
  canvas.addEventListener("pointercancel", () => {
    pointerDown = null;
  });
  canvas.addEventListener("pointermove", (event) => {
    if (mode !== "playing") return;
    hover = pick(
      event.clientX,
      event.clientY,
      pendingAction?.type === "spell" || pendingAction?.type === "rally",
    );
    if (pendingAction) updateSelection();
  });
  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    clearSelection();
  });
  addEventListener("keydown", (event) => {
    if (
      /^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName) ||
      event.target?.isContentEditable ||
      event.repeat
    )
      return;
    const code = event.code;
    if (code === "Escape") {
      event.preventDefault();
      if (pendingAction || selectedPadId) clearSelection();
      else if (mode === "playing") pause();
      return;
    }
    if (code === "KeyP") {
      event.preventDefault();
      mode === "paused" ? resume() : pause();
      return;
    }
    if (code === "KeyM") {
      onUIAction({ type: "sound" });
      return;
    }
    if (mode !== "playing") return;
    if (/^Digit[1-6]$/.test(code)) {
      chooseBuild(Object.keys(TOWERS)[Number(code.slice(-1)) - 1]);
      event.preventDefault();
    } else if (code === "Space") {
      event.preventDefault();
      send({ type: "startWave" });
    } else if (code === "KeyQ") chooseSpell("meteor");
    else if (code === "KeyW") chooseSpell("frost");
    else if (code === "KeyE") chooseSpell("bell");
    else if (code === "KeyH") onUIAction({ type: "selectHero" });
    else if (code === "KeyF") onUIAction({ type: "speed" });
  });
  addEventListener("resize", fitCamera);
  addEventListener("blur", () => {
    pointerDown = null;
    pause();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    pause();
    ui.toast("画面连接中断，请重新加载后继续。", "warning");
  });
}
function showError(error) {
  console.error(error);
  const box = document.querySelector("#error-overlay");
  if (box) {
    box.hidden = false;
    const label =
      box.querySelector("[data-error-message]") || box.querySelector("p");
    if (label)
      label.textContent =
        "星灯小岛暂时没能展开。请使用支持 WebGL 的浏览器，或重新加载页面。";
  }
}
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  const gl = renderer.getContext(),
    debug = gl.getExtension("WEBGL_debug_renderer_info");
  if (
    debug &&
    /swiftshader|llvmpipe|software/i.test(
      gl.getParameter(debug.UNMASKED_RENDERER_WEBGL),
    )
  )
    lowQuality = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = !lowQuality;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfffbec, 0x95ada4, 2.1));
  sunlight = new THREE.DirectionalLight(0xffefd4, 3.0);
  sunlight.position.set(-14, 30, 18);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(1024, 1024);
  Object.assign(sunlight.shadow.camera, {
    left: -22,
    right: 22,
    top: 22,
    bottom: -22,
    near: 0.5,
    far: 90,
  });
  sunlight.shadow.bias = -0.0004;
  sunlight.shadow.normalBias = 0.045;
  scene.add(sunlight);
  const pmrem = new THREE.PMREMGenerator(renderer),
    room = new RoomEnvironment();
  const reflection = pmrem.fromScene(room, 0.04, 0.1, 100, {
    size: lowQuality ? 64 : 128,
  });
  scene.environment = reflection.texture;
  scene.environmentIntensity = 0.35;
  room.dispose();
  pmrem.dispose();
  camera = new THREE.OrthographicCamera(-20, 20, 15, -15, 0.1, 180);
  camera.position.set(26, 32, 35);
  controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.minPolarAngle = 0.45;
  controls.maxPolarAngle = 1.13;
  controls.minZoom = 0.65;
  controls.maxZoom = 1.8;
  controls.rotateSpeed = 0.55;
  controls.zoomSpeed = 0.7;
  controls.autoRotateSpeed = 0.22;
  controls.saveState();
  makeEffects();
  sound.setEnabled(soundEnabled);
  bindInput();
  Object.defineProperty(window, "__sugar", {
    value: {
      get state() {
        return structuredClone({
          ...state,
          mode,
          view: view(),
          records: progress,
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
      projectPoint(x, z, y = 0.35) {
        const p = new THREE.Vector3(x, y, z).project(camera);
        return {
          x: ((p.x + 1) / 2) * innerWidth,
          y: ((1 - p.y) / 2) * innerHeight,
          visible: Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1,
        };
      },
      projectPad(id) {
        const pad = getLevel(state.levelId).pads.find((p) => p.id === id);
        return pad ? this.projectPoint(pad.x, pad.z, 0.4) : null;
      },
    },
    writable: false,
    configurable: false,
  });
  showMenu();
  lastTime = performance.now();
  requestAnimationFrame(frame);
} catch (error) {
  showError(error);
}
