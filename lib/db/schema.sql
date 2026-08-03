-- NeonDB Schema for Cre8Market (no RLS — handled at app level)

-- Registered marketplace users (buyers/sellers who self-register or are added by admin).
-- Distinct from admin_users (site administrators).
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  whatsapp TEXT,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  description TEXT,
  specs JSONB DEFAULT '[]'::jsonb,
  condition TEXT,
  location TEXT DEFAULT 'Entebbe',
  seller JSONB DEFAULT '{}'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  "daysAgo" INTEGER DEFAULT 0,
  "timeAgo" TEXT DEFAULT 'Just now',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL DEFAULT '📦',
  color TEXT NOT NULL DEFAULT '#64748b',
  bg_color TEXT NOT NULL DEFAULT '#f8fafc',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT UNIQUE NOT NULL,
  keys JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Migration: admin profile fields. Safe to re-run.
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- Migration: admin avatar (profile picture shown in the admin dashboard).
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Migration: link products to the registered user who added them.
-- Safe to re-run — only adds the column/index if missing.
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Migration: sellers feature removed — drop the legacy table and its FK column.
ALTER TABLE products DROP COLUMN IF EXISTS seller_id;
DROP TABLE IF EXISTS sellers;

-- Migration: promote a regular user to admin (phone login grants admin role).
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Migration: deal flag for products shown on the /deals page.
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_deal BOOLEAN DEFAULT false;

-- Migration: user avatar (profile picture shown on listings).
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Migration: 4-digit reset pin (hashed) used as 2-step verification to reset a password.
ALTER TABLE users ADD COLUMN IF NOT EXISTS pin_hash TEXT;
