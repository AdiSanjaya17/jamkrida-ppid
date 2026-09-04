import { prisma } from "@/lib/prisma/client";
import {
  ContentManager,
  type FieldConfig,
  type DisplayConfig,
} from "@/components/admin/content-manager";

export const metadata = { title: "Halaman Statis" };

const fields: FieldConfig[] = [
  { name: "title", label: "Judul Halaman", type: "text", required: true },
  { name: "slug", label: "Slug (kosongkan = otomatis)", type: "text" },
  { name: "content", label: "Konten", type: "textarea", required: true },
  { name: "seoTitle", label: "SEO Title", type: "text" },
  { name: "seoDescription", label: "SEO Description", type: "text" },
  { name: "isPublished", label: "Status", type: "checkbox" },
];

const display: DisplayConfig = {
  titleKey: "title",
  metaKeys: ["slug"],
  badgeKey: "isPublished",
  badgeLabels: {
    true: { label: "Terbit", className: "bg-green-50 text-green-700" },
    false: { label: "Draft", className: "bg-neutral-100 text-neutral-600" },
  },
};

export default async function PagesAdminPage() {
  const items = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <ContentManager
      model="page"
      title="Halaman Statis"
      items={items}
      fields={fields}
      display={display}
    />
  );
}
