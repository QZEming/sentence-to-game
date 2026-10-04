export const BUMPERS = [
  {x:-1.85,z:-3.5,r:.84,color:0x8fbd9d},
  {x:1.75,z:-3.7,r:.84,color:0xe1aa76},
  {x:0,z:-.85,r:.94,color:0x85bdb1},
  {x:-2.7,z:1.7,r:.57,color:0xc0cb81},
  {x:2.75,z:1.45,r:.57,color:0xc0cb81},
];
export const TARGETS=[{x:-4.05,z:-4.8},{x:0,z:-6.6},{x:4.05,z:-4.8}];
export const WALLS=[
  [-4.85,5.9,-4.85,-6.7],[-4.85,-6.7,-3.8,-8.5],[-3.8,-8.5,3.55,-8.5],[3.55,-8.5,5.65,-6.7],
  [5.65,-6.7,5.65,9.4],[4.75,8.9,4.75,-5.9],
  [-4.85,5.9,-3.35,7.7],[-3.35,7.7,-1.55,9.9],[4.75,5.8,3.35,7.7],[3.35,7.7,1.55,9.9],
  [-4.1,2.7,-2.85,5.9],[4.05,2.7,2.85,5.9],
  [-3.35,4.0,-2.7,5.15],[3.35,4.0,2.7,5.15],
];
export function flipperSegment(side,amount){const sign=side===0?1:-1;const angle=.37-amount*.82;return {ax:-sign*2.64,az:6.45,bx:-sign*2.64+sign*Math.cos(angle)*2.38,bz:6.45+Math.sin(angle)*2.38};}
export function closestPoint(x,z,ax,az,bx,bz){const dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));return {x:ax+dx*t,z:az+dz*t,t};}
export class Pinball {
  constructor(onEvent=()=>{}){this.onEvent=onEvent;this.mode='classic';this.nextId=0;this.reset();}
  emit(type,data={}){this.onEvent({type,...data});}
  reset(mode=this.mode){this.mode=mode;this.state='ready';this.previousState='ready';this.score=0;this.lives=3;this.balls=[];this.time=0;this.remaining=90;this.combo=0;this.multiplier=1;this.comboUntil=0;this.lastHit='';this.targets=[false,false,false];this.multiball=false;this.charge=0;this.charging=false;this.flippers=[0,0];this.keys=[false,false];this.nudgeHeat=0;this.tiltUntil=0;this.maxCombo=1;this.hitCount=0;this.multiCount=0;this.launchCount=0;this.waitUntil=0;this.saved=false;this.addBall(5.18,8.1,0,0,true);this.emit('reset');}
  addBall(x,z,vx=0,vz=0,waiting=false){const b={id:this.nextId++,x,z,vx,vz,r:.25,waiting,saveUntil:0,cooldowns:{},still:0,age:0,launchLane:waiting,power:.65};this.balls.push(b);this.emit('balladd',{ball:b});return b;}
  startCharge(){if((this.state==='ready'||this.state==='playing')&&this.balls.some(b=>b.waiting)){this.charging=true;return true;}return false;}
  launch(){if(!this.charging)return false;this.charging=false;const b=this.balls.find(b=>b.waiting);if(!b)return false;b.waiting=false;b.power=this.charge;b.vz=-(20+this.charge*10);b.saveUntil=this.time+5;b.launchLane=true;this.state='playing';this.saved=false;this.launchCount++;this.charge=0;this.emit('launch');return true;}
  setFlipper(side,down){this.keys[side]=down;}
  clearInput(){this.keys=[false,false];this.charging=false;this.charge=0;}
  pause(){if(this.state==='gameover'||this.state==='paused')return;this.previousState=this.state;this.state='paused';this.clearInput();this.emit('pause');}
  resume(){if(this.state!=='paused')return;this.state=this.previousState;this.emit('resume');}
  nudge(){if(this.state!=='playing'||this.time<this.tiltUntil)return false;this.nudgeHeat+=1.04;if(this.nudgeHeat>=2.9){this.tiltUntil=this.time+3;this.nudgeHeat=3;this.keys=[false,false];this.emit('tilt');return false;}for(const b of this.balls){if(!b.waiting){b.vz-=3.9;b.vx+=(b.x>0?-1:1)*2.4;}}this.emit('nudge');return true;}
  award(base,id,x,z){if(this.time<this.tiltUntil)return;const newHit=id!==this.lastHit;if(this.time>this.comboUntil){this.combo=0;this.multiplier=1;}if(newHit){this.combo++;this.multiplier=Math.min(5,1+Math.floor(this.combo/3));}this.lastHit=id;this.comboUntil=this.time+3;const points=base*this.multiplier;this.score+=points;this.hitCount++;this.maxCombo=Math.max(this.maxCombo,this.multiplier);this.emit('score',{points,x,z,multiplier:this.multiplier,id});}
  hitTarget(index,b){if(this.targets[index]||this.multiball)return;this.targets[index]=true;this.award(250,'target'+index,b.x,b.z);this.emit('target',{index});if(this.targets.every(Boolean)){this.multiball=true;this.multiCount++;this.award(1000,'multi',0,-4);this.emit('multiball');for(const side of [-1,1]){const extra=this.addBall(side*.65,-6.8,side*5,7);extra.saveUntil=this.time+4;}}}
  finish(){if(this.state==='gameover')return;this.state='gameover';this.clearInput();this.emit('gameover');}
  collideSegment(b,ax,az,bx,bz,r=.14,bounce=.78){const p=closestPoint(b.x,b.z,ax,az,bx,bz),dx=b.x-p.x,dz=b.z-p.z,d=Math.hypot(dx,dz),min=b.r+r;if(d>=min)return null;let nx=dx/(d||1),nz=dz/(d||1);if(d<.0001){nx=-(bz-az);nz=bx-ax;const l=Math.hypot(nx,nz);nx/=l;nz/=l;}b.x=p.x+nx*(min+.001);b.z=p.z+nz*(min+.001);const dot=b.vx*nx+b.vz*nz;if(dot<0){b.vx-=(1+bounce)*dot*nx;b.vz-=(1+bounce)*dot*nz;}return {nx,nz,t:p.t,inward:dot<0};}
  step(dt){if(this.state==='paused'||this.state==='gameover')return;this.time+=dt;if(this.charging)this.charge=Math.min(1,this.charge+dt*.95);this.nudgeHeat=Math.max(0,this.nudgeHeat-dt*.32);if(this.time>this.comboUntil){this.combo=0;this.multiplier=1;}
    if(this.mode==='sprint'&&this.state==='playing'){this.remaining=Math.max(0,this.remaining-dt);if(this.remaining<=0){this.finish();return;}}
    const prev=[...this.flippers];for(let i=0;i<2;i++){const target=this.keys[i]&&this.time>=this.tiltUntil?1:0;this.flippers[i]+=Math.sign(target-this.flippers[i])*Math.min(Math.abs(target-this.flippers[i]),dt*(target?15:9));}
    for(const b of [...this.balls]){if(b.waiting)continue;b.age+=dt;b.vz+=6.8*dt;b.vx*=1-dt*.045;b.vz*=1-dt*.02;let speed=Math.hypot(b.vx,b.vz);if(speed>29){b.vx*=29/speed;b.vz*=29/speed;}b.x+=b.vx*dt;b.z+=b.vz*dt;
      if(b.launchLane&&b.z<-6.15){b.launchLane=false;b.x=4.35;b.vx=-6.5-b.power*4;b.vz=-5-b.power*6;}
      for(let i=0;i<WALLS.length;i++){const w=WALLS[i];const hit=this.collideSegment(b,...w);if(hit&&i>=10&&this.time>(b.cooldowns['sling'+i]||0)){b.vx+=(b.x<0?3.3:-3.3);b.vz-=2;this.award(25,'sling'+i,b.x,b.z);b.cooldowns['sling'+i]=this.time+.3;this.emit('sling',{index:i});}}
      for(let i=0;i<BUMPERS.length;i++){const m=BUMPERS[i];const dx=b.x-m.x,dz=b.z-m.z,d=Math.hypot(dx,dz),min=m.r+b.r;if(d<min){const nx=dx/(d||1),nz=dz/(d||1);b.x=m.x+nx*(min+.015);b.z=m.z+nz*(min+.015);const dot=b.vx*nx+b.vz*nz;if(dot<0){b.vx-=2*dot*nx;b.vz-=2*dot*nz;}b.vx+=nx*4.5;b.vz+=nz*4.5;if(this.time>(b.cooldowns['b'+i]||0)){b.cooldowns['b'+i]=this.time+.17;this.award(100,'bumper'+i,b.x,b.z);this.emit('bumper',{index:i,x:b.x,z:b.z});}}}
      for(let i=0;i<TARGETS.length;i++){const t=TARGETS[i];if(Math.hypot(b.x-t.x,b.z-t.z)<.78){this.hitTarget(i,b);if(this.time>(b.cooldowns['t'+i]||0)){b.cooldowns['t'+i]=this.time+.6;b.vz+=2.5;this.emit('targethit',{index:i});}}}
      if(Math.abs(b.x)<1.2&&b.z<-7.1&&this.time>(b.cooldowns.gate||0)){b.cooldowns.gate=this.time+2;this.award(this.multiball?2500:500,'gate',b.x,b.z);this.emit('gate',{jackpot:this.multiball});if(b.age<2)this.award(750,'skillshot',b.x,b.z);}
      for(let i=0;i<2;i++){const f=flipperSegment(i,this.flippers[i]);const contact=this.collideSegment(b,f.ax,f.az,f.bx,f.bz,.24,.78);if(contact&&b.z<7.5){const rising=this.flippers[i]>prev[i]+.001;if(rising&&this.time>(b.cooldowns['f'+i]||0)&&this.time>=this.tiltUntil){const p=Math.max(.2,contact.t);b.vz=-14-p*7;b.vx=(i===0?1:-1)*(2.5+p*5.5);b.cooldowns['f'+i]=this.time+.14;this.emit('flipperhit',{index:i});}}}
      if(b.z>10.05){const idx=this.balls.indexOf(b);if(idx>=0)this.balls.splice(idx,1);this.emit('ballremove',{id:b.id});if(this.time<b.saveUntil){const saved=this.addBall(5.18,7.7,0,-27);saved.launchLane=true;this.emit('saved');}continue;}
      if((Math.hypot(b.vx,b.vz)<.55&&!b.launchLane)||Math.abs(b.x)>6.4||b.z<-9.8){b.still+=dt;}else b.still=0;if(b.still>2.5||Math.abs(b.x)>7||b.z<-10.5){b.still=0;b.vx=-b.x*.65;b.vz=-8; if(Math.abs(b.x)>6.4||b.z<-9.8){b.x=0;b.z=-5;b.vx=3;b.vz=2;}this.emit('unstuck');}
    }
    if(this.multiball&&this.balls.length===1){this.multiball=false;this.targets=[false,false,false];this.emit('multiend');}
    if(this.balls.length===0&&this.state==='playing'){if(this.mode==='classic')this.lives--;if(this.lives<=0){this.finish();return;}this.combo=0;this.multiplier=1;this.targets=[false,false,false];this.multiball=false;this.addBall(5.18,8.1,0,0,true);this.emit('drain');}
  }
  snapshot(){return {state:this.state,mode:this.mode,score:this.score,lives:this.lives,remaining:Math.ceil(this.remaining),multiplier:this.multiplier,targets:[...this.targets],multiball:this.multiball,balls:this.balls.map(b=>({id:b.id,x:+b.x.toFixed(2),z:+b.z.toFixed(2),waiting:b.waiting})),maxCombo:this.maxCombo,hits:this.hitCount};}
}
