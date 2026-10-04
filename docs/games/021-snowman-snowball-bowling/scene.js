import * as THREE from './vendor/three.module.min.js';
import * as CANNON from './vendor/cannon-es.js';

export class SnowScene {
  constructor(container,callbacks={}) {
    this.callbacks=callbacks;this.pins=[];this.particles=[];this.obstacles=[];this.rings=[];this.time=0;this.ball=null;this.wind=0;this.spin=0;this.thrown=false;this.burstDone=false;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#dbe7e4');this.scene.fog=new THREE.Fog('#dbe7e4',48,125);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.18;container.appendChild(this.renderer.domElement);
    this.camera=new THREE.PerspectiveCamera(36,1,.1,200);
    this.scene.add(new THREE.HemisphereLight(0xe6faff,0xa1b0a1,2.4));
    const sun=new THREE.DirectionalLight(0xffdfb8,4);sun.position.set(-20,32,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=35;sun.shadow.camera.bottom=-35;sun.shadow.camera.far=110;sun.shadow.normalBias=.04;sun.shadow.bias=-.0003;sun.shadow.radius=4;this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(0xeaf5ec,.35));
    this.materials={snow:this.mat('#f4f8f3',.93),ice:this.mat('#a4c9ce',.21,.15),wood:this.mat('#775e4b'),dark:this.mat('#314a4c'),orange:this.mat('#e66f48'),green:this.mat('#577969'),pin:this.mat('#fffdf5',.38),red:this.mat('#dc704f')};
    this.world=new CANNON.World({gravity:new CANNON.Vec3(0,-9.82,0)});this.world.allowSleep=true;this.world.solver.iterations=16;this.world.broadphase=new CANNON.SAPBroadphase(this.world);
    this.world.addEventListener('preStep',()=>{if(this.thrown&&this.ball){const b=this.ball.body;if(b.position.z>-18&&Math.abs(b.position.x)<3.65)b.force.x+=(this.spin*1.25+this.wind)*b.mass;}});
    this.floorMat=new CANNON.Material('ice');this.pinMat=new CANNON.Material('pin');this.ballMat=new CANNON.Material('ball');
    this.world.addContactMaterial(new CANNON.ContactMaterial(this.floorMat,this.pinMat,{friction:.28,restitution:.05}));
    this.world.addContactMaterial(new CANNON.ContactMaterial(this.floorMat,this.ballMat,{friction:.022,restitution:.08}));
    this.world.addContactMaterial(new CANNON.ContactMaterial(this.pinMat,this.ballMat,{friction:.12,restitution:.38}));
    this.world.addContactMaterial(new CANNON.ContactMaterial(this.pinMat,this.pinMat,{friction:.18,restitution:.18}));
    const floor=new CANNON.Body({mass:0,material:this.floorMat,shape:new CANNON.Box(new CANNON.Vec3(60,.5,80)),position:new CANNON.Vec3(0,-.35,0)});this.world.addBody(floor);
    this.buildEnvironment();this.buildLane();this.buildSnowman();this.buildGuide();this.makeSnow();this.resetPins();this.setBall('snow');this.resize();
    window.addEventListener('resize',()=>this.resize());
  }
  mat(color,roughness=.85,metalness=0){return new THREE.MeshStandardMaterial({color,roughness,metalness});}
  mesh(geometry,material,x=0,y=0,z=0,parent=this.scene){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  box(w,h,d,mat,x,y,z,parent){return this.mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z,parent);}
  sphere(r,mat,x,y,z,parent,segments=24){return this.mesh(new THREE.SphereGeometry(r,segments,16),mat,x,y,z,parent);}
  cylinder(rt,rb,h,mat,x,y,z,parent,segments=24){return this.mesh(new THREE.CylinderGeometry(rt,rb,h,segments),mat,x,y,z,parent);}
  rod(a,b,r,mat,parent=this.scene){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),d=vb.clone().sub(va);const m=this.cylinder(r,r,d.length(),mat,0,0,0,parent,8);m.position.copy(va.add(vb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
  buildEnvironment(){
    this.box(220,.6,220,this.materials.snow,0,-.36,-25);
    const hillMat=this.mat('#e4eeeb');
    for(const [x,z,s] of [[-28,-26,13],[27,-32,16],[-47,-50,24],[4,-66,25],[48,-55,26],[-15,-85,32]]){const mountain=this.mesh(new THREE.ConeGeometry(s,s*1.35,5),hillMat,x,s*.55-2,z);mountain.rotation.y=x;const cap=this.mesh(new THREE.ConeGeometry(s*.62,s*.84,5),this.materials.snow,x,s*.93-2,z);cap.rotation.y=x;}
    for(let i=0;i<12;i++){const x=-35+i*6.2;const z=-30-Math.sin(i*7)*5;this.pine(x,z,2.8+((i*31)%10)/7);}
    for(const [x,z,s]of[[-13,7,2.6],[-15,-1,3.5],[-18,-12,3],[12,5,2.2],[16,-3,3.3],[13,-15,3.8],[-9,-21,2.1],[7,-26,3.2],[22,13,3.3],[-24,16,3.7]])this.pine(x,z,s);
    for(const [x,z,s]of[[-9,13,1.1],[9,10,.8],[9,-20,1.2],[-12,-16,1.4],[17,-17,1.2],[-16,4,.7]]){const rock=this.mesh(new THREE.DodecahedronGeometry(s,0),this.mat('#b6c7c5'),x,.3,z);rock.scale.y=.6;this.sphere(s*.76,this.materials.snow,x,.58,z).scale.y=.32;}
    this.cabin(-12,-9);this.fence();
    this.textSign('SNOWBOWL',-1,3.8,-22,4.5,.85,'#385751','#fff8e5');
    for(const x of [-3.2,3.2]){this.cylinder(.08,.1,4.3,this.materials.wood,x,2,-22,undefined,10);this.sphere(.16,this.materials.snow,x,4.2,-22);}
    this.rod([-11,5.8,-3],[9,5.5,-20],.025,this.materials.dark);
    for(let i=0;i<15;i++){const t=i/14,x=-11+20*t,z=-3-17*t,y=5.8-.3*t-Math.sin(t*Math.PI)*.9;this.rod([x,y+.12,z],[x,y-.16,z],.013,this.materials.dark);this.sphere(.08,new THREE.MeshStandardMaterial({color:0xffd494,emissive:0xffc171,emissiveIntensity:1.4}),x,y-.2,z,undefined,8);}
    const bench=new THREE.Group();bench.position.set(8,0,7);this.scene.add(bench);this.box(3,.17,1,this.materials.wood,0,.95,0,bench);this.box(3,.65,.16,this.materials.wood,0,1.6,-.43,bench);this.box(3,.1,.9,this.materials.snow,0,1.08,0,bench);for(const x of[-1,1])this.box(.16,1,.7,this.materials.dark,x,.5,0,bench);
  }
  pine(x,z,s){const group=new THREE.Group();group.position.set(x,0,z);this.scene.add(group);this.cylinder(.11*s,.15*s,1.1*s,this.materials.wood,0,.55*s,0,group,6);for(let i=0;i<3;i++){const r=(1-i*.23)*s,h=1.45*s,y=.9*s+i*.65*s;this.mesh(new THREE.ConeGeometry(r,h,7),this.materials.green,0,y,0,group);this.mesh(new THREE.ConeGeometry(r*.93,h*.86,7),this.materials.snow,0,y+h*.12,0,group);}return group;}
  cabin(x,z){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=.25;this.scene.add(g);const wood=this.mat('#987a60');this.box(5,3.7,4.5,wood,0,1.85,0,g);for(let i=0;i<9;i++)this.box(5.12,.1,4.6,this.mat('#82674f'),0,.35+i*.39,0,g);const roof=new THREE.Mesh(new THREE.ConeGeometry(4.5,2.5,4),this.materials.dark);roof.rotation.y=Math.PI/4;roof.scale.z=.9;roof.position.y=4.5;roof.castShadow=true;g.add(roof);const snowy=roof.clone();snowy.material=this.materials.snow;snowy.scale.multiplyScalar(1.015);snowy.position.y+=.2;g.add(snowy);const glow=new THREE.MeshStandardMaterial({color:'#ffe3a6',emissive:'#ffc776',emissiveIntensity:.9});this.box(1.05,1.65,.06,this.materials.dark,0,1.1,2.3,g);for(const wx of[-1.55,1.55]){this.box(.95,1.13,.08,glow,wx,2,2.34,g);this.box(.07,1.2,.13,this.materials.wood,wx,2,2.4,g);this.box(1.03,.08,.13,this.materials.wood,wx,2,2.4,g);this.box(1.3,.1,.35,this.materials.snow,wx,1.4,2.42,g);}this.box(.7,1.8,.7,this.mat('#8c9187'),1.3,5,0,g);this.box(.85,.14,.85,this.materials.snow,1.3,5.95,0,g);this.box(2,.2,1,this.materials.wood,0,.1,2.7,g);}
  fence(){for(let i=0;i<9;i++){const x=-17+i*4;this.box(.14,1.1,.14,this.materials.wood,x,.55,-24);this.sphere(.17,this.materials.snow,x,1.1,-24);}for(const y of[.45,.88])this.box(32,.13,.12,this.materials.wood,-1,y,-24);}
  textSign(text,x,y,z,w,h,bg,fg){const c=document.createElement('canvas');c.width=768;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle=fg;ctx.lineWidth=2;ctx.strokeRect(10,10,748,140);ctx.font='bold 83px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=fg;ctx.fillText(text,384,84);const m=this.mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c),roughness:.85}),x,y,z);return m;}
  buildLane(){
    this.box(8.8,.3,32,this.mat('#adc6c7'),0,-.04,-3);
    this.box(7.3,.09,31.6,this.materials.ice,0,.05,-3);this.box(6.9,.024,31.2,this.mat('#c2dade',.15,.1),0,.11,-3);
    for(const x of[-4.1,4.1]){this.box(.58,.2,32.5,this.mat('#8caaa9'),x,.05,-3);this.box(.23,.35,32.7,this.materials.wood,x+Math.sign(x)*.31,.16,-3);this.box(.4,.1,32.85,this.materials.snow,x+Math.sign(x)*.31,.38,-3);}
    this.box(7.3,.03,.13,this.materials.orange,0,.132,8.5);
    for(let i=-3;i<=3;i++){const arrow=new THREE.Shape();arrow.moveTo(-.09,.18);arrow.lineTo(.09,.18);arrow.lineTo(0,-.13);arrow.closePath();const m=this.mesh(new THREE.ShapeGeometry(arrow),this.mat('#80a5ac'),i*.68,.133,1.8+Math.abs(i)*.32);m.rotation.x=-Math.PI/2;}
    for(const x of[-2.8,-1.4,0,1.4,2.8])this.cylinder(.035,.035,.01,this.mat('#85a9b1'),x,.134,6.5,undefined,8);
    const mat=new THREE.MeshBasicMaterial({color:0xe2eff1,transparent:true,opacity:.33});for(let i=0;i<14;i++){const m=this.box(.012,.005,5+(i*7)%12,mat,-3.3+i*.5,.139,-4+(i*3)%5);m.rotation.y=.006;}
    this.box(9,.7,.9,this.materials.wood,0,.28,-19.4);this.box(9.2,.18,1.1,this.materials.snow,0,.7,-19.4);
    this.box(8.7,.2,3.5,this.mat('#cfddda'),0,-.01,14.7);
  }
  buildSnowman(){
    const g=new THREE.Group();g.position.set(-5.5,0,9);g.rotation.y=.48;this.scene.add(g);this.snowman=g;
    this.sphere(.91,this.materials.snow,0,.85,0,g);this.sphere(.7,this.materials.snow,0,2.02,0,g);this.sphere(.56,this.materials.snow,0,3.06,0,g);
    const scarf=this.mesh(new THREE.TorusGeometry(.52,.135,8,32),this.materials.orange,0,2.61,0,g);scarf.rotation.x=Math.PI/2;const tail=this.box(.29,.83,.14,this.materials.orange,-.28,2.18,.61,g);tail.rotation.z=-.13;
    for(let i=0;i<3;i++)this.sphere(.065,this.materials.dark,.02,2.26-i*.28,.67,g,12);
    for(const x of[-.17,.17])this.sphere(.055,this.materials.dark,x,3.17,.51,g,12);
    const nose=this.mesh(new THREE.ConeGeometry(.085,.47,12),this.mat('#ef9b43'),0,3.02,.69,g);nose.rotation.x=Math.PI/2;
    for(let i=0;i<5;i++){const t=i/4*Math.PI;this.sphere(.025,this.materials.dark,-.2+ i*.1,2.89-Math.sin(t)*.07,.5,g,8);}
    this.cylinder(.67,.67,.11,this.materials.dark,0,3.53,0,g);this.cylinder(.4,.45,.62,this.materials.dark,0,3.84,0,g);this.cylinder(.415,.435,.14,this.materials.orange,0,3.6,0,g);this.sphere(.25,this.materials.snow,-.18,4.17,.02,g).scale.y=.3;
    this.leftArm=new THREE.Group();this.leftArm.position.set(-.56,2.15,0);g.add(this.leftArm);this.rod([0,0,0],[-.8,.35,.1],.045,this.materials.wood,this.leftArm);this.rod([-.7,.3,.1],[-.93,.7,.11],.025,this.materials.wood,this.leftArm);this.rod([-.7,.3,.1],[-1.1,.3,.11],.025,this.materials.wood,this.leftArm);
    this.rightArm=new THREE.Group();this.rightArm.position.set(.56,2.18,0);g.add(this.rightArm);this.rod([0,0,0],[.8,.12,.4],.05,this.materials.wood,this.rightArm);this.rod([.65,.1,.34],[.92,.45,.4],.025,this.materials.wood,this.rightArm);this.sphere(.25,this.materials.snow,.88,.15,.43,this.rightArm);
    for(let i=0;i<5;i++){const m=this.sphere(.2,this.mat('#b9cfcc'),-5.5+i*.45,.025,11+i*.3,undefined,12);m.scale.set(.7,.1,1.3);}
  }
  buildGuide(){this.guide=new THREE.Group();this.scene.add(this.guide);const mat=new THREE.MeshBasicMaterial({color:0xed7950,transparent:true,opacity:.67});for(let i=0;i<32;i++){const d=this.mesh(new THREE.SphereGeometry(.065,8,6),mat,0,.18,0,this.guide);d.scale.y=.35;}this.targetRing=this.mesh(new THREE.TorusGeometry(.28,.024,6,32),mat,0,.16,-5,this.guide);this.targetRing.rotation.x=Math.PI/2;}
  updateGuide(aim,spin,x){this.aim=aim;this.spin=spin;this.startX=x;if(!this.thrown&&this.ball){this.ball.body.position.x=x;this.ball.mesh.position.x=x;}const a=aim*Math.PI/180;for(let i=0;i<32;i++){const z=8.7-i*.48,t=(8.7-z)/16;const d=this.guide.children[i];d.position.set(x+Math.sin(a)*(8.7-z)+spin*.68*t*t,.19,z);d.visible=Math.abs(d.position.x)<3.55;}this.targetRing.position.set(x+Math.sin(a)*15.6+spin*.68,.19,-6.9);}
  makePin(x,z,id){const group=new THREE.Group();this.scene.add(group);const p=[new THREE.Vector2(.18,-.65),new THREE.Vector2(.26,-.6),new THREE.Vector2(.3,-.35),new THREE.Vector2(.28,-.11),new THREE.Vector2(.19,.12),new THREE.Vector2(.115,.31),new THREE.Vector2(.12,.43),new THREE.Vector2(.19,.53),new THREE.Vector2(.2,.64),new THREE.Vector2(.145,.76),new THREE.Vector2(.02,.8)];this.mesh(new THREE.LatheGeometry(p,24),this.materials.pin,0,0,0,group);for(const y of[.3,.39])this.cylinder(.128,.128,.055,this.materials.red,0,y,0,group);
    const body=new CANNON.Body({mass:1.4,material:this.pinMat,position:new CANNON.Vec3(x,.8,z),linearDamping:.24,angularDamping:.27,sleepSpeedLimit:.12,sleepTimeLimit:.6});body.addShape(new CANNON.Cylinder(.18,.26,.75,12),new CANNON.Vec3(0,-.275,0));body.addShape(new CANNON.Sphere(.18),new CANNON.Vec3(0,.6,0));body.addShape(new CANNON.Cylinder(.1,.17,.5,8),new CANNON.Vec3(0,.26,0));this.world.addBody(body);const pin={id,mesh:group,body,x,z,down:false,tiltTime:0};this.pins.push(pin);return pin;
  }
  resetPins(layout=0){for(const p of this.pins){this.world.removeBody(p.body);this.scene.remove(p.mesh);}this.pins=[];let id=0;for(let row=0;row<4;row++)for(let col=0;col<=row;col++){let x=(col-row/2)*.89,z=-12-row*.87;if(layout===3){x*=1.45;z-=.3;}this.makePin(x,z,id++);}this.callbacks.onPins?.(this.pins);}
  removeDown(){this.pins=this.pins.filter(p=>{if(p.down){this.scene.remove(p.mesh);this.world.removeBody(p.body);return false;}p.body.velocity.setZero();p.body.angularVelocity.setZero();p.body.force.setZero();p.body.torque.setZero();p.body.quaternion.set(0,0,0,1);p.body.position.y=.8;p.x=p.body.position.x;p.z=p.body.position.z;p.tiltTime=0;p.body.sleep();return true;});this.sync();}
  setBall(type,x=this.startX||0){if(this.ball){this.world.removeBody(this.ball.body);this.scene.remove(this.ball.mesh);}this.ballType=type;const r=type==='heavy'?.55:.39;const material=type==='heavy'?this.mat('#b3d8e5',.3,.08):type==='burst'?this.mat('#ffe2b9',.5):this.materials.snow;const group=new THREE.Group();this.scene.add(group);this.sphere(r,material,0,0,0,group,32);for(let i=0;i<12;i++){const u=i*2.399,y=1-2*(i+.5)/12,s=Math.sqrt(1-y*y);const dot=this.sphere(.025,this.mat(type==='burst'?'#fffae8':'#dae8e7'),Math.cos(u)*s*r,y*r,Math.sin(u)*s*r,group,6);dot.castShadow=false;}
    const body=new CANNON.Body({mass:type==='heavy'?11:6,material:this.ballMat,shape:new CANNON.Sphere(r),position:new CANNON.Vec3(x,r+.15,9),linearDamping:.01,angularDamping:.03});this.world.addBody(body);this.ball={body,mesh:group,r};this.thrown=false;this.burstDone=false;body.type=CANNON.Body.KINEMATIC;body.addEventListener('collide',e=>{const p=this.pins.find(p=>p.body===e.body);if(p){this.callbacks.onHit?.(Math.abs(e.contact.getImpactVelocityAlongNormal()));if(type==='burst'&&!this.burstDone){this.burstDone=true;const pos=body.position.clone();for(const pin of this.pins){const d=pin.body.position.vsub(pos),len=d.length();if(len<4.2){d.normalize();pin.body.wakeUp();pin.body.applyImpulse(d.scale((4.2-len)*2.8),new CANNON.Vec3(0,.25,0));}}this.puff(pos.x,pos.y,pos.z,45,'#ffe6ba',2);}}});this.sync();}
  launch(power,aim,spin,x){this.updateGuide(aim,spin,x);const b=this.ball.body,a=aim*Math.PI/180;const speed=(12+power*12)*(this.ballType==='heavy'?.88:1);b.type=CANNON.Body.DYNAMIC;b.updateMassProperties();b.wakeUp();b.velocity.set(Math.sin(a)*speed,0,-Math.cos(a)*speed);b.angularVelocity.set(-speed/this.ball.r,spin*6,0);this.thrown=true;this.shotAge=0;this.guide.visible=false;this.puff(x,.35,9,13,'#f6fffe',.65);this.armShot=0;}
  setChallenge(level){for(const ob of this.obstacles){this.scene.remove(ob.mesh);this.world.removeBody(ob.body);}this.obstacles=[];for(const r of this.rings)this.scene.remove(r.mesh);this.rings=[];this.wind=level===2?.24:level===4?-.32:0;
    const blocks=level===1?[[-1.6,-3,.75],[1.8,-6,.8]]:level===3?[[-1.2,-1,.7],[1.25,-5,.7]]:level===4?[[0,-4,1]]:[];
    for(const[x,z,w]of blocks){const mesh=this.box(w*1.3,.9,1.25,this.mat('#95bcca',.14,.1),x,.46,z);mesh.rotation.y=.15;this.box(w*1.35,.12,1.3,this.materials.snow,0,.47,0,mesh);const body=new CANNON.Body({mass:0,material:this.pinMat,shape:new CANNON.Box(new CANNON.Vec3(w*.65,.45,.625)),position:new CANNON.Vec3(x,.46,z)});body.quaternion.setFromEuler(0,.15,0);this.world.addBody(body);this.obstacles.push({mesh,body,baseX:x,moving:level===3});}
    if(level>=0){const x=level===4?-1.7:level===1?.6:0;const mesh=this.mesh(new THREE.TorusGeometry(.87,.065,8,48),new THREE.MeshStandardMaterial({color:0xeaaa4c,emissive:0xeb9428,emissiveIntensity:.3}),x,.82,-7);this.rings.push({mesh,x,z:-7,hit:false});}
  }
  puff(x,y,z,count=20,color='#fffaf0',strength=1){const mat=this.mat(color);for(let i=0;i<count;i++){const mesh=this.sphere(.025+Math.random()*.065,mat,x,y,z,undefined,6);mesh.castShadow=false;this.particles.push({mesh,v:new THREE.Vector3((Math.random()-.5)*6*strength,Math.random()*5*strength+1,(Math.random()-.5)*6*strength),life:1+Math.random()*.8,max:1.8});}}
  celebrate(){for(let i=0;i<3;i++)this.puff((i-1)*2,2,-13,23,i%2?'#ec8354':'#fff6e3',1.3);this.celebrateTime=2;}
  makeSnow(){const n=260,points=new Float32Array(n*3);for(let i=0;i<n;i++){points[i*3]=(Math.random()-.5)*55;points[i*3+1]=Math.random()*19;points[i*3+2]=(Math.random()-.5)*60;}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(points,3));this.snow=this.mesh(geo,new THREE.PointsMaterial({color:0xffffff,size:.045,transparent:true,opacity:.8}));this.scene.remove(this.snow);this.snow=new THREE.Points(geo,new THREE.PointsMaterial({color:0xffffff,size:.055,transparent:true,opacity:.72}));this.scene.add(this.snow);}
  resize(){const w=innerWidth,h=Math.max(innerHeight,innerWidth<=760?790:740);this.renderer.setSize(w,h);this.camera.aspect=w/h;if(w<=760){this.camera.position.set(9,31,41);this.camera.fov=48;this.camera.lookAt(-1,0,-1);}else{this.camera.position.set(21,23,34);this.camera.fov=w/h>1.8?33:36;this.camera.lookAt(0,.3,-2);}this.camera.updateProjectionMatrix();}
  update(dt,paused,physicsActive=true){if(paused){this.renderer.render(this.scene,this.camera);return;}this.time+=dt;
    if(this.thrown){this.shotAge+=dt;const b=this.ball.body;if(Math.abs(b.position.x)>3.65&&b.position.z<8.5){b.velocity.x*=Math.pow(.7,dt*60);b.position.x=Math.sign(b.position.x)*Math.min(Math.abs(b.position.x),4.08);b.velocity.z*=Math.pow(.995,dt*60);}for(const r of this.rings){if(!r.hit&&b.position.z<r.z&&b.position.z>r.z-1.3&&Math.abs(b.position.x-r.x)<.83){r.hit=true;r.mesh.visible=false;this.callbacks.onRing?.();this.puff(r.x,1,r.z,18,'#ffd18d',.8);}}}
    for(const ob of this.obstacles)if(ob.moving&&physicsActive){ob.body.position.x=ob.baseX+Math.sin(this.time*1.1)*.7;ob.body.aabbNeedsUpdate=true;ob.mesh.position.x=ob.body.position.x;}
    if(physicsActive)this.world.step(1/120,Math.min(dt,.05),8);
    if(physicsActive)for(const p of this.pins){const up=new CANNON.Vec3();p.body.quaternion.vmult(new CANNON.Vec3(0,1,0),up);if(up.y<.72||Math.hypot(p.body.position.x-p.x,p.body.position.z-p.z)>.75)p.tiltTime+=dt;else p.tiltTime=0;if(!p.down&&p.tiltTime>.18){p.down=true;this.callbacks.onPinDown?.(p);}}
    this.sync();
    const s=this.snow.geometry.attributes.position;for(let i=0;i<s.count;i++){s.array[i*3+1]-=dt*(.4+(i%5)*.08);s.array[i*3]+=dt*(.12+this.wind*.5);if(s.array[i*3+1]<0)s.array[i*3+1]=19;}s.needsUpdate=true;
    for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.life-=dt;p.v.y-=6*dt;p.mesh.position.addScaledVector(p.v,dt);p.mesh.scale.setScalar(Math.max(.01,p.life/p.max));if(p.life<=0){this.scene.remove(p.mesh);p.mesh.geometry.dispose();this.particles.splice(i,1);}}
    this.snowman.position.y=Math.sin(this.time*1.5)*.026;this.leftArm.rotation.z=Math.sin(this.time*1.3)*.07;if(this.armShot!==undefined&&this.armShot<1){this.armShot+=dt*2;this.rightArm.rotation.x=Math.sin(this.armShot*Math.PI)*-1.5;}else this.rightArm.rotation.x=Math.sin(this.time)*.05;
    if(this.celebrateTime>0){this.celebrateTime-=dt;this.leftArm.rotation.z=-.7;this.rightArm.rotation.z=.7;this.snowman.position.y=Math.abs(Math.sin(this.time*8))*.2;}else this.rightArm.rotation.z=0;
    for(const r of this.rings)if(!r.hit){r.mesh.rotation.z=this.time*.3;r.mesh.material.emissiveIntensity=.3+Math.sin(this.time*3)*.15;}
    this.renderer.render(this.scene,this.camera);
  }
  sync(){for(const p of this.pins){p.mesh.position.copy(p.body.position);p.mesh.quaternion.copy(p.body.quaternion);}if(this.ball){this.ball.mesh.position.copy(this.ball.body.position);this.ball.mesh.quaternion.copy(this.ball.body.quaternion);}}
}
