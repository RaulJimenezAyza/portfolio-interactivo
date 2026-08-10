"use client";

import { Canvas } from "@react-three/fiber";

/* Deliberately the smallest Canvas that can exist: no gl props, no shadows,
 * no camera override, no children of ours. If this one renders, the fault is
 * in what the real page adds; if it does not, the fault is the Canvas itself.
 * Delete once the black-canvas hunt is over. */
export default function Bare() {
  return (
    <Canvas onCreated={s => { (window as unknown as Record<string, unknown>).__bare = s; }}>
      <mesh>
        <boxGeometry />
        <meshBasicMaterial color="hotpink" />
      </mesh>
    </Canvas>
  );
}
