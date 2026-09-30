export function createAudio() {
  let context;
  let enabled = false;
  let wind;
  let windGain;
  let lastBell = 0;
  function init() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    context ||= new AudioContext();
    if (context.state === "suspended") context.resume().catch(() => {});
    if (!wind) {
      const buffer = context.createBuffer(
        1,
        context.sampleRate * 2,
        context.sampleRate,
      );
      const samples = buffer.getChannelData(0);
      let smooth = 0;
      for (let i = 0; i < samples.length; i++) {
        smooth = (smooth + (Math.random() * 2 - 1) * 0.025) / 1.025;
        samples[i] = smooth;
      }
      wind = context.createBufferSource();
      wind.buffer = buffer;
      wind.loop = true;
      windGain = context.createGain();
      windGain.gain.value = 0;
      wind.connect(windGain).connect(context.destination);
      wind.start();
    }
  }
  function note(frequency, duration, volume = 0.08, delay = 0, type = "sine") {
    if (!enabled || !context) return;
    const at = context.currentTime + delay;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(volume, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, at + duration);
    osc.connect(gain).connect(context.destination);
    osc.start(at);
    osc.stop(at + duration);
  }
  return {
    unlock() {
      if (enabled) init();
    },
    toggle() {
      enabled = !enabled;
      if (enabled) {
        init();
        note(880, 0.25);
      } else if (windGain) windGain.gain.value = 0;
      return enabled;
    },
    update(speed, playing) {
      if (windGain && context)
        windGain.gain.setTargetAtTime(
          enabled && playing ? (speed / 33) * 0.45 : 0,
          context.currentTime,
          0.15,
        );
    },
    play(type) {
      if (type === "fish") {
        note(880, 0.16);
        note(1320, 0.28, 0.065, 0.08);
      }
      if (type === "jump" || type === "ramp") {
        note(330, 0.2, 0.07);
        note(660, 0.3, 0.06, 0.08);
      }
      if (type === "hit") note(100, 0.23, 0.08, 0, "triangle");
      if (type === "finish")
        [523, 659, 784, 1046].forEach((n, i) => note(n, 0.5, 0.08, i * 0.14));
      if (type === "start" && performance.now() - lastBell > 500) {
        note(1250, 0.6, 0.065);
        note(1680, 0.45, 0.04, 0.06);
        lastBell = performance.now();
      }
    },
  };
}
