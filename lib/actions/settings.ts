"use server";

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

export async function saveSiteSetting(key: string, value: string) {
  const trimmedKey = key.trim();
  if (!trimmedKey) return;

  await prisma.siteSetting.upsert({
    where: { key: trimmedKey },
    update: { value },
    create: { key: trimmedKey, value },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

export async function deleteSiteSetting(key: string) {
  await prisma.siteSetting.delete({ where: { key } });
  revalidatePath("/admin/settings");
  revalidatePath("/");
}
