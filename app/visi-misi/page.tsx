import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { PageBanner } from "@/components/public/page-banner";
import { SiteFooter } from "@/components/public/site-footer";

export const metadata = { title: "Visi & Misi" };

export default async function VisiMisiPage() {
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
        title="Visi & Misi"
        breadcrumb={[{ label: "Visi & Misi" }]}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-brand-dark">Visi</h2>
              <p className="mt-4 text-lg text-neutral-700">
                Menjadi perusahaan yang dipercaya publik melalui penyelenggaraan pelayanan informasi publik yang transparan, akurat, dan responsif.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-dark">Misi</h2>
              <ul className="mt-4 space-y-3 text-neutral-700">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand"></span>
                  <span>Memberikan akses informasi publik yang lengkap, akurat, dan tepat waktu kepada seluruh stakeholder</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand"></span>
                  <span>Memastikan transparansi dalam setiap aspek penyelenggaraan pemerintahan perusahaan</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand"></span>
                  <span>Mendukung partisipasi masyarakat dalam pengambilan keputusan publik yang strategis</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand"></span>
                  <span>Meningkatkan kepercayaan dan reputasi perusahaan di mata publik</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand"></span>
                  <span>Memperkuat komitmen terhadap pemenuhan UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
