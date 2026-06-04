from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base

if TYPE_CHECKING:
    from models.advertisement import Advertisement


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    slug: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    subcategories: Mapped[list["Subcategory"]] = relationship(
        "Subcategory", back_populates="category"
    )
    advertisements: Mapped[list["Advertisement"]] = relationship(
        "Advertisement", back_populates="category"
    )

    def __str__(self) -> str:
        return f"{self.name}"


class Subcategory(Base):
    __tablename__ = "subcategories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    slug: Mapped[str] = mapped_column(String, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    category_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("categories.id"), nullable=False
    )

    category: Mapped["Category"] = relationship(
        "Category", back_populates="subcategories"
    )
    advertisements: Mapped[list["Advertisement"]] = relationship(
        "Advertisement", back_populates="subcategory"
    )

    def __str__(self) -> str:
        return f"{self.name}"
