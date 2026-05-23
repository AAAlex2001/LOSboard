import type { MetadataRoute } from "next";
import { slugify } from "@/src/shared/lib/slug";

export const dynamic = "force-dynamic";

const DOC_SLUGS = ["placement-rules", "privacy", "agreement", "prohibited"];
const SITEMAP_MAX_URLS = 50000;

const API_BASE = process.env.INTERNAL_API_BASE_URL!;
const SITE_ORIGIN = new URL(process.env.NEXT_PUBLIC_API_BASE_URL!).origin;

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

async function fetchCategories(): Promise<CategoryDto[]> {
  const res = await fetch(`${API_BASE}categories/`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return (await res.json()) as CategoryDto[];
}

async function fetchSitemapAds(): Promise<AdSitemapDto[]> {
  const res = await fetch(`${API_BASE}advertisements/sitemap`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) return [];
  return (await res.json()) as AdSitemapDto[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
      url: `${SITE_ORIGIN}/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    };
    const subs = cat.subcategories.map((sub) => ({
      url: `${SITE_ORIGIN}/category/${cat.slug}/${sub.slug}`,
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
      url: `${SITE_ORIGIN}${path}`,
      lastModified: ad.created_at ? new Date(ad.created_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE_ORIGIN}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...DOC_SLUGS.map((slug) => ({
      url: `${SITE_ORIGIN}/docs/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...categoryEntries,
    ...adEntries,
  ];
}
