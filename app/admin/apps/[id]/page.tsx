import Link from "next/link";
import { notFound } from "next/navigation";
import AppForm from "@/components/admin/AppForm";
import FlowList from "@/components/admin/FlowList";
import { requireAdmin } from "@/lib/admin";
import { AppJourney } from "@/components/admin/Steps";
import { adminAppProgress, adminApps } from "@/lib/admin-queries";
import { appJourney } from "@/lib/admin-journey";

export default async function AdminAppPage({ params }: PageProps<"/admin/apps/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [app, all] = await Promise.all([adminAppProgress(Number(id)), adminApps()]);
  if (!app) notFound();
  const live = app.screens.some((s) => s.status === "live");

  return (
    <main className="admin-main">
      <header className="admin-head">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/admin">Admin</Link>
          <span>/</span>
          <Link href="/admin/apps">Apps</Link>
          <span>/</span>
          <strong>{app.name}</strong>
        </nav>
        <div className="admin-head-row">
          <h1>{app.name}</h1>
          {live && (
            <Link href={`/screens/${app.slug}`} className="tool-btn" target="_blank">
              <span>View on site</span>
            </Link>
          )}
        </div>
        <p className="admin-lead">{app.tagline || "No tagline yet."}</p>
      </header>

      <AppJourney steps={appJourney(app)} done={live ? { href: `/screens/${app.slug}`, label: "View on site" } : undefined} />

      <section id="flow" className="admin-section">
        <h2>
          Flow <span className="detail-h2-sub">· {app.screens.length} {app.screens.length === 1 ? "screen" : "screens"}</span>
        </h2>
        <FlowList appId={app.id} screens={app.screens} />
      </section>

      <section id="details" className="admin-section">
        <h2>Details</h2>
        <AppForm
          key={app.id}
          app={{ id: app.id, name: app.name, slug: app.slug, category: app.category, accent: app.accent, tagline: app.tagline, logoId: app.logoId }}
          categories={[...new Set(all.map((a) => a.category))]}
        />
      </section>
    </main>
  );
}
