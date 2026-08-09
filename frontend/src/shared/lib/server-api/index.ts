/**
 * Серверные fetcher-ы, дергают INTERNAL_API_BASE_URL (docker network)
 * и кэшируются Next.js. Используются в RSC и `generateMetadata`.
 *
 * Один и тот же URL внутри одного запроса дедуплицируется Next автоматически —
 * безопасно вызывать из `layout.tsx` и `page.tsx` параллельно.
 */

export interface AdSummary {
  id: number;
  title: string;
  description: string | null;
  price: number;
  location: string | null;
  photo_urls: string[];
  category_id: number;
  subcategory_id: number;
  is_active?: boolean;
  is_urgent?: boolean;
  likes_count?: number;
  views_count?: number;
  created_at?: string | null;
  seller_name?: string | null;
  seller_phone?: string | null;
  is_liked?: boolean;
  is_viewed?: boolean;
  owner_id?: number;
  moderation_status?: string;
  moderation_reason?: string | null;
}

export interface SubcategorySummary {
  id: number;
  name: string;
  slug: string;
}

export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
  subcategories: SubcategorySummary[];
}

const apiBase = (): string => {
  const value = process.env.INTERNAL_API_BASE_URL;
  if (!value) {
    throw new Error(
      "Не задана переменная окружения INTERNAL_API_BASE_URL"
    );
  }
  return value.endsWith("/") ? value : `${value}/`;
};

export const siteOrigin = (): string => {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!value) {
    throw new Error(
      "Не задана переменная окружения NEXT_PUBLIC_API_BASE_URL"
    );
  }
  return new URL(value).origin;
};

export async function fetchAdvertisement(id: number): Promise<AdSummary | null> {
  const res = await fetch(`${apiBase()}advertisements/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  return (await res.json()) as AdSummary;
}

export async function fetchCategoryTree(): Promise<CategorySummary[]> {
  const res = await fetch(`${apiBase()}categories/list`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return (await res.json()) as CategorySummary[];
}
