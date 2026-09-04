import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin default (GANTI PASSWORD INI SEGERA SETELAH LOGIN PERTAMA) ---
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      "SEED_ADMIN_PASSWORD tidak diset. Tambahkan SEED_ADMIN_PASSWORD=<password-kuat> di file .env sebelum menjalankan seed."
    );
  }
  const passwordHash = await bcrypt.hash(password, 10);
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
    { key: "address", value: "Jl. Surapati No.8, Dangin Puri, Kecamatan Denpasar Timur, Kota Denpasar, Bali 80232" },
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

  // --- Dummy Profil Pejabat (Komisaris & Direksi) — diedit via CMS /admin/pejabat ---
  const pejabatCount = await prisma.pejabat.count();
  if (pejabatCount === 0) {
    await prisma.pejabat.createMany({
      data: [
        {
          name: "Drs. Dewa Made Indra, M.Si",
          jabatan: "Komisaris Utama",
          category: "KOMISARIS",
          photoUrl: "/pejabat/komisaris-utama.jpg",
          bio: "Drs. Dewa Made Indra, M.Si, Warga Negara Indonesia, Lahir di Pemaron 3 Februari 1967, Agama Hindu dipercaya sebagai Komisaris Utama sejak tahun 2021. Beliau merupakan lulusan Strata 1 Perencanaan Pengembangan di IP Jakarta dan Strata 2 Ilmu Sosial di Universitas Padjajaran.",
          order: 0,
        },
        {
          name: "Ir. I Nengah Usdek Maharipa, MM.",
          jabatan: "Komisaris Independen",
          category: "KOMISARIS",
          photoUrl: "/pejabat/komisaris-independen.jpg",
          bio: "Ir. Nengah Usdek Maharipa, MM, Warga Negara Indonesia, Lahir di Blahkiuh 11 November 1960, Agama Hindu dipercaya sebagai Komisaris Independen sejak tahun 2019. Beliau merupakan lulusan Strata 1 Pertanian Universitas Udayana dan Strata 2 Magister Manajemen di Universitas Udayana.",
          order: 1,
        },
        {
          name: "I Kadek Budi Prasetya, SH., MM",
          jabatan: "Komisaris",
          category: "KOMISARIS",
          photoUrl: "/pejabat/komisaris.jpg",
          bio: "I Kadek Budi Prasetya, S.H., M.H. lahir di Denpasar pada 29 Juli 1990 dan beragama Hindu. Ia menempuh pendidikan Ilmu Hukum di Universitas Udayana dan melanjutkan studi hukum di Universitas Nasional Jakarta, meraih gelar magister. Berpengalaman di bidang legislatif dan hukum praktik, ia pernah menjabat sebagai Tenaga Ahli DPR/MPR RI dan bekerja sebagai Advokat di AKA Law Firm. Sejak 2025 ia menjabat sebagai Komisaris PT Jamkrida Bali Mandara (Perseroda).",
          order: 2,
        },
        {
          name: "Anak Agung Ngurah Adhi Ardhana, S.T.",
          jabatan: "Direktur Utama",
          category: "DIREKSI",
          photoUrl: "/pejabat/dirut.jpg",
          bio: "Anak Agung Ngurah Adhi Ardhana lahir di Denpasar pada 25 Februari 1973. Beragama Hindu, menempuh pendidikan S1 Teknik Mesin di ITS dan memiliki pengalaman profesional di sektor swasta serta pemerintahan. Sebelum menjabat di pemerintahan, ia bekerja di PT Federal Motor dan kemudian terlibat sebagai anggota DPRD Provinsi Bali. Sejak 2025 menjabat sebagai Direktur Utama PT Jamkrida Bali Mandara (Perseroda).",
          order: 0,
        },
        {
          name: "I Made Gde Budi Dwipayana, SE., Ak",
          jabatan: "Direktur Bisnis",
          category: "DIREKSI",
          photoUrl: "/pejabat/direktur-bisnis.jpg",
          bio: "I Made Gde Budi Dwipayana lahir di Badung pada 17 Juni 1983 dan beragama Hindu. Menempuh pendidikan S1 Akuntansi & PPAk di Universitas Udayana. Berkarir di bidang penjaminan kredit, pernah menjabat sebagai Kepala Bagian Penjaminan dan kemudian Kepala Divisi Penjaminan di PT Jamkrida Bali Mandara (Perseroda). Sejak 2025 menjabat sebagai Direktur Bisnis PT Jamkrida Bali Mandara (Perseroda).",
          order: 1,
        },
        {
          name: "Agus Adi Sana Putra, SE., MM",
          jabatan: "Direktur Keuangan",
          category: "DIREKSI",
          photoUrl: "/pejabat/direktur-keuangan.jpg",
          bio: "Agus Adi Sana Putra, SE., MM lahir di Marga pada 21 Desember 1988 dan beragama Hindu. Menempuh pendidikan Manajemen Pemasaran di Universitas Warmadewa dan meraih Magister Manajemen di Universitas Warmadewa. Berpengalaman di bidang sumber daya manusia dan operasional, pernah menjabat sebagai Supervisor serta Kepala Bagian SDM, Umum, TI & Sekretariat PT Jamkrida Bali Mandara (Perseroda). Sejak 2025 menjabat sebagai Direktur Keuangan PT Jamkrida Bali Mandara (Perseroda).",
          order: 2,
        },
      ],
    });
  }

  // --- Dummy Tim Kami (4 frame foto kosong, upload via CMS /admin/tim) ---
  const teamCount = await prisma.teamMember.count();
  if (teamCount === 0) {
    await prisma.teamMember.createMany({
      data: [
        { name: "Anggota Tim PPID 1", role: "Staf PPID", photoUrl: "", order: 0 },
        { name: "Anggota Tim PPID 2", role: "Staf PPID", photoUrl: "", order: 1 },
        { name: "Anggota Tim PPID 3", role: "Staf PPID", photoUrl: "", order: 2 },
        { name: "Anggota Tim PPID 4", role: "Staf PPID", photoUrl: "", order: 3 },
      ],
    });
  }

  // --- Dummy CSR: Laporan CSR (dokumen, edit via CMS /admin/documents) ---
  const csrReports = [
    {
      title: "Laporan CSR 2023",
      category: "Laporan CSR",
      description:
        "Laporan Tanggung Jawab Sosial Perusahaan (Corporate Social Responsibility) PT Jamkrida Bali Mandara (Perseroda) tahun 2023.",
      year: 2023,
      fileUrl: "https://drive.google.com/file/d/1nj1ZVdV6bTzJ6FCgzz1rx_JADwI93Esw/view?usp=sharing",
      fileType: "PDF",
      publicationDate: new Date("2023-12-31"),
      status: "PUBLISHED" as const,
    },
    {
      title: "Laporan CSR 2022",
      category: "Laporan CSR",
      description:
        "Laporan Tanggung Jawab Sosial Perusahaan (Corporate Social Responsibility) PT Jamkrida Bali Mandara (Perseroda) tahun 2022.",
      year: 2022,
      fileUrl: "https://drive.google.com/file/d/1zO66I_HKyxwrz_t5tTky2gPaIuhxcXjw/view?usp=sharing",
      fileType: "PDF",
      publicationDate: new Date("2022-12-31"),
      status: "PUBLISHED" as const,
    },
  ];
  for (const doc of csrReports) {
    const existing = await prisma.document.findFirst({ where: { title: doc.title } });
    if (!existing) await prisma.document.create({ data: doc });
  }

  // --- Dummy CSR: Kegiatan CSR (berita kategori CSR, edit via CMS /admin/news) ---
  const csrActivities = [
    {
      title:
        "PT Jamkrida Bali Mandara (Perseroda) Serahkan CSR Berupa Kursi Roda kepada Penyandang Disabilitas Yayasan Bunga Bali",
      slug: "csr-kursi-roda-yayasan-bunga-bali",
      excerpt:
        "Direktur Utama PT Jamkrida Bali Mandara (Perseroda) I Ketut Widiana Karya, SE., MBA menyerahkan CSR berupa 10 unit kursi roda kepada penyandang disabilitas di Yayasan Bunga Bali.",
      content: [
        "Sebagai bentuk kepedulian pada sesama dan sebagai Perusahaan Penjaminan Kredit milik Pemerintah Provinsi, Pemerintah Kabupaten dan Kota seluruh Bali, Jamkrida Bali kembali menyerahkan CSR kepada penyandang disabilitas di Yayasan Bunga Bali. Terdapat 10 unit kursi roda dibagikan dengan harapan dapat membantu meringankan beban masyarakat yang mengalami disabilitas.",
        "Direktur Utama PT Jamkrida Bali Mandara (Perseroda) I Ketut Widiana Karya, SE., MBA. ketika ditemui di sela-sela penyerahan kursi roda di Yayasan Bunga Bali Jalan By Pass Prof. Dr. Ida Bagus Mantra No. 111, Denpasar, Jumat, (16/12/2022), menyatakan CSR Jamkrida terbagi menjadi 8 program. Yakni sosial, pendidikan, lingkungan, kesehatan, seni & budaya, olahraga, sarana prasarana lainnya dan program kemitraan.",
        "\u201cProgram sosial itu, salah satunya dengan membantu masyarakat disabilitas. Kami pilih Yayasan ini karena peduli orang disabilitas yang perlu dibantu,\u201d ujarnya. \u201cJamkrida Bali berkomitmen untuk menyalurkan CSR yang tepat guna dan tepat sasaran untuk masyarakat Bali\u201d tambanya.",
        "Ketua Yayasan Bunga Bali, Drs. I Nyoman Dana, mengucapkan terimakasih atas bantuan 10 unit kursi roda. \u201cBagi kami, ini amat istimewa karena kebutuhan kami perlu yang berkaitan dengan struk, lumpuh perlu kursi roda,\u201d ujarnya.",
      ].join("\n\n"),
      thumbnailUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2022/12/6-1-scaled.jpg",
      publishedAt: new Date("2022-12-17"),
    },
    {
      title:
        "CSR - Ceremonial Penyerahan CSR Seni dan Budaya PT JBM kepada Sanggar Pradnya Swari di Kabupaten Jembrana",
      slug: "csr-seni-budaya-sanggar-pradnya-swari",
      excerpt:
        "Ceremonial penyerahan CSR seni dan budaya PT JBM kepada Sanggar Pradnya Swari di Kabupaten Jembrana, dihadiri oleh Bpk. Sekda Kab. Jembrana.",
      content: [
        "Selasa, 21 Juni 2022 \u2014 Ceremonial Penyerahan CSR Seni dan Budaya PT Jamkrida Bali Mandara (Perseroda) kepada Sanggar Pradnya Swari di Kabupaten Jembrana, dihadiri oleh Bpk. Sekda Kab. Jembrana.",
        "Program CSR seni dan budaya ini merupakan wujud komitmen perusahaan dalam melestarikan seni dan budaya Bali serta mendukung kelangsungan sanggar-sanggar daerah.",
      ].join("\n\n"),
      thumbnailUrl: "https://ppid.jamkridabali.co.id/wp-content/uploads/2022/10/2CSRSA_1.jpe",
      publishedAt: new Date("2022-10-14"),
    },
    {
      title: "CSR - Penyerahan bantuan buku",
      slug: "csr-penyerahan-bantuan-buku",
      excerpt:
        "CSR berupa bantuan buku bertajuk pengetahuan dan kebudayaan serta adat istiadat di Provinsi Bali untuk seluruh Kota/Kabupaten di Bali.",
      content: [
        "Corporate Social Responsibility berupa pemberian bantuan buku pengetahuan dan kebudayaan.",
        "PT. Jamkrida Bali Mandara (Perseroda) melaksanakan program Corporate Social Responsibility sebagai bentuk tanggung jawab sosial kepada masyarakat pemberian bantuan berupa buku bertajuk pengetahuan dan kebudayaan serta adat istiadat di Provinsi Bali untuk seluruh Kota/Kabupaten di Bali.",
      ].join("\n\n"),
      thumbnailUrl:
        "https://ppid.jamkridabali.co.id/wp-content/uploads/2022/10/56.6.-Corporate-Social-Responsibility-berupa-buku-bertajuk-pengetahuan-dan-kebudayaan-serta-adat-istiadat-di-Provinsi-Bali.jpeg",
      publishedAt: new Date("2022-10-13"),
    },
    {
      title: "CSR - Penyerahan bantuan bahan sembako",
      slug: "csr-penyerahan-bantuan-bahan-sembako",
      excerpt:
        "CSR berupa bantuan bahan sembako kepada Yayasan Bhakti Senang Hati, Jalan Raya Mundeh, Banjar Truna, Desa Siangan, Kabupaten Gianyar.",
      content: [
        "Corporate Social Responsibility berupa pemberian bantuan bahan sembako.",
        "PT. Jamkrida Bali Mandara (Perseroda) melaksanakan program Corporate Social Responsibility sebagai bentuk tanggung jawab sosial kepada masyarakat pemberian bantuan berupa bahan sembako kepada Yayasan Bhakti Senang Hati, Jalan Raya Mundeh, Banjar Truna, Desa Siangan Kabupaten Gianyar.",
      ].join("\n\n"),
      thumbnailUrl:
        "https://ppid.jamkridabali.co.id/wp-content/uploads/2022/10/56.5.-Corporate-Social-Responsibility-berupa-pemberian-bantuan-bahan-sembako.jpeg",
      publishedAt: new Date("2022-10-13"),
    },
  ];
  for (const item of csrActivities) {
    const existing = await prisma.news.findUnique({ where: { slug: item.slug } });
    if (!existing) {
      await prisma.news.create({
        data: { ...item, category: "CSR", status: "PUBLISHED", images: "[]" },
      });
    }
  }

  // --- Dummy Statistik (edit via CMS /admin/statistics) ---
  // Grup ditentukan lewat field "description": Statistik Kepegawaian | Laba Rugi | Pertumbuhan Aset
  const statGroups: Array<{ group: string; rows: Array<[string, string]> }> = [
    {
      group: "Statistik Kepegawaian",
      rows: [
        ["2020", "38"],
        ["2021", "41"],
        ["2022", "45"],
        ["2023", "48"],
        ["2024", "52"],
      ],
    },
    {
      group: "Laba Rugi",
      rows: [
        ["2020", "25"],
        ["2021", "31"],
        ["2022", "38"],
        ["2023", "44"],
        ["2024", "51"],
      ],
    },
    {
      group: "Pertumbuhan Aset",
      rows: [
        ["2020", "310"],
        ["2021", "352"],
        ["2022", "405"],
        ["2023", "468"],
        ["2024", "540"],
      ],
    },
  ];
  for (const g of statGroups) {
    for (let i = 0; i < g.rows.length; i++) {
      const [year, value] = g.rows[i];
      const existing = await prisma.statistic.findFirst({
        where: { title: year, description: g.group },
      });
      if (!existing) {
        await prisma.statistic.create({
          data: { title: year, value, description: g.group, order: i },
        });
      }
    }
  }

  // --- Objek Riil dari Website Lama PPID Jamkrida Bali ---
  // Implementasi ada di modul biasa lib/seed/real-data.ts (bukan server action),
  // sehingga script seed tidak perlu melewati guard admin.
  const { populateRealJamkridaData } = await import("../lib/seed/real-data");
  await populateRealJamkridaData();

  console.log("Seed selesai dengan data riil PPID Jamkrida Bali. Login dengan admin@jamkridabali.co.id (password sesuai SEED_ADMIN_PASSWORD di .env)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
