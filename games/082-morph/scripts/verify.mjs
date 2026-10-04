import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as RealThree from '../dist/vendor/three.module.js';
import {LEVELS,FORMS} from '../dist/levels.js';
const elems=new Map();function element(){return {classList:{add(){},remove(){},toggle(){},contains(){return false}},style:{},setAttribute(){},addEventListener(){},querySelector(){return element()},appendChild(){},getBoundingClientRect(){return{width:1280,height:480}},showModal(){this.open=true},close(){this.open=false},textContent:'',innerHTML:'',open:false}}
const document={querySelector(q){if(!elems.has(q))elems.set(q,element());return elems.get(q)},querySelectorAll(){return []},addEventListener(){}};
class Renderer{constructor(){this.domElement=element();this.shadowMap={}}setPixelRatio(){}setSize(){}render(){}}
let clock=0;const ctx=vm.createContext({THREE:{...RealThree,WebGLRenderer:Renderer},LEVELS,FORMS,document,window:{devicePixelRatio:1,addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},performance:{now(){return clock}},requestAnimationFrame(){},setTimeout(){return 1},clearTimeout(){},AbortController,console});
let source=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
source+='\nthis.api={buildLevel,setForm,interact,blocked,at,frame,updateCircuits,get player(){return player},get gates(){return gates},get cubes(){return cubes},get plates(){return plates},get crystals(){return crystals},get portal(){return portal},get won(){return won},get switches(){return switches},get lasers(){return lasers},get paused(){return paused},get elapsed(){return elapsed},closeModal,togglePause,get keys(){return keys},get checkpoint(){return lastCheckpoint},get deaths(){return deaths},get save(){return save},get scene(){return scene}};';
vm.runInContext(source,ctx);const api=ctx.api;
function tick(n=1){for(let i=0;i<n;i++){clock+=16;api.frame(clock)}}
function pos(c,r){Object.assign(api.player,api.at(c,r))}
function find(ch,map){for(let r=0;r<map.length;r++)for(let c=0;c<map[r].length;c++)if(map[r][c]===ch)return[c,r]}
let checks=0;function check(x,msg){assert.ok(x,msg);checks++}
for(let li=0;li<LEVELS.length;li++){
 api.buildLevel(li);const map=LEVELS[li].map;check(map.every(row=>row.length===map[0].length),`L${li+1} rectangle`);check(!api.blocked(api.player.x,api.player.z),`L${li+1} valid spawn`);
 for(const kind of ['F','T']){const p=find(kind,map);if(!p)continue;const {x,z}=api.at(...p),form=kind==='F'?1:2;check(api.blocked(x,z,0),`L${li+1} ${kind} blocks blob`);check(!api.blocked(x,z,form),`L${li+1} ${kind} accepts form`);const horizontal=map[p[1]][p[0]-1]!=='#'&&map[p[1]][p[0]+1]!=='#';for(let t=-1;t<=1;t+=.1){check(!api.blocked(x+(horizontal?t:0),z+(horizontal?0:t),form),`L${li+1} ${kind} continuous passage t=${t}`)}pos(...p);api.player.form=form;check(!api.setForm(0),`L${li+1} prevents expansion inside slit`)}
 api.buildLevel(li);
 for(const cube of [...api.cubes]){
  const plate=api.plates.find(p=>p.channel===cube.channel);api.player.form=0;api.player.x=cube.x;api.player.z=cube.z+1;api.interact();check(api.player.carry===cube,`L${li+1} pick ${cube.channel}`);check(!api.setForm(1),`L${li+1} carry prevents flat`);
  // Stand exactly on plate: previous implementation softlocked here.
  api.player.x=plate.x;api.player.z=plate.z;api.interact();check(api.player.carry===null,`L${li+1} dropped`);check(plate.active,`L${li+1} plate active`);check(!api.blocked(api.player.x,api.player.z),`L${li+1} player not trapped by snapped cube`);check(api.gates.find(g=>g.channel===cube.channel).open,`L${li+1} gate opens`);
 }
 // With the designed circuits powered, every crystal and exit must be reachable.
 const queue=[{...api.at(...find('S',map)),c:find('S',map)[0],r:find('S',map)[1],f:0}],seen=new Set();while(queue.length){const p=queue.shift(),key=`${p.c},${p.r},${p.f}`;if(seen.has(key))continue;seen.add(key);for(const f of [0,1,2])if(!api.blocked(p.x,p.z,f)&&!(map[p.r][p.c]==='~'&&f!==1))queue.push({...p,f});for(const [dc,dr]of [[1,0],[-1,0],[0,1],[0,-1]]){const c=p.c+dc,r=p.r+dr;if(!map[r]?.[c])continue;const dest=api.at(c,r);let valid=true;for(let k=1;k<=16;k++){const x=p.x+(dest.x-p.x)*k/16,z=p.z+(dest.z-p.z)*k/16;if(api.blocked(x,z,p.f)||(map[r][c]==='~'&&p.f!==1)){valid=false;break}}if(valid)queue.push({...dest,c,r,f:p.f})}}
 for(let r=0;r<map.length;r++)for(let c=0;c<map[r].length;c++)if(['*','X'].includes(map[r][c]))check([0,1,2].some(f=>seen.has(`${c},${r},${f}`)),`L${li+1} target ${c},${r} reachable`);
 for(const c of api.crystals){api.player.x=c.x;api.player.z=c.z;tick()};check(api.crystals.every(c=>c.collected),`L${li+1} collection works`);api.player.x=api.portal.x;api.player.z=api.portal.z;tick();check(api.won,`L${li+1} exit wins`);check(api.save.completed.includes(li),`L${li+1} completion saved`);
 console.log(`Level ${li+1}: passage geometry, forms, carrying, circuits, reachable targets, collection and win OK`);
}
api.buildLevel(2);const gate=api.gates[0];api.player.x=gate.x;api.player.z=gate.z+1;api.updateCircuits();check(!gate.open,'unpowered closed gate cannot be opened by player proximity');
api.togglePause();const before=api.elapsed;tick(120);check(api.elapsed===before,'pause freezes timer');api.closeModal();
api.buildLevel(1);pos(6,8);api.player.form=0;tick();check(api.deaths===1,'water respawns blob');api.player.form=1;pos(6,8);tick(100);check(api.deaths===1,'flat can float');
console.log(`${checks} assertions passed.`);
