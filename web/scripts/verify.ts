/* Headless checks on the scene code.
 *
 * Written because the browser this project is developed against runs in a
 * background tab, and Chrome suspends requestAnimationFrame, ResizeObserver
 * and IntersectionObserver there. React-three-fiber needs the observer to
 * mount and the animation frame to draw, so it can never start in that tab —
 * which looks exactly like a black canvas and is not one.
 *
 * Everything below builds real three.js objects and measures them. No DOM, no
 * WebGL, no render loop, so none of it cares whether a tab is visible. It is
 * the only verification available for geometry until someone looks at a real
 * window, and it catches the things that actually go wrong in this codebase:
 * a model that floats, one that is buried, one that faces backwards.
 *
 *   npm run verify
 */
import * as THREE from "three";
import { buildCatStatue } from "../src/game/props/catStatue";
import { MODELS } from "../src/models/registry";

let failures = 0;
function check(name: string, pass: boolean, detail = "") {
  if (!pass) failures++;
  console.log(`${pass ? "  ok  " : "FAIL  "}${name}${detail ? "  — " + detail : ""}`);
}
const round = (n: number) => Math.round(n * 100) / 100;

/* ---- the registry describes itself completely ---- */
for (const [key, spec] of Object.entries(MODELS)) {
  check(`registry/${key} names a file`, /\.(glb|gltf)$/i.test(spec.file), spec.file);
  check(`registry/${key} documents its convention`, !!spec.note && spec.note.length > 20);
  check(`registry/${key} has a fallback`, typeof spec.fallback === "function");
}

/* ---- the cat statue ----
   The folder's convention is metres, origin on the ground, facing +Z. A model
   that breaks any of those lands wrong in the world without erroring, so these
   are the checks worth having. */
{
  const g = buildCatStatue();
  const box = new THREE.Box3().setFromObject(g);
  const size = box.getSize(new THREE.Vector3());
  let meshes = 0;
  g.traverse(o => { if ((o as THREE.Mesh).isMesh) meshes++; });

  check("statue builds a populated group", meshes > 20, `${meshes} meshes`);
  check("statue sits on the ground", Math.abs(box.min.y) < 0.02, `min.y = ${round(box.min.y)}`);
  check("statue is about two and a half metres", size.y > 2.2 && size.y < 3.2, `${round(size.y)} m tall`);
  check("statue is not wider than it is tall", size.x < size.y, `${round(size.x)} m wide`);
  check("statue is centred on its plinth", Math.abs(box.getCenter(new THREE.Vector3()).x) < 0.1);

  /* Facing is asked of the face, not of the bounding box. The box is
     symmetric in Z because the plinth is 2.4 m across and swamps a 0.6 m
     muzzle — measuring the whole model to find which way it looks was a test
     that failed a correct statue. */
  const muzzle = g.getObjectByName("muzzle");
  const eyeL = g.getObjectByName("eyeL"), eyeR = g.getObjectByName("eyeR");
  check("statue names its face parts", !!muzzle && !!eyeL && !!eyeR);
  if (muzzle && eyeL && eyeR) {
    check("statue faces +Z", muzzle.position.z > 0.2, `muzzle at z = ${round(muzzle.position.z)}`);
    check("eyes sit behind the muzzle", eyeL.position.z < muzzle.position.z);
    check("eyes are a matched pair", Math.abs(eyeL.position.x + eyeR.position.x) < 1e-6
      && eyeL.position.y === eyeR.position.y);
  }

  /* animation travels with the model rather than with whatever mounts it */
  const tick = (g.userData as { tick?: (t: number) => void }).tick;
  check("statue carries its own tick", typeof tick === "function");
  if (tick) {
    tick(0); tick(1.7); tick(9.4);       // must not throw at any phase
    check("statue tick survives a blink cycle", true);
  }
}

console.log(failures ? `\n${failures} failing` : "\nall good");
process.exit(failures ? 1 : 0);
