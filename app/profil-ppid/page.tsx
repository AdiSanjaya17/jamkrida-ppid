import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { PageBanner } from "@/components/public/page-banner";
import { SiteFooter } from "@/components/public/site-footer";

export const metadata = { title: "Profil PPID" };

export default async function ProfilPPIDPage() {
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

      <PageBanner
        title="Profil PPID"
        breadcrumb={[{ label: "Profil PPID" }]}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <div className="rounded-lg border border-neutral-200 bg-white p-8">
            <h1 className="text-3xl font-bold text-brand-dark">Profil PPID</h1>
            <p className="mt-4 text-neutral-600">
              Unit Pelayanan Informasi Publik (PPID) PT Jamkrida Bali Mandara (Perseroda) merupakan unit yang bertanggung jawab atas pelayanan informasi publik sesuai dengan Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.
            </p>

            <div className="mt-8 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-brand-dark">Visi</h2>
                <p className="mt-2 text-neutral-700">
                  Menjadi unit pelayanan informasi publik yang terpercaya dan transparan dalam memberikan akses informasi kepada masyarakat.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-brand-dark">Misi</h2>
                <ul className="mt-2 list-inside list-disc space-y-2 text-neutral-700">
                  <li>Memberikan akses informasi publik yang lengkap, akurat, dan tepat waktu</li>
                  <li>Memastikan transparansi dalam penyelenggaraan pemerintahan perusahaan</li>
                  <li>Mendukung partisipasi masyarakat dalam pengambilan keputusan publik</li>
                  <li>Meningkatkan kepercayaan publik terhadap perusahaan</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-brand-dark">Dasar Hukum</h2>
                <ul className="mt-2 list-inside list-disc space-y-2 text-neutral-700">
                  <li>Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik</li>
                  <li>Peraturan Pemerintah No. 61 Tahun 2010 tentang Pelaksanaan UU KIP</li>
                  <li>Peraturan Menteri BUMN tentang Penyelenggaraan Pelayanan Informasi Publik di BUMN</li>
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
