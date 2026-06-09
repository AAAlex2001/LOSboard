from typing import Any, List, Optional

from pydantic import BaseModel, ConfigDict


class AttributeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    key: str
    kind: str
    options: Optional[List[Any]] = None
    is_required: bool
    sort_order: int


class AdvertisementAttributeValuePayload(BaseModel):
    attribute_id: int
    value: str


class AdvertisementAttributeValueResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    attribute_id: int
    value: str
