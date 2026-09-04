"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Loader2,
  ImageIcon,
} from "lucide-react";
import {
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  moveHeroSlide,
} from "@/lib/actions/homepage";
import { UploadField } from "@/components/admin/upload-field";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  backgroundUrl: string;
  overlayColor: string | null;
  overlayOpacity: number;
  ctaLabel: string | null;
  ctaUrl: string | null;
  ctaLabelSecondary: string | null;
  ctaUrlSecondary: string | null;
  order: number;
  isActive: boolean;
};

type EditorState =
  | { mode: "create" }
  | { mode: "edit"; slide: HeroSlide }
  | null;

export function HeroSlideManager({ slides }: { slides: HeroSlide[] }) {
  const [editor, setEditor] = useState<EditorState>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    const input = {
      title: (formData.get("title") as string)?.trim(),
      subtitle: (formData.get("subtitle") as string) || null,
      description: (formData.get("description") as string) || null,
      backgroundUrl: (formData.get("backgroundUrl") as string)?.trim(),
      overlayColor: (formData.get("overlayColor") as string) || null,
      overlayOpacity: Number(formData.get("overlayOpacity") ?? 50) / 100,
      ctaLabel: (formData.get("ctaLabel") as string) || null,
      ctaUrl: (formData.get("ctaUrl") as string) || null,
      ctaLabelSecondary: (formData.get("ctaLabelSecondary") as string) || null,
      ctaUrlSecondary: (formData.get("ctaUrlSecondary") as string) || null,
      isActive: formData.get("isActive") === "on",
    };

    if (!input.title) {
      toast.error("Judul slide wajib diisi");
      return;
    }

    startTransition(async () => {
      try {
        if (editor?.mode === "edit") {
          await updateHeroSlide(editor.slide.id, input);
          toast.success("Slide diperbarui");
        } else {
          await createHeroSlide(input);
          toast.success("Slide ditambahkan");
        }
        setEditor(null);
      } catch {
        toast.error("Gagal menyimpan slide");
      }
    });
  };

  const handleDelete = (slide: HeroSlide) => {
    if (!confirm(`Hapus slide "${slide.title}"?`)) return;
    startTransition(() => {
      deleteHeroSlide(slide.id)
        .then(() => toast.success("Slide dihapus"))
        .catch(() => toast.error("Gagal menghapus slide"));
    });
  };

    return (
    <section className="rounded-lg border border-neutral-200 bg-white">
      <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
        <div>
          <h2 className="font-semibold text-neutral-900">Hero Carousel</h2>
          <p className="text-xs text-neutral-500">
            {slides.filter((s) => s.isActive).length} dari {slides.length} slide aktif
          </p>
        </div>
        <button
          onClick={() => setEditor({ mode: "create" })}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-blue-light"
        >
          <Plus className="h-4 w-4" /> Slide
        </button>
      </header>

      {editor && (
        <HeroSlideForm
          key={editor.mode + ((editor.mode === "edit" && editor.slide.id) || "new")}
          slide={editor.mode === "edit" ? editor.slide : undefined}
          isPending={isPending}
          onCancel={() => setEditor(null)}
          onSubmit={handleSubmit}
        />
      )}

      {slides.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-neutral-500">
          Belum ada slide. Tambahkan slide pertama untuk hero beranda.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {slides.map((slide, index) => (
            <li key={slide.id} className="flex items-center gap-4 px-5 py-3">
              <div className="flex h-12 w-20 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                {slide.backgroundUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.backgroundUrl}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-brand-blue-dark via-brand to-brand-green-dark" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-medium ${
                    slide.isActive
                      ? "text-neutral-900"
                      : "text-neutral-400 line-through"
                  }`}
                >
                  {slide.title}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {slide.subtitle ?? "—"}
                  {slide.ctaLabel && (
                    <span className="ml-2 rounded bg-brand/5 px-1.5 py-0.5 text-[11px] font-medium text-brand">
                      CTA: {slide.ctaLabel}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startTransition(() => moveHeroSlide(slide.id, "up"))}
                  disabled={isPending || index === 0}
                  title="Naikkan"
                  className="rounded p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => startTransition(() => moveHeroSlide(slide.id, "down"))}
                  disabled={isPending || index === slides.length - 1}
                  title="Turunkan"
                  className="rounded p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      try {
                        await updateHeroSlide(slide.id, {
                          title: slide.title,
                          subtitle: slide.subtitle,
                          description: slide.description,
                          backgroundUrl: slide.backgroundUrl,
                          overlayColor: slide.overlayColor,
                          overlayOpacity: slide.overlayOpacity,
                          ctaLabel: slide.ctaLabel,
                          ctaUrl: slide.ctaUrl,
                          ctaLabelSecondary: slide.ctaLabelSecondary,
                          ctaUrlSecondary: slide.ctaUrlSecondary,
                          isActive: !slide.isActive,
                        });
                      } catch {
                        toast.error("Gagal mengubah status slide");
                      }
                    })
                  }
                  disabled={isPending}
                  title={slide.isActive ? "Sembunyikan" : "Tampilkan"}
                  className="rounded p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
                >
                  {slide.isActive ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setEditor({ mode: "edit", slide })}
                  disabled={isPending}
                  title="Edit"
                  className="rounded p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(slide)}
                  disabled={isPending}
                  title="Hapus"
                  className="rounded p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function HeroSlideForm({
  slide,
  isPending,
  onSubmit,
  onCancel,
}: {
  slide?: HeroSlide;
  isPending: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}) {
  const inputClass =
    "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand";
  return (
    <form
      action={onSubmit}
      className="space-y-4 border-b border-neutral-200 bg-neutral-50/60 p-5"
    >
      <h3 className="font-semibold text-neutral-900">
        {slide ? `Edit Slide: ${slide.title}` : "Slide Baru"}
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Judul <span className="text-red-500">*</span>
          </label>
          <input name="title" required defaultValue={slide?.title} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Subjudul</label>
          <input name="subtitle" defaultValue={slide?.subtitle ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Deskripsi</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={slide?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Gambar Background
        </label>
        <UploadField
          name="backgroundUrl"
          defaultValue={slide?.backgroundUrl ?? ""}
          hint="Unggah gambar, atau kosongkan untuk gradient brand"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Warna Overlay</label>
          <input
            name="overlayColor"
            type="color"
            defaultValue={slide?.overlayColor ?? "#003B8E"}
            className="h-10 w-full rounded-md border border-neutral-300"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Opasitas Overlay ({Math.round((slide?.overlayOpacity ?? 0.5) * 100)}%)
          </label>
          <input
            name="overlayOpacity"
            type="range"
            min={0}
            max={100}
            defaultValue={Math.round((slide?.overlayOpacity ?? 0.5) * 100)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Label CTA 1</label>
          <input name="ctaLabel" defaultValue={slide?.ctaLabel ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">URL CTA 1</label>
          <input name="ctaUrl" defaultValue={slide?.ctaUrl ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Label CTA 2</label>
          <input
            name="ctaLabelSecondary"
            defaultValue={slide?.ctaLabelSecondary ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">URL CTA 2</label>
          <input
            name="ctaUrlSecondary"
            defaultValue={slide?.ctaUrlSecondary ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={slide?.isActive ?? true}
          className="h-4 w-4 rounded border-neutral-300"
        />
        Aktif
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-light disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {slide ? "Simpan Perubahan" : "Tambah Slide"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}


