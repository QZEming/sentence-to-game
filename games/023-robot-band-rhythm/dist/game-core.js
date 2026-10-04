export const SONGS=[
 {title:'Neon Circuit',zh:'霓虹电路',genre:'SYNTHWAVE',bpm:108,beats:112,tag:'温暖律动 · 轻松入场',root:55},
 {title:'Midnight Protocol',zh:'午夜协议',genre:'ELECTRO FUNK',bpm:116,beats:128,tag:'深夜漫游 · 放克脉冲',root:65.406},
 {title:'Overclock',zh:'超频时刻',genre:'CYBER ELECTRONIC',bpm:144,beats:144,tag:'全速运转 · 极限节拍',root:73.416}
];
export const DIFFICULTIES={easy:{label:'入门',window:.16,lookahead:2.35},normal:{label:'进阶',window:.135,lookahead:1.95},hard:{label:'硬核',window:.115,lookahead:1.65}};
export function makeChart(song,difficulty){const beat=60/song.bpm;const notes=[];let id=0;const lanePattern=[0,1,2,3,0,2,1,3,0,1,3,2,1,0,2,3];const end=song.beats-4;
 for(let b=4;b<end;b++){let lane=lanePattern[(b-4)%16];let len=(b%16===6||b%16===14)&&lane>0?1.4*beat:0;notes.push({id:id++,lane,t:b*beat,duration:len,status:'pending'});
 if(difficulty!=='easy'&&b%4!==3){const extra=(lane+2)%4;notes.push({id:id++,lane:extra,t:(b+.5)*beat,duration:0,status:'pending'})}
 if(difficulty==='hard'&&b%4===3){notes.push({id:id++,lane:(lane+1)%4,t:b*beat,duration:0,status:'pending'});notes.push({id:id++,lane:(lane+3)%4,t:(b+.75)*beat,duration:0,status:'pending'})}
 }
 notes.sort((a,b)=>a.t-b.t||a.lane-b.lane);
 for(let i=0;i<notes.length;i++){const n=notes[i];if(n.duration){const next=notes.slice(i+1).find(x=>x.lane===n.lane);if(next)n.duration=Math.max(0,Math.min(n.duration,next.t-n.t-.22));if(n.duration<.22)n.duration=0}}
 return notes;
}
export function judge(delta,window){const d=Math.abs(delta);return d<=.055?'perfect':d<=window?'good':'miss'}
export function formatTime(seconds){const s=Math.max(0,Math.floor(seconds));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
export function gradeFor(accuracy,misses){return accuracy>=97&&misses===0?'S+':accuracy>=93?'S':accuracy>=83?'A':accuracy>=70?'B':accuracy>=50?'C':'D'}
