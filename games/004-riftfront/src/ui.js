import "./styles.css";
import { WEAPONS, WEAPON_ORDER, CLASSES, MODES, MAPS } from "./data.js";

const $ = (id) => document.getElementById(id);
const safe = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const clock = (seconds) => {
  if (!Number.isFinite(seconds)) return "∞";
  const whole = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(whole / 60)).padStart(2, "0")}:${String(whole % 60).padStart(2, "0")}`;
};
const pct = (value, maximum) =>
  `${clamp((value || 0) / (maximum || 1), 0, 1) * 100}%`;
const stat = (entity, name) => entity?.stats?.[name] || 0;
const weaponShort = {
  rifle: "步枪",
  smg: "冲锋",
  shotgun: "霰弹",
  sniper: "狙击",
  pistol: "手枪",
};
const weaponCodes = {
  rifle: "AR / ASSAULT",
  smg: "SMG / COMPACT",
  shotgun: "SG / BREACH",
  sniper: "SR / PRECISION",
  pistol: "HG / SIDEARM",
};

export function createUI(callbacks = {}) {
  let mode = "loading";
  let latestState = null;
  let latestRecord = {};
  let scoreboardVisible = false;
  let feedSignature = "";
  let radarFrame = -Infinity;
  let scoreboardFrame = -Infinity;
  let hitTimer;
  let damageTimer;
  let previousFocus = null;
  let activeModal = null;
  const minimap = $("minimap");
  const radar = minimap.getContext("2d");
  const refs = {};
  const el = (id) => refs[id] || (refs[id] = $(id));
  const setText = (id, value) => {
    const target = el(id);
    const text = String(value);
    if (target && target.textContent !== text) target.textContent = text;
  };
  const show = (id, visible) => {
    el(id).hidden = !visible;
  };
  const emit = (key, ...args) => callbacks[key]?.(...args);

  $("weapon-bar").innerHTML = WEAPON_ORDER.map(
    (id, index) =>
      `<button type="button" class="weapon-slot" data-action="switchWeapon" data-weapon="${id}" aria-label="切换${safe(WEAPONS[id].name)}"><span>${index + 1}</span>${weaponShort[id]}</button>`,
  ).join("");
  $("objectives").innerHTML = ["A", "B", "C"]
    .map(
      (id) =>
        `<div class="objective" data-objective="${id}"><strong>${id}</strong><small>中立</small><i></i></div>`,
    )
    .join("");

  $("match-options").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    emit("onStart", {
      mode: form.get("mode"),
      map: form.get("map"),
      class: form.get("class"),
      difficulty: form.get("difficulty"),
      sensitivity: Number(form.get("sensitivity")),
    });
  });
  $("sensitivity").addEventListener("input", (event) => {
    $("sensitivity-value").value = `${Number(event.target.value).toFixed(1)}×`;
  });
  document.querySelectorAll('input[name="map"]').forEach((input) =>
    input.addEventListener("change", () => {
      if (input.checked)
        setText(
          "menu-map-label",
          input.value === "harbor" ? "HARBOR 07" : "OUTPOST 12",
        );
    }),
  );
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    const action = button.dataset.action;
    const input = button.dataset.input;
    if (input) emit("onInput", input);
    if (!action) return;
    const actions = {
      pause: "onPause",
      resume: "onResume",
      restart: "onRestart",
      menu: "onMenu",
      sound: "onSound",
    };
    if (actions[action]) emit(actions[action]);
    else if (action === "switchWeapon")
      emit("onAction", action, { id: button.dataset.weapon });
    else if (action === "upgrade")
      emit("onAction", action, { id: button.dataset.upgrade });
    else if (action === "endTraining") emit("onAction", action);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !activeModal || activeModal.hidden) return;
    const elements = [
      ...activeModal.querySelectorAll("button,a[href],input"),
    ].filter((node) => !node.disabled && node.getClientRects().length);
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (
      event.shiftKey &&
      (document.activeElement === first ||
        !activeModal.contains(document.activeElement))
    ) {
      event.preventDefault();
      first === last ? first.focus() : last.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last ||
        !activeModal.contains(document.activeElement))
    ) {
      event.preventDefault();
      first.focus();
    }
  });

  function setMode(nextMode, data) {
    if (data?.player) latestState = data;
    else if (data?.state?.player) latestState = data.state;
    const wasModal = Boolean(activeModal);
    mode = nextMode;
    document.body.dataset.uiMode = nextMode;
    const modalIds = {
      paused: "pause-overlay",
      intermission: "upgrade-overlay",
      finished: "result-overlay",
      error: "error-overlay",
    };
    [
      "pause-overlay",
      "upgrade-overlay",
      "result-overlay",
      "error-overlay",
    ].forEach((id) => show(id, modalIds[nextMode] === id));
    activeModal = modalIds[nextMode] ? $(modalIds[nextMode]) : null;
    setScoreboard(false);
    if (nextMode === "finished" && latestState)
      renderResult(latestState, latestRecord);
    if (nextMode === "intermission" && latestState)
      setText(
        "upgrade-wave",
        `第 ${latestState.wave} 波已清除 · 选择一项强化并继续`,
      );
    if (activeModal && !wasModal) previousFocus = document.activeElement;
    if (activeModal)
      requestAnimationFrame(() =>
        activeModal
          ?.querySelector("button,a[href]")
          ?.focus({ preventScroll: true }),
      );
    else if (wasModal && nextMode === "menu")
      previousFocus?.focus?.({ preventScroll: true });
    if (nextMode === "menu") {
      $("toast-stack").replaceChildren();
      $("hit-marker").classList.remove("active");
      $("damage-direction").classList.remove("active");
      $("damage-vignette").style.opacity = "0";
    }
  }

  function drawRadar(state) {
    if (!radar) return;
    const map = MAPS[state.options.map];
    const size = minimap.width;
    const inset = 10;
    const spanX = map.bounds.halfX * 2;
    const spanZ = map.bounds.halfZ * 2;
    const scale = (size - 2 * inset) / Math.max(spanX, spanZ);
    const tx = (x) => size / 2 + x * scale;
    const tz = (z) => size / 2 + z * scale;
    radar.clearRect(0, 0, size, size);
    radar.fillStyle = "#142b31";
    radar.fillRect(0, 0, size, size);
    radar.lineWidth = 1;
    radar.strokeStyle = "#9ccec110";
    for (let line = 0; line < size; line += 26) {
      radar.beginPath();
      radar.moveTo(line, 0);
      radar.lineTo(line, size);
      radar.stroke();
      radar.beginPath();
      radar.moveTo(0, line);
      radar.lineTo(size, line);
      radar.stroke();
    }
    radar.strokeStyle = "#aecdc640";
    radar.strokeRect(
      tx(-map.bounds.halfX),
      tz(-map.bounds.halfZ),
      spanX * scale,
      spanZ * scale,
    );
    for (const obstacle of state.obstacles || map.obstacles) {
      if (obstacle.destroyed) continue;
      radar.fillStyle =
        obstacle.type === "platform"
          ? "#77928c45"
          : obstacle.hp > 0
            ? "#b8ac7977"
            : "#8ca9a477";
      radar.fillRect(
        tx(obstacle.x - obstacle.w / 2),
        tz(obstacle.z - obstacle.d / 2),
        Math.max(2, obstacle.w * scale),
        Math.max(2, obstacle.d * scale),
      );
    }
    for (const ramp of map.ramps || []) {
      radar.fillStyle = "#9bad7455";
      radar.fillRect(
        tx(ramp.x - ramp.w / 2),
        tz(ramp.z - ramp.d / 2),
        ramp.w * scale,
        ramp.d * scale,
      );
    }
    if (state.options.mode === "control")
      for (const objective of state.objectives || []) {
        radar.fillStyle =
          objective.owner === 0
            ? "#a8f0d7"
            : objective.owner === 1
              ? "#ff795f"
              : "#d5d6b0";
        radar.globalAlpha = 0.18;
        radar.beginPath();
        radar.arc(
          tx(objective.x),
          tz(objective.z),
          objective.radius * scale,
          0,
          Math.PI * 2,
        );
        radar.fill();
        radar.globalAlpha = 1;
        radar.font = "bold 12px Arial";
        radar.textAlign = "center";
        radar.textBaseline = "middle";
        radar.fillText(objective.id, tx(objective.x), tz(objective.z));
      }
    for (const bot of state.bots || []) {
      if (!bot.alive || (bot.team !== 0 && !(state.player.radarTimer > 0)))
        continue;
      radar.fillStyle = bot.team === 0 ? "#87d2de" : "#ff795f";
      radar.beginPath();
      radar.arc(
        tx(bot.x),
        tz(bot.z),
        bot.team === 0 ? 3.6 : 4.2,
        0,
        Math.PI * 2,
      );
      radar.fill();
    }
    const player = state.player;
    radar.save();
    radar.translate(tx(player.x), tz(player.z));
    radar.rotate(Math.PI - player.yaw);
    radar.fillStyle = player.alive ? "#e7ffed" : "#ff795f";
    radar.strokeStyle = "#102e29";
    radar.lineWidth = 2;
    radar.beginPath();
    radar.moveTo(0, -8);
    radar.lineTo(5, 6);
    radar.lineTo(0, 3);
    radar.lineTo(-5, 6);
    radar.closePath();
    radar.fill();
    radar.stroke();
    radar.restore();
    setText(
      "radar-status",
      player.radarTimer > 0
        ? `侦察 ${Math.ceil(player.radarTimer)}s`
        : "战术地图",
    );
    const headings = ["S", "SE", "E", "NE", "N", "NW", "W", "SW"];
    const direction = ((Math.round(player.yaw / (Math.PI / 4)) % 8) + 8) % 8;
    setText("radar-heading", headings[direction]);
  }

  function renderScoreboard(state) {
    const actors = [state.player, ...(state.bots || [])]
      .slice()
      .sort((a, b) => a.team - b.team || stat(b, "kills") - stat(a, "kills"));
    $("scoreboard-body").innerHTML = actors
      .map(
        (actor) =>
          `<tr class="${actor.team === 0 ? "ally" : "enemy"}${actor.id === "player" ? " you" : ""}"><td>${safe(actor.id === "player" ? "你" : actor.name)}${actor.id === "player" ? "<span>YOU</span>" : "<small> · AI</small>"}</td><td>${stat(actor, "kills")}</td><td>${stat(actor, "deaths")}</td><td>${stat(actor, "assists")}</td><td>${stat(actor, "captures")}</td></tr>`,
      )
      .join("");
  }

  function renderResult(state, record) {
    const training = state.options.mode === "training";
    const won = state.winner === 0;
    const draw = state.winner === null || state.winner === -1;
    setText(
      "result-eyebrow",
      training
        ? "RANGE SESSION COMPLETE"
        : won
          ? "MISSION ACCOMPLISHED"
          : draw
            ? "OPERATION COMPLETE"
            : "REGROUP & REDEPLOY",
    );
    setText(
      "result-title",
      training ? "训练结束" : won ? "行动胜利" : draw ? "势均力敌" : "再战前线",
    );
    $("result-title").style.color =
      won || training ? "var(--teal)" : "var(--paper)";
    setText(
      "result-reason",
      state.reason ||
        (training
          ? "熟悉枪械，下一场更从容。"
          : won
            ? "配合、判断与精准，共同决定胜局。"
            : "调整路线与装备，下一次重新突破。"),
    );
    setText("result-ally", state.score?.[0] ?? stat(state.player, "kills"));
    setText("result-enemy", state.score?.[1] ?? stat(state.player, "deaths"));
    const player = state.player;
    const shots = stat(player, "shots");
    const accuracy = shots
      ? Math.min(100, Math.round((stat(player, "hits") / shots) * 100))
      : 0;
    const results = [
      [stat(player, "kills"), "击败"],
      [stat(player, "deaths"), "倒下"],
      [`${accuracy}%`, "命中率"],
      [stat(player, "headshots"), "爆头"],
      [stat(player, "captures"), "据点占领"],
      [clock(state.elapsed), "战斗时长"],
    ];
    $("result-stats").innerHTML = results
      .map(
        ([value, label]) =>
          `<div class="result-stat"><strong>${safe(value)}</strong><span>${label}</span></div>`,
      )
      .join("");
    const matches = record.matches ?? record.played ?? 0;
    const wins = record.wins || 0;
    setText(
      "result-record",
      training
        ? "训练数据仅供参考，不计入对战胜场。"
        : `本地战绩 / ${matches} 场对战 · ${wins} 场胜利`,
    );
  }

  function update(state, record = latestRecord) {
    if (!state?.player) return;
    latestState = state;
    latestRecord = record || {};
    const player = state.player;
    const weapon = WEAPONS[player.weapon] || WEAPONS.rifle;
    const ammo = player.ammo?.[player.weapon] || { mag: 0, reserve: 0 };
    const map = MAPS[state.options.map];
    const matches = latestRecord.matches ?? latestRecord.played ?? 0;
    setText(
      "menu-record",
      matches
        ? `本地记录 / ${matches} 场对战 · ${latestRecord.wins || 0} 场胜利`
        : "本地记录 / 尚未完成对局",
    );
    setText("hud-map", map.name);
    setText("hud-mode", `${MODES[state.options.mode].name} · AI 对战`);
    setText(
      "ally-score",
      String(Math.floor(state.score?.[0] || 0)).padStart(2, "0"),
    );
    setText(
      "enemy-score",
      String(Math.floor(state.score?.[1] || 0)).padStart(2, "0"),
    );
    setText(
      "match-clock",
      state.options.mode === "training"
        ? clock(state.elapsed)
        : state.options.mode === "survival"
          ? clock(state.elapsed)
          : clock(state.remaining),
    );
    setText(
      "match-target",
      state.options.mode === "survival"
        ? "生存行动"
        : state.options.mode === "training"
          ? "自由训练"
          : `目标 ${MODES[state.options.mode].target}`,
    );
    setText("player-class", CLASSES[state.options.class]?.name || "突击手");
    setText("health-value", Math.ceil(Math.max(0, player.health)));
    setText("armor-value", Math.ceil(Math.max(0, player.armor)));
    el("health-fill").style.width = pct(player.health, player.maxHealth);
    el("health-fill").style.background =
      player.health / player.maxHealth < 0.3 ? "var(--coral)" : "var(--teal)";
    el("armor-fill").style.width = pct(player.armor, player.maxArmor);
    el("stamina-fill").style.width = pct(player.stamina, player.maxStamina);
    setText("streak-count", player.streak >= 2 ? `${player.streak} 连击` : "");
    setText("weapon-name", weapon.name);
    setText("weapon-type", weaponCodes[player.weapon]);
    setText("ammo-mag", ammo.mag);
    setText("ammo-reserve", ammo.reserve);
    setText("grenade-count", `◈ ${player.grenades}`);
    setText(
      "reload-label",
      player.reloadTimer > 0
        ? "装填中"
        : ammo.mag === 0
          ? "R 立即装填"
          : "R 装填",
    );
    document
      .querySelector(".ammo-panel")
      .classList.toggle(
        "low-ammo",
        ammo.mag <= Math.ceil(weapon.magSize * 0.2),
      );
    document.querySelectorAll(".weapon-slot").forEach((button) => {
      const active = button.dataset.weapon === player.weapon;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const crosshair = el("crosshair");
    crosshair.classList.toggle("aiming", Boolean(player.aiming));
    crosshair.style.setProperty(
      "--gap",
      `${(player.aiming ? 3 : 7) + Math.min(18, (player.recoil || 0) * 15) + (player.sprinting ? 6 : 0)}px`,
    );
    crosshair.hidden =
      !player.alive ||
      (player.aiming && player.weapon === "sniper") ||
      state.phase === "countdown";
    el("scope-overlay").classList.toggle(
      "active",
      player.alive && player.aiming && player.weapon === "sniper",
    );
    document
      .querySelector(".touch-aim")
      .setAttribute("aria-pressed", String(Boolean(player.aiming)));
    document
      .querySelector('[data-control="crouch"]')
      .classList.toggle("active", Boolean(player.crouching));
    document
      .querySelector('[data-control="sprint"]')
      .classList.toggle("active", Boolean(player.sprinting));
    show("reload-notice", player.reloadTimer > 0 && player.alive);
    el("reload-notice").style.setProperty(
      "--reload",
      pct(player.reloadDuration - player.reloadTimer, player.reloadDuration),
    );
    const countdown = state.phase === "countdown";
    const respawning = !player.alive && state.phase !== "finished";
    show("center-notice", countdown || respawning);
    el("center-notice").classList.toggle("respawning", respawning);
    if (countdown) {
      setText("notice-label", "准备部署");
      setText("notice-value", Math.max(1, Math.ceil(state.countdown || 0)));
      setText(
        "notice-detail",
        state.options.mode === "training"
          ? "目标不会还击，尽情练习你的枪法"
          : state.options.mode === "control"
            ? "占领 A / B / C，持续为队伍得分"
            : state.options.mode === "survival"
              ? "抵御五波攻势，留意剩余生命"
              : "与 AI 队友配合，率先取得 25 次击败",
      );
    } else if (respawning) {
      setText("notice-label", "正在重新部署");
      setText(
        "notice-value",
        `${Math.max(1, Math.ceil(player.respawnTimer || 0))} 秒`,
      );
      setText("notice-detail", "寻找新路线，重新加入战斗");
    }
    show("objectives", state.options.mode === "control");
    for (const objective of state.objectives || []) {
      const node = document.querySelector(`[data-objective="${objective.id}"]`);
      if (!node) continue;
      node.className = `objective${objective.owner === 0 ? " ally" : objective.owner === 1 ? " enemy" : ""}${objective.contested ? " contested" : ""}`;
      node.style.setProperty(
        "--progress",
        `${clamp(objective.progress || 0, 0, 1) * 100}%`,
      );
      node.querySelector("small").textContent = objective.contested
        ? "争夺"
        : objective.owner === 0
          ? "我方"
          : objective.owner === 1
            ? "敌方"
            : "中立";
    }
    show("survival-status", state.options.mode === "survival");
    setText(
      "wave-label",
      `WAVE ${String(state.wave || 1).padStart(2, "0")} / ${String(state.maxWaves || 5).padStart(2, "0")}`,
    );
    setText("lives-label", `生命 ${Math.max(0, state.lives || 0)}`);
    document
      .querySelectorAll('[data-action="endTraining"]')
      .forEach((button) => {
        button.hidden = state.options.mode !== "training";
      });
    const feed = (state.killFeed || [])
      .filter(
        (entry) =>
          !Number.isFinite(entry.time) || state.elapsed - entry.time < 7,
      )
      .slice(0, 4);
    const signature = feed
      .map((entry) => `${entry.id}:${entry.killer}:${entry.victim}`)
      .join("|");
    if (signature !== feedSignature) {
      feedSignature = signature;
      const names = new Map([
        [player.id, "你"],
        ...(state.bots || []).map((bot) => [bot.id, bot.name]),
      ]);
      el("kill-feed").innerHTML = feed
        .map(
          (entry) =>
            `<div class="kill-entry"><span class="${entry.killerTeam === 0 ? "ally" : "enemy"}">${safe(names.get(entry.killer) || entry.killer)}</span><span class="feed-weapon">${safe(weaponShort[entry.weapon] || (entry.weapon === "grenade" ? "手雷" : entry.weapon === "melee" ? "近战" : entry.weapon))}</span>${entry.headshot ? '<span class="feed-head">⌖</span>' : ""}<span class="${entry.killerTeam === 0 ? "enemy" : "ally"}">${safe(names.get(entry.victim) || entry.victim)}</span></div>`,
        )
        .join("");
    }
    const now = performance.now();
    if (now - radarFrame > 100) {
      drawRadar(state);
      radarFrame = now;
    }
    if (scoreboardVisible && now - scoreboardFrame > 300) {
      renderScoreboard(state);
      scoreboardFrame = now;
    }
    if (mode === "finished") renderResult(state, latestRecord);
  }

  function setSound(enabled) {
    document.querySelectorAll('[data-action="sound"]').forEach((button) => {
      button.textContent = `声音：${enabled ? "开" : "关"}`;
      button.setAttribute("aria-pressed", String(enabled));
    });
  }

  function toast(message, tone = "info") {
    if (!message) return;
    const node = document.createElement("div");
    node.className = `toast ${tone}`;
    node.textContent = message;
    const stack = $("toast-stack");
    stack.append(node);
    while (stack.children.length > 3) stack.firstElementChild.remove();
    setTimeout(() => node.remove(), 3400);
  }

  function hitMarker(headshot = false, killed = false) {
    const marker = $("hit-marker");
    clearTimeout(hitTimer);
    marker.className = `hit-marker active${headshot ? " headshot" : ""}${killed ? " killed" : ""}`;
    hitTimer = setTimeout(
      () => marker.classList.remove("active"),
      killed ? 340 : 190,
    );
  }

  function damageIndicator(angle = 0, amount = 10) {
    clearTimeout(damageTimer);
    const direction = $("damage-direction");
    direction.style.transform = `rotate(${angle}rad)`;
    direction.classList.add("active");
    $("damage-vignette").style.opacity = String(
      clamp(0.2 + amount / 100, 0.2, 0.85),
    );
    damageTimer = setTimeout(() => {
      direction.classList.remove("active");
      $("damage-vignette").style.opacity = "0";
    }, 650);
  }

  function setScoreboard(visible) {
    scoreboardVisible = Boolean(visible) && mode === "playing";
    show("scoreboard-overlay", scoreboardVisible);
    if (scoreboardVisible && latestState) renderScoreboard(latestState);
    document
      .querySelectorAll('[data-input="scoreboard"]')
      .forEach((button) =>
        button.setAttribute("aria-pressed", String(scoreboardVisible)),
      );
  }

  function showError(message) {
    setText("error-message", message);
    setMode("error");
  }

  return {
    setMode,
    update,
    toast,
    setSound,
    hitMarker,
    damageIndicator,
    setScoreboard,
    showError,
  };
}
