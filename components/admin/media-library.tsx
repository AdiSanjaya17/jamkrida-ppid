"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Copy, Loader2, ImageIcon, Link as LinkIcon } from "lucide-react";
import { uploadMedia, deleteMedia, addMediaFromUrl } from "@/lib/actions/media";

export type MediaItem = {
  id: string;
  url: string;
  altText: string | null;
  fileName: string | null;
  fileSizeKb: number | null;
  createdAt: string;
};

export function MediaLibrary({ items }: { items: MediaItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");
  const [urlFileName, setUrlFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadMedia(formData);
    setUploading(false);
    if (result.ok) {
      toast.success("File berhasil diunggah");
      if (fileRef.current) fileRef.current.value = "";
    } else {
      setNotice(result.ok === false ? result.error : null);
      toast.error(result.ok === false ? result.error : "Upload gagal");
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      toast.error("Masukkan URL gambar");
      return;
    }
    setUploading(true);
    const result = await addMediaFromUrl(urlInput, urlFileName || "Gambar dari URL");
    setUploading(false);
    if (result.ok) {
      toast.success("Gambar dari URL berhasil ditambahkan");
      setUrlInput("");
      setUrlFileName("");
    } else {
      setNotice(result.ok === false ? result.error : null);
      toast.error(result.ok === false ? result.error : "Gagal menambahkan gambar");
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL disalin ke clipboard");
    } catch {
      toast.error("Gagal menyalin URL");
    }
  };

  const handleDelete = (item: MediaItem) => {
    if (!confirm(`Hapus file "${item.fileName ?? item.id}" dari Cloudinary?`)) return;
    startTransition(() => {
      deleteMedia(item.id)
        .then(() => toast.success("File dihapus"))
        .catch(() => toast.error("Gagal menghapus file"));
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Media Library</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Tambahkan gambar dengan upload file atau dari URL untuk digunakan di hero, berita, atau logo mitra.
        </p>
      </div>

      {notice && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notice}
        </div>
      )}

      <div className="flex gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-1">
        <button
          onClick={() => setUploadMode("file")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            uploadMode === "file"
              ? "bg-white text-brand shadow-sm"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <Upload className="mr-2 inline-block h-4 w-4" />
          Upload File
        </button>
        <button
          onClick={() => setUploadMode("url")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            uploadMode === "url"
              ? "bg-white text-brand shadow-sm"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <LinkIcon className="mr-2 inline-block h-4 w-4" />
          Dari URL
        </button>
      </div>

      {uploadMode === "file" && (
        <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand/5 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand/10"
            />
            <button
              onClick={handleFileUpload}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-light disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Mengunggah..." : "Unggah"}
            </button>
          </div>
          <p className="text-xs text-neutral-500">
            Maks. 10MB, format gambar (JPG/PNG/WebP/SVG)
          </p>
        </div>
      )}

      {uploadMode === "url" && (
        <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
          <div className="space-y-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">
                URL Gambar <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">
                Nama File (opsional)
              </label>
              <input
                type="text"
                value={urlFileName}
                onChange={(e) => setUrlFileName(e.target.value)}
                placeholder="Nama file untuk referensi"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
          <button
            onClick={handleUrlSubmit}
            disabled={uploading || !urlInput.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-light disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
            {uploading ? "Memproses..." : "Tambahkan dari URL"}
          </button>
          <p className="text-xs text-neutral-500">
            Masukkan URL lengkap gambar yang ingin ditambahkan ke media library
          </p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-14 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-500">
            Belum ada media. Unggah gambar atau tambahkan dari URL.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-lg border border-neutral-200 bg-white"
            >
              <div className="aspect-video bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.altText ?? "Media"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-neutral-800">
                  {item.fileName ?? "tanpa-nama"}
                </p>
                <p className="text-[11px] text-neutral-500">
                  {item.fileSizeKb ? `${item.fileSizeKb} KB` : ""}
                </p>
                <div className="mt-2 flex gap-1">
                  <button
                    onClick={() => handleCopy(item.url)}
                    title="Salin URL"
                    className="inline-flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 text-[11px] font-medium text-neutral-600 hover:bg-neutral-50"
                  >
                    <Copy className="h-3 w-3" /> URL
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={isPending}
                    title="Hapus"
                    className="inline-flex items-center gap-1 rounded border border-red-200 px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
