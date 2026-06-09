"use client";

import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Loader } from "@/src/shared/ui/Loader";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { RequireAuth } from "@/src/shared/ui/RequireAuth";
import { ChatsShell } from "@/src/widgets/chat/chats-shell";
import { EmptyChatPlaceholder } from "@/src/entities/chat";
import style from "./style.module.scss";

export const ChatsPageView = () => {
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
            { label: "Сообщения" },
          ]}
        />
        <div className={style.content}>
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
        </div>
      </RequireAuth>
      <Footer />
    </main>
  );
};
