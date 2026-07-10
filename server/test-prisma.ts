import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  console.log("✅ Connected successfully");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
});
