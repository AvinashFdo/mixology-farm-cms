"use client";

import { useActionState } from "react";
import { createMenuItem } from "@/app/admin/menu/items/actions";
import FlashMessage from "@/components/admin/flash-message";

type CategoryOption = {
  id: string;
  name: string;
};

type CreateMenuItemFormProps = {
  categories: CategoryOption[];
};

export default function CreateMenuItemForm({
  categories,
}: CreateMenuItemFormProps) {
  const [state, formAction, pending] = useActionState(createMenuItem, null);

  return (
    <form action={formAction} className="mt-4 flex max-w-md flex-col gap-3">
      <input
        type="text"
        name="name"
        placeholder="Item name"
        className="border p-2"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        className="border p-2"
        rows={4}
      />

      <input
        type="url"
        name="imageUrl"
        placeholder="Image URL"
        className="border p-2"
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        className="border p-2"
        step="0.01"
        min="0"
        required
      />

      <select name="categoryId" className="border p-2" required defaultValue="">
        <option value="" disabled>
          Select category
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="sortOrder"
        placeholder="Sort order"
        className="border p-2"
        defaultValue={0}
      />

      <button
        type="submit"
        className="bg-black p-2 text-white"
        disabled={pending}
      >
        {pending ? "Adding..." : "Add Menu Item"}
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