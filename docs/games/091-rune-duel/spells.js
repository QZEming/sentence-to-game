export const ELEMENTS={
 fire:{name:'火焰',short:'火',key:'Q',glyph:'ᚠ',color:'#ec9963',hex:0xff8855,gesture:'↑',counter:'ice',weak:'arcane'},
 ice:{name:'寒冰',short:'冰',key:'W',glyph:'ᛁ',color:'#7bc9e5',hex:0x79d7ff,gesture:'↓',counter:'earth',weak:'fire'},
 lightning:{name:'雷电',short:'雷',key:'E',glyph:'ᛋ',color:'#d9be7b',hex:0xffd77d,gesture:'↯',counter:'arcane',weak:'earth'},
 earth:{name:'大地',short:'土',key:'R',glyph:'ᛉ',color:'#8ac6a7',hex:0x79d6ab,gesture:'→',counter:'lightning',weak:'ice'},
 arcane:{name:'奥术',short:'奥',key:'T',glyph:'ᛟ',color:'#aa8ce3',hex:0xae87ff,gesture:'○',counter:'fire',weak:'lightning'}
};
const s=(runes,name,desc,damage,cost,effect='none')=>({runes,name,desc,damage,cost,effect});
export const SPELLS=[
 s(['fire','fire','fire'],'陨星之焰','陨火轰击，造成 44 点伤害与持续灼烧。',44,34,'burn'),
 s(['ice','ice','ice'],'永冬囚笼','造成 31 点伤害，冻结对手 2.8 秒。',31,32,'freeze'),
 s(['lightning','lightning','lightning'],'天罚雷暴','雷霆贯穿，造成 58 点爆发伤害。',58,40,'shock'),
 s(['earth','earth','earth'],'不朽石垒','获得 45 点护盾，并恢复 16 点生命。',0,32,'fortress'),
 s(['arcane','arcane','arcane'],'虚空星矛','穿透敌方护盾，造成 50 点奥术伤害。',50,36,'pierce'),
 s(['fire','ice'],'蒸汽幻幕','造成 23 点伤害，并获得 12 点护盾。',23,23,'steam'),
 s(['fire','lightning'],'爆燃新星','造成 32 点伤害；灼烧目标额外承受 18 点。',32,26,'detonate'),
 s(['fire','earth'],'熔岩裂隙','造成 25 点伤害，附加持续灼烧。',25,25,'burn'),
 s(['fire','arcane'],'追星炎弹','追踪火焰造成 30 点伤害，回复 6 点魔力。',30,24,'leech'),
 s(['ice','lightning'],'霜雷锁链','造成 27 点伤害，并冻结对手 1.8 秒。',27,24,'freeze'),
 s(['ice','earth'],'寒晶壁垒','获得 32 点护盾，冰晶造成 16 点伤害。',16,26,'wall'),
 s(['ice','arcane'],'时光凝滞','造成 20 点伤害，使对手咏唱减速 5 秒。',20,23,'slow'),
 s(['lightning','earth'],'地磁脉冲','造成 29 点伤害，打断敌方当前咏唱。',29,26,'interrupt'),
 s(['lightning','arcane'],'闪烁雷光','造成 36 点伤害，重置闪避冷却。',36,28,'blink'),
 s(['earth','arcane'],'星石庇护','回复 22 点生命，并获得 18 点护盾。',0,28,'heal'),
 s(['fire','ice','lightning'],'三相湮灭','造成 48 点伤害，同时灼烧与冻结。',48,39,'chaos'),
 s(['ice','earth','arcane'],'星河复苏','恢复 32 点生命，获得 25 点护盾。',0,37,'renew'),
 s(['fire','lightning','arcane'],'终焉虹光','造成 62 点穿透伤害，消耗更多魔力。',62,45,'pierce')
];
const key=a=>[...a].sort().join(',');
export function getSpell(runes){if(!runes.length)return null;const unique=[...new Set(runes)];let found=SPELLS.find(s=>key(s.runes)===key(runes));if(!found&&unique.length===2){const base=SPELLS.find(s=>key(s.runes)===key(unique));if(base)found={...base,name:runes.length===3?'强化·'+base.name:base.name,damage:Math.round(base.damage*(runes.length===3?1.3:1)),cost:base.cost+(runes.length===3?7:0)};}if(!found){const el=ELEMENTS[runes[0]];const n=runes.length;found={name:unique.length===3?'三相冲击':el.name+({1:'箭',2:'冲击',3:'之怒'}[n]),damage:unique.length===3?42:10+n*8,cost:unique.length===3?32:6+n*6,effect:unique.length===3?'none':runes[0]==='earth'?'wall':runes[0]==='ice'?'slow':'none',desc:'元素共鸣造成伤害，并积累觉醒能量。'};}return{...found,runes:[...runes],element:[...runes].sort((a,b)=>runes.filter(r=>r===b).length-runes.filter(r=>r===a).length||Object.keys(ELEMENTS).indexOf(a)-Object.keys(ELEMENTS).indexOf(b))[0]};}
export const ENEMIES=[
 {name:'灰烬咒术师',school:'火焰学派',glyph:'ᚠ',hp:120,element:'fire',spells:['fire','fire','ice'],interval:4.4,cast:2.6,damage:15,color:0xb593e5},
 {name:'霜镜守望者',school:'寒冰学派',glyph:'ᛁ',hp:160,element:'ice',spells:['ice','earth','ice'],interval:3.6,cast:2.3,damage:18,color:0x85d2ef},
 {name:'雷鸣游侠',school:'风暴学派',glyph:'ᛋ',hp:185,element:'lightning',spells:['lightning','arcane','fire'],interval:3.2,cast:2.1,damage:20,color:0xe2c991},
 {name:'岩铠巨像',school:'大地学派',glyph:'ᛉ',hp:225,element:'earth',spells:['earth','lightning','earth'],interval:3.8,cast:2.5,damage:26,color:0x8dbba0,shield:38},
 {name:'虚空织法者',school:'奥术学派',glyph:'ᛟ',hp:240,element:'arcane',spells:['arcane','fire','ice','lightning'],interval:2.8,cast:1.9,damage:23,color:0xb596ed,ward:true},
 {name:'星蚀 · 大秘法师',school:'终焉学派',glyph:'✧',hp:330,element:'arcane',spells:['fire','ice','earth','lightning','arcane'],interval:2.6,cast:1.85,damage:25,color:0xd9b3f6,boss:true}
];
export const RELICS=[
 {id:'power',name:'烬星碎片',icon:'✹',desc:'所有法术伤害提高 18%。',apply:p=>p.power+=.18},
 {id:'flow',name:'永流之瓶',icon:'♧',desc:'魔力回复每秒增加 3 点。',apply:p=>p.regen+=3},
 {id:'heart',name:'古树之心',icon:'❧',desc:'最大生命增加 25，立即恢复 30 点。',apply:p=>{p.maxHp+=25;p.hp=Math.min(p.maxHp,p.hp+30)}},
 {id:'mirror',name:'逆光之镜',icon:'◇',desc:'反制伤害提高 30%，成功时回复 7 点生命。',apply:p=>{p.reflect+=.3;p.counterHeal+=7}},
 {id:'step',name:'逐月羽',icon:'☽',desc:'闪避冷却缩短 25%，闪避无敌延长。',apply:p=>{p.dodgeMax*=.75;p.dodgeDuration+=.2}},
 {id:'well',name:'星界容器',icon:'⚱',desc:'魔力上限增加 25，觉醒充能提高 20%。',apply:p=>{p.maxMana+=25;p.chargeRate+=.2}},
 {id:'ward',name:'磐岩印记',icon:'⬡',desc:'每场战斗获得 25 点护盾。',apply:p=>p.startShield+=25},
 {id:'thrift',name:'织法秘典',icon:'✥',desc:'法术消耗降低 15%。',apply:p=>p.costMult*=.85},
 {id:'time',name:'时间之砂',icon:'⌛',desc:'完美反制窗口延长 0.3 秒。',apply:p=>p.counterWindow+=.3}
];
export function recognizeGesture(points){if(points.length<2)return null;const a=points[0],b=points.at(-1);let length=0,minX=a.x,maxX=a.x,minY=a.y,maxY=a.y,turns=0,lastSign=0;for(let i=1;i<points.length;i++){let dx=points[i].x-points[i-1].x,dy=points[i].y-points[i-1].y;length+=Math.hypot(dx,dy);minX=Math.min(minX,points[i].x);maxX=Math.max(maxX,points[i].x);minY=Math.min(minY,points[i].y);maxY=Math.max(maxY,points[i].y);if(Math.abs(dx)>3){const sign=Math.sign(dx);if(lastSign&&sign!==lastSign)turns++;lastSign=sign;}}if(length<45)return null;let dx=b.x-a.x,dy=b.y-a.y,w=maxX-minX,h=maxY-minY;if(length>100&&Math.hypot(dx,dy)<Math.max(w,h)*.5&&w>30&&h>30)return'arcane';if(turns>=2&&h>35&&length>80)return'lightning';if(Math.abs(dy)>Math.abs(dx)*1.2)return dy<0?'fire':'ice';return'earth';}
