import { sellerHandle } from "../seller-handle";
import type {
  AppUser,
  CategoryDB,
  ChatConversation,
  ChatMessage,
  Product,
  ProductWithOwner,
  SubscriptionPlan,
  UserSubscription,
} from "../types";
import { pool } from "./pool";

export interface PushSubscriptionRow {
  id: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  created_at: string;
}

export interface AdminUserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  phone: string | null;
  whatsapp: string | null;
  avatar: string | null;
  banner: string | null;
  created_at: string;
}

// ── Products ──

const PRODUCT_SELECT = `
  SELECT p.*, c.icon AS category_icon, c.color AS category_color, c.bg_color AS category_bg
  FROM products p
  LEFT JOIN categories c ON c.slug = p.category_slug
`;

export async function getProducts(): Promise<Product[]> {
  const { rows } = await pool.query(`${PRODUCT_SELECT} ORDER BY p.created_at DESC`);
  return rows.map(mapProduct);
}

export interface ProductsPageParams {
  search?: string;
  categorySlug?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sort?: string;
  limit?: number;
  offset?: number;
}

export interface ProductsPageResult {
  products: Product[];
  total: number;
}

// Paginated listing query that does the filtering, sorting and counting in
// Postgres so the client only ever receives one page of rows.
export async function getProductsPage(
  params: ProductsPageParams = {},
): Promise<ProductsPageResult> {
  const {
    search,
    categorySlug,
    sellerId,
    minPrice,
    maxPrice,
    featured,
    sort,
    limit = 16,
    offset = 0,
  } = params;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (featured) {
    conditions.push("p.featured = true");
  }

  if (categorySlug) {
    values.push(categorySlug);
    const idx = values.length;
    // A parent group also matches every listing filed under one of its
    // subcategories; a subcategory slug matches only itself.
    conditions.push(`(p.category_slug = $${idx} OR p.category_slug IN (
      SELECT child.slug FROM categories child
      JOIN categories parent ON parent.id = child.parent_id
      WHERE parent.slug = $${idx}
    ))`);
  }

  if (sellerId === "store") {
    conditions.push("p.user_id IS NULL");
  } else if (sellerId) {
    values.push(sellerId);
    const idx = values.length;
    // Accept both the stored name handle and older UUID links.
    conditions.push(
      `(p.user_id::text = $${idx} OR p.user_id IN (
        SELECT su.id FROM users su WHERE su.handle = lower($${idx})
      ))`,
    );
  }

  if (search && search.trim()) {
    values.push(`%${search.trim()}%`);
    const idx = values.length;
    conditions.push(
      `(p.title ILIKE $${idx} OR p.category ILIKE $${idx} OR p.description ILIKE $${idx})`,
    );
  }

  if (typeof minPrice === "number" && !Number.isNaN(minPrice)) {
    values.push(minPrice);
    conditions.push(`p.price >= $${values.length}`);
  }

  if (typeof maxPrice === "number" && !Number.isNaN(maxPrice)) {
    values.push(maxPrice);
    conditions.push(`p.price <= $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const orderBy =
    sort === "latest"
      ? `p.created_at DESC`
      : sort === "price-asc"
        ? "p.price ASC"
        : sort === "price-desc"
          ? "p.price DESC"
          : sort === "featured"
            ? "p.featured DESC, p.created_at DESC"
            : "p.created_at DESC";

  const limitIdx = values.length + 1;
  const offsetIdx = values.length + 2;

  const { rows } = await pool.query(
    `SELECT p.*, c.icon AS category_icon, c.color AS category_color, c.bg_color AS category_bg,
            COUNT(*) OVER() AS total_count
     FROM products p
     LEFT JOIN categories c ON c.slug = p.category_slug
     ${where}
     ORDER BY ${orderBy}
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    [...values, limit, offset],
  );

  // COUNT(*) OVER() is attached to every returned row; when the page is empty
  // there are no rows, which correctly means zero matches.
  const total = rows.length ? Number(rows[0].total_count) : 0;

  return { products: rows.map(mapProduct), total };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { rows } = await pool.query(
    `${PRODUCT_SELECT} WHERE p.featured = true ORDER BY p.created_at DESC`,
  );
  return rows.map(mapProduct);
}

export async function getDeals(): Promise<Product[]> {
  if (!(await isFeatureEnabled("deals"))) return [];
  const { rows } = await pool.query(
    `${PRODUCT_SELECT} WHERE p.is_deal = true ORDER BY p.created_at DESC`,
  );
  return rows.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { rows } = await pool.query(
    `SELECT p.*, c.icon AS category_icon, c.color AS category_color, c.bg_color AS category_bg,
            u.name AS owner_name, u.handle AS owner_handle, u.phone AS owner_phone, u.whatsapp AS owner_whatsapp, u.avatar AS owner_avatar, u.is_verified AS owner_verified,
            u.is_vip AS owner_vip,
            a.avatar AS admin_avatar
     FROM products p
     LEFT JOIN categories c ON c.slug = p.category_slug
     LEFT JOIN users u ON u.id = p.user_id
     LEFT JOIN admin_users a ON p.user_id IS NULL
        AND (REPLACE(a.phone, '+', '') = REPLACE(p.seller->>'phone', '+', '')
          OR REPLACE(a.phone, '+', '') = REPLACE(p.seller->>'whatsapp', '+', '')
          OR REPLACE(a.whatsapp, '+', '') = REPLACE(p.seller->>'phone', '+', '')
          OR REPLACE(a.whatsapp, '+', '') = REPLACE(p.seller->>'whatsapp', '+', ''))
     WHERE p.slug = $1`,
    [slug],
  );
  return rows[0] ? mapProductWithOwner(rows[0]) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { rows } = await pool.query(`${PRODUCT_SELECT} WHERE p.id = $1`, [id]);
  return rows[0] ? mapProduct(rows[0]) : null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { rows } = await pool.query(
    `${PRODUCT_SELECT} WHERE p.category_slug = $1 AND p.id != $2 ORDER BY p.created_at DESC LIMIT $3`,
    [product.categorySlug, product.id, limit],
  );
  return rows.map(mapProduct);
}

export async function createProduct(data: Record<string, unknown>): Promise<Product> {
  const { rows } = await pool.query(
    `INSERT INTO products (slug, title, price, category, category_slug, featured, is_deal, description, specs, condition, location, seller, images, video, "daysAgo", "timeAgo", user_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
    [
      data.slug,
      data.title,
      data.price,
      data.category,
      data.categorySlug,
      data.featured ?? false,
      data.is_deal ?? data.isDeal ?? false,
      data.description ?? null,
      JSON.stringify(data.specs ?? []),
      data.condition ?? null,
      data.location ?? "Entebbe",
      JSON.stringify(data.seller ?? {}),
      JSON.stringify(data.images ?? []),
      data.video ?? null,
      data.daysAgo ?? 0,
      data.timeAgo ?? "Just now",
      data.user_id ?? null,
    ],
  );
  return mapProduct(rows[0]);
}

export async function updateProduct(id: string, data: Record<string, unknown>): Promise<Product> {
  const { rows } = await pool.query(
    `UPDATE products SET slug=$1, title=$2, price=$3, category=$4, category_slug=$5, featured=$6,
     is_deal=$7, description=$8, specs=$9, condition=$10, location=$11, seller=$12, images=$13, video=$14,
     "daysAgo"=$15, "timeAgo"=$16, user_id=$17, updated_at=now()
     WHERE id=$18 RETURNING *`,
    [
      data.slug,
      data.title,
      data.price,
      data.category,
      data.categorySlug,
      data.featured ?? false,
      data.is_deal ?? data.isDeal ?? false,
      data.description ?? null,
      JSON.stringify(data.specs ?? []),
      data.condition ?? null,
      data.location ?? "Entebbe",
      JSON.stringify(data.seller ?? {}),
      JSON.stringify(data.images ?? []),
      data.video ?? null,
      data.daysAgo ?? 0,
      data.timeAgo ?? "Just now",
      data.user_id ?? null,
      id,
    ],
  );
  return mapProduct(rows[0]);
}

export async function deleteProduct(id: string): Promise<void> {
  await pool.query("DELETE FROM products WHERE id = $1", [id]);
}

export async function deleteProductsByIds(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await pool.query("DELETE FROM products WHERE id = ANY($1)", [ids]);
}

export async function setProductsFeatured(ids: string[], featured: boolean): Promise<void> {
  if (ids.length === 0) return;
  await pool.query("UPDATE products SET featured = $2 WHERE id = ANY($1)", [ids, featured]);
}

export async function getProductsByUserId(userId: string): Promise<Product[]> {
  const { rows } = await pool.query(
    `${PRODUCT_SELECT} WHERE p.user_id = $1 ORDER BY p.created_at DESC`,
    [userId],
  );
  return rows.map(mapProduct);
}

export async function getProductOwnerIds(ids: string[]): Promise<Record<string, string | null>> {
  if (ids.length === 0) return {};
  const { rows } = await pool.query("SELECT id, user_id FROM products WHERE id = ANY($1)", [ids]);
  return Object.fromEntries(rows.map((r) => [r.id as string, (r.user_id as string) ?? null]));
}

export async function getProductOwnerId(id: string): Promise<string | null> {
  const { rows } = await pool.query("SELECT user_id FROM products WHERE id = $1", [id]);
  return rows[0]?.user_id ?? null;
}

// Public: all listings added by a specific registered user, joined with their
// profile so the buyer-facing UI can show the avatar / verified badge.
export async function getUserProductsWithOwner(userId: string): Promise<Product[]> {
  const { rows } = await pool.query(
    `SELECT p.*, c.icon AS category_icon, c.color AS category_color, c.bg_color AS category_bg,
            u.name AS owner_name, u.handle AS owner_handle, u.phone AS owner_phone, u.whatsapp AS owner_whatsapp, u.avatar AS owner_avatar, u.is_verified AS owner_verified,
            u.is_vip AS owner_vip
     FROM products p
     LEFT JOIN categories c ON c.slug = p.category_slug
     INNER JOIN users u ON u.id = p.user_id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC`,
    [userId],
  );
  return rows.map(mapProductWithOwner);
}

export async function getStoreProducts(): Promise<Product[]> {
  const { rows } = await pool.query(
    `SELECT p.*, c.icon AS category_icon, c.color AS category_color, c.bg_color AS category_bg,
            'CRE8MARKET' AS owner_name, NULL AS owner_phone, NULL AS owner_whatsapp, NULL AS owner_avatar, true AS owner_verified,
            true AS owner_vip
     FROM products p
     LEFT JOIN categories c ON c.slug = p.category_slug
     WHERE p.user_id IS NULL
     ORDER BY p.created_at DESC`,
  );
  return rows.map(mapProductWithOwner);
}

// Products joined with the registered user who added them — powers the admin dashboard's
// "Added by" column and per-user sorting/grouping.
export async function getProductsWithOwners(): Promise<ProductWithOwner[]> {
  const { rows } = await pool.query(`
    SELECT p.*, c.icon AS category_icon, c.color AS category_color, c.bg_color AS category_bg,
           u.name AS owner_name, u.handle AS owner_handle, u.phone AS owner_phone, u.whatsapp AS owner_whatsapp, u.avatar AS owner_avatar, u.is_verified AS owner_verified,
            u.is_vip AS owner_vip
    FROM products p
    LEFT JOIN categories c ON c.slug = p.category_slug
    LEFT JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
  `);
  return rows.map((row) => ({
    ...mapProduct(row),
    ownerName: (row.owner_name as string) ?? null,
    ownerHandle: (row.owner_handle as string) ?? null,
    ownerPhone: (row.owner_phone as string) ?? null,
    ownerWhatsapp: (row.owner_whatsapp as string) ?? null,
    ownerAvatar: (row.owner_avatar as string) ?? null,
    ownerVerified: (row.owner_verified as boolean) ?? null,
    ownerType: row.user_id ? "user" : "admin",
  }));
}

// Admin dashboard: the most recent listings with their owner, without loading
// the whole catalogue into memory.
export async function getRecentProductsWithOwners(limit = 5): Promise<ProductWithOwner[]> {
  const capped = Math.min(Math.max(limit, 1), 20);
  const { rows } = await pool.query(
    `SELECT p.*, c.icon AS category_icon, c.color AS category_color, c.bg_color AS category_bg,
            u.name AS owner_name, u.handle AS owner_handle, u.phone AS owner_phone, u.whatsapp AS owner_whatsapp, u.avatar AS owner_avatar, u.is_verified AS owner_verified,
            u.is_vip AS owner_vip
     FROM products p
     LEFT JOIN categories c ON c.slug = p.category_slug
     LEFT JOIN users u ON u.id = p.user_id
     ORDER BY p.created_at DESC
     LIMIT $1`,
    [capped],
  );
  return rows.map((row) => ({
    ...mapProduct(row),
    ownerName: (row.owner_name as string) ?? null,
    ownerHandle: (row.owner_handle as string) ?? null,
    ownerPhone: (row.owner_phone as string) ?? null,
    ownerWhatsapp: (row.owner_whatsapp as string) ?? null,
    ownerAvatar: (row.owner_avatar as string) ?? null,
    ownerVerified: (row.owner_verified as boolean) ?? null,
    ownerType: row.user_id ? "user" : "admin",
  }));
}

// Lightweight feed for the "new product" in-app toast poller: only the fields
// needed to render a toast, for rows created after a cursor timestamp.
export async function getRecentProductEvents(
  after: Date,
  limit = 3,
): Promise<Array<{ slug: string; title: string; price: string; createdAt: Date }>> {
  const capped = Math.min(Math.max(limit, 1), 10);
  const { rows } = await pool.query(
    `SELECT slug, title, price, created_at AS "createdAt"
     FROM products
     WHERE created_at > $1
     ORDER BY created_at ASC
     LIMIT $2`,
    [after.toISOString(), capped],
  );
  return rows as Array<{ slug: string; title: string; price: string; createdAt: Date }>;
}

export async function checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  if (excludeId) {
    const { rows } = await pool.query(`SELECT 1 FROM products WHERE slug = $1 AND id != $2`, [
      slug,
      excludeId,
    ]);
    return rows.length > 0;
  }
  const { rows } = await pool.query(`SELECT 1 FROM products WHERE slug = $1`, [slug]);
  return rows.length > 0;
}

// ── Categories ──

export async function getCategories(): Promise<CategoryDB[]> {
  // Top-level groups first, then their subcategories; the client renders the
  // list as grouped <optgroup>s.
  const { rows } = await pool.query(
    "SELECT * FROM categories ORDER BY parent_id NULLS FIRST, name",
  );
  return rows;
}

export async function createCategory(data: {
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  bg_color?: string;
  parent_id?: string | null;
}): Promise<CategoryDB> {
  const { rows } = await pool.query(
    `INSERT INTO categories (name, slug, icon, color, bg_color, parent_id)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      data.name,
      data.slug,
      data.icon ?? "📦",
      data.color ?? "#64748b",
      data.bg_color ?? "#f8fafc",
      data.parent_id || null,
    ],
  );
  return rows[0];
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
    slug: string;
    icon: string;
    color: string;
    bg_color: string;
    parent_id?: string | null;
  },
): Promise<CategoryDB> {
  const { rows } = await pool.query(
    `UPDATE categories
     SET name=$1, slug=$2, icon=$3, color=$4, bg_color=$5, parent_id=$6
     WHERE id=$7 RETURNING *`,
    [data.name, data.slug, data.icon, data.color, data.bg_color, data.parent_id || null, id],
  );
  return rows[0];
}

export async function deleteCategory(id: string): Promise<CategoryDB | null> {
  const { rows } = await pool.query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);
  return rows[0] ?? null;
}

// ── Push Subscriptions ──

export async function getPushSubscriptions(): Promise<PushSubscriptionRow[]> {
  const { rows } = await pool.query("SELECT * FROM push_subscriptions");
  return rows;
}

export async function upsertPushSubscription(
  endpoint: string,
  keys: { p256dh: string; auth: string },
): Promise<void> {
  await pool.query(
    `INSERT INTO push_subscriptions (endpoint, keys) VALUES ($1, $2)
     ON CONFLICT (endpoint) DO UPDATE SET keys = $2`,
    [endpoint, JSON.stringify(keys)],
  );
}

export async function deletePushSubscription(endpoint: string): Promise<void> {
  await pool.query("DELETE FROM push_subscriptions WHERE endpoint = $1", [endpoint]);
}

// ── Admin Users ──

export async function getAdminUserByEmail(email: string): Promise<AdminUserRow | null> {
  const { rows } = await pool.query("SELECT * FROM admin_users WHERE LOWER(email) = LOWER($1)", [
    email.trim(),
  ]);
  return rows[0] ?? null;
}

export async function getAdminUserById(id: string): Promise<AdminUserRow | null> {
  const { rows } = await pool.query("SELECT * FROM admin_users WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function updateAdminProfile(
  id: string,
  data: {
    name?: string;
    phone?: string;
    whatsapp?: string;
    avatar?: string | null;
    banner?: string | null;
  },
): Promise<AdminUserRow | null> {
  const { rows } = await pool.query(
    `UPDATE admin_users SET
       name = COALESCE($1, name),
       phone = COALESCE($2, phone),
       whatsapp = COALESCE($3, whatsapp),
       avatar = $4,
       banner = $5
     WHERE id = $6 RETURNING *`,
    [
      data.name ?? null,
      data.phone ?? null,
      data.whatsapp ?? null,
      data.avatar ?? null,
      data.banner ?? null,
      id,
    ],
  );
  return rows[0] ?? null;
}

// Full profile overwrite used when the main admin edits another admin. Unlike
// updateAdminProfile above, null values clear the field instead of keeping it.
export async function updateAdminUser(
  id: string,
  data: {
    name: string;
    phone: string | null;
    whatsapp: string | null;
    avatar: string | null;
    banner: string | null;
  },
): Promise<AdminUserRow | null> {
  const { rows } = await pool.query(
    `UPDATE admin_users
        SET name = $1, phone = $2, whatsapp = $3, avatar = $4, banner = $5
      WHERE id = $6
      RETURNING *`,
    [data.name, data.phone, data.whatsapp, data.avatar, data.banner, id],
  );
  return rows[0] ?? null;
}

// Banner and avatar shown on the public store seller page (/sellers/store).
// The store is represented by the earliest-created admin account.
export async function getStoreAdminProfile(): Promise<{
  avatar: string | null;
  banner: string | null;
}> {
  const { rows } = await pool.query(
    "SELECT avatar, banner FROM admin_users ORDER BY created_at ASC LIMIT 1",
  );
  return {
    avatar: (rows[0]?.avatar as string) ?? null,
    banner: (rows[0]?.banner as string) ?? null,
  };
}

export async function getAdminUserPasswordHash(id: string): Promise<string | null> {
  const { rows } = await pool.query("SELECT password_hash FROM admin_users WHERE id = $1", [id]);
  return (rows[0]?.password_hash as string) ?? null;
}

export async function updateAdminUserPassword(id: string, passwordHash: string): Promise<void> {
  await pool.query("UPDATE admin_users SET password_hash = $1 WHERE id = $2", [passwordHash, id]);
}

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const { rows } = await pool.query("SELECT * FROM admin_users ORDER BY created_at ASC");
  return rows;
}

export async function createAdminUser(data: {
  email: string;
  name?: string;
  phone?: string;
  whatsapp?: string;
  avatar?: string | null;
  password_hash: string;
}): Promise<AdminUserRow> {
  const { rows } = await pool.query(
    `INSERT INTO admin_users (email, password_hash, name, phone, whatsapp, avatar)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.email,
      data.password_hash,
      data.name ?? null,
      data.phone ?? null,
      data.whatsapp ?? null,
      data.avatar ?? null,
    ],
  );
  return rows[0];
}

export async function deleteAdminUser(id: string): Promise<void> {
  // Shared 'store' threads are kept; only this admin's own start/reply id goes.
  await pool.query(
    `DELETE FROM conversations
      WHERE (initiator_role = 'admin' AND initiator_id = $1)
         OR (counterparty_role = 'admin' AND counterparty_id = $1)`,
    [id],
  );
  await pool.query("DELETE FROM admin_users WHERE id = $1", [id]);
}

// ── Users (registered marketplace users) ──

export interface UserRow {
  id: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  avatar: string | null;
  password_hash: string;
  pin_hash: string | null;
  is_active: boolean;
  is_admin: boolean;
  account_type: string;
  created_at: string;
}

export async function getUsers(): Promise<AppUser[]> {
  const { rows } = await pool.query(`
    SELECT u.id, u.name, u.handle, u.phone, u.whatsapp, u.avatar, u.banner, u.is_active, u.is_admin, u.is_verified, u.is_vip, u.account_type, u.created_at,
           COUNT(p.id)::int AS product_count
    FROM users u
    LEFT JOIN products p ON p.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);
  return rows.map(mapUser);
}

// Public sellers directory: active seller accounts who currently have listings.
// Buyers never appear here — they browse, they don't sell.
export async function getPublicUsers(): Promise<AppUser[]> {
  const { rows } = await pool.query(`
    SELECT u.id, u.name, u.handle, u.phone, u.whatsapp, u.avatar, u.banner, u.is_active, u.is_admin, u.is_verified, u.is_vip, u.account_type, u.created_at,
           COUNT(p.id)::int AS product_count
    FROM users u
    LEFT JOIN products p ON p.user_id = u.id
    GROUP BY u.id
    HAVING COUNT(p.id) > 0 AND u.is_active = true AND u.account_type = 'seller'
    ORDER BY u.name ASC
  `);
  const users = rows.map(mapUser);
  const storeCount = await pool.query(
    "SELECT COUNT(*)::int AS count FROM products WHERE user_id IS NULL",
  );
  const storeProducts = Number(storeCount.rows[0]?.count ?? 0);
  if (storeProducts > 0) {
    const storeProfile = await getStoreAdminProfile();
    users.push({
      id: "store",
      name: "CRE8MARKET",
      phone: "",
      whatsapp: null,
      avatar: storeProfile.avatar,
      banner: storeProfile.banner,
      isActive: true,
      isAdmin: true,
      isVerified: true,
      isVip: true,
      createdAt: new Date().toISOString(),
      productCount: storeProducts,
    });
  }
  return users;
}

// Public: sellers for the /products filter — registered users with listings,
// plus the store (admin-added products, which have no user_id).
export async function getSellers(): Promise<
  { id: string; name: string; handle: string | null; productCount: number }[]
> {
  const { rows } = await pool.query(`
    SELECT u.id, u.name, u.handle, COUNT(p.id)::int AS product_count
    FROM users u
    INNER JOIN products p ON p.user_id = u.id
    GROUP BY u.id
    ORDER BY u.name ASC
  `);
  const sellers = rows.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    handle: (r.handle as string) ?? null,
    productCount: Number(r.product_count),
  }));

  const storeCount = await pool.query(
    "SELECT COUNT(*)::int AS count FROM products WHERE user_id IS NULL",
  );
  const storeProducts = Number(storeCount.rows[0]?.count ?? 0);
  if (storeProducts > 0) {
    sellers.push({
      id: "store",
      name: "CRE8MARKET Store",
      handle: "store",
      productCount: storeProducts,
    });
  }

  return sellers;
}

// ── Admin overview ───────────────────────────────────────────────────────────

interface AdminRenewal {
  id: string;
  name: string;
  planName: string;
  expiresAt: string | null;
  status: "expiring" | "expired";
}

export interface AdminOverview {
  totalListings: number;
  activeDeals: number;
  featuredListings: number;
  totalUsers: number;
  totalAdmins: number;
  subscriptions: {
    active: number;
    expiringSoon: number;
    expired: number;
    free: number;
  };
  needsAttention: {
    unverifiedSellers: number;
    inactiveSellers: number;
    inactiveBuyers: number;
    missingImages: number;
    storeListings: number;
  };
  renewals: AdminRenewal[];
}

// Aggregated counters for /admin. Replaces loading every product and user just
// to call .length on them.
export async function getAdminOverview(): Promise<AdminOverview> {
  const [counts, subscriptionRows] = await Promise.all([
    pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM products) AS total_listings,
        (SELECT COUNT(*)::int FROM products WHERE is_deal = true) AS active_deals,
        (SELECT COUNT(*)::int FROM products WHERE featured = true) AS featured_listings,
        (SELECT COUNT(*)::int FROM products WHERE user_id IS NULL) AS store_listings,
        (SELECT COUNT(*)::int FROM products
          WHERE COALESCE(jsonb_array_length(CASE WHEN jsonb_typeof(images) = 'array' THEN images END), 0) = 0
        ) AS missing_images,
        (SELECT COUNT(*)::int FROM users) AS total_users,
        (SELECT COUNT(*)::int FROM users WHERE is_active = false AND account_type = 'seller') AS inactive_sellers,
        (SELECT COUNT(*)::int FROM users WHERE is_active = false AND account_type = 'buyer') AS inactive_buyers,
        (SELECT COUNT(*)::int FROM admin_users) AS total_admins,
        (SELECT COUNT(*)::int FROM users u
          WHERE u.is_verified = false
            AND EXISTS (SELECT 1 FROM products p WHERE p.user_id = u.id)
            AND NOT EXISTS (
              SELECT 1 FROM user_subscriptions us
              JOIN subscription_plans sp ON sp.id = us.plan_id
              WHERE us.user_id = u.id
                AND us.status = 'active'
                AND (us.expires_at IS NULL OR us.expires_at > now())
                AND (lower(sp.name) LIKE '%standard%' OR lower(sp.name) LIKE '%premium%')
            )
        ) AS unverified_sellers
    `),
    pool.query(`
      SELECT DISTINCT ON (us.user_id)
        us.user_id AS id,
        u.name,
        us.status,
        us.expires_at,
        sp.name AS plan_name
      FROM user_subscriptions us
      JOIN subscription_plans sp ON sp.id = us.plan_id
      JOIN users u ON u.id = us.user_id
      ORDER BY us.user_id, us.started_at DESC
    `),
  ]);

  const row = (counts.rows[0] ?? {}) as Record<string, unknown>;
  const totalUsers = Number(row.total_users ?? 0);

  const now = Date.now();
  const soon = now + 7 * 24 * 60 * 60 * 1000;

  let active = 0;
  let expiringSoon = 0;
  let expired = 0;
  const renewals: AdminRenewal[] = [];

  for (const sub of subscriptionRows.rows as Record<string, unknown>[]) {
    const expiresAt = (sub.expires_at as string) ?? null;
    const expiresMs = expiresAt ? new Date(expiresAt).getTime() : null;
    const isActive = sub.status === "active" && (expiresMs === null || expiresMs > now);

    if (!isActive) {
      expired++;
      renewals.push({
        id: sub.id as string,
        name: sub.name as string,
        planName: sub.plan_name as string,
        expiresAt,
        status: "expired",
      });
      continue;
    }

    active++;
    if (expiresMs !== null && expiresMs <= soon) {
      expiringSoon++;
      renewals.push({
        id: sub.id as string,
        name: sub.name as string,
        planName: sub.plan_name as string,
        expiresAt,
        status: "expiring",
      });
    }
  }

  renewals.sort((a, b) => {
    if (!a.expiresAt) return 1;
    if (!b.expiresAt) return -1;
    return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
  });

  return {
    totalListings: Number(row.total_listings ?? 0),
    activeDeals: Number(row.active_deals ?? 0),
    featuredListings: Number(row.featured_listings ?? 0),
    totalUsers,
    totalAdmins: Number(row.total_admins ?? 0),
    subscriptions: {
      active,
      expiringSoon,
      expired,
      free: Math.max(totalUsers - subscriptionRows.rows.length, 0),
    },
    needsAttention: {
      unverifiedSellers: Number(row.unverified_sellers ?? 0),
      inactiveSellers: Number(row.inactive_sellers ?? 0),
      inactiveBuyers: Number(row.inactive_buyers ?? 0),
      missingImages: Number(row.missing_images ?? 0),
      storeListings: Number(row.store_listings ?? 0),
    },
    renewals: renewals.slice(0, 8),
  };
}

export async function getUserById(id: string): Promise<AppUser | null> {
  const { rows } = await pool.query(
    "SELECT id, name, handle, phone, whatsapp, avatar, banner, is_active, is_admin, is_verified, is_vip, account_type, (pin_hash IS NOT NULL) AS has_pin, created_at FROM users WHERE id = $1",
    [id],
  );
  return rows[0] ? mapUser(rows[0]) : null;
}

// Storefront URLs use a name-based handle, but old links (and internal calls)
// still use the UUID. Accept both, preferring an exact id match.
export async function getUserByHandleOrId(value: string): Promise<AppUser | null> {
  const { rows } = await pool.query(
    `SELECT id, name, handle, phone, whatsapp, avatar, banner, is_active, is_admin, is_verified, is_vip, account_type, (pin_hash IS NOT NULL) AS has_pin, created_at
     FROM users
     WHERE id::text = $1 OR lower(handle) = lower($1)
     ORDER BY (id::text = $1) DESC, created_at ASC
     LIMIT 1`,
    [value],
  );
  return rows[0] ? mapUser(rows[0]) : null;
}

export async function getUserByPhone(phone: string): Promise<UserRow | null> {
  const { rows } = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
  return rows[0] ?? null;
}

export async function checkPhoneExists(phone: string): Promise<boolean> {
  const { rows } = await pool.query("SELECT 1 FROM users WHERE phone = $1", [phone]);
  return rows.length > 0;
}

async function sellerHandleTaken(handle: string, excludeId?: string): Promise<boolean> {
  const { rows } = await pool.query(
    excludeId
      ? "SELECT 1 FROM users WHERE handle = $1 AND id <> $2 LIMIT 1"
      : "SELECT 1 FROM users WHERE handle = $1 LIMIT 1",
    excludeId ? [handle, excludeId] : [handle],
  );
  return rows.length > 0;
}

// Build a unique, name-based handle for the public storefront URL. Duplicate
// names get a numeric suffix: mary-jane, mary-jane-2, mary-jane-3, …
async function generateUniqueSellerHandle(
  name: string,
  excludeId?: string,
): Promise<string> {
  const base = sellerHandle(name);
  let candidate = base;
  let suffix = 1;

  while (await sellerHandleTaken(candidate, excludeId)) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }

  return candidate;
}

export async function createUser(data: {
  name: string;
  phone: string;
  whatsapp?: string;
  password_hash: string;
  pin_hash?: string | null;
  is_active?: boolean;
  avatar?: string | null;
  banner?: string | null;
  account_type?: "seller" | "buyer";
}): Promise<AppUser> {
  // Retry once if two registrations race for the same handle; the unique index
  // catches the loser and the next attempt picks the following suffix.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const handle = await generateUniqueSellerHandle(data.name);
    try {
      const { rows } = await pool.query(
        `INSERT INTO users (name, phone, whatsapp, password_hash, pin_hash, is_active, avatar, banner, handle, account_type)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, name, handle, phone, whatsapp, avatar, banner, is_active, is_admin, is_verified, account_type, created_at`,
        [
          data.name,
          data.phone,
          data.whatsapp ?? null,
          data.password_hash,
          data.pin_hash ?? null,
          data.is_active ?? true,
          data.avatar ?? null,
          data.banner ?? null,
          handle,
          data.account_type ?? "seller",
        ],
      );
      return mapUser(rows[0]);
    } catch (err) {
      const conflict = err as { code?: string; constraint?: string };
      const handleRace = conflict.code === "23505" && conflict.constraint === "idx_users_handle";
      if (!handleRace || attempt === 4) throw err;
    }
  }

  throw new Error("Could not create user");
}

export async function updateUserStatus(id: string, is_active: boolean): Promise<AppUser> {
  const { rows } = await pool.query(
    `UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, name, handle, phone, whatsapp, avatar, is_active, is_admin, is_verified, created_at`,
    [is_active, id],
  );
  return mapUser(rows[0]);
}

export async function updateUserProfile(
  id: string,
  data: { name: string; whatsapp?: string; avatar?: string | null; banner?: string | null },
): Promise<AppUser> {
  const handle = await generateUniqueSellerHandle(data.name, id);
  const { rows } = await pool.query(
    `UPDATE users SET name = $1, whatsapp = $2, avatar = $3, banner = $4, handle = $5 WHERE id = $6 RETURNING id, name, handle, phone, whatsapp, avatar, banner, is_active, is_admin, is_verified, is_vip, created_at`,
    [data.name, data.whatsapp ?? null, data.avatar ?? null, data.banner ?? null, handle, id],
  );
  return mapUser(rows[0]);
}

export async function updateUserContact(
  id: string,
  data: {
    name: string;
    phone: string;
    whatsapp?: string | null;
    avatar?: string | null;
    banner?: string | null;
  },
): Promise<AppUser> {
  const handle = await generateUniqueSellerHandle(data.name, id);
  const { rows } = await pool.query(
    `UPDATE users SET name = $1, phone = $2, whatsapp = $3, avatar = $4, banner = $5, handle = $6 WHERE id = $7 RETURNING id, name, handle, phone, whatsapp, avatar, banner, is_active, is_admin, is_verified, created_at`,
    [
      data.name,
      data.phone,
      data.whatsapp ?? null,
      data.avatar ?? null,
      data.banner ?? null,
      handle,
      id,
    ],
  );
  return mapUser(rows[0]);
}

export async function updateUserAdminStatus(id: string, is_admin: boolean): Promise<AppUser> {
  const { rows } = await pool.query(
    `UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING id, name, handle, phone, whatsapp, avatar, is_active, is_admin, is_verified, created_at`,
    [is_admin, id],
  );
  return mapUser(rows[0]);
}

export async function updateUserVerifiedStatus(id: string, is_verified: boolean): Promise<AppUser> {
  const { rows } = await pool.query(
    `UPDATE users SET is_verified = $1 WHERE id = $2 RETURNING id, name, handle, phone, whatsapp, avatar, is_active, is_admin, is_verified, is_vip, created_at`,
    [is_verified, id],
  );
  return mapUser(rows[0]);
}

export async function updateUserVipStatus(id: string, is_vip: boolean): Promise<AppUser> {
  const { rows } = await pool.query(
    `UPDATE users SET is_vip = $1 WHERE id = $2 RETURNING id, name, handle, phone, whatsapp, avatar, is_active, is_admin, is_verified, is_vip, created_at`,
    [is_vip, id],
  );
  return mapUser(rows[0]);
}

// Plan switches (Standard / Premium / Free) are the admin-facing control for
// seller subscriptions. Standard grants the verified badge, Premium grants VIP
// perks plus the badge, Free removes both.
export async function updateUserPlanFlags(
  id: string,
  plan: "Free" | "Standard" | "Premium",
): Promise<AppUser> {
  const isVerified = plan !== "Free";
  const isVip = plan === "Premium";
  const { rows } = await pool.query(
    `UPDATE users SET is_verified = $1, is_vip = $2 WHERE id = $3
     RETURNING id, name, handle, phone, whatsapp, avatar, is_active, is_admin, is_verified, is_vip, created_at`,
    [isVerified, isVip, id],
  );
  return mapUser(rows[0]);
}

export async function getUserPasswordHash(id: string): Promise<string | null> {
  const { rows } = await pool.query("SELECT password_hash FROM users WHERE id = $1", [id]);
  return (rows[0]?.password_hash as string) ?? null;
}

export async function updateUserPassword(id: string, passwordHash: string): Promise<void> {
  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, id]);
}

export async function deleteUser(
  id: string,
  opts: { deleteListings?: boolean } = {},
): Promise<void> {
  // Threads this user took part in go too. buyer_id cascades on its own, but
  // seller-initiated threads only reference the participant by role + id text.
  await pool.query(
    `DELETE FROM conversations
      WHERE (initiator_role IN ('buyer', 'user') AND initiator_id = $1)
         OR (counterparty_role IN ('buyer', 'user') AND counterparty_id = $1)`,
    [id],
  );
  // Self-service deletions wipe the seller's listings as well. Admin deletions
  // keep them, with user_id set to NULL (ON DELETE SET NULL).
  if (opts.deleteListings) {
    await pool.query("DELETE FROM products WHERE user_id = $1", [id]);
  }
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  // Drop the better-auth mirror too. Leaving it behind means a later account
  // that reuses this phone number collides with the orphan's unique email and
  // can never sign in (see syncLegacyUserToBetterAuth). Sessions and the
  // credential row go with it via ON DELETE CASCADE.
  await pool.query('DELETE FROM "user" WHERE id = $1', [id]);
}

export type InactiveAccount = {
  id: string;
  name: string;
  phone: string;
  accountType: "seller" | "buyer";
  lastLoginAt: string | null;
};

// Accounts whose last sign-in (or creation, for anyone who has never signed in
// since the column was added) is older than `cutoff`. Used by the scheduled
// dormant-account cleanup. Legacy admin rows are always excluded.
export async function getInactiveUsers(cutoff: Date, limit = 500): Promise<InactiveAccount[]> {
  const { rows } = await pool.query(
    `SELECT id, name, phone, account_type, last_login_at
       FROM users
      WHERE is_admin = false
        AND COALESCE(last_login_at, created_at) < $1
      ORDER BY COALESCE(last_login_at, created_at) ASC
      LIMIT $2`,
    [cutoff, limit],
  );
  return rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    phone: row.phone as string,
    accountType: row.account_type === "buyer" ? "buyer" : "seller",
    lastLoginAt: row.last_login_at ? new Date(row.last_login_at as string).toISOString() : null,
  }));
}

function mapUser(row: Record<string, unknown>): AppUser {
  return {
    id: row.id as string,
    name: row.name as string,
    handle: (row.handle as string) ?? null,
    phone: row.phone as string,
    whatsapp: (row.whatsapp as string) ?? null,
    avatar: (row.avatar as string) ?? null,
    banner: (row.banner as string) ?? null,
    isActive: row.is_active as boolean,
    isAdmin: (row.is_admin as boolean) ?? false,
    isVerified: (row.is_verified as boolean) ?? false,
    isVip: (row.is_vip as boolean) ?? false,
    hasPin: (row.has_pin as boolean) ?? undefined,
    accountType: (row.account_type as AppUser["accountType"]) ?? "seller",
    createdAt: row.created_at as string,
    productCount: row.product_count !== undefined ? Number(row.product_count) : undefined,
  };
}

// ── Helpers ──

function formatTimeAgo(dateValue: unknown): string {
  if (!dateValue) return "Just now";
  const date = new Date(dateValue as string);
  if (Number.isNaN(date.getTime())) return "Just now";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "Just now";
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function mapProduct(row: Record<string, unknown>): Product {
  const createdAt = row.created_at;
  const daysAgo = createdAt
    ? Math.max(0, Math.floor((Date.now() - new Date(createdAt as string).getTime()) / 86400000))
    : ((row.daysAgo as number) ?? 0);
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    price: Number(row.price),
    category: row.category as string,
    categorySlug: row.category_slug as string,
    featured: row.featured as boolean,
    isDeal: (row.is_deal as boolean) ?? false,
    description: (row.description as string) ?? undefined,
    specs: Array.isArray(row.specs) ? row.specs : [],
    condition: (row.condition as Product["condition"]) ?? undefined,
    location: (row.location as string) ?? "Entebbe",
    seller: typeof row.seller === "object" ? (row.seller as Product["seller"]) : undefined,
    user_id: (row.user_id as string) ?? null,
    images: Array.isArray(row.images) ? row.images : [],
    video: (row.video as string) ?? null,
    daysAgo,
    timeAgo: formatTimeAgo(createdAt ?? row.timeAgo),
    createdAt: createdAt ? new Date(createdAt as string).toISOString() : undefined,
    categoryIcon: (row.category_icon as string) ?? "📦",
    categoryColor: (row.category_color as string) ?? "#64748b",
    categoryBg: (row.category_bg as string) ?? "#f8fafc",
  };
}

function mapProductWithOwner(row: Record<string, unknown>): Product {
  return {
    ...mapProduct(row),
    ownerName: (row.owner_name as string) ?? null,
    ownerHandle: (row.owner_handle as string) ?? null,
    ownerPhone: (row.owner_phone as string) ?? null,
    ownerWhatsapp: (row.owner_whatsapp as string) ?? null,
    ownerAvatar: (row.owner_avatar as string) ?? (row.admin_avatar as string) ?? null,
    ownerVerified: (row.owner_verified as boolean) ?? null,
    ownerVip: (row.owner_vip as boolean) ?? null,
  };
}

// ── Audit log ────────────────────────────────────────────────────────────────

export interface AuditLogFilters {
  limit?: number;
  offset?: number;
  action?: string;
  actorRole?: string;
  actorId?: string;
  targetType?: string;
  targetId?: string;
  search?: string;
  from?: string;
  to?: string;
}

export interface AuditEntry {
  id: string;
  actor_id: string | null;
  actor_role: string | null;
  actor_name: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuditFacets {
  actions: string[];
  actor_roles: string[];
  target_types: string[];
}

// Resolve the caller's IP and user agent inside a request. Falls back to
// nulls when called outside a request context (scripts, tests, workers).
async function getRequestMeta(): Promise<{
  ip: string | null;
  userAgent: string | null;
}> {
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    return {
      ip:
        forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || h.get("cf-connecting-ip") || null,
      userAgent: h.get("user-agent") || null,
    };
  } catch {
    return { ip: null, userAgent: null };
  }
}

export async function logAudit(entry: {
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  const requestMeta =
    entry.ip === undefined && entry.userAgent === undefined
      ? await getRequestMeta()
      : { ip: entry.ip ?? null, userAgent: entry.userAgent ?? null };

  const values = [
    entry.actorId ?? null,
    entry.actorRole ?? null,
    entry.action,
    entry.targetType ?? null,
    entry.targetId ?? null,
    JSON.stringify(entry.metadata ?? {}),
    requestMeta.ip,
    requestMeta.userAgent,
  ];

  try {
    await pool.query(
      `INSERT INTO audit_log
         (actor_id, actor_role, action, target_type, target_id, metadata, ip, user_agent)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      values,
    );
  } catch (err) {
    // Fall back to the legacy column set so audit logging keeps working on
    // databases that have not yet run migration 0002.
    try {
      await pool.query(
        `INSERT INTO audit_log (actor_id, actor_role, action, target_type, target_id, metadata)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        values.slice(0, 6),
      );
    } catch (fallbackErr) {
      console.error("audit log failed:", fallbackErr ?? err);
    }
  }
}

function buildAuditWhere(filters: AuditLogFilters): {
  where: string;
  values: unknown[];
} {
  const clauses: string[] = [];
  const values: unknown[] = [];

  const add = (column: string, value: unknown) => {
    values.push(value);
    clauses.push(`a.${column} = $${values.length}`);
  };

  if (filters.action) add("action", filters.action);
  if (filters.actorRole) add("actor_role", filters.actorRole);
  if (filters.actorId) add("actor_id", filters.actorId);
  if (filters.targetType) add("target_type", filters.targetType);
  if (filters.targetId) add("target_id", filters.targetId);

  if (filters.from) {
    values.push(filters.from);
    clauses.push(`a.created_at >= $${values.length}`);
  }
  if (filters.to) {
    values.push(filters.to);
    clauses.push(`a.created_at <= $${values.length}`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    const p = `$${values.length}`;
    clauses.push(
      `(a.action ILIKE ${p} OR a.actor_id ILIKE ${p} OR a.target_id ILIKE ${p} OR a.metadata::text ILIKE ${p})`,
    );
  }

  return {
    where: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    values,
  };
}

export async function getAuditLog(filters: number | AuditLogFilters = 100): Promise<AuditEntry[]> {
  const f: AuditLogFilters = typeof filters === "number" ? { limit: filters } : filters;
  const limit = Math.min(Math.max(f.limit ?? 100, 1), 500);
  const offset = Math.max(f.offset ?? 0, 0);
  const { where, values } = buildAuditWhere(f);

  const { rows } = await pool.query(
    `SELECT a.*,
       COALESCE(
         (SELECT u.name FROM users u WHERE u.id::text = a.actor_id),
         (SELECT au.name FROM admin_users au WHERE au.id::text = a.actor_id)
       ) AS actor_name
     FROM audit_log a ${where}
     ORDER BY a.created_at DESC
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset],
  );
  return rows as AuditEntry[];
}

export async function countAuditLog(filters: AuditLogFilters = {}): Promise<number> {
  const { where, values } = buildAuditWhere(filters);
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM audit_log a ${where}`,
    values,
  );
  return (rows[0]?.count as number) ?? 0;
}

export async function clearAuditLog(): Promise<void> {
  await pool.query("DELETE FROM audit_log");
}

export async function getAuditFacets(): Promise<AuditFacets> {
  const { rows } = await pool.query(`
    SELECT
      ARRAY(SELECT DISTINCT action FROM audit_log ORDER BY action) AS actions,
      ARRAY(
        SELECT DISTINCT actor_role FROM audit_log
        WHERE actor_role IS NOT NULL ORDER BY actor_role
      ) AS actor_roles,
      ARRAY(
        SELECT DISTINCT target_type FROM audit_log
        WHERE target_type IS NOT NULL ORDER BY target_type
      ) AS target_types
  `);
  return (
    (rows[0] as AuditFacets | undefined) ?? {
      actions: [],
      actor_roles: [],
      target_types: [],
    }
  );
}

// ── Feature flags ────────────────────────────────────────────────────────────

export interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  updatedAt: string | null;
  custom?: boolean;
}

// Flags the app actually reads. Values here are the fallback used before a
// row exists in feature_flags, so existing features stay on after deploy.
const FEATURE_FLAG_CATALOG = [
  {
    key: "deals",
    label: "Deals",
    description: "Show the Deals page and deal promotions across the marketplace.",
    defaultEnabled: true,
  },
  {
    key: "push-notifications",
    label: "Push notifications",
    description: "Let visitors enable web push notifications from the install page.",
    defaultEnabled: true,
  },
] as const;

export async function getFeatureFlags(): Promise<FeatureFlag[]> {
  let rows: Record<string, unknown>[] = [];
  try {
    const result = await pool.query(
      "SELECT key, enabled, description, updated_at FROM feature_flags ORDER BY key",
    );
    rows = result.rows as Record<string, unknown>[];
  } catch {
    rows = [];
  }

  const byKey = new Map(rows.map((row) => [row.key as string, row]));

  const catalog: FeatureFlag[] = FEATURE_FLAG_CATALOG.map((flag) => {
    const row = byKey.get(flag.key);
    return {
      key: flag.key,
      label: flag.label,
      description: flag.description,
      enabled: row ? row.enabled === true : flag.defaultEnabled,
      updatedAt: (row?.updated_at as string) ?? null,
    };
  });

  const known = new Set<string>(FEATURE_FLAG_CATALOG.map((flag) => flag.key));
  const custom: FeatureFlag[] = rows
    .filter((row) => !known.has(row.key as string))
    .map((row) => ({
      key: row.key as string,
      label: row.key as string,
      description: (row.description as string) || "Custom feature flag.",
      enabled: row.enabled === true,
      updatedAt: (row.updated_at as string) ?? null,
      custom: true,
    }));

  return [...catalog, ...custom];
}

export async function isFeatureEnabled(key: string): Promise<boolean> {
  // Env override takes precedence: FEATURE_<KEY>=true/false
  const envKey = `FEATURE_${key.toUpperCase().replace(/-/g, "_")}`;
  const envVal = process.env[envKey];
  if (envVal === "true") return true;
  if (envVal === "false") return false;

  const fallback = FEATURE_FLAG_CATALOG.find((flag) => flag.key === key)?.defaultEnabled ?? false;

  try {
    const { rows } = await pool.query(`SELECT enabled FROM feature_flags WHERE key = $1`, [key]);
    return rows[0] ? rows[0].enabled === true : fallback;
  } catch {
    return fallback;
  }
}

export async function setFeatureFlag(key: string, enabled: boolean): Promise<void> {
  await pool.query(
    `INSERT INTO feature_flags (key, enabled, updated_at) VALUES ($1,$2,now())
     ON CONFLICT (key) DO UPDATE SET enabled = $2, updated_at = now()`,
    [key, enabled],
  );
}

// ── Subscription Plans ──

export async function getSubscriptionPlans(activeOnly = false): Promise<SubscriptionPlan[]> {
  const { rows } = await pool.query(
    `SELECT * FROM subscription_plans ${activeOnly ? "WHERE active = true" : ""} ORDER BY sort_order ASC, name ASC`,
  );
  return rows.map(mapSubscriptionPlan);
}

export async function getSubscriptionPlanById(id: string): Promise<SubscriptionPlan | null> {
  const { rows } = await pool.query("SELECT * FROM subscription_plans WHERE id = $1", [id]);
  return rows[0] ? mapSubscriptionPlan(rows[0]) : null;
}

export async function getSubscriptionPlanByName(name: string): Promise<SubscriptionPlan | null> {
  const { rows } = await pool.query(
    "SELECT * FROM subscription_plans WHERE lower(name) = lower($1) ORDER BY active DESC, sort_order ASC LIMIT 1",
    [name],
  );
  return rows[0] ? mapSubscriptionPlan(rows[0]) : null;
}

export async function upsertSubscriptionPlan(data: {
  id?: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  highlight?: boolean;
  icon?: string;
  sortOrder?: number;
  active?: boolean;
}): Promise<SubscriptionPlan> {
  if (data.id) {
    const { rows } = await pool.query(
      `UPDATE subscription_plans SET name=$1, price=$2, period=$3, features=$4, highlight=$5, icon=$6, sort_order=$7, active=$8, updated_at=now()
       WHERE id=$9 RETURNING *`,
      [
        data.name,
        data.price,
        data.period,
        JSON.stringify(data.features ?? []),
        data.highlight ?? false,
        data.icon ?? "user",
        data.sortOrder ?? 0,
        data.active ?? true,
        data.id,
      ],
    );
    return mapSubscriptionPlan(rows[0]);
  }
  const { rows } = await pool.query(
    `INSERT INTO subscription_plans (name, price, period, features, highlight, icon, sort_order, active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      data.name,
      data.price,
      data.period,
      JSON.stringify(data.features ?? []),
      data.highlight ?? false,
      data.icon ?? "user",
      data.sortOrder ?? 0,
      data.active ?? true,
    ],
  );
  return mapSubscriptionPlan(rows[0]);
}

export async function deleteSubscriptionPlan(id: string): Promise<void> {
  await pool.query("DELETE FROM subscription_plans WHERE id = $1", [id]);
}

// ── User Subscriptions ──

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const { rows } = await pool.query(
    `SELECT us.*, sp.name AS plan_name
     FROM user_subscriptions us
     JOIN subscription_plans sp ON sp.id = us.plan_id
     WHERE us.user_id = $1
     ORDER BY us.started_at DESC
     LIMIT 1`,
    [userId],
  );
  if (!rows[0]) return null;
  // Auto-expire subscriptions whose end date has passed.
  if (
    rows[0].status === "active" &&
    rows[0].expires_at &&
    new Date(rows[0].expires_at as string).getTime() < Date.now()
  ) {
    await pool.query(
      "UPDATE user_subscriptions SET status='expired', updated_at=now() WHERE id=$1",
      [rows[0].id],
    );
    rows[0].status = "expired";
  }
  return mapUserSubscription(rows[0]);
}

export async function cancelUserSubscriptions(userId: string): Promise<void> {
  await pool.query(
    `UPDATE user_subscriptions SET status='cancelled', updated_at=now()
     WHERE user_id = $1 AND status = 'active'`,
    [userId],
  );
}

export async function setUserSubscription(
  userId: string,
  planId: string,
  expiresAt: string | null = null,
  status: "active" | "expired" | "cancelled" = "active",
): Promise<UserSubscription> {
  if (!expiresAt && status === "active") {
    const plan = await getSubscriptionPlanById(planId);
    if (plan && plan.period) {
      const m = plan.period.match(/(\d+)\s*(month|months|year|years|day|days|week|weeks)/i);
      if (m) {
        const n = parseInt(m[1], 10);
        const unit = m[2].toLowerCase();
        const d = new Date();
        if (unit.startsWith("month")) d.setMonth(d.getMonth() + n);
        else if (unit.startsWith("year")) d.setFullYear(d.getFullYear() + n);
        else if (unit.startsWith("week")) d.setDate(d.getDate() + n * 7);
        else if (unit.startsWith("day")) d.setDate(d.getDate() + n);
        expiresAt = d.toISOString();
      }
    }
  }
  // Expire any existing active subscriptions for this user first.
  await pool.query(
    `UPDATE user_subscriptions SET status='expired', updated_at=now()
     WHERE user_id = $1 AND status = 'active'`,
    [userId],
  );
  const { rows } = await pool.query(
    `INSERT INTO user_subscriptions (user_id, plan_id, expires_at, status)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [userId, planId, expiresAt, status],
  );
  // Fetch with plan name.
  const full = await getUserSubscription(userId);
  return full ?? mapUserSubscription(rows[0]);
}

function mapSubscriptionPlan(row: Record<string, unknown>): SubscriptionPlan {
  return {
    id: row.id as string,
    name: row.name as string,
    price: Number(row.price),
    period: row.period as string,
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    highlight: (row.highlight as boolean) ?? false,
    icon: (row.icon as SubscriptionPlan["icon"]) ?? "user",
    sortOrder: Number(row.sort_order ?? 0),
    active: (row.active as boolean) ?? true,
    createdAt: row.created_at ? new Date(row.created_at as string).toISOString() : undefined,
  };
}

function mapUserSubscription(row: Record<string, unknown>): UserSubscription {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    planId: row.plan_id as string,
    planName: (row.plan_name as string) ?? undefined,
    startedAt: new Date(row.started_at as string).toISOString(),
    expiresAt: row.expires_at ? new Date(row.expires_at as string).toISOString() : null,
    status: (row.status as UserSubscription["status"]) ?? "active",
    createdAt: row.created_at ? new Date(row.created_at as string).toISOString() : undefined,
  };
}

// ── Direct chat (buyer ⇄ seller/admin, always about a product) ──────────────
// Any party can start a thread; the other side replies from their chat panel.
// Messages self-destruct CHAT_MESSAGE_TTL_DAYS after they are sent — purge
// runs before every read, so an expired message can never be returned and a
// thread with nothing left simply drops out of the list.

export const CHAT_MESSAGE_TTL_DAYS = 3;

export type ChatViewer =
  | { role: "buyer"; id: string }
  | { role: "user"; id: string }
  | { role: "admin"; id: string };

export async function purgeExpiredChatMessages(): Promise<number> {
  const res = await pool.query("DELETE FROM messages WHERE expires_at <= now()");
  return res.rowCount ?? 0;
}

// Ensures the single shared admin-only chat thread ("CRE8-MARKET") exists.
// Every admin sees it; its messages live for 14 days instead of 3. Safe to call
// repeatedly — the partial unique index makes concurrent creates no-ops.
export async function ensureAdminInternalChat(): Promise<string | null> {
  const { rows: existing } = await pool.query(
    "SELECT id FROM conversations WHERE is_internal = true LIMIT 1",
  );
  if (existing[0]) return existing[0].id as string;

  const admins = await getAdminUsers();
  const adminId = admins[0]?.id;
  if (!adminId) return null;

  const { rows } = await pool.query(
    `INSERT INTO conversations
       (buyer_id, initiator_role, initiator_id, counterparty_role, counterparty_id,
        product_id, product_title, product_slug, product_image, initiator_read_at,
        is_internal, message_ttl_days)
     VALUES (NULL, 'admin', $1, 'admin', $1, NULL, 'CRE8-MARKET', NULL, NULL, now(), true, 14)
     ON CONFLICT (is_internal) WHERE is_internal = true DO NOTHING
     RETURNING id`,
    [adminId],
  );
  if (rows[0]) return rows[0].id as string;

  const { rows: again } = await pool.query(
    "SELECT id FROM conversations WHERE is_internal = true LIMIT 1",
  );
  return (again[0]?.id as string) ?? null;
}
// Either party may be the initiator — buyers, sellers, or an admin.
export async function findOrCreateConversation(params: {
  initiator: ChatViewer;
  productId: string;
  counterpartyRole: ChatViewer["role"];
  counterpartyId: string;
  productTitle: string;
  productSlug: string;
  productImage: string | null;
}): Promise<string> {
  const { rows } = await pool.query(
    `INSERT INTO conversations
       (buyer_id, initiator_role, initiator_id, counterparty_role, counterparty_id,
        product_id, product_title, product_slug, product_image, initiator_read_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
     ON CONFLICT (initiator_role, initiator_id, counterparty_role, counterparty_id, product_id)
     DO UPDATE SET product_title = EXCLUDED.product_title,
                   product_slug = EXCLUDED.product_slug,
                   product_image = COALESCE(EXCLUDED.product_image, conversations.product_image)
     RETURNING id`,
    [
      // buyer_id only exists for legacy buyer-started threads.
      params.initiator.role === "buyer" ? params.initiator.id : null,
      params.initiator.role,
      params.initiator.id,
      params.counterpartyRole,
      params.counterpartyId,
      params.productId,
      params.productTitle,
      params.productSlug,
      params.productImage,
    ],
  );
  return rows[0].id as string;
}

export async function insertChatMessage(params: {
  conversationId: string;
  senderRole: ChatViewer["role"];
  senderId: string;
  body: string;
}): Promise<ChatMessage> {
  const { rows } = await pool.query(
    `INSERT INTO messages (conversation_id, sender_role, sender_id, body, expires_at)
     VALUES ($1, $2, $3, $4, now() + ((SELECT message_ttl_days FROM conversations WHERE id = $1) || ' days')::interval)
     RETURNING id, conversation_id, sender_role, sender_id, body, created_at, expires_at`,
    [params.conversationId, params.senderRole, params.senderId, params.body],
  );

  // The sender has obviously seen their own message: keep their side's read
  // marker current so they don't see their own reply as unread. Admins share
  // one inbox, so any admin reply counts as the admin side having read it.
  await pool.query(
    `UPDATE conversations
        SET last_message_at = now(),
            admin_read_at = CASE WHEN is_internal
                 THEN jsonb_set(COALESCE(admin_read_at, '{}'::jsonb), ARRAY[$3::text], to_jsonb(now()))
                 ELSE admin_read_at END,
            initiator_read_at =
              CASE WHEN is_internal THEN initiator_read_at
                   WHEN initiator_role = $2 AND (initiator_id = $3 OR $2 = 'admin')
                   THEN now() ELSE initiator_read_at END,
            counterparty_read_at =
              CASE WHEN is_internal THEN counterparty_read_at
                   WHEN initiator_role = $2 AND (initiator_id = $3 OR $2 = 'admin')
                   THEN counterparty_read_at ELSE now() END
      WHERE id = $1`,
    [params.conversationId, params.senderRole, params.senderId],
  );

  const insertedId = rows[0].id as string;

  // Re-read with sender details so the client can render avatar + name without
  // a second round-trip.
  const { rows: enriched } = await pool.query(
    `SELECT m.id, m.conversation_id, m.sender_role, m.sender_id, m.body, m.created_at, m.expires_at,
            CASE WHEN m.sender_role IN ('buyer', 'user') THEN u.name ELSE a.name END AS sender_name,
            CASE WHEN m.sender_role IN ('buyer', 'user') THEN u.avatar ELSE a.avatar END AS sender_avatar
       FROM messages m
       LEFT JOIN users u
         ON m.sender_role IN ('buyer', 'user') AND u.id::text = m.sender_id
       LEFT JOIN admin_users a
         ON m.sender_role = 'admin' AND a.id::text = m.sender_id
      WHERE m.id = $1`,
    [insertedId],
  );

  return mapChatMessage(enriched[0]);
}

// True when the viewer is the initiator side of a thread. Admins share one
// inbox, so any admin counts as the initiator side of an admin-started thread.
const viewerIsInitiatorSql = "c.initiator_role = $2 AND (c.initiator_id = $1 OR $2 = 'admin')";

// Participants are matched by role + id; admins additionally see every thread
// that involves the admin side (shared inbox).
const viewerCanSeeSql = `(($2 = 'admin' AND (c.initiator_role = 'admin' OR c.counterparty_role = 'admin'))
   OR (c.initiator_role = $2 AND c.initiator_id = $1)
   OR (c.counterparty_role = $2 AND c.counterparty_id = $1))`;

// Returns the conversation only if the viewer is actually a participant.
export async function getConversationForViewer(
  conversationId: string,
  viewer: ChatViewer,
): Promise<{ id: string; productId: string | null; isInternal: boolean } | null> {
  const { rows } = await pool.query(
    `SELECT c.id, c.product_id, c.is_internal
       FROM conversations c
      WHERE c.id = $3 AND ${viewerCanSeeSql}`,
    [viewer.id, viewer.role, conversationId],
  );
  return rows[0]
    ? { id: rows[0].id, productId: rows[0].product_id, isInternal: rows[0].is_internal === true }
    : null;
}

export async function markConversationRead(
  conversationId: string,
  viewer: ChatViewer,
): Promise<void> {
  await pool.query(
    `UPDATE conversations c
        SET admin_read_at = CASE WHEN c.is_internal
             THEN jsonb_set(COALESCE(c.admin_read_at, '{}'::jsonb), ARRAY[$1::text], to_jsonb(now()))
             ELSE c.admin_read_at END,
            initiator_read_at =
              CASE WHEN c.is_internal THEN c.initiator_read_at
                   WHEN ${viewerIsInitiatorSql} THEN now() ELSE c.initiator_read_at END,
            counterparty_read_at =
              CASE WHEN c.is_internal THEN c.counterparty_read_at
                   WHEN ${viewerIsInitiatorSql} THEN c.counterparty_read_at ELSE now() END
      WHERE c.id = $3 AND ${viewerCanSeeSql}`,
    [viewer.id, viewer.role, conversationId],
  );
}

// Total unread messages across every thread the viewer can see. Mirrors the
// per-thread unread_count in getConversationsForViewer, so the badge in the
// navbar always matches the number shown inside the chat panel.
export async function getUnreadMessageCountForViewer(viewer: ChatViewer): Promise<number> {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS count
       FROM conversations c
       JOIN messages m
         ON m.conversation_id = c.id AND m.expires_at > now()
      WHERE ${viewerCanSeeSql}
        AND NOT (m.sender_role = $2 AND m.sender_id = $1)
        AND m.created_at > COALESCE(
              CASE WHEN c.is_internal THEN (c.admin_read_at ->> $1)::timestamptz
                   WHEN ${viewerIsInitiatorSql} THEN c.initiator_read_at
                   ELSE c.counterparty_read_at END,
              'epoch'::timestamptz
            )`,
    [viewer.id, viewer.role],
  );
  return Number(rows[0]?.count ?? 0);
}

export async function getMessagesForConversation(conversationId: string): Promise<ChatMessage[]> {
  const { rows } = await pool.query(
    `SELECT m.id, m.conversation_id, m.sender_role, m.sender_id, m.body, m.created_at, m.expires_at,
            CASE WHEN m.sender_role IN ('buyer', 'user') THEN u.name ELSE a.name END AS sender_name,
            CASE WHEN m.sender_role IN ('buyer', 'user') THEN u.avatar ELSE a.avatar END AS sender_avatar
       FROM messages m
       LEFT JOIN users u
         ON m.sender_role IN ('buyer', 'user') AND u.id::text = m.sender_id
       LEFT JOIN admin_users a
         ON m.sender_role = 'admin' AND a.id::text = m.sender_id
      WHERE m.conversation_id = $1 AND m.expires_at > now()
      ORDER BY m.created_at ASC`,
    [conversationId],
  );
  return rows.map(mapChatMessage);
}

// Thread list for the viewer's chat panel, newest activity first.
export async function getConversationsForViewer(viewer: ChatViewer): Promise<ChatConversation[]> {
  const { rows } = await pool.query(
    `SELECT c.id,
            c.initiator_role,
            c.counterparty_role,
            c.product_id,
            c.product_title,
            c.product_slug,
            c.product_image,
            c.created_at,
            c.is_internal,
            c.initiator_read_at,
            c.counterparty_read_at,
            iu.name AS initiator_user_name,
            iu.avatar AS initiator_user_avatar,
            ia.name AS initiator_admin_name,
            ia.avatar AS initiator_admin_avatar,
            cu.name AS counterpart_user_name,
            cu.avatar AS counterpart_user_avatar,
            ca.name AS counterpart_admin_name,
            ca.avatar AS counterpart_admin_avatar,
            last.body AS last_message,
            last.created_at AS last_message_at,
            last.sender_role AS last_sender_role,
            unread.count AS unread_count,
            total.count AS message_count,
            CASE WHEN ${viewerIsInitiatorSql} THEN 'initiator' ELSE 'counterparty' END
              AS viewer_side
       FROM conversations c
       LEFT JOIN users iu
         ON c.initiator_role IN ('buyer', 'user') AND iu.id::text = c.initiator_id
       LEFT JOIN admin_users ia
         ON c.initiator_role = 'admin'
        AND ia.id::text = CASE WHEN c.initiator_id = 'store'
                               THEN (SELECT id::text FROM admin_users ORDER BY created_at ASC LIMIT 1)
                               ELSE c.initiator_id END
       LEFT JOIN users cu
         ON c.counterparty_role IN ('buyer', 'user') AND cu.id::text = c.counterparty_id
       LEFT JOIN admin_users ca
         ON c.counterparty_role = 'admin'
        AND ca.id::text = CASE WHEN c.counterparty_id = 'store'
                               THEN (SELECT id::text FROM admin_users ORDER BY created_at ASC LIMIT 1)
                               ELSE c.counterparty_id END
       LEFT JOIN LATERAL (
            SELECT m.body, m.created_at, m.sender_role
              FROM messages m
             WHERE m.conversation_id = c.id AND m.expires_at > now()
             ORDER BY m.created_at DESC
             LIMIT 1
       ) last ON TRUE
       LEFT JOIN LATERAL (
            SELECT COUNT(*)::int AS count
              FROM messages m
             WHERE m.conversation_id = c.id AND m.expires_at > now()
       ) total ON TRUE
       LEFT JOIN LATERAL (
            SELECT COUNT(*)::int AS count
              FROM messages m
             WHERE m.conversation_id = c.id
               AND m.expires_at > now()
               AND NOT (m.sender_role = $2 AND m.sender_id = $1)
               AND m.created_at > COALESCE(
                     CASE WHEN c.is_internal THEN (c.admin_read_at ->> $1)::timestamptz
                          WHEN ${viewerIsInitiatorSql} THEN c.initiator_read_at
                          ELSE c.counterparty_read_at END,
                     'epoch'::timestamptz
                   )
       ) unread ON TRUE
      WHERE ${viewerCanSeeSql}
        AND (c.is_internal = true OR EXISTS (
          SELECT 1 FROM messages m
           WHERE m.conversation_id = c.id AND m.expires_at > now()
        ))
      ORDER BY c.is_internal DESC, COALESCE(last.created_at, c.created_at) DESC`,
    [viewer.id, viewer.role],
  );

  return rows.map((row) => {
    // Show the party on the other side of the thread from the viewer.
    const viewerIsInitiator = row.viewer_side === "initiator";
    const otherRole = (
      viewerIsInitiator ? row.counterparty_role : row.initiator_role
    ) as ChatConversation["counterpartRole"];
    const otherName = viewerIsInitiator
      ? otherRole === "admin"
        ? row.counterpart_admin_name
        : row.counterpart_user_name
      : otherRole === "admin"
        ? row.initiator_admin_name
        : row.initiator_user_name;
    const otherAvatar = viewerIsInitiator
      ? otherRole === "admin"
        ? row.counterpart_admin_avatar
        : row.counterpart_user_avatar
      : otherRole === "admin"
        ? row.initiator_admin_avatar
        : row.initiator_user_avatar;

    return {
      id: row.id as string,
      counterpartName: row.is_internal
        ? "CRE8-MARKET"
        : ((otherName as string) ??
          (otherRole === "admin" ? "CRE8MARKET" : otherRole === "buyer" ? "Buyer" : "Seller")),
      counterpartAvatar: (otherAvatar as string) ?? null,
      counterpartRole: otherRole ?? "user",
      productId: (row.product_id as string) ?? null,
      productTitle: (row.product_title as string) ?? null,
      productSlug: (row.product_slug as string) ?? null,
      productImage: (row.product_image as string) ?? null,
      lastMessage: (row.last_message as string) ?? null,
      lastMessageAt: row.last_message_at
        ? new Date(row.last_message_at as string).toISOString()
        : null,
      lastSenderRole: (row.last_sender_role as ChatConversation["lastSenderRole"]) ?? null,
      unreadCount: Number(row.unread_count ?? 0),
      messageCount: Number(row.message_count ?? 0),
      createdAt: new Date(row.created_at as string).toISOString(),
      isInternal: row.is_internal === true,
    };
  });
}

export async function clearConversationMessages(conversationId: string): Promise<void> {
  await pool.query("DELETE FROM messages WHERE conversation_id = $1", [conversationId]);
  // Reset per-admin read markers so the emptied thread starts fresh.
  await pool.query(
    "UPDATE conversations SET admin_read_at = '{}'::jsonb, initiator_read_at = NULL, counterparty_read_at = NULL, last_message_at = created_at WHERE id = $1",
    [conversationId],
  );
}
function mapChatMessage(row: Record<string, unknown>): ChatMessage {
  return {
    id: row.id as string,
    conversationId: row.conversation_id as string,
    senderRole: row.sender_role as ChatMessage["senderRole"],
    senderId: row.sender_id as string,
    senderName: (row.sender_name as string) ?? null,
    senderAvatar: (row.sender_avatar as string) ?? null,
    body: row.body as string,
    createdAt: new Date(row.created_at as string).toISOString(),
    expiresAt: new Date(row.expires_at as string).toISOString(),
  };
}
