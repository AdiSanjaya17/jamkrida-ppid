import { auth } from "@/lib/auth/auth";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export const metadata = { title: "Akun" };

export default async function AccountPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Akun Saya</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Kelola kredensial akun admin Anda.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-5">
        <p className="text-sm text-neutral-600">
          Login sebagai{" "}
          <span className="font-semibold text-neutral-900">
            {session?.user?.name}
          </span>{" "}
          (<span className="text-brand">{session?.user?.email}</span>)
        </p>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-neutral-900">Ganti Kata Sandi</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
