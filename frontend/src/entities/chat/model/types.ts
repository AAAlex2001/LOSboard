export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  text: string;
  created_at: string;
  is_read: boolean;
}

export interface ChatPeer {
  id: number;
  name: string;
  avatar_url: string | null;
}

export interface ChatAdvertisement {
  id: number;
  title: string;
  photo_url: string | null;
  price: number | null;
}

export interface ConversationListItem {
  id: number;
  advertisement: ChatAdvertisement;
  peer: ChatPeer;
  last_message_text: string | null;
  last_message_at: string;
  unread_count: number;
}

export interface ConversationDetail {
  id: number;
  advertisement: ChatAdvertisement;
  peer: ChatPeer;
  messages: ChatMessage[];
}
