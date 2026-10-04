import { LEVELS, newState, gameStep, groundAt, resetBody } from './physics.mjs';
(async()=>{
const root=document.getElementById("marionette-game");if(!root)return;
const $=id=>root.querySelector("#mg-"+id);
const start=$("start");
let T;
try{T=await import("./assets/three.module.min.js");}
catch(first){try{T=await import("https://unpkg.com/three@0.170.0/build/three.module.min.js");}catch(second){start.textContent="3D 引擎加载失败";$("overlay").querySelector("p").textContent="请检查网络连接，然后重新打开游戏。";return;}}
try{
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const scene=new T.Scene();scene.background=new T.Color("#131217");scene.fog=new T.FogExp2("#171419",.028);
const holder=$("canvas");const renderer=new T.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
holder.appendChild(renderer.domElement);renderer.domElement.setAttribute("role","img");renderer.domElement.setAttribute("aria-label","提线木偶的三维剧场。使用键盘或下方按钮移动和跳跃。");
const camera=new T.PerspectiveCamera(43,1,.1,100);camera.position.set(1,15,21);camera.lookAt(0,0,-1.5);
function resize(){const w=holder.clientWidth,h=holder.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w/h<.9?38:43;camera.position.set(.6,15,w/h<.9?23:21);camera.lookAt(0,0,-1.8);camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(holder);resize();
const mat=(color,metalness=0,roughness=.55)=>new T.MeshStandardMaterial({color,metalness,roughness});
const wood=mat("#af7846"),darkWood=mat("#40261b"),edge=mat("#7d5432"),gold=mat("#d3aa55",.6,.3),black=mat("#171919"),red=mat("#781f28"),jointMat=mat("#6e4127");
const velvet=mat("#542027",0,.96),bright=new T.MeshStandardMaterial({color:"#f7cf71",emissive:"#daa33e",emissiveIntensity:2,metalness:.3});
function mesh(geo,material,parent=scene){const m=new T.Mesh(geo,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(w,h,d,x,y,z,material,parent=scene){const m=mesh(new T.BoxGeometry(w,h,d),material,parent);m.position.set(x,y,z);return m;}
function sphere(r,x,y,z,material,parent=scene){const m=mesh(new T.SphereGeometry(r,16,12),material,parent);m.position.set(x,y,z);return m;}
function cylinder(r1,r2,len,x,y,z,material,parent=scene){const m=mesh(new T.CylinderGeometry(r1,r2,len,20),material,parent);m.position.set(x,y,z);return m;}
function rod(a,b,r,material,parent=scene){const m=mesh(new T.CylinderGeometry(r,r,1,12),material,parent);setRod(m,a,b);return m;}
function setRod(m,a,b){m.position.copy(a).add(b).multiplyScalar(.5);m.scale.y=a.distanceTo(b);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());}
scene.add(new T.HemisphereLight("#f4dcb2","#30213c",1.15));
const key=new T.SpotLight("#ffda99",950,50,.62,.7,2);key.position.set(-6,14,7);key.target.position.set(0,0,-1);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.bias=-.0002;scene.add(key,key.target);
const rim=new T.SpotLight("#ffeac0",1250,50,.65,.9,2);rim.position.set(8,12,-9);rim.target.position.set(0,0,-1);scene.add(rim,rim.target);
const fill=new T.PointLight("#bfa3c9",65,22,2);fill.position.set(-8,5,-5);scene.add(fill);
box(27,.8,28,0,-2.7,-2,darkWood);box(27,.45,.28,0,-2.05,12,edge);
for(let i=0;i<36;i++){box(.025,.01,27,-13+i*.75,-2.29,-2,black);}
for(const side of [-1,1]){
 box(.28,12,22,side*12,3.1,-2,black);
 for(let i=0;i<9;i++){const c=cylinder(.59,.63,11,side*(10.4+i*.48),3.3,-7+i*.15,velvet);c.scale.z=.8;}
 const col=cylinder(.26,.33,12,side*10.15,3.1,-8,gold);box(.6,.15,.65,side*10.15,9.1,-8,gold);
 for(let z=-9;z<9;z+=2.0){sphere(.09,side*9.3,.1,z,bright);const light=new T.PointLight("#ffb855",2,4);light.position.set(side*9.3,.4,z);scene.add(light);}
}
box(21,.23,.4,0,8.9,-9,gold);
for(let i=0;i<16;i++){const c=cylinder(.58,.69,3.8,-10+i*1.3,9,-10,velvet);c.rotation.z=Math.sin(i/15*Math.PI)*.14;}
for(let i=0;i<9;i++){const bulb=sphere(.12,-8+i*2,7.5-Math.sin(i/8*Math.PI),-9,bright);}
const back=box(22,11,.4,0,3,-13,mat("#211b21"));
const arch=new T.Mesh(new T.TorusGeometry(5.5,.045,8,72,Math.PI),gold);arch.position.set(0,1,-12.7);scene.add(arch);
const dustGeo=new T.BufferGeometry();const dustArr=new Float32Array(150*3);for(let i=0;i<150;i++){dustArr[i*3]=(Math.random()-.5)*23;dustArr[i*3+1]=Math.random()*10;dustArr[i*3+2]=(Math.random()-.5)*25;}
dustGeo.setAttribute("position",new T.BufferAttribute(dustArr,3));const dust=new T.Points(dustGeo,new T.PointsMaterial({color:"#e6c993",size:.028,transparent:true,opacity:.6}));scene.add(dust);
const pathGroup=new T.Group();scene.add(pathGroup);let starMeshes=[],portal=null,checkpointRing=null,pendulum=null;
const starShape=new T.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,r=i%2===0?.32:.145;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?starShape.lineTo(x,y):starShape.moveTo(x,y);}starShape.closePath();
const starGeometry=new T.ExtrudeGeometry(starShape,{depth:.09,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.025});
const outlineMat=new T.MeshStandardMaterial({color:"#d8b367",metalness:.5,roughness:.4});
function disposeGroup(group){while(group.children.length){const item=group.children[group.children.length-1];group.remove(item);item.traverse(o=>{if(o.geometry&&o.geometry!==starGeometry)o.geometry.dispose();});}}
function createLevel(index){
 disposeGroup(pathGroup);starMeshes=[];checkpointRing=null;pendulum=null;const l=LEVELS[index];
 l.platforms.forEach((p,i)=>{
  box(p.w,.38,p.d,p.x,-.19,p.z,edge,pathGroup);
  box(p.w-.035,.055,p.d-.035,p.x,.015,p.z,wood,pathGroup);
  const count=Math.ceil(p.w/.42);
  for(let j=1;j<count;j++){const x=p.x-p.w/2+j*p.w/count;box(.016,.008,p.d-.06,x,.047,p.z,darkWood,pathGroup);}
  for(const side of [-1,1])box(.035,.025,p.d,p.x+side*(p.w/2-.03),.05,p.z,gold,pathGroup);
  for(const side of [-1,1])for(const sideZ of [-1,1]){sphere(.027,p.x+side*(p.w/2-.15),.052,p.z+sideZ*(p.d/2-.14),black,pathGroup);}
  if(p.w>2.6){cylinder(.28,.45,2.2,p.x,-1.4,p.z,darkWood,pathGroup);}
  if(p.checkpoint){checkpointRing=mesh(new T.TorusGeometry(.6,.035,8,48),mat("#91aaa0",.4),pathGroup);checkpointRing.rotation.x=-Math.PI/2;checkpointRing.position.set(p.x,.07,p.z);}
 });
 l.stars.forEach(([x,z])=>{const group=new T.Group();pathGroup.add(group);group.position.set(x,.95,z);const star=mesh(starGeometry,bright,group);const ring=mesh(new T.TorusGeometry(.5,.012,5,36),gold,group);ring.rotation.x=Math.PI/2;ring.position.y=-.35;starMeshes.push(group);});
 portal=new T.Group();portal.position.set(l.end[0],.04,l.end[1]);pathGroup.add(portal);
 const disc=mesh(new T.CircleGeometry(.9,48),new T.MeshBasicMaterial({color:"#e0b567",transparent:true,opacity:.22,side:T.DoubleSide}),portal);disc.rotation.x=-Math.PI/2;
 const ring=mesh(new T.TorusGeometry(1,.06,12,64),bright,portal);ring.rotation.x=Math.PI/2;ring.position.y=.05;
 const upright=mesh(new T.TorusGeometry(1.15,.038,10,64),bright,portal);upright.position.y=1.15;
 const gateLight=new T.PointLight("#ffca70",22,5);gateLight.position.y=1;portal.add(gateLight);
 if(l.pendulum){pendulum=new T.Group();pathGroup.add(pendulum);pendulum.position.z=l.pendulum.z;pendulum.userData.ball=sphere(.48,0,.9,0,gold,pendulum);pendulum.userData.line=rod(new T.Vector3(0,5.4,0),new T.Vector3(0,.9,0),.025,gold,pendulum);sphere(.1,0,5.4,0,black,pendulum);}
}
const puppet=new T.Group();scene.add(puppet);
const bodyPivot=new T.Group();puppet.add(bodyPivot);bodyPivot.position.y=.96;
const torso=cylinder(.29,.23,.66,0,.35,0,wood,bodyPivot);
const vest=mesh(new T.CylinderGeometry(.302,.255,.45,18),red,bodyPivot);vest.position.set(0,.31,0);
for(let i=0;i<3;i++)sphere(.033,0,.16+i*.12,.258,gold,bodyPivot);
const neck=cylinder(.10,.10,.15,0,.8,0,jointMat,bodyPivot);
const head=sphere(.31,0,1.1,0,wood,bodyPivot);head.scale.set(.92,1.04,.94);
sphere(.042,-.105,1.13,.253,black,bodyPivot);sphere(.042,.105,1.13,.253,black,bodyPivot);
const nose=cylinder(.045,.05,.11,0,1.03,.30,edge,bodyPivot);nose.rotation.x=Math.PI/2;
const smile=mesh(new T.TorusGeometry(.086,.011,6,20,Math.PI),jointMat,bodyPivot);smile.position.set(0,.97,.265);smile.rotation.z=Math.PI;
const hat=cylinder(.31,.32,.07,0,1.41,0,black,bodyPivot);cylinder(.195,.24,.31,0,1.59,0,black,bodyPivot);cylinder(.232,.24,.075,0,1.48,0,red,bodyPivot);
const pelvis=sphere(.23,0,-.12,0,wood,bodyPivot);pelvis.scale.set(1.1,.8,.75);
const arms=[],legs=[];
function limb(side,type){const g=new T.Group();scene.add(g);const isArm=type==="arm";const j1=sphere(.105,0,0,0,jointMat,g),j2=sphere(.087,0,0,0,jointMat,g);
const upper=rod(new T.Vector3(),new T.Vector3(0,.4,0),isArm?.077:.10,wood,g),lower=rod(new T.Vector3(),new T.Vector3(0,.4,0),isArm?.065:.082,wood,g);
const tip=isArm?sphere(.105,0,0,0,wood,g):box(.21,.13,.39,0,0,0,black,g);
return {side,type,g,j1,j2,upper,lower,tip,mid:new T.Vector3(),end:new T.Vector3(),velM:new T.Vector3(),velE:new T.Vector3(),init:false};}
for(const side of [-1,1]){arms.push(limb(side,"arm"));legs.push(limb(side,"leg"));}
const controller=new T.Group();scene.add(controller);box(1.55,.10,.14,0,0,0,darkWood,controller);box(.13,.10,.75,0,.05,0,darkWood,controller);
for(const side of [-1,1])sphere(.06,side*.67,.05,0,gold,controller);
const stringMaterial=new T.LineBasicMaterial({color:"#e9d8aa",transparent:true,opacity:.58});const strings=[];
for(let i=0;i<4;i++){const geo=new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3()]);const line=new T.Line(geo,stringMaterial);scene.add(line);strings.push(line);}
const shadow=mesh(new T.CircleGeometry(.44,32),new T.MeshBasicMaterial({color:"#120e0b",opacity:.30,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;
let state=newState(),keys={},records=[0,0,0,0,0],highs=[0,0,0,0,0],bannerUntil=0,mode="story",savedStatus="ready";
try{const saved=JSON.parse(localStorage.getItem("marionette-v1")||"null");if(saved&&Array.isArray(saved.stars)){records=records.map((_,i)=>Math.max(0,Math.min(3,Number(saved.stars[i])||0)));highs=highs.map((_,i)=>Math.max(0,Number(saved.highs?.[i])||0));}}catch{}
let soundOn=false,audio=null;
function sound(type){if(!soundOn)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();audio.resume();const notes=type==="win"?[523,659,784,1047]:type==="star"?[784,1047]:type==="fall"?[220,130]:type==="jump"?[330]:type==="checkpoint"?[440,554,659]:[160];notes.forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type="sine";o.frequency.value=f;o.connect(g);g.connect(audio.destination);const t=audio.currentTime+i*.10;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.06,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+.28);o.start(t);o.stop(t+.3);});}catch{}}
function banner(text){$("banner").textContent=text;$("banner").classList.add("show");bannerUntil=performance.now()+2300;}
function buildActButtons(){const acts=$("acts");acts.replaceChildren();LEVELS.forEach((l,i)=>{const b=document.createElement("button");b.className="act"+(i===state.level?" active":"");b.setAttribute("aria-label","第"+(i+1)+"幕 "+l.name);b.innerHTML='<span class="roman">'+l.roman+'</span><span><b>'+l.name+'</b><small>ACT 0'+(i+1)+'</small></span><span class="record">'+(records[i]?"★".repeat(records[i]):"·")+'</span>';b.onclick=()=>selectLevel(i);acts.appendChild(b);});$("total").textContent=records.reduce((a,b)=>a+b,0)+" / 15";}
const keyboardKeys=new Set(),pointerKeys=new Map();
function syncKey(code){keys[code]=keyboardKeys.has(code)||Array.from(pointerKeys.values()).includes(code);root.querySelectorAll('[data-hold="'+code+'"]').forEach(b=>b.classList.toggle('held',!!keys[code]));}
function clearKeys(){keys={};keyboardKeys.clear();pointerKeys.clear();state.jumpBuffer=0;root.querySelectorAll(".held").forEach(b=>b.classList.remove("held"));}
function readyOverlay(){const o=$("overlay");o.className="overlay ready";o.innerHTML='<div class="modal"><div><h2>'+LEVELS[state.level].name+'</h2><p>'+LEVELS[state.level].tip+'</p></div><button class="primary" id="mg-begin">开始演出</button></div>';$("begin").onclick=begin;}
function selectLevel(index){clearKeys();state=newState(index,mode==="practice");createLevel(index);buildActButtons();arms.concat(legs).forEach(l=>l.init=false);$("chapter").textContent="ACT "+LEVELS[index].roman+" · "+LEVELS[index].en;$("title").textContent=LEVELS[index].name;$("goal").textContent=state.practice?LEVELS[index].goal:"青环稳住 2 秒 · 收集 2 星 · 抵达终点";$("status").textContent="等待开场";readyOverlay();updateHUD();}
function begin(){state.status="playing";$("overlay").className="overlay hidden";$("status").textContent=state.practice?"自由排练":"演出进行中";clearKeys();banner(state.practice?LEVELS[state.level].tip:"在青色圆环内站稳 2 秒，收集至少 2 颗星光。");sound("checkpoint");}
function pause(){if(state.status==="playing"){state.status="paused";clearKeys();$("overlay").className="overlay";$("overlay").innerHTML='<div class="modal"><div class="overline">INTERMISSION</div><h2>幕间休息</h2><p>舞台在这里，等你回来。</p><button class="primary" id="mg-resume">继续演出</button><button class="secondary" id="mg-again">重新开始</button></div>';$("resume").onclick=()=>{clearKeys();state.status="playing";$("overlay").className="overlay hidden";};$("again").onclick=()=>selectLevel(state.level);}else if(state.status==="paused"){$("resume")?.click();}}
function help(){if(state.status==="help")return;savedStatus=state.status;state.status="help";clearKeys();$("overlay").className="overlay";$("overlay").innerHTML='<div class="modal"><div class="overline">THE PUPPETEER’S GUIDE</div><h2>掌握你的提线</h2><div class="help-list"><div><kbd>W A S D</kbd> 或方向键：控制移动。</div><div><kbd>Q</kbd><kbd>E</kbd> 左右提线：轻点修正倾斜。</div><div><kbd>Q + E</kbd> 或 Shift：收紧双线，减速稳定。</div><div><kbd>空格</kbd> 起跳，跨越舞台缺口。</div><div><kbd>R</kbd> 返回检查点；P 暂停。</div><div>触碰青色圆环激活检查点。在环内停下、身体保持平衡 2 秒，完成定点表演（+250）。挑战模式需完成表演并收集至少 2 星，才能通过终点。每星 +150，通关 +500，另有时间奖励；每次跌落扣 25 分。</div><div>自由排练降低平衡难度，可直接通过终点。最高星数与纪录仅保存在本机。</div></div><button class="primary" id="mg-help-close">回到舞台</button></div>';$("help-close").onclick=()=>{if(savedStatus==="ready"){state.status="ready";readyOverlay();}else if(savedStatus==="won"){state.status="won";renderResult();}else{clearKeys();state.status="playing";$("overlay").className="overlay hidden";if(savedStatus==="paused")pause();}};}
function onWin(){
 const n=state.stars.filter(Boolean).length;if(!state.practice){records[state.level]=Math.max(records[state.level],n);highs[state.level]=Math.max(highs[state.level],state.score);try{localStorage.setItem("marionette-v1",JSON.stringify({stars:records,highs}));}catch{}}
 buildActButtons();renderResult();spawnConfetti();
}
function renderResult(){
 const n=state.stars.filter(Boolean).length;$("status").textContent="演出完成";const last=state.level===4;
 $("overlay").className="overlay";$("overlay").innerHTML='<div class="modal"><div class="overline">'+(last?"THE FINAL CURTAIN":"BRAVO, PUPPETEER")+'</div><h2>'+(last?"谢幕，木偶师":"漂亮的演出")+'</h2><div class="result-stars">'+"★".repeat(n)+"☆".repeat(3-n)+'</div><p>本幕得分 '+state.score+' · 用时 '+Math.floor(state.time)+' 秒<br>跌落 '+state.falls+' 次 · 本机最高 '+highs[state.level]+' 分</p><button class="primary" id="mg-next">'+(last?"再次巡演":"下一幕")+'</button><button class="secondary" id="mg-replay">再试一次</button></div>';
 $("next").onclick=()=>selectLevel(last?0:state.level+1);$("replay").onclick=()=>selectLevel(state.level);
}
function updateHUD(){$("score").textContent=String(state.score).padStart(4,"0");$("stars").textContent=state.stars.filter(Boolean).length+" / 3";const t=Math.floor(state.time);$("time").textContent=String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0");$("falls").textContent=state.falls;$("checkpoint").textContent=state.poseDone?"平衡表演完成":state.checked?"表演 "+Math.min(2,state.poseTime).toFixed(1)+" / 2 秒":"起点";$("needle").style.left=Math.max(2,Math.min(98,50+state.roll*36))+"%";const a=Math.abs(state.roll);$("balance-label").textContent=a>.9?"快拉线稳住":a>.48?"身体倾斜":"稳稳当当";$("balance-label").style.color=a>.9?"#eaa18c":"#d8b46b";$("wind").textContent=LEVELS[state.level].wind?"侧风 "+(state.wind<0?"←":"→")+" "+Math.round(Math.abs(state.wind)/LEVELS[state.level].wind*100)+"%":"";}
$("help").onclick=help;$("pause").onclick=pause;$("sound").onclick=()=>{soundOn=!soundOn;$("sound").textContent=soundOn?"♫":"♪";$("sound").setAttribute("aria-label",soundOn?"关闭音效":"开启音效");$("sound").title=soundOn?"关闭音效":"开启音效";if(soundOn)sound("star");};
$("retry").onclick=()=>selectLevel(state.level);
$("touch-reset").onclick=()=>{if(state.status==="playing"){state.falls++;resetBody(state);clearKeys();banner("已回到检查点");}};
root.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;root.querySelectorAll("[data-mode]").forEach(n=>n.classList.toggle("active",n===b));selectLevel(state.level);});
root.querySelectorAll("[data-hold]").forEach(b=>{const code=b.dataset.hold;b.addEventListener("pointerdown",e=>{e.preventDefault();if(state.status!=="playing")return;b.setPointerCapture(e.pointerId);pointerKeys.set(e.pointerId,code);syncKey(code);if(code==="Space")state.jumpBuffer=.14;});const release=e=>{pointerKeys.delete(e.pointerId);syncKey(code);};b.addEventListener("pointerup",release);b.addEventListener("pointercancel",release);b.addEventListener("lostpointercapture",release);});
const accepted=["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowLeft","ArrowDown","ArrowRight","KeyQ","KeyE","ShiftLeft","ShiftRight","Space","KeyP","Escape","KeyR"];
window.addEventListener("keydown",e=>{if(!accepted.includes(e.code)||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(state.status==="playing")e.preventDefault();if(e.repeat)return;if(e.code==="Escape"&&state.status==="help"){$("help-close")?.click();return;}if(e.code==="KeyP"||e.code==="Escape"){pause();return;}if(state.status!=="playing")return;if(e.code==="KeyR"){state.falls++;resetBody(state);clearKeys();banner("已回到检查点");return;}keyboardKeys.add(e.code);syncKey(e.code);if(e.code==="Space")state.jumpBuffer=.14;});
window.addEventListener("keyup",e=>{keyboardKeys.delete(e.code);syncKey(e.code);});
window.addEventListener("blur",()=>{clearKeys();if(state.status==="playing")pause();});document.addEventListener("visibilitychange",()=>{if(document.hidden){clearKeys();if(state.status==="playing")pause();}});
const confetti=[];function spawnConfetti(){if(reduced)return;for(let i=0;i<65;i++){const m=mesh(new T.BoxGeometry(.05,.08,.015),i%3===0?red:gold);m.position.set(state.x+(Math.random()-.5)*2,2+Math.random()*3,state.z+(Math.random()-.5)*2);confetti.push({m,v:new T.Vector3((Math.random()-.5)*3,1+Math.random()*3,(Math.random()-.5)*3),life:4});}}
function animatePuppet(dt,elapsed){
 const s=state;puppet.position.set(s.x,s.y,s.z);bodyPivot.rotation.z=-s.roll;bodyPivot.rotation.x=s.vz*.045;
 if(s.status==="ready"&&!reduced)bodyPivot.rotation.z=Math.sin(elapsed*1.4)*.035;
 puppet.updateMatrixWorld(true);controller.position.set(s.x+.14*s.vx,s.y+3.7,s.z);controller.rotation.z=-s.roll*.3+(keys.KeyQ?.10:0)-(keys.KeyE?.10:0);
 const gait=s.time*Math.max(2,Math.hypot(s.vx,s.vz)*3);const moving=Math.min(1,Math.hypot(s.vx,s.vz)/2);
 for(const l of arms.concat(legs)){
  const arm=l.type==="arm",side=l.side;
  const anchor=bodyPivot.localToWorld(new T.Vector3(side*(arm?.33:.16),arm?.64:-.14,0));
  const phase=gait+(side===1?Math.PI:0);const swing=Math.sin(phase)*moving;
  const lift=!!((side<0&&keys.KeyQ)||(side>0&&keys.KeyE)||keys.ShiftLeft||keys.ShiftRight);
  let midTarget,endTarget;
  if(arm){midTarget=anchor.clone().add(new T.Vector3(side*.27,-.30+Number(lift)*.18,swing*.12));endTarget=anchor.clone().add(new T.Vector3(side*.47,-.55+Number(lift)*.43,.03-swing*.17));}
  else{midTarget=anchor.clone().add(new T.Vector3(side*.03,-.34,swing*.17));endTarget=new T.Vector3(s.x+side*.18,s.y+.075+Math.max(0,swing)*.17,s.z+swing*.29+.06);if(!s.grounded){midTarget.y+=.08;endTarget.y+=.2;}}
  if(!l.init||l.end.distanceTo(endTarget)>2){l.mid.copy(midTarget);l.end.copy(endTarget);l.velM.set(0,0,0);l.velE.set(0,0,0);l.init=true;}
  const spring=arm?90:180;const damping=Math.exp(-(arm?10:18)*dt);
  l.velM.addScaledVector(midTarget.clone().sub(l.mid),spring*dt).multiplyScalar(damping);l.mid.addScaledVector(l.velM,dt);
  l.velE.addScaledVector(endTarget.clone().sub(l.end),spring*dt).multiplyScalar(damping);l.end.addScaledVector(l.velE,dt);
  const maxLen=arm?.48:.48;for(let n=0;n<3;n++){const d=l.mid.clone().sub(anchor);if(d.length()>maxLen)l.mid.copy(anchor).add(d.setLength(maxLen));const d2=l.end.clone().sub(l.mid);if(d2.length()>maxLen)l.end.copy(l.mid).add(d2.setLength(maxLen));}
  l.j1.position.copy(anchor);l.j2.position.copy(l.mid);l.tip.position.copy(l.end);setRod(l.upper,anchor,l.mid);setRod(l.lower,l.mid,l.end);
 }
 controller.updateMatrixWorld(true);
 const anchors=[controller.localToWorld(new T.Vector3(-.67,0,0)),controller.localToWorld(new T.Vector3(.67,0,0)),controller.localToWorld(new T.Vector3(-.3,0,.1)),controller.localToWorld(new T.Vector3(.3,0,.1))];
 const ends=[arms[0].end,arms[1].end,bodyPivot.localToWorld(new T.Vector3(-.3,.64,0)),bodyPivot.localToWorld(new T.Vector3(.3,.64,0))];
 strings.forEach((line,i)=>{const a=line.geometry.attributes.position;a.setXYZ(0,anchors[i].x,anchors[i].y,anchors[i].z);a.setXYZ(1,ends[i].x,ends[i].y,ends[i].z);a.needsUpdate=true;line.geometry.computeBoundingSphere();});
 shadow.position.set(s.x,.071,s.z);shadow.visible=!!groundAt(LEVELS[s.level],s.x,s.z);shadow.scale.setScalar(Math.max(.5,1-s.y*.13));shadow.material.opacity=.30*Math.max(.2,1-s.y*.2);
}
function visualStep(dt,t){
 animatePuppet(dt,t);starMeshes.forEach((m,i)=>{m.visible=!state.stars[i];m.position.y=.95+(reduced?0:Math.sin(t*2+i)*.11);m.children[0].rotation.y=t*.7;});
 if(checkpointRing){checkpointRing.material.color.set(state.poseDone?"#e6ce8d":state.checked?"#b7e6c8":"#91aaa0");checkpointRing.scale.setScalar(state.poseDone?1.15:1+state.poseTime*.1);}
 if(pendulum){const d=LEVELS[state.level].pendulum;const x=Math.sin(state.time*d.speed)*d.amp;pendulum.userData.ball.position.set(x,.9,0);setRod(pendulum.userData.line,new T.Vector3(0,5.4,0),new T.Vector3(x,.9,0));}
 if(!reduced){dust.rotation.y=t*.009;portal.children[2].rotation.z=Math.sin(t*.6)*.03;}
 for(let i=confetti.length-1;i>=0;i--){const c=confetti[i];c.life-=dt;c.v.y-=3*dt;c.m.position.addScaledVector(c.v,dt);c.m.rotation.x+=dt*2;c.m.rotation.z+=dt;if(c.life<=0){scene.remove(c.m);c.m.geometry.dispose();confetti.splice(i,1);}}
 if(performance.now()>bannerUntil)$("banner").classList.remove("show");
}
createLevel(0);buildActButtons();start.disabled=false;start.textContent="开始演出";start.onclick=begin;
let last=performance.now(),acc=0,ui=0;const fixed=1/120;
function frame(now){if(!root.isConnected){renderer.dispose();return;}requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;acc+=dt;ui+=dt;while(acc>=fixed){gameStep(state,keys,fixed);acc-=fixed;}
 while(state.events.length){const e=state.events.shift();if(["star","fall","jump","checkpoint","win","pose"].includes(e))sound(e);if(e==="star")banner("星光 +150");if(e==="pose")banner("平衡表演完成 +250");if(e==="locked")banner(!state.poseDone?"先回到青环，站稳 2 秒完成表演":"收集至少 2 颗星光，终点才会开启");if(e==="checkpoint")banner("检查点已激活 · 在环内站稳 2 秒");if(e==="hit")banner("碰到摆锤了，双线稳住！");if(e==="fall"){clearKeys();arms.concat(legs).forEach(l=>l.init=false);banner("重新提起线，再来一次");}if(e==="win")onWin();}
 if(ui>.07){updateHUD();ui=0;}visualStep(dt,now/1000);renderer.render(scene,camera);}
requestAnimationFrame(frame);
const api={getState:()=>({level:state.level+1,title:LEVELS[state.level].name,status:state.status,stars:state.stars.filter(Boolean).length,score:state.score,seconds:Math.floor(state.time),simulationTime:state.time,position:{x:state.x,y:state.y,z:state.z,grounded:state.grounded},balance:state.roll,velocity:{x:state.vx,y:state.vy,z:state.vz},falls:state.falls,balancePerformanceComplete:state.poseDone,practice:state.practice}),selectLevel:(i)=>{if(!Number.isInteger(i)||i<1||i>5)throw new Error("幕数必须为 1 到 5 的整数");selectLevel(i-1);return api.getState();}};
root.game=api;
if(document.modelContext?.registerTool){try{await document.modelContext.registerTool({name:"read_marionette_game",description:"查看木偶游戏当前关卡、分数与状态",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>api.getState()});await document.modelContext.registerTool({name:"select_marionette_act",description:"选择第 1 到 5 幕并重置该幕为待开始状态",inputSchema:{type:"object",properties:{act:{type:"integer",minimum:1,maximum:5}},required:["act"],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>api.selectLevel(input.act)});}catch{}}
}catch(err){start.disabled=true;start.textContent="舞台暂时无法启动";$("overlay").className="overlay";$("overlay").querySelector("p").textContent="当前设备需要支持 WebGL 的浏览器。可以在桌面 Chrome 或 Edge 中重新打开。";console.error(err);}
})();
