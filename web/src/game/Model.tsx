"use client";

import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { loadModel, hasFile } from "@/models/load";

/** Mounts one registry model.
 *
 *  This is the whole bridge between react-three-fiber and the imperative scene
 *  code. R3F's <primitive> takes a THREE.Object3D and adopts it, so a model
 *  built by 130 lines of geometry calls and a model parsed out of a .glb are
 *  the same thing to React — which is why none of the scene had to be rewritten
 *  as JSX to get here.
 *
 *  If a model ships a userData.tick it gets driven every frame, so animation
 *  travels with the model instead of being reimplemented by whatever mounts it. */
export function Model({
  name,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}: {
  name: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const [obj, setObj] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    let live = true;
    loadModel(name).then(o => { if (live) setObj(o); });
    return () => { live = false; };
  }, [name]);

  useFrame(({ clock }) => {
    const tick = obj?.userData?.tick;
    if (tick) tick(clock.elapsedTime);
  });

  if (!obj) return null;
  return (
    <primitive object={obj} position={position} rotation={rotation} scale={scale} />
  );
}

/** Reports whether a key is being served from the folder or from code, so the
 *  page can say which one you are looking at. */
export const modelSource = (name: string) => (hasFile(name) ? "public/models" : "procedural");
