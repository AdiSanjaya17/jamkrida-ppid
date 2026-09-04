import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Profil Pejabat" };

export default async function ProfilPejabatPage() {
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
      <PageBanner title="Profil Pejabat" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Profil Pejabat" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 rounded-lg border border-neutral-200 bg-white p-8">
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-brand-dark">Dewan Direksi</h2>
                <div className="mt-6 space-y-4">
                  <div className="rounded-lg border border-neutral-200 p-6">
                    <h3 className="font-semibold text-neutral-900">Direktur Utama</h3>
                    <p className="mt-2 text-sm text-neutral-700">
                      Bertanggung jawab atas pengelolaan strategis perusahaan dan pencapaian target kinerja perusahaan.
                    </p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-6">
                    <h3 className="font-semibold text-neutral-900">Direktur Operasional</h3>
                    <p className="mt-2 text-sm text-neutral-700">
                      Bertanggung jawab atas operasional perusahaan dan implementasi kebijakan dari Direktur Utama.
                    </p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-6">
                    <h3 className="font-semibold text-neutral-900">Direktur Keuangan</h3>
                    <p className="mt-2 text-sm text-neutral-700">
                      Bertanggung jawab atas pengelolaan keuangan dan laporan keuangan perusahaan.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-brand-dark">Kepala Departemen</h2>
                <div className="mt-6 space-y-4">
                  <div className="rounded-lg border border-neutral-200 p-6">
                    <h3 className="font-semibold text-neutral-900">Kepala Departemen Sumber Daya Manusia</h3>
                    <p className="mt-2 text-sm text-neutral-700">
                      Mengelola pengembangan dan pembinaan SDM perusahaan.
                    </p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-6">
                    <h3 className="font-semibold text-neutral-900">Kepala Departemen Operasional</h3>
                    <p className="mt-2 text-sm text-neutral-700">
                      Mengelola operasional harian dan kinerja operasional perusahaan.
                    </p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-6">
                    <h3 className="font-semibold text-neutral-900">Kepala Departemen Keuangan & Akuntansi</h3>
                    <p className="mt-2 text-sm text-neutral-700">
                      Mengelola fungsi keuangan, akuntansi, dan pelaporan keuangan.
                    </p>
                  </div>
                </div>
              </section>

              <div className="rounded-lg border border-brand/30 bg-brand/5 p-6">
                <p className="text-sm text-neutral-700">
                  <strong>Catatan:</strong> Untuk informasi lengkap dan terbaru tentang profil pejabat, silakan hubungi bagian SDM atau PPID kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
