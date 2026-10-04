import * as THREE from 'three';

const $ = (s) => document.querySelector(s);
const icons = {
 sound:'<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
 mute:'<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 5 6m0-6-5 6"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .5-1.5 1-1.5 3m0 2v1"/>',
 settings:'<path d="m9 3-1 3-3 1-2 3 2 2-1 3 3 2 3-1 2 3 3-1 1-3 3-1 1-3-2-2 1-3-3-2-3 1-2-2Z"/><circle cx="11" cy="11" r="3"/>',
 pause:'<path d="M9 5v14M15 5v14"/>'
};
for (const [id,name] of [['sound','mute'],['help','help'],['settings','settings'],['pause','pause']]) $('#'+id).innerHTML='<svg viewBox="0 0 24 24">'+icons[name]+'</svg>';
const container = $('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#273444');
scene.fog = new THREE.FogExp2('#283646', .013);
const camera = new THREE.PerspectiveCamera(39,1,.1,150);
const renderer = new THREE.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.35;
container.appendChild(renderer.domElement);
const ambient=new THREE.HemisphereLight('#c3d1ff','#414d47',2.2);scene.add(ambient);
const sun=new THREE.DirectionalLight('#ffe1b9',3.8);sun.position.set(-12,30,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-28;sun.shadow.camera.right=28;sun.shadow.camera.top=28;sun.shadow.camera.bottom=-28;sun.shadow.normalBias=.03;scene.add(sun);
const rim=new THREE.DirectionalLight('#ab92ff',2.6);rim.position.set(20,10,-18);scene.add(rim);
const world = new THREE.Group();scene.add(world);
const obstacles=[], props=[], stars=[], hunters=[], hiders=[], effects=[];
let role='hider',phase='lobby',remaining=120,health=100,energy=100,candies=0,caught=0,disguise=null,elapsed=0,grace=6,smokeUntil=0,invincible=0,decoy=null,cooldowns={e:0,space:0},difficulty='normal',audioOn=false,audioCtx=null,gameId=0;
let cameraAngle=Math.PI/4,zoom=1,drag=null,moving=false,toastTime=0,pausedByModal=false;
const keys=new Set(),clock=new THREE.Clock();
const materialCache=new Map();
function mat(color,emissive=false){const key=color+emissive;if(!materialCache.has(key))materialCache.set(key,new THREE.MeshStandardMaterial({color,roughness:.83,metalness:.05,emissive:emissive?color:0,emissiveIntensity:emissive?.45:0}));return materialCache.get(key);}
function box(w,h,d,color,x=0,y=0,z=0,parent=world){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function cyl(r,rb,h,color,x=0,y=0,z=0,parent=world,n=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,rb,h,n),mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function sphere(r,color,x,y,z,parent=world,detail=1){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,detail),mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
function addObstacle(x,z,w,d){obstacles.push({x,z,w:w/2,d:d/2});}
function textSign(text,w,h,color='#cfffa4',bg='#263c3e'){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const c=canvas.getContext('2d');c.fillStyle=bg;c.fillRect(0,0,512,128);c.strokeStyle=color;c.lineWidth=6;c.strokeRect(9,9,494,110);c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';c.font='bold 63px sans-serif';c.fillText(text,256,68);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture}));}
// A compact, walkable city with two crossing streets and a central plaza.
box(44,.9,39,'#263c42',0,-.7,0);box(43.8,.12,38.8,'#52676a',0,-.2,0);
box(8,.03,38.5,'#35444f',0,-.12,0);box(43.6,.03,6.2,'#35444f',0,-.1,2);
for(let z=-17;z<=17;z+=3)if(z<-2||z>7)box(.10,.02,1.2,'#a5b5aa',0,-.075,z);
for(let x=-20;x<=20;x+=3)if(Math.abs(x)>5)box(1.2,.02,.10,'#a5b5aa',x,-.07,2);
for(const z of [-2.1,6.1])for(let x=-2.8;x<=2.8;x+=.82)box(.43,.025,1.5,'#d6d5bc',x,-.045,z);
for(const x of [-5.1,5.1])for(let z=.2;z<=3.8;z+=.8)box(1.5,.025,.4,'#d6d5bc',x,-.045,z);
// Raised sidewalks, curb stones and paving.
for(const [x,z,w,d] of [[-12,-9,15,12],[12,-9,15,12],[-12,12,15,10],[12,12,15,10]]){
 box(w,.28,d,'#83908a',x,-.035,z);box(w-.28,.08,d-.28,'#7b8b86',x,.14,z);
 for(let px=x-w/2+.4;px<x+w/2;px+=1.8)box(.025,.008,d-.2,'#637c76',px,.187,z);
 for(let pz=z-d/2+.4;pz<z+d/2;pz+=1.8)box(w-.2,.008,.025,'#637c76',x,.188,pz);
}
function building(x,z,w,d,h,color,name,signColor){
 const g=new THREE.Group();g.position.set(x,0,z);world.add(g);
 box(w,h,d,color,0,h/2,0,g);box(w+.25,.22,d+.25,'#c1c4b1',0,h+.1,0,g);box(w+.35,.18,d+.35,'#5e7c75',0,1.95,0,g);
 box(w-.45,.45,d-.45,'#6e8e89',0,h+.34,0,g);
 box(1.1,.6,.8,'#879b97',-.7,h+.76,0,g);box(.8,.2,.6,'#536e73',-.7,h+1.15,0,g);
 for(let y=2.7;y<h-.5;y+=1.4){for(let xx=-w/2+.75;xx<w/2-.4;xx+=1.35){box(.68,.82,.08,'#344a54',xx,y,d/2+.05,g);const win=box(.51,.63,.025,'#efd79b',xx,y,d/2+.10,g);win.material=mat('#efd79b',true);box(.8,.1,.18,'#b3bba9',xx,y-.46,d/2+.1,g);}for(let zz=-d/2+.8;zz<d/2-.4;zz+=1.45){box(.06,.85,.69,'#38535a',w/2+.02,y,zz,g);box(.03,.61,.48,'#d4dbb5',w/2+.06,y,zz,g);}}
 for(let xx=-w/2+.65;xx<w/2-.5;xx+=1.2){box(.95,1.25,.05,'#334e50',xx,.81,d/2+.04,g);box(.7,.9,.02,'#b0caa8',xx,.84,d/2+.085,g);}
 box(.8,1.65,.10,'#304e4e',.2,.94,d/2+.08,g);box(.05,.12,.08,'#e8c97d',.43,1,d/2+.16,g);
 const sign=textSign(name,w*.78,.59,signColor);sign.position.set(0,2.05,d/2+.18);g.add(sign);
 for(let xx=-w/2+.15;xx<w/2;xx+=.45){const a=box(.44,.12,1.08,(Math.round((xx+w/2)/.45)%2===0)?'#d3be9a':signColor,xx,1.62,d/2+.5,g);a.rotation.x=.14;}
 addObstacle(x,z,w+.3,d+.3);return g;
}
building(-10,-10,5,4.6,6.6,'#879585','MINT MART','#d4f2aa');
building(-16.8,-10.9,5,6,8.3,'#68798e','STAY CURIOUS','#d4c5ed');
building(9,-10.8,6,5.2,8.4,'#b09787','MOON CAFE','#f1c396');
building(16.7,-11.9,5.3,6.3,10.5,'#8494a3','Z Z Z','#d7c5ea');
building(-17,12.7,5,5.3,4.5,'#bd9d8d','BLOOM','#f0c7c1');
building(17,13.3,5.3,4.4,5.4,'#7e9c9a','24 / 7','#bce6b3');
// Pocket park.
box(8.6,.19,7.2,'#557769',-9.8,12,.0); // corrected below, park is placed explicitly
world.remove(world.children[world.children.length-1]);
box(8.6,.16,7.2,'#608a6b',-9.8,.25,12);box(1.5,.04,7,'#bcc0a0',-9.8,.35,12);
function tree(x,z,scale=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);world.add(g);cyl(.14,.22,1.7,'#7a6855',0,.9,0,g,7);sphere(.9,'#739a73',0,2,0,g,0);sphere(.7,'#85af81',.4,2.55,.1,g,0);sphere(.65,'#668969',-.45,2.4,0,g,0);addObstacle(x,z,.65,.65);return g;}
for(const p of [[-12.5,9],[-7.1,14.5],[-12.5,15],[-19.7,-4.3],[-6.8,-5.4],[6.1,-4.5],[19.5,-5],[13,9],[19,8],[-19,8],[-5.2,10],[-5.2,-15]])tree(...p,1.05);
// Fountain courtyard to the south east.
box(7,.15,6.5,'#adac95',9.5,.25,11.6);cyl(2.25,2.45,.48,'#a4b4ac',9.4,.58,11.7,world,24);cyl(2.04,2.04,.05,'#72bac1',9.4,.86,11.7,world,24);cyl(.35,.55,1.3,'#c3c4ac',9.4,1.18,11.7);cyl(.9,1,.18,'#b6c7b8',9.4,1.9,11.7);sphere(.37,'#a2e6d8',9.4,2.28,11.7);addObstacle(9.4,11.7,4.5,4.5);
for(let i=0;i<8;i++){const a=i*Math.PI/4;const water=cyl(.026,.026,1.2,'#a9e7df',9.4+Math.cos(a)*.65,1.35,11.7+Math.sin(a)*.65);water.rotation.z=Math.cos(a)*.22;water.rotation.x=Math.sin(a)*.22;}
function lamp(x,z){cyl(.06,.11,3.1,'#364851',x,1.6,z);box(.72,.12,.45,'#3d5058',x,3.25,z);const light=box(.55,.07,.32,'#ffe5a1',x,3.18,z);light.material=mat('#ffe5a1',true);const p=new THREE.PointLight('#ffdca1',3,5,2);p.position.set(x,2.9,z);world.add(p);}
for(const p of [[-4.5,-4.2],[4.6,-4.2],[-4.6,7],[4.6,7],[-19.7,5.6],[19.5,5.7]])lamp(...p);
function makeProp(type,x,z,add=true){const g=new THREE.Group();g.position.set(x,.21,z);world.add(g);
 if(type==='cone'){box(.75,.09,.75,'#c48166',0,.03,0,g);cyl(.07,.32,.75,'#eab28a',0,.44,0,g,8);cyl(.15,.23,.21,'#f5e7c7',0,.46,0,g,8);}
 if(type==='bin'){cyl(.36,.33,.87,'#668c7b',0,.44,0,g,10);cyl(.4,.4,.12,'#a1baa0',0,.92,0,g);box(.35,.19,.04,'#344f50',0,.69,.34,g);for(let i=0;i<8;i++){let a=i*Math.PI/4;box(.05,.67,.05,'#456e66',Math.cos(a)*.34,.44,Math.sin(a)*.34,g);}}
 if(type==='mail'){box(.56,1.1,.55,'#8396bb',0,.58,0,g);cyl(.28,.28,.55,'#a1b3ce',0,1.13,0,g).rotation.z=Math.PI/2;box(.37,.09,.02,'#3b4963',0,.99,.285,g);box(.25,.22,.02,'#d7d9bd',0,.58,.285,g);}
 if(type==='plant'){cyl(.4,.28,.55,'#be997f',0,.28,0,g,7);sphere(.54,'#88ac75',0,.94,0,g,0);sphere(.31,'#b6cb8b',.22,1.26,.1,g,0);}
 if(add)props.push({type,x,z,mesh:g});return g;
}
const propLocations=[['cone',-2.8,5.6],['cone',-3.1,7.1],['bin',-5.1,-3.3],['mail',5.2,-5.8],['plant',-7,-7],['bin',-13,-5.1],['cone',12,5.7],['mail',-14.5,8.1],['plant',13.8,-6.8],['bin',18.8,10.6],['cone',2.6,-11],['plant',6.3,15.7],['mail',-5.5,15.5],['bin',6.1,8.2],['plant',-19,10],['cone',17,-4],['mail',-8.1,-14.1],['plant',-6.3,8.1]];
propLocations.forEach(p=>makeProp(...p));
const propNames={cone:'路锥',bin:'垃圾桶',mail:'邮筒',plant:'盆栽'};
function bench(x,z,rot=0){const g=new THREE.Group();g.position.set(x,.2,z);g.rotation.y=rot;world.add(g);for(let i=0;i<3;i++)box(1.9,.09,.17,'#c0a37c',0,.52,(i-1)*.21,g);for(let i=0;i<2;i++)box(1.9,.15,.08,'#c0a37c',0,.83+i*.2,-.33,g);for(let x of [-.68,.68]){box(.07,.5,.5,'#46554f',x,.23,0,g);box(.07,1,.06,'#46554f',x,.6,-.32,g);}addObstacle(x,z,rot? .9:2,rot?2:.9);}
bench(-12,11,-Math.PI/2);bench(6.3,11.4,-Math.PI/2);bench(9.5,15.5);bench(-11.5,-4.3);
function car(x,z,color,rot=0){const g=new THREE.Group();world.add(g);g.position.set(x,.2,z);g.rotation.y=rot;box(1.45,.55,2.8,color,0,.46,0,g);box(1.22,.6,1.4,color,0,.98,-.1,g);box(1.04,.42,.04,'#667f8a',0,1.02,.62,g);box(.04,.4,1.15,'#667f8a',.63,1.02,-.1,g);for(let xx of [-.73,.73])for(let zz of [-.91,.87]){const t=cyl(.3,.3,.16,'#293842',xx,.26,zz,g);t.rotation.z=Math.PI/2;}for(let xx of [-.48,.48])box(.3,.18,.04,'#f2e3b0',xx,.55,1.42,g);addObstacle(x,z,rot?3:1.6,rot?1.6:3);}
car(-2.2,-9,'#d3af78');car(2.3,13,'#8e9abf',Math.PI);car(15,2.9,'#ae888d',Math.PI/2);
// Cafe terrace and striped parasol.
for(let x of [7,10.5]){cyl(.57,.57,.12,'#e1c7a3',x,.99,-5.7);cyl(.06,.09,.85,'#53676a',x,.5,-5.7);for(let dx of [-.95,.95]){box(.5,.08,.5,'#cab593',x+dx,.53,-5.7);box(.48,.42,.07,'#c8b49b',x+dx,.75,-5.92);}}
cyl(.05,.05,2.8,'#786b59',9.1,1.5,-5.6);cyl(.05,1.6,.65,'#c9c4a3',9.1,3.1,-5.6,world,8);
// Little neon arch at the north end: unlockable exit.
const portal=new THREE.Group();portal.position.set(0,0,-17);world.add(portal);box(.24,3.3,.24,'#849c94',-1.45,1.6,0,portal);box(.24,3.3,.24,'#849c94',1.45,1.6,0,portal);box(3.2,.27,.28,'#bdcab8',0,3.2,0,portal);const portalSign=textSign('EXIT',2,.55,'#c6e4c6');portalSign.position.set(0,2.95,.17);portal.add(portalSign);
const portalGlow=new THREE.Mesh(new THREE.PlaneGeometry(2.6,2.7),new THREE.MeshBasicMaterial({color:'#cfff8a',transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));portalGlow.position.set(0,1.5,0);portal.add(portalGlow);
// Floating star candies.
const starLocations=[[-2,8],[1,4],[-6,-2],[6,1],[11,6],[4,-9],[-14,5],[-9,16],[14,9],[1,-14],[-17,-4],[-6,12]];
starLocations.forEach(([x,z])=>{const g=new THREE.Group();g.position.set(x,1,z);const s=new THREE.Shape();for(let i=0;i<10;i++){let a=i*Math.PI/5+Math.PI/2,r=i%2?.15:.34;let px=Math.cos(a)*r,py=Math.sin(a)*r;i?s.lineTo(px,py):s.moveTo(px,py);}s.closePath();const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.12,bevelEnabled:true,bevelSize:.035,bevelThickness:.025,bevelSegments:1,steps:1}),mat('#f5da8e',true));g.add(m);world.add(g);stars.push({x,z,mesh:g,taken:false});});
function monster(color='#bce7bb',robot=false){const g=new THREE.Group();if(!robot){const body=sphere(.55,color,0,.8,0,g,2);body.scale.set(.83,1.1,.72);sphere(.25,color,-.29,1.35,0,g,1).scale.set(.5,1.1,.6);sphere(.25,color,.29,1.35,0,g,1).scale.set(.5,1.1,.6);sphere(.18,color,-.46,.71,.02,g);sphere(.18,color,.46,.71,.02,g);}else{box(.78,.7,.65,color,0,.86,0,g);box(.7,.36,.59,'#827d9f',0,.38,0,g);cyl(.025,.025,.32,'#c7c2dc',0,1.43,0,g);sphere(.09,'#eab9b4',0,1.6,0,g);box(.64,.26,.06,'#364251',0,.94,.34,g);sphere(.13,color,-.5,.55,0,g);sphere(.13,color,.5,.55,0,g);}
 for(let x of [-.16,.16]){sphere(.095,robot?'#d8d5ff':'#263c3f',x,.99,.365,g,2).scale.set(.75,1.1,.5);sphere(.13,robot?'#807c96':color,x,.17,.05,g,1).scale.set(1,.8,1.55);}if(!robot){sphere(.055,'#e9a7a0',-.29,.83,.34,g);sphere(.055,'#e9a7a0',.29,.83,.34,g);}return g;}
const player=new THREE.Group();scene.add(player);let playerBody=monster();player.add(playerBody);player.position.set(0,.2,7.8);
const playerRing=new THREE.Mesh(new THREE.RingGeometry(.66,.71,48),new THREE.MeshBasicMaterial({color:'#d9ff9e',side:THREE.DoubleSide,transparent:true,opacity:.8}));playerRing.rotation.x=-Math.PI/2;playerRing.position.y=.04;player.add(playerRing);
function makeHunter(x,z,index){const mesh=monster('#b8a6ce',true);mesh.position.set(x,.2,z);world.add(mesh);const light=new THREE.Mesh(new THREE.CircleGeometry(1.35,24),new THREE.MeshBasicMaterial({color:'#c3acf6',transparent:true,opacity:.13,side:THREE.DoubleSide,depthWrite:false}));light.rotation.x=-Math.PI/2;light.position.set(0,-.17,0);mesh.add(light);hunters.push({mesh,x,z,target:null,alert:0,change:index,stun:0});}
makeHunter(-8,2,0);makeHunter(8,-1,2);
function createHiders(){hiders.forEach(h=>world.remove(h.mesh));hiders.length=0;[['mail',-5.4,-5.2],['bin',12,6.8],['cone',-7,13.6],['plant',4,-11.9]].forEach(([type,x,z],i)=>{const mesh=makeProp(type,x,z,false);hiders.push({mesh,type,x,z,caught:false,reveal:0,next:2+i*2,target:null});});}
createHiders();hiders.forEach(h=>h.mesh.visible=false);
// Drifting motes bring the diorama to life.
const moteGeo=new THREE.BufferGeometry(),moteArray=new Float32Array(90*3);for(let i=0;i<90;i++){moteArray[i*3]=(Math.random()-.5)*42;moteArray[i*3+1]=Math.random()*7+1;moteArray[i*3+2]=(Math.random()-.5)*36;}moteGeo.setAttribute('position',new THREE.BufferAttribute(moteArray,3));const motes=new THREE.Points(moteGeo,new THREE.PointsMaterial({color:'#e9d8af',size:.055,transparent:true,opacity:.7}));world.add(motes);
function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}addEventListener('resize',resize);resize();
function cameraUpdate(dt){const narrow=innerWidth<850;const target=phase==='lobby'?new THREE.Vector3(0,0,1.5):new THREE.Vector3(player.position.x*.4,0,player.position.z*.38);const radius=(narrow?43:39)*zoom;const desired=new THREE.Vector3(target.x+Math.sin(cameraAngle)*radius,target.y+radius*.88,target.z+Math.cos(cameraAngle)*radius);camera.position.lerp(desired,Math.min(1,dt*3));camera.lookAt(target.x,0,target.z);}
camera.position.set(29,34,31);
function distance(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
function canMove(x,z,r=.38){if(Math.abs(x)>21||Math.abs(z)>18.4)return false;return !obstacles.some(o=>Math.abs(x-o.x)<o.w+r&&Math.abs(z-o.z)<o.d+r);}
function move(mesh,dx,dz,r=.38){if(canMove(mesh.position.x+dx,mesh.position.z,r))mesh.position.x+=dx;if(canMove(mesh.position.x,mesh.position.z+dz,r))mesh.position.z+=dz;}
function randomTarget(){for(let i=0;i<80;i++){const p={x:(Math.random()-.5)*37,z:(Math.random()-.5)*32};if(canMove(p.x,p.z,.7))return p;}return{x:0,z:2};}
function lineOfSight(a,b){for(let i=1;i<15;i++){let t=i/15;if(!canMove(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,.05))return false;}return true;}
function tone(freq=660,duration=.09,type='sine'){if(!audioOn)return;try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();audioCtx.resume();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,audioCtx.currentTime);gain.gain.setValueAtTime(.055,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+duration);}catch{}}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');toastTime=3;$('#event-feed').innerHTML='<span>✦</span> '+text;}
function burst(pos,color='#d9ff8e',count=14){for(let i=0;i<count;i++){const mesh=sphere(.07+Math.random()*.07,color,pos.x,pos.y+.7,pos.z,scene,0);effects.push({mesh,v:new THREE.Vector3((Math.random()-.5)*3,Math.random()*3+1,(Math.random()-.5)*3),life:.7,max:.7});}}
function ring(pos,color='#d2b5ff',max=8){const mesh=new THREE.Mesh(new THREE.RingGeometry(.95,1,64),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,transparent:true,opacity:.8,depthWrite:false}));mesh.rotation.x=-Math.PI/2;mesh.position.copy(pos);mesh.position.y=.24;scene.add(mesh);effects.push({mesh,life:1.1,max:1.1,ring:max});}
function setBody(type=null){player.remove(playerBody);if(type){playerBody=makeProp(type,0,0,false);world.remove(playerBody);playerBody.position.set(0,0,0);}else playerBody=monster(role==='seeker'?'#b8a6ce':'#bce7bb',role==='seeker');player.add(playerBody);disguise=type;$('#form-label').textContent=type?'非常普通的'+propNames[type]:role==='hider'?'薄荷 · 小怪兽':'紫电 · 搜捕者';$('#q-name').textContent=type?'解除伪装':role==='hider'?'物品伪装':'线索感知';}
function nearestProp(){let found=null,best=2.5;for(const p of props){const d=distance(player.position,p);if(d<best){best=d;found=p;}}return found;}
function action(which){if(phase!=='playing'){if(phase==='lobby')toast('先点击「开始躲猫猫」，再施展小把戏');return;}if(grace>0&&role==='seeker'){toast('给小怪兽几秒钟藏好吧');return;}
 if(which==='q'){
  if(role==='hider'){if(disguise){setBody();burst(player.position);toast('变回小怪兽，行动更灵活了');}else{const near=nearestProp();if(!near){toast('靠近路锥、垃圾桶、邮筒或盆栽后按 Q');return;}setBody(near.type);burst(player.position);tone(440,.14);toast('成功伪装成'+propNames[near.type]+'！保持静止可躲过搜捕');}}
  else {const alive=hiders.filter(h=>!h.caught).sort((a,b)=>distance(player.position,a.mesh.position)-distance(player.position,b.mesh.position));if(alive.length){const d=distance(player.position,alive[0].mesh.position);toast('线索感知：最近的怪兽在 '+Math.round(d)+' 米外'+(d<5?'，就在附近！':''));ring(player.position,'#e5d2a0',2);}}
 }
 if(which==='e'){
  if(cooldowns.e>0)return toast('技能冷却中，请再等 '+Math.ceil(cooldowns.e)+' 秒');
  cooldowns.e=role==='hider'?15:12;
  if(role==='hider'){smokeUntil=4;hunters.forEach(h=>{if(distance(h.mesh.position,player.position)<6){h.stun=4;h.alert=0;h.target=randomTarget();}});burst(player.position,'#c1b9e4',35);ring(player.position,'#a8badb',4);toast('烟雾弥漫！4 秒内不会被发现');}
  else {ring(player.position,'#bca9fc',10);let found=0;hiders.forEach(h=>{if(!h.caught&&distance(player.position,h.mesh.position)<10){h.reveal=5;found++;burst(h.mesh.position,'#c0ffa3');}});toast(found?'扫描发现 '+found+' 只小怪兽！追上后按空格抓捕':'附近没有怪兽，换条街找找');}tone(240,.25,'triangle');
 }
 if(which==='space'){
  if(cooldowns.space>0)return;
  if(role==='hider'){cooldowns.space=18;if(decoy)world.remove(decoy.mesh);const mesh=disguise?makeProp(disguise,player.position.x,player.position.z,false):monster();if(!disguise){mesh.position.copy(player.position);world.add(mesh);}decoy={mesh,life:7};ring(player.position,'#a1e0df',2);toast('诱饵已放出，快去别的地方藏好！');}
  else {cooldowns.space=.8;ring(player.position,'#e8b4b0',2.8);const target=hiders.find(h=>!h.caught&&distance(player.position,h.mesh.position)<2.8&&lineOfSight(player.position,h.mesh.position));if(target){target.caught=true;target.mesh.visible=false;caught++;burst(target.mesh.position,'#cfefa0',25);tone(880,.2);toast('抓到一只！还剩 '+(4-caught)+' 只');if(caught===4)finish(true,'全城的小怪兽，都被你发现啦。');}else{energy=Math.max(0,energy-12);toast('只是普通物品……本次抓捕消耗 12 体力');}}
 }
}
function roster(){const members=role==='hider'?[['••','薄荷','你 · 躲藏者','YOU'],['⌑','紫电','搜捕机器人','AI'],['⌑','泡泡','搜捕机器人','AI']]:[['⌑','紫电','你 · 搜捕者','YOU'],['••','薄荷 & 伙伴们','4 只伪装小怪兽','AI']];$('#roster').innerHTML=members.map(([face,name,sub,badge])=>`<div class="roster-row"><span class="roster-avatar">${face}</span><div class="roster-name">${name}<small>${sub}</small></div><span class="roster-badge">${badge}</span></div>`).join('');$('#team-count').textContent=role==='hider'?'3 ONLINE':'5 ONLINE';}
function selectRole(next){if(phase==='playing'||phase==='paused'){toast('本局进行中，返回游乐场后可切换阵营');return;}role=next;document.querySelectorAll('.role').forEach(b=>b.classList.toggle('active',b.dataset.role===role));$('#role-title').textContent=role==='hider'?'小怪兽 · 伪装大师':'搜捕者 · 城市侦探';$('#role-tag').textContent=role==='hider'?'潜行':'搜寻';$('#role-description').innerHTML=role==='hider'?'变成街边的小物件，收集星糖，<br/>在搜捕者眼皮底下溜走。':'有些物品不太对劲……<br/>扫描街区，揪出调皮的小怪兽。';$('#rule-text').textContent=role==='hider'?'生存 120 秒，或收集 8 颗星糖逃离':'120 秒内抓住全部 4 只小怪兽';$('#round-goal').textContent=role==='hider'?'藏好，别露馅。':'找出所有的小怪兽。';$('#round-sub').textContent=role==='hider'?'1 位玩家 · 2 位 AI 搜捕者':'1 位玩家 · 4 只 AI 小怪兽';$('#player-name').textContent=role==='hider'?'薄荷':'紫电';$('#e-name').textContent=role==='hider'?'烟雾溜走':'雷达扫描';$('#space-name').textContent=role==='hider'?'分身诱饵':'近身抓捕';$('#start span').textContent=role==='hider'?'开始躲猫猫':'开始大搜捕';$('#mission-text').textContent=role==='hider'?'收集星糖，开启传送门':'仔细观察，移动的物品很可疑';hunters.forEach(h=>h.mesh.visible=role==='hider');hiders.forEach(h=>h.mesh.visible=role==='seeker'&&!h.caught);stars.forEach(s=>s.mesh.visible=role==='hider');setBody();roster();}
function startGame(){gameId++;phase='playing';remaining=120;elapsed=0;health=100;energy=100;candies=0;caught=0;grace=6;smokeUntil=0;invincible=0;cooldowns={e:0,space:0};setBody();player.position.set(0,.2,7.8);if(decoy){world.remove(decoy.mesh);decoy=null;}hunters.forEach((h,i)=>{h.mesh.position.set(i?8:-8,.2,i?-1:2);h.alert=0;h.stun=0;h.target=randomTarget();});createHiders();hiders.forEach(h=>h.mesh.visible=role==='seeker');stars.forEach(s=>{s.taken=false;s.mesh.visible=role==='hider';});portalGlow.material.opacity=0;$('#playground').classList.add('playing-state');$('#start').classList.add('playing');$('#start span').textContent='返回游乐场';$('#phase-label').textContent=role==='hider'?'躲藏准备中':'等待怪兽藏好';$('#modal').hidden=true;toast(role==='hider'?'你有 6 秒准备时间，快找个物品伪装！':'小怪兽正在伪装……6 秒后开始搜捕');tone(520,.2);}
function toLobby(){phase='lobby';keys.clear();$('#modal').hidden=true;$('#countdown').textContent='';$('#playground').classList.remove('playing-state');$('#start').classList.remove('playing');$('#phase-label').textContent='等待你的恶作剧';remaining=120;health=energy=100;candies=0;caught=0;player.position.set(0,.2,7.8);setBody();selectRole(role);portalGlow.material.opacity=0;stars.forEach(s=>{s.taken=false;s.mesh.visible=role==='hider';});hiders.forEach(h=>{h.caught=false;h.mesh.visible=role==='seeker';});}
function finish(won,reason){phase='ended';keys.clear();$('#countdown').textContent='';tone(won?880:220,.4);const best=Number(localStorage.getItem('impostors-best')||0),score=role==='hider'?Math.round(elapsed)*10+candies*150+(won?500:0):caught*400+(won?Math.ceil(remaining)*10:0);localStorage.setItem('impostors-best',String(Math.max(best,score)));openModal(`<div class="result-icon">${won?'✦':'◌'}</div><div class="modal-kicker">${won?'MISCHIEF ACCOMPLISHED':'ONE MORE LITTLE TRICK'}</div><h2>${won?(role==='hider'?'完美藏身！':'街区侦探，出色结案！'):'被发现也没关系。'}</h2><p>${reason}</p><div class="result-stats"><div><b>${score}</b><span>本局积分</span></div><div><b>${role==='hider'?candies:caught}</b><span>${role==='hider'?'收集星糖':'抓获怪兽'}</span></div><div><b>${Math.max(best,score)}</b><span>历史最佳</span></div></div><button class="modal-primary" id="again">再来一局 ↗</button><button class="text-button" id="back-lobby" style="background:transparent;width:100%;padding:14px;color:#a5b3c5;font-size:11px">返回游乐场</button>`);$('#again').onclick=startGame;$('#back-lobby').onclick=toLobby;}
function openModal(html){keys.clear();if(phase==='playing'){phase='paused';pausedByModal=true;}else pausedByModal=false;$('#modal-content').innerHTML=html;$('#modal').hidden=false;}
function closeModal(){if(phase==='ended'){toLobby();return;}$('#modal').hidden=true;if(pausedByModal){phase='playing';pausedByModal=false;}}
function help(){openModal('<div class="modal-kicker">A LITTLE GUIDE TO MISCHIEF</div><h2>城市里，没有普通物品。</h2><p>扮演小怪兽，或成为搜捕者。这里的对手由 AI 控制，你可以随时切换阵营再玩一局。</p><div class="guide-row"><kbd>W A S D</kbd><span>移动；按住 Shift 冲刺，静止时恢复体力。</span></div><div class="guide-row"><kbd>Q</kbd><span>躲藏者：靠近物品变身 / 解除伪装。<br/>搜捕者：感知最近怪兽的距离。</span></div><div class="guide-row"><kbd>E</kbd><span>躲藏者：烟雾隐身 4 秒。<br/>搜捕者：扫描 10 米内怪兽，标记 5 秒。</span></div><div class="guide-row"><kbd>SPACE</kbd><span>躲藏者：放出诱饵引开追兵。<br/>搜捕者：抓捕 2.8 米内的怪兽。</span></div><p>静止伪装不会被发现；移动伪装仍可能露馅。收集 8 颗星糖后，前往北侧 EXIT 传送门可提前获胜。也可以坚持到时间结束。</p><button class="modal-primary" id="got-it">知道啦，去搞点小动作 ↗</button>');$('#got-it').onclick=closeModal;}
function settings(){openModal('<div class="modal-kicker">MAKE YOURSELF AT HOME</div><h2>你的游乐场，你做主。</h2><div class="setting-row"><span>AI 难度</span><select id="difficulty"><option value="easy">轻松散步</option><option value="normal">街区日常</option><option value="hard">心跳加速</option></select></div><div class="setting-row"><span>环境音效</span><select id="audio-setting"><option value="off">关闭</option><option value="on">开启</option></select></div><div class="setting-row"><span>视野距离</span><input id="zoom-setting" aria-label="视野距离" type="range" min="0.75" max="1.3" step="0.05" value="'+zoom+'"></div><p>难度调整会立即生效。拖动场景可以旋转视角，滚动鼠标滚轮可以缩放。</p><button class="modal-primary" id="save-settings">继续游玩 ↗</button>');$('#difficulty').value=difficulty;$('#audio-setting').value=audioOn?'on':'off';$('#difficulty').onchange=e=>difficulty=e.target.value;$('#audio-setting').onchange=e=>setAudio(e.target.value==='on');$('#zoom-setting').oninput=e=>zoom=Number(e.target.value);$('#save-settings').onclick=closeModal;}
function setAudio(value){audioOn=value;$('#sound').innerHTML='<svg viewBox="0 0 24 24">'+icons[value?'sound':'mute']+'</svg>';$('#sound').setAttribute('aria-label',value?'关闭音效':'开启音效');$('#sound').title=value?'关闭音效':'开启音效';if(value)tone();}
$('#sound').onclick=()=>setAudio(!audioOn);$('#help').onclick=help;$('#settings').onclick=settings;$('#close-modal').onclick=closeModal;$('#modal').onclick=e=>{if(e.target===$('#modal'))closeModal();};$('#pause').onclick=()=>{if(phase==='playing')pause();else if(phase==='paused')closeModal();else toast('游戏还没开始，街区在等你');};
function pause(){openModal('<div class="modal-kicker">TAKE A LITTLE BREATHER</div><h2>小怪兽正在打盹。</h2><p>游戏已暂停，倒计时和所有 AI 都会等你回来。</p><button class="modal-primary" id="resume">继续躲猫猫 ↗</button><button id="leave" style="width:100%;background:transparent;padding:16px;font-size:11px;color:#b5bfd0">结束本局，返回游乐场</button>');$('#resume').onclick=closeModal;$('#leave').onclick=toLobby;}
$('#start').onclick=()=>{if(phase==='lobby'||phase==='ended')startGame();else pause();};document.querySelectorAll('.role').forEach(b=>b.onclick=()=>selectRole(b.dataset.role));['q','e','space'].forEach(k=>$('#skill-'+k).onclick=()=>action(k));$('#skill-shift').onpointerdown=()=>keys.add('shift');$('#skill-shift').onpointerup=()=>keys.delete('shift');$('#skill-shift').onpointerleave=()=>keys.delete('shift');
addEventListener('keydown',e=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)return;const key=e.key.toLowerCase();if([' ','arrowup','arrowdown','arrowleft','arrowright','tab'].includes(key)&&!['tab'].includes(key))e.preventDefault();if(key==='escape'){if(!$('#modal').hidden)closeModal();else if(phase==='playing')pause();return;}keys.add(key);if(!e.repeat){if(key==='q'||key==='e')action(key);if(key===' ')action('space');}});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>{keys.clear();if(phase==='playing')pause();});
for(const b of document.querySelectorAll('#mobile-pad button')){b.onpointerdown=e=>{e.preventDefault();keys.add(b.dataset.key);b.setPointerCapture(e.pointerId);};b.onpointerup=()=>keys.delete(b.dataset.key);b.onpointercancel=()=>keys.delete(b.dataset.key);}
renderer.domElement.addEventListener('pointerdown',e=>{drag={x:e.clientX,angle:cameraAngle};renderer.domElement.setPointerCapture(e.pointerId);});renderer.domElement.addEventListener('pointermove',e=>{if(drag)cameraAngle=drag.angle-(e.clientX-drag.x)*.006;});renderer.domElement.addEventListener('pointerup',()=>drag=null);renderer.domElement.addEventListener('pointercancel',()=>drag=null);renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();zoom=THREE.MathUtils.clamp(zoom+e.deltaY*.0006,.75,1.3);},{passive:false});
function updateHunters(dt){for(const h of hunters){if(h.stun>0){h.stun-=dt;continue;}const d=distance(h.mesh.position,player.position);const visible=smokeUntil<=0&&(!disguise||moving)&&d<(difficulty==='easy'?6:difficulty==='hard'?11:8)&&lineOfSight(h.mesh.position,player.position);if(visible)h.alert=3;else h.alert=Math.max(0,h.alert-dt);let target=h.target;if(decoy&&distance(h.mesh.position,decoy.mesh.position)<10)target=decoy.mesh.position;else if(h.alert>0)target=player.position;else{h.change-=dt;if(!target||distance(h.mesh.position,target)<1||h.change<0){h.target=randomTarget();h.change=5+Math.random()*3;}target=h.target;}
 if(target){const dir=new THREE.Vector3(target.x-h.mesh.position.x,0,target.z-h.mesh.position.z);const len=dir.length();if(len>.4){dir.normalize();const speed=(h.alert>0?2.65:1.3)*(difficulty==='easy'?.7:difficulty==='hard'?1.25:1);const old=h.mesh.position.clone();move(h.mesh,dir.x*speed*dt,dir.z*speed*dt);if(old.distanceTo(h.mesh.position)<.003){h.change=0;move(h.mesh,-dir.z*speed*dt,dir.x*speed*dt);}h.mesh.rotation.y=Math.atan2(dir.x,dir.z);h.mesh.position.y=.2+Math.sin(elapsed*9)*.035;}}
 if(decoy&&distance(h.mesh.position,decoy.mesh.position)<1){burst(decoy.mesh.position,'#bdc8e3');world.remove(decoy.mesh);decoy=null;h.stun=2;h.alert=0;toast('搜捕者被诱饵骗到了！');}
 if(d<1.15&&visible&&invincible<=0){health=Math.max(0,health-34);invincible=2.5;burst(player.position,'#e9a6aa');tone(150,.2,'sawtooth');toast('被搜捕者撞见了！快用烟雾脱身');if(health<=0){finish(false,'搜捕机器人找到了你。下次试试静止伪装，或者用分身诱饵引开它。');return;}}
 }}
function updateHiders(dt){for(const h of hiders){if(h.caught)continue;h.reveal=Math.max(0,h.reveal-dt);h.next-=dt;const d=distance(h.mesh.position,player.position);if(d<4.7&&lineOfSight(h.mesh.position,player.position)){const dir=new THREE.Vector3(h.mesh.position.x-player.position.x,0,h.mesh.position.z-player.position.z).normalize();const speed=difficulty==='easy'?1.2:difficulty==='hard'?2.7:1.9;move(h.mesh,dir.x*speed*dt,dir.z*speed*dt);h.mesh.position.y=.25+Math.abs(Math.sin(elapsed*8))*.1;}else if(h.next<0){h.target=randomTarget();h.next=10+Math.random()*9;}else if(h.target&&h.next>7){const dir=new THREE.Vector3(h.target.x-h.mesh.position.x,0,h.target.z-h.mesh.position.z);if(dir.length()>.3){dir.normalize();move(h.mesh,dir.x*dt,dir.z*dt);}}else h.mesh.position.y=.21;h.mesh.rotation.y=h.reveal>0?Math.sin(elapsed*8)*.12:0;if(h.reveal>0&&Math.floor(elapsed*4)%4===0&&Math.random()<dt*8)burst(h.mesh.position,'#d2ff91',2);}}
const mapCtx=$('#minimap').getContext('2d');
function drawMap(){const c=mapCtx,w=220,h=184;c.clearRect(0,0,w,h);c.fillStyle='#121d29';c.fillRect(0,0,w,h);const tx=x=>(x+22)*5,tz=z=>(z+19)*4.8;c.fillStyle='#263744';c.fillRect(tx(-4),0,40,h);c.fillRect(0,tz(-1),w,30);c.strokeStyle='#50635a';c.lineWidth=1;for(const o of obstacles){if(o.w<1||o.d<1)continue;c.fillStyle='#3a514e';c.fillRect(tx(o.x-o.w),tz(o.z-o.d),o.w*10,o.d*9.6);c.strokeRect(tx(o.x-o.w),tz(o.z-o.d),o.w*10,o.d*9.6);}c.fillStyle='#4e795d';c.fillRect(tx(-14),tz(9),40,34);c.fillStyle='#789997';c.beginPath();c.arc(tx(9.4),tz(11.7),9,0,Math.PI*2);c.fill();if(role==='hider'){for(const s of stars){if(s.taken)continue;c.fillStyle='#c9ad72';c.fillRect(tx(s.x)-1,tz(s.z)-1,2,2);}for(const a of hunters)mapDot(a.mesh.position,'#b4a0d6',3);}else for(const a of hiders)if(!a.caught&&a.reveal>0)mapDot(a.mesh.position,'#d9ff79',3);mapDot(player.position,'#d9ff79',4);c.strokeStyle='#d9ff7944';c.beginPath();c.arc(tx(player.position.x),tz(player.position.z),8,0,Math.PI*2);c.stroke();c.fillStyle=candies>=8?'#d9ff79':'#516e71';c.fillRect(tx(-1.4),tz(-17),14,3);function mapDot(p,color,r){c.fillStyle=color;c.beginPath();c.arc(tx(p.x),tz(p.z),r,0,Math.PI*2);c.fill();}}
let uiTick=0;
function updateUI(dt){uiTick+=dt;if(uiTick<.08)return;uiTick=0;const m=Math.floor(remaining/60),s=Math.ceil(remaining%60);$('#timer').innerHTML=String(m).padStart(2,'0')+'<span>:</span>'+String(s===60?59:s).padStart(2,'0');$('#health-text').textContent=health+' HP';$('#health-bar').style.width=health+'%';$('#energy-bar').style.width=energy+'%';$('#candy-count').textContent=role==='hider'?candies+' / 8':caught+' / 4';$('#candy-progress').style.width=(role==='hider'?candies/8:caught/4)*100+'%';$('#stealth-state').textContent=role==='seeker'?'正在搜寻 · 留心可疑物品':smokeUntil>0?'烟雾掩护 · 暂时安全':hunters.some(h=>h.alert>0)?'正在被追踪 · 快躲起来':disguise?(moving?'伪装移动 · 小心露馅':'完美伪装 · 安全藏身'):'自在闲逛 · 未被发现';for(let k of ['e','space']){$('#'+k+'-status').textContent=cooldowns[k]>0?Math.ceil(cooldowns[k])+' 秒':'就绪';$('#skill-'+k).classList.toggle('cooldown',cooldowns[k]>0);}const near=nearestProp();$('#q-status').textContent=role==='seeker'?'探测距离':disguise?'已伪装':near?'变成'+propNames[near.type]:'靠近物品';$('#interaction span').textContent=role==='seeker'?'感知距离，E 扫描，空格抓捕':disguise?'保持静止，不要露馅 · Q 解除伪装':near?'变成'+propNames[near.type]+'，混入街区':'靠近城市物品，即可伪装';drawMap();}
let totalTime=0;
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);totalTime+=dt;cameraUpdate(dt);
 if(phase==='playing'){elapsed+=dt;if(grace>0){grace=Math.max(0,grace-dt);$('#countdown').textContent=Math.ceil(grace)||'';if(grace===0){$('#phase-label').textContent='搜捕进行中';toast('捉迷藏开始！');tone(800,.2);}}else remaining=Math.max(0,remaining-dt);
 for(const k in cooldowns)cooldowns[k]=Math.max(0,cooldowns[k]-dt);smokeUntil=Math.max(0,smokeUntil-dt);invincible=Math.max(0,invincible-dt);
 let dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dz=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);moving=!!(dx||dz)&&(role==='hider'||grace===0);const sprint=moving&&keys.has('shift')&&energy>0;energy=THREE.MathUtils.clamp(energy+(sprint?-25:15)*dt,0,100);if(moving){const len=Math.hypot(dx,dz);dx/=len;dz/=len;const speed=(sprint?5.3:3.1)*(disguise?.65:1);const wx=dx*Math.cos(cameraAngle)+dz*Math.sin(cameraAngle),wz=-dx*Math.sin(cameraAngle)+dz*Math.cos(cameraAngle);move(player,wx*speed*dt,wz*speed*dt);playerBody.rotation.y=Math.atan2(wx,wz);playerBody.position.y=Math.abs(Math.sin(totalTime*11))*.065;}else playerBody.position.y=disguise?0:Math.sin(totalTime*2.8)*.045;
 playerBody.visible=invincible<=0||Math.floor(invincible*10)%2===0;
 if(grace===0){if(role==='hider')updateHunters(dt);else updateHiders(dt);}
 if(role==='hider'){stars.forEach(star=>{if(!star.taken&&distance(player.position,star)<.85){star.taken=true;star.mesh.visible=false;candies=Math.min(8,candies+1);energy=Math.min(100,energy+20);burst(star.mesh.position,'#ffe3a5',9);tone(550+candies*65,.12);if(candies===8){toast('星糖收集完成！前往地图北侧 EXIT 逃离');$('#mission-text').textContent='传送门已开启 · 前往北侧 EXIT';}else toast('星糖 +1 · '+candies+' / 8');}});if(candies>=8){portalGlow.material.opacity=.28+Math.sin(totalTime*3)*.08;if(distance(player.position,{x:0,z:-17})<1.8)finish(true,'你集齐了星糖，从传送门悄悄溜走了！');}}
 if(decoy){decoy.life-=dt;if(decoy.life<=0){world.remove(decoy.mesh);decoy=null;}}
 if(remaining<=0&&phase==='playing')finish(role==='hider',role==='hider'?'时间到！你骗过了搜捕者，守住了城市里最甜的小秘密。':'时间到，还有 '+(4-caught)+' 只小怪兽躲在城市里。试试用扫描配合距离感知。');
 }else if(phase==='lobby'){playerBody.position.y=Math.sin(totalTime*2.6)*.05;playerBody.rotation.y=.7+Math.sin(totalTime*.45)*.16;moving=false;}
 if(phase!=='paused'){for(const star of stars){star.mesh.position.y=1.0+Math.sin(totalTime*2+star.x)*.14;star.mesh.rotation.y=totalTime*.8;}for(let i=effects.length-1;i>=0;i--){const e=effects[i];e.life-=dt;if(e.ring){const scale=1+(1-e.life/e.max)*e.ring;e.mesh.scale.setScalar(scale);e.mesh.material.opacity=Math.max(0,e.life/e.max)*.65;}else{e.v.y-=dt*6;e.mesh.position.addScaledVector(e.v,dt);e.mesh.scale.setScalar(Math.max(0,e.life/e.max));}if(e.life<=0){scene.remove(e.mesh);e.mesh.geometry.dispose();if(e.ring)e.mesh.material.dispose();effects.splice(i,1);}}motes.rotation.y=Math.sin(totalTime*.05)*.04;}
 if(toastTime>0){toastTime-=dt;if(toastTime<=0)$('#toast').classList.remove('show');}
 const screen=player.position.clone().add(new THREE.Vector3(0,2.05,0)).project(camera);$('#world-label').style.left=(screen.x*.5+.5)*container.clientWidth+'px';$('#world-label').style.top=(-screen.y*.5+.5)*container.clientHeight+'px';updateUI(dt);renderer.render(scene,camera);
}
selectRole('hider');animate();
// Small read-only diagnostic snapshot for smoke verification.
window.__gameSnapshot=()=>({phase,role,health,energy,candies,caught,remaining,disguise,player:{x:player.position.x,z:player.position.z},objects:props.length,buildings:6,renderer:renderer.info.render.calls});
