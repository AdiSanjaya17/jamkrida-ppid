"use client";

import Link from "next/link";
import { useTransition } from "react";
import { signOut } from "next-auth/react";
import { LogOut, UserRound } from "lucide-react";

export function AdminHeader({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(() => {
      signOut({ callbackUrl: "/admin/login" });
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <div className="text-sm text-neutral-500">
        Portal PPID — PT Jamkrida Bali Mandara (Perseroda)
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right leading-tight">
          <p className="text-sm font-semibold text-neutral-900">{userName}</p>
          <p className="text-xs text-neutral-500">{userEmail}</p>
        </div>
        <Link
          href="/admin/account"
          className="inline-flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          <UserRound className="h-4 w-4" />
          Akun
        </Link>
        <button
          onClick={handleSignOut}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {isPending ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </header>
  );
}