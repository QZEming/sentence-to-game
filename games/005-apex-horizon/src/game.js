import { CARS, COLORS, DIFFICULTIES, MODES, TRACKS, WEATHERS } from "./data.js";
import {
  createTrack,
  sampleTrack,
  projectToTrack,
  normalizeAngle,
} from "./track.js";

const SERIES_TRACKS = ["coast", "alpine", "city"];
const POINTS = [10, 8, 6, 4, 3, 2, 1];
const DRIVER_NAMES = ["NOVA", "KAITO", "SOL", "ECHO", "RAVEN", "JUNO"];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const finite = (v, fallback = 0) => (Number.isFinite(v) ? v : fallback);
const wrap = (s, length) => ((s % length) + length) % length;

function vehicleSpec(car) {
  return CARS[car.model] || CARS.comet;
}
function colorValue(id) {
  const color = COLORS.find((item) => item.id === id);
  return color?.hex ?? COLORS[0]?.hex ?? 0xb4f565;
}

function spawnCar(track, options, id, gridIndex, ai, driverIndex = 0) {
  const model = ai
    ? Object.keys(CARS)[driverIndex % Object.keys(CARS).length]
    : options.car;
  const startS = -8 - Math.floor(gridIndex / 2) * 8;
  const offset = gridIndex === 6 ? 0 : gridIndex % 2 === 0 ? -2.9 : 2.9;
  const position = sampleTrack(track, startS, offset);
  return {
    id,
    name: ai ? DRIVER_NAMES[driverIndex] : "YOU",
    model,
    color: ai
      ? COLORS[(driverIndex + 1) % COLORS.length].hex
      : colorValue(options.color),
    ai,
    x: position.x,
    y: position.y,
    z: position.z,
    yaw: position.yaw,
    pitch: position.pitch || 0,
    roll: 0,
    vx: 0,
    vz: 0,
    speed: 0,
    velocity: 0,
    steer: 0,
    wheelSpin: 0,
    throttle: 0,
    brake: 0,
    boosting: false,
    drifting: false,
    slip: 0,
    nitro: 65,
    condition: 100,
    lap: 1,
    lapTime: 0,
    bestLap: 0,
    lapTimes: [],
    lapValid: true,
    checkpoint: 0,
    progress: startS,
    s: wrap(startS, track.length),
    offset,
    finished: false,
    finishTime: 0,
    rank: gridIndex + 1,
    wrongWay: false,
    penalty: 0,
    resetTimer: 0,
    collisionTimer: 0,
    offroad: false,
    drift: { score: 0, combo: 0, multiplier: 1, pending: 0 },
    stats: { boostTime: 0, driftDistance: 0, collisions: 0, topSpeed: 0 },
    _lastS: wrap(startS, track.length),
    _nextCheckpoint: 1,
    _safeS: startS,
    _safeProgress: startS,
    _lane: offset * 0.58,
    _pace: ai ? 0.93 + driverIndex * 0.012 : 1,
    _recovery: 0,
    _driftRecover: 0,
    _projectionIndex: undefined,
  };
}

export function createRace(options = {}) {
  const clean = {
    mode: MODES[options.mode] ? options.mode : "race",
    track: TRACKS[options.track] ? options.track : "coast",
    car: CARS[options.car] ? options.car : "comet",
    color: COLORS.some((item) => item.id === options.color)
      ? options.color
      : COLORS[0].id,
    difficulty: DIFFICULTIES[options.difficulty]
      ? options.difficulty
      : "normal",
    weather: WEATHERS[options.weather] ? options.weather : "clear",
    autoThrottle: Boolean(options.autoThrottle),
    seed: finite(options.seed, 104729),
  };
  if (clean.mode === "championship") clean.track = SERIES_TRACKS[0];
  return createRound(clean, 0, null);
}

function createRound(options, round, series) {
  const trackId =
    options.mode === "championship" ? SERIES_TRACKS[round] : options.track;
  const track = createTrack(trackId);
  const hasOpponents =
    options.mode === "race" || options.mode === "championship";
  const player = spawnCar(
    track,
    options,
    "player",
    hasOpponents ? 6 : 0,
    false,
  );
  if (!hasOpponents) {
    const start = sampleTrack(track, -8, 0);
    player.x = start.x;
    player.y = start.y;
    player.z = start.z;
    player.offset = 0;
    player._lane = 0;
    player.rank = 1;
  }
  const cars = [player];
  if (hasOpponents)
    for (let i = 0; i < 6; i++)
      cars.push(spawnCar(track, options, `ai-${i + 1}`, i, true, i));
  const points = Object.fromEntries(
    ["player", ...DRIVER_NAMES.map((_, i) => `ai-${i + 1}`)].map((id) => [
      id,
      0,
    ]),
  );
  return {
    version: 1,
    options: { ...options, track: trackId },
    phase: "countdown",
    countdown: 3,
    elapsed: 0,
    remaining: options.mode === "drift" ? MODES.drift.duration || 90 : 0,
    trackId,
    trackLength: track.length,
    laps: MODES[options.mode]?.laps || 3,
    player,
    cars,
    pickups: (TRACKS[trackId].pickups || []).map((pickup) => ({
      ...pickup,
      ...sampleTrack(track, pickup.t * track.length, pickup.offset || 0),
      active: true,
      timer: 0,
    })),
    standings: [...cars]
      .sort((a, b) => b.progress - a.progress)
      .map((car) => car.id),
    finishOrder: [],
    result: null,
    series: series || { round, total: 3, points, results: [], finished: false },
    _track: track,
    _countdownLast: 3,
  };
}

function maxYawRate(speed, spec) {
  return (
    (Math.abs(speed) * 0.036 * (spec.handling || 1)) /
    (1 + Math.abs(speed) / 70)
  );
}

/** AI and tests use exactly the same throttle, brake and steering as a human. */
export function getAIInput(state, car) {
  if (car.finished)
    return { throttle: 0, brake: 1, steer: 0, handbrake: false, boost: false };
  const track = state._track || createTrack(state.trackId);
  const spec = vehicleSpec(car);
  const difficulty =
    DIFFICULTIES[state.options.difficulty] || DIFFICULTIES.normal;
  const weather = WEATHERS[state.options.weather] || WEATHERS.clear;
  const projection = projectToTrack(track, car.x, car.z, car._projectionIndex);
  const speed = Math.max(0, car.speed);
  const lookahead = clamp(12 + speed * 0.6, 13, 49);
  let lane = car._lane || 0;
  for (const other of state.cars) {
    if (other === car || other.finished) continue;
    const ahead = normalizeDistance(other.s - projection.s, track.length);
    if (
      ahead > 0 &&
      ahead < 20 &&
      Math.abs(other.offset - lane) < 2.25 &&
      other.velocity < speed + 4
    ) {
      lane = clamp(other.offset + (other.offset <= 0 ? 3.2 : -3.2), -3.4, 3.4);
      break;
    }
  }
  const target = sampleTrack(track, projection.s + lookahead, lane);
  const desiredYaw = Math.atan2(target.x - car.x, target.z - car.z);
  const error = normalizeAngle(desiredYaw - car.yaw);
  const distance = Math.max(5, Math.hypot(target.x - car.x, target.z - car.z));
  const steeringGain = (0.036 * (spec.handling || 1)) / (1 + speed / 70);
  const steer = clamp(
    (-2.2 * Math.sin(error)) / (distance * steeringGain),
    -1,
    1,
  );
  const pace = finite(difficulty.speed, 0.95) * (car._pace || 1);
  const skill = clamp(finite(difficulty.skill, 0.9), 0.4, 1.2);
  let targetSpeed = spec.topSpeed * pace * 0.92;
  const lateralAcceleration =
    12.7 * finite(weather.grip, 1) * (0.87 + skill * 0.13);
  let maxCurve = 0;
  for (let ds = 0; ds <= 125; ds += 12) {
    const a = sampleTrack(track, projection.s + ds - 6);
    const b = sampleTrack(track, projection.s + ds + 6);
    const curve = Math.abs(normalizeAngle(b.yaw - a.yaw)) / 12;
    if (ds < 65) maxCurve = Math.max(maxCurve, curve);
    const cornerSpeed = Math.sqrt(
      lateralAcceleration / Math.max(0.00015, curve),
    );
    const allowed = Math.sqrt(
      cornerSpeed * cornerSpeed +
        2 * spec.braking * 0.66 * Math.max(0, ds - 12),
    );
    targetSpeed = Math.min(targetSpeed, allowed * Math.min(1, pace));
  }
  if (Math.abs(projection.offset) > track.width / 2 - 0.8)
    targetSpeed = Math.min(targetSpeed, 22);
  if (Math.abs(error) > 0.8) targetSpeed = Math.min(targetSpeed, 13);
  if (Math.abs(error) > 1.5) targetSpeed = 7;
  const throttle =
    speed < targetSpeed - 0.7
      ? 1
      : clamp((targetSpeed + 1.5 - speed) / 2.2, 0, 1);
  const brake = clamp((speed - targetSpeed - 0.6) / 7, 0, 1);
  return {
    throttle,
    brake,
    steer,
    handbrake: false,
    boost:
      car.nitro > 35 &&
      maxCurve < 0.0025 &&
      Math.abs(error) < 0.055 &&
      Math.abs(projection.offset) < 4 &&
      speed > spec.topSpeed * 0.65 &&
      targetSpeed > speed + 3,
  };
}

function normalizeDistance(distance, length) {
  if (distance > length / 2) return distance - length;
  if (distance < -length / 2) return distance + length;
  return distance;
}

function impact(state, car, strength, events) {
  car.drift.pending = 0;
  car.drift.combo = 0;
  car.drift.multiplier = 1;
  car._driftRecover = 0;
  car.drifting = false;
  if (car.collisionTimer > 0 || strength < 2) return;
  car.collisionTimer = 0.45;
  car.condition = Math.max(0, car.condition - clamp(strength * 0.55, 1.2, 14));
  car.stats.collisions++;
  events.push({
    type: "collision",
    actor: car.id,
    position: { x: car.x, y: car.y + 0.5, z: car.z },
    strength,
  });
}

function bankDrift(car, events) {
  const score = Math.round(car.drift.pending);
  if (score > 0) {
    car.drift.score += score;
    if (!car.ai) events.push({ type: "drift", score });
  }
  car.drift.pending = 0;
  car.drift.combo = 0;
  car.drift.multiplier = 1;
  car._driftRecover = 0;
}

function updateDrift(car, dt, events) {
  const qualifying =
    car.speed > 9 &&
    Math.abs(car.slip) > 0.18 &&
    !car.offroad &&
    car.collisionTimer <= 0;
  car.drifting = qualifying;
  if (qualifying) {
    car.drift.combo += dt;
    car.drift.multiplier = Math.min(5, 1 + Math.floor(car.drift.combo / 1.5));
    car.drift.pending +=
      car.velocity *
      Math.min(1.1, Math.abs(car.slip)) *
      24 *
      car.drift.multiplier *
      dt;
    car.stats.driftDistance += car.velocity * dt;
    car.nitro = Math.min(100, car.nitro + 7 * dt);
    car._driftRecover = 0;
  } else if (car.drift.pending > 0) {
    if (car.offroad) {
      car.drift.pending = 0;
      car.drift.combo = 0;
      car.drift.multiplier = 1;
      car._driftRecover = 0;
    } else {
      car._driftRecover += dt;
      if (car._driftRecover >= 0.65) bankDrift(car, events);
    }
  }
}

function moveCar(state, car, rawInput, dt, events) {
  const previousPose = {
    x: car.x,
    y: car.y,
    z: car.z,
    yaw: car.yaw,
    pitch: car.pitch,
  };
  const track = state._track;
  const spec = vehicleSpec(car);
  const weatherGrip = WEATHERS[state.options.weather]?.grip || 1;
  const input = rawInput || {};
  const throttle = clamp(finite(input.throttle), 0, 1);
  const brake = clamp(finite(input.brake), 0, 1);
  const targetSteer = clamp(finite(input.steer), -1, 1);
  car.steer += (targetSteer - car.steer) * (1 - Math.exp(-7 * dt));
  car.throttle = throttle;
  car.brake = brake;
  car.collisionTimer = Math.max(0, car.collisionTimer - dt);
  car.resetTimer = Math.max(0, car.resetTimer - dt);
  let fx = Math.sin(car.yaw),
    fz = Math.cos(car.yaw);
  let nx = -fz,
    nz = fx;
  let forward = car.vx * fx + car.vz * fz;
  const handbrake = Boolean(input.handbrake) && Math.abs(forward) > 5;
  car.boosting =
    Boolean(input.boost) &&
    throttle > 0.1 &&
    forward > 3 &&
    car.nitro > 0.5 &&
    !handbrake;
  const cap = spec.topSpeed * (car.boosting ? 1.22 : 1);
  const power = 0.82 + (0.18 * car.condition) / 100;
  const traction = car.offroad ? 0.65 : 1;
  let acceleration = 0;
  if (throttle > 0)
    acceleration +=
      forward < -1
        ? spec.braking * throttle
        : spec.acceleration * throttle * power * traction;
  if (brake > 0)
    acceleration -=
      forward > 1 ? spec.braking * brake : spec.acceleration * 0.6 * brake;
  acceleration -=
    Math.sign(forward) *
    (0.32 + spec.acceleration * Math.pow(Math.abs(forward) / cap, 2));
  acceleration -= forward * (car.offroad ? 0.11 : 0.011);
  if (handbrake) acceleration -= Math.sign(forward) * 4.5;
  if (car.boosting) {
    acceleration += 15.5;
    car.nitro = Math.max(0, car.nitro - 21 * dt);
    car.stats.boostTime += dt;
  } else car.nitro = Math.min(100, car.nitro + 2 * dt);
  let nextForward = clamp(forward + acceleration * dt, -12, cap * 1.05);
  if (!throttle && !brake && Math.abs(nextForward) < 0.09) nextForward = 0;
  const initialLateral = car.vx * nx + car.vz * nz;
  car.vx = fx * nextForward + nx * initialLateral;
  car.vz = fz * nextForward + nz * initialLateral;
  const yawRate =
    -car.steer *
    maxYawRate(forward, spec) *
    Math.sign(forward || 1) *
    (handbrake ? 1.24 : 1);
  car.yaw = normalizeAngle(car.yaw + yawRate * dt);
  fx = Math.sin(car.yaw);
  fz = Math.cos(car.yaw);
  nx = -fz;
  nz = fx;
  forward = car.vx * fx + car.vz * fz;
  let lateral = car.vx * nx + car.vz * nz;
  const grip =
    finite(spec.grip, 1) *
    weatherGrip *
    (car.offroad ? 0.68 : 1) *
    (handbrake ? 1.5 : 8.5);
  lateral *= Math.exp(-grip * dt);
  car.vx = fx * forward + nx * lateral;
  car.vz = fz * forward + nz * lateral;
  car.x += car.vx * dt;
  car.z += car.vz * dt;
  const projection = projectToTrack(track, car.x, car.z, car._projectionIndex);
  car._projectionIndex = projection.index;
  const edge = track.width / 2 + track.verge - 0.96;
  if (Math.abs(projection.offset) > edge) {
    const side = Math.sign(projection.offset);
    car.x = projection.x + projection.nx * edge * side;
    car.z = projection.z + projection.nz * edge * side;
    const normalSpeed =
      (car.vx * projection.nx + car.vz * projection.nz) * side;
    if (normalSpeed > 0) {
      car.vx -= projection.nx * side * normalSpeed * 1.12;
      car.vz -= projection.nz * side * normalSpeed * 1.12;
      const friction = clamp(1 - normalSpeed * 0.009, 0.64, 0.985);
      car.vx *= friction;
      car.vz *= friction;
      const tangentYaw =
        Math.abs(normalizeAngle(projection.yaw - car.yaw)) < Math.PI / 2
          ? projection.yaw
          : projection.yaw + Math.PI;
      car.yaw = normalizeAngle(
        car.yaw +
          normalizeAngle(tangentYaw - car.yaw) *
            Math.min(0.23, normalSpeed * 0.007),
      );
      impact(state, car, normalSpeed, events);
    }
    projection.offset = edge * side;
  }
  car.y = projection.y;
  car.pitch += ((projection.pitch || 0) - car.pitch) * (1 - Math.exp(-10 * dt));
  car.offset = projection.offset;
  car.offroad = Math.abs(car.offset) > track.width / 2 - 0.15;
  car.speed = car.vx * Math.sin(car.yaw) + car.vz * Math.cos(car.yaw);
  car.velocity = Math.hypot(car.vx, car.vz);
  car.slip = Math.atan2(
    car.vx * -Math.cos(car.yaw) + car.vz * Math.sin(car.yaw),
    Math.max(1, Math.abs(car.speed)),
  );
  car.roll +=
    (-car.steer * Math.min(car.velocity / 50, 1) * 0.035 - car.roll) *
    (1 - Math.exp(-6 * dt));
  car.wheelSpin += (car.speed * dt) / 0.34;
  car.stats.topSpeed = Math.max(car.stats.topSpeed, car.velocity);
  car.wrongWay =
    car.velocity > 3 && car.vx * projection.tx + car.vz * projection.tz < -2;
  updateProgress(state, car, projection.s, dt, events, previousPose);
  updateDrift(car, dt, events);
}

function updateProgress(state, car, s, dt, events, previousPose) {
  const length = state.trackLength;
  const delta = normalizeDistance(s - car._lastS, length);
  car.s = s;
  car._lastS = s;
  car.lapTime += dt;
  if (Math.abs(delta) > Math.max(8, car.velocity * dt * 3 + 1)) {
    car.lapValid = false;
    return;
  }
  const previous = car.progress;
  car.progress += delta;
  const count = TRACKS[state.trackId].checkpoints || 12;
  const gate = (car._nextCheckpoint * length) / count;
  if (delta <= 0 || previous >= gate || car.progress < gate) return;
  car._safeS = gate;
  car._safeProgress = gate;
  car._nextCheckpoint++;
  car.checkpoint = (car.checkpoint + 1) % count;
  if (car.checkpoint !== 0) return;
  // Preserve the exact gate crossing, rather than the end of this render frame.
  const fraction = clamp((gate - previous) / delta, 0, 1);
  const afterGate = dt * (1 - fraction);
  const position = {
    x: previousPose.x + (car.x - previousPose.x) * fraction,
    y: previousPose.y + (car.y - previousPose.y) * fraction,
    z: previousPose.z + (car.z - previousPose.z) * fraction,
    yaw:
      previousPose.yaw + normalizeAngle(car.yaw - previousPose.yaw) * fraction,
    pitch: previousPose.pitch + (car.pitch - previousPose.pitch) * fraction,
  };
  const completedLap = car.lap;
  const time = car.lapTime - afterGate;
  const best = car.lapValid && (!car.bestLap || time < car.bestLap);
  car.lapTimes.push(time);
  if (best) car.bestLap = time;
  events.push({
    type: "lap",
    actor: car.id,
    lap: completedLap,
    time,
    valid: car.lapValid,
    best,
    position,
  });
  if (state.options.mode !== "drift" && completedLap >= state.laps) {
    car.finished = true;
    car.finishTime = state.elapsed - afterGate + car.penalty;
    car.vx = 0;
    car.vz = 0;
    car.speed = 0;
    car.velocity = 0;
    car.boosting = false;
    state.finishOrder.push(car.id);
  } else {
    car.lap++;
    car.lapTime = afterGate;
    car.lapValid = true;
  }
}

function collideCars(state, events) {
  const cars = state.cars;
  const displaced = new Set();
  for (let i = 0; i < cars.length; i++)
    for (let j = i + 1; j < cars.length; j++) {
      const a = cars[i],
        b = cars[j];
      if (a.finished || b.finished || Math.abs(a.y - b.y) > 2) continue;
      const dx = b.x - a.x,
        dz = b.z - a.z;
      const distance = Math.hypot(dx, dz);
      if (distance > 4.3) continue;
      const nx = distance > 0.001 ? dx / distance : Math.cos(a.yaw);
      const nz = distance > 0.001 ? dz / distance : -Math.sin(a.yaw);
      const support = (car) =>
        Math.hypot(
          (nx * Math.sin(car.yaw) + nz * Math.cos(car.yaw)) * 2.1,
          (nx * -Math.cos(car.yaw) + nz * Math.sin(car.yaw)) * 0.96,
        );
      const minimum = support(a) + support(b);
      if (distance >= minimum) continue;
      const overlap = (minimum - distance + 0.01) / 2;
      a.x -= nx * overlap;
      a.z -= nz * overlap;
      b.x += nx * overlap;
      b.z += nz * overlap;
      displaced.add(a);
      displaced.add(b);
      const relative = (a.vx - b.vx) * nx + (a.vz - b.vz) * nz;
      if (relative > 0) {
        const massA = vehicleSpec(a).mass || 1200,
          massB = vehicleSpec(b).mass || 1200;
        const impulse = (relative * 1.12) / (1 / massA + 1 / massB);
        a.vx -= (nx * impulse) / massA;
        a.vz -= (nz * impulse) / massA;
        b.vx += (nx * impulse) / massB;
        b.vz += (nz * impulse) / massB;
        impact(state, a, relative * 0.65, events);
        impact(state, b, relative * 0.65, events);
      }
    }
  // A side impact must not push a car through the outside guardrail, even for one frame.
  const edge = state._track.width / 2 + state._track.verge - 0.96;
  for (const car of displaced) {
    const projection = projectToTrack(
      state._track,
      car.x,
      car.z,
      car._projectionIndex,
    );
    if (Math.abs(projection.offset) > edge) {
      const side = Math.sign(projection.offset);
      car.x = projection.x + projection.nx * edge * side;
      car.z = projection.z + projection.nz * edge * side;
      const outward = (car.vx * projection.nx + car.vz * projection.nz) * side;
      if (outward > 0) {
        car.vx -= projection.nx * side * outward;
        car.vz -= projection.nz * side * outward;
      }
      car.offset = side * edge;
    } else car.offset = projection.offset;
    car.y = projection.y;
    car.offroad = Math.abs(car.offset) > state._track.width / 2 - 0.15;
    car.velocity = Math.hypot(car.vx, car.vz);
    car.speed = car.vx * Math.sin(car.yaw) + car.vz * Math.cos(car.yaw);
  }
}

function updatePickups(state, dt, events) {
  for (const pickup of state.pickups) {
    if (!pickup.active) {
      pickup.timer = Math.max(0, pickup.timer - dt);
      if (pickup.timer <= 0) pickup.active = true;
      continue;
    }
    for (const car of state.cars) {
      if (car.finished || Math.hypot(car.x - pickup.x, car.z - pickup.z) > 2.8)
        continue;
      if (pickup.type === "repair")
        car.condition = Math.min(100, car.condition + 40);
      else car.nitro = Math.min(100, car.nitro + 35);
      pickup.active = false;
      pickup.timer = pickup.type === "repair" ? 18 : 12;
      events.push({
        type: "pickup",
        kind: pickup.type,
        position: { x: pickup.x, y: pickup.y + 1, z: pickup.z },
        actor: car.id,
      });
      break;
    }
  }
}

function updateStandings(state) {
  const sorted = [...state.cars].sort((a, b) => {
    if (a.finished && b.finished) return a.finishTime - b.finishTime;
    if (a.finished !== b.finished) return a.finished ? -1 : 1;
    return b.progress - a.progress;
  });
  state.standings = sorted.map((car, i) => {
    car.rank = i + 1;
    return car.id;
  });
}

function finishRace(state, events) {
  if (state.phase === "finished") return;
  state.phase = "finished";
  const player = state.player;
  if (state.options.mode === "drift") bankDrift(player, events);
  updateStandings(state);
  const score = player.drift.score;
  const medal =
    state.options.mode === "drift"
      ? score >= 10000
        ? "gold"
        : score >= 6000
          ? "silver"
          : score >= 2500
            ? "bronze"
            : "none"
      : player.rank === 1
        ? "gold"
        : player.rank === 2
          ? "silver"
          : player.rank === 3
            ? "bronze"
            : "none";
  state.result = {
    rank: player.rank,
    time: player.finished ? player.finishTime : state.elapsed + player.penalty,
    bestLap: player.bestLap,
    medal,
    score,
    points: state.options.mode === "championship" ? POINTS[player.rank - 1] : 0,
  };
  if (state.options.mode === "championship") {
    for (let i = 0; i < state.standings.length; i++)
      state.series.points[state.standings[i]] += POINTS[i];
    state.series.results.push({
      track: state.trackId,
      rank: player.rank,
      time: state.result.time,
      standings: [...state.standings],
      points: { ...state.series.points },
    });
    state.series.finished = state.series.round >= state.series.total - 1;
  }
  for (const car of state.cars) {
    car.boosting = false;
    car.throttle = 0;
  }
  events.push({ type: "finish" });
}

export function stepRace(state, input = {}, delta = 1 / 60) {
  const events = [];
  let remaining = clamp(finite(delta), 0, 0.25);
  if (state.phase === "finished" || remaining <= 0) return events;
  if (state.phase === "countdown") {
    const used = Math.min(remaining, state.countdown);
    state.countdown = Math.max(0, state.countdown - used);
    remaining -= used;
    const number = Math.ceil(state.countdown);
    if (number !== state._countdownLast && number > 0)
      events.push({ type: "countdown", value: number });
    state._countdownLast = number;
    if (state.countdown <= 0.000001) {
      state.phase = "racing";
      state.countdown = 0;
      events.push({ type: "go" });
    }
  }
  while (remaining > 0.0000001 && state.phase === "racing") {
    const dt = Math.min(
      remaining,
      1 / 60,
      state.options.mode === "drift" ? state.remaining : Infinity,
    );
    remaining -= dt;
    state.elapsed += dt;
    if (state.options.mode === "drift")
      state.remaining = Math.max(0, state.remaining - dt);
    const controls = state.cars.map((car) =>
      car.ai ? getAIInput(state, car) : input,
    );
    for (let i = 0; i < state.cars.length; i++)
      if (!state.cars[i].finished)
        moveCar(state, state.cars[i], controls[i], dt, events);
    collideCars(state, events);
    updatePickups(state, dt, events);
    updateStandings(state);
    if (
      state.player.finished ||
      (state.options.mode === "drift" && state.remaining <= 0)
    )
      finishRace(state, events);
  }
  return events;
}

export function command(state, action, payload = {}) {
  const events = [];
  const name = typeof action === "string" ? action : action?.type;
  if (
    name === "reset" &&
    state.phase === "racing" &&
    !state.player.finished &&
    state.player.resetTimer <= 0
  ) {
    const car = state.player;
    const point = sampleTrack(state._track, car._safeS, 0);
    car.x = point.x;
    car.y = point.y;
    car.z = point.z;
    car.yaw = point.yaw;
    car.pitch = point.pitch || 0;
    car.vx = 0;
    car.vz = 0;
    car.speed = 0;
    car.velocity = 0;
    car.steer = 0;
    car.progress = car._safeProgress;
    car.s = point.s;
    car._lastS = point.s;
    car.offset = 0;
    car.offroad = false;
    car.wrongWay = false;
    car.boosting = false;
    car.penalty += 3;
    car.lapTime += 3;
    car.lapValid = false;
    car.resetTimer = 2;
    car.drifting = false;
    car.drift.pending = 0;
    car.drift.combo = 0;
    car.drift.multiplier = 1;
    car._driftRecover = 0;
    car._projectionIndex = undefined;
    events.push(
      {
        type: "toast",
        message: "已返回上一检查点 · 时间 +3 秒",
        tone: "warning",
      },
      { type: "sound", name: "reset" },
    );
  }
  if (
    name === "nextRound" &&
    state.options.mode === "championship" &&
    state.phase === "finished" &&
    !state.series.finished
  ) {
    const series = state.series;
    series.round++;
    const fresh = createRound(state.options, series.round, series);
    Object.assign(state, fresh);
    events.push({ type: "track", track: state.trackId });
  }
  return events;
}
