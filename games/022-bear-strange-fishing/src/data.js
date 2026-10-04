export const RARITIES=['普通','特别','稀有','传说'];
export const SPOTS=[{name:'芦苇浅滩',description:'微风、木栈桥，还有一点点惊喜。',caption:'一片湖，一只熊，一整天的好心情。'},{name:'月影深潭',description:'蘑菇悄悄发光，鱼也藏着星光。',caption:'听说，湖底收藏着昨夜的星星。'},{name:'瀑布回湾',description:'顺着水声，去找最古怪的朋友。',caption:'水花之下，奇妙的事情正在发生。'}];
export const FISH=[
 {name:'荷叶帽鱼',emoji:'🍃',rarity:0,spot:0,pref:'晴朗',phase:'day',desc:'出门一定戴帽子，哪怕它从来没有离开过水。'},
 {name:'泡泡奶茶鱼',emoji:'🧋',rarity:1,spot:0,pref:'微雨',phase:'day',desc:'圆滚滚的肚子里，珍珠跟着心情上上下下。'},
 {name:'草莓河豚',emoji:'🍓',rarity:2,spot:0,pref:'晴朗',phase:'dusk',desc:'一紧张就变得像草莓。闻起来倒像湖水。'},
 {name:'彩虹果冻鱼',emoji:'🌈',rarity:3,spot:0,pref:'晴朗',phase:'day',desc:'每一片鳞片都装着一点雨后的天空。'},
 {name:'星星灯笼鱼',emoji:'⭐',rarity:0,spot:1,pref:'多云',phase:'night',desc:'它把迷路的星星挂在头上，负责照亮回家的路。'},
 {name:'枕头梦游鱼',emoji:'💤',rarity:1,spot:1,pref:'多云',phase:'night',desc:'闭着眼睛游得很远，梦里也许是一只熊。'},
 {name:'月牙披风鱼',emoji:'🌙',rarity:2,spot:1,pref:'晴朗',phase:'night',desc:'披着一弯月色，是深潭里最安静的旅人。'},
 {name:'银河鲸宝宝',emoji:'🐳',rarity:3,spot:1,pref:'微雨',phase:'night',desc:'小小的身体，藏着一整条闪闪发亮的银河。'},
 {name:'螺旋桨飞鱼',emoji:'🪁',rarity:0,spot:2,pref:'晴朗',phase:'day',desc:'每天练习起飞，最高纪录是离水三秒。'},
 {name:'雷鼓胖头鱼',emoji:'🥁',rarity:1,spot:2,pref:'微雨',phase:'day',desc:'下雨时用肚子打鼓，瀑布是它的伴奏。'},
 {name:'水晶王冠鱼',emoji:'💎',rarity:2,spot:2,pref:'晴朗',phase:'day',desc:'王冠不是捡来的，是它耐心长出来的。'},
 {name:'云朵龙须鱼',emoji:'☁️',rarity:3,spot:2,pref:'多云',phase:'dusk',desc:'胡须柔软得像云，打个喷嚏就下一阵小雨。'}
];
export const UPGRADES=[{key:'rod',name:'韧性鱼竿',icon:'🎣',desc:'每级降低 8% 张力增长，让挣扎更从容。',cost:[60,150,300]},{key:'reel',name:'轻巧卷线器',icon:'⚙',desc:'每级提升 12% 收线速度，好鱼更快上岸。',cost:[80,180,360]},{key:'luck',name:'星星幸运符',icon:'✧',desc:'每级提升稀有与传说鱼的出现机会。',cost:[100,220,440]}];
export const QUESTS=[{title:'今天也要吃饱',desc:'成功钓到任意 3 条鱼',goal:3,reward:60,value:s=>s.total},{title:'湖边旅行家',desc:'在三个钓点各钓到至少 1 条鱼',goal:3,reward:120,value:s=>s.spotCatches.filter(n=>n>0).length},{title:'奇鱼收藏家',desc:'发现 6 种不同的奇异鱼',goal:6,reward:180,value:s=>Object.keys(s.collection).length}];
export const newSave=()=>({version:1,coins:0,total:0,collection:{},upgrades:{rod:0,reel:0,luck:0},quests:[],spotCatches:[0,0,0],day:1,hour:8,weather:0,spot:0,best:0});
export function cleanSave(s){
 const d=newSave();if(!s||typeof s!=='object'||s.version!==1)return d;
 const finite=(v,fallback=0)=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(Number.MAX_SAFE_INTEGER,n)):fallback;};
 for(const key of ['coins','total'])d[key]=Math.floor(finite(s[key]));d.best=finite(s.best);
 if(s.upgrades&&typeof s.upgrades==='object')for(const key of ['rod','reel','luck'])d.upgrades[key]=Math.min(3,Math.floor(finite(s.upgrades[key])));
 if(s.collection&&typeof s.collection==='object')for(const [key,v] of Object.entries(s.collection)){
  if(!/^(0|[1-9][0-9]*)$/.test(key)||Number(key)>=FISH.length||!v||typeof v!=='object')continue;
  const count=Math.floor(finite(v.count));if(count>=1)d.collection[key]={count,best:finite(v.best)};
 }
 d.quests=Array.isArray(s.quests)?[...new Set(s.quests.filter(i=>[0,1,2].includes(i)))]:[];
 d.spotCatches=[0,1,2].map(i=>Math.floor(finite(s.spotCatches?.[i])));
 d.day=Math.max(1,Math.floor(finite(s.day,1)));d.hour=Number.isFinite(s.hour)?((s.hour%24)+24)%24:8;
 d.weather=[0,1,2].includes(s.weather)?s.weather:0;d.spot=[0,1,2].includes(s.spot)?s.spot:0;return d;
}
export function selectFish({spot,weather,phase,luck=0,perfect=false,forceEasy=false,collection={},pity=0},random=Math.random){let pool=FISH.map((f,id)=>({...f,id})).filter(f=>f.spot===spot);if(forceEasy)return pool[0];if(pity>=5){const undiscovered=pool.filter(f=>!collection[f.id]&&f.rarity<=1);if(undiscovered.length)pool=undiscovered;}const weights=pool.map(f=>{let w=[55,30,12,3][f.rarity];if(f.pref===weather)w*=1.7;if(f.phase===phase)w*=1.35;if(f.rarity>=2)w*=1+luck*.2+(perfect?.25:0);return w});let n=random()*weights.reduce((a,b)=>a+b,0);for(let i=0;i<pool.length;i++){n-=weights[i];if(n<=0)return pool[i]}return pool.at(-1);}
export function tickFight(f,dt,holding,level,elapsed,easy){const struggle=Math.sin(elapsed*(1.25+f.rarity*.11))>.65;const rise=(20+f.rarity*5+(struggle?27:0))*(1-level.rod*.08)*(easy?.7:1);f.tension=Math.max(0,Math.min(105,f.tension+(holding?rise:-36)*dt));f.progress=Math.max(0,Math.min(100,f.progress+(holding?(12.5-f.rarity*1.4)*(1+level.reel*.12):(f.releaseTime>3?-1.8:0))*dt));f.releaseTime=holding?0:f.releaseTime+dt;f.danger=f.tension>=95?f.danger+dt:Math.max(0,f.danger-dt*2);return{struggle,caught:f.progress>=100,escaped:f.danger>1.1};}
