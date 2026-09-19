import { Pool, type QueryResult, type QueryResultRow } from "pg";

const globalForPool = globalThis as unknown as { pool: Pool };

const basePool =
  globalForPool.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    // Neon free-tier can take 30-40 s on a cold start; give it enough runway.
    connectionTimeoutMillis: 30000,
    query_timeout: 40000,
    max: 10,
    idleTimeoutMillis: 30000,
  });

basePool.on("error", (err) => {
  // Prevent unhandled errors from crashing the process during connection drops.
  console.error("Unexpected PG pool error:", err.message);
});

// Wrap the pool so every query survives transient connection failures and
// Neon free-tier cold starts (which suspend after inactivity) by retrying.
function isRetryable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("Connection terminated due to connection timeout") ||
    msg.includes("Connection terminated unexpectedly") ||
    msg.includes("timeout expired") ||
    msg.includes("Query read timeout") ||
    msg.includes("read timeout") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ECONNRESET") ||
    msg.includes("server is not accepting connections") ||
    msg.includes("57P03") ||
    msg.includes("connection refused")
  );
}

async function queryWithRetry(
  text: string,
  params?: unknown[],
  retries = 4,
): Promise<QueryResult<QueryResultRow>> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await basePool.query(text, params);
    } catch (err) {
      lastError = err;
      if (!isRetryable(err) || attempt === retries) break;
      // Exponential back-off: 2s, 4s, 8s, 16s — gives Neon time to wake up.
      const delay = 2000 * Math.pow(2, attempt);
      console.warn(`DB query failed (attempt ${attempt + 1}), retrying in ${delay}ms:`, (err as Error).message);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}


export const pool = new Proxy(basePool, {
  get(target, prop, receiver) {
    if (prop === "query") return queryWithRetry;
    const value = Reflect.get(target, prop, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
}) as Pool;

if (process.env.NODE_ENV !== "production") globalForPool.pool = pool;