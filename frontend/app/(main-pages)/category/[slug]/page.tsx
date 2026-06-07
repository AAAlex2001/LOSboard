import { Suspense } from "react";
import { CatalogPage } from "@/src/widgets/advertisement/catalog-page";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";

interface PageProps {
  params: Promise<{ slug: string }>;
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

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogPage initialCategorySlug={slug} />
    </Suspense>
  );
}
