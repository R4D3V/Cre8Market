// Public storefront URLs use the seller's name instead of their database UUID.
// The same rules are used when backfilling `users.handle` in
// migrations/0005_seller_handles.sql, so keep the two in sync.
export function sellerHandle(name: string | null | undefined): string {
  const handle = (name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return handle || "seller";
}

// The CRE8MARKET store is not a real user row, so it keeps its own URL.
export function sellerPath(user: {
  id?: string | null;
  name?: string | null;
  handle?: string | null;
}): string {
  if (user.id === "store") return "/sellers/store";
  if (user.handle) return `/sellers/${user.handle}`;
  return `/sellers/${sellerHandle(user.name)}`;
}
