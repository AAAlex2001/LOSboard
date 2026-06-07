"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { PlaceAdForm } from "@/src/features/place-ad";
import { PlaceAdSidebar } from "@/src/widgets/advertisement/place-ad-sidebar";
import { isAuthenticated as checkAuth } from "@/src/shared/auth/auth-storage";
import style from "./style.module.scss";

export const PlaceAdPageView = () => {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/register");
    } else {
      setReady(true);
    }
  }, [router]);

  return (
    <main className={style.page}>
      <Header />
      {ready && (
        <CrumbsBar
          items={[
            { label: "Главная", href: "/" },
            { label: "Подать объявление" },
          ]}
        />
      )}
      <div className={style.content}>
        {!ready ? (
          <div className={style.loadingArea}>
            <Loader />
          </div>
        ) : (
          <div className={style.container}>
            <div className={style.formBlock}>
              <div className={style.feedHeading}>
                <h1 className={style.title}>Размещение объявления</h1>
              </div>
              <PlaceAdForm />
            </div>

            <div className={style.sidebarSlot}>
              <PlaceAdSidebar />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
};
