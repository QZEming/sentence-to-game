export const GRAVITY = 9.8;
export const AMMO = [
 {name:'石弹',icon:'⬢',hint:'标准攻城弹 · 精准破墙',radius:4.8,damage:132,color:0xc0bfb2,speed:1},
 {name:'爆裂弹',icon:'✹',hint:'范围爆破 · 引爆火药桶',radius:8.5,damage:148,color:0xe6aa5a,speed:1},
 {name:'燃烧弹',icon:'♨',hint:'持续燃烧 · 灼烧核心',radius:6.8,damage:68,color:0xee7950,speed:1},
 {name:'散射弹',icon:'❖',hint:'空中分裂 · 覆盖城防',radius:5.5,damage:94,color:0xb4a1d0,speed:1}
];
export const LEVELS = [
 {name:'灰石前哨',chapter:'第一章',desc:'击穿薄弱的正门，摧毁堡垒核心。',z:-31,hp:320,wall:38,wind:.12,ammo:[7,2,2,1],retaliate:3,damage:12,seed:12},
 {name:'赤松关隘',chapter:'第二章',desc:'城门后的火药桶可以引发连锁爆炸。',z:-35,hp:400,wall:44,wind:-.27,ammo:[7,3,2,1],retaliate:3,damage:15,seed:39},
 {name:'逆风高地',chapter:'第三章',desc:'修正侧风，用高抛弹道越过重墙。',z:-39,hp:500,wall:50,wind:.42,ammo:[7,3,2,2],retaliate:2,damage:16,seed:87},
 {name:'双塔要塞',chapter:'第四章',desc:'击毁侧翼炮塔，削弱敌方反击。',z:-43,hp:600,wall:54,wind:-.58,ammo:[8,3,3,2],retaliate:2,damage:19,seed:109},
 {name:'暮色王城',chapter:'终章',desc:'连爆、破墙与高抛。让王城化为尘土。',z:-47,hp:740,wall:58,wind:.7,ammo:[8,4,3,2],retaliate:2,damage:22,seed:148}
];
export function launch(yaw,elevation,power){const a=yaw*Math.PI/180,e=elevation*Math.PI/180,v=14+power*.2;return{x:Math.sin(a)*Math.cos(e)*v,y:Math.sin(e)*v,z:-Math.cos(a)*Math.cos(e)*v};}
export function pointAt(origin,velocity,t,wind){return{x:origin.x+velocity.x*t+.5*wind*t*t,y:origin.y+velocity.y*t-.5*GRAVITY*t*t,z:origin.z+velocity.z*t};}
export function flightTime(origin,velocity){return(velocity.y+Math.sqrt(velocity.y*velocity.y+2*GRAVITY*origin.y))/GRAVITY;}
export function segmentBox(a,b,min,max,padding=0){let low=0,high=1;for(const k of ['x','y','z']){const d=b[k]-a[k],lo=min[k]-padding,hi=max[k]+padding;if(Math.abs(d)<1e-8){if(a[k]<lo||a[k]>hi)return null;}else{let t1=(lo-a[k])/d,t2=(hi-a[k])/d;if(t1>t2)[t1,t2]=[t2,t1];low=Math.max(low,t1);high=Math.min(high,t2);if(low>high)return null;}}return low;}
export function explosionDamage(distance,radius,damage){return Math.max(0,damage*(1-distance/radius));}
export function seeded(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
