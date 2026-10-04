import test from 'node:test';
import assert from 'node:assert/strict';
import { Controller, intersectsHazard, PLAYER_HEIGHT } from '../src/physics.js';

const DT = 1 / 120;
const platform = (x = 0, top = 0, z = 0, w = 12, d = 12, type = 'solid') => ({
  mesh: { position: { x, y: top - 0.5, z }, visible: true },
  w, h: 1, d, type,
});
const approximately = (actual, expected, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${actual} ≈ ${expected}`);

function character(platforms = [platform()]) {
  const events = [];
  const controller = new Controller(platforms, (event) => events.push(event));
  controller.reset({ x: 0, y: 0.01, z: 0 });
  controller.step(DT);
  return { controller, events };
}

function advance(controller, seconds, input = {}, lowGravity = false) {
  for (let frame = 0; frame < Math.ceil(seconds / DT); frame++) {
    controller.step(DT, input, lowGravity);
  }
}

test('first jump leaves the platform and a midair second jump restores upward speed', () => {
  const { controller, events } = character();
  assert.equal(controller.grounded, true);
  controller.jump();
  controller.step(DT);
  assert.equal(controller.grounded, false);
  assert.equal(controller.ground, null);
  assert.equal(controller.jumps, 1);
  assert.ok(controller.position.y > 0);
  assert.ok(controller.velocity.y > 10);
  assert.deepEqual(events, ['jump']);

  advance(controller, 0.3);
  const velocityBefore = controller.velocity.y;
  controller.jump();
  controller.step(DT);
  assert.equal(controller.jumps, 2);
  assert.ok(controller.velocity.y > velocityBefore + 5);
  assert.deepEqual(events, ['jump', 'doubleJump']);
});

test('a third airborne jump cannot add height or emit a jump event', () => {
  const { controller, events } = character();
  controller.jump();
  controller.step(DT);
  advance(controller, 0.12);
  controller.jump();
  controller.step(DT);
  advance(controller, 0.12);
  const before = controller.velocity.y;
  controller.jump();
  controller.step(DT);
  assert.equal(controller.jumps, 2);
  approximately(controller.velocity.y, before - 24 * DT);
  advance(controller, 0.15);
  assert.deepEqual(events, ['jump', 'doubleJump']);
});

test('landing snaps feet to the platform, resets jumps, and reports one impact', () => {
  const floor = platform(0, 1.5);
  const events = [];
  const controller = new Controller([floor], (event) => events.push(event));
  controller.reset({ x: 0, y: 5, z: 0 });
  controller.jumps = 2;
  advance(controller, 1);
  approximately(controller.position.y, 1.5);
  approximately(controller.velocity.y, 0);
  assert.equal(controller.grounded, true);
  assert.equal(controller.ground, floor);
  assert.equal(controller.jumps, 0);
  assert.deepEqual(events, ['land']);
  controller.jump();
  controller.step(DT);
  assert.equal(controller.jumps, 1);
  assert.deepEqual(events, ['land', 'jump']);
});

test('a standing player is carried by a platform on every axis without drift', () => {
  const floor = platform();
  const { controller } = character([floor]);
  floor.mesh.position.x += 0.18;
  floor.mesh.position.y += 0.12;
  floor.mesh.position.z -= 0.24;
  controller.step(DT);
  approximately(controller.position.x, 0.18);
  approximately(controller.position.y, 0.12);
  approximately(controller.position.z, -0.24);
  assert.equal(controller.grounded, true);
  advance(controller, 0.2);
  approximately(controller.position.x, 0.18);
  approximately(controller.position.y, 0.12);
  approximately(controller.position.z, -0.24);

  controller.jump();
  controller.step(DT);
  floor.mesh.position.x += 2;
  controller.step(DT);
  approximately(controller.position.x, 0.18);
  assert.equal(controller.ground, null);
});

test('a jump buffered just before landing triggers on the next grounded frame', () => {
  const { controller, events } = character();
  controller.reset({ x: 0, y: 0.08, z: 0 });
  controller.jumps = 2;
  controller.velocity.y = -8;
  controller.jump();
  controller.step(1 / 60);
  assert.equal(controller.grounded, true);
  assert.equal(controller.jumps, 0);
  controller.step(DT);
  assert.equal(controller.grounded, false);
  assert.equal(controller.jumps, 1);
  assert.ok(controller.velocity.y > 0);
  assert.deepEqual(events, ['land', 'jump']);
});

test('walking off an edge retains a brief first-jump grace period', () => {
  const { controller, events } = character([platform(0, 0, 0, 1, 1)]);
  controller.position.x = 0.9;
  controller.step(DT);
  assert.equal(controller.grounded, false);
  assert.ok(controller.coyote > 0);
  advance(controller, 0.05);
  controller.jump();
  controller.step(DT);
  assert.equal(controller.jumps, 1);
  assert.deepEqual(events, ['jump']);
});

test('laser collision uses robot height and width and excludes disabled beams', () => {
  const laser = { mesh: { position: { x: 0, y: 1, z: 0 }, visible: true }, w: 6, h: 0.2, d: 0.2, active: true };
  assert.equal(intersectsHazard({ x: 0, y: 0, z: 0 }, laser), true);
  assert.equal(intersectsHazard({ x: 3.2, y: 0, z: 0.2 }, laser), true);
  assert.equal(intersectsHazard({ x: 3.5, y: 0, z: 0 }, laser), false);
  assert.equal(intersectsHazard({ x: 0, y: 0, z: 0.5 }, laser), false);
  assert.equal(intersectsHazard({ x: 0, y: 1.11, z: 0 }, laser), false);
  assert.equal(intersectsHazard({ x: 0, y: 0.89 - PLAYER_HEIGHT, z: 0 }, laser), false);
  laser.active = false;
  assert.equal(intersectsHazard({ x: 0, y: 0, z: 0 }, laser), false);
  laser.active = true;
  laser.mesh.visible = false;
  assert.equal(intersectsHazard({ x: 0, y: 0, z: 0 }, laser), false);
});

test('dash locks its direction, expires, and cannot restart until cooldown clears', () => {
  const { controller, events } = character([platform(0, 0, 0, 200, 200)]);
  controller.facing = { x: 1, z: 0 };
  assert.equal(controller.dash(), true);
  assert.equal(controller.dash(), false);
  controller.step(DT, { x: -1 });
  approximately(controller.velocity.x, 23);
  approximately(controller.velocity.z, 0);
  assert.ok(controller.position.x > 0);
  advance(controller, 0.3);
  assert.equal(controller.dashRemaining, 0);
  assert.equal(controller.dash(), false);
  assert.ok(controller.velocity.x < 23);
  advance(controller, 0.8);
  assert.equal(controller.dashCooldown, 0);
  assert.equal(controller.dash(), true);
  assert.deepEqual(events.filter((event) => event === 'dash'), ['dash', 'dash']);
});

test('low gravity materially extends airtime and bounce pads launch the player', () => {
  const normal = character().controller;
  const low = character().controller;
  normal.jump();
  low.jump();
  advance(normal, 1.05);
  advance(low, 1.05, {}, true);
  assert.equal(normal.grounded, true);
  assert.equal(low.grounded, false);
  assert.ok(low.position.y > 2);

  const pad = platform(0, 0, 0, 5, 5, 'bounce');
  const { controller, events } = character([pad]);
  assert.equal(controller.grounded, false);
  assert.equal(controller.jumps, 1);
  assert.equal(controller.velocity.y, 15);
  assert.deepEqual(events, ['doubleJump']);
});
