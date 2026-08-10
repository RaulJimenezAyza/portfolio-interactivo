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

A few models have moving parts. The scene looks these up by name, so keep them
if you re-author the model:

| model | child | what happens to it |
|---|---|---|
| `ferris-wheel.glb` | `spin` | rotated about its local X |
| `ferris-wheel.glb` | `cab*` | counter-rotated so gondolas stay level |
| `carousel.glb` | `spin` | rotated about Y |
| `coaster-car.glb` | `rider` | hidden while you are the one in the seat |
| `lamp.glb` | `bulb` | given the emissive material and the point light |

## Budget

This runs at 60 fps with a few thousand draw calls and no LODs. A model with
100k triangles will not fail — it will just cost more than everything else on
the island put together. Aim for the low thousands, flat-shaded, no normal
maps.

## Current contents

Everything is procedural right now; this folder is empty apart from this file.
`npm run models` prints what it finds.
