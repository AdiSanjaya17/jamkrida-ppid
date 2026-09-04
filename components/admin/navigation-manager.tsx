"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  reorderNavigationItems,
} from "@/lib/actions/navigation";

export type NavItem = {
  id: string;
  title: string;
  slug: string | null;
  url: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
  parentId: string | null;
};

type FormState = {
  mode: "create" | "edit";
  parentId: string | null;
  item?: NavItem;
};

const ROOT = "root";

export function NavigationManager({ items }: { items: NavItem[] }) {
  const [localItems, setLocalItems] = useState<NavItem[]>(items);
  const [form, setForm] = useState<FormState | null>(null);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Kelompokkan item berdasarkan parent (ROOT = menu utama)
  const groups = useMemo(() => {
    const map = new Map<string, NavItem[]>();
    for (const item of localItems) {
      const key = item.parentId ?? ROOT;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    for (const list of map.values()) list.sort((a, b) => a.order - b.order);
    return map;
  }, [localItems]);

  const roots = groups.get(ROOT) ?? [];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeItem = localItems.find((i) => i.id === active.id);
    const overItem = localItems.find((i) => i.id === over.id);
    if (!activeItem || !overItem) return;

    const sourceKey = activeItem.parentId ?? ROOT;
    const targetKey = overItem.parentId ?? ROOT;
    const next = [...localItems];

    if (sourceKey === targetKey) {
      const list = groups.get(sourceKey) ?? [];
      const oldIndex = list.findIndex((i) => i.id === active.id);
      const newIndex = list.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(list, oldIndex, newIndex);

      reordered.forEach((item, index) => {
        const idx = next.findIndex((i) => i.id === item.id);
        next[idx] = { ...item, order: index };
      });

      setLocalItems(next);
      startTransition(() => {
        reorderNavigationItems(
          reordered.map((i) => i.id),
          sourceKey === ROOT ? null : sourceKey
        ).catch(() => toast.error("Gagal menyimpan urutan"));
      });
    } else {
      // Pindah antar level (jadi submenu, atau naik ke menu utama)
      const sourceList = groups.get(sourceKey) ?? [];
      const targetList = groups.get(targetKey) ?? [];

      const newSource = sourceList
        .filter((i) => i.id !== activeItem.id)
        .map((item, index) => ({ ...item, order: index }));
      const newTarget = [
        ...targetList,
        { ...activeItem, order: targetList.length },
      ];

      next.forEach((item) => {
        const idx = next.findIndex((i) => i.id === item.id);
        if (item.id === activeItem.id) {
          next[idx] = {
            ...item,
            parentId: targetKey === ROOT ? null : targetKey,
            order: targetList.length,
          };
        } else if ((item.parentId ?? ROOT) === sourceKey) {
          const updated = newSource.find((i) => i.id === item.id);
          if (updated) next[idx] = updated;
        } else if ((item.parentId ?? ROOT) === targetKey) {
          const updated = newTarget.find((i) => i.id === item.id);
          if (updated) next[idx] = updated;
        }
      });

      setLocalItems(next);
      startTransition(() => {
        Promise.all([
          reorderNavigationItems(
            newSource.map((i) => i.id),
            sourceKey === ROOT ? null : sourceKey
          ),
          reorderNavigationItems(
            newTarget.map((i) => i.id),
            targetKey === ROOT ? null : targetKey
          ),
        ]).catch(() => toast.error("Gagal memindahkan item"));
      });
    }
  };

    const handleDelete = (item: NavItem) => {
    const childCount = localItems.filter((i) => i.parentId === item.id).length;
    const message =
      childCount > 0
        ? `Hapus "${item.title}"? ${childCount} submenu di bawahnya juga akan terhapus.`
        : `Hapus "${item.title}"?`;
    if (!confirm(message)) return;

    startTransition(() => {
      deleteNavigationItem(item.id)
        .then(() => {
          setLocalItems((prev) =>
            prev.filter((i) => i.id !== item.id && i.parentId !== item.id)
          );
          toast.success("Item dihapus");
        })
        .catch(() => toast.error("Gagal menghapus item"));
    });
  };

  const handleToggleActive = (item: NavItem) => {
    startTransition(() => {
      updateNavigationItem(item.id, {
        title: item.title,
        url: item.url,
        slug: item.slug,
        icon: item.icon,
        isActive: !item.isActive,
      })
        .then(() => {
          setLocalItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, isActive: !i.isActive } : i
            )
          );
          toast.success(item.isActive ? "Item disembunyikan" : "Item ditampilkan");
        })
        .catch(() => toast.error("Gagal mengubah status"));
    });
  };

  const handleSubmit = (formData: FormData) => {
    const title = (formData.get("title") as string)?.trim();
    const url = (formData.get("url") as string) || null;
    const slug = (formData.get("slug") as string) || null;
    const icon = (formData.get("icon") as string) || null;
    const isActive = formData.get("isActive") === "on";

    if (!title) {
      toast.error("Judul wajib diisi");
      return;
    }

    startTransition(async () => {
      try {
        if (form.mode === "edit" && form.item) {
          await updateNavigationItem(form.item.id, {
            title, url, slug, icon, isActive,
          });
          toast.success("Item navigasi diperbarui");
        } else {
          await createNavigationItem({
            title, url, slug, icon, isActive,
            parentId: form.parentId ?? null,
          });
          toast.success("Item navigasi ditambahkan");
        }
        // revalidatePath pada server action memicu refresh RSC
        setForm(null);
      } catch {
        toast.error("Gagal menyimpan item navigasi");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">
            Manajemen Navigasi
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Tarik &amp; lepas untuk mengurutkan menu. Lepaskan item ke grup lain
            untuk menjadikannya submenu (atau sebaliknya).
          </p>
        </div>
        <button
          onClick={() => setForm({ mode: "create", parentId: null })}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-light"
        >
          <Plus className="h-4 w-4" /> Menu Utama
        </button>
      </div>

      {form && (
        <NavigationForm
          key={form.mode + (form.item?.id ?? form.parentId ?? "new")}
          form={form}
          isPending={isPending}
          onCancel={() => setForm(null)}
          onSubmit={handleSubmit}
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={roots.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {roots.map((item) => (
              <SortableRow
                key={item.id}
                item={item}
                containerId={ROOT}
                children_={groups.get(item.id) ?? []}
                groups={groups}
                isPending={isPending}
                onEdit={(i) =>
                  setForm({ mode: "edit", parentId: i.parentId, item: i })
                }
                onAddChild={(parentId) => setForm({ mode: "create", parentId })}
                onDelete={handleDelete}
                onToggle={handleToggleActive}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableRow({
  item,
  containerId,
  children_,
  groups,
  isPending,
  onEdit,
  onAddChild,
  onDelete,
  onToggle,
}: {
  item: NavItem;
  containerId: string;
  children_: NavItem[];
  groups: Map<string, NavItem[]>;
  isPending: boolean;
  onEdit: (item: NavItem) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (item: NavItem) => void;
  onToggle: (item: NavItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, data: { containerId } });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-lg border bg-white ${
        isDragging ? "border-brand opacity-80 shadow-lg" : "border-neutral-200"
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-neutral-400 hover:text-neutral-600 active:cursor-grabbing"
          aria-label="Tarik untuk mengurutkan"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {children_.length > 0 ? (
          <ChevronRight className="h-4 w-4 text-neutral-400" />
        ) : (
          <span className="h-4 w-4" />
        )}
        <span
          className={`font-medium ${
            item.isActive ? "text-neutral-900" : "text-neutral-400 line-through"
          }`}
        >
          {item.title}
        </span>
        {item.url && (
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
            {item.url}
          </code>
        )}
        <span className="ml-auto flex items-center gap-1">
          <button
            onClick={() => onToggle(item)}
            disabled={isPending}
            title={item.isActive ? "Sembunyikan" : "Tampilkan"}
            className="rounded p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
          >
            {item.isActive ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => onEdit(item)}
            disabled={isPending}
            title="Edit"
            className="rounded p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            disabled={isPending}
            title="Hapus"
            className="rounded p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onAddChild(item.id)}
            disabled={isPending}
            className="ml-1 inline-flex items-center gap-1 rounded-md border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" /> Submenu
          </button>
        </span>
      </div>

      {children_.length > 0 && (
        <div className="border-t border-neutral-100 bg-neutral-50/50 py-2 pl-10 pr-4">
          <SortableContext
            items={children_.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {children_.map((child) => (
                <SortableRow
                  key={child.id}
                  item={child}
                  containerId={item.id}
                  children_={groups.get(child.id) ?? []}
                  groups={groups}
                  isPending={isPending}
                  onEdit={onEdit}
                  onAddChild={onAddChild}
                  onDelete={onDelete}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      )}
    </div>
  );
}

function NavigationForm({
  form,
  isPending,
  onSubmit,
  onCancel,
}: {
  form: FormState;
  isPending: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}) {
  const item = form.item;
  return (
    <form
      action={onSubmit}
      className="space-y-4 rounded-lg border border-brand/30 bg-white p-5"
    >
      <h2 className="font-semibold text-neutral-900">
        {form.mode === "edit" ? `Edit: ${item?.title}` : "Tambah Item Navigasi"}
        {form.mode === "create" && form.parentId && (
          <span className="ml-2 text-sm font-normal text-neutral-500">
            (sebagai submenu)
          </span>
        )}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nav-title" className="mb-1.5 block text-sm font-medium">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="nav-title"
            name="title"
            required
            defaultValue={item?.title}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Beranda"
          />
        </div>
        <div>
          <label htmlFor="nav-url" className="mb-1.5 block text-sm font-medium">
            URL
          </label>
          <input
            id="nav-url"
            name="url"
            defaultValue={item?.url ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="/berita"
          />
        </div>
        <div>
          <label htmlFor="nav-slug" className="mb-1.5 block text-sm font-medium">
            Slug (opsional)
          </label>
          <input
            id="nav-slug"
            name="slug"
            defaultValue={item?.slug ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="berita-terbaru"
          />
        </div>
        <div>
          <label htmlFor="nav-icon" className="mb-1.5 block text-sm font-medium">
            Ikon (opsional)
          </label>
          <input
            id="nav-icon"
            name="icon"
            defaultValue={item?.icon ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="home"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={item?.isActive ?? true}
          className="h-4 w-4 rounded border-neutral-300"
        />
        Tampilkan di menu publik
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-light disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {form.mode === "edit" ? "Simpan Perubahan" : "Tambah"}
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



