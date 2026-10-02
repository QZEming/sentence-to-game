import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export function createScene(host){
const scene=new THREE.Scene();scene.background=new THREE.Color('#dcece8');scene.fog=new THREE.Fog('#dcece8',24,60);
const camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(10,8.5,15);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1,0);controls.enableDamping=true;controls.minDistance=12;controls.maxDistance=24;controls.minPolarAngle=.3;controls.maxPolarAngle=1.35;controls.enablePan=false;
scene.add(new THREE.HemisphereLight('#ffffff','#a6c6bb',2.6));const sun=new THREE.DirectionalLight('#fff4d9',3.1);sun.position.set(-6,14,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12});sun.shadow.bias=-.0004;scene.add(sun);
const mat=(c,roughness=.85)=>new THREE.MeshStandardMaterial({color:c,roughness});const colors={snow:mat('#fffef1'),ice:mat('#bedee0'),wood:mat('#b78962'),darkwood:mat('#815e43'),green:mat('#6c8670'),coral:mat('#dc8364'),navy:mat('#294a50'),white:mat('#fff9e8'),gold:mat('#eab563'),water:mat('#b4d7d1')};
function mesh(geo,m,x,y,z,parent=scene){const o=new THREE.Mesh(geo,typeof m==='string'?mat(m):m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function box(w,h,d,m,x,y,z,parent){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent)}
function ball(w,h,d,m,x,y,z,parent){const o=mesh(new THREE.SphereGeometry(1,24,16),m,x,y,z,parent);o.scale.set(w,h,d);return o}
function cyl(r1,r2,h,m,x,y,z,parent,n=32){return mesh(new THREE.CylinderGeometry(r1,r2,h,n),m,x,y,z,parent)}
const sea=mesh(new THREE.PlaneGeometry(200,200),colors.water,0,-.65,0);sea.rotation.x=-Math.PI/2;
const island=cyl(6.1,4.5,1.2,colors.ice,0,-.15,0,scene,8);island.rotation.y=.2;const snow=cyl(6.16,6.1,.28,colors.snow,0,.58,0,scene,8);snow.rotation.y=.2;
// Gentle rings around the floating island.
for(let i=0;i<3;i++){const ring=mesh(new THREE.TorusGeometry(6.8+i*1.6,.018,5,90),mat('#d4e8df'),0,-.58,0);ring.rotation.x=-Math.PI/2;ring.scale.y=.87;}
for(let i=0;i<12;i++){let a=i*2.4;const rock=cyl(.35+(i%3)*.15,.5,.25,colors.snow,Math.sin(a)*(8+i%4),-.35,Math.cos(a)*(8+i%3),scene,5);rock.rotation.y=a;}
// Open-front timber sushi shop.
box(6.8,.22,4.2,colors.wood,0,.85,-.65);for(let i=0;i<15;i++)box(.02,.01,4.1,colors.darkwood,-3.2+i*.46,.966,-.65);
box(6.8,2.3,.2,colors.green,0,2,-2.7);box(6.8,.13,.28,colors.darkwood,0,1.2,-2.57);
for(const x of [-3.2,3.2]){box(.23,3.3,.23,colors.wood,x,2.6,-2.5);box(.23,3.3,.23,colors.wood,x,2.6,.95);}
box(7.25,.25,2.6,colors.wood,0,4.22,-1.65);box(7.4,.3,2.75,colors.snow,0,4.47,-1.65);box(7.1,.18,.22,colors.wood,0,4.1,1.05);
for(let i=0;i<9;i++){const flap=box(.71,.67,.1,i%2===0?colors.green:mat('#f6ecd1'),-2.92+i*.73,3.78,1.52);}
// Hand-painted shop sign.
function label(text,w,h,bg,fg,size=70){const c=document.createElement('canvas');c.width=768;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,768,256);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`bold ${size}px sans-serif`;ctx.fillText(text,384,128);const t=new THREE.CanvasTexture(c);return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:t,roughness:.85}));}
box(3.7,.8,.19,colors.darkwood,0,4.35,1.65);const sign=label('冰 山 寿 司',3.5,.69,'#eee4c3','#42634e',83);sign.position.set(0,4.35,1.755);scene.add(sign);
// Rear shelves with crockery, bottles, and a tiny menu.
box(5.7,.12,.6,colors.wood,0,2.5,-2.42);for(let i=0;i<5;i++){cyl(.11,.11,.42,i%2?colors.coral:colors.white,-2.3+i*.36,2.77,-2.36);cyl(.065,.065,.12,colors.darkwood,-2.3+i*.36,3.02,-2.36);}
const menu=label('今日鲜制\nSUSHI',1.3,.85,'#314c43','#eadcb3',65);menu.position.set(1.7,2.75,-2.55);scene.add(menu);
// Preparation counter.
box(6.3,1.1,1.05,colors.wood,0,1.53,1.2);box(6.55,.18,1.25,colors.darkwood,0,2.13,1.2);box(6.5,.08,1.23,mat('#d4b38a'),0,2.25,1.2);
for(let x=-2.8;x<3;x+=.55)box(.035,.88,.02,colors.darkwood,x,1.53,1.736);
// Rice cooker, cutting board, ingredients, plated sushi.
cyl(.38,.35,.43,colors.white,-2.45,2.5,1.2);ball(.4,.12,.4,colors.green,-2.45,2.74,1.2);ball(.08,.06,.08,colors.darkwood,-2.45,2.86,1.2);box(.7,.05,.65,colors.green,-1.45,2.32,1.2);
for(let i=0;i<3;i++)box(.16,.06,.45,colors.coral,-1.66+i*.2,2.39,1.2);
box(1.1,.05,.75,mat('#e1c9a0'),.2,2.32,1.2);for(let i=0;i<8;i++)box(.017,.015,.7,colors.darkwood,-.25+i*.12,2.357,1.2);
box(.13,.04,.6,mat('#bacbcb'),.65,2.42,1.1).rotation.y=.4;box(.12,.05,.25,colors.darkwood,.8,2.43,1.44).rotation.y=.4;
const sushiGroup=new THREE.Group();scene.add(sushiGroup);
function sushi(x,z,parent=scene){ball(.23,.1,.15,colors.white,x,2.38,z,parent);ball(.25,.055,.17,colors.coral,x,2.48,z,parent);for(let i=0;i<3;i++){let st=box(.025,.015,.26,colors.white,x-.13+i*.12,2.532,z,parent);st.rotation.y=.35;}}
cyl(.54,.54,.045,colors.green,2.05,2.33,1.2);sushi(1.86,1.1,sushiGroup);sushi(2.25,1.3,sushiGroup);
// Hanging warm lanterns.
for(const x of [-2.85,2.85]){cyl(.016,.016,.5,colors.darkwood,x,3.95,1.55);ball(.23,.34,.23,mat('#f5cfa0'),x,3.5,1.55);cyl(.13,.13,.04,colors.darkwood,x,3.18,1.55);}
function penguin(x,z,{chef=false,color='#cb8f71',scale=1}={}){const g=new THREE.Group();g.position.set(x,.77,z);g.scale.setScalar(scale);scene.add(g);ball(.45,.62,.4,colors.navy,0,.71,0,g);ball(.35,.49,.18,colors.white,0,.67,.31,g);ball(.39,.37,.36,colors.navy,0,1.26,.015,g);ball(.3,.27,.16,colors.white,0,1.23,.28,g);for(const xx of [-.13,.13]){ball(.043,.06,.035,colors.navy,xx,1.3,.417,g);ball(.013,.018,.009,colors.white,xx-.009,1.32,.447,g);ball(.07,.035,.015,mat('#e5a28e'),xx*1.7,1.19,.401,g);}const beak=mesh(new THREE.ConeGeometry(.085,.18,12),colors.gold,0,1.18,.48,g);beak.rotation.x=Math.PI/2;for(const xx of [-.22,.22])ball(.19,.075,.26,colors.gold,xx,.09,.17,g);const wings=[];for(const xx of [-.48,.48]){const wing=ball(.13,.35,.16,colors.navy,xx,.76,0,g);wing.rotation.z=xx>0?-.3:.3;wings.push(wing);}if(chef){cyl(.34,.34,.17,colors.white,0,1.58,0,g);for(const xx of [-.2,0,.2])ball(.2,.22,.2,colors.white,xx,1.76,0,g);box(.48,.48,.08,colors.green,0,.6,.44,g);box(.58,.07,.08,colors.green,0,.91,.39,g);}else{cyl(.37,.37,.13,mat(color),0,1.02,0,g);box(.13,.31,.1,mat(color),.22,.87,.37,g);}return {g,wings};}
const chef=penguin(0,-.12,{chef:true,scale:1.03});chef.g.position.y=1.0;
const guests=[penguin(-2.1,3.0,{color:'#d19c7c'}),penguin(.1,3.6,{color:'#a8b593',scale:.86}),penguin(2.6,2.8,{color:'#dfc476',scale:1.04})];guests.forEach(p=>p.g.rotation.y=Math.PI-.2);
// Signboard, stools, greenery and snowballs.
for(const x of [-2.1,.1,2.6]){cyl(.38,.31,.13,colors.wood,x,.95,3);for(const dx of [-.2,.2])box(.08,.28,.08,colors.darkwood,x+dx,.79,3);}
box(.9,1.1,.13,colors.wood,-4.0,1.4,1.7).rotation.z=-.1;const board=label('OPEN',.78,.6,'#436c56','#f6eacf',105);board.position.set(-4,1.52,1.78);scene.add(board);
for(const [x,z]of [[4,-1.5],[-4,-2.5]]){cyl(.37,.3,.4,colors.wood,x,.95,z);for(let i=0;i<3;i++)mesh(new THREE.ConeGeometry(.66-i*.15,.85,7),colors.green,x,1.45+i*.48,z);}
for(const [x,z,r]of [[4,2.1,.4],[3.8,2.5,.25],[-4,0,.25],[-2,-4,.42],[2.7,-3.7,.27]])ball(r,r*.7,r,colors.snow,x,.85,z);
const flakes=[];for(let i=0;i<35;i++){const f=ball(.025,.025,.025,colors.white,(Math.random()-.5)*17,Math.random()*9,(Math.random()-.5)*14);flakes.push(f);}
let target=0,working=false,last=performance.now();function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;const t=now/1000;chef.g.position.x=THREE.MathUtils.lerp(chef.g.position.x,target,.06);chef.g.position.y=1+Math.sin(t*(working?15:2.7))*(working?.055:.017);chef.wings.forEach((w,i)=>w.rotation.z=(i?-.3:.3)+Math.sin(t*(working?14:2))* (working?.45:.06));guests.forEach((p,i)=>{p.g.position.y=.78+Math.sin(t*2+i)*.027;p.g.rotation.y=Math.PI+Math.sin(t*.7+i)*.12;});flakes.forEach(f=>{f.position.y-=dt*.18;f.position.x+=Math.sin(t+f.position.z)*dt*.04;if(f.position.y<.3)f.position.y=9;});controls.update();renderer.render(scene,camera);}requestAnimationFrame(animate);
new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}).observe(host);
return {move(action){target={rice:-2.2,salmon:-1.3,shrimp:-1.1,cucumber:-.8,roll:.2,serve:2}[action]??0;working=action==='roll';},stop(){working=false;},reset(){camera.position.set(10,8.5,15);controls.target.set(0,1,0);},celebrate(){guests.forEach(p=>p.wings.forEach((w,i)=>w.rotation.z=i?-1.3:1.3));}};
}
