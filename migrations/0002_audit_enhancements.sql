-- Audit log enhancements: request context columns + query indexes.

ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS ip TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS user_agent TEXT;

CREATE INDEX IF NOT EXISTS audit_log_created_at_idx
  ON audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS audit_log_action_idx
  ON audit_log (action);
CREATE INDEX IF NOT EXISTS audit_log_actor_id_idx
  ON audit_log (actor_id);
CREATE INDEX IF NOT EXISTS audit_log_target_idx
  ON audit_log (target_type, target_id);
