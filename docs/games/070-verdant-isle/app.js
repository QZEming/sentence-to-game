import {Ecosystem,SEASONS,SPECIES,POWERS,QUESTS,ANIMALS,region} from './engine.js';
import {IslandScene} from './scene.js';
const paths={
 leaf:'M20 4C11 2 3 6 4 14s12 8 16-10Z M4 21 15 10',
 sprout:'M12 21v-9 M12 15C5 15 3 11 3 6c6 0 9 3 9 9Z M12 12c0-6 3-9 9-9 0 6-3 9-9 9Z',
 sun:'M12 3V1 M12 23v-2 M3 12H1 M23 12h-2 M5 5 3.5 3.5 M20.5 20.5 19 19 M5 19l-1.5 1.5 M20.5 3.5 19 5 M16.5 12a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0',
 rain:'M6 14a4 4 0 0 1-.5-8A6 6 0 0 1 17 5a4.5 4.5 0 1 1 1 9 M8 17l-1 3 M13 16l-1 3 M18 17l-1 3',
 wind:'M3 8h12a3 3 0 1 0-3-3 M2 12h17a3 3 0 1 1-3 3 M4 16h5a3 3 0 1 1-3 3',
 snow:'M12 2v20 M3.3 7l17.4 10 M3.3 17 20.7 7 M9 4l3 3 3-3 M9 20l3-3 3 3 M3.5 10l4-1-1-4 M20.5 14l-4 1 1 4 M6.5 19l1-4-4-1 M17.5 5l-1 4 4 1',
 sparkles:'M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z M20 2v4 M18 4h4',
 flower:'M12 8c-6-9-12 0-5 4-8 4-1 12 4 5 5 8 13 1 6-4 8-5 0-12-5-5Z M14 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0',
 tree:'M12 2 5 11h3l-5 7h8v4h2v-4h8l-5-7h3L12 2Z',
 willow:'M12 22V12 M8 22h8 M12 3a5 5 0 0 0-5 4 4 4 0 0 0-3 7 4 4 0 0 0 6 3 4 4 0 0 0 7 0 4 4 0 0 0 3-7 5 5 0 0 0-8-7',
 droplet:'M12 2S4 10 4 15a8 8 0 0 0 16 0C20 10 12 2 12 2Z M8 15a4 4 0 0 0 4 4',
 bird:'M3 18c5 2 12 1 14-5l4-2-3-1a4 4 0 0 0-7-3c-4-2-7-1-9 0l6 6-5 5Z M15 9h.01',
 book:'M12 5c-3-2-7-2-10-1v16c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z M12 5v16',
 help:'M21 12a9 9 0 1 0-18 0 9 9 0 0 0 18 0 M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5 M12 17h.01',
 'volume-off':'M10 5 5 9H2v6h3l5 4V5Z M16 9l6 6 M22 9l-6 6',
 volume:'M10 5 5 9H2v6h3l5 4V5Z M14 8a6 6 0 0 1 0 8 M17 4a11 11 0 0 1 0 16',
 history:'M3 11a9 9 0 1 1 2 7 M3 4v7h7 M12 7v6l4 2',
 'chevron-right':'M9 5l7 7-7 7',
 plus:'M12 5v14 M5 12h14',minus:'M5 12h14',focus:'M8 3H3v5 M16 3h5v5 M21 16v5h-5 M8 21H3v-5 M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0',
 mouse:'M12 8v4 M6 8a6 6 0 0 1 12 0v8a6 6 0 0 1-12 0V8Z',
 pause:'M8 5v14 M16 5v14',play:'M7 4l13 8-13 8V4Z',x:'M6 6l12 12 M18 6 6 18',
 butterfly:'M12 20V8 M12 11C3-3-3 15 10 15c-11 4-4 10 2 2 6 8 13 2 2-2 13 0 7-18-2-4Z M12 8 9 4 M12 8l3-4',
 rabbit:'M9 11C1-3 13-2 11 10c0-13 11-12 4 2a5 5 0 1 1-6-1Z M10 15h.01 M15 15h.01 M11 18h2',
 bee:'M9 9C2 3 7 0 12 8c5-8 10-5 3 1 M19 14a7 5 0 1 0-14 0 7 5 0 0 0 14 0 M9 9v10 M14 9v10 M19 14h3',
 deer:'M8 11 4 4 M4 7H1 M5 7V1 M16 11l4-7 M20 7h3 M19 7V1 M8 10c-3 10 1 12 4 12s7-2 4-12 M9 14h.01 M15 14h.01',
 trophy:'M8 3h8v9a4 4 0 0 1-8 0V3Z M8 5H3v3a5 5 0 0 0 5 5 M16 5h5v3a5 5 0 0 1-5 5 M12 16v5 M8 21h8',
 lock:'M6 10h12v11H6V10Z M8 10V6a4 4 0 0 1 8 0v4 M12 14v3'
};
const icon=name=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.leaf}"/></svg>`;
const $=id=>document.getElementById(id);
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon)})}
let stored;try{stored=JSON.parse(localStorage.getItem('verdant-isle-v3'))}catch{}
let game=new Ecosystem(stored),selectedPower='rain',selectedSpecies='grass',selectedTile=null,scene,audio=null,sound=false,noticeTimer,comboTimer,lastSave=0,modalWasPaused=false;
const seasonIcons=['sprout','sun','leaf','snow'],powerIcons={rain:'rain',sun:'sun',wind:'wind',seed:'sprout',snow:'snow',bloom:'sparkles'},plantIcons={grass:'sprout',flower:'flower',pine:'tree',willow:'willow'};
$('season-buttons').innerHTML=SEASONS.map((s,i)=>`<button class="season-button ${i===game.season?'active':''}" style="--season-color:${s.color}" data-season="${i}" aria-label="切换到${s.name}季，消耗20能量" aria-pressed="${i===game.season}">${icon(seasonIcons[i])}<div>${s.name}<small>${s.en}</small></div></button>`).join('');
$('power-buttons').innerHTML=Object.entries(POWERS).map(([id,p])=>`<button class="power-button ${id===selectedPower?'active':''}" style="--power-color:${p.color}" data-power="${id}" aria-pressed="${id===selectedPower}" aria-label="${p.name}：${p.desc}，消耗${p.cost}能量" title="${p.desc} · ${p.cost} 能量 · 快捷键 ${p.key}">${icon(powerIcons[id])}<span>${p.name}</span><small>${p.key}</small></button>`).join('');
$('seed-picker').innerHTML=Object.entries(SPECIES).map(([id,p])=>`<button data-species="${id}" class="${id===selectedSpecies?'active':''}" aria-pressed="${id===selectedSpecies}" title="${p.desc}" style="color:${p.color}">${icon(plantIcons[id])}<span style="color:#526f50">${p.name}</span><small>${p.cost} 能量</small></button>`).join('');
hydrate();
function notify(message,error=false){clearTimeout(noticeTimer);$('notice').textContent=message;$('notice').className='notice show'+(error?' error':'');noticeTimer=setTimeout(()=>$('notice').classList.remove('show'),3600)}
function tone(type='cast'){
 if(!sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();const frequencies=type==='quest'?[523,659,784,1047]:type==='animal'?[659,880,1047]:type==='rain'?[587,440]:type==='sun'?[659,784]:[440,587];frequencies.forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,audio.currentTime+i*.13);g.gain.linearRampToValueAtTime(.06,audio.currentTime+i*.13+.015);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+i*.13+.6);o.connect(g);g.connect(audio.destination);o.start(audio.currentTime+i*.13);o.stop(audio.currentTime+i*.13+.65)})}catch{sound=false;notify('此浏览器暂时无法播放音效',true)}
}
function selectPower(power){if(!POWERS[power])return;selectedPower=power;document.querySelectorAll('[data-power]').forEach(b=>{const active=b.dataset.power===power;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});$('seed-picker').hidden=power!=='seed';const cost=power==='seed'?SPECIES[selectedSpecies].cost:POWERS[power].cost;$('power-hint').innerHTML=`${icon('mouse')} ${POWERS[power].name} · ${cost} 能量 <span class="hint-divider">·</span> ${POWERS[power].desc}`}
function cast(id){selectedTile=id;const result=game.cast(selectedPower,id,selectedSpecies);if(!result.ok)notify(result.text,true);else{tone(selectedPower);showTile(id);if(selectedPower==='seed'||selectedPower==='wind')notify(result.text)}updateUI();return result}
function showTile(id){if(id==null){if(selectedTile==null)$('tile-info').hidden=true;return}const t=game.tiles[id];$('tile-info').hidden=false;const plant=t.plant?SPECIES[t.plant].name:'等待新生的荒土';const status=t.plant?(t.water<SPECIES[t.plant].water[0]?'有些干渴，想要一场雨':t.water>SPECIES[t.plant].water[1]?'水分过多，试试暖阳或微风':t.growth>=.65?'成熟 · 微风可以传播种子':'正在生长 · 暖阳会帮助它长大'):'选择播种，或用微风从附近带来种子';$('tile-info').innerHTML=`<h3>${plant}<small>${region(t.q,t.r)}</small></h3><div class="tile-mini"><span>${icon('droplet')} ${Math.round(t.water)}%</span><span>${icon('sprout')} ${t.plant?Math.round(t.growth*100)+'%':'未播种'}</span><span>养分 ${Math.round(t.soil)}</span></div><p>${status}</p>`}
function updateUI(){
 const m=game.metrics(),s=SEASONS[game.season];$('vigor').textContent=m.vigor;$('vigor-bar').style.width=m.vigor+'%';$('health-label').textContent=m.vigor<25?'等待苏醒':m.vigor<50?'新芽初生':m.vigor<75?'生机渐盛':'万物共生';$('cover-value').textContent=Math.round(m.planted/61*100)+'%';$('water-value').textContent=Math.round(m.moisture)+'%';$('animal-value').textContent=game.animals.length;
 $('ecosystem-hint').textContent=m.moisture<28?'土地有些干渴，用雨水滋润新的生命。':m.moisture>80?'雨水已很充足，让微风与阳光来到岛屿。':m.planted<18?'借一阵微风，让种子走向更多荒土。':m.flowers<3?'种下星铃花，静候第一只蝴蝶。':m.trees<6?'让树木长大，为归来的朋友留下家。':m.vigor<75?'让植物覆盖更多土地，保持适宜水分。':'山川、草木与生灵，正在共同呼吸。';
 $('energy-value').textContent=Math.floor(game.energy);$('energy-bar').style.width=game.energy+'%';$('season-name').textContent=s.name+' · '+s.subtitle;$('day-label').textContent=`第 ${Math.floor(game.time/30)+1} 日 · ${['晨光','午后','暮色'][Math.floor(game.time/10)%3]}`;$('temperature').textContent=(s.temp+(game.weather?.id==='heat'?7:game.weather?.id==='rain'?-3:0))+'°';$('season-icon').innerHTML=icon(seasonIcons[game.season]);
 document.querySelectorAll('[data-season]').forEach(b=>{const active=+b.dataset.season===game.season;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);b.title=active?'当前季节':game.seasonCooldown>0?`四季之轮恢复中 · ${Math.ceil(game.seasonCooldown)} 秒`:'切换季节 · 20 能量'});
 document.querySelector('[data-power="bloom"]').classList.toggle('locked',m.vigor<35);
 const q=QUESTS[game.quest];$('quest-index').textContent=`${String(Math.min(game.quest+1,6)).padStart(2,'0')} / 06`;$('quest-name').textContent=q?.name||'岛屿已重获新生';$('quest-desc').textContent=q?.desc||'继续探索四季，收集全部归来物种。';$('quest-count').textContent=q?`${Math.min(m[q.key],q.target)} / ${q.target}`:'已完成';$('quest-dots').innerHTML=QUESTS.map((_,i)=>`<span class="${i<game.quest?'done':i===game.quest?'current':''}"></span>`).join('');$('quest-reward').textContent=q?`奖励 ${q.reward} 精灵能量`:'自由守护 · 旅程仍在继续';
 $('discovery-badge').textContent=`${game.discovered.length} / 5`;
 if(game.weather){$('weather-event').hidden=false;$('weather-event').innerHTML=`<strong>${icon(game.weather.id==='heat'?'sun':'rain')} ${game.weather.name}</strong><p>${game.weather.desc}</p><p style="margin-top:8px">剩余 ${Math.ceil(game.weather.remaining)} 秒 · ${game.weather.strength} 次施法</p>`}else $('weather-event').hidden=true;
 if(selectedTile!==null)showTile(selectedTile);
}
function openModal(html){modalWasPaused=game.paused;game.paused=true;$('modal-content').innerHTML=html;hydrate($('modal'));$('modal').showModal()}
function closeModal(){$('modal').close()}
$('modal').addEventListener('close',()=>{game.paused=modalWasPaused;updatePause()});
document.querySelector('.modal-close').addEventListener('click',closeModal);
$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal()}});
function journal(){openModal(`<div class="modal-eyebrow">ISLAND FIELD GUIDE</div><h2>归来的生命</h2><p>栖息地准备好了，它们就会循着风的方向回来。已发现 ${game.discovered.length} / 5 种动物。</p><div class="catalog-grid">${ANIMALS.map(a=>`<article class="catalog-card ${game.discovered.includes(a.id)?'discovered':''}">${icon(a.id)}<h3>${a.name} <span style="font-weight:400;font-size:10px;color:#859975">${game.animals.includes(a.id)?'正在岛上':game.discovered.includes(a.id)?'已发现':'尚未抵达'}</span></h3><p>${a.desc}</p><small>${a.needs}</small></article>`).join('')}<article class="catalog-card"><div class="modal-eyebrow">ECOLOGY NOTES</div><h3>每种生命，都有自己的季节</h3><p>春季萌发生长；夏季注意补水；秋季微风传播更远；冬季生长变慢，雪被缓慢释放水分。</p></article></div><h3 style="font-size:14px;margin-top:26px">岛屿植物</h3><div class="catalog-grid">${Object.entries(SPECIES).map(([id,p])=>`<article class="catalog-card">${icon(plantIcons[id])}<h3>${p.name}</h3><p>${p.desc}</p><small>适宜水分 ${p.water[0]}–${p.water[1]}% · 种子 ${p.cost} 能量</small></article>`).join('')}</div>`)}
function help(){openModal(`<div class="modal-eyebrow">A LITTLE GUIDE TO NEW LIFE</div><h2>你好，天气精灵。</h2><p>这座岛沉睡了很久。用风、雨与四季照顾每一块土地，让生命慢慢回来。</p><div class="help-grid"><div class="help-step"><h3>${icon('rain')}01 · 给荒土一场雨</h3><p>选中天气，再点击土地。雨水滋润周围 7 块地，保持水分在 30–75% 最容易开始。点击也可以选中土地。</p></div><div class="help-step"><h3>${icon('sprout')}02 · 播种与成长</h3><p>点击播种，选择草、花或树，也能在已有植物的土地上改种。雨水后接暖阳会触发「雨后初晴」，加速成长。草与云杉比较耐旱。</p></div><div class="help-step"><h3>${icon('wind')}03 · 让风带来更多绿意</h3><p>微风会传播附近植物的种子，并降低水分。秋季传播得更远。植物成长超过 45% 就能传播。</p></div><div class="help-step"><h3>${icon('bird')}04 · 建立完整生态</h3><p>花朵吸引蝴蝶，森林吸引鸟与鹿。完成 6 段复苏之旅，让生机达到 75、至少 3 种动物，并稳定 20 秒。</p></div></div><p>数字键 1–6 选择天气 · 空格暂停 · 拖动旋转视角 · 滚轮或双指缩放<br>精灵能量会自然恢复。天气事件都能化解；任何荒地都能重新播种。关闭页面后时间会暂停，旅程仅保存在本机浏览器。</p><button class="primary-button" id="begin-btn">让我们开始吧</button>`);$('begin-btn').onclick=closeModal}
function log(){openModal(`<div class="modal-eyebrow">LET THE ISLAND REMEMBER</div><h2>岛屿手记</h2><p>记录风与生命路过的痕迹。</p>${game.log.length?game.log.map(l=>`<div class="journal-entry"><small>第 ${Math.floor(l.time/30)+1} 日</small><span>${l.text}</span></div>`).join(''):'<p>故事还未写下。第一场雨，会是一个好开始。</p>'}`)}
function win(){const m=game.metrics();openModal(`<div class="win-icon">${icon('trophy')}</div><div class="modal-eyebrow">LIFE ALWAYS FINDS A WAY</div><h2>风过处，万物生。</h2><p>曾经沉睡的土地，如今有了森林、花香和归来的生命。<br>这座岛屿的每一阵风，都会记得你的照顾。</p><div class="win-stats"><span><strong>${Math.floor(game.time/30)+1}</strong>日夜相伴</span><span><strong>${m.vigor}</strong>岛屿生机</span><span><strong>${game.discovered.length}</strong>归来物种</span><span><strong>${game.stats.combos}</strong>生态连携</span></div><button class="primary-button" id="continue-btn">继续守护这座岛</button>`);$('continue-btn').onclick=closeModal}
function handleEvent(e){if(e.type==='cast'){scene?.castEffect(e.power,e.id);return}if(e.type==='combo'){clearTimeout(comboTimer);$('combo-label').textContent=e.text;$('combo-label').classList.add('show');comboTimer=setTimeout(()=>$('combo-label').classList.remove('show'),2400)}else if(e.type==='win'){setTimeout(win,1200)}else{notify(e.text);tone(e.type)}}
game.onEvent=handleEvent;
function updatePause(){$('pause-btn').innerHTML=icon(game.paused?'play':'pause');$('pause-btn').setAttribute('aria-label',game.paused?'继续':'暂停');$('pause-btn').title=game.paused?'继续时间':'暂停时间'}
function togglePause(){if($('modal').open)return;game.paused=!game.paused;updatePause();notify(game.paused?'时间暂停，岛屿正静静呼吸':'时间继续流动')}
function save(){try{localStorage.setItem('verdant-isle-v3',JSON.stringify(game.save()));$('save-status').textContent='旅程已自动保存在本机'}catch{$('save-status').textContent='本机存档不可用，请保持页面开启'}}
document.querySelectorAll('[data-power]').forEach(b=>b.onclick=()=>selectPower(b.dataset.power));
document.querySelectorAll('[data-species]').forEach(b=>b.onclick=()=>{selectedSpecies=b.dataset.species;document.querySelectorAll('[data-species]').forEach(el=>{const active=el===b;el.classList.toggle('active',active);el.setAttribute('aria-pressed',active)});selectPower('seed')});
document.querySelectorAll('[data-season]').forEach(b=>b.onclick=()=>{const result=game.changeSeason(+b.dataset.season);if(!result.ok)notify(result.text,true);updateUI();scene?.sync()});
$('journal-btn').onclick=journal;$('help-btn').onclick=help;$('log-btn').onclick=log;$('pause-btn').onclick=togglePause;
$('speed-btn').onclick=()=>{game.speed=game.speed===1?2:game.speed===2?3:1;$('speed-btn').textContent=game.speed+'×';notify(`时光流速 · ${game.speed} 倍`)};
$('sound-btn').onclick=()=>{sound=!sound;$('sound-btn').innerHTML=icon(sound?'volume':'volume-off');$('sound-btn').setAttribute('aria-label',sound?'关闭自然音效':'开启自然音效');notify(sound?'自然音效已开启':'自然音效已关闭');if(sound)tone('animal')};
$('zoom-in').onclick=()=>scene?.zoom(1);$('zoom-out').onclick=()=>scene?.zoom(-1);$('reset-view').onclick=()=>scene?.resetView();
$('reset-btn').onclick=()=>{openModal(`<div class="modal-eyebrow">A NEW BEGINNING</div><h2>再听一次初生的风？</h2><p>开启新旅程会清除这台设备上当前岛屿的进度。你将回到最初的春天，重新唤醒整座岛屿。</p><div style="margin-top:24px"><button class="secondary-button" id="cancel-reset">留在这座岛</button><button class="primary-button" id="confirm-reset">开启新旅程</button></div>`);$('cancel-reset').onclick=closeModal;$('confirm-reset').onclick=()=>{closeModal();game=new Ecosystem();game.onEvent=handleEvent;scene.game=game;scene.sync();selectedTile=null;selectedPower='rain';selectPower('rain');$('tile-info').hidden=true;scene.resetView();updateUI();updatePause();$('speed-btn').textContent='1×';save();notify('新的春天，新的故事。')}};
document.addEventListener('keydown',e=>{if($('modal').open||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;if(e.code==='Space'&&e.target.tagName!=='BUTTON'){e.preventDefault();togglePause()}const power=Object.keys(POWERS).find(key=>POWERS[key].key===e.key);if(power)selectPower(power);if(e.key==='Escape'){selectedTile=null;$('tile-info').hidden=true;$('seed-picker').hidden=true}});
window.addEventListener('beforeunload',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
function registerAgentTools(){const ctx=document.modelContext;if(!ctx?.registerTool)return;const lifecycle=new AbortController();const options={signal:lifecycle.signal};
 const tools=[{name:'read_island_ecosystem',title:'查看岛屿生态',description:'Read current island ecology, energy, season, mission and tile states.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({energy:game.energy,season:game.season,metrics:game.metrics(),quest:QUESTS[game.quest]?.name||'完成',tiles:game.tiles.map(t=>({id:t.id,plant:t.plant,growth:t.growth,water:t.water}))})},{name:'cast_island_weather',title:'施放天气',description:'Apply a weather power to a tile in the visible game, consuming spirit energy.',inputSchema:{type:'object',properties:{power:{type:'string',enum:Object.keys(POWERS)},tile_id:{type:'integer',minimum:0,maximum:60},species:{type:'string',enum:Object.keys(SPECIES)}},required:['power','tile_id'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!input||!POWERS[input.power]||!Number.isInteger(input.tile_id)||input.tile_id<0||input.tile_id>60||(input.species&&!SPECIES[input.species]))throw new Error('Invalid weather action');selectedSpecies=input.species||selectedSpecies;selectPower(input.power);scene.focusTile(input.tile_id);return cast(input.tile_id)}}];
 for(const t of tools){try{Promise.resolve(ctx.registerTool(t,options)).catch(()=>{})}catch{}}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
function renderError(){const loading=$('loading');loading.classList.remove('hide');loading.innerHTML=`${icon('leaf')}<h2>暂时无法打开 3D 岛屿</h2><p>请使用支持 WebGL 的浏览器，并开启硬件加速。</p><button class="primary-button" onclick="location.reload()">重新尝试</button>`}
document.addEventListener('game-render-error',renderError);
try{
 scene=new IslandScene($('world'),game,cast,id=>{if(id!=null)showTile(id);else if(selectedTile===null)$('tile-info').hidden=true});
 updateUI();registerAgentTools();let last=performance.now(),uiElapsed=0;
 function frame(now){const dt=Math.min((now-last)/1000,.1);last=now;if(!document.hidden){game.tick(dt);scene.animate(dt);uiElapsed+=dt;if(uiElapsed>.2){updateUI();uiElapsed=0}lastSave+=dt;if(lastSave>5){save();lastSave=0}}requestAnimationFrame(frame)}
 requestAnimationFrame(frame);setTimeout(()=>$('loading').classList.add('hide'),250);
 if(!stored)setTimeout(()=>notify('你好，天气精灵。点击荒土，让第一场雨落下。'),900);
}catch(e){console.error(e);renderError()}
