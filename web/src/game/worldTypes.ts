import type { WebGLRenderer, Scene, Camera } from "three";

/* The shapes world.js trades in.
 *
 * This was world.d.ts, sitting next to world.js — which meant TypeScript read
 * the declaration and never looked at the eight thousand lines it was
 * describing. Renamed so the source is the source: boot()'s signature is now
 * JSDoc on the function itself, and these two interfaces are the only part
 * that a .ts file needs to name. */

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
}
