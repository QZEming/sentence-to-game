export const TRACKS = [
 { id:'daydream', title:'云上白日梦', english:'DAYDREAM', bpm:96, bars:32, tag:'轻快 · Lo-fi pop', key:261.63, chords:[0,5,9,7], melody:[12,16,19,16,14,17,21,17,16,19,24,19,14,17,19,17], sky:['#8dbfec','#f5dfe9'], accent:'#8366e8' },
 { id:'sunset', title:'落日棉花糖', english:'GOLDEN HOUR', bpm:112, bars:32, tag:'温暖 · Funky groove', key:293.66, chords:[0,7,9,5], melody:[12,14,17,19,21,19,17,14,12,16,19,24,21,19,16,14], sky:['#edacb7','#ffe0af'], accent:'#df865c' },
 { id:'starlight', title:'星河漫游指南', english:'AFTER HOURS', bpm:128, bars:40, tag:'梦幻 · Cosmic disco', key:246.94, chords:[0,9,5,7], melody:[12,19,24,19,16,21,24,21,17,21,26,24,19,23,26,23], sky:['#45478d','#b4a5e1'], accent:'#8074eb' }
];
export class Music {
 constructor(){this.ctx=null;this.master=null;this.volume=.55;this.muted=false;this.nodes=new Set();this.next=0;this.running=false;this.startTime=0;this.track=TRACKS[0];}
 async unlock(){if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=this.muted?0:this.volume;this.master.connect(this.ctx.destination);const length=this.ctx.sampleRate*.15;this.noise=this.ctx.createBuffer(1,length,this.ctx.sampleRate);const d=this.noise.getChannelData(0);for(let i=0;i<length;i++)d[i]=Math.random()*2-1;}await this.ctx.resume();}
 setVolume(v){this.volume=v;if(this.master)this.master.gain.setTargetAtTime(this.muted?0:v,this.ctx.currentTime,.04);}
 setMute(m){this.muted=m;this.setVolume(this.volume);}
 play(track){this.stop();this.track=track;this.startTime=this.ctx.currentTime+2*60/track.bpm;this.next=-2;this.running=true;}
 get beat(){return this.ctx?(this.ctx.currentTime-this.startTime)/(60/this.track.bpm):0;}
 async pause(){this.running=false;await this.ctx?.suspend();}
 async resume(){await this.ctx?.resume();}
 stop(){this.running=false;for(const n of this.nodes){try{n.stop()}catch{}}this.nodes.clear();}
 tone(f,time,duration,type='sine',volume=.12){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(volume,time+.006);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g);g.connect(this.master);o.start(time);o.stop(time+duration+.03);this.nodes.add(o);o.onended=()=>{this.nodes.delete(o);o.disconnect();g.disconnect()};}
 kick(t){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(38,t+.14);g.gain.setValueAtTime(.48,t);g.gain.exponentialRampToValueAtTime(.001,t+.24);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+.25);this.nodes.add(o);o.onended=()=>{this.nodes.delete(o);o.disconnect();g.disconnect()};}
 hat(t,loud=false){const n=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();n.buffer=this.noise;f.type='highpass';f.frequency.value=loud?1800:7000;g.gain.setValueAtTime(loud?.12:.05,t);g.gain.exponentialRampToValueAtTime(.001,t+(loud?.12:.045));n.connect(f);f.connect(g);g.connect(this.master);n.start(t);n.stop(t+.14);this.nodes.add(n);n.onended=()=>{this.nodes.delete(n);n.disconnect();f.disconnect();g.disconnect()};}
 update(){if(!this.running)return;const spb=60/this.track.bpm;while(this.startTime+this.next*spb<this.ctx.currentTime+.16){let b=this.next,t=this.startTime+b*spb;this.next+=.5;if(t<this.ctx.currentTime-.02)continue;if(b<0){if(Number.isInteger(b))this.tone(650,t,.07,'sine',.15);continue;}
 const i=Math.floor(b),bar=Math.floor(b/4),root=this.track.key*2**(this.track.chords[bar%4]/12);if(Number.isInteger(b)){this.kick(t);if(i%2===1)this.hat(t,true);this.tone(root/2,t,spb*.7,'triangle',.16);if(i%4===0){[0,4,7,11].forEach(n=>this.tone(root*2**(n/12),t,spb*3.8,'sine',.034));}const note=this.track.melody[i%16];this.tone(this.track.key*2**(note/12),t,spb*.65,this.track.id==='starlight'?'triangle':'sine',.10);this.tone(this.track.key*2**(note/12)*2,t,spb*.22,'sine',.025);}this.hat(t);if(this.track.id==='sunset'&&!Number.isInteger(b))this.tone(root,t,.10,'triangle',.08);}}
 effect(type){if(!this.ctx||this.ctx.state!=='running')return;const t=this.ctx.currentTime;const notes=type==='boost'?[659,880,1318]:type==='miss'?[160]:type==='carrot'?[880,1174]:[1046,1568];notes.forEach((f,i)=>this.tone(f,t+i*.045,.18,'sine',type==='miss'?.07:.08));}
}
