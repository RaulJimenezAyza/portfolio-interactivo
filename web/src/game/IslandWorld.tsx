"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import type { WorldHandle } from "@/game/world";

/** The island, mounted inside react-three-fiber's Canvas.
 *
 *  Named IslandWorld and not World because this is developed on Windows,
 *  where World.tsx and world.js are the same path — the import resolved to
 *  the scene module and reported that `World` was not exported from it.
 *
 *  R3F owns the renderer, the scene, the camera and the schedule; the world
 *  adopts all four instead of building its own. That is the whole of the
 *  integration — no part of the 7,400 lines became JSX, because none of it
 *  needed to. React is good at deciding *when* a thing exists and bad at
 *  describing a procedurally generated island, and this split gives each of
 *  them the job it is good at.
 *
 *  The frame callback takes priority 1, which switches R3F's automatic render
 *  off and hands rendering to us. It has to: the world draws through an
 *  EffectComposer for the bloom and the colour grade, and a second automatic
 *  render of the raw scene on top would undo both.
 */
export function World({ onReady }: { onReady?: (g: unknown) => void }) {
  const ctx = useThree(s => ({ gl: s.gl, scene: s.scene, camera: s.camera }));
  const game = useRef<WorldHandle | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      const { primeModels } = await import("@/models/load");
      const keys = await primeModels();
      if (keys.length) console.info(`[models] from the folder: ${keys.join(", ")}`);
      const world = await import("@/game/world.js");
      const g = await world.boot(ctx);
      if (!live || !g) return;
      game.current = g;
      onReady?.(g);
    })();
    return () => { live = false; };
    /* mounted once: re-running this would build a second island */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(() => {
    const g = game.current;
    if (!g) return;
    g.loop();
    g.renderFrame();
  }, 1);

  return null;
}
