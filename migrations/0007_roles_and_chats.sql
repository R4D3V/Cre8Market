-- Three-party model (admin / seller / buyer) plus direct buyer↔seller chat.
--
-- Every existing account becomes a seller: account_type defaults to 'seller',
-- so no data migration is needed for current users. New buyers register into
-- the same `users` table with account_type = 'buyer'.
--
-- Chat messages self-destruct 5 days after they are sent (messages.expires_at).
-- Threads are always about a product: only buyers can start a conversation,
-- sellers and admins reply from their chat panel.
--
-- Safe to re-run: every statement is idempotent.

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

-- One row per (buyer, counterparty, product) so tapping "Message Seller"
-- re-opens the existing thread instead of creating a duplicate.
-- counterparty_role is 'user' (a seller) or 'admin' (admin/store listings).
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  counterparty_role TEXT NOT NULL DEFAULT 'user',
  counterparty_id TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_title TEXT,
  product_slug TEXT,
  product_image TEXT,
  buyer_read_at TIMESTAMPTZ,
  counterparty_read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT conversations_counterparty_role_check
    CHECK (counterparty_role IN ('user', 'admin'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_pair
  ON conversations (buyer_id, counterparty_role, counterparty_id, product_id);

CREATE INDEX IF NOT EXISTS idx_conversations_buyer
  ON conversations (buyer_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_counterparty
  ON conversations (counterparty_role, counterparty_id, last_message_at DESC);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Self-destruct: the row is deleted once this passes, and a thread with no
  -- live messages disappears from every chat panel.
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '5 days'),
  CONSTRAINT messages_sender_role_check CHECK (sender_role IN ('buyer', 'user', 'admin'))
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON messages (conversation_id, created_at);

CREATE INDEX IF NOT EXISTS idx_messages_expires
  ON messages (expires_at);
