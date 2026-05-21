export interface Advertisement {
  id: number;
  title: string;
  description: string | null;
  price: number;
  category_id: number;
  subcategory_id: number;
  location: string;
  photo_urls: string[];
  is_active: boolean;
  is_liked: boolean;
  is_viewed?: boolean;
  owner_id: number;
  seller_name?: string | null;
  seller_phone?: string | null;
  likes_count?: number;
  views_count?: number;
  created_at?: string | null;
}

export interface CreateAdvertisementPayload {
  title: string;
  description?: string;
  price: number;
  category_id: number;
  subcategory_id: number;
  location: string;
  photo_urls?: string[];
  is_active?: boolean;
}
