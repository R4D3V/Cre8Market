-- Any signed-in party can start a chat from a listing, not just buyers.
--
-- A conversation now has an explicit initiator and counterparty, each carrying
-- a role: 'buyer', 'user' (seller) or 'admin'. Existing buyer-started threads
-- are backfilled from buyer_id, so nothing is lost.
--
-- buyer_id is kept for the legacy rows but is no longer the thread anchor and
-- becomes nullable: an admin-initiated thread has no buyer row at all.
--
-- Safe to re-run: every statement is idempotent.

ALTER TABLE conversations ADD COLUMN IF NOT EXISTS initiator_role TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS initiator_id TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS initiator_read_at TIMESTAMPTZ;

UPDATE conversations
   SET initiator_role = COALESCE(initiator_role, 'buyer'),
       initiator_id = COALESCE(initiator_id, buyer_id::text),
       initiator_read_at = COALESCE(initiator_read_at, buyer_read_at)
 WHERE initiator_role IS NULL
    OR initiator_id IS NULL;

ALTER TABLE conversations ALTER COLUMN buyer_id DROP NOT NULL;

ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_counterparty_role_check;
ALTER TABLE conversations
  ADD CONSTRAINT conversations_counterparty_role_check
  CHECK (counterparty_role IN ('buyer', 'user', 'admin'));

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'conversations_initiator_role_check'
  ) THEN
    ALTER TABLE conversations
      ADD CONSTRAINT conversations_initiator_role_check
      CHECK (initiator_role IN ('buyer', 'user', 'admin'));
  END IF;
END $$;

ALTER TABLE conversations ALTER COLUMN initiator_role SET NOT NULL;
ALTER TABLE conversations ALTER COLUMN initiator_id SET NOT NULL;

-- One thread per (initiator, counterparty, product). Replaces the old
-- buyer-anchored index, which cannot describe seller- or admin-started chats.
DROP INDEX IF EXISTS idx_conversations_pair;

CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_pair_v2
  ON conversations (initiator_role, initiator_id, counterparty_role, counterparty_id, product_id);

CREATE INDEX IF NOT EXISTS idx_conversations_initiator
  ON conversations (initiator_role, initiator_id, last_message_at DESC);
