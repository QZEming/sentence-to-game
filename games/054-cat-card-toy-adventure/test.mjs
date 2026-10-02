import assert from 'node:assert/strict';
import {fresh,start,play,end,draw,CARDS,card} from './dist/engine.mjs';
let s=fresh();start(s);assert.equal(s.hand.length,5);assert.equal(s.energy,4);
s.hand=[{id:'bunny',up:false},{id:'guard',up:false}];assert.equal(play(s,0),null);assert.equal(s.allies.length,1);assert.equal(s.energy,3);let h=s.enemies[0].hp;end(s);assert.equal(s.enemies[0].hp,h-3);assert.equal(s.turn,2);assert.equal(s.energy,3);assert.equal(s.hand.length,5);
s=fresh();start(s);s.energy=0;s.hand=[{id:'bear',up:false}];assert.equal(play(s,0),'能量不足');assert.equal(s.hand.length,1);
s.energy=10;s.allies=Array.from({length:4},()=>({kind:'bear',hp:10,maxhp:10,atk:1}));assert.match(play(s,0),/位置已满/);
s=fresh();start(s);s.hand=[{id:'rocket',up:true}];s.enemies=[{hp:18,maxhp:18,block:0}];assert.equal(play(s,0),null);assert.equal(s.phase,'reward');assert.equal(s.gold,57);
s=fresh();s.floor=8;start(s);assert.equal(s.enemies[0].kind,'boss');s.enemies[0].hp=1;s.hand=[{id:'paw',up:false}];play(s,0);assert.equal(s.phase,'won');
s=fresh();start(s);s.hp=1;s.allies=[];s.enemies=[{hp:10,atk:100,weak:0,poison:0,stun:0,intent:'attack'}];end(s);assert.equal(s.phase,'lost');
s=fresh();start(s);s.draw=[];s.hand=[];s.discard=[{id:'paw',up:false}];draw(s,5);assert.equal(s.hand.length,1);assert.equal(s.discard.length,0);
for(const id of Object.keys(CARDS)){s=fresh();start(s);s.energy=100;s.hand=[{id,up:true}];assert.equal(play(s,0),null,id);assert.ok(Number.isFinite(s.hp),id);}
console.log('PASS: draw/reshuffle, energy, summon cap, companion attacks, turn reset, upgrades, rewards, final boss, defeat, all 18 cards.');
