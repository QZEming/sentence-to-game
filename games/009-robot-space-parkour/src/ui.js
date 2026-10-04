const icons = {
  orbit: '<svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M14 2 26 9v10L14 26 2 19V9L14 2Z" stroke="currentColor" stroke-width="1.4"/><path d="m14 7 7 4v6l-7 4-7-4v-6l7-4Z" fill="currentColor"/><path d="M14 10v8m-4-6 8 4m0-4-8 4" stroke="#142124" stroke-width="1.3"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.6"/></svg>',
  sound: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  muted: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 4 6 6m0-6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="2"/></svg>',
  jump: '<svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="m8 13 6-6 6 6m-6-6v13M7 24h14M9 4l5-3 5 3" stroke="currentColor" stroke-width="1.5"/></svg>',
  dash: '<svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="m15 4 8 10-8 10m-7-5 4-5-4-5M2 14h21" stroke="currentColor" stroke-width="1.5"/></svg>',
  gravity: '<svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><circle cx="14" cy="14" r="3" stroke="currentColor" stroke-width="1.5"/><ellipse cx="14" cy="14" rx="12" ry="5" transform="rotate(-35 14 14)" stroke="currentColor" stroke-width="1.5"/><path d="M5 5h5m-3-3v6m12 15h5m-2-3v6" stroke="currentColor" stroke-width="1.2"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v5l3 2M9 2h6m-3 0v3" stroke="currentColor" stroke-width="1.5"/></svg>',
  core: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z" stroke="currentColor" stroke-width="1.5"/><path d="m12 7 4 2.3v5.4L12 17l-4-2.3V9.3L12 7Z" fill="currentColor"/></svg>',
  cell: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 2-9 12h6l-1 8 9-13h-6l1-7Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.5"/></svg>',
  pulse: '<svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><circle cx="14" cy="14" r="3" fill="currentColor"/><path d="M8 8a8.5 8.5 0 0 0 0 12m12-12a8.5 8.5 0 0 1 0 12M4 4a14 14 0 0 0 0 20M24 4a14 14 0 0 1 0 20" stroke="currentColor" stroke-width="1.5"/></svg>',
};

const formatTime = (value = 0) => {
  const seconds = Math.max(0, Number(value) || 0);
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}.${Math.floor((seconds % 1) * 10)}`;
};
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, Number(value) || 0));

export function createUI(callbacks = {}) {
  const root = document.getElementById('ui');
  if (!root) throw new Error('Orbit Runner requires a #ui element.');
  root.innerHTML = `
    <div class="screen-edge" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
    <header class="site-header" data-role="header">
      <a class="brand" href="#" aria-label="Orbit Runner 主菜单" data-action="brand">${icons.orbit}<span>ORBIT<span class="brand-divider">/</span>RUNNER<small>AN ABANDONED SPACE ODYSSEY</small></span></a>
      <div class="header-center" data-role="menu-signal"><i class="status-dot"></i> SYSTEM ONLINE <span>EST. 2147</span></div>
      <div class="header-actions">
        <button class="icon-button" data-action="help" title="操作指南" aria-label="打开操作指南"><span class="help-icon">?</span></button>
        <button class="icon-button" data-action="mute" data-role="sound" title="关闭声音" aria-label="关闭声音">${icons.sound}</button>
        <button class="icon-button pause-button" data-action="pause" title="暂停 · ESC" aria-label="暂停游戏">${icons.pause}</button>
      </div>
    </header>

    <section class="menu-screen" data-role="menu" aria-label="主菜单">
      <div class="menu-copy">
        <div class="eyebrow"><span class="eyebrow-square"></span> SECTOR 07 <span class="eyebrow-slash">/</span> <span class="signal-lost">SIGNAL LOST</span></div>
        <h1><span>ORBIT</span><span class="title-second">RUNNER<span class="title-mark">®</span></span></h1>
        <div class="title-caption"><span class="caption-line"></span><span>废弃空间站 · 机器人跑酷</span></div>
        <p class="menu-description">最后一束信号，来自无人深空。<br>跃过断裂舱桥，唤醒沉睡的空间站。</p>
        <div class="start-actions">
          <button class="primary-button start-button" data-action="explore"><span><small>01 / FREE EXPLORATION</small>开始探索</span>${icons.arrow}</button>
          <button class="secondary-button challenge-button" data-action="challenge">${icons.clock}<span>计时挑战</span><span class="button-note">TIME ATTACK</span>${icons.arrow}</button>
        </div>
        <button class="text-button guide-button" data-action="help"><span class="guide-cross">+</span> 初次登舱？查看操作指南 <span>↗</span></button>
      </div>
      <div class="menu-bottom">
        <div class="ability-list">
          <div class="ability">${icons.jump}<span>二段跳<small>DOUBLE JUMP</small></span></div>
          <div class="ability">${icons.dash}<span>空中冲刺<small>AIR DASH</small></span></div>
          <div class="ability">${icons.gravity}<span>重力异常<small>ZERO-G ZONES</small></span></div>
        </div>
        <div class="mission-coordinate"><span><i></i> 等待探索者接入</span><small>35.42° N &nbsp; 120.07° E &nbsp; / &nbsp; DEEP SPACE</small></div>
      </div>
      <div class="scene-annotation" aria-hidden="true"><span class="annotation-rule"></span><span>UNIT R–07<small>AUTONOMOUS EXPLORER</small></span><i></i></div>
    </section>

    <section class="game-hud is-hidden" data-role="hud" aria-label="游戏状态">
      <div class="zone-block"><span class="micro-label">CURRENT SECTOR</span><strong data-role="zone">遗落港湾</strong><span class="gravity-alert is-hidden" data-role="gravity">${icons.gravity} 低重力区域</span></div>
      <div class="journey-block"><div class="journey-title"><span>站点修复进度</span><span data-role="progress-label">00%</span></div><div class="journey-track"><div data-role="progress-bar"></div><i></i><i></i><i></i><i></i></div><span class="checkpoint-label">CHECKPOINT <b data-role="checkpoint">01</b><span data-role="mode-label">自由探索</span></span></div>
      <div class="telemetry">
        <div class="stat stat-time">${icons.clock}<span><small>ELAPSED TIME</small><strong data-role="time">00:00.0</strong></span></div>
        <div class="stat stat-cells">${icons.cell}<span><small>ENERGY</small><strong data-role="cells">0</strong></span></div>
        <div class="stat stat-cores">${icons.core}<span><small>DATA CORE</small><strong data-role="cores">0</strong></span></div>
      </div>
      <div class="health-block"><div class="health-caption"><span>R–07 <i>机体状态</i></span><b data-role="health-label">100%</b></div><div class="health-segments" data-role="health"><i></i><i></i><i></i></div><span class="micro-label health-subtitle">LIFE SUPPORT SYSTEM</span></div>
      <div class="quick-keys"><span><kbd>WASD</kbd>移动</span><span><kbd>SPACE</kbd>二段跳</span><span><kbd>SHIFT</kbd>冲刺</span><span><kbd>E</kbd>脉冲</span><span><kbd>R</kbd>返回存档</span></div>
      <div class="power-block"><div class="power-line"><span>${icons.dash}冲刺推进器</span><b data-role="dash-label">READY</b></div><div class="power-meter"><div data-role="dash"></div></div><div class="pulse-line"><span><kbd>E</kbd> 能量脉冲</span><span data-role="pulse-label">就绪</span><div class="pulse-meter"><div data-role="pulse"></div></div></div></div>
      <div class="crosshair" aria-hidden="true"></div>
    </section>

    <section class="overlay-screen is-hidden" data-role="paused" aria-label="游戏暂停">
      <div class="screen-card pause-card"><span class="eyebrow"><span class="eyebrow-square"></span> CONNECTION ON HOLD</span><h2>暂停航行<span>TAKE A BREATH.</span></h2><p>星海会等你。准备好后，继续前行。</p><div class="card-buttons"><button class="primary-button" data-action="resume"><span>继续探索</span>${icons.arrow}</button><button class="secondary-button" data-action="restart">重新开始<span>↻</span></button><button class="text-button" data-action="menu">返回主菜单</button></div><div class="quality-control"><span>渲染画质</span><div role="group" aria-label="渲染画质"><button data-quality="low" aria-pressed="false">流畅</button><button class="active" data-quality="high" aria-pressed="true">精致</button></div></div><span class="pause-hint"><kbd>ESC</kbd> 返回游戏</span></div>
    </section>

    <section class="overlay-screen is-hidden" data-role="won" aria-label="探索完成">
      <div class="screen-card completion-card"><div class="completion-emblem">${icons.orbit}</div><span class="eyebrow">TRANSMISSION RESTORED</span><h2>信号已重连<span>YOU BROUGHT IT BACK.</span></h2><p>在寂静的宇宙里，又有一盏灯亮了。</p><div class="result-grid"><div><span>航行用时</span><strong data-role="result-time">00:00.0</strong></div><div><span>能量晶体</span><strong data-role="result-cells">0</strong></div><div><span>数据核心</span><strong data-role="result-cores">0</strong></div><div><span>重启次数</span><strong data-role="result-deaths">0</strong></div></div><div class="best-result is-hidden" data-role="best-result">个人最佳 <span data-role="result-best"></span></div><div class="card-buttons"><button class="primary-button" data-action="restart"><span>再次启程</span>${icons.arrow}</button><button class="text-button" data-action="menu">返回主菜单</button></div></div>
    </section>

    <div class="modal-backdrop is-hidden" data-role="help" role="dialog" aria-modal="true" aria-labelledby="guide-title">
      <div class="guide-modal"><button class="icon-button modal-close" data-action="close-help" aria-label="关闭操作指南">${icons.close}</button><span class="eyebrow">R–07 / FIELD MANUAL</span><h2 id="guide-title">探索者手册<span>每一次跃起，都离信号更近。</span></h2><div class="guide-layout"><div class="control-guide"><div><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span><p><b>自由移动</b><small>沿着舱桥探索，及时调整落点。</small></p></div><div><span><kbd>SPACE</kbd> × 2</span><p><b>二段跳跃</b><small>起跳后再次按空格，获得第二次跃升。</small></p></div><div><span><kbd>SHIFT</kbd></span><p><b>空中冲刺</b><small>向移动方向快速推进，越过远距断层。</small></p></div><div><span><kbd>E</kbd></span><p><b>能量脉冲</b><small>短暂清除附近激光；等能量冷却后再使用。</small></p></div><div><span><kbd>R</kbd> / <kbd>ESC</kbd></span><p><b>返回检查点 / 暂停</b><small>遇到困难，随时回到最近的检查点。</small></p></div><div><span class="mouse-control">鼠标拖动 / 滚轮</span><p><b>观察与缩放</b><small>旋转视角寻找路线，滚动调整镜头距离。</small></p></div></div><div class="mission-guide"><h3>任务简报</h3><p>找回 3 枚反应堆核心，抵达逃生舱，重新连接失联的空间站。</p><div>${icons.cell}<p><b>收集能量晶体</b><small>每收集 10 枚晶体，修复一格受损装甲。</small></p></div><div>${icons.core}<p><b>寻找数据核心</b><small>探索支路，找回空间站遗失的数据。</small></p></div><div>${icons.gravity}<p><b>适应重力异常</b><small>低重力区能跳得更远，也需要提前规划落点。</small></p></div><p class="guide-tip">探索提示：用二段跳调整高度，再用冲刺穿越断层。检查点自动存档并修复机体；计时挑战每次重启加时 5 秒。</p></div></div><button class="primary-button guide-confirm" data-action="close-help"><span>准备就绪</span>${icons.arrow}</button></div>
    </div>

    <div class="toast-container" data-role="toasts" aria-live="polite" aria-atomic="true"></div>
    <div class="touch-controls is-hidden" data-role="touch" aria-label="触屏控制">
      <div class="touch-dpad"><button class="touch-key touch-up" data-key="KeyW" aria-label="向前">↑</button><button class="touch-key touch-left" data-key="KeyA" aria-label="向左">←</button><button class="touch-key touch-down" data-key="KeyS" aria-label="向后">↓</button><button class="touch-key touch-right" data-key="KeyD" aria-label="向右">→</button><span class="touch-center"></span></div>
      <div class="touch-actions"><button class="touch-key touch-pulse" data-key="KeyE" aria-label="能量脉冲">${icons.pulse}<span>脉冲</span></button><button class="touch-key touch-dash" data-key="ShiftLeft" aria-label="冲刺">${icons.dash}<span>冲刺</span></button><button class="touch-key touch-jump" data-key="Space" aria-label="跳跃">${icons.jump}<span>跳跃</span></button></div>
    </div>
  `;

  const refs = Object.fromEntries([...root.querySelectorAll('[data-role]')].map((node) => [node.dataset.role, node]));
  const healthSegments = [...refs.health.children];
  let currentMode = 'menu';
  let lastState = {};
  let helpWasPlaying = false;
  let lastFocus = null;
  let toastTimer;
  const cache = {};
  const activeTouchKeys = new Map();

  const setText = (key, value) => {
    const text = String(value);
    if (cache[key] === text) return;
    refs[key].textContent = text;
    cache[key] = text;
  };
  const setMeter = (key, value) => {
    const rounded = Math.round(clamp(value) * 100);
    if (cache[key] === rounded) return;
    refs[key].style.transform = `scaleX(${rounded / 100})`;
    cache[key] = rounded;
  };
  const emitControl = (key, down) => window.dispatchEvent(new CustomEvent('orbit-control', { detail: { key, down } }));
  const releaseTouchKeys = () => {
    activeTouchKeys.forEach((key) => emitControl(key, false));
    activeTouchKeys.clear();
    root.querySelectorAll('.touch-key.pressed').forEach((button) => button.classList.remove('pressed'));
  };
  const openHelp = () => {
    lastFocus = document.activeElement;
    helpWasPlaying = currentMode === 'playing';
    if (helpWasPlaying && callbacks.pause) callbacks.pause();
    refs.help.classList.remove('is-hidden');
    refs.help.querySelector('[data-action="close-help"]').focus({ preventScroll: true });
    releaseTouchKeys();
  };
  const closeHelp = () => {
    refs.help.classList.add('is-hidden');
    if (helpWasPlaying && currentMode === 'paused') callbacks.resume?.();
    helpWasPlaying = false;
    lastFocus?.focus?.({ preventScroll: true });
  };

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    event.preventDefault();
    switch (button.dataset.action) {
      case 'explore': callbacks.start?.('explore'); break;
      case 'challenge': callbacks.start?.('challenge'); break;
      case 'resume': callbacks.resume?.(); break;
      case 'restart': callbacks.restart?.(); break;
      case 'menu': callbacks.menu?.(); break;
      case 'brand': if (currentMode === 'menu') return; callbacks.menu?.(); break;
      case 'mute': callbacks.mute?.(); break;
      case 'help': openHelp(); break;
      case 'close-help': closeHelp(); break;
      case 'pause': callbacks.pause ? callbacks.pause() : window.dispatchEvent(new CustomEvent('orbit-pause')); break;
    }
  });
  root.querySelectorAll('[data-quality]').forEach((button) => button.addEventListener('click', () => {
    root.querySelectorAll('[data-quality]').forEach((option) => {
      const selected = option === button;
      option.classList.toggle('active', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
    callbacks.quality?.(button.dataset.quality);
  }));
  refs.help.addEventListener('click', (event) => { if (event.target === refs.help) closeHelp(); });
  refs.help.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeHelp(); }
    if (event.key === 'Tab') {
      const buttons = [...refs.help.querySelectorAll('button')];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  root.querySelectorAll('[data-key]').forEach((button) => {
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      activeTouchKeys.set(event.pointerId, button.dataset.key);
      button.classList.add('pressed');
      emitControl(button.dataset.key, true);
    });
    const release = (event) => {
      if (!activeTouchKeys.has(event.pointerId)) return;
      emitControl(activeTouchKeys.get(event.pointerId), false);
      activeTouchKeys.delete(event.pointerId);
      button.classList.remove('pressed');
    };
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
  });
  window.addEventListener('blur', releaseTouchKeys);

  function showScreen(mode, data = {}) {
    if (currentMode !== mode) releaseTouchKeys();
    currentMode = mode;
    root.dataset.mode = mode;
    refs.menu.classList.toggle('is-hidden', mode !== 'menu');
    refs.paused.classList.toggle('is-hidden', mode !== 'paused');
    refs.won.classList.toggle('is-hidden', mode !== 'won');
    refs.hud.classList.toggle('is-hidden', mode === 'menu' || mode === 'won');
    refs.touch.classList.toggle('is-hidden', mode !== 'playing');
    refs['menu-signal'].classList.toggle('is-hidden', mode !== 'menu');
    if (mode === 'menu') {
      refs.help.classList.add('is-hidden');
      refs.toasts.classList.remove('visible');
      clearTimeout(toastTimer);
      helpWasPlaying = false;
    }
    if (mode === 'won') {
      setText('result-time', formatTime(data.time ?? lastState.time));
      setText('result-cells', data.cells ?? lastState.cells ?? 0);
      setText('result-cores', data.cores ?? lastState.cores ?? 0);
      setText('result-deaths', data.deaths ?? lastState.deaths ?? 0);
      const best = data.best ?? lastState.best;
      refs['best-result'].classList.toggle('is-hidden', best == null);
      if (best != null) setText('result-best', formatTime(best));
    }
  }

  function update(state) {
    lastState = state;
    if (state.mode && state.mode !== currentMode) showScreen(state.mode, state);
    if (currentMode === 'menu') return;
    setText('zone', state.zone || '遗落港湾');
    setText('progress-label', `${Math.round(clamp(state.progress) * 100).toString().padStart(2, '0')}%`);
    setMeter('progress-bar', state.progress);
    setText('checkpoint', String((state.checkpoint ?? 0) + 1).padStart(2, '0'));
    setText('mode-label', state.challenge ? '计时挑战' : '自由探索');
    setText('time', formatTime(state.time));
    setText('cells', state.cells ?? 0);
    setText('cores', state.cores ?? 0);
    const health = clamp(state.health ?? 3, 0, 3);
    if (cache.health !== health) {
      healthSegments.forEach((segment, index) => segment.classList.toggle('depleted', index >= health));
      refs.health.classList.toggle('critical', health <= 1);
      cache.health = health;
    }
    setText('health-label', `${Math.round((health / 3) * 100)}%`);
    setMeter('dash', state.dash ?? 1);
    setText('dash-label', (state.dash ?? 1) >= 0.98 ? 'READY' : `${Math.round(clamp(state.dash) * 100)}%`);
    setMeter('pulse', state.pulse ?? 1);
    setText('pulse-label', (state.pulse ?? 1) >= 0.98 ? '就绪' : '充能中');
    if (cache.gravity !== Boolean(state.lowGravity)) {
      refs.gravity.classList.toggle('is-hidden', !state.lowGravity);
      cache.gravity = Boolean(state.lowGravity);
    }
  }

  function toast(text) {
    clearTimeout(toastTimer);
    refs.toasts.textContent = text;
    refs.toasts.classList.add('visible');
    toastTimer = setTimeout(() => refs.toasts.classList.remove('visible'), 3300);
  }

  function setMuted(muted) {
    refs.sound.innerHTML = muted ? icons.muted : icons.sound;
    refs.sound.title = muted ? '开启声音' : '关闭声音';
    refs.sound.setAttribute('aria-label', refs.sound.title);
    refs.sound.setAttribute('aria-pressed', String(muted));
    refs.sound.classList.toggle('muted', muted);
  }

  showScreen('menu');
  return { update, showScreen, toast, setMuted };
}
