import { prisma } from "@/lib/prisma/client";
import {
  ContentManager,
  type FieldConfig,
  type DisplayConfig,
} from "@/components/admin/content-manager";

export const metadata = { title: "Tim Kami" };

const fields: FieldConfig[] = [
  { name: "name", label: "Nama", type: "text", required: true },
  { name: "role", label: "Jabatan / Peran", type: "text", required: true },
  { name: "photoUrl", label: "Foto", type: "upload" },
  { name: "order", label: "Urutan", type: "number" },
  { name: "isActive", label: "Status", type: "checkbox" },
];

const display: DisplayConfig = {
  titleKey: "name",
  metaKeys: ["role"],
  badgeKey: "isActive",
  badgeLabels: {
    true: { label: "Aktif", className: "bg-green-50 text-green-700" },
    false: { label: "Nonaktif", className: "bg-neutral-100 text-neutral-600" },
  },
};

export default async function TimAdminPage() {
  const items = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  return (
    <ContentManager
      model="teamMember"
      title="Tim Kami"
      items={items}
      fields={fields}
      display={display}
    />
  );
}