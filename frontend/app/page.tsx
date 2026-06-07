import { Suspense } from "react";
import { CatalogPage } from "@/src/widgets/advertisement/catalog-page";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";

function CatalogFallback() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F9F9FB" }}>
      <Header />
      <div style={{ flex: 1 }} />
      <Footer />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogPage />
    </Suspense>
  );
}
