"use client";

import { useActionState } from "react";
import { createMenuCategory } from "@/app/admin/menu/actions";
import FlashMessage from "@/components/admin/flash-message";

export default function CreateCategoryForm() {
  const [state, formAction, pending] = useActionState(createMenuCategory, null);

  return (
    <form action={formAction} className="mt-4 flex max-w-md flex-col gap-3">
      <input
        type="text"
        name="name"
        placeholder="Category name"
        className="border p-2"
        required
      />

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
        {pending ? "Adding..." : "Add Category"}
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