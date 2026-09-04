import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Keberatan" };

export default async function KekeberatanPage() {
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
      <PageBanner title="Keberatan" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Keberatan" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 space-y-8">
            <section className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-neutral-900">Hak Mengajukan Keberatan</h2>
              <p className="mt-3 text-neutral-700">
                Sesuai dengan UU No. 14 Tahun 2008, setiap pemohon informasi publik berhak mengajukan keberatan apabila:
              </p>
              <ul className="mt-4 list-inside list-disc space-y-2 text-neutral-700">
                <li>Permohonan informasi ditolak</li>
                <li>Informasi yang diberikan tidak sesuai dengan yang diminta</li>
                <li>Permintaan biaya tidak wajar</li>
                <li>Informasi tidak diberikan sesuai waktu yang ditentukan</li>
              </ul>
            </section>

            <section className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-neutral-900">Prosedur Pengajuan Keberatan</h2>
              <ol className="mt-4 space-y-3 list-decimal list-inside text-neutral-700">
                <li>Ajukan keberatan dalam bentuk tertulis kepada PPID dalam waktu 30 hari kerja sejak keputusan ditolak</li>
                <li>Sertakan alasan keberatan yang jelas dan rinci</li>
                <li>Lampirkan surat penolakan atau dokumen yang menjadi dasar keberatan</li>
                <li>PPID akan memproses dan memberikan tanggapan dalam waktu 30 hari kerja</li>
                <li>Jika masih tidak puas, Anda dapat melaporkan ke Komisi Informasi</li>
              </ol>
            </section>

            <section className="rounded-lg border border-brand/30 bg-brand/5 p-6">
              <h2 className="text-xl font-semibold text-neutral-900">Hubungi PPID</h2>
              <div className="mt-4 space-y-2 text-neutral-700">
                <p><strong>Email:</strong> {siteSettings.email || "ppid@jamkridabali.co.id"}</p>
                <p><strong>Telepon:</strong> {siteSettings.phone || "(0361) 000000"}</p>
                <p><strong>Alamat:</strong> {siteSettings.address || "Jl. Surapati No.8, Dangin Puri, Kecamatan Denpasar Timur, Kota Denpasar, Bali 80232"}</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
