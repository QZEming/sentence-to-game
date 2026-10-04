import fs from 'node:fs';
import assert from 'node:assert/strict';
const {TimeEngine}=await import('data:text/javascript;base64,'+fs.readFileSync(new URL('../dist/engine.js',import.meta.url)).toString('base64'));
function walk(e,x,z){for(let i=0;i<1500;i++){if(Math.hypot(e.player.x-x,e.player.z-z)<.07)return; e.update(1/60,{x:x-e.player.x,z:z-e.player.z});}throw new Error('walk stuck');}
function wait(e,n){for(let i=0;i<n;i++)e.update(1/60,{});}
const results=[];
// Fully legal recording and walking reproduce a gate closing onto the player.
{
 const e=new TimeEngine(0);walk(e,-5,-3);walk(e,-3.9,-3);e.rewind();walk(e,-.65,0);
 for(let i=0;i<100;i++)e.update(1/60,{x:1,z:0});
 const trapped={...e.player},doorOpen=e.gateOpen(e.level.walls[0]);
 for(const input of [{x:1},{x:-1},{z:1},{z:-1}])for(let i=0;i<60;i++)e.update(1/60,input);
 const after={...e.player};assert.ok(trapped.x>.6,'player must cross the closing gate safely');results.push({case:'closing gate',doorOpen,trapped,after,stuck:Math.abs(trapped.x)<.58&&Math.hypot(after.x-trapped.x,after.z-trapped.z)<.001});
}
// Timeout restores cube and preserves saved echoes and optional collectibles.
{
 const e=new TimeEngine(1);walk(e,-2,3);e.rewind();walk(e,-6,1.5);e.interact();walk(e,-5,-3);e.interact();const moved={...e.cubes[0]};
 wait(e,4000);results.push({case:'timeout',failures:e.failures,echoes:e.echoes.length,originalCube:e.level.cubes[0],restoredCube:e.cubes[0],movedCube:moved,carrying:e.carrying});
 assert.equal(e.failures,1);assert.equal(e.echoes.length,1);assert.deepEqual(e.cubes,e.level.cubes);
}
// Three-echo limit, undo, and reset retain the intended invariant.
{
 const e=new TimeEngine(0);for(let i=0;i<3;i++){wait(e,60);assert.ok(e.rewind());}wait(e,60);assert.equal(e.rewind(),false);assert.equal(e.echoes.length,3);e.undo();assert.equal(e.echoes.length,2);assert.equal(e.time,0);e.load(0);assert.equal(e.echoes.length,0);results.push({case:'echo budget / undo / level reset',passed:true});
}
// Cube pickup is possible across a closed wall if the object is near it.
{
 const e=new TimeEngine(1);walk(e,-2,3);e.rewind();walk(e,-6,1.5);e.interact();walk(e,-5,-3);e.interact();walk(e,1.3,0);walk(e,2.7,0);walk(e,3.3,0);
 // This targeted geometry test does not claim the state is reachable by the standard solution.
 e.echoes=[];e.echoPositions=[];e.player={x:2.6,z:0,angle:0};e.cubes=[{x:1.4,z:0}];e.updatePlates();e.interact();assert.equal(e.carrying,-1,'closed gate blocks pickup');results.push({case:'pickup across closed door',doorOpen:e.gateOpen(e.level.walls[0]),carrying:e.carrying===0});
}
console.log(JSON.stringify(results,null,2));
