import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
const core=source.slice(source.indexOf('const rivals='),source.indexOf('// Input is shared'));
const nodes=new Map();const node=()=>({textContent:'',style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},focus(){},setAttribute(){}});
const $=selector=>{if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector)};
const crabs=[];const vector=()=>({set(){},setScalar(){}});
const actor=(name,color,x,z,opts={})=>{const a={name,color,x,z,vx:0,vz:0,fx:0,fz:1,angle:0,damage:0,stamina:100,maxStamina:100,rage:0,attackCd:0,dashCd:0,dashTime:0,dashHit:new Set(),block:false,stun:0,attackAnim:0,flash:0,alive:true,fall:0,aiTimer:0,aiMoveX:0,aiMoveZ:0,aiSeed:1,radius:.85,mass:1,speed:1,power:1,isPlayer:false,visual:{scale:opts.scale||1,root:{rotation:vector()}},...opts};crabs.push(a);return a;};
const context=vm.createContext({console,assert,Set,Math,$,$$:()=>[],mobile:false,rand:(a,b)=>(a+b)/2,clamp:(x,a,b)=>Math.min(b,Math.max(a,x)),localStorage:{getItem(){return 0},setItem(){}},crabs,actor,clearCrabs(){crabs.length=0},clearEffects(){},burst(){},pulse(){},floatText(){},scene:{remove(){}},arenaBoundary:{scale:vector()},arenaSurface:{scale:vector()},pickups:[],requestAnimationFrame(){},window:{}});
vm.runInContext(core+`
burst=()=>{};pulse=()=>{};floatText=()=>{};
function reset(){state='playing';mode='practice';round=1;crabs.length=0;player=actor('player','red',0,0,{isPlayer:true});const e=actor('dummy','purple',0,2.2,{speed:0});player.fx=0;player.fz=1;e.fx=0;e.fz=-1;clock=999;elapsed=0;ringRadius=7.8;pickupClock=1000;keys.clear();touch.x=touch.z=0;touch.block=false;return e;}
let tests=[];
let e=reset();assert(attack(player));assert.equal(e.damage,12);assert(e.vz>0);assert(!attack(player));assert.equal(e.damage,12);tests.push('front attack, impulse and cooldown');
e=reset();e.z=-2.2;attack(player);assert.equal(e.damage,0);tests.push('rear target rejected');
e=reset();e.block=true;const before=100;impact(player,e,6,12,'hit');assert.equal(e.damage,0);assert.equal(e.stamina,83);assert(e.vz>0&&e.vz<3);e.stamina=1;impact(player,e,6,12,'hit');assert.equal(e.stamina,0);assert.equal(e.block,false);assert(e.stun>0);tests.push('directional block and guard break');
e=reset();e.z=6;assert(dash(player));assert.equal(player.stamina,73);assert.equal(player.dashHit.size,0);assert(!dash(player));player.dashCd=0;player.stamina=0;assert(!dash(player));tests.push('dash cost and cooldown');
e=reset();assert(!ultimate(player));assert.equal(e.damage,0);player.rage=100;assert(ultimate(player));assert.equal(player.rage,0);assert.equal(e.damage,25);assert(!ultimate(player));tests.push('ultimate charge and one-shot consumption');
e=reset();player.x=8.3;step(1/120);assert(player.alive);assert.equal(player.x,-2.5);e.x=9;e.z=0;step(1/120);assert.equal(e.alive,false);assert(crabs.some(a=>a!==player&&a.alive));tests.push('practice player reset and dummy respawn');
e=reset();mode='tournament';player.x=9;e.x=-9;player.z=e.z=0;step(1/120);assert.equal(matchOutcome,'draw');assert.equal(state,'resolving');tests.push('simultaneous ring-outs resolve to a draw');
e=reset();mode='tournament';e.x=9;e.z=0;step(1/120);assert.equal(matchOutcome,'win');assert.equal(state,'resolving');tests.push('single ring-out resolves a win');
e=reset();mode='survival';elapsed=30;step(1/120);assert(ringRadius<7.8);tests.push('survival tide shrinks collision radius');
e=reset();mode='tournament';round=2;clock=15;step(1/120);assert(ringRadius<7.8);tests.push('final-30-second tide uses real collision radius');
e=reset();mode='tournament';e.speed=1;e.x=5;e.z=0;player.x=-2;for(let i=0;i<120;i++)step(1/120);assert(e.x<5);tests.push('AI pursues an opponent');
e=reset();const initial=clock;state='paused';step(1);assert.equal(clock,initial);assert.equal(player.x,0);tests.push('pause freezes simulation');
e=reset();upgrades.endurance=2;upgrades.power=1;mode='tournament';setupRound();assert.equal(player.maxStamina,150);assert.equal(player.stamina,150);assert.equal(player.power,1.16);startGame('practice');assert.equal(upgrades.power,0);assert.equal(upgrades.endurance,0);assert.equal(player.maxStamina,100);assert.equal(knockouts,0);tests.push('upgrades apply and a new run resets them');
console.log(JSON.stringify({passed:tests.length,tests},null,2));
`,context);
