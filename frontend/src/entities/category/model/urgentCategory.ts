import type { Category } from "./types";

export const URGENT_CATEGORY_ID = -1;

export const URGENT_CATEGORY: Category = {
  id: URGENT_CATEGORY_ID,
  name: "Срочные",
  slug: "urgent",
  sort_order: -1,
  is_active: true,
  subcategories: [],
};
