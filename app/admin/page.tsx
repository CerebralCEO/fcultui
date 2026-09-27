import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { adminApps, adminRecentScreens } from "@/lib/admin-queries";
import { StatusBadge } from "@/components/admin/ui";
import { ArrowRightIcon } from "@/components/icons";

const ago = (d: Date) => {
  const s = Math.max(1, Math.round((Date.now() - d.getTime()) / 1000));
  const units: [number, string][] = [[31536000, "y"], [2592000, "mo"], [86400, "d"], [3600, "h"], [60, "m"]];
  for (const [n, u] of units) if (s >= n) return `${Math.floor(s / n)}${u} ago`;
  return "just now";
};

export default async function AdminDashboard() {
  await requireAdmin();
  const [apps, recent] = await Promise.all([adminApps(), adminRecentScreens()]);
  const all = apps.flatMap((a) => a.screens);
  const stats = [
    { label: "Apps", value: apps.length },
    { label: "Screens", value: all.length },
    { label: "Live", value: all.filter((s) => s.status === "live").length },
    { label: "Drafts", value: all.filter((s) => s.status === "draft").length },
  ];

  return (
    <main className="admin-main">
      <header className="admin-head">
        <p className="admin-kicker">Admin</p>
        <div className="admin-head-row">
          <h1>Dashboard</h1>
          <Link href="/admin/apps/new" className="admin-primary sm">
            New app
          </Link>
        </div>
        <p className="admin-lead">Create an app, add its screens, paste the Flutter and React Native code, then publish.</p>
      </header>

      <section className="admin-stats">
        {stats.map((s) => (
          <div key={s.label} className="admin-card admin-stat">
            <span>{s.label}</span>
            <strong>{s.value}</strong>
          </div>
        ))}
      </section>

      <section className="admin-section">
        <h2>Recently edited</h2>
        {recent.length === 0 ? (
          <div className="admin-card admin-empty">
            <strong>No screens yet</strong>
            <p>Start with an app — it becomes one card in the gallery, and its screens become the flow.</p>
            <Link href="/admin/apps/new" className="admin-primary sm">
              Create your first app
            </Link>
          </div>
        ) : (
          <ul className="admin-card admin-list">
            {recent.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/screens/${s.id}`} className="admin-list-row">
                  <i className={`admin-swatch${s.app.logoId ? " has-logo" : ""}`} style={{ "--accent": s.app.accent } as React.CSSProperties}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {s.app.logoId && <img src={`/api/logos/${s.app.logoId}`} alt="" />}
                  </i>
                  <span className="admin-list-text">
                    <strong>{s.title}</strong>
                    <span>
                      {s.app.name} · {s.label}
                    </span>
                  </span>
                  <StatusBadge status={s.status} />
                  <time dateTime={s.updatedAt.toISOString()}>{ago(s.updatedAt)}</time>
                  <ArrowRightIcon />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
