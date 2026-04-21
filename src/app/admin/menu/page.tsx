import { prisma } from "@/lib/prisma";
import { deleteMenuCategory } from "./actions";
import CreateCategoryForm from "@/components/admin/create-category-form";
import FlashMessage from "@/components/admin/flash-message";

export default async function AdminMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  const categories = await prisma.menuCategory.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });

  return (
    <main>
      <h1>Menu Categories</h1>

    {message === "deleted" ? (
        <FlashMessage 
            message="Category deleted successfully."
            clearUrl={true}
        />
    ) : null}

      <CreateCategoryForm />

      <div className="mt-8">
        {categories.length === 0 ? (
          <p>No categories yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between border p-3"
              >
                <span>
                  {category.name} ({category.slug}){" "}
                  <span
                    className={
                      category.isActive ? "text-green-600" : "text-red-600"
                    }
                  >
                    [{category.isActive ? "Active" : "Inactive"}]
                  </span>
                </span>

                <form action={deleteMenuCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <button
                    type="submit"
                    className="bg-red-600 px-3 py-1 text-white"
                  >
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}