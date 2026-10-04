import './style.css';

const icons = {
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  crystal: '<path d="m8 3 8 0 5 8-9 11L3 11 8 3Z"/><path d="m8 3 4 19 4-19M3 11h18"/>',
  relic: '<path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z"/><path d="m12 7 4 2v6l-4 2-4-2V9l4-2Z"/>',
  exit: '<path d="M5 21V9a7 7 0 0 1 14 0v12M2 21h20M12 17V8m-3 3 3-3 3 3"/>',
  mushroom: '<path d="M3 13a9 9 0 0 1 18 0H3Zm7 0-1 8h6l-1-8M8 8h.01M15 7h.01M16 10h.01"/>',
  shovel: '<path d="m15 3 6 6M18 6 8 16M8 11l5 5-4 4c-4 4-9-1-5-5l4-4Z"/>',
  sonar: '<circle cx="12" cy="12" r="2"/><path d="M7 7a7 7 0 0 0 0 10m10-10a7 7 0 0 1 0 10M3.5 3.5a12 12 0 0 0 0 17m17-17a12 12 0 0 1 0 17"/>',
  lamp: '<path d="M8 5h8l2 14H6L8 5ZM10 5V2h4v3M6 19h12M12 9v6M10 12h4"/>',
  heart: '<path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 2 11 8 15 6-4 13-10 8-15Z"/>',
  bolt: '<path d="m14 2-9 12h6l-1 8 9-12h-6l1-8Z"/>',
  book: '<path d="M12 5v16M3 3c4-1 7 0 9 2 2-2 5-3 9-2v16c-4-1-7 0-9 2-2-2-5-3-9-2V3Z"/>',
  sound: '<path d="m11 4-6 5H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  mute: '<path d="m11 4-6 5H2v6h3l6 5V4Zm5 5 6 6m0-6-6 6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3h.01"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  play: '<path d="m8 4 12 8-12 8V4Z"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  expand: '<path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  boots: '<path d="M5 3h8v10l7 3v5H4V10l1-7ZM4 17h8m-7-9h8"/>',
  seed: '<path d="M12 21V10M12 14C4 14 3 8 3 4c6 0 9 4 9 10Zm0-4c1-6 5-7 9-7 0 6-3 9-9 9"/>',
  map: '<path d="m3 5 6-3 6 3 6-3v17l-6 3-6-3-6 3V5Zm6-3v17m6-14v17"/>',
  chevron: '<path d="m7 14 5-5 5 5"/>',
};

const svg = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.crystal}</svg>`;
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (v, a = 0, b = 100) => Math.min(b, Math.max(a, Number(v) || 0));
const mole = `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><ellipse cx="32" cy="36" rx="22" ry="20" fill="#76736a"/><ellipse cx="15" cy="26" rx="7" ry="9" fill="#76736a"/><ellipse cx="49" cy="26" rx="7" ry="9" fill="#76736a"/><ellipse cx="32" cy="43" rx="14" ry="11" fill="#aaa28c"/><circle cx="24" cy="34" r="3" fill="#141e1b"/><circle cx="41" cy="34" r="3" fill="#141e1b"/><ellipse cx="32" cy="41" rx="5" ry="4" fill="#cba38c"/><path d="M14 23c0-14 36-14 36 0" fill="#c4d58e"/><path d="M11 24h42" stroke="#849759" stroke-width="4" stroke-linecap="round"/><rect x="26" y="12" width="13" height="12" rx="4" fill="#6d7854"/><rect x="29" y="15" width="7" height="6" rx="2" fill="#f4eed0"/></svg>`;

export function createUI() {
  const root = document.getElementById('ui') || Object.assign(document.body.appendChild(document.createElement('div')), { id: 'ui' });
  root.innerHTML = `
    <div class="screen-vignette"></div>
    <header class="topbar">
      <a class="brand" href="#" aria-label="Beneath 地心漫游" data-action="help"><span class="brand-mark">${svg('layers')}</span><span><strong>BENEATH<span class="brand-dot">.</span></strong><small>地心漫游 <i>／</i> AN UNDERGROUND ADVENTURE</small></span></a>
      <div class="expedition-live"><span class="live-dot"></span><span>正在探索</span><i></i><b data-bind="biome">微光洞窟</b></div>
      <nav class="top-actions" aria-label="游戏选项"><button class="icon-button sound-button" data-action="sound" title="切换声音" aria-label="切换声音">${svg('sound')}</button><button class="icon-button" data-action="help" title="探索指南" aria-label="探索指南">${svg('help')}</button><span class="action-divider"></span><button class="icon-button pause-button" data-action="pause" title="暂停游戏 · Esc" aria-label="暂停游戏">${svg('pause')}</button></nav>
    </header>
    <aside class="expedition-panel">
      <div class="eyebrow"><span class="tiny-diamond"></span> THE UNDERGROWTH</div>
      <h1 data-bind="caveTitle">微光洞窟</h1>
      <p class="expedition-meta"><span data-bind="floorText">第一层</span><span class="meta-dot">·</span>距地表 <b data-bind="depth">12</b><span class="mono">m</span></p>
      <div class="chapter-rule"><span>01</span><i></i><span>EXPEDITION</span></div>
      <section class="quest-panel" aria-label="当前探险目标">
        <div class="quest-heading"><span class="quest-compass">${svg('exit')}</span><div><small>当前目标</small><h2>向更深处进发</h2></div></div>
        <p class="quest-description">收集洞窟的馈赠，寻找下一层入口。</p>
        <ul class="quest-list">
          <li data-quest="crystals"><span class="quest-check"></span><span>收集微光水晶</span><b><span data-bind="questCrystals">0</span><i>/</i><span data-bind="goalCrystals">8</span></b></li>
          <li data-quest="relics"><span class="quest-check"></span><span>寻回远古遗物</span><b><span data-bind="relics">0</span><i>/</i><span data-bind="goalRelics">3</span></b></li>
          <li data-quest="exit"><span class="quest-check"></span><span>找到地下通道</span><span class="quest-status" data-bind="exitStatus">未发现</span></li>
        </ul>
        <div class="quest-bottom">${svg('seed')}<span>好奇心，是最好的指南针。</span></div>
      </section>
    </aside>
    <aside class="map-panel glass-panel">
      <button class="map-heading" data-action="map" aria-label="打开完整洞窟地图 · M"><span>${svg('map')}洞窟地图</span><span class="map-key">M ${svg('expand')}</span></button>
      <div class="mini-map-wrap"><canvas id="minimap" width="400" height="320" aria-label="已探索洞窟地图"></canvas><span class="map-north">N</span><span class="map-marker-caption"><i></i> 你在这里</span></div>
      <div class="map-bottom"><span><i class="map-explored-dot"></i>已探索</span><b><span data-bind="explored">0</span><small>%</small></b></div>
      <div class="exploration-track"><span data-bar="explored"></span></div>
    </aside>
    <div class="ambient-caption"><span></span> FOLLOW YOUR CURIOSITY <span></span></div>
    <aside class="vitals-panel glass-panel">
      <div class="explorer-profile"><div class="mole-portrait">${mole}</div><div><strong>莫里 <span>THE EXPLORER</span></strong><p>一只勇敢的小鼹鼠</p></div><span class="level-chip">LV.<b data-bind="level">1</b></span></div>
      <div class="vital-row health-row"><span class="vital-icon">${svg('heart')}</span><div><div class="vital-label"><span>生命</span><b><span data-bind="health">100</span><i>/ 100</i></b></div><div class="vital-track"><span data-bar="health" style="width:100%"></span></div></div></div>
      <div class="vital-row energy-row"><span class="vital-icon">${svg('bolt')}</span><div><div class="vital-label"><span>体力</span><b><span data-bind="energy">100</span><i>/ 100</i></b></div><div class="vital-track"><span data-bar="energy" style="width:100%"></span></div></div></div>
    </aside>
    <div class="toolbelt-wrap"><div class="toolbelt-label"><i></i> 探险工具 <i></i></div><nav class="toolbelt" aria-label="探险工具">
      <button class="tool-card is-primary" data-action="dig" title="挖掘松土 · 空格键"><span class="tool-key">SPACE</span><span class="tool-icon">${svg('shovel')}</span><strong>挖掘</strong><small>开辟新路</small></button>
      <button class="tool-card" data-action="sonar" title="声呐探测 · Q"><span class="tool-key">Q</span><span class="tool-icon">${svg('sonar')}</span><strong>声呐</strong><small data-bind="sonarStatus">探测珍藏</small><span class="tool-cooldown" data-bar="sonar"></span></button>
      <button class="tool-card is-active" data-action="light" title="切换头灯 · F" aria-pressed="true"><span class="tool-key">F</span><span class="tool-icon">${svg('lamp')}</span><strong>头灯</strong><small data-bind="lightStatus">点亮前路</small><span class="tool-state-dot"></span></button>
      <button class="tool-card" data-action="heal" title="食用蘑菇恢复生命 · E"><span class="tool-key">E</span><span class="tool-icon">${svg('mushroom')}</span><strong>补给</strong><small>恢复生命</small><span class="tool-count" data-bind="mushrooms">0</span></button>
    </nav></div>
    <aside class="supplies-panel"><div class="supplies-label eyebrow">POCKET FINDS <span>冒险口袋</span></div><div class="pocket-resources glass-panel"><div class="resource crystal-resource">${svg('crystal')}<span><small>微光水晶</small><b data-bind="crystals">0</b></span></div><span class="resource-divider"></span><div class="resource relic-resource">${svg('relic')}<span><small>远古遗物</small><b><span data-bind="relics">0</span><i>/ 3</i></b></span></div></div><button class="journal-button" data-action="journal">${svg('book')}<span>探险手记<small>记录与装备升级</small></span><span class="keycap">J</span>${svg('arrow')}</button></aside>
    <footer class="control-hints"><span class="movement-keys"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><span>移动</span></span><i></i><span><kbd>SHIFT</kbd>冲刺</span><i></i><span><svg class="mouse-icon" viewBox="0 0 14 18" fill="none" stroke="currentColor"><rect x="2" y="1" width="10" height="16" rx="5"/><path d="M7 1v5"/></svg>拖动旋转视角</span><i></i><span><kbd>R</kbd>回到营地</span></footer>
    <div class="toast-stack" aria-live="polite"></div>
    <div class="touch-controls" aria-label="触屏移动"><button data-move="move-up" aria-label="向上移动">${svg('chevron')}</button><button data-move="move-left" aria-label="向左移动">${svg('chevron')}</button><button data-move="move-down" aria-label="向下移动">${svg('chevron')}</button><button data-move="move-right" aria-label="向右移动">${svg('chevron')}</button></div>
    <div class="modal-backdrop" hidden><section class="game-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"></section></div>
  `;

  let state = { health: 100, energy: 100, crystals: 0, relics: 0, mushrooms: 0, level: 1, depth: 12, explored: 0, sonarCooldown: 0, lightOn: true, goalCrystals: 8, goalRelics: 3, upgrades: {} };
  let handler = () => {};
  let currentModal = null;
  let mapData = null;
  let muted = false;
  let journalSignature = '';
  const timers = new Set();
  const backdrop = root.querySelector('.modal-backdrop');
  const modal = root.querySelector('.game-modal');
  backdrop.addEventListener('keydown', event => {
    if(event.key !== 'Tab') return;
    const focusable=[...modal.querySelectorAll('button:not(:disabled),a[href],[tabindex="0"]')];
    if(!focusable.length) return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(!modal.contains(document.activeElement)){event.preventDefault();first.focus();}
    else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  const bind = (name, value) => root.querySelectorAll(`[data-bind="${name}"]`).forEach(el => { if (el.textContent !== String(value)) el.textContent = value; });
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  const emit = (action, value) => handler(action, value);

  function perform(action, value) {
    if (action === 'sound') { muted = !muted; const button = root.querySelector('.sound-button'); button.innerHTML = svg(muted ? 'mute' : 'sound'); button.classList.toggle('is-muted', muted); button.setAttribute('aria-label', muted ? '开启声音' : '关闭声音'); }
    emit(action, value);
  }
  const click = event => {
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    event.preventDefault();
    perform(button.dataset.action, button.dataset.value);
  };
  root.addEventListener('click', click);
  const touchPointers = new Map();
  const pointerDown = event => {
    const button = event.target.closest('[data-move]');
    if (!button) return;
    event.preventDefault(); button.setPointerCapture(event.pointerId); touchPointers.set(event.pointerId, button.dataset.move); button.classList.add('pressed'); emit(button.dataset.move, true);
  };
  const pointerUp = event => {
    const action = touchPointers.get(event.pointerId);
    if (!action) return;
    emit(action, false); touchPointers.delete(event.pointerId); root.querySelector(`[data-move="${action}"]`)?.classList.remove('pressed');
  };
  root.addEventListener('pointerdown', pointerDown);
  root.addEventListener('pointerup', pointerUp);
  root.addEventListener('pointercancel', pointerUp);

  function update(next = {}) {
    state = { ...state, ...next, upgrades: { ...state.upgrades, ...(next.upgrades || {}) } };
    const floor = Math.max(1, state.level || 1);
    const titles = ['微光洞窟', '琥珀矿脉', '远古花园', '星辰深渊'];
    const caveTitle = state.biome || state.caveName || titles[(floor - 1) % titles.length];
    bind('biome', caveTitle); bind('caveTitle', caveTitle);
    bind('floorText', `第${['一','二','三','四','五','六','七','八','九','十'][floor - 1] || floor}层`);
    for (const key of ['crystals', 'relics', 'mushrooms', 'level', 'depth', 'goalCrystals', 'goalRelics']) bind(key, Math.max(0, Math.floor(state[key] || 0)));
    bind('questCrystals', state.crystalsCollected ?? state.collectedCrystals ?? state.crystals);
    bind('health', Math.ceil(clamp(state.health))); bind('energy', Math.ceil(clamp(state.energy)));
    bind('explored', Math.round(clamp(state.explored)));
    for (const key of ['health', 'energy', 'explored']) root.querySelector(`[data-bar="${key}"]`).style.width = `${clamp(state[key])}%`;
    root.querySelector('.health-row').classList.toggle('is-low', state.health < 30);
    root.querySelector('[data-quest="crystals"]').classList.toggle('is-complete', (state.crystalsCollected ?? state.collectedCrystals ?? state.crystals) >= state.goalCrystals);
    root.querySelector('[data-quest="relics"]').classList.toggle('is-complete', state.relics >= state.goalRelics);
    root.querySelector('[data-quest="exit"]').classList.toggle('is-complete', !!state.exitFound);
    bind('exitStatus', state.exitFound ? '已发现' : '未发现');
    bind('sonarStatus', state.sonarCooldown > 0 ? `${Math.ceil(state.sonarCooldown)} 秒后就绪` : '探测珍藏');
    root.querySelector('[data-action="sonar"]').classList.toggle('is-cooling', state.sonarCooldown > 0);
    root.querySelector('[data-bar="sonar"]').style.height = `${clamp(state.sonarCooldown / (state.sonarMaxCooldown || Math.max(5,14-(state.upgrades.sonar || 0)*3)) * 100)}%`;
    const light = root.querySelector('[data-action="light"]'); light.classList.toggle('is-active', state.lightOn !== false); light.setAttribute('aria-pressed', state.lightOn !== false);
    bind('lightStatus', state.lightOn !== false ? '点亮前路' : '头灯已关闭');
    root.querySelector('[data-action="heal"]').classList.toggle('is-empty', state.mushrooms < 1);
    root.querySelector('.pause-button').innerHTML = svg(state.paused ? 'play' : 'pause');
    root.querySelector('.chapter-rule > span').textContent = String(floor).padStart(2, '0');
    if (typeof state.sound === 'boolean' && muted === state.sound) {
      muted = !state.sound;
      const sound = root.querySelector('.sound-button');
      sound.innerHTML = svg(muted ? 'mute' : 'sound');
      sound.classList.toggle('is-muted', muted);
      sound.setAttribute('aria-label', muted ? '开启声音' : '关闭声音');
    }
    if (currentModal === 'journal' && journalSignature !== JSON.stringify([state.crystals,state.upgrades,state.depth,Math.round(state.explored)])) renderJournal();
  }

  function toast(message, kind = 'info') {
    const stack = root.querySelector('.toast-stack');
    const el = document.createElement('div');
    el.className = `game-toast toast-${kind}`;
    el.innerHTML = `<span class="toast-symbol">${svg(kind === 'success' ? 'check' : kind === 'danger' || kind === 'warning' ? 'heart' : kind === 'crystal' ? 'crystal' : 'seed')}</span><span>${escape(message)}</span>`;
    stack.appendChild(el);
    while (stack.children.length > 3) stack.firstElementChild.remove();
    requestAnimationFrame(() => el.classList.add('is-visible'));
    later(() => { el.classList.remove('is-visible'); later(() => el.remove(), 450); }, kind === 'intro' ? 9000 : 4000);
  }

  const closeButton = () => `<button class="modal-close icon-button" data-action="resume" aria-label="关闭并继续探索" title="继续探索">${svg('close')}</button>`;
  const modalHead = (eyebrow, title, subtitle) => `${closeButton()}<div class="modal-emblem">${svg('layers')}</div><div class="eyebrow">${eyebrow}</div><h2 id="modal-title">${title}</h2><p class="modal-subtitle">${subtitle}</p>`;
  const continueButton = label => `<button class="button-primary" data-action="resume">${label || '继续探索'}${svg('arrow')}</button>`;

  function renderJournal() {
    journalSignature = JSON.stringify([state.crystals,state.upgrades,state.depth,Math.round(state.explored)]);
    const upgrades = [
      { name: 'speed', icon: 'boots', title: '轻盈探险靴', description: '走得更快，发现更多。', effect: '提升移动速度', cost: 4 + (state.upgrades.speed || 0) * 3 },
      { name: 'lamp', icon: 'lamp', title: '萤火头灯', description: '让微光照向更远的地方。', effect: '扩大照明范围', cost: 4 + (state.upgrades.lamp || 0) * 3 },
      { name: 'sonar', icon: 'sonar', title: '回声探测仪', description: '听见岩石深处的秘密。', effect: '提升声呐能力', cost: 4 + (state.upgrades.sonar || 0) * 3 },
    ];
    modal.innerHTML = `${modalHead('THE EXPLORER’S JOURNAL', '探险手记', '把每一次发现，变成下一段旅途的底气。')}<div class="journal-stats"><div><small>当前深度</small><strong>${Math.round(state.depth)}<span>m</span></strong></div><div><small>探索进度</small><strong>${Math.round(state.explored)}<span>%</span></strong></div><div><small>口袋水晶</small><strong>${Math.floor(state.crystals)}${svg('crystal')}</strong></div></div><div class="modal-section-heading"><h3>准备好走得更远了吗？</h3><span>装备升级</span></div><div class="upgrade-list">${upgrades.map(u => { const level = state.upgrades[u.name] || 0; const maxed = level >= 3; return `<div class="upgrade-row"><span class="upgrade-icon">${svg(u.icon)}</span><div><h4>${u.title}<span>LV.${level}</span></h4><p>${u.description}</p><small>${u.effect}</small></div><button class="upgrade-button" data-action="upgrade-${u.name}" ${maxed || state.crystals < u.cost ? 'disabled' : ''} title="${maxed ? '已满级' : `花费 ${u.cost} 枚水晶升级`}">${maxed ? '已满级' : `${svg('crystal')}${u.cost}<span>升级</span>`}</button></div>`; }).join('')}</div><div class="journal-note">${svg('seed')}小贴士：声呐可以发现隐藏珍藏；蘑菇能让你重拾精神。</div>${continueButton()}`;
  }

  function showModal(type, data = {}) {
    currentModal = type;
    backdrop.hidden = false;
    modal.className = `game-modal modal-${type}`;
    if (type === 'journal' || type === 'shop' || type === 'inventory') { currentModal = 'journal'; renderJournal(); }
    else if (type === 'map') {
      modal.innerHTML = `${modalHead('A WORLD BELOW THE WORLD', '洞窟地图', '未知的黑暗里，总有一些值得寻找的微光。')}<div class="full-map-wrap"><canvas id="fullmap" width="760" height="760"></canvas></div><div class="map-legend"><span><i class="legend-player"></i>莫里</span><span><i class="legend-crystal"></i>水晶</span><span><i class="legend-relic"></i>遗物</span><span><i class="legend-exit"></i>地下通道</span></div>${continueButton()}`;
      if (mapData) drawMap(modal.querySelector('#fullmap'), ...mapData, true);
    } else if (type === 'win' || type === 'gameover') {
      const win = type === 'win';
      modal.innerHTML = `${modalHead(win ? 'THE ADVENTURE CONTINUES' : 'EVERY EXPLORER NEEDS A REST', win ? '深处，还有新的微光。' : '休息一下，再出发。', win ? '你找到了通往地下深处的路。未知的故事还在继续。' : '洞窟暂时留住了这次冒险。莫里的好奇心从未熄灭。')}<div class="end-mole">${mole}</div><div class="journal-stats"><div><small>探索洞层</small><strong>${state.level}</strong></div><div><small>收集水晶</small><strong>${state.crystalsCollected ?? state.collectedCrystals ?? state.crystals}</strong></div><div><small>远古遗物</small><strong>${state.relics}</strong></div></div><button class="button-primary" data-action="${win ? 'next' : 'restart'}">${win ? '前往下一层' : '重新开始'}${svg('arrow')}</button><button class="button-text" data-action="${win ? 'restart' : 'journal'}">${win ? '开始全新探险' : '翻阅探险手记'}</button>`;
      modal.querySelector('.modal-close')?.remove();
      if (!win) modal.querySelector('.button-text')?.remove();
    } else if (type === 'help') {
      modal.innerHTML = `${modalHead('A LITTLE GUIDE FOR BIG ADVENTURES', '每一步，都算探索。', '收集水晶与遗物，挖开松软的土墙，找到通往下一层的入口。')}<div class="guide-grid"><div><span>${svg('shovel')}</span><h3>开辟自己的路</h3><p>靠近松软土墙，按空格挖掘。坚硬的岩石需要绕行。</p></div><div><span>${svg('sonar')}</span><h3>听见隐藏的馈赠</h3><p>用声呐探测附近宝藏。水晶可在手记中升级你的装备。</p></div><div><span>${svg('mushroom')}</span><h3>照顾好小小的自己</h3><p>蘑菇恢复生命，营地让你安心休息。留意洞窟里的居民。</p></div><div><span>${svg('exit')}</span><h3>奔向更深的微光</h3><p>完成收集目标，找到地下通道，解锁新的探险旅程。</p></div></div><div class="guide-keys"><span><kbd>W A S D</kbd>移动</span><span><kbd>SHIFT</kbd>冲刺</span><span><kbd>SPACE</kbd>挖掘</span><span><kbd>Q</kbd>声呐</span><span><kbd>F</kbd>头灯</span><span><kbd>E</kbd>补给</span><span><kbd>M</kbd>地图</span><span><kbd>J</kbd>手记</span><span><kbd>R</kbd>营地</span><span><kbd>ESC</kbd>暂停</span></div>${continueButton('开始探索')}`;
    } else {
      modal.innerHTML = `${modalHead('TAKE A BREATH', '微光会等你。', '地下的世界已经安静下来，冒险随时可以继续。')}<div class="pause-illustration">${svg('seed')}<span></span></div>${continueButton()}<div class="pause-secondary"><button class="button-secondary" data-action="help">${svg('help')}探索指南</button><button class="button-secondary" data-action="restart">重新出发</button></div>`;
    }
    if (type === 'help') {
      const hint = document.createElement('p');
      hint.className = 'mouse-guide';
      hint.textContent = '点击已探索的地面自动寻路 · 拖动鼠标旋转视角 · 滚动滚轮缩放';
      modal.querySelector('.button-primary').before(hint);
    }
    if (data.message) { const p = modal.querySelector('.modal-subtitle'); if (p) p.textContent = data.message; }
    requestAnimationFrame(() => { backdrop.classList.add('is-open'); modal.querySelector('button:not(:disabled)')?.focus({preventScroll:true}); });
  }

  function hideModal() { currentModal = null; backdrop.classList.remove('is-open'); backdrop.hidden = true; }

  function drawMap(canvas, world, player, revealed, full) {
    if (!canvas || !world?.grid) return;
    const ctx = canvas.getContext('2d');
    const grid = world.grid;
    const rows = grid.length;
    const columns = Array.isArray(grid[0]) || typeof grid[0] === 'string' ? grid[0].length : world.size || Math.sqrt(grid.length);
    const rowCount = Array.isArray(grid[0]) || typeof grid[0] === 'string' ? rows : world.size || columns;
    const w = canvas.width, h = canvas.height;
    const padding = full ? 25 : 15;
    const unit = Math.min((w-padding*2)/columns, (h-padding*2)/rowCount);
    const ox = (w-columns*unit)/2, oy = (h-rowCount*unit)/2;
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#0e1b19'; ctx.fillRect(0, 0, w, h);
    const known = (x, z) => full === 'all' || !revealed || (typeof revealed.has === 'function' ? revealed.has(`${x},${z}`) || revealed.has(z * columns + x) : revealed[z]?.[x]);
    const cell = (x, z) => Array.isArray(grid[0]) || typeof grid[0] === 'string' ? grid[z]?.[x] : grid[z * columns + x];
    const wall = value => value === 1 || value === '#' || value === 'wall' || value === 'rock' || value?.type === 'wall' || value?.type === 'rock';
    for (let z = 0; z < rowCount; z++) for (let x = 0; x < columns; x++) {
      if (!known(x,z)) { ctx.fillStyle = (x+z)%2 ? '#12201c' : '#13221e'; ctx.fillRect(ox+x*unit, oy+z*unit, unit-0.8, unit-0.8); continue; }
      const value = cell(x,z);
      ctx.fillStyle = wall(value) ? '#2b3d33' : value === 2 || value === 'dirt' ? '#706449' : '#a1a789';
      ctx.fillRect(ox+x*unit+.4, oy+z*unit+.4, Math.max(1,unit-.8),Math.max(1,unit-.8));
      if (!wall(value)) { ctx.fillStyle = '#869879'; ctx.fillRect(ox+x*unit+.4,oy+z*unit+.4,Math.max(1,unit-.8),Math.max(.5,unit*.14)); }
    }
    const tile = world.TILE || world.cellSize || 2.2;
    const markerPos = item => ({x: item.gx ?? item.col ?? item.cellX ?? item.gridX ?? item.x ?? Math.round((item.position?.x ?? 0) / tile), z: item.gz ?? item.row ?? item.cellZ ?? item.gridZ ?? item.z ?? Math.round((item.position?.z ?? 0) / tile) });
    const point = (x,z,color,r=unit*.23) => { ctx.beginPath();ctx.arc(ox+(x+.5)*unit,oy+(z+.5)*unit,Math.max(full?2.3:2,r),0,Math.PI*2);ctx.fillStyle=color;ctx.fill(); };
    for (const item of world.collectibles || []) {
      if (item.collected || item.active === false) continue;
      const {x,z} = markerPos(item);
      if (known(x,z)) point(x,z,item.type === 'relic' ? '#dec07a' : item.type === 'mushroom' ? '#dc9d8c' : '#81dacf');
    }
    for (const [item, color] of [[world.exit,'#eee5aa'],[world.camp,'#e4a974']]) {
      if (!item) continue;
      const {x,z} = markerPos(item);
      if (!known(x,z)) continue;
      ctx.save();ctx.translate(ox+(x+.5)*unit,oy+(z+.5)*unit);ctx.rotate(Math.PI/4);ctx.fillStyle=color;ctx.fillRect(-unit*.25,-unit*.25,unit*.5,unit*.5);ctx.restore();
    }
    if (player) {
      const px = (player.x ?? player.position?.x ?? 0)/tile;
      const pz = (player.z ?? player.position?.z ?? 0)/tile;
      const x = ox+(px+.5)*unit, z=oy+(pz+.5)*unit;
      ctx.fillStyle = '#dbea9e28';ctx.beginPath();ctx.arc(x,z,unit*1.05,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle = '#dfea9a';ctx.lineWidth=1.7;ctx.beginPath();ctx.arc(x,z,unit*.63,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle = '#e9f3b2';ctx.beginPath();ctx.arc(x,z,Math.max(2.5,unit*.26),0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#1b2820';ctx.lineWidth=.8;ctx.stroke();
    }
  }

  function setMap(world, player, revealed, full = false) { mapData = [world, player, revealed]; drawMap(root.querySelector('#minimap'),world,player,revealed,false); if (currentModal === 'map') drawMap(root.querySelector('#fullmap'),world,player,revealed,full || true); }
  update();
  later(() => toast('每一道微光，都通向新的发现。', 'intro'), 700);
  return { update, toast, showModal, hideModal, setMap, onAction(fn) { handler = typeof fn === 'function' ? fn : () => {}; }, destroy() { timers.forEach(clearTimeout); root.removeEventListener('click',click); root.removeEventListener('pointerdown',pointerDown); root.removeEventListener('pointerup',pointerUp); root.removeEventListener('pointercancel',pointerUp); root.innerHTML = ''; } };
}
