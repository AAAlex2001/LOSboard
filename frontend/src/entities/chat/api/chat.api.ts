import { apiFetch } from "@/src/shared/auth/api-fetch";
import type {
  ChatMessage,
  ConversationDetail,
  ConversationListItem,
} from "../model/types";

async function readErrorDetail(response: Response, fallback: string): Promise<string> {
  const errorData = await response.json().catch(() => ({}));
  const detail = errorData.detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg).join("; ");
  }
  return typeof detail === "string" ? detail : fallback;
}

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
  text: string
): Promise<ChatMessage> {
  const response = await apiFetch(`conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось отправить сообщение"));
  }
  return response.json();
}
