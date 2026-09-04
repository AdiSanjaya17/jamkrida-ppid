import { redirect } from "next/navigation";

// /admin tidak punya halaman sendiri — arahkan ke dashboard CMS.
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}