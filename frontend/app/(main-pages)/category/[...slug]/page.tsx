import { CatalogPage } from "@/src/widgets/advertisement/catalog-page";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CategoryRoute({ params }: PageProps) {
  const { slug } = await params;
  const [categorySlug, subcategorySlug] = slug;
  return (
    <CatalogPage
      initialCategorySlug={categorySlug}
      initialSubcategorySlug={subcategorySlug}
    />
  );
}
