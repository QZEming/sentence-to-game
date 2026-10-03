import { TOWERS, SKILLS, CHAPTERS } from './content.js';

const icons = {
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  star: '<path d="m12 2 2.8 6.5L22 11l-7.2 2.5L12 21l-2.8-7.5L2 11l7.2-2.5L12 2Z"/>',
  wave: '<path d="M3 9c3-6 6 6 9 0s6 6 9 0M3 16c3-6 6 6 9 0s6 6 9 0"/>',
  play: '<path d="m9 5 11 7-11 7V5Z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  fast: '<path d="m4 6 7 6-7 6V6Zm10 0 7 6-7 6V6Z"/>',
  sound: '<path d="M4 9h4l5-4v14l-5-4H4V9Zm12-1c2 2 2 6 0 8m3-11c4 4 4 10 0 14"/>',
  mute: '<path d="M4 9h4l5-4v14l-5-4H4V9Zm12 0 5 6m0-6-5 6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 8.5a2.5 2.5 0 0 1 5 .5c0 2-2.5 2-2.5 4m0 3h.01"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  leaf: '<path d="M20 3C8 1 1 8 5 16c8 4 15-1 15-13ZM4 20 15 9"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  snow: '<path d="M12 2v20M3.5 7l17 10m-17 0 17-10M9 4l3 3 3-3M9 20l3-3 3 3M3 10l4-1-1-4m12 14-1-4 4-1M3 14l4 1-1 4M18 5l-1 4 4 1"/>',
  moon: '<path d="M20.5 13.5A9 9 0 0 1 10.5 3a9 9 0 1 0 10 10.5Z"/>',
};
const svg = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.star}</svg>`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const avatar = (type, extra = '') => {
  const common = '<ellipse cx="39" cy="50" rx="2.4" ry="3.2" fill="#344b42"/><ellipse cx="58" cy="50" rx="2.4" ry="3.2" fill="#344b42"/><ellipse cx="33" cy="56" rx="5" ry="2.4" fill="#ec9990" opacity=".5"/><ellipse cx="64" cy="56" rx="5" ry="2.4" fill="#ec9990" opacity=".5"/><path d="M45 58q3.5 4 7 0" fill="none" stroke="#866d58" stroke-width="1.5" stroke-linecap="round"/>';
  const shapes = {
    bunny: '<path d="M32 35C21 5 36 1 43 32M52 32C58 0 74 7 63 37" fill="#fff7e6" stroke="#dcc8a9" stroke-width="1.6"/><path d="M34 29q-6-22 3-11M58 29q4-21 7-10" fill="none" stroke="#edb8ad" stroke-width="5" stroke-linecap="round"/><ellipse cx="48" cy="51" rx="27" ry="24" fill="#fff7e6" stroke="#dcc8a9" stroke-width="1.6"/>' + common + '<path d="m65 68 4 5-6 3-4-6Z" fill="#da8b55"/><path d="M38 74q11-5 22 0l5 13H31Z" fill="#dfaa67"/><path d="m48 70 3 4-3 4-3-4Z" fill="#f9e596"/>',
    cat: '<path d="m24 43 0-23 22 13 21-13 4 28" fill="#a3cbb3" stroke="#729c82" stroke-width="1.6"/><path d="m29 28 11 9-11 2m32-1 5-10 1 12" fill="#e3bcb2"/><ellipse cx="48" cy="51" rx="27" ry="24" fill="#b2d5bd" stroke="#729c82" stroke-width="1.6"/>' + common + '<path d="m42 35 5 7 5-7" fill="#75a58c"/><path d="M34 74q14-5 28 0l3 13H31Z" fill="#6b9d88"/><path d="M35 69q15 9 27 0" fill="none" stroke="#e9da95" stroke-width="7"/><path d="m27 50-12-2m12 8-12 2m53-10 12-2m-12 11 12 2" stroke="#729c82" stroke-width="1.3"/>',
    bear: '<circle cx="25" cy="30" r="13" fill="#bf8a64" stroke="#a57555" stroke-width="1.6"/><circle cx="69" cy="30" r="13" fill="#bf8a64" stroke="#a57555" stroke-width="1.6"/><circle cx="25" cy="30" r="7" fill="#efcaa2"/><circle cx="69" cy="30" r="7" fill="#efcaa2"/><ellipse cx="48" cy="50" rx="29" ry="27" fill="#d4a174" stroke="#a57555" stroke-width="1.6"/><ellipse cx="48" cy="59" rx="12" ry="9" fill="#f8dfb4"/>' + common + '<path d="m44 53 4 4 4-4Z" fill="#735848"/><path d="M34 74h28l5 13H29Z" fill="#a87956"/><path d="m34 69 14 6 14-6-6 13H40Z" fill="#e5c470"/>',
    owl: '<path d="m22 21 17 8q10-5 18 0l17-8-4 20q13 30-22 38-34-8-23-39Z" fill="#b9a6cc" stroke="#8f7b9f" stroke-width="1.6"/><path d="M48 45C26 17 11 51 29 63q9 8 19 0 10 8 19 0C85 50 69 17 48 45Z" fill="#f6e9d4"/><ellipse cx="36" cy="49" rx="3" ry="4" fill="#494956"/><ellipse cx="59" cy="49" rx="3" ry="4" fill="#494956"/><path d="m43 56 5 7 5-7Z" fill="#d1a360"/><path d="M26 66q8 10 10 16m33-16q-8 10-10 16" stroke="#8f7b9f" stroke-width="2" fill="none"/><path d="m43 74 5 4 5-4-2 13h-7Z" fill="#e5c470"/>',
  };
  return `<svg class="portrait ${extra}" viewBox="0 0 96 92" aria-hidden="true"><ellipse cx="48" cy="86" rx="29" ry="4" fill="#49634a" opacity=".1"/>${shapes[type] || shapes.bunny}</svg>`;
};

export function createUI(root, actions) {
  root.innerHTML = `<main class="game-shell">
    <div class="canvas-container" data-testid="game-scene"></div>
    <div class="top-shade"></div>
    <header class="topbar">
      <div class="brand"><div class="brand-mark">${svg('moon')}<i>✦</i></div><div><div class="brand-title">星绒守夜队<span class="brand-dot">✦</span></div><div class="brand-subtitle">THE LITTLE NIGHT WATCH</div></div></div>
      <div class="top-right"><div class="resources">
        <div class="resource life">${svg('heart')}<div><span class="resource-label">梦种生命</span><strong data-value="hp">20<span> / 20</span></strong></div></div>
        <div class="resource currency">${svg('star')}<div><span class="resource-label">星露</span><strong data-value="gold">300</strong></div></div>
        <div class="resource waves">${svg('wave')}<div><span class="resource-label">守夜波次</span><strong data-value="wave">00<span> / 12</span></strong></div></div>
      </div><div class="utility"><button class="icon-button" data-action="sound" title="开关声音" aria-label="开关声音">${svg('sound')}</button><button class="icon-button" data-action="help" title="守夜手册" aria-label="守夜手册">${svg('help')}</button></div></div>
    </header>
    <aside class="story-panel"><div class="chapter-kicker"><span class="tiny-star">✦</span><span data-value="chapter-kicker">序章 · 落星之夜</span></div><h1 data-value="chapter-title">今晚，换我们守护梦。</h1><p data-value="chapter-text">${CHAPTERS[0].text}</p><div class="story-rule"></div><div class="objective">${svg('leaf')}<span>守住月芽树，等一场天亮。</span></div><div class="chapter-progress"><span>一场小小的冒险</span><span data-value="chapter-progress">01 — 04</span></div></aside>
    <aside class="wave-panel"><div class="section-eyebrow"><span class="pulse-dot"></span><span data-value="wave-caption">下一波 · 01</span></div><p data-value="next-hint">一小群迷路的绒团正在靠近。</p><div class="wave-progress"><i data-value="wave-progress"></i></div><div class="wave-detail"><span data-value="wave-detail">准备好，就出发吧</span><span data-value="kill-count">已驱散 0</span></div></aside>
    <aside class="selection-panel" aria-live="polite"></aside>
    <div class="map-note"><span class="map-note-icon">✧</span><span data-value="map-note">点选下方伙伴，再点亮一块空地</span></div>
    <div class="toast" role="status" aria-live="polite"></div>
    <footer class="command-dock"><div class="roster-area"><div class="dock-heading"><h2>今晚的守夜伙伴 <span>GUARDIANS</span></h2><small>${svg('star')}<span>一起，把好梦留下。</span></small></div><div class="tower-roster">${Object.entries(TOWERS).map(([type,t],i) => `<button class="tower-card ${type}" data-action="selectTower" data-type="${type}" title="${t.name} · ${t.desc}"><span class="card-key">${i+1}</span><span class="tower-price">${svg('star')} ${t.cost}</span><div class="portrait-backdrop"></div>${avatar(type)}<span class="tower-name">${t.name}</span><span class="tower-role">${t.role}</span><span class="card-selected">已选</span></button>`).join('')}</div></div>
      <div class="skills-area"><div class="dock-heading"><h2>一点星星魔法</h2><small>SKILLS</small></div><div class="skill-roster">${Object.entries(SKILLS).map(([id,s]) => `<button class="skill-button ${id}" data-action="skill" data-skill="${id}" title="${s.name} · ${s.desc}"><span class="skill-art">${svg(id === 'freeze' ? 'snow' : id === 'heal' ? 'heart' : 'star')}<span class="skill-cooldown" data-cooldown="${id}"></span></span><span class="skill-name">${s.name}</span><kbd>${s.key}</kbd></button>`).join('')}</div></div>
      <div class="wave-controls"><div class="start-caption" data-value="start-caption">花园已就绪，队长。</div><button class="start-button" data-action="startWave"><span><strong data-value="start-label">开始守夜</strong><small data-value="start-subtitle">第 01 波 / 共 12 波</small></span>${svg('arrow')}</button><div class="playback-controls"><button data-action="pause" title="暂停 / 继续" aria-label="暂停">${svg('pause')}<span data-value="pause-label">暂停</span></button><button data-action="speed" title="切换游戏速度">${svg('fast')}<span data-value="speed">1×</span></button><button data-action="restart" title="重新开始" aria-label="重新开始">↻</button></div></div>
    </footer><div class="bottom-credit">MADE OF STARLIGHT & LITTLE COURAGE <span>✦</span></div>
    <div class="modal-overlay" hidden></div>
  </main>`;
  const shell = root.querySelector('.game-shell');
  const container = root.querySelector('.canvas-container');
  const selection = root.querySelector('.selection-panel');
  const modal = root.querySelector('.modal-overlay');
  const toastEl = root.querySelector('.toast');
  const refs = Object.fromEntries([...root.querySelectorAll('[data-value]')].map(el => [el.dataset.value, el]));
  let panelSignature = '', toastTimeout, previous = {}, latestState, modalSelect, helpClose;
  const set = (name, value, html = false) => {
    if (previous[name] === value) return;
    previous[name] = value;
    if (refs[name]) refs[name][html ? 'innerHTML' : 'textContent'] = value;
  };
  const closeModal = () => { const callback = helpClose; helpClose = null; modal.hidden = true; modal.innerHTML = ''; modalSelect = null; callback?.(); };
  root.addEventListener('click', e => {
    const btn = e.target.closest('button[data-action]');
    if (!btn || btn.disabled) return;
    const action = btn.dataset.action;
    if (action === 'modalClose') { closeModal(); return; }
    if (action === 'chooseRelic') {
      const callback = modalSelect;
      closeModal();
      callback?.(btn.dataset.relic);
      return;
    }
    if (action === 'selectTower') actions.selectTower?.(btn.dataset.type);
    else if (action === 'skill') actions.skill?.(btn.dataset.skill);
    else if (action === 'endRestart') { closeModal(); actions.restart?.(); }
    else actions[action]?.();
  });
  function renderSelection(state) {
    const tower = state.towers?.find(t => t.plotIndex === state.selectedPlot);
    const selectedType = tower?.type || state.selectedTowerType;
    const data = TOWERS[selectedType];
    const hasPlot = state.selectedPlot !== null && state.selectedPlot !== undefined;
    const signature = JSON.stringify([state.selectedPlot, state.selectedTowerType, tower?.level, tower?.upgradeCost, tower?.damage, tower?.range, tower?.rate, tower?.totalSpent, Math.floor(state.gold), state.phase]);
    if (panelSignature === signature) return;
    panelSignature = signature;
    selection.classList.toggle('is-active', hasPlot || !!data);
    if (!hasPlot && !data) {
      selection.innerHTML = `<div class="garden-tag">${svg('shield')}<span>月芽花园<span>MOONSPROUT GARDEN</span></span><b>01</b></div><div class="mini-instruction"><span class="instruction-number">01</span><p>选择一位守夜伙伴</p><span class="instruction-number">02</span><p>点击花园里的圆形空地</p><span class="instruction-number">03</span><p>准备好，开始第一波守夜</p></div><div class="selection-footnote">每 3 波，可收获一份星光礼物 ${svg('star')}</div>`;
      return;
    }
    const heading = tower ? '守卫档案' : hasPlot ? `第 ${String(state.selectedPlot + 1).padStart(2,'0')} 号守夜位` : '等待加入花园';
    let body;
    if (data) {
      const level = tower?.level || 1;
      const upgradeCost = tower?.upgradeCost ?? Math.floor(data.cost * (level === 1 ? .75 : 1.1));
      body = `<div class="selected-character ${selectedType}">${avatar(selectedType)}<div><h2>${data.name}</h2><span>${data.role}</span><div class="level-stars">${'✦'.repeat(level)}<span>${'✦'.repeat(3-level)}</span></div></div></div><p class="selected-description">${data.desc}</p><div class="tower-stats"><div><span>伤害</span><strong>${Math.round(tower?.damage || data.damage)}</strong></div><div><span>射程</span><strong>${Number(tower?.range || data.range).toFixed(1)}</strong></div><div><span>攻速</span><strong>${Number(tower?.rate || data.rate).toFixed(2)}<small>s</small></strong></div></div>`;
      if (tower) {
        body += `<button class="panel-primary" data-action="upgrade" ${level >= 3 || state.gold < upgradeCost ? 'disabled' : ''}><span>${level >= 3 ? '已达最高等级' : `升级 · ${esc(data.upgrade[level-1])}`}</span><b>${level >= 3 ? '✦' : `✦ ${upgradeCost}`}</b></button><button class="sell-button" data-action="sell">送伙伴休息 <span>返还 ${Math.floor((tower.totalSpent || data.cost) * .72)} 星露</span></button>`;
      } else if (hasPlot) {
        body += `<button class="panel-primary" data-action="selectTower" data-type="${selectedType}" ${state.gold < data.cost ? 'disabled' : ''}><span>邀请 ${data.name}</span><b>✦ ${data.cost}</b></button>`;
      } else {
        body += `<div class="build-prompt">${svg('leaf')}现在，点一块圆形空地吧。</div>`;
      }
    } else {
      body = `<div class="empty-plot-symbol">${svg('leaf')}<span>✧</span></div><h2 class="empty-plot-title">这里，缺一个小伙伴。</h2><p class="selected-description">选择守卫，点亮这一处守夜位。</p><div class="quick-builds">${Object.entries(TOWERS).map(([type,t]) => `<button data-action="selectTower" data-type="${type}" ${state.gold < t.cost ? 'disabled' : ''}>${avatar(type)}<span>${t.name}<small>${t.role}</small></span><b>✦ ${t.cost}</b></button>`).join('')}</div>`;
    }
    selection.innerHTML = `<div class="selection-heading"><span>${heading}</span><button class="icon-button" data-action="closeSelection" aria-label="取消选择">${svg('close')}</button></div>${body}`;
  }
  function update(state) {
    latestState = state;
    const wave = state.wave || 0;
    const running = state.phase === 'wave';
    set('hp', `${Math.max(0, Math.ceil(state.hp))}<span> / ${state.maxHp}</span>`, true);
    set('gold', Math.floor(state.gold));
    set('wave', `${String(wave).padStart(2,'0')}<span> / 12</span>`, true);
    root.querySelector('.life').classList.toggle('danger', state.hp <= state.maxHp * .3);
    const chapter = state.chapter || CHAPTERS[0];
    set('chapter-kicker', chapter.kicker);
    set('chapter-title', chapter.title);
    set('chapter-text', chapter.text);
    const chapterIndex = CHAPTERS.findIndex(c => c.kicker === chapter.kicker);
    set('chapter-progress', `${String(Math.max(chapterIndex + 1,1)).padStart(2,'0')} — 04`);
    set('next-hint', state.nextWaveHint || '一小群迷路的绒团正在靠近。');
    set('wave-caption', running ? `正在守护 · 第 ${String(wave).padStart(2,'0')} 波` : `下一波 · ${String(Math.min(12,wave+1)).padStart(2,'0')}`);
    const count = Array.isArray(state.enemies) ? state.enemies.length : Number(state.enemies || 0);
    set('wave-detail', running ? `还有 ${count} 只梦魇在花园里` : state.phase === 'victory' ? '花园迎来了天亮' : '准备好，就出发吧');
    set('kill-count', `已驱散 ${state.kills || 0}`);
    const progress = running && state.totalToSpawn ? Math.min(100, (state.spawned / state.totalToSpawn) * 100) : 0;
    refs['wave-progress'].style.width = `${progress}%`;
    set('start-caption', state.paused ? '时间暂停了，星光还在。' : running ? '每一束星光，都在守护。' : wave > 0 ? '稍作休整，再一起出发。' : '花园已就绪，队长。');
    set('start-label', state.paused ? '守夜已暂停' : running ? '正在守夜' : state.phase === 'relic' ? '领取星光礼物' : state.phase === 'victory' ? '天亮啦！' : state.phase === 'defeat' ? '梦种睡着了' : wave ? '迎接下一波' : '开始守夜');
    set('start-subtitle', running ? `第 ${String(wave).padStart(2,'0')} 波 · ${state.spawned || 0} / ${state.totalToSpawn || 0}` : `第 ${String(Math.min(12,wave+1)).padStart(2,'0')} 波 / 共 12 波`);
    root.querySelector('[data-action="startWave"]').disabled = state.phase !== 'prepare';
    const pauseButton = root.querySelector('[data-action="pause"]');
    pauseButton.disabled = !running;
    pauseButton.setAttribute('aria-label', state.paused ? '继续' : '暂停');
    set('pause-label', state.paused ? '继续' : '暂停');
    set('speed', `${state.speed || 1}×`);
    if (previous.muted !== state.muted) {
      previous.muted = state.muted;
      root.querySelector('[data-action="sound"]').innerHTML = svg(state.muted ? 'mute' : 'sound');
      root.querySelector('[data-action="sound"]').setAttribute('aria-pressed', !!state.muted);
    }
    shell.classList.toggle('is-paused', !!state.paused);
    for (const [type,t] of Object.entries(TOWERS)) {
      const card = root.querySelector(`.tower-card[data-type="${type}"]`);
      card.classList.toggle('selected', state.selectedTowerType === type);
      card.classList.toggle('unaffordable', state.gold < t.cost);
      card.setAttribute('aria-pressed', state.selectedTowerType === type);
    }
    for (const [id,skill] of Object.entries(SKILLS)) {
      const btn = root.querySelector(`[data-skill="${id}"]`);
      const seconds = Math.ceil(state.cooldowns?.[id] || 0);
      const cooldown = btn.querySelector('.skill-cooldown');
      const txt = seconds > 0 ? `${seconds}s` : '';
      if (cooldown.textContent !== txt) cooldown.textContent = txt;
      btn.disabled = seconds > 0 || !running || !!state.paused;
      btn.style.setProperty('--cooldown', `${Math.min(100,seconds/skill.cooldown*100)}%`);
    }
    set('map-note', state.paused ? '守夜暂停中 · 点击继续，让星光再次流动' : state.selectedTowerType && state.selectedPlot === null ? `选择一块圆形空地，邀请${TOWERS[state.selectedTowerType]?.name || '伙伴'}` : state.selectedPlot !== null && state.selectedPlot !== undefined ? '每一个小小的守夜位，都藏着勇气' : wave === 0 ? '点选下方伙伴，再点亮一块空地' : '点击伙伴可升级 · 每 3 波收获一份星光礼物');
    renderSelection(state);
  }
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toastEl.classList.remove('visible'), 3000);
  }
  function showRelic(options, onSelect) {
    modalSelect = onSelect;
    modal.hidden = false;
    modal.innerHTML = `<section class="modal-card relic-modal" role="dialog" aria-modal="true" aria-labelledby="relic-title"><div class="modal-kicker">✦ 来自月芽树的小小心意 ✦</div><h2 id="relic-title">勇气，值得一份星光礼物。</h2><p class="modal-intro">你守住了又一个安静的夜晚。挑选一份礼物，让旅途更明亮。</p><div class="relic-options">${options.map((r,i) => `<button class="relic-option" data-action="chooseRelic" data-relic="${esc(r.id)}"><span class="relic-number">0${i+1}</span><div class="relic-art">${esc(r.icon)}</div><h3>${esc(r.name)}</h3><p>${esc(r.desc)}</p><span class="relic-pick">收下这份心意 ${svg('arrow')}</span></button>`).join('')}</div><div class="modal-note">选择后，继续你的守夜旅程</div></section>`;
  }
  function showEnd(result, onRestart) {
    modal.hidden = false;
    const victory = result.victory ?? result.won ?? result.phase === 'victory';
    const state = { ...latestState, ...result };
    const stars = Math.max(0, Math.min(3, Number(state.stars || 0)));
    const elapsed = Math.max(0, Math.floor(state.elapsed || 0));
    const timeLabel = `${Math.floor(elapsed / 60)} 分 ${String(elapsed % 60).padStart(2, '0')} 秒`;
    const rating = victory ? `<div class="end-rating" aria-label="获得 ${stars} 星评价，最高 3 星">${Array.from({ length: 3 }, (_, i) => `<svg class="end-star ${i < stars ? 'earned' : ''}" viewBox="0 0 48 48" aria-hidden="true"><path d="m24 4 6 12.2 13.5 2-9.8 9.5 2.3 13.5L24 34.8l-12 6.4 2.3-13.5-9.8-9.5 13.5-2Z"/></svg>`).join('')}</div>` : '';
    modal.innerHTML = `<section class="modal-card end-modal" role="dialog" aria-modal="true" aria-labelledby="end-title"><div class="end-art">${svg(victory ? 'moon' : 'heart')}<span>✦</span><i>✧</i></div><div class="modal-kicker">${victory ? '十二声晚安之后 · 黎明如约而至' : '今晚的故事，暂时画上一个小小的逗号'}</div><h2 id="end-title">${victory ? '天亮了。好梦，留下了。' : '别怕，我们再守一次。'}</h2><p class="modal-intro">${victory ? '原来最厉害的魔法，是每个小伙伴都没有放弃。<br>月芽树记住了你的名字，守夜队长。' : '梦种只是暂时睡着了，伙伴们还在等你。<br>重新安排守夜位，让下一次的星光更明亮。'}</p>${rating}<div class="end-stats"><div><strong>${state.wave || 0}<small> / 12</small></strong><span>守护波次</span></div><div><strong>${state.kills || 0}</strong><span>驱散梦魇</span></div><div><strong>${Math.max(0,Math.ceil(state.hp || 0))}</strong><span>剩余生命</span></div></div><div class="end-achievements"><span>无伤守护 <strong>${state.perfectWaves || 0}</strong> 波</span><i>✦</i><span>守夜时长 <strong>${timeLabel}</strong></span></div><button class="end-restart" data-action="endRestart">再开始一场小小的冒险 ${svg('arrow')}</button></section>`;
    if (onRestart) {
      const btn = modal.querySelector('[data-action="endRestart"]');
      btn.addEventListener('click', event => { event.stopPropagation(); closeModal(); onRestart(); });
    }
  }
  function showHelp(onClose) {
    helpClose = onClose;
    modal.hidden = false;
    modal.innerHTML = `<section class="modal-card help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title"><button class="modal-close icon-button" data-action="modalClose" aria-label="关闭守夜手册">${svg('close')}</button><div class="modal-kicker">A LITTLE GUIDE TO THE NIGHT</div><h2 id="help-title">队长的守夜手册</h2><p class="modal-intro">留住好梦，只需要一点点勇气。</p><div class="help-steps"><div><b>01</b><p><strong>邀请你的伙伴</strong>选择下方守卫，再点击圆形空地建造。也可以先选空地，再挑选守卫。</p></div><div><b>02</b><p><strong>让星光更明亮</strong>点击已建造的守卫可以升级至 3 级；合理搭配单体、减速、群伤和产星守卫。</p></div><div><b>03</b><p><strong>一点魔法，大有帮助</strong>流星雨清扫梦魇，晚安泡泡暂停敌人，月芽祝福恢复生命。魔法使用后需要冷却。</p></div><div><b>04</b><p><strong>守到天亮</strong>守住全部 12 波就能迎来黎明。每 3 波选择一份星光礼物，为队伍获得永久加成。</p></div></div><div class="keyboard-guide"><span><kbd>1</kbd>–<kbd>4</kbd> 选择伙伴</span><span><kbd>Q</kbd><kbd>W</kbd><kbd>E</kbd> 使用魔法</span><span><kbd>Space</kbd> 开始 / 暂停</span><span><kbd>F</kbd> 倍速 · <kbd>P</kbd> 暂停</span><span><kbd>Esc</kbd> 取消选择</span></div><button class="panel-primary" data-action="modalClose">明白了，去守护好梦 ${svg('arrow')}</button></section>`;
  }
  return { canvasContainer: container, update, toast, showRelic, showEnd, hideModal: closeModal, showHelp };
}
