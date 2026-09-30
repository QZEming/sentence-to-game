import {
  WORLD,
  SPAWN,
  heightAt,
  regionAt,
  REGIONS,
  LOCATIONS,
  SOLIDS,
  RESOURCE_SPAWNS,
  ENEMY_SPAWNS,
  CHESTS,
  RECIPES,
  ITEMS,
  WEAPONS,
  ARMORS,
  RUNES,
  RUNE_LABELS,
} from "./data.js";

const TAU = Math.PI * 2;
const WATER = WORLD.water ?? 0.6;
const HALF = WORLD.half ?? 110;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const finite = (v, fallback = 0) => (Number.isFinite(v) ? v : fallback);
const toast = (message, tone = "info") => ({ type: "toast", message, tone });
const sound = (name) => ({ type: "sound", name });
const groundAt = (x, z) => heightAt(x, z);
const owns = (object, id) =>
  typeof id === "string" && Object.hasOwn(object, id);
const clone = (value) => JSON.parse(JSON.stringify(value));
const ENEMY_CONFIG = {
  slime: {
    hp: 34,
    damage: 10,
    speed: 2.35,
    range: 2,
    cooldown: 1.65,
    notice: 16,
  },
  raider: {
    hp: 65,
    damage: 16,
    speed: 3.55,
    range: 2.65,
    cooldown: 1.65,
    notice: 21,
  },
  archer: {
    hp: 44,
    damage: 12,
    speed: 2.6,
    range: 16,
    cooldown: 2.6,
    notice: 24,
  },
  guardian: {
    hp: 360,
    damage: 24,
    speed: 2.65,
    range: 4.8,
    cooldown: 2.5,
    notice: 34,
  },
};
const EMPTY_INPUT = {
  moveX: 0,
  moveZ: 0,
  sprint: false,
  climb: false,
  block: false,
};

function terrainFloor(x, z, feet = Infinity) {
  let floor = groundAt(x, z);
  for (const solid of SOLIDS) {
    if (
      Math.abs(x - solid.x) <= solid.width / 2 &&
      Math.abs(z - solid.z) <= solid.depth / 2
    ) {
      const top = groundAt(solid.x, solid.z) + solid.height;
      if (feet >= top - 0.3) floor = Math.max(floor, top);
    }
  }
  return floor;
}

function addEffect(state, type, x, y, z, radius = 1, life = 0.55) {
  state.effects.push({
    id: `effect-${state.nextId++}`,
    type,
    x,
    y,
    z,
    radius,
    life,
    maxLife: life,
  });
}

function addItem(state, id, amount = 1) {
  if (!Number.isFinite(amount) || amount <= 0) return;
  if (owns(WEAPONS, id)) {
    state.weapons[id] ??= { owned: false, durability: 0 };
    state.weapons[id].owned = true;
    state.weapons[id].durability = WEAPONS[id].durability ?? 60;
  } else if (owns(ARMORS, id)) {
    if (!state.armors.includes(id)) state.armors.push(id);
  } else if (owns(ITEMS, id)) {
    state.inventory[id] = (state.inventory[id] ?? 0) + Math.floor(amount);
  }
}

export function createGame() {
  const x = SPAWN.x,
    z = SPAWN.z;
  const state = {
    version: 1,
    elapsed: 0,
    time: 9,
    weather: "clear",
    nextId: 1,
    player: {
      x,
      y: groundAt(x, z),
      z,
      vx: 0,
      vy: 0,
      vz: 0,
      yaw: Math.PI,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      maxStamina: 100,
      motion: "ground",
      speed: 0,
      attackTimer: 0,
      bowTimer: 0,
      combo: 0,
      comboTimer: 0,
      block: false,
      blockTimer: 0,
      invulnerable: 0,
      weapon: "sword",
      armor: "traveler",
      rune: "bomb",
      runeCooldown: 0,
      mounted: false,
      buffs: { warmth: 0, strength: 0, stamina: 0 },
      dodgeTimer: 0,
      glideTime: 0,
      exhaustTimer: 0,
      hurtTimer: 0,
    },
    inventory: {
      apple: 3,
      mushroom: 2,
      herb: 0,
      meat: 0,
      wood: 0,
      ore: 0,
      coin: 0,
      arrow: 18,
      meal: 0,
      warmMeal: 0,
      staminaMeal: 0,
      spirit: 0,
    },
    weapons: Object.fromEntries(
      Object.entries(WEAPONS).map(([id, item]) => [
        id,
        {
          owned: id === "sword" || id === "bow" || id === "fists",
          durability: item.durability ?? 60,
        },
      ]),
    ),
    armors: ["traveler"],
    progress: {
      beacons: [],
      towers: [],
      discovered: ["camp"],
      talked: false,
      delivery: false,
      bossDefeated: false,
      kills: 0,
    },
    puzzles: { wind: false, ember: false, frost: false },
    enemies: ENEMY_SPAWNS.map((entry) => {
      const config = ENEMY_CONFIG[entry.type] ?? ENEMY_CONFIG.raider;
      return {
        ...entry,
        y: groundAt(entry.x, entry.z),
        yaw: 0,
        hp: config.hp,
        maxHp: config.hp,
        motion: "idle",
        attackTimer: 0.8,
        flash: 0,
        dead: false,
        homeX: entry.x,
        homeZ: entry.z,
        frozen: 0,
        storedDamage: 0,
        windup: 0,
        attackKind: "",
        phase: 1,
        speed: 0,
      };
    }),
    pickups: RESOURCE_SPAWNS.map((entry) => ({
      ...entry,
      y: groundAt(entry.x, entry.z),
      active: true,
    })),
    chests: CHESTS.map((entry) => ({
      ...clone(entry),
      y: groundAt(entry.x, entry.z),
      open: false,
    })),
    objects: [
      {
        id: "wind-block",
        type: "metal",
        x: -47,
        y: groundAt(-47, -1),
        z: -1,
        held: false,
      },
    ],
    projectiles: [],
    effects: [],
    horse: { x: 7, y: groundAt(7, 44), z: 44, yaw: Math.PI, speed: 0 },
    context: null,
    checkpoint: { x, z },
    dead: false,
    victory: false,
    environmentTimer: 0,
    autosaveTimer: 0,
    hintTimer: 0,
    lastRegion: regionAt(x, z),
    stats: {
      distance: 0,
      arrowsFired: 0,
      mealsCooked: 0,
      damageTaken: 0,
      deaths: 0,
    },
  };
  state.weapons.sword ??= { owned: true, durability: 50 };
  state.weapons.bow ??= { owned: true, durability: 80 };
  updateContext(state);
  return state;
}

function die(state, events, reason = "冒险暂时停下了。营地的火还在等你。") {
  if (state.dead) return;
  state.dead = true;
  state.player.health = 0;
  state.player.mounted = false;
  state.player.block = false;
  state.stats.deaths += 1;
  events.push(toast(reason, "warning"), { type: "death" });
}

function hurtPlayer(state, amount, source, events, bypassShield = false) {
  const p = state.player;
  if (state.dead || p.invulnerable > 0 || amount <= 0) return;
  const armor = ARMORS[p.armor] ?? {};
  let damage = Math.max(1, amount - (armor.defense ?? 0));
  if (!bypassShield && p.block && p.stamina > 3) {
    const dx = source.x - p.x,
      dz = source.z - p.z;
    const facing =
      (Math.sin(p.yaw) * dx + Math.cos(p.yaw) * dz) / (Math.hypot(dx, dz) || 1);
    if (facing > -0.15) {
      if (p.blockTimer < 0.24 && p.stamina >= 8) {
        p.stamina -= 8;
        if ("frozen" in source) source.frozen = 2.6;
        addEffect(state, "parry", p.x, p.y + 1, p.z, 2.2, 0.65);
        events.push(toast("完美格挡！敌人失去平衡。", "success"), sound("hit"));
        p.invulnerable = 0.35;
        return;
      }
      p.stamina = Math.max(0, p.stamina - amount * 0.8);
      damage *= 0.18;
      addEffect(state, "shield", p.x, p.y + 1, p.z, 1.3);
    }
  }
  p.health = Math.max(0, p.health - damage);
  p.invulnerable = bypassShield ? 0.25 : 0.75;
  p.hurtTimer = 0.35;
  state.stats.damageTaken += damage;
  addEffect(state, "hurt", p.x, p.y + 1, p.z, 1.1);
  events.push(sound("hurt"));
  if (p.health <= 0) die(state, events);
}

function damageEnemy(
  state,
  enemy,
  damage,
  events,
  source = "sword",
  release = false,
) {
  if (
    enemy.dead ||
    (enemy.type === "guardian" && state.progress.beacons.length < 3)
  )
    return;
  if (enemy.frozen > 0 && !release) {
    enemy.storedDamage += damage;
    enemy.flash = 0.2;
    addEffect(state, "stasis", enemy.x, enemy.y + 1, enemy.z, 1.2, 0.25);
    events.push(sound("hit"));
    return;
  }
  enemy.hp = Math.max(0, enemy.hp - damage);
  enemy.flash = 0.22;
  if (enemy.type !== "guardian") enemy.windup = 0;
  addEffect(
    state,
    source === "bomb" ? "explosion" : "hit",
    enemy.x,
    enemy.y + 1,
    enemy.z,
    1.25,
    0.4,
  );
  events.push(sound("hit"));
  if (enemy.hp > 0) return;
  enemy.dead = true;
  enemy.motion = "dead";
  enemy.speed = 0;
  state.progress.kills += 1;
  if (enemy.type === "guardian") {
    state.progress.bossDefeated = true;
    state.victory = true;
    addItem(state, "spirit", 3);
    addItem(state, "coin", 100);
    events.push(
      toast("古代守卫已平息。风重新吹过这片原野。", "success"),
      sound("victory"),
      { type: "save" },
      { type: "victory" },
    );
  } else {
    addItem(state, "coin", enemy.type === "slime" ? 4 : 8);
    addItem(state, enemy.type === "slime" ? "herb" : "meat", 1);
    if (enemy.type === "archer") addItem(state, "arrow", 3);
    events.push(
      toast(`击败敌人 · 晶币 +${enemy.type === "slime" ? 4 : 8}`, "success"),
    );
  }
}

function consumeDurability(state, id, events) {
  const weapon = state.weapons[id];
  if (!weapon?.owned || weapon.durability <= 0) return false;
  weapon.durability = Math.max(0, weapon.durability - 1);
  if (!weapon.durability) {
    events.push(
      toast(`${WEAPONS[id]?.name ?? id} 已损坏，可在商店修复。`, "warning"),
    );
  }
  return true;
}

function melee(state, events) {
  const p = state.player;
  if (
    p.attackTimer > 0 ||
    p.stamina < 8 ||
    p.motion === "climb" ||
    p.motion === "swim"
  )
    return;
  const weapon = WEAPONS[p.weapon] ?? WEAPONS.sword ?? { damage: 18, speed: 1 };
  if (
    !state.weapons[p.weapon]?.owned ||
    state.weapons[p.weapon].durability <= 0
  ) {
    events.push(toast("武器已损坏。试试弓箭、炸弹，或回商店修复。", "warning"));
    return;
  }
  p.combo = p.comboTimer > 0 ? (p.combo % 3) + 1 : 1;
  p.comboTimer = 1.3;
  p.attackTimer = Math.max(0.25, weapon.speed ?? 0.44);
  p.stamina -= 8;
  p.block = false;
  const heavy = p.combo === 3;
  const reach = heavy ? 3.8 : 3.25;
  let connected = false;
  for (const enemy of state.enemies) {
    if (
      enemy.dead ||
      (enemy.type === "guardian" && state.progress.beacons.length < 3)
    )
      continue;
    const dx = enemy.x - p.x,
      dz = enemy.z - p.z;
    const d = Math.hypot(dx, dz);
    const dot = (Math.sin(p.yaw) * dx + Math.cos(p.yaw) * dz) / (d || 1);
    if (
      d < reach + (enemy.type === "guardian" ? 1.1 : 0) &&
      dot > (heavy ? -0.45 : 0.05) &&
      Math.abs(enemy.y - p.y) < 3
    ) {
      const amount =
        (weapon.damage ?? 18) *
        (heavy ? 1.55 : 1) *
        (p.buffs.strength > 0 ? 1.45 : 1);
      damageEnemy(state, enemy, amount, events);
      connected = true;
    }
  }
  if (connected) consumeDurability(state, p.weapon, events);
  addEffect(
    state,
    "slash",
    p.x + Math.sin(p.yaw),
    p.y + 0.9,
    p.z + Math.cos(p.yaw),
    heavy ? 2.6 : 1.8,
    0.25,
  );
  events.push(sound("attack"));
}

function jump(state, events) {
  const p = state.player;
  if (p.mounted) {
    p.vy = 6.4;
    return;
  }
  if (p.motion === "glide") {
    p.motion = "air";
    return;
  }
  if (
    p.motion === "air" &&
    p.y - terrainFloor(p.x, p.z, p.y) > 0.8 &&
    p.stamina > 3
  ) {
    p.motion = "glide";
    p.vy = Math.max(-1.6, p.vy);
    events.push(sound("rune"));
    return;
  }
  if (p.motion === "climb") {
    if (p.stamina < 10) return;
    p.stamina -= 10;
    p.vy = 7;
    p.motion = "air";
    p.x -= Math.sin(p.yaw) * 0.55;
    p.z -= Math.cos(p.yaw) * 0.55;
    p.climbDetach = 0.4;
    events.push(sound("jump"));
    return;
  }
  if (p.motion === "ground" && p.stamina >= 3) {
    p.vy = 7.2;
    p.motion = "air";
    p.stamina -= 3;
    events.push(sound("jump"));
  }
}

function shootBow(state, events) {
  const p = state.player;
  if (p.attackTimer > 0 || p.motion === "climb" || p.motion === "swim") return;
  if (state.inventory.arrow < 1) {
    events.push(toast("箭袋空了。可从宝箱、弓手或商店补充。", "warning"));
    return;
  }
  if (!consumeDurability(state, "bow", events)) {
    events.push(toast("弓已损坏，请到商店修复。", "warning"));
    return;
  }
  state.inventory.arrow -= 1;
  state.stats.arrowsFired += 1;
  p.attackTimer = 0.5;
  p.bowTimer = 0.7;
  const crystal = { x: -59, z: -65 };
  const cd = distance(p, crystal);
  const facingCrystal =
    (Math.sin(p.yaw) * (crystal.x - p.x) +
      Math.cos(p.yaw) * (crystal.z - p.z)) /
    (cd || 1);
  if (!state.puzzles.frost && cd < 18 && facingCrystal > 0.65) {
    state.puzzles.frost = true;
    addEffect(
      state,
      "ice",
      crystal.x,
      groundAt(crystal.x, crystal.z) + 1.5,
      crystal.z,
      4,
      1.3,
    );
    events.push(toast("冰晶共鸣了！霜之信标可以点亮。", "success"));
  }
  let target = null,
    best = Infinity;
  for (const enemy of state.enemies) {
    if (
      enemy.dead ||
      (enemy.type === "guardian" && state.progress.beacons.length < 3)
    )
      continue;
    const d = distance(p, enemy);
    const facing =
      (Math.sin(p.yaw) * (enemy.x - p.x) + Math.cos(p.yaw) * (enemy.z - p.z)) /
      (d || 1);
    if (d < 30 && facing > 0.86 && d < best) {
      target = enemy;
      best = d;
    }
  }
  let vx = Math.sin(p.yaw) * 32,
    vz = Math.cos(p.yaw) * 32,
    vy = 0.8;
  if (target) {
    const flight = Math.max(0.06, distance(p, target) / 32);
    vx = (target.x - p.x) / flight;
    vz = (target.z - p.z) / flight;
    vy =
      (target.y + (target.type === "guardian" ? 2 : 0.8) - (p.y + 1.1)) /
        flight +
      1.5 * flight;
  }
  state.projectiles.push({
    id: `arrow-${state.nextId++}`,
    type: "arrow",
    owner: "player",
    x: p.x + Math.sin(p.yaw) * 0.65,
    y: p.y + 1.1,
    z: p.z + Math.cos(p.yaw) * 0.65,
    vx,
    vy,
    vz,
    life: 3,
    damage: (WEAPONS.bow?.damage ?? 24) * (p.buffs.strength > 0 ? 1.4 : 1),
  });
  events.push(sound("attack"));
}

function detonateBomb(state, bomb, events) {
  addEffect(state, "explosion", bomb.x, bomb.y, bomb.z, 6, 0.8);
  for (const enemy of state.enemies) {
    if (!enemy.dead && distance(bomb, enemy) <= 6)
      damageEnemy(state, enemy, 52, events, "bomb");
  }
  for (const object of state.objects) {
    if (object.type !== "metal" || distance(object, bomb) > 6) continue;
    const d = Math.max(0.1, distance(object, bomb));
    object.x += ((object.x - bomb.x) / d) * 2;
    object.z += ((object.z - bomb.z) / d) * 2;
    object.y = groundAt(object.x, object.z);
  }
  bomb.life = 0;
  events.push(sound("rune"));
}

function useRune(state, events) {
  const p = state.player;
  const liveBomb = state.projectiles.find(
    (item) => item.type === "bomb" && item.life > 0,
  );
  if (p.rune === "bomb" && liveBomb) {
    detonateBomb(state, liveBomb, events);
    return;
  }
  const held = state.objects.find((item) => item.held);
  if (p.rune === "magnet" && held) {
    held.held = false;
    held.y = groundAt(held.x, held.z);
    events.push(toast("金属方块已放下。"), sound("rune"));
    return;
  }
  if (p.runeCooldown > 0) {
    events.push(toast("符文正在恢复能量。"));
    return;
  }
  if (p.rune === "bomb") {
    state.projectiles.push({
      id: `bomb-${state.nextId++}`,
      type: "bomb",
      owner: "player",
      x: p.x + Math.sin(p.yaw) * 1.3,
      y: p.y + 1.4,
      z: p.z + Math.cos(p.yaw) * 1.3,
      vx: Math.sin(p.yaw) * 8,
      vy: 4.6,
      vz: Math.cos(p.yaw) * 8,
      life: 4.5,
    });
    p.runeCooldown = 3.5;
    events.push(toast("遥控炸弹已投出 · 再按符文键引爆。"), sound("rune"));
  } else if (p.rune === "magnet") {
    const metal = state.objects
      .filter((item) => item.type === "metal" && distance(item, p) < 20)
      .sort((a, b) => distance(a, p) - distance(b, p))[0];
    if (!metal) {
      events.push(toast("附近没有可牵引的金属方块。"));
      return;
    }
    metal.held = true;
    p.runeCooldown = 0.3;
    events.push(
      toast("磁力牵引中 · 移动方块到发光底座，再按符文键放下。"),
      sound("rune"),
    );
  } else if (p.rune === "stasis") {
    const enemy = state.enemies
      .filter(
        (item) =>
          !item.dead &&
          distance(item, p) < 14 &&
          (item.type !== "guardian" || state.progress.beacons.length >= 3),
      )
      .sort((a, b) => distance(a, p) - distance(b, p))[0];
    if (!enemy) {
      events.push(toast("14 米内没有可锁定的敌人。"));
      return;
    }
    enemy.frozen = enemy.type === "guardian" ? 3.4 : 6;
    enemy.storedDamage = 0;
    p.runeCooldown = 11;
    addEffect(state, "stasis", enemy.x, enemy.y + 1, enemy.z, 2, enemy.frozen);
    events.push(
      toast("时间锁定！期间造成的伤害将在解除时一并释放。"),
      sound("rune"),
    );
  } else if (p.rune === "ice") {
    const crystal = { x: -59, z: -65 };
    if (!state.puzzles.frost && distance(p, crystal) < 16) {
      state.puzzles.frost = true;
      events.push(toast("寒冰符文唤醒了冰晶。霜之信标可以点亮。", "success"));
    }
    const x = clamp(p.x + Math.sin(p.yaw) * 4, -HALF + 1, HALF - 1);
    const z = clamp(p.z + Math.cos(p.yaw) * 4, -HALF + 1, HALF - 1);
    const ice = {
      id: `ice-${state.nextId++}`,
      type: "ice",
      x,
      y: Math.max(WATER, groundAt(x, z)),
      z,
      life: 24,
      held: false,
    };
    state.objects.push(ice);
    const previous = state.objects.filter((item) => item.type === "ice");
    if (previous.length > 3) previous[0].life = 0;
    for (const enemy of state.enemies) {
      if (
        !enemy.dead &&
        distance(enemy, ice) < 5 &&
        (enemy.type !== "guardian" || state.progress.beacons.length >= 3)
      ) {
        enemy.frozen = Math.max(
          enemy.frozen,
          enemy.type === "guardian" ? 1.5 : 3,
        );
      }
    }
    p.runeCooldown = 5;
    addEffect(state, "ice", x, ice.y + 0.5, z, 3.5, 0.8);
    events.push(
      toast("冰柱已升起 · 可踏上冰面，附近敌人会短暂停顿。"),
      sound("rune"),
    );
  }
}

function availableContext(state) {
  const p = state.player,
    candidates = [];
  const push = (kind, item, label, hint = "", max = 3.5, bias = 0) => {
    const d = distance(p, item);
    if (d <= max)
      candidates.push({
        kind,
        id: item.id,
        label,
        hint,
        distance: d,
        priority: d + bias,
      });
  };
  if (p.mounted)
    return {
      kind: "dismount",
      id: "horse",
      label: "下马",
      hint: "探索时可随时再次上马",
      distance: 0,
    };
  for (const item of state.pickups)
    if (item.active)
      push(
        "pickup",
        item,
        `采集${ITEMS[item.type]?.name ?? item.type}`,
        "",
        2.8,
        -0.5,
      );
  for (const chest of state.chests)
    if (!chest.open)
      push("chest", chest, "打开宝箱", "发现物资与装备", 3.2, -0.3);
  push(
    "horse",
    { ...state.horse, id: "horse" },
    "骑上原野马",
    "疾驰探索 · 互动键下马",
    3.3,
  );
  for (const location of LOCATIONS) {
    const id = location.id;
    if (location.type === "beacon") {
      const key =
        ["wind", "ember", "frost"].find(
          (entry) => id === entry || id.includes(entry),
        ) ?? id;
      const active = state.progress.beacons.includes(key);
      const hints = {
        wind: "磁力牵引：把金属方块放到发光底座",
        ember: "携带 2 份木材点燃祭坛火盆",
        frost: "射中冰晶，或使用寒冰符文",
      };
      push(
        "beacon",
        location,
        active
          ? `${location.name} · 已点亮`
          : state.puzzles[key]
            ? `点亮${location.name}`
            : `${location.name} · 解谜`,
        active ? "三座信标将打开古代遗迹" : hints[key],
        5.3,
      );
    } else if (location.type === "tower") {
      push(
        "tower",
        location,
        state.progress.towers.includes(id)
          ? `${location.name} · 已同步`
          : `同步${location.name}`,
        "登上塔顶同步地图与传送点",
        5.2,
        0.5,
      );
    } else if (location.type === "camp") {
      push(
        "camp",
        location,
        "营火休息",
        "恢复生命、体力、保存进度与复活位置",
        4.2,
      );
    } else if (location.type === "cook") {
      push("cook", location, "烹饪料理", "将原料合成为恢复或御寒料理", 3.7);
    } else if (location.type === "shop") {
      push("shop", location, "交易与修理", "购买装备、箭矢，修复武器", 4.2);
    } else if (location.type === "npc") {
      push(
        "npc",
        location,
        `与${location.name}交谈`,
        state.progress.delivery ? "旅人的故事" : "委托：收集 3 份木材",
        3.6,
      );
    } else if (location.type === "boss") {
      push(
        "boss",
        location,
        state.progress.bossDefeated ? "遗迹已平息" : "古代遗迹",
        "点亮三座信标，唤醒古代守卫",
        6,
      );
    }
  }
  if (!state.puzzles.ember)
    push(
      "torch",
      { id: "ember-torch", x: 55, z: -29 },
      "点燃祭坛火盆",
      "需要木材 ×2",
      4.2,
      -0.2,
    );
  if (!state.puzzles.frost)
    push(
      "crystal",
      { id: "frost-crystal", x: -59, z: -65 },
      "检查共鸣冰晶",
      "射箭命中冰晶，或使用寒冰符文",
      4,
    );
  candidates.sort((a, b) => a.priority - b.priority);
  const context = candidates[0];
  if (!context) return null;
  delete context.priority;
  return context;
}

function updateContext(state) {
  state.context = availableContext(state);
}

function interact(state, events) {
  updateContext(state);
  const context = state.context;
  if (!context) {
    events.push(toast("靠近物资、营火、旅人或信标后即可互动。"));
    return;
  }
  const p = state.player;
  if (context.kind === "pickup") {
    const item = state.pickups.find((entry) => entry.id === context.id);
    item.active = false;
    addItem(state, item.type, item.amount ?? 1);
    events.push(
      toast(
        `${ITEMS[item.type]?.name ?? item.type} +${item.amount ?? 1}`,
        "success",
      ),
      sound("pickup"),
    );
  } else if (context.kind === "chest") {
    const chest = state.chests.find((entry) => entry.id === context.id);
    chest.open = true;
    for (const [id, amount] of Object.entries(chest.reward ?? {}))
      addItem(state, id, amount);
    events.push(
      toast(
        `宝箱开启：${Object.entries(chest.reward ?? {})
          .map(
            ([id, n]) =>
              `${ITEMS[id]?.name ?? WEAPONS[id]?.name ?? ARMORS[id]?.name ?? id} ×${n}`,
          )
          .join("、")}`,
        "success",
      ),
      sound("pickup"),
      { type: "save" },
    );
  } else if (context.kind === "horse") {
    p.mounted = true;
    p.motion = "ride";
    p.x = state.horse.x;
    p.z = state.horse.z;
    p.y = state.horse.y;
    events.push(
      toast("已骑乘 · 移动探索，冲刺疾驰，互动键下马。"),
      sound("pickup"),
    );
  } else if (context.kind === "dismount") {
    dismount(state, events);
  } else if (context.kind === "camp") {
    p.health = p.maxHealth;
    p.stamina = p.maxStamina;
    state.checkpoint = { x: p.x, z: p.z };
    if (!state.progress.discovered.includes(context.id))
      state.progress.discovered.push(context.id);
    events.push(
      toast("在营火边恢复了生命与体力，进度已保存。", "success"),
      sound("cook"),
      { type: "save" },
    );
  } else if (context.kind === "cook" || context.kind === "shop") {
    events.push({ type: "panel", panel: context.kind });
  } else if (context.kind === "npc") {
    state.progress.talked = true;
    let text =
      "风原曾由三座信标守护。西方的金属方块、东部的火盆、北方的冰晶，各藏着一把钥匙。请替我带来 3 份木材，我会把御寒披风和 30 枚晶币交给你。";
    if (!state.progress.delivery && state.inventory.wood >= 3) {
      state.inventory.wood -= 3;
      state.progress.delivery = true;
      addItem(state, "coin", 30);
      const cloak =
        Object.keys(ARMORS).find((id) => (ARMORS[id].warmth ?? 0) > 0) ??
        "cloak";
      if (ARMORS[cloak]) addItem(state, cloak, 1);
      text = `谢谢你的木材！${ARMORS[cloak]?.name ?? "御寒披风"}与 30 枚晶币已经放入背包。记得在背包中穿上御寒装备，再登北境雪山。`;
      events.push(sound("pickup"), { type: "save" });
    } else if (state.progress.delivery) {
      text =
        "高塔顶端能同步传送点。遇到强敌时，用盾牌、闪避与符文创造机会。三座信标点亮后，去北方遗迹结束这场风暴。";
    }
    events.push({
      type: "panel",
      panel: "dialogue",
      title: "旅人的委托",
      text,
    });
  } else if (context.kind === "tower") {
    if (state.progress.towers.includes(context.id)) {
      events.push(toast("已同步此高塔，可从地图传送至此。"));
      return;
    }
    const location = LOCATIONS.find((entry) => entry.id === context.id);
    const solid =
      SOLIDS.find((entry) => entry.id === context.id) ??
      SOLIDS.find((entry) => entry.climbable && distance(entry, location) < 2);
    const top = solid
      ? groundAt(solid.x, solid.z) + solid.height
      : groundAt(location.x, location.z);
    if (p.y < top - 2) {
      events.push(
        toast("需要攀上塔顶才能同步。面向塔身，向前并按住跳跃键攀爬。"),
      );
      return;
    }
    state.progress.towers.push(context.id);
    if (!state.progress.discovered.includes(context.id))
      state.progress.discovered.push(context.id);
    addItem(state, "spirit", 1);
    events.push(
      toast("高塔同步成功！地图已解锁传送点，获得风之印记 ×1。", "success"),
      sound("beacon"),
      { type: "save" },
    );
  } else if (context.kind === "torch") {
    lightTorch(state, events);
  } else if (context.kind === "crystal") {
    events.push(toast("冰晶对远距离的冲击与寒冰符文产生共鸣。"));
  } else if (context.kind === "beacon") {
    const key =
      ["wind", "ember", "frost"].find((entry) => context.id.includes(entry)) ??
      context.id;
    if (state.progress.beacons.includes(key)) {
      events.push(toast("这座信标已经点亮。"));
      return;
    }
    if (key === "ember" && !state.puzzles.ember) lightTorch(state, events);
    if (!state.puzzles[key]) {
      events.push(toast(context.hint));
      return;
    }
    state.progress.beacons.push(key);
    addItem(state, "spirit", 1);
    addItem(state, "coin", 20);
    p.health = p.maxHealth;
    p.stamina = p.maxStamina;
    events.push(
      toast(
        `信标已点亮 · ${state.progress.beacons.length}/3 · 风之印记 +1`,
        "success",
      ),
      sound("beacon"),
      { type: "save" },
    );
    if (state.progress.beacons.length === 3)
      events.push(
        toast("三座信标已共鸣。北方古代遗迹的守卫苏醒了！", "warning"),
      );
  } else if (context.kind === "boss") {
    events.push(
      toast(
        state.progress.bossDefeated
          ? "风暴已经散去。继续自由探索这片原野吧。"
          : state.progress.beacons.length < 3
            ? "遗迹仍被封印。先点亮风、焰、霜三座信标。"
            : "守卫已苏醒！留意蓄力光圈，用闪避避开冲击。",
      ),
    );
  }
  updateContext(state);
}

function lightTorch(state, events) {
  if (state.puzzles.ember) return;
  if (state.inventory.wood < 2) {
    events.push(toast("点燃火盆需要木材 ×2，可在树林附近采集。", "warning"));
    return;
  }
  state.inventory.wood -= 2;
  state.puzzles.ember = true;
  addEffect(state, "fire", 55, groundAt(55, -29) + 1, -29, 3, 1.2);
  events.push(
    toast("祭坛之火已燃起！焰之信标可以点亮。", "success"),
    sound("beacon"),
  );
}

function dismount(state, events) {
  if (!state.player.mounted) return;
  const p = state.player;
  p.mounted = false;
  p.motion = "ground";
  p.x = clamp(p.x + Math.cos(p.yaw) * 1.6, -HALF + 1, HALF - 1);
  p.z = clamp(p.z - Math.sin(p.yaw) * 1.6, -HALF + 1, HALF - 1);
  p.y = terrainFloor(p.x, p.z, p.y + 2);
  p.vy = 0;
  state.horse.speed = 0;
  events.push(toast("已下马。"));
}

function cook(state, id, events) {
  if (!owns(RECIPES, id)) return;
  const recipe = RECIPES[id];
  const station = LOCATIONS.some(
    (item) => item.type === "cook" && distance(item, state.player) <= 5,
  );
  if (!station) {
    events.push(toast("需要在烹饪锅旁制作料理。", "warning"));
    return;
  }
  const ingredients = recipe.ingredients ?? {};
  if (
    Object.entries(ingredients).some(
      ([key, amount]) => (state.inventory[key] ?? 0) < amount,
    )
  ) {
    events.push(toast("所需食材不足。先去原野采集吧。", "warning"));
    return;
  }
  for (const [key, amount] of Object.entries(ingredients))
    state.inventory[key] -= amount;
  addItem(state, recipe.output ?? id, recipe.amount ?? 1);
  state.stats.mealsCooked += 1;
  events.push(toast(`完成：${recipe.name}`, "success"), sound("cook"), {
    type: "save",
  });
}

function eat(state, id, events) {
  if (!owns(state.inventory, id) || (state.inventory[id] ?? 0) < 1) return;
  const effect = RECIPES[id]?.effect ?? ITEMS[id]?.effect;
  let health = 0,
    stamina = 0,
    warmth = 0,
    strength = 0;
  if (effect && typeof effect === "object") {
    health = effect.health ?? effect.heal ?? 0;
    stamina =
      id === "staminaMeal" ? state.player.maxStamina : (effect.stamina ?? 0);
    warmth = effect.warmth ?? 0;
    strength = effect.strength ?? 0;
  } else {
    const defaults = {
      apple: [12, 0, 0],
      mushroom: [8, 0, 0],
      herb: [5, 0, 0],
      meat: [15, 0, 0],
      meal: [55, 0, 0],
      warmMeal: [35, 0, 180],
      staminaMeal: [20, 70, 0],
    };
    const values = defaults[id];
    if (!values) return;
    [health, stamina, warmth] = values;
  }
  state.inventory[id] -= 1;
  const p = state.player;
  p.health = Math.min(p.maxHealth, p.health + health);
  p.stamina = Math.min(p.maxStamina, p.stamina + stamina);
  p.buffs.warmth = Math.max(p.buffs.warmth, warmth);
  p.buffs.strength = Math.max(p.buffs.strength, strength);
  if (id === "staminaMeal")
    p.buffs.stamina = Math.max(p.buffs.stamina, effect?.staminaBuff ?? 90);
  events.push(
    toast(
      `食用${RECIPES[id]?.name ?? ITEMS[id]?.name ?? id}，状态已恢复。`,
      "success",
    ),
    sound("cook"),
  );
}

function buy(state, id, events) {
  if (
    !LOCATIONS.some(
      (item) => item.type === "shop" && distance(item, state.player) <= 5,
    )
  ) {
    events.push(toast("需要在商店旁进行交易。", "warning"));
    return;
  }
  if (id === "repair" || id.startsWith("repair-") || id.startsWith("repair:")) {
    const specific = id === "repair" ? null : id.slice(7);
    const list = Object.entries(state.weapons).filter(
      ([key, item]) =>
        (!specific || key === specific) &&
        item.owned &&
        item.durability < (WEAPONS[key]?.durability ?? 60),
    );
    if (!list.length) {
      events.push(toast("装备状态良好，无需修理。"));
      return;
    }
    const price = specific ? 8 : 15;
    if (state.inventory.coin < price) {
      events.push(toast(`修复需要 ${price} 枚晶币。`, "warning"));
      return;
    }
    state.inventory.coin -= price;
    for (const [key, item] of list)
      item.durability = WEAPONS[key]?.durability ?? 60;
    events.push(toast("武器已修复如新。", "success"), sound("pickup"));
    return;
  }
  if (!owns(ARMORS, id) && !owns(WEAPONS, id) && !owns(ITEMS, id)) return;
  const item = ARMORS[id] ?? WEAPONS[id] ?? ITEMS[id];
  if (owns(ARMORS, id) && state.armors.includes(id)) {
    events.push(toast("已经拥有这件装备。"));
    return;
  }
  if (owns(WEAPONS, id) && state.weapons[id]?.owned) {
    events.push(toast("已经拥有这把武器，可选择修复。"));
    return;
  }
  const price =
    item.price ?? (id === "arrow" ? 12 : owns(WEAPONS, id) ? 35 : 10);
  if (state.inventory.coin < price) {
    events.push(toast("晶币不足。探索宝箱或击败敌人可获得晶币。", "warning"));
    return;
  }
  state.inventory.coin -= price;
  addItem(state, id, id === "arrow" ? 10 : 1);
  events.push(
    toast(`购入${item.name}${id === "arrow" ? " ×10" : ""}`, "success"),
    sound("pickup"),
    { type: "save" },
  );
}

export function command(state, action, payload = {}) {
  const events = [];
  if (!state || !state.player) return events;
  if (state.dead && action !== "respawn") return events;
  const p = state.player;
  if (action === "interact") interact(state, events);
  else if (action === "attack") melee(state, events);
  else if (action === "jump" || action === "toggleGlide") jump(state, events);
  else if (action === "bow") shootBow(state, events);
  else if (action === "rune") useRune(state, events);
  else if (action === "cycleRune") {
    const next = (RUNES.indexOf(p.rune) + 1) % RUNES.length;
    p.rune = RUNES[next];
    events.push(toast(`${RUNE_LABELS[p.rune] ?? p.rune}已装备`));
  } else if (action === "equipRune" && RUNES.includes(payload.id)) {
    p.rune = payload.id;
    events.push(toast(`${RUNE_LABELS[p.rune] ?? p.rune}已装备`));
  } else if (action === "dodge") {
    if (
      p.stamina >= 20 &&
      p.dodgeTimer <= 0 &&
      ["ground", "ride"].includes(p.motion)
    ) {
      p.stamina -= 20;
      p.invulnerable = 0.5;
      p.dodgeTimer = 0.32;
      events.push(sound("jump"));
    }
  } else if (
    action === "equipWeapon" &&
    owns(state.weapons, payload.id) &&
    state.weapons[payload.id]?.owned &&
    payload.id !== "bow"
  ) {
    p.weapon = payload.id;
    events.push(toast(`已装备${WEAPONS[payload.id]?.name ?? payload.id}`));
  } else if (action === "equipArmor" && state.armors.includes(payload.id)) {
    p.armor = payload.id;
    events.push(toast(`已穿上${ARMORS[payload.id]?.name ?? payload.id}`));
  } else if (action === "eat") eat(state, payload.id, events);
  else if (action === "cook") cook(state, payload.id, events);
  else if (action === "buy" && typeof payload.id === "string")
    buy(state, payload.id, events);
  else if (action === "repair")
    buy(state, payload.id ? `repair-${payload.id}` : "repair", events);
  else if (action === "upgrade") {
    if (!["health", "stamina"].includes(payload.id)) return events;
    if (state.inventory.spirit < 2) {
      events.push(
        toast("升级需要风之印记 ×2，可通过高塔或信标获得。", "warning"),
      );
      return events;
    }
    state.inventory.spirit -= 2;
    const field = payload.id === "health" ? "maxHealth" : "maxStamina";
    p[field] += payload.id === "health" ? 25 : 20;
    p[payload.id] = p[field];
    events.push(
      toast(
        `${payload.id === "health" ? "生命" : "体力"}上限提升！`,
        "success",
      ),
      sound("beacon"),
      { type: "save" },
    );
  } else if (action === "fastTravel") {
    const location = LOCATIONS.find(
      (item) => item.id === payload.id && ["camp", "tower"].includes(item.type),
    );
    if (!location) return events;
    const unlocked =
      location.type === "camp"
        ? state.progress.discovered.includes(location.id)
        : state.progress.towers.includes(location.id);
    if (!unlocked) {
      events.push(toast("先探索营火，或攀上高塔同步传送点。", "warning"));
      return events;
    }
    if (
      state.enemies.some(
        (enemy) =>
          !enemy.dead &&
          distance(enemy, p) < 12 &&
          (enemy.type !== "guardian" || state.progress.beacons.length >= 3),
      )
    ) {
      events.push(toast("附近有敌人，脱离战斗后才能传送。", "warning"));
      return events;
    }
    if (p.mounted) dismount(state, events);
    for (const object of state.objects) object.held = false;
    p.x = clamp(location.x + 4, -HALF + 2, HALF - 2);
    p.z = clamp(location.z + 3, -HALF + 2, HALF - 2);
    p.y = terrainFloor(p.x, p.z);
    p.vy = p.vx = p.vz = 0;
    p.motion = "ground";
    p.stamina = p.maxStamina;
    p.invulnerable = 2;
    events.push(toast(`抵达${location.name}`, "success"), sound("rune"), {
      type: "save",
    });
  } else if (action === "respawn") {
    p.x = state.checkpoint.x;
    p.z = state.checkpoint.z;
    p.y = terrainFloor(p.x, p.z);
    p.health = p.maxHealth;
    p.stamina = p.maxStamina;
    p.vy = p.vx = p.vz = 0;
    p.motion = "ground";
    p.mounted = false;
    p.invulnerable = 5;
    p.attackTimer = p.dodgeTimer = 0;
    state.dead = false;
    state.inventory.coin = Math.max(0, state.inventory.coin - 5);
    state.projectiles = [];
    for (const enemy of state.enemies) {
      enemy.windup = 0;
      enemy.attackTimer = 2;
    }
    events.push(toast("在营火旁醒来 · 遗失 5 枚晶币，探索进度保留。"), {
      type: "save",
    });
  } else if (action === "dismount") dismount(state, events);
  else if (action === "save") events.push({ type: "save" });
  updateContext(state);
  return events;
}

function iceFloor(state, x, z, base) {
  let result = base;
  for (const object of state.objects) {
    if (
      object.type === "ice" &&
      object.life > 0 &&
      Math.abs(object.x - x) < 1.9 &&
      Math.abs(object.z - z) < 1.9
    ) {
      result = Math.max(result, object.y + 1.25);
    }
  }
  return result;
}

function blockedSolid(x, z, feet, padding = 0.42) {
  return SOLIDS.find(
    (solid) =>
      Math.abs(x - solid.x) < solid.width / 2 + padding &&
      Math.abs(z - solid.z) < solid.depth / 2 + padding &&
      feet < groundAt(solid.x, solid.z) + solid.height - 0.2,
  );
}

function updateMovement(state, input, dt, events) {
  const p = state.player;
  let mx = finite(input.moveX),
    mz = finite(input.moveZ);
  const length = Math.hypot(mx, mz);
  if (length > 1) {
    mx /= length;
    mz /= length;
  }
  const moving = length > 0.08;
  if (Number.isFinite(input.aimYaw)) p.yaw = input.aimYaw % TAU;
  else if (moving) p.yaw = Math.atan2(mx, mz);
  p.block =
    !!input.block &&
    p.stamina > 0 &&
    !p.mounted &&
    ["ground", "air"].includes(p.motion);
  p.blockTimer = p.block ? p.blockTimer + dt : 0;
  p.climbDetach = Math.max(0, (p.climbDetach ?? 0) - dt);
  const oldX = p.x,
    oldZ = p.z;
  const ice = iceFloor(state, p.x, p.z, -Infinity);
  const ground = terrainFloor(p.x, p.z, p.y + 0.3);
  const floor = Math.max(ground, ice);
  const swimming =
    groundAt(p.x, p.z) < WATER - 0.55 && p.y <= WATER + 0.3 && ice < WATER;
  if (swimming && !p.mounted) {
    p.motion = "swim";
    p.y = WATER - 0.55;
    p.vy = 0;
  } else if (p.motion === "swim") {
    p.motion = "ground";
    p.y = Math.max(floor, p.y);
  }
  if (p.mounted && groundAt(p.x, p.z) < WATER - 0.7) {
    dismount(state, events);
    p.motion = "swim";
    p.y = WATER - 0.55;
  }
  let speed = p.mounted ? 10 : 5.4;
  const sprinting =
    input.sprint &&
    moving &&
    p.stamina > 1 &&
    p.exhaustTimer <= 0 &&
    ["ground", "ride"].includes(p.motion);
  if (sprinting) speed = p.mounted ? 16 : 8.7;
  if (p.motion === "swim") speed = 2.9;
  if (p.motion === "glide") speed = 7.3;
  if (p.block) speed *= 0.42;
  if (p.attackTimer > 0) speed *= 0.66;
  if (p.dodgeTimer > 0) {
    speed = 16;
    if (!moving) {
      mx = -Math.sin(p.yaw);
      mz = -Math.cos(p.yaw);
    }
  }
  let nextX = clamp(p.x + mx * speed * dt, -HALF + 1, HALF - 1);
  let nextZ = clamp(p.z + mz * speed * dt, -HALF + 1, HALF - 1);
  const wall = blockedSolid(nextX, nextZ, p.y);
  const nextTerrain = groundAt(nextX, nextZ);
  const terrainAhead = groundAt(p.x + mx * 0.9, p.z + mz * 0.9);
  const steep =
    moving &&
    terrainAhead - groundAt(p.x, p.z) > 1.35 &&
    p.y < terrainAhead + 0.1;
  const climbWanted =
    input.climb && moving && p.stamina > 0 && p.climbDetach <= 0 && !p.mounted;
  if ((wall?.climbable || steep) && climbWanted) {
    p.motion = "climb";
    p.vy = 0;
    p.stamina = Math.max(
      0,
      p.stamina - (state.weather === "clear" ? 12 : 21) * dt,
    );
    p.y += 3.8 * dt;
    p.yaw = Math.atan2(mx, mz);
    if (wall) {
      const top = groundAt(wall.x, wall.z) + wall.height;
      if (p.y >= top - 0.08) {
        p.y = top;
        p.x = clamp(
          p.x + mx * 0.72,
          wall.x - wall.width / 2 + 0.15,
          wall.x + wall.width / 2 - 0.15,
        );
        p.z = clamp(
          p.z + mz * 0.72,
          wall.z - wall.depth / 2 + 0.15,
          wall.z + wall.depth / 2 - 0.15,
        );
        p.motion = "ground";
      }
    } else {
      if (nextTerrain <= p.y + 0.05) {
        p.x = nextX;
        p.z = nextZ;
      }
      if (!steep || p.y - nextTerrain < 0.15) p.y = Math.max(nextTerrain, p.y);
    }
  } else {
    if (p.motion === "climb") {
      p.motion = "air";
      p.vy = 0;
    }
    if (wall) {
      if (blockedSolid(nextX, p.z, p.y)) nextX = p.x;
      if (blockedSolid(p.x, nextZ, p.y)) nextZ = p.z;
    }
    if (steep && ["ground", "ride"].includes(p.motion)) {
      nextX = p.x;
      nextZ = p.z;
    }
    if (nextTerrain - p.y > 0.7 && p.motion === "air") {
      nextX = p.x;
      nextZ = p.z;
    }
    p.x = nextX;
    p.z = nextZ;
    const newIce = iceFloor(state, p.x, p.z, -Infinity);
    const newFloor = Math.max(terrainFloor(p.x, p.z, p.y + 0.25), newIce);
    if (p.motion === "swim") {
      p.y = WATER - 0.55;
      if (newIce > WATER || groundAt(p.x, p.z) > WATER - 0.45) {
        p.motion = "ground";
        p.y = newFloor;
      }
    } else if (p.motion === "glide") {
      p.vy = Math.max(-1.8, p.vy - 9 * dt);
      p.y += p.vy * dt;
      p.stamina = Math.max(0, p.stamina - 7.5 * dt);
      p.glideTime += dt;
      if (p.stamina <= 0) p.motion = "air";
      if (p.y <= newFloor + 0.1) {
        p.y = newFloor;
        p.vy = 0;
        p.motion = "ground";
      }
    } else {
      const wasAir = p.motion === "air";
      if (wasAir || p.vy > 0 || p.y > newFloor + 0.55) {
        p.vy -= 18 * dt;
        p.y += p.vy * dt;
        if (!p.mounted) p.motion = "air";
        if (p.y <= newFloor) {
          const velocity = p.vy;
          p.y = newFloor;
          p.vy = 0;
          p.motion = p.mounted ? "ride" : "ground";
          if (velocity < -17 && !p.mounted)
            hurtPlayer(state, (Math.abs(velocity) - 15) * 3.5, p, events, true);
        }
      } else {
        p.y = newFloor;
        p.vy = 0;
        p.motion = p.mounted ? "ride" : "ground";
      }
    }
  }
  if (sprinting) p.stamina = Math.max(0, p.stamina - (p.mounted ? 6 : 12) * dt);
  else if (p.motion === "swim" && moving)
    p.stamina = Math.max(0, p.stamina - 6 * dt);
  else if (
    ["ground", "ride"].includes(p.motion) &&
    !p.block &&
    p.attackTimer <= 0 &&
    p.dodgeTimer <= 0
  ) {
    p.stamina = Math.min(
      p.maxStamina,
      p.stamina + (p.buffs.stamina > 0 ? 31 : 19) * dt,
    );
  }
  if (p.stamina <= 0) {
    p.exhaustTimer = 1.5;
    if (p.motion === "climb") {
      p.motion = "air";
      p.vy = -1;
      p.climbDetach = 1.2;
    }
    if (p.motion === "swim") hurtPlayer(state, 9, p, events, true);
  }
  p.vx = (p.x - oldX) / dt;
  p.vz = (p.z - oldZ) / dt;
  p.speed = Math.hypot(p.vx, p.vz);
  state.stats.distance += Math.hypot(p.x - oldX, p.z - oldZ);
  if (p.mounted) {
    state.horse.x = p.x;
    state.horse.z = p.z;
    state.horse.y = p.y;
    state.horse.yaw = p.yaw;
    state.horse.speed = p.speed;
  } else state.horse.speed = 0;
  if (p.y < -30) die(state, events, "迷失在深水中。回到营地，重新启程吧。");
}

function moveEnemy(enemy, dx, dz, speed, dt) {
  const d = Math.hypot(dx, dz);
  if (d < 0.01) {
    enemy.speed = 0;
    return;
  }
  const x = clamp(enemy.x + (dx / d) * speed * dt, -HALF + 2, HALF - 2);
  const z = clamp(enemy.z + (dz / d) * speed * dt, -HALF + 2, HALF - 2);
  const ground = groundAt(x, z);
  if (
    ground < WATER - 0.4 ||
    Math.abs(ground - enemy.y) > 0.8 ||
    blockedSolid(x, z, enemy.y, 0.55)
  ) {
    enemy.speed = 0;
    return;
  }
  enemy.x = x;
  enemy.z = z;
  enemy.y = ground;
  enemy.yaw = Math.atan2(dx, dz);
  enemy.speed = speed;
}

function enemyAttack(state, enemy, events) {
  const p = state.player,
    config = ENEMY_CONFIG[enemy.type] ?? ENEMY_CONFIG.raider;
  const d = distance(enemy, p);
  if (enemy.attackKind === "shot") {
    const speed = enemy.type === "guardian" ? 15 : 17;
    const flight = Math.max(0.15, d / speed);
    state.projectiles.push({
      id: `enemy-shot-${state.nextId++}`,
      type: enemy.type === "guardian" ? "orb" : "enemyArrow",
      owner: enemy.id,
      x: enemy.x,
      y: enemy.y + (enemy.type === "guardian" ? 2.6 : 1.2),
      z: enemy.z,
      vx: (p.x - enemy.x) / flight,
      vy:
        (p.y + 0.8 - enemy.y - (enemy.type === "guardian" ? 2.6 : 1.2)) /
        flight,
      vz: (p.z - enemy.z) / flight,
      life: 4,
      damage: config.damage,
    });
  } else if (enemy.attackKind === "slam") {
    addEffect(state, "shockwave", enemy.x, enemy.y + 0.1, enemy.z, 7.6, 0.7);
    if (d < 7.6 && p.y < enemy.y + 2.8)
      hurtPlayer(state, config.damage * 1.3, enemy, events);
  } else if (d < config.range + 0.8 && Math.abs(p.y - enemy.y) < 3) {
    hurtPlayer(state, config.damage, enemy, events);
  }
}

function updateEnemies(state, dt, events) {
  const p = state.player;
  for (const enemy of state.enemies) {
    enemy.flash = Math.max(0, enemy.flash - dt);
    if (enemy.dead) continue;
    if (enemy.type === "guardian" && state.progress.beacons.length < 3) {
      enemy.motion = "dormant";
      enemy.speed = 0;
      continue;
    }
    if (enemy.frozen > 0) {
      enemy.frozen = Math.max(0, enemy.frozen - dt);
      enemy.motion = "frozen";
      enemy.speed = 0;
      if (enemy.frozen === 0 && enemy.storedDamage > 0) {
        const damage = enemy.storedDamage;
        enemy.storedDamage = 0;
        damageEnemy(state, enemy, damage * 1.15, events, "stasis", true);
      }
      continue;
    }
    const config = ENEMY_CONFIG[enemy.type] ?? ENEMY_CONFIG.raider;
    enemy.phase =
      enemy.type === "guardian" && enemy.hp < enemy.maxHp * 0.5 ? 2 : 1;
    enemy.attackTimer = Math.max(0, enemy.attackTimer - dt);
    const d = distance(enemy, p);
    if (enemy.windup > 0) {
      enemy.motion = "attack";
      enemy.speed = 0;
      enemy.windup = Math.max(0, enemy.windup - dt);
      if (enemy.windup === 0) {
        enemyAttack(state, enemy, events);
        enemy.attackTimer = config.cooldown / (enemy.phase === 2 ? 1.25 : 1);
      }
      continue;
    }
    const verticalGap = Math.abs(p.y - enemy.y);
    if (d > config.notice || verticalGap > 14 || state.dead) {
      enemy.motion = "idle";
      enemy.speed = 0;
      if (Math.hypot(enemy.x - enemy.homeX, enemy.z - enemy.homeZ) > 1.5) {
        moveEnemy(
          enemy,
          enemy.homeX - enemy.x,
          enemy.homeZ - enemy.z,
          config.speed * 0.6,
          dt,
        );
        enemy.motion = "walk";
      }
      continue;
    }
    enemy.yaw = Math.atan2(p.x - enemy.x, p.z - enemy.z);
    if (enemy.type === "archer" && d < 6) {
      moveEnemy(enemy, enemy.x - p.x, enemy.z - p.z, config.speed * 0.75, dt);
      enemy.motion = "walk";
      enemy.yaw = Math.atan2(p.x - enemy.x, p.z - enemy.z);
    } else if (
      d > config.range + 0.25 &&
      !(enemy.type === "guardian" && d > 11 && enemy.attackTimer <= 0)
    ) {
      moveEnemy(
        enemy,
        p.x - enemy.x,
        p.z - enemy.z,
        config.speed * (enemy.phase === 2 ? 1.22 : 1),
        dt,
      );
      enemy.motion = "walk";
    } else {
      enemy.speed = 0;
      enemy.motion = "idle";
    }
    const canAttack =
      d <= config.range + 0.8 || (enemy.type === "guardian" && d < 25);
    if (
      canAttack &&
      enemy.attackTimer <= 0 &&
      (verticalGap < 3.5 ||
        enemy.type === "archer" ||
        enemy.type === "guardian")
    ) {
      enemy.attackKind =
        enemy.type === "archer" || (enemy.type === "guardian" && d > 9)
          ? "shot"
          : enemy.type === "guardian"
            ? "slam"
            : "melee";
      enemy.windup =
        enemy.type === "guardian" ? 1.05 : enemy.type === "slime" ? 0.55 : 0.65;
      enemy.motion = "attack";
      if (enemy.type === "guardian")
        addEffect(
          state,
          "warning",
          enemy.x,
          enemy.y + 0.05,
          enemy.z,
          enemy.attackKind === "slam" ? 7.6 : 3,
          enemy.windup,
        );
    }
  }
}

function segmentDistance(point, start, end) {
  const dx = end.x - start.x,
    dy = end.y - start.y,
    dz = end.z - start.z;
  const norm = dx * dx + dy * dy + dz * dz;
  const t = norm
    ? clamp(
        ((point.x - start.x) * dx +
          (point.y - start.y) * dy +
          (point.z - start.z) * dz) /
          norm,
        0,
        1,
      )
    : 0;
  return Math.hypot(
    point.x - start.x - dx * t,
    point.y - start.y - dy * t,
    point.z - start.z - dz * t,
  );
}

function updateProjectiles(state, dt, events) {
  for (const item of state.projectiles) {
    if (item.life <= 0) continue;
    const start = { x: item.x, y: item.y, z: item.z };
    item.life -= dt;
    if (item.type === "bomb") {
      item.vy -= 12 * dt;
      item.x += item.vx * dt;
      item.y += item.vy * dt;
      item.z += item.vz * dt;
      const floor = Math.max(groundAt(item.x, item.z) + 0.3, WATER + 0.1);
      if (item.y < floor) {
        item.y = floor;
        item.vy *= -0.32;
        item.vx *= 0.88;
        item.vz *= 0.88;
      }
      if (item.life <= 0) detonateBomb(state, item, events);
      continue;
    }
    if (item.type === "arrow") item.vy -= 3 * dt;
    item.x += item.vx * dt;
    item.y += item.vy * dt;
    item.z += item.vz * dt;
    if (item.owner === "player") {
      for (const enemy of state.enemies) {
        if (
          enemy.dead ||
          (enemy.type === "guardian" && state.progress.beacons.length < 3)
        )
          continue;
        const center = {
          x: enemy.x,
          y: enemy.y + (enemy.type === "guardian" ? 2 : 0.8),
          z: enemy.z,
        };
        if (
          segmentDistance(center, start, item) <
          (enemy.type === "guardian" ? 2.4 : 1.05)
        ) {
          damageEnemy(state, enemy, item.damage, events, "arrow");
          item.life = 0;
          break;
        }
      }
    } else {
      const p = state.player;
      if (
        segmentDistance({ x: p.x, y: p.y + 0.85, z: p.z }, start, item) <
        (item.type === "orb" ? 1.1 : 0.7)
      ) {
        const source =
          state.enemies.find((enemy) => enemy.id === item.owner) ?? start;
        hurtPlayer(state, item.damage, source, events);
        item.life = 0;
      }
    }
    if (
      item.y < groundAt(item.x, item.z) ||
      Math.abs(item.x) > HALF ||
      Math.abs(item.z) > HALF
    )
      item.life = 0;
  }
  state.projectiles = state.projectiles.filter((item) => item.life > 0);
}

function updateObjects(state, dt, events) {
  const p = state.player;
  for (const object of state.objects) {
    if (object.held) {
      const targetX = clamp(p.x + Math.sin(p.yaw) * 3.5, -HALF + 1, HALF - 1);
      const targetZ = clamp(p.z + Math.cos(p.yaw) * 3.5, -HALF + 1, HALF - 1);
      object.x += (targetX - object.x) * Math.min(1, dt * 8);
      object.z += (targetZ - object.z) * Math.min(1, dt * 8);
      object.y = Math.max(p.y + 0.8, groundAt(object.x, object.z) + 0.5);
    }
    if (object.type === "ice") object.life -= dt;
  }
  state.objects = state.objects.filter(
    (item) => item.type !== "ice" || item.life > 0,
  );
  const metal = state.objects.find((item) => item.id === "wind-block");
  if (
    !state.puzzles.wind &&
    metal &&
    !metal.held &&
    distance(metal, { x: -51, z: -9 }) < 2.3
  ) {
    state.puzzles.wind = true;
    metal.x = -51;
    metal.z = -9;
    metal.y = groundAt(-51, -9);
    events.push(
      toast("压力台已启动！翠风信标可以点亮。", "success"),
      sound("beacon"),
    );
  }
}

function updateEnvironment(state, dt, events) {
  state.time = (9 + state.elapsed / 15) % 24;
  const cycle = Math.floor(state.elapsed / 85) % 5;
  state.weather = cycle === 2 ? "rain" : cycle === 3 ? "storm" : "clear";
  const region = regionAt(state.player.x, state.player.z);
  state.region = region;
  const armor = ARMORS[state.player.armor] ?? {};
  state.temperature =
    region === "snow"
      ? -12
      : region === "desert"
        ? 39
        : region === "lake"
          ? 19
          : 23;
  const cold =
    region === "snow" && !(armor.warmth > 0 || state.player.buffs.warmth > 0);
  const hot =
    region === "desert" &&
    !(armor.heat > 0) &&
    state.time >= 10 &&
    state.time <= 18;
  state.environmentTimer += dt;
  if (state.lastRegion !== region) {
    state.lastRegion = region;
    events.push(
      toast(
        `进入${REGIONS[region] ?? region}${cold ? " · 严寒会持续损耗生命，请穿御寒衣或食用暖阳汤。" : hot ? " · 酷热难耐，沙行轻衣可以抵御热浪。" : ""}`,
        cold || hot ? "warning" : "info",
      ),
    );
  }
  if (state.environmentTimer >= 4) {
    state.environmentTimer = 0;
    if (cold || hot)
      hurtPlayer(state, cold ? 4 : 3, state.player, events, true);
    if (
      state.weather === "storm" &&
      state.player.armor === "knight" &&
      state.elapsed % 24 < 4
    ) {
      addEffect(
        state,
        "lightning",
        state.player.x,
        state.player.y,
        state.player.z,
        2,
        0.6,
      );
      hurtPlayer(state, 12, state.player, events, true);
      events.push(toast("雷暴会吸引金属护甲！换下守望护甲。", "warning"));
    }
  }
  for (const location of LOCATIONS) {
    if (
      distance(location, state.player) < 12 &&
      !state.progress.discovered.includes(location.id)
    ) {
      state.progress.discovered.push(location.id);
      if (
        location.type !== "shop" &&
        location.type !== "cook" &&
        location.type !== "npc"
      ) {
        events.push(toast(`发现：${location.name}`, "success"));
      }
    }
  }
  state.autosaveTimer += dt;
  if (state.autosaveTimer >= 30) {
    state.autosaveTimer = 0;
    events.push({ type: "save" });
  }
}

export function stepGame(state, input = {}, dt = 1 / 60) {
  const events = [];
  if (!state || state.dead || !Number.isFinite(dt) || dt <= 0) return events;
  dt = Math.min(dt, 0.12);
  input = { ...EMPTY_INPUT, ...input };
  if (Number.isFinite(input.aimYaw)) state.player.yaw = input.aimYaw % TAU;
  for (const action of ["jump", "dodge", "attack", "bow", "rune", "interact"]) {
    if (input[action]) events.push(...command(state, action));
  }
  const substeps = Math.max(1, Math.ceil(dt / (1 / 60)));
  const slice = dt / substeps;
  for (let index = 0; index < substeps && !state.dead; index += 1) {
    state.elapsed += slice;
    const p = state.player;
    for (const field of [
      "attackTimer",
      "bowTimer",
      "comboTimer",
      "invulnerable",
      "runeCooldown",
      "dodgeTimer",
      "exhaustTimer",
      "hurtTimer",
    ]) {
      p[field] = Math.max(0, p[field] - slice);
    }
    for (const field of ["warmth", "strength", "stamina"])
      p.buffs[field] = Math.max(0, p.buffs[field] - slice);
    updateMovement(state, input, slice, events);
    if (state.dead) break;
    updateObjects(state, slice, events);
    updateEnemies(state, slice, events);
    updateProjectiles(state, slice, events);
    updateEnvironment(state, slice, events);
    for (const effect of state.effects) effect.life -= slice;
    state.effects = state.effects
      .filter((effect) => effect.life > 0)
      .slice(-80);
  }
  updateContext(state);
  return events;
}

export function getObjective(state) {
  if (state.progress.bossDefeated)
    return {
      title: "风再次吹起",
      description: "守卫已平息。继续探索遗迹、收集物资与升级装备。",
      progress: "冒险完成 · 自由探索",
    };
  if (state.progress.beacons.length === 3)
    return {
      title: "最后的风暴",
      description: "前往北方旧王庭，击败风暴守卫。留意蓄力攻击与地面光圈。",
      progress: "三座信标已点亮",
    };
  if (!state.progress.talked)
    return {
      title: "来自风原的邀请",
      description: "与营地的守望人米拉交谈，了解失落的三座信标。",
      progress: "主线 · 原野的回响",
    };
  return {
    title: "点亮失落的三座信标",
    description:
      "翠风：磁力方块 · 余烬：木材火盆 · 霜冠：弓箭冰晶。可自由决定探索顺序。",
    progress: `${state.progress.beacons.length} / 3 座信标`,
  };
}

export function serializeGame(state) {
  return clone({
    version: 1,
    elapsed: state.elapsed,
    player: state.player,
    inventory: state.inventory,
    weapons: state.weapons,
    armors: state.armors,
    progress: state.progress,
    puzzles: state.puzzles,
    enemies: state.enemies.map(({ id, hp, dead, x, z }) => ({
      id,
      hp,
      dead,
      x,
      z,
    })),
    pickups: state.pickups
      .filter((item) => !item.active)
      .map((item) => item.id),
    chests: state.chests.filter((item) => item.open).map((item) => item.id),
    objects: state.objects
      .filter((item) => item.type === "metal")
      .map(({ id, x, z }) => ({ id, x, z })),
    horse: state.horse,
    checkpoint: state.checkpoint,
    stats: state.stats,
  });
}

export function restoreGame(value) {
  const state = createGame();
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return state;
    }
  }
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    value.version !== 1
  )
    return state;
  const read = (input, low, high, fallback) =>
    clamp(finite(input, fallback), low, high);
  const list = (input) => (Array.isArray(input) ? input : []);
  state.elapsed = read(value.elapsed, 0, 1e8, 0);
  state.time = (9 + state.elapsed / 15) % 24;
  const p = state.player,
    saved =
      value.player && typeof value.player === "object" ? value.player : {};
  p.x = read(saved.x, -HALF + 1, HALF - 1, p.x);
  p.z = read(saved.z, -HALF + 1, HALF - 1, p.z);
  p.maxHealth = read(saved.maxHealth, 100, 300, 100);
  p.maxStamina = read(saved.maxStamina, 100, 300, 100);
  p.health = read(saved.health, 1, p.maxHealth, p.maxHealth);
  p.stamina = read(saved.stamina, 0, p.maxStamina, p.maxStamina);
  p.yaw = read(saved.yaw, -TAU * 4, TAU * 4, p.yaw);
  p.y = read(saved.y, groundAt(p.x, p.z), 120, groundAt(p.x, p.z));
  const hit = blockedSolid(p.x, p.z, p.y);
  if (hit) p.y = groundAt(hit.x, hit.z) + hit.height;
  p.motion = p.y > terrainFloor(p.x, p.z, p.y) + 0.3 ? "air" : "ground";
  p.invulnerable = 3;
  const inv =
    value.inventory && typeof value.inventory === "object"
      ? value.inventory
      : {};
  for (const id of Object.keys(state.inventory))
    state.inventory[id] = Math.floor(
      read(inv[id], 0, 99999, state.inventory[id]),
    );
  const weapons =
    value.weapons && typeof value.weapons === "object" ? value.weapons : {};
  for (const [id, item] of Object.entries(state.weapons)) {
    const data = weapons[id];
    if (data && typeof data === "object") {
      item.owned = data.owned === true || id === "fists";
      item.durability = read(
        data.durability,
        0,
        WEAPONS[id]?.durability ?? 60,
        item.durability,
      );
    }
  }
  state.armors = [
    ...new Set([
      "traveler",
      ...list(value.armors).filter((id) => owns(ARMORS, id)),
    ]),
  ];
  if (
    typeof saved.weapon === "string" &&
    state.weapons[saved.weapon]?.owned &&
    saved.weapon !== "bow"
  )
    p.weapon = saved.weapon;
  if (state.armors.includes(saved.armor)) p.armor = saved.armor;
  if (RUNES.includes(saved.rune)) p.rune = saved.rune;
  if (saved.buffs && typeof saved.buffs === "object") {
    for (const id of Object.keys(p.buffs))
      p.buffs[id] = read(saved.buffs[id], 0, 600, 0);
  }
  const progress =
    value.progress && typeof value.progress === "object" ? value.progress : {};
  state.progress.beacons = [
    ...new Set(
      list(progress.beacons).filter((id) =>
        ["wind", "ember", "frost"].includes(id),
      ),
    ),
  ];
  state.progress.towers = [
    ...new Set(
      list(progress.towers).filter((id) =>
        LOCATIONS.some((item) => item.id === id && item.type === "tower"),
      ),
    ),
  ];
  state.progress.discovered = [
    ...new Set([
      "camp",
      ...list(progress.discovered).filter((id) =>
        LOCATIONS.some((item) => item.id === id),
      ),
    ]),
  ];
  for (const id of ["talked", "delivery", "bossDefeated"])
    state.progress[id] = progress[id] === true;
  state.progress.kills = Math.floor(
    read(progress.kills, 0, ENEMY_SPAWNS.length, 0),
  );
  if (value.puzzles && typeof value.puzzles === "object") {
    for (const id of Object.keys(state.puzzles))
      state.puzzles[id] =
        value.puzzles[id] === true || state.progress.beacons.includes(id);
  }
  for (const enemy of state.enemies) {
    const data = list(value.enemies).find(
      (item) => item && item.id === enemy.id,
    );
    if (!data) continue;
    enemy.dead = data.dead === true;
    enemy.hp = enemy.dead ? 0 : read(data.hp, 1, enemy.maxHp, enemy.maxHp);
    enemy.x = read(data.x, enemy.homeX - 30, enemy.homeX + 30, enemy.homeX);
    enemy.z = read(data.z, enemy.homeZ - 30, enemy.homeZ + 30, enemy.homeZ);
    enemy.y = groundAt(enemy.x, enemy.z);
  }
  if (state.progress.bossDefeated) {
    const boss = state.enemies.find((enemy) => enemy.type === "guardian");
    if (boss) {
      boss.dead = true;
      boss.hp = 0;
    }
  }
  for (const item of state.pickups)
    item.active = !list(value.pickups).includes(item.id);
  for (const chest of state.chests)
    chest.open = list(value.chests).includes(chest.id);
  for (const object of state.objects) {
    const data = list(value.objects).find(
      (item) => item && item.id === object.id,
    );
    if (!data) continue;
    object.x = read(data.x, -HALF + 1, HALF - 1, object.x);
    object.z = read(data.z, -HALF + 1, HALF - 1, object.z);
    object.y = groundAt(object.x, object.z);
  }
  if (value.horse && typeof value.horse === "object") {
    state.horse.x = read(value.horse.x, -HALF + 1, HALF - 1, state.horse.x);
    state.horse.z = read(value.horse.z, -HALF + 1, HALF - 1, state.horse.z);
    state.horse.y = groundAt(state.horse.x, state.horse.z);
    state.horse.yaw = read(value.horse.yaw, -TAU * 4, TAU * 4, Math.PI);
  }
  if (value.checkpoint && typeof value.checkpoint === "object") {
    const candidate = {
      x: finite(value.checkpoint.x, SPAWN.x),
      z: finite(value.checkpoint.z, SPAWN.z),
    };
    if (
      LOCATIONS.some(
        (item) => item.type === "camp" && distance(candidate, item) < 7,
      )
    )
      state.checkpoint = candidate;
  }
  if (value.stats && typeof value.stats === "object") {
    for (const id of Object.keys(state.stats))
      state.stats[id] = read(value.stats[id], 0, 1e9, 0);
  }
  state.lastRegion = regionAt(p.x, p.z);
  state.region = state.lastRegion;
  state.victory = false;
  updateContext(state);
  return state;
}
