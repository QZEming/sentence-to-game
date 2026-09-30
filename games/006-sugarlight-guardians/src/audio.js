export function createAudio() {
  let context,
    master,
    enabled = true,
    lastShot = -1,
    melodyTime = 0,
    noteIndex = 0;
  const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];
  function init() {
    if (!context) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      context = new Audio();
      master = context.createGain();
      master.gain.value = enabled ? 0.14 : 0;
      master.connect(context.destination);
    }
    if (context.state === "suspended") context.resume().catch(() => {});
  }
  function tone(
    frequency,
    duration = 0.16,
    volume = 0.3,
    type = "sine",
    delay = 0,
    endFrequency,
  ) {
    if (!enabled || !context || context.state !== "running") return;
    const at = context.currentTime + delay;
    const oscillator = context.createOscillator(),
      envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, at);
    if (endFrequency)
      oscillator.frequency.exponentialRampToValueAtTime(
        endFrequency,
        at + duration,
      );
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(
      Math.max(0.001, volume),
      at + 0.008,
    );
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(at);
    oscillator.stop(at + duration + 0.02);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  }
  function play(kind) {
    if (!enabled || !context) return;
    const now = context.currentTime;
    if (kind === "shot") {
      if (now - lastShot < 0.09) return;
      lastShot = now;
      tone(710, 0.075, 0.12, "triangle", 0, 380);
      return;
    }
    if (kind === "build" || kind === "upgrade") {
      tone(659, 0.17, 0.35);
      tone(880, 0.21, 0.27, "sine", 0.08);
      tone(1046, 0.25, 0.2, "sine", 0.16);
    } else if (kind === "kill") {
      tone(980 + Math.random() * 140, 0.08, 0.1, "sine", 0, 1480);
    } else if (kind === "waveStart") {
      tone(440, 0.2, 0.25);
      tone(659, 0.25, 0.25, "triangle", 0.15);
    } else if (kind === "waveClear" || kind === "win") {
      [523, 659, 784, 1046].forEach((f, i) =>
        tone(f, 0.38, 0.25, "sine", i * 0.13),
      );
    } else if (kind === "leak" || kind === "lose") {
      tone(294, 0.3, 0.3, "triangle", 0, 196);
      tone(220, 0.3, 0.2, "sine", 0.15);
    } else if (kind === "spell") {
      [659, 880, 1174, 1568].forEach((f, i) =>
        tone(f, 0.22, 0.22, "sine", i * 0.045),
      );
    } else if (kind === "error") tone(220, 0.12, 0.17, "triangle", 0, 180);
    else tone(784, 0.1, 0.18);
  }
  return {
    init,
    play,
    setEnabled(value) {
      enabled = Boolean(value);
      if (master && context)
        master.gain.setTargetAtTime(
          enabled ? 0.14 : 0,
          context.currentTime,
          0.05,
        );
    },
    update(dt, playing) {
      if (!enabled || !context || !playing) return;
      melodyTime += dt;
      if (melodyTime > 1.7) {
        melodyTime = 0;
        tone(notes[noteIndex++ % notes.length], 0.7, 0.035);
        tone(130.81, 0.8, 0.025, "sine");
      }
    },
    dispose() {
      if (context) context.close().catch(() => {});
    },
  };
}
