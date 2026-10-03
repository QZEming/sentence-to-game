import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,pointOnPath,PATH_LENGTH} from '../src/game.js';
import {PATH,TOWERS,PLOTS} from '../src/content.js';

test('route follows every corner and clamps endpoints',()=>{
 assert.deepEqual(pointOnPath(0),PATH[0]);assert.deepEqual(pointOnPath(PATH_LENGTH+5),PATH.at(-1));
 let progress=0;for(let i=1;i<PATH.length;i++){progress+=Math.hypot(PATH[i].x-PATH[i-1].x,PATH[i].z-PATH[i-1].z);assert.deepEqual(pointOnPath(progress),PATH[i]);}
});
test('building charges exact price and rejects occupied plots or insufficient funds',()=>{
 const g=createGame();assert.equal(g.build(0,'bear'),true);assert.equal(g.state.gold,320-TOWERS.bear.cost);assert.equal(g.build(0,'bunny'),false);g.state.gold=20;assert.equal(g.build(1,'bunny'),false);assert.equal(g.state.towers.length,1);
});
test('card then plot and plot then card both build a defender',()=>{const a=createGame();a.selectTower('bunny');a.selectPlot(0);assert.equal(a.state.towers[0].type,'bunny');const b=createGame();b.selectPlot(1);b.selectTower('cat');assert.equal(b.state.towers[0].type,'cat');});
test('upgrades increase strength and cap at level three; selling refunds 72%',()=>{
 const g=createGame();g.state.gold=1000;g.build(0,'bunny');const t=g.state.towers[0],d=t.damage,r=t.range;assert.equal(g.upgrade(),true);assert.ok(t.damage>d&&t.range>r);assert.equal(g.upgrade(),true);assert.equal(g.upgrade(),false);assert.equal(t.level,3);const expected=g.state.gold+Math.floor(t.totalSpent*.72);g.sell();assert.equal(g.state.gold,expected);assert.equal(g.state.towers.length,0);
});
test('pause stops simulation and speed changes simulation time',()=>{const g=createGame();g.build(0,'bunny');g.startWave();g.step(-1);assert.equal(g.state.time,0);assert.equal(g.state.skillFlash,0);g.pause();g.step(.1);assert.equal(g.state.time,0);g.pause();g.speed();g.step(.1);assert.equal(g.state.time,.2);});
test('skills enforce phase, cooldown and full-health restrictions',()=>{const g=createGame();assert.equal(g.skill('meteor'),false);g.build(0,'bunny');g.startWave();for(let i=0;i<10;i++)g.step(.1);assert.ok(g.state.enemies.length);const hp=g.state.enemies[0].hp;assert.equal(g.skill('meteor'),true);assert.ok(g.state.enemies[0].hp<hp);assert.equal(g.skill('meteor'),false);assert.equal(g.skill('heal'),false);g.state.hp=12;assert.equal(g.skill('heal'),true);assert.equal(g.state.hp,15);});
test('freeze prevents enemy movement for four simulation seconds',()=>{const g=createGame();g.build(7,'owl');g.startWave();for(let i=0;i<10;i++)g.step(.1);g.skill('freeze');const enemy=g.state.enemies[0],at=enemy.progress;for(let i=0;i<30;i++)g.step(.1);assert.equal(enemy.progress,at);for(let i=0;i<15;i++)g.step(.1);assert.ok(enemy.progress>at);});
test('complete wave grants rewards and moves to preparation',()=>{const g=createGame();g.build(0,'bunny');g.build(1,'bunny');g.build(3,'bunny');g.startWave();for(let i=0;i<1800&&g.state.phase==='wave';i++)g.step(.1);assert.equal(g.state.phase,'prepare');assert.equal(g.state.wave,1);assert.ok(g.state.kills>0);assert.ok(g.state.gold>80);});
test('escaped enemies damage the dream seed and can end the run',()=>{let result;const g=createGame({onEnd:r=>result=r});g.build(7,'owl');g.startWave();g.state.hp=1;for(let i=0;i<1200&&g.state.phase==='wave';i++)g.step(.1);assert.equal(g.state.phase,'defeat');assert.equal(result.won,false);});
test('blessings apply once and resume play',()=>{const g=createGame();g.build(0,'bunny');const damage=g.state.towers[0].damage;g.state.phase='relic';g.state.wave=3;assert.equal(g.chooseRelic('power'),true);assert.ok(g.state.towers[0].damage>damage);assert.equal(g.state.phase,'prepare');assert.equal(g.chooseRelic('fortune'),false);});

test('perfect defense depends on leaks, independently of healing',()=>{
 const g=createGame();g.build(0,'bunny');g.startWave();g.sell();
 for(let i=0;i<1500&&g.state.hp>17;i++)g.step(.1);
 assert.equal(g.state.hp,17);assert.equal(g.skill('meteor'),true);assert.equal(g.skill('heal'),true);g.step(.1);
 assert.equal(g.state.phase,'prepare');assert.equal(g.state.hp,20);assert.equal(g.state.perfectWaves,0);
 const b=createGame();b.build(0,'bunny');b.startWave();b.sell();
 for(let i=0;i<1500&&b.state.hp>17;i++)b.step(.1);
 b.skill('meteor');b.step(.1);for(const index of [0,1,3,5])b.build(index,'bunny');b.startWave();b.skill('heal');
 for(let i=0;i<2000&&b.state.phase==='wave';i++)b.step(.1);
 assert.equal(b.state.hp,20);assert.equal(b.state.perfectWaves,1);
});

test('a complete twelve-wave campaign is winnable with earned currency and public controls',()=>{
 let result,offered=[];const g=createGame({onEnd:r=>result=r,onRelic:items=>offered=items});
 const plan=[[0,'bunny'],[1,'bear'],[3,'cat'],[5,'bunny'],[6,'bear'],[2,'owl'],[7,'bunny'],[8,'bunny'],[9,'owl'],[4,'bunny']];
 g.speed();g.speed();
 for(let tick=0;tick<30000&&!result;tick++){
  if(g.state.phase==='relic'){assert.equal(g.chooseRelic(offered[0].id),true);}
  if(g.state.phase==='prepare'){
   for(const [index,type] of plan)if(!g.state.towers.some(t=>t.plotIndex===index)&&g.state.gold>=TOWERS[type].cost)g.build(index,type);
   for(const t of g.state.towers)while(t.level<3&&g.state.gold>=t.upgradeCost){g.selectPlot(t.plotIndex);g.upgrade();}
   assert.equal(g.startWave(),true);
  }
  if(g.state.enemies.length>=8)g.skill('meteor');
  if(g.state.enemies.some(e=>e.progress>32))g.skill('freeze');
  if(g.state.hp<=17)g.skill('heal');
  g.step(.1);
 }
 assert.ok(result,'campaign should complete');assert.equal(result.won,true);assert.equal(result.wave,12);assert.equal(g.state.relics.length,3);assert.equal(result.kills,253);assert.ok(result.hp>0);
});
