from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class AdvertisementCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    price: int = Field(..., gt=0)
    category_id: int
    subcategory_id: int
    location: str = Field(..., min_length=1, max_length=255)
    photo_url: Optional[str] = Field(None, max_length=255)
    is_active: bool = True


class AdvertisementResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    price: int
    category_id: int
    subcategory_id: int
    location: str
    photo_url: Optional[str]
    is_active: bool
    is_liked: bool = False
    owner_id: int

    model_config = ConfigDict(from_attributes=True)


class AdvertisementUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    price: Optional[int] = Field(None, gt=0)
    category_id: Optional[int] = None
    subcategory_id: Optional[int] = None
    location: Optional[str] = Field(None, min_length=1, max_length=255)
    photo_url: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)