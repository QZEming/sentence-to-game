const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Quiet procedural soundscape. No network requests or autoplay side effects. */
export class AudioSystem {
  constructor() {
    this.context = null;
    this.muted = false;
    this.ready = false;
    this.unavailable = false;
    this._unlocking = null;
    this._lastPlayed = new Map();
    this._ambientNodes = [];
    this._lastUpdate = -1;
  }

  async unlock() {
    if (this.unavailable) return false;
    if (this._unlocking) return this._unlocking;

    this._unlocking = (async () => {
      try {
        const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!AudioContextClass) {
          this.unavailable = true;
          return false;
        }
        if (!this.context) this.context = new AudioContextClass({ latencyHint: 'interactive' });
        if (this.context.state === 'suspended') await this.context.resume();
        if (this.context.state !== 'running') return false;
        if (!this.ready) {
          this._buildGraph();
          this.ready = true;
        }
        this.setMuted(this.muted);
        return true;
      } catch {
        // Audio is optional: browser restrictions must never interrupt gameplay.
        return false;
      }
    })();

    try {
      return await this._unlocking;
    } finally {
      this._unlocking = null;
    }
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (!this.master || this.context?.state === 'closed') return;
    this.master.gain.setTargetAtTime(this.muted ? 0 : 0.32, this.context.currentTime, 0.025);
  }

  _buildGraph() {
    const ctx = this.context;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -16;
    limiter.knee.value = 12;
    limiter.ratio.value = 5;
    limiter.attack.value = 0.006;
    limiter.release.value = 0.2;
    this.master.connect(limiter);
    limiter.connect(ctx.destination);

    this.effects = ctx.createGain();
    this.effects.gain.value = 0.7;
    this.effects.connect(this.master);

    // Reuse one noise buffer for all impacts and the station's ventilation.
    const length = ctx.sampleRate * 2;
    this._noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = this._noiseBuffer.getChannelData(0);
    for (let index = 0; index < length; index++) data[index] = Math.random() * 2 - 1;

    this.ambient = ctx.createGain();
    this.ambient.gain.value = 0.13;
    this.ambient.connect(this.master);
    this.ambientFilter = ctx.createBiquadFilter();
    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.value = 480;
    this.ambientFilter.Q.value = 0.4;
    this.ambientFilter.connect(this.ambient);

    // A restrained open A-minor chord suggests a large, empty interior.
    [55, 110, 164.81, 220, 261.63].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const voiceGain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index % 2 ? 3 : -3;
      voiceGain.gain.value = index === 0 ? 0.11 : 0.026;
      oscillator.connect(voiceGain);
      voiceGain.connect(this.ambientFilter);
      oscillator.start();
      this._ambientNodes.push(oscillator, voiceGain);
    });

    const breathing = ctx.createOscillator();
    const breathingDepth = ctx.createGain();
    breathing.frequency.value = 0.065;
    breathingDepth.gain.value = 0.018;
    breathing.connect(breathingDepth);
    breathingDepth.connect(this.ambient.gain);
    breathing.start();
    this._ambientNodes.push(breathing, breathingDepth);

    const ventilation = ctx.createBufferSource();
    ventilation.buffer = this._noiseBuffer;
    ventilation.loop = true;
    const airFilter = ctx.createBiquadFilter();
    airFilter.type = 'lowpass';
    airFilter.frequency.value = 650;
    this.airGain = ctx.createGain();
    this.airGain.gain.value = 0.008;
    ventilation.connect(airFilter);
    airFilter.connect(this.airGain);
    this.airGain.connect(this.ambient);
    ventilation.start();
    this._ambientNodes.push(ventilation, airFilter, this.airGain);
  }

  _tone(frequency, duration, { delay = 0, end = frequency, gain = 0.13, type = 'sine', attack = 0.012 } = {}) {
    const ctx = this.context;
    const start = ctx.currentTime + delay;
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(20, frequency), start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, end), start + duration);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(gain, start + Math.min(attack, duration * 0.3));
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(this.effects);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
    oscillator.start(start);
    oscillator.stop(start + duration + 0.025);
  }

  _noise(duration, { delay = 0, gain = 0.05, frequency = 900, end = frequency, type = 'bandpass' } = {}) {
    const ctx = this.context;
    const start = ctx.currentTime + delay;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const envelope = ctx.createGain();
    source.buffer = this._noiseBuffer;
    filter.type = type;
    filter.frequency.setValueAtTime(frequency, start);
    filter.frequency.exponentialRampToValueAtTime(Math.max(30, end), start + duration);
    filter.Q.value = 0.6;
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(gain, start + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.effects);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      envelope.disconnect();
    };
    source.start(start);
    source.stop(start + duration + 0.025);
  }

  play(name) {
    if (!this.ready || this.muted || this.context.state !== 'running') return;
    const now = this.context.currentTime;
    const interval = name === 'hurt' ? 0.16 : name === 'land' ? 0.09 : 0.035;
    if (now - (this._lastPlayed.get(name) ?? -Infinity) < interval) return;
    this._lastPlayed.set(name, now);

    switch (name) {
      case 'jump':
        this._tone(190, 0.23, { end: 450, gain: 0.13, type: 'triangle' });
        this._noise(0.11, { frequency: 1200, end: 2200, gain: 0.025 });
        break;
      case 'doubleJump':
        this._tone(390, 0.25, { end: 880, gain: 0.12, type: 'triangle' });
        this._tone(660, 0.24, { delay: 0.06, end: 1100, gain: 0.045 });
        this._noise(0.18, { frequency: 1800, end: 3800, gain: 0.035 });
        break;
      case 'dash':
        this._noise(0.32, { gain: 0.13, frequency: 2800, end: 450 });
        this._tone(190, 0.22, { end: 70, gain: 0.15, type: 'triangle' });
        break;
      case 'land':
        this._tone(110, 0.12, { end: 45, gain: 0.1 });
        this._noise(0.1, { frequency: 380, gain: 0.055, type: 'lowpass' });
        break;
      case 'cell':
        this._tone(880, 0.2, { gain: 0.075 });
        this._tone(1320, 0.28, { delay: 0.065, gain: 0.065 });
        break;
      case 'core':
        [440, 660, 880, 1320].forEach((frequency, index) => {
          this._tone(frequency, 0.65, { delay: index * 0.085, gain: 0.08 });
        });
        break;
      case 'checkpoint':
        [330, 440, 660].forEach((frequency, index) => {
          this._tone(frequency, 0.7, { delay: index * 0.12, gain: 0.1, attack: 0.025 });
        });
        break;
      case 'hurt':
        this._tone(160, 0.3, { end: 55, gain: 0.16, type: 'triangle' });
        this._noise(0.23, { frequency: 700, end: 160, gain: 0.09 });
        break;
      case 'death':
        [330, 247, 165].forEach((frequency, index) => {
          this._tone(frequency, 0.65, { delay: index * 0.15, end: frequency * 0.55, gain: 0.09, type: 'triangle' });
        });
        this._noise(0.65, { gain: 0.06, frequency: 650, end: 70 });
        break;
      case 'win':
        [330, 440, 554.37, 660, 880, 1108.73].forEach((frequency, index) => {
          this._tone(frequency, 1.1, { delay: index * 0.12, gain: 0.075, attack: 0.025 });
        });
        break;
      case 'pulse':
        this._tone(620, 0.8, { end: 90, gain: 0.12 });
        this._noise(0.7, { frequency: 1800, end: 180, gain: 0.075 });
        break;
      case 'start':
        [220, 330, 440].forEach((frequency, index) => {
          this._tone(frequency, 0.48, { delay: index * 0.1, gain: 0.09 });
        });
        break;
      default:
        break;
    }
  }

  update(speed = 0, isAirborne = false, lowGravity = false) {
    if (!this.ready || this.context.state !== 'running') return;
    const now = this.context.currentTime;
    // Avoid queuing audio automation at render-frame frequency.
    if (now - this._lastUpdate < 0.05) return;
    this._lastUpdate = now;
    const motion = clamp((Number.isFinite(speed) ? Math.abs(speed) : 0) / 30, 0, 1);
    this.airGain.gain.setTargetAtTime(0.008 + motion * 0.065 + (isAirborne ? 0.025 : 0), now, 0.2);
    this.ambientFilter.frequency.setTargetAtTime(lowGravity ? 1150 : 420 + motion * 160, now, 0.7);
    this.ambient.gain.setTargetAtTime(lowGravity ? 0.17 : 0.13, now, 0.8);
  }
}
