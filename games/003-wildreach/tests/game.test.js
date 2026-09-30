import test from "node:test";
import assert from "node:assert/strict";
import {
  createGame,
  stepGame,
  command,
  serializeGame,
  restoreGame,
  getObjective,
} from "../src/game.js";
import {
  WORLD,
  SPAWN,
  heightAt,
  LOCATIONS,
  SOLIDS,
  RECIPES,
  WEAPONS,
  ARMORS,
} from "../src/data.js";

const FRAME = 1 / 60;

function advance(state, seconds, input = {}) {
  const events = [];
  const frames = Math.ceil(seconds / FRAME);
  for (let frame = 0; frame < frames; frame++) {
    events.push(
      ...stepGame(
        state,
        typeof input === "function" ? input(state, frame) : input,
        FRAME,
      ),
    );
  }
  return events;
}

function place(state, x, z, elevation = 0) {
  Object.assign(state.player, {
    x,
    y: heightAt(x, z) + elevation,
    z,
    vx: 0,
    vy: 0,
    vz: 0,
    motion: elevation ? "air" : "ground",
  });
}

function isolated() {
  const state = createGame();
  state.enemies = [];
  return state;
}

function location(id) {
  const value = LOCATIONS.find((item) => item.id === id);
  assert.ok(value, `The authored world includes ${id}`);
  return value;
}

function finitePlayer(state) {
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
    assert.ok(Number.isFinite(state.player[key]), `${key} remains finite`);
  }
  assert.ok(state.player.health >= 0);
  assert.ok(state.player.health <= state.player.maxHealth);
  assert.ok(state.player.stamina >= 0);
  assert.ok(state.player.stamina <= state.player.maxStamina);
}

function encounter(type = "slime", separation = 2) {
  const state = createGame();
  const enemy = state.enemies.find((item) => item.type === type);
  state.enemies = [enemy];
  Object.assign(enemy, {
    x: SPAWN.x,
    z: SPAWN.z + separation,
    y: heightAt(SPAWN.x, SPAWN.z + separation),
    homeX: SPAWN.x,
    homeZ: SPAWN.z + separation,
  });
  state.player.yaw = 0;
  return { state, enemy };
}

test("a new adventure starts healthy and owns its mutable world state", () => {
  const first = createGame();
  const second = createGame();
  assert.equal(first.player.x, SPAWN.x);
  assert.equal(first.player.z, SPAWN.z);
  assert.equal(first.player.health, first.player.maxHealth);
  assert.equal(first.player.stamina, first.player.maxStamina);
  assert.equal(first.dead, false);
  assert.equal(first.victory, false);
  first.inventory.apple = 999;
  first.progress.beacons.push("wind");
  first.weapons.sword.durability = 0;
  first.objects[0].x += 20;
  assert.notEqual(second.inventory.apple, 999);
  assert.deepEqual(second.progress.beacons, []);
  assert.ok(second.weapons.sword.durability > 0);
  assert.notEqual(first.objects[0].x, second.objects[0].x);
  finitePlayer(second);
});

test("walking moves through the world while sprinting spends stamina", () => {
  const walking = isolated();
  const sprinting = isolated();
  const start = walking.player.z;
  advance(walking, 1, { moveZ: 1 });
  advance(sprinting, 1, { moveZ: 1, sprint: true });
  assert.ok(walking.player.z > start + 1);
  assert.ok(sprinting.player.z > walking.player.z);
  assert.ok(sprinting.player.stamina < walking.player.stamina);
  const spent = sprinting.player.stamina;
  advance(sprinting, 4);
  assert.ok(sprinting.player.stamina > spent);
  finitePlayer(sprinting);
});

test("jumping leaves the ground, gliding spends stamina, and landing restores control", () => {
  const state = isolated();
  const ground = state.player.y;
  command(state, "jump");
  advance(state, 0.2);
  assert.ok(state.player.y > ground);
  assert.equal(state.player.motion, "air");
  // Begin a ledge descent to exercise a full flight and eventual landing.
  place(state, state.player.x, state.player.z, 10);
  command(state, "jump");
  assert.equal(state.player.motion, "glide");
  const stamina = state.player.stamina;
  advance(state, 0.2);
  assert.ok(state.player.stamina < stamina);
  advance(state, 15);
  assert.equal(state.player.motion, "ground");
  assert.ok(
    Math.abs(state.player.y - heightAt(state.player.x, state.player.z)) < 0.05,
  );
  finitePlayer(state);
});

test("unknown commands cannot change inventory or grant progression", () => {
  const state = createGame();
  const before = structuredClone({
    inventory: state.inventory,
    progress: state.progress,
  });
  command(state, "inventCoins", { id: "coin", amount: 1e9 });
  assert.deepEqual(
    { inventory: state.inventory, progress: state.progress },
    before,
  );
});

test("diagonal movement is normalized instead of giving a speed advantage", () => {
  const straight = isolated();
  const diagonal = isolated();
  advance(straight, 0.5, { moveX: 1 });
  advance(diagonal, 0.5, { moveX: 1, moveZ: 1 });
  const distance = (state) =>
    Math.hypot(state.player.x - SPAWN.x, state.player.z - SPAWN.z);
  assert.ok(Math.abs(distance(straight) - distance(diagonal)) < 0.08);
});

test("food heals within the health limit and cannot be consumed twice from one item", () => {
  const state = createGame();
  state.player.health = state.player.maxHealth - 1;
  state.inventory.apple = 1;
  command(state, "eat", { id: "apple" });
  assert.equal(state.inventory.apple, 0);
  assert.equal(state.player.health, state.player.maxHealth);
  state.player.health -= 1;
  const health = state.player.health;
  command(state, "eat", { id: "apple" });
  assert.equal(state.inventory.apple, 0);
  assert.equal(state.player.health, health);
  command(state, "eat", { id: "not-food" });
  assert.equal(state.player.health, health);
  assert.equal(Object.hasOwn(state.inventory, "not-food"), false);
});

test("equipment changes require owning the requested weapon and armor", () => {
  const state = createGame();
  const weapon = state.player.weapon;
  const armor = state.player.armor;
  command(state, "equipWeapon", { id: "axe" });
  command(state, "equipArmor", { id: "missing-armor" });
  assert.equal(state.player.weapon, weapon);
  assert.equal(state.player.armor, armor);
  state.weapons.axe.owned = true;
  command(state, "equipWeapon", { id: "axe" });
  assert.equal(state.player.weapon, "axe");
});

test("the active rune cycles through four distinct abilities and wraps around", () => {
  const state = createGame();
  const original = state.player.rune;
  const seen = new Set([original]);
  for (let index = 0; index < 3; index++) {
    command(state, "cycleRune");
    seen.add(state.player.rune);
  }
  assert.equal(seen.size, 4);
  command(state, "cycleRune");
  assert.equal(state.player.rune, original);
});

test("saving produces a JSON round-trip without sharing mutable inventory", () => {
  const state = createGame();
  state.inventory.wood = 6;
  state.inventory.coin = 27;
  state.player.health = state.player.maxHealth - 1;
  state.progress.talked = true;
  const saved = serializeGame(state);
  const restored = restoreGame(JSON.parse(JSON.stringify(saved)));
  assert.equal(restored.inventory.wood, 6);
  assert.equal(restored.inventory.coin, 27);
  assert.equal(restored.player.health, state.player.health);
  assert.equal(restored.progress.talked, true);
  restored.inventory.wood = 100;
  assert.equal(state.inventory.wood, 6);
  assert.equal(saved.inventory.wood, 6);
  finitePlayer(restored);
});

test("malformed and unsupported saves recover to a playable adventure", () => {
  for (const value of [
    null,
    undefined,
    false,
    "invalid",
    3,
    [],
    { version: 999 },
  ]) {
    const restored = restoreGame(value);
    finitePlayer(restored);
    assert.equal(restored.dead, false);
    assert.equal(restored.player.x, SPAWN.x);
    assert.equal(restored.player.z, SPAWN.z);
  }
});

test("gathering and treasure rewards are collected only once", () => {
  const state = isolated();
  const pickup = state.pickups.find((item) => item.type === "apple");
  state.pickups = [pickup];
  place(state, pickup.x, pickup.z);
  const apples = state.inventory.apple;
  command(state, "interact");
  assert.equal(pickup.active, false);
  assert.ok(state.inventory.apple > apples);
  const gathered = structuredClone(state.inventory);
  command(state, "interact");
  assert.deepEqual(state.inventory, gathered);

  const chest = state.chests[0];
  state.chests = [chest];
  place(state, chest.x, chest.z);
  const coins = state.inventory.coin;
  command(state, "interact");
  assert.equal(chest.open, true);
  assert.equal(state.inventory.coin, coins + chest.reward.coin);
  const reward = structuredClone(state.inventory);
  command(state, "interact");
  assert.deepEqual(state.inventory, reward);
});

test("the courier accepts three wood once and grants useful cold-weather equipment", () => {
  const state = isolated();
  state.pickups = [];
  const npc = LOCATIONS.find((item) => item.type === "npc");
  place(state, npc.x, npc.z);
  state.inventory.wood = 2;
  command(state, "interact");
  assert.equal(state.progress.talked, true);
  assert.equal(state.progress.delivery, false);
  assert.equal(state.inventory.wood, 2);
  state.inventory.wood = 3;
  const coins = state.inventory.coin;
  command(state, "interact");
  assert.equal(state.progress.delivery, true);
  assert.equal(state.inventory.wood, 0);
  assert.ok(state.inventory.coin > coins);
  assert.ok(state.armors.some((id) => ARMORS[id].warmth > 0));
  const after = state.inventory.coin;
  command(state, "interact");
  assert.equal(state.inventory.coin, after);
});

test("cooking needs a nearby station and consumes each ingredient atomically", () => {
  const state = isolated();
  const recipe = RECIPES.meal;
  for (const [id, count] of Object.entries(recipe.ingredients))
    state.inventory[id] = count;
  const before = structuredClone(state.inventory);
  place(state, 0, 60);
  command(state, "cook", { id: "meal" });
  assert.deepEqual(state.inventory, before);
  const station = LOCATIONS.find((item) => item.type === "cook");
  place(state, station.x, station.z);
  command(state, "cook", { id: "meal" });
  assert.equal(state.inventory.meal, before.meal + 1);
  for (const id of Object.keys(recipe.ingredients))
    assert.equal(state.inventory[id], 0);
  const once = structuredClone(state.inventory);
  command(state, "cook", { id: "meal" });
  assert.deepEqual(state.inventory, once);
});

test("warm and stamina meals apply their advertised protective buffs", () => {
  const state = createGame();
  state.inventory.warmMeal = 1;
  state.inventory.staminaMeal = 1;
  state.player.stamina = 0;
  command(state, "eat", { id: "warmMeal" });
  assert.equal(state.player.buffs.warmth, RECIPES.warmMeal.effect.warmth);
  command(state, "eat", { id: "staminaMeal" });
  assert.equal(state.player.stamina, state.player.maxStamina);
  assert.equal(
    state.player.buffs.stamina,
    RECIPES.staminaMeal.effect.staminaBuff,
  );
});

test("shop purchases require proximity and payment, and armor cannot be bought twice", () => {
  const state = isolated();
  const shop = LOCATIONS.find((item) => item.type === "shop");
  state.inventory.coin = 100;
  place(state, 0, 60);
  command(state, "buy", { id: "cloak" });
  assert.equal(state.inventory.coin, 100);
  assert.equal(state.armors.includes("cloak"), false);
  place(state, shop.x, shop.z);
  state.inventory.coin = ARMORS.cloak.price - 1;
  command(state, "buy", { id: "cloak" });
  assert.equal(state.armors.includes("cloak"), false);
  state.inventory.coin = 100;
  command(state, "buy", { id: "cloak" });
  assert.equal(state.armors.includes("cloak"), true);
  assert.equal(state.inventory.coin, 100 - ARMORS.cloak.price);
  const coins = state.inventory.coin;
  command(state, "buy", { id: "cloak" });
  assert.equal(state.inventory.coin, coins);
  command(state, "equipArmor", { id: "cloak" });
  assert.equal(state.player.armor, "cloak");
});

test("weapon repairs restore durability for a cost and do not charge healthy equipment", () => {
  const state = isolated();
  const shop = LOCATIONS.find((item) => item.type === "shop");
  place(state, shop.x, shop.z);
  state.weapons.sword.durability = 0;
  state.inventory.coin = 0;
  command(state, "repair", { id: "sword" });
  assert.equal(state.weapons.sword.durability, 0);
  state.inventory.coin = 30;
  command(state, "repair", { id: "sword" });
  assert.equal(state.weapons.sword.durability, WEAPONS.sword.durability);
  assert.ok(state.inventory.coin < 30);
  const coins = state.inventory.coin;
  command(state, "repair", { id: "sword" });
  assert.equal(state.inventory.coin, coins);
});

test("permanent upgrades consume earned spirits and refill the upgraded attribute", () => {
  const state = isolated();
  const maximum = state.player.maxHealth;
  command(state, "upgrade", { id: "health" });
  assert.equal(state.player.maxHealth, maximum);
  state.inventory.spirit = 2;
  command(state, "upgrade", { id: "health" });
  assert.equal(state.inventory.spirit, 0);
  assert.ok(state.player.maxHealth > maximum);
  assert.equal(state.player.health, state.player.maxHealth);
  const upgraded = state.player.maxHealth;
  command(state, "upgrade", { id: "health" });
  assert.equal(state.player.maxHealth, upgraded);
});

test("tower synchronization requires reaching the roof and grants one travel unlock", () => {
  const state = isolated();
  state.pickups = [];
  const tower = location("tower-meadow");
  const solid = SOLIDS.find((item) => item.id === tower.id);
  place(state, tower.x + 2.5, tower.z);
  command(state, "interact");
  assert.equal(state.progress.towers.includes(tower.id), false);
  place(state, tower.x, tower.z, solid.height);
  command(state, "interact");
  assert.equal(state.progress.towers.includes(tower.id), true);
  const spirits = state.inventory.spirit;
  command(state, "interact");
  assert.equal(state.inventory.spirit, spirits);
  assert.equal(state.progress.towers.filter((id) => id === tower.id).length, 1);
});

test("the ember puzzle spends two wood and beacon rewards cannot repeat", () => {
  const state = isolated();
  state.pickups = [];
  place(state, 55, -29);
  state.inventory.wood = 1;
  command(state, "interact");
  assert.equal(state.puzzles.ember, false);
  assert.equal(state.inventory.wood, 1);
  state.inventory.wood = 2;
  command(state, "interact");
  assert.equal(state.puzzles.ember, true);
  assert.equal(state.inventory.wood, 0);
  const beacon = location("ember");
  place(state, beacon.x, beacon.z);
  command(state, "interact");
  assert.deepEqual(state.progress.beacons, ["ember"]);
  const reward = structuredClone(state.inventory);
  command(state, "interact");
  assert.deepEqual(state.inventory, reward);
});

test("the frost puzzle responds to an aimed arrow but not a shot facing away", () => {
  const state = isolated();
  state.pickups = [];
  place(state, -59, -57);
  state.player.yaw = 0;
  const arrows = state.inventory.arrow;
  command(state, "bow");
  assert.equal(state.puzzles.frost, false);
  assert.equal(state.inventory.arrow, arrows - 1);
  advance(state, 0.6);
  state.player.yaw = Math.PI;
  command(state, "bow");
  assert.equal(state.puzzles.frost, true);
  const beacon = location("frost");
  place(state, beacon.x, beacon.z);
  command(state, "interact");
  assert.equal(state.progress.beacons.includes("frost"), true);
});

test("the ice rune is an independent way to solve the frost puzzle", () => {
  const state = isolated();
  place(state, -59, -57);
  command(state, "equipRune", { id: "ice" });
  command(state, "rune");
  assert.equal(state.puzzles.frost, true);
  assert.ok(state.objects.some((item) => item.type === "ice"));
  assert.ok(state.player.runeCooldown > 0);
  const objects = state.objects.length;
  command(state, "rune");
  assert.equal(state.objects.length, objects);
});

test("inherited object keys are never treated as valid items or recipes", () => {
  const state = isolated();
  state.inventory.coin = 100;
  const shop = LOCATIONS.find((item) => item.type === "shop");
  const cook = LOCATIONS.find((item) => item.type === "cook");
  const before = structuredClone(state.inventory);
  const hadOwned = Object.hasOwn(Object.prototype, "owned");
  const hadDurability = Object.hasOwn(Object.prototype, "durability");
  try {
    for (const id of ["__proto__", "constructor", "toString"]) {
      place(state, shop.x, shop.z);
      command(state, "buy", { id });
      command(state, "eat", { id });
      place(state, cook.x, cook.z);
      command(state, "cook", { id });
      command(state, "equipWeapon", { id });
      command(state, "equipArmor", { id });
    }
    assert.deepEqual(state.inventory, before);
    assert.equal(Object.hasOwn(Object.prototype, "owned"), hadOwned);
    assert.equal(Object.hasOwn(Object.prototype, "durability"), hadDurability);
  } finally {
    // Keep a regression from contaminating other tests in the same Node process.
    if (!hadOwned) delete Object.prototype.owned;
    if (!hadDurability) delete Object.prototype.durability;
  }
});

test("remote or undiscovered fast-travel destinations cannot be used", () => {
  const state = isolated();
  const tower = location("tower-meadow");
  const before = { x: state.player.x, z: state.player.z };
  command(state, "fastTravel", { id: tower.id });
  assert.deepEqual({ x: state.player.x, z: state.player.z }, before);
  command(state, "fastTravel", { id: "not-a-place" });
  assert.deepEqual({ x: state.player.x, z: state.player.z }, before);
  state.progress.towers.push(tower.id);
  command(state, "fastTravel", { id: tower.id });
  assert.ok(Math.hypot(state.player.x - tower.x, state.player.z - tower.z) < 7);
  assert.equal(state.player.motion, "ground");
  finitePlayer(state);
});

test("horse riding increases travel speed and dismounting keeps hero and horse separate", () => {
  const riding = isolated();
  riding.pickups = [];
  place(riding, riding.horse.x, riding.horse.z);
  command(riding, "interact");
  assert.equal(riding.player.mounted, true);
  assert.equal(riding.player.motion, "ride");
  const start = riding.player.z;
  advance(riding, 1, { moveZ: 1 });
  assert.ok(riding.player.z > start + 5);
  assert.ok(Math.abs(riding.player.x - riding.horse.x) < 0.1);
  assert.ok(Math.abs(riding.player.z - riding.horse.z) < 0.1);
  command(riding, "dismount");
  assert.equal(riding.player.mounted, false);
  assert.equal(riding.player.motion, "ground");
  assert.ok(
    Math.hypot(
      riding.player.x - riding.horse.x,
      riding.player.z - riding.horse.z,
    ) > 1,
  );
});

test("climbing reaches the tower roof and rain makes the ascent cost more stamina", () => {
  const clear = isolated();
  const rainy = isolated();
  for (const state of [clear, rainy]) place(state, -21, 27);
  rainy.elapsed = 171;
  advance(clear, 1, { moveZ: -1, climb: true });
  advance(rainy, 1, { moveZ: -1, climb: true });
  assert.equal(clear.player.motion, "climb");
  assert.equal(rainy.weather, "rain");
  assert.ok(rainy.player.stamina < clear.player.stamina);
  advance(clear, 2, { moveZ: -1, climb: true });
  const tower = SOLIDS.find((item) => item.id === "tower-meadow");
  assert.equal(clear.player.motion, "ground");
  assert.ok(
    Math.abs(clear.player.y - heightAt(tower.x, tower.z) - tower.height) < 0.05,
  );
  finitePlayer(clear);
});

test("deep water triggers swimming and exhausted swimming damages the player", () => {
  const state = isolated();
  place(state, 28, 8);
  const health = state.player.health;
  state.player.stamina = 2;
  advance(state, 1, { moveX: 1 });
  assert.equal(state.player.motion, "swim");
  assert.ok(state.player.x > 28);
  assert.equal(state.player.stamina, 0);
  assert.ok(state.player.health < health);
  assert.ok(Math.abs(state.player.y - WORLD.water) < 1);
  finitePlayer(state);
});

test("the magnet carries the metal block and only releasing it on the plate solves wind", () => {
  const state = isolated();
  state.pickups = [];
  place(state, -47, 3);
  state.player.yaw = Math.PI;
  command(state, "equipRune", { id: "magnet" });
  command(state, "rune");
  assert.equal(state.objects[0].held, true);
  place(state, -51, -5.5);
  advance(state, 1.5);
  assert.equal(state.puzzles.wind, false);
  assert.ok(Math.hypot(state.objects[0].x + 51, state.objects[0].z + 9) < 0.1);
  command(state, "rune");
  advance(state, FRAME);
  assert.equal(state.objects[0].held, false);
  assert.equal(state.puzzles.wind, true);
  const beacon = location("wind");
  place(state, beacon.x, beacon.z);
  command(state, "interact");
  assert.equal(state.progress.beacons.includes("wind"), true);
});

test("sword hits require facing, spend stamina and durability, and respect attack cooldown", () => {
  const { state, enemy } = encounter("raider");
  const originalHp = enemy.hp;
  const durability = state.weapons.sword.durability;
  state.player.yaw = Math.PI;
  command(state, "attack");
  assert.equal(enemy.hp, originalHp);
  assert.equal(state.weapons.sword.durability, durability);
  advance(state, 0.9);
  state.player.yaw = 0;
  command(state, "attack");
  assert.ok(enemy.hp < originalHp);
  assert.equal(state.weapons.sword.durability, durability - 1);
  assert.ok(state.player.stamina < state.player.maxStamina);
  const hp = enemy.hp;
  command(state, "attack");
  assert.equal(enemy.hp, hp);
});

test("enemy AI approaches, telegraphs attacks, and damages an idle adventurer", () => {
  const { state, enemy } = encounter("raider", 9);
  const start = Math.hypot(enemy.x - state.player.x, enemy.z - state.player.z);
  advance(state, 1);
  assert.ok(
    Math.hypot(enemy.x - state.player.x, enemy.z - state.player.z) < start,
  );
  let sawWindup = false;
  advance(state, 4, () => {
    if (enemy.windup > 0) sawWindup = true;
    return {};
  });
  assert.equal(sawWindup, true);
  assert.ok(state.player.health < state.player.maxHealth);
});

test("holding a facing shield reduces incoming damage and spends stamina", () => {
  const exposed = encounter("raider");
  const blocking = encounter("raider");
  advance(exposed.state, 2);
  advance(blocking.state, 2, { block: true, aimYaw: 0 });
  assert.ok(exposed.state.player.health < exposed.state.player.maxHealth);
  assert.ok(blocking.state.player.health > exposed.state.player.health);
  assert.ok(blocking.state.player.stamina < blocking.state.player.maxStamina);
});

test("dodging consumes stamina and grants a brief damage-avoidance window", () => {
  const state = isolated();
  const stamina = state.player.stamina;
  command(state, "dodge");
  assert.ok(state.player.invulnerable > 0);
  assert.ok(state.player.stamina < stamina);
  const after = state.player.stamina;
  command(state, "dodge");
  assert.equal(state.player.stamina, after);
  const z = state.player.z;
  advance(state, 0.2);
  assert.ok(Math.abs(state.player.z - z) > 1);
  advance(state, 1);
  assert.equal(state.player.invulnerable, 0);
});

test("arrows consume ammunition, hit distant targets, and cannot fire with an empty quiver", () => {
  const { state, enemy } = encounter("raider", 13);
  const hp = enemy.hp;
  const arrows = state.inventory.arrow;
  command(state, "bow");
  assert.equal(state.inventory.arrow, arrows - 1);
  assert.equal(
    state.projectiles.filter((item) => item.type === "arrow").length,
    1,
  );
  advance(state, 0.7);
  assert.ok(enemy.hp < hp);
  state.inventory.arrow = 0;
  const durability = state.weapons.bow.durability;
  command(state, "bow");
  assert.equal(state.inventory.arrow, 0);
  assert.equal(state.weapons.bow.durability, durability);
});

test("remote bombs defeat nearby enemies and award loot once", () => {
  const { state, enemy } = encounter();
  const coins = state.inventory.coin;
  command(state, "rune");
  assert.ok(state.projectiles.some((item) => item.type === "bomb"));
  command(state, "rune");
  assert.equal(enemy.dead, true);
  assert.equal(state.progress.kills, 1);
  assert.ok(state.inventory.coin > coins);
  const reward = state.inventory.coin;
  command(state, "rune");
  assert.equal(state.inventory.coin, reward);
  advance(state, 1);
  assert.equal(state.projectiles.length, 0);
});

test("stasis holds enemies still, stores hits, and releases their accumulated damage", () => {
  const { state, enemy } = encounter("raider");
  command(state, "equipRune", { id: "stasis" });
  command(state, "rune");
  assert.ok(enemy.frozen > 0);
  const before = { x: enemy.x, z: enemy.z, hp: enemy.hp };
  command(state, "attack");
  assert.equal(enemy.hp, before.hp);
  assert.ok(enemy.storedDamage > 0);
  advance(state, 2);
  assert.equal(enemy.x, before.x);
  assert.equal(enemy.z, before.z);
  advance(state, 4.1);
  assert.ok(enemy.hp < before.hp);
  assert.equal(enemy.storedDamage, 0);
});

test("the guardian stays sealed until all beacons and completing combat emits one victory", () => {
  const { state, enemy } = encounter("guardian", 4);
  state.player.invulnerable = 100;
  const hp = enemy.hp;
  command(state, "rune");
  command(state, "rune");
  advance(state, 4);
  assert.equal(enemy.hp, hp);
  assert.equal(enemy.motion, "dormant");
  state.progress.beacons = ["wind", "ember", "frost"];
  assert.match(getObjective(state).description, /守卫/);
  const events = [];
  for (let strike = 0; strike < 10 && !state.victory; strike++) {
    events.push(...command(state, "rune"));
    events.push(...command(state, "rune"));
    events.push(...advance(state, 3.6));
  }
  assert.equal(enemy.dead, true);
  assert.equal(state.victory, true);
  assert.equal(state.progress.bossDefeated, true);
  assert.equal(events.filter((event) => event.type === "victory").length, 1);
  const coins = state.inventory.coin;
  command(state, "rune");
  command(state, "rune");
  assert.equal(state.inventory.coin, coins);
  assert.match(getObjective(state).progress, /完成/);
});

test("death pauses simulation and respawning preserves exploration at a safe checkpoint", () => {
  const { state } = encounter("raider");
  state.player.health = 1;
  state.inventory.coin = 20;
  state.progress.beacons = ["ember"];
  const events = advance(state, 3);
  assert.equal(state.dead, true);
  assert.equal(state.player.health, 0);
  assert.equal(events.filter((event) => event.type === "death").length, 1);
  const elapsed = state.elapsed;
  advance(state, 2, { moveZ: 1 });
  assert.equal(state.elapsed, elapsed);
  command(state, "respawn");
  assert.equal(state.dead, false);
  assert.equal(state.player.health, state.player.maxHealth);
  assert.equal(state.player.x, state.checkpoint.x);
  assert.equal(state.player.z, state.checkpoint.z);
  assert.deepEqual(state.progress.beacons, ["ember"]);
  assert.ok(state.inventory.coin < 20);
});

test("the day advances across midnight and deterministic weather reaches rain and storm", () => {
  const state = isolated();
  const weather = new Set();
  for (const elapsed of [0, 171, 256, 341]) {
    state.elapsed = elapsed;
    advance(state, FRAME);
    weather.add(state.weather);
    assert.ok(state.time >= 0 && state.time < 24);
  }
  assert.deepEqual(weather, new Set(["clear", "rain", "storm"]));
  state.elapsed = 224.95;
  advance(state, 0.1);
  assert.ok(state.time < 0.1, "the clock wraps at midnight");
});

test("cold and daytime heat cause damage that appropriate clothing prevents", () => {
  for (const [x, z, armor, elapsed] of [
    [-60, -60, "cloak", 0],
    [60, -25, "desert", 30],
  ]) {
    const exposed = isolated();
    const protectedState = isolated();
    for (const state of [exposed, protectedState]) {
      place(state, x, z);
      state.elapsed = elapsed;
    }
    protectedState.armors.push(armor);
    command(protectedState, "equipArmor", { id: armor });
    advance(exposed, 8.2);
    advance(protectedState, 8.2);
    assert.ok(exposed.player.health < exposed.player.maxHealth);
    assert.equal(protectedState.player.health, protectedState.player.maxHealth);
  }
});

test("warm meals protect against the cold until their buff expires", () => {
  const state = isolated();
  place(state, -60, -60);
  state.inventory.warmMeal = 1;
  command(state, "eat", { id: "warmMeal" });
  advance(state, 8.2);
  assert.equal(state.player.health, state.player.maxHealth);
  state.player.buffs.warmth = 0.1;
  advance(state, 4.2);
  assert.equal(state.player.buffs.warmth, 0);
  assert.ok(state.player.health < state.player.maxHealth);
});

test("invalid frame times do nothing and long frames cannot teleport across the world", () => {
  const state = isolated();
  const before = structuredClone(state.player);
  for (const dt of [0, -1, Infinity, NaN]) stepGame(state, { moveX: 1 }, dt);
  assert.deepEqual(state.player, before);
  stepGame(state, { moveX: 1 }, 10000);
  assert.ok(state.player.x > before.x);
  assert.ok(state.player.x - before.x < 2);
  stepGame(state, { moveX: NaN, moveZ: Infinity }, FRAME);
  finitePlayer(state);
});

test("map boundaries constrain movement and malformed movement cannot produce NaN", () => {
  const state = isolated();
  place(state, WORLD.half - 1, 50, 20);
  advance(state, 0.5, { moveX: 1, sprint: true });
  assert.ok(state.player.x <= WORLD.half);
  stepGame(state, { moveX: "bad", moveZ: {}, aimYaw: NaN }, FRAME);
  finitePlayer(state);
});

test("restoring progress keeps opened chests, collected resources and defeated enemies", () => {
  const { state, enemy } = encounter();
  command(state, "rune");
  command(state, "rune");
  assert.equal(enemy.dead, true);
  state.pickups[0].active = false;
  state.chests[0].open = true;
  state.progress.beacons = ["ember"];
  state.puzzles.ember = true;
  state.progress.towers = ["tower-meadow"];
  const restored = restoreGame(
    JSON.parse(JSON.stringify(serializeGame(state))),
  );
  assert.equal(
    restored.enemies.find((item) => item.id === enemy.id).dead,
    true,
  );
  assert.equal(restored.pickups[0].active, false);
  assert.equal(restored.chests[0].open, true);
  assert.deepEqual(restored.progress.beacons, ["ember"]);
  assert.deepEqual(restored.progress.towers, ["tower-meadow"]);
  assert.equal(restored.puzzles.ember, true);
  assert.equal(restored.projectiles.length, 0);
  assert.equal(restored.effects.length, 0);
});

test("save validation bounds corrupt numbers and whitelists progression and inventory", () => {
  const value = serializeGame(createGame());
  Object.assign(value.player, {
    x: 1e50,
    z: -1e50,
    y: Infinity,
    maxHealth: -100,
    maxStamina: NaN,
    health: 1e9,
    stamina: -1e9,
    weapon: "unknown",
    armor: "unknown",
    rune: "unknown",
  });
  value.inventory = { apple: -99, coin: Infinity, wood: 1e30, injected: 123 };
  value.progress.beacons = ["wind", "wind", "unknown"];
  value.progress.towers = ["tower-meadow", "tower-meadow", "camp", "unknown"];
  value.armors = ["cloak", "cloak", "unknown"];
  value.checkpoint = { x: 1e20, z: -1e20 };
  const restored = restoreGame(value);
  finitePlayer(restored);
  assert.ok(Math.abs(restored.player.x) <= WORLD.half);
  assert.ok(Math.abs(restored.player.z) <= WORLD.half);
  assert.equal(restored.inventory.apple, 0);
  assert.ok(Number.isFinite(restored.inventory.coin));
  assert.ok(restored.inventory.wood < 1e20);
  assert.equal(Object.hasOwn(restored.inventory, "injected"), false);
  assert.deepEqual(restored.progress.beacons, ["wind"]);
  assert.deepEqual(restored.progress.towers, ["tower-meadow"]);
  assert.deepEqual(restored.armors, ["traveler", "cloak"]);
  assert.deepEqual(restored.checkpoint, SPAWN);
});

test("malformed nested save fields cannot crash loading", () => {
  const restored = restoreGame(
    JSON.parse(
      JSON.stringify({
        version: 1,
        player: [],
        armors: [null, { toString: null }, [], 42, "cloak"],
        inventory: null,
        progress: { beacons: {}, towers: [null, {}], discovered: [false] },
        enemies: [null, {}, 7],
        pickups: {},
        chests: false,
        objects: [null, {}],
      }),
    ),
  );
  finitePlayer(restored);
  assert.deepEqual(restored.progress.beacons, []);
  assert.deepEqual(restored.armors, ["traveler", "cloak"]);
});
