"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { deleteApp } from "@/app/admin/actions";
import { ArrowUpRightIcon, SearchIcon } from "../icons";
import { logoUrl } from "./LogoPicker";
import { ConfirmButton, StatusBadge, useToast } from "./ui";

export type AppRow = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  accent: string;
  logoId: number | null;
  screens: number;
  live: number;
  /** Latest edit to the app or any of its screens (ISO). */
  updatedAt: string;
};

type SortKey = "name" | "category" | "screens" | "updatedAt";

const ease = [0.16, 1, 0.3, 1] as const;

const ago = (iso: string) => {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  const units: [number, string][] = [[31536000, "y"], [2592000, "mo"], [86400, "d"], [3600, "h"], [60, "m"]];
  for (const [n, u] of units) if (s >= n) return `${Math.floor(s / n)}${u} ago`;
  return "just now";
};

const SortIcon = ({ dir }: { dir: 1 | -1 | 0 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m7 10 5-5 5 5" opacity={dir === -1 ? 0.3 : 1} />
    <path d="m7 14 5 5 5-5" opacity={dir === 1 ? 0.3 : 1} />
  </svg>
);

/** Every app in one table: search, filter by category, sort, and view / edit / delete per row. */
export default function AppsTable({ rows }: { rows: AppRow[] }) {
  const router = useRouter();
  const { toast, show } = useToast();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "updatedAt", dir: -1 });
  const [removed, setRemoved] = useState<Set<number>>(() => new Set());
  const [busyId, setBusyId] = useState<number | null>(null);
  const [, start] = useTransition();

  const categories = useMemo(() => ["All", ...[...new Set(rows.map((r) => r.category))].sort()], [rows]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows
      .filter((r) => !removed.has(r.id))
      .filter((r) => category === "All" || r.category === category)
      .filter((r) => !needle || `${r.name} ${r.slug} ${r.tagline} ${r.category}`.toLowerCase().includes(needle))
      .sort((a, b) => {
        const x = a[sort.key], y = b[sort.key];
        const c = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
        return c * sort.dir;
      });
  }, [rows, q, category, sort, removed]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === "updatedAt" || key === "screens" ? -1 : 1 }));

  const remove = (row: AppRow) => {
    setBusyId(row.id);
    start(async () => {
      const r = await deleteApp(row.id);
      setBusyId(null);
      if (!r.ok) return show(r.error, "error");
      setRemoved((s) => new Set(s).add(row.id));
      show(`Deleted ${row.name}`);
      router.refresh();
    });
  };

  const th = (key: SortKey, label: string, className = "") => (
    <th className={className} aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button type="button" className={`admin-sort${sort.key === key ? " active" : ""}`} onClick={() => toggleSort(key)}>
        {label}
        <SortIcon dir={sort.key === key ? sort.dir : 0} />
      </button>
    </th>
  );

  return (
    <div className="admin-table-block">
      <div className="admin-table-bar">
        <label className="nav-filter">
          <SearchIcon />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search apps" aria-label="Search apps" />
          <kbd>{visible.length}</kbd>
        </label>
        <div className="tags-menu admin-cats" role="tablist" aria-label="Category">
          {categories.map((c) => (
            <button key={c} type="button" role="tab" aria-selected={category === c} className={category === c ? "active" : undefined} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="props-wrap admin-table-wrap">
        <table className="props admin-table">
          <thead>
            <tr>
              {th("name", "App")}
              {th("category", "Category")}
              {th("screens", "Screens", "num")}
              <th>Status</th>
              {th("updatedAt", "Updated")}
              <th className="actions">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {visible.map((r) => (
                <motion.tr
                  key={r.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3, ease }}
                >
                  <td data-label="App">
                    <Link href={`/admin/apps/${r.id}`} className="admin-table-app">
                      <span className={`app-icon${r.logoId ? " has-logo" : ""}`} style={{ "--accent": r.accent } as React.CSSProperties}>
                        {r.logoId ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logoUrl(r.logoId)} alt="" />
                        ) : (
                          r.name[0]
                        )}
                      </span>
                      <span>
                        <strong>{r.name}</strong>
                        <em>/{r.slug}</em>
                      </span>
                    </Link>
                  </td>
                  <td data-label="Category">{r.category}</td>
                  <td data-label="Screens" className="num">
                    {r.live}
                    <span className="admin-muted"> / {r.screens}</span>
                  </td>
                  <td data-label="Status">
                    <StatusBadge status={r.live > 0 ? "live" : "draft"} />
                  </td>
                  <td data-label="Updated" className="admin-muted">
                    <time dateTime={r.updatedAt}>{ago(r.updatedAt)}</time>
                  </td>
                  <td className="actions">
                    <span className="admin-row-actions">
                      {r.live > 0 && (
                        <Link href={`/screens/${r.slug}`} className="tool-btn" target="_blank" aria-label={`View ${r.name} on the site`}>
                          <ArrowUpRightIcon />
                        </Link>
                      )}
                      <Link href={`/admin/apps/${r.id}`} className="tool-btn">
                        Edit
                      </Link>
                      <ConfirmButton label="Delete" confirm="Confirm" busy={busyId === r.id} onConfirm={() => remove(r)} />
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className="admin-empty-line admin-table-empty">
            {rows.length === 0 ? "No apps yet." : q ? `No apps match “${q}”.` : "No apps in this category."}
          </p>
        )}
      </div>
      {toast}
    </div>
  );
}
