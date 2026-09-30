import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeOptions,
  normalizeRecords,
  isUnlocked,
  recordRun,
} from "../src/progress.js";
const won = (levelId, stars) => ({
  phase: "won",
  options: { levelId, mode: "story" },
  result: { won: true, stars },
});
test("malformed progress cannot grant invalid stars, forged maps, or impossible win totals", () => {
  const records = normalizeRecords({
    runs: 5,
    wins: 40,
    stars: { meadow: 99, brook: -2, bad: 3 },
    bestWaves: { "meadow|hard": 12.9, "bad|easy": 30 },
  });
  assert.equal(records.wins, 5);
  assert.equal(records.stars.meadow, 3);
  assert.equal(records.stars.brook, 0);
  assert.equal(records.stars.bad, undefined);
  assert.deepEqual(records.bestWaves, { "meadow|hard": 12 });
});
test("unsupported menu values fall back to a playable first chapter", () => {
  assert.deepEqual(
    normalizeOptions({
      levelId: "__proto__",
      hero: "bad",
      mode: "cheat",
      difficulty: "constructor",
    }),
    { levelId: "meadow", mode: "story", hero: "momo", difficulty: "normal" },
  );
  assert.equal(normalizeOptions(null).hero, "momo");
});
test("winning a chapter unlocks only the next chapter and persists the best star count", () => {
  const first = normalizeRecords();
  assert.equal(isUnlocked(first, "meadow"), true);
  assert.equal(isUnlocked(first, "brook"), false);
  const records = recordRun(first, won("meadow", 2));
  assert.equal(isUnlocked(records, "brook"), true);
  assert.equal(isUnlocked(records, "grove"), false);
  assert.equal(records.wins, 1);
  assert.equal(records.runs, 1);
  const replay = recordRun(records, won("meadow", 1));
  assert.equal(replay.stars.meadow, 2);
  assert.equal(records.runs, 1, "recording must not mutate the previous save");
  assert.equal(first.stars.meadow, 0);
});
test("a lost story chapter counts as a run without awarding stars or unlocks", () => {
  const records = recordRun(normalizeRecords(), {
    phase: "lost",
    options: { levelId: "meadow", mode: "story" },
    result: { won: false, stars: 0 },
  });
  assert.equal(records.runs, 1);
  assert.equal(records.wins, 0);
  assert.equal(records.stars.meadow, 0);
  assert.equal(isUnlocked(records, "brook"), false);
});
test("endless high waves remain separate by map and difficulty and never unlock story", () => {
  let records = normalizeRecords();
  for (const [difficulty, waves] of [
    ["normal", 18],
    ["hard", 12],
    ["normal", 6],
  ]) {
    records = recordRun(records, {
      phase: "lost",
      options: { levelId: "frost", mode: "endless", difficulty },
      result: { won: false, waves },
    });
  }
  assert.equal(records.bestWaves["frost|normal"], 18);
  assert.equal(records.bestWaves["frost|hard"], 12);
  assert.equal(records.stars.frost, 0);
  assert.equal(records.wins, 0);
  assert.equal(records.runs, 3);
});
test("a game in progress is never saved as a completed run", () => {
  const records = normalizeRecords();
  const same = recordRun(records, {
    phase: "wave",
    options: { levelId: "meadow" },
    result: null,
  });
  assert.deepEqual(same, records);
});
