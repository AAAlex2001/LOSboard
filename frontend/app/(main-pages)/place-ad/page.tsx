"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import { PlaceAdForm } from "@/src/features/place-ad";
import { PlaceAdSidebar } from "@/src/widgets/place-ad-sidebar";
import { isAuthenticated as checkAuth } from "@/src/shared/auth/auth-storage";
import style from "./page.module.scss";

export default function PlaceAdPage() {
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
      <div className={style.content}>
        {!ready ? (
          <div className={style.loadingArea}>
            <Loader />
          </div>
        ) : (
          <div className={style.container}>
            <div className={style.breadcrumbs}>
              <Breadcrumbs
                items={[
                  { label: "Главная", href: "/" },
                  { label: "Разместить объявление" },
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
}
