import { prisma } from "@/lib/prisma/client";
import {
  ContentManager,
  type FieldConfig,
  type DisplayConfig,
} from "@/components/admin/content-manager";

export const metadata = { title: "Layanan" };

const fields: FieldConfig[] = [
  { name: "title", label: "Nama Layanan", type: "text", required: true },
  { name: "slug", label: "Slug (kosongkan = otomatis)", type: "text" },
  { name: "icon", label: "Ikon", type: "text", placeholder: "file-text" },
  { name: "formUrl", label: "URL Formulir", type: "url", placeholder: "https://..." },
  { name: "description", label: "Deskripsi", type: "textarea", required: true },
  { name: "isActive", label: "Status", type: "checkbox" },
];

const display: DisplayConfig = {
  titleKey: "title",
  metaKeys: ["slug", "formUrl"],
  badgeKey: "isActive",
  badgeLabels: {
    true: { label: "Aktif", className: "bg-green-50 text-green-700" },
    false: { label: "Nonaktif", className: "bg-neutral-100 text-neutral-600" },
  },
};

export default async function ServicesAdminPage() {
  const items = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return (
    <ContentManager
      model="service"
      title="Layanan"
      items={items}
      fields={fields}
      display={display}
    />
  );
}
