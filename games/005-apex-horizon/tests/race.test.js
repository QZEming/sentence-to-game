import test from "node:test";
import assert from "node:assert/strict";
import { createRace, stepRace, command, getAIInput } from "../src/game.js";

function driveToFinish(state) {
  const laps = [];
  let maximumCheckpoint = 0;
  let maximumSpeed = 0;
  let collisions = 0;
  const dt = 1 / 60;
  for (let frame = 0; frame < 60 * 600 && state.phase !== "finished"; frame++) {
    const input = getAIInput(state, state.player);
    const events = stepRace(state, input, dt);
    maximumCheckpoint = Math.max(maximumCheckpoint, state.player.checkpoint);
    maximumSpeed = Math.max(maximumSpeed, state.player.velocity);
    for (const event of events) {
      if (event.type === "lap" && event.actor === "player") laps.push(event);
      if (event.type === "collision" && event.actor === "player") collisions++;
    }
    assert.ok(
      Number.isFinite(state.player.x) &&
        Number.isFinite(state.player.z) &&
        Number.isFinite(state.player.speed),
    );
  }
  assert.equal(
    state.phase,
    "finished",
    JSON.stringify({
      track: state.trackId,
      elapsed: state.elapsed,
      lap: state.player.lap,
      checkpoint: state.player.checkpoint,
      s: state.player.s,
      speed: state.player.speed,
      offset: state.player.offset,
      condition: state.player.condition,
      collisions,
    }),
  );
  assert.equal(
    laps.length,
    3,
    "all three laps must be driven through the real physics",
  );
  assert.ok(
    maximumCheckpoint >= 10,
    `only reached checkpoint ${maximumCheckpoint}`,
  );
  assert.ok(
    maximumSpeed > 20,
    `race never reached racing speed: ${maximumSpeed}`,
  );
  assert.equal(state.player.lapTimes.length, 3);
  for (const time of state.player.lapTimes) assert.ok(time > 10 && time < 400);
  assert.ok(state.player.bestLap > 0);
  assert.ok(state.result.time > 0);
  assert.ok(state.result.rank >= 1 && state.result.rank <= state.cars.length);
  return { laps, collisions, maximumSpeed };
}

for (const options of [
  { track: "coast", car: "comet", weather: "clear", difficulty: "normal" },
  { track: "alpine", car: "vector", weather: "wet", difficulty: "hard" },
  { track: "city", car: "tempest", weather: "clear", difficulty: "easy" },
]) {
  test(`${options.track}: complete a real three-lap timed race using steering, throttle and brake`, () => {
    const state = createRace({ mode: "time", seed: 90210, ...options });
    const { laps } = driveToFinish(state);
    assert.equal(state.result.rank, 1);
    assert.ok(laps.every((lap) => lap.valid));
    const total = state.player.lapTimes.reduce((sum, value) => sum + value, 0);
    assert.ok(
      Math.abs(total - state.result.time) < 0.1,
      `lap sum ${total}, result ${state.result.time}`,
    );
    assert.equal(state.player.penalty, 0);
  });
}

test("three complete championship races retain driver identities and award points once per round", () => {
  const state = createRace({
    mode: "championship",
    track: "city",
    car: "vector",
    difficulty: "normal",
    weather: "clear",
    seed: 12345,
  });
  const ids = state.cars.map((car) => car.id).sort();
  const tracks = ["coast", "alpine", "city"];
  command(state, "nextRound");
  assert.equal(
    state.trackId,
    "coast",
    "cannot skip the first race before finishing",
  );
  for (let round = 0; round < 3; round++) {
    assert.equal(state.trackId, tracks[round]);
    assert.equal(state.series.round, round);
    assert.deepEqual(state.cars.map((car) => car.id).sort(), ids);
    driveToFinish(state);
    assert.equal(state.series.results.length, round + 1);
    assert.equal(
      Object.values(state.series.points).reduce((sum, value) => sum + value, 0),
      34 * (round + 1),
    );
    const points = JSON.stringify(state.series.points);
    stepRace(state, { throttle: 1 }, 0.1);
    assert.equal(
      JSON.stringify(state.series.points),
      points,
      "finished race must not award duplicate points",
    );
    if (round < 2) {
      const events = command(state, "nextRound");
      assert.equal(state.phase, "countdown");
      assert.ok(
        events.some(
          (event) =>
            event.type === "track" && event.track === tracks[round + 1],
        ),
      );
    }
  }
  assert.equal(state.series.finished, true);
  const points = JSON.stringify(state.series.points);
  command(state, "nextRound");
  assert.equal(state.trackId, "city");
  assert.equal(state.phase, "finished");
  assert.equal(JSON.stringify(state.series.points), points);
});
