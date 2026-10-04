export const LANES = {1:-2.2,2:2.2,3:8};
const cargo = ['集装箱','旅客','原木','煤炭','冷链','旅客','钢材','集装箱','旅客','煤炭','冷链','原木','旅客','钢材'];
export class RailGame {
 constructor(mode='standard'){this.reset(mode)}
 reset(mode='standard'){
  this.mode=mode;this.time=0;this.duration=300;this.running=false;this.started=false;this.ended=false;this.speed=1;this.score=0;this.money=0;this.delivered=0;this.onTime=0;this.safety=100;this.meets=0;this.switches={west:1,east:2};this.blocks={west:null,east:null};this.lanes={1:null,2:null,3:null};this.upgrades={loading:false,signals:false,bonus:false};this.claimed=[];this.logs=[];this.weather='晴朗';this.event='';this.selected='F101';this.lastMeet='';
  const schedule=[0,0,26,50,71,97,122,143,162,182,202,220,232,243];
  this.trains=schedule.map((t,i)=>({id:(cargo[i]==='旅客'?'K':'F')+(101+i),cargo:cargo[i],passenger:cargo[i]==='旅客',dir:i%2===0?1:-1,side:i%2===0?'west':'east',arrival:mode==='rush'?t*.82:t,deadline:Math.min(300,(mode==='rush'?t*.82:t)+(cargo[i]==='旅客'?60:78)),status:t===0?'queued':'scheduled',lane:null,progress:0,work:0,late:false,color:cargo[i]==='旅客'?'#67b5ef':i%3===0?'#edb15a':i%3===1?'#84b79d':'#e08766',reward:cargo[i]==='旅客'?180:240,transit:cargo[i]==='煤炭'?18:14}));
  this.log('线路就绪，请先为两端列车分配不同股道。','info');
 }
 log(text,type='info'){this.logs.unshift({text,type,time:this.time});this.logs=this.logs.slice(0,24)}
 get active(){return this.trains.filter(t=>!['scheduled','done'].includes(t.status))}
 get selectedTrain(){return this.trains.find(t=>t.id===this.selected)}
 get remaining(){return Math.max(0,this.duration-this.time)}
 get punctuality(){return this.delivered?Math.round(this.onTime/this.delivered*100):100}
 get difficulty(){return this.mode==='rush'?'高峰挑战':this.mode==='night'?'夜间值守':'山谷早班'}
 get exitSide(){return this.selectedTrain?.dir===1?'east':'west'}
 setSwitch(side,lane){
  if(!['west','east'].includes(side)||![1,2,3].includes(lane))return {ok:false,message:'无效的道岔设置'};
  if(this.switches[side]===lane)return {ok:true,message:'进路已对齐'};
  if(this.blocks[side])return {ok:false,message:`${side==='west'?'西':'东'}端进路锁定：${this.blocks[side]} 正在通过`};
  this.switches[side]=lane;return {ok:true,message:`${side==='west'?'西':'东'}端道岔已切至 ${lane} 股道`};
 }
 select(id){if(!this.trains.some(t=>t.id===id))return false;this.selected=id;return true}
 routeInfo(t=this.selectedTrain){
  if(!t)return {ok:false,message:'请选择列车'};
  if(this.ended)return {ok:false,message:'本班次已结束'};
  if(!this.started)return {ok:false,message:'点击「开始值班」启动调度'};
  if(t.status==='scheduled')return {ok:false,message:'列车尚未到达入口'};
  if(t.status==='done')return {ok:false,message:'已完成运输'};
  if(t.status==='incoming'||t.status==='outgoing')return {ok:false,message:'列车正在运行，进路已锁定'};
  if(t.status==='working')return {ok:false,message:`${t.passenger?'旅客乘降':'货物装卸'}中，还需 ${Math.ceil(t.work)} 秒`};
  const side=t.status==='queued'?t.side:(t.dir===1?'east':'west');
  if(this.blocks[side])return {ok:false,conflict:true,message:`${side==='west'?'西':'东'}侧单线由 ${this.blocks[side]} 占用`};
  if(t.status==='queued'){
   const lane=this.switches[side];
   if(this.lanes[lane])return {ok:false,conflict:true,message:`${lane} 股道已为 ${this.lanes[lane]} 预留，请切换空闲股道`};
   if(t.passenger&&lane===3)return {ok:false,message:'客运列车需要 1 或 2 股道站台'};
   return {ok:true,side,lane,message:`进入 ${lane} 股道`};
  }
  if(this.switches[side]!==t.lane)return {ok:false,message:`请将${side==='west'?'西':'东'}端道岔切至 ${t.lane} 股道`};
  return {ok:true,side,lane:t.lane,message:`向${side==='west'?'西':'东'}出站`};
 }
 dispatch(id=this.selected){
  const t=this.trains.find(x=>x.id===id),r=this.routeInfo(t);
  if(!r.ok){if(r.conflict&&this.running){this.safety=Math.max(0,this.safety-3);this.log('联锁保护：'+r.message,'warn')}return r}
  this.blocks[r.side]=t.id;
  if(t.status==='queued'){t.lane=r.lane;this.lanes[t.lane]=t.id;t.status='incoming';t.progress=0;this.log(`${t.id} 已获准进入 ${t.lane} 股道`)}
  else {t.status='outgoing';t.progress=0;this.log(`${t.id} 出站，${r.side==='west'?'西':'东'}侧区间已锁定`)}
  return {ok:true,message:`${t.id} ${r.message}，信号开放`};
 }
 start(){if(this.ended)return;this.started=true;this.running=true}
 tick(dt){
  if(!this.running||this.ended)return;
  const step=Math.min(Math.max(dt,0),this.duration-this.time);this.time+=step;
  this.weather=this.mode==='night'?'夜间':this.time>140&&this.time<195?'小雨':'晴朗';
  this.event=this.time>140&&this.time<195?'山谷降雨 · 区间运行速度降低 20%':'';
  for(const t of this.trains){
   if(t.status==='scheduled'&&this.time>=t.arrival){t.status='queued';this.log(`${t.id} 已到达${t.side==='west'?'西':'东'}端，等待进站`,t.passenger?'priority':'info')}
   if(t.status==='incoming'||t.status==='outgoing'){
    t.progress=Math.min(1,t.progress+step/(t.transit*(this.weather==='小雨'?1.25:1)));
    if(t.status==='outgoing'&&t.progress>.35&&this.lanes[t.lane]===t.id)this.lanes[t.lane]=null;
    if(t.progress>=1){
     if(t.status==='incoming'){
      this.blocks[t.side]=null;t.status='working';t.work=(t.passenger?5:t.cargo==='煤炭'?13:9)*(this.upgrades.loading?.6:1)*(t.lane===3?.75:1);
      const other=this.trains.find(o=>o.id!==t.id&&o.dir!==t.dir&&['working','ready'].includes(o.status));
      if(other){this.meets++;this.score+=100;this.log(`${t.id} 与 ${other.id} 完成站内会车 · +100`,'success')}
      this.log(`${t.id} 抵达 ${t.lane} 股道，${t.passenger?'旅客乘降':'开始装卸'}`);
     }else{
      const exit=t.dir===1?'east':'west';if(this.blocks[exit]===t.id)this.blocks[exit]=null;if(this.lanes[t.lane]===t.id)this.lanes[t.lane]=null;
      t.status='done';t.completedAt=this.time;t.late=this.time>t.deadline;this.delivered++;if(!t.late)this.onTime++;
      const reward=Math.round(t.reward*(t.late?.65:1)*(this.upgrades.bonus?1.25:1));this.money+=reward;this.score+=t.late?120:200;
      this.log(`${t.id} ${t.late?'晚点':'准点'}交付 · 收入 ¥${reward}`,t.late?'warn':'success');
     }
    }
   }else if(t.status==='working'){t.work=Math.max(0,t.work-step);if(t.work===0){t.status='ready';this.log(`${t.id} 作业完成，等待出站`,'priority')}}
  }
  if(this.upgrades.signals){for(const t of this.trains.filter(t=>t.status==='ready')){const s=t.dir===1?'east':'west';if(!this.blocks[s]){this.switches[s]=t.lane;this.dispatch(t.id)}}}
  if(this.time>=this.duration){this.running=false;this.ended=true;this.log('值班结束，运营报告已生成。','success')}
 }
 buy(key){const prices={loading:400,signals:700,bonus:500};if(!(key in prices))return {ok:false,message:'未知设备'};if(this.upgrades[key])return {ok:false,message:'设备已经升级'};if(this.money<prices[key])return {ok:false,message:`需要 ¥${prices[key]}，当前 ¥${this.money}`};this.money-=prices[key];this.upgrades[key]=true;return {ok:true,message:'设备升级完成，已立即生效'}}
 contracts(){return [{id:'cargo',name:'货运走廊',desc:'交付 5 列货运列车',value:this.trains.filter(t=>t.status==='done'&&!t.passenger).length,target:5,reward:400},{id:'meet',name:'交会的艺术',desc:'安排 3 次相向站内会车',value:this.meets,target:3,reward:300},{id:'time',name:'准点承诺',desc:'完成 8 班准点运输',value:this.onTime,target:8,reward:600}]}
 claim(id){const c=this.contracts().find(c=>c.id===id);if(!c||c.value<c.target||this.claimed.includes(id))return {ok:false,message:'合同尚未完成或奖励已领取'};this.claimed.push(id);this.money+=c.reward;this.score+=c.reward;return {ok:true,message:`合同完成，获得 ¥${c.reward}`}}
 snapshot(){return {time:this.time,running:this.running,ended:this.ended,score:this.score,safety:this.safety,money:this.money,switches:{...this.switches},blocks:{...this.blocks},lanes:{...this.lanes},trains:this.trains.map(t=>({...t}))}}
}
