import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  await pool.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS video TEXT;");
  console.log("Migration applied: video column ensured.");
} catch (err) {
  console.error("Migration failed:", err);
  process.exit(1);
} finally {
  await pool.end();
}