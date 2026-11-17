"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import type { AuditLogFilters, ProductsPageParams } from "@/lib/db/queries";
import {
  checkSlugExists,
  clearAuditLog,
  countAuditLog,
  createProduct,
  deleteProduct,
  deleteProductsByIds,
  getAuditFacets,
  getAuditLog,
  getDeals,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  getProductOwnerId,
  getProductOwnerIds,
  getProducts,
  getProductsByUserId,
  getProductsPage,
  getProductsWithOwners,
  getRelatedProducts,
  getSellers,
  getStoreProducts,
  getUserByHandleOrId,
  getUserById,
  getUserProductsWithOwner,
  getUserSubscription,
  logAudit,
  setProductsFeatured,
  updateProduct,
} from "@/lib/db/queries";
import { ADMIN_IMAGE_LIMIT, limitsForPerks, planForPerks } from "@/lib/plans";
import { sendPushNotification } from "@/lib/push";
import type { Product } from "@/lib/types";
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

// Listing/image limits live in lib/plans.ts so the new-listing forms and these
// Server Actions enforce the same per-plan rules.

// helper
async function getEffectivePerks(userId: string): Promise<{ isVerified: boolean; isVip: boolean }> {
  const user = await getUserById(userId);
  let subVerified = false;
  let subVip = false;
  let subExpired = false;
  let hasSub = false;
  try {
    const sub = await getUserSubscription(userId);
    if (sub) {
      hasSub = true;
      const active =
        sub.status === "active" &&
        (!sub.expiresAt || new Date(sub.expiresAt).getTime() > Date.now());
      if (active && sub.planName) {
        const name = sub.planName.toLowerCase();
        if (name.includes("premium")) subVip = true;
        else if (name.includes("standard")) subVerified = true;
      }
      if (!active) subExpired = true;
    }
  } catch {
    // ignore
  }
  if (hasSub && subExpired) {
    return { isVerified: false, isVip: false };
  }

  // The admin's Standard / Premium switches are the canonical plan, so they win
  // over whatever an older subscription record says. Fall back to the active
  // subscription only when the admin has this user on the Free plan.
  if (user?.isVip) return { isVerified: true, isVip: true };
  if (user?.isVerified) return { isVerified: true, isVip: false };

  return { isVerified: subVerified, isVip: subVip };
}

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
function buildDuplicateData(source: Product, ownerUserId: string | null, maxImages: number) {
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
    images: (source.images ?? []).slice(0, maxImages),
    daysAgo: 0,
    timeAgo: "Just now",
    user_id: ownerUserId,
  };
}

export async function fetchMyListingLimitAction() {
  const userId = await requireUser();
  const perks = await getEffectivePerks(userId);
  const products = await getProductsByUserId(userId);
  const limits = limitsForPerks(perks);
  return {
    productCount: products.length,
    isVerified: perks.isVerified,
    isVip: perks.isVip,
    plan: planForPerks(perks),
    limit: limits.listings,
    maxImages: limits.images,
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
// The route may carry the seller's name handle or their legacy UUID.
export async function fetchPublicUserProductsAction(userIdOrHandle: string) {
  if (userIdOrHandle === "store") {
    return getStoreProducts();
  }
  const user = await getUserByHandleOrId(userIdOrHandle);
  if (!user) return [];
  return getUserProductsWithOwner(user.id);
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

export async function clearAuditLogAction() {
  await requireAdmin();
  await clearAuditLog();
  revalidatePath("/admin/audit");
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
  const images = input.images ?? [];
  if (images.length > ADMIN_IMAGE_LIMIT) {
    throw new Error(`A product can have at most ${ADMIN_IMAGE_LIMIT} images`);
  }
  const exists = await checkSlugExists(input.slug);
  if (exists) throw new Error("Slug already exists");
  // New listings are image-only — never persist a video from the create form.
  const product = await createProduct({
    ...input,
    images,
    video: null,
  } as Record<string, unknown>);
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
    const data = buildDuplicateData(source, source.user_id ?? null, ADMIN_IMAGE_LIMIT);
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

  const perks = await getEffectivePerks(userId);
  const limits = limitsForPerks(perks);
  const plan = planForPerks(perks);
  if (limits.listings !== null) {
    const existing = await getProductsByUserId(userId);
    if (existing.length >= limits.listings) {
      throw new Error(
        `You've reached the limit of ${limits.listings} listings on the ${plan} plan. Upgrade your subscription to post more.`,
      );
    }
  }

  const parsed = productInputSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join("; "));
  }
  const input = parsed.data;
  const images = input.images ?? [];
  if (images.length > limits.images) {
    throw new Error(`The ${plan} plan allows at most ${limits.images} photos per product`);
  }
  const exists = await checkSlugExists(input.slug);
  if (exists) throw new Error("Slug already exists");
  // New listings are image-only — never persist a video from the create form.
  const product = await createProduct({
    ...input,
    images,
    video: null,
    user_id: userId,
  } as Record<string, unknown>);
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

  const limits = limitsForPerks(await getEffectivePerks(userId));
  if (limits.listings !== null) {
    const existing = await getProductsByUserId(userId);
    if (existing.length + ids.length > limits.listings) {
      throw new Error(
        `Duplicating ${ids.length} product${ids.length !== 1 ? "s" : ""} would put you past the ${limits.listings} listing limit. Subscribe to a plan to post more listings.`,
      );
    }
  }

  const created: string[] = [];
  for (const id of ids) {
    const source = await getProductById(id);
    if (!source) continue;
    const data = buildDuplicateData(source, userId, limits.images);
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
