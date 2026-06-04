from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class ContentPageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    title: str
    body: str
    updated_at: datetime


class ContentPageListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    title: str


class FooterLinkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    title: str
    url: str
    sort_order: int


class FooterResponse(BaseModel):
    links: List[FooterLinkResponse]


class SiteSettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    brand_title: str
    brand_subtitle: str
    about_title: str
    about_text: str
    socials_title: str
    telegram_url: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    copyright_line: str
