import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "CSR" };

export default async function CSRPage() {
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
      where: { status: "PUBLISHED", category: "CSR" },
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
      <PageBanner title="CSR" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "CSR" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          {news.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
              <p className="text-neutral-500">Belum ada program CSR yang dipublikasikan</p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {news.map((item) => (
                <article key={item.id} className="rounded-lg border border-neutral-200 bg-white p-6">
                  {item.thumbnailUrl && (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="h-48 w-full object-cover rounded-lg mb-4"
                    />
                  )}
                  <h2 className="text-lg font-semibold text-neutral-900">{item.title}</h2>
                  <p className="text-xs text-neutral-500 mt-2">
                    {new Date(item.publishedAt ?? item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-3 text-neutral-700">{item.excerpt}</p>
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
