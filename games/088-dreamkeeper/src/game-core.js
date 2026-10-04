export const CONSTELLATIONS = [
  { name:'天琴座',latin:'LYRA',chapter:'初醒之梦',story:'琴弦化作星光，奏响你记得的第一场梦。',points:[[-.36,-.86,.2],[-.13,-.24,-.05],[.55,-.08,.1],[.36,.66,-.2],[-.34,.43,.12]],edges:[[0,1],[1,2],[2,3],[3,4],[4,1]],bright:0,star:'织女星',difficulty:'入门',time:8 },
  { name:'仙后座',latin:'CASSIOPEIA',chapter:'月光回廊',story:'五颗星折成一顶王冠，献给不曾忘记的你。',points:[[-1.03,-.47,.1],[-.56,.37,-.2],[0,-.28,.17],[.54,.48,-.1],[1.03,-.38,.23]],edges:[[0,1],[1,2],[2,3],[3,4]],bright:2,star:'策',difficulty:'入门',time:7 },
  { name:'天鹰座',latin:'AQUILA',chapter:'风的信笺',story:'展开双翼，越过梦与清醒之间的银河。',points:[[0,-.68,.2],[-.3,-.12,0],[-1.06,.29,-.2],[.2,.22,.35],[.85,.44,-.1],[.17,.88,.12]],edges:[[0,1],[1,2],[1,3],[3,4],[3,5]],bright:1,star:'牛郎星',difficulty:'进阶',time:7 },
  { name:'北斗七星',latin:'BIG DIPPER',chapter:'迷雾航标',story:'无论夜色有多深，总有星光为你指引方向。',points:[[-1.2,.58,.15],[-.83,.05,-.17],[-.35,-.11,.3],[.04,-.47,.1],[.79,-.58,-.16],[.69,.14,.23],[.03,.24,-.12]],edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],bright:3,star:'天权',difficulty:'进阶',time:6 },
  { name:'天鹅座',latin:'CYGNUS',chapter:'星河摆渡',story:'一只天鹅掠过银河，拾起散落的温柔。',points:[[0,-.93,.15],[-.03,-.14,-.18],[-.95,.02,.12],[.91,.16,.31],[.18,.83,-.2],[.08,.4,.07]],edges:[[0,1],[1,2],[1,3],[1,5],[5,4]],bright:0,star:'天津四',difficulty:'进阶',time:6 },
  { name:'猎户座',latin:'ORION',chapter:'长夜之约',story:'星辰为守护者披上盔甲，勇气从此有了形状。',points:[[-.66,-.77,.13],[.58,-.66,-.18],[-.25,-.01,.23],[.06,.08,0],[.36,.17,-.2],[-.65,.83,.11],[.67,.74,.25],[0,-1.05,-.03]],edges:[[0,2],[1,4],[2,3],[3,4],[2,5],[4,6],[0,7],[7,1]],bright:0,star:'参宿四',difficulty:'挑战',time:6 },
  { name:'北冕座',latin:'CORONA',chapter:'遗落的王冠',story:'将破碎的光芒连起，为梦境加冕。',points:[[-1.02,-.52,.12],[-.92,.11,-.14],[-.48,.6,.25],[.08,.8,0],[.67,.49,-.2],[.98,-.1,.22],[.84,-.65,-.1]],edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],bright:3,star:'贯索四',difficulty:'挑战',time:5 },
  { name:'双鱼座',latin:'PISCES',chapter:'黎明之前',story:'两个梦被星光牵起。天亮以前，记得彼此。',points:[[-1.04,-.2,.23],[-.86,-.72,-.12],[-.4,-.45,.07],[-.52,.06,.3],[0,.4,-.13],[.58,.65,.12],[1.01,.14,-.18],[.69,-.24,.2]],edges:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6],[6,7],[7,5]],bright:4,star:'外屏七',difficulty:'大师',time:5 }
];
export const edgeKey = (a,b) => [a,b].sort((x,y)=>x-y).join('-');
export function evaluateEdges(expected,actual){
 const target=new Set(expected.map(([a,b])=>edgeKey(a,b)));const drawn=new Set(actual.map(([a,b])=>edgeKey(a,b)));
 const correct=[...drawn].filter(k=>target.has(k)).length;
 return {success:correct===target.size&&drawn.size===target.size,correct,missing:target.size-correct,wrong:drawn.size-correct,accuracy:Math.round(correct/Math.max(target.size,drawn.size)*100)};
}
export function roundReward({edges,remaining,mistakes,hints,combo,zen}){
 const stars=Math.max(1,3-Math.min(2,mistakes+(hints>0?1:0)));
 return {stars,points:edges*80+Math.round(zen?100:remaining*8)+stars*100+Math.min(combo,8)*50};
}
export function makeRound(index,mode){
 const base=CONSTELLATIONS[index%CONSTELLATIONS.length];
 const cycle=Math.floor(index/CONSTELLATIONS.length);
 const rotate=mode==='endless'?cycle*.48:0;
 const points=base.points.map(([x,y,z])=>[x*Math.cos(rotate)-y*Math.sin(rotate),x*Math.sin(rotate)+y*Math.cos(rotate),z*(1+Math.min(cycle,4)*.3)]);
 return {...base,points,edges:base.edges.map(e=>[...e]),time:mode==='zen'?12:Math.max(3,base.time-cycle),recallTime:mode==='zen'?Infinity:Math.max(25,55-index*2),distractors:mode==='zen'?2:Math.min(9,3+Math.floor(index/2)),baseIndex:index%8};
}
