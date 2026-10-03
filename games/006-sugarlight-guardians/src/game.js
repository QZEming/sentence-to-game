import { PATH, PLOTS, TOWERS, ENEMIES, WAVES, CHAPTERS, RELICS, SKILLS } from './content.js';

const SEGMENTS = PATH.slice(1).map((p,i)=>Math.hypot(p.x-PATH[i].x,p.z-PATH[i].z));
const RELIC_GROUPS = [[0,1,2],[4,3,2],[0,4,1]];
export const PATH_LENGTH = SEGMENTS.reduce((a,b)=>a+b,0);
export function pointOnPath(distance) {
  let remaining = Math.max(0,distance);
  for(let i=0;i<SEGMENTS.length;i++) {
    if(remaining <= SEGMENTS[i]) { const f=remaining/SEGMENTS[i]; return {x:PATH[i].x+(PATH[i+1].x-PATH[i].x)*f,z:PATH[i].z+(PATH[i+1].z-PATH[i].z)*f}; }
    remaining-=SEGMENTS[i];
  }
  return {...PATH.at(-1)};
}
export function createGame(events={}) {
  let serial=0, spawnQueue=[], spawnTimer=0, waveLeaks=0, randomSeed=2103;
  const random=()=>{randomSeed=(randomSeed*1664525+1013904223)>>>0;return randomSeed/4294967296;};
  const state={phase:'prepare',wave:0,hp:20,maxHp:20,gold:320,kills:0,towers:[],enemies:[],projectiles:[],effects:[],selectedPlot:null,selectedTowerType:null,cooldowns:{meteor:0,freeze:0,heal:0},paused:false,speed:1,muted:true,relics:[],chapter:CHAPTERS[0],time:0,elapsed:0,spawned:0,totalToSpawn:0,skillFlash:0,nextWaveHint:'第 1 波 · 7 只迷路绒团',perfectWaves:0,stars:0};
  function notify(message){events.onToast?.(message);}
  function effect(type,x,z,color,life=.65) {state.effects.push({id:++serial,type,x,z,color,life,maxLife:life}); if(state.effects.length>90)state.effects.splice(0,state.effects.length-90);}
  function relicAmount(id){return state.relics.filter(r=>r===id).length;}
  function updateTower(t){
    const def=TOWERS[t.type];
    t.damage=Math.round(def.damage*Math.pow(1.73,t.level-1)*(1+.18*relicAmount('power')));
    t.range=(def.range+(t.level-1)*.28)*(1+.15*relicAmount('range'));
    t.rate=def.rate*Math.pow(.88,t.level-1)/ (1+.16*relicAmount('haste'));
    t.upgradeCost=t.level<3?Math.round(def.cost*(.6+t.level*.5)):null;
    t.income=def.income?(def.income+(t.level-1)*4):0;
  }
  function build(index,type){
    if(!TOWERS[type]||!PLOTS[index]||state.towers.some(t=>t.plotIndex===index)||['victory','defeat','relic'].includes(state.phase))return false;
    if(state.gold<TOWERS[type].cost){notify('星露还不够，再收集一些吧。');return false;}
    state.gold-=TOWERS[type].cost;
    const t={id:++serial,plotIndex:index,type,level:1,...PLOTS[index],totalSpent:TOWERS[type].cost,shotTimer:.2,incomeTimer:7,shotAt:-100,targetX:0,targetZ:0};
    updateTower(t);state.towers.push(t);state.selectedPlot=index; effect('build',t.x,t.z,TOWERS[type].color,1);events.onSound?.('build');
    notify(`${TOWERS[type].name}加入守夜队！`);return true;
  }
  function selectTower(type){ if(!TOWERS[type])return;state.selectedTowerType=type; if(state.selectedPlot!==null&&!state.towers.some(t=>t.plotIndex===state.selectedPlot))build(state.selectedPlot,type); }
  function selectPlot(index){ if(!PLOTS[index])return;state.selectedPlot=index;const exists=state.towers.some(t=>t.plotIndex===index);if(!exists&&state.selectedTowerType)build(index,state.selectedTowerType); }
  function upgrade(){
    const t=state.towers.find(t=>t.plotIndex===state.selectedPlot); if(!t||t.level>=3||['relic','victory','defeat'].includes(state.phase))return false;
    if(state.gold<t.upgradeCost){notify('升级需要更多星露。');return false;}
    state.gold-=t.upgradeCost;t.totalSpent+=t.upgradeCost;t.level++; updateTower(t);effect('build',t.x,t.z,'#fff2a6',1);events.onSound?.('upgrade');notify(`${TOWERS[t.type].name} · ${TOWERS[t.type].upgrade[t.level-2]}`);return true;
  }
  function sell(){const t=state.towers.find(t=>t.plotIndex===state.selectedPlot);if(!t||['relic','victory','defeat'].includes(state.phase))return false;const refund=Math.floor(t.totalSpent*.72);state.gold+=refund;state.towers.splice(state.towers.indexOf(t),1);state.selectedTowerType=null;effect('build',t.x,t.z,'#fff2a6');notify(`伙伴去休息啦，返还 ${refund} 星露。`);events.onSound?.('coin');return true;}
  function startWave(){
    if(state.phase!=='prepare')return false;
    if(state.towers.length===0){notify('先点击守卫卡，再点击花园中的空地建造。');return false;}
    state.wave++;state.phase='wave';state.paused=false;state.spawned=0;waveLeaks=0;
    const def=WAVES[state.wave-1];spawnQueue=[];
    for(let i=0;i<def.length;i+=2)for(let n=0;n<def[i+1];n++)spawnQueue.push(def[i]);
    for(let i=spawnQueue.length-1;i>0;i--){let j=Math.floor(random()*(i+1));[spawnQueue[i],spawnQueue[j]]=[spawnQueue[j],spawnQueue[i]];}
    if(state.wave===12){spawnQueue=spawnQueue.filter(k=>k!=='boss');spawnQueue.splice(9,0,'boss');}
    state.totalToSpawn=spawnQueue.length;spawnTimer=.8;
    state.chapter=CHAPTERS.filter(c=>c.wave<=state.wave).at(-1);state.nextWaveHint=waveHint(state.wave);events.onSound?.('wave');notify(`第 ${state.wave} 波 · ${state.wave===12?'大毛球出现了！':'守夜队，准备！'}`);return true;
  }
  function waveHint(wave){if(wave>12)return '月芽花园迎来黎明';const data=WAVES[wave-1];return `第 ${wave} 波 · `+data.filter((_,i)=>i%2===0).map((k,i)=>`${ENEMIES[k].name} ×${data[i*2+1]}`).join(' / ');}
  function spawn(kind){
    const def=ENEMIES[kind],scale=1+(state.wave-1)*.14+Math.max(0,state.wave-6)*.12;
    const maxHp=Math.round(def.hp*scale);
    state.enemies.push({id:++serial,kind,...pointOnPath(0),progress:0,hp:maxHp,maxHp,speed:def.speed*(state.wave>=9?1.06:1),slowUntil:0,slowFactor:.55,freezeUntil:0,hitUntil:0,healTimer:2.4});state.spawned++;
  }
  function damage(enemy,amount,ignoreArmor=false,armorPierce=0){
    if(enemy.hp<=0)return; enemy.hp-=amount*(ignoreArmor?1:1-(ENEMIES[enemy.kind].armor||0)*(1-armorPierce));enemy.hitUntil=state.time+.12;
    if(enemy.hp<=0){state.gold+=ENEMIES[enemy.kind].reward;state.kills++;effect('pop',enemy.x,enemy.z,ENEMIES[enemy.kind].color,.65);events.onSound?.('pop');}
  }
  function skill(id){
    if(!SKILLS[id]||state.phase!=='wave'||state.paused)return false;
    if(state.cooldowns[id]>0){notify('星光正在充能，再等一会儿。');return false;}
    if(id==='heal'&&state.hp>=state.maxHp){notify('梦种生命已满，先留着这份祝福吧。');return false;}
    if(id==='meteor') { for(const e of state.enemies){damage(e,100+state.wave*12,true);effect('meteor',e.x,e.z,'#ffe395',1);}state.skillFlash=.7; }
    if(id==='freeze'){for(const e of state.enemies)e.freezeUntil=state.time+4;effect('freeze',0,0,'#bbecff',1.2);}
    if(id==='heal'){state.hp=Math.min(state.maxHp,state.hp+3);effect('heal',11,-2,'#b5f3a8',1.5);}
    state.cooldowns[id]=SKILLS[id].cooldown;events.onSound?.('skill');notify(`${SKILLS[id].name}！`);return true;
  }
  function finishWave(){
    const perfect=waveLeaks===0;const bonus=45+state.wave*7+(perfect?20:0);state.gold+=bonus;if(perfect)state.perfectWaves++;
    state.projectiles=[];events.onSound?.('clear');
    if(state.wave>=12){state.phase='victory';state.stars=state.hp>=16?3:state.hp>=8?2:1;events.onEnd?.({won:true,...summary()});return;}
    state.nextWaveHint=waveHint(state.wave+1);state.chapter=CHAPTERS.filter(c=>c.wave<=state.wave+1).at(-1);
    notify(`第 ${state.wave} 波结束${perfect?' · 完美守护':''}！获得 ${bonus} 星露。`);
    if(state.wave%3===0){state.phase='relic';events.onRelic?.(RELIC_GROUPS[state.wave/3-1].map(i=>RELICS[i]));}
    else state.phase='prepare';
  }
  function chooseRelic(id){if(state.phase!=='relic'||!RELIC_GROUPS[state.wave/3-1]?.some(i=>RELICS[i].id===id))return false;state.relics.push(id);if(id==='fortune')state.gold+=150;if(id==='heart')state.hp=Math.min(state.maxHp,state.hp+5);state.towers.forEach(updateTower);state.phase='prepare';events.onSound?.('upgrade');notify(`获得祝福：${RELICS.find(r=>r.id===id).name}`);return true;}
  function summary(){return {hp:state.hp,kills:state.kills,wave:state.wave,stars:state.stars,elapsed:state.elapsed,perfectWaves:state.perfectWaves,towers:state.towers.length};}
  function step(realDt){
    if(state.paused||['relic','victory','defeat'].includes(state.phase))return;
    const dt=Math.max(0,Math.min(realDt,.1))*state.speed;state.time+=dt;
    state.effects.forEach(e=>e.life-=dt);state.effects=state.effects.filter(e=>e.life>0);state.skillFlash=Math.max(0,state.skillFlash-dt);
    if(state.phase!=='wave')return;
    state.elapsed+=dt;
    for(const id in state.cooldowns)state.cooldowns[id]=Math.max(0,state.cooldowns[id]-dt);
    spawnTimer-=dt;
    if(spawnQueue.length&&spawnTimer<=0){spawn(spawnQueue.shift());spawnTimer=Math.max(.45,1.05-state.wave*.035);}
    for(const e of state.enemies){
      if(e.hp<=0)continue;
      if(e.kind==='healer'){e.healTimer-=dt;if(e.healTimer<=0){e.healTimer=2.4;for(const nearby of state.enemies)if(nearby.hp>0&&Math.hypot(nearby.x-e.x,nearby.z-e.z)<2.5)nearby.hp=Math.min(nearby.maxHp,nearby.hp+ENEMIES.healer.heal*(1+state.wave*.08));effect('heal',e.x,e.z,'#ffc1db',.7);}}
      const movement=e.freezeUntil>state.time?0:e.slowUntil>state.time?e.slowFactor:1;
      e.progress+=e.speed*movement*dt;Object.assign(e,pointOnPath(e.progress));
      if(e.progress>=PATH_LENGTH){waveLeaks++;state.hp=Math.max(0,state.hp-ENEMIES[e.kind].leak);e.escaped=true;e.hp=0;effect('leak',e.x,e.z,'#eb8e89',1);events.onSound?.('hurt');}
    }
    if(state.hp<=0){state.phase='defeat';events.onEnd?.({won:false,...summary()});return;}
    for(const t of state.towers){
      if(t.income){t.incomeTimer-=dt;if(t.incomeTimer<=0){t.incomeTimer=7;state.gold+=t.income;effect('coin',t.x,t.z,'#ffe191',.85);events.onSound?.('coin');}}
      t.shotTimer-=dt;if(t.shotTimer>0)continue;
      let target=null;for(const e of state.enemies)if(e.hp>0&&Math.hypot(e.x-t.x,e.z-t.z)<=t.range&&(!target||e.progress>target.progress))target=e;
      if(!target)continue;
      t.shotTimer=t.rate;t.shotAt=state.time;t.targetX=target.x;t.targetZ=target.z;
      state.projectiles.push({id:++serial,type:t.type,x:t.x,z:t.z,y:1.55,startX:t.x,startZ:t.z,targetX:target.x,targetZ:target.z,targetId:target.id,damage:t.damage,level:t.level,age:0,duration:Math.max(.18,Math.hypot(target.x-t.x,target.z-t.z)/(t.type==='bear'?7:13))});events.onSound?.('shoot');
    }
    for(const p of state.projectiles){
      p.age+=dt;let target=state.enemies.find(e=>e.id===p.targetId&&e.hp>0);if(target){p.targetX=target.x;p.targetZ=target.z;}
      const f=Math.min(1,p.age/p.duration);p.x=p.startX+(p.targetX-p.startX)*f;p.z=p.startZ+(p.targetZ-p.startZ)*f;p.y=1.4-f*.8+(p.type==='bear'?Math.sin(f*Math.PI)*2:Math.sin(f*Math.PI)*.4);
      if(f>=1){p.done=true;if(p.type==='bear'){for(const e of state.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.z-p.z)<TOWERS.bear.splash+(p.level-1)*.15)damage(e,p.damage,false,.5);effect('splash',p.x,p.z,TOWERS.bear.color,.5);}else if(target){damage(target,p.damage);if(p.type==='cat'){target.slowUntil=state.time+2.5;target.slowFactor=.55-(p.level-1)*.05;effect('slow',target.x,target.z,'#a3e1e0',.35);}}}
    }
    state.projectiles=state.projectiles.filter(p=>!p.done);state.enemies=state.enemies.filter(e=>e.hp>0);
    if(!spawnQueue.length&&!state.enemies.length)finishWave();
  }
  return {state,step,build,selectPlot,selectTower,upgrade,sell,startWave,skill,chooseRelic,summary,pause(){state.paused=!state.paused;},speed(){state.speed=state.speed===3?1:state.speed+1;},closeSelection(){state.selectedPlot=null;state.selectedTowerType=null;}};
}
