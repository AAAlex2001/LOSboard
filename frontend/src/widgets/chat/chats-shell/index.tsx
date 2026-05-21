"use client";

import { ConversationList } from "@/src/widgets/chat/conversation-list";
import style from "./style.module.scss";

interface ChatsShellProps {
  activeConversationId?: number | null;
  children: React.ReactNode;
}

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
