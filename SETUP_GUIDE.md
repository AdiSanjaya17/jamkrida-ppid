# Setup & Testing Guide - Fase 9 Complete

## ✅ Status: Build Berhasil

**Cloudinary Credentials:** ✓ Sudah di-update di `.env`
**Build Status:** ✓ 48 routes compiled successfully
**PageBanner:** ✓ Semua halaman publik sudah punya hero banner dengan judul

---

## 🚀 Cara Menjalankan Project

### 1. Persiapan Database
```bash
npm run db:generate    # Generate Prisma Client
npm run db:migrate     # Create tables di MySQL
npm run db:seed        # Seed default data (admin user, navigation, settings)
```

### 2. Jalankan Development Server
```bash
npm run dev            # Server akan berjalan di http://localhost:3000
```

### 3. Test CMS Admin

**Login:**
- URL: `http://localhost:3000/admin/login`
- Email: `admin@jamkridabali.co.id`
- Password: `Jamkridabali15`
- ⚠️ **GANTI PASSWORD SEGERA** setelah login pertama kali

**Features yang bisa di-test:**
- ✅ Dashboard — melihat statistik konten
- ✅ Navigation Manager — drag-drop menu
- ✅ Homepage — atur hero slides, sections
- ✅ **Media Library** — upload gambar ke Cloudinary (SEKARANG BERFUNGSI)
- ✅ News CRUD — buat/edit/hapus berita
- ✅ Documents CRUD — upload dokumen
- ✅ Services CRUD — manage layanan
- ✅ Statistics CRUD — statistik display
- ✅ Partners CRUD — manage mitra
- ✅ Settings — atur footer (alamat, kontak, social media)

### 4. Test Public Website

**Homepage:**
- URL: `http://localhost:3000`
- Lihat: Hero carousel, layanan, berita terbaru, dokumen, statistik, mitra, footer

**Test Halaman Publik:**
- `/profil-ppid` — dengan PageBanner merah + judul
- `/berita` — daftar berita dari CMS
- `/laporan-tahunan` — daftar dokumen
- `/statistik` — statistik dari CMS
- `/kontak` — informasi kontak dari settings
- dll. (31 halaman publik tersedia)

---

## 📸 Test Media Upload

1. Login ke `/admin/login`
2. Pergi ke `/admin/media`
3. Pilih file gambar (JPG/PNG/WebP/SVG, max 10MB)
4. Klik **"Unggah ke Cloudinary"**
5. ✅ File seharusnya terupload dengan:
   - Success message: "File berhasil diunggah"
   - URL tersedia untuk di-copy ke clipboard
   - Thumbnail preview di grid

---

## 🔧 Troubleshooting

### Upload masih error?
- Pastikan credentials di `.env` sudah benar
- Restart server: `npm run dev`
- Check console browser (F12) untuk error message

### Database error?
- Pastikan MySQL running di Laragon
- Database `jamkrida-ppid` sudah dibuat
- Run: `npm run db:migrate` lagi

### Halaman 404?
- Semua 48 routes sudah dibuat
- Coba refresh atau restart server

---

## 📝 Checklist Setup

- [ ] `.env` sudah update dengan Cloudinary credentials
- [ ] `npm install` — install dependencies
- [ ] `npm run db:migrate` — create database
- [ ] `npm run db:seed` — seed data
- [ ] `npm run dev` — start server
- [ ] Login admin berhasil
- [ ] Media upload berhasil
- [ ] Cek halaman publik rendering dengan benar
- [ ] Ganti default admin password

---

## 🎉 Project Status

**Fase 9 — COMPLETE** ✅
- Media Library dengan Cloudinary integration
- Settings management untuk footer
- 31 halaman publik dengan PageBanner
- 16 admin pages untuk content management
- Hero banner dengan warna merah & judul di semua page

**Siap untuk Fase 10:** Search, SEO, Aksesibilitas, Performa

---

## 📞 Support

Jika ada masalah:
1. Check console log di server terminal
2. Check browser console (F12)
3. Verifikasi credentials di `.env`
4. Restart server dan clear cache

Good luck! 🚀
