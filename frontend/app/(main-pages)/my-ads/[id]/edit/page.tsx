"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import { PlaceAdForm } from "@/src/features/place-ad";
import { PlaceAdSidebar } from "@/src/widgets/place-ad-sidebar";
import { getAdvertisement } from "@/src/entities/advertisement";
import { isAuthenticated as checkAuth } from "@/src/shared/auth/auth-storage";
import style from "./page.module.scss";

export default function EditAdPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const adId = Number(params?.id);

  const [ready, setReady] = useState(false);
  const [adTitle, setAdTitle] = useState<string>("");

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    if (!ready || !Number.isFinite(adId)) return;
    const controller = new AbortController();
    getAdvertisement(adId, { signal: controller.signal })
      .then((ad) => {
        if (!controller.signal.aborted) setAdTitle(ad.title);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [ready, adId]);

  if (!ready) {
    return (
      <main className={style.page}>
        <Header />
        <div className={style.loadingArea}>
          <Loader />
        </div>
        <Footer />
      </main>
    );
  }

  if (!Number.isFinite(adId)) {
    return (
      <main className={style.page}>
        <Header />
        <div className={style.content}>
          <p className={style.error}>Некорректный идентификатор объявления</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={style.page}>
      <Header />
      <div className={style.content}>
        <div className={style.container}>
          <div className={style.breadcrumbs}>
            <Breadcrumbs
              items={[
                { label: "Главная", href: "/" },
                { label: "Мои объявления", href: "/my-ads" },
                { label: "Редактирование" },
                ...(adTitle ? [{ label: adTitle }] : []),
              ]}
            />
          </div>

          <div className={style.formBlock}>
            <div className={style.feedHeading}>
              <button
                type="button"
                className={style.backBtn}
                onClick={() => router.back()}
                aria-label="Назад"
              >
                <ArrowLeftIcon />
              </button>
              <h1 className={style.title}>
                {adTitle || "Редактирование объявления"}
              </h1>
            </div>
            <PlaceAdForm advertisementId={adId} />
          </div>

          <div className={style.sidebarSlot}>
            <PlaceAdSidebar />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
