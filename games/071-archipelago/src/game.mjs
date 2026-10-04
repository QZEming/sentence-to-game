export const KINGDOMS = [
 {id:'verdant',name:'翡翠商盟',en:'THE VERDANT LEAGUE',short:'翡翠',ruler:'议长 · 艾琳',color:'#71b69a',symbol:'❧',pos:[-10,0,-3],desc:'千帆汇聚的自由港。这里没有永恒的敌人，只有尚未谈妥的生意。',quote:'让海风带来财富，我们便能找到共同的语言。',trait:'重视贸易',stance:'trade',initial:45,reward:'每轮额外获得 15 金币',quest:'港口重建',questText:'援助港口工匠 35 金币，重开古老商路。',questCost:{gold:35}},
 {id:'coral',name:'赤珊王庭',en:'THE CORAL CROWN',short:'赤珊',ruler:'女王 · 塞蕾娜',color:'#df8c7c',symbol:'♜',pos:[3,0,-9],desc:'守望南海的古老王庭。红珊瑚冠冕之下，荣誉比黄金更有分量。',quote:'一个值得托付后背的盟友，胜过满载金银的船队。',trait:'崇尚荣誉',stance:'defense',initial:38,reward:'每轮风暴危机降低 2 点',quest:'守望灯塔',questText:'提供 5 份补给，让海岬灯塔重新点亮。',questCost:{supply:5}},
 {id:'azure',name:'苍岚学城',en:'THE AZURE SANCTUM',short:'苍岚',ruler:'先知 · 奥瑞恩',color:'#7db5dd',symbol:'✧',pos:[12,0,2],desc:'群星与潮汐的研究之所。学者们深信，知识终将跨越国界。',quote:'海洋藏着许多答案。你带来的，是问题，还是发现？',trait:'追寻知识',stance:'knowledge',initial:32,reward:'每轮声望提高 2 点',quest:'失落的航图',questText:'资助远征 45 金币，修复群岛星象图。',questCost:{gold:45}},
 {id:'iron',name:'铁峭堡邦',en:'THE IRON BASTION',short:'铁峭',ruler:'统帅 · 罗安',color:'#b1a5d6',symbol:'♟',pos:[-8,0,10],desc:'玄武岩上矗立的钢铁要塞。长期的封锁使堡邦谨慎，也让它渴望支援。',quote:'话语筑不起城墙。让我们看看，你能带来什么。',trait:'信奉实力',stance:'defense',initial:25,reward:'航行补给消耗减半',quest:'寒潮储备',questText:'提供 6 份补给，为边境居民储备粮食。',questCost:{supply:6}},
 {id:'moon',name:'月湾公国',en:'THE MOONLIT COURT',short:'月湾',ruler:'公爵 · 莉雅',color:'#ddc38d',symbol:'☾',pos:[7,0,13],desc:'月桂与白石构成的宁静海湾。比起扩张版图，公国更珍惜和平。',quote:'若所有航船都能平安归港，我们便拥有了真正的繁荣。',trait:'珍视和平',stance:'peace',initial:48,reward:'所有赠礼额外提高 4 点关系',quest:'海上医馆',questText:'提供 4 份补给，帮助医师救治海上难民。',questCost:{supply:4}}
];
export const STANCES=[{id:'trade',name:'互惠贸易',icon:'coins',desc:'以商路和共同利益建立信任'},{id:'defense',name:'共同防御',icon:'shield',desc:'承诺维护海域安全'},{id:'knowledge',name:'知识交流',icon:'star',desc:'分享航图与学术成果'},{id:'peace',name:'和平调停',icon:'leaf',desc:'以中立立场化解争端'}];
export const EVENTS=[
 {title:'迷雾中的商船',tag:'海上救援',text:'一艘满载香料的商船在礁石旁升起了求救旗。翡翠商盟会记住伸出援手的人。',choices:[{title:'分出补给救援',detail:'补给 −3 · 翡翠关系 +14 · 声望 +5',cost:{supply:3},relation:['verdant',14],renown:5},{title:'雇用拖船',detail:'金币 −25 · 翡翠关系 +10',cost:{gold:25},relation:['verdant',10]}]},
 {title:'两面旗帜，一片海域',tag:'领海争端',text:'赤珊与铁峭的巡逻舰在边界相遇。双方都希望你能成为公正的见证人。',choices:[{title:'召集和平会谈',detail:'金币 −30 · 双方关系 +10 · 解除外交嫌隙',cost:{gold:30},mediate:true,renown:6},{title:'派出中立观察员',detail:'补给 −2 · 风暴危机 −8',cost:{supply:2},storm:-8}]},
 {title:'被潮水送来的星图',tag:'古代遗迹',text:'水手发现了一只密封铜匣，里面的星图记录着早已失传的季风航路。',choices:[{title:'赠予苍岚学城',detail:'苍岚关系 +16 · 声望 +4',relation:['azure',16],renown:4},{title:'卖给航海公会',detail:'金币 +45 · 补给 +3',gold:45,supply:3}]},
 {title:'月湾的白帆',tag:'人道援助',text:'战乱中的难民正驶向月湾。公国的医师请求你帮助搭建一座临时海上医馆。',choices:[{title:'捐赠药品与粮食',detail:'补给 −4 · 月湾关系 +18 · 声望 +6',cost:{supply:4},relation:['moon',18],renown:6},{title:'资助医师出航',detail:'金币 −25 · 月湾关系 +10 · 危机 −5',cost:{gold:25},relation:['moon',10],storm:-5}]},
 {title:'黑帆掠过地平线',tag:'海盗威胁',text:'一支海盗船队正在截断群岛航路。你的盟友愿意响应联合巡航的号召。',choices:[{title:'组织联合巡航',detail:'需要 1 个盟友 · 补给 −3 · 危机 −14 · 声望 +8',cost:{supply:3},needsAlly:true,storm:-14,renown:8},{title:'护送商船绕行',detail:'金币 −20 · 危机 −6 · 声望 +3',cost:{gold:20},storm:-6,renown:3}]},
 {title:'群岛丰收节',tag:'王国庆典',text:'暖风带来了丰收的消息。一次由你主持的庆典，或许能让隔阂在歌声中消散。',choices:[{title:'举办群岛宴会',detail:'金币 −40 · 所有王国关系 +7 · 声望 +5',cost:{gold:40},allRelation:7,renown:5},{title:'采购丰收物资',detail:'金币 −10 · 补给 +8',cost:{gold:10},supply:8}]}
];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function createGame(seed=Math.floor(Math.random()*4294967296)){return {version:1,turn:1,ap:3,gold:160,supply:16,renown:24,storm:12,location:'harbor',selected:'verdant',seed:seed>>>0,mediated:false,event:null,result:null,log:[{turn:1,text:'启航日。五封国书，一艘白帆，群岛的未来正等待你的回答。',kind:'story'}],kingdoms:Object.fromEntries(KINGDOMS.map(k=>[k.id,{relation:k.initial,allied:false,trade:false,intel:false,quest:false,retries:0,giftTurn:0}]))};}
export const allies=s=>Object.values(s.kingdoms).filter(k=>k.allied).length;
export function chance(s,id,stance,offer=0,pact='alliance') {const k=s.kingdoms[id],d=KINGDOMS.find(x=>x.id===id);const rivalry=!s.mediated&&((id==='coral'&&s.kingdoms.iron.allied)||(id==='iron'&&s.kingdoms.coral.allied));return Math.round(clamp(18+k.relation*.55+s.renown*.22+(d.stance===stance?17:0)+(k.intel?12:0)+(offer>=25?10:0)+Math.min(k.retries*8,24)-(rivalry?15:0)+(pact==='trade'?15:0),12,96));}
export function affordable(s,cost={}){return Object.entries(cost).every(([key,value])=>s[key]>=value);}
function pay(s,cost){for(const [key,n] of Object.entries(cost||{}))s[key]-=n;}
function log(s,text,kind='action'){s.log.unshift({turn:s.turn,text,kind});s.log=s.log.slice(0,80);}
function random(s){s.seed=(s.seed*1664525+1013904223)>>>0;return s.seed/4294967296;}
function relation(s,id,n){s.kingdoms[id].relation=clamp(s.kingdoms[id].relation+n,0,100);}
function finish(s){s.gold=Math.max(0,Math.round(s.gold));s.supply=clamp(Math.round(s.supply),0,99);s.renown=clamp(s.renown,0,100);s.storm=clamp(s.storm,0,100);if(allies(s)>=4&&s.renown>=65){s.result='victory';s.event=null;}else if(s.storm>=100||s.turn>24){s.result='defeat';s.event=null;}}
export function act(state,type,p={}) {
 const s=structuredClone(state),k=s.kingdoms[p.id],d=KINGDOMS.find(x=>x.id===p.id);
 if(s.result)return {ok:false,error:'本次航程已经结束。可以开始新的远征。'};
 if(s.event!==null&&type!=='event')return {ok:false,error:'请先处理当前海上事件。'};
 if(!['end','event'].includes(type)&&s.ap<=0)return {ok:false,error:'本轮行动力已用尽，请结束回合。'};
 if(['sail','gift','intel','quest','negotiate'].includes(type)&&!k)return {ok:false,error:'未知的王国。'};
 if(['gift','intel','quest','negotiate'].includes(type)&&s.location!==p.id)return {ok:false,error:'请先航行至该王国。'};
 let message='';
 if(type==='sail') {if(s.location===p.id)return {ok:false,error:'使船已经停泊于此。'};const cost=s.kingdoms.iron.allied?1:2;if(s.supply<cost)return {ok:false,error:'补给不足。可在任意港口使用「整备船队」。'};s.supply-=cost;s.location=p.id;s.selected=p.id;message=`抵达${d.name}。消耗 ${cost} 份航行补给。`;}
 else if(type==='gift'){if(k.giftTurn===s.turn)return {ok:false,error:'该王国本轮已经接受赠礼。'};if(s.gold<25)return {ok:false,error:'赠礼需要 25 金币。'};s.gold-=25;const gain=12+(s.kingdoms.moon.allied?4:0);relation(s,p.id,gain);k.giftTurn=s.turn;message=`向${d.name}赠送礼物，关系 +${gain}。`;}
 else if(type==='intel'){if(k.intel)return {ok:false,error:'已经掌握该国情报，下次谈判将自动使用。'};if(s.gold<15)return {ok:false,error:'搜集情报需要 15 金币。'};s.gold-=15;k.intel=true;message=`密使发现：${d.name}偏好「${STANCES.find(x=>x.id===d.stance).name}」，下次谈判成功率 +12%。`;}
 else if(type==='quest'){if(k.quest)return {ok:false,error:'这项王国委托已经完成。'};if(!affordable(s,d.questCost))return {ok:false,error:'完成委托所需的资源不足。'};pay(s,d.questCost);k.quest=true;relation(s,p.id,18);s.renown+=7;message=`完成「${d.quest}」：${d.name}关系 +18，声望 +7。`;}
 else if(type==='negotiate') {const pact=p.pact==='trade'?'trade':'alliance';if(k[pact==='trade'?'trade':'allied'])return {ok:false,error:'该项条约已经签署。'};if(!STANCES.some(x=>x.id===p.stance)||![0,25].includes(p.offer))return {ok:false,error:'请选择有效的谈判方案。'};if(pact==='alliance'&&k.relation<55)return {ok:false,error:'缔结联盟需要关系达到 55。先完成委托或赠礼。'};const cost=p.offer+(pact==='alliance'?20:10);if(s.gold<cost)return {ok:false,error:`本次谈判需要 ${cost} 金币（包含条约费用）。`};const rate=chance(s,p.id,p.stance,p.offer,pact);s.gold-=cost;const win=random(s)*100<rate;k.intel=false;if(win){k.retries=0;relation(s,p.id,pact==='trade'?9:12);if(pact==='trade'){k.trade=true;s.renown+=4;message=`与${d.name}签署通商协定！每轮收入 +8 金币。`;}else{k.allied=true;s.renown+=10;s.storm-=8;message=`${d.name}正式加入群岛盟约！声望 +10，危机 −8。`;}}else{relation(s,p.id,-3);k.retries++;message=`${d.name}暂未接受提案（成功率 ${rate}%）。下次谈判获得 +8% 重试加成。`;}}
 else if(type==='resupply'){s.supply+=6;s.gold+=8;message='船队完成整备：补给 +6，金币 +8。';}
 else if(type==='speech'){s.renown+=5;message='在港口发表和平演说，声望 +5。';}
 else if(type==='mediate'){if(s.mediated)return {ok:false,error:'领海争端已经解决。'};if(s.renown<35)return {ok:false,error:'调停需要至少 35 声望。'};if(s.gold<30)return {ok:false,error:'筹备调停需要 30 金币。'};s.gold-=30;s.mediated=true;relation(s,'coral',10);relation(s,'iron',10);s.renown+=6;s.storm-=5;message='赤珊与铁峭接受调停，盟友之间的外交嫌隙已经消除。';}
 else if(type==='end'){const count=allies(s);const income=18+Object.values(s.kingdoms).filter(x=>x.trade).length*8+(s.kingdoms.verdant.allied?15:0);s.gold+=income;s.supply+=2;s.renown+=s.kingdoms.azure.allied?2:0;s.storm+=Math.max(1,5-count-(s.kingdoms.coral.allied?2:0));s.turn++;s.ap=3;if(s.turn%3===0)s.event=(Math.floor(s.turn/3)-1)%EVENTS.length;message=`新的潮汐。商路收入 +${income} 金币，港口补给 +2，行动力已恢复。`;}
 else if(type==='event'){if(s.event===null)return {ok:false,error:'目前没有待处理事件。'};const e=EVENTS[s.event];if(p.choice===-1){s.storm+=4;message=`暂缓处理「${e.title}」，风暴危机 +4。`;}else{const c=e.choices[p.choice];if(!c||!affordable(s,c.cost)||(c.needsAlly&&allies(s)<1))return {ok:false,error:'不满足此事件选项的条件。'};pay(s,c.cost);for(const key of ['gold','supply','renown','storm'])s[key]+=c[key]||0;if(c.relation)relation(s,...c.relation);if(c.allRelation)for(const id of Object.keys(s.kingdoms))relation(s,id,c.allRelation);if(c.mediate){s.mediated=true;relation(s,'coral',10);relation(s,'iron',10);}message=`${e.title}：${c.title}。`;}s.event=null;}
 else return {ok:false,error:'未知行动。'};
 if(!['end','event'].includes(type))s.ap--;
 log(s,message,type==='negotiate'?'diplomacy':type==='event'?'event':'action');finish(s);return {ok:true,state:s,message};
}
