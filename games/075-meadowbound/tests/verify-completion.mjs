import {Simulation,PEN} from '../dist/simulation.js';
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),key=(x,z)=>`${x},${z}`;
function los(sim,a,b){const n=Math.ceil(dist(a,b)*5);for(let i=0;i<=n;i++)if(sim.blocked(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n))return false;return true}
function legalCell(sim,a){let x=Math.round(a.x),z=Math.round(a.z),best=null;for(let r=0;r<=5;r++){for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++){let p={x:x+dx,z:z+dz};if(!sim.blocked(p.x,p.z)&&(!best||dist(p,a)<dist(best,a)))best=p}if(best)return best}return null}
function nav(sim,a,b){if(los(sim,a,b))return b;let end=legalCell(sim,b),start=legalCell(sim,a);if(!end||!start)return b;let q=[end],map=new Map([[key(end.x,end.z),null]]);for(let i=0;i<q.length;i++){let p=q[i];if(p.x===start.x&&p.z===start.z)break;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){let np={x:p.x+dx,z:p.z+dz},k=key(np.x,np.z);if(map.has(k)||sim.blocked(np.x,np.z)||sim.blocked(p.x+dx,p.z)||sim.blocked(p.x,p.z+dz))continue;map.set(k,p);q.push(np)}}let p=start,path=[start];while(map.get(key(p.x,p.z))){p=map.get(key(p.x,p.z));path.push(p);if(path.length>100)break}let target=path[0];for(let i=0;i<path.length;i++){if(i<3||los(sim,a,path[i]))target=path[i];else break}return target}
function run(level){let sim=new Simulation(level);sim.start();let chosen=null,pickTime=-100,target=null,stats=[],nextPick=0,lastSample=null,stall=0;for(let f=0;f<60*600&&!sim.won;f++){
 let active=sim.sheep.filter(s=>!s.saved),t=active.find(s=>s.id===chosen);
 if(!t||sim.time-pickTime>25){active.sort((a,b)=>dist(b,PEN)-dist(a,PEN));t=active[nextPick%Math.min(3,active.length)];nextPick++;chosen=t.id;pickTime=sim.time;stall=0;lastSample={x:t.x,z:t.z}}
 let [hx,hz]=sim.directionHome(t),offset=t.type==='stubborn'?2.4:3.4;
 let goal={x:t.x-hx*offset,z:t.z-hz*offset};let edge=false;if(t.z<-14.8&&hz>0){goal={x:t.x,z:-17};edge=true;}if(t.z>14.8&&hz<0){goal={x:t.x,z:17};edge=true;}
 sim.collide(goal,.48);if(f%15===0||!target)target=edge&&dist(sim.dog,t)<2?goal:nav(sim,sim.dog,goal);
 if(edge&&dist(sim.dog,t)<2)sim.step(1/60,{x:Math.max(-1,Math.min(1,(t.x-sim.dog.x)*4)),z:t.z<0?-1:1});else sim.step(1/60,{target});
 if(f%60===0){if(lastSample&&dist(t,lastSample)<.25)stall++;else stall=0;lastSample={x:t.x,z:t.z};if(dist(t,sim.dog)<5&&sim.cooldowns.bark===0&&(t.type==='stubborn'||stall>3))sim.ability('bark');if(sim.mood>.2&&sim.cooldowns.calm===0)sim.ability('calm')}
 if(f%1800===0)stats.push({time:+sim.time.toFixed(1),saved:sim.saved,target:chosen,dog:[+sim.dog.x.toFixed(1),+sim.dog.z.toFixed(1)],t:[+t.x.toFixed(1),+t.z.toFixed(1)]});
 }
 return {level:level+1,won:sim.won,time:+sim.time.toFixed(2),saved:sim.saved,total:sim.sheep.length,barks:sim.barks,stars:sim.stars,remaining:sim.sheep.filter(s=>!s.saved).map(s=>({id:s.id,type:s.type,x:+s.x.toFixed(3),z:+s.z.toFixed(3)})),stats};
}
for(let i=0;i<3;i++){const result=run(i);console.log(JSON.stringify(result));if(!result.won)process.exitCode=1;}
