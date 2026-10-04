export const MODES={cozy:{bpm:100,window:.19,perfect:.09,name:'轻松漫游'},groove:{bpm:120,window:.16,perfect:.075,name:'律动冒险'},wild:{bpm:140,window:.135,perfect:.06,name:'极限节拍'}};
export function makeChart(mode='cozy'){
 const chart=[];let lane=1,id=0;
 for(let b=4;b<192;b++){
  const section=Math.floor(b/64),cycle=b%16;
  if(b>=24&&cycle===12){chart.push({id:id++,beat:b,lane:(Math.floor(b/16)+1)%3,type:Math.floor(b/16)%2?'root':'branch'});continue;}
  if(b>=24&&(cycle===11||cycle===13))continue;
  if(b%2!==0&&!(section===2&&cycle<6)&&!(mode==='wild'&&section>0&&cycle<8))continue;
  if(b%4===0){const dir=(Math.floor(b/8)%2)?1:-1;lane=Math.max(0,Math.min(2,lane+dir));}
  const type=b===40||b===120?'magnet':b===80||b===160?'shield':'nut';
  chart.push({id:id++,beat:b,lane,type});
 }
 return chart;
}
export class Run{
 constructor(mode='cozy'){this.mode=mode;this.config=MODES[mode];this.period=60/this.config.bpm;this.duration=192*this.period;this.chart=makeChart(mode).map(n=>({...n,time:n.beat*this.period,done:false}));this.lane=1;this.time=-4*this.period;this.score=0;this.combo=0;this.maxCombo=0;this.nuts=0;this.perfects=0;this.good=0;this.misses=0;this.hearts=3;this.energy=0;this.shield=0;this.magnetUntil=0;this.burstUntil=0;this.burstStartedAt=-Infinity;this.invulnerableUntil=0;this.lastTap=-99;this.finished=false;this.total=this.chart.filter(n=>!['root','branch'].includes(n.type)).length;}
 get multiplier(){return Math.min(4,1+Math.floor(this.combo/10))*(this.time<this.burstUntil?2:1)}
 move(delta){this.lane=Math.max(0,Math.min(2,this.lane+delta));}
 hit(time,offset=0){
  if(this.finished||time<0||time-this.lastTap<.17)return null;
  this.lastTap=time;
  const target=time-offset;
  const n=this.chart.filter(n=>!n.done&&!['root','branch'].includes(n.type)&&(n.lane===this.lane||time<this.magnetUntil||time<this.burstUntil)).reduce((best,n)=>Math.abs(n.time-target)<Math.abs((best?.time??Infinity)-target)?n:best,null);
  if(!n||Math.abs(n.time-target)>this.config.window)return {type:'empty'};
  return this.collect(n,Math.abs(n.time-target)<=this.config.perfect?'perfect':'good',time,target-n.time);
 }
 collect(n,quality,time,error=0){n.done=true;this.combo++;this.maxCombo=Math.max(this.maxCombo,this.combo);this.nuts++;if(quality==='perfect')this.perfects++;else this.good++;this.score+=(quality==='perfect'?100:60)*Math.min(4,1+Math.floor(this.combo/10))*(time>=this.burstStartedAt&&time<this.burstUntil?2:1);this.energy=Math.min(100,this.energy+(quality==='perfect'?9:5));if(n.type==='magnet')this.magnetUntil=time+8*this.period;if(n.type==='shield')this.shield=1;return {type:quality,note:n,error,power:n.type==='nut'?null:n.type};}
 burst(){if(this.energy<100||this.time<0||this.finished)return false;this.energy=0;this.burstStartedAt=this.time;this.burstUntil=this.time+8*this.period;return true;}
 step(time,{jumpHeight=0,duck=false}={}){
  if(this.finished)return [];
  this.time=time;const events=[];
  for(const n of this.chart){
   if(n.done)continue;
   const obstacle=['root','branch'].includes(n.type);
   if(!obstacle&&n.time>=this.burstStartedAt&&n.time<this.burstUntil&&n.time<=time){events.push(this.collect(n,'perfect',n.time));continue;}
   if(obstacle&&n.time<=time){n.done=true;if(n.lane===this.lane&&time>=this.invulnerableUntil){const safe=n.type==='root'?jumpHeight>.35:duck;if(!safe){this.combo=0;this.invulnerableUntil=time+1.5;if(time<this.burstUntil)events.push({type:'guard'});else if(this.shield){this.shield=0;events.push({type:'guard'});}else if(this.hearts>0){this.hearts--;events.push({type:'hurt'});}}else events.push({type:'dodge'});}continue;}
   if(!obstacle&&time>n.time+this.config.window+.25){n.done=true;this.combo=0;this.misses++;events.push({type:'miss',note:n});}
  }
  if(time>=this.duration){this.finished=true;events.push({type:'finish'});}return events;
 }
}
