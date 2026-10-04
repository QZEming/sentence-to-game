import * as THREE from './vendor/three.module.js';
import {createWhale,createJellyfish,createManta} from './animals.js';
export const SITES=[
{id:'echo',name:'回声庭院',en:'THE ECHO GARDEN',x:0,z:-48,color:0x8ee6ca},
{id:'tide',name:'潮汐圣所',en:'THE TIDAL SANCTUM',x:-94,z:-111,color:0x82c7ef},
{id:'star',name:'星陨之庭',en:'THE FALLEN STARS',x:91,z:-145,color:0xb6a4ff},
{id:'heart',name:'深海之心',en:'THE HEART OF THE ABYSS',x:0,z:-225,color:0xe4dfb4}
];
export const LIFE=[
{id:'coral',name:'星灯珊瑚',latin:'Corallium lucens',description:'像一座海底星群，用微弱的光迎接每一个远游者。',x:17,z:13,symbol:'✧'},
{id:'manta',name:'月影蝠鲼',latin:'Mobula lunaris',description:'宽阔的双翼划过海水，仿佛一封无声的来信。',x:-26,z:-36,symbol:'◇'},
{id:'jelly',name:'幽蓝水母',latin:'Aurelia profunda',description:'发光的伞下藏着细长触手。保持距离，声呐能暂时驱散它们。',x:-51,z:-90,symbol:'♧'},
{id:'fish',name:'银光鱼群',latin:'Argentum pelagicus',description:'千百道银色流光聚散，追随同一个不可见的节拍。',x:49,z:-74,symbol:'≋'},
{id:'vent',name:'生命之泉',latin:'Fons abyssalis',description:'遗迹旁的神秘气泉能补充气息，成为旅途中安静的港湾。',x:-94,z:-102,symbol:'♨'},
{id:'whale',name:'远古守望者',latin:'Balaena memoria',description:'深海的另一位旅人。它守望的并非宝藏，而是尚未消失的歌声。',x:18,z:-197,symbol:'◒'}
];
let seed=241;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
export const groundHeight=(x,z)=>-17+Math.sin(x*.035)*2.0+Math.cos(z*.029)*1.8+Math.sin(x*.052+z*.042)*1.1;
const mat=(color,props={})=>new THREE.MeshStandardMaterial({color,roughness:.87,flatShading:true,...props});
function mesh(g,m,parent,pos,scale){const o=new THREE.Mesh(g,m);if(pos)o.position.set(...pos);if(scale)o.scale.set(...scale);parent.add(o);return o;}
const branchGeometry=new THREE.CylinderGeometry(.64,1,1,6);
function tubeBetween(a,b,r,m,parent){const d=new THREE.Vector3().subVectors(b,a);const o=mesh(branchGeometry,m,parent);o.scale.set(r,d.length(),r);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return o;}
export function createWorld(canvas){
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x073b50);scene.fog=new THREE.FogExp2(0x073b50,.0085);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,650);camera.position.set(15,8,53);
scene.add(new THREE.HemisphereLight(0x9ce7ef,0x153a50,2.1));const sun=new THREE.DirectionalLight(0xb8f5ee,3);sun.position.set(-40,90,10);scene.add(sun);const rim=new THREE.DirectionalLight(0x4b93ff,1.1);rim.position.set(70,15,-90);scene.add(rim);
const terrainG=new THREE.PlaneGeometry(660,660,105,105);terrainG.rotateX(-Math.PI/2);const pa=terrainG.attributes.position;const colors=[];for(let i=0;i<pa.count;i++){const x=pa.getX(i),z=pa.getZ(i);pa.setY(i,groundHeight(x,z));const c=new THREE.Color().setHSL(.49+rand()*.055,.28+rand()*.15,.17+rand()*.045);colors.push(c.r,c.g,c.b)}terrainG.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));terrainG.computeVertexNormals();mesh(terrainG,mat(0xffffff,{vertexColors:true}),scene);
const surface=new THREE.Mesh(new THREE.PlaneGeometry(700,700,1,1),new THREE.ShaderMaterial({transparent:true,side:THREE.DoubleSide,depthWrite:false,uniforms:{uTime:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 vUv;uniform float uTime;void main(){float a=sin(vUv.x*95.+sin(vUv.y*34.+uTime*.2))*sin(vUv.y*81.+uTime*.18);gl_FragColor=vec4(.20,.63,.69,.06+max(0.,a)*.14);}'}));surface.rotation.x=-Math.PI/2;surface.position.y=53;scene.add(surface);
// Wide, soft cones create underwater shafts rather than opaque columns.
const shaftM=new THREE.ShaderMaterial({transparent:true,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;void main(){float edge=pow(sin(vUv.x*3.14159),4.);float fade=pow(vUv.y,1.9);gl_FragColor=vec4(.3,.65,.65,edge*fade*.046);}'});
for(let i=0;i<13;i++){const s=mesh(new THREE.CylinderGeometry(2+rand()*2,12+rand()*7,105,12,1,true),shaftM,scene,[(rand()-.5)*320,30,25-rand()*290]);s.rotation.z=-.20;s.rotation.x=.12;}
const stone=mat(0x3c6269),stoneTop=mat(0x567b7b),darkStone=mat(0x294a55),gold=mat(0x9db8a2,{metalness:.38}),glow=mat(0x84edd7,{emissive:0x63d9b7,emissiveIntensity:1.5});
const obstacles=[];const ruins=[];const vents=[];
function pillar(parent,x,z,height,broken=false){const bottom=groundHeight(parent.position.x+x,parent.position.z+z);const p=new THREE.Group();p.position.set(x,bottom,z);parent.add(p);mesh(new THREE.BoxGeometry(4.2,.65,4.2),stone,p,[0,.3,0]);mesh(new THREE.CylinderGeometry(1.25,1.65,height,8),stone,p,[0,height/2+.6,0]);mesh(new THREE.CylinderGeometry(1.67,1.67,.45,8),stoneTop,p,[0,height+.6,0]);for(const y of [1.4,height-1.0])mesh(new THREE.CylinderGeometry(1.42,1.42,.22,8),gold,p,[0,y,0]);if(broken)p.rotation.z=.10;obstacles.push({x:parent.position.x+x,z:parent.position.z+z,r:2,y:bottom+height});return p;}
for(let k=0;k<SITES.length;k++){
 const site=SITES[k],g=new THREE.Group();g.position.set(site.x,0,site.z);scene.add(g);const base=groundHeight(site.x,site.z);const color=site.color;const lightM=mat(color,{emissive:color,emissiveIntensity:1.8});
 mesh(new THREE.CylinderGeometry(19,21,1.3,32),stone,g,[0,base+.4,0]);mesh(new THREE.CylinderGeometry(14.6,15.5,.8,32),darkStone,g,[0,base+1.3,0]);
 const disk=mesh(new THREE.TorusGeometry(12,.085,5,64),lightM,g,[0,base+1.85,0]);disk.rotation.x=Math.PI/2;
 const radius=k===3?19:k===0?12:10;const ringY=base+radius+2;
 const ring=mesh(new THREE.TorusGeometry(radius,1.35,8,48),stoneTop,g,[0,ringY,-6]);
 mesh(new THREE.TorusGeometry(radius-1.55,.12,6,80),lightM,g,[0,ringY,-5.91]);mesh(new THREE.TorusGeometry(radius+1.65,.17,6,64),gold,g,[0,ringY,-6]);
 for(let j=0;j<12;j++){const a=j/12*Math.PI*2;const n=mesh(new THREE.BoxGeometry(.62,1.05,.15),lightM,g,[Math.sin(a)*radius,ringY+Math.cos(a)*radius,-4.63]);n.rotation.z=-a;}
 for(let j=0;j<6;j++){const a=j/6*Math.PI*2;pillar(g,Math.cos(a)*21,Math.sin(a)*21,10+(j%3)*3,j%3===0);}
 for(let j=0;j<8;j++){const s=mesh(new THREE.BoxGeometry(4+rand()*4,1.3,2.8),stone,g,[(rand()-.5)*40,base+2,(rand()-.5)*40]);s.rotation.y=rand()*6;}
 const altar=mesh(new THREE.OctahedronGeometry(k===3?2.8:1.7,0),lightM,g,[0,base+5,8]);const halo=mesh(new THREE.TorusGeometry(3,.09,5,48),lightM,g,[0,base+5,8]);halo.rotation.x=Math.PI/2;
 const light=new THREE.PointLight(color,100,38,2);light.position.set(0,base+9,4);g.add(light);
 const beam=mesh(new THREE.CylinderGeometry(.7,1.5,65,12,1,true),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.0,depthWrite:false,blending:THREE.AdditiveBlending}),g,[0,17,0]);
 ruins.push({group:g,altar,halo,ring,light,beam,base,site});vents.push(new THREE.Vector3(site.x,base+6,site.z+17));
}
vents.unshift(new THREE.Vector3(-12,-6,24));
const bubbleGeo=new THREE.SphereGeometry(.19,6,5),bubbleMat=new THREE.MeshBasicMaterial({color:0xb4eae1,transparent:true,opacity:.35});const bubbles=[];
vents.forEach(p=>{mesh(new THREE.CylinderGeometry(3,4,1.3,12),stone,scene,[p.x,groundHeight(p.x,p.z)+.7,p.z]);const l=new THREE.PointLight(0x8fefd2,35,18);l.position.copy(p);scene.add(l);for(let j=0;j<15;j++){const b=mesh(bubbleGeo,bubbleMat,scene);b.userData={origin:p,phase:rand()*12,dx:(rand()-.5)*4,dz:(rand()-.5)*4};bubbles.push(b)}});
const rocks=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),stone,180),dummy=new THREE.Object3D();for(let i=0;i<180;i++){const x=(rand()-.5)*500,z=(rand()-.58)*470;dummy.position.set(x,groundHeight(x,z)+.8,z);dummy.rotation.set(rand(),rand()*6,rand());dummy.scale.set(2+rand()*6,1+rand()*5,2+rand()*5);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix)}scene.add(rocks);
const coralColors=[0x82b6af,0x2c979d,0x8296b4,0x5ebcb4,0x867eb0];const coralMaterials=coralColors.map(c=>mat(c,{emissive:c,emissiveIntensity:.16}));const glowingTips=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.20,0),glow,500);let ti=0;
for(let i=0;i<80;i++){const x=(rand()-.5)*270,z=30-rand()*290;if(SITES.some(s=>Math.hypot(x-s.x,z-s.z)<24))continue;const c=new THREE.Group();c.name='coral';c.position.set(x,groundHeight(x,z),z);scene.add(c);const cm=coralMaterials[i%5],h=1.7+rand()*3.2;const a=new THREE.Vector3(0,0,0),b=new THREE.Vector3(.15,h,0);tubeBetween(a,b,.15,cm,c);for(let j=0;j<4;j++){const dir=j/4*6.28+rand();const end=new THREE.Vector3(Math.cos(dir)*(1+rand()),h*(.5+rand()*.5),Math.sin(dir)*(1+rand()));tubeBetween(new THREE.Vector3(0,h*.35,0),end,.1,cm,c);const tip=end.clone().add(new THREE.Vector3(.1,.5,0));tubeBetween(end,tip,.07,cm,c);if(ti<500){dummy.position.copy(tip).add(c.position);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();glowingTips.setMatrixAt(ti++,dummy.matrix)}}}glowingTips.count=ti;scene.add(glowingTips);
// Coral branches share geometry and are batched into five material draws.
const coralGroups=scene.children.filter(c=>c.name==='coral');coralGroups.forEach(c=>c.updateMatrixWorld(true));
for(const material of coralMaterials){const branches=coralGroups.flatMap(c=>c.children.filter(m=>m.material===material));if(!branches.length)continue;const batch=new THREE.InstancedMesh(branchGeometry,material,branches.length);branches.forEach((m,i)=>batch.setMatrixAt(i,m.matrixWorld));scene.add(batch);}coralGroups.forEach(c=>scene.remove(c));

const grassM=mat(0x366f74,{side:THREE.DoubleSide});const grass=new THREE.InstancedMesh(new THREE.PlaneGeometry(.45,3),grassM,800);for(let i=0;i<800;i++){const x=(rand()-.5)*310,z=45-rand()*330;dummy.position.set(x,groundHeight(x,z)+1,z);dummy.rotation.set((rand()-.5)*.5,rand()*6,(rand()-.5)*.4);dummy.scale.set(.6+rand(),.4+rand(),1);dummy.updateMatrix();grass.setMatrixAt(i,dummy.matrix)}scene.add(grass);
const crystals=[];const crystalG=new THREE.OctahedronGeometry(.68,0),crystalM=mat(0xb4fff0,{emissive:0x4fe8c8,emissiveIntensity:1.8,metalness:.3,roughness:.3});const paths=[[0,25,0,-48],[0,-48,-94,-111],[0,-48,91,-145],[-94,-111,0,-225],[91,-145,0,-225]];
for(let i=0;i<35;i++){const p=paths[Math.floor(i/7)],f=(i%7+.5)/7;const x=THREE.MathUtils.lerp(p[0],p[2],f)+(rand()-.5)*13,z=THREE.MathUtils.lerp(p[1],p[3],f)+(rand()-.5)*12,y=-3+Math.sin(i*1.9)*3;const c=mesh(crystalG,crystalM,scene,[x,y,z],[.7,1.5,.7]);crystals.push({id:i,mesh:c,baseY:y});}
const fragments=[];for(let i=0;i<3;i++){const s=SITES[2],a=(i/3)*6.28;const x=s.x+Math.cos(a)*31,z=s.z+Math.sin(a)*31,y=-2+i*2;const m=mesh(new THREE.OctahedronGeometry(1.1,0),mat(0xd1b6ff,{emissive:0x8970ff,emissiveIntensity:2}),scene,[x,y,z]);const orbit=mesh(new THREE.TorusGeometry(2,.045,4,32),mat(0xc8b6ff,{emissive:0xc8b6ff,emissiveIntensity:2}),m);orbit.rotation.x=Math.PI/2;fragments.push({id:i,mesh:m,baseY:y});}
const jellies=[];for(let i=0;i<10;i++){const a=createJellyfish(i%2?0x92a4ed:0x63d8d0);a.group.position.set(-53+Math.sin(i*2.1)*35,-4+Math.sin(i)*5,-75-i*8);a.group.scale.setScalar(1.1+rand()*.4);scene.add(a.group);jellies.push({...a,origin:a.group.position.clone()});}
const mantas=[];for(let i=0;i<3;i++){const a=createManta();a.group.position.set(-25+i*8,7+i*3,-32-i*3);scene.add(a.group);mantas.push({...a,origin:a.group.position.clone()})}
const guardian=createWhale();guardian.group.scale.setScalar(1.5);guardian.group.position.set(15,6,-194);scene.add(guardian.group);
const fishGeo=new THREE.ConeGeometry(.28,1.5,4);fishGeo.rotateX(-Math.PI/2);const fish=new THREE.InstancedMesh(fishGeo,mat(0x99cad1,{metalness:.6,roughness:.25}),105);scene.add(fish);const fishSeeds=Array.from({length:105},()=>({x:(rand()-.5)*22,y:(rand()-.5)*12,z:(rand()-.5)*16,p:rand()*6.28}));
const particleG=new THREE.BufferGeometry(),positions=new Float32Array(1300*3);for(let i=0;i<1300;i++){positions[i*3]=(rand()-.5)*330;positions[i*3+1]=-12+rand()*65;positions[i*3+2]=70-rand()*360}particleG.setAttribute('position',new THREE.BufferAttribute(positions,3));const particles=new THREE.Points(particleG,new THREE.PointsMaterial({color:0xc4f7ee,size:.12,transparent:true,opacity:.55,sizeAttenuation:true,depthWrite:false}));scene.add(particles);
const player=createWhale();player.group.position.set(0,0,28);player.group.scale.setScalar(1.25);scene.add(player.group);
const sonar=mesh(new THREE.SphereGeometry(1,32,20),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uOpacity:{value:0}},vertexShader:'varying vec3 vN;varying vec3 vP;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vP=p.xyz;gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 vN;varying vec3 vP;uniform float uOpacity;void main(){float edge=pow(1.-abs(dot(normalize(vN),normalize(-vP))),3.);gl_FragColor=vec4(.4,1.,.83,edge*uOpacity);}'}),scene);let sonarAge=99;
const currentRings=[];for(let i=0;i<8;i++){const o=mesh(new THREE.TorusGeometry(3,.055,4,32),new THREE.MeshBasicMaterial({color:0x7edde5,transparent:true,opacity:.23}),scene,[-45-i*3,-2,-40-i*3]);o.rotation.y=-.8;currentRings.push(o)}
function pulse(position){sonar.position.copy(position);sonarAge=0;}
function update(t,dt,state){surface.material.uniforms.uTime.value=t;particles.rotation.y=Math.sin(t*.008)*.015;sonarAge+=dt;if(sonarAge<2.4){sonar.scale.setScalar(2+sonarAge*35);sonar.material.uniforms.uOpacity.value=.36*(1-sonarAge/2.4)}else sonar.material.uniforms.uOpacity.value=0;
for(const c of crystals){c.mesh.visible=!state.collected.includes(c.id);c.mesh.rotation.y=t*.9;c.mesh.position.y=c.baseY+Math.sin(t*1.6+c.id)*.35;c.mesh.scale.setScalar(state.sonarReveal>0?1.3:1);c.mesh.scale.y*=1.5}
for(const f of fragments){f.mesh.visible=!state.fragments.includes(f.id);f.mesh.rotation.y=t*.5;f.mesh.position.y=f.baseY+Math.sin(t+f.id)*.55;f.mesh.children[0].rotation.z=t*.7}
ruins.forEach((r,i)=>{r.altar.rotation.y=t*.6;r.altar.position.y=r.base+5+Math.sin(t*1.4+i)*.5;r.halo.rotation.z=t*.2;const on=i===3?state.won:state.sigils.includes(r.site.id);r.beam.material.opacity=on?.13:0;r.light.intensity=on?170:90+Math.sin(t)*15;r.ring.rotation.z=on?Math.sin(t*.12)*.04:0;});
for(const b of bubbles){const d=b.userData;b.position.set(d.origin.x+d.dx+Math.sin(t+d.phase)*.3,groundHeight(d.origin.x,d.origin.z)+(t*1.5+d.phase)%18,d.origin.z+d.dz)}
jellies.forEach((j,i)=>{j.animate(t+i);j.group.position.y=j.origin.y+Math.sin(t*.6+i)*1.5;j.group.position.x=j.origin.x+Math.sin(t*.12+i)*3;j.group.scale.setScalar(state.sonarReveal>0?.7:1.2)});
mantas.forEach((m,i)=>{m.animate(t+i);m.group.position.x=m.origin.x+Math.sin(t*.12)*12;m.group.position.z=m.origin.z+Math.cos(t*.12)*9;m.group.rotation.y=-t*.12-Math.PI/2;});
guardian.animate(t,.3);guardian.group.position.x=18+Math.sin(t*.06)*24;guardian.group.position.z=-195+Math.cos(t*.06)*15;guardian.group.rotation.y=-t*.06-Math.PI/2;
for(let i=0;i<fishSeeds.length;i++){const f=fishSeeds[i];dummy.position.set(48+f.x+Math.sin(t*.22+f.p)*6,5+f.y+Math.sin(t*.7+f.p),-75+f.z+Math.cos(t*.22+f.p)*5);dummy.rotation.set(0,-t*.22-f.p,Math.sin(t*2+f.p)*.1);dummy.scale.setScalar(.6);dummy.updateMatrix();fish.setMatrixAt(i,dummy.matrix)}fish.instanceMatrix.needsUpdate=true;currentRings.forEach((r,i)=>r.material.opacity=.1+(Math.sin(t*2-i)*.5+.5)*.2);
}
return {renderer,scene,camera,player,ruins,vents,crystals,fragments,jellies,obstacles,update,pulse,setQuality(q){renderer.setPixelRatio(Math.min(devicePixelRatio,q==='low'?1:1.8));particles.visible=q!=='low';grass.visible=q!=='low';},resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}};
}
