export interface Advertisement {
  id: number;
  title: string;
  description: string | null;
  price: number;
  category_id: number;
  subcategory_id: number;
  location: string;
  photo_url: string | null;
  is_active: boolean;
  is_liked: boolean;
  owner_id: number;
}

export interface CreateAdvertisementPayload {
  title: string;
  description?: string;
  price: number;
  category_id: number;
  subcategory_id: number;
  location: string;
  photo_url?: string;
  is_active?: boolean;
}
