"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { ChatsShell } from "@/src/widgets/chat/chats-shell";
import { EmptyChatPlaceholder } from "@/src/entities/chat";
import { isAuthenticated as checkAuth } from "@/src/shared/auth/auth-storage";
import style from "./page.module.scss";

export default function ChatsPage() {
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
            { label: "Сообщения" },
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
                <h1 className={style.title}>Сообщения</h1>
              </div>
              <div className={style.shellWrap}>
                <ChatsShell activeConversationId={null}>
                  <EmptyChatPlaceholder />
                </ChatsShell>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
