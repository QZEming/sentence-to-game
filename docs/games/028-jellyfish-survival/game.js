import * as THREE from './vendor/three.module.js';

const $ = id => document.getElementById(id);
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const rand = (a,b) => a + Math.random() * (b-a);
let seed=88421;
const seeded = (a,b) => {seed=(seed*16807)%2147483647;return a+(seed/2147483647)*(b-a);};
const WORLD=85;
let renderer;
try {
  renderer=new THREE.WebGLRenderer({canvas:$('ocean'),antialias:true,powerPreference:'high-performance'});
} catch(error) {
  $('loading').classList.add('hidden');$('webgl-error').classList.remove('hidden');throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.2;
const scene=new THREE.Scene();scene.background=new THREE.Color('#052d40');scene.fog=new THREE.FogExp2('#07394b',.017);
const camera=new THREE.PerspectiveCamera(49,innerWidth/innerHeight,.15,240);
camera.position.set(0,19,35);
scene.add(new THREE.HemisphereLight(0x93e9df,0x123455,2.1));
const sun=new THREE.DirectionalLight(0xb1eee1,2.6);sun.position.set(-25,70,-20);scene.add(sun);
const rim=new THREE.DirectionalLight(0x0e65af,3);rim.position.set(25,12,20);scene.add(rim);
const floorMat=new THREE.ShaderMaterial({uniforms:{time:{value:0}},vertexShader:`varying vec3 wp;void main(){vec4 w=modelMatrix*vec4(position,1.);wp=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,fragmentShader:`varying vec3 wp;uniform float time;void main(){float v=sin(wp.x*.24+sin(wp.z*.31)*1.8)+sin(wp.z*.29+wp.x*.1);float sand=sin(wp.x*4.3+sin(wp.z*2.))*sin(wp.z*3.7)*.025;float c=abs(sin(wp.x*.43+sin(wp.z*.6+time*.14))+sin(wp.z*.5+cos(wp.x*.47-time*.12)));float caustic=pow(max(0.,1.-c),16.);vec3 col=mix(vec3(.028,.14,.19),vec3(.10,.28,.30),v*.2+.5)+sand+caustic*vec3(.025,.07,.055);float fog=1.-exp(-distance(cameraPosition,wp)*.018);gl_FragColor=vec4(mix(col,vec3(.025,.19,.25),fog),1.);}`});
const floorGeo=new THREE.PlaneGeometry(430,430,100,100);floorGeo.rotateX(-Math.PI/2);
const fp=floorGeo.attributes.position;
for(let i=0;i<fp.count;i++){const x=fp.getX(i),z=fp.getZ(i);fp.setY(i,Math.sin(x*.08)*Math.cos(z*.075)*1.2+Math.sin(z*.18+x*.09)*.45-1.4);}
floorGeo.computeVertexNormals();scene.add(new THREE.Mesh(floorGeo,floorMat));
function glowTexture(){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');const g=ctx.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.14,'rgba(255,255,255,.7)');g.addColorStop(.4,'rgba(255,255,255,.16)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
const glowTex=glowTexture();
function glow(color,size,opacity=.5){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.setScalar(size);return s;}
function mesh(geo,color,roughness=.75,emissive=0,intensity=0){return new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,roughness,emissive,emissiveIntensity:intensity}));}
const sphere=new THREE.SphereGeometry(1,20,16),lowSphere=new THREE.IcosahedronGeometry(1,1);
function ellipsoid(group,color,position,scale,emissive=0,intensity=0){const m=mesh(sphere,color,.45,emissive,intensity);m.position.set(...position);m.scale.set(...scale);group.add(m);return m;}
const dummy=new THREE.Object3D();
// Mineral outcrops and coral forests are actual three-dimensional game scenery.
const rockInst=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:0x1e5761,roughness:.98}),230);
for(let i=0;i<230;i++){let x=seeded(-115,115),z=seeded(-115,115);if(i<12){x=seeded(-23,23);z=seeded(6,22);}dummy.position.set(x,seeded(-1,.4),z);const k=seeded(1.2,5);dummy.scale.set(k,seeded(.7,2.3),k*.7);dummy.rotation.set(seeded(0,2),seeded(0,6),seeded(0,.5));dummy.updateMatrix();rockInst.setMatrixAt(i,dummy.matrix);rockInst.setColorAt(i,new THREE.Color().setHSL(seeded(.48,.57),.32,seeded(.09,.2)));}scene.add(rockInst);
const coralRoot=new THREE.Group();scene.add(coralRoot);
const branchGeo=new THREE.CylinderGeometry(.08,.15,1,5);
const branchInst=new THREE.InstancedMesh(branchGeo,new THREE.MeshStandardMaterial({roughness:.75,emissive:0x27132d,emissiveIntensity:.23}),1900);
const tipInst=new THREE.InstancedMesh(lowSphere,new THREE.MeshStandardMaterial({roughness:.5,emissive:0x954f91,emissiveIntensity:.27}),1000);
let branches=0,tips=0;
const coralColors=[0xc56b91,0xe09074,0x8573b7,0x3eb7b0,0xb65586];
function branch(a,b,r,color){if(branches>=1900)return;const d=new THREE.Vector3().subVectors(b,a);dummy.position.copy(a).add(b).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());dummy.scale.set(r,d.length(),r);dummy.updateMatrix();branchInst.setMatrixAt(branches,dummy.matrix);branchInst.setColorAt(branches++,color);}
for(let c=0;c<95;c++){let x=seeded(-100,100),z=seeded(-100,100);if(c<15){x=seeded(-26,26);z=seeded(2,25);}const height=seeded(1.3,4.3),col=new THREE.Color(coralColors[c%5]);const root=new THREE.Vector3(x,-.6,z),trunk=new THREE.Vector3(x,height*.55,z);branch(root,trunk,1.6,col);for(let j=0;j<5;j++){const angle=j*1.26+seeded(0,.3);const end=new THREE.Vector3(x+Math.cos(angle)*height*.48,height*.65+seeded(0,height*.45),z+Math.sin(angle)*height*.4);branch(trunk.clone().multiplyScalar(.65).add(root.clone().multiplyScalar(.35)),end,.8,col);for(let k=0;k<2;k++){const tip=end.clone().add(new THREE.Vector3(seeded(-.45,.45),seeded(.3,.9),seeded(-.45,.45)));branch(end,tip,.55,col);dummy.position.copy(tip);dummy.quaternion.identity();dummy.scale.setScalar(.13);dummy.updateMatrix();tipInst.setMatrixAt(tips,dummy.matrix);tipInst.setColorAt(tips++,col);}}}
branchInst.count=branches;tipInst.count=tips;coralRoot.add(branchInst,tipInst);
const weeds=[];
const weedMat=new THREE.MeshStandardMaterial({color:0x258c74,emissive:0x0b6352,emissiveIntensity:.45,side:THREE.DoubleSide,roughness:.7});
const weedGeo=new THREE.PlaneGeometry(.45,4,1,6);weedGeo.translate(0,2,0);
const weedP=weedGeo.attributes.position;for(let i=0;i<weedP.count;i++){const y=weedP.getY(i);weedP.setX(i,weedP.getX(i)*(1-y/5)+Math.sin(y*1.2)*.28);}
const weedInst=new THREE.InstancedMesh(weedGeo,weedMat,390);
const weedLocations=[[-8,2],[11,-14],[-20,-25],[27,15],[-38,17],[12,37],[39,-31],[-55,-40],[55,48],[-25,60],[60,-59],[-63,51],[5,-56]];
let wi=0;for(const [x,z] of weedLocations){weeds.push(new THREE.Vector3(x,2,z));for(let j=0;j<30;j++){dummy.position.set(x+seeded(-3.5,3.5),-.6,z+seeded(-3.5,3.5));dummy.rotation.set(0,seeded(0,6.28),seeded(-.18,.18));dummy.scale.setScalar(seeded(.65,1.3));dummy.updateMatrix();weedInst.setMatrixAt(wi++,dummy.matrix);}const g=glow(0x43f3bc,9,.13);g.position.set(x,2,z);scene.add(g);}scene.add(weedInst);
// Soft shafts, plankton and suspended particles establish depth without a flat backdrop.
const rayMat=new THREE.MeshBasicMaterial({color:0x77dbd4,transparent:true,opacity:.021,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
for(let i=0;i<12;i++){const ray=new THREE.Mesh(new THREE.CylinderGeometry(.3,3.9,73,10,1,true),rayMat);ray.position.set(seeded(-65,55),30,seeded(-65,-10));ray.rotation.z=-.23;scene.add(ray);}
const particlesGeo=new THREE.BufferGeometry(),pPositions=new Float32Array(1300*3),pSizes=new Float32Array(1300);
for(let i=0;i<1300;i++){pPositions[i*3]=seeded(-100,100);pPositions[i*3+1]=seeded(1,47);pPositions[i*3+2]=seeded(-100,100);pSizes[i]=seeded(.03,.12);}particlesGeo.setAttribute('position',new THREE.BufferAttribute(pPositions,3));
const particles=new THREE.Points(particlesGeo,new THREE.PointsMaterial({color:0xa5ebdf,size:.10,transparent:true,opacity:.65,depthWrite:false,sizeAttenuation:true,map:glowTex,blending:THREE.AdditiveBlending}));scene.add(particles);
// Small distant fish move in loose schools.
const fishGroup=new THREE.Group();scene.add(fishGroup);const littleFish=[];
for(let i=0;i<36;i++){const f=mesh(new THREE.ConeGeometry(.15,.7,4),0x66a7af);f.rotation.z=Math.PI/2;f.position.set(seeded(-50,50),seeded(8,25),seeded(-65,10));fishGroup.add(f);littleFish.push({f,x:f.position.x,z:f.position.z,speed:seeded(.5,1.5)});}

function makeJelly(color=0xacefff,scale=1){
 const root=new THREE.Group(),body=new THREE.Group();root.add(body);
 const bellMat=new THREE.MeshPhysicalMaterial({color,emissive:color,emissiveIntensity:.38,roughness:.12,metalness:.05,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false,clearcoat:1});
 const bell=new THREE.Mesh(new THREE.SphereGeometry(1.55,48,28,0,Math.PI*2,0,Math.PI*.52),bellMat);bell.scale.y=.77;body.add(bell);
 const inner=new THREE.Mesh(new THREE.SphereGeometry(1.34,32,20,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xd7f6ff,emissive:color,emissiveIntensity:.75,transparent:true,opacity:.21,side:THREE.DoubleSide,depthWrite:false}));inner.scale.y=.68;body.add(inner);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.51,.045,8,80),new THREE.MeshBasicMaterial({color:0xd7fafa,transparent:true,opacity:.8}));ring.rotation.x=Math.PI/2;body.add(ring);
 const frills=[];for(let j=0;j<26;j++){const a=j/26*Math.PI*2;const f=ellipsoid(body,color,[Math.cos(a)*1.48,-.1,Math.sin(a)*1.48],[.13,.19,.13],color,.7);f.material.transparent=true;f.material.opacity=.65;frills.push(f);}
 for(let i=0;i<8;i++){const pts=[];const a=i/8*Math.PI*2;for(let j=0;j<=24;j++){const u=j/24*Math.PI/2;pts.push(new THREE.Vector3(Math.sin(u)*1.57*Math.cos(a),Math.cos(u)*1.22,Math.sin(u)*1.57*Math.sin(a)));}const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xe4ffff,transparent:true,opacity:.32}));body.add(line);}
 for(let i=0;i<4;i++){const a=i*Math.PI/2;const organ=ellipsoid(body,0xf5bfdb,[Math.cos(a)*.38,.3,Math.sin(a)*.38],[.33,.23,.45],0xd285bb,.65);organ.rotation.y=-a;organ.material.transparent=true;organ.material.opacity=.5;}
 const tentacles=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2,len=2.4+(i%3)*.55,geo=new THREE.CylinderGeometry(.025,.007,len,5,22,true);geo.translate(0,-len/2,0);const t=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:i%3?color:0xe6c6ef,emissive:color,emissiveIntensity:.6,transparent:true,opacity:.75,roughness:.4}));t.position.set(Math.cos(a)*.97,-.09,Math.sin(a)*.97);body.add(t);tentacles.push({mesh:t,base:new Float32Array(geo.attributes.position.array),a,len});}
 const halo=glow(color,7,.21);halo.position.y=.3;root.add(halo);
 root.scale.setScalar(scale);root.userData={body,bell,frills,tentacles,halo};scene.add(root);return root;
}
function animateJelly(jelly,time,moving=0){const d=jelly.userData,pulse=Math.sin(time*2.2);d.body.scale.set(1+pulse*.035,1-pulse*.05,1+pulse*.035);for(const t of d.tentacles){const a=t.mesh.geometry.attributes.position;for(let k=0;k<a.count;k++){const y=t.base[k*3+1],v=-y/t.len;const sway=v*v; a.setXYZ(k,t.base[k*3]+Math.sin(time*1.65+v*3.1+t.a)*sway*.35,y,t.base[k*3+2]+Math.cos(time*1.3+v*3+t.a)*sway*.32+moving*v*v*.6);}a.needsUpdate=true;}d.halo.material.opacity=.17+pulse*.025;}
const player=makeJelly();player.position.set(0,7,0);
const playerLight=new THREE.PointLight(0x8cefff,5,14,2);playerLight.position.set(0,0,0);player.add(playerLight);
const ambientJellies=[];for(let i=0;i<8;i++){const j=makeJelly(i%2?0x92dce7:0xb8b2ed,seeded(.28,.55));j.position.set(seeded(-40,40),seeded(7,23),seeded(-45,-12));ambientJellies.push({j,base:j.position.y});}
const shadow=new THREE.Mesh(new THREE.CircleGeometry(1.5,48),new THREE.MeshBasicMaterial({color:0x01242f,transparent:true,opacity:.23,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.1;scene.add(shadow);

function makePredator(type){
 const root=new THREE.Group(),model=new THREE.Group();root.add(model);
 const color=type==='shark'?0x608594:type==='eel'?0x507a71:0xca926f;
 let tail;
 if(type==='shark'){
  ellipsoid(model,color,[0,0,0],[.74,.64,2.0]);ellipsoid(model,0xa2c0ba,[0,-.22,-.2],[.65,.35,1.65]);
  const finShape=new THREE.Shape();finShape.moveTo(0,0);finShape.lineTo(0,1.65);finShape.lineTo(1.25,0);finShape.closePath();
  const fin=new THREE.Mesh(new THREE.ExtrudeGeometry(finShape,{depth:.11,bevelEnabled:false}),new THREE.MeshStandardMaterial({color}));fin.rotation.y=Math.PI/2;fin.position.set(-.05,.2,.5);model.add(fin);
  for(const s of [-1,1]){const f=mesh(new THREE.ConeGeometry(.45,1.7,3),color);f.rotation.z=-s*1.15;f.rotation.x=.4;f.position.set(s*.85,-.16,.15);model.add(f);}
  tail=new THREE.Group();tail.position.z=1.65;model.add(tail);
  for(const s of [-1,1]){const t=mesh(new THREE.ConeGeometry(.35,1.5,3),color);t.position.set(0,s*.42,.4);t.rotation.x=s*.9;tail.add(t);}
 } else if(type==='eel'){
  for(let j=0;j<8;j++){ellipsoid(model,color,[0,0,j*.48-1.65],[.34-j*.028,.37-j*.025,.46]);}tail=model;
 } else {
  ellipsoid(model,color,[0,0,0],[.68,.8,1.05]);tail=new THREE.Group();tail.position.z=.8;model.add(tail);
  for(let j=0;j<12;j++){const angle=j/12*Math.PI*2;const spine=mesh(new THREE.ConeGeometry(.055,1.6,4),0xe7c3a0);spine.position.set(Math.cos(angle)*.9,Math.sin(angle)*.9,.2);spine.rotation.z=angle-Math.PI/2;model.add(spine);}
  const t=mesh(new THREE.ConeGeometry(.6,1.1,4),color);t.rotation.x=Math.PI/2;t.position.z=.35;tail.add(t);
  for(let j=0;j<5;j++){const stripe=mesh(new THREE.TorusGeometry(.64,.055,5,20),0x5e5650);stripe.scale.y=1.2;stripe.position.z=-.55+j*.28;model.add(stripe);}
 }
 for(const sign of [-1,1]){ellipsoid(model,0x172b30,[sign*(type==='eel'?.27:.47),.12,type==='shark'?-1.35:-.68],[.11,.11,.11]);ellipsoid(model,0xf4b69b,[sign*(type==='eel'?.33:.54),.15,type==='shark'?-1.37:-.72],[.035,.047,.05],0xf88a61,1);}
 const marker=glow(0xff876c,2,.25);marker.position.y=1.25;root.add(marker);root.userData={model,tail,marker};scene.add(root);return root;
}
const predators=[];
const collectibles=[];
const pickupGeo=new THREE.IcosahedronGeometry(.17,1);
const foodMats={food:new THREE.MeshStandardMaterial({color:0xffe5a2,emissive:0xffc768,emissiveIntensity:2}),heal:new THREE.MeshStandardMaterial({color:0xffb8d9,emissive:0xed77bd,emissiveIntensity:2}),energy:new THREE.MeshStandardMaterial({color:0x9ee9ff,emissive:0x48bbef,emissiveIntensity:2})};
function addPickup(x,y,z,type='food') {const group=new THREE.Group();const core=new THREE.Mesh(pickupGeo,foodMats[type]);if(type!=='food')core.scale.setScalar(1.7);group.add(core);group.add(glow(type==='food'?0xffcc71:type==='heal'?0xffa3d5:0x80d7ff,type==='food'?1.5:2.2,.6));group.position.set(x,y,z);scene.add(group);collectibles.push({group,type,y,phase:rand(0,6.28),active:true});}
function disposeDynamic(root){const geometries=new Set(),materials=new Set();root.traverse(o=>{if(o.geometry&&!o.isSprite&&o.geometry!==sphere&&o.geometry!==pickupGeo)geometries.add(o.geometry);if(o.material){for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(!Object.values(foodMats).includes(m))materials.add(m);}});for(const g of geometries)g.dispose();for(const m of materials)m.dispose();scene.remove(root);}
function resetPickups(){for(const c of collectibles)disposeDynamic(c.group);collectibles.length=0;for(let i=0;i<90;i++){const a=rand(0,Math.PI*2),r=rand(10,80);addPickup(Math.cos(a)*r,rand(3.1,17),Math.sin(a)*r,i%17===0?'heal':i%13===0?'energy':'food');}for(let i=0;i<14;i++){const a=i*.47;addPickup(Math.sin(a)*7,7+Math.sin(a*.7),-4-i*2.3);}for(const w of weeds){addPickup(w.x,4,w.z,'heal');}}
const beacons=[];const beaconPositions=[new THREE.Vector3(-25,5,-33),new THREE.Vector3(37,9,-17),new THREE.Vector3(-8,6,48)];
for(let i=0;i<3;i++){const group=new THREE.Group();group.position.copy(beaconPositions[i]);const ring=new THREE.Mesh(new THREE.TorusGeometry(1.8,.065,8,64),new THREE.MeshStandardMaterial({color:0xf4d494,emissive:0xecc774,emissiveIntensity:1.8}));group.add(ring);const innerRing=ring.clone();innerRing.scale.setScalar(.78);innerRing.rotation.y=Math.PI/2;group.add(innerRing);const core=mesh(new THREE.OctahedronGeometry(.5),0xffecc1,.3,0xf5c873,1.7);group.add(core);const halo=glow(0xeecb75,7,.23);group.add(halo);const line=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,beaconPositions[i].y+1,6),new THREE.MeshBasicMaterial({color:0xe3c585,transparent:true,opacity:.22}));line.position.y=-(beaconPositions[i].y+1)/2;group.add(line);scene.add(group);beacons.push({group,ring,innerRing,core,lit:false,progress:0});}
const rings=[];
function wave(position,color=0xa4f4dd,size=6){const m=new THREE.Mesh(new THREE.SphereGeometry(1,32,20),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.34,wireframe:true,depthWrite:false}));m.position.copy(position);scene.add(m);rings.push({m,life:0,duration:.8,size});}

let state='menu',mode='survival',elapsed=0,clockTime=0,hp=100,energy=100,xp=0,level=1,nextXp=8,totalFood=0,score=0;
let cooldown=0,invincible=0,hidden=false,spawnTimer=8,combo=0,comboTimer=0,stunCount=0,boosting=false,dashLock=0;
let stats={speed:1,capacity:100,pulseCooldown:8,pulseRange:7,magnet:2.5,regen:0};
let helpReturn='menu',quality=true,soundEnabled=false,toastTimer=0,nearWeed=false,activeBeacon=0;
const keys=new Set(),velocity=new THREE.Vector3(),input=new THREE.Vector3();let touchX=0,touchZ=0,touchY=0,touchDash=false;
const achievements=new Set();let best=0;try{best=Number(localStorage.getItem('lumen-best')||0)||0;}catch{}
if(best)$('personal-best').textContent=`个人最佳  ${best.toLocaleString()}  ·  每一次微光都值得被记住`;
const audio={ctx:null,gain:null,noise:null};
function initAudio(){if(audio.ctx)return;try{audio.ctx=new (window.AudioContext||window.webkitAudioContext)();audio.gain=audio.ctx.createGain();audio.gain.gain.value=soundEnabled?.19:0;audio.gain.connect(audio.ctx.destination);const buffer=audio.ctx.createBuffer(1,audio.ctx.sampleRate*3,audio.ctx.sampleRate),data=buffer.getChannelData(0);let last=0;for(let i=0;i<data.length;i++){last=(last+Math.random()*.04-.02)/1.025;data[i]=last*2.8;}const src=audio.ctx.createBufferSource();src.buffer=buffer;src.loop=true;const filter=audio.ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=330;src.connect(filter).connect(audio.gain);src.start();audio.noise=src;}catch{}}
function tone(freq=440,duration=.15,type='sine',volume=.22){if(!audio.ctx||!soundEnabled)return;const t=audio.ctx.currentTime,o=audio.ctx.createOscillator(),g=audio.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(freq*.75,t+duration);g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g).connect(audio.gain);o.start();o.stop(t+duration);}
function toast(message,seconds=3){$('toast').textContent=message;$('toast').classList.add('show');toastTimer=seconds;}
function showPanel(id){$('modal-backdrop').classList.remove('hidden');for(const p of document.querySelectorAll('.panel'))p.classList.add('hidden');$(id).classList.remove('hidden');const focusable=$(id).querySelector('button');focusable?.focus();}
function closePanel(){$('modal-backdrop').classList.add('hidden');for(const p of document.querySelectorAll('.panel'))p.classList.add('hidden');}
function clearInput(){keys.clear();touchX=touchZ=touchY=0;touchDash=false;upHeld=false;downHeld=false;$('joystick-knob').style.transform='';}
function enterMenu(){state='menu';clearInput();closePanel();$('hud').classList.add('hidden');$('pause-btn').classList.add('hidden');for(const id of ['menu','specimen','menu-footer'])$(id).classList.remove('hidden');document.body.classList.remove('playing');player.position.set(0,7,0);player.rotation.set(0,0,0);player.scale.setScalar(1);player.visible=true;hidden=false;for(const p of predators)disposeDynamic(p.root);predators.length=0;for(const b of beacons)b.group.visible=false;for(const c of collectibles)c.group.visible=false;$('biome-label').textContent='浅海花园';$('depth-label').textContent='DEPTH  24 M';if(best)$('personal-best').textContent=`个人最佳  ${best.toLocaleString()}  ·  每一次微光都值得被记住`;}
function startGame(){
 initAudio();audio.ctx?.resume();state='playing';elapsed=0;hp=100;energy=100;xp=0;level=1;nextXp=8;totalFood=0;score=0;cooldown=0;invincible=3;hidden=false;spawnTimer=9;combo=0;comboTimer=0;stunCount=0;activeBeacon=0;dashLock=0;
 stats={speed:1,capacity:100,pulseCooldown:8,pulseRange:7,magnet:2.5,regen:0};achievements.clear();clearInput();velocity.set(0,0,0);player.position.set(0,7,0);player.rotation.set(0,0,0);player.scale.setScalar(1);player.visible=true;
 for(const p of predators)disposeDynamic(p.root);predators.length=0;for(const r of rings)disposeDynamic(r.m);rings.length=0;
 resetPickups();for(const b of beacons){b.lit=false;b.progress=0;b.group.visible=true;b.ring.material.color.set(0xf4d494);}
 for(const id of ['menu','specimen','menu-footer'])$(id).classList.add('hidden');$('hud').classList.remove('hidden');$('pause-btn').classList.remove('hidden');document.body.classList.add('playing');$('journey-title').textContent=mode==='survival'?'生存远航':'自在漫游';closePanel();toast('WASD 漂游 · Q 下潜 / E 上浮 · 先收集身边的金色光点',5);updateHUD();
}
function pause(){if(state!=='playing')return;state='paused';clearInput();showPanel('pause-panel');}
function resume(){if(state!=='paused')return;state='playing';clearInput();closePanel();}
function openHelp(){if(state==='upgrading'||state==='dead'||state==='won')return;helpReturn=state;state='help';clearInput();showPanel('help-panel');}
function closeHelp(){if(state!=='help')return;state=helpReturn;closePanel();if(state==='paused')showPanel('pause-panel');}
function finish(won){state=won?'won':'dead';clearInput();hidden=false;const finalScore=Math.round(score+elapsed*5+beacons.filter(b=>b.lit).length*500+(won?1000:0));if(finalScore>best){best=finalScore;try{localStorage.setItem('lumen-best',String(best));}catch{}}
 $('result-eyebrow').textContent=won?'JOURNEY COMPLETE / 远航完成':'A LITTLE REST / 暂别深海';$('result-title').textContent=won?'你把微光，带到了远方。':'微光熄灭，勇气还在。';$('result-copy').textContent=won?'海洋记住了你的勇敢。下一次，还能游得更远。':'试着借助海草隐匿，留一次电击给最近的危险。';$('result-score').textContent=finalScore.toLocaleString();$('result-time').textContent=formatTime(elapsed);$('result-beacons').textContent=`${beacons.filter(b=>b.lit).length} / 3`;
 const badges=[];if(beacons.every(b=>b.lit))badges.push('✧ 深海引路人');if(totalFood>=30)badges.push('✧ 光点收藏家');if(stunCount>=5)badges.push('✧ 雷霆小水母');if(hp>=80&&won)badges.push('✧ 从容远航');$('result-badges').textContent=badges.join('　')||'每一次出发，都是新的光。';showPanel('result-panel');tone(won?740:130,.8);
}
const upgrades=[
 {id:'speed',symbol:'ϟ',title:'轻盈脉动',desc:'游动速度提升 15%，更轻松地甩开追踪。',tag:'机动进化',apply:()=>{stats.speed*=1.15;}},
 {id:'energy',symbol:'◈',title:'潮汐之心',desc:'能量上限增加 30，立即补满冲刺能量。',tag:'续航进化',apply:()=>{stats.capacity+=30;energy=stats.capacity;}},
 {id:'pulse',symbol:'◎',title:'雷光涟漪',desc:'电击冷却缩短 20%，影响范围扩大 15%。',tag:'防御进化',apply:()=>{stats.pulseCooldown*=.8;stats.pulseRange*=1.15;cooldown=0;}},
 {id:'magnet',symbol:'✧',title:'星光引力',desc:'光点吸附范围增加 45%，收集更从容。',tag:'采集进化',apply:()=>{stats.magnet*=1.45;}},
 {id:'heal',symbol:'♡',title:'柔光自愈',desc:'立即恢复 35 生命，并每秒恢复 0.5 生命。',tag:'生存进化',apply:()=>{hp=Math.min(100,hp+35);stats.regen+=.5;}}
];
function levelUp(){state='upgrading';level++;xp-=nextXp;nextXp=Math.round(nextXp*1.45);clearInput();const choices=[...upgrades].sort(()=>Math.random()-.5).slice(0,3);$('upgrade-cards').replaceChildren();choices.forEach((u,i)=>{const btn=document.createElement('button');btn.className='upgrade-card';btn.innerHTML=`<span class="upgrade-symbol">${u.symbol}</span><strong>${u.title}</strong><p>${u.desc}</p><small>${u.tag} · ${i+1}</small>`;btn.onclick=()=>chooseUpgrade(u);$('upgrade-cards').append(btn);});showPanel('upgrade-panel');tone(660,.35);}
function chooseUpgrade(u){if(state!=='upgrading')return;u.apply();state='playing';closePanel();invincible=Math.max(invincible,2);wave(player.position,0xc5fff0,4);toast(`已进化 · ${u.title}`);updateHUD();}
function doPulse(){if(state!=='playing')return;if(cooldown>0){toast(`电击恢复中 · ${Math.ceil(cooldown)} 秒`,1.2);return;}cooldown=stats.pulseCooldown;hidden=false;wave(player.position,0xabf9ff,stats.pulseRange);let hit=0;for(const p of predators){if(p.root.position.distanceTo(player.position)<stats.pulseRange+1){p.stun=3;hit++;const push=p.root.position.clone().sub(player.position).normalize().multiplyScalar(2);p.root.position.add(push);}}
 stunCount+=hit;score+=hit*30;toast(hit?`生物电击 · 震慑 ${hit} 只捕食者`:'生物电击 · 涟漪扩散',1.6);tone(190,.45,'triangle',.45);updateHUD();}
function toggleHide(){if(state!=='playing')return;if(hidden){hidden=false;toast('离开隐匿，继续潜游',1.5);return;}if(!nearWeed){toast('靠近发光海草并下潜到海床附近，即可隐匿',2.5);return;}hidden=true;toast('海草隐匿 · 保持慢游，捕食者将失去目标',2.5);tone(310,.25);}
function spawnPredator(){const count=predators.length,type=count%3===0?'shark':count%3===1?'eel':'lion';const a=rand(0,6.28),dist=rand(28,42),root=makePredator(type);root.position.set(clamp(player.position.x+Math.cos(a)*dist,-WORLD,WORLD),clamp(player.position.y+rand(-5,6),3,22),clamp(player.position.z+Math.sin(a)*dist,-WORLD,WORLD));predators.push({root,type,stun:0,warn:0,charge:0,chargeVector:new THREE.Vector3(),attackTimer:rand(3,6),heading:new THREE.Vector3(0,0,-1),phase:rand(0,6),home:root.position.clone()});if(count===0)toast('捕食者正在靠近 · 按住 Shift 冲刺，Space 电击脱身',4);}
function damage(amount){if(invincible>0||mode==='explore')return;hp=Math.max(0,hp-amount);invincible=1.7;hidden=false;combo=0;$('damage-flash').style.opacity='1';setTimeout(()=>$('damage-flash').style.opacity='0',250);tone(95,.3,'sawtooth',.5);toast(`受到攻击 −${amount} · 电击或冲刺拉开距离`,2);if(hp<=0)finish(false);}
function collect(c){c.active=false;c.group.visible=false;if(c.type==='heal'){hp=Math.min(100,hp+24);toast('柔光疗愈 +24',1.5);tone(590,.15);}else if(c.type==='energy'){energy=Math.min(stats.capacity,energy+55);toast('潮汐能量 +55',1.5);tone(490,.12);}else{totalFood++;xp++;combo=comboTimer>0?combo+1:1;comboTimer=5;hp=Math.min(100,hp+1.7);score+=10+(Math.min(combo,10)-1)*2;tone(540+Math.min(combo,10)*45,.1);if(combo===5||combo===10)toast(`${combo} 连续采集 · 光点连击加分`,1.8);if(xp>=nextXp){levelUp();}}}
function formatTime(t){return`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;}

function updateGame(dt){
 elapsed+=dt;if(mode==='survival'&&elapsed>=180){elapsed=180;finish(true);return;}cooldown=Math.max(0,cooldown-dt);invincible=Math.max(0,invincible-dt);comboTimer-=dt;dashLock=Math.max(0,dashLock-dt);hp=Math.min(100,hp+stats.regen*dt);
 nearWeed=weeds.some(w=>Math.hypot(w.x-player.position.x,w.z-player.position.z)<5&&player.position.y<6.6);
 input.set((keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+touchX,((keys.has('KeyE')?1:0)-(keys.has('KeyQ')?1:0)+touchY)*.78,(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0)+touchZ);
 if(input.length()>1)input.normalize();const wantsDash=(keys.has('ShiftLeft')||keys.has('ShiftRight')||touchDash)&&input.lengthSq()>.01;
 boosting=wantsDash&&energy>1&&dashLock<=0;if(hidden&&(!nearWeed||boosting))hidden=false;
 if(boosting){energy=Math.max(0,energy-dt*30);if(energy<=1)dashLock=1.5;}else energy=Math.min(stats.capacity,energy+dt*(hidden?27:19));
 const speed=7.2*stats.speed*(boosting?1.85:1)*(hidden?.34:1);velocity.lerp(input.clone().multiplyScalar(speed),1-Math.exp(-dt*5));player.position.addScaledVector(velocity,dt);
 const distance=Math.hypot(player.position.x,player.position.z);if(distance>WORLD){player.position.x*=WORLD/distance;player.position.z*=WORLD/distance;if(!achievements.has('edge')){toast('海域边界 · 转身继续探索',3);achievements.add('edge');}}
 player.position.y=clamp(player.position.y,2.2,25);player.rotation.z=lerp(player.rotation.z,-velocity.x*.025,dt*4);player.rotation.x=lerp(player.rotation.x,velocity.z*.025,dt*4);player.scale.setScalar(lerp(player.scale.x,hidden?.78:1,dt*4));player.visible=!(invincible>0&&Math.sin(clockTime*20)<-.6);
 if(boosting&&Math.random()<.3){const g=glow(0x95eede,1.5,.25);g.position.copy(player.position);g.position.y-=1;scene.add(g);rings.push({m:g,life:0,duration:.55,size:.4});}
 for(const c of collectibles){if(!c.active)continue;const d=c.group.position.distanceTo(player.position);if(d<stats.magnet+1.3){c.group.position.lerp(player.position,dt*(7/(d+.5)));if(d<1.1){collect(c);if(state!=='playing')return;}}}
 if(collectibles.filter(c=>c.active).length<65){for(let i=0;i<14;i++){addPickup(rand(-WORLD*.8,WORLD*.8),rand(3,17),rand(-WORLD*.8,WORLD*.8));}}
 spawnTimer-=dt;if(spawnTimer<=0&&predators.length<Math.min(7,2+Math.floor(elapsed/27))){spawnPredator();spawnTimer=rand(13,19);}
 let minThreat=999;
 for(const p of predators){const pos=p.root.position;const dist=pos.distanceTo(player.position);minThreat=Math.min(minThreat,dist);p.stun=Math.max(0,p.stun-dt);p.root.userData.marker.material.opacity=p.stun>0?.03:dist<20?.5:.15;if(p.stun>0){p.root.rotation.z=Math.sin(clockTime*9)*.1;continue;}p.root.rotation.z=0;
  const detect=p.type==='shark'?35:p.type==='eel'?26:16;const chasing=dist<detect&&!hidden;
  let target=chasing?player.position.clone():p.home.clone().add(new THREE.Vector3(Math.sin(clockTime*.17+p.phase)*12,Math.sin(clockTime*.22+p.phase)*4,Math.cos(clockTime*.17+p.phase)*12));
  let direction=target.sub(pos).normalize();let speed=p.type==='shark'?6.6:p.type==='eel'?5.0:3.4;speed*=1+elapsed/800;
  if(p.type==='eel'&&chasing){p.attackTimer-=dt;if(p.attackTimer<=0&&p.warn<=0&&p.charge<=0&&dist<22){p.warn=.9;p.attackTimer=7;}
   if(p.warn>0){p.warn-=dt;speed=.3;p.root.userData.marker.scale.setScalar(4);p.root.userData.marker.material.opacity=.65+Math.sin(clockTime*20)*.3;if(p.warn<=0){p.charge=1.2;p.chargeVector.copy(direction);if(dist<18)tone(130,.15);}}
   else if(p.charge>0){p.charge-=dt;direction.copy(p.chargeVector);speed=17;p.root.userData.marker.scale.setScalar(2);}else p.root.userData.marker.scale.setScalar(2);
  } else {p.warn=0;p.charge=0;}
  if(!chasing)speed*=.55;
  const turn=p.type==='shark'?1.35:p.charge>0?8:2.5;p.heading.lerp(direction,1-Math.exp(-dt*turn)).normalize();pos.addScaledVector(p.heading,speed*dt);pos.y=clamp(pos.y,2.5,27);const pr=Math.hypot(pos.x,pos.z);if(pr>WORLD+10){pos.x*=(WORLD+10)/pr;pos.z*=(WORLD+10)/pr;}
  p.root.rotation.y=Math.atan2(-p.heading.x,-p.heading.z);p.root.rotation.x=Math.asin(clamp(p.heading.y,-.7,.7))*.35;
  if(p.type==='eel'){for(let i=0;i<8;i++){p.root.userData.model.children[i].position.x=Math.sin(clockTime*5-i*.5)*.2;}}else p.root.userData.tail.rotation.y=Math.sin(clockTime*5+p.phase)*.35;
  if(dist<(p.type==='lion'?2.5:2.25))damage(p.type==='shark'?26:p.type==='eel'?20:15);if(state!=='playing')return;
 }
 $('threat-label').textContent=hidden?'隐匿 · 暂时安全':minThreat<9?'⚠ 危险迫近':minThreat<23?'捕食者出没':'水流平缓';$('threat-label').style.color=minThreat<9&&!hidden?'#ff9e88':'#9bbbbc';
 for(let i=0;i<beacons.length;i++){const b=beacons[i];if(b.lit)continue;const dist=b.group.position.distanceTo(player.position);if(dist<4.2){b.progress+=dt;$('direction-hint').textContent=`信标充能 ${Math.min(100,Math.round(b.progress/3*100))}% · 停留在光环附近`;if(b.progress>=3){b.lit=true;score+=250;hp=Math.min(100,hp+20);energy=stats.capacity;b.ring.material.color.set(0xa4f4dd);wave(b.group.position,0xffdd96,12);toast('信标点亮！+250 积分 · 生命与能量恢复',3);tone(880,.6);activeBeacon=beacons.findIndex(x=>!x.lit);if(activeBeacon<0){activeBeacon=0;toast('三个信标全部点亮 · 深海引路人成就达成',4);}}}else b.progress=Math.max(0,b.progress-dt*.5);}
 updateHUD();
}
function updateHUD(){
 $('hp-label').textContent=`${Math.ceil(hp)} / 100`;$('hp-bar').style.width=`${hp}%`;$('hp-bar').style.background=hp<30?'#ef9b86':'';$('energy-bar').style.width=`${energy/stats.capacity*100}%`;$('energy-label').textContent=Math.round(energy);$('xp-bar').style.width=`${Math.min(100,xp/nextXp*100)}%`;$('xp-label').textContent=`${xp} / ${nextXp} 光点`;$('level-label').textContent=`月光水母 · LV.${level}`;$('timer').textContent=formatTime(mode==='survival'?Math.max(0,180-elapsed):elapsed);$('score-label').textContent=`${totalFood} 光点`;
 $('pulse-status').textContent=cooldown>0?`${cooldown.toFixed(1)} 秒`:'准备就绪';$('pulse-btn').classList.toggle('cooling',cooldown>0);$('dash-status').textContent=boosting?'脉冲推进中':energy<10?'能量恢复中':'按住加速';$('dash-btn').classList.toggle('active',boosting);$('hide-btn').classList.toggle('active',hidden);$('hide-status').textContent=hidden?'隐匿中':nearWeed?'可以隐匿':'靠近海草';$('hidden-label').classList.toggle('hidden',!hidden);
 const lit=beacons.filter(b=>b.lit).length;if(totalFood<8){$('quest-title').textContent='收集 8 个光点';$('quest-detail').textContent='寻找身边的金色浮游生物';$('quest-progress').textContent=`${totalFood} / 8`;}else{$('quest-title').textContent=lit===3?'信标全部点亮':'点亮深海信标';$('quest-detail').textContent=lit===3?'保持微光，继续远航':'接近金色光环并停留 3 秒';$('quest-progress').textContent=`${lit} / 3`;}
 const depth=Math.round(32-player.position.y);$('depth-label').textContent=`DEPTH  ${depth} M`;$('biome-label').textContent=player.position.z<-24?'幽蓝裂谷':player.position.x>24?'珊瑚边境':player.position.z>25?'潮汐秘境':'浅海花园';
 if(!beacons.some(b=>!b.lit&&b.group.position.distanceTo(player.position)<4.2)){const b=beacons[activeBeacon];if(b&&!b.lit&&totalFood>=8){const delta=b.group.position.clone().sub(player.position),angle=Math.atan2(delta.x,-delta.z),arrow=['↑','↗','→','↘','↓','↙','←','↖'][(Math.round(angle/(Math.PI/4))+8)%8];$('direction-hint').textContent=`${arrow} 信标 ${Math.round(delta.length())} m${Math.abs(delta.y)>3?(delta.y>0?' · E 上浮':' · Q 下潜'):''}`;}else $('direction-hint').textContent=hidden?'隐匿时可以缓慢移动':totalFood<8?'靠近金色光点即可吸收':'';}
}
const radar=$('minimap').getContext('2d');
function drawRadar(){radar.clearRect(0,0,180,180);radar.save();radar.translate(90,90);radar.strokeStyle='#8bcbbb22';radar.lineWidth=1;for(const r of [27,53,79]){radar.beginPath();radar.arc(0,0,r,0,Math.PI*2);radar.stroke();}radar.beginPath();radar.moveTo(-80,0);radar.lineTo(80,0);radar.moveTo(0,-80);radar.lineTo(0,80);radar.stroke();const draw=(pos,color,r)=>{let x=(pos.x-player.position.x)*1.15,z=(pos.z-player.position.z)*1.15;const d=Math.hypot(x,z);if(d>77){x*=77/d;z*=77/d;}radar.fillStyle=color;radar.beginPath();radar.arc(x,z,r,0,Math.PI*2);radar.fill();};for(const w of weeds)draw(w,'#58b68b55',3);for(const b of beacons)draw(b.group.position,b.lit?'#85e0bc':'#edcf83',b.lit?2:3.5);for(const c of collectibles)if(c.active&&c.group.position.distanceTo(player.position)<45)draw(c.group.position,'#dfc47a77',1);for(const p of predators)draw(p.root.position,p.stun>0?'#86c9e9':'#f59079',3);draw(player.position,'#b7ffe5',4);radar.restore();}

$('start-btn').onclick=startGame;$('pause-btn').onclick=()=>state==='playing'?pause():resume();$('help-btn').onclick=openHelp;$('close-help').onclick=closeHelp;$('resume-btn').onclick=resume;$('restart-btn').onclick=startGame;$('again-btn').onclick=startGame;$('menu-btn').onclick=enterMenu;$('result-menu-btn').onclick=enterMenu;$('pulse-btn').onclick=doPulse;$('hide-btn').onclick=toggleHide;
for(const btn of document.querySelectorAll('[data-mode]'))btn.onclick=()=>{mode=btn.dataset.mode;document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('selected',b===btn));};
$('sound-btn').onclick=()=>{initAudio();soundEnabled=!soundEnabled;audio.ctx?.resume();if(audio.gain)audio.gain.gain.setTargetAtTime(soundEnabled?.19:0,audio.ctx.currentTime,.3);$('sound-cross').classList.toggle('hidden',soundEnabled);$('sound-btn').setAttribute('aria-label',soundEnabled?'关闭声音':'开启声音');tone(550,.2);};
$('quality-btn').onclick=()=>{quality=!quality;renderer.setPixelRatio(quality?Math.min(devicePixelRatio,1.65):.85);$('quality-btn').textContent=quality?'HD':'SD';$('quality-btn').setAttribute('aria-label',quality?'切换为流畅画质':'切换为高清画质');particles.visible=quality;};
const gameKeys=new Set(['KeyW','KeyA','KeyS','KeyD','KeyQ','KeyE','KeyC','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','ShiftLeft','ShiftRight','Escape']);
window.addEventListener('keydown',e=>{if(gameKeys.has(e.code))e.preventDefault();if(e.code==='Tab'&&!$('modal-backdrop').classList.contains('hidden')){const focusables=[...$('modal-backdrop').querySelector('.panel:not(.hidden)').querySelectorAll('button')];const first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}if(e.repeat)return;if(e.code==='Escape'){if(state==='playing')pause();else if(state==='paused')resume();else if(state==='help')closeHelp();return;}if(e.code==='Enter'&&state==='menu'){e.preventDefault();startGame();return;}if(state==='upgrading'&&['Digit1','Digit2','Digit3'].includes(e.code)){$('upgrade-cards').children[Number(e.code.at(-1))-1]?.click();return;}if(state!=='playing')return;keys.add(e.code);if(e.code==='Space')doPulse();if(e.code==='KeyC')toggleHide();});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>{clearInput();if(state==='playing')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(state==='playing')pause();}});
let upHeld=false,downHeld=false;
function heldButton(id,on,off){const el=$(id),pointers=new Set();el.addEventListener('pointerdown',e=>{e.preventDefault();pointers.add(e.pointerId);el.setPointerCapture(e.pointerId);on();});for(const event of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(event,e=>{if(pointers.delete(e.pointerId)&&pointers.size===0)off();});}
heldButton('dash-btn',()=>touchDash=true,()=>touchDash=false);heldButton('up-btn',()=>{upHeld=true;touchY=Number(upHeld)-Number(downHeld);},()=>{upHeld=false;touchY=Number(upHeld)-Number(downHeld);});heldButton('down-btn',()=>{downHeld=true;touchY=Number(upHeld)-Number(downHeld);},()=>{downHeld=false;touchY=Number(upHeld)-Number(downHeld);});
let stickId=null;function moveStick(e){if(e.pointerId!==stickId)return;const r=$('joystick').getBoundingClientRect(),dx=e.clientX-r.x-r.width/2,dy=e.clientY-r.y-r.height/2,max=r.width*.32,len=Math.hypot(dx,dy),scale=Math.min(max,len)/(len||1);touchX=dx*scale/max;touchZ=dy*scale/max;$('joystick-knob').style.transform=`translate(${dx*scale}px,${dy*scale}px)`;}
$('joystick').addEventListener('pointerdown',e=>{e.preventDefault();if(stickId!==null)return;stickId=e.pointerId;$('joystick').setPointerCapture(e.pointerId);moveStick(e);});$('joystick').addEventListener('pointermove',moveStick);for(const event of ['pointerup','pointercancel','lostpointercapture'])$('joystick').addEventListener(event,e=>{if(e.pointerId!==stickId)return;stickId=null;touchX=touchZ=0;$('joystick-knob').style.transform='';});
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

// Optional structured controls share the exact state transitions used by visible UI.
const publicState=()=>({state,mode,elapsed:Math.round(elapsed),health:Math.round(hp),level,lightCollected:totalFood,beaconsLit:beacons.filter(b=>b.lit).length,bestScore:best,position:{x:+player.position.x.toFixed(1),y:+player.position.y.toFixed(1),z:+player.position.z.toFixed(1)}});
const webTools=[
{name:'read_ocean_game',description:'Read the current jellyfish journey, health, progress and selected mode.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:async()=>publicState()},
{name:'start_ocean_journey',description:'Start a new jellyfish game from the sea-surface menu with a selected mode.',inputSchema:{type:'object',properties:{mode:{type:'string',enum:['survival','explore']}},required:['mode'],additionalProperties:false},annotations:{readOnlyHint:false},execute:async input=>{if(!input||!['survival','explore'].includes(input.mode)||Object.keys(input).some(k=>k!=='mode'))throw Error('Choose survival or explore.');if(state!=='menu')throw Error('Return to the sea-surface menu before starting a new journey.');mode=input.mode;startGame();return publicState();}},
{name:'pause_ocean_journey',description:'Pause an active jellyfish journey and show the pause menu.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute:async()=>{if(state!=='playing')throw Error('There is no active journey to pause.');pause();return publicState();}}
];
if(document.modelContext?.registerTool){const lifecycle=new AbortController();for(const t of webTools){try{Promise.resolve(document.modelContext.registerTool(t,{signal:lifecycle.signal})).catch(()=>{});}catch{}}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}

let prev=performance.now(),hudTick=0;
const cameraGoal=new THREE.Vector3(),lookGoal=new THREE.Vector3(),cameraLook=new THREE.Vector3(0,5,0);
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-prev)/1000,.05);prev=now;clockTime+=dt;
 floorMat.uniforms.time.value=clockTime;particles.rotation.y=Math.sin(clockTime*.018)*.035;
 if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)$('toast').classList.remove('show');}
 if(state==='playing')updateGame(dt);
 const menuScene=state==='menu'||(state==='help'&&helpReturn==='menu');
 if(menuScene){player.scale.setScalar(innerWidth<800?1.7:2.0);player.position.set(0,7+Math.sin(clockTime*.65)*.33,0);player.rotation.z=Math.sin(clockTime*.4)*.045;player.rotation.x=.04;cameraGoal.set(-11+Math.sin(clockTime*.06)*.8,13.8,29);lookGoal.set(innerWidth<800?-3: -8,6,-1);}else {cameraGoal.copy(player.position).add(new THREE.Vector3(0,15,25));lookGoal.copy(player.position).add(new THREE.Vector3(0,-.7,-4));}
 camera.position.lerp(cameraGoal,1-Math.exp(-dt*(menuScene?1.5:3)));cameraLook.lerp(lookGoal,1-Math.exp(-dt*4));camera.lookAt(cameraLook);
 animateJelly(player,clockTime,boosting?.9:velocity.length()*.04);for(const {j,base} of ambientJellies){j.position.y=base+Math.sin(clockTime*.6+j.position.x)*.5;animateJelly(j,clockTime+j.position.x);}
 shadow.position.x=player.position.x;shadow.position.z=player.position.z;shadow.material.opacity=clamp(.36-player.position.y*.01,.05,.35);shadow.scale.setScalar(1+player.position.y*.08);
 for(const f of littleFish){f.f.position.x=f.x+Math.sin(clockTime*.1*f.speed)*8;f.f.position.z=f.z+Math.cos(clockTime*.1*f.speed)*3;}
 for(const c of collectibles){if(!c.active)continue;const far=c.group.position.distanceTo(player.position)>stats.magnet+1.5;if(far)c.group.position.y=c.y+Math.sin(clockTime*1.2+c.phase)*.2;c.group.rotation.y=clockTime*.7+c.phase;}
 for(const b of beacons){b.ring.rotation.y=clockTime*.25;b.innerRing.rotation.x=clockTime*.32;b.core.rotation.y=clockTime;b.core.position.y=Math.sin(clockTime*1.5)*.2;b.group.scale.setScalar(b.lit?.78:1+Math.sin(clockTime*2)*.025);}
 for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.life+=dt;const p=r.life/r.duration;r.m.scale.setScalar(1+p*r.size);r.m.material.opacity=(1-p)*.33;if(p>=1){scene.remove(r.m);if(!r.m.isSprite)r.m.geometry?.dispose();r.m.material.dispose();rings.splice(i,1);}}
 hudTick+=dt;if(hudTick>.08&&state!=='menu'){drawRadar();hudTick=0;}
 renderer.render(scene,camera);
}
enterMenu();requestAnimationFrame(frame);$('loading').style.opacity='0';setTimeout(()=>$('loading').classList.add('hidden'),650);
