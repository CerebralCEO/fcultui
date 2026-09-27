import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import { adminProfile, requireAdmin } from "@/lib/admin";
import { adminApps } from "@/lib/admin-queries";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Admin – ${site.name}`,
  robots: { index: false, follow: false },
};

/** Owner-only workspace. Anyone else (signed out or not in ADMIN_USER_IDS) gets a 404. */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  const [apps, me] = await Promise.all([adminApps(), adminProfile()]);
  return (
    <div className="detail admin">
      <AdminNav apps={apps} me={me} />
      <div className="detail-body admin-body">{children}</div>
    </div>
  );
}
