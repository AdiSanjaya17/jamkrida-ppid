"use client";

import Image from "next/image";

type Partner = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
};

/**
 * Komponen carousel mitra dengan animasi CSS murni (GPU-accelerated).
 * Ringan, mulus, tanpa spike CPU / layout reflow, dan otomatis jeda saat hover.
 */
export function AnimatedPartnersCarousel({ partners }: { partners: Partner[] }) {
  if (!partners || partners.length === 0) return null;

  // Duplikasi data untuk efek seamless infinite loop
  const displayPartners = [...partners, ...partners, ...partners];

  return (
    <div className="relative w-full overflow-hidden py-3">
      {/* Container Track Animasi */}
      <div className="flex w-max items-center gap-6 partners-marquee hover:[animation-play-state:paused]">
        {displayPartners.map((partner, idx) => (
          <div
            key={`${partner.id}-${idx}`}
            className="flex-shrink-0 w-44 h-24 flex items-center justify-center"
          >
            <a
              href={partner.websiteUrl || "#"}
              target={partner.websiteUrl ? "_blank" : undefined}
              rel={partner.websiteUrl ? "noopener noreferrer" : undefined}
              className="group relative h-full w-full flex items-center justify-center p-3 rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-brand transition-all duration-300"
              title={partner.name}
            >
              <div className="relative h-14 w-32 flex items-center justify-center">
                <Image
                  src={partner.logoUrl}
                  alt={partner.name}
                  fill
                  sizes="160px"
                  className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Efek Gradien Fade di Sisi Kiri & Kanan */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

      {/* CSS Animasi Ringan */}
      <style jsx global>{`
        @keyframes marquee-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
        .partners-marquee {
          animation: marquee-scroll 25s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
