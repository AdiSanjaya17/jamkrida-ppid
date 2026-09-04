import Link from "next/link";
import { Mail, MapPin, Phone, Facebook, Instagram, Youtube } from "lucide-react";

export type SiteSettings = Record<string, string>;

const defaults: SiteSettings = {
  address: "Jl. Raya Puputan No. 3, Denpasar, Bali",
  phone: "(0361) 000000",
  email: "ppid@jamkridabali.co.id",
  company_description:
    "Unit Pelayanan Informasi Publik PT Jamkrida Bali Mandara (Perseroda) — mengawal transparansi informasi publik sesuai UU No. 14 Tahun 2008.",
};

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const s = { ...defaults, ...settings };
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-ppid.png"
              alt="PPID PT Jamkrida Bali Mandara (Perseroda)"
              className="h-11 w-auto"
            />
            <p className="font-bold">PPID Jamkrida Bali</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {s.company_description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Kontak
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {s.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" /> {s.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" /> {s.email}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Tautan Cepat
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link href="/profil-ppid" className="hover:text-white">Profil PPID</Link></li>
            <li><Link href="/informasi-berkala" className="hover:text-white">Informasi Berkala</Link></li>
            <li><Link href="/permohonan-informasi" className="hover:text-white">Permohonan Informasi</Link></li>
            <li><Link href="/laporan-tahunan" className="hover:text-white">Laporan Tahunan</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Ikuti Kami
          </h3>
          <div className="mt-4 flex gap-3">
            <a href={s.facebook_url ?? "#"} aria-label="Facebook" className="rounded-full bg-white/10 p-2.5 hover:bg-white/20">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={s.instagram_url ?? "#"} aria-label="Instagram" className="rounded-full bg-white/10 p-2.5 hover:bg-white/20">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={s.youtube_url ?? "#"} aria-label="YouTube" className="rounded-full bg-white/10 p-2.5 hover:bg-white/20">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {year} PPID — PT Jamkrida Bali Mandara (Perseroda). Hak cipta dilindungi.
      </div>
    </footer>
  );
}
