import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Informasi Serta Merta" };

export default async function InformasiSertaMertaPage() {
  const [navItems, settings, infos] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.siteSetting.findMany(),
    prisma.publicInformation.findMany({
      where: { status: "PUBLISHED", category: "SERTA_MERTA" },
      orderBy: { publicationDate: "desc" },
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
      <PageBanner title="Informasi Serta Merta" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Informasi Serta Merta" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          {infos.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
              <p className="text-neutral-500">Belum ada informasi serta merta</p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {infos.map((info) => (
                <div key={info.id} className="rounded-lg border-l-4 border-l-amber-500 border border-neutral-200 bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-neutral-900">{info.title}</h2>
                      {info.publicationDate && (
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(info.publicationDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                      {info.description && (
                        <p className="mt-3 text-neutral-700">{info.description}</p>
                      )}
                      {info.content && (
                        <div className="mt-4 text-neutral-700 whitespace-pre-wrap">
                          {info.content}
                        </div>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      Serta Merta
                    </span>
                  </div>
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
