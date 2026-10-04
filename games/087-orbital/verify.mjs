import assert from 'node:assert/strict';
import { createState, step, burn, norm, predict, score } from './dist/sim.js';
let checks=0;
function check(name,fn){fn();checks++;console.log('PASS',name);}
check('automatic standard and limited-fuel supply missions can dock',()=>{for(const mission of ['standard','resupply']){const s=createState(mission);s.autopilot=true;for(let i=0;i<22000&&s.status==='flying';i++)step(s,.025);assert.equal(s.status,'docked');assert(s.fuel>0);assert(score(s)>700);}});
check('prediction agrees with the flight integrator',()=>{const s=createState();const dv=[-1.14,2.04,-.08],end=predict(s,dv).at(-1);assert(burn(s,dv));for(let i=0;i<19200;i++)step(s,.025);assert(norm(s.r.map((x,i)=>x-end[i]))<.001);});
check('coasting conserves propellant and does not add artificial drag',()=>{const s=createState();s.v=[0,1,0];const f=s.fuel;for(let i=0;i<40;i++)step(s,.025);assert.equal(s.fuel,f);assert(norm(s.v)>.99);});
check('pause freezes simulation and fuel',()=>{const s=createState();s.paused=true;const before=JSON.stringify(s);step(s,1,{KeyW:true});assert.equal(JSON.stringify(s),before);});
check('insufficient propellant limits thrust without going negative',()=>{const s=createState();s.fuel=.0001;step(s,.025,{KeyW:true,KeyR:true});assert(s.fuel>=0);assert(norm(s.v)<.001);});
check('full attitude rotations are normalized for capture',()=>{for(const yaw of[0,360,-360]){const s=createState();s.r=[0,-.4,0];s.v=[0,0,0];s.yaw=yaw;s.fuel=0;for(let i=0;i<85;i++)step(s,.025);assert.equal(s.status,'docked');}});
check('fast impact and invalid approach cannot dock',()=>{const s=createState();s.r=[0,-.1,0];s.v=[0,10,0];s.yaw=0;step(s,.025);assert.equal(s.status,'failed');const b=createState();b.r=[3,-.3,0];b.yaw=0;for(let i=0;i<100;i++)step(b,.025);assert.notEqual(b.status,'docked');});
check('night mission assistance expires after its allowed duration',()=>{const s=createState('night');s.autopilot=true;for(let i=0;i<850;i++)step(s,.025);assert.equal(s.autopilot,false);assert(s.assistUsed>=20&&s.assistUsed<20.1);});
console.log(`${checks} checks passed.`);
