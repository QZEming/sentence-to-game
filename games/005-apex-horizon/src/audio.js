export function createAudio() {
  let context,
    master,
    motor,
    overtone,
    engineGain,
    tyre,
    tyreGain,
    wind,
    windGain;
  let enabled = true,
    noise;
  function unlock() {
    try {
      if (!context) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        context = new Audio();
        master = context.createGain();
        master.gain.value = 0.2;
        master.connect(context.destination);
        noise = context.createBuffer(
          1,
          context.sampleRate * 2,
          context.sampleRate,
        );
        const data = noise.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        engineGain = context.createGain();
        engineGain.gain.value = 0;
        const filter = context.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 650;
        engineGain.connect(filter).connect(master);
        motor = context.createOscillator();
        motor.type = "sawtooth";
        motor.connect(engineGain);
        motor.start();
        overtone = context.createOscillator();
        overtone.type = "triangle";
        const soft = context.createGain();
        soft.gain.value = 0.45;
        overtone.connect(soft).connect(engineGain);
        overtone.start();
        tyre = context.createOscillator();
        tyre.type = "triangle";
        tyreGain = context.createGain();
        tyreGain.gain.value = 0;
        tyre.connect(tyreGain).connect(master);
        tyre.start();
        wind = context.createBufferSource();
        wind.buffer = noise;
        wind.loop = true;
        windGain = context.createGain();
        windGain.gain.value = 0;
        const high = context.createBiquadFilter();
        high.type = "highpass";
        high.frequency.value = 1200;
        wind.connect(high).connect(windGain).connect(master);
        wind.start();
      }
      if (context.state === "suspended") context.resume().catch(() => {});
    } catch {}
  }
  function tone(hz, duration, volume = 0.2, end = hz, delay = 0) {
    if (!enabled || !context || context.state !== "running") return;
    const t = context.currentTime + delay,
      osc = context.createOscillator(),
      gain = context.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(hz, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(25, end), t + duration);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain).connect(master);
    osc.start(t);
    osc.stop(t + duration);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }
  function play(name, strength = 1) {
    if (name === "collision" && enabled && context) {
      const source = context.createBufferSource();
      source.buffer = noise;
      const filter = context.createBiquadFilter();
      filter.frequency.value = 450;
      const gain = context.createGain(),
        t = context.currentTime;
      gain.gain.setValueAtTime(Math.min(0.7, 0.15 + strength * 0.03), t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      source.connect(filter).connect(gain).connect(master);
      source.start(t);
      source.stop(t + 0.22);
      source.onended = () => {
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
    } else if (name === "countdown") tone(520, 0.15, 0.3);
    else if (name === "go") {
      tone(1040, 0.35, 0.4);
      tone(1560, 0.3, 0.15, 1560, 0.08);
    } else if (name === "pickup" || name === "lap") {
      tone(660, 0.18);
      tone(990, 0.26, 0.2, 990, 0.13);
    } else if (name === "drift") {
      tone(850, 0.12, 0.12, 1200);
    } else if (name === "finish") {
      [440, 554, 660, 880].forEach((hz, i) =>
        tone(hz, 0.45, 0.22, hz, i * 0.12),
      );
    } else if (name === "reset") tone(400, 0.2, 0.13, 150);
  }
  function update(player, running) {
    if (!context) return;
    const t = context.currentTime,
      active = enabled && running;
    const speed = Math.abs(player?.speed || 0),
      gear = Math.min(6, Math.max(1, Math.floor(speed / 13) + 1));
    const rpm = 60 + ((speed % 13) / 13) * 70 + (player?.throttle || 0) * 18;
    engineGain.gain.setTargetAtTime(
      active ? 0.07 + (player.throttle || 0) * 0.07 : 0,
      t,
      0.09,
    );
    motor.frequency.setTargetAtTime(rpm, t, 0.04);
    overtone.frequency.setTargetAtTime(rpm * 2.02, t, 0.04);
    tyreGain.gain.setTargetAtTime(
      active && player.drifting ? 0.07 : 0,
      t,
      0.06,
    );
    tyre.frequency.setTargetAtTime(
      420 + speed * 5 + Math.sin(t * 19) * 35,
      t,
      0.04,
    );
    windGain.gain.setTargetAtTime(
      active
        ? Math.max(0, speed - 22) * 0.0008 + (player.boosting ? 0.055 : 0)
        : 0,
      t,
      0.08,
    );
    return gear;
  }
  return {
    unlock,
    play,
    update,
    get enabled() {
      return enabled;
    },
    setEnabled(v) {
      enabled = !!v;
      if (enabled) unlock();
    },
  };
}
