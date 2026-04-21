"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type MenuItemFormState = {
  error?: string;
  success?: string;
} | null;

export async function createMenuItem(
  prevState: MenuItemFormState,
  formData: FormData
): Promise<MenuItemFormState> {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const priceValue = formData.get("price");
  const categoryId = String(formData.get("categoryId") || "");
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!name) {
    return { error: "Name is required." };
  }

  if (!priceValue) {
    return { error: "Price is required." };
  }

  const price = Number(priceValue);

  if (isNaN(price) || price < 0) {
    return { error: "Invalid price." };
  }

  if (!categoryId) {
    return { error: "Category is required." };
  }

  await prisma.menuItem.create({
    data: {
      name,
      description: description || null,
      imageUrl: imageUrl || null,
      price,
      categoryId,
      sortOrder,
    },
  });

  revalidatePath("/admin/menu/items");

  return { success: "Menu item created successfully." };
}

export async function deleteMenuItem(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Menu item id is required.");
  }

  await prisma.menuItem.delete({
    where: { id },
  });

  redirect("/admin/menu/items?message=deleted");
}

export async function toggleMenuItemStatus(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Menu item id is required.");
  }

  const existingItem = await prisma.menuItem.findUnique({
    where: { id },
    select: { id: true, isActive: true },
  });

  if (!existingItem) {
    throw new Error("Menu item not found.");
  }

  await prisma.menuItem.update({
    where: { id },
    data: {
      isActive: !existingItem.isActive,
    },
  });

  revalidatePath("/admin/menu/items");
}