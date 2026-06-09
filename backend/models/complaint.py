from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base

if TYPE_CHECKING:
    from models.advertisement import Advertisement
    from models.user import User


COMPLAINT_OPEN = "open"
COMPLAINT_RESOLVED = "resolved"
COMPLAINT_DISMISSED = "dismissed"
COMPLAINT_STATUSES = (COMPLAINT_OPEN, COMPLAINT_RESOLVED, COMPLAINT_DISMISSED)


class Complaint(Base):
    __tablename__ = "complaints"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    advertisement_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("advertisements.id", ondelete="CASCADE"), nullable=False
    )
    reporter_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    reason: Mapped[str] = mapped_column(String, nullable=False)
    comment: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(
        String,
        nullable=False,
        server_default=COMPLAINT_OPEN,
        default=COMPLAINT_OPEN,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    resolved_by_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    advertisement: Mapped["Advertisement"] = relationship("Advertisement")
    reporter: Mapped["User"] = relationship("User", foreign_keys=[reporter_id])
    resolved_by: Mapped[Optional["User"]] = relationship(
        "User", foreign_keys=[resolved_by_id]
    )

    __table_args__ = (
        Index("ix_complaints_status_created", "status", "created_at"),
    )

    def __str__(self) -> str:
        return f"Жалоба #{self.id} (ad {self.advertisement_id}) — {self.reason}"
