import test from "node:test";
import * as engine from "../src/game.js";
import * as data from "../src/data.js";
const api = { ...data, ...engine };
const { act, updateGame, getTowerStats } = api;
const check = (v, m) => {
  if (!v) throw Error(m);
};
const tick = (g, s) => {
  let es = [];
  for (let t = 0; t < s - 1e-8; t += 0.5)
    es.push(...updateGame(g, Math.min(0.5, s - t)));
  return es;
};
const shots = (es, id) =>
  es.filter((e) => e.type === "shot" && e.sourceId === id);
function isolatedBattle(api, type = "carrot", o = {}) {
  const { createGame, act, getLevel } = api,
    g = createGame({
      levelId: "meadow",
      mode: "story",
      difficulty: "normal",
      hero: "momo",
    }),
    l = getLevel("meadow"),
    path = l.paths[0];
  const near = (p) => {
    let walked = 0,
      best;
    for (let i = 1; i < path.length; i++) {
      let a = path[i - 1],
        b = path[i],
        dx = b.x - a.x,
        dz = b.z - a.z,
        len = Math.hypot(dx, dz),
        t = Math.max(
          0,
          Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / (len * len)),
        ),
        x = a.x + dx * t,
        z = a.z + dz * t,
        d = Math.hypot(p.x - x, p.z - z);
      if (!best || d < best.offset)
        best = { x, z, distance: walked + len * t, offset: d };
      walked += len;
    }
    return { ...best, pathLength: walked };
  };
  const pads = l.pads
      .map((p) => ({ ...p, route: near(p) }))
      .sort((a, b) => a.route.offset - b.route.offset),
    p = o.padId ? pads.find((p) => p.id === o.padId) : pads[0];
  g.candy = 10000;
  if (!act(g, { type: "build", towerType: type, padId: p.id }).ok)
    throw Error("Fixture could not build " + type);
  const tower = g.towers[0];
  if (o.level >= 2) act(g, { type: "upgrade", towerId: tower.id });
  if (o.level >= 3)
    act(g, { type: "upgrade", towerId: tower.id, branch: o.branch || "a" });
  g.phase = "wave";
  g.wave = 1;
  g.hero.x = 1000;
  g.hero.z = 1000;
  g.hero.targetX = 1000;
  g.hero.targetZ = 1000;
  const enemy = (id, distance = p.route.distance) => ({
    id,
    type: "puff",
    x: p.route.x,
    z: p.route.z,
    heading: 0,
    hp: 1000000,
    maxHp: 1000000,
    distance,
    pathIndex: 0,
    pathLength: p.route.pathLength,
    speed: 0,
    flying: false,
    slow: 1,
    boss: false,
    armor: 0,
    reward: 7,
    damage: 1,
    flash: 0,
    dead: false,
    leaked: false,
    slowUntil: 0,
    slowFactor: 1,
    stunUntil: 0,
    dotDps: 0,
    dotRemaining: 0,
    dotSource: null,
    healTimer: 2.8,
    mini: false,
  });
  g.enemies = [enemy("fixture-0")];
  return { game: g, tower, pad: p, pads, enemy, nearest: near };
}
test("berry splash and spark chains damage multiple real enemies", () => {
  for (const type of ["berry", "spark"]) {
    const f = isolatedBattle(api, type);
    f.game.enemies = [
      f.enemy("a"),
      f.enemy("b", f.pad.route.distance + 0.3),
      f.enemy("c", f.pad.route.distance + 0.6),
    ];
    const es = tick(f.game, 0.1);
    check(
      f.game.enemies.filter((e) => e.hp < e.maxHp).length >= 2,
      type + " only hit one target",
    );
    check(
      es.filter((e) => e.type === "hit" && e.sourceId === f.tower.id).length >=
        2,
      type + " did not emit multi-target hits",
    );
  }
});
test("honey poison continues damaging after the source tower is sold", () => {
  const f = isolatedBattle(api, "honey");
  tick(f.game, 0.1);
  const target = f.game.enemies[0],
    before = target.hp;
  check(
    target.dotDps > 0 && target.dotRemaining > 0,
    "Honey did not apply poison",
  );
  check(
    act(f.game, { type: "sell", towerId: f.tower.id }).ok,
    "Could not remove source",
  );
  tick(f.game, 2);
  check(target.hp < before, "Poison stopped when source was removed");
});
test("armor reduces physical damage while magic bypasses it", () => {
  const damage = (type, armor) => {
    const f = isolatedBattle(api, type);
    f.game.enemies[0].armor = armor;
    const before = f.game.enemies[0].hp;
    tick(f.game, 0.1);
    return before - f.game.enemies[0].hp;
  };
  const physical = damage("carrot", 0),
    armored = damage("carrot", 0.45);
  check(
    physical > 0 && armored > 0 && armored < physical,
    "Physical armor has no effect",
  );
  check(
    Math.abs(damage("spark", 0) - damage("spark", 0.45)) < 1e-6,
    "Magic was reduced by armor",
  );
});
test("splitters create two miniature enemies without paying the kill twice", () => {
  const f = isolatedBattle(api, "carrot"),
    target = f.game.enemies[0];
  target.type = "splitter";
  target.hp = 1;
  const before = f.game.kills;
  tick(f.game, 0.1);
  check(
    f.game.enemies.filter((e) => e.mini && e.type === "puff").length === 2,
    "Splitter did not make two children",
  );
  check(f.game.kills === before + 1, "Splitter counted more than once");
});
test("shamans heal nearby allies without exceeding maximum health", () => {
  const f = isolatedBattle(api),
    healer = f.enemy("healer"),
    ally = f.enemy("ally");
  f.game.towers = [];
  healer.type = "shaman";
  healer.healTimer = 0.01;
  ally.maxHp = 100;
  ally.hp = 95;
  f.game.enemies = [healer, ally];
  tick(f.game, 0.1);
  check(ally.hp > 95 && ally.hp <= 100, "Healing failed or overflowed health");
});
test("bosses resist frost but still slow compared with their normal travel", () => {
  const travel = (boss, cast) => {
    const f = isolatedBattle(api);
    f.game.towers = [];
    const e = f.game.enemies[0];
    e.speed = 1;
    e.boss = boss;
    const before = e.distance;
    if (cast) act(f.game, { type: "spell", spell: "frost", x: e.x, z: e.z });
    tick(f.game, 1);
    return e.distance - before;
  };
  const normal = travel(false, true),
    boss = travel(true, true),
    free = travel(true, false);
  check(normal < boss && boss < free, "Boss frost resistance has no effect");
});
test("carrot rapid-fire and sniper branches produce different firing patterns", () => {
  const run = (branch) => {
    const f = isolatedBattle(api, "carrot", { level: 3, branch });
    return shots(tick(f.game, 10), f.tower.id);
  };
  const sniper = run("a"),
    rapid = run("b");
  check(rapid.length > sniper.length, "Rapid-fire branch is not faster");
  check(
    sniper[0].damage > rapid[0].damage,
    "Sniper branch has no per-shot advantage",
  );
});
test("berry poison branch leaves damage over time that the splash branch does not", () => {
  const run = (branch) => {
    const f = isolatedBattle(api, "berry", { level: 3, branch });
    tick(f.game, 0.1);
    return f.game.enemies[0].dotDps;
  };
  check(
    run("a") === 0 && run("b") > 0,
    "Berry branches have no distinct poison effect",
  );
});
test("bloom support increases neighboring tower output without stacking identical auras", () => {
  const fixture = isolatedBattle(api, "carrot", { padId: "p3" }),
    range = getTowerStats({ type: "bloom", level: 1, branch: null }).range,
    candidates = fixture.pads.filter(
      (p) =>
        p.id !== fixture.pad.id &&
        Math.hypot(p.x - fixture.pad.x, p.z - fixture.pad.z) <= range,
    );
  check(candidates.length >= 1, "Map cannot exercise support aura");
  const run = (count) => {
    const f = isolatedBattle(api, "carrot", { padId: "p3" });
    for (let i = 0; i < count; i++) {
      const p =
        i === 0
          ? candidates[0]
          : f.pads.find((p) => !f.game.towers.some((t) => t.padId === p.id));
      check(
        act(f.game, { type: "build", towerType: "bloom", padId: p.id }).ok,
        "Support placement failed",
      );
      if (i > 0) {
        const bs = f.game.towers.filter((t) => t.type === "bloom");
        bs[i].x = bs[0].x;
        bs[i].z = bs[0].z;
      }
    }
    return shots(tick(f.game, 30), f.tower.id).length;
  };
  const bare = run(0),
    one = run(1);
  check(one > bare, "Bloom did not increase actual firing");
  check(run(2) === one, "Identical bloom auras stacked");
});
const crowd = (type, branch) => {
  const f = isolatedBattle(api, type, { level: 3, branch });
  f.game.enemies = Array.from({ length: 6 }, (_, i) =>
    f.enemy("crowd-" + i, f.pad.route.distance + i * 0.15),
  );
  tick(f.game, 0.1);
  return f;
};
test("frost branches trade a stronger single-target slow for a group slow", () => {
  const a = crowd("frost", "a"),
    b = crowd("frost", "b"),
    slowed = (g) => g.enemies.filter((e) => e.slowUntil > g.time);
  check(
    slowed(b.game).length > slowed(a.game).length,
    "Group frost did not slow more targets",
  );
  check(
    Math.min(...slowed(a.game).map((e) => e.slowFactor)) <
      Math.min(...slowed(b.game).map((e) => e.slowFactor)),
    "Deep frost is not stronger",
  );
});
test("spark branches trade long chains for heavier hits with a stun", () => {
  const a = crowd("spark", "a"),
    b = crowd("spark", "b"),
    hit = (g) => g.enemies.filter((e) => e.hp < e.maxHp);
  check(
    hit(a.game).length > hit(b.game).length,
    "Long-chain branch has no additional targets",
  );
  check(
    b.game.enemies.some((e) => e.stunUntil > b.game.time),
    "Heavy branch did not stun",
  );
  check(
    Math.max(...hit(b.game).map((e) => e.maxHp - e.hp)) >
      Math.max(...hit(a.game).map((e) => e.maxHp - e.hp)),
    "Heavy branch has no damage advantage",
  );
});
test("honey branches trade spreading poison for stronger poison and a slow", () => {
  const a = crowd("honey", "a"),
    b = crowd("honey", "b"),
    poisoned = (g) => g.enemies.filter((e) => e.dotDps > 0);
  check(
    poisoned(a.game).length > poisoned(b.game).length,
    "Spread branch did not poison a group",
  );
  check(
    Math.max(...poisoned(b.game).map((e) => e.dotDps)) >
      Math.max(...poisoned(a.game).map((e) => e.dotDps)),
    "Concentrated poison is not stronger",
  );
  check(
    b.game.enemies.some((e) => e.slowUntil > b.game.time),
    "Concentrated poison did not slow",
  );
});
test("bloom branches trade actual wave income for a stronger firing-rate aura", () => {
  const income = (branch) => {
    const f = isolatedBattle(api, "bloom", { level: 3, branch });
    f.game.enemies = [];
    const before = f.game.candy;
    tick(f.game, 0.1);
    return f.game.candy - before;
  };
  check(
    income("a") > income("b"),
    "Economic branch did not award extra income",
  );
  const f = isolatedBattle(api, "carrot", { padId: "p3" }),
    range = getTowerStats({ type: "bloom", level: 3, branch: "a" }).range,
    p = f.pads.find(
      (p) =>
        p.id !== f.pad.id && Math.hypot(p.x - f.pad.x, p.z - f.pad.z) <= range,
    );
  check(p, "No nearby support pad");
  const firing = (branch) => {
    const f = isolatedBattle(api, "carrot", { padId: "p3" });
    check(
      act(f.game, { type: "build", towerType: "bloom", padId: p.id }).ok,
      "Bloom build failed",
    );
    const bloom = f.game.towers.find((t) => t.type === "bloom");
    act(f.game, { type: "upgrade", towerId: bloom.id });
    act(f.game, { type: "upgrade", towerId: bloom.id, branch });
    return shots(tick(f.game, 30), f.tower.id).length;
  };
  check(firing("b") > firing("a"), "Support branch did not increase firing");
});
test("all heroes attack ground units, while only ranged heroes attack flying units", () => {
  const damage = (hero, flying) => {
    const f = isolatedBattle({
      ...api,
      createGame: (o) => api.createGame({ ...o, hero }),
    });
    f.game.towers = [];
    const e = f.game.enemies[0];
    e.flying = flying;
    Object.assign(f.game.hero, { x: e.x, z: e.z, targetX: e.x, targetZ: e.z });
    tick(f.game, 3);
    return e.maxHp - e.hp;
  };
  for (const hero of ["momo", "pip", "bao"])
    check(damage(hero, false) > 0, "Hero does not attack ground: " + hero);
  check(
    damage("momo", true) > 0 && damage("pip", true) > 0,
    "Ranged hero cannot hit flying units",
  );
  check(damage("bao", true) === 0, "Melee hero hit flying unit");
});
test("bell repairs without exceeding the core limit and increases actual firing rate", () => {
  const run = (cast) => {
    const f = isolatedBattle(api);
    f.game.lives = f.game.maxLives - 2;
    if (cast) {
      const mana = f.game.mana;
      check(
        act(f.game, { type: "spell", spell: "bell" }).ok,
        "Bell cast failed",
      );
      check(
        f.game.lives === f.game.maxLives,
        "Bell repair failed or exceeded limit",
      );
      check(
        f.game.mana < mana && f.game.spellCooldowns.bell > 0,
        "Bell did not pay resources",
      );
    }
    return shots(tick(f.game, 8), f.tower.id).length;
  };
  check(run(true) > run(false), "Bell buff did not increase firing");
});
test("victory stars reflect remaining core health and settle exactly once", () => {
  for (const [healthFraction, stars] of [
    [1, 3],
    [0.7, 2],
    [0.3, 1],
  ]) {
    const f = isolatedBattle(api);
    f.game.wave = f.game.totalWaves;
    f.game.enemies = [];
    f.game.lives = Math.ceil(f.game.maxLives * healthFraction);
    const es = updateGame(f.game, 0.1);
    check(
      f.game.phase === "won" && f.game.result.stars === stars,
      "Wrong health-based stars",
    );
    check(
      es.filter((e) => e.type === "win").length === 1,
      "Victory event not emitted once",
    );
    const before = JSON.stringify(f.game);
    updateGame(f.game, 0.5);
    check(JSON.stringify(f.game) === before, "Settled victory advanced");
  }
});
test("first, strong and near priorities select three different real targets", () => {
  for (const priority of ["first", "strong", "near"]) {
    const f = isolatedBattle(api, "carrot", { padId: "p3" });
    f.game.towers = [];
    f.game.enemies = [
      f.enemy("near", 17),
      f.enemy("strong", 10),
      f.enemy("first", 25),
    ];
    f.game.enemies[1].hp = 2000000;
    f.game.enemies[1].maxHp = 2000000;
    updateGame(f.game, 0.05);
    f.game.towers = [f.tower];
    check(
      act(f.game, { type: "priority", towerId: f.tower.id, priority }).ok,
      "Priority command failed",
    );
    const shot = updateGame(f.game, 0.05).find(
      (e) => e.type === "shot" && e.sourceId === f.tower.id,
    );
    check(
      shot && shot.targetId === priority,
      "Priority did not select " + priority,
    );
  }
});
