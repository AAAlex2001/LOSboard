from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    JSON,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from database import Base


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

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    key = Column(String, nullable=False)
    kind = Column(String, nullable=False, default=ATTRIBUTE_KIND_TEXT)
    options = Column(JSON, nullable=True)
    is_required = Column(Boolean, nullable=False, default=False)
    sort_order = Column(Integer, nullable=False, default=0)

    category_id = Column(
        Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=True
    )
    subcategory_id = Column(
        Integer, ForeignKey("subcategories.id", ondelete="CASCADE"), nullable=True
    )

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    category = relationship("Category")
    subcategory = relationship("Subcategory")

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

    id = Column(Integer, primary_key=True, index=True)
    advertisement_id = Column(
        Integer,
        ForeignKey("advertisements.id", ondelete="CASCADE"),
        nullable=False,
    )
    attribute_id = Column(
        Integer,
        ForeignKey("attributes.id", ondelete="CASCADE"),
        nullable=False,
    )
    value = Column(String, nullable=False)

    advertisement = relationship("Advertisement", back_populates="attributes")
    attribute = relationship("Attribute")

    __table_args__ = (
        UniqueConstraint(
            "advertisement_id", "attribute_id",
            name="uq_ad_attribute",
        ),
        Index("ix_ad_attr_values_ad", "advertisement_id"),
    )
