import { MISSIONS, generate, rotate, validation, candidates, orientations, worldCells, key, volume, score } from './game.js';
const clone = value => structuredClone(value);
export class GameSession {
 constructor(index=0,mode='campaign',date=new Date()) {
  this.mode=mode;this.mission={...MISSIONS[index]};let seed=0;
  if(mode==='daily'){seed=Number(`${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`);this.mission.name='每日星际货单';this.mission.code=`DAILY ${seed}`;this.mission.locked=1;this.mission.brief='今天的货单，今天的组合。每个装箱员面对同一份空间谜题。';}
  this.pieces=generate(this.mission,seed);this.placements=this.pieces.filter(p=>p.locked).map(p=>({id:p.id,cells:clone(p.solution),pos:[...p.pos],locked:true}));this.selected=null;this.cells=[];this.pos=[0,0,0];this.history=[];this.elapsed=0;this.moves=0;this.hints=0;this.paused=false;this.won=false;this.timedOut=false;this.xray=false;this.revision=0;this.select(this.remaining[0]?.id);
 }
 get remaining(){return this.pieces.filter(p=>!this.placements.some(q=>q.id===p.id));}
 get item(){return this.pieces.find(p=>p.id===this.selected);}
 get used(){return this.placements.reduce((s,p)=>s+p.cells.length,0);}
 get full(){return !this.remaining.length&&this.used===volume(this.mission.dims);}
 get blocked(){return this.paused||this.won||this.timedOut;}
 get error(){return this.item?validation(this.cells,this.pos,this.mission.dims,this.placements):'';}
 select(id){const p=this.remaining.find(p=>p.id===id);if(!p){if(id==null){this.selected=null;this.cells=[];}return false;}this.selected=id;this.cells=clone(p.cells);let pos=candidates(this.cells,this.mission.dims,this.placements)[0];if(!pos){for(const orientation of orientations(p.cells)){const fit=candidates(orientation,this.mission.dims,this.placements)[0];if(fit){this.cells=clone(orientation);pos=fit;break;}}}this.pos=pos||[0,0,0];return true;}
 stage(id,pos,axes=[]){if(this.blocked)throw Error('任务未处于装载状态');if(!this.remaining.some(p=>p.id===id))throw Error('行李不可用');if(!Array.isArray(pos)||pos.length!==3||pos.some((v,i)=>!Number.isInteger(v)||v<0||v>=this.mission.dims[i]))throw Error('无效的格子坐标');if(!Array.isArray(axes)||axes.length>12||axes.some(a=>!['x','y','z'].includes(a)))throw Error('无效的旋转轴');this.select(id);this.cells=clone(this.pieces.find(p=>p.id===id).cells);for(const a of axes)this.cells=rotate(this.cells,a);this.pos=[...pos];return !this.error;}
 rotate(axis){if(this.blocked||!this.item||!['x','y','z'].includes(axis))return false;this.cells=rotate(this.cells,axis);return true;}
 move(dx,dy,dz){if(this.blocked||!this.item)return;this.pos=this.pos.map((v,i)=>Math.max(0,Math.min(this.mission.dims[i]-1,v+[dx,dy,dz][i])));}
 snapshot(){this.history.push(clone({placements:this.placements,selected:this.selected,cells:this.cells,pos:this.pos,moves:this.moves}));}
 place(){if(this.blocked||!this.item)return {ok:false,error:'请先选择待装行李'};if(this.error)return {ok:false,error:this.error};this.snapshot();const id=this.selected;this.placements.push({id,cells:clone(this.cells),pos:[...this.pos],locked:false});this.moves++;this.revision++;this.select(this.remaining[0]?.id);return {ok:true,id,full:this.full};}
 undo(){if(this.blocked||!this.history.length)return false;Object.assign(this,this.history.pop());this.revision++;return true;}
 remove(id){const p=this.placements.find(p=>p.id===id);if(this.blocked||!p||p.locked)return false;this.snapshot();this.placements=this.placements.filter(p=>p.id!==id);this.moves++;this.revision++;this.select(id);return true;}
 isCanonical(){const canon=p=>worldCells(p).map(key).sort().join('|');return this.placements.every(p=>{const q=this.pieces.find(q=>q.id===p.id);return canon(p)===canon({cells:q.solution,pos:q.pos});});}
 hintPlacement(o){if(this.blocked||this.hints>=3||!this.remaining.some(p=>p.id===o.id))return false;if(validation(o.cells,o.pos,this.mission.dims,this.placements))return false;this.selected=o.id;this.cells=clone(o.cells);this.pos=[...o.pos];this.hints++;return true;}
 resetToReference(){if(this.blocked||this.hints>=3)return false;this.snapshot();this.placements=this.placements.filter(p=>p.locked);this.moves++;this.revision++;const p=this.remaining[0];return p?this.hintPlacement({id:p.id,cells:p.solution,pos:p.pos}):false;}
 finish(){if(this.blocked||!this.full)return null;this.won=true;return{score:score(this.mission,Math.round(this.elapsed),this.moves,this.hints),stars:this.hints===0?3:this.hints===1?2:1,time:Math.round(this.elapsed)};}
}
