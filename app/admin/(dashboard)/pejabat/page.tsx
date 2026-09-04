import { prisma } from "@/lib/prisma/client";
import {
  ContentManager,
  type FieldConfig,
  type DisplayConfig,
} from "@/components/admin/content-manager";

export const metadata = { title: "Profil Pejabat" };

const fields: FieldConfig[] = [
  { name: "name", label: "Nama Lengkap (dengan gelar)", type: "text", required: true },
  { name: "jabatan", label: "Jabatan", type: "text", required: true },
  {
    name: "category",
    label: "Kategori",
    type: "select",
    required: true,
    options: [
      { value: "KOMISARIS", label: "Dewan Komisaris" },
      { value: "DIREKSI", label: "Direksi" },
    ],
  },
  { name: "photoUrl", label: "Foto Profil", type: "upload" },
  { name: "bio", label: "Biodata Lengkap", type: "textarea", required: true },
  { name: "order", label: "Urutan", type: "number" },
  { name: "isActive", label: "Status", type: "checkbox" },
];

const display: DisplayConfig = {
  titleKey: "name",
  metaKeys: ["jabatan"],
  badgeKey: "category",
  badgeLabels: {
    KOMISARIS: { label: "Komisaris", className: "bg-amber-50 text-amber-700" },
    DIREKSI: { label: "Direksi", className: "bg-blue-50 text-blue-700" },
  },
};

export default async function PejabatAdminPage() {
  const items = await prisma.pejabat.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  return (
    <ContentManager
      model="pejabat"
      title="Profil Pejabat (Komisaris & Direksi)"
      items={items}
      fields={fields}
      display={display}
    />
  );
}