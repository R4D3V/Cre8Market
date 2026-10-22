"use server";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  logAudit,
} from "@/lib/db/queries";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Not authorized");
  }
  return session.user.id;
}

export async function fetchCategoriesAction() {
  return getCategories();
}

export async function createCategoryAction(data: { name: string; slug: string; icon?: string; color?: string; bg_color?: string }) {
  const actorId = await requireAdmin();
  const category = await createCategory(data);
  await logAudit({
    actorId,
    actorRole: "admin",
    action: "category.create",
    targetType: "category",
    targetId: category.id,
    metadata: { name: category.name, slug: category.slug },
  });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/selltous");
  revalidatePath("/admin");
  return category;
}

export async function updateCategoryAction(id: string, data: { name: string; slug: string; icon: string; color: string; bg_color: string }) {
  const actorId = await requireAdmin();
  const category = await updateCategory(id, data);
  await logAudit({
    actorId,
    actorRole: "admin",
    action: "category.update",
    targetType: "category",
    targetId: id,
    metadata: { name: category.name, slug: category.slug },
  });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/selltous");
  revalidatePath("/admin");
  return category;
}

export async function deleteCategoryAction(id: string) {
  const actorId = await requireAdmin();
  const category = await deleteCategory(id);
  await logAudit({
    actorId,
    actorRole: "admin",
    action: "category.delete",
    targetType: "category",
    targetId: id,
    metadata: { name: category?.name, slug: category?.slug },
  });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/selltous");
  revalidatePath("/admin");
}
