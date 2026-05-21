export type {
  ChatMessage,
  ChatPeer,
  ChatAdvertisement,
  ChatAttachment,
  AttachmentKind,
  ConversationListItem,
  ConversationDetail,
} from "./model/types";

export {
  getConversations,
  getConversation,
  startConversation,
  sendMessage,
  getUnreadTotal,
  uploadChatAttachment,
  fetchAttachmentBlob,
  buildAttachmentStreamUrl,
} from "./api/chat.api";

export {
  MAX_CHAT_ATTACHMENTS,
  MAX_CHAT_ATTACHMENTS_TOTAL_BYTES,
  CHAT_ATTACHMENT_ACCEPT,
  classifyAttachmentMime,
} from "./lib/attachmentLimits";

export { UnreadProvider, useUnreadTotal } from "./model/UnreadContext";
export { useSecureAsset } from "./model/useSecureAsset";

export { ConversationCard } from "./ui/ConversationCard";
export { ChatThreadHeader } from "./ui/ChatThreadHeader";
export { MessageRow } from "./ui/MessageRow";
export { MessageAttachmentView } from "./ui/MessageAttachmentView";
export { MessageDayDivider } from "./ui/MessageDayDivider";
export { EmptyChatPlaceholder } from "./ui/EmptyChatPlaceholder";

export {
  groupMessagesByDay,
  type MessageDayGroup,
} from "./lib/groupMessagesByDay";
export { formatChatDate, formatMessageTime } from "./lib/formatChatDate";
