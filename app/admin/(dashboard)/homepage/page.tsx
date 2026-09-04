import { prisma } from "@/lib/prisma/client";
import { parseSectionContent } from "@/lib/section-content";
import { editableSections } from "@/lib/section-cms";
import {
  HeroSlideManager,
  type HeroSlide,
} from "@/components/admin/hero-slide-manager";
import { EnhancedNewsManager } from "@/components/admin/enhanced-news-manager";
import { EnhancedPartnersManager } from "@/components/admin/enhanced-partners-manager";
import { EditableSectionManager, type SectionRow } from "@/components/admin/editable-section-manager";

export const metadata = { title: "Homepage" };

export default async function HomepageAdminPage() {
  const [slides, sections] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
    prisma.homepageSection.findMany({ orderBy: { order: "asc" } }),
  ]);

  const serializedSlides: HeroSlide[] = slides.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    description: s.description,
    backgroundUrl: s.backgroundUrl,
    overlayColor: s.overlayColor,
    overlayOpacity: s.overlayOpacity,
    ctaLabel: s.ctaLabel,
    ctaUrl: s.ctaUrl,
    ctaLabelSecondary: s.ctaLabelSecondary,
    ctaUrlSecondary: s.ctaUrlSecondary,
    order: s.order,
    isActive: s.isActive,
  }));

  const sectionRows: SectionRow[] = editableSections
    .map((meta) => {
      const row = sections.find((s) => s.key === meta.key);
      return {
        id: row?.id ?? "",
        key: meta.key,
        label: meta.label,
        isActive: row?.isActive ?? true,
        content: parseSectionContent(meta.key, row?.content),
      };
    })
    .filter((s) => s.id !== "");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Homepage</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Kelola hero carousel, konten berita & mitra, dan edit langsung seksi homepage dengan upload gambar & text items.
        </p>
      </div>

      <div className="border-b border-neutral-200 pb-8">
        <HeroSlideManager slides={serializedSlides} />
      </div>

      <div className="border-b border-neutral-200 pb-8">
        <EnhancedNewsManager />
      </div>

      <div className="border-b border-neutral-200 pb-8">
        <EnhancedPartnersManager />
      </div>

      <div>
        <EditableSectionManager sections={sectionRows} />
      </div>
    </div>
  );
}
