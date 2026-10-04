import {parseLevel,move,won,doorOpen,deadlocked,solve,pos,DIRS} from './engine.mjs';
import {KitchenScene} from './scene.js';
const $=id=>document.getElementById(id);
let levels,scene,board,state,levelIndex=0,history=[],busyUntil=0,hintToken=0,usedHints=0,startedAt=0,winTimer=null,toastTimer=null;
let progress={best:{},lastLevel:0,sound:false};
try{const data=JSON.parse(localStorage.getItem('little-hamster-v1')||'null');if(data&&typeof data.best==='object')progress={...progress,...data};}catch{}
let audioContext;
function sound(kind){if(!progress.sound)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const notes={step:[320],push:[155,210],seed:[650,880,1050],goal:[440,554,660],win:[523,659,784,1047],blocked:[130],undo:[400,290],gate:[260,390]};(notes[kind]||[440]).forEach((f,i)=>{const t=audioContext.currentTime+i*.07,o=audioContext.createOscillator(),g=audioContext.createGain();o.type=kind==='push'?'triangle':'sine';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(kind==='step'?.035:.07,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+.18);});}catch{}}
function save(){try{localStorage.setItem('little-hamster-v1',JSON.stringify(progress));}catch{$('save-label').textContent='当前浏览器无法保存进度';}}
function toast(text,ms=3300){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),ms);}
const titleTypes={classic:'经典推箱子',ice:'冰面滑行',plate:'压力机关',mix:'组合挑战'};
const missions={classic:['把木箱推到薄荷色餐垫上','箱子只能推，不能拉。记得为自己留一条路。'],ice:['借助冰面，让美味滑向终点','蓝色冰面让箱子一直滑行，仓鼠可以正常走过。'],plate:['压下黄色踏板，打开厨房栅栏','用一个箱子守住机关，再把另一个送到门后。'],mix:['冰面与机关，等你巧妙配合','先规划箱子的停靠点，再想好最后怎么回来。']};
function makeSeeds(level){const {board:b,state:s}=parseLevel(level);let st=s;const points=[];for(const dir of level.solution){st=move(b,st,dir);if(!st)throw new Error('Invalid solution: '+level.name);const p=pos(...st.player);if(!points.includes(p)&&p!==pos(...s.player))points.push(p);}if(!won(b,st))throw new Error('Unsolved level: '+level.name);level.seeds=[...new Set([points[Math.floor(points.length*.15)],points[Math.floor(points.length*.5)],points[points.length-1]])].filter(Boolean);for(const p of points){if(level.seeds.length>=3)break;if(!level.seeds.includes(p))level.seeds.push(p);}}
function renderLevels(){
 const count=Object.keys(progress.best).length;$('journey-count').textContent=`${count} / ${levels.length}`;$('journey-fill').style.width=`${count/levels.length*100}%`;
 $('levels').innerHTML=levels.map((l,i)=>{const best=progress.best[i];return `<button class="level-button ${i===levelIndex?'active':''} ${best?'done':''}" data-level="${i}" aria-label="第 ${i+1} 关 ${l.name}${best?'，已完成':''}" ${i===levelIndex?'aria-current="true"':''}><span class="level-number">${best?'✓':String(i+1).padStart(2,'0')}</span><span><span class="level-name">${l.name}</span><span class="level-sub">${l.subtitle}</span></span>${best?`<span class="level-stars">${'★'.repeat(best.stars)}</span>`:''}</button>`;}).join('');
 document.querySelectorAll('[data-level]').forEach(el=>el.onclick=()=>loadLevel(Number(el.dataset.level)));
 $('achievement-count').textContent=`${achievements().filter(a=>a.done).length}/5`;
}
function loadLevel(i){
 if(!Number.isInteger(i)||i<0||i>=levels.length)return false;clearTimeout(winTimer);hintToken++;levelIndex=i;history=[];usedHints=0;startedAt=0;busyUntil=0;
 ({board,state}=parseLevel(levels[i]));const l=levels[i];$('win-panel').hidden=true;scene.build(board,state);scene.chefHat(Object.keys(progress.best).length>=6);renderLevels();updateHUD();
 $('chapter-pill').textContent=`CHAPTER ${String(i+1).padStart(2,'0')}`;$('level-type').textContent=i>=6?'厨房高手挑战':titleTypes[l.mechanic];$('level-location').textContent=`${i<3?'☀':i===3||i===5||i===8?'❄':'✦'} ${l.location}`;$('level-title').textContent=l.name;$('scene-label').textContent=`${l.location} · ${titleTypes[l.mechanic]}`;
 const m=missions[l.mechanic]||missions.classic;$('mission-title').textContent=m[0];$('mission-text').textContent=i>=6?l.hint:m[1];$('star-guide').textContent=`${l.par} 步以内，摘下三星`;
 progress.lastLevel=i;save();$('hint').disabled=false;
 toast(i===0?'你好，我是栗子！把箱子推到绿色餐垫上吧。':l.hint,4500);
 const selected=document.querySelector('.level-button.active');if(window.innerWidth<761)selected?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});return true;
}
function updateHUD(){const goalCount=state.boxes.filter(b=>board.goals.has(pos(...b))).length;$('goals').textContent=`${goalCount} / ${state.boxes.length}`;$('seeds').textContent=`${state.collected.length} / ${board.seeds.size}`;$('moves').textContent=state.moves;$('undo').disabled=history.length===0;}
function step(d,{force=false}={}){
 if(!DIRS[d]||won(board,state)||document.querySelector('dialog[open]')||(!force&&performance.now()<busyUntil))return false;
 const next=move(board,state,d);if(!next){sound('blocked');scene.facing={U:Math.PI,D:0,L:-Math.PI/2,R:Math.PI/2}[d];return false;}
 hintToken++;$('hint').disabled=false;history.push(structuredClone(state));const old=state;state=next;busyUntil=performance.now()+(next.slide?220:130);if(!startedAt)startedAt=performance.now();scene.update(state,false,d);if(scene.hintArrow){scene.boardRoot.remove(scene.hintArrow);scene.hintArrow=null;}updateHUD();
 if(state.collected.length>old.collected.length){sound('seed');scene.burst(state.player);if(state.collected.length===board.seeds.size)toast('口袋满啦！三颗瓜子，一颗也没落下。');}
 else if(doorOpen(board,state)!==doorOpen(board,old)){sound('gate');toast(doorOpen(board,state)?'咔嗒！踏板压住了，栅栏已打开。':'踏板松开了，栅栏重新关上。',2000);}
 else if(state.boxes.some((b,i)=>board.goals.has(pos(...b))&&!board.goals.has(pos(...old.boxes[i])))){sound('goal');scene.burst(state.boxes[state.lastPush],0x83be8a,12);}
 else sound(state.lastPush>=0?'push':'step');
 if(won(board,state)){winTimer=setTimeout(complete,450);}
 else if(state.lastPush>=0&&deadlocked(board,state))toast('这个箱子卡在角落了，按 Z 撤销就能继续。',5000);
 return true;
}
function undo(){if(!history.length)return false;clearTimeout(winTimer);hintToken++;$('hint').disabled=false;state=history.pop();$('win-panel').hidden=true;scene.update(state);updateHUD();busyUntil=performance.now()+110;sound('undo');return true;}
function complete(){
 const l=levels[levelIndex],stars=state.moves<=l.par?3:state.moves<=l.par*2?2:1,elapsed=Math.max(1,Math.round((performance.now()-startedAt)/1000));const prior=progress.best[levelIndex];
 progress.best[levelIndex]={stars:Math.max(prior?.stars||0,stars),moves:Math.min(prior?.moves||Infinity,state.moves),seeds:Math.max(prior?.seeds||0,state.collected.length)};save();renderLevels();scene.celebrate();scene.chefHat(Object.keys(progress.best).length>=6);sound('win');
 $('win-title').textContent=levelIndex===levels.length-1?'小小仓鼠，大厨毕业！':'美味，全部就位！';$('win-stars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);$('win-summary').textContent=state.collected.length===board.seeds.size?'瓜子也收齐了，栗子的口袋鼓鼓的。':'还有瓜子藏在厨房里，下次再来找找吧。';
 $('win-stats').innerHTML=`<span><b>${state.moves}</b>行走步数</span><span><b>${state.pushes}</b>推动次数</span><span><b>${elapsed}s</b>冒险用时</span>`;$('next-level').innerHTML=levelIndex===levels.length-1?'再逛一圈 <span>✦</span>':'继续冒险 <span>✦</span>';$('replay').textContent=state.collected.length===board.seeds.size?'再试一次，挑战更少步数':'再试一次，收集全部瓜子';$('win-panel').hidden=false;$('next-level').focus({preventScroll:true});
}
async function hint(){
 if(won(board,state))return;const token=++hintToken;usedHints++;$('hint').disabled=true;toast('栗子正在认真想办法…',15000);
 const result=await solve(board,state);if(token!==hintToken)return;$('hint').disabled=false;
 if(result.status==='solved'&&result.path){const d=result.path[0];scene.showHint(d);toast(`下一步：${{U:'向上 ↑',D:'向下 ↓',L:'向左 ←',R:'向右 →'}[d]}。从这里还有 ${result.path.length} 步可通关。`,5500);}
 else if(result.status==='deadlock')toast('这条路走不通啦。用 Z 撤销几步，再调整箱子的位置。',6000);
 else toast(levels[levelIndex].hint+' 可以试着撤销几步，再来问栗子。',6000);
}
function achievements(){const vals=Object.values(progress.best);return[
 {icon:'🌱',name:'冒险的第一步',desc:'完成任意一个厨房关卡',done:vals.length>=1},
 {icon:'🌻',name:'鼓鼓的口袋',desc:'在一个关卡中收齐三颗瓜子',done:vals.some(v=>v.seeds>=3)},
 {icon:'⭐',name:'小小策略家',desc:'获得一次三星评价',done:vals.some(v=>v.stars===3)},
 {icon:'👨‍🍳',name:'厨房小主厨',desc:'完成六关，为栗子戴上厨师帽',done:vals.length>=6},
 {icon:'🏆',name:'巨型厨房的传说',desc:'完成全部九个厨房关卡',done:vals.length>=9}
 ];}
function showCollection(){$('achievements').innerHTML=achievements().map(a=>`<div class="achievement ${a.done?'unlocked':''}"><span>${a.icon}</span><div><b>${a.name}</b><p>${a.desc}</p></div><i>${a.done?'已收藏':'待发现'}</i></div>`).join('');$('collection-dialog').showModal();}
function bindUI(){
 $('undo').onclick=undo;$('restart').onclick=()=>{loadLevel(levelIndex);toast('重新出发！每一个好主意，都可以再试一次。');};$('hint').onclick=hint;$('camera').onclick=()=>toast(scene.toggleCamera()?'切换到俯视视角，更容易规划路线。':'回到厨房视角。',2000);$('zoom-in').onclick=()=>scene.changeZoom(.12);$('zoom-out').onclick=()=>scene.changeZoom(-.12);$('next-level').onclick=()=>loadLevel((levelIndex+1)%levels.length);$('replay').onclick=()=>loadLevel(levelIndex);
 $('sound').onclick=()=>{progress.sound=!progress.sound;updateSound();save();sound('seed');toast(progress.sound?'厨房的声音，打开啦。':'已关闭音效。',1500);};updateSound();$('help').onclick=()=>$('help-dialog').showModal();$('close-help').onclick=()=>$('help-dialog').close();$('collection').onclick=showCollection;document.querySelectorAll('.dialog-close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
 const keys={ArrowUp:'U',w:'U',W:'U',ArrowDown:'D',s:'D',S:'D',ArrowLeft:'L',a:'L',A:'L',ArrowRight:'R',d:'R',D:'R'};
 window.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.ctrlKey||e.metaKey||e.altKey)return;if(keys[e.key]){e.preventDefault();step(keys[e.key]);return;}if(e.repeat)return;switch(e.key.toLowerCase()){case'z':e.preventDefault();undo();break;case'r':loadLevel(levelIndex);break;case'h':hint();break;case'c':$('camera').click();break;}});
 document.querySelectorAll('[data-dir]').forEach(b=>{let interval;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);step(b.dataset.dir);interval=setInterval(()=>step(b.dataset.dir),170);});for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>clearInterval(interval));});
}
function updateSound(){$('sound').textContent=progress.sound?'♫':'♪';$('sound').style.color=progress.sound?'#d48747':'';$('sound').setAttribute('aria-label',progress.sound?'关闭音效':'开启音效');$('sound').title=progress.sound?'关闭音效':'开启音效';$('sound').setAttribute('aria-pressed',String(progress.sound));}
function snapshot(){return {level:levelIndex+1,name:levels[levelIndex].name,player:state.player,boxes:state.boxes,goals:[...board.goals],ice:[...board.ice],plates:[...board.plates],doors:[...board.doors],doorOpen:doorOpen(board,state),moves:state.moves,seeds:state.collected.length,completed:won(board,state)};}
function webMCP(){const ctx=document.modelContext;if(!ctx?.registerTool)return;const controller=new AbortController();const register=t=>Promise.resolve(ctx.registerTool(t,{signal:controller.signal})).catch(()=>{});
 register({name:'read_kitchen_puzzle',description:'Read the current hamster puzzle state and positions.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>snapshot()});
 register({name:'move_hamster',description:'Move the hamster through up to 50 U/D/L/R directions using the same puzzle rules. Stops at blocked moves or completion.',inputSchema:{type:'object',properties:{directions:{type:'string',pattern:'^[UDLR]{1,50}$'}},required:['directions'],additionalProperties:false},annotations:{readOnlyHint:false},execute:async input=>{if(!input||typeof input.directions!=='string'||!/^[UDLR]{1,50}$/.test(input.directions))throw new Error('directions must contain 1–50 U/D/L/R characters');let moved=0;for(const d of input.directions){if(!step(d,{force:true}))break;moved++;await new Promise(r=>setTimeout(r,260));}return {...snapshot(),moved};}});
 window.addEventListener('pagehide',()=>controller.abort(),{once:true});
}
async function init(){try{
 const response=await fetch('./levels.json');if(!response.ok)throw new Error('关卡加载失败');levels=await response.json();levels.forEach(makeSeeds);scene=new KitchenScene($('game-canvas'),(x,y)=>{const dx=x-state.player[0],dy=y-state.player[1];if(Math.abs(dx)+Math.abs(dy)===1)step(dx===1?'R':dx===-1?'L':dy===1?'D':'U');else if(x>=0&&y>=0&&x<board.w&&y<board.h)toast('点击栗子旁边的一格，或用方向键移动。',2000);});bindUI();loadLevel(Math.min(Math.max(Number(progress.lastLevel)||0,0),levels.length-1));$('loading').style.display='none';webMCP();
 window.hamsterGame={read:snapshot,start:(n)=>loadLevel(n-1),move:(d)=>step(d,{force:true}),undo,levelSolutions:()=>levels.map(l=>l.solution),getProgress:()=>structuredClone(progress),hint};
}catch(e){console.error(e);$('loading').innerHTML='<span>🐹</span><b>厨房还没有准备好</b><p>请使用支持 WebGL 的现代浏览器，刷新页面再试一次。</p><button class="primary" style="width:auto" onclick="location.reload()">重新进入厨房</button>';}}
init();
