"use server";

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

export type HeroSlideInput = {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  backgroundUrl: string;
  overlayColor?: string | null;
  overlayOpacity?: number;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  ctaLabelSecondary?: string | null;
  ctaUrlSecondary?: string | null;
  isActive?: boolean;
};

export async function createHeroSlide(input: HeroSlideInput) {
  await requireAdmin();
  const last = await prisma.heroSlide.findFirst({
    orderBy: { order: "desc" },
  });

  const slide = await prisma.heroSlide.create({
    data: {
      ...input,
      order: (last?.order ?? -1) + 1,
    },
  });

  revalidatePath("/admin/homepage");
  return slide;
}

export async function updateHeroSlide(id: string, input: HeroSlideInput) {
  await requireAdmin();
  const slide = await prisma.heroSlide.update({
    where: { id },
    data: input,
  });

  revalidatePath("/admin/homepage");
  return slide;
}

export async function deleteHeroSlide(id: string) {
  await requireAdmin();
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/admin/homepage");
}

export async function moveHeroSlide(id: string, direction: "up" | "down") {
  await requireAdmin();
  const current = await prisma.heroSlide.findUnique({ where: { id } });
  if (!current) return;

  const neighbor =
    direction === "up"
      ? await prisma.heroSlide.findFirst({
          where: { order: { lt: current.order } },
          orderBy: { order: "desc" },
        })
      : await prisma.heroSlide.findFirst({
          where: { order: { gt: current.order } },
          orderBy: { order: "asc" },
        });

  if (!neighbor) return;

  await prisma.$transaction([
    prisma.heroSlide.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.heroSlide.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  revalidatePath("/admin/homepage");
}

export async function updateHomepageSection(
  id: string,
  input: {
    title?: string | null;
    subtitle?: string | null;
    isActive?: boolean;
    content?: string | null;
  }
) {
  await requireAdmin();
  const section = await prisma.homepageSection.update({
    where: { id },
    data: input,
  });

  revalidatePath("/admin/homepage");
  return section;
}