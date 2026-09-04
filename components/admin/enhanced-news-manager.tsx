"use client";

import { useState } from "react";
import { saveContentItem, deleteContentItem } from "@/lib/actions/content";
import { toast } from "sonner";
import { Plus, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";

export function EnhancedNewsManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("upload");
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    thumbnailUrl: "",
    images: [] as Array<{ url: string; type: "upload" | "url" }>,
  });

  const handleAddImage = () => {
    if (uploadMode === "url") {
      const url = prompt("Masukkan URL gambar:");
      if (url) {
        setForm({
          ...form,
          images: [...form.images, { url, type: "url" }],
        });
        toast.success("Gambar ditambahkan");
      }
    }
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setForm({
          ...form,
          images: [...form.images, { url, type: "upload" }],
        });
        toast.success("Gambar ditambahkan");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
  };

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
        content: form.content,
        thumbnailUrl: form.thumbnailUrl,
        images: JSON.stringify(form.images.map((img) => img.url)),
        status: "PUBLISHED",
      });
      toast.success(editId ? "Berita diperbarui" : "Berita ditambahkan");
      setForm({
        title: "",
        excerpt: "",
        content: "",
        thumbnailUrl: "",
        images: [],
      });
      setEditId(null);
      setIsOpen(false);
    } catch (error) {
      toast.error("Gagal menyimpan berita");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-neutral-900">Berita Terbaru</h2>
        <p className="text-sm text-neutral-600 mt-1">
          Kelola berita dengan multiple gambar, animasi zoom, dan detail page
        </p>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue-light"
      >
        <Plus className="h-4 w-4" /> Tambah Berita
      </button>

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-neutral-200 p-6 bg-white space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Judul Berita *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              placeholder="Masukkan judul berita"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Ringkasan (excerpt)
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              rows={3}
              placeholder="Ringkasan singkat berita"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Konten Lengkap
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              rows={6}
              placeholder="Isi konten berita lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Gambar Thumbnail (untuk preview di homepage)
            </label>
            <input
              type="url"
              value={form.thumbnailUrl}
              onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              placeholder="https://..."
            />
            {form.thumbnailUrl && (
              <div className="mt-2 relative h-40 w-full">
                <Image
                  src={form.thumbnailUrl}
                  alt="Thumbnail"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Gambar Detail Berita (multiple)
            </label>

            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setUploadMode("upload")}
                className={`px-3 py-2 text-sm rounded-md transition ${
                  uploadMode === "upload"
                    ? "bg-brand text-white"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                <Upload className="h-4 w-4 inline mr-2" /> Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className={`px-3 py-2 text-sm rounded-md transition ${
                  uploadMode === "url"
                    ? "bg-brand text-white"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                Link URL
              </button>
            </div>

            {uploadMode === "upload" && (
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                className="block"
              />
            )}

            {uploadMode === "url" && (
              <button
                type="button"
                onClick={handleAddImage}
                className="px-3 py-2 text-sm bg-neutral-100 rounded-md hover:bg-neutral-200 text-neutral-700"
              >
                + Tambah URL Gambar
              </button>
            )}

            {form.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <div className="relative h-24 w-full">
                      <Image
                        src={img.url}
                        alt={`Gambar ${idx + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setForm({
                  title: "",
                  excerpt: "",
                  content: "",
                  thumbnailUrl: "",
                  images: [],
                });
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
        💡 Berita akan otomatis ditampilkan di homepage dengan animasi zoom & clickable ke detail page
      </p>
    </div>
  );
}
