-- NeonDB Schema for Cre8Market (no RLS — handled at app level)

-- Registered marketplace users (buyers/sellers who self-register or are added by admin).
-- Distinct from admin_users (site administrators).
-- account_type splits the marketplace into the three parties: 'seller' (posts
-- listings) and 'buyer' (browses and messages sellers). Admins live in
-- admin_users. Existing rows default to 'seller'.
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  whatsapp TEXT,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_admin BOOLEAN DEFAULT false,
  account_type TEXT NOT NULL DEFAULT 'seller',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT users_account_type_check CHECK (account_type IN ('seller', 'buyer'))
);

-- Existing databases: add the column without the constraint from CREATE TABLE.
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_type TEXT NOT NULL DEFAULT 'seller';
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_account_type_check'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_account_type_check
      CHECK (account_type IN ('seller', 'buyer'));
  END IF;
END $$;

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

-- Two-level taxonomy: parent_id is NULL for a top-level group and points at the
-- group for a subcategory. See migrations/0016_category_hierarchy.sql.
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL DEFAULT '📦',
  color TEXT NOT NULL DEFAULT '#64748b',
  bg_color TEXT NOT NULL DEFAULT '#f8fafc',
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id TEXT,
  actor_role TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feature_flags (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
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

-- Migration: admin store banner (shown on the public /sellers/store page).
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS banner TEXT;

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
ALTER TABLE products ADD COLUMN IF NOT EXISTS video TEXT;

-- Migration: name-based seller storefront handles (/sellers/<handle>).
ALTER TABLE users ADD COLUMN IF NOT EXISTS handle TEXT;

DO $$
DECLARE
  seller RECORD;
  base TEXT;
  candidate TEXT;
  suffix INTEGER;
BEGIN
  FOR seller IN
    SELECT id, name
    FROM users
    WHERE handle IS NULL OR handle = ''
    ORDER BY created_at, id
  LOOP
    base := COALESCE(
      NULLIF(
        trim(both '-' from regexp_replace(lower(seller.name), '[^a-z0-9]+', '-', 'g')),
        ''
      ),
      'seller'
    );

    candidate := base;
    suffix := 1;

    WHILE EXISTS (
      SELECT 1 FROM users WHERE handle = candidate AND id <> seller.id
    ) LOOP
      suffix := suffix + 1;
      candidate := base || '-' || suffix;
    END LOOP;

    UPDATE users SET handle = candidate WHERE id = seller.id;
  END LOOP;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_handle ON users(handle);

-- ── Subscription plans ──
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT 'Free Forever',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlight BOOLEAN NOT NULL DEFAULT false,
  icon TEXT NOT NULL DEFAULT 'user',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migration: user avatar (profile picture shown on listings).
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Migration: last successful sign-in, used by the dormant-account cleanup cron.
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users (last_login_at);

-- Migration: 4-digit reset pin (hashed) used as 2-step verification to reset a password.
ALTER TABLE users ADD COLUMN IF NOT EXISTS pin_hash TEXT;

-- Migration: seller verification — admins mark a user verified so a badge shows on their listings.
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Migration: profile banner image shown on the seller's storefront page.
ALTER TABLE users ADD COLUMN IF NOT EXISTS banner TEXT;

-- Migration: VIP sellers can post unlimited listings.
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT false;

-- ── better-auth tables (required for login / sessions) ──
-- These mirror the accounts in `users` / `admin_users`. Safe to re-run.
CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" BOOLEAN DEFAULT false,
  image TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  phone TEXT,
  whatsapp TEXT,
  role TEXT
);

CREATE TABLE IF NOT EXISTS "account" (
  id TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMPTZ,
  "refreshTokenExpiresAt" TIMESTAMPTZ,
  scope TEXT,
  password TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "session" (
  id TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  token TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "verification" (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- ── Direct chat (any party ⇄ seller/admin, always about a product) ──
-- Either side can start a thread from a listing; the other side replies from
-- their own chat panel. buyer_id is legacy (buyer-started threads) and nullable.

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  initiator_role TEXT NOT NULL DEFAULT 'buyer',
  initiator_id TEXT NOT NULL,
  counterparty_role TEXT NOT NULL DEFAULT 'user',
  counterparty_id TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_title TEXT,
  product_slug TEXT,
  product_image TEXT,
  buyer_read_at TIMESTAMPTZ,
  initiator_read_at TIMESTAMPTZ,
  counterparty_read_at TIMESTAMPTZ,
  admin_read_at JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT conversations_initiator_role_check
    CHECK (initiator_role IN ('buyer', 'user', 'admin')),
  CONSTRAINT conversations_counterparty_role_check
    CHECK (counterparty_role IN ('buyer', 'user', 'admin'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_pair_v2
  ON conversations (initiator_role, initiator_id, counterparty_role, counterparty_id, product_id);

CREATE INDEX IF NOT EXISTS idx_conversations_buyer
  ON conversations (buyer_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_initiator
  ON conversations (initiator_role, initiator_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_counterparty
  ON conversations (counterparty_role, counterparty_id, last_message_at DESC);

-- Migration: admin-only pinned chat (CRE8-MARKET) with 2-week retention.
ALTER TABLE conversations ALTER COLUMN product_id DROP NOT NULL;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_internal BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS admin_read_at JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Messages self-destruct 3 days after they are sent.
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '3 days'),
  CONSTRAINT messages_sender_role_check CHECK (sender_role IN ('buyer', 'user', 'admin'))
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON messages (conversation_id, created_at);

CREATE INDEX IF NOT EXISTS idx_messages_expires
  ON messages (expires_at);
