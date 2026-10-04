import assert from 'node:assert/strict';
import {DreamGame} from './dist/engine.js';
for(let level=0;level<3;level++){
 const g=new DreamGame(level);
 // A constructive solver verifies every objective can be reached through legal moves.
 if(g.config.phase)g.shift();
 const targets=[...(g.config.key!==undefined?[g.config.key]:[]),...g.config.shards,g.config.exit];
 for(const target of targets){let guard=0;while(g.player!==target){assert(++guard<25);const a=g.rooms[g.player].pos,b=g.rooms[target].pos;const d=a%3!==b%3?(a%3<b%3?1:3):(a<b?2:0);const next=g.roomAt(g.neighbor(a,d));assert(next);g.selected=g.player;for(let n=0;!g.doors(g.player).includes(d)&&n<4;n++)g.rotate();g.selected=next.id;for(let n=0;!g.doors(next.id).includes((d+2)%4)&&n<4;n++)g.rotate();const result=g.move(next.id);assert(result.ok,result.message);}}
 assert(g.won);assert.equal(g.collected.length,g.config.shards.length);assert(g.undo());assert(!g.won);console.log(`Chapter ${level+1}: all objectives reachable; victory and undo verified`);
}
const g=new DreamGame(2);const before=g.snapshot();g.selected=8;assert(g.swap(7));assert.equal(g.rooms[8].pos,7);assert(g.undo());assert.deepEqual(g.snapshot(),before);assert(!g.swap(0));g.player=2;assert(g.teleport());assert.equal(g.player,6);g.undo();assert.equal(g.player,2);console.log('Swap adjacency, swap undo, portal and portal undo verified');
const p=new DreamGame(1);assert(!p.isActive(1));p.shift();assert(p.isActive(1));p.undo();assert(!p.isActive(1));console.log('Phase transitions and undo verified');
