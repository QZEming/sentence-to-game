/** Quiet, asset-free forest ambience. No audio starts before a user gesture. */
export class ForestAudio {
  constructor() {
    this.enabled = false;
    this.context = null;
    this._timer = null;
    this._suspendTimer = null;
    this._voices = new Set();
    this._lastEvent = new Map();
    this._chord = 0;
    this._disposed = false;
    this._nextChord = 0;
    this._nextBird = 0;
  }

  async start() {
    if (this._disposed) return false;
    this.enabled = true;
    return this._activate();
  }

  async setEnabled(enabled) {
    if (this._disposed) return false;
    this.enabled = Boolean(enabled);
    if (this.enabled) return this._activate();
    this._stopScheduler();
    this._fadeMaster(0, 0.045);
    clearTimeout(this._suspendTimer);
    this._suspendTimer = setTimeout(() => {
      if (this.enabled || this._disposed) return;
      this._stopVoices();
      try {
        this.context?.suspend().catch(() => {});
      } catch { /* Audio may already be unavailable or closed. */ }
    }, 90);
    return true;
  }

  async _activate() {
    try {
      clearTimeout(this._suspendTimer);
      if (!this.context) this._initialize();
      if (!this.context) return false;
      if (this.context.state !== 'running') await this.context.resume();
      // A mute or disposal can arrive while the browser awaits permission.
      if (!this.enabled || this._disposed) return false;
      if (this.context.state !== 'running') return false;
      this._fadeMaster(0.52, 0.15);
      if (!this._timer) {
        this._nextChord = this.context.currentTime + 0.12;
        this._nextBird = this.context.currentTime + 3 + Math.random() * 4;
        this._tick();
        this._timer = setInterval(() => this._tick(), 700);
      }
      return true;
    } catch {
      // Unsupported devices and autoplay restrictions must never break play.
      return false;
    }
  }

  _initialize() {
    const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    this.context = context;
    this._bus = context.createGain();
    this._master = context.createGain();
    this._master.gain.value = 0;
    this._bus.connect(this._master);
    this._master.connect(context.destination);

    // One small shared reverb gives the tones space without a bank of delays.
    const reverb = context.createConvolver();
    const duration = 1.35;
    const impulse = context.createBuffer(2, Math.ceil(context.sampleRate * duration), context.sampleRate);
    for (let channel = 0; channel < 2; channel += 1) {
      const data = impulse.getChannelData(channel);
      for (let index = 0; index < data.length; index += 1) {
        data[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / data.length, 3);
      }
    }
    reverb.buffer = impulse;
    const wet = context.createGain();
    wet.gain.value = 0.17;
    this._bus.connect(reverb);
    reverb.connect(wet);
    wet.connect(this._master);
    this._reverb = reverb;
    this._wet = wet;

    this._noise = context.createBuffer(1, Math.ceil(context.sampleRate * 0.18), context.sampleRate);
    const noise = this._noise.getChannelData(0);
    for (let index = 0; index < noise.length; index += 1) noise[index] = Math.random() * 2 - 1;
  }

  _fadeMaster(value, duration) {
    if (!this.context || !this._master) return;
    const gain = this._master.gain;
    const now = this.context.currentTime;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(value, now + duration);
  }

  _tick() {
    if (!this.enabled || this.context?.state !== 'running' || this._disposed) return;
    try {
      const now = this.context.currentTime;
      if (now >= this._nextChord - 0.7) {
        const at = Math.max(now + 0.02, this._nextChord);
        const chords = [
          [196, 293.665, 369.994], // G, D, B
          [164.814, 246.942, 329.628], // E, B, E
          [130.813, 261.626, 391.995], // C, C, G
          [146.832, 220, 329.628], // D, A, E
        ];
        const chord = chords[this._chord++ % chords.length];
        chord.forEach((frequency, index) => this._tone(frequency, {
          at: at + index * 0.22,
          duration: 8.4,
          attack: 2.1,
          volume: index === 0 ? 0.023 : 0.014,
          pan: (index - 1) * 0.36,
        }));
        this._nextChord = at + 8.7;
      }
      if (now >= this._nextBird) {
        this._bird(now + 0.05);
        this._nextBird = now + 10 + Math.random() * 15;
      }
    } catch { /* Treat audio failures as optional decoration. */ }
  }

  _tone(frequency, options = {}) {
    if (!this.enabled || !this.context || this._voices.size >= 32) return;
    const context = this.context;
    const at = options.at ?? context.currentTime;
    const duration = options.duration ?? 0.3;
    const attack = Math.min(options.attack ?? 0.008, duration * 0.4);
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const pan = context.createStereoPanner?.();
    oscillator.type = options.type ?? 'sine';
    oscillator.frequency.setValueAtTime(frequency, at);
    if (options.slideTo) oscillator.frequency.exponentialRampToValueAtTime(options.slideTo, at + duration * 0.7);
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(options.volume ?? 0.075, at + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    oscillator.connect(envelope);
    if (pan) {
      pan.pan.value = options.pan ?? 0;
      envelope.connect(pan);
      pan.connect(this._bus);
    } else envelope.connect(this._bus);
    this._track(oscillator, [envelope, pan]);
    oscillator.start(at);
    oscillator.stop(at + duration + 0.025);
  }

  _track(source, extraNodes) {
    const voice = { source, nodes: extraNodes.filter(Boolean) };
    this._voices.add(voice);
    source.onended = () => {
      source.disconnect();
      voice.nodes.forEach(node => node.disconnect());
      this._voices.delete(voice);
    };
  }

  _bird(at) {
    const pan = Math.random() * 1.6 - 0.8;
    const base = 1800 + Math.random() * 900;
    this._tone(base, { at, slideTo: base * 1.45, duration: 0.11, volume: 0.012, pan });
    this._tone(base * 1.2, { at: at + 0.18, slideTo: base * 0.9, duration: 0.15, volume: 0.009, pan });
  }

  _step() {
    if (this._voices.size >= 32) return;
    const context = this.context;
    const at = context.currentTime;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const envelope = context.createGain();
    source.buffer = this._noise;
    source.playbackRate.value = 0.7 + Math.random() * 0.3;
    filter.type = 'lowpass';
    filter.frequency.value = 380 + Math.random() * 120;
    envelope.gain.setValueAtTime(0.025, at);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(this._bus);
    this._track(source, [filter, envelope]);
    source.start(at);
    source.stop(at + 0.09);
  }

  play(event) {
    if (!this.enabled || this.context?.state !== 'running' || this._disposed) return;
    try {
      const now = this.context.currentTime;
      const cooldown = event === 'step' ? 0.23 : event === 'rotate' ? 0.055 : 0.08;
      if (now - (this._lastEvent.get(event) ?? -Infinity) < cooldown) return;
      this._lastEvent.set(event, now);
      switch (event) {
        case 'step':
          this._step();
          break;
        case 'rotate':
          this._tone(587.33, { duration: 0.12, volume: 0.042, type: 'triangle', slideTo: 659.255 });
          this._tone(1174.66, { at: now + 0.015, duration: 0.16, volume: 0.013 });
          break;
        case 'collect':
          [783.991, 1174.66, 1567.98].forEach((note, index) => this._tone(note, {
            at: now + index * 0.075, duration: 0.45, volume: 0.062 - index * 0.012,
          }));
          break;
        case 'lit':
          [391.995, 493.883, 587.33, 783.991].forEach((note, index) => this._tone(note, {
            at: now + index * 0.09, duration: 0.75, volume: 0.045,
          }));
          break;
        case 'solve':
          [391.995, 493.883, 587.33, 783.991, 987.767, 1174.66].forEach((note, index) => this._tone(note, {
            at: now + index * 0.135, duration: 1.3, volume: 0.055 - index * 0.004,
          }));
          this._tone(196, { at: now + 0.1, duration: 2.5, attack: 0.18, volume: 0.048 });
          break;
        case 'click':
          this._tone(523.251, { duration: 0.09, volume: 0.034, type: 'triangle' });
          break;
        default:
          break;
      }
    } catch { /* Sound is nonessential; retain a playable game on audio errors. */ }
  }

  _stopScheduler() {
    clearInterval(this._timer);
    this._timer = null;
  }

  _stopVoices() {
    for (const voice of this._voices) {
      try { voice.source.stop(); } catch { /* Already ended. */ }
      try { voice.source.disconnect(); } catch { /* Already disconnected. */ }
      voice.nodes.forEach(node => {
        try { node.disconnect(); } catch { /* Already disconnected. */ }
      });
    }
    this._voices.clear();
  }

  dispose() {
    this._disposed = true;
    this.enabled = false;
    this._stopScheduler();
    clearTimeout(this._suspendTimer);
    this._stopVoices();
    try { this.context?.close().catch(() => {}); } catch { /* Already closed. */ }
    this.context = null;
  }
}
