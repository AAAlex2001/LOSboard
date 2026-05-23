import type { Metadata } from "next";
import { JsonLd } from "@/src/shared/ui/JsonLd";
import { slugify } from "@/src/shared/lib/slug";

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

interface AdSummary {
  id: number;
  title: string;
  description: string | null;
  price: number;
  location: string;
  photo_urls: string[];
  created_at?: string | null;
  is_active?: boolean;
}

function getApiBase(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) return "http://localhost:8000/";
  return url.endsWith("/") ? url : `${url}/`;
}

function getSiteOrigin(): string {
  try {
    return new URL(getApiBase()).origin;
  } catch {
    return "http://localhost:3000";
  }
}

async function fetchAd(id: number): Promise<AdSummary | null> {
  try {
    const res = await fetch(`${getApiBase()}advertisements/${id}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as AdSummary;
  } catch {
    return null;
  }
}

function buildDescription(ad: AdSummary): string {
  const price = `${ad.price.toLocaleString("ru-RU")} ₽`;
  const location = ad.location ? ` · ${ad.location}` : "";
  const body = ad.description?.trim()
    ? ad.description.trim().slice(0, 200)
    : "Объявление на LOSboard — доска объявлений Республики Абхазия.";
  return `${price}${location}. ${body}`;
}

function buildCanonical(origin: string, ad: AdSummary): string {
  const slug = slugify(ad.title);
  const suffix = slug ? `${ad.id}-${slug}` : `${ad.id}`;
  return `${origin}/advertisements/${suffix}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: idParam } = await params;
  const match = idParam.match(/^(\d+)/);
  const id = match ? Number(match[1]) : NaN;

  if (!Number.isFinite(id)) {
    return {
      title: "Объявление не найдено",
      robots: { index: false, follow: false },
    };
  }

  const ad = await fetchAd(id);
  if (!ad) {
    return {
      title: "Объявление не найдено",
      robots: { index: false, follow: false },
    };
  }

  const description = buildDescription(ad);
  const origin = getSiteOrigin();
  const canonical = buildCanonical(origin, ad);
  const ogImage =
    ad.photo_urls && ad.photo_urls.length > 0
      ? `${origin}${ad.photo_urls[0]}`
      : `${origin}/los.jpg`;

  return {
    title: ad.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: ad.title,
      description,
      url: canonical,
      images: [{ url: ogImage, alt: ad.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ad.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function AdvertisementLayout({
  params,
  children,
}: Props) {
  const { id: idParam } = await params;
  const match = idParam.match(/^(\d+)/);
  const id = match ? Number(match[1]) : NaN;
  if (!Number.isFinite(id)) return children;

  const ad = await fetchAd(id);
  if (!ad) return children;

  const origin = getSiteOrigin();
  const canonical = buildCanonical(origin, ad);
  const images = (ad.photo_urls ?? []).map((p) => `${origin}${p}`);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ad.title,
    description: ad.description ?? buildDescription(ad),
    image: images.length > 0 ? images : [`${origin}/los.jpg`],
    url: canonical,
    offers: {
      "@type": "Offer",
      price: ad.price,
      priceCurrency: "RUB",
      availability:
        ad.is_active === false
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      url: canonical,
      areaServed: ad.location || undefined,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: origin,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: ad.title,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
