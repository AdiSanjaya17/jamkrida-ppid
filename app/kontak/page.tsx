import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = { title: "Kontak" };

export default async function KontakPage() {
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
      <PageBanner title="Kontak" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Kontak" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">Informasi Kontak</h2>
              <div className="mt-6 space-y-4 text-sm text-neutral-700">
                <div>
                  <p className="font-semibold text-neutral-900">Alamat</p>
                  <p className="mt-1">{siteSettings.address || "Jl. Raya Puputan No. 3, Denpasar, Bali 80234"}</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Telepon</p>
                  <p className="mt-1">
                    <a href={`tel:${siteSettings.phone || '(0361) 000000'}`} className="text-brand hover:underline">
                      {siteSettings.phone || "(0361) 000000"}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Email</p>
                  <p className="mt-1">
                    <a href={`mailto:${siteSettings.email || 'ppid@jamkridabali.co.id'}`} className="text-brand hover:underline">
                      {siteSettings.email || "ppid@jamkridabali.co.id"}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">Ikuti Kami</h2>
              <div className="mt-6 space-y-3">
                {siteSettings.facebook_url && (
                  <a
                    href={siteSettings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-brand hover:underline"
                  >
                    Facebook
                  </a>
                )}
                {siteSettings.instagram_url && (
                  <a
                    href={siteSettings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-brand hover:underline"
                  >
                    Instagram
                  </a>
                )}
                {siteSettings.youtube_url && (
                  <a
                    href={siteSettings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-brand hover:underline"
                  >
                    YouTube
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Jam Operasional</h2>
            <div className="mt-4 space-y-2 text-sm text-neutral-700">
              <p><strong>Senin - Jumat:</strong> 08:00 - 17:00 WIB</p>
              <p><strong>Sabtu - Minggu:</strong> Tutup</p>
              <p className="mt-3 text-xs text-neutral-600">*Kecuali hari libur nasional</p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
