"use client";

import { UserAvatar } from "@/src/entities/user";
import { formatMessageTime } from "../../lib/formatChatDate";
import type { ChatMessage } from "../../model/types";
import style from "./style.module.scss";

interface MessageRowProps {
  message: ChatMessage;
  authorName: string;
  mine: boolean;
  showAvatar?: boolean;
}

export const MessageRow = ({
  message,
  authorName,
  mine,
  showAvatar = true,
}: MessageRowProps) => {
  const avatar = showAvatar ? (
    <div className={style.avatar}>
      <UserAvatar size={50} />
    </div>
  ) : (
    <div className={style.avatarSpacer} aria-hidden="true" />
  );

  return (
    <div className={`${style.row} ${mine ? style.mine : style.theirs}`}>
      {!mine && avatar}

      <div className={style.body}>
        <div className={style.head}>
          <span className={style.name}>{authorName}</span>
          <span className={style.time}>{formatMessageTime(message.created_at)}</span>
        </div>
        <p className={style.text}>{message.text}</p>
      </div>

      {mine && avatar}
    </div>
  );
};
