"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { MyAdsFeed } from "@/src/widgets/advertisement/my-ads-feed";
import { PlaceAdSidebar } from "@/src/widgets/advertisement/place-ad-sidebar";
import { isAuthenticated as checkAuth } from "@/src/shared/auth/auth-storage";
import style from "./page.module.scss";

export default function MyAdsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/login");
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
            { label: "Личный профиль", href: "/profile" },
            { label: "Мои объявления" },
          ]}
        />
      )}
      <div className={style.content}>
        {!ready ? (
          <div className={style.loadingArea}>
            <Loader />
          </div>
        ) : (
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
        )}
      </div>
      <Footer />
    </main>
  );
}
