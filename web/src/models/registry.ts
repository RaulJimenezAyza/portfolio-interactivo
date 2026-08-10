import * as THREE from "three";

/** How a model is expected to arrive from the folder.
 *
 *  `file` is a name inside `public/models/`. If it is there, it wins. If it is
 *  not, `fallback` runs and builds the same thing out of primitives — which is
 *  how every model in this project was made before there was a folder to put
 *  them in. So an empty folder is a complete game, and each .glb you drop in
 *  replaces exactly one thing with no code change anywhere. */
export interface ModelSpec {
  /** file name inside public/models — the only thing you change to swap a model */
  file: string;
  /** Built from primitives when the file is absent. The argument is a variant
   *  index for the handful of models that come in more than one flavour —
   *  the coaster's lead car carries a nose cone the others do not. A file in
   *  the folder is one model and answers for every variant, which is the
   *  trade for making it swappable at all. */
  fallback: (variant?: number) => THREE.Object3D;
  /** metres, applied to whatever comes out of the file. Authored models rarely
   *  agree with the world's scale on the first try; this is the knob. */
  scale?: number;
  /** radians, applied after scale, for models authored facing the wrong way */
  yaw?: number;
  /** shifted after scale and yaw, for models whose origin is not where the
   *  convention says it should be */
  offset?: [number, number, number];
  /** how the collider is derived when a file is used. 'box' and 'cylinder'
   *  measure the loaded geometry, so a swapped model gets a collider that
   *  matches its actual shape instead of the old one's. 'none' leaves the
   *  hand-written collider in the scene code alone. */
  collider?: "box" | "cylinder" | "none";
  /** one line, so the folder's README can be generated from this */
  note?: string;
}

/** Every swappable model in the world, keyed by the name the scene asks for.
 *
 *  Fallbacks are attached by the scene code at start-up rather than imported
 *  here: the procedural builders need the game's material helpers, its canvas
 *  textures and its wind shader, and dragging all of that into the registry
 *  would make this file depend on the entire scene. registerFallback() keeps
 *  the arrow pointing the other way. */
export const MODELS: Record<string, ModelSpec> = {
  cat: {
    file: "cat.glb",
    scale: 1,
    yaw: 0,
    collider: "none",
    note: "The player. Origin between the front paws, facing +Z, about 1.4m nose to tail.",
    fallback: () => new THREE.Group()
  },
  "cat-statue": {
    file: "cat-statue.glb",
    scale: 1,
    collider: "cylinder",
    note: "The deity on the plaza fountain. Origin at the base of the plinth, facing +Z, about 2.6m tall.",
    fallback: () => new THREE.Group()
  },
  fountain: {
    file: "fountain.glb",
    scale: 1,
    collider: "cylinder",
    note: "Plaza fountain, statue excluded. Origin on the paving, 7.8m across.",
    fallback: () => new THREE.Group()
  },
  stele: {
    file: "stele.glb",
    scale: 1,
    collider: "cylinder",
    note: "One temple marker. Origin at the ground, face (the panel side) toward +Z, 2.8m tall.",
    fallback: () => new THREE.Group()
  },
  "ferris-wheel": {
    file: "ferris-wheel.glb",
    scale: 1,
    collider: "cylinder",
    note: "Park wheel. Origin at ground centre, wheel plane facing +X, 28m across. Any child named 'spin' is rotated; children named 'cab*' are kept level.",
    fallback: () => new THREE.Group()
  },
  carousel: {
    file: "carousel.glb",
    scale: 1,
    collider: "cylinder",
    note: "Park carousel. Origin at ground centre, 15.6m across. A child named 'spin' turns.",
    fallback: () => new THREE.Group()
  },
  "coaster-car": {
    file: "coaster-car.glb",
    /* Kenney's coaster-train is 0.7m across and the rails are 1.1m apart */
    scale: 1.28,
    collider: "none",
    note: "One car of the train. Origin at the axle line, nose toward +Z, 1.5m long. A child named 'rider' is hidden while you are riding.",
    fallback: () => new THREE.Group()
  },
  pine: {
    file: "pine.glb",
    /* Kenney's Nature Kit conifer (CC0) is authored at 1.43 m; the procedural
       one it replaces stands 7.7 m from roots to tip, and the scene scales
       each tree by 0.7–1.5 on top of whatever arrives here. */
    scale: 5.4,
    /* and it sits 5 cm below its own origin, which at this scale is 27 cm of
       trunk buried in the hill */
    offset: [0, 0.27, 0],
    collider: "cylinder",
    note: "Conifer. Origin at the roots, about 7.7m tall once scaled.",
    fallback: () => new THREE.Group()
  },
  crate: {
    file: "crate.glb", scale: 1, collider: "box",
    note: "Pushable crate. Origin at its centre, 1.3m cube.",
    fallback: () => new THREE.Group()
  },
  lamp: {
    file: "lamp.glb", scale: 1, collider: "none",
    note: "Plaza lamp post. Origin at the ground, 3.9m tall. A child named 'bulb' gets the emissive material and the light.",
    fallback: () => new THREE.Group()
  },

  /* ---- the fairground, from Kenney's Coaster Kit (CC0) ----
     One kit, so they agree with each other; measured rather than guessed.
     Every one of them already lands on y=0 and is centred on XZ, which is the
     folder's convention met without a correction. Only the scale needed
     setting: the kit is authored small, around 1.5m for a stall. */
  "coaster-car-front": {
    file: "coaster-car-front.glb", scale: 1.28, collider: "none",
    note: "Lead car of the train, nose toward +Z. Origin on the axle line, 1.5m long before scale.",
    fallback: () => new THREE.Group()
  },
  "coaster-track": {
    file: "coaster-track.glb", scale: 1, collider: "none",
    note: "Four metres of rail, origin at one end running toward +Z. Laid repeatedly along the circuit and oriented by the track frame.",
    fallback: () => new THREE.Group()
  },
  "coaster-support": {
    file: "coaster-support.glb", scale: 1, collider: "none",
    note: "One metre of column, origin at its foot. Stacked from the ground to the rail.",
    fallback: () => new THREE.Group()
  },
  "park-queue": {
    file: "park-queue.glb", scale: 1, collider: "none",
    note: "One metre of queue railing, running along X. Origin on the ground.",
    fallback: () => new THREE.Group()
  },
  "park-path": {
    file: "park-path.glb", scale: 1, collider: "none",
    note: "One metre of paving, flat, origin on the ground.",
    fallback: () => new THREE.Group()
  },
  "park-gate": {
    file: "park-gate.glb", scale: 2.3, collider: "none",
    note: "Arch at the end of the boardwalk. Origin on the deck, facing +Z, 2.43m tall before scale.",
    fallback: () => new THREE.Group()
  },
  "stall-food": {
    file: "stall-food.glb", scale: 1.75, collider: "box",
    note: "Midway kiosk. Origin on the ground, counter facing +Z, 1.54m tall before scale.",
    fallback: () => new THREE.Group()
  },
  "stall-drinks": {
    file: "stall-drinks.glb", scale: 1.75, collider: "box",
    note: "Drinks kiosk. Origin on the ground, front facing +Z, about 1.5m tall before scale.",
    fallback: () => new THREE.Group()
  },
  "stall-information": {
    file: "stall-information.glb", scale: 1.75, collider: "box",
    note: "Information kiosk. Origin on the ground, front facing +Z, about 1.5m tall before scale.",
    fallback: () => new THREE.Group()
  },
  "stall-toilets": {
    file: "stall-toilets.glb", scale: 1.75, collider: "box",
    note: "Toilet block. Origin on the ground, front facing +Z, about 1.5m tall before scale.",
    fallback: () => new THREE.Group()
  },
  "park-bench": {
    file: "park-bench.glb", scale: 1.8, collider: "none",
    note: "Midway seat. Origin on the ground, seat facing +Z, 0.49m tall before scale.",
    fallback: () => new THREE.Group()
  },
  "park-bin": {
    file: "park-bin.glb", scale: 2, collider: "none",
    note: "Litter bin. Origin on the ground, 0.44m tall before scale.",
    fallback: () => new THREE.Group()
  },
  "park-flowers": {
    file: "park-flowers.glb", scale: 1.8, collider: "none",
    note: "Flower bed. Origin on the ground, flat. 0.78m across before scale.",
    fallback: () => new THREE.Group()
  }
};


/** Scene code calls this at start-up to hand the registry its procedural
 *  builder for a key. Kept out of the ModelSpec literals above so the registry
 *  does not have to import the world it describes. */
export function registerFallback(key: string, build: () => THREE.Object3D) {
  const spec = MODELS[key];
  if (!spec) throw new Error(`registerFallback: no model registered under "${key}"`);
  spec.fallback = build;
}
