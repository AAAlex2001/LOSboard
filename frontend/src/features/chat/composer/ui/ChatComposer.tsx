"use client";

import { useRef } from "react";
import PaperclipIcon from "@/src/shared/ui/Icons/PaperclipIcon";
import SendIcon from "@/src/shared/ui/Icons/SendIcon";
import CloseIcon from "@/src/shared/ui/Icons/CloseIcon";
import { Loader } from "@/src/shared/ui/Loader";
import {
  CHAT_ATTACHMENT_ACCEPT,
  MAX_CHAT_ATTACHMENTS,
  type ChatAttachment,
} from "@/src/entities/chat";
import { useChatComposer } from "../model/useChatComposer";
import style from "./ChatComposer.module.scss";

interface ChatComposerProps {
  conversationId: number;
  disabled?: boolean;
  onSend: (
    text: string,
    attachments: ChatAttachment[]
  ) => void | Promise<void>;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
};

export const ChatComposer = ({
  conversationId,
  disabled,
  onSend,
}: ChatComposerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, totalBytes, setDraft, addFiles, removeFile, submit } =
    useChatComposer({ conversationId, onSend });

  const busy = disabled || state.uploading;
  const canSubmit =
    !busy && (state.draft.trim().length > 0 || state.files.length > 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    await submit();
  };

  const handlePickClick = () => {
    if (busy) return;
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <form className={style.wrap} onSubmit={handleSubmit}>
      {state.files.length > 0 && (
        <div className={style.previews}>
          {state.files.map((f) => (
            <div key={f.id} className={style.preview}>
              {f.previewUrl ? (
                <img
                  src={f.previewUrl}
                  alt={f.file.name}
                  className={style.previewImg}
                />
              ) : (
                <div className={style.previewDoc}>
                  <PaperclipIcon />
                  <span className={style.previewName}>{f.file.name}</span>
                </div>
              )}
              <span className={style.previewSize}>{formatSize(f.file.size)}</span>
              <button
                type="button"
                className={style.previewRemove}
                onClick={() => removeFile(f.id)}
                aria-label="Удалить файл"
                disabled={busy}
              >
                <CloseIcon />
              </button>
            </div>
          ))}
          <span className={style.totalSize}>
            {state.files.length}/{MAX_CHAT_ATTACHMENTS} ·{" "}
            {formatSize(totalBytes)}/30 МБ
          </span>
        </div>
      )}

      <div className={style.inputBox}>
        <input
          type="text"
          className={style.input}
          placeholder="Напишите сообщение..."
          value={state.draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={busy}
        />
        <div className={style.actions}>
          <button
            type="button"
            className={style.iconBtn}
            aria-label="Прикрепить файл"
            onClick={handlePickClick}
            disabled={busy || state.files.length >= MAX_CHAT_ATTACHMENTS}
          >
            <PaperclipIcon />
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={CHAT_ATTACHMENT_ACCEPT}
            className={style.fileInput}
            onChange={handleInputChange}
          />
          <span className={style.divider} aria-hidden="true" />
          <button
            type="submit"
            className={style.iconBtn}
            aria-label="Отправить"
            disabled={!canSubmit}
          >
            {state.uploading ? <Loader /> : <SendIcon />}
          </button>
        </div>
      </div>

      {state.error && <p className={style.error}>{state.error}</p>}
    </form>
  );
};
