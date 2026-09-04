import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Struktur Organisasi" };

export default async function StrukturOrganisasiPage() {
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
      <PageBanner title="Struktur Organisasi" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Struktur Organisasi" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 rounded-lg border border-neutral-200 bg-white p-8">
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-block rounded-lg bg-brand/10 px-6 py-3">
                  <p className="font-semibold text-neutral-900">Direktur Utama</p>
                  <p className="text-sm text-neutral-600">PT Jamkrida Bali Mandara (Perseroda)</p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="h-8 w-0.5 bg-neutral-300"></div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                  <h3 className="font-semibold text-neutral-900">Kepala PPID</h3>
                  <p className="mt-2 text-sm text-neutral-700">
                    Bertanggung jawab atas penyelenggaraan pelayanan informasi publik dan koordinasi dengan unit-unit terkait
                  </p>
                </div>

                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                  <h3 className="font-semibold text-neutral-900">Unit Pendukung PPID</h3>
                  <p className="mt-2 text-sm text-neutral-700">
                    Membantu penyelenggaraan operasional PPID dan pengelolaan dokumentasi informasi publik
                  </p>
                </div>
              </div>

              <section>
                <h2 className="text-lg font-semibold text-brand-dark">Tugas Pokok Kepala PPID</h2>
                <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-neutral-700">
                  <li>Mengoordinasikan penyediaan dan pelayanan informasi publik</li>
                  <li>Menerima dan menindaklanjuti permohonan informasi publik</li>
                  <li>Menangani keberatan atas keputusan PPID</li>
                  <li>Melaporkan penyelenggaraan pelayanan informasi publik</li>
                  <li>Melakukan sosialisasi tentang keterbukaan informasi publik</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-brand-dark">Unit Pendukung PPID</h2>
                <p className="mt-3 text-sm text-neutral-700">
                  Unit Pendukung PPID terdiri dari petugas-petugas yang bertugas membantu Kepala PPID dalam:
                </p>
                <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-neutral-700">
                  <li>Menerima dan mencatat permohonan informasi</li>
                  <li>Mengelola dan mendokumentasikan informasi publik</li>
                  <li>Melayani konsultasi tentang informasi publik</li>
                  <li>Menyiapkan laporan pelayanan informasi publik</li>
                  <li>Melakukan penelusuran dan penyusunan informasi yang diminta</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
