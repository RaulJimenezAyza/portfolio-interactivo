# public/models

Drop a `.glb` in here, run `npm run build` (or `npm run dev`), and it replaces
the procedural version of that model everywhere it appears. Nothing else to
edit. Delete the file and the procedural one comes back.

The file name has to match the `file` field in `src/models/registry.ts`. That
file is also where you adjust `scale`, `yaw` and `offset` when an authored
model does not agree with the world, and where you pick how its collider is
derived.

## Conventions

Get these right and a swapped model lands correctly without touching code.

| | |
|---|---|
| **Units** | metres. The cat is ~1.4 m nose to tail; the plaza is 24 m across. |
| **Origin** | on the ground, at the footprint's centre — not at the model's own centre. A model centred on its bounding box sinks half of itself into the terrain. |
| **Facing** | +Z. Anything with a front (the cat, a stall, a stele's panel) faces +Z at yaw 0. |
| **Up** | +Y. |
| **Scale** | apply it in the DCC tool and export at 1.0. `scale` in the registry is a correction, not the place to do the work. |
| **Materials** | baked colour is fine; there is no environment map in this scene, so anything with `metalness` near 1 and no map renders black. Keep metals rough. |

## Named children

The scene does not assume where anything is. It asks the model, by name, and
derives everything else from the answer — a taller lamp takes its halo up with
it, a deeper fountain takes its ripples down. That only works if the names are
there.

Missing a name is never fatal. The part it drives stops moving and the rest of
the game carries on; a cat with no named tail walks, sits and jumps, it just
does not wag.

| model | child | what happens to it |
|---|---|---|
| `cat.glb` | `head` | idle tilt, and looks up when sitting |
| `cat.glb` | `earL`, `earR` | occasional twitch |
| `cat.glb` | `eyeL`, `eyeR` | squashed on Y to blink |
| `cat.glb` | `legFL`, `legFR`, `legBL`, `legBR` | pivots — the walk cycle rotates these about X, so put each origin at the shoulder or hip, not at the paw |
| `cat.glb` | `tail0` … `tail4` | chained, each parented to the one before; the wag runs down the chain |
| `fountain.glb` | `waterLow` | basin surface — ripples crawl over it and the falling sheets end here |
| `fountain.glb` | `waterHigh` | upper bowl surface — spouts, spray and the statue are placed off it |
| `ferris-wheel.glb` | `spin` | rotated about its local X |
| `ferris-wheel.glb` | `cab0` … `cabN` | children of `spin`, counter-rotated so the seats stay level |
| `carousel.glb` | `spin` | rotated about Y |
| `carousel.glb` | `mount0` … `mountN` | children of `spin`, bob up and down |
| `coaster-car.glb` | `rider` | hidden while you are the one in that seat |
| `stele.glb` | `panel` | the recessed face; the temple's colour bar and name plate are placed against it |
| `lamp.glb` | `bulb` | takes the emissive material, the glow sprite and the point light |

## Variants

One model answers for every instance. The coaster's lead car carries a nose
cone the other two do not, and the procedural builder takes an index to make
it; a file in the folder is one car and is used for all three. The train stops
having a distinct front. That is the price of making it swappable, not a bug.

## Budget

This runs at 60 fps with a few thousand draw calls and no LODs. A model with
100k triangles will not fail — it will just cost more than everything else on
the island put together. Aim for the low thousands, flat-shaded, no normal
maps.

## Compression

A `.glb` may arrive Draco compressed; the loader is set up for it and
`npm run models` copies three's decoder into `public/draco` so it can. That
folder is generated — do not commit it, and do not hand-place a decoder in it
that came from a different version of three than the one in `package.json`.

A compressed model with no decoder is the one failure here that is silent:
`GLTFLoader` rejects the parse, `loadModel` falls back, and you get the
procedural version with no missing file to go looking for. `npm run verify`
checks for the decoder whenever a file in this folder needs one.

## Current contents

The fairground and the conifer come from Kenney's kits; the obelisk, the lamp,
the palms and the loose rock come from ThreeJS Assets. Everything else is still
built in code — the cat, the statue, the fountain, the wheel, the carousel and
the crate, which has the owner's initials stencilled on it and is staying that
way. `npm run models` prints what it finds; `CREDITS.md` says where each file
came from.
