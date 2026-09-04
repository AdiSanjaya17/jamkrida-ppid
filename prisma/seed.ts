import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin default (GANTI PASSWORD INI SEGERA SETELAH LOGIN PERTAMA) ---
  const passwordHash = await bcrypt.hash("Jamkridabali15", 10);
  await prisma.user.upsert({
    where: { email: "admin@jamkridabali.co.id" },
    update: {},
    create: {
      name: "Administrator PPID",
      email: "admin@jamkridabali.co.id",
      passwordHash,
      role: "ADMIN",
    },
  });

  // --- Navigasi dasar (idempotent — aman dijalankan berulang) ---
  const navCount = await prisma.navigationItem.count();
  if (navCount === 0) {  const nav = [
    { title: "Beranda", url: "/", order: 0 },
    {
      title: "Tentang",
      url: "/tentang",
      order: 1,
      children: [
        { title: "Profil PPID", url: "/profil-ppid" },
        { title: "Visi & Misi", url: "/visi-misi" },
        { title: "Sejarah PPID", url: "/sejarah-ppid" },
        { title: "Tugas & Fungsi PPID", url: "/tugas-ppid" },
        { title: "Struktur Organisasi", url: "/struktur-organisasi" },
        { title: "Profil Pejabat", url: "/profil-pejabat" },
        { title: "Tim Kami", url: "/tim-kami" },
        { title: "Pemegang Saham", url: "/pemegang-saham" },
        { title: "Pendirian BUMD", url: "/pendirian-bumd" },
        // Ditemukan di situs lama, absen dari brief awal — lihat README
        { title: "Pedoman PPID", url: "/pedoman-ppid" },
      ],
    },
    {
      title: "Informasi",
      url: "/informasi",
      order: 2,
      children: [
        { title: "Informasi Berkala", url: "/informasi-berkala" },
        { title: "Informasi Setiap Saat", url: "/informasi-setiap-saat" },
        { title: "Informasi Serta Merta", url: "/informasi-serta-merta" },
        { title: "Berita", url: "/berita" },
        { title: "Pengumuman", url: "/pengumuman" },
        { title: "CSR", url: "/csr" },
        { title: "Pengadaan Barang & Jasa", url: "/pengadaan" },
        { title: "Penghargaan", url: "/penghargaan" },
        { title: "Karir", url: "/karir" },
        { title: "Agenda", url: "/agenda" },
      ],
    },
    {
      title: "Laporan",
      url: "/laporan",
      order: 3,
      children: [
        { title: "Laporan Tahunan", url: "/laporan-tahunan" },
        { title: "Laporan Auditor", url: "/laporan-auditor" },
        { title: "Laporan Keuangan", url: "/laporan-keuangan" },
        { title: "Rencana Bisnis", url: "/rencana-bisnis" },
        { title: "LHKPN", url: "/lhkpn" },
        { title: "Laporan Pengaduan", url: "/laporan-pengaduan" },
      ],
    },
    { title: "Statistik", url: "/statistik", order: 4 },
    {
      title: "Pengaduan",
      url: "/pengaduan",
      order: 5,
      children: [
        { title: "Permohonan Informasi", url: "/permohonan-informasi" },
        { title: "Keberatan", url: "/keberatan" },
        { title: "Sengketa Informasi", url: "/sengketa-informasi" },
        { title: "Pengaduan", url: "/pengaduan-form" },
      ],
    },
    { title: "Kontak", url: "/kontak", order: 6 },
  ];

  for (const item of nav) {
    const { children, ...parentData } = item;
    const parent = await prisma.navigationItem.create({ data: parentData });
    if (children) {
      for (let i = 0; i < children.length; i++) {
        await prisma.navigationItem.create({
          data: { ...children[i], order: i, parentId: parent.id },
        });
      }
    }
  }
  }

  // --- Slide hero contoh (gradient, sesuai desain final) ---
  const slideCount = await prisma.heroSlide.count();
  if (slideCount === 0) {
    await prisma.heroSlide.createMany({
      data: [
        {
          title: "Transparansi adalah komitmen kami kepada publik",
          subtitle: "Keterbukaan Informasi Publik",
          description:
            "Portal resmi PPID PT Jamkrida Bali Mandara (Perseroda) — akses informasi, laporan, dan layanan publik secara terbuka dan akuntabel.",
          backgroundUrl: "",
          ctaLabel: "Ajukan Permohonan Informasi",
          ctaUrl: "/permohonan-informasi",
          ctaLabelSecondary: "Pelajari PPID",
          ctaUrlSecondary: "/profil-ppid",
          order: 0,
        },
        {
          title: "Akses informasi & laporan keuangan kapan saja",
          subtitle: "Dokumen Publik",
          description:
            "Unduh laporan tahunan, laporan keuangan, dan dokumen publik lainnya secara gratis dan terbuka.",
          backgroundUrl: "",
          ctaLabel: "Lihat Dokumen",
          ctaUrl: "/laporan-tahunan",
          order: 1,
        },
        {
          title: "Sampaikan aspirasi & pengaduan Anda",
          subtitle: "Layanan Publik",
          description:
            "Saluran pengaduan resmi PPID — kami menjamin setiap laporan ditindaklanjuti sesuai prosedur.",
          backgroundUrl: "",
          ctaLabel: "Buat Pengaduan",
          ctaUrl: "/pengaduan-form",
          order: 2,
        },
      ],
    });
  }

  // --- Seksi homepage default ---
  const sections = [
    "hero", "quick_access", "informasi_publik", "layanan_ppid",
    "dokumen_terbaru", "berita_terbaru", "statistik", "tentang",
    "mitra", "cta",
  ];
  for (let i = 0; i < sections.length; i++) {
    await prisma.homepageSection.upsert({
      where: { key: sections[i] },
      update: {},
      create: { key: sections[i], order: i, isActive: true },
    });
  }

  // --- Site settings untuk footer (default values) ---
  const defaultSettings = [
    {
      key: "company_description",
      value:
        "Unit Pelayanan Informasi Publik PT Jamkrida Bali Mandara (Perseroda) — mengawal transparansi informasi publik sesuai UU No. 14 Tahun 2008.",
    },
    { key: "address", value: "Jl. Raya Puputan No. 3, Denpasar, Bali 80234" },
    { key: "phone", value: "(0361) 000000" },
    { key: "email", value: "ppid@jamkridabali.co.id" },
    { key: "facebook_url", value: "https://facebook.com/jamkridabali" },
    { key: "instagram_url", value: "https://instagram.com/jamkridabali" },
    { key: "youtube_url", value: "https://youtube.com/@jamkridabali" },
    { key: "logo_url", value: "" },
  ];
  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // --- Objek Riil dari Website Lama PPID Jamkrida Bali ---
  const { populateRealJamkridaData } = await import("../lib/actions/seed-data");
  await populateRealJamkridaData();

  console.log("Seed selesai dengan data riil PPID Jamkrida Bali. Login dengan admin@jamkridabali.co.id / Jamkridabali15");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
