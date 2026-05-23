import type { MetadataRoute } from "next";
import { slugify } from "@/src/shared/lib/slug";

const DOC_SLUGS = ["placement-rules", "privacy", "agreement", "prohibited"];
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

function getApiBase(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) return "http://localhost:8000/";
  return url.endsWith("/") ? url : `${url}/`;
}

async function fetchCategories(): Promise<CategoryDto[]> {
  try {
    const res = await fetch(`${getApiBase()}categories/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return (await res.json()) as CategoryDto[];
  } catch {
    return [];
  }
}

async function fetchSitemapAds(): Promise<AdSitemapDto[]> {
  try {
    const res = await fetch(`${getApiBase()}advertisements/sitemap`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    return (await res.json()) as AdSitemapDto[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

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

  const [categories, ads] = await Promise.all([
    fetchCategories(),
    fetchSitemapAds(),
  ]);

  const categoryEntries = categories.flatMap((cat) => {
    const root = {
      url: `${base}/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    };
    const subs = cat.subcategories.map((sub) => ({
      url: `${base}/category/${cat.slug}/${sub.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
    return [root, ...subs];
  });

  const adEntries = ads.slice(0, SITEMAP_MAX_URLS).map((ad) => {
    const slug = slugify(ad.title);
    const path = slug
      ? `/advertisements/${ad.id}-${slug}`
      : `/advertisements/${ad.id}`;
    return {
      url: `${base}${path}`,
      lastModified: ad.created_at ? new Date(ad.created_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

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
    ...categoryEntries,
    ...adEntries,
  ];
}
