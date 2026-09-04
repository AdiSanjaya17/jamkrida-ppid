import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { PageBanner } from "@/components/public/page-banner";
import { SiteFooter } from "@/components/public/site-footer";
import { BeritaList, type NewsItem } from "@/components/public/berita-list";

export const metadata = {
  title: "Berita – PPID | PT Jamkrida Bali Mandara (Perseroda)",
  description:
    "Portal informasi dan berita terkini Pejabat Pengelola Informasi dan Dokumentasi PT Jamkrida Bali Mandara (Perseroda).",
};

export const dynamic = "force-dynamic";

export default async function BeritaPage() {
  const [navItems, settings, newsList] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.siteSetting.findMany(),
    prisma.news.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      // Kolom `content` bisa sangat besar — tidak dipakai di halaman list,
      // jadi tidak diambil untuk menghemat payload query.
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnailUrl: true,
        category: true,
        publishedAt: true,
        createdAt: true,
      },
    }),
  ]);

  const nav: PublicNavItem[] = navItems.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    children: item.children.map((c) => ({ id: c.id, title: c.title, url: c.url })),
  }));

  const siteSettings = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const newsItems: NewsItem[] = newsList.map((n) => ({
    id: n.id,
    title: n.title,
    slug: n.slug,
    excerpt: n.excerpt,
    thumbnailUrl: n.thumbnailUrl,
    category: n.category,
    publishedAt: n.publishedAt,
    createdAt: n.createdAt,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50/50">
      <SiteHeader navItems={nav} />

      <PageBanner
        title="Berita"
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Berita" }]}
      />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BeritaList initialNews={newsItems} />
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
