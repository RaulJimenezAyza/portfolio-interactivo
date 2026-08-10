/** GitHub Pages serves this from a project subpath, not a domain root, so the
 *  export needs a basePath or every asset 404s. `output: 'export'` because
 *  there is no server here — the whole thing is a canvas. */
const isProd = process.env.NODE_ENV === "production";
const repo = "/portfolio-interactivo";

/** @type {import('next').NextConfig} */
export default {
  /* Next 14 turns this on by default, and R3F v8 will not create its root
     until react-use-measure reports a size above zero:

       if (containerRect.width > 0 && containerRect.height > 0 && canvas)

     That guard is exactly where the black canvas stops. Under StrictMode the
     measure hook is mounted, torn down and remounted, and its ResizeObserver
     can end up attached to an element whose size never changes again — so the
     initial entry is the only one that would have fired, and it fired against
     the discarded instance. Off here until the migration is stable, then worth
     revisiting with a newer R3F rather than leaving it off for good. */
  reactStrictMode: false,
  output: "export",
  basePath: isProd ? repo : "",
  assetPrefix: isProd ? repo : "",
  images: { unoptimized: true },
  /* the model folder is read at build time; see scripts/gen-manifest.mjs */
  env: { NEXT_PUBLIC_BASE_PATH: isProd ? repo : "" }
};
