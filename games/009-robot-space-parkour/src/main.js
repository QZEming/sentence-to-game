import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createWorld } from './world.js';
import { createRobot } from './robot.js';
import { createUI } from './ui.js';
import { AudioSystem } from './audio.js';
import { Controller, intersectsHazard } from './physics.js';
import { createParticles } from './particles.js';
import './style.css';

const gameContainer = document.querySelector('#game');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
} catch (error) {
  gameContainer.innerHTML = '<div style="padding:10vw;color:white;background:#071016;font:20px sans-serif"><h1>ORBIT RUNNER</h1><p>此浏览器未能启动 3D 渲染。请在 Chrome / Edge 中开启硬件加速后重试。</p><button onclick="location.reload()">重新连接空间站</button></div>';
  throw error;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.23;
gameContainer.append(renderer.domElement);
renderer.domElement.setAttribute('aria-label', '废弃太空站 3D 跑酷场景');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060d17);
scene.fog = new THREE.FogExp2(0x0a1727, 0.009);
const camera = new THREE.PerspectiveCamera(57, innerWidth / innerHeight, 0.1, 650);
scene.add(new THREE.HemisphereLight(0xc0efff, 0x212844, 2.6));
const sunlight = new THREE.DirectionalLight(0xdcecff, 3.2);
sunlight.position.set(15, 25, 8); sunlight.castShadow = true;
sunlight.shadow.mapSize.set(1024, 1024);
Object.assign(sunlight.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 70 });
sunlight.shadow.bias = -0.001;
scene.add(sunlight, sunlight.target);
const rim = new THREE.DirectionalLight(0x4084ff, 2.6); rim.position.set(-15, 9, -25); scene.add(rim);
const robotLight = new THREE.PointLight(0x80dcff, 4, 9, 2); scene.add(robotLight);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.38, 0.42, 1.05);
composer.addPass(bloom); composer.addPass(new OutputPass());
let highQuality = true;
const world = createWorld(THREE, scene);
const robot = createRobot(THREE, scene);
const particles = createParticles(THREE, scene);
const audio = new AudioSystem();
const keys = new Set();
let mode = 'menu', challenge = false, time = 0, worldTime = 0;
let cells = 0, cores = 0, health = 3, checkpoint = 0, deaths = 0;
let pulseCooldown = 0, invulnerable = 0, respawnTimer = 0, lastZone = '', goalWarning = 0;
let cameraYaw = 0, cameraDistance = 9.5, drag = null, muted = false;
let best = null, winTime = 0, cameraShake = 0;
const readStorage = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const saveStorage = (key, value) => { try { localStorage.setItem(key, value); } catch { /* private browsing */ } };
muted = readStorage('orbit-muted') === '1'; audio.setMuted(muted);
const controller = new Controller(world.platforms, onAction);
controller.reset({ x: 4.2, y: 0, z: 4.8 });
const ui = createUI({ start, resume, restart: () => start(challenge ? 'challenge' : 'explore'), mute: toggleMute, quality: setQuality, menu, pause });
ui.setMuted(muted);
ui.showScreen('menu');

const pulseRing = new THREE.Mesh(new THREE.TorusGeometry(1, 0.04, 8, 80), new THREE.MeshBasicMaterial({ color: 0x82eaff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
pulseRing.rotation.x = Math.PI / 2; scene.add(pulseRing);
let pulseAge = 10;
const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.64, 32), new THREE.MeshBasicMaterial({ color: 0x01060a, transparent: true, opacity: 0.28, depthWrite: false }));
shadow.rotation.x = -Math.PI / 2; scene.add(shadow);

function onAction(name) {
  audio.play(name);
  if (name === 'jump' || name === 'doubleJump' || name === 'dash') {
    particles.burst(controller.position, name === 'dash' ? 0x7effea : 0x89caff, name === 'doubleJump' ? 26 : 13, 3);
  }
  if (name === 'land') particles.burst(controller.position, 0x889fac, 8, 1.4);
}
function start(selectedMode = 'explore') {
  audio.unlock(); audio.play('start');
  mode = 'playing'; challenge = selectedMode === 'challenge';
  time = 0; cells = 0; cores = 0; health = 3; checkpoint = 0; deaths = 0;
  pulseCooldown = 0; invulnerable = 1; respawnTimer = 0; cameraYaw = 0; lastZone = ''; goalWarning = 0;
  best = Number(readStorage(`orbit-best-${selectedMode}`)) || null;
  keys.clear();
  for (const item of world.pickups) { item.collected = false; item.mesh.visible = true; }
  for (const hazard of world.hazards) hazard.disabledUntil = 0;
  controller.reset(world.checkpoints[0]?.spawn || { x: 0, y: 0.05, z: 4 });
  robot.group.position.copy(controller.position);
  camera.position.set(controller.position.x, controller.position.y + 5.3, controller.position.z + cameraDistance);
  ui.showScreen('playing');
  document.activeElement?.blur();
  ui.toast(challenge ? '计时挑战已开始 · 收集 3 枚核心，抵达逃生舱' : '欢迎回来，R-07 · 跟随青色航灯寻找 3 枚反应堆核心');
}
function pause() {
  if (mode !== 'playing') return;
  mode = 'paused'; keys.clear(); ui.showScreen('paused'); audio.update(0, false, false);
}
function resume() {
  if (mode !== 'paused') return;
  mode = 'playing'; keys.clear(); ui.showScreen('playing'); document.activeElement?.blur();
}
function menu() {
  mode = 'menu'; keys.clear();
  respawnTimer = 0; invulnerable = 0; cameraShake = 0;
  controller.reset({ x: 4.2, y: 0, z: 4.8 });
  ui.showScreen('menu'); audio.update(0, false, false);
}
function toggleMute() { muted = !muted; audio.setMuted(muted); ui.setMuted(muted); saveStorage('orbit-muted', muted ? '1' : '0'); }
function setQuality(value) {
  highQuality = value === 'high'; renderer.shadowMap.enabled = highQuality;
  renderer.setPixelRatio(Math.min(devicePixelRatio, highQuality ? 1.5 : 1)); resize();
}
function doPulse() {
  if (pulseCooldown > 0) { ui.toast(`能量脉冲充能中 · ${Math.ceil(pulseCooldown)} 秒`); return; }
  pulseCooldown = 6; pulseAge = 0;
  pulseRing.position.set(controller.position.x, controller.position.y + 0.8, controller.position.z);
  particles.burst(controller.position, 0x75ffdd, 45, 10); audio.play('pulse');
  let disabled = 0;
  for (const hazard of world.hazards) {
    if (hazard.mesh.position.distanceTo(new THREE.Vector3(controller.position.x, controller.position.y, controller.position.z)) < 13) {
      hazard.disabledUntil = worldTime + 3.2; disabled++;
    }
  }
  ui.toast(disabled ? `EMP 脉冲 · ${disabled} 处机关暂时失效` : 'EMP 脉冲已释放 · 靠近机关时可使其短暂失效');
}
function respawn(reason = 'fall') {
  if (respawnTimer > 0 || mode !== 'playing') return;
  deaths++; health = reason === 'hazard' ? health - 1 : health;
  if (health <= 0) health = 3;
  if (challenge) time += 5;
  respawnTimer = 0.48; cameraShake = 0.28;
  particles.burst(controller.position, 0xff9861, 34, 5);
  audio.play(reason === 'hazard' ? 'hurt' : 'death');
  ui.toast(reason === 'manual' ? '导航重置 · 返回最近检查点' : `信号恢复 · 返回最近检查点${challenge ? '（+5 秒）' : ''}`);
}
function complete() {
  mode = 'won'; winTime = time; keys.clear(); audio.play('win');
  if (!best || time < best) { best = time; saveStorage(`orbit-best-${challenge ? 'challenge' : 'explore'}`, time); }
  particles.burst(controller.position, 0xffd488, 90, 9);
  ui.showScreen('won', { time, cells, cores, deaths, best, challenge });
}
function inputKey(code, down, repeat = false) {
  if (down) {
    if ((code === 'Escape' || code === 'KeyP') && !repeat) { mode === 'playing' ? pause() : resume(); return; }
    if (mode !== 'playing') return;
    keys.add(code);
    if (!repeat && code === 'Space') controller.jump();
    if (!repeat && (code === 'ShiftLeft' || code === 'ShiftRight')) controller.dash();
    if (!repeat && code === 'KeyE') doPulse();
    if (!repeat && code === 'KeyR') respawn('manual');
    if (!repeat && code === 'KeyM') toggleMute();
  } else keys.delete(code);
}
window.addEventListener('keydown', event => {
  if (!document.querySelector('[data-role="help"]').classList.contains('is-hidden')) return;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code) && mode === 'playing') event.preventDefault();
  inputKey(event.code, true, event.repeat);
});
window.addEventListener('keyup', event => inputKey(event.code, false));
window.addEventListener('orbit-control', event => inputKey(event.detail.key, event.detail.down));
window.addEventListener('orbit-pause', pause);
window.addEventListener('blur', () => { keys.clear(); pause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
renderer.domElement.addEventListener('pointerdown', event => {
  if (mode === 'playing') { drag = { x: event.clientX, id: event.pointerId }; renderer.domElement.setPointerCapture(event.pointerId); }
});
renderer.domElement.addEventListener('pointermove', event => {
  if (!drag) return;
  cameraYaw -= (event.clientX - drag.x) * 0.005; drag.x = event.clientX;
});
renderer.domElement.addEventListener('pointerup', () => { drag = null; });
renderer.domElement.addEventListener('pointercancel', () => { drag = null; });
renderer.domElement.addEventListener('wheel', event => { if (mode === 'playing') { cameraDistance = THREE.MathUtils.clamp(cameraDistance + event.deltaY * 0.008, 5.5, 15); event.preventDefault(); } }, { passive: false });

const tmpPosition = new THREE.Vector3(), cameraTarget = new THREE.Vector3();
const uiState = {};
let hudTimer = 0;
function simulate(dt) {
  worldTime += dt; world.update(worldTime, dt);
  if (mode !== 'playing') return;
  time += dt;
  invulnerable = Math.max(0, invulnerable - dt);
  pulseCooldown = Math.max(0, pulseCooldown - dt);
  goalWarning = Math.max(0, goalWarning - dt);
  if (respawnTimer > 0) {
    respawnTimer -= dt;
    if (respawnTimer <= 0) {
      controller.reset(world.checkpoints[checkpoint].spawn);
      invulnerable = 1.8;
      particles.burst(controller.position, 0x72f7ff, 24, 3);
    }
    return;
  }
  const horizontal = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
  const forward = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0);
  const lowGravity = controller.position.z < -143;
  controller.step(dt, { x: horizontal * Math.cos(cameraYaw) - forward * Math.sin(cameraYaw), z: -forward * Math.cos(cameraYaw) - horizontal * Math.sin(cameraYaw), sprint: keys.has('ControlLeft') || keys.has('ControlRight') }, lowGravity);
  const p = controller.position;
  tmpPosition.set(p.x, p.y + 0.9, p.z);
  if (p.y < -15) { respawn(); return; }
  for (const hazard of world.hazards) {
    const disabled = hazard.disabledUntil > worldTime;
    if (disabled) { hazard.mesh.visible = false; hazard.pulseWasHidden = true; }
    else if (hazard.pulseWasHidden) { hazard.mesh.visible = hazard.type === 'crusher' || hazard.active; hazard.pulseWasHidden = false; }
    if (invulnerable <= 0 && !disabled && intersectsHazard(p, hazard)) { respawn('hazard'); break; }
  }
  for (const pickup of world.pickups) {
    if (pickup.collected || pickup.mesh.position.distanceTo(tmpPosition) > (pickup.type === 'core' ? 1.7 : 1.25)) continue;
    pickup.collected = true; pickup.mesh.visible = false;
    if (pickup.type === 'core') {
      cores++; audio.play('core'); particles.burst(p, 0xffba60, 50, 6);
      ui.toast(`反应堆核心 ${cores} / 3 已回收${cores === 3 ? ' · 逃生舱已解锁！' : ' · 继续向信号源前进'}`);
    } else if (pickup.type === 'log') {
      audio.play('checkpoint'); ui.toast(pickup.label || '航行日志：即使星光熄灭，也请继续向前。');
    } else {
      cells++; audio.play('cell'); particles.burst(pickup.mesh.position, 0x75f4ff, 10, 2);
      if (cells % 10 === 0 && health < 3) { health++; ui.toast('收集 10 枚能量晶体 · 装甲修复 +1'); }
    }
  }
  for (const point of world.checkpoints) {
    if (point.index > checkpoint && point.spawn.distanceTo(new THREE.Vector3(p.x, p.y, p.z)) < 5) {
      checkpoint = point.index; health = 3; audio.play('checkpoint');
      particles.burst(p, 0x77ffd0, 38, 4); ui.toast(`检查点已保存 · ${point.name} · 装甲修复完成`);
    }
  }
  if (world.goal.position.distanceTo(new THREE.Vector3(p.x, p.y, p.z)) < 3.2) {
    if (cores >= world.totalCores) complete();
    else if (goalWarning <= 0) { goalWarning = 5; ui.toast(`逃生舱等待供能 · 还需 ${world.totalCores - cores} 枚反应堆核心`); }
  }
  const zone = p.z < -143 ? '03 / 失重遗迹' : p.z < -70 ? '02 / 反应堆长廊' : '01 / 遗弃停泊港';
  if (zone !== lastZone) {
    if (lastZone && lowGravity) ui.toast('进入失重遗迹 · 重力减弱，空中滑行距离增加');
    lastZone = zone;
  }
}
function render(dt, elapsed) {
  const p = controller.position;
  robot.group.position.set(p.x, p.y, p.z);
  robot.group.scale.setScalar(mode === 'menu' ? 1.35 : 1);
  const speed = Math.hypot(controller.velocity.x, controller.velocity.z);
  if (mode === 'menu') {
    robot.group.rotation.y = Math.PI + 0.48;
    camera.position.set(7.6 + Math.sin(elapsed * 0.12) * 0.8, 4.2, 11.8);
    camera.lookAt(-3.7, 1.6, -3);
  } else {
    const angle = Math.atan2(-controller.facing.x, -controller.facing.z);
    robot.group.rotation.y += Math.atan2(Math.sin(angle - robot.group.rotation.y), Math.cos(angle - robot.group.rotation.y)) * Math.min(1, dt * 14);
    const distance = controller.dashRemaining > 0 ? cameraDistance + 1.4 : cameraDistance;
    cameraTarget.set(p.x + Math.sin(cameraYaw) * distance, p.y + distance * 0.48 + 1.3, p.z + Math.cos(cameraYaw) * distance);
    camera.position.lerp(cameraTarget, 1 - Math.exp(-dt * 6));
    camera.lookAt(p.x - Math.sin(cameraYaw) * 2, p.y + 1.1, p.z - Math.cos(cameraYaw) * 2);
    if (cameraShake > 0) {
      cameraShake -= dt; camera.position.x += (Math.random() - 0.5) * cameraShake;
      camera.position.y += (Math.random() - 0.5) * cameraShake;
    }
  }
  robot.update(dt, { speed: mode === 'playing' ? speed : 0, grounded: mode === 'menu' || controller.grounded, jumps: controller.jumps, dashing: controller.dashRemaining > 0, time: elapsed, lowGravity: p.z < -143, invulnerable });
  robot.group.visible = respawnTimer <= 0;
  if (mode === 'playing' && controller.dashRemaining > 0) particles.burst(p, 0x73ffff, 3, 1.8);
  robotLight.position.set(p.x, p.y + 2, p.z + 1);
  sunlight.position.set(p.x + 15, p.y + 25, p.z + 8); sunlight.target.position.set(p.x, p.y, p.z - 5);
  let shadowTop = -100;
  for (const platform of world.platforms) {
    const q = platform.mesh.position, top = q.y + platform.h / 2;
    if (Math.abs(p.x - q.x) < platform.w / 2 && Math.abs(p.z - q.z) < platform.d / 2 && top <= p.y + 0.1) shadowTop = Math.max(shadowTop, top);
  }
  shadow.visible = shadowTop > -20; shadow.position.set(p.x, shadowTop + 0.03, p.z);
  shadow.material.opacity = Math.max(0.06, 0.25 - (p.y - shadowTop) * 0.025);
  shadow.scale.setScalar(1 + Math.min(8, p.y - shadowTop) * 0.1);
  pulseAge += dt; pulseRing.visible = pulseAge < 0.8;
  if (pulseRing.visible) { pulseRing.scale.setScalar(1 + pulseAge * 18); pulseRing.material.opacity = (1 - pulseAge / 0.8) * 0.8; }
  particles.update(dt);
  if (mode === 'playing') audio.update(speed, !controller.grounded, p.z < -143);
  hudTimer += dt;
  if (hudTimer > 0.06) {
    hudTimer = 0;
    Object.assign(uiState, { mode, zone: lastZone || '01 / 遗弃停泊港', progress: THREE.MathUtils.clamp((4 - p.z) / 225, 0, 1), time: mode === 'won' ? winTime : time, cells, cores, health, dash: 1 - controller.dashCooldown / 1.05, pulse: 1 - pulseCooldown / 6, checkpoint, speed, jumps: controller.jumps, lowGravity: p.z < -143, challenge, best });
    ui.update(uiState);
  }
  if (highQuality) composer.render(); else renderer.render(scene, camera);
}
function resize() {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight);
}
window.addEventListener('resize', resize);
const clock = new THREE.Clock(); let accumulator = 0, elapsed = 0;
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05); elapsed += dt;
  if (mode !== 'paused') {
    accumulator += dt;
    while (accumulator >= 1 / 120) { simulate(1 / 120); accumulator -= 1 / 120; }
  }
  render(mode === 'paused' ? 0 : dt, elapsed);
}
frame();

// Development-only read-only inspection for reproducible browser verification.
if (import.meta.env.DEV) {
  window.__orbit = {
    getState: () => ({ mode, position: { ...controller.position }, velocity: { ...controller.velocity }, grounded: controller.grounded, jumps: controller.jumps, time, cells, cores, checkpoint, deaths, health, pulseCooldown, dashCooldown: controller.dashCooldown, platforms: world.platforms.length, hazards: world.hazards.length, pickups: world.pickups.length, robotVisible: robot.group.visible }),
    getRoute: () => world.platforms.filter(platform => platform.type !== 'bounce').map(platform => ({ x: platform.mesh.position.x, y: platform.mesh.position.y + platform.h / 2, z: platform.mesh.position.z, w: platform.w, d: platform.d })),
  };
}
