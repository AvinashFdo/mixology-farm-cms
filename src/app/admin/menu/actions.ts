"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type CategoryFormState = {
  error?: string;
  success?: string;
} | null;

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function createMenuCategory(
  prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const name = String(formData.get("name") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!name) {
    return { error: "Category name is required." };
  }

  const slug = makeSlug(name);

  const existing = await prisma.menuCategory.findUnique({
    where: { slug },
  });

  if (existing) {
    return { error: "Category already exists." };
  }

  await prisma.menuCategory.create({
    data: {
      name,
      slug,
      sortOrder,
    },
  });

  revalidatePath("/admin/menu");

  return { success: "Category created successfully." };
}

export async function deleteMenuCategory(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Category id is required.");
  }

  await prisma.menuCategory.delete({
    where: { id },
  });

  redirect("/admin/menu?message=deleted");
}