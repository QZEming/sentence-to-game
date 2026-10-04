import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { createWorld, createMole, TILE } from './world.js';
import { createUI } from './ui.js';
import { CaveAudio } from './audio.js';

const canvas = document.querySelector('#game');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:'high-performance'});
} catch (error) {
  document.querySelector('#loading').innerHTML = '<strong>洞窟暂时无法打开</strong><span>请使用支持 WebGL 的浏览器，并开启硬件加速后刷新。</span>';
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#111f1b');
scene.fog = new THREE.FogExp2('#111f1b', .021);
const camera = new THREE.PerspectiveCamera(43, innerWidth / innerHeight, .1, 180);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight), .38, .55, 1.05);
composer.addPass(bloom);
scene.add(new THREE.HemisphereLight('#c9ebcf','#354333', 2.0));
const keyLight = new THREE.DirectionalLight('#ffe6b3', 2.5);
keyLight.position.set(15,30,10); keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048,2048);
Object.assign(keyLight.shadow.camera,{left:-27,right:27,top:27,bottom:-27,near:.5,far:100});
keyLight.shadow.bias = -.0007; keyLight.shadow.normalBias = .04;
scene.add(keyLight, keyLight.target);
const fillLight = new THREE.DirectionalLight('#8fc6ba', 1.0);
fillLight.position.set(-15,12,-10); scene.add(fillLight);
const lantern = new THREE.PointLight('#ffce7c', 14, 12, 2);
scene.add(lantern);

const ui = createUI();
const audio = new CaveAudio();
const clock = new THREE.Timer();
clock.connect(document);
const keys = new Set();
const player = { x:0,z:0,heading:0,invincible:0,digTimer:0,moving:false };
const mole = createMole();
mole.scale.setScalar(1.35);
const headlampLens=mole.getObjectByName('headlampLens');
const headlampGlint=mole.getObjectByName('headlampGlint');
scene.add(mole);
let world, revealed = new Set(), path = [], cameraAngle=.66, zoom=25;
let cameraTarget = new THREE.Vector3(), currentCameraTarget = new THREE.Vector3();
let state, hudTimer=0, saveTimer=0, stepTimer=0, levelTime=0, isModal=false, modalType='';
let ambientTime=0, lastCampToast=-100, lastExitToast=-100, autoSaveAvailable=true;
let returnTimer=0;
const particles=[], sonarRings=[];
const particleGeometry = new THREE.IcosahedronGeometry(.08,0);
const raycaster = new THREE.Raycaster();
const groundPlane = new THREE.Plane(new THREE.Vector3(0,1,0),0);
const targetMarker = new THREE.Mesh(new THREE.RingGeometry(.27,.33,32),new THREE.MeshBasicMaterial({color:'#d6e8a3',transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}));
targetMarker.rotation.x=-Math.PI/2; targetMarker.visible=false; scene.add(targetMarker);

const STORAGE='beneath-expedition-v1';
let saved=null;
try { saved=JSON.parse(localStorage.getItem(STORAGE)||'null'); } catch {}
function freshState(level=1,carry={}) {
  return {health:100,energy:100,crystals:carry.crystals||0,crystalsCollected:0,relics:0,mushrooms:carry.mushrooms??2,level,depth:12+(level-1)*18,explored:0,sonarCooldown:0,lightOn:true,paused:false,goalCrystals:8,goalRelics:3,upgrades:carry.upgrades||{speed:0,lamp:0,sonar:0},time:0,score:carry.score||0,sound:carry.sound??audio.enabled,dug:[],status:'playing',seed:`MR-${String(2407+level*317).padStart(4,'0')}`};
}
function loadLevel(level=1,carry={},restore=null) {
  if(world) world.dispose();
  world=createWorld(scene,level); world.cellSize=TILE;
  state=freshState(level,carry);
  revealed=new Set(); path=[]; targetMarker.visible=false;
  player.x=world.spawn.x*TILE; player.z=world.spawn.z*TILE; player.heading=Math.PI*.25; player.invincible=0;
  if(restore && restore.version===1 && restore.level===level && restore.status==='playing') {
    Object.assign(state,restore.state,{paused:false,status:'playing'});
    if(restore.player && Number.isFinite(restore.player.x)&&Number.isFinite(restore.player.z)) Object.assign(player,restore.player);
    revealed=new Set(restore.revealed||[]);
    for(const key of state.dug||[]) {const [x,z]=key.split(',').map(Number); if(world.grid[z]?.[x]===2){world.grid[z][x]=0;world.wallMeshes.get(key)?.removeFromParent();world.wallMeshes.delete(key);}}
    for(const item of world.collectibles) if(restore.collected?.includes(item.id)){item.collected=true;item.mesh.visible=false;}
  }
  for(const enemy of world.enemies) {
    enemy.px=enemy.x*TILE; enemy.pz=enemy.z*TILE; enemy.home={x:enemy.x,z:enemy.z}; enemy.attackCooldown=0; enemy.stunned=0; enemy.wander=0; enemy.route=[];
  }
  audio.enabled=state.sound;
  levelTime=state.time||0; saveTimer=0; returnTimer=0;state.campCooldown=state.campCooldown||0;
  currentCameraTarget.set(player.x,0,player.z);
  keyLight.position.set(player.x+10,30,player.z-8);
  keyLight.target.position.set(player.x,0,player.z);
  mole.position.set(player.x,0,player.z); reveal(4);
  ui.hideModal(); isModal=false; modalType='';
  refreshHUD(); updateCamera(1,true); save();
}

function solid(x,z) { return world.grid[z]?.[x]!==0; }
function canStand(x,z,radius=.34) {
  const cells=[[x-radius,z-radius],[x+radius,z-radius],[x-radius,z+radius],[x+radius,z+radius]];
  return cells.every(([px,pz])=>!solid(Math.floor(px/TILE+.5),Math.floor(pz/TILE+.5)));
}
function reveal(radius) {
  const cx=Math.round(player.x/TILE),cz=Math.round(player.z/TILE);
  for(let z=cz-radius;z<=cz+radius;z++) for(let x=cx-radius;x<=cx+radius;x++) {
    if(x>=0&&z>=0&&x<world.size&&z<world.size&&Math.hypot(x-cx,z-cz)<=radius+.3) revealed.add(`${x},${z}`);
  }
}
function findPath(fromX,fromZ,toX,toZ,max=2000) {
  if(solid(toX,toZ)) return [];
  const start=`${fromX},${fromZ}`,goal=`${toX},${toZ}`,queue=[[fromX,fromZ]],prev=new Map([[start,null]]);
  let n=0;
  while(n<queue.length&&n<max){
    const [x,z]=queue[n++],key=`${x},${z}`;
    if(key===goal){const route=[];let p=key;while(p!==start){const [rx,rz]=p.split(',').map(Number);route.push({x:rx*TILE,z:rz*TILE});p=prev.get(p);}return route.reverse();}
    for(const [dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]) {const nx=x+dx,nz=z+dz,k=`${nx},${nz}`;if(!solid(nx,nz)&&!prev.has(k)){prev.set(k,key);queue.push([nx,nz]);}}
  }
  return [];
}
function navigateTo(x,z) {
  if(isModal||state.status!=='playing')return;
  if(!revealed.has(`${x},${z}`)){ui.toast('先靠近这里，或用 Q 声呐探索迷雾。');return;}
  path=findPath(Math.round(player.x/TILE),Math.round(player.z/TILE),x,z);
  if(path.length){targetMarker.position.set(x*TILE,.07,z*TILE);targetMarker.visible=true;}
  else if(solid(x,z)) ui.toast(world.grid[z]?.[x]===2?'松软的泥土：走近后按空格挖掘。':'这块岩石太坚硬了，试试另一条路。');
}
function burst(x,z,color,count=12) {
  const material=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.6,roughness:.8});
  for(let i=0;i<count;i++) {
    const mesh=new THREE.Mesh(particleGeometry,material);mesh.position.set(x,.5,z);scene.add(mesh);
    const angle=Math.random()*Math.PI*2,speed=1+Math.random()*2;
    particles.push({mesh,vx:Math.cos(angle)*speed,vz:Math.sin(angle)*speed,vy:1.5+Math.random()*3,life:.5+Math.random()*.5,shared:material});
  }
}
function dig() {
  if(player.digTimer>0||state.status!=='playing')return;
  if(state.energy<14){ui.toast('体力不足，稍微休息一下。','warning');return;}
  player.digTimer=.4;state.energy-=14;audio.play('dig');
  let nearest=null,min=Infinity;
  const cx=Math.round(player.x/TILE),cz=Math.round(player.z/TILE);
  for(let z=cz-1;z<=cz+1;z++)for(let x=cx-1;x<=cx+1;x++){
    if(world.grid[z]?.[x]!==2)continue;
    const distance=Math.hypot(x*TILE-player.x,z*TILE-player.z);
    if(distance<2.8&&distance<min){min=distance;nearest={x,z};}
  }
  let hitEnemy=false;
  for(const e of world.enemies)if(Math.hypot(e.px-player.x,e.pz-player.z)<2.8){e.stunned=4;e.attackCooldown=4;burst(e.px,e.pz,'#d2d990',6);hitEnemy=true;}
  if(nearest){
    const {x,z}=nearest,key=`${x},${z}`;
    world.grid[z][x]=0;world.wallMeshes.get(key)?.removeFromParent();world.wallMeshes.delete(key);state.dug.push(key);
    burst(x*TILE,z*TILE,'#bbaa76',18);state.score+=15;ui.toast('打通新通道 · 探索 +15','success');reveal(4);save();
  }else if(hitEnemy)ui.toast('甲虫晕头转向了！趁现在通过。','success');
  else{burst(player.x+Math.sin(player.heading)*.7,player.z+Math.cos(player.heading)*.7,'#a28f62',6);ui.toast('靠近带裂纹的土墙挖掘，也能震晕附近的甲虫。');}
}
function sonar() {
  if(state.sonarCooldown>0){ui.toast(`声呐还需 ${Math.ceil(state.sonarCooldown)} 秒充能。`);return;}
  state.sonarCooldown=Math.max(5,14-state.upgrades.sonar*3);
  reveal(8+state.upgrades.sonar*2);audio.play('sonar');
  const material=new THREE.MeshBasicMaterial({color:'#bce9b1',transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false});
  const mesh=new THREE.Mesh(new THREE.RingGeometry(.97,1,96),material);mesh.rotation.x=-Math.PI/2;mesh.position.set(player.x,.13,player.z);scene.add(mesh);
  sonarRings.push({mesh,age:0});
  const relic=world.collectibles.filter(i=>i.type==='relic'&&!i.collected).sort((a,b)=>Math.hypot(a.x*TILE-player.x,a.z*TILE-player.z)-Math.hypot(b.x*TILE-player.x,b.z*TILE-player.z))[0];
  ui.toast(relic?`回声发现了遗迹 · 距你 ${Math.round(Math.hypot(relic.x*TILE-player.x,relic.z*TILE-player.z))} 米`:'洞穴的回声照亮了地图上的未知区域。','success');
  refreshHUD();
}
function eat() {
  if(state.mushrooms<=0){ui.toast('补给用完了。寻找橙色蘑菇，或回营地休息。','warning');return;}
  if(state.health>=100&&state.energy>=95){ui.toast('状态很好，留着蘑菇给下一段冒险吧。');return;}
  state.mushrooms--;state.health=Math.min(100,state.health+30);state.energy=Math.min(100,state.energy+45);audio.play('heal');burst(player.x,player.z,'#aee0a0');ui.toast('蘑菇补给 · 生命 +30 · 体力 +45','success');save();
}
function openModal(type,data={}) {isModal=true;modalType=type;state.paused=true;keys.clear();path=[];targetMarker.visible=false;ui.update(state);ui.showModal(type,{...state,...data});ui.setMap(world,player,revealed,type==='map');}
function closeModal() {isModal=false;modalType='';state.paused=false;ui.hideModal();canvas.focus({preventScroll:true});clock.reset();}
function act(action,value) {
  audio.unlock();
  if(action.startsWith('move-')) {const key={ 'move-up':'w','move-down':'s','move-left':'a','move-right':'d'}[action];if(value===false)keys.delete(key);else keys.add(key);return;}
  if(['resume','close','continue'].includes(action)){if(state.status==='playing')closeModal();return;}
  if(action==='restart'){loadLevel(1);ui.toast('新一轮探险开始了。愿微光与你同在。');return;}
  if(action==='next'&&state.status==='won'){loadLevel(state.level+1,state);ui.toast(`已进入第 ${state.level} 层 · 洞穴更深，甲虫也更警觉。`);return;}
  if(action==='sound'){state.sound=audio.toggle();ui.toast(state.sound?'洞穴音效已开启':'洞穴音效已关闭');refreshHUD();return;}
  if(state.status!=='playing')return;
  if(action==='pause'){if(isModal&&state.status==='playing')closeModal();else if(state.status==='playing')openModal('pause');return;}
  if(['help','settings'].includes(action)){openModal('help');return;}
  if(['journal','inventory','shop','upgrades'].includes(action)){openModal('journal');return;}
  if(action==='map'){if(isModal&&modalType==='map')closeModal();else openModal('map');return;}
  if(action.startsWith('upgrade-')){
    const type=action.slice(8);if(!(type in state.upgrades))return;
    const rank=state.upgrades[type],cost=4+rank*3;
    if(rank>=3){ui.toast('这件装备已经升到最高等级。');return;}
    if(state.crystals<cost){ui.toast(`升级需要 ${cost} 枚晶石，再探索一会儿吧。`,'warning');return;}
    state.crystals-=cost;state.upgrades[type]++;audio.play('upgrade');ui.toast('装备升级成功，下次出发会更轻松。','success');save();ui.update(state);ui.showModal('journal',{...state});return;
  }
  if(isModal||state.status!=='playing')return;
  if(action==='dig')dig();
  if(action==='sonar')sonar();
  if(['light','lamp'].includes(action)){state.lightOn=!state.lightOn;ui.toast(state.lightOn?'矿灯亮起了，前方清晰了一些。':'矿灯已关闭，萤光会为你指路。');}
  if(['eat','supply','heal'].includes(action))eat();
  if(action==='camp'){
    if(state.campCooldown>0){ui.toast(`营地回程还需 ${Math.ceil(state.campCooldown)} 秒准备。`);return;}
    returnTimer=2.5;path=[];targetMarker.visible=false;ui.toast('静止片刻，莫里正在寻找回营地的路…');
  }
  refreshHUD();
}
ui.onAction(act);
window.addEventListener('keydown',e=>{
  if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;
  const key=e.key.toLowerCase();
  if(isModal&&!['escape','p','m','h','i','j'].includes(key))return;
  if([' ','arrowup','arrowdown','arrowleft','arrowright','tab'].includes(key))e.preventDefault();
  audio.unlock();
  if(!e.repeat){const action={' ':'dig',q:'sonar',f:'light',e:'eat',m:'map',escape:'pause',p:'pause',h:'help',i:'journal',j:'journal',tab:'journal',r:'camp'}[key];if(action)act(action);}
  keys.add(key);
});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>keys.clear());
let pointer=null;
canvas.addEventListener('pointerdown',e=>{audio.unlock();if(isModal)return;pointer={x:e.clientX,y:e.clientY,lastX:e.clientX,moved:false};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!pointer)return;if(Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>6)pointer.moved=true;if(pointer.moved){cameraAngle-=(e.clientX-pointer.lastX)*.006;}pointer.lastX=e.clientX;});
canvas.addEventListener('pointerup',e=>{if(!pointer)return;if(!pointer.moved&&!isModal){const ndc=new THREE.Vector2(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);raycaster.setFromCamera(ndc,camera);const hit=new THREE.Vector3();if(raycaster.ray.intersectPlane(groundPlane,hit))navigateTo(Math.round(hit.x/TILE),Math.round(hit.z/TILE));}pointer=null;});
canvas.addEventListener('pointercancel',()=>pointer=null);
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=THREE.MathUtils.clamp(zoom+e.deltaY*.015,16,35);},{passive:false});
canvas.addEventListener('contextmenu',e=>e.preventDefault());

function updatePlayer(dt) {
  let forward=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0);
  let side=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);
  let dx=-Math.sin(cameraAngle)*forward+Math.cos(cameraAngle)*side;
  let dz=-Math.cos(cameraAngle)*forward-Math.sin(cameraAngle)*side;
  if(forward||side){path=[];targetMarker.visible=false;}
  if(path.length){const target=path[0];dx=target.x-player.x;dz=target.z-player.z;if(Math.hypot(dx,dz)<.14){path.shift();if(!path.length)targetMarker.visible=false;dx=0;dz=0;}}
  player.moving=Math.hypot(dx,dz)>.001;
  if(player.moving){
    const length=Math.hypot(dx,dz);dx/=length;dz/=length;
    const sprint=keys.has('shift')&&state.energy>3;
    const speed=(3.2+state.upgrades.speed*.45)*(sprint?1.65:1);
    if(sprint)state.energy=Math.max(0,state.energy-dt*18);
    const movement=path.length?Math.min(speed*dt,length):speed*dt;
    const nx=player.x+dx*movement,nz=player.z+dz*movement;
    if(canStand(nx,player.z))player.x=nx;
    if(canStand(player.x,nz))player.z=nz;
    player.heading=Math.atan2(dx,dz);
    stepTimer-=dt;if(stepTimer<=0){audio.play('step');stepTimer=sprint?.18:.29;}
  }
  if(!keys.has('shift')||!player.moving)state.energy=Math.min(100,state.energy+dt*(player.moving?7:13));
  if(returnTimer>0){
    if(player.moving){returnTimer=0;ui.toast('回程已取消。准备好后，按 R 再试一次。');}
    else{ returnTimer-=dt;if(returnTimer<=0){player.x=world.camp.x*TILE;player.z=world.camp.z*TILE;state.campCooldown=30;player.invincible=2;burst(player.x,player.z,'#c3d995',18);audio.play('heal');ui.toast('回到营地了，休息一下再出发。','success');save();}}
  }
  player.digTimer=Math.max(0,player.digTimer-dt);player.invincible=Math.max(0,player.invincible-dt);
  mole.position.set(player.x,player.moving?Math.abs(Math.sin(ambientTime*13))*.08:Math.sin(ambientTime*2)*.015,player.z);
  let diff=player.heading-mole.rotation.y;while(diff>Math.PI)diff-=Math.PI*2;while(diff< -Math.PI)diff+=Math.PI*2;
  mole.rotation.y+=diff*Math.min(1,dt*12);
  mole.rotation.z=player.digTimer>0?Math.sin(player.digTimer*24)*.2:player.moving?Math.sin(ambientTime*13)*.06:0;
  const limbs=mole.userData;
  if(limbs.leftFoot){
    const stride=player.moving?Math.sin(ambientTime*13)*.38:0;
    limbs.leftFoot.rotation.x=stride;limbs.rightFoot.rotation.x=-stride;
    limbs.leftArm.rotation.x=player.digTimer>0?-Math.sin(player.digTimer*20)*1.2:-stride*.7;
    limbs.rightArm.rotation.x=player.digTimer>0?-Math.sin(player.digTimer*20)*1.2:stride*.7;
  }
  mole.visible=player.invincible<=0||Math.floor(player.invincible*10)%2===0;
  lantern.position.set(player.x,3.5,player.z+.5);
  lantern.intensity=state.lightOn?6+state.upgrades.lamp*2:0;
  lantern.distance=state.lightOn?12+state.upgrades.lamp*3:4;
  headlampLens.material.emissiveIntensity=state.lightOn?1.6:0;
  headlampGlint.visible=state.lightOn;
  if(state.lightOn)reveal(4+state.upgrades.lamp);else reveal(2);
  const campDistance=Math.hypot(player.x-world.camp.x*TILE,player.z-world.camp.z*TILE);
  if(campDistance<2){state.health=Math.min(100,state.health+dt*12);state.energy=Math.min(100,state.energy+dt*20);if(state.health<98&&levelTime-lastCampToast>10){ui.toast('营地很安全。休息片刻，生命与体力正在恢复。','success');lastCampToast=levelTime;}}
}
function updateCollectibles(dt) {
  for(const item of world.collectibles){
    if(item.collected)continue;
    if(item.type!=='mushroom'){item.mesh.rotation.y+=dt*.7;item.mesh.position.y=.65+Math.sin(ambientTime*2+item.x)*.1;}
    if(Math.hypot(player.x-item.x*TILE,player.z-item.z*TILE)<.8){
      item.collected=true;item.mesh.visible=false;audio.play(item.type);
      if(item.type==='crystal'){state.crystals++;state.crystalsCollected++;state.score+=40;burst(player.x,player.z,'#8ce7ce');ui.toast(`晶石 +1 · ${state.crystalsCollected} / ${state.goalCrystals}`,'success');}
      if(item.type==='relic'){state.relics++;state.score+=200;burst(player.x,player.z,'#eacc7b',24);ui.toast(`发现远古遗物 · ${state.relics} / ${state.goalRelics}`,'success');}
      if(item.type==='mushroom'){state.mushrooms++;state.score+=20;burst(player.x,player.z,'#e0ae7c',8);ui.toast('找到一份蘑菇补给 · 按 E 恢复状态','success');}
      if(state.crystalsCollected>=8&&state.relics===3)ui.toast('远古石门已苏醒！沿地图寻找绿色出口。','success');
      save();
    }
  }
  const exitDistance=Math.hypot(player.x-world.exit.x*TILE,player.z-world.exit.z*TILE);
  if(exitDistance<1.25){
    if(state.crystalsCollected>=8&&state.relics>=3){state.status='won';state.score+=500+Math.max(0,600-Math.floor(levelTime));audio.play('win');save();openModal('win',{time:Math.round(levelTime)});}
    else if(levelTime-lastExitToast>6){ui.toast(`石门需要 8 枚晶石与 3 件遗物 · 目前 ${state.crystalsCollected} 枚、${state.relics} 件`,'warning');lastExitToast=levelTime;}
  }
}
function updateEnemies(dt) {
  for(const e of world.enemies){
    e.attackCooldown=Math.max(0,e.attackCooldown-dt);e.stunned=Math.max(0,e.stunned-dt);
    const distance=Math.hypot(e.px-player.x,e.pz-player.z);
    if(e.stunned>0){e.mesh.rotation.z=Math.sin(ambientTime*9)*.15;continue;}
    e.mesh.rotation.z=0;e.wander-=dt;
    if(e.wander<=0){
      e.wander=distance<7?.6:2.5;
      const ex=Math.round(e.px/TILE),ez=Math.round(e.pz/TILE);
      if(distance<7)e.route=findPath(ex,ez,Math.round(player.x/TILE),Math.round(player.z/TILE),300);
      else{const neighbors=[[1,0],[-1,0],[0,1],[0,-1]].map(([x,z])=>[ex+x,ez+z]).filter(([x,z])=>!solid(x,z));const p=neighbors[Math.floor(Math.random()*neighbors.length)];e.route=p?[{x:p[0]*TILE,z:p[1]*TILE}]:[];}
    }
    if(e.route?.length){const target=e.route[0],dx=target.x-e.px,dz=target.z-e.pz,len=Math.hypot(dx,dz);if(len<.1)e.route.shift();else{const v=(distance<7?1.55: .7)+Math.min(1.1,(state.level-1)*.18);e.px+=dx/len*Math.min(len,dt*v);e.pz+=dz/len*Math.min(len,dt*v);e.mesh.rotation.y=Math.atan2(dx,dz);}}
    e.mesh.position.x=e.px;e.mesh.position.z=e.pz;e.mesh.position.y=Math.abs(Math.sin(ambientTime*12+e.x))*.03;
    const safe=Math.hypot(player.x-world.camp.x*TILE,player.z-world.camp.z*TILE)<2.2;
    if(distance<1&&!safe&&e.attackCooldown<=0&&player.invincible<=0){
      state.health=Math.max(0,state.health-14);e.attackCooldown=2;player.invincible=1.5;returnTimer=0;audio.play('hurt');burst(player.x,player.z,'#e1a186');ui.toast('小心甲虫！空格可以震晕它们。','warning');
      if(state.health<=0){state.status='lost';save();openModal('gameover');}
    }
  }
}
function updateCamera(dt,instant=false) {
  cameraTarget.set(player.x,0,player.z);
  currentCameraTarget.lerp(cameraTarget,instant?1:1-Math.exp(-dt*4));
  camera.position.set(currentCameraTarget.x+Math.sin(cameraAngle)*zoom*.72,zoom*.85,currentCameraTarget.z+Math.cos(cameraAngle)*zoom*.72);
  camera.lookAt(currentCameraTarget.x,0,currentCameraTarget.z);
  keyLight.position.set(player.x+10,30,player.z-8);keyLight.target.position.set(player.x,0,player.z);
}
function refreshHUD() {
  let walkable=0,known=0;
  for(let z=0;z<world.size;z++)for(let x=0;x<world.size;x++)if(world.grid[z][x]===0){walkable++;if(revealed.has(`${x},${z}`))known++;}
  state.explored=Math.round(known/walkable*100);state.time=Math.floor(levelTime);
  state.exitFound=revealed.has(`${world.exit.x},${world.exit.z}`);
  state.sonarMaxCooldown=Math.max(5,14-state.upgrades.sonar*3);
  ui.update(state);ui.setMap(world,player,revealed,isModal&&modalType==='map');
}
function save() {
  if(!autoSaveAvailable)return;
  try {localStorage.setItem(STORAGE,JSON.stringify({version:1,level:state.level,status:state.status,state:{...state,time:levelTime},player:{x:player.x,z:player.z,heading:player.heading},collected:world.collectibles.filter(i=>i.collected).map(i=>i.id),revealed:[...revealed]}));}
  catch {autoSaveAvailable=false;}
}
function resize(){renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
window.addEventListener('resize',resize);
window.addEventListener('beforeunload',save);
resize();
loadLevel(saved?.status==='won'?saved.level+1:saved?.status==='playing'?saved.level:1,saved?.status==='won'?saved.state:{},saved);
if(saved?.status==='playing')setTimeout(()=>ui.toast('欢迎回来，莫里。你的探险进度已恢复。','success'),800);
else setTimeout(()=>ui.toast('WASD 移动 · 寻找晶石与远古遗物，唤醒洞穴深处的石门。'),1200);
setTimeout(()=>document.querySelector('#loading')?.classList.add('loaded'),300);
setTimeout(()=>document.querySelector('#loading')?.remove(),1300);

function frame(){
  requestAnimationFrame(frame);
  clock.update();const dt=Math.min(clock.getDelta(),.05);ambientTime+=dt;
  if(!isModal&&state.status==='playing'){
    levelTime+=dt;state.sonarCooldown=Math.max(0,state.sonarCooldown-dt);state.campCooldown=Math.max(0,state.campCooldown-dt);
    updatePlayer(dt);updateCollectibles(dt);if(state.status==='playing')updateEnemies(dt);
    saveTimer+=dt;if(saveTimer>4){saveTimer=0;save();}
  }
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.vy-=dt*7;p.mesh.position.x+=p.vx*dt;p.mesh.position.z+=p.vz*dt;p.mesh.position.y+=p.vy*dt;p.mesh.scale.setScalar(Math.max(.01,p.life));if(p.life<=0){p.mesh.removeFromParent();particles.splice(i,1);if(!particles.some(o=>o.shared===p.shared))p.shared.dispose();}}
  for(let i=sonarRings.length-1;i>=0;i--){const r=sonarRings[i];r.age+=dt;r.mesh.scale.setScalar(1+r.age*13);r.mesh.material.opacity=Math.max(0,.7-r.age*.35);if(r.age>=2){r.mesh.removeFromParent();r.mesh.geometry.dispose();r.mesh.material.dispose();sonarRings.splice(i,1);}}
  for(const d of world.decorations||[]){if(d.type==='mote'||d.type==='spore'){d.mesh.position.y=d.baseY+Math.sin(ambientTime*.7+d.phase)*.35;}}
  updateCamera(dt);hudTimer+=dt;if(hudTimer>.12){hudTimer=0;refreshHUD();}
  composer.render();
}
frame();
if(import.meta.env.DEV) window.__BENEATH__={snapshot:()=>({state:{...state},player:{...player},grid:world.grid.map(r=>[...r]),collectibles:world.collectibles.map(({id,type,x,z,collected})=>({id,type,x,z,collected})),camp:world.camp,exit:{x:world.exit.x,z:world.exit.z},revealed:[...revealed],path:[...path],enemies:world.enemies.map(e=>({x:e.px,z:e.pz,stunned:e.stunned})),modal:modalType}),action:act,navigateTo};
