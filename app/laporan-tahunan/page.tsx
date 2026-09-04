import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { PageBanner } from "@/components/public/page-banner";
import { SiteFooter } from "@/components/public/site-footer";
import { FileText, Download } from "lucide-react";

export const metadata = { title: "Laporan Tahunan" };

export default async function LaporanTahunanPage() {
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
      where: { status: "PUBLISHED", category: "Laporan Tahunan" },
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

      <PageBanner
        title="Laporan Tahunan"
        breadcrumb={[{ label: "Laporan Tahunan" }]}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          {documents.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
              <p className="text-neutral-500">Belum ada laporan tahunan</p>
            </div>
          ) : (
            <div className="mt-8 space-y-3 rounded-lg border border-neutral-200 bg-white divide-y divide-neutral-100">
              {documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900">{doc.title}</p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {doc.year} • {doc.fileType || "PDF"}
                      </p>
                    </div>
                  </div>
                  <Download className="h-5 w-5 shrink-0 text-neutral-400" />
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
