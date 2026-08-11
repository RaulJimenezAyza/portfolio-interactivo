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
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCatStatue } from "../src/game/props/catStatue";
import { MODELS } from "../src/models/registry";

const here = dirname(fileURLToPath(import.meta.url));

/* ---- just enough of the glTF container to measure a model ----
   A .glb is a 12-byte header and then length-prefixed chunks; the first is
   the JSON that describes the scene. Reading it is twenty lines and needs no
   decoder, which is the whole reason this is here rather than a GLTFLoader. */
type Gltf = {
  scene?: number;
  scenes?: { nodes?: number[] }[];
  nodes: { name?: string; mesh?: number; children?: number[]; translation?: number[]; scale?: number[] }[];
  meshes?: { primitives: { attributes?: Record<string, number> }[] }[];
  accessors?: { min?: number[]; max?: number[] }[];
  extensionsRequired?: string[];
};

function glbJson(path: string): Gltf {
  const buf = readFileSync(path);
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error(`${path} is not a .glb`);
  let off = 12;
  while (off < buf.length) {
    const len = buf.readUInt32LE(off), type = buf.readUInt32LE(off + 4);
    if (type === 0x4e4f534a) return JSON.parse(buf.subarray(off + 8, off + 8 + len).toString("utf8"));
    off += 8 + len;
  }
  throw new Error(`${path} has no JSON chunk`);
}

/** World bounds, walking the node tree. Translation and scale only: nothing in
 *  the folder arrives rotated, and a rotated box would have to be measured by
 *  its corners rather than its extents. */
function glbBox(g: Gltf) {
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  let seen = false;
  const meshBounds = (m: number) => {
    const b = { lo: [Infinity, Infinity, Infinity], hi: [-Infinity, -Infinity, -Infinity] };
    for (const p of g.meshes?.[m]?.primitives ?? []) {
      const a = g.accessors?.[p.attributes?.POSITION ?? -1];
      if (!a?.min || !a?.max) return null;
      for (let i = 0; i < 3; i++) { b.lo[i] = Math.min(b.lo[i], a.min[i]); b.hi[i] = Math.max(b.hi[i], a.max[i]); }
    }
    return b;
  };
  const walk = (idx: number, t: number[], s: number[]) => {
    const n = g.nodes[idx];
    const ns = (n.scale ?? [1, 1, 1]).map((v, i) => v * s[i]);
    const nt = (n.translation ?? [0, 0, 0]).map((v, i) => v * s[i] + t[i]);
    if (n.mesh != null) {
      const b = meshBounds(n.mesh);
      if (b) {
        seen = true;
        for (let i = 0; i < 3; i++) {
          const a = b.lo[i] * ns[i] + nt[i], c = b.hi[i] * ns[i] + nt[i];
          lo[i] = Math.min(lo[i], a, c); hi[i] = Math.max(hi[i], a, c);
        }
      }
    }
    for (const c of n.children ?? []) walk(c, nt, ns);
  };
  for (const root of g.scenes?.[g.scene ?? 0]?.nodes ?? []) walk(root, [0, 0, 0], [1, 1, 1]);
  return seen ? { lo, hi, size: hi.map((v, i) => v - lo[i]) } : null;
}

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

/* ---- the files in the folder, against what the registry says about them ----
 *
 * Read straight out of the .glb rather than loaded: half of them are Draco
 * compressed, and the decoder wants a Worker, which does not exist here. It
 * does not need decoding anyway — glTF requires min/max on the POSITION
 * accessor, so the bounding box is in the JSON chunk whether or not the
 * vertices are readable. That is enough to catch the two things that go wrong
 * with a dropped-in model: it is the wrong size, or its origin is in the
 * middle of it and half the model is underground.
 *
 * Every model on threejsassets is centred on its own box, which is why the
 * registry entries carry an offset. This is the check that says so. */
{
  const dir = join(here, "..", "public", "models");
  const centred = new Set(["crate"]);   // driven by a cannon body, which is centred too
  /* laid by the track frame rather than by the ground: the rail is the origin
     and the steelwork hangs below it, which is what makes a loop possible */
  const airborne = new Set(["coaster-track"]);

  for (const [key, spec] of Object.entries(MODELS)) {
    const path = join(dir, spec.file);
    if (!existsSync(path)) continue;    // procedural, and that is a complete world

    const g = glbJson(path);
    const box = glbBox(g);
    if (!box) { check(`model/${key} declares its bounds`, false, "no POSITION min/max"); continue; }

    const s = spec.scale ?? 1;
    const off = spec.offset ?? [0, 0, 0];
    const lo = box.lo.map((v, i) => v * s + off[i]);
    const size = box.size.map(v => v * s);
    const dims = size.map(round).join(" x ");

    check(`model/${key} is a sane size`, size.every(v => v > .1 && v < 40), `${dims} m`);
    if (centred.has(key))
      check(`model/${key} is centred, as its note says`, Math.abs(lo[1] + size[1] / 2) < .06,
        `min.y = ${round(lo[1])}`);
    else if (!airborne.has(key))
      check(`model/${key} stands on the ground`, Math.abs(lo[1]) < .12, `min.y = ${round(lo[1])} of ${dims}`);

    /* A compressed model with no decoder to hand does not fail loudly — the
       loader rejects the parse, the scene falls back, and the world looks
       right minus one model. Checked here so CI says it instead. */
    if ((g.extensionsRequired ?? []).includes("KHR_draco_mesh_compression")) {
      const decoder = existsSync(join(here, "..", "public", "draco", "draco_decoder.wasm"));
      check(`model/${key} has a decoder to load with`, decoder, decoder ? "" : "run `npm run models`");
    }
  }
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
