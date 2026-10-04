export const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export const angleTo=(a,b)=>((Math.atan2(b.x-a.x,a.z-b.z)*180/Math.PI)+360)%360;
export const angleDiff=(a,b)=>((a-b+540)%360)-180;
export const MISSIONS=[
 {id:'silent',name:'无声猎手',sector:'北大西洋 · 挪威海盆',tag:'巡猎行动',difficulty:'标准',desc:'一支敌方补给编队正在穿越海盆。穿过护航警戒，击沉补给舰，然后驶入撤离区。',goal:'击沉补给舰后撤离',targets:1,minutes:12,extract:{x:-260,z:150},enemies:[{id:'S01',type:'destroyer',name:'阿尔法号 · 驱逐舰',x:-160,z:-260,heading:110},{id:'S02',type:'cargo',name:'北辰号 · 补给舰',x:60,z:-230,heading:105},{id:'S03',type:'frigate',name:'奥斯卡号 · 护卫舰',x:250,z:-190,heading:85}]},
 {id:'hunter',name:'猎人与猎物',sector:'格陵兰海 · 冰缘海域',tag:'反潜行动',difficulty:'困难',desc:'海盆中有两艘敌方攻击潜艇。分析低频信号，保持航速克制，在被发现前夺得先机。',goal:'击沉两艘攻击潜艇',targets:2,minutes:14,extract:null,enemies:[{id:'S01',type:'sub',name:'回声号 · 攻击潜艇',x:-150,z:-200,heading:120,depth:160},{id:'S02',type:'sub',name:'幽灵号 · 攻击潜艇',x:220,z:-320,heading:240,depth:230},{id:'S03',type:'frigate',name:'守望号 · 护卫舰',x:350,z:-80,heading:270}]},
 {id:'passage',name:'深渊穿越',sector:'法罗海峡 · 封锁线',tag:'隐蔽行动',difficulty:'进阶',desc:'敌方封锁了北部海峡。保持低噪声，利用 180 米温跃层穿过三处航路点。暴露超过 85% 将导致任务失败。',goal:'保持隐蔽，通过全部航路点',targets:0,minutes:10,extract:null,enemies:[{id:'S01',type:'destroyer',name:'猎隼号 · 驱逐舰',x:-150,z:-150,heading:80},{id:'S02',type:'frigate',name:'巡游号 · 护卫舰',x:180,z:-340,heading:230},{id:'S03',type:'destroyer',name:'北风号 · 驱逐舰',x:-100,z:-540,heading:130}],waypoints:[{x:50,z:-140},{x:-100,z:-310},{x:70,z:-500}]}
];
const typeLabel={destroyer:'驱逐舰',cargo:'补给舰',frigate:'护卫舰',sub:'攻击潜艇'};
export class Simulation{
 constructor(mission='silent'){this.reset(mission)}
 reset(id){
  this.mission=MISSIONS.find(m=>m.id===id)||MISSIONS[0];this.status='ready';this.time=0;this.timeScale=1;this.tickTime=0;this.nextId=1;this.selected=null;this.events=[];this.logs=[];
  this.player={x:0,z:30,heading:0,desiredHeading:0,speed:5,desiredSpeed:5,depth:120,desiredDepth:120,hull:100,battery:100,oxygen:100,noise:24,exposure:0,silent:false,torpedoes:8,decoys:4};
  this.enemies=this.mission.enemies.map((e,i)=>({...e,depth:e.depth||8,alive:true,health:e.type==='destroyer'?2:1,speed:e.type==='cargo'?2.3:3,confidence:i===1?.4:i===0?.2:0,known:i<2,revealed:0,lastPing:-40,cooldown:20+i*8,state:'巡航',patrol:e.heading,turnTimer:20+i*10,lastKnown:null,lastContact:{x:e.x,z:e.z,depth:e.depth||8,time:0}}));
  this.torpedoes=[];this.charges=[];this.decoys=[];this.pulses=[];this.effects=[];this.pingCooldown=0;this.fireCooldown=0;this.decoyCooldown=0;this.sunk=0;this.targetSunk=0;this.waypoint=0;this.maxExposure=0;this.lastDamage=-100;this.result=null;this.log('舰长，作战海域已就绪。启动巡航后开始计时。','info');
 }
 log(text,kind='info'){this.logs.unshift({time:this.time,text,kind});this.logs=this.logs.slice(0,30);this.events.push({type:'log',text,kind})}
 start(){if(this.status==='ready'){this.status='playing';this.log('进入作战海域。声呐站开始被动监听。','info');return true}return false}
 togglePause(){if(this.status==='playing')this.status='paused';else if(this.status==='paused')this.status='playing';return this.status}
 setSpeed(n){this.player.desiredSpeed=clamp(Number(n)||0,0,this.player.silent?5:25)}
 setDepth(n){this.player.desiredDepth=clamp(Number(n)||0,35,380)}
 setHeading(n){this.player.desiredHeading=((Number(n)||0)%360+360)%360}
 toggleSilent(){const p=this.player;p.silent=!p.silent;if(p.silent)p.desiredSpeed=Math.min(5,p.desiredSpeed);this.log(p.silent?'全艇静默：限制航速至 5 节。':'解除静默航行。');return p.silent}
 select(id){if(this.enemies.some(e=>e.id===id&&e.known&&e.alive)){this.selected=id;return true}return false}
 ping(){if(this.status!=='playing')return {ok:false,reason:'请先启动巡航'};if(this.pingCooldown>0)return{ok:false,reason:'声呐正在充能'};
  this.pingCooldown=12;this.player.exposure=clamp(this.player.exposure+28,0,100);this.pulses.push({x:this.player.x,z:this.player.z,r:0,life:4});this.player.battery=Math.max(0,this.player.battery-.7);
  this.enemies.filter(e=>e.alive&&distance(e,this.player)<650).forEach(e=>{e.known=true;e.confidence=Math.min(1,e.confidence+.68);e.revealed=18;e.lastPing=this.time;e.lastContact={x:e.x,z:e.z,depth:e.depth,time:this.time};e.lastKnown={x:this.player.x,z:this.player.z,depth:this.player.depth,time:this.time};});this.log('主动声呐脉冲已发出。目标距离解算更新；敌方可能截获信号。','warn');this.events.push({type:'ping'});return {ok:true};
 }
 fire(){if(this.status!=='playing')return{ok:false,reason:'请先启动巡航'};let target=this.enemies.find(e=>e.id===this.selected&&e.alive);if(!target)return{ok:false,reason:'在接触列表或声呐图上选择一个目标'};if(target.confidence<.62)return{ok:false,reason:'解算不足 62%，降低航速监听或主动扫描'};if(distance(target,this.player)>650)return{ok:false,reason:'目标超出鱼雷射程（6.5 千米）'};if(!this.player.torpedoes)return{ok:false,reason:'鱼雷已用尽'};if(this.fireCooldown>0)return{ok:false,reason:'发射管正在重新装填'};
  this.player.torpedoes--;this.fireCooldown=9;this.player.exposure=clamp(this.player.exposure+15,0,100);this.torpedoes.push({id:this.nextId++,x:this.player.x,z:this.player.z,depth:this.player.depth,heading:angleTo(this.player,target),target:target.id,hostile:false,life:65,trail:[]});this.log(`鱼雷离管，追踪 ${target.id}。`,'success');this.events.push({type:'launch'});return{ok:true};
 }
 deployDecoy(){if(this.status!=='playing')return{ok:false,reason:'请先启动巡航'};if(this.player.decoys<=0)return{ok:false,reason:'诱饵已用尽'};if(this.decoyCooldown>0)return{ok:false,reason:'诱饵发射器正在准备'};this.player.decoys--;this.decoyCooldown=10;this.decoys.push({x:this.player.x,z:this.player.z,depth:this.player.depth,life:18,id:this.nextId++});this.log('声学诱饵已释放。立即转向，改变深度脱离。','warn');this.events.push({type:'decoy'});return{ok:true}}
 repair(){if(this.status!=='playing')return{ok:false,reason:'请先启动巡航'};if(this.player.hull>=99)return{ok:false,reason:'艇体状态良好'};if(this.player.battery<15)return{ok:false,reason:'电量不足 15%'};this.player.battery-=15;this.player.hull=clamp(this.player.hull+20,0,100);this.log('损管班完成紧急修复，艇体完整度恢复 20%。','success');return{ok:true}}
 finish(won,reason){if(this.status==='won'||this.status==='lost')return;this.status=won?'won':'lost';this.result={won,reason,score:Math.max(0,Math.round((won?1200:0)+this.sunk*400+this.player.hull*5+(100-this.maxExposure)*4-this.time)),rank:won?(this.maxExposure<40?'幽灵舰长':this.player.hull>65?'深海猎手':'幸存者'):'重新出航'};this.log(reason,won?'success':'danger');this.events.push({type:'end',won})}
 step(realDt){if(this.status!=='playing')return;const dt=Math.min(.1,Math.max(0,realDt))*this.timeScale;this.time+=dt;this.tickTime+=dt;const p=this.player;
  p.speed+=(p.desiredSpeed-p.speed)*Math.min(1,dt*.45);p.heading=(p.heading+clamp(angleDiff(p.desiredHeading,p.heading),-dt*11,dt*11)+360)%360;p.depth+=clamp(p.desiredDepth-p.depth,-dt*3.5,dt*3.5);const rad=p.heading*Math.PI/180;p.x+=Math.sin(rad)*p.speed*.38*dt;p.z-=Math.cos(rad)*p.speed*.38*dt;
  p.noise=clamp(9+p.speed*2.8+(p.speed>14?(p.speed-14)*3:0)+(p.silent?-10:0)+(Math.abs(p.desiredDepth-p.depth)>3?7:0),4,100);
  p.battery=clamp(p.battery-(.011+p.speed*p.speed*.00018)*dt+(p.depth<45?.07*dt:0),0,100);p.oxygen=clamp(p.oxygen-.045*dt+(p.depth<45?.3*dt:0),0,100);if(p.battery<=0)p.desiredSpeed=Math.min(3,p.desiredSpeed);
  let threat=0;
  this.enemies.forEach(e=>{if(!e.alive)return;const d=distance(p,e);const thermal=(p.depth>180&&e.depth<170)||(p.depth<170&&e.depth>180);const listenRange=e.type==='cargo'?650:e.type==='sub'?440:540;
   const signal=clamp((1-d/listenRange)*(1-p.noise/115)*(thermal?.66:1),0,1);if(signal>.12){e.known=true;e.lastContact={x:e.x,z:e.z,depth:e.depth,time:this.time};e.confidence=clamp(e.confidence+dt*(.008+signal*.024),0,1)}else e.confidence=Math.max(e.known?.08:0,e.confidence-dt*.003);
   e.revealed=Math.max(0,e.revealed-dt);e.cooldown-=dt;e.turnTimer-=dt;
   if(e.type!=='cargo'){const detect=clamp((1-d/480)*(p.noise/70)*(thermal?.3:1),0,1);threat=Math.max(threat,detect);if(p.depth<45&&d<250)threat=Math.max(threat,.7);if(detect>.3||(p.exposure>58&&detect>.16)||(p.depth<45&&d<200))e.lastKnown={x:p.x,z:p.z,depth:p.depth,time:this.time};
    if(p.exposure>58&&e.lastKnown&&this.time-e.lastKnown.time<40&&distance(e,e.lastKnown)<600){e.state='搜索';e.heading=angleTo(e,e.lastKnown);e.speed=4.2;if(p.exposure>76&&this.time-e.lastKnown.time<10&&d<450){e.state='攻击';if(e.cooldown<=0){e.cooldown=30+(e.type==='sub'?0:8);if(e.type==='sub'||d>100){this.torpedoes.push({id:this.nextId++,x:e.x,z:e.z,depth:e.depth,heading:angleTo(e,p),target:'player',hostile:true,life:60,trail:[]});this.log(`${e.id} 发射反潜鱼雷！释放诱饵并规避。`,'danger');this.events.push({type:'alarm'})}else{this.charges.push({x:e.lastKnown.x+Math.sin(this.time)*18,z:e.lastKnown.z+Math.cos(this.time)*18,depth:5,targetDepth:e.lastKnown.depth,life:14});this.log('检测到深水炸弹入水！改变航向。','danger')}}}}
    else{e.state='巡航';e.speed=e.type==='sub'?2:3;if(e.turnTimer<=0){e.turnTimer=30;e.heading=(e.heading+100)%360;}}
   }
   e.x+=Math.sin(e.heading*Math.PI/180)*e.speed*dt;e.z-=Math.cos(e.heading*Math.PI/180)*e.speed*dt;if(Math.abs(e.x)>600||Math.abs(e.z)>750)e.heading=angleTo(e,{x:0,z:-200});
  });
  p.exposure=clamp(p.exposure+((threat>.2?(threat-.2)*7:-1.1)-(p.silent?.35:0)-(p.depth>180?.2:0))*dt,0,100);this.maxExposure=Math.max(this.maxExposure,p.exposure);
  if(p.depth>320){p.hull-=.09*dt;if(this.tickTime>=12)this.log('超过安全潜深，艇壳持续承受高压。','warn')}
  this.pingCooldown=Math.max(0,this.pingCooldown-dt);this.fireCooldown=Math.max(0,this.fireCooldown-dt);this.decoyCooldown=Math.max(0,this.decoyCooldown-dt);
  this.torpedoes.forEach(t=>{t.life-=dt;let target=t.hostile?p:this.enemies.find(e=>e.id===t.target&&e.alive);if(t.hostile){const decoy=this.decoys.find(d=>d.life>0&&distance(t,d)<180);if(decoy)target=decoy}if(!target){t.life=0;return}t.heading=(t.heading+clamp(angleDiff(angleTo(t,target),t.heading),-dt*52,dt*52)+360)%360;t.depth+=clamp(target.depth-t.depth,-dt*16,dt*16);const speed=t.hostile?13:20;t.x+=Math.sin(t.heading*Math.PI/180)*speed*dt;t.z-=Math.cos(t.heading*Math.PI/180)*speed*dt;t.trail.push({x:t.x,z:t.z,depth:t.depth});if(t.trail.length>35)t.trail.shift();
   if(distance(t,target)<9&&Math.abs(t.depth-target.depth)<22){t.life=0;this.effects.push({x:t.x,z:t.z,depth:t.depth,life:2,type:'explosion'});this.events.push({type:'explosion'});if(t.hostile){if(target===p){p.hull-=30;this.lastDamage=this.time;this.log('鱼雷命中！艇体损伤 30%。','danger')}else{target.life=0;this.log('诱饵成功截获敌方鱼雷。','success')}}else{target.health--;if(target.health<=0){target.alive=false;this.sunk++;if((this.mission.id==='silent'&&target.type==='cargo')||(this.mission.id==='hunter'&&target.type==='sub'))this.targetSunk++;this.log(`${target.id} ${typeLabel[target.type]}已击沉。`,'success');if(this.mission.id==='silent'&&this.targetSunk>=1)this.log('主要目标摧毁。前往海图西南侧绿色撤离区。','success')}else this.log(`${target.id} 已受损，需要再次攻击。`,'warn')}}
  });this.torpedoes=this.torpedoes.filter(t=>t.life>0);
  this.charges.forEach(c=>{c.depth+=dt*23;c.life-=dt;if(c.depth>=c.targetDepth){c.life=0;this.effects.push({...c,life:2,type:'explosion'});if(distance(c,p)<45&&Math.abs(c.depth-p.depth)<55){p.hull-=20;this.lastDamage=this.time;this.log('深水炸弹冲击！艇体损伤 20%。','danger')}}});this.charges=this.charges.filter(c=>c.life>0);
  this.decoys.forEach(d=>d.life-=dt);this.decoys=this.decoys.filter(d=>d.life>0);this.pulses.forEach(v=>{v.life-=dt;v.r+=dt*170});this.pulses=this.pulses.filter(v=>v.life>0);this.effects.forEach(e=>e.life-=dt);this.effects=this.effects.filter(e=>e.life>0);
  if(this.mission.targets>0&&this.targetSunk<this.mission.targets&&p.torpedoes===0&&!this.torpedoes.some(t=>!t.hostile)){this.finish(false,'鱼雷已用尽，无法完成剩余打击目标。')}
  if(this.mission.waypoints?.[this.waypoint]&&distance(p,this.mission.waypoints[this.waypoint])<48){this.waypoint++;this.log(`航路点 ${this.waypoint}/3 已通过。`,'success')}
  if(p.hull<=0)this.finish(false,'艇体失效。舰艇失去作战能力。');else if(p.oxygen<=0)this.finish(false,'氧气储备耗尽。');else if(this.time>=this.mission.minutes*60)this.finish(false,'任务窗口已结束。');else if(this.mission.id==='passage'&&p.exposure>=85)this.finish(false,'隐蔽行动失败：敌方已确认我艇位置。');else if(this.mission.id==='passage'&&this.waypoint>=3)this.finish(true,'成功穿越封锁线。没有人知道你曾来过。');else if(this.targetSunk>=this.mission.targets&&this.mission.targets>0){if(!this.mission.extract||distance(p,this.mission.extract)<55)this.finish(true,'作战目标完成，潜艇安全撤离。')}
  if(Math.hypot(p.x,p.z)>1100){this.setHeading(angleTo(p,{x:0,z:0}));if(this.tickTime>=12)this.log('接近作战海域边缘，已自动调整返航航向。','warn')}
  if(this.tickTime>12)this.tickTime=0;
 }
 save(){return JSON.stringify({version:1,missionId:this.mission.id,...Object.fromEntries(Object.entries(this).filter(([k])=>k!=='mission'&&k!=='events'))})}
 static restore(raw){const data=JSON.parse(raw);if(data.version!==1||!MISSIONS.some(m=>m.id===data.missionId)||!data.player||!Array.isArray(data.enemies)||!Number.isFinite(data.time))throw Error('存档格式无效');const s=new Simulation(data.missionId);for(const k of Object.keys(s))if(k in data&&k!=='mission'&&k!=='events')s[k]=data[k];s.status=['won','lost','ready'].includes(s.status)?s.status:'paused';s.events=[];return s}
}
