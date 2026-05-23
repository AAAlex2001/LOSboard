import { CatalogPage } from "@/src/widgets/advertisement/catalog-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return <CatalogPage initialCategorySlug={slug} />;
}
