-- Admin-only pinned chat ("CRE8-MARKET") needs its own retention window so
-- internal admin discussions last longer than buyer/seller threads.
--
-- conversations.message_ttl_days controls how long a message in that thread
-- lives before it self-destructs (default 3 days for normal threads). The
-- pinned internal admin chat uses 14 days.
--
-- conversations.is_internal marks the single shared admin thread. A partial
-- unique index guarantees there is never more than one of them, even if every
-- admin's chat panel tries to create it at once.
--
-- The internal thread is not tied to a product, so product_id must be nullable.
--
-- Safe to re-run.

ALTER TABLE conversations ALTER COLUMN product_id DROP NOT NULL;

ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_internal BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS message_ttl_days INTEGER NOT NULL DEFAULT 3;

CREATE UNIQUE INDEX IF NOT EXISTS conversations_internal_unique
  ON conversations (is_internal)
  WHERE is_internal = true;
