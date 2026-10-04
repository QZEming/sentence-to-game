export const R = 0.145;
export const HX = 4.85, HZ = 2.32, POCKET_R = 0.32;
export const pockets = [[-HX,-HZ],[0,-HZ],[HX,-HZ],[-HX,HZ],[0,HZ],[HX,HZ]];
export const COLORS = ['#f6f0dc','#edbc38','#3972dc','#c6433f','#8854c4','#ed7d35','#36a878','#8b263f','#171b1d','#e4b836','#467cce','#c24541','#8c58ba','#e88d3e','#339b75','#893b4d'];
export function ball(id,x,z) { return {id,x,z,vx:0,vz:0,active:true,fall:0}; }
export function makeRack(level=0, practice=false) {
  const balls=[ball(0,-2.9,0.55)];
  if(practice) { let id=1; for(let row=0;row<5;row++) for(let col=0;col<=row;col++) balls.push(ball(id++,1.6+row*R*1.76,(col-row/2)*R*2.03)); const eight=balls[8]; [eight.x,balls[5].x]=[balls[5].x,eight.x]; [eight.z,balls[5].z]=[balls[5].z,eight.z]; return balls; }
  const layouts=[[[1,-1.3,-0.25],[2,1.35,0.9],[3,3.45,-1.15],[5,-3.8,1.45],[6,0.45,-1.55],[8,2.65,0.1]],[[1,-0.8,-1.1],[2,1.3,0.35],[3,3.25,-1.5],[4,3.6,1.5],[5,-3.2,1.5],[6,-2.1,-1.5],[7,0.1,1.5],[8,2.3,-0.45]],[[1,-1.4,-0.15],[2,-0.3,-1.6],[3,1.1,-0.7],[4,2.5,-1.5],[5,3.7,1.5],[6,-3.6,1.5],[7,0.2,1.5],[9,2.2,1.2],[10,3.6,-0.2],[8,1.4,0.2]]];
  return balls.concat(layouts[level].map(([id,x,z])=>ball(id,x,z)));
}
export class PoolPhysics {
  constructor(balls,onEvent=()=>{}) { this.balls=balls;this.onEvent=onEvent;this.spin=0;this.spinUsed=false;this.hit=false;this.railCount=0; }
  shoot(angle,power,spin=0) {const cue=this.balls[0]; if(!cue.active||this.moving())return false; cue.vx=Math.cos(angle)*(2+power*13);cue.vz=Math.sin(angle)*(2+power*13);this.spin=spin;this.spinUsed=false;this.hit=false;this.railCount=0;this.direction={x:Math.cos(angle),z:Math.sin(angle)};return true;}
  moving() {return this.balls.some(b=>b.active&&Math.hypot(b.vx,b.vz)>0.012);}
  step(dt) {
    for(const b of this.balls) {
      if(!b.active)continue;
      b.x+=b.vx*dt;b.z+=b.vz*dt;
      let p=pockets.find(p=>Math.hypot(b.x-p[0],b.z-p[1])<POCKET_R);
      if(p){b.active=false;b.vx=b.vz=0;this.onEvent({type:'pocket',ball:b,pocket:p});continue;}
      const ex=HX-R,ez=HZ-R;
      if(Math.abs(b.x)>ex){b.x=Math.sign(b.x)*ex;b.vx=-b.vx*.86;this.railCount++;this.onEvent({type:'rail',ball:b});}
      if(Math.abs(b.z)>ez){b.z=Math.sign(b.z)*ez;b.vz=-b.vz*.86;this.railCount++;this.onEvent({type:'rail',ball:b});}
      const speed=Math.hypot(b.vx,b.vz);if(speed>0){const next=Math.max(0,speed-(0.54+speed*.095)*dt);b.vx*=next/speed;b.vz*=next/speed;if(next<.035)b.vx=b.vz=0;}
    }
    for(let i=0;i<this.balls.length;i++)for(let j=i+1;j<this.balls.length;j++) {
      const a=this.balls[i],b=this.balls[j];if(!a.active||!b.active)continue;
      let dx=b.x-a.x,dz=b.z-a.z,dist=Math.hypot(dx,dz);if(dist>=R*2)continue;
      if(dist<.00001){dx=.0001;dz=0;dist=.0001;}
      const nx=dx/dist,nz=dz/dist,overlap=R*2-dist;a.x-=nx*overlap*.501;a.z-=nz*overlap*.501;b.x+=nx*overlap*.501;b.z+=nz*overlap*.501;
      const relative=(a.vx-b.vx)*nx+(a.vz-b.vz)*nz;if(relative<=0)continue;
      const impulse=relative*.985;a.vx-=impulse*nx;a.vz-=impulse*nz;b.vx+=impulse*nx;b.vz+=impulse*nz;
      if(a.id===0||b.id===0){this.hit=true;if(!this.spinUsed){const cue=a.id===0?a:b;cue.vx+=this.direction.x*this.spin*Math.min(2,relative*.45);cue.vz+=this.direction.z*this.spin*Math.min(2,relative*.45);this.spinUsed=true;}}
      this.onEvent({type:'collision',speed:relative});
    }
  }
  respot(id=0) {let b=this.balls.find(b=>b.id===id);if(!b)return;for(let x=-3.6;x<4;x+=.4)for(let z=0;z<=1.8;z+=.4){if(this.balls.every(a=>!a.active||a.id===id||Math.hypot(a.x-x,a.z-z)>R*2.2)){Object.assign(b,{x,z,vx:0,vz:0,active:true,fall:0});return;}}}
  trace(angle,length=8) {
    const cue=this.balls[0];const dx=Math.cos(angle),dz=Math.sin(angle);let t=length,hit=null;
    for(const b of this.balls){if(!b.active||b.id===0)continue;const ox=b.x-cue.x,oz=b.z-cue.z;const along=ox*dx+oz*dz,perp=ox*ox+oz*oz-along*along;if(along>0&&perp<4*R*R){const contact=along-Math.sqrt(4*R*R-perp);if(contact>0&&contact<t){t=contact;hit=b;}}}
    const tx=dx>0?(HX-R-cue.x)/dx:dx<0?(-HX+R-cue.x)/dx:Infinity;const tz=dz>0?(HZ-R-cue.z)/dz:dz<0?(-HZ+R-cue.z)/dz:Infinity;const wall=Math.min(tx,tz);if(wall<t){t=wall;hit=null;}
    const end={x:cue.x+dx*t,z:cue.z+dz*t};let target=null;if(hit){const nx=(hit.x-end.x)/(2*R),nz=(hit.z-end.z)/(2*R);target={x:hit.x+nx*1.6,z:hit.z+nz*1.6};}return {start:cue,end,hit,target};
  }
}
