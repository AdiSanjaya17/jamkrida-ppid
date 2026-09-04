import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import { getSectionData } from "@/lib/section-content";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { AnimatedPartnersCarousel } from "@/components/public/animated-partners-carousel";
import type { HeroSlide } from "@/components/admin/hero-slide-manager";
import {
  CalendarDays,
  Database,
  Bell,
  EyeOff,
  ArrowRight,
  MapPin,
  Phone,
  Monitor,
  Globe,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

const infoCategoryIcons = [CalendarDays, Database, Bell, EyeOff];

const str = (val: unknown, fallback = "") => String(val ?? fallback);

export default async function HomePage() {
  const [
    sectionRows,
    slides,
    navItems,
    news,
    docCount,
    infoCount,
    statistics,
    partners,
    settings,
  ] = await Promise.all([
    prisma.homepageSection.findMany({ where: { isActive: true } }),
    prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.news.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 4,
    }),
    prisma.document.count({ where: { status: "PUBLISHED" } }),
    prisma.publicInformation.count({ where: { status: "PUBLISHED" } }),
    prisma.statistic.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.partner.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.siteSetting.findMany(),
  ]);

  const activeKeys = new Set(sectionRows.filter((s) => s.isActive).map((s) => s.key));
  const scInfo = getSectionData(sectionRows, "informasi_publik") as Record<string, any>;
  const scTentang = getSectionData(sectionRows, "tentang") as Record<string, any>;
  const scLayanan = getSectionData(sectionRows, "layanan_ppid") as Record<string, any>;
  const scStat = getSectionData(sectionRows, "statistik") as Record<string, any>;
  const scBerita = getSectionData(sectionRows, "berita_terbaru") as Record<string, any>;
  const scMitra = getSectionData(sectionRows, "mitra") as Record<string, any>;
  const infoCategories = infoCategoryIcons.map((Icon, i) => ({
    num: String(scInfo[`cat${i + 1}Num`] ?? ""),
    title: String(scInfo[`cat${i + 1}Title`] ?? ""),
    desc: String(scInfo[`cat${i + 1}Desc`] ?? ""),
    href: String(scInfo[`cat${i + 1}Href`] ?? "#"),
    icon: Icon,
  }));
  const nav: PublicNavItem[] = navItems.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    children: item.children.map((c) => ({ id: c.id, title: c.title, url: c.url })),
  }));
  const heroSlides: HeroSlide[] = slides.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    description: s.description,
    backgroundUrl: s.backgroundUrl,
    overlayColor: s.overlayColor,
    overlayOpacity: s.overlayOpacity,
    ctaLabel: s.ctaLabel,
    ctaUrl: s.ctaUrl,
    ctaLabelSecondary: s.ctaLabelSecondary,
    ctaUrlSecondary: s.ctaUrlSecondary,
    order: s.order,
    isActive: s.isActive,
  }));
  const siteSettings = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const [featured, ...related] = news;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader navItems={nav} overlay={activeKeys.has("hero")} />

      <main className="flex-1">
        {activeKeys.has("hero") && <HeroCarousel slides={heroSlides} />}

        {/* Strip Kategori Informasi */}
        <section className="border-b border-neutral-100 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-1 divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200 sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
               {infoCategories.map((cat, idx) => (
                 <Link
                   key={`info-cat-${idx}`}
                   href={cat.href}
                   className="group flex flex-col p-8 transition-colors hover:bg-neutral-50"
                 >
                  <div className="flex items-start justify-between">
                     <span className="text-sm font-bold text-brand-gold">{String(cat.num)}</span>
                     <cat.icon className="h-5 w-5 text-neutral-400 transition-colors group-hover:text-brand" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-neutral-900 group-hover:text-brand">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{cat.desc}</p>
                  <span className="mt-auto pt-6 text-sm font-semibold text-transparent transition-colors group-hover:text-brand">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Tentang Kami */}
        {activeKeys.has("tentang") && (
          <section className="bg-neutral-50 py-16 lg:py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 lg:grid-cols-5 lg:px-8">
               <div className={`lg:col-span-3 ${str(scTentang.imagePosition) === "left" ? "lg:order-2" : ""}`}>
                 <p className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">
                   <span className="h-0.5 w-8 bg-brand-gold" /> {str(scTentang.kicker, "")}
                 </p>
                 <h2 className="text-3xl font-extrabold leading-tight text-neutral-900 lg:text-5xl">
                   {str(scTentang.heading1, "")}{" "}
                   <span className="text-brand">{str(scTentang.heading2, "")}</span>
                 </h2>
                 <p className="mt-6 leading-relaxed text-neutral-700">
                   {str(scTentang.paragraph, "")}
                 </p>

                 <div className="mt-8 border-l-4 border-brand-gold bg-white p-5">
                   <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                     {str(scTentang.skLabel, "")}
                   </p>
                   <p className="mt-2 font-bold text-neutral-900">
                     {str(scTentang.skTitle, "")}
                   </p>
                   <p className="mt-1 text-sm text-neutral-600">
                     {str(scTentang.skMeta, "")}
                   </p>
                 </div>

                <div className="mt-8 flex flex-wrap gap-4">
                   <Link
                     href={str(scTentang.btn1Href, "/")}
                     className="rounded-md bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-blue-light"
                   >
                     {str(scTentang.btn1Label, "Lihat Selengkapnya")}
                   </Link>
                   <Link
                     href={str(scTentang.btn2Href, "#")}
                     className="inline-flex items-center gap-2 px-2 py-3 text-sm font-bold text-neutral-800 hover:text-brand"
                   >
                     {str(scTentang.btn2Label, "Pelajari Lebih")} <ArrowRight className="h-4 w-4" />
                   </Link>
                 </div>
              </div>

               <div className={`lg:col-span-2 ${str(scTentang.imagePosition) === "left" ? "lg:order-1" : ""}`}>
                 <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img
                     src={str(scTentang.image, "")}
                     alt={str(scTentang.cardCaption, "Gambar")}
                     className="w-full rounded-xl"
                   />
                   <p className="pt-4 text-center text-sm font-medium text-neutral-800">
                     {str(scTentang.cardCaption, "")}
                   </p>
                   <p className="pb-2 text-center text-xs text-neutral-500">
                     {str(scTentang.cardSub, "")}
                   </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Dua kartu kategori */}
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 lg:grid-cols-2 lg:px-8">
            <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                <div>
                 <div className="flex items-center gap-4">
                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-brand">
                     <Database className="h-6 w-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-neutral-900">{str(scInfo.card1Title, "")}</h3>
                     <p className="text-sm text-neutral-500">{str(scInfo.card1Tag, "")}</p>
                   </div>
                 </div>
                 <p className="mt-5 leading-relaxed text-neutral-700">
                   {str(scInfo.card1Desc, "")}
                 </p>
               </div>
               <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-5">
                 <span className="text-sm text-neutral-500">{str(scInfo.card1Meta, "")}</span>
                 <Link
                   href={str(scInfo.card1Href, "#")}
                   className="rounded-md border border-neutral-300 px-5 py-2 text-sm font-bold text-neutral-800 transition hover:border-brand hover:text-brand"
                 >
                   {str(scInfo.card1Btn, "")}
                 </Link>
               </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                <div>
                 <div className="flex items-center gap-4">
                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-brand-gold-dark">
                     <EyeOff className="h-6 w-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-neutral-900">
                       {str(scInfo.card2Title, "")}
                     </h3>
                     <p className="text-sm text-neutral-500">{str(scInfo.card2Tag, "")}</p>
                   </div>
                 </div>
                 <p className="mt-5 leading-relaxed text-neutral-700">
                   {str(scInfo.card2Desc, "")}
                 </p>
               </div>
               <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-5">
                 <span className="text-sm text-neutral-500">{str(scInfo.card2Meta, "")}</span>
                 <Link
                   href={str(scInfo.card2Href, "#")}
                   className="rounded-md border border-neutral-300 px-5 py-2 text-sm font-bold text-neutral-800 transition hover:border-brand hover:text-brand"
                 >
                   {str(scInfo.card2Btn, "")}
                 </Link>
               </div>
            </div>
          </div>
        </section>

        {/* Jadwal Pelayanan */}
        {activeKeys.has("layanan_ppid") && (
          <section className="bg-neutral-50 py-16 lg:py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 lg:grid-cols-2 lg:px-8">
               <div>
                 <p className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">
                   <span className="h-0.5 w-8 bg-brand-gold" /> {str(scLayanan.kicker, "")}
                 </p>
                 <h2 className="text-3xl font-extrabold leading-tight text-neutral-900 lg:text-4xl">
                   {str(scLayanan.heading, "")}
                 </h2>
                 <p className="mt-4 leading-relaxed text-neutral-700">
                   {str(scLayanan.description, "")}
                 </p>

                 <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
                   <p className="flex items-center gap-2 font-bold text-brand">
                     <Clock className="h-5 w-5" /> {str(scLayanan.scheduleTitle, "")}
                   </p>
                   <div className="mt-4 grid grid-cols-2 gap-3">
                     <div className="rounded-xl bg-neutral-50 p-4">
                       <p className="text-sm font-bold text-neutral-900">{str(scLayanan.sched1Days, "")}</p>
                       <p className="mt-1 text-sm text-neutral-600">{str(scLayanan.sched1Time, "")}</p>
                     </div>
                     <div className="rounded-xl bg-neutral-50 p-4">
                       <p className="text-sm font-bold text-neutral-900">{str(scLayanan.sched2Days, "")}</p>
                       <p className="mt-1 text-sm text-neutral-600">{str(scLayanan.sched2Time, "")}</p>
                     </div>
                   </div>
                 </div>

                 <div className="mt-8 flex flex-wrap gap-4">
                   <Link
                     href={str(scLayanan.btn1Href, "/")}
                     className="rounded-md bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-blue-light"
                   >
                     {str(scLayanan.btn1Label, "")}
                   </Link>
                   <Link
                     href={str(scLayanan.btn2Href, "/")}
                     className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-bold text-neutral-800 transition hover:border-brand hover:text-brand"
                   >
                     {str(scLayanan.btn2Label, "")}
                   </Link>
                 </div>
               </div>

               <div className="rounded-2xl border border-neutral-200 bg-white p-8">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                       {str(scLayanan.panelKicker, "")}
                     </p>
                     <h3 className="mt-1 text-lg font-bold text-neutral-900">
                       {str(scLayanan.panelTitle, "")}
                     </h3>
                   </div>
                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-brand">
                     <Monitor className="h-5 w-5" />
                   </div>
                 </div>

                 <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                   {[
                     {
                       initial: str(scLayanan.petugas1Initial, "W"),
                       name: str(scLayanan.petugas1Name, ""),
                       role: str(scLayanan.petugas1Role, ""),
                     },
                     {
                       initial: str(scLayanan.petugas2Initial, "M"),
                       name: str(scLayanan.petugas2Name, ""),
                       role: str(scLayanan.petugas2Role, ""),
                     },
                    ].map((p, idx) => (
                      <div
                        key={`petugas-${idx}`}
                        className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4"
                      >
                       <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                         {p.initial}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-neutral-900">{p.name}</p>
                         <p className="text-xs text-neutral-500">{p.role}</p>
                       </div>
                     </div>
                   ))}
                 </div>

                 <div className="mt-8 space-y-4 border-t border-neutral-100 pt-6 text-sm">
                   <p className="mb-3 text-neutral-500">{str(scLayanan.channelsTitle, "")}</p>
                   <p className="flex items-center gap-3 text-neutral-700">
                     <MapPin className="h-4 w-4 shrink-0 text-brand-gold-dark" />
                     <span className="font-semibold text-neutral-900">{str(scLayanan.channelAddressLabel, "")}</span>
                    {siteSettings.address ?? "Jl. Surapati No 8 Denpasar, Bali 80232"}
                  </p>
                   <p className="flex items-center gap-3 text-neutral-700">
                     <Phone className="h-4 w-4 shrink-0 text-brand-gold-dark" />
                     <span className="font-semibold text-neutral-900">{str(scLayanan.channelPhoneLabel, "")}</span>
                     {siteSettings.phone ?? "0361-224087 / 221798"}
                   </p>
                   <p className="flex items-center gap-3 text-neutral-700">
                     <Monitor className="h-4 w-4 shrink-0 text-brand-gold-dark" />
                     <span className="font-semibold text-neutral-900">{str(scLayanan.channelOnlineLabel, "")}</span>
                     <Link href="/permohonan-informasi" className="text-brand hover:underline">
                       Formulir Permohonan Informasi Publik
                     </Link>
                   </p>
                   <p className="flex items-center gap-3 text-neutral-700">
                     <Globe className="h-4 w-4 shrink-0 text-brand-gold-dark" />
                     <span className="font-semibold text-neutral-900">{str(scLayanan.channelWebsiteLabel, "")}</span>
                    <a
                      href={siteSettings.website_url ?? "https://www.jamkridabali.co.id"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      {siteSettings.website_url ?? "www.jamkridabali.co.id"}
                    </a>
                  </p>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* Statistik band */}
        {activeKeys.has("statistik") && (
          <section className="bg-brand py-16 text-white lg:py-20">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {(statistics && statistics.length > 0
                  ? statistics.map((s) => ({ label: s.title, value: s.value }))
                  : [
                      { label: scStat.s1Label || "Dokumen Publik", value: docCount > 0 ? String(docCount) : null },
                      { label: scStat.s2Label || "Informasi Tersedia", value: infoCount > 0 ? String(infoCount) : null },
                      { label: scStat.s3Label || "Permohonan Informasi", value: scStat.s3Value || null },
                      { label: scStat.s4Label || "Tingkat Penyelesaian", value: scStat.s4Value || null },
                    ]
                ).map((stat, idx) => (
                  <div
                    key={`stat-${idx}-${stat.label || idx}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
                  >
                    {stat.value ? (
                      <p className="text-4xl font-extrabold">{stat.value}</p>
                    ) : (
                      <div className="mx-auto mt-2 h-1.5 w-12 rounded bg-white/20" />
                    )}
                    <p className="mt-4 font-semibold">{stat.label}</p>
                    {!stat.value && (
                      <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/60">
                        Menunggu Data
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-10 text-center text-sm text-white/50">
                Angka riil akan ditampilkan otomatis begitu sistem data aktif — tanpa
                angka rekayasa.
              </p>
            </div>
          </section>
        )}

        {/* Berita Terbaru */}
        {activeKeys.has("berita_terbaru") && (
          <section className="bg-white py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
               <div className="flex flex-wrap items-end justify-between gap-4">
                 <div>
                   <p className="mb-3 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">
                     <span className="h-0.5 w-8 bg-brand-gold" /> {str(scBerita.kicker, "")}
                   </p>
                   <h2 className="text-3xl font-extrabold text-neutral-900 lg:text-5xl">
                     {str(scBerita.heading, "")}
                   </h2>
                 </div>
                 <Link
                   href="/berita"
                   className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
                 >
                   Lihat Selengkapnya <ArrowRight className="h-4 w-4" />
                 </Link>
               </div>

               {news.length === 0 ? (
                 <p className="mt-10 rounded-lg border border-dashed border-neutral-300 p-12 text-center text-sm text-neutral-500">
                   {str(scBerita.emptyText, "")}
                 </p>
               ) : (
                 <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
                   {/* Featured */}
                   <Link href={`/berita/${featured.slug}`} className="lg:col-span-2 group">
                     <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                       {featured.thumbnailUrl && (
                         <div className="relative h-72 w-full overflow-hidden bg-neutral-100 lg:h-96">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img
                             src={featured.thumbnailUrl}
                             alt={featured.title}
                             className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                           />
                         </div>
                       )}
                       <div className="p-7 flex flex-col flex-1">
                         <p className="text-xs font-semibold text-neutral-500">
                           📅{" "}
                           {new Date(featured.publishedAt ?? featured.createdAt).toLocaleDateString(
                             "id-ID",
                             { day: "numeric", month: "long", year: "numeric" }
                           )}
                         </p>
                         <h3 className="mt-3 text-2xl font-extrabold leading-snug text-brand lg:text-3xl group-hover:text-brand-blue-light transition-colors">
                           {featured.title}
                         </h3>
                         {featured.excerpt && (
                           <p className="mt-4 leading-relaxed text-neutral-600 flex-1">
                             {featured.excerpt}
                           </p>
                         )}
                         <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand group-hover:text-brand-blue-light transition-colors">
                           Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                         </p>
                       </div>
                     </article>
                   </Link>

                  {/* Related */}
                  <aside>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                      Berita Terkait Lainnya
                    </p>
                     <div className="mt-4 space-y-4">
                       {related.map((item) => (
                         <Link key={item.id} href={`/berita/${item.slug}`}>
                           <article className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:shadow-md hover:border-brand group cursor-pointer">
                             {item.thumbnailUrl && (
                               <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                 <img
                                   src={item.thumbnailUrl}
                                   alt={item.title}
                                   className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                                 />
                               </div>
                             )}
                             <div className="min-w-0 flex-1">
                               <p className="text-xs font-semibold text-brand-gold-dark">
                                 {new Date(item.publishedAt ?? item.createdAt).toLocaleDateString(
                                   "id-ID",
                                   { day: "numeric", month: "long", year: "numeric" }
                                 )}
                               </p>
                               <h4 className="mt-1 line-clamp-3 text-sm font-bold leading-snug text-neutral-900 group-hover:text-brand transition-colors">
                                 {item.title}
                               </h4>
                             </div>
                           </article>
                         </Link>
                       ))}
                     </div>
                     <Link
                       href="/berita"
                       className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-blue-light transition-colors"
                     >
                       Kunjungi Arsip Berita <ArrowRight className="h-4 w-4" />
                     </Link>
                  </aside>

                </div>
              )}
            </div>
          </section>
        )}

         {/* Mitra */}
         {activeKeys.has("mitra") && partners.length > 0 && (
           <section className="border-t border-neutral-100 bg-white py-16">
             <div className="mx-auto max-w-7xl px-4 lg:px-8">
               <p className="mb-3 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">
                 <span className="h-0.5 w-8 bg-brand-gold" /> {str(scMitra.kicker, "")}
               </p>
               <h2 className="text-2xl font-extrabold text-neutral-900 lg:text-3xl">
                 {str(scMitra.heading, "")}
               </h2>
               <div className="mt-10">
                 <AnimatedPartnersCarousel partners={partners} />
               </div>
             </div>
           </section>
         )}






      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}

