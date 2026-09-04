import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";
import { PejabatGrid, type Pejabat } from "@/components/public/pejabat-grid";

export const metadata = {
  title: "Profil Pejabat – PPID | PT Jamkrida Bali Mandara (Perseroda)",
  description:
    "Profil pejabat Dewan Komisaris dan Direksi PT Jamkrida Bali Mandara (Perseroda).",
};

// dynamic — data pejabat dikelola via CMS admin (/admin/pejabat)
export const dynamic = "force-dynamic";

export default async function ProfilPejabatPage() {
  const [navItems, settings, pejabatList] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.siteSetting.findMany(),
    prisma.pejabat.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    }),
  ]);

  const toGrid = (rows: Awaited<ReturnType<typeof prisma.pejabat.findMany>>): Pejabat[] =>
    rows.map((r) => ({
      id: r.id,
      name: r.name,
      jabatan: r.jabatan,
      photo: r.photoUrl,
      bio: r.bio,
    }));

  const komisaris = toGrid(pejabatList.filter((p) => p.category === "KOMISARIS"));
  const direksi = toGrid(pejabatList.filter((p) => p.category === "DIREKSI"));

  const nav: PublicNavItem[] = navItems.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    children: item.children.map((c) => ({ id: c.id, title: c.title, url: c.url })),
  }));

  const siteSettings = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50/50">
      <SiteHeader navItems={nav} />
      <PageBanner
        title="Profil Pejabat"
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Profil Pejabat" }]}
      />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <PejabatGrid komisaris={komisaris} direksi={direksi} />
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
