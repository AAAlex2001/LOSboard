from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base

if TYPE_CHECKING:
    from models.advertisement import (
        Advertisement,
        LikedAdvertisement,
        ViewedAdvertisement,
    )


USER_ROLE = "user"
MODERATOR_ROLE = "moderator"
ADMIN_ROLE = "admin"
ALLOWED_ROLES = (USER_ROLE, MODERATOR_ROLE, ADMIN_ROLE)
STAFF_ROLES = (MODERATOR_ROLE, ADMIN_ROLE)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    phone_number: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    role: Mapped[str] = mapped_column(
        String, nullable=False, server_default=USER_ROLE, default=USER_ROLE
    )
    banned_until: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )
    token_version: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="0", default=0
    )

    advertisements: Mapped[list["Advertisement"]] = relationship(
        "Advertisement",
        back_populates="owner",
        foreign_keys="Advertisement.owner_id",
    )
    liked_advertisements: Mapped[list["LikedAdvertisement"]] = relationship(
        "LikedAdvertisement", back_populates="user", cascade="all, delete-orphan"
    )
    viewed_advertisements: Mapped[list["ViewedAdvertisement"]] = relationship(
        "ViewedAdvertisement", back_populates="user", cascade="all, delete-orphan"
    )

    @property
    def is_admin(self) -> bool:
        return self.role == ADMIN_ROLE

    @property
    def is_staff(self) -> bool:
        return self.role in STAFF_ROLES

    @property
    def is_banned(self) -> bool:
        if self.banned_until is None:
            return False
        return self.banned_until > datetime.utcnow()

    def __str__(self) -> str:
        return f"#{self.id} {self.name} ({self.email})"
