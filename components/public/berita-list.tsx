"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  User,
  Tag,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnailUrl: string | null;
  category: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

const ITEMS_PER_PAGE = 6;

export function BeritaList({ initialNews }: { initialNews: NewsItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Kategori unik dari data berita
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialNews.forEach((n) => {
      if (n.category) set.add(n.category);
    });
    return ["Semua", ...Array.from(set)];
  }, [initialNews]);

  // Filter berita berdasarkan pencarian & kategori
  const filteredNews = useMemo(() => {
    return initialNews.filter((item) => {
      const matchCategory =
        selectedCategory === "Semua" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const term = searchQuery.toLowerCase().trim();
      const matchSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(term));

      return matchCategory && matchSearch;
    });
  }, [initialNews, selectedCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE) || 1;
  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNews, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-10">
      {/* Bar Filter Kategori & Pencarian */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-6">
        {/* Kategori Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-brand text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Pencarian */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari berita atau artikel..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-full border border-neutral-300 bg-white py-2 pl-9 pr-4 text-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      {/* Grid Kartu Berita */}
      {paginatedNews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 py-16 text-center">
          <p className="text-base font-semibold text-neutral-700">
            Tidak ada berita yang sesuai
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedNews.map((news) => (
            <article
              key={news.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300"
            >
              {/* Thumbnail Gambar dengan Zoom In Effect */}
              <Link
                href={`/berita/${news.slug}`}
                className="relative block h-52 w-full overflow-hidden bg-neutral-100"
              >
                {news.thumbnailUrl ? (
                  <Image
                    src={news.thumbnailUrl}
                    alt={news.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/10 to-brand/5 text-brand">
                    <Sparkles className="h-10 w-10 opacity-40" />
                  </div>
                )}

                {/* Badge Kategori Melayang */}
                {news.category && (
                  <div className="absolute left-3 top-3 rounded-full bg-brand/90 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white shadow">
                    {news.category}
                  </div>
                )}
              </Link>

              {/* Konten Berita */}
              <div className="flex flex-1 flex-col p-6">
                {/* Meta Bar */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 mb-3">
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3 text-brand" />
                    PPID Jamkrida
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-brand" />
                    {new Date(news.publishedAt ?? news.createdAt).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>

                {/* Judul Berita */}
                <h2 className="text-base font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                  <Link href={`/berita/${news.slug}`}>{news.title}</Link>
                </h2>

                {/* Ringkasan Isi */}
                {news.excerpt && (
                  <p className="mt-2.5 text-xs text-neutral-600 leading-relaxed line-clamp-3">
                    {news.excerpt}
                  </p>
                )}

                {/* Link Baca Selengkapnya */}
                <div className="mt-auto pt-5 border-t border-neutral-100 flex items-center justify-between">
                  <Link
                    href={`/berita/${news.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-blue-light transition-colors"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-brand text-white shadow-sm"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Halaman Berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
