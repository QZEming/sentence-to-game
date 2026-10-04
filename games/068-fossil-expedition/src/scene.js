import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {PARTS,SPECIES} from './game.js';

const v=(x,y,z)=>new THREE.Vector3(x,y,z);
const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.88,flatShading:true,...extra});
const ivory=mat(0xe6d4a4),ivoryLight=mat(0xf0dfb5),ivoryDark=mat(0xc5b184),wood=mat(0x665139),metal=mat(0x666b59),amber=mat(0xe4b376);
function mesh(g,m,p,s){const o=new THREE.Mesh(g,m);if(p)o.position.copy(p);if(s)o.scale.copy(s);o.castShadow=true;o.receiveShadow=true;return o;}
function ball(group,p,r=.12,m=ivory,s){const o=mesh(new THREE.IcosahedronGeometry(r,1),m,p,s);group.add(o);return o;}
function bone(group,a,b,r=.065,m=ivory,joints=true){a=Array.isArray(a)?v(...a):a;b=Array.isArray(b)?v(...b):b;const d=b.clone().sub(a);const o=mesh(new THREE.CylinderGeometry(r*.78,r,d.length(),7),m,a.clone().add(b).multiplyScalar(.5));o.quaternion.setFromUnitVectors(v(0,1,0),d.normalize());group.add(o);if(joints){ball(group,a,r*1.55,m);ball(group,b,r*1.4,m);}return o;}
function horn(group,a,b,r=.16,m=ivoryLight){const d=v(...b).sub(v(...a));const o=mesh(new THREE.ConeGeometry(r,d.length(),7),m,v(...a).add(v(...b)).multiplyScalar(.5));o.quaternion.setFromUnitVectors(v(0,1,0),d.normalize());group.add(o);return o;}
function curve(group,points,r=.065,m=ivory){const c=new THREE.CatmullRomCurve3(points.map(p=>v(...p)));const o=mesh(new THREE.TubeGeometry(c,16,r,6,false),m);group.add(o);return o;}
function box(group,w,h,d,p,m){const o=mesh(new THREE.BoxGeometry(w,h,d),m,v(...p));group.add(o);return o;}
function plate(group,p,size=.7){const shape=new THREE.Shape();shape.moveTo(-size*.35,0);shape.lineTo(-size*.58,size*.7);shape.lineTo(0,size*1.35);shape.lineTo(size*.48,size*.77);shape.lineTo(size*.3,0);const o=mesh(new THREE.ExtrudeGeometry(shape,{depth:.07,bevelEnabled:true,bevelSize:.03,bevelThickness:.025,bevelSegments:1,steps:1}),ivoryDark,v(...p));group.add(o);return o;}

export function makeSkeleton(species=0){
 const root=new THREE.Group();const groups=PARTS.map((p,i)=>{const g=new THREE.Group();g.userData.part=i;g.name=p.id;root.add(g);return g;});const [head,spine,ribs,front,back,tail]=groups;
 const rex=species===1,steg=species===2,bodyY=rex?2.65:1.9;
 // Articulated vertebral column and neural processes.
 for(let i=0;i<14;i++){const x=-1.35+i*.19,y=bodyY+.16*Math.sin(i/13*Math.PI);ball(spine,v(x,y,0),.13,ivory,v(1,.8,.8));bone(spine,[x,y,0],[x,y+.27,0],.046,ivoryDark);bone(spine,[x,y,0],[x+.02,y-.01,.24],.045,ivoryDark);bone(spine,[x,y,0],[x+.02,y-.01,-.24],.045,ivoryDark);}
 bone(spine,[-1.48,bodyY,0],[-1.95,rex?3.05:1.72,0],.16);
 // Bilateral ribs and a lower sternum.
 for(let i=0;i<8;i++){const x=-1.16+i*.28,w=.54+Math.sin(i/8*Math.PI)*.26;for(const side of [-1,1])curve(ribs,[[x,bodyY+.04,side*.06],[x-.08,bodyY-.24,side*w],[x-.02,bodyY-.75,side*w*.8],[x+.2,bodyY-.92,side*.16]],.065,i%2?ivory:ivoryLight);}
 bone(ribs,[-1.05,bodyY-.9,0],[1,bodyY-.72,0],.08);
 if(steg)for(let i=0;i<10;i++){const x=-1.4+i*.33,s=.45+Math.sin(i/10*Math.PI)*.65;plate(ribs,[x,bodyY+.05,i%2?.16:-.16],s);}
 // Skull, with diagnostic anatomy for each animal.
 if(!rex&&!steg){
   ball(head,v(-2.09,1.82,0),.53,ivory,v(1.04,.9,.92));
   const frill=mesh(new THREE.CylinderGeometry(.79,.71,.16,11),ivoryDark,v(-1.77,2.04,0));frill.rotation.z=.97;frill.scale.z=.86;head.add(frill);
   const frillInner=mesh(new THREE.CylinderGeometry(.62,.57,.19,11),ivory,v(-1.83,2.1,0));frillInner.rotation.z=.97;frillInner.scale.z=.85;head.add(frillInner);
   for(let i=0;i<9;i++){const a=i/8*Math.PI;ball(head,v(-1.7-.18*Math.sin(a),2.01+.78*Math.sin(a),Math.cos(a)*.65),.1);}
   ball(head,v(-2.57,1.58,0),.38,ivory,v(1.5,.65,.77));bone(head,[-2.85,1.34,0],[-2.05,1.33,0],.09);
   for(const s of [-1,1]){horn(head,[-2.17,2.07,s*.36],[-3.01,2.5,s*.47],.15);ball(head,v(-2.35,1.88,s*.42),.105,mat(0x3a392c),v(1,1,.3));}
   horn(head,[-2.73,1.78,0],[-3.07,2.1,0],.115);
 }else if(rex){
   ball(head,v(-2.36,3.12,0),.5,ivory,v(1.4,.97,.83));ball(head,v(-2.92,3.08,0),.38,ivory,v(1.38,.8,.96));
   for(const side of [-1,1]){ball(head,v(-2.36,3.28,side*.38),.18,mat(0x424238),v(1,.9,.23));ball(head,v(-2.91,3.19,side*.29),.11,mat(0x4d4735),v(1,.7,.24));curve(head,[[-3.2,2.66,side*.28],[-2.65,2.57,side*.32],[-2.04,2.83,side*.32]],.11);for(let i=0;i<8;i++){const x=-3.15+i*.115;horn(head,[x,2.91,side*.29],[x+.03,2.71,side*.29],.043);horn(head,[x,2.65,side*.27],[x,2.78,side*.27],.036);}}
 }else{ball(head,v(-2.08,1.5,0),.26,ivory,v(1.15,.88,.75));ball(head,v(-2.41,1.42,0),.22,ivory,v(1.3,.65,.8));bone(head,[-2.63,1.3,0],[-1.86,1.33,0],.065);for(const s of [-1,1])ball(head,v(-2.12,1.59,s*.18),.068,mat(0x3d3d30),v(1,1,.3));}
 // Scapulae, pelvis, limbs and toes.
 for(const side of [-1,1]){
   const z=side*.46;bone(front,[-1.1,bodyY+.03,z],[-1.37,bodyY-.58,z],.115);bone(front,[-1.1,bodyY,z],[-.86,bodyY-.48,z],.09);
   if(rex){bone(front,[-1.25,2.08,z],[-1.53,1.77,z*1.2],.074);bone(front,[-1.53,1.77,z*1.2],[-1.8,1.84,z*1.2],.056);for(let t=0;t<2;t++)bone(front,[-1.8,1.84,z*1.2],[-2,1.78,z*1.2+t*.09],.026);}
   else{bone(front,[-1.32,1.5,z],[-1.35,.8,z*1.15],.115);bone(front,[-1.35,.8,z*1.15],[-1.2,.22,z*1.18],.09);bone(front,[-1.3,.8,z*1.25],[-1.1,.22,z*1.3],.056);for(let t=0;t<3;t++)bone(front,[-1.2,.19,z*1.2+(t-1)*.1],[-1.52,.13,z*1.2+(t-1)*.12],.07);}
   bone(back,[.72,bodyY+.06,z*.5],[1.36,bodyY-.08,z],.16);bone(back,[.77,bodyY-.12,z],[.88,bodyY-.72,z*.9],.14);
   const knee=rex?[.29,1.4,side*.64]:[1.28,.91,side*.61];bone(back,[.92,bodyY-.35,z],knee,rex?.19:.15);bone(back,knee,[.9,.32,side*.67],.12);bone(back,[knee[0]+.07,knee[1],knee[2]+side*.12],[1.02,.34,side*.78],.061);
   for(let t=0;t<3;t++)bone(back,[.91,.21,side*.7+(t-1)*.14],[rex?.35:.56,.12,side*.7+(t-1)*.2],.078);
 }
 // Segmented tapering tail.
 let previous=[1.22,bodyY,0];for(let i=0;i<15;i++){const x=1.42+i*.19,y=bodyY-.05-i*(rex?.012:.051),z=Math.sin(i*.17)*.12;const radius=.12*(1-i/19);bone(tail,previous,[x,y,z],radius,ivory,i%2===0);if(i<10)bone(tail,[x,y,z],[x+.06,y+.22*(1-i/14),z],radius*.6,ivoryDark,false);previous=[x,y,z];}
 if(steg)for(const side of [-1,1])for(let i=0;i<2;i++)horn(tail,[3.36+i*.31,.97,side*.07],[3.55+i*.26,1.2,side*(.62-i*.1)],.105);
 root.userData.groups=groups;return root;
}

function normalizePart(species,index,size=2.4){const root=makeSkeleton(species);const g=root.userData.groups[index];root.remove(g);const b=new THREE.Box3().setFromObject(g),center=b.getCenter(v(0,0,0));g.position.sub(center);const wrap=new THREE.Group();wrap.add(g);wrap.scale.setScalar(size/Math.max(...b.getSize(v(0,0,0)).toArray()));return wrap;}

export class GameScene{
 constructor(el,state,onClick){
   this.el=el;this.state=state;this.onClick=onClick;this.view='';this.parts=[];this.dirt=[];this.cells=[];this.effects=[];this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
   this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;el.appendChild(this.renderer.domElement);
   this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x343a31);this.camera=new THREE.PerspectiveCamera(37,1,.1,100);this.camera.position.set(11,11,13);
   this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this.controls.dampingFactor=.06;this.controls.minDistance=5;this.controls.maxDistance=24;this.controls.maxPolarAngle=Math.PI*.46;this.controls.minPolarAngle=.2;this.controls.target.set(0,.4,0);this.controls.enablePan=false;
   this.scene.add(new THREE.HemisphereLight(0xf8e4be,0x566158,2.35));const light=new THREE.DirectionalLight(0xffdfa5,4.2);light.position.set(-7,13,5);light.castShadow=true;light.shadow.mapSize.set(2048,2048);light.shadow.camera.left=-12;light.shadow.camera.right=12;light.shadow.camera.top=12;light.shadow.camera.bottom=-12;light.shadow.normalBias=.04;this.scene.add(light);const rim=new THREE.DirectionalLight(0xc6d5cb,1.5);rim.position.set(8,7,-7);this.scene.add(rim);
   this.world=new THREE.Group();this.scene.add(this.world);this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();this.down=null;this.draggingClean=false;
   el.addEventListener('pointerdown',e=>{this.down={x:e.clientX,y:e.clientY,time:performance.now()};if(this.view==='lab'&&this.state.labMode==='clean'){this.draggingClean=true;this.handlePointer(e);}});
   el.addEventListener('pointerup',e=>{if(this.down&&Math.hypot(e.clientX-this.down.x,e.clientY-this.down.y)<7&&!this.draggingClean)this.handlePointer(e);this.down=null;this.draggingClean=false;});
   el.addEventListener('pointermove',e=>{if(this.draggingClean)this.handlePointer(e);});
   window.addEventListener('pointerup',()=>{this.draggingClean=false;this.down=null;});el.addEventListener('pointerleave',()=>{this.draggingClean=false;this.down=null;});el.addEventListener('pointercancel',()=>{this.draggingClean=false;this.down=null;});document.addEventListener('visibilitychange',()=>{this.draggingClean=false;this.down=null;});
   this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(el);this.resize();this.build();this.animate=this.animate.bind(this);this.raf=requestAnimationFrame(this.animate);
 }
 resize(){const w=this.el.clientWidth,h=this.el.clientHeight;this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false);}
 resetCamera(){const field=this.state.view==='field',mobile=this.camera.aspect<1,factor=mobile?1.38:1;this.camera.position.set((field?11:9)*factor,(field?11:6.8)*factor,(field?13:12)*factor);this.controls.maxDistance=mobile?34:24;this.controls.target.set(0,field?.35:1.4,0);this.controls.update();}
 zoom(delta){const d=this.camera.position.clone().sub(this.controls.target);d.multiplyScalar(delta>0?.84:1.18);d.clampLength(this.controls.minDistance,this.controls.maxDistance);this.camera.position.copy(this.controls.target).add(d);this.controls.update();}
 clear(){const geometries=new Set(),materials=new Set(),textures=new Set();this.world.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material&&!Object.values({ivory,ivoryLight,ivoryDark,wood,metal,amber}).includes(o.material)){materials.add(o.material);if(o.material.map)textures.add(o.material.map);}});this.scene.remove(this.world);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());this.world=new THREE.Group();this.scene.add(this.world);this.cells=[];this.dirt=[];this.parts=[];this.effects=[];this.markers=[];}
 build(){const previous=this.view;this.clear();this.view=this.state.view;this.species=this.state.species;const e=this.state.expeditions[this.state.species];this.scene.background.setHex(this.view==='field'?SPECIES[this.species].bg:0x252d2b);this.scene.fog=new THREE.Fog(this.scene.background,22,47);if(this.view==='field')this.buildField();else if(this.view==='lab'&&this.state.labMode==='clean')this.buildCleaning();else this.buildSkeleton(this.view==='museum');this.controls.enableRotate=!(this.view==='lab'&&this.state.labMode==='clean');if(previous!==this.view)this.resetCamera();this.update();}
 terrain(){
   const s=SPECIES[this.species],sand=mat(s.color),rock=mat(s.rock);const ground=box(this.world,80,.3,80,[0,-1.26,0],mat(this.view==='field'?s.bg:0x272f2c));ground.receiveShadow=true;
   box(this.world,10,.58,8.1,[0,-.82,0],rock);box(this.world,10.08,.18,8.13,[0,-.45,0],mat(s.color).clone());box(this.world,10.18,.3,8.2,[0,-.2,0],sand);
   const seed=(n)=>Math.abs(Math.sin(n*127.1+this.species*21)*43758.5453)%1;
   for(let i=0;i<110;i++){let x=(seed(i*4+1)-.5)*9.7,z=(seed(i*4+2)-.5)*7.7;if(Math.abs(x)<3.6&&Math.abs(z)<2.55)continue;const radius=.045+seed(i+3)*.17;const r=mesh(new THREE.DodecahedronGeometry(radius,0),i%3===0?rock:mat(i%2?0xb79c70:0xc6ae86),v(x,.03,z),v(1.4,.6,1));r.rotation.set(seed(i)*3,seed(i+9)*3,seed(i+7));this.world.add(r);}
   for(let i=0;i<13;i++){const x=(seed(i+350)-.5)*12,z=-4.2-seed(i+300)*2.7;if(x>2.8&&x<5)continue;const h=.3+seed(i+380)*1.4;const r=mesh(new THREE.DodecahedronGeometry(1,0),rock,v(x,-.65+h*.5,z),v(.6+seed(i+48),h,.6+seed(i+348)));r.rotation.y=seed(i+13)*4;this.world.add(r);}
   // Wind-shaped canyon outcrops and a small expedition camp.
   for(let i=0;i<4;i++){const h=1.2+i*.38,x=-5.4-i*.18,z=-2.1-i*.73;const r=mesh(new THREE.CylinderGeometry(.47+i*.14,.69+i*.16,h,5),mat(i%2?s.rock:0xa07953),v(x,h/2-.65,z));r.rotation.y=.3+i*.12;this.world.add(r);}
   this.tent(3.7,-3.1);this.crate(4.15,.17,.35);this.crate(4.15,.17,1.25);this.crate(-4.25,.16,2.8);
   for(const [x,z] of [[-4.2,-2.2],[4.2,2.8],[-4.4,1.1]])this.plant(x,z);
   // Survey stakes and ropes surround the six active excavation zones.
   const corners=[[-3.65,-2.5],[3.65,-2.5],[3.65,2.5],[-3.65,2.5]];
   corners.forEach(([x,z],i)=>{bone(this.world,[x,-.1,z],[x,.85,z],.045,wood,false);ball(this.world,v(x,.85,z),.066,metal);const next=corners[(i+1)%4];curve(this.world,[[x,.63,z],[(x+next[0])/2,.5,(z+next[1])/2],[next[0],.63,next[1]]],.018,mat(0xc9b688));});
 }
 tent(x,z){const g=new THREE.Group();const geo=new THREE.CylinderGeometry(1,1,1.9,3,1,false);geo.rotateZ(Math.PI/2);const canvas=mesh(geo,mat(0x8d9773),v(0,.48,0),v(1,.8,1));canvas.rotation.x=Math.PI/6;g.add(canvas);bone(g,[-1,.1,.58],[-1,1.17,0],.035,wood,false);bone(g,[-1,.1,-.58],[-1,1.17,0],.035,wood,false);bone(g,[-1,1.17,0],[1,1.17,0],.035,wood,false);g.position.set(x,.02,z);g.rotation.y=-.25;g.scale.setScalar(.72);this.world.add(g);}
 crate(x,y,z){const g=new THREE.Group();box(g,.67,.49,.55,[0,0,0],wood);for(const dx of [-.23,.23])box(g,.035,.51,.57,[dx,0,0],mat(0xaca184));box(g,.71,.06,.59,[0,.27,0],mat(0x7c694b));g.position.set(x,y,z);g.rotation.y=.13;this.world.add(g);}
 plant(x,z){for(let i=0;i<8;i++){const a=i/8*Math.PI*2;curve(this.world,[[x,0,z],[x+Math.cos(a)*.1,.25,z+Math.sin(a)*.1],[x+Math.cos(a)*.36,.35,z+Math.sin(a)*.36]],.014,mat(0x727757));}}
 label(text,x,y,z,color='#e7d6af'){const canvas=document.createElement('canvas');canvas.width=Math.max(128,text.length*20+28);canvas.height=64;const ctx=canvas.getContext('2d');ctx.fillStyle='#292f25';ctx.fillRect(0,0,canvas.width,64);ctx.strokeStyle='#a79772';ctx.lineWidth=2;ctx.strokeRect(2,2,canvas.width-4,60);ctx.font='500 30px sans-serif';ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,canvas.width/2,33);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const m=new THREE.SpriteMaterial({map:texture,depthTest:true});const sprite=new THREE.Sprite(m);sprite.position.set(x,y,z);sprite.scale.set(canvas.width/128*.58,.29,1);this.world.add(sprite);return sprite;}
 buildField(){this.terrain();const e=this.state.expeditions[this.species],s=SPECIES[this.species];
   for(let i=0;i<6;i++){
     const x=(i%3-1)*2.32,z=(Math.floor(i/3)-.5)*2.38;const group=new THREE.Group();group.position.set(x,0,z);group.userData.cell=i;
     box(group,2.21,.22,2.21,[0,-.02,0],mat(0x99754f));box(group,2.14,.06,2.14,[0,.115,0],mat(0xb49364));
     const fossil=normalizePart(this.species,i,1.65);fossil.rotation.x=-Math.PI/2;fossil.rotation.z=.1*(i%2?1:-1);fossil.scale.y*=.6;fossil.position.y=.22;group.add(fossil);
     const dirt=[];for(let j=0;j<16;j++){const px=(j%4-1.5)*.515,pz=(Math.floor(j/4)-1.5)*.515;const height=.22+Math.sin(j*3+i)*.045;const soil=mesh(new THREE.BoxGeometry(.515,height,.515),mat(j%4===0?0xd0b182:s.color),v(px,.24+height/2,pz));soil.userData.cell=i;group.add(soil);dirt.push(soil);if(j%3===0){const pebble=mesh(new THREE.DodecahedronGeometry(.085),mat(0xac8b5e),v(px+.1,height/2+.055,0));soil.add(pebble);}}
     const hit=mesh(new THREE.BoxGeometry(2.2,.1,2.2),new THREE.MeshBasicMaterial({visible:false}),v(0,.2,0));hit.userData.cell=i;group.add(hit);
     const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.26,.03,2.26)),new THREE.LineBasicMaterial({color:0xe7c28b,transparent:true,opacity:.8}));outline.position.y=.12;group.add(outline);
     this.world.add(group);this.cells.push({group,dirt,fossil,outline,hit,x,z});
     this.label(PARTS[i].area,x,.32,z+1.02);if(i===0||i===2||i===4){bone(this.world,[x-.96,.0,z-.98],[x-.96,1,z-.98],.023,metal,false);const flag=mesh(new THREE.PlaneGeometry(.31,.2),mat(0xd9b277,{side:THREE.DoubleSide}),v(x-.81,.89,z-.98));this.world.add(flag);}
   }
   const ring=new THREE.Mesh(new THREE.RingGeometry(.23,.3,40),new THREE.MeshBasicMaterial({color:0xf5d192,transparent:true,opacity:.7,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.66;this.world.add(ring);this.selectionRing=ring;
 }
 buildCleaning(){
   const i=this.state.selected,e=this.state.expeditions[this.species];this.buildTable();
   if(e.dig[i]===100){const object=normalizePart(this.species,i,3.3);object.position.set(0,1.6,0);object.rotation.y=-.2;this.world.add(object);this.cleanObject=object;}
   else{const object=normalizePart(this.species,i,3.3);object.position.set(0,1.6,0);object.traverse(o=>{if(o.isMesh)o.material=mat(0x66796b,{transparent:true,opacity:.18,wireframe:true});});this.world.add(object);}
   // Five independent deposits are anchored to actual bone geometry.
   let positions=[[-.95,1.4,.7],[.65,1.5,.9],[-.23,2.23,.48],[.05,.68,.67],[1.05,2.05,.1]];
   if(this.cleanObject&&e.dig[i]===100){this.cleanObject.updateMatrixWorld(true);const samples=[];this.cleanObject.traverse(o=>{if(o.isMesh)samples.push(o.getWorldPosition(v(0,0,0)));});samples.sort((a,b)=>a.x-b.x);positions=Array.from({length:5},(_,j)=>{const p=samples[Math.min(samples.length-1,Math.floor(samples.length*(.08+j*.21)))].clone();p.y+=.1;p.z+=.15;return p.toArray();});}
   const radius=i===5?.16:.22;positions.forEach((p,j)=>{const d=mesh(new THREE.DodecahedronGeometry(radius,1),mat(j%2?0x8b7858:0xa08a65),v(...p),v(1.1,.9,.9));d.userData.spot=j;d.visible=e.dig[i]===100&&!e.clean[i][j];this.world.add(d);this.dirt.push(d);const halo=mesh(new THREE.TorusGeometry(radius*1.3,.012,5,28),new THREE.MeshBasicMaterial({color:0xd6b877,transparent:true,opacity:.6}),v(...p));halo.visible=d.visible;halo.rotation.y=.45;this.world.add(halo);this.markers.push(halo);});
   this.label('SPECIMEN '+PARTS[i].area,0,.05,2.1);this.camera.position.set(6,5,9);this.controls.target.set(0,1.4,0);
 }
 buildTable(){box(this.world,80,.2,80,[0,-1.3,0],mat(0x272f2c));box(this.world,7,.28,5.7,[0,-.15,0],mat(0x505a4c));box(this.world,6.85,.04,5.5,[0,.02,0],mat(0x73806a));const grid=new THREE.GridHelper(6,12,0x94a18b,0x87947b);grid.position.y=.048;this.world.add(grid);for(const x of [-2.7,2.7])for(const z of [-2.1,2.1])box(this.world,.15,1,.15,[x,-.8,z],metal);box(this.world,.7,.04,1.1,[-2.7,.08,1.6],mat(0xbdb7a1));for(let i=0;i<3;i++)bone(this.world,[2.7,.09,1.1+i*.2],[2.05,.09,1.1+i*.2],.024,wood,false);}
 buildSkeleton(museum){
   box(this.world,80,.2,80,[0,-1.32,0],mat(0x242b28));const pedestal=mesh(new THREE.CylinderGeometry(4.9,5.05,.27,64),mat(museum?0x4e5549:0x465247),v(0,-.22,0),v(1,1,.73));this.world.add(pedestal);const top=mesh(new THREE.CylinderGeometry(4.82,4.82,.035,64),mat(museum?0x6d7260:0x64735f),v(0,-.065,0),v(1,1,.73));this.world.add(top);
   const grid=new THREE.GridHelper(8,16,0x78876e,0x61735a);grid.position.y=-.04;grid.material.transparent=true;grid.material.opacity=.3;this.world.add(grid);
   this.skeleton=makeSkeleton(this.species);this.skeleton.position.y=.05;this.world.add(this.skeleton);this.parts=this.skeleton.userData.groups;
   this.parts.forEach((g,i)=>{g.traverse(o=>{if(o.isMesh){o.userData.part=i;o.userData.original=o.material;o.material=o.material.clone();}});});
   for(const x of [-1.25,1])bone(this.world,[x,0,0],[x,this.species===1?2.6:1.9,0],.022,metal,false);
   if(museum){
     for(const x of [-4.3,4.3]){const l=new THREE.SpotLight(0xffedc3,30,15,.6,.7,1);l.position.set(x,6,3);l.target=this.skeleton;this.world.add(l);}
     this.label('PALEONTOLOGY / '+String(this.species+1).padStart(2,'0'),0,.18,2.8);
     for(const x of [-4.3,4.3])for(const z of [-2.6,2.6]){bone(this.world,[x,0,z],[x,.57,z],.035,metal,false);ball(this.world,v(x,.58,z),.07,amber);}
     curve(this.world,[[-4.3,.55,2.6],[0,.4,2.6],[4.3,.55,2.6]],.024,mat(0x5e4933));
   }else{this.parts.forEach((g,i)=>{const b=new THREE.Box3().setFromObject(g),p=b.getCenter(v(0,0,0));const sprite=this.label(String(i+1),p.x,p.y+.38,p.z+.45);sprite.scale.set(.27,.135,1);sprite.userData.part=i;this.markers.push(sprite);});
     const e=this.state.expeditions[this.species];if(e.clean[this.state.selected].every(Boolean)&&!e.placed[this.state.selected]){const preview=normalizePart(this.species,this.state.selected,1.3);preview.position.set(-3.5,1.1,2.1);this.world.add(preview);this.partPreview=preview;this.label('PART / '+(this.state.selected+1),-3.5,.23,2.4);}
   }
 }
 update(){const e=this.state.expeditions[this.state.species];
   if(this.view==='field'){this.cells.forEach((cell,i)=>{const remaining=16-Math.floor(e.dig[i]/100*16);cell.dirt.forEach((d,j)=>{d.visible=j<remaining;});cell.fossil.visible=e.dig[i]<100;cell.outline.material.color.setHex(i===this.state.selected?0xffd18a:0x927f59);cell.outline.material.opacity=i===this.state.selected?.95:.22;});const c=this.cells[this.state.selected];if(c&&this.selectionRing){this.selectionRing.position.set(c.x,.68,c.z);this.selectionRing.visible=e.dig[this.state.selected]<100;}}
   else if(this.view==='lab'&&this.state.labMode==='clean'){this.dirt.forEach((d,j)=>{d.visible=e.dig[this.state.selected]===100&&!e.clean[this.state.selected][j];this.markers[j].visible=d.visible;});}
   else{this.parts.forEach((g,i)=>{const solid=e.placed[i]||(this.view==='museum'&&e.rewarded);g.traverse(o=>{if(o.isMesh){o.material.transparent=!solid;o.material.opacity=solid?1:(i===this.state.selected?.4:.12);o.material.wireframe=!solid;o.material.depthWrite=solid;o.material.color.setHex(solid?o.userData.original.color.getHex():i===this.state.selected?0xe6c388:0x9cb7a6);}});if(this.markers[i])this.markers[i].visible=!e.placed[i];});if(this.partPreview){this.partPreview.rotation.z=this.state.rotation*Math.PI/2;this.partPreview.visible=!e.placed[this.state.selected];}}
 }
 handlePointer(e){const r=this.el.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hits=this.ray.intersectObjects(this.world.children,true);for(const hit of hits){if(!hit.object.visible)continue;let o=hit.object;while(o&&o!==this.world){if(this.view==='field'&&o.userData.cell!==undefined){this.onClick({type:'dig',index:o.userData.cell,point:hit.point});return;}if(this.view==='lab'&&this.state.labMode==='clean'&&o.userData.spot!==undefined){this.onClick({type:'clean',spot:o.userData.spot,point:hit.point});return;}if(this.view==='lab'&&this.state.labMode==='assemble'&&o.userData.part!==undefined){this.onClick({type:'place',index:o.userData.part,point:hit.point});return;}o=o.parent;}}
 }
 burst(point,color=0xc8ac7d){if(this.reduced)return;for(let i=0;i<12;i++){const p=mesh(new THREE.IcosahedronGeometry(.025+Math.random()*.03,0),mat(color),point.clone());const velocity=v((Math.random()-.5)*.065,.035+Math.random()*.04,(Math.random()-.5)*.065);this.world.add(p);this.effects.push({mesh:p,velocity,life:40});}}
 scan(){this.scanUntil=performance.now()+5000;}
 animate(){this.raf=requestAnimationFrame(this.animate);if(document.hidden)return;this.controls.update();const t=performance.now();if(this.selectionRing&&!this.reduced&&this.view==='field'){this.selectionRing.scale.setScalar(1+Math.sin(t*.003)*.12);this.selectionRing.material.opacity=.5+Math.sin(t*.003)*.2;}
 if(this.scanUntil&&this.view==='field'){this.cells.forEach((c,i)=>{if(this.state.expeditions[this.species].dig[i]<100){c.outline.material.color.setHex(0xc6e5b8);c.outline.material.opacity=.6+Math.sin(t*.007)*.4;c.fossil.traverse(o=>{if(o.isMesh)o.visible=true;});}});if(t>this.scanUntil){this.scanUntil=0;this.update();}}
 for(let i=this.effects.length-1;i>=0;i--){const p=this.effects[i];p.velocity.y-=.002;p.mesh.position.add(p.velocity);p.life--;p.mesh.scale.multiplyScalar(.98);if(p.life<=0){this.world.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose();this.effects.splice(i,1);}}
 if(this.view==='museum'&&this.skeleton&&!this.reduced)this.skeleton.rotation.y=Math.sin(t*.0001)*.13;
 this.renderer.render(this.scene,this.camera);
 }
}
