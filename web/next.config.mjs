/** GitHub Pages serves this from a project subpath, not a domain root, so the
 *  export needs a basePath or every asset 404s. `output: 'export'` because
 *  there is no server here — the whole thing is a canvas. */
const isProd = process.env.NODE_ENV === "production";
const repo = "/portfolio-interactivo";

/** @type {import('next').NextConfig} */
export default {
  output: "export",
  basePath: isProd ? repo : "",
  assetPrefix: isProd ? repo : "",
  images: { unoptimized: true },
  /* the model folder is read at build time; see scripts/gen-manifest.mjs */
  env: { NEXT_PUBLIC_BASE_PATH: isProd ? repo : "" }
};
