import type { ReactNode } from "react";

// Template re-mount otomatis setiap pindah halaman → animasi fade-slide ringan
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
