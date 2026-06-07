export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { AdvertisementDetail } from "@/src/widgets/advertisement/advertisement-detail";
import { AdvertisementSidebar } from "@/src/widgets/advertisement/advertisement-sidebar";
import { parseAdvertisementIdFromParam } from "@/src/shared/lib/slug";
import {
  fetchAdvertisement,
  fetchCategoryTree,
} from "@/src/shared/lib/server-api";
import type { Advertisement } from "@/src/entities/advertisement";
import style from "./page.module.scss";

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
    <main className={style.page}>
      <Header />
      <CrumbsBar
        items={[
          { label: "Главная", href: "/" },
          ...(category
            ? [{ label: category.name, href: `/category/${category.slug}` }]
            : []),
          ...(category && subcategory
            ? [
                {
                  label: subcategory.name,
                  href: `/category/${category.slug}/${subcategory.slug}`,
                },
              ]
            : []),
          { label: ad.title },
        ]}
      />
      <div className={style.content}>
        <div className={style.container}>
          <div className={style.card}>
            <div className={style.detailBlock}>
              <AdvertisementDetail
                advertisement={ad as Advertisement}
                categoryName={category?.name}
                subcategoryName={subcategory?.name}
              />
            </div>

            <div className={style.sidebarSlot}>
              <AdvertisementSidebar
                advertisementId={ad.id}
                price={ad.price}
                ownerId={ad.owner_id ?? 0}
                sellerPhone={ad.seller_phone}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
