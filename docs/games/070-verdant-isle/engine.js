export const SEASONS = [
 {name:'春',en:'SPRING',subtitle:'万物初醒',color:'#6bba8d',growth:1.3,evap:.7,temp:18},
 {name:'夏',en:'SUMMER',subtitle:'盛夏繁荫',color:'#edbc54',growth:1.55,evap:1.8,temp:29},
 {name:'秋',en:'AUTUMN',subtitle:'风携种子',color:'#d79959',growth:.9,evap:1,temp:16},
 {name:'冬',en:'WINTER',subtitle:'静候新生',color:'#94b9d0',growth:.3,evap:.25,temp:3}
];
export const SPECIES = {
 grass:{name:'绒绒草',type:'先锋植物',cost:8,water:[22,82],desc:'最先唤醒荒土，成熟后帮助土壤积累养分。',color:'#88b77b'},
 flower:{name:'星铃花',type:'蜜源植物',cost:12,water:[30,76],desc:'温润土地上的小小星光，吸引蝴蝶与蜜蜂。',color:'#edbc82'},
 pine:{name:'云杉',type:'常绿乔木',cost:18,water:[25,80],desc:'耐寒的森林守护者，为鸟类提供巢穴。',color:'#518e78'},
 willow:{name:'溪岸柳',type:'湿地乔木',cost:18,water:[48,94],desc:'适合潮湿低地，树荫会降低水分蒸发。',color:'#a5be63'}
};
export const POWERS = {
 rain:{name:'唤雨',cost:12,key:'1',desc:'滋润周围土地 · 水分 +28',color:'#69aecd'},
 sun:{name:'暖阳',cost:10,key:'2',desc:'加速植物生长 · 蒸发多余水分',color:'#e8bc60'},
 wind:{name:'微风',cost:8,key:'3',desc:'传播成熟植物种子 · 疏散积水',color:'#9ac6b1'},
 seed:{name:'播种',cost:8,key:'4',desc:'在土地上播下生命 · 选择种子',color:'#9cbe72'},
 snow:{name:'落雪',cost:14,key:'5',desc:'补水并留下缓释雪被 · 消退热浪',color:'#adcadb'},
 bloom:{name:'复苏',cost:28,key:'6',desc:'生机 35 后解锁 · 周围植物迅速成长',color:'#c7a3cb'}
};
export const QUESTS=[
 {name:'唤醒沉睡的土地',desc:'在岛屿上施放 3 次唤雨',key:'rains',target:3,reward:20},
 {name:'让绿色连成一片',desc:'让 18 块土地拥有植物',key:'planted',target:18,reward:25},
 {name:'等待第一场花开',desc:'培育 6 丛成熟的星铃花',key:'flowers',target:6,reward:30},
 {name:'种下一座小森林',desc:'培育 8 棵成熟乔木',key:'trees',target:8,reward:35},
 {name:'归来的朋友',desc:'吸引 3 种动物回到岛屿',key:'animals',target:3,reward:40},
 {name:'会呼吸的岛屿',desc:'让生机达到 75 并维持 20 秒',key:'stable',target:20,reward:50}
];
export const ANIMALS=[
 {id:'butterfly',name:'琉璃蝶',needs:'3 丛成熟花朵',test:m=>m.flowers>=3,desc:'花间的授粉伙伴，帮助花朵更快成长。'},
 {id:'rabbit',name:'棉尾兔',needs:'10 块绿地 + 2 棵成熟乔木',test:m=>m.planted>=10&&m.trees>=2,desc:'在草地上奔跑，将绒绒草的种子带去远方。'},
 {id:'bird',name:'青羽鸟',needs:'6 棵成熟乔木 + 平均水分 30',test:m=>m.trees>=6&&m.moisture>=30,desc:'在森林中筑巢，为岛屿带来更多生命。'},
 {id:'bee',name:'金绒蜂',needs:'7 丛成熟花朵 + 生机 50',test:m=>m.flowers>=7&&m.vigor>=50,desc:'辛勤的花园访客，增加精灵能量的恢复速度。'},
 {id:'deer',name:'白斑鹿',needs:'12 棵成熟乔木 + 生机 70',test:m=>m.trees>=12&&m.vigor>=70,desc:'森林繁盛的见证者，漫步在树影之间。'}
];
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
export function seeded(n){let x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)}
export function region(q,r){return r<-1?'北境山丘':q>1?'东岸湿地':q<-1?'西侧林地':'中央草甸'}
export class Ecosystem {
 constructor(saved=null){
  this.time=0;this.energy=90;this.season=0;this.seasonAge=0;this.speed=1;this.paused=false;this.tiles=[];this.animals=[];this.discovered=[];this.quest=0;this.stable=0;this.won=false;this.stats={rains:0,casts:0,spread:0,combos:0};this.log=[];this.weather=null;this.nextEvent=90;this.lastCast=null;this.seasonCooldown=0;this.animalTimer={};this.faunaSpreadTimer=0;this.onEvent=()=>{};
  let id=0;for(let q=-4;q<=4;q++)for(let r=-4;r<=4;r++)if(Math.abs(q+r)<=4){
   const rnd=seeded(id+9);let plant=q<=-2&&r<=1&&r>=-1?(id%3===0?'pine':'grass'):null;
   this.tiles.push({id:id++,q,r,x:Math.sqrt(3)*(q+r/2),z:1.5*r,h:.3+seeded(id+50)*.25+(r<-1?(Math.abs(r)-1)*.3:0),water:22+rnd*19,soil:24+rnd*23,plant,growth:plant?.6+rnd*.35:0,snow:0,health:100});
  }
  if(saved&&saved.version===3&&Array.isArray(saved.tiles)&&saved.tiles.length===61&&saved.tiles.every((t,i)=>t.id===i&&Number.isFinite(t.water)&&(!t.plant||SPECIES[t.plant]))){
   for(const key of ['time','energy','season','seasonAge','tiles','animals','discovered','quest','stable','won','stats','log','weather','nextEvent','lastCast','seasonCooldown','animalTimer','faunaSpreadTimer'])if(saved[key]!==undefined)this[key]=saved[key];
   this.energy=clamp(this.energy);this.season=Math.floor(clamp(this.season,0,3));this.quest=Math.floor(clamp(this.quest,0,QUESTS.length));
  }
 }
 save(){const {onEvent,...data}=this;return {...data,version:3,paused:false,speed:1}}
 emit(type,text,extra={}){this.onEvent({type,text,...extra});if(type!=='cast'){this.log.unshift({time:this.time,text,type});this.log=this.log.slice(0,40)}}
 neighbors(tile,radius=1){return this.tiles.filter(t=>Math.max(Math.abs(t.q-tile.q),Math.abs(t.r-tile.r),Math.abs((t.q+t.r)-(tile.q+tile.r)))<=radius)}
 metrics(){
  const planted=this.tiles.filter(t=>t.plant).length,flowers=this.tiles.filter(t=>t.plant==='flower'&&t.growth>=.65).length,trees=this.tiles.filter(t=>['pine','willow'].includes(t.plant)&&t.growth>=.65).length;
  const moisture=this.tiles.reduce((n,t)=>n+t.water,0)/61;
  const biomass=this.tiles.reduce((n,t)=>n+(t.plant?.45+t.growth*.55:0),0)/61;
  const balanced=this.tiles.filter(t=>t.water>=25&&t.water<=85).length/61;
  const vigor=Math.round(clamp(biomass*72+balanced*13+this.animals.length*3));
  return {planted,flowers,trees,moisture,biomass,balanced,vigor,animals:this.animals.length,rains:this.stats.rains,stable:Math.floor(this.stable)};
 }
 cast(power,id,species='grass'){
  if(!POWERS[power]||!Number.isInteger(id)||!this.tiles[id])return {ok:false,text:'请先选择岛上的土地'};
  if(this.paused)return {ok:false,text:'时间已暂停，继续后即可施法'};
  if(power==='seed'&&!SPECIES[species])return {ok:false,text:'请选择有效的种子'};
  if(power==='bloom'&&this.metrics().vigor<35)return {ok:false,text:'生机达到 35 后，复苏之力才会苏醒'};
  const tile=this.tiles[id],cost=power==='seed'?SPECIES[species].cost:POWERS[power].cost;
  if(this.energy<cost)return {ok:false,text:'精灵能量不足，稍等片刻便会恢复'};
  if(power==='seed'&&tile.plant===species)return {ok:false,text:'这里已有同种植物，试试附近的荒土或改种其他植物'};
  this.energy-=cost;this.stats.casts++;
  const area=this.neighbors(tile,power==='seed'?0:1);
  let spread=0;
  area.forEach(t=>{
   if(power==='rain'){t.water=clamp(t.water+28);t.soil=clamp(t.soil+2);if(t.plant)t.growth=clamp(t.growth+.07,0,1)}
   if(power==='sun'){t.water=clamp(t.water-10);t.snow=Math.max(0,t.snow-15);if(t.plant&&t.water>18&&t.water<87)t.growth=clamp(t.growth+.2,0,1)}
   if(power==='wind'){t.water=clamp(t.water-8);if(t.plant&&t.growth>.45){const blanks=this.neighbors(t,this.season===2?2:1).filter(n=>!n.plant);const newTile=blanks[Math.floor(seeded(this.stats.casts+t.id)*blanks.length)];if(newTile){newTile.plant=t.plant;newTile.growth=.1;spread++}}}
   if(power==='seed'){t.plant=species;t.growth=.08;t.health=100}
   if(power==='snow'){t.snow=clamp(t.snow+28);t.water=clamp(t.water+10);t.health=clamp(t.health+10)}
   if(power==='bloom'&&t.plant){t.growth=clamp(t.growth+.4,0,1);t.health=100;t.water=clamp(t.water,32,76)}
  });
  if(power==='rain')this.stats.rains++;
  if(power==='wind')this.stats.spread+=spread;
  if(this.weather&&((this.weather.id==='heat'&&['rain','snow'].includes(power))||(this.weather.id==='rain'&&['wind','sun'].includes(power)))){this.weather.strength-=1;if(this.weather.strength<=0){this.emit('success','天气恢复平静，岛屿感谢你的守护');this.weather=null;this.energy=clamp(this.energy+15)}}
  let combo=null;const last=this.lastCast;
  if(last&&this.time-last.time<18&&this.neighbors(tile,2).some(t=>t.id===last.id)){
   if(last.power==='rain'&&power==='sun'){combo='雨后初晴';area.forEach(t=>{if(t.plant)t.growth=clamp(t.growth+.12,0,1)});this.energy=clamp(this.energy+6)}
   if(last.power==='seed'&&power==='rain'){combo='春芽苏醒';area.forEach(t=>{if(t.plant)t.growth=clamp(t.growth+.12,0,1)})}
   if(last.power==='wind'&&power==='rain'){combo='风播雨润';area.forEach(t=>{t.soil=clamp(t.soil+10)})}
  }
  if(combo){this.stats.combos++;this.emit('combo',combo+' · 生态连携！')}
  this.lastCast={power,id,time:this.time};this.emit('cast',POWERS[power].name,{power,id,area:area.map(t=>t.id),combo});
  this.checkProgress();return {ok:true,text:power==='wind'?`微风拂过 · 传播 ${spread} 颗种子`:power==='seed'?`种下${SPECIES[species].name}`:`${POWERS[power].name} · 影响 ${area.length} 块土地`};
 }
 changeSeason(index){
  if(!Number.isInteger(index)||index<0||index>3)return {ok:false,text:'无效季节'};
  if(index===this.season)return {ok:false,text:'现在正是这个季节'};
  if(this.seasonCooldown>0)return {ok:false,text:`四季之轮正在蓄力，还需 ${Math.ceil(this.seasonCooldown)} 秒`};
  if(this.energy<20)return {ok:false,text:'转动四季需要 20 点精灵能量'};
  this.energy-=20;this.season=index;this.seasonAge=0;this.seasonCooldown=18;this.emit('season',`${SEASONS[index].name}日已至 · ${SEASONS[index].subtitle}`);return {ok:true,text:'四季之轮已转动'};
 }
 tick(realDt){
  if(this.paused)return;const dt=Math.min(realDt,1)*this.speed;this.time+=dt;this.seasonAge+=dt;this.seasonCooldown=Math.max(0,this.seasonCooldown-dt);this.energy=clamp(this.energy+dt*(1.9+this.animals.length*.16));
  if(this.seasonAge>=240){this.season=(this.season+1)%4;this.seasonAge=0;this.emit('season',`${SEASONS[this.season].name}日悄然而至`)}
  let season=SEASONS[this.season];
  for(const t of this.tiles){
   t.water=clamp(t.water-dt*.085*season.evap*(t.plant&&['pine','willow'].includes(t.plant)?.6:1)*(this.weather?.id==='heat'?3:1));
   if(this.weather?.id==='rain')t.water=clamp(t.water+dt*.4);
   if(t.snow>0){let melt=Math.min(t.snow,dt*(this.season===3?.06:.7));t.snow-=melt;t.water=clamp(t.water+melt*.7)}
   if(this.season===3)t.snow=clamp(t.snow+dt*.03);
   if(t.plant){let [min,max]=SPECIES[t.plant].water;let happy=t.water>=min&&t.water<=max;
    t.health=clamp(t.health+dt*(happy?1.4:-.5));
    t.growth=clamp(t.growth+dt*(happy?.019*season.growth*(.8+t.soil/100)*(t.plant==='flower'&&this.animals.includes('butterfly')?1.2:1):-0.001),.03,1);
    t.soil=clamp(t.soil+dt*(t.plant==='grass'?.045:.02));
    if(t.health<=0){t.plant=null;t.growth=0;t.health=100}
   }
  }
  if(this.weather){this.weather.remaining-=dt;if(this.weather.remaining<=0)this.weather=null}
  if(this.time>=this.nextEvent){const eventIndex=Math.floor(this.time/90)%4;this.nextEvent=this.time+100;
   if(eventIndex===0||eventIndex===2){this.weather={id:'heat',name:'短暂热浪',desc:'蒸发正在加快，施放 3 次唤雨或落雪可缓解。',remaining:35,strength:3};this.emit('weather','热浪抵达 · 用雨与雪守护新芽')}
   else if(eventIndex===1){this.weather={id:'rain',name:'远海雨云',desc:'全岛水分持续上升，施放 3 次微风或暖阳可驱散。',remaining:30,strength:3};this.emit('weather','远海雨云 · 留意低地积水')}
   else{this.energy=clamp(this.energy+25);this.emit('success','流星馈赠 · 恢复 25 点精灵能量')}
  }
  let m=this.metrics();
  for(const a of ANIMALS){const present=this.animals.includes(a.id);if(a.test(m)){this.animalTimer[a.id]=Math.max(0,this.animalTimer[a.id]||0)+dt;if(!present&&this.animalTimer[a.id]>=5){this.animals.push(a.id);if(!this.discovered.includes(a.id))this.discovered.push(a.id);this.emit('animal',`${a.name}回到岛屿！`,{animal:a.id})}}else{this.animalTimer[a.id]=Math.min(0,this.animalTimer[a.id]||0)-dt;if(present&&this.animalTimer[a.id]<-40){this.animals=this.animals.filter(id=>id!==a.id);this.emit('notice',`${a.name}暂时离开了，恢复栖息地可让它回来`)}}}
  this.faunaSpreadTimer+=dt;
  if(this.faunaSpreadTimer>=24){this.faunaSpreadTimer=0;
   for(const [animal,types] of [['rabbit',['grass']],['bird',['pine','willow']]])if(this.animals.includes(animal)){
    const parents=this.tiles.filter(t=>types.includes(t.plant)&&t.growth>=.65);const parent=parents[Math.floor(seeded(this.time+types.length)*parents.length)];
    if(parent){const targets=this.neighbors(parent,2).filter(t=>!t.plant&&t.water>20);if(targets.length){const target=targets[0];target.plant=parent.plant;target.growth=.12;this.stats.spread++}}
   }
  }
  this.stable=m.vigor>=75&&m.animals>=3?this.stable+dt:0;this.checkProgress();
 }
 checkProgress(){let m=this.metrics();while(this.quest<QUESTS.length&&m[QUESTS[this.quest].key]>=QUESTS[this.quest].target){const q=QUESTS[this.quest];this.quest++;this.energy=clamp(this.energy+q.reward);this.emit('quest',`${q.name} · 完成！能量 +${q.reward}`)}if(this.quest===QUESTS.length&&!this.won){this.won=true;this.emit('win','岛屿重获新生。这里的每一阵风，都记得你。')}}
}
