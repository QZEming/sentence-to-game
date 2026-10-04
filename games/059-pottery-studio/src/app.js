import * as THREE from './vendor/three.module.min.js';
import {COUNT,clamp,CLAYS,GLAZES,PRESETS,ORDERS,profileFrom,deform,shapeScore,calculateResult,validDraft} from './game.js';

const $=id=>document.getElementById(id), $$=s=>[...document.querySelectorAll(s)];
const paths={
 vase:'M8 3h8M9 3l1 5c-1 3-5 5-5 9 0 3 3 4 7 4s7-1 7-4c0-4-4-6-5-9l1-5M9 6h6',
 bowl:'M3 9h18c0 6-4 10-9 10S3 15 3 9ZM9 19v2h6v-2M3 9c0-2 18-2 18 0',
 cup:'M5 4h12v14c0 3-12 3-12 0V4Zm12 3h2c4 0 4 7 0 7h-2M5 4c0-2 12-2 12 0',
 jar:'M8 3h8v4c4 2 5 5 5 9s-4 5-9 5-9-1-9-5 1-7 5-9V3ZM7 7h10M8 3c0-1 8-1 8 0',
 hand:'M8 13V6a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v8-5a2 2 0 0 1 4 0v9c0 5-3 6-7 6-3 0-5-2-7-5L3 12c-1-2 2-3 3-1l2 2Z',
 smooth:'M4 9l5-5c1-1 3-1 4 0l7 7c1 1 1 3 0 4l-5 5c-1 1-3 1-4 0l-7-7c-1-1-1-3 0-4ZM8 10h.01M12 7h.01M14 12h.01M11 16h.01M17 15h.01',
 carve:'m15 3 6 6-11 11H4v-6L15 3ZM13 5l6 6M4 20l-2 2',
 drop:'M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13ZM8 15c0 2 1 3 3 3',
 sparkles:'m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2ZM20 2v4M18 4h4',
 leaf:'M20 3C6 2 2 9 5 15c4 8 15 3 15-12ZM4 21 15 9M9 16l-1-5',
 info:'M12 8h.01M12 11v6M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
 pause:'M8 5v14M16 5v14',play:'m8 4 12 8-12 8Z',
 undo:'M8 4 3 9l5 5M3 9h11a7 7 0 0 1 0 14',redo:'m16 4 5 5-5 5M21 9H10a7 7 0 0 0 0 14',
 camera:'M4 7h4l2-3h4l2 3h4v14H4V7ZM16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
 help:'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 3M12 17h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
 soundOff:'m11 4-6 5H2v6h3l6 5V4ZM16 9l6 6M22 9l-6 6',soundOn:'m11 4-6 5H2v6h3l6 5V4ZM15 8c3 3 3 5 0 8M18 4c6 5 6 11 0 16',
 expand:'M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5',fire:'M12 2c1 6 7 6 7 12a7 7 0 0 1-14 0c0-3 2-5 3-6 0 4 2 4 2 2s3-4 2-8ZM12 14c-4 4 2 8 3 3',
 plus:'M12 5v14M5 12h14',left:'m14 6-6 6 6 6',right:'m10 6 6 6-6 6',close:'m6 6 12 12M18 6 6 18',
 refresh:'M3 10a9 9 0 1 1 1 7M3 4v6h6',brush:'m15 3 6 6-10 10-6-6L15 3ZM5 13c-4 1 0 5-3 8 6 1 9-2 9-2',check:'m5 12 4 4L19 6',download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',trophy:'M7 3h10v6a5 5 0 0 1-10 0V3ZM7 5H3v3a4 4 0 0 0 4 4M17 5h4v3a4 4 0 0 1-4 4M12 14v6M8 21h8'
};
const icon=(name)=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.sparkles}"/></svg>`;
function renderIcons(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon));}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
renderIcons();
const STORAGE='clay-time-v1';
let storeData={coins:0,completed:0,best:0,gallery:[],claimed:[],draft:null};
try{const p=JSON.parse(localStorage.getItem(STORAGE));if(p&&Array.isArray(p.gallery)&&Number.isFinite(p.coins)){storeData={...storeData,...p};storeData.gallery=p.gallery.filter(x=>x&&typeof x.name==='string'&&typeof x.glaze==='string'&&Number.isInteger(x.stars)&&x.stars>=1&&x.stars<=3&&Number.isFinite(x.score)&&x.score>=0&&x.score<=100&&typeof x.image==='string'&&x.image.startsWith('data:image/jpeg;')).slice(0,16);storeData.claimed=Array.isArray(p.claimed)?p.claimed.filter(x=>typeof x==='string'):[];storeData.completed=Number.isFinite(p.completed)?Math.max(0,p.completed):0;storeData.best=Number.isFinite(p.best)?clamp(p.best,0,100):0;storeData.coins=Math.max(0,p.coins);}}catch{}
const fresh=()=>({pieceId:crypto.randomUUID(),profile:profileFrom(PRESETS.vase.points),height:22,clay:'stone',glaze:0,gloss:65,pattern:'plain',step:0,order:null,moisture:86,temperature:1180,duration:60,preset:'vase',carves:[]});
let state=validDraft(storeData.draft)?{...fresh(),...storeData.draft}:fresh();
if(!Array.isArray(state.carves))state.carves=[];if(typeof state.pieceId!=='string')state.pieceId=crypto.randomUUID();
let tool='shape',brush=.1,history=[],future=[],wheelPlaying=!matchMedia('(prefers-reduced-motion: reduce)').matches,orderIndex=state.order??0,firing=false,fired=false,result=null,resultImage='',savedResult=false,resultState=null;
let renderer,scene,camera,pottery,wheel,potMaterial,guide,previewRenderer,previewScene,previewCamera,previewPot,keyHeight=.55;
let orbitAngle=.48,orbitElevation=4.6,cameraDistance=7.9,dirty=true,frameTime=0,toastTimer,saveTimer;
const activeGlaze=()=>GLAZES[state.glaze];
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3200);}
function persist(){storeData.draft={...state,profile:[...state.profile],carves:[...state.carves]};try{localStorage.setItem(STORAGE,JSON.stringify(storeData));}catch{toast('本机存储已满。可下载作品留存后再继续。');}}
function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(persist,500);}
function snapshot(){return JSON.parse(JSON.stringify(state));}
function checkpoint(){history.push(snapshot());if(history.length>40)history.shift();future=[];updateHistory();}
function updateHistory(){$('undoBtn').disabled=history.length===0||firing;$('redoBtn').disabled=future.length===0||firing;}
function undo(){if(firing||!history.length)return;future.push(snapshot());state=history.pop();fired=false;updateAll();if(state.order!==null)loadOrder(state.order);updateGuide();toast('已撤销上一步');}
function redo(){if(firing||!future.length)return;history.push(snapshot());state=future.pop();fired=false;updateAll();if(state.order!==null)loadOrder(state.order);updateGuide();}
function changed(){fired=false;result=null;dirty=true;updateMatch();scheduleSave();}
function selectTool(t){if(!['shape','smooth','carve'].includes(t))throw Error('未知工具');tool=t;$$('[data-tool]').forEach(e=>e.classList.toggle('active',e.dataset.tool===t));$('toolHelp').textContent={shape:'在陶坯上左右拖动，改变形状',smooth:'按住器壁轻轻滑动，抚平凹凸',carve:'轻点或上下移动，刻下环形细线'}[t];}
function setStep(step){if(firing||step===state.step)return;if(![0,1,2].includes(step))throw Error('无效阶段');state.step=step;fired=false;updateAll();if(step===1)toast('挑选喜欢的釉色，也可以试试半浸釉和环线彩绘');}
function updateAll(){
  fired=false;result=null;$('igniteBtn').innerHTML=icon('fire')+' 点燃窑火';
  $('coins').textContent=storeData.coins;$('galleryCount').textContent=storeData.gallery.length;
  $('shapePanel').hidden=state.step!==0;$('glazePanel').hidden=state.step!==1;$('firePanel').hidden=state.step!==2;
  $('toolTitle').textContent=['塑形工具','釉色实验室','照看窑火'][state.step];$('toolSubtitle').textContent=['01 / THROWING','02 / GLAZING','03 / FIRING'][state.step];
  $$('[data-step]').forEach(e=>{e.classList.toggle('active',+e.dataset.step===state.step);e.classList.toggle('done',+e.dataset.step<state.step);e.setAttribute('aria-current',+e.dataset.step===state.step?'step':'false');});
  $('nextStepBtn').innerHTML=state.step===0?`完成塑形，去施釉 ${icon('brush')}`:state.step===1?`施釉完成，准备烧制 ${icon('fire')}`:`${fired?'查看出窑作品':'点燃窑火'} ${icon('fire')}`;
  $('height').value=state.height;$('heightValue').textContent=state.height+' cm';
  $('gloss').value=state.gloss;$('glossValue').textContent=state.gloss>75?'莹亮':state.gloss>40?'温润':'哑光';
  $('temperature').value=state.temperature;$('temperatureValue').textContent=state.temperature.toLocaleString()+'°C';$('duration').value=state.duration;$('durationValue').textContent=state.duration+' 分钟';
  $('objectType').textContent=state.order!==null?ORDERS[state.order].name:'无名之器';$('objectMaterial').textContent=CLAYS[state.clay].name+' · '+(fired?'已烧制':state.step===0?'未烧制':activeGlaze().name+'釉');
  $('sceneState').textContent=state.order!==null?'委托创作':'自由创作';
  $('glazeName').textContent=activeGlaze().name;
  $$('[data-clay]').forEach(e=>{e.classList.toggle('active',e.dataset.clay===state.clay);e.disabled=state.step!==0||firing;});
  $$('[data-preset]').forEach(e=>{e.classList.toggle('active',e.dataset.preset===state.preset);e.disabled=state.step!==0||firing;});
  $$('[data-pattern]').forEach(e=>e.classList.toggle('active',e.dataset.pattern===state.pattern));
  $$('.swatch').forEach(e=>e.classList.toggle('active',+e.dataset.glaze===state.glaze));
  const clay=CLAYS[state.clay];$('firingAdvice').innerHTML=`${clay.name}的理想窑火<br><b>${clay.temperature}°C · 保温 ${clay.duration} 分钟</b>`;
  $('interactionHint').style.opacity='1';$('interactionHint').innerHTML=icon(state.step===0?'hand':state.step===1?'brush':'fire')+`<span>${['触碰陶土，左右拖动，慢慢找到它的形状。','挑一抹釉色。右键拖动或拖动空白处，转动器物。','调好温度与保温时间，让窑火完成最后的创作。'][state.step]}</span>`;
  if(innerWidth<600&&state.step===1)$('interactionHint').innerHTML=icon('brush')+'<span>滑动空白处，转动器物，欣赏釉面的光泽。</span>';
  updateMoisture();updateHistory();updateMatch();updateMaterial();dirty=true;scheduleSave();
}
function updateMoisture(){$('moistureValue').textContent=Math.round(state.moisture)+'%';$('moistureBar').style.width=state.moisture+'%';$('moistureBar').style.background=state.moisture<20?'#bb8e60':'#97a385';}
function updateMatch(){const active=state.order===orderIndex;$('matchBlock').hidden=!active;$('acceptOrder').innerHTML=active?`委托进行中 ${icon('check')}`:`接受这份委托 ${icon('plus')}`;$('acceptOrder').disabled=active||firing;if(active){const score=shapeScore(state.profile,state.height,ORDERS[orderIndex]);$('matchValue').textContent=score+'%';$('matchBar').style.width=score+'%';}if(guide)guide.visible=$('guideToggle').checked&&state.order!==null&&state.step===0;}
function loadOrder(index){orderIndex=(index+ORDERS.length)%ORDERS.length;const o=ORDERS[orderIndex];$('orderName').textContent=o.name;$('orderDescription').textContent=o.description;$('orderShape').textContent=o.shape;$('orderGlaze').textContent='推荐'+GLAZES[o.glaze].name+'釉';$('orderReward').textContent=o.reward;document.querySelector('.order-edition').textContent='委托 / 00'+(orderIndex+1);document.querySelector('.order-difficulty').textContent=o.difficulty;$('orderDots').innerHTML=ORDERS.map((_,i)=>`<i class="${i===orderIndex?'active':''}"></i>`).join('');updateMatch();renderPreview();}
function acceptOrder(index=orderIndex){if(firing)return;checkpoint();state.order=index;loadOrder(index);updateGuide();updateAll();toast('委托已接下。打开参考轮廓，试着靠近理想的曲线。');}
function preset(name){if(firing||state.step!==0)return;const p=PRESETS[name];if(!p)throw Error('未知器型');checkpoint();state.profile=profileFrom(p.points);state.height=p.height;state.preset=name;state.carves=[];updateAll();toast('从'+p.name+'开始，随心改变它的形状');}
function newPiece(){if(firing)return;checkpoint();state=fresh();fired=false;result=null;savedResult=false;$('guideToggle').checked=false;updateAll();updateGuide();loadOrder(0);toast('新的一团陶土，新的可能。');}

function geometry(profile,height,carves=[]){
  const pts=[new THREE.Vector2(0,.04),new THREE.Vector2(profile[0]*.91,.04)];
  const h=height/10;
  for(let i=0;i<COUNT;i++){const y=i/(COUNT-1);let r=profile[i]+Math.sin(y*245)*.0028;for(const c of carves)r-=.018*Math.exp(-Math.pow((y-c)/.007,2)/2);pts.push(new THREE.Vector2(r,.06+y*h));}
  const top=profile[COUNT-1];pts.push(new THREE.Vector2(top-.027,h+.079),new THREE.Vector2(top-.055,h+.06));
  for(let i=COUNT-1;i>=4;i--)pts.push(new THREE.Vector2(Math.max(.08,profile[i]-.085),.06+i/(COUNT-1)*h));
  pts.push(new THREE.Vector2(0,.15));
  return new THREE.LatheGeometry(pts,112);
}
function potteryTexture(){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d');
  const glazed=state.step>0||fired;const base=glazed?activeGlaze().color:CLAYS[state.clay].color;
  c.fillStyle=base;c.fillRect(0,0,512,512);
  if(glazed&&state.pattern==='dip'){c.fillStyle=CLAYS[state.clay].color;c.fillRect(0,355,512,157);c.fillStyle=base;for(let x=0;x<512;x+=3)c.fillRect(x,349,3,12+Math.sin(x*.05)*4);}
  if(glazed&&state.pattern==='rings'){c.fillStyle='#e8ddc0';[115,130,155,356,373].forEach(y=>c.fillRect(0,y,512,y===155?12:4));}
  let seed=37;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  for(let i=0;i<(glazed&&state.pattern==='speckle'?7000:5500);i++){const x=rand()*512,y=rand()*512,r=rand()*(glazed&&state.pattern==='speckle'?1.1:.55);c.fillStyle=`rgba(49,37,24,${rand()*(glazed&&state.pattern==='speckle'?.32:.1)})`;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
  if(!glazed){for(let y=0;y<512;y+=4){c.fillStyle='rgba(92,60,34,.045)';c.fillRect(0,y,512,1);}}
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
function updateMaterial(){if(!potMaterial)return;potMaterial.map?.dispose();potMaterial.map=potteryTexture();potMaterial.color.set('white');potMaterial.roughness=state.step===0?.84:clamp(.65-state.gloss*.005,.1,.7);potMaterial.metalness=0;potMaterial.clearcoat=state.step===0?0:state.gloss/120;potMaterial.clearcoatRoughness=.24;potMaterial.needsUpdate=true;}
function rebuild(){if(!pottery)return;pottery.geometry.dispose();pottery.geometry=geometry(state.profile,state.height,state.carves);dirty=false;}
function updateGuide(){if(!scene)return;if(guide){scene.remove(guide);guide.geometry.dispose();guide.material.dispose();}if(state.order===null){guide=null;return;}const o=ORDERS[state.order];guide=new THREE.Mesh(geometry(profileFrom(o.points).map(r=>r+.016),o.height),new THREE.MeshBasicMaterial({color:0x637852,wireframe:true,transparent:true,opacity:.09,depthWrite:false}));guide.position.y=.49;scene.add(guide);updateMatch();}
function cylinder(radiusTop,radiusBottom,height,color,y){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radiusTop,radiusBottom,height,96),new THREE.MeshStandardMaterial({color,roughness:.78}));mesh.position.y=y;mesh.castShadow=true;mesh.receiveShadow=true;return mesh;}
function resetCamera(){orbitAngle=.48;orbitElevation=4.6;cameraDistance=7.9;positionCamera();}
function positionCamera(){if(!camera)return;camera.position.set(Math.sin(orbitAngle)*cameraDistance,orbitElevation,Math.cos(orbitAngle)*cameraDistance);camera.lookAt(0,1.55,0);}
function renderPreview(){if(!previewRenderer)return;const o=ORDERS[orderIndex];if(previewPot){previewScene.remove(previewPot);previewPot.geometry.dispose();previewPot.material.dispose();}previewPot=new THREE.Mesh(geometry(profileFrom(o.points),o.height),new THREE.MeshStandardMaterial({color:GLAZES[o.glaze].color,roughness:.32}));previewScene.add(previewPot);previewCamera.lookAt(0,o.height/20,0);previewRenderer.render(previewScene,previewCamera);}
function setupScene(){
  const container=$('scene');
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;container.appendChild(renderer.domElement);
  scene=new THREE.Scene();scene.background=new THREE.Color('#e6e8db');scene.fog=new THREE.Fog('#e6e8db',14,28);
  camera=new THREE.PerspectiveCamera(37,1,.1,80);positionCamera();
  scene.add(new THREE.HemisphereLight('#fff3dd','#7b8871',3.4));
  const sun=new THREE.DirectionalLight('#fff4df',4.2);sun.position.set(-3,7,4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-7;sun.shadow.camera.right=7;sun.shadow.camera.top=7;sun.shadow.camera.bottom=-7;sun.shadow.normalBias=.03;sun.shadow.bias=-.0001;sun.shadow.radius=4;scene.add(sun);
  const fill=new THREE.DirectionalLight('#e5eff0',1.15);fill.position.set(4,4,-2);scene.add(fill);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#e1e4d7',roughness:.93}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
  wheel=new THREE.Group();scene.add(wheel);wheel.add(cylinder(1.39,1.15,.28,'#9d9e8c',.15));wheel.add(cylinder(1.94,1.86,.16,'#c1c1ac',.38));wheel.add(cylinder(1.90,1.9,.038,'#cfceba',.477));
  for(const r of [.40,.58,.75,.92,1.11,1.30,1.48,1.65,1.83]){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.008,6,112),new THREE.MeshStandardMaterial({color:'#aaa991',roughness:.9,transparent:true,opacity:.55}));ring.rotation.x=Math.PI/2;ring.position.y=.5;wheel.add(ring);}
  // A work surface built from the same real-time scene as the editable clay.
  const splashMaterial=new THREE.MeshStandardMaterial({color:'#baa68a',roughness:.97});
  for(let i=0;i<18;i++){const a=i*2.4,r=1.12+(Math.sin(i*8.3)+1)*.31;const splash=new THREE.Mesh(new THREE.CircleGeometry(.025+(Math.sin(i)+1)*.018,8),splashMaterial);splash.rotation.x=-Math.PI/2;splash.position.set(Math.cos(a)*r,.501,Math.sin(a)*r);wheel.add(splash);}
  potMaterial=new THREE.MeshPhysicalMaterial({roughness:.85,side:THREE.DoubleSide});pottery=new THREE.Mesh(geometry(state.profile,state.height,state.carves),potMaterial);pottery.position.y=.49;pottery.castShadow=true;pottery.receiveShadow=true;scene.add(pottery);updateMaterial();
  const resize=()=>{const r=container.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(container);resize();
  previewRenderer=new THREE.WebGLRenderer({canvas:$('previewCanvas'),antialias:true,alpha:true});previewRenderer.setSize(400,280,false);previewRenderer.setPixelRatio(1);previewRenderer.outputColorSpace=THREE.SRGBColorSpace;previewRenderer.toneMapping=THREE.ACESFilmicToneMapping;previewRenderer.toneMappingExposure=1.3;
  previewScene=new THREE.Scene();previewScene.add(new THREE.HemisphereLight('#ffffff','#697657',3));const key=new THREE.DirectionalLight('#fff0d5',3);key.position.set(-3,5,4);previewScene.add(key);previewCamera=new THREE.PerspectiveCamera(34,400/280,.1,50);previewCamera.position.set(4,3.7,6.5);renderPreview();updateGuide();
  $('sceneLoader').remove();bindSculpting();requestAnimationFrame(animate);
}
function animate(time){requestAnimationFrame(animate);const dt=Math.min((time-frameTime)/1000,.05);frameTime=time;if(dirty)rebuild();if(wheelPlaying&&!firing){wheel.rotation.y+=dt*.6;pottery.rotation.y+=dt*.6;}if(firing){const pulse=.12+Math.sin(time*.004)*.05;potMaterial.emissive.set('#9e330c');potMaterial.emissiveIntensity=pulse;}renderer.render(scene,camera);}
function bindSculpting(){
  const canvas=renderer.domElement,raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let dragging=null;
  const hit=e=>{const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObject(pottery)[0];};
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  canvas.addEventListener('pointerdown',e=>{if(firing)return;e.preventDefault();$('scene').focus({preventScroll:true});const h=hit(e);const sculpt=state.step===0&&e.button===0&&!e.altKey&&!e.shiftKey&&h;if(sculpt){checkpoint();keyHeight=clamp((h.point.y-.55)/(state.height/10),0,1);if(tool==='carve')addCarve(keyHeight);}dragging={x:e.clientX,y:e.clientY,sculpt:!!sculpt,level:keyHeight,side:h?(pointer.x<0?-1:1):1};canvas.setPointerCapture(e.pointerId);$('interactionHint').style.opacity='0';});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-dragging.x,dy=e.clientY-dragging.y;if(dragging.sculpt){const h=hit(e);if(h)dragging.level=clamp((h.point.y-.55)/(state.height/10),0,1);keyHeight=dragging.level;if(tool==='carve')addCarve(dragging.level);else state.profile=deform(state.profile,dragging.level,clamp(dx,-30,30)*.005*dragging.side,brush,tool,state.moisture);state.moisture=clamp(state.moisture-(Math.abs(dx)+Math.abs(dy))*.012,0,100);state.preset='custom';dirty=true;updateMoisture();updateMatch();}else{orbitAngle-=dx*.009;orbitElevation=clamp(orbitElevation+dy*.018,2.0,8);positionCamera();}dragging.x=e.clientX;dragging.y=e.clientY;});
  const finish=()=>{if(dragging?.sculpt){changed();if(state.moisture<20)toast('陶土有些干了，补一点水会更容易塑形。');}dragging=null;};canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);canvas.addEventListener('lostpointercapture',finish);
  canvas.addEventListener('wheel',e=>{e.preventDefault();cameraDistance=clamp(cameraDistance+e.deltaY*.005,5.5,11);positionCamera();},{passive:false});
  $('scene').addEventListener('keydown',e=>{if(state.step!==0||firing||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowUp'||e.key==='ArrowDown'){keyHeight=clamp(keyHeight+(e.key==='ArrowUp'?.05:-.05),0,1);toast('触点高度：'+Math.round(keyHeight*100)+'%');}else{checkpoint();if(tool==='carve')addCarve(keyHeight);else state.profile=deform(state.profile,keyHeight,e.key==='ArrowRight'?.045:-.045,brush,tool,state.moisture);changed();}});
}
function addCarve(y){if(!state.carves.some(c=>Math.abs(c-y)<.018)&&state.carves.length<40){state.carves.push(y);dirty=true;}}
function capture(){renderer.render(scene,camera);return renderer.domElement.toDataURL('image/jpeg',.8);}
function lockControls(locked){$$('input, [data-step], [data-tool], [data-pattern], .swatch, #newBtn, #igniteBtn, #nextStepBtn, #waterBtn, #prevOrder, #nextOrder').forEach(e=>e.disabled=locked);updateHistory();$$('[data-preset]').forEach(e=>e.disabled=locked||state.step!==0);}
async function ignite(){
  if(firing)return;if(fired){showResult();return;}if(state.step!==2)setStep(2);
  firing=true;resultState=snapshot();result=calculateResult(resultState);savedResult=storeData.claimed.includes(state.pieceId);lockControls(true);$('firingProgress').hidden=false;document.querySelector('.stage-wrap').classList.add('firing');$('sceneState').textContent='窑火烧制中';$('interactionHint').innerHTML=icon('fire')+'<span>泥土正在窑火里，变成可以长久陪伴的器物。</span>';
  const start=performance.now();const originalBG=new THREE.Color('#e6e8db');const warmBG=new THREE.Color('#cbb397');
  await new Promise(resolve=>{const tick=()=>{const f=clamp((performance.now()-start)/12000,0,1);$('firingBar').style.width=Math.round(f*100)+'%';$('firingStatus').textContent=f<.5?`缓慢升温 · ${Math.round(24+(state.temperature-24)*f*2)}°C`:f<.78?`保温烧成 · ${state.temperature}°C`:`自然冷却 · ${Math.round(state.temperature*(1-f)/.22)}°C`;scene.background.copy(originalBG).lerp(warmBG,Math.sin(f*Math.PI)*.65);if(f<1)requestAnimationFrame(tick);else resolve();};requestAnimationFrame(tick);});
  firing=false;fired=true;potMaterial.emissiveIntensity=0;scene.background.copy(originalBG);potMaterial.roughness=clamp(potMaterial.roughness+(100-result.firing)*.004,.12,.9);document.querySelector('.stage-wrap').classList.remove('firing');lockControls(false);$('firingProgress').hidden=true;$('objectMaterial').textContent=activeGlaze().name+'釉 · 已烧制';$('sceneState').textContent='器物已出窑';$('nextStepBtn').innerHTML=`查看出窑作品 ${icon('sparkles')}`;$('igniteBtn').innerHTML=icon('check')+' 查看出窑作品';resultImage=capture();showResult();
}
function openModal(title,content,eyebrow='CLAY & TIME'){$('modalTitle').textContent=title;$('modalEyebrow').textContent=eyebrow;$('modalContent').innerHTML=content;renderIcons($('modal'));if(!$('modal').open)$('modal').showModal();}
function showResult(){if(!result)return;const r=result,rs=resultState;openModal('从泥土，到一件作品',`<div class="result-layout"><img src="${resultImage}" alt="刚刚烧制的陶艺作品"><div><div class="result-stars">${'★'.repeat(r.stars)}${'☆'.repeat(3-r.stars)}</div><div class="result-score">${r.score}<small>作品评分</small></div><div class="score-row"><span>${rs.order===null?'器型流畅度':'委托器型吻合度'}</span><b>${r.shape}</b></div><div class="score-row"><span>窑火掌握</span><b>${r.firing}</b></div><div class="score-row"><span>釉色搭配</span><b>${r.glaze}</b></div><input class="result-name" id="pieceName" maxlength="24" aria-label="作品名称" placeholder="为作品取个名字" value="${esc(rs.order===null?'我的手作陶器':ORDERS[rs.order].name)}"><p class="result-message">${r.fulfilled?'委托完成！':rs.order!==null?'距离委托要求还差一点，但它仍是独一无二的作品。':'每一次手作，都值得被珍藏。'} 收藏可获得 ${r.coins} 陶币。</p></div></div><div class="modal-actions"><button id="downloadResult" class="text-button">${icon('download')}下载照片</button><button id="saveResult" class="primary-button" ${savedResult?'disabled':''}>${savedResult?'已收入收藏':'收入我的收藏'} ${icon('plus')}</button></div>`,'FRESH FROM THE KILN / 新作出窑');$('downloadResult').onclick=()=>download(resultImage,$('pieceName').value||'陶艺作品');$('saveResult').onclick=saveResult;}
function saveResult(){if(savedResult||!result||!resultState||storeData.claimed.includes(resultState.pieceId))return;const name=$('pieceName').value.trim()||'无名之器';const entry={id:Date.now(),name,image:resultImage,score:result.score,stars:result.stars,clay:CLAYS[resultState.clay].name,glaze:GLAZES[resultState.glaze].name,date:new Date().toLocaleDateString('zh-CN')};storeData.claimed.push(resultState.pieceId);storeData.gallery.unshift(entry);storeData.gallery=storeData.gallery.slice(0,16);storeData.coins+=result.coins;storeData.completed++;storeData.best=Math.max(storeData.best,result.score);savedResult=true;persist();$('coins').textContent=storeData.coins;$('galleryCount').textContent=storeData.gallery.length;$('saveResult').disabled=true;$('saveResult').textContent='已收入收藏';toast(`「${name}」已收藏，获得 ${result.coins} 陶币`);}
function download(url,name){const a=document.createElement('a');a.href=url;a.download=name+'.jpg';document.body.append(a);a.click();a.remove();}
function gallery(){openModal('我的收藏',storeData.gallery.length?`<div class="gallery-grid">${storeData.gallery.map((p,i)=>`<article class="gallery-card"><img src="${p.image}" alt="${esc(p.name)}"><h3>${esc(p.name)}</h3><p>${'★'.repeat(p.stars)} · ${p.score} 分 · ${esc(p.glaze)}釉</p><button data-download="${i}">下载作品照片</button></article>`).join('')}</div><p class="subtle">收藏保存在此浏览器中，最多保留最近 16 件。喜欢的作品也可以下载照片。</p>`:'<div class="empty-state">'+icon('vase')+'<p>这里，等着你的第一件作品。</p><p>完成塑形、施釉与烧制后，就能把它收入收藏。</p></div>','THE THINGS WE MAKE / 手作收藏');$$('[data-download]').forEach(b=>b.onclick=()=>{const p=storeData.gallery[+b.dataset.download];download(p.image,p.name);});}
function orders(){openModal('委托手记',`<div class="orders-grid">${ORDERS.map((o,i)=>`<article class="order-list-card"><span class="order-number">0${i+1}</span><div><h3>${o.name}</h3><p>${o.description}<br>${o.reward} 陶币 · 推荐${GLAZES[o.glaze].name}釉</p></div><button data-accept="${i}" ${firing?'disabled':''}>${state.order===i?'正在制作':'接受委托'}</button></article>`).join('')}</div><p class="subtle">达到 72 分即可完成委托。接受新委托会替换当前委托，保留正在制作的陶坯。</p>`,'A SMALL REQUEST / 用器物连接日常');$$('[data-accept]').forEach(b=>b.onclick=()=>{acceptOrder(+b.dataset.accept);$('modal').close();});}
function help(){openModal('在泥间，慢慢来',`<div class="help-grid"><div><h3>01 / 与陶土对话</h3><p>在器壁上左右拖动：向外拉宽，向内收拢。海绵抚平曲线，刻线刀留下环纹。缺水时记得补水。</p></div><div><h3>02 / 留下一点颜色</h3><p>完成塑形后，挑选釉色与光泽。试试半浸釉、砂点和环线图案，器物会实时变化。</p></div><div><h3>03 / 照看一炉窑火</h3><p>按照陶土提示调整温度和保温时间，等待约 12 秒。评分取决于器型、釉色与窑火。</p></div><div><h3>让创作顺手一些</h3><p>右键拖动或拖动空白处旋转视角；滚轮缩放。1 / 2 / 3 切换工具，空格暂停转盘，Ctrl / ⌘ Z 撤销。焦点在陶坯时，上下键选择高度，左右键塑形。</p></div></div><div class="modal-actions"><button class="primary-button" id="startCreating">继续我的创作 ${icon('hand')}</button></div>`,'A FEW GENTLE NOTES / 创作指南');$('startCreating').onclick=()=>$('modal').close();}
function profile(){const achievements=[{name:'第一炉窑火',desc:'收藏你的第一件作品',ok:storeData.completed>=1},{name:'手作日常',desc:'完成并收藏 5 件作品',ok:storeData.completed>=5},{name:'泥间匠人',desc:'获得一次 90 分以上评价',ok:storeData.best>=90}];openModal('每一次练习，都算数',`<div class="stats-line"><div><strong>${storeData.completed}</strong><span>收藏作品</span></div><div><strong>${storeData.best}</strong><span>最高评分</span></div><div><strong>${storeData.coins}</strong><span>累计陶币</span></div></div><div class="achievement-grid">${achievements.map(a=>`<div class="achievement ${a.ok?'earned':''}"><span>${icon('trophy')}</span><h3>${a.name}${a.ok?' · 已达成':''}</h3><p>${a.desc}</p></div>`).join('')}</div>`,'YOUR POTTERY JOURNEY / 匠人成长');}

$('swatches').innerHTML=GLAZES.map((g,i)=>`<button class="swatch ${state.glaze===i?'active':''}" data-glaze="${i}" style="background:${g.color}" title="${g.name}" aria-label="${g.name}釉"></button>`).join('');
$$('[data-tool]').forEach(e=>e.onclick=()=>selectTool(e.dataset.tool));$$('[data-step]').forEach(e=>e.onclick=()=>setStep(+e.dataset.step));$$('[data-preset]').forEach(e=>e.onclick=()=>preset(e.dataset.preset));
$$('[data-clay]').forEach(e=>e.onclick=()=>{if(firing)return;checkpoint();state.clay=e.dataset.clay;state.temperature=CLAYS[state.clay].temperature;state.duration=CLAYS[state.clay].duration;updateAll();});
$$('[data-pattern]').forEach(e=>e.onclick=()=>{if(firing)return;checkpoint();state.pattern=e.dataset.pattern;updateAll();});
$$('[data-glaze]').forEach(e=>e.onclick=()=>{if(firing)return;checkpoint();state.glaze=+e.dataset.glaze;updateAll();});
['height','gloss','temperature','duration'].forEach(id=>{const e=$(id);e.addEventListener('pointerdown',()=>{if(!firing)checkpoint();});e.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)&&!firing)checkpoint();});e.oninput=()=>{if(firing)return;state[id]=+e.value;updateAll();};});
$('brush').oninput=e=>{brush=+e.target.value/100;$('brushValue').textContent=brush<.07?'细腻':brush>.14?'宽阔':'适中';};
$('waterBtn').onclick=()=>{if(firing)return;state.moisture=clamp(state.moisture+25,0,100);updateMoisture();scheduleSave();toast('陶土吸饱了水，又变得柔软了。');};
$('undoBtn').onclick=undo;$('redoBtn').onclick=redo;$('resetViewBtn').onclick=resetCamera;
function toggleWheel(){wheelPlaying=!wheelPlaying;$('wheelLabel').textContent=wheelPlaying?'转盘转动中':'转盘已暂停';$('wheelBtn').firstElementChild.innerHTML=icon(wheelPlaying?'pause':'play');}
$('wheelBtn').onclick=toggleWheel;if(!wheelPlaying){$('wheelLabel').textContent='转盘已暂停';$('wheelBtn').firstElementChild.innerHTML=icon('play');}
$('nextStepBtn').onclick=()=>state.step<2?setStep(state.step+1):ignite();$('igniteBtn').onclick=ignite;$('newBtn').onclick=newPiece;$('galleryBtn').onclick=gallery;$('ordersBtn').onclick=orders;$('profileBtn').onclick=profile;$('helpBtn').onclick=help;$('footerHelp').onclick=help;$('closeModal').onclick=()=>$('modal').close();$('studioTab').onclick=()=>{$('modal').close();$('scene').focus();};
$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('modal').close();}});
$('acceptOrder').onclick=()=>acceptOrder();$('nextOrder').onclick=()=>loadOrder(orderIndex+1);$('prevOrder').onclick=()=>loadOrder(orderIndex-1);$('guideToggle').onchange=()=>updateMatch();
$('fullscreenBtn').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.stage-wrap').requestFullscreen();}catch{toast('这个浏览器暂不支持全屏，可以用滚轮放大器物。');}};
let audioCtx,audioGain,soundEnabled=false;
$('soundBtn').onclick=async()=>{try{if(!audioCtx){audioCtx=new (window.AudioContext||window.webkitAudioContext)();audioGain=audioCtx.createGain();audioGain.gain.value=0;audioGain.connect(audioCtx.destination);[130.81,196,261.63].forEach((f,i)=>{const o=audioCtx.createOscillator();const g=audioCtx.createGain();o.type='sine';o.frequency.value=f;g.gain.value=.09/(i+1);o.connect(g);g.connect(audioGain);o.start();});}await audioCtx.resume();soundEnabled=!soundEnabled;audioGain.gain.setTargetAtTime(soundEnabled?.25:0,audioCtx.currentTime,.7);$('soundBtn').innerHTML=icon(soundEnabled?'soundOn':'soundOff');$('soundBtn').title=soundEnabled?'关闭环境音':'开启环境音';$('soundBtn').setAttribute('aria-label',$('soundBtn').title);}catch{toast('环境音暂时无法播放。');}};
document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)||$('modal').open)return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo();return;}if(e.key===' '){e.preventDefault();toggleWheel();}if(['1','2','3'].includes(e.key)&&state.step===0)selectTool(['shape','smooth','carve'][+e.key-1]);if(e.key.toLowerCase()==='h')help();});
window.addEventListener('beforeunload',persist);

try{setupScene();updateAll();loadOrder(orderIndex);}catch(error){console.error(error);$('sceneLoader')?.remove();$('scene').innerHTML='<div class="error-message">当前设备暂时无法启动 3D 画布。<br>请启用浏览器的硬件加速后再打开工坊。<button onclick="location.reload()">重新尝试</button></div>';$('nextStepBtn').disabled=true;}

// The same actions and state power optional browser agent access.
if(document.modelContext?.registerTool){
  const lifecycle=new AbortController();
  const register=t=>{try{Promise.resolve(document.modelContext.registerTool(t,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
  register({name:'read_pottery_studio',title:'查看陶艺工作台',description:'Read the current pottery stage, material, shape match, firing settings and local collection.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({stage:['shaping','glazing','firing'][state.step],clay:CLAYS[state.clay].name,height:state.height,glaze:activeGlaze().name,order:state.order===null?null:ORDERS[state.order].name,shapeMatch:state.order===null?null:shapeScore(state.profile,state.height,ORDERS[state.order]),temperature:state.temperature,duration:state.duration,firing,coins:storeData.coins,collection:storeData.gallery.map(({name,score})=>({name,score}))})});
  register({name:'configure_pottery_glaze',title:'设置陶器釉色',description:'Move the current pottery to glazing and apply a glaze color and pattern using the visible controls. Does not fire or save the piece.',inputSchema:{type:'object',properties:{color:{type:'integer',minimum:0,maximum:7},pattern:{type:'string',enum:['plain','dip','speckle','rings']}},required:['color','pattern'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!input||typeof input!=='object'||!Number.isInteger(input.color)||input.color<0||input.color>7||!['plain','dip','speckle','rings'].includes(input.pattern))throw Error('Invalid glaze selection');if(firing)throw Error('Wait for the kiln to finish');checkpoint();state.step=1;state.glaze=input.color;state.pattern=input.pattern;updateAll();return {stage:'glazing',glaze:activeGlaze().name,pattern:state.pattern};}});
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
