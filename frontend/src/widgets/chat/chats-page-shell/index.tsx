"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import { ChatsShell } from "@/src/widgets/chat/chats-shell";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import { isAuthenticated as checkAuth } from "@/src/shared/auth/auth-storage";
import style from "./style.module.scss";

interface ChatsPageShellProps {
  children: React.ReactNode;
}

export const ChatsPageShell = ({ children }: ChatsPageShellProps) => {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  const activeConversationId =
    params?.id && Number.isFinite(Number(params.id)) ? Number(params.id) : null;

  const handleBack = () => {
    if (activeConversationId != null) {
      router.push("/chats");
    } else {
      router.back();
    }
  };

  return (
    <main className={style.page}>
      <Header />
      <div className={style.content}>
        {!ready ? (
          <div className={style.loadingArea}>
            <Loader />
          </div>
        ) : (
          <div className={style.layout}>
            <div className={style.crumbsSlot}>
              <Breadcrumbs
                items={[
                  { label: "Главная", href: "/" },
                  activeConversationId != null
                    ? { label: "Сообщения", href: "/chats" }
                    : { label: "Сообщения" },
                  ...(activeConversationId != null ? [{ label: "Чат" }] : []),
                ]}
              />
            </div>

            <div className={style.feedSlot}>
              <div className={style.feedHeading}>
                <button
                  type="button"
                  className={style.backBtn}
                  onClick={handleBack}
                  aria-label="Назад"
                >
                  <ArrowLeftIcon />
                </button>
                <h1 className={style.title}>Сообщения</h1>
              </div>
              <div className={style.shellWrap}>
                <ChatsShell activeConversationId={activeConversationId}>
                  {children}
                </ChatsShell>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
};
