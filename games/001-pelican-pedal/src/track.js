import * as THREE from "three";

export const ROAD_WIDTH = 14;
export const ROAD_HEIGHT = 0.65;
const points = Array.from({ length: 32 }, (_, i) => {
  const a = (i / 32) * Math.PI * 2;
  return new THREE.Vector3(
    Math.sin(a) * (116 + 8 * Math.sin(3 * a)),
    ROAD_HEIGHT,
    Math.cos(a) * (105 + 6 * Math.cos(2 * a)),
  );
});
export const trackCurve = new THREE.CatmullRomCurve3(
  points,
  true,
  "catmullrom",
  0.5,
);
trackCurve.arcLengthDivisions = 1600;
export const TRACK_LENGTH = trackCurve.getLength();

export function getTrackFrame(distance, lateral = 0) {
  const t =
    (((distance % TRACK_LENGTH) + TRACK_LENGTH) % TRACK_LENGTH) / TRACK_LENGTH;
  const position = trackCurve.getPointAt(t);
  const tangent = trackCurve.getTangentAt(t).normalize();
  const right = new THREE.Vector3(tangent.z, 0, -tangent.x);
  position.addScaledVector(right, lateral);
  return { position, tangent, right, yaw: Math.atan2(tangent.x, tangent.z) };
}
