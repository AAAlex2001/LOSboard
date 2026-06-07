"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { type BreadcrumbItem } from "@/src/shared/ui/Breadcrumbs";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { ChatsShell } from "@/src/widgets/chat/chats-shell";
import { ConversationThread } from "@/src/widgets/chat/conversation-thread";
import {
  ChatThreadBreadcrumbProvider,
  useChatThreadBreadcrumbState,
} from "@/src/widgets/chat/chats-page-shell/breadcrumb-context";
import { isAuthenticated as checkAuth } from "@/src/shared/auth/auth-storage";
import style from "./style.module.scss";

export const ChatThreadPageView = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const conversationId = Number(params?.id);
  const [ready, setReady] = useState(false);
  const [threadLabel, setThreadLabel] = useChatThreadBreadcrumbState();

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!Number.isFinite(conversationId)) {
    return (
      <main className={style.page}>
        <Header />
        <div className={style.content}>
          <p className={style.error}>Некорректный идентификатор чата</p>
        </div>
        <Footer />
      </main>
    );
  }

  const items: BreadcrumbItem[] = [
    { label: "Главная", href: "/" },
    { label: "Сообщения", href: "/chats" },
    { label: threadLabel ?? `Диалог #${conversationId}` },
  ];

  return (
    <main className={style.page}>
      <Header />
      {ready && <CrumbsBar items={items} />}
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
                <ChatsShell activeConversationId={conversationId}>
                  <ChatThreadBreadcrumbProvider setLabel={setThreadLabel}>
                    <ConversationThread
                      conversationId={conversationId}
                      onClose={() => router.push("/chats")}
                    />
                  </ChatThreadBreadcrumbProvider>
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
