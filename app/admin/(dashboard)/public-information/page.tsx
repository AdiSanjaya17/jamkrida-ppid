import { prisma } from "@/lib/prisma/client";
import {
  ContentManager,
  type FieldConfig,
  type DisplayConfig,
} from "@/components/admin/content-manager";

export const metadata = { title: "Informasi Publik" };

const fields: FieldConfig[] = [
  { name: "title", label: "Judul", type: "text", required: true },
  {
    name: "category",
    label: "Kategori",
    type: "select",
    required: true,
    options: [
      { value: "BERKALA", label: "Berkala" },
      { value: "SETIAP_SAAT", label: "Setiap Saat" },
      { value: "SERTA_MERTA", label: "Serta Merta" },
      { value: "DIKECUALIKAN", label: "Dikecualikan" },
    ],
  },
  { name: "year", label: "Tahun", type: "number" },
  { name: "publicationDate", label: "Tanggal Publikasi", type: "date" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "PUBLISHED", label: "Terbit" },
      { value: "DRAFT", label: "Draft" },
    ],
  },
  { name: "description", label: "Deskripsi", type: "textarea" },
  { name: "content", label: "Konten", type: "textarea" },
];

const display: DisplayConfig = {
  titleKey: "title",
  metaKeys: ["category", "year"],
  badgeKey: "status",
  badgeLabels: {
    PUBLISHED: { label: "Terbit", className: "bg-green-50 text-green-700" },
    DRAFT: { label: "Draft", className: "bg-neutral-100 text-neutral-600" },
  },
};

export default async function PublicInformationAdminPage() {
  const items = await prisma.publicInformation.findMany({
    orderBy: { createdAt: "desc" },
  });
  return (
    <ContentManager
      model="publicInformation"
      title="Informasi Publik"
      items={items}
      fields={fields}
      display={display}
    />
  );
}
