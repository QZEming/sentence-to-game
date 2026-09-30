import {
  LEVELS,
  TOWERS,
  HEROES,
  SPELLS,
  DIFFICULTIES,
  ENDING,
} from "./data.js";
import { getTowerStats } from "./game.js";

const TOWER_ORDER = ["carrot", "berry", "frost", "spark", "honey", "bloom"];
const TOWER_ICONS = {
  carrot: "🥕",
  berry: "🍓",
  frost: "🔔",
  spark: "✦",
  honey: "🍯",
  bloom: "🌸",
};
const HERO_ICONS = { momo: "🐰", pip: "🦊", bao: "🐼" };
const HERO_ROLES = {
  momo: "单体 · 对空",
  pip: "范围 · 对空",
  bao: "近战 · 减速",
};
const SPELL_ORDER = ["meteor", "frost", "bell"];
const SPELL_ICONS = { meteor: "☄", frost: "❄", bell: "🔔" };
const SPELL_KEYS = { meteor: "Q", frost: "W", bell: "E" };
const PRIORITIES = [
  ["first", "最接近星灯"],
  ["strong", "生命最多"],
  ["near", "距离最近"],
];
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;
const num = (value, fallback = 0) =>
  Math.max(0, Math.floor(finite(value, fallback)));
const fmt = (value) => num(value).toLocaleString("zh-CN");
const round = (value) => String(Math.round(finite(value) * 10) / 10);
const heroName = (hero) =>
  String(hero?.name || "星灯伙伴")
    .split(/[·・]/)
    .at(-1)
    .trim();
const getLevel = (id) => LEVELS.find((level) => level.id === id) || LEVELS[0];
const starCount = (records, id) => Math.min(3, num(records?.stars?.[id]));
const starsHTML = (count) =>
  [1, 2, 3]
    .map((n) => "<span" + (n > count ? ' class="unearned"' : "") + ">✦</span>")
    .join("");
const normalizeRecords = (records) => ({
  stars: records?.stars || {},
  bestWaves: records?.bestWaves || {},
  runs: num(records?.runs),
  wins: num(records?.wins),
});

export function createUI({ onAction } = {}) {
  const root = document.getElementById("app");
  const $ = (id) => document.getElementById(id);
  const cache = new Map(),
    timers = new Set(),
    listeners = [];
  let records = normalizeRecords();
  let options = {
    levelId: LEVELS[0].id,
    mode: "story",
    difficulty: "normal",
    hero: "momo",
  };
  let screen = "menu",
    detailSignature = "",
    storyLevel = LEVELS[0],
    storyLines = [],
    storyPage = 0;
  let helpOpen = false,
    helpResume = false,
    helpOrigin = null,
    destroyed = false;
  const emit = (action) => {
    if (!destroyed && typeof onAction === "function") onAction(action);
  };
  const listen = (target, type, handler, config) => {
    target.addEventListener(type, handler, config);
    listeners.push(() => target.removeEventListener(type, handler, config));
  };
  function text(id, value) {
    const next = String(value);
    if (cache.get(id) !== next) {
      $(id).textContent = next;
      cache.set(id, next);
    }
  }
  function html(id, value) {
    const key = "html:" + id;
    if (cache.get(key) !== value) {
      $(id).innerHTML = value;
      cache.set(key, value);
    }
  }
  function unlocked(level) {
    const index = LEVELS.findIndex((entry) => entry.id === level.id);
    return (
      options.mode === "endless" ||
      index <= 0 ||
      starCount(records, LEVELS[index - 1].id) > 0
    );
  }
  function sanitize(candidate = {}) {
    options = { ...options, ...candidate };
    if (!LEVELS.some((level) => level.id === options.levelId))
      options.levelId = LEVELS[0].id;
    if (!["story", "endless"].includes(options.mode)) options.mode = "story";
    if (!DIFFICULTIES[options.difficulty]) options.difficulty = "normal";
    if (!HEROES[options.hero]) options.hero = "momo";
    if (!unlocked(getLevel(options.levelId)))
      options.levelId = LEVELS.find(unlocked)?.id || LEVELS[0].id;
  }
  const getOptions = () => ({ ...options });
  function renderMenu() {
    const level = getLevel(options.levelId),
      index = LEVELS.indexOf(level);
    text(
      "story-progress",
      LEVELS.reduce((sum, l) => sum + starCount(records, l.id), 0) +
        " / " +
        LEVELS.length * 3 +
        " ✦",
    );
    root
      .querySelectorAll("[data-mode]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.mode === options.mode),
        ),
      );
    text(
      "mode-note",
      options.mode === "story"
        ? "完成一章即可开启下一座浮岛。守住更多生命，收集更多星光。"
        : "全部浮岛均可挑战。小团子一波接一波，守护没有终点。",
    );
    text(
      "level-count",
      options.mode === "story"
        ? "CHAPTER " +
            String(index + 1).padStart(2, "0") +
            " / " +
            String(LEVELS.length).padStart(2, "0")
        : "ENDLESS ADVENTURE",
    );
    html(
      "level-picker",
      LEVELS.map((entry, i) => {
        const open = unlocked(entry),
          count = starCount(records, entry.id),
          best = num(records.bestWaves[entry.id + "|" + options.difficulty]);
        const footer = !open
          ? '<span class="level-locked">待点亮</span>'
          : options.mode === "endless"
            ? '<span class="level-stars">' +
              (best ? "最佳 " + best + " 波" : "无限星光") +
              "</span>"
            : '<span class="level-stars" aria-label="' +
              count +
              ' 星">' +
              starsHTML(count) +
              "</span>";
        return (
          '<button type="button" class="level-card" data-level="' +
          esc(entry.id) +
          '" aria-pressed="' +
          (entry.id === options.levelId) +
          '" aria-label="' +
          esc(entry.name + (open ? "" : "，先完成上一章")) +
          '"' +
          (open ? "" : " disabled") +
          '><span class="level-number">' +
          String(i + 1).padStart(2, "0") +
          '</span><span class="level-name">' +
          esc(entry.name) +
          "</span>" +
          footer +
          "</button>"
        );
      }).join(""),
    );
    text("level-description", level.description || level.subtitle || "");
    text("preview-label", level.name);
    html(
      "hero-picker",
      Object.entries(HEROES)
        .map(
          ([id, hero]) =>
            '<button type="button" class="hero-card" data-hero="' +
            esc(id) +
            '" aria-pressed="' +
            (id === options.hero) +
            '" aria-label="' +
            esc(hero.name + "，" + hero.description) +
            '"><span class="hero-card-icon" aria-hidden="true">' +
            HERO_ICONS[id] +
            "</span><span><strong>" +
            esc(heroName(hero)) +
            "</strong><small>" +
            HERO_ROLES[id] +
            "</small></span></button>",
        )
        .join(""),
    );
    text("hero-description", HEROES[options.hero].description || "");
    $("difficulty").value = options.difficulty;
    html(
      "start-game",
      "<span>" +
        (options.mode === "story" ? "出发，点亮星灯" : "开始无尽守护") +
        '</span><span aria-hidden="true">↗</span>',
    );
  }
  function preview() {
    renderMenu();
    emit({ type: "preview", options: getOptions() });
  }
  function updateInert() {
    for (const [id, mode] of [
      ["menu-overlay", "menu"],
      ["site-header", "menu"],
      ["game-hud", "playing"],
      ["story-overlay", "story"],
      ["pause-overlay", "paused"],
      ["result-overlay", "result"],
    ])
      $(id).inert = screen !== mode || helpOpen;
  }
  function closeHelp(resume = true) {
    if (!helpOpen) return;
    const shouldResume = resume && helpResume && screen === "paused";
    helpOpen = false;
    helpResume = false;
    $("help-overlay").hidden = true;
    root.dataset.helpOpen = "false";
    updateInert();
    if (shouldResume) emit({ type: "resume" });
    if (helpOrigin?.isConnected && !helpOrigin.closest("[hidden],[inert]"))
      helpOrigin.focus({ preventScroll: true });
    helpOrigin = null;
  }
  function openHelp(origin) {
    if (helpOpen) return;
    helpOrigin = origin || document.activeElement;
    helpResume = screen === "playing";
    helpOpen = true;
    if (helpResume) emit({ type: "pause" });
    $("help-overlay").hidden = false;
    root.dataset.helpOpen = "true";
    updateInert();
    $("help-overlay")
      .querySelector('[data-action="closeHelp"]')
      .focus({ preventScroll: true });
  }
  function setScreen(mode) {
    if (!["menu", "story", "playing", "paused", "result"].includes(mode))
      return;
    if (helpOpen && ["menu", "story", "result"].includes(mode))
      closeHelp(false);
    const previous = screen;
    screen = mode;
    document.body.dataset.screen = mode;
    for (const [id, target] of [
      ["menu-overlay", "menu"],
      ["site-header", "menu"],
      ["story-overlay", "story"],
      ["pause-overlay", "paused"],
      ["result-overlay", "result"],
    ])
      $(id).hidden = target !== mode;
    $("game-hud").hidden = !["playing", "paused", "result"].includes(mode);
    updateInert();
    if (previous !== mode && !helpOpen) {
      const modal = {
        story: "story-overlay",
        paused: "pause-overlay",
        result: "result-overlay",
      }[mode];
      if (modal)
        $(modal)
          .querySelector("button:not([hidden]):not(:disabled)")
          ?.focus({ preventScroll: true });
      else if (mode === "playing")
        $("game-canvas").focus({ preventScroll: true });
    }
  }
  function showMenu(nextRecords = records, lastOptions = options) {
    records = normalizeRecords(nextRecords);
    sanitize(lastOptions);
    renderMenu();
    detailSignature = "";
    $("selection-panel").hidden = true;
    $("selection-hint").hidden = true;
    setScreen("menu");
  }
  function renderStory() {
    text(
      "story-chapter",
      "CHAPTER " +
        String(LEVELS.indexOf(storyLevel) + 1).padStart(2, "0") +
        " · " +
        (storyLevel.subtitle || "星灯的邀请"),
    );
    text("story-title", storyLevel.name);
    text("story-text", storyLines[storyPage]);
    text(
      "story-page",
      String(storyPage + 1).padStart(2, "0") +
        " / " +
        String(storyLines.length).padStart(2, "0"),
    );
    text(
      "story-next",
      (storyPage >= storyLines.length - 1 ? "开始守护" : "继续") + " →",
    );
    $("story-overlay").querySelector(".story-portrait>span").textContent =
      HERO_ICONS[options.hero];
  }
  function showStory(level) {
    storyLevel =
      typeof level === "string"
        ? getLevel(level)
        : level || getLevel(options.levelId);
    storyLines =
      Array.isArray(storyLevel.intro) && storyLevel.intro.length
        ? storyLevel.intro.map(String)
        : ["星灯的光正在变淡。让我们一起守住它，唤醒迷路的小团子。"];
    storyPage = 0;
    renderStory();
    setScreen("story");
  }
  function showResult(state, nextRecords = records) {
    if (!state) return;
    records = normalizeRecords(nextRecords);
    const result = state.result || {},
      level = getLevel(state.levelId),
      index = LEVELS.indexOf(level),
      endless = state.options?.mode === "endless",
      won = result.won ?? state.phase === "won",
      stars = Math.min(3, num(result.stars)),
      last = !endless && won && index === LEVELS.length - 1;
    $("result-overlay").querySelector(".result-card").dataset.won = String(won);
    text("result-emblem", endless ? "∞" : won ? "✦" : "☁");
    text(
      "result-eyebrow",
      endless
        ? "EVERY WAVE, A LITTLE BRAVER"
        : won
          ? "A LIGHT WORTH KEEPING"
          : "THE LIGHT IS STILL WAITING",
    );
    text(
      "result-title",
      endless
        ? "这束光，已经很耀眼"
        : last
          ? "整片星夜，都亮起来了"
          : won
            ? "星灯，亮起来了！"
            : "再一起试一次吧",
    );
    $("result-stars").hidden = endless;
    $("result-stars").setAttribute("aria-label", "获得 " + stars + " 星");
    html("result-stars", starsHTML(stars));
    text(
      "result-story",
      endless
        ? "每一次守护都让小伙伴更勇敢。带着这次的经验，再点亮更远的星光。"
        : won
          ? level.outro || "梦雾渐渐散去，小团子们找到了回家的路。"
          : "小团子没有走远。试试调整塔的位置与进阶路线，让伙伴和技能一起帮忙。",
    );
    const waves = num(result.waves, state.wave),
      metrics = [
        [endless ? waves : num(state.lives), endless ? "守护波数" : "剩余生命"],
        [num(result.kills, state.kills ?? state.stats?.kills), "温柔唤醒"],
        [num(state.stats?.upgrades), "防线升级"],
      ];
    html(
      "result-stats",
      metrics
        .map(
          ([value, label]) =>
            "<div><strong>" +
            fmt(value) +
            "</strong><small>" +
            label +
            "</small></div>",
        )
        .join(""),
    );
    if (endless) {
      const best = Math.max(
        waves,
        num(records.bestWaves[level.id + "|" + state.options.difficulty]),
      );
      text("result-record", level.name + " · 最佳守护 " + best + " 波");
    } else {
      const best = Math.max(stars, starCount(records, level.id)),
        total = LEVELS.reduce(
          (sum, l) =>
            sum + (l.id === level.id ? best : starCount(records, l.id)),
          0,
        );
      text(
        "result-record",
        "本章最佳 " +
          best +
          " 星 · 旅途星光 " +
          total +
          " / " +
          LEVELS.length * 3,
      );
    }
    $("ending-note").hidden = !last;
    if (last)
      text(
        "ending-note",
        Array.isArray(ENDING) ? ENDING.join("\n") : String(ENDING || ""),
      );
    $("next-level").hidden = endless || !won || index >= LEVELS.length - 1;
    text(
      "next-level",
      "前往" + (LEVELS[index + 1]?.name || "下一座浮岛") + " →",
    );
    text(
      "result-retry",
      endless ? "再挑战一次" : won ? "再守护一次" : "重新点亮星灯",
    );
    setScreen("result");
  }
  function selectedTower(state, view) {
    return (
      (state.towers || []).find((t) => t.id === view.selectedTowerId) ||
      (view.selectedPadId
        ? (state.towers || []).find((t) => t.padId === view.selectedPadId)
        : null) ||
      null
    );
  }
  function renderDetail(state, view) {
    const tower = selectedTower(state, view),
      chosen =
        view.pendingAction?.type === "build" ? view.pendingAction.id : null,
      level = getLevel(state.levelId),
      pad = level.pads.find((p) => p.id === view.selectedPadId),
      panel = $("selection-panel");
    panel.hidden = !tower && !chosen && !pad;
    if (panel.hidden) {
      detailSignature = "";
      return;
    }
    const stats = tower
      ? getTowerStats(tower)
      : chosen && TOWERS[chosen]
        ? getTowerStats({ type: chosen, level: 1, branch: null })
        : null;
    const signature = JSON.stringify([
      tower?.id,
      tower?.type,
      tower?.level,
      tower?.branch,
      tower?.priority,
      tower?.spent,
      chosen,
      pad?.id,
      state.candy >= finite(stats?.upgradeCost, Infinity),
      state.candy >= finite(stats?.branchCosts?.a, Infinity),
      state.candy >= finite(stats?.branchCosts?.b, Infinity),
    ]);
    if (signature === detailSignature) return;
    detailSignature = signature;
    const close =
      '<button type="button" class="detail-close" data-action="cancelSelection" aria-label="关闭详情">×</button>';
    const heading = (icon, title, subtitle) =>
      '<div class="detail-heading"><span class="detail-icon" aria-hidden="true">' +
      icon +
      "</span><div><h3>" +
      esc(title) +
      "</h3><small>" +
      esc(subtitle) +
      "</small></div>" +
      close +
      "</div>";
    const metricsHTML = (metrics) =>
      '<div class="tower-metrics">' +
      metrics
        .map(
          ([value, label]) =>
            "<div><strong>" +
            esc(value) +
            "</strong><small>" +
            label +
            "</small></div>",
        )
        .join("") +
      "</div>";
    if (tower) {
      const data = TOWERS[tower.type],
        branch = tower.branch && data.branches?.[tower.branch];
      let content =
        heading(
          TOWER_ICONS[tower.type],
          data.name,
          (branch ? branch.name + " · " : "") + "Lv. " + tower.level,
        ) +
        '<p class="detail-description">' +
        esc(branch?.description || data.description) +
        "</p>";
      content += metricsHTML(
        stats.income
          ? [
              [stats.income, "每波产糖"],
              [round(stats.range), "光环范围"],
              [tower.level, "守护等级"],
            ]
          : [
              [round(stats.damage), "唤醒力量"],
              [round(stats.range), "守护范围"],
              [round(stats.interval) + "s", "行动间隔"],
            ],
      );
      if (tower.level === 1 && stats.upgradeCost != null) {
        const cost = num(stats.upgradeCost);
        content +=
          '<button type="button" class="button button-primary upgrade-button" data-action="upgrade" data-tower-id="' +
          esc(tower.id) +
          '"' +
          (state.candy >= cost ? "" : " disabled") +
          "><span>升级至 Lv. 2</span><small>◆ " +
          cost +
          "</small></button>";
      } else if (tower.level === 2) {
        content +=
          '<div class="detail-section-title">选择最终进阶 · Lv. 3</div><div class="branch-buttons">';
        for (const id of ["a", "b"]) {
          const upgrade = data.branches[id],
            cost = num(stats.branchCosts?.[id]);
          content +=
            '<button type="button" class="branch-button" data-action="upgrade" data-tower-id="' +
            esc(tower.id) +
            '" data-branch="' +
            id +
            '"' +
            (state.candy >= cost ? "" : " disabled") +
            "><strong>" +
            esc(upgrade.name) +
            "</strong><small>" +
            esc(upgrade.description) +
            '</small><span class="branch-cost">◆ ' +
            cost +
            "</span></button>";
        }
        content += "</div>";
      } else content += '<div class="tower-max-level">✦ 已完成最终进阶</div>';
      if (stats.damage > 0)
        content +=
          '<label class="priority-field"><span>瞄准优先级</span><select data-priority-for="' +
          esc(tower.id) +
          '" aria-label="防御塔瞄准优先级">' +
          PRIORITIES.map(
            ([id, name]) =>
              '<option value="' +
              id +
              '"' +
              ((tower.priority || "first") === id ? " selected" : "") +
              ">" +
              name +
              "</option>",
          ).join("") +
          "</select></label>";
      const refund = Math.floor((finite(tower.spent, data.cost) * 7) / 10);
      content +=
        '<button type="button" class="sell-button" data-action="sell" data-tower-id="' +
        esc(tower.id) +
        '" aria-label="出售' +
        esc(data.name) +
        "，返还" +
        refund +
        '糖果"><span>收起这座塔</span><span>返还 ◆ ' +
        refund +
        "</span></button>";
      panel.innerHTML = content;
    } else if (chosen && TOWERS[chosen]) {
      const data = TOWERS[chosen];
      panel.innerHTML =
        heading(TOWER_ICONS[chosen], data.name, "准备加入小小防线") +
        '<p class="detail-description">' +
        esc(data.description) +
        "</p>" +
        metricsHTML(
          stats.income
            ? [
                [stats.income, "每波产糖"],
                [round(stats.range), "光环范围"],
                [data.cost, "建造糖果"],
              ]
            : [
                [round(stats.damage), "唤醒力量"],
                [round(stats.range), "守护范围"],
                [data.cost, "建造糖果"],
              ],
        ) +
        '<p class="pad-empty-note">点一块空着的圆形塔位，把这位新伙伴安置在那里。</p>';
    } else
      panel.innerHTML =
        heading(
          "✿",
          "这里正等一位伙伴",
          "星光塔位 " + String(level.pads.indexOf(pad) + 1).padStart(2, "0"),
        ) +
        '<p class="pad-empty-note">从下方挑选一座防御塔，就能把这里变成温暖的小小防线。</p><div class="pad-empty-icon" aria-hidden="true">✧</div>';
  }
  function renderHint(state, view) {
    const pending = view.pendingAction;
    let message = "";
    if (pending?.type === "build" && TOWERS[pending.id]) {
      const tower = TOWERS[pending.id];
      message =
        state.candy < tower.cost
          ? "还差 " +
            Math.ceil(tower.cost - state.candy) +
            " 颗糖果，就能安置" +
            tower.name
          : "安置" + tower.name + " · 点选空塔位";
    } else if (pending?.type === "spell" && SPELLS[pending.id])
      message = SPELLS[pending.id].name + " · 点选想要照亮的地方";
    else if (pending?.type === "rally")
      message = "点一下地面，让守卫到这里集合";
    else if (view.selectedPadId && !selectedTower(state, view))
      message = "塔位已选好 · 从下方挑选一位伙伴";
    $("selection-hint").hidden = !message;
    if (message) text("selection-hint-text", message);
    text(
      "build-instruction",
      view.selectedPadId && !selectedTower(state, view)
        ? "塔位已选好，点塔即可建造"
        : "选塔，再点亮圆形塔位",
    );
  }
  function update(state, view = {}) {
    if (!state) return;
    if (view.records) records = normalizeRecords(view.records);
    const level = getLevel(state.levelId),
      endless = state.options?.mode === "endless",
      phase = state.phase,
      active = phase === "wave",
      terminal = ["won", "lost"].includes(phase),
      wave = num(state.wave),
      total = num(state.totalWaves),
      lives = num(state.lives),
      maxLives = Math.max(1, num(state.maxLives, 20));
    text("level-title", level.name);
    text("battle-mode", endless ? "无尽守护" : "故事冒险");
    text("lives-value", lives + " / " + maxLives);
    $("lives-value")
      .closest(".resource")
      .classList.toggle("low", lives / maxLives <= 0.3);
    text("candy-value", fmt(state.candy));
    text("mana-value", fmt(state.mana));
    text("wake-value", fmt(state.kills ?? state.stats?.kills));
    const displayed = Math.max(1, active || terminal ? wave : wave + 1);
    text(
      "wave-value",
      endless
        ? "第 " + displayed + " 波 · ∞"
        : "第 " +
            Math.min(total || Infinity, displayed) +
            " / " +
            total +
            " 波",
    );
    text(
      "wave-status",
      terminal
        ? phase === "won"
          ? "星灯已点亮"
          : "守护暂告一段落"
        : active
          ? "还有 " +
            num(state.waveRemaining, state.enemies?.length || 0) +
            " 位小团子"
          : state.autoWave
            ? Math.ceil(Math.max(0, finite(state.buildCountdown))) + " 秒后出发"
            : "准备建造",
    );
    $("game-hud").querySelector(".wave-bar").dataset.phase = phase;
    $("start-wave").disabled = active || terminal;
    text(
      "start-wave",
      terminal
        ? "守护已结束"
        : active
          ? "正在守护"
          : (state.autoWave ? "立即迎接" : "迎接第 " + (wave + 1) + " 波") +
            " ▶",
    );
    $("auto-wave").checked = !!state.autoWave;
    $("auto-wave").disabled = terminal;
    const speed = [1, 2, 3].includes(view.speed) ? view.speed : 1;
    text("speed-button", speed + "×");
    $("speed-button").setAttribute(
      "aria-label",
      "切换速度，当前 " + speed + " 倍",
    );
    const sound = view.sound !== false;
    text("sound-button", sound ? "♫" : "♪");
    $("sound-button").setAttribute(
      "aria-label",
      sound ? "关闭声音" : "开启声音",
    );
    $("sound-button").setAttribute("aria-pressed", String(!sound));
    text("pause-sound", sound ? "声音开启" : "声音关闭");
    const heroId = state.hero?.type || state.options?.hero || options.hero;
    text("hero-icon", HERO_ICONS[heroId] || "✦");
    text("hero-name", heroName(HEROES[heroId]));
    text(
      "hero-level",
      "Lv. " + Math.max(1, num(state.hero?.level, 1)) + " · 点地集结",
    );
    $("hero-button").setAttribute(
      "aria-pressed",
      String(view.pendingAction?.type === "rally"),
    );
    $("hero-button").disabled = terminal;
    for (const id of TOWER_ORDER) {
      const button = $("build-buttons").querySelector(
          '[data-build="' + id + '"]',
        ),
        poor = state.candy < TOWERS[id].cost;
      button.disabled = terminal;
      button.classList.toggle("is-poor", poor);
      button.setAttribute(
        "aria-pressed",
        String(
          view.pendingAction?.type === "build" && view.pendingAction.id === id,
        ),
      );
      button.setAttribute(
        "aria-label",
        TOWERS[id].name +
          "，" +
          TOWERS[id].cost +
          " 糖果" +
          (poor ? "，糖果不足" : ""),
      );
    }
    for (const id of SPELL_ORDER) {
      const button = $("spell-bar").querySelector('[data-spell="' + id + '"]'),
        spell = SPELLS[id],
        cooldown = Math.max(0, finite(state.spellCooldowns?.[id]));
      button.disabled = terminal || cooldown > 0.01 || state.mana < spell.cost;
      button.setAttribute(
        "aria-pressed",
        String(
          view.pendingAction?.type === "spell" && view.pendingAction.id === id,
        ),
      );
      const label =
          cooldown > 0.01
            ? Math.ceil(cooldown) + " 秒后就绪"
            : spell.cost + " 星能",
        cost = button.querySelector(".spell-cost");
      if (cost.textContent !== label) cost.textContent = label;
      const height =
        Math.round(Math.min(1, cooldown / Math.max(1, spell.cooldown)) * 100) +
        "%";
      if (button.style.getPropertyValue("--cooldown-height") !== height)
        button.style.setProperty("--cooldown-height", height);
      button.setAttribute(
        "aria-label",
        spell.name +
          "，" +
          label +
          (state.mana < spell.cost ? "，星能不足" : "") +
          "。" +
          spell.description,
      );
    }
    renderDetail(state, view);
    renderHint(state, view);
  }
  function toast(message, kind = "info") {
    if (!message || destroyed) return;
    const stack = $("toast-stack");
    while (stack.children.length >= 3) stack.firstElementChild.remove();
    const node = document.createElement("div");
    node.className = "toast";
    node.dataset.kind = ["error", "warning"].includes(kind)
      ? "error"
      : kind === "success"
        ? "success"
        : "info";
    node.textContent = String(message);
    stack.append(node);
    const timer = setTimeout(
      () => {
        timers.delete(timer);
        if (destroyed) return;
        node.classList.add("leaving");
        const remove = setTimeout(() => {
          timers.delete(remove);
          node.remove();
        }, 220);
        timers.add(remove);
      },
      kind === "error" || kind === "warning" ? 3700 : 2900,
    );
    timers.add(timer);
  }
  function handleAction(button) {
    const action = button.dataset.action;
    if (action === "help") {
      openHelp(button);
      return;
    }
    if (action === "closeHelp") {
      closeHelp();
      return;
    }
    if (action === "storyNext") {
      if (storyPage < storyLines.length - 1) {
        storyPage++;
        renderStory();
      } else emit({ type: "storyContinue" });
      return;
    }
    if (action === "upgrade") {
      const payload = { type: "upgrade", towerId: button.dataset.towerId };
      if (button.dataset.branch) payload.branch = button.dataset.branch;
      emit(payload);
      return;
    }
    if (action === "sell") {
      emit({ type: "sell", towerId: button.dataset.towerId });
      return;
    }
    if (action === "rotate" || action === "zoom") {
      emit({ type: action, delta: finite(button.dataset.delta) });
      return;
    }
    if (
      [
        "storyContinue",
        "menu",
        "retry",
        "nextLevel",
        "pause",
        "resume",
        "sound",
        "speed",
        "selectHero",
        "cancelSelection",
        "startWave",
      ].includes(action)
    )
      emit({ type: action });
  }
  listen(root, "click", (event) => {
    const button =
      event.target instanceof Element ? event.target.closest("button") : null;
    if (!button || button.disabled || button.closest("[inert]")) return;
    if (button.id === "start-game") {
      sanitize();
      emit({ type: "start", options: getOptions() });
      return;
    }
    if (button.dataset.mode) {
      sanitize({ mode: button.dataset.mode });
      preview();
      return;
    }
    if (button.dataset.level) {
      const level = getLevel(button.dataset.level);
      if (unlocked(level)) {
        options.levelId = level.id;
        preview();
      }
      return;
    }
    if (button.dataset.hero) {
      sanitize({ hero: button.dataset.hero });
      preview();
      return;
    }
    if (button.dataset.build) {
      emit({ type: "selectBuild", towerType: button.dataset.build });
      return;
    }
    if (button.dataset.spell) {
      emit({ type: "selectSpell", spell: button.dataset.spell });
      return;
    }
    if (button.dataset.action) handleAction(button);
  });
  listen(root, "change", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.id === "difficulty") {
      sanitize({ difficulty: target.value });
      preview();
    } else if (target.id === "auto-wave")
      emit({ type: "autoWave", enabled: target.checked });
    else if (target.matches("[data-priority-for]"))
      emit({
        type: "priority",
        towerId: target.dataset.priorityFor,
        priority: target.value,
      });
  });
  listen(
    document,
    "keydown",
    (event) => {
      if (helpOpen && event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeHelp();
        return;
      }
      const modal = helpOpen
        ? $("help-overlay")
        : screen === "story"
          ? $("story-overlay")
          : screen === "paused"
            ? $("pause-overlay")
            : screen === "result"
              ? $("result-overlay")
              : null;
      if (!modal) return;
      if (helpOpen) event.stopImmediatePropagation();
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        modal.querySelectorAll(
          'button:not(:disabled),a[href],select:not(:disabled),input:not(:disabled),[tabindex="0"]',
        ),
      ).filter(
        (element) =>
          !element.closest("[hidden]") && element.getClientRects().length,
      );
      if (!focusable.length) return;
      const first = focusable[0],
        last = focusable.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !modal.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !modal.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    },
    true,
  );
  html(
    "difficulty",
    Object.entries(DIFFICULTIES)
      .map(
        ([id, d]) =>
          '<option value="' + esc(id) + '">' + esc(d.name || id) + "</option>",
      )
      .join(""),
  );
  html(
    "build-buttons",
    TOWER_ORDER.map(
      (id, index) =>
        '<button type="button" class="build-button" data-build="' +
        id +
        '" aria-pressed="false" title="' +
        esc(TOWERS[id].description) +
        '"><span class="build-key" aria-hidden="true">' +
        (index + 1) +
        '</span><span class="build-icon" aria-hidden="true">' +
        TOWER_ICONS[id] +
        '</span><span class="build-name">' +
        esc(TOWERS[id].name) +
        '</span><span class="build-cost">◆ ' +
        TOWERS[id].cost +
        "</span></button>",
    ).join(""),
  );
  html(
    "spell-bar",
    SPELL_ORDER.map(
      (id) =>
        '<button type="button" class="spell-button" data-spell="' +
        id +
        '" aria-pressed="false" title="' +
        esc(SPELLS[id].description) +
        '"><span class="spell-key" aria-hidden="true">' +
        SPELL_KEYS[id] +
        '</span><span class="spell-icon" aria-hidden="true">' +
        SPELL_ICONS[id] +
        '</span><span class="spell-name">' +
        esc(SPELLS[id].name) +
        '</span><span class="spell-cost">' +
        SPELLS[id].cost +
        " 星能</span></button>",
    ).join(""),
  );
  showMenu(records, options);
  return {
    getOptions,
    showMenu,
    setScreen,
    showStory,
    showResult,
    update,
    toast,
    destroy() {
      destroyed = true;
      listeners.forEach((remove) => remove());
      timers.forEach(clearTimeout);
      timers.clear();
      $("toast-stack").replaceChildren();
    },
  };
}
