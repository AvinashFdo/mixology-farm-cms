"use client";

import { useActionState } from "react";
import FlashMessage from "@/components/admin/flash-message";

type CategoryOption = {
  id: string;
  name: string;
};

type MenuItemData = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: string;
  categoryId: string;
  sortOrder: number;
};

type EditMenuItemFormState = {
  error?: string;
  success?: string;
} | null;

type EditMenuItemFormProps = {
  item: MenuItemData;
  categories: CategoryOption[];
  action: (
    prevState: EditMenuItemFormState,
    formData: FormData
  ) => Promise<EditMenuItemFormState>;
};

export default function EditMenuItemForm({
  item,
  categories,
  action,
}: EditMenuItemFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-4 flex max-w-md flex-col gap-3">
      <input
        type="text"
        name="name"
        defaultValue={item.name}
        placeholder="Item name"
        className="border p-2"
        required
      />

      <textarea
        name="description"
        defaultValue={item.description || ""}
        placeholder="Description"
        className="border p-2"
        rows={4}
      />

      <input
        type="url"
        name="imageUrl"
        defaultValue={item.imageUrl || ""}
        placeholder="Image URL"
        className="border p-2"
      />

      <input
        type="number"
        name="price"
        defaultValue={item.price}
        placeholder="Price"
        className="border p-2"
        step="0.01"
        min="0"
        required
      />

      <select
        name="categoryId"
        defaultValue={item.categoryId}
        className="border p-2"
        required
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="sortOrder"
        defaultValue={item.sortOrder}
        placeholder="Sort order"
        className="border p-2"
      />

      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-32 w-32 rounded border object-cover"
        />
      ) : null}

      <button
        type="submit"
        className="bg-black p-2 text-white"
        disabled={pending}
      >
        {pending ? "Saving..." : "Save Changes"}
      </button>

      {state?.error ? (
        <FlashMessage message={state.error} variant="error" />
      ) : null}

      {state?.success ? (
        <FlashMessage message={state.success} variant="success" />
      ) : null}
    </form>
  );
}