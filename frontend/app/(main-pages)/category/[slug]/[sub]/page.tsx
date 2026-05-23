import { CatalogPage } from "@/src/widgets/advertisement/catalog-page";

interface PageProps {
  params: Promise<{ slug: string; sub: string }>;
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { slug, sub } = await params;
  return <CatalogPage initialCategorySlug={slug} initialSubcategorySlug={sub} />;
}
