/** GitHub Pages serves this from a project subpath, not a domain root, so the
 *  export needs a basePath or every asset 404s. `output: 'export'` because
 *  there is no server here — the whole thing is a canvas. */
const isProd = process.env.NODE_ENV === "production";
const repo = "/portfolio-interactivo";

/** @type {import('next').NextConfig} */
export default {
  /* `next build` and `next dev` both write to .next, so building while the
     dev server is up leaves it serving a directory that has been rebuilt
     underneath it. The symptom is not an error: the CSS links 404 and the
     page renders as unstyled text, which looks exactly like a broken app and
     is not one. Giving the build its own directory removes the collision. */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "export",
  basePath: isProd ? repo : "",
  assetPrefix: isProd ? repo : "",
  images: { unoptimized: true },
  /* the model folder is read at build time; see scripts/gen-manifest.mjs */
  env: { NEXT_PUBLIC_BASE_PATH: isProd ? repo : "" }
};
