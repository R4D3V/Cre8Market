interface Seller {
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
  createdAt?: string;
  description?: string;
  specs?: { label: string; value: string }[];
  condition?: "New" | "Used" | "Refurbished" | "Like New" | "Used - Good" | "Used - Fair";
  location?: string;
  seller?: Seller;
  user_id?: string | null;
  images?: string[];
  video?: string | null;
  ownerName?: string | null;
  ownerHandle?: string | null;
  ownerPhone?: string | null;
  ownerWhatsapp?: string | null;
  ownerAvatar?: string | null;
  ownerVerified?: boolean | null;
  ownerVip?: boolean | null;
  categoryIcon?: string;
  categoryColor?: string;
  categoryBg?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  highlight: boolean;
  icon: "user" | "star" | "rocket";
  sortOrder: number;
  active: boolean;
  createdAt?: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  planName?: string;
  startedAt: string;
  expiresAt: string | null;
  status: "active" | "expired" | "cancelled";
  createdAt?: string;
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
// `accountType` is what separates the three parties: 'seller' posts listings,
// 'buyer' browses and messages sellers. Admins are in admin_users.
type AccountType = "seller" | "buyer";

// Role as it appears on the session: 'admin' | seller ('user') | 'buyer'.
export type PartyRole = "admin" | "user" | "buyer";

export interface AppUser {
  id: string;
  name: string;
  handle?: string | null;
  phone: string;
  whatsapp: string | null;
  avatar?: string | null;
  banner?: string | null;
  isActive: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  isVip?: boolean;
  hasPin?: boolean;
  accountType?: AccountType;
  createdAt: string;
  productCount?: number;
}

// ── Direct chat ──

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderRole: PartyRole;
  senderId: string;
  /** Display name of the sender, resolved from users/admin_users. */
  senderName?: string | null;
  /** Avatar URL/data-URL of the sender. */
  senderAvatar?: string | null;
  body: string;
  createdAt: string;
  /** Self-destruct: the row is deleted once this passes. */
  expiresAt: string;
}

export interface ChatConversation {
  id: string;
  /** Buyer's name when viewed by a seller/admin, seller/admin's name for a buyer. */
  counterpartName: string;
  counterpartAvatar: string | null;
  counterpartRole: PartyRole;
  productId: string | null;
  productTitle: string | null;
  productSlug: string | null;
  productImage: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  lastSenderRole: PartyRole | null;
  unreadCount: number;
  messageCount?: number;
  createdAt: string;
  isInternal?: boolean;
}

export interface CategoryDB {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  bg_color: string;
  /** NULL for a top-level group; otherwise the id of the parent group. */
  parent_id: string | null;
  created_at: string;
}
