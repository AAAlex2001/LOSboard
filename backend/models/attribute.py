from datetime import datetime
from typing import TYPE_CHECKING, Any, Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    JSON,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base

if TYPE_CHECKING:
    from models.advertisement import Advertisement
    from models.category import Category, Subcategory


ATTRIBUTE_KIND_TEXT = "text"
ATTRIBUTE_KIND_NUMBER = "number"
ATTRIBUTE_KIND_SELECT = "select"
ATTRIBUTE_KIND_BOOLEAN = "boolean"
ATTRIBUTE_KINDS = (
    ATTRIBUTE_KIND_TEXT,
    ATTRIBUTE_KIND_NUMBER,
    ATTRIBUTE_KIND_SELECT,
    ATTRIBUTE_KIND_BOOLEAN,
)


class Attribute(Base):
    __tablename__ = "attributes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    key: Mapped[str] = mapped_column(String, nullable=False)
    kind: Mapped[str] = mapped_column(
        String, nullable=False, default=ATTRIBUTE_KIND_TEXT
    )
    options: Mapped[Optional[list[Any]]] = mapped_column(JSON, nullable=True)
    is_required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    category_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=True
    )
    subcategory_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("subcategories.id", ondelete="CASCADE"), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )

    category: Mapped[Optional["Category"]] = relationship("Category")
    subcategory: Mapped[Optional["Subcategory"]] = relationship("Subcategory")

    __table_args__ = (
        UniqueConstraint(
            "category_id", "subcategory_id", "key",
            name="uq_attribute_scope_key",
        ),
        Index("ix_attributes_category", "category_id"),
        Index("ix_attributes_subcategory", "subcategory_id"),
    )

    def __str__(self) -> str:
        scope = (
            f"подкат. #{self.subcategory_id}"
            if self.subcategory_id
            else f"кат. #{self.category_id}"
            if self.category_id
            else "глобально"
        )
        return f"{self.name} ({self.key}, {scope})"


class AdvertisementAttributeValue(Base):
    __tablename__ = "advertisement_attribute_values"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    advertisement_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("advertisements.id", ondelete="CASCADE"),
        nullable=False,
    )
    attribute_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("attributes.id", ondelete="CASCADE"),
        nullable=False,
    )
    value: Mapped[str] = mapped_column(String, nullable=False)

    advertisement: Mapped["Advertisement"] = relationship(
        "Advertisement", back_populates="attributes"
    )
    attribute: Mapped["Attribute"] = relationship("Attribute")

    __table_args__ = (
        UniqueConstraint(
            "advertisement_id", "attribute_id",
            name="uq_ad_attribute",
        ),
        Index("ix_ad_attr_values_ad", "advertisement_id"),
    )
