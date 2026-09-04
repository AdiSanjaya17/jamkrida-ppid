import { sectionDefaults, type SectionData } from "@/lib/section-content";

export type SectionRow = {
  id: string;
  key: string;
  label: string;
  isActive: boolean;
  content: SectionData;
};

export const editableSections: { key: string; label: string }[] = [
  { key: "informasi_publik", label: "Kategori Informasi & Kartu SK" },
  { key: "tentang", label: "Tentang Kami" },
  { key: "layanan_ppid", label: "Jadwal Pelayanan" },
  { key: "statistik", label: "Statistik" },
  { key: "berita_terbaru", label: "Berita Terbaru" },
  { key: "mitra", label: "Mitra Kami" },
];

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "image" | "select";
  options?: { value: string; label: string }[];
};

export type GroupDef = {
  key?: string; // wajib untuk repeatable (nama array di content)
  label: string;
  itemLabel?: string;
  repeatable?: boolean;
  fields: FieldDef[];
};

export const sectionFieldDefs: Record<string, GroupDef[]> = {
  informasi_publik: [
    {
      key: "cats",
      label: "Kartu Kategori Informasi",
      itemLabel: "Kategori",
      repeatable: true,
      fields: [
        { name: "num", label: "Nomor", type: "text" },
        { name: "title", label: "Judul", type: "text" },
        { name: "desc", label: "Deskripsi", type: "textarea" },
        { name: "href", label: "Link", type: "text" },
      ],
    },
    {
      key: "cards",
      label: "Kartu Besar (Terbuka / Terbatas)",
      itemLabel: "Kartu",
      repeatable: true,
      fields: [
        { name: "title", label: "Judul", type: "text" },
        { name: "tag", label: "Tag Kecil", type: "text" },
        { name: "desc", label: "Deskripsi", type: "textarea" },
        { name: "meta", label: "Teks Kaki", type: "text" },
        { name: "btn", label: "Label Tombol", type: "text" },
        { name: "href", label: "Link Tombol", type: "text" },
      ],
    },
  ],
  // __P2__
};

export function getDefaultContent(key: string): SectionData {
  return sectionDefaults[key] ?? {};
}
