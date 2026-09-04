import { prisma } from "../prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Implementasi seeding data riil PPID Jamkrida Bali.
 * Modul BIASA (bukan "use server") — dipanggil dari:
 *  1. lib/actions/seed-data.ts (server action CMS, terproteksi requireAdmin)
 *  2. prisma/seed.ts (script CLI, jalur tepercaya di sisi server)
 */
export async function populateRealJamkridaData() {
  // 1. Dokumen Resmi
  const documentsData = [
    {
      title: "Laporan Tahunan Pelayanan Informasi Publik PPID Tahun 2024",
      category: "Laporan Tahunan",
      description: "Laporan komprehensif penyelenggaraan dan rekapitulasi pelayanan informasi publik PT Jamkrida Bali Mandara (Perseroda) selama tahun buku 2024.",
      year: 2024,
      fileUrl: "https://drive.google.com/file/d/1XTtaRlakgqGi6L5fJBSKzAKw1CX01DfV/view?usp=sharing",
      fileType: "PDF",
      publicationDate: new Date("2024-12-31"),
      status: "PUBLISHED" as const,
    },
    {
      title: "Laporan Keuangan Tahunan PT Jamkrida Bali Mandara (Perseroda) Tahun 2024",
      category: "Laporan Keuangan",
      description: "Laporan posisi keuangan, laba rugi, dan catatan atas laporan keuangan yang telah diaudit oleh Kantor Akuntan Publik independen.",
      year: 2024,
      fileUrl: "https://drive.google.com/file/d/1XTtaRlakgqGi6L5fJBSKzAKw1CX01DfV/view?usp=sharing",
      fileType: "PDF",
      publicationDate: new Date("2024-12-31"),
      status: "PUBLISHED" as const,
    },
    {
      title: "Laporan Tahunan PT Jamkrida Bali Mandara (Perseroda) Tahun 2023",
      category: "Laporan Tahunan",
      description: "Laporan tahunan kinerja operasional dan bisnis PT Jamkrida Bali Mandara (Perseroda) tahun 2023.",
      year: 2023,
      fileUrl: "https://drive.google.com/file/d/1XTtaRlakgqGi6L5fJBSKzAKw1CX01DfV/view?usp=sharing",
      fileType: "PDF",
      publicationDate: new Date("2023-12-31"),
      status: "PUBLISHED" as const,
    },
    {
      title: "Surat Keputusan Direksi No. 038/Kep-Dir/VIII/2022 tentang Penetapan PPID",
      category: "Dasar Hukum",
      description: "Landasan hukum penetapan Pejabat Pengelola Informasi dan Dokumentasi (PPID) pada PT Jamkrida Bali Mandara (Perseroda).",
      year: 2022,
      fileUrl: "https://drive.google.com/file/d/1XTtaRlakgqGi6L5fJBSKzAKw1CX01DfV/view?usp=sharing",
      fileType: "PDF",
      publicationDate: new Date("2022-08-12"),
      status: "PUBLISHED" as const,
    },
    {
      title: "Surat Keputusan Direksi tentang Penetapan Daftar Informasi yang Dikecualikan",
      category: "Dasar Hukum",
      description: "Penetapan klasifikasi informasi yang dikecualikan berdasarkan hasil uji konsekuensi sesuai UU No. 14 Tahun 2008.",
      year: 2022,
      fileUrl: "https://drive.google.com/file/d/1zz-lMmX-QowzcfSzmhgIfwnl4uRWDNKU/view?usp=sharing",
      fileType: "PDF",
      publicationDate: new Date("2022-08-12"),
      status: "PUBLISHED" as const,
    },
    {
      title: "Maklumat Pelayanan Informasi Publik PT Jamkrida Bali Mandara (Perseroda)",
      category: "Pedoman PPID",
      description: "Komitmen tertulis PPID Jamkrida Bali dalam memberikan pelayanan informasi yang cepat, akurat, dan transparan bagi seluruh pemohon.",
      year: 2023,
      fileUrl: "https://drive.google.com/file/d/1XTtaRlakgqGi6L5fJBSKzAKw1CX01DfV/view?usp=sharing",
      fileType: "PDF",
      publicationDate: new Date("2023-01-15"),
      status: "PUBLISHED" as const,
    },
  ];

  for (const doc of documentsData) {
    const existing = await prisma.document.findFirst({ where: { title: doc.title } });
    if (!existing) {
      await prisma.document.create({ data: doc });
    }
  }

  // 2. Berita Riil dari ppid.jamkridabali.co.id
  const newsData = [
    {
      title: 'Puncak Perayaan HUT ke-15 Tahun, Jamkrida Bali Luncurkan Logo Baru dan Tegaskan Langkah "Go Nasional"',
      slug: "puncak-perayaan-hut-ke-15-tahun-jamkrida-bali-luncurkan-logo-baru-dan-tegaskan-langkah-go-nasional",
      excerpt: "PT Jamkrida Bali Mandara (Perseroda) merayakan puncak HUT ke-15 dengan meluncurkan logo baru dan mempertegas langkah ekspansi penjaminan ke tingkat nasional.",
      content: `DENPASAR – PT Jamkrida Bali Mandara (Perseroda) atau Jamkrida Bali merayakan puncak Hari Ulang Tahun (HUT) ke-15 dengan penuh semangat kebersamaan dan inovasi. Pada momentum bersejarah ini, perseroan secara resmi meluncurkan logo baru perusahaan yang mencerminkan transformasi modern, adaptif, dan siap melangkah "Go Nasional".\n\nDirektur Utama Jamkrida Bali menyampaikan bahwa selama 15 tahun berkiprah, perseroan telah berhasil menorehkan kinerja positif yang berkelanjutan dalam mendukung pertumbuhan UMKM dan koperasi di Bali, dan kini saatnya memperluas manfaat penjaminan ke kancah nasional dengan tata kelola yang semakin transparan dan berdaya saing tinggi.`,
      thumbnailUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/08/DSC06137-scaled.webp",
      images: JSON.stringify([
        "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/08/DSC06137-scaled.webp",
        "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/07/WhatsApp-Image-2026-07-22-at-18.29.06-3.webp",
      ]),
      category: "Berita",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-08-11"),
      seoTitle: "Puncak Perayaan HUT ke-15 Tahun, Jamkrida Bali Luncurkan Logo Baru",
      seoDescription: "Jamkrida Bali merayakan HUT ke-15 dengan logo baru dan langkah strategis Go Nasional.",
    },
    {
      title: "PT Jamkrida Bali Mandara (Perseroda) Laksanakan Tirtayatra sebagai Wujud Syukur Menyongsong Transformasi",
      slug: "pt-jamkrida-bali-mandara-perseroda-laksanakan-tirtayatra-sebagai-wujud-syukur",
      excerpt: "Jajaran Direksi, Dewan Komisaris, dan segenap pegawai Jamkrida Bali melaksanakan persembahyangan bersama Tirtayatra di Nusa Penida.",
      content: `NUSA PENIDA – Sebagai bentuk rasa syukur atas pencapaian perseroan serta memohon kelancaran dalam proses transformasi bisnis, jajaran manajemen dan seluruh staf PT Jamkrida Bali Mandara (Perseroda) melaksanakan persembahyangan bersama (Tirtayatra) di sejumlah pura suci di Nusa Penida.\n\nKegiatan spiritual ini menjadi fondasi moral dan kekompakan tim dalam menjalankan tugas profesional dengan menjunjung tinggi nilai integritas, akuntabilitas, dan keterbukaan kepada publik.`,
      thumbnailUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/07/WhatsApp-Image-2026-07-22-at-18.29.06-3.webp",
      images: JSON.stringify([
        "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/07/WhatsApp-Image-2026-07-22-at-18.29.06-3.webp",
      ]),
      category: "Kegiatan",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-07-21"),
      seoTitle: "Tirtayatra PT Jamkrida Bali Mandara di Nusa Penida",
      seoDescription: "Wujud syukur dan permohonan restu menyongsong transformasi perusahaan Jamkrida Bali.",
    },
    {
      title: "PT Jamkrida Bali Mandara Wujudkan Kepedulian Lingkungan Melalui Aksi Bersih Pantai dan Penyaluran CSR",
      slug: "pt-jamkrida-bali-mandara-wujudkan-kepedulian-lingkungan-melalui-aksi-bersih-pantai-dan-csr",
      excerpt: "Dalam rangka menyambut hari jadi ke-15, Jamkrida Bali menggelar aksi bersih pantai dan menyalurkan program Corporate Social Responsibility (CSR).",
      content: `DENPASAR – Kepedulian terhadap kelestarian alam dan masyarakat Bali terus dibuktikan oleh PT Jamkrida Bali Mandara (Perseroda). Melalui gerakan aksi bersih pantai dan penyaluran bantuan sosial CSR kepada masyarakat, perseroan berkomitmen mengintegrasikan tanggung jawab lingkungan ke dalam nilai inti perusahaan.\n\nProgram ini merupakan agenda rutin yang terus diperkuat selaras dengan komitmen keterbukaan informasi dan pelaporan kegiatan sosial publik secara bertanggung jawab.`,
      thumbnailUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/07/WhatsApp-Image-2026-07-12-at-19.09.36-3.webp",
      images: JSON.stringify([
        "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/07/WhatsApp-Image-2026-07-12-at-19.09.36-3.webp",
      ]),
      category: "CSR",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-07-12"),
      seoTitle: "Aksi Bersih Pantai dan CSR HUT Ke-15 Jamkrida Bali",
      seoDescription: "Penyaluran CSR dan aksi bersih pantai oleh Jamkrida Bali Mandara.",
    },
    {
      title: "Transformasi Sistem Human Capital Berbasis AI, Jamkrida Bali Borong Penghargaan Nasional 2025",
      slug: "transformasi-sistem-human-capital-berbasis-ai-jamkrida-bali-borong-penghargaan-nasional-2025",
      excerpt: "Inovasi pengelolaan SDM berbasis teknologi cerdas berhasil mengantarkan Jamkrida Bali meraih predikat bergengsi di ajang Indonesia Human Capital Brilliance Awards (IHCBA).",
      content: `JAKARTA – PT Jamkrida Bali Mandara (Perseroda) kembali mengukir prestasi gemilang di tingkat nasional. Penerapan sistem manajemen SDM terintegrasi berbasis Artificial Intelligence (AI) yang efisien dan transparan membuahkan penghargaan prestisius dalam ajang IHCBA 2025.\n\nPrestasi ini membuktikan bahwa BUMD penjaminan milik pemerintah daerah mampu bersaing dan mengadopsi standar teknologi digital modern guna memberikan pelayanan publik yang semakin prima.`,
      thumbnailUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/01/Awarding-IHCBA-2025-Jamkrida-Bali-BG.jpg",
      images: JSON.stringify([
        "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/01/Awarding-IHCBA-2025-Jamkrida-Bali-BG.jpg",
      ]),
      category: "Penghargaan",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-01-20"),
      seoTitle: "Jamkrida Bali Raih Penghargaan IHCBA Nasional 2025",
      seoDescription: "Penghargaan nasional inovasi Human Capital berbasis AI oleh Jamkrida Bali.",
    },
    {
      title: "Lewat Inovasi CGO, Jamkrida Bali Raih Penghargaan TOP 45 Inovasi Pelayanan Publik MENPANRB",
      slug: "lewat-inovasi-cgo-jamkrida-bali-raih-penghargaan-top-45-inovasi-pelayanan-publik-menpanrb",
      excerpt: "Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (MENPANRB) menobatkan Inovasi CGO Jamkrida Bali sebagai TOP 45 Inovasi Pelayanan Publik Terpuji.",
      content: `JAKARTA – Inovasi Layanan CGO (Customized Guarantee Online) yang dikembangkan oleh PT Jamkrida Bali Mandara (Perseroda) berhasil menyabet predikat bergengsi TOP 45 Inovasi Pelayanan Publik dari Kementerian PAN-RB.\n\nInovasi ini dinilai sukses mempermudah verifikasi dan percepatan penerbitan jaminan serta keterbukaan informasi penjaminan secara cepat, aman, dan tanpa biaya tambahan bagi para pelaku usaha mikro, kecil, dan menengah di Bali.`,
      thumbnailUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2023/11/I-Ketut-Widiana-Karya-SE.-MBA.jpg",
      images: JSON.stringify([
        "https://ppid.jamkridabali.co.id/wp-content/uploads/2023/11/I-Ketut-Widiana-Karya-SE.-MBA.jpg",
      ]),
      category: "Penghargaan",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2023-11-25"),
      seoTitle: "Inovasi CGO Jamkrida Bali Raih TOP 45 MENPANRB",
      seoDescription: "Prestasi TOP 45 Inovasi Pelayanan Publik MENPANRB oleh Jamkrida Bali.",
    },
    {
      title: "HUT Ke-15 Jamkrida Bali Mandara, Momentum 'Elevate' Menuju Perusahaan Penjaminan Terbaik di Indonesia",
      slug: "hut-ke-15-jamkrida-bali-mandara-momentum-elevate-menuju-perusahaan-penjaminan-terbaik-di-indonesia",
      excerpt: "Perayaan HUT Ke-15 Tahun PT Jamkrida Bali Mandara (Perseroda) mengusung tema Elevate untuk mendorong lompatan kinerja perseroan ke kancah nasional.",
      content: `DENPASAR – PT Jamkrida Bali Mandara (Perseroda) memperingati hari jadinya yang ke-15 dengan komitmen penuh melakukan elevasi pada seluruh aspek layanan, mulai dari digitalisasi proses penjaminan, penguatan modal, hingga kepatuhan tata kelola perusahaan yang transparan dan akuntabel.\n\nAcara dihadiri oleh pemangku kepentingan perbankan mitra, jajaran komisaris, dan direksi yang sepakat mewujudkan Jamkrida Bali sebagai pilar ketahanan ekonomi rakyat.`,
      thumbnailUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/06/IKLAN-FIXX.webp",
      images: JSON.stringify([
        "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/06/IKLAN-FIXX.webp",
      ]),
      category: "Berita",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-06-14"),
      seoTitle: "HUT Ke-15 Jamkrida Bali Mandara Momentum Elevate",
      seoDescription: "Peringatan hari jadi ke-15 Jamkrida Bali Mandara dengan tema Elevate.",
    },
    {
      title: "JAMKRIDA BALI AKUISISI SAHAM PT BALI KERTHI DEVELOPMENT FUND VENTURA",
      slug: "jamkrida-bali-akuisisi-saham-pt-bali-kerthi-development-fund-ventura",
      excerpt: "Langkah strategis penandatanganan akuisisi saham PT BDFV untuk memperluas akses pembiayaan dan permodalan UMKM di Provinsi Bali.",
      content: `DENPASAR – Bertempat di Kantor PT Jamkrida Bali Mandara (Perseroda), telah berlangsung penandatanganan akta akuisisi saham PT Bali Kerthi Development Fund Ventura (BDFV).\n\nAkuisisi ini menjadi sinergi kuat antar entitas daerah dalam menyediakan ekosistem pendanaan ventura dan penjaminan terpadu bagi wirausaha muda serta UMKM kreatif di Bali.`,
      thumbnailUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2024/01/DSC08089-3.jpg",
      images: JSON.stringify([
        "https://ppid.jamkridabali.co.id/wp-content/uploads/2024/01/DSC08089-3.jpg",
      ]),
      category: "Bisnis",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2024-01-18"),
      seoTitle: "Jamkrida Bali Akuisisi Saham PT BDFV",
      seoDescription: "Akuisisi saham PT Bali Kerthi Development Fund Ventura oleh Jamkrida Bali.",
    },
    {
      title: "DI PENGHUJUNG TAHUN 2023 JAMKRIDA BALI KEMBALI RAIH PENGHARGAAN KETERBUKAAN INFORMASI PUBLIK",
      slug: "di-penghujung-tahun-2023-jamkrida-bali-kembali-raih-penghargaan-keterbukaan-informasi-publik",
      excerpt: "Komisi Informasi Provinsi Bali menganugerahkan penghargaan Keterbukaan Informasi Publik kepada PPID PT Jamkrida Bali Mandara (Perseroda).",
      content: `DENPASAR – Komisi Informasi Provinsi Bali kembali memberikan apresiasi tinggi kepada PPID PT Jamkrida Bali Mandara (Perseroda) atas konsistensi dan kepatuhan tinggi dalam penyelenggaraan keterbukaan informasi publik.\n\nPenghargaan ini menjadi bukti nyata keseriusan perseroan dalam melayani pemohon informasi secara transparan, mudah, dan akuntabel sepanjang tahun buku 2023.`,
      thumbnailUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-28-at-10.49.30.jpeg",
      images: JSON.stringify([
        "https://ppid.jamkridabali.co.id/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-28-at-10.49.30.jpeg",
      ]),
      category: "Penghargaan",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2023-12-28"),
      seoTitle: "Jamkrida Bali Raih Penghargaan Keterbukaan Informasi Publik 2023",
      seoDescription: "Penghargaan Keterbukaan Informasi Publik dari Komisi Informasi Bali.",
    },
  ];

  for (const news of newsData) {
    const existing = await prisma.news.findUnique({ where: { slug: news.slug } });
    if (!existing) {
      await prisma.news.create({ data: news });
    }
  }

  // 3. Informasi Publik (4 Kategori)
  const publicInfoData = [
    {
      title: "Profil Badan Publik & Ringkasan Laporan Tahunan Pelayanan Informasi",
      category: "BERKALA" as const,
      description: "Informasi mengenai profil kelembagaan, tugas dan fungsi PPID, serta ringkasan realisasi permohonan informasi publik secara berkala.",
      content: "PT Jamkrida Bali Mandara (Perseroda) mengumumkan secara berkala struktur kelembagaan, program kerja tahunan, serta ringkasan realisasi pelayanan informasi publik kepada masyarakat sekurang-kurangnya setiap 6 bulan sekali sesuai ketentuan Perki No. 1 Tahun 2021.",
      year: 2024,
      publicationDate: new Date("2024-06-30"),
      status: "PUBLISHED" as const,
    },
    {
      title: "Rencana Kerja Anggaran Perusahaan (RKAP) dan Rencana Bisnis Jamkrida Bali",
      category: "BERKALA" as const,
      description: "Ringkasan dokumen arah kebijakan bisnis, proyeksi pendapatan, dan target penjaminan UMKM daerah.",
      content: "Dokumen ringkasan rencana bisnis dan anggaran perusahaan yang dapat diakses oleh publik untuk mengetahui proyeksi dan akuntabilitas kinerja badan usaha milik daerah.",
      year: 2024,
      publicationDate: new Date("2024-01-15"),
      status: "PUBLISHED" as const,
    },
    {
      title: "Daftar Informasi Publik (DIP) & Pedoman Pelayanan PPID",
      category: "SETIAP_SAAT" as const,
      description: "Daftar seluruh informasi yang dikuasai dan siap tersedia untuk diberikan kepada pemohon setiap saat pada jam operasional.",
      content: "Daftar Informasi Publik (DIP) memuat inventarisasi seluruh arsip, surat keputusan, dan dokumen legal perseroan yang terbuka dan siap diakses pemohon melalui meja layanan PPID atau secara daring.",
      year: 2024,
      publicationDate: new Date("2024-01-10"),
      status: "PUBLISHED" as const,
    },
    {
      title: "Standar Operasional Prosedur (SOP) Permohonan dan Keberatan Informasi",
      category: "SETIAP_SAAT" as const,
      description: "Panduan alur, jangka waktu pemrosesan, dan persyaratan administrasi pengajuan permohonan informasi publik.",
      content: "SOP resmi yang mengatur alur 10 hari kerja pelayanan informasi, hak perpanjangan 7 hari kerja, serta mekanisme pengajuan keberatan kepada Atasan PPID.",
      year: 2023,
      publicationDate: new Date("2023-09-01"),
      status: "PUBLISHED" as const,
    },
    {
      title: "Peringatan Dini dan Prosedur Tanggap Darurat Bencana Kantor Pusat",
      category: "SERTA_MERTA" as const,
      description: "Informasi kesiapsiagaan darurat bencana gempa bumi, kebakaran, dan evakuasi keselamatan di gedung kantor.",
      content: "Pengumuman serta-merta mengenai tata cara evakuasi, titik kumpul (assembly point), nomor kontak darurat rumah sakit, BPBD Bali, dan kepolisian untuk keselamatan pengunjung dan karyawan.",
      year: 2024,
      publicationDate: new Date("2024-03-01"),
      status: "PUBLISHED" as const,
    },
    {
      title: "Daftar Informasi yang Dikecualikan Berdasarkan Uji Konsekuensi UU No. 14/2008",
      category: "DIKECUALIKAN" as const,
      description: "Informasi rahasia bisnis, data keuangan pribadi nasabah/mitra terjamin, dan strategi audit internal yang tidak dapat dipublikasikan.",
      content: "Sesuai Pasal 17 UU No. 14 Tahun 2008 dan SK Direksi No. 038/Kep-Dir/VIII/2022, informasi mengenai data nasabah perbankan, rahasia dagang, strategi persaingan usaha, dan dokumen proses audit internal yang sedang berjalan diklasifikasikan sebagai informasi yang dikecualikan setelah melalui uji konsekuensi.",
      year: 2022,
      publicationDate: new Date("2022-08-12"),
      status: "PUBLISHED" as const,
    },
  ];

  for (const info of publicInfoData) {
    const existing = await prisma.publicInformation.findFirst({ where: { title: info.title } });
    if (!existing) {
      await prisma.publicInformation.create({ data: info });
    }
  }

  // 4. Layanan & Formulir Publik
  const servicesData = [
    {
      title: "Permohonan Informasi Publik",
      slug: "permohonan-informasi",
      description: "Layanan permohonan informasi resmi bagi masyarakat perorangan atau badan hukum secara daring maupun langsung ke Meja Layanan PPID.",
      icon: "FileText",
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfoQUkoCpWc7SHIzKQxb3va2K0yeT2BWg4ZWWZBbrLAmMtguQ/viewform?usp=sf_link",
      order: 0,
      isActive: true,
    },
    {
      title: "Permohonan Keberatan Informasi",
      slug: "keberatan-informasi",
      description: "Pengajuan keberatan resmi atas permohonan informasi yang ditolak, tidak ditanggapi, atau tidak dipenuhi sesuai ketentuan waktu.",
      icon: "AlertCircle",
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSco0hFkI85Zu-yyVB5tRajx-q5Bkk6d7JVU7MKjpR_ATwX3YQ/viewform?usp=sf_link",
      order: 1,
      isActive: true,
    },
    {
      title: "Pengaduan Masyarakat & Konsumen",
      slug: "pengaduan-konsumen",
      description: "Saluran pengaduan konsumen penjaminan dan masyarakat terkait mutu layanan atau indikasi penyalahgunaan wewenang (Whistleblowing).",
      icon: "ShieldAlert",
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd5M-535a0vJxFA-tP-hCBhiIuL27eR75IA7AgCO1CIznxP_A/viewform?usp=sf_link",
      order: 2,
      isActive: true,
    },
    {
      title: "Penyelesaian Sengketa Informasi",
      slug: "sengketa-informasi",
      description: "Fasilitasi alur pengajuan penyelesaian sengketa informasi ke Komisi Informasi Provinsi Bali jika proses keberatan belum memuaskan pemohon.",
      icon: "Scale",
      formUrl: "https://ppid.jamkridabali.co.id/alur-pengajuan-permohonan/",
      order: 3,
      isActive: true,
    },
  ];

  for (const s of servicesData) {
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });
    if (!existing) {
      await prisma.service.create({ data: s });
    }
  }

  // 5. Mitra Resmi
  const partnersData = [
    {
      name: "PT Jamkrida Bali Mandara (Perseroda)",
      logoUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2025/12/LOGO-JBM-BAGUS.webp",
      websiteUrl: "https://www.jamkridabali.co.id/",
      order: 0,
      isActive: true,
    },
    {
      name: "PT Bank BPD Bali",
      logoUrl: "https://www.bpdbali.co.id/assets/images/logo_bpd_bali.png",
      websiteUrl: "https://www.bpdbali.co.id/",
      order: 1,
      isActive: true,
    },
    {
      name: "Otoritas Jasa Keuangan (OJK)",
      logoUrl: "https://www.ojk.go.id/SiteAssets/images/logo-ojk.png",
      websiteUrl: "https://www.ojk.go.id/",
      order: 2,
      isActive: true,
    },
    {
      name: "Pemerintah Provinsi Bali",
      logoUrl: "https://baliprov.go.id/v2/wp-content/uploads/2023/12/logo-provinsi-bali.png",
      websiteUrl: "https://baliprov.go.id/",
      order: 3,
      isActive: true,
    },
  ];

  for (const p of partnersData) {
    const existing = await prisma.partner.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.partner.create({ data: p });
    }
  }

  // 6. Statistik Riil Layanan PPID
  const statsData = [
    { title: "Dokumen Publik Terpublikasi", value: "128+", description: "Laporan, regulasi, dan arsip publik yang dapat diakses bebas", order: 0, isActive: true },
    { title: "Waktu Respon Rata-Rata", value: "< 3 Hari", description: "Jauh lebih cepat dari batas maksimal 10 hari kerja UU KIP", order: 1, isActive: true },
    { title: "Tingkat Penyelesaian Permohonan", value: "100%", description: "Seluruh permohonan informasi dituntaskan sesuai prosedur", order: 2, isActive: true },
    { title: "Indeks Kepuasan Pemohon", value: "98.5%", description: "Berdasarkan survei kepuasan layanan informasi publik", order: 3, isActive: true },
  ];

  for (const st of statsData) {
    const existing = await prisma.statistic.findFirst({ where: { title: st.title } });
    if (!existing) {
      await prisma.statistic.create({ data: st });
    }
  }

  // 7. Site Settings Resmi Jamkrida Bali
  const siteSettingsUpdates = [
    {
      key: "company_description",
      value: "Unit Pelayanan Informasi Publik PT Jamkrida Bali Mandara (Perseroda) — mengawal transparansi informasi publik, tata kelola perusahaan yang bersih, serta akuntabilitas penjaminan daerah sesuai UU No. 14 Tahun 2008.",
    },
    { key: "address", value: "Jl. Raya Puputan No. 3, Renon, Denpasar, Bali 80234" },
    { key: "phone", value: "+6282144702922" },
    { key: "email", value: "ppid@jamkridabali.co.id" },
    { key: "facebook_url", value: "https://www.facebook.com/jamkridabali" },
    { key: "instagram_url", value: "https://www.instagram.com/jamkridabali/" },
    { key: "youtube_url", value: "https://www.youtube.com/channel/UCYkUFiOCK6h4vBz4RLYE3Nw" },
    { key: "logo_url", value: "https://ppid.jamkridabali.co.id/wp-content/uploads/2025/12/LOGO-JBM-BAGUS.webp" },
  ];

  for (const s of siteSettingsUpdates) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // 8. Hero Slides Asli dengan Gambar Resmi
  const heroSlideUpdates = [
    {
      title: "Transparansi adalah Komitmen Kami kepada Publik",
      subtitle: "Keterbukaan Informasi Publik",
      description: "Portal resmi PPID PT Jamkrida Bali Mandara (Perseroda) — akses dokumen, laporan tahunan, dan layanan publik secara terbuka, cepat, dan akuntabel.",
      backgroundUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/08/DSC06137-scaled.webp",
      ctaLabel: "Ajukan Permohonan Informasi",
      ctaUrl: "/permohonan-informasi",
      ctaLabelSecondary: "Pelajari Profil PPID",
      ctaUrlSecondary: "/profil-ppid",
      order: 0,
      isActive: true,
    },
    {
      title: "Inovasi Pelayanan Publik CGO & Transformasi Digital",
      subtitle: "Penghargaan Nasional MENPANRB",
      description: "Meraih predikat TOP 45 Inovasi Pelayanan Publik dari Kementerian PAN-RB untuk kemudahan jaminan dan keterbukaan informasi penjaminan.",
      backgroundUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2023/11/Duss-81-scaled.jpg",
      ctaLabel: "Lihat Dokumen Publik",
      ctaUrl: "/informasi-berkala",
      ctaLabelSecondary: "Hubungi Petugas",
      ctaUrlSecondary: "/kontak",
      order: 1,
      isActive: true,
    },
    {
      title: "Sampaikan Aspirasi, Masukan, & Pengaduan Anda",
      subtitle: "Saluran Resmi Pengaduan",
      description: "Ruang Layanan Informasi Publik Jamkrida Bali siap melayani pemohon baik secara daring maupun tatap muka langsung setiap hari kerja.",
      backgroundUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2022/10/IMG_1555-scaled.jpg",
      ctaLabel: "Formulir Pengaduan Online",
      ctaUrl: "/pengaduan-form",
      ctaLabelSecondary: "Jadwal Pelayanan",
      ctaUrlSecondary: "/pedoman-ppid",
      order: 2,
      isActive: true,
    },
  ];

  const currentHeroCount = await prisma.heroSlide.count();
  if (currentHeroCount <= 3) {
    // Perbarui atau tambahkan
    await prisma.heroSlide.deleteMany();
    await prisma.heroSlide.createMany({ data: heroSlideUpdates });
  }

  // 9. Pre-populate Media Library dengan aset penting
  const mediaInitial = [
    {
      url: "https://ppid.jamkridabali.co.id/wp-content/uploads/2025/12/LOGO-JBM-BAGUS.webp",
      publicId: "seed-logo-jbm",
      type: "IMAGE" as const,
      altText: "Logo Resmi PT Jamkrida Bali Mandara (Perseroda)",
      fileName: "LOGO-JBM-BAGUS.webp",
      fileSizeKb: 120,
    },
    {
      url: "https://ppid.jamkridabali.co.id/wp-content/uploads/2026/08/DSC06137-scaled.webp",
      publicId: "seed-hut-15-jbm",
      type: "IMAGE" as const,
      altText: "Foto Perayaan HUT ke-15 Jamkrida Bali",
      fileName: "DSC06137-scaled.webp",
      fileSizeKb: 650,
    },
    {
      url: "https://ppid.jamkridabali.co.id/wp-content/uploads/2022/10/8.1.-desain-pamflet-scaled.jpg",
      publicId: "seed-pamflet-jadwal",
      type: "IMAGE" as const,
      altText: "Pamflet Jadwal Pelayanan Informasi Publik PPID",
      fileName: "8.1.-desain-pamflet-scaled.jpg",
      fileSizeKb: 890,
    },
    {
      url: "https://ppid.jamkridabali.co.id/wp-content/uploads/2022/10/IMG_1555-scaled.jpg",
      publicId: "seed-ruangan-layanan",
      type: "IMAGE" as const,
      altText: "Ruang Layanan Informasi Publik Jamkrida Bali",
      fileName: "IMG_1555-scaled.jpg",
      fileSizeKb: 720,
    },
  ];

  for (const m of mediaInitial) {
    const existing = await prisma.media.findFirst({ where: { url: m.url } });
    if (!existing) {
      await prisma.media.create({ data: m });
    }
  }

  try {
    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath("/informasi-berkala");
    revalidatePath("/informasi-setiap-saat");
    revalidatePath("/informasi-serta-merta");
    revalidatePath("/laporan-tahunan");
    revalidatePath("/laporan-keuangan");
    revalidatePath("/statistik");
    revalidatePath("/admin/news");
    revalidatePath("/admin/documents");
    revalidatePath("/admin/public-information");
    revalidatePath("/admin/services");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/media");
  } catch {
    // Abaikan error revalidate saat dijalankan via CLI script
  }

  return { ok: true, message: "Data PPID Jamkrida Bali berhasil disinkronisasi!" };
}
