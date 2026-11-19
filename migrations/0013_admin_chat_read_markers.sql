-- Per-admin read markers for the shared "CRE8-MARKET" thread.
--
-- Normal threads share one read marker per side (initiator_read_at /
-- counterparty_read_at), which is fine because admins act as a single inbox.
-- The pinned internal thread is different: each admin must see other admins'
-- messages as unread until they open it, so we track a separate read timestamp
-- per admin in this JSONB column (keyed by admin user id).
--
-- Safe to re-run.
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS admin_read_at JSONB NOT NULL DEFAULT '{}'::jsonb;
