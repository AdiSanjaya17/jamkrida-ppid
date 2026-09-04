import { prisma } from "@/lib/prisma/client";
import {
  ContentManager,
  type FieldConfig,
  type DisplayConfig,
} from "@/components/admin/content-manager";

export const metadata = { title: "Mitra" };

const fields: FieldConfig[] = [
  { name: "name", label: "Nama Mitra", type: "text", required: true },
  { name: "logoUrl", label: "Logo", type: "upload" },
  { name: "websiteUrl", label: "Website", type: "url" },
  { name: "order", label: "Urutan", type: "number" },
  { name: "isActive", label: "Status", type: "checkbox" },
];

const display: DisplayConfig = {
  titleKey: "name",
  metaKeys: ["websiteUrl"],
  badgeKey: "isActive",
  badgeLabels: {
    true: { label: "Aktif", className: "bg-green-50 text-green-700" },
    false: { label: "Nonaktif", className: "bg-neutral-100 text-neutral-600" },
  },
};

export default async function PartnersAdminPage() {
  const items = await prisma.partner.findMany({ orderBy: { order: "asc" } });
  return (
    <ContentManager
      model="partner"
      title="Mitra"
      items={items}
      fields={fields}
      display={display}
    />
  );
}
