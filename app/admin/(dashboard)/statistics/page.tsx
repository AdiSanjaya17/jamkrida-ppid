import { prisma } from "@/lib/prisma/client";
import {
  ContentManager,
  type FieldConfig,
  type DisplayConfig,
} from "@/components/admin/content-manager";

export const metadata = { title: "Statistik" };

const fields: FieldConfig[] = [
  { name: "title", label: "Nama Statistik", type: "text", required: true },
  { name: "value", label: "Nilai", type: "text", required: true, placeholder: "1.250" },
  { name: "order", label: "Urutan", type: "number" },
  { name: "description", label: "Deskripsi", type: "text" },
  { name: "isActive", label: "Status", type: "checkbox" },
];

const display: DisplayConfig = {
  titleKey: "title",
  metaKeys: ["value", "description"],
  badgeKey: "isActive",
  badgeLabels: {
    true: { label: "Aktif", className: "bg-green-50 text-green-700" },
    false: { label: "Nonaktif", className: "bg-neutral-100 text-neutral-600" },
  },
};

export default async function StatisticsAdminPage() {
  const items = await prisma.statistic.findMany({ orderBy: { order: "asc" } });
  return (
    <ContentManager
      model="statistic"
      title="Statistik"
      items={items}
      fields={fields}
      display={display}
    />
  );
}
