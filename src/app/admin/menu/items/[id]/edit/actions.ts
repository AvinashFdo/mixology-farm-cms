"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type EditMenuItemFormState = {
  error?: string;
  success?: string;
} | null;

type UpdateMenuItemInput = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  sortOrder: number;
};

async function updateMenuItemInDb(data: UpdateMenuItemInput) {
  await prisma.menuItem.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      price: data.price,
      categoryId: data.categoryId,
      sortOrder: data.sortOrder,
    },
  });
}

export async function updateMenuItem(
  id: string,
  prevState: EditMenuItemFormState,
  formData: FormData
): Promise<EditMenuItemFormState> {
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

  if (Number.isNaN(price) || price < 0) {
    return { error: "Invalid price." };
  }

  if (!categoryId) {
    return { error: "Category is required." };
  }

  await updateMenuItemInDb({
    id,
    name,
    description,
    imageUrl,
    price,
    categoryId,
    sortOrder,
  });

  revalidatePath("/admin/menu/items");
  redirect("/admin/menu/items?message=updated");
}