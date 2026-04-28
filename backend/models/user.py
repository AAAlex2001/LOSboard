from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    advertisements = relationship("Advertisement", back_populates="owner")