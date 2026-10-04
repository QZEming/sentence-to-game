import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {predict} from './sim.js';
export function createScene(container){
 const scene=new THREE.Scene(),renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x05090e,1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;container.appendChild(renderer.domElement);
 const camera=new THREE.PerspectiveCamera(42,1,.01,1000);camera.position.set(7.9,5.2,10.2);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=4.2;controls.maxDistance=23;controls.enablePan=false;
 const ambient=new THREE.AmbientLight(0x89baf0,1.5);scene.add(ambient);const sun=new THREE.DirectionalLight(0xfff1d7,3.7);sun.position.set(-5,4,6);scene.add(sun);const blueLight=new THREE.DirectionalLight(0x3a8ddb,1.2);blueLight.position.set(4,0,-4);scene.add(blueLight);
 const orbitWorld=new THREE.Group();scene.add(orbitWorld);const loader=new THREE.TextureLoader();const tex=loader.load('./assets/earth.jpg');tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();
 const earth=new THREE.Mesh(new THREE.SphereGeometry(2.65,96,64),new THREE.MeshPhongMaterial({map:tex,specular:0x285987,shininess:7}));earth.rotation.set(0,-1.7,.12);orbitWorld.add(earth);
 const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(2.71,64,48),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false,uniforms:{glowColor:{value:new THREE.Color(0x227fe8)}},vertexShader:'varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 vNormal; varying vec3 vPosition; uniform vec3 glowColor; void main(){float a=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),3.1);gl_FragColor=vec4(glowColor,a*.65);}'}));orbitWorld.add(atmosphere);
 const starsGeometry=new THREE.BufferGeometry(),positions=[],colors=[];let seed=41;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};for(let i=0;i<2200;i++){const t=random()*Math.PI*2,z=random()*2-1,r=70+random()*100,p=Math.sqrt(1-z*z);positions.push(r*p*Math.cos(t),r*z,r*p*Math.sin(t));const b=.25+random()*.55;colors.push(b*.83,b*.91,b);}starsGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));starsGeometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));scene.add(new THREE.Points(starsGeometry,new THREE.PointsMaterial({size:.055,vertexColors:true,transparent:true,opacity:.8,sizeAttenuation:true})));
 const frame=new THREE.Group();frame.rotation.set(.25,0,.20);orbitWorld.add(frame);
 function line(points,color,opacity=1,dashed=false){const g=new THREE.BufferGeometry().setFromPoints(points);const m=dashed?new THREE.LineDashedMaterial({color,transparent:true,opacity,dashSize:.06,gapSize:.045}):new THREE.LineBasicMaterial({color,transparent:true,opacity});const obj=new THREE.Line(g,m);if(dashed)obj.computeLineDistances();return obj;}
 const ring=(radius,offset=0)=>Array.from({length:361},(_,i)=>{const a=i/360*Math.PI*2;return new THREE.Vector3(radius*Math.cos(a),Math.sin(a)*offset,radius*Math.sin(a));});frame.add(line(ring(3.5),0x70e4bd,.8));frame.add(line(ring(3.39,.03),0x809aab,.45));frame.add(line(ring(3.9),0x243b49,.4));
 const equator=line(ring(2.72),0x3b83b0,.17);equator.rotation.x=Math.PI/2;orbitWorld.add(equator);
 const planLine=line([],0xe4b469,.9,true);frame.add(planLine);
 const mat=(color,metalness=.3,roughness=.5)=>new THREE.MeshStandardMaterial({color,metalness,roughness});const silver=mat(0xbfcbd4,.75,.32),white=mat(0xdce3e5,.4,.58),dark=mat(0x182332,.7,.3),gold=mat(0xb89143,.7,.4),solar=mat(0x203e70,.4,.42);
 function box(group,x,y,z,w,h,d,material){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);o.position.set(x,y,z);group.add(o);return o;}
 function cylinder(group,r1,r2,h,material,x=0,y=0,z=0){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,20),material);o.rotation.x=Math.PI/2;o.position.set(x,y,z);group.add(o);return o;}
 function solarPanel(group,x,z,w=1.0,h=2.7){box(group,x,0,z,w,.025,h,solar);for(let i=0;i<10;i++)box(group,x,.018,z-h/2+i*h/10,w,.009,.01,silver);for(let j=0;j<4;j++)box(group,x-w/2+j*w/4,.018,z,.012,.009,h,gold);}
 function stationModel(){const g=new THREE.Group();cylinder(g,.28,.28,3.4,white,0,0,.1);cylinder(g,.34,.34,.5,silver,0,0,-.8);cylinder(g,.35,.35,.42,silver,0,0,1.1);const lateral=cylinder(g,.21,.21,2.8,white,0,0,-.3);lateral.rotation.set(0,0,Math.PI/2);box(g,0,.15,.5,8,.15,.15,silver);for(const x of[-3.2,-1.9,1.9,3.2]){solarPanel(g,x,-1.3,.9,2.5);solarPanel(g,x,2.25,.9,2.5);box(g,x,0,.5,.06,.10,6,silver);}cylinder(g,.3,.25,.45,gold,0,0,2);const port=cylinder(g,.26,.26,.2,dark,0,0,2.29);const portRing=new THREE.Mesh(new THREE.TorusGeometry(.29,.035,8,32),new THREE.MeshBasicMaterial({color:0x76ebbf}));portRing.position.set(0,0,2.41);g.add(portRing);box(g,0,.5,-1,.55,.8,.5,white);const dish=new THREE.Mesh(new THREE.SphereGeometry(.38,20,12,0,Math.PI*2,0,Math.PI/2),silver);dish.position.set(.6,.3,-1);dish.rotation.x=Math.PI/3;g.add(dish);return g;}
 function craftModel(){const g=new THREE.Group();cylinder(g,.26,.32,.65,white,0,0,0);cylinder(g,.25,.33,.5,silver,0,0,.53);cylinder(g,.1,.26,.5,white,0,0,-.58);cylinder(g,.13,.13,.12,dark,0,0,-.87);cylinder(g,.18,.25,.15,dark,0,0,.93);box(g,0,0,.24,2.4,.03,.1,gold);solarPanel(g,-.95,.22,.75,1.05);solarPanel(g,.95,.22,.75,1.05);for(let i=0;i<4;i++){const a=i/4*Math.PI*2;box(g,Math.cos(a)*.29,Math.sin(a)*.29,.25,.08,.08,.15,dark);}const glass=new THREE.Mesh(new THREE.SphereGeometry(.13,16,12),mat(0x15384e,.6,.15));glass.scale.set(1,.3,1);glass.position.set(0,.22,-.54);g.add(glass);return g;}
 const station=stationModel(),craft=craftModel();station.scale.setScalar(.095);craft.scale.setScalar(.19);frame.add(station,craft);
 const flame=new THREE.Mesh(new THREE.ConeGeometry(.16,.9,16,1,true),new THREE.MeshBasicMaterial({color:0x74caff,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false}));flame.rotation.x=Math.PI/2;flame.position.set(0,0,1.38);craft.add(flame);
 const closeWorld=new THREE.Group();scene.add(closeWorld);const closeStation=stationModel();closeStation.scale.setScalar(2.3);closeStation.position.z=-5.54;closeWorld.add(closeStation);const closeCraft=craftModel();closeCraft.scale.setScalar(.9);closeWorld.add(closeCraft);
 const closeEarth=new THREE.Mesh(new THREE.SphereGeometry(160,64,40),new THREE.MeshPhongMaterial({map:tex,color:0x91b9d7}));closeEarth.position.set(10,-181,-30);closeEarth.rotation.y=-1.7;closeWorld.add(closeEarth);
 const rings=[];for(const z of[5,10,20,30,60,120]){const radius=z>20?4:2;const o=new THREE.Mesh(new THREE.RingGeometry(radius-.025,radius+.025,80),new THREE.MeshBasicMaterial({color:0x70e1be,transparent:true,opacity:z>30?.22:.45,side:THREE.DoubleSide,depthWrite:false}));o.position.z=z;closeWorld.add(o);rings.push(o);}
 const portLight=new THREE.PointLight(0x66edbf,3,30);portLight.position.set(0,0,1);closeWorld.add(portLight);closeWorld.visible=false;
 let view='orbit',theta=.78,lastPlan='',freeCamera=false,lastView='';const earthAngle=-1.7;
 const worldPosition=r=>new THREE.Vector3((3.5+r[0]*.0012)*Math.cos(theta+r[1]*.00072),r[2]*.0016,(3.5+r[0]*.0012)*Math.sin(theta+r[1]*.00072));
 function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(container);resize();
 function setView(value){view=value;lastView='';freeCamera=false;controls.enabled=value!=='dock';controls.minDistance=value==='orbit'?4.2:.4;controls.maxDistance=value==='orbit'?23:500;}
 controls.addEventListener('start',()=>{freeCamera=true;});
 function positionLabel(el,point,offsetX=12,offsetY=-9){const p=point.clone().project(camera);el.style.left=((p.x*.5+.5)*container.clientWidth+offsetX)+'px';el.style.top=((-p.y*.5+.5)*container.clientHeight+offsetY)+'px';el.style.display=p.z>1||Math.abs(p.x)>.95||Math.abs(p.y)>.95?'none':'flex';}
 function update(state,dv,realTime){
  theta=.78+state.time*.000035;earth.rotation.y=earthAngle+state.time*.00002;
  orbitWorld.visible=view==='orbit';closeWorld.visible=view!=='orbit';ambient.intensity=state.mission==='night'&&view!=='orbit'?.35:1.4;
  const newKey=dv.join(',')+state.r.map(x=>x.toFixed(0)).join(',')+state.v.map(x=>x.toFixed(2)).join(',');
  if(newKey!==lastPlan){const points=predict(state,dv).map(worldPosition);planLine.geometry.dispose();planLine.geometry=new THREE.BufferGeometry().setFromPoints(points);planLine.computeLineDistances();lastPlan=newKey;}
  station.position.copy(worldPosition([0,0,0]));station.rotation.y=-theta+Math.PI/2;craft.position.copy(worldPosition(state.r));craft.rotation.set(state.pitch*Math.PI/180,-theta+state.yaw*Math.PI/180,0);flame.visible=state.thrust>.02;flame.scale.set(1,Math.max(.2,state.thrust)*(1+Math.sin(realTime*.05)*.12),1);
  closeCraft.position.set(state.r[0],state.r[2],-state.r[1]);closeCraft.rotation.set(state.pitch*Math.PI/180,state.yaw*Math.PI/180,0);
  if(view==='orbit'){
   if(lastView!==view){camera.position.set(7.9,5.2,10.2);controls.target.set(0,0,0);controls.update();}
   positionLabel(document.getElementById('station-label'),station.getWorldPosition(new THREE.Vector3()),16,-11);positionLabel(document.getElementById('craft-label'),craft.getWorldPosition(new THREE.Vector3()),12,7);
  }else{
   if(view==='dock'){
    const pos=closeCraft.position;const eye=new THREE.Vector3(pos.x,pos.y,pos.z+.6);camera.position.copy(eye);const direction=new THREE.Vector3(Math.sin(state.yaw*Math.PI/180)*-1,Math.sin(state.pitch*Math.PI/180),-Math.cos(state.yaw*Math.PI/180));camera.lookAt(eye.clone().add(direction));closeCraft.visible=false;
   }else{
    closeCraft.visible=true;if(!freeCamera||lastView!==view){const z=closeCraft.position.z;camera.position.set(closeCraft.position.x+9,closeCraft.position.y+6,z+13);controls.target.copy(closeCraft.position).lerp(new THREE.Vector3(0,0,0),.12);}
   }
   document.getElementById('craft-label').style.display='none';positionLabel(document.getElementById('station-label'),new THREE.Vector3(0,0,0),20,-24);
  }
  if(view!=='dock')controls.update();lastView=view;renderer.render(scene,camera);
 }
 return{update,setView,resetCamera:()=>setView(view),getView:()=>view,renderer};
}
