export const COLORS = ['#a6e854','#a58bfa','#ffaf64','#56d9dd','#fb759b','#709cfa','#f1d36c','#83d7ab','#cba6f7','#f39571','#68c8f2','#e4b7df'];
export const MISSIONS = [
 {id:0,name:'月面补给线',destination:'LUNA / 月球前哨站',code:'OC–001',dims:[4,2,3],pieces:7,seed:31,locked:2,brief:'第一趟星际运输，从月球开始。把剩余行李装进货舱，准备出发。',tag:'见习航线',reward:1200,limit:300},
 {id:1,name:'红沙快递',destination:'MARS / 火星殖民地',code:'OC–002',dims:[4,3,3],pieces:9,seed:117,locked:1,brief:'火星基地发来补给请求。货舱多了一层，试着把空间向上延伸。',tag:'立体堆叠',reward:1800,limit:420},
 {id:2,name:'木星中转站',destination:'JUPITER / 木星轨道港',code:'OC–003',dims:[4,3,4],pieces:11,seed:726,locked:1,brief:'更大的货舱，更多不规则行李。仔细观察每一层，不要留下空隙。',tag:'空间规划',reward:2400,limit:540},
 {id:3,name:'土星环航道',destination:'SATURN / 环带观测站',code:'OC–004',dims:[5,3,4],pieces:13,seed:918,locked:2,brief:'环带观测站正在等待设备。绕过已固定货物，为大件行李留好位置。',tag:'复杂形状',reward:3200,limit:600},
 {id:4,name:'深空远征',destination:'KEPLER / 开普勒边境',code:'OC–005',dims:[5,4,4],pieces:17,seed:448,locked:2,brief:'一次跨越星系的远征。利用透视模式和分层观察，完成终极装箱。',tag:'大师挑战',reward:4800,limit:720},
];
const NAMES=['生态培养箱','光谱探测器','月面补给包','量子电池组','通讯阵列','乘员行李','星尘样本箱','折叠太阳帆','导航组件','冻干补给箱','引力测量仪','备用机械臂','科研样本','氧气循环器','航行记录器','星图终端','深空信标','生物舱模块','中继天线','紧急工具包'];
export function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export const key=c=>c.join(',');
export function normalize(cells){const min=[0,1,2].map(a=>Math.min(...cells.map(c=>c[a])));return cells.map(c=>c.map((v,a)=>v-min[a]));}
export function rotate(cells,axis){return normalize(cells.map(([x,y,z])=>axis==='x'?[x,-z,y]:axis==='y'?[z,y,-x]:[-y,x,z]));}
export function orientations(cells){const found=new Map(),q=[normalize(cells)];while(q.length){const a=q.shift(),k=a.map(key).sort().join('|');if(found.has(k))continue;found.set(k,a);for(const axis of ['x','y','z'])q.push(rotate(a,axis));}return [...found.values()];}
export function volume(dims){return dims.reduce((a,b)=>a*b,1);}
export function worldCells(p){return p.cells.map(c=>c.map((v,a)=>v+p.pos[a]));}
export function occupied(placements,except){const s=new Set();for(const p of placements){if(p.id===except)continue;for(const c of worldCells(p))s.add(key(c));}return s;}
export function validation(cells,pos,dims,placements){const taken=occupied(placements);for(const c of cells){const w=c.map((v,a)=>v+pos[a]);if(w.some((v,a)=>v<0||v>=dims[a]))return '超出货舱边界';if(taken.has(key(w)))return '与已装载行李重叠';}return '';}
export function candidates(cells,dims,placements){const out=[];for(let y=0;y<dims[1];y++)for(let z=0;z<dims[2];z++)for(let x=0;x<dims[0];x++){const pos=[x,y,z];if(!validation(cells,pos,dims,placements))out.push(pos);}return out;}
// Randomly merge neighboring cells. Every piece stays connected and the original partition is an exact solution.
export function generate(mission,extraSeed=0){const random=rng(mission.seed+extraSeed),[W,H,D]=mission.dims;let parts=[];for(let y=0;y<H;y++)for(let z=0;z<D;z++)for(let x=0;x<W;x++)parts.push([[x,y,z]]);
 const neighbor=(a,b)=>a.some(c=>b.some(d=>c.reduce((s,v,k)=>s+Math.abs(v-d[k]),0)===1));
 while(parts.length>mission.pieces){const opts=[];for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++)if(parts[i].length+parts[j].length<=6&&neighbor(parts[i],parts[j]))opts.push([i,j]);if(!opts.length)break;const [i,j]=opts[Math.floor(random()*opts.length)];parts[i].push(...parts[j]);parts.splice(j,1);}
 parts.sort((a,b)=>b.length-a.length);
 return parts.map((absolute,i)=>{const pos=[0,1,2].map(a=>Math.min(...absolute.map(c=>c[a])));const solution=normalize(absolute);let cells=solution;for(let n=0;n<1+Math.floor(random()*4);n++)cells=rotate(cells,['x','y','z'][Math.floor(random()*3)]);return{id:i,name:NAMES[i%NAMES.length],color:COLORS[i%COLORS.length],cells,solution,pos,locked:i<mission.locked,volume:cells.length};});
}
// Exact-cover search with minimum remaining values and an explicit work budget.
export function solve(pieces,dims,placements,nodeLimit=60000){const used=occupied(placements),all=[];for(let y=0;y<dims[1];y++)for(let z=0;z<dims[2];z++)for(let x=0;x<dims[0];x++)all.push(key([x,y,z]));
 const options=pieces.map(p=>{const out=[];for(const cells of orientations(p.cells)){const max=[0,1,2].map(a=>Math.max(...cells.map(c=>c[a])));for(let y=0;y<dims[1]-max[1];y++)for(let z=0;z<dims[2]-max[2];z++)for(let x=0;x<dims[0]-max[0];x++){const pos=[x,y,z],keys=cells.map(c=>key(c.map((v,a)=>v+pos[a])));if(keys.every(k=>!used.has(k)))out.push({id:p.id,cells,pos,keys});}}return out;});
 let nodes=0,exhausted=false;
 function search(left,filled){if(!left.length)return[];if(++nodes>nodeLimit){exhausted=true;return null;}let best=null;
 for(const k of all){if(filled.has(k))continue;const opts=[];for(const i of left)for(const o of options[i])if(o.keys.includes(k)&&o.keys.every(k=>!filled.has(k)))opts.push([i,o]);if(!opts.length)return null;if(!best||opts.length<best.length)best=opts;if(best.length===1)break;}
 if(!best)return[];for(const [i,o]of best){const next=new Set(filled);o.keys.forEach(k=>next.add(k));const r=search(left.filter(j=>j!==i),next);if(r)return[o,...r];if(exhausted)return null;}return null;}
 return {solution:search(pieces.map((_,i)=>i),used),exhausted,nodes};
}
export function score(mission,elapsed,moves,hints){return Math.max(100,mission.reward+Math.max(0,600-elapsed)*2-Math.max(0,moves-mission.pieces)*30-hints*150);}
