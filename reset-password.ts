import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      "SEED_ADMIN_PASSWORD tidak diset. Tambahkan SEED_ADMIN_PASSWORD=<password-kuat> di file .env sebelum reset password."
    );
  }
  const passwordHash = await bcrypt.hash(password, 10);
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