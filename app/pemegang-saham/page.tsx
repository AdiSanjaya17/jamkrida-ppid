import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Pemegang Saham" };

export default async function PemegangSahamPage() {
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
      <PageBanner title="Pemegang Saham" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Pemegang Saham" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 rounded-lg border border-neutral-200 bg-white p-8">
            <p className="text-neutral-700">
              PT Jamkrida Bali Mandara (Perseroda) merupakan Badan Usaha Milik Daerah (BUMD) yang sahamnya dimiliki oleh Pemerintah Provinsi Bali.
            </p>

            <div className="mt-8 space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-brand-dark">Struktur Kepemilikan Saham</h2>
                <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-700">Pemerintah Provinsi Bali</span>
                      <span className="font-semibold text-brand">100%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-200">
                      <div className="h-2 w-full rounded-full bg-brand"></div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-brand-dark">Hak dan Kewajiban Pemegang Saham</h2>
                <div className="mt-4 space-y-4">
                  <div className="rounded-lg border border-neutral-200 p-4">
                    <h3 className="font-semibold text-neutral-900">Hak Pemegang Saham</h3>
                    <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-neutral-700">
                      <li>Menghadiri dan memberikan suara dalam Rapat Umum Pemegang Saham (RUPS)</li>
                      <li>Menerima laporan keuangan tahunan</li>
                      <li>Menerima dividen sesuai ketentuan RUPS</li>
                      <li>Mengajukan pengaduan dan saran</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-neutral-200 p-4">
                    <h3 className="font-semibold text-neutral-900">Kewajiban Pemegang Saham</h3>
                    <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-neutral-700">
                      <li>Membayar iuran saham sesuai perjanjian</li>
                      <li>Mematuhi anggaran dasar dan anggaran rumah tangga perusahaan</li>
                      <li>Mendukung kebijakan strategis perusahaan</li>
                      <li>Mengawasi kinerja manajemen perusahaan</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-brand-dark">Rapat Umum Pemegang Saham (RUPS)</h2>
                <p className="mt-3 text-neutral-700">
                  RUPS dilaksanakan secara berkala sesuai dengan peraturan perundang-undangan yang berlaku untuk membahas dan mengambil keputusan tentang:
                </p>
                <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-700">
                  <li>Penetapan garis besar kebijakan strategi perusahaan</li>
                  <li>Persetujuan laporan keuangan tahunan</li>
                  <li>Penunjukan dan pemberhentian anggota Dewan Direksi dan Komisaris</li>
                  <li>Penetapan remunerasi direksi dan komisaris</li>
                  <li>Pengeluaran modal dan pengalokasian laba</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
