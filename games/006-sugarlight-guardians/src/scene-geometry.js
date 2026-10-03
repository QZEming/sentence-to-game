import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Bake only explicitly static, opaque meshes. Excluded subtrees keep their
// original hierarchy and references, so their animations remain independent.
export function mergeStaticMeshes(root, excludedRoots = new Set()) {
  root.updateWorldMatrix(true, true);
  const rootInverse = root.matrixWorld.clone().invert();
  const batches = new Map();
  let before = 0;
  function collect(object) {
    if (excludedRoots.has(object)) return;
    if (object.isMesh && !Array.isArray(object.material) && !object.material.transparent && object.visible) {
      const attributes = Object.keys(object.geometry.attributes).sort().join(',');
      const key = `${object.material.uuid}:${object.castShadow}:${object.receiveShadow}:${object.renderOrder}:${object.layers.mask}:${attributes}`;
      if (!batches.has(key)) batches.set(key, []);
      batches.get(key).push(object);
      before++;
    }
    for (const child of object.children) collect(child);
  }
  collect(root);
  let after = before;
  for (const meshes of batches.values()) {
    if (meshes.length < 2) continue;
    const geometries = meshes.map(mesh => {
      const geometry = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
      geometry.clearGroups();
      geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(rootInverse, mesh.matrixWorld));
      return geometry;
    });
    const geometry = mergeGeometries(geometries, false);
    geometries.forEach(item => item.dispose());
    if (!geometry) continue;
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    const first = meshes[0];
    const merged = new THREE.Mesh(geometry, first.material);
    merged.name = 'static-scenery-batch';
    merged.castShadow = first.castShadow;
    merged.receiveShadow = first.receiveShadow;
    merged.renderOrder = first.renderOrder;
    merged.layers.mask = first.layers.mask;
    merged.matrixAutoUpdate = false;
    meshes.forEach(mesh => mesh.removeFromParent());
    root.add(merged);
    after -= meshes.length - 1;
  }
  return { before, after };
}
