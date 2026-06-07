"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { ProfileDetails } from "@/src/widgets/profile/profile-details";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { useMeContext } from "@/src/entities/user";
import style from "./page.module.scss";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, setUser } = useMeContext();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  return (
    <main className={style.page}>
      <Header />
      {!(loading || !user) && (
        <CrumbsBar
          items={[
            { label: "Главная", href: "/" },
            { label: "Личный профиль" },
          ]}
        />
      )}
      <div className={style.content}>
        {loading || !user ? (
          <div className={style.loadingArea}>
            <Loader />
          </div>
        ) : (
          <div className={style.layout}>
            <ProfileDetails user={user} onUserUpdated={setUser} />
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
