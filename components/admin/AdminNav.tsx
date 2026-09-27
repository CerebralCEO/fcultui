"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { AdminApp } from "@/lib/admin-queries";
import { StatusBadge } from "./ui";

const I = ({ d }: { d: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const WORKSPACE = [
  { href: "/admin", label: "Dashboard", icon: <I d={<><rect x="3" y="3" width="7" height="9" rx="2" /><rect x="14" y="3" width="7" height="5" rx="2" /><rect x="14" y="12" width="7" height="9" rx="2" /><rect x="3" y="16" width="7" height="5" rx="2" /></>} /> },
  { href: "/admin/apps/new", label: "New app", icon: <I d={<><path d="M12 5v14" /><path d="M5 12h14" /></>} /> },
  { href: "/", label: "View site", icon: <I d={<><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>} /> },
];

const PILL = { type: "spring", stiffness: 500, damping: 40 } as const;

/** Admin rail — the same anatomy as the public screen rail (uppercase sections, tree guide, sliding pill). */
export default function AdminNav({ apps, me }: { apps: AdminApp[]; me: { name: string; email: string } }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const link = (href: string, children: React.ReactNode, className = "") => (
    <Link href={href} className={`nav-link ${className}${isActive(href) ? " active" : ""}`}>
      {isActive(href) && <motion.span layoutId="admin-pill" className="nav-pill" transition={PILL} />}
      {children}
    </Link>
  );

  return (
    <>
      <aside className="detail-sidebar">
        <div className="detail-sidebar-scroll" data-lenis-prevent>
          <div className="admin-owner">
            <span className="admin-owner-mark">{me.name[0]}</span>
            <span>
              <strong>{me.name}</strong>
              <em>{me.email}</em>
            </span>
          </div>

          <nav className="nav-section" aria-label="Workspace">
            <p className="nav-heading">Workspace</p>
            <ul>
              {WORKSPACE.map((w) => (
                <li key={w.href}>
                  {link(
                    w.href,
                    <>
                      <span className="nav-guide-icon">{w.icon}</span>
                      <span className="nav-title">{w.label}</span>
                    </>,
                    "nav-guide",
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <nav className="nav-section" aria-label="Apps">
            <p className="nav-heading">
              Apps <span>{apps.length}</span>
            </p>
            {apps.length === 0 && <p className="nav-empty">No apps yet.</p>}
            {apps.map((a) => (
              <div key={a.id} className="nav-group">
                <Link href={`/admin/apps/${a.id}`} className={`nav-category admin-app-link${isActive(`/admin/apps/${a.id}`) ? " active" : ""}`}>
                  <i className="admin-swatch" style={{ "--accent": a.accent } as React.CSSProperties} />
                  <span>{a.name}</span>
                  <em>{a.screens.length}</em>
                </Link>
                {a.screens.length > 0 && (
                  <ul className="nav-tree">
                    {a.screens.map((s) => (
                      <li key={s.id}>
                        {link(
                          `/admin/screens/${s.id}`,
                          <>
                            <span className="nav-title">{s.label}</span>
                            <StatusBadge status={s.status} />
                          </>,
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Phones / tablets: one swipeable row instead of the rail */}
      <nav className="admin-mobile-nav" aria-label="Admin">
        {WORKSPACE.slice(0, 2).map((w) => (
          <Link key={w.href} href={w.href} className={isActive(w.href) ? "active" : undefined}>
            {w.label}
          </Link>
        ))}
        {apps.map((a) => (
          <Link key={a.id} href={`/admin/apps/${a.id}`} className={isActive(`/admin/apps/${a.id}`) ? "active" : undefined}>
            {a.name}
          </Link>
        ))}
      </nav>
    </>
  );
}
