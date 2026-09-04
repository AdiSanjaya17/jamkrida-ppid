import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Pedoman PPID" };

export default async function PedomanPPIDPage() {
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

  const guidelines = [
    {
      title: "Standar Pelayanan PPID",
      description: "Standar minimal pelayanan informasi publik yang harus dipenuhi oleh PPID",
    },
    {
      title: "Layanan Informasi Pusat",
      description: "Mekanisme penyediaan informasi melalui layanan pusat informasi PPID",
    },
    {
      title: "Peraturan PPID",
      description: "Peraturan internal yang mengatur penyelenggaraan PPID perusahaan",
    },
    {
      title: "Maklumat PPID",
      description: "Pernyataan komitmen PPID terhadap transparansi dan pelayanan informasi publik",
    },
    {
      title: "Rancangan Peraturan",
      description: "Rancangan peraturan terkait penyelenggaraan pelayanan informasi publik",
    },
    {
      title: "SOP Pelayanan Informasi Publik",
      description: "Prosedur operasional standar untuk setiap aspek pelayanan informasi publik",
    },
    {
      title: "Pengelolaan Organisasi/Administrasi",
      description: "Panduan pengelolaan organisasi dan administrasi PPID",
    },
    {
      title: "Kepegawaian & Keuangan",
      description: "Ketentuan tentang kepegawaian, keuangan, dan pengelolaan sumber daya PPID",
    },
    {
      title: "Peraturan & Kebijakan",
      description: "Peraturan dan kebijakan terkait dengan penyelenggaraan PPID",
    },
    {
      title: "Pengecualian Informasi",
      description: "Ketentuan tentang informasi yang dikecualikan berdasarkan hukum yang berlaku",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader navItems={nav} />
      <PageBanner title="Pedoman PPID" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Pedoman PPID" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 space-y-6">
            <div className="rounded-lg border border-brand/30 bg-brand/5 p-6">
              <h2 className="font-semibold text-neutral-900">Dasar Hukum</h2>
              <p className="mt-3 text-sm text-neutral-700">
                Pedoman PPID disusun berdasarkan Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik, Peraturan Pemerintah No. 61 Tahun 2010, dan Peraturan Menteri BUMN tentang Penyelenggaraan Pelayanan Informasi Publik di BUMN.
              </p>
            </div>

            <div className="grid gap-4">
              {guidelines.map((guideline, idx) => (
                <div key={idx} className="rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900">{guideline.title}</h3>
                      <p className="mt-2 text-sm text-neutral-700">{guideline.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="font-semibold text-neutral-900">Akses Pedoman</h2>
              <p className="mt-3 text-sm text-neutral-700">
                Untuk mengakses dokumen pedoman PPID secara lengkap, silakan menghubungi Unit Pelayanan Informasi Publik kami melalui:
              </p>
              <div className="mt-4 space-y-2 text-sm text-neutral-700">
                <p><strong>Email:</strong> {siteSettings.email || "ppid@jamkridabali.co.id"}</p>
                <p><strong>Telepon:</strong> {siteSettings.phone || "(0361) 000000"}</p>
                <p><strong>Alamat:</strong> {siteSettings.address || "Jl. Surapati No.8, Dangin Puri, Kecamatan Denpasar Timur, Kota Denpasar, Bali 80232"}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
