import { Suspense } from "react";
import { CatalogPage } from "@/src/widgets/advertisement/catalog-page";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <CatalogPage />
    </Suspense>
  );
}
