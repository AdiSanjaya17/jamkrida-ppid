"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/client";
import bcrypt from "bcryptjs";

export type ChangePasswordResult = { ok: boolean; error?: string };

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResult> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { ok: false, error: "Sesi habis — silakan login ulang." };
  }

  if (newPassword.length < 8) {
    return { ok: false, error: "Kata sandi baru minimal 8 karakter." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false, error: "User tidak ditemukan." };

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return { ok: false, error: "Kata sandi saat ini salah." };
  }

  if (await bcrypt.compare(newPassword, user.passwordHash)) {
    return { ok: false, error: "Kata sandi baru tidak boleh sama dengan yang lama." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { ok: true };
}
