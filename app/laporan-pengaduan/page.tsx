import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Laporan Pengaduan" };

export default async function LaporanPengaduanPage() {
  const [navItems, settings, documents] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.siteSetting.findMany(),
    prisma.document.findMany({
      where: { status: "PUBLISHED", category: "Laporan Pengaduan" },
      orderBy: { year: "desc" },
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
      <PageBanner title="Laporan Pengaduan" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Laporan Pengaduan" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          {documents.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
              <p className="text-neutral-500">Belum ada laporan pengaduan</p>
            </div>
          ) : (
            <div className="mt-8 space-y-3 rounded-lg border border-neutral-200 bg-white divide-y">
              {documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">{doc.title}</p>
                    <p className="text-sm text-neutral-500 mt-1">{doc.year}</p>
                  </div>
                  <span className="text-sm text-brand">Unduh →</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
