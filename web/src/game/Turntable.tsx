"use client";

import { useFrame } from "@react-three/fiber";

/** Slow orbit around a point.
 *
 *  Six lines instead of drei's OrbitControls, because drei pulls in
 *  three-mesh-bvh, and the version it resolves to is not compatible with this
 *  three — importing it takes the whole page chunk down before React mounts,
 *  which shows up as a canvas that exists and never renders. This preview does
 *  not need mouse orbit; when the real game lands it brings its own camera rig
 *  anyway. */
export function Turntable({
  target = [0, 0, 0],
  radius = 6,
  height = 3,
  speed = .2
}: {
  target?: [number, number, number];
  radius?: number;
  height?: number;
  speed?: number;
}) {
  useFrame(({ camera, clock }) => {
    const a = clock.elapsedTime * speed;
    camera.position.set(target[0] + Math.sin(a) * radius, target[1] + height, target[2] + Math.cos(a) * radius);
    camera.lookAt(target[0], target[1], target[2]);
  });
  return null;
}
