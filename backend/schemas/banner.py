from typing import Optional

from pydantic import BaseModel, ConfigDict


class BannerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    age_label: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    link_url: Optional[str] = None
    sort_order: int
    placement: str
    size: str = "rectangle"
