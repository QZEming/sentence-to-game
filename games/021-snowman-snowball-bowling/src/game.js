import {SnowScene} from './scene.js';
import {scoreFrames,frameComplete,frameMarks} from './scoring.js';

const $=id=>document.getElementById(id);
const state={mode:'classic',phase:'ready',frame:0,frames:[[]],score:0,aim:0,spin:0,x:0,power:0,ball:'snow',paused:false,muted:true,stats:{strikes:0,spares:0,pins:0},level:0,rolls:0,chargeTime:0,feedbackTime:0,toastTime:0,shotDown:0};
const challengeNames=['光环初体验','冰块回廊','侧风雪谷','移动冰阵','终极弧线'];
let scene,audio,lastHitTime=0,pendingAction=null;
function getBest(mode){try{return Number(localStorage.getItem('snowbowl-best-'+mode)||0);}catch{return 0;}}
function saveBest(){try{if(state.score>getBest(state.mode))localStorage.setItem('snowbowl-best-'+state.mode,String(state.score));}catch{}}
function sound(type,volume=1){if(state.muted)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const t=audio.currentTime;if(type==='hit'||type==='throw'){const length=type==='hit'?.12:.4,buffer=audio.createBuffer(1,audio.sampleRate*length,audio.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2);const src=audio.createBufferSource();src.buffer=buffer;const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=type==='hit'?850:320;const gain=audio.createGain();gain.gain.value=.35*volume;src.connect(filter).connect(gain).connect(audio.destination);src.start();}else{const notes=type==='strike'?[523,659,784,1047]:type==='spare'?[523,659,880]:type==='ring'?[784,1047]:[440,554];notes.forEach((freq,i)=>{const osc=audio.createOscillator(),g=audio.createGain();osc.type='sine';osc.frequency.value=freq;g.gain.setValueAtTime(0,t+i*.1);g.gain.linearRampToValueAtTime(.08*volume,t+i*.1+.02);g.gain.exponentialRampToValueAtTime(.001,t+i*.1+.35);osc.connect(g).connect(audio.destination);osc.start(t+i*.1);osc.stop(t+i*.1+.4);});}}catch{}}
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');state.toastTime=3.2;}
function feedback(kicker,title,sub){$('feedback-kicker').textContent=kicker;$('feedback-title').textContent=title;$('feedback-sub').textContent=sub;$('feedback').classList.add('show');state.feedbackTime=3.8;}
function readyControls(){const ready=state.phase==='ready'||state.phase==='charging';$('aim').disabled=!ready;$('spin').disabled=!ready;$('throw-button').disabled=!ready;document.querySelectorAll('[data-ball]').forEach(b=>{b.disabled=!ready||(state.mode==='classic'&&b.dataset.ball!=='snow');b.classList.toggle('selected',state.ball===b.dataset.ball);});$('throw-text').textContent=state.phase==='rolling'?'雪球出发了…':state.phase==='result'?'好球！继续下一次':state.phase==='charging'?'找准力度，松开投球':'按住蓄力 · 松开投球';}
function updateGuide(){state.aim=Math.max(-14,Math.min(14,state.aim));state.spin=Math.max(-1,Math.min(1,state.spin));state.x=Math.max(-2.65,Math.min(2.65,state.x));$('aim').value=state.aim;$('spin').value=state.spin;$('aim-value').textContent=(state.aim>0?'+':'')+state.aim.toFixed(1).replace('.0','')+'°';$('spin-value').textContent=Math.abs(state.spin)<.025?'直球':(state.spin<0?'左旋 ':'右旋 ')+Math.round(Math.abs(state.spin)*100)+'%';scene?.updateGuide(state.aim,state.spin,state.x);}
function updateHUD(){
  $('score').textContent=state.score;$('best').textContent=getBest(state.mode)||'—';$('score-label').textContent=state.mode==='classic'?'已结算得分':state.mode==='challenge'?'挑战积分':'练习积分';
  const f=state.frames[state.frame]||[];const round=String(state.frame+1).padStart(2,'0');$('round-label').innerHTML=state.mode==='zen'?`练习第 <b>${round}</b> 轮`:`第 <b>${round}</b> / ${state.mode==='classic'?10:5} ${state.mode==='classic'?'轮':'关'}`;
  $('throw-label').textContent=state.phase==='result'?'本球完成':`第 ${f.length+1} 球`;
  const remaining=scene?.pins.filter(p=>!p.down).length??10;$('remaining').textContent=remaining;
  const map=$('pin-map');map.replaceChildren();let id=0;for(let row=0;row<4;row++)for(let col=0;col<=row;col++){const dot=document.createElement('i');dot.className='pin-dot';dot.style.gridRow=row+1;dot.style.gridColumn=4-row+col*2;const pinId=id++;const pin=scene?.pins.find(p=>p.id===pinId);if(!pin||pin.down)dot.classList.add('down');map.appendChild(dot);}
  const frames=$('frames');frames.replaceChildren();const length=state.mode==='classic'?10:5;const totals=scoreFrames(state.frames).totals;for(let i=0;i<length;i++){const el=document.createElement('div');el.className='frame'+(i===state.frame?' current':'');const small=document.createElement('small');small.textContent=String(i+1).padStart(2,'0');const val=document.createElement('b');val.textContent=frameMarks(state.frames[i]||[],i)||'·';el.title=state.mode==='classic'?`第 ${i+1} 轮：${totals[i]??'待后续奖励球结算'}`:`第 ${i+1} 关`;el.append(small,val);frames.appendChild(el);}
  readyControls();
}
function selectBall(type){if(state.phase!=='ready'||state.mode==='classic'&&type!=='snow')return;state.ball=type;scene.setBall(type,state.x);scene.guide.visible=true;updateGuide();$('ball-hint').textContent={snow:'平衡 · 精准',heavy:'大一圈 · 更有力',burst:'撞击 · 雪花冲击波'}[type];updateHUD();}
function reset(mode=state.mode){
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());Object.assign(state,{mode,phase:'ready',frame:0,frames:[[]],score:0,aim:0,spin:0,x:0,power:0,ball:'snow',paused:false,stats:{strikes:0,spares:0,pins:0},level:0,rolls:0,chargeTime:0,shotDown:0,feedbackTime:0});
  scene.setChallenge(mode==='challenge'?0:-1);scene.resetPins();scene.setBall('snow',0);scene.guide.visible=true;$('shot-summary').classList.add('hidden');$('feedback').classList.remove('show');$('power-fill').style.width='0%';$('power-value').textContent='准备好了吗？';$('ball-hint').textContent='平衡 · 精准';
  document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));$('mode-description').innerHTML=mode==='classic'?'一颗雪球，十个球瓶。<br>来点旋转，让冬天热闹起来。':mode==='challenge'?'穿过光环，绕过冰块。<br>五道雪地关卡，等你来征服。':'慢慢瞄准，不着急出手。<br>把每一颗雪球，都打成好球。';
  $('wind-label').textContent=mode==='challenge'?'第 1 关 · '+challengeNames[0]:'微风 · 适合全倒';updateGuide();updateHUD();if(mode==='classic')toast('十轮经典赛 · 全倒和补中将获得后续投球奖励');else if(mode==='challenge')toast('挑战开始：穿过金色光环，额外获得 25 分');else toast('自由练习 · 试试三种雪球和弧线旋转');
}
function requestReset(mode){if(state.rolls>0||state.phase==='rolling'||state.phase==='charging'){pendingAction=()=>reset(mode);cancelCharge();$('confirm-dialog').showModal();}else reset(mode);}
function charge(){if(state.phase!=='ready'||state.paused||document.querySelector('dialog[open]'))return;state.phase='charging';state.chargeTime=0;state.power=.18;$('feedback').classList.remove('show');readyControls();if(!state.muted){audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();}}
function cancelCharge(){if(state.phase==='charging'){state.phase='ready';state.power=0;$('power-fill').style.width='0%';$('power-value').textContent='准备好了吗？';readyControls();}}
function release(){if(state.phase!=='charging')return;if(state.paused||document.querySelector('dialog[open]')){cancelCharge();return;}state.phase='rolling';state.shotDown=0;scene.launch(state.power,state.aim,state.spin,state.x);state.rolls++;sound('throw');$('power-value').textContent=Math.round(state.power*100)+'% 力度';$('shot-summary').classList.add('hidden');readyControls();}
function settle(){
  if(state.phase!=='rolling')return;state.phase='result';scene.thrown=false;const knocked=scene.pins.filter(p=>p.down).length;const standing=scene.pins.length-knocked;const f=state.frames[state.frame];const first=f.length===0;const pinsBefore=scene.pins.length;const freshRack=first||(state.mode==='classic'&&state.frame===9&&(f.length===1&&f[0]===10||f.length===2&&(f[1]===10||f[0]!==10&&f[0]+f[1]===10)));f.push(knocked);state.stats.pins+=knocked;
  let strike=knocked===10&&freshRack,spare=standing===0&&!strike;
  if(strike)state.stats.strikes++;if(spare)state.stats.spares++;
  if(state.mode==='classic')state.score=scoreFrames(state.frames).total;else state.score+=knocked*10+(strike?50:spare?20:0);
  saveBest();updateHUD();
  if(strike){feedback('十瓶全倒，漂亮！','STRIKE!',state.mode==='classic'?(state.frame===9?'全倒！十个球瓶全部击倒':'全倒！接下来两球计入奖励分'):'一击全倒 · 额外 +50');scene.celebrate();sound('strike');}
  else if(spare){feedback('稳稳收下最后的球瓶','SPARE!',state.mode==='classic'?'补中！下一球计入奖励分':'成功补中 · 额外 +20');scene.celebrate();sound('spare');}
  else if(knocked){feedback('NICE SHOT',`${knocked} PINS`,standing?`还剩 ${standing} 瓶，下一球继续`:'漂亮！');sound('score');}
  else{feedback('再试一次，手感会回来的','SO CLOSE',Math.abs(scene.ball.body.position.x)>3.6?'落入沟槽 · 调整方向或减少旋转':'这一次擦肩而过');}
  const complete=state.mode==='classic'?frameComplete(f,state.frame):f.length>=2||standing===0;const finish=complete&&(state.mode==='classic'&&state.frame===9||state.mode==='challenge'&&state.frame===4);
  $('shot-result').textContent=`击倒 ${knocked} / ${pinsBefore} 瓶`;$('next-shot').innerHTML=(finish?'查看本场成绩':complete?(state.mode==='challenge'?'进入下一关':'开始下一轮'):'继续投球')+' <kbd>↵</kbd>';$('shot-summary').classList.remove('hidden');
}
function next(){
  if(state.phase!=='result'||state.paused||document.querySelector('dialog[open]'))return;
  const f=state.frames[state.frame];const standing=scene.pins.filter(p=>!p.down).length;const complete=state.mode==='classic'?frameComplete(f,state.frame):f.length>=2||standing===0;
  if(complete&&(state.mode==='classic'&&state.frame===9||state.mode==='challenge'&&state.frame===4)){finish();return;}
  if(complete){state.frame++;state.frames.push([]);if(state.mode==='challenge'){state.level++;scene.setChallenge(state.level);$('wind-label').textContent=scene.wind?`${scene.wind>0?'向右':'向左'}侧风 · ${Math.abs(scene.wind*10).toFixed(1)} m/s`:`第 ${state.level+1} 关 · ${challengeNames[state.level]}`;toast(`第 ${state.level+1} 关 · ${challengeNames[state.level]}`);}scene.resetPins(state.mode==='challenge'?state.level:0);}
  else if(standing===0)scene.resetPins();else scene.removeDown();
  state.phase='ready';state.power=0;scene.setBall(state.ball,state.x);scene.guide.visible=true;updateGuide();$('power-fill').style.width='0%';$('power-value').textContent='准备好了吗？';$('shot-summary').classList.add('hidden');$('feedback').classList.remove('show');updateHUD();
}
function finish(){state.phase='finished';$('shot-summary').classList.add('hidden');$('final-score').textContent=state.score;$('finish-title').textContent=state.score>=getBest(state.mode)?'这是你的高光时刻。':'漂亮的一场！';$('finish-details').textContent=state.mode==='classic'?`十轮结束。${state.score===300?'满分 300！你是雪山传奇。':'把好手感留给下一场。'}`:`五关挑战完成。${state.score>=600?'三星雪山大师 ★★★':state.score>=350?'二星雪地高手 ★★':'一星雪球新秀 ★'}`;$('stat-strikes').textContent=state.stats.strikes;$('stat-spares').textContent=state.stats.spares;$('stat-pins').textContent=state.stats.pins;$('finish-dialog').showModal();saveBest();}
function pause(){if($('pause-dialog').open)return;cancelCharge();state.paused=true;$('pause-dialog').showModal();}
function resume(){state.paused=false;$('pause-dialog').close();}

try{
 scene=new SnowScene($('world'),{onPinDown(){if(state.phase==='rolling'){state.shotDown++;updateHUD();}},onHit(impact){const now=performance.now();if(now-lastHitTime>65){sound('hit',Math.min(.9,impact/8));lastHitTime=now;}},onRing(){if(state.mode==='challenge'){state.score+=25;toast('漂亮穿环！+25 分');sound('ring');updateHUD();}}});
 reset();$('loading').style.opacity='0';setTimeout(()=>$('loading').remove(),650);
}catch(error){$('loading').innerHTML='<div class="loading-flake">✳</div><b>3D 场景暂时无法启动</b><span>请使用支持 WebGL 的浏览器，开启硬件加速后刷新。</span><button class="primary-button" onclick="location.reload()">重新尝试</button>';console.error(error);}

$('aim').addEventListener('input',e=>{state.aim=Number(e.target.value);updateGuide();});$('spin').addEventListener('input',e=>{state.spin=Number(e.target.value);updateGuide();});
document.querySelectorAll('[data-ball]').forEach(b=>b.addEventListener('click',()=>selectBall(b.dataset.ball)));
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{if(state.mode!==b.dataset.mode)requestReset(b.dataset.mode);}));
$('reset').addEventListener('click',()=>requestReset(state.mode));$('confirm-reset').addEventListener('click',()=>{pendingAction?.();pendingAction=null;});
$('throw-button').addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);charge();});$('throw-button').addEventListener('pointerup',e=>{e.preventDefault();release();});$('throw-button').addEventListener('pointercancel',cancelCharge);$('throw-button').addEventListener('lostpointercapture',cancelCharge);
$('throw-button').addEventListener('click',e=>{if(e.detail===0&&state.phase==='ready'){charge();state.power=.78;release();}});
$('next-shot').addEventListener('click',next);$('play-again').addEventListener('click',()=>reset());$('resume').addEventListener('click',resume);$('pause').addEventListener('click',pause);
$('help').addEventListener('click',()=>{cancelCharge();$('help-dialog').showModal();});
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close).close()));
$('pause-dialog').addEventListener('cancel',()=>{state.paused=false;});
$('sound').addEventListener('click',()=>{state.muted=!state.muted;$('sound').querySelector('.muted-slash').style.display=state.muted?'block':'none';$('sound').title=state.muted?'打开声音':'关闭声音';$('sound').setAttribute('aria-label',$('sound').title);if(!state.muted)sound('ring');});
const keys=new Set();
window.addEventListener('keydown',e=>{
  if(document.querySelector('dialog[open]'))return;if(e.target.matches('input'))return;
  if(['Space','ArrowLeft','ArrowRight','KeyA','KeyD','KeyQ','KeyE','Enter','KeyP'].includes(e.code))e.preventDefault();
  if(e.code==='Space'&&!e.repeat)charge();if(e.code==='Enter')next();if(e.code==='KeyP')pause();keys.add(e.code);
});window.addEventListener('keyup',e=>{keys.delete(e.code);if(e.code==='Space'){e.preventDefault();release();}});window.addEventListener('blur',()=>{keys.clear();cancelCharge();if(state.phase==='rolling')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();cancelCharge();if(state.phase==='rolling')pause();}});
let pointerStart=null;if(scene){scene.renderer.domElement.addEventListener('pointerdown',e=>{if(state.phase==='ready'&&!document.querySelector('dialog[open]')){pointerStart={x:e.clientX,y:e.clientY,aim:state.aim};scene.renderer.domElement.setPointerCapture(e.pointerId);}});scene.renderer.domElement.addEventListener('pointermove',e=>{if(pointerStart&&state.phase==='ready'){state.aim=pointerStart.aim+(e.clientX-pointerStart.x)*.055;updateGuide();}});scene.renderer.domElement.addEventListener('pointerup',()=>pointerStart=null);scene.renderer.domElement.addEventListener('pointercancel',()=>pointerStart=null);}
let previous=performance.now();
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-previous)/1000,.05);previous=now;if(!scene)return;const blocked=state.paused||!!document.querySelector('dialog[open]');
  if(!blocked){if(state.phase==='ready'||state.phase==='charging'){let changed=false;const delta=dt*8;if(keys.has('ArrowLeft')){state.aim-=delta;changed=true;}if(keys.has('ArrowRight')){state.aim+=delta;changed=true;}if(keys.has('KeyA')){state.x-=dt*1.5;changed=true;}if(keys.has('KeyD')){state.x+=dt*1.5;changed=true;}if(keys.has('KeyQ')){state.spin-=dt*.65;changed=true;}if(keys.has('KeyE')){state.spin+=dt*.65;changed=true;}if(changed)updateGuide();}
    if(state.phase==='charging'){state.chargeTime+=dt;state.power=.18+.82*(.5-.5*Math.cos(state.chargeTime*2.8));$('power-fill').style.width=(state.power*100)+'%';$('power-value').textContent=Math.round(state.power*100)+'%'+(state.power>.72&&state.power<.88?' · 好力度':'');}
    if(state.phase==='rolling'){const p=scene.ball.body.position;const slow=scene.pins.every(p=>p.body.velocity.length()<.12&&p.body.angularVelocity.length()<.15);if(scene.shotAge>6.2||scene.shotAge>3.3&&(p.z<-18||p.z< -10&&slow)||scene.shotAge>4.2&&Math.abs(p.x)>3.65)settle();}
    if(state.feedbackTime>0){state.feedbackTime-=dt;if(state.feedbackTime<=0)$('feedback').classList.remove('show');}if(state.toastTime>0){state.toastTime-=dt;if(state.toastTime<=0)$('toast').classList.remove('show');}
  }
  scene.update(dt,blocked,state.phase!=='result'&&state.phase!=='finished');
}
requestAnimationFrame(animate);
// Read-only diagnostics for browser smoke checks.
window.snowbowl={snapshot:()=>({mode:state.mode,phase:state.phase,frame:state.frame+1,frames:state.frames.map(f=>[...f]),score:state.score,ball:state.ball,remaining:scene?.pins.filter(p=>!p.down).length,position:scene?.ball?{...scene.ball.body.position}:null,wind:scene?.wind,webgl:!!scene})};
