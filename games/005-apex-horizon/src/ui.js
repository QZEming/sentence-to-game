import "./styles.css";
import { CARS, COLORS, MODES, TRACKS, DIFFICULTIES, WEATHERS } from "./data.js";
import { createTrack } from "./track.js";

const $ = (id) => document.getElementById(id);
const escapeHTML = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const clamp = (number, minimum, maximum) =>
  Math.max(minimum, Math.min(maximum, number));
const time = (seconds) => {
  if (!(seconds >= 0) || !Number.isFinite(seconds)) return "—";
  const milliseconds = Math.floor(seconds * 1000);
  return `${String(Math.floor(milliseconds / 60000)).padStart(2, "0")}:${String(Math.floor(milliseconds / 1000) % 60).padStart(2, "0")}.${String(milliseconds % 1000).padStart(3, "0")}`;
};
const number = (value) => Math.round(value || 0).toLocaleString("zh-CN");
const hexColor = (hex) =>
  typeof hex === "number" ? `#${hex.toString(16).padStart(6, "0")}` : hex;
const modeIcons = { race: "↗", time: "◷", drift: "〰", championship: "♜" };
const trackCodes = {
  coast: "01 / COAST",
  alpine: "02 / ALPINE",
  city: "03 / CITY",
};
const carCodes = { comet: "GT / 01", vector: "RS / 02", tempest: "R / 03" };

export function createUI(callbacks = {}) {
  let mode = "loading";
  let latestState = null;
  let latestRecord = {};
  let modal = null;
  let previousFocus = null;
  let radarTrack = null;
  let radarGeometry = null;
  let resultSignature = "";
  let previousCountdown = null;
  let goUntil = 0;
  const refs = {};
  const el = (id) => refs[id] || (refs[id] = $(id));
  const emit = (name, ...args) => callbacks[name]?.(...args);
  const setText = (id, value) => {
    const node = el(id);
    const text = String(value);
    if (node && node.textContent !== text) node.textContent = text;
  };
  const show = (id, visible) => {
    const node = el(id);
    if (node) node.hidden = !visible;
  };
  const touchDevice =
    matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
  document.body.classList.toggle("has-touch", touchDevice);
  const form = $("race-options");
  const minimap = $("minimap");
  const mapContext = minimap.getContext("2d");

  $("mode-options").innerHTML = Object.entries(MODES)
    .map(
      ([id, item], index) =>
        `<label class="choice mode-choice"><input type="radio" name="mode" value="${escapeHTML(id)}" ${index === 0 ? "checked" : ""}/><span><b>${modeIcons[id] || "↗"}</b><strong>${escapeHTML(item.name)}</strong></span></label>`,
    )
    .join("");
  $("track-options").innerHTML = Object.entries(TRACKS)
    .map(
      ([id, item], index) =>
        `<label class="choice track-choice track-${escapeHTML(id)}"><input type="radio" name="track" value="${escapeHTML(id)}" ${index === 0 ? "checked" : ""}/><span><svg class="track-outline" viewBox="0 0 100 60" aria-hidden="true"><path d="${trackPath(id)}"/></svg><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(trackCodes[id] || id.toUpperCase())}</small></span></label>`,
    )
    .join("");
  $("car-options").innerHTML = Object.entries(CARS)
    .map(
      ([id, item], index) =>
        `<label class="choice car-choice"><input type="radio" name="car" value="${escapeHTML(id)}" ${index === 0 ? "checked" : ""}/><span><small>${carCodes[id] || "GT"}</small><strong>${escapeHTML(item.name)}</strong><em>${escapeHTML(item.subtitle || "")}</em></span></label>`,
    )
    .join("");
  $("color-options").innerHTML = COLORS.map(
    (item, index) =>
      `<label class="paint-choice" style="--paint:${hexColor(item.hex)}" title="${escapeHTML(item.name)}"><input type="radio" name="color" value="${escapeHTML(item.id)}" ${index === 0 ? "checked" : ""}/><span aria-hidden="true"></span><span class="sr-only">${escapeHTML(item.name)}</span></label>`,
  ).join("");
  $("difficulty").innerHTML = Object.entries(DIFFICULTIES)
    .map(
      ([id, item]) =>
        `<option value="${escapeHTML(id)}" ${id === "normal" ? "selected" : ""}>${escapeHTML(item.name)}</option>`,
    )
    .join("");
  $("weather").innerHTML = Object.entries(WEATHERS)
    .map(
      ([id, item]) =>
        `<option value="${escapeHTML(id)}">${escapeHTML(item.name)}</option>`,
    )
    .join("");
  $("auto-throttle").checked = touchDevice;

  function getOptions() {
    const fields = new FormData(form);
    return {
      mode: fields.get("mode"),
      track:
        fields.get("mode") === "championship"
          ? "coast"
          : fields.get("track") || "coast",
      car: fields.get("car"),
      color: fields.get("color"),
      difficulty: $("difficulty").value,
      weather: fields.get("weather"),
      autoThrottle: fields.has("autoThrottle"),
    };
  }
  function updateOptions(preview = true) {
    const options = getOptions();
    const championship = options.mode === "championship";
    const car = CARS[options.car];
    const track = TRACKS[options.track];
    form.querySelectorAll('input[name="track"]').forEach((input) => {
      input.disabled = championship;
    });
    $("track-options").classList.toggle("is-locked", championship);
    if (championship)
      form.querySelector('input[name="track"][value="coast"]').checked = true;
    $("difficulty").disabled =
      options.mode === "time" || options.mode === "drift";
    setText("mode-description", MODES[options.mode]?.description || "");
    setText(
      "track-description",
      championship
        ? "三站巡回：海岸 → 雪山 → 都市，累计积分争夺总冠军。"
        : track.description || track.subtitle || "",
    );
    setText("preview-track-code", trackCodes[options.track]);
    setText("preview-track-name", track.name);
    setText("preview-track-subtitle", track.subtitle || "");
    setText("preview-car-name", car.name);
    setText(
      "paint-name",
      COLORS.find((color) => color.id === options.color)?.name || "车身配色",
    );
    $("car-speed").style.width = `${clamp(car.topSpeed / 85, 0, 1) * 100}%`;
    $("car-accel").style.width = `${clamp(car.acceleration / 23, 0, 1) * 100}%`;
    $("car-handling").style.width =
      `${clamp(car.handling / 1.35, 0, 1) * 100}%`;
    $("start-race").querySelector("span").innerHTML =
      `${options.mode === "championship" ? "开启三站巡回" : "驶向地平线"} <small>START YOUR ENGINE</small>`;
    if (preview) emit("onPreview", getOptions());
  }
  form.addEventListener("change", () => updateOptions());
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    emit("onStart", getOptions());
  });
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button || button.disabled) return;
    const action = button.dataset.action;
    if (action === "reload") {
      location.reload();
      return;
    }
    const actions = {
      pause: "onPause",
      resume: "onResume",
      restart: "onRestart",
      menu: "onMenu",
      sound: "onSound",
      camera: "onCamera",
      reset: "onReset",
      nextRound: "onNextRound",
    };
    if (actions[action]) emit(actions[action]);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !modal || modal.hidden) return;
    const nodes = [
      ...modal.querySelectorAll("button,a[href],summary,input,select"),
    ].filter((node) => !node.disabled && node.getClientRects().length);
    const first = nodes[0];
    const last = nodes.at(-1);
    if (!first) return;
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
  });

  function trackPath(id) {
    const track = createTrack(id);
    const samples = track.samples;
    const xs = samples.map((p) => p.x);
    const zs = samples.map((p) => p.z);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    const scale = Math.min(
      80 / Math.max(1, maxX - minX),
      44 / Math.max(1, maxZ - minZ),
    );
    const cx = (minX + maxX) / 2;
    const cz = (minZ + maxZ) / 2;
    return (
      samples
        .filter((_, index) => index % 6 === 0)
        .map(
          (point, index) =>
            `${index ? "L" : "M"}${(50 + (point.x - cx) * scale).toFixed(1)},${(30 + (point.z - cz) * scale).toFixed(1)}`,
        )
        .join(" ") + " Z"
    );
  }

  function setMode(next, data) {
    if (data?.player) latestState = data;
    else if (data?.state?.player) latestState = data.state;
    const wasModal = modal;
    mode = next;
    document.body.dataset.uiMode = next;
    show("loading-screen", next === "loading");
    show("menu-screen", next === "menu");
    show("game-hud", ["playing", "paused"].includes(next));
    show("pause-overlay", next === "paused");
    show("result-overlay", next === "finished");
    show("error-overlay", next === "error");
    $("game-hud").inert = next !== "playing";
    const modalId = {
      paused: "pause-overlay",
      finished: "result-overlay",
      error: "error-overlay",
    }[next];
    modal = modalId ? $(modalId) : null;
    if (modal && !wasModal) previousFocus = document.activeElement;
    if (modal)
      requestAnimationFrame(() =>
        modal
          ?.querySelector("button:not([hidden]),a[href]")
          ?.focus({ preventScroll: true }),
      );
    else if (wasModal && next === "menu")
      previousFocus?.focus?.({ preventScroll: true });
    if (next === "finished" && latestState) renderResult(latestState);
    if (next === "menu") {
      $("toast-stack").replaceChildren();
      previousCountdown = null;
      goUntil = 0;
    }
  }

  function drawMap(state) {
    if (!mapContext) return;
    const trackId = state.trackId || state.options.track;
    if (trackId !== radarTrack) {
      radarTrack = trackId;
      const track = createTrack(trackId);
      const xs = track.samples.map((p) => p.x);
      const zs = track.samples.map((p) => p.z);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minZ = Math.min(...zs);
      const maxZ = Math.max(...zs);
      const scale = Math.min(
        (minimap.width - 28) / Math.max(1, maxX - minX),
        (minimap.height - 24) / Math.max(1, maxZ - minZ),
      );
      radarGeometry = {
        samples: track.samples.filter((_, i) => i % 3 === 0),
        cx: (minX + maxX) / 2,
        cz: (minZ + maxZ) / 2,
        scale,
      };
      setText("minimap-title", `${trackId.toUpperCase()} CIRCUIT`);
      setText("track-distance", `${(track.length / 1000).toFixed(2)} KM / LAP`);
    }
    const ctx = mapContext;
    const geo = radarGeometry;
    const x = (world) => minimap.width / 2 + (world - geo.cx) * geo.scale;
    const z = (world) => minimap.height / 2 + (world - geo.cz) * geo.scale;
    ctx.clearRect(0, 0, minimap.width, minimap.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#c9ddd64d";
    ctx.lineWidth = 6;
    ctx.beginPath();
    geo.samples.forEach((p, i) =>
      i ? ctx.lineTo(x(p.x), z(p.z)) : ctx.moveTo(x(p.x), z(p.z)),
    );
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = "#ffffff83";
    ctx.lineWidth = 1;
    ctx.stroke();
    const start = geo.samples[0];
    ctx.fillStyle = "#eaf4a0";
    ctx.fillRect(x(start.x) - 3, z(start.z) - 3, 6, 6);
    for (const car of [
      ...state.cars.filter((item) => item.id !== state.player.id),
      state.player,
    ]) {
      const you = car.id === state.player.id;
      ctx.save();
      ctx.translate(x(car.x), z(car.z));
      ctx.fillStyle = you ? "#edff86" : "#f4f3ead4";
      if (you) {
        ctx.rotate(-car.yaw);
        ctx.beginPath();
        ctx.moveTo(0, 6);
        ctx.lineTo(-4, -4);
        ctx.lineTo(0, -2);
        ctx.lineTo(4, -4);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function update(state, record = {}) {
    if (!state?.player) return;
    latestState = state;
    latestRecord = record;
    const p = state.player;
    const isDrift = state.options.mode === "drift";
    const solo = state.options.mode === "time" || isDrift;
    if (mode === "menu") {
      setText(
        "record-summary",
        record.races
          ? `${number(record.races)} 场完赛 · ${number(record.wins)} 次冠军`
          : "每一圈，都可以更快一点。",
      );
      return;
    }
    if (mode === "finished") {
      const signature = `${state.trackId}:${state.result?.time}:${state.series?.round}:${state.series?.finished}`;
      if (signature !== resultSignature) {
        renderResult(state);
        resultSignature = signature;
      }
      return;
    }
    setText(
      "hud-track",
      `${TRACKS[state.trackId || state.options.track]?.name || ""}${state.options.mode === "championship" ? ` · ${state.series.round + 1} / ${state.series.total} 站` : ""}`,
    );
    setText(
      "position-label",
      isDrift ? "DRIFT SCORE" : solo ? "TIME ATTACK" : "POSITION",
    );
    setText(
      "position-value",
      isDrift
        ? number(p.drift?.score)
        : solo
          ? "SOLO"
          : p.rank || state.standings.indexOf(p.id) + 1,
    );
    setText("position-total", solo ? "" : `/ ${state.cars.length}`);
    $("position-value").classList.toggle("solo-label", solo && !isDrift);
    setText("lap-label", isDrift ? "TIME LEFT" : "LAP");
    setText(
      "lap-value",
      isDrift
        ? Math.max(0, Math.ceil(state.remaining))
        : Math.min(p.lap, state.laps),
    );
    setText("lap-total", isDrift ? "s" : `/ ${state.laps}`);
    setText("race-time", time(state.elapsed + (p.penalty || 0)));
    const recordKey = `${state.trackId}|${state.options.car}|${state.options.weather}`;
    const personalBest = record.bestLaps?.[recordKey] || 0;
    const bestLap =
      p.bestLap && personalBest
        ? Math.min(p.bestLap, personalBest)
        : p.bestLap || personalBest;
    setText("best-lap", bestLap > 0 ? time(bestLap) : "—");
    show("ghost-delta", Number.isFinite(state.ghostDelta));
    if (Number.isFinite(state.ghostDelta)) {
      setText(
        "ghost-delta",
        `${state.ghostDelta >= 0 ? "+" : "−"}${Math.abs(state.ghostDelta).toFixed(2)}`,
      );
      $("ghost-delta").classList.toggle("ahead", state.ghostDelta < 0);
    }
    const speed = Math.round(Math.abs(p.speed || 0) * 3.6);
    setText("speed-value", speed);
    setText(
      "gear-value",
      p.speed < -0.5
        ? "R"
        : speed < 3
          ? "N"
          : Math.min(6, Math.floor(speed / 48) + 1),
    );
    const carModel =
      CARS[p.model] || CARS[state.options.car] || Object.values(CARS)[0];
    const speedRatio = clamp(
      Math.abs(p.speed || 0) / (carModel.topSpeed * 1.18),
      0,
      1,
    );
    $("speed-gauge").style.strokeDasharray = `${speedRatio * 100} 100`;
    const ticks = $("tachometer").children;
    const rpm = speed < 3 ? 0.12 : 0.25 + ((speed % 48) / 48) * 0.75;
    for (let i = 0; i < ticks.length; i++)
      ticks[i].classList.toggle("active", i / ticks.length < rpm);
    document
      .querySelector(".speedometer")
      .classList.toggle("boosting", !!p.boosting);
    $("nitro-fill").style.width = `${clamp(p.nitro || 0, 0, 100)}%`;
    $("condition-fill").style.width = `${clamp(p.condition || 0, 0, 100)}%`;
    $("condition-fill").classList.toggle("low", p.condition < 35);
    setText("nitro-value", Math.round(p.nitro || 0));
    setText("condition-value", Math.round(p.condition || 0));
    const warning = p.wrongWay
      ? "逆向行驶 · 调整方向"
      : p.offroad
        ? "驶离路面 · 抓地力降低"
        : p.condition < 25
          ? "车况不佳 · 寻找金色维修补给"
          : "";
    show("road-warning", Boolean(warning));
    setText("road-warning", warning);
    const pending = p.drift?.pending || 0;
    show("drift-display", pending > 5);
    setText("drift-pending", number(pending));
    setText("drift-multiplier", `×${(p.drift?.multiplier || 1).toFixed(1)}`);
    show("drift-total", isDrift);
    setText("drift-score", number(p.drift?.score));
    setText(
      "drift-target",
      p.drift?.score >= 10000
        ? "金牌已达成 · 继续突破"
        : p.drift?.score >= 6000
          ? "下一目标 · 金牌 10,000"
          : p.drift?.score >= 2500
            ? "下一目标 · 银牌 6,000"
            : "铜牌 2,500 分",
    );
    let countdown = null;
    if (state.phase === "countdown") {
      countdown = Math.max(1, Math.ceil(state.countdown));
      previousCountdown = countdown;
    } else if (previousCountdown !== null) {
      goUntil = state.elapsed + 0.9;
      previousCountdown = null;
    }
    if (state.phase === "racing" && state.elapsed < goUntil) countdown = "GO";
    show("countdown", countdown !== null);
    if (countdown !== null) setText("countdown", countdown);
    show("leaderboard", !solo);
    if (!solo) {
      const markup = state.standings
        .map((id, index) => {
          const car = state.cars.find((item) => item.id === id);
          if (!car) return "";
          return `<li class="${id === p.id ? "is-player" : ""}"><b>${index + 1}</b><span>${escapeHTML(id === p.id ? "你 / YOU" : car.name)}</span><small>${car.finished ? "FIN" : `L${Math.min(car.lap, state.laps)}`}</small></li>`;
        })
        .join("");
      if ($("leaderboard-list").innerHTML !== markup)
        $("leaderboard-list").innerHTML = markup;
    }
    drawMap(state);
  }

  function renderResult(state) {
    const p = state.player;
    const result = state.result || {};
    const championship = state.options.mode === "championship";
    const seriesFinished = championship && state.series?.finished;
    const drift = state.options.mode === "drift";
    const timeMode = state.options.mode === "time";
    const points = state.series?.points || {};
    const ordered = seriesFinished
      ? Object.keys(points).sort((a, b) => points[b] - points[a])
      : state.standings;
    const rank = seriesFinished
      ? ordered.indexOf(p.id) + 1
      : result.rank || p.rank || 1;
    const medalNames = {
      gold: "金牌",
      silver: "银牌",
      bronze: "铜牌",
      none: "完赛",
    };
    setText(
      "result-kicker",
      seriesFinished
        ? "CHAMPIONSHIP COMPLETE"
        : drift
          ? "DRIFT SESSION COMPLETE"
          : timeMode
            ? "TIME ATTACK COMPLETE"
            : "FINISH LINE",
    );
    setText(
      "result-title",
      drift
        ? `${medalNames[result.medal] || "漂移"}时刻。`
        : seriesFinished
          ? rank === 1
            ? "总冠军，属于你。"
            : "三站旅程，圆满收官。"
          : timeMode
            ? "与时间，一较高下。"
            : rank === 1
              ? "第一束光，属于你。"
              : "冲线时刻。",
    );
    setText(
      "result-subtitle",
      `${TRACKS[state.trackId || state.options.track]?.name || ""} · ${CARS[state.options.car]?.name || ""}${championship ? ` · 第 ${state.series.round + 1} / ${state.series.total} 站` : ""}`,
    );
    setText(
      "result-rank",
      drift
        ? medalNames[result.medal] || "完赛"
        : timeMode
          ? "TT"
          : String(rank).padStart(2, "0"),
    );
    setText(
      "result-rank-label",
      drift
        ? "DRIFT MEDAL"
        : timeMode
          ? "YOUR PACE"
          : seriesFinished
            ? "SERIES RANK"
            : "POSITION",
    );
    const metrics = drift
      ? [
          ["漂移得分", number(result.score ?? p.drift?.score)],
          ["最高车速", `${Math.round((p.stats?.topSpeed || 0) * 3.6)} km/h`],
          ["漂移距离", `${Math.round(p.stats?.driftDistance || 0)} m`],
        ]
      : [
          ["完赛时间", time(result.time ?? state.elapsed + (p.penalty || 0))],
          [
            "最佳单圈",
            (result.bestLap || p.bestLap) > 0
              ? time(result.bestLap || p.bestLap)
              : "—",
          ],
          [
            championship ? "巡回积分" : "最高车速",
            championship
              ? `${number(points[p.id])} PTS`
              : `${Math.round((p.stats?.topSpeed || 0) * 3.6)} km/h`,
          ],
        ];
    $("result-metrics").innerHTML = metrics
      .map(
        ([label, value]) =>
          `<div><span>${label}</span><strong>${value}</strong></div>`,
      )
      .join("");
    setText(
      "result-laps-label",
      drift ? "SESSION / 赛段统计" : "LAP TIMES / 圈速记录",
    );
    $("result-laps").innerHTML = drift
      ? `<li><span>氮气使用时间</span><strong>${(p.stats?.boostTime || 0).toFixed(1)} s</strong></li><li><span>碰撞次数</span><strong>${p.stats?.collisions || 0}</strong></li><li><span>完赛车况</span><strong>${Math.round(p.condition)}%</strong></li>`
      : (p.lapTimes || [])
          .map((lap, index) => {
            const lapTime = typeof lap === "number" ? lap : lap.time;
            return `<li class="${Math.abs(lapTime - p.bestLap) < 0.001 ? "best" : ""}"><span>LAP ${String(index + 1).padStart(2, "0")}</span><strong>${time(lapTime)}</strong></li>`;
          })
          .join("");
    show("result-standings-section", !timeMode && !drift);
    setText(
      "result-standings-label",
      championship ? "CHAMPIONSHIP / 巡回积分" : "FINAL STANDINGS / 最终排名",
    );
    const standings = championship
      ? Object.keys(points).sort((a, b) => points[b] - points[a])
      : ordered;
    $("result-standings").innerHTML = standings
      .map((id, index) => {
        const car = state.cars.find((item) => item.id === id);
        return `<li class="${id === p.id ? "is-player" : ""}"><span><b>${index + 1}</b> ${escapeHTML(id === p.id ? "你 / YOU" : car?.name || id)}</span><strong>${championship ? `${points[id]} PTS` : car?.finished ? time(car.finishTime) : "未完赛"}</strong></li>`;
      })
      .join("");
    show("next-round-button", championship && !seriesFinished);
    show("replay-button", !championship || seriesFinished);
    if (championship && !seriesFinished)
      $("next-round-button").innerHTML =
        `下一站 · ${TRACKS[["coast", "alpine", "city"][state.series.round + 1]]?.name || ""} <span>→</span>`;
  }

  function toast(message, tone = "info") {
    if (!message) return;
    const node = document.createElement("div");
    node.className = `toast toast-${tone}`;
    node.textContent = message;
    $("toast-stack").append(node);
    while ($("toast-stack").children.length > 3)
      $("toast-stack").firstElementChild.remove();
    setTimeout(() => node.remove(), 3500);
  }
  function setSound(enabled) {
    document.querySelectorAll(".sound-button").forEach((button) => {
      button.setAttribute("aria-pressed", String(enabled));
      button.setAttribute("aria-label", enabled ? "关闭声音" : "开启声音");
      button.querySelector(".sound-state").textContent = enabled
        ? "声音开"
        : "声音关";
    });
  }
  function setCamera(name) {
    setText("camera-name", name);
  }
  function showError(message) {
    setText("error-message", message);
    setMode("error");
  }
  updateOptions(false);
  return { setMode, update, toast, setSound, setCamera, showError };
}
