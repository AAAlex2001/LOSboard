from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import relationship

from database import Base


COMPLAINT_OPEN = "open"
COMPLAINT_RESOLVED = "resolved"
COMPLAINT_DISMISSED = "dismissed"
COMPLAINT_STATUSES = (COMPLAINT_OPEN, COMPLAINT_RESOLVED, COMPLAINT_DISMISSED)


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    advertisement_id = Column(
        Integer, ForeignKey("advertisements.id", ondelete="CASCADE"), nullable=False
    )
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reason = Column(String, nullable=False)
    comment = Column(String, nullable=True)
    status = Column(
        String,
        nullable=False,
        server_default=COMPLAINT_OPEN,
        default=COMPLAINT_OPEN,
        index=True,
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    advertisement = relationship("Advertisement")
    reporter = relationship("User", foreign_keys=[reporter_id])
    resolved_by = relationship("User", foreign_keys=[resolved_by_id])

    __table_args__ = (
        Index("ix_complaints_status_created", "status", "created_at"),
    )
