import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as THREE from 'three';
const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const levelSource=source.match(/const levels=(\[.*?\]);\n/)[1];
const levels=vm.runInNewContext(levelSource);
const cross=(ax,az,bx,bz)=>ax*bz-az*bx;
const trace=source.slice(source.indexOf('function traceLight()'),source.indexOf('function drawBeam('));
for(let index=0;index<levels.length;index++){
 const goals=levels[index].goals.map(([x,z])=>({x,z,crystal:{material:{color:{setHex(){}}}},glow:{}}));
 const mirrors=levels[index].mirrors.map(([x,z,a])=>({x,z,a}));
 const element={classList:{toggle(){}},querySelector(){return this}};
 const ctx={THREE,levels,levelIndex:index,mirrorData:mirrors,goalData:goals,segments:[],lightStates:[],beams:{},disposeGroup(){},drawBeam(){},cross,document:{querySelectorAll:()=>goals.map(()=>element)},$:()=>element,archRune:{material:{}},won:false,best:0,localStorage:{setItem(){}},savedKey:'test',setTimeout(){},chime(){}};
 vm.createContext(ctx);vm.runInContext(trace,ctx);vm.runInContext('traceLight()',ctx);
 assert.equal(ctx.won,false,`Level ${index+1} must start unsolved`);
 mirrors.forEach((m,i)=>m.a=levels[index].solution[i]);vm.runInContext('traceLight()',ctx);
 assert.equal(ctx.won,true,`Level ${index+1} is solvable`);assert.ok(goals.every(g=>g.lit));
 console.log(`PASS Level ${index+1}: ${mirrors.length} mirrors, ${ctx.segments.length} beam segments, all 3 crystals lit`);
}
