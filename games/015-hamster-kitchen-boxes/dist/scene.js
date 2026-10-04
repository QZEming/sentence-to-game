import * as THREE from './vendor/three.module.js';
import {pos,doorOpen} from './engine.mjs';
const colors={wood:0xc9955e,cream:0xffe9bb,teal:0x6eaf94,orange:0xd4944f};
export class KitchenScene {
 constructor(canvas,onTile){
  this.canvas=canvas;this.onTile=onTile;this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0xe7edde);this.scene.fog=new THREE.Fog(0xe7edde,35,65);
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.08;
  this.camera=new THREE.OrthographicCamera(-10,10,10,-10,.1,100);this.yaw=.42;this.pitch=.82;this.zoom=1;this.topView=false;this.boardRoot=new THREE.Group();this.scene.add(this.boardRoot);this.anim=[];this.particles=[];this.floaters=[];this.time=0;this.lastTime=performance.now();this.walkUntil=0;this.materials=new Map();this.hitPlane=new THREE.Plane(new THREE.Vector3(0,1,0),-.12);this.ray=new THREE.Raycaster();
  this.scene.add(new THREE.HemisphereLight(0xfff9e6,0x869c73,1.9));const sun=new THREE.DirectionalLight(0xffedcb,2.6);sun.position.set(-9,16,7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-15,right:15,top:15,bottom:-15,near:1,far:45});sun.shadow.bias=-.00025;sun.shadow.normalBias=.03;sun.shadow.radius=4;this.scene.add(sun);const fill=new THREE.DirectionalLight(0xc6e8ed,1.2);fill.position.set(9,6,-8);this.scene.add(fill);
  this.makeKitchen();this.resize=new ResizeObserver(()=>this.resizeCanvas());this.resize.observe(canvas);this.bindCamera();this.frame=this.frame.bind(this);requestAnimationFrame(this.frame);
 }
 mat(color,opts={}){const key=color+JSON.stringify(opts);if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.78,...opts}));return this.materials.get(key);}
 mesh(geometry,color,x=0,y=0,z=0,parent=this.scene,opts={}){const m=new THREE.Mesh(geometry,this.mat(color,opts));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 box(w,h,d,c,x=0,y=0,z=0,p=this.scene,opts={}){return this.mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,p,opts);}
 ball(x,y,z,sx,sy,sz,c,p=this.scene){const m=this.mesh(new THREE.SphereGeometry(1,20,14),c,x,y,z,p);m.scale.set(sx,sy,sz);return m;}
 cyl(r1,r2,h,c,x,y,z,p=this.scene,opts={}){return this.mesh(new THREE.CylinderGeometry(r1,r2,h,40),c,x,y,z,p,opts);}
 ring(r,t,c,x,y,z,p=this.scene){const m=this.mesh(new THREE.TorusGeometry(r,t,10,48),c,x,y,z,p);m.rotation.x=-Math.PI/2;return m;}
 line(points,c,p=this.scene,r=.015){return this.mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(a=>new THREE.Vector3(...a))),12,r,6,false),c,0,0,0,p);}
 label(text,w,h,c='#5e6e56',bg='#fff5da'){const ca=document.createElement('canvas');ca.width=512;ca.height=256;const ctx=ca.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,256);ctx.fillStyle=c;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 74px Georgia';ctx.fillText(text,256,132);const tx=new THREE.CanvasTexture(ca);tx.colorSpace=THREE.SRGBColorSpace;return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tx,roughness:1}));}
 makeKitchen(){
  this.box(100,.4,100,0xe1e7d8,0,-1.12,0);
  this.box(29,.7,23,0xdbd6bb,0,-.76,0);for(let i=-5;i<=5;i++)this.box(29,.008,.025,0xc9cab1,0,-.402,i*2.1);
  const wall=this.box(40,13,.3,0xe4eadc,0,5,-11);wall.receiveShadow=true;for(let x=-19;x<20;x+=3.2)this.box(.025,12,.03,0xd1dcca,x,5,-10.82);for(let y=0;y<12;y+=2.1)this.box(40,.025,.03,0xd1dcca,0,y,-10.82);
  // Breakfast cup, full porcelain rim, tea and an oversized curved handle.
  const mug=new THREE.Group();mug.position.set(6.8,-.37,-3.1);mug.rotation.y=-.3;this.scene.add(mug);this.cyl(1.12,1,2.35,0xbed5a6,0,1.22,0,mug);this.cyl(.95,.95,.03,0xefe7cb,0,2.404,0,mug);this.cyl(.85,.85,.02,0x99765b,0,2.425,0,mug);this.ring(1.05,.1,0xe0e6bd,0,2.43,0,mug);const handle=this.mesh(new THREE.TorusGeometry(.67,.16,12,40),0xbed5a6,1.28,1.3,0,mug);handle.rotation.y=Math.PI/2;const label=this.label('GOOD\n',1.25,.55,'#6f8960','#bed5a6');label.position.set(0,1.25,1.014);mug.add(label);for(let i=0;i<3;i++){const steam=this.line([[0,0,0],[.12,.6,.1],[-.08,1.1,0],[.12,1.5,.05]],0xffffff,mug,.024);steam.position.set((i-1)*.35,2.45,0);steam.material=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.22});this.floaters.push({obj:steam,phase:i,type:'steam'});}
  // Toaster and toast slices.
  const toaster=new THREE.Group();toaster.position.set(-6.3,-.25,-4.5);toaster.rotation.y=.18;this.scene.add(toaster);this.box(3.3,2.1,2,0xb5cec1,0,1.05,0,toaster);this.ball(0,1.98,0,1.65,.35,1,0xb5cec1,toaster);for(const z of [-.45,.45]){this.box(2.35,.04,.28,0x546d61,0,2.24,z,toaster);const bread=this.box(1.8,.75,.21,0xdba263,0,2.52,z,toaster);this.ball(0,2.88,z,.9,.35,.11,0xdba263,toaster);this.box(1.49,.61,.22,0xffe6ad,0,2.57,z,toaster);this.ball(0,2.88,z,.745,.23,.115,0xffe6ad,toaster);}this.box(.2,.11,.7,0x809d8d,1.74,1.2,0,toaster);this.ball(1.86,1.3,.08,.12,.15,.2,0xf0e8ce,toaster);const badge=this.label('MORNING',1.5,.43,'#637a6d','#d5e3d4');badge.position.set(0,.95,1.012);toaster.add(badge);for(const x of [-1.15,1.15])for(const z of [-.65,.65])this.cyl(.16,.16,.18,0x6c8070,x,-.04,z,toaster);
  // Stacked ceramic plates and cookies.
  const plate=new THREE.Group();plate.position.set(-6.65,-.28,3.7);plate.rotation.y=.4;this.scene.add(plate);for(let i=0;i<3;i++){this.cyl(1.8,1.65,.1,0xeef0da,0,i*.14,0,plate);this.ring(1.66,.09,0xd2dac0,0,.08+i*.14,0,plate);}for(const [x,z] of [[-.6,-.3],[.6,-.35],[0,.65]]){this.cyl(.64,.67,.21,0xd6a568,x,.5,z,plate);for(let i=0;i<7;i++){const a=i*2.4;this.ball(x+Math.cos(a)*.4,.615,z+Math.sin(a)*.4,.065,.023,.054,0x815a3e,plate);}}
  // Linen and a giant wooden spoon.
  const linen=this.box(3,.055,3.8,0xe7af7d,5.8,-.3,4.6);linen.rotation.y=-.23;for(let i=-5;i<6;i++){const stripe=this.box(.048,.007,3.7,0xffe4b7,0,.033,i*.1,linen);stripe.position.x=i*.24;stripe.position.y=.035;stripe.position.z=0;}
  const spoon=new THREE.Group();spoon.position.set(5.9,-.17,4.6);spoon.rotation.y=-.5;this.scene.add(spoon);this.box(.3,.13,3.7,0xb78a53,0,.07,.5,spoon);this.ball(0,.1,-1.8,.68,.17,.92,0xbb9058,spoon);this.ball(0,.17,-1.8,.51,.07,.72,0xc79d64,spoon);
  // A herb pot towering over the tiny adventurer.
  const plant=new THREE.Group();plant.position.set(4.2,-.35,-7);this.scene.add(plant);this.cyl(.72,.52,1.25,0xcda17e,0,.62,0,plant);this.ring(.7,.09,0xdfb58e,0,1.19,0,plant);this.cyl(.61,.6,.04,0x766545,0,1.24,0,plant);for(let i=0;i<8;i++){const a=i*2.4;const x=Math.sin(a)*.8,z=Math.cos(a)*.7;this.line([[0,1.25,0],[x*.5,2+i*.1,z*.5],[x,2.3+i*.14,z]],0x698457,plant,.027);const leaf=this.ball(x,2.3+i*.14,z,.24,.55,.09,i%2?0x839e63:0x6d925b,plant);leaf.rotation.z=-x*.9;leaf.rotation.y=a;}
  // Jam jar with gingham lid.
  const jar=new THREE.Group();jar.position.set(-2.1,-.34,-7.5);this.scene.add(jar);this.cyl(.7,.66,1.55,0xca8a68,0,.8,0,jar);this.cyl(.78,.78,.18,0xedc399,0,1.64,0,jar);this.ring(.72,.035,0xfae1b4,0,1.73,0,jar);const jam=this.label('HONEY',1.08,.65,'#9b724b','#f8e9bb');jam.position.set(0,.8,.674);jar.add(jam);
  // Quiet kitchen scatter.
  for(let i=0;i<18;i++){const a=i*2.39,r=5.8+(i%4)*.5;this.ball(Math.cos(a)*r,-.33,Math.sin(a)*r,.055+(i%3)*.03,.035,.045,0xbb9863);}this.box(2.2,.2,1.4,0xe9c568,-7.5,-.2,.1);for(let i=0;i<4;i++)this.ball(-8+i*.4,-.08,.05,.11,.015,.1,0xd6aa45);
 }
 coord(p){return new THREE.Vector3((p[0]-(this.board.w-1)/2)*1.05,.1,(p[1]-(this.board.h-1)/2)*1.05);}
 clearBoard(){for(const child of [...this.boardRoot.children]){child.traverse(o=>{if(o.geometry)o.geometry.dispose();});this.boardRoot.remove(child);}this.anim=[];this.particles.forEach(p=>this.scene.remove(p.mesh));this.particles=[];}
 build(board,state){
  this.clearBoard();this.board=board;this.state=state;this.crates=[];this.targets=[];this.seedMeshes=new Map();this.gates=[];this.plates=[];
  const w=board.w*1.05,h=board.h*1.05;
  this.box(w+.26,.35,h+.26,0xc99d65,0,-.15,0,this.boardRoot);this.box(w+.14,.11,h+.14,0xe0b981,0,.035,0,this.boardRoot);const handle=this.ring(.65,.19,0xc99d65,0,-.12,h/2+.5,this.boardRoot);handle.scale.z=1.2;
  for(let y=0;y<board.h;y++)for(let x=0;x<board.w;x++){
   const p=pos(x,y),v=this.coord([x,y]);const boundary=x===0||y===0||x===board.w-1||y===board.h-1;
   if(board.walls.has(p)){
    if(boundary){this.box(1.045,.19,1.045,0xd7ae78,v.x,.18,v.z,this.boardRoot);continue;}
    const wall=this.box(.96,.62,.96,0xf1d08c,v.x,.39,v.z,this.boardRoot);this.box(.98,.06,.98,0xf7dfab,v.x,.73,v.z,this.boardRoot);for(let k=0;k<3;k++)this.ball(v.x-.27+k*.27,.425+(k%2)*.12,v.z+.486,.08,.067,.013,0xdab16e,this.boardRoot);continue;
   }
   const icy=board.ice.has(p);const floor=this.box(1.015,.045,1.015,icy?0xb4dce0:((x+y)%2?0xf0d09d:0xf7dbac),v.x,.104,v.z,this.boardRoot,icy?{roughness:.18,metalness:.12}:{});
   if(icy){for(let k=0;k<2;k++){const s=this.box(.32,.012,.025,0xeafcff,v.x-.19+k*.3,.135,v.z+.12-k*.27,this.boardRoot);s.rotation.y=-.7;}}
   if(board.goals.has(p)){const g=new THREE.Group();g.position.set(v.x,.145,v.z);this.boardRoot.add(g);this.cyl(.4,.42,.035,0x91c5a9,0,0,0,g);this.ring(.32,.025,0xe5fae7,0,.03,0,g);const leaf=this.ball(0,.035,0,.1,.012,.14,0xd0edca,g);leaf.rotation.y=.6;this.targets.push({g,p});}
   if(board.plates.has(p)){const g=new THREE.Group();g.position.set(v.x,.15,v.z);this.boardRoot.add(g);this.box(.77,.08,.77,0xb78c4e,0,0,0,g);const top=this.box(.62,.075,.62,0xf5c454,0,.07,0,g);this.ring(.2,.025,0xffec9c,0,.117,0,g);this.plates.push({g,top,p});}
   if(board.doors.has(p)){const g=new THREE.Group();g.position.set(v.x,.15,v.z);this.boardRoot.add(g);for(const z of [-.39,.39])this.box(.15,.85,.15,0x9da79a,0,.4,z,g);const bars=new THREE.Group();g.add(bars);for(let k=0;k<3;k++)this.box(.07,.68,.07,0xc2bb95,0,.4,(k-1)*.24,bars);this.box(.13,.11,.95,0x83947b,0,.81,0,bars);this.gates.push({g,bars});}
  }
  state.boxes.forEach((b,i)=>{const g=this.makeCrate();const v=this.coord(b);g.position.copy(v);this.boardRoot.add(g);this.crates.push(g);});
  for(const p of board.seeds){const [x,y]=p.split(',').map(Number);const v=this.coord([x,y]);const g=new THREE.Group();g.position.set(v.x,.52,v.z);this.boardRoot.add(g);const s=this.ball(0,0,0,.115,.23,.09,0x6f5c3c,g);s.rotation.z=.3;const stripe=this.ball(.016,0,.084,.03,.17,.013,0xf3df99,g);stripe.rotation.z=.3;const halo=this.ring(.21,.008,0xe5c373,0,-.24,0,g);this.seedMeshes.set(p,g);}
  this.hamster=this.makeHamster();this.hamster.position.copy(this.coord(state.player));this.boardRoot.add(this.hamster);this.hamster.rotation.y=0;this.facing=0;this.update(state,true);this.resizeCanvas();
 }
 makeCrate(){const g=new THREE.Group();this.box(.72,.67,.72,0xb78953,0,.37,0,g);for(let row=0;row<3;row++){const y=.14+row*.225;for(const z of [-.377,.377])this.box(.81,.185,.062,row%2?0xd5a36b:0xe2b47c,0,y,z,g);for(const x of [-.38,.38])this.box(.063,.185,.72,0xc99a61,x,y,0,g);}for(const x of [-.34,.34])for(const z of [-.4,.4]){this.box(.08,.73,.045,0xb78950,x,.38,z,g);for(const y of [.13,.63])this.ball(x,y,z*1.07,.022,.022,.012,0x8b7658,g);}for(let i=0;i<4;i++)this.box(.16,.06,.76,0xdfb07b,(i-1.5)*.19,.737,0,g);const tape=this.box(.12,.012,.79,0xf3dcaf,0,.776,0,g);const tag=this.label('✦',.26,.24,'#839263','#f5edc9');tag.position.set(.05,.41,.419);g.add(tag);g.userData.baseMat=this.mat(0xd5a36b);return g;}
 makeHamster(){
  const g=new THREE.Group(),body=new THREE.Group();g.add(body);g.userData.body=body;const fur=0xdca45e,light=0xffe8ba;
  this.ball(0,.48,0,.34,.41,.29,fur,body);this.ball(0,.45,.225,.25,.28,.105,light,body);this.ball(0,.85,.02,.355,.295,.295,fur,body);this.ball(-.18,.755,.248,.18,.16,.125,light,body);this.ball(.18,.755,.248,.18,.16,.125,light,body);
  for(const x of [-.25,.25]){this.ball(x,1.08,.005,.13,.155,.087,fur,body);this.ball(x,1.09,.067,.08,.098,.028,0xe5b094,body);}for(const x of [-.143,.143]){this.ball(x,.91,.285,.052,.062,.035,0x342d27,body);this.ball(x-.011,.93,.315,.016,.02,.008,0xffffff,body);}
  this.ball(0,.788,.37,.049,.034,.03,0xbb8070,body);this.line([[0,.77,.373],[0,.724,.377],[-.047,.712,.356]],0x8f755a,body,.008);this.line([[0,.724,.377],[.047,.712,.356]],0x8f755a,body,.008);
  for(const side of [-1,1])for(let k=0;k<2;k++)this.line([[side*.23,.775-k*.04,.32],[side*.42,.785-k*.07,.31],[side*.52,.81-k*.1,.3]],0xb89b73,body,.007);
  this.ball(0,.28,-.29,.09,.09,.1,0xeed1a5,body);for(const x of [-.27,.27]){const arm=this.ball(x,.49,.19,.1,.18,.1,fur,body);arm.rotation.z=-x*1.5;}g.userData.feet=[];for(const x of [-.19,.19])g.userData.feet.push(this.ball(x,.105,.12,.105,.065,.155,0xc99462,body));
  const bandana=this.mesh(new THREE.ConeGeometry(.14,.23,3),0x70a992,0,.6,.31,body);bandana.rotation.z=Math.PI;this.ball(0,.63,-.28,.12,.1,.07,0x79b599,body);return g;
 }
 chefHat(show){if(!this.hamster)return;if(this.hamster.userData.hat)this.hamster.userData.hat.visible=show;else if(show){const hat=new THREE.Group();this.cyl(.23,.24,.17,0xfff9e3,0,1.11,0,hat);for(const [x,z] of [[-.14,0],[.14,0],[0,.1]])this.ball(x,1.28,z,.16,.15,.16,0xfff9e3,hat);this.hamster.userData.body.add(hat);this.hamster.userData.hat=hat;}}
 update(state,instant=false,direction=null){
  this.state=state;const duration=instant?0:220;this.walkUntil=performance.now()+duration;
  const tween=(obj,target,d=duration)=>{this.anim=this.anim.filter(a=>a.obj!==obj);if(!d)obj.position.copy(target);else this.anim.push({obj,from:obj.position.clone(),to:target,start:performance.now(),duration:d});};
  tween(this.hamster,this.coord(state.player));if(direction){this.facing={U:Math.PI,D:0,L:-Math.PI/2,R:Math.PI/2}[direction];}
  state.boxes.forEach((b,i)=>{const target=this.coord(b);tween(this.crates[i],target,instant?0:(i===state.lastPush?240+(state.slide||0)*60:220));});
  for(const [p,g]of this.seedMeshes)g.visible=!state.collected.includes(p);
  for(const {g,p}of this.targets){const occupied=state.boxes.some(b=>pos(...b)===p);g.children[0].material=this.mat(occupied?0x65b58c:0x91c5a9);}
  const open=doorOpen(this.board,state);for(const gate of this.gates)tween(gate.bars,new THREE.Vector3(0,open?-.68:0,0),instant?0:300);
  for(const plate of this.plates){const pressed=pos(...state.player)===plate.p||state.boxes.some(b=>pos(...b)===plate.p);plate.top.position.y=pressed?.02:.07;plate.top.material=this.mat(pressed?0x92b37b:0xf5c454);}
 }
 burst(p,color=0xe9ba59,count=14){const v=this.coord(p);for(let i=0;i<count;i++){const m=this.ball(v.x,v.y+.5,v.z,.035,.05,.035,color);this.particles.push({mesh:m,velocity:new THREE.Vector3((Math.random()-.5)*3,2+Math.random()*2,(Math.random()-.5)*3),life:1});}}
 celebrate(){for(const b of this.state.boxes)this.burst(b,0xe2b348,30);}
 showHint(d){if(this.hintArrow){this.boardRoot.remove(this.hintArrow);this.hintArrow=null;}const v=this.coord(this.state.player);const dirs={U:[0,-1],D:[0,1],L:[-1,0],R:[1,0]};const [x,z]=dirs[d];const g=new THREE.Group();g.position.set(v.x+x*.64,.2,v.z+z*.64);const arrow=this.mesh(new THREE.ConeGeometry(.14,.29,3),0xe18a41,0,0,0,g);arrow.rotation.x=Math.PI/2;arrow.rotation.z=0;g.rotation.y={U:Math.PI,D:0,L:-Math.PI/2,R:Math.PI/2}[d];this.boardRoot.add(g);this.hintArrow=g;this.hintUntil=performance.now()+4500;}
 resizeCanvas(){const {width,height}=this.canvas.getBoundingClientRect();if(!width||!height)return;this.renderer.setSize(width,height,false);const aspect=width/height;let span=Math.max(12,(this.board?.h||8)*1.32);if(aspect<1)span=Math.max(span,(this.board?.w||8)*1.25/aspect);span/=this.zoom;this.camera.left=-span*aspect/2;this.camera.right=span*aspect/2;this.camera.top=span/2;this.camera.bottom=-span/2;this.camera.updateProjectionMatrix();this.positionCamera();}
 positionCamera(){const pitch=this.topView?1.54:this.pitch;const r=22;this.camera.position.set(Math.sin(this.yaw)*Math.cos(pitch)*r,Math.sin(pitch)*r,Math.cos(this.yaw)*Math.cos(pitch)*r);this.camera.lookAt(0,.1,0);}
 toggleCamera(){this.topView=!this.topView;this.yaw=this.topView?0:.42;this.positionCamera();return this.topView;}
 changeZoom(amount){this.zoom=THREE.MathUtils.clamp(this.zoom+amount,.7,1.5);this.resizeCanvas();}
 bindCamera(){let pointer=null;this.canvas.addEventListener('pointerdown',e=>{pointer={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};this.canvas.setPointerCapture(e.pointerId);});this.canvas.addEventListener('pointermove',e=>{if(!pointer)return;const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY;if(Math.abs(e.clientX-pointer.x)+Math.abs(e.clientY-pointer.y)>7)pointer.moved=true;if(pointer.moved){this.yaw=THREE.MathUtils.clamp(this.yaw+dx*.005,-.7,1.1);this.pitch=THREE.MathUtils.clamp(this.pitch+dy*.004,.55,1.25);this.topView=false;this.positionCamera();}pointer.lastX=e.clientX;pointer.lastY=e.clientY;});this.canvas.addEventListener('pointerup',e=>{if(pointer&&!pointer.moved&&this.board){const r=this.canvas.getBoundingClientRect();this.ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),this.camera);const hit=new THREE.Vector3();if(this.ray.ray.intersectPlane(this.hitPlane,hit)){const x=Math.round(hit.x/1.05+(this.board.w-1)/2),y=Math.round(hit.z/1.05+(this.board.h-1)/2);this.onTile(x,y);}}pointer=null;});this.canvas.addEventListener('pointercancel',()=>pointer=null);this.canvas.addEventListener('wheel',e=>{e.preventDefault();this.changeZoom(-Math.sign(e.deltaY)*.06);},{passive:false});}
 frame(now){const dt=Math.min((now-this.lastTime)/1000,.04);this.lastTime=now;this.time+=dt;
  this.anim=this.anim.filter(a=>{const t=Math.min((now-a.start)/a.duration,1),e=1-Math.pow(1-t,3);a.obj.position.lerpVectors(a.from,a.to,e);return t<1;});
  if(this.hamster){const body=this.hamster.userData.body,walking=now<this.walkUntil;body.position.y=walking?Math.abs(Math.sin(now*.024))*.035:Math.sin(this.time*2.4)*.012;let delta=((this.facing-this.hamster.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;this.hamster.rotation.y+=delta*Math.min(1,dt*18);this.hamster.userData.feet.forEach((f,i)=>f.position.z=.12+(walking?Math.sin(now*.025+i*Math.PI)*.07:0));}
  let i=0;for(const g of this.seedMeshes?.values()||[]){g.position.y=.49+Math.sin(this.time*2.4+i++)*.045;g.rotation.y=this.time*.75;}
  for(const f of this.floaters){f.obj.position.y=2.48+Math.sin(this.time*.7+f.phase)*.09;f.obj.rotation.y=Math.sin(this.time*.6+f.phase)*.3;}
  this.particles=this.particles.filter(p=>{p.life-=dt;p.velocity.y-=dt*5;p.mesh.position.addScaledVector(p.velocity,dt);p.mesh.scale.multiplyScalar(.98);if(p.life<=0){this.scene.remove(p.mesh);p.mesh.geometry.dispose();return false;}return true;});
  if(this.hintArrow){this.hintArrow.position.y=.25+Math.sin(this.time*6)*.06;if(now>this.hintUntil){this.boardRoot.remove(this.hintArrow);this.hintArrow=null;}}
  this.renderer.render(this.scene,this.camera);requestAnimationFrame(this.frame);
 }
}
