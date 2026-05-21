"use client";

import { useRouter } from "next/navigation";
import { Loader } from "@/src/shared/ui/Loader";
import {
  ConversationCard,
  useUnreadTotal,
  type ConversationListItem,
} from "@/src/entities/chat";
import { useConversationList } from "@/src/features/chat";
import style from "./style.module.scss";

interface ConversationListProps {
  activeConversationId?: number | null;
}

export const ConversationList = ({
  activeConversationId = null,
}: ConversationListProps) => {
  const router = useRouter();
  const { items, loading, error, markAsRead } = useConversationList();
  const { decrement } = useUnreadTotal();

  const handleOpen = (conv: ConversationListItem) => {
    if (conv.unread_count > 0) {
      decrement(conv.unread_count);
    }
    markAsRead(conv.id);
    router.push(`/chats/${conv.id}`);
  };

  if (loading) {
    return (
      <div className={style.feedback}>
        <Loader />
      </div>
    );
  }
  if (error) {
    return <p className={style.feedback}>{error}</p>;
  }
  if (items.length === 0) {
    return <p className={style.feedback}>У вас пока нет чатов</p>;
  }

  return (
    <div className={style.list}>
      {items.map((conv) => (
        <ConversationCard
          key={conv.id}
          conversation={conv}
          active={conv.id === activeConversationId}
          onClick={handleOpen}
        />
      ))}
    </div>
  );
};
