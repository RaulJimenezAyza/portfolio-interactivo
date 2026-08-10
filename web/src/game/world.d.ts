import type { WebGLRenderer, Scene, Camera } from "three";

/* world.js is plain JavaScript — 7,400 lines carried over from the
 * single-file build — so TypeScript infers its signatures from the defaults
 * it can see. `boot(ctx = null)` came out as taking null and nothing else.
 * This says what it really takes without touching the file itself. */

export interface WorldContext {
  gl: WebGLRenderer;
  scene: Scene;
  camera: Camera;
}

export interface WorldHandle {
  /** one step of simulation, control and animation */
  loop(): void;
  /** draws it, through the bloom and grade composer */
  renderFrame(): void;
  [key: string]: unknown;
}

/** Builds the island. Pass react-three-fiber's context to have it adopt that
 *  renderer, scene and camera and leave the frame schedule alone; pass
 *  nothing and it makes its own and drives itself. */
export function boot(ctx?: WorldContext | null): Promise<WorldHandle | undefined>;
