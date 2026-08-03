import { pool } from "./pool";
import type { Product, CategoryDB, ProductWithOwner, AppUser } from "../types";

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
  created_at: string;
}

// ── Products ──

const PRODUCT_SELECT = `
  SELECT p.*, c.icon AS category_icon, c.color AS category_color, c.bg_color AS category_bg
  FROM products p
  LEFT JOIN categories c ON c.slug = p.category_slug
`;

export async function getProducts(): Promise<Product[]> {
  const { rows } = await pool.query(
    `${PRODUCT_SELECT} ORDER BY p.created_at DESC`,
  );
  return rows.map(mapProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { rows } = await pool.query(
    `${PRODUCT_SELECT} WHERE p.featured = true ORDER BY p.created_at DESC`,
  );
  return rows.map(mapProduct);
}

export async function getDeals(): Promise<Product[]> {
  const { rows } = await pool.query(
    `${PRODUCT_SELECT} WHERE p.is_deal = true ORDER BY p.created_at DESC`,
  );
  return rows.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { rows } = await pool.query(
    `SELECT p.*, c.icon AS category_icon, c.color AS category_color, c.bg_color AS category_bg,
            u.name AS owner_name, u.phone AS owner_phone, u.whatsapp AS owner_whatsapp, u.avatar AS owner_avatar
     FROM products p
     LEFT JOIN categories c ON c.slug = p.category_slug
     LEFT JOIN users u ON u.id = p.user_id
     WHERE p.slug = $1`,
    [slug],
  );
  return rows[0] ? mapProductWithOwner(rows[0]) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { rows } = await pool.query(
    `${PRODUCT_SELECT} WHERE p.id = $1`,
    [id],
  );
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
    `INSERT INTO products (slug, title, price, category, category_slug, featured, is_deal, description, specs, condition, location, seller, images, "daysAgo", "timeAgo", user_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
    [
      data.slug, data.title, data.price, data.category, data.categorySlug,
      data.featured ?? false, data.is_deal ?? false, data.description ?? null,
      JSON.stringify(data.specs ?? []), data.condition ?? null, data.location ?? "Entebbe",
      JSON.stringify(data.seller ?? {}), JSON.stringify(data.images ?? []),
      data.daysAgo ?? 0, data.timeAgo ?? "Just now", data.user_id ?? null,
    ],
  );
  return mapProduct(rows[0]);
}

export async function updateProduct(id: string, data: Record<string, unknown>): Promise<Product> {
  const { rows } = await pool.query(
    `UPDATE products SET slug=$1, title=$2, price=$3, category=$4, category_slug=$5, featured=$6,
     is_deal=$7, description=$8, specs=$9, condition=$10, location=$11, seller=$12, images=$13,
     "daysAgo"=$14, "timeAgo"=$15, user_id=$16, updated_at=now()
     WHERE id=$17 RETURNING *`,
    [
      data.slug, data.title, data.price, data.category, data.categorySlug,
      data.featured ?? false, data.is_deal ?? false, data.description ?? null,
      JSON.stringify(data.specs ?? []), data.condition ?? null, data.location ?? "Entebbe",
      JSON.stringify(data.seller ?? {}), JSON.stringify(data.images ?? []),
      data.daysAgo ?? 0, data.timeAgo ?? "Just now", data.user_id ?? null, id,
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
  return (rows[0]?.user_id as string) ?? null;
}

// Products joined with the registered user who added them — powers the admin dashboard's
// "Added by" column and per-user sorting/grouping.
export async function getProductsWithOwners(): Promise<ProductWithOwner[]> {
  const { rows } = await pool.query(`
    SELECT p.*, c.icon AS category_icon, c.color AS category_color, c.bg_color AS category_bg,
           u.name AS owner_name, u.phone AS owner_phone, u.whatsapp AS owner_whatsapp, u.avatar AS owner_avatar
    FROM products p
    LEFT JOIN categories c ON c.slug = p.category_slug
    LEFT JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
  `);
  return rows.map((row) => ({
    ...mapProduct(row),
    ownerName: (row.owner_name as string) ?? null,
    ownerPhone: (row.owner_phone as string) ?? null,
    ownerWhatsapp: (row.owner_whatsapp as string) ?? null,
    ownerAvatar: (row.owner_avatar as string) ?? null,
    ownerType: row.user_id ? "user" : "admin",
  }));
}

export async function checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  if (excludeId) {
    const { rows } = await pool.query(
      `SELECT 1 FROM products WHERE slug = $1 AND id != $2`, [slug, excludeId],
    );
    return rows.length > 0;
  }
  const { rows } = await pool.query(`SELECT 1 FROM products WHERE slug = $1`, [slug]);
  return rows.length > 0;
}

// ── Categories ──

export async function getCategories(): Promise<CategoryDB[]> {
  const { rows } = await pool.query("SELECT * FROM categories ORDER BY name");
  return rows;
}

export async function createCategory(data: { name: string; slug: string; icon?: string; color?: string; bg_color?: string }): Promise<CategoryDB> {
  const { rows } = await pool.query(
    `INSERT INTO categories (name, slug, icon, color, bg_color) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [data.name, data.slug, data.icon ?? "📦", data.color ?? "#64748b", data.bg_color ?? "#f8fafc"],
  );
  return rows[0];
}

export async function updateCategory(id: string, data: { name: string; slug: string; icon: string; color: string; bg_color: string }): Promise<CategoryDB> {
  const { rows } = await pool.query(
    `UPDATE categories SET name=$1, slug=$2, icon=$3, color=$4, bg_color=$5 WHERE id=$6 RETURNING *`,
    [data.name, data.slug, data.icon, data.color, data.bg_color, id],
  );
  return rows[0];
}

export async function deleteCategory(id: string): Promise<void> {
  await pool.query("DELETE FROM categories WHERE id = $1", [id]);
}

// ── Push Subscriptions ──

export async function getPushSubscriptions(): Promise<PushSubscriptionRow[]> {
  const { rows } = await pool.query("SELECT * FROM push_subscriptions");
  return rows;
}

export async function upsertPushSubscription(endpoint: string, keys: { p256dh: string; auth: string }): Promise<void> {
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
  const { rows } = await pool.query("SELECT * FROM admin_users WHERE email = $1", [email]);
  return rows[0] ?? null;
}

export async function getAdminUserById(id: string): Promise<AdminUserRow | null> {
  const { rows } = await pool.query("SELECT * FROM admin_users WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function updateAdminProfile(
  id: string,
  data: { name?: string; phone?: string; whatsapp?: string },
): Promise<AdminUserRow | null> {
  const { rows } = await pool.query(
    `UPDATE admin_users SET
       name = COALESCE($1, name),
       phone = COALESCE($2, phone),
       whatsapp = COALESCE($3, whatsapp)
     WHERE id = $4 RETURNING *`,
    [data.name ?? null, data.phone ?? null, data.whatsapp ?? null, id],
  );
  return rows[0] ?? null;
}

export async function getAdminUserPasswordHash(id: string): Promise<string | null> {
  const { rows } = await pool.query("SELECT password_hash FROM admin_users WHERE id = $1", [id]);
  return (rows[0]?.password_hash as string) ?? null;
}

export async function updateAdminUserPassword(id: string, passwordHash: string): Promise<void> {
  await pool.query("UPDATE admin_users SET password_hash = $1 WHERE id = $2", [passwordHash, id]);
}

// ── Users (registered marketplace users) ──

export interface UserRow {
  id: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  avatar: string | null;
  password_hash: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export async function getUsers(): Promise<AppUser[]> {
  const { rows } = await pool.query(`
    SELECT u.id, u.name, u.phone, u.whatsapp, u.avatar, u.is_active, u.is_admin, u.created_at,
           COUNT(p.id)::int AS product_count
    FROM users u
    LEFT JOIN products p ON p.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);
  return rows.map(mapUser);
}

export async function getUserById(id: string): Promise<AppUser | null> {
  const { rows } = await pool.query(
    "SELECT id, name, phone, whatsapp, avatar, is_active, is_admin, created_at FROM users WHERE id = $1",
    [id],
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

export async function checkPhoneExistsExcluding(phone: string, excludeId: string): Promise<boolean> {
  const { rows } = await pool.query("SELECT 1 FROM users WHERE phone = $1 AND id != $2", [phone, excludeId]);
  return rows.length > 0;
}

export async function createUser(data: {
  name: string;
  phone: string;
  whatsapp?: string;
  password_hash: string;
  is_active?: boolean;
}): Promise<AppUser> {
  const { rows } = await pool.query(
    `INSERT INTO users (name, phone, whatsapp, password_hash, is_active)
     VALUES ($1,$2,$3,$4,$5) RETURNING id, name, phone, whatsapp, avatar, is_active, is_admin, created_at`,
    [data.name, data.phone, data.whatsapp ?? null, data.password_hash, data.is_active ?? true],
  );
  return mapUser(rows[0]);
}

export async function updateUserStatus(id: string, is_active: boolean): Promise<AppUser> {
  const { rows } = await pool.query(
    `UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, name, phone, whatsapp, avatar, is_active, is_admin, created_at`,
    [is_active, id],
  );
  return mapUser(rows[0]);
}

export async function updateUserProfile(
  id: string,
  data: { name: string; whatsapp?: string; avatar?: string | null },
): Promise<AppUser> {
  const { rows } = await pool.query(
    `UPDATE users SET name = $1, whatsapp = $2, avatar = $3 WHERE id = $4 RETURNING id, name, phone, whatsapp, avatar, is_active, is_admin, created_at`,
    [data.name, data.whatsapp ?? null, data.avatar ?? null, id],
  );
  return mapUser(rows[0]);
}

export async function updateUserContact(
  id: string,
  data: { name: string; phone: string; whatsapp?: string; avatar?: string | null },
): Promise<AppUser> {
  const { rows } = await pool.query(
    `UPDATE users SET name = $1, phone = $2, whatsapp = $3, avatar = $4 WHERE id = $5 RETURNING id, name, phone, whatsapp, avatar, is_active, is_admin, created_at`,
    [data.name, data.phone, data.whatsapp ?? null, data.avatar ?? null, id],
  );
  return mapUser(rows[0]);
}

export async function updateUserAdminStatus(id: string, is_admin: boolean): Promise<AppUser> {
  const { rows } = await pool.query(
    `UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING id, name, phone, whatsapp, avatar, is_active, is_admin, created_at`,
    [is_admin, id],
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

export async function deleteUser(id: string): Promise<void> {
  // Products created by this user are kept, with user_id set to NULL (ON DELETE SET NULL).
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
}

function mapUser(row: Record<string, unknown>): AppUser {
  return {
    id: row.id as string,
    name: row.name as string,
    phone: row.phone as string,
    whatsapp: (row.whatsapp as string) ?? null,
    avatar: (row.avatar as string) ?? null,
    isActive: row.is_active as boolean,
    isAdmin: (row.is_admin as boolean) ?? false,
    createdAt: row.created_at as string,
    productCount: row.product_count !== undefined ? Number(row.product_count) : undefined,
  };
}

// ── Helpers ──

function mapProduct(row: Record<string, unknown>): Product {
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
    daysAgo: (row.daysAgo as number) ?? 0,
    timeAgo: (row.timeAgo as string) ?? "Just now",
    categoryIcon: (row.category_icon as string) ?? "📦",
    categoryColor: (row.category_color as string) ?? "#64748b",
    categoryBg: (row.category_bg as string) ?? "#f8fafc",
  };
}

function mapProductWithOwner(row: Record<string, unknown>): Product {
  return {
    ...mapProduct(row),
    ownerName: (row.owner_name as string) ?? null,
    ownerPhone: (row.owner_phone as string) ?? null,
    ownerWhatsapp: (row.owner_whatsapp as string) ?? null,
    ownerAvatar: (row.owner_avatar as string) ?? null,
  };
}
