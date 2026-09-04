import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Jamkridabali15", 10);
  const user = await prisma.user.updateMany({
    where: { email: "admin@jamkridabali.co.id" },
    data: { passwordHash },
  });
  console.log(`Password admin diperbarui (${user.count} user).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());