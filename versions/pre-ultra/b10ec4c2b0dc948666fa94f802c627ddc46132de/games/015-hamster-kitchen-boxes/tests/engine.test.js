import test from 'node:test';
import assert from 'node:assert/strict';
import {LEVELS,createState,move,solve,won,gateOpen} from '../src/engine.js';
for(const [i,l] of LEVELS.entries())test(`level ${i+1} has a valid solution`,()=>{let s=createState(l);const path=solve(l,s,220000);assert.ok(path?.length,`No solution for ${l.name}`);for(const d of path){s=move(l,s,d);assert.ok(s);}assert.ok(won(s));console.log(`Level ${i+1}: ${path.length} moves`);});
test('blocked moves do not mutate state',()=>{const l=LEVELS[0],s=createState(l);s.player=[1,1];const before=JSON.stringify(s);assert.equal(move(l,s,0),null);assert.equal(JSON.stringify(s),before);});
test('ice slides boxes to the first non-ice tile',()=>{const l=LEVELS[3],s=createState(l);s.player=[6,2];const next=move(l,s,2);assert.deepEqual(next.boxes[0],[2,2]);});
test('pressure plates respond to player and boxes',()=>{const s=createState(LEVELS[4]);assert.equal(gateOpen(s),false);s.player=[3,2];assert.equal(gateOpen(s),true);s.player=[1,1];s.boxes[0]=[3,2];assert.equal(gateOpen(s),true);});
test('seeds are collected once and input state is immutable',()=>{const l=LEVELS[0],s=createState(l);s.player=[1,5];const a=move(l,s,3),b=move(l,a,2),c=move(l,b,3);assert.deepEqual(s.collected,[]);assert.deepEqual(c.collected,[0]);});

test("closed gates block passage until a switch is held",()=>{const l=LEVELS[4],s=createState(l);s.player=[4,1];assert.equal(move(l,s,1),null);s.boxes[0]=[3,2];assert.ok(move(l,s,1));});
