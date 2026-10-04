import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seeded, generateMaze } from '../src/maze.js';
test('200 seeded mazes have reachable treasure cells and lift, closed boundaries, and diggable soil',()=>{
  for(let seed=1;seed<=200;seed++){
    const grid=generateMaze(19,seeded(seed));
    assert.deepEqual(grid,generateMaze(19,seeded(seed)),'same seed reproduces maze');
    const visited=new Set(['1,1']),queue=[[1,1]];
    for(let at=0;at<queue.length;at++)for(const[dx,dz]of[[0,1],[0,-1],[1,0],[-1,0]]){
      let[x,z]=queue[at];x+=dx;z+=dz;const key=x+','+z;
      if(grid[z]?.[x]===0&&!visited.has(key)){visited.add(key);queue.push([x,z])}
    }
    assert.ok(visited.has('17,17'),'lift is reachable without digging');
    assert.ok(visited.size>140,'enough floor space for collectibles and enemies');
    assert.ok(grid.flat().includes(2),'diggable shortcuts exist');
    for(let z=0;z<19;z++)for(let x=0;x<19;x++){
      if(grid[z][x]===0)assert.ok(visited.has(x+','+z),'every collectible candidate is reachable');
      if(x===0||z===0||x===18||z===18)assert.equal(grid[z][x],1,'outer boundary cannot be dug');
    }
  }
});
