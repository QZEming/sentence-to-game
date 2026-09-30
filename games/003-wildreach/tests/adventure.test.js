import test from "node:test";
import assert from "node:assert/strict";
import { createGame, stepGame, command, getObjective } from "../src/game.js";

test("a new adventurer can earn equipment, solve all beacons and defeat the guardian through player actions", () => {
  const state = createGame();
  const events = [];
  const frame = 1 / 60;

  function checkPlayer() {
    for (const key of [
      "x",
      "y",
      "z",
      "vx",
      "vy",
      "vz",
      "yaw",
      "health",
      "maxHealth",
      "stamina",
      "maxStamina",
    ]) {
      assert.ok(
        Number.isFinite(state.player[key]),
        `${key} must remain finite`,
      );
    }
    assert.equal(
      state.dead,
      false,
      "the route must be survivable without respawning",
    );
    assert.ok(state.player.health > 0);
    assert.ok(state.player.health <= state.player.maxHealth);
    assert.ok(state.player.stamina >= 0);
    assert.ok(state.player.stamina <= state.player.maxStamina);
  }

  function tick(input = {}) {
    events.push(...stepGame(state, input, frame));
  }

  function act(action, payload) {
    events.push(...command(state, action, payload));
  }

  function eatIfNeeded(threshold, foods) {
    if (state.player.health >= threshold) return;
    const id = foods.find((food) => state.inventory[food] > 0);
    if (id) act("eat", { id });
  }

  function walkTo(x, z) {
    for (let index = 0; index < 12000 && !state.dead; index++) {
      const player = state.player;
      const dx = x - player.x;
      const dz = z - player.z;
      const distance = Math.hypot(dx, dz);
      if (distance < 0.6) {
        checkPlayer();
        return;
      }
      eatIfNeeded(45, ["apple", "meat"]);
      tick({
        moveX: dx / distance,
        moveZ: dz / distance,
        climb: true,
        sprint: player.stamina > 20,
        aimYaw: Math.atan2(dx, dz),
      });
    }
    assert.fail(
      `Cannot reach (${x}, ${z}); player is at (${state.player.x}, ${state.player.z}), ` +
        `motion=${state.player.motion}, health=${state.player.health}`,
    );
  }

  function interactAt(x, z) {
    walkTo(x, z);
    act("interact");
    checkPlayer();
  }

  // Earn the winter cloak through the camp request and authored wood pickups.
  interactAt(-4, 40);
  assert.equal(state.progress.talked, true);
  interactAt(-15, 38);
  interactAt(-16, 34);
  interactAt(-12, 30);
  assert.equal(state.inventory.wood, 3);
  interactAt(-4, 40);
  assert.equal(state.progress.delivery, true);
  assert.equal(state.inventory.wood, 0);
  assert.ok(state.inventory.coin >= 30);
  assert.ok(state.armors.includes("cloak"));
  act("equipArmor", { id: "cloak" });
  assert.equal(state.player.armor, "cloak");

  // Climb the western plateau and carry the metal block onto its pressure plate.
  walkTo(-30, 31);
  walkTo(-42, 21);
  walkTo(-47, -1);
  act("equipRune", { id: "magnet" });
  act("rune");
  assert.ok(state.objects.find((object) => object.id === "wind-block").held);
  walkTo(-51, -5.5);
  for (let index = 0; index < 90; index++) tick({ aimYaw: Math.PI });
  act("rune");
  tick();
  assert.equal(state.puzzles.wind, true);
  interactAt(-48, -8);
  assert.deepEqual(state.progress.beacons, ["wind"]);
  assert.equal(state.inventory.spirit, 1);

  // Travel around the lake and use locally gathered wood at the ember altar.
  walkTo(-29, 18);
  walkTo(-10, 35);
  walkTo(34, 39);
  walkTo(51, 27);
  interactAt(51, -17);
  interactAt(48, -21);
  assert.equal(state.inventory.wood, 2);
  interactAt(54, -25);
  assert.equal(state.puzzles.ember, true);
  assert.equal(state.inventory.wood, 0);
  assert.deepEqual(state.progress.beacons, ["wind", "ember"]);
  assert.equal(state.inventory.spirit, 2);

  // Spend only quest rewards to prepare for the final fight.
  walkTo(50, 30);
  walkTo(30, 40);
  interactAt(7, 39);
  const earnedCoins = state.inventory.coin;
  act("buy", { id: "knight" });
  act("buy", { id: "axe" });
  act("equipWeapon", { id: "axe" });
  assert.ok(state.armors.includes("knight"));
  assert.equal(state.weapons.axe.owned, true);
  assert.equal(state.player.weapon, "axe");
  assert.ok(state.inventory.coin < earnedCoins);
  assert.ok(state.inventory.coin >= 0);

  // Keep the earned winter cloak on while climbing the northern snow slope.
  walkTo(49, 37);
  walkTo(65, 12);
  walkTo(64, -20);
  walkTo(35, -41);
  walkTo(4, -43);
  walkTo(-27, -38);
  walkTo(-53, -57);
  act("equipRune", { id: "ice" });
  act("rune");
  assert.equal(state.puzzles.frost, true);
  interactAt(-58, -62);
  assert.deepEqual(state.progress.beacons, ["wind", "ember", "frost"]);
  assert.equal(state.inventory.spirit, 3);
  assert.equal(state.progress.bossDefeated, false);
  assert.match(getObjective(state).description, /守卫/);

  walkTo(-27, -44);
  walkTo(-6, -60);
  walkTo(5, -59);
  act("equipRune", { id: "bomb" });
  act("equipArmor", { id: "knight" });
  const maximumHealth = state.player.maxHealth;
  act("upgrade", { id: "health" });
  assert.ok(state.player.maxHealth > maximumHealth);
  assert.equal(state.inventory.spirit, 1);
  assert.equal(state.player.armor, "knight");

  // Approach, attack, parry windups and remotely detonate bombs near the guardian.
  const guardian = state.enemies.find((enemy) => enemy.type === "guardian");
  assert.equal(guardian.dead, false);
  for (
    let index = 0;
    index < 40000 && !state.dead && !state.progress.bossDefeated;
    index++
  ) {
    const player = state.player;
    const dx = guardian.x - player.x;
    const dz = guardian.z - player.z;
    const distance = Math.hypot(dx, dz);
    const input = { aimYaw: Math.atan2(dx, dz) };
    if (distance > 3.5) {
      input.moveX = dx / distance;
      input.moveZ = dz / distance;
    }
    if (guardian.windup > 0 && guardian.windup < 0.18) {
      input.block = true;
    } else if (
      distance < 4.5 &&
      player.attackTimer <= 0 &&
      player.stamina > 20
    ) {
      input.attack = true;
    }
    const bomb = state.projectiles.find(
      (projectile) => projectile.type === "bomb",
    );
    if (
      (!bomb && player.runeCooldown === 0) ||
      (bomb && Math.hypot(bomb.x - guardian.x, bomb.z - guardian.z) < 5)
    ) {
      input.rune = true;
    }
    eatIfNeeded(70, ["apple", "meat", "mushroom"]);
    tick(input);
    if (index % 120 === 0) checkPlayer();
  }

  checkPlayer();
  assert.equal(guardian.dead, true);
  assert.equal(guardian.hp, 0);
  assert.equal(state.progress.bossDefeated, true);
  assert.equal(state.victory, true);
  assert.equal(events.filter((event) => event.type === "death").length, 0);
  assert.equal(events.filter((event) => event.type === "victory").length, 1);
  assert.match(getObjective(state).progress, /完成/);
  assert.ok(
    state.inventory.coin >= 100,
    "the guardian awards the completion reward",
  );
  for (const enemy of state.enemies) {
    for (const key of ["x", "y", "z", "hp", "maxHp"]) {
      assert.ok(
        Number.isFinite(enemy[key]),
        `${enemy.id}.${key} must remain finite`,
      );
    }
  }
  for (const amount of Object.values(state.inventory)) {
    assert.ok(Number.isFinite(amount) && amount >= 0);
  }
});
