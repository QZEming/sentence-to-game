import {
  WEAPONS,
  WEAPON_ORDER,
  CLASSES,
  DIFFICULTIES,
  MODES,
  MAPS,
} from "./data.js";

// The simulation has no renderer, clock, DOM or global random dependency. All
// geometry is shared with the arena, and every bullet and blast checks that geometry.
const RADIUS = 0.32;
const GRAVITY = 22;
const STEP = 1 / 60;
const EPSILON = 0.00001;
const botNames = [
  "VECTOR",
  "ECHO",
  "RELAY",
  "ONYX",
  "CIPHER",
  "NOVA",
  "FLINT",
  "GHOST",
  "SPARK",
  "ATLAS",
  "VEX",
  "POLAR",
];
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const distance2 = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const length3 = (v) => Math.hypot(v.x, v.y, v.z);
const allActors = (state) => [state.player, ...state.bots];
const actorById = (state, id) =>
  id === "player" ? state.player : state.bots.find((actor) => actor.id === id);
const validNumber = (value, fallback = 0) =>
  Number.isFinite(value) ? value : fallback;
const normalize = (v) => {
  const length = length3(v) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
};
const aimDirection = (yaw, pitch) => ({
  x: Math.sin(yaw) * Math.cos(pitch),
  y: Math.sin(pitch),
  z: Math.cos(yaw) * Math.cos(pitch),
});
const eye = (actor) => ({
  x: actor.x,
  y: actor.y + actor.eyeHeight,
  z: actor.z,
});
const mapOf = (state) => MAPS[state.options.map];

function random(state) {
  let value = state.seed >>> 0;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  state.seed = value >>> 0;
  return state.seed / 4294967296;
}
function freshStats() {
  return {
    kills: 0,
    deaths: 0,
    assists: 0,
    shots: 0,
    hits: 0,
    headshots: 0,
    captures: 0,
    damage: 0,
  };
}
function freshAmmo() {
  return Object.fromEntries(
    WEAPON_ORDER.map((id) => [
      id,
      { mag: WEAPONS[id].magSize, reserve: WEAPONS[id].reserve },
    ]),
  );
}
function createActor(state, id, name, team, classId = "assault", index = 0) {
  const config = CLASSES[classId] || CLASSES.assault;
  const spawns = mapOf(state).spawns[team];
  const spawn = spawns[index % spawns.length];
  return {
    id,
    name,
    team,
    class: classId,
    type: id === "player" ? "player" : "bot",
    x: spawn.x,
    y: 0,
    z: spawn.z,
    yaw: team === 0 ? Math.PI : 0,
    pitch: 0,
    height: 1.8,
    eyeHeight: 1.62,
    vx: 0,
    vy: 0,
    vz: 0,
    health: config.health,
    maxHealth: config.health,
    armor: config.armor,
    maxArmor: Math.max(config.armor, 100),
    stamina: config.stamina,
    maxStamina: config.stamina,
    baseSpeed: config.speed,
    alive: true,
    respawnTimer: 0,
    invulnerable: 1.6,
    weapon: config.weapon || "rifle",
    ammo: freshAmmo(),
    reloadTimer: 0,
    reloadDuration: 0,
    fireTimer: 0,
    switchTimer: 0,
    grenades: 2,
    grenadeTimer: 0,
    slideTimer: 0,
    slideCooldown: 0,
    meleeTimer: 0,
    recoil: 0,
    flash: 0,
    shootTimer: 0,
    aiming: false,
    sprinting: false,
    crouching: false,
    onGround: true,
    speed: 0,
    streak: 0,
    radarTimer: 0,
    lastDamaged: -20,
    stats: freshStats(),
    damagers: {},
    aiTimer: 0,
    aiReaction: 0,
    aiTarget: null,
    aiVisible: false,
    path: [],
    pathIndex: 0,
    pathTimer: 0,
    strafe: index % 2 ? -1 : 1,
    spawnIndex: index,
    stuckTimer: 0,
    slideX: 0,
    slideZ: 0,
  };
}

export function createMatch(options = {}) {
  const normalized = {
    mode: MODES[options.mode] ? options.mode : "team",
    map: MAPS[options.map] ? options.map : "harbor",
    difficulty: DIFFICULTIES[options.difficulty]
      ? options.difficulty
      : "normal",
    class: CLASSES[options.class] ? options.class : "assault",
    seed: Number(options.seed) >>> 0 || 893147,
  };
  const map = MAPS[normalized.map];
  const mode = MODES[normalized.mode];
  const state = {
    version: 1,
    options: normalized,
    phase: "countdown",
    countdown: 3,
    elapsed: 0,
    remaining: mode.timeLimit || 0,
    score: [0, 0],
    winner: null,
    reason: "",
    wave: 1,
    maxWaves: 5,
    lives: 3,
    waveTimer: 0,
    player: null,
    bots: [],
    obstacles: map.obstacles.map((item) => ({
      ...item,
      health: item.hp || 0,
      destroyed: false,
    })),
    pickups: map.pickups.map((item) => ({
      ...item,
      active: true,
      timer: 0,
      y: 0,
    })),
    objectives: map.objectives.map((item) => ({
      ...item,
      owner: -1,
      progress: 0,
      capturing: -1,
      contested: false,
    })),
    grenades: [],
    effects: [],
    killFeed: [],
    stats: { totalKills: 0, accuracy: 0 },
    nextId: 1,
    seed: normalized.seed,
    objectiveTimer: 0,
    navVersion: 0,
    _nav: null,
  };
  state.player = createActor(state, "player", "YOU", 0, normalized.class, 0);
  state.player.y = supportHeight(
    state,
    state.player.x,
    state.player.z,
    Infinity,
  );
  if (normalized.mode === "training") {
    const targets = map.trainingSpawns?.length
      ? map.trainingSpawns
      : map.patrol.length
        ? map.patrol
        : map.spawns[1];
    for (let i = 0; i < 4; i++) {
      const bot = createActor(
        state,
        `bot-${i}`,
        `TARGET ${String(i + 1).padStart(2, "0")}`,
        1,
        "assault",
        i,
      );
      const position = targets[i % targets.length];
      bot.x = position.x;
      bot.z = position.z;
      bot.y = supportHeight(state, bot.x, bot.z, Infinity);
      bot.armor = 0;
      bot.invulnerable = 0;
      bot.trainingSpawn = { x: bot.x, y: bot.y, z: bot.z };
      state.bots.push(bot);
    }
  } else if (normalized.mode === "survival") {
    state.bots.push(createActor(state, "buddy", "VECTOR", 0, "heavy", 1));
    createWave(state);
  } else {
    for (let i = 0; i < 5; i++) {
      const team = i < 2 ? 0 : 1;
      const classId = ["recon", "heavy", "assault", "recon", "heavy"][i];
      state.bots.push(
        createActor(
          state,
          `bot-${i}`,
          botNames[i],
          team,
          classId,
          team ? i - 2 : i + 1,
        ),
      );
    }
  }
  for (const bot of state.bots)
    bot.y = supportHeight(state, bot.x, bot.z, Infinity);
  for (const pickup of state.pickups)
    pickup.y = supportHeight(state, pickup.x, pickup.z, Infinity);
  return state;
}

function createWave(state) {
  state.bots = state.bots.filter((bot) => bot.team === 0);
  const count = 3 + state.wave * 2;
  for (let i = 0; i < count; i++) {
    const classes = ["assault", "recon", "assault", "heavy"];
    const bot = createActor(
      state,
      `wave-${state.wave}-${i}`,
      `${botNames[i % botNames.length]} ${state.wave}`,
      1,
      classes[i % classes.length],
      i,
    );
    bot.health = bot.maxHealth = 65 + state.wave * 9;
    bot.armor = state.wave > 2 ? 15 + state.wave * 3 : 0;
    bot.maxArmor = 100;
    bot.invulnerable = 1.6;
    // Spread simultaneous spawns along their safe side of the arena.
    bot.x = clamp(
      bot.x + (Math.floor(i / mapOf(state).spawns[1].length) - 0.5) * 1.4,
      -mapOf(state).bounds.halfX + 1,
      mapOf(state).bounds.halfX - 1,
    );
    state.bots.push(bot);
  }
  state.waveTimer = 0;
}

function rampHeight(ramp, x, z) {
  const coordinate = ramp.axis === "x" ? x : z;
  const center = ramp.axis === "x" ? ramp.x : ramp.z;
  const size = ramp.axis === "x" ? ramp.w : ramp.d;
  return ramp.h * clamp(0.5 + ((coordinate - center) / size) * ramp.rise, 0, 1);
}
function insideRect(item, x, z, padding = 0) {
  return (
    Math.abs(x - item.x) <= item.w / 2 + padding &&
    Math.abs(z - item.z) <= item.d / 2 + padding
  );
}
function supportHeight(state, x, z, feet = Infinity) {
  let floor = 0;
  for (const obstacle of state.obstacles) {
    if (obstacle.destroyed || !insideRect(obstacle, x, z, RADIUS * 0.25))
      continue;
    const top = (obstacle.y || 0) + obstacle.h;
    if (feet >= top - 0.24) floor = Math.max(floor, top);
  }
  for (const ramp of mapOf(state).ramps) {
    if (insideRect(ramp, x, z)) {
      const height = rampHeight(ramp, x, z);
      if (feet >= height - 0.45) floor = Math.max(floor, height);
    }
  }
  return floor;
}
function positionBlocked(state, x, z, feet, height = 1.8, radius = RADIUS) {
  const bounds = mapOf(state).bounds;
  if (
    Math.abs(x) > bounds.halfX - radius ||
    Math.abs(z) > bounds.halfZ - radius
  )
    return true;
  for (const obstacle of state.obstacles) {
    if (
      obstacle.destroyed ||
      feet >= (obstacle.y || 0) + obstacle.h - 0.21 ||
      feet + height <= (obstacle.y || 0) + 0.04
    )
      continue;
    const dx = Math.max(Math.abs(x - obstacle.x) - obstacle.w / 2, 0);
    const dz = Math.max(Math.abs(z - obstacle.z) - obstacle.d / 2, 0);
    if (dx * dx + dz * dz < radius * radius) return true;
  }
  for (const ramp of mapOf(state).ramps) {
    if (insideRect(ramp, x, z) && rampHeight(ramp, x, z) > feet + 0.45)
      return true;
  }
  return false;
}

function boxIntersection(origin, direction, minimum, maximum, limit) {
  let near = 0;
  let far = limit;
  let normal = { x: 0, y: 0, z: 0 };
  for (const axis of ["x", "y", "z"]) {
    if (Math.abs(direction[axis]) < EPSILON) {
      if (origin[axis] < minimum[axis] || origin[axis] > maximum[axis])
        return null;
      continue;
    }
    let first = (minimum[axis] - origin[axis]) / direction[axis];
    let second = (maximum[axis] - origin[axis]) / direction[axis];
    let sign = -1;
    if (first > second) {
      [first, second] = [second, first];
      sign = 1;
    }
    if (first > near) {
      near = first;
      normal = { x: 0, y: 0, z: 0, [axis]: sign };
    }
    far = Math.min(far, second);
    if (near > far || far < 0) return null;
  }
  return near <= limit ? { distance: Math.max(0, near), normal } : null;
}
function sphereIntersection(origin, direction, center, radius, limit) {
  const ox = origin.x - center.x;
  const oy = origin.y - center.y;
  const oz = origin.z - center.z;
  const b = ox * direction.x + oy * direction.y + oz * direction.z;
  const c = ox * ox + oy * oy + oz * oz - radius * radius;
  const discriminant = b * b - c;
  if (discriminant < 0) return null;
  const distance = Math.max(0, -b - Math.sqrt(discriminant));
  if (-b + Math.sqrt(discriminant) < 0 || distance > limit) return null;
  return { distance };
}
function rampIntersection(origin, direction, ramp, limit) {
  // Exact solid wedge: the sloping top and four finite vertical side planes.
  const axis = ramp.axis === "x" ? "x" : "z";
  const center = axis === "x" ? ramp.x : ramp.z;
  const size = axis === "x" ? ramp.w : ramp.d;
  const slope = (ramp.h / size) * ramp.rise;
  const offset = ramp.h * 0.5 - slope * center;
  let best = null;
  const denominator = direction.y - slope * direction[axis];
  if (Math.abs(denominator) > EPSILON) {
    const t = (slope * origin[axis] + offset - origin.y) / denominator;
    const x = origin.x + direction.x * t;
    const z = origin.z + direction.z * t;
    if (t >= 0 && t <= limit && insideRect(ramp, x, z, EPSILON)) {
      const normal = normalize({
        x: axis === "x" ? -slope : 0,
        y: 1,
        z: axis === "z" ? -slope : 0,
      });
      best = { distance: t, normal };
    }
  }
  for (const side of ["x", "z"]) {
    if (Math.abs(direction[side]) < EPSILON) continue;
    const half = (side === "x" ? ramp.w : ramp.d) / 2;
    for (const sign of [-1, 1]) {
      const t = (ramp[side] + half * sign - origin[side]) / direction[side];
      if (t < 0 || t > limit || (best && t >= best.distance)) continue;
      const x = origin.x + direction.x * t;
      const y = origin.y + direction.y * t;
      const z = origin.z + direction.z * t;
      if (
        insideRect(ramp, x, z, EPSILON) &&
        y >= 0 &&
        y <= rampHeight(ramp, x, z) + EPSILON
      )
        best = {
          distance: t,
          normal: {
            x: side === "x" ? sign : 0,
            y: 0,
            z: side === "z" ? sign : 0,
          },
        };
    }
  }
  return best;
}

export function raycast(
  state,
  origin,
  direction,
  maxDistance = 120,
  options = {},
) {
  const ray = normalize(direction);
  let result = {
    type: "none",
    distance: maxDistance,
    headshot: false,
    normal: { x: 0, y: 1, z: 0 },
  };
  for (const obstacle of state.obstacles) {
    if (obstacle.destroyed) continue;
    const hit = boxIntersection(
      origin,
      ray,
      {
        x: obstacle.x - obstacle.w / 2,
        y: obstacle.y || 0,
        z: obstacle.z - obstacle.d / 2,
      },
      {
        x: obstacle.x + obstacle.w / 2,
        y: (obstacle.y || 0) + obstacle.h,
        z: obstacle.z + obstacle.d / 2,
      },
      result.distance,
    );
    if (hit && hit.distance < result.distance)
      result = { ...hit, type: "obstacle", obstacle, headshot: false };
  }
  for (const ramp of mapOf(state).ramps) {
    const hit = rampIntersection(origin, ray, ramp, result.distance);
    if (hit && hit.distance < result.distance)
      result = { ...hit, type: "obstacle", obstacle: ramp, headshot: false };
  }
  if (ray.y < -EPSILON && origin.y >= 0) {
    const distance = -origin.y / ray.y;
    if (distance < result.distance)
      result = {
        type: "ground",
        distance,
        headshot: false,
        normal: { x: 0, y: 1, z: 0 },
      };
  }
  if (options.actors !== false) {
    for (const actor of allActors(state)) {
      if (
        !actor.alive ||
        actor.id === options.ignore ||
        actor.team === options.team
      )
        continue;
      const head = sphereIntersection(
        origin,
        ray,
        { x: actor.x, y: actor.y + actor.height - 0.22, z: actor.z },
        0.24,
        result.distance,
      );
      const body = boxIntersection(
        origin,
        ray,
        { x: actor.x - 0.3, y: actor.y + 0.08, z: actor.z - 0.3 },
        {
          x: actor.x + 0.3,
          y: actor.y + actor.height - 0.39,
          z: actor.z + 0.3,
        },
        result.distance,
      );
      const hit =
        head && (!body || head.distance < body.distance)
          ? { ...head, headshot: true }
          : body && { ...body, headshot: false };
      if (hit && hit.distance < result.distance)
        result = { ...hit, type: "actor", actor };
    }
  }
  result.point = {
    x: origin.x + ray.x * result.distance,
    y: origin.y + ray.y * result.distance,
    z: origin.z + ray.z * result.distance,
  };
  return result;
}

export function hasLineOfSight(state, from, to) {
  const delta = { x: to.x - from.x, y: to.y - from.y, z: to.z - from.z };
  const distance = length3(delta);
  return (
    distance < EPSILON ||
    raycast(state, from, delta, distance, { actors: false }).type === "none"
  );
}

function finish(state, winner, reason, events) {
  if (state.phase === "finished") return;
  state.phase = "finished";
  state.winner = winner;
  state.reason = reason;
  state.stats.accuracy = state.player.stats.shots
    ? Math.round((state.player.stats.hits / state.player.stats.shots) * 100)
    : 0;
  events.push({ type: "finish" });
  if (winner !== null)
    events.push({ type: "sound", name: winner === 0 ? "victory" : "defeat" });
}
function killActor(state, victim, attacker, info, events) {
  if (!victim.alive) return;
  victim.alive = false;
  victim.health = 0;
  victim.stats.deaths++;
  victim.streak = 0;
  victim.reloadTimer = 0;
  victim.reloadDuration = 0;
  victim.slideTimer = 0;
  victim.speed = 0;
  victim.vx = victim.vz = 0;
  victim.respawnTimer = state.options.mode === "training" ? 2.5 : 4;
  if (state.options.mode === "survival" && victim.team === 1)
    victim.respawnTimer = -1;
  const enemyKill =
    attacker && attacker.id !== victim.id && attacker.team !== victim.team;
  if (enemyKill) {
    attacker.stats.kills++;
    attacker.streak++;
    if (info.headshot) attacker.stats.headshots++;
    if (state.options.mode === "team") state.score[attacker.team]++;
    if (state.options.mode === "training" || state.options.mode === "survival")
      state.score[attacker.team]++;
    if (attacker.id === "player" && attacker.streak === 3) {
      attacker.grenades = Math.max(
        attacker.grenades,
        Math.min(3, attacker.grenades + 1),
      );
      attacker.armor = Math.min(attacker.maxArmor, attacker.armor + 35);
      events.push({
        type: "toast",
        message: "三连击 · 护甲与手雷补给",
        tone: "good",
      });
    }
    if (attacker.id === "player" && attacker.streak === 5) {
      attacker.radarTimer = 8;
      events.push({
        type: "toast",
        message: "五连击 · 侦察雷达上线 8 秒",
        tone: "good",
      });
    }
  }
  for (const [id, damagedAt] of Object.entries(victim.damagers)) {
    const helper = actorById(state, id);
    if (
      helper &&
      helper !== attacker &&
      helper.team !== victim.team &&
      state.elapsed - damagedAt < 8
    )
      helper.stats.assists++;
  }
  state.stats.totalKills++;
  const feed = {
    id: state.nextId++,
    killer: attacker?.name || "环境",
    victim: victim.name,
    killerTeam: attacker?.team ?? -1,
    weapon: info.weapon || "rifle",
    headshot: !!info.headshot,
    time: state.elapsed,
  };
  state.killFeed.unshift(feed);
  state.killFeed.length = Math.min(6, state.killFeed.length);
  events.push({
    type: "kill",
    killer: attacker?.id || "world",
    victim: victim.id,
    killerTeam: attacker?.team ?? -1,
    weapon: feed.weapon,
    headshot: feed.headshot,
  });
  if (victim.id === "player" && state.options.mode === "survival") {
    state.lives--;
    if (state.lives <= 0)
      finish(state, 1, "小队撤离失败 · 生存次数耗尽", events);
  }
  if (
    state.options.mode === "team" &&
    state.score.some((score) => score >= (MODES.team.target || 25))
  )
    finish(
      state,
      state.score[0] >= state.score[1] ? 0 : 1,
      "达到目标淘汰数",
      events,
    );
}
function applyDamage(state, victim, amount, info, events) {
  if (!victim || !victim.alive || victim.invulnerable > 0 || !(amount > 0))
    return 0;
  const attacker =
    typeof info.attacker === "string"
      ? actorById(state, info.attacker)
      : info.attacker;
  if (attacker && attacker.team === victim.team && attacker.id !== victim.id)
    return 0;
  const absorption = info.ignoreArmor
    ? 0
    : Math.min(victim.armor, amount * 0.65);
  const healthDamage = Math.min(victim.health, amount - absorption);
  victim.armor -= absorption;
  victim.health = Math.max(0, victim.health - healthDamage);
  victim.lastDamaged = state.elapsed;
  const total = absorption + healthDamage;
  if (attacker && attacker.id !== victim.id) {
    attacker.stats.damage += total;
    victim.damagers[attacker.id] = state.elapsed;
  }
  events.push({
    type: "damage",
    target: victim.id,
    attacker: attacker?.id || "world",
    amount: total,
    from: info.from || {
      x: attacker?.x ?? victim.x,
      z: attacker?.z ?? victim.z,
    },
  });
  if (victim.health <= 0) killActor(state, victim, attacker, info, events);
  return total;
}
export function damageActor(state, target, amount, info = {}) {
  const events = [];
  applyDamage(
    state,
    typeof target === "string" ? actorById(state, target) : target,
    amount,
    info,
    events,
  );
  return events;
}
function damageObstacle(state, obstacle, amount, events) {
  if (!obstacle || !obstacle.hp || obstacle.destroyed) return;
  obstacle.health -= amount;
  if (obstacle.health <= 0) {
    obstacle.health = 0;
    obstacle.destroyed = true;
    state.navVersion++;
    state._nav = null;
    events.push({
      type: "debris",
      position: {
        x: obstacle.x,
        y: (obstacle.y || 0) + obstacle.h * 0.5,
        z: obstacle.z,
      },
      color: obstacle.color,
    });
  }
}

function startReload(state, actor, events) {
  if (!actor.alive || actor.reloadTimer > 0 || actor.switchTimer > 0)
    return false;
  const weapon = WEAPONS[actor.weapon];
  const ammo = actor.ammo[actor.weapon];
  if (ammo.mag >= weapon.magSize || ammo.reserve <= 0) return false;
  actor.reloadDuration = weapon.reload;
  actor.reloadTimer = weapon.reload;
  actor.reloadWeapon = actor.weapon;
  actor.sprinting = false;
  if (actor.id === "player") events.push({ type: "sound", name: "reload" });
  return true;
}
function shoot(state, actor, events) {
  if (
    !actor.alive ||
    actor.fireTimer > 0 ||
    actor.reloadTimer > 0 ||
    actor.switchTimer > 0 ||
    actor.slideTimer > 0
  )
    return;
  const weapon = WEAPONS[actor.weapon];
  const ammo = actor.ammo[actor.weapon];
  if (ammo.mag <= 0) {
    startReload(state, actor, events);
    return;
  }
  ammo.mag--;
  actor.stats.shots++;
  actor.sprinting = false;
  const difficulty = DIFFICULTIES[state.options.difficulty];
  actor.fireTimer =
    actor.id === "player"
      ? weapon.interval
      : Math.max(weapon.interval, difficulty.fireInterval || 0.26);
  actor.recoil = Math.min(1.8, actor.recoil + weapon.recoil);
  actor.flash = 0.07;
  actor.shootTimer = 0.13;
  const origin = eye(actor);
  let spread = actor.aiming ? weapon.adsSpread : weapon.spread;
  if (actor.speed > 1.5) spread *= 1.55;
  if (!actor.onGround) spread *= 2;
  if (actor.crouching) spread *= 0.72;
  if (actor.id !== "player") spread += difficulty.spread || 0;
  let hitAny = false;
  let headshotAny = false;
  let killedAny = false;
  for (let pellet = 0; pellet < (weapon.pellets || 1); pellet++) {
    const angle = random(state) * Math.PI * 2;
    const radius = Math.sqrt(random(state)) * spread;
    const direction = aimDirection(
      actor.yaw + Math.cos(angle) * radius,
      actor.pitch + Math.sin(angle) * radius,
    );
    const hit = raycast(state, origin, direction, weapon.range, {
      ignore: actor.id,
      team: actor.team,
    });
    if (hit.type === "actor") {
      const ratio = clamp(hit.distance / weapon.range, 0, 1);
      const falloff = 1 - (1 - (weapon.falloff ?? 1)) * ratio;
      const damageScale =
        actor.id === "player"
          ? 1
          : actor.team === 0
            ? 0.8
            : difficulty.damage || 1;
      const amount =
        weapon.damage *
        falloff *
        damageScale *
        (hit.headshot ? weapon.headMultiplier : 1);
      const damage = applyDamage(
        state,
        hit.actor,
        amount,
        {
          attacker: actor,
          weapon: actor.weapon,
          headshot: hit.headshot,
          from: origin,
        },
        events,
      );
      if (damage > 0) {
        hitAny = true;
        headshotAny ||= hit.headshot;
        killedAny ||= !hit.actor.alive;
      }
    } else if (hit.type === "obstacle") {
      damageObstacle(state, hit.obstacle, weapon.damage, events);
    }
    events.push({
      type: "shot",
      actor: actor.id,
      team: actor.team,
      weapon: actor.weapon,
      pellet,
      from: { ...origin },
      to: hit.point,
      hit:
        hit.type === "actor" ? "enemy" : hit.type === "none" ? "none" : "world",
      headshot: !!hit.headshot,
    });
  }
  if (hitAny) {
    actor.stats.hits++;
    if (actor.id === "player")
      events.push({ type: "hit", headshot: headshotAny, killed: killedAny });
  }
}

function jump(state, actor, events) {
  if (
    !actor.alive ||
    !actor.onGround ||
    actor.stamina < 8 ||
    actor.slideTimer > 0
  )
    return;
  actor.vy = 7.5;
  actor.onGround = false;
  actor.stamina -= 8;
  if (actor.id === "player") events.push({ type: "sound", name: "jump" });
}
function slide(actor) {
  if (
    !actor.alive ||
    !actor.onGround ||
    actor.slideCooldown > 0 ||
    actor.stamina < 24 ||
    actor.speed < 1
  )
    return;
  const length = Math.hypot(actor.vx, actor.vz) || 1;
  actor.slideX = actor.vx / length;
  actor.slideZ = actor.vz / length;
  actor.slideTimer = 0.65;
  actor.slideCooldown = 1.65;
  actor.stamina -= 24;
  actor.reloadTimer = 0;
  actor.reloadDuration = 0;
}
function throwGrenade(state, actor, events) {
  if (
    !actor.alive ||
    actor.grenades <= 0 ||
    actor.grenadeTimer > 0 ||
    actor.switchTimer > 0
  )
    return;
  actor.grenades--;
  actor.grenadeTimer = 0.8;
  const direction = aimDirection(
    actor.yaw,
    clamp(actor.pitch + 0.19, -0.9, 1.25),
  );
  const origin = eye(actor);
  state.grenades.push({
    id: state.nextId++,
    owner: actor.id,
    team: actor.team,
    x: origin.x,
    y: origin.y - 0.08,
    z: origin.z,
    vx: direction.x * 16 + actor.vx * 0.35,
    vy: direction.y * 16 + 2.4,
    vz: direction.z * 16 + actor.vz * 0.35,
    fuse: 1.8,
  });
  events.push({ type: "sound", name: "grenade" });
}
function melee(state, actor, events) {
  if (!actor.alive || actor.meleeTimer > 0 || actor.switchTimer > 0) return;
  actor.meleeTimer = 0.65;
  actor.shootTimer = 0.22;
  const direction = aimDirection(actor.yaw, actor.pitch);
  let best = null;
  for (const candidate of allActors(state)) {
    if (!candidate.alive || candidate.team === actor.team) continue;
    const vector = {
      x: candidate.x - actor.x,
      y: candidate.y + candidate.height * 0.65 - (actor.y + actor.eyeHeight),
      z: candidate.z - actor.z,
    };
    const length = length3(vector);
    if (length > 2.6 || length < 0.01) continue;
    const dot =
      (direction.x * vector.x +
        direction.y * vector.y +
        direction.z * vector.z) /
      length;
    if (
      dot < 0.58 ||
      !hasLineOfSight(state, eye(actor), {
        x: candidate.x,
        y: candidate.y + candidate.height * 0.65,
        z: candidate.z,
      })
    )
      continue;
    if (!best || length < best.distance)
      best = { actor: candidate, distance: length };
  }
  events.push({ type: "sound", name: "melee" });
  if (best) {
    const damage = applyDamage(
      state,
      best.actor,
      65,
      { attacker: actor, weapon: "melee", from: eye(actor) },
      events,
    );
    if (damage > 0 && actor.id === "player")
      events.push({ type: "hit", headshot: false, killed: !best.actor.alive });
  }
}

export function command(state, action, payload = {}) {
  const events = [];
  const player = state.player;
  if (
    action === "switchWeapon" &&
    WEAPONS[payload.id] &&
    player.alive &&
    state.phase !== "finished"
  ) {
    if (player.weapon === payload.id) return events;
    player.weapon = payload.id;
    player.reloadTimer = 0;
    player.reloadDuration = 0;
    player.reloadWeapon = null;
    player.switchTimer = 0.24;
    player.fireTimer = Math.max(player.fireTimer, 0.12);
    player.recoil = 0;
    events.push({ type: "sound", name: "switch" });
    return events;
  }
  if (
    action === "endTraining" &&
    state.options.mode === "training" &&
    state.phase !== "finished"
  ) {
    finish(state, null, "训练结束 · 继续打磨你的枪法", events);
    return events;
  }
  if (
    action === "upgrade" &&
    state.phase === "intermission" &&
    ["health", "armor", "supply"].includes(payload.id)
  ) {
    if (!player.alive) respawnActor(state, player, events);
    if (payload.id === "health") player.maxHealth += 25;
    if (payload.id === "armor") {
      player.maxArmor += 25;
      player.armor = player.maxArmor;
    }
    if (payload.id === "supply") {
      player.maxStamina += 20;
      player.grenades = 4;
    }
    player.health = player.maxHealth;
    player.stamina = player.maxStamina;
    if (payload.id !== "armor")
      player.armor = Math.max(player.armor, CLASSES[player.class].armor);
    player.ammo = freshAmmo();
    player.reloadTimer = 0;
    player.reloadDuration = 0;
    player.grenades = Math.max(player.grenades, 2);
    player.invulnerable = 2;
    player.fireTimer = 0;
    player.radarTimer = 0;
    for (const buddy of state.bots.filter((bot) => bot.team === 0))
      respawnActor(state, buddy, events);
    state.wave++;
    createWave(state);
    state.phase = "playing";
    events.push(
      { type: "resume" },
      {
        type: "toast",
        message: `第 ${state.wave} / ${state.maxWaves} 波 · 增援已抵达`,
        tone: "info",
      },
    );
    return events;
  }
  if (state.phase !== "playing" || !player.alive) return events;
  if (action === "reload") startReload(state, player, events);
  if (action === "jump") jump(state, player, events);
  if (action === "slide") slide(player);
  if (action === "grenade") throwGrenade(state, player, events);
  if (action === "melee") melee(state, player, events);
  return events;
}

function respawnActor(state, actor, events) {
  const spawns = mapOf(state).spawns[actor.team];
  let position = spawns[actor.spawnIndex % spawns.length];
  let safest = -Infinity;
  for (const spawn of spawns) {
    let safety = 100;
    for (const enemy of allActors(state)) {
      if (!enemy.alive || enemy.team === actor.team) continue;
      let distance = distance2(spawn, enemy);
      if (hasLineOfSight(state, { x: spawn.x, y: 1.6, z: spawn.z }, eye(enemy)))
        distance *= 0.55;
      safety = Math.min(safety, distance);
    }
    // Resolve equal safety values deterministically without always piling on one point.
    safety += random(state) * 2;
    if (safety > safest) {
      safest = safety;
      position = spawn;
    }
  }
  if (actor.trainingSpawn) position = actor.trainingSpawn;
  actor.x = position.x;
  actor.z = position.z;
  actor.y = supportHeight(state, actor.x, actor.z, Infinity);
  actor.yaw = actor.team === 0 ? Math.PI : 0;
  actor.pitch = 0;
  actor.vx = actor.vy = actor.vz = 0;
  actor.alive = true;
  actor.respawnTimer = 0;
  actor.health = actor.maxHealth;
  actor.armor = actor.trainingSpawn ? 0 : CLASSES[actor.class].armor;
  actor.stamina = actor.maxStamina;
  actor.ammo = freshAmmo();
  actor.grenades = 2;
  actor.reloadTimer =
    actor.reloadDuration =
    actor.fireTimer =
    actor.switchTimer =
      0;
  actor.slideTimer =
    actor.slideCooldown =
    actor.meleeTimer =
    actor.grenadeTimer =
      0;
  actor.invulnerable = actor.trainingSpawn ? 0.5 : 1.6;
  actor.lastDamaged = state.elapsed;
  actor.damagers = {};
  actor.height = 1.8;
  actor.eyeHeight = 1.62;
  actor.onGround = true;
  actor.path = [];
  actor.pathIndex = 0;
  actor.pathTimer = 0;
  actor.aiTarget = null;
  actor.aiVisible = false;
  actor.aiReaction = 0;
  actor.crouching = actor.sprinting = actor.aiming = false;
  events.push({ type: "respawn", actor: actor.id });
}
function tickActor(state, actor, dt, events) {
  if (!actor.alive) {
    if (actor.respawnTimer >= 0) {
      actor.respawnTimer -= dt;
      if (actor.respawnTimer <= 0) respawnActor(state, actor, events);
    }
    return;
  }
  for (const timer of [
    "fireTimer",
    "switchTimer",
    "grenadeTimer",
    "slideTimer",
    "slideCooldown",
    "meleeTimer",
    "radarTimer",
    "invulnerable",
    "flash",
    "shootTimer",
  ])
    actor[timer] = Math.max(0, actor[timer] - dt);
  actor.recoil *= Math.exp(-dt * 9);
  if (actor.reloadTimer > 0) {
    actor.reloadTimer = Math.max(0, actor.reloadTimer - dt);
    if (actor.reloadTimer === 0 && actor.reloadWeapon === actor.weapon) {
      const ammo = actor.ammo[actor.weapon];
      if (state.options.mode === "training")
        ammo.reserve = Math.max(ammo.reserve, WEAPONS[actor.weapon].reserve);
      const count = Math.min(
        WEAPONS[actor.weapon].magSize - ammo.mag,
        ammo.reserve,
      );
      ammo.mag += count;
      ammo.reserve -= count;
      actor.reloadDuration = 0;
      actor.reloadWeapon = null;
    }
  }
  if (state.elapsed - actor.lastDamaged > 6)
    actor.health = Math.min(
      actor.maxHealth,
      actor.health + dt * (actor.id === "player" ? 7 : 4),
    );
  if (!actor.sprinting && actor.slideTimer <= 0)
    actor.stamina = Math.min(actor.maxStamina, actor.stamina + dt * 20);
}
function moveActor(state, actor, input, dt) {
  if (!actor.alive) return;
  let dx = validNumber(input.moveX);
  let dz = validNumber(input.moveZ);
  const length = Math.hypot(dx, dz);
  if (length > 1) {
    dx /= length;
    dz /= length;
  }
  actor.crouching = !!input.crouch || actor.slideTimer > 0;
  actor.height = actor.slideTimer > 0 ? 0.85 : actor.crouching ? 1.22 : 1.8;
  actor.eyeHeight = actor.slideTimer > 0 ? 0.72 : actor.crouching ? 1.07 : 1.62;
  actor.aiming = !!input.aim && actor.slideTimer <= 0;
  actor.sprinting =
    !!input.sprint &&
    length > 0.05 &&
    actor.stamina > 2 &&
    !actor.crouching &&
    !actor.aiming &&
    !input.fire &&
    actor.reloadTimer <= 0;
  let speed = actor.baseSpeed || 4.6;
  if (actor.id !== "player") speed *= 0.79;
  if (actor.crouching) speed *= 0.5;
  if (actor.aiming) speed *= 0.68;
  if (actor.sprinting) {
    speed *= 1.5;
    actor.stamina = Math.max(0, actor.stamina - 23 * dt);
  }
  let desiredX = dx * speed;
  let desiredZ = dz * speed;
  if (actor.slideTimer > 0) {
    desiredX = actor.slideX * (4.5 + actor.slideTimer * 8);
    desiredZ = actor.slideZ * (4.5 + actor.slideTimer * 8);
  }
  const acceleration = actor.onGround ? 18 : 5;
  const blend = 1 - Math.exp(-dt * acceleration);
  actor.vx += (desiredX - actor.vx) * blend;
  actor.vz += (desiredZ - actor.vz) * blend;
  const startX = actor.x;
  const startZ = actor.z;
  const oldY = actor.y;
  actor.vy -= GRAVITY * dt;
  let feet = actor.y + actor.vy * dt;
  // An ascending jump can clear a low crate; ramp walking only steps 0.45 m per tick.
  const collisionFeet = Math.max(actor.y, feet);
  const nextX = actor.x + actor.vx * dt;
  if (!positionBlocked(state, nextX, actor.z, collisionFeet, actor.height))
    actor.x = nextX;
  else actor.vx = 0;
  const nextZ = actor.z + actor.vz * dt;
  if (!positionBlocked(state, actor.x, nextZ, collisionFeet, actor.height))
    actor.z = nextZ;
  else actor.vz = 0;
  const floor = supportHeight(
    state,
    actor.x,
    actor.z,
    Math.max(oldY, feet) + 0.02,
  );
  if (feet <= floor && actor.vy <= 0) {
    actor.y = floor;
    actor.vy = 0;
    actor.onGround = true;
  } else if (
    actor.onGround &&
    floor > oldY &&
    floor <= oldY + 0.45 &&
    actor.vy <= 0
  ) {
    actor.y = floor;
    actor.vy = 0;
    actor.onGround = true;
  } else {
    actor.y = Math.max(0, feet);
    actor.onGround = false;
  }
  actor.speed = Math.hypot(actor.x - startX, actor.z - startZ) / dt;
}

function explode(state, grenade, events) {
  const origin = { x: grenade.x, y: Math.max(0.22, grenade.y), z: grenade.z };
  const radius = 6.5;
  const owner = actorById(state, grenade.owner);
  events.push({ type: "explosion", position: origin, radius });
  for (const actor of allActors(state)) {
    if (
      !actor.alive ||
      (actor.team === grenade.team && actor.id !== grenade.owner)
    )
      continue;
    const target = { x: actor.x, y: actor.y + actor.height * 0.6, z: actor.z };
    const distance = Math.hypot(
      target.x - origin.x,
      target.y - origin.y,
      target.z - origin.z,
    );
    if (distance > radius || !hasLineOfSight(state, origin, target)) continue;
    const amount =
      (145 * (1 - distance / radius) + 12) *
      (actor.id === grenade.owner ? 0.7 : 1);
    const damage = applyDamage(
      state,
      actor,
      amount,
      { attacker: owner, weapon: "grenade", from: origin },
      events,
    );
    if (damage && grenade.owner === "player" && actor.id !== "player")
      events.push({ type: "hit", headshot: false, killed: !actor.alive });
  }
  for (const obstacle of state.obstacles) {
    if (!obstacle.hp || obstacle.destroyed) continue;
    const center = {
      x: obstacle.x,
      y: obstacle.y + obstacle.h * 0.5,
      z: obstacle.z,
    };
    const delta = {
      x: center.x - origin.x,
      y: center.y - origin.y,
      z: center.z - origin.z,
    };
    const distance = length3(delta);
    if (distance > radius + Math.max(obstacle.w, obstacle.d) / 2) continue;
    const hit = raycast(state, origin, delta, distance, { actors: false });
    if (hit.type === "none" || hit.obstacle === obstacle)
      damageObstacle(
        state,
        obstacle,
        170 * Math.max(0, 1 - distance / (radius + 1)),
        events,
      );
  }
}
function updateGrenades(state, dt, events) {
  for (const grenade of state.grenades) {
    grenade.fuse -= dt;
    grenade.vy -= 13.5 * dt;
    const delta = {
      x: grenade.vx * dt,
      y: grenade.vy * dt,
      z: grenade.vz * dt,
    };
    const distance = length3(delta);
    const hit =
      distance > EPSILON
        ? raycast(state, grenade, delta, distance + 0.09, { actors: false })
        : null;
    if (hit && hit.type !== "none") {
      const direction = normalize(delta);
      const length = Math.max(0, hit.distance - 0.09);
      grenade.x += direction.x * length;
      grenade.y += direction.y * length;
      grenade.z += direction.z * length;
      const normal = hit.normal || { x: 0, y: 1, z: 0 };
      const dot =
        grenade.vx * normal.x + grenade.vy * normal.y + grenade.vz * normal.z;
      grenade.vx = (grenade.vx - 1.52 * dot * normal.x) * 0.72;
      grenade.vy = (grenade.vy - 1.52 * dot * normal.y) * 0.72;
      grenade.vz = (grenade.vz - 1.52 * dot * normal.z) * 0.72;
      if (normal.y > 0.6 && Math.abs(grenade.vy) < 0.8) grenade.vy = 0;
    } else {
      grenade.x += delta.x;
      grenade.y += delta.y;
      grenade.z += delta.z;
    }
    grenade.y = Math.max(0.1, grenade.y);
    if (grenade.fuse <= 0) explode(state, grenade, events);
  }
  state.grenades = state.grenades.filter((grenade) => grenade.fuse > 0);
}

// A shared navigation lattice includes the real ramp elevations. Its edges are
// checked against expanded collision boxes, preventing diagonal corner cutting.
function buildNavigation(state) {
  if (state._nav && state._nav.version === state.navVersion) return state._nav;
  const map = mapOf(state);
  const cell = 1.8;
  const columns = Math.floor((map.bounds.halfX * 2) / cell);
  const rows = Math.floor((map.bounds.halfZ * 2) / cell);
  const startX = -((columns - 1) * cell) / 2;
  const startZ = -((rows - 1) * cell) / 2;
  const nodes = [];
  for (let z = 0; z < rows; z++) {
    for (let x = 0; x < columns; x++) {
      const px = startX + x * cell;
      const pz = startZ + z * cell;
      const py = supportHeight(state, px, pz, Infinity);
      const blocked = positionBlocked(state, px, pz, py, 1.8, RADIUS + 0.11);
      nodes.push({ x: px, y: py, z: pz, ix: x, iz: z, blocked, neighbors: [] });
    }
  }
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (node.blocked) continue;
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
    ]) {
      const ix = node.ix + dx;
      const iz = node.iz + dz;
      if (ix < 0 || iz < 0 || ix >= columns || iz >= rows) continue;
      const neighborIndex = iz * columns + ix;
      const other = nodes[neighborIndex];
      if (other.blocked || Math.abs(other.y - node.y) > 1.1) continue;
      let passable = true;
      for (const ratio of [0.25, 0.5, 0.75]) {
        const px = node.x + (other.x - node.x) * ratio;
        const pz = node.z + (other.z - node.z) * ratio;
        const feet = node.y + (other.y - node.y) * ratio;
        const floor = supportHeight(state, px, pz, Infinity);
        if (
          Math.abs(floor - feet) > 0.5 ||
          positionBlocked(
            state,
            px,
            pz,
            Math.max(feet, floor),
            1.8,
            RADIUS + 0.08,
          )
        ) {
          passable = false;
          break;
        }
      }
      if (passable)
        node.neighbors.push({
          index: neighborIndex,
          cost: Math.hypot(dx, dz) + Math.abs(node.y - other.y) * 0.3,
        });
    }
  }
  state._nav = {
    version: state.navVersion,
    nodes,
    columns,
    rows,
    startX,
    startZ,
    cell,
  };
  return state._nav;
}
function nearestNode(nav, position) {
  const baseX = clamp(
    Math.round((position.x - nav.startX) / nav.cell),
    0,
    nav.columns - 1,
  );
  const baseZ = clamp(
    Math.round((position.z - nav.startZ) / nav.cell),
    0,
    nav.rows - 1,
  );
  let best = -1;
  let score = Infinity;
  for (let dz = -3; dz <= 3; dz++) {
    for (let dx = -3; dx <= 3; dx++) {
      const x = baseX + dx;
      const z = baseZ + dz;
      if (x < 0 || z < 0 || x >= nav.columns || z >= nav.rows) continue;
      const index = z * nav.columns + x;
      const node = nav.nodes[index];
      if (node.blocked || !node.neighbors.length) continue;
      const distance =
        Math.hypot(node.x - position.x, node.z - position.z) +
        Math.abs(node.y - (position.y || 0)) * 4;
      if (distance < score) {
        score = distance;
        best = index;
      }
    }
  }
  return best;
}
export function findPath(state, from, to) {
  const nav = buildNavigation(state);
  const start = nearestNode(nav, from);
  const goal = nearestNode(nav, to);
  if (start < 0 || goal < 0 || start === goal) return [];
  const open = [start];
  const closed = new Set();
  const parents = new Map();
  const cost = new Map([[start, 0]]);
  const target = nav.nodes[goal];
  const heuristic = (index) =>
    Math.hypot(
      nav.nodes[index].ix - target.ix,
      nav.nodes[index].iz - target.iz,
    );
  let iterations = 0;
  while (open.length && iterations++ < nav.nodes.length) {
    let best = 0;
    for (let i = 1; i < open.length; i++)
      if (
        cost.get(open[i]) + heuristic(open[i]) <
        cost.get(open[best]) + heuristic(open[best])
      )
        best = i;
    const current = open.splice(best, 1)[0];
    if (current === goal) {
      const result = [];
      let cursor = goal;
      while (cursor !== start) {
        const node = nav.nodes[cursor];
        result.push({ x: node.x, y: node.y, z: node.z });
        cursor = parents.get(cursor);
      }
      return result.reverse();
    }
    closed.add(current);
    for (const edge of nav.nodes[current].neighbors) {
      if (closed.has(edge.index)) continue;
      const candidate = cost.get(current) + edge.cost;
      if (candidate < (cost.get(edge.index) ?? Infinity)) {
        cost.set(edge.index, candidate);
        parents.set(edge.index, current);
        if (!open.includes(edge.index)) open.push(edge.index);
      }
    }
  }
  return [];
}

function updateBot(state, bot, dt, events) {
  if (!bot.alive) return;
  if (state.options.mode === "training") {
    // Two static targets and two slow moving targets, all unarmed in practice.
    const moving = bot.spawnIndex % 2 === 1;
    const motion = moving
      ? Math.sin(state.elapsed * 0.7 + bot.spawnIndex) * 0.4
      : 0;
    moveActor(
      state,
      bot,
      {
        moveX: motion,
        moveZ: moving
          ? Math.cos(state.elapsed * 0.7 + bot.spawnIndex) * 0.16
          : 0,
      },
      dt,
    );
    bot.yaw = Math.atan2(state.player.x - bot.x, state.player.z - bot.z);
    return;
  }
  const enemies = allActors(state).filter(
    (actor) => actor.alive && actor.team !== bot.team,
  );
  if (!enemies.length) {
    moveActor(state, bot, {}, dt);
    return;
  }
  bot.aiTimer -= dt;
  bot.pathTimer -= dt;
  let target = actorById(state, bot.aiTarget);
  if (bot.aiTimer <= 0 || !target?.alive) {
    bot.aiTimer = 0.2 + random(state) * 0.16;
    let nearest = null;
    let best = Infinity;
    for (const enemy of enemies) {
      const distance = distance2(bot, enemy);
      const visible =
        distance < WEAPONS[bot.weapon].range &&
        hasLineOfSight(state, eye(bot), {
          x: enemy.x,
          y: enemy.y + enemy.height * 0.65,
          z: enemy.z,
        });
      const score = distance + (visible ? 0 : 30);
      if (score < best) {
        nearest = enemy;
        best = score;
      }
    }
    if (nearest?.id !== bot.aiTarget) {
      bot.aiTarget = nearest?.id || null;
      bot.aiReaction = DIFFICULTIES[state.options.difficulty].reaction;
      bot.aiVisible = false;
    }
    target = nearest;
  }
  if (!target) return;
  const targetPoint = {
    x: target.x,
    y: target.y + target.height * 0.64,
    z: target.z,
  };
  const visible = hasLineOfSight(state, eye(bot), targetPoint);
  if (visible && !bot.aiVisible)
    bot.aiReaction = DIFFICULTIES[state.options.difficulty].reaction;
  bot.aiVisible = visible;
  bot.aiReaction -= dt;
  const distance = distance2(bot, target);
  let destination = target;
  if (state.options.mode === "control") {
    const choices = state.objectives.filter(
      (objective) => objective.owner !== bot.team || objective.contested,
    );
    if (choices.length) {
      destination = choices.reduce(
        (best, node) =>
          distance2(bot, node) < distance2(bot, best) ? node : best,
        choices[bot.spawnIndex % choices.length],
      );
    } else
      destination = state.objectives[bot.spawnIndex % state.objectives.length];
  }
  let moveX = 0;
  let moveZ = 0;
  const preferredRange =
    bot.weapon === "shotgun" ? 7 : bot.weapon === "sniper" ? 26 : 15;
  const holdingObjective =
    state.options.mode === "control" &&
    distance2(bot, destination) < destination.radius * 0.55;
  const wantsEngage =
    visible &&
    distance < preferredRange + 4 &&
    state.options.mode !== "control";
  if (wantsEngage || holdingObjective) {
    if (visible && !holdingObjective) {
      const towardX = (target.x - bot.x) / Math.max(distance, 0.01);
      const towardZ = (target.z - bot.z) / Math.max(distance, 0.01);
      const retreat =
        distance < preferredRange * 0.45
          ? -0.55
          : distance > preferredRange
            ? 0.4
            : 0;
      const strafe =
        Math.sin(state.elapsed * 1.6 + bot.spawnIndex * 2) * 0.48 * bot.strafe;
      moveX = towardX * retreat + towardZ * strafe;
      moveZ = towardZ * retreat - towardX * strafe;
    }
  } else {
    if (bot.pathTimer <= 0 || !bot.path.length) {
      bot.path = findPath(state, bot, destination);
      bot.pathIndex = 0;
      bot.pathTimer = 0.8 + random(state) * 0.4;
    }
    while (
      bot.pathIndex < bot.path.length &&
      distance2(bot, bot.path[bot.pathIndex]) < 0.55
    )
      bot.pathIndex++;
    const next = bot.path[bot.pathIndex] || destination;
    const length = distance2(bot, next);
    if (length > 0.3) {
      moveX = (next.x - bot.x) / length;
      moveZ = (next.z - bot.z) / length;
    }
    if (next.y > bot.y + 0.45 && bot.onGround) jump(state, bot, events);
  }
  const dx = target.x - bot.x;
  const dz = target.z - bot.z;
  bot.yaw = Math.atan2(dx, dz);
  bot.pitch = Math.atan2(
    targetPoint.y - (bot.y + bot.eyeHeight),
    Math.hypot(dx, dz),
  );
  const input = {
    moveX,
    moveZ,
    aim: visible && distance > 15,
    sprint: !visible && distance > 20,
    fire: visible,
  };
  const before = { x: bot.x, z: bot.z };
  moveActor(state, bot, input, dt);
  if (Math.hypot(moveX, moveZ) > 0.5 && distance2(before, bot) < 0.01)
    bot.stuckTimer += dt;
  else bot.stuckTimer = Math.max(0, bot.stuckTimer - dt * 2);
  if (bot.stuckTimer > 0.7) {
    bot.pathTimer = 0;
    bot.strafe *= -1;
    jump(state, bot, events);
    bot.stuckTimer = 0;
  }
  const ammo = bot.ammo[bot.weapon];
  if (!ammo.mag || (ammo.mag < WEAPONS[bot.weapon].magSize * 0.35 && !visible))
    startReload(state, bot, events);
  if (ammo.reserve <= 0 && ammo.mag <= 0) {
    bot.weapon = "pistol";
    bot.ammo.pistol.reserve += 40;
  }
  if (
    visible &&
    distance < WEAPONS[bot.weapon].range &&
    bot.aiReaction <= 0 &&
    target.invulnerable <= 0
  )
    shoot(state, bot, events);
}

function updatePickups(state, dt, events) {
  for (const pickup of state.pickups) {
    if (!pickup.active) {
      pickup.timer = Math.max(0, pickup.timer - dt);
      if (!pickup.timer) pickup.active = true;
      continue;
    }
    // Human priority gives a predictable reward when a teammate shares the pad.
    for (const actor of allActors(state)) {
      if (
        !actor.alive ||
        distance2(actor, pickup) > 1.45 ||
        Math.abs(actor.y - pickup.y) > 1.25
      )
        continue;
      let collected = false;
      if (pickup.type === "health" && actor.health < actor.maxHealth) {
        actor.health = Math.min(actor.maxHealth, actor.health + 45);
        collected = true;
      }
      if (pickup.type === "armor" && actor.armor < actor.maxArmor) {
        actor.armor = Math.min(actor.maxArmor, actor.armor + 45);
        collected = true;
      }
      if (pickup.type === "grenade" && actor.grenades < 3) {
        actor.grenades = Math.min(3, actor.grenades + 1);
        collected = true;
      }
      if (pickup.type === "ammo") {
        for (const id of WEAPON_ORDER) {
          const ammo = actor.ammo[id];
          const maximum = WEAPONS[id].reserve;
          if (ammo.reserve < maximum) {
            ammo.reserve = Math.min(
              maximum,
              ammo.reserve + WEAPONS[id].magSize * 2,
            );
            collected = true;
          }
        }
      }
      if (!collected) continue;
      pickup.active = false;
      pickup.timer = pickup.respawn || 15;
      if (actor.id === "player") {
        const label = {
          health: "生命 +45",
          armor: "护甲 +45",
          ammo: "弹药已补给",
          grenade: "手雷 +1",
        }[pickup.type];
        events.push(
          { type: "sound", name: "pickup" },
          { type: "toast", message: label, tone: "good" },
        );
      }
      break;
    }
  }
}
function updateObjectives(state, dt, events) {
  if (state.options.mode !== "control") return;
  for (const objective of state.objectives) {
    const teams = [[], []];
    for (const actor of allActors(state))
      if (
        actor.alive &&
        distance2(actor, objective) <= objective.radius &&
        Math.abs(
          actor.y - supportHeight(state, objective.x, objective.z, Infinity),
        ) < 2
      )
        teams[actor.team].push(actor);
    objective.contested = teams[0].length > 0 && teams[1].length > 0;
    if (objective.contested) continue;
    const team = teams[0].length ? 0 : teams[1].length ? 1 : -1;
    if (team < 0) {
      objective.progress = Math.max(0, objective.progress - dt * 0.07);
      if (objective.progress === 0) objective.capturing = -1;
      continue;
    }
    if (objective.owner === team) {
      objective.progress = Math.max(0, objective.progress - dt * 0.5);
      if (!objective.progress) objective.capturing = -1;
      continue;
    }
    if (objective.capturing !== team) {
      objective.progress = Math.max(0, objective.progress - dt * 0.35);
      if (objective.progress > 0) continue;
      objective.capturing = team;
    }
    objective.progress = Math.min(
      1,
      objective.progress + (dt * Math.min(2, teams[team].length)) / 5,
    );
    if (objective.progress >= 1) {
      objective.owner = team;
      objective.progress = 0;
      objective.capturing = -1;
      for (const actor of teams[team]) actor.stats.captures++;
      events.push(
        { type: "objective", id: objective.id, team },
        {
          type: "toast",
          message: `${team === 0 ? "蓝方" : "红方"}已占领 ${objective.id} 点`,
          tone: team === 0 ? "good" : "bad",
        },
      );
      if (team === 0) events.push({ type: "sound", name: "capture" });
    }
  }
  state.objectiveTimer += dt;
  while (state.objectiveTimer >= 1) {
    state.objectiveTimer -= 1;
    for (const objective of state.objectives)
      if (objective.owner >= 0 && !objective.contested)
        state.score[objective.owner]++;
    if (state.score.some((score) => score >= (MODES.control.target || 150)))
      finish(
        state,
        state.score[0] === state.score[1]
          ? null
          : state.score[0] > state.score[1]
            ? 0
            : 1,
        "控制点积分达到目标",
        events,
      );
  }
}
function checkSurvival(state, events) {
  if (state.options.mode !== "survival" || state.phase !== "playing") return;
  if (state.bots.some((bot) => bot.team === 1 && bot.alive)) return;
  if (state.wave >= state.maxWaves)
    finish(state, 0, "五波增援全部击退 · 前线守住了", events);
  else {
    state.phase = "intermission";
    state.grenades = [];
    events.push(
      { type: "intermission" },
      {
        type: "toast",
        message: `第 ${state.wave} 波完成 · 选择补给升级`,
        tone: "good",
      },
    );
  }
}

function simulationTick(state, input, dt, events, firstTick) {
  const player = state.player;
  if (Number.isFinite(input.yaw)) player.yaw = input.yaw;
  if (Number.isFinite(input.pitch))
    player.pitch = clamp(input.pitch, -1.48, 1.48);
  if (state.phase === "countdown") {
    state.countdown = Math.max(0, state.countdown - dt);
    if (state.countdown === 0) {
      state.phase = "playing";
      events.push({
        type: "toast",
        message:
          state.options.mode === "training"
            ? "靶场开放 · 按 1–5 体验全部武器"
            : "行动开始 · 保持移动，善用掩体",
        tone: "info",
      });
    }
    return;
  }
  if (state.phase !== "playing") return;
  state.elapsed += dt;
  state.waveTimer += dt;
  const duration = MODES[state.options.mode].timeLimit || 0;
  if (duration > 0) state.remaining = Math.max(0, duration - state.elapsed);
  for (const actor of allActors(state)) tickActor(state, actor, dt, events);
  if (player.alive) {
    if (firstTick) {
      if (input.reload) startReload(state, player, events);
      if (input.jump) jump(state, player, events);
      if (input.grenade) throwGrenade(state, player, events);
      if (input.slide) slide(player);
      if (input.melee) melee(state, player, events);
    }
    moveActor(state, player, input, dt);
    if (input.fire) shoot(state, player, events);
  }
  for (const bot of state.bots) {
    if (state.phase !== "playing") break;
    updateBot(state, bot, dt, events);
  }
  if (state.phase !== "playing") return;
  updateGrenades(state, dt, events);
  updatePickups(state, dt, events);
  updateObjectives(state, dt, events);
  checkSurvival(state, events);
  if (duration > 0 && state.remaining <= 0 && state.phase === "playing")
    finish(
      state,
      state.score[0] === state.score[1]
        ? null
        : state.score[0] > state.score[1]
          ? 0
          : 1,
      "比赛时间结束",
      events,
    );
  state.stats.accuracy = player.stats.shots
    ? Math.round((player.stats.hits / player.stats.shots) * 100)
    : 0;
}
export function stepMatch(state, input = {}, dt = STEP) {
  const events = [];
  if (state.phase === "finished" || state.phase === "intermission")
    return events;
  let remaining = clamp(validNumber(dt), 0, 0.12);
  let firstTick = true;
  while (remaining > EPSILON) {
    const step = Math.min(STEP, remaining);
    simulationTick(state, input, step, events, firstTick);
    remaining -= step;
    firstTick = false;
  }
  return events;
}
