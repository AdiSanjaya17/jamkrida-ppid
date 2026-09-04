"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save, Trash2, Loader2, Plus, Sparkles, RefreshCw } from "lucide-react";
import { saveSiteSetting, deleteSiteSetting } from "@/lib/actions/settings";
import { syncRealJamkridaData } from "@/lib/actions/seed-data";

export type SettingRow = { key: string; value: string };

// Pengaturan yang dikenal footer
const knownSettings: { key: string; label: string; textarea?: boolean }[] = [
  { key: "company_description", label: "Deskripsi Perusahaan", textarea: true },
  { key: "address", label: "Alamat" },
  { key: "phone", label: "Telepon" },
  { key: "email", label: "Email" },
  { key: "facebook_url", label: "URL Facebook" },
  { key: "instagram_url", label: "URL Instagram" },
  { key: "youtube_url", label: "URL YouTube" },
  { key: "logo_url", label: "URL Logo" },
];

export function SettingsManager({ settings }: { settings: SettingRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [customKey, setCustomKey] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const map = new Map(settings.map((s) => [s.key, s.value]));
  const customKeys = settings
    .map((s) => s.key)
    .filter((k) => !knownSettings.some((known) => known.key === k));

  const handleSyncRealData = async () => {
    if (!confirm("Muat dan sinkronkan data objek penting dari website PPID Jamkrida Bali?")) return;
    setIsSyncing(true);
    try {
      const res = await syncRealJamkridaData();
      toast.success(res.message || "Data PPID berhasil disinkronisasi!");
      window.location.reload();
    } catch {
      toast.error("Gagal melakukan sinkronisasi data");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = (key: string, formData: FormData) => {
    const value = (formData.get("value") as string) ?? "";
    startTransition(async () => {
      try {
        await saveSiteSetting(key, value);
        toast.success(`"${key}" disimpan`);
      } catch {
        toast.error("Gagal menyimpan pengaturan");
      }
    });
  };

  const handleDelete = (key: string) => {
    if (!confirm(`Hapus pengaturan "${key}"?`)) return;
    startTransition(() => {
      deleteSiteSetting(key)
        .then(() => toast.success("Pengaturan dihapus"))
        .catch(() => toast.error("Gagal menghapus"));
    });
  };

  const handleAddCustom = () => {
    const key = customKey.trim();
    if (!key) {
      toast.error("Isi nama pengaturan");
      return;
    }
    startTransition(async () => {
      await saveSiteSetting(key, "");
      setCustomKey("");
      toast.success(`Pengaturan "${key}" ditambahkan`);
    });
  };

  const inputClass =
    "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Pengaturan Situs</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Nilai di sini otomatis dipakai oleh footer dan komponen situs publik.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSyncRealData}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-light disabled:opacity-60 shadow-sm"
        >
          {isSyncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isSyncing ? "Menyinkronkan..." : "Sinkronkan Data Awal PPID"}
        </button>
      </div>

      <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
        {knownSettings.map(({ key, label, textarea }) => (
          <form
            key={key}
            action={(formData) => handleSave(key, formData)}
            className="flex flex-wrap items-end gap-3"
          >
            <div className="min-w-56 flex-1">
              <label className="mb-1.5 block text-sm font-medium">{label}</label>
              {textarea ? (
                <textarea name="value" rows={2} defaultValue={map.get(key) ?? ""} className={inputClass} />
              ) : (
                <input name="value" defaultValue={map.get(key) ?? ""} className={inputClass} />
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-md border border-brand px-3.5 py-2 text-sm font-semibold text-brand hover:bg-brand/5 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan
            </button>
          </form>
        ))}
      </div>

      {customKeys.length > 0 && (
        <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="font-semibold text-neutral-900">Pengaturan Kustom</h2>
          {customKeys.map((key) => (
            <form
              key={key}
              action={(formData) => handleSave(key, formData)}
              className="flex flex-wrap items-end gap-3"
            >
              <div className="min-w-56 flex-1">
                <label className="mb-1.5 block text-sm font-medium">
                  <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">{key}</code>
                </label>
                <input name="value" defaultValue={map.get(key) ?? ""} className={inputClass} />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-md border border-brand px-3.5 py-2 text-sm font-semibold text-brand hover:bg-brand/5 disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Simpan
              </button>
              <button
                type="button"
                onClick={() => handleDelete(key)}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3.5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" /> Hapus
              </button>
            </form>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-5">
        <div className="min-w-56 flex-1">
          <label className="mb-1.5 block text-sm font-medium">Tambah Pengaturan Baru</label>
          <input
            value={customKey}
            onChange={(e) => setCustomKey(e.target.value)}
            placeholder="mis. whatsapp_number"
            className={inputClass}
          />
        </div>
        <button
          onClick={handleAddCustom}
          disabled={isPending || !customKey.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-light disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>
    </div>
  );
}

