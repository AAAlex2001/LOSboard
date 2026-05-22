from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional


class AdvertisementCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    price: int = Field(..., gt=0)
    category_id: int
    subcategory_id: int
    location: str = Field(..., min_length=1, max_length=255)
    photo_urls: List[str] = Field(default_factory=list)
    is_active: bool = True
    is_urgent: bool = False


class AdvertisementResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    price: int
    category_id: int
    subcategory_id: int
    location: str
    photo_urls: List[str] = Field(default_factory=list)
    is_active: bool
    is_urgent: bool = False
    is_liked: bool = False
    is_viewed: bool = False
    owner_id: int
    seller_name: Optional[str] = None
    seller_phone: Optional[str] = None
    likes_count: int = 0
    views_count: int = 0
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AdvertisementUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    price: Optional[int] = Field(None, gt=0)
    category_id: Optional[int] = None
    subcategory_id: Optional[int] = None
    location: Optional[str] = Field(None, min_length=1, max_length=255)
    photo_urls: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_urgent: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)
