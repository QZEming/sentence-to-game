export const WEAPONS = [
{id:'sword',name:'露锋短剑',short:'短剑',type:'均衡 · 近战',desc:'轻快连斩，第三击释放剑气',damage:29,cooldown:.38,range:2.5,color:0xdaf0b0,icon:'sword'},
{id:'hammer',name:'琥珀重锤',short:'重锤',type:'震荡 · 范围',desc:'重击震退敌群，击碎周围障碍',damage:58,cooldown:.85,range:3.1,color:0xf4bc67,icon:'hammer'},
{id:'bow',name:'荆棘连弩',short:'连弩',type:'迅捷 · 远程',desc:'连续发射弩箭，保持距离游走',damage:16,cooldown:.24,range:15,color:0xcce795,icon:'bow'},
{id:'staff',name:'星露法杖',short:'法杖',type:'奥术 · 爆破',desc:'星露弹触敌爆裂，伤害成群敌人',damage:31,cooldown:.63,range:12,color:0x8edcdd,icon:'staff'}
];
export const BIOMES = [
{name:'苔光遗迹',en:'THE OVERGROWTH',chapter:'第一章',floor:[0x39473a,0x43503e,0x354135,0x4c5742],wall:0x4b5541,moss:0x6b7e45,glow:0x90e5bd,fog:0x14251f,boss:'苔冠守卫',names:['露珠门廊','孢子庭院','古根回廊','苔冠王座']},
{name:'琥珀熔炉',en:'THE AMBER FORGE',chapter:'第二章',floor:[0x514535,0x4c3b2e,0x5b4d37,0x615239],wall:0x6b583d,moss:0x97633e,glow:0xf7b86c,fog:0x291e18,boss:'熔壳蟹王',names:['余烬门廊','金脂栈道','炉心前庭','熔壳王座']},
{name:'月晶深窟',en:'THE MOON CAVERN',chapter:'第三章',floor:[0x394250,0x454a5c,0x323d49,0x505669],wall:0x535a6f,moss:0x5e7b86,glow:0xa5baff,fog:0x171c2a,boss:'月晶螳螂',names:['月光裂隙','折光回廊','星尘祭坛','月晶圣殿']}
];
export const UPGRADES = [
{id:'damage',name:'磨亮锋芒',desc:'所有武器伤害 +18%',icon:'sword',max:4,apply:p=>p.power+=.18},
{id:'speed',name:'疾风触角',desc:'攻击速度 +15%',icon:'dash',max:4,apply:p=>p.haste+=.15},
{id:'health',name:'琥珀加壳',desc:'生命上限 +25，立即恢复 25 生命',icon:'heart',max:3,apply:p=>{p.maxHp+=25;p.hp=Math.min(p.maxHp,p.hp+25)}},
{id:'move',name:'润滑黏液',desc:'移动速度 +12%，黏液轨迹持续更久',icon:'dash',max:2,apply:p=>p.speed+=.12},
{id:'dash',name:'轻盈螺旋',desc:'翻滚冷却缩短 20%',icon:'shell',max:3,apply:p=>p.dashMax*=.8},
{id:'range',name:'蔓生之力',desc:'近战与爆炸范围 +18%',icon:'storm',max:3,apply:p=>p.reach+=.18},
{id:'crit',name:'幸运触角',desc:'暴击概率 +12%，暴击造成双倍伤害',icon:'star',max:3,apply:p=>p.crit+=.12},
{id:'heal',name:'苔藓加餐',desc:'清房额外恢复 9 生命，立即恢复 15 生命',icon:'leaf',max:3,apply:p=>{p.clearHeal+=9;p.hp=Math.min(p.maxHp,p.hp+15)}},
{id:'armor',name:'硬壳护佑',desc:'每次受到的伤害减少 3 点',icon:'shield',max:3,apply:p=>p.armor+=3},
{id:'pulse',name:'琥珀脉冲',desc:'每第 5 次攻击释放震波，造成 22 伤害',icon:'storm',max:3,apply:p=>p.pulse+=22},
{id:'vamp',name:'生命露珠',desc:'每击败一个敌人，恢复 3 生命',icon:'heart',max:3,apply:p=>p.vamp+=3},
{id:'chain',name:'星光回响',desc:'命中时有 25% 概率传导闪电至附近敌人',icon:'staff',max:3,apply:p=>p.chain+=.25},
{id:'thorns',name:'荆棘螺壳',desc:'缩壳反伤 +20，成功格挡回复风暴能量',icon:'shield',max:3,apply:p=>p.thorns+=20},
{id:'fortune',name:'拾荒本能',desc:'获得琥珀 +40%，清房额外获得星屑',icon:'coin',max:2,apply:p=>p.fortune+=.4},
{id:'frost',name:'月露寒意',desc:'攻击减缓敌人 35% 移速，持续 2 秒',icon:'gem',max:1,apply:p=>p.frost=true}
];
export const ICONS={
shell:'M20 20H7C-1 20 1 3 12 3C24 3 24 19 15 19C7 19 7 8 14 8C21 8 20 15 15 15C12 15 12 11 15 11 M20 20l2-8m-2 8-3-7',
sword:'m5 20 14-14 1-4-4 1L3 16 M3 12l9 9 M3 21l3-3',
hammer:'m5 20 10-12 M10 5l4-4 9 9-4 4z M3 19l2 2',
bow:'M4 4c15 0 16 15 16 16L4 4 M3 14l7 7 M7 17 20 4 M16 4h4v4',
staff:'m4 22 12-14 M14 2l6 1 3 5-5 4-6-4z M18 4v4',
shield:'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6z M12 6v11m-5-8 5-3 5 3',
dash:'m12 4 7 8-7 8 M5 5l6 7-6 7 M2 9h4m-5 6h4',
storm:'M19 7c-8-9-20 6-11 12 8 6 17-6 10-9-5-3-10 5-4 6 M19 2v5h-5 M3 22l4-4',
heart:'M20 4c-4-3-8 2-8 2S8 1 4 4c-7 5 8 17 8 17S27 9 20 4z',
star:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z',
leaf:'M4 20C-2 10 6 2 21 3c1 14-8 22-17 17 M4 20 16 8m-6 6v-4m0 4h5',
coin:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 7v10m3-8h-5v3h4v3H9',
gem:'m12 2 8 10-8 10-8-10z M4 12h16M12 2v20',
sound:'M11 4 6 8H2v8h4l5 4z M15 8c3 2 3 6 0 8m3-12c6 5 6 11 0 16',
mute:'M11 4 6 8H2v8h4l5 4z M16 9l6 6m0-6-6 6',
help:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M9 8c0-4 8-3 6 1-1 2-3 1-3 5m0 3v.1',
pause:'M8 5v14M16 5v14',play:'m8 4 12 8-12 8z',mouse:'M7 3h10l2 5v10l-4 4H9l-4-4V8z M12 3v7'
};
