import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const adminCount = await prisma.adminUser.count();

  return (
    <main>
      <h1>Admin Dashboard</h1>
      <p>Total admin users: {adminCount}</p>
    </main>
  );
}