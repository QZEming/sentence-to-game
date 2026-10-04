import assert from 'node:assert/strict';
import {Game} from '../dist/engine.mjs';
let auctions=0,withdrawals=0,resumes=0,maxTicks=0,minCash=120000,minAP=5,minRival=150000,mutations=0;
let rs=123;const random=()=>{rs=(rs*16807)%2147483647;return rs/2147483647;};
const optional=(fn)=>{try{fn();mutations++;}catch{}};
const invariant=g=>{assert(Number.isFinite(g.s.cash)&&g.s.cash>=0);assert(g.s.ap>=0&&g.s.ap<=g.maxAP());assert(g.s.rivalCash.every(v=>Number.isFinite(v)&&v>=0));assert.equal(new Set(g.s.inventory.map(x=>x.id)).size,g.s.inventory.length);assert(g.s.inventory.length<=g.capacity());minCash=Math.min(minCash,g.s.cash);minAP=Math.min(minAP,g.s.ap);minRival=Math.min(minRival,...g.s.rivalCash);};
for(let seed=1;seed<=600;seed++){
 let g=new Game();g.s=g.newState();g.s.seed=seed;g.makeDay();
 if(seed%11===0)g.s.cash=0;
 for(let day=1;day<=14;day++){
  for(let idx=0;idx<3;idx++){
   g.s.selected=idx;
   for(let i=0;i<3;i++)if(random()<.35)optional(()=>g.inspect(i));
   if(random()<.7)g.judge(random()<.5?'real':'fake');
   if(random()<.12){g.pass();continue;}
   if(g.s.inventory.length>=g.capacity())g.sell(g.s.inventory[0].id);
   g.begin();auctions++;let ticks=0;
   while(g.s.auction){
    const a=g.s.auction;
    if(ticks===3&&random()<.2){g=new Game(g.snapshot());g.s.auction.paused=true;const old=JSON.stringify(g.s);g.tick();assert.equal(JSON.stringify(g.s),old);g.s.auction.paused=false;resumes++;}
    if(random()<.02&&a.leader!==3){g.withdraw();withdrawals++;}
    else {if(random()<.5&&a.leader!==3)optional(()=>g.bid(random()<.1?3:1));g.tick();}
    assert(++ticks<500);invariant(g);
   }
   maxTicks=Math.max(maxTicks,ticks);
   for(const l of [...g.s.inventory]){
    if(random()<.4)optional(()=>g.certify(l.id));
    if(random()<.4)optional(()=>g.restore(l.id));
    if(random()<.2)optional(()=>g.sell(l.id,true));
    if(g.s.inventory.some(i=>i.id===l.id)&&random()<.75)g.sell(l.id);
   }
   if(random()<.08)optional(()=>g.upgrade(['eye','workshop','network'][Math.floor(random()*3)]));
   invariant(g);
  }
  g.nextDay();invariant(g);
 }
 assert(g.s.ended);assert.equal(g.s.day,14);assert.equal(g.s.marketHistory.length,14);
 const final=JSON.stringify(g.s);assert.throws(()=>g.nextDay());assert.equal(JSON.stringify(g.s),final);
}
console.log(JSON.stringify({seasons:600,auctions,withdrawals,resumes,maxTicks,minCash,minAP,minRival,mutations,negativeBalances:false,deadlocks:false,duplicateInventory:false},null,2));
