export interface Seller {
  name: string;
  phone: string;
  whatsapp: string;
  verified?: boolean;
  memberSince?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  categorySlug: string;
  featured: boolean;
  isDeal?: boolean;
  daysAgo: number;
  timeAgo: string;
  description?: string;
  specs?: { label: string; value: string }[];
  condition?:
    | "New"
    | "Like New"
    | "Used - Good"
    | "Used - Fair"
    | "Refurbished";
  location?: string;
  seller?: Seller;
  user_id?: string | null;
  images?: string[];
  ownerName?: string | null;
  ownerPhone?: string | null;
  ownerWhatsapp?: string | null;
  ownerAvatar?: string | null;
  categoryIcon?: string;
  categoryColor?: string;
  categoryBg?: string;
}

// A product joined with the registered user who added it (used in the admin dashboard
// so products can be grouped/sorted by the user that created them).
export interface ProductWithOwner extends Product {
  ownerName: string | null;
  ownerPhone: string | null;
  ownerWhatsapp: string | null;
  ownerType: "user" | "admin";
}

// Registered marketplace user (distinct from admin_users).
export interface AppUser {
  id: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  avatar?: string | null;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  productCount?: number;
}

export interface CategoryDB {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  bg_color: string;
  created_at: string;
}
