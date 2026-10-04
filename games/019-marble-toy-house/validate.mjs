import assert from 'node:assert/strict';
import {Game,groundAt,R} from './dist/simulation.js';
const events=[];const g=new Game((type,data)=>events.push({type,data}));g.start('adventure');
const route=[[-24,-9],[-24,4],[-17,8],[-9,8],[-9,-4],[-7,-9],[0,-9],[7,-9],[9,-4],[9,8],[17,8],[21,-1],[28,-5],[35,-5]];
for(const [x,z]of route){let steps=0;for(;steps<4200;steps++){let dx=x-g.pos.x,dz=z-g.pos.z,d=Math.hypot(dx,dz);if(d<.55||g.status==='won')break;const f=Math.min(1,d*.75);let vx=dx/(d||1)*f-g.vel.x*.12,vz=dz/(d||1)*f-g.vel.z*.12,m=Math.max(1,Math.hypot(vx,vz));g.update(1/120,{x:vx/m,z:vz/m});}assert(steps<4200,`Main route blocked at ${x},${z}`);}
assert.equal(g.status,'won');assert(g.badges.every(Boolean));assert.equal(g.deaths,0);assert.equal(g.piano,3);console.log('PASS: complete three-room route, no jump or dash needed; all badges, victory, no deaths.');
const badges=[...g.badges];g.status='playing';g.pos.z=30;g.pos.y=-8;g.update(1/120);assert.deepEqual(g.badges,badges);assert.equal(g.pos.x,g.checkpoint.x);assert.equal(g.lives,4);console.log('PASS: falling returns to the latest checkpoint and preserves badges.');
g.status='paused';const before=JSON.stringify([g.pos,g.vel,g.elapsed]);for(let i=0;i<100;i++)g.update(1/60,{x:1,jump:true,dash:true});assert.equal(JSON.stringify([g.pos,g.vel,g.elapsed]),before);console.log('PASS: pause freezes physics and timer.');
g.start('time');g.update(1/120,{dash:true,x:1});assert(g.dashCd>2.9);let cd=g.dashCd;g.update(1/120,{dash:true,x:1});assert(g.dashCd<cd);g.respawn(true);assert(g.elapsed>=5);assert.equal(g.lives,4);console.log('PASS: dash cooldown and five-second fall penalty.');
g.start('adventure');g.pos={x:-15,y:R,z:8};for(let i=0;i<360;i++)g.update(1/120,{x:1});assert(g.pos.x < -13.9);assert.deepEqual(g.badges,[false,false,false]);console.log('PASS: locked room gate prevents premature access.');
g.start('adventure');assert.equal(g.elapsed,0);assert.equal(g.collected,0);assert.equal(g.lives,5);assert.equal(g.stars.length,36);assert.equal(groundAt(0,-9),.7);console.log('PASS: fresh run clears progress; all 36 stars and piano surface are available.');
