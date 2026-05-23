import type { Metadata } from "next";
import { JsonLd } from "@/src/shared/ui/JsonLd";

interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  subcategories: { id: number; name: string; slug: string }[];
}

interface Props {
  params: Promise<{ slug: string; sub: string }>;
  children: React.ReactNode;
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sub } = await params;
  const categories = await fetchCategories();
  const cat = categories.find((c) => c.slug === slug);
  const subcategory = cat?.subcategories.find((s) => s.slug === sub);
  if (!cat || !subcategory) {
    return {
      title: "Подкатегория не найдена",
      robots: { index: false, follow: false },
    };
  }
  const description = `«${subcategory.name}» в категории «${cat.name}» — LOSboard, доска объявлений Республики Абхазия.`;
  const canonical = `${getSiteOrigin()}/category/${cat.slug}/${subcategory.slug}`;
  return {
    title: `${subcategory.name} — ${cat.name}`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${subcategory.name} — ${cat.name}`,
      description,
      url: canonical,
    },
  };
}

export default async function SubcategoryLayout({
  params,
  children,
}: Props) {
  const { slug, sub } = await params;
  const categories = await fetchCategories();
  const cat = categories.find((c) => c.slug === slug);
  const subcategory = cat?.subcategories.find((s) => s.slug === sub);
  if (!cat || !subcategory) return children;

  const origin = getSiteOrigin();
  const canonical = `${origin}/category/${cat.slug}/${subcategory.slug}`;

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
        name: cat.name,
        item: `${origin}/category/${cat.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: subcategory.name,
        item: canonical,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${subcategory.name} — ${cat.name}`,
    url: canonical,
    inLanguage: "ru",
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      {children}
    </>
  );
}
