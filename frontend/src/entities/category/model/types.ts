export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  sort_order: number;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  subcategories: Subcategory[];
}
