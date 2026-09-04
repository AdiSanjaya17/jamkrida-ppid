import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Permohonan Informasi" };

export default async function PermohonantInformasiPage() {
  const [navItems, settings, services] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.siteSetting.findMany(),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
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
      <PageBanner title="Permohonan Informasi" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Permohonan Informasi" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 rounded-lg border border-brand/30 bg-brand/5 p-6">
            <h2 className="font-semibold text-neutral-900">Prosedur Permohonan:</h2>
            <ol className="mt-4 space-y-3 list-decimal list-inside text-sm text-neutral-700">
              <li>Isi formulir permohonan informasi dengan lengkap</li>
              <li>Sertakan identitas diri yang jelas (KTP/identitas lainnya)</li>
              <li>Jelaskan informasi yang diminta secara spesifik</li>
              <li>Tentukan cara penerimaan informasi (elektronik/cetak)</li>
              <li>Submit dan tunggu konfirmasi dari PPID</li>
              <li>Pengambilan informasi sesuai jadwal yang telah disepakati</li>
            </ol>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-neutral-900">Formulir & Saluran Layanan</h2>
            <div className="mt-6 grid gap-4">
              {services.length > 0 ? (
                services.map((service) => (
                  <a
                    key={service.id}
                    href={service.formUrl ?? "#"}
                    target={service.formUrl ? "_blank" : undefined}
                    rel={service.formUrl ? "noopener noreferrer" : undefined}
                    className="rounded-lg border border-neutral-200 p-6 hover:border-brand hover:shadow-md transition-all bg-white"
                  >
                    <h3 className="font-semibold text-neutral-900">{service.title}</h3>
                    <p className="mt-2 text-sm text-neutral-600">{service.description}</p>
                    {service.formUrl && (
                      <p className="mt-3 text-sm font-semibold text-brand">Buka formulir →</p>
                    )}
                  </a>
                ))
              ) : (
                <p className="text-neutral-500">Belum ada layanan yang tersedia</p>
              )}
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
            <h3 className="font-semibold text-neutral-900">Kontak PPID</h3>
            <div className="mt-4 space-y-2 text-sm text-neutral-700">
              <p><strong>Alamat:</strong> {siteSettings.address || "Jl. Surapati No.8, Dangin Puri, Kecamatan Denpasar Timur, Kota Denpasar, Bali 80232"}</p>
              <p><strong>Telepon:</strong> {siteSettings.phone || "(0361) 000000"}</p>
              <p><strong>Email:</strong> {siteSettings.email || "ppid@jamkridabali.co.id"}</p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
