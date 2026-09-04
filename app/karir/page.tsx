import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Karir" };

export default async function KarirPage() {
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
      where: { status: "PUBLISHED", category: "Karir" },
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
      <PageBanner title="Karir" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Karir" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 rounded-lg border border-brand/30 bg-brand/5 p-6 mb-8">
            <h2 className="font-semibold text-neutral-900">Bergabunglah dengan Kami</h2>
            <p className="mt-3 text-sm text-neutral-700">
              PT Jamkrida Bali Mandara mencari talenta terbaik untuk bergabung dengan tim kami. Kami menawarkan lingkungan kerja yang profesional, kesempatan pengembangan karir, dan kompensasi yang kompetitif.
            </p>
          </div>

          {news.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
              <p className="text-neutral-500">Belum ada lowongan pekerjaan yang dipublikasikan</p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {news.map((item) => (
                <article key={item.id} className="rounded-lg border border-neutral-200 bg-white p-6">
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 mb-3">
                    Lowongan
                  </span>
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

          <div className="mt-10 rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="font-semibold text-neutral-900">Hubungi HR</h2>
            <p className="mt-3 text-sm text-neutral-700">
              Untuk informasi lebih lanjut tentang peluang karir, silakan hubungi:
            </p>
            <div className="mt-4 space-y-2 text-sm text-neutral-700">
              <p><strong>Email:</strong> {siteSettings.email || "ppid@jamkridabali.co.id"}</p>
              <p><strong>Telepon:</strong> {siteSettings.phone || "(0361) 000000"}</p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
