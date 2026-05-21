import type { MetadataRoute } from "next";

const DOC_SLUGS = ["placement-rules", "privacy", "agreement", "prohibited"];

function getSiteUrl(): string {
  const api = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (api) {
    try {
      return new URL(api).origin;
    } catch {
      // fallthrough
    }
  }
  return "http://localhost:3000";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/advertising", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contacts", priority: 0.5, changeFrequency: "monthly" },
    { path: "/docs", priority: 0.4, changeFrequency: "monthly" },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...DOC_SLUGS.map((slug) => ({
      url: `${base}/docs/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
