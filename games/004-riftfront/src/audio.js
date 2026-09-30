// Small synthesized sounds keep the game completely self-contained.
export function createAudio() {
  let context;
  let master;
  let enabled = true;
  let noise;

  function unlock() {
    try {
      if (!context) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        context = new Audio();
        master = context.createGain();
        master.gain.value = 0.24;
        master.connect(context.destination);
        noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
        const samples = noise.getChannelData(0);
        for (let i = 0; i < samples.length; i++)
          samples[i] = Math.random() * 2 - 1;
      }
      if (context.state === "suspended") context.resume().catch(() => {});
    } catch {
      /* Audio is optional; browser audio policy never blocks a match. */
    }
  }

  function tone(
    frequency,
    duration,
    volume = 0.3,
    end = frequency,
    type = "sine",
    delay = 0,
  ) {
    if (!enabled || !context || context.state !== "running") return;
    const at = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, at);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(25, end),
      at + duration,
    );
    gain.gain.setValueAtTime(volume, at);
    gain.gain.exponentialRampToValueAtTime(0.001, at + duration);
    oscillator.connect(gain).connect(master);
    oscillator.start(at);
    oscillator.stop(at + duration);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }

  function burst(duration, volume, cutoff, end = 150, delay = 0) {
    if (!enabled || !context || context.state !== "running") return;
    const at = context.currentTime + delay;
    const source = context.createBufferSource();
    source.buffer = noise;
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, at);
    filter.frequency.exponentialRampToValueAtTime(end, at + duration);
    const gain = context.createGain();
    gain.gain.setValueAtTime(volume, at);
    gain.gain.exponentialRampToValueAtTime(0.001, at + duration);
    source.connect(filter).connect(gain).connect(master);
    source.start(at);
    source.stop(at + duration);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  }

  function play(name, weapon = "rifle", distance = 0) {
    const v = Math.max(0.05, 1 / (1 + distance * 0.12));
    if (name === "fire") {
      const settings = {
        rifle: [0.14, 0.48, 2600, 95],
        smg: [0.1, 0.35, 3600, 155],
        shotgun: [0.32, 0.8, 1700, 65],
        sniper: [0.4, 0.8, 3000, 75],
        pistol: [0.17, 0.46, 3300, 130],
      }[weapon] || [0.14, 0.48, 2600, 95];
      burst(settings[0], settings[1] * v, settings[2]);
      tone(settings[3], settings[0], v * 0.5, 35, "triangle");
    } else if (name === "explosion") {
      burst(0.7, 0.85 * v, 1000, 65);
      tone(95, 0.6, 0.8 * v, 25, "triangle");
    } else if (name === "hit") {
      tone(850, 0.055, 0.22, 450, "triangle");
    } else if (name === "headshot") {
      tone(1350, 0.08, 0.24, 700, "sine");
    } else if (name === "hurt") {
      burst(0.15, 0.18, 650, 90);
    } else if (name === "reload") {
      burst(0.07, 0.25, 4300, 1100);
      burst(0.08, 0.22, 3400, 1200, 0.26);
    } else if (name === "pickup" || name === "capture") {
      tone(660, 0.14, 0.18, 660);
      tone(990, 0.2, 0.17, 990, "sine", 0.1);
    } else if (name === "victory" || name === "defeat") {
      (name === "victory" ? [440, 554, 660, 880] : [440, 370, 294]).forEach(
        (hz, i) => tone(hz, 0.45, 0.2, hz, "triangle", i * 0.15),
      );
    } else if (name === "grenade" || name === "melee") {
      burst(0.15, 0.22, 1200, 140);
    } else if (name === "empty") {
      tone(180, 0.04, 0.15, 80, "square");
    } else if (name === "jump" || name === "slide" || name === "step") {
      burst(
        name === "slide" ? 0.23 : 0.08,
        name === "step" ? 0.07 : 0.14,
        500,
        100,
      );
    }
  }

  return {
    unlock,
    play,
    get enabled() {
      return enabled;
    },
    setEnabled(value) {
      enabled = Boolean(value);
      if (enabled) unlock();
    },
  };
}
