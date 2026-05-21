import type { AttachmentKind } from "../model/types";

export const MAX_CHAT_ATTACHMENTS = 5;
export const MAX_CHAT_ATTACHMENTS_TOTAL_BYTES = 30 * 1024 * 1024;

const MIME_KIND: Record<string, AttachmentKind> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "video/mp4": "video",
  "video/quicktime": "video",
  "video/webm": "video",
  "application/pdf": "document",
  "application/msword": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "document",
  "application/vnd.ms-excel": "document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "document",
};

export const CHAT_ATTACHMENT_ACCEPT = Object.keys(MIME_KIND).join(",");

export function classifyAttachmentMime(mime: string): AttachmentKind | null {
  return MIME_KIND[mime] ?? null;
}
