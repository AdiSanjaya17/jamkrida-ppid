import { prisma } from "@/lib/prisma/client";
import { SettingsManager, type SettingRow } from "@/components/admin/settings-manager";

export const metadata = { title: "Pengaturan Situs" };

export default async function SettingsAdminPage() {
  const rows = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  const settings: SettingRow[] = rows.map((r) => ({ key: r.key, value: r.value }));
  return <SettingsManager settings={settings} />;
}
