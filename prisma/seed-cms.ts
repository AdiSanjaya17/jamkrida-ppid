/**
 * Seed konten CMS (idempotent, aman dijalankan berulang):
 * - Set logo situs dari logo asli situs lama (self-hosted: /logo-ppid.png)
 * - Isi konten section homepage berdasarkan situs lama ppid.jamkridabali.co.id
 * - Isi 4 kartu statistik (dummy, bisa diedit di CMS -> Statistik)
 *
 * Jalankan: npx tsx prisma/seed-cms.ts
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

// Loader .env sederhana (tanpa dependency dotenv)
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const prisma = new PrismaClient();

const sectionContents: Record<string, { label: string; content: Record<string, unknown> }> = {
  informasi_publik: {
    label: "Kategori Informasi & Kartu SK",
    content: {
      cats: [
        { num: "01", title: "Informasi Wajib Berkala", desc: "Informasi yang diperbaharui kemudian disediakan dan diumumkan kepada publik secara rutin atau berkala sekurang-kurangnya setiap 6 bulan sekali.", href: "/informasi-berkala" },
        { num: "02", title: "Informasi Tersedia Setiap Saat", desc: "Informasi yang harus disediakan oleh Badan Publik dan siap tersedia untuk bisa langsung diberikan kepada Pemohon Informasi Publik.", href: "/informasi-setiap-saat" },
        { num: "03", title: "Informasi Serta Merta", desc: "Informasi yang berkaitan dengan hajat hidup orang banyak dan ketertiban umum dan wajib diumumkan secara serta merta tanpa penundaan.", href: "/informasi-serta-merta" },
        { num: "04", title: "Informasi Dikecualikan", desc: "Informasi yang tidak dapat diakses oleh Pemohon Informasi Publik sesuai UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.", href: "/informasi-berkala" },
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
  },
};

sectionContents.tentang = {
  label: "Tentang Kami",
  content: {
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
    image: "/jadwal-pelayanan.jpg",
    imagePosition: "right",
    cardCaption: "Dokumen Resmi Penetapan PPID Jamkrida Bali Mandara",
    cardSub: "SK Direksi Nomor: 038/Kep-Dir/VIII/2022",
  },
};

sectionContents.layanan_ppid = {
  label: "Jadwal Pelayanan",
  content: {
    kicker: "Layanan PPID",
    heading: "Jadwal Pelayanan Informasi Publik",
    description:
      "Ruang Layanan Informasi Publik PT Jamkrida Bali Mandara (Perseroda) melayani permohonan informasi secara langsung maupun daring pada hari kerja.",
    scheduleTitle: "Waktu Pelayanan Operasional",
    schedules: [
      { days: "Senin – Jumat", time: "09.00 – 15.00 WITA" },
      { days: "Istirahat: Senin – Jumat", time: "12.00 – 13.00 WITA" },
    ],
    btn1Label: "Ajukan Permohonan Online",
    btn1Href: "/permohonan-informasi",
    btn2Label: "Hubungi Kami",
    btn2Href: "/kontak",
    panelKicker: "Ruang Layanan Informasi Publik",
    panelTitle: "Petugas Pelayanan Informasi",
    petugas: [
      { initial: "W", name: "Si Wayan", role: "Petugas Pelayanan & Verifikasi" },
      { initial: "M", name: "Si Made", role: "Petugas Layanan Informasi" },
    ],
    channelsTitle: "Titik Akses & Kanal Komunikasi:",
    channelAddressLabel: "Ruang Layanan Langsung:",
    channelPhoneLabel: "Telepon Resmi:",
    channelOnlineLabel: "Layanan Online:",
    channelWebsiteLabel: "Situs Korporat:",
  },
};

sectionContents.statistik = {
  label: "Statistik",
  content: {
    kicker: "PPID dalam Angka",
    heading: "Statistik Pelayanan Informasi",
    stats: [
      { label: "Dokumen Publik", value: "", source: "documents" },
      { label: "Informasi Tersedia", value: "", source: "information" },
      { label: "Permohonan Informasi", value: "240+", source: "" },
      { label: "Tingkat Penyelesaian", value: "98%", source: "" },
    ],
  },
};

sectionContents.berita_terbaru = {
  label: "Berita Terbaru",
  content: {
    kicker: "Publikasi & Berita",
    heading: "Berita Terbaru PPID",
    emptyText: "Belum ada berita yang dipublikasikan. Tambahkan lewat menu Berita & Pengumuman di CMS.",
  },
};

sectionContents.mitra = {
  label: "Mitra Kami",
  content: {
    kicker: "Dipercaya Bersama",
    heading: "Mitra Kami",
  },
};

const dummyStatistics = [
  { title: "Dokumen Publik", value: "120+", description: "Dokumen resmi yang dipublikasikan", order: 0 },
  { title: "Informasi Tersedia", value: "85+", description: "Item informasi publik tersedia", order: 1 },
  { title: "Permohonan Informasi", value: "240+", description: "Permohonan telah dilayani", order: 2 },
  { title: "Tingkat Penyelesaian", value: "98%", description: "Permohonan selesai tepat waktu", order: 3 },
];

async function main() {
  // Section yang di-force isi ulang karena datanya masih kosong/tes
  const FORCE_KEYS = ["informasi_publik", "tentang", "layanan_ppid"];

  // 1. Logo situs (logo asli situs lama sudah di-download ke /public/logo-ppid.png)
  await prisma.siteSetting.upsert({
    where: { key: "logo_url" },
    update: { value: "/logo-ppid.png" },
    create: { key: "logo_url", value: "/logo-ppid.png" },
  });
  console.log("✓ logo_url = /logo-ppid.png");

  // 2. Konten section homepage
  for (const [key, { label, content }] of Object.entries(sectionContents)) {
    const existing = await prisma.homepageSection.findUnique({ where: { key } });
    if (existing) {
      // Isi hanya jika konten masih kosong — jangan menimpa editan admin
      if (FORCE_KEYS.includes(key) || !existing.content || existing.content === "{}" || existing.content === "") {
        await prisma.homepageSection.update({
          where: { key },
          data: { title: existing.title ?? null, content: JSON.stringify(content), isActive: true },
        });
        console.log(`✓ Section "${key}" diisi (sebelumnya kosong)`);
      } else {
        console.log(`• Section "${key}" sudah berisi — dilewati`);
      }
    } else {
      await prisma.homepageSection.create({
        data: { key, title: label, content: JSON.stringify(content), isActive: true },
      });
      console.log(`✓ Section "${key}" dibuat`);
    }
  }

  // 3. Statistik dummy (hanya jika tabel statistik masih kosong)
  const statCount = await prisma.statistic.count();
  if (statCount === 0) {
    await prisma.statistic.createMany({ data: dummyStatistics });
    console.log("✓ 4 statistik dummy dibuat (bisa diedit di CMS → Statistik)");
  } else {
    console.log(`• Tabel statistik sudah berisi ${statCount} baris — dilewati`);
  }

  console.log("\nSeed konten CMS selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());