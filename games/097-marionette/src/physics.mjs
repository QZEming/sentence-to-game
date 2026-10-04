
const P=(x,z,w,d,checkpoint=false)=>({x,z,w,d,checkpoint});
const LEVELS=[
 {name:"初次登台",en:"THE FIRST STRING",roman:"I",goal:"沿木台前进，收集星光，抵达金色终点。",tip:"试着轻点 Q / E。双线同时收紧可以稳住身体。",par:45,wind:0,platforms:[P(0,5,4,4),P(0,1.5,2.5,3.4),P(0,-1.7,4,3,true),P(0,-5,2.2,4),P(0,-8.7,4,3.8)],stars:[[0,2.0],[1,-1.7],[0,-5.7]],end:[0,-8.7]},
 {name:"独木巡演",en:"A DELICATE BALANCE",roman:"II",goal:"走过窄桥，在休息台上恢复平衡。",tip:"转向会产生惯性。按住双线稳住，再踏上窄桥。",par:65,wind:0,platforms:[P(0,5,4,4),P(-1,1.8,1.05,3.4),P(-1,-1,4.8,2.6,true),P(1,-3.6,1.3,3.3),P(1,-6,3,2),P(0,-7.4,1.2,1.4),P(0,-9,4,3.2)],stars:[[-1,1.8],[1,-3.6],[1.8,-6]],end:[0,-9]},
 {name:"跃过乐池",en:"LEAP OF FAITH",roman:"III",goal:"踏准边缘起跳，跨过三处舞台缺口。",tip:"空格起跳。可以在落地前提前按下下一次跳跃。",par:65,wind:0,platforms:[P(0,5,4,4),P(0,1.5,3,2.5),P(1.5,-2.2,2.5,2.5,true),P(-1,-5.8,2.5,2.5),P(0,-9.3,4,3)],stars:[[0,1.5],[1.5,-2.2],[-1,-5.8]],end:[0,-9.3]},
 {name:"风中舞步",en:"DANCE WITH THE WIND",roman:"IV",goal:"抵住侧风，绕过摆锤的运动轨迹。",tip:"观察右上角风向。摆锤靠近时停一下或跳过去。",par:75,wind:3.8,pendulum:{z:-4.1,amp:2.8,speed:1.8},platforms:[P(0,5,4,4),P(0,1.6,1.85,3.2),P(0,-1.5,3.5,3,true),P(0,-4.8,1.5,3.8),P(0,-8.7,4,4)],stars:[[0,1.5],[-1,-1.5],[0,-5.4]],end:[0,-8.7]},
 {name:"盛大谢幕",en:"THE FINAL BOW",roman:"V",goal:"穿越窄桥、跳台和机关，完成最后一幕。",tip:"最后的演出，把你学会的每一步都串起来。",par:90,wind:2.8,pendulum:{z:-6.6,amp:2.6,speed:2.2},platforms:[P(0,5,4,4),P(-1,1.8,1.1,3.4),P(-1,-1,2.5,2.3,true),P(1,-4,2.5,2.2),P(1,-6.3,1.1,2.7),P(0,-9,4,3.2)],stars:[[-1,1.7],[1,-4],[1,-6.4]],end:[0,-9]}
];
function newState(index=0,practice=false){
return {level:index,practice,x:0,z:5,y:0,vx:0,vz:0,vy:0,roll:0,rollV:0,grounded:true,coyote:.12,jumpBuffer:0,time:0,falls:0,stars:[false,false,false],checkpoint:{x:0,z:5},checked:false,score:0,status:"ready",wind:0,hitCooldown:0,unstable:0,events:[],stableTime:0,poseTime:0,poseDone:false,goalNotice:0};
}
function groundAt(level,x,z){return level.platforms.find(p=>Math.abs(x-p.x)<=p.w/2+.08&&Math.abs(z-p.z)<=p.d/2+.08);}
function resetBody(s){Object.assign(s,{x:s.checkpoint.x,z:s.checkpoint.z,y:0,vx:0,vz:0,vy:0,roll:0,rollV:0,grounded:true,coyote:.12,jumpBuffer:0,unstable:0,hitCooldown:1});}
function gameStep(s,k,dt){
 if(s.status!=="playing")return;
 const l=LEVELS[s.level];s.time+=dt;s.goalNotice=Math.max(0,s.goalNotice-dt);s.hitCooldown=Math.max(0,s.hitCooldown-dt);s.jumpBuffer=Math.max(0,s.jumpBuffer-dt);
 let ax=(k.KeyD||k.ArrowRight?1:0)-(k.KeyA||k.ArrowLeft?1:0);
 let az=(k.KeyS||k.ArrowDown?1:0)-(k.KeyW||k.ArrowUp?1:0);
 const inputLength=Math.hypot(ax,az);if(inputLength>1){ax/=inputLength;az/=inputLength;}
 const q=!!k.KeyQ,e=!!k.KeyE,steady=(q&&e)||!!k.ShiftLeft||!!k.ShiftRight;
 const oldVX=s.vx; const speed=steady&&s.grounded?2.0:4.15;const control=s.grounded?7:3.8;
 s.wind=l.wind&&s.z<3&&s.z>-7?Math.sin(s.time*.85)*l.wind:0;
 s.vx+=((ax*speed-s.vx)*control+s.wind*(steady?.25:1))*dt;s.vz+=(az*speed-s.vz)*control*dt;
 s.x+=s.vx*dt;s.z+=s.vz*dt;
 s.rollV+=(-s.roll*(steady?28:s.practice?10:5.5)-s.rollV*(steady?8:3.8)+(steady?0:(e?6:0)-(q?6:0))+(s.vx-oldVX)/dt*.27+s.wind*.52)*dt;
 s.roll+=s.rollV*dt;
 if(steady)s.stableTime+=dt;
 const ground=groundAt(l,s.x,s.z); if(s.grounded&&!ground)s.grounded=false;
 if(s.grounded){s.coyote=.12;s.y=0;}else s.coyote=Math.max(0,s.coyote-dt);
 if(s.jumpBuffer>0&&s.coyote>0){s.vy=6.9;s.grounded=false;s.coyote=0;s.jumpBuffer=0;s.events.push("jump");}
 if(!s.grounded){const py=s.y;s.vy-=17.5*dt;s.y+=s.vy*dt;if(ground&&py>=0&&s.y<=0&&s.vy<0){s.y=0;s.grounded=true;s.rollV+=s.vx*.2;s.vy=0;s.events.push("land");}}
 if(ground?.checkpoint&&s.grounded&&!s.checked){s.checked=true;s.checkpoint={x:ground.x,z:ground.z};s.events.push("checkpoint");}
 if(!s.poseDone&&ground?.checkpoint&&s.grounded&&Math.hypot(s.x-ground.x,s.z-ground.z)<.85&&Math.hypot(s.vx,s.vz)<.7&&Math.abs(s.roll)<.2){s.poseTime+=dt;if(s.poseTime>=2){s.poseDone=true;s.score+=250;s.events.push("pose");}}else if(!s.poseDone)s.poseTime=Math.max(0,s.poseTime-dt*.7);
 if(l.pendulum&&s.hitCooldown===0){const px=Math.sin(s.time*l.pendulum.speed)*l.pendulum.amp;if(Math.hypot(s.x-px,s.z-l.pendulum.z)<.87&&s.y<1.2){s.vx+=(s.x<px?-1:1)*5;s.rollV+=(s.x<px?-1:1)*2.4;s.hitCooldown=1.2;s.events.push("hit");}}
 l.stars.forEach((p,i)=>{if(!s.stars[i]&&Math.hypot(s.x-p[0],s.z-p[1])<.86&&s.y>-.25&&s.y<2){s.stars[i]=true;s.score+=150;s.events.push("star");}});
 if(Math.abs(s.roll)>1.18&&s.grounded&&!s.practice)s.unstable+=dt;else s.unstable=Math.max(0,s.unstable-dt*2);
 if(s.y<-3.5||s.unstable>.7){s.falls++;resetBody(s);s.events.push("fall");}
 if(Math.hypot(s.x-l.end[0],s.z-l.end[1])<1.1&&s.grounded){if(!s.practice&&(!s.poseDone||s.stars.filter(Boolean).length<2)){if(s.goalNotice===0){s.events.push("locked");s.goalNotice=2.5;}return;}s.status="won";s.score+=500+Math.max(0,Math.round((l.par-s.time)*10))-s.falls*25;s.score=Math.max(500,s.score);s.events.push("win");}
}


export { LEVELS, newState, gameStep, groundAt, resetBody };
