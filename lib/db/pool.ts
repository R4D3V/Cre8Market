import { Pool } from "pg";

const globalForPool = globalThis as unknown as { pool: Pool };

export const pool =
  globalForPool.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    query_timeout: 15000,
  });

if (process.env.NODE_ENV !== "production") globalForPool.pool = pool;
