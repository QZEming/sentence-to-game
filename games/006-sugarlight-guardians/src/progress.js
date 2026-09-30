import { LEVELS, HEROES, DIFFICULTIES } from "./data.js";
const bounded = (v, max = 1000000) =>
  Number.isFinite(v) ? Math.min(max, Math.max(0, Math.floor(v))) : 0;
export function normalizeOptions(value = {}) {
  const v = value && typeof value === "object" ? value : {};
  return {
    levelId: LEVELS.some((l) => l.id === v.levelId) ? v.levelId : LEVELS[0].id,
    mode: v.mode === "endless" ? "endless" : "story",
    difficulty: Object.hasOwn(DIFFICULTIES, v.difficulty)
      ? v.difficulty
      : "normal",
    hero: Object.hasOwn(HEROES, v.hero) ? v.hero : "momo",
  };
}
export function normalizeRecords(value = {}) {
  const v = value && typeof value === "object" ? value : {};
  const result = {
    stars: {},
    bestWaves: {},
    runs: bounded(v.runs),
    wins: bounded(v.wins),
    settings: normalizeOptions(v.settings),
    sound: v.sound !== false,
  };
  for (const level of LEVELS) {
    result.stars[level.id] = bounded(v.stars?.[level.id], 3);
    for (const difficulty of Object.keys(DIFFICULTIES)) {
      const key = level.id + "|" + difficulty;
      const wave = bounded(v.bestWaves?.[key], 9999);
      if (wave > 0) result.bestWaves[key] = wave;
    }
  }
  result.wins = Math.min(result.wins, result.runs);
  return result;
}
export function isUnlocked(records, levelId) {
  const i = LEVELS.findIndex((level) => level.id === levelId);
  return i === 0 || (i > 0 && Number(records.stars?.[LEVELS[i - 1].id]) > 0);
}
export function recordRun(records, state) {
  const next = normalizeRecords(records);
  if (!state.result || !["won", "lost"].includes(state.phase)) return next;
  const options = normalizeOptions(state.options);
  next.runs++;
  next.settings = options;
  if (options.mode === "story" && state.result.won) {
    next.wins++;
    next.stars[options.levelId] = Math.max(
      next.stars[options.levelId],
      bounded(state.result.stars, 3),
    );
  }
  if (options.mode === "endless") {
    const key = options.levelId + "|" + options.difficulty;
    next.bestWaves[key] = Math.max(
      next.bestWaves[key] || 0,
      bounded(state.result.waves ?? state.wave, 9999),
    );
  }
  return next;
}
