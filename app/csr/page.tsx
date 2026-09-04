import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";
import { FileText } from "lucide-react";

export const metadata = {
  title: "CSR",
  description:
    "Laporan dan kegiatan Corporate Social Responsibility (CSR) PT Jamkrida Bali Mandara (Perseroda).",
};

// dynamic — laporan & kegiatan CSR dikelola via CMS admin
export const dynamic = "force-dynamic";

function formatDate(d: Date | null) {
  return new Date(d ?? new Date()).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function CSRPage() {
  const [navItems, settings, reports, activities] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.siteSetting.findMany(),
    prisma.document.findMany({
      where: { status: "PUBLISHED", category: { contains: "CSR" } },
      orderBy: { year: "desc" },
    }),
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
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          {/* Intro — seperti situs lama: "CSR - Corporate Social Responsibility" */}
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold text-neutral-900 lg:text-4xl">
              CSR - Corporate Social Responsibility
            </h1>
            <p className="mt-3 text-lg text-neutral-600">
              Laporan Tanggung Jawab Sosial PT Jamkrida Bali Mandara (Perseroda)
            </p>
            <div className="mt-4 h-1 w-24 rounded bg-brand" />
          </div>

          {/* Laporan CSR */}
          {reports.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-neutral-900">Laporan CSR</h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-2xl">
                {reports.map((doc) => (
                  <div
                    key={doc.id}
                    className="group flex flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-neutral-900">{doc.title}</h3>
                    {doc.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{doc.description}</p>
                    ) : null}
                    {doc.fileUrl ? (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-blue-light"
                      >
                        DETAIL
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Kegiatan CSR */}
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-neutral-900">
              Kegiatan Tanggung Jawab Sosial PT Jamkrida Bali Mandara (Perseroda)
            </h2>
            <div className="mt-4 h-1 w-full rounded bg-brand" />

            {activities.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
                <p className="text-neutral-500">Belum ada kegiatan CSR yang dipublikasikan</p>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activities.map((item) => (
                  <article
                    key={item.id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link href={`/berita/${item.slug}`} className="block overflow-hidden bg-neutral-100">
                      {item.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-52 w-full items-center justify-center bg-brand/5">
                          <FileText className="h-10 w-10 text-brand/30" />
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      <Link href={`/berita/${item.slug}`}>
                        <h3 className="line-clamp-3 text-base font-bold leading-snug text-neutral-900 transition group-hover:text-brand">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="mt-2 text-xs text-neutral-400">
                        PPID PT Jamkrida Bali Mandara (Perseroda) • {formatDate(item.publishedAt ?? item.createdAt)}
                      </p>
                      {item.excerpt ? (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600">
                          {item.excerpt}
                        </p>
                      ) : null}
                      <Link
                        href={`/berita/${item.slug}`}
                        className="mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-sm font-semibold text-brand transition hover:gap-2.5"
                      >
                        Baca selengkapnya
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
