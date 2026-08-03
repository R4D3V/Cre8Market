"use server";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function fetchCategoriesAction() {
  return getCategories();
}

export async function createCategoryAction(data: { name: string; slug: string; icon?: string; color?: string; bg_color?: string }) {
  const category = await createCategory(data);
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/selltous");
  revalidatePath("/admin");
  return category;
}

export async function updateCategoryAction(id: string, data: { name: string; slug: string; icon: string; color: string; bg_color: string }) {
  const category = await updateCategory(id, data);
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/selltous");
  revalidatePath("/admin");
  return category;
}

export async function deleteCategoryAction(id: string) {
  await deleteCategory(id);
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/selltous");
  revalidatePath("/admin");
}
