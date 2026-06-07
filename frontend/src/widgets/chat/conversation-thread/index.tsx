"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/src/shared/ui/Loader";
import {
  ChatThreadHeader,
  MessageDayDivider,
  MessageRow,
  groupMessagesByDay,
} from "@/src/entities/chat";
import { useMeContext } from "@/src/entities/user";
import { useConversationThread } from "@/src/features/chat";
import { ChatComposer } from "@/src/features/chat/composer";
import { useUnreadTotal } from "@/src/entities/chat";
import { buildAdvertisementUrl } from "@/src/shared/lib/slug";
import { useSetChatThreadBreadcrumb } from "@/src/widgets/chat/chats-page-shell/breadcrumb-context";
import style from "./style.module.scss";

interface ConversationThreadProps {
  conversationId: number;
  onClose?: () => void;
}

export const ConversationThread = ({
  conversationId,
  onClose,
}: ConversationThreadProps) => {
  const router = useRouter();
  const { user } = useMeContext();
  const { conversation, loading, sending, error, sendError, send } =
    useConversationThread(conversationId);
  const messagesRef = useRef<HTMLDivElement>(null);
  const { refresh: refreshUnread } = useUnreadTotal();

  useSetChatThreadBreadcrumb(
    conversation?.peer.name ?? conversation?.advertisement.title ?? null
  );

  useEffect(() => {
    const el = messagesRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [conversation?.messages.length]);

  useEffect(() => {
    if (conversation) refreshUnread();
  }, [conversation?.id, refreshUnread]);

  if (loading) {
    return (
      <div className={style.feedback}>
        <Loader />
      </div>
    );
  }
  if (error || !conversation) {
    return <p className={style.feedback}>{error ?? "Чат не найден"}</p>;
  }

  const groups = groupMessagesByDay(conversation.messages);
  const myName = user?.name ?? "Вы";
  const peerName = conversation.peer.name;

  return (
    <div className={style.thread}>
      <ChatThreadHeader
        advertisement={conversation.advertisement}
        price={conversation.advertisement.price}
        onAdClick={() =>
          router.push(
            buildAdvertisementUrl(
              conversation.advertisement.id,
              conversation.advertisement.title
            )
          )
        }
        onClose={onClose}
      />

      <div className={style.messages} ref={messagesRef}>
        {groups.length === 0 ? (
          <p className={style.empty}>Начните диалог — отправьте первое сообщение</p>
        ) : (
          groups.map((group) => (
            <div key={group.key} className={style.dayGroup}>
              <MessageDayDivider label={group.label} />
              {group.messages.map((message, idx) => {
                const mine = user != null && message.sender_id === user.id;
                const next = group.messages[idx + 1];
                const showAvatar = !next || next.sender_id !== message.sender_id;
                return (
                  <MessageRow
                    key={message.id}
                    message={message}
                    authorName={mine ? myName : peerName}
                    authorAvatarUrl={
                      mine
                        ? user?.avatar_url ?? null
                        : conversation.peer.avatar_url
                    }
                    mine={mine}
                    showAvatar={showAvatar}
                  />
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className={style.composerWrap}>
        <ChatComposer
          conversationId={conversationId}
          disabled={sending}
          onSend={send}
        />
        {sendError && <p className={style.sendError}>{sendError}</p>}
      </div>
    </div>
  );
};
