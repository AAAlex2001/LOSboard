from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    token_version = Column(Integer, nullable=False, server_default="0", default=0)

    advertisements = relationship("Advertisement", back_populates="owner")
    liked_advertisements = relationship("LikedAdvertisement", back_populates="user", cascade="all, delete-orphan")
    viewed_advertisements = relationship("ViewedAdvertisement", back_populates="user", cascade="all, delete-orphan")