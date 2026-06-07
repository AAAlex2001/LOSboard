"use client";

import { UserAvatar } from "@/src/entities/user";
import { resolveAssetUrl } from "@/src/shared/lib/asset-url";
import type { ConversationListItem } from "../../model/types";
import { formatChatDate } from "../../lib/formatChatDate";
import style from "./style.module.scss";

interface ConversationCardProps {
  conversation: ConversationListItem;
  active?: boolean;
  onClick?: (conversation: ConversationListItem) => void;
}

export const ConversationCard = ({
  conversation,
  active,
  onClick,
}: ConversationCardProps) => {
  const { advertisement, peer, last_message_text, last_message_at, unread_count } =
    conversation;
  const adPhoto = resolveAssetUrl(advertisement.photo_url);

  return (
    <button
      type="button"
      className={`${style.card} ${active ? style.cardActive : ""}`}
      onClick={() => onClick?.(conversation)}
    >
      <div className={style.image}>
        {adPhoto ? (
          <img
            src={adPhoto}
            alt={advertisement.title}
            className={style.imageImg}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={style.imagePlaceholder} />
        )}
      </div>

      <div className={style.message}>
        <div className={style.headerRow}>
          <div className={style.peer}>
            <UserAvatar size={20} src={peer.avatar_url ?? undefined} />
            <span className={style.peerName}>{peer.name}</span>
          </div>
          <span className={style.date}>{formatChatDate(last_message_at)}</span>
        </div>

        <div className={style.adRow}>
          <span className={style.adTitle}>{advertisement.title}</span>
        </div>

        <div className={style.lastRow}>
          <span className={style.lastMessage}>
            {last_message_text ?? "Нет сообщений"}
          </span>
          {unread_count > 0 && (
            <span className={style.unread} aria-label={`Непрочитанных: ${unread_count}`}>
              {unread_count > 99 ? "99+" : unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};
