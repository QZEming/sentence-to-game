import test from "node:test";
import * as engine from "../src/game.js";
import * as data from "../src/data.js";
const api = { ...data, ...engine };
const check = (v, m) => {
  if (!v) throw Error(m);
};
function playCampaign(api, o = {}) {
  const { createGame, updateGame, act, getTowerStats, getLevel } = api,
    g = createGame({
      levelId: o.levelId || "meadow",
      mode: o.mode || "story",
      difficulty: o.difficulty || "normal",
      hero: o.hero || "momo",
    }),
    l = getLevel(g.levelId || o.levelId || "meadow"),
    pts = [];
  for (const p of l.paths) {
    for (let i = 1; i < p.length; i++) {
      let a = p[i - 1],
        b = p[i],
        n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 0.5));
      for (let k = 0; k < n; k++)
        pts.push({
          x: a.x + ((b.x - a.x) * k) / n,
          z: a.z + ((b.z - a.z) * k) / n,
        });
    }
  }
  const d = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  const cover = (p, type, over = true) => {
    let range = getTowerStats({ type, level: 1, branch: null }).range;
    return type === "bloom"
      ? g.towers.reduce(
          (s, t) => s + (t.type !== "bloom" && d(p, t) <= range ? 30 : 0),
          0,
        )
      : pts.reduce(
          (s, v) =>
            s +
            (d(p, v) > range
              ? 0
              : 1 /
                (1 +
                  (over
                    ? g.towers.filter(
                        (t) =>
                          t.type !== "bloom" &&
                          d(t, v) <= getTowerStats(t).range,
                      ).length
                    : 0) *
                    0.32)),
          0,
        );
  };
  const actions = [],
    cmd = (a) => {
      let r = act(g, a);
      if (r.ok) actions.push({ ...a, wave: g.wave });
      return r.ok;
    };
  const build = (type) => {
    let ps = l.pads
      .filter((p) => !g.towers.some((t) => t.padId === p.id))
      .sort((a, b) => cover(b, type) - cover(a, type));
    return (
      ps.length && cmd({ type: "build", padId: ps[0].id, towerType: type })
    );
  };
  const plan = [
      "carrot",
      "berry",
      "carrot",
      "bloom",
      "spark",
      "frost",
      "honey",
      "spark",
      "berry",
      "carrot",
      "spark",
      "frost",
    ],
    branch = (t) =>
      t === "bloom" ? "b" : t === "frost" ? "a" : t === "honey" ? "b" : "a";
  function invest() {
    for (let k = 0; k < 30; k++) {
      let n = g.towers.length;
      if (n < Math.min(3, l.pads.length)) {
        if (!build(plan[n])) break;
        continue;
      }
      let us = g.towers
        .filter((t) => t.level < 3 && t.type !== "bloom")
        .sort((a, b) => {
          let score = (t) => {
            let s = getTowerStats(t);
            return (
              ((cover(t, t.type, false) * Math.max(1, s.damage || 1)) /
                Math.max(0.1, s.interval || 1) /
                Math.max(1, s.upgradeCost || 1)) *
              (t.level === 1 ? 1.8 : 1)
            );
          };
          return score(b) - score(a);
        });
      if (
        n < Math.min(7, l.pads.length) &&
        (n < 4 || us.every((t) => t.level >= 2))
      ) {
        if (build(plan[n])) continue;
      }
      let t = us.find((t) => g.candy >= getTowerStats(t).upgradeCost);
      if (
        t &&
        cmd({
          type: "upgrade",
          towerId: t.id,
          ...(t.level === 2 ? { branch: branch(t.type) } : {}),
        })
      )
        continue;
      if (n < l.pads.length && build(plan[n % plan.length])) continue;
      let b = g.towers.find((t) => t.type === "bloom" && t.level < 3);
      if (
        b &&
        cmd({
          type: "upgrade",
          towerId: b.id,
          ...(b.level === 2 ? { branch: "b" } : {}),
        })
      )
        continue;
      break;
    }
  }
  const hp = [...l.pads].sort(
    (a, b) => cover(b, "carrot", false) - cover(a, "carrot", false),
  )[0];
  if (hp) cmd({ type: "rally", x: hp.x, z: hp.z });
  let frames = 0,
    events = [];
  while (
    !["won", "lost"].includes(g.phase) &&
    frames++ < (o.maxFrames || 12000)
  ) {
    if (o.stopAfterWave && g.phase === "build" && g.wave >= o.stopAfterWave)
      break;
    invest();
    if (g.phase === "build") cmd({ type: "startWave" });
    if (g.phase === "wave" && g.enemies.length) {
      let es = g.enemies.filter((e) => e.hp > 0),
        lead = [...es].sort(
          (a, b) => a.pathLength - a.distance - (b.pathLength - b.distance),
        )[0],
        cl = [...es].sort(
          (a, b) =>
            es.filter((e) => d(b, e) < 3.5).length -
            es.filter((e) => d(a, e) < 3.5).length,
        )[0];
      if (cl && (es.length >= 3 || cl.boss))
        cmd({ type: "spell", spell: "meteor", x: cl.x, z: cl.z });
      if (lead && (lead.distance / lead.pathLength > 0.72 || es.length >= 6))
        cmd({ type: "spell", spell: "frost", x: lead.x, z: lead.z });
      if (g.lives < g.maxLives || (es.length > 7 && g.mana > 85))
        cmd({ type: "spell", spell: "bell", x: l.core.x, z: l.core.z });
    }
    events.push(...updateGame(g, 0.5));
  }
  return {
    game: g,
    actions,
    events,
    frames,
    limitReached: frames >= (o.maxFrames || 12000),
  };
}
for (const levelId of ["meadow", "brook", "grove", "frost", "starlight"]) {
  test(
    levelId + " completes every story wave using only legal player commands",
    () => {
      const { game, actions, events, limitReached } = playCampaign(api, {
        levelId,
      });
      check(!limitReached, "Campaign exceeded simulation budget");
      check(game.phase === "won" && game.result?.won, "Campaign did not win");
      check(
        game.wave === game.totalWaves,
        "Campaign stopped before final wave",
      );
      check(
        game.lives > 0 && game.result.stars >= 1 && game.result.stars <= 3,
        "Invalid victory result",
      );
      check(game.kills > 0, "Victory did not involve combat");
      check(
        actions.filter((a) => a.type === "startWave").length ===
          game.totalWaves,
        "Wave starts were skipped",
      );
      check(
        actions.some((a) => a.type === "build") &&
          actions.some((a) => a.type === "upgrade"),
        "No legal defenses were built and upgraded",
      );
      check(
        actions.some((a) => a.type === "spell"),
        "Campaign did not exercise a spell",
      );
      check(
        events.filter((e) => e.type === "win").length === 1,
        "Victory settled more than once",
      );
      const before = JSON.stringify(game);
      api.updateGame(game, 0.5);
      check(
        !api.act(game, { type: "startWave" }).ok,
        "Finished campaign accepted a new wave",
      );
      check(
        JSON.stringify(game) === before,
        "Victory state changed after completion",
      );
    },
  );
}
test("endless mode survives beyond the story finale without returning a victory", () => {
  const total = api.createGame({
    levelId: "meadow",
    mode: "endless",
    difficulty: "normal",
    hero: "momo",
  }).totalWaves;
  const { game, events, limitReached } = playCampaign(api, {
    levelId: "meadow",
    mode: "endless",
    stopAfterWave: total + 2,
  });
  check(
    !limitReached && game.phase === "build" && game.wave >= total + 2,
    "Endless game did not continue beyond campaign length",
  );
  check(
    game.lives > 0 && game.result === null,
    "Endless game ended prematurely",
  );
  check(
    !events.some((e) => e.type === "win"),
    "Endless game emitted campaign victory",
  );
});
for (const [levelId, difficulty, hero] of [
  ["meadow", "hard", "bao"],
  ["frost", "hard", "pip"],
  ["starlight", "hard", "momo"],
  ["starlight", "easy", "bao"],
]) {
  test(levelId + " is playable on " + difficulty + " with " + hero, () => {
    const { game, limitReached } = playCampaign(api, {
      levelId,
      difficulty,
      hero,
    });
    check(
      !limitReached && game.phase === "won" && game.lives > 0,
      "Legal defense strategy failed",
    );
  });
}
