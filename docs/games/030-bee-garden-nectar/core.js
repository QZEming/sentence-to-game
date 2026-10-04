export const SPECIES = [
  { name: '小雏菊', color: '#fff9db', center: '#e7b338', icon: '✿', value: 1, region: '雏菊花田', note: '阳光味道的第一口甜。花蜜回复快，适合初次出发。', stock: 6, regen: 28 },
  { name: '薰衣草', color: '#a487dc', center: '#8361c1', icon: '❋', value: 1.5, region: '紫色山坡', note: '微风里藏着淡淡花香。花蜜价值是雏菊的 1.5 倍。', stock: 7, regen: 36 },
  { name: '波斯菊', color: '#ef9fb6', center: '#ebbd52', icon: '❀', value: 2, region: '粉色花径', note: '像落在草地上的云霞。花蜜价值是雏菊的 2 倍。', stock: 8, regen: 42 },
  { name: '金色向日葵', color: '#ffc84b', center: '#76552f', icon: '✺', value: 3, region: '向阳秘境', note: '花园深处的金色宝藏。花蜜价值 3 倍，小心巡逻的黄蜂。', stock: 10, regen: 48 }
];
export const UPGRADES = [
  { key:'bag',name:'花蜜背包',icon:'♧',description:'每级增加 12 点花蜜容量',prices:[15,35,65] },
  { key:'wings',name:'轻盈翅膀',icon:'ϟ',description:'每级增加 15% 飞行速度，减少 15% 体力消耗',prices:[20,40,70] },
  { key:'skill',name:'采蜜技巧',icon:'✧',description:'每级提高 35% 采蜜速度',prices:[20,40,70] }
];
export const freshState = () => ({version:1,honey:0,nectar:0,nectarValue:0,energy:100,xp:0,totalHoney:0,harvests:0,discovered:[],upgrades:{bag:0,wings:0,skill:0},quests:[false,false,false],dayTime:90,races:0,bestRace:0});
const bounded = (v, lo, hi, def=lo) => Number.isFinite(v) ? Math.max(lo,Math.min(hi,v)) : def;
export function sanitizeSave(s){
 const d=freshState(); if(!s || s.version!==1)return d;
 for(const k of ['honey','nectar','nectarValue','xp','totalHoney','harvests','dayTime','races','bestRace']) d[k]=bounded(s[k],0,1e9,d[k]);
 d.energy=bounded(s.energy,0,100,100);
 for(const k of ['bag','wings','skill'])d.upgrades[k]=Math.floor(bounded(s.upgrades?.[k],0,3));
 d.nectar=bounded(d.nectar,0,capacity(d)); d.nectarValue=d.nectar ? bounded(d.nectarValue,d.nectar,d.nectar*5.625,d.nectar):0;
 d.discovered=[...new Set(Array.isArray(s.discovered)?s.discovered.filter(v=>Number.isInteger(v)&&v>=0&&v<4):[])];
 d.quests=d.quests.map((_,i)=>s.quests?.[i]===true); return d;
}
export const capacity=s=>20+s.upgrades.bag*12;
export const level=s=>1+Math.floor(Math.sqrt(s.xp/30));
export function collect(s,type,amount,stock,multiplier=1){
 const n=Math.max(0,Math.min(amount,stock,capacity(s)-s.nectar));
 if(n<=0)return 0;
 s.nectar+=n;s.nectarValue+=n*SPECIES[type].value*multiplier;s.xp+=n*.5;
 if(!s.discovered.includes(type))s.discovered.push(type);
 return n;
}
export function deposit(s){
 if(s.nectar<=0)return 0;const reward=Math.max(1,Math.round(s.nectarValue));
 s.honey+=reward;s.totalHoney+=reward;s.xp+=reward*.5;s.nectar=0;s.nectarValue=0;return reward;
}
export function purchase(s,key){
 const u=UPGRADES.find(u=>u.key===key);if(!u)return false;
 const cost=u.prices[s.upgrades[key]];if(cost===undefined||s.honey<cost)return false;
 s.honey-=cost;s.upgrades[key]++;return true;
}
export function questStatus(s){return [
 {name:'第一罐蜂蜜',desc:'回到蜂巢，酿出 15g 蜂蜜',current:Math.min(15,s.totalHoney),max:15,reward:10},
 {name:'花园探险家',desc:'发现花园里的 4 种花朵',current:s.discovered.length,max:4,reward:20},
 {name:'甜蜜的生活',desc:'酿出 100g 蜂蜜并完成一次升级',current:Math.min(100,s.totalHoney),max:100,reward:40,extra:Object.values(s.upgrades).some(v=>v>0)}
 ];}
export function completeQuests(s){
 const earned=[];questStatus(s).forEach((q,i)=>{if(!s.quests[i]&&(i===0||s.quests[i-1])&&q.current>=q.max&&q.extra!==false){s.quests[i]=true;s.honey+=q.reward;s.xp+=q.reward;earned.push(q);}});return earned;
}
