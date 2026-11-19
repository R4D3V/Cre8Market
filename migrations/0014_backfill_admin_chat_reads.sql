-- Backfill read markers for the pinned admin thread so messages that existed
-- before per-admin tracking do not all show as unread on first deploy.
--
-- Safe to re-run.
UPDATE conversations c
   SET admin_read_at = (
     SELECT COALESCE(jsonb_object_agg(a.id::text, to_jsonb(now())), '{}'::jsonb)
       FROM admin_users a
   )
 WHERE c.is_internal = true;
