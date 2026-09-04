"use client";

import { useState } from "react";
import { updateHomepageSection } from "@/lib/actions/homepage";
import { toast } from "sonner";
import type { SectionData } from "@/lib/section-content";

export type SectionRow = {
  id: string;
  key: string;
  label: string;
  isActive: boolean;
  content: SectionData;
};

export function SectionManager({ sections }: { sections: SectionRow[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggle = async (id: string, isActive: boolean) => {
    setLoading(id);
    try {
      await updateHomepageSection(id, { isActive: !isActive });
      toast.success("Seksi diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui seksi");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-neutral-900">Seksi Homepage</h2>
        <p className="text-sm text-neutral-600 mt-1">
          Aktifkan/nonaktifkan seksi yang ditampilkan di halaman beranda
        </p>
      </div>

      <div className="grid gap-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 bg-white"
          >
            <div className="flex-1">
              <p className="font-medium text-neutral-900">{section.label}</p>
              <p className="text-sm text-neutral-500">Key: {section.key}</p>
            </div>
            <button
              onClick={() => handleToggle(section.id, section.isActive)}
              disabled={loading === section.id}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                section.isActive
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              } disabled:opacity-50`}
            >
              {section.isActive ? "Aktif" : "Nonaktif"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
