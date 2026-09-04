import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Tim Kami" };

export default async function TimKamiPage() {
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
      <PageBanner title="Tim Kami" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Tim Kami" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 rounded-lg border border-neutral-200 bg-white p-8">
            <p className="text-neutral-700">
              Unit Pelayanan Informasi Publik (PPID) kami terdiri dari tim profesional yang berdedikasi dalam memberikan pelayanan informasi publik berkualitas tinggi. Setiap anggota tim telah menerima pelatihan khusus tentang keterbukaan informasi publik dan hukum yang berlaku.
            </p>

            <div className="mt-8 space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-brand-dark">Kompetensi Tim</h2>
                <ul className="mt-4 list-inside list-disc space-y-2 text-neutral-700">
                  <li>Pemahaman mendalam tentang UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik</li>
                  <li>Keahlian dalam manajemen dokumen dan informasi publik</li>
                  <li>Kemampuan komunikasi yang baik dengan publik</li>
                  <li>Integritas dan profesionalisme dalam menjalankan tugas</li>
                  <li>Keterampilan teknologi informasi untuk layanan digital</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-brand-dark">Layanan Tim PPID</h2>
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
                    <p className="font-semibold text-neutral-900">Konsultasi Informasi Publik</p>
                    <p className="mt-1 text-sm text-neutral-700">Tim kami siap memberikan konsultasi tentang informasi apa yang dapat Anda akses</p>
                  </div>
                  <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
                    <p className="font-semibold text-neutral-900">Proses Permohonan</p>
                    <p className="mt-1 text-sm text-neutral-700">Kami membantu memandu Anda dalam proses permohonan informasi publik</p>
                  </div>
                  <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
                    <p className="font-semibold text-neutral-900">Penanganan Keberatan</p>
                    <p className="mt-1 text-sm text-neutral-700">Tim kami menangani keberatan Anda dengan profesional dan transparan</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-brand-dark">Hubungi Tim PPID</h2>
                <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-sm text-neutral-700">
                    <strong>Email:</strong> {siteSettings.email || "ppid@jamkridabali.co.id"}
                  </p>
                  <p className="mt-2 text-sm text-neutral-700">
                    <strong>Telepon:</strong> {siteSettings.phone || "(0361) 000000"}
                  </p>
                  <p className="mt-2 text-sm text-neutral-700">
                    <strong>Alamat:</strong> {siteSettings.address || "Jl. Raya Puputan No. 3, Denpasar, Bali"}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
