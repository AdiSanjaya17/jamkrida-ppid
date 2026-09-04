import { prisma } from "@/lib/prisma/client";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { MediaLibrary, type MediaItem } from "@/components/admin/media-library";

export const metadata = { title: "Media Library" };

export default async function MediaAdminPage() {
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  const serialized: MediaItem[] = items.map((m) => ({
    id: m.id,
    url: m.url,
    altText: m.altText,
    fileName: m.fileName,
    fileSizeKb: m.fileSizeKb,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-4">
      {!isCloudinaryConfigured() && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ⚠️ Cloudinary belum dikonfigurasi. Isi{" "}
          <code className="rounded bg-amber-100 px-1">CLOUDINARY_CLOUD_NAME</code>,{" "}
          <code className="rounded bg-amber-100 px-1">CLOUDINARY_API_KEY</code>, dan{" "}
          <code className="rounded bg-amber-100 px-1">CLOUDINARY_API_SECRET</code>{" "}
          di file <code className="rounded bg-amber-100 px-1">.env</code> (dari
          dashboard cloudinary.com), lalu restart server.
        </div>
      )}
      <MediaLibrary items={serialized} />
    </div>
  );
}
