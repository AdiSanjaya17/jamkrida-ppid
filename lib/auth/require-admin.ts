import { auth } from "@/lib/auth/auth";

/**
 * Guard wajib di awal setiap server action yang sensitif.
 * Middleware hanya melindungi rute halaman /admin/* — server actions
 * adalah endpoint publik, jadi WAJIB diverifikasi manual di sini.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Akses ditolak: sesi admin tidak ditemukan. Silakan login ulang.");
  }
  return session;
}