import { TRACKS } from "./data.js";
const cache = new Map();
const wrap = (value, length) => ((value % length) + length) % length;
export const normalizeAngle = (angle) =>
  Math.atan2(Math.sin(angle), Math.cos(angle));
const mix = (a, b, t) => a + (b - a) * t;

function spline(points, u) {
  const count = points.length;
  const i = Math.floor(u),
    t = u - i,
    t2 = t * t,
    t3 = t2 * t;
  const p0 = points[wrap(i - 1, count)],
    p1 = points[wrap(i, count)],
    p2 = points[wrap(i + 1, count)],
    p3 = points[wrap(i + 2, count)];
  return p1.map(
    (_, axis) =>
      0.5 *
      (2 * p1[axis] +
        (-p0[axis] + p2[axis]) * t +
        (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t2 +
        (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * t3),
  );
}
function withDirection(p, next, s) {
  const dx = next[0] - p[0],
    dy = next[1] - p[1],
    dz = next[2] - p[2];
  const len = Math.hypot(dx, dz) || 1;
  const tx = dx / len,
    tz = dz / len;
  return {
    x: p[0],
    y: p[1],
    z: p[2],
    tx,
    ty: dy / len,
    tz,
    nx: -tz,
    nz: tx,
    yaw: Math.atan2(tx, tz),
    pitch: Math.atan2(dy, len),
    s,
  };
}
export function createTrack(id = "coast") {
  if (!TRACKS[id]) id = "coast";
  if (cache.has(id)) return cache.get(id);
  const config = TRACKS[id],
    count = config.points.length * 56,
    raw = [];
  for (let i = 0; i <= count; i++)
    raw.push(spline(config.points, (i / count) * config.points.length));
  let length = 0;
  const cumulative = [0];
  for (let i = 1; i < raw.length; i++) {
    length += Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][2] - raw[i - 1][2]);
    cumulative.push(length);
  }
  const samples = [];
  let source = 0;
  // Uniform horizontal arc-length spacing gives physics and road meshes one reference.
  for (let i = 0; i < count; i++) {
    const s = (i / count) * length;
    while (source < cumulative.length - 2 && cumulative[source + 1] < s)
      source++;
    const t =
      (s - cumulative[source]) / (cumulative[source + 1] - cumulative[source]);
    const p = raw[source].map((v, axis) => mix(v, raw[source + 1][axis], t));
    samples.push({ x: p[0], y: p[1], z: p[2], s });
  }
  for (let i = 0; i < count; i++) {
    const prev = samples[wrap(i - 1, count)],
      next = samples[(i + 1) % count],
      p = samples[i];
    const dir = withDirection(
      [prev.x, prev.y, prev.z],
      [next.x, next.y, next.z],
      p.s,
    );
    Object.assign(p, {
      tx: dir.tx,
      ty: dir.ty,
      tz: dir.tz,
      nx: dir.nx,
      nz: dir.nz,
      yaw: dir.yaw,
      pitch: dir.pitch,
    });
  }
  const track = { ...config, samples, length, spacing: length / count };
  cache.set(id, track);
  return track;
}
export function sampleTrack(track, distance, offset = 0) {
  if (typeof track === "string") track = createTrack(track);
  const s = wrap(distance, track.length),
    u = s / track.spacing,
    index = Math.floor(u),
    t = u - index;
  const a = track.samples[index % track.samples.length],
    b = track.samples[(index + 1) % track.samples.length];
  let tx = mix(a.tx, b.tx, t),
    tz = mix(a.tz, b.tz, t);
  const n = Math.hypot(tx, tz) || 1;
  tx /= n;
  tz /= n;
  const ty = mix(a.ty, b.ty, t),
    nx = -tz,
    nz = tx;
  return {
    x: mix(a.x, b.x, t) + nx * offset,
    y: mix(a.y, b.y, t),
    z: mix(a.z, b.z, t) + nz * offset,
    tx,
    ty,
    tz,
    nx,
    nz,
    yaw: Math.atan2(tx, tz),
    pitch: Math.atan2(ty, 1),
    s,
    index,
  };
}
export function projectToTrack(track, x, z, hint) {
  if (typeof track === "string") track = createTrack(track);
  let bestDistance = Infinity,
    bestIndex = 0,
    bestT = 0;
  const inspect = (i) => {
    const a = track.samples[i],
      b = track.samples[(i + 1) % track.samples.length];
    const dx = b.x - a.x,
      dz = b.z - a.z;
    const t = Math.max(
      0,
      Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz)),
    );
    const distance = (x - a.x - dx * t) ** 2 + (z - a.z - dz * t) ** 2;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
      bestT = t;
    }
  };
  if (Number.isInteger(hint) && hint >= 0 && hint < track.samples.length) {
    for (let delta = -18; delta <= 18; delta++)
      inspect(wrap(hint + delta, track.samples.length));
  }
  if (bestDistance > 25 * 25)
    for (let i = 0; i < track.samples.length; i++) inspect(i);
  const s = (bestIndex + bestT) * track.spacing;
  const p = sampleTrack(track, s);
  return {
    ...p,
    offset: (x - p.x) * p.nx + (z - p.z) * p.nz,
    distance: Math.sqrt(bestDistance),
    index: bestIndex,
  };
}
