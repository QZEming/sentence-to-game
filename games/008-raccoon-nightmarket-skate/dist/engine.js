export const LANES = [-3.55, 0, 3.55];
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export function entitiesForChunk(c) {
  const a = [], base = c * 48, lane = c % 3 - 1;
  for (let i = 0; i < 6; i++) a.push({kind:'coin',lane,d:base + 7 + i * 4,y:1.05});
  a.push({kind:'ramen',lane:(c+2)%3-1,d:base+27,y:1.05});
  if(c>=1) a.push({kind:c%3===0?'gate':'crate',lane:(c+1)%3-1,d:base+17,y:0});
  if(c>=3 && c%2===1) a.push({kind:'crate',lane:(c+2)%3-1,d:base+23,y:0});
  if(c>=2) a.push({kind:'rail',lane:c%2===0?-1:1,d:base+7,y:.7,length:10});
  if(c>=2 && c%3!==2) a.push({kind:'ramp',lane:c%2===0?1:-1,d:base+31,y:0});
  if(c%4===3) a.push({kind:'magnet',lane:0,d:base+42,y:1.3});
  return a.map((o,i)=>({...o,id:c+':'+i,hit:false}));
}
export class Game {
  constructor(onEvent=()=>{}){this.onEvent=onEvent;this.reset('cruise');this.status='idle';}
  reset(mode){Object.assign(this,{mode,status:'running',distance:0,time:0,score:0,lives:3,energy:35,lane:0,x:0,y:0,vy:0,speed:9,combo:0,comboTime:0,multiplier:1,tricked:false,trickPending:false,trickAnim:0,duck:false,boost:0,invincible:2,magnet:0,grind:0,railId:null,ramen:0,tricks:0,grindTime:0,boosts:0,coins:0,falling:false,lastChunk:-1,entities:[],completed:new Set(),missionDone:0});this.fill();}
  emit(type,data={}){this.onEvent(type,data);}
  fill(){const end=Math.floor(this.distance/48)+6;while(this.lastChunk<end)this.entities.push(...entitiesForChunk(++this.lastChunk));this.entities=this.entities.filter(e=>e.d>this.distance-20);}
  action(action){if(this.status!=='running')return;if(action==='left'||action==='right'){this.lane=clamp(this.lane+(action==='left'?-1:1),-1,1);if(this.railId){this.railId=null;this.vy=2;}return;}
    if(action==='jump'){if(this.falling)return;if(this.y<.08||this.railId){this.vy=11.9;this.y=Math.max(this.y,.03);this.tricked=false;this.trickPending=false;this.railId=null;this.duck=false;this.emit('jump');}else if(!this.tricked){this.tricked=true;this.trickPending=true;this.trickAnim=.55;this.emit('trick');}return;}
    if(action==='boost'){if(this.energy>=50&&this.boost<=0){this.energy-=50;this.boost=4;this.boosts++;this.invincible=4.8;this.falling=false;if(this.y<0){this.y=0;this.vy=0;}this.emit('boost');}else if(this.boost<=0)this.emit('hint',{text:'收集拉面，能量达到 50 即可冲刺'});}
  }
  reward(points,label){this.combo++;this.comboTime=4.5;this.multiplier=Math.min(8,1+Math.floor(this.combo/4));const n=Math.round(points*this.multiplier);this.score+=n;if(label)this.emit('reward',{label,points:n});}
  hit(kind){if(this.invincible>0||this.status!=='running')return;this.combo=0;this.comboTime=0;this.multiplier=1;this.trickPending=false;this.railId=null;this.falling=false;this.y=0;this.vy=0;this.invincible=2.8;if(this.mode!=='practice')this.lives--;this.emit('hit',{kind,lives:this.lives});if(this.lives<=0){this.status='over';this.emit('over');}}
  update(dt){if(this.status!=='running')return;dt=Math.min(dt,.04);this.time+=dt;const old=this.distance;this.speed=(this.mode==='practice'?9:Math.min(17,9+this.distance/220))*(this.boost>0?1.55:1);this.distance+=this.speed*dt;this.score+=(this.distance-old)*2;this.x+=(LANES[this.lane+1]-this.x)*Math.min(1,dt*14);this.invincible=Math.max(0,this.invincible-dt);this.boost=Math.max(0,this.boost-dt);this.magnet=Math.max(0,this.magnet-dt);this.trickAnim=Math.max(0,this.trickAnim-dt);this.comboTime=Math.max(0,this.comboTime-dt);if(!this.comboTime){this.combo=0;this.multiplier=1;}
    this.fill();let rail=this.entities.find(e=>e.id===this.railId);
    if(rail&&(this.distance>rail.d+rail.length||Math.abs(this.x-LANES[rail.lane+1])>1)){this.railId=null;this.vy=1;rail=null;this.reward(70,'RAIL EXIT');}
    if(rail){this.y=.73;this.vy=0;this.grindTime+=dt;this.score+=65*dt*this.multiplier;this.comboTime=4.5;}else{this.vy-=30*dt;this.y+=this.vy*dt;}
    const phase=this.distance%48,c=Math.floor(this.distance/48),gap=c>=2&&phase>34&&phase<36;
    const bridgeX=LANES[c%3];const supported=!gap||Math.abs(this.x-bridgeX)<1.2||this.invincible>0;
    if(this.y<=0&&!this.railId){if(supported&&!this.falling){this.y=0;this.vy=0;if(this.trickPending){this.trickPending=false;this.tricks++;this.reward(180,'KICKFLIP');this.emit('land');}this.tricked=false;}else{this.falling=true;if(this.y< -2.8){if(this.invincible<=0)this.hit('gap');else{this.y=0;this.vy=0;this.falling=false;}}}}
    for(const e of this.entities){if(e.hit)continue;const diff=e.d-this.distance, aligned=Math.abs(this.x-LANES[e.lane+1])<1.22;
      if(e.kind==='rail'){if(aligned&&!this.railId&&!this.falling&&diff<.5&&diff> -e.length&&this.y>.28&&this.y<1.2&&this.vy<=0){this.railId=e.id;this.y=.73;this.vy=0;this.trickPending=false;this.tricked=false;this.reward(100,'50–50 GRIND');this.emit('grind');}continue;}
      if(e.kind==='coin'||e.kind==='ramen'||e.kind==='magnet'){const near=aligned&&Math.abs(diff)<1.15&&Math.abs(this.y+.85-e.y)<1.6;const magnetic=e.kind==='coin'&&this.magnet>0&&Math.abs(diff)<7;if((near||magnetic)&&!this.falling){e.hit=true;if(e.kind==='coin'){this.coins++;this.energy=Math.min(100,this.energy+1.5);this.reward(25);this.emit('coin');}else if(e.kind==='ramen'){this.ramen++;this.energy=Math.min(100,this.energy+20);this.reward(120);this.emit('ramen');}else{this.magnet=10;this.emit('magnet');}}continue;}
      if(diff<.65&&diff> -1&&aligned&&!this.falling){if(e.kind==='ramp'&&this.y<.18){this.vy=12.6;this.y=.05;this.tricked=false;this.emit('ramp');e.hit=true;}else if(e.kind==='crate'&&this.y<1.0){if(this.invincible<=0){e.hit=true;this.hit('crate');}}else if(e.kind==='gate'&&(this.y>.2||!this.duck)){if(this.invincible<=0){e.hit=true;this.hit('gate');}}}
    }
    [[this.ramen>=12,'ramen'],[this.tricks>=5,'trick'],[this.grindTime>=8,'grind']].forEach(([done,key])=>{if(done&&!this.completed.has(key)){this.completed.add(key);this.missionDone++;this.score+=1000;this.emit('mission',{key});}});
    if(this.mode==='timed'&&this.time>=120&&this.status==='running'){this.status='over';this.emit('over');}
  }
}
