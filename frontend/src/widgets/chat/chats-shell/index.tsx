"use client";

import { ConversationList } from "@/src/widgets/chat/conversation-list";
import style from "./style.module.scss";

interface ChatsShellProps {
  activeConversationId?: number | null;
  children: React.ReactNode;
}

/**
 * Общий каркас для страниц чатов:
 *  - на мобильном (<768) показывает или сайдбар, или main (тред/заглушку) — управляется
 *    тем, выбран ли активный диалог;
 *  - на 768+ показывает split-view: список слева + main справа.
 *
 * Хранилище состояния — URL: /chats — без выбранного, /chats/[id] — выбран.
 */
export const ChatsShell = ({
  activeConversationId = null,
  children,
}: ChatsShellProps) => {
  const hasActive = activeConversationId != null;

  return (
    <div
      className={style.shell}
      data-has-active={hasActive ? "true" : "false"}
    >
      <aside className={style.sidebar}>
        <ConversationList activeConversationId={activeConversationId} />
      </aside>
      <section className={style.main}>{children}</section>
    </div>
  );
};
