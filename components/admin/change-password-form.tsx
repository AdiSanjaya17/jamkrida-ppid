"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";
import { changePassword } from "@/lib/actions/account";

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = (formData: FormData) => {
    const currentPassword = (formData.get("currentPassword") as string) ?? "";
    const newPassword = (formData.get("newPassword") as string) ?? "";
    const confirmPassword = (formData.get("confirmPassword") as string) ?? "";

    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok");
      return;
    }

    startTransition(async () => {
      const result = await changePassword(currentPassword, newPassword);
      if (result.ok) {
        toast.success("Kata sandi berhasil diganti 🎉");
        setFormKey((k) => k + 1); // reset form
      } else {
        toast.error(result.error ?? "Gagal mengganti kata sandi");
      }
    });
  };

  const inputClass =
    "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <form
      key={formKey}
      action={handleSubmit}
      className="max-w-md space-y-4 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Kata Sandi Saat Ini <span className="text-red-500">*</span>
        </label>
        <input name="currentPassword" type="password" required autoComplete="current-password" className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Kata Sandi Baru <span className="text-red-500">*</span>
        </label>
        <input
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-neutral-500">Minimal 8 karakter.</p>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
        </label>
        <input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-light disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
        Ganti Kata Sandi
      </button>
    </form>
  );
}
