import test from "node:test";
import assert from "node:assert/strict";
import { COURT, createMatch, stepMatch, awardPoint } from "../src/game.js";

const FRAME = 1 / 60;
const fresh = (options = {}) =>
  createMatch({
    mode: "quick",
    difficulty: "normal",
    assist: false,
    ...options,
  });

function advance(state, seconds, input = {}) {
  const events = [];
  for (let elapsed = 0; elapsed < seconds; elapsed += FRAME) {
    events.push(
      ...stepMatch(
        state,
        typeof input === "function" ? input(state) : input,
        FRAME,
      ),
    );
  }
  return events;
}

// Construct a live rally to exercise scoring independently of shot physics.
function point(state, winner, reason = "winner") {
  state.phase = "rally";
  return awardPoint(state, winner, reason);
}

test("new matches own their score, players and shuttle state", () => {
  const first = fresh();
  const second = fresh();
  assert.deepEqual(first.score, [0, 0]);
  assert.deepEqual(first.games, [0, 0]);
  assert.equal(first.phase, "serve");
  first.score[0] = 5;
  first.players[0].energy = 0;
  first.shuttle.x = 42;
  assert.deepEqual(second.score, [0, 0]);
  assert.ok(second.players[0].energy > 0);
  assert.notEqual(second.shuttle.x, 42);
});

test("quick games play to seven with a two point margin", () => {
  const state = fresh();
  state.score = [6, 6];
  point(state, 0);
  assert.deepEqual(state.score, [7, 6]);
  assert.notEqual(state.phase, "matchOver");
  point(state, 0);
  assert.deepEqual(state.score, [8, 6]);
  assert.equal(state.phase, "matchOver");
  assert.equal(state.winner, 0);
});

test("quick games have an eleven point cap", () => {
  const state = fresh();
  state.score = [10, 10];
  point(state, 1);
  assert.deepEqual(state.score, [10, 11]);
  assert.equal(state.phase, "matchOver");
  assert.equal(state.winner, 1);
});

test("standard games reach twenty one and require a two point margin", () => {
  const state = fresh({ mode: "match" });
  state.score = [20, 20];
  point(state, 1);
  assert.deepEqual(state.score, [20, 21]);
  assert.deepEqual(state.games, [0, 0]);
  point(state, 1);
  assert.deepEqual(state.score, [20, 22]);
  assert.deepEqual(state.games, [0, 1]);
  assert.equal(state.phase, "gameOver");
});

test("standard deuce stops at thirty and two games win the match", () => {
  const state = fresh({ mode: "match" });
  state.games = [1, 1];
  state.score = [29, 29];
  point(state, 0);
  assert.deepEqual(state.score, [30, 29]);
  assert.deepEqual(state.games, [2, 1]);
  assert.equal(state.phase, "matchOver");
  assert.equal(state.winner, 0);
});

test("a completed rally can only award one point", () => {
  const state = fresh();
  point(state, 0);
  awardPoint(state, 1, "duplicate");
  advance(state, 0.1);
  assert.deepEqual(state.score, [1, 0]);
  assert.equal(state.pointsPlayed, 1);
});

test("a rally winner receives the next serve", () => {
  const state = fresh();
  point(state, 1);
  assert.equal(state.server, 1);
  point(state, 0);
  assert.equal(state.server, 0);
});

test("training continues without an automatic match victory", () => {
  const state = fresh({ mode: "training" });
  for (let i = 0; i < 40; i++) point(state, 0);
  assert.notEqual(state.phase, "matchOver");
  assert.equal(state.pointsPlayed, 40);
});

test("the next standard game resets points while preserving games and the winner serving", () => {
  const state = fresh({ mode: "match" });
  state.score = [13, 20];
  point(state, 1);
  assert.equal(state.phase, "gameOver");
  stepMatch(state, { continue: true }, FRAME);
  assert.deepEqual(state.score, [0, 0]);
  assert.deepEqual(state.games, [0, 1]);
  assert.equal(state.gameNumber, 2);
  assert.equal(state.server, 1);
  assert.equal(state.phase, "serve");
});

test("even scores serve from the right, odd scores from the left, toward the diagonal box", () => {
  const state = fresh();
  assert.ok(state.players[0].x > 0);
  const serveEvents = stepMatch(state, { serve: true }, FRAME);
  assert.ok(
    serveEvents.some((event) => event.type === "serve" && event.side === 0),
  );
  assert.ok(state.landing.x < 0);
  assert.ok(
    state.landing.z < -COURT.serviceLine && state.landing.z > -COURT.halfLength,
  );
  point(state, 0);
  advance(state, 2);
  assert.equal(state.phase, "serve");
  assert.ok(state.players[0].x < 0);
  stepMatch(state, { serve: true }, FRAME);
  assert.ok(state.landing.x > 0);
  assert.ok(state.landing.z < -COURT.serviceLine);
});

test("the AI serves automatically from its own right on an even score", () => {
  const state = fresh({ mode: "training" });
  assert.equal(state.server, 1);
  assert.ok(state.players[1].x < 0 && state.players[1].z < 0);
  const events = advance(state, 1.2);
  assert.ok(events.some((event) => event.type === "serve" && event.side === 1));
  assert.ok(state.landing.x > 0 && state.landing.z > COURT.serviceLine);
});

function liveShuttle(state, values = {}) {
  state.phase = "rally";
  Object.assign(
    state.shuttle,
    { x: 0, y: 1.5, z: 3, vx: 0, vy: 0, vz: 0, active: true, lastHit: 1 },
    values,
  );
  Object.assign(state.players[0], { x: 0, z: 3 });
  return state;
}

test("a shuttle landing in the opponent singles court awards its hitter", () => {
  const state = liveShuttle(fresh(), { y: 0.015, z: -5, vy: -3, lastHit: 0 });
  const events = stepMatch(state, {}, FRAME);
  assert.deepEqual(state.score, [1, 0]);
  assert.equal(events.filter((event) => event.type === "point").length, 1);
  assert.equal(state.shuttle.active, false);
});

test("singles sidelines count as in, but the doubles alley is out", () => {
  const onLine = liveShuttle(fresh(), {
    x: COURT.singlesHalfWidth,
    y: 0.015,
    z: -5,
    vy: -3,
    lastHit: 0,
  });
  stepMatch(onLine, {}, FRAME);
  assert.deepEqual(onLine.score, [1, 0]);
  const outside = liveShuttle(fresh(), {
    x: (COURT.singlesHalfWidth + COURT.halfWidth) / 2,
    y: 0.015,
    z: -5,
    vy: -3,
    lastHit: 0,
  });
  stepMatch(outside, {}, FRAME);
  assert.deepEqual(outside.score, [0, 1]);
});

test("landing beyond the baseline or on the hitters own half loses the rally", () => {
  const beyond = liveShuttle(fresh(), {
    y: 0.015,
    z: -COURT.halfLength - 0.1,
    vy: -3,
    lastHit: 0,
  });
  stepMatch(beyond, {}, FRAME);
  assert.deepEqual(beyond.score, [0, 1]);
  const ownHalf = liveShuttle(fresh(), { y: 0.015, z: 5, vy: -3, lastHit: 0 });
  stepMatch(ownHalf, {}, FRAME);
  assert.deepEqual(ownHalf.score, [0, 1]);
});

test("a low shuttle crossing the net loses the point once", () => {
  const state = liveShuttle(fresh(), { y: 0.9, z: 0.1, vz: -20, lastHit: 0 });
  const events = advance(state, 0.25);
  assert.deepEqual(state.score, [0, 1]);
  assert.equal(events.filter((event) => event.type === "point").length, 1);
  assert.equal(state.pointsPlayed, 1);
  assert.equal(state.shuttle.z, 0);
});

test("movement stays on the player half and diagonal movement is normalized", () => {
  const straight = liveShuttle(fresh(), { y: 100, z: -3, lastHit: 0 });
  const diagonal = liveShuttle(fresh(), { y: 100, z: -3, lastHit: 0 });
  advance(straight, 0.1, { moveX: 1 });
  advance(diagonal, 0.1, { moveX: 1, moveZ: 1 });
  assert.ok(
    Math.abs(
      Math.hypot(straight.players[0].x, straight.players[0].z - 3) -
        Math.hypot(diagonal.players[0].x, diagonal.players[0].z - 3),
    ) < 0.00001,
  );
  for (const [moveX, moveZ] of [
    [1, 1],
    [-1, -1],
  ]) {
    const state = liveShuttle(fresh(), { y: 10000, z: -3, lastHit: 0 });
    advance(state, 5, { moveX, moveZ });
    assert.ok(Math.abs(state.players[0].x) <= COURT.halfWidth + 0.5);
    assert.ok(
      state.players[0].z > 0 && state.players[0].z <= COURT.halfLength + 0.7,
    );
  }
});

test("sprinting moves farther, consumes energy, and resting restores it", () => {
  const walking = liveShuttle(fresh(), { y: 100, z: -3, lastHit: 0 });
  const sprinting = liveShuttle(fresh(), { y: 100, z: -3, lastHit: 0 });
  advance(walking, 0.25, { moveX: 1 });
  advance(sprinting, 0.25, { moveX: 1, sprint: true });
  assert.ok(sprinting.players[0].x > walking.players[0].x);
  assert.ok(sprinting.players[0].energy < walking.players[0].energy);
  const tiredEnergy = sprinting.players[0].energy;
  advance(sprinting, 0.25);
  assert.ok(sprinting.players[0].energy > tiredEnergy);
  assert.ok(sprinting.players[0].energy <= 1);
});

test("all three strokes return a reachable shuttle and give distinct trajectories", () => {
  const shots = {};
  for (const shot of ["clear", "drop", "smash"]) {
    const state = liveShuttle(fresh(), { y: 2.6 });
    const events = stepMatch(state, { shot }, FRAME);
    assert.ok(
      events.some(
        (event) =>
          event.type === "hit" && event.side === 0 && event.shot === shot,
      ),
    );
    assert.equal(state.shuttle.lastHit, 0);
    assert.equal(state.stats.hits[0], 1);
    assert.ok(
      state.landing.z < 0 && Math.abs(state.landing.z) < COURT.halfLength,
    );
    shots[shot] = {
      duration: state.landing.time,
      depth: Math.abs(state.landing.z),
      state,
    };
  }
  assert.ok(shots.clear.duration > shots.smash.duration);
  assert.ok(shots.drop.depth < shots.clear.depth);
  assert.equal(shots.smash.state.stats.smashes[0], 1);
  assert.equal(shots.clear.state.stats.smashes[0], 0);
});

test("aim changes the landing side and depth", () => {
  const left = liveShuttle(fresh(), { y: 2.6 });
  const right = liveShuttle(fresh(), { y: 2.6 });
  stepMatch(left, { shot: "clear", aimX: -1, aimDepth: -1 }, FRAME);
  stepMatch(right, { shot: "clear", aimX: 1, aimDepth: 1 }, FRAME);
  assert.ok(left.landing.x < 0 && right.landing.x > 0);
  assert.ok(Math.abs(right.landing.z) > Math.abs(left.landing.z));
});

for (const shot of ["drop", "smash"]) {
  test(`${shot} target preview persists after releasing the key and an AI return`, () => {
    const state = liveShuttle(fresh({ seed: 1000 }), { y: 2.6 });
    const aiming = { aimX: 0.4, aimDepth: -0.2 };
    const hit = stepMatch(state, { ...aiming, shot }, FRAME);
    assert.ok(
      hit.some(
        (event) =>
          event.type === "hit" && event.side === 0 && event.shot === shot,
      ),
    );
    const selectedTarget = { ...state.target };

    stepMatch(state, { ...aiming, shot: null }, FRAME);
    assert.deepEqual(
      state.target,
      selectedTarget,
      "releasing the shot key must preserve its preview",
    );

    // Place a descending return within the AI reach, then let the real AI hit.
    Object.assign(state.shuttle, {
      x: 0,
      y: 1.5,
      z: -3,
      vx: 0,
      vy: -1,
      vz: 0,
      active: true,
      lastHit: 0,
    });
    Object.assign(state.players[1], { x: 0, z: -3 });
    Object.assign(state.players[0], { x: 2, z: 6, energy: 0.3, swing: 0 });
    state.aiTimer = 1;
    const response = stepMatch(state, { ...aiming, shot: null }, FRAME);
    const aiHit = response.find(
      (event) => event.type === "hit" && event.side === 1,
    );
    assert.ok(aiHit, "the fixture must exercise an actual AI stroke");
    assert.notEqual(
      aiHit.shot,
      shot,
      "the AI must use a different stroke to expose shared-shot bugs",
    );
    assert.deepEqual(state.target, selectedTarget);
    stepMatch(state, { ...aiming, shot: null }, FRAME);
    assert.deepEqual(
      state.target,
      selectedTarget,
      "the opponents shot must not change the players preview",
    );
  });
}

test("an early swing is buffered until the shuttle enters the hitting window", () => {
  const state = liveShuttle(fresh(), { y: 3.9, vy: -2 });
  const immediate = stepMatch(state, { shot: "clear" }, FRAME);
  assert.equal(
    immediate.some((event) => event.type === "hit"),
    false,
  );
  const later = advance(state, 0.2);
  assert.equal(
    later.filter((event) => event.type === "hit" && event.side === 0).length,
    1,
  );
  assert.equal(state.stats.hits[0], 1);
});

test("an unreachable swing expires and does not hit a future shuttle", () => {
  const state = liveShuttle(fresh(), { x: 6, y: 2, vy: 1 });
  stepMatch(state, { shot: "drop" }, FRAME);
  const events = advance(state, 0.4);
  assert.ok(events.some((event) => event.type === "miss"));
  liveShuttle(state, { y: 2.5 });
  advance(state, 0.1);
  assert.equal(state.stats.hits[0], 0);
});

test("a player cannot hit the same shuttle twice before the opponent returns it", () => {
  const state = liveShuttle(fresh(), { y: 2.6 });
  stepMatch(state, { shot: "drop" }, FRAME);
  const events = stepMatch(state, { shot: "smash" }, FRAME);
  assert.equal(
    events.some((event) => event.type === "hit" && event.side === 0),
    false,
  );
  assert.equal(state.stats.hits[0], 1);
});

test("assistance moves toward an incoming shuttle while explicit movement takes priority", () => {
  const assisted = liveShuttle(fresh({ assist: true }), {
    x: 2,
    y: 3,
    z: 5,
    vy: 2,
  });
  const manual = liveShuttle(fresh({ assist: false }), {
    x: 2,
    y: 3,
    z: 5,
    vy: 2,
  });
  const override = liveShuttle(fresh({ assist: true }), {
    x: 2,
    y: 3,
    z: 5,
    vy: 2,
  });
  advance(assisted, 0.2);
  advance(manual, 0.2);
  advance(override, 0.2, { moveX: -1 });
  assert.ok(assisted.players[0].x > 0 && assisted.players[0].z > 3);
  assert.equal(manual.players[0].x, 0);
  assert.equal(manual.players[0].z, 3);
  assert.ok(override.players[0].x < 0);
  assert.equal(
    assisted.stats.hits[0],
    0,
    "movement assistance must still require a swing",
  );
});

test("invalid and zero frame times leave the simulation unchanged; long frames are bounded", () => {
  for (const dt of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
    const state = fresh();
    const before = JSON.stringify(state);
    assert.deepEqual(stepMatch(state, { serve: true }, dt), []);
    assert.equal(JSON.stringify(state), before);
  }
  const state = fresh();
  stepMatch(state, { serve: true, moveX: Infinity, aimX: NaN }, 100);
  assert.ok(state.elapsed > 0 && state.elapsed <= 0.251);
  for (const part of [state.shuttle, ...state.players, state.landing]) {
    for (const value of Object.values(part))
      if (typeof value === "number") assert.ok(Number.isFinite(value));
  }
});

test("assisted play can sustain real AI rallies and complete a quick match", () => {
  const state = fresh({ difficulty: "easy", assist: true, seed: 417 });
  let hitEvents = 0;
  for (
    let frame = 0;
    frame < 60 * 240 && state.phase !== "matchOver";
    frame++
  ) {
    const events = stepMatch(
      state,
      {
        serve: state.phase === "serve",
        shot:
          state.canHit && state.shuttle.vy < 0
            ? state.rally % 4 === 0
              ? "smash"
              : "clear"
            : null,
        aimX: state.rally % 2 === 0 ? -0.65 : 0.65,
      },
      FRAME,
    );
    hitEvents += events.filter((event) => event.type === "hit").length;
  }
  assert.equal(state.phase, "matchOver");
  assert.ok(state.pointsPlayed >= 7);
  assert.ok(
    state.longestRally >= 4,
    `expected an exchange, got ${state.longestRally} contacts`,
  );
  assert.ok(state.stats.hits[0] > 5 && state.stats.hits[1] > 5);
  assert.ok(hitEvents > 10);
  assert.ok(state.winner === 0 || state.winner === 1);
});
