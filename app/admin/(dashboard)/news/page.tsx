import { prisma } from "@/lib/prisma/client";
import {
  ContentManager,
  type FieldConfig,
  type DisplayConfig,
} from "@/components/admin/content-manager";

export const metadata = { title: "Berita & Pengumuman" };

const fields: FieldConfig[] = [
  { name: "title", label: "Judul", type: "text", required: true },
  { name: "category", label: "Kategori", type: "text", placeholder: "Berita / Pengumuman / CSR" },
  { name: "slug", label: "Slug (kosongkan = otomatis)", type: "text" },
  { name: "thumbnailUrl", label: "Thumbnail", type: "upload" },
  { name: "excerpt", label: "Ringkasan", type: "textarea" },
  { name: "content", label: "Konten", type: "textarea", required: true },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "DRAFT", label: "Draft" },
      { value: "PUBLISHED", label: "Terbit" },
    ],
  },
  { name: "publishedAt", label: "Tanggal Terbit", type: "date" },
  { name: "seoTitle", label: "SEO Title", type: "text" },
  { name: "seoDescription", label: "SEO Description", type: "text" },
];

const display: DisplayConfig = {
  titleKey: "title",
  metaKeys: ["category", "slug"],
  badgeKey: "status",
  badgeLabels: {
    PUBLISHED: { label: "Terbit", className: "bg-green-50 text-green-700" },
    DRAFT: { label: "Draft", className: "bg-neutral-100 text-neutral-600" },
  },
};

export default async function NewsAdminPage() {
  const items = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <ContentManager
      model="news"
      title="Berita & Pengumuman"
      items={items}
      fields={fields}
      display={display}
    />
  );
}
