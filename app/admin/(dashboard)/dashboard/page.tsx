import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import {
  FileText,
  Newspaper,
  FolderOpen,
  Info,
  ArrowUpRight,
} from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [
    totalNews,
    totalDocuments,
    totalPublicInfo,
    totalPages,
    totalMedia,
    latestNews,
  ] = await Promise.all([
    prisma.news.count(),
    prisma.document.count(),
    prisma.publicInformation.count(),
    prisma.page.count(),
    prisma.media.count(),
    prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, status: true, createdAt: true },
    }),
  ]);

  const stats = [
    { label: "Berita & Pengumuman", value: totalNews, icon: Newspaper, href: "/admin/news" },
    { label: "Dokumen & Laporan", value: totalDocuments, icon: FolderOpen, href: "/admin/documents" },
    { label: "Informasi Publik", value: totalPublicInfo, icon: Info, href: "/admin/public-information" },
    { label: "Halaman Statis", value: totalPages, icon: FileText, href: "/admin/pages" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Ringkasan konten Portal PPID.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-brand"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/5 text-brand">
                <stat.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-brand" />
            </div>
            <p className="mt-4 text-2xl font-bold text-neutral-900">
              {stat.value}
            </p>
            <p className="text-sm text-neutral-600">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <h2 className="font-semibold text-neutral-900">Berita Terbaru</h2>
            <Link
              href="/admin/news"
              className="text-sm font-medium text-brand hover:underline"
            >
              Kelola berita
            </Link>
          </div>
          {latestNews.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-neutral-500">
                Belum ada berita. Mulai buat berita pertama Anda.
              </p>
              <Link
                href="/admin/news"
                className="mt-3 inline-flex rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-light"
              >
                + Buat Berita
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {latestNews.map((news) => (
                <li key={news.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {news.title}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(news.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      news.status === "PUBLISHED"
                        ? "bg-green-50 text-green-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {news.status === "PUBLISHED" ? "Terbit" : "Draft"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="font-semibold text-neutral-900">Media Library</h2>
          <p className="mt-1 text-sm text-neutral-600">
            {totalMedia} file tersimpan di Cloudinary.
          </p>
          <Link
            href="/admin/media"
            className="mt-4 inline-flex rounded-md border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5"
          >
            Buka Media Library
          </Link>
        </div>
      </div>
    </div>
  );
}
