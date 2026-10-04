import * as T from './lib/three.module.js';
export {T};
const rng=(()=>{let s=6247;return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}})();
const rand=(a,b)=>a+rng()*(b-a);
const up=new T.Vector3(0,1,0);
export function createWorld(canvas){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.24;
 const scene=new T.Scene();scene.background=new T.Color('#0b3547');scene.fog=new T.FogExp2('#0a3849',.012);
 const camera=new T.PerspectiveCamera(42,innerWidth/innerHeight,.1,160);
 const mats={wood:new T.MeshStandardMaterial({color:'#67543d',roughness:.93}),lightWood:new T.MeshStandardMaterial({color:'#8a704a',roughness:.88}),darkWood:new T.MeshStandardMaterial({color:'#423d31',roughness:1}),edge:new T.MeshStandardMaterial({color:'#273d3e',metalness:.3,roughness:.65}),gold:new T.MeshStandardMaterial({color:'#c6a766',metalness:.6,roughness:.34}),sand:new T.MeshStandardMaterial({color:'#31606a',roughness:1}),rock:new T.MeshStandardMaterial({color:'#244b56',roughness:.95,flatShading:true}),coral:new T.MeshStandardMaterial({color:'#bb7777',roughness:.8}),seaweed:new T.MeshStandardMaterial({color:'#357b78',roughness:.8,side:T.DoubleSide}),mint:new T.MeshStandardMaterial({color:'#8fd1b6',emissive:'#368267',emissiveIntensity:.8}),glow:new T.MeshStandardMaterial({color:'#dbecc7',emissive:'#e6ca88',emissiveIntensity:1.5}),skin:new T.MeshStandardMaterial({color:'#fa754a',roughness:.48}),skinLight:new T.MeshStandardMaterial({color:'#ffbb8a',roughness:.5})};
 function mesh(geo,mat,x=0,y=0,z=0,parent=scene){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 function box(w,h,d,mat,x=0,y=0,z=0,parent=scene){return mesh(new T.BoxGeometry(w,h,d),mat,x,y,z,parent)}
 function sphere(r,mat,x=0,y=0,z=0,parent=scene,detail=14){return mesh(new T.SphereGeometry(r,detail,10),mat,x,y,z,parent)}
 function bar(a,b,r,mat,parent=scene,r2=r){const diff=new T.Vector3().subVectors(b,a);const m=mesh(new T.CylinderGeometry(r2,r,diff.length(),8),mat,0,0,0,parent);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(up,diff.normalize());return m}
 function torus(r,t,mat,x,y,z,parent=scene){return mesh(new T.TorusGeometry(r,t,8,40),mat,x,y,z,parent)}
 scene.add(new T.HemisphereLight('#9edde5','#10242e',2.15));
 const sun=new T.DirectionalLight('#ffe0ae',3.1);sun.position.set(-12,28,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-30,right:30,top:25,bottom:-25,near:1,far:70});sun.shadow.bias=-.0007;sun.shadow.normalBias=.04;scene.add(sun);
 const fill=new T.DirectionalLight('#5cccec',2.3);fill.position.set(14,12,-20);scene.add(fill);
 mesh(new T.PlaneGeometry(180,180),mats.sand,0,-.8,0).rotation.x=-Math.PI/2;
 // Broken ship, its ribs and uneven floorboards.
 const ship=new T.Group();scene.add(ship);
 box(25,.75,12,mats.darkWood,0,-.08,0,ship);
 for(let z=-5.65;z<6;z+=.59){const len=rand(23.2,25.3);for(let x=-11.4;x<12;x+=4.8){if((x>7.5&&z>4.5)||(x< -10&&z< -4.5))continue;const p=box(rand(4.4,4.7),.19,.53,rng()>.66?mats.lightWood:mats.wood,x+1.9,.4+rand(-.05,.05),z,ship);p.rotation.y=rand(-.016,.016);}}
 for(const side of [-1,1]){for(let x=-12;x<=12;x+=2){const z=side*(5.95-Math.pow(x/12,4)*.65);const rib=bar(new T.Vector3(x,.2,z),new T.Vector3(x,rand(1.7,3.2),z+side*.48),.17,mats.darkWood,ship);box(1.65,.39,.27,mats.wood,x,.94,z+.13*side,ship);if(x< -5||x>5||side===-1)box(1.76,.37,.24,mats.wood,x,1.43,z+.26*side,ship)}}
 // Curved bow and raised stern platform.
 for(let j=0;j<6;j++){const x=-12.5-j*.26;box(.3,.55,11-j*1.6,mats.wood,x,.3+j*.09,0,ship)}
 box(3.8,.5,9.1,mats.darkWood,10.6,.68,-.3,ship);for(let i=0;i<15;i++)box(3.82,.13,.55,mats.lightWood,10.6,.99,-4.5+i*.59,ship);
 // Masts, leaning spars, cloth and ropes.
 bar(new T.Vector3(-2,.5,-.8),new T.Vector3(-2.5,11,-.5),.28,mats.darkWood,ship,.16);
 bar(new T.Vector3(-7,8.15,-.5),new T.Vector3(3,7.2,-.5),.17,mats.wood,ship,.13);
 bar(new T.Vector3(-2.1,.55,-.8),new T.Vector3(4.7,1.5,3.3),.18,mats.wood,ship,.1);
 const clothGeo=new T.BufferGeometry();const verts=[-7,8.1,-.5,-2.5,7.7,-.4,-6.6,3.6,0,-2.5,7.7,-.4,-2.3,4.3,.15,-6.6,3.6,0,-2.2,7.65,-.45,2.8,7.2,-.5,1.9,4.8,.3,-2.2,7.65,-.45,1.9,4.8,.3,-1.8,5.3,.1];clothGeo.setAttribute('position',new T.Float32BufferAttribute(verts,3));clothGeo.computeVertexNormals();const sail=mesh(clothGeo,new T.MeshStandardMaterial({color:'#819689',roughness:1,side:T.DoubleSide,transparent:true,opacity:.77}),0,0,0,ship);sail.castShadow=false;
 const ropeMat=new T.MeshStandardMaterial({color:'#8e8e67',roughness:1});for(const end of [[-10,.8,-5],[8,.8,-5],[-8,.8,5]])bar(new T.Vector3(-2.5,10.7,-.5),new T.Vector3(...end),.029,ropeMat,ship);
 // Portholes on far hull.
 for(let x=-8;x<11;x+=4){const ring=torus(.42,.065,mats.gold,x,1.3,-6.12,ship);sphere(.32,new T.MeshStandardMaterial({color:'#205368',emissive:'#205368',emissiveIntensity:.25}),x,1.3,-6.1,ship).scale.z=.14;}
 const obstacles=[];
 function barrel(x,z,scale=1){const g=new T.Group();g.position.set(x,.5,z);g.scale.setScalar(scale);scene.add(g);mesh(new T.CylinderGeometry(.48,.5,1.2,12),mats.wood,0,.6,0,g);for(const y of [.18,.9]){const r=torus(.49,.045,mats.edge,0,y,0,g);r.rotation.x=Math.PI/2}obstacles.push({x,z,r:.65*scale});return g}
 barrel(-10,2.7);barrel(-10.8,3.7,.8);barrel(5,-3.8);barrel(5.7,-4.7,.9);barrel(10.3,3.7);barrel(11.3,2.8,.8);
 function crate(x,z,s=1){const g=new T.Group();g.position.set(x,.5,z);scene.add(g);box(s,s,s,mats.wood,0,s/2,0,g);for(const k of [-1,1])box(s+.06,.12,.12,mats.lightWood,0,.2+k*s*.25,s/2+.04,g);const br=box(s*1.23,.1,.1,mats.lightWood,0,s/2,s/2+.06,g);br.rotation.z=.68;obstacles.push({x,z,r:s*.68})}
 crate(-5.9,3.7,1.35);crate(-7.4,4.1,.95);crate(3.6,2.6,1.1);crate(4.6,3.5,.85);
 obstacles.push({x:-2,z:-.8,r:.7});
 // Nautical wheel station.
 const stations=[];
 function station(id,x,z,label){const g=new T.Group();g.position.set(x,.52,z);scene.add(g);const ring=torus(1.45,.025,new T.MeshBasicMaterial({color:'#b3b884',transparent:true,opacity:.35}),0,.01,0,g);ring.rotation.x=-Math.PI/2;const beacon=sphere(.13,mats.glow,0,2.6,0,g);const light=new T.PointLight('#f4d697',2.5,6);light.position.set(0,2,0);g.add(light);const s={id,x,z,label,g,ring,beacon,light,solved:false};stations.push(s);return s}
 const helm=station('helm',-8,-2.2,'星象舵轮');box(.25,1.7,.25,mats.darkWood,0,.85,0,helm.g);helm.wheel=new T.Group();helm.wheel.position.set(0,1.65,.2);helm.g.add(helm.wheel);torus(.87,.085,mats.gold,0,0,0,helm.wheel);for(let i=0;i<8;i++){const a=i*Math.PI/4;bar(new T.Vector3(),new T.Vector3(Math.sin(a)*1.07,Math.cos(a)*1.07,0),.048,mats.lightWood,helm.wheel)}sphere(.2,mats.gold,0,0,.03,helm.wheel);
 const echo=station('echo',0,-3.9,'回声贝壳');box(2,.5,1.2,mats.darkWood,0,.25,0,echo.g);echo.shells=[];['#92daca','#e9b77c','#b29ade'].forEach((color,i)=>{const mat=new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.2,roughness:.45});const s=sphere(.43,mat,(i-1)*.65,.75,0,echo.g);s.scale.set(.85,.7,1.25);s.rotation.x=-.4;echo.shells.push(s);for(let j=0;j<5;j++)bar(new T.Vector3((i-1)*.65,.7,.45),new T.Vector3((i-1)*.65+(j-2)*.12,.96,-.3),.012,mats.gold,echo.g)});
 const circuit=station('circuit',7,1.3,'潮汐能源');box(1.8,1.1,1.3,mats.edge,0,.55,0,circuit.g);const cg=mesh(new T.CylinderGeometry(.55,.55,.8,10),mats.gold,0,1.4,0,circuit.g);circuit.core=mesh(new T.IcosahedronGeometry(.36,0),mats.mint,0,1.6,0,circuit.g);for(let i=0;i<3;i++){const r=torus(.52,.028,mats.gold,0,1.6,0,circuit.g);r.rotation.set(i,0,i*.7)}
 // Treasure chest, lid pivot.
 const vault=station('vault',10,-3.2,'潮汐宝藏');box(2.2,1.05,1.35,mats.darkWood,0,.53,0,vault.g);for(const x of [-.87,.87])box(.12,1.12,1.4,mats.gold,x,.55,0,vault.g);vault.lid=new T.Group();vault.lid.position.set(0,1.05,-.67);vault.g.add(vault.lid);const lid=mesh(new T.CylinderGeometry(.67,.67,2.2,12,1,false,0,Math.PI),mats.wood,0,0,.67,vault.lid);lid.rotation.z=Math.PI/2;box(2.25,.12,1.4,mats.gold,0,0,.67,vault.lid);box(.28,.36,.13,mats.gold,0,.86,.75,vault.g);vault.heart=mesh(new T.IcosahedronGeometry(.55,0),mats.glow,0,.9,0,vault.g);vault.heart.visible=false;vault.beacon.material=new T.MeshStandardMaterial({color:'#4a7469',emissive:'#304d48'});
 // Lanterns.
 for(const [x,z] of [[-11,-4.5],[-5,5],[3,-5.5],[11,5]]){bar(new T.Vector3(x,.5,z),new T.Vector3(x,2.6,z),.045,mats.edge);const glass=sphere(.2,mats.glow,x,2.35,z);glass.scale.y=1.35;const l=new T.PointLight('#ffc478',3,6);l.position.set(x,2.5,z);scene.add(l);for(const y of [2.08,2.63])mesh(new T.CylinderGeometry(.26,.26,.07,8),mats.edge,x,y,z)}
 // A seabed with rocks, coral, sea grass, shells.
 for(let i=0;i<65;i++){const x=rand(-38,38),z=rand(-30,30);if(Math.abs(x)<14&&Math.abs(z)<8)continue;const r=rand(.6,2.6);const rock=mesh(new T.DodecahedronGeometry(r,0),mats.rock,x,-.6,z);rock.scale.set(rand(1,1.8),rand(.3,.9),rand(.7,1.3));rock.rotation.set(rand(0,1),rand(0,3),rand(0,1));}
 const weeds=[];
 for(let i=0;i<70;i++){const x=rand(-24,24),z=rand(-19,18);if(Math.abs(x)<13&&Math.abs(z)<6.6)continue;const g=new T.Group();g.position.set(x,-.65,z);scene.add(g);for(let j=0;j<rand(3,6);j++){const h=rand(.7,2.9);const a=rand(-.7,.7);bar(new T.Vector3(rand(-.3,.3),0,rand(-.3,.3)),new T.Vector3(a,h,0),rand(.045,.09),i%4===0?mats.coral:mats.seaweed,g,.015);if(i%4===0){bar(new T.Vector3(a*.5,h*.5,0),new T.Vector3(a+.45,h*.8,.2),.04,mats.coral,g,.017);sphere(.09,mats.coral,a,h,0,g)}}weeds.push(g)}
 // Scattered shipwreck fragments.
 for(let i=0;i<22;i++){const x=rand(-21,21),z=rand(8,14);const plank=box(rand(1,4),.12,.35,mats.darkWood,x,-.45,z);plank.rotation.y=rand(-3,3)}
 // Pearls.
 const pearlPositions=[[-3,4],[-1,3.5],[1,3.8],[-9,0],[-7,1],[-11,-3.5],[-5,-3.5],[-3,-4.1],[2,-4.8],[4,-1.5],[6,-1],[9,0],[10,4.6],[8,4],[-12,5.6],[-3,7.5],[4,7.7],[12,-5.3]];
 const pearls=pearlPositions.map(([x,z],i)=>{const g=new T.Group();g.position.set(x,.95,z);scene.add(g);const m=sphere(.15,new T.MeshStandardMaterial({color:'#d7fff1',emissive:'#7cdfc4',emissiveIntensity:1.15,metalness:.2,roughness:.2}),0,0,0,g,12);const rr=torus(.3,.014,new T.MeshBasicMaterial({color:'#8ae0c9',transparent:true,opacity:.4}),0,0,0,g);rr.rotation.x=Math.PI/2;return{id:i,x,z,g,m,collected:false}});
 const logs=[[-11,1],[-.2,1],[7.5,-4.8]].map(([x,z],i)=>{const g=new T.Group();g.position.set(x,.87,z);scene.add(g);box(.55,.08,.7,mats.lightWood,0,0,0,g);box(.45,.09,.56,mats.glow,0,.01,0,g);g.rotation.y=.4;return{id:i,x,z,g,collected:false}});
 // Octopus, 8 fully animated segmented arms with suction cups.
 const player=new T.Group();player.position.set(-2,1.4,5.2);player.scale.setScalar(1.18);scene.add(player);const body=sphere(.7,mats.skin,0,.37,0,player,24);body.scale.set(.96,1.16,.88);const crown=sphere(.39,mats.skin,.06,.91,-.08,player);crown.scale.set(1,.5,1);const belly=sphere(.55,mats.skinLight,0,.11,.14,player);belly.scale.set(1,.6,.95);
 const white=new T.MeshStandardMaterial({color:'#fff9df',roughness:.25});const black=new T.MeshStandardMaterial({color:'#102c39',roughness:.15});for(const side of [-1,1]){sphere(.195,white,side*.26,.46,.54,player);sphere(.091,black,side*.26,.45,.704,player);sphere(.028,white,side*.24,.485,.781,player);const cheek=sphere(.075,mats.skinLight,side*.42,.2,.48,player);cheek.scale.z=.3;}
 const mouth=torus(.073,.018,black,0,.2,.665,player);mouth.scale.y=.56;
 const arms=[];for(let i=0;i<8;i++){const segs=[];for(let j=0;j<5;j++){const m=mesh(new T.CylinderGeometry(.13-j*.023,.15-j*.024,.32,7),mats.skin,0,0,0,player);const cup=sphere(.055-j*.007,mats.skinLight,0,0,0,player,8);segs.push({m,cup})}arms.push(segs)}
 const shadow=mesh(new T.CircleGeometry(1.05,32),new T.MeshBasicMaterial({color:'#052631',transparent:true,opacity:.23,depthWrite:false}),0,.55,0);shadow.rotation.x=-Math.PI/2;
 // Jellyfish patrols, calm until approached.
 const jellies=[];for(let i=0;i<3;i++){const g=new T.Group();scene.add(g);const mat=new T.MeshStandardMaterial({color:i===1?'#9bc4f1':'#c4a4df',emissive:'#645ba6',emissiveIntensity:.75,transparent:true,opacity:.7,roughness:.3,side:T.DoubleSide});const head=mesh(new T.SphereGeometry(.63,16,10,0,Math.PI*2,0,Math.PI*.6),mat,0,.5,0,g);const tent=[];for(let j=0;j<6;j++){const a=j*Math.PI/3;const m=bar(new T.Vector3(Math.cos(a)*.35,.42,Math.sin(a)*.35),new T.Vector3(Math.cos(a)*.4,-.65,Math.sin(a)*.4),.024,mat,g);tent.push(m)}const l=new T.PointLight('#b4a1ff',1.5,4);g.add(l);jellies.push({g,head,tent,phase:i*2.2,stun:0})}
 const bubblesGeo=new T.BufferGeometry();const bubblePos=new Float32Array(210*3);for(let i=0;i<210;i++){bubblePos[i*3]=rand(-38,38);bubblePos[i*3+1]=rand(-1,25);bubblePos[i*3+2]=rand(-30,30)}bubblesGeo.setAttribute('position',new T.BufferAttribute(bubblePos,3));const bubbles=new T.Points(bubblesGeo,new T.PointsMaterial({color:'#a4dae0',size:.057,transparent:true,opacity:.46,depthWrite:false}));scene.add(bubbles);
 const fish=[];const fishMat=new T.MeshStandardMaterial({color:'#7ab2bf',metalness:.3,roughness:.5});for(let i=0;i<20;i++){const g=new T.Group();scene.add(g);const b=sphere(.14,fishMat,0,0,0,g,8);b.scale.set(1.9,.7,.6);const tail=mesh(new T.ConeGeometry(.15,.23,3),fishMat,-.29,0,0,g);tail.rotation.z=Math.PI/2;fish.push({g,phase:i*.5,speed:rand(.14,.28),height:rand(4,12),radius:rand(13,24)})}
 // Broad translucent shafts in the water, actual scene geometry.
 const rayMat=new T.MeshBasicMaterial({color:'#87cfd9',transparent:true,opacity:.018,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending});for(let i=0;i<8;i++){const ray=mesh(new T.CylinderGeometry(.3,rand(1,2),35,8,1,true),rayMat,-18+i*5,13,-7-rand(0,10));ray.rotation.z=-.36;ray.castShadow=false;ray.receiveShadow=false;}
 const effects=[];
 function burst(x,y,z,color,count=20){for(let i=0;i<count;i++){const m=sphere(rand(.025,.07),new T.MeshBasicMaterial({color,transparent:true}),x,y,z);effects.push({m,vel:new T.Vector3(rand(-2,2),rand(.5,3),rand(-2,2)),life:1.5,max:1.5})}}
 function ink(x,z){const m=sphere(1.2,new T.MeshStandardMaterial({color:'#1d2542',transparent:true,opacity:.78,depthWrite:false}),x,1.3,z);effects.push({m,vel:new T.Vector3(0,.1,0),life:2.6,max:2.6,expand:true})}
 function sonar(x,z){const m=torus(.25,.03,new T.MeshBasicMaterial({color:'#abffdb',transparent:true,opacity:.8}),x,.72,z);m.rotation.x=Math.PI/2;effects.push({m,vel:new T.Vector3(),life:2,max:2,ring:true})}
 function update(time,dt,moving){
  body.scale.y=1.16+Math.sin(time*2.7)*.04;player.position.y=1.28+Math.sin(time*3)*.1;shadow.position.set(player.position.x,.56,player.position.z);
  arms.forEach((segs,i)=>{const a=i*Math.PI/4;let prev=new T.Vector3(Math.sin(a)*.34,-.05,Math.cos(a)*.34);segs.forEach(({m,cup},j)=>{const r=.44+(j+1)*.22;const wav=Math.sin(time*(moving?9:3.7)+i*.8-j*.68);const pt=new T.Vector3(Math.sin(a+wav*.13)*r,-.13-j*.065+wav*.10+(j===4?.10:0),Math.cos(a+wav*.13)*r);m.position.copy(prev).add(pt).multiplyScalar(.5);const d=new T.Vector3().subVectors(pt,prev);m.scale.y=d.length()/.32;m.quaternion.setFromUnitVectors(up,d.normalize());cup.position.copy(m.position);cup.position.y-=.07;prev=pt})});
  stations.forEach((s,i)=>{s.beacon.position.y=2.65+Math.sin(time*2+i)*.13;s.ring.material.opacity=(s.solved?.25:.4)+Math.sin(time*2+i)*.1;});circuit.core.rotation.y=time*.6;circuit.core.position.y=1.62+Math.sin(time*2)*.1;
  pearls.forEach((p,i)=>{if(!p.collected){p.g.position.y=.95+Math.sin(time*2+i)*.17;p.g.rotation.y=time*.5}});logs.forEach((l,i)=>{if(!l.collected)l.g.position.y=.86+Math.sin(time*2+i)*.08});
  jellies.forEach((j,i)=>{j.stun=Math.max(0,j.stun-dt);if(!j.stun){j.g.position.set(Math.sin(time*.18+j.phase)*(i===1?9:6),1.9+Math.sin(time*2+i)*.2,Math.cos(time*.22+j.phase)*3.6);j.head.scale.set(1+Math.sin(time*3+i)*.08,1-Math.sin(time*3+i)*.1,1+Math.sin(time*3+i)*.08)}j.g.visible=j.stun<1.5;j.g.rotation.y=time*.3+i;});
  weeds.forEach((w,i)=>{w.rotation.z=Math.sin(time*.9+i)*.07});fish.forEach(f=>{const a=time*f.speed+f.phase;f.g.position.set(Math.cos(a)*f.radius,f.height+Math.sin(a*2)*.7,Math.sin(a)*f.radius*.62);f.g.rotation.y=-a-Math.PI/2});
  for(let i=0;i<210;i++){bubblePos[i*3+1]+=dt*(.12+(i%5)*.04);if(bubblePos[i*3+1]>25)bubblePos[i*3+1]=-1}bubblesGeo.attributes.position.needsUpdate=true;
  for(let i=effects.length-1;i>=0;i--){const e=effects[i];e.life-=dt;e.m.position.addScaledVector(e.vel,dt);e.m.material.opacity=Math.max(0,e.life/e.max)*.8;if(e.expand)e.m.scale.setScalar(1+(e.max-e.life)*1.8);if(e.ring)e.m.scale.setScalar(1+(e.max-e.life)*26);if(e.life<=0){scene.remove(e.m);e.m.geometry.dispose();e.m.material.dispose();effects.splice(i,1)}}
  if(vault.heart.visible){vault.heart.rotation.y=time;vault.heart.position.y=2.1+Math.sin(time*2)*.12;vault.lid.rotation.x=T.MathUtils.lerp(vault.lid.rotation.x,-1.6,dt*2)}
 }
 return {T,scene,camera,renderer,player,pearls,logs,stations,jellies,obstacles,vault,update,burst,ink,sonar,mats};
}
