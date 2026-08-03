"use server";

import {
  getProducts,
  getFeaturedProducts,
  getDeals,
  getProductBySlug,
  getProductById,
  getRelatedProducts,
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
} from "@/lib/db/queries";
import { auth } from "@/lib/auth";
import { sendPushNotification } from "@/lib/push";
import { revalidatePath } from "next/cache";
import type { Product } from "@/lib/types";

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

export async function fetchProductsAction() {
  return getProducts();
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

// Admin dashboard: all products across the platform, with the user who added each one
// so they can be grouped/sorted by owner.
export async function fetchProductsWithOwnersAction() {
  await requireAdmin();
  return getProductsWithOwners();
}

// ── Admin-only product management (any product) ──

export async function createProductAction(data: Record<string, unknown>) {
  await requireAdmin();
  const exists = await checkSlugExists(data.slug as string);
  if (exists) throw new Error("Slug already exists");
  const product = await createProduct(data);
  await sendPushNotification({
    title: "New Product Added!",
    body: `${product.title} — UGX ${Number(product.price).toLocaleString()}`,
    url: `/products/${product.slug}`,
  }).catch(() => {});
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
  return product;
}

export async function updateProductAction(id: string, data: Record<string, unknown>) {
  await requireAdmin();
  const exists = await checkSlugExists(data.slug as string, id);
  if (exists) throw new Error("Slug already exists");
  const product = await updateProduct(id, data);
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
  revalidatePath(`/products/${product.slug}`);
  return product;
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await deleteProduct(id);
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
}

export async function deleteProductsAction(ids: string[]) {
  await requireAdmin();
  await deleteProductsByIds(ids);
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
}

export async function setProductsFeaturedAction(ids: string[], featured: boolean) {
  await requireAdmin();
  await setProductsFeatured(ids, featured);
  revalidatePath("/admin");
  revalidatePath("/products");
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
  const exists = await checkSlugExists(data.slug as string);
  if (exists) throw new Error("Slug already exists");
  const product = await createProduct({ ...data, user_id: userId });
  await sendPushNotification({
    title: "New Product Added!",
    body: `${product.title} — UGX ${Number(product.price).toLocaleString()}`,
    url: `/products/${product.slug}`,
  }).catch(() => {});
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

  const exists = await checkSlugExists(data.slug as string, id);
  if (exists) throw new Error("Slug already exists");
  const product = await updateProduct(id, { ...data, user_id: userId });
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

  await deleteProduct(id);
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
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/deals");
}
