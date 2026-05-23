import type { MetadataRoute } from "next";

const SITE_ORIGIN = new URL(process.env.NEXT_PUBLIC_API_BASE_URL!).origin;

export default function robots(): MetadataRoute.Robots {
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
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
