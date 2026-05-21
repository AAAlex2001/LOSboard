from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class AttachmentMeta(BaseModel):
    url: str
    filename: str
    kind: str
    mime_type: str
    size_bytes: int

    model_config = ConfigDict(from_attributes=True)


class StartConversationRequest(BaseModel):
    advertisement_id: int
    text: Optional[str] = Field(None, max_length=2000)


class SendMessageRequest(BaseModel):
    text: str = Field("", max_length=2000)
    attachments: List[AttachmentMeta] = Field(default_factory=list)


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    text: str
    created_at: datetime
    is_read: bool
    attachments: List[AttachmentMeta] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class ConversationPeer(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None


class ConversationAdvertisement(BaseModel):
    id: int
    title: str
    photo_url: Optional[str] = None
    price: Optional[int] = None


class ConversationListItem(BaseModel):
    id: int
    advertisement: ConversationAdvertisement
    peer: ConversationPeer
    last_message_text: Optional[str] = None
    last_message_at: datetime
    unread_count: int = 0


class ConversationDetail(BaseModel):
    id: int
    advertisement: ConversationAdvertisement
    peer: ConversationPeer
    messages: List[MessageResponse]


class UnreadTotalResponse(BaseModel):
    count: int
