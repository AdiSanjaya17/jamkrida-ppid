import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Sengketa Informasi" };

export default async function SengketaInformasiPage() {
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
      <PageBanner title="Sengketa Informasi" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Sengketa Informasi" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 space-y-8 rounded-lg border border-neutral-200 bg-white p-8">
            <section>
              <h2 className="text-lg font-semibold text-brand-dark">Pengertian Sengketa Informasi</h2>
              <p className="mt-3 text-neutral-700">
                Sengketa informasi adalah perselisihan yang terjadi antara pemohon informasi publik dengan badan publik yang berkaitan dengan hak dan kewajiban dalam mendapatkan akses informasi publik berdasarkan UU No. 14 Tahun 2008.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand-dark">Jenis Sengketa Informasi</h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-700">
                <li>Penolakan akses informasi publik</li>
                <li>Tidak ditanggapinya permohonan informasi dalam waktu yang ditentukan</li>
                <li>Penyediaan informasi yang tidak lengkap atau tidak sesuai dengan yang diminta</li>
                <li>Penyediaan informasi yang tidak akurat atau menyesatkan</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand-dark">Prosedur Penyelesaian Sengketa</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-neutral-200 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Permohonan Keberatan</h3>
                      <p className="mt-1 text-sm text-neutral-700">
                        Ajukan keberatan tertulis kepada PPID dalam waktu 30 hari kerja sejak keputusan diterima
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-200 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Pemeriksaan PPID</h3>
                      <p className="mt-1 text-sm text-neutral-700">
                        PPID akan memeriksa keberatan Anda dan memberikan tanggapan dalam waktu 30 hari kerja
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-200 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Permohonan Mediasi</h3>
                      <p className="mt-1 text-sm text-neutral-700">
                        Jika masih tidak puas, ajukan permohonan mediasi ke Komisi Informasi dalam waktu 14 hari kerja
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-200 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Arbitrase Komisi Informasi</h3>
                      <p className="mt-1 text-sm text-neutral-700">
                        Jika mediasi tidak berhasil, Komisi Informasi dapat melakukan arbitrase dengan putusan yang mengikat
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand-dark">Komisi Informasi</h2>
              <p className="mt-3 text-neutral-700">
                Komisi Informasi adalah lembaga independen yang bertugas menangani sengketa informasi publik, memberikan mediasi, dan arbitrase dalam sengketa informasi publik antara pemohon informasi dengan badan publik.
              </p>
              <p className="mt-3 text-sm text-neutral-600">
                Untuk informasi lebih lanjut tentang Komisi Informasi Provinsi Bali, silakan kunjungi website resmi mereka atau hubungi langsung kantor mereka.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
