from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import relationship

from database import Base


class Conversation(Base):
    """Диалог между покупателем и продавцом по конкретному объявлению.

    Уникальный (advertisement_id, buyer_id) — один и тот же покупатель не может
    создать два диалога по одному объявлению. Продавец денормализован из
    advertisement.owner_id для быстрых выборок «мои чаты».
    """

    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    advertisement_id = Column(Integer, ForeignKey("advertisements.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_message_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    advertisement = relationship("Advertisement")
    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])
    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )

    __table_args__ = (
        UniqueConstraint("advertisement_id", "buyer_id", name="uix_conversation_ad_buyer"),
        Index("ix_conversations_buyer_last", "buyer_id", "last_message_at"),
        Index("ix_conversations_seller_last", "seller_id", "last_message_at"),
    )

    def __str__(self) -> str:
        return f"Диалог #{self.id} (ad {self.advertisement_id})"


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(String, nullable=False, server_default="")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)

    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User")
    attachments = relationship(
        "MessageAttachment",
        back_populates="message",
        cascade="all, delete-orphan",
        order_by="MessageAttachment.id",
    )

    __table_args__ = (
        Index("ix_messages_conversation_created", "conversation_id", "created_at"),
    )

    def __str__(self) -> str:
        preview = (self.text or "").strip()
        if len(preview) > 40:
            preview = preview[:40] + "…"
        return f"Сообщение #{self.id}: {preview or '[вложение]'}"


class MessageAttachment(Base):
    __tablename__ = "message_attachments"

    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(
        Integer, ForeignKey("messages.id", ondelete="CASCADE"), nullable=False
    )
    url = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    kind = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    size_bytes = Column(Integer, nullable=False)

    message = relationship("Message", back_populates="attachments")

    __table_args__ = (
        Index("ix_message_attachments_message", "message_id"),
    )

    def __str__(self) -> str:
        return f"{self.filename} ({self.kind})"
