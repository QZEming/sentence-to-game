export class CaveAudio {
  constructor() { this.enabled = true; this.ctx = null; }
  unlock() {
    if (!this.enabled) return;
    try {
      this.ctx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    } catch { this.enabled = false; }
  }
  tone(freq, duration = .12, type = 'sine', volume = .045, delay = 0) {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * .82, t + duration);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + .01);
    gain.gain.exponentialRampToValueAtTime(.001, t + duration);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(t); osc.stop(t + duration + .02);
  }
  play(name) {
    const notes = {
      crystal: [[880,.18], [1320,.25, .07]],
      relic: [[523,.2],[659,.25,.1],[784,.3,.2],[1046,.5,.3]],
      mushroom: [[440,.15],[660,.2,.06]],
      dig: [[110,.1],[75,.15,.04]],
      sonar: [[420,.3],[840,.4,.15],[1260,.6,.35]],
      hurt: [[155,.18],[100,.2,.08]],
      heal: [[330,.2],[440,.2,.12],[660,.25,.24]],
      upgrade: [[440,.15],[660,.15,.1],[880,.3,.2]],
      win: [[523,.25],[659,.25,.15],[784,.25,.3],[1046,.7,.45]],
      step: [[95,.04]],
    };
    for (const [freq,duration,delay=0] of notes[name] || []) this.tone(freq,duration,name==='dig'?'triangle':'sine',name==='step'?.012:.045,delay);
  }
  toggle() { this.enabled = !this.enabled; if (this.enabled) this.unlock(); return this.enabled; }
}
