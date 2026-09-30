import test from "node:test";
import * as engine from "../src/game.js";
import * as data from "../src/data.js";
const api = { ...data, ...engine };
function defineEngineChecks(test, api) {
  const {
    createGame,
    updateGame,
    act,
    getTowerStats,
    getLevel,
    LEVELS,
    TOWERS,
  } = api;
  const check = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const fresh = (options) =>
    createGame({
      levelId: "meadow",
      mode: "story",
      difficulty: "normal",
      hero: "momo",
      ...options,
    });
  const snapshot = (value) => JSON.stringify(value);
  const failWithoutChange = (game, action) => {
    const before = snapshot(game),
      result = act(game, action);
    check(
      result && result.ok === false,
      "Invalid action must reject: " + snapshot(action),
    );
    check(
      snapshot(game) === before,
      "Rejected action changed state: " + snapshot(action),
    );
  };
  const pad = (game, index = 0) =>
    getLevel(game.levelId || "meadow").pads[index];
  const build = (game, type = "carrot", index = 0) => {
    const result = act(game, {
      type: "build",
      towerType: type,
      padId: pad(game, index).id,
    });
    check(result.ok, "Build failed: " + result.message);
    return game.towers.find((t) => t.padId === pad(game, index).id);
  };
  const tick = (game, seconds) => {
    const events = [];
    for (let left = seconds; left > 1e-8; left -= 0.5)
      events.push(...updateGame(game, Math.min(0.5, left)));
    return events;
  };
  const firstEnemy = (options) => {
    const game = fresh(options);
    check(act(game, { type: "startWave" }).ok, "Wave cannot start");
    for (let step = 0; step < 80 && !game.enemies.length; step++)
      updateGame(game, 0.25);
    check(game.enemies.length > 0, "Wave did not spawn an enemy");
    return game;
  };
  test("new games have independent state and stable initial resources", () => {
    const a = fresh(),
      b = fresh();
    check(
      a.phase === "build" && a.candy === 260 && a.lives === 20,
      "Initial playable state is wrong",
    );
    build(a);
    check(
      b.towers.length === 0 && b.candy === 260,
      "Games share mutable state",
    );
  });
  test("all five chapters have finite connected route geometry and distinct build pads", () => {
    check(LEVELS.length === 5, "Five story chapters must exist");
    for (const level of LEVELS) {
      check(
        level.paths.length > 0 && level.pads.length >= 3,
        "Map has no playable route or pads",
      );
      check(
        new Set(level.pads.map((p) => p.id)).size === level.pads.length,
        "Duplicate pad ids",
      );
      for (const path of level.paths) {
        check(path.length >= 2, "Path needs endpoints");
        let length = 0;
        for (const p of path)
          check(
            Number.isFinite(p.x) && Number.isFinite(p.z),
            "Invalid route position",
          );
        for (let i = 1; i < path.length; i++)
          length += Math.hypot(
            path[i].x - path[i - 1].x,
            path[i].z - path[i - 1].z,
          );
        check(length > 10, "Path does not support a defense encounter");
      }
    }
  });
  test("building charges once and places the tower on the requested pad", () => {
    const game = fresh(),
      before = game.candy,
      p = pad(game),
      tower = build(game);
    check(
      game.candy === before - TOWERS.carrot.cost,
      "Incorrect purchase price",
    );
    check(
      tower.x === p.x && tower.z === p.z && tower.level === 1,
      "Incorrect tower placement",
    );
    failWithoutChange(game, { type: "build", towerType: "berry", padId: p.id });
  });
  test("insufficient funds, invalid pads and unknown tower types are atomic failures", () => {
    const game = fresh();
    game.candy = 0;
    failWithoutChange(game, {
      type: "build",
      towerType: "carrot",
      padId: pad(game).id,
    });
    failWithoutChange(game, {
      type: "build",
      towerType: "carrot",
      padId: "missing-pad",
    });
    failWithoutChange(game, {
      type: "build",
      towerType: "missing-tower",
      padId: pad(game).id,
    });
    failWithoutChange(game, { type: "unknown-command" });
  });
  test("upgrading consumes its quoted cost and raises effective damage output", () => {
    const game = fresh(),
      tower = build(game),
      before = getTowerStats(tower),
      money = game.candy;
    check(
      act(game, { type: "upgrade", towerId: tower.id }).ok,
      "Level two upgrade failed",
    );
    const after = getTowerStats(tower);
    check(
      game.candy === money - before.upgradeCost && tower.level === 2,
      "Upgrade accounting or level is wrong",
    );
    check(
      after.damage / after.interval > before.damage / before.interval,
      "Upgrade did not improve firepower",
    );
  });
  test("the final tier requires a valid branch and cannot exceed level three", () => {
    const game = fresh(),
      tower = build(game);
    game.candy = 10000;
    act(game, { type: "upgrade", towerId: tower.id });
    failWithoutChange(game, { type: "upgrade", towerId: tower.id });
    failWithoutChange(game, {
      type: "upgrade",
      towerId: tower.id,
      branch: "missing",
    });
    check(
      act(game, { type: "upgrade", towerId: tower.id, branch: "a" }).ok,
      "Branch upgrade failed",
    );
    check(tower.level === 3 && tower.branch === "a", "Branch was not retained");
    failWithoutChange(game, {
      type: "upgrade",
      towerId: tower.id,
      branch: "b",
    });
  });
  test("all six towers have two mechanically different advanced branches", () => {
    check(Object.keys(TOWERS).length === 6, "Six tower types must exist");
    for (const type of Object.keys(TOWERS)) {
      const a = { ...getTowerStats({ type, level: 3, branch: "a" }) };
      const b = { ...getTowerStats({ type, level: 3, branch: "b" }) };
      for (const key of [
        "name",
        "title",
        "description",
        "id",
        "branch",
        "label",
        "color",
      ]) {
        delete a[key];
        delete b[key];
      }
      check(
        snapshot(a) !== snapshot(b),
        type + " branches have identical mechanics",
      );
    }
  });
  test("selling refunds seventy percent of the entire invested cost exactly once", () => {
    const game = fresh(),
      tower = build(game);
    game.candy = 10000;
    act(game, { type: "upgrade", towerId: tower.id });
    act(game, { type: "upgrade", towerId: tower.id, branch: "b" });
    const before = game.candy;
    check(tower.spent === 235, "Fixture must include both paid upgrades");
    check(act(game, { type: "sell", towerId: tower.id }).ok, "Sale rejected");
    check(
      game.candy === before + 164,
      "Refund excluded upgrades or used wrong rounding",
    );
    check(!game.towers.some((t) => t.id === tower.id), "Sold tower remained");
    failWithoutChange(game, { type: "sell", towerId: tower.id });
    const gardenGame = fresh(),
      garden = build(gardenGame, "bloom");
    const gardenBalance = gardenGame.candy;
    check(
      act(gardenGame, { type: "sell", towerId: garden.id }).ok,
      "Garden sale rejected",
    );
    check(
      gardenGame.candy - gardenBalance === 63,
      "Seventy percent of 90 must refund exactly 63, without floating point loss",
    );
  });
  test("unknown tower identifiers cannot upgrade, sell or change targeting", () => {
    const game = fresh();
    for (const type of ["upgrade", "sell", "priority"])
      failWithoutChange(game, { type, towerId: "absent", priority: "strong" });
  });
  test("targeting priority accepts supported choices and rejects invalid values", () => {
    const game = fresh(),
      tower = build(game);
    for (const priority of ["first", "strong", "near"]) {
      check(
        act(game, { type: "priority", towerId: tower.id, priority }).ok,
        "Priority rejected",
      );
      check(tower.priority === priority, "Priority not applied");
    }
    failWithoutChange(game, {
      type: "priority",
      towerId: tower.id,
      priority: "last",
    });
  });
  test("starting a wave increments once and refuses duplicate starts", () => {
    const game = fresh();
    const result = act(game, { type: "startWave" });
    check(
      result.ok && game.phase === "wave" && game.wave === 1,
      "Wave start failed",
    );
    check(
      result.events.filter((e) => e.type === "waveStart").length === 1,
      "Wave start event missing or duplicated",
    );
    failWithoutChange(game, { type: "startWave" });
  });
  test("zero, negative and nonfinite elapsed time cannot advance the simulation", () => {
    const game = firstEnemy();
    for (const delta of [0, -1, NaN, Infinity]) {
      const before = snapshot(game);
      updateGame(game, delta);
      check(snapshot(game) === before, "Invalid delta advanced game: " + delta);
    }
  });
  test("auto-wave starts an idle build phase while manual mode remains idle", () => {
    const manual = fresh();
    tick(manual, 12);
    check(
      manual.phase === "build" && manual.wave === 0,
      "Manual mode started itself",
    );
    const auto = fresh();
    check(
      act(auto, { type: "autoWave", enabled: true }).ok,
      "Auto-wave rejected",
    );
    tick(auto, 12);
    check(auto.wave >= 1, "Auto-wave never started");
  });
  test("the selected hero moves toward an explicit rally point", () => {
    for (const hero of ["momo", "pip", "bao"]) {
      const game = fresh({ hero }),
        p = getLevel("meadow").paths[0][0];
      const before = Math.hypot(game.hero.x - p.x, game.hero.z - p.z);
      check(act(game, { type: "rally", x: p.x, z: p.z }).ok, "Rally rejected");
      act(game, { type: "startWave" });
      tick(game, 1);
      const after = Math.hypot(game.hero.x - p.x, game.hero.z - p.z);
      check(after < before, "Hero did not approach rally point: " + hero);
    }
  });
  test("difficulty increases enemy durability rather than only changing a label", () => {
    const easy = firstEnemy({ difficulty: "easy" }),
      hard = firstEnemy({ difficulty: "hard" });
    check(
      hard.enemies[0].maxHp > easy.enemies[0].maxHp,
      "Hard enemies are not tougher",
    );
  });
  test("a spell consumes mana and its cooldown prevents repeated casts", () => {
    const game = firstEnemy(),
      enemy = game.enemies[0],
      mana = game.mana;
    const action = { type: "spell", spell: "meteor", x: enemy.x, z: enemy.z };
    check(act(game, action).ok, "Meteor failed");
    check(
      game.mana < mana && game.spellCooldowns.meteor > 0,
      "Spell has no cost or cooldown",
    );
    failWithoutChange(game, action);
    failWithoutChange(game, { type: "spell", spell: "missing", x: 0, z: 0 });
  });
  test("insufficient mana refuses a spell without partial effects", () => {
    const game = firstEnemy();
    game.mana = 0;
    failWithoutChange(game, {
      type: "spell",
      spell: "meteor",
      x: game.enemies[0].x,
      z: game.enemies[0].z,
    });
  });
  test("frost reduces actual travel distance over the same elapsed time", () => {
    const frozen = firstEnemy(),
      normal = JSON.parse(snapshot(frozen)),
      id = frozen.enemies[0].id;
    const target = frozen.enemies[0],
      start = target.distance;
    check(
      act(frozen, { type: "spell", spell: "frost", x: target.x, z: target.z })
        .ok,
      "Frost failed",
    );
    tick(frozen, 1);
    tick(normal, 1);
    const slow = frozen.enemies.find((e) => e.id === id),
      fast = normal.enemies.find((e) => e.id === id);
    check(slow && fast, "Enemy disappeared before movement comparison");
    check(
      slow.distance - start < fast.distance - start,
      "Frost did not reduce travel",
    );
  });
  test("an undefended campaign ends in a bounded, final defeat", () => {
    const game = fresh();
    let frames = 0,
      lossEvents = 0;
    while (!["won", "lost"].includes(game.phase) && frames++ < 12000) {
      if (game.phase === "build") act(game, { type: "startWave" });
      lossEvents += updateGame(game, 0.5).filter(
        (e) => e.type === "lose",
      ).length;
    }
    check(
      game.phase === "lost" && game.lives === 0,
      "Unprotected core did not lose",
    );
    check(
      lossEvents === 1 && game.result && game.result.won === false,
      "Loss was not settled once",
    );
    const before = snapshot(game);
    tick(game, 10);
    check(snapshot(game) === before, "Finished simulation kept changing");
    for (const action of [
      { type: "startWave" },
      { type: "build", towerType: "carrot", padId: pad(game).id },
      { type: "rally", x: 0, z: 0 },
      { type: "spell", spell: "bell" },
    ])
      failWithoutChange(game, action);
  });
}
defineEngineChecks(test, api);
