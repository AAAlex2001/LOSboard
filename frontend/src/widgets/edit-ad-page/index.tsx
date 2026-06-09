"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { RequireAuth } from "@/src/shared/ui/RequireAuth";
import { PlaceAdForm } from "@/src/features/place-ad";
import { PlaceAdSidebar } from "@/src/widgets/advertisement/place-ad-sidebar";
import { getAdvertisement } from "@/src/entities/advertisement";
import style from "./style.module.scss";

const EditAdContent = ({ adId }: { adId: number }) => {
  const [adTitle, setAdTitle] = useState<string>("");

  useEffect(() => {
    if (!Number.isFinite(adId)) return;
    const controller = new AbortController();
    getAdvertisement(adId, { signal: controller.signal })
      .then((ad) => {
        if (!controller.signal.aborted) setAdTitle(ad.title);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [adId]);

  if (!Number.isFinite(adId)) {
    return (
      <div className={style.content}>
        <p className={style.error}>Некорректный идентификатор объявления</p>
      </div>
    );
  }

  return (
    <>
      <CrumbsBar
        items={[
          { label: "Главная", href: "/" },
          { label: "Личный профиль", href: "/profile" },
          { label: "Мои объявления", href: "/my-ads" },
          { label: adTitle || "Редактирование" },
        ]}
      />
      <div className={style.content}>
        <div className={style.container}>
          <div className={style.formBlock}>
            <div className={style.feedHeading}>
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
    </>
  );
};

export const EditAdPageView = () => {
  const params = useParams<{ id: string }>();
  const adId = Number(params?.id);

  return (
    <main className={style.page}>
      <Header />
      <RequireAuth
        fallback={
          <div className={style.loadingArea}>
            <Loader />
          </div>
        }
      >
        <EditAdContent adId={adId} />
      </RequireAuth>
      <Footer />
    </main>
  );
};
