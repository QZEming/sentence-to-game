export const WEAPON_ORDER = ["rifle", "smg", "shotgun", "sniper", "pistol"];
export const WEAPONS = {
  rifle: {
    id: "rifle",
    name: "AR-7 先锋",
    label: "突击步枪",
    damage: 24,
    headMultiplier: 1.7,
    magSize: 30,
    reserve: 150,
    interval: 0.105,
    reload: 1.85,
    spread: 0.013,
    adsSpread: 0.004,
    pellets: 1,
    range: 52,
    falloff: 0.72,
    recoil: 0.018,
    adsFov: 52,
    color: "#8fcac5",
  },
  smg: {
    id: "smg",
    name: "V-9 脉冲",
    label: "冲锋枪",
    damage: 16,
    headMultiplier: 1.55,
    magSize: 36,
    reserve: 180,
    interval: 0.068,
    reload: 1.45,
    spread: 0.023,
    adsSpread: 0.009,
    pellets: 1,
    range: 26,
    falloff: 0.48,
    recoil: 0.012,
    adsFov: 58,
    color: "#eac26c",
  },
  shotgun: {
    id: "shotgun",
    name: "M-8 破门者",
    label: "霰弹枪",
    damage: 11,
    headMultiplier: 1.2,
    magSize: 7,
    reserve: 42,
    interval: 0.82,
    reload: 2.3,
    spread: 0.092,
    adsSpread: 0.063,
    pellets: 8,
    range: 19,
    falloff: 0.35,
    recoil: 0.055,
    adsFov: 62,
    color: "#dc9378",
  },
  sniper: {
    id: "sniper",
    name: "S-5 长弓",
    label: "狙击步枪",
    damage: 82,
    headMultiplier: 2,
    magSize: 5,
    reserve: 30,
    interval: 1.05,
    reload: 2.65,
    spread: 0.006,
    adsSpread: 0.0008,
    pellets: 1,
    range: 100,
    falloff: 0.9,
    recoil: 0.075,
    adsFov: 25,
    color: "#b5b2d9",
  },
  pistol: {
    id: "pistol",
    name: "K-12 游隼",
    label: "轻型手枪",
    damage: 29,
    headMultiplier: 1.65,
    magSize: 12,
    reserve: 72,
    interval: 0.26,
    reload: 1.2,
    spread: 0.016,
    adsSpread: 0.006,
    pellets: 1,
    range: 38,
    falloff: 0.6,
    recoil: 0.025,
    adsFov: 60,
    color: "#cad6ce",
  },
};
export const CLASSES = {
  assault: {
    name: "先锋",
    description: "均衡火力与防护，适合多种交战距离。",
    health: 100,
    armor: 60,
    speed: 6.1,
    stamina: 100,
    weapon: "rifle",
  },
  recon: {
    name: "游骑",
    description: "轻装高速，绕侧翼与抢占据点。",
    health: 90,
    armor: 40,
    speed: 6.9,
    stamina: 115,
    weapon: "smg",
  },
  heavy: {
    name: "重装",
    description: "更高生命与护甲，近距离稳守阵线。",
    health: 120,
    armor: 90,
    speed: 5.4,
    stamina: 90,
    weapon: "shotgun",
  },
};
export const DIFFICULTIES = {
  easy: {
    name: "新兵",
    reaction: 0.72,
    spread: 0.075,
    damage: 0.72,
    fireInterval: 0.35,
  },
  normal: {
    name: "战术",
    reaction: 0.46,
    spread: 0.043,
    damage: 0.88,
    fireInterval: 0.26,
  },
  hard: {
    name: "精英",
    reaction: 0.25,
    spread: 0.025,
    damage: 1,
    fireInterval: 0.18,
  },
};
export const MODES = {
  team: {
    name: "团队激斗",
    description: "3v3 AI 对战 · 先取得 25 次击败的队伍获胜。",
    target: 25,
    timeLimit: 300,
  },
  control: {
    name: "据点争夺",
    description: "争夺 A / B / C，占领据点持续得分，先到 150 分获胜。",
    target: 150,
    timeLimit: 360,
  },
  survival: {
    name: "波次生存",
    description: "与一名 AI 队友守住 5 波进攻；3 次生命，波间强化。",
    target: 5,
    timeLimit: 0,
  },
  training: {
    name: "自由训练",
    description: "无敌方还击，练习五种武器、移动、瞄准和爆头。",
    target: 0,
    timeLimit: 0,
  },
};
const obstacle = (
  id,
  x,
  z,
  w,
  d,
  h,
  type = "container",
  color,
  y = 0,
  hp = 0,
) => ({ id, x, y, z, w, d, h, type, color, hp });
function boundaries(prefix, hx, hz) {
  return [
    obstacle(
      prefix + "-north",
      0,
      -hz - 0.75,
      hx * 2 + 3,
      1.5,
      5,
      "wall",
      "#b8b9ae",
    ),
    obstacle(
      prefix + "-south",
      0,
      hz + 0.75,
      hx * 2 + 3,
      1.5,
      5,
      "wall",
      "#b8b9ae",
    ),
    obstacle(
      prefix + "-west",
      -hx - 0.75,
      0,
      1.5,
      hz * 2,
      5,
      "wall",
      "#b8b9ae",
    ),
    obstacle(prefix + "-east", hx + 0.75, 0, 1.5, hz * 2, 5, "wall", "#b8b9ae"),
  ];
}
export const MAPS = {
  harbor: {
    id: "harbor",
    name: "港湾前哨",
    description: "集装箱与高台交错，三条进攻路线争夺中央货场。",
    bounds: { halfX: 30, halfZ: 37 },
    color: {
      ground: "#899897",
      sky: "#b8d2d4",
      fog: "#b8cdd0",
      accent: "#58b8b3",
    },
    obstacles: [
      ...boundaries("h", 30, 37),
      obstacle("h-platform-west", -17, 1, 8, 12, 3, "platform", "#497572"),
      obstacle("h-platform-east", 17, -3, 8, 12, 3, "platform", "#88654f"),
      obstacle("h-blue-bulkhead", 0, 18, 8, 3, 2.8, "container", "#3a6872"),
      obstacle("h-red-bulkhead", 0, -18, 8, 3, 2.8, "container", "#9a5b4d"),
      obstacle("h-west-cargo", -9, -22, 5, 10, 2.7, "container", "#548084"),
      obstacle("h-east-cargo", 9, 22, 5, 10, 2.7, "container", "#a06c52"),
      obstacle("h-center-west", -4, -3, 5, 10, 2.6, "container", "#597b79"),
      obstacle("h-center-east", 4, 3, 5, 10, 2.6, "container", "#9a7760"),
      obstacle("h-cover-south", -9, 17, 3.5, 1.4, 1.15, "barrier", "#c4bd9e"),
      obstacle("h-cover-north", 9, -17, 3.5, 1.4, 1.15, "barrier", "#c4bd9e"),
      obstacle("h-cover-west", -24, -13, 1.5, 5, 1.3, "barrier", "#bbbda9"),
      obstacle("h-cover-east", 24, 13, 1.5, 5, 1.3, "barrier", "#bbbda9"),
      obstacle("h-spawn-west", -21, 28, 5, 3, 2.3, "container", "#688989"),
      obstacle("h-spawn-east", 21, -28, 5, 3, 2.3, "container", "#9b7a5e"),
      obstacle("h-crate-1", -10, 6, 2.2, 2.2, 1.65, "crate", "#b48c5c", 0, 64),
      obstacle("h-crate-2", 10, -6, 2.2, 2.2, 1.65, "crate", "#b48c5c", 0, 64),
      obstacle("h-crate-3", -22, 19, 2, 2, 1.5, "crate", "#b48c5c", 0, 64),
      obstacle("h-crate-4", 22, -19, 2, 2, 1.5, "crate", "#b48c5c", 0, 64),
    ],
    ramps: [
      {
        id: "h-ramp-west",
        x: -17,
        z: 10,
        w: 8,
        d: 6,
        h: 3,
        axis: "z",
        rise: -1,
      },
      {
        id: "h-ramp-east",
        x: 17,
        z: -12,
        w: 8,
        d: 6,
        h: 3,
        axis: "z",
        rise: 1,
      },
    ],
    spawns: [
      [
        { x: 0, z: 30 },
        { x: -10, z: 30 },
        { x: 10, z: 30 },
      ],
      [
        { x: 0, z: -30 },
        { x: 10, z: -30 },
        { x: -10, z: -30 },
      ],
    ],
    objectives: [
      { id: "A", x: -22, z: 17, radius: 4.8 },
      { id: "B", x: 0, z: 0, radius: 4.8 },
      { id: "C", x: 22, z: -17, radius: 4.8 },
    ],
    pickups: [
      { id: "h-med", type: "health", x: -25, z: 0, respawn: 16 },
      { id: "h-armor", type: "armor", x: 25, z: 0, respawn: 18 },
      { id: "h-ammo-s", type: "ammo", x: 0, z: 10, respawn: 12 },
      { id: "h-ammo-n", type: "ammo", x: 0, z: -10, respawn: 12 },
      { id: "h-grenade-s", type: "grenade", x: -9, z: 10, respawn: 22 },
      { id: "h-grenade-n", type: "grenade", x: 9, z: -10, respawn: 22 },
    ],
    patrol: [
      { x: -24, z: 10 },
      { x: 24, z: -10 },
      { x: 0, z: 10 },
      { x: 0, z: -10 },
      { x: -12, z: -12 },
      { x: 12, z: 12 },
    ],
    trainingSpawns: [
      { x: -5, z: 25 },
      { x: 5, z: 23 },
      { x: -13, z: 18 },
      { x: 13, z: 13 },
      { x: 0, z: 9 },
    ],
  },
  desert: {
    id: "desert",
    name: "赤沙基地",
    description: "开阔火线、低矮掩体与双侧观测平台，控制交叉路口。",
    bounds: { halfX: 32, halfZ: 38 },
    color: {
      ground: "#c8b58d",
      sky: "#dacdb0",
      fog: "#d4c7aa",
      accent: "#d99859",
    },
    obstacles: [
      ...boundaries("d", 32, 38),
      obstacle("d-platform-west", -19, -5, 8, 14, 3, "platform", "#b49b79"),
      obstacle("d-platform-east", 19, 5, 8, 14, 3, "platform", "#9b9274"),
      obstacle("d-command-core", 0, 0, 6, 6, 4.3, "wall", "#a9a68f"),
      obstacle("d-south-cover", 0, 21, 10, 2.5, 2.4, "container", "#697e79"),
      obstacle("d-north-cover", 0, -21, 10, 2.5, 2.4, "container", "#a86b52"),
      obstacle("d-east-building", 12, -22, 7, 8, 3.2, "container", "#ad9777"),
      obstacle("d-west-building", -12, 22, 7, 8, 3.2, "container", "#a19b83"),
      obstacle("d-west-center", -8, -2, 1.8, 9, 1.25, "barrier", "#b7aa87"),
      obstacle("d-east-center", 8, 2, 1.8, 9, 1.25, "barrier", "#b7aa87"),
      obstacle("d-south-west", -25, 24, 4, 2, 1.25, "barrier", "#b9ac8b"),
      obstacle("d-north-east", 25, -24, 4, 2, 1.25, "barrier", "#b9ac8b"),
      obstacle("d-west-block", -22, -28, 4, 5, 2.6, "container", "#aa8961"),
      obstacle("d-east-block", 22, 28, 4, 5, 2.6, "container", "#7e8c7c"),
      obstacle("d-crate-1", -11, -13, 2.3, 2.3, 1.6, "crate", "#b38a58", 0, 64),
      obstacle("d-crate-2", 11, 13, 2.3, 2.3, 1.6, "crate", "#b38a58", 0, 64),
      obstacle("d-crate-3", -27, 3, 2, 2, 1.6, "crate", "#b38a58", 0, 64),
      obstacle("d-crate-4", 27, -3, 2, 2, 1.6, "crate", "#b38a58", 0, 64),
    ],
    ramps: [
      {
        id: "d-ramp-west",
        x: -19,
        z: 5,
        w: 8,
        d: 6,
        h: 3,
        axis: "z",
        rise: -1,
      },
      { id: "d-ramp-east", x: 19, z: -5, w: 8, d: 6, h: 3, axis: "z", rise: 1 },
    ],
    spawns: [
      [
        { x: 0, z: 31 },
        { x: -9, z: 31 },
        { x: 9, z: 31 },
      ],
      [
        { x: 0, z: -31 },
        { x: 9, z: -31 },
        { x: -9, z: -31 },
      ],
    ],
    objectives: [
      { id: "A", x: -24, z: 14, radius: 4.8 },
      { id: "B", x: 0, z: 9, radius: 4.8 },
      { id: "C", x: 24, z: -14, radius: 4.8 },
    ],
    pickups: [
      { id: "d-med", type: "health", x: -27, z: -16, respawn: 16 },
      { id: "d-armor", type: "armor", x: 27, z: 16, respawn: 18 },
      { id: "d-ammo-s", type: "ammo", x: 0, z: 14, respawn: 12 },
      { id: "d-ammo-n", type: "ammo", x: 0, z: -14, respawn: 12 },
      { id: "d-grenade-w", type: "grenade", x: -10, z: 8, respawn: 22 },
      { id: "d-grenade-e", type: "grenade", x: 10, z: -8, respawn: 22 },
    ],
    patrol: [
      { x: -26, z: 12 },
      { x: 26, z: -12 },
      { x: 0, z: 12 },
      { x: 0, z: -12 },
      { x: -10, z: -14 },
      { x: 10, z: 14 },
    ],
    trainingSpawns: [
      { x: -5, z: 27 },
      { x: 6, z: 27 },
      { x: -7, z: 16 },
      { x: 13, z: 16 },
      { x: 0, z: 13 },
    ],
  },
};
function mapValue(value) {
  return typeof value === "string" ? MAPS[value] || MAPS.harbor : value;
}
export function floorAt(value, x, z, feet = Infinity) {
  const map = mapValue(value);
  let height = 0;
  for (const box of map.obstacles) {
    if (box.destroyed) continue;
    const top = box.y + box.h;
    if (
      Math.abs(x - box.x) <= box.w / 2 &&
      Math.abs(z - box.z) <= box.d / 2 &&
      feet >= top - 0.25
    )
      height = Math.max(height, top);
  }
  for (const ramp of map.ramps) {
    if (Math.abs(x - ramp.x) > ramp.w / 2 || Math.abs(z - ramp.z) > ramp.d / 2)
      continue;
    const span = ramp.axis === "x" ? ramp.w : ramp.d;
    const coord = ramp.axis === "x" ? x - ramp.x : z - ramp.z;
    const t = Math.max(0, Math.min(1, 0.5 + (coord / span) * ramp.rise));
    height = Math.max(height, t * ramp.h);
  }
  return height;
}
export const groundAt = (map, x, z) => floorAt(map, x, z);
