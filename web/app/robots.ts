import type { MetadataRoute } from "next";

/* Generated into out/robots.txt at build time — a metadata route, not a
 * handler, so `output: "export"` keeps it.
 *
 * There is one page here and everything on it is worth indexing, so the file
 * exists mostly to name the sitemap: a crawler that finds robots.txt finds
 * the sitemap through it, and this site has no links pointing anywhere for
 * one to follow instead. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://rauljimenezayza.github.io/portfolio-interactivo/sitemap.xml"
  };
}
