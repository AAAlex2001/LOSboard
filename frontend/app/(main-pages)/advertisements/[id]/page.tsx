export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { AdvertisementPageView } from "@/src/widgets/advertisement-page";
import { parseAdvertisementIdFromParam } from "@/src/shared/lib/slug";
import {
  fetchAdvertisement,
  fetchCategoryTree,
} from "@/src/shared/lib/server-api";
import type { Advertisement } from "@/src/entities/advertisement";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdvertisementPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const adId = parseAdvertisementIdFromParam(idParam);
  if (!Number.isFinite(adId)) {
    notFound();
  }

  const [ad, categories] = await Promise.all([
    fetchAdvertisement(adId),
    fetchCategoryTree(),
  ]);

  if (!ad) {
    notFound();
  }

  const category = categories.find((c) => c.id === ad.category_id) ?? null;
  const subcategory =
    category?.subcategories.find((s) => s.id === ad.subcategory_id) ?? null;

  return (
    <AdvertisementPageView
      advertisement={ad as Advertisement}
      category={category}
      subcategory={subcategory}
    />
  );
}
