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
  images?: string[];
}

export interface WantedPost {
  id: string;
  slug: string;
  title: string;
  priceMin?: number;
  priceMax?: number;
  exactPrice?: number;
  timeAgo: string;
  contact?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  bgColor: string;
}
