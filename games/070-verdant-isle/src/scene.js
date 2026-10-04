import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {seeded,SEASONS} from './engine.js';
const MAT=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:1,flatShading:true,...extra});
const v3=(x,y,z)=>new THREE.Vector3(x,y,z);
export class IslandScene{
 constructor(container,game,onPick,onHover){
  this.container=container;this.game=game;this.onPick=onPick;this.onHover=onHover;this.meshes=[];this.ground=[];this.plants=[];this.effects=[];this.clouds=[];this.animals=[];this.pointer=new THREE.Vector2(9,9);this.raycaster=new THREE.Raycaster();this.hoverId=null;this.season=-1;this.time=0;this.lastSync=0;
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#d7e7e2');this.scene.fog=new THREE.Fog('#d7e7e2',35,90);
  this.camera=new THREE.OrthographicCamera(-18,18,12,-12,.1,130);this.camera.position.set(14,16,20);
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.setClearColor('#d7e7e2');this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;container.appendChild(this.renderer.domElement);
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(0,.1,0);this.controls.enableDamping=true;this.controls.dampingFactor=.07;this.controls.enablePan=false;this.controls.minZoom=.68;this.controls.maxZoom=2.15;this.controls.minPolarAngle=.2;this.controls.maxPolarAngle=1.28;this.controls.rotateSpeed=.55;this.controls.zoomSpeed=.65;this.controls.update();
  this.scene.add(new THREE.HemisphereLight('#fffce5','#678d8a',2.6));this.sun=new THREE.DirectionalLight('#fff2cf',3.7);this.sun.position.set(-10,19,8);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-15,right:15,top:15,bottom:-15,near:1,far:60});this.sun.shadow.bias=-.001;this.sun.shadow.normalBias=.04;this.sun.shadow.radius=4;this.scene.add(this.sun);
  this.buildWorld();this.buildSpirit();this.buildSelection();this.resize();window.addEventListener('resize',()=>this.resize());
  const canvas=this.renderer.domElement;
  canvas.addEventListener('pointerdown',e=>{this.down={x:e.clientX,y:e.clientY,t:performance.now()};this.dragging=false});
  canvas.addEventListener('pointermove',e=>{if(this.down&&Math.hypot(e.clientX-this.down.x,e.clientY-this.down.y)>7)this.dragging=true;this.updatePointer(e);this.pick(false)});
  canvas.addEventListener('pointerup',e=>{this.updatePointer(e);if(this.down&&!this.dragging&&performance.now()-this.down.t<600)this.pick(true);this.down=null});
  canvas.addEventListener('pointerleave',()=>{this.pointer.set(9,9);this.hoverId=null;this.onHover(null);this.selection.visible=false;this.down=null});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();document.dispatchEvent(new CustomEvent('game-render-error'))});
  this.sync();
 }
 mesh(geometry,material,x=0,y=0,z=0,parent=this.scene){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 buildWorld(){
  this.waterMat=MAT('#88b9b1',{metalness:.1,roughness:.34});const sea=this.mesh(new THREE.PlaneGeometry(240,240),this.waterMat,0,-1.52,0);sea.rotation.x=-Math.PI/2;sea.castShadow=false;
  const baseGeo=new THREE.CylinderGeometry(7.7,6.75,2.25,13,2);let pos=baseGeo.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);if(Math.abs(x)+Math.abs(z)>0.5){const a=Math.atan2(z,x);const f=1+Math.sin(a*5)*.07;pos.setX(i,x*f);pos.setZ(i,z*f)}}baseGeo.computeVertexNormals();this.mesh(baseGeo,MAT('#9d9a7c'),0,-.7,0);
  this.mesh(new THREE.CylinderGeometry(8.05,7.6,.27,13),MAT('#c8bd92'),0,-.06,0);
  for(const tile of this.game.tiles){
   const g=new THREE.Group();g.position.set(tile.x,0,tile.z);this.scene.add(g);
   const groundMat=MAT('#b7ac81');const top=this.mesh(new THREE.CylinderGeometry(.998,1.008,.22,6),groundMat,0,tile.h-.11,0,g);top.userData.tileId=tile.id;this.meshes.push(top);this.ground.push(top);
   const wall=this.mesh(new THREE.CylinderGeometry(1.005,1.04,tile.h+.65,6),MAT(tile.r<-1?'#a7a488':'#afa281'),0,(tile.h-.65)/2-.18,0,g);wall.userData.tileId=tile.id;this.meshes.push(wall);
   const veg=new THREE.Group();veg.position.set(tile.x,tile.h,tile.z);this.scene.add(veg);this.plants.push({group:veg,type:null,dead:null});
   if(!tile.plant&&seeded(tile.id+91)>.58){const rock=this.mesh(new THREE.DodecahedronGeometry(.13+seeded(tile.id+58)*.2,0),MAT('#aaa88d'),(seeded(tile.id+34)-.5)*.9,tile.h+.09,(seeded(tile.id+56)-.5)*.9,g);rock.rotation.set(.4,seeded(tile.id)*6,0);rock.scale.y=.64;}
   if(!tile.plant&&seeded(tile.id+113)>.78){const dead=new THREE.Group();dead.position.y=tile.h;g.add(dead);let stem=this.mesh(new THREE.CylinderGeometry(.035,.09,.85,5),MAT('#a59877'),0,.39,0,dead);stem.rotation.z=.1;for(let k=0;k<3;k++){let b=this.mesh(new THREE.CylinderGeometry(.015,.038,.43,4),MAT('#a59877'),Math.sin(k*2)*.1,.4+k*.1,Math.cos(k*2)*.1,dead);b.rotation.z=.75+k*1.8}this.plants[tile.id].dead=dead;}
  }
  for(let i=0;i<80;i++){const a=i/80*Math.PI*2,rad=8.07+seeded(i+59)*.45;const m=this.mesh(new THREE.DodecahedronGeometry(.15+seeded(i+10)*.32,0),MAT(i%3?'#adb59b':'#d0c49e'),Math.sin(a)*rad,-.1+seeded(i+30)*.2,Math.cos(a)*rad);m.scale.y=.6;m.rotation.set(i,0,i*.2)}
  this.waveLines=[];for(let i=0;i<7;i++){const pts=[];for(let j=0;j<=100;j++){const a=j/100*Math.PI*2,r=8.6+i*.55+Math.sin(a*5)*.25;pts.push(v3(Math.sin(a)*r,-1.46,Math.cos(a)*r))}const line=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#d8eee1',transparent:true,opacity:.32-i*.034}));this.scene.add(line);this.waveLines.push(line)}
  for(let j=0;j<90;j++){const x=(seeded(j+780)-.5)*80,z=(seeded(j+170)-.5)*65;if(Math.hypot(x,z)<11)continue;const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([v3(x,-1.43,z),v3(x+.25+seeded(j)*.8,-1.43,z)]),new THREE.LineBasicMaterial({color:'#e0efe3',transparent:true,opacity:.25}));this.scene.add(line)}
  for(let i=0;i<6;i++){const a=i*1.047+.3;const cluster=new THREE.Group();cluster.position.set(Math.sin(a)*(12+i%3*2),-1.12,Math.cos(a)*(12+i%3));this.scene.add(cluster);for(let k=0;k<3;k++){let m=this.mesh(new THREE.DodecahedronGeometry(.28+seeded(i*3+k+12)*.65,0),MAT('#91a69b'),k*.36,.12,-k*.18,cluster);m.scale.y=.85}}
  this.pond=this.mesh(new THREE.CylinderGeometry(1.1,1.16,.05,24),MAT('#7bb7b8',{roughness:.18,metalness:.15}),6.6,.66,-.2);this.pond.scale.z=.74;
  for(let i=0;i<11;i++){let a=i/11*6.28;const m=this.mesh(new THREE.DodecahedronGeometry(.18+seeded(i)*.14),MAT('#c2c1a2'),6.6+Math.cos(a)*1.13,.68,Math.sin(a)*.84-.2);m.scale.y=.6}
  for(let i=0;i<7;i++){const cloud=new THREE.Group();cloud.position.set((seeded(i+891)-.5)*25,4+seeded(i+140)*2,-5+(seeded(i+350)-.5)*18);const cm=MAT('#f4f7ef',{transparent:true,opacity:.87,depthWrite:false});for(let j=0;j<5;j++){let m=this.mesh(new THREE.IcosahedronGeometry(.57+seeded(i*5+j)*.3,1),cm,(j-2)*.47,Math.sin(j)*.18,seeded(i+j)*.3,cloud);m.scale.y=.6;m.castShadow=false}cloud.scale.setScalar(.62+seeded(i)*.4);this.scene.add(cloud);this.clouds.push({group:cloud,start:cloud.position.clone(),speed:.07+seeded(i)*.03})}
 }
 makePlant(type,tile){
  const g=this.plants[tile.id].group;while(g.children.length){const child=g.children[0];g.remove(child);child.traverse(x=>{x.geometry?.dispose();if(x.material)x.material.dispose()})}
  const rnd=seeded(tile.id+56);const matGreen=MAT(type==='willow'?'#9cba6f':type==='pine'?'#57977d':'#91b77b');
  if(type==='pine'){
   this.mesh(new THREE.CylinderGeometry(.09,.14,1.65,6),MAT('#816e51'),0,.7,0,g);
   for(let j=0;j<3;j++){let m=this.mesh(new THREE.ConeGeometry(.77-j*.18,1.15-j*.08,6),j===1?MAT('#6ba286'):matGreen,0,.95+j*.52,0,g);m.rotation.y=rnd*3+j*.2}
  }else if(type==='willow'){
   this.mesh(new THREE.CylinderGeometry(.08,.17,1.55,6),MAT('#8b7b55'),0,.68,0,g);
   for(let j=0;j<5;j++){let a=j/5*6.28;let m=this.mesh(new THREE.IcosahedronGeometry(.67+j%2*.1,0),j%2?MAT('#adc277'):matGreen,Math.cos(a)*.36,1.36+seeded(j+tile.id)*.52,Math.sin(a)*.36,g);m.scale.y=1.2}
  }else if(type==='flower'){
   for(let j=0;j<7;j++){const a=j*2.4,rad=j===0?0:.24+seeded(j+tile.id)*.35,x=Math.cos(a)*rad,z=Math.sin(a)*rad,h=.27+seeded(j*3+tile.id)*.45;
    this.mesh(new THREE.CylinderGeometry(.015,.026,h,4),MAT('#7caa6e'),x,h/2,z,g);
    const center=MAT('#dfac57'),petal=MAT(['#edceb4','#f2e4b4','#d8b5cc'][tile.id%3]);
    for(let p=0;p<5;p++){let b=p/5*6.28;this.mesh(new THREE.IcosahedronGeometry(.105,0),petal,x+Math.cos(b)*.12,h,z+Math.sin(b)*.12,g)}this.mesh(new THREE.IcosahedronGeometry(.08,0),center,x,h+.025,z,g);
   }
  }else{
   for(let j=0;j<9;j++){let a=j*2.4,rad=seeded(j+tile.id)*.62;const blade=this.mesh(new THREE.ConeGeometry(.095,.28+seeded(j*2+tile.id)*.33,3),j%2?MAT('#a9bf77'):matGreen,Math.cos(a)*rad,.15,Math.sin(a)*rad,g);blade.rotation.z=(seeded(j+57)-.5)*.6}
   for(let j=0;j<3;j++){const mound=this.mesh(new THREE.IcosahedronGeometry(.3,0),matGreen,(seeded(j+tile.id+78)-.5)*.8,.025,(seeded(j+tile.id+38)-.5)*.8,g);mound.scale.y=.3}
  }
  g.rotation.y=rnd*6.28;this.plants[tile.id].type=type;
 }
 buildSpirit(){
  this.spirit=new THREE.Group();this.spirit.position.set(1,3,1);this.scene.add(this.spirit);
  const body=this.mesh(new THREE.SphereGeometry(.23,20,16),MAT('#fff7d1',{emissive:'#f6dfa7',emissiveIntensity:.35,roughness:.25}),0,0,0,this.spirit);body.scale.y=1.17;
  for(const x of [-.078,.078]){const eye=this.mesh(new THREE.SphereGeometry(.026,8,6),MAT('#395e55'),x,.025,.211,this.spirit);eye.scale.y=1.45;eye.castShadow=false}
  const leaf=this.mesh(new THREE.SphereGeometry(.11,6,4),MAT('#8fbd77'),.09,.3,0,this.spirit);leaf.scale.set(.5,1.4,.55);leaf.rotation.z=-.7;
  const halo=this.mesh(new THREE.TorusGeometry(.39,.016,5,40),MAT('#e7eabd',{emissive:'#ddd88a',emissiveIntensity:.35}),0,-.14,0,this.spirit);halo.rotation.x=Math.PI/2;
  for(const x of [-1,1]){const wing=this.mesh(new THREE.SphereGeometry(.12,8,6),MAT('#fff9dd',{transparent:true,opacity:.8}),x*.28,-.035,0,this.spirit);wing.scale.set(1.5,.5,.65)}
  const glow=new THREE.PointLight('#e3f7a3',1.2,3);this.spirit.add(glow);this.spiritTarget=v3(1,2.5,1);
 }
 buildSelection(){this.selection=new THREE.Group();const pts=[];for(let i=0;i<=6;i++){const a=i/6*Math.PI*2+Math.PI/6;pts.push(v3(Math.cos(a)*1.02,.025,Math.sin(a)*1.02))}this.selection.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#ffffdf',transparent:true,opacity:.95})));const disc=this.mesh(new THREE.CircleGeometry(.95,6),new THREE.MeshBasicMaterial({color:'#efffba',transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide}),0,.02,0,this.selection);disc.rotation.x=-Math.PI/2;disc.castShadow=false;this.scene.add(this.selection);this.selection.visible=false;}
 updatePointer(e){let r=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1)}
 pick(click){this.raycaster.setFromCamera(this.pointer,this.camera);const hits=this.raycaster.intersectObjects(this.meshes,false);if(hits.length){const id=hits[0].object.userData.tileId;this.hoverId=id;const tile=this.game.tiles[id];this.selection.position.set(tile.x,tile.h+.018,tile.z);this.selection.visible=true;this.onHover(id);this.container.style.cursor=this.dragging?'grabbing':'crosshair';if(click){this.spiritTarget.set(tile.x,tile.h+2,tile.z);this.onPick(id)}}else{this.hoverId=null;this.selection.visible=false;this.onHover(null);this.container.style.cursor=this.dragging?'grabbing':'grab'}}
 focusTile(id){const t=this.game.tiles[id];this.spiritTarget.set(t.x,t.h+2,t.z)}
 castEffect(power,id){
  const t=this.game.tiles[id],g=new THREE.Group();g.position.set(t.x,t.h,t.z);this.scene.add(g);let duration=3.5,particles=[];
  if(power==='rain'||power==='snow'){
   for(let i=0;i<(power==='rain'?95:65);i++){const x=(seeded(i+this.time)-.5)*4,z=(seeded(i+42+this.time)-.5)*4,y=seeded(i+34)*4+.3;let mesh;
    if(power==='rain'){mesh=new THREE.Line(new THREE.BufferGeometry().setFromPoints([v3(0,0,0),v3(.025,.22,.02)]),new THREE.LineBasicMaterial({color:'#bddfdf',transparent:true,opacity:.85}));g.add(mesh)}else mesh=this.mesh(new THREE.IcosahedronGeometry(.055,0),new THREE.MeshBasicMaterial({color:'#f1fbff'}),0,0,0,g);
    mesh.position.set(x,y,z);mesh.castShadow=false;particles.push(mesh)
   }
   if(power==='rain'){const c=new THREE.Group();c.position.y=4;g.add(c);for(let j=0;j<5;j++){let m=this.mesh(new THREE.IcosahedronGeometry(.56,1),MAT('#b5cbcd',{transparent:true,opacity:.8}),(j-2)*.47,Math.sin(j)*.2,0,c);m.scale.y=.65}}
  }else if(power==='wind'){
   for(let i=0;i<8;i++){const pts=[];for(let j=0;j<25;j++){const a=j/25*4.5+i;pts.push(v3(Math.cos(a)*(1+i*.11),.3+i*.17+j*.035,Math.sin(a)*(1+i*.11)))}const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#e8f5d4',transparent:true,opacity:.65}));g.add(l);particles.push(l)}
  }else if(power==='sun'){
   for(let i=0;i<7;i++){let m=this.mesh(new THREE.CylinderGeometry(.025,.35,5,8,1,true),new THREE.MeshBasicMaterial({color:'#fff5b9',transparent:true,opacity:.13,depthWrite:false,side:THREE.DoubleSide}),(seeded(i+45)-.5)*3,2.5,(seeded(i+23)-.5)*3,g);m.rotation.z=-.17;m.castShadow=false;particles.push(m)}
  }else{
   for(let i=0;i<35;i++){let m=this.mesh(new THREE.IcosahedronGeometry(.04+seeded(i)*.04),new THREE.MeshBasicMaterial({color:power==='bloom'?'#f4dff3':'#e0ef9f',transparent:true}),0,0,0,g);m.position.set((seeded(i+2)-.5)*2,.2+seeded(i+13),(seeded(i+17)-.5)*2);m.castShadow=false;particles.push(m)}
  }
  const ring=this.mesh(new THREE.RingGeometry(.08,.13,48),new THREE.MeshBasicMaterial({color:power==='sun'?'#fff2b1':'#deedc5',transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}),0,.05,0,g);ring.rotation.x=-Math.PI/2;ring.castShadow=false;
  this.effects.push({group:g,particles,ring,power,life:duration,duration});
 }
 makeAnimal(id,index){
  const g=new THREE.Group(),mat=MAT(id==='rabbit'?'#eee8cc':id==='deer'?'#bc9270':id==='bird'?'#669fb0':id==='bee'?'#e4b75c':'#e7d3bd');
  if(id==='rabbit'||id==='deer'){
   const b=this.mesh(new THREE.SphereGeometry(.18,8,6),mat,0,.2,0,g);b.scale.set(1,1,1.35);this.mesh(new THREE.SphereGeometry(.12,8,6),mat,0,.37,.15,g);
   for(let s of [-1,1]){let e=this.mesh(new THREE.ConeGeometry(.04,id==='rabbit'?.24:.12,5),mat,s*.067,.51,.16,g);e.rotation.z=s*.2}
   for(let s of [-1,1])for(let z of [-.12,.12])this.mesh(new THREE.CylinderGeometry(.025,.032,.19,5),mat,s*.11,.09,z,g);
   this.mesh(new THREE.SphereGeometry(.022,5,4),MAT('#354b40'),.081,.4,.235,g);
   if(id==='deer'){g.scale.setScalar(1.7);for(let s of [-1,1]){let h=this.mesh(new THREE.CylinderGeometry(.012,.025,.28,4),MAT('#92785d'),s*.07,.64,.13,g);h.rotation.z=s*.4}}
  }else{
   let body=this.mesh(new THREE.SphereGeometry(.09,8,6),mat,0,0,0,g);body.scale.z=1.5;
   for(let s of [-1,1]){let w=this.mesh(new THREE.SphereGeometry(.15,6,4),id==='butterfly'?MAT('#d0abc6'):mat,s*.13,.02,0,g);w.scale.set(1.1,.09,.7);w.userData.wing=s}
  }
  this.scene.add(g);return {group:g,id,index,phase:seeded(index+789)*6.28};
 }
 sync(){
  const autumn=this.game.season===2,winter=this.game.season===3;
  for(const t of this.game.tiles){let p=this.plants[t.id];if(t.plant!==p.type){if(t.plant)this.makePlant(t.plant,t);else{while(p.group.children.length){const child=p.group.children[0];p.group.remove(child);child.traverse(x=>{x.geometry?.dispose();x.material?.dispose()})}p.type=null}}if(p.dead)p.dead.visible=!t.plant;
   let dry=new THREE.Color('#baa97d'),wet=new THREE.Color('#9caa78'),green=new THREE.Color(autumn?'#b3b177':'#92b47a');dry.lerp(wet,t.water/100*.7);if(t.plant)dry.lerp(green,.45+t.growth*.5);if(t.snow>2)dry.lerp(new THREE.Color('#e2e9dc'),Math.min(.9,t.snow/35));this.ground[t.id].material.color.copy(dry);
   if(t.plant){let size=.3+t.growth*.7;p.group.scale.setScalar(size);p.group.traverse(m=>{if(m.isMesh&&m.material){if(!m.userData.originalColor)m.userData.originalColor=m.material.color.clone();m.material.color.copy(m.userData.originalColor);if(autumn&&t.plant!=='pine')m.material.color.lerp(new THREE.Color('#c79758'),.5);if(winter&&t.snow>3)m.material.color.lerp(new THREE.Color('#e2eddf'),.4)}})}
  }
  if(this.season!==this.game.season){this.season=this.game.season;const bg=['#d7e7e2','#dce9dc','#e2e4d6','#dbe5e7'][this.season];this.scene.background.set(bg);this.scene.fog.color.set(bg);this.waterMat.color.set(['#8bbdb4','#89b9af','#96bab0','#a7c7c6'][this.season]);this.sun.color.set(['#fff2cf','#fff2c4','#ffe5bd','#e8f6ff'][this.season])}
  const wanted=this.game.animals.flatMap(id=>Array(id==='butterfly'?5:id==='bird'?3:id==='bee'?3:id==='rabbit'?2:1).fill(id));
  if(wanted.length!==this.animals.length||wanted.some((id,i)=>id!==this.animals[i]?.id)){for(let a of this.animals){this.scene.remove(a.group);a.group.traverse(o=>{o.geometry?.dispose();o.material?.dispose()})}this.animals=wanted.map((id,i)=>this.makeAnimal(id,i))}
 }
 zoom(delta){this.camera.zoom=THREE.MathUtils.clamp(this.camera.zoom*(delta>0?1.18:.85),.68,2.15);this.camera.updateProjectionMatrix()}
 resetView(){this.camera.position.set(14,16,20);this.camera.zoom=1;this.controls.target.set(0,.1,0);this.camera.updateProjectionMatrix();this.controls.update()}
 resize(){const w=this.container.clientWidth,h=this.container.clientHeight,aspect=w/h;let height=w<800?23/aspect:21.5;this.camera.left=-height*aspect/2;this.camera.right=height*aspect/2;this.camera.top=height/2+(w<800?3:0);this.camera.bottom=-height/2+(w<800?3:0);this.camera.updateProjectionMatrix();this.renderer.setSize(w,h)}
 animate(dt){
  this.time+=dt;const t=this.time;this.controls.update();if(t-this.lastSync>.35){this.sync();this.lastSync=t}
  this.spirit.position.lerp(this.spiritTarget,.025);this.spirit.position.y+=Math.sin(t*2.3)*.007;this.spirit.rotation.y=this.camera.position.x>0?.5:-.5;
  this.clouds.forEach((c,i)=>{c.group.position.x=c.start.x+Math.sin(t*.035+i)*2;c.group.position.y=c.start.y+Math.sin(t*.19+i)*.08});
  this.waveLines.forEach((l,i)=>{const s=1+Math.sin(t*.6+i)*.012;l.scale.set(s,1,s);l.material.opacity=(.2-i*.022)+Math.sin(t*.6-i)*.04});
  for(const p of this.plants)if(p.type){p.group.rotation.z=Math.sin(t*1.4+p.group.position.x)*.016;p.group.rotation.x=Math.cos(t+p.group.position.z)*.012}
  for(let i=this.effects.length-1;i>=0;i--){const e=this.effects[i];e.life-=dt;const progress=1-e.life/e.duration;let scale=1+progress*30;e.ring.scale.set(scale,scale,scale);e.ring.material.opacity=(1-progress)*.7;
   e.particles.forEach((p,j)=>{if(e.power==='rain'){p.position.y-=dt*5;if(p.position.y<0)p.position.y=4}else if(e.power==='snow'){p.position.y-=dt*.85;p.position.x+=Math.sin(t*2+j)*dt*.2;if(p.position.y<0)p.position.y=4}else if(e.power==='wind'){p.rotation.y+=dt*1.6;p.material.opacity=(1-progress)*.6}else if(['seed','bloom'].includes(e.power)){p.position.y+=dt*.65;p.material.opacity=1-progress}else if(e.power==='sun')p.material.opacity=(1-progress)*.14});
   if(e.life<=0){this.scene.remove(e.group);e.group.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});this.effects.splice(i,1)}
  }
  for(const a of this.animals){const fly=['bird','butterfly','bee'].includes(a.id);let phase=t*(fly?.22:.09)+a.phase,radius=a.id==='deer'?3.8:a.id==='rabbit'?3:2.2+a.index*.23;const x=Math.cos(phase)*radius,z=Math.sin(phase)*radius*.7;const nearest=this.game.tiles.reduce((best,t)=>Math.hypot(t.x-x,t.z-z)<Math.hypot(best.x-x,best.z-z)?t:best,this.game.tiles[0]);a.group.position.set(x,nearest.h+(fly?(a.id==='bird'?2.1:1.05)+Math.sin(t*2+a.phase)*.3:Math.abs(Math.sin(t*3+a.phase))*.08),z);a.group.rotation.y=-phase;a.group.children.forEach(m=>{if(m.userData.wing)m.rotation.z=Math.sin(t*(a.id==='bird'?8:18))*m.userData.wing*.6})}
  this.renderer.render(this.scene,this.camera);
 }
}
