from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship

from database import Base


USER_ROLE = "user"
MODERATOR_ROLE = "moderator"
ADMIN_ROLE = "admin"
ALLOWED_ROLES = (USER_ROLE, MODERATOR_ROLE, ADMIN_ROLE)
STAFF_ROLES = (MODERATOR_ROLE, ADMIN_ROLE)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    role = Column(String, nullable=False, server_default=USER_ROLE, default=USER_ROLE)
    banned_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    token_version = Column(Integer, nullable=False, server_default="0", default=0)

    advertisements = relationship(
        "Advertisement",
        back_populates="owner",
        foreign_keys="Advertisement.owner_id",
    )
    liked_advertisements = relationship(
        "LikedAdvertisement", back_populates="user", cascade="all, delete-orphan"
    )
    viewed_advertisements = relationship(
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
