export const WORLD = Object.freeze({ size: 220, half: 110, water: 0.6 });
export const SPAWN = Object.freeze({ x: 0, z: 44 });
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mound = (x, z, cx, cz, r) =>
  Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (r * r));
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
export function heightAt(x, z) {
  const edge = smooth(88, 111, Math.max(Math.abs(x), Math.abs(z)));
  const plateau = 1 - smooth(13, 16, Math.hypot(x + 48, z + 8));
  return (
    2.9 +
    Math.sin(x * 0.062) * Math.cos(z * 0.055) * 1.9 +
    Math.sin((x + z) * 0.11) * 0.65 +
    5 * mound(x, z, -10, 42, 25) +
    23 * mound(x, z, -60, -64, 25) +
    10 * mound(x, z, 59, -27, 29) +
    7 * mound(x, z, 5, -68, 20) +
    11 * plateau -
    12 * mound(x, z, 28, 8, 20) -
    edge * 14
  );
}
export function regionAt(x, z) {
  if (x < -30 && z < -36) return "snow";
  if (x > 32 && z < 12) return "desert";
  if (z < -45 && x > -27 && x < 34) return "ruins";
  if (Math.hypot((x - 28) / 1.1, z - 8) < 24) return "lake";
  if (x < -20 && z > -35) return "forest";
  return "meadow";
}
export const REGIONS = {
  meadow: "风息草原",
  forest: "翠隐森林",
  lake: "镜蓝湖",
  desert: "余烬荒原",
  snow: "霜冠雪岭",
  ruins: "旧王庭",
};
export const LOCATIONS = [
  {
    id: "camp",
    type: "camp",
    name: "风铃营地",
    x: 0,
    z: 44,
    description: "休息、恢复，并记录新的归途。",
  },
  {
    id: "sage",
    type: "npc",
    name: "守望人 · 米拉",
    x: -4,
    z: 40,
    description: "听听失落信标的故事；带来 3 份木材帮助修复营地。",
  },
  {
    id: "shop",
    type: "shop",
    name: "行脚商人",
    x: 7,
    z: 39,
    description: "用晶币补充箭矢，购置护甲。",
  },
  {
    id: "cook",
    type: "cook",
    name: "营地炊锅",
    x: -5,
    z: 47,
    description: "将采集的食材制成恢复与抗寒料理。",
  },
  {
    id: "tower-meadow",
    type: "tower",
    name: "望风塔",
    x: -21,
    z: 24,
    description: "点亮塔顶，解锁传送与地图标记。",
  },
  {
    id: "tower-dunes",
    type: "tower",
    name: "流沙塔",
    x: 52,
    z: 36,
    description: "眺望荒原和镜蓝湖。",
  },
  {
    id: "tower-north",
    type: "tower",
    name: "长夜塔",
    x: 8,
    z: -34,
    description: "旧王庭前的最后一束光。",
  },
  {
    id: "wind",
    type: "beacon",
    name: "翠风遗迹",
    x: -48,
    z: -8,
    description: "磁引石块到发光的压力台，再唤醒信标。",
  },
  {
    id: "ember",
    type: "beacon",
    name: "余烬遗迹",
    x: 54,
    z: -25,
    description: "用 2 份木材点燃火盆，再唤醒信标。",
  },
  {
    id: "frost",
    type: "beacon",
    name: "霜冠遗迹",
    x: -58,
    z: -62,
    description: "用弓箭击中冰晶，或用冰桥符文共鸣，再唤醒信标。",
  },
  {
    id: "boss",
    type: "boss",
    name: "风暴王庭",
    x: 5,
    z: -70,
    description: "点亮三座信标，挑战风暴守卫。",
  },
];
export const SOLIDS = [
  {
    id: "hut-west",
    x: -11,
    z: 45,
    width: 6,
    depth: 5,
    height: 4,
    climbable: true,
  },
  {
    id: "hut-east",
    x: 12,
    z: 45,
    width: 6,
    depth: 5,
    height: 4,
    climbable: true,
  },
  ...LOCATIONS.filter((l) => l.type === "tower").map((l) => ({
    id: l.id,
    x: l.x,
    z: l.z,
    width: 3.2,
    depth: 3.2,
    height: 10,
    climbable: true,
  })),
  {
    id: "ruin-pillar-west",
    x: -3,
    z: -68,
    width: 2.4,
    depth: 2.4,
    height: 7,
    climbable: true,
  },
  {
    id: "ruin-pillar-east",
    x: 13,
    z: -68,
    width: 2.4,
    depth: 2.4,
    height: 7,
    climbable: true,
  },
  {
    id: "forest-outcrop",
    x: -26,
    z: 1,
    width: 4,
    depth: 4,
    height: 5,
    climbable: true,
  },
];
export const ITEMS = {
  apple: {
    name: "野苹果",
    icon: "●",
    description: "清甜果实，恢复 12 点生命。",
  },
  mushroom: {
    name: "山野菌",
    icon: "♠",
    description: "料理食材，生吃恢复 8 点生命。",
  },
  herb: { name: "暖阳草", icon: "❧", description: "制作抗寒或精力料理。" },
  meat: { name: "鲜肉", icon: "◆", description: "野外搜集的食材，恢复生命。" },
  wood: { name: "木材", icon: "▥", description: "修补营地、点燃遗迹火盆。" },
  ore: { name: "辉晶矿", icon: "◇", description: "探索荒野获得的珍贵矿物。" },
  coin: { name: "晶币", icon: "✧", description: "行脚商人的通用货币。" },
  arrow: {
    name: "木箭",
    icon: "↗",
    description: "远程射击消耗一支；遗迹冰晶会回应箭矢。",
  },
  meal: { name: "山野炖菜", icon: "✦", description: "恢复 55 点生命。" },
  warmMeal: {
    name: "暖阳汤",
    icon: "☀",
    description: "恢复 35 点生命，并获得 3 分钟抗寒。",
  },
  staminaMeal: {
    name: "精力烤菌",
    icon: "ϟ",
    description: "恢复全部精力，并提升 90 秒精力恢复。",
  },
  spirit: {
    name: "风之印记",
    icon: "◈",
    description: "信标授予的印记，可永久提升生命或精力。",
  },
};
export const RECIPES = {
  meal: {
    name: "山野炖菜",
    ingredients: { apple: 1, mushroom: 1 },
    effect: { heal: 55 },
    description: "恢复 55 点生命。",
  },
  warmMeal: {
    name: "暖阳汤",
    ingredients: { herb: 1, mushroom: 1 },
    effect: { heal: 35, warmth: 180 },
    description: "恢复生命，抵御雪山严寒 3 分钟。",
  },
  staminaMeal: {
    name: "精力烤菌",
    ingredients: { herb: 1, apple: 1 },
    effect: { stamina: 100, staminaBuff: 90 },
    description: "恢复全部精力，90 秒加速恢复。",
  },
};
export const WEAPONS = {
  sword: { name: "旅者短剑", damage: 9, durability: 50, speed: 0.43 },
  axe: { name: "拓荒战斧", damage: 15, durability: 70, speed: 0.75 },
  bow: { name: "风木弓", damage: 12, durability: 80, speed: 0.7 },
  fists: { name: "徒手", damage: 4, durability: 999999, speed: 0.4 },
};
export const ARMORS = {
  traveler: { name: "旅者衣", defense: 0, warmth: 0, heat: 0, price: 0 },
  cloak: { name: "霜绒斗篷", defense: 1, warmth: 1, heat: 0, price: 18 },
  desert: { name: "沙行轻衣", defense: 1, warmth: 0, heat: 1, price: 18 },
  knight: { name: "守望护甲", defense: 3, warmth: 0, heat: 0, price: 35 },
};
export const RUNES = ["bomb", "magnet", "stasis", "ice"];
export const RUNE_LABELS = {
  bomb: "遥控炸弹",
  magnet: "磁引之手",
  stasis: "时停锁定",
  ice: "冰桥共鸣",
};
export const CHESTS = [
  { id: "chest-camp", x: 4, z: 49, reward: { coin: 12, arrow: 10, herb: 2 } },
  { id: "chest-forest", x: -29, z: 4, reward: { coin: 15, apple: 3 } },
  { id: "chest-lake", x: 44, z: 6, reward: { coin: 18, arrow: 12 } },
  { id: "chest-dunes", x: 64, z: -19, reward: { coin: 20, ore: 3 } },
  { id: "chest-snow", x: -66, z: -55, reward: { coin: 22, warmMeal: 1 } },
  { id: "chest-ruins", x: 18, z: -54, reward: { coin: 25, arrow: 15 } },
  { id: "chest-cliff", x: -43, z: -11, reward: { coin: 15, staminaMeal: 1 } },
];
export const ENEMY_SPAWNS = [
  { id: "slime-1", type: "slime", x: 5, z: 26 },
  { id: "slime-2", type: "slime", x: -12, z: 12 },
  { id: "slime-3", type: "slime", x: 34, z: 34 },
  { id: "slime-4", type: "slime", x: -35, z: 36 },
  { id: "raider-1", type: "raider", x: -32, z: 11 },
  { id: "raider-2", type: "raider", x: -53, z: 13 },
  { id: "raider-3", type: "raider", x: 43, z: -14 },
  { id: "raider-4", type: "raider", x: 65, z: -31 },
  { id: "raider-5", type: "raider", x: -49, z: -41 },
  { id: "raider-6", type: "raider", x: 13, z: -51 },
  { id: "archer-1", type: "archer", x: -31, z: -19 },
  { id: "archer-2", type: "archer", x: 61, z: -7 },
  { id: "archer-3", type: "archer", x: -70, z: -58 },
  { id: "archer-4", type: "archer", x: -9, z: -53 },
  { id: "guardian", type: "guardian", x: 5, z: -70 },
];
function randomStream(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
const rng = randomStream(30930);
export const RESOURCE_SPAWNS = [
  { id: "apple-start", type: "apple", x: 1, z: 39 },
  { id: "mushroom-start", type: "mushroom", x: -4, z: 35 },
  { id: "herb-start", type: "herb", x: -6, z: 38 },
  { id: "wood-start-1", type: "wood", x: -15, z: 38 },
  { id: "wood-start-2", type: "wood", x: -16, z: 34 },
  { id: "wood-start-3", type: "wood", x: -12, z: 30 },
  { id: "wood-ember-1", type: "wood", x: 48, z: -21 },
  { id: "wood-ember-2", type: "wood", x: 51, z: -17 },
  { id: "herb-north-1", type: "herb", x: -39, z: -32 },
  { id: "herb-north-2", type: "herb", x: -42, z: -35 },
];
for (let i = 0; i < 90; i++) {
  const x = (rng() - 0.5) * 168,
    z = (rng() - 0.5) * 168;
  if (heightAt(x, z) < WORLD.water + 0.4) continue;
  if (
    SOLIDS.some(
      (s) =>
        Math.abs(x - s.x) < s.width / 2 + 1 &&
        Math.abs(z - s.z) < s.depth / 2 + 1,
    )
  )
    continue;
  const region = regionAt(x, z),
    roll = rng();
  const type =
    region === "desert"
      ? "ore"
      : region === "snow"
        ? roll < 0.6
          ? "herb"
          : "ore"
        : roll < 0.23
          ? "apple"
          : roll < 0.45
            ? "wood"
            : roll < 0.72
              ? "mushroom"
              : "herb";
  RESOURCE_SPAWNS.push({ id: `resource-${i}`, type, x, z });
}
export const TREES = [];
for (let i = 0; i < 450; i++) {
  const x = (rng() - 0.5) * 197,
    z = (rng() - 0.5) * 197,
    region = regionAt(x, z),
    h = heightAt(x, z);
  if (h < WORLD.water + 1 || region === "desert" || region === "ruins")
    continue;
  if (LOCATIONS.some((l) => Math.hypot(l.x - x, l.z - z) < 7)) continue;
  if (SOLIDS.some((s) => Math.hypot(s.x - x, s.z - z) < 7)) continue;
  if (region === "meadow" && rng() > 0.43) continue;
  TREES.push({
    x,
    z,
    scale: 0.72 + rng() * 0.9,
    type: region === "snow" ? "pine" : rng() > 0.5 ? "pine" : "oak",
  });
}
