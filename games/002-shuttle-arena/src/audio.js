export function createAudio() {
  let context;
  let enabled = true;
  let noiseBuffer;
  function unlock() {
    if (!enabled) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    context ||= new AudioContext();
    if (context.state === "suspended") context.resume().catch(() => {});
    if (!noiseBuffer) {
      noiseBuffer = context.createBuffer(
        1,
        context.sampleRate * 0.4,
        context.sampleRate,
      );
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
  }
  function tone(frequency, duration, volume, delay = 0, type = "sine") {
    if (!enabled || !context) return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 0.85,
      start + duration,
    );
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }
  function noise(duration, frequency, volume) {
    if (!enabled || !context || !noiseBuffer) return;
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    const gain = context.createGain();
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + duration,
    );
    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
    source.stop(context.currentTime + duration);
  }
  return {
    unlock,
    toggle() {
      enabled = !enabled;
      if (enabled) {
        unlock();
        tone(660, 0.1, 0.07);
      }
      return enabled;
    },
    play(type, data = {}) {
      if (type === "hit") {
        const smash = data.shot === "smash";
        noise(smash ? 0.18 : 0.095, smash ? 2600 : 3700, smash ? 0.32 : 0.2);
        tone(smash ? 230 : 430, 0.08, 0.045);
      }
      if (type === "serve") {
        noise(0.07, 3200, 0.14);
        tone(510, 0.07, 0.03);
      }
      if (type === "miss") noise(0.16, 1700, 0.07);
      if (type === "point") {
        const won = data.winner === 0;
        tone(won ? 660 : 330, 0.2, 0.065);
        tone(won ? 880 : 260, 0.3, 0.065, 0.13);
      }
      if (type === "game" || type === "match") {
        const notes =
          data.winner === 0 ? [523, 659, 784, 1046] : [392, 330, 262];
        notes.forEach((note, i) =>
          tone(note, 0.42, 0.06, i * 0.16, "triangle"),
        );
      }
    },
  };
}
