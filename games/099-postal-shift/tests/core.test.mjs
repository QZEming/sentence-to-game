import assert from 'node:assert/strict';
import {PostalGame,SHIFTS} from '../dist/core.mjs';
let checks=0;const test=(name,fn)=>{fn();checks++;console.log('PASS',name);};
function fresh(mode='shift'){const g=new PostalGame(()=>{},()=>.5);g.start(mode);return g;}
function advance(g){for(let i=0;i<4;i++)g.tick(.2);}
function correctly(g){const p=g.current;if(p.tags.includes('return'))g.handle('return');else{if(p.tags.includes('fragile'))g.handle('wrap');if(p.tags.some(t=>t==='blurred'||t==='heavy'))g.handle('scan');g.sort(p.route);}}
test('all four districts have one valid route',()=>{for(let route=0;route<4;route++){const g=fresh();g.current.route=route;assert.equal(g.sort(route),true);assert.equal(g.correct,1);}});
test('wrong route settles exactly once',()=>{const g=fresh();assert.equal(g.sort((g.current.route+1)%4),false);assert.equal(g.lives,4);g.sort(g.current.route);g.handle('return');assert.equal(g.lives,4);assert.equal(g.totalHandled,1);});
test('return overrides every special tag',()=>{const g=fresh();g.current.tags=['return','fragile','blurred','heavy','express'];assert.equal(g.handle('return'),true);assert.equal(g.lives,5);});
test('fragile and scan requirements must both be completed',()=>{const g=fresh();g.current.tags=['fragile','heavy'];g.handle('wrap');assert.equal(g.sort(g.current.route),false);advance(g);g.current.tags=['fragile','heavy'];g.handle('wrap');g.handle('scan');assert.equal(g.sort(g.current.route),true);});
test('repeat preparation is idempotent',()=>{const g=fresh();g.current.tags=['fragile'];assert.equal(g.handle('wrap'),true);assert.equal(g.handle('wrap'),false);assert.equal(g.lives,5);assert.equal(g.score,0);});
test('pause freezes both timers and prevents actions',()=>{const g=fresh();g.pause();const before=g.snapshot();g.tick(.2);assert.equal(g.sort(1),false);assert.deepEqual(g.snapshot(),before);g.resume();g.tick(.2);assert.ok(g.time<before.time);});
test('timeout counts once and advances',()=>{const g=fresh();g.current.remaining=.01;g.tick(.2);assert.equal(g.lives,4);const id=g.current.id;g.tick(.2);assert.equal(g.lives,4);advance(g);assert.ok(g.current.id>id);});
test('practice mode has no deadline or life loss',()=>{const g=fresh('zen');g.current.remaining=.01;g.tick(.2);assert.equal(g.current.remaining,.01);g.sort((g.current.route+1)%4);assert.equal(g.lives,5);assert.equal(g.status,'playing');});
test('upgrades only available between shifts and cannot double charge',()=>{const g=fresh();g.coins=100;assert.equal(g.buy('slow'),false);g.status='between';assert.equal(g.buy('slow'),true);assert.equal(g.coins,75);assert.equal(g.buy('slow'),false);assert.equal(g.coins,75);g.nextShift();assert.equal(g.current.limit,SHIFTS[1].limit+3);});
test('shield preserves combo once per shift but not reputation',()=>{const g=fresh();g.combo=5;g.upgrades.shield=true;g.sort((g.current.route+1)%4);assert.equal(g.combo,5);assert.equal(g.lives,4);advance(g);g.sort((g.current.route+1)%4);assert.equal(g.combo,0);assert.equal(g.lives,3);});
test('three shifts complete and rewards apply once',()=>{const g=fresh();for(let s=0;s<3;s++){for(let n=0;n<SHIFTS[s].target;n++){correctly(g);if(g.status==='playing')advance(g);}assert.equal(g.shift,s);if(s<2){assert.equal(g.status,'between');assert.ok(g.coins>0);g.nextShift();}else assert.equal(g.status,'complete');}assert.equal(g.totalCorrect,42);});
test('invalid input rejects without changing game',()=>{const g=fresh();const before=g.snapshot();assert.throws(()=>g.sort(7));assert.deepEqual(g.snapshot(),before);assert.throws(()=>g.start('unknown'));});
console.log(`${checks} gameplay checks passed`);
