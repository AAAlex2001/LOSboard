import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogPage } from "@/src/widgets/advertisement/catalog-page";
import { JsonLd } from "@/src/shared/ui/JsonLd";
import { fetchCategoryTree, siteOrigin } from "@/src/shared/lib/server-api";

interface PageProps {
  searchParams: Promise<{
    cat?: string;
    sub?: string;
    urgent?: string;
  }>;
}

interface CrumbDescriptor {
  name: string;
  url: string;
}

async function resolveContext(searchParams: PageProps["searchParams"]) {
  const sp = await searchParams;
  const categorySlug = sp.cat ?? null;
  const subcategorySlug = sp.sub ?? null;
  const urgent = sp.urgent === "1";
  const categories = await fetchCategoryTree();
  const category = categorySlug
    ? categories.find((c) => c.slug === categorySlug) ?? null
    : null;
  const subcategory =
    category && subcategorySlug
      ? category.subcategories.find((s) => s.slug === subcategorySlug) ?? null
      : null;
  return { urgent, category, subcategory };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { urgent, category, subcategory } = await resolveContext(searchParams);
  const origin = siteOrigin();

  const parts: string[] = [];
  if (urgent) parts.push("Срочные объявления");
  if (category) parts.push(category.name);
  if (subcategory) parts.push(subcategory.name);

  const title = parts.length > 0 ? parts.join(" — ") : "LOS Daily — Доска объявлений Республики Абхазия";

  const descriptionParts: string[] = [];
  if (subcategory && category) {
    descriptionParts.push(
      `«${subcategory.name}» в категории «${category.name}»${urgent ? " (срочные)" : ""} на LOS Daily.`
    );
  } else if (category) {
    descriptionParts.push(
      `Объявления в категории «${category.name}»${urgent ? " (срочные)" : ""} на LOS Daily.`
    );
  } else if (urgent) {
    descriptionParts.push("Срочные объявления Республики Абхазия на LOS Daily.");
  } else {
    descriptionParts.push(
      "Доска объявлений Республики Абхазия. Купить, продать, обменять — быстро и без посредников."
    );
  }
  const description = descriptionParts.join(" ");

  const canonicalParams = new URLSearchParams();
  if (urgent) canonicalParams.set("urgent", "1");
  if (category) canonicalParams.set("cat", category.slug);
  if (subcategory) canonicalParams.set("sub", subcategory.slug);
  const qs = canonicalParams.toString();
  const canonical = qs ? `${origin}/?${qs}` : `${origin}/`;
  const ogImage = `${origin}/los.jpg`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "LOS Daily",
      type: "website",
      images: [{ url: ogImage, alt: "LOS Daily — Доска объявлений" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const { urgent, category, subcategory } = await resolveContext(searchParams);
  const origin = siteOrigin();

  const breadcrumbItems: CrumbDescriptor[] = [
    { name: "Главная", url: origin },
  ];
  if (urgent) {
    const urgentUrl = `${origin}/?urgent=1`;
    breadcrumbItems.push({ name: "Срочные", url: urgentUrl });
  }
  if (category) {
    const params = new URLSearchParams();
    if (urgent) params.set("urgent", "1");
    params.set("cat", category.slug);
    breadcrumbItems.push({
      name: category.name,
      url: `${origin}/?${params.toString()}`,
    });
  }
  if (category && subcategory) {
    const params = new URLSearchParams();
    if (urgent) params.set("urgent", "1");
    params.set("cat", category.slug);
    params.set("sub", subcategory.slug);
    breadcrumbItems.push({
      name: subcategory.name,
      url: `${origin}/?${params.toString()}`,
    });
  }

  const hasFilter = urgent || category || subcategory;

  const breadcrumbJsonLd = hasFilter
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((b, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: b.name,
          item: b.url,
        })),
      }
    : null;

  const lastCrumb = breadcrumbItems[breadcrumbItems.length - 1];
  const collectionJsonLd = hasFilter
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: lastCrumb.name,
        url: lastCrumb.url,
        inLanguage: "ru",
      }
    : null;

  return (
    <>
      {breadcrumbJsonLd && <JsonLd data={breadcrumbJsonLd} />}
      {collectionJsonLd && <JsonLd data={collectionJsonLd} />}
      <Suspense fallback={null}>
        <CatalogPage />
      </Suspense>
    </>
  );
}
