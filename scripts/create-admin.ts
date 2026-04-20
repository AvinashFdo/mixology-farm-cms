import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@mixologyfarm.com";
  const plainPassword = "Admin12345!";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      name: "Main Admin",
      email,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user ready:", admin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });