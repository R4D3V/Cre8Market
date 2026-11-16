-- Seller storefront handles: public URLs use /sellers/<handle> instead of the
-- long user UUID. Handles are name-based, with a numeric suffix (-2, -3, …)
-- when two sellers would otherwise share the same name.
--
-- Safe to re-run: existing handles are left untouched and only missing ones are
-- backfilled.

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
