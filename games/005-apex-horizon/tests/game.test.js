import test from "node:test";
import assert from "node:assert/strict";
import { CARS } from "../src/data.js";
import {
  createTrack,
  sampleTrack,
  projectToTrack,
  normalizeAngle,
} from "../src/track.js";
import { createRace, stepRace, command, getAIInput } from "../src/game.js";

const neutral = {
  throttle: 0,
  brake: 0,
  steer: 0,
  handbrake: false,
  boost: false,
};
const dt = 1 / 60;

function advance(state, seconds, input = neutral) {
  const events = [];
  for (let frame = 0; frame < Math.ceil(seconds / dt); frame++) {
    events.push(
      ...stepRace(
        state,
        typeof input === "function" ? input(state) : input,
        dt,
      ),
    );
  }
  return events;
}

function ready(options = {}) {
  const state = createRace({
    mode: "time",
    track: "coast",
    car: "comet",
    color: "mint",
    difficulty: "normal",
    weather: "clear",
    seed: 5150,
    ...options,
  });
  for (let frame = 0; frame < 300 && state.phase === "countdown"; frame++)
    stepRace(state, neutral, dt);
  assert.equal(state.phase, "racing");
  return state;
}

function placeCar(
  state,
  car,
  distance,
  offset = 0,
  speed = 0,
  headingOffset = 0,
) {
  const point = sampleTrack(createTrack(state.trackId), distance, offset);
  Object.assign(car, {
    x: point.x,
    y: point.y,
    z: point.z,
    yaw: point.yaw + headingOffset,
    pitch: point.pitch,
    vx: point.tx * speed,
    vz: point.tz * speed,
    speed: speed * Math.cos(headingOffset),
    velocity: Math.abs(speed),
    s: point.s,
    offset,
  });
  return point;
}

test("race grid has six distinct AI opponents while timed practice is solo", () => {
  const race = createRace({ mode: "race", seed: 17 });
  assert.equal(race.cars.length, 7);
  assert.equal(new Set(race.cars.map((car) => car.id)).size, 7);
  assert.equal(race.cars.filter((car) => car.ai).length, 6);
  assert.equal(createRace({ mode: "time" }).cars.length, 1);
  assert.equal(createRace({ mode: "drift" }).cars.length, 1);
  for (let a = 0; a < race.cars.length; a++) {
    for (let b = a + 1; b < race.cars.length; b++) {
      assert.ok(
        Math.hypot(
          race.cars[a].x - race.cars[b].x,
          race.cars[a].z - race.cars[b].z,
        ) > 2,
      );
    }
  }
});

test("countdown prevents driving and emits one green light", () => {
  const state = createRace({ mode: "time" });
  const start = { x: state.player.x, z: state.player.z };
  advance(state, 1, { ...neutral, throttle: 1, boost: true });
  assert.equal(state.phase, "countdown");
  assert.equal(state.player.x, start.x);
  assert.equal(state.player.z, start.z);
  const events = advance(state, 3.2);
  assert.equal(state.phase, "racing");
  assert.equal(events.filter((event) => event.type === "go").length, 1);
});

test("throttle accelerates forward, brake slows, and holding brake engages reverse", () => {
  const braking = ready();
  const coasting = ready();
  for (const state of [braking, coasting])
    advance(state, 2, { ...neutral, throttle: 1 });
  assert.ok(braking.player.speed > 10);
  advance(braking, 0.4, { ...neutral, brake: 1 });
  advance(coasting, 0.4);
  assert.ok(braking.player.speed < coasting.player.speed - 2);
  advance(braking, 5, { ...neutral, brake: 1 });
  assert.ok(braking.player.speed < -1, `reverse speed ${braking.player.speed}`);
});

test("right steering turns physically right and left steering turns left", () => {
  for (const steer of [-1, 1]) {
    const state = ready();
    const point = placeCar(state, state.player, 30, 0, 14);
    advance(state, 0.35, { ...neutral, throttle: 0.2, steer });
    const relativeYaw = normalizeAngle(state.player.yaw - point.yaw);
    assert.ok(
      relativeYaw * steer < -0.03,
      `steer ${steer} produced yaw ${relativeYaw}`,
    );
    const lateral =
      (state.player.x - point.x) * point.nx +
      (state.player.z - point.z) * point.nz;
    assert.ok(lateral * steer > 0, `steer ${steer} moved ${lateral} laterally`);
  }
});

test("boost consumes nitro and adds acceleration, release recharges it", () => {
  const boosted = ready();
  const ordinary = ready();
  const nitro = boosted.player.nitro;
  advance(boosted, 1.5, { ...neutral, throttle: 1, boost: true });
  advance(ordinary, 1.5, { ...neutral, throttle: 1 });
  assert.ok(boosted.player.nitro < nitro);
  assert.ok(boosted.player.velocity > ordinary.player.velocity + 1);
  assert.ok(boosted.player.stats.boostTime > 1);
  const depleted = boosted.player.nitro;
  advance(boosted, 0.5);
  assert.ok(boosted.player.nitro > depleted);
});

test("empty nitro cannot create free boost", () => {
  const state = ready();
  state.player.nitro = 0;
  advance(state, 0.1, { ...neutral, throttle: 1, boost: true });
  assert.ok(state.player.nitro >= 0);
  assert.equal(state.player.boosting, false);
});

test("vehicle choice changes actual acceleration and paint is selected in the race state", () => {
  const speeds = [];
  for (const car of Object.keys(CARS)) {
    const state = ready({ car });
    assert.equal(state.player.model, car);
    advance(state, 1, { ...neutral, throttle: 1 });
    speeds.push(state.player.speed);
  }
  assert.ok(Math.max(...speeds) - Math.min(...speeds) > 0.3);
});

test("wet weather reduces lateral grip during recovery from the same slide", () => {
  const dry = ready({ weather: "clear" });
  const wet = ready({ weather: "wet" });
  for (const state of [dry, wet]) {
    placeCar(state, state.player, 60, 0, 25, 0.3);
    advance(state, 0.2);
  }
  assert.ok(Math.abs(wet.player.slip) > Math.abs(dry.player.slip) + 0.01);
});

test("handbrake creates a slide, and a clean recovery banks its score", () => {
  const state = ready({ mode: "drift" });
  placeCar(state, state.player, 60, -3, 25);
  advance(state, 0.8, {
    ...neutral,
    throttle: 0.6,
    steer: 0.8,
    handbrake: true,
  });
  assert.equal(state.player.drifting, true);
  assert.ok(state.player.drift.pending > 5);
  assert.equal(state.player.drift.score, 0);
  assert.ok(state.player.stats.driftDistance > 5);
  const events = advance(state, 1.2, {
    ...neutral,
    throttle: 0.2,
    steer: -0.15,
  });
  assert.ok(state.player.drift.score > 5);
  assert.equal(state.player.drift.pending, 0);
  assert.ok(events.some((event) => event.type === "drift" && event.score > 0));
});

test("a barrier crash forfeits the drift that has not yet been banked", () => {
  const state = ready({ mode: "drift" });
  placeCar(state, state.player, 60, -3, 25);
  advance(state, 0.8, {
    ...neutral,
    throttle: 0.6,
    steer: 0.8,
    handbrake: true,
  });
  assert.ok(state.player.drift.pending > 5);
  const track = createTrack(state.trackId);
  const point = placeCar(
    state,
    state.player,
    90,
    track.width / 2 + track.verge,
    10,
  );
  state.player.vx += point.nx * 20;
  state.player.vz += point.nz * 20;
  advance(state, 0.1);
  assert.equal(state.player.drift.pending, 0);
  assert.equal(state.player.drift.score, 0);
  assert.ok(state.player.stats.collisions > 0);
});

test("difficulty changes the actual distance covered by AI drivers", () => {
  const easy = ready({ mode: "race", difficulty: "easy" });
  const hard = ready({ mode: "race", difficulty: "hard" });
  advance(easy, 20);
  advance(hard, 20);
  const leadingDistance = (state) =>
    Math.max(...state.cars.filter((car) => car.ai).map((car) => car.progress));
  assert.ok(leadingDistance(hard) > leadingDistance(easy) + 30);
});

test("guardrails contain the car, slow impact speed, and damage condition", () => {
  const state = ready();
  const track = createTrack(state.trackId);
  const point = placeCar(
    state,
    state.player,
    60,
    track.width / 2 + track.verge + 1,
    20,
  );
  state.player.vx += point.nx * 10;
  state.player.vz += point.nz * 10;
  const events = advance(state, 0.1);
  const projected = projectToTrack(track, state.player.x, state.player.z);
  assert.ok(
    Math.abs(projected.offset) <= track.width / 2 + track.verge,
    `outside rail: ${projected.offset}`,
  );
  assert.ok(state.player.condition < 100);
  assert.ok(
    events.some(
      (event) => event.type === "collision" && event.actor === "player",
    ),
  );
  assert.ok(state.player.stats.collisions >= 1);
});

test("overlapping cars are separated by collision response", () => {
  const state = ready({ mode: "race" });
  const bot = state.cars.find((car) => car.ai);
  placeCar(state, state.player, 40, 0, 12);
  placeCar(state, bot, 40, 0.5, 0);
  const before = Math.hypot(state.player.x - bot.x, state.player.z - bot.z);
  advance(state, 0.1);
  const after = Math.hypot(state.player.x - bot.x, state.player.z - bot.z);
  assert.ok(after > before + 0.5, `collision separation ${before} → ${after}`);
});

test("reset adds a time penalty, invalidates the lap, and cannot grant progress", () => {
  const state = ready();
  advance(state, 1, { ...neutral, throttle: 1 });
  const { lap, checkpoint, progress, penalty } = state.player;
  command(state, "reset");
  assert.equal(state.player.penalty, penalty + 3);
  assert.equal(state.player.lap, lap);
  assert.equal(state.player.checkpoint, checkpoint);
  assert.ok(state.player.progress <= progress + 0.1);
  assert.equal(state.player.lapValid, false);
  assert.ok(Math.abs(state.player.speed) < 0.001);
  assert.equal(state.player.drift.pending, 0);
  command(state, "reset");
  assert.equal(
    state.player.penalty,
    penalty + 3,
    "holding reset must not repeatedly apply penalties",
  );
});

test("teleporting across checkpoint gates cannot complete a lap", () => {
  const state = ready();
  const track = createTrack(state.trackId);
  placeCar(state, state.player, track.length * 0.72, 0, 15);
  advance(state, 0.1);
  placeCar(state, state.player, track.length - 1, 0, 20);
  advance(state, 0.15, { ...neutral, throttle: 1 });
  assert.equal(state.player.lap, 1);
  assert.equal(state.player.lapTimes.length, 0);
  assert.equal(state.player.finished, false);
});

test("crossing the finish gate backwards never counts a lap", () => {
  const state = ready();
  placeCar(state, state.player, 1, 0, -10, Math.PI);
  advance(state, 0.3);
  assert.equal(state.player.lap, 1);
  assert.equal(state.player.lapTimes.length, 0);
});

test("nitro pickups have a cooldown and cannot be farmed while inactive", () => {
  const state = ready();
  const pickup = state.pickups.find((item) => item.type === "nitro");
  state.player.nitro = 10;
  Object.assign(state.player, {
    x: pickup.x,
    y: pickup.y,
    z: pickup.z,
    vx: 0,
    vz: 0,
    speed: 0,
  });
  const events = advance(state, 0.1);
  assert.equal(pickup.active, false);
  assert.ok(pickup.timer > 0);
  assert.ok(state.player.nitro >= 40);
  assert.ok(
    events.some((event) => event.type === "pickup" && event.kind === "nitro"),
  );
  const nitro = state.player.nitro;
  advance(state, 0.1);
  assert.ok(state.player.nitro < nitro + 1);
});

test("repair pickups restore condition without exceeding maximum", () => {
  const state = ready();
  const pickup = state.pickups.find((item) => item.type === "repair");
  state.player.condition = 85;
  Object.assign(state.player, {
    x: pickup.x,
    y: pickup.y,
    z: pickup.z,
    vx: 0,
    vz: 0,
    speed: 0,
  });
  advance(state, 0.1);
  assert.equal(pickup.active, false);
  assert.equal(state.player.condition, 100);
});

test("drift mode ends after its timer and finished state ignores driving input", () => {
  const state = ready({ mode: "drift" });
  const events = advance(state, 91);
  assert.equal(state.phase, "finished");
  assert.equal(events.filter((event) => event.type === "finish").length, 1);
  assert.ok(state.result);
  const before = JSON.stringify({
    elapsed: state.elapsed,
    x: state.player.x,
    z: state.player.z,
    result: state.result,
  });
  advance(state, 2, { ...neutral, throttle: 1, boost: true });
  assert.equal(
    JSON.stringify({
      elapsed: state.elapsed,
      x: state.player.x,
      z: state.player.z,
      result: state.result,
    }),
    before,
  );
});

export { advance, ready, placeCar, neutral, dt };
