import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Pengaduan" };

export default async function PengaduanPage() {
  const [navItems, settings] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.siteSetting.findMany(),
  ]);

  const nav: PublicNavItem[] = navItems.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    children: item.children.map((c) => ({ id: c.id, title: c.title, url: c.url })),
  }));

  const siteSettings = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader navItems={nav} />
      <PageBanner title="Pengaduan" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Pengaduan" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 space-y-8">
            <section className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-neutral-900">Jenis Pengaduan yang Dapat Diterima</h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-neutral-700">
                <li>Pengaduan atas layanan pelayanan informasi publik yang tidak memuaskan</li>
                <li>Pengaduan atas perilaku petugas PPID yang tidak profesional</li>
                <li>Saran untuk peningkatan kualitas layanan PPID</li>
                <li>Laporan dugaan pelanggaran UU No. 14 Tahun 2008</li>
                <li>Pengaduan lain yang berkaitan dengan pelayanan informasi publik</li>
              </ul>
            </section>

            <section className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-neutral-900">Prosedur Pengaduan</h2>
              <ol className="mt-4 space-y-3 list-decimal list-inside text-neutral-700">
                <li>Ajukan pengaduan secara tertulis dengan detail yang jelas</li>
                <li>Sertakan identitas lengkap dan cara menghubungi Anda</li>
                <li>Jelaskan kronologi dan bukti pendukung pengaduan</li>
                <li>Tim PPID akan menginvestigasi dan memberikan tanggapan dalam waktu 14 hari kerja</li>
                <li>Hasil investigasi akan dikomunikasikan kepada Anda</li>
              </ol>
            </section>

            <section className="rounded-lg border border-brand/30 bg-brand/5 p-6">
              <h2 className="text-xl font-semibold text-neutral-900">Kirim Pengaduan</h2>
              <div className="mt-4 space-y-3 text-neutral-700">
                <p>
                  <strong>Email:</strong> <a href={`mailto:${siteSettings.email || 'ppid@jamkridabali.co.id'}`} className="text-brand hover:underline">
                    {siteSettings.email || "ppid@jamkridabali.co.id"}
                  </a>
                </p>
                <p><strong>Telepon:</strong> {siteSettings.phone || "(0361) 000000"}</p>
                <p><strong>Alamat:</strong> {siteSettings.address || "Jl. Surapati No.8, Dangin Puri, Kecamatan Denpasar Timur, Kota Denpasar, Bali 80232"}</p>
              </div>
            </section>

            <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
              <h2 className="text-xl font-semibold text-neutral-900">Komitmen Kami</h2>
              <p className="mt-4 text-neutral-700">
                Kami berkomitmen untuk menangani setiap pengaduan dengan serius dan profesional. Kepuasan Anda adalah prioritas kami dalam memberikan pelayanan informasi publik yang berkualitas.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
