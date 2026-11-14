import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  await pool.query(`
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

    CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
  `);
  console.log("Migration applied: subscription tables ensured.");
} catch (err) {
  console.error("Migration failed:", err);
  process.exit(1);
} finally {
  await pool.end();
}