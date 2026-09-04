"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export type Pejabat = {
  id: string;
  name: string;
  jabatan: string;
  photo: string;
  bio: string;
};

const excerpt = (bio: string) =>
  bio.length > 110 ? `${bio.slice(0, 110).trimEnd()}...` : bio;

function PejabatCard({
  p,
  active,
  onToggle,
}: {
  p: Pejabat;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      {/* Kartu: efek hover + excerpt saja. Biodata lengkap hanya muncul saat kartu/foto DIKLIK */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={active}
        className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="relative h-72 overflow-hidden bg-neutral-100">
          {p.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.photo}
              alt={p.name}
              className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-4xl font-bold text-neutral-300">
              {p.name.charAt(0)}
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-md bg-amber-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-dark">
            {p.jabatan}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-bold text-neutral-900">{p.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">{excerpt(p.bio)}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition group-hover:gap-2.5">
            Klik untuk profil lengkap
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </button>

      {/* Popup biodata lengkap — hanya muncul setelah kartu/foto diklik */}
      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/70 p-4"
          onClick={onToggle}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-neutral-100 px-8 py-4">
              <button
                type="button"
                onClick={onToggle}
                aria-label="Tutup profil"
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-8 pb-10 pt-6">
              <div className="mx-auto w-64 overflow-hidden rounded-xl bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.photo} alt={p.name} className="h-72 w-full object-cover object-top" />
              </div>
              <div className="mt-5 text-center">
                <span className="inline-flex items-center rounded-md bg-amber-400 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-dark">
                  {p.jabatan}
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-neutral-900">{p.name}</h3>
              </div>
              <div className="mt-6 border-t border-neutral-100 pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">
                  Profil & Keterangan Lengkap
                </p>
                <p className="mt-4 leading-relaxed text-neutral-700">{p.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PejabatSection({
  title,
  subtitle,
  list,
}: {
  title: string;
  subtitle: string;
  list: Pejabat[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  // Tutup popup dengan tombol Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (list.length === 0) return null;

  return (
    <section className="mt-14 first:mt-0">
      <h2 className="text-3xl font-extrabold text-neutral-900 lg:text-4xl">{title}</h2>
      <p className="mt-2 text-neutral-600">{subtitle}</p>
      <div className="mt-4 h-1 w-full rounded bg-brand" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <PejabatCard
            key={p.id}
            p={p}
            active={openId === p.id}
            onToggle={() => setOpenId(openId === p.id ? null : p.id)}
          />
        ))}
      </div>
    </section>
  );
}

export function PejabatGrid({
  komisaris,
  direksi,
}: {
  komisaris: Pejabat[];
  direksi: Pejabat[];
}) {
  return (
    <div>
      <PejabatSection
        title="Dewan Komisaris"
        subtitle="Pejabat pengawas yang bertanggung jawab atas pengelolaan perusahaan"
        list={komisaris}
      />
      <PejabatSection
        title="Direksi"
        subtitle="Pejabat pelaksana yang menjalankan roda perusahaan sehari-hari"
        list={direksi}
      />
    </div>
  );
}
