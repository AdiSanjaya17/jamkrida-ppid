"use client";

import { useState } from "react";
import { saveContentItem } from "@/lib/actions/content";
import { toast } from "sonner";
import { Plus, X, Upload } from "lucide-react";
import Image from "next/image";

export function EnhancedPartnersManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload");
  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
  });
  const [preview, setPreview] = useState("");

  const handleUploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setForm({ ...form, logoUrl: url });
        setPreview(url);
      };
      reader.readAsDataURL(file);
    }
  };

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
      setPreview("");
      setIsOpen(false);
    } catch (error) {
      toast.error("Gagal menyimpan mitra");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-neutral-900">Mitra Kami</h2>
        <p className="text-sm text-neutral-600 mt-1">
          Kelola logo mitra dengan animasi gerak pelan (auto-scroll carousel)
        </p>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue-light"
      >
        <Plus className="h-4 w-4" /> Tambah Mitra
      </button>

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-neutral-200 p-6 bg-white space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Nama Mitra *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              placeholder="PT/Organisasi"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Logo Mitra (persegi/kotak) *
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
                onChange={handleUploadLogo}
                className="block"
              />
            )}

            {uploadMode === "url" && (
              <input
                type="url"
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                placeholder="https://..."
              />
            )}

            {(preview || form.logoUrl) && (
              <div className="mt-3 p-4 bg-neutral-50 rounded-md flex items-center justify-center h-32">
                <div className="relative h-full w-auto">
                  <Image
                    src={preview || form.logoUrl}
                    alt="Logo Preview"
                    height={128}
                    width={128}
                    className="h-full w-auto object-contain"
                  />
                </div>
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
                setPreview("");
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
        💡 Logo mitra akan ditampilkan dalam carousel dengan animasi gerak pelan (auto-scroll)
      </p>
    </div>
  );
}
