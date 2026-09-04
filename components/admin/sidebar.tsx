"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Navigation,
  LayoutTemplate,
  Newspaper,
  FileText,
  Info,
  Wrench,
  BarChart3,
  Handshake,
  Image,
  Settings,
  ExternalLink,
} from "lucide-react";

const navGroups = [
  {
    label: "Utama",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/navigation", label: "Navigasi", icon: Navigation },
      { href: "/admin/homepage", label: "Homepage", icon: LayoutTemplate },
    ],
  },
  {
    label: "Konten",
    items: [
      { href: "/admin/news", label: "Berita & Pengumuman", icon: Newspaper },
      { href: "/admin/documents", label: "Dokumen & Laporan", icon: FileText },
      {
        href: "/admin/public-information",
        label: "Informasi Publik",
        icon: Info,
      },
      { href: "/admin/pages", label: "Halaman Statis", icon: FileText },
    ],
  },
  {
    label: "Lainnya",
    items: [
      { href: "/admin/services", label: "Layanan", icon: Wrench },
      { href: "/admin/statistics", label: "Statistik", icon: BarChart3 },
      { href: "/admin/partners", label: "Mitra", icon: Handshake },
      { href: "/admin/media", label: "Media Library", icon: Image },
      { href: "/admin/settings", label: "Pengaturan", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-brand text-white lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm font-bold">
          PPID
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">CMS PPID</p>
          <p className="text-xs text-white/60">Jamkrida Bali</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-white/15 font-semibold text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          Lihat Situs Publik
        </a>
      </div>
    </aside>
  );
}