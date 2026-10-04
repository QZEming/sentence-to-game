import assert from 'node:assert/strict';
import {newGame,validateSave,digAction,cleanAction,placeAction,countFound,countClean,countPlaced} from './dist/game.js';
const state=newGame();let operations=0;
assert.ok(digAction(state,-1).error);assert.ok(cleanAction(state,0,0).error);assert.ok(placeAction(state,0).error);
state.energy=0;assert.ok(digAction(state,0).error);assert.equal(state.expeditions[0].dig[0],0);state.energy=100;
state.tool='scan';assert.equal(digAction(state,0).scan,true);assert.equal(state.energy,95);assert.equal(state.expeditions[0].dig[0],0);
for(let species=0;species<3;species++){
 state.species=species;const e=state.expeditions[species];state.energy=100;
 for(let i=0;i<6;i++){while(e.dig[i]<100){state.tool=e.dig[i]<60?'hammer':'brush';if(state.energy<3)state.energy=100;const result=digAction(state,i);assert.ok(!result.error);operations++;}const credits=state.credits;assert.ok(digAction(state,i).error);assert.equal(state.credits,credits);}
 assert.equal(countFound(e),6);assert.equal(e.integrity,100);
 for(let i=0;i<6;i++){for(let spot=0;spot<5;spot++){assert.ok(!cleanAction(state,i,spot).error);operations++;}assert.ok(cleanAction(state,i,0).error);}
 assert.equal(countClean(e),6);
 for(let i=0;i<6;i++){state.selected=i;state.rotation=1;assert.ok(placeAction(state,i).error);state.rotation=0;assert.ok(placeAction(state,(i+1)%6).error);const result=placeAction(state,i);assert.ok(result.placed);operations++;}
 assert.equal(countPlaced(e),6);assert.equal(e.rewarded,true);const credits=state.credits;assert.ok(placeAction(state,5).error);assert.equal(state.credits,credits);
 assert.deepEqual(validateSave(JSON.parse(JSON.stringify(state))),state);
}
assert.equal(state.discovered,18);assert.equal(state.expeditions.filter(e=>e.rewarded).length,3);
const rough=newGame();rough.tool='hammer';digAction(rough);digAction(rough);digAction(rough);assert.equal(rough.expeditions[0].integrity,95);
assert.equal(validateSave({version:99}),null);assert.equal(validateSave({version:1,expeditions:[{}, {}, {}]}),null);
const corrupt=newGame();corrupt.species=2;corrupt.energy=999;corrupt.expeditions[0].placed[0]=true;const restored=validateSave(corrupt);assert.equal(restored.species,0);assert.equal(restored.energy,100);assert.equal(restored.expeditions[0].placed[0],false);
console.log(`PASS: ${operations} gameplay actions; all 3 species excavated, cleaned, assembled and rewarded once. Energy, damage, invalid actions, save/load and corrupted-save guards passed.`);
