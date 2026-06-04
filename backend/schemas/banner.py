from typing import Optional

from pydantic import BaseModel, ConfigDict


class BannerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    image_url: str
    link_url: Optional[str] = None
    sort_order: int
