export const TOTAL = 30;
export const CHAPTERS = [
 {name:'晨光浅塘',short:'晨光',description:'每一场冒险，都从第一片荷叶开始。',water:0x237e79,fog:0x49948a,leaf:0x81ad38,light:0xffeed0,ambient:0xc9edda},
 {name:'流萤水道',short:'暮色',description:'跟着流萤，穿过缓缓漂移的荷叶。',water:0x39697a,fog:0x738f9e,leaf:0x609950,light:0xffbf96,ambient:0xbcc9f1},
 {name:'月影深潭',short:'月夜',description:'月光之下，勇敢要比荷叶更坚定。',water:0x1f455e,fog:0x384d6c,leaf:0x3e9181,light:0xadceff,ambient:0x859cda}
];
export function distance(a,b){return Math.hypot(a.x-b.x,a.z-b.z)}
export function jumpRange(power,spring=false){return 2+Math.max(0,Math.min(1,power))*(spring?7.3:5.5)}
export function safeCharge(dist,radius,spring=false){const span=spring?7.3:5.5;return [Math.max(0,(dist-radius+.24-2)/span),Math.min(1,(dist+radius-.24-2)/span)]}
export function makeLayout(){
 const pads=[];
 for(let i=0;i<=TOTAL;i++){
  const chapter=Math.min(2,Math.floor(i/10));
  const checkpoint=i%5===0;
  let type=checkpoint?'checkpoint':'normal';
  if(!checkpoint&&i>=11&&[1,3,6,8].includes(i%10)) type='moving';
  if(!checkpoint&&i>=21&&[2,4,7,9].includes(i%10)) type='sinking';
  if(i===7||i===17||i===26)type='spring';
  if(i===9||i===19)type='shield';
  pads.push({id:i,index:i,x:i===0?0:Math.sin(i*1.28)*2.6,z:-i*4.4,r:checkpoint?2.1:(chapter===0?1.7:chapter===1?1.55:1.43),type,chapter,phase:i*.89});
 }
 for(let k=0;k<6;k++){const i=3+k*5;const a=pads[i],b=pads[i+1];pads.push({id:31+k,index:i,x:(a.x+b.x)/2+(k%2?3.1:-3.1),z:(a.z+b.z)/2,r:1.2,type:'bonus',chapter:a.chapter,phase:k})}
 return pads;
}
