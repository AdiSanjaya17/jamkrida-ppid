import { prisma } from "@/lib/prisma/client";
import {
  ContentManager,
  type FieldConfig,
  type DisplayConfig,
} from "@/components/admin/content-manager";

export const metadata = { title: "Dokumen & Laporan" };

const fields: FieldConfig[] = [
  { name: "title", label: "Judul Dokumen", type: "text", required: true },
  { name: "category", label: "Kategori", type: "text", required: true, placeholder: "Laporan Tahunan / Laporan Keuangan / LHKPN" },
  { name: "year", label: "Tahun", type: "number", required: true },
  { name: "fileUrl", label: "File", type: "upload" },
  { name: "fileType", label: "Tipe File", type: "text", placeholder: "PDF" },
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
];

const display: DisplayConfig = {
  titleKey: "title",
  metaKeys: ["category", "year", "fileType"],
  badgeKey: "status",
  badgeLabels: {
    PUBLISHED: { label: "Terbit", className: "bg-green-50 text-green-700" },
    DRAFT: { label: "Draft", className: "bg-neutral-100 text-neutral-600" },
  },
};

export default async function DocumentsAdminPage() {
  const items = await prisma.document.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <ContentManager
      model="document"
      title="Dokumen & Laporan"
      items={items}
      fields={fields}
      display={display}
    />
  );
}
