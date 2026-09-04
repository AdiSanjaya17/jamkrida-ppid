import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const news = await prisma.news.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const news = await prisma.news.findUnique({
    where: { slug },
  });

  if (!news) return {};

  return {
    title: news.seoTitle || news.title,
    description: news.seoDescription || news.excerpt,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const [news, navItems, settings] = await Promise.all([
    prisma.news.findUnique({
      where: { slug },
    }),
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.siteSetting.findMany(),
  ]);

  if (!news || news.status !== "PUBLISHED") {
    notFound();
  }

  const nav: PublicNavItem[] = navItems.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    children: item.children.map((c) => ({ id: c.id, title: c.title, url: c.url })),
  }));

  const siteSettings = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  let images: string[] = [];
  try {
    const parsed = JSON.parse(news.images || "[]");
    images = Array.isArray(parsed) ? parsed : [];
  } catch {
    images = [];
  }

  const relatedNews = await prisma.news.findMany({
    where: {
      status: "PUBLISHED",
      slug: { not: slug },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader navItems={nav} overlay={false} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-neutral-900 py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-4 lg:px-8">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Berita
            </Link>

            <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight text-white">
              {news.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-400">
              {news.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(news.publishedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}
              {news.category && (
                <div className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
                  {news.category}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="mx-auto max-w-4xl px-4 lg:px-8 py-12 lg:py-16">
          {/* Thumbnail */}
          {news.thumbnailUrl && (
            <div className="mb-12 rounded-2xl overflow-hidden border border-neutral-200 shadow-lg">
              <div className="relative h-96 w-full">
                <Image
                  src={news.thumbnailUrl}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Excerpt */}
          {news.excerpt && (
            <p className="text-xl text-neutral-700 leading-relaxed mb-8 pb-8 border-b border-neutral-200">
              {news.excerpt}
            </p>
          )}

          {/* Main Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {news.content.split("\n").map((paragraph, idx) => (
              <p key={idx} className="text-neutral-700 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Gallery Section */}
          {images.length > 0 && (
            <section className="mb-12 pb-12 border-t border-neutral-200 pt-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-8">Galeri Foto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, idx) => (
                  <div
                    key={idx}
                    className="group rounded-xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                      <Image
                        src={image}
                        alt={`Galeri ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-sm text-neutral-600">
                        Foto {idx + 1} dari {images.length}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <section className="bg-neutral-50 py-12 lg:py-16 border-t border-neutral-200">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-8">Berita Terkait</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedNews.map((relatedItem) => (
                  <Link
                    key={relatedItem.id}
                    href={`/berita/${relatedItem.slug}`}
                    className="group rounded-xl border border-neutral-200 overflow-hidden bg-white hover:shadow-lg transition-shadow"
                  >
                    {relatedItem.thumbnailUrl && (
                      <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                        <Image
                          src={relatedItem.thumbnailUrl}
                          alt={relatedItem.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-xs text-neutral-500 mb-2">
                        {relatedItem.publishedAt?.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="text-sm font-bold text-neutral-900 line-clamp-2 group-hover:text-brand transition-colors">
                        {relatedItem.title}
                      </h3>
                      {relatedItem.excerpt && (
                        <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
                          {relatedItem.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
