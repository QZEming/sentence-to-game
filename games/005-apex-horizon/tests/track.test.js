import test from "node:test";
import assert from "node:assert/strict";
import { TRACKS } from "../src/data.js";
import {
  createTrack,
  sampleTrack,
  projectToTrack,
  normalizeAngle,
} from "../src/track.js";

const near = (actual, expected, tolerance, message) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${message}: ${actual} vs ${expected}`,
  );

function properIntersection(a, b, c, d) {
  const cross = (p, q, r) =>
    (q.x - p.x) * (r.z - p.z) - (q.z - p.z) * (r.x - p.x);
  return (
    cross(a, b, c) * cross(a, b, d) < -1e-8 &&
    cross(c, d, a) * cross(c, d, b) < -1e-8
  );
}

for (const id of ["coast", "alpine", "city"]) {
  test(`${id}: road closes continuously and distance sampling wraps both ways`, () => {
    const track = createTrack(id);
    assert.ok(track.length > 1000 && track.length < 4000);
    assert.ok(track.samples.length >= 200);
    const start = sampleTrack(track, 0);
    for (const distance of [track.length, -track.length, 2 * track.length]) {
      const wrapped = sampleTrack(track, distance);
      near(
        Math.hypot(
          wrapped.x - start.x,
          wrapped.y - start.y,
          wrapped.z - start.z,
        ),
        0,
        0.001,
        "wrapped position",
      );
      near(
        normalizeAngle(wrapped.yaw - start.yaw),
        0,
        0.001,
        "wrapped heading",
      );
    }
    const before = sampleTrack(track, track.length - 0.1);
    const after = sampleTrack(track, 0.1);
    assert.ok(
      Math.hypot(before.x - after.x, before.y - after.y, before.z - after.z) <
        0.3,
    );
    assert.ok(Math.abs(normalizeAngle(before.yaw - after.yaw)) < 0.025);
  });

  test(`${id}: road centerline never crosses itself`, () => {
    const track = createTrack(id);
    const n = 240;
    const points = Array.from({ length: n }, (_, index) =>
      sampleTrack(track, (index / n) * track.length),
    );
    for (let a = 0; a < n; a++) {
      for (let b = a + 2; b < n; b++) {
        if (a === 0 && b === n - 1) continue;
        assert.equal(
          properIntersection(
            points[a],
            points[(a + 1) % n],
            points[b],
            points[(b + 1) % n],
          ),
          false,
          `road crosses at segments ${a}, ${b}`,
        );
      }
    }
  });

  test(`${id}: projection preserves signed lane offsets and local road height`, () => {
    const track = createTrack(id);
    for (const fraction of [0.02, 0.17, 0.34, 0.56, 0.73, 0.94]) {
      for (const offset of [-4, 0, 4]) {
        const position = sampleTrack(track, fraction * track.length, offset);
        const projected = projectToTrack(track, position.x, position.z);
        near(projected.offset, offset, 0.15, "signed offset");
        near(projected.y, position.y, 0.25, "road elevation");
        const delta = Math.min(
          Math.abs(projected.s - position.s),
          track.length - Math.abs(projected.s - position.s),
        );
        assert.ok(delta < 0.6, `arclength projection changed by ${delta}`);
        near(
          Math.hypot(projected.tx, projected.tz),
          1,
          0.001,
          "horizontal tangent",
        );
      }
    }
  });

  test(`${id}: slopes and pickups are driveable and stay within the barriers`, () => {
    const track = createTrack(id);
    for (let index = 0; index < 300; index++) {
      const point = sampleTrack(track, (index / 300) * track.length);
      assert.ok(Number.isFinite(point.y) && Number.isFinite(point.pitch));
      assert.ok(
        Math.abs(point.pitch) < Math.PI / 5,
        `excessive slope ${point.pitch}`,
      );
    }
    for (const pickup of TRACKS[id].pickups) {
      assert.ok(pickup.t >= 0 && pickup.t < 1);
      assert.ok(Math.abs(pickup.offset) < track.width / 2);
      assert.ok(["nitro", "repair"].includes(pickup.type));
    }
  });
}
