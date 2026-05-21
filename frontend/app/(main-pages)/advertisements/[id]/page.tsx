"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import {
  getAdvertisement,
  type Advertisement,
} from "@/src/entities/advertisement";
import { useCategories } from "@/src/entities/category";
import { AdvertisementDetail } from "@/src/widgets/advertisement-detail";
import { AdvertisementSidebar } from "@/src/widgets/advertisement-sidebar";
import style from "./page.module.scss";

export default function AdvertisementPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const adId = Number(params?.id);

  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { categories } = useCategories();

  useEffect(() => {
    if (!Number.isFinite(adId)) {
      setError("Некорректный идентификатор объявления");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getAdvertisement(adId, { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setAd(data);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [adId]);

  const category = ad
    ? categories.find((c) => c.id === ad.category_id) ?? null
    : null;
  const subcategory =
    ad && category
      ? category.subcategories.find((s) => s.id === ad.subcategory_id) ?? null
      : null;

  const headingTitle = category
    ? `Категория объявлений: «${category.name}»`
    : "Объявление";

  return (
    <main className={style.page}>
      <Header />
      <div className={style.content}>
        <div className={style.container}>
          {loading ? (
            <div className={style.loadingArea}>
              <Loader />
            </div>
          ) : error || !ad ? (
            <p className={style.error}>{error ?? "Объявление не найдено"}</p>
          ) : (
            <>
              <div className={style.breadcrumbs}>
                <Breadcrumbs
                  items={[
                    { label: "Главная", href: "/" },
                    ...(category
                      ? [{ label: category.name, href: "/" }]
                      : []),
                    ...(subcategory ? [{ label: subcategory.name }] : []),
                    { label: ad.title },
                  ]}
                />
              </div>

              <div className={style.card}>
                <div className={style.detailBlock}>
                  <div className={style.feedHeading}>
                    <button
                      type="button"
                      className={style.backBtn}
                      onClick={() => router.back()}
                      aria-label="Назад"
                    >
                      <ArrowLeftIcon />
                    </button>
                    <h1 className={style.title}>{headingTitle}</h1>
                  </div>

                  <AdvertisementDetail
                    advertisement={ad}
                    categoryName={category?.name}
                    subcategoryName={subcategory?.name}
                  />
                </div>

                <div className={style.sidebarSlot}>
                  <AdvertisementSidebar
                    price={ad.price}
                    sellerPhone={ad.seller_phone}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
