from datetime import datetime
from typing import TYPE_CHECKING, Optional

import sqlalchemy as sa
from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base

if TYPE_CHECKING:
    from models.attribute import AdvertisementAttributeValue
    from models.category import Category, Subcategory
    from models.user import User


MODERATION_PENDING = "pending"
MODERATION_APPROVED = "approved"
MODERATION_REJECTED = "rejected"
MODERATION_STATUSES = (MODERATION_PENDING, MODERATION_APPROVED, MODERATION_REJECTED)


class Advertisement(Base):
    __tablename__ = "advertisements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    photo_urls: Mapped[list[str]] = mapped_column(
        ARRAY(String), nullable=False, server_default="{}", default=list
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=sa.true(), default=True
    )
    is_urgent: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default="false", default=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True, default=None
    )

    likes_count: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="0", default=0
    )
    views_count: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="0", default=0
    )

    moderation_status: Mapped[str] = mapped_column(
        String,
        nullable=False,
        server_default=MODERATION_PENDING,
        default=MODERATION_PENDING,
        index=True,
    )
    moderation_reason: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    moderated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    moderated_by_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    owner_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    category_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False
    )
    subcategory_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("subcategories.id", ondelete="RESTRICT"), nullable=False
    )

    owner: Mapped["User"] = relationship(
        "User", back_populates="advertisements", foreign_keys=[owner_id]
    )
    moderated_by: Mapped[Optional["User"]] = relationship(
        "User", foreign_keys=[moderated_by_id]
    )
    category: Mapped["Category"] = relationship(
        "Category", back_populates="advertisements"
    )
    subcategory: Mapped["Subcategory"] = relationship(
        "Subcategory", back_populates="advertisements"
    )

    liked_by_users: Mapped[list["LikedAdvertisement"]] = relationship(
        "LikedAdvertisement",
        back_populates="advertisement",
        cascade="all, delete-orphan",
    )
    viewed_by_users: Mapped[list["ViewedAdvertisement"]] = relationship(
        "ViewedAdvertisement",
        back_populates="advertisement",
        cascade="all, delete-orphan",
    )
    attributes: Mapped[list["AdvertisementAttributeValue"]] = relationship(
        "AdvertisementAttributeValue",
        back_populates="advertisement",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __str__(self) -> str:
        return f"#{self.id} {self.title}"


class LikedAdvertisement(Base):
    __tablename__ = "liked_advertisements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    advertisement_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("advertisements.id", ondelete="CASCADE"), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "advertisement_id", name="uix_user_advertisement"),
    )

    user: Mapped["User"] = relationship("User", back_populates="liked_advertisements")
    advertisement: Mapped["Advertisement"] = relationship(
        "Advertisement", back_populates="liked_by_users"
    )

    def __str__(self) -> str:
        return f"Лайк #{self.id} (user {self.user_id} → ad {self.advertisement_id})"


class ViewedAdvertisement(Base):
    __tablename__ = "viewed_advertisements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    advertisement_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("advertisements.id", ondelete="CASCADE"), nullable=False
    )
    viewed_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id", "advertisement_id", name="uix_user_viewed_advertisement"
        ),
    )

    user: Mapped["User"] = relationship("User", back_populates="viewed_advertisements")
    advertisement: Mapped["Advertisement"] = relationship(
        "Advertisement", back_populates="viewed_by_users"
    )

    def __str__(self) -> str:
        return f"Просмотр #{self.id} (user {self.user_id} → ad {self.advertisement_id})"
