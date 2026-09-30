export const RACE_SECONDS = 90;
export const TARGET_FISH = 12;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export function createGameState(freeRide = false) {
  return {
    freeRide,
    time: RACE_SECONDS,
    elapsed: 0,
    distance: 0,
    lateral: 0,
    speed: 0,
    steer: 0,
    height: 0,
    verticalSpeed: 0,
    boost: 1,
    boosting: false,
    fish: 0,
    combo: 0,
    comboTimer: 0,
    score: 0,
    invulnerable: 0,
    airTime: 0,
    jumpHeld: false,
    finished: false,
    success: false,
    lap: 0,
  };
}

// Sweep the travelled interval, including the point where the circuit wraps.
export function crosses(previous, current, target, length) {
  if (current <= previous) return false;
  const occurrence = target + Math.ceil((previous - target) / length) * length;
  const next = occurrence <= previous + 1e-7 ? occurrence + length : occurrence;
  return next <= current;
}

export function stepGame(state, input, dt, length, world) {
  if (state.finished || dt <= 0) return [];
  dt = Math.min(dt, 0.05, state.freeRide ? Infinity : Math.max(0, state.time));
  const events = [];
  state.elapsed += dt;
  if (!state.freeRide) state.time = Math.max(0, state.time - dt);
  state.invulnerable = Math.max(0, state.invulnerable - dt);
  state.comboTimer = Math.max(0, state.comboTimer - dt);
  if (!state.comboTimer) state.combo = 0;

  state.boosting = Boolean(input.boost && input.forward && state.boost > 0.025);
  state.boost = clamp(state.boost + (state.boosting ? -0.3 : 0.16) * dt, 0, 1);
  const maxSpeed = state.boosting ? 33 : 22;
  const acceleration = input.brake
    ? -24
    : input.forward
      ? state.boosting
        ? 18
        : 9.5
      : -1.5;
  state.speed = clamp(state.speed + acceleration * dt, 0, 33);
  if (state.speed > maxSpeed)
    state.speed = Math.max(maxSpeed, state.speed - 10 * dt);
  const steering = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  state.steer += (steering - state.steer) * Math.min(1, dt * 9);
  state.lateral = clamp(
    state.lateral + state.steer * dt * 8.5 * Math.min(1, state.speed / 5),
    -8,
    8,
  );
  if (Math.abs(state.lateral) > 6.3)
    state.speed = Math.max(0, state.speed - dt * 12);

  if (input.jump && !state.jumpHeld && state.height <= 0) {
    state.verticalSpeed = 8.8;
    events.push({ type: "jump" });
  }
  state.jumpHeld = Boolean(input.jump);
  const previous = state.distance;
  state.distance += state.speed * dt;

  for (const ramp of world.ramps) {
    if (
      crosses(previous, state.distance, ramp.distance, length) &&
      Math.abs(state.lateral - ramp.lateral) < ramp.width * 0.5 &&
      state.height < 0.3 &&
      state.speed > 7
    ) {
      state.verticalSpeed = 10 + state.speed * 0.09;
      state.height = ramp.height ?? 1.55;
      events.push({ type: "ramp" });
    }
  }
  if (state.height > 0 || state.verticalSpeed > 0) {
    state.airTime += dt;
    state.verticalSpeed -= 21 * dt;
    state.height = Math.max(0, state.height + state.verticalSpeed * dt);
    if (state.height === 0) {
      if (state.airTime > 0.65) {
        const points = Math.round(state.airTime * 35);
        state.score += points;
        events.push({ type: "land", points });
      }
      state.airTime = 0;
      state.verticalSpeed = 0;
    }
  }

  for (const fish of world.fish) {
    if (
      !fish.collected &&
      crosses(previous - 0.8, state.distance + 0.8, fish.distance, length) &&
      Math.abs(state.lateral - fish.lateral) < 1.85 &&
      state.height < 4.5
    ) {
      fish.collected = true;
      state.fish++;
      state.combo = Math.min(state.combo + 1, 5);
      state.comboTimer = 4;
      const points = 100 + (state.combo - 1) * 25;
      state.score += points;
      state.boost = clamp(state.boost + 0.12, 0, 1);
      events.push({ type: "fish", item: fish, points, combo: state.combo });
    }
  }
  for (const obstacle of world.obstacles) {
    if (
      state.invulnerable <= 0 &&
      state.height < 1.15 &&
      crosses(
        previous - 0.65,
        state.distance + 0.65,
        obstacle.distance,
        length,
      ) &&
      Math.abs(state.lateral - obstacle.lateral) < obstacle.radius + 0.55
    ) {
      state.speed *= 0.3;
      state.invulnerable = 1.6;
      state.combo = 0;
      state.score = Math.max(0, state.score - 50);
      events.push({ type: "hit", item: obstacle });
    }
  }
  const lap = Math.floor(state.distance / length);
  if (lap > state.lap) {
    state.lap = lap;
    events.push({ type: "lap" });
  }
  if (
    !state.freeRide &&
    state.distance >= length &&
    state.fish >= TARGET_FISH
  ) {
    state.finished = true;
    state.success = true;
    state.score += Math.round(state.time * 20);
    events.push({ type: "finish", success: true });
  } else if (!state.freeRide && state.time <= 0) {
    state.finished = true;
    events.push({ type: "finish", success: false });
  }
  return events;
}
