const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, Number(value) || 0));
const displayNumber = (value) =>
  Math.max(0, Math.round(Number(value) || 0)).toLocaleString("zh-CN");
const timeLabel = (value) => {
  const seconds = Math.max(0, Math.ceil(Number(value) || 0));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

/** The UI only presents state; simulation, keyboard and touch handling live in main.js. */
export function createUI(callbacks = {}) {
  const element = (id) => document.getElementById(id);
  const refs = Object.fromEntries(
    [
      "welcome-panel",
      "game-hud",
      "pause-overlay",
      "result-overlay",
      "loading-overlay",
      "error-overlay",
      "touch-controls",
      "hud-time",
      "time-label",
      "hud-fish",
      "hud-target",
      "hud-progress",
      "hud-progress-label",
      "hud-speed",
      "hud-boost",
      "hud-score",
      "hud-combo",
      "ride-status",
      "camera-label",
      "toast",
      "result-kicker",
      "result-title",
      "result-copy",
      "result-fish",
      "result-score",
      "result-best",
      "result-note",
      "error-message",
    ].map((id) => [id, element(id)]),
  );
  let mode = "loading";
  let toastTimer;
  let lastFocused;
  let lastMapProgress = -1;
  let lastMapFishCount = -1;
  const mapCanvas = element("minimap");
  const mapContext = mapCanvas.getContext("2d");

  const callbackNames = {
    start: "onStart",
    pause: "onPause",
    resume: "onResume",
    restart: "onRestart",
    sound: "onSound",
    camera: "onCamera",
    freeRide: "onFreeRide",
  };
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.action === "reload") window.location.reload();
      else callbacks[callbackNames[button.dataset.action]]?.();
    });
  });

  const write = (id, value) => {
    const text = String(value);
    if (refs[id].textContent !== text) refs[id].textContent = text;
  };

  function update(state = {}) {
    write("hud-speed", Math.round(Math.max(0, Number(state.speed) || 0)));
    write("hud-fish", Math.max(0, Number(state.fish) || 0));
    write("hud-target", Number(state.targetFish) || 12);
    write("hud-time", state.freeRide ? "∞" : timeLabel(state.time));
    write("time-label", state.freeRide ? "不赶时间" : "海风倒计时");
    refs["hud-time"]
      .closest(".time-stat")
      .classList.toggle("is-urgent", !state.freeRide && state.time <= 15);
    const progress = clamp(state.progress);
    refs["hud-progress"].style.width = `${progress * 100}%`;
    write("hud-progress-label", `${Math.floor(progress * 100)}%`);
    refs["hud-boost"].style.width = `${clamp(state.boost) * 100}%`;
    write("hud-score", displayNumber(state.score));
    write(
      "hud-combo",
      state.combo > 1 ? `${Math.floor(state.combo)} 连收！` : "",
    );
    write(
      "ride-status",
      state.airborne
        ? "鹈鹕也会飞一下"
        : state.freeRide
          ? "自由自在"
          : state.speed > 38
            ? "追上这阵海风"
            : "海风正好",
    );
  }

  function setMode(nextMode, result = {}) {
    const knownModes = [
      "loading",
      "menu",
      "playing",
      "paused",
      "finished",
      "error",
    ];
    if (!knownModes.includes(nextMode)) return;
    const previousMode = mode;
    mode = nextMode;
    document.body.dataset.mode = mode;
    refs["welcome-panel"].hidden = mode !== "menu";
    refs["game-hud"].hidden = !["playing", "paused", "finished"].includes(mode);
    refs["pause-overlay"].hidden = mode !== "paused";
    refs["result-overlay"].hidden = mode !== "finished";
    refs["loading-overlay"].hidden = mode !== "loading";
    refs["error-overlay"].hidden = mode !== "error";
    refs["touch-controls"].hidden = mode !== "playing";
    if (mode !== "playing") {
      clearTimeout(toastTimer);
      refs.toast.hidden = true;
    }
    const modalOpen = ["paused", "finished", "error"].includes(mode);
    document.querySelector(".masthead").inert = modalOpen;
    if (mode === "finished") {
      const success = Boolean(result.success);
      write(
        "result-kicker",
        success ? "A VERY GOOD LITTLE TRIP" : "EVERY LITTLE TRIP COUNTS",
      );
      write("result-title", success ? "满载快乐而归。" : "海风说，下次再来。");
      write(
        "result-copy",
        result.reason ||
          (success
            ? "鱼兜装满了，心情也是。小岛记住了你的车铃声。"
            : "没装满鱼兜，也装满了一路的好风景。"),
      );
      write("result-fish", displayNumber(result.fish));
      write("result-score", displayNumber(result.score));
      write("result-best", displayNumber(result.best));
      const isBest = result.score > 0 && result.score >= result.best;
      write(
        "result-note",
        isBest
          ? "✦ 这是你在小岛上的最佳纪录！"
          : success && result.time > 0
            ? `还有 ${Math.ceil(result.time)} 秒，留给海风。`
            : "每多拾起一条鱼，都是小小的进步。",
      );
    }
    if (
      ["paused", "finished", "error"].includes(mode) &&
      mode !== previousMode
    ) {
      lastFocused = document.activeElement;
      const overlay =
        refs[
          mode === "paused"
            ? "pause-overlay"
            : mode === "finished"
              ? "result-overlay"
              : "error-overlay"
        ];
      queueMicrotask(() =>
        overlay.querySelector("button")?.focus({ preventScroll: true }),
      );
    } else if (mode === "playing") {
      if (
        lastFocused?.isConnected &&
        !lastFocused.closest("[hidden]") &&
        !lastFocused.closest("[inert]")
      )
        lastFocused.blur();
      document.activeElement?.blur?.();
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !["paused", "finished", "error"].includes(mode))
      return;
    const overlay =
      refs[
        mode === "paused"
          ? "pause-overlay"
          : mode === "finished"
            ? "result-overlay"
            : "error-overlay"
      ];
    const focusable = [
      ...overlay.querySelectorAll("button:not([disabled]), a[href]"),
    ];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (
      event.shiftKey &&
      (document.activeElement === first ||
        !overlay.contains(document.activeElement))
    ) {
      event.preventDefault();
      last?.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last ||
        !overlay.contains(document.activeElement))
    ) {
      event.preventDefault();
      first?.focus();
    }
  });

  function toast(text, kind = "info") {
    clearTimeout(toastTimer);
    refs.toast.textContent = text;
    refs.toast.dataset.kind = kind;
    refs.toast.hidden = false;
    toastTimer = setTimeout(() => {
      refs.toast.hidden = true;
    }, 2400);
  }

  function setSound(enabled) {
    document.body.classList.toggle("sound-enabled", Boolean(enabled));
    document.querySelectorAll(".sound-button").forEach((button) => {
      button.setAttribute("aria-pressed", String(Boolean(enabled)));
      button.setAttribute("aria-label", enabled ? "关闭声音" : "开启声音");
      button.title = `${enabled ? "关闭" : "开启"}声音 · M`;
    });
  }

  function setCamera(label) {
    write("camera-label", label || "追随镜头");
    const button = document.querySelector('[data-action="camera"]');
    button.setAttribute("aria-label", `切换镜头，当前${label || "追随镜头"}`);
  }

  function drawMap(progress = 0, fish = []) {
    if (!mapContext) return;
    const p = (((Number(progress) || 0) % 1) + 1) % 1;
    const fishCount = Array.isArray(fish)
      ? fish.filter((item) => item.collected).length
      : Number(fish) || 0;
    if (
      Math.abs(p - lastMapProgress) < 0.0015 &&
      fishCount === lastMapFishCount
    )
      return;
    lastMapProgress = p;
    lastMapFishCount = fishCount;
    const ctx = mapContext;
    const w = mapCanvas.width,
      h = mapCanvas.height;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2,
      cy = h / 2 + 1;
    const point = (t, radiusScale = 1) => {
      const angle = t * Math.PI * 2 - Math.PI / 2;
      const wiggle = 1 + Math.sin(angle * 3 + 0.7) * 0.07;
      return [
        cx + Math.cos(angle) * 119 * wiggle * radiusScale,
        cy + Math.sin(angle) * 73 * wiggle * radiusScale,
      ];
    };
    const outline = (scale) => {
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const [x, y] = point(i / 100, scale);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };
    outline(1.18);
    ctx.fillStyle = "#d4e9db";
    ctx.fill();
    outline(1.08);
    ctx.fillStyle = "#e7e4c8";
    ctx.fill();
    outline(0.92);
    ctx.fillStyle = "#d3ddba";
    ctx.fill();
    [
      [138, 102, 16],
      [174, 124, 21],
      [192, 93, 13],
      [119, 131, 10],
      [208, 131, 8],
    ].forEach(([x, y, r]) => {
      ctx.fillStyle = "#b9cea0";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
    outline(1);
    ctx.strokeStyle = "#fff8dc";
    ctx.lineWidth = 13;
    ctx.stroke();
    outline(1);
    ctx.strokeStyle = "#c4b998";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    // Twelve positions convey the coastal route without requiring simulation internals.
    for (let i = 0; i < 12; i++) {
      const [x, y] = point((i + 0.45) / 12);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = i < fishCount ? "#a6bb91" : "#ddae4f";
      ctx.fill();
    }
    const [x, y] = point(p);
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#ed795730";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ed7957";
    ctx.fill();
    ctx.strokeStyle = "#fffcee";
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  function showError(message) {
    write("error-message", message || "三维场景暂时未能加载。");
    setMode("error");
  }

  setMode("loading");
  drawMap(0, []);
  return { update, setMode, toast, setSound, setCamera, drawMap, showError };
}
