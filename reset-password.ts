import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) {
    console.warn(
      "⚠️  SEED_ADMIN_PASSWORD tidak diset di .env — memakai password default yang TERTULIS DI KODE. Segera ganti password admin setelah login pertama!"
    );
  }
  const passwordHash = await bcrypt.hash(password ?? "Jamkridabali15", 10);
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