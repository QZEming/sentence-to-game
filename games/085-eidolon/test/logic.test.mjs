import assert from 'node:assert/strict';
import {createState,pathTo,moveTo,swapSouls,activate,isComplete,canEnter,LEVELS} from '../dist/logic.mjs';
function walk(s,i,x,y){const p=pathTo(s,x,y,i);assert.ok(p,`level ${s.index+1}: body ${i+1} cannot get from ${s.actors[i].x},${s.actors[i].y} to ${x},${y}`);for(const [px,py] of p)assert.ok(moveTo(s,px,py,i));}
function light(s,i){assert.ok(activate(s,i).ok,`level ${s.index+1}: cannot activate for body ${i+1}`);}
let s=createState(0);
assert.equal(canEnter(s,5,8,'sun'),false);assert.equal(canEnter(s,5,8,'moon'),true);assert.equal(canEnter(s,5,4,'sun'),false);
walk(s,1,7,6);assert.equal(activate(s,1).reason,'role');assert.ok(swapSouls(s));light(s,1);walk(s,1,7,1);walk(s,0,5,6);assert.ok(swapSouls(s));walk(s,0,5,1);assert.ok(isComplete(s));assert.equal(s.swaps,2);
console.log('PASS trial 1: both bodies cross shadow barrier and powered light bridge, 2 soul exchanges');
s=createState(1);walk(s,0,3,6);walk(s,1,9,6);assert.equal(canEnter(s,9,5,'sun'),false);assert.ok(swapSouls(s));light(s,0);assert.equal(canEnter(s,9,5,'sun'),true);walk(s,1,9,2);light(s,1);walk(s,1,9,1);walk(s,0,3,1);assert.ok(isComplete(s));assert.equal(s.swaps,1);
console.log('PASS trial 2: crossed shrine locks, 1 coordinated soul exchange');
s=createState(2);walk(s,0,3,11);walk(s,1,9,11);assert.ok(swapSouls(s));light(s,0);light(s,1);walk(s,0,3,8);walk(s,1,9,8);assert.ok(swapSouls(s));light(s,0);light(s,1);walk(s,0,3,4);walk(s,1,9,4);assert.equal(isComplete(s),false);assert.ok(swapSouls(s));assert.ok(isComplete(s));assert.equal(s.swaps,3);
console.log('PASS trial 3: two paired locks and final role reversal, 3 soul exchanges');
s=createState(0);walk(s,1,5,8);assert.equal(swapSouls(s),false);assert.equal(s.swaps,0);walk(s,1,5,7);assert.ok(swapSouls(s));assert.ok(swapSouls(s));assert.equal(s.actors[1].role,'moon');assert.equal(s.actors[1].x,5);assert.equal(s.actors[1].y,7);
console.log('PASS exchanges require safe land, are reversible and preserve positions');
s=createState(0);walk(s,0,4,10);assert.equal(s.memories.size,1);walk(s,0,5,10);walk(s,0,4,10);assert.equal(s.memories.size,1);assert.equal(pathTo(s,0,0),null);
console.log('PASS memories collected once and void cannot be traversed');
for(let i=0;i<3;i++){s=createState(i);assert.equal(isComplete(s),false);assert.equal(s.lit.size,0);assert.equal(s.swaps,0);assert.equal(s.actors.length,2);for(const a of s.actors)assert.ok(canEnter(s,a.x,a.y,a.role));}
console.log('PASS all levels reset to valid starting states');
for(let i=0;i<3;i++){const l=LEVELS[i],s=createState(i);for(const [x,y] of l.memories){assert.ok(s.tiles.has(`${x},${y}`));assert.ok(!l.pillars.some(p=>p.x===x&&p.y===y),'Memory must never overlap an impassable shrine');assert.ok(canEnter(s,x,y,'sun')||canEnter(s,x,y,'moon'));}}
console.log('PASS all 9 memories occupy traversable, non-shrine tiles');
