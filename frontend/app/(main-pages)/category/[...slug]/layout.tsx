import type { Metadata } from "next";
import { JsonLd } from "@/src/shared/ui/JsonLd";

interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  subcategories: { id: number; name: string; slug: string }[];
}

interface Props {
  params: Promise<{ slug: string[] }>;
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
  const [categorySlug, subcategorySlug] = slug;
  const categories = await fetchCategories();
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) {
    return {
      title: "Категория не найдена",
      robots: { index: false, follow: false },
    };
  }
  const subcategory = subcategorySlug
    ? cat.subcategories.find((s) => s.slug === subcategorySlug)
    : null;
  if (subcategorySlug && !subcategory) {
    return {
      title: "Подкатегория не найдена",
      robots: { index: false, follow: false },
    };
  }
  const title = subcategory
    ? `${subcategory.name} — ${cat.name}`
    : cat.name;
  const description = subcategory
    ? `«${subcategory.name}» в категории «${cat.name}» — LOS Daily, доска объявлений Республики Абхазия.`
    : `Объявления в категории «${cat.name}» — LOS Daily, доска объявлений Республики Абхазия.`;
  const canonical = subcategory
    ? `${SITE_ORIGIN}/category/${cat.slug}/${subcategory.slug}`
    : `${SITE_ORIGIN}/category/${cat.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  };
}

export default async function CategoryLayout({ params, children }: Props) {
  const { slug } = await params;
  const [categorySlug, subcategorySlug] = slug;
  const categories = await fetchCategories();
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) return children;
  const subcategory = subcategorySlug
    ? cat.subcategories.find((s) => s.slug === subcategorySlug)
    : null;

  const categoryUrl = `${SITE_ORIGIN}/category/${cat.slug}`;
  const canonical = subcategory ? `${categoryUrl}/${subcategory.slug}` : categoryUrl;

  const breadcrumbItems = [
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
      item: categoryUrl,
    },
  ];
  if (subcategory) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: subcategory.name,
      item: canonical,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: subcategory ? `${subcategory.name} — ${cat.name}` : cat.name,
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
