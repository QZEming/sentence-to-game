import assert from 'node:assert/strict';
import {Game, ARTIFACTS} from '../dist/engine.mjs';
const make=(seed=1)=>{ const g=new Game(); g.s=g.newState();g.s.seed=seed;g.makeDay();return g; };
const blocked=(g,fn)=>{const old=JSON.stringify(g.s);assert.throws(fn);assert.equal(JSON.stringify(g.s),old);};
const drain=g=>{let t=0;while(g.s.auction){g.tick();assert(++t<500);}return t;};
const results=[];
{
 const g=make();g.s.cash=Math.ceil(g.current().start*1.06)-1;g.begin();blocked(g,()=>g.bid());g.s.cash++;g.bid();g.s.auction.caps=[0,0,0];drain(g);assert.equal(g.s.cash,0);assert.equal(g.s.inventory.length,1);blocked(g,()=>g.finish());results.push('exact funds, insufficient funds, duplicate settlement pass');
}
{
 const g=make();g.s.cash=0;g.s.ap=0;for(let i=0;i<14;i++)g.nextDay();assert(g.s.ended);assert.equal(g.s.day,14);assert.equal(g.s.cash,0);blocked(g,()=>g.nextDay());blocked(g,()=>g.begin());results.push('zero funds can finish season; day 14 is terminal; repeat finish blocked');
}
{
 const g=make();g.begin();blocked(g,()=>g.nextDay());blocked(g,()=>g.upgrade('eye'));g.s.auction.paused=true;const before=JSON.stringify(g.s);g.tick();assert.equal(JSON.stringify(g.s),before);g.withdraw();assert(!g.s.auction);results.push('active auction blocks cash operations / cross-day, paused auction stable, withdraw from pause terminates');
}
{
 const g=make();g.current().auth=false;g.begin();g.bid();g.s.auction.caps=[0,0,0];drain(g);const l=g.s.inventory[0];assert.equal(l.certified,false);const shown=g.displayedValue(l),real=g.value(l);assert(Math.abs(real-shown*.13)<=1);const before=g.s.cash;const r=g.sell(l.id);assert.equal(g.s.cash,before+real);assert.equal(r.value,real);blocked(g,()=>g.sell(l.id));results.push({fakeSale:{shown,real},doubleSale:'blocked'});
}
{
 const g=make();g.begin();g.bid();g.s.auction.caps=[0,0,0];drain(g);const l=g.s.inventory[0];g.certify(l.id);blocked(g,()=>g.certify(l.id));g.restore(l.id);blocked(g,()=>g.restore(l.id));assert(l.condition<=1);g.upgrade('eye');blocked(g,()=>g.upgrade('eye'));results.push('duplicate certificate, repair, upgrade blocked; condition capped');
}
{
 const g=make();g.judge('real');g.pass();const rep=g.s.rep;blocked(g,()=>g.pass());g.nextDay();assert.equal(g.s.rep,rep);results.push('passed judgment not scored twice on next day');
}
{
 const g=make();g.begin();g.bid();const restored=new Game(g.snapshot());assert.deepEqual(restored.s.auction,g.s.auction);restored.s.auction.paused=true;restored.s.auction.paused=false;drain(restored);assert(!restored.s.auction);assert(restored.s.cash>=0);results.push('active auction snapshot preserves bid and resolves after resume');
}
let auctions=0,maxTicks=0,minCash=120000,minRival=150000;
const strategy=[];
for(let seed=1;seed<=400;seed++){
 const g=make(seed);let certainty=0;
 for(let day=1;day<=14;day++){
  for(let index=0;index<3;index++){
   g.s.selected=index;const l=g.current();const clue=g.inspect(0);assert.equal(clue.supports,l.signals[0]);certainty++;g.judge(clue.supports?'real':'fake');
   if(!clue.supports){g.pass();continue;}
   const limit=g.displayedValue(l)*.85/1.06;g.begin();auctions++;let ticks=0;
   while(g.s.auction){const a=g.s.auction,next=a.leader<0?a.price:a.price+500;if(a.leader!==3&&next<=limit&&Math.ceil(next*1.06)<=g.s.cash)g.bid();g.tick();assert(++ticks<500);}
   maxTicks=Math.max(maxTicks,ticks);for(const x of [...g.s.inventory])g.sell(x.id);
   assert(g.s.cash>=0);assert(g.s.ap>=0);assert(g.s.rivalCash.every(c=>c>=0));minCash=Math.min(minCash,g.s.cash);minRival=Math.min(minRival,...g.s.rivalCash);
  }
  g.nextDay();
 }
 assert.equal(certainty,42);assert(g.s.correct<=42);assert(g.s.ended);assert.equal(g.s.day,14);blocked(g,()=>g.nextDay());strategy.push(g.assets());
}
strategy.sort((a,b)=>a-b);
results.push({simulation:{seasons:400,auctions,maxTicks,minCash,minRival,negativeBalances:false,deadlocks:false,observationsPerSeason:42,strategyAssets:{min:strategy[0],median:strategy[200],max:strategy.at(-1),legendary:strategy.filter(x=>x>=300000).length}}});
{
 const g=make();g.begin();g.bid();g.s.auction.caps=[0,0,0];drain(g);g.restore(g.s.inventory[0].id);assert(g.achievements().find(a=>a.name==='古物新生').done);for(let i=0;i<80;i++)g.log('another ordinary action');const retained=g.achievements().find(a=>a.name==='古物新生').done;assert(retained);results.push({repairAchievementAfterHistoryRollover:retained});
}
console.log(JSON.stringify(results,null,2));
