import test from "node:test";
import assert from "node:assert/strict";
import {
  createMatch,
  stepMatch,
  command,
  raycast,
  hasLineOfSight,
  damageActor,
  findPath,
} from "../src/game.js";
import { MAPS, WEAPONS, floorAt, groundAt } from "../src/data.js";

const DT = 1 / 60;

function advance(state, seconds, input = {}) {
  const events = [];
  for (let elapsed = 0; elapsed < seconds - 1e-8; elapsed += DT) {
    events.push(
      ...stepMatch(
        state,
        typeof input === "function" ? input(state) : input,
        DT,
      ),
    );
  }
  return events;
}

function fixture(options = {}) {
  const state = createMatch({
    mode: "training",
    map: "harbor",
    seed: 641,
    ...options,
  });
  state.phase = "playing";
  state.countdown = 0;
  state.obstacles = [];
  state.pickups = [];
  const player = state.player;
  Object.assign(player, {
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    onGround: true,
    alive: true,
    invulnerable: 0,
    armor: 0,
  });
  for (const bot of state.bots) bot.alive = false;
  return state;
}

function target(state, overrides = {}) {
  const bot = state.bots.find((candidate) => candidate.team === 1);
  assert.ok(bot, "a match must provide an enemy fixture");
  Object.assign(bot, {
    alive: true,
    x: 0,
    y: 0,
    z: 6,
    yaw: Math.PI,
    vx: 0,
    vy: 0,
    vz: 0,
    onGround: true,
    height: 1.8,
    eyeHeight: 1.62,
    armor: 0,
    health: 100,
    maxHealth: 100,
    invulnerable: 0,
    ...overrides,
  });
  return bot;
}

function wall(overrides = {}) {
  return {
    id: "test-wall",
    x: 0,
    y: 0,
    z: 3,
    w: 8,
    d: 1,
    h: 4,
    type: "wall",
    hp: 0,
    health: 0,
    destroyed: false,
    ...overrides,
  };
}

test("match instances have independent inventories, geometry and deterministic seeds", () => {
  const a = createMatch({ seed: 617 });
  const b = createMatch({ seed: 617 });
  assert.deepEqual(a, b);
  a.player.ammo.rifle.mag = 0;
  a.obstacles[0].destroyed = true;
  assert.equal(b.player.ammo.rifle.mag, WEAPONS.rifle.magSize);
  assert.equal(b.obstacles[0].destroyed, false);
  assert.notEqual(MAPS.harbor.obstacles[0].destroyed, true);
});

test("countdown prevents premature movement and ammunition consumption", () => {
  const state = createMatch({ seed: 29 });
  const { x, z } = state.player;
  const mag = state.player.ammo.rifle.mag;
  advance(state, 1, { moveX: 1, fire: true });
  assert.equal(state.phase, "countdown");
  assert.equal(state.player.x, x);
  assert.equal(state.player.z, z);
  assert.equal(state.player.ammo.rifle.mag, mag);
  advance(state, 2.2);
  assert.equal(state.phase, "playing");
});

test("raycast distinguishes a head hit from a torso hit", () => {
  const state = fixture();
  const enemy = target(state);
  const head = raycast(
    state,
    { x: 0, y: 1.58, z: 0 },
    { x: 0, y: 0, z: 1 },
    100,
    { ignore: "player", team: 0 },
  );
  assert.equal(head.type, "actor");
  assert.equal(head.actor.id, enemy.id);
  assert.equal(head.headshot, true);
  const body = raycast(
    state,
    { x: 0, y: 0.9, z: 0 },
    { x: 0, y: 0, z: 1 },
    100,
    { ignore: "player", team: 0 },
  );
  assert.equal(body.type, "actor");
  assert.equal(body.headshot, false);
});

test("cover stops both bullets and line of sight, and destroyed cover opens the line", () => {
  const state = fixture();
  target(state);
  state.obstacles = [wall()];
  const from = { x: 0, y: 1.58, z: 0 };
  const to = { x: 0, y: 1.58, z: 6 };
  const direction = { x: 0, y: 0, z: 1 };
  assert.equal(hasLineOfSight(state, from, to), false);
  assert.equal(
    raycast(state, from, direction, 100, { ignore: "player", team: 0 }).type,
    "obstacle",
  );
  state.obstacles[0].destroyed = true;
  assert.equal(hasLineOfSight(state, from, to), true);
  assert.equal(
    raycast(state, from, direction, 100, { ignore: "player", team: 0 }).type,
    "actor",
  );
});

test("friendly actors are excluded from weapon rays and direct friendly damage", () => {
  const state = fixture({ mode: "team" });
  const friend = state.bots.find((bot) => bot.team === 0);
  assert.ok(friend);
  Object.assign(friend, {
    alive: true,
    x: 0,
    y: 0,
    z: 3,
    health: 100,
    armor: 0,
    invulnerable: 0,
  });
  const enemy = target(state);
  const hit = raycast(
    state,
    { x: 0, y: 0.9, z: 0 },
    { x: 0, y: 0, z: 1 },
    100,
    { ignore: "player", team: 0 },
  );
  assert.equal(hit.actor.id, enemy.id);
  damageActor(state, friend, 80, { attacker: "player", weapon: "rifle" });
  assert.equal(friend.health, 100);
});

test("spawn protection blocks damage; armor absorbs part rather than all of a hit", () => {
  const state = fixture();
  const enemy = target(state, { armor: 100, maxArmor: 100, invulnerable: 1 });
  damageActor(state, enemy, 40, { attacker: "player", weapon: "rifle" });
  assert.equal(enemy.health, 100);
  assert.equal(enemy.armor, 100);
  enemy.invulnerable = 0;
  damageActor(state, enemy, 40, { attacker: "player", weapon: "rifle" });
  assert.equal(enemy.health, 86);
  assert.equal(enemy.armor, 74);
});

test("death is idempotent and credits exactly one kill and team point", () => {
  const state = fixture({ mode: "team" });
  const enemy = target(state);
  const metadata = { attacker: "player", weapon: "sniper", headshot: true };
  const first = damageActor(state, enemy, 200, metadata);
  const second = damageActor(state, enemy, 200, metadata);
  assert.equal(enemy.alive, false);
  assert.equal(state.player.stats.kills, 1);
  assert.equal(state.player.stats.headshots, 1);
  assert.equal(state.score[0], 1);
  assert.equal(first.filter((event) => event.type === "kill").length, 1);
  assert.equal(second.filter((event) => event.type === "kill").length, 0);
});

test("reloading moves reserve ammunition only at completion and switching cancels it", () => {
  const state = fixture({ mode: "team" });
  state.bots = [];
  const ammo = state.player.ammo.rifle;
  ammo.mag = 2;
  ammo.reserve = 50;
  command(state, "reload");
  assert.ok(state.player.reloadTimer > 0);
  advance(state, 0.3);
  assert.equal(ammo.mag, 2);
  assert.equal(ammo.reserve, 50);
  command(state, "switchWeapon", { id: "smg" });
  assert.equal(state.player.reloadTimer, 0);
  advance(state, 4);
  assert.equal(ammo.mag, 2);
  assert.equal(ammo.reserve, 50);
  command(state, "switchWeapon", { id: "rifle" });
  advance(state, 0.5);
  command(state, "reload");
  advance(state, WEAPONS.rifle.reload + 0.2);
  assert.equal(ammo.mag, WEAPONS.rifle.magSize);
  assert.equal(ammo.mag + ammo.reserve, 52);
});

test("reload exhausts a small reserve without manufacturing rounds", () => {
  const state = fixture({ mode: "team" });
  state.bots = [];
  const ammo = state.player.ammo.rifle;
  ammo.mag = 1;
  ammo.reserve = 3;
  command(state, "reload");
  advance(state, WEAPONS.rifle.reload + 0.1);
  assert.deepEqual(ammo, { mag: 4, reserve: 0 });
});

test("automatic fire obeys cadence and reports one round per trigger event", () => {
  const state = fixture();
  state.bots = [];
  const before = state.player.ammo.rifle.mag;
  const events = advance(state, 0.7, { fire: true });
  const shots = events.filter(
    (event) => event.type === "shot" && event.actor === "player",
  );
  assert.ok(
    shots.length >= 3 &&
      shots.length <= Math.ceil(0.7 / WEAPONS.rifle.interval) + 1,
  );
  assert.equal(before - state.player.ammo.rifle.mag, shots.length);
  assert.equal(state.player.stats.shots, shots.length);
  assert.ok(
    shots.every((shot) => Number.isFinite(shot.to.x + shot.to.y + shot.to.z)),
  );
});

test("an aimed sniper headshot uses real weapon damage and kill statistics", () => {
  const state = fixture();
  const enemy = target(state, { z: 5 });
  state.bots = [enemy];
  command(state, "switchWeapon", { id: "sniper" });
  advance(state, 0.5);
  const events = advance(state, 0.04, {
    fire: true,
    aim: true,
    yaw: 0,
    pitch: Math.atan2(-0.04, 5),
  });
  assert.equal(enemy.alive, false);
  assert.equal(state.player.ammo.sniper.mag, WEAPONS.sniper.magSize - 1);
  assert.equal(state.player.stats.shots, 1);
  assert.equal(state.player.stats.hits, 1);
  assert.equal(state.player.stats.headshots, 1);
  assert.ok(events.some((event) => event.type === "kill" && event.headshot));
});

test("shotgun pellets consume one shell and accuracy counts a trigger once", () => {
  const state = fixture();
  const enemy = target(state, { z: 3, health: 1000, maxHealth: 1000 });
  state.bots = [enemy];
  command(state, "switchWeapon", { id: "shotgun" });
  advance(state, 0.5);
  advance(state, 0.04, {
    fire: true,
    aim: true,
    yaw: 0,
    pitch: Math.atan2(-0.6, 3),
  });
  assert.ok(enemy.health < 1000);
  assert.equal(state.player.ammo.shotgun.mag, WEAPONS.shotgun.magSize - 1);
  assert.equal(state.player.stats.shots, 1);
  assert.equal(state.player.stats.hits, 1);
});

test("destructible cover absorbs rounds until broken and then permits movement", () => {
  const state = fixture();
  state.bots = [];
  const crate = wall({
    id: "test-crate",
    type: "crate",
    hp: 40,
    health: 40,
    h: 3,
    w: 2,
  });
  state.obstacles = [crate];
  advance(state, 0.3, { fire: true, aim: true, yaw: 0 });
  assert.equal(crate.destroyed, true);
  advance(state, 1, { moveZ: 1 });
  assert.ok(state.player.z > 3.6);
  assert.ok(state.player.y < 0.1);
});

test("solid walls stop running actors without lifting them onto the roof", () => {
  const state = fixture();
  state.bots = [];
  state.obstacles = [wall({ z: 4, h: 3 })];
  advance(state, 3, { moveZ: 1, sprint: true });
  assert.ok(state.player.z < 3.51);
  assert.ok(state.player.y < 0.1);
  assert.ok(state.player.stamina < state.player.maxStamina);
});

test("a jump leaves the floor and gravity returns the player to it", () => {
  const state = fixture();
  state.bots = [];
  stepMatch(state, { jump: true }, DT);
  advance(state, 0.25);
  assert.ok(state.player.y > 0.2);
  assert.equal(state.player.onGround, false);
  advance(state, 2);
  assert.ok(Math.abs(state.player.y) < 0.05);
  assert.equal(state.player.onGround, true);
});

test("map floor sampling separates obstacle tops from reachable walking surfaces", () => {
  const map = MAPS.harbor;
  const obstacle = map.obstacles.find(
    (item) => item.h >= 2 && item.type !== "platform",
  );
  assert.ok(obstacle);
  const top = obstacle.y + obstacle.h;
  assert.ok(groundAt(map, obstacle.x, obstacle.z) >= top);
  assert.ok(floorAt(map, obstacle.x, obstacle.z, 0) < top);
  assert.ok(floorAt(map, obstacle.x, obstacle.z, top) >= top);
});

test("walking from a ramp foot climbs onto the platform continuously", () => {
  const state = createMatch({ mode: "training", map: "harbor", seed: 423 });
  state.phase = "playing";
  state.bots = [];
  state.pickups = [];
  Object.assign(state.player, { x: -17, y: 0, z: 14, onGround: true });
  let lastY = 0;
  let maxStep = 0;
  advance(state, 2, () => {
    maxStep = Math.max(maxStep, Math.abs(state.player.y - lastY));
    lastY = state.player.y;
    return { moveZ: -1 };
  });
  assert.ok(state.player.z < 6.5);
  assert.ok(Math.abs(state.player.y - 3) < 0.06);
  assert.ok(maxStep < 0.2, `unexpected vertical teleport of ${maxStep}`);
});

test("approaching the tall side of a ramp cannot teleport the actor upward", () => {
  const state = createMatch({ mode: "training", map: "harbor", seed: 424 });
  state.phase = "playing";
  state.bots = [];
  state.pickups = [];
  Object.assign(state.player, { x: -11, y: 0, z: 10, onGround: true });
  advance(state, 1, { moveX: -1 });
  assert.ok(state.player.y < 0.2);
  assert.ok(state.player.x > -13.1);
});

test("sliding consumes stamina, lowers the hitbox and respects cooldown", () => {
  const state = fixture();
  state.bots = [];
  advance(state, 0.25, { moveZ: 1, sprint: true });
  const stamina = state.player.stamina;
  stepMatch(state, { moveZ: 1, sprint: true, slide: true }, DT);
  assert.ok(state.player.slideTimer > 0);
  assert.ok(state.player.height < 1.3);
  assert.ok(state.player.stamina < stamina);
  const cooldown = state.player.slideCooldown;
  command(state, "slide");
  assert.equal(state.player.slideCooldown, cooldown);
  advance(state, 2);
  assert.equal(state.player.slideTimer, 0);
  assert.ok(state.player.height > 1.6);
});

test("crouching physically removes the standing head from a bullet line", () => {
  const state = fixture();
  state.bots = [];
  const origin = { x: 0, y: 1.58, z: -4 };
  const direction = { x: 0, y: 0, z: 1 };
  assert.equal(raycast(state, origin, direction, 8, { team: 1 }).type, "actor");
  advance(state, 0.05, { crouch: true });
  assert.equal(raycast(state, origin, direction, 8, { team: 1 }).type, "none");
  assert.equal(
    raycast(state, { ...origin, y: 0.9 }, direction, 8, { team: 1 }).type,
    "actor",
  );
});

test("a grenade blast respects cover and explodes only once", () => {
  const state = fixture();
  const enemy = target(state, { z: 3 });
  state.bots = [enemy];
  state.player.x = -4;
  state.obstacles = [wall({ z: 1.5, d: 0.4 })];
  command(state, "grenade");
  assert.equal(state.player.grenades, 1);
  assert.equal(state.grenades.length, 1);
  Object.assign(state.grenades[0], {
    x: 0,
    y: 1,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    fuse: 0.001,
  });
  const events = advance(state, 0.5);
  assert.equal(events.filter((event) => event.type === "explosion").length, 1);
  assert.equal(state.grenades.length, 0);
  assert.equal(enemy.health, 100);
});

test("unobstructed grenades damage enemies and their owner while protecting teammates", () => {
  const state = fixture({ mode: "team" });
  const enemy = target(state, { z: 3 });
  const friend = state.bots.find((bot) => bot.team === 0);
  Object.assign(friend, {
    alive: true,
    x: 1,
    y: 0,
    z: 1,
    health: 100,
    maxHealth: 100,
    armor: 0,
    invulnerable: 0,
  });
  state.bots = [enemy, friend];
  state.player.x = -3;
  command(state, "grenade");
  Object.assign(state.grenades[0], {
    x: 0,
    y: 1,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    fuse: 0.001,
  });
  advance(state, DT);
  assert.ok(enemy.health < 100);
  assert.ok(state.player.health < state.player.maxHealth);
  assert.equal(friend.health, 100);
});

test("a thrown grenade bounces off a wall instead of tunneling through it", () => {
  const state = fixture();
  state.bots = [];
  state.obstacles = [wall()];
  command(state, "grenade");
  let bounced = false;
  let farthest = 0;
  const events = advance(state, 2, () => {
    for (const grenade of state.grenades) {
      farthest = Math.max(farthest, grenade.z);
      bounced ||= grenade.vz < 0;
      assert.ok(grenade.y >= 0.09);
    }
    return {};
  });
  assert.equal(bounced, true);
  assert.ok(farthest < 2.6);
  assert.equal(events.filter((event) => event.type === "explosion").length, 1);
  assert.equal(state.grenades.length, 0);
});

test("rays hit a ramp slope and side at their rendered heights", () => {
  const state = createMatch({ mode: "training" });
  state.bots = [];
  const down = raycast(
    state,
    { x: -17, y: 6, z: 10 },
    { x: 0, y: -1, z: 0 },
    10,
    { actors: false },
  );
  assert.equal(down.type, "obstacle");
  assert.equal(down.obstacle.id, "h-ramp-west");
  assert.ok(Math.abs(down.point.y - 1.5) < 0.0001);
  const side = raycast(
    state,
    { x: -11, y: 1, z: 10 },
    { x: -1, y: 0, z: 0 },
    12,
    { actors: false },
  );
  assert.equal(side.obstacle.id, "h-ramp-west");
  assert.ok(Math.abs(side.point.x + 13) < 0.0001);
  const above = raycast(
    state,
    { x: -11, y: 1.7, z: 10 },
    { x: -1, y: 0, z: 0 },
    12,
    { actors: false },
  );
  assert.equal(above.type, "none");
});

test("melee has a cooldown and cannot pass through cover", () => {
  const state = fixture();
  const enemy = target(state, { z: 2 });
  state.bots = [enemy];
  state.obstacles = [wall({ z: 1, d: 0.3 })];
  command(state, "melee");
  assert.equal(enemy.health, 100);
  state.obstacles = [];
  command(state, "melee");
  assert.equal(enemy.health, 100);
  advance(state, 0.7);
  command(state, "melee");
  assert.equal(enemy.health, 35);
});

test("AI cannot shoot a player through an impassable wall", () => {
  const state = fixture({ mode: "team" });
  const enemy = target(state, { z: -8 });
  state.bots = [enemy];
  state.player.z = 8;
  state.obstacles = [wall({ z: 0, w: 100, h: 10 })];
  const events = advance(state, 3);
  assert.equal(state.player.health, state.player.maxHealth);
  assert.equal(
    events.filter((event) => event.type === "shot" && event.actor === enemy.id)
      .length,
    0,
  );
  assert.ok(enemy.z < -0.5);
});

test("navigation finds a usable ramp route onto the elevated harbor platform", () => {
  const state = createMatch({ mode: "training", seed: 778 });
  state.phase = "playing";
  state.bots = [];
  state.pickups = [];
  Object.assign(state.player, { x: -17, y: 0, z: 15 });
  const path = findPath(state, state.player, { x: -17, y: 3, z: 1 });
  assert.ok(path.length > 3);
  assert.ok(path.some((point) => point.y > 0.3 && point.y < 2.8));
  let index = 0;
  advance(state, 12, () => {
    while (
      index < path.length &&
      Math.hypot(
        state.player.x - path[index].x,
        state.player.z - path[index].z,
      ) < 0.35
    )
      index++;
    if (index >= path.length) return {};
    const next = path[index];
    const dx = next.x - state.player.x;
    const dz = next.z - state.player.z;
    const distance = Math.hypot(dx, dz);
    return { moveX: dx / distance, moveZ: dz / distance };
  });
  assert.equal(index, path.length);
  assert.ok(Math.abs(state.player.y - 3) < 0.06);
  assert.ok(state.player.z < 6.5);
});

test("health regenerates after the damage delay but armor does not regenerate", () => {
  const state = fixture({ mode: "team" });
  const enemy = target(state, { z: 20 });
  damageActor(state, state.player, 35, { attacker: enemy.id, weapon: "rifle" });
  state.bots = [];
  advance(state, 5.9);
  assert.equal(state.player.health, 65);
  advance(state, 7);
  assert.equal(state.player.health, state.player.maxHealth);
  assert.equal(state.player.armor, 0);
});

test("pickup cooldown and missing-resource checks prevent repeated farming", () => {
  const state = fixture();
  state.bots = [];
  state.player.health = 40;
  state.player.lastDamaged = 0;
  state.pickups = [
    {
      id: "test-medkit",
      type: "health",
      x: 0,
      y: 0,
      z: 0,
      active: true,
      timer: 0,
      respawn: 2,
    },
  ];
  advance(state, 0.1);
  assert.equal(state.player.health, 85);
  assert.equal(state.pickups[0].active, false);
  advance(state, 1);
  assert.equal(state.player.health, 85);
  advance(state, 1.2);
  assert.equal(state.player.health, 100);
  advance(state, 2.2);
  assert.equal(state.pickups[0].active, true);
});

test("frame stalls are clamped instead of teleporting actors across the arena", () => {
  const state = fixture();
  state.bots = [];
  stepMatch(state, { moveX: 1, sprint: true }, 20);
  assert.ok(state.elapsed <= 0.120001);
  assert.ok(state.player.x < 1.2);
  assert.ok(Number.isFinite(state.player.y));
});

test("training has no time limit and ending practice produces a finished result", () => {
  const state = createMatch({ mode: "training", seed: 881 });
  advance(state, 30);
  assert.equal(state.phase, "playing");
  assert.equal(state.player.alive, true);
  assert.equal(state.player.stats.deaths, 0);
  const events = command(state, "endTraining");
  assert.equal(state.phase, "finished");
  assert.ok(events.some((event) => event.type === "finish"));
});

test("capture progress stops while contested and owned objectives generate score", () => {
  const state = fixture({ mode: "control" });
  state.objectives = [
    {
      id: "A",
      x: 0,
      z: 0,
      radius: 4.8,
      owner: -1,
      progress: 0,
      capturing: -1,
      contested: false,
    },
  ];
  state.player.invulnerable = 100;
  const enemy = target(state, { x: 20, z: 20, invulnerable: 100 });
  state.bots = [enemy];
  advance(state, 1);
  const point = state.objectives[0];
  assert.ok(point.progress > 0);
  assert.equal(point.owner, -1);
  const progress = point.progress;
  advance(state, 2, () => {
    enemy.x = 1;
    enemy.z = 1;
    return {};
  });
  assert.equal(point.contested, true);
  assert.ok(Math.abs(point.progress - progress) < 0.001);
  advance(state, 15, () => {
    enemy.x = 25;
    enemy.z = 25;
    return {};
  });
  assert.equal(point.owner, 0);
  assert.ok(state.score[0] > 0);
  assert.equal(state.player.stats.captures, 1);
});

test("a player high above a control point cannot capture through the floor", () => {
  const state = fixture({ mode: "control" });
  state.bots = [];
  state.objectives = [
    {
      id: "A",
      x: 0,
      z: 0,
      radius: 4.8,
      owner: -1,
      progress: 0,
      capturing: -1,
      contested: false,
    },
  ];
  advance(state, 3, () => {
    state.player.y = 12;
    state.player.vy = 0;
    return {};
  });
  assert.equal(state.objectives[0].progress, 0);
  assert.equal(state.objectives[0].owner, -1);
});

test("standard deaths respawn once with protection and restored ammunition", () => {
  const state = fixture({ mode: "team" });
  const enemy = target(state);
  state.player.ammo.rifle.mag = 0;
  damageActor(state, state.player, 1000, {
    attacker: enemy.id,
    weapon: "rifle",
  });
  assert.equal(state.player.alive, false);
  assert.equal(state.player.stats.deaths, 1);
  const events = advance(state, 4.1);
  assert.equal(state.player.alive, true);
  assert.ok(state.player.invulnerable > 0);
  assert.equal(state.player.health, state.player.maxHealth);
  assert.equal(state.player.ammo.rifle.mag, WEAPONS.rifle.magSize);
  assert.equal(
    events.filter(
      (event) => event.type === "respawn" && event.actor === "player",
    ).length,
    1,
  );
  assert.equal(state.player.stats.deaths, 1);
});

test("survival progresses through five waves and applies the selected intermission upgrade", () => {
  const state = createMatch({ mode: "survival", seed: 22 });
  advance(state, 3.2);
  const baseHealth = state.player.maxHealth;
  for (let wave = 1; wave <= 5; wave += 1) {
    assert.equal(state.wave, wave);
    const enemies = state.bots.filter((bot) => bot.team === 1 && bot.alive);
    assert.ok(enemies.length > 0);
    for (const enemy of enemies) {
      enemy.invulnerable = 0;
      damageActor(state, enemy, 10000, { attacker: "player", weapon: "rifle" });
    }
    advance(state, 0.2);
    if (wave === 5) {
      assert.equal(state.phase, "finished");
      assert.equal(state.winner, 0);
    } else {
      assert.equal(state.phase, "intermission");
      command(state, "upgrade", { id: wave === 1 ? "health" : "supply" });
      assert.equal(state.phase, "playing");
      assert.ok(state.player.maxHealth > baseHealth);
      assert.equal(state.player.health, state.player.maxHealth);
    }
  }
});

test("survival ends after the third player death instead of creating infinite respawns", () => {
  const state = createMatch({ mode: "survival", seed: 41 });
  advance(state, 3.2);
  for (let death = 1; death <= 3; death += 1) {
    state.player.invulnerable = 0;
    const enemy = state.bots.find((bot) => bot.team === 1 && bot.alive);
    damageActor(state, state.player, 10000, {
      attacker: enemy.id,
      weapon: "rifle",
    });
    if (death < 3) {
      advance(state, 4.1);
      assert.equal(state.player.alive, true);
    }
  }
  assert.equal(state.player.stats.deaths, 3);
  assert.equal(state.lives, 0);
  assert.equal(state.phase, "finished");
  assert.equal(state.winner, 1);
});

for (const upgrade of ["armor", "supply"]) {
  test(`a fallen survivor is revived before receiving the ${upgrade} wave reward`, () => {
    const state = createMatch({ mode: "survival", seed: 28 });
    state.phase = "playing";
    const enemy = state.bots.find((bot) => bot.team === 1);
    state.player.invulnerable = 0;
    damageActor(state, state.player, 10000, {
      attacker: enemy.id,
      weapon: "rifle",
    });
    for (const bot of state.bots.filter((actor) => actor.team === 1)) {
      bot.invulnerable = 0;
      damageActor(state, bot, 10000, { attacker: "buddy", weapon: "rifle" });
    }
    advance(state, DT);
    assert.equal(state.phase, "intermission");
    command(state, "upgrade", { id: upgrade });
    assert.equal(state.player.alive, true);
    assert.equal(state.wave, 2);
    if (upgrade === "armor")
      assert.equal(state.player.armor, state.player.maxArmor);
    if (upgrade === "supply") assert.equal(state.player.grenades, 4);
    const maxHealth = state.player.maxHealth;
    command(state, "upgrade", { id: "health" });
    assert.equal(state.wave, 2);
    assert.equal(state.player.maxHealth, maxHealth);
  });
}

test("a three-kill reward never takes away a fourth grenade earned by upgrading", () => {
  const state = fixture();
  const enemy = target(state);
  state.player.grenades = 4;
  state.player.streak = 2;
  damageActor(state, enemy, 1000, { attacker: "player", weapon: "rifle" });
  assert.equal(state.player.streak, 3);
  assert.equal(state.player.grenades, 4);
});

for (const [mode, map, duration] of [
  ["team", "harbor", 305],
  ["control", "desert", 365],
]) {
  test(`${mode} on ${map} completes a full seeded match with real AI simulation`, () => {
    const state = createMatch({ mode, map, seed: 732, difficulty: "normal" });
    const events = advance(state, duration);
    assert.equal(state.phase, "finished");
    assert.ok([0, 1].includes(state.winner));
    assert.ok(state.reason.length > 0);
    assert.ok(events.some((event) => event.type === "finish"));
    assert.ok(
      events.some((event) => event.type === "shot" && event.actor !== "player"),
    );
    assert.ok(state.score.some((score) => score > 0));
    assert.ok(
      [state.player, ...state.bots].every((actor) =>
        [
          actor.x,
          actor.y,
          actor.z,
          actor.health,
          actor.armor,
          actor.stats.kills,
        ].every(Number.isFinite),
      ),
    );
    const score = [...state.score];
    const elapsed = state.elapsed;
    advance(state, 2, { fire: true, moveZ: 1, grenade: true });
    assert.deepEqual(state.score, score);
    assert.equal(state.elapsed, elapsed);
  });
}

test("a complete team match can be won by movement, aim and trigger inputs without mutating match state", () => {
  const state = createMatch({
    mode: "team",
    map: "harbor",
    difficulty: "easy",
    seed: 555,
  });
  let route = [];
  let routeIndex = 0;
  let refreshAt = -1;
  let lastTarget = null;
  const events = advance(state, 305, (match) => {
    const player = match.player;
    if (!player.alive || match.phase !== "playing") return {};
    const origin = { x: player.x, y: player.y + player.eyeHeight, z: player.z };
    const enemies = match.bots.filter(
      (bot) => bot.alive && bot.team !== player.team,
    );
    const visible = enemies.filter((bot) =>
      hasLineOfSight(match, origin, {
        x: bot.x,
        y: bot.y + bot.height - 0.22,
        z: bot.z,
      }),
    );
    const candidates = visible.length ? visible : enemies;
    if (!candidates.length) return {};
    const enemy = candidates.reduce((nearest, bot) =>
      Math.hypot(bot.x - player.x, bot.z - player.z) <
      Math.hypot(nearest.x - player.x, nearest.z - player.z)
        ? bot
        : nearest,
    );
    const dx = enemy.x - player.x;
    const dz = enemy.z - player.z;
    const distance = Math.hypot(dx, dz);
    const input = {
      yaw: Math.atan2(dx, dz),
      pitch: Math.atan2(enemy.y + enemy.height - 0.22 - origin.y, distance),
      aim: true,
      fire: visible.includes(enemy) && distance < 42,
      reload: player.ammo[player.weapon].mag < 3,
    };
    if (!visible.includes(enemy) || distance > 20) {
      if (enemy.id !== lastTarget || match.elapsed >= refreshAt) {
        route = findPath(match, player, enemy);
        routeIndex = 0;
        refreshAt = match.elapsed + 0.85;
        lastTarget = enemy.id;
      }
      while (
        routeIndex < route.length &&
        Math.hypot(
          player.x - route[routeIndex].x,
          player.z - route[routeIndex].z,
        ) < 0.55
      )
        routeIndex++;
      const point = route[routeIndex] || enemy;
      const length = Math.hypot(point.x - player.x, point.z - player.z) || 1;
      input.moveX = (point.x - player.x) / length;
      input.moveZ = (point.z - player.z) / length;
      input.jump = point.y > player.y + 0.5 && player.onGround;
    }
    return input;
  });
  assert.equal(state.phase, "finished");
  assert.equal(state.winner, 0);
  assert.equal(state.score[0], 25);
  assert.ok(state.player.stats.kills >= 5);
  assert.ok(state.player.stats.shots > state.player.stats.kills);
  assert.ok(state.player.stats.hits <= state.player.stats.shots);
  assert.ok(events.some((event) => event.type === "hit" && event.killed));
});
