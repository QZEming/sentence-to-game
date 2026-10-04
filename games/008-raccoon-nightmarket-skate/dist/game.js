import * as THREE from './vendor/three.module.js';
import {Game, LANES, clamp} from './engine.js';

const $ = id=>document.getElementById(id), app=$('app');
const hidden=(id,yes)=>$(id).classList.toggle('hidden',yes);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas:$('world'),antialias:true,powerPreference:'high-performance'});}catch(e){hidden('loading',true);hidden('error',false);throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();scene.background=new THREE.Color('#152735');scene.fog=new THREE.FogExp2('#203441',.0105);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,350);
const hemi=new THREE.HemisphereLight('#b0d8e1','#262737',1.35);scene.add(hemi);
const moonLight=new THREE.DirectionalLight('#cae8ec',1.8);moonLight.position.set(-20,38,10);moonLight.castShadow=true;moonLight.shadow.mapSize.set(1024,1024);moonLight.shadow.camera.left=-24;moonLight.shadow.camera.right=24;moonLight.shadow.camera.top=30;moonLight.shadow.camera.bottom=-30;moonLight.shadow.normalBias=.03;scene.add(moonLight);
const warmLight=new THREE.DirectionalLight('#ffb976',1.1);warmLight.position.set(12,8,-12);scene.add(warmLight);
const playerLight=new THREE.PointLight('#d8f9d0',9,12,1.5);playerLight.position.set(0,4,6);scene.add(playerLight);
const matCache=new Map();
function mat(color,emissive=false){const key=color+emissive;if(!matCache.has(key))matCache.set(key,emissive?new THREE.MeshBasicMaterial({color,toneMapped:false}):new THREE.MeshStandardMaterial({color,roughness:.78,metalness:0}));return matCache.get(key);}
const boxGeo=new THREE.BoxGeometry(1,1,1), sphereGeo=new THREE.SphereGeometry(1,12,8),cylGeo=new THREE.CylinderGeometry(1,1,1,12),coneGeo=new THREE.ConeGeometry(1,1,5);
function mesh(geo,color,x,y,z,sx=1,sy=sx,sz=sx,parent=scene,glow=false){const o=new THREE.Mesh(geo,mat(color,glow));o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;}
const box=(p,x,y,z,w,h,d,c,em=false)=>mesh(boxGeo,c,x,y,z,w,h,d,p,em);
const ball=(p,x,y,z,w,h,d,c,em=false)=>mesh(sphereGeo,c,x,y,z,w,h,d,p,em);
function tube(p,a,b,r,color){const v=new THREE.Vector3().subVectors(b,a);const m=mesh(cylGeo,color,...new THREE.Vector3().addVectors(a,b).multiplyScalar(.5).toArray(),r,v.length(),r,p);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
function random(n){const x=Math.sin(n*127.1+311.7)*43758.5453123;return x-Math.floor(x);}
function glowTexture(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,.6)');g.addColorStop(.3,'rgba(255,255,255,.18)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
const glowMap=glowTexture();
function glow(p,x,y,z,c,size=3){const o=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.6}));o.position.set(x,y,z);o.scale.set(size,size,1);p.add(o);return o;}
const signTextures=new Map();
function sign(p,text,x,y,z,w,h,bg='#172d36',fg='#fff0bd',rotation=0){const key=text+bg+fg;let texture=signTextures.get(key);if(!texture){const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,256);ctx.strokeStyle=fg;ctx.lineWidth=6;ctx.strokeRect(13,13,486,230);ctx.font='900 94px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=fg;ctx.shadowColor=fg;ctx.shadowBlur=8;ctx.fillText(text,256,123,455);ctx.font='500 20px sans-serif';ctx.shadowBlur=0;ctx.fillText('MIDNIGHT MARKET • OPEN LATE',256,209,425);texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;signTextures.set(key,texture);}
const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rotation;p.add(g);box(g,0,0,-.1,w+.13,h+.13,.22,bg);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));m.position.z=.03;g.add(m);return g;}
function lantern(p,x,y,z,color='#ff9463',size=1){const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(size);p.add(g);ball(g,0,0,0,.38,.5,.38,color,true);mesh(cylGeo,'#835b46',0,.48,0,.18,.09,.18,g);mesh(cylGeo,'#835b46',0,-.48,0,.18,.09,.18,g);tube(g,new THREE.Vector3(0,-.5,0),new THREE.Vector3(0,-.81,0),.018,'#ffa45c');for(let i=0;i<5;i++){const a=i*Math.PI/2.5;tube(g,new THREE.Vector3(Math.cos(a)*.34,-.28,Math.sin(a)*.34),new THREE.Vector3(Math.cos(a)*.34,.28,Math.sin(a)*.34),.01,'#ffbb72');}glow(g,0,0,0,color,2.6);return g;}
// Moon, stars and the deep blue skyline.
const sky=new THREE.Mesh(new THREE.SphereGeometry(260,24,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color('#111b30')},bottom:{value:new THREE.Color('#52757a')}},vertexShader:'varying vec3 p; void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 p;uniform vec3 top;uniform vec3 bottom;void main(){float h=clamp(normalize(p).y*2.4+.12,0.,1.);gl_FragColor=vec4(mix(bottom,top,h),1.);}' }));scene.add(sky);
ball(scene,-48,60,-145,7,7,7,'#f9dfb3',true);glow(scene,-48,60,-144,'#ffd3a4',30);
const starPos=[];for(let i=0;i<270;i++)starPos.push((random(i+2)-.5)*380,35+random(i+390)*125,-100-random(i+713)*100);
const starsGeo=new THREE.BufferGeometry();starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:'#d9e3ca',size:.26,transparent:true,opacity:.65})));
function batchStaticGroup(root){
  root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert(),groups=new Map();
  root.traverse(o=>{if(o.isMesh&&[boxGeo,sphereGeo,cylGeo].includes(o.geometry)){const key=o.geometry.uuid+o.material.uuid;const a=groups.get(key)||[];a.push(o);groups.set(key,a);}});
  for(const items of groups.values()){if(items.length<2)continue;const inst=new THREE.InstancedMesh(items[0].geometry,items[0].material,items.length);inst.receiveShadow=items.some(o=>o.receiveShadow);inst.castShadow=items.some(o=>o.castShadow);items.forEach((o,i)=>{inst.setMatrixAt(i,new THREE.Matrix4().multiplyMatrices(inverse,o.matrixWorld));o.removeFromParent();});inst.instanceMatrix.needsUpdate=true;root.add(inst);}
}
const farCity=new THREE.Group();scene.add(farCity);
for(let i=0;i<80;i++){let x=(random(i+91)-.5)*270;if(Math.abs(x)<15)x+=x<0?-24:24;const h=10+random(i+210)*44,z=-75-random(i+421)*120,w=5+random(i+982)*12;box(farCity,x,h/2-22,z,w,h,w*.7,['#183747','#203e4b','#26474f','#1e3448'][i%4]);box(farCity,x,h-21.8,z,w+.2,.35,w*.7+.2,'#375760');for(let k=0;k<4;k++)for(let j=0;j<5;j++)if(random(i*300+k*10+j)>.5)box(farCity,x+(k-1.5)*w/5,h-24-j*3,z+w*.35+.01,.45,1,.02,j%3===0?'#c19b67':'#669a91',true);if(i%7===0){box(farCity,x,h-20,z,.13,5,.13,'#758e85');ball(farCity,x,h-17.3,z,.12,.12,.12,'#f68979',true);}}
batchStaticGroup(farCity);
// The raccoon is an articulated, low-poly 3D character.
const raccoon=new THREE.Group();scene.add(raccoon);
const lean=new THREE.Group();raccoon.add(lean);
const board=new THREE.Group();lean.add(board);
const deck=box(board,0,.23,0,.92,.13,1.85,'#a8e491');deck.castShadow=true;ball(board,0,.24,-.9,.46,.07,.25,'#a8e491');ball(board,0,.24,.9,.46,.07,.25,'#a8e491');box(board,0,.31,0,.71,.025,1.35,'#244a4b');box(board,0,.333,0,.65,.012,.18,'#ffd19a');
for(const z of [-.6,.6]){box(board,0,.12,z,.96,.06,.08,'#344053');for(const x of [-.49,.49]){const wheel=mesh(cylGeo,'#fff2bf',x,.095,z,.12,.14,.12,board);wheel.rotation.z=Math.PI/2;ball(board,x*1.07,.095,z,.055,.055,.055,'#fa996f');}}
const body=new THREE.Group();body.position.y=.45;lean.add(body);
const legL=ball(body,-.25,.16,-.34,.24,.31,.26,'#303b42'),legR=ball(body,.28,.17,.35,.24,.32,.26,'#303b42');
ball(body,-.25,-.04,-.38,.25,.14,.34,'#eee4cb');ball(body,.28,-.04,.38,.25,.14,.34,'#eee4cb');
const torso=ball(body,0,.67,0,.57,.69,.43,'#f6a75c');torso.castShadow=true;ball(body,0,1.18,0,.47,.23,.4,'#fdc681');box(body,0,.66,-.412,.1,.72,.06,'#e27c4e');box(body,.3,.58,-.403,.18,.23,.05,'#ffcf7f');
const armL=new THREE.Group(),armR=new THREE.Group();armL.position.set(-.47,.88,0);armR.position.set(.47,.88,0);body.add(armL,armR);
ball(armL,-.14,-.1,-.04,.27,.4,.26,'#f6a75c').rotation.z=-.5;ball(armL,-.25,-.4,-.08,.17,.2,.18,'#3a4244');ball(armR,.14,-.1,0,.27,.4,.26,'#f6a75c').rotation.z=.5;ball(armR,.25,-.4,-.04,.17,.2,.18,'#3a4244');
const head=new THREE.Group();head.position.set(0,1.64,-.06);body.add(head);
ball(head,0,0,0,.65,.55,.52,'#a7a9a0').castShadow=true;
for(const s of [-1,1]){ball(head,s*.47,.43,.01,.24,.28,.14,'#535e5e').rotation.z=-s*.45;ball(head,s*.48,.45,-.107,.14,.17,.04,'#e4c4b0');ball(head,s*.37,-.06,-.19,.33,.35,.38,'#e4e1cc');const mask=ball(head,s*.27,.06,-.423,.28,.19,.12,'#263a3d');mask.rotation.z=s*.2;ball(head,s*.25,.08,-.523,.081,.094,.045,'#0c2028');ball(head,s*.232,.103,-.562,.026,.03,.018,'#fff7e1');}
ball(head,0,-.17,-.52,.26,.18,.23,'#eeecd7');ball(head,0,-.105,-.723,.105,.069,.077,'#253337');ball(head,0,-.26,-.62,.058,.025,.03,'#485151');
// Small teal backpack and a generous striped tail.
ball(body,0,.78,.43,.37,.45,.17,'#436d68');box(body,0,.8,.585,.22,.1,.04,'#d6edc0');
const tail=new THREE.Group();tail.position.set(0,.38,.36);body.add(tail);const tailParts=[];
for(let i=0;i<7;i++){const o=ball(tail,0,.12+i*.055,.14+i*.19,.27-i*.015,.24-i*.012,.25-i*.012,i%2?'#3b4b4b':'#a1a995');tailParts.push(o);}tail.rotation.y=.9;
raccoon.scale.setScalar(1.38);raccoon.position.set(0,0,4);
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=64;const sh=shadowCanvas.getContext('2d'),sg=sh.createRadialGradient(32,32,0,32,32,32);sg.addColorStop(0,'rgba(5,18,23,.65)');sg.addColorStop(1,'rgba(5,18,23,0)');sh.fillStyle=sg;sh.fillRect(0,0,64,64);const shadow=new THREE.Mesh(new THREE.PlaneGeometry(3,4),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.set(0,.045,4);scene.add(shadow);
// Roofs and little shops are recycled as the run moves through the city.
const chunks=new Map(),objects=new Map(),sceneRoot=new THREE.Group();scene.add(sceneRoot);
function makeRoof(c){const g=new THREE.Group();sceneRoot.add(g);const roofColors=['#36665e','#497372','#4d656b'];const floor=box(g,0,-.38,-7,13,.7,46,roofColors[Math.floor(c/7)%3]);floor.receiveShadow=true;
box(g,0,-7,-7,12.85,12.5,46,'#344a48');
for(const x of [-6.53,6.53]){box(g,x,.11,-7,.18,.4,46,'#779889');box(g,x,.31,-7,.2,.06,46,'#a4b79a');box(g,x,-2.6,-7,.04,.13,45,'#cca271',true);for(let k=0;k<6;k++){box(g,x,-4,-27+k*7,.06,1.3,2.3,'#d99b64',true);box(g,x*1.02,-4.0,-27+k*7,.07,1.4,.11,'#354f50');}}
for(let k=0;k<12;k++)box(g,0,.01,-28+k*4,12.8,.025,.045,'#759083');
for(const x of [-1.8,1.8])for(let k=0;k<9;k++)box(g,x,.025,-26+k*5,.048,.018,1.1,'#9eb698');
const bridgeLane=LANES[c%3];box(g,c<2?0:bridgeLane,-.06,-31,c<2?12.6:2.5,.19,2.5,'#82cdb1');for(let j=0;j<6;j++)box(g,c<2?0:bridgeLane,.045,-32+j*.42,c<2?12.6:2.5,.02,.025,'#b4e8c0');
for(const x of [-6.2,6.2]){for(let k=0;k<2;k++){const z=-18+k*23;box(g,x,3.1,z,.1,6.2,.1,'#8b7761');lantern(g,x,4.4,z,'#ff9966',.85);}}
// Overhead strings stay safely above the player.
const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-6.2,5.8,-15),new THREE.Vector3(0,4.7,-15),new THREE.Vector3(6.2,5.8,-15)]);g.add(new THREE.Mesh(new THREE.TubeGeometry(curve,16,.024,4,false),mat('#766a58')));for(let k=0;k<7;k++){const x=-5.6+k*1.87;lantern(g,x,4.55+x*x*.029,-15,k%2?'#f6c977':'#ff9471',.65);}
// Side streets, awnings, rooftop gardens, water towers, and glowing signs.
for(const s of [-1,1])for(let k=0;k<3;k++){const z=-9-k*17,x=s*(13+random(c*90+k+s+20)*4),h=4+random(c*14+k+9)*6,w=6.5+random(c+k+15)*4;
box(g,x,-5+h*.35,z,w,8+h,13,['#515357','#42686a','#705f58'][Math.abs(c+k+s)%3]);box(g,x,-.8+h*.85,z,w+.4,.4,13.4,'#365f62');
for(let j=0;j<4;j++)box(g,x-w/2+.9+j*w/4,-2.1,z+6.56,.8,1.5,.03,k%2?'#d9a767':'#8dc2b0',true);
const awning=box(g,x,-5.3,z+7.2,w,.25,2.8,k%2?'#d88a62':'#72a89c');awning.rotation.x=.17;
for(let j=0;j<6;j++)box(g,x-w/2+.65+j*w/6,-5.3,z+7.23,.35,.28,2.8,'#efd6a6').rotation.x=.17;
sign(g,['拉麵','夜市場','深夜食堂','串焼','深夜茶屋','24 H'][Math.abs(c*3+k+s)%6],x,1.4+h*.85,z+6.8,w*.78,2.5,k%2?'#32534e':'#68463f',k%2?'#d3f59b':'#ffc79a',0);
lantern(g,x-w*.35,-3.9,z+8.3,'#ffa66a',.7);lantern(g,x+w*.35,-3.9,z+8.3,'#ffa66a',.7);
if(k===1){mesh(cylGeo,'#789491',x,1+h*.85,z,1.7,3,1.7,g);mesh(new THREE.ConeGeometry(1.85,.8,12),'#32595a',x,2.9+h*.85,z,1,1,1,g);for(const a of [-1,1])for(const b of [-1,1])box(g,x+a*1.1,-.8+h*.85,z+b*1.1,.12,2.2,.12,'#9ca797');}
}
// Rooftop props sit outside the skate lanes.
for(const s of [-1,1]){const x=s*5.6,z=s===1?4:-24;box(g,x,.43,z,.85,.85,1.6,'#8fa9a0');box(g,x,.87,z,.75,.08,1.4,'#b4c2af');for(let k=0;k<6;k++)box(g,x-s*.44,.49,z-.6+k*.22,.035,.38,.04,'#526b65');box(g,x,.2,z+4,.75,.4,.75,'#b89576');for(let k=0;k<3;k++)ball(g,x+(k-1)*.21,.62,z+4,.24,.5,.23,k%2?'#7b9a62':'#a6b577');}
batchStaticGroup(g);chunks.set(c,g);return g;}
function createEntity(e){const g=new THREE.Group();g.position.x=LANES[e.lane+1];sceneRoot.add(g);objects.set(e.id,{g,e});
 if(e.kind==='coin'){const o=mesh(cylGeo,'#ffcd72',0,1.08,0,.3,.09,.3,g,true);o.rotation.x=Math.PI/2;const ring=new THREE.Mesh(new THREE.TorusGeometry(.21,.025,5,16),mat('#fff0b3',true));ring.position.set(0,1.08,.052);g.add(ring);box(g,0,1.08,.06,.065,.24,.02,'#ffedb1',true);}
 if(e.kind==='ramen'){const o=mesh(new THREE.SphereGeometry(.47,14,8,0,Math.PI*2,Math.PI/2,Math.PI/2),'#f0e6c7',0,1.2,0,1,1,1,g);const soup=mesh(cylGeo,'#d6995d',0,1.19,0,.43,.06,.43,g);const rim=new THREE.Mesh(new THREE.TorusGeometry(.455,.045,6,18),mat('#e37152'));rim.rotation.x=Math.PI/2;rim.position.y=1.23;g.add(rim);for(let i=0;i<3;i++){const noodles=new THREE.Mesh(new THREE.TorusGeometry(.18-i*.04,.022,4,12),mat('#ffe2a0'));noodles.rotation.x=Math.PI/2;noodles.position.set(-.04,1.24,0);g.add(noodles);}ball(g,.2,1.24,-.1,.12,.06,.14,'#e7f0cd');ball(g,.2,1.28,-.1,.055,.025,.066,'#edb863');for(const x of [-.14,.03])tube(g,new THREE.Vector3(x,1.2,.18),new THREE.Vector3(x+.2,1.9,-.27),.024,'#f4c893');glow(g,0,1.2,0,'#ffd39b',2.1);}
 if(e.kind==='crate'){box(g,0,.59,0,1.65,1.18,1.55,'#bb8260').castShadow=true;for(const z of [-.79,.79]){for(const x of [-.65,.65])box(g,x,.59,z,.13,1.15,.06,'#e7b384');for(const y of [.12,.97])box(g,0,y,z,1.65,.14,.06,'#e7b384');const strip=box(g,0,.58,z,1.76,.12,.07,'#e7b384');strip.rotation.z=.5;}box(g,0,1.2,0,1.66,.1,1.59,'#c7956a');}
 if(e.kind==='gate'){for(const x of [-1.3,1.3]){box(g,x,1.32,0,.15,2.65,.2,'#ce7c58');box(g,x,.08,0,.55,.16,.55,'#304e50');}box(g,0,2.07,0,2.76,1.05,.25,'#24413f');sign(g,'小心碰頭',0,2.08,.14,2.5,.87,'#744b3d','#ffc68c');for(const x of [-.8,0,.8])box(g,x,1.48,0,.33,.13,.3,'#f7c779',true);}
 if(e.kind==='rail'){const mid=-e.length/2;box(g,0,.72,mid,.15,.14,e.length,'#92edd3',true);for(let k=0;k<4;k++)box(g,0,.35,-k*(e.length/3),.12,.7,.12,'#718b83');for(const z of [0,-e.length])box(g,0,.05,z,.7,.1,.45,'#98ba9d');}
 if(e.kind==='ramp'){const shape=new THREE.Shape();shape.moveTo(-1.1,0);shape.lineTo(1.1,0);shape.lineTo(1.1,.73);shape.closePath();const geom=new THREE.ExtrudeGeometry(shape,{depth:2.15,bevelEnabled:false});const ramp=new THREE.Mesh(geom,mat('#89b89c'));ramp.rotation.y=Math.PI/2;ramp.position.x=-1.075;g.add(ramp);box(g,0,.1,1.12,2.2,.05,.14,'#d1f3a4',true);}
 if(e.kind==='magnet'){const arc=new THREE.Mesh(new THREE.TorusGeometry(.39,.12,6,20,Math.PI),mat('#b3edbe',true));arc.position.y=1.5;arc.rotation.z=Math.PI;g.add(arc);for(const x of [-.39,.39])box(g,x,1.66,0,.24,.37,.24,'#f29887',true);glow(g,0,1.4,0,'#d4f8ae',2.8);}
 return g;}
function syncWorld(distance){const base=Math.max(0,Math.floor(distance/48)-1);for(let c=base;c<base+6;c++){const g=chunks.get(c)||makeRoof(c);g.position.z=distance-c*48;}
for(const [c,g]of chunks)if(c<base||c>=base+6){sceneRoot.remove(g);g.traverse(o=>{if(o.geometry&&![boxGeo,sphereGeo,cylGeo,coneGeo].includes(o.geometry))o.geometry.dispose();if(o.material?.map&&o.material.map!==glowMap&&!signTexturesHas(o.material.map))o.material.map.dispose();if(o.material&&!Array.from(matCache.values()).includes(o.material))o.material.dispose();});chunks.delete(c);}
for(const e of game.entities){if(e.d>distance+155)continue;const obj=objects.get(e.id),g=obj?.g||createEntity(e);g.position.z=4+distance-e.d;g.visible=!e.hit;}
for(const [id,o]of objects)if(o.e.d<distance-20){sceneRoot.remove(o.g);o.g.traverse(n=>{if(n.geometry&&![boxGeo,sphereGeo,cylGeo,coneGeo].includes(n.geometry))n.geometry.dispose();if(n.material&&!Array.from(matCache.values()).includes(n.material))n.material.dispose();});objects.delete(id);}}
function signTexturesHas(t){for(const v of signTextures.values())if(v===t)return true;return false;}
// Small particles make pickups, grinds, and landings feel tangible.
const particles=[],particleGeo=new THREE.SphereGeometry(1,4,3);
function burst(color,count=12,power=1){if(reduced)count=Math.ceil(count/3);for(let i=0;i<count;i++){const m=mesh(particleGeo,color,game.x,.7+Math.max(0,game.y),4,.045,.045,.045,scene,true);particles.push({m,v:new THREE.Vector3((Math.random()-.5)*6*power,Math.random()*5*power,(Math.random()-.5)*5),life:.35+Math.random()*.35});}}
let audioCtx,soundOn=false,nextBeat=0,beat=0;
function ensureAudio(){audioCtx??=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();}
function tone(f,d=.12,type='sine',volume=.045,delay=0){if(!soundOn||!audioCtx)return;const o=audioCtx.createOscillator(),gain=audioCtx.createGain(),t=audioCtx.currentTime+delay;o.type=type;o.frequency.setValueAtTime(f,t);gain.gain.setValueAtTime(volume,t);gain.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(gain);gain.connect(audioCtx.destination);o.start(t);o.stop(t+d);}
function music(){if(!soundOn||game.status!=='running'||!audioCtx)return;const now=audioCtx.currentTime;if(now>=nextBeat){nextBeat=now+.31;const notes=[220,0,329.63,0,293.66,0,246.94,329.63,196,0,293.66,0,261.63,0,246.94,0];if(notes[beat%16])tone(notes[beat%16],.35,'sine',.025);if(beat%4===0)tone([110,98,82.41,98][Math.floor(beat/8)%4],.48,'triangle',.045);if(beat%2===0)tone(54,.08,'sine',.06);beat++;}}
let toastTimer, trickTimer,helpWasRunning=false,mode='cruise',best=0,lastZone=0,lastHint=0,shake=0,slowFrameCount=0;
try{best=Number(localStorage.getItem('rooftop-rascal-best')||0);}catch{}$('intro-best').textContent=best.toLocaleString();
function toast(s,duration=2600){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),duration);}
function trickText(label,points=''){ $('trick-label').replaceChildren(document.createTextNode(label));const small=document.createElement('small');small.textContent=points?`+${points} · 漂亮落地`:'让屋顶记住你的名字';$('trick-label').append(small);$('trick-label').classList.add('show');clearTimeout(trickTimer);trickTimer=setTimeout(()=>$('trick-label').classList.remove('show'),1250);}
const game=new Game((type,data)=>{
 if(type==='jump')tone(220,.16,'triangle',.05);
 if(type==='trick'){tone(440,.1,'sine');tone(660,.17,'sine',.05,.07);}
 if(type==='coin'){tone(800+(game.coins%5)*90,.09,'sine',.024);burst('#ffd88c',4,.5);}
 if(type==='ramen'){tone(523,.12);tone(784,.2,'sine',.05,.1);toast('宵夜到手！ +20 夜行能量');burst('#ffcf91',16);}
 if(type==='magnet'){tone(659,.2);tone(988,.2,'sine',.05,.12);toast('磁力时间 · 10 秒自动吸取金币');burst('#c4eab1',18);}
 if(type==='boost'){tone(110,.5,'sawtooth',.025);trickText('NIGHT RUSH');toast('夜行冲刺！4 秒无敌加速');burst('#c5f58c',28,1.7);}
 if(type==='reward'){trickText(data.label,data.points);tone(523,.1);tone(659,.12,'sine',.04,.08);}
 if(type==='land'){burst('#dae8c1',9,.55);tone(95,.1,'triangle',.08);}
 if(type==='grind')toast('滑杆中！跳跃离轨可接翻板');
 if(type==='ramp'){trickText('AIR TIME');tone(340,.16);}
 if(type==='hit'){shake=.45;$('flash').style.opacity=1;setTimeout(()=>$('flash').style.opacity=0,180);tone(85,.25,'sawtooth',.06);burst('#ff976f',20,1.4);toast(game.mode==='practice'?'再试一次，屋顶会接住你':data.kind==='gap'?'差一点！注意薄荷色桥面和屋顶缺口':'哎呀！换个路线继续滑');}
 if(type==='mission'){toast('小目标达成！ +1,000 分',3400);tone(523,.15);tone(659,.15,'sine',.04,.13);tone(784,.3,'sine',.04,.26);burst('#c5f58c',24,1.5);}
 if(type==='hint')toast(data.text);
 if(type==='over')finish();
});
function setMode(m){mode=m;document.querySelectorAll('.mode').forEach(b=>{b.classList.toggle('active',b.dataset.mode===m);b.setAttribute('aria-pressed',String(b.dataset.mode===m));});$('mode-description').textContent={cruise:'3 次机会 · 无限街区 · 越滑越快',timed:'120 秒倒计时 · 3 次机会 · 冲击最高分',practice:'无限机会 · 舒适速度 · 尽情练习连招'}[m];}
function closeDialogs(){hidden('dialog-backdrop',true);['help-dialog','pause-dialog','result-dialog'].forEach(id=>hidden(id,true));}
function showDialog(id){closeDialogs();hidden('dialog-backdrop',false);hidden(id,false);requestAnimationFrame(()=>$(id).querySelector('button')?.focus());}
function start(){closeDialogs();for(const [id,o]of objects){sceneRoot.remove(o.g);o.g.traverse(n=>{if(n.geometry&&![boxGeo,sphereGeo,cylGeo,coneGeo].includes(n.geometry))n.geometry.dispose();if(n.material&&!Array.from(matCache.values()).includes(n.material))n.material.dispose();});}objects.clear();game.reset(mode);lastZone=0;lastHint=0;app.classList.add('playing');['intro','character-tag','intro-note'].forEach(id=>hidden(id,true));['hud','pause','mobile-controls'].forEach(id=>hidden(id,false));hidden('timer',mode!=='timed');$('mode-label').textContent={cruise:'NIGHT CRUISE',timed:'TIME ATTACK',practice:'FREE SKATE'}[mode];$('toast').classList.remove('show');toast('出发！A / D 换道，空格跳跃',3500);syncWorld(0);if(soundOn)ensureAudio();}
function finish(){const score=Math.floor(game.score),record=game.mode!=='practice'&&score>best;if(record){best=score;try{localStorage.setItem('rooftop-rascal-best',String(best));}catch{}}$('intro-best').textContent=best.toLocaleString();$('result-score').textContent=score.toLocaleString();$('result-distance').textContent=Math.floor(game.distance)+'m';$('result-ramen').textContent=game.ramen;$('result-tricks').textContent=game.tricks;$('result-missions').textContent=`完成 ${game.missionDone} / 3 个夜市小目标`;$('result-title').textContent=game.mode==='timed'&&game.time>=120?'午夜挑战完成。':'漂亮的一趟。';hidden('new-best',!record);hidden('pause',true);hidden('mobile-controls',true);showDialog('result-dialog');}
function home(){closeDialogs();game.status='idle';app.classList.remove('playing');['intro','character-tag','intro-note'].forEach(id=>hidden(id,false));['hud','pause','mobile-controls'].forEach(id=>hidden(id,true));game.reset(mode);game.status='idle';syncWorld(0);$('toast').classList.remove('show');$('trick-label').classList.remove('show');$('start').focus();}
function pause(){if(game.status==='running'){game.status='paused';game.duck=false;showDialog('pause-dialog');}else if(game.status==='paused')resume();}
function resume(){closeDialogs();game.status='running';game.duck=false;}
$('start').onclick=start;$('again').onclick=start;$('restart-pause').onclick=start;$('home').onclick=home;$('home-pause').onclick=home;$('resume').onclick=resume;$('pause').onclick=pause;$('boost-btn').onclick=()=>game.action('boost');
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
$('help').onclick=()=>{helpWasRunning=game.status==='running';if(helpWasRunning)game.status='paused';showDialog('help-dialog');};
document.querySelectorAll('.close-dialog').forEach(b=>b.onclick=()=>{closeDialogs();if(helpWasRunning){game.status='running';helpWasRunning=false;}else if(game.status==='paused')showDialog('pause-dialog');else $('start').focus();});
$('sound').onclick=()=>{soundOn=!soundOn;if(soundOn){ensureAudio();tone(523,.12);tone(784,.18,'sine',.03,.1);}$('sound-wave').setAttribute('d',soundOn?'M15 8a5 5 0 0 1 0 8m3-11a9 9 0 0 1 0 14':'m16 9 5 6m0-6-5 6');$('sound').title=soundOn?'关闭声音':'开启声音';$('sound').setAttribute('aria-label',$('sound').title);};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await app.requestFullscreen();}catch{toast('此浏览器暂不支持全屏');}};
const keyActions={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',Space:'jump',KeyW:'jump',KeyX:'jump',ShiftLeft:'boost',ShiftRight:'boost'};
window.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.repeat)return;if(e.code==='Escape'){if(!$('help-dialog').classList.contains('hidden')){document.querySelector('.close-dialog').click();return;}if(game.status==='running'||game.status==='paused')pause();return;}if(e.code==='KeyP'){if($('help-dialog').classList.contains('hidden'))pause();return;}if(!$('dialog-backdrop').classList.contains('hidden')){if(e.code==='Space'&&game.status==='over')start();return;}if(e.code==='Space'&&game.status==='idle'){start();return;}if(e.code==='ArrowDown'||e.code==='KeyS')game.duck=true;if(keyActions[e.code])game.action(keyActions[e.code]);});
window.addEventListener('keyup',e=>{if(e.code==='ArrowDown'||e.code==='KeyS')game.duck=false;});
window.addEventListener('blur',()=>{if(game.status==='running')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.status==='running')pause();});
// Keep keyboard focus inside game dialogs.
$('dialog-backdrop').addEventListener('keydown',e=>{if(e.key!=='Tab')return;const els=[...$('dialog-backdrop').querySelector('.dialog:not(.hidden)').querySelectorAll('button')];const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault();}});
document.querySelectorAll('[data-action]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(b.dataset.action==='duck')game.duck=true;else game.action(b.dataset.action);});b.addEventListener('pointerup',()=>{if(b.dataset.action==='duck')game.duck=false;});b.addEventListener('pointercancel',()=>game.duck=false);});
let touchStart;let duckTimeout;$('world').addEventListener('pointerdown',e=>{touchStart={x:e.clientX,y:e.clientY};});$('world').addEventListener('pointerup',e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;touchStart=null;if(Math.max(Math.abs(dx),Math.abs(dy))<24){game.action('jump');return;}if(Math.abs(dx)>Math.abs(dy))game.action(dx>0?'right':'left');else if(dy<0)game.action('jump');else{game.duck=true;clearTimeout(duckTimeout);duckTimeout=setTimeout(()=>game.duck=false,900);}});$('world').addEventListener('pointercancel',()=>touchStart=null);
function updateHUD(){const score=Math.floor(game.score);$('score').textContent=String(score).padStart(6,'0');$('distance').textContent=Math.floor(game.distance)+' m';$('hearts').textContent=game.mode==='practice'?'∞':'♥ '.repeat(Math.max(0,game.lives))+'♡ '.repeat(Math.max(0,3-game.lives));$('energy-label').textContent=Math.floor(game.energy)+'%';$('energy-bar').style.width=game.energy+'%';$('boost-btn').classList.toggle('ready',game.energy>=50&&game.boost<=0);$('boost-btn').firstChild.textContent=game.boost>0?'冲刺中… ':'冲刺 ';$('mission-total').textContent=game.missionDone+' / 3';for(const [key,value,total]of [['ramen',game.ramen,12],['trick',game.tricks,5],['grind',Math.floor(game.grindTime),8]]){const el=$('mission-'+key);el.classList.toggle('done',value>=total);el.querySelector('b').textContent=Math.min(value,total)+' / '+total+(key==='grind'?'s':'');}const sec=Math.max(0,120-Math.floor(game.time));$('timer').textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');hidden('combo',game.multiplier<=1);$('combo').querySelector('strong span').textContent=game.multiplier;$('combo').querySelector('i').style.width=(game.comboTime/4.5*100)+'%';const zone=Math.floor(game.distance/336)%3;const names=[['灯笼巷','LANTERN LANE'],['拉面街','RAMEN STREET'],['霓虹天台','NEON HEIGHTS']];$('run-zone').innerHTML=`<span>0${zone+1}</span> ${names[zone][0]} <small>${names[zone][1]}</small>`;if(zone!==lastZone){lastZone=zone;toast('新的街区 · '+names[zone][0]);}const hints=[[6,'跳起来，再按一次空格就是翻板！'],[11,'前方栏杆：跳上去，自动进入滑行'],[14,'屋顶有缺口，跳过去或走薄荷色桥面'],[22,'看到「小心碰头」？按住 ↓ 俯身'],[30,'拉面补充能量，攒够 50 就能冲刺']];if(lastHint<hints.length&&game.time>hints[lastHint][0])toast(hints[lastHint++][1],3400);}
function animatePlayer(dt,t){const idle=game.status==='idle',moving=game.status==='running';const targetX=idle?(innerWidth<640?1.65:3.5):game.x;raccoon.position.x+=(targetX-raccoon.position.x)*Math.min(1,dt*10);raccoon.position.y=idle?Math.sin(t*1.7)*.025:game.y;raccoon.position.z=idle?5:4;raccoon.scale.setScalar(idle?1.8:1.25);
let ry=idle?-2.55:0;let current=raccoon.rotation.y;while(ry-current>Math.PI)ry-=Math.PI*2;while(current-ry>Math.PI)ry+=Math.PI*2;raccoon.rotation.y+=(ry-current)*Math.min(1,dt*6);
const bank=moving?(LANES[game.lane+1]-game.x)*-.12:Math.sin(t*1.3)*.06;lean.rotation.z=bank+(game.railId?Math.sin(t*8)*.045:0);body.rotation.x=game.duck?.8:Math.sin(t*2)*.025;body.scale.y=game.duck?.58:1;body.position.y=game.duck?.42:.45;head.rotation.y=idle?Math.sin(t*.75)*.14:(LANES[game.lane+1]-game.x)*.08;armL.rotation.z=(game.y>.2?-.75:0)+Math.sin(t*3)*.1;armR.rotation.z=(game.y>.2?.75:0)+Math.sin(t*3+1)*.1;tail.rotation.y=.75+Math.sin(t*3)*.25;tail.rotation.x=Math.sin(t*4)*.1;
board.rotation.z=game.trickAnim>0?Math.sin((1-game.trickAnim/.55)*Math.PI*2)*Math.PI:0;board.rotation.y=game.trickAnim>0?(1-game.trickAnim/.55)*Math.PI*2:0;if(!game.trickAnim){board.rotation.z=0;board.rotation.y=0;}
raccoon.visible=true;shadow.position.x=raccoon.position.x;shadow.position.z=raccoon.position.z;shadow.material.opacity=clamp(1-game.y*.22,.1,1);shadow.scale.setScalar(1+Math.max(0,game.y)*.1);playerLight.position.x=raccoon.position.x;
if(moving&&game.railId&&Math.random()<.6)burst('#ffd083',1,.45);if(moving&&game.boost>0&&Math.random()<.5)burst('#c3f3b2',2,.8);}
let prev=performance.now(),elapsed=0,hudClock=0;const camTarget=new THREE.Vector3(),look=new THREE.Vector3();
function frame(now){requestAnimationFrame(frame);const raw=(now-prev)/1000,dt=Math.min(raw,.04);prev=now;elapsed+=dt;game.update(dt);syncWorld(game.distance);animatePlayer(dt,elapsed);music();hudClock+=dt;if(hudClock>.09){if(game.status==='running')updateHUD();hudClock=0;}
const idle=game.status==='idle',mobile=innerWidth<640;if(idle){camTarget.set(mobile?4:10,mobile?12:11.5,mobile?23:23);look.set(mobile?-3:-3,1.1,mobile?-5:-8);}else{camTarget.set(game.x*.23+(mobile?0:1.3),(mobile?10:7.1)+game.y*.18,(mobile?23:14.5)+(game.boost>0?1:0));look.set(game.x*.32,.6,mobile?-8:-13);}
camera.position.lerp(camTarget,Math.min(1,dt*(idle?2.5:4)));if(shake>0&&!reduced){shake-=dt;camera.position.x+=Math.sin(now*.09)*shake*.6;camera.position.y+=Math.cos(now*.07)*shake*.4;}camera.lookAt(look);const targetFov=idle?(mobile?53:48):(game.boost>0?(mobile?70:59):(mobile?63:51));camera.fov+=(targetFov-camera.fov)*dt*3;camera.updateProjectionMatrix();
for(const {g,e}of objects.values()){if(e.kind==='coin'){g.rotation.y=elapsed*1.7;g.position.y=Math.sin(elapsed*3+e.d)*.07;}else if(e.kind==='ramen'||e.kind==='magnet'){g.rotation.y=elapsed*.8;g.position.y=Math.sin(elapsed*2.5+e.d)*.13;}}
for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.v.y-=12*dt;p.m.position.addScaledVector(p.v,dt);p.m.position.z+=game.status==='running'?game.speed*dt:0;p.m.scale.setScalar(Math.max(0,p.life)*.12);if(p.life<=0){scene.remove(p.m);particles.splice(i,1);}}
renderer.render(scene,camera);
if(raw>.06&&game.status==='running')slowFrameCount++;else slowFrameCount=Math.max(0,slowFrameCount-1);if(slowFrameCount>120&&renderer.getPixelRatio()>1){renderer.setPixelRatio(1);slowFrameCount=0;}
}
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
$('world').addEventListener('webglcontextlost',e=>{e.preventDefault();if(game.status==='running')pause();hidden('error',false);});
window.addEventListener('error',e=>{console.error('Rooftop Rascal:',e.message);});
syncWorld(0);camera.position.set(16,10.5,23);camera.lookAt(-3,1.1,-8);hidden('loading',true);requestAnimationFrame(frame);
