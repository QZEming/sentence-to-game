import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {LANES} from './engine.js';
const V=THREE.Vector3;
export class RailwayScene {
 constructor(container,onPick){
  this.container=container;this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#b8cec5');this.scene.fog=new THREE.Fog('#b8cec5',115,235);
  this.camera=new THREE.PerspectiveCamera(41,1,.2,500);this.camera.position.set(51,61,74);
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;container.appendChild(this.renderer.domElement);
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(0,0,0);this.controls.enableDamping=true;this.controls.dampingFactor=.06;this.controls.minDistance=35;this.controls.maxDistance=155;this.controls.maxPolarAngle=Math.PI*.44;this.controls.minPolarAngle=.2;this.controls.enablePan=true;
  this.ambient=new THREE.HemisphereLight('#e7f6ed','#586850',2.3);this.scene.add(this.ambient);
  this.sun=new THREE.DirectionalLight('#ffe9be',3);this.sun.position.set(-35,65,-20);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-80,right:80,top:65,bottom:-65,near:1,far:170});this.sun.shadow.normalBias=.08;this.scene.add(this.sun);
  this.materials={};this.trains=new Map();this.labels=[];this.signals={};this.lastNight=false;this.routeLines=[];this.onPick=onPick;this.buildWorld();
  this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();let down;
  container.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});
  container.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;const r=container.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hits=this.ray.intersectObjects([...this.trains.values()],true);if(hits.length){let o=hits[0].object;while(o&&!o.userData.trainId)o=o.parent;if(o)this.onPick(o.userData.trainId)}});
  new ResizeObserver(()=>this.resize()).observe(container);this.resize();
 }
 mat(color,roughness=.8){const key=color+roughness;if(!this.materials[key])this.materials[key]=new THREE.MeshStandardMaterial({color,roughness});return this.materials[key]}
 box(x,y,z,w,h,d,color,parent=this.scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),this.mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 cylinder(x,y,z,r,h,color,segments=8,parent=this.scene){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),this.mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
 cone(x,y,z,r,h,color,segments=6){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,segments),this.mat(color));m.position.set(x,y,z);m.castShadow=true;this.scene.add(m);return m}
 path(points,color,r=.065){const c=new THREE.CatmullRomCurve3(points.map(p=>new V(...p)));const m=new THREE.Mesh(new THREE.TubeGeometry(c,Math.max(32,points.length*12),r,5,false),this.mat(color));m.receiveShadow=true;this.scene.add(m);return m}
 buildWorld(){
  this.box(0,-2.6,0,133,5,82,'#526d58');this.box(0,-.3,0,133,.8,82,'#87a679');
  let seed=22;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
  // River carved visually across the working railway terrain.
  const river=new THREE.Shape();const riverX=z=>29+Math.sin(z*.105)*3.2;river.moveTo(riverX(-41)-3.4,-41);for(let z=-41;z<=41;z+=2)river.lineTo(riverX(z)-3.4,z);for(let z=41;z>=-41;z-=2)river.lineTo(riverX(z)+3.4,z);river.closePath();const water=new THREE.Mesh(new THREE.ShapeGeometry(river),this.mat('#579eaa',.22));water.rotation.x=-Math.PI/2;water.position.y=.17;this.scene.add(water);
  for(let i=0;i<30;i++){const z=-38+random()*76;this.box(riverX(-z)-2+random()*4,.2,z,.8+random()*2,.025,.06,'#a8d1ce')}
  // Mountain skyline, clustered low-poly forest and textured pasture.
  for(let i=0;i<14;i++){const x=-63+i*9.7,h=8+random()*13,z=-31-random()*5;this.cone(x,h/2,z,8+random()*7,h,i%3===0?'#798b79':'#697f6c',5);if(h>17)this.cone(x,h-2,z,2.6,4.5,'#c0c9b6',5)}
  const trees=[];for(let i=0;i<205;i++){let x=-61+random()*122,z=-36+random()*72;if(Math.abs(z)<12&&Math.abs(x)<56)continue;if(Math.abs(x-riverX(-z))<6)continue;if(x>-15&&x<21&&z>-18&&z<23)continue;trees.push({x,z,s:.8+random()*1.2})}
  const trunk=new THREE.InstancedMesh(new THREE.CylinderGeometry(.16,.22,2,5),this.mat('#6a6350'),trees.length);const foliage=new THREE.InstancedMesh(new THREE.ConeGeometry(1.3,3.8,6),this.mat('#376c56'),trees.length*2);const dummy=new THREE.Object3D();trees.forEach((t,i)=>{dummy.position.set(t.x,1,t.z);dummy.scale.set(t.s,t.s,t.s);dummy.updateMatrix();trunk.setMatrixAt(i,dummy.matrix);for(let j=0;j<2;j++){dummy.position.set(t.x,2.2*t.s+j*1.1*t.s,t.z);dummy.scale.setScalar(t.s*(j?.77:1));dummy.updateMatrix();foliage.setMatrixAt(i*2+j,dummy.matrix)}});trunk.castShadow=true;foliage.castShadow=true;this.scene.add(trunk,foliage);
  for(let i=0;i<65;i++){const x=-61+random()*122,z=-35+random()*70;if(Math.abs(z)<12||Math.abs(x-riverX(-z))<6)continue;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.3+random()*.6,0),this.mat('#99a590'));rock.position.set(x,.35,z);rock.scale.y=.7;this.scene.add(rock)}
  this.box(0,.17,-17,90,.15,2.3,'#b1b09a');for(let x=-41;x<43;x+=5)this.box(x,.26,-17,2,.025,.08,'#e5dcca');
  // Track beds, sleepers and polished steel rails.
  const trackSets=[[-64,-22,0],[22,64,0]];for(const [a,b,z]of trackSets)this.straightTrack(a,b,z);
  for(const lane of [1,2,3]){const z=LANES[lane];this.straightTrack(-13,13,z);for(const sign of [-1,1]){const pts=[[sign*22,.25,0],[sign*19,.25,z*.2],[sign*16,.25,z*.8],[sign*13,.25,z]];const bed=this.path(pts,'#777c6b',1.05);bed.scale.y=.35;bed.position.y=.18;for(const side of[-1,1])this.path(pts.map(p=>[p[0],.43,p[2]+side*.58]),'#b6bcb2',.06);for(let j=0;j<12;j++){const t=j/12,x=sign*(22-9*t),zz=z*(t*t*(3-2*t));const sleeper=this.box(x,.29,zz,.22,.16,1.7,'#655e4d');sleeper.rotation.y=-Math.atan2(z*6*t*(1-t),sign*-9)}}}
  // Live route preview directly on the selected station track.
  for(const lane of[1,2,3]){const pts=[];for(let x=-22;x<=22;x+=1)pts.push(new V(x,.57,this.laneZ(x,lane)));const route=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),90,.11,5,false),new THREE.MeshBasicMaterial({color:'#e4eaba',transparent:true,opacity:.7}));route.visible=false;this.scene.add(route);this.routeLines.push({lane,route})}
  // Bridge over river, including steel trusses and piers.
  this.box(29,.38,0,10,.42,3.5,'#78877e');for(const railZ of[-.58,.58])this.box(29,.65,railZ,10,.12,.105,'#b4bcb0');for(const z of[-1.8,1.8]){this.box(29,1.55,z,10,.17,.18,'#526866');this.box(29,.65,z,10,.17,.18,'#526866');for(let x=24;x<=34;x+=2){this.box(x,1.13,z,.15,1.1,.15,'#526866');const diag=this.box(x+.8,1.1,z,.12,2,.12,'#526866');diag.rotation.z=-.98}}for(const x of[25,33])this.box(x,-.1,0,.9,2,3,'#7d8476');
  // Passenger station and island platforms.
  this.box(0,.6,-4.5,28,.7,2.4,'#c1bda5');this.box(0,.97,-3.35,28,.045,.18,'#e8c16e');this.box(0,.6,4.45,28,.7,1.7,'#bab79f');this.box(0,.97,3.7,28,.045,.15,'#e8c16e');
  this.box(-2,2.1,-7.4,11,3.6,4,'#e0d8bb');this.box(-2,4.05,-7.4,12,.4,4.8,'#446f64');this.box(-2,4.38,-7.4,11.6,.28,4.1,'#477568');this.box(-2,4.7,-7.4,11.2,.25,3.1,'#477568');
  for(const x of[-6,-3,0,3]){this.box(x,2.45,-5.36,1.3,1.6,.06,'#456a67');this.box(x,2.45,-5.29,.08,1.6,.03,'#e4daba')};this.box(-1,1.8,-5.28,1.2,2.4,.12,'#766d58');
  for(const x of[-11,-6,-1,4,9]){this.cylinder(x,2,-4.5,.085,3,'#426b5d');this.box(x,3.5,-4.5,5,.18,2.9,'#496f64');this.box(x,1.1,-4.9,1.4,.14,.4,'#7e6547')}
  // Signal box and freight terminal.
  this.box(-18,2.5,-6,3,4.6,3,'#d4c8a4');this.box(-18,4.25,-6,3.4,1.1,3.4,'#54786b');this.box(-18,5,-6,3.9,.25,3.9,'#3c5c51');for(const z of[-7.71,-4.29])this.box(-18,4.3,z,2.7,.65,.06,'#a4c5c0');
  this.box(4,.3,14.5,30,.35,8.5,'#a8ac95');this.box(9,2.9,18,12,5,5,'#8b9b89');this.box(9,5.6,18,13,.5,6,'#5d7268');for(let x=5;x<14;x+=3)this.box(x,2.4,15.42,2.5,3.6,.12,'#677c72');
  for(let i=0;i<8;i++){const x=-9+(i%4)*4.8,z=12+Math.floor(i/4)*2.5;this.box(x,1.2,z,4.4,1.6,1.95,['#9f6655','#62838a','#b29b60','#788a77'][i%4]);for(let j=0;j<7;j++)this.box(x-1.8+j*.6,1.25,z+1,.075,1.4,.03,['#ad7460','#729397','#c2aa6d','#889888'][i%4])}
  for(const x of[-3,5]){this.box(x,3.8,9.7,.3,7,.3,'#d9af58');this.box(x,3.8,14.4,.3,7,.3,'#d9af58');this.box(x,7.3,12,.5,.5,5.8,'#dab563')}this.box(1,7.6,11,8.5,.45,.45,'#d7b05a');this.cylinder(1,6.1,11,.04,2.5,'#4d6059');
  for(const side of ['west','east']){const x=side==='west'?-23:23;this.cylinder(x,1.7,-2,.12,3,'#52645b');this.box(x,3.3,-2,.6,1.2,.5,'#263f38');const light=new THREE.Mesh(new THREE.SphereGeometry(.17,10,8),new THREE.MeshStandardMaterial({color:'#fa846c',emissive:'#fa6040',emissiveIntensity:1.5}));light.position.set(x,3.4,-1.71);this.scene.add(light);this.signals[side]=light}
  // Fence, station lights and a small service road.
  for(let x=-15;x<20;x+=2.2){this.box(x,.9,20.6,.12,1.4,.12,'#7a866e');this.box(x+1,.8,20.6,2.1,.12,.08,'#7a866e')}
  for(const x of[-10,1,11]){this.cylinder(x,2.6,5.4,.065,4.5,'#5b7264');this.box(x,4.9,5.4,.75,.15,.35,'#ece2bb');const lamp=new THREE.PointLight('#ffcb81',9,10,2);lamp.position.set(x,4.6,5.4);this.scene.add(lamp)}
  this.addLabel('station','青岚站','QINGLAN STATION',0,7,-8,'station');this.addLabel('west','西岭入口','WEST',-43,3,0,'entry');this.addLabel('east','东港入口','EAST',46,3,0,'entry');this.addLabel('yard','03 · 货运作业区','FREIGHT YARD',7,8,15,'yard');
 }
 straightTrack(a,b,z){this.box((a+b)/2,.2,z,b-a,.22,2.1,'#7d8070');for(let x=a+.3;x<b;x+=.9)this.box(x,.33,z,.24,.14,1.8,'#676551');for(const offset of[-.58,.58])this.box((a+b)/2,.45,z+offset,b-a,.12,.105,'#b4bcb0')}
 addLabel(id,title,sub,x,y,z,type){const e=document.createElement('div');e.className='map-label '+type;e.innerHTML=`<span>${title}</span><small>${sub}</small>`;this.container.appendChild(e);this.labels.push({id,e,pos:new V(x,y,z)})}
 createTrain(t){
  const group=new THREE.Group();group.userData.trainId=t.id;const colors=t.color;
  for(let i=0;i<4;i++){
   const c=new THREE.Group();c.userData.offset=-i*3.1;
   this.box(0,.65,0,2.9,.36,1.15,'#304641',c);for(const x of[-.95,.95])for(const z of[-.62,.62]){const wheel=this.cylinder(x,.54,z,.28,.17,'#293936',8,c);wheel.rotation.x=Math.PI/2}
   if(i===0){this.box(0,1.2,0,2.7,.85,1.12,colors,c);this.box(.5,1.95,0,1.1,.85,1.07,colors,c);this.box(.6,2.44,0,1.45,.16,1.3,'#d9ddc9',c);this.box(1.08,2,0,.04,.46,.8,'#294b4b',c);this.box(.5,2,.553,.75,.45,.03,'#294b4b',c);this.box(.5,2,-.553,.75,.45,.03,'#294b4b',c);this.box(-.7,1.67,0,.85,.12,.8,'#647369',c);this.box(-.7,1.91,0,.22,.45,.23,'#37483f',c);this.box(1.41,1.25,0,.05,.18,.65,'#ffebb0',c);this.box(0,.91,0,2.8,.12,1.16,'#ebd7a7',c)}
   else if(t.passenger){this.box(0,1.5,0,2.8,1.3,1.13,'#dddcc9',c);this.box(0,2.2,0,2.9,.22,1.24,colors,c);for(const x of[-.8,0,.8])for(const z of[-.575,.575])this.box(x,1.7,z,.56,.47,.025,'#517c80',c);this.box(0,1.15,0,2.81,.19,1.15,colors,c)}
   else if(t.cargo==='原木'){for(let j=0;j<4;j++){const log=this.cylinder(0,1+(j>1?.45:0),(j%2-.5)*.5,.27,2.6,'#9a8057',8,c);log.rotation.z=Math.PI/2}}
   else {this.box(0,1.35,0,2.65,1.1,1.07,colors,c);if(t.cargo==='煤炭'){this.box(0,1.94,0,2.45,.2,.95,'#334440',c)}else for(let j=0;j<7;j++){for(const z of[-.545,.545])this.box(-1.1+j*.35,1.35,z,.055,1,.02,colors,c)}}
   group.add(c)
  }
  const ring=new THREE.Mesh(new THREE.PlaneGeometry(13,2.7),new THREE.MeshBasicMaterial({color:'#adffd9',transparent:true,opacity:.2,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(-4.65,.51,0);group.add(ring);group.userData.ring=ring;this.scene.add(group);this.trains.set(t.id,group);return group;
 }
 laneZ(x,lane){const a=Math.abs(x),z=LANES[lane]||0;if(a>=22)return 0;if(a<=13)return z;const t=(22-a)/9;return z*t*t*(3-2*t)}
 update(game,time){
  for(const {lane,route} of this.routeLines){const t=game.selectedTrain;const chosen=t?.lane||(t?game.switches[t.side]:1);route.visible=lane===chosen;route.material.color.set(game.lanes[lane]?'#b5f7cd':'#f1d78c')}
  const night=game.mode==='night';if(night!==this.lastNight){this.lastNight=night;this.scene.background.set(night?'#243d48':'#b8cec5');this.scene.fog.color.copy(this.scene.background);this.ambient.intensity=night?.9:2.3;this.sun.intensity=night?.55:3;this.renderer.toneMappingExposure=night?1.2:1.25}
  for(const t of game.trains){
   let g=this.trains.get(t.id);if(t.status==='scheduled'||t.status==='done'){if(g)g.visible=false;continue}
   if(!g)g=this.createTrain(t);g.visible=true;
   if(t.status==='queued'){const queue=game.trains.filter(x=>x.side===t.side&&x.status==='queued');const index=queue.indexOf(t);if(index>1){g.visible=false;continue}g.userData.headX=-t.dir*(48+index*13)}
   else if(t.status==='incoming')g.userData.headX=t.dir*(-48+t.progress*53);
   else if(t.status==='outgoing')g.userData.headX=t.dir*(5+t.progress*57);
   else g.userData.headX=t.dir*5;
   g.children.forEach(c=>{if(c===g.userData.ring)return;const x=g.userData.headX+t.dir*c.userData.offset;const z=this.laneZ(x,t.lane);c.position.set(x,.12+(x>24&&x<34?.2:0),z);const dz=this.laneZ(x+.1,t.lane)-this.laneZ(x-.1,t.lane);c.rotation.y=-Math.atan2(dz,.2)+(t.dir===-1?Math.PI:0)});
   const ring=g.userData.ring;ring.visible=t.id===game.selected;ring.position.set(g.userData.headX-t.dir*4.65,.5,this.laneZ(g.userData.headX-t.dir*4,t.lane));ring.material.opacity=.15+Math.sin(time*3)*.055;
  }
  for(const side of['west','east']){const light=this.signals[side],busy=!!game.blocks[side];light.material.color.set(busy?'#8becba':'#f28063');light.material.emissive.set(busy?'#64ee94':'#ed4f32')}
  this.controls.update();for(const l of this.labels){const p=l.pos.clone().project(this.camera);l.e.style.left=`${(p.x*.5+.5)*this.container.clientWidth}px`;l.e.style.top=`${(-p.y*.5+.5)*this.container.clientHeight}px`;l.e.style.display=p.z>1?'none':''}
  this.renderer.render(this.scene,this.camera)
 }
 resetCamera(top=false){this.camera.position.set(...(top?[0,107,1]:[51,61,74]));this.controls.target.set(0,0,0);this.controls.update()}
 zoom(value){this.camera.position.sub(this.controls.target).multiplyScalar(value).add(this.controls.target);this.controls.update()}
 resize(){const w=this.container.clientWidth,h=this.container.clientHeight;if(!w||!h)return;this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h)}
}
