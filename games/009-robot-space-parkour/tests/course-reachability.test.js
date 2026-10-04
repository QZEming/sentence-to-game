import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createWorld } from '../src/world.js';
import { Controller, intersectsHazard } from '../src/physics.js';

const DT = 1 / 120;

function createHeadlessWorld() {
  const originalDocument = globalThis.document;
  // Only decorative signs need Canvas. Geometry, platform movement, and physics
  // remain the real production implementations in this headless simulation.
  globalThis.document = {
    createElement: () => ({
      getContext: () => ({ fillRect() {}, strokeRect() {}, fillText() {} }),
    }),
  };
  try {
    return createWorld(THREE, new THREE.Scene());
  } finally {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }
}

test('every adjacent course platform is reachable at four moving-platform phases', () => {
  const world = createHeadlessWorld();
  const mainRoute = world.platforms.filter((platform) => platform.type !== 'bounce');
  const failures = [];
  assert.ok(mainRoute.length >= 2, 'the course must contain connected platforms');

  for (const phase of [0, 2.5, 5, 7.5]) {
    for (let index = 0; index < mainRoute.length - 1; index++) {
      world.update(phase, 0);
      const source = mainRoute[index];
      const destination = mainRoute[index + 1];
      const controller = new Controller(world.platforms);
      const takeoffX = THREE.MathUtils.clamp(destination.mesh.position.x,
        source.mesh.position.x - source.w / 2 + 0.7,
        source.mesh.position.x + source.w / 2 - 0.7);
      controller.reset({
        x: takeoffX,
        y: source.mesh.position.y + source.h / 2 + 0.001,
        z: source.mesh.position.z - source.d / 2 + 0.7,
      });
      controller.step(DT);
      assert.equal(controller.ground, source, `takeoff ${index} is on the source platform`);
      // A normal sprint run-up, one jump, and steering toward the landing deck.
      // This tests geometry feasibility; hazard timing is tested separately.
      controller.velocity.z = -11;
      controller.jump();
      let landed = false;
      for (let frame = 0; frame < 360; frame++) {
        world.update(phase + frame * DT, DT);
        const dx = destination.mesh.position.x - controller.position.x;
        const dz = destination.mesh.position.z - controller.position.z;
        const distance = Math.max(1, Math.hypot(dx, dz));
        controller.step(DT, { x: dx / distance, z: dz / distance, sprint: true }, controller.position.z < -143);
        if (controller.ground === destination) {
          landed = true;
          break;
        }
        if (controller.position.y < -10) break;
      }
      if (!landed) failures.push(`platform ${index} → ${index + 1}, start time ${phase}s`);
    }
  }
  assert.deepEqual(failures, [], 'all course links must allow a controlled landing');
});

test('the optional bounce route is reachable from checkpoint 2 and returns safely to main platform 13', () => {
  const world = createHeadlessWorld();
  const mainRoute = world.platforms.filter((platform) => platform.type !== 'bounce');
  const source = mainRoute[11];
  const destination = mainRoute[13];
  const pad = world.platforms.find((platform) => platform.type === 'bounce');
  const checkpoint = world.checkpoints.find((entry) => entry.index === 2);
  assert.ok(pad, 'the optional route must contain a bounce platform');
  assert.ok(checkpoint, 'checkpoint 2 must exist');

  for (const phase of [0, 2.5, 5, 7.5]) {
    world.update(phase, 0);
    const events = [];
    const controller = new Controller(world.platforms, (event) => events.push(event));
    controller.reset(checkpoint.spawn);
    let stage = 'runup';
    let landed = false;
    let reachedPad = false;
    let peakAfterBounce = -Infinity;
    let hazardContacts = 0;
    for (let frame = 0; frame < 1200; frame++) {
      world.update(phase + frame * DT, DT);
      // Start at the actual checkpoint, run toward the right-hand corner, then
      // steer onto the pad and back to the safe near half of the main deck.
      const target = stage === 'runup'
        ? { x: source.mesh.position.x + source.w / 2 - 1.2, z: source.mesh.position.z - source.d / 2 + 1.5 }
        : stage === 'pad' ? pad.mesh.position
          : { x: destination.mesh.position.x, z: destination.mesh.position.z + 2.5 };
      const dx = target.x - controller.position.x;
      const dz = target.z - controller.position.z;
      const distance = Math.hypot(dx, dz);
      if (stage === 'runup' && distance < 0.7 && controller.grounded) {
        assert.equal(controller.ground, source, 'the run-up remains on checkpoint platform 11');
        controller.jump();
        stage = 'pad';
      }
      controller.step(DT, {
        x: dx / Math.max(1, distance), z: dz / Math.max(1, distance), sprint: true,
      }, controller.position.z < -143);
      if (world.hazards.some((hazard) => intersectsHazard(controller.position, hazard))) hazardContacts++;
      if (stage === 'pad' && Math.abs(controller.position.y - pad.top) < 1e-6 && controller.velocity.y === 15) {
        reachedPad = true;
        stage = 'return';
      }
      if (stage === 'return') peakAfterBounce = Math.max(peakAfterBounce, controller.position.y);
      if (stage === 'return' && controller.ground === destination) {
        landed = true;
        break;
      }
      if (controller.position.y < -15) break;
    }
    assert.equal(reachedPad, true, `checkpoint 2 must reach the optional pad at phase ${phase}`);
    assert.equal(landed, true, `the bounce must return to main platform 13 at phase ${phase}`);
    assert.ok(peakAfterBounce > pad.top + 8, 'the bounce gives a substantial low-gravity launch');
    assert.equal(hazardContacts, 0, 'the optional route permits a landing clear of the active laser');
    assert.deepEqual(events.filter((event) => event === 'jump' || event === 'doubleJump'), ['jump', 'doubleJump']);
  }
});
