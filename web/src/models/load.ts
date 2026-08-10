import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MODELS, type ModelSpec } from "./registry";
import { MODEL_FILES } from "./manifest.generated";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const loader = new GLTFLoader();
const cache = new Map<string, Promise<THREE.Object3D>>();

/** Bounding box of an object after its own transforms, used to size a
 *  collider that matches whatever shape actually arrived. */
export function measure(obj: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  const centre = box.getCenter(new THREE.Vector3());
  return { size, centre, box };
}

function applyTransform(obj: THREE.Object3D, spec: ModelSpec) {
  /* Wrapped rather than transformed in place: the caller positions what it
     gets back, and if it also carried the model's own correction the two
     would fight every time you nudged the scale. */
  const wrap = new THREE.Group();
  if (spec.scale && spec.scale !== 1) obj.scale.setScalar(spec.scale);
  if (spec.yaw) obj.rotation.y = spec.yaw;
  if (spec.offset) obj.position.set(...spec.offset);
  obj.traverse(o => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    m.castShadow = true;
    m.receiveShadow = true;
  });
  wrap.add(obj);
  return wrap;
}

/** The file in the folder that answers for this key, or null.
 *
 *  Matched on the base name, not the exact spelling in the registry: .glb and
 *  .gltf are the same model in two containers, and whichever your exporter
 *  happens to produce should just work. Making you rename the file — or edit
 *  the registry — to satisfy an extension would defeat the point of the
 *  folder. */
export function resolveFile(key: string): string | null {
  const spec = MODELS[key];
  if (!spec) return null;
  const stem = spec.file.replace(/\.(glb|gltf)$/i, "").toLowerCase();
  return MODEL_FILES.find(f => f.replace(/\.(glb|gltf)$/i, "").toLowerCase() === stem) ?? null;
}

/** True when the folder actually holds a file for this key. The scene can ask
 *  before deciding whether its hand-written collider still applies. */
export function hasFile(key: string) {
  return resolveFile(key) !== null;
}

/** The one call the scene makes. Returns the model from public/models when it
 *  is there, and the procedural build when it is not — same key, same
 *  contract, so nothing upstream has to know which it got. */
export async function loadModel(key: string): Promise<THREE.Object3D> {
  const spec = MODELS[key];
  if (!spec) throw new Error(`loadModel: unknown model "${key}"`);
  const file = resolveFile(key);
  if (!file) return spec.fallback();

  let job = cache.get(key);
  if (!job) {
    job = loader
      .loadAsync(`${BASE}/models/${file}`)
      .then(g => applyTransform(g.scene, spec))
      .catch(err => {
        /* A file that is present but will not parse is a broken asset, not a
           reason to lose the world: say so and fall back. */
        console.warn(`[models] ${file} failed to load, using the procedural ${key}`, err);
        return spec.fallback();
      });
    cache.set(key, job);
  }
  /* clone, so two callers asking for the same key do not share one instance */
  const proto = await job;
  return proto.clone(true);
}

/** Preloads everything the folder holds, so the first frame is not a pop-in. */
export async function preloadModels() {
  await Promise.all(Object.keys(MODELS).filter(hasFile).map(loadModel));
}
