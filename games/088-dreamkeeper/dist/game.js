import { CONSTELLATIONS, edgeKey, evaluateEdges, roundReward, makeRound } from './game-core.js';
const $=id=>document.getElementById(id);
const icon=name=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const canvas=$('sky'),ctx=canvas.getContext('2d'),dialog=$('game-dialog');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let stored={};try{stored=JSON.parse(localStorage.getItem('dreamkeeper-v1')||'{}')}catch{}
const progress={unlocked:stored.unlocked&&typeof stored.unlocked==='object'?stored.unlocked:{},best:Number(stored.best)||0};
let mode='journey',level=0,phase='ready',round=makeRound(0,mode),nodes=[],targetEdges=[],drawn=[],selected=null,hover=null,keyboardFocus=0;
let score=0,combo=0,lives=3,hints=2,freezes=1,mistakes=0,usedHints=0,remaining=8,roundSpent=0,hintUntil=0,wrongUntil=0,paused=false,modalKind='',hintResume=0;
let width=900,height=552,zoom=1,rotX=0,rotY=0,drag=null,viewTouched=false,lastTime=performance.now(),time=0,particleBurst=[],toastTimeout;
let audioEnabled=false,audioContext=null,ambientGain=null;
const random=(a,b)=>a+Math.random()*(b-a);
const dust=Array.from({length:130},()=>({x:random(-3.4,3.4),y:random(-2,2),z:random(-2,2.5),r:random(.3,1.1),phase:random(0,6.28)}));
function save(){try{localStorage.setItem('dreamkeeper-v1',JSON.stringify(progress))}catch{}}
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.remove('visible'),3000)}
function miniature(data){const p=data.points;return `<svg viewBox="-150 -120 300 240" aria-hidden="true">${data.edges.map(([a,b])=>`<path d="M ${p[a][0]*90} ${p[a][1]*90} L ${p[b][0]*90} ${p[b][1]*90}" fill="none" stroke="#91a9cf" stroke-width="1.4"/>`).join('')}${p.map((v,i)=>`<circle cx="${v[0]*90}" cy="${v[1]*90}" r="${i===data.bright?4.4:2.5}" fill="#dbeaff"/>`).join('')}</svg>`}
function setPreview(){const visible=['ready','observe','won','lost'].includes(phase)||time<hintUntil;$('target-preview').innerHTML=visible?miniature(round):'<span class="hidden-target">✧ 星光藏在记忆里</span>'}
function updateUI(){
 $('chapter-title').textContent=`第${['一','二','三','四','五','六','七','八'][level%8]}章 · ${round.chapter}`;
 $('level-number').textContent=String(level+1).padStart(2,'0');$('level-total').textContent=mode==='endless'?'/ ∞':'/ 08';$('level-name').textContent=round.chapter;
 $('level-progress').innerHTML=Array.from({length:8},(_,i)=>`<i class="${i<level%8?'complete':i===level%8?'current':''}"></i>`).join('');
 $('score-value').innerHTML=`${score.toLocaleString()}<span> pts</span>`;$('combo-value').innerHTML=`${combo}<span> 次</span>`;
 $('lives').innerHTML=Array.from({length:3},(_,i)=>`<svg class="${i>=lives?'lost':''}"><use href="#i-heart"/></svg>`).join('');$('lives').setAttribute('aria-label',`${lives} 颗梦境之心`);
 $('target-name').textContent=round.name;$('target-latin').textContent=round.latin;$('star-count').textContent=`${round.points.length} 颗星辰`;$('difficulty-name').textContent=mode==='zen'?'悠然':round.difficulty;
 $('difficulty-stars').innerHTML=level<2?'✦ <i>✦ ✦</i>':level<5?'✦ ✦ <i>✦</i>':'✦ ✦ ✦';
 $('collection-count').textContent=String(Object.keys(progress.unlocked).length).padStart(2,'0');
 $('hint-count').textContent=`× ${hints}`;$('freeze-count').textContent=mode==='zen'?'∞':`× ${freezes}`;
 $('hint-button').disabled=phase!=='recall'||hints<=0||paused;$('freeze-button').disabled=phase!=='recall'||freezes<=0||mode==='zen'||paused;
 $('pause-button').disabled=!['observe','recall'].includes(phase);
 $('undo-button').disabled=drawn.length===0;
 $('connection-progress').textContent=`已连接 ${drawn.length} / ${targetEdges.length}`;
 $('start-panel').hidden=!['ready','won','lost'].includes(phase);$('recall-bar').hidden=phase!=='recall';$('phase-message').hidden=!['observe','recall'].includes(phase);$('constellation-caption').hidden=phase!=='ready';
 $('constellation-caption').innerHTML=`<span>${String(level+1).padStart(2,'0')} / ${mode==='endless'?'∞':'08'}</span><h2>${round.name}</h2><p>${round.latin}</p>`;
 $('phase-label').innerHTML=`<i></i> ${{ready:'等待入梦',observe:'凝望星光',recall:'重现星座',won:'梦境已点亮',lost:'星光暂歇'}[phase]}`;
 $('phase-eyebrow').textContent=phase==='observe'?'记住星光的形状':'将记忆中的星辰，重新相连';$('phase-tip').textContent=phase==='observe'?'注意每一条连线，星光即将隐去':'点击两颗星连接 · 点击已选星取消选中';
 $('timer-label').textContent=phase==='recall'?'剩余时间':'记忆时间';
 $('start-button').innerHTML=`${icon('spark')}${phase==='won'?(mode!=='endless'&&level===7?'再次入梦':'下一场梦'):phase==='lost'?'重新入梦':'开始观星'}<kbd>Enter</kbd>`;
 if(phase==='ready'){document.querySelector('.gold-label').textContent=level===0?'你的第一场梦，即将开始':'下一片星空，正等待着你';document.querySelector('.start-panel-copy p').textContent='星座会短暂出现。记住它，然后亲手重现。'}
 else if(phase==='won'){document.querySelector('.gold-label').textContent='星光已被你唤醒';document.querySelector('.start-panel-copy p').textContent=round.story}
 else if(phase==='lost'){document.querySelector('.gold-label').textContent='休息片刻，再次追寻星光';document.querySelector('.start-panel-copy p').textContent='每一次尝试，都让你离星空更近。'}
 const instructions={ready:'准备好了吗？为梦境点亮第一颗星。',observe:'记住星辰之间的连接。你也可以拖动，观察空间深度。',recall:'选择星辰绘制连线。完成后，点击「重现星座」。',won:'你找回了这片星空。下一场梦，等你启程。',lost:'星光没有消失，只是在等待你的下一次到来。'};
 $('bottom-instruction').textContent=instructions[phase];setPreview();updateTimer();
}
function updateTimer(){let value=phase==='ready'?round.time:remaining;$('time-value').innerHTML=Number.isFinite(value)?`${Math.max(0,Math.ceil(value))} <small>秒</small>`:'∞';$('phase-main').textContent=Number.isFinite(remaining)?(phase==='observe'?Math.max(0,remaining).toFixed(1):`${Math.ceil(Math.max(0,remaining))}s`):'∞';$('phase-main').style.color=remaining<=10&&phase==='recall'?'#e0a59d':'#e4c78f'}
function buildRound(){
 round=makeRound(level,mode);drawn=[];selected=null;hover=null;rotX=0;rotY=0;zoom=1;viewTouched=false;mistakes=0;usedHints=0;roundSpent=0;hintUntil=0;wrongUntil=0;remaining=round.time;hints=2;freezes=1;
 nodes=round.points.map((p,i)=>({p:[...p],target:i,bright:i===round.bright}));
 for(let i=0;i<round.distractors;i++){let p,tries=0;do{p=[random(-1.55,1.55),random(-1.03,.97),random(-.55,.55)];tries++}while(nodes.some(n=>Math.hypot(n.p[0]-p[0],n.p[1]-p[1])<.40)&&tries<80);nodes.push({p,target:-1,bright:false})}
 // Shuffling prevents star numbers from revealing which nodes belong to the target.
 for(let i=nodes.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[nodes[i],nodes[j]]=[nodes[j],nodes[i]]}
 const indices=new Map(nodes.map((n,i)=>[n.target,i]));targetEdges=round.edges.map(([a,b])=>[indices.get(a),indices.get(b)]);keyboardFocus=0;updateUI();
}
function startRound(){if(dialog.open)return;if(phase==='won'){nextRound();return}if(phase==='lost'){restart();return}if(phase!=='ready')return;phase='observe';rotX=0;rotY=0;zoom=1;remaining=round.time;updateUI();chime(0);canvas.focus({preventScroll:true})}
function beginRecall(){phase='recall';remaining=round.recallTime;selected=null;if(level>1&&mode!=='zen')rotY+=.16;updateUI();chime(2);flash()}
function flash(){$('screen-flash').classList.add('flash');setTimeout(()=>$('screen-flash').classList.remove('flash'),250)}
function chooseNode(id){if(phase!=='recall'||paused||time<hintUntil)return;if(!Number.isInteger(id)||id<0||id>=nodes.length)return;
 if(selected===null){selected=id;chime(id%5);return}if(selected===id){selected=null;return}
 const key=edgeKey(selected,id),at=drawn.findIndex(([a,b])=>edgeKey(a,b)===key);if(at>=0){drawn.splice(at,1)}else{drawn.push([selected,id]);chime(id%5)}selected=id;updateUI();
}
function undo(){if(phase!=='recall'||paused)return;drawn.pop();selected=null;updateUI()}
function useHint(){if(phase!=='recall'||paused||hints<=0||time<hintUntil)return;hints--;usedHints++;hintUntil=time+2;hintResume=2;selected=null;updateUI();toast('星光回溯 · 时间已暂停 2 秒');chime(3)}
function freeze(){if(phase!=='recall'||paused||freezes<=0||mode==='zen')return;freezes--;remaining+=10;updateUI();toast('时光凝结 · 获得额外 10 秒');chime(4)}
function submit(){if(phase!=='recall'||paused||time<hintUntil)return;const result=evaluateEdges(targetEdges,drawn);if(result.success){win();return}mistakes++;combo=0;wrongUntil=time+2;if(mode!=='zen')lives--;updateUI();chime(-1);
 if(lives<=0){lose('梦境之心用尽了。星光会一直在这里等你。');return}
 toast(result.wrong>0?`有 ${result.wrong} 条连线偏离星轨，已用暖红色标记。`:`还差 ${result.missing} 条连线。再回忆一下星光的形状。`)
}
function win(){
 const reward=roundReward({edges:targetEdges.length,remaining,mistakes,hints:usedHints,combo,zen:mode==='zen'});score+=reward.points;combo++;phase='won';selected=null;
 const key=String(round.baseIndex);progress.unlocked[key]=Math.max(Number(progress.unlocked[key])||0,reward.stars);progress.best=Math.max(progress.best,score);save();updateUI();
 const center=project([0,0,0]);for(let i=0;i<70;i++)particleBurst.push({x:center.x,y:center.y,vx:random(-2.3,2.3),vy:random(-2.6,1.7),life:random(1,2),max:2,r:random(.7,2)});
 [0,2,4,7].forEach((n,i)=>setTimeout(()=>chime(n),i*140));const finished=mode!=='endless'&&level===7;
 openDialog('result',`<div class="dialog-centered"><div class="result-icon">${icon(finished?'moon':'spark')}</div><div class="dialog-eyebrow">${finished?'THE DAWN IS YOURS':'CONSTELLATION RESTORED'}</div><h2 class="dialog-title">${finished?'你守护了整片星空':round.name+'，再次闪耀'}</h2><p class="dialog-subtitle">${finished?'八场梦境，八次重逢。愿你醒来时，仍记得今夜的星光。':round.story}</p><div class="result-stars">${Array.from({length:3},(_,i)=>`<span class="${i>=reward.stars?'off':''}">✦</span>`).join('')}</div><div class="result-stats"><div><strong>+${reward.points}</strong><small>本轮守护积分</small></div><div><strong>${Math.round(roundSpent)}s</strong><small>重现用时</small></div><div><strong>${combo}</strong><small>连续点亮</small></div></div><div class="dialog-actions"><button class="secondary-button" data-action="collection">收录的星座</button><button class="primary-button" data-action="next">${icon('spark')}${finished?'再次入梦':'继续梦境'}</button></div></div>`);
}
function lose(message){phase='lost';selected=null;combo=0;updateUI();openDialog('result',`<div class="dialog-centered"><div class="result-icon">${icon('moon')}</div><div class="dialog-eyebrow">EVERY DREAM HAS ANOTHER CHANCE</div><h2 class="dialog-title">让梦，稍作停留</h2><p class="dialog-subtitle">${message}</p><div class="result-stats" style="margin-top:26px"><div><strong>${score}</strong><small>本场守护积分</small></div><div><strong>${level}</strong><small>已点亮星座</small></div><div><strong>${progress.best}</strong><small>本机最佳记录</small></div></div><div class="dialog-actions"><button class="secondary-button" data-action="practice">自由观星</button><button class="primary-button" data-action="restart">${icon('reset')}再试一次</button></div></div>`)}
function nextRound(){closeDialog();if(mode!=='endless'&&level===7){restart();return}level++;phase='ready';buildRound();startRound()}
function restart(){closeDialog();level=0;score=0;combo=0;lives=3;phase='ready';buildRound();startRound()}
function setMode(next){if(!['journey','zen','endless'].includes(next)||next===mode)return;
 if(['observe','recall'].includes(phase)){openDialog('mode',`<div class="dialog-eyebrow">A DIFFERENT KIND OF DREAM</div><h2 class="dialog-title">开启另一场梦？</h2><p class="dialog-subtitle">切换模式会重新开始本场旅程，已收录的星座仍保存在图鉴里。</p><div class="dialog-actions"><button class="secondary-button" data-action="close">继续当前梦境</button><button class="primary-button" data-action="mode" data-mode="${next}">切换模式</button></div>`);return}applyMode(next)
}
function applyMode(next){closeDialog();mode=next;level=0;score=0;combo=0;lives=3;phase='ready';document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('selected',b.dataset.mode===mode));$('mode-badge').textContent={journey:'故事模式',zen:'无时限',endless:'无限挑战'}[mode];buildRound();toast({journey:'八场梦境，循着星光前行。',zen:'没有倒计时，也不会失去梦境之心。',endless:'星座不断变换，记忆时间逐轮缩短。'}[mode])}
function openDialog(kind,html){paused=['observe','recall'].includes(phase);modalKind=kind;$('dialog-content').innerHTML=html;if(!dialog.open)dialog.showModal();updateUI()}
function closeDialog(){if(dialog.open)dialog.close();paused=false;modalKind='';lastTime=performance.now();updateUI()}
function pause(){if(!['observe','recall'].includes(phase)||dialog.open)return;openDialog('pause',`<div class="dialog-centered"><div class="result-icon">${icon('moon')}</div><div class="dialog-eyebrow">THE STARS CAN WAIT</div><h2 class="dialog-title">星空，正为你停留</h2><p class="dialog-subtitle">深呼吸。你的梦境和倒计时都已暂停。</p><div class="dialog-actions"><button class="secondary-button" data-action="guide">查看玩法</button><button class="primary-button" data-action="close">${icon('spark')}继续梦境</button></div></div>`)}
function guide(){openDialog('guide',`<div class="dialog-eyebrow">A GUIDE FOR DREAMKEEPERS</div><h2 class="dialog-title">让记忆，成为星光</h2><p class="dialog-subtitle">你是梦境的守护者。记住转瞬即逝的星座，把散落的光芒重新连起。</p><div class="guide-steps"><div class="guide-step"><span>01</span><div><h3>凝望 · 记住形状</h3><p>观察闪耀的星座，记住星辰和所有连线。拖动可旋转三维空间，滚轮可缩放。亮星是帮助定位的锚点。</p></div></div><div class="guide-step"><span>02</span><div><h3>重现 · 连接星辰</h3><p>连线消失后，依次点击星辰进行连接。点击当前选中的星取消选中，再从另一颗星绘制分支。重复连接一条线可删除它。背景小星光只是装饰。</p></div></div><div class="guide-step"><span>03</span><div><h3>点亮 · 守护梦境</h3><p>完成后提交星图。所有连线都正确即可过关；错误提交会消耗一颗心。星光回溯可查看答案 2 秒，凝结时光增加 10 秒。每关技能重新补满。</p></div></div></div><div class="keyboard-guide"><kbd>Enter</kbd> 开始 / 提交　<kbd>Esc</kbd> 暂停　<kbd>R</kbd> 重置视角<br><kbd>H</kbd> 星光回溯　<kbd>T</kbd> 凝结时光　<kbd>Ctrl Z</kbd> 撤销<br><kbd>← →</kbd> 切换星辰　<kbd>Space</kbd> 选择星辰　<kbd>1–9</kbd> 快速选择<br>自由观星没有时间或生命限制。图鉴和最佳成绩保存在当前设备。</div><div class="dialog-actions"><button class="primary-button" data-action="close">${icon('spark')}我准备好了</button></div>`)}
function collection(){openDialog('collection',`<div class="dialog-eyebrow">YOUR POCKETFUL OF STARS</div><h2 class="dialog-title">拾光星座图鉴</h2><p class="dialog-subtitle">已唤醒 ${Object.keys(progress.unlocked).length} / 8 个星座 · 本机最高 ${progress.best.toLocaleString()} 分</p><div class="collection-grid">${CONSTELLATIONS.map((c,i)=>{const stars=Number(progress.unlocked[i])||0;return `<div class="collection-item ${stars?'':'locked'}">${stars?miniature(c):icon('lock')}<h3>${c.name}</h3><p>${c.latin}</p><div class="rating">${stars?'✦'.repeat(stars)+'✧'.repeat(3-stars):'尚未唤醒'}</div>${stars?`<p class="collection-description">${c.story}</p>`:''}</div>`}).join('')}</div><div class="dialog-actions"><button class="primary-button" data-action="close">返回观星台</button></div>`)}
function resetView(){rotX=0;rotY=0;zoom=1;toast('已回到最初的观星视角')}
function project(p){let [x,y,z]=p;const cy=Math.cos(rotY),sy=Math.sin(rotY),cx=Math.cos(rotX),sx=Math.sin(rotX);const x1=x*cy+z*sy,z1=-x*sy+z*cy,y1=y*cx-z1*sx,z2=y*sx+z1*cx;const perspective=4.5/(4.5+z2);const scale=Math.min(width*.275,height*.277)*zoom;return {x:width*.51+x1*scale*perspective,y:height*(width<500?.385:.405)+y1*scale*perspective,z:z2,s:perspective}}
function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
new ResizeObserver(resize).observe(canvas);
function drawLine(a,b,color,alpha=1,glow=true){const p=project(nodes[a].p),q=project(nodes[b].p);ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=1;ctx.shadowColor=color;ctx.shadowBlur=glow?8:0;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.restore()}
function render(dt){
 ctx.clearRect(0,0,width,height);const reveal=['ready','observe','won','lost'].includes(phase)||time<hintUntil;
 for(const star of dust){const p=project([star.x,star.y,star.z]);const shimmer=reducedMotion?.5:(.55+.3*Math.sin(time*.8+star.phase));ctx.beginPath();ctx.fillStyle=`rgba(182,209,241,${shimmer*.45})`;ctx.arc(p.x,p.y,star.r*p.s,0,Math.PI*2);ctx.fill()}
 // Thin orbital rings visualize depth in the same interactive coordinate system.
 ctx.save();ctx.strokeStyle='rgba(121,159,203,0.08)';ctx.lineWidth=.6;ctx.setLineDash([2,7]);
 for(let ring=0;ring<2;ring++){ctx.beginPath();for(let i=0;i<=100;i++){const a=i/100*Math.PI*2;const p=project([Math.cos(a)*1.54,Math.sin(a)*1.05,ring?Math.sin(a)*.9:Math.cos(a)*.6]);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)}ctx.stroke()}ctx.restore();
 if(reveal)targetEdges.forEach(([a,b])=>drawLine(a,b,phase==='won'?'#e9c98d':'#afcbed',phase==='ready'?.68:.85));
 const targetSet=new Set(targetEdges.map(([a,b])=>edgeKey(a,b)));
 drawn.forEach(([a,b])=>{const wrong=time<wrongUntil&&!targetSet.has(edgeKey(a,b));drawLine(a,b,wrong?'#ed9997':'#ecd2a1',reveal?.32:.95)});
 const projected=nodes.map((node,id)=>({...project(node.p),node,id})).sort((a,b)=>b.z-a.z);
 for(const {x,y,s,node,id} of projected){
 const target=reveal&&node.target>=0,isSelected=selected===id,isHover=hover===id,isConnected=drawn.some(e=>e.includes(id));
 const idle=phase==='ready';if(idle&&node.target<0)continue;
 const starColor=isSelected||isConnected&&!reveal?'#ffe4b3':target?'#d8e9ff':'#c1d4ef';
 const base=(node.bright?3.8:2.5)*s,brightness=target||isSelected?1:.72;
 const glowRadius=(node.bright&&target?29:target?19:isSelected?23:12)*s;
 const gradient=ctx.createRadialGradient(x,y,0,x,y,glowRadius);gradient.addColorStop(0,isSelected?'rgba(241,208,145,.34)':'rgba(155,199,255,.32)');gradient.addColorStop(.28,'rgba(123,173,234,.12)');gradient.addColorStop(1,'rgba(116,168,244,0)');ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(x,y,glowRadius,0,Math.PI*2);ctx.fill();
 ctx.save();ctx.globalAlpha=brightness;ctx.shadowBlur=target?14:7;ctx.shadowColor=starColor;ctx.fillStyle=starColor;ctx.beginPath();ctx.arc(x,y,base,0,Math.PI*2);ctx.fill();ctx.restore();
 if(node.bright&&target){ctx.save();ctx.strokeStyle='#d7e8ffbb';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(x-12*s,y);ctx.lineTo(x+12*s,y);ctx.moveTo(x,y-12*s);ctx.lineTo(x,y+12*s);ctx.stroke();ctx.restore();}
 if(target||isSelected||isHover){ctx.strokeStyle=isSelected?'#e5c583aa':'#99c0ef4c';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(x,y,base+5+(isSelected?1:0),0,Math.PI*2);ctx.stroke()}
 if(phase==='recall'&&!reveal){ctx.font='9px system-ui';ctx.fillStyle=isSelected?'#eed3a1':'#92a9c39c';ctx.fillText(String(id+1),x+10,y+3)}
 if(idle&&target){ctx.font='9px system-ui';ctx.fillStyle=node.bright?'#c4d2e4aa':'#92a4bd77';ctx.fillText(node.bright?`${round.star} · α`:'βγδεζηθ'[node.target%7],x+15,y-8)}
 }
 for(let i=particleBurst.length-1;i>=0;i--){const p=particleBurst[i];p.life-=dt;p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.vy+=dt*.3;ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle='#ebd3a0';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();if(p.life<=0)particleBurst.splice(i,1)}ctx.globalAlpha=1;
}
function loop(now){const dt=Math.min((now-lastTime)/1000,.1);lastTime=now;if(!paused){time+=dt;if(['observe','recall'].includes(phase)){if(!(phase==='recall'&&time<hintUntil)){remaining-=dt;if(phase==='recall')roundSpent+=dt}if(remaining<=0){if(phase==='observe')beginRecall();else lose('回忆的时间到了。再试一次，或在自由观星中慢慢练习。')}updateTimer()}if(hintResume&&time>=hintUntil){hintResume=0;setPreview()}if(phase==='ready'&&!drag&&!viewTouched&&!reducedMotion)rotY=Math.sin(time*.13)*.13}render(dt);requestAnimationFrame(loop)}
function hitAt(x,y){let best=null,dist=Infinity;nodes.forEach((n,id)=>{const p=project(n.p),d=Math.hypot(p.x-x,p.y-y);if(d<Math.max(18,width<500?23:18)&&d<dist){best=id;dist=d}});return best}
canvas.addEventListener('pointerdown',e=>{if(paused)return;viewTouched=true;drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');canvas.focus({preventScroll:true})});
canvas.addEventListener('pointermove',e=>{const rect=canvas.getBoundingClientRect();hover=hitAt(e.clientX-rect.left,e.clientY-rect.top);if(drag&&e.pointerId===drag.id){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>5)drag.moved=true;if(drag.moved){rotY+=dx*.006;rotX=Math.max(-1.15,Math.min(1.15,rotX+dy*.006))}drag.x=e.clientX;drag.y=e.clientY}else canvas.style.cursor=hover!==null&&phase==='recall'?'pointer':'grab'});
function endPointer(e){if(!drag)return;const rect=canvas.getBoundingClientRect();if(!drag.moved&&e.type!=='pointercancel'){const hit=hitAt(e.clientX-rect.left,e.clientY-rect.top);if(hit!==null)chooseNode(hit);else selected=null}drag=null;canvas.classList.remove('dragging')}
canvas.addEventListener('pointerup',endPointer);canvas.addEventListener('pointercancel',endPointer);canvas.addEventListener('pointerleave',()=>hover=null);canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.65,Math.min(1.65,zoom-e.deltaY*.0007))},{passive:false});
function chime(n){if(!audioEnabled||!audioContext)return;const now=audioContext.currentTime;const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.value=n<0?146.83:[261.63,293.66,329.63,392,440,523.25,587.33,659.25][n%8];gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.07,now+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+1.1);osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+1.15)}
async function toggleAudio(){try{if(!audioContext){audioContext=new(window.AudioContext||window.webkitAudioContext)();ambientGain=audioContext.createGain();ambientGain.gain.value=0;ambientGain.connect(audioContext.destination);[130.81,196,261.63].forEach((f,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=f;o.detune.value=i*2;g.gain.value=.16;o.connect(g);g.connect(ambientGain);o.start()})}await audioContext.resume();audioEnabled=!audioEnabled;ambientGain.gain.setTargetAtTime(audioEnabled?.025:0,audioContext.currentTime,.5);$('audio-toggle').setAttribute('aria-pressed',String(audioEnabled));$('audio-toggle').setAttribute('aria-label',audioEnabled?'关闭环境音乐':'开启环境音乐');$('audio-toggle').querySelector('span').textContent=audioEnabled?'星空之声':'静谧模式';if(audioEnabled)chime(2)}catch{toast('当前浏览器无法播放环境音乐。你仍可以继续观星。')}}
$('start-button').onclick=startRound;$('submit-button').onclick=submit;$('undo-button').onclick=undo;$('hint-button').onclick=useHint;$('freeze-button').onclick=freeze;$('pause-button').onclick=pause;$('reset-view').onclick=resetView;$('audio-toggle').onclick=toggleAudio;
$('nav-guide').onclick=guide;$('help-button').onclick=guide;$('nav-collection').onclick=collection;$('nav-play').onclick=()=>{closeDialog();canvas.focus({preventScroll:true})};$('dialog-close').onclick=closeDialog;
document.querySelectorAll('.mode-tabs button').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
$('fullscreen-button').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('sky-stage').requestFullscreen()}catch{toast('当前浏览器不支持全屏，请使用系统全屏功能。')}};
dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog()});dialog.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const action=b.dataset.action;if(action==='close')closeDialog();else if(action==='next')nextRound();else if(action==='restart')restart();else if(action==='guide')guide();else if(action==='collection')collection();else if(action==='practice')applyMode('zen');else if(action==='mode')applyMode(b.dataset.mode)});
document.addEventListener('keydown',e=>{if(dialog.open)return;if(e.target instanceof HTMLButtonElement&&['Enter',' '].includes(e.key))return;const key=e.key.toLowerCase();if(key==='escape'){e.preventDefault();pause()}else if(key==='enter'){e.preventDefault();phase==='recall'?submit():startRound()}else if(key==='r')resetView();else if(key==='h')useHint();else if(key==='t')freeze();else if(key==='z'&&(e.ctrlKey||e.metaKey)){e.preventDefault();undo()}else if(phase==='recall'){if(/^[1-9]$/.test(e.key)){e.preventDefault();chooseNode(Number(e.key)-1)}else if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();keyboardFocus=(keyboardFocus+(e.key==='ArrowRight'||e.key==='ArrowDown'?1:-1)+nodes.length)%nodes.length;hover=keyboardFocus;canvas.setAttribute('aria-label',`星辰 ${keyboardFocus+1}，按空格选择。方向键切换星辰。`)}else if(e.key===' '){e.preventDefault();chooseNode(keyboardFocus)}}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();if(audioContext)audioContext.suspend()}else if(audioEnabled&&audioContext)audioContext.resume().catch(()=>{})});
const tips=['不必记住整片夜空，先找到最特别的那颗星。','记住星座的轮廓，再把每个转角放进记忆。','遇到分支时，点击当前星取消选择，再从另一颗星开始。'];let tipIndex=0;setInterval(()=>{tipIndex=(tipIndex+1)%tips.length;$('rotating-tip').textContent=tips[tipIndex];document.querySelectorAll('.tip-dots i').forEach((d,i)=>d.classList.toggle('active',i===tipIndex))},13000);
// Optional browser-native tools use the same actions and state as the visible game.
const modelContext=document.modelContext;
if(modelContext?.registerTool){const lifecycle=new AbortController();const tools=[{name:'read_dream_state',title:'查看梦境进度',description:'Read visible game progress, current phase, remaining time and selected connections. Does not reveal hidden answers.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({phase,mode,level:level+1,score,lives,remaining:Number.isFinite(remaining)?Math.ceil(remaining):null,connections:drawn.map(e=>e.map(i=>i+1)),starCount:nodes.length})},{name:'start_dream',title:'开始观星',description:'Start the current ready constellation observation round.',inputSchema:{type:'object',properties:{},additionalProperties:false},execute:()=>{if(phase!=='ready'||dialog.open)throw Error('The dream is not ready to start.');startRound();return{phase,level:level+1}}},{name:'connect_dream_stars',title:'连接星辰',description:'Connect two numbered stars during recall, using the same connection action as clicking stars.',inputSchema:{type:'object',properties:{stars:{type:'array',items:{type:'integer',minimum:1},minItems:2,maxItems:2}},required:['stars'],additionalProperties:false},execute:input=>{const pair=input?.stars;if(phase!=='recall'||paused||time<hintUntil)throw Error('Connections are available only during active recall.');if(!Array.isArray(pair)||pair.length!==2||pair.some(n=>!Number.isInteger(n)||n<1||n>nodes.length)||pair[0]===pair[1])throw Error('Choose two different valid star numbers.');selected=null;chooseNode(pair[0]-1);chooseNode(pair[1]-1);return{connections:drawn.length}}}];for(const tool of tools){try{Promise.resolve(modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{}}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true})}
buildRound();resize();requestAnimationFrame(loop);
