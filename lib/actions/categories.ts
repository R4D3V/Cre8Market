"use server";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/db/queries";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Not authorized");
  }
}

export async function fetchCategoriesAction() {
  return getCategories();
}

export async function createCategoryAction(data: { name: string; slug: string; icon?: string; color?: string; bg_color?: string }) {
  await requireAdmin();
  const category = await createCategory(data);
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/selltous");
  revalidatePath("/admin");
  return category;
}

export async function updateCategoryAction(id: string, data: { name: string; slug: string; icon: string; color: string; bg_color: string }) {
  await requireAdmin();
  const category = await updateCategory(id, data);
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/selltous");
  revalidatePath("/admin");
  return category;
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  await deleteCategory(id);
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/selltous");
  revalidatePath("/admin");
}
