"use server";

import {
  getProducts,
  getProductsPage,
  getFeaturedProducts,
  getDeals,
  getProductBySlug,
  getProductById,
  getRelatedProducts,
  getUserProductsWithOwner,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductsByIds,
  setProductsFeatured,
  checkSlugExists,
  getProductsWithOwners,
  getProductsByUserId,
  getProductOwnerId,
  getProductOwnerIds,
  getSellers,
  getUserById,
  logAudit,
  getAuditLog,
  countAuditLog,
  getAuditFacets,
} from "@/lib/db/queries";
import { auth } from "@/lib/auth";
import { sendPushNotification } from "@/lib/push";
import { revalidatePath } from "next/cache";
import type { Product } from "@/lib/types";
import type { ProductsPageParams } from "@/lib/db/queries";
import type { AuditLogFilters } from "@/lib/db/queries";
import { productInputSchema } from "@/lib/validation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Not authorized");
  }
}

async function requireUser() {
  const session = await auth();
  if (!session?.user || session.user.role !== "user") {
    throw new Error("Not authorized");
  }
  return session.user.id;
}

// Unverified sellers can only post a limited number of listings. Once they're
// verified by an admin, the limit is lifted.
const MAX_FREE_PRODUCTS = 3;
const MAX_VERIFIED_PRODUCTS = 20;

// Generate a slug that doesn't collide with an existing one (e.g. `x-copy-2`).
async function uniqueSlug(base: string): Promise<string> {
  let candidate = `${base}-copy`;
  let i = 2;
  while (await checkSlugExists(candidate)) {
    candidate = `${base}-copy-${i}`;
    i++;
  }
  return candidate;
}

// Build the insert payload for a duplicated product: same content, fresh slug,
// not featured, not a deal, listed "Just now".
function buildDuplicateData(source: Product, ownerUserId: string | null) {
  return {
    title: `${source.title} (Copy)`,
    slug: undefined as string | undefined,
    price: source.price,
    category: source.category,
    categorySlug: source.categorySlug,
    featured: false,
    is_deal: false,
    description: source.description,
    specs: source.specs ?? [],
    condition: source.condition,
    location: source.location,
    seller: source.seller ?? {},
    images: source.images ?? [],
    daysAgo: 0,
    timeAgo: "Just now",
    user_id: ownerUserId,
  };
}

export async function fetchMyListingLimitAction() {
  const userId = await requireUser();
  const user = await getUserById(userId);
  const products = await getProductsByUserId(userId);
  const isVip = user?.isVip ?? false;
  const isVerified = user?.isVerified ?? false;
  const limit = isVip
    ? null
    : isVerified
      ? MAX_VERIFIED_PRODUCTS
      : MAX_FREE_PRODUCTS;
  return {
    productCount: products.length,
    isVerified,
    isVip,
    limit,
  };
}

export async function fetchProductsAction() {
  return getProducts();
}

export async function fetchProductsPageAction(params: ProductsPageParams = {}) {
  return getProductsPage(params);
}

export async function fetchSellersAction() {
  return getSellers();
}

export async function fetchFeaturedProductsAction() {
  return getFeaturedProducts();
}

export async function fetchDealsAction() {
  return getDeals();
}

export async function fetchRelatedProductsAction(product: Product, limit = 4) {
  return getRelatedProducts(product, limit);
}

export async function fetchProductBySlugAction(slug: string) {
  return getProductBySlug(slug);
}

export async function fetchProductByIdAction(id: string) {
  return getProductById(id);
}

// Public: every listing added by a specific seller (their storefront page).
export async function fetchPublicUserProductsAction(userId: string) {
  return getUserProductsWithOwner(userId);
}

// Admin dashboard: all products across the platform, with the user who added each one
// so they can be grouped/sorted by owner.
export async function fetchProductsWithOwnersAction() {
  await requireAdmin();
  return getProductsWithOwners();
}

export async function fetchAuditLogAction(filters: AuditLogFilters = {}) {
  await requireAdmin();
  const [entries, total, facets] = await Promise.all([
    getAuditLog(filters),
    countAuditLog(filters),
    getAuditFacets(),
  ]);
  return { entries, total, facets };
}

// ── Admin-only product management (any product) ──

export async function createProductAction(data: Record<string, unknown>) {
  await requireAdmin();
  const session = await auth();
  const parsed = productInputSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join("; "));
  }
  const input = parsed.data;
  const exists = await checkSlugExists(input.slug);
  if (exists) throw new Error("Slug already exists");
  const product = await createProduct(input as Record<string, unknown>);
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: "product.create",
    targetType: "product",
    targetId: product.id,
    metadata: { title: product.title, slug: product.slug },
  });
  await sendPushNotification({
    title: "New Product Added!",
    body: `${product.title} — UGX ${Number(product.price).toLocaleString()}`,
    url: `/products/${product.slug}`,
  }).catch((err) => console.error("Push notification failed:", err));
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
  return product;
}

export async function updateProductAction(id: string, data: Record<string, unknown>) {
  await requireAdmin();
  const session = await auth();
  const parsed = productInputSchema.partial().safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join("; "));
  }
  const input = parsed.data;
  if (input.slug) {
    const exists = await checkSlugExists(input.slug, id);
    if (exists) throw new Error("Slug already exists");
  }
  const product = await updateProduct(id, input as Record<string, unknown>);
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: "product.update",
    targetType: "product",
    targetId: id,
    metadata: { title: product.title, slug: product.slug },
  });
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
  revalidatePath(`/products/${product.slug}`);
  return product;
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  const session = await auth();
  const existing = await getProductById(id).catch(() => null);
  await deleteProduct(id);
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: "product.delete",
    targetType: "product",
    targetId: id,
    metadata: { title: existing?.title, slug: existing?.slug },
  });
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
}

export async function deleteProductsAction(ids: string[]) {
  await requireAdmin();
  const session = await auth();
  await deleteProductsByIds(ids);
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: "product.bulk_delete",
    targetType: "product",
    targetId: null,
    metadata: { ids, count: ids.length },
  });
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
}

export async function setProductsFeaturedAction(ids: string[], featured: boolean) {
  await requireAdmin();
  const session = await auth();
  await setProductsFeatured(ids, featured);
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: featured ? "product.feature" : "product.unfeature",
    targetType: "product",
    targetId: null,
    metadata: { ids, count: ids.length },
  });
  revalidatePath("/admin");
  revalidatePath("/products");
}

export async function duplicateProductsAction(ids: string[]) {
  await requireAdmin();
  const session = await auth();
  if (ids.length === 0) return;
  const created: string[] = [];
  for (const id of ids) {
    const source = await getProductById(id);
    if (!source) continue;
    const data = buildDuplicateData(source, source.user_id ?? null);
    data.slug = await uniqueSlug(source.slug);
    const product = await createProduct(data);
    created.push(product.id);
  }
  await logAudit({
    actorId: session?.user?.id ?? null,
    actorRole: "admin",
    action: "product.duplicate",
    targetType: "product",
    targetId: null,
    metadata: { sourceIds: ids, createdIds: created, count: created.length },
  });
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
}

export async function checkSlugAction(slug: string, excludeId?: string) {
  return checkSlugExists(slug, excludeId);
}

// ── User dashboard: a logged-in user can only manage products they added ──

export async function fetchMyProductsAction() {
  const userId = await requireUser();
  return getProductsByUserId(userId);
}

export async function createMyProductAction(data: Record<string, unknown>) {
  const userId = await requireUser();

  const user = await getUserById(userId);
  const isVip = user?.isVip ?? false;
  const isVerified = user?.isVerified ?? false;
  if (!isVip) {
    const max = isVerified ? MAX_VERIFIED_PRODUCTS : MAX_FREE_PRODUCTS;
    const existing = await getProductsByUserId(userId);
    if (existing.length >= max) {
      throw new Error(
        isVerified
          ? `You've reached the limit of ${MAX_VERIFIED_PRODUCTS} listings as a verified seller. Contact the admin to become a VIP for unlimited listings.`
          : `You've reached the limit of ${MAX_FREE_PRODUCTS} listings as a free seller. Contact the admin to get verified so you can post more.`,
      );
    }
  }

  const parsed = productInputSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join("; "));
  }
  const input = parsed.data;
  const exists = await checkSlugExists(input.slug);
  if (exists) throw new Error("Slug already exists");
  const product = await createProduct({ ...input, user_id: userId });
  await logAudit({
    actorId: userId,
    actorRole: "user",
    action: "product.create",
    targetType: "product",
    targetId: product.id,
    metadata: { title: product.title, slug: product.slug },
  });
  await sendPushNotification({
    title: "New Product Added!",
    body: `${product.title} — UGX ${Number(product.price).toLocaleString()}`,
    url: `/products/${product.slug}`,
  }).catch((err) => console.error("Push notification failed:", err));
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
  return product;
}

export async function updateMyProductAction(id: string, data: Record<string, unknown>) {
  const userId = await requireUser();
  const ownerId = await getProductOwnerId(id);
  if (ownerId !== userId) throw new Error("You can only edit products you added");

  const parsed = productInputSchema.partial().safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join("; "));
  }
  const input = parsed.data;
  if (input.slug) {
    const exists = await checkSlugExists(input.slug, id);
    if (exists) throw new Error("Slug already exists");
  }
  const product = await updateProduct(id, { ...input, user_id: userId });
  await logAudit({
    actorId: userId,
    actorRole: "user",
    action: "product.update",
    targetType: "product",
    targetId: id,
    metadata: { title: product.title, slug: product.slug },
  });
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
  revalidatePath(`/products/${product.slug}`);
  return product;
}

export async function deleteMyProductAction(id: string) {
  const userId = await requireUser();
  const ownerId = await getProductOwnerId(id);
  if (ownerId !== userId) throw new Error("You can only delete products you added");

  const existing = await getProductById(id).catch(() => null);
  await deleteProduct(id);
  await logAudit({
    actorId: userId,
    actorRole: "user",
    action: "product.delete",
    targetType: "product",
    targetId: id,
    metadata: { title: existing?.title, slug: existing?.slug },
  });
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
}

export async function deleteMyProductsAction(ids: string[]) {
  const userId = await requireUser();
  if (ids.length === 0) return;
  const owners = await getProductOwnerIds(ids);
  for (const id of ids) {
    if (owners[id] !== userId) {
      throw new Error("You can only delete products you added");
    }
  }
  await deleteProductsByIds(ids);
  await logAudit({
    actorId: userId,
    actorRole: "user",
    action: "product.bulk_delete",
    targetType: "product",
    targetId: null,
    metadata: { ids, count: ids.length },
  });
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
}

export async function duplicateMyProductsAction(ids: string[]) {
  const userId = await requireUser();
  if (ids.length === 0) return;

  const owners = await getProductOwnerIds(ids);
  for (const id of ids) {
    if (owners[id] !== userId) {
      throw new Error("You can only duplicate products you added");
    }
  }

  const user = await getUserById(userId);
  const isVip = user?.isVip ?? false;
  const isVerified = user?.isVerified ?? false;
  if (!isVip) {
    const max = isVerified ? MAX_VERIFIED_PRODUCTS : MAX_FREE_PRODUCTS;
    const existing = await getProductsByUserId(userId);
    if (existing.length + ids.length > max) {
      throw new Error(
        `Duplicating ${ids.length} product${ids.length !== 1 ? "s" : ""} would put you past the ${max} listing limit. Contact the admin to upgrade your account.`,
      );
    }
  }

  const created: string[] = [];
  for (const id of ids) {
    const source = await getProductById(id);
    if (!source) continue;
    const data = buildDuplicateData(source, userId);
    data.slug = await uniqueSlug(source.slug);
    const product = await createProduct(data);
    created.push(product.id);
  }
  await logAudit({
    actorId: userId,
    actorRole: "user",
    action: "product.duplicate",
    targetType: "product",
    targetId: null,
    metadata: { sourceIds: ids, createdIds: created, count: created.length },
  });
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
}
