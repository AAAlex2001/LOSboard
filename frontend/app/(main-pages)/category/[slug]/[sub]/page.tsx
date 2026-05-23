import { Suspense } from "react";
import { CatalogPage } from "@/src/widgets/advertisement/catalog-page";

interface PageProps {
  params: Promise<{ slug: string; sub: string }>;
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { slug, sub } = await params;
  return (
    <Suspense>
      <CatalogPage initialCategorySlug={slug} initialSubcategorySlug={sub} />
    </Suspense>
  );
}
