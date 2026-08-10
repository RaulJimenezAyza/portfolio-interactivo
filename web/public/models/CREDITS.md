# Where the models came from

Everything not listed here is built in code by `src/game/world.js` and is the
project's own.

| file | source | licence |
|---|---|---|
| `pine.glb` | `tree_cone` from [Kenney's Nature Kit](https://kenney.nl/assets/nature-kit) | [CC0 1.0](http://creativecommons.org/publicdomain/zero/1.0/) |
| `park-gate.glb` | `park-entrance` from [Kenney's Coaster Kit](https://kenney.nl/assets/coaster-kit) | [CC0 1.0](http://creativecommons.org/publicdomain/zero/1.0/) |
| `stall-food.glb`, `stall-drinks.glb`, `stall-information.glb`, `stall-toilets.glb` | Coaster Kit | CC0 1.0 |
| `park-bench.glb`, `park-bin.glb`, `park-flowers.glb` | Coaster Kit (`bench`, `trash`, `flowers`) | CC0 1.0 |
| `Textures/colormap.png` | Coaster Kit | CC0 1.0 |

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
