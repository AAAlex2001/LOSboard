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
          "/los-control-x9k2m-admin/",
          "/static/uploads/chat/",
          "/login",
          "/register",
          "/profile",
          "/chats",
          "/chats/",
          "/my-ads",
          "/my-ads/",
          "/favorites",
          "/place-ad",
          "/*?q=",
          "/*?utm_*",
          "/*?fbclid=*",
          "/*?gclid=*",
        ],
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
