// Layout passthrough untuk seluruh /admin.
// Auth-check ada di app/admin/(dashboard)/layout.tsx (area CMS)
// agar /admin/login tidak ikut ter-redirect (menghindari infinite loop).
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
