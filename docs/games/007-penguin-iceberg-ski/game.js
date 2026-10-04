import * as THREE from './vendor/three.module.js';

const $ = id => document.getElementById(id);
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const PLAYER_Z = 8;
const GOAL = 2000;
const keys = new Set();
let phase = 'menu', mode = 'race', quality = true, soundOn = false, audio;
let run, entities = [], generation = 0, randomSeed = 4287, lastTime = 0, clock = 0, toastTimer = 0, countdown = 0;
let input = { left:false, right:false, boost:false }, jumpBuffer = 0, modalReturnFocus;
const readStore = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
const writeStore = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
let best = Number(readStore('polar-drift-best-v1', '0')) || 0;
$('best').textContent = best.toLocaleString('zh-CN');
const random = () => { randomSeed = (Math.imul(1664525, randomSeed) + 1013904223) >>> 0; return randomSeed / 4294967296; };
const choose = a => a[Math.floor(random() * a.length)];
const scene = new THREE.Scene();
scene.background = new THREE.Color('#cae9f6');
scene.fog = new THREE.Fog('#cae9f6', 65, 240);
const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, .1, 500);
camera.position.set(0, 8, 24);
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  $('world').appendChild(renderer.domElement);
} catch (error) {
  $('loading').innerHTML = '<span class="brand-mark">✳</span><p>这个浏览器暂时无法开启 3D 场景。</p><p>请启用硬件加速，或使用支持 WebGL 2 的浏览器。</p>';
  throw error;
}
const hemi = new THREE.HemisphereLight(0xe2faff, 0x588798, 3.0);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff5df, 3.6);
sun.position.set(-35, 55, 20); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left:-30, right:30, top:35, bottom:-35, near:1, far:150 });
sun.shadow.normalBias = .035;
sun.target.position.set(0, 0, -12);
scene.add(sun, sun.target);
const mat = (color, extra={}) => new THREE.MeshStandardMaterial({color, roughness:.85, flatShading:true, ...extra});
const materials = {
 snow:mat('#f0fcff'), ice:mat('#91d4ea'), iceDark:mat('#58a8c7'), glacier:mat('#bdebf6'), water:mat('#5daac4',{metalness:.2,roughness:.38}),
 black:mat('#172f40'), white:mat('#fffef2'), orange:mat('#ffb43e'), scarf:mat(readStore('polar-drift-scarf','#fa634d')),
 ski:mat('#ee7654'), goggles:mat('#a3e4e2',{metalness:.5,roughness:.15}), fish:mat('#ffd376',{metalness:.2,roughness:.4}),
 pole:mat('#2d7187'), flag:mat('#f17b57'), shield:mat('#68d8f2',{emissive:'#195c75',emissiveIntensity:.6}), magnet:mat('#ad91ee',{emissive:'#412168',emissiveIntensity:.4}), crack:mat('#244e6a')
};
const geo = {
 sphere: new THREE.SphereGeometry(1, 20, 14), lowSphere:new THREE.IcosahedronGeometry(1,0),
 box:new THREE.BoxGeometry(1,1,1), cone:new THREE.ConeGeometry(1,1,5), cylinder:new THREE.CylinderGeometry(1,1,1,8),
 torus:new THREE.TorusGeometry(1,.13,7,28)
};
function mesh(geometry, material, parent, x=0,y=0,z=0,sx=1,sy=sx,sz=sx) {
 const o = new THREE.Mesh(geometry, material); o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;
}
const ocean = mesh(geo.box, materials.water, scene, 0,-1.35,-120,550,.8,400);
const road = mesh(geo.box, materials.snow,scene,0,-.5,-104,24,1,280);
road.castShadow=false;
mesh(geo.box, materials.ice,scene,-11.9,-1,-104,.5,2,280);
mesh(geo.box, materials.ice,scene,11.9,-1,-104,.5,2,280);
// Delicate carved lines in the snow make movement legible without hiding the landscape.
const trackMat = mat('#ccebf3');
[-8,-4,0,4,8].forEach(x=>mesh(geo.box,trackMat,scene,x,.006,-104,.026,.01,280));
const scenery = [];
for(let i=0;i<72;i++) {
 const side = i%2?1:-1;
 const island = new THREE.Group();
 const height = 3 + random()*22;
 const radius = 3 + random()*8;
 const x = side*(17 + random()*53);
 const z = 26 - Math.floor(i/2)*8;
 mesh(geo.cylinder,materials.iceDark,island,0,-1.2,0,radius,2,radius);
 const peak = mesh(geo.cone, i%3?materials.ice:materials.glacier,island,0,height*.44,0,radius,height,radius);
 peak.rotation.y=random()*5;
 const cap = mesh(geo.cone,materials.snow,island,0,height*.74,0,radius*.47,height*.47,radius*.47);
 cap.rotation.y=peak.rotation.y;
 if(i%3===0){const sidePeak=mesh(geo.cone,materials.glacier,island,radius*.58,height*.24,1,radius*.65,height*.58,radius*.65);sidePeak.rotation.y=1;}
 island.position.set(x,0,z);scene.add(island);scenery.push(island);
}
// Distant silhouettes remain stable on the horizon.
const farMat = mat('#b0d8eb');
for(let i=0;i<18;i++)mesh(geo.cone,farMat,scene,-160+i*19,15+random()*10,-270-random()*40,25+random()*20,40+random()*40,20);
const routeMarkers=[];
for(let i=0;i<32;i++) {
 const marker = new THREE.Group(); const side=i%2?1:-1;
 mesh(geo.cylinder,materials.pole,marker,0,.65,0,.05,1.3,.05);
 mesh(geo.box,i%4<2?materials.flag:materials.goggles,marker,side*.25,1.15,0,.55,.35,.04);
 marker.position.set(side*10.5,0,25-Math.floor(i/2)*18);scene.add(marker);routeMarkers.push(marker);
}
const penguin = new THREE.Group(); scene.add(penguin);
const body = mesh(geo.sphere,materials.black,penguin,0,1.23,0,.73,1.05,.63);
mesh(geo.sphere,materials.white,penguin,0,1.2,.44,.57,.79,.23);
const head = mesh(geo.sphere,materials.black,penguin,0,2.18,.01,.64,.62,.6);
[-1,1].forEach(side=>{
 mesh(geo.sphere,materials.white,penguin,side*.25,2.24,.475,.24,.27,.12);
 mesh(geo.sphere,materials.black,penguin,side*.23,2.25,.588,.058,.084,.035);
 mesh(geo.sphere,materials.white,penguin,side*.217,2.28,.616,.017,.025,.009);
 mesh(geo.sphere,materials.orange,penguin,side*.37,.3,.15,.27,.16,.41);
});
const beak=mesh(geo.cone,materials.orange,penguin,0,2.06,.71,.22,.4,.15);beak.rotation.x=Math.PI/2;
const scarfRing=mesh(geo.torus,materials.scarf,penguin,0,1.76,.01,.62,.62,.62);scarfRing.rotation.x=Math.PI/2;
const scarfTail=mesh(geo.box,materials.scarf,penguin,.35,1.58,-.55,.29,.16,.95);scarfTail.rotation.z=.2;
const arms=[];[-1,1].forEach(side=>{const wing=mesh(geo.sphere,materials.black,penguin,side*.74,1.3,0,.2,.65,.29);wing.rotation.z=side*.35;arms.push(wing);});
const skis=[];[-1,1].forEach(side=>{const ski=new THREE.Group();mesh(geo.box,materials.ski,ski,0,.16,0,.25,.13,2.7);const tip=mesh(geo.box,materials.ski,ski,0,.25,1.4,.25,.13,.4);tip.rotation.x=-.45;mesh(geo.box,materials.white,ski,0,.235,.5,.17,.02,.53);ski.position.x=side*.42;penguin.add(ski);skis.push(ski);});
const gogglesBand=mesh(geo.torus,materials.pole,penguin,0,2.53,0,.59,.59,.59);gogglesBand.rotation.x=Math.PI/2;
mesh(geo.sphere,materials.goggles,penguin,0,2.56,.39,.43,.17,.2);
const shieldBubble = mesh(geo.sphere,new THREE.MeshBasicMaterial({color:'#79def8',transparent:true,opacity:.15,wireframe:true}),penguin,0,1.45,0,1.25,1.7,1.2);shieldBubble.visible=false;
const shadow = mesh(new THREE.CircleGeometry(.9,28),new THREE.MeshBasicMaterial({color:'#426f8b',transparent:true,opacity:.2,depthWrite:false}),scene,0,.025,8,1.2,1,1);
shadow.rotation.x=-Math.PI/2;shadow.castShadow=false;
const trailMat = new THREE.MeshBasicMaterial({color:'#6dabc4',transparent:true,opacity:.2,depthWrite:false});
const trails=[];
for(let i=0;i<75;i++){const t=mesh(geo.box,trailMat,scene,0,-2,0,.12,.012,1.4);t.castShadow=false;trails.push(t);}
let trailIndex=0,trailClock=0;
const snowCount=350, snowPos=new Float32Array(snowCount*3);
for(let i=0;i<snowCount;i++){snowPos[i*3]=(random()-.5)*110;snowPos[i*3+1]=random()*38;snowPos[i*3+2]=-160+random()*200;}
const snowGeo = new THREE.BufferGeometry();snowGeo.setAttribute('position',new THREE.BufferAttribute(snowPos,3));
const snow = new THREE.Points(snowGeo,new THREE.PointsMaterial({color:'#ffffff',size:.13,transparent:true,opacity:.8,depthWrite:false}));scene.add(snow);
const particleGroup=new THREE.Group();scene.add(particleGroup);
const particles=[];
const particleMats=[new THREE.MeshBasicMaterial({color:'#f8ffff'}),new THREE.MeshBasicMaterial({color:'#ffd276'}),new THREE.MeshBasicMaterial({color:'#7adbec'})];
for(let i=0;i<70;i++){const p=mesh(geo.lowSphere,particleMats[0],particleGroup,0,-10,0,.1);p.castShadow=false;particles.push({mesh:p,life:0,v:new THREE.Vector3()});}
function burst(x,y,z,color=0,count=15){for(let i=0;i<count;i++){const p=particles.find(p=>p.life<=0);if(!p)break;p.mesh.material=particleMats[color];p.mesh.position.set(x,y,z);p.v.set((Math.random()-.5)*7,2+Math.random()*6,(Math.random()-.5)*6);p.life=.6+Math.random()*.5;p.mesh.visible=true;p.mesh.scale.setScalar(.05+Math.random()*.12);}}
// A light ribbon appears over the last stretch of the expedition.
const aurora = new THREE.Group();scene.add(aurora);
for(let j=0;j<3;j++){
 const vertices=[];for(let i=0;i<42;i++){const x=-110+i*5.5,y=45+Math.sin(i*.25+j)*9;vertices.push(x,y,-205-j*9,x,y+7+Math.sin(i*.5)*2,-205-j*9);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const indices=[];for(let i=0;i<41;i++)indices.push(i*2,i*2+1,i*2+2,i*2+1,i*2+3,i*2+2);geometry.setIndex(indices);
 const a=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:j===1?'#a7a2ff':'#91ffe0',side:THREE.DoubleSide,transparent:true,opacity:0,depthWrite:false}));aurora.add(a);
}
function fishModel(){const g=new THREE.Group();mesh(geo.sphere,materials.fish,g,0,0,0,.48,.27,.17);const tail=mesh(geo.cone,materials.fish,g,-.53,0,0,.28,.4,.11);tail.rotation.z=-Math.PI/2;mesh(geo.sphere,materials.black,g,.21,.055,.157,.033);return g;}
function makeEntity(type,x,z){
 const g=new THREE.Group();let radius=1.4;
 if(type==='fish')g.add(fishModel());
 if(type==='rock'){mesh(geo.lowSphere,materials.iceDark,g,0,.8,0,1.05,1.35,1.0);mesh(geo.cone,materials.glacier,g,.1,1.7,0,.62,1.0,.65);radius=1.45;}
 if(type==='ramp'){
   const ramp=mesh(geo.box,materials.glacier,g,0,.28,0,3.1,.4,4);ramp.rotation.x=.18;
   mesh(geo.box,materials.flag,g,0,.7,-1.6,3.2,.1,.3);radius=1.8;
 }
 if(type==='gap'){mesh(geo.box,materials.crack,g,0,.035,0,3.5,.04,5);mesh(geo.box,materials.iceDark,g,-1.8,.08,0,.12,.16,5);mesh(geo.box,materials.iceDark,g,1.8,.08,0,.12,.16,5);radius=1.9;}
 if(type==='gate'){
  [-1,1].forEach(s=>{mesh(geo.cylinder,materials.pole,g,s*2.5,1.9,0,.07,3.8,.07);mesh(geo.box,materials.flag,g,s*2,3.35,0,1,.6,.06);});radius=2.4;
 }
 if(type==='shield'||type==='magnet'){
   const m=type==='shield'?materials.shield:materials.magnet;
   mesh(geo.lowSphere,m,g,0,0,0,.68);const ring=mesh(geo.torus,m,g,0,0,0,.94,.94,.94);ring.rotation.x=.2;radius=1.25;
 }
 g.position.set(x,type==='fish'?1.25:(type==='shield'||type==='magnet'?1.6:0),z);scene.add(g);
 const e={type,g,x,z,done:false,radius,baseY:g.position.y,seed:random()*6,near:false};entities.push(e);return e;
}
const lanes=[-7,-3.5,0,3.5,7];let lastSafe=2;
function spawnRow(z){
 generation++;
 // The indicated route moves by at most one lane per 26 m; all hazards stay off it.
 const safe=clamp(lastSafe + choose([-1,0,1]),0,4);lastSafe=safe;
 for(let n=0;n<3;n++)makeEntity('fish',lanes[safe],z-n*3.2);
 if(generation%3===0)makeEntity('gate',lanes[safe],z-11);
 else if(generation%5===0)makeEntity('ramp',lanes[safe],z-7);
 const blocked=[0,1,2,3,4].filter(v=>v!==safe);
 const hazardLane=choose(blocked);
 if(generation>1)makeEntity(generation%4===0?'gap':'rock',lanes[hazardLane],z-7);
 if(run && run.distance>600 && generation%3!==0){const second=choose(blocked.filter(v=>v!==hazardLane));makeEntity('rock',lanes[second],z-8);}
 if(generation%7===0)makeEntity(generation%14===0?'magnet':'shield',lanes[safe],z-17);
}
function clearEntities(){for(const e of entities)scene.remove(e.g);entities=[];}
function resetWorld(){clearEntities();generation=0;lastSafe=2;randomSeed=mode==='race'?4287:(Date.now()>>>0);for(let z=-18;z>-235;z-=26)spawnRow(z);trails.forEach(t=>t.position.y=-2);}
function resetRun(){
 run={distance:0,points:0,fish:0,hearts:3,speed:0,energy:100,x:0,vx:0,y:0,vy:0,combo:0,comboTime:0,maxCombo:0,shield:0,magnet:0,invulnerable:0,elapsed:0,gates:0,tricks:0,spin:0,airSpin:0,mission:0,missions:0,biome:0,boosting:false,boostBlocked:false};
 jumpBuffer=0;keys.clear();input={left:false,right:false,boost:false};resetWorld();updateHud();
}
function tone(freq=700,duration=.08,type='sine',volume=.04){if(!soundOn)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(volume,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration);}catch{}}
function toast(message,time=2.3){$('toast').textContent=message;$('toast').classList.remove('hidden');toastTimer=time;}
function award(points,label){run.combo=Math.min(8,run.combo+1);run.maxCombo=Math.max(run.maxCombo,run.combo);run.comboTime=5;const mult=1+run.combo*.25;run.points+=Math.round(points*mult);if(label)toast(label+` +${Math.round(points*mult)}`);}
function jump(power=10.6){if(run.y>.15)return;run.vy=power;run.y=.03;run.spin=0;run.airSpin=0;burst(run.x,.2,PLAYER_Z,0,13);tone(400,.15,'triangle');}
function hit(type){
 if(run.invulnerable>0)return;
 if(mode==='zen'){run.invulnerable=1.4;toast('轻轻碰了一下 · 继续练习');return;}
 if(run.shield>0){run.shield=0;run.invulnerable=1.8;burst(run.x,1.4,PLAYER_Z,2,22);toast('护盾保护了你');tone(360,.2);return;}
 run.hearts--;run.invulnerable=2.8;run.combo=0;run.comboTime=0;run.energy=Math.max(0,run.energy-22);run.speed*=.6;
 burst(run.x,1,PLAYER_Z,0,24);$('flash').style.opacity='.35';tone(130,.25,'sawtooth',.035);
 toast(type==='gap'?'小心冰裂隙！可以跳过去':'撞到冰柱了！跟着鱼群走');
 if(type==='gap'){run.y=.4;run.vy=7;}
 if(run.hearts<=0)finish(false);
}
function start(){
 closeModal();resetRun();phase='countdown';countdown=3;
 document.body.classList.add('playing');['menu','menu-footer','expedition'].forEach(id=>$(id).classList.add('hidden'));
 ['hud','pause','desktop-controls','touch-controls','countdown'].forEach(id=>$(id).classList.remove('hidden'));
 $('countdown').textContent='3';$('distance-goal').textContent=mode==='race'?' / 2000 M':' M';
 $('toast').classList.add('hidden');$('start').blur();tone(550,.13);
}
function showModal(title,body,buttons){modalReturnFocus=document.activeElement;$('modal-title').textContent=title;$('modal-body').innerHTML=body;$('modal-actions').replaceChildren();for(const b of buttons){const el=document.createElement('button');el.className=b.primary?'primary':'secondary';el.textContent=b.text;el.addEventListener('click',b.fn);$('modal-actions').appendChild(el);}$('modal').classList.remove('hidden');$('modal-actions').querySelector('button')?.focus();}
function closeModal(){$('modal').classList.add('hidden');modalReturnFocus?.focus?.();}
function pause(){if(phase!=='playing'&&phase!=='countdown')return;const previous=phase;phase='paused';keys.clear();input={left:false,right:false,boost:false};document.body.classList.remove('boosting');showModal('在雪地里歇一会儿',`<p>冰川不会跑掉，准备好了就继续。<br>本次已滑行 <b>${Math.floor(run.distance)} 米</b>，收集了 <b>${run.fish} 条鱼</b>。</p>`,[{text:'继续滑行',primary:true,fn:()=>{closeModal();phase=previous;}},{text:'重新开始',fn:start},{text:'返回营地',fn:home}]);}
function home(){closeModal();phase='menu';document.body.classList.remove('playing','boosting');['hud','pause','desktop-controls','touch-controls','countdown','toast'].forEach(id=>$(id).classList.add('hidden'));['menu','menu-footer','expedition'].forEach(id=>$(id).classList.remove('hidden'));resetRun();$('start').focus();}
function totalScore(){return Math.floor(run.distance*.5+run.points);}
function finish(won){
 if(phase==='finished')return;phase='finished';keys.clear();input={left:false,right:false,boost:false};document.body.classList.remove('boosting');
 const score=totalScore(),newBest=score>best;
 if(newBest){best=score;writeStore('polar-drift-best-v1',best);$('best').textContent=best.toLocaleString('zh-CN');}
 $('countdown').classList.add('hidden');$('toast').classList.add('hidden');
 const rating=won?'极地探险完成':run.distance>1200?'冰川冒险家':run.distance>400?'雪地巡游者':'初来乍到的滑雪家';
 showModal(won?'你征服了这座冰川！':'这趟冒险，值得纪念',`<div class="results"><div class="result-stat"><small>本次得分</small><b>${score.toLocaleString('zh-CN')}</b></div><div class="result-stat"><small>滑行距离</small><b>${Math.floor(run.distance)} <small style="display:inline">m</small></b></div><div class="result-stat"><small>收集鱼群</small><b>${run.fish}</b></div><div class="result-stat"><small>最高倍率</small><b>×${(1+run.maxCombo*.25).toFixed(2)}</b></div></div><div class="result-badge">${newBest?'✧ 新的个人最佳 · ':''}${rating}</div><p>穿过 ${run.gates} 道旗门 · 完成 ${run.tricks} 次转体<br>滑行用时 ${Math.floor(run.elapsed/60)} 分 ${Math.floor(run.elapsed%60)} 秒</p>`,[{text:won?'再滑一程':'再试一次',primary:true,fn:start},{text:'返回营地',fn:home}]);
 tone(won?880:300,.35,'triangle');
}
function help(){const wasPlaying=phase==='playing'||phase==='countdown';const previous=phase;if(wasPlaying)phase='paused';keys.clear();input={left:false,right:false,boost:false};showModal('你的冰川滑行指南',`<div class="controls-list"><span><kbd>← →</kbd> 转向</span><span><kbd>A D</kbd> 转向 / 空中转体</span><span><kbd>SPACE</kbd> 跳跃</span><span><kbd>SHIFT</kbd> 按住冲刺</span><span><kbd>ESC</kbd> 暂停</span><span>触屏使用下方按钮</span></div><div class="guide-icons"><p><b>金色鱼群</b> · 每条基础 10 分，同时补充冲刺能量。<br><b>橙色旗门</b> · 从两根旗杆之间通过，基础 50 分。<br><b>蓝色跳台</b> · 弹得更高！腾空后转向，转满一圈加分。<br><b>蓝色晶体</b> · 10 秒护盾，抵挡一次碰撞。<br><b>紫色晶体</b> · 10 秒磁铁，吸引附近的鱼。<br><b>冰柱和裂隙</b> · 绕开或跳过；受伤后短暂无敌。</p><p>连续收集与穿旗门可获得最高 <b>3 倍连击</b>。每隔一段路，天色和雪景都会变化。竞速终点为 2,000 米；自由滑行不会扣心。</p></div>`,[{text:wasPlaying?'明白了，继续滑行':'准备好了',primary:true,fn:()=>{closeModal();phase=previous;}}]);}
const missions=[{text:'收集 20 条鱼',key:'fish',target:20,icon:'◇'},{text:'穿过 8 道旗门',key:'gates',target:8,icon:'⚑'},{text:'完成 3 次空中转体',key:'tricks',target:3,icon:'↻'},{text:'滑行 1,500 米',key:'distance',target:1500,icon:'✧'}];
function updateHud(){
 $('score').textContent=String(totalScore()).padStart(5,'0');$('fish').textContent=run.fish;$('distance').textContent=Math.floor(run.distance).toLocaleString('zh-CN');
 $('hearts').textContent=mode==='zen'?'∞':Array.from({length:3},(_,i)=>i<run.hearts?'♥':'♡').join(' ');$('hearts').setAttribute('aria-label',mode==='zen'?'练习模式，无限生命':`${run.hearts} 颗心`);
 $('speed').textContent=Math.round(run.speed*3.6);$('energy-fill').style.width=run.energy+'%';$('progress-fill').style.width=(mode==='race'?Math.min(run.distance/GOAL*100,100):(run.distance%2000)/20)+'%';
 $('combo').classList.toggle('hidden',run.combo<2);$('multiplier').textContent=(1+run.combo*.25).toFixed(2);$('combo').querySelector('i').style.transform=`scaleX(${run.comboTime/5})`;
 $('combo-label').textContent=run.combo>=8?'极地连击！':'漂亮连击';
 const mission=missions[run.mission];if(mission){$('mission-text').firstChild.textContent=mission.text;$('mission-progress').textContent=`${Math.min(Math.floor(run[mission.key]),mission.target)} / ${mission.target}`;$('mission-icon').textContent=mission.icon;}else{$('mission-text').firstChild.textContent='所有目标已完成';$('mission-progress').textContent='这座冰川记住你了';$('mission-icon').textContent='✓';}
 $('power-status').innerHTML=(run.shield>0?`<span class="power-pill">◈ 护盾 ${Math.ceil(run.shield)}s</span>`:'')+(run.magnet>0?`<span class="power-pill">✦ 磁铁 ${Math.ceil(run.magnet)}s</span>`:'');
}
const palettes=[{sky:'#cae9f6',water:'#5daac4',light:'#fff5df',far:'#b0d8eb',name:'01 / 冰川起点'},{sky:'#e7cde0',water:'#819fbf',light:'#ffd9ad',far:'#b7abc8',name:'02 / 日落峡谷'},{sky:'#7faccb',water:'#487caa',light:'#c5e3ff',far:'#7795bd',name:'03 / 极光雪原'}];
const targetColor=new THREE.Color();
function updateAtmosphere(dt){const index=phase==='menu'?0:Math.min(2,Math.floor((run.distance%2400)/800));const p=palettes[index];if(run.biome!==index){run.biome=index;$('biome').textContent=p.name;if(phase==='playing')toast(index===1?'驶入日落峡谷 · 继续追着光':'极光出现了 · 最后一段冰川');}const a=1-Math.exp(-dt*.65);scene.background.lerp(targetColor.set(p.sky),a);scene.fog.color.copy(scene.background);materials.water.color.lerp(targetColor.set(p.water),a);sun.color.lerp(targetColor.set(p.light),a);farMat.color.lerp(targetColor.set(p.far),a);for(const [i,r]of aurora.children.entries()){r.material.opacity=lerp(r.material.opacity,index===2?.22:0,a);r.position.y=Math.sin(clock*.3+i)*2;}}
function updateGameplay(dt){
 run.elapsed+=dt;
 const left=keys.has('ArrowLeft')||keys.has('KeyA')||input.left;
 const right=keys.has('ArrowRight')||keys.has('KeyD')||input.right;
 const steer=Number(right)-Number(left);
 const boostHeld=keys.has('ShiftLeft')||keys.has('ShiftRight')||input.boost;
 if(!boostHeld)run.boostBlocked=false;
 if(boostHeld&&run.energy<=2){if(!run.boostBlocked)toast('能量用完啦 · 松开冲刺恢复能量');run.boostBlocked=true;}
 const boosting=boostHeld&&!run.boostBlocked&&run.energy>2;
 run.boosting=boosting;document.body.classList.toggle('boosting',boosting);
 const base=mode==='zen'?19:22+Math.min(run.distance/220,10);
 run.speed=lerp(run.speed,base*(boosting?1.5:1),1-Math.exp(-dt*2));
 run.energy=clamp(run.energy+(boosting?-34:8)*dt,0,100);
 run.vx=lerp(run.vx,steer*(boosting?13.5:11),1-Math.exp(-dt*10));run.x=clamp(run.x+run.vx*dt,-8.2,8.2);
 if(jumpBuffer>0){jumpBuffer-=dt;if(run.y<.05){jump();jumpBuffer=0;}}
 const wasAir=run.y>0;run.vy-=23*dt;run.y=Math.max(0,run.y+run.vy*dt);if(run.y===0)run.vy=0;
 if(wasAir&&run.y===0){run.vy=0;burst(run.x,.25,PLAYER_Z,0,12);const turns=Math.floor((Math.abs(run.airSpin)+.08)/(Math.PI*2));if(turns>0){run.tricks+=turns;award(120*turns,`${turns*360}° 转体落地！`);tone(900,.18,'triangle');}run.spin=0;run.airSpin=0;}
 if(run.y>0&&steer!==0){const spinStep=steer*8.3*dt;run.spin+=spinStep;run.airSpin+=spinStep;}
 const delta=run.speed*dt;run.distance+=delta;
 for(const key of ['shield','magnet','invulnerable','comboTime'])run[key]=Math.max(0,run[key]-dt);
 if(run.comboTime===0)run.combo=0;
 for(const e of entities){
  const prev=e.g.position.z;e.g.position.z+=delta;e.z=e.g.position.z;
  if(e.done)continue;
  const dz=e.z-PLAYER_Z,dx=Math.abs(e.g.position.x-run.x);
  if(e.type==='fish'||e.type==='shield'||e.type==='magnet'){
   e.g.rotation.y=clock*1.5+e.seed;e.g.position.y=e.baseY+Math.sin(clock*3+e.seed)*.16;
   if(e.type==='fish'&&run.magnet>0&&Math.abs(dz)<13&&dx<7){e.g.position.x=lerp(e.g.position.x,run.x,dt*9);e.g.position.y=lerp(e.g.position.y,run.y+1,dt*6);}
   const collectRange=e.type==='fish'&&run.magnet>0?3:1.45;
   if(Math.abs(dz)<collectRange&&Math.abs(e.g.position.x-run.x)<1.3&&Math.abs(e.g.position.y-(run.y+1.15))<1.8){
    e.done=true;e.g.visible=false;
    if(e.type==='fish'){run.fish++;run.energy=Math.min(100,run.energy+4);award(10);burst(e.g.position.x,e.g.position.y,PLAYER_Z,1,6);tone(700+run.combo*65,.065);}
    else {run[e.type]=10;toast(e.type==='shield'?'护盾就绪 · 放心冲一次':'磁铁启动 · 鱼群跟着你走');burst(run.x,1.6,PLAYER_Z,2,20);tone(1050,.2);}
   }
  }else if(e.type==='gate'){
   if(prev<PLAYER_Z&&e.z>=PLAYER_Z){e.done=true;if(dx<e.radius){run.gates++;award(50,'完美穿门');tone(880,.1);}else if(run.combo>0){run.combo=Math.max(0,run.combo-2);}}
  }else if(e.type==='ramp'){
   if(Math.abs(dz)<2&&dx<e.radius&&run.y<.15){e.done=true;jump(14.7);award(40,'飞跃跳台 · 转向做动作');}
  }else{
   const depth=e.type==='gap'?2.6:1.4;
   if(Math.abs(dz)<depth&&dx<e.radius&&run.y<(e.type==='gap'?.65:2.1)){e.done=true;hit(e.type);if(phase!=='playing')break;}
   if(prev<PLAYER_Z&&e.z>=PLAYER_Z&&!e.done&&e.type==='rock'&&dx>=e.radius&&dx<2.4){e.near=true;award(30,'擦肩而过');}
  }
 }
 entities=entities.filter(e=>{if(e.z>30){scene.remove(e.g);return false;}return true;});
 const farthest=entities.reduce((m,e)=>Math.min(m,e.z),0);if(farthest>-218)spawnRow(farthest-26);
 const mission=missions[run.mission];if(mission&&run[mission.key]>=mission.target){run.mission++;run.missions++;run.points+=250;run.energy=Math.min(100,run.energy+25);toast('小目标完成！奖励 250 分 + 冲刺能量',3);tone(1200,.25,'triangle');}
 if(mode==='race'&&run.distance>=GOAL&&phase==='playing'){run.distance=GOAL;finish(true);}
 return delta;
}
function updateScene(dt,delta){
 for(const m of scenery){m.position.z+=delta*(Math.abs(m.position.x)>40?.75:1);if(m.position.z>45)m.position.z-=310;}
 for(const m of routeMarkers){m.position.z+=delta;if(m.position.z>40)m.position.z-=288;}
 for(const t of trails)t.position.z+=delta;
 if(phase==='playing'&&run.y<.05){trailClock+=dt;if(trailClock>.035){trailClock=0;for(const side of [-1,1]){const t=trails[trailIndex++%trails.length];t.position.set(run.x+side*.43,.018,PLAYER_Z+.9);t.rotation.y=-run.vx*.015;t.scale.z=Math.max(.8,delta*2);}}}
 for(let i=0;i<snowCount;i++){snowPos[i*3]+=(Math.sin(clock*.2+i)*.2+.4)*dt;snowPos[i*3+1]-=(.6+i%4*.14)*dt;snowPos[i*3+2]+=delta*.65;if(snowPos[i*3+2]>35)snowPos[i*3+2]=-165;if(snowPos[i*3+1]<0)snowPos[i*3+1]=36;}
 snowGeo.attributes.position.needsUpdate=true;
 for(const p of particles){if(p.life<=0){p.mesh.visible=false;continue;}p.life-=dt;p.mesh.position.addScaledVector(p.v,dt);p.mesh.position.z+=delta*.65;p.v.y-=12*dt;p.mesh.scale.multiplyScalar(Math.max(0,1-dt*1.3));}
 const inMenu=phase==='menu';
 if(inMenu){
  const mobile=innerWidth<761;penguin.position.set(mobile?0:3.8,.05+Math.sin(clock*2)*.08,mobile?2:7);penguin.rotation.set(.02,Math.sin(clock*.6)*.2-.18,Math.sin(clock*1.5)*.035);penguin.scale.setScalar(mobile?1.2:1.52);
  arms[0].rotation.z=-.48+Math.sin(clock*2.5)*.12;arms[1].rotation.z=.5+Math.sin(clock*2.5+1)*.12;
  camera.position.lerp(new THREE.Vector3(mobile?0:0,mobile?10:7.2,mobile?25:24),Math.min(1,dt*3));camera.lookAt(mobile?0:1, mobile?-2.4:1.2,-7);
 }else{
  penguin.scale.setScalar(1);penguin.position.set(run.x,run.y,PLAYER_Z);penguin.rotation.set(-.09-(run.boosting?.14:0),Math.PI+run.spin,-run.vx*.022);arms[0].rotation.z=-.38-(run.y>0?.9:0);arms[1].rotation.z=.38+(run.y>0?.9:0);
  const mobile=innerWidth<761;camera.position.lerp(new THREE.Vector3(run.x*.28,(mobile?10.5:7.8)+run.y*.2,(mobile?28:23)+(run.boosting?1.2:0)),Math.min(1,dt*4));camera.lookAt(run.x*.23,1.0,-20);
 }
 scarfTail.rotation.x=Math.sin(clock*12)*.15;scarfTail.rotation.y=Math.sin(clock*8)*.1;
 penguin.visible=run.invulnerable>0&&Math.floor(clock*12)%3===0?false:true;
 shadow.position.set(penguin.position.x,.025,penguin.position.z);shadow.material.opacity=.19/(1+run.y*.35);shadow.scale.set(1+run.y*.09,1+run.y*.09,1);
 shieldBubble.visible=run.shield>0;
 camera.fov=lerp(camera.fov,run.boosting&&phase==='playing'?55:48,dt*3);camera.updateProjectionMatrix();
 $('flash').style.opacity=Math.max(0,Number($('flash').style.opacity||0)-dt*1.4);
 updateAtmosphere(dt);
}
let hudClock=0;
function frame(time){requestAnimationFrame(frame);const dt=Math.min((time-lastTime)/1000,.1)||.016;lastTime=time;clock+=dt;let delta=0;
 if(phase==='countdown') {const prev=Math.ceil(countdown);countdown-=dt;const next=Math.ceil(countdown);if(next!==prev){$('countdown').textContent=next>0?next:'出发！';tone(next>0?550:880,.12);}if(countdown<=-.6){phase='playing';$('countdown').classList.add('hidden');toast('跟着金色鱼群走 · 空格跳跃',3.5);}}
 if(phase==='playing'){let remaining=dt;while(remaining>0&&phase==='playing'){const step=Math.min(remaining,1/60);delta+=updateGameplay(step);remaining-=step;}}
 else if(phase==='menu'){delta=2*dt;for(const e of entities){e.g.position.z+=delta;e.z=e.g.position.z;if(e.type==='fish')e.g.rotation.y=clock+e.seed;}entities=entities.filter(e=>{if(e.z>30){scene.remove(e.g);return false;}return true;});if(entities.reduce((m,e)=>Math.min(m,e.z),0)>-215)spawnRow(-240);}
 if(phase!=='paused'){updateScene(dt,delta);if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)$('toast').classList.add('hidden');}}
 hudClock+=dt;if(hudClock>.1){hudClock=0;if(phase!=='menu')updateHud();}
 renderer.render(scene,camera);
}
$('start').addEventListener('click',start);$('pause').addEventListener('click',pause);$('help').addEventListener('click',help);
$('sound').addEventListener('click',()=>{soundOn=!soundOn;$('sound').setAttribute('aria-label',soundOn?'关闭音效':'开启音效');$('sound').querySelector('span').classList.toggle('hidden',soundOn);tone(660,.16);});
$('quality').addEventListener('click',()=>{quality=!quality;renderer.setPixelRatio(quality?Math.min(devicePixelRatio,1.75):1);renderer.shadowMap.enabled=quality;$('quality').textContent='画质：'+(quality?'高':'流畅');});
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b);});}));
document.querySelectorAll('[data-color]').forEach(b=>{const selected=b.dataset.color===readStore('polar-drift-scarf','#fa634d');b.classList.toggle('active',selected);b.setAttribute('aria-pressed',selected);b.addEventListener('click',()=>{materials.scarf.color.set(b.dataset.color);writeStore('polar-drift-scarf',b.dataset.color);document.querySelectorAll('[data-color]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b);});});});
window.addEventListener('keydown',e=>{
 if(['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)&&$('modal').classList.contains('hidden'))e.preventDefault();
 if(e.code==='Escape'){e.preventDefault();if(phase==='playing'||phase==='countdown')pause();else if(!$('modal').classList.contains('hidden'))$('modal-actions').querySelector('button')?.click();return;}
 if(!$('modal').classList.contains('hidden'))return;
 if(phase==='menu'&&e.code==='Space'&&!e.repeat){start();return;}
 if(phase==='playing'){keys.add(e.code);if(e.code==='Space'&&!e.repeat)jumpBuffer=.14;}
});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>{keys.clear();input={left:false,right:false,boost:false};if(phase==='playing'||phase==='countdown')pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(phase==='playing'||phase==='countdown'))pause();});
document.querySelectorAll('[data-action]').forEach(button=>{
 const action=button.dataset.action;
 button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);if(phase!=='playing')return;if(action==='jump')jumpBuffer=.14;else input[action]=true;});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>{if(action!=='jump')input[action]=false;});
});
$('modal').addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=[...$('modal').querySelectorAll('button')];const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
resetRun();$('biome').textContent=palettes[0].name;$('loading').classList.add('hidden');requestAnimationFrame(frame);
// Read-only diagnostic snapshot for reproducible browser checks.
window.polarDrift={getState:()=>({phase,mode,...run,score:totalScore(),entityCount:entities.length,renderCalls:renderer.info.render.calls}),version:'1.0.0'};
