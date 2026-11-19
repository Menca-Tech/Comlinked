import type { MetadataRoute } from "next";

/**
 * Public, indexable routes listed in the sitemap. The dashboard and other
 * authenticated areas are intentionally excluded (and disallowed in robots).
 */
export const SITEMAP_ROUTES = [
  "/",
  "/how-it-works",
  "/comdash",
  "/for-chambers",
  "/auth/sign-in",
  "/auth/sign-up",
] as const;

/**
 * Pure: build sitemap entries as absolute URLs against `baseUrl`. `lastModified`
 * is passed in (not read from the clock) so the builder stays deterministic and
 * testable. `new URL(route, baseUrl)` joins cleanly regardless of trailing slash.
 */
export function buildSitemap(baseUrl: string, lastModified: Date): MetadataRoute.Sitemap {
  return SITEMAP_ROUTES.map((route) => ({
    url: new URL(route, baseUrl).toString(),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.5,
  }));
}

/** Pure: allow crawling everything except the private dashboard; link the sitemap. */
export function buildRobots(baseUrl: string, { demo = false } = {}): MetadataRoute.Robots {
  return {
    // The shared demo deployment is kept out of search engines entirely.
    rules: demo
      ? { userAgent: "*", disallow: "/" }
      : {
          userAgent: "*",
          allow: "/",
          disallow: "/dashboard/",
        },
    sitemap: new URL("sitemap.xml", baseUrl).toString(),
    host: new URL(baseUrl).origin,
  };
}
