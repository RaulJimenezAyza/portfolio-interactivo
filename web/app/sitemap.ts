import type { MetadataRoute } from "next";

/* One page, and that is the point: without a sitemap the only thing telling
 * a crawler this URL exists is whoever linked to it.
 *
 * `lastModified` is the build time. It is honest — this is a static export,
 * so the build is when the content last changed — and it means a redeploy
 * tells crawlers to come back. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://rauljimenezayza.github.io/portfolio-interactivo/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    }
  ];
}
