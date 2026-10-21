import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  const { rows } = await pool.query("SELECT id, name FROM users WHERE id='cb767467-b047-46cb-b2b6-7b3c2f7c9bd9';");
  console.log(JSON.stringify(rows, null, 2));
} finally { await pool.end(); }
