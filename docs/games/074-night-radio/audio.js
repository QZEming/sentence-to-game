export class RadioAudio{
 constructor(){this.ctx=null;this.muted=true;this.volume=.35;this.musicTimer=null;this.nodes=[];}
 init(){if(this.ctx){this.ctx.resume();return;}const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;this.ctx=new AC();this.master=this.ctx.createGain();this.master.gain.value=this.muted?0:this.volume;this.master.connect(this.ctx.destination);let buffer=this.ctx.createBuffer(1,this.ctx.sampleRate*3,this.ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.28;let noise=this.ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;let filter=this.ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1350;let gain=this.ctx.createGain();gain.gain.value=.13;noise.connect(filter).connect(gain).connect(this.master);noise.start();}
 set(muted,volume=this.volume){this.muted=muted;this.volume=volume;if(this.ctx)this.master.gain.setTargetAtTime(muted?0:volume,this.ctx.currentTime,.2);}
 tone(frequency=440,duration=.15,volume=.15,type='sine',delay=0){if(!this.ctx||this.muted)return;let osc=this.ctx.createOscillator(),gain=this.ctx.createGain(),t=this.ctx.currentTime+delay;osc.type=type;osc.frequency.value=frequency;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(volume,t+.015);gain.gain.exponentialRampToValueAtTime(.001,t+duration);osc.connect(gain).connect(this.master);osc.start(t);osc.stop(t+duration+.02);}
 click(){this.tone(620,.07,.035);}
 ring(){[0,.18,.5,.68].forEach(d=>{this.tone(660,.12,.055,'sine',d);this.tone(880,.12,.035,'sine',d);});}
 success(){this.tone(440,.3,.08);this.tone(554,.4,.07,'sine',.12);this.tone(659,.6,.06,'sine',.25);}
 music(){this.stopMusic();if(!this.ctx)return;const seq=[196,246.94,293.66,369.99,220,261.63,329.63,392,174.61,220,261.63,349.23,196,246.94,293.66,392];let i=0;const note=()=>{this.tone(seq[i%seq.length],1.8,.10,'sine');if(i%4===0)this.tone(seq[i%seq.length]/2,3.1,.09,'triangle');i++;};note();this.musicTimer=setInterval(note,620);}
 stopMusic(){if(this.musicTimer)clearInterval(this.musicTimer);this.musicTimer=null;}
 static(strength){if(!this.ctx||this.muted)return;this.tone(140+strength*220,.08,.02,'triangle');}
 speak(text){if(this.muted||!('speechSynthesis'in window))return;window.speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.88;u.pitch=.82;u.volume=Math.min(this.volume+.2,1);window.speechSynthesis.speak(u);}
 stopSpeech(){window.speechSynthesis?.cancel();}
}
