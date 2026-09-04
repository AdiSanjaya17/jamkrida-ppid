import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Pendirian BUMD" };

export default async function PendirianBUMDPage() {
  const [navItems, settings] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.siteSetting.findMany(),
  ]);

  const nav: PublicNavItem[] = navItems.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    children: item.children.map((c) => ({ id: c.id, title: c.title, url: c.url })),
  }));

  const siteSettings = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader navItems={nav} />
      <PageBanner title="Pendirian BUMD" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Pendirian BUMD" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 rounded-lg border border-neutral-200 bg-white p-8">
            <section className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-brand-dark">Sejarah Pendirian</h2>
                <p className="mt-3 text-neutral-700">
                  PT Jamkrida Bali Mandara (Perseroda) didirikan sebagai Badan Usaha Milik Daerah (BUMD) melalui Peraturan Daerah Provinsi Bali dengan tujuan memberikan kontribusi ekonomi dan sosial bagi pembangunan daerah.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-brand-dark">Dasar Hukum Pendirian</h2>
                <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-700">
                  <li>Peraturan Daerah Provinsi Bali tentang Pembentukan dan Pengelolaan BUMD</li>
                  <li>Undang-Undang No. 8 Tahun 1997 tentang Dokumen Perusahaan</li>
                  <li>Undang-Undang No. 40 Tahun 2007 tentang Perseroan Terbatas</li>
                  <li>Peraturan Pemerintah No. 54 Tahun 2010 tentang Pengadaan Barang/Jasa oleh BUMN/BUMD</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-brand-dark">Maksud dan Tujuan</h2>
                <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-700">
                  <li>Menyelenggarakan usaha di bidang pengadaan barang dan jasa untuk pemerintah dan masyarakat</li>
                  <li>Memberikan kontribusi terhadap peningkatan pendapatan daerah</li>
                  <li>Menciptakan lapangan kerja dan meningkatkan kesejahteraan masyarakat</li>
                  <li>Menunjang pertumbuhan dan stabilitas ekonomi daerah</li>
                  <li>Menjalankan tanggung jawab sosial perusahaan (CSR)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-brand-dark">Struktur Organisasi BUMD</h2>
                <p className="mt-3 text-neutral-700 mb-4">
                  Pengelolaan BUMD dilakukan oleh:
                </p>
                <div className="space-y-3">
                  <div className="rounded-lg border border-neutral-200 p-4">
                    <h3 className="font-semibold text-neutral-900">Pemegang Saham (RUPS)</h3>
                    <p className="mt-1 text-sm text-neutral-700">Pemerintah Provinsi Bali sebagai pemegang saham 100%</p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-4">
                    <h3 className="font-semibold text-neutral-900">Dewan Komisaris</h3>
                    <p className="mt-1 text-sm text-neutral-700">Mengawasi kebijakan manajemen dan jalannya usaha</p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-4">
                    <h3 className="font-semibold text-neutral-900">Dewan Direksi</h3>
                    <p className="mt-1 text-sm text-neutral-700">Menjalankan operasional perusahaan sesuai kebijakan RUPS</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-brand/30 bg-brand/5 p-6">
                <h3 className="font-semibold text-neutral-900">Untuk Informasi Lengkap</h3>
                <p className="mt-2 text-sm text-neutral-700">
                  Silakan hubungi Unit Pelayanan Informasi Publik kami untuk mendapatkan dokumen pendiri dan anggaran dasar perusahaan.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
