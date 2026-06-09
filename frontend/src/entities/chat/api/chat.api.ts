import { apiFetch } from "@/src/shared/auth/api-fetch";
import { apiJson, readErrorDetail } from "@/src/shared/lib/http";
import type {
  ChatAttachment,
  ChatMessage,
  ConversationDetail,
  ConversationListItem,
} from "../model/types";

export async function getConversations(
  options: { signal?: AbortSignal } = {}
): Promise<ConversationListItem[]> {
  const response = await apiFetch("conversations/", {
    method: "GET",
    signal: options.signal,
  });
  return apiJson<ConversationListItem[]>(response, "Не удалось загрузить чаты");
}

export async function getConversation(
  id: number,
  options: { signal?: AbortSignal } = {}
): Promise<ConversationDetail> {
  const response = await apiFetch(`conversations/${id}`, {
    method: "GET",
    signal: options.signal,
  });
  return apiJson<ConversationDetail>(response, "Не удалось загрузить чат");
}

export async function startConversation(
  advertisementId: number,
  text?: string
): Promise<ConversationDetail> {
  const response = await apiFetch("conversations/", {
    method: "POST",
    body: JSON.stringify({ advertisement_id: advertisementId, text: text ?? null }),
  });
  return apiJson<ConversationDetail>(response, "Не удалось начать чат");
}

export async function getUnreadTotal(
  options: { signal?: AbortSignal } = {}
): Promise<{ count: number }> {
  const response = await apiFetch("conversations/unread/total", {
    method: "GET",
    signal: options.signal,
  });
  return apiJson<{ count: number }>(response, "Не удалось получить счётчик");
}

export async function sendMessage(
  conversationId: number,
  text: string,
  attachments: ChatAttachment[] = []
): Promise<ChatMessage> {
  const response = await apiFetch(`conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ text, attachments }),
  });
  return apiJson<ChatMessage>(response, "Не удалось отправить сообщение");
}

export async function uploadChatAttachment(
  conversationId: number,
  file: File
): Promise<ChatAttachment> {
  const form = new FormData();
  form.append("file", file);
  const response = await apiFetch(
    `conversations/${conversationId}/attachments`,
    { method: "POST", body: form }
  );
  return apiJson<ChatAttachment>(response, "Не удалось загрузить файл");
}

export async function fetchAttachmentBlob(url: string): Promise<Blob> {
  const path = url.replace(/^\//, "");
  const response = await apiFetch(path, { method: "GET" });
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить вложение"));
  }
  return response.blob();
}
