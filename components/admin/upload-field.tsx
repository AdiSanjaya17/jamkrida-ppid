"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  X,
  FileText,
  FolderOpen,
  ExternalLink,
  Check,
  Search,
} from "lucide-react";
import { uploadMedia, getMediaList, type UploadResult } from "@/lib/actions/media";

type MediaItem = {
  id: string;
  url: string;
  fileName: string | null;
  altText: string | null;
  type: string;
  createdAt: Date;
};

/**
 * Input field gambar/file dengan upload langsung, drag-and-drop,
 * pemilih Media Library, dan pratinjau cerdas untuk dokumen & gambar.
 */
export function UploadField({
  name,
  defaultValue = "",
  accept = "image/*,application/pdf",
  hint = "Unggah file, seret & lepas, atau tempel tautan URL",
  onValueChange,
}: {
  name: string;
  defaultValue?: string;
  accept?: string;
  hint?: string;
  onValueChange?: (value: string) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (v: string) => {
    setValue(v);
    onValueChange?.(v);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result: UploadResult = await uploadMedia(formData);
    setUploading(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    update(result.url);
    if (fileRef.current) fileRef.current.value = "";
    toast.success("File berhasil diunggah");
  };

  const handleFileChange = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const openMediaPicker = async () => {
    setShowMediaModal(true);
    setLoadingMedia(true);
    try {
      const list = await getMediaList();
      setMediaList(list as unknown as MediaItem[]);
    } catch {
      toast.error("Gagal memuat galeri media");
    } finally {
      setLoadingMedia(false);
    }
  };

  const isPdf =
    value.toLowerCase().endsWith(".pdf") ||
    value.toLowerCase().includes("application/pdf");
  const isGoogleDrive = value.includes("drive.google.com");
  const isImage =
    !isPdf &&
    !isGoogleDrive &&
    Boolean(
      value.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) ||
        value.includes("cloudinary.com")
    );

  const inputClass =
    "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand";

  const filteredMedia = mediaList.filter((m) => {
    if (!mediaSearch.trim()) return true;
    const term = mediaSearch.toLowerCase();
    return (
      (m.fileName && m.fileName.toLowerCase().includes(term)) ||
      (m.altText && m.altText.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-2">
      {/* Pratinjau Nilai Aktif */}
      {value && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-2.5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Preview"
                className="h-14 w-20 shrink-0 rounded border border-neutral-200 object-cover"
              />
            ) : isPdf ? (
              <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded border border-red-200 bg-red-50 text-red-600">
                <FileText className="h-7 w-7" />
              </div>
            ) : (
              <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded border border-blue-200 bg-blue-50 text-brand">
                <ExternalLink className="h-7 w-7" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-neutral-800">
                {isPdf
                  ? "Dokumen PDF"
                  : isGoogleDrive
                    ? "Tautan Google Drive"
                    : isImage
                      ? "File Gambar"
                      : "Tautan Eksternal"}
              </p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-brand hover:underline truncate max-w-full"
              >
                <span className="truncate">{value}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => update("")}
            title="Hapus / Kosongkan"
            className="rounded p-1.5 text-red-500 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <input type="hidden" name={name} value={value} />

      {/* Input URL Manual */}
      <input
        type="text"
        value={value}
        onChange={(e) => update(e.target.value)}
        placeholder="Tempel tautan URL atau unggah file di bawah..."
        className={inputClass}
      />

      {/* Dropzone & Tombol Aksi Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-wrap items-center justify-between gap-2 rounded-md border border-dashed p-3 transition-colors ${
          isDragging
            ? "border-brand bg-brand/5"
            : "border-neutral-300 bg-white hover:border-neutral-400"
        }`}
      >
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-blue-light disabled:opacity-60 shadow-sm"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {uploading ? "Mengunggah..." : "Unggah File"}
          </button>

          <button
            type="button"
            onClick={openMediaPicker}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            <FolderOpen className="h-3.5 w-3.5 text-brand" />
            Pilih dari Media
          </button>
        </div>

        <span className="text-xs text-neutral-500">{hint}</span>
      </div>

      {/* Modal Pemilih Media Library */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl overflow-hidden">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-brand" />
                <h3 className="font-bold text-neutral-900">Pilih dari Media Library</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Pencarian */}
            <div className="border-b border-neutral-200 px-5 py-2.5 bg-neutral-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cari nama file..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            {/* Grid Media */}
            <div className="flex-1 overflow-y-auto p-5">
              {loadingMedia ? (
                <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                  <Loader2 className="h-8 w-8 animate-spin text-brand mb-2" />
                  <p className="text-sm">Memuat daftar media...</p>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                  <FolderOpen className="h-10 w-10 text-neutral-300 mb-2" />
                  <p className="text-sm font-medium">Tidak ada file media yang ditemukan</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Unggah file baru menggunakan tombol Unggah File di atas.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {filteredMedia.map((item) => {
                    const isSelected = value === item.url;
                    const itemIsPdf =
                      item.type === "DOCUMENT" ||
                      item.url.toLowerCase().endsWith(".pdf");

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          update(item.url);
                          setShowMediaModal(false);
                          toast.success("Media dipilih");
                        }}
                        className={`group relative flex flex-col rounded-lg border text-left overflow-hidden transition-all ${
                          isSelected
                            ? "border-brand ring-2 ring-brand"
                            : "border-neutral-200 hover:border-brand hover:shadow-sm"
                        }`}
                      >
                        <div className="relative h-24 w-full bg-neutral-100 overflow-hidden">
                          {itemIsPdf ? (
                            <div className="flex h-full w-full items-center justify-center bg-red-50 text-red-500">
                              <FileText className="h-8 w-8" />
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.url}
                              alt={item.altText || item.fileName || "Media"}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                          )}

                          {isSelected && (
                            <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white shadow">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="truncate text-[11px] font-medium text-neutral-800">
                            {item.fileName || item.altText || "Media"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-end border-t border-neutral-200 bg-neutral-50 px-5 py-3">
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="rounded-md border border-neutral-300 bg-white px-4 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
