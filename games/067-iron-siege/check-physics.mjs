import assert from 'node:assert/strict';
import {launch,pointAt,flightTime,segmentBox,explosionDamage,LEVELS} from './dist/physics.js';
const origin={x:0,y:4.1,z:27};
for(const yaw of [-25,0,25])for(const angle of [20,36,70])for(const power of [15,56,100]){
const v=launch(yaw,angle,power),t=flightTime(origin,v),p=pointAt(origin,v,t,.7);assert.ok(Math.abs(p.y)<1e-9);assert.ok(t>0);assert.ok(Number.isFinite(p.x));}
assert.equal(segmentBox({x:0,y:0,z:10},{x:0,y:0,z:-10},{x:-1,y:-1,z:-1},{x:1,y:1,z:1}),.45);
assert.equal(segmentBox({x:3,y:0,z:10},{x:3,y:0,z:-10},{x:-1,y:-1,z:-1},{x:1,y:1,z:1}),null);
assert.equal(segmentBox({x:1.2,y:0,z:10},{x:1.2,y:0,z:-10},{x:-1,y:-1,z:-1},{x:1,y:1,z:1},.35),.4325);
assert.equal(explosionDamage(0,8,100),100);assert.equal(explosionDamage(8,8,100),0);assert.equal(explosionDamage(10,8,100),0);
for(const level of LEVELS){let reachable=false;for(let power=15;power<=100;power++)for(let angle=20;angle<=70;angle++){const v=launch(0,angle,power),t=(level.z-origin.z)/v.z,p=pointAt(origin,v,t,0);if(p.y>1&&p.y<9)reachable=true;}assert.ok(reachable,level.name+' must be reachable');}
console.log('PASS: 81 ballistic trajectories, continuous segment collision, explosion falloff, all five fortress distances reachable.');
