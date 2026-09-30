// Arcade singles: authentic rally scoring and continuous trajectories, without
// claiming to model the complete BWF officiating or doubles rules.
export const COURT = Object.freeze({
  halfWidth: 3.05,
  singlesHalfWidth: 2.59,
  halfLength: 6.7,
  netHeight: 1.55,
  serviceLine: 1.98,
});

const GRAVITY = 9.81;
const REACH = 1.68;
const SHOTS = new Set(["clear", "drop", "smash"]);
const DIFFICULTY = {
  easy: { speed: 3.35, reaction: 0.3, error: 0.12, aggression: 0.12 },
  normal: { speed: 4.1, reaction: 0.2, error: 0.065, aggression: 0.28 },
  hard: { speed: 4.95, reaction: 0.1, error: 0.025, aggression: 0.43 },
};
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const finite = (value, fallback = 0) =>
  Number.isFinite(value) ? value : fallback;
const direction = (side) => (side === 0 ? 1 : -1);

function random(state) {
  state.seed = (Math.imul(state.seed, 1664525) + 1013904223) >>> 0;
  return state.seed / 4294967296;
}

/** All state is serializable; seed makes AI choices replayable in tests. */
export function createMatch(options = {}) {
  const mode = ["quick", "match", "training"].includes(options.mode)
    ? options.mode
    : "quick";
  const difficulty = Object.hasOwn(DIFFICULTY, options.difficulty)
    ? options.difficulty
    : "normal";
  const state = {
    options: { mode, difficulty, assist: options.assist !== false },
    phase: "serve",
    elapsed: 0,
    players: [
      { x: 1.25, z: 3.8, energy: 1, swing: 0, swingType: "clear", movement: 0 },
      {
        x: -1.25,
        z: -3.8,
        energy: 1,
        swing: 0,
        swingType: "clear",
        movement: 0,
      },
    ],
    shuttle: {
      x: 1.25,
      y: 1.2,
      z: 3.4,
      vx: 0,
      vy: 0,
      vz: 0,
      active: false,
      lastHit: 0,
    },
    score: [0, 0],
    games: [0, 0],
    gameNumber: 1,
    server: mode === "training" ? 1 : 0,
    rally: 0,
    longestRally: 0,
    pointsPlayed: 0,
    winner: null,
    pointWinner: null,
    reason: "",
    pointTimer: 0,
    stats: { hits: [0, 0], smashes: [0, 0] },
    landing: { x: 0, z: 0, time: 0 },
    target: { x: 0, z: -4.6 },
    canHit: false,
    lastQuality: "",
    seed: finite(options.seed, 0x20260930) >>> 0 || 1,
    serveTimer: 0,
    aiTimer: 0,
    pendingShot: null,
    pendingTimer: 0,
    aimX: 0,
    aimDepth: 0,
    lastShot: "clear",
  };
  prepareServe(state);
  return state;
}

function prepareServe(state) {
  state.phase = "serve";
  state.rally = 0;
  state.serveTimer = 0;
  state.aiTimer = 0;
  state.pendingShot = null;
  state.pendingTimer = 0;
  state.canHit = false;
  state.pointWinner = null;
  state.reason = "";
  state.pointTimer = 0;
  const server = state.server;
  const serviceX =
    (state.score[server] % 2 === 0 ? 1 : -1) * direction(server) * 1.25;
  state.players[server].x = serviceX;
  state.players[server].z = direction(server) * 3.0;
  state.players[1 - server].x = -serviceX;
  state.players[1 - server].z = direction(1 - server) * 4.35;
  for (const player of state.players) {
    player.energy = Math.min(1, player.energy + 0.3);
    player.swing = 0;
    player.swingType = "clear";
    player.movement = 0;
  }
  attachShuttle(state);
  state.target = shotTarget(state, 0, "clear");
}

function attachShuttle(state) {
  const player = state.players[state.server];
  Object.assign(state.shuttle, {
    x: player.x,
    y: 1.15,
    z: player.z - direction(state.server) * 0.35,
    vx: 0,
    vy: 0,
    vz: 0,
    active: false,
    lastHit: state.server,
  });
  updateLanding(state);
}

function updateLanding(state) {
  const b = state.shuttle;
  const time = b.active
    ? Math.max(
        0,
        (b.vy + Math.sqrt(Math.max(0, b.vy * b.vy + 2 * GRAVITY * b.y))) /
          GRAVITY,
      )
    : 0;
  state.landing = { x: b.x + b.vx * time, z: b.z + b.vz * time, time };
}

function interception(state, side) {
  const b = state.shuttle;
  // Aim for the descending shoulder-height interception, before floor impact.
  const discriminant = b.vy * b.vy + 2 * GRAVITY * (b.y - 1.55);
  let time = discriminant >= 0 ? (b.vy + Math.sqrt(discriminant)) / GRAVITY : 0;
  time = clamp(time, 0, state.landing.time);
  return {
    x: clamp(
      b.x + b.vx * time,
      -COURT.singlesHalfWidth - 0.38,
      COURT.singlesHalfWidth + 0.38,
    ),
    z:
      direction(side) *
      clamp(direction(side) * (b.z + b.vz * time), 0.78, 6.45),
  };
}

function canReach(state, side) {
  const b = state.shuttle;
  const p = state.players[side];
  return (
    state.phase === "rally" &&
    b.active &&
    b.lastHit !== side &&
    b.z * direction(side) > 0.27 &&
    b.y >= 0.32 &&
    b.y <= 3.65 &&
    Math.hypot(b.x - p.x, b.z - p.z) <= REACH
  );
}

function shotTarget(state, side, type, ai = false) {
  const sign = -direction(side);
  let x;
  let depth;
  if (ai) {
    const opponent = state.players[0];
    // Favor open space while retaining an occasional cooperative center return.
    const width = state.options.difficulty === "easy" ? 1.3 : 2.12;
    x =
      random(state) < 0.72
        ? -Math.sign(opponent.x || 1) * width * (0.45 + random(state) * 0.55)
        : (random(state) - 0.5) * width;
    depth =
      type === "drop"
        ? 1.55 + random(state) * 0.7
        : type === "smash"
          ? 3.4 + random(state) * 1.5
          : 4.7 + random(state) * 1.0;
  } else {
    x = state.aimX * 2.14;
    const base = type === "drop" ? 1.75 : type === "smash" ? 4.3 : 5.1;
    depth = clamp(
      base + state.aimDepth * (type === "drop" ? 0.9 : 1.25),
      0.85,
      6.18,
    );
  }
  return { x, z: sign * depth };
}

function launch(
  state,
  side,
  type,
  target,
  events,
  serving = false,
  aiError = false,
) {
  const b = state.shuttle;
  const p = state.players[side];
  const contact = { x: b.x, y: b.y, z: b.z };
  const distance = Math.hypot(b.x - p.x, b.z - p.z);
  const quality = serving
    ? "发球"
    : distance <= 1.04 && b.y >= 1.05
      ? "完美"
      : distance < 1.48
        ? "精准"
        : "勉强";
  const horizontal = Math.hypot(target.x - b.x, target.z - b.z);
  // Time-of-flight ballistics: all returns obey one continuous gravity model.
  // Low contact naturally limits the pace of a smash to clear the net.
  let duration =
    type === "clear"
      ? 1.85 + horizontal * 0.045
      : type === "drop"
        ? 1.12 + horizontal * 0.058
        : 0.54 + horizontal * 0.05 + Math.max(0, 2.1 - b.y) * 0.21;
  if (serving) duration = 1.92;
  if (quality === "勉强") duration += 0.16;
  const netFraction = clamp(-b.z / (target.z - b.z), 0.02, 0.98);
  const clearance =
    COURT.netHeight + (type === "clear" ? 1.5 : type === "drop" ? 0.34 : 0.2);
  // y(net) = startY * (1-f) + 0.5*g*T²*f*(1-f).
  const minimumDuration = Math.sqrt(
    Math.max(
      0,
      (2 * (clearance - b.y * (1 - netFraction))) /
        (GRAVITY * netFraction * (1 - netFraction)),
    ),
  );
  duration = Math.max(duration, minimumDuration);
  let netError = false;
  if (aiError) {
    // Visible errors come from a real misplaced trajectory, never hidden points.
    const errorType = random(state);
    if (errorType < 0.55) netError = true;
    else if (errorType < 0.8)
      target.x = Math.sign(target.x || 1) * (2.85 + random(state) * 0.7);
    else target.z = -direction(side) * (7.05 + random(state) * 0.6);
  }
  b.vx = (target.x - b.x) / duration;
  b.vz = (target.z - b.z) / duration;
  b.vy = (0.5 * GRAVITY * duration * duration - b.y) / duration;
  if (netError) {
    const netTime = -b.z / b.vz;
    b.vy = (0.95 - b.y + 0.5 * GRAVITY * netTime * netTime) / netTime;
  }
  b.active = true;
  b.lastHit = side;
  p.swing = 0.42;
  p.swingType = type;
  p.energy = clamp(p.energy - (type === "smash" ? 0.1 : 0.025), 0, 1);
  state.lastShot = type;
  state.stats.hits[side] += 1;
  if (type === "smash") state.stats.smashes[side] += 1;
  state.rally += 1;
  state.longestRally = Math.max(state.longestRally, state.rally);
  state.aiTimer = 0;
  state.canHit = false;
  if (side === 0) state.lastQuality = quality;
  state.phase = "rally";
  updateLanding(state);
  events.push({
    type: serving ? "serve" : "hit",
    side,
    shot: type,
    quality,
    position: contact,
  });
}

function serve(state, events) {
  const side = state.server;
  attachShuttle(state);
  const target = { x: -state.players[side].x, z: -direction(side) * 4.9 };
  launch(state, side, "clear", target, events, true);
}

/** Public score helper is also used by physical net/floor collisions. */
export function awardPoint(state, winner, reason = "落地得分") {
  if (
    (winner !== 0 && winner !== 1) ||
    ["point", "gameOver", "matchOver"].includes(state.phase)
  )
    return [];
  const events = [];
  state.score[winner] += 1;
  state.pointsPlayed += 1;
  state.pointWinner = winner;
  state.reason = reason;
  state.server = state.options.mode === "training" ? 1 : winner;
  state.phase = "point";
  state.pointTimer = 1.7;
  state.shuttle.active = false;
  state.shuttle.vx = 0;
  state.shuttle.vy = 0;
  state.shuttle.vz = 0;
  state.canHit = false;
  state.pendingShot = null;
  state.pendingTimer = 0;
  events.push({ type: "point", winner, reason });
  if (state.options.mode === "training") return events;
  const goal = state.options.mode === "match" ? 21 : 7;
  const cap = state.options.mode === "match" ? 30 : 11;
  const won =
    state.score[winner] >= cap ||
    (state.score[winner] >= goal &&
      state.score[winner] - state.score[1 - winner] >= 2);
  if (!won) return events;
  state.games[winner] += 1;
  events.push({
    type: "game",
    winner,
    score: [...state.score],
    gameNumber: state.gameNumber,
  });
  const gamesNeeded = state.options.mode === "match" ? 2 : 1;
  state.phase = state.games[winner] >= gamesNeeded ? "matchOver" : "gameOver";
  if (state.phase === "matchOver") {
    state.winner = winner;
    events.push({ type: "match", winner });
  }
  return events;
}

function moveTowards(player, target, speed, dt) {
  const dx = target.x - player.x;
  const dz = target.z - player.z;
  const distance = Math.hypot(dx, dz);
  if (distance <= 0.04) {
    player.movement = 0;
    return;
  }
  const movement = Math.min(distance, speed * dt);
  player.x += (dx / distance) * movement;
  player.z += (dz / distance) * movement;
  player.movement = clamp(movement / (dt * 5), 0, 1);
}

function movePlayers(state, input, dt) {
  const human = state.players[0];
  const ai = state.players[1];
  const settings = DIFFICULTY[state.options.difficulty];
  const mx = clamp(finite(input.moveX), -1, 1);
  const mz = clamp(finite(input.moveZ), -1, 1);
  const magnitude = Math.hypot(mx, mz);
  const sprint = input.sprint && human.energy > 0.08;
  const speed = (sprint ? 7.0 : 4.75) * (0.79 + human.energy * 0.21);
  if (magnitude > 0.08) {
    const scale = Math.max(1, magnitude);
    human.x += (mx / scale) * speed * dt;
    human.z += (mz / scale) * speed * dt;
    human.movement = Math.min(1, magnitude);
  } else if (
    state.options.assist &&
    state.shuttle.lastHit === 1 &&
    state.shuttle.active
  ) {
    moveTowards(human, interception(state, 0), speed, dt);
  } else {
    human.movement = 0;
  }
  human.x = clamp(human.x, -3.35, 3.35);
  human.z = clamp(human.z, 0.7, 7.3);
  human.energy = clamp(
    human.energy +
      dt * (sprint && human.movement ? -0.22 : human.movement ? 0.035 : 0.12),
    0,
    1,
  );
  state.aiTimer += dt;
  if (
    state.shuttle.lastHit === 0 &&
    state.shuttle.active &&
    state.aiTimer >= settings.reaction
  ) {
    moveTowards(
      ai,
      interception(state, 1),
      settings.speed * (0.72 + ai.energy * 0.28),
      dt,
    );
  } else {
    moveTowards(ai, { x: 0, z: -3.75 }, settings.speed * 0.54, dt);
  }
  ai.x = clamp(ai.x, -3.35, 3.35);
  ai.z = clamp(ai.z, -7.3, -0.7);
  ai.energy = clamp(ai.energy + dt * (ai.movement > 0 ? -0.012 : 0.055), 0, 1);
}

function advanceShuttle(state, dt, events) {
  const b = state.shuttle;
  const previous = { x: b.x, y: b.y, z: b.z };
  b.x += b.vx * dt;
  b.z += b.vz * dt;
  b.y += b.vy * dt - 0.5 * GRAVITY * dt * dt;
  b.vy -= GRAVITY * dt;
  if (previous.z * b.z <= 0 && previous.z !== b.z) {
    const fraction = -previous.z / (b.z - previous.z);
    const netY = previous.y + (b.y - previous.y) * fraction;
    const netX = previous.x + (b.x - previous.x) * fraction;
    if (Math.abs(netX) <= COURT.halfWidth + 0.08 && netY <= COURT.netHeight) {
      b.x = netX;
      b.y = Math.max(0.08, netY);
      b.z = 0;
      events.push(...awardPoint(state, 1 - b.lastHit, "下网失分"));
      return;
    }
  }
  if (b.y <= 0) {
    const fraction = previous.y / Math.max(0.00001, previous.y - b.y);
    b.x = previous.x + (b.x - previous.x) * fraction;
    b.z = previous.z + (b.z - previous.z) * fraction;
    b.y = 0.035;
    const inside =
      Math.abs(b.x) <= COURT.singlesHalfWidth &&
      Math.abs(b.z) <= COURT.halfLength;
    const opponentCourt = b.z * direction(b.lastHit) < 0;
    const winner = inside && opponentCourt ? b.lastHit : 1 - b.lastHit;
    events.push(
      ...awardPoint(
        state,
        winner,
        !inside ? "击球出界" : !opponentCourt ? "未过球网" : "落地得分",
      ),
    );
    return;
  }
  updateLanding(state);
}

/** Mutates a match and returns one-shot presentation events. dt is in seconds. */
export function stepMatch(state, input = {}, dt = 1 / 60) {
  const events = [];
  if (state.phase === "matchOver") return events;
  let remaining = clamp(finite(dt), 0, 0.25);
  if (remaining <= 0) return events;
  state.aimX = clamp(finite(input.aimX), -1, 1);
  state.aimDepth = clamp(finite(input.aimDepth), -1, 1);
  const requestedShot = SHOTS.has(input.shot) ? input.shot : null;
  if (state.phase === "gameOver" && input.continue) {
    state.gameNumber += 1;
    state.score = [0, 0];
    prepareServe(state);
  }
  if (
    state.phase === "serve" &&
    state.server === 0 &&
    (input.serve || requestedShot)
  ) {
    serve(state, events);
  } else if (state.phase === "rally" && requestedShot) {
    state.pendingShot = requestedShot;
    state.pendingTimer = 0.32;
    // The visible wind-up acknowledges an early input immediately.
    state.players[0].swing = 0.18;
    state.players[0].swingType = requestedShot;
  }
  // Keep the player's selected shot preview between input events. The AI's
  // last shot must not change the player's aiming depth or target marker.
  state.target = shotTarget(
    state,
    0,
    requestedShot || state.players[0].swingType,
  );
  while (remaining > 0.000001) {
    const tick = Math.min(remaining, 1 / 120);
    remaining -= tick;
    state.elapsed += tick;
    for (const p of state.players) p.swing = Math.max(0, p.swing - tick);
    if (state.phase === "point") {
      state.pointTimer -= tick;
      if (state.pointTimer <= 0) prepareServe(state);
      continue;
    }
    if (state.phase === "gameOver" || state.phase === "matchOver") {
      state.pointTimer = Math.max(0, state.pointTimer - tick);
      for (const p of state.players) p.movement = 0;
      continue;
    }
    if (state.phase === "serve") {
      state.serveTimer += tick;
      attachShuttle(state);
      if (state.server === 1 && state.serveTimer >= 1.05) serve(state, events);
      continue;
    }
    movePlayers(state, input, tick);
    advanceShuttle(state, tick, events);
    if (state.phase !== "rally") continue;
    if (state.pendingShot && canReach(state, 0)) {
      launch(
        state,
        0,
        state.pendingShot,
        shotTarget(state, 0, state.pendingShot),
        events,
      );
      state.pendingShot = null;
      state.pendingTimer = 0;
    } else if (state.pendingShot) {
      state.pendingTimer -= tick;
      if (state.pendingTimer <= 0) {
        state.pendingShot = null;
        events.push({
          type: "miss",
          side: 0,
          reason: "再靠近羽毛球，击球提示亮起时挥拍",
        });
      }
    }
    const settings = DIFFICULTY[state.options.difficulty];
    if (
      canReach(state, 1) &&
      state.aiTimer >= settings.reaction &&
      state.shuttle.vy < 1.0 &&
      state.shuttle.y < 2.85
    ) {
      const choice = random(state);
      const type =
        choice < settings.aggression && state.shuttle.y > 1.6
          ? "smash"
          : choice < 0.4
            ? "drop"
            : "clear";
      const target = shotTarget(state, 1, type, true);
      // Extended exchanges increase pressure. Errors still resolve through
      // net/floor physics, and a rally never receives an arbitrary time limit.
      const pressure = Math.max(0, state.rally - 22) * 0.012;
      const error =
        random(state) <
        Math.min(
          0.8,
          settings.error * (0.75 + Math.min(3, state.rally * 0.06)) + pressure,
        );
      launch(state, 1, type, target, events, false, error);
    }
    state.canHit = canReach(state, 0);
  }
  return events;
}
