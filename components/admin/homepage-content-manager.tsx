"use client";

import { useOptimistic, useState } from "react";
import { saveContentItem, deleteContentItem } from "@/lib/actions/content";
import { toast } from "sonner";
import { Plus, Trash2, Edit2 } from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  thumbnailUrl?: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: Date | null;
};

type PartnerItem = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
  order: number;
};

export function HomepageContentManager() {
  const [tab, setTab] = useState<"news" | "partners">("news");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-neutral-900">Konten Homepage</h2>
        <p className="text-sm text-neutral-600 mt-1">
          Kelola Berita dan Mitra yang ditampilkan di halaman beranda
        </p>
      </div>

      <div className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setTab("news")}
          className={`px-4 py-2 text-sm font-medium transition ${
            tab === "news"
              ? "border-b-2 border-brand text-brand"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          📰 Berita Terbaru
        </button>
        <button
          onClick={() => setTab("partners")}
          className={`px-4 py-2 text-sm font-medium transition ${
            tab === "partners"
              ? "border-b-2 border-brand text-brand"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          🤝 Mitra Kami
        </button>
      </div>

      {tab === "news" && <NewsContentTab />}
      {tab === "partners" && <PartnersContentTab />}
    </div>
  );
}

function NewsContentTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    thumbnailUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Judul tidak boleh kosong");
      return;
    }

    try {
      await saveContentItem("news", editId, {
        title: form.title,
        excerpt: form.excerpt,
        thumbnailUrl: form.thumbnailUrl,
        content: form.excerpt,
        status: "PUBLISHED",
      });
      toast.success(editId ? "Berita diperbarui" : "Berita ditambahkan");
      setForm({ title: "", excerpt: "", thumbnailUrl: "" });
      setEditId(null);
      setIsOpen(false);
    } catch (error) {
      toast.error("Gagal menyimpan berita");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue-light"
      >
        <Plus className="h-4 w-4" /> Tambah Berita
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-neutral-200 p-6 bg-white space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Judul Berita
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              placeholder="Masukkan judul berita"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Ringkasan
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              rows={4}
              placeholder="Masukkan ringkasan berita"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              URL Gambar Thumbnail
            </label>
            <input
              type="url"
              value={form.thumbnailUrl}
              onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              placeholder="https://..."
            />
            {form.thumbnailUrl && (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.thumbnailUrl}
                  alt="Preview"
                  className="h-40 w-full object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setForm({ title: "", excerpt: "", thumbnailUrl: "" });
                setEditId(null);
              }}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue-light"
            >
              {editId ? "Perbarui" : "Simpan"}
            </button>
          </div>
        </form>
      )}

      <p className="text-sm text-neutral-500">
        💡 Berita akan otomatis ditampilkan di section &quot;Berita Terbaru&quot; jika status PUBLISHED
      </p>
    </div>
  );
}

function PartnersContentTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.logoUrl.trim()) {
      toast.error("Nama dan logo wajib diisi");
      return;
    }

    try {
      await saveContentItem("partner", null, {
        name: form.name,
        logoUrl: form.logoUrl,
        websiteUrl: form.websiteUrl,
        order: 0,
        isActive: true,
      });
      toast.success("Mitra ditambahkan");
      setForm({ name: "", logoUrl: "", websiteUrl: "" });
      setIsOpen(false);
    } catch (error) {
      toast.error("Gagal menyimpan mitra");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue-light"
      >
        <Plus className="h-4 w-4" /> Tambah Mitra
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-neutral-200 p-6 bg-white space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Nama Mitra
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              placeholder="PT/Organisasi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              URL Logo (persegi/kotak)
            </label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              placeholder="https://..."
            />
            {form.logoUrl && (
              <div className="mt-3 p-4 bg-neutral-50 rounded-md flex items-center justify-center h-32">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.logoUrl}
                  alt="Logo Preview"
                  className="h-full w-auto object-contain"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Website Mitra (opsional)
            </label>
            <input
              type="url"
              value={form.websiteUrl}
              onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setForm({ name: "", logoUrl: "", websiteUrl: "" });
              }}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue-light"
            >
              Simpan
            </button>
          </div>
        </form>
      )}

      <p className="text-sm text-neutral-500">
        💡 Mitra akan ditampilkan di section &quot;Mitra Kami&quot; dengan logo dalam grid
      </p>
    </div>
  );
}
