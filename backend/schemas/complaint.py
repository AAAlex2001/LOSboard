from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


COMPLAINT_REASONS = (
    "spam",
    "wrong_category",
    "forbidden",
    "fraud",
    "offensive",
    "other",
)


class ComplaintCreate(BaseModel):
    reason: str = Field(..., min_length=1, max_length=64)
    comment: Optional[str] = Field(None, max_length=1000)


class ComplaintResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    advertisement_id: int
    reason: str
    comment: Optional[str]
    status: str
    created_at: datetime
