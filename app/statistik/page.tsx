import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Statistik" };

export default async function StatistikPage() {
  const [navItems, settings, statistics] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.siteSetting.findMany(),
    prisma.statistic.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
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
      <PageBanner title="Statistik" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Statistik" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          {statistics.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
              <p className="text-neutral-500">Belum ada data statistik</p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {statistics.map((stat) => (
                <div key={stat.id} className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
                  <p className="text-3xl font-bold text-brand">{stat.value}</p>
                  <p className="mt-2 text-sm font-medium text-neutral-900">{stat.title}</p>
                  {stat.description && (
                    <p className="mt-1 text-xs text-neutral-600">{stat.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
