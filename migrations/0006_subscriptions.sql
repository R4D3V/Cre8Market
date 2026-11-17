-- Subscription plans and user subscriptions.
--
-- These tables existed in lib/db/schema.sql but were never added to the
-- numbered migrations, so a fresh database built with `pnpm migrate` was
-- missing them. This migration closes that gap. Everything is idempotent:
-- existing objects and plan prices are left untouched, only the plan feature
-- descriptions are refreshed so they match the enforced listing/image limits.

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

INSERT INTO subscription_plans (name, price, period, features, highlight, icon, sort_order)
VALUES
  ('Free', 0, 'Free Forever',
   '["Up to 3 active product listings","Up to 3 photos per listing","Direct WhatsApp and phone contact"]'::jsonb,
   false, 'user', 0),
  ('Standard', 10000, '2 Months',
   '["Up to 20 active product listings","Up to 5 photos per listing","Verified seller badge (after verification)","Direct WhatsApp and phone contact"]'::jsonb,
   true, 'star', 1),
  ('Premium', 35000, '2 Months',
   '["Unlimited active product listings","Up to 7 photos per listing","Verified seller badge (after verification)","Featured product opportunities"]'::jsonb,
   false, 'rocket', 2)
ON CONFLICT (name) DO UPDATE SET
  features = EXCLUDED.features,
  updated_at = now();
