from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base

if TYPE_CHECKING:
    from models.advertisement import Advertisement
    from models.user import User


class Conversation(Base):
    """Диалог между покупателем и продавцом по конкретному объявлению.

    Уникальный (advertisement_id, buyer_id) — один и тот же покупатель не может
    создать два диалога по одному объявлению. Продавец денормализован из
    advertisement.owner_id для быстрых выборок «мои чаты».
    """

    __tablename__ = "conversations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    advertisement_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("advertisements.id"), nullable=False
    )
    buyer_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    seller_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    last_message_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    advertisement: Mapped["Advertisement"] = relationship("Advertisement")
    buyer: Mapped["User"] = relationship("User", foreign_keys=[buyer_id])
    seller: Mapped["User"] = relationship("User", foreign_keys=[seller_id])
    messages: Mapped[list["Message"]] = relationship(
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

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    conversation_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("conversations.id"), nullable=False
    )
    sender_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    text: Mapped[str] = mapped_column(String, nullable=False, server_default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    conversation: Mapped["Conversation"] = relationship(
        "Conversation", back_populates="messages"
    )
    sender: Mapped["User"] = relationship("User")
    attachments: Mapped[list["MessageAttachment"]] = relationship(
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

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    message_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("messages.id", ondelete="CASCADE"), nullable=False
    )
    url: Mapped[str] = mapped_column(String, nullable=False)
    filename: Mapped[str] = mapped_column(String, nullable=False)
    kind: Mapped[str] = mapped_column(String, nullable=False)
    mime_type: Mapped[str] = mapped_column(String, nullable=False)
    size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)

    message: Mapped["Message"] = relationship("Message", back_populates="attachments")

    __table_args__ = (
        Index("ix_message_attachments_message", "message_id"),
    )

    def __str__(self) -> str:
        return f"{self.filename} ({self.kind})"
