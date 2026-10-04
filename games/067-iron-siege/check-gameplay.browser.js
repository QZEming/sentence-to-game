async () => {
const m=await import('./game.js'),p=await import('./physics.js');m.state.paused=true;const results=[];
const assert=(v,why)=>{if(!v)throw Error(why);};
function settle(){for(let tick=0;tick<1600&&!['ready','won','lost'].includes(m.state.phase);tick++){if(m.state.phase==='flying')m.updateProjectiles(1/60);m.updateEffects(1/60);if(m.state.phase==='settling'){m.state.settle-=1/60;if(m.state.settle<=-4)m.finishShot();}if(m.state.phase==='enemy')m.updateEnemy(1/60);}assert(['ready','won','lost'].includes(m.state.phase),'shot stuck');}
function shoot(){m.state.paused=false;const old=m.state.ammo.reduce((a,b)=>a+b,0);m.fire();m.fire();assert(m.state.ammo.reduce((a,b)=>a+b,0)===old-1,'double fire consumed extra ammo');m.state.paused=true;settle();}
for(let level=0;level<5;level++){
m.state.upgrades={power:0,armor:0,ammo:0};m.startLevel(level);m.state.paused=true;let attempts=0;
while(m.state.phase!=='won'&&m.state.phase!=='lost'&&attempts++<20){let best=null;const target=p.LEVELS[level].z;
for(const elevation of [35,45,55,65])for(let power=43;power<=85;power++){const vel=p.launch(0,elevation,power),t=(target-m.origin.z)/vel.z,yaw=-Math.atan((.5*p.LEVELS[level].wind*t*t)/(m.origin.z-target))*180/Math.PI,v=p.launch(yaw,elevation,power);let prev={...m.origin};
for(let time=.08;time<7;time+=.08){const point=p.pointAt(m.origin,v,time,p.LEVELS[level].wind),hit=m.collision(prev,point);if(hit){const d=Math.hypot(hit.point.x,Math.max(0,Math.abs(hit.point.y-4.5)-4),hit.point.z-target),value=(hit.object?.type==='core'?100:hit.object?.type==='barrel'?55:0)-d;if(!best||value>best.value)best={yaw,elevation,power,value};break;}prev=point;}}
Object.assign(m.state,{yaw:best.yaw,elevation:best.elevation,power:best.power,ammoType:m.state.ammo.findIndex(n=>n>0)});shoot();}
assert(m.state.phase==='won','level '+level+' not beatable');results.push({level:level+1,result:m.state.phase,shots:m.state.shots,health:m.state.health});}
for(let ammo=0;ammo<4;ammo++){m.startLevel(0);m.state.paused=true;m.state.ammoType=ammo;shoot();assert(m.state.shots===1,'wrong shot count');results.push({ammo:p.AMMO[ammo].name,phase:m.state.phase,core:m.state.core});}
m.startLevel(0);m.state.paused=true;m.state.ammo=[0,0,1,0];m.state.ammoType=2;shoot();assert(['won','lost'].includes(m.state.phase),'last fire round never resolves');results.push({test:'last incendiary round',result:m.state.phase});
m.startLevel(0);m.state.paused=true;const core=m.blocks.find(b=>b.type==='core');core.hp=1;m.state.core=1;m.state.power=56;m.state.ammo=[1,0,0,0];shoot();assert(m.state.phase==='won','last round victory lost');results.push({test:'last round victory',result:m.state.phase});
for(let i=0;i<3;i++){m.startLevel(0);assert(m.state.core===p.LEVELS[0].hp&&m.state.ammo[0]===7&&m.state.health===100,'retry did not reset');}
results.push({test:'three consecutive retries',result:'passed'});
m.state.gold=0;m.state.earned=[false,false,false,false,false];m.state.best=[0,0,0,0,0];m.startLevel(0);return results;
}
