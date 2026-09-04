"use server";

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

export type NavigationInput = {
  title: string;
  url?: string | null;
  slug?: string | null;
  icon?: string | null;
  isActive?: boolean;
  parentId?: string | null;
};

export async function createNavigationItem(input: NavigationInput) {
  await requireAdmin();
  const last = await prisma.navigationItem.findFirst({
    where: { parentId: input.parentId ?? null },
    orderBy: { order: "desc" },
  });

  const item = await prisma.navigationItem.create({
    data: {
      title: input.title,
      url: input.url ?? null,
      slug: input.slug ?? null,
      icon: input.icon ?? null,
      isActive: input.isActive ?? true,
      parentId: input.parentId ?? null,
      order: (last?.order ?? -1) + 1,
    },
  });

  revalidatePath("/admin/navigation");
  return item;
}

export async function updateNavigationItem(
  id: string,
  input: NavigationInput
) {
  await requireAdmin();
  const item = await prisma.navigationItem.update({
    where: { id },
    data: {
      title: input.title,
      url: input.url ?? null,
      slug: input.slug ?? null,
      icon: input.icon ?? null,
      isActive: input.isActive,
    },
  });

  revalidatePath("/admin/navigation");
  return item;
}

export async function deleteNavigationItem(id: string) {
  // onDelete: Cascade — anak-anaknya ikut terhapus.
  await requireAdmin();
  await prisma.navigationItem.delete({ where: { id } });
  revalidatePath("/admin/navigation");
}

export async function reorderNavigationItems(
  ids: string[],
  parentId: string | null
) {
  await requireAdmin();
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.navigationItem.update({
        where: { id },
        data: { order: index, parentId },
      })
    )
  );

  revalidatePath("/admin/navigation");
}