import { prisma } from "@/lib/prisma";
import CreateMenuItemForm from "@/components/admin/create-menu-item-form";
import FlashMessage from "@/components/admin/flash-message";
import { deleteMenuItem, toggleMenuItemStatus } from "./actions";
import Link from "next/link";

export default async function AdminMenuItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  const [items, categories] = await Promise.all([
    prisma.menuItem.findMany({
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        category: true,
      },
    }),
    prisma.menuCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    }),
  ]);

  return (
    <main>
      <h1>Menu Items</h1>

      {message === "deleted" ? (
        <FlashMessage message="Menu item deleted successfully." clearUrl={true} />
      ) : null}

      {message === "updated" ? (
        <FlashMessage message="Menu item updated successfully." clearUrl={true} />
      ) : null}

      <CreateMenuItemForm
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
      />

      <div className="mt-8">
        {items.length === 0 ? (
          <p>No menu items yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border p-3"
              >
                <div className="flex items-start gap-4">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-20 w-20 rounded object-cover border"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center border text-sm text-gray-500">
                      No Image
                    </div>
                  )}

                  <div>
                    <p>
                      <strong>{item.name}</strong>{" "}
                      <span
                        className={
                          item.isActive ? "text-green-600" : "text-red-600"
                        }
                      >
                        [{item.isActive ? "Active" : "Inactive"}]
                      </span>
                    </p>
                    <p>{item.description || "No description"}</p>
                    <p>Price: {item.price.toString()}</p>
                    <p>Category: {item.category.name}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/menu/items/${item.id}/edit`}
                    className="bg-blue-600 px-3 py-1 text-white"
                  >
                    Edit
                  </Link>

                  <form action={toggleMenuItemStatus}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="bg-yellow-600 px-3 py-1 text-white"
                    >
                      {item.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </form>

                  <form action={deleteMenuItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="bg-red-600 px-3 py-1 text-white"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}