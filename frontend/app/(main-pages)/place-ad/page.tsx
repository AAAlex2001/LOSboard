"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
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

            <div className={style.layout}>
              <div className={style.formCol}>
                <PlaceAdForm />
              </div>
              <div className={style.sidebarCol}>
                <PlaceAdSidebar />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
