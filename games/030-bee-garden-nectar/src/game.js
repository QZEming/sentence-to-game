import {buildWorld,T} from './world.js';
import {SPECIES,UPGRADES,freshState,sanitizeSave,capacity,level,collect,deposit,purchase,questStatus,completeQuests} from './core.js';

const $=id=>document.getElementById(id);const clamp=T.MathUtils.clamp;const SAVE_KEY='honey-garden-v1';
let state=freshState(),saveAvailable=true,hasSave=false;
try{const s=localStorage.getItem(SAVE_KEY);if(s){state=sanitizeSave(JSON.parse(s));hasSave=true;}}catch{saveAvailable=false;}
let w;
try{w=buildWorld($('world'));}catch(error){$('loading').innerHTML='<div class="error-message"><strong>花园暂时无法打开</strong><p>这个游戏需要 WebGL 2。请使用支持硬件加速的新版浏览器，再刷新试试。</p><button class="primary" onclick="location.reload()">重新打开</button></div>';console.error(error);throw error;}
const {renderer,scene,camera,player,flowers,hivePos}=w;
let started=false,paused=false,photoMode=false,modalType='',navTarget=null,nearest=null,collecting=null,frameTime=0,uiTime=0,saveTime=0,collisionCooldown=0,combo=0,comboTime=0,lastHarvest=null,bagWarning=false;
let viewAngle=.61,viewDistance=59,dragging=false,dragX=0,lastPointer=null,boostTouch=false;
function currentWeather(time){const day=Math.floor(time/300),t=time%300;return t>185&&t<270?'night':((day%3===1&&t>40&&t<140)||(day%3===0&&t>125&&t<170))?'rain':'sun';}
let race=null,raceCooldown=0,weather=currentWeather(state.dayTime),lastWeather='',lastLevel=level(state),rescue=false,saveWarned=false;
let audioEnabled=false,audioCtx=null,melodyTimer=0,melodyIndex=0;
let tutorialStage=hasSave?3:0;
const keys=new Set(),joystick={x:0,y:0,active:false},raycaster=new T.Raycaster(),pointer=new T.Vector2(),groundPlane=new T.Plane(new T.Vector3(0,1,0),-.12);
const mapCtx=$('minimap').getContext('2d');
const cameraTarget=new T.Vector3(0,0,0);const v=new T.Vector3();let focusBeforeModal=null;
function toast(message){const el=document.createElement('div');el.className='toast';el.innerHTML=message;$('toasts').appendChild(el);setTimeout(()=>{el.style.opacity='0';el.style.transition='opacity .3s';setTimeout(()=>el.remove(),350);},4200);}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));saveAvailable=true;}catch{saveAvailable=false;if(!saveWarned){toast('当前浏览器无法保存进度，本次冒险仍可继续。');saveWarned=true;}}}
function tone(freq=440,duration=.14,type='sine',volume=.035){if(!audioEnabled||!audioCtx)return;try{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,audioCtx.currentTime);g.gain.linearRampToValueAtTime(volume,audioCtx.currentTime+.012);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration);}catch{}}
function chime(){tone(659,.2);setTimeout(()=>tone(880,.3),120);}
function start(){started=true;$('hud').classList.add('started');$('welcome').hidden=true;$('controls-hint').hidden=false;toast('欢迎来到蜜境 ✿ 点击花朵，或用 WASD 飞过去。');if(state.nectar>0)toast('上次的花蜜还在背包里，可以先回蜂巢。');save();}
$('start').onclick=start;if(hasSave)$('start').innerHTML='继续花园里的生活 <span>✦</span>';
function goHome(){if(!started)start();if(paused)closeModal();navTarget=hivePos.clone();w.target.position.set(hivePos.x,.16,hivePos.z);w.target.visible=true;toast('朝着蜂巢出发 ⌂ 到家会自动酿蜜和恢复体力。');}
$('home').onclick=goHome;
$('sound').onclick=()=>{audioEnabled=!audioEnabled;if(audioEnabled){try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();audioCtx.resume();}catch{audioEnabled=false;toast('当前浏览器暂不支持声音。');}}$('sound').setAttribute('aria-label',audioEnabled?'关闭声音':'开启声音');$('sound').title=audioEnabled?'关闭声音':'开启声音';$('sound').querySelector('span').hidden=audioEnabled;if(audioEnabled)chime();};
function openModal(type){focusBeforeModal=document.activeElement;paused=true;keys.clear();joystick.x=joystick.y=0;modalType=type;$('modal').hidden=false;renderModal(type);$('close-modal').focus();}
function closeModal(){paused=false;modalType='';$('modal').hidden=true;focusBeforeModal?.focus?.();}
$('close-modal').onclick=closeModal;$('modal').addEventListener('click',e=>{if(e.target===$('modal'))closeModal();});
$('shop').onclick=()=>openModal('shop');$('book').onclick=()=>openModal('book');$('help').onclick=()=>openModal('help');$('pause').onclick=()=>openModal('pause');
function renderModal(type){
 if(type==='shop'){
  $('modal-content').innerHTML=`<div class="eyebrow">A SWEETER TOMORROW</div><h2 id="modal-title">蜂巢工坊</h2><p class="modal-intro">把今天的收获，变成明天飞得更远的力量。</p>${UPGRADES.map(u=>{let lv=state.upgrades[u.key],cost=u.prices[lv];return `<div class="upgrade"><div class="upgrade-icon">${u.icon}</div><div class="upgrade-info"><h3>${u.name}<span>Lv. ${lv}/3</span></h3><p>${u.description}</p></div><button data-upgrade="${u.key}" ${cost===undefined||state.honey<cost?'disabled':''}>${cost===undefined?'已升满':`${cost}g 蜂蜜`}</button></div>`;}).join('')}<div class="balance">可用蜂蜜 <strong>${Math.floor(state.honey)} g</strong> · 随时升级，效果立即生效</div>`;
  document.querySelectorAll('[data-upgrade]').forEach(b=>b.onclick=()=>{if(purchase(state,b.dataset.upgrade)){chime();checkQuests();save();renderModal('shop');updateUI();}});
 }else if(type==='book'){
  $('modal-content').innerHTML=`<div class="eyebrow">THE GARDEN COLLECTION</div><h2 id="modal-title">花朵图鉴 <small style="font-size:14px;color:#99a18b">${state.discovered.length} / 4</small></h2><p class="modal-intro">采下一滴花蜜，就能留住一段花开的记忆。</p><div class="flower-grid">${SPECIES.map((s,i)=>{let found=state.discovered.includes(i);return `<div class="flower-card ${found?'':'undiscovered'}"><span class="flower-icon" style="color:${s.color}">${s.icon}</span><h3>${s.name}</h3><p>${s.note}</p><span class="stamp">${found?'✓ 已收集花蜜':`等待发现 · ${s.region}`}</span></div>`;}).join('')}</div><div class="pause-actions"><button class="primary" id="race-start">花间竞速 · 奖励 25g</button></div><p class="save-note">沿金色圆环飞行，60 秒内穿过全部 6 个圆环。也可按 R 开始。</p>`;
  $('race-start').onclick=startRace;
 }else if(type==='help'){
  $('modal-content').innerHTML=`<div class="eyebrow">A FIELD GUIDE FOR LITTLE BEES</div><h2 id="modal-title">小蜜蜂飞行指南</h2><div class="help-grid"><span><kbd>W A S D</kbd> / 方向键</span><span>沿屏幕方向飞行；也可以直接点击地面或花朵。</span><span><kbd>Shift</kbd> / 手机 ϟ</span><span>消耗体力，加速飞行。</span><span><kbd>Space</kbd></span><span>抬高飞行高度，松开后自动降低。</span><span><kbd>H</kbd></span><span>自动返回蜂巢，酿蜜并补充体力。</span><span><kbd>R</kbd></span><span>开始 60 秒花间竞速，穿过 6 个金环赢取 25g 蜂蜜。</span><span>滚轮 / <kbd>Q E</kbd></span><span>缩放视角 / 旋转花园。右键拖动也可以旋转。</span><span><kbd>Esc</kbd></span><span>暂停或返回游戏。</span></div><div class="help-note">靠近花朵并停留，会自动采蜜。每采空一朵花完成一次授粉，花蜜稍后重新长满。20 秒内连续采空不同的花，最多获得 1.5 倍奖励。雨天花蜜额外增值 25%。向日葵附近有黄蜂，会消耗体力；体力耗尽时会安全送你回家，花蜜不会丢失。</div><p class="save-note">${saveAvailable?'进度自动保存在当前浏览器；换设备不会同步。':'当前浏览器无法保存进度。'}</p>`;
 }else if(type==='pause'){
  $('modal-content').innerHTML=`<div class="eyebrow">TAKE A LITTLE BREATHER</div><h2 id="modal-title">花园等你回来</h2><p class="modal-intro">时间已暂停。去喝一口水吧，甜蜜不着急。</p><div class="balance">累计酿蜜 <strong>${Math.floor(state.totalHoney)}g</strong>　·　授粉 <strong>${state.harvests}</strong> 朵　·　等级 <strong>${level(state)}</strong><br><br>竞速完成 ${state.races} 次${state.bestRace?` · 最佳 ${state.bestRace.toFixed(1)} 秒`:''}</div><div class="pause-actions"><button class="primary" id="resume">继续飞行</button><button class="secondary" id="race-start">花间竞速</button><button class="secondary danger" id="reset">重新开始</button></div><p class="save-note">${saveAvailable?'冒险进度已自动保存到此浏览器。':'浏览器存储不可用，关闭页面后本次进度将丢失。'}</p>`;
  $('resume').onclick=closeModal;$('race-start').onclick=startRace;$('reset').onclick=()=>renderModal('reset');save();
 }else if(type==='reset'){
  $('modal-content').innerHTML='<div class="eyebrow">A NEW BEGINNING</div><h2 id="modal-title">重新开始这段冒险？</h2><p class="modal-intro">将清除当前浏览器里的蜂蜜、升级、图鉴和任务进度。</p><div class="pause-actions"><button class="secondary" id="cancel-reset">保留我的花园</button><button class="primary danger" id="confirm-reset">清除进度并重新开始</button></div>';
  $('cancel-reset').onclick=()=>renderModal('pause');$('confirm-reset').onclick=()=>{state=freshState();tutorialStage=0;race=null;rescue=false;combo=0;comboTime=0;lastLevel=1;navTarget=null;raceCooldown=0;bagWarning=false;w.raceGroup.visible=false;w.target.visible=false;flowers.forEach(f=>{f.stock=f.max;f.regrow=0;f.harvested=false;});player.position.set(-4,1.8,5);save();closeModal();updateUI();toast('新的一天，新的花香。欢迎回来 ✿');};
 }
}
function setPhoto(on){photoMode=on;$('hud').hidden=on;$('photo-hint').hidden=!on;keys.clear();}
$('photo').onclick=()=>setPhoto(true);$('photo-hint').onclick=()=>setPhoto(false);
$('zoom-in').onclick=()=>viewDistance=clamp(viewDistance-5,33,85);$('zoom-out').onclick=()=>viewDistance=clamp(viewDistance+5,33,85);$('rotate').onclick=()=>viewAngle+=Math.PI/4;
function startRace(){if(!started)start();closeModal();if(race){toast('竞速正在进行，沿金色圆环继续飞吧！');return;}if(raceCooldown>0){toast(`花环正在重新盛开，${Math.ceil(raceCooldown)} 秒后再来。`);return;}navTarget=null;w.target.visible=false;race={index:0,remaining:60,elapsed:0};w.raceGroup.visible=true;w.rings.forEach((r,i)=>{r.visible=true;r.material.color.set(i===0?'#ffcf44':'#ddd6a2');r.material.emissiveIntensity=i===0?.9:.1;});toast('花间竞速开始！60 秒内依次穿过 6 个金色圆环。');}
document.addEventListener('keydown',e=>{
 if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code)){if(e.code!=='Tab')e.preventDefault();}
 if(e.code==='Escape'){if(photoMode)setPhoto(false);else if(paused)closeModal();else openModal('pause');return;}
 if(paused){if(e.code==='Tab'){const els=$('modal').querySelectorAll('button:not(:disabled),[tabindex="0"]');const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}return;}
 if(photoMode)return;
 if(!e.repeat){if(e.code==='KeyH')goHome();if(e.code==='KeyR')startRace();if(e.code==='KeyB')openModal('book');if(e.code==='KeyU')openModal('shop');}
 keys.add(e.code);if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){if(!started)start();navTarget=null;w.target.visible=false;}
});document.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>{keys.clear();joystick.x=joystick.y=0;boostTouch=false;if(started&&!paused&&!photoMode)openModal('pause');save();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();save();}});window.addEventListener('pagehide',save);
function hitGround(e){const rect=$('world').getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);let p=new T.Vector3();return raycaster.ray.intersectPlane(groundPlane,p)?p:null;}
function navigate(p){if(!started)start();if(!p)return;let dist=Math.hypot(p.x,p.z);if(dist>22.5){p.x*=22.5/dist;p.z*=22.5/dist;}const ring=race?w.rings[race.index]:null;let flower=flowers.reduce((best,f)=>Math.hypot(f.x-p.x,f.z-p.z)<(best?Math.hypot(best.x-p.x,best.z-p.z):2)?f:best,null);if(ring&&Math.hypot(ring.position.x-p.x,ring.position.z-p.z)<3)p.copy(ring.position);else if(flower)p.set(flower.x,1.8,flower.z);navTarget=p.clone();w.target.position.set(p.x,.16,p.z);w.target.visible=true;}
$('world').addEventListener('pointerdown',e=>{lastPointer={x:e.clientX,y:e.clientY};if(e.button===2||photoMode){dragging=true;dragX=e.clientX;$('world').setPointerCapture(e.pointerId);}});
$('world').addEventListener('pointermove',e=>{if(dragging){viewAngle-=(e.clientX-dragX)*.008;dragX=e.clientX;}});
$('world').addEventListener('pointerup',e=>{if(!dragging&&!paused&&!photoMode&&e.button===0&&lastPointer&&Math.hypot(e.clientX-lastPointer.x,e.clientY-lastPointer.y)<10)navigate(hitGround(e));dragging=false;});
$('world').addEventListener('pointercancel',()=>{dragging=false;lastPointer=null;});$('world').addEventListener('contextmenu',e=>e.preventDefault());$('world').addEventListener('wheel',e=>{e.preventDefault();viewDistance=clamp(viewDistance+e.deltaY*.025,33,85);},{passive:false});
$('minimap').addEventListener('pointerdown',e=>{if(paused)return;const r=$('minimap').getBoundingClientRect();navigate(new T.Vector3(((e.clientX-r.left)/r.width-.5)*52,1.8,((e.clientY-r.top)/r.height-.5)*43));});
const joy=$('joystick');function joyMove(e){const r=joy.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,len=Math.hypot(dx,dy),limit=25;joystick.x=dx/Math.max(limit,len);joystick.y=dy/Math.max(limit,len);$('joystick-knob').style.transform=`translate(${joystick.x*limit}px,${joystick.y*limit}px)`;navTarget=null;w.target.visible=false;}
joy.addEventListener('pointerdown',e=>{if(!started)start();joystick.active=true;joy.setPointerCapture(e.pointerId);joyMove(e);});joy.addEventListener('pointermove',e=>{if(joystick.active)joyMove(e);});function joyEnd(){joystick.active=false;joystick.x=joystick.y=0;$('joystick-knob').style.transform='';}joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);
$('mobile-boost').addEventListener('pointerdown',e=>{boostTouch=true;e.target.setPointerCapture(e.pointerId);});for(const ev of ['pointerup','pointercancel'])$('mobile-boost').addEventListener(ev,()=>boostTouch=false);
function checkQuests(){for(const q of completeQuests(state)){toast(`✧ 手记完成：${q.name} <b>+${q.reward}g 蜂蜜</b>`);chime();}if(state.quests.every(Boolean))$('quest-foot').textContent='你已成为花园的守护者。';}
function updateUI(){
 const cap=capacity(state);$('honey').innerHTML=`${Math.floor(state.honey)} <em>g</em>`;$('nectar-text').textContent=`${Math.floor(state.nectar)} / ${cap}`;$('nectar-bar').style.width=`${state.nectar/cap*100}%`;$('energy-text').textContent=`${Math.ceil(state.energy)}%`;$('energy-bar').style.width=`${state.energy}%`;$('energy-bar').style.background=state.energy<25?'#d9915f':'#8ba777';
 const lv=level(state);$('rank').textContent=lv>=6?'花园守护者':lv>=4?'金牌采蜜师':lv>=2?'花田旅行家':'见习采蜜师';$('level').textContent=`Lv. ${lv} · ${state.harvests} 次温柔授粉`;$('xp-label').textContent=`${Math.floor(state.xp)} XP`;$('book-count').textContent=`${state.discovered.length}/4`;
 const qs=questStatus(state);let active=state.quests.findIndex(x=>!x);$('quest-list').innerHTML=qs.map((q,i)=>`<div class="quest ${state.quests[i]?'completed':i===active?'active':''}"><div class="quest-no">${state.quests[i]?'✓':String(i+1).padStart(2,'0')}</div><div class="quest-body"><strong>${q.name}</strong><p>${q.desc}</p>${i===active?`<div class="quest-progress"><i style="width:${q.current/q.max*100}%"></i></div><div class="quest-meta"><span>${Math.floor(q.current)} / ${q.max}${q.extra===false&&q.current===100?' · 待升级':''}</span><span>+${q.reward}g 蜂蜜</span></div>`:''}</div></div>`).join('');
 $('status-message').textContent=rescue?'体力恢复中，正在安全回家':state.nectar>=cap-.01?'背包满啦，按 H 回蜂巢酿蜜':state.energy<25?'体力不多了，回家歇一歇':collecting?'轻轻停留，正在采集花蜜':'花朵旁停留，即可自动采蜜';
 const day=Math.floor(state.dayTime/300)+1,t=state.dayTime%300,hour=(6+t/300*24)%24;const hh=String(Math.floor(hour)).padStart(2,'0'),mm=String(Math.floor((hour%1)*60)).padStart(2,'0');$('day-label').textContent=`第 ${day} 天 · ${hh}:${mm}`;
 $('weather-label').textContent=weather==='rain'?'细雨润花 · 花蜜 +25%':weather==='night'?'萤火之夜':'晴日微风';$('weather-icon').textContent=weather==='rain'?'☂':weather==='night'?'☾':'☀';
 let loc='花园小径';for(const p of w.patches)if(Math.hypot(player.position.x-p.x,player.position.z-p.z)<6)loc=SPECIES[p.type].region;if(player.position.distanceTo(hivePos)<4)loc='温暖的蜂巢';if(Math.hypot(player.position.x-10,player.position.z-2)<5)loc='睡莲池塘';$('location').textContent=loc;
 if(race){$('combo').hidden=false;$('combo').textContent=`✧ 花间竞速 ${race.index}/6 · ${Math.ceil(race.remaining)} 秒`;}else if(combo>=2&&comboTime>0){$('combo').hidden=false;$('combo').textContent=`✿ 连续授粉 ×${combo} · 甜蜜加成 ${Math.min(1.5,1+(combo-1)*.1).toFixed(1)}×`;}else $('combo').hidden=true;
 if(lv>lastLevel){lastLevel=lv;toast(`✦ 升到 Lv. ${lv}！又是闪闪发光的一天。`);chime();}
 drawMap();
}
function drawMap(){const c=mapCtx;c.clearRect(0,0,200,160);c.save();c.translate(100,80);c.scale(200/52,160/43);c.beginPath();c.ellipse(0,0,23.7,23.7,0,0,Math.PI*2);c.fillStyle='#dce5c5';c.fill();c.strokeStyle='#c7d3ae';c.lineWidth=.3;c.stroke();c.beginPath();c.ellipse(10,2,4.7,3.2,0,0,Math.PI*2);c.fillStyle='#9ecfd0';c.fill();for(const p of w.patches){c.fillStyle=SPECIES[p.type].color;c.globalAlpha=.8;c.beginPath();c.ellipse(p.x,p.z,4,3.3,0,0,Math.PI*2);c.fill();}c.globalAlpha=1;for(const f of flowers){if(f.stock>.1){c.fillStyle=f.type===0?'#fcfff1':SPECIES[f.type].color;c.beginPath();c.arc(f.x,f.z,.35,0,Math.PI*2);c.fill();}}c.fillStyle='#c29a45';c.fillRect(-13,-7,2.8,2.8);if(race){w.rings.forEach((r,i)=>{if(i>=race.index){c.strokeStyle=i===race.index?'#b57e1c':'#dfc789';c.lineWidth=.4;c.beginPath();c.arc(r.position.x,r.position.z,1,0,Math.PI*2);c.stroke();}});}if(navTarget){c.strokeStyle='#818f68';c.lineWidth=.25;c.setLineDash([.7,.7]);c.beginPath();c.moveTo(player.position.x,player.position.z);c.lineTo(navTarget.x,navTarget.z);c.stroke();c.setLineDash([]);}c.fillStyle='#3d654d';c.strokeStyle='#fffcef';c.lineWidth=.45;c.beginPath();c.arc(player.position.x,player.position.z,1,0,Math.PI*2);c.fill();c.stroke();c.restore();}
function advance(dt){
 state.dayTime+=dt;collisionCooldown=Math.max(0,collisionCooldown-dt);comboTime-=dt;raceCooldown=Math.max(0,raceCooldown-dt);if(comboTime<=0){combo=0;lastHarvest=null;}
 weather=currentWeather(state.dayTime);
 if(weather!==lastWeather){if(lastWeather){if(weather==='rain')toast('细雨来了 ☂ 花蜜价值提高 25%，飞行会稍慢一点。');else if(weather==='night')toast('夜幕降临，跟着萤火虫一起飞吧 ☾');else toast('阳光回来了，花田正在招手 ☀');}lastWeather=weather;}
 const p=player.position;let dx=0,dz=0,moving=false;const rightX=Math.cos(viewAngle),rightZ=-Math.sin(viewAngle),forwardX=-Math.sin(viewAngle),forwardZ=-Math.cos(viewAngle);
 let ix=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+joystick.x;
 let iy=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-joystick.y;
 if(rescue){ix=iy=0;navTarget=hivePos.clone();}
 if(Math.abs(ix)+Math.abs(iy)>.08){dx=rightX*ix+forwardX*iy;dz=rightZ*ix+forwardZ*iy;const len=Math.hypot(dx,dz);dx/=Math.max(1,len);dz/=Math.max(1,len);moving=true;}
 else if(navTarget){let tx=navTarget.x-p.x,tz=navTarget.z-p.z,dist=Math.hypot(tx,tz);if(dist>.18){dx=tx/dist;dz=tz/dist;moving=true;}else {navTarget=null;w.target.visible=false;}}
 const boost=(keys.has('ShiftLeft')||keys.has('ShiftRight')||boostTouch)&&state.energy>3&&!rescue;let speed=4.4*(1+state.upgrades.wings*.15)*(boost?1.75:1)*(weather==='rain'?.8:1)*(rescue?1.2:1);
 if(moving){let step=speed*dt;if(navTarget)step=Math.min(step,Math.hypot(navTarget.x-p.x,navTarget.z-p.z));p.x+=dx*step;p.z+=dz*step;const d=Math.hypot(p.x,p.z);if(d>23){p.x*=23/d;p.z*=23/d;}let angle=Math.atan2(-dx,-dz);player.rotation.y+=Math.atan2(Math.sin(angle-player.rotation.y),Math.cos(angle-player.rotation.y))*Math.min(1,dt*8);player.userData.body.rotation.z=T.MathUtils.lerp(player.userData.body.rotation.z,boost?-.16:-.07,dt*5);if(!rescue)state.energy=Math.max(0,state.energy-dt*(boost?2.6:.52)*(1-state.upgrades.wings*.15));}
 else {state.energy=Math.min(100,state.energy+dt*.75);player.userData.body.rotation.z*=.93;}
 const nearHome=Math.hypot(p.x-hivePos.x,p.z-hivePos.z)<2;
 let altitude=keys.has('Space')?4.1:1.8;
 nearest=null;let closest=2.2;for(const f of flowers){let distance=Math.hypot(p.x-f.x,p.z-f.z);if(distance<closest){nearest=f;closest=distance;}if(f.stock<f.max){f.regrow+=dt;if(f.regrow>=SPECIES[f.type].regen){f.stock=f.max;f.harvested=false;f.regrow=0;}}f.head.scale.setScalar(.68+.32*f.stock/f.max);}
 collecting=null;
 if(nearHome){state.energy=Math.min(100,state.energy+dt*20);if(rescue){rescue=false;state.energy=Math.max(35,state.energy);toast('到家啦，所有花蜜都平安带回。');}if(state.nectar>.001){const n=deposit(state);bagWarning=false;toast(`甜蜜入库 <b>+${n}g 蜂蜜</b> ⌂`);chime();checkQuests();save();if(tutorialStage<3){tutorialStage=3;setTimeout(()=>toast('试着打开「蜂巢升级」，为下一次冒险添一点力量。'),2200);}}}
 else if(nearest&&nearest.stock>.01&&!moving&&!keys.has('Space')&&!rescue&&state.nectar<capacity(state)-.001){
  collecting=nearest;altitude=Math.max(1.25,nearest.height+.55);const before=state.discovered.length;const multiplier=(weather==='rain'?1.25:1)*Math.min(1.5,1+Math.max(0,combo-1)*.1);const n=collect(state,nearest.type,dt*2.9*(1+state.upgrades.skill*.35),nearest.stock,multiplier);nearest.stock=Math.max(0,nearest.stock-n);nearest.regrow=0;
  if(state.discovered.length>before){toast(`发现 ${SPECIES[nearest.type].name} ${SPECIES[nearest.type].icon} 已收入花朵图鉴`);chime();checkQuests();save();}
  if(nearest.stock<=.01&&!nearest.harvested){nearest.harvested=true;state.harvests++;state.xp+=6;if(lastHarvest!==nearest){combo++;comboTime=20;lastHarvest=nearest;}tone(520+combo*60,.13);checkQuests();if(tutorialStage===0){tutorialStage=1;toast('第一朵花授粉完成！再采几朵，按 H 把花蜜带回家。');}}
 }
 if(state.nectar>=capacity(state)-.001&&!bagWarning){bagWarning=true;toast('花蜜背包装满啦！按 H 回蜂巢酿蜜。');tone(784,.2);}
 p.y=T.MathUtils.lerp(p.y,altitude+Math.sin(frameTime*3.8)*.08,Math.min(1,dt*4));
 if(state.energy<=.01&&!rescue&&!nearHome){rescue=true;navTarget=hivePos.clone();w.target.position.set(hivePos.x,.16,hivePos.z);w.target.visible=true;toast('体力用完啦，蜂巢为你领航，花蜜会安全带回。');}
 if(keys.has('KeyQ'))viewAngle-=dt*.8;if(keys.has('KeyE'))viewAngle+=dt*.8;
 if(race){race.remaining-=dt;race.elapsed+=dt;const r=w.rings[race.index];if(Math.hypot(p.x-r.position.x,p.z-r.position.z)<1.5&&Math.abs(p.y-r.position.y)<2){r.visible=false;race.index++;tone(550+race.index*90,.2);if(race.index===6){const seconds=race.elapsed;state.races++;state.honey+=25;state.xp+=20;if(!state.bestRace||seconds<state.bestRace)state.bestRace=seconds;toast(`竞速完成！${seconds.toFixed(1)} 秒 <b>+25g 蜂蜜</b>`);race=null;raceCooldown=45;w.raceGroup.visible=false;save();}else {w.rings[race.index].material.color.set('#ffcf44');w.rings[race.index].material.emissiveIntensity=.9;}}if(race&&race.remaining<=0){toast('这次时间到了，下次再试试！花园探索可以继续。');race=null;raceCooldown=10;w.raceGroup.visible=false;}}
 saveTime+=dt;if(saveTime>8){saveTime=0;save();}
}
function ambience(dt){
 const t=state.dayTime%300;const isNight=weather==='night';const isRain=weather==='rain';const bg=new T.Color(isNight?'#687a96':isRain?'#a2b9b4':'#dfe8d5');scene.background.lerp(bg,dt*.6);scene.fog.color.copy(scene.background);w.floor.material.color.lerp(bg,dt*.6);w.ambient.intensity=T.MathUtils.lerp(w.ambient.intensity,isNight?1.2:isRain?1.8:2.3,dt);w.sun.intensity=T.MathUtils.lerp(w.sun.intensity,isNight?.6:isRain?1.4:3.4,dt);w.sun.color.lerp(new T.Color(isNight?'#b9cafd':'#fff0cc'),dt);document.body.classList.toggle('night',isNight);
 w.fireflies.material.opacity=T.MathUtils.lerp(w.fireflies.material.opacity,isNight?.8:0,dt);const fa=w.fireflies.geometry.attributes.position;for(let i=0;i<fa.count;i++){fa.array[i*3+1]+=Math.sin(frameTime*.7+i)*dt*.1;}fa.needsUpdate=true;
 w.rain.visible=isRain;if(isRain){const a=w.rain.geometry.attributes.position;for(let i=0;i<500;i++){a.array[i*6+1]-=dt*12;a.array[i*6+4]-=dt*12;if(a.array[i*6+1]<0){a.array[i*6+1]=22;a.array[i*6+4]=22.7;}}a.needsUpdate=true;}
 w.bees.forEach((b,i)=>{b.position.set(-12+Math.sin(frameTime*.4+i*2)*2.7,2+Math.cos(frameTime*.7+i)*.5,-5+Math.cos(frameTime*.4+i*2)*2);b.rotation.y=-frameTime*.4-i*2;b.userData.wings.forEach((wing,j)=>wing.rotation.z=Math.sin(frameTime*45)*.6*(j?1:-1));});
 w.wasps.forEach((b,i)=>{let angle=frameTime*.37+i*Math.PI;b.position.set(12+Math.cos(angle)*4.3,2.3+Math.sin(frameTime*1.2+i)*.3,-9+Math.sin(angle)*3.6);b.rotation.y=-angle;b.userData.wings.forEach((wing,j)=>wing.rotation.z=Math.sin(frameTime*43)*.55*(j?1:-1));if(started&&!paused&&!photoMode&&!rescue&&player.position.distanceTo(b.position)<1.5&&collisionCooldown<=0){state.energy=Math.max(0,state.energy-16);collisionCooldown=4;toast('小心黄蜂！消耗了 16 点体力，绕开它们吧。');tone(160,.18,'triangle');}});
 w.butterflies.forEach((b,i)=>{b.g.position.set(b.x+Math.sin(frameTime*.4+b.phase)*2,1.4+Math.sin(frameTime*.8+i)*.4,b.z+Math.cos(frameTime*.35+b.phase)*1.5);b.g.rotation.y=frameTime*.2+b.phase;b.wings.forEach((wing,j)=>wing.rotation.z=Math.sin(frameTime*10+i)*.8*(j?1:-1));});
 player.userData.wings.forEach((wing,j)=>wing.rotation.z=Math.sin(frameTime*48)*.65*(j?1:-1));
 flowers.forEach(f=>f.group.rotation.z=Math.sin(frameTime*1.4+f.phase)*(isRain?.065:.025));w.ripples.forEach((r,i)=>{let s=(frameTime*.17+i*.25)%1;r.scale.set(1+s*1.5,(1+s*1.5)*.65,1);r.material.opacity=(1-s)*.3;});
 w.homeGlow.material.opacity=.55+Math.sin(frameTime*2)*.15;w.target.rotation.z=frameTime*.6;w.target.scale.setScalar(1+Math.sin(frameTime*4)*.1);
 w.pollen.forEach((p,i)=>{p.visible=!!collecting;if(collecting){let a=frameTime*2.2+i*2.4,r=.7+(i%3)*.14,s=((frameTime*.9+i*.09)%1);p.position.set(T.MathUtils.lerp(collecting.x+Math.cos(a)*r,player.position.x,s),T.MathUtils.lerp(collecting.height,player.position.y,s),T.MathUtils.lerp(collecting.z+Math.sin(a)*r,player.position.z,s));p.scale.setScalar(1-s*.6);}});
 if(race)w.rings.forEach((r,i)=>{r.rotation.y+=dt*.45;if(i===race.index)r.scale.setScalar(1+Math.sin(frameTime*3)*.06);});
 if(audioEnabled&&started&&!paused){melodyTimer+=dt;if(melodyTimer>2.4){melodyTimer=0;const notes=[392,523,659,587,440,523,349,440,587,523,392,329];tone(notes[melodyIndex++%notes.length],1.2,'sine',.018);}}
}
function interactionUI(){
 const nearHome=player.position.distanceTo(hivePos)<3;const el=$('interaction');
 if(!started||paused||photoMode){el.hidden=true;$('world-label').hidden=true;return;}
 el.hidden=!!race||!(collecting||nearHome||nearest&&!navTarget);
 if(nearHome){$('interaction-icon').textContent='⌂';$('interaction-name').textContent='欢迎回家，小蜜蜂';$('interaction-detail').textContent=state.energy<99?'蜂巢正在恢复你的体力':'花蜜已酿好，可以再次出发啦';}
 else if(collecting){$('interaction-icon').textContent=SPECIES[collecting.type].icon;$('interaction-name').textContent=`正在采集${SPECIES[collecting.type].name}`;$('interaction-detail').textContent=`花蜜价值 ×${SPECIES[collecting.type].value}${weather==='rain'?' · 雨天 +25%':''} · 剩余 ${Math.ceil(collecting.stock)}`;}
 else if(nearest){$('interaction-icon').textContent=SPECIES[nearest.type].icon;$('interaction-name').textContent=state.nectar>=capacity(state)-.01?'花蜜背包已经装满':nearest.stock<=.01?'花朵正在休息':'停下来，闻闻花香';$('interaction-detail').textContent=state.nectar>=capacity(state)-.01?'按 H 返回蜂巢':nearest.stock<=.01?`约 ${Math.ceil(Math.max(0,SPECIES[nearest.type].regen-nearest.regrow))} 秒后重新长出花蜜`:'停在花朵旁，即可自动采蜜';}
 const label=$('world-label');let labelPos=null,text='';
 if(race){labelPos=w.rings[race.index].position.clone();labelPos.y+=1.4;text=`✧ 第 ${race.index+1} 个花环`;}
 else if(navTarget){labelPos=navTarget.clone();labelPos.y=2;text=rescue?'⌂ 安全回家':navTarget.distanceTo(hivePos)<2?'⌂ 温暖的蜂巢':'✦ 朝这里飞';}
 else if(collecting){labelPos=new T.Vector3(collecting.x,collecting.height+1.4,collecting.z);text=`${SPECIES[collecting.type].name} · ${Math.ceil(collecting.stock)}`;}
 else {labelPos=player.position.clone();labelPos.y+=.8;text='✦ 小蜜蜂';}
 label.hidden=!labelPos;if(labelPos){labelPos.project(camera);const x=(labelPos.x*.5+.5)*innerWidth,y=(-labelPos.y*.5+.5)*innerHeight;if(x<0||x>innerWidth||y<0||y>innerHeight)label.hidden=true;else {label.style.left=`${x}px`;label.style.top=`${y-22}px`;label.textContent=text;}}
}
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}window.addEventListener('resize',resize);resize();updateUI();$('loading').hidden=true;
let prev=performance.now();function loop(now){requestAnimationFrame(loop);const dt=Math.min((now-prev)/1000,.05);prev=now;if(document.hidden)return;
 const simulationRunning=started&&!paused&&!photoMode;const animationDt=paused?0:dt;frameTime+=animationDt;
 if(simulationRunning)advance(dt);else collecting=null;
 ambience(animationDt);
 const portrait=innerWidth<760;const distance=viewDistance*(portrait?1.28:1);const follow=started?(portrait?.82:.14):0;cameraTarget.lerp(new T.Vector3(player.position.x*follow,0,player.position.z*follow),Math.min(1,dt*2));
 const desired=new T.Vector3(Math.sin(viewAngle)*distance,cameraTarget.y+distance*.74,Math.cos(viewAngle)*distance).add(new T.Vector3(cameraTarget.x,0,cameraTarget.z));camera.position.lerp(desired,Math.min(1,dt*4));camera.lookAt(cameraTarget.x,cameraTarget.y,cameraTarget.z);
 renderer.render(scene,camera);interactionUI();uiTime+=dt;if(uiTime>.2){uiTime=0;updateUI();}
}requestAnimationFrame(loop);
// Read-only status lets assistive tooling inspect the live game without exposing save mutations.
window.honeyGarden={getStatus:()=>({started,paused,photoMode,weather,position:player.position.toArray(),state:JSON.parse(JSON.stringify(state)),race:race?{...race}:null,render:{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles}})};
