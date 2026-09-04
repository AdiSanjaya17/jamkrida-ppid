import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Sejarah PPID" };

export default async function SejarahPPIDPage() {
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
      <PageBanner title="Sejarah PPID" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Sejarah PPID" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 space-y-6 rounded-lg border border-neutral-200 bg-white p-8">
            <p className="text-neutral-700">
              Unit Pelayanan Informasi Publik (PPID) PT Jamkrida Bali Mandara (Perseroda) didirikan sebagai bagian dari komitmen perusahaan terhadap transparansi dan akuntabilitas publik.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark">Perkembangan PPID</h2>
              <div className="mt-4 space-y-4 border-l-2 border-brand/30 pl-6">
                <div>
                  <p className="font-semibold text-neutral-900">Tahun 2008</p>
                  <p className="text-sm text-neutral-700">
                    Berlakunya Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik mendorong perusahaan untuk membentuk unit PPID.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Tahun 2010</p>
                  <p className="text-sm text-neutral-700">
                    Pembentukan formal Unit Pelayanan Informasi Publik dengan struktur organisasi dan prosedur operasional yang jelas.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Tahun 2015</p>
                  <p className="text-sm text-neutral-700">
                    Peningkatan kualitas layanan dengan implementasi sistem manajemen informasi terintegrasi.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Tahun 2023</p>
                  <p className="text-sm text-neutral-700">
                    Digitalisasi Portal PPID dan modernisasi layanan informasi publik berbasis teknologi informasi.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark">Komitmen Kami</h2>
              <p className="mt-3 text-neutral-700">
                Sejak awal, PPID berkomitmen untuk menjadi jembatan komunikasi antara perusahaan dan publik dalam hal transparansi informasi. Kami terus berinovasi untuk memberikan pelayanan informasi publik yang lebih baik, lebih cepat, dan lebih mudah diakses oleh semua kalangan masyarakat.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
