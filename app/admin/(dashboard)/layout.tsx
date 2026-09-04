import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Lapisan kedua (defense in depth) — middleware sudah menangani di edge.
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader
          userName={session.user?.name ?? "Admin"}
          userEmail={session.user?.email ?? ""}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}