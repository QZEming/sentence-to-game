import {
  LEVELS,
  TOWERS,
  HEROES,
  ENEMIES,
  SPELLS,
  DIFFICULTIES,
} from "./data.js";

const EPSILON = 1e-8;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const distanceSq = (a, b) => (a.x - b.x) ** 2 + (a.z - b.z) ** 2;
const active = (enemy) => enemy.hp > 0 && !enemy.dead && !enemy.leaked;
const id = (state, prefix) => prefix + state._nextId++;

export function getLevel(levelId) {
  return LEVELS.find((level) => level.id === levelId) || LEVELS[0];
}

function describePath(points) {
  const lengths = [];
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    const segment = Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].z - points[i - 1].z,
    );
    lengths.push(segment);
    length += segment;
  }
  return { points, lengths, length };
}

function samplePath(path, distance) {
  let remaining = clamp(distance, 0, path.length);
  for (let i = 0; i < path.lengths.length; i++) {
    const length = path.lengths[i];
    if (remaining <= length || i === path.lengths.length - 1) {
      const a = path.points[i],
        b = path.points[i + 1];
      const t = length > 0 ? clamp(remaining / length, 0, 1) : 0;
      return {
        x: a.x + (b.x - a.x) * t,
        z: a.z + (b.z - a.z) * t,
        heading: Math.atan2(b.x - a.x, b.z - a.z),
      };
    }
    remaining -= length;
  }
  return { ...path.points.at(-1), heading: 0 };
}

export function getTowerStats(tower) {
  const type = Object.hasOwn(TOWERS, tower?.type) ? tower.type : "carrot";
  const data = TOWERS[type];
  const level = clamp(Math.floor(Number(tower?.level) || 1), 1, 3);
  const branch =
    level === 3 && ["a", "b"].includes(tower?.branch) ? tower.branch : null;
  const upgradeCost =
    level === 1
      ? Math.round(data.cost * 0.9)
      : level === 2
        ? Math.round(data.cost * 1.45)
        : null;
  const stats = {
    type,
    level,
    branch,
    damage: data.damage * [1, 1.6, 2.5][level - 1],
    range: data.range + (level - 1) * 0.35,
    interval: data.interval * [1, 0.9, 0.82][level - 1],
    upgradeCost,
    branchCosts: {
      a: Math.round(data.cost * 1.45),
      b: Math.round(data.cost * 1.45),
    },
    splash: type === "berry" ? 2.1 : 0,
    chain: type === "spark" ? 3 : 1,
    chainRange: 3.6,
    slow: type === "frost" ? 0.55 : 1,
    slowDuration: type === "frost" ? 2.5 : 0,
    dotDps: type === "honey" ? 9 * [1, 1.7, 2.7][level - 1] : 0,
    dotDuration: type === "honey" ? 5 : 0,
    income: type === "bloom" ? [12, 18, 22][level - 1] : 0,
    buff: type === "bloom" ? [1.1, 1.16, 1.2][level - 1] : 1,
    rangeBuff: 1,
    stun: 0,
    magic: ["spark", "frost", "honey"].includes(type),
  };
  if (branch) {
    if (type === "carrot") {
      if (branch === "a") {
        stats.damage *= 1.75;
        stats.range += 2;
        stats.interval *= 1.15;
      } else {
        stats.damage *= 0.82;
        stats.interval *= 0.48;
      }
    } else if (type === "berry") {
      if (branch === "a") {
        stats.splash = 3.25;
        stats.damage *= 1.2;
      } else {
        stats.splash = 2.5;
        stats.dotDps = 15;
        stats.dotDuration = 4;
      }
    } else if (type === "frost") {
      if (branch === "a") {
        stats.slow = 0.28;
        stats.slowDuration = 3.5;
        stats.damage *= 1.3;
      } else {
        stats.splash = 2.7;
        stats.slow = 0.48;
        stats.slowDuration = 3.1;
      }
    } else if (type === "spark") {
      if (branch === "a") {
        stats.chain = 6;
        stats.chainRange = 4.2;
      } else {
        stats.damage *= 1.85;
        stats.chain = 2;
        stats.stun = 0.35;
      }
    } else if (type === "honey") {
      if (branch === "a") {
        stats.splash = 2.4;
        stats.dotDps *= 0.85;
      } else {
        stats.dotDps *= 1.35;
        stats.slow = 0.65;
        stats.slowDuration = 5;
      }
    } else if (type === "bloom") {
      if (branch === "a") {
        stats.income = 32;
        stats.buff = 1.16;
      } else {
        stats.income = 20;
        stats.buff = 1.3;
        stats.rangeBuff = 1.12;
        stats.range += 0.8;
      }
    }
  }
  return stats;
}

export function createGame(options = {}) {
  const level = getLevel(options.levelId);
  const mode = options.mode === "endless" ? "endless" : "story";
  const difficulty = Object.hasOwn(DIFFICULTIES, options.difficulty)
    ? options.difficulty
    : "normal";
  const heroType = Object.hasOwn(HEROES, options.hero) ? options.hero : "momo";
  const paths = level.paths.map(describePath);
  const start = samplePath(paths[0], paths[0].length * 0.62);
  return {
    phase: "build",
    options: { levelId: level.id, mode, difficulty, hero: heroType },
    levelId: level.id,
    time: 0,
    wave: 0,
    totalWaves: level.waves,
    candy: 260,
    lives: 20,
    maxLives: 20,
    mana: 100,
    maxMana: 100,
    kills: 0,
    towers: [],
    enemies: [],
    hero: {
      id: "hero",
      type: heroType,
      x: start.x,
      z: start.z + 1.25,
      targetX: start.x,
      targetZ: start.z + 1.25,
      angle: 0,
      level: 1,
      flash: 0,
      cooldown: 0,
      targetId: null,
    },
    zones: [],
    spellCooldowns: { meteor: 0, frost: 0, bell: 0 },
    waveRemaining: 0,
    autoWave: false,
    buildCountdown: 8,
    stats: {
      spent: 0,
      earned: 0,
      kills: 0,
      casts: 0,
      damage: 0,
      leaks: 0,
      upgrades: 0,
      sold: 0,
      waves: 0,
      combatTime: 0,
    },
    result: null,
    bellRemaining: 0,
    _paths: paths,
    _queue: [],
    _spawnTimer: 0,
    _nextId: 1,
  };
}

function enemyDefinition(state, type, pathIndex, distance = 0, extra = {}) {
  const source = ENEMIES[type];
  const level = getLevel(state.levelId);
  const difficulty = DIFFICULTIES[state.options.difficulty];
  const endless =
    state.options.mode === "endless"
      ? Math.max(0, state.wave - state.totalWaves)
      : 0;
  const scale =
    (1 + level.index * 0.12 + Math.max(0, state.wave - 1) * 0.105) *
    difficulty.health *
    Math.pow(1.14, endless);
  const maxHp =
    source.health * scale * (type === "boss" ? 1 + level.index * 0.12 : 1);
  const path = state._paths[pathIndex];
  const position = samplePath(path, distance);
  return {
    id: id(state, "e"),
    type,
    ...position,
    hp: maxHp,
    maxHp,
    distance,
    pathIndex,
    pathLength: path.length,
    speed:
      source.speed * difficulty.speed * (1 + Math.min(0.35, endless * 0.015)),
    flying: !!source.flying,
    slow: 1,
    boss: type === "boss",
    armor: source.armor || 0,
    reward: source.reward,
    damage: source.damage,
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
    ...extra,
  };
}

function createWave(state) {
  const level = getLevel(state.levelId);
  const wave = state.wave;
  const count = 6 + wave * 2 + level.index * 2;
  const pool = ["puff", "puff"];
  if (wave >= 2) pool.push("hopper");
  if (wave >= 3 || level.index >= 1) pool.push("shell");
  if (level.index >= 1 && wave >= 2) pool.push("moth");
  if (level.index >= 1 && wave >= 4) pool.push("shaman");
  if (level.index >= 2 && wave >= 3) pool.push("splitter");
  const queue = [];
  for (let i = 0; i < count; i++) {
    const type =
      pool[(i * 3 + wave + Math.floor(i / pool.length)) % pool.length];
    queue.push({ type, pathIndex: i % state._paths.length });
  }
  const bossWave =
    state.options.mode === "story" ? wave === state.totalWaves : wave % 5 === 0;
  if (bossWave) {
    queue.splice(Math.floor(count * 0.35), 0, {
      type: "boss",
      pathIndex: (wave - 1) % state._paths.length,
    });
    if (level.index >= 4)
      queue.splice(Math.floor(count * 0.6), 0, {
        type: "shaman",
        pathIndex: 0,
      });
  }
  return queue;
}

function startWave(state, events) {
  const bonus =
    state.wave > 0 ? Math.max(0, Math.ceil(state.buildCountdown * 1.5)) : 0;
  state.candy += bonus;
  state.stats.earned += bonus;
  state.wave++;
  state.phase = "wave";
  state.buildCountdown = 0;
  state._queue = createWave(state);
  state._spawnTimer = 0;
  state.waveRemaining = state._queue.length;
  state.hero.level = 1 + Math.floor((state.wave - 1) / 3);
  events.push({
    type: "waveStart",
    wave: state.wave,
    amount: bonus,
    count: state._queue.length,
  });
}

function slowEnemy(state, enemy, factor, duration) {
  if (!active(enemy)) return;
  const resisted = enemy.boss ? 1 - (1 - factor) * 0.65 : factor;
  if (enemy.slowUntil <= state.time) enemy.slowFactor = resisted;
  else enemy.slowFactor = Math.min(enemy.slowFactor, resisted);
  enemy.slowUntil = Math.max(enemy.slowUntil, state.time + duration);
}

function applyDot(enemy, dps, duration, sourceId) {
  if (!active(enemy) || dps <= 0) return;
  if (dps >= enemy.dotDps) {
    enemy.dotDps = dps;
    enemy.dotSource = sourceId;
  }
  enemy.dotRemaining = Math.max(enemy.dotRemaining, duration);
}

function killEnemy(state, enemy, events, sourceId) {
  if (enemy.dead || enemy.leaked) return;
  enemy.dead = true;
  enemy.hp = 0;
  state.kills++;
  state.stats.kills++;
  state.candy += enemy.reward;
  state.stats.earned += enemy.reward;
  state.mana = Math.min(state.maxMana, state.mana + (enemy.boss ? 12 : 1.5));
  events.push({
    type: "kill",
    id: enemy.id,
    targetId: enemy.id,
    enemyType: enemy.type,
    x: enemy.x,
    z: enemy.z,
    amount: enemy.reward,
    boss: enemy.boss,
    sourceId,
  });
  if (enemy.type === "splitter" && !enemy.mini) {
    for (let i = 0; i < 2; i++) {
      const childDistance = Math.max(0, enemy.distance - i * 0.75);
      const child = enemyDefinition(
        state,
        "puff",
        enemy.pathIndex,
        childDistance,
      );
      child.maxHp *= 0.55;
      child.hp = child.maxHp;
      child.speed *= 1.25;
      child.reward = 4;
      child.mini = true;
      state.enemies.push(child);
      events.push({
        type: "spawn",
        id: child.id,
        enemyType: child.type,
        x: child.x,
        z: child.z,
        mini: true,
      });
    }
  }
}

function damageEnemy(
  state,
  enemy,
  damage,
  magic,
  events,
  sourceId,
  hitEvent = true,
) {
  if (!active(enemy) || !Number.isFinite(damage) || damage <= 0) return 0;
  const actual = Math.min(enemy.hp, damage * (magic ? 1 : 1 - enemy.armor));
  enemy.hp = Math.max(0, enemy.hp - actual);
  state.stats.damage += actual;
  if (hitEvent) {
    enemy.flash = 0.18;
    events.push({
      type: "hit",
      id: enemy.id,
      targetId: enemy.id,
      sourceId,
      x: enemy.x,
      z: enemy.z,
      amount: actual,
      damage: actual,
    });
  }
  if (enemy.hp <= EPSILON) killEnemy(state, enemy, events, sourceId);
  return actual;
}

function emitShot(events, from, to, kind, color, sourceId, damage) {
  events.push({
    type: "shot",
    from: { x: from.x, z: from.z },
    to: { x: to.x, z: to.z },
    kind,
    color,
    sourceId,
    targetId: to.id,
    damage,
  });
}

function selectTarget(
  state,
  origin,
  range,
  priority,
  groundOnly = false,
  freshHoney = false,
) {
  let candidates = state.enemies.filter(
    (enemy) =>
      active(enemy) &&
      (!groundOnly || !enemy.flying) &&
      distanceSq(origin, enemy) <= range * range,
  );
  if (freshHoney && candidates.some((enemy) => enemy.dotRemaining < 1.5))
    candidates = candidates.filter((enemy) => enemy.dotRemaining < 1.5);
  candidates.sort((a, b) => {
    if (priority === "strong")
      return (
        b.hp - a.hp || a.pathLength - a.distance - (b.pathLength - b.distance)
      );
    if (priority === "near")
      return distanceSq(origin, a) - distanceSq(origin, b);
    return a.pathLength - a.distance - (b.pathLength - b.distance);
  });
  return candidates[0] || null;
}

function attackTower(state, tower, stats, target, events) {
  const color = TOWERS[tower.type].color;
  tower.angle = Math.atan2(target.x - tower.x, target.z - tower.z);
  tower.flash = 0.24;
  tower.targetId = target.id;
  let targets = [target];
  if (stats.splash > 0)
    targets = state.enemies.filter(
      (enemy) =>
        active(enemy) && distanceSq(target, enemy) <= stats.splash ** 2,
    );
  if (tower.type === "spark") {
    let previous = tower;
    const hit = new Set();
    let next = target;
    for (let i = 0; i < stats.chain && next; i++) {
      const enemy = next;
      hit.add(enemy.id);
      const amount = damageEnemy(
        state,
        enemy,
        stats.damage * Math.pow(0.88, i),
        true,
        events,
        tower.id,
      );
      emitShot(events, previous, enemy, tower.type, color, tower.id, amount);
      if (stats.stun > 0 && active(enemy))
        enemy.stunUntil = Math.max(
          enemy.stunUntil,
          state.time + stats.stun * (enemy.boss ? 0.5 : 1),
        );
      previous = enemy;
      next = state.enemies
        .filter(
          (candidate) =>
            active(candidate) &&
            !hit.has(candidate.id) &&
            distanceSq(enemy, candidate) <= stats.chainRange ** 2,
        )
        .sort((a, b) => distanceSq(enemy, a) - distanceSq(enemy, b))[0];
    }
    return;
  }
  let totalDamage = 0;
  for (const enemy of targets) {
    totalDamage += damageEnemy(
      state,
      enemy,
      stats.damage,
      stats.magic,
      events,
      tower.id,
    );
    if (stats.slow < 1) slowEnemy(state, enemy, stats.slow, stats.slowDuration);
    if (stats.dotDps > 0)
      applyDot(enemy, stats.dotDps, stats.dotDuration, tower.id);
  }
  emitShot(events, tower, target, tower.type, color, tower.id, totalDamage);
}

function towerAuras(state, tower) {
  let speed = state.bellRemaining > 0 ? 1.35 : 1;
  let bloomSpeed = 1,
    range = 1;
  for (const other of state.towers) {
    if (other.type !== "bloom" || other.id === tower.id) continue;
    const aura = getTowerStats(other);
    if (distanceSq(tower, other) <= aura.range ** 2) {
      bloomSpeed = Math.max(bloomSpeed, aura.buff);
      range = Math.max(range, aura.rangeBuff);
    }
  }
  return { speed: speed * bloomSpeed, range };
}

function updateTowers(state, dt, events) {
  for (const tower of state.towers) {
    tower.flash = Math.max(0, tower.flash - dt);
    if (tower.type === "bloom") continue;
    const stats = getTowerStats(tower);
    const aura = towerAuras(state, tower);
    tower.cooldown -= dt * aura.speed;
    if (tower.cooldown > EPSILON) continue;
    const target = selectTarget(
      state,
      tower,
      stats.range * aura.range,
      tower.priority,
      false,
      tower.type === "honey",
    );
    if (!target) {
      tower.cooldown = 0;
      tower.targetId = null;
      continue;
    }
    tower.cooldown = Math.max(0, tower.cooldown) + stats.interval;
    attackTower(state, tower, stats, target, events);
  }
}

function moveHero(state, dt) {
  const hero = state.hero;
  const data = HEROES[hero.type];
  const dx = hero.targetX - hero.x,
    dz = hero.targetZ - hero.z;
  const distance = Math.hypot(dx, dz);
  if (distance > 0.01) {
    const amount = Math.min(distance, data.speed * dt);
    hero.x += (dx / distance) * amount;
    hero.z += (dz / distance) * amount;
    hero.angle = Math.atan2(dx, dz);
  }
  hero.moving = distance > 0.05;
  hero.flash = Math.max(0, hero.flash - dt);
}

function attackHero(state, dt, events) {
  const hero = state.hero;
  const data = HEROES[hero.type];
  hero.cooldown -= dt * (state.bellRemaining > 0 ? 1.35 : 1);
  if (hero.cooldown > EPSILON) return;
  const target = selectTarget(
    state,
    hero,
    data.range,
    "first",
    hero.type === "bao",
  );
  if (!target) {
    hero.cooldown = 0;
    hero.targetId = null;
    return;
  }
  hero.cooldown = data.interval;
  hero.targetId = target.id;
  hero.angle = Math.atan2(target.x - hero.x, target.z - hero.z);
  hero.flash = 0.28;
  const targets =
    hero.type === "pip"
      ? state.enemies.filter(
          (enemy) => active(enemy) && distanceSq(target, enemy) <= 2.1 ** 2,
        )
      : [target];
  let amount = 0;
  for (const enemy of targets) {
    amount += damageEnemy(
      state,
      enemy,
      data.damage * (1 + (hero.level - 1) * 0.18),
      hero.type === "pip",
      events,
      hero.id,
    );
    if (hero.type === "bao") slowEnemy(state, enemy, 0.6, 1.6);
  }
  emitShot(events, hero, target, hero.type, data.color, hero.id, amount);
}

function finishGame(state, won, events) {
  state.phase = won ? "won" : "lost";
  state.waveRemaining =
    state.enemies.filter(active).length + state._queue.length;
  const stars = won
    ? state.lives === state.maxLives
      ? 3
      : state.lives >= state.maxLives * 0.6
        ? 2
        : 1
    : 0;
  state.result = {
    won,
    stars,
    waves: state.stats.waves,
    wave: state.wave,
    kills: state.kills,
    lives: state.lives,
    maxLives: state.maxLives,
    time: state.time,
    combatTime: state.stats.combatTime,
    spent: state.stats.spent,
    earned: state.stats.earned,
    casts: state.stats.casts,
    damage: state.stats.damage,
    mode: state.options.mode,
    levelId: state.levelId,
  };
  events.push({ type: won ? "win" : "lose", ...state.result });
}

function clearWave(state, events) {
  state.stats.waves++;
  let income = 30 + state.wave * 4 + getLevel(state.levelId).index * 3;
  let bloomIncome = 0;
  for (const tower of state.towers) {
    if (tower.type === "bloom") {
      const amount = getTowerStats(tower).income;
      bloomIncome += amount;
      tower.flash = 0.6;
      events.push({
        type: "income",
        sourceId: tower.id,
        x: tower.x,
        z: tower.z,
        amount,
      });
    }
  }
  income += bloomIncome;
  state.candy += income;
  state.stats.earned += income;
  state.mana = Math.min(state.maxMana, state.mana + 8);
  events.push({
    type: "waveClear",
    wave: state.wave,
    amount: income,
    bloomIncome,
  });
  state.waveRemaining = 0;
  state.zones = [];
  state.bellRemaining = 0;
  if (state.options.mode === "story" && state.wave >= state.totalWaves) {
    finishGame(state, true, events);
  } else {
    state.phase = "build";
    state.buildCountdown = 8;
  }
}

function step(state, dt, events) {
  state.time += dt;
  moveHero(state, dt);
  if (state.phase === "build") {
    for (const tower of state.towers)
      tower.flash = Math.max(0, tower.flash - dt);
    if (state.autoWave) {
      state.buildCountdown = Math.max(0, state.buildCountdown - dt);
      if (state.buildCountdown <= EPSILON) startWave(state, events);
    }
    return;
  }
  state.stats.combatTime += dt;
  state.mana = Math.min(state.maxMana, state.mana + dt * 1.5);
  for (const spell of Object.keys(SPELLS))
    state.spellCooldowns[spell] = Math.max(0, state.spellCooldowns[spell] - dt);
  state.bellRemaining = Math.max(0, state.bellRemaining - dt);
  for (const zone of state.zones) zone.remaining -= dt;
  state.zones = state.zones.filter((zone) => zone.remaining > 0);
  state._spawnTimer -= dt;
  while (state._queue.length && state._spawnTimer <= EPSILON) {
    const next = state._queue.shift();
    const enemy = enemyDefinition(state, next.type, next.pathIndex);
    state.enemies.push(enemy);
    events.push({
      type: "spawn",
      id: enemy.id,
      enemyType: enemy.type,
      x: enemy.x,
      z: enemy.z,
      boss: enemy.boss,
    });
    state._spawnTimer += Math.max(0.42, 1.0 - state.wave * 0.035);
  }
  for (const enemy of [...state.enemies]) {
    if (!active(enemy)) continue;
    enemy.flash = Math.max(0, enemy.flash - dt);
    if (enemy.dotRemaining > 0) {
      const duration = Math.min(dt, enemy.dotRemaining);
      enemy.dotRemaining = Math.max(0, enemy.dotRemaining - dt);
      damageEnemy(
        state,
        enemy,
        enemy.dotDps * duration,
        true,
        events,
        enemy.dotSource,
        false,
      );
      if (!active(enemy)) continue;
      if (enemy.dotRemaining <= 0) {
        enemy.dotDps = 0;
        enemy.dotSource = null;
      }
    }
    if (enemy.type === "shaman") {
      enemy.healTimer -= dt;
      if (enemy.healTimer <= 0) {
        enemy.healTimer += 3.2;
        for (const friend of state.enemies) {
          if (
            active(friend) &&
            distanceSq(enemy, friend) <= 3.8 ** 2 &&
            friend.hp < friend.maxHp
          ) {
            const amount = Math.min(
              friend.maxHp - friend.hp,
              friend.maxHp * 0.12,
            );
            friend.hp += amount;
            events.push({
              type: "heal",
              id: friend.id,
              sourceId: enemy.id,
              x: friend.x,
              z: friend.z,
              amount,
            });
          }
        }
      }
    }
    let slow = enemy.slowUntil > state.time ? enemy.slowFactor : 1;
    if (enemy.slowUntil <= state.time) enemy.slowFactor = 1;
    for (const zone of state.zones) {
      if (zone.type === "frost" && distanceSq(enemy, zone) <= zone.radius ** 2)
        slow = Math.min(slow, enemy.boss ? 0.57 : 0.34);
    }
    if (enemy.stunUntil > state.time) slow = 0;
    enemy.slow = slow;
    enemy.distance = Math.min(
      enemy.pathLength,
      enemy.distance + enemy.speed * slow * dt,
    );
    Object.assign(
      enemy,
      samplePath(state._paths[enemy.pathIndex], enemy.distance),
    );
    if (enemy.distance >= enemy.pathLength - EPSILON) {
      enemy.leaked = true;
      state.lives = Math.max(0, state.lives - enemy.damage);
      state.stats.leaks++;
      events.push({
        type: "leak",
        id: enemy.id,
        targetId: enemy.id,
        x: enemy.x,
        z: enemy.z,
        amount: enemy.damage,
      });
      if (state.lives <= 0) {
        state.enemies = state.enemies.filter(active);
        finishGame(state, false, events);
        return;
      }
    }
  }
  updateTowers(state, dt, events);
  attackHero(state, dt, events);
  state.enemies = state.enemies.filter(active);
  state.waveRemaining = state._queue.length + state.enemies.length;
  if (state.waveRemaining === 0) clearWave(state, events);
}

export function updateGame(state, dt) {
  const events = [];
  if (["won", "lost"].includes(state.phase) || !Number.isFinite(dt) || dt <= 0)
    return events;
  let remaining = Math.min(dt, 0.5);
  while (remaining > EPSILON && !["won", "lost"].includes(state.phase)) {
    const increment = Math.min(remaining, 0.05);
    step(state, increment, events);
    remaining -= increment;
  }
  return events;
}

export function act(state, action) {
  const events = [];
  const failure = (message) => ({ ok: false, message, events: [] });
  const success = (message) => ({ ok: true, message, events });
  if (!action || typeof action !== "object") return failure("请选择一个操作。");
  if (["won", "lost"].includes(state.phase))
    return failure("这一夜已经结束，请开启新的守卫。");
  if (action.type === "build") {
    const pad = getLevel(state.levelId).pads.find(
      (item) => item.id === action.padId,
    );
    if (!pad) return failure("请选择地图上的花形塔位。");
    if (!Object.hasOwn(TOWERS, action.towerType))
      return failure("这座守卫塔还不存在。");
    if (state.towers.some((tower) => tower.padId === pad.id))
      return failure("这里已经有一位守卫啦。");
    const data = TOWERS[action.towerType];
    if (state.candy < data.cost) return failure("糖果不够，再唤醒几只团子吧。");
    const tower = {
      id: id(state, "t"),
      padId: pad.id,
      type: action.towerType,
      level: 1,
      branch: null,
      x: pad.x,
      z: pad.z,
      angle: 0,
      flash: 0.7,
      targetId: null,
      priority: "first",
      spent: data.cost,
      cooldown: 0,
    };
    state.candy -= data.cost;
    state.stats.spent += data.cost;
    state.towers.push(tower);
    events.push({
      type: "build",
      id: tower.id,
      towerId: tower.id,
      padId: pad.id,
      towerType: tower.type,
      x: tower.x,
      z: tower.z,
      amount: data.cost,
    });
    return success(data.name + "准备好啦。");
  }
  if (["upgrade", "sell", "priority"].includes(action.type)) {
    const tower = state.towers.find((item) => item.id === action.towerId);
    if (!tower) return failure("请先选中一座守卫塔。");
    if (action.type === "priority") {
      if (!["first", "strong", "near"].includes(action.priority))
        return failure("请选择有效的瞄准方式。");
      tower.priority = action.priority;
      events.push({
        type: "priority",
        towerId: tower.id,
        priority: tower.priority,
      });
      return success("瞄准方式已更新。");
    }
    if (action.type === "sell") {
      const refund = Math.floor((tower.spent * 7) / 10);
      state.towers.splice(state.towers.indexOf(tower), 1);
      state.candy += refund;
      state.stats.earned += refund;
      state.stats.sold++;
      events.push({
        type: "sell",
        id: tower.id,
        towerId: tower.id,
        padId: tower.padId,
        x: tower.x,
        z: tower.z,
        amount: refund,
      });
      return success("守卫去休息了，收回 " + refund + " 颗糖果。");
    }
    if (tower.level >= 3) return failure("这座守卫塔已经满级。");
    if (tower.level === 2 && !["a", "b"].includes(action.branch))
      return failure("请选择一种专精。");
    if (tower.level === 1 && action.branch != null)
      return failure("升到二级之后才能选择专精。");
    const stats = getTowerStats(tower);
    const cost =
      tower.level === 2 ? stats.branchCosts[action.branch] : stats.upgradeCost;
    if (state.candy < cost) return failure("升级需要更多糖果。");
    state.candy -= cost;
    state.stats.spent += cost;
    state.stats.upgrades++;
    tower.spent += cost;
    tower.level++;
    tower.branch = tower.level === 3 ? action.branch : null;
    tower.flash = 0.8;
    tower.cooldown = Math.min(tower.cooldown, getTowerStats(tower).interval);
    events.push({
      type: "upgrade",
      id: tower.id,
      towerId: tower.id,
      towerType: tower.type,
      level: tower.level,
      branch: tower.branch,
      x: tower.x,
      z: tower.z,
      amount: cost,
    });
    return success(
      tower.level === 3
        ? TOWERS[tower.type].branches[tower.branch].name + "点亮啦。"
        : "守卫成长到二级啦。",
    );
  }
  if (action.type === "rally") {
    if (
      !Number.isFinite(action.x) ||
      !Number.isFinite(action.z) ||
      Math.abs(action.x) > 14 ||
      Math.abs(action.z) > 11
    )
      return failure("请在岛屿范围内选择集合点。");
    state.hero.targetX = action.x;
    state.hero.targetZ = action.z;
    events.push({ type: "rally", x: action.x, z: action.z });
    return success("伙伴正在赶来。");
  }
  if (action.type === "startWave") {
    if (state.phase !== "build") return failure("先守住眼前这一波吧。");
    startWave(state, events);
    return success("梦游团子出发了。");
  }
  if (action.type === "autoWave") {
    if (typeof action.enabled !== "boolean")
      return failure("自动开波需要开或关。");
    state.autoWave = action.enabled;
    return success(
      state.autoWave ? "准备结束后将自动开波。" : "已关闭自动开波。",
    );
  }
  if (action.type === "spell") {
    if (!Object.hasOwn(SPELLS, action.spell))
      return failure("请选择一种星灯魔法。");
    if (state.phase !== "wave") return failure("团子出发后再使用星灯魔法。");
    const data = SPELLS[action.spell];
    if (state.spellCooldowns[action.spell] > EPSILON)
      return failure("魔法还在休息。");
    if (state.mana + EPSILON < data.cost)
      return failure("星能不足，唤醒团子可以补充星能。");
    if (
      action.spell !== "bell" &&
      (!Number.isFinite(action.x) ||
        !Number.isFinite(action.z) ||
        Math.abs(action.x) > 14 ||
        Math.abs(action.z) > 11)
    )
      return failure("请在岛屿范围内选择施法位置。");
    state.mana = Math.max(0, state.mana - data.cost);
    state.spellCooldowns[action.spell] = data.cooldown;
    state.stats.casts++;
    const point =
      action.spell === "bell" ? getLevel(state.levelId).core : action;
    events.push({
      type: "spell",
      spell: action.spell,
      kind: action.spell,
      x: point.x,
      z: point.z,
      radius: data.radius,
      color: data.color,
      amount: data.cost,
    });
    if (action.spell === "meteor") {
      for (const enemy of [...state.enemies]) {
        if (active(enemy) && distanceSq(action, enemy) <= data.radius ** 2)
          damageEnemy(
            state,
            enemy,
            165 + state.wave * 12,
            true,
            events,
            "meteor",
          );
      }
    } else if (action.spell === "frost") {
      state.zones.push({
        id: id(state, "z"),
        type: "frost",
        x: action.x,
        z: action.z,
        radius: data.radius,
        remaining: 8,
      });
    } else {
      const repair = Math.min(state.maxLives - state.lives, 4);
      state.lives += repair;
      state.bellRemaining = 9;
      state.zones.push({
        id: id(state, "z"),
        type: "bell",
        x: point.x,
        z: point.z,
        radius: 2.4,
        remaining: 1.4,
      });
      events.push({ type: "repair", x: point.x, z: point.z, amount: repair });
    }
    state.enemies = state.enemies.filter(active);
    state.waveRemaining = state.enemies.length + state._queue.length;
    if (state.phase === "wave" && state.waveRemaining === 0)
      clearWave(state, events);
    return success(data.name + "！");
  }
  return failure("这个操作暂时不可用。");
}
