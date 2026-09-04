import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Agenda" };

export default async function AgendaPage() {
  const [navItems, settings, news] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.siteSetting.findMany(),
    prisma.news.findMany({
      where: { status: "PUBLISHED", category: "Agenda" },
      orderBy: { publishedAt: "desc" },
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
      <PageBanner title="Agenda" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Agenda" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          {news.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
              <p className="text-neutral-500">Belum ada agenda yang dipublikasikan</p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {news.map((item) => (
                <article key={item.id} className="rounded-lg border border-neutral-200 bg-white p-6">
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-brand">
                          {new Date(item.publishedAt ?? item.createdAt).getDate()}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {new Date(item.publishedAt ?? item.createdAt).toLocaleDateString("id-ID", {
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-neutral-900">{item.title}</h2>
                      <p className="mt-2 text-neutral-700">{item.excerpt}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
