import * as THREE from './vendor/three.module.js';
import {Pinball,BUMPERS,TARGETS,WALLS,flipperSegment} from './physics.js';

const $=id=>document.getElementById(id), stage=$('stage');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}catch(error){$('loading').textContent='浏览器暂不支持 3D 图形，请开启硬件加速后重试。';throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.24;stage.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x142019,.008);
const camera=new THREE.OrthographicCamera(-10,10,11,-11,.1,100);camera.position.set(0,26,21);camera.lookAt(.2,0,0);
scene.add(new THREE.HemisphereLight(0xdce6c2,0x344631,2.5));
const sun=new THREE.DirectionalLight(0xffe6b1,3.5);sun.position.set(-9,17,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-14;sun.shadow.camera.right=14;sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;sun.shadow.normalBias=.025;sun.shadow.bias=-.0002;scene.add(sun);
const fill=new THREE.DirectionalLight(0x9ad6bc,1.5);fill.position.set(6,9,-7);scene.add(fill);
const world=new THREE.Group();scene.add(world);
const mat=(color,roughness=.65,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const materials={wood:mat(0x795335),woodLight:mat(0xa47749),woodDark:mat(0x3f3022),board:mat(0x314934),rim:mat(0x9aa775,.4),gold:mat(0xdab574,.27,.55),dark:mat(0x20372b),moss:mat(0x586b3b),bark:mat(0x685039),leaf:mat(0x718b50),leafDark:mat(0x3f613e),cream:mat(0xe9d9a7),metal:mat(0xadc1a4,.2,.8),black:mat(0x172822)};
const sphereGeo=new THREE.SphereGeometry(1,20,12), cylGeo=new THREE.CylinderGeometry(1,1,1,14), coneGeo=new THREE.ConeGeometry(1,1,9);
function mesh(geo,m,x=0,y=0,z=0,scale=null,parent=world){const obj=new THREE.Mesh(geo,m);obj.position.set(x,y,z);if(scale)obj.scale.set(...scale);obj.castShadow=true;obj.receiveShadow=true;parent.add(obj);return obj;}
function sphere(x,y,z,s,m,parent=world){return mesh(sphereGeo,m,x,y,z,Array.isArray(s)?s:[s,s,s],parent);}
function cylinder(x,y,z,r,h,m,parent=world){return mesh(cylGeo,m,x,y,z,[r,h,r],parent);}
function beam(ax,ay,az,bx,by,bz,r,m,parent=world){const a=new THREE.Vector3(ax,ay,az),b=new THREE.Vector3(bx,by,bz),v=b.clone().sub(a);const o=mesh(cylGeo,m,0,0,0,[r,v.length(),r],parent);o.position.copy(a.add(b).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return o;}
function tube(points,r,m,parent=world,closed=false){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),closed);return mesh(new THREE.TubeGeometry(curve,Math.max(24,points.length*10),r,6,closed),m,0,0,0,null,parent);}
function roundedSlab(w,d,h,r,y,m){const s=new THREE.Shape();s.moveTo(-w/2+r,-d/2);s.lineTo(w/2-r,-d/2);s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);s.lineTo(w/2,d/2-r);s.quadraticCurveTo(w/2,d/2,w/2-r,d/2);s.lineTo(-w/2+r,d/2);s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);s.lineTo(-w/2,-d/2+r);s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:m!==materials.board,bevelSize:.12,bevelThickness:.1,bevelSegments:3,steps:1,curveSegments:8});g.rotateX(-Math.PI/2);return mesh(g,m,.35,y,.65);}
function line(points,color=0x9aaa72,opacity=.35){const g=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const l=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity}));world.add(l);return l;}
function ring(x,y,z,r,color,width=.024){const m=mat(color,.35,.25);const o=mesh(new THREE.TorusGeometry(r,width,6,64),m,x,y,z);o.rotation.x=-Math.PI/2;return o;}
function label(text,x,y,z,size=1,color='#bac99a',rotation=0){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.font='500 45px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,64);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const o=new THREE.Mesh(new THREE.PlaneGeometry(size*4,size),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,opacity:.72}));o.rotation.set(-Math.PI/2,0,rotation);o.position.set(x,y,z);world.add(o);return o;}
let seed=113;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}

// A carved, raised wood cabinet with a moss-green playfield.
roundedSlab(11.9,20.8,.72,.75,-1.03,materials.woodDark);roundedSlab(11.7,20.5,.48,.68,-.53,materials.wood);roundedSlab(10.9,19.65,.16,.55,-.08,materials.board);
for(let i=0;i<15;i++){const z=-8.8+i*1.32;line([[-4.9,.092,z],[-2,.094,z+.025],[1.6,.094,z-.03],[5.4,.092,z+.01]],0x8a9660,.065);}
for(let i=0;i<7;i++)line([[-5.65,-.25+i*.08,-8.5],[-5.69,-.25+i*.08,4],[-5.25,-.25+i*.08,10]],0xce9b5c,.13);
const border=[[-4.95,.18,8.2],[-5.3,.18,6],[-5.3,.18,-6.8],[-4.15,.18,-8.9],[3.8,.18,-8.9],[6,.18,-6.9],[6,.18,9.4]];
tube(border,.16,materials.gold);tube(border.map(p=>[p[0],p[1]+.2,p[2]]),.12,materials.dark);
for(const w of WALLS){beam(w[0],.22,w[1],w[2],.22,w[3],.115,materials.rim);beam(w[0],.04,w[1],w[2],.04,w[3],.13,materials.dark);}
for(const sign of [-1,1]){tube([[sign*3.4,.12,7.8],[sign*4.25,.12,5.4],[sign*4.4,.12,1],[sign*4.35,.12,-2],[sign*3.5,.12,-6.9],[sign*2,.12,-7.7]],.025,materials.gold);tube([[sign*3.4,.11,7.5],[sign*3.87,.11,4.5],[sign*3.8,.11,1.3]],.033,materials.gold);}
// Distinct launch lane and spring plunger.
for(let i=0;i<13;i++)ring(5.18,.2,7.6+i*.11,.19,0xa2ab90,.04).rotation.x=0;
const plunger=cylinder(5.18,.28,9.8,.22,.8,materials.gold);plunger.rotation.x=Math.PI/2;
sphere(5.18,.28,10.2,[.33,.33,.17],materials.woodLight);
label('LAUNCH',5.15,.12,4.2,.43,'#c5c498',Math.PI/2);
// Inlaid routes, symbols, and a quiet table title.
ring(0,.105,1.4,2.25,0x8a9f70,.018);ring(0,.11,1.4,2.4,0x8a9f70,.009);
for(let i=0;i<12;i++){const a=i*Math.PI/6;line([[Math.cos(a)*2.2,.12,1.4+Math.sin(a)*2.2],[Math.cos(a)*2.34,.12,1.4+Math.sin(a)*2.34]],0xaabb7b,.5);}
label('M O S S W O O D',0,.115,2.85,1.05,'#c2c79c');label('FOREST ARCADE',0,.116,3.5,.47,'#c2c79c');label('✧',0,.13,4.3,.7,'#e5cf97');
for(const [x,z] of [[-3.8,-1.2],[3.8,-1.3],[-2.4,4.1],[2.4,4.1]]){label('×',x,.12,z,.45,'#c9c798');}
for(let i=0;i<26;i++){const a=rand()*Math.PI*2,r=rand()*1.25;const x=Math.cos(a)*r,z=1.4+Math.sin(a)*r;if(z<.8)continue;sphere(x,.12,z,.022,materials.gold);}

const mushrooms=[];
function mushroom(x,z,r,color,y=0,parent=world){const group=new THREE.Group();group.position.set(x,y,z);parent.add(group);cylinder(0,.32,0,r*.29,.62,materials.cream,group);cylinder(0,.1,0,r*.81,.17,materials.gold,group);const capMat=new THREE.MeshStandardMaterial({color,roughness:.4,metalness:.12,emissive:color,emissiveIntensity:.08});const cap=mesh(new THREE.SphereGeometry(r,24,14,0,Math.PI*2,0,Math.PI*.56),capMat,0,.56,0,[1,.53,1],group);cylinder(0,.5,0,r*.9,.07,materials.cream,group);
  for(let i=0;i<8;i++){const a=i*2.4,rr=r*(i===0?.13:.52+rand()*.2);sphere(Math.cos(a)*rr,.58+Math.sqrt(Math.max(0,1-(rr/r)**2))*r*.5,Math.sin(a)*rr,[r*.095,r*.024,r*.082],materials.cream,group);}
  return {group,cap,mat:capMat,hit:0};}
for(const b of BUMPERS){const m=mushroom(b.x,b.z,b.r,b.color);mushrooms.push(m);ring(b.x,.12,b.z,b.r+.21,0xb9bc88,.026);}
// Miniature forest around the table. Geometry is part of the playable 3D scene.
function tree(x,z,h=3.2){const g=new THREE.Group();g.position.set(x,-.1,z);world.add(g);cylinder(0,h*.3,0,.27,h*.6,materials.bark,g);for(let j=0;j<3;j++){const o=mesh(coneGeo,j%2?materials.leaf:materials.leafDark,0,h*(.51+j*.19),0,[h*(.28-j*.047),h*.58,h*(.28-j*.047)],g);o.rotation.y=j*.7;}for(let j=0;j<3;j++){const a=j*2.1;beam(0,.2,0,Math.cos(a)*.65,0,Math.sin(a)*.65,.14,materials.bark,g);}return g;}
for(const t of [[-5.25,-7.6,3.1],[-4.1,-9,3.8],[-2.7,-9.1,2.9],[3.1,-9.1,3.8],[4.5,-8.8,3.2],[5.5,-7.8,2.6],[-5.6,-2,2.1]])tree(...t);
for(let i=0;i<34;i++){const side=i%2===0?-1:1,x=side*(5.5+rand()*.35)+(side===1?.2:0),z=-8+rand()*17;sphere(x,-.005,z,[.19+rand()*.37,.17+rand()*.13,.23+rand()*.36],i%3===0?materials.moss:materials.leafDark);}
for(const [x,z,r,c] of [[-5.7,6.5,.44,0xd9bb87],[-5.45,7.3,.3,0xc29469],[5.95,4.6,.39,0xa3bc8d],[-5.7,-4.2,.35,0xd4ba83],[4.9,-8.5,.39,0xb9c491]])mushroom(x,z,r,c);
function fern(x,z,s=1){for(let i=0;i<5;i++){const a=i*.65-1.3;const tx=x+Math.sin(a)*s*.7,tz=z+Math.cos(a)*s*.6;beam(x,.02,z,tx,.4*s,tz,.024,materials.leaf);for(let k=1;k<4;k++){const t=k/4;const px=x+(tx-x)*t,pz=z+(tz-z)*t;for(const side of [-1,1]){const o=sphere(px+side*.1*s,.4*s*t,pz,[.24*s,.035*s,.085*s],materials.leaf);o.rotation.y=-a+side*.5;}}}}
for(const a of [[-4.65,5,.65],[4.3,6.6,.7],[-5.7,.5,.8],[-3.8,-7,.7],[3.9,-7.5,.7]])fern(...a);
// The old tree gate is a jackpot sensor in the physics world.
const archPoints=[[-1.4,.13,-7.65],[-1.45,1.2,-7.65],[-1.1,2.05,-7.65],[0,2.42,-7.65],[1.1,2.05,-7.65],[1.45,1.2,-7.65],[1.4,.13,-7.65]];
tube(archPoints,.23,materials.bark);tube(archPoints.map(p=>[p[0],p[1]-.05,p[2]+.16]),.045,materials.gold);for(let i=0;i<10;i++){const a=i/9*Math.PI;sphere(Math.cos(a)*1.52,Math.sin(a)*1.6+.75,-7.65,[.32,.2,.27],i%2?materials.leaf:materials.moss);}
label('J A C K P O T',0,.15,-7.75,.57,'#dfc69a');
const targetModels=[];for(let i=0;i<3;i++){const t=TARGETS[i];const g=new THREE.Group();g.position.set(t.x,.03,t.z);world.add(g);cylinder(0,.16,0,.43,.3,materials.woodDark,g);cylinder(0,.32,0,.37,.06,materials.gold,g);const tm=new THREE.MeshStandardMaterial({color:0xe1bb69,emissive:0xffbe50,emissiveIntensity:.28,roughness:.2,metalness:.25});const crystal=mesh(new THREE.OctahedronGeometry(.32),tm,0,.68,0,[.75,1.5,.75],g);ring(t.x,.13,t.z,.63,0xd4b576,.026);label(['I','II','III'][i],t.x,.15,t.z+.85,.45,'#d7cd99');targetModels.push({group:g,crystal,mat:tm});}

const flipperModels=[],beetles=[];
function beetle(x,z,side){const g=new THREE.Group();g.position.set(x,.18,z);g.rotation.y=side*.3;world.add(g);const shell=mat(side<0?0x748f64:0x5c8c7e,.22,.5);sphere(0,.3,0,[.53,.33,.68],materials.black,g);for(const s of [-1,1])sphere(s*.18,.43,.04,[.28,.25,.56],shell,g);sphere(0,.35,-.58,[.31,.27,.26],materials.dark,g);for(const s of [-1,1]){sphere(s*.18,.47,-.78,.065,materials.gold,g);tube([[s*.16,.45,-.7],[s*.33,.66,-.93],[s*.3,.8,-1.02]],.035,materials.gold,g);for(let j=0;j<3;j++)tube([[s*.34,.3,-.3+j*.3],[s*.71,.18,-.5+j*.42],[s*.76,.04,-.42+j*.45]],.043,materials.woodDark,g);}return g;}
for(let i=0;i<2;i++){const g=new THREE.Group();world.add(g);const length=2.38;beam(0,.32,0,length,.32,0,.24,materials.gold,g);beam(.08,.39,0,length-.12,.39,0,.16,materials.woodLight,g);sphere(0,.32,0,.28,materials.gold,g);sphere(length,.32,0,.235,materials.gold,g);cylinder(0,.45,0,.18,.1,materials.dark,g);flipperModels.push(g);beetles.push(beetle(i===0?-3.1:3.1,7.6,i===0?-1:1));}
// Tiny star lights, animated gently above the canopy.
const fireflies=[];const lightMat=new THREE.MeshBasicMaterial({color:0xe4ef9d});for(let i=0;i<34;i++){const x=(rand()-.5)*13,z=(rand()-.5)*20,y=.9+rand()*3;const o=sphere(x,y,z,.025+rand()*.027,lightMat);o.castShadow=false;fireflies.push({o,x,y,z,size:o.scale.x,phase:rand()*6.28});}
const sparkGeo=new THREE.IcosahedronGeometry(.055,0);const sparks=[];const ballModels=new Map();const ballMaterial=new THREE.MeshStandardMaterial({color:0xf0d795,metalness:.78,roughness:.12,emissive:0x8f6220,emissiveIntensity:.32});
let toastTimer=0,popTimer=0,shake=0,audioContext=null,soundEnabled=false,best=0,uiTicks=0;
function loadBest(mode){try{return Number(localStorage.getItem('mosswood-best-'+mode))||0;}catch{return 0;}}
function saveBest(){if(game.score<=best)return;best=game.score;try{localStorage.setItem('mosswood-best-'+game.mode,String(best));}catch{}}
function tone(freq=440,duration=.1,type='sine',vol=.035){if(!soundEnabled)return;try{if(!audioContext)audioContext=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const o=audioContext.createOscillator(),gain=audioContext.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioContext.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(60,freq*.65),audioContext.currentTime+duration);gain.gain.setValueAtTime(vol,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+duration);o.connect(gain);gain.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+duration);}catch{}}
function notify(text,seconds=2.3){$('toast').textContent=text;$('toast').classList.add('show');toastTimer=seconds;}
function burst(x,z,color=0xdfe6a3,count=12){if(reduced)return;for(let i=0;i<count;i++){if(sparks.length>170){const old=sparks.shift();world.remove(old.o);old.o.material.dispose();}const m=new THREE.MeshBasicMaterial({color,transparent:true});const o=mesh(sparkGeo,m,x,.7,z);sparks.push({o,vx:(Math.random()-.5)*5,vy:2+Math.random()*4,vz:(Math.random()-.5)*5,life:1});}}
function onEvent(e){switch(e.type){case'balladd':{const g=new THREE.Group();world.add(g);sphere(0,.3,0,.25,ballMaterial,g);const halo=ring(0,.13,0,.34,0xe6d09b,.016);g.add(halo);const history=[];for(let i=0;i<8;i++){const m=new THREE.MeshBasicMaterial({color:0xe9d692,transparent:true,opacity:(1-i/8)*.2});const dot=sphere(e.ball.x,.22,e.ball.z,.11*(1-i/9),m);dot.visible=false;history.push(dot);}ballModels.set(e.ball.id,{g,history});break;}
  case'ballremove':{const m=ballModels.get(e.id);if(m){world.remove(m.g);for(const d of m.history){world.remove(d);d.material.dispose();}ballModels.delete(e.id);}break;}
  case'reset':break;
  case'launch':tone(210,.24,'triangle',.07);notify('弹珠出发！发球保护已开启',1.6);break;
  case'score':if(e.multiplier>1){$('combo-pop').textContent='+'+e.points+'  ×'+e.multiplier;$('combo-pop').classList.add('show');popTimer=.6;}break;
  case'bumper':mushrooms[e.index].hit=1;burst(e.x,e.z,BUMPERS[e.index].color,10);tone(420+e.index*105,.18,'sine',.075);break;
  case'target':burst(TARGETS[e.index].x,TARGETS[e.index].z,0xe3b66d,18);tone(700+e.index*150,.25,'sine',.065);notify('琥珀机关 '+['Ⅰ','Ⅱ','Ⅲ'][e.index]+' 已点亮');break;
  case'multiball':notify('萤火狂欢！三球齐发 · 古树门大奖开启',3.5);tone(880,.6,'triangle',.07);shake=.25;burst(0,-5,0xe4e9a2,40);break;
  case'multiend':notify('多球狂欢结束，继续点亮森林');break;
  case'gate':notify(e.jackpot?'古树大奖！+2,500 × 倍率':'穿越古树门！+500 × 倍率');burst(0,-7,0xf0d28f,25);tone(e.jackpot?1200:680,.35,'triangle',.065);break;
  case'flipperhit':tone(150,.07,'triangle',.09);break;
  case'nudge':shake=.3;tone(90,.15,'triangle',.065);break;
  case'tilt':shake=.5;notify('球台倾斜！挡板暂时失灵 3 秒',3);tone(65,.65,'sawtooth',.028);break;
  case'saved':notify('叶片守护！弹珠免费返回');tone(590,.22,'sine',.06);break;
  case'drain':notify('别灰心，下一颗弹珠已经就位。');tone(140,.4,'sine',.04);break;
  case'gameover':saveBest();$('end-title').textContent=game.score>=best&&game.score>0?'新的森林纪录！':'这次冒险，很精彩。';$('end-score').textContent=game.score.toLocaleString();$('end-stats').textContent=`有效碰撞 ${game.hitCount} 次 · 最高倍率 ×${game.maxCombo} · 多球狂欢 ${game.multiCount} 次`;$('end-overlay').hidden=false;notify('冒险结束，森林期待你再次到来。');break;
  case'unstuck':notify('森林轻轻帮了你一把。');break;
}}
const game=new Pinball(onEvent);best=loadBest('classic');
function togglePause(){if(game.state==='paused'){game.resume();$('pause-overlay').hidden=true;$('pause').textContent='Ⅱ';$('pause').setAttribute('aria-label','暂停游戏');}else if(game.state!=='gameover'){game.pause();$('pause-overlay').hidden=false;$('pause').textContent='▷';$('pause').setAttribute('aria-label','继续游戏');}renderUI();}
let chargePointer=null,helpPaused=false;
function chargeStart(){if(game.startCharge()){tone(220,.06,'sine',.02);renderUI();}}
function chargeEnd(){game.launch();renderUI();}
$('launch').addEventListener('pointerdown',e=>{e.preventDefault();chargePointer=e.pointerId;$('launch').setPointerCapture(e.pointerId);chargeStart();});
$('launch').addEventListener('pointerup',e=>{if(e.pointerId===chargePointer){chargePointer=null;chargeEnd();}});
$('launch').addEventListener('pointercancel',()=>{chargePointer=null;game.charging=false;game.charge=0;});
$('launch').addEventListener('click',e=>{if(e.detail===0){chargeStart();game.charge=.6;chargeEnd();}});
for(const [id,side] of [['touch-left',0],['touch-right',1]]){const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();el.setPointerCapture(e.pointerId);game.setFlipper(side,true);});for(const ev of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(ev,()=>game.setFlipper(side,false));}
$('touch-nudge').addEventListener('click',()=>game.nudge());
document.addEventListener('keydown',e=>{if($('help-dialog').open)return;const relevant=['ArrowLeft','ArrowRight','KeyA','KeyD','Space','KeyP','KeyX'];if(!relevant.includes(e.code))return;if(e.target instanceof HTMLButtonElement&&e.code==='Space')return;e.preventDefault();if(e.repeat)return;if(e.code==='ArrowLeft'||e.code==='KeyA')game.setFlipper(0,true);if(e.code==='ArrowRight'||e.code==='KeyD')game.setFlipper(1,true);if(e.code==='Space')chargeStart();if(e.code==='KeyX')game.nudge();if(e.code==='KeyP')togglePause();});
document.addEventListener('keyup',e=>{if(e.code==='ArrowLeft'||e.code==='KeyA')game.setFlipper(0,false);if(e.code==='ArrowRight'||e.code==='KeyD')game.setFlipper(1,false);if(e.code==='Space'){e.preventDefault();chargeEnd();}});
function backgroundPause(){game.clearInput();chargePointer=null;if(game.state==='playing')togglePause();}
window.addEventListener('blur',backgroundPause);document.addEventListener('visibilitychange',()=>{if(document.hidden)backgroundPause();});
$('pause').addEventListener('click',togglePause);$('resume').addEventListener('click',togglePause);$('restart').addEventListener('click',()=>reset());
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.mode!==game.mode)reset(b.dataset.mode);}));
$('sound').addEventListener('click',()=>{soundEnabled=!soundEnabled;$('sound').setAttribute('aria-label',soundEnabled?'关闭声音':'开启声音');$('sound').title=soundEnabled?'关闭声音':'开启声音';$('sound').querySelector('i').hidden=soundEnabled;tone(620,.16);});
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{notify('当前浏览器不支持全屏');}});
$('help').addEventListener('click',()=>{helpPaused=game.state!=='paused'&&game.state!=='gameover';if(helpPaused)game.pause();$('help-dialog').showModal();});
function closeHelp(){if($('help-dialog').open)$('help-dialog').close();}
$('help-dialog').addEventListener('close',()=>{if(helpPaused)game.resume();helpPaused=false;renderUI();});$('close-help').addEventListener('click',closeHelp);$('help-play').addEventListener('click',closeHelp);

function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);const aspect=w/h,halfH=Math.max(10.65,6.65/aspect);camera.left=-halfH*aspect;camera.right=halfH*aspect;camera.top=halfH;camera.bottom=-halfH;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(stage);resize();
let previous=performance.now(),accumulator=0,visualTime=0;
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-previous)/1000,.08);previous=now;const active=game.state!=='paused'&&game.state!=='gameover';if(active){accumulator+=dt;let steps=0;while(accumulator>=1/120&&steps<12){game.step(1/120);accumulator-=1/120;steps++;}visualTime+=dt;}else accumulator=0;
  for(let i=0;i<2;i++){const f=flipperSegment(i,game.flippers[i]);flipperModels[i].position.set(f.ax,0,f.az);flipperModels[i].rotation.y=-Math.atan2(f.bz-f.az,f.bx-f.ax);beetles[i].rotation.z=(i===0?-1:1)*game.flippers[i]*.2;beetles[i].position.y=.18+game.flippers[i]*.08;}
  for(const b of game.balls){const m=ballModels.get(b.id);if(!m)continue;m.g.position.set(b.x,0,b.z);m.g.children[0].rotation.x+=b.vz*dt;m.g.children[0].rotation.z-=b.vx*dt;for(let i=m.history.length-1;i>0;i--)m.history[i].position.lerp(m.history[i-1].position,.5);m.history[0].position.set(b.x,.22,b.z);for(const dot of m.history)dot.visible=!b.waiting&&!reduced;}
  for(const m of mushrooms){if(active)m.hit=Math.max(0,m.hit-dt*3.6);m.group.scale.y=1-m.hit*.2;m.cap.scale.x=1+m.hit*.1;m.cap.scale.z=1+m.hit*.1;m.mat.emissiveIntensity=.08+m.hit*.9;}
  for(let i=0;i<targetModels.length;i++){const m=targetModels[i];m.crystal.rotation.y=visualTime*.4;m.crystal.position.y=.68+Math.sin(visualTime*2+i)*.05;m.mat.emissiveIntensity=game.targets[i]?1.8:.28;}
  if(!reduced){for(const f of fireflies){f.o.position.set(f.x+Math.sin(visualTime*.45+f.phase)*.3,f.y+Math.sin(visualTime*.8+f.phase)*.3,f.z+Math.cos(visualTime*.3+f.phase)*.2);f.o.scale.setScalar(f.size*(.8+Math.sin(visualTime*2+f.phase)*.3));}}
  for(let i=sparks.length-1;i>=0;i--){const p=sparks[i];if(active){p.life-=dt*1.5;p.vy-=dt*7;p.o.position.x+=p.vx*dt;p.o.position.y+=p.vy*dt;p.o.position.z+=p.vz*dt;p.o.material.opacity=Math.max(0,p.life);}if(p.life<=0){world.remove(p.o);p.o.material.dispose();sparks.splice(i,1);}}
  plunger.position.z=9.8+game.charge*.5;if(shake>0){shake=Math.max(0,shake-dt*2);world.position.x=reduced?0:Math.sin(now*.08)*shake*.25;}else world.position.x=0;
  if(active){toastTimer-=dt;popTimer-=dt;}if(toastTimer<=0)$('toast').classList.remove('show');if(popTimer<=0)$('combo-pop').classList.remove('show');uiTicks+=dt;if(uiTicks>.065){renderUI();uiTicks=0;}renderer.render(scene,camera);
}
renderUI();$('loading').hidden=true;$('loading').style.display='none';requestAnimationFrame(animate);

// All optional agent actions share the same game methods as the visible controls.
const api={getState:()=>game.snapshot(),start:(mode='classic')=>{if(!['classic','sprint'].includes(mode))throw new Error('Unknown mode');reset(mode);return game.snapshot();},launch:(power=.65)=>{if(typeof power!=='number'||!Number.isFinite(power)||power<0||power>1)throw new Error('Power must be between 0 and 1');if(!game.startCharge())throw new Error('No ball is ready to launch');game.charge=power;game.launch();renderUI();return game.snapshot();},pause:()=>{if(game.state!=='paused')togglePause();return game.snapshot();}};
window.beetleBounce=Object.freeze(api);
if(document.modelContext?.registerTool){const lifecycle=new AbortController();const definitions=[{name:'get_pinball_state',description:'Read the current forest pinball score, mode, balls, mission and game state.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>api.getState()},{name:'start_pinball_game',description:'Start a fresh forest pinball game, resetting the current score.',inputSchema:{type:'object',properties:{mode:{type:'string',enum:['classic','sprint']}},required:['mode'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>api.start(input.mode)},{name:'launch_pinball',description:'Launch the waiting pinball at the chosen power. Fails if a ball is not ready.',inputSchema:{type:'object',properties:{power:{type:'number',minimum:0,maximum:1}},required:['power'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>api.launch(input.power)}];for(const definition of definitions){try{Promise.resolve(document.modelContext.registerTool(definition,{signal:lifecycle.signal})).catch(()=>{});}catch{}}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
function reset(mode=game.mode){popTimer=0;$('combo-pop').classList.remove('show');for(const p of sparks){world.remove(p.o);p.o.material.dispose();}sparks.length=0;for(const [id,m] of ballModels){world.remove(m.g);for(const d of m.history){world.remove(d);d.material.dispose();}}ballModels.clear();game.reset(mode);best=loadBest(mode);$('end-overlay').hidden=true;$('pause-overlay').hidden=true;$('pause').textContent='Ⅱ';$('pause').setAttribute('aria-label','暂停游戏');document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('selected',b.dataset.mode===mode));notify(mode==='sprint'?'90 秒竞速 · 发射后开始计时':'经典三球 · 按住蓄力，松开发射');renderUI();}
function renderUI(){saveBest();$('score').textContent=String(game.score).padStart(6,'0');$('best').textContent=String(best).padStart(6,'0');$('multiplier').textContent='×'+game.multiplier;$('combo-fill').style.width=(Math.max(0,game.comboUntil-game.time)/3*100)+'%';$('combo-label').textContent=game.multiplier>1?`${game.combo} 连击 · 继续命中，保持倍率`:'让弹珠在不同蘑菇间跳跃';$('mission-progress').textContent=game.targets.filter(Boolean).length+' / 3 已点亮';$('mission-title').textContent=game.multiball?'萤火狂欢进行中':'点亮萤火之森';for(let i=0;i<3;i++)$('target-'+i).classList.toggle('lit',game.targets[i]);const waiting=game.balls.some(b=>b.waiting);$('launch').disabled=!waiting||game.state==='paused'||game.state==='gameover';$('launch-text').textContent=game.charging?'蓄力中…':waiting?'发射弹珠':game.multiball?'多球狂欢':'弹珠冒险中';$('launch-hint').textContent=waiting?'按住蓄力，松开发射':'用 A / D 操纵甲虫挡板';$('charge-value').textContent=Math.round(game.charge*100)+'%';$('charge-fill').style.width=(game.charge*100)+'%';$('state-label').textContent=game.state==='paused'?'暂停中':game.state==='gameover'?'冒险完成':game.time<game.tiltUntil?'球台倾斜':game.multiball?'萤火狂欢 · '+game.balls.length+' 球':waiting?'等待发射':'冒险进行中';$('ball-label').textContent=game.mode==='sprint'?'剩余时间':'剩余弹珠';$('ball-current').textContent=game.mode==='sprint'?String(Math.ceil(game.remaining)).padStart(2,'0'):String(Math.min(3,4-game.lives)).padStart(2,'0');$('ball-total').textContent=game.mode==='sprint'?' 秒':' / 03';const dots=document.querySelectorAll('.ball-indicators i');dots.forEach((d,i)=>d.classList.toggle('active',i<game.lives));document.querySelector('.ball-indicators').style.display=game.mode==='sprint'?'none':'';document.querySelector('.ball-count').classList.toggle('sprint-clock',game.mode==='sprint');const save=game.balls.some(b=>!b.waiting&&b.saveUntil>game.time);$('save-status').textContent=waiting?'发球后 5 秒保护':save?'叶片守护中':'每一次反弹，都有新可能';document.querySelectorAll('.nudge-meter i').forEach((el,i)=>el.classList.toggle('hot',game.nudgeHeat>i+.25));$('nudge-label').textContent=game.time<game.tiltUntil?'倾斜中 · 挡板暂时失灵':'小心，过度震台会倾斜';}
