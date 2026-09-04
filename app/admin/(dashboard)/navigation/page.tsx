import { prisma } from "@/lib/prisma/client";
import {
  NavigationManager,
  type NavItem,
} from "@/components/admin/navigation-manager";

export const metadata = { title: "Manajemen Navigasi" };

export default async function NavigationPage() {
  const items = await prisma.navigationItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const serialized: NavItem[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    url: item.url,
    icon: item.icon,
    order: item.order,
    isActive: item.isActive,
    parentId: item.parentId,
  }));

  return <NavigationManager items={serialized} />;
}
