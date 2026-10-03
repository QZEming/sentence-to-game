import * as THREE from 'three';
import { PATH, PLOTS, TOWERS, ENEMIES } from './content.js';
import { makeTower, makeEnemy } from './characters.js';
import { mergeStaticMeshes } from './scene-geometry.js';

const PALETTE = {
  grass: '#a6bda0', grassLight: '#bed0ad', moss: '#829d80', leaf: '#839f8a',
  leafLight: '#afc6a0', cream: '#fff1d5', road: '#ead7b4', sand: '#c5b399',
  soil: '#9f9e8c', pink: '#edc4c0', trunk: '#aa8c72', mint: '#7eb9a5', gold: '#efc575',
};

const sphereGeometry = new THREE.SphereGeometry(1, 16, 12);
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 32);
const healthBackGeometry = new THREE.PlaneGeometry(.78,.075);
const healthFrontGeometry = new THREE.PlaneGeometry(.74,.041);
const effectRingGeometry = new THREE.TorusGeometry(1,.045,6,32);
const effectParticleGeometry = new THREE.SphereGeometry(.065,6,5);
const enemyAuraGeometry = new THREE.TorusGeometry(.56,.028,7,40);
const projectileTemplates = new Map();
const materials = new Map();
function material(color, options = {}) {
  const key = `${color}:${JSON.stringify(options)}`;
  if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, roughness: .86, ...options }));
  return materials.get(key);
}
function ball(parent, color, x, y, z, sx, sy = sx, sz = sx, shadow = true) {
  const mesh = new THREE.Mesh(sphereGeometry, material(color));
  mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz);
  mesh.castShadow = shadow; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function cylinder(parent, color, x, y, z, radius, height, bottomRadius = radius) {
  const geo = Math.abs(radius - bottomRadius) < .001 ? cylinderGeometry : new THREE.CylinderGeometry(radius, bottomRadius, height, 16);
  const mesh = new THREE.Mesh(geo, material(color));
  if (geo === cylinderGeometry) mesh.scale.set(radius, height, radius);
  mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function bar(parent, color, a, b, radius = .07) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const mesh = cylinder(parent, color, 0, 0, 0, radius, dir.length());
  mesh.position.copy(a).add(b).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}
function disc(parent, color, x, z, radius, y = .04, opacity = 1) {
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius, 40), opacity < 1 ? new THREE.MeshBasicMaterial({color, transparent:true, opacity, depthWrite:false}) : material(color));
  mesh.rotation.x = -Math.PI / 2; mesh.position.set(x, y, z); mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function ring(parent, color, x, z, radius, width = .055, y = .1) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, width, 7, 56), material(color));
  mesh.rotation.x = -Math.PI / 2; mesh.position.set(x, y, z); mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function makeStar(radius = .35, color = PALETTE.gold, depth = .1) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const angle = Math.PI / 2 + i * Math.PI / 5;
    const r = i % 2 ? radius * .46 : radius;
    const x = Math.cos(angle) * r, y = Math.sin(angle) * r;
    if (!i) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {depth, bevelEnabled:true, bevelSize:.035, bevelThickness:.035, bevelSegments:2, steps:1}), material(color));
  mesh.castShadow = true; return mesh;
}
function roundedIslandShape(scale = 1) {
  const points = [[-12.3,-7.3],[-7.5,-7.9],[-3.5,-7.3],[1,-7.6],[6,-7.2],[11.8,-6.4],[13.5,-4.5],[14,-.5],[13.1,4.8],[10.8,6.6],[6.1,7.15],[1,7.2],[-3.8,7],[-8.8,6.5],[-12.9,4.8],[-14,.8],[-13.6,-4.3]];
  const shape = new THREE.Shape();
  const mid = (a,b) => [(a[0]+b[0])*.5*scale, (a[1]+b[1])*.5*scale];
  const start = mid(points[points.length-1], points[0]); shape.moveTo(...start);
  points.forEach((p, i) => { const end = mid(p, points[(i+1)%points.length]); shape.quadraticCurveTo(p[0]*scale,p[1]*scale,...end); });
  shape.closePath(); return shape;
}
function islandLayer(parent, color, scale, height, y) {
  const geometry = new THREE.ExtrudeGeometry(roundedIslandShape(scale), {depth:height, bevelEnabled:true, bevelSize:.28, bevelThickness:.24, bevelSegments:3, curveSegments:8, steps:1});
  geometry.rotateX(Math.PI / 2);
  const mesh = new THREE.Mesh(geometry, material(color)); mesh.position.y = y - .24;
  mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function cloud(parent, x, y, z, scale = 1, color = '#f4e6dc') {
  const group = new THREE.Group(); group.position.set(x, y, z); group.scale.setScalar(scale);
  ball(group,color,0,0,0,1.3,.38,.62,false);
  ball(group,color,-.65,.17,.04,.72,.48,.53,false);
  ball(group,color,.15,.33,-.06,.85,.58,.65,false);
  ball(group,color,.88,.12,0,.65,.36,.52,false);
  group.userData.origin = {x,y,z}; parent.add(group); return group;
}
function leafyTree(parent, x, z, size = 1, color = PALETTE.leaf) {
  const group = new THREE.Group(); group.position.set(x, .03, z); group.scale.setScalar(size);
  cylinder(group,PALETTE.trunk,0,.85,0,.17,1.7,.24);
  bar(group,PALETTE.trunk,new THREE.Vector3(0,1.05,0),new THREE.Vector3(-.48,1.8,.04),.1);
  bar(group,PALETTE.trunk,new THREE.Vector3(0,1.05,0),new THREE.Vector3(.43,1.8,-.1),.1);
  const canopy = new THREE.Group(); canopy.position.y=1.7; group.add(canopy);
  ball(canopy,color,0,.45,0,.94,1.02,.78);
  ball(canopy,color,-.62,.05,.07,.73,.8,.65);
  ball(canopy,color,.62,.16,.06,.69,.8,.63);
  ball(canopy,PALETTE.leafLight,.14,.9,-.1,.58,.52,.49);
  disc(group,'#647e69',0,0,.75,.03,.15);
  parent.add(group); return {group,canopy};
}
function firTree(parent,x,z,size=1) {
  const group = new THREE.Group(); group.position.set(x,.02,z); group.scale.setScalar(size);
  cylinder(group,PALETTE.trunk,0,.75,0,.13,1.5);
  for(let i=0;i<3;i++) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(.95-i*.2,1.45,9),material(i===2?'#a7bea0':'#88a58c'));
    cone.position.y=1.18+i*.55; cone.castShadow=true; cone.receiveShadow=true; group.add(cone);
  }
  parent.add(group); return group;
}
function mushroom(parent,x,z,scale=1,color=PALETTE.pink) {
  const group = new THREE.Group(); group.position.set(x,.03,z); group.scale.setScalar(scale);
  cylinder(group,PALETTE.cream,0,.23,0,.105,.46,.13);
  const cap = ball(group,color,0,.48,0,.37,.25,.34);
  for(const [sx,sz,r] of [[-.16,.08,.07],[.14,.12,.055],[.05,-.17,.07]]) ball(group,'#fff3df',sx,.65,sz,r,.025,r,false);
  parent.add(group); return group;
}
function flower(parent,x,z,color='#fff1d0',scale=1) {
  const group=new THREE.Group(); group.position.set(x,.055,z); group.scale.setScalar(scale);
  cylinder(group,'#829b77',0,.2,0,.027,.4);
  for(let i=0;i<5;i++) {const a=i*Math.PI*2/5;ball(group,color,Math.cos(a)*.13,.41,Math.sin(a)*.13,.115,.065,.115,false);}
  ball(group,'#e7b76e',0,.455,0,.075,.065,.075,false); parent.add(group);
}
function makeMoon() {
  const shape=new THREE.Shape();
  shape.absarc(0,0,.67,.32*Math.PI,1.68*Math.PI,false);
  shape.quadraticCurveTo(.05,-.08,.67*Math.cos(.32*Math.PI),.67*Math.sin(.32*Math.PI));
  const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.18,bevelEnabled:true,bevelSize:.04,bevelThickness:.04,bevelSegments:3,curveSegments:24}),material('#ffe6a2',{emissive:'#d29e42',emissiveIntensity:.12}));
  mesh.castShadow=true; return mesh;
}
function setupMoonTree(parent) {
  const group=new THREE.Group();group.position.set(11.45,.08,-2.1);parent.add(group);
  disc(group,'#bfcca5',0,0,1.52,.012);
  ring(group,'#f6e7bd',0,0,1.35,.07,.11);
  cylinder(group,'#d5b697',0,1.38,0,.29,2.75,.44);
  bar(group,'#d5b697',new THREE.Vector3(0,1.3,0),new THREE.Vector3(-.94,2.8,.1),.19);
  bar(group,'#d5b697',new THREE.Vector3(0,1.62,0),new THREE.Vector3(.94,3,.02),.18);
  const crown=new THREE.Group();group.add(crown);
  ball(crown,'#c8d3a7',-.88,2.85,.02,1.05,.82,.82);
  ball(crown,'#d4ddb5',.72,3.17,-.1,1.23,.97,.93);
  ball(crown,'#b9cca4',-.2,3.62,-.25,1.1,.97,.85);
  ball(crown,'#e2dfae',.1,2.8,.55,.75,.65,.62);
  const moon=makeMoon();moon.position.set(.22,4.58,.2);moon.rotation.z=-.2;group.add(moon);
  const hangers=[];
  [[-1.22,2.38,.32,.55],[1.17,2.69,.42,.8],[.24,2.39,.81,.58]].forEach(([x,y,z,len],i)=>{
    bar(group,'#d1b777',new THREE.Vector3(x,y,z),new THREE.Vector3(x,y-len,z),.014);
    const star=makeStar(.18+i*.025,'#ffe1a0',.06);star.position.set(x,y-len,z);group.add(star);hangers.push(star);
  });
  ball(group,'#fff3d5',-.13,.65,.48,.29,.39,.2);
  ball(group,'#77846c',-.22,.72,.652,.035,.045,.02,false);
  ball(group,'#77846c',-.02,.72,.673,.035,.045,.02,false);
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ball(group,'#ccbd95',Math.cos(a)*.55,.13,Math.sin(a)*.45,.3,.13,.23);}
  return {group,crown,moon,hangers};
}
function entryArch(parent) {
  const group=new THREE.Group();group.position.set(-11.75,.05,-3);parent.add(group);
  cylinder(group,'#d0b394',0,1.02,-1.04,.17,2.04);
  cylinder(group,'#d0b394',0,1.02,1.04,.17,2.04);
  const curve=new THREE.CatmullRomCurve3(Array.from({length:25},(_,i)=>{const a=i/24*Math.PI;return new THREE.Vector3(0,1.95+Math.sin(a)*1.1,Math.cos(a)*1.04);}));
  const arch=new THREE.Mesh(new THREE.TubeGeometry(curve,32,.19,8,false),material('#c9b18e'));arch.castShadow=true;group.add(arch);
  for(const z of [-1.04,1.04]) {ball(group,'#849b7d',0,.3,z,.39,.3,.35);ball(group,'#a4b99b',.05,.53,z,.31,.29,.28);}
  const star=makeStar(.35);star.position.set(.02,2.42,.05);star.rotation.y=.9;group.add(star);
  bar(group,'#e1c486',new THREE.Vector3(0,3,0),new THREE.Vector3(0,2.72,0),.018);
  return group;
}
function makePlus() {
  const group=new THREE.Group();
  const sign=new THREE.Mesh(new THREE.CylinderGeometry(.33,.33,.1,6),material('#f4e8c9'));sign.rotation.x=Math.PI/2;sign.position.y=.73;sign.castShadow=true;group.add(sign);
  cylinder(group,'#c1a784',0,.39,0,.045,.6);
  const plusMaterial=material('#99ab85');
  for(const [w,h] of [[.27,.065],[.065,.27]]) {const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,.025),plusMaterial);mesh.position.set(0,.73,.065);group.add(mesh);}
  return group;
}
function buildPath(parent) {
  const pathMaterial=material(PALETTE.road);
  for(let i=0;i<PATH.length-1;i++) {
    const a=PATH[i],b=PATH[i+1],dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.38,len),pathMaterial);
    mesh.rotation.x=-Math.PI/2;mesh.rotation.z=-Math.atan2(dx,dz);mesh.position.set((a.x+b.x)/2,.061,(a.z+b.z)/2);mesh.receiveShadow=true;parent.add(mesh);
    for(let t=.8;t<len-.4;t+=1.18) {
      const f=t/len,nx=dz/len,nz=-dx/len;
      const pebble=disc(parent,'#d2c39f',a.x+dx*f+nx*.14,a.z+dz*f+nz*.14,.066,.066);pebble.scale.set(1,.55,1);
      const pebble2=disc(parent,'#d2c39f',a.x+dx*f-nx*.14+dx/len*.15,a.z+dz*f-nz*.14+dz/len*.15,.054,.066);pebble2.scale.set(1,.55,1);
    }
  }
  PATH.forEach(p=>disc(parent,PALETTE.road,p.x,p.z,.69,.061));
  for(let i=1;i<PATH.length-1;i++) {
    const p=PATH[i];
    for(let j=0;j<3;j++) {const theta=j*1.4+i;ball(parent,'#d4cead',p.x+Math.cos(theta)*.87,.11,p.z+Math.sin(theta)*.87,.1,.06,.08,false);}
  }
}
function addLantern(parent,x,z,height=1.1) {
  cylinder(parent,'#a38c71',x,height*.5,z,.045,height);
  const armEnd=new THREE.Vector3(x+.32,height,z);
  bar(parent,'#a38c71',new THREE.Vector3(x,height,z),armEnd,.045);
  cylinder(parent,'#b89967',x+.32,height-.22,z,.16,.065);
  ball(parent,'#ffe7ae',x+.32,height-.37,z,.18,.22,.17);
  cylinder(parent,'#b89967',x+.32,height-.56,z,.11,.065);
}
function healthBar() {
  const group=new THREE.Group();
  const back=new THREE.Mesh(healthBackGeometry,new THREE.MeshBasicMaterial({color:'#5a6a69',transparent:true,opacity:.45,depthWrite:false}));group.add(back);
  const front=new THREE.Mesh(healthFrontGeometry,new THREE.MeshBasicMaterial({color:'#d6edb9',depthWrite:false}));front.position.set(0,0,.007);group.add(front);group.userData.front=front;return group;
}
function projectileObject(type) {
  if(projectileTemplates.has(type))return projectileTemplates.get(type).clone(true);
  const group=new THREE.Group();
  if(type==='bunny'||type==='star'){const star=makeStar(.15,'#ffe29a',.05);group.add(star);}
  else if(type==='bear'){ball(group,'#ddb087',0,0,0,.16,.2,.16);cylinder(group,'#fff1c3',0,.18,0,.13,.06);}
  else {const color=type==='cat'?'#b6efe5':'#ecdcff';ball(group,color,0,0,0,.16);ring(group,color,0,0,.24,.016,0);}
  projectileTemplates.set(type,group);return group.clone(true);
}

export function createScene(container, { onPlotClick } = {}) {
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-20,20,13,-13,.1,160);
  camera.position.set(15,26,31);camera.lookAt(0,.1,-.3);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setClearColor(0x000000,0);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.07;
  renderer.domElement.className='world-canvas';renderer.domElement.style.display='block';renderer.domElement.style.width='100%';renderer.domElement.style.height='100%';
  renderer.domElement.setAttribute('aria-label','星绒守夜队 3D 森林棋盘，点击圆形空地安排守卫');container.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight('#fff6e1','#9daca0',2.0));
  const sun=new THREE.DirectionalLight('#fff0d6',3.1);sun.position.set(-10,23,15);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-20;sun.shadow.camera.right=20;sun.shadow.camera.top=17;sun.shadow.camera.bottom=-17;sun.shadow.camera.near=1;sun.shadow.camera.far=65;sun.shadow.normalBias=.035;sun.shadow.bias=-.00015;sun.shadow.radius=5;scene.add(sun);
  const fill=new THREE.DirectionalLight('#d7e8de',1.1);fill.position.set(12,10,-12);scene.add(fill);
  const world=new THREE.Group();scene.add(world);
  islandLayer(world,'#a4a390',.948,1.0,-.7);
  islandLayer(world,'#c9b799',.985,.72,-.15);
  islandLayer(world,PALETTE.grass,1,.26,.005);
  // Small strata and dangling roots give the island a soft, sculpted silhouette.
  for(let i=0;i<16;i++) {
    const a=i*Math.PI*2/16,x=Math.cos(a)*12.7,z=Math.sin(a)*6.45;
    ball(world,i%3?'#c0ae91':'#aab291',x,-.65,z,.62,.36,.52);
  }
  buildPath(world);
  const trees=[];
  [[-11.4,3.7,1.02],[-8.2,5.3,.8],[-5.4,-5.65,.91],[-1.75,-6.1,.78],[8.8,-5.6,.8],[10.55,4.7,.83]].forEach(([x,z,s])=>trees.push(leafyTree(world,x,z,s)));
  [[-12.15,-5.6,.71],[-3.0,5.5,.61],[2.8,5.6,.76],[7.8,5.2,.73],[11.7,2.7,.69]].forEach(([x,z,s])=>firTree(world,x,z,s));
  [[-12.25,1.5,.75],[-10.1,4.1,1],[-6.35,4.4,.72],[-3.15,-5.25,.9],[1.95,-5.6,.75],[4.2,5.2,1],[9.3,4.3,.8],[12.1,.7,.7]].forEach(([x,z,s],i)=>{mushroom(world,x,z,s,i%2?'#deb4a2':'#d49fa6');mushroom(world,x+.4,z+.27,s*.65,'#e7c69e');});
  [[-9.9,1.8],[-7.2,4.1],[-5.8,-4.85],[-.45,5.7],[2,-4.8],[4.4,-5.9],[7.7,-4.7],[9.1,3.6],[12.4,2],[-11.65,-.2]].forEach(([x,z],i)=>{
    ball(world,'#8da986',x,.13,z,.45,.2,.31);ball(world,'#a3bd97',x+.24,.15,z-.1,.3,.23,.24);
    flower(world,x-.32,z+.2,i%2?'#fff0cd':'#ebc1c0',.9);flower(world,x+.43,z+.12,'#fff0cd',.65);
  });
  [[-8.1,-4.05],[-6.05,2.95],[-1.05,-3.7],[3.95,2.92],[8.95,-2.9]].forEach(([x,z])=>addLantern(world,x,z,.94));
  const moonTree=setupMoonTree(world);entryArch(world);
  // Pebbles at the edge, tiny flowers, and friendly residents make the board feel inhabited.
  for(let i=0;i<20;i++) {
    const a=i*2.399,x=Math.cos(a)*(10.8+(i%3)*.7),z=Math.sin(a)*(5.8+(i%2)*.25);
    if(PLOTS.some(p=>Math.hypot(p.x-x,p.z-z)<1.15))continue;
    ball(world,i%2?'#d6d4b8':'#91a58c',x,.11,z,.15+(i%3)*.07,.1,.17,false);
  }
  const resident=makeTower('bunny',1);resident.scale.setScalar(.65);resident.position.set(-9.9,.07,5.45);resident.rotation.y=-.25;world.add(resident);
  const residentCat=makeTower('cat',1);residentCat.scale.setScalar(.55);residentCat.position.set(1.2,.06,5.58);residentCat.rotation.y=-.45;world.add(residentCat);
  const animatedScenery=new Set([...trees.map(tree=>tree.canopy),moonTree.crown,moonTree.moon,...moonTree.hangers]);
  world.userData.staticBatchStats=mergeStaticMeshes(world,animatedScenery);
  const clouds=[cloud(scene,-14.5,-1.9,3.7,1.8,'#efd9d5'),cloud(scene,10.6,-1.7,8.45,1.6,'#f0dcd2'),cloud(scene,-4,-2.8,9.3,1.6,'#f1e6d9'),cloud(scene,14,-1.5,-4.8,1.2,'#f0ddd7'),cloud(scene,-6.5,-1.1,-9.0,1.45,'#f4e4da')];
  const plotGroups=[],hits=[];
  PLOTS.forEach((p,index)=>{
    const group=new THREE.Group();group.position.set(p.x,0,p.z);world.add(group);
    disc(group,'#82977b',0,0,.87,.067,.18);
    cylinder(group,'#d8cbac',0,.1,0,.79,.13);
    const top=cylinder(group,'#eee5ca',0,.178,0,.72,.05);
    const border=ring(group,'#fbf0d0',0,0,.73,.045,.23);
    const indicator=ring(group,'#87b5a3',0,0,.87,.034,.081);indicator.visible=false;
    const plus=makePlus();plus.rotation.y=.37;group.add(plus);
    const hit=new THREE.Mesh(new THREE.CylinderGeometry(.94,.94,2,16),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.y=1;hit.userData.plotIndex=index;group.add(hit);hits.push(hit);
    plotGroups.push({group,top,border,indicator,plus});
  });
  const rangeMaterial=new THREE.MeshBasicMaterial({color:'#d6f1d4',transparent:true,opacity:.16,side:THREE.DoubleSide,depthWrite:false});
  const range=new THREE.Mesh(new THREE.CircleGeometry(1,96),rangeMaterial);range.rotation.x=-Math.PI/2;range.position.y=.07;range.visible=false;world.add(range);
  const rangeLine=new THREE.Mesh(new THREE.RingGeometry(.992,1.007,96),new THREE.MeshBasicMaterial({color:'#f1f6d4',transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}));rangeLine.rotation.x=-Math.PI/2;rangeLine.position.y=.072;rangeLine.visible=false;world.add(rangeLine);
  const skillHalo=new THREE.Mesh(new THREE.RingGeometry(.92,1.04,96),new THREE.MeshBasicMaterial({color:'#fff0bb',transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));skillHalo.rotation.x=-Math.PI/2;skillHalo.position.y=.09;skillHalo.visible=false;world.add(skillHalo);
  const towers=new Map(),enemies=new Map(),projectiles=new Map(),effects=new Map();
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),projected=new THREE.Vector3();let hovered=-1,width=1,height=1,disposed=false;
  function pick(event) {
    const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(hits,false)[0]?.object.userData.plotIndex??-1;
  }
  function onPointerMove(event){hovered=pick(event);renderer.domElement.style.cursor=hovered>=0?'pointer':'default';}
  function onPointerLeave(){hovered=-1;renderer.domElement.style.cursor='default';}
  function onPointerDown(event){if(event.button!==0)return;const index=pick(event);if(index>=0){event.preventDefault();onPlotClick?.(index);}}
  renderer.domElement.addEventListener('pointermove',onPointerMove);renderer.domElement.addEventListener('pointerleave',onPointerLeave);renderer.domElement.addEventListener('pointerdown',onPointerDown);
  function resize() {
    width=Math.max(container.clientWidth,1);height=Math.max(container.clientHeight,1);renderer.setSize(width,height,false);
    const aspect=width/height;
    const portrait=aspect<.8;
    camera.position.set(...(portrait?[31,29,8]:[15,26,31]));
    camera.lookAt(0,.1,-.3);
    const halfH=portrait?11.6/aspect:Math.max(10.65,18.1/aspect);
    camera.left=-halfH*aspect;camera.right=halfH*aspect;camera.top=halfH;camera.bottom=-halfH;camera.updateProjectionMatrix();camera.updateMatrixWorld();
  }
  function drop(map,id){const item=map.get(id);if(item){if(map===enemies)item.bar.children.forEach(child=>child.material.dispose());world.remove(item.group||item);map.delete(id);}}
  function render(state,dt=1/60) {
    if(disposed)return;
    const time=state.time||0,occupied=new Map((state.towers||[]).map(t=>[t.plotIndex,t]));
    plotGroups.forEach((p,i)=>{const active=state.selectedPlot===i,over=hovered===i;p.plus.visible=!occupied.has(i);p.indicator.visible=active||over;p.indicator.scale.setScalar(active?1+.035*Math.sin(time*3):1);p.border.material=material(active?'#90b8a3':over?'#e9c681':'#fbf0d0');p.plus.position.y=over?.11:0;});
    const selected=occupied.get(state.selectedPlot);
    range.visible=rangeLine.visible=!!selected;
    if(selected){const p=PLOTS[selected.plotIndex],r=selected.range||TOWERS[selected.type]?.range||3.5;range.position.set(p.x,.072,p.z);rangeLine.position.set(p.x,.076,p.z);range.scale.setScalar(r);rangeLine.scale.setScalar(r);}
    const towerIds=new Set();
    for(const t of state.towers||[]){
      towerIds.add(t.id);let entry=towers.get(t.id);
      if(!entry||entry.level!==t.level||entry.type!==t.type){if(entry)drop(towers,t.id);const group=makeTower(t.type,t.level);world.add(group);entry={group,level:t.level,type:t.type};towers.set(t.id,entry);}
      const p=PLOTS[t.plotIndex]||t;entry.group.position.set(t.x??p.x,.22+Math.sin(time*2.2+t.plotIndex)*.018,t.z??p.z);
      let targetAngle=.35;
      if(Number.isFinite(t.targetX)&&Number.isFinite(t.targetZ))targetAngle=Math.atan2(t.targetX-entry.group.position.x,t.targetZ-entry.group.position.z);
      let delta=targetAngle-entry.group.rotation.y;delta=Math.atan2(Math.sin(delta),Math.cos(delta));entry.group.rotation.y+=delta*Math.min(1,dt*9);
      const shotAge=time-(t.shotAt??-999);const recoil=shotAge>=0&&shotAge<.2?Math.sin(shotAge/.2*Math.PI)*.08:0;entry.group.scale.set(1+recoil*.3,1-recoil,1+recoil*.3);
    }
    for(const id of towers.keys())if(!towerIds.has(id))drop(towers,id);
    const enemyIds=new Set();
    for(const e of state.enemies||[]){
      enemyIds.add(e.id);let entry=enemies.get(e.id);
      if(!entry){const group=new THREE.Group(),model=makeEnemy(e.kind),bar=healthBar();group.add(model);group.add(bar);bar.position.y=e.kind==='boss'?2.12:1.26;world.add(group);entry={group,model,bar,lastX:e.x,lastZ:e.z,phase:Number(e.id)||enemyIds.size};enemies.set(e.id,entry);}
      const frozen=(e.freezeUntil||0)>time,slow=(e.slowUntil||0)>time;
      entry.group.position.set(e.x,.1+(frozen?0:Math.abs(Math.sin(time*(e.kind==='runner'?10:6)+entry.phase))*.12),e.z);
      const dx=e.x-entry.lastX,dz=e.z-entry.lastZ;
      if(Math.abs(dx)+Math.abs(dz)>.0001){let target=Math.atan2(dx,dz),delta=target-entry.model.rotation.y;entry.model.rotation.y+=Math.atan2(Math.sin(delta),Math.cos(delta))*Math.min(1,dt*10);}
      entry.model.rotation.z=frozen?0:Math.sin(time*5+entry.phase)*.06;entry.lastX=e.x;entry.lastZ=e.z;
      entry.bar.quaternion.copy(camera.quaternion);entry.bar.visible=e.hp<e.maxHp;
      const ratio=Math.max(0,e.hp/e.maxHp);entry.bar.userData.front.scale.x=ratio;entry.bar.userData.front.position.x=-(1-ratio)*.37;entry.bar.userData.front.material.color.set(frozen?'#bcf7ff':slow?'#9ee4d4':ratio<.3?'#f0baac':'#d6edb9');
      if((slow||frozen)&&!entry.aura){entry.aura=new THREE.Mesh(enemyAuraGeometry,material('#b4e5df'));entry.aura.rotation.x=-Math.PI/2;entry.aura.position.y=.02;entry.group.add(entry.aura);}
      if(entry.aura){entry.aura.visible=slow||frozen;entry.aura.rotation.z=time*.7;}
    }
    for(const id of enemies.keys())if(!enemyIds.has(id))drop(enemies,id);
    const projectileIds=new Set();
    for(const p of state.projectiles||[]){projectileIds.add(p.id);let obj=projectiles.get(p.id);if(!obj){obj=projectileObject(p.type);world.add(obj);projectiles.set(p.id,obj);}obj.position.set(p.x,p.y??1.1,p.z);obj.rotation.z=time*8;obj.rotation.y=time*4;}
    for(const id of projectiles.keys())if(!projectileIds.has(id))drop(projectiles,id);
    const effectIds=new Set();
    for(const fx of state.effects||[]){
      effectIds.add(fx.id);let entry=effects.get(fx.id);
      if(!entry){const group=new THREE.Group();const color=fx.color||(['freeze','slow'].includes(fx.type)?'#b5e9e2':'#ffe0a0');const mat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:1,depthWrite:false});
        const circle=new THREE.Mesh(effectRingGeometry,mat);circle.rotation.x=-Math.PI/2;group.add(circle);
        for(let i=0;i<7;i++){const particle=new THREE.Mesh(effectParticleGeometry,mat);particle.userData.angle=i*Math.PI*2/7;group.add(particle);}world.add(group);entry={group,mat};effects.set(fx.id,entry);}
      const progress=1-Math.max(0,fx.life/(fx.maxLife||.65));entry.group.position.set(fx.x,.25,fx.z);entry.mat.opacity=Math.max(0,1-progress);entry.group.children[0].scale.setScalar(.2+progress*(fx.type==='splash'?1.7:1));
      entry.group.children.slice(1).forEach((particle,i)=>{const a=particle.userData.angle,r=.2+progress*.9;particle.position.set(Math.cos(a)*r,Math.sin(progress*Math.PI)*.55+(i%2)*.1,Math.sin(a)*r);});
    }
    for(const id of effects.keys())if(!effectIds.has(id)){const item=effects.get(id);item.mat.dispose();drop(effects,id);}
    skillHalo.visible=(state.skillFlash||0)>0;
    if(skillHalo.visible){const amount=Math.min(1,state.skillFlash/.7);skillHalo.scale.setScalar(2+(1-amount)*16);skillHalo.material.opacity=amount*.58;}
    clouds.forEach((c,i)=>{const p=c.userData.origin;c.position.x=p.x+Math.sin(time*.075+i)*.38;c.position.y=p.y+Math.sin(time*.23+i)*.1;});
    trees.forEach(({canopy},i)=>{canopy.rotation.z=Math.sin(time*.6+i)*.018;canopy.rotation.x=Math.cos(time*.4+i)*.009;});
    moonTree.crown.rotation.z=Math.sin(time*.55)*.011;moonTree.moon.position.y=4.58+Math.sin(time*1.4)*.07;moonTree.hangers.forEach((s,i)=>s.rotation.z=Math.sin(time*1.5+i)*.12);
    renderer.render(scene,camera);
  }
  function getPlotScreenPosition(index){const p=PLOTS[index];if(!p)return null;projected.set(p.x,1,p.z).project(camera);return{x:(projected.x*.5+.5)*width,y:(-.5*projected.y+.5)*height};}
  function dispose(){disposed=true;observer.disconnect();renderer.domElement.removeEventListener('pointermove',onPointerMove);renderer.domElement.removeEventListener('pointerleave',onPointerLeave);renderer.domElement.removeEventListener('pointerdown',onPointerDown);const geos=new Set(),mats=new Set();scene.traverse(obj=>{if(obj.geometry)geos.add(obj.geometry);if(obj.material)(Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>mats.add(m));});geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();}
  const observer=new ResizeObserver(resize);observer.observe(container);resize();
  return {render,resize,dispose,getPlotScreenPosition};
}
