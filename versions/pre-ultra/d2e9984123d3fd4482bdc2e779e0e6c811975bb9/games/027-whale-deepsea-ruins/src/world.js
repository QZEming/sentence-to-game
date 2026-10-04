import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
export const V = THREE.Vector3;
let seed=817; const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
const mat=(color,extras={})=>new THREE.MeshStandardMaterial({color,roughness:.88,...extras});
const stone=mat('#274c50'), darkStone=mat('#18383e'), trim=mat('#42686a'), sand=mat('#143c45'), glow=mat('#85ebd2',{emissive:'#46d4b4',emissiveIntensity:2}), gold=mat('#ffe7aa',{emissive:'#ffbf57',emissiveIntensity:2});
function mesh(g,m,parent,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;}
function orb(parent,m,x,y,z,sx,sy=sx,sz=sx){let o=mesh(new THREE.SphereGeometry(1,18,12),m,parent,x,y,z);o.scale.set(sx,sy,sz);return o;}
function line(points,color,parent){const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new V(...p))),new THREE.LineBasicMaterial({color,transparent:true,opacity:.4}));parent.add(l);return l;}
export function createWorld(container){
 const scene=new THREE.Scene(); scene.background=new THREE.Color('#06232e');scene.fog=new THREE.FogExp2('#062b35',.009);
 const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.2,620);
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;container.appendChild(renderer.domElement);
 const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.52,.6,.85);composer.addPass(bloom);
 scene.add(new THREE.HemisphereLight('#a2e0df','#112e42',2.1));const sun=new THREE.DirectionalLight('#b3f4e1',3.3);sun.position.set(-40,90,-30);scene.add(sun);const rim=new THREE.DirectionalLight('#388dc4',2.5);rim.position.set(50,10,50);scene.add(rim);
 const terrain=new THREE.PlaneGeometry(520,520,75,75);terrain.rotateX(-Math.PI/2);let pa=terrain.attributes.position;for(let i=0;i<pa.count;i++){const x=pa.getX(i),z=pa.getZ(i);pa.setY(i,-12+Math.sin(x*.04)*Math.cos(z*.038)*3+Math.sin(z*.12+x*.07)*.7);}terrain.computeVertexNormals();mesh(terrain,sand,scene);
 // Ruin: a sunken ceremonial courtyard, stairs, and monumental gateway.
 const ruins=new THREE.Group();scene.add(ruins);
 mesh(new THREE.CylinderGeometry(32,35,1.2,64),stone,ruins,0,-10.7,-27);
 for(let i=0;i<4;i++){mesh(new THREE.CylinderGeometry(12+i*3,13+i*3,.7,64),i%2?trim:stone,ruins,0,-8.8-i*.65,-28);}
 function column(x,z,h=22,tilt=0){const g=new THREE.Group();g.position.set(x,-10,z);g.rotation.z=tilt;ruins.add(g);mesh(new THREE.BoxGeometry(4.4,1,4.4),darkStone,g,0,.5);mesh(new THREE.BoxGeometry(3.6,.7,3.6),trim,g,0,1.3);mesh(new THREE.CylinderGeometry(1.25,1.55,h,12),stone,g,0,h/2+1.5);for(let j=0;j<8;j++){const a=j/8*Math.PI*2;mesh(new THREE.CylinderGeometry(.12,.12,h,5),trim,g,Math.sin(a)*1.26,h/2+1.5,Math.cos(a)*1.26);}mesh(new THREE.CylinderGeometry(1.8,1.6,.7,12),trim,g,0,h+1.5);mesh(new THREE.BoxGeometry(4,1,4),stone,g,0,h+2.3);for(let k=0;k<3;k++){mesh(new THREE.TorusGeometry(1.52,.08,4,16),darkStone,g,0,2.4+k*(h/3)).rotation.x=Math.PI/2;}return g;}
 [-25,-16,16,25].forEach((x,i)=>{column(x,-38,24-(i%2)*3);column(x,-14,15+(i%2)*7,i===0?.08:0);});
 for(let i=0;i<8;i++){let a=i/8*Math.PI*2;column(Math.cos(a)*40,Math.sin(a)*40-25,7+rand()*14,(rand()-.5)*.25);}
 mesh(new THREE.BoxGeometry(58,3.2,5.3),stone,ruins,0,17,-38);mesh(new THREE.BoxGeometry(60,1,5.8),trim,ruins,0,19,-38);
 for(let i=-4;i<=4;i++){mesh(new THREE.BoxGeometry(1.7,.17,.18),glow,ruins,i*5,17.2,-35.3);}
 const portal=new THREE.Group();portal.position.set(0,3,-29);ruins.add(portal);
 const arc=mesh(new THREE.TorusGeometry(10.8,1.3,8,64),stone,portal);const rimRing=mesh(new THREE.TorusGeometry(9.6,.12,8,80),glow,portal);rimRing.material=glow.clone();rimRing.material.emissiveIntensity=.7;
 for(let i=0;i<16;i++){let a=i/16*Math.PI*2;const b=mesh(new THREE.BoxGeometry(.6,1.3,.18),i%3===0?glow:trim,portal,Math.sin(a)*10.8,Math.cos(a)*10.8,1.22);b.rotation.z=-a;}
 const gateMat=new THREE.MeshBasicMaterial({color:'#75ffe0',transparent:true,opacity:.05,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});let gate=mesh(new THREE.CircleGeometry(9.4,64),gateMat,portal,0,0,-.1);
 const gateLight=new THREE.PointLight('#60ffcf',28,60);gateLight.position.set(0,4,-23);scene.add(gateLight);
 // Scattered masonry, rocks and coral fields.
 for(let i=0;i<105;i++){let x=(rand()-.5)*280,z=(rand()-.5)*270;if(Math.abs(x)<31&&z>-55&&z<4)continue;let o=mesh(new THREE.DodecahedronGeometry(1,0),i%3?darkStone:stone,scene,x,-11,z);o.scale.set(2+rand()*6,1+rand()*5,2+rand()*5);o.rotation.set(rand(),rand()*6,rand());}
 for(let i=0;i<30;i++){let o=mesh(new THREE.BoxGeometry(2+rand()*3,1+rand()*2,2+rand()*3),stone,scene,(rand()-.5)*85,-10,-30+(rand()-.5)*90);o.rotation.set(rand()*.4,rand()*6,rand()*.3);}
 const corals=[];const coralMats=[mat('#358b85',{emissive:'#167569',emissiveIntensity:.25}),mat('#386d9d',{emissive:'#16447e',emissiveIntensity:.35}),mat('#68799a'),mat('#876d91'),glow];
 function branch(parent,x,y,z,h,r,material,ang){let b=mesh(new THREE.CylinderGeometry(r*.45,r,h,5),material,parent,x,y+h/2,z);b.rotation.z=ang;return b;}
 for(let i=0;i<100;i++){const g=new THREE.Group();g.position.set((rand()-.5)*220,-11,(rand()-.5)*220);if(Math.abs(g.position.x)<20&&g.position.z<-12&&g.position.z>-48)continue;scene.add(g);let m=coralMats[i%5],h=1.3+rand()*4;branch(g,0,0,0,h,.15,m,0);for(let j=0;j<5;j++){let y=h*(.15+j*.13),a=(j%2?1:-1)*(.6+rand()*.5);let b=branch(g,Math.sin(a)*.6,y,rand()*.8,h*.5,.1,m,a);orb(g,m,b.position.x-Math.sin(a)*h*.23,y+h*.7,b.position.z,.18);}g.scale.setScalar(.6+rand());corals.push(g);}
 const grassMaterial=mat('#235b59',{side:THREE.DoubleSide});for(let i=0;i<150;i++){const g=new THREE.Group();g.position.set((rand()-.5)*190,-11,(rand()-.5)*180);scene.add(g);for(let j=0;j<3;j++){const h=1+rand()*3;let leaf=mesh(new THREE.PlaneGeometry(.3,h,1,3),grassMaterial,g,(rand()-.5),h/2,rand()-.5);leaf.rotation.y=rand()*Math.PI;}corals.push(g);}
 // Suspended marine snow.
 const pts=new Float32Array(1800*3);for(let i=0;i<1800;i++){pts[i*3]=(rand()-.5)*300;pts[i*3+1]=rand()*85-10;pts[i*3+2]=(rand()-.5)*300;}const particleGeo=new THREE.BufferGeometry();particleGeo.setAttribute('position',new THREE.BufferAttribute(pts,3));const particles=new THREE.Points(particleGeo,new THREE.PointsMaterial({color:'#abeddb',size:.13,transparent:true,opacity:.55,depthWrite:false}));scene.add(particles);
 // Volumetric light shafts, transparent and softly colored.
 const rayMat=new THREE.MeshBasicMaterial({color:'#7bd6c7',transparent:true,opacity:.027,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});for(let i=0;i<9;i++){let ray=mesh(new THREE.CylinderGeometry(1.2,7+rand()*6,140,16,1,true),rayMat,scene,-75+i*20,45,-50+rand()*70);ray.rotation.z=-.21;}
 const whale=createWhale();scene.add(whale);whale.position.set(0,3,36);
 const shards=[];const shardCoords=[[-17,0,28],[19,2,10],[-33,1,-7],[30,6,-31],[-18,10,-56],[20,1,-64]];
 shardCoords.forEach((p,i)=>{const g=new THREE.Group();g.position.set(...p);scene.add(g);const core=mesh(new THREE.OctahedronGeometry(.9),gold,g);core.scale.y=1.5;const ring=mesh(new THREE.TorusGeometry(1.8,.035,5,40),gold,g);ring.rotation.x=Math.PI/2;const l=new THREE.PointLight('#ffd987',4,15);g.add(l);shards.push({group:g,baseY:p[1],core,ring,id:i,collected:false});});
 const altars=[];[[-46,-4,-31],[42,-4,-56],[0,-4,-91]].forEach((p,i)=>{const g=new THREE.Group();g.position.set(...p);scene.add(g);mesh(new THREE.CylinderGeometry(5,6,.8,6),stone,g,0,-3);mesh(new THREE.CylinderGeometry(3,4,.7,6),trim,g,0,-2.4);const crystal=mesh(new THREE.OctahedronGeometry(1.7),mat('#5d9ca3',{emissive:'#227477',emissiveIntensity:.6}),g,0,1.4);crystal.scale.y=1.7;const ring=mesh(new THREE.TorusGeometry(3.5,.12,6,48),trim,g,0,.6);ring.rotation.x=Math.PI/2;const light=new THREE.PointLight('#6cffe1',0,35);g.add(light);altars.push({group:g,crystal,ring,light,active:false,id:i});});
 const foods=[];for(let i=0;i<15;i++){const g=new THREE.Group();g.position.set((rand()-.5)*160,rand()*16-5,(rand()-.5)*160);scene.add(g);for(let j=0;j<6;j++){orb(g,glow,(rand()-.5)*3,(rand()-.5)*2,(rand()-.5)*3,.15);}foods.push({group:g,available:true,timer:0});}
 const jellies=[];const jellyMat=mat('#b475bc',{emissive:'#863cba',emissiveIntensity:.7,transparent:true,opacity:.7,side:THREE.DoubleSide});for(let i=0;i<10;i++){const g=new THREE.Group();const a=i/10*Math.PI*2;g.position.set(Math.sin(a)*65,rand()*16-3,Math.cos(a)*65-23);scene.add(g);mesh(new THREE.SphereGeometry(1.7,16,12,0,Math.PI*2,0,Math.PI*.6),jellyMat,g);for(let j=0;j<7;j++){const a=j/7*Math.PI*2;let points=[];for(let k=0;k<12;k++)points.push([Math.sin(a)*(1-k*.04)+Math.sin(k*.7)*.18,-k*.3,Math.cos(a)*(1-k*.04)]);line(points,'#c798ed',g);}jellies.push({group:g,origin:g.position.clone(),phase:rand()*6,stun:0});}
 const fish=[];const fishMat=mat('#86bdc7',{metalness:.3,roughness:.4});for(let s=0;s<5;s++){const g=new THREE.Group();g.position.set((rand()-.5)*160,6+rand()*25,-40+(rand()-.5)*150);scene.add(g);for(let i=0;i<24;i++){const f=orb(g,fishMat,(rand()-.5)*20,(rand()-.5)*5,(rand()-.5)*10,.32,.16,.8);fish.push({mesh:f,school:g,phase:rand()*6});}}
 const sonar=mesh(new THREE.SphereGeometry(1,40,24),new THREE.MeshBasicMaterial({color:'#7af9db',wireframe:true,transparent:true,opacity:0,depthWrite:false}),scene);sonar.visible=false;
 let time=0;
 function animate(dt,playerActive){time+=dt;particles.rotation.y=time*.003;whale.userData.tail.rotation.x=Math.sin(time*2.2)*.18;whale.userData.fins.forEach((f,i)=>{f.rotation.z=(i?1:-1)*(.2+Math.sin(time*1.5)*.08);});corals.forEach((g,i)=>{g.rotation.z=Math.sin(time*.7+i)*.025;});shards.forEach(s=>{s.group.position.y=s.baseY+Math.sin(time*1.2+s.id)*.4;s.core.rotation.y=time*.7;s.ring.rotation.z=time*.3;});altars.forEach(a=>{a.crystal.rotation.y=time*.45;a.crystal.position.y=1.4+Math.sin(time+a.id)*.3;a.ring.rotation.z=time*.1;});jellies.forEach(j=>{j.stun=Math.max(0,j.stun-dt);j.group.position.y=j.origin.y+Math.sin(time*.6+j.phase)*2;j.group.position.x=j.origin.x+Math.sin(time*.2+j.phase)*8;j.group.scale.setScalar(1+Math.sin(time*2+j.phase)*.08);});fish.forEach(f=>{f.mesh.position.x+=Math.sin(time*.8+f.phase)*dt*.25;f.mesh.rotation.y=Math.sin(time*.6+f.phase)*.2;});gate.rotation.z=time*.1;gateMat.opacity=altars.every(a=>a.active)?.27+Math.sin(time*2)*.08:.045;rimRing.material.emissiveIntensity=altars.every(a=>a.active)?3:.7;gateLight.intensity=altars.every(a=>a.active)?70:28;if(!playerActive){whale.position.y=5+Math.sin(time*.65)*.6;whale.userData.tail.rotation.x=Math.sin(time*1.8)*.18;}}
 function render(){composer.render();}
 function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);}
 addEventListener('resize',resize);
 return {scene,camera,renderer,composer,whale,shards,altars,foods,jellies,sonar,portal,animate,render,THREE};
}
function createWhale(){
 const whale=new THREE.Group();const skin=mat('#416e83',{roughness:.47,metalness:.13}),belly=mat('#9cb6b8',{roughness:.65}),finMat=mat('#305c76',{roughness:.5});
 // Continuous lathed body, nose towards negative Z.
 const profile=[[-7,.15],[-6.6,1.0],[-5.7,1.85],[-4,2.2],[-1.5,2.4],[1,2.1],[3.2,1.4],[5.1,.72],[6.5,.34],[7,.25]];
 const bodyGeo=new THREE.LatheGeometry(profile.map(([z,r])=>new THREE.Vector2(r,z)),48);bodyGeo.rotateX(Math.PI/2);const body=mesh(bodyGeo,skin,whale);body.scale.y=.78;
 orb(whale,belly,0,-.76,-2.6,1.83,.78,3.95);
 // Brow and broad rounded rostrum.
 orb(whale,skin,0,.05,-5.1,1.85,1.28,1.95);
 const flipperShape=new THREE.Shape();flipperShape.moveTo(0,0);flipperShape.bezierCurveTo(1.6,-.15,4.8,1.5,5.7,3.5);flipperShape.bezierCurveTo(4,3.7,1.4,2,0,1);flipperShape.closePath();
 const finGeo=new THREE.ExtrudeGeometry(flipperShape,{depth:.16,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.15,bevelThickness:.12});finGeo.rotateX(Math.PI/2);
 const fins=[];for(let side of [-1,1]){const fg=new THREE.Group();fg.position.set(side*1.45,-.6,-2);whale.add(fg);let f=mesh(finGeo,finMat,fg);f.scale.x=side;fins.push(fg);}
 const tail=new THREE.Group();tail.position.z=6.6;whale.add(tail);
 const shape=new THREE.Shape();shape.moveTo(0,0);shape.bezierCurveTo(1,-.5,2.3,-.8,4.6,-.4);shape.bezierCurveTo(4,1,2.5,2.4,.5,1.7);shape.lineTo(0,1.2);shape.lineTo(-.5,1.7);shape.bezierCurveTo(-2.5,2.4,-4,1,-4.6,-.4);shape.bezierCurveTo(-2.3,-.8,-1,-.5,0,0);
 const tg=new THREE.ExtrudeGeometry(shape,{depth:.15,bevelEnabled:true,bevelSegments:2,bevelSize:.18,bevelThickness:.13});tg.rotateX(Math.PI/2);mesh(tg,skin,tail);
 const dorsal=mesh(new THREE.ConeGeometry(.65,1.6,3),finMat,whale,0,1.35,1.8);dorsal.rotation.x=-.4;
 for(let side of [-1,1]){orb(whale,mat('#071d24'),side*1.72,.02,-5.1,.21,.19,.21);orb(whale,mat('#dafbf2',{emissive:'#8debc8',emissiveIntensity:.8}),side*1.88,.06,-5.18,.065);const mouth=[];for(let i=0;i<15;i++){const t=i/14;mouth.push([side*(.35+Math.sin(t*Math.PI*.72)*1.45),-.53+t*.04,-6.85+t*4.7]);}line(mouth,'#1c4353',whale);}
 for(let i=-5;i<=5;i++){const points=[];for(let j=0;j<18;j++){let t=j/17;points.push([i*.23*(.5+Math.sin(t*Math.PI)*.5),-1.5-Math.sin(t*Math.PI)*.1,-6+t*6.8]);}line(points,'#638a98',whale);}
 for(let i=0;i<36;i++){let a=rand()*Math.PI*2,z=-4+rand()*7;let r=z>1?1.8:2.18;orb(whale,mat('#7196a4'),Math.sin(a)*r,Math.cos(a)*r*.76,z,.045+rand()*.06,.035,.12);}
 whale.userData={tail,fins};return whale;
}
