import { prisma } from "@/lib/prisma/client";
import { SiteHeader, type PublicNavItem } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageBanner } from "@/components/public/page-banner";

export const metadata = {
  title: "Statistik",
  description: "Statistik Kepegawaian serta Laba Rugi & Pertumbuhan Aset PT Jamkrida Bali Mandara (Perseroda).",
};

// dynamic — data statistik dikelola via CMS admin (/admin/statistics)
export const dynamic = "force-dynamic";

const G_KEPEGAWAIAN = "Statistik Kepegawaian";
const G_LABA = "Laba Rugi";
const G_ASET = "Pertumbuhan Aset";

type Row = { year: string; value: number };

function toRows(items: { title: string; value: string }[]): Row[] {
  return items
    .map((s) => ({ year: s.title, value: Number(s.value) || 0 }))
    .sort((a, b) => a.year.localeCompare(b.year));
}

function StatChart({ rows, unit }: { rows: Row[]; unit: string }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div>
      {/* Grafik batang (CSS murni, ringan) */}
      <div className="flex h-56 items-end justify-center gap-4 rounded-t-xl border border-b-0 border-neutral-200 bg-neutral-50/60 px-6 pt-6">
        {rows.map((r) => (
          <div key={r.year} className="group flex h-full w-14 flex-col items-center justify-end">
            <span className="mb-1 text-xs font-bold text-brand opacity-0 transition group-hover:opacity-100">
              {r.value}
            </span>
            <div
              className="w-full rounded-t-md bg-brand/80 transition-all duration-300 group-hover:bg-brand"
              style={{ height: `${Math.max((r.value / max) * 100, 4)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 rounded-b-xl border border-neutral-200 bg-white px-6 py-3">
        {rows.map((r) => (
          <span key={r.year} className="w-14 text-center text-xs font-semibold text-neutral-600">
            {r.year}
          </span>
        ))}
      </div>
      {unit ? (
        <p className="mt-2 text-center text-xs text-neutral-400">Satuan: {unit}</p>
      ) : null}

      {/* Tabel data */}
      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand text-left text-white">
              <th className="px-5 py-3 font-semibold">Tahun</th>
              <th className="px-5 py-3 text-right font-semibold">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.year} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                <td className="px-5 py-2.5 font-medium text-neutral-800">{r.year}</td>
                <td className="px-5 py-2.5 text-right text-neutral-700">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function StatistikPage() {
  const [navItems, settings, statistics] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.siteSetting.findMany(),
    prisma.statistic.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
  ]);

  const nav: PublicNavItem[] = navItems.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    children: item.children.map((c) => ({ id: c.id, title: c.title, url: c.url })),
  }));

  const siteSettings = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const byGroup = (g: string) =>
    toRows(statistics.filter((s) => (s.description ?? "") === g));

  const kepegawaian = byGroup(G_KEPEGAWAIAN);
  const laba = byGroup(G_LABA);
  const aset = byGroup(G_ASET);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader navItems={nav} />
      <PageBanner title="Statistik" breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Statistik" }]} />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
          {/* ===== Statistik Kepegawaian ===== */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 lg:text-3xl">
              Statistik Kepegawaian
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              PT Jamkrida Bali Mandara (Perseroda)
            </p>
            <div className="mt-4 h-1 w-full rounded bg-brand" />
            <div className="mt-8">
              {kepegawaian.length === 0 ? (
                <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
                  <p className="text-neutral-500">Belum ada data statistik kepegawaian</p>
                </div>
              ) : (
                <StatChart rows={kepegawaian} unit="jumlah pegawai" />
              )}
            </div>
          </section>

          {/* ===== Statistik Laba Rugi & Pertumbuhan Aset ===== */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-neutral-900 lg:text-3xl">
              Statistik Laba Rugi &amp; Pertumbuhan Aset
            </h2>
            <p className="mt-1 text-sm text-neutral-500">PT Jamkrida Bali Mandara (Perseroda)</p>
            <div className="mt-4 h-1 w-full rounded bg-brand" />

            <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-center text-base font-bold text-neutral-800">
                  Laba Rugi
                </h3>
                {laba.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
                    Belum ada data
                  </div>
                ) : (
                  <StatChart rows={laba} unit="Rp miliar" />
                )}
              </div>
              <div>
                <h3 className="mb-4 text-center text-base font-bold text-neutral-800">
                  Pertumbuhan Aset
                </h3>
                {aset.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
                    Belum ada data
                  </div>
                ) : (
                  <StatChart rows={aset} unit="Rp miliar" />
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  );
}
