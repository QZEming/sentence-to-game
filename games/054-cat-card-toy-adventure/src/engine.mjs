export const CARDS={
 paw:{name:'软软爪击',cost:1,icon:'🐾',type:'攻击',text:'造成 6 点伤害。',color:'peach',damage:6},
 guard:{name:'纸箱堡垒',cost:1,icon:'📦',type:'守护',text:'获得 7 点护盾。',color:'blue',block:7},
 bunny:{name:'缝缝兔',cost:1,icon:'🐰',type:'召唤',text:'召唤伙伴：每回合攻击 3，生命 8。',color:'pink',summon:'bunny',atk:3,hp:8},
 bear:{name:'纽扣熊',cost:2,icon:'🧸',type:'召唤',text:'召唤伙伴：攻击 4，生命 16。优先承伤。',color:'gold',summon:'bear',atk:4,hp:16},
 duck:{name:'发条小鸭',cost:1,icon:'🐤',type:'召唤',text:'召唤伙伴：攻击 2，生命 7。每回合提供 2 护盾。',color:'gold',summon:'duck',atk:2,hp:7},
 yarn:{name:'毛线流星',cost:1,icon:'🧶',type:'攻击',text:'对所有敌人造成 4 点伤害。',color:'pink',aoe:4},
 fish:{name:'小鱼干时刻',cost:0,icon:'🐟',type:'技巧',text:'获得 1 能量，抽 1 张牌。消耗。',color:'blue',energy:1,draw:1,exhaust:true},
 purr:{name:'呼噜疗愈',cost:1,icon:'💚',type:'技巧',text:'恢复 5 生命，治疗所有伙伴 4 点。',color:'green',heal:5,allyheal:4},
 cheer:{name:'伙伴加油！',cost:1,icon:'🎀',type:'技巧',text:'所有伙伴永久获得 +2 攻击（本场）。',color:'pink',buff:2},
 rocket:{name:'星星火箭',cost:2,icon:'🚀',type:'攻击',text:'造成 15 点伤害。',color:'peach',damage:15},
 poison:{name:'猫薄荷烟雾',cost:1,icon:'🌿',type:'技巧',text:'使目标获得 5 层中毒，每回合触发。',color:'green',poison:5},
 feather:{name:'羽毛逗逗',cost:1,icon:'🪶',type:'技巧',text:'目标虚弱 2 回合，攻击减半。抽 1 张。',color:'blue',weak:2,draw:1},
 robot:{name:'铁皮小卫士',cost:2,icon:'🤖',type:'召唤',text:'召唤伙伴：攻击 6，生命 12。',color:'blue',summon:'robot',atk:6,hp:12},
 dragon:{name:'布偶小龙',cost:3,icon:'🐲',type:'召唤',text:'召唤伙伴：攻击 9，生命 18。',color:'green',summon:'dragon',atk:9,hp:18},
 nap:{name:'午后小憩',cost:0,icon:'💤',type:'守护',text:'获得 4 护盾，抽 1 张牌。',color:'blue',block:4,draw:1},
 combo:{name:'友谊连击',cost:1,icon:'✨',type:'攻击',text:'造成 3 伤害，每个伙伴额外 +4。',color:'gold',damage:3,combo:4},
 stun:{name:'惊喜弹簧',cost:2,icon:'🎁',type:'技巧',text:'造成 5 伤害，目标眩晕 1 回合。',color:'pink',damage:5,stun:1},
 storm:{name:'玩具总动员',cost:2,icon:'🌟',type:'攻击',text:'所有伙伴立即攻击一次。',color:'gold',rally:true}
};
export const RELICS=[{id:'bell',icon:'🔔',name:'幸运铃铛',text:'每场战斗首回合 +1 能量。'},{id:'heart',icon:'🧡',name:'温暖纽扣',text:'每场胜利恢复 5 生命。'},{id:'star',icon:'⭐',name:'星星贴纸',text:'所有召唤伙伴 +1 攻击。'},{id:'scarf',icon:'🧣',name:'毛绒围巾',text:'每回合开始获得 3 护盾。'}];
export function fresh(){return {hp:60,maxhp:60,gold:35,floor:0,phase:'map',deck:['paw','paw','paw','guard','guard','bunny','duck','fish','yarn','purr'].map(id=>({id,up:false})),relics:['bell'],wins:0,turn:1,log:[],allies:[],enemies:[],hand:[],draw:[],discard:[],exhaust:[],block:0,energy:3,target:0};}
export function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
export function card(c){const base=CARDS[c.id];let b={...base};if(c.up){if(['fish','feather','storm'].includes(c.id))b.cost=Math.max(0,b.cost-1);if(c.id==='fish')b.draw=2;for(const k of ['damage','aoe','block','heal','poison','hp'])if(b[k])b[k]+=3;for(const k of ['atk','buff'])if(b[k])b[k]+=1;}return b;}
export function draw(s,n){for(let i=0;i<n;i++){if(!s.draw.length){s.draw=shuffle(s.discard);s.discard=[];}if(s.draw.length&&s.hand.length<9)s.hand.push(s.draw.pop());}}
export function start(s,elite=false){s.phase='battle';s.elite=elite;s.allies=[];s.hand=[];s.draw=shuffle(s.deck.map(c=>({...c})));s.discard=[];s.exhaust=[];s.turn=1;s.block=0;s.target=0;s.energy=3+(s.relics.includes('bell')?1:0);s.log=['选择卡牌，唤醒你的玩具伙伴。'];const f=s.floor;const boss=f===8;const n=boss?1:f<2?2:3;s.enemies=Array.from({length:n},(_,i)=>{let hp=boss?100:15+f*4+(elite?12:0);return {name:boss?'噩梦布偶王':elite?['暴躁积木','发条怪鼠','暗影陀螺'][i]:['灰尘团子','捣蛋毛球','暗影陀螺'][i],hp,maxhp:hp,atk:boss?12:4+Math.floor(f/2)+(elite?2:0),poison:0,weak:0,stun:0,kind:boss?'boss':i===1?'mouse':'dust',intent:i%3===2?'guard':'attack',block:0};});draw(s,5);if(s.relics.includes('scarf'))s.block+=3;}
export function hit(e,d){let absorb=Math.min(e.block||0,d);e.block=(e.block||0)-absorb;e.hp=Math.max(0,e.hp-d+absorb);}
function check(s){if(s.enemies[s.target]?.hp<=0)s.target=Math.max(0,s.enemies.findIndex(e=>e.hp>0));if(s.enemies.every(e=>e.hp<=0)){s.phase='reward';s.wins++;s.gold+=s.elite?35:22;if(s.relics.includes('heart'))s.hp=Math.min(s.maxhp,s.hp+5);if(s.floor===8)s.phase='won';return true;}return false;}
export function play(s,index){if(s.phase!=='battle')return '现在无法出牌';const c=s.hand[index];if(!c)return '无效卡牌';const b=card(c);if(s.energy<b.cost)return '能量不足';if(b.summon&&s.allies.length>=4)return '伙伴位置已满（最多 4 位）';s.energy-=b.cost;s.hand.splice(index,1);const e=s.enemies[s.target]?.hp>0?s.enemies[s.target]:s.enemies.find(e=>e.hp>0);if(b.damage)hit(e,b.damage+(b.combo||0)*s.allies.length);if(b.aoe)s.enemies.filter(e=>e.hp>0).forEach(e=>hit(e,b.aoe));if(b.block)s.block+=b.block;if(b.heal)s.hp=Math.min(s.maxhp,s.hp+b.heal);if(b.allyheal)s.allies.forEach(a=>a.hp=Math.min(a.maxhp,a.hp+b.allyheal));if(b.summon)s.allies.push({kind:b.summon,name:b.name,hp:b.hp,maxhp:b.hp,atk:b.atk+(s.relics.includes('star')?1:0)});if(b.buff)s.allies.forEach(a=>a.atk+=b.buff);for(const k of ['poison','weak','stun'])if(b[k])e[k]+=b[k];if(b.energy)s.energy+=b.energy;if(b.draw)draw(s,b.draw);if(b.rally)alliesAttack(s);(b.exhaust?s.exhaust:s.discard).push(c);s.log.unshift(`打出 ${b.name}${c.up?' ✦':''}`);check(s);return null;}
function alliesAttack(s){s.allies.forEach(a=>{const e=s.enemies[s.target]?.hp>0?s.enemies[s.target]:s.enemies.find(e=>e.hp>0);if(e)hit(e,a.atk);if(a.kind==='duck')s.block+=2;});}
export function end(s){if(s.phase!=='battle')return;alliesAttack(s);for(const e of s.enemies){if(e.hp>0&&e.poison){hit(e,e.poison);e.poison--;}}if(check(s))return;for(const e of s.enemies){if(e.hp<=0)continue;if(e.stun){e.stun--;continue;}if(e.intent==='guard'){e.block=6;}else{let dmg=Math.ceil(e.atk*(e.weak?0.5:1));const a=s.allies.find(a=>a.kind==='bear')||s.allies[0];if(a){a.hp-=dmg;s.allies=s.allies.filter(a=>a.hp>0);}else{const absorb=Math.min(s.block,dmg);s.block-=absorb;s.hp=Math.max(0,s.hp-dmg+absorb);}}if(e.weak)e.weak--;e.intent=(s.turn+s.enemies.indexOf(e))%4===2?'guard':'attack';}if(s.hp<=0){s.phase='lost';return;}s.discard.push(...s.hand);s.hand=[];s.turn++;s.energy=3;s.block=s.relics.includes('scarf')?3:0;draw(s,5);s.log.unshift(`第 ${s.turn} 回合 · 能量已恢复`);}
