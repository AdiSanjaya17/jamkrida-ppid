// Konten seksi homepage: default (berbasis array agar bisa tambah/hapus) + parsing JSON DB

export type SectionData = Record<string, unknown>;

export const sectionDefaults: Record<string, SectionData> = {
  informasi_publik: {
    cats: [
      { num: "01", title: "Informasi Berkala", desc: "Diperbarui dan diumumkan secara rutin, sekurang-kurangnya setiap 6 bulan.", href: "/informasi-berkala" },
      { num: "02", title: "Informasi Setiap Saat", desc: "Siap tersedia dan langsung diberikan ketika ada permohonan.", href: "/informasi-setiap-saat" },
      { num: "03", title: "Informasi Serta Merta", desc: "Terkait hajat hidup orang banyak, wajib diumumkan tanpa penundaan.", href: "/informasi-serta-merta" },
      { num: "04", title: "Informasi Dikecualikan", desc: "Tidak dapat diakses pemohon sesuai UU No. 14 Tahun 2008.", href: "/informasi-berkala" },
    ],
    cards: [
      {
        title: "Informasi Publik",
        tag: "Kategori Terbuka",
        desc: "Informasi Publik adalah informasi yang dapat diakses oleh Pemohon Informasi Publik sebagaimana dimaksud dalam Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik.",
        meta: "UU No. 14 Tahun 2008",
        btn: "Lihat (SK)",
        href: "/informasi-setiap-saat",
      },
      {
        title: "Informasi yang Dikecualikan",
        tag: "Kategori Terbatas",
        desc: "Informasi yang dikecualikan adalah informasi yang tidak dapat diakses oleh Pemohon Informasi Publik sebagaimana dimaksud dalam Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik.",
        meta: "Uji Konsekuensi",
        btn: "Lihat (SK)",
        href: "/informasi-berkala",
      },
    ],
  },
  tentang: {
    kicker: "Tentang Kami",
    heading1: "Keterbukaan Informasi Publik",
    heading2: "PT Jamkrida Bali Mandara",
    paragraph:
      "PPID PT Jamkrida Bali Mandara (Perseroda) merupakan Website Pejabat Pengelola Informasi dan Dokumentasi yang dikelola oleh PT Jamkrida Bali Mandara (Perseroda) untuk berbagai informasi untuk umum, dan pada tanggal 12 Agustus 2022 Direksi telah mengeluarkan Surat Keputusan Direksi Nomor: 038/Kep-Dir/VIII/2022 tentang Penetapan Pejabat Pengelola Informasi dan Dokumentasi (PPID) PT Jamkrida Bali Mandara (Perseroda).",
    skLabel: "Dasar Hukum & Penetapan",
    skTitle: "Surat Keputusan Direksi No. 038/Kep-Dir/VIII/2022",
    skMeta: "Ditetapkan 12 Agustus 2022 · Berlandaskan UU No. 14 Tahun 2008",
    btn1Label: "Profil PPID Lengkap",
    btn1Href: "/profil-ppid",
    btn2Label: "Struktur Organisasi",
    btn2Href: "/struktur-organisasi",
    image: "/jadwal-pelayanan.png",
    imagePosition: "right",
    cardCaption: "Dokumen Resmi Penetapan PPID Jamkrida Bali Mandara",
    cardSub: "SK Direksi Nomor: 038/Kep-Dir/VIII/2022",
  },
  layanan_ppid: {
    kicker: "Layanan PPID",
    heading: "Jadwal Pelayanan Informasi Publik",
    description:
      "Ruang Layanan Informasi Publik PT Jamkrida Bali Mandara (Perseroda) melayani permohonan informasi secara langsung maupun daring pada hari kerja.",
    scheduleTitle: "Waktu Pelayanan Operasional",
    schedules: [
      { days: "Senin – Kamis", time: "08.00 – 16.00 WITA" },
      { days: "Jumat", time: "08.00 – 15.30 WITA" },
    ],
    btn1Label: "Ajukan Permohonan Online",
    btn1Href: "/permohonan-informasi",
    btn2Label: "Hubungi Kami",
    btn2Href: "/kontak",
    panelKicker: "Ruang Layanan Informasi Publik",
    panelTitle: "Petugas Pelayanan Informasi",
    petugas: [
      { initial: "W", name: "Si Wayan", role: "Petugas Pelayanan & Verifikasi", url: "https://docs.google.com/forms/d/e/1FAIpQLSd1U6vWAij0ikw_vg9p4fT7eQLbyE4UJdhoPAuvHKOwn_7ntw/viewform" },
      { initial: "M", name: "Si Made", role: "Petugas Dokumentasi & Arsip", url: "https://docs.google.com/forms/d/e/1FAIpQLSeF7jffc5eq1v8FA7sKDX05e8wYze6mnh76c2ccnm5jxy6lgg/viewform" },
    ],
    channelsTitle: "Titik Akses & Kanal Komunikasi:",
    channels: [
      { icon: "address", label: "Ruang Layanan Langsung:" },
      { icon: "phone", label: "Telepon Resmi:" },
      { icon: "online", label: "Layanan Online:" },
      { icon: "website", label: "Situs Korporat:" },
    ],
  },
  statistik: {
    stats: [
      { label: "Dokumen Publik", value: "", source: "documents" },
      { label: "Informasi Tersedia", value: "", source: "information" },
      { label: "Permohonan Informasi", value: "", source: "" },
      { label: "Tingkat Penyelesaian", value: "", source: "" },
    ],
    footnote:
      "",
  },
  berita_terbaru: {
    kicker: "Publikasi & Berita",
    heading: "Berita Terbaru PPID",
    emptyText:
      "Belum ada berita yang dipublikasikan. Tambahkan lewat menu Berita & Pengumuman di CMS.",
  },
  mitra: {
    kicker: "Dipercaya Bersama",
    heading: "Mitra Kami",
  },
};

// Normalisasi konten lama (scalar cat1Title, sched1Days, dll) ke bentuk array baru
function normalize(key: string, data: SectionData): SectionData {
  const out: SectionData = { ...data };

  if (key === "informasi_publik" && !Array.isArray(out.cats)) {
    out.cats = [1, 2, 3, 4].map((i) => ({
      num: out[`cat${i}Num`] ?? String(i).padStart(2, "0"),
      title: out[`cat${i}Title`] ?? "",
      desc: out[`cat${i}Desc`] ?? "",
      href: out[`cat${i}Href`] ?? "#",
    }));
    out.cards = [
      { title: out.card1Title ?? "", tag: out.card1Tag ?? "", desc: out.card1Desc ?? "", meta: out.card1Meta ?? "", btn: out.card1Btn ?? "", href: out.card1Href ?? "#" },
      { title: out.card2Title ?? "", tag: out.card2Tag ?? "", desc: out.card2Desc ?? "", meta: out.card2Meta ?? "", btn: out.card2Btn ?? "", href: out.card2Href ?? "#" },
    ];
  }

  if (key === "layanan_ppid" && !Array.isArray(out.schedules)) {
    out.schedules = [1, 2].map((i) => ({
      days: out[`sched${i}Days`] ?? "",
      time: out[`sched${i}Time`] ?? "",
    }));
    out.petugas = [
      { initial: out.petugas1Initial ?? "W", name: out.petugas1Name ?? "Si Wayan", role: out.petugas1Role ?? "", url: out.petugas1Url ?? "" },
      { initial: out.petugas2Initial ?? "M", name: out.petugas2Name ?? "Si Made", role: out.petugas2Role ?? "", url: out.petugas2Url ?? "" },
    ];
    out.channels = [
      { icon: "address", label: out.channelAddressLabel ?? "Ruang Layanan Langsung:" },
      { icon: "phone", label: out.channelPhoneLabel ?? "Telepon Resmi:" },
      { icon: "online", label: out.channelOnlineLabel ?? "Layanan Online:" },
      { icon: "website", label: out.channelWebsiteLabel ?? "Situs Korporat:" },
    ];
  }

  if (key === "statistik" && !Array.isArray(out.stats)) {
    out.stats = [
      { label: out.s1Label ?? "Dokumen Publik", value: "", source: "documents" },
      { label: out.s2Label ?? "Informasi Tersedia", value: "", source: "information" },
      { label: out.s3Label ?? "Permohonan Informasi", value: out.s3Value ?? "", source: "" },
      { label: out.s4Label ?? "Tingkat Penyelesaian", value: out.s4Value ?? "", source: "" },
    ];
  }

  return out;
}

export function parseSectionContent(key: string, json: string | null | undefined): SectionData {
  let data: SectionData = {};
  if (json) {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed === "object" && parsed !== null) data = parsed;
    } catch {
      /* abaikan JSON rusak */
    }
  }
  return normalize(key, data);
}

export function getSectionData(
  rows: { key: string; content: string | null }[],
  key: string
): SectionData {
  const row = rows.find((r) => r.key === key);
  const defaults = sectionDefaults[key] ?? {};
  const stored = parseSectionContent(key, row?.content);
  const merged: SectionData = { ...defaults };
  for (const [k, v] of Object.entries(stored)) merged[k] = v;
  return merged;
}

/** Ambil array dari SectionData dengan fallback ke default */
export function getArray<T>(data: SectionData, key: string, sectionKey: string): T[] {
  if (Array.isArray(data[key])) return data[key] as T[];
  const def = sectionDefaults[sectionKey]?.[key];
  return Array.isArray(def) ? (def as T[]) : [];
}


