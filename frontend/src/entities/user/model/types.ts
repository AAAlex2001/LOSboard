export interface User {
  id: number;
  email: string;
  name: string;
  phone_number?: string | null;
  avatar_url?: string | null;
}
