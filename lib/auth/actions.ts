"use server";

import { signIn } from "@/lib/auth/auth";
import { AuthError } from "next-auth";

// --- Rate limiting sederhana (in-memory, per email) ---
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit
const attempts = new Map<string, { count: number; first: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

// Bersihkan entri kadaluarsa agar map tidak tumbuh tanpa batas
function cleanupAttempts() {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (now - entry.first > WINDOW_MS) attempts.delete(key);
  }
}

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase() || "";
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/admin/dashboard";

  if (email && isRateLimited(email)) {
    return {
      error: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit.",
    };
  }
  if (attempts.size > 1000) cleanupAttempts();

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email atau kata sandi salah." };
    }
    // NEXT_REDIRECT dilempar oleh signIn saat sukses — biarkan lewat
    throw error;
  }
}
