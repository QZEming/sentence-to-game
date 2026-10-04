const fs=require('fs'),vm=require('vm');
const path=require('path');
const logic=fs.readFileSync(path.join(__dirname,'../dist/physics.mjs'),'utf8').replace(/export \{[^}]+\};/, '');
vm.runInThisContext(logic);
const dt=1/120;
function step(s,k,n=1){for(let i=0;i<n;i++){gameStep(s,k,dt);s.events=[];}}
function steer(s,x,z,steady=true){const k=steady?{ShiftLeft:true}:{};const ex=x-s.x-s.vx*.11,ez=z-s.z-s.vz*.11;if(ex>.035)k.KeyD=true;if(ex<-.035)k.KeyA=true;if(ez>.035)k.KeyS=true;if(ez<-.035)k.KeyW=true;return k;}
function move(s,x,z,opts={}){const start=s.time;let jumped=false;while(s.time-start<(opts.timeout||8)&&s.status==='playing'){const k=steer(s,x,z,opts.steady!==false);if(opts.jump&&!jumped){s.jumpBuffer=.14;jumped=true;}step(s,k);if(Math.hypot(x-s.x,z-s.z)<(opts.tolerance||.1)&&s.grounded&&Math.hypot(s.vx,s.vz)<.8) return true;}return s.status==='won';}
function pose(s){let start=s.time;const p=LEVELS[s.level].platforms.find(p=>p.checkpoint);while(!s.poseDone&&s.time-start<8)step(s,steer(s,p.x,p.z));return s.poseDone;}
const routes=[[[0,2],[0,-1.7,'pose'],[1,-1.7],[0,-3],[0,-5.7],[0,-8.7]], [[-1,4],[-1,1.8],[-1,-1,'pose'],[1,-1],[1,-3.6],[1,-6],[1.8,-6],[0,-6],[0,-9]], [[0,3.3],[0,1.5,'jump'],[.8,.5],[1.5,-2.2,'jump_pose'],[.6,-3.2],[-1,-5.8,'jump'],[-1,-6.7],[0,-9.3,'jump']], [[0,1.5],[0,-1.5,'pose'],[-1,-1.5],[0,-2.8],[0,-5.4,'jump'],[0,-8.7]], [[-1,4],[-1,1.7],[-1,-1,'pose'],[-.2,-1.9],[1,-4,'jump'],[1,-5.3],[1,-7.1,'jump'],[0,-9]]];
for(let index=0;index<5;index++){let s=newState(index);s.status='playing';const segments=[];for(const [x,z,type=''] of routes[index]){let ok=move(s,x,z,{jump:type.includes('jump')});if(type.includes('pose'))ok=pose(s)&&ok;segments.push({target:[x,z],ok,pos:[s.x,s.z,s.y].map(x=>+x.toFixed(2)),time:+s.time.toFixed(2),falls:s.falls});if(!ok)break;}if(s.status!=='won'||s.falls!==0||s.stars.some(x=>!x)||!s.poseDone) throw new Error('Act '+(index+1)+' failed: '+JSON.stringify(segments));console.log(JSON.stringify({level:index+1,status:s.status,stars:s.stars.filter(Boolean).length,score:s.score,falls:s.falls,pose:s.poseDone}));}
