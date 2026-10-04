import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createGame,act,chance,KINGDOMS,allies} from '../dist/game.mjs';
test('invalid actions do not mutate resources or spend actions',()=>{
 const s=createGame(32917),before=structuredClone(s);
 for(const [type,p] of [['gift',{id:'verdant'}],['sail',{id:'missing'}],['event',{choice:0}],['negotiate',{id:'coral',stance:'peace',offer:0}]])assert.equal(act(s,type,p).ok,false);
 assert.deepEqual(s,before);
});
test('zero resources and unresolved events always have a recovery path',()=>{
 const s=createGame(32917);s.gold=0;s.supply=0;
 assert.equal(act(s,'sail',{id:'coral'}).ok,false);
 const r=act(s,'resupply').state;assert.equal(r.supply,6);assert.equal(r.gold,8);assert.equal(r.ap,2);
 s.event=4;assert.equal(act(s,'event',{choice:0}).ok,false);assert.equal(act(s,'event',{choice:-1}).state.event,null);assert.equal(act(s,'end').ok,false);
});
test('one-time rewards, AP, deadline and crisis are enforced',()=>{
 const s=createGame(32917);s.location='moon';s.kingdoms.moon.quest=true;s.kingdoms.moon.trade=true;
 assert.equal(act(s,'quest',{id:'moon'}).ok,false);assert.equal(act(s,'negotiate',{id:'moon',pact:'trade',stance:'peace',offer:0}).ok,false);
 s.ap=0;assert.equal(act(s,'speech').ok,false);assert.equal(act(s,'end').state.ap,3);
 s.storm=99;assert.equal(act(s,'end').state.result,'defeat');s.storm=0;s.turn=24;assert.equal(act(s,'end').state.result,'defeat');
 const ended=act(s,'end').state;assert.equal(act(ended,'resupply').ok,false);
});
test('intelligence, offers, retry bonuses and rivalry affect probability',()=>{
 const s=createGame(32917),base=chance(s,'coral','trade');s.kingdoms.coral.retries=1;assert.equal(chance(s,'coral','trade'),base+8);
 s.kingdoms.coral.intel=true;assert.equal(chance(s,'coral','trade'),base+20);
 s.kingdoms.iron.allied=true;assert.equal(chance(s,'coral','trade'),base+5);
 s.mediated=true;assert.equal(chance(s,'coral','trade'),base+20);
 assert.ok(chance(s,'coral','defense',25)>=chance(s,'coral','trade'));
});
test('a complete deterministic expedition can reach four alliances and victory',()=>{
 let s=createGame(32917);
 function step(type,p={}){const r=act(s,type,p);assert.equal(r.ok,true,r.error);s=r.state;}
 for(const d of KINGDOMS.filter(k=>k.id!=='iron')){
  let guard=0;
  while(!s.kingdoms[d.id].allied&&!s.result&&guard++<60){
   if(s.event!==null){step('event',{choice:-1});continue;}
   if(s.ap===0){step('end');continue;}
   if(s.location!==d.id){step(s.supply<2?'resupply':'sail',{id:d.id});continue;}
   const k=s.kingdoms[d.id];
   if(s.gold<45){step('resupply');continue;}
   if(!k.quest){step(d.questCost.supply&&s.supply<d.questCost.supply?'resupply':'quest',{id:d.id});continue;}
   if(k.relation<55){step(k.giftTurn!==s.turn?'gift':'speech',{id:d.id});continue;}
   step('negotiate',{id:d.id,stance:d.stance,offer:25,pact:'alliance'});
  }
 }
 assert.equal(s.result,'victory');assert.equal(allies(s),4);assert.ok(s.turn<=24);assert.ok(s.renown>=65);
 console.log(`Verified victory on turn ${s.turn}, renown ${s.renown}, allies ${allies(s)}`);
});
