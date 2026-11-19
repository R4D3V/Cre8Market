-- Track the last successful sign-in so dormant accounts can be cleaned up.
--
-- The scheduled /api/cleanup-inactive-users job deletes accounts that have not
-- logged in for 4 months (sellers lose their listings too). Existing accounts
-- have no login history, so they get a fresh window starting now instead of
-- being deleted on the first cron run.
--
-- Safe to re-run: the column add and backfill are idempotent.

ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

UPDATE users SET last_login_at = now() WHERE last_login_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users (last_login_at);
