export const SIZE=8;
export const SPELLS=[
 {id:'move',key:'1',name:'行走',en:'WALK',icon:'steps',ap:1,mana:0,range:3,color:'#a8dace',desc:'沿可通行的路径移动最多 3 格。宝箱与泉水在踏入时触发。'},
 {id:'bolt',key:'2',name:'奥术飞弹',en:'ARCANE',icon:'spark',ap:1,mana:0,range:4,damage:4,color:'#c7b4ff',desc:'对 4 格内可见的敌人造成 4 点伤害。不消耗法力。'},
 {id:'fire',key:'3',name:'陨火术',en:'FIREBALL',icon:'flame',ap:2,mana:4,range:4,damage:7,color:'#ffb685',desc:'轰击 4 格内的地面，对目标及相邻 4 格造成 7 点伤害。不会伤及自身。'},
 {id:'ice',key:'4',name:'霜缚',en:'FROST',icon:'snow',ap:1,mana:3,range:4,damage:3,color:'#9fe8ff',desc:'造成 3 点伤害并冻结敌人一次行动。解冻后一回合免疫；首领仅受到伤害。'},
 {id:'blink',key:'5',name:'闪现',en:'BLINK',icon:'portal',ap:1,mana:3,range:5,color:'#d2afff',desc:'跨越障碍，传送到 5 格内的空地。落点会触发地形效果。'},
 {id:'ward',key:'6',name:'星光护盾',en:'WARD',icon:'shield',ap:1,mana:2,range:0,color:'#8edbc9',desc:'获得 6 点护盾，可叠加至 12 点；护盾持续到被消耗。'},
 {id:'meditate',key:'7',name:'冥想',en:'MEDITATE',icon:'moon',ap:1,mana:0,range:0,color:'#d7cbff',desc:'回复 4 点法力。每回合只能使用一次。'}
];
export const STAGES=[
 {name:'微光林地',en:'THE GLIMMERWOOD',subtitle:'古老的棋局，在此苏醒。',rune:'I',color:'#63c4ac',terrain:'forest',objective:'击败所有守卫，唤醒星门',rocks:[[0,2],[2,2],[4,5],[5,1],[7,4]],lava:[[4,3],[5,3]],spring:[2,5],chests:[[0,4],[6,6]],enemies:[['skeleton',4,2],['cultist',6,3],['skeleton',5,6]]},
 {name:'余烬废墟',en:'THE EMBER RUINS',subtitle:'灰烬之下，仍有未熄的誓言。',rune:'II',color:'#e8a274',terrain:'ruins',objective:'击破余烬卫队，穿过废墟',rocks:[[1,3],[3,3],[6,4],[4,1],[7,2]],lava:[[3,4],[4,4],[5,4],[2,1]],spring:[0,5],chests:[[2,6],[6,1]],enemies:[['skeleton',3,5],['cultist',6,2],['golem',5,0],['skeleton',1,1]]},
 {name:'星蚀王座',en:'THE ECLIPSE THRONE',subtitle:'每一步，都在改写星辰的命运。',rune:'III',color:'#bba5ec',terrain:'astral',objective:'击败星蚀君王，终结这场棋局',rocks:[[2,3],[5,3],[0,2],[7,5]],lava:[[3,3],[4,3],[1,0],[6,0]],spring:[1,5],chests:[[6,6]],enemies:[['boss',4,0],['cultist',6,2],['skeleton',1,2],['skeleton',5,5]]}
];
export const ENEMY_TYPES={skeleton:{name:'骸骨卫士',hp:9,damage:3,range:1,speed:2,icon:'sword',color:'#d0c5ab'},cultist:{name:'暮影术士',hp:8,damage:3,range:4,speed:1,icon:'spark',color:'#d7a5eb'},golem:{name:'余烬魔像',hp:18,damage:5,range:1,speed:1,icon:'shield',color:'#e9ac75'},boss:{name:'星蚀君王',hp:36,damage:4,range:3,speed:1,icon:'crown',color:'#e8a5b6'}};
export const RELICS=[
 {id:'heart',name:'古树之心',icon:'heart',desc:'生命上限 +8，立即回复 10 点生命。',detail:'一颗仍在缓缓跳动的琥珀。'},
 {id:'ember',name:'不灭余烬',icon:'flame',desc:'奥术飞弹和陨火术伤害 +2。',detail:'将微光，燃成燎原的火。'},
 {id:'crystal',name:'月辉棱镜',icon:'diamond',desc:'法力上限 +4，每回合额外回复 1 点法力。',detail:'月色被封存于六面水晶之中。'},
 {id:'boots',name:'逐星之靴',icon:'steps',desc:'行走距离 +1，闪现消耗减少 1 点法力。',detail:'走向无人踏足的星轨。'},
 {id:'aegis',name:'守望者纹章',icon:'shield',desc:'进入每个回合时，自动获得 2 点护盾。',detail:'遗忘的骑士，仍守护着旅人。'},
 {id:'focus',name:'贤者的沙漏',icon:'hourglass',desc:'每回合的第一个奥术飞弹额外造成 3 点伤害。',detail:'时间为你，稍作停留。'}
];
export const distance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const key=(x,y)=>`${x},${y}`;
const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
export class Game {
 constructor(difficulty='normal'){this.difficulty=difficulty;this.stage=0;this.round=1;this.phase='player';this.hero={x:1,y:6,hp:28,maxHp:28,mana:12,maxMana:12,ap:3,maxAp:3,shield:0};this.relics=[];this.gold=0;this.kills=0;this.log=[];this.events=[];this.totalRounds=0;this.loadStage(0)}
 note(text,type='info'){this.log.unshift({text,type,round:this.round});this.log=this.log.slice(0,35)}
 event(type,data={}){this.events.push({type,...data})}
 loadStage(index){this.stage=index;this.round=1;this.phase='player';this.meditated=false;this.bolted=false;this.threat=[];this.enemies=STAGES[index].enemies.map(([type,x,y],i)=>({id:`${index}-${i}`,type,x,y,...ENEMY_TYPES[type],maxHp:ENEMY_TYPES[type].hp,frozen:0,immune:0}));this.tiles=[];const level=STAGES[index];for(let y=0;y<8;y++)for(let x=0;x<8;x++){let type='ground';if(level.rocks.some(p=>p[0]===x&&p[1]===y))type='rock';if(level.lava.some(p=>p[0]===x&&p[1]===y))type='rift';if(level.spring[0]===x&&level.spring[1]===y)type='spring';if(level.chests.some(p=>p[0]===x&&p[1]===y))type='chest';if(x===7&&y===0)type='portal';this.tiles.push({x,y,type,used:false})}Object.assign(this.hero,{x:1,y:6,ap:this.hero.maxAp,mana:this.hero.maxMana});this.note(`抵达${level.name}。击败守卫，寻找通向下一幕的星门。`,'chapter');this.event('stage')}
 tile(x,y){return this.tiles.find(t=>t.x===x&&t.y===y)}
 enemy(x,y){return this.enemies.find(e=>e.x===x&&e.y===y&&e.hp>0)}
 has(id){return this.relics.includes(id)}
 cost(spell){return Math.max(0,spell.mana-(spell.id==='blink'&&this.has('boots')?1:0))}
 range(spell){return spell.range+(spell.id==='move'&&this.has('boots')?1:0)}
 clear(){this.events=[]}
 blocked(x,y,ignoreEnemies=false){const t=this.tile(x,y);return !t||t.type==='rock'||(!ignoreEnemies&&!!this.enemy(x,y))}
 paths(from=this.hero,max=3,ignoreHero=true){let seen=new Map([[key(from.x,from.y),[]]]),queue=[from];while(queue.length){const p=queue.shift(),path=seen.get(key(p.x,p.y));if(path.length>=max)continue;for(const [dx,dy] of dirs){const n={x:p.x+dx,y:p.y+dy},k=key(n.x,n.y);if(seen.has(k)||this.blocked(n.x,n.y)||(!ignoreHero&&n.x===this.hero.x&&n.y===this.hero.y))continue;seen.set(k,[...path,n]);queue.push(n)}}return seen}
 sight(a,b){let x=a.x,y=a.y;const dx=Math.abs(b.x-x),dy=Math.abs(b.y-y),sx=x<b.x?1:-1,sy=y<b.y?1:-1;let err=dx-dy;for(let i=0;i<20;i++){if(x===b.x&&y===b.y)return true;const e2=err*2;if(e2>-dy){err-=dy;x+=sx}if(e2<dx){err+=dx;y+=sy}if((x!==b.x||y!==b.y)&&this.tile(x,y)?.type==='rock')return false}return false}
 available(id){const s=SPELLS.find(s=>s.id===id);if(!s)return '未知法术';if(this.phase!=='player')return '请等待你的回合';if(this.hero.ap<s.ap)return '行动点不足，请结束回合';if(this.hero.mana<this.cost(s))return '法力不足，试试冥想';if(id==='meditate'&&this.meditated)return '本回合已经冥想过了';if(id==='meditate'&&this.hero.mana===this.hero.maxMana)return '法力已经充盈';return null}
 valid(id,x,y){const s=SPELLS.find(s=>s.id===id);if(!s||!this.tile(x,y)||this.available(id))return false;const p={x,y},d=distance(this.hero,p);if(s.range===0)return x===this.hero.x&&y===this.hero.y;if(d===0)return false;if(id==='move')return (this.paths(this.hero,this.range(s)).get(key(x,y))?.length||0)>0;if(d>this.range(s))return false;if(id==='blink')return !this.blocked(x,y);if(id==='fire')return this.tile(x,y).type!=='rock';return !!this.enemy(x,y)&&this.sight(this.hero,p)}
 targets(id){const s=SPELLS.find(s=>s.id===id);return s?this.tiles.filter(t=>this.valid(id,t.x,t.y)):[]}
 damageEnemy(enemy,n,kind){enemy.hp=Math.max(0,enemy.hp-n);this.event('hit',{x:enemy.x,y:enemy.y,n,kind});if(!enemy.hp){this.kills++;this.gold+=12;this.note(`${enemy.name}被击败，获得 12 星尘。`,'good')}}
 hurt(n){const absorbed=Math.min(n,this.hero.shield);this.hero.shield-=absorbed;this.hero.hp=Math.max(0,this.hero.hp-(n-absorbed));this.event('hurt',{x:this.hero.x,y:this.hero.y,n:n-absorbed,absorbed});return n-absorbed}
 pickup(){const t=this.tile(this.hero.x,this.hero.y);if(t.used)return;if(t.type==='spring'){t.used=true;this.hero.mana=Math.min(this.hero.maxMana,this.hero.mana+5);this.hero.hp=Math.min(this.hero.maxHp,this.hero.hp+3);this.note('月泉为你回复 5 法力、3 生命。','good');this.event('heal',{x:t.x,y:t.y})}if(t.type==='chest'){t.used=true;this.gold+=30;this.hero.hp=Math.min(this.hero.maxHp,this.hero.hp+4);this.note('打开星尘宝箱：获得 30 星尘、回复 4 生命。','good');this.event('treasure',{x:t.x,y:t.y})}}
 act(id,x=this.hero.x,y=this.hero.y){const s=SPELLS.find(s=>s.id===id);const error=this.available(id);if(error)return {ok:false,error};if(!this.valid(id,x,y))return {ok:false,error:'目标不在可用范围内，或被障碍遮挡。'};this.clear();this.hero.ap-=s.ap;this.hero.mana-=this.cost(s);if(id==='move'||id==='blink'){const from={x:this.hero.x,y:this.hero.y};const path=id==='move'?this.paths(this.hero,this.range(s)).get(key(x,y)):[];this.event(id,{from,x,y,path});if(id==='move'){for(const step of path){this.hero.x=step.x;this.hero.y=step.y;this.pickup()}}else{this.hero.x=x;this.hero.y=y;this.pickup()}this.note(id==='blink'?'你穿过星隙，完成闪现。':'你在棋盘上迈出了新的一步。')}
 if(id==='bolt'||id==='ice'){const e=this.enemy(x,y);let n=s.damage+(id==='bolt'&&this.has('ember')?2:0)+(id==='bolt'&&this.has('focus')&&!this.bolted?3:0);this.event('spell',{kind:id,from:{x:this.hero.x,y:this.hero.y},x,y});this.damageEnemy(e,n,id);if(id==='bolt')this.bolted=true;if(id==='ice'&&e.hp>0&&e.type!=='boss'&&!e.immune&&!e.frozen)e.frozen=1;this.note(`${s.name}命中${e.name}，造成 ${n} 点伤害。`,'spell')}
 if(id==='fire'){const n=s.damage+(this.has('ember')?2:0);const affected=this.enemies.filter(e=>distance(e,{x,y})<=1);this.event('spell',{kind:id,from:{x:this.hero.x,y:this.hero.y},x,y});affected.forEach(e=>this.damageEnemy(e,n,id));this.note(`陨火落下，命中 ${affected.length} 名敌人。`,'spell')}
 if(id==='ward'){this.hero.shield=Math.min(12,this.hero.shield+6);this.event('ward',{x,y});this.note('星光护盾已展开，吸收即将到来的伤害。','good')}
 if(id==='meditate'){this.meditated=true;this.hero.mana=Math.min(this.hero.maxMana,this.hero.mana+4);this.event('heal',{x,y});this.note('静心冥想，回复 4 点法力。','good')}
 this.enemies=this.enemies.filter(e=>e.hp>0);this.check();return {ok:true,events:this.events}}
 check(){if(this.hero.hp<=0){this.phase='lost';this.note('星光暂时熄灭……下一次，你会走得更远。','bad');return}if(!this.enemies.length&&this.phase!=='reward'&&this.phase!=='won'){this.phase=this.stage===2?'won':'reward';this.note('秘境已被净化！','good');this.event('victory')}}
 beginEnemy(){if(this.phase!=='player')return false;this.clear();this.phase='enemy';if(this.tile(this.hero.x,this.hero.y).type==='rift'){this.hurt(2);this.note('星隙灼烧：失去 2 点生命。','bad')}if(this.threat.some(t=>t.x===this.hero.x&&t.y===this.hero.y)){this.hurt(7);this.note('星蚀轰击落下，造成 7 点伤害。','bad')}if(this.threat.length)this.event('blast',{tiles:[...this.threat]});this.threat=[];this.check();return true}
 enemyTurn(id){if(this.phase!=='enemy')return;this.clear();const e=this.enemies.find(e=>e.id===id);if(!e)return;if(e.frozen){e.frozen=0;e.immune=1;this.note(`${e.name}被寒冰困住，跳过行动。`);return}if(e.immune)e.immune--;if(e.type==='boss'&&this.round%3===0){const target={x:this.hero.x,y:this.hero.y};this.threat=this.tiles.filter(t=>distance(t,target)<=1&&t.type!=='rock').map(t=>({x:t.x,y:t.y}));this.note('星蚀君王正在蓄力！下一敌方回合前离开红色区域。','bad');this.event('charge',{x:e.x,y:e.y});return}
 const canHit=()=>distance(e,this.hero)<=e.range&&this.sight(e,this.hero);if(!canHit()){const paths=this.paths(e,64,false);let bestPath=null,bestScore=Infinity;for(const path of paths.values()){if(!path.length)continue;const p=path.at(-1),d=distance(p,this.hero);const attackSpot=d<=e.range&&this.sight(p,this.hero);const score=(attackSpot?0:d*100)+path.length;if(score<bestScore){bestPath=path;bestScore=score}}if(bestPath){const from={x:e.x,y:e.y},step=bestPath[Math.min(e.speed,bestPath.length)-1];e.x=step.x;e.y=step.y;this.event('enemyMove',{id:e.id,from,x:e.x,y:e.y,path:bestPath.slice(0,e.speed)})}}
 if(canHit()){const damage=e.damage-(this.difficulty==='story'?1:0);this.hurt(damage);this.event('attack',{from:{x:e.x,y:e.y},x:this.hero.x,y:this.hero.y});this.note(`${e.name}发动攻击，造成 ${damage} 点伤害${this.hero.shield?'（护盾抵挡）':''}。`,'bad')}this.check()}
 finishEnemy(){if(this.phase!=='enemy')return;this.clear();this.round++;this.totalRounds++;this.hero.ap=this.hero.maxAp;this.hero.mana=Math.min(this.hero.maxMana,this.hero.mana+2+(this.has('crystal')?1:0));if(this.has('aegis'))this.hero.shield=Math.min(12,this.hero.shield+2);this.meditated=false;this.bolted=false;this.phase='player';this.note(`第 ${this.round} 回合：行动点已恢复，法力 +${this.has('crystal')?3:2}。`,'turn')}
 rewardChoices(){return (this.stage===0?RELICS.slice(0,3):RELICS.slice(3,6)).filter(r=>!this.has(r.id))}
 chooseRelic(id){if(this.phase!=='reward'||!this.rewardChoices().some(r=>r.id===id))return false;this.relics.push(id);if(id==='heart'){this.hero.maxHp+=8;this.hero.hp+=10}if(id==='crystal')this.hero.maxMana+=4;this.hero.hp=Math.min(this.hero.maxHp,this.hero.hp+8);this.hero.shield=Math.min(12,this.hero.shield+3);this.loadStage(this.stage+1);return true}
 export(){return {version:1,difficulty:this.difficulty,stage:this.stage,round:this.round,phase:this.phase,hero:this.hero,relics:this.relics,gold:this.gold,kills:this.kills,log:this.log,totalRounds:this.totalRounds,tiles:this.tiles,enemies:this.enemies,threat:this.threat,meditated:this.meditated,bolted:this.bolted}}
 static restore(data){if(data?.version!==1||!Number.isInteger(data.stage)||data.stage<0||data.stage>2||!data.hero||!Array.isArray(data.enemies)||!Array.isArray(data.tiles)||data.tiles.length!==64||!['player','reward','won','lost'].includes(data.phase))throw Error('Invalid save');const g=new Game(data.difficulty);Object.assign(g,data);g.events=[];return g}
}
