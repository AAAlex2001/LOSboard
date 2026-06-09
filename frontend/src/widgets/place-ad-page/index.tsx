"use client";

import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { RequireAuth } from "@/src/shared/ui/RequireAuth";
import { PlaceAdForm } from "@/src/features/place-ad";
import { PlaceAdSidebar } from "@/src/widgets/advertisement/place-ad-sidebar";
import style from "./style.module.scss";

export const PlaceAdPageView = () => {
  return (
    <main className={style.page}>
      <Header />
      <RequireAuth
        redirectTo="/register"
        fallback={
          <div className={style.content}>
            <div className={style.loadingArea}>
              <Loader />
            </div>
          </div>
        }
      >
        <CrumbsBar
          items={[
            { label: "Главная", href: "/" },
            { label: "Подать объявление" },
          ]}
        />
        <div className={style.content}>
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
        </div>
      </RequireAuth>
      <Footer />
    </main>
  );
};
