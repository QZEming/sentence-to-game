export const RADIUS=.23;
export const MAX_SPEED=11.8;
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const inside=(b,r,margin=0)=>Math.abs(b.x-r.x)<r.w/2+margin&&Math.abs(b.z-r.z)<r.d/2+margin;
export function newBall(start){return {x:start[0],z:start[1],y:RADIUS,vx:0,vz:0,vy:0,portalCooldown:0,padCooldown:0,jumpInside:false,rest:0,moving:false,falling:false};}
export function fireBall(b,angle,power,loft=false){let speed=MAX_SPEED*(.13+.87*power/100);b.vx=Math.sin(angle)*speed*(loft?.84:1);b.vz=-Math.cos(angle)*speed*(loft?.84:1);b.vy=loft?4.8:0;b.moving=true;b.rest=0;}
export function stepBall(b,c,dt,t){
 const events=[];if(!b.moving)return events;b.portalCooldown=Math.max(0,b.portalCooldown-dt);b.padCooldown=Math.max(0,b.padCooldown-dt);
 if(b.falling){b.vy-=c.gravity*dt;b.y+=b.vy*dt;if(b.y<-5)events.push('out');return events;}
 b.x+=b.vx*dt;b.z+=b.vz*dt;b.y+=b.vy*dt;b.vy-=c.gravity*dt;
 if(b.y<=RADIUS){if(b.vy<-1.6){b.vy=-b.vy*.3;events.push('land');}else b.vy=0;b.y=RADIUS;}
 if(!c.jumps.some(p=>inside(b,p)))b.jumpInside=false;const grounded=b.y<RADIUS+.08;
 if(grounded){
  let speed=Math.hypot(b.vx,b.vz),sand=c.sand.some(r=>inside(b,r)),friction=sand?6.7:2.25;
  const next=Math.max(0,speed-friction*dt);if(speed>0){b.vx*=next/speed;b.vz*=next/speed;}
  if(speed>.2){b.vx+=c.wind[0]*dt;b.vz+=c.wind[1]*dt;}
 }
 if(Math.abs(b.x)>6.68){if(b.y<1.2){b.x=clamp(b.x,-6.68,6.68);b.vx*=-.73;events.push('wall');}else if(Math.abs(b.x)>7.4)b.falling=true;}
 if(Math.abs(b.z)>10.65){if(b.y<1.2){b.z=clamp(b.z,-10.65,10.65);b.vz*=-.73;events.push('wall');}else if(Math.abs(b.z)>11.4)b.falling=true;}
 for(const r of c.walls){if(b.y>r.h+RADIUS)continue;const cx=clamp(b.x,r.x-r.w/2,r.x+r.w/2),cz=clamp(b.z,r.z-r.d/2,r.z+r.d/2),dx=b.x-cx,dz=b.z-cz,d=Math.hypot(dx,dz);if(d<RADIUS){let nx,nz;if(d>.0001){nx=dx/d;nz=dz/d;b.x+=nx*(RADIUS-d);b.z+=nz*(RADIUS-d);}else{const px=r.w/2+RADIUS-Math.abs(b.x-r.x),pz=r.d/2+RADIUS-Math.abs(b.z-r.z);if(px<pz){nx=Math.sign(b.x-r.x)||1;nz=0;b.x+=nx*px;}else{nx=0;nz=Math.sign(b.z-r.z)||1;b.z+=nz*pz;}}let dot=b.vx*nx+b.vz*nz;if(dot<0){b.vx-=1.75*dot*nx;b.vz-=1.75*dot*nz;events.push('obstacle');}}}
 for(const r of c.bumpers){if(b.y>1.4)continue;const x=r.moving?2.8*Math.sin(t*1.2):r.x,dx=b.x-x,dz=b.z-r.z,d=Math.hypot(dx,dz),radius=r.r+RADIUS;if(d<radius){let nx=dx/(d||1),nz=dz/(d||1);if(d<.001){nx=0;nz=1;}b.x=x+nx*radius;b.z=r.z+nz*radius;const ovx=r.moving?3.36*Math.cos(t*1.2):0,dot=(b.vx-ovx)*nx+b.vz*nz;if(dot<0){b.vx-=1.85*dot*nx;b.vz-=1.85*dot*nz;events.push(r.moving?'guardian':'bumper');}let sp=Math.hypot(b.vx,b.vz);if(sp>14){b.vx*=14/sp;b.vz*=14/sp;}}}
 if(grounded){
  for(let i=0;i<c.portals.length;i++){const p=c.portals[i];if(b.portalCooldown===0&&Math.hypot(b.x-p.x,b.z-p.z)<.9){let out=c.portals[p.pair],speed=Math.max(2,Math.hypot(b.vx,b.vz)*.78);b.x=out.x+Math.sin(out.angle)*1.3;b.z=out.z-Math.cos(out.angle)*1.3;b.vx=Math.sin(out.angle)*speed;b.vz=-Math.cos(out.angle)*speed;b.portalCooldown=1.2;events.push('portal');break;}}
  for(const p of c.boosts){if(b.padCooldown===0&&inside(b,p)){b.vx+=p.dx*3.5;b.vz+=p.dz*3.5;b.padCooldown=.65;events.push('boost');}}
  const onJump=c.jumps.some(p=>inside(b,p));if(onJump&&!b.jumpInside&&b.vy===0){b.vy=4.2;events.push('jump');}b.jumpInside=onJump;
  for(const p of c.voids){if(inside(b,p,-.05)){b.falling=true;b.vy=-1;events.push('fall');}}
 }
 const dist=Math.hypot(b.x-c.hole[0],b.z-c.hole[1]),speed=Math.hypot(b.vx,b.vz);
 if(grounded&&!b.falling&&dist<.52&&speed<5.5){b.moving=false;b.vx=b.vz=b.vy=0;events.push('hole');return events;}
 if(grounded&&dist<1.2&&speed<2.8&&!b.falling){b.vx+=(c.hole[0]-b.x)*3.8*dt;b.vz+=(c.hole[1]-b.z)*3.8*dt;}
 if(speed<.065&&grounded&&b.vy===0&&!b.falling){b.rest+=dt;if(b.rest>.22){b.moving=false;b.vx=b.vz=0;events.push('stop');}}else b.rest=0;
 return events;
}
