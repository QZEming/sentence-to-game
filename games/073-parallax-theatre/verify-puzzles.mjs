import * as THREE from './dist/vendor/three.module.js';
import {readFileSync} from 'node:fs';
const elements = new Map();
globalThis.document = {getElementById(id){if(!elements.has(id))elements.set(id,{classList:{toggle(){}},style:{},textContent:'',innerHTML:'',value:0});return elements.get(id);}};
globalThis.localStorage={getItem(){return null}};
globalThis.matchMedia=()=>({matches:true});
const source = readFileSync(new URL('./dist/game.js',import.meta.url),'utf8').replace(/^import .*?;\n/,'').replace(/\ninit\(\);\s*$/,'');
new Function('THREE', source + `
scene=new THREE.Scene();puzzle=new THREE.Group();scene.add(puzzle);
for(let i=0;i<LEVELS.length;i++){
 state.level=i;const L=LEVELS[i];state.scale=L.initial;buildPuzzle();
 camera=idealCamera(L);camera.aspect=16/9;camera.updateProjectionMatrix();
 state.theta=L.startAngle;state.phi=L.startElevation;updateCamera();
 const start=evaluate().score;
 state.theta=L.angle;state.phi=L.elevation;state.scale=L.target;updateScale();updateCamera();
 const solution=evaluate().score;
 if(solution<94)throw new Error(L.title+' is not solvable: '+solution);
 if(start>=94)throw new Error(L.title+' starts solved: '+start);
 console.log(JSON.stringify({level:i+1,title:L.title,startScore:start,solutionScore:solution}));
 disposePuzzle();
}
`)(THREE);
