# 🎯 QUICK START GUIDE — JAMKRIDA-PPID

## Admin Panel Access
**URL:** `http://localhost:3000/admin/homepage`

---

## 1️⃣ Tambah Berita Baru

**Step-by-step:**
1. Click "📰 Berita Terbaru" tab
2. Click blue "+ Tambah Berita" button
3. Fill form:
   - **Judul Berita*** — required
   - **Ringkasan (excerpt)** — shown on homepage
   - **Konten Lengkap** — full article text
   - **Gambar Thumbnail** — URL untuk homepage preview

4. **Tambah Multiple Gambar:**
   - Toggle "Upload" atau "Link URL"
   - Click "+ Tambah URL Gambar" atau select file
   - Grid preview akan muncul
   - Click X di hover untuk remove

5. Click "Simpan" → Done! 

**Hasil:**
- ✅ Berita auto-publish
- ✅ Appear di homepage dengan animasi zoom
- ✅ Click → Detail page dengan gallery
- ✅ Live in 1-2 detik

---

## 2️⃣ Tambah Mitra Baru

**Step-by-step:**
1. Click "🤝 Mitra Kami" tab
2. Click blue "+ Tambah Mitra" button
3. Fill form:
   - **Nama Mitra*** — required (e.g., "PT Jamkrida Bali")
   - **Logo Mitra*** — required
     - Toggle "Upload" atau "Link URL"
     - Upload JPG/PNG atau paste https://...
     - Preview akan show
   - **Website Mitra** — optional (e.g., https://jamkridabali.co.id)

4. Click "Simpan" → Done!

**Hasil:**
- ✅ Logo appear di carousel
- ✅ Auto-scroll animation (smooth, continuous)
- ✅ Hover → Scale up + show name tooltip
- ✅ Click → Go to website (jika ada)
- ✅ Live in 1-2 detik

---

## 3️⃣ Edit Seksi Homepage

**Available Sections:**
1. **Kategori Informasi & Kartu SK**
2. **Tentang Kami**
3. **Jadwal Pelayanan**
4. **Statistik**
5. **Berita Terbaru**
6. **Mitra Kami**

**How to edit:**
1. Scroll ke "Seksi Homepage" section
2. Click "Edit" button di section yang mau di-edit
3. Form will expand dengan fields:

**Type of Fields:**
- **Text input** — Single line text (kicker, heading, etc)
- **Textarea** — Multi-line text (description, paragraph)
- **URL input** — For image URLs
- **Array items** — Add/remove items (cards, schedules, petugas)

**Edit Text Field:**
- Click input
- Type atau paste text
- Changes auto-save ke form

**Edit Array Items (cards, categories, etc):**
- Click "+ Tambah" → Add new item
- Fill all fields untuk item itu
- Click X → Remove item
- Changes auto-save ke form

4. Click blue "Simpan" button
5. Toast notification → Success!

**Hasil:**
- ✅ Section content updated
- ✅ Homepage reload auto (revalidatePath)
- ✅ Changes live in 1-2 detik
- ✅ No code needed!

---

## 🔥 Tips & Tricks

### Image URLs
- Gunakan Cloudinary untuk production
- Support external URLs (https://...)
- Recommended: Square ratio (1:1) untuk logos
- Recommended: 16:9 untuk berita thumbnails

### Best Practices
- **Berita:** Title max 100 chars untuk homepage
- **Mitra:** Logo PNG dengan transparent background (best)
- **Section:** Keep headings concise & impactful

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Image tidak load | Check URL valid (copy-paste dari browser) |
| Form tidak save | Check all required fields filled (marked with *) |
| Homepage tidak update | Refresh browser (Ctrl+F5 hard refresh) |
| Animation tidak smooth | Clear browser cache / use incognito mode |

---

## 📊 What's Live on Homepage

✅ **Hero Carousel**
- Manage di "Hero Slides" section (top)
- Multiple slides, click-through buttons
- Auto-rotate carousel

✅ **Berita Terbaru Section**
- Featured article + 3 related news
- Animated zoom on hover
- Click → Detail page

✅ **Mitra Kami Section**
- Auto-scroll carousel
- Smooth infinite loop
- Hover → Scale up + tooltip

✅ **Seksi Homepage**
- All configurable dari admin
- Text + images
- No code refresh needed

---

## 🎨 Animation Preview

### Berita Cards:
```
Hover state:
- Image zoom in smoothly (500ms)
- Title color change to lighter blue
- Subtle shadow increase
```

### Partners Carousel:
```
Default:
- Continuous smooth scroll
- Speed: 1px/frame = very smooth
- Infinite loop (seamless)

On hover:
- Logo scale up (110%)
- Show tooltip with name
- Slightly increase shadow
```

### Detail Page:
```
Gallery images:
- Hover: Smooth zoom (scale-110)
- Related news: Smooth color transition
- Smooth page transitions
```

---

## 🔗 Quick Links

| Page | URL |
|------|-----|
| **Admin Dashboard** | `/admin/dashboard` |
| **Homepage Manager** | `/admin/homepage` |
| **Media Library** | `/admin/media` |
| **All News** | `/admin/news` |
| **All Partners** | `/admin/partners` |
| **Public Homepage** | `/` |
| **Berita Page** | `/berita` |
| **Detail Berita** | `/berita/[slug]` |

---

## 📞 Need Help?

**Check:**
1. Toast notifications (top-right corner) — error messages
2. Browser console (F12) — no errors should appear
3. Admin panel status — all tabs accessible

**Common Issues:**
- ✅ Image URL invalid → Re-paste from browser
- ✅ Form submit stuck → Check required fields
- ✅ Changes not showing → Refresh page (F5)

---

## ✨ Summary

**3 Main Tasks:**
1. ✅ **Add Berita** — Tab 1, click add, fill form, click save
2. ✅ **Add Mitra** — Tab 2, click add, fill form, click save
3. ✅ **Edit Sections** — Scroll down, click edit, fill form, click save

**All live instantly** on homepage! 🚀

---

**Last Updated:** September 4, 2026
**Status:** ✅ Production Ready
