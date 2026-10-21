import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  const { rows } = await pool.query("SELECT id, title, is_deal, user_id FROM products WHERE title ILIKE '%esther%' OR (SELECT name FROM users WHERE id=products.user_id) ILIKE '%esther%';");
  console.log(JSON.stringify(rows, null, 2));
} finally { await pool.end(); }
