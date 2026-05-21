"use client";

import { useState } from "react";
import PaperclipIcon from "@/src/shared/ui/Icons/PaperclipIcon";
import SendIcon from "@/src/shared/ui/Icons/SendIcon";
import style from "./ChatComposer.module.scss";

interface ChatComposerProps {
  disabled?: boolean;
  onSend: (text: string) => void | Promise<void>;
}

export const ChatComposer = ({ disabled, onSend }: ChatComposerProps) => {
  const [draft, setDraft] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || disabled) return;
    setDraft("");
    await onSend(text);
  };

  return (
    <form className={style.wrap} onSubmit={handleSubmit}>
      <div className={style.inputBox}>
        <input
          type="text"
          className={style.input}
          placeholder="Type something..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={disabled}
        />
        <div className={style.actions}>
          <button
            type="button"
            className={style.iconBtn}
            aria-label="Прикрепить файл"
            disabled
          >
            <PaperclipIcon />
          </button>
          <span className={style.divider} aria-hidden="true" />
          <button
            type="submit"
            className={style.iconBtn}
            aria-label="Отправить"
            disabled={disabled || !draft.trim()}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </form>
  );
};
