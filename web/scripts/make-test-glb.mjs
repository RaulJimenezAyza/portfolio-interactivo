/* Writes a deliberately unmistakable placeholder model, so a swap is obvious
 * on screen rather than something you have to squint at. Hand-built glTF:
 * pulling in an exporter to emit one pyramid would need a DOM in node. */
import { writeFileSync } from "node:fs";

const pos = new Float32Array([
  -1,0,-1,  1,0,-1,  1,0,1,   -1,0,-1,  1,0,1,  -1,0,1,        // base
  -1,0,-1,  1,0,-1,  0,3,0,    1,0,-1,  1,0,1,  0,3,0,
   1,0,1,  -1,0,1,   0,3,0,   -1,0,1,  -1,0,-1, 0,3,0
]);
const buf = Buffer.from(pos.buffer);
const min = [-1, 0, -1], max = [1, 3, 1];
const gltf = {
  asset: { version: "2.0", generator: "make-test-glb.mjs" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: "placeholder" }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0 }, material: 0 }] }],
  materials: [{ pbrMetallicRoughness: {
    baseColorFactor: [0.94, 0.28, 0.24, 1], metallicFactor: 0, roughnessFactor: 0.7 } }],
  accessors: [{ bufferView: 0, componentType: 5126, count: pos.length / 3,
                type: "VEC3", min, max }],
  bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: buf.length, target: 34962 }],
  buffers: [{ byteLength: buf.length,
              uri: "data:application/octet-stream;base64," + buf.toString("base64") }]
};
writeFileSync(process.argv[2], JSON.stringify(gltf));
console.log("wrote", process.argv[2]);
