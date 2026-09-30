import {
  WORLD,
  REGIONS,
  LOCATIONS,
  ITEMS,
  RECIPES,
  WEAPONS,
  ARMORS,
  RUNES,
  RUNE_LABELS,
  heightAt,
  regionAt,
} from "./data.js";

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, Number(value) || 0));
const number = (value) => Math.max(0, Math.round(Number(value) || 0));
const escape = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const runeSymbols = { bomb: "◉", magnet: "⊓", stasis: "⌛", ice: "❄" };
const runeDescriptions = {
  bomb: "首次施放投出炸弹，再次施放引爆。爆炸会伤及近处的自己。",
  magnet: "提起或放下附近的金属块，让它跟随你移动。",
  stasis: "暂时定住前方敌人，争取进攻与脱身的时间。",
  ice: "在水面召唤冰台；也能回应霜冠遗迹的冰晶。",
};
const weaponIcons = { sword: "⚔", axe: "⚒", bow: "↗", fists: "◇" };
const armorIcons = { traveler: "♧", cloak: "❄", desert: "☀", knight: "♜" };
const foodIds = [
  "apple",
  "mushroom",
  "meat",
  "meal",
  "warmMeal",
  "staminaMeal",
];
const regionColors = {
  meadow: [149, 175, 117],
  forest: [88, 135, 94],
  lake: [95, 150, 155],
  desert: [197, 170, 111],
  snow: [199, 211, 197],
  ruins: [133, 150, 129],
};
const weatherLabels = { clear: "晴", rain: "雨", storm: "雷雨" };
const motionLabels = {
  glide: "乘风滑翔",
  climb: "攀登中",
  swim: "游泳中",
  ride: "骑行中",
};
const itemName = (id) =>
  ITEMS[id]?.name || WEAPONS[id]?.name || ARMORS[id]?.name || id;
const icon = (id) => ITEMS[id]?.icon || "◇";
const actionButton = (action, id, label, options = {}) =>
  `<button class="button ${options.primary ? "primary " : ""}${options.small ? "small " : ""}${options.wide ? "wide " : ""}" data-command="${escape(action)}" data-id="${escape(id)}"${options.disabled ? " disabled" : ""}>${escape(label)}</button>`;

function objective(state) {
  const progress = state.progress || {};
  const count = progress.beacons?.length || 0;
  if (progress.bossDefeated || state.victory)
    return {
      title: "风已再次归来",
      description: "风暴散去。尚未走过的山川，仍在等待你的足迹。",
      progress: "已完成",
    };
  if (count >= 3)
    return {
      title: "前往旧王庭，平息风暴",
      description: "三道古老回响已苏醒。北方的风暴守卫正在等待。",
      progress: "3 / 3",
    };
  if (!progress.talked)
    return {
      title: "与守望人米拉交谈",
      description: "前往营地炊烟旁，听听失落信标与风的故事。",
      progress: `${count} / 3`,
    };
  return {
    title: "唤醒三座古代信标",
    description: "森林的磁石、荒原的火光、雪岭的冰晶，将指引你。",
    progress: `${count} / 3`,
  };
}

function createMapTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 300;
  const ctx = canvas.getContext("2d");
  const pixels = ctx.createImageData(300, 300);
  for (let y = 0; y < 300; y++) {
    for (let x = 0; x < 300; x++) {
      const wx = (x / 300 - 0.5) * WORLD.size;
      const wz = (y / 300 - 0.5) * WORLD.size;
      const height = heightAt(wx, wz);
      const water = height < WORLD.water;
      const rgb = water ? [91, 147, 154] : regionColors[regionAt(wx, wz)];
      const slope = heightAt(wx + 0.8, wz + 0.8) - height;
      const shade = water
        ? 1
        : clamp(1 + slope * 0.055 + Math.sin(height * 1.7) * 0.035, 0.75, 1.2);
      const i = (y * 300 + x) * 4;
      pixels.data[i] = rgb[0] * shade;
      pixels.data[i + 1] = rgb[1] * shade;
      pixels.data[i + 2] = rgb[2] * shade;
      pixels.data[i + 3] = 255;
    }
  }
  ctx.putImageData(pixels, 0, 0);
  return canvas;
}

export function createUI(callbacks = {}) {
  const $ = (id) => document.getElementById(id);
  let mode = "loading";
  let state = null;
  let panelData = {};
  let panelSignature = "";
  let lastHudTime = -1000;
  let toastTimer;
  let soundEnabled = true;
  let focusBeforeModal = null;
  let hasSave = false;
  let helpFromMenu = false;
  const mapTexture = createMapTexture();
  const setText = (id, value) => {
    const node = $(id);
    if (node && node.textContent !== String(value))
      node.textContent = String(value);
  };
  const modalModes = new Set([
    "paused",
    "inventory",
    "map",
    "cook",
    "shop",
    "dialogue",
    "dead",
    "victory",
    "help",
  ]);

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    if (button.dataset.open) callbacks.onOpen?.(button.dataset.open);
    else if (button.dataset.input) callbacks.onInput?.(button.dataset.input);
    else if (button.dataset.command)
      callbacks.onAction?.(button.dataset.command, { id: button.dataset.id });
    else {
      const action = button.dataset.action;
      if (action === "new-game") callbacks.onStart?.(true);
      else if (action === "continue") callbacks.onStart?.(false);
      else if (action === "pause") callbacks.onPause?.();
      else if (action === "resume") callbacks.onResume?.();
      else if (action === "menu") callbacks.onMenu?.();
      else if (action === "save") callbacks.onSave?.();
      else if (action === "sound") callbacks.onSound?.();
      else if (action === "close") callbacks.onClose?.();
      else if (action === "help") callbacks.onOpen?.("help");
      else if (action === "reload") window.location.reload();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!modalModes.has(mode) || event.key !== "Tab") return;
    const focusables = [
      ...$("panel-dialog").querySelectorAll(
        'button:not([disabled]), a[href], [tabindex="0"]',
      ),
    ].filter((element) => !element.hidden);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (
      event.shiftKey &&
      (document.activeElement === first ||
        !$("panel-dialog").contains(document.activeElement))
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last ||
        !$("panel-dialog").contains(document.activeElement))
    ) {
      event.preventDefault();
      first.focus();
    }
  });

  function renderMap(canvas, small = false) {
    if (!canvas || !state?.player) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const scale = size / WORLD.size;
    const point = (x, z) => [
      (x + WORLD.half) * scale,
      (z + WORLD.half) * scale,
    ];
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(mapTexture, 0, 0, size, size);
    ctx.strokeStyle = "rgba(239,243,211,.13)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo((i * size) / 6, 0);
      ctx.lineTo((i * size) / 6, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, (i * size) / 6);
      ctx.lineTo(size, (i * size) / 6);
      ctx.stroke();
    }
    if (!small) {
      const labels = [
        ["meadow", -2, 65],
        ["forest", -60, 25],
        ["lake", 31, 12],
        ["desert", 70, -3],
        ["snow", -62, -80],
        ["ruins", 8, -91],
      ];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `500 ${Math.round(size * 0.023)}px serif`;
      ctx.fillStyle = "rgba(33,64,43,.7)";
      for (const [region, x, z] of labels) {
        const [px, pz] = point(x, z);
        ctx.fillText(REGIONS[region], px, pz);
      }
    }
    for (const location of LOCATIONS) {
      if (small && ["npc", "cook", "shop"].includes(location.type)) continue;
      const [x, y] = point(location.x, location.z);
      const activated =
        location.type === "tower"
          ? state.progress?.towers?.includes(location.id)
          : location.type === "beacon"
            ? state.progress?.beacons?.includes(location.id)
            : location.type === "boss"
              ? state.progress?.bossDefeated
              : true;
      const r = small ? 2.8 : 6;
      ctx.fillStyle =
        location.type === "boss"
          ? "#7c5450"
          : location.type === "beacon"
            ? activated
              ? "#f4e099"
              : "#d8d8b7"
            : activated
              ? "#f6f0ce"
              : "#657b63";
      ctx.strokeStyle = "#526d50";
      ctx.lineWidth = small ? 0.7 : 1.5;
      ctx.beginPath();
      if (location.type === "beacon") {
        ctx.moveTo(x, y - r * 1.3);
        ctx.lineTo(x + r, y);
        ctx.lineTo(x, y + r * 1.3);
        ctx.lineTo(x - r, y);
        ctx.closePath();
      } else if (location.type === "tower")
        ctx.rect(x - r * 0.8, y - r, r * 1.6, r * 2);
      else if (location.type === "boss") {
        ctx.moveTo(x, y - r * 1.3);
        ctx.lineTo(x + r, y + r);
        ctx.lineTo(x - r, y + r);
        ctx.closePath();
      } else ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (
        !small &&
        ["tower", "beacon", "boss", "camp"].includes(location.type)
      ) {
        ctx.font = `${Math.round(size * 0.018)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#f8f4dc";
        ctx.shadowColor = "#38543d";
        ctx.shadowBlur = 4;
        ctx.fillText(location.name, x, y + r + 5);
        ctx.shadowBlur = 0;
      }
    }
    const [px, py] = point(state.player.x, state.player.z);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-state.player.yaw);
    ctx.shadowColor = "#2b4e37";
    ctx.shadowBlur = small ? 3 : 7;
    ctx.fillStyle = "#fffcef";
    ctx.strokeStyle = "#335a49";
    ctx.lineWidth = small ? 1 : 1.7;
    const r = small ? 5 : 9;
    ctx.beginPath();
    ctx.moveTo(0, r);
    ctx.lineTo(-r * 0.65, -r * 0.7);
    ctx.lineTo(0, -r * 0.35);
    ctx.lineTo(r * 0.65, -r * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function keyboardGuide() {
    return `<div class="keyboard-guide"><div><span>移动</span><kbd>W A S D / 方向键</kbd></div><div><span>调整视角</span><kbd>右键 / 触屏拖动</kbd></div><div><span>冲刺</span><kbd>Shift</kbd></div><div><span>跳跃 / 滑翔</span><kbd>空格</kbd></div><div><span>靠墙攀登</span><kbd>长按空格</kbd></div><div><span>挥剑 / 连击</span><kbd>J / 鼠标点击</kbd></div><div><span>盾牌防御</span><kbd>长按 K</kbd></div><div><span>弓箭 / 闪避</span><kbd>F / L</kbd></div><div><span>拾取 / 交互</span><kbd>E</kbd></div><div><span>施放 / 切换符文</span><kbd>Q / R</kbd></div><div><span>行囊 / 地图</span><kbd>I / M</kbd></div><div><span>暂停</span><kbd>Esc / P</kbd></div></div>`;
  }

  function renderInventory() {
    const p = state.player;
    const inventory = state.inventory || {};
    const weaponCards = Object.entries(WEAPONS)
      .filter(([id]) => id !== "fists" && state.weapons?.[id]?.owned)
      .map(([id, weapon]) => {
        const item = state.weapons[id];
        const isEquipped = p.weapon === id;
        return `<article class="item-card${isEquipped ? " equipped" : ""}"><span class="item-symbol" aria-hidden="true">${weaponIcons[id]}</span><div class="item-info"><h4>${escape(weapon.name)}${isEquipped ? '<span class="item-tag">已装备</span>' : ""}</h4><p>攻击 ${weapon.damage} · 耐久 ${number(item.durability)} / ${weapon.durability}${id === "bow" ? `<br />木箭 ${number(inventory.arrow)} 支 · F 射击` : ""}</p>${id === "bow" ? '<button class="button small" disabled>F / 弓箭按钮射击</button>' : actionButton("equipWeapon", id, isEquipped ? "正在使用" : item.durability > 0 ? "装备武器" : "需要修理", { small: true, disabled: isEquipped || item.durability <= 0 })}</div></article>`;
      })
      .join("");
    const armorCards = (state.armors || ["traveler"])
      .filter((id) => ARMORS[id])
      .map((id) => {
        const armor = ARMORS[id];
        const selected = p.armor === id;
        return `<article class="item-card${selected ? " equipped" : ""}"><span class="item-symbol" aria-hidden="true">${armorIcons[id] || "♧"}</span><div class="item-info"><h4>${escape(armor.name)}</h4><p>防御 ${armor.defense}${armor.warmth ? " · 抵御严寒" : ""}${armor.heat ? " · 抵御酷热" : ""}</p>${actionButton("equipArmor", id, selected ? "正在穿着" : "穿戴", { small: true, disabled: selected })}</div></article>`;
      })
      .join("");
    const foodCards = foodIds
      .filter((id) => inventory[id] > 0)
      .map(
        (id) =>
          `<article class="item-card"><span class="item-symbol" aria-hidden="true">${icon(id)}</span><div class="item-info"><h4>${escape(itemName(id))}<span class="item-tag">× ${number(inventory[id])}</span></h4><p>${escape(ITEMS[id]?.description || "")}</p>${actionButton("eat", id, "食用", { small: true })}</div></article>`,
      )
      .join("");
    const resources = Object.keys(ITEMS)
      .filter((id) => !foodIds.includes(id))
      .map(
        (id) =>
          `<div class="resource-chip" title="${escape(ITEMS[id]?.description)}"><span class="resource-icon" aria-hidden="true">${icon(id)}</span><span>${escape(itemName(id))}</span><strong>${number(inventory[id])}</strong></div>`,
      )
      .join("");
    const runes = RUNES.map(
      (id) =>
        `<article class="item-card${p.rune === id ? " equipped" : ""}"><span class="item-symbol" aria-hidden="true">${runeSymbols[id]}</span><div class="item-info"><h4>${escape(RUNE_LABELS[id])}</h4><p>${escape(runeDescriptions[id])}</p>${actionButton("equipRune", id, p.rune === id ? "当前符文" : "选择符文", { small: true, disabled: p.rune === id })}</div></article>`,
    ).join("");
    return `<div class="inventory-summary"><span>生命<strong>${number(p.health)} / ${number(p.maxHealth)}</strong></span><span>精力<strong>${number(p.maxStamina)}</strong></span><span>晶币<strong>${number(inventory.coin)}</strong></span><span>风之印记<strong>${number(inventory.spirit)}</strong></span></div><section class="inventory-section"><div class="section-heading"><h3>武器与装备</h3><span>武器磨损后可在营地修理</span></div><div class="item-grid">${weaponCards}${armorCards}</div></section><section class="inventory-section"><div class="section-heading"><h3>食物与料理</h3><span>随时补给，继续远行</span></div>${foodCards ? `<div class="item-grid">${foodCards}</div>` : '<p class="empty-note">行囊里还没有食物。采集原野上的苹果、菌菇与暖阳草，在营地炊锅烹饪。</p>'}</section><section class="inventory-section"><div class="section-heading"><h3>素材与旅资</h3></div><div class="resource-grid">${resources}</div></section><section class="inventory-section"><div class="section-heading"><h3>古代符文</h3><span>Q 施放 · R 切换</span></div><div class="item-grid">${runes}</div></section><section class="inventory-section"><div class="section-heading"><h3>风之祝福</h3><span>每次消耗 2 枚风之印记</span></div><div class="pause-buttons">${actionButton("upgrade", "health", "生命上限 +25", { disabled: inventory.spirit < 2 })}${actionButton("upgrade", "stamina", "精力上限 +20", { disabled: inventory.spirit < 2 })}</div></section>`;
  }

  function renderCooking() {
    const inventory = state.inventory || {};
    return `<div class="recipe-grid">${Object.entries(RECIPES)
      .map(([id, recipe]) => {
        const available = Object.entries(recipe.ingredients).every(
          ([ingredient, count]) => (inventory[ingredient] || 0) >= count,
        );
        return `<article class="recipe-card"><h3>${icon(id)} &nbsp; ${escape(recipe.name)}</h3><p>${escape(recipe.description)}</p><div class="ingredients">${Object.entries(
          recipe.ingredients,
        )
          .map(
            ([ingredient, count]) =>
              `<span class="ingredient${(inventory[ingredient] || 0) < count ? " missing" : ""}">${escape(itemName(ingredient))} ${number(inventory[ingredient])} / ${count}</span>`,
          )
          .join(
            "",
          )}</div>${actionButton("cook", id, available ? "开始烹饪" : "食材不足", { primary: available, disabled: !available })}</article>`;
      })
      .join(
        "",
      )}</div><p class="journal-note">料理制作完成后会放入行囊。打开行囊食用，恢复生命或获得御寒、精力效果。</p>`;
  }

  function renderShop() {
    const coins = state.inventory?.coin || 0;
    const products = [
      {
        id: "arrow",
        name: "木箭 × 10",
        description: `轻巧可靠的弓箭。当前携带 ${number(state.inventory?.arrow)} 支。`,
        price: 12,
        symbol: "↗",
      },
      {
        id: "axe",
        name: WEAPONS.axe.name,
        description: `攻击 ${WEAPONS.axe.damage}，适合力道充沛的近身搏击。`,
        price: 35,
        symbol: "⚒",
        owned: state.weapons?.axe?.owned,
      },
      ...Object.entries(ARMORS)
        .filter(([id]) => id !== "traveler")
        .map(([id, armor]) => ({
          id,
          name: armor.name,
          description: `防御 ${armor.defense}${armor.warmth ? " · 抵御雪岭严寒" : armor.heat ? " · 抵御荒原酷热" : " · 沉着迎击强敌"}`,
          price: armor.price,
          symbol: armorIcons[id],
          owned: state.armors?.includes(id),
        })),
      {
        id: "repair",
        name: "全套武器修理",
        description: "恢复所有已拥有武器的耐久，准备下一次出发。",
        price: 15,
        symbol: "⚒",
      },
    ];
    return `<div class="inventory-summary"><span>可用晶币<strong>✧ ${number(coins)}</strong></span></div><div class="recipe-grid">${products.map((product) => `<article class="recipe-card"><h3>${product.symbol} &nbsp; ${escape(product.name)}</h3><p>${escape(product.description)}</p>${actionButton("buy", product.id, product.owned ? "已经拥有" : `✧ ${product.price} · ${product.id === "repair" ? "修理" : "购买"}`, { primary: !product.owned && coins >= product.price, disabled: product.owned || coins < product.price })}</article>`).join("")}</div><p class="journal-note">装备购买后存入行囊，记得手动穿戴。打开宝箱、击败敌人，继续积累旅资。</p>`;
  }

  function renderWorldMap() {
    const progress = state.progress || {};
    const destinations = LOCATIONS.filter(
      (location) => location.type === "camp" || location.type === "tower",
    );
    const quest = objective(state);
    return `<div class="map-layout"><div><div class="world-map-frame"><canvas id="world-map" width="660" height="660" aria-label="世界地图：营地、瞭望塔、三座信标与风暴王庭"></canvas><div class="map-decoration">N<span>↑</span></div><div class="map-scale">20 m</div></div><div class="map-legend"><span>➤ 你的位置</span><span>● 营地</span><span>▣ 瞭望塔</span><span>◇ 古代信标</span><span>▲ 风暴王庭</span></div></div><aside class="map-sidebar"><h3>风会记得来时的路</h3><p>抵达塔顶并点亮瞭望塔，即可解锁快速传送。点击已激活的营地或瞭望塔图标，也可以出发。</p><div class="travel-list">${destinations
      .map((location) => {
        const unlocked =
          location.type === "camp"
            ? progress.discovered?.includes(location.id)
            : progress.towers?.includes(location.id);
        return `<button class="travel-button" data-command="fastTravel" data-id="${escape(location.id)}"${unlocked ? "" : " disabled"}><span class="travel-symbol" aria-hidden="true">${location.type === "camp" ? "⌂" : "♜"}</span><span><strong>${escape(location.name)}</strong><small>${unlocked ? "快速传送" : "尚未点亮"}</small></span><b aria-hidden="true">↗</b></button>`;
      })
      .join(
        "",
      )}</div><div class="quest-mini"><strong>${escape(quest.title)}</strong><br />${escape(quest.description)}<br /><br />${["wind", "ember", "frost"].map((id) => `${progress.beacons?.includes(id) ? "◆" : "◇"} ${escape(LOCATIONS.find((l) => l.id === id)?.name)} `).join("<br />")}</div></aside></div>`;
  }

  function renderPause() {
    return `<div class="pause-metrics"><div><strong>${state.progress?.beacons?.length || 0}<small> / 3</small></strong><span>唤醒信标</span></div><div><strong>${number(state.progress?.kills)}</strong><span>击败敌人</span></div><div><strong>${Math.floor(number(state.elapsed) / 60)}</strong><span>冒险分钟</span></div></div><div class="pause-buttons"><button class="button primary" data-action="resume">继续旅程 <span aria-hidden="true">→</span></button><button class="button" data-action="save">保存当前进度</button><button class="button" data-action="sound">声音 ${soundEnabled ? "开启 ♫" : "关闭 ♪"}</button><button class="button" data-open="inventory">整理行囊</button><button class="button" data-open="map">查看地图</button><button class="button" data-action="menu">返回标题</button><button class="button" data-action="help">操作手册</button></div><p class="journal-note">进度自动保存在此浏览器。返回标题前也会保存当前旅程。</p>`;
  }

  function renderHelp() {
    return `<p class="journal-note" style="margin-top:0">你是风息原野的旅人。与营地的米拉交谈，找回风、火、霜的古代回响，最终平息旧王庭的风暴。</p>${keyboardGuide()}<section class="guide-block"><h3>翻过山，也越过湖</h3><p>跳起后再次按空格展开滑翔翼。面对墙壁向前移动并按住空格攀登；精力耗尽会松手。水中可以游泳，但也会消耗精力。靠近营地的马匹交互即可骑乘，再次交互下马。触屏可拖动空白画面转动视角，按住「跃 / 翔」攀登。</p></section><section class="guide-block"><h3>为远行做好准备</h3><p>靠近食材、宝箱与营地设施时按 E。炊锅能烹饪回复与御寒料理，商人提供装备、箭矢与武器修理。寒冷、酷热会持续消耗生命；穿上对应衣物或吃下暖阳汤。雨天攀登更费精力，雷雨时留意周围危险。</p></section><section class="guide-block"><h3>四种符文，三道回响</h3><p>磁引金属块到翠风遗迹的压力台；使用木材点燃余烬火盆；用箭矢或冰桥符文回应霜冠冰晶。完成机关后靠近信标按 E 激活。炸弹可再次施放引爆，时停能限制敌人的行动。每点亮一座信标都将获得风之印记，可在行囊永久提升生命或精力。</p></section><section class="guide-block"><h3>把归途点亮</h3><p>攀上瞭望塔并激活塔顶，便能在地图中快速传送。营地可以休息恢复，地图也能带你回到营地。旅程保存在当前浏览器，暂停后可手动保存。</p></section>`;
  }

  function renderPanel(force = false) {
    if (!modalModes.has(mode)) return;
    if (!state && mode !== "help" && mode !== "dialogue") return;
    const signature = JSON.stringify([
      mode,
      mode === "map"
        ? [state?.progress]
        : mode === "help"
          ? null
          : mode === "dialogue"
            ? panelData
            : [
                state?.inventory,
                state?.weapons,
                state?.armors,
                state?.progress,
                state?.player?.weapon,
                state?.player?.armor,
                state?.player?.rune,
                state?.player?.health,
                state?.player?.maxHealth,
                state?.player?.maxStamina,
                soundEnabled,
              ],
      panelData,
    ]);
    if (!force && signature === panelSignature) {
      if (mode === "map") renderMap($("world-map"));
      return;
    }
    panelSignature = signature;
    const details = {
      paused: ["A MOMENT BY THE TRAIL", "在此歇息", "原野会等待你的下一步。"],
      inventory: [
        "TRAVELER'S SATCHEL",
        "旅人行囊",
        "装备、补给与古代祝福，为下一段路做好准备。",
      ],
      map: [
        "AN ATLAS OF WILDREACH",
        "山川舆图",
        "越过眼前的山，还有新的风景。",
      ],
      cook: [
        "A TASTE OF THE WILDS",
        "营地炊锅",
        "让原野的馈赠，成为旅途的力量。",
      ],
      shop: [
        "THE WANDERING MERCHANT",
        "行脚商铺",
        "「好装备，是送给明天的礼物。」",
      ],
      dialogue: [
        "VOICES OF THE MEADOW",
        panelData.title || "守望人 · 米拉",
        "在旅途中，总有值得听见的故事。",
      ],
      dead: ["EVEN THE WIND RESTS", "旅途，暂歇", "风会带你回到来时的地方。"],
      victory: ["THE WIND RETURNS", "风，再次归来", "你点亮的不只是三座信标。"],
      help: [
        "A COMPANION FOR THE ROAD",
        "旅人手册",
        "把方向交给风，把选择留给自己。",
      ],
    }[mode];
    setText("panel-kicker", details[0]);
    setText("panel-title", details[1]);
    setText("panel-description", details[2]);
    $("panel-dialog").className =
      `journal-dialog${["paused", "dialogue", "dead", "victory"].includes(mode) ? " compact" : ""}${mode === "map" ? " map-dialog" : ""}`;
    $("panel-close").hidden = mode === "dead";
    const oldFocus = document.activeElement;
    const focusCommand = oldFocus?.dataset.command;
    const focusId = oldFocus?.dataset.id;
    const scroll = $("panel-content").scrollTop;
    let content = "";
    if (mode === "inventory") content = renderInventory();
    else if (mode === "cook") content = renderCooking();
    else if (mode === "shop") content = renderShop();
    else if (mode === "map") content = renderWorldMap();
    else if (mode === "paused") content = renderPause();
    else if (mode === "help") content = renderHelp();
    else if (mode === "dialogue")
      content = `<p class="dialogue-body">${escape(panelData.text || "远方的三座信标正在沉睡。带上勇气和补给，循着风去寻找它们吧。")}</p><p class="dialogue-signature">— ${escape(panelData.title || "守望人 · 米拉")}</p><button class="button primary wide" data-action="close">记在心里，继续出发 <span aria-hidden="true">→</span></button>`;
    else if (mode === "dead")
      content = `<div class="endgame-symbol" aria-hidden="true">◇</div><p class="endgame-message">山川仍在，回响未散。<br />回到营地重整行装，再次踏上旅途。<br />复苏会损失 5 枚晶币；装备与信标进度会保留。</p><div class="endgame-buttons">${actionButton("respawn", "", "返回营地", { primary: true, wide: true })}<button class="button wide" data-action="menu">返回标题</button></div>`;
    else if (mode === "victory")
      content = `<div class="endgame-symbol" aria-hidden="true">✧</div><p class="endgame-message">翠风、余烬与霜冠的回响穿过大地。<br />风暴守卫归于宁静，原野记住了你的名字。</p><div class="pause-metrics"><div><strong>3</strong><span>信标苏醒</span></div><div><strong>${number(state.progress?.kills)}</strong><span>击败敌人</span></div><div><strong>${Math.floor(number(state.elapsed) / 60)}</strong><span>冒险分钟</span></div></div><div class="endgame-buttons"><button class="button primary wide" data-action="close">继续探索原野 <span aria-hidden="true">→</span></button><button class="button wide" data-action="menu">珍藏旅程，返回标题</button></div>`;
    $("panel-content").innerHTML = content;
    $("panel-content").scrollTop = force ? 0 : scroll;
    if (!force && focusCommand) {
      const replacement = [
        ...$("panel-content").querySelectorAll("[data-command]"),
      ].find(
        (node) =>
          node.dataset.command === focusCommand &&
          node.dataset.id === focusId &&
          !node.disabled,
      );
      (replacement || $("panel-close")).focus({ preventScroll: true });
    }
    if (mode === "map") {
      const canvas = $("world-map");
      renderMap(canvas);
      canvas.addEventListener("click", (event) => {
        const bounds = canvas.getBoundingClientRect();
        const wx =
          ((event.clientX - bounds.left) / bounds.width) * WORLD.size -
          WORLD.half;
        const wz =
          ((event.clientY - bounds.top) / bounds.height) * WORLD.size -
          WORLD.half;
        const location = LOCATIONS.find(
          (l) =>
            ["camp", "tower"].includes(l.type) &&
            Math.hypot(l.x - wx, l.z - wz) < 6,
        );
        if (!location) return;
        const unlocked =
          location.type === "camp"
            ? state.progress?.discovered?.includes(location.id)
            : state.progress?.towers?.includes(location.id);
        if (unlocked) callbacks.onAction?.("fastTravel", { id: location.id });
        else toast("抵达塔顶并点亮瞭望塔后，就能在这里传送。");
      });
    }
  }

  function update(nextState) {
    state = nextState;
    if (!state?.player) return;
    if (modalModes.has(mode)) renderPanel();
    const now = performance.now();
    if (now - lastHudTime < 80) return;
    lastHudTime = now;
    const p = state.player;
    const hearts = Math.min(10, Math.ceil((p.maxHealth || 100) / 20));
    const health = clamp(p.health / Math.max(1, p.maxHealth));
    const heartMarkup =
      Array.from(
        { length: hearts },
        (_, index) =>
          `<span class="heart" aria-hidden="true">♥<span style="width:${Math.round(clamp(health * hearts - index) * 100)}%">♥</span></span>`,
      ).join("") +
      `<span class="health-value">${number(p.health)} / ${number(p.maxHealth)}</span>`;
    if ($("health-hearts").innerHTML !== heartMarkup)
      $("health-hearts").innerHTML = heartMarkup;
    $("health-hearts").setAttribute(
      "aria-label",
      `生命 ${number(p.health)}，上限 ${number(p.maxHealth)}`,
    );
    $("stamina-fill").style.width =
      `${clamp(p.stamina / Math.max(1, p.maxStamina)) * 100}%`;
    $("stamina-fill").style.background =
      p.stamina < p.maxStamina * 0.2 ? "#e9b479" : "#d7e88f";
    setText("stamina-number", number(p.stamina));
    const region = regionAt(p.x, p.z);
    setText("region-label", REGIONS[region]);
    const hour = Math.floor(state.time || 0);
    const minute = Math.floor(((state.time || 0) % 1) * 60);
    setText(
      "world-clock",
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} · ${weatherLabels[state.weather] || "晴"}`,
    );
    const survival = [];
    if (motionLabels[p.motion]) survival.push(motionLabels[p.motion]);
    if (region === "snow")
      survival.push(
        ARMORS[p.armor]?.warmth || p.buffs?.warmth > 0
          ? "❄ 抗寒生效"
          : "❄ 严寒 · 需要御寒",
      );
    if (region === "desert")
      survival.push(
        ARMORS[p.armor]?.heat ? "☀ 耐热生效" : "☀ 酷热 · 需要耐热",
      );
    if (p.buffs?.warmth > 0 && region !== "snow")
      survival.push(`☀ 御寒 ${Math.ceil(p.buffs.warmth)}s`);
    if (p.buffs?.stamina > 0)
      survival.push(`↯ 精力增益 ${Math.ceil(p.buffs.stamina)}s`);
    if (state.weather === "rain" && p.motion === "climb")
      survival.push("雨湿岩壁");
    if (state.weather === "storm") survival.push("⚡ 雷雨");
    setText("survival-status", survival.join(" · "));
    const quest = objective(state);
    setText("quest-title", quest.title);
    setText("quest-description", quest.description);
    setText("quest-progress", quest.progress);
    setText(
      "quest-kicker",
      state.progress?.bossDefeated ? "原野回响" : "主线旅程",
    );
    setText("weapon-label", WEAPONS[p.weapon]?.name || "徒手");
    setText(
      "weapon-durability",
      p.weapon === "fists"
        ? "收集武器，或在商铺修理"
        : `耐久 ${number(state.weapons?.[p.weapon]?.durability)} / ${WEAPONS[p.weapon]?.durability || "—"} · 箭 ${number(state.inventory?.arrow)}`,
    );
    setText("rune-symbol", runeSymbols[p.rune] || "◉");
    setText("rune-label", RUNE_LABELS[p.rune] || "符文");
    setText(
      "rune-cooldown",
      p.runeCooldown > 0
        ? `充能中 · ${p.runeCooldown.toFixed(1)} 秒`
        : "符文就绪 · R 切换",
    );
    $("interaction-prompt").hidden = !state.context;
    if (state.context) {
      setText("interaction-label", state.context.label || "交互");
      setText("interaction-hint", state.context.hint || "");
    }
    setText(
      "minimap-coordinates",
      `${Math.round(p.x).toString().padStart(3, "0")} · ${Math.round(p.z).toString().padStart(3, "0")}`,
    );
    renderMap($("minimap"), true);
  }

  function setMode(nextMode, data = {}) {
    const wasModal = modalModes.has(mode);
    const previousMode = mode;
    helpFromMenu =
      nextMode === "help" && (previousMode === "menu" || helpFromMenu);
    mode = nextMode;
    panelData = data || {};
    document.body.dataset.uiMode = mode;
    $("loading-overlay").hidden = mode !== "loading";
    $("error-overlay").hidden = mode !== "error";
    $("welcome-panel").hidden = mode !== "menu" && !helpFromMenu;
    $("game-hud").hidden =
      ["loading", "menu", "error"].includes(mode) ||
      (mode === "help" && (helpFromMenu || !state));
    $("panel-overlay").hidden = !modalModes.has(mode);
    if (mode === "menu") {
      hasSave = Boolean(data.hasSave);
      $("continue-button").hidden = !hasSave;
      $("start-button").hidden = hasSave;
      $("new-journey-button").hidden = !hasSave;
      requestAnimationFrame(() =>
        (hasSave ? $("continue-button") : $("start-button")).focus({
          preventScroll: true,
        }),
      );
    }
    if (modalModes.has(mode)) {
      if (!wasModal) focusBeforeModal = document.activeElement;
      renderPanel(true);
      requestAnimationFrame(() => {
        const target =
          mode === "dead"
            ? $("panel-content").querySelector("button")
            : $("panel-close");
        (target || $("panel-dialog")).focus({ preventScroll: true });
      });
    } else if (wasModal && previousMode !== "dead") {
      const target =
        focusBeforeModal?.isConnected && !focusBeforeModal.hidden
          ? focusBeforeModal
          : $("game-canvas");
      if (mode !== "menu") target.focus?.({ preventScroll: true });
    }
    if (mode === "error" && data.message)
      setText("error-message", data.message);
  }

  function toast(message, tone = "info") {
    clearTimeout(toastTimer);
    setText("toast-message", message);
    setText(
      "toast-icon",
      tone === "success" ? "✧" : tone === "warning" ? "△" : "◇",
    );
    $("toast").dataset.tone = tone;
    $("toast").hidden = false;
    toastTimer = setTimeout(
      () => {
        $("toast").hidden = true;
      },
      Math.max(3000, Math.min(6500, String(message).length * 95)),
    );
  }

  function setSound(enabled) {
    soundEnabled = Boolean(enabled);
    document.querySelectorAll(".sound-button").forEach((button) => {
      button.textContent = enabled ? "♫" : "♪";
      button.setAttribute("aria-label", enabled ? "关闭声音" : "开启声音");
      button.setAttribute("aria-pressed", String(enabled));
    });
    if (mode === "paused") renderPanel(true);
  }

  function showError(message) {
    setText("error-message", message || "请使用支持 WebGL 的现代浏览器。");
    setMode("error");
  }
  return { setMode, update, toast, setSound, showError };
}
