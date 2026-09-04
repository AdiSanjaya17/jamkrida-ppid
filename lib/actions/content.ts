"use server";

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

// Whitelist model yang boleh diakses dari CMS
const delegates = {
  news: prisma.news,
  document: prisma.document,
  publicInformation: prisma.publicInformation,
  service: prisma.service,
  statistic: prisma.statistic,
  partner: prisma.partner,
  page: prisma.page,
} as const;

export type ContentModel = keyof typeof delegates;

// Field yang boleh ditulis per model
const fieldWhitelist: Record<ContentModel, string[]> = {
  news: [
    "title", "slug", "excerpt", "content", "thumbnailUrl", "category",
    "status", "publishedAt", "seoTitle", "seoDescription",
  ],
  document: [
    "title", "category", "description", "year", "fileUrl", "fileType",
    "publicationDate", "status",
  ],
  publicInformation: [
    "title", "category", "description", "content", "year", "publicationDate", "status",
  ],
  service: ["title", "slug", "description", "icon", "formUrl", "order", "isActive"],
  statistic: ["title", "value", "description", "order", "isActive"],
  partner: ["name", "logoUrl", "websiteUrl", "order", "isActive"],
  page: ["title", "slug", "content", "seoTitle", "seoDescription", "isPublished"],
};

const numberFields = new Set(["year", "order", "overlayOpacity"]);
const dateFields = new Set(["publishedAt", "publicationDate"]);
const booleanFields = new Set(["isActive", "isPublished"]);

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export async function saveContentItem(
  model: ContentModel,
  id: string | null,
  raw: Record<string, unknown>
) {
  const delegate = delegates[model] as unknown as {
    update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<unknown>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    findFirst: (args: { orderBy: { order: string } }) => Promise<{ order: number } | null>;
  };
  const allowed = fieldWhitelist[model];
  const data: Record<string, unknown> = {};

  for (const key of allowed) {
    if (!(key in raw)) continue;
    let value: unknown = raw[key];

    if (numberFields.has(key)) {
      value = value === "" || value === null ? null : Number(value);
    } else if (dateFields.has(key)) {
      value = value ? new Date(value as string) : null;
    } else if (booleanFields.has(key)) {
      value = Boolean(value);
    } else if (value === "") {
      value = null;
    }
    data[key] = value;
  }

  // Auto-slug untuk model yang punya slug
  if ("slug" in data && !data.slug && "title" in data) {
    data.slug = slugify(String(data.title));
  } else if ("slug" in data && typeof data.slug === "string") {
    data.slug = slugify(data.slug);
  }

  // publishedAt otomatis saat berita dipublikasikan
  if (model === "news" && data.status === "PUBLISHED" && !data.publishedAt) {
    data.publishedAt = new Date();
  }
  if (model === "news" && data.status === "DRAFT") {
    // biarkan publishedAt yang sudah ada
  }

  if (id) {
    await delegate.update({ where: { id }, data });
  } else {
    // Auto-order untuk model berurutan
    if ("order" in data && data.order === null) {
      const last = await delegate.findFirst({ orderBy: { order: "desc" } });
      data.order = (last?.order ?? -1) + 1;
    }
    await delegate.create({ data });
  }

  // Revalidasi admin + beranda publik
  const adminPaths: Record<ContentModel, string> = {
    news: "/admin/news",
    document: "/admin/documents",
    publicInformation: "/admin/public-information",
    service: "/admin/services",
    statistic: "/admin/statistics",
    partner: "/admin/partners",
    page: "/admin/pages",
  };
  revalidatePath(adminPaths[model]);
  revalidatePath("/");
}

export async function deleteContentItem(model: ContentModel, id: string) {
  const delegate = delegates[model] as unknown as {
    delete: (args: { where: { id: string } }) => Promise<unknown>;
  };
  await delegate.delete({ where: { id } });

  const adminPaths: Record<ContentModel, string> = {
    news: "/admin/news",
    document: "/admin/documents",
    publicInformation: "/admin/public-information",
    service: "/admin/services",
    statistic: "/admin/statistics",
    partner: "/admin/partners",
    page: "/admin/pages",
  };
  revalidatePath(adminPaths[model]);
  revalidatePath("/");
}
