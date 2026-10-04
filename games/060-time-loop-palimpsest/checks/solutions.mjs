import fs from 'node:fs';
import assert from 'node:assert/strict';
const enginePath=new URL('../dist/engine.js',import.meta.url);
const {TimeEngine}=await import('data:text/javascript;base64,'+fs.readFileSync(enginePath).toString('base64'));
const results=[];
function walk(e,x,z,label='',options={}) {
 let steps=0; const fail=e.failures;
 while(Math.hypot(e.player.x-x,e.player.z-z)>.07&&steps++<2000){const dx=x-e.player.x,dz=z-e.player.z;e.update(1/60,{x:dx,z:dz,...options});if(e.failures!==fail)throw new Error(`hazard walking ${label} t=${e.time}`);}
 if(steps>=2000)throw new Error(`stuck ${label}: ${JSON.stringify(e.state())}`);
}
function wait(e,seconds){for(let n=0;n<Math.ceil(seconds*60);n++)e.update(1/60,{});}
function waitUntil(e,pred){for(let n=0;n<600&&!pred();n++)e.update(1/60,{});assert.ok(pred(),'wait timed out');}
function record(e,label){assert.ok(e.rewind());results.push({action:label,echoes:e.echoes.length});}
{
 const e=new TimeEngine(0);walk(e,-5,-3,'A');record(e,'L1 ghost A');walk(e,-.7,0,'gate approach');waitUntil(e,()=>e.active.A);walk(e,1,0,'cross gate');walk(e,6.5,-2.8,'exit');e.interact();assert.ok(e.won);results.push({level:1,state:e.state(),rewinds:e.rewinds,failures:e.failures});
}
{
 const e=new TimeEngine(1);walk(e,-2,3,'B');record(e,'L2 ghost B');walk(e,-6,1.5,'cube');e.interact();assert.equal(e.carrying,0);walk(e,-5,-3,'A carry');e.interact();assert.ok(e.active.A);walk(e,1.3,0,'gate approach');waitUntil(e,()=>e.active.A&&e.active.B);walk(e,3.65,0,'laser approach');waitUntil(e,()=>!e.laserActive(e.level.lasers[0])&&((e.time+e.level.lasers[0].phase)%6)<5.5);walk(e,4.6,0,'laser crossing');walk(e,7,-2.8,'exit');e.interact();assert.ok(e.won);results.push({level:2,state:e.state(),rewinds:e.rewinds,failures:e.failures});
}
{
 const e=new TimeEngine(2);walk(e,-6,-3,'A');record(e,'L3 ghost A');
 walk(e,-3.7,0,'first gate');waitUntil(e,()=>e.active.A);walk(e,-2.2,0,'first crossing');walk(e,-.5,3.7,'laser/B approach');waitUntil(e,()=>!e.laserActive(e.level.lasers[0])&&((e.time+1.8)%6)<5.5);walk(e,.8,3.7,'B');record(e,'L3 ghost B');
 walk(e,-3.7,0,'first gate');waitUntil(e,()=>e.active.A);walk(e,-.5,0,'laser approach');waitUntil(e,()=>!e.laserActive(e.level.lasers[0])&&((e.time+1.8)%6)<5.5);walk(e,.6,0,'laser crossing');walk(e,1.3,0,'second gate');waitUntil(e,()=>e.active.A&&e.active.B);walk(e,3,0,'second crossing');walk(e,4,-3.8,'C');record(e,'L3 ghost C');
 walk(e,-6.5,4.8,'cube');e.interact();assert.equal(e.carrying,0);walk(e,-3.7,0,'first gate carry');waitUntil(e,()=>e.active.A);walk(e,-.5,0,'laser carry approach');waitUntil(e,()=>!e.laserActive(e.level.lasers[0])&&((e.time+1.8)%6)<5.3);walk(e,.6,0,'laser carry crossing');walk(e,1.3,0,'second gate carry');waitUntil(e,()=>e.active.A&&e.active.B);walk(e,3,0,'second crossing carry');walk(e,4,3.3,'D carry');e.interact();waitUntil(e,()=>Object.values(e.active).every(Boolean));walk(e,5.3,0,'final gate');walk(e,7,0,'final crossing');walk(e,7.6,-2.5,'exit');e.interact();assert.ok(e.won);results.push({level:3,state:e.state(),rewinds:e.rewinds,failures:e.failures});
}
console.log(JSON.stringify(results,null,2));
