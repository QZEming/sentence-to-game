import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parseLevel,move,won,solve,doorOpen,pos,deadlocked} from '../dist/engine.mjs';
const levels=JSON.parse(fs.readFileSync(new URL('../dist/levels.json',import.meta.url)));
for(const l of levels){
 const {board,state}=parseLevel(l);let current=state,slides=0,doors=0;const snapshot=JSON.stringify(state);
 assert.equal(move(board,state,'invalid'),null);
 for(const direction of l.solution){const next=move(board,current,direction);assert.ok(next,l.name+' solution must be legal');slides+=next.slide>0;doors+=doorOpen(board,current)!==doorOpen(board,next);current=next;}
 assert.ok(won(board,current));assert.equal(JSON.stringify(state),snapshot,'moves must not mutate undo snapshots');
 const hint=await solve(board,state);assert.equal(hint.status,'solved');let hinted=state;
 for(const d of hint.path){hinted=move(board,hinted,d);assert.ok(hinted,'hint directions must be legal');}
 assert.ok(won(board,hinted));
 console.log(`PASS ${l.id}. ${l.name}: ${current.moves} solution steps; ${slides} ice slides; ${doors} gate transitions; hint verified`);
}
const {board,state}=parseLevel({map:['#####','#@  #','# $ #','# . #','#####']});
assert.equal(move(board,state,'U'),null,'walls block movement');
const p=move(board,state,'R');const push=move(board,p,'D');assert.ok(won(board,push),'push to target');
assert.equal(p.moves,1);assert.equal(push.moves,2);assert.notDeepEqual(push.boxes,p.boxes);
console.log('PASS blocking, immutable state, move counts, and completion');
