export function createAudio() {
  let context,
    enabled = true,
    master,
    noiseBuffer,
    wind,
    windGain,
    melodyTimer = 0,
    noteIndex = 0;
  function unlock() {
    if (!enabled) return;
    const Constructor = window.AudioContext || window.webkitAudioContext;
    if (!Constructor) return;
    if (!context) {
      context = new Constructor();
      master = context.createGain();
      master.gain.value = 0.55;
      master.connect(context.destination);
      noiseBuffer = context.createBuffer(
        1,
        context.sampleRate * 2,
        context.sampleRate,
      );
      const data = noiseBuffer.getChannelData(0);
      let value = 0;
      for (let i = 0; i < data.length; i++) {
        value = (value + Math.random() * 0.04 - 0.02) * 0.985;
        data[i] = value;
      }
      wind = context.createBufferSource();
      wind.buffer = noiseBuffer;
      wind.loop = true;
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 650;
      windGain = context.createGain();
      windGain.gain.value = 0.1;
      wind.connect(filter).connect(windGain).connect(master);
      wind.start();
    }
    if (context.state === "suspended") context.resume().catch(() => {});
  }
  function tone(
    frequency,
    duration = 0.25,
    volume = 0.06,
    delay = 0,
    type = "sine",
  ) {
    if (!enabled || !context) return;
    const start = context.currentTime + delay,
      osc = context.createOscillator(),
      gain = context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain).connect(master);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }
  function noise(duration = 0.16, volume = 0.18, frequency = 1400) {
    if (!enabled || !context) return;
    const source = context.createBufferSource(),
      gain = context.createGain(),
      filter = context.createBiquadFilter();
    source.buffer = noiseBuffer;
    filter.type = "highpass";
    filter.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + duration,
    );
    source.connect(filter).connect(gain).connect(master);
    source.start();
    source.stop(context.currentTime + duration);
  }
  return {
    unlock,
    toggle() {
      enabled = !enabled;
      if (enabled) unlock();
      if (master && context)
        master.gain.setTargetAtTime(
          enabled ? 0.55 : 0,
          context.currentTime,
          0.12,
        );
      return enabled;
    },
    play(name) {
      if (name === "attack") {
        noise(0.16, 0.8, 700);
        tone(140, 0.1, 0.055, 0, "triangle");
      }
      if (name === "hit" || name === "hurt") {
        noise(0.24, 1.4, 250);
        tone(name === "hurt" ? 92 : 180, 0.19, 0.11, 0, "triangle");
      }
      if (name === "jump") tone(390, 0.16, 0.028);
      if (name === "pickup") {
        tone(660, 0.14, 0.055);
        tone(990, 0.25, 0.045, 0.09);
      }
      if (name === "rune") {
        [220, 330, 440, 660].forEach((n, i) => tone(n, 0.4, 0.05, i * 0.08));
      }
      if (name === "cook") {
        [392, 523, 659].forEach((n, i) => tone(n, 0.35, 0.06, i * 0.12));
      }
      if (name === "beacon" || name === "victory") {
        [261, 329, 392, 523, 659, 784].forEach((n, i) =>
          tone(n, 0.8, 0.06, i * 0.15),
        );
      }
    },
    update(dt, state, running) {
      if (!context || !enabled) return;
      windGain.gain.setTargetAtTime(
        running
          ? state.weather === "storm"
            ? 0.24
            : state.player.motion === "glide"
              ? 0.18
              : 0.08
          : 0.035,
        context.currentTime,
        0.8,
      );
      if (!running) return;
      melodyTimer -= dt;
      if (melodyTimer <= 0) {
        melodyTimer = 2.8 + Math.random() * 1.4;
        const notes = [392, 0, 523, 587, 0, 659, 587, 523, 0, 329, 392, 0];
        const n = notes[noteIndex++ % notes.length];
        if (n) tone(n, 1.3, 0.026);
      }
    },
  };
}
