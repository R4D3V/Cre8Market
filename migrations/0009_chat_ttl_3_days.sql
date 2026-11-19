-- Chat messages now self-destruct 3 days after they are sent (was 5 days).
--
-- New messages get expires_at from the app (CHAT_MESSAGE_TTL_DAYS in
-- lib/db/queries.ts). This migration keeps the column default in sync for any
-- insert that omits it, and shortens the window for messages already waiting
-- to expire so the new rule applies immediately instead of only to new chats.
--
-- Safe to re-run: SET DEFAULT is idempotent and the UPDATE matches nothing
-- once every row is already within the 3-day window.

ALTER TABLE messages
  ALTER COLUMN expires_at SET DEFAULT (now() + interval '3 days');

UPDATE messages
   SET expires_at = created_at + interval '3 days'
 WHERE expires_at > created_at + interval '3 days';
