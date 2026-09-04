# Portal PPID — PT Jamkrida Bali Mandara (Perseroda)

## Status implementasi

- [x] Fase 1 — Setup proyek (Next.js, TypeScript, Tailwind, dependency manifest)
- [x] Fase 2 — Schema database (Prisma, 13 model + Auth.js)
- [x] Fase 3 — Autentikasi admin (Auth.js Credentials, bcrypt, middleware, halaman login, seed admin)
- [x] Fase 4 — Layout CMS (dashboard, sidebar)
- [x] Fase 5 — Manajemen navbar (drag-and-drop)
- [x] Fase 6 — CMS homepage & hero carousel
- [x] Fase 7 — Homepage publik
- [x] Fase 8 — Berita, dokumen, informasi, layanan, statistik, mitra
- [x] Fase 9 — Media library, footer, pengaturan
- [ ] Fase 10 — Search, SEO, aksesibilitas, performa
- [ ] Fase 11 — Testing & review keamanan

## Temuan dari situs lama (ppid.jamkridabali.co.id) — penyesuaian terhadap brief awal

1. **Seksi "Pedoman PPID" hilang dari brief tapi ada di situs lama.** Berisi 10 halaman kepatuhan hukum (Standar Pelayanan, Layanan Informasi Pusat, Peraturan PPID, Maklumat PPID, Rancangan Peraturan, SOP Pelayanan Informasi Publik, Pengelolaan Organisasi/Administrasi/Kepegawaian/Keuangan, Peraturan & Kebijakan). Ditambahkan ke seed navigasi sebagai submenu dari "Tentang".
2. **Menu "Informasi" versi lama punya lebih banyak item** dari brief: Satu Data Bali, Satu Data Indonesia, Peringatan Dini & Evakuasi Darurat, Penanganan Covid-19, Statistik Pengunjung. Beberapa (Covid-19) sudah tidak relevan secara temporal — direkomendasikan tidak di-seed, tapi struktur NavigationItem tetap mendukungnya jika Admin ingin menambahkan.
3. **"Jayanthi" di situs lama berisi "Si Wayan" dan "Si Made"** — kemungkinan maskot/asisten virtual PPID. Brief tidak menjelaskan fungsinya. Perlu klarifikasi dari pemilik proyek sebelum di-scaffold sebagai fitur, bukan sekadar halaman statis.
4. Situs lama memakai form Google Forms eksternal untuk Permohonan Informasi/Keberatan/Pengaduan Online — bukan form internal. Brief poin 13 mengasumsikan layanan dikelola dari CMS; perlu keputusan apakah form internal menggantikan Google Forms atau berjalan paralel.
5. Footer situs lama mencantumkan tautan ke domain korporat terpisah (jamkridabali.co.id) dan mitra (BPD Bali, OJK) — sudah terakomodasi lewat model `SiteSetting` dan `Partner`.

## Cara menjalankan (WAJIB — file ini tidak bisa langsung dibuka tanpa langkah ini)

> Database saat ini: **MySQL Laragon** (`jamkrida-ppid`, user `root`, tanpa password). Prisma provider sudah diubah dari PostgreSQL ke MySQL.

1. `npm install`
2. Isi `.env` — `DATABASE_URL="mysql://root@localhost:3306/jamkrida-ppid"`, `AUTH_SECRET` (`npx auth secret`), dan **`SEED_ADMIN_PASSWORD`** (password admin yang akan dibuat/di-reset oleh seed — jika tidak diset, dipakai password default dan muncul peringatan)
3. `npm run db:migrate` — membuat tabel di database
4. `npm run db:seed` — membuat akun admin default: `admin@jamkridabali.co.id` + password dari `SEED_ADMIN_PASSWORD` — **ganti password ini segera setelah login pertama**
5. `npm run dev` — buka `http://localhost:3000/admin/login`

## Prasyarat sebelum lanjut ke Fase 10 (Search, SEO, aksesibilitas)

- Cloudinary credentials sudah diisi di `.env` untuk upload media
- Admin sudah menambahkan beberapa berita, dokumen, layanan, mitra, dan mengatur footer di CMS
- Semua halaman publik sudah ditest dengan data sample
- Kode ini belum dijalankan end-to-end di server production, jadi test terlebih dahulu di staging/development

## Fase 9 — Media Library, Footer, Pengaturan (SELESAI)

### Yang telah diimplementasikan:

**1. Media Library (`/admin/media`)**
- Upload gambar ke Cloudinary (max 10MB, format JPG/PNG/WebP/SVG)
- Salin URL gambar untuk digunakan di hero, berita, atau logo mitra
- Hapus gambar dari Cloudinary & database
- Warning jika Cloudinary belum dikonfigurasi
- Grid display dengan preview thumbnail

**2. Pengaturan Situs (`/admin/settings`)**
- Form management untuk 8 pengaturan default:
  - Deskripsi perusahaan
  - Alamat
  - Telepon
  - Email
  - URL Facebook, Instagram, YouTube
  - URL Logo
- Support pengaturan kustom (tambah/hapus field apapun)
- Semua pengaturan otomatis ditampilkan di footer publik

**3. Footer Publik (dinamis dari SiteSetting)**
- Deskripsi perusahaan
- Kontak (alamat, telepon, email)
- Tautan cepat ke halaman penting
- Social media links (Facebook, Instagram, YouTube)
- Copyright year otomatis

**4. Content Management (melengkapi Fase 8)**
- News/Berita — CRUD dengan status DRAFT/PUBLISHED, auto-slug, publishedAt
- Documents/Dokumen — kategori, tahun, file type tracking
- Public Information — 4 kategori (Berkala/Setiap Saat/Serta Merta/Dikecualikan)
- Services/Layanan — formUrl support, order management
- Statistics — nilai display, order management
- Partners — logo URL, website, order management
- Pages/Halaman Statis — slug, SEO fields, publish toggle

**5. Seed Data**
- 8 site settings dengan default values (alamat, kontak, social media)
- Idempotent seed (aman dijalankan berulang)

### Halaman Publik (48 Routes Total)

**Menu Beranda:**
- `/` — Homepage dengan hero carousel, layanan, berita, dokumen, statistik, mitra

**Menu Tentang (8 halaman):**
- `/profil-ppid` — Profil PPID dengan visi misi
- `/visi-misi` — Visi & misi detail
- `/sejarah-ppid` — Sejarah pendirian PPID
- `/tugas-ppid` — Tugas & fungsi PPID
- `/struktur-organisasi` — Struktur organisasi perusahaan
- `/profil-pejabat` — Profil pejabat utama
- `/tim-kami` — Tim PPID
- `/pemegang-saham` — Struktur pemegang saham
- `/pendirian-bumd` — Sejarah pendirian BUMD
- `/pedoman-ppid` — Pedoman PPID & compliance

**Menu Informasi (10 halaman):**
- `/informasi-berkala` — Informasi berkala
- `/informasi-setiap-saat` — Informasi setiap saat
- `/informasi-serta-merta` — Informasi serta merta
- `/berita` — Berita & pengumuman
- `/pengumuman` — Pengumuman resmi
- `/csr` — Program CSR
- `/pengadaan` — Pengadaan barang & jasa
- `/penghargaan` — Penghargaan & prestasi
- `/karir` — Lowongan pekerjaan
- `/agenda` — Agenda kegiatan

**Menu Laporan (6 halaman):**
- `/laporan-tahunan` — Laporan tahunan
- `/laporan-auditor` — Laporan auditor
- `/laporan-keuangan` — Laporan keuangan
- `/rencana-bisnis` — Rencana bisnis
- `/lhkpn` — LHKPN
- `/laporan-pengaduan` — Laporan pengaduan

**Menu Statistik:**
- `/statistik` — Statistik pelayanan

**Menu Pengaduan (4 halaman):**
- `/permohonan-informasi` — Layanan permohonan informasi
- `/keberatan` — Keberatan atas keputusan
- `/sengketa-informasi` — Sengketa informasi publik
- `/pengaduan-form` — Form pengaduan & saran

**Menu Kontak:**
- `/kontak` — Informasi kontak lengkap

### Teknologi yang digunakan:

- **Upload:** Cloudinary Node.js SDK dengan streaming
- **Form Validation:** React Hook Form + Zod
- **State Management:** useTransition, useOptimistic patterns
- **Notifications:** Sonner toast
- **Icons:** Lucide React
- **Styling:** Tailwind CSS
- **Database:** Prisma ORM dengan MySQL

### Build Status:
✅ 48 Routes (16 dynamic admin + 1 API + 31 static public)  
✅ First Load JS: 103 kB shared  
✅ Type checking: passed  
✅ Linting: clean  
✅ Compilation: successful  

### File-file kunci Fase 9:

- `/components/admin/media-library.tsx` — Upload UI & management
- `/components/admin/settings-manager.tsx` — Settings CRUD
- `/lib/actions/media.ts` — Upload/delete server actions
- `/lib/actions/settings.ts` — Settings server actions
- `/lib/cloudinary.ts` — Cloudinary configuration
- `/components/public/site-footer.tsx` — Footer display
- `/prisma/seed.ts` — Default settings seed
- `/app/[halaman]/page.tsx` — (catatan: halaman publik dibuat sebagai route eksplisit per-halaman di `app/`, bukan lewat route dinamis `[halaman]` — total 33 halaman publik)
