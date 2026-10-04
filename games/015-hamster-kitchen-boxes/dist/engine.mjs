export const DIRS={U:[0,-1],D:[0,1],L:[-1,0],R:[1,0]};
export const pos=(x,y)=>`${x},${y}`;
export function parseLevel(level){
 const h=level.map.length,w=level.map[0].length;const board={w,h,walls:new Set(),goals:new Set(),ice:new Set(),plates:new Set(),doors:new Set(),seeds:new Set(level.seeds||[])};
 const state={player:[0,0],boxes:[],collected:[],moves:0,pushes:0};
 level.map.forEach((row,y)=>{if(row.length!==w)throw new Error('Invalid map width');[...row].forEach((c,x)=>{const p=pos(x,y);if(c==='#')board.walls.add(p);if('.+*'.includes(c))board.goals.add(p);if(c==='i')board.ice.add(p);if(c==='p')board.plates.add(p);if(c==='D')board.doors.add(p);if('@+'.includes(c))state.player=[x,y];if('$*'.includes(c))state.boxes.push([x,y]);})});
 return {board,state};
}
export function doorOpen(board,state){return board.plates.has(pos(...state.player))||state.boxes.some(b=>board.plates.has(pos(...b)));}
export function won(board,state){return state.boxes.every(b=>board.goals.has(pos(...b)));}
export function move(board,state,direction){
 const d=DIRS[direction];if(!d)return null;const [dx,dy]=d;const q=[state.player[0]+dx,state.player[1]+dy];const qp=pos(...q);const open=doorOpen(board,state);
 const solid=(p)=>p[0]<0||p[1]<0||p[0]>=board.w||p[1]>=board.h||board.walls.has(pos(...p))||(board.doors.has(pos(...p))&&!open);
 if(solid(q))return null;const index=state.boxes.findIndex(b=>b[0]===q[0]&&b[1]===q[1]);const boxes=state.boxes.map(b=>[...b]);let slide=0;
 if(index>=0){let target=[q[0]+dx,q[1]+dy];const blocked=p=>solid(p)||boxes.some((b,i)=>i!==index&&b[0]===p[0]&&b[1]===p[1]);if(blocked(target))return null;while(board.ice.has(pos(...target))&&!board.goals.has(pos(...target))){const next=[target[0]+dx,target[1]+dy];if(blocked(next))break;target=next;slide++;}boxes[index]=target;}
 const collected=[...state.collected];if(board.seeds.has(qp)&&!collected.includes(qp))collected.push(qp);
 return {...state,player:q,boxes,collected,moves:state.moves+1,pushes:state.pushes+(index>=0?1:0),lastPush:index,slide};
}
export function deadlocked(board,state){return state.boxes.some(([x,y])=>{if(board.goals.has(pos(x,y)))return false;const w=(dx,dy)=>board.walls.has(pos(x+dx,y+dy));return(w(-1,0)||w(1,0))&&(w(0,-1)||w(0,1));});}
const key=s=>pos(...s.player)+'|'+s.boxes.map(b=>pos(...b)).sort().join(';');
export async function solve(board,initial,maxStates=45000){
 if(won(board,initial))return {status:'solved',path:''};
 const queue=[{s:initial,parent:-1,segment:''}];let head=0;const seen=new Set([key(initial)]);
 while(head<queue.length&&queue.length<maxStates){
  const parent=head++,cur=queue[parent];const walks=[{s:cur.s,path:''}],walkSeen=new Set([pos(...cur.s.player)]);let wi=0;
  while(wi<walks.length){const walk=walks[wi++];for(const d of Object.keys(DIRS)){const next=move(board,walk.s,d);if(!next)continue;
   if(next.lastPush<0){const p=pos(...next.player);if(!walkSeen.has(p)){walkSeen.add(p);walks.push({s:next,path:walk.path+d});}continue;}
   if(deadlocked(board,next))continue;const k=key(next);if(seen.has(k))continue;seen.add(k);queue.push({s:next,parent,segment:walk.path+d});
   if(won(board,next)){let idx=queue.length-1,path='';while(queue[idx].parent>=0){path=queue[idx].segment+path;idx=queue[idx].parent;}return {status:'solved',path,states:queue.length};}
  }}
  if(head%150===0)await new Promise(r=>setTimeout(r,0));
 }
 return {status:head>=queue.length?'deadlock':'limit',path:null,states:queue.length};
}
