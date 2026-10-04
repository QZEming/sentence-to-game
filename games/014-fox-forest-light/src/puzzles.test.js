import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, reflectDirection, traceLight } from './puzzles.js';

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} ≈ ${expected}`);
const solution = level => Object.fromEntries(level.mirrors.map(m => [m.id, m.solutionAngle]));
const basic = extras => ({ source: { x: -7, z: 0, dx: 1, dz: 0, color: 'gold' }, mirrors: [], receivers: [], ...extras });

test('mirror surface angles obey the documented reflection convention', () => {
  const up = reflectDirection(1, 0, -45);
  near(up.dx, 0); near(up.dz, -1);
  const down = reflectDirection(1, 0, 45);
  near(down.dx, 0); near(down.dz, 1);
  const back = reflectDirection(1, 0, 90);
  near(back.dx, -1); near(back.dz, 0);
  const second = reflectDirection(up.dx, up.dz, 135);
  near(second.dx, 1); near(second.dz, 0);
});

for (const level of LEVELS) {
  test(`${level.id}: starts unsolved and all declared receivers have a working solution`, () => {
    const initial = traceLight(level);
    assert.ok(initial.litReceiverIds.length < level.receivers.length);
    const solved = traceLight(level, solution(level), level.plates.map(p => p.id));
    assert.deepEqual(solved.litReceiverIds.sort(), level.receivers.map(r => r.id).sort());
    assert.deepEqual(solved.hitMirrorIds.sort(), level.mirrors.map(m => m.id).sort());
    assert.ok(solved.segments.length > 1);
    for (const segment of solved.segments) {
      for (const point of [segment.from, segment.to]) {
        assert.ok(Number.isFinite(point.x) && Number.isFinite(point.z));
        assert.ok(Math.abs(point.x) <= 9.5001 && Math.abs(point.z) <= 9.5001);
      }
    }
    // Tracing must never alter reusable level data or angle state.
    assert.deepEqual(traceLight(level, solution(level), level.plates.map(p => p.id)), solved);
  });
}

test('final gate needs the pressure plate even after every mirror is correct', () => {
  const level = LEVELS.at(-1), angles = solution(level);
  assert.deepEqual(traceLight(level, angles).litReceiverIds, ['r1']);
  assert.equal(traceLight(level, angles, new Set(['p1'])).litReceiverIds.length, 2);
  assert.deepEqual(traceLight(level, angles).litReceiverIds, ['r1']);
});

test('filter changes gold, passes matching light, and absorbs the wrong color', () => {
  const level = basic({ filters: [{ id: 'f', x: 0, z: 0, color: 'blue' }], receivers: [{ id: 'r', x: 5, z: 0, color: 'blue' }] });
  assert.deepEqual(traceLight(level).litReceiverIds, ['r']);
  assert.deepEqual(traceLight({ ...level, source: { ...level.source, color: 'blue' } }).litReceiverIds, ['r']);
  const wrong = traceLight({ ...level, source: { ...level.source, color: 'rose' } });
  assert.deepEqual(wrong.litReceiverIds, []);
  assert.equal(wrong.segments.length, 1);
});

test('prism produces two colored perpendicular branches', () => {
  const level = basic({ prisms: [{ id: 'p', x: 0, z: 0 }], receivers: [{ id: 'b', x: 0, z: -5, color: 'blue' }, { id: 'r', x: 0, z: 5, color: 'rose' }] });
  const result = traceLight(level);
  assert.deepEqual(result.litReceiverIds, ['b', 'r']);
  assert.deepEqual(result.segments.map(s => s.color), ['gold', 'blue', 'rose']);
});

test('rays miss short mirror surfaces and stop at obstacles and wrong receivers', () => {
  const miss = basic({ mirrors: [{ id: 'm', x: 0, z: 2, angle: 90 }] });
  assert.deepEqual(traceLight(miss).hitMirrorIds, []);
  const blocker = basic({ obstacles: [{ id: 'o', x: 0, z: 0, radius: 1 }], receivers: [{ id: 'r', x: 5, z: 0, color: 'gold' }] });
  near(traceLight(blocker).segments[0].to.x, -1);
  assert.deepEqual(traceLight(blocker).litReceiverIds, []);
  const wrong = basic({ receivers: [{ id: 'r', x: 0, z: 0, color: 'blue' }] });
  assert.deepEqual(traceLight(wrong).litReceiverIds, []);
  assert.equal(traceLight(wrong).segments.length, 1);
});

test('closed mirror loops terminate deterministically', () => {
  const level = basic({ source: { x: 0, z: 0, dx: 1, dz: 0, color: 'gold' }, mirrors: [{ id: 'left', x: -2, z: 0, angle: 90 }, { id: 'right', x: 2, z: 0, angle: 90 }] });
  const result = traceLight(level);
  assert.equal(result.segments.length, 3);
  assert.deepEqual(result.hitMirrorIds, ['right', 'left']);
  assert.deepEqual(traceLight(level), result);
});
