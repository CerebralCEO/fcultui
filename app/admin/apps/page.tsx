import Link from "next/link";
import AppsTable, { type AppRow } from "@/components/admin/AppsTable";
import { requireAdmin } from "@/lib/admin";
import { adminApps } from "@/lib/admin-queries";

export default async function AdminAppsPage() {
  await requireAdmin();
  const apps = await adminApps();

  const rows: AppRow[] = apps.map((a) => {
    const latest = Math.max(a.updatedAt.getTime(), ...a.screens.map((s) => s.updatedAt.getTime()));
    return {
      id: a.id,
      slug: a.slug,
      name: a.name,
      tagline: a.tagline,
      category: a.category,
      accent: a.accent,
      logoId: a.logoId,
      screens: a.screens.length,
      live: a.screens.filter((s) => s.status === "live").length,
      updatedAt: new Date(latest).toISOString(),
    };
  });

  return (
    <main className="admin-main wide">
      <header className="admin-head">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/admin">Admin</Link>
          <span>/</span>
          <strong>Apps</strong>
        </nav>
        <div className="admin-head-row">
          <h1>Apps</h1>
          <Link href="/admin/apps/new" className="admin-primary sm">
            New app
          </Link>
        </div>
        <p className="admin-lead">Every app in the gallery. Open one to edit its details and flow, or delete it here.</p>
      </header>

      {rows.length === 0 ? (
        <div className="admin-card admin-empty">
          <strong>No apps yet</strong>
          <p>An app is one card in the gallery. Create one, then add its screens.</p>
          <Link href="/admin/apps/new" className="admin-primary sm">
            Create your first app
          </Link>
        </div>
      ) : (
        <AppsTable rows={rows} />
      )}
    </main>
  );
}
