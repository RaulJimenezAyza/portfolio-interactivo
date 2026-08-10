/* Measures a .glb without three and without a DOM.
 *
 * GLTFLoader was the obvious tool and cannot do this job here: any model with
 * an embedded texture sends it down an image path that wants `self` and
 * createImageBitmap, so it throws in node and works in a browser. Reading the
 * container directly sidesteps that — a GLB is a JSON chunk and a binary
 * chunk, and every accessor already carries the min and max of its data, so
 * the bounding box is in the file rather than something to compute.
 *
 *   npx tsx scripts/measure.mjs <file.glb>
 */
import { readFileSync } from "node:fs";

const buf = readFileSync(process.argv[2]);
if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error("not a GLB");
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString("utf8"));

const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
let prims = 0, tris = 0;
for (const mesh of gltf.meshes ?? []) {
  for (const p of mesh.primitives) {
    prims++;
    const a = gltf.accessors[p.attributes.POSITION];
    if (a?.min) for (let i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], a.min[i]); hi[i] = Math.max(hi[i], a.max[i]); }
    const count = p.indices != null ? gltf.accessors[p.indices].count : a.count;
    tris += count / 3;
  }
}
const r = n => Math.round(n * 100) / 100;
console.log(JSON.stringify({
  primitives: prims,
  tris: Math.round(tris),
  materials: (gltf.materials ?? []).length,
  textures: (gltf.textures ?? []).length,
  size: [r(hi[0] - lo[0]), r(hi[1] - lo[1]), r(hi[2] - lo[2])],
  minY: r(lo[1]),
  centreXZ: [r((lo[0] + hi[0]) / 2), r((lo[2] + hi[2]) / 2)],
  nodes: (gltf.nodes ?? []).map(n => n.name).filter(Boolean).slice(0, 4)
}));
