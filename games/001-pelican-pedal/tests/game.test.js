import test from "node:test";
import assert from "node:assert/strict";
import {
  createGameState,
  stepGame,
  RACE_SECONDS,
  TARGET_FISH,
} from "../src/game.js";
import { getTrackFrame, TRACK_LENGTH, ROAD_HEIGHT } from "../src/track.js";

const emptyWorld = () => ({ fish: [], obstacles: [], ramps: [] });
const fishAt = (distance, lateral = 0) => ({
  distance,
  lateral,
  collected: false,
});
const coneAt = (distance, lateral = 0) => ({ distance, lateral, radius: 0.6 });
const tick = (state, input = {}, world = emptyWorld(), dt = 0.05) =>
  stepGame(state, input, dt, TRACK_LENGTH, world);

function advance(state, seconds, input = {}, world = emptyWorld()) {
  const events = [];
  for (let i = 0; i < Math.round(seconds / 0.05); i++) {
    events.push(...tick(state, input, world));
  }
  return events;
}

test("a new challenge has a full timer and a fresh, independent score", () => {
  const state = createGameState();
  assert.equal(state.time, RACE_SECONDS);
  assert.equal(state.finished, false);
  assert.equal(state.success, false);
  assert.equal(state.freeRide, false);
  state.fish = TARGET_FISH;
  state.score = 500;
  assert.equal(createGameState().fish, 0);
  assert.equal(createGameState().score, 0);
});

test("pedalling accelerates, coasting slows down, and braking stops the bicycle", () => {
  const state = createGameState();
  advance(state, 3, { forward: true });
  const cruisingSpeed = state.speed;
  assert.ok(cruisingSpeed > 15);
  assert.ok(state.distance > 0);

  advance(state, 0.5);
  assert.ok(state.speed > 0 && state.speed < cruisingSpeed);
  advance(state, 2, { brake: true });
  assert.equal(state.speed, 0);
  const stoppedAt = state.distance;
  advance(state, 1, { brake: true });
  assert.equal(
    state.distance,
    stoppedAt,
    "braking must not make the bike reverse",
  );
});

test("steering changes lanes and going off the road slows the bicycle", () => {
  const onRoad = Object.assign(createGameState(), { speed: 20 });
  const offRoad = Object.assign(createGameState(), { speed: 20, lateral: 7 });
  tick(onRoad, { forward: true });
  tick(offRoad, { forward: true });
  assert.ok(offRoad.speed < onRoad.speed);

  advance(onRoad, 0.5, { forward: true, right: true });
  assert.ok(onRoad.lateral > 0);
  advance(onRoad, 2, { forward: true, left: true });
  assert.ok(onRoad.lateral < 0);
});

test("boost makes the bicycle faster, consumes energy, and recovers when released", () => {
  const normal = Object.assign(createGameState(), { speed: 15 });
  const boosted = Object.assign(createGameState(), { speed: 15 });
  advance(normal, 1, { forward: true });
  advance(boosted, 1, { forward: true, boost: true });
  assert.ok(boosted.distance > normal.distance);
  assert.ok(boosted.speed > normal.speed);
  assert.ok(boosted.boost < 1 && boosted.boost > 0);
  assert.equal(boosted.boosting, true);

  const energy = boosted.boost;
  advance(boosted, 1, { forward: true });
  assert.ok(boosted.boost > energy);
  assert.equal(boosted.boosting, false);
  advance(boosted, 10);
  assert.equal(boosted.boost, 1);
});

test("an empty boost meter cannot supply a burst and recovers without pedalling", () => {
  const state = Object.assign(createGameState(), { boost: 0, speed: 10 });
  tick(state, { forward: true, boost: true });
  assert.equal(state.boosting, false);
  assert.ok(state.boost > 0);

  const energy = state.boost;
  advance(state, 1, { boost: true });
  assert.equal(state.boosting, false);
  assert.ok(state.boost > energy);
});

test("a fish near the start line is collected when a fast rider crosses into the next lap", () => {
  const state = Object.assign(createGameState(), {
    distance: TRACK_LENGTH - 1.4,
    speed: 32,
  });
  const fish = fishAt(0.1);
  const world = { ...emptyWorld(), fish: [fish] };
  const events = tick(state, { forward: true, boost: true }, world);
  assert.ok(state.distance > TRACK_LENGTH);
  assert.equal(state.lap, 1);
  assert.equal(state.fish, 1);
  assert.equal(fish.collected, true);
  assert.equal(events.filter((event) => event.type === "fish").length, 1);
  assert.equal(events.filter((event) => event.type === "lap").length, 1);
});

test("swept obstacle collision also works across the start line", () => {
  const state = Object.assign(createGameState(), {
    distance: TRACK_LENGTH - 1.4,
    speed: 32,
    score: 200,
    combo: 3,
    comboTimer: 2,
  });
  const world = { ...emptyWorld(), obstacles: [coneAt(0.1)] };
  const events = tick(state, { forward: true, boost: true }, world);
  assert.ok(state.distance > TRACK_LENGTH);
  assert.equal(events.filter((event) => event.type === "hit").length, 1);
  assert.ok(state.speed < 15);
  assert.ok(state.score < 200);
  assert.equal(state.combo, 0);
});

test("a fish awards points only once, even after another circuit", () => {
  const state = Object.assign(createGameState(), {
    distance: 9,
    speed: 20,
    boost: 0.2,
  });
  const fish = fishAt(10);
  const world = { ...emptyWorld(), fish: [fish] };
  tick(state, { forward: true }, world);
  assert.equal(state.fish, 1);
  assert.ok(state.score > 0);
  assert.ok(state.boost > 0.3, "collecting a fish replenishes boost");
  const earnedScore = state.score;

  state.distance = TRACK_LENGTH + 9;
  const events = tick(state, { forward: true }, world);
  assert.equal(state.fish, 1);
  assert.equal(state.score, earnedScore);
  assert.equal(
    events.some((event) => event.type === "fish"),
    false,
  );
});

test("a different lane avoids both fish collection and a cone collision", () => {
  const state = Object.assign(createGameState(), {
    distance: 9,
    speed: 20,
    lateral: -4,
  });
  const world = {
    ...emptyWorld(),
    fish: [fishAt(10, 4)],
    obstacles: [coneAt(10, 4)],
  };
  const events = tick(state, { forward: true }, world);
  assert.equal(state.fish, 0);
  assert.equal(
    events.some((event) => event.type === "hit"),
    false,
  );
});

test("jumping before a cone clears it while the same grounded approach collides", () => {
  const ground = Object.assign(createGameState(), { speed: 20 });
  const jumper = Object.assign(createGameState(), { speed: 20 });
  const world = { ...emptyWorld(), obstacles: [coneAt(6)] };
  const groundEvents = advance(ground, 0.45, { forward: true }, world);
  const jumpEvents = advance(
    jumper,
    0.45,
    { forward: true, jump: true },
    world,
  );
  assert.ok(groundEvents.some((event) => event.type === "hit"));
  assert.ok(jumpEvents.some((event) => event.type === "jump"));
  assert.equal(
    jumpEvents.some((event) => event.type === "hit"),
    false,
  );
  assert.ok(jumper.distance > 6);
  assert.ok(jumper.height > 1.15);
});

test("holding jump produces one jump, and releasing permits the next jump after landing", () => {
  const state = createGameState();
  const heldEvents = advance(state, 2, { jump: true });
  assert.equal(heldEvents.filter((event) => event.type === "jump").length, 1);
  assert.equal(state.height, 0);
  assert.ok(heldEvents.some((event) => event.type === "land"));

  tick(state);
  const events = tick(state, { jump: true });
  assert.equal(events.filter((event) => event.type === "jump").length, 1);
  assert.ok(state.height > 0);
});

test("a ramp launches a fast rider, but a slow rider or a different lane misses it", () => {
  const world = {
    ...emptyWorld(),
    ramps: [{ distance: 5, lateral: 0, width: 3 }],
  };
  const fast = Object.assign(createGameState(), { distance: 4.8, speed: 20 });
  const slow = Object.assign(createGameState(), { distance: 4.8, speed: 5 });
  const outside = Object.assign(createGameState(), {
    distance: 4.8,
    speed: 20,
    lateral: 4,
  });
  const events = tick(fast, { forward: true }, world);
  assert.ok(events.some((event) => event.type === "ramp"));
  assert.ok(fast.height > 0);
  assert.ok(fast.verticalSpeed > 0);
  assert.equal(
    tick(slow, {}, world).some((event) => event.type === "ramp"),
    false,
  );
  assert.equal(
    tick(outside, {}, world).some((event) => event.type === "ramp"),
    false,
  );
  assert.equal(slow.height, 0);
  assert.equal(outside.height, 0);
});

test("nearby cones cannot repeatedly damage a rider during collision recovery", () => {
  const state = Object.assign(createGameState(), {
    distance: 9,
    speed: 20,
    score: 200,
  });
  const world = { ...emptyWorld(), obstacles: [coneAt(10), coneAt(10.1)] };
  const events = tick(state, { forward: true }, world);
  assert.equal(events.filter((event) => event.type === "hit").length, 1);
  const score = state.score;
  tick(state, { forward: true }, world);
  assert.equal(state.score, score);
});

test("completing a lap and collecting the final required fish wins in the same frame", () => {
  const state = Object.assign(createGameState(), {
    distance: TRACK_LENGTH - 0.1,
    speed: 10,
    fish: TARGET_FISH - 1,
    time: 20,
  });
  const world = { ...emptyWorld(), fish: [fishAt(0)] };
  const events = tick(state, { forward: true }, world);
  assert.equal(state.fish, TARGET_FISH);
  assert.equal(state.lap, 1);
  assert.equal(state.finished, true);
  assert.equal(state.success, true);
  assert.ok(state.score > 100, "remaining race time should add a finish bonus");
  assert.deepEqual(
    events.filter((event) => event.type === "finish"),
    [{ type: "finish", success: true }],
  );
});

test("neither a completed lap alone nor enough fish alone finishes the challenge", () => {
  const lapOnly = Object.assign(createGameState(), {
    distance: TRACK_LENGTH - 0.1,
    speed: 10,
  });
  tick(lapOnly, { forward: true });
  assert.equal(lapOnly.lap, 1);
  assert.equal(lapOnly.finished, false);

  const fishOnly = Object.assign(createGameState(), {
    fish: TARGET_FISH,
    speed: 10,
  });
  tick(fishOnly, { forward: true });
  assert.equal(fishOnly.finished, false);
});

test("running out of time fails and finished games no longer change", () => {
  const state = Object.assign(createGameState(), { time: 0.02, speed: 10 });
  const events = tick(state, { forward: true });
  assert.equal(state.time, 0);
  assert.equal(state.finished, true);
  assert.equal(state.success, false);
  assert.deepEqual(
    events.filter((event) => event.type === "finish"),
    [{ type: "finish", success: false }],
  );
  const frozen = structuredClone(state);
  assert.deepEqual(tick(state, { forward: true, jump: true, boost: true }), []);
  assert.deepEqual(state, frozen);
});

test("a delayed frame cannot carry a rider across the finish line after time expires", () => {
  const state = Object.assign(createGameState(), {
    time: 0.01,
    distance: TRACK_LENGTH - 0.4,
    speed: 10,
    fish: TARGET_FISH,
  });
  const events = tick(state, { forward: true }, emptyWorld(), 0.05);
  assert.equal(state.time, 0);
  assert.ok(state.distance < TRACK_LENGTH);
  assert.equal(state.finished, true);
  assert.equal(state.success, false);
  assert.deepEqual(
    events.filter((event) => event.type === "finish"),
    [{ type: "finish", success: false }],
  );
});

test("crossing the finish line within the final remaining time still wins", () => {
  const state = Object.assign(createGameState(), {
    time: 0.01,
    distance: TRACK_LENGTH - 0.05,
    speed: 10,
    fish: TARGET_FISH,
  });
  const events = tick(state, { forward: true }, emptyWorld(), 0.05);
  assert.ok(state.distance >= TRACK_LENGTH);
  assert.equal(state.finished, true);
  assert.equal(state.success, true);
  assert.deepEqual(
    events.filter((event) => event.type === "finish"),
    [{ type: "finish", success: true }],
  );
});

test("free ride continues beyond a lap and ninety seconds without a countdown", () => {
  const state = Object.assign(createGameState(true), {
    distance: TRACK_LENGTH - 0.1,
    speed: 10,
    fish: TARGET_FISH,
  });
  const events = advance(state, RACE_SECONDS + 1, { forward: true });
  assert.ok(state.elapsed > RACE_SECONDS);
  assert.ok(state.lap >= 1);
  assert.equal(state.time, RACE_SECONDS);
  assert.equal(state.finished, false);
  assert.equal(
    events.some((event) => event.type === "finish"),
    false,
  );
});

test("a long frame cannot teleport the rider or consume a large amount of race time", () => {
  const delayed = Object.assign(createGameState(), { speed: 20 });
  const regular = structuredClone(delayed);
  const input = { forward: true, right: true, boost: true, jump: true };
  const delayedEvents = tick(delayed, input, emptyWorld(), 10);
  const regularEvents = tick(regular, input, emptyWorld(), 0.05);
  assert.deepEqual(delayed, regular);
  assert.deepEqual(delayedEvents, regularEvents);
  assert.ok(delayed.distance < 2);
  assert.ok(delayed.time > RACE_SECONDS - 1);
});

test("zero or negative elapsed time does not advance the game", () => {
  for (const dt of [0, -1]) {
    const state = Object.assign(createGameState(), { speed: 20 });
    const initial = structuredClone(state);
    assert.deepEqual(
      tick(state, { forward: true, jump: true }, emptyWorld(), dt),
      [],
    );
    assert.deepEqual(state, initial);
  }
});

test("track positions wrap continuously and lateral offsets follow the road", () => {
  assert.ok(Number.isFinite(TRACK_LENGTH) && TRACK_LENGTH > 100);
  const origin = getTrackFrame(0);
  assert.ok(
    origin.position.distanceTo(getTrackFrame(TRACK_LENGTH).position) < 1e-8,
  );
  assert.ok(
    getTrackFrame(-5).position.distanceTo(
      getTrackFrame(TRACK_LENGTH - 5).position,
    ) < 1e-8,
  );

  const middle = getTrackFrame(TRACK_LENGTH / 3);
  const beside = getTrackFrame(TRACK_LENGTH / 3, 3);
  assert.ok(Math.abs(beside.position.distanceTo(middle.position) - 3) < 1e-8);
  assert.ok(Math.abs(middle.position.y - ROAD_HEIGHT) < 1e-8);
  assert.ok(Math.abs(middle.tangent.length() - 1) < 1e-8);
  assert.ok(Math.abs(middle.tangent.dot(middle.right)) < 1e-8);
});
