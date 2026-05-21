"use client";

import { useReducer } from "react";
import {
  MAX_CHAT_ATTACHMENTS,
  MAX_CHAT_ATTACHMENTS_TOTAL_BYTES,
  classifyAttachmentMime,
  uploadChatAttachment,
  type ChatAttachment,
} from "@/src/entities/chat";
import {
  chatComposerReducer,
  initialChatComposerState,
} from "./chatComposerReducer";
import type { PendingFile } from "./types";

interface UseChatComposerParams {
  conversationId: number;
  onSend: (
    text: string,
    attachments: ChatAttachment[]
  ) => void | Promise<void>;
}

export function useChatComposer({
  conversationId,
  onSend,
}: UseChatComposerParams) {
  const [state, dispatch] = useReducer(
    chatComposerReducer,
    initialChatComposerState
  );

  const totalBytes = state.files.reduce(
    (sum: number, f: PendingFile) => sum + f.file.size,
    0
  );

  const setDraft = (value: string) =>
    dispatch({ type: "SET_DRAFT", payload: value });

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const accepted: PendingFile[] = [];

    for (const file of Array.from(incoming)) {
      if (!classifyAttachmentMime(file.type)) {
        dispatch({
          type: "SET_ERROR",
          payload: `Файл «${file.name}» имеет неподдерживаемый формат`,
        });
        continue;
      }
      const id = `${file.name}-${file.size}-${file.lastModified}`;
      if (state.files.some((f: PendingFile) => f.id === id)) continue;
      accepted.push({
        id,
        file,
        previewUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      });
    }
    if (accepted.length === 0) return;

    const combined = [...state.files, ...accepted];
    if (combined.length > MAX_CHAT_ATTACHMENTS) {
      accepted.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
      dispatch({
        type: "SET_ERROR",
        payload: `Можно прикрепить максимум ${MAX_CHAT_ATTACHMENTS} файлов`,
      });
      return;
    }
    const combinedBytes = combined.reduce(
      (sum: number, f: PendingFile) => sum + f.file.size,
      0
    );
    if (combinedBytes > MAX_CHAT_ATTACHMENTS_TOTAL_BYTES) {
      accepted.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
      dispatch({
        type: "SET_ERROR",
        payload: "Суммарный размер вложений превышает 30 МБ",
      });
      return;
    }

    dispatch({ type: "ADD_FILES", payload: accepted });
  };

  const removeFile = (id: string) => {
    const target = state.files.find((f: PendingFile) => f.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    dispatch({ type: "REMOVE_FILE", payload: id });
  };

  const submit = async () => {
    if (state.uploading) return;
    const text = state.draft.trim();
    if (!text && state.files.length === 0) return;

    const snapshot = state.files;
    dispatch({ type: "UPLOAD_START" });

    try {
      const uploaded: ChatAttachment[] = [];
      for (const pending of snapshot) {
        const meta = await uploadChatAttachment(conversationId, pending.file);
        uploaded.push(meta);
      }
      snapshot.forEach(
        (f: PendingFile) => f.previewUrl && URL.revokeObjectURL(f.previewUrl)
      );
      dispatch({ type: "RESET" });
      await onSend(text, uploaded);
    } catch (err: unknown) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : String(err),
      });
    } finally {
      dispatch({ type: "UPLOAD_END" });
    }
  };

  return {
    state,
    totalBytes,
    setDraft,
    addFiles,
    removeFile,
    submit,
  };
}
