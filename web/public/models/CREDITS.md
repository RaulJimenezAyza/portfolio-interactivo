# Where the models came from

Everything not listed here is built in code by `src/game/world.js` and is the
project's own.

| file | source | licence |
|---|---|---|
| `pine.glb` | `tree_cone` from [Kenney's Nature Kit](https://kenney.nl/assets/nature-kit) | [CC0 1.0](http://creativecommons.org/publicdomain/zero/1.0/) |
| `park-gate.glb` | `park-entrance` from [Kenney's Coaster Kit](https://kenney.nl/assets/coaster-kit) | [CC0 1.0](http://creativecommons.org/publicdomain/zero/1.0/) |
| `stall-food.glb`, `stall-drinks.glb`, `stall-information.glb`, `stall-toilets.glb` | Coaster Kit | CC0 1.0 |
| `park-bench.glb`, `park-bin.glb`, `park-flowers.glb` | Coaster Kit (`bench`, `trash`, `flowers`) | CC0 1.0 |
| `coaster-car.glb`, `coaster-car-front.glb` | Coaster Kit (`coaster-train`, `coaster-train-front`) | CC0 1.0 |
| `coaster-track.glb` | Coaster Kit (`coaster-steel-straight`) | CC0 1.0 |
| `coaster-support.glb` | Coaster Kit (`support-small`) | CC0 1.0 |
| `park-queue.glb`, `park-path.glb` | Coaster Kit (`queue-straight`, `path-straight`) | CC0 1.0 |
| `Textures/colormap.png` | Coaster Kit | CC0 1.0 |
| `obelisk.glb` | `Obelisk` from [ThreeJS Assets](https://threejsassets.com/assets/free) | free tier: commercial use, no attribution required, no reselling the files |
| `deco-street-lamp.glb` | `Deco Street Lamp`, ThreeJS Assets | same |
| `coconut-palm.glb`, `royal-palm.glb` | `Coconut Palm`, `Royal Palm`, ThreeJS Assets | same |
| `mossy-boulder.glb`, `sandstone-boulder.glb` | `Mossy Boulder`, `Sandstone Boulder`, ThreeJS Assets | same |

The ThreeJS Assets models are Draco compressed, which is why `GLTFLoader` here
is given a `DRACOLoader` and why `scripts/gen-manifest.mjs` copies three's
decoder into `public/draco`. Without it they do not fail loudly — the parse is
rejected, the procedural model turns up, and the world looks right minus one
thing. Their free licence permits commercial use and asks for no credit; it
forbids reselling the files. They are also authored centred on their own
bounding box rather than standing on their base, so each one carries an
`offset` in the registry — see the notes there.

`Textures/colormap.png` is not optional. The Coaster Kit's GLBs reference it
as a relative path rather than embedding it, so without it every model from
that kit loads successfully and renders untextured — the loader says so in the
console and nothing else complains.

CC0 asks for nothing, but Kenney's own licence text says crediting is
appreciated, so: **models by [Kenney](https://kenney.nl)**.

## Adding to this list

If you drop a file in this folder, put a row here saying where it came from
and under what terms. A public repo full of 3D assets with no provenance is a
problem for whoever inherits it, and "I found it online" stops being an answer
the moment anyone asks.

Only CC0 goes in without further thought. CC-BY needs the attribution to be
somewhere a visitor can actually see it, not only in this file, and anything
non-commercial does not belong in a portfolio at all.
