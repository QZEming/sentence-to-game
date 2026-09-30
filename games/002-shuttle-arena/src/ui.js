const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, Number(value) || 0));
const number = (value) => Math.max(0, Math.round(Number(value) || 0));
const timeLabel = (value = 0) => {
  const seconds = number(value);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

export function createUI(callbacks = {}) {
  const $ = (id) => document.getElementById(id);
  let mode = "loading";
  let lastState = {};
  let assisted = true;
  let toastTimer;
  let focusBeforeModal = null;
  const panels = [
    "welcome-panel",
    "game-hud",
    "pause-overlay",
    "result-overlay",
    "loading-overlay",
    "error-overlay",
  ];
  const setText = (id, value) => {
    const node = $(id);
    if (node && node.textContent !== String(value))
      node.textContent = String(value);
  };
  const actionMap = {
    pause: "onPause",
    resume: "onResume",
    restart: "onRestart",
    menu: "onMenu",
    continue: "onContinue",
    sound: "onSound",
    camera: "onCamera",
    serve: "onServe",
  };

  $("match-options").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    assisted = form.has("assist");
    callbacks.onStart?.({
      mode: form.get("mode") || "quick",
      difficulty: form.get("difficulty") || "normal",
      assist: assisted,
    });
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "reload") window.location.reload();
      else if (action === "shot") callbacks.onShot?.(button.dataset.shot);
      else if (action === "aimleft") callbacks.onAim?.(-1);
      else if (action === "aimright") callbacks.onAim?.(1);
      else if (action === "assist") {
        assisted = !assisted;
        callbacks.onAssist?.(assisted);
        renderAssist();
      } else callbacks[actionMap[action]]?.();
    });
  });

  function renderAssist() {
    $("assist-toggle").setAttribute("aria-pressed", String(assisted));
    setText("assist-status", assisted ? "开启" : "关闭");
  }

  function renderResult(state = {}, isBetweenGames = false) {
    const winner = state.winner ?? state.pointWinner;
    const playerWon = winner === 0;
    const scores = state.score || [0, 0];
    const games = state.games || [0, 0];
    const isMatch = state.options?.mode === "match";
    setText(
      "result-kicker",
      isBetweenGames ? "CHANGE ENDS. GO AGAIN." : "MATCH COMPLETE",
    );
    setText(
      "result-title",
      isBetweenGames
        ? playerWon
          ? "好球，拿下一局。"
          : "调整节奏，下一局。"
        : playerWon
          ? "胜利，属于你。"
          : "好对手，下一场见。",
    );
    setText(
      "result-copy",
      isBetweenGames
        ? `大比分 ${games[0]} : ${games[1]}，深呼吸，把状态带进下一局。`
        : playerWon
          ? "每一拍都算数。下一场，继续闪耀。"
          : "把握击球时机，用高远球调动对手，再寻找空当。",
    );
    setText(
      "result-badge",
      isBetweenGames ? "NEXT GAME" : playerWon ? "VICTORY" : "GOOD GAME",
    );
    setText(
      "result-you-score",
      isMatch && !isBetweenGames ? games[0] : scores[0],
    );
    setText(
      "result-ai-score",
      isMatch && !isBetweenGames ? games[1] : scores[1],
    );
    const stats = state.stats || {};
    const totalRallies =
      state.pointsPlayed ?? number(scores[0]) + number(scores[1]);
    setText("result-rallies", number(totalRallies));
    setText("result-rally", number(state.longestRally));
    setText("result-smashes", number(stats.smashes?.[0]));
    setText("result-time", timeLabel(state.elapsed));
    setText(
      "result-record",
      `主场纪录 · ${number(state.record?.wins)} 胜 · 最长 ${number(state.record?.bestRally ?? state.longestRally)} 拍`,
    );
    $("continue-button").hidden = !isBetweenGames;
    $("rematch-button").hidden = isBetweenGames;
    $("result-badge").classList.toggle("is-victory", playerWon);
  }

  function update(state = {}) {
    lastState = state;
    const scores = state.score || [0, 0];
    const games = state.games || [0, 0];
    const training = state.options?.mode === "training";
    setText("you-score", String(number(scores[0])).padStart(2, "0"));
    setText("ai-score", String(number(scores[1])).padStart(2, "0"));
    setText("you-games", number(games[0]));
    setText("ai-games", number(games[1]));
    setText(
      "game-label",
      training ? "自由训练" : `第 ${number(state.gameNumber) || 1} 局`,
    );
    setText(
      "format-label",
      training
        ? "FREE PRACTICE"
        : state.options?.mode === "match"
          ? "BEST OF THREE · 21"
          : "QUICK MATCH · 7",
    );
    $("you-server").classList.toggle("is-serving", state.server === 0);
    $("ai-server").classList.toggle("is-serving", state.server === 1);
    setText("rally-count", number(state.rally));
    setText("longest-count", number(state.longestRally));
    setText("match-time", timeLabel(state.elapsed));
    let energy = state.players?.[0]?.energy ?? 1;
    if (energy > 1) energy /= 100;
    const percentage = Math.round(clamp(energy) * 100);
    $("energy-bar").style.width = `${percentage}%`;
    $("energy-bar").classList.toggle("is-low", percentage < 25);
    setText("energy-value", `${percentage}%`);
    if (typeof state.options?.assist === "boolean")
      assisted = state.options.assist;
    renderAssist();
    const servePhase = state.phase === "serve";
    const ownServe = servePhase && state.server === 0;
    $("serve-panel").hidden = !ownServe || mode !== "playing";
    setText(
      "serve-copy",
      number(scores[0]) + number(scores[1]) === 0
        ? "准备好，打出第一拍。"
        : "你的发球权，掌握节奏。",
    );
    const canHit = Boolean(state.canHit);
    $("shot-status").classList.toggle("can-hit", canHit);
    const phaseLabel = ownServe
      ? "你来发球"
      : servePhase
        ? "对手准备发球"
        : state.phase === "point"
          ? "回合结束"
          : training
            ? "找到你的节奏"
            : "回合进行中";
    setText("match-status", phaseLabel);
    const quality = {
      完美: "完美击球",
      精准: "精准回球",
      勉强: "接住了，调整步伐",
    }[state.lastQuality];
    setText(
      "shot-prompt",
      canHit
        ? "击球时机 · 现在出拍"
        : ownServe
          ? "按空格或点击发球"
          : servePhase
            ? "盯住来球"
            : quality ||
              (state.rally > 0 ? "调整步伐，准备下一拍" : "准备接球"),
    );
    if (state.record) {
      setText(
        "menu-record",
        `${number(state.record.wins)} 胜 · 最长 ${number(state.record.bestRally)} 拍`,
      );
    }
    if (state.cameraLabel) setCamera(state.cameraLabel);
  }

  function setMode(nextMode, result) {
    if (mode === nextMode && !result) return;
    const previousMode = mode;
    mode = nextMode;
    document.body.dataset.uiMode = mode;
    panels.forEach((id) => {
      $(id).hidden = true;
    });
    const active = {
      loading: "loading-overlay",
      menu: "welcome-panel",
      playing: "game-hud",
      paused: "pause-overlay",
      gameOver: "result-overlay",
      matchOver: "result-overlay",
      error: "error-overlay",
    }[mode];
    if (active) $(active).hidden = false;
    if (mode === "paused") $("game-hud").hidden = false;
    if (mode === "gameOver" || mode === "matchOver")
      renderResult(
        result || lastState,
        mode === "gameOver" && (result || lastState).options?.mode === "match",
      );
    if (mode !== "playing") {
      clearTimeout(toastTimer);
      $("toast").hidden = true;
    }
    if (result && !["gameOver", "matchOver"].includes(mode)) update(result);
    if (["paused", "gameOver", "matchOver", "error"].includes(mode)) {
      if (!["paused", "gameOver", "matchOver", "error"].includes(previousMode))
        focusBeforeModal = document.activeElement;
      requestAnimationFrame(() =>
        $(active)
          ?.querySelector("button:not([hidden]), a")
          ?.focus({ preventScroll: true }),
      );
    } else if (mode === "playing") {
      if (
        focusBeforeModal?.isConnected &&
        !focusBeforeModal.closest("[hidden]")
      )
        focusBeforeModal.focus({ preventScroll: true });
      else $("game-canvas").focus({ preventScroll: true });
      focusBeforeModal = null;
      update(result || lastState);
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const dialog = document.querySelector(
      '.modal-backdrop[aria-modal="true"]:not([hidden])',
    );
    if (!dialog) return;
    const focusable = [
      ...dialog.querySelectorAll('button, a[href], input, [tabindex="0"]'),
    ].filter(
      (node) => !node.hidden && !node.disabled && !node.closest("[hidden]"),
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (
      event.shiftKey &&
      (document.activeElement === first ||
        !dialog.contains(document.activeElement))
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last ||
        !dialog.contains(document.activeElement))
    ) {
      event.preventDefault();
      first.focus();
    }
  });

  function toast(text, kind = "info") {
    clearTimeout(toastTimer);
    const node = $("toast");
    setText("toast-text", text);
    node.dataset.kind = kind;
    node.hidden = false;
    toastTimer = window.setTimeout(
      () => {
        node.hidden = true;
      },
      kind === "info" ? 1800 : 2400,
    );
  }

  function setSound(enabled) {
    const button = document.querySelector('[data-action="sound"]');
    button.setAttribute("aria-pressed", String(Boolean(enabled)));
    button.setAttribute("aria-label", enabled ? "关闭声音" : "开启声音");
    button.title = `${enabled ? "关闭" : "开启"}声音（M）`;
  }
  function setCamera(label) {
    setText("camera-label", label || "跟随");
  }
  function showError(message) {
    setText("error-message", message || "球场加载遇到问题，请刷新页面后重试。");
    setMode("error");
  }
  return { setMode, update, toast, setSound, setCamera, showError };
}
