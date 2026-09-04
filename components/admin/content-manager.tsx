"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import {
  saveContentItem,
  deleteContentItem,
  type ContentModel,
} from "@/lib/actions/content";
import { UploadField } from "@/components/admin/upload-field";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "url"
  | "date"
  | "select"
  | "checkbox"
  | "upload";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
};

export type DisplayConfig = {
  titleKey: string;
  metaKeys: string[];
  badgeKey?: string;
  badgeLabels?: Record<string, { label: string; className: string }>;
};

type Row = Record<string, unknown> & { id: string };

export function ContentManager({
  model,
  title,
  items,
  fields,
  display,
}: {
  model: ContentModel;
  title: string;
  items: Row[];
  fields: FieldConfig[];
  display: DisplayConfig;
}) {
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    const id = editing && editing !== "new" ? editing.id : null;
    const data: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.type === "checkbox") {
        data[field.name] = formData.get(field.name) === "on";
      } else {
        data[field.name] = formData.get(field.name) ?? "";
      }
    }

    startTransition(async () => {
      try {
        await saveContentItem(model, id, data);
        toast.success(id ? "Perubahan disimpan" : `${title} ditambahkan`);
        setEditing(null);
      } catch (e) {
        toast.error(
          e instanceof Error && e.message.includes("Unique")
            ? "Slug sudah dipakai — gunakan yang lain"
            : "Gagal menyimpan data"
        );
      }
    });
  };

  const handleDelete = (row: Row) => {
    const label = String(row[display.titleKey] ?? "item ini");
    if (!confirm(`Hapus "${label}"?`)) return;
    startTransition(() => {
      deleteContentItem(model, row.id)
        .then(() => toast.success("Data dihapus"))
        .catch(() => toast.error("Gagal menghapus data"));
    });
  };

  const inputClass =
    "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-brand-dark">{title}</h1>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-light"
        >
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>

      {editing && (
        <form
          key={editing === "new" ? "new" : editing.id}
          action={handleSubmit}
          className="grid grid-cols-1 gap-4 rounded-lg border border-brand/30 bg-white p-5 sm:grid-cols-2"
        >
          <h2 className="font-semibold text-neutral-900 sm:col-span-2">
            {editing === "new" ? `Tambah ${title}` : "Edit Data"}
          </h2>
          {fields.map((field) => {
            const value = editing !== "new" ? editing[field.name] : undefined;
            const isFull = field.type === "textarea";
            return (
              <div key={field.name} className={isFull ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    rows={4}
                    required={field.required}
                    defaultValue={(value as string) ?? ""}
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    required={field.required}
                    defaultValue={(value as string) ?? field.options?.[0]?.value}
                    className={inputClass}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "upload" ? (
                  <UploadField
                    name={field.name}
                    defaultValue={(value as string) ?? ""}
                    accept={field.name === "fileUrl" ? "image/*,application/pdf" : "image/*"}
                    hint="Unggah file atau tempel URL"
                  />
                ) : field.type === "checkbox" ? (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name={field.name}
                      defaultChecked={value === undefined ? true : Boolean(value)}
                      className="h-4 w-4 rounded border-neutral-300"
                    />
                    Aktif
                  </label>
                ) : (
                  <input
                    name={field.name}
                    type={
                      field.type === "number"
                        ? "number"
                        : field.type === "date"
                          ? "date"
                          : field.type === "url"
                            ? "url"
                            : "text"
                    }
                    required={field.required}
                    defaultValue={(value as string | number | undefined) ?? ""}
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                )}
              </div>
            );
          })}
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-light disabled:opacity-60"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="rounded-lg border border-neutral-200 bg-white">
        {items.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-neutral-500">
            Belum ada data. Klik <strong>Tambah</strong> untuk membuat yang pertama.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {items.map((row) => {
              const badgeValue = display.badgeKey
                ? String(row[display.badgeKey] ?? "")
                : null;
              const badge = badgeValue
                ? display.badgeLabels?.[badgeValue]
                : undefined;
              return (
                <li key={row.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {String(row[display.titleKey] ?? "-")}
                      </p>
                      {badge && (
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-neutral-500">
                      {display.metaKeys
                        .map((k) => {
                          const v = row[k];
                          if (v === null || v === undefined || v === "") return null;
                          return String(v);
                        })
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditing(row)}
                    disabled={isPending}
                    title="Edit"
                    className="rounded p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(row)}
                    disabled={isPending}
                    title="Hapus"
                    className="rounded p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

