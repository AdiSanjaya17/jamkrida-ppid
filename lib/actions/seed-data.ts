"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { populateRealJamkridaData } from "@/lib/seed/real-data";

/**
 * Server action CMS: sinkronisasi data riil PPID (dipanggil dari
 * halaman Settings). WAJIB lewat requireAdmin — tidak ada jalur bypass.
 */
export async function syncRealJamkridaData() {
  await requireAdmin();
  return populateRealJamkridaData();
}
