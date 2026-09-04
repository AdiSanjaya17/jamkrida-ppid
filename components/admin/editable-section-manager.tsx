"use client";

import { useState } from "react";
import { updateHomepageSection } from "@/lib/actions/homepage";
import { toast } from "sonner";
import { Plus, X, Edit2 } from "lucide-react";
import Image from "next/image";

export type SectionRow = {
  id: string;
  key: string;
  label: string;
  isActive: boolean;
  content: Record<string, any>;
};

export function EditableSectionManager({ sections }: { sections: SectionRow[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [sectionData, setSectionData] = useState<Record<string, Record<string, any>>>({});

  const handleEditSection = (section: SectionRow) => {
    setEditing(section.id);
    setSectionData({
      ...sectionData,
      [section.id]: { ...section.content },
    });
  };

  const handleSaveSection = async (sectionId: string, key: string) => {
    setLoading(sectionId);
    try {
      const data = sectionData[sectionId];
      await updateHomepageSection(sectionId, {
        content: JSON.stringify(data),
        isActive: true,
      });
      toast.success("Seksi diperbarui");
      setEditing(null);
    } catch (error) {
      toast.error("Gagal memperbarui seksi");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const updateFieldValue = (sectionId: string, field: string, value: any) => {
    setSectionData({
      ...sectionData,
      [sectionId]: {
        ...sectionData[sectionId],
        [field]: value,
      },
    });
  };

  const addArrayItem = (sectionId: string, arrayName: string) => {
    const data = sectionData[sectionId];
    const arr = Array.isArray(data[arrayName]) ? data[arrayName] : [];
    updateFieldValue(sectionId, arrayName, [
      ...arr,
      { title: "", description: "", image: "" },
    ]);
  };

  const removeArrayItem = (sectionId: string, arrayName: string, index: number) => {
    const data = sectionData[sectionId];
    const arr = Array.isArray(data[arrayName]) ? data[arrayName] : [];
    updateFieldValue(
      sectionId,
      arrayName,
      arr.filter((_, i) => i !== index)
    );
  };

  const updateArrayItemField = (
    sectionId: string,
    arrayName: string,
    index: number,
    field: string,
    value: any
  ) => {
    const data = sectionData[sectionId];
    const arr = Array.isArray(data[arrayName]) ? [...data[arrayName]] : [];
    arr[index] = { ...arr[index], [field]: value };
    updateFieldValue(sectionId, arrayName, arr);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-neutral-900">Seksi Homepage</h2>
        <p className="text-sm text-neutral-600 mt-1">
          Edit langsung konten seksi dengan upload gambar dan text items
        </p>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => {
          const isEditing = editing === section.id;
          const data = sectionData[section.id] || section.content;

          return (
            <div
              key={section.id}
              className="rounded-lg border border-neutral-200 p-6 bg-white"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-neutral-900">{section.label}</h3>
                  <p className="text-xs text-neutral-500">Key: {section.key}</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => handleEditSection(section)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 text-sm font-medium text-neutral-700"
                  >
                    <Edit2 className="h-4 w-4" /> Edit
                  </button>
                )}
              </div>

              {isEditing && (
                <div className="space-y-4">
                  {/* Text Fields */}
                  {["kicker", "heading", "heading1", "heading2", "description", "paragraph"].map(
                    (field) => {
                      if (!(field in data)) return null;
                      return (
                        <div key={field}>
                          <label className="block text-sm font-medium text-neutral-900 mb-1">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          {typeof data[field] === "string" && data[field].length < 100 ? (
                            <input
                              type="text"
                              value={data[field]}
                              onChange={(e) =>
                                updateFieldValue(section.id, field, e.target.value)
                              }
                              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                            />
                          ) : (
                            <textarea
                              value={data[field]}
                              onChange={(e) =>
                                updateFieldValue(section.id, field, e.target.value)
                              }
                              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                              rows={3}
                            />
                          )}
                        </div>
                      );
                    }
                  )}

                  {/* Array Fields (cards, categories, etc) */}
                  {["cats", "cards", "schedules", "petugas"].map((arrayName) => {
                    if (!Array.isArray(data[arrayName])) return null;
                    return (
                      <div key={arrayName} className="border-t border-neutral-200 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-neutral-900">
                            {arrayName.charAt(0).toUpperCase() + arrayName.slice(1)}
                          </h4>
                          <button
                            onClick={() => addArrayItem(section.id, arrayName)}
                            className="text-sm px-2 py-1 bg-brand text-white rounded hover:bg-brand-blue-light"
                          >
                            + Tambah
                          </button>
                        </div>

                        <div className="space-y-3">
                          {data[arrayName].map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-3 bg-neutral-50 rounded-md border border-neutral-200 space-y-2"
                            >
                              {Object.entries(item).map(([key, val]) => (
                                <div key={key}>
                                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                                    {key}
                                  </label>
                                  {key.includes("url") || key.includes("image") ? (
                                    <input
                                      type="url"
                                      value={val as string}
                                      onChange={(e) =>
                                        updateArrayItemField(
                                          section.id,
                                          arrayName,
                                          idx,
                                          key,
                                          e.target.value
                                        )
                                      }
                                      className="w-full rounded-md border border-neutral-300 px-2 py-1 text-xs"
                                      placeholder="https://..."
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={val as string}
                                      onChange={(e) =>
                                        updateArrayItemField(
                                          section.id,
                                          arrayName,
                                          idx,
                                          key,
                                          e.target.value
                                        )
                                      }
                                      className="w-full rounded-md border border-neutral-300 px-2 py-1 text-xs"
                                    />
                                  )}
                                  {key.includes("url") ||
                                    (key.includes("image") && val && (
                                      <div className="mt-2 relative h-20 w-full">
                                        <Image
                                          src={val as string}
                                          alt="Preview"
                                          fill
                                          className="object-cover rounded-md"
                                        />
                                      </div>
                                    ))}
                                </div>
                              ))}
                              <button
                                onClick={() => removeArrayItem(section.id, arrayName, idx)}
                                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                              >
                                <X className="h-3 w-3 inline" /> Hapus
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Save/Cancel Buttons */}
                  <div className="flex gap-2 justify-end border-t border-neutral-200 pt-4">
                    <button
                      onClick={() => setEditing(null)}
                      className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleSaveSection(section.id, section.key)}
                      disabled={loading === section.id}
                      className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue-light disabled:opacity-50"
                    >
                      {loading === section.id ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>
                </div>
              )}

              {!isEditing && (
                <div className="text-xs text-neutral-500 space-y-1">
                  <p>Status: {section.isActive ? "✅ Aktif" : "❌ Nonaktif"}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
