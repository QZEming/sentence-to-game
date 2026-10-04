export const R=.64;
export const rooms=[{name:'积木客厅',goal:'踩下薄荷色按钮，打开积木门',color:0x56bfa8},{name:'音乐厨房',goal:'从左到右点亮三块彩色琴键',color:0xf3bc57},{name:'云朵卧室',goal:'找到月亮钥匙，唤醒终点星门',color:0xaf9ddb}];
export const boxes=[
{x:-40,z:0,w:.7,d:46,h:11},{x:40,z:0,w:.7,d:46,h:11},{x:0,z:-23,w:80,d:.7,h:12},
{x:-13,z:-9.5,w:.7,d:27,h:3},{x:-13,z:17.5,w:.7,d:11,h:3},{x:13,z:-9.5,w:.7,d:27,h:3},{x:13,z:17.5,w:.7,d:11,h:3},
{x:-32,z:-17,w:11,d:5,h:4},{x:-19,z:-17,w:6,d:6,h:5},{x:-19,z:15,w:4,d:4,h:2.3},
{x:-4,z:-17,w:.7,d:.7,h:5},{x:4,z:-17,w:.7,d:.7,h:5},{x:-4,z:-20,w:.7,d:.7,h:5},{x:4,z:-20,w:.7,d:.7,h:5},
{x:8,z:-18,w:5,d:5,h:6},{x:35,z:8,w:5,d:7,h:4},{x:18,z:-17,w:4,d:6,h:5},
];
export const pads=[{x:-7,z:-9,color:0xf78fa6},{x:0,z:-9,color:0xf9cf58},{x:7,z:-9,color:0x79cad8}];
export const bumpers=[{x:-21,z:2,r:1.1},{x:-33,z:6,r:1.05},{x:26,z:5,r:1.1},{x:29,z:1,r:1.1}];
export const starPositions=[[-30,10],[-28,5],[-26,0],[-24,-5],[-24,-13],[-20,-8],[-18,-2],[-17,7],[-35,-8,3.5],[-35,-10,3.5],[-36,15],[-23,17],[-9,8],[-9,1],[-7,-5],[-4,-9],[0,-5],[4,-9],[7,-5],[9,1],[8,11],[1,14],[-7,14],[0,-19],[17,8],[20,4],[21,-1],[24,-4],[28,-5],[33,-5],[22,-9,4],[26,-16,5.5],[31,-16,5.5],[35,-17,5.5],[26,16],[33,16]];
export function groundAt(x,z){if(x < -39.65 || x >39.65 || z < -22.65 || z >22.65)return -30;if(x>=-10.3&&x<=10.3&&z>=-11&&z<=-7)return .7;if(x>=-37&&x<=-33&&z>=-11&&z<=4)return z>=-5?(4-z)/9*2.5:2.5;if(x>=20&&x<=24&&z>=-12&&z<=-3)return(-3-z)/9*4.93;if(x>=22&&x<=36&&z>=-21&&z<=-12)return 4.93;return 0;}
export class Game{
constructor(onEvent=()=>{}){this.onEvent=onEvent;this.reset('adventure');}
reset(mode='adventure'){this.mode=mode;this.status='menu';this.pos={x:-30,y:R,z:15};this.vel={x:0,y:0,z:0};this.badges=[false,false,false];this.stars=starPositions.map((p,i)=>({x:p[0],y:p[2]??1.1,z:p[1],taken:false,id:i}));this.collected=0;this.lives=5;this.elapsed=0;this.room=0;this.piano=0;this.dashCd=0;this.invincible=0;this.springCd=0;this.jumpCd=0;this.checkpoint={x:-30,z:15};this.deaths=0;this.grounded=true;this.lastPad=-1;this.stepTime=0;this.bumpCd=0;this.goalHint=0;}
emit(type,data){this.onEvent(type,data);}
start(mode){this.reset(mode);this.status='playing';this.emit('start');}
respawn(hurt=false){this.pos={x:this.checkpoint.x,y:groundAt(this.checkpoint.x,this.checkpoint.z)+R+.05,z:this.checkpoint.z};this.vel={x:0,y:0,z:0};this.grounded=true;this.invincible=2;this.jumpCd=.2;if(hurt){this.deaths++;this.lives--;this.elapsed+=this.mode==='time'?5:0;if(this.lives<=0){this.lives=5;this.emit('toast','重新整装出发！机关进度已保留');}else this.emit('toast','返回检查点 · 小心边缘'+(this.mode==='time'?' · +5 秒':''));}else this.emit('toast','已回到最近的检查点');this.emit('respawn');}
hit(dx,dz){if(this.invincible>0)return;this.lives--;this.invincible=1.5;let len=Math.hypot(dx,dz)||1;this.vel.x=dx/len*13;this.vel.z=dz/len*13;this.vel.y=5;this.grounded=false;this.emit('hit');if(this.lives<=0){this.lives=5;this.deaths++;this.respawn();this.emit('toast','重新整装出发！机关进度已保留');}}
collide(b){if(this.pos.y-R>=b.h-.08)return;let cx=Math.max(b.x-b.w/2,Math.min(this.pos.x,b.x+b.w/2)),cz=Math.max(b.z-b.d/2,Math.min(this.pos.z,b.z+b.d/2));let dx=this.pos.x-cx,dz=this.pos.z-cz,len=Math.hypot(dx,dz);if(len>=R)return;if(len<.0001){const left=this.pos.x-(b.x-b.w/2),right=b.x+b.w/2-this.pos.x,near=this.pos.z-(b.z-b.d/2),far=b.z+b.d/2-this.pos.z;const m=Math.min(left,right,near,far);if(m===left){dx=-1;this.pos.x=b.x-b.w/2-R;}else if(m===right){dx=1;this.pos.x=b.x+b.w/2+R;}else if(m===near){dz=-1;this.pos.z=b.z-b.d/2-R;}else{dz=1;this.pos.z=b.z+b.d/2+R;}len=1;}else{this.pos.x+=dx/len*(R-len);this.pos.z+=dz/len*(R-len);}const nx=dx/len,nz=dz/len,dot=this.vel.x*nx+this.vel.z*nz;if(dot<0){this.vel.x-=dot*1.3*nx;this.vel.z-=dot*1.3*nz;}}
update(dt,input={}){if(this.status!=='playing')return;dt=Math.min(dt,1/30);this.elapsed+=dt;this.stepTime+=dt;this.dashCd=Math.max(0,this.dashCd-dt);this.invincible=Math.max(0,this.invincible-dt);this.springCd=Math.max(0,this.springCd-dt);this.jumpCd=Math.max(0,this.jumpCd-dt);this.bumpCd=Math.max(0,this.bumpCd-dt);this.goalHint=Math.max(0,this.goalHint-dt);
const ix=input.x||0,iz=input.z||0;const moving=Math.hypot(ix,iz);const ice=this.pos.x>-10&&this.pos.x<10&&this.pos.z>7&&this.pos.z<14;const friction=ice?.9:3.7;this.vel.x+=ix*27*dt;this.vel.z+=iz*27*dt;const drag=Math.exp(-(moving?friction*.48:friction)*dt);this.vel.x*=drag;this.vel.z*=drag;let speed=Math.hypot(this.vel.x,this.vel.z);const max=this.dashCd>2.5?22:9.2;if(speed>max){this.vel.x*=max/speed;this.vel.z*=max/speed;}
if(input.jump&&this.grounded&&this.jumpCd===0){this.vel.y=9.8;this.grounded=false;this.jumpCd=.35;this.emit('jump');}if(input.dash&&this.dashCd===0){let len=moving||Math.hypot(this.vel.x,this.vel.z)||1;let x=moving?ix:this.vel.x,z=moving?iz:this.vel.z;if(x===0&&z===0)z=-1;this.vel.x=x/len*22;this.vel.z=z/len*22;this.dashCd=3;this.emit('dash');}
const old={...this.pos};this.pos.x+=this.vel.x*dt;this.pos.z+=this.vel.z*dt;const floor=groundAt(this.pos.x,this.pos.z);const before=groundAt(old.x,old.z);if(floor>this.pos.y-R+.75&&floor-before>.75){this.pos.x=old.x;this.pos.z=old.z;this.vel.x*=-.2;this.vel.z*=-.2;}
for(const b of boxes)this.collide(b);for(let i=0;i<2;i++)if(!this.badges[i])this.collide({x:i===0?-13:13,z:8,w:.7,d:8,h:6});
this.vel.y-=24*dt;this.pos.y+=this.vel.y*dt;const g=groundAt(this.pos.x,this.pos.z);if(this.pos.y<=g+R&&this.vel.y<=0){this.pos.y=g+R;this.vel.y=0;this.grounded=true;}else this.grounded=false;if(this.pos.y<-7){this.respawn(true);return;}
if(this.pos.x>-11.9&&this.room===0){this.room=1;this.checkpoint={x:-9,z:8};this.emit('checkpoint',1);}if(this.pos.x>14.1&&this.room<2){this.room=2;this.checkpoint={x:17,z:8};this.emit('checkpoint',2);}
for(const s of this.stars){if(!s.taken&&Math.hypot(this.pos.x-s.x,this.pos.z-s.z,this.pos.y-s.y)<1.45){s.taken=true;this.collected++;this.emit('star',s);}}
if(!this.badges[0]&&Math.hypot(this.pos.x+24,this.pos.z+9)<2.1&&this.pos.y<2){this.badges[0]=true;this.emit('badge',0);}
if(this.badges[0]&&!this.badges[1]){let touching=-1;for(let i=0;i<pads.length;i++)if(Math.hypot(this.pos.x-pads[i].x,this.pos.z-pads[i].z)<1.9&&this.pos.y<2)touching=i;if(touching>=0&&touching!==this.lastPad){this.emit('note',touching);if(touching===this.piano){this.piano++;this.emit('toast',this.piano===3?'旋律完成！通往卧室的门打开了':`琴键 ${this.piano} / 3 · 接着踩右边的琴键`);if(this.piano===3){this.badges[1]=true;this.emit('badge',1);}}else if(touching>this.piano)this.emit('toast','从左到右，寻找正在闪烁的琴键');}this.lastPad=touching;}
if(this.badges[1]&&!this.badges[2]&&Math.hypot(this.pos.x-21,this.pos.z+1)<1.8){this.badges[2]=true;this.emit('badge',2);}
if(Math.hypot(this.pos.x-35,this.pos.z+5)<2.2&&this.badges.every(Boolean)){this.status='won';this.emit('win');return;}
if(this.springCd===0&&Math.hypot(this.pos.x+35,this.pos.z-10)<1.8&&this.pos.y<1.5){this.vel.y=15;this.grounded=false;this.springCd=.8;this.emit('spring');}
for(const b of bumpers){const dx=this.pos.x-b.x,dz=this.pos.z-b.z,d=Math.hypot(dx,dz);if(d<b.r+R&&this.pos.y<2.6){this.pos.x=b.x+dx/(d||1)*(b.r+R);this.pos.z=b.z+dz/(d||1)*(b.r+R);this.vel.x=dx/(d||1)*13;this.vel.z=dz/(d||1)*13;this.vel.y=3;if(this.bumpCd===0){this.emit('bumper');this.bumpCd=.3;}}}
const angle=this.stepTime*.85,rx=Math.cos(angle),rz=Math.sin(angle);const along=Math.max(-5,Math.min(5,this.pos.x*rx+(this.pos.z-2)*rz));let dx=this.pos.x-rx*along,dz=this.pos.z-2-rz*along;if(Math.hypot(dx,dz)<R+.38&&this.pos.y<2.0&&Math.hypot(this.pos.x,this.pos.z-2)>1.2)this.hit(dx,dz);
const trainX=-26+Math.sin(this.stepTime*.5)*7;if(Math.abs(this.pos.x-trainX)<2.3&&Math.abs(this.pos.z-19)<1.2&&this.pos.y<2)this.hit(this.pos.x-trainX,this.pos.z-19);
if(this.pos.x>16&&this.pos.x<24&&this.pos.z>-5&&this.pos.z<4&&this.pos.y<3)this.vel.x+=8*dt;
if(this.pos.x>18&&this.pos.x<32&&this.pos.z>12&&this.pos.z<14&&this.grounded){this.vel.x+=20*dt;}
}
}
