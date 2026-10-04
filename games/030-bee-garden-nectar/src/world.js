import * as T from './vendor/three.module.js';
import { SPECIES } from './core.js';
export {T};
let seed=81294;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};const range=(a,b)=>a+random()*(b-a);
const materials=new Map();function mat(c){if(!materials.has(c))materials.set(c,new T.MeshStandardMaterial({color:c,roughness:.88,flatShading:true}));return materials.get(c);}
const sphere=new T.IcosahedronGeometry(1,1),smooth=new T.SphereGeometry(1,16,10),box=new T.BoxGeometry(1,1,1);
function mesh(geo,c,parent,x=0,y=0,z=0,sx=1,sy=sx,sz=sx){let m=new T.Mesh(geo,typeof c==='string'||typeof c==='number'?mat(c):c);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function ellipsoid(c,p,x,y,z,sx,sy,sz){return mesh(sphere,c,p,x,y,z,sx,sy,sz);}
function cylinder(c,p,x,y,z,r1,r2,h,segments=9){return mesh(new T.CylinderGeometry(r1,r2,h,segments),c,p,x,y,z);}
function branch(p,a,b,r,c){let delta=b.clone().sub(a);let m=mesh(new T.CylinderGeometry(r*.6,r,delta.length(),6),c,p);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return m;}
function batchStatic(root,excluded=new Set()){
 root.updateWorldMatrix(true,true);const inverse=root.matrixWorld.clone().invert(),groups=new Map();
 function visit(node){if(excluded.has(node)||node.isInstancedMesh||node.isLineSegments||node.isPoints)return;if(node.isMesh&&!Array.isArray(node.material)){let entry=groups.get(node.material);if(!entry){entry=[];groups.set(node.material,entry);}entry.push(node);}else for(const child of [...node.children])visit(child);}
 for(const child of [...root.children])visit(child);
 for(const [material,meshes] of groups){if(meshes.length<2)continue;const pieces=meshes.map(m=>{const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.applyMatrix4(inverse.clone().multiply(m.matrixWorld));return g;});const total=pieces.reduce((sum,g)=>sum+g.attributes.position.count,0);const geo=new T.BufferGeometry();for(const name of ['position','normal','uv']){const size=name==='uv'?2:3,data=new Float32Array(total*size);let offset=0;for(const piece of pieces){const a=piece.getAttribute(name);if(a)data.set(a.array,offset);offset+=piece.attributes.position.count*size;}geo.setAttribute(name,new T.BufferAttribute(data,size));}const joined=new T.Mesh(geo,material);joined.castShadow=meshes.some(m=>m.castShadow);joined.receiveShadow=true;root.add(joined);meshes.forEach(m=>m.removeFromParent());pieces.forEach(g=>g.dispose());}
}
export function makeBee(scale=1,wasp=false){
 const bee=new T.Group();const body=new T.Group();bee.add(body);const dark=wasp?'#493224':'#55472e';const yellow=wasp?'#e5ab37':'#f5c641';
 mesh(smooth,yellow,body,0,0,0,.46,.43,.75);
 for(let z of [-.31,.14]){let stripe=mesh(new T.SphereGeometry(1,16,10),dark,body,0,0,z,.464,.435,.14);}
 mesh(smooth,yellow,body,0,.03,-.66,.38,.37,.32);
 for(let x of [-.17,.17]){mesh(smooth,'#343b2b',body,x,.13,-.924,.07,.09,.05);mesh(smooth,'#fffbee',body,x-.014,.155,-.963,.018,.021,.012);branch(body,new T.Vector3(x,.28,-.73),new T.Vector3(x*1.6,.61,-.85),.021,dark);mesh(smooth,dark,body,x*1.6,.61,-.85,.045);}
 mesh(new T.ConeGeometry(.11,.28,7),dark,body,0,-.01,.81).rotation.x=Math.PI/2;
 const wingMat=new T.MeshPhysicalMaterial({color:'#f7fdff',transparent:true,opacity:.66,roughness:.25,metalness:0,side:T.DoubleSide,depthWrite:false});
 const wings=[];for(let side of [-1,1]){let pivot=new T.Group();pivot.position.set(side*.25,.28,-.1);body.add(pivot);mesh(smooth,wingMat,pivot,side*.38,.08,.09,.52,.035,.29);mesh(smooth,wingMat,pivot,side*.24,.02,.35,.37,.03,.22);wings.push(pivot);for(let z of [-.28,.15,.42])branch(body,new T.Vector3(side*.23,-.25,z),new T.Vector3(side*.42,-.48,z+.09),.023,dark);}
 if(!wasp){for(let x of [-.34,.34])ellipsoid('#e3a334',body,x,-.24,.32,.14,.16,.16);}
 for(const wing of wings)batchStatic(wing);batchStatic(body,new Set(wings));
 bee.scale.setScalar(scale);bee.userData={wings,body};return bee;
}
function flower(parent,type,x,z,scale=1){
 const d=SPECIES[type];const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(scale);parent.add(g);
 const h=type===3?1.65:type===1?.94:.83;
 cylinder('#609347',g,0,h/2,0,.027,.047,h,5);
 for(let side of [-1,1]){let leaf=ellipsoid('#78a353',g,side*.19,h*.42,0,.26,.065,.1);leaf.rotation.z=side*.4;}
 const head=new T.Group();head.position.y=h;g.add(head);
 if(type===1){for(let i=0;i<4;i++){for(let a=0;a<3;a++)ellipsoid(i%2?'#b59ce1':d.color,head,Math.cos(a*2.1+i)*.085,i*.115,Math.sin(a*2.1+i)*.085,.14,.17,.12);}}
 else {const petals=type===3?11:8;const sz=type===3?.42:.28;for(let i=0;i<petals;i++){let a=i/petals*Math.PI*2;let p=ellipsoid(d.color,head,Math.cos(a)*sz*.92,Math.sin(i*3)*.015,Math.sin(a)*sz*.92,sz,.085,type===2?.14:.11);p.rotation.y=-a;p.rotation.z=.12;}mesh(smooth,d.center,head,0,.065,0,type===3?.25:.14,.095,type===3?.25:.14);}
 return {group:g,head,x,z,type,stock:d.stock,max:d.stock,regrow:0,harvested:false,phase:random()*6.28,height:h*scale};
}
export function buildWorld(canvas){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
 const scene=new T.Scene();scene.background=new T.Color('#dfe8d5');scene.fog=new T.Fog('#dfe8d5',75,135);
 const camera=new T.PerspectiveCamera(37,1,.1,180);camera.position.set(29,36,40);camera.lookAt(0,0,0);
 const ambient=new T.HemisphereLight('#fff6dc','#73925c',2.3);scene.add(ambient);
 const sun=new T.DirectionalLight('#fff0cc',3.4);sun.position.set(-20,35,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-32;sun.shadow.camera.right=32;sun.shadow.camera.top=32;sun.shadow.camera.bottom=-32;sun.shadow.camera.near=1;sun.shadow.camera.far=100;sun.shadow.bias=-.00035;sun.shadow.normalBias=.04;sun.shadow.radius=4;scene.add(sun);
 const ground=new T.Group();scene.add(ground);
 cylinder('#a6bc7c',ground,0,-.62,0,24.1,23.5,1.12,80);cylinder('#bdcb91',ground,0,-.15,0,24,24.1,.5,80);cylinder('#9cb974',ground,0,.045,0,23.7,24,.13,80);
 const floor=mesh(new T.PlaneGeometry(500,500),new T.MeshStandardMaterial({color:'#dee7d5',roughness:1}),scene,0,-1.25,0);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
 // Organic meadow patches, footpaths and a cool blue pond.
 const patches=[{x:-6,z:6,type:0,count:17},{x:-6,z:-9,type:1,count:15},{x:8,z:11,type:2,count:15},{x:11,z:-10,type:3,count:13}];
 for(let i=0;i<18;i++){let a=i/18*Math.PI*2;ellipsoid(i%2?'#b3c78b':'#a8c37f',ground,Math.cos(a)*range(5,20),.09,Math.sin(a)*range(4,19),range(2,5),.025,range(2,4));}
 const path=new T.CatmullRomCurve3([new T.Vector3(-12,.13,-7),new T.Vector3(-10,.13,-1),new T.Vector3(-1,.13,2),new T.Vector3(5,.13,5),new T.Vector3(8,.13,15)]);
 for(let i=0;i<66;i++){const p=path.getPoint(i/65);let tile=cylinder(i%3?'#d5cdab':'#d9d1b2',ground,p.x,.1,p.z,.65,.68,.09,7);tile.scale.z=.77;tile.rotation.y=random()*3;}
 const pond=new T.Group();pond.position.set(10,.08,2);scene.add(pond);let pondBorder=mesh(new T.CylinderGeometry(4.7,4.8,.15,40),'#c6caa1',pond);pondBorder.scale.z=.7;
 const waterMat=new T.MeshStandardMaterial({color:'#7bced0',roughness:.24,metalness:.12,transparent:true,opacity:.94});const water=mesh(new T.CylinderGeometry(4.33,4.33,.08,48),waterMat,pond,0,.09,0);water.scale.z=.68;
 const ripples=[];for(let i=0;i<4;i++){let r=mesh(new T.RingGeometry(.8, .83,40),new T.MeshBasicMaterial({color:'#d4f1de',transparent:true,opacity:.4,side:T.DoubleSide}),pond,range(-2,2),.15,range(-1,1));r.rotation.x=-Math.PI/2;r.scale.y=.65;r.userData.phase=i; ripples.push(r);}
 for(let i=0;i<7;i++){const a=range(0,6.28),rad=range(1,3.7);let lily=mesh(new T.CylinderGeometry(.4,.4,.025,12),'#79a765',pond,Math.cos(a)*rad,.17,Math.sin(a)*rad*.6);if(i%3===0){let f=flower(pond,2,lily.position.x,lily.position.z,.25);f.group.position.y=.15;}}
 for(let i=0;i<16;i++){let a=i/16*6.28;let rock=ellipsoid(i%2?'#b1b7a1':'#c5c5ac',pond,Math.cos(a)*4.6,.2,Math.sin(a)*3.2,range(.2,.55),range(.2,.45),range(.2,.45));rock.rotation.y=random()*5;}
 // Timber footbridge beside the reeds.
 let bridge=new T.Group();bridge.position.set(10,.32,4.2);bridge.rotation.y=-.12;scene.add(bridge);for(let i=0;i<9;i++)mesh(box,i%2?'#b5986a':'#c5a876',bridge,i*.45-1.8,.06,0,.4,.14,1.7);for(let x of [-1.85,1.85])for(let z of [-.83,.83])mesh(box,'#977b52',bridge,x,.38,z,.13,.78,.13);for(let z of [-.83,.83])mesh(box,'#b39461',bridge,0,.7,z,3.85,.1,.1);
 for(let i=0;i<15;i++){let a=range(0,6.28);let x=10+Math.cos(a)*4.8,z=2+Math.sin(a)*3.4;for(let j=0;j<3;j++){let h=range(.5,1.1);let reed=cylinder('#768e4c',scene,x+j*.11,h/2,z,.035,.04,h,5);if(j===1)cylinder('#8e6643',scene,x+j*.11,h,z,.075,.075,.3,6);}}
 // Five-lobed trees with visible low-poly crowns.
 const treeLocations=[[-17,-11],[-17,0],[-18,8],[-12,-17],[-3,-19],[7,-18],[18,-9],[19,0],[17,12],[-14,16]];
 treeLocations.forEach(([x,z],i)=>{const tree=new T.Group();tree.position.set(x,0,z);scene.add(tree);let h=range(3.3,4.8),s=range(.8,1.2);cylinder('#99774b',tree,0,h*.42,0,.17,.32,h*.84,7);branch(tree,new T.Vector3(0,h*.45,0),new T.Vector3(.7,h*.82,.2),.14,'#99774b');const palette=i%3===0?['#92b370','#a6c581','#b8cb89']:['#769e5d','#91b474','#a6c583'];ellipsoid(palette[0],tree,0,h,0,1.9*s,1.8*s,1.7*s);ellipsoid(palette[1],tree,-1,h-.4,.5,1.4*s,1.3*s,1.3*s);ellipsoid(palette[2],tree,.8,h+.3,.3,1.4*s,1.4*s,1.25*s);if(i%3===0){for(let j=0;j<6;j++){let a=j;ellipsoid('#e8ad6b',tree,Math.cos(a)*1.5*s,h+Math.sin(j*3)*.8,Math.sin(a)*1.4*s,.19,.2,.19);}}});
 // White picket fence, with a small opening towards the meadow.
 function fence(x,z,angle){let g=new T.Group();g.position.set(x,0,z);g.rotation.y=angle;scene.add(g);for(let k=-1;k<=1;k++){mesh(box,'#f2eed5',g,k*.7,.75,0,.24,1.45,.16);mesh(new T.ConeGeometry(.17,.24,4),'#faf4de',g,k*.7,1.57,0).rotation.y=Math.PI/4;}for(let y of [.45,1.13])mesh(box,'#e9e4cb',g,0,y,.07,2,.11,.12);}
 for(let i=-7;i<=7;i++){if(Math.abs(i)>1)fence(i*2,-19.5,0);if(i<4)fence(-20,i*2,Math.PI/2);if(i<3)fence(20,i*2,Math.PI/2);}
 const hive=new T.Group();hive.position.set(-12,0,-6);scene.add(hive);const hivePos=new T.Vector3(-11,1.8,-3.7);
 for(let x of [-.8,.8])for(let z of [-.6,.6])mesh(box,'#88754c',hive,x,.5,z,.18,1,.18);mesh(box,'#b89453',hive,0,1,0,2.7,.22,2);
 for(let i=0;i<3;i++){mesh(box,i%2?'#edc668':'#f3d17b',hive,0,1.37+i*.55,0,2.05,.51,1.7);mesh(box,'#d7ae55',hive,0,1.28+i*.55,.87,.45,.12,.065);}
 const roof=mesh(new T.CylinderGeometry(1.8,1.8,.25,4),'#b49154',hive,0,3.08,0);roof.rotation.y=Math.PI/4;roof.scale.z=.83;const roofTop=mesh(new T.ConeGeometry(1.81,.85,4),'#cba960',hive,0,3.62,0);roofTop.rotation.y=Math.PI/4;roofTop.scale.z=.83;
 mesh(box,'#866f41',hive,0,1.3,.86,.82,.21,.035);mesh(box,'#ddbb71',hive,0,1.13,1.12,1.1,.08,.6);
 let homeGlow=mesh(new T.RingGeometry(1.5,1.6,64),new T.MeshBasicMaterial({color:'#fff2a0',transparent:true,opacity:.85,side:T.DoubleSide,depthWrite:false}),scene,-11,.16,-3.7);homeGlow.rotation.x=-Math.PI/2;
 // A readable physical sign by the hive.
 const signCanvas=document.createElement('canvas');signCanvas.width=256;signCanvas.height=96;const sc=signCanvas.getContext('2d');sc.fillStyle='#f4e6ba';sc.fillRect(0,0,256,96);sc.strokeStyle='#b89c62';sc.lineWidth=7;sc.strokeRect(5,5,246,86);sc.fillStyle='#6b7651';sc.textAlign='center';sc.font='bold 33px sans-serif';sc.fillText('HOME',128,62);const sign=mesh(new T.PlaneGeometry(1.6,.6),new T.MeshBasicMaterial({map:new T.CanvasTexture(signCanvas),side:T.DoubleSide}),scene,-9.5,1.1,-4.9);sign.rotation.y=.25;cylinder('#ac915b',scene,-9.5,.5,-4.9,.06,.08,1.15,6);
 const flowers=[];for(const patch of patches){for(let i=0;i<patch.count;i++){let a=i*2.399,rad=.8+Math.sqrt(i)*.9;let x=patch.x+Math.cos(a)*rad,z=patch.z+Math.sin(a)*rad*.78;flowers.push(flower(scene,patch.type,x,z,range(.85,1.35)));}}
 // Instanced meadow grasses and small wildflowers keep draw calls modest.
 const grassGeo=new T.ConeGeometry(.07,.42,3);const grassMat=mat('#7f9f5e');const grass=new T.InstancedMesh(grassGeo,grassMat,950);const dummy=new T.Object3D();let gi=0;while(gi<950){let x=range(-22,22),z=range(-22,22);if(x*x+z*z>500||(Math.hypot((x-10),(z-2)*1.5)<5)||Math.hypot(x+12,z+6)<2.8)continue;dummy.position.set(x,.22,z);dummy.rotation.set(range(-.18,.18),random()*6.28,range(-.2,.2));dummy.scale.setScalar(range(.5,1.8));dummy.updateMatrix();grass.setMatrixAt(gi++,dummy.matrix);}grass.receiveShadow=true;scene.add(grass);
 const specks=new T.InstancedMesh(new T.IcosahedronGeometry(.09,0),mat('#f3e7b9'),200);for(let i=0;i<200;i++){let a=random()*6.28,r=Math.sqrt(random())*22;dummy.position.set(Math.cos(a)*r,.18,Math.sin(a)*r);dummy.scale.setScalar(range(.5,1));dummy.rotation.set(0,0,0);dummy.updateMatrix();specks.setMatrixAt(i,dummy.matrix);}scene.add(specks);
 // Mushrooms, stones, a watering can and garden crates.
 for(let [x,z] of [[-15,7],[-16,8],[16,-3],[-11,15],[-10.5,15.4]]){cylinder('#f0ddbb',scene,x,.23,z,.08,.12,.45);let cap=mesh(new T.SphereGeometry(.33,9,5,0,Math.PI*2,0,Math.PI/2),'#d09272',scene,x,.43,z);}
 for(let i=0;i<17;i++){let a=random()*6.28,r=range(20,23);ellipsoid('#b6ba99',scene,Math.cos(a)*r,.15,Math.sin(a)*r,range(.3,.7),range(.25,.65),range(.3,.65));}
 const can=new T.Group();can.position.set(-15,.4,-4);can.rotation.y=-.4;scene.add(can);cylinder('#9fbbb2',can,0,.2,0,.38,.42,.65,12);mesh(new T.TorusGeometry(.35,.045,5,16),'#7c9e96',can,0,.67,0).rotation.y=Math.PI/2;branch(can,new T.Vector3(.2,.3,0),new T.Vector3(.87,.7,0),.09,'#9fbbb2');
 const bees=[];for(let i=0;i<4;i++){let b=makeBee(.32);scene.add(b);bees.push(b);}const player=makeBee(1.12);player.position.set(-4,1.8,5);scene.add(player);
 const wasps=[];for(let i=0;i<2;i++){let b=makeBee(.61,true);scene.add(b);wasps.push(b);}
 const butterflies=[];for(let i=0;i<7;i++){let g=new T.Group();const wings=[];for(let s of [-1,1]){let wing=ellipsoid(i%2?'#f3d982':'#f1b0ca',g,s*.17,0,0,.2,.03,.23);wings.push(wing);}scene.add(g);butterflies.push({g,wings,x:range(-15,15),z:range(-13,16),phase:random()*6.28});}
 const fireflyCount=70,firePos=new Float32Array(fireflyCount*3);for(let i=0;i<fireflyCount;i++){firePos[i*3]=range(-21,21);firePos[i*3+1]=range(.5,3.2);firePos[i*3+2]=range(-21,21);}let fireGeo=new T.BufferGeometry();fireGeo.setAttribute('position',new T.BufferAttribute(firePos,3));let fireMat=new T.PointsMaterial({color:'#f7ee99',size:.15,transparent:true,opacity:0,depthWrite:false});const fireflies=new T.Points(fireGeo,fireMat);scene.add(fireflies);
 const rainPos=new Float32Array(500*6);for(let i=0;i<500;i++){let x=range(-25,25),y=range(0,22),z=range(-25,25);rainPos.set([x,y,z,x-.1,y+.7,z],i*6);}const rainGeo=new T.BufferGeometry();rainGeo.setAttribute('position',new T.BufferAttribute(rainPos,3));const rain=new T.LineSegments(rainGeo,new T.LineBasicMaterial({color:'#d4e5e1',transparent:true,opacity:.55}));rain.visible=false;scene.add(rain);
 const target=mesh(new T.RingGeometry(.36,.44,32),new T.MeshBasicMaterial({color:'#fff4b7',side:T.DoubleSide,transparent:true,opacity:.95,depthWrite:false}),scene,0,.17,0);target.rotation.x=-Math.PI/2;target.visible=false;
 const pollen=[];for(let i=0;i<30;i++){let p=mesh(new T.IcosahedronGeometry(.055,0),new T.MeshBasicMaterial({color:'#ffe688'}),scene);p.visible=false;pollen.push(p);}
 const raceGroup=new T.Group();scene.add(raceGroup);raceGroup.visible=false;const ringPositions=[[-3,2,4],[3,2,-5],[11,2,-7],[15,2,5],[6,2,13],[-9,2,8]];const rings=ringPositions.map((p,i)=>{let r=mesh(new T.TorusGeometry(1.15,.09,8,40),new T.MeshStandardMaterial({color:'#eab946',emissive:'#a97112',emissiveIntensity:.5}),raceGroup,...p);r.rotation.y=.65;r.userData.index=i;return r;});
 for(const f of flowers){batchStatic(f.head);batchStatic(f.group,new Set([f.head]));}
 const dynamic=new Set([player,...bees,...wasps,...butterflies.map(b=>b.g),water,...ripples,homeGlow,target,...pollen,fireflies,rain,raceGroup,...flowers.map(f=>f.group),floor]);
 batchStatic(scene,dynamic);
 return {renderer,scene,camera,ambient,sun,ground,floor,flowers,patches,player,bees,wasps,butterflies,water,ripples,hive,hivePos,homeGlow,target,pollen,fireflies,rain,raceGroup,rings,mesh};
}
