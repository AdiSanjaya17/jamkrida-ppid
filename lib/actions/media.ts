"use server";

import { prisma } from "@/lib/prisma/client";
import cloudinary, { isCloudinaryConfigured } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

const MAX_SIZE_MB = 10;

export type UploadResult =
  | { ok: true; id: string; url: string }
  | { ok: false; error: string };

export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  await requireAdmin();
  if (!isCloudinaryConfigured()) {
    return {
      ok: false,
      error:
        "Cloudinary belum dikonfigurasi. Isi CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET di file .env lalu restart server.",
    };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { ok: false, error: "Pilih file terlebih dahulu." };
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { ok: false, error: `Ukuran file maksimal ${MAX_SIZE_MB}MB.` };
  }
  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";
  if (!isImage && !isPdf) {
    return { ok: false, error: "Hanya file gambar (JPG/PNG/WebP/SVG) atau PDF yang didukung." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "ppid-jamkrida", resource_type: "auto" },
          (error, uploaded) => {
            if (error || !uploaded) reject(error ?? new Error("Upload gagal"));
            else resolve(uploaded);
          }
        );
        stream.end(buffer);
      }
    );

    const media = await prisma.media.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        type: isImage ? "IMAGE" : "DOCUMENT",
        altText: file.name,
        fileName: file.name,
        fileSizeKb: Math.round(file.size / 1024),
      },
    });

    revalidatePath("/admin/media");
    revalidatePath("/");
    return { ok: true, id: media.id, url: media.url };
  } catch {
    return { ok: false, error: "Upload ke Cloudinary gagal. Periksa kredensial .env." };
  }
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;

  // Hapus dari Cloudinary dulu (abaikan error jika asset sudah tidak ada)
  if (isCloudinaryConfigured()) {
    try {
      await cloudinary.uploader.destroy(media.publicId);
    } catch {
      // asset mungkin sudah terhapus manual di dashboard Cloudinary
    }
  }

  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
  revalidatePath("/");
}

export async function updateMediaAlt(id: string, altText: string) {
  await requireAdmin();
  await prisma.media.update({ where: { id }, data: { altText } });
  revalidatePath("/admin/media");
}

export async function addMediaFromUrl(
  url: string,
  fileName: string
): Promise<UploadResult> {
  await requireAdmin();
  if (!url || !url.trim()) {
    return { ok: false, error: "URL tidak boleh kosong" };
  }

  try {
    // Validate URL format
    new URL(url);

    const media = await prisma.media.create({
      data: {
        url: url.trim(),
        publicId: `external-${Date.now()}`, // Mark as external URL
        type: "IMAGE",
        altText: fileName,
        fileName: fileName || "Gambar dari URL",
        fileSizeKb: null,
      },
    });

    revalidatePath("/admin/media");
    revalidatePath("/");
    return { ok: true, id: media.id, url: media.url };
  } catch (error) {
    if (error instanceof Error && error.message.includes("Invalid URL")) {
      return { ok: false, error: "URL tidak valid. Gunakan format lengkap: https://..." };
    }
    return {
      ok: false,
      error: "Gagal menambahkan gambar dari URL. Pastikan URL valid dan accessible.",
    };
  }
}

export async function getMediaList() {
  await requireAdmin();
  try {
    return await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
    });
  } catch {
    return [];
  }
}

