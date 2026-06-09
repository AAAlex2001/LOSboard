"use client";

import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { RequireAuth } from "@/src/shared/ui/RequireAuth";
import { MyAdsFeed } from "@/src/widgets/advertisement/my-ads-feed";
import { PlaceAdSidebar } from "@/src/widgets/advertisement/place-ad-sidebar";
import style from "./style.module.scss";

export const MyAdsPageView = () => {
  return (
    <main className={style.page}>
      <Header />
      <RequireAuth
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
            { label: "Личный профиль", href: "/profile" },
            { label: "Мои объявления" },
          ]}
        />
        <div className={style.content}>
          <div className={style.layout}>
            <div className={style.feedSlot}>
              <div className={style.feedHeading}>
                <h1 className={style.title}>Мои объявления</h1>
              </div>
              <MyAdsFeed />
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
