"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/lib/auth/actions";
import { Eye, EyeOff } from "lucide-react";

type LoginState = { error?: string } | undefined;

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-lg bg-brand items-center justify-center text-white font-bold mb-4">
            PPID
          </div>
          <h1 className="text-xl font-bold text-brand-dark">Masuk ke CMS</h1>
          <p className="text-sm text-neutral-600 mt-1">
            PT Jamkrida Bali Mandara (Perseroda)
          </p>
        </div>

        <form action={formAction} className="space-y-4 bg-white p-6 rounded-lg border border-neutral-200">
          <input type="hidden" name="callbackUrl" value={searchParams?.callbackUrl ?? "/admin/dashboard"} />

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="admin@jamkridabali.co.id"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {state?.error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand text-white font-semibold py-2.5 rounded-md hover:bg-brand-blue-light transition-colors disabled:opacity-60"
          >
            {isPending ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
