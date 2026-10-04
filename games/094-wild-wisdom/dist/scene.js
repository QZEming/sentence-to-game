import * as THREE from './vendor/three.module.js';
export function createArena(container,onPick){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,150),renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;container.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xeafff6,0x749567,1.8));
 const sun=new THREE.DirectionalLight(0xfff2d2,2.5);sun.position.set(-7,15,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-15,right:15,top:15,bottom:-15,near:1,far:45});sun.shadow.normalBias=.045;scene.add(sun);
 const fill=new THREE.DirectionalLight(0xd0fffe,.8);fill.position.set(7,6,-7);scene.add(fill);
 const world=new THREE.Group();scene.add(world);const mats={};
 const mat=c=>mats[c]??=new THREE.MeshStandardMaterial({color:c,roughness:.78});
 function mesh(geo,c,p=world,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;p.add(m);return m;}
 function sphere(c,p,x,y,z,sx,sy=sx,sz=sx){const m=mesh(new THREE.SphereGeometry(1,24,16),c,p,x,y,z);m.scale.set(sx,sy,sz);return m;}
 const cyl=(rt,rb,h,c,p=world,x=0,y=0,z=0,n=48)=>mesh(new THREE.CylinderGeometry(rt,rb,h,n),c,p,x,y,z);
 const box=(w,h,d,c,p=world,x=0,y=0,z=0)=>mesh(new THREE.BoxGeometry(w,h,d),c,p,x,y,z);
 const cone=(r,h,c,p=world,x=0,y=0,z=0,n=5)=>mesh(new THREE.ConeGeometry(r,h,n),c,p,x,y,z);
 function ring(r,t,c,p=world,x=0,y=0,z=0){const m=mesh(new THREE.TorusGeometry(r,t,8,64),c,p,x,y,z);m.rotation.x=Math.PI/2;return m;}
 cyl(7.2,6.7,.65,0xb9c999,world,0,-.6,0,80);cyl(7.3,7.25,.25,0x91b883,world,0,-.18,0,80);cyl(7.08,7.08,.07,0xbacf94,world,0,-.02,0,80);
 cyl(6.7,5.35,1.05,0xd0bd96,world,0,-1.35,0,13);cyl(5.5,3.1,1.7,0xa99878,world,0,-2.65,0,11);cone(3.65,2.3,0x83917a,world,0,-4.28,0,9).rotation.z=Math.PI;
 ring(7.25,.075,0xe0ddab,world,0,-.1,0);ring(6.97,.035,0xebefc5,world,0,.045,0);cyl(4.55,4.55,.05,0xc4d5ad,world,0,.01,0,64);ring(4.45,.047,0xe5e6c3,world,0,.06,0);ring(3.78,.032,0xe8e7c8,world,0,.07,0);
 for(let i=0;i<28;i++){const a=i*Math.PI*2/28;box(.065,.017,.2,0xecedcf,world,Math.sin(a)*4.13,.08,Math.cos(a)*4.13).rotation.y=a;}
 for(let i=0;i<7;i++){const a=i*2.399;mesh(new THREE.IcosahedronGeometry(.5,0),0x9dba91,world,Math.sin(a)*6.6,-1.8-Math.random()*1.5,Math.cos(a)*6.6).scale.y=.8;}
 const monument=new THREE.Group();world.add(monument);cyl(1.3,1.45,.26,0xe4d9b6,monument,0,.17,0,8);cyl(1.15,1.23,.34,0xe9e1c6,monument,0,.44,0,8);cyl(.78,.95,.52,0xd6cba3,monument,0,.86,0,8);ring(.9,.055,0xffdc92,monument,0,1.14,0);
 const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.81,0),new THREE.MeshPhysicalMaterial({color:0x73dfbc,metalness:.15,roughness:.16,transmission:.25,thickness:1,emissive:0x40d6a2,emissiveIntensity:.35}));gem.scale.set(.7,1.45,.7);gem.position.y=2.05;gem.castShadow=true;monument.add(gem);const magicRing=ring(1.07,.035,0xffe5a4,monument,0,1.85,0);magicRing.rotation.z=.23;
 const gl=new THREE.PointLight(0x62ffbe,12,7);gl.position.set(0,2,0);monument.add(gl);
 function tree(x,z,s,c){const g=new THREE.Group();world.add(g);g.position.set(x,.03,z);g.scale.setScalar(s);cyl(.19,.29,2.3,0x9e9170,g,0,1.05,0,9).rotation.z=.06;cyl(.09,.15,1.1,0x9e9170,g,.3,1.7,0,7).rotation.z=-.8;for(const [a,b,d,r]of [[0,2.6,0,1.12],[-.57,2.22,.1,.74],[.65,2.36,-.08,.84],[.12,3.27,.05,.74]])mesh(new THREE.IcosahedronGeometry(r,2),c,g,a,b,d).scale.y=.93;}
 tree(-5.2,-2.6,1.22,0x719e71);tree(5.35,-2.8,1.07,0x79aa7a);tree(-3.7,-5.3,.92,0x96b57a);tree(2.7,-5.3,1.04,0x78a17a);
 function pine(x,z,s){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);world.add(g);cyl(.1,.16,1.9,0xb5a181,g,0,.8,0,7);for(let j=0;j<3;j++)cone(.83-j*.15,1.3,0x80ad98,g,0,1.2+j*.55,0,8);}
 pine(-6.3,.2,.8);pine(6.1,-.3,.9);pine(.8,-6.3,.7);
 for(const x of [-2.1,2.1]){cyl(.32,.37,2.5,0xd2d4af,world,x,1.3,-5.3,8);cyl(.48,.48,.22,0xe7dfb9,world,x,2.65,-5.3,8);sphere(0xaad4b6,world,x,2.94,-5.3,.2);}
 mesh(new THREE.TorusGeometry(2.1,.2,8,32,Math.PI),0xdad9b7,world,0,2.64,-5.3);
 for(let i=0;i<8;i++){const a=Math.PI*i/7;sphere(0x9ebd85,world,Math.cos(a)*2.12,2.72+Math.sin(a)*2.1,-5.23,.23,.17,.23);}
 function shrub(x,z,s){const g=new THREE.Group();g.position.set(x,.08,z);g.scale.setScalar(s);world.add(g);for(let i=0;i<3;i++)mesh(new THREE.IcosahedronGeometry(.43,1),[0x87b683,0xa8c994,0x749f79][i],g,(i-1)*.35,.25,i%2*.18).scale.y=.7;}
 for(const [x,z,s]of [[-5,2.4,1.1],[5.2,1.8,.9],[-2.9,5.6,.8],[3.5,4.8,1],[.4,6,.7],[-4.8,-4,1]])shrub(x,z,s);
 function mushroom(x,z,s){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);world.add(g);cyl(.07,.1,.35,0xf4e8d4,g,0,.2,0,8);sphere(0xe0a294,g,0,.43,0,.29,.16,.29);for(let i=0;i<4;i++){const a=i*2.4;sphere(0xf3ddbb,g,Math.cos(a)*.15,.56,Math.sin(a)*.15,.035,.012,.035);}}
 for(const [x,z,s]of [[-5.2,2.9,1],[-5.65,2.65,.6],[4.9,3.4,.8],[5.25,3.7,.5],[-1,5.8,.7]])mushroom(x,z,s);
 for(let i=0;i<65;i++){const a=i*2.4,rad=4.8+Math.random()*1.8,x=Math.cos(a)*rad,z=Math.sin(a)*rad;if(z<-3)continue;box(.023,.14,.023,0x789f67,world,x,.1,z);sphere([0xefead0,0xecc8c3,0xd6c3dc,0xefdf95][i%4],world,x,.19,z,.07,.042,.07);}
 for(let i=0;i<7;i++){const p=cyl(.22,.27,.07,0xdbd8bd,world,(Math.random()-.5)*1.5,.085,4.4+i*.29,6);p.scale.x=1.3;p.rotation.y=Math.random();}
 const animals=[],podiums=[],effects=[],positions=[[-3.1,2.25],[3.1,2.25],[-3.05,-1.8],[3.05,-1.8]];
 function eye(g,x,y,z,s=.083){sphere(0x313e37,g,x,y,z,s,s*1.2,s*.56);sphere(0xffffff,g,x-.018,y+.026,z+s*.5,s*.27);}
 function animal(type){const g=new THREE.Group(),body=new THREE.Group();g.add(body);const skin=[0xdca46f,0xf4ede0,0xe8e9dd,0xb59c7d][type],cloth=[0x6d9b81,0xbb92a3,0x9fab7c,0x8e9eb2][type];
 sphere(cloth,body,0,.59,0,.43,.54,.35);sphere(skin,body,-.24,.15,.08,.2,.13,.25);sphere(skin,body,.24,.15,.08,.2,.13,.25);
 const arm1=sphere(skin,body,-.45,.67,0,.13,.29,.14),arm2=sphere(skin,body,.45,.67,0,.13,.29,.14);arm1.rotation.z=-.3;arm2.rotation.z=.3;
 if(type===0){sphere(skin,body,0,1.34,.03,.57,.48,.47);for(const x of [-.34,.34]){cone(.24,.56,skin,body,x,1.83,0,3).rotation.z=x>0?-.16:.16;cone(.14,.37,0x8c6c59,body,x,1.86,.11,3).rotation.z=x>0?-.16:.16;}sphere(0xf2e5cc,body,-.22,1.15,.35,.3,.23,.23);sphere(0xf2e5cc,body,.22,1.15,.35,.3,.23,.23);eye(body,-.23,1.41,.44,.085);eye(body,.23,1.41,.44,.085);sphere(0x514640,body,0,1.2,.566,.078,.058,.048);sphere(skin,body,.38,.6,-.39,.25,.45,.28).rotation.z=-.75;sphere(0xf3e5cb,body,.62,.86,-.45,.2,.18,.2);cyl(.39,.39,.14,0x4f8570,body,0,.95,0,24);box(.16,.33,.04,0x4f8570,body,.16,.78,.36);}
 else if(type===1){sphere(skin,body,0,1.37,.035,.53,.47,.43);for(const x of [-.24,.24]){sphere(skin,body,x,2.02,0,.15,.5,.12).rotation.z=x>0?-.12:.15;sphere(0xdcb0b4,body,x,2.04,.097,.076,.36,.024).rotation.z=x>0?-.12:.15;}eye(body,-.21,1.4,.42,.072);eye(body,.21,1.4,.42,.072);sphere(0xd1a0a0,body,0,1.23,.475,.052,.044,.04);sphere(0xecd2cc,body,-.31,1.22,.38,.11,.058,.026);sphere(0xecd2cc,body,.31,1.22,.38,.11,.058,.026);sphere(skin,body,0,.51,-.34,.18);ring(.37,.085,0xd6b8c4,body,0,1,0);}
 else if(type===2){sphere(skin,body,0,1.4,.03,.6,.49,.46);sphere(0x526157,body,-.43,1.78,0,.21,.23,.16);sphere(0x526157,body,.43,1.78,0,.21,.23,.16);for(const x of [-.23,.23]){sphere(0x566259,body,x,1.4,.423,.153,.19,.062).rotation.z=x>0?-.3:.3;eye(body,x,1.44,.482,.075);}sphere(0x5e6257,body,0,1.23,.51,.07,.055,.037);sphere(0xe1dfc9,body,0,.66,.31,.24,.32,.06);arm1.material=arm2.material=mat(0x576359);ring(.38,.064,0xb5b775,body,0,.99,0);}
 else{sphere(skin,body,0,1.33,0,.58,.52,.42);for(const x of [-.235,.235]){sphere(0xe9deba,body,x,1.38,.35,.245,.27,.1);sphere(0xcfad6a,body,x,1.4,.445,.119,.129,.045);eye(body,x,1.4,.483,.073);}cone(.105,.21,0xc6924d,body,0,1.2,.45,4).rotation.x=Math.PI/2;cone(.52,.82,0x8e9ab6,body,0,2.02,0,24).rotation.z=-.15;ring(.49,.062,0x7589a4,body,0,1.64,0);sphere(0xe5d99b,body,-.07,2.45,0,.095);for(const x of [-.38,.38])sphere(0x9a896f,body,x,.6,.19,.17,.33,.13).rotation.z=x>0?-.26:.26;}
 sphere(0xe8d495,body,0,.89,.34,.055,.07,.028);g.userData={body,arm1,arm2};return g;}
 positions.forEach(([x,z],i)=>{const p=new THREE.Group();p.position.set(x,.08,z);world.add(p);cyl(1.1,1.16,.23,0xdbd8b8,p,0,.07,0);cyl(.91,1,.38,[0xddb18a,0xd9b6c4,0x97b5a9,0xa7a3c4][i],p,0,.36,0);cyl(1,1,.1,0xf0e6c8,p,0,.58,0);ring(.96,.035,0xfff0c9,p,0,.65,0);const a=animal(i);a.position.y=.68;a.scale.setScalar(1.19);a.rotation.y=.1;a.userData.player=i;p.add(a);animals.push(a);podiums.push(p);});
 const halo=ring(1.13,.047,0xe4ffaa,world,positions[0][0],.08,positions[0][1]);const sparks=[];
 const sparkMat=new THREE.MeshBasicMaterial({color:0xffefb2,transparent:true,opacity:.75});
 for(let i=0;i<38;i++){const s=new THREE.Mesh(new THREE.OctahedronGeometry(.025+Math.random()*.025),sparkMat);s.position.set((Math.random()-.5)*14,Math.random()*4+.5,(Math.random()-.5)*11);s.userData.seed=Math.random()*10;world.add(s);sparks.push(s);}
 const labels=['阿栗','绵绵','竹竹','星咕'].map((n,i)=>{const d=document.createElement('div');d.className='player-label'+(i===0?' mine':'');d.innerHTML=n+' <span>'+(i===0?'你':'AI')+'</span>';document.querySelector('#player-labels').appendChild(d);return d;});
 let angle=.06,targetAngle=.06,drag=false,lastX=0,startX=0,auto=false,selected=0,frame,width=0,height=0;
 const target=new THREE.Vector3(0,.5,0),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
 function resize(){width=container.clientWidth;height=container.clientHeight;if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}
 const observer=new ResizeObserver(resize);observer.observe(container);resize();
 renderer.domElement.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag=true;lastX=startX=e.clientX;renderer.domElement.setPointerCapture(e.pointerId);});
 renderer.domElement.addEventListener('pointermove',e=>{if(drag){targetAngle+=(e.clientX-lastX)*.004;lastX=e.clientX;}});
 renderer.domElement.addEventListener('pointerup',e=>{if(!drag)return;drag=false;if(Math.abs(e.clientX-startX)<5){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(animals,true);if(hits.length){let o=hits[0].object;while(o&&o.userData.player===undefined)o=o.parent;if(o)onPick?.(o.userData.player);}}});
 renderer.domElement.addEventListener('pointercancel',()=>drag=false);
 const clock=new THREE.Clock();let last=0;
 function loop(){frame=requestAnimationFrame(loop);if(document.hidden)return;const t=clock.getElapsedTime();if(reduced&&t-last<.1)return;last=t;if(auto&&!reduced)targetAngle+=.0015;angle+=(targetAngle-angle)*.05;const distance=width/height<1.25?26:21;camera.position.set(Math.sin(angle)*distance,width/height<1.25?15:12.5,Math.cos(angle)*distance);camera.lookAt(target);camera.updateMatrixWorld();
 if(!reduced){gem.rotation.y=t*.45;gem.position.y=2.03+Math.sin(t*1.7)*.13;magicRing.rotation.z=Math.sin(t*.8)*.15;magicRing.rotation.x=Math.PI/2+Math.cos(t*.7)*.15;animals.forEach((a,i)=>{const jump=a.userData.jumpUntil>t?Math.abs(Math.sin((a.userData.jumpUntil-t)*8))*.43:0;a.position.y=.68+Math.sin(t*2+i)*.035+jump;a.rotation.y=.1+Math.sin(t*.7+i*1.5)*.09;a.userData.arm2.rotation.z=.3+Math.sin(t*1.7+i)*.09;});sparks.forEach(s=>{s.position.y+=Math.sin(t+s.userData.seed)*.0018;s.scale.setScalar(.7+Math.sin(t*1.5+s.userData.seed)*.3);});}
 for(let i=effects.length-1;i>=0;i--){const e=effects[i];e.position.add(e.userData.v);e.userData.v.y-=.002;e.rotation.x+=.04;e.scale.multiplyScalar(.981);if(e.scale.x<.04){world.remove(e);e.geometry.dispose();effects.splice(i,1);}}
 halo.position.set(positions[selected][0],.082,positions[selected][1]);scene.updateMatrixWorld();
 podiums.forEach((p,i)=>{const v=new THREE.Vector3(p.position.x,i>=2?3.95:.33,p.position.z+(i>=2?0:.75)).project(camera);labels[i].style.left=(v.x+1)*width/2+'px';labels[i].style.top=((-v.y+1)*height/2+12)+'px';labels[i].style.opacity=v.z>1?'0':'1';});renderer.render(scene,camera);}
 loop();document.querySelector('#scene-loading')?.remove();
 return {select(i){selected=i;labels.forEach((d,k)=>{d.classList.toggle('mine',k===i);d.innerHTML=['阿栗','绵绵','竹竹','星咕'][k]+' <span>'+(k===i?'你':'AI')+'</span>';});},rotate(){return auto=!auto;},celebrate(i,points){animals[i].userData.jumpUntil=clock.getElapsedTime()+1.8;const d=document.createElement('b');d.className='score-float';d.textContent='+'+points;labels[i].appendChild(d);setTimeout(()=>d.remove(),1400);if(reduced)return;for(let j=0;j<22;j++){const e=new THREE.Mesh(new THREE.OctahedronGeometry(.08),mat([0xf5d67d,0x93d7ad,0xe8adc0,0xb2b4de][j%4]));e.position.set(positions[i][0],2.8,positions[i][1]);e.userData.v=new THREE.Vector3((Math.random()-.5)*.14,Math.random()*.14+.04,(Math.random()-.5)*.14);world.add(e);effects.push(e);}},setCrown(i,on){const a=animals[i];if(a.userData.crown){a.userData.crown.visible=on;return;}if(!on)return;const c=new THREE.Group();cyl(.25,.28,.14,0xe3bf64,c,0,0,0,8);for(let j=0;j<5;j++){const r=j*Math.PI*2/5;cone(.075,.17,0xedcd76,c,Math.cos(r)*.22,.12,Math.sin(r)*.22,4);}c.position.set(0,i===1?2.61:i===3?2.58:2.11,0);a.add(c);a.userData.crown=c;c.visible=on;},destroy(){cancelAnimationFrame(frame);observer.disconnect();renderer.dispose();}};
}
