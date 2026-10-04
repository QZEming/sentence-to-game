import assert from 'node:assert/strict';
import {initialState,answerCall,choose,broadcast,tune,repair,next,readSave,choiceRequirement,CALLS} from '../dist/game.js';
const play=(path,programs={})=>{const s=initialState();for(let i=0;i<6;i++){assert(answerCall(s));let c=path[i];if(choiceRequirement(s,CALLS[i].choices[c]))c=2;assert(choose(s,c));if(programs[i]){s.selected=programs[i];assert(broadcast(s));}assert(next(s));}return s;};
const good=play([0,1,0,0,0,0],{1:'evac',3:'truth',5:'music'});
assert.equal(good.ending.id,'dawn');for(let f of ['RESCUED','TRUTH_PUBLIC','EVAC_DONE'])assert(good.flags.includes(f));
assert.equal(play([0,1,0,0,0,0]).ending.id,'home');
assert.equal(play([0,1,0,0,0,2],{3:'truth'}).ending.id,'voice');
assert.equal(play([0,1,0,0,0,2]).ending.id,'listening');
let s=initialState();assert(answerCall(s));assert(choose(s,0));assert.equal(choose(s,0),false);assert(broadcast(s));let snap=JSON.stringify(s);assert.equal(broadcast(s),false);assert.equal(JSON.stringify(s),snap);assert(next(s));assert(broadcast(s));
s=initialState();assert(tune(s,93.6).clue);snap=JSON.stringify(s);assert(tune(s,93.6).repeat);assert.equal(JSON.stringify(s),snap);assert(tune(s,89.7).error);assert(repair(s));snap=JSON.stringify(s);assert.equal(repair(s),false);assert.equal(JSON.stringify(s),snap);
for(let n=0;n<729;n++){let j=n,path=[];for(let i=0;i<6;i++){path.push(j%3);j=Math.floor(j/3);}for(let programs of [{},{1:'music',3:'truth',5:'evac'},{0:'music',1:'music',2:'truth',3:'evac',4:'music',5:'truth'}]){let game=play(path,programs);assert.equal(game.phase,'ended');assert(['dawn','home','voice','listening'].includes(game.ending.id));for(let k of ['trust','signal','power'])assert(game[k]>=0&&game[k]<=100);}}
s={...initialState(),turn:5,phase:'connected',flags:['LOCATION','ORDER'],signal:32,power:18};assert(choiceRequirement(s,CALLS[5].choices[0]));s.signal=33;assert.equal(choiceRequirement(s,CALLS[5].choices[0]),'');assert(choose(s,0));assert(s.flags.includes('RESCUED'));
const broken=readSave({getItem:()=>JSON.stringify({...initialState(),phase:'ended',turn:0})});assert.equal(broken.phase,'ringing');assert.equal(readSave({getItem:()=>'{bad json'}).turn,0);
console.log('PASS: all four endings, 2,187 complete paths, rescue thresholds, duplicate-action guards, corrupted save recovery.');
