import * as THREE from './vendor/three.module.js';

const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.9,...extra});
export function createScene(container,onInteract){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#8eaaa9');scene.fog=new THREE.FogExp2('#9badad',.013);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;container.appendChild(renderer.domElement);
 const camera=new THREE.PerspectiveCamera(40,1,.1,200);const target=new THREE.Vector3(0,1,0);
 scene.add(new THREE.HemisphereLight(0xdceced,0x465247,2.1));
 const sun=new THREE.DirectionalLight(0xffe1b1,3.1);sun.position.set(-14,28,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=35;sun.shadow.camera.bottom=-35;sun.shadow.normalBias=.035;scene.add(sun);
 const clickable=[];
 function box(w,h,d,color,x=0,y=0,z=0,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof color==='object'?color:mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function cylinder(rt,rb,h,color,x,y,z,parent=scene,n=8){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),typeof color==='object'?color:mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
 const ground=box(130,.3,130,0x7c8c7c,0,-.2,-10);box(9,.07,130,0x515957,2,0,-10);
 for(let z=-65;z<48;z+=6)box(.12,.015,2.8,0xc3c4ad,2,.05,z);
 for(let z=-60;z<48;z+=3){box(.14,.04,2.7,0xb2b6a5,-2.1,.08,z);box(.14,.04,2.7,0xb2b6a5,6.1,.08,z);}
 box(13,.08,13,0x989c8b,-2,.02,0);
 // Snowbanks and distant terrain, built as actual low-poly geometry.
 let seed=42;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<28;i++){const x=(random()-.5)*135,z=-25-random()*65,h=8+random()*23,r=9+random()*16;const mountain=new THREE.Mesh(new THREE.ConeGeometry(r,h,5),mat([0x879d99,0x768c89,0x9daaa2][i%3]));mountain.position.set(x,h/2-2,z);mountain.rotation.y=random()*3;scene.add(mountain);const peak=new THREE.Mesh(new THREE.ConeGeometry(r*.34,h*.35,5),mat(0xc6d1c7));peak.position.set(x,h*.825-2,z);peak.rotation.y=mountain.rotation.y;scene.add(peak);}
 function tree(x,z,s=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);cylinder(.12,.2,1.8,0x4c5144,0,.9,0,g);for(let j=0;j<3;j++)cylinder(0,1.1-j*.18,2.3-j*.25,j%2?0x425f55:0x506d60,0,1.7+j*.75,0,g,6);scene.add(g);}
 for(let i=0;i<140;i++){const x=(random()-.5)*95,z=-45+random()*85;if(Math.abs(x-2)<10||Math.hypot(x+5,z)<13)continue;tree(x,z,.6+random()*1.4);}
 for(let i=0;i<35;i++){const x=(random()-.5)*70,z=(random()-.5)*70;if(Math.abs(x-2)<7)continue;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.3+random()*.6,0),mat(0xb5bcb0));rock.position.set(x,.2,z);rock.scale.y=.5;scene.add(rock);}
 // Checkpoint building, windows, roof, door and inspection counter.
 const booth=new THREE.Group();booth.position.set(-4.5,0,1);scene.add(booth);
 box(4,2.8,4,0xa0a48f,0,1.5,0,booth);box(4.3,.25,4.4,0x4b6056,0,3,0,booth);box(4.5,.13,4.6,0xb3b5a4,0,3.16,0,booth);
 const glass=mat(0x416162,{metalness:.3,roughness:.25});box(2.5,1.15,.035,glass,.4,1.9,2.03,booth);box(.035,1.15,2.3,glass,2.03,1.9,0,booth);
 for(const x of [-.9,.4,1.7])box(.08,1.25,.08,0x444e43,x,1.9,2.08,booth);box(2.8,.09,.13,0x465249,.4,1.88,2.1,booth);
 box(.06,1.3,.08,0x465249,2.09,1.9,0,booth);box(1,.05,2.5,0x887855,2.42,1.2,0,booth);box(.8,2,.06,0x637363,-1.2,1.1,2.04,booth);cylinder(.06,.06,.07,0xd9c393,-.95,1.1,2.1,booth).rotation.x=Math.PI/2;
 // Corrugated roof and a small chimney.
 for(let x=-2.1;x<=2.1;x+=.25)box(.05,.055,4.35,0x6a7b6b,x,3.23,0,booth);
 box(.4,1,.4,0x5b6256,-1,3.7,-1,booth);
 function textSign(text,w,h,color,bg,x,y,z,parent=scene){const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,1024,256);ctx.fillStyle=color;ctx.font='bold 104px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,135);const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return box(w,h,.07,new THREE.MeshStandardMaterial({map:tx}),x,y,z,parent);}
 textSign('NORTHGATE · 07',3.9,.55,'#e4e6cf','#34483e',0,2.98,2.25,booth);
 const paper=box(.65,.025,.45,0xe5dbc0,-1.9,1.25,1);paper.userData.kind='docs';clickable.push(paper);
 // Border wall, chain fence posts and concrete barricades.
 for(const x of [-19,-15,-11,11,15,19]){box(3.7,1.5,.7,0x8b9485,x,.75,-5);for(let k=0;k<4;k++)box(.06,.8,.08,0x556457,x-1.4+k*.9,1.9,-5);}
 for(let x=-22;x<=22;x+=2){if(x>-3&&x<7)continue;cylinder(.045,.045,3,0x566359,x,1.5,-5);}
 const fenceMat=new THREE.LineBasicMaterial({color:0x697a6c,transparent:true,opacity:.6});
 for(const range of [[-24,-3],[7,25]]){const verts=[];for(let x=range[0];x<range[1];x+=.6){verts.push(x,.8,-5,x+1,3,-5,x,3,-5,x+1,.8,-5);}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));scene.add(new THREE.LineSegments(geo,fenceMat));}
 for(const x of [-3.5,7.4]){box(1.1,.75,2,0x9e9e88,x,.38,4);for(let k=0;k<5;k++){const stripe=box(.16,.77,.035,k%2?0xd5b56b:0x39433b,x-.44+k*.22,.39,5.02);stripe.rotation.z=-.18;}}
 // Raised watchtower.
 const tower=new THREE.Group();tower.position.set(-12,0,-12);scene.add(tower);for(const x of [-1,1])for(const z of [-1,1])box(.15,6,.15,0x536256,x,3,z,tower);box(2.8,.22,2.8,0x576b5d,0,5,0,tower);box(2.4,1.8,2.4,0x8e9d87,0,6,0,tower);box(1.7,.8,.05,glass,0,6.1,1.22,tower);box(2.8,.16,2.8,0x3e594e,0,7,0,tower);for(let y=.5;y<5;y+=.45)box(1.3,.08,.12,0x5b6e61,0,y,1.2,tower);
 // Border gate and striped arm.
 box(.5,1.6,.5,0x637369,-2.4,.8,-3);const arm=new THREE.Group();arm.position.set(-2.4,1.7,-3);scene.add(arm);box(8.7,.17,.18,0xe2d7b8,4.2,0,0,arm);for(let i=0;i<9;i++)box(.45,.19,.2,0xaf5945,.4+i*.9,0,0,arm);
 const gateLamp=new THREE.Mesh(new THREE.SphereGeometry(.13,12,8),mat(0xf48756,{emissive:0xd14417,emissiveIntensity:1}));gateLamp.position.set(-2.4,1.72,-2.65);scene.add(gateLamp);
 for(const x of [-3,7]){cylinder(.07,.1,6,0x4d6156,x,3,-6);box(2,.12,.15,0x4d6156,x-.8,6,-6);const lamp=box(.7,.15,.4,0xffe5ad,x-1.5,5.9,-6);lamp.material.emissive=new THREE.Color(0xffdda0);lamp.material.emissiveIntensity=.7;}
 textSign('BORDER CONTROL',8.8,.8,'#e2e3cd','#405749',2,5.2,-6);
 // Flag, crates, oil drums and inspection zone.
 cylinder(.045,.045,6,0x586a61,-8,3,3);const flag=new THREE.Mesh(new THREE.PlaneGeometry(1.7,.95,8,3),new THREE.MeshStandardMaterial({color:0xcc8c50,side:THREE.DoubleSide}));flag.position.set(-7.2,5.4,3);scene.add(flag);
 const cargoGroup=new THREE.Group();cargoGroup.position.set(7.9,0,1.5);scene.add(cargoGroup);
 const crates=[];for(let i=0;i<3;i++){const g=new THREE.Group();g.position.set((i%2)*1.2,i===2?1:0,i===2?0:.5);const b=box(1,1,.95,0x947954,0,.5,0,g);b.userData.kind='cargo';clickable.push(b);for(const z of [-.48,.48]){box(1.04,.1,.06,0x635944,0,.2,z,g);box(1.04,.1,.06,0x635944,0,.8,z,g);}cargoGroup.add(g);crates.push(b);}
 cylinder(.4,.4,1,0x4a6860,-7,.5,3.7);cylinder(.4,.4,1,0x6a7055,-7,.5,4.7);
 // Old utility truck with cabin, cargo bed, rubber tires and illuminated lamps.
 const truck=new THREE.Group();scene.add(truck);const carPaint=mat(0x637863);box(2.1,.5,4.6,carPaint,0,1.05,0,truck);box(2.05,1.45,1.7,carPaint,0,1.7,-1,truck);box(1.82,.7,.035,glass,0,1.9,-1.87,truck);box(2.2,.12,1.85,carPaint,0,2.46,-1,truck);box(1.9,.4,.8,carPaint,0,1.3,-2,truck);box(2.15,.18,.16,0x333e3a,0,.85,-2.39,truck);box(1.2,.36,.03,0x303a36,0,1.27,-2.43,truck);
 for(const x of [-.8,.8])box(.36,.25,.04,0xf8ddb0,x,1.38,-2.44,truck);
 for(const x of [-1.03,1.03]){box(.04,.68,1.1,glass,x,1.95,-1,truck);box(.08,.9,2.45,carPaint,x,1.43,1.03,truck);for(const z of [-1.45,1.55]){const wheel=cylinder(.49,.49,.28,0x242d2b,x,.57,z,truck,16);wheel.rotation.z=Math.PI/2;const hub=cylinder(.23,.23,.3,0x778077,x,.57,z,truck,12);hub.rotation.z=Math.PI/2;}}
 box(2,.85,.12,carPaint,0,1.4,2.23,truck);box(1.9,.12,2.8,0x686454,0,1.23,.87,truck);
 for(let i=0;i<4;i++)box(.8,.6,.8,0x9d8862,(i%2-.5)*.9,1.6,.4+Math.floor(i/2)*1.0,truck);
 const plate=textSign('AL · 2047',.95,.22,'#d4d9c2','#35403a',0,.9,-2.49,truck);
 function person(p){const g=new THREE.Group();const coat=mat(p.coat),skin=mat(p.skin),dark=mat(0x2d3c35);box(.52,.7,.32,coat,0,1.05,0,g);for(const x of [-.15,.15]){box(.18,.57,.22,dark,x,.38,0,g);box(.2,.14,.35,0x27312b,x,.1,-.06,g);box(.16,.62,.2,coat,x*2.25,1.02,0,g);}const head=box(.37,.4,.34,skin,0,1.58,0,g);box(.4,.16,.37,p.hair,0,1.81,.03,g);box(.38,.3,.08,p.hair,0,1.68,.17,g);box(.06,.08,.06,p.skin,0,1.55,-.19,g);for(const x of [-.09,.09])box(.04,.03,.02,0x293730,x,1.63,-.176,g);box(.22,.12,.37,0x7e8071,0,1.34,-.02,g);return g;}
 let traveler=person({coat:0x726958,skin:0xcfa681,hair:0x433b2c});traveler.position.set(-.2,0,1.8);traveler.rotation.y=.5;scene.add(traveler);
 const guard=person({coat:0x455d4b,skin:0xc8a582,hair:0x304737});guard.position.set(-4.5,0,3.4);guard.rotation.y=-.9;scene.add(guard);
 const snowGeo=new THREE.BufferGeometry();const snowPos=new Float32Array(450*3);for(let i=0;i<450;i++){snowPos[i*3]=(random()-.5)*50;snowPos[i*3+1]=random()*20;snowPos[i*3+2]=(random()-.5)*50;}snowGeo.setAttribute('position',new THREE.BufferAttribute(snowPos,3));const snow=new THREE.Points(snowGeo,new THREE.PointsMaterial({color:0xf1f2e9,size:.065,transparent:true,opacity:.65}));snow.visible=false;scene.add(snow);
 const scanner=box(3,.025,3,mat(0x6fdcc0,{transparent:true,opacity:.18,emissive:0x68dbc3,emissiveIntensity:1}),8.4,.2,2);scanner.visible=false;
 let view='overview',yaw=.75,pitch=.56,distance=29,desiredTarget=new THREE.Vector3(0,1,0),desiredDistance=29,desiredYaw=.75,desiredPitch=.56,lastTime=0,leaving=null,arrival=0,scanUntil=0,day=1;
 const presets={overview:{target:[0,1,0],distance:29,yaw:.75,pitch:.56},docs:{target:[-1.6,1.1,1.5],distance:14,yaw:.52,pitch:.4},cargo:{target:[6.4,1,2],distance:14,yaw:1.0,pitch:.65}};
 function setView(name){view=name;const p=presets[name]||presets.overview;desiredTarget.set(...p.target);desiredDistance=p.distance;desiredYaw=p.yaw;desiredPitch=p.pitch;}
 function setTraveler(p){if(traveler){scene.remove(traveler);traveler.traverse(o=>{o.geometry?.dispose();});}traveler=person(p);traveler.position.set(-.2,0,1.8);traveler.rotation.y=.65;traveler.traverse(o=>{if(o.isMesh)o.userData.kind='talk';});scene.add(traveler);carPaint.color.setHex(p.vehicle);truck.position.set(2,0,9);arrival=1;leaving=null;arm.rotation.z=0;gateLamp.material.color.set(0xf48756);}
 function leave(action){leaving={action,start:performance.now(),startZ:truck.position.z};gateLamp.material.color.set(action==='approve'?0x80d4a7:0xed6e52);}
 function scan(ms=2000){scanUntil=performance.now()+ms;scanner.visible=true;setView('cargo');}
 function setDay(n){day=n;snow.visible=n>=3;sun.intensity=n===4?1.8:n===5?3.7:3.1;scene.background.set(n===4?'#7b9698':'#9eafaa');scene.fog.color.copy(scene.background);}
 const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();let drag=null;
 renderer.domElement.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,moved:false};renderer.domElement.setPointerCapture(e.pointerId);});
 renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)>5)drag.moved=true;desiredYaw-=dx*.006;desiredPitch=Math.max(.22,Math.min(1.1,desiredPitch+dy*.004));drag.x=e.clientX;drag.y=e.clientY;});
 renderer.domElement.addEventListener('pointerup',e=>{if(drag&&!drag.moved){const r=renderer.domElement.getBoundingClientRect();mouse.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects([...clickable,traveler],true);if(hits[0])onInteract(hits[0].object.userData.kind);}drag=null;});
 renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();desiredDistance=Math.max(10,Math.min(43,desiredDistance+e.deltaY*.016));},{passive:false});
 function resize(){const r=container.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(container);resize();
 function frame(time){requestAnimationFrame(frame);const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;distance+=(desiredDistance-distance)*.045;yaw+=(desiredYaw-yaw)*.045;pitch+=(desiredPitch-pitch)*.045;target.lerp(desiredTarget,.05);camera.position.set(target.x+Math.sin(yaw)*Math.cos(pitch)*distance,target.y+Math.sin(pitch)*distance,target.z+Math.cos(yaw)*Math.cos(pitch)*distance);camera.lookAt(target);
 if(arrival>0){truck.position.z+=(3.5-truck.position.z)*.025;if(Math.abs(truck.position.z-3.5)<.04)arrival=0;}
 if(leaving){const t=(time-leaving.start)/1000;if(leaving.action==='approve'){arm.rotation.z=Math.min(Math.PI*.46,t*1.5);truck.position.z=leaving.startZ-Math.max(0,t-.45)*5;traveler.visible=t<.4;}else if(leaving.action==='deny'){truck.position.z=leaving.startZ+t*3.5;traveler.visible=t<.5;}else{traveler.position.x-=dt*1.2;traveler.rotation.y=-Math.PI/2;}}
 const positions=flag.geometry.attributes.position;for(let i=0;i<positions.count;i++)positions.setZ(i,Math.sin(time*.002+positions.getX(i)*4)*.08*(positions.getX(i)+.85));positions.needsUpdate=true;
 if(snow.visible){for(let i=0;i<450;i++){snowPos[i*3]+=.12*dt;snowPos[i*3+1]-=(.7+(i%5)*.2)*dt;if(snowPos[i*3+1]<0)snowPos[i*3+1]=20;}snowGeo.attributes.position.needsUpdate=true;}
 if(scanUntil>time){scanner.position.y=.2+((time%2000)/2000)*2.6;crates.forEach(c=>{c.material.emissive.setHex(0x245e50);});}else if(scanner.visible){scanner.visible=false;crates.forEach(c=>c.material.emissive.setHex(0));}
 renderer.render(scene,camera);}
 requestAnimationFrame(frame);
 function portrait(p){const r=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});r.setSize(150,180);r.setPixelRatio(1);r.setClearColor(0xb3b8a4);const s=new THREE.Scene();s.add(new THREE.HemisphereLight(0xffffff,0x718073,2.7));const light=new THREE.DirectionalLight(0xffecd1,2);light.position.set(-2,4,4);s.add(light);const model=person(p);model.rotation.y=Math.PI+.14;s.add(model);const c=new THREE.PerspectiveCamera(27,150/180,.1,20);c.position.set(0,1.6,2.4);c.lookAt(0,1.44,0);r.render(s,c);const url=r.domElement.toDataURL();r.dispose();r.forceContextLoss();s.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});return url;}
 return {setView,setTraveler,leave,scan,setDay,portrait};
}
