from pydantic import BaseModel
from pydantic import ConfigDict
from typing import List


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    sort_order: int
    is_active: bool
    subcategories: List["SubcategoryResponse"] = []

    model_config = ConfigDict(from_attributes=True)


class SubcategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    category_id: int
    sort_order: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)