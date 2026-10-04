export class ForestMusic{
 constructor(){this.ctx=null;this.master=null;this.sources=new Set();this.volume=.6;this.muted=false;this.anchor=0;this.period=.6;this.nextTick=0;this.active=false;}
 async init(){if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;this.ctx=new AC();this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);this.noise=this.ctx.createBuffer(1,this.ctx.sampleRate*.2,this.ctx.sampleRate);const data=this.noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;}await this.ctx.resume();this.setVolume(this.volume);return true;}
 setVolume(v){this.volume=v;if(this.master)this.master.gain.setTargetAtTime(this.muted?0:v*.65,this.ctx.currentTime,.02);}
 mute(v){this.muted=v;this.setVolume(this.volume);}
 now(){return this.ctx?this.ctx.currentTime:this.fallbackNow();}
 fallbackNow(){return performance.now()/1000;}
 start(time,period){this.stop();this.period=period;this.anchor=this.now()-time;this.nextTick=Math.ceil(time/period*2);this.active=true;}
 time(){return this.now()-this.anchor;}
 stop(){this.active=false;for(const src of this.sources){try{src.stop();}catch{}}this.sources.clear();}
 track(src){this.sources.add(src);src.onended=()=>{this.sources.delete(src);src.disconnect();};}
 tone(freq,time,duration=.2,type='sine',volume=.12,slide){if(!this.ctx)return;const osc=this.ctx.createOscillator(),gain=this.ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,time);if(slide)osc.frequency.exponentialRampToValueAtTime(slide,time+duration);gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(volume,time+.007);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);osc.connect(gain);gain.connect(this.master);osc.start(time);osc.stop(time+duration+.02);this.track(osc);}
 hiss(time,duration,volume,freq){if(!this.ctx)return;const src=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter(),gain=this.ctx.createGain();src.buffer=this.noise;filter.type='highpass';filter.frequency.value=freq;gain.gain.setValueAtTime(volume,time);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);src.connect(filter);filter.connect(gain);gain.connect(this.master);src.start(time);src.stop(time+duration);this.track(src);}
 update(){if(!this.active)return;const now=this.now();while(this.anchor+this.nextTick*this.period/2<now+.13){const tick=this.nextTick++,t=this.anchor+tick*this.period/2;if(t<now-.08)continue;const beat=Math.floor(tick/2),even=tick%2===0;if(beat<0){if(even)this.tone(beat===-1?880:660,Math.max(t,now),.075,'sine',.12);continue;}if(beat>=192)continue;if(!this.ctx)continue;const at=Math.max(t,now);
 if(even){this.tone(120,at,.16,'sine',.33,45);if(beat%2===1){this.hiss(at,.11,.14,1800);this.tone(170,at,.09,'triangle',.06);}const bass=[130.81,110,87.31,98][Math.floor(beat/8)%4];this.tone(bass/2,at,.3,'triangle',.14);}
 this.hiss(at,.035,even?.03:.055,6500);
 const melody=[523.25,659.25,783.99,659.25,587.33,523.25,440,392,440,523.25,659.25,783.99,659.25,587.33,523.25,392];
 if(tick%2===0||beat>=128){const f=melody[(beat+Math.floor(beat/16)*3+(tick%2)*2)%melody.length];this.tone(f,at,.20,'sine',.085);this.tone(f*2,at,.10,'triangle',.019);}
 if(beat%8===0&&even){const root=[261.63,220,174.61,196][Math.floor(beat/8)%4];for(const mul of [1,1.25,1.5])this.tone(root*mul,at,1.6,'sine',.022);}
 }}
 effect(type){if(!this.ctx)return;const t=this.ctx.currentTime;if(type==='perfect'||type==='power'){this.tone(1046.5,t,.10,'sine',.09);this.tone(1568,t+.04,.13,'sine',.05);}else if(type==='hurt'){this.tone(130,t,.2,'sawtooth',.06,45);}else if(type==='burst'){[523,659,784,1047].forEach((f,i)=>this.tone(f,t+i*.07,.25,'sine',.12));}}
}
