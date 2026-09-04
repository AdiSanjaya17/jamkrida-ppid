"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Search, ArrowUp } from "lucide-react";

export type PublicNavItem = {
  id: string;
  title: string;
  url: string | null;
  children: { id: string; title: string; url: string | null }[];
};

export function SiteHeader({
  navItems,
  overlay = false,
}: {
  navItems: PublicNavItem[];
  overlay?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navbar berubah dari transparent ke solid saat scroll
  const navbarStyle = isScrolled
    ? "sticky top-0 border-b border-neutral-200 bg-white/95 backdrop-blur"
    : overlay
      ? "absolute inset-x-0 top-0 bg-transparent"
      : "sticky top-0 border-b border-neutral-200 bg-white/95 backdrop-blur";

  // Warna teks: putih saat transparent di atas, netral saat scroll/solid
  const linkColor = isScrolled || !overlay
    ? "text-neutral-700 hover:bg-neutral-100 hover:text-brand"
    : "text-white/90 hover:bg-white/10 hover:text-white";
  
  const textColor = isScrolled || !overlay ? "text-brand-dark" : "text-white";
  const logoColor = isScrolled || !overlay 
    ? "bg-brand text-white" 
    : "bg-brand-gold text-brand-dark";

  return (
    <>
      <header className={`z-50 w-full ${navbarStyle}`}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${logoColor}`}>
              PPID
            </div>
            <div className="leading-tight">
              <p className={`text-base font-bold ${textColor}`}>
                PT Jamkrida Bali Mandara
              </p>
              {!isScrolled && overlay && (
                <p className="text-[11px] text-white/70">
                  Portal PPID — Informasi Publik
                </p>
              )}
              {isScrolled && (
                <p className="text-[11px] text-neutral-500">
                  Portal PPID — Informasi Publik
                </p>
              )}
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) =>
              item.children.length > 0 ? (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold ${linkColor}`}
                  >
                    {item.title}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  {openDropdown === item.id && (
                    <div className="absolute left-0 top-full w-56 rounded-lg border border-neutral-200 bg-white py-2 shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url ?? "#"}
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-brand"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={item.url ?? "#"}
                  className={`rounded-md px-3 py-2 text-sm font-semibold ${linkColor}`}
                >
                  {item.title}
                </Link>
              )
            )}
            <button
              aria-label="Cari"
              className={`ml-2 rounded-full p-2.5 ${
                isScrolled || !overlay
                  ? "text-neutral-600 hover:bg-neutral-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <Link
              href="/permohonan-informasi"
              className="ml-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-bold text-brand-dark shadow-sm transition hover:bg-brand-gold-light"
            >
              Permohonan Informasi
            </Link>
          </nav>

          <button
            className={`rounded-md p-2 lg:hidden ${
              isScrolled || !overlay
                ? "text-neutral-700 hover:bg-neutral-100"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Buka menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="border-t border-neutral-200 bg-white px-4 py-3 lg:hidden">
            {navItems.map((item) => (
              <div key={item.id} className="py-1">
                <Link
                  href={item.url ?? "#"}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.title}
                </Link>
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    href={child.url ?? "#"}
                    className="block rounded-md px-6 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              href="/permohonan-informasi"
              className="mt-2 block rounded-md bg-brand-gold px-4 py-2.5 text-center text-sm font-bold text-brand-dark"
              onClick={() => setMobileOpen(false)}
            >
              Permohonan Informasi
            </Link>
          </nav>
        )}
      </header>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#003B8E] text-white shadow-lg transition-all hover:bg-[#0057D2] hover:shadow-xl"
          aria-label="Scroll ke atas"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
