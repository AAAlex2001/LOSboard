from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, UniqueConstraint, DateTime
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from database import Base


class Advertisement(Base):
    __tablename__ = "advertisements"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    photo_urls = Column(ARRAY(String), nullable=False, server_default="{}")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"), nullable=False)

    owner = relationship("User", back_populates="advertisements")
    category = relationship("Category", back_populates="advertisements")
    subcategory = relationship("Subcategory", back_populates="advertisements")

    liked_by_users = relationship("LikedAdvertisement", back_populates="advertisement", cascade="all, delete-orphan")

class LikedAdvertisement(Base):
    __tablename__ = "liked_advertisements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    advertisement_id = Column(Integer, ForeignKey("advertisements.id"), nullable=False)

    __table_args__ = (UniqueConstraint('user_id', 'advertisement_id', name='uix_user_advertisement'),)

    user = relationship("User", back_populates="liked_advertisements")
    advertisement = relationship("Advertisement", back_populates="liked_by_users")    