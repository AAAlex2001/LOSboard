from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base

if TYPE_CHECKING:
    from models.user import User


class ContentPage(Base):
    __tablename__ = "content_pages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(
        String, nullable=False, unique=True, index=True
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False, default="")
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
    updated_by_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    updated_by: Mapped[Optional["User"]] = relationship(
        "User", foreign_keys=[updated_by_id]
    )

    def __str__(self) -> str:
        return f"{self.title} (/{self.slug})"


class FooterLink(Base):
    __tablename__ = "footer_links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    url: Mapped[str] = mapped_column(String, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    def __str__(self) -> str:
        return f"{self.title} → {self.url}"


class SiteSettings(Base):
    """Глобальные настройки сайта: бренд, описание сервиса, соцсети.

    Хранится в виде одной строки (id=1), редактируется из админки.
    """

    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_title: Mapped[str] = mapped_column(String, nullable=False, default="")
    brand_subtitle: Mapped[str] = mapped_column(String, nullable=False, default="")
    about_title: Mapped[str] = mapped_column(String, nullable=False, default="")
    about_text: Mapped[str] = mapped_column(String, nullable=False, default="")
    socials_title: Mapped[str] = mapped_column(String, nullable=False, default="")
    telegram_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    instagram_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    facebook_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    copyright_line: Mapped[str] = mapped_column(String, nullable=False, default="")
    ad_age_label: Mapped[str] = mapped_column(
        String, nullable=False, default="Реклама 0+"
    )
    ad_site_label: Mapped[str] = mapped_column(
        String, nullable=False, default="Ваш сайт"
    )
    ad_placeholder_text: Mapped[str] = mapped_column(
        String, nullable=False, default="Рекламный баннер сдается"
    )

    def __str__(self) -> str:
        return "Настройки сайта"
