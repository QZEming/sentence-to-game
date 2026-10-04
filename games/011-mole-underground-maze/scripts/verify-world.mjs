#!/usr/bin/env node

import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createWorld, TILE } from '../src/world.js';

const key = ({ x, z }) => `${x},${z}`;
const plainPosition = ({ x, z }) => ({ x, z });
const expectedCounts = { crystal: 16, relic: 3, mushroom: 5 };

function blueprint(world) {
  return {
    grid: world.grid,
    spawn: plainPosition(world.spawn),
    camp: plainPosition(world.camp),
    exit: plainPosition(world.exit),
    collectibles: world.collectibles.map(({ id, type, x, z }) => ({ id, type, x, z })),
    enemies: world.enemies.map(({ id, x, z, phase }) => ({ id, x, z, phase })),
    wallPositions: [...world.wallMeshes.keys()],
  };
}

function reachableCells({ grid, spawn }) {
  const queue = [spawn];
  const visited = new Set([key(spawn)]);
  for (let i = 0; i < queue.length; i++) {
    const { x, z } = queue[i];
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const next = { x: x + dx, z: z + dz };
      if (grid[next.z]?.[next.x] === 0 && !visited.has(key(next))) {
        visited.add(key(next));
        queue.push(next);
      }
    }
  }
  return visited;
}

function verifyWorld(world, level) {
  const label = `level ${level}`;
  assert.equal(world.size, 25, `${label}: expected a 25 × 25 maze`);
  assert.equal(world.grid.length, world.size, `${label}: grid height`);
  world.grid.forEach((row) => {
    assert.equal(row.length, world.size, `${label}: grid width`);
    row.forEach((cell) => assert.ok([0, 1, 2].includes(cell), `${label}: known tile type`));
  });
  for (let i = 0; i < world.size; i++) {
    assert.equal(world.grid[0][i], 1, `${label}: north boundary`);
    assert.equal(world.grid[world.size - 1][i], 1, `${label}: south boundary`);
    assert.equal(world.grid[i][0], 1, `${label}: west boundary`);
    assert.equal(world.grid[i][world.size - 1], 1, `${label}: east boundary`);
  }

  const reachable = reachableCells(world);
  const floorCount = world.grid.flat().filter((cell) => cell === 0).length;
  assert.equal(reachable.size, floorCount, `${label}: every floor tile is reachable without digging`);
  for (const destination of [world.exit, world.camp, ...world.collectibles, ...world.enemies]) {
    assert.ok(reachable.has(key(destination)), `${label}: unreachable object at ${key(destination)}`);
  }
  assert.deepEqual(world.spawn, { x: 12, z: 14 }, `${label}: stable spawn`);
  for (let z = world.spawn.z - 1; z <= world.spawn.z + 1; z++) {
    for (let x = world.spawn.x - 1; x <= world.spawn.x + 1; x++) {
      assert.equal(world.grid[z][x], 0, `${label}: spawn has a clear 3 × 3 area`);
    }
  }

  const counts = world.collectibles.reduce((result, item) => {
    result[item.type] = (result[item.type] || 0) + 1;
    assert.equal(item.collected, false, `${label}: pickups begin uncollected`);
    assert.equal(item.mesh.position.x, item.x * TILE, `${label}: pickup world X`);
    assert.equal(item.mesh.position.z, item.z * TILE, `${label}: pickup world Z`);
    return result;
  }, {});
  assert.deepEqual(counts, expectedCounts, `${label}: collectible counts`);
  assert.equal(world.enemies.length, 4, `${label}: beetle count`);
  const occupied = [world.spawn, world.camp, world.exit, ...world.collectibles, ...world.enemies];
  assert.equal(new Set(occupied.map(key)).size, occupied.length, `${label}: unique occupied cells`);
  assert.equal(new Set(world.collectibles.map(({ id }) => id)).size, world.collectibles.length, `${label}: unique pickup IDs`);
  assert.ok(world.collectibles.some((item) => item.type === 'crystal' && Math.hypot(item.x - world.spawn.x, item.z - world.spawn.z) <= 2), `${label}: a crystal is close to spawn`);
  for (const enemy of world.enemies) {
    assert.ok(Math.hypot(enemy.x - world.spawn.x, enemy.z - world.spawn.z) >= 9, `${label}: enemies begin safely away from spawn`);
    assert.deepEqual(enemy.home, plainPosition(enemy), `${label}: enemy home`);
  }
  assert.equal(world.wallMeshes.size, world.size ** 2 - floorCount, `${label}: walls match collision grid`);
  for (const [coordinate, wall] of world.wallMeshes) {
    const [x, z] = coordinate.split(',').map(Number);
    assert.ok(world.grid[z][x] > 0, `${label}: solid wall cell`);
    assert.equal(wall.userData.diggable, world.grid[z][x] === 2, `${label}: correct digging flag`);
  }
  let lightCount = 0;
  world.root.traverse((object) => {
    if (object.isLight) lightCount++;
    assert.ok([...object.position, ...object.scale, ...object.quaternion].every(Number.isFinite), `${label}: finite scene transforms`);
  });
  assert.ok(lightCount <= 8, `${label}: light budget`);
}

function verifyDisposal(world, scene, level) {
  const resources = new Set();
  let instanceCount = 0;
  world.root.traverse((object) => {
    if (object.isInstancedMesh) { resources.add(object); instanceCount++; }
    if (object.geometry) resources.add(object.geometry);
    for (const material of (Array.isArray(object.material) ? object.material : [object.material])) {
      if (material) resources.add(material);
    }
  });
  assert.ok(instanceCount > 0, `level ${level}: test covers instance buffers`);
  const disposeCounts = new Map([...resources].map((resource) => [resource, 0]));
  for (const resource of resources) {
    resource.addEventListener('dispose', () => disposeCounts.set(resource, disposeCounts.get(resource) + 1));
  }
  world.dispose();
  assert.equal(world.root.parent, null, `level ${level}: disposed root has no parent`);
  assert.ok(!scene.children.includes(world.root), `level ${level}: disposed world leaves the scene`);
  world.dispose();
  for (const count of disposeCounts.values()) assert.equal(count, 1, `level ${level}: resources dispose exactly once`);
}

for (let level = 1; level <= 20; level++) {
  const scene = new THREE.Scene();
  const world = createWorld(scene, level);
  verifyWorld(world, level);
  const expected = blueprint(world);
  verifyDisposal(world, scene, level);
  const repeated = createWorld(scene, level);
  assert.deepEqual(blueprint(repeated), expected, `level ${level}: deterministic generation`);
  repeated.dispose();
  assert.equal(scene.children.length, 0, `level ${level}: no scene roots left after disposal`);
}

console.log('World verification passed for 20 seeds: solid boundaries, connected paths and pickups, unique placement, exact counts, safe spawn, deterministic generation, and complete idempotent disposal.');
