import * as THREE from './vendor/three.module.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const TAU=Math.PI*2, clamp=THREE.MathUtils.clamp, rand=(a,b)=>a+Math.random()*(b-a);
const mobile=matchMedia('(pointer:coarse)').matches || innerWidth<800;
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
let renderer;
try { renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'}); }
catch(e){ $('#loading').innerHTML='<p>当前浏览器无法启动 3D 画面</p><small>请使用支持 WebGL 的浏览器，并开启硬件加速。</small>';throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.6:2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
$('#canvas-host').append(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#7fd4d0');scene.fog=new THREE.Fog('#86d5cd',48,108);
const camera=new THREE.OrthographicCamera(-25,25,14,-14,.1,180);
const focus=new THREE.Vector3(-4.5,0,2.5),cameraOffset=new THREE.Vector3(16,23,26);
scene.add(new THREE.HemisphereLight('#fff4d1','#488998',2.7));
const sun=new THREE.DirectionalLight('#ffdfad',3.6);sun.position.set(-14,30,12);sun.castShadow=true;sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:85});sun.shadow.bias=-.0005;sun.shadow.normalBias=.025;sun.shadow.radius=3;scene.add(sun);
const mats=new Map();function mat(color,roughness=.7){const key=color+':'+roughness;if(!mats.has(key))mats.set(key,new THREE.MeshStandardMaterial({color,roughness,metalness:.02}));return mats.get(key);}
const geo={sphere:new THREE.SphereGeometry(1,24,16),lowSphere:new THREE.SphereGeometry(1,12,8),box:new THREE.BoxGeometry(1,1,1),cone:new THREE.ConeGeometry(1,1,12),cylinder:new THREE.CylinderGeometry(1,1,1,24)};
function mesh(g,m,x=0,y=0,z=0,sx=1,sy=1,sz=1,parent=scene){const o=new THREE.Mesh(g,typeof m==='string'?mat(m):m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function sphere(parent,color,x,y,z,sx,sy=sx,sz=sx){return mesh(geo.sphere,color,x,y,z,sx,sy,sz,parent);}
function segment(parent,a,b,r1,r2,color){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b);const dir=bv.clone().sub(av);const o=mesh(new THREE.CylinderGeometry(r2,r1,dir.length(),8),color,...av.clone().add(bv).multiplyScalar(.5).toArray(),1,1,1,parent);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());return o;}
function ring(radius,width,color,y=.1,parent=scene){const o=mesh(new THREE.TorusGeometry(radius,width,8,128),color,0,y,0,1,1,1,parent);o.rotation.x=-Math.PI/2;return o;}
function textSprite(text,color='#fff1cf',size=64){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.font=`900 ${size}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.shadowColor='#142e3877';ctx.shadowBlur=10;ctx.fillText(text,256,64);const t=new THREE.CanvasTexture(c),o=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true}));o.scale.set(4.6,1.15,1);return o;}

// The world is a complete real-time 3D diorama. No remote artwork is required.
const ocean=mesh(new THREE.PlaneGeometry(250,250,1,1),new THREE.MeshStandardMaterial({color:'#46bfba',roughness:.34,metalness:.06}),0,-.6,0);ocean.rotation.x=-Math.PI/2;ocean.castShadow=false;
mesh(new THREE.CylinderGeometry(13.4,13.8,.65,96),'#d6bb81',0,-.45,0);
const sandCanvas=document.createElement('canvas');sandCanvas.width=sandCanvas.height=512;const sandCtx=sandCanvas.getContext('2d');sandCtx.fillStyle='#ebcf96';sandCtx.fillRect(0,0,512,512);for(let i=0;i<9500;i++){sandCtx.fillStyle=Math.random()>.5?'#b8975724':'#fff2c35c';sandCtx.fillRect(Math.random()*512,Math.random()*512,Math.random()*2+1,Math.random()*2+1);}const sandTexture=new THREE.CanvasTexture(sandCanvas);sandTexture.wrapS=sandTexture.wrapT=THREE.RepeatWrapping;sandTexture.repeat.set(5,5);sandTexture.colorSpace=THREE.SRGBColorSpace;
mesh(new THREE.CylinderGeometry(13.25,13.4,.28,96),new THREE.MeshStandardMaterial({map:sandTexture,roughness:1}),0,-.14,0);
const arenaSurface=mesh(new THREE.CylinderGeometry(7.9,7.9,.035,96),'#f4d9a3',0,.027,0);
const arenaBoundary=new THREE.Group();scene.add(arenaBoundary);ring(7.8,.105,'#c29855',.09,arenaBoundary);ring(7.66,.032,'#ffe9b5',.09,arenaBoundary);
const arenaInner=ring(6.5,.015,'#dcc18b',.055);const centerRing=ring(1.4,.018,'#d8b879',.052);
for(let i=0;i<32;i++){const a=i/32*TAU;const o=mesh(geo.box,i%4===0?'#d17551':'#e6b47b',Math.sin(a)*7.75,.065,Math.cos(a)*7.75,.13,.025,.58,arenaBoundary);o.rotation.y=a;}
for(const x of [-2.7,2.7]){mesh(geo.box,'#dba571',x,.055,0,.09,.018,1.25);}
const waves=[];for(let i=0;i<4;i++){const w=ring(13.6+i*.7,.07,new THREE.MeshBasicMaterial({color:'#dbf8e0',transparent:true,opacity:.3}),-.48);w.scale.z=.94;waves.push(w);}
// Sea glints, little offshore islands, rocks, and flags create depth around the ring.
const glints=[];for(let i=0;i<100;i++){const x=rand(-65,65),z=rand(-65,65);if(Math.hypot(x,z)<15)continue;const o=mesh(geo.box,new THREE.MeshBasicMaterial({color:'#c5f0d7',transparent:true,opacity:rand(.15,.4)}),x,-.57,z,rand(.4,2.8),.01,.04);o.castShadow=false;glints.push(o);}
for(const [x,z,s] of [[-31,-27,3],[-17,-43,4],[31,-30,4.5],[42,10,3]]){sphere(scene,'#739c8a',x,-.2,z,s,s*.7,s*.8);sphere(scene,'#89aa82',x+.7,.6,z,s*.7,s*.45,s*.6);}
function palm(x,z,size=1,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;g.scale.setScalar(size);scene.add(g);for(let i=0;i<7;i++){const y=i*.64;const lean=Math.sin(i/8)*.65;segment(g,[lean,y,0],[Math.sin((i+1)/8)*.65,y+.64,0],.2-i*.012,.185-i*.012,i%2?'#a67443':'#ba8851');}const top=new THREE.Vector3(.5,4.55,0);for(let j=0;j<8;j++){const a=j/8*TAU;const shape=new THREE.Shape();shape.moveTo(0,0);shape.quadraticCurveTo(.8,.5,3,0);shape.quadraticCurveTo(.9,-.48,0,0);const leaf=mesh(new THREE.ShapeGeometry(shape,12),new THREE.MeshStandardMaterial({color:j%2?'#398661':'#58a474',side:THREE.DoubleSide,roughness:.85}),...top.toArray(),1,1,1,g);leaf.rotation.set(-.7,a,.25);leaf.rotateZ(a);leaf.rotation.x=-Math.PI/2+.18;leaf.rotation.z=a;const tip=new THREE.Vector3(Math.cos(a)*2.5,3.7,Math.sin(a)*2.5);segment(g,top.toArray(),tip.toArray(),.03,.005,'#4b9065');}for(let j=0;j<3;j++)sphere(g,'#785a36',.35+Math.cos(j*2)*.25,4.3,Math.sin(j*2)*.25,.22);return g;}
palm(-10,-5,1.18,-.5);palm(-8,-9,.95,1.7);palm(10,-5,1.12,2.3);palm(11,4,.8,.5);palm(-11,5,.85,-1);
for(let i=0;i<22;i++){const a=rand(0,TAU),r=rand(10,12.7);sphere(scene,i%2?'#9fae9a':'#b9baa2',Math.sin(a)*r,.07,Math.cos(a)*r,rand(.16,.4),rand(.13,.3),rand(.2,.5));}
function starfish(x,z,s=.45){const g=new THREE.Group();g.position.set(x,.06,z);scene.add(g);for(let i=0;i<5;i++){const a=i/5*TAU;const o=mesh(geo.cone,'#de8560',Math.sin(a)*s*.45,0,Math.cos(a)*s*.45,s*.24,s,.12,g);o.rotation.x=Math.PI/2;o.rotation.z=-a;}sphere(g,'#e69566',0,.01,0,s*.2,.05,s*.2);}
starfish(8.9,4.8);starfish(-6.6,9.1,.33);starfish(5,-10,.4);
const flags=[];function flag(x,z,color,angle=0){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);segment(g,[0,0,0],[0,3.1,0],.075,.06,'#876347');sphere(g,'#f6db9c',0,3.15,0,.11);const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(1.3,-.05);sh.lineTo(1.1,-.8);sh.lineTo(0,-.65);const f=mesh(new THREE.ShapeGeometry(sh),new THREE.MeshStandardMaterial({color,side:THREE.DoubleSide}),0,2.95,0,1,1,1,g);g.rotation.y=angle;flags.push(f);return g;}
flag(-6,-8.9,'#ef8663',.4);flag(5.3,-9.2,'#479c99',-.6);flag(8.8,5.8,'#ed9d68',-.3);
// A little slatted boardwalk and parasol belong to the beach, outside combat.
for(let j=0;j<12;j++)mesh(geo.box,'#ae8658',-2.5+j*.5,-.02,-13.4, .46,.2,4.4);
for(const x of [-2.5,3])for(const z of [-12,-15.4])segment(scene,[x,-.9,z],[x,.5,z],.12,.1,'#8a694b');
function parasol(x,z){segment(scene,[x,0,z],[x,2.1,z],.045,.04,'#edd7ac');for(let i=0;i<8;i++){const o=mesh(new THREE.ConeGeometry(1.6,.65,1,1,false,i*TAU/8,TAU/8),i%2?'#ffe3a8':'#ef956e',x,2.1,z);o.castShadow=true;}sphere(scene,'#ebc896',x,2.46,z,.1);}
parasol(9,8);mesh(geo.box,'#d9e9d3',8.8,.025,9.6,1.5,.05,2.2).rotation.y=.3;
const banner=new THREE.Group();scene.add(banner);banner.position.set(0,2.4,-10.4);const bannerText=textSprite('CRAB CLASH','#254a4b',44);banner.add(bannerText);bannerText.scale.set(5.4,1.35,1);mesh(geo.box,'#fff0c4',0,0,0,4.1,.8,.09,banner);bannerText.position.z=.1;

const crabs=[],particles=[],effects=[],pickups=[];
function createCrab(color='#f0714d',scale=1,decoration='band'){const root=new THREE.Group();scene.add(root);const body=new THREE.Group();root.add(body);body.scale.setScalar(scale);
 const shell=sphere(body,color,0,.58,0,.78,.44,.64);shell.rotation.x=-.08;
 sphere(body,'#f5ce98',0,.43,.07,.63,.28,.53);sphere(body,color,0,.69,-.08,.72,.35,.58);
 const shine=sphere(body,new THREE.MeshStandardMaterial({color:'#fff7dc',transparent:true,opacity:.24,roughness:.2}),-.23,.94,.03,.23,.045,.17);
 for(let i=0;i<8;i++){const a=i/8*TAU;const spike=mesh(geo.cone,color,Math.sin(a)*.69,.66,Math.cos(a)*.5,.11,.24,.1,body);spike.rotation.z=-Math.sin(a)*1.15;spike.rotation.x=Math.cos(a)*1.15;}
 const legs=[];for(const side of [-1,1])for(let i=0;i<3;i++){const g=new THREE.Group();g.position.set(side*.47,.4,.32-i*.32);body.add(g);segment(g,[0,0,0],[side*.63,-.04,(i-1)*.2],.11,.085,color);segment(g,[side*.63,-.04,(i-1)*.2],[side*.85,-.35,(i-1)*.35],.08,.035,color);sphere(g,color,side*.63,-.04,(i-1)*.2,.115);legs.push({g,side,index:i});}
 const claws=[];for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.51,.59,.36);body.add(arm);segment(arm,[0,0,0],[side*.43,-.07,.3],.12,.14,color);segment(arm,[side*.43,-.07,.3],[side*.38,.03,.68],.14,.2,color);sphere(arm,color,side*.43,-.07,.3,.19);const claw=new THREE.Group();claw.position.set(side*.35,.08,.83);arm.add(claw);sphere(claw,color,0,0,0,.32,.25,.42);const fingers=[];for(const f of [-1,1]){const finger=new THREE.Group();finger.position.set(f*.18,.01,.2);claw.add(finger);const o=sphere(finger,color,0,0,.22,.14,.18,.36);o.rotation.y=-f*.27;const tip=mesh(geo.cone,'#ffd4a0',-f*.035,0,.48,.087,.22,.1,finger);tip.rotation.x=Math.PI/2;tip.rotation.z=f*.3;finger.rotation.y=f*.28;fingers.push(finger);}claws.push({arm,claw,fingers,side});}
 for(const side of [-1,1]){segment(body,[side*.28,.77,.35],[side*.32,1.13,.4],.075,.06,color);sphere(body,'#fff6d7',side*.32,1.15,.42,.155,.18,.16);sphere(body,'#163b44',side*.32,1.16,.554,.08,.105,.058);sphere(body,'#ffffff',side*.3,1.21,.598,.024);}
 const smile=mesh(new THREE.TorusGeometry(.12,.017,6,16,Math.PI),'#7b4733',0,.66,.617,1,1,1,body);smile.rotation.z=Math.PI;
 if(decoration==='band'){const band=ring(.65,.045,'#fff0c3',.74,body);band.scale.z=.86;mesh(geo.box,'#ed593f',0,.77,.62,.18,.16,.04,body);}
 if(decoration==='crown'){mesh(new THREE.CylinderGeometry(.4,.36,.19,6),'#ffd36b',0,1.09,-.1,1,1,1,body);for(let i=0;i<5;i++){const a=i/5*TAU;mesh(geo.cone,'#ffd36b',Math.sin(a)*.31,1.32,Math.cos(a)*.31-.1,.11,.37,.11,body);}}
 const shadow=mesh(new THREE.CircleGeometry(1,40),new THREE.MeshBasicMaterial({color:'#3d695d',transparent:true,opacity:.13,depthWrite:false}),0,.065,0,1,1,1,root);shadow.rotation.x=-Math.PI/2;
 const marker=ring(.95,.033,new THREE.MeshBasicMaterial({color:color==='#f0714d'?'#fff4bf':'#aeb5f0',transparent:true,opacity:.68}),.08,root);marker.castShadow=false;
 return {root,body,legs,claws,shell,shadow,marker,scale,baseColor:color};}
function actor(name,color,x,z,opts={}){const visual=createCrab(color,opts.scale||1,opts.decoration||'none');visual.root.position.set(x,0,z);const a={name,color,x,z,vx:0,vz:0,fx:0,fz:1,angle:0,damage:0,stamina:100,maxStamina:100,rage:0,attackCd:0,dashCd:0,dashTime:0,dashHit:new Set(),block:false,stun:0,attackAnim:0,flash:0,alive:true,fall:0,aiTimer:0,aiMoveX:0,aiMoveZ:0,aiSeed:rand(0,10),radius:.85,mass:1,speed:1,power:1,isPlayer:false,visual,...opts};crabs.push(a);return a;}
function removeCrab(a){scene.remove(a.visual.root);a.visual.root.traverse(o=>{if(o.isMesh){if(!Object.values(geo).includes(o.geometry))o.geometry.dispose();if(![...mats.values()].includes(o.material))o.material.dispose();}});}
function clearCrabs(){for(const a of crabs)removeCrab(a);crabs.length=0;}
function disposeMesh(o){scene.remove(o);if(o.userData.disposable){o.geometry?.dispose();o.material?.dispose();}}
function clearEffects(){for(const p of particles)scene.remove(p.mesh);particles.length=0;for(const e of effects){scene.remove(e.mesh);e.mesh.material?.dispose();}effects.length=0;for(const p of pickups)scene.remove(p.group);pickups.length=0;}
const rivals=[{name:'泡泡拳手',title:'灵活型 · 初出茅庐',color:'#a48ae0',speed:.88,mass:.9,power:.85},{name:'礁石守卫',title:'重装型 · 稳如磐石',color:'#529fbf',speed:.72,mass:1.5,power:1.15,scale:1.15},{name:'疾风青钳',title:'突进型 · 横行如风',color:'#6ba875',speed:1.28,mass:.85,power:1.05},{name:'紫潮双煞',title:'双人组 · 小心夹击',color:'#af78b0',speed:1,mass:1.05,power:1.1},{name:'黄金钳王',title:'终极头目 · 沙滩霸主',color:'#e6ad43',speed:1.02,mass:1.5,power:1.3,scale:1.28,decoration:'crown'}];
let state='menu',mode='tournament',round=1,lives=3,player=null,clock=90,ringRadius=7.8,countdown=0,elapsed=0,totalTime=0,knockouts=0,hits=0,combo=0,comboTime=0,best=0,pauseOrigin='playing',resumeState='playing',matchOutcome=null,resultDelay=0,shake=0,hitstop=0,toastTime=0,pickupClock=10,survivalWave=1;
const upgrades={power:0,speed:0,endurance:0};
try{best=Number(localStorage.getItem('crab-clash-best')||0);}catch{}$('#best-score').textContent=best?`${best} 次击退`:'尚未登场';
const keys=new Set(),touch={x:0,z:0,block:false};let soundOn=false,audioCtx=null;
function sound(kind){if(!soundOn)return;try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const gain=audioCtx.createGain();gain.connect(audioCtx.destination);const osc=audioCtx.createOscillator();osc.connect(gain);const t=audioCtx.currentTime;const notes={hit:[180,65,.13,'triangle'],dash:[240,70,.15,'sawtooth'],block:[350,180,.07,'square'],count:[540,520,.12,'sine'],go:[620,1000,.25,'triangle'],win:[520,1050,.55,'triangle'],out:[220,45,.5,'sine'],ult:[95,800,.45,'sawtooth'],pickup:[680,1100,.2,'sine']};const [f,end,dur,type]=notes[kind]||notes.hit;osc.type=type;osc.frequency.setValueAtTime(f,t);osc.frequency.exponentialRampToValueAtTime(end,t+dur);gain.gain.setValueAtTime(.035,t);gain.gain.exponentialRampToValueAtTime(.001,t+dur);osc.start(t);osc.stop(t+dur);}catch{}}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');toastTime=2.1;}
function message(kicker,title,sub=''){$('#center-message').classList.remove('hidden');$('#message-kicker').textContent=kicker;$('#message-title').textContent=title;$('#message-sub').textContent=sub;$('#message-sub').style.display=sub?'block':'none';}
function hideMessage(){$('#center-message').classList.add('hidden');}
function burst(x,z,color='#ffda98',n=16,power=1){for(let i=0;i<n;i++){const o=mesh(geo.lowSphere,mat(color),x,.5,z,rand(.035,.11),rand(.03,.09),rand(.035,.11));o.castShadow=false;particles.push({mesh:o,vx:rand(-4,4)*power,vy:rand(1,6)*power,vz:rand(-4,4)*power,life:rand(.3,.75),max:.75});}}
function pulse(x,z,color,radius=3,life=.4){const m=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8,depthWrite:false,side:THREE.DoubleSide});const o=ring(1,.055,m,.16);o.position.x=x;o.position.z=z;effects.push({mesh:o,life,max:life,radius});}
function floatText(text,x,z,color='#fff2c6'){const o=textSprite(text,color,52);o.position.set(x,2.6,z);o.scale.set(3.6,.9,1);scene.add(o);effects.push({mesh:o,life:.85,max:.85,float:true});}
function isGameplay(){return state==='playing';}
function currentEnemy(){return crabs.find(a=>!a.isPlayer&&a.alive)||crabs.find(a=>!a.isPlayer);}
function setupMenu(){clearCrabs();clearEffects();player=actor('赤钳小子','#f0714d',-2.6,2.1,{isPlayer:true,decoration:'band',scale:1.35});const e=actor('泡泡拳手','#a48ae0',2.3,-1.5,{scale:1.3});player.fx=.8;player.fz=-.6;e.fx=-.75;e.fz=.66;state='menu';$('#menu').classList.remove('hidden');$('#hud').classList.add('hidden');$('#battle-footer').classList.add('hidden');$('#mobile-controls').classList.add('hidden');$('#dialog').classList.add('hidden');$('#water-warning').classList.add('hidden');hideMessage();ringRadius=7.8;arenaBoundary.scale.set(1,1,1);arenaSurface.scale.set(1,1,1);$('#pause').textContent='Ⅱ';$('#help').disabled=false;}
function startGame(chosen=mode){$('#pause').textContent='Ⅱ';mode=chosen;round=1;lives=3;knockouts=0;hits=0;totalTime=0;survivalWave=1;upgrades.power=upgrades.speed=upgrades.endurance=0;$('#menu').classList.add('hidden');$('#hud').classList.remove('hidden');$('#battle-footer').classList.remove('hidden');$('#dialog').classList.add('hidden');if(mobile)$('#mobile-controls').classList.remove('hidden');setupRound();}
function setupRound(){clearCrabs();clearEffects();keys.clear();touch.x=touch.z=0;touch.block=false;ringRadius=7.8;arenaBoundary.scale.set(1,1,1);arenaSurface.scale.set(1,1,1);clock=mode==='practice'?999:mode==='survival'?120:90;elapsed=0;combo=0;pickupClock=8;matchOutcome=null;resultDelay=0;state='countdown';countdown=3;player=actor('赤钳小子','#f0714d',-2.9,2.1,{isPlayer:true,decoration:'band',power:1+upgrades.power*.16,speed:1+upgrades.speed*.1,maxStamina:100+upgrades.endurance*25,stamina:100+upgrades.endurance*25});player.fx=.8;player.fz=-.6;
 if(mode==='practice'){actor('陪练沙包','#a48ae0',2,-1.2,{speed:0,power:0,mass:1.1});}
 else if(mode==='survival'){spawnWave(1);}
 else{const r=rivals[round-1];actor(r.name,r.color,2.6,-1.8,r);if(round===4)actor('紫潮副手','#7786c5',1.4,-3.8,{speed:.9,mass:.9,power:.9,scale:.9});}
 for(const a of crabs.filter(a=>!a.isPlayer)){a.fx=-.8;a.fz=.6;}
 $('#water-warning').classList.add('hidden');$('#tip-text').textContent=mode==='practice'?'自由练习：对手不会主动攻击，推出后会重新登场。':'钳击积累伤害，冲刺完成最后一推。';hideDialog();updateHud();sound('count');}
function spawnWave(w){const count=Math.min(w===1?2:3,3);for(let i=0;i<count;i++){const a=i/count*TAU+.3;const r=rivals[(w+i-1)%5];actor(r.name,r.color,Math.sin(a)*4.5,Math.cos(a)*4.5,{...r,power:.8+w*.08,mass:r.mass,scale:.95});}toast(`第 ${w} 波 · ${count} 位对手入场`);}
function attack(a){if(!a.alive||a.attackCd>0||a.stun>0||a.dashTime>0||a.stamina<8)return false;a.attackCd=.48;a.attackAnim=.3;a.stamina-=8;a.block=false;let didHit=false;
 for(const b of crabs){if(b===a||!b.alive)continue;const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);const dot=(dx*a.fx+dz*a.fz)/Math.max(d,.01);if(d<2.9&&dot>.15){impact(a,b,5.5*a.power,12,'hit');didHit=true;}}
 if(!didHit){sound('dash');burst(a.x+a.fx*1.6,a.z+a.fz*1.6,'#f3dfb7',4,.3);}return true;}
function dash(a){if(!a.alive||a.dashCd>0||a.stun>0||a.stamina<27)return false;a.dashCd=1.05;a.dashTime=.25;a.stamina-=27;a.block=false;a.dashHit.clear();a.vx+=a.fx*11.5;a.vz+=a.fz*11.5;pulse(a.x,a.z,'#fff2bf',1.3,.25);sound('dash');return true;}
function ultimate(a){if(a.rage<100||a.stun>0||!a.alive){if(a.isPlayer)toast('怒气蓄满后，按 E 释放潮汐巨钳');return false;}a.rage=0;a.attackAnim=.7;shake=.5;hitstop=.065;sound('ult');pulse(a.x,a.z,'#ffe897',5.2,.65);pulse(a.x,a.z,'#95f2e0',4.5,.9);burst(a.x,a.z,'#ffdf83',48,1.6);floatText('潮汐巨钳！',a.x,a.z,'#ffe6a1');for(const b of crabs){if(b!==a&&b.alive&&Math.hypot(b.x-a.x,b.z-a.z)<5.2)impact(a,b,14*a.power,25,'ult');}return true;}
function impact(a,b,power,damage,kind){let dx=b.x-a.x,dz=b.z-a.z;const dist=Math.hypot(dx,dz)||1;dx/=dist;dz/=dist;const blocked=b.block&&(-dx*b.fx-dz*b.fz)>.1&&b.stamina>0;let multiplier=1;
 if(blocked){multiplier=.3;b.stamina=Math.max(0,b.stamina-17);b.rage=Math.min(100,b.rage+6);sound('block');pulse(b.x,b.z,'#9fe4dd',1.3,.25);floatText('格挡',b.x,b.z,'#b2f3e3');if(b.stamina===0){b.stun=.85;b.block=false;floatText('破防！',b.x,b.z,'#ffc289');multiplier=1;}}
 else{sound(kind==='ult'?'ult':'hit');b.damage=Math.min(250,b.damage+damage);b.stun=kind==='ult'?.35:.18;b.flash=.18;burst((a.x+b.x)/2,(a.z+b.z)/2,'#ffe4aa',kind==='ult'?24:13);floatText('+'+damage+'%',b.x,b.z);if(kind!=='ult')a.rage=Math.min(100,a.rage+14);b.rage=Math.min(100,b.rage+10);if(a.isPlayer){hits++;combo=comboTime>0?combo+1:1;comboTime=2;if(combo>1&&combo%2===0)toast(`${combo} 连钳！继续施压`);}shake=Math.min(.55,.17+b.damage*.001);hitstop=kind==='ult'?.07:.035;}
 const force=power*(1+b.damage/70)*multiplier/b.mass;b.vx+=dx*force;b.vz+=dz*force;a.vx-=dx*force*.11;a.vz-=dz*force*.11;
}
function ai(a,dt){if(!a.alive||mode==='practice')return;a.aiTimer-=dt;const candidates=crabs.filter(b=>b!==a&&b.alive);let target=player;let min=1e9;for(const b of candidates){const d=Math.hypot(b.x-a.x,b.z-a.z)*(b.isPlayer?.86:1);if(d<min){min=d;target=b;}}if(!target?.alive)return;
 const dx=target.x-a.x,dz=target.z-a.z,dist=Math.hypot(dx,dz)||1,edge=Math.hypot(a.x,a.z);a.block=false;
 if(a.aiTimer<=0){a.aiTimer=rand(.16,.28);let mx=dx/dist,mz=dz/dist;const tangent=Math.sin(elapsed*1.3+a.aiSeed)*.33;mx+=-dz/dist*tangent;mz+=dx/dist*tangent;
 if(edge>ringRadius-1.6){mx=-a.x/edge*1.6+mx*.12;mz=-a.z/edge*1.6+mz*.12;}
 else if(dist<2.05){mx*=.05;mz*=.05;}
 const len=Math.hypot(mx,mz)||1;a.aiMoveX=mx/Math.max(len,1);a.aiMoveZ=mz/Math.max(len,1);
 if(dist<2.72&&a.attackCd<=0&&Math.random()<.7)attack(a);
 if(dist>3.2&&dist<6.3&&edge<ringRadius-2.3&&a.stamina>45&&Math.random()<.12+(round-1)*.025)dash(a);
 if(a.rage>=100&&dist<3.7)ultimate(a);
 }
 a.fx=dx/dist;a.fz=dz/dist;
 if(dist<3.1&&target.attackAnim>0&&a.stamina>23&&Math.sin(elapsed*3+a.aiSeed)>.12&&a.dashTime<=0)a.block=true;
 moveActor(a,a.aiMoveX,a.aiMoveZ,dt);
}
function moveActor(a,mx,mz,dt){if(a.stun>0||a.dashTime>0)return;const len=Math.hypot(mx,mz);if(len>.08){mx/=Math.max(1,len);mz/=Math.max(1,len);if(a.isPlayer){a.fx=mx/(Math.hypot(mx,mz)||1);a.fz=mz/(Math.hypot(mx,mz)||1);}const accel=30*a.speed*(a.block?.38:1);a.vx+=mx*accel*dt;a.vz+=mz*accel*dt;}}
function controls(dt){let sx=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+touch.x;let sy=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0)+touch.z;const l=Math.hypot(sx,sy);if(l>1){sx/=l;sy/=l;}
 // Rotate screen-aligned controls onto the ground plane, preserving normalized speed.
 const mx=sx*.851+sy*.525,mz=-sx*.525+sy*.851;
 player.block=(keys.has('KeyK')||keys.has('ShiftLeft')||keys.has('ShiftRight')||touch.block)&&player.stamina>0&&player.dashTime<=0&&player.stun<=0;
 moveActor(player,mx,mz,dt);
 if(keys.has('KeyJ'))attack(player);
}
function spawnPickup(){if(pickups.length>=2)return;const a=rand(0,TAU),r=rand(1,ringRadius-2);const g=new THREE.Group();g.position.set(Math.cos(a)*r,.5,Math.sin(a)*r);scene.add(g);sphere(g,'#ffce6c',0,0,0,.3,.21,.3);for(let i=0;i<5;i++){const ang=i/5*TAU;const o=mesh(geo.cone,'#ffe097',Math.sin(ang)*.27,0,Math.cos(ang)*.27,.14,.5,.14,g);o.rotation.x=Math.PI/2;o.rotation.z=-ang;}const halo=ring(.52,.025,new THREE.MeshBasicMaterial({color:'#ffe5a3',transparent:true,opacity:.8}),-.3,g);pickups.push({group:g,life:14});}
function step(dt){if(state==='countdown'){countdown-=dt;const num=Math.ceil(countdown);if(num>0){if($('#message-title').textContent!==String(num))sound('count');message(mode==='practice'?'自由练习':mode==='survival'?'潮汐乱斗':`冠军之路 · 第 ${round} 回合`,String(num),mode==='practice'?'试试 J 钳击，再用空格冲刺':'把对手推出沙圈');}else if(countdown>-.55){if($('#message-title').textContent!=='开钳！')sound('go');message('准备好横行霸道','开钳！');}else{hideMessage();state='playing';}return;}
 if(state==='resolving'){resultDelay-=dt;for(const a of crabs)if(!a.alive)updateFall(a,dt);if(resultDelay<=0)finishRound();return;}
 if(state!=='playing')return;
 elapsed+=dt;totalTime+=dt;if(mode!=='practice')clock=Math.max(0,clock-dt);comboTime-=dt;pickupClock-=dt;
 if(player.alive)controls(dt);
 for(const a of crabs){if(!a.alive){updateFall(a,dt);continue;}a.attackCd=Math.max(0,a.attackCd-dt);a.dashCd=Math.max(0,a.dashCd-dt);a.dashTime=Math.max(0,a.dashTime-dt);a.stun=Math.max(0,a.stun-dt);a.attackAnim=Math.max(0,a.attackAnim-dt);a.flash=Math.max(0,a.flash-dt);a.rage=Math.min(100,a.rage+dt*2.5);
 if(!a.isPlayer)ai(a,dt);
 if(a.block){a.stamina=Math.max(0,a.stamina-dt*13);if(a.stamina===0){a.block=false;a.stun=.65;floatText('破防',a.x,a.z,'#ffd08e');}}
 else if(a.dashTime<=0&&a.attackAnim<=.12)a.stamina=Math.min(a.maxStamina,a.stamina+dt*20);
 const friction=a.dashTime>0?1.1:(round===3&&mode==='tournament'?3.7:5.2);const damping=Math.exp(-friction*dt);a.vx*=damping;a.vz*=damping;
 if(round===4&&mode==='tournament'){a.vx+=dt*.65;a.vz-=dt*.4;}
 a.x+=a.vx*dt;a.z+=a.vz*dt;
 }
 for(let i=0;i<crabs.length;i++)for(let j=i+1;j<crabs.length;j++){const a=crabs[i],b=crabs[j];if(!a.alive||!b.alive)continue;let dx=b.x-a.x,dz=b.z-a.z;const d=Math.hypot(dx,dz)||.001;const radii=a.radius*a.visual.scale+b.radius*b.visual.scale;if(d<radii){dx/=d;dz/=d;const overlap=radii-d;const total=a.mass+b.mass;a.x-=dx*overlap*b.mass/total;a.z-=dz*overlap*b.mass/total;b.x+=dx*overlap*a.mass/total;b.z+=dz*overlap*a.mass/total;const rel=(a.vx-b.vx)*dx+(a.vz-b.vz)*dz;if(rel>0){const impulse=rel*.65;a.vx-=dx*impulse*b.mass/total;a.vz-=dz*impulse*b.mass/total;b.vx+=dx*impulse*a.mass/total;b.vz+=dz*impulse*a.mass/total;}
 if(a.dashTime>0&&!a.dashHit.has(b)){a.dashHit.add(b);impact(a,b,8.4*a.power,17,'dash');}
 if(b.dashTime>0&&!b.dashHit.has(a)){b.dashHit.add(a);impact(b,a,8.4*b.power,17,'dash');}
 }}
 if(mode==='survival'){ringRadius=Math.max(4.2,7.8-elapsed*.027);$('#water-warning').classList.toggle('hidden',elapsed<18);}
 else if(mode==='tournament'&&clock<30){ringRadius=Math.max(4.6,7.8-(30-clock)*.11);$('#water-warning').classList.remove('hidden');}
 arenaBoundary.scale.set(ringRadius/7.8,1,ringRadius/7.8);arenaSurface.scale.set(ringRadius/7.8,1,ringRadius/7.8);
 for(const a of crabs)if(a.alive&&Math.hypot(a.x,a.z)>ringRadius+.38)ringOut(a);
 for(let i=pickups.length-1;i>=0;i--){const p=pickups[i];p.life-=dt;for(const a of crabs)if(a.alive&&Math.hypot(a.x-p.group.position.x,a.z-p.group.position.z)<1){a.stamina=Math.min(a.maxStamina,a.stamina+35);a.rage=Math.min(100,a.rage+20);a.damage=Math.max(0,a.damage-12);p.life=0;burst(a.x,a.z,'#ffdf88',18);sound('pickup');if(a.isPlayer)toast('海星补给 · 耐力 +35 · 怒气 +20');break;}if(p.life<=0){scene.remove(p.group);pickups.splice(i,1);}}
 if(pickupClock<=0){spawnPickup();pickupClock=rand(10,15);}
 const aliveEnemies=crabs.filter(a=>!a.isPlayer&&a.alive).length;
 if(mode==='practice'){if(!aliveEnemies){const dummy=actor('陪练沙包','#a48ae0',rand(-3,3),rand(-3,3),{speed:0,power:0,mass:1.1});dummy.stun=1;}if(!player.alive){player.alive=true;player.x=-2.5;player.z=2;player.vx=player.vz=player.damage=player.fall=0;player.visual.root.rotation.set(0,0,0);player.stamina=player.maxStamina;toast('回到擂台，继续练习！');}}
 else if(!player.alive||(!aliveEnemies&&mode==='tournament')||clock<=0){if(!player.alive&&aliveEnemies===0){matchOutcome='draw';message('同归于海','平局！','本回合重新开始');}else if(!player.alive){matchOutcome='lose';message('再来一次','被推出场外','稳住，再找机会');}else if(!aliveEnemies){matchOutcome='win';message('漂亮的出界击退','胜利！',round===5?'日落湾的新钳王诞生了':'下一位挑战者正在热身');}else{const enemyBest=Math.min(...crabs.filter(a=>!a.isPlayer&&a.alive).map(a=>a.damage));matchOutcome=player.damage<=enemyBest?'win':'lose';message('时间到',matchOutcome==='win'?'判定获胜':'判定落败','伤害更低的一方获胜');}state='resolving';resultDelay=1.9;sound(matchOutcome==='win'?'win':'out');}
 else if(mode==='survival'&&!aliveEnemies){survivalWave++;player.damage=Math.max(0,player.damage-20);player.stamina=player.maxStamina;clock+=25;spawnWave(survivalWave);}
 for(let i=crabs.length-1;i>=0;i--){const a=crabs[i];if(!a.isPlayer&&!a.alive&&a.fall>2){removeCrab(a);crabs.splice(i,1);}}
 updateHud();
}
function ringOut(a){a.alive=false;a.fall=0;a.block=false;burst(a.x,a.z,'#c5f5e1',28,1.3);pulse(a.x,a.z,'#f4ffea',2,.8);sound('out');floatText('出界！',a.x,a.z,'#fff1c7');if(!a.isPlayer){knockouts++;if(mode==='survival')toast(`击退 +1 · 累计 ${knockouts} 次`);}}
function updateFall(a,dt){a.fall+=dt;a.x+=a.vx*dt*.2;a.z+=a.vz*dt*.2;}
function saveBest(){if(knockouts>best){best=knockouts;try{localStorage.setItem('crab-clash-best',String(best));}catch{}$('#best-score').textContent=`${best} 次击退`;}}
function finishRound(){saveBest();if(matchOutcome==='draw'){setupRound();return;}
 if(mode==='survival'){showResults(false);return;}
 if(matchOutcome==='win'){if(round>=5){showResults(true);return;}state='upgrade';showDialog(`<div class="eyebrow">ROUND ${String(round).padStart(2,'0')} COMPLETE</div><h2 id="dialog-title">好钳法，再进一步。</h2><p>选一项强化，带着它迎接下一位对手。</p><div class="upgrades"><button class="upgrade" data-upgrade="power"><span class="upgrade-icon">✹</span><b>重装巨钳</b><small>击退力量 +16%</small><small>已强化 ${upgrades.power} 次</small></button><button class="upgrade" data-upgrade="speed"><span class="upgrade-icon">ϟ</span><b>横行疾风</b><small>移动速度 +10%</small><small>已强化 ${upgrades.speed} 次</small></button><button class="upgrade" data-upgrade="endurance"><span class="upgrade-icon">◈</span><b>硬壳耐力</b><small>最大耐力 +25</small><small>已强化 ${upgrades.endurance} 次</small></button></div>`);$$('[data-upgrade]').forEach(b=>b.onclick=()=>{upgrades[b.dataset.upgrade]++;round++;setupRound();});}
 else{lives--;if(lives<=0)showResults(false);else{state='between';showDialog(`<div class="eyebrow">还有 ${lives} 次机会</div><h2 id="dialog-title">沙滩上跌倒，沙滩上站起。</h2><p>受击时按住 K 防御，靠近边缘时先回到中央。<br>剩余耐力足够时，冲刺能帮你脱离危险。</p><button class="primary" id="retry">再战这一回合</button><button class="secondary" id="leave">返回主菜单</button>`);$('#retry').onclick=setupRound;$('#leave').onclick=setupMenu;}}
}
function showResults(won){state='finished';saveBest();if(won){for(let i=0;i<10;i++)burst(rand(-5,5),rand(-5,5),['#ffe08c','#ff9472','#a4dfc3'][i%3],24,1.8);sound('win');}
 showDialog(`<div class="eyebrow">${won?'SUNSET BAY CHAMPION':mode==='survival'?`第 ${survivalWave} 波 · 挑战结束`:'THE TIDE WILL TURN'}</div><h2 id="dialog-title">${won?'你就是，新一代钳王！':'这回合，潮水记住了你。'}</h2><p>${won?'五轮鏖战，一顶王冠。整片日落湾为你欢呼。':'每一次出钳，都离冠军更近一步。'}</p><div class="result-stats"><div><b>${knockouts}</b><span>出界击退</span></div><div><b>${hits}</b><span>成功命中</span></div><div><b>${Math.floor(totalTime)}s</b><span>战斗时长</span></div></div><button class="primary" id="play-again">再来一场</button><button class="secondary" id="leave">返回主菜单</button>`);$('#play-again').onclick=()=>startGame();$('#leave').onclick=setupMenu;}
function showDialog(html){$('#help').disabled=true;$('#dialog-content').innerHTML=html;$('#dialog').classList.remove('hidden');hideMessage();requestAnimationFrame(()=>$('#dialog button')?.focus());}
function hideDialog(){$('#dialog').classList.add('hidden');$('#help').disabled=false;}
function pauseGame(){if(state==='paused'){state=resumeState;hideDialog();$('#pause').textContent='Ⅱ';return;}if(!['playing','countdown'].includes(state))return;resumeState=state;state='paused';keys.clear();touch.x=touch.z=0;touch.block=false;$('#pause').textContent='▷';showDialog('<div class="eyebrow">TAKE A BREATHER</div><h2 id="dialog-title">歇一歇，钳子也会累。</h2><p>比赛已经暂停，海风还在。</p><button class="primary" id="resume">继续对战</button><button class="secondary" id="restart">重新开始</button> <button class="secondary" id="leave">返回主菜单</button>');$('#resume').onclick=pauseGame;$('#restart').onclick=()=>startGame();$('#leave').onclick=setupMenu;}
function showHelp(){if(!['menu','playing','countdown','paused'].includes(state))return;const previous=state;state='help';keys.clear();touch.x=touch.z=0;touch.block=false;showDialog(`<div class="eyebrow">KNOW YOUR CLAWS</div><h2 id="dialog-title">一推成名。</h2><p>没有血量归零。伤害百分比越高，越容易被击飞。<br>把对手推出沙圈，就是胜利。</p><div class="help-grid"><div><kbd>W A S D</kbd><b>横行霸道</b><p>也可用方向键移动；面向移动方向。</p></div><div><kbd>J</kbd><b>钳击</b><p>前方近战。积累对手伤害与自己的怒气。</p></div><div><kbd>SPACE</kbd><b>冲刺</b><p>消耗 27 耐力，撞飞对手或脱离边缘。</p></div><div><kbd>K / SHIFT</kbd><b>硬壳防御</b><p>按住可减少正面击退，耐力耗尽会破防。</p></div><div><kbd>E</kbd><b>潮汐巨钳</b><p>怒气全满后，释放大范围击退冲击波。</p></div><div><kbd>✦</kbd><b>海星补给</b><p>拾取恢复耐力与怒气，降低自身伤害。</p></div></div><p>冠军之路共五轮、三次机会。最后 30 秒开始涨潮。<br>潮汐乱斗持续缩圈，击败整波对手获得额外时间。<br>时间耗尽时，伤害最低的一方获胜；触屏设备可使用虚拟摇杆。</p><button class="primary" id="close-help">记住了，开钳！</button>`);$('#close-help').onclick=()=>{state=previous;hideDialog();if(previous==='paused'){state=resumeState;pauseGame();}};}
function updateHud(){if(!player)return;$('#player-damage').textContent=Math.floor(player.damage);$('#player-damage').style.color=player.damage>90?'#ff9876':'#fff4d9';$('#stamina-bar').style.width=player.stamina/player.maxStamina*100+'%';$('#stamina-text').textContent=`${Math.floor(player.stamina)} / ${player.maxStamina}`;$('#lives').textContent=mode==='tournament'?Array(Math.max(0,lives)).fill('●').join(' '):mode==='practice'?'∞':`×${knockouts}`;const e=currentEnemy();$('#enemy-name').textContent=e?.name||'等待对手';$('#enemy-damage').textContent=Math.floor(e?.damage||0);$('#enemy-stamina').style.width=(e?.stamina||0)/(e?.maxStamina||100)*100+'%';$('#enemy-title').textContent=mode==='practice'?'静止陪练 · 无限练习':mode==='survival'?`第 ${survivalWave} 波 · 混战中`:rivals[round-1].title;const count=crabs.filter(a=>!a.isPlayer&&a.alive).length;$('#enemy-count').textContent=count>1?`×${count}`:'';$('#round-label').textContent=mode==='practice'?'自由练习':mode==='survival'?`潮汐乱斗 · 第 ${survivalWave} 波`:`冠军之路 · ${String(round).padStart(2,'0')} / 05`;$('#timer').textContent=mode==='practice'?'∞':Math.ceil(clock);$('#timer').style.color=clock<15?'#b74a36':'#153d48';$('#weather-label').textContent=mode==='survival'?'≈ 潮汐正在上涨':round===3?'≈ 湿沙 · 小心打滑':round===4?'≋ 海风 · 向右吹拂':'☀ 晴朗沙滩';$('#rage-number').textContent=Math.floor(player.rage)+'%';$('#rage-bar').style.width=player.rage+'%';$('.rage').classList.toggle('ready',player.rage>=100);if(Math.hypot(player.x,player.z)>ringRadius-1.65&&player.alive){$('#tip-text').textContent='危险！靠近边缘，快回到中央。';$('#tip-icon').textContent='!';}else if(player.rage>=100){$('#tip-text').textContent='怒气已满！靠近对手，按 E 释放潮汐巨钳。';$('#tip-icon').textContent='✦';}else if(mode!=='practice'){$('#tip-text').textContent=player.damage>80?'受击系数很高！防御并寻找海星补给。':'钳击积累伤害，冲刺完成最后一推。';$('#tip-icon').textContent='✦';}}

// Input is shared by keyboard and touch; simulation always runs at 120 Hz.
const blockedKeys=['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
addEventListener('keydown',e=>{if(blockedKeys.includes(e.code))e.preventDefault();if(e.repeat)return;if(e.code==='Escape'){if(state==='help')$('#close-help')?.click();else pauseGame();return;}if(e.code==='Enter'&&state==='menu'){startGame();return;}if(e.code==='KeyM'){$('#sound').click();return;}if(state!=='playing')return;keys.add(e.code);if(e.code==='Space')dash(player);if(e.code==='KeyE')ultimate(player);if(e.code==='KeyJ')attack(player);});
addEventListener('keyup',e=>keys.delete(e.code));
addEventListener('blur',()=>{keys.clear();touch.x=touch.z=0;touch.block=false;if(state==='playing'||state==='countdown')pauseGame();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(state==='playing'||state==='countdown'))pauseGame();});
$('#start').onclick=()=>startGame();$('#pause').onclick=pauseGame;$('#help').onclick=showHelp;$('#sound').onclick=()=>{soundOn=!soundOn;$('#sound').textContent=soundOn?'♪':'♫';$('#sound').style.color=soundOn?'#ffd28a':'';$('#sound').title=soundOn?'关闭声音':'开启声音';$('#sound').setAttribute('aria-label',$('#sound').title);if(soundOn)sound('pickup');toast(soundOn?'声音已开启':'声音已关闭');};
$$('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;$$('[data-mode]').forEach(o=>o.classList.toggle('selected',o===b));$('#start span').textContent=mode==='practice'?'进入练习':mode==='survival'?'挑战潮汐':'开始对战';});
$$('[data-action]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(state!=='playing')return;const action=b.dataset.action;if(action==='block')touch.block=true;if(action==='attack'){keys.add('KeyJ');attack(player);}if(action==='dash')dash(player);if(action==='ult')ultimate(player);});const release=()=>{if(b.dataset.action==='block')touch.block=false;if(b.dataset.action==='attack')keys.delete('KeyJ');};b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release);});
let joyPointer=null;const joy=$('#joystick');function updateJoystick(e){const rect=joy.getBoundingClientRect();let x=e.clientX-rect.left-rect.width/2,y=e.clientY-rect.top-rect.height/2;const l=Math.hypot(x,y);if(l>40){x*=40/l;y*=40/l;}touch.x=x/40;touch.z=y/40;$('#stick').style.transform=`translate(${x}px,${y}px)`;}
joy.addEventListener('pointerdown',e=>{joyPointer=e.pointerId;joy.setPointerCapture(e.pointerId);updateJoystick(e);});joy.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)updateJoystick(e);});function resetJoy(){joyPointer=null;touch.x=touch.z=0;$('#stick').style.transform='';}joy.addEventListener('pointerup',resetJoy);joy.addEventListener('pointercancel',resetJoy);
// Keep focus inside an open dialog, including keyboard-only play.
document.addEventListener('keydown',e=>{if(e.key!=='Tab'||$('#dialog').classList.contains('hidden'))return;const nodes=$$('#dialog button');if(!nodes.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault();}});

function animateActor(a,t,dt){const v=a.visual;v.root.position.set(a.x,a.alive?0:-Math.min(1.6,a.fall*a.fall*4),a.z);const desired=Math.atan2(a.fx,a.fz);a.angle+=Math.atan2(Math.sin(desired-a.angle),Math.cos(desired-a.angle))*Math.min(1,dt*14);v.root.rotation.y=a.angle;
 if(!a.alive){v.root.rotation.x=a.fall*2;v.body.position.y=0;v.marker.visible=false;return;}
 v.root.rotation.x=0;v.marker.visible=true;const speed=Math.hypot(a.vx,a.vz);const idle=state==='menu';v.body.position.y=(idle?Math.sin(t*2+a.aiSeed)*.07:Math.abs(Math.sin(t*14))*Math.min(.08,speed*.014));v.body.rotation.z=Math.sin(t*(speed>1?12:2)+a.aiSeed)*(speed>1?.045:.012);v.body.rotation.x=a.dashTime>0?.18:a.block?-.13:0;
 for(const l of v.legs){l.g.rotation.y=Math.sin(t*(speed>1?14:2)+l.index*1.5+l.side)*Math.min(.32,.04+speed*.04);l.g.rotation.z=Math.cos(t*14+l.index)*Math.min(.14,speed*.025)*l.side;}
 for(const c of v.claws){const atk=a.attackAnim>0?Math.sin(a.attackAnim/.3*Math.PI):0;c.arm.rotation.x=a.block?-.9:-Math.max(0,atk)*.65;c.arm.rotation.y=c.side*(a.block?-.5:Math.max(0,atk)*-.35);c.arm.position.z=.36+Math.max(0,atk)*.25;c.arm.rotation.z=c.side*(idle?Math.sin(t*2)*.09:0);for(let i=0;i<2;i++)c.fingers[i].rotation.y=(i===0?-1:1)*(a.attackAnim>0?.03:idle?.2+Math.sin(t*1.7)*.12:.24);}
 v.shell.material.emissive?.setHex(a.flash>0?0x713522:0x000000);v.marker.material.opacity=a.isPlayer?.8:.3;v.marker.scale.setScalar(a.block?1.16:1);
}
function resize(){const w=$('#canvas-host').clientWidth,h=$('#canvas-host').clientHeight;renderer.setSize(w,h);const view=innerWidth<800?Math.max(27,20/(w/h)):24.7;camera.left=-view*w/h/2;camera.right=view*w/h/2;camera.top=view/2;camera.bottom=-view/2;camera.updateProjectionMatrix();}
addEventListener('resize',resize);resize();setupMenu();$('#loading').classList.add('hidden');
let last=performance.now(),accumulator=0;function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;const t=now/1000;
 if(toastTime>0){toastTime-=dt;if(toastTime<=0)$('#toast').classList.remove('show');}
 if(hitstop>0)hitstop-=dt;else{accumulator+=dt;let steps=0;while(accumulator>=1/120&&steps<7){step(1/120);accumulator-=1/120;steps++;}}
 const menuView=state==='menu'||(state==='help'&&$('#menu').classList.contains('hidden')===false);const target=menuView?(innerWidth<800?new THREE.Vector3(3.5,0,5.7):new THREE.Vector3(-4.5,0,2.5)):new THREE.Vector3(0,0,0);focus.lerp(target,Math.min(1,dt*3));camera.position.copy(focus).add(cameraOffset);camera.lookAt(focus);if(shake>0){shake=Math.max(0,shake-dt);if(!reduced){camera.position.x+=rand(-shake,shake)*.5;camera.position.z+=rand(-shake,shake)*.5;}}
 for(const a of crabs)animateActor(a,t,dt);
 for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.vy-=dt*12;p.mesh.position.x+=p.vx*dt;p.mesh.position.y+=p.vy*dt;p.mesh.position.z+=p.vz*dt;p.mesh.rotation.x+=dt*3;if(p.life<.2)p.mesh.scale.multiplyScalar(.94);if(p.life<=0){scene.remove(p.mesh);particles.splice(i,1);}}
 for(let i=effects.length-1;i>=0;i--){const e=effects[i];e.life-=dt;const fraction=1-e.life/e.max;e.mesh.material.opacity=1-fraction;if(e.float)e.mesh.position.y+=dt*1.3;else e.mesh.scale.setScalar(.2+fraction*e.radius);if(e.life<=0){scene.remove(e.mesh);e.mesh.material.map?.dispose();e.mesh.material.dispose();effects.splice(i,1);}}
 for(const p of pickups){p.group.rotation.y+=dt*.8;p.group.position.y=.5+Math.sin(t*3+p.group.position.x)*.13;}
 waves.forEach((w,i)=>{const f=((t*.17+i*.25)%1);w.scale.setScalar(1+f*.12);w.material.opacity=(1-f)*.25;});flags.forEach((f,i)=>f.rotation.y=Math.sin(t*2+i)*.13);glints.forEach((o,i)=>o.material.opacity=.12+Math.sin(t*1.4+i)*.09);renderer.render(scene,camera);
}
requestAnimationFrame(frame);

// Optional browser agent tools reuse the same game actions. Unsupported browsers ignore them.
const gameSnapshot=()=>({state,mode,round,lives,knockouts,timeRemaining:mode==='practice'?null:Math.ceil(clock),ringRadius:Number(ringRadius.toFixed(2)),player:player?{damage:Math.floor(player.damage),stamina:Math.floor(player.stamina),rage:Math.floor(player.rage),alive:player.alive,x:Number(player.x.toFixed(2)),z:Number(player.z.toFixed(2))}:null,enemies:crabs.filter(a=>!a.isPlayer&&a.alive).map(a=>({name:a.name,damage:Math.floor(a.damage)}))});
if(document.modelContext?.registerTool){const lifecycle=new AbortController();const register=tool=>{try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};register({name:'read_crab_match',description:'Read the current Crab Clash match state, player resources and live opponents.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>gameSnapshot()});register({name:'start_crab_match',description:'Start a new Crab Clash match in a selected mode, resetting the current run.',inputSchema:{type:'object',properties:{mode:{type:'string',enum:['tournament','survival','practice']}},required:['mode'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!input||!['tournament','survival','practice'].includes(input.mode)||Object.keys(input).some(k=>k!=='mode'))throw new Error('Choose tournament, survival, or practice.');startGame(input.mode);return gameSnapshot();}});addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
// A read-only state probe supports repeatable smoke checks without changing gameplay.
window.crabClash={getState:gameSnapshot};
