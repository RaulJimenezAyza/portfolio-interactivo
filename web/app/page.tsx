"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SHELL_HTML } from "@/game/shell";
import { World } from "@/game/IslandWorld";
import "./game.css";

/* The island under Next and react-three-fiber.
 *
 * The shell has to be in the DOM before the world mounts: boot() reaches for
 * about fifty element ids and dies on the first null. It is injected as HTML
 * rather than converted to JSX because React neither owns nor re-renders it,
 * and hand-converting 125 lines of it is 125 chances to typo an id that only
 * fails at boot.
 *
 * The Canvas is only rendered once that markup exists, which is what the
 * `mounted` gate is for. #scene stays in the shell as the Canvas's home, so
 * the world's own canvas and R3F's are the same element.
 */
export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    document.body.dataset.lang = "es";
    /* ?standalone=1 boots the world on its own renderer, skipping the Canvas.
       Chrome suspends ResizeObserver and requestAnimationFrame in background
       tabs, and react-three-fiber needs both to mount — so under automation,
       where the tab is never foreground, the R3F path can never start and
       nothing about the world can be checked. This switch is how it gets
       tested at all; it is not a fallback and nothing selects it by accident. */
    const alone = new URLSearchParams(location.search).get("standalone") === "1";
    setStandalone(alone);
    if (alone) import("@/models/load").then(m => m.primeModels())
      .then(() => import("@/game/world.js"))
      .then(w => w.boot(null))
      .catch(err => console.error("[world] standalone boot failed", err));
    setMounted(true);
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: SHELL_HTML }} />
      {mounted && !standalone && (
        <div className="r3f-host">
          <Canvas
            dpr={[1, 2]}
            camera={{ fov: 60, near: 0.1, far: 2400, position: [0, 6, 20] }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            <World />
          </Canvas>
        </div>
      )}
    </>
  );
}
