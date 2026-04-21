import { prisma } from "@/lib/prisma";
import EditMenuItemForm from "@/components/admin/edit-menu-item-form";
import { updateMenuItem } from "./actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMenuItemPage({ params }: PageProps) {
  const { id } = await params;

  const [item, categories] = await Promise.all([
    prisma.menuItem.findUnique({
      where: { id },
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

  if (!item) {
    return <p>Item not found.</p>;
  }

  const boundUpdateMenuItem = updateMenuItem.bind(null, item.id);

  return (
    <main>
      <h1>Edit Menu Item</h1>

      <EditMenuItemForm
        item={{
          id: item.id,
          name: item.name,
          description: item.description,
          imageUrl: item.imageUrl,
          price: item.price.toString(),
          categoryId: item.categoryId,
          sortOrder: item.sortOrder,
        }}
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
        action={boundUpdateMenuItem}
      />
    </main>
  );
}