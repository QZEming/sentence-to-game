export const N = 0.00113;
export const MISSIONS = {
 standard: {id:'ODYSSEY–01', title:'逐梦者 · 轨道交会', description:'从地球轨道出发，与曙光空间站完成交会对接。', r:[0,-1200,40],fuel:100,limit:0,assist:Infinity},
 resupply: {id:'RESUPPLY–02',title:'最后一公里 · 紧急补给',description:'12 分钟内完成补给对接。有限的推进剂，需要精准的判断。',r:[60,-1500,-35],fuel:45,limit:720,assist:Infinity},
 night: {id:'NIGHTFALL–03',title:'寂静之海 · 夜侧对接',description:'依靠仪表穿越地影。自动交会辅助最多可用 20 秒。',r:[4,-180,3],fuel:55,limit:0,assist:20}
};
export const norm = v => Math.hypot(...v);
export function createState(mission='standard') {
 const m=MISSIONS[mission];
 return {mission,r:[...m.r],v:[0,0,0],fuel:m.fuel,time:0,stage:mission==='night'?1:0,yaw:8,pitch:0,yawRate:0,pitchRate:0,autopilot:false,braking:false,precision:false,paused:false,warp:1,status:'flying',capture:0,assistUsed:0,dvUsed:0,burns:0,warnings:0,thrust:0,reason:'',lastViolation:-30};
}
function derivative(s,u){const [x,y,z,vx,vy,vz]=s;return [vx,vy,vz,3*N*N*x+2*N*vy+u[0],-2*N*vx+u[1],-N*N*z+u[2]];}
export function integrate(r,v,u,dt){const s=[...r,...v],k1=derivative(s,u),k2=derivative(s.map((x,i)=>x+k1[i]*dt/2),u),k3=derivative(s.map((x,i)=>x+k2[i]*dt/2),u),k4=derivative(s.map((x,i)=>x+k3[i]*dt),u);const out=s.map((x,i)=>x+dt*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6);return{r:out.slice(0,3),v:out.slice(3)};}
export function predict(s,dv=[0,0,0],duration=480){let r=[...s.r],v=s.v.map((x,i)=>x+dv[i]);const points=[[...r]];for(let t=0;t<duration;t+=4){({r,v}=integrate(r,v,[0,0,0],4));points.push([...r]);}return points;}
export function burn(s,dv){if(s.status!=='flying'||s.paused)return false;const amount=norm(dv);if(amount<.001||amount*1.3>s.fuel)return false;s.v=s.v.map((x,i)=>x+dv[i]);s.fuel=Math.max(0,s.fuel-amount*1.3);s.dvUsed+=amount;s.burns++;s.autopilot=false;s.braking=false;return true;}
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
export function step(s,dt,input={}){
 if(s.status!=='flying'||s.paused)return;
 s.time+=dt;const mission=MISSIONS[s.mission],d=norm(s.r),speed=norm(s.v);let u=[0,0,0],a=s.precision?.015:.18;
 if(s.autopilot&&s.assistUsed>=mission.assist)s.autopilot=false;
 if(s.autopilot){
  s.assistUsed+=dt;const target=[0,-.36,0],delta=target.map((x,i)=>x-s.r[i]),length=norm(delta),vmax=d>200?12:d>30?3.5:d>5?.65:.115;
  // Smoothly reduce speed with stopping distance; counter the rotating-frame terms.
  const desired=Math.min(vmax,Math.sqrt(2*.10*Math.max(0,length)),length*.16);
  const goal=delta.map(x=>x/Math.max(length,.001)*desired);
  u=goal.map((x,i)=>(x-s.v[i])*.65);
  u[0]-=3*N*N*s.r[0]+2*N*s.v[1];u[1]+=2*N*s.v[0];u[2]+=N*N*s.r[2];
 }else if(s.braking){u=s.v.map(x=>-x*1.3);if(speed<.006){s.braking=false;}}
 else{u=[(!!input.KeyD-!!input.KeyA)*a,(!!input.KeyW-!!input.KeyS)*a,(!!input.KeyR-!!input.KeyF)*a];}
 const max=s.autopilot?.18:a,mag=norm(u);if(mag>max)u=u.map(x=>x*max/mag);
 let fuelCost=norm(u)*dt*1.3;if(fuelCost>s.fuel&&fuelCost>0){u=u.map(x=>x*s.fuel/fuelCost);fuelCost=s.fuel;}
 s.fuel=Math.max(0,s.fuel-fuelCost);s.dvUsed+=fuelCost/1.3;s.thrust=norm(u)/.18;
 const next=integrate(s.r,s.v,u,dt);s.r=next.r;s.v=next.v;
 const attitudePower=s.fuel>0;const turn=s.precision?2:7;
 let yawAcc=(!!input.ArrowRight-!!input.ArrowLeft)*turn,pitchAcc=(!!input.ArrowUp-!!input.ArrowDown)*turn;
 if(s.autopilot){yawAcc=clamp(-s.yaw*.8-s.yawRate*2,-turn,turn);pitchAcc=clamp(-s.pitch*.8-s.pitchRate*2,-turn,turn);}
 else{if(!input.ArrowRight&&!input.ArrowLeft)yawAcc=clamp(-s.yawRate*5,-turn,turn);if(!input.ArrowUp&&!input.ArrowDown)pitchAcc=clamp(-s.pitchRate*5,-turn,turn);}
 if(attitudePower){s.yawRate=clamp(s.yawRate+yawAcc*dt,-8,8);s.pitchRate=clamp(s.pitchRate+pitchAcc*dt,-8,8);const cost=(Math.abs(yawAcc)+Math.abs(pitchAcc))*.001*dt;s.fuel=Math.max(0,s.fuel-cost);}
 s.yaw=((s.yaw+s.yawRate*dt+180)%360+360)%360-180;s.pitch=((s.pitch+s.pitchRate*dt+180)%360+360)%360-180;
 const dist=norm(s.r),lateral=Math.hypot(s.r[0],s.r[2]);
 if(dist<200&&s.stage<1)s.stage=1;if(dist<30&&s.stage<2)s.stage=2;
 if(dist<30)s.warp=1;else if(dist<200)s.warp=Math.min(s.warp,5);
 if(dist<.8&&s.r[1]<0&&lateral<.6&&norm(s.v)<.15&&Math.hypot(s.yaw,s.pitch)<5&&Math.hypot(s.yawRate,s.pitchRate)<1){s.capture+=dt;if(s.capture>=2)s.status='docked';}else s.capture=0;
 if(s.r[1]>=0&&s.r[1]<15&&lateral<7){s.status='failed';s.reason='接触速度或进场位置不安全，航天器与空间站发生碰撞。';}
 if(dist>7500){s.status='failed';s.reason='航天器超出任务交会范围。请重新规划轨道机动。';}
 if(mission.limit&&s.time>mission.limit){s.status='failed';s.reason='补给窗口已关闭。尝试更早制动，或在远距离使用时间加速。';}
 if(dist<30&&norm(s.v)>1&&s.time-s.lastViolation>15){s.warnings++;s.lastViolation=s.time;}
}
export function score(s){return Math.max(0,Math.min(1000,Math.round(500+200*s.fuel/MISSIONS[s.mission].fuel+150*(1-Math.min(1,Math.hypot(s.yaw,s.pitch)/5))+150*(1-Math.min(1,norm(s.v)/.15))-30*s.warnings)));}
