"use client";

import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import { Turntable } from "@/game/Turntable";
import { Model, modelSource } from "@/game/Model";
import { registerFallback } from "@/models/registry";
import { buildCatStatue } from "@/game/props/catStatue";

/* Scene code hands the registry its procedural builders once, at module load.
 * Everything the island is made of will arrive here the same way as it is
 * ported across. */
registerFallback("cat-statue", buildCatStatue);

export default function Page() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [4.2, 3.4, 5.4], fov: 50, near: .1, far: 400 }}
        gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.22 }}
        /* straight through to react-use-measure: no debounce and no scroll
           listeners, so the first ResizeObserver entry is acted on rather than
           queued behind a timer */
        resize={{ debounce: 0, scroll: false }}
        onCreated={s => { (window as unknown as Record<string, unknown>).__r3f = s; }}
      >
        <color attach="background" args={["#122a4e"]} />
        <fog attach="fog" args={["#2a3c58", 22, 90]} />

        {/* the golden-hour rig the single-file build uses, minus the pool */}
        <hemisphereLight args={["#7fa2dc", "#3d4632", 1]} />
        <directionalLight
          position={[9, 9.5, -16]}
          intensity={2.5}
          color="#ffc490"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0003}
          shadow-normalBias={0.04}
        />
        <directionalLight position={[-9, 5.5, 12]} intensity={.8} color="#8fb4ff" />

        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[14, 48]} />
          <meshStandardMaterial color="#6f6555" roughness={.9} />
        </mesh>

        <Model name="cat-statue" position={[0, 0, 0]} />

        <Turntable target={[0, 1.4, 0]} radius={6.4} height={3.4} speed={.18} />
      </Canvas>

      <div className="hud">
        <div><span className="k">cat-statue</span> · <b>{modelSource("cat-statue")}</b></div>
        <div>drop <b>cat-statue.glb</b> in public/models, rebuild, and this swaps</div>
      </div>
    </>
  );
}
