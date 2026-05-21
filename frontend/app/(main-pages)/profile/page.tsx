"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { ProfileDetails } from "@/src/widgets/profile/profile-details";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { useMe } from "@/src/entities/user";
import style from "./page.module.scss";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, error, setUser } = useMe();

  useEffect(() => {
    if (!loading && error) {
      router.replace("/login");
    }
  }, [loading, error, router]);

  return (
    <main className={style.page}>
      <Header />
      <div className={style.content}>
        {loading || !user ? (
          <div className={style.loadingArea}>
            <Loader />
          </div>
        ) : (
          <ProfileDetails user={user} onUserUpdated={setUser} />
        )}
      </div>
      <Footer />
    </main>
  );
}
