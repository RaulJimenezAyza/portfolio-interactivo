import { readFileSync } from "node:fs";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const buf = readFileSync(process.argv[2]);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
new GLTFLoader().parse(ab, "", g => {
  const box = new THREE.Box3().setFromObject(g.scene);
  const s = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  let meshes = 0, tris = 0, mats = new Set();
  g.scene.traverse(o => { if (!o.isMesh) return; meshes++; mats.add(o.material.name || o.material.uuid);
    tris += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; });
  const r = n => Math.round(n * 100) / 100;
  console.log(JSON.stringify({ meshes, tris, materials: mats.size,
    size: [r(s.x), r(s.y), r(s.z)], minY: r(box.min.y),
    centreXZ: [r(c.x), r(c.z)], names: g.scene.children.map(c => c.name).slice(0, 6) }, null, 1));
}, e => { console.error("parse failed", e); process.exit(1); });
