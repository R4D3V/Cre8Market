import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  const { rowCount } = await pool.query("UPDATE products SET is_deal=true WHERE id='a44a0c95-504e-4581-aa7b-8582224d7fa4';");
  console.log("Updated rows:", rowCount);
} finally { await pool.end(); }
