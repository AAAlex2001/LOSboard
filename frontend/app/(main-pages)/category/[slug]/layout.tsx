import type { Metadata } from "next";
import { JsonLd } from "@/src/shared/ui/JsonLd";

interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  subcategories: { id: number; name: string; slug: string }[];
}

interface Props {
  params: Promise<{ slug: string }>;
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
  const { slug } = await params;
  const categories = await fetchCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) {
    return {
      title: "Категория не найдена",
      robots: { index: false, follow: false },
    };
  }
  const description = `Объявления в категории «${cat.name}» — LOSboard, доска объявлений Республики Абхазия.`;
  const canonical = `${getSiteOrigin()}/category/${cat.slug}`;
  return {
    title: cat.name,
    description,
    alternates: { canonical },
    openGraph: {
      title: cat.name,
      description,
      url: canonical,
    },
  };
}

export default async function CategoryLayout({
  params,
  children,
}: Props) {
  const { slug } = await params;
  const categories = await fetchCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return children;

  const origin = getSiteOrigin();
  const canonical = `${origin}/category/${cat.slug}`;

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
        item: canonical,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.name,
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
