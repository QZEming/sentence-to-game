import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { LEVELS, traceLight } from './puzzles.js';
import { createForest, createFox, createMirror, createSource, createReceiver, createPrism, createFilter, createPlate, createObstacle, createGate } from './world.js';
import { ForestAudio } from './audio.js';
import './style.css';

const icons = {
 book:'<path d="M3 4.5C6 3 9 3 12 5c3-2 6-2 9-.5v15c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z"/><path d="M12 5v15M6 8h3m-3 4h3m6-4h3m-3 4h3"/>',
 sound:'<path d="m11 4-6 5H2v6h3l6 5zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
 mute:'<path d="m11 4-6 5H2v6h3l6 5zM16 9l5 6m0-6-5 6"/>',
 settings:'<path d="m10 3 4 0 .6 2.6 2 .9 2.4-.8 2 3.5-1.9 1.8v2l1.9 1.8-2 3.5-2.4-.8-2 .9L14 21h-4l-.6-2.6-2-.9-2.4.8-2-3.5L4.9 13v-2L3 9.2l2-3.5 2.4.8 2-.9z"/><circle cx="12" cy="12" r="3"/>',
 map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16m6-14v16"/>',
 reset:'<path d="M3 10a9 9 0 1 1 1.8 8M3 4v6h6"/>',
 spark:'<path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8z"/>',
 bulb:'<path d="M8 16c0-3-3-3-3-7a7 7 0 0 1 14 0c0 4-3 4-3 7M8 17h8m-7 3h6m-5 2h4M12 6v5m-2-2 2 2 2-2"/>',
 leaf:'<path d="M20 3C8 1 2 7 5 15s17 7 15-12ZM5 20 16 8M9 15h6m-6 0V9"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 mouse:'<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 2v7M6 9h12"/>',
 rotateLeft:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
 rotateRight:'<path d="M21 10a9 9 0 1 0-2 8m2-14v6h-6"/>',
 compass:'<path d="m15 3 3 16-7-5-7 1z"/>',
 mirror:'<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M12 17v4m-4 0h8M8 9l4-3m-2 8 6-6"/>',
 diamond:'<path d="m12 2 8 10-8 10-8-10zM4 12h16M12 2v20"/>',
 up:'<path d="m6 15 6-6 6 6"/>',
 down:'<path d="m6 9 6 6 6-6"/>',
 left:'<path d="m15 6-6 6 6 6"/>',
 right:'<path d="m9 6 6 6-6 6"/>',
 fullscreen:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.spark}</svg>`;
const $ = s => document.querySelector(s);
const COLOR = {gold:0xffd785,blue:0x79d4f4,rose:0xec94ba};
const NAMES = ['苏醒林地','苔藓回廊','蓝蕨幽谷','棱晶花园','古树圣所'];
const ENGLISH = ['THE FIRST LIGHT','THE SILVER TRAIL','THE BLUE HOUR','THE TWIN STARS','HEART OF THE FOREST'];
const NOTES = ['光遇到镜子时，总会以同样的角度离开。也许，转一个方向，就能找到答案。','每一面镜子都是一个转折。不用着急，让光一步一步走到远方。','晨光穿过蓝色晶片，就有了夜空的颜色。月石只聆听同色的呼唤。','棱晶藏着两个梦。一半是蓝色的月光，一半是粉色的晚霞。','有些路，需要亲自走过去。站上月纹石板，沉睡的荆棘便会让路。'];
const STORAGE_KEY = 'lumen-fox-v1';
function sanitizeRun(raw,definition){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 const restoredAngles=Object.fromEntries(definition.mirrors.map(m=>[m.id,[0,45,90,135].includes(raw.angles?.[m.id])?raw.angles[m.id]:m.angle]));
 const position=raw.fox&&Number.isFinite(raw.fox.x)&&Number.isFinite(raw.fox.z)&&Math.hypot(raw.fox.x,raw.fox.z)<=9.75?{x:raw.fox.x,z:raw.fox.z}:{...definition.spawn};
 const restoredSolved=raw.solved===true&&traceLight(definition,restoredAngles,definition.plates.map(p=>p.id)).litReceiverIds.length===definition.receivers.length;
 return {angles:restoredAngles,rotations:Number.isFinite(raw.rotations)?Math.max(0,Math.min(1e7,Math.floor(raw.rotations))):0,seconds:Number.isFinite(raw.seconds)?Math.max(0,Math.min(31536000,raw.seconds)):0,fox:position,solved:restoredSolved};
}
let saved = {completed:[],wisps:{},runs:{},current:0,sound:true,quality:'high'};
try {
 const stored=JSON.parse(localStorage.getItem(STORAGE_KEY));
 if(stored&&typeof stored==='object'){
  saved.completed=[...new Set(Array.isArray(stored.completed)?stored.completed.filter(id=>LEVELS.some(l=>l.id===id)):[])];
  for(const definition of LEVELS){
   const stars=stored.wisps?.[definition.id];saved.wisps[definition.id]=[...new Set(Array.isArray(stars)?stars.filter(id=>definition.wisps.some(w=>w.id===id)):[])];
   const run=sanitizeRun(stored.runs?.[definition.id],definition);if(run)saved.runs[definition.id]=run;
  }
  saved.current=Number.isInteger(stored.current)?Math.min(Math.max(0,stored.current),LEVELS.length-1):0;saved.sound=stored.sound!==false;saved.quality=stored.quality==='low'?'low':'high';
 }
} catch {}
let levelIndex=saved.current,level;
let angles={},selected=null,rotations=0,seconds=0,solved=false,paused=false,hintStep=0;
let collected=new Set(),activePlates=[],lastTrace=null,route=[],keys=new Set(),dash=0,dashCooldown=0;
let entities={},labels=[],wispModels=[],beamParticles=[],toastTimer,saveTimer=0,lastTime=0,frameCount=0,gateReady=true;
let soundEnabled=saved.sound!==false,quality=saved.quality==='low'?'low':'high';
const audio=new ForestAudio();
function persist(){
 saved.current=levelIndex;saved.sound=soundEnabled;saved.quality=quality;
 if(level&&fox){saved.runs[level.id]={angles:{...angles},rotations,seconds,fox:{x:fox.position.x,z:fox.position.z},solved};saved.wisps[level.id]=[...collected];}
 saveTimer=0;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));}catch{}
}
function play(name){if(soundEnabled&&audioStarted)audio.play(name);}
let audioStarted=false;
function unlockAudio(){if(!audioStarted&&soundEnabled){audioStarted=true;audio.setEnabled(true);audio.start();}}

$('#app').innerHTML=`
<div class="app-shell">
 <header class="site-header">
  <div class="brand"><img src="/fox.svg" alt="森光小狐狸"/><div><div class="brand-name">森光</div><div class="brand-sub">LUMEN FOX</div></div></div>
  <div class="header-middle"><span class="little-star">✧</span> 跟随一束光，唤醒一座森林 <span class="little-star">✧</span></div>
  <div class="header-actions"><button class="header-link" id="journal-button" title="旅途手记 (J)">${icon('book')}<span>旅途手记</span></button><button class="icon-btn" id="sound-button" title="切换森林音效" aria-label="关闭音效">${icon(soundEnabled?'sound':'mute')}</button><button class="icon-btn" id="settings-button" title="设置与暂停" aria-label="设置与暂停">${icon('settings')}</button></div>
 </header>
 <aside class="sidebar">
  <div class="journey-heading"><div class="eyebrow">THE JOURNEY</div>${icon('leaf')}</div>
  <nav class="chapter-list" aria-label="森林章节"></nav>
  <div class="sidebar-divider"></div>
  <div class="eyebrow">CURRENT QUEST</div><h2 class="quest-title">唤醒沉睡的林地</h2>
  <div class="objectives"><div class="objective" id="quest-light"><span class="objective-mark"></span><span>点亮森林月石</span><em>0 / 1</em></div><div class="objective" id="quest-wisps"><span class="objective-mark"></span><span>收集林间星屑<div class="optional-tag">可选探索</div></span><em>0 / 3</em></div><div class="objective" id="quest-gate"><span class="objective-mark"></span><span>开启通往下一片森林的星门</span></div></div>
  <div class="quest-progress"><div style="width:0%"></div></div>
  <div class="forest-note"><div class="note-card"><div class="note-card-top">${icon('leaf')} 森林的低语</div><p id="forest-note"></p></div></div>
  <div class="side-footer"><span><i class="save-dot"></i>旅途自动保存</span><span>v 1.0</span></div>
 </aside>
 <main class="game-main">
  <div class="scene" id="scene" aria-label="3D 森林游戏：点击地面移动，点击镜子进行旋转"></div>
  <div class="scene-header"><div class="scene-overline"></div><h1></h1><div class="scene-subtitle"></div></div>
  <div class="scene-tools"><button class="hint-btn" id="hint-button" title="森林提示 (H)">${icon('bulb')}<span>灵感</span></button><button class="icon-btn" id="map-button" title="森林地图 (M)" aria-label="森林地图">${icon('map')}</button><button class="icon-btn" id="reset-button" title="重新开始本关 (R)" aria-label="重新开始本关">${icon('reset')}</button></div>
  <div class="scene-status"><span>${icon('spark')}<b id="wisp-count">0 / 3</b> 星屑</span><span>${icon('clock')}<b id="timer">00:00</b></span></div>
  <div class="world-labels"></div>
  <div class="mini-map"><span class="map-title">FOREST COMPASS</span><canvas width="210" height="184" id="minimap"></canvas></div>
  <div class="compass">${icon('compass')}<span>N</span></div>
  <div class="mirror-controls hidden"><div class="mirror-card-top"><span class="eyebrow">ANCIENT MIRROR</span><button class="close-btn" id="deselect-button" aria-label="取消选择镜子">${icon('close')}</button></div><h3 id="mirror-name">古老的镜子</h3><div class="angle-line"><span>镜面角度</span><span class="angle-value">45°</span></div><div class="rotate-buttons"><button id="rotate-left" title="逆时针旋转 (Q)">${icon('rotateLeft')}<span>左转 <kbd>Q</kbd></span></button><button id="rotate-right" title="顺时针旋转 (E)"><span>右转 <kbd>E</kbd></span>${icon('rotateRight')}</button></div><p class="mirror-tip">每次转动 45°。观察光线，让它找到月石。</p></div>
  <div class="hint-panel hidden"><button class="close-btn" id="close-hint" aria-label="关闭提示">${icon('close')}</button><div class="eyebrow">A LITTLE INSPIRATION</div><p></p><button class="more-hint">再给我一点提示 →</button></div>
  <div class="mobile-pad" aria-label="触屏移动控制"><button data-key="w" aria-label="向前">${icon('up')}</button><button data-key="a" aria-label="向左">${icon('left')}</button><button data-key="s" aria-label="向后">${icon('down')}</button><button data-key="d" aria-label="向右">${icon('right')}</button></div>
  <div class="bottom-hud"><div class="story-strip"><div class="story-copy"><div class="fox-avatar"><img src="/fox.svg" alt="小狐狸阿烁"/></div><div><h2 id="story-title">让光，找到回家的路。</h2><p id="story-text">点击镜子，再用 Q / E 转动它。每一束光，都有自己的归途。</p></div></div><button class="guide-pill" id="guide-button">${icon('book')} 冒险指南</button></div><div class="controls-bar"><div class="controls-left"><div class="control-item"><div class="key-group"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></div>移动</div><div class="control-item touch-help">${icon('mouse')}点击地面移动</div><div class="control-item"><div class="key-group"><kbd>Q</kbd><kbd>E</kbd></div>旋转镜子</div><div class="control-item"><kbd>Space</kbd>轻盈冲刺</div><div class="control-item camera-help">${icon('mouse')}拖动右键环视</div></div><div class="controls-right"><button class="text-btn" id="recenter-button" title="重置视角 (C)">${icon('compass')}重置视角</button><button class="text-btn" id="help-button" aria-label="操作帮助">${icon('book')}帮助</button></div></div></div>
  <div class="toast hidden" role="status"></div><div class="success-banner hidden"></div>
  <div class="loading"><img src="/fox.svg" alt=""/><span>森林正在醒来</span><div class="loading-line"></div></div><div class="level-transition"></div>
 </main>
</div><div id="modal-root"></div>`;

let renderer,composer,scene,camera,bloom,forest,fox,puzzleGroup,beamGroup,particleGroup;
let transitioning=false;
let cameraAngle=Math.PI/4,cameraZoom=1,targetZoom=1,camElevation=.79;
const sceneEl=$('#scene');
try{
 renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,quality==='high'?1.7:1));
 renderer.shadowMap.enabled=quality==='high';renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','交互式三维森林');sceneEl.appendChild(renderer.domElement);
 scene=new THREE.Scene();scene.background=new THREE.Color(0x17382f);scene.fog=new THREE.FogExp2(0x17382f,.019);
 camera=new THREE.OrthographicCamera(-18,18,15,-15,.1,130);
 scene.add(new THREE.HemisphereLight(0xc7e3d4,0x3e4133,2.25));
 const sun=new THREE.DirectionalLight(0xffe6ad,3.8);sun.position.set(-9,18,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-15,right:15,top:15,bottom:-15,near:.1,far:60});sun.shadow.bias=-.0006;sun.shadow.normalBias=.04;scene.add(sun);
 const rim=new THREE.DirectionalLight(0x8dcbc1,1.7);rim.position.set(8,10,-12);scene.add(rim);
 const fill=new THREE.DirectionalLight(0xa6bd84,.7);fill.position.set(7,4,10);scene.add(fill);
 forest=createForest(scene);fox=createFox();scene.add(fox);
 puzzleGroup=new THREE.Group();beamGroup=new THREE.Group();particleGroup=new THREE.Group();scene.add(puzzleGroup,beamGroup,particleGroup);
 composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
 bloom=new UnrealBloomPass(new THREE.Vector2(1000,800),.42,.5,.85);composer.addPass(bloom);composer.addPass(new OutputPass());
}catch(error){
 $('.loading').innerHTML=`<img src="/fox.svg" alt=""/><span>浏览器暂时无法开启 3D 森林</span><p style="font-size:11px;letter-spacing:0">请开启浏览器的硬件加速，或使用支持 WebGL 的浏览器重试。</p><button class="primary-btn" style="width:auto" onclick="location.reload()">重新尝试</button>`;console.error(error);
}
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
const clockText=value=>`${String(Math.floor(value/60)).padStart(2,'0')}:${String(Math.floor(value%60)).padStart(2,'0')}`;
function resize(){if(!renderer)return;const w=sceneEl.clientWidth,h=sceneEl.clientHeight;renderer.setSize(w,h);composer.setSize(w,h);const aspect=w/h;const view=Math.max(14.2,12/aspect);camera.left=-view*aspect;camera.right=view*aspect;camera.top=view;camera.bottom=-view;camera.updateProjectionMatrix();}
function updateCamera(){cameraZoom=THREE.MathUtils.lerp(cameraZoom,targetZoom,.1);camera.zoom=cameraZoom;const r=33;camera.position.set(Math.sin(cameraAngle)*r,Math.sin(camElevation)*r+7,Math.cos(cameraAngle)*r);camera.lookAt(0,.25,0);camera.updateProjectionMatrix();}
function disposeGroup(group){const geometries=new Set(),materials=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});group.clear();for(const g of geometries)g.dispose();/* Shared model materials stay cached by world.js; ephemeral beam materials are disposed separately. */if(group===beamGroup||group===particleGroup)for(const m of materials)m.dispose();}
function addLabel(object,text,cls=''){const el=document.createElement('div');el.className=`world-label ${cls}`;el.innerHTML=`<span>${text}</span><i></i>`;$('.world-labels').appendChild(el);labels.push({object,el,offset:cls.includes('fox')?1.65:2.55});return el;}
function buildLevel(index,reset=false){
 levelIndex=index;level=LEVELS[index];if(reset)delete saved.runs[level.id];const run=saved.runs[level.id];
 angles=run?{...run.angles}:Object.fromEntries(level.mirrors.map(m=>[m.id,m.angle]));selected=null;rotations=run?.rotations||0;seconds=run?.seconds||0;solved=false;hintStep=0;route=[];keys.clear();activePlates=[];lastTrace=null;dash=0;dashCooldown=0;saveTimer=0;
 collected=new Set(saved.wisps[level.id]||[]);entities={};labels=[];wispModels=[];beamParticles=[];
 disposeGroup(puzzleGroup);disposeGroup(beamGroup);disposeGroup(particleGroup);$('.world-labels').innerHTML='';$('.success-banner').classList.add('hidden');$('.mirror-controls').classList.add('hidden');$('.hint-panel').classList.add('hidden');
 const add=(data,factory,kind)=>{const obj=factory(data);obj.userData.kind=kind;obj.userData.id=data.id;obj.userData.data=data;puzzleGroup.add(obj);if(data.id)entities[data.id]=obj;return obj;};
 const source=add(level.source,createSource,'source');addLabel(source,'晨光之源');
 for(const data of level.mirrors){const obj=add(data,createMirror,'mirror');obj.userData.setAngle(angles[data.id]);const label=addLabel(obj,`镜 ${level.mirrors.indexOf(data)+1}`,'mirror-label');label.querySelector('span').onclick=()=>selectMirror(data.id,true);obj.userData.label=label;}
 for(const data of level.receivers){const obj=add(data,createReceiver,'receiver');addLabel(obj,`${data.color==='blue'?'蓝色':data.color==='rose'?'粉色':''}月石`);}
 for(const data of level.prisms)addLabel(add(data,createPrism,'prism'),'分光棱晶');
 for(const data of level.filters)addLabel(add(data,createFilter,'filter'),'蓝色晶片');
 for(const data of level.plates)addLabel(add(data,createPlate,'plate'),'月纹石板');
 for(const data of level.obstacles)add(data,createObstacle,'obstacle');
 entities.gate=add(level.gate,createGate,'gate');addLabel(entities.gate,'沉睡的星门');
 for(const data of level.wisps){
  if(collected.has(data.id))continue;
  const obj=new THREE.Group();obj.position.set(data.x,1,data.z);obj.userData.data=data;
  const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.15),new THREE.MeshStandardMaterial({color:0xffde7e,emissive:0xffcb65,emissiveIntensity:2.7,roughness:.15}));obj.add(gem);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.29,.015,5,24),new THREE.MeshBasicMaterial({color:0xe5cf7d,transparent:true,opacity:.48}));ring.rotation.x=Math.PI/2;obj.add(ring);
  const glow=new THREE.PointLight(0xffc759,.6,2);obj.add(glow);puzzleGroup.add(obj);wispModels.push(obj);
 }
 const position=run?.fox||level.spawn;fox.position.set(position.x,0,position.z);
 activePlates=level.plates.filter(p=>run?.solved||Math.hypot(fox.position.x-p.x,fox.position.z-p.z)<.8).map(p=>p.id);
 if(!canStand(fox.position.x,fox.position.z)){fox.position.set(level.spawn.x,0,level.spawn.z);if(!run?.solved)activePlates=[];}
 for(const p of level.plates)entities[p.id].userData.setActive(activePlates.includes(p.id));
 gateReady=!run?.solved||Math.hypot(fox.position.x-level.gate.x,fox.position.z-level.gate.z)>=1.15;
 fox.rotation.y=2.3;addLabel(fox,'阿烁','fox-label');
 $('.scene-overline').textContent=`CHAPTER ${['I','II','III','IV','V'][index]} · ${ENGLISH[index]}`;
 $('.scene-header h1').textContent=NAMES[index];$('.scene-subtitle').textContent=level.name+' · '+['与光的第一次相遇','循着苔痕，走过三个转弯','把晨光染成夜空的颜色','一束晨光，两颗星星','让最后一束光重回森林'][index];
 $('#forest-note').textContent=NOTES[index];$('.quest-title').textContent=index===4?'唤醒森林之心':'唤醒沉睡的林地';
 $('#story-title').textContent=['让光，找到回家的路。','慢慢来，每个转弯都有意义。','原来，光也有自己的颜色。','有些美好，值得同时点亮。','只差一步，森林就会醒来。'][index];
 $('#story-text').textContent=['点击镜子，再用 Q / E 转动它。每一束光，都有自己的归途。','顺着光路依次调整三面镜子，让晨光抵达远处的月石。','让光穿过蓝色晶片，再借助镜子绕过岩石。','棱晶把晨光分成蓝与粉。让两束光找到同色的月石。','排好四面镜子后，站上月纹石板，让荆棘为光让路。'][index];
 updateChapters();recomputeLight({restoring:!!run});updateHUD();persist();
}
function updateChapters(){
 const highest=Math.max(0,...saved.completed.map(id=>LEVELS.findIndex(l=>l.id===id)+1));
 $('.chapter-list').innerHTML=LEVELS.map((l,i)=>`<button class="chapter ${i===levelIndex?'active':''} ${saved.completed.includes(l.id)?'complete':''}" data-level="${i}" ${i>highest?'disabled':''} ${i===levelIndex?'aria-current="step"':''}><span class="chapter-number">${saved.completed.includes(l.id)?icon('check'):i>highest?icon('lock'):String(i+1).padStart(2,'0')}</span><span class="chapter-text"><strong>${NAMES[i]}</strong><small>${['初识光的方向','镜与镜的对话','月石的颜色','一束光的两种可能','最后的森林之歌'][i]}</small></span>${i===levelIndex?'<i class="chapter-active-dot"></i>':''}</button>`).join('');
 for(const btn of document.querySelectorAll('.chapter'))btn.onclick=()=>{if(Number(btn.dataset.level)!==levelIndex)transitionTo(Number(btn.dataset.level));};
}
function updateHUD(){
 const lit=solved?level.receivers.length:(lastTrace?.litReceiverIds.length||0);
 $('#wisp-count').textContent=`${collected.size} / ${level.wisps.length}`;$('#quest-wisps em').textContent=`${collected.size} / ${level.wisps.length}`;$('#quest-light em').textContent=`${lit} / ${level.receivers.length}`;
 for(const [id,done] of [['#quest-light',lit===level.receivers.length],['#quest-wisps',collected.size===level.wisps.length],['#quest-gate',solved]]){$(id).classList.toggle('done',done);$(id+' .objective-mark').innerHTML=done?icon('check'):'';}
 $('.quest-progress div').style.width=`${((lit/level.receivers.length)*.55+(collected.size/level.wisps.length)*.2+(solved?.25:0))*100}%`;
 $('#timer').textContent=clockText(seconds);
}
function cylinderBetween(from,to,radius,material){const a=new THREE.Vector3(from.x,1.35,from.z),b=new THREE.Vector3(to.x,1.35,to.z),delta=b.clone().sub(a);const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,delta.length(),7),material);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return mesh;}
function recomputeLight({restoring=false}={}){
 if(solved)return;
 const previousLit=lastTrace?.litReceiverIds||[];lastTrace=traceLight(level,angles,activePlates);disposeGroup(beamGroup);beamParticles=[];
 for(const segment of lastTrace.segments){
  const color=COLOR[segment.color];
  beamGroup.add(cylinderBetween(segment.from,segment.to,.024,new THREE.MeshBasicMaterial({color:0xfff6da,toneMapped:false})));
  beamGroup.add(cylinderBetween(segment.from,segment.to,.065,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.5,depthWrite:false,blending:THREE.AdditiveBlending})));
  beamGroup.add(cylinderBetween(segment.from,segment.to,.16,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.065,depthWrite:false,blending:THREE.AdditiveBlending})));
  const sphere=new THREE.Mesh(new THREE.SphereGeometry(.075,6,6),new THREE.MeshBasicMaterial({color,toneMapped:false}));beamGroup.add(sphere);beamParticles.push({sphere,segment,offset:Math.random()});
 }
 for(const receiver of level.receivers){const lit=lastTrace.litReceiverIds.includes(receiver.id);entities[receiver.id].userData.setLit(lit);if(lit&&!previousLit.includes(receiver.id)&&!restoring){play('lit');burst(new THREE.Vector3(receiver.x,1.3,receiver.z),COLOR[receiver.color],15);}}
 for(const obstacle of level.obstacles)entities[obstacle.id].userData.setOpen?.(activePlates.includes(obstacle.plateId));
 updateHUD();if(lastTrace.litReceiverIds.length===level.receivers.length)completeLevel({silent:restoring});
}
function selectMirror(id,walk=false){
 if(!entities[id]||solved){if(solved)toast('月石已经点亮。可以继续探索，或走向星门。');return;}
 selected=id;for(const m of level.mirrors){entities[m.id].userData.setSelected(m.id===id);entities[m.id].userData.label.classList.toggle('selected',m.id===id);}
 $('.mirror-controls').classList.remove('hidden');$('#mirror-name').textContent=`古老的镜子 · ${level.mirrors.findIndex(m=>m.id===id)+1}`;$('.angle-value').textContent=angles[id]+'°';
 if(walk){const data=entities[id].userData.data;const delta=new THREE.Vector2(fox.position.x-data.x,fox.position.z-data.z).normalize().multiplyScalar(1.35);goTo(data.x+delta.x,data.z+delta.y);}
 play('click');
}
function deselect(){selected=null;$('.mirror-controls').classList.add('hidden');for(const m of level.mirrors){entities[m.id].userData.setSelected(false);entities[m.id].userData.label.classList.remove('selected');}}
function rotateMirror(direction){
 if(solved)return;
 if(!selected){const nearest=[...level.mirrors].sort((a,b)=>Math.hypot(a.x-fox.position.x,a.z-fox.position.z)-Math.hypot(b.x-fox.position.x,b.z-fox.position.z))[0];selectMirror(nearest.id);}
 angles[selected]=(angles[selected]+direction*45+180)%180;entities[selected].userData.setAngle(angles[selected]);rotations++;$('.angle-value').textContent=angles[selected]+'°';play('rotate');recomputeLight();persist();
}
function toast(text){clearTimeout(toastTimer);$('.toast').textContent=text;$('.toast').classList.remove('hidden');toastTimer=setTimeout(()=>$('.toast').classList.add('hidden'),3800);}
function showHint(){hintStep++;const panel=$('.hint-panel');panel.classList.remove('hidden');
 if(hintStep===1)panel.querySelector('p').textContent=level.hint;
 else{const wrong=level.mirrors.find(m=>angles[m.id]!==m.solutionAngle);if(wrong){selectMirror(wrong.id);panel.querySelector('p').textContent=`试着把镜 ${level.mirrors.indexOf(wrong)+1} 转到 ${wrong.solutionAngle}°。镜面与光线的夹角，会决定光的下一站。`;}else if(level.plates.length&&!solved)panel.querySelector('p').textContent='光路已经准备好了！点击右前方的「月纹石板」，让阿烁站上去。';else panel.querySelector('p').textContent='光已经找到归途。还可以在林间寻找三枚金色星屑，或走向星门。';}
 panel.querySelector('.more-hint').textContent=hintStep===1?'再给我一点提示 →':'看看下一步 →';play('click');
}
function transitionTo(index){if(transitioning||index<0||index>=LEVELS.length)return;persist();transitioning=true;closeModal();$('.level-transition').classList.add('active');setTimeout(()=>{buildLevel(index);transitioning=false;$('.level-transition').classList.remove('active');toast(`抵达${NAMES[index]}。新的光正在等你。`);},450);}
function completeLevel({silent=false}={}){
 solved=true;route=[];if(!silent)play('solve');entities.gate.userData.setOpen(true);deselect();
 const gateLabel=labels.find(l=>l.object===entities.gate);if(gateLabel)gateLabel.el.querySelector('span').textContent='星门已开启';
 if(!saved.completed.includes(level.id))saved.completed.push(level.id);persist();updateChapters();updateHUD();
 if(!silent)for(const r of level.receivers)burst(new THREE.Vector3(r.x,1.3,r.z),COLOR[r.color],30);
 $('#story-title').textContent=levelIndex===4?'你让整个森林，重新有了光。':'林地醒来了，谢谢你，阿烁。';$('#story-text').textContent='星门已经开启。还可以继续收集星屑，或走进下一片森林。';
 if(!silent){const completedIndex=levelIndex;setTimeout(()=>{if(levelIndex!==completedIndex||!solved)return;showSuccess();},850);}
}
function showSuccess(){
 const last=levelIndex===LEVELS.length-1;const panel=$('.success-banner');panel.innerHTML=`<div class="success-spark">✧</div><div class="eyebrow">${last?'THE FOREST REMEMBERS':'A LITTLE LIGHT RETURNS'}</div><h2>${last?'森林，因你苏醒':'一片林地，重新发光'}</h2><p>${last?'所有月石汇成了星河。小小的狐狸，也能为整个森林带来光。':'晨光穿过古镜，落在月石上。<br/>前方的森林，正在静静等你。'}</p><div class="success-stats"><div><strong>${clockText(seconds)}</strong><small>探索时光</small></div><div><strong>${collected.size} / 3</strong><small>林间星屑</small></div><div><strong>${rotations}</strong><small>镜面转动</small></div></div><button class="primary-btn" id="next-level">${last?'查看旅途收藏':'前往'+NAMES[levelIndex+1]}${icon('arrow')}</button><button class="secondary-btn" id="keep-exploring">再留一会儿 · 继续探索</button>`;panel.classList.remove('hidden');
 $('#next-level').onclick=()=>{panel.classList.add('hidden');last?showJournal():transitionTo(levelIndex+1);};$('#keep-exploring').onclick=()=>panel.classList.add('hidden');
}
function burst(position,color,count=18){for(let i=0;i<count;i++){const obj=new THREE.Mesh(new THREE.OctahedronGeometry(.035+Math.random()*.045),new THREE.MeshBasicMaterial({color,transparent:true}));obj.position.copy(position);obj.userData={velocity:new THREE.Vector3((Math.random()-.5)*2.6,Math.random()*2+.5,(Math.random()-.5)*2.6),life:1.3};particleGroup.add(obj);}}
function canStand(x,z){
 if(Math.hypot(x,z)>9.75)return false;
 for(const o of level.obstacles){if(o.plateId&&(activePlates.includes(o.plateId)||solved))continue;if(Math.hypot(x-o.x,z-o.z)<o.radius+.3)return false;}
 for(const obj of [...level.mirrors,...level.receivers,...level.prisms])if(Math.hypot(x-obj.x,z-obj.z)<.56)return false;
 return true;
}
function goTo(x,z){
 const scale=.5;let end={x:Math.round(x/scale),z:Math.round(z/scale)};const start={x:Math.round(fox.position.x/scale),z:Math.round(fox.position.z/scale)};
 if(!canStand(end.x*scale,end.z*scale)){let found=null;for(let r=1;r<=5&&!found;r++)for(let dx=-r;dx<=r&&!found;dx++)for(let dz=-r;dz<=r;dz++){if(Math.abs(dx)!==r&&Math.abs(dz)!==r)continue;if(canStand((end.x+dx)*scale,(end.z+dz)*scale)){found={x:end.x+dx,z:end.z+dz};break;}}if(!found)return;end=found;}
 const key=p=>`${p.x},${p.z}`,startKey=key(start),endKey=key(end);const open=[{...start,g:0,f:0}],costs=new Map([[startKey,0]]),parents=new Map(),closed=new Set();
 for(let n=0;open.length&&n<1900;n++){
  open.sort((a,b)=>a.f-b.f);const current=open.shift(),ck=key(current);if(closed.has(ck))continue;if(ck===endKey){const points=[];let k=endKey;while(k!==startKey){const [px,pz]=k.split(',').map(Number);points.unshift(new THREE.Vector3(px*scale,0,pz*scale));k=parents.get(k);if(!k)break;}route=points;return;}
  closed.add(ck);
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const next={x:current.x+dx,z:current.z+dz},nk=key(next);if(closed.has(nk)||!canStand(next.x*scale,next.z*scale))continue;if(dx&&dz&&(!canStand((current.x+dx)*scale,current.z*scale)||!canStand(current.x*scale,(current.z+dz)*scale)))continue;const g=current.g+Math.hypot(dx,dz);if(g>=(costs.get(nk)??Infinity))continue;costs.set(nk,g);parents.set(nk,ck);open.push({...next,g,f:g+Math.hypot(next.x-end.x,next.z-end.z)});}
 }
 toast('这里暂时过不去，试试另一条林间小路。');
}
function moveFox(dt,t){
 const forward=new THREE.Vector3(-Math.sin(cameraAngle),0,-Math.cos(cameraAngle)),right=new THREE.Vector3(Math.cos(cameraAngle),0,-Math.sin(cameraAngle));let direction=new THREE.Vector3();
 if(keys.has('w')||keys.has('arrowup'))direction.add(forward);if(keys.has('s')||keys.has('arrowdown'))direction.sub(forward);if(keys.has('a')||keys.has('arrowleft'))direction.sub(right);if(keys.has('d')||keys.has('arrowright'))direction.add(right);
 let moving=direction.lengthSq()>.001;
 if(moving)route=[];else if(route.length){direction.copy(route[0]).sub(fox.position);direction.y=0;if(direction.length()<.16)route.shift();else moving=true;}
 dash=Math.max(0,dash-dt);dashCooldown=Math.max(0,dashCooldown-dt);
 if(moving){direction.normalize();const speed=dash>0?9:keys.has('shift')?5.3:3.4;const step=direction.clone().multiplyScalar(Math.min(speed*dt,route.length?route[0].distanceTo(fox.position):Infinity));
  if(canStand(fox.position.x+step.x,fox.position.z))fox.position.x+=step.x;if(canStand(fox.position.x,fox.position.z+step.z))fox.position.z+=step.z;
  const angle=Math.atan2(direction.x,direction.z);fox.rotation.y+=Math.atan2(Math.sin(angle-fox.rotation.y),Math.cos(angle-fox.rotation.y))*Math.min(1,dt*14);play('step');
 }
 fox.userData.animate?.(t,moving);if(dash>0)fox.position.y=Math.sin((1-dash/.28)*Math.PI)*.36;else fox.position.y=0;
 for(const w of wispModels){if(!w.visible)continue;if(Math.hypot(fox.position.x-w.position.x,fox.position.z-w.position.z)<.85){w.visible=false;collected.add(w.userData.data.id);saved.wisps[level.id]=[...collected];persist();play('collect');burst(w.position,0xffdc8e,18);updateHUD();toast(collected.size===3?'三枚星屑都找到了！这片森林记住了你的脚步。':`捡到一枚林间星屑 · ${collected.size} / 3`);}}
 const nextActive=level.plates.filter(p=>Math.hypot(fox.position.x-p.x,fox.position.z-p.z)<.8).map(p=>p.id);
 if(!solved&&nextActive.join()!==activePlates.join()){activePlates=nextActive;for(const p of level.plates)entities[p.id].userData.setActive(activePlates.includes(p.id));recomputeLight();if(!solved&&route.length){const destination=route.at(-1).clone();goTo(destination.x,destination.z);}if(nextActive.length)toast('月纹石板亮了，荆棘正在让路。');}
 const gateDistance=Math.hypot(fox.position.x-level.gate.x,fox.position.z-level.gate.z);if(gateDistance>=1.15)gateReady=true;
 if(solved&&gateReady&&$('.success-banner').classList.contains('hidden')&&gateDistance<1.15){gateReady=false;route=[];if(levelIndex<LEVELS.length-1)transitionTo(levelIndex+1);else{showSuccess();fox.position.z+=1.2;}}
}
function updateLabels(){for(const label of labels){const p=label.object.position.clone();p.y+=label.offset;p.project(camera);label.el.style.left=`${(p.x*.5+.5)*sceneEl.clientWidth}px`;label.el.style.top=`${(-p.y*.5+.5)*sceneEl.clientHeight}px`;label.el.style.opacity=p.z>1?'0':'1';}}
const mini=$('#minimap').getContext('2d');
function drawMinimap(){
 const w=210,h=184;mini.clearRect(0,0,w,h);const point=(x,z)=>({x:105+x*7.7,y:89+z*7.7});mini.strokeStyle='#98b38933';mini.lineWidth=1;mini.beginPath();mini.arc(105,89,77,0,Math.PI*2);mini.stroke();
 if(lastTrace)for(const s of lastTrace.segments){const a=point(s.from.x,s.from.z),b=point(s.to.x,s.to.z);mini.strokeStyle='#'+COLOR[s.color].toString(16);mini.globalAlpha=.6;mini.beginPath();mini.moveTo(a.x,a.y);mini.lineTo(b.x,b.y);mini.stroke();}mini.globalAlpha=1;
 for(const m of level.mirrors){const p=point(m.x,m.z),a=angles[m.id]*Math.PI/180;mini.strokeStyle=selected===m.id?'#fff1b6':'#b1d5c4';mini.lineWidth=3;mini.beginPath();mini.moveTo(p.x-Math.cos(a)*5,p.y-Math.sin(a)*5);mini.lineTo(p.x+Math.cos(a)*5,p.y+Math.sin(a)*5);mini.stroke();}
 for(const r of level.receivers){const p=point(r.x,r.z);mini.fillStyle=solved||lastTrace?.litReceiverIds.includes(r.id)?'#fff2b4':'#78968c';mini.beginPath();mini.arc(p.x,p.y,4,0,Math.PI*2);mini.fill();}
 for(const p of level.plates){const pt=point(p.x,p.z);mini.fillStyle=activePlates.includes(p.id)?'#dbdb9a':'#617b6d';mini.fillRect(pt.x-3,pt.y-3,6,6);}
 const f=point(fox.position.x,fox.position.z);mini.fillStyle='#f8a764';mini.beginPath();mini.arc(f.x,f.y,4,0,Math.PI*2);mini.fill();mini.strokeStyle='#ffe5b6';mini.lineWidth=1;mini.stroke();
}
function tick(ms){
 requestAnimationFrame(tick);const t=ms/1000,dt=Math.min(t-lastTime,.045)||.016;lastTime=t;if(!renderer||!level)return;
 if(!paused&&!transitioning){if(!solved)seconds+=dt;moveFox(dt,t);saveTimer+=dt;if(saveTimer>=3)persist();forest.ambientUpdate?.(t);for(const w of wispModels){w.position.y=1+Math.sin(t*1.8+w.position.x)*.12;w.rotation.y=t*.7;}}
 for(const {sphere,segment,offset}of beamParticles){const k=(t*.22+offset)%1;sphere.position.set(THREE.MathUtils.lerp(segment.from.x,segment.to.x,k),1.35,THREE.MathUtils.lerp(segment.from.z,segment.to.z,k));}
 for(const p of [...particleGroup.children]){p.userData.life-=dt;p.position.addScaledVector(p.userData.velocity,dt);p.userData.velocity.y-=dt*1.3;p.material.opacity=Math.max(0,p.userData.life/1.3);p.rotation.x+=dt;if(p.userData.life<=0){particleGroup.remove(p);p.geometry.dispose();p.material.dispose();}}
 updateCamera();updateLabels();if(frameCount++%8===0){drawMinimap();$('#timer').textContent=clockText(seconds);}
 if(quality==='high')composer.render();else renderer.render(scene,camera);
}

function openModal(content){keys.clear();paused=true;$('#modal-root').innerHTML=`<div class="modal-backdrop"><section role="dialog" aria-modal="true" class="modal"><button class="close-btn" id="modal-close" aria-label="关闭窗口">${icon('close')}</button>${content}</section></div>`;$('#modal-close').onclick=closeModal;$('.modal-backdrop').onclick=e=>{if(e.target===e.currentTarget)closeModal();};$('#modal-close').focus();}
function closeModal(){paused=false;$('#modal-root').innerHTML='';keys.clear();}
function showHelp(){
 play('click');openModal(`<div class="eyebrow">A SMALL FOX. A BIG ADVENTURE.</div><h2>欢迎来到森光</h2><p>你是小狐狸「阿烁」。循着遗落的晨光，穿过五片静谧林地，让沉睡的森林重新闪耀。</p><div class="manual-grid"><div class="manual-item">${icon('mouse')}<strong>自在探索</strong><p>点击地面让阿烁走过去，或用 WASD / 方向键移动。Shift 奔跑，空格轻盈冲刺。</p></div><div class="manual-item">${icon('mirror')}<strong>让光转个弯</strong><p>点击镜子选中，再用 Q / E 或屏幕按钮旋转。每次转动 45°，光会实时改变方向。</p></div><div class="manual-item">${icon('diamond')}<strong>唤醒森林月石</strong><p>让光照到同色月石。之后还会遇到滤色晶片、分光棱晶和能移开荆棘的压力板。</p></div><div class="manual-item">${icon('spark')}<strong>带走一点星光</strong><p>每片林地藏着三枚星屑，靠近即可收集。解开光路后，穿过星门继续旅途。</p></div></div><div class="help-controls"><span><kbd>H</kbd> 提示</span><span><kbd>M</kbd> 地图</span><span><kbd>R</kbd> 重玩</span><span><kbd>C</kbd> 重置视角</span><span><kbd>Esc</kbd> 暂停</span></div><p style="font-size:10px">鼠标滚轮缩放 · 按住右键拖动环视 · 进度自动保存在当前浏览器</p><button class="primary-btn" id="start-adventure">出发，跟着光走 ${icon('arrow')}</button>`);$('#start-adventure').onclick=closeModal;
}
function showJournal(){
 const total=Object.values(saved.wisps).reduce((n,a)=>n+a.length,0);openModal(`<div class="eyebrow">LITTLE THINGS, LONG JOURNEYS</div><h2>阿烁的旅途手记</h2><p>「我以为自己在追逐光，后来才发现，我也可以成为光。」</p><div class="success-stats"><div><strong>${saved.completed.length} / 5</strong><small>已苏醒的林地</small></div><div><strong>${total} / 15</strong><small>收藏的星屑</small></div></div>${LEVELS.map((l,i)=>`<div class="journal-entry"><div class="entry-icon">${saved.completed.includes(l.id)?'✧':'·'}</div><div><h3>${NAMES[i]} <span style="font-family:Outfit;font-size:10px;color:#b3bb91">${(saved.wisps[l.id]||[]).length} / 3 星屑</span></h3><p>${saved.completed.includes(l.id)?NOTES[i]:'这页手记还在等待你的脚印。'}</p></div></div>`).join('')}`);
}
function showMap(){
 const highest=Math.max(0,...saved.completed.map(id=>LEVELS.findIndex(l=>l.id===id)+1));openModal(`<div class="eyebrow">FIVE CLEARINGS. ONE FOREST.</div><h2>森林地图</h2><p>循着光走，一片接着一片。已解锁的林地随时欢迎你回来。</p><div class="map-grid">${LEVELS.map((l,i)=>`<button class="map-level" data-go="${i}" ${i>highest?'disabled':''}><span class="map-index">${String(i+1).padStart(2,'0')}</span><span><strong>${NAMES[i]}</strong><small>${l.name} · ${(saved.wisps[l.id]||[]).length} / 3 星屑</small></span>${icon(i>highest?'lock':saved.completed.includes(l.id)?'check':'arrow')}</button>`).join('')}</div>`);for(const b of document.querySelectorAll('[data-go]'))b.onclick=()=>{if(+b.dataset.go===levelIndex)closeModal();else transitionTo(+b.dataset.go);};
}
function toggleSound(){soundEnabled=!soundEnabled;audio.setEnabled(soundEnabled);if(soundEnabled){audioStarted=true;audio.start();}$('#sound-button').innerHTML=icon(soundEnabled?'sound':'mute');$('#sound-button').setAttribute('aria-label',soundEnabled?'关闭音效':'开启音效');persist();}
function showSettings(){openModal(`<div class="eyebrow">TAKE A LITTLE BREATH</div><h2>在树荫下，歇一会儿</h2><p>冒险已暂停。森林会在这里等你。</p><div class="settings-row"><span>森林音效<small>轻柔旋律、鸟鸣与交互音效</small></span><button class="toggle-btn" id="setting-sound">${soundEnabled?'已开启':'已关闭'}</button></div><div class="settings-row"><span>画面品质<small>流畅模式会降低分辨率并关闭辉光与阴影</small></span><button class="toggle-btn" id="setting-quality">${quality==='high'?'精致':'流畅'}</button></div><div class="settings-row"><span>沉浸模式<small>全屏探索这片森林</small></span><button class="toggle-btn" id="fullscreen-button">${document.fullscreenElement?'退出全屏':'进入全屏'}</button></div><button class="primary-btn" id="resume-button" style="margin-top:25px">继续旅途 ${icon('arrow')}</button>`);
 $('#setting-sound').onclick=()=>{toggleSound();$('#setting-sound').textContent=soundEnabled?'已开启':'已关闭';};$('#setting-quality').onclick=()=>{quality=quality==='high'?'low':'high';renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='high'?1.7:1));renderer.shadowMap.enabled=quality==='high';scene.traverse(o=>{if(o.isMesh){for(const m of Array.isArray(o.material)?o.material:[o.material])m.needsUpdate=true;}});resize();$('#setting-quality').textContent=quality==='high'?'精致':'流畅';persist();};
 $('#fullscreen-button').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();$('#fullscreen-button').textContent=document.fullscreenElement?'退出全屏':'进入全屏';}catch{toast('当前浏览器暂不支持全屏模式。');}};$('#resume-button').onclick=closeModal;
}

$('#journal-button').onclick=showJournal;$('#sound-button').onclick=toggleSound;$('#settings-button').onclick=showSettings;$('#hint-button').onclick=showHint;$('#map-button').onclick=showMap;$('#reset-button').onclick=()=>{buildLevel(levelIndex,true);toast('晨光回到起点。再试一次吧。');};$('#rotate-left').onclick=()=>rotateMirror(-1);$('#rotate-right').onclick=()=>rotateMirror(1);$('#deselect-button').onclick=deselect;$('#guide-button').onclick=showHelp;$('#help-button').onclick=showHelp;$('#recenter-button').onclick=()=>{cameraAngle=Math.PI/4;targetZoom=1;camElevation=.79;};$('#close-hint').onclick=()=>$('.hint-panel').classList.add('hidden');$('.more-hint').onclick=showHint;
document.addEventListener('pointerdown',unlockAudio,{once:false});
document.addEventListener('keydown',e=>{
 unlockAudio();const k=e.key.toLowerCase();if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();if(k==='escape'){paused?closeModal():showSettings();return;}if(paused)return;
 keys.add(k);if(e.repeat)return;if(k==='q')rotateMirror(-1);if(k==='e')rotateMirror(1);if(k==='h')showHint();if(k==='m')showMap();if(k==='j')showJournal();if(k==='r'){buildLevel(levelIndex,true);toast('这一束晨光，重新出发。');}if(k==='c'){cameraAngle=Math.PI/4;targetZoom=1;camElevation=.79;}if(k===' '&&dashCooldown<=0){dash=.28;dashCooldown=1;play('collect');}if(k==='f'){const nearest=[...level.mirrors].sort((a,b)=>Math.hypot(a.x-fox.position.x,a.z-fox.position.z)-Math.hypot(b.x-fox.position.x,b.z-fox.position.z))[0];selectMirror(nearest.id,true);}
});document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
for(const btn of document.querySelectorAll('[data-key]')){btn.addEventListener('pointerdown',e=>{e.preventDefault();keys.add(btn.dataset.key);btn.setPointerCapture(e.pointerId);});for(const event of ['pointerup','pointercancel','lostpointercapture'])btn.addEventListener(event,()=>keys.delete(btn.dataset.key));}
let dragging=false,dragStart=null,pointerDown=null;
sceneEl.addEventListener('contextmenu',e=>e.preventDefault());
sceneEl.addEventListener('pointerdown',e=>{if(paused)return;pointerDown={x:e.clientX,y:e.clientY};if(e.button===2){dragging=true;dragStart={x:e.clientX,y:e.clientY};sceneEl.setPointerCapture(e.pointerId);}});
sceneEl.addEventListener('pointermove',e=>{if(dragging&&dragStart){cameraAngle-=(e.clientX-dragStart.x)*.006;camElevation=THREE.MathUtils.clamp(camElevation+(e.clientY-dragStart.y)*.004,.35,1.2);dragStart={x:e.clientX,y:e.clientY};}});
sceneEl.addEventListener('pointerup',e=>{
 if(dragging){dragging=false;dragStart=null;return;}if(paused||e.button===2||!pointerDown||Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)>8)return;
 const rect=sceneEl.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);
 const hits=raycaster.intersectObjects(puzzleGroup.children,true);let target=null;for(const hit of hits){let obj=hit.object;while(obj.parent&&obj.parent!==puzzleGroup)obj=obj.parent;if(['mirror','plate','gate'].includes(obj.userData.kind)){target=obj;break;}}
 if(target?.userData.kind==='mirror'){selectMirror(target.userData.id,true);return;}
 const pos=new THREE.Vector3();if(target){pos.copy(target.position);}else if(!raycaster.ray.intersectPlane(groundPlane,pos))return;
 goTo(pos.x,pos.z);const marker=document.createElement('div');marker.className='click-marker';marker.style.left=(e.clientX-rect.left)+'px';marker.style.top=(e.clientY-rect.top)+'px';sceneEl.appendChild(marker);setTimeout(()=>marker.remove(),800);
});sceneEl.addEventListener('wheel',e=>{e.preventDefault();targetZoom=THREE.MathUtils.clamp(targetZoom-e.deltaY*.001,.7,1.5);},{passive:false});
window.addEventListener('resize',resize);window.addEventListener('pagehide',persist);document.addEventListener('visibilitychange',()=>{if(document.hidden){persist();keys.clear();if(!paused)showSettings();}});
if(renderer){resize();updateCamera();buildLevel(levelIndex);requestAnimationFrame(tick);requestAnimationFrame(()=>$('.loading').classList.add('hidden'));}
// Read-only diagnostics help verify rendering and progression without bypassing game rules.
window.lumenFox={getState:()=>({level:levelIndex,levelName:level?.name,angles:{...angles},solved,collected:[...collected],completed:[...saved.completed],fox:{x:fox?.position.x,z:fox?.position.z},activePlates:[...activePlates],lit:[...(lastTrace?.litReceiverIds||[])],paused,rotations,routeLength:route.length,render:renderer?{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles}:null,objects:level?[...level.mirrors,...level.wisps,...level.plates,level.gate].map(o=>{const p=new THREE.Vector3(o.x,0,o.z).project(camera),rect=sceneEl.getBoundingClientRect();return{id:o.id||'gate',x:o.x,z:o.z,screen:{x:rect.left+(p.x*.5+.5)*rect.width,y:rect.top+(-p.y*.5+.5)*rect.height}};}):[]})};
