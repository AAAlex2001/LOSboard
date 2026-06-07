import { Suspense } from "react";
import { CatalogPage } from "@/src/widgets/advertisement/catalog-page";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";

interface PageProps {
  params: Promise<{ slug: string; sub: string }>;
}

function CatalogFallback() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F9F9FB" }}>
      <Header />
      <div style={{ flex: 1 }} />
      <Footer />
    </main>
  );
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { slug, sub } = await params;
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogPage initialCategorySlug={slug} initialSubcategorySlug={sub} />
    </Suspense>
  );
}
