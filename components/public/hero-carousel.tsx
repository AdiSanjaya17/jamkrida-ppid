"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/components/admin/hero-slide-manager";

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const go = (dir: number) =>
    setIndex((i) => (i + dir + slides.length) % slides.length);
  const current = slides[index];

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden bg-black">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {slide.backgroundUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.backgroundUrl}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-neutral-900 via-brand-blue-dark to-brand" />
          )}
          {/* overlay gelap ala situs lama */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Konten kiri */}
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="max-w-2xl text-white">
            {current.subtitle && (
              <p className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">
                <span className="h-0.5 w-8 bg-brand-gold" />
                {current.subtitle}
              </p>
            )}
            <h1 className="text-4xl font-extrabold leading-[1.1] drop-shadow-lg lg:text-6xl">
              {current.title}
            </h1>
            {current.description && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 lg:text-lg">
                {current.description}
              </p>
            )}
            {(current.ctaLabel || current.ctaLabelSecondary) && (
              <div className="mt-8 flex flex-wrap gap-4">
                {current.ctaLabel && (
                  <Link
                    href={current.ctaUrl ?? "#"}
                    className="rounded-md bg-brand-gold px-7 py-3.5 text-sm font-bold text-neutral-900 shadow-lg shadow-brand-gold/20 transition hover:bg-brand-gold-light"
                  >
                    {current.ctaLabel}
                  </Link>
                )}
                {current.ctaLabelSecondary && (
                  <Link
                    href={current.ctaUrlSecondary ?? "#"}
                    className="rounded-md border border-white/60 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
                  >
                    {current.ctaLabelSecondary}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel meta bawah ala situs lama */}
      <div className="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:px-8">
          <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
          <p className="min-w-0 flex-1 truncate text-sm text-white/85">
            {current.description ?? current.title}
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <p className="text-sm">
              <span className="font-bold text-brand-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-white/50"> / {String(slides.length).padStart(2, "0")}</span>
            </p>
            <button
              onClick={() => go(-1)}
              aria-label="Slide sebelumnya"
              className="rounded-full border border-white/30 p-2 text-white transition hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Slide berikutnya"
              className="rounded-full border border-white/30 p-2 text-white transition hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
