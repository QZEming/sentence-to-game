/**
 * Procedural synthwave band. All public scheduling times are AudioContext seconds.
 * Call await init() from a user gesture, then schedule with a short look-ahead.
 * No timers, downloads, workers or dependencies; at most 96 live voices.
 */
export class BandAudio {
  constructor() {
    this.context = null;
    this.master = null;
    this.compressor = null;
    this.playerBus = null;
    this.backingBus = null;
    this._noise = null;
    this._volume = 0.65;
    this._voices = new Set();
    this._lastBackingKey = null;
    this._maxVoices = 96;
  }

  async init() {
    if (!this.context) {
      const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AudioContextClass) throw new Error('Web Audio is not supported in this browser.');
      this.context = new AudioContextClass({ latencyHint: 'interactive' });
      const c = this.context;
      this.playerBus = c.createGain();
      this.backingBus = c.createGain();
      this.playerBus.gain.value = 0.70;
      this.backingBus.gain.value = 0.24;
      this.compressor = c.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 12;
      this.compressor.ratio.value = 10;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.16;
      this.master = c.createGain();
      this.master.gain.value = this._volume * 0.55;
      this.playerBus.connect(this.compressor);
      this.backingBus.connect(this.compressor);
      this.compressor.connect(this.master);
      this.master.connect(c.destination);
      this._noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const data = this._noise.getChannelData(0);
      // Seeded noise keeps the patch consistent between plays.
      let seed = 137;
      for (let i = 0; i < data.length; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        data[i] = (seed / 4294967296) * 2 - 1;
      }
    }
    await this.resume();
    return this;
  }

  get time() { return this.context ? this.context.currentTime : 0; }

  setVolume(value) {
    if (!Number.isFinite(value)) return;
    this._volume = Math.max(0, Math.min(1, value));
    if (this.master) {
      const t = this.time;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(this._volume * 0.55, t, 0.015);
    }
  }

  async suspend() {
    if (this.context && this.context.state === 'running') await this.context.suspend();
  }

  async resume() {
    if (this.context && this.context.state === 'suspended') await this.context.resume();
  }

  /** Cancel sounding AND future voices; context remains reusable for another run. */
  stop() {
    if (!this.context) return;
    for (const voice of Array.from(this._voices)) this._dispose(voice);
    this._voices.clear();
    this._lastBackingKey = null;
  }

  /** lane: 0 drum hit, 1 bass pluck, 2 chord stab, 3 lead sparkle. */
  playLane(lane, when = this.time, freq) {
    if (!this.context || this.context.state === 'closed') return;
    const t = this._when(when);
    const f = this._frequency(freq, [120, 110, 220, 440][lane] || 220);
    if (lane === 0) {
      this._kick(t, this.playerBus, 1);
      this._snare(t, this.playerBus, 0.35);
    } else if (lane === 1) {
      this._tone(t, 0.40, f, this.playerBus, 'bass', 0.58);
    } else if (lane === 2) {
      // A minor seventh keeps unrestricted hits within the synthwave mood.
      this._chord(t, 0.60, f, [0, 3, 7, 10], this.playerBus, 0.17);
    } else if (lane === 3) {
      this._tone(t, 0.58, f, this.playerBus, 'lead', 0.28, 0.18);
      this._tone(t + 0.16, 0.33, f, this.playerBus, 'bell', 0.08, -0.30);
    }
  }

  /**
   * Call once for every integer quarter-note beat, including zero.
   * The function schedules its own offbeat hats/arpeggio inside that beat.
   * songIndex selects one of three harmonically self-contained arrangements.
   */
  scheduleBacking(when, beatIndex, bpm = 112, songIndex = 0) {
    if (!this.context || this.context.state === 'closed' || !Number.isFinite(beatIndex)) return;
    const t = this._when(when);
    const beat = Math.max(0, Math.floor(beatIndex));
    const tempo = Math.max(50, Math.min(220, Number.isFinite(bpm) ? bpm : 112));
    const dt = 60 / tempo;
    const song = ((Math.floor(Number.isFinite(songIndex) ? songIndex : 0) % 3) + 3) % 3;
    const key = `${song}:${beat}:${t.toFixed(4)}`;
    if (key === this._lastBackingKey) return;
    this._lastBackingKey = key;
    const progressions = [
      [{ root: 45, minor: true }, { root: 41 }, { root: 48 }, { root: 43 }],
      [{ root: 50, minor: true }, { root: 46 }, { root: 41 }, { root: 48 }],
      [{ root: 40, minor: true }, { root: 48 }, { root: 43 }, { root: 50 }],
    ];
    const chord = progressions[song][Math.floor(beat / 4) % 4];
    const root = this._midi(chord.root);
    const third = chord.minor ? 3 : 4;
    const inBar = beat % 4;
    const bus = this.backingBus;

    if (inBar === 0 || inBar === 2) this._kick(t, bus, 0.70);
    if (inBar === 1 || inBar === 3) this._snare(t, bus, 0.46);
    this._hat(t, bus, 0.19, -0.20);
    this._hat(t + dt * 0.5, bus, inBar === 3 ? 0.24 : 0.14, 0.25);

    // A short root-and-octave pulse leaves space for the player's bass lane.
    this._tone(t, dt * 0.66, root, bus, 'bass', 0.36);
    this._tone(t + dt * 0.5, dt * 0.30, root * 2, bus, 'bass', 0.13);
    if (inBar === 0) {
      this._chord(t, dt * 3.85, root * 2, [0, third, 7], bus, 0.12);
    }
    const pattern = [0, 7, 12, third + 12, 7, third, 12, 7];
    const semitone = pattern[beat % pattern.length];
    this._tone(t + dt * 0.5, dt * 0.66, root * 4 * Math.pow(2, semitone / 12), bus, 'bell', 0.10, inBar % 2 ? -0.30 : 0.30);
  }

  /** Short count-in / UI cue. */
  cue(when = this.time) {
    if (!this.context || this.context.state === 'closed') return;
    this._tone(this._when(when), 0.105, 880, this.playerBus, 'bell', 0.18);
  }

  _when(when) {
    return Math.max(this.time, Number.isFinite(when) ? when : this.time);
  }
  _frequency(freq, fallback) {
    return Number.isFinite(freq) ? Math.max(25, Math.min(4000, freq)) : fallback;
  }
  _midi(note) { return 440 * Math.pow(2, (note - 69) / 12); }

  _voice(bus, t, duration, peak, attack = 0.005, pan = 0) {
    while (this._voices.size >= this._maxVoices) this._dispose(this._voices.values().next().value);
    const c = this.context;
    const amp = c.createGain();
    const end = t + Math.max(0.035, duration);
    const rise = Math.min(attack, duration * 0.25);
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(Math.max(0.0001, peak), t + rise);
    amp.gain.exponentialRampToValueAtTime(0.0001, end);
    amp.gain.setValueAtTime(0, end + 0.004);
    const nodes = [amp];
    if (typeof c.createStereoPanner === 'function' && pan !== 0) {
      const panner = c.createStereoPanner();
      panner.pan.value = pan;
      amp.connect(panner);
      panner.connect(bus);
      nodes.push(panner);
    } else amp.connect(bus);
    const voice = { amp, sources: [], nodes, end: end + 0.012, ended: 0, disposed: false };
    this._voices.add(voice);
    return voice;
  }

  _source(voice, source, t, destination = voice.amp) {
    voice.sources.push(source);
    source.connect(destination);
    source.onended = () => {
      voice.ended++;
      if (voice.ended >= voice.sources.length) this._dispose(voice);
    };
    source.start(t);
    source.stop(voice.end);
    return source;
  }

  _dispose(voice) {
    if (!voice || voice.disposed) return;
    voice.disposed = true;
    for (const source of voice.sources) {
      source.onended = null;
      try { source.stop(); } catch (_) { /* Already stopped. */ }
      try { source.disconnect(); } catch (_) { /* Already disconnected. */ }
    }
    for (const node of voice.nodes) {
      try { node.disconnect(); } catch (_) { /* Already disconnected. */ }
    }
    this._voices.delete(voice);
  }

  _kick(t, bus, strength) {
    const v = this._voice(bus, t, 0.26, strength * 0.73, 0.003);
    const osc = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(145, t);
    osc.frequency.exponentialRampToValueAtTime(47, t + 0.105);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.26);
    this._source(v, osc, t);
  }

  _snare(t, bus, strength) {
    const v = this._voice(bus, t, 0.16, strength * 0.44, 0.002);
    const high = this.context.createBiquadFilter();
    high.type = 'highpass'; high.frequency.value = 1150;
    const low = this.context.createBiquadFilter();
    low.type = 'lowpass'; low.frequency.value = 6400;
    high.connect(low); low.connect(v.amp); v.nodes.push(high, low);
    const noise = this.context.createBufferSource(); noise.buffer = this._noise;
    this._source(v, noise, t, high);
    const body = this._voice(bus, t, 0.10, strength * 0.16, 0.002);
    const osc = this.context.createOscillator(); osc.type = 'triangle';
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.10);
    this._source(body, osc, t);
  }

  _hat(t, bus, strength, pan) {
    const v = this._voice(bus, t, 0.055, strength * 0.30, 0.001, pan);
    const high = this.context.createBiquadFilter(); high.type = 'highpass'; high.frequency.value = 7500;
    high.connect(v.amp); v.nodes.push(high);
    const noise = this.context.createBufferSource(); noise.buffer = this._noise;
    this._source(v, noise, t, high);
  }

  _chord(t, duration, root, intervals, bus, strength) {
    intervals.forEach((interval, i) => {
      this._tone(t, duration, root * Math.pow(2, interval / 12), bus, 'pad', strength, (i - (intervals.length - 1) / 2) * 0.23);
    });
  }

  _tone(t, duration, freq, bus, patch, strength, pan = 0) {
    const c = this.context;
    const v = this._voice(bus, t, duration, strength, patch === 'pad' ? 0.055 : 0.006, pan);
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoff = patch === 'bass' ? 1050 : patch === 'pad' ? 1750 : patch === 'lead' ? 4200 : 6000;
    filter.frequency.setValueAtTime(cutoff, t);
    filter.frequency.exponentialRampToValueAtTime(patch === 'bass' ? 160 : cutoff * 0.44, t + duration);
    filter.Q.value = patch === 'bass' ? 0.8 : 0.45;
    filter.connect(v.amp); v.nodes.push(filter);
    const osc = c.createOscillator();
    osc.type = patch === 'bell' ? 'sine' : patch === 'pad' ? 'triangle' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);
    this._source(v, osc, t, filter);
    if (patch === 'lead' || patch === 'pad') {
      // Both oscillators share a normalized gain so a wide patch stays gentle.
      v.amp.gain.cancelScheduledValues(t);
      v.amp.gain.setValueAtTime(0, t);
      v.amp.gain.linearRampToValueAtTime(strength * 0.5, t + Math.min(duration * 0.25, patch === 'pad' ? 0.055 : 0.006));
      v.amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      v.amp.gain.setValueAtTime(0, t + duration + 0.004);
      osc.detune.value = -5;
      const second = c.createOscillator();
      second.type = patch === 'pad' ? 'triangle' : 'sawtooth';
      second.frequency.setValueAtTime(freq, t); second.detune.value = 5;
      this._source(v, second, t, filter);
    }
  }
}
