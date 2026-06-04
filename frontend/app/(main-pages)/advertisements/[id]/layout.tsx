import type { Metadata } from "next";
import { JsonLd } from "@/src/shared/ui/JsonLd";
import { slugify } from "@/src/shared/lib/slug";
import {
  fetchAdvertisement,
  fetchCategoryTree,
  siteOrigin,
  type AdSummary,
} from "@/src/shared/lib/server-api";

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

function buildDescription(ad: AdSummary): string {
  const price = `${ad.price.toLocaleString("ru-RU")} ₽`;
  const location = ad.location ? ` · ${ad.location}` : "";
  const body = ad.description?.trim()
    ? ad.description.trim().slice(0, 200)
    : "Объявление на LOSboard — доска объявлений Республики Абхазия.";
  return `${price}${location}. ${body}`;
}

function buildCanonical(ad: AdSummary): string {
  const slug = slugify(ad.title);
  const suffix = slug ? `${ad.id}-${slug}` : `${ad.id}`;
  return `${siteOrigin()}/advertisements/${suffix}`;
}

function parseId(idParam: string): number {
  const match = idParam.match(/^(\d+)/);
  return match ? Number(match[1]) : NaN;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!Number.isFinite(id)) {
    return {
      title: "Объявление не найдено",
      robots: { index: false, follow: false },
    };
  }

  const ad = await fetchAdvertisement(id);
  if (!ad) {
    return {
      title: "Объявление не найдено",
      robots: { index: false, follow: false },
    };
  }

  const description = buildDescription(ad);
  const canonical = buildCanonical(ad);
  const origin = siteOrigin();
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

export default async function AdvertisementLayout({ params, children }: Props) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (!Number.isFinite(id)) return children;

  const [ad, categories] = await Promise.all([
    fetchAdvertisement(id),
    fetchCategoryTree(),
  ]);
  if (!ad) return children;

  const origin = siteOrigin();
  const canonical = buildCanonical(ad);
  const images = (ad.photo_urls ?? []).map((p) => `${origin}${p}`);

  const category = categories.find((c) => c.id === ad.category_id) ?? null;
  const subcategory =
    category?.subcategories.find((s) => s.id === ad.subcategory_id) ?? null;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ad.title,
    description: ad.description ?? buildDescription(ad),
    image: images.length > 0 ? images : [`${origin}/los.jpg`],
    url: canonical,
    category: subcategory?.name ?? category?.name,
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

  const breadcrumbItems: {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }[] = [
    { "@type": "ListItem", position: 1, name: "Главная", item: origin },
  ];
  let position = 2;
  if (category) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: position++,
      name: category.name,
      item: `${origin}/category/${category.slug}`,
    });
  }
  if (category && subcategory) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: position++,
      name: subcategory.name,
      item: `${origin}/category/${category.slug}/${subcategory.slug}`,
    });
  }
  breadcrumbItems.push({
    "@type": "ListItem",
    position: position++,
    name: ad.title,
    item: canonical,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
