import { config } from "@/src/shared/config/config";
import { apiFetch } from "@/src/shared/auth/api-fetch";
import { getAccessToken } from "@/src/shared/auth/auth-storage";
import { readErrorDetail } from "@/src/shared/lib/http";
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
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить чаты"));
  }
  return response.json();
}

export async function getConversation(
  id: number,
  options: { signal?: AbortSignal } = {}
): Promise<ConversationDetail> {
  const response = await apiFetch(`conversations/${id}`, {
    method: "GET",
    signal: options.signal,
  });
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить чат"));
  }
  return response.json();
}

export async function startConversation(
  advertisementId: number,
  text?: string
): Promise<ConversationDetail> {
  const response = await apiFetch("conversations/", {
    method: "POST",
    body: JSON.stringify({ advertisement_id: advertisementId, text: text ?? null }),
  });
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось начать чат"));
  }
  return response.json();
}

export async function getUnreadTotal(
  options: { signal?: AbortSignal } = {}
): Promise<{ count: number }> {
  const response = await apiFetch("conversations/unread/total", {
    method: "GET",
    signal: options.signal,
  });
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось получить счётчик"));
  }
  return response.json();
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
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось отправить сообщение"));
  }
  return response.json();
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
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить файл"));
  }
  return response.json();
}

export async function fetchAttachmentBlob(url: string): Promise<Blob> {
  const path = url.replace(/^\//, "");
  const response = await apiFetch(path, { method: "GET" });
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить вложение"));
  }
  return response.blob();
}

export function buildAttachmentStreamUrl(url: string): string {
  const path = url.replace(/^\//, "");
  const base = `${config.API_BASE_URL}${path}`;
  const token = getAccessToken();
  if (!token) return base;
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}access_token=${encodeURIComponent(token)}`;
}
