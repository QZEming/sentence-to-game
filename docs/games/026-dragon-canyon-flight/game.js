import * as THREE from './vendor/three.module.min.js';

const $ = (id) => document.getElementById(id);
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const TAU = Math.PI * 2;
let seed = 4127;
const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const range = (a,b) => a + random() * (b-a);
const center = (s) => Math.sin(s / 230) * 65 + Math.sin(s / 83) * 13;
const WORLD = 6500;
const settingsDefault = { sound: false, gentle: matchMedia('(prefers-reduced-motion: reduce)').matches, quality:'high', skin:'mint' };
let saved = { xp:0, best:{explore:0,race:0,trial:0}, crystals:0, settings:{...settingsDefault} };
try { const data = JSON.parse(localStorage.getItem('skybound-v1')); if(data && typeof data === 'object') { saved = {...saved,...data,best:{...saved.best,...data.best},settings:{...settingsDefault,...data.settings}}; if(!Number.isFinite(saved.xp)) saved.xp=0; } } catch {}
const settings = saved.settings;
const modeData = {
 explore:{name:'自由翱翔',kicker:'无时间限制',description:'从第一个光环开始探索',symbol:'∞',speed:32},
 race:{name:'穿环竞速',kicker:'90 秒计时挑战 · 穿环 +2 秒',description:'穿过光环，保持连击，刷新记录',symbol:'◎',speed:43},
 trial:{name:'烈焰试炼',kicker:'三段试炼 · 3 点飞行护盾',description:'每阶段穿过 4 环，击碎 2 个靶标',symbol:'♨',speed:37}
};
let selectedMode='explore', phase='camp', previousPhase='camp';
let game = {};
let elapsed=0, lastTime=performance.now(), hudTimer=0, toastTimeout, countdownTimeout;
let audioContext, audioReady=false, lastAudio=0;
let modalReturnFocus;
const keys = new Set();
const touch={x:0,y:0,boost:false,fire:false};
const scene = new THREE.Scene();
scene.background = new THREE.Color('#c2e6e8');
scene.fog = new THREE.Fog('#c2e6e8',230,820);
const camera = new THREE.PerspectiveCamera(57,innerWidth/innerHeight,.1,1800);
let renderer;
try {
 renderer = new THREE.WebGLRenderer({canvas:$('world'),antialias:true,alpha:false,powerPreference:'high-performance'});
} catch(error) {
 $('loading').innerHTML='<div class="render-error"><strong>这片天空需要 WebGL</strong><p>请使用支持 3D 加速的浏览器，并开启硬件加速。</p><button onclick="location.reload()">重新尝试</button></div>';
 throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio,settings.quality==='high'?1.7:1));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.08;
renderer.shadowMap.enabled=settings.quality==='high';
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
scene.add(new THREE.HemisphereLight('#fff9df','#567c72',1.9));
const sun=new THREE.DirectionalLight('#fff1cf',2.5);
sun.position.set(-100,210,100);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);
sun.shadow.camera.left=-170;sun.shadow.camera.right=170;sun.shadow.camera.top=170;sun.shadow.camera.bottom=-170;sun.shadow.camera.far=500;sun.shadow.bias=-.001;sun.shadow.normalBias=.5;
scene.add(sun);scene.add(sun.target);
const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.9,flatShading:true,...extra});
const materials={rock:mat('#c88569'),rockLight:mat('#e6a784'),rockDark:mat('#a96755'),strata:mat('#e2a783'),grass:mat('#769c68'),grassLight:mat('#acc289'),tree:mat('#507b64'),treeLight:mat('#6b9670'),wood:mat('#8d6550'),water:mat('#42babf',{roughness:.28,metalness:.1}),foam:mat('#abe9dc',{transparent:true,opacity:.6}),gold:mat('#f6d576',{metalness:.25,roughness:.3,emissive:'#a77721',emissiveIntensity:.32}),crystal:mat('#a2f5e6',{metalness:.25,roughness:.2,emissive:'#48c9bb',emissiveIntensity:.5}),target:mat('#d4865e'),cloud:mat('#f6f8e7',{transparent:true,opacity:.87})};
const sphereGeo=new THREE.IcosahedronGeometry(1,1);
const rockGeo=new THREE.CylinderGeometry(.79,1,1,7,1);
const chunks=[];
const rings=[], crystals=[], targets=[], thermals=[], obstacles=[];
const particles=[];
const effectGeometry=new THREE.IcosahedronGeometry(1,0);
const effectMats={gold:mat('#ffe3a1',{emissive:'#ffb644',emissiveIntensity:1}),fire:mat('#ffd16b',{emissive:'#ff751c',emissiveIntensity:1.5}),mint:mat('#afffe3',{emissive:'#45dcba',emissiveIntensity:.8}),rock:materials.rockLight};
function mesh(geometry,material,parent,position,scale){const m=new THREE.Mesh(geometry,material);if(position)m.position.set(...position);if(scale)m.scale.set(...scale);parent.add(m);return m;}
function cone(parent,pos,r,h,color){return mesh(new THREE.ConeGeometry(r,h,5),color,parent,pos);}
function rock(parent,x,y,z,r,h,i){const g=new THREE.Group();g.position.set(x,y+h/2,z);g.rotation.y=i;parent.add(g);const body=mesh(rockGeo,materials.rock,g,[0,0,0],[r,h,r*range(.85,1.2)]);body.receiveShadow=true;body.castShadow=true;mesh(rockGeo,materials.strata,g,[0,h*.09,0],[r*1.009,h*.055,r*1.009]);mesh(rockGeo,materials.rockLight,g,[0,h*.26,0],[r*.913,h*.14,r*.913]);mesh(rockGeo,materials.grass,g,[0,h*.5,0],[r*.795,2.7,r*.795]);return g;}
function pine(parent,x,y,z,size=1){mesh(new THREE.CylinderGeometry(.6,1.1,6,5),materials.wood,parent,[x,y+3,z],[size,size,size]);for(let j=0;j<3;j++)cone(parent,[x,y+(5+j*3)*size,z],(4.3-j*.9)*size,8*size,j%2?materials.treeLight:materials.tree);}
function ribbon(width,y,material,parent){const vertices=[],indices=[];const seg=650;for(let i=0;i<=seg;i++){let s=i*WORLD/seg;for(let side of [-1,1])vertices.push(center(s)+side*width/2,y+Math.sin(s*.031)*.15,-s);}for(let i=0;i<seg;i++){let a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();const m=mesh(g,material,parent);m.receiveShadow=true;return m;}
mesh(new THREE.PlaneGeometry(5000,14000),mat('#bd946b'),scene,[0,-4,-3000]).rotation.x=-Math.PI/2;
ribbon(108,-1,materials.grass,scene);
ribbon(65,.15,mat('#9ac89d'),scene);
ribbon(46,1.1,materials.water,scene);
ribbon(2,1.14,materials.foam,scene).position.x=18;
ribbon(.8,1.17,materials.foam,scene).position.x=-13;
const cloudGroup=new THREE.Group();scene.add(cloudGroup);
for(let k=0;k<34;k++){const s=range(-200,6500),x=center(s)+range(-350,350),y=range(160,230);const group=new THREE.Group();group.position.set(x,y,-s);for(let j=0;j<4;j++)mesh(sphereGeo,materials.cloud,group,[j*10,range(-2,3),range(-3,3)],[range(13,22),range(5,9),range(8,15)]);cloudGroup.add(group);}
for(let k=0;k<65;k++){
 const chunk=new THREE.Group();chunk.userData.s=k*100;scene.add(chunk);chunks.push(chunk);
 for(let side of [-1,1]){
  const s=k*100+range(-10,10),h=range(45,114),r=range(25,45),x=center(s)+side*range(86,118);
  const g=rock(chunk,x,-3,-s,r,h,range(0,3));
  for(let j=0;j<3;j++) if(random()>.18)pine(chunk,x+range(-r*.35,r*.35),h-1,-s+range(-r*.35,r*.35),range(.7,1.35));
  if(k%2===0)rock(chunk,center(s+30)+side*range(145,215),-2,-s-36,range(45,75),h+range(15,90),range(0,3));
  if(k%3===0){const xx=center(s)+side*range(28,38);mesh(sphereGeo,materials.rockLight,chunk,[xx,3,-s-40],[range(6,10),range(5,9),range(8,14)]);}
 }
 if(k%4===2){const s=k*100+30,x=center(s)+(k%8===2?36:-36);const h=range(22,34);const m=rock(chunk,x,0,-s,9,h,1);obstacles.push({s,x,y:h/2,h,r:12,mesh:m});}
 if(k%8===5){const s=k*100+40;const g=new THREE.Group();g.position.set(center(s)+20,25,-s);const rockFloat=mesh(sphereGeo,materials.rockLight,g,[0,5,0],[12,8,9]);rockFloat.rotation.z=.3;mesh(rockGeo,materials.grass,g,[0,11,0],[10,2,8]);pine(g,0,12,0,.8);chunk.add(g);}
}
// The landmark waterfalls and a stone arch make each part of the canyon distinct.
for(const s of [1060,3420,5700]){
 const group=new THREE.Group();group.position.set(center(s)-85,0,-s);scene.add(group);const water=mesh(new THREE.PlaneGeometry(13,90),materials.foam,group,[2,44,3]);water.rotation.y=.35;
 for(let j=0;j<8;j++)mesh(sphereGeo,materials.foam,group,[range(-5,8),3,range(1,10)],[range(4,8),range(2,4),range(4,8)]);
 mesh(rockGeo,materials.rockDark,group,[-7,40,-5],[21,80,17]);water.position.z=14;
}
for(const s of [2240,4480]){
 const group=new THREE.Group();group.position.set(center(s),0,-s);scene.add(group);
 for(let side of [-1,1])rock(group,side*63,0,0,19,90,.4);
 const arch=mesh(new THREE.TorusGeometry(64,12,5,12,Math.PI),materials.rockLight,group,[0,67,0]);arch.castShadow=true;
}
const ringGeo=new THREE.TorusGeometry(11.5,.55,6,48);
const gemGeo=new THREE.OctahedronGeometry(1.7,0);
for(let i=0;i<65;i++){
 const s=105+i*94;
 const offset=i<3?0:Math.sin(i*1.72)*25;
 const y=i<3?48:49+Math.sin(i*.87)*18;
 const group=new THREE.Group();group.position.set(center(s)+offset,y,-s);scene.add(group);
 mesh(ringGeo,materials.gold,group);
 for(let j=0;j<4;j++){const a=j*Math.PI/2;const m=mesh(new THREE.OctahedronGeometry(.95,0),materials.gold,group,[Math.sin(a)*11.5,Math.cos(a)*11.5,0]);m.rotation.z=-a;}
 rings.push({s,offset,y,mesh:group,hit:false,passed:false});
 for(let j=0;j<3;j++){
  const ds=s-30+j*14,xx=lerp(center(ds),group.position.x,.75);
  const m=mesh(gemGeo,materials.crystal,scene,[xx,y+Math.sin(j)*1.5,-ds]);
  crystals.push({s:ds,mesh:m,collected:false,baseY:m.position.y});
 }
 if(i%2===1){const ds=s+44;const g=new THREE.Group();g.position.set(center(ds)+Math.sin(i*.7)*18,y,-ds);scene.add(g);const m=mesh(new THREE.CylinderGeometry(4.5,4.5,1.7,12),materials.target,g);m.rotation.x=Math.PI/2;const rim=mesh(new THREE.TorusGeometry(3.1,.33,5,24),materials.gold,g,[0,0,1]);mesh(new THREE.SphereGeometry(1.1,10,8),materials.gold,g,[0,0,1.2]);targets.push({s:ds,mesh:g,hit:false,baseY:y});}
 if(i%5===3){const ds=s+24;const g=new THREE.Group();g.position.set(center(ds)-15,26,-ds);scene.add(g);const windMat=new THREE.MeshBasicMaterial({color:'#b7ffe0',transparent:true,opacity:.14,side:THREE.DoubleSide,depthWrite:false});mesh(new THREE.CylinderGeometry(10,7,50,14,1,true),windMat,g);const sprites=[];for(let j=0;j<13;j++){const m=mesh(new THREE.TorusGeometry(7+j*.17,.12,3,24,Math.PI*1.15),effectMats.mint,g,[0,-22+j*3.5,0]);m.rotation.x=Math.PI/2;sprites.push(m);}thermals.push({s:ds,mesh:g,sprites,used:false});}
}
// A hand-built dragon with articulated wings, eyes, horns, belly, feet and a tapered tail.
const dragon=new THREE.Group();scene.add(dragon);
const dragonBody=new THREE.Group();dragon.add(dragonBody);
const skinMats={mint:mat('#57a991'),belly:mat('#f1d99d'),wing:mat('#83c2a1',{side:THREE.DoubleSide}),horn:mat('#f7e7b5'),eye:mat('#f9f9de'),pupil:mat('#243e32')};
const body=mesh(sphereGeo,skinMats.mint,dragonBody,[0,0,0],[2.5,2.5,5.5]);body.castShadow=true;
mesh(sphereGeo,skinMats.belly,dragonBody,[0,-1.25,-.7],[1.8,1.7,3.9]);
const neck=mesh(sphereGeo,skinMats.mint,dragonBody,[0,1.4,-4.2],[1.95,2.5,2.6]);neck.rotation.x=-.3;
mesh(sphereGeo,skinMats.mint,dragonBody,[0,2.9,-6.1],[2.7,2.2,2.6]);
mesh(sphereGeo,skinMats.mint,dragonBody,[0,2.25,-8.1],[2.2,1.3,1.7]);
mesh(sphereGeo,skinMats.belly,dragonBody,[0,1.65,-8],[1.8,.45,1.4]);
for(let side of [-1,1]){
 mesh(sphereGeo,skinMats.eye,dragonBody,[side*2.08,3.35,-7],[.69,.88,.93]);
 mesh(sphereGeo,skinMats.pupil,dragonBody,[side*2.46,3.35,-7.25],[.23,.47,.42]);
 mesh(sphereGeo,skinMats.eye,dragonBody,[side*2.56,3.57,-7.36],[.1,.15,.17]);
 const horn=cone(dragonBody,[side*1.85,5.2,-5.5],.7,3,skinMats.horn);horn.rotation.x=.4;horn.rotation.z=side*-.22;
 mesh(sphereGeo,skinMats.pupil,dragonBody,[side*1,2.77,-9.43],[.15,.12,.12]);
 const ear=cone(dragonBody,[side*2.8,3.2,-4.9],1.1,2.7,skinMats.mint);ear.rotation.z=side*-.9;
 for(let z of [-2,2.5]){const leg=mesh(sphereGeo,skinMats.mint,dragonBody,[side*1.9,-1.65,z],[.9,1.3,1.2]);leg.rotation.z=side*.4;mesh(sphereGeo,skinMats.belly,dragonBody,[side*2,-2.4,z-.4],[.67,.5,1.1]);}
}
const tail=new THREE.Group();tail.position.z=3.8;dragonBody.add(tail);
for(let j=0;j<6;j++){let m=mesh(sphereGeo,skinMats.mint,tail,[Math.sin(j*.55)*.5,.1-j*.19,j*1.55],[1.6-j*.21,1.5-j*.2,1.8]);if(j<5)cone(tail,[Math.sin(j*.55)*.5,1.35-j*.18,j*1.55],.6-j*.075,1.3,skinMats.belly);}
for(let j=0;j<4;j++)cone(dragonBody,[0,2.25,-2+j*1.8],.6,1.4,skinMats.belly);
function makeWing(side){const joint=new THREE.Group();joint.position.set(side*1.8,1.1,-1.2);dragonBody.add(joint);const positions=[0,0,0,side*5.4,1.5,-3.9,side*13,0,-1.7,side*10,-.6,2.5,side*6.8,-.7,1.7,side*6.4,-.7,5.8,side*3,-.4,3.4,0,0,2.2];const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geom.setIndex([0,1,2,0,2,3,0,3,4,0,4,5,0,5,6,0,6,7]);geom.computeVertexNormals();mesh(geom,skinMats.wing,joint).castShadow=true;function bone(a,b,r){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start);const m=mesh(new THREE.CylinderGeometry(r*.6,r,delta.length(),5),skinMats.mint,joint);m.position.copy(start.add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());}bone([0,0,0],[side*5.4,1.5,-3.9],.38);bone([side*5.4,1.5,-3.9],[side*13,0,-1.7],.25);bone([side*5.4,1.5,-3.9],[side*6.4,-.7,5.8],.16);return joint;}
const wings=[makeWing(-1),makeWing(1)];
const dragonShadow=mesh(new THREE.CircleGeometry(8,24),new THREE.MeshBasicMaterial({color:'#2c8275',transparent:true,opacity:.15,depthWrite:false}),scene,[0,1.4,0]);dragonShadow.rotation.x=-Math.PI/2;
const speedLines=new THREE.Group();camera.add(speedLines);scene.add(camera);
for(let i=0;i<24;i++){const line=mesh(new THREE.CylinderGeometry(.025,.025,range(2,6),3),new THREE.MeshBasicMaterial({color:'#efffe7',transparent:true,opacity:.4}),speedLines,[range(-15,15),range(-9,9),range(-40,-15)]);line.rotation.x=Math.PI/2;}speedLines.visible=false;
const camTarget=new THREE.Vector3(), desiredCam=new THREE.Vector3(), desiredLook=new THREE.Vector3();
let viewS=0;
function makeGame(){return {s:0,lateral:0,y:48,vx:0,vy:0,speed:0,score:0,combo:0,maxCombo:0,rings:0,missed:0,gems:0,targets:0,health:3,energy:100,time:90,duration:0,boostTime:0,invincible:0,fireCooldown:0,stage:0,lap:0,region:-1,thermal:false,damageTime:0,levelXP:0,lastAward:0,countdown:3,boosting:false};}
game=makeGame();
function save(){try{localStorage.setItem('skybound-v1',JSON.stringify(saved));}catch{$('savedIndicator').textContent='本次会话记录';}updateProfile();}
function updateProfile(){const level=Math.floor(saved.xp/500)+1;const ranks=['初生羽翼','迎风学徒','峡谷旅者','逐风骑士','天空守护者'];$('levelText').textContent=`Lv. ${level} · ${ranks[Math.min(4,level-1)]}`;$('xpLabel').textContent=`${saved.xp} XP`;$('xpBar').style.width=`${saved.xp%500/5}%`;$('bestValue').textContent=saved.best[selectedMode]||0;}
function applySkin(){const palette={mint:['#57a991','#83c2a1'],coral:['#d7866e','#e5b68f'],sky:['#609fc4','#9fced4']};const colors=palette[settings.skin]||palette.mint;skinMats.mint.color.set(colors[0]);skinMats.wing.color.set(colors[1]);}
function setMode(mode){selectedMode=mode;document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===mode);b.setAttribute('aria-pressed',b.dataset.mode===mode?'true':'false')});$('modeKicker').textContent=modeData[mode].kicker;$('modeDescription').textContent=modeData[mode].description;$('previewSymbol').textContent=modeData[mode].symbol;updateProfile();}
function toast(message,duration=2700){clearTimeout(toastTimeout);$('toast').textContent=message;$('toast').classList.add('visible');toastTimeout=setTimeout(()=>$('toast').classList.remove('visible'),duration);}
function popScore(text){$('floatingScore').textContent=text;$('floatingScore').classList.remove('pop');void $('floatingScore').offsetWidth;$('floatingScore').classList.add('pop');}
function initAudio(){if(!settings.sound)return;try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();audioReady=true;}catch{}}
function tone(freq=440,length=.12,type='sine',volume=.06,delay=0){if(!settings.sound||!audioReady)return;const t=audioContext.currentTime+delay;const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,t);gain.gain.setValueAtTime(volume,t);gain.gain.exponentialRampToValueAtTime(.001,t+length);osc.connect(gain);gain.connect(audioContext.destination);osc.start(t);osc.stop(t+length+.01);}
function sound(kind){if(kind==='ring'){tone(660,.13);tone(880,.17,'sine',.055,.08);tone(1100,.2,'sine',.04,.15);}else if(kind==='gem'){if(elapsed-lastAudio>.1){tone(1300,.08,'sine',.028);lastAudio=elapsed;}}else if(kind==='hit')tone(110,.3,'triangle',.1);else if(kind==='fire'){tone(100,.15,'sawtooth',.025);tone(70,.25,'triangle',.035);}else if(kind==='win'){[523,659,784,1047].forEach((n,i)=>tone(n,.28,'sine',.07,i*.13));}}
function burst(pos,type='gold',count=18){for(let i=0;i<count;i++){if(particles.length>180)break;const m=mesh(effectGeometry,effectMats[type],scene);m.position.copy(pos);m.scale.setScalar(range(.18,.65));particles.push({mesh:m,velocity:new THREE.Vector3(range(-9,9),range(-5,12),range(-9,9)),life:range(.5,1),max:1});}}
function flame(){if(game.fireCooldown>0||game.energy<8)return;game.fireCooldown=.42;game.energy-=8;sound('fire');const origin=dragon.position.clone().add(new THREE.Vector3(0,2,-9));for(let j=0;j<9;j++){const p=origin.clone().add(new THREE.Vector3(range(-1,1),range(-1,1),-j*2));const m=mesh(effectGeometry,effectMats.fire,scene);m.position.copy(p);m.scale.setScalar(range(.6,1.6));particles.push({mesh:m,velocity:new THREE.Vector3(range(-4,4),range(-2,3),-100),life:.55,max:.55});}for(const target of targets){const ds=target.s-game.s;if(!target.hit&&ds>0&&ds<100&&Math.hypot(target.mesh.position.x-dragon.position.x,target.mesh.position.y-dragon.position.y)<9+ds*.13){target.hit=true;target.mesh.visible=false;game.targets++;addScore(250,'靶标击破 +250');burst(target.mesh.position,'fire',25);tone(220,.18,'triangle');break;}}}
function addScore(points,label){game.score+=points;if(label)popScore(label);}
function resetObjects(){for(const r of rings){r.hit=false;r.passed=false;r.mesh.visible=true;r.mesh.scale.setScalar(1);}for(const c of crystals){c.collected=false;c.mesh.visible=true;}for(const t of targets){t.hit=false;t.mesh.visible=true;}for(const t of thermals)t.used=false;for(const p of particles)scene.remove(p.mesh);particles.length=0;}
function startGame(){if(['playing','paused','countdown'].includes(phase))bankRun();hideModal(false);clearTimeout(countdownTimeout);clearTimeout(toastTimeout);keys.clear();touch.boost=touch.fire=false;touch.x=touch.y=0;game=makeGame();resetObjects();phase='countdown';snapCamera();$('campPanel').classList.add('hidden');$('flightHud').classList.remove('hidden');$('touchControls').classList.remove('hidden');$('sceneLabel').classList.add('hidden');document.body.classList.add('playing');$('pauseBtn').textContent='Ⅱ';initAudio();updateHud();toast('准备好了吗？  3',1000);countdownTick(3);}
function countdownTick(n){game.countdown=n;if(n===0){phase='playing';toast(innerWidth<850?'出发！拖动左侧摇杆 · 对准金色光环':'出发！WASD 升降转向 · 对准金色光环',3200);tone(880,.2);return;}tone(440,.1);toast(`展开双翼  ${n}`,1050);countdownTimeout=setTimeout(()=>{if(phase==='countdown')countdownTick(n-1)},1000);}
function returnCamp(){if(phase!=='camp'&&phase!=='result')bankRun();clearTimeout(countdownTimeout);clearTimeout(toastTimeout);phase='camp';keys.clear();touch.boost=touch.fire=false;touch.x=touch.y=0;hideModal(false);document.body.classList.remove('playing');$('campPanel').classList.remove('hidden');$('flightHud').classList.add('hidden');$('touchControls').classList.add('hidden');$('targetMarker').classList.add('hidden');$('sceneLabel').classList.remove('hidden');$('toast').classList.remove('visible');$('pauseBtn').textContent='Ⅱ';resetObjects();game=makeGame();snapCamera();updateProfile();}
function bankRun(){const xp=Math.floor(game.score/20);const delta=Math.max(0,xp-game.lastAward);saved.xp+=delta;game.lastAward=Math.max(game.lastAward,xp);saved.best[selectedMode]=Math.max(saved.best[selectedMode]||0,game.score);saved.crystals+=game.gems-game.levelXP;game.levelXP=game.gems;save();}
function finish(reason='挑战完成'){if(phase==='result')return;phase='result';bankRun();keys.clear();touch.boost=touch.fire=false;const grade=game.score>=6500?'S':game.score>=3800?'A':game.score>=1800?'B':'C';sound('win');openModal(`<div class="eyebrow">FLIGHT REPORT</div><div class="medal">${grade==='S'?'🏆':grade==='A'?'🥇':grade==='B'?'🥈':'✦'}</div><h2 id="modalTitle">${reason}</h2><p>${grade} 级飞行评价 · ${game.health===0?'休息一下，天空永远等着你。':'又离成为巨龙近了一点。'}</p><div class="result-grid"><div><strong>${game.score.toLocaleString()}</strong><span>本次得分</span></div><div><strong>${game.rings}</strong><span>穿越光环</span></div><div><strong>${game.maxCombo}</strong><span>最高连击</span></div><div><strong>+${game.lastAward}</strong><span>成长经验</span></div></div><p>收集 ${game.gems} 枚晶石 · 击碎 ${game.targets} 个靶标 · 飞行 ${Math.floor(game.s+game.lap*6200)} m<br>个人最佳 ${saved.best[selectedMode].toLocaleString()} 分</p><button class="start-button" id="againBtn">再飞一次</button><button class="secondary-button" id="campBtn">返回营地</button>`,false);$('againBtn').onclick=startGame;$('campBtn').onclick=returnCamp;}
function damage(message){if(game.invincible>0)return;game.health--;game.invincible=2.5;game.damageTime=.6;game.combo=0;game.score=Math.max(0,game.score-100);game.lateral=clamp(game.lateral,-49,49);game.y=Math.max(game.y,19);burst(dragon.position,'rock',12);sound('hit');toast(`${message} · 护盾 -1`,1800);if(game.health<=0){if(selectedMode==='explore'){game.health=3;game.invincible=4;toast('阿岚重新振作！自由模式可以一直练习。',3000);}else finish('本次飞行结束');}}
function updateObjectives(){if(selectedMode==='explore'){const stages=[{goal:3,value:game.rings,title:'穿过 3 个金色光环',hint:'用 A / D 转向，W / S 升降'},{goal:8,value:game.gems,title:'收集 8 枚风之晶石',hint:'晶石能补充能量，每枚 +25 分'},{goal:3,value:game.boostTime,title:'累计冲刺 3 秒',hint:'长按 Shift；松开后恢复能量'},{goal:3,value:game.targets,title:'用龙焰击碎 3 个靶标',hint:'对准木质圆靶，按空格喷火'}];if(game.stage<4){const step=stages[game.stage];$('objective').textContent=step.title;$('objectiveDetail').textContent=`训练 ${game.stage+1} / 4 · ${Math.min(step.goal,Math.floor(step.value))} / ${step.goal}`;$('objectiveBar').style.width=`${Math.min(100,step.value/step.goal*100)}%`;if(step.value>=step.goal){game.stage++;addScore(300);bankRun();toast(game.stage===4?'飞行毕业！+300 分 · 继续探索整片峡谷':'训练完成 +300 · '+stages[game.stage].hint,3600);sound('win');}}else{$('objective').textContent='自由探索 · 天空属于你';$('objectiveDetail').textContent='寻找上升气流，收集晶石，挑战连击';$('objectiveBar').style.width='100%';}}else if(selectedMode==='race'){$('objective').textContent=`已穿越 ${game.rings} 个光环`;$('objectiveDetail').textContent=`每环 +2 秒 · 最高 ${game.maxCombo} 连击`;$('objectiveBar').style.width=`${Math.min(100,game.time/90*100)}%`;}else{const wave=Math.min(3,game.stage+1),rGoal=wave*4,tGoal=wave*2;$('objective').textContent=`第 ${wave} 阶段 · 穿环与龙焰`;$('objectiveDetail').textContent=`光环 ${Math.min(game.rings,rGoal)} / ${rGoal} · 靶标 ${Math.min(game.targets,tGoal)} / ${tGoal}`;$('objectiveBar').style.width=`${(Math.min(1,game.rings/rGoal)+Math.min(1,game.targets/tGoal))*50}%`;if(game.rings>=rGoal&&game.targets>=tGoal){game.stage++;addScore(600);game.health=Math.min(3,game.health+1);game.energy=100;toast('试炼通过 +600 · 护盾恢复，能量充满！',2800);sound('win');if(game.stage>=3)finish('烈焰试炼 · 全部通过');}}}
function updateHud(){const v=phase==='playing'?game.speed:0;$('score').textContent=String(game.score).padStart(5,'0');$('combo').textContent=game.combo>1?`${game.combo} 连击 · ×${Math.min(5,1+Math.floor(game.combo/3))} 倍率`:'每一次穿越，都是进步';$('hearts').textContent='♥ '.repeat(game.health)+'♡ '.repeat(3-game.health);$('speed').innerHTML=`${Math.round(v*3.6)}<span>↗</span>`;$('altitude').textContent=Math.round(phase==='camp'?48:game.y);$('energyLabel').textContent=`${Math.round(game.energy)}%`;$('energyBar').style.width=`${game.energy}%`;$('energyBar').style.background=game.energy<22?'#d79958':'#64a987';$('energyHint').textContent=game.thermal?'上升气流 · 快速恢复':game.boosting?'冲刺中 · 消耗能量':game.energy<8?'能量恢复中…':(innerWidth<850?'长按 ϟ 振翅冲刺':'长按 SHIFT 冲刺');$('timer').textContent=selectedMode==='race'?`${Math.ceil(game.time)} 秒`:selectedMode==='trial'?`阶段 ${Math.min(3,game.stage+1)} / 3`:'自由探索';$('objectiveLabel').textContent=modeData[selectedMode].name;if(phase==='playing')updateObjectives();drawMap();}
function updateGame(dt){game.duration+=dt;const oldS=game.s,oldX=center(game.s)+game.lateral,oldY=game.y;const inputX=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+touch.x;const inputY=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-touch.y;const boostPressed=keys.has('ShiftLeft')||keys.has('ShiftRight')||touch.boost;game.boosting=boostPressed&&game.energy>1;game.speed=lerp(game.speed,modeData[selectedMode].speed*(game.boosting?1.7:1)*(game.damageTime>0?.55:1),1-Math.exp(-dt*2.6));game.vx=lerp(game.vx,clamp(inputX,-1,1)*29,1-Math.exp(-dt*6));game.vy=lerp(game.vy,clamp(inputY,-1,1)*25,1-Math.exp(-dt*6));game.lateral+=game.vx*dt;game.y+=game.vy*dt;game.y=clamp(game.y,8,130);game.s+=game.speed*dt;if(game.boosting){game.energy=Math.max(0,game.energy-21*dt);game.boostTime+=dt;}else game.energy=Math.min(100,game.energy+9*dt);game.invincible=Math.max(0,game.invincible-dt);game.damageTime=Math.max(0,game.damageTime-dt);game.fireCooldown=Math.max(0,game.fireCooldown-dt);if((keys.has('Space')||touch.fire)&&game.energy>=8)flame();const x=center(game.s)+game.lateral;if(Math.abs(game.lateral)>59||game.y<11){damage(game.y<11?'掠过河面了':'小心两侧的岩壁');if(phase==='result')return;game.lateral=clamp(game.lateral,-56,56);game.y=Math.max(game.y,12);}for(const o of obstacles){if(Math.abs(o.s-game.s)<o.r&&Math.abs(o.x-x)<o.r&&game.y<o.h+4){damage('小心前方的岩柱');if(phase==='result')return;game.lateral+=x>o.x?6:-6;}}
 for(const r of rings){if(!r.passed&&r.s<=game.s){r.passed=true;const crossing=clamp((r.s-oldS)/Math.max(.001,game.s-oldS),0,1);const dist=Math.hypot(lerp(oldX,x,crossing)-r.mesh.position.x,lerp(oldY,game.y,crossing)-r.y);if(dist<10.7){r.hit=true;r.mesh.visible=false;game.rings++;game.combo++;game.maxCombo=Math.max(game.maxCombo,game.combo);const perfect=dist<4;const points=100*Math.min(5,1+Math.floor(game.combo/3))+(perfect?50:0);addScore(points,`${perfect?'完美穿环':'穿环'} +${points}`);if(selectedMode==='race')game.time=Math.min(120,game.time+2);burst(r.mesh.position,'gold',24);sound('ring');}else{game.missed++;if(game.combo>2)toast('连击中断，下个光环重新开始',1300);game.combo=0;}}}
 for(const c of crystals){if(!c.collected&&Math.abs(c.s-game.s)<5&&Math.hypot(c.mesh.position.x-x,c.baseY-game.y)<6.3){c.collected=true;c.mesh.visible=false;game.gems++;game.energy=Math.min(100,game.energy+7);game.score+=25;burst(c.mesh.position,'mint',6);sound('gem');}}
 game.thermal=false;for(const t of thermals){if(Math.abs(game.s-t.s)<14&&Math.abs(x-t.mesh.position.x)<12&&game.y<62){game.thermal=true;game.energy=Math.min(100,game.energy+35*dt);game.y+=9*dt;if(!t.used){t.used=true;addScore(100);toast('乘上暖流 · 能量恢复 +100',1600);}}}
 if(selectedMode==='race'){game.time-=dt;if(game.time<=0){game.time=0;finish('竞速挑战完成');return;}}
 const region=Math.floor(game.s/2100)%3;if(region!==game.region){game.region=region;const names=['赤岩河谷','云门石桥','暮光高地'];document.querySelector('.bottom-left strong').textContent=names[region];$('landmark').textContent=`0${region+1} / 03 · ${names[region]}`;if(game.s>100){addScore(200);toast(`发现新区域：${names[region]} · +200`,3000);}}
 if(game.s>6200){game.s-=6200;game.lap++;resetObjects();snapCamera();toast('重返赤岩河谷 · 新一轮冒险开始',2500);}
 if(Math.floor(game.duration/15)>Math.floor((game.duration-dt)/15))bankRun();
}
function snapCamera(){const atCamp=phase==='camp';const s=atCamp?20:game.s;const x=center(s)+(atCamp?7:game.lateral),y=atCamp?48:game.y;camera.position.set(x+(atCamp?(innerWidth<850?0:44):0),y+(atCamp?23:16),-s+(atCamp?(innerWidth<850?86:67):(innerWidth<850?68:46)));camTarget.set(x-(atCamp&&innerWidth>=850?14:0),y+(atCamp?(innerWidth<850?-26:-5):1),-s-(atCamp?70:55));camera.lookAt(camTarget);}
function updateWorld(dt){const playing=['playing','paused','countdown','result'].includes(phase);const s=playing?game.s:20;viewS=s;const mobile=innerWidth<850;const x=center(s)+(playing?game.lateral:7);const y=playing?game.y:48;dragon.position.set(x,y+Math.sin(elapsed*2.1)*.28,-s);const wingFreq=game.boosting?12:5.6;wings[0].rotation.z=Math.sin(elapsed*wingFreq)*.29+.05;wings[1].rotation.z=-Math.sin(elapsed*wingFreq)*.29-.05;tail.rotation.y=Math.sin(elapsed*3)*.13;dragonBody.rotation.z=lerp(dragonBody.rotation.z,-game.vx*.018,dt*6);dragonBody.rotation.x=lerp(dragonBody.rotation.x,-game.vy*.01+(game.boosting?-.08:0),dt*4);dragonBody.rotation.y=lerp(dragonBody.rotation.y,-game.vx*.014,dt*3);dragonBody.visible=game.invincible<=0||Math.floor(elapsed*9)%2===0;dragonShadow.position.set(x,1.4,-s);dragonShadow.scale.setScalar(1+game.y/95);
 if(playing){desiredCam.set(x+game.vx*.13,y+16,s*-1+(mobile?68:46));desiredLook.set(x+game.vx*.28,y+1,-s-55);}else{desiredCam.set(x+(mobile?0:44),y+23,-s+(mobile?86:67));desiredLook.set(x-(mobile?0:14),y-(mobile?26:5),-s-70);}
 const smooth=settings.gentle?2.8:4;camera.position.lerp(desiredCam,1-Math.exp(-dt*smooth));camTarget.lerp(desiredLook,1-Math.exp(-dt*4));camera.lookAt(camTarget);const fov=game.boosting&&!settings.gentle?65:57;camera.fov=lerp(camera.fov,fov,dt*3);camera.updateProjectionMatrix();sun.position.set(x-100,y+175,-s+65);sun.target.position.set(x,10,-s-50);
 for(const c of chunks)c.visible=c.userData.s>s-180&&c.userData.s<s+960;
 for(const r of rings){r.mesh.visible=!r.hit&&r.s>s-35&&r.s<s+730;r.mesh.rotation.z=Math.sin(elapsed*.8+r.s)*.05;}
 for(const c of crystals){c.mesh.visible=!c.collected&&c.s>s-15&&c.s<s+600;if(c.mesh.visible){c.mesh.rotation.y=elapsed*1.5;c.mesh.position.y=c.baseY+Math.sin(elapsed*2+c.s)*.4;}}
 for(const t of targets){t.mesh.visible=!t.hit&&t.s>s-20&&t.s<s+600;t.mesh.rotation.z=Math.sin(elapsed*1.5+t.s)*.12;}
 for(const t of thermals){t.mesh.visible=t.s>s-50&&t.s<s+650;if(t.mesh.visible)t.sprites.forEach((m,i)=>m.rotation.z=elapsed*1.3+i*.38);}
 speedLines.visible=game.boosting&&!settings.gentle&&phase==='playing';if(speedLines.visible)speedLines.children.forEach((l,i)=>{l.position.z+=dt*55;if(l.position.z>-5)l.position.z=-45;});
 const next=rings.find(r=>!r.passed&&r.s>s);if(next&&phase==='playing'){const p=next.mesh.position.clone().project(camera);const sx=(p.x*.5+.5)*innerWidth,sy=(-p.y*.5+.5)*innerHeight;const marker=$('targetMarker');marker.classList.remove('hidden');marker.style.left=`${clamp(sx,32,innerWidth-32)}px`;marker.style.top=`${clamp(sy-35,innerWidth<850?235:210,innerHeight-140)}px`;$('targetDistance').textContent=`${Math.round(next.s-s)} m`;marker.style.opacity=next.s-s<145?'.8':'.5';}else $('targetMarker').classList.add('hidden');
}
function updateParticles(dt){for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.mesh.position.addScaledVector(p.velocity,dt);p.velocity.y-=3*dt;p.mesh.scale.multiplyScalar(Math.max(0,1-dt*.9));if(p.life<=0){scene.remove(p.mesh);particles.splice(i,1);}}}
function drawMap(){const ctx=$('map').getContext('2d'),w=160,h=108;ctx.clearRect(0,0,w,h);ctx.lineWidth=26;ctx.strokeStyle='#d0dec3';ctx.beginPath();for(let j=0;j<=h;j++){let s=viewS+(h-j)*5;const x=80+(center(s)-center(viewS))*.4;j?ctx.lineTo(x,j):ctx.moveTo(x,j);}ctx.stroke();ctx.lineWidth=9;ctx.strokeStyle='#b8d9c8';ctx.stroke();ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.strokeStyle='#78a28b';ctx.stroke();ctx.setLineDash([]);for(const r of rings){const yy=h-(r.s-viewS)/5;if(yy>0&&yy<h&&!r.passed){ctx.strokeStyle='#b69e60';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(80+(r.mesh.position.x-center(viewS))*.4,yy,3,0,TAU);ctx.stroke();}}ctx.fillStyle='#367f65';ctx.beginPath();const px=80+game.lateral*.4;ctx.moveTo(px,h-23);ctx.lineTo(px-4,h-13);ctx.lineTo(px+4,h-13);ctx.closePath();ctx.fill();}
function openModal(content,shouldPause=true){modalReturnFocus=document.activeElement;if(shouldPause&&['playing','countdown'].includes(phase)){previousPhase=phase;phase='paused';clearTimeout(countdownTimeout);}keys.clear();touch.x=touch.y=0;touch.boost=touch.fire=false;$('joystickKnob').style.transform='';$('modalContent').innerHTML=content;$('modalBackdrop').classList.remove('hidden');$('closeModal').focus();}
function hideModal(resume=true){$('modalBackdrop').classList.add('hidden');if(resume&&phase==='paused'){phase=previousPhase;if(phase==='countdown')countdownTick(game.countdown);$('pauseBtn').textContent='Ⅱ';}modalReturnFocus?.focus?.();}
function pause(){if(phase==='paused'){hideModal();return;}if(!['playing','countdown'].includes(phase))return;openModal('<div class="eyebrow">TAKE A BREATH</div><h2 id="modalTitle">在风中休息一下</h2><p>这片天空会等你。<br>按 P 或 Esc 继续飞行。</p><button class="start-button" id="resumeBtn">继续飞行</button><button class="secondary-button" id="restartBtn">重新开始</button><button class="secondary-button" id="campBtn">返回营地</button>');$('resumeBtn').onclick=()=>hideModal();$('restartBtn').onclick=startGame;$('campBtn').onclick=returnCamp;$('pauseBtn').textContent='▷';}
function showGuide(){openModal('<div class="eyebrow">THE LITTLE DRAGON’S HANDBOOK</div><h2 id="modalTitle">给第一次飞行的你</h2><p>阿岚会自动向前飞。看准光环，让翅膀带你过去。</p><div class="guide-grid"><div class="guide-item"><strong>方向与高度</strong><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><br><span>W 上升，S 下降<br>A / D 左右移动，方向键也可以</span></div><div class="guide-item"><strong>振翅冲刺</strong><kbd>SHIFT</kbd><br><span>长按提速，消耗能量<br>松开冲刺即可缓慢恢复</span></div><div class="guide-item"><strong>释放龙焰</strong><kbd>SPACE</kbd><br><span>瞄准前方木靶喷火<br>每次消耗 8 点能量</span></div><div class="guide-item"><strong>休息片刻</strong><kbd>P</kbd><kbd>ESC</kbd><br><span>暂停时间与一切伤害<br>手机可点击右上角暂停</span></div></div><p>◎ 连续穿环获得积分倍率，精准穿过中心额外 +50 分。<br>✧ 晶石每枚 +25 分并恢复能量；螺旋气流托你上升。<br>手机：左手摇杆飞行，右手长按冲刺或龙焰。<br>成长奖励：300 XP 解锁珊瑚色，800 XP 解锁晴空蓝。</p><button class="start-button" id="guideClose">我准备好了</button>');$('guideClose').onclick=()=>hideModal();}
function showSettings(){openModal(`<div class="eyebrow">MAKE YOURSELF AT HOME</div><h2 id="modalTitle">飞行偏好</h2><div class="setting-row"><div>游戏音效<small>晶石、穿环与龙焰的声音</small></div><button class="switch ${settings.sound?'on':''}" id="soundSetting" aria-label="游戏音效" aria-pressed="${settings.sound}"></button></div><div class="setting-row"><div>舒缓镜头<small>关闭冲刺视野变化与速度线</small></div><button class="switch ${settings.gentle?'on':''}" id="gentleSetting" aria-label="舒缓镜头" aria-pressed="${settings.gentle}"></button></div><div class="setting-row"><div>高画质<small>柔和阴影与更清晰的画面</small></div><button class="switch ${settings.quality==='high'?'on':''}" id="qualitySetting" aria-label="高画质" aria-pressed="${settings.quality==='high'}"></button></div><div class="setting-row"><div>阿岚的鳞片<small>珊瑚 300 XP · 晴空 800 XP</small></div><div class="skin-options">${[['mint','#69ab92',0,'青苔绿'],['coral','#d78f79',300,'珊瑚色'],['sky','#73afd0',800,'晴空蓝']].map(([id,c,xp,label])=>`<button class="skin ${settings.skin===id?'selected':''} ${saved.xp<xp?'locked':''}" data-skin="${id}" data-xp="${xp}" style="background:${c}" aria-label="${label}${saved.xp<xp?'，需要 '+xp+' XP':''}" title="${label}${xp?' · '+xp+' XP':''}"></button>`).join('')}</div></div><p>飞行记录和成长会自动保存在这个浏览器中。</p><button class="start-button" id="settingsDone">完成</button>`);$('soundSetting').onclick=()=>{toggleSound();$('soundSetting').classList.toggle('on',settings.sound);$('soundSetting').setAttribute('aria-pressed',String(settings.sound));};$('gentleSetting').onclick=()=>{settings.gentle=!settings.gentle;$('gentleSetting').classList.toggle('on',settings.gentle);$('gentleSetting').setAttribute('aria-pressed',String(settings.gentle));save();};$('qualitySetting').onclick=()=>{settings.quality=settings.quality==='high'?'low':'high';renderer.setPixelRatio(Math.min(devicePixelRatio,settings.quality==='high'?1.7:1));renderer.shadowMap.enabled=settings.quality==='high';$('qualitySetting').classList.toggle('on',settings.quality==='high');$('qualitySetting').setAttribute('aria-pressed',String(settings.quality==='high'));save();};document.querySelectorAll('[data-skin]').forEach(btn=>btn.onclick=()=>{if(saved.xp<Number(btn.dataset.xp)){toast(`继续飞行，积累 ${btn.dataset.xp} XP 后解锁`);return;}settings.skin=btn.dataset.skin;applySkin();save();document.querySelectorAll('[data-skin]').forEach(b=>b.classList.toggle('selected',b===btn));});$('settingsDone').onclick=()=>hideModal();}
function toggleSound(){settings.sound=!settings.sound;$('soundBtn').innerHTML=settings.sound?'♫':'♫<span class="sound-slash"></span>';$('soundBtn').setAttribute('aria-label',settings.sound?'关闭音效':'开启音效');$('soundBtn').title=settings.sound?'关闭音效':'开启音效';initAudio();tone(600,.1);save();}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));$('startBtn').onclick=startGame;$('pauseBtn').onclick=pause;$('settingsBtn').onclick=showSettings;$('guideBtn').onclick=showGuide;$('soundBtn').onclick=toggleSound;$('brand').onclick=e=>{e.preventDefault();if(phase==='camp')return;if(phase==='result')returnCamp();else{openModal('<div class="eyebrow">BACK TO THE NEST</div><h2 id="modalTitle">结束这次飞行？</h2><p>已获得的积分与成长会保存到营地。</p><button class="start-button" id="leaveFlight">保存并返回营地</button><button class="secondary-button" id="keepFlying">继续飞行</button>');$('leaveFlight').onclick=returnCamp;$('keepFlying').onclick=()=>hideModal();}};$('closeModal').onclick=()=>{if(phase==='result')returnCamp();else hideModal();};$('modalBackdrop').onclick=e=>{if(e.target===$('modalBackdrop')&&phase!=='result')hideModal();};
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)&&phase==='playing')e.preventDefault();if(e.code==='Tab'&&!$('modalBackdrop').classList.contains('hidden')){const focusables=$('modal').querySelectorAll('button,[href],input,select,[tabindex="0"]');const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}if(['playing','countdown'].includes(phase)&&['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','ShiftLeft','ShiftRight'].includes(e.code))keys.add(e.code);if(e.repeat)return;if(e.code==='Escape'||e.code==='KeyP'){if(!$('modalBackdrop').classList.contains('hidden')){if(phase==='result')returnCamp();else hideModal();}else pause();return;}if(e.code==='Enter'&&phase==='camp'&&$('modalBackdrop').classList.contains('hidden')){startGame();return;}if(phase==='playing')keys.add(e.code);});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();touch.x=touch.y=0;touch.boost=touch.fire=false;if(['playing','countdown'].includes(phase))pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&['playing','countdown'].includes(phase))pause();});
let joystickId=null;function moveJoystick(e){const rect=$('joystick').getBoundingClientRect(),radius=rect.width/2,dx=e.clientX-rect.left-radius,dy=e.clientY-rect.top-radius,d=Math.hypot(dx,dy),max=radius*.63,factor=Math.min(1,max/Math.max(1,d));touch.x=dx*factor/max;touch.y=dy*factor/max;$('joystickKnob').style.transform=`translate(${dx*factor}px,${dy*factor}px)`;}
$('joystick').addEventListener('pointerdown',e=>{if(joystickId!==null)return;joystickId=e.pointerId;$('joystick').setPointerCapture(e.pointerId);moveJoystick(e);});$('joystick').addEventListener('pointermove',e=>{if(e.pointerId===joystickId)moveJoystick(e);});function releaseJoystick(e){if(e.pointerId===joystickId){joystickId=null;touch.x=touch.y=0;$('joystickKnob').style.transform='';}}['pointerup','pointercancel','lostpointercapture'].forEach(ev=>$('joystick').addEventListener(ev,releaseJoystick));
for(const [id,action] of [['touchBoost','boost'],['touchFire','fire']]){const button=$(id);button.addEventListener('pointerdown',e=>{button.setPointerCapture(e.pointerId);touch[action]=true;button.classList.add('pressed');initAudio();});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>button.addEventListener(ev,()=>{touch[action]=false;button.classList.remove('pressed');}));}
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
window.addEventListener('beforeunload',()=>{if(phase!=='camp')bankRun();});
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-lastTime)/1000,.05);lastTime=now;const frozen=phase==='paused'||phase==='result';if(!frozen){elapsed+=dt;if(phase==='playing')updateGame(dt);updateWorld(dt);updateParticles(dt);}renderer.render(scene,camera);hudTimer+=dt;if(hudTimer>.09){hudTimer=0;updateHud();}}
setMode('explore');applySkin();updateProfile();if(settings.sound){$('soundBtn').innerHTML='♫';$('soundBtn').setAttribute('aria-label','关闭音效');$('soundBtn').title='关闭音效';}
camera.position.set(51,71,87);camTarget.set(-7,43,-90);camera.lookAt(camTarget);
updateWorld(1/60);updateHud();renderer.render(scene,camera);$('loading').classList.add('hidden');requestAnimationFrame(animate);
// Read-only diagnostics for checking the live simulation and render health.
window.skybound={getState:()=>({phase,mode:selectedMode,...game,settings:{...settings},render:{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles},nextRing:(()=>{const r=rings.find(r=>!r.passed&&r.s>game.s);return r?{s:r.s,x:r.mesh.position.x,offset:r.offset,y:r.y}:null})()})};
