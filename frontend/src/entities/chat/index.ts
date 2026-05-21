export type {
  ChatMessage,
  ChatPeer,
  ChatAdvertisement,
  ConversationListItem,
  ConversationDetail,
} from "./model/types";

export {
  getConversations,
  getConversation,
  startConversation,
  sendMessage,
  getUnreadTotal,
} from "./api/chat.api";

export { UnreadProvider, useUnreadTotal } from "./model/UnreadContext";

export { ConversationCard } from "./ui/ConversationCard";
export { ChatThreadHeader } from "./ui/ChatThreadHeader";
export { MessageRow } from "./ui/MessageRow";
export { MessageDayDivider } from "./ui/MessageDayDivider";
export { EmptyChatPlaceholder } from "./ui/EmptyChatPlaceholder";

export {
  groupMessagesByDay,
  type MessageDayGroup,
} from "./lib/groupMessagesByDay";
export { formatChatDate, formatMessageTime } from "./lib/formatChatDate";
