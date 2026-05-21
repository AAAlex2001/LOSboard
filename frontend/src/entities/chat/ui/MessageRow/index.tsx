"use client";

import { UserAvatar } from "@/src/entities/user";
import { formatMessageTime } from "../../lib/formatChatDate";
import type { ChatMessage } from "../../model/types";
import { MessageAttachmentView } from "../MessageAttachmentView";
import style from "./style.module.scss";

interface MessageRowProps {
  message: ChatMessage;
  authorName: string;
  authorAvatarUrl?: string | null;
  mine: boolean;
  showAvatar?: boolean;
}

export const MessageRow = ({
  message,
  authorName,
  authorAvatarUrl,
  mine,
  showAvatar = true,
}: MessageRowProps) => {
  const avatar = showAvatar ? (
    <div className={style.avatar}>
      <UserAvatar size={50} src={authorAvatarUrl ?? undefined} />
    </div>
  ) : (
    <div className={style.avatarSpacer} aria-hidden="true" />
  );

  const hasAttachments =
    Array.isArray(message.attachments) && message.attachments.length > 0;

  return (
    <div className={`${style.row} ${mine ? style.mine : style.theirs}`}>
      {!mine && avatar}

      <div className={style.body}>
        <div className={style.head}>
          <span className={style.name}>{authorName}</span>
          <span className={style.time}>{formatMessageTime(message.created_at)}</span>
        </div>
        {message.text && <p className={style.text}>{message.text}</p>}
        {hasAttachments && (
          <div className={style.attachments}>
            {message.attachments.map((att) => (
              <MessageAttachmentView key={att.url} attachment={att} />
            ))}
          </div>
        )}
      </div>

      {mine && avatar}
    </div>
  );
};
