import * as THREE from './vendor/three.module.js';

const $ = id => document.getElementById(id);
const clamp = THREE.MathUtils.clamp;
const TAU = Math.PI * 2;
const CENTER = new THREE.Vector3(0, 1.65, 0);
const LEVELS = [
  { title:'掌中星辰', act:'第一幕 · 尺度的秘密', poem:'渺小与巨大，<br>不过是一眼之隔。', objective:'改变水晶的大小，<br>让它恰好填满金色轮廓。', note:'别相信物体原本的大小。<br>在这里，你的目光<br>能重新定义它。', tags:['透视缩放','自由观察'], object:'星光水晶', type:'scale', angle:.60, elevation:1.08, startAngle:.60, startElevation:1.08, initial:.55, target:1.5, hints:['先试着滑动下方的「感知尺度」。水晶可以变大，也可以变小。','金色线框就是水晶应有的轮廓。观察边缘是否吻合。','把感知尺度调整到 1.50 × 附近，再施展魔术。'], success:'你让掌心的星光，拥有了世界的重量。' },
  { title:'破碎的圆', act:'第二幕 · 目光的交点', poem:'散落在远处的答案，<br>会在一眼之间重逢。', objective:'旋转观察视角，<br>将三段弧光拼成完整的圆。', note:'它们不必真的相连。<br>只要在你的眼中，<br>成为同一个圆。', tags:['投影拼接','空间错位'], object:'三段月光', type:'ring', angle:-.38, elevation:1.17, startAngle:.68, startElevation:1.04, initial:1, target:1, hints:['这一幕不需要缩放。拖动舞台，让不同深度的弧线逐渐靠拢。','关注三段弧线的发光端点，让每一处接缝都闭合。','将方位转到约 338°，再稍微降低俯视角度。方向键可以微调。'], success:'分离的是空间，完整的是你的目光。' },
  { title:'藏月礼帽', act:'第三幕 · 消失的艺术', poem:'月亮从未离开，<br>只是学会了躲藏。', objective:'找到一个观察角度，<br>让银色月亮完全藏进礼帽后。', note:'魔术师从不让月亮消失。<br>他只知道，<br>该让你站在哪里。', tags:['透视遮挡','寻找视角'], object:'月亮与礼帽', type:'occlusion', angle:.50, elevation:1.13, startAngle:-.65, startElevation:1.0, initial:1, target:1, hints:['旋转视角。让银色月亮逐渐靠近礼帽的中央。','月亮在礼帽后面，但只有从合适的角度，它才会被完整遮住。','方位约 029° 时，调整上下视角，把月亮藏进帽身中央。'], success:'月亮还在那里。只有你知道这个秘密。' },
  { title:'不可能之桥', act:'第四幕 · 连接不存在', poem:'走向彼岸的路，<br>也许只存在于眼里。', objective:'转动视角并缩放中段，<br>让三段阶梯的金色接点吻合。', note:'空间说这条路不存在。<br>但你的目光，<br>可以让它成为现实。', tags:['视角拼接','局部缩放'], object:'中段悬梯', type:'bridge', angle:.95, elevation:1.05, startAngle:-.15, startElevation:1.24, initial:.65, target:1.15, hints:['先转动舞台，观察阶梯上四颗金色的连接点。','找到大致相连的视角，再改变中段阶梯的尺度。','方位约 054°、略微俯视；中段尺度约 1.15 ×。继续微调到 94% 共鸣。'], success:'你把三个不可能，连接成了一条路。' },
  { title:'镜外之门', act:'第五幕 · 双生的边界', poem:'两扇门，一道入口。<br>远近，从此没有分别。', objective:'调整视角与青色门框尺度，<br>让两扇空间之门完全重合。', note:'一扇门在此处，<br>另一扇门在远方。<br>入口却只需要一个。', tags:['透视重叠','尺度匹配'], object:'青色空间门', type:'portal', angle:-.75, elevation:1.16, startAngle:.42, startElevation:1.02, initial:.72, target:1.28, hints:['青色门框可以缩放，金色门框是你的参照。','先对齐两扇门的中心，再让顶部与底部同时重合。','方位约 317°，尺度约 1.28 ×。轻轻调整上下视角，直到边界重合。'], success:'远方不再遥远。你让空间为你让路。' },
  { title:'最后的奇迹', act:'终幕 · 万象归一', poem:'当所有不可能相遇，<br>你，就是那个答案。', objective:'拼合四角星环，再缩放月亮，<br>让它恰好填入中央金环。', note:'回想你学会的一切：<br>改变目光，改变尺度。<br>然后，相信那个瞬间。', tags:['复合幻象','终极演出'], object:'终幕之月', type:'finale', angle:.12, elevation:1.02, startAngle:-.92, startElevation:1.21, initial:.48, target:1.12, hints:['先忽略中央月亮，找到让四块菱形星环完整相接的视角。','星环闭合后，缩放月亮，直到银色边缘吻合中央金环。','方位约 007°，俯视约 32°；月亮尺度约 1.12 ×。共鸣同时取决于星环与月亮。'], success:'你终于明白：奇迹，一直藏在另一种看法里。' },
];

let saved = { unlocked:0, stars:{}, best:{}, current:0, sound:false };
try { const old = JSON.parse(localStorage.getItem('parallax-theatre-v1')); if(old) saved = {...saved,...old}; } catch {}
saved.unlocked = clamp(Number(saved.unlocked)||0,0,5);
saved.current = clamp(Number(saved.current)||0,0,saved.unlocked);
const state = { level:saved.current, theta:.6, phi:1.08, scale:.55, elapsed:0, hints:0, casts:0, lens:false, solved:false, score:0, pointer:false, moved:false, magic:0, sound:!!saved.sound };
let scene, camera, renderer, puzzle, targetGuide, controlled, animator, goldGate, wizard, particles;
let tests=[], goals=[], disposables=[], lastFrame=performance.now(), toastTimer, successTimer, dragging=null, musicTimer, audioCtx, successScore=0;
let reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const keys = new Set();
const raycaster = new THREE.Raycaster();
const mat = (color, options={}) => new THREE.MeshStandardMaterial({color, roughness:.52, metalness:.24,...options});
const materials = {
  stage:mat(0x223930,{roughness:.85}), side:mat(0x11261f), black:mat(0x101a28), gold:mat(0xbc9f63,{metalness:.78,roughness:.32}),
  lavender:mat(0x9c97d8,{roughness:.24,metalness:.25}), mint:mat(0x98dbc4,{roughness:.32,metalness:.3}), white:mat(0xd7e5df,{roughness:.27}),
  glow:new THREE.MeshBasicMaterial({color:0xc7fbe0}), goldGlow:new THREE.MeshBasicMaterial({color:0xe6cb86}), purpleGlow:new THREE.MeshBasicMaterial({color:0x9781d8}),
};
function mesh(geometry, material, parent=scene, position=[0,0,0]) { const m=new THREE.Mesh(geometry,material);m.position.set(...position);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m; }
function box(size,material,parent,position){return mesh(new THREE.BoxGeometry(...size),material,parent,position)}
function cylinder(r1,r2,h,material,parent,position,segments=64){return mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material,parent,position)}
function line(points,color,parent=scene,opacity=1){const g=new THREE.BufferGeometry().setFromPoints(points.map(p=>p.isVector3?p:new THREE.Vector3(...p)));const l=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity}));parent.add(l);return l;}
function ring(radius,tube,material,parent,position=[0,0,0],arc=TAU){return mesh(new THREE.TorusGeometry(radius,tube,10,96,arc),material,parent,position)}
function glowPoint(position,parent,material=materials.goldGlow,radius=.06){return mesh(new THREE.SphereGeometry(radius,12,8),material,parent,position)}
function addEdge(m,color=0xc5f6db,opacity=.75){const edge=new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color,transparent:true,opacity}));m.add(edge);return edge;}
function addLabelPlate(parent,width=1.1){const p=box([width,.045,.42],materials.gold,parent,[0,-.09,0]);return p;}
function idealCamera(level=LEVELS[state.level]){const c=new THREE.PerspectiveCamera(38,1,.1,100);const t=level.angle,p=level.elevation;c.position.set(18*Math.sin(p)*Math.sin(t),18*Math.cos(p),18*Math.sin(p)*Math.cos(t)).add(CENTER);c.lookAt(CENTER);c.updateMatrixWorld();return c;}
function planeGroup(k=1,localCenter=[0,0],ideal=idealCamera()){
 const group=new THREE.Group();const ref=new THREE.Vector3(0,2.75,0).add(new THREE.Vector3(localCenter[0],localCenter[1],0).applyQuaternion(ideal.quaternion));group.position.copy(ideal.position).lerp(ref,k);group.quaternion.copy(ideal.quaternion);group.scale.setScalar(k);puzzle.add(group);return group;
}
function projectedPoint(group,local){const v=group.localToWorld(new THREE.Vector3(...local)).project(camera);return new THREE.Vector2(v.x*camera.aspect,v.y);}
function pair(a,ap,b,bp,weight=1){tests.push({a,ap,b,bp,weight});}
function referencePoint(x,y){const v=new THREE.Vector3(x,y,0);return v;}
function makeGuide(){const g=planeGroup();targetGuide=g;return g;}
function guideLine(points,close=false){const arr=points.map(p=>new THREE.Vector3(...p));if(close)arr.push(arr[0].clone());const geo=new THREE.BufferGeometry().setFromPoints(arr);const l=new THREE.Line(geo,new THREE.LineDashedMaterial({color:0xcebc8c,transparent:true,opacity:.18,dashSize:.09,gapSize:.13}));l.computeLineDistances();targetGuide.add(l);return l;}
function circlePoints(radius,count=80){return Array.from({length:count+1},(_,i)=>[Math.cos(i/count*TAU)*radius,Math.sin(i/count*TAU)*radius,0]);}

function init(){
 scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x0c151a,.027);
 camera=new THREE.PerspectiveCamera(38,1,.1,110);
 try{renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:true,alpha:true,powerPreference:'high-performance'});}catch(error){$('loading').innerHTML='<p>这个浏览器暂时无法创建 3D 舞台。请开启硬件加速，或使用支持 WebGL 的浏览器。</p>';return;}
 renderer.setClearColor(0x0c151a,0);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<600?1.5:1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 scene.add(new THREE.HemisphereLight(0xc9e5f5,0x163427,2));
 const key=new THREE.DirectionalLight(0xe6e9db,4);key.position.set(-4,12,8);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-9;key.shadow.camera.right=9;key.shadow.camera.top=9;key.shadow.camera.bottom=-9;key.shadow.normalBias=.035;scene.add(key);
 const fill=new THREE.PointLight(0x8871e6,38,24,1.5);fill.position.set(-5,5,-2);scene.add(fill);
 const mintLight=new THREE.PointLight(0x9ee5ce,30,23,1.6);mintLight.position.set(4,4,4);scene.add(mintLight);
 buildStage();
 puzzle=new THREE.Group();scene.add(puzzle);
 setupEvents();loadLevel(state.level);resize();new ResizeObserver(resize).observe($('canvasWrap'));
 requestAnimationFrame(frame);setTimeout(()=>{$('loading').classList.add('hide');$('loading').setAttribute('aria-hidden','true');},450);
 updateSoundButton();
}

function buildStage(){
 const root=new THREE.Group();scene.add(root);
 const plinth=cylinder(5.35,5.4,.40,materials.side,root,[0,-1.2,0],96);addEdge(plinth,0x557b5e,.12);
 cylinder(5.45,5.45,.12,materials.gold,root,[0,-.98,0],96);
 cylinder(5.37,5.37,.26,materials.stage,root,[0,-.81,0],96);
 cylinder(5.18,5.18,.08,mat(0x2b4538,{roughness:.9}),root,[0,-.63,0],96);
 const rim=ring(5.15,.018,materials.goldGlow,root,[0,-.575,0]);rim.rotation.x=-Math.PI/2;
 const rim2=ring(4.96,.008,materials.gold,root,[0,-.576,0]);rim2.rotation.x=-Math.PI/2;
 const inner=ring(3.68,.009,materials.gold,root,[0,-.576,0]);inner.rotation.x=-Math.PI/2;
 for(let i=0;i<64;i++){const a=i/64*TAU;const mark=box([.018,.009,i%4===0?.18:.08],materials.gold,root,[Math.sin(a)*4.82,-.574,Math.cos(a)*4.82]);mark.rotation.y=a;}
 for(let i=0;i<12;i++){const a=i/12*TAU;line([[0,-.575,0],[Math.sin(a)*4.7,-.575,Math.cos(a)*4.7]],0x5a7959,root,.14);}
 const orbit=ring(6.05,.006,new THREE.MeshBasicMaterial({color:0x5f9178,transparent:true,opacity:.18}),root,[0,-1.38,0]);orbit.rotation.x=-Math.PI/2;
 const orbit2=ring(6.3,.005,new THREE.MeshBasicMaterial({color:0x5f9178,transparent:true,opacity:.12}),root,[0,-1.38,0]);orbit2.rotation.x=-Math.PI/2;
 for(let i=0;i<6;i++){const a=i/6*TAU;glowPoint([Math.sin(a)*6.05,-1.38,Math.cos(a)*6.05],root,materials.goldGlow,.025);}
 // Small illuminated pedestals give the illusion a tangible scale.
 for(const [x,z,h] of [[-2.9,-1.9,.85],[3.1,.4,.54],[1.6,-3.2,1.2]]){
  const pillar=new THREE.Group();root.add(pillar);pillar.position.set(x,-.58,z);cylinder(.51,.62,.17,materials.black,pillar,[0,.085,0],6);cylinder(.4,.46,h,mat(0x4a5860),pillar,[0,h/2+.15,0],6);cylinder(.55,.55,.13,materials.gold,pillar,[0,h+.18,0],6);
  const crystal=mesh(new THREE.OctahedronGeometry(.22),materials.lavender,pillar,[0,h+.62,0]);crystal.rotation.z=.2;crystal.userData.float={base:h+.62,phase:x};disposables.push(crystal);
 }
 // The exit is present throughout the performance.
 goldGate=new THREE.Group();goldGate.position.set(2.7,-.56,-2.4);goldGate.rotation.y=-.18;root.add(goldGate);
 const archPath=new THREE.CurvePath();archPath.add(new THREE.LineCurve3(new THREE.Vector3(-.68,0,0),new THREE.Vector3(-.68,1.7,0)));const arcPts=Array.from({length:33},(_,i)=>new THREE.Vector3(Math.cos(Math.PI-i/32*Math.PI)*.68,1.7+Math.sin(i/32*Math.PI)*.68,0));archPath.add(new THREE.CatmullRomCurve3(arcPts));archPath.add(new THREE.LineCurve3(new THREE.Vector3(.68,1.7,0),new THREE.Vector3(.68,0,0)));
 mesh(new THREE.TubeGeometry(archPath,80,.045,8,false),materials.gold,goldGate);
 const portal=new THREE.Mesh(new THREE.PlaneGeometry(1.25,2.0),new THREE.MeshBasicMaterial({color:0x77b7b0,transparent:true,opacity:.055,side:THREE.DoubleSide}));portal.position.set(0,1.05,0);goldGate.add(portal);goldGate.userData.portal=portal;
 box([1.7,.14,.70],materials.black,goldGate,[0,.02,0]);box([1.5,.05,.60],materials.gold,goldGate,[0,.12,0]);
 wizard=buildWizard();wizard.position.set(-2.45,-.51,2.2);wizard.rotation.y=.45;scene.add(wizard);
 const starPositions=new Float32Array(240*3);for(let i=0;i<240;i++){const a=i*2.399963,r=6+Math.random()*8;starPositions[i*3]=Math.cos(a)*r;starPositions[i*3+1]=Math.random()*9-2;starPositions[i*3+2]=Math.sin(a)*r;}
 particles=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(starPositions,3)),new THREE.PointsMaterial({color:0xc1dccc,size:.028,transparent:true,opacity:.5,sizeAttenuation:true,depthWrite:false}));scene.add(particles);
 const beam=mesh(new THREE.ConeGeometry(2.4,12,48,1,true),new THREE.MeshBasicMaterial({color:0x91b8b3,transparent:true,opacity:.012,side:THREE.DoubleSide,depthWrite:false}),root,[0,5.1,0]);beam.rotation.z=.1;
 const pedestal=cylinder(.74,.92,.15,materials.black,root,[0,-.5,0],8);cylinder(.72,.72,.06,materials.gold,root,[0,-.395,0],8);
 const halo=ring(.55,.012,materials.glow,root,[0,-.36,0]);halo.rotation.x=-Math.PI/2;
}

function buildWizard(){
 const g=new THREE.Group();const robe=mat(0x243c46,{metalness:.2});
 cylinder(.16,.40,.90,robe,g,[0,.58,0],8);const cape=mesh(new THREE.ConeGeometry(.40,.87,6,1,true),mat(0x615276,{side:THREE.DoubleSide}),g,[0,.61,-.06]);cape.rotation.y=.5;
 cylinder(.17,.27,.10,materials.gold,g,[0,.97,0],12);
 mesh(new THREE.SphereGeometry(.18,16,12),mat(0xd9c8b4),g,[0,1.18,.01]);
 cylinder(.34,.34,.055,materials.black,g,[0,1.34,0],32);cylinder(.205,.22,.38,materials.black,g,[0,1.54,0],32);cylinder(.222,.224,.065,materials.gold,g,[0,1.405,0],32);
 box([.13,.14,.28],materials.black,g,[-.16,.1,.07]);box([.13,.14,.28],materials.black,g,[.16,.1,.07]);
 const arm=box([.13,.49,.15],robe,g,[.30,.89,.04]);arm.rotation.z=-.9;glowPoint([.49,1.06,.05],g,mat(0xd9c8b4),.085);
 const wand=cylinder(.023,.023,.64,materials.black,g,[.58,1.28,.04],8);wand.rotation.z=-.38;glowPoint([.69,1.56,.04],g,materials.glow,.055);
 const star=mesh(new THREE.OctahedronGeometry(.12),materials.goldGlow,g,[0,.77,.27]);star.scale.y=1.2;
 return g;
}

function disposePuzzle(){puzzle.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&!Object.values(materials).includes(o.material))o.material.dispose();});puzzle.clear();tests=[];goals=[];controlled=null;targetGuide=null;animator=null;}
function buildPuzzle(){
 const L=LEVELS[state.level];const ideal=idealCamera(L);
 if(L.type==='scale'){
  const pos=new THREE.Vector3(0,1.87,0);const cage=new THREE.Group();cage.position.copy(pos);cage.rotation.set(.12,.28,.05);puzzle.add(cage);
  const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4,2.4,2.4)),new THREE.LineBasicMaterial({color:0xd9bd7b,transparent:true,opacity:.8}));cage.add(edge);targetGuide=cage;
  for(const x of [-1.2,1.2])for(const y of [-1.2,1.2])for(const z of [-1.2,1.2])glowPoint([x,y,z],cage,materials.goldGlow,.038);
  const cube=box([1.6,1.6,1.6],mat(0x8d8ec5,{roughness:.21,metalness:.36,emissive:0x272147,emissiveIntensity:.25}),puzzle,pos.toArray());cube.rotation.copy(cage.rotation);addEdge(cube,0xd9daf9,.75);controlled=cube;
  const inner=mesh(new THREE.OctahedronGeometry(.22),materials.glow,cube);inner.visible=false;
  const platform=box([2.05,.14,2.05],mat(0x3b4b51),puzzle,[0,.12,0]);platform.rotation.y=.28;addEdge(platform,0xa9a080,.5);
  const orbit=ring(1.85,.012,materials.gold,puzzle,[0,.36,0]);orbit.rotation.x=Math.PI/2;
 }else if(L.type==='ring'){
  makeGuide();guideLine(circlePoints(1.7));const parts=[];
  for(let i=0;i<3;i++){const k=[.84,1.05,1.19][i],g=planeGroup(k);const start=i/3*TAU;const pts=Array.from({length:33},(_,j)=>new THREE.Vector3(Math.cos(start+j/32*TAU/3)*1.7,Math.sin(start+j/32*TAU/3)*1.7,0));const arc=new THREE.CatmullRomCurve3(pts);mesh(new THREE.TubeGeometry(arc,48,.095,12,false),[materials.mint,materials.lavender,materials.gold][i],g);glowPoint(pts[0].toArray(),g);glowPoint(pts[32].toArray(),g);parts.push(g);}
  for(let i=0;i<3;i++){const a=(i+1)/3*TAU,p=[Math.cos(a)*1.7,Math.sin(a)*1.7,0];pair(parts[i],p,parts[(i+1)%3],p);}
 }else if(L.type==='occlusion'){
  const hat=new THREE.Group();hat.position.copy(CENTER);puzzle.add(hat);
  cylinder(1.17,1.17,.10,materials.black,hat,[0,-.7,0]);cylinder(.80,.91,1.65,mat(0x32304b,{roughness:.38}),hat,[0,.10,0]);cylinder(.905,.917,.19,materials.gold,hat,[0,-.58,0]);
  const brim=ring(1.16,.014,materials.goldGlow,hat,[0,-.64,0]);brim.rotation.x=Math.PI/2;
  const moon=mesh(new THREE.SphereGeometry(.52,40,32),mat(0xe9f2e2,{emissive:0x94aa8e,emissiveIntensity:.3,roughness:.65}),puzzle,ideal.position.clone().lerp(CENTER,1.17).toArray());controlled=null;
  const moonRing=ring(.58,.012,materials.goldGlow,moon);moonRing.quaternion.copy(ideal.quaternion);
  // Occlusion is evaluated against a conservative region inside the actual hat body.
  goals.push({type:'occlusion',hat,moon});
  targetGuide=new THREE.Group();hat.add(targetGuide);targetGuide.visible=false;const dot=glowPoint([0,.1,.92],targetGuide,materials.goldGlow,.07);
 }else if(L.type==='bridge'){
  makeGuide();const joints=[[-2.6,-1.10,0],[-.92,-.10,0],[.90,.95,0],[2.5,1.8,0]],parts=[];
  for(let i=0;i<3;i++){
   const mid=[(joints[i][0]+joints[i+1][0])/2,(joints[i][1]+joints[i+1][1])/2];const k=[.82,1.02,1.21][i];const g=planeGroup(k,mid);g.userData.baseScale=k;g.userData.center=mid;parts.push(g);
   const a=joints[i],b=joints[i+1];for(let j=0;j<5;j++){const t=(j+.5)/5;const stair=box([.43,.15,.70],[materials.lavender,materials.mint,materials.gold][i],g,[THREE.MathUtils.lerp(a[0],b[0],t)-mid[0],THREE.MathUtils.lerp(a[1],b[1],t)-mid[1],0]);addEdge(stair,0xcde8d6,.35);}
   const endA=[a[0]-mid[0],a[1]-mid[1],.02],endB=[b[0]-mid[0],b[1]-mid[1],.02];glowPoint(endA,g);glowPoint(endB,g);g.userData.ends=[endA,endB];line([endA,endB],0xdbcea2,g,.4);
   if(i===1)controlled=g;
  }
  pair(parts[0],parts[0].userData.ends[1],parts[1],parts[1].userData.ends[0]);pair(parts[1],parts[1].userData.ends[1],parts[2],parts[2].userData.ends[0]);guideLine(joints);
 }else if(L.type==='portal'){
  makeGuide();const anchors=[[-1.12,-1.5,0],[-1.12,.55,0],[0,1.67,0],[1.12,.55,0],[1.12,-1.5,0]];
  function arch(g,material){const pts=[new THREE.Vector3(-1.12,-1.5,0),new THREE.Vector3(-1.12,.55,0)];for(let i=0;i<=32;i++)pts.push(new THREE.Vector3(-Math.cos(i/32*Math.PI)*1.12,.55+Math.sin(i/32*Math.PI)*1.12,0));pts.push(new THREE.Vector3(1.12,-1.5,0));const path=new THREE.CatmullRomCurve3(pts,false,'centripetal',.1);mesh(new THREE.TubeGeometry(path,100,.095,10,false),material,g);for(const p of anchors)glowPoint(p,g);line([[-1.12,-1.5,0],[1.12,-1.5,0]],0xc8e5d2,g,.7);}
  const rear=planeGroup(1.15),front=planeGroup(.82);arch(rear,materials.gold);arch(front,materials.mint);controlled=front;front.userData.baseScale=.82;
  for(const a of anchors)pair(front,a,rear,a);guideLine(anchors);
 }else if(L.type==='finale'){
  makeGuide();const points=[[0,2.1,0],[2.1,0,0],[0,-2.1,0],[-2.1,0,0]],parts=[];
  for(let i=0;i<4;i++){const a=points[i],b=points[(i+1)%4],g=planeGroup([.84,1.12,.98,1.2][i]);const path=new THREE.LineCurve3(new THREE.Vector3(...a),new THREE.Vector3(...b));mesh(new THREE.TubeGeometry(path,1,.055,8,false),i%2?materials.gold:materials.lavender,g);glowPoint(a,g);glowPoint(b,g);const mid=a.map((v,j)=>(v+b[j])/2);const gem=mesh(new THREE.OctahedronGeometry(.18),materials.mint,g,mid);parts.push(g);}
  for(let i=0;i<4;i++)pair(parts[i],points[(i+1)%4],parts[(i+1)%4],points[(i+1)%4]);
  const fixed=planeGroup();ring(.79,.025,materials.goldGlow,fixed);const moonGroup=planeGroup(.91);const moon=mesh(new THREE.SphereGeometry(.76,32,24),mat(0xdae9d7,{emissive:0x759582,emissiveIntensity:.24}),moonGroup);controlled=moonGroup;moonGroup.userData.baseScale=.91;
  for(const p of [[.76,0,0],[-.76,0,0],[0,.76,0],[0,-.76,0]])pair(moonGroup,p,fixed,p,.8);guideLine(points,true);
 }
 updateScale();
}

function loadLevel(index){
 clearTimeout(successTimer);state.level=clamp(index,0,5);const L=LEVELS[state.level];state.theta=L.startAngle;state.phi=L.startElevation;state.scale=L.initial;state.elapsed=0;state.hints=0;state.casts=0;state.solved=false;state.magic=0;state.score=0;state.lens=false;keys.clear();dragging=null;
 saved.current=state.level;persist();disposePuzzle();buildPuzzle();
 $('actLabel').textContent=L.act;$('levelTitle').textContent=L.title;$('levelTitle').classList.toggle('long-title',L.title.length>4);$('levelPoem').innerHTML=L.poem;$('objectiveText').innerHTML=L.objective;$('noteText').innerHTML=L.note;$('noteNumber').textContent=pad(state.level+1);$('skillTags').innerHTML=L.tags.map(s=>`<span>${s}</span>`).join('');$('selectedObject').textContent=L.object;
 $('hintCount').textContent='0 / 3';$('hintText').textContent='';$('hintBtn').disabled=false;$('stageStatus').textContent='魔术正在发生';$('chapterCounter').textContent=pad(state.level+1)+' / 06';$('timeLabel').textContent='00:00';$('lensBtn').setAttribute('aria-pressed','false');document.body.classList.remove('lens-active');
 const scaleActive=!!controlled;$('scaleSlider').disabled=!scaleActive;$('scaleSlider').value=state.scale;$('scaleOutput').textContent=scaleActive?state.scale.toFixed(2)+' ×':'仅需视角';$('scaleLabel').textContent=scaleActive?'感知尺度':'专注观察';$('objectState').textContent=scaleActive?'正在施展透视魔术':'拖动舞台，寻找唯一的视角';$('scaleMinLabel').textContent=scaleActive?'掌心之小':'无需缩放';$('scaleMaxLabel').textContent=scaleActive?'世界之大':'目光就是魔法';$('castBtn').disabled=false;
 updateChapterUI();setLens(false,false);updateCamera();evaluate();
}
function updateScale(){if(!controlled)return;const L=LEVELS[state.level];const val=L.type==='scale'?state.scale:(controlled.userData.baseScale||1)*state.scale/L.target;controlled.scale.setScalar(val);$('scaleOutput').textContent=state.scale.toFixed(2)+' ×';$('scaleSlider').value=state.scale;}
function setScale(value){if(!controlled||state.solved)return;state.scale=clamp(value,.35,2.5);updateScale();}
function updateCamera(){state.phi=clamp(state.phi,.62,1.47);const s=Math.sin(state.phi);camera.position.set(18*s*Math.sin(state.theta),18*Math.cos(state.phi),18*s*Math.cos(state.theta)).add(CENTER);camera.lookAt(CENTER);camera.updateMatrixWorld();const degrees=((state.theta*180/Math.PI)%360+360)%360;$('angleLabel').textContent=Math.round(degrees).toString().padStart(3,'0')+'°';$('compassNeedle').style.transform=`rotate(${degrees}deg)`;}
function evaluate(){
 const L=LEVELS[state.level];let error=0;
 puzzle.updateMatrixWorld(true);
 if(L.type==='scale'){error=Math.abs(Math.log(state.scale/L.target))*.62;}
 else if(L.type==='occlusion'){
  const {hat,moon}=goals[0];const center=projectedPoint(hat,[0,.10,0]);const mp=projectedPoint(moon,[0,0,0]);const top=projectedPoint(hat,[0,.8,0]);const right=hat.position.clone().add(new THREE.Vector3(.62,0,0).applyQuaternion(camera.quaternion)).project(camera);const halfWidth=Math.abs(right.x*camera.aspect-center.x);const halfHeight=Math.abs(top.y-center.y);const moonR=projectedPoint(moon,[0,0,0]).distanceTo(projectedPoint(moon,new THREE.Vector3(.52,0,0).applyQuaternion(camera.quaternion).toArray()));const dx=Math.abs(center.x-mp.x),dy=Math.abs(center.y-mp.y);const outside=Math.max(0,dx+moonR-halfWidth,dy+moonR-halfHeight);const behind=camera.position.distanceTo(moon.position)>camera.position.distanceTo(hat.position);error=behind?outside*2.2:1;
 }else{
  let weight=0;for(const test of tests){const d=projectedPoint(test.a,test.ap).distanceTo(projectedPoint(test.b,test.bp));error+=d*test.weight;weight+=test.weight;}error=error/Math.max(weight,1)*2.1;
 }
 // A smooth score gives the player useful feedback while a strict final threshold preserves the puzzle.
 state.score=clamp(Math.round(100/(1+error*6)),0,100);
 if(state.solved)state.score=successScore;
 $('resonanceValue').innerHTML=state.score+'<span>%</span>';$('resonanceBar').style.width=state.score+'%';
 const ready=state.score>=94;$('castBtn').classList.toggle('ready',ready);$('resonanceMessage').textContent=ready?'幻象已就绪，施展你的魔术':state.score>=75?'很接近了，轻轻微调':state.score>=40?'共鸣正在增强':'让真实与幻象相遇';
 return {score:state.score,error};
}

function cast(){
 if(state.solved||dialogOpen())return;state.casts++;evaluate();ensureAudio();
 if(state.score<94){tone(180,.18,'sine',.045);toast(state.score>=75?'已经很接近了。再轻轻调整，让共鸣达到 94%。':'幻象还未完整。继续调整视角或尺度，让共鸣达到 94%。');state.magic=.3;return;}
 state.solved=true;dragging=null;keys.clear();state.magic=1;successScore=state.score;$('stageStatus').textContent='幻象，成为真实';$('castBtn').disabled=true;playSuccess();
 const earned=1+(state.hints===0?1:0)+(state.elapsed<90?1:0);saved.stars[state.level]=Math.max(saved.stars[state.level]||0,earned);saved.best[state.level]=Math.min(saved.best[state.level]??Infinity,Math.round(state.elapsed));saved.unlocked=Math.min(5,Math.max(saved.unlocked,state.level+1));persist();updateChapterUI();
 const L=LEVELS[state.level];$('successTitle').textContent=state.level===5?'你，就是魔术。':'你改变了真实。';$('successCopy').textContent=L.success;$('successStars').innerHTML=Array.from({length:3},(_,i)=>`<span class="${i<earned?'':'dim'}">✦</span>`).join(' ');$('successTime').textContent=timeString(state.elapsed);$('successHints').textContent=state.hints+' 次';$('successResonance').textContent=state.score+'%';$('nextBtn').textContent=state.level===5?'回顾六幕奇迹':'开启下一幕';
 successTimer=setTimeout(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());$('successDialog').showModal();},1500);
}
function giveHint(){if(state.solved)return;state.hints=Math.min(3,state.hints+1);$('hintText').textContent=LEVELS[state.level].hints[state.hints-1];$('hintCount').textContent=state.hints+' / 3';$('hintBtn').disabled=state.hints>=3;tone(523,.10,'sine',.035);}
function setLens(active,announce=true){state.lens=active;$('lensBtn').setAttribute('aria-pressed',String(active));document.body.classList.toggle('lens-active',active);if(targetGuide){if(LEVELS[state.level].type==='occlusion')targetGuide.visible=active;else targetGuide.traverse(o=>{if(o.material&&o.material.isLineDashedMaterial)o.material.opacity=active?.75:.18;});}if(announce)toast(active?'魔术透镜已开启：金色虚线是理想轮廓。再次按 V 关闭。':'已收起魔术透镜');}
function updateChapterUI(){
 $('chapterTrack').innerHTML=LEVELS.map((L,i)=>`<button data-level="${i}" ${i>saved.unlocked?'disabled':''} class="${i===state.level?'current':''} ${saved.stars[i]?'complete':''}" title="${L.title}${i>saved.unlocked?' · 待解锁':''}" aria-label="第 ${i+1} 幕 ${L.title}${i>saved.unlocked?'，尚未解锁':''}">${pad(i+1)}</button>`).join('');
 $('chapterGrid').innerHTML=LEVELS.map((L,i)=>`<button data-level="${i}" ${i>saved.unlocked?'disabled':''} class="chapter-card ${i===state.level?'current':''}"><span>${pad(i+1)}</span><h3>${L.title}</h3><small>${i>saved.unlocked?'完成上一幕解锁':saved.best[i]!==undefined?'最佳 '+timeString(saved.best[i]):i===state.level?'正在演出':'等待开幕'}</small><span class="card-stars">${i>saved.unlocked?'◇':'✦'.repeat(saved.stars[i]||0)}</span></button>`).join('');
}
function persist(){try{localStorage.setItem('parallax-theatre-v1',JSON.stringify(saved));}catch{}}
function pad(n){return String(n).padStart(2,'0');}
function timeString(t){return pad(Math.floor(t/60))+':'+pad(Math.floor(t%60));}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),4200);}
function dialogOpen(){return !!document.querySelector('dialog[open]');}
function resize(){if(!renderer)return;const rect=$('canvasWrap').getBoundingClientRect();renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();}

function setupEvents(){
 $('scaleSlider').addEventListener('input',e=>setScale(Number(e.target.value)));$('castBtn').addEventListener('click',cast);$('hintBtn').addEventListener('click',giveHint);$('resetBtn').addEventListener('click',()=>{loadLevel(state.level);toast('这一幕已重新开始。');});$('lensBtn').addEventListener('click',()=>setLens(!state.lens));
 $('chaptersBtn').addEventListener('click',()=>{$('chaptersDialog').showModal();keys.clear();});$('helpBtn').addEventListener('click',()=>{$('helpDialog').showModal();keys.clear();});$('helpCloseBtn').addEventListener('click',()=>$('helpDialog').close());
 document.querySelectorAll('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d&&d.id!=='successDialog'){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});d.addEventListener('cancel',e=>{if(d.id==='successDialog')e.preventDefault();});});
 document.body.addEventListener('click',e=>{const b=e.target.closest('[data-level]');if(b&&!b.disabled){loadLevel(Number(b.dataset.level));$('chaptersDialog').close();}});
 $('nextBtn').addEventListener('click',()=>{$('successDialog').close();if(state.level<5)loadLevel(state.level+1);else{$('chaptersDialog').showModal();toast('六幕奇迹已经完成。重演任意一幕，收集全部 18 颗星。');}});$('replayBtn').addEventListener('click',()=>{$('successDialog').close();loadLevel(state.level);});
 $('soundBtn').addEventListener('click',()=>{state.sound=!state.sound;saved.sound=state.sound;persist();updateSoundButton();if(state.sound){ensureAudio();tone(440,.4,'sine',.035);startMusic();}else clearInterval(musicTimer);});
 const canvas=$('scene');
 canvas.addEventListener('pointerdown',e=>{if(state.solved||dialogOpen())return;dragging={x:e.clientX,y:e.clientY,id:e.pointerId};state.moved=false;canvas.setPointerCapture(e.pointerId);ensureAudio();});
 canvas.addEventListener('pointermove',e=>{if(state.solved||dialogOpen()||!dragging||dragging.id!==e.pointerId)return;const dx=e.clientX-dragging.x,dy=e.clientY-dragging.y;if(Math.abs(dx)+Math.abs(dy)>1)state.moved=true;state.theta-=dx*.005;state.phi-=dy*.004;dragging.x=e.clientX;dragging.y=e.clientY;updateCamera();});
 function endDrag(e){if(dragging?.id===e.pointerId)dragging=null;}
 canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',()=>dragging=null);
 canvas.addEventListener('wheel',e=>{if(dialogOpen()||state.solved)return;e.preventDefault();if(controlled)setScale(state.scale-e.deltaY*.0014);else{state.theta+=e.deltaY*.0015;updateCamera();}},{passive:false});
 document.addEventListener('keydown',e=>{if(dialogOpen())return;if(e.target instanceof HTMLInputElement)return;const key=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown',' ','q','e','r','h','v'].includes(key))e.preventDefault();if(e.repeat&&[' ','r','h','v'].includes(key))return;keys.add(key);if(key===' ')cast();if(key==='r')loadLevel(state.level);if(key==='h')giveHint();if(key==='v')setLens(!state.lens);});document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();dragging=null;});document.addEventListener('visibilitychange',()=>{keys.clear();lastFrame=performance.now();});
 $('scene').addEventListener('webglcontextlost',e=>{e.preventDefault();toast('3D 场景暂时中断。刷新页面可恢复，已通关进度已保存。');});
}

function updateSoundButton(){$('soundBtn').innerHTML=state.sound?'♪':'♪<span class="sound-off"></span>';$('soundBtn').title=state.sound?'关闭声音':'开启声音';$('soundBtn').setAttribute('aria-label',$('soundBtn').title);$('soundBtn').setAttribute('aria-pressed',String(state.sound));}
function ensureAudio(){if(!state.sound)return;try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();if(!musicTimer)startMusic();}catch{}}
function tone(freq,duration=1,type='sine',vol=.03,delay=0){if(!state.sound||!audioCtx)return;const osc=audioCtx.createOscillator(),gain=audioCtx.createGain(),start=audioCtx.currentTime+delay;osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(vol,start+.025);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(gain).connect(audioCtx.destination);osc.start(start);osc.stop(start+duration+.03);}
function startMusic(){clearInterval(musicTimer);musicTimer=setInterval(()=>{if(document.hidden||!state.sound)return;const notes=[220,261.63,329.63,392,440,523.25];tone(notes[Math.floor(Math.random()*notes.length)],3,'sine',.013);},3000);}
function playSuccess(){[329.63,440,554.37,659.25,880].forEach((f,i)=>tone(f,1.8,'sine',.045,i*.12));}

function frame(now){
 requestAnimationFrame(frame);const dt=Math.min((now-lastFrame)/1000,.05);lastFrame=now;if(document.hidden)return;
 if(!dialogOpen()&&!state.solved){state.elapsed+=dt;$('timeLabel').textContent=timeString(state.elapsed);let changed=false;const speed=keys.has('shift')?.24:.65;
  if(keys.has('arrowleft')){state.theta-=dt*speed;changed=true;}if(keys.has('arrowright')){state.theta+=dt*speed;changed=true;}if(keys.has('arrowup')){state.phi-=dt*speed*.65;changed=true;}if(keys.has('arrowdown')){state.phi+=dt*speed*.65;changed=true;}if(keys.has('q'))setScale(state.scale-dt*.45);if(keys.has('e'))setScale(state.scale+dt*.45);if(changed)updateCamera();
 }
 if(!reducedMotion){particles.rotation.y+=dt*.009;for(const o of disposables){if(o.userData.float){const f=o.userData.float;o.position.y=f.base+Math.sin(now*.0014+f.phase)*.06;o.rotation.y+=dt*.18;}}wizard.rotation.y=.45+Math.sin(now*.0005)*.06;}
 if(state.magic>0){state.magic=Math.max(0,state.magic-dt*.18);goldGate.userData.portal.material.opacity=.055+state.magic*.3;particles.material.size=.028+state.magic*.045;}else{goldGate.userData.portal.material.opacity=.055;particles.material.size=.028;}
 if(state.solved&&!reducedMotion){wizard.position.x=THREE.MathUtils.lerp(wizard.position.x,1.8,dt*.32);wizard.position.z=THREE.MathUtils.lerp(wizard.position.z,-1.9,dt*.32);}else if(!state.solved){wizard.position.set(-2.45,-.51,2.2);}
 evaluate();renderer.render(scene,camera);
}

init();
