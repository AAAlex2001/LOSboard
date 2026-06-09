import type { MetadataRoute } from "next";
import { slugify } from "@/src/shared/lib/slug";
import { siteOrigin } from "@/src/shared/lib/server-api";

export const dynamic = "force-dynamic";

const SITEMAP_MAX_URLS = 50000;

interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  subcategories: { id: number; name: string; slug: string }[];
}

interface AdSitemapDto {
  id: number;
  title: string;
  created_at: string;
}

interface ContentPageDto {
  slug: string;
  title: string;
}

const apiBase = (): string => {
  const value = process.env.INTERNAL_API_BASE_URL;
  if (!value) {
    throw new Error("Не задана переменная окружения INTERNAL_API_BASE_URL");
  }
  return value.endsWith("/") ? value : `${value}/`;
};

async function fetchJson<T>(path: string, revalidate: number, fallback: T): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, { next: { revalidate } });
  if (!res.ok) return fallback;
  return (await res.json()) as T;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const origin = siteOrigin();

  const [categories, ads, pages] = await Promise.all([
    fetchJson<CategoryDto[]>("categories/list", 3600, []),
    fetchJson<AdSitemapDto[]>("advertisements/sitemap", 600, []),
    fetchJson<ContentPageDto[]>("content/pages", 3600, []),
  ]);

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  }[] = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/advertising", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contacts", priority: 0.5, changeFrequency: "monthly" },
    { path: "/docs", priority: 0.4, changeFrequency: "monthly" },
  ];

  const categoryEntries = categories.flatMap((cat) => {
    const root = {
      url: `${origin}/?cat=${encodeURIComponent(cat.slug)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    };
    const subs = cat.subcategories.map((sub) => ({
      url: `${origin}/?cat=${encodeURIComponent(cat.slug)}&sub=${encodeURIComponent(sub.slug)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
    return [root, ...subs];
  });

  const urgentRoot = {
    url: `${origin}/?urgent=1`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  };
  const urgentCategoryEntries = categories.flatMap((cat) => [
    {
      url: `${origin}/?urgent=1&cat=${encodeURIComponent(cat.slug)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.6,
    },
    ...cat.subcategories.map((sub) => ({
      url: `${origin}/?urgent=1&cat=${encodeURIComponent(cat.slug)}&sub=${encodeURIComponent(sub.slug)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.5,
    })),
  ]);

  const adEntries = ads.slice(0, SITEMAP_MAX_URLS).map((ad) => {
    const slug = slugify(ad.title);
    const path = slug
      ? `/advertisements/${ad.id}-${slug}`
      : `/advertisements/${ad.id}`;
    return {
      url: `${origin}${path}`,
      lastModified: ad.created_at ? new Date(ad.created_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  // CMS-страницы: /docs/<slug> для всех кроме contacts/pricing (у них свои URL).
  const docPageEntries = pages
    .filter((p) => p.slug !== "contacts" && p.slug !== "pricing")
    .map((p) => ({
      url: `${origin}/docs/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    }));

  return [
    ...staticRoutes.map((r) => ({
      url: `${origin}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...docPageEntries,
    ...categoryEntries,
    urgentRoot,
    ...urgentCategoryEntries,
    ...adEntries,
  ];
}
