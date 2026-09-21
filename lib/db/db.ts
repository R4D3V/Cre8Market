import { Kysely, PostgresDialect } from "kysely";
import { pool } from "./pool";

export interface Database {
  users: {
    id: string;
    name: string;
    phone: string;
    whatsapp: string | null;
    password_hash: string;
    pin_hash: string | null;
    avatar: string | null;
    is_active: boolean | null;
    is_admin: boolean | null;
    is_verified: boolean | null;
    created_at: string | null;
  };
  products: {
    id: string;
    slug: string;
    title: string;
    price: string | number;
    category: string;
    category_slug: string;
    featured: boolean | null;
    is_deal: boolean | null;
    description: string | null;
    specs: unknown;
    condition: string | null;
    location: string | null;
    seller: unknown;
    images: unknown;
    daysAgo: number | null;
    timeAgo: string | null;
    user_id: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  categories: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
    bg_color: string | null;
    created_at: string | null;
  };
  push_subscriptions: {
    id: string;
    endpoint: string;
    keys: unknown;
    created_at: string | null;
  };
  admin_users: {
    id: string;
    email: string;
    password_hash: string;
    name: string | null;
    phone: string | null;
    whatsapp: string | null;
    avatar: string | null;
    created_at: string | null;
  };
}

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
});
