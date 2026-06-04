from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from database import Base


MODERATION_PENDING = "pending"
MODERATION_APPROVED = "approved"
MODERATION_REJECTED = "rejected"
MODERATION_STATUSES = (MODERATION_PENDING, MODERATION_APPROVED, MODERATION_REJECTED)


class Advertisement(Base):
    __tablename__ = "advertisements"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    photo_urls = Column(ARRAY(String), nullable=False, server_default="{}")
    is_active = Column(Boolean, default=True)
    is_urgent = Column(Boolean, nullable=False, server_default="false", default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    likes_count = Column(Integer, nullable=False, server_default="0", default=0)
    views_count = Column(Integer, nullable=False, server_default="0", default=0)

    moderation_status = Column(
        String,
        nullable=False,
        server_default=MODERATION_PENDING,
        default=MODERATION_PENDING,
        index=True,
    )
    moderation_reason = Column(String, nullable=True)
    moderated_at = Column(DateTime, nullable=True)
    moderated_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"), nullable=False)

    owner = relationship(
        "User", back_populates="advertisements", foreign_keys=[owner_id]
    )
    moderated_by = relationship("User", foreign_keys=[moderated_by_id])
    category = relationship("Category", back_populates="advertisements")
    subcategory = relationship("Subcategory", back_populates="advertisements")

    liked_by_users = relationship(
        "LikedAdvertisement",
        back_populates="advertisement",
        cascade="all, delete-orphan",
    )
    viewed_by_users = relationship(
        "ViewedAdvertisement",
        back_populates="advertisement",
        cascade="all, delete-orphan",
    )
    attributes = relationship(
        "AdvertisementAttributeValue",
        back_populates="advertisement",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __str__(self) -> str:
        return f"#{self.id} {self.title}"


class LikedAdvertisement(Base):
    __tablename__ = "liked_advertisements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    advertisement_id = Column(Integer, ForeignKey("advertisements.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "advertisement_id", name="uix_user_advertisement"),
    )

    user = relationship("User", back_populates="liked_advertisements")
    advertisement = relationship("Advertisement", back_populates="liked_by_users")

    def __str__(self) -> str:
        return f"Лайк #{self.id} (user {self.user_id} → ad {self.advertisement_id})"


class ViewedAdvertisement(Base):
    __tablename__ = "viewed_advertisements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    advertisement_id = Column(Integer, ForeignKey("advertisements.id"), nullable=False)
    viewed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "user_id", "advertisement_id", name="uix_user_viewed_advertisement"
        ),
    )

    user = relationship("User", back_populates="viewed_advertisements")
    advertisement = relationship("Advertisement", back_populates="viewed_by_users")

    def __str__(self) -> str:
        return f"Просмотр #{self.id} (user {self.user_id} → ad {self.advertisement_id})"
