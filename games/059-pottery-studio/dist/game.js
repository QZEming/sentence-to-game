export const COUNT = 72;
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const CLAYS = {
  stone: { name: '原矿陶土', color: '#c4a589', temperature: 1180, duration: 60 },
  red: { name: '赤陶土', color: '#b66d50', temperature: 1020, duration: 45 },
  white: { name: '白瓷土', color: '#e0dcd1', temperature: 1260, duration: 75 }
};
export const GLAZES = [
  {name:'青苔绿',color:'#68775a'}, {name:'月白',color:'#deded0'},
  {name:'海盐蓝',color:'#618494'}, {name:'落日赭',color:'#b76b48'},
  {name:'深海',color:'#354f5b'}, {name:'杏子黄',color:'#cda468'},
  {name:'莓子紫',color:'#886879'}, {name:'炭墨',color:'#414541'}
];
export const PRESETS = {
  vase: {name:'花瓶',height:22,points:[.54,.66,.9,1.01,.94,.65,.45,.46]},
  bowl: {name:'茶碗',height:12,points:[.42,.55,.73,.9,1.04,1.14,1.2,1.23]},
  cup: {name:'水杯',height:18,points:[.55,.6,.61,.64,.66,.68,.70,.73]},
  jar: {name:'陶罐',height:22,points:[.6,.87,1.04,1.11,1.1,.95,.75,.74]}
};
export const ORDERS = [
  {name:'一枝春 · 花器',description:'为窗边的一枝野花，做一个圆润而安静的家。',shape:'圆润腹部 · 收口瓶颈',glaze:0,reward:120,preset:'vase',points:[.50,.72,1.0,1.05,.86,.57,.4,.42],height:24,difficulty:'入门练习'},
  {name:'一盏山色 · 茶碗',description:'山间茶室想要一只敞口茶碗，让新茶的香气慢慢散开。',shape:'轻盈碗足 · 舒展敞口',glaze:1,reward:100,preset:'bowl',points:[.4,.55,.75,.94,1.07,1.2,1.29,1.34],height:12,difficulty:'入门练习'},
  {name:'日常的蓝 · 水杯',description:'留给每一个清晨的第一杯水，握在手心刚刚好。',shape:'直立杯壁 · 微微敞口',glaze:2,reward:140,preset:'cup',points:[.54,.59,.64,.67,.69,.7,.73,.77],height:19,difficulty:'细节挑战'},
  {name:'秋日存粮 · 陶罐',description:'小小的杂货店需要一只温润的陶罐，收藏丰收的味道。',shape:'饱满罐腹 · 宽厚矮颈',glaze:3,reward:180,preset:'jar',points:[.65,.88,1.12,1.2,1.18,1.02,.8,.83],height:25,difficulty:'匠人挑战'}
];
export function profileFrom(points) {
  return Array.from({length:COUNT}, (_,i)=>{
    const f=i/(COUNT-1)*(points.length-1),a=Math.floor(f),b=Math.min(a+1,points.length-1),t=f-a;
    const p0=points[Math.max(0,a-1)],p1=points[a],p2=points[b],p3=points[Math.min(points.length-1,b+1)];
    return .5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t);
  });
}
export function deform(profile, center, delta, brush, mode, moisture) {
  const result=[...profile];
  for(let i=0;i<COUNT;i++) {
    const dist=(i/(COUNT-1)-center)/brush, weight=Math.exp(-dist*dist/2), base=clamp(i/6,.15,1);
    if(mode==='smooth') {
      let sum=0,n=0; for(let j=-4;j<=4;j++){sum+=profile[clamp(i+j,0,COUNT-1)];n++;}
      result[i]=profile[i]+(sum/n-profile[i])*weight*.45;
    } else result[i]=clamp(profile[i]+delta*weight*base*(moisture<20?.42:1),.24,1.5);
  }
  return result;
}
export function shapeScore(profile,height,order) {
  const target=profileFrom(order.points);
  const error=profile.reduce((sum,r,i)=>sum+Math.abs(r-target[i]),0)/COUNT;
  return Math.round(clamp(100-error*155-Math.abs(height-order.height)*2,0,100));
}
export function calculateResult(state) {
  const clay=CLAYS[state.clay],o=state.order===null?null:ORDERS[state.order];
  const firing=Math.round(clamp(100-Math.abs(state.temperature-clay.temperature)*.28-Math.abs(state.duration-clay.duration)*.55,10,100));
  const smoothness=state.profile.slice(1,-1).reduce((sum,r,i)=>sum+Math.abs(state.profile[i]-2*r+state.profile[i+2]),0)/(COUNT-2);
  const shape=o?shapeScore(state.profile,state.height,o):Math.round(clamp(100-smoothness*500,60,100));
  const glaze=o?(state.glaze===o.glaze?100:72):100;
  const score=Math.round(shape*.55+firing*.3+glaze*.15);
  const stars=score>=90?3:score>=72?2:1;
  const coins=Math.round((o?o.reward:75)*score/100);
  return {shape,firing,glaze,score,stars,coins,fulfilled:!!o&&score>=72};
}
export function validDraft(d) {
  return !!d && Array.isArray(d.profile) && d.profile.length===COUNT && d.profile.every(r=>Number.isFinite(r)&&r>=.2&&r<=1.6) && Number.isFinite(d.height)&&d.height>=12&&d.height<=32 && Object.hasOwn(CLAYS,d.clay) && Number.isInteger(d.glaze)&&d.glaze>=0&&d.glaze<GLAZES.length && ['plain','dip','speckle','rings'].includes(d.pattern) && Number.isFinite(d.gloss)&&d.gloss>=0&&d.gloss<=100 && [0,1,2].includes(d.step) && (d.order===null||(Number.isInteger(d.order)&&d.order>=0&&d.order<ORDERS.length)) && Number.isFinite(d.moisture)&&d.moisture>=0&&d.moisture<=100 && Number.isFinite(d.temperature)&&d.temperature>=850&&d.temperature<=1300 && Number.isFinite(d.duration)&&d.duration>=20&&d.duration<=100 && Array.isArray(d.carves) && d.carves.length<=40 && d.carves.every(n=>Number.isFinite(n)&&n>=0&&n<=1);
}
