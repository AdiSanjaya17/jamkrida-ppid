import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Tugas & Fungsi PPID" };

export default async function TugasPPIDPage() {
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
      <PageBanner title="Tugas & Fungsi PPID" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Tugas & Fungsi PPID" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 space-y-8 rounded-lg border border-neutral-200 bg-white p-8">
            <section>
              <h2 className="text-xl font-semibold text-brand-dark">Tugas PPID</h2>
              <ul className="mt-4 list-inside list-disc space-y-3 text-neutral-700">
                <li>Menerima, mencatat, dan mendistribusikan permohonan informasi publik</li>
                <li>Memberikan informasi publik sesuai dengan UU No. 14 Tahun 2008</li>
                <li>Menangani keberatan atas keputusan informasi yang ditolak</li>
                <li>Menyimpan, merawat, dan memelihara dokumen informasi publik</li>
                <li>Membuat laporan berkala tentang pelayanan informasi publik</li>
                <li>Melakukan koordinasi internal dalam pengadaan dan pengelolaan informasi publik</li>
                <li>Mendokumentasikan seluruh proses pelayanan informasi publik</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark">Fungsi PPID</h2>
              <ul className="mt-4 list-inside list-disc space-y-3 text-neutral-700">
                <li>Fungsi Penyedia Informasi — menyediakan informasi publik yang wajib diumumkan secara berkala</li>
                <li>Fungsi Penerima Permohonan — menerima dan memproses permohonan informasi dari masyarakat</li>
                <li>Fungsi Penangani Keberatan — menangani keberatan atas keputusan penolakan informasi</li>
                <li>Fungsi Pendokumentasian — mencatat dan mendokumentasikan semua transaksi pelayanan informasi</li>
                <li>Fungsi Pelaporan — membuat laporan berkala tentang kinerja pelayanan informasi publik</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark">Informasi yang Tersedia</h2>
              <p className="mt-3 text-neutral-700">
                PPID menyediakan informasi publik dalam empat kategori:
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
                  <h3 className="font-semibold text-neutral-900">Informasi Berkala</h3>
                  <p className="mt-2 text-sm text-neutral-700">
                    Informasi yang wajib diumumkan secara berkala dan teratur
                  </p>
                </div>
                <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
                  <h3 className="font-semibold text-neutral-900">Informasi Setiap Saat</h3>
                  <p className="mt-2 text-sm text-neutral-700">
                    Informasi yang dapat diakses kapan saja sesuai permintaan
                  </p>
                </div>
                <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
                  <h3 className="font-semibold text-neutral-900">Informasi Serta Merta</h3>
                  <p className="mt-2 text-sm text-neutral-700">
                    Informasi yang diumumkan segera untuk kepentingan publik
                  </p>
                </div>
                <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
                  <h3 className="font-semibold text-neutral-900">Informasi Dikecualikan</h3>
                  <p className="mt-2 text-sm text-neutral-700">
                    Informasi yang tidak dapat diakses sesuai ketentuan hukum
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
