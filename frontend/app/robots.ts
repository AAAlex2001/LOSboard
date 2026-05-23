import type { MetadataRoute } from "next";

function getSiteUrl(): string {
  const api = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (api) {
    try {
      return new URL(api).origin;
    } catch {
      return "http://localhost:3000";
    }
  }
  return "http://localhost:3000";
}

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/login",
          "/register",
          "/profile",
          "/chats",
          "/chats/",
          "/my-ads",
          "/my-ads/",
          "/favorites",
          "/place-ad",
          "/*?urgent=",
          "/*?q=",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
