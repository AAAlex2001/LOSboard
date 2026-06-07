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

const API_BASE = process.env.INTERNAL_API_BASE_URL!;
const SITE_ORIGIN = new URL(process.env.NEXT_PUBLIC_API_BASE_URL!).origin;

async function fetchCategories(): Promise<CategoryDto[]> {
  const res = await fetch(`${API_BASE}categories/list`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return (await res.json()) as CategoryDto[];
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
  const description = `Объявления в категории «${cat.name}» — LOS Daily, доска объявлений Республики Абхазия.`;
  const canonical = `${SITE_ORIGIN}/category/${cat.slug}`;
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

export default async function CategoryLayout({ params, children }: Props) {
  const { slug } = await params;
  const categories = await fetchCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return children;

  const canonical = `${SITE_ORIGIN}/category/${cat.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: SITE_ORIGIN,
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
