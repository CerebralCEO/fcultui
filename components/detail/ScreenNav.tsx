"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls, type PanInfo } from "framer-motion";
import { screens, type Screen } from "@/lib/data";
import { site } from "@/lib/site";
import { ArrowRightIcon, CloseIcon, LockIcon, SearchIcon } from "../icons";
import { getLenis } from "../SmoothScroll";

const GUIDE = [
  { href: "/about", label: "Introduction" },
  { href: "/screens", label: "All screens" },
  { href: "/templates", label: "App kits" },
  { href: "/tools", label: "Tools" },
];

function groupByCategory(list: Screen[]) {
  const groups = new Map<string, Screen[]>();
  for (const s of list) groups.set(s.category, [...(groups.get(s.category) ?? []), s]);
  return [...groups];
}

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="2" />
    <rect x="14" y="3" width="7" height="7" rx="2" />
    <rect x="3" y="14" width="7" height="7" rx="2" />
    <rect x="14" y="14" width="7" height="7" rx="2" />
  </svg>
);

/**
 * The screen list shared by the desktop rail and the mobile sheet.
 * `pillId` scopes the sliding active pill — the rail lives in a persistent layout, so the pill glides
 * from item to item as you navigate.
 */
function ScreenList({ active, pillId, onNavigate }: { active: string; pillId: string; onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const groups = useMemo(
    () => groupByCategory(q ? screens.filter((s) => `${s.title} ${s.category} ${s.tagline}`.toLowerCase().includes(q)) : screens),
    [q],
  );

  return (
    <>
      <label className="nav-filter">
        <SearchIcon />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter screens" aria-label="Filter screens" />
        {query ? (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear filter">
            ×
          </button>
        ) : (
          <kbd>{screens.length}</kbd>
        )}
      </label>

      {!q && (
        <div className="nav-section">
          <p className="nav-heading">Get started</p>
          <ul>
            {GUIDE.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="nav-link" onClick={onNavigate}>
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="nav-section">
        <p className="nav-heading">Screens</p>
        {groups.length === 0 && <p className="nav-empty">No screens match “{query}”.</p>}
        {groups.map(([category, items]) => (
          <div key={category} className="nav-group">
            <p className="nav-category">{category}</p>
            <ul>
              {items.map((s) => {
                const isActive = s.slug === active;
                return (
                  <li key={s.slug}>
                    <Link
                      href={`/screens/${s.slug}`}
                      className={`nav-link${isActive ? " active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      data-active={isActive || undefined}
                      onClick={onNavigate}
                    >
                      {isActive && (
                        <motion.span layoutId={pillId} className="nav-pill" transition={{ type: "spring", stiffness: 420, damping: 38 }} />
                      )}
                      <i className="nav-dot" style={{ background: s.accent }} />
                      <span className="nav-title">{s.title}</span>
                      {s.pro && (
                        <span className="nav-lock" title="All-Access">
                          <LockIcon />
                        </span>
                      )}
                      {s.badge && <em className={`nav-badge ${s.badge.toLowerCase()}`}>{s.badge}</em>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

function Promo() {
  return (
    <div className="side-promo">
      <div className="side-promo-art">
        <strong>All-Access</strong>
      </div>
      <p className="side-promo-title">Ship faster with {site.name}</p>
      <p className="side-promo-copy">Every screen and app kit, in Flutter and React Native, for a one-time payment.</p>
      <Link href="/about" className="side-promo-btn">
        Get All-Access
      </Link>
    </div>
  );
}

export default function ScreenNav() {
  const pathname = usePathname();
  const active = pathname.split("/")[2] ?? "";
  const index = screens.findIndex((s) => s.slug === active);
  const current = screens[index];
  const prev = index > 0 ? screens[index - 1] : undefined;
  const next = index >= 0 && index < screens.length - 1 ? screens[index + 1] : undefined;

  const railRef = useRef<HTMLDivElement>(null);
  const [sheet, setSheet] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drag = useDragControls();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Keep the active item in view (first load + when navigating from elsewhere)
  useEffect(() => {
    const el = railRef.current?.querySelector<HTMLElement>("[data-active]");
    const rail = railRef.current;
    if (!el || !rail) return;
    const top = el.offsetTop - rail.clientHeight / 2 + el.clientHeight / 2;
    if (el.offsetTop < rail.scrollTop + 60 || el.offsetTop > rail.scrollTop + rail.clientHeight - 60) {
      rail.scrollTo({ top, behavior: "smooth" });
    }
  }, [active]);

  // Sheet: freeze page scroll + ESC
  useEffect(() => {
    if (!sheet) return;
    getLenis()?.stop();
    document.body.classList.add("scroll-disabled");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      document.body.classList.remove("scroll-disabled");
      window.removeEventListener("keydown", onKey);
    };
  }, [sheet]);

  const onSheetDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) setSheet(false);
  };

  return (
    <>
      {/* ---------- Desktop rail ---------- */}
      <aside className="detail-sidebar">
        <div className="detail-sidebar-scroll" ref={railRef} data-lenis-prevent>
          <ScreenList active={active} pillId="rail-pill" />
          <Promo />
        </div>
      </aside>

      {/* ---------- Mobile bar ---------- */}
      <div className="screen-bar">
        <button className="screen-bar-main" onClick={() => setSheet(true)} aria-haspopup="dialog">
          <span className="screen-bar-icon">
            <GridIcon />
          </span>
          <span className="screen-bar-text">
            <em>{current?.category ?? "Screens"}</em>
            <strong>{current?.title ?? "Browse screens"}</strong>
          </span>
          <ChevronDown />
        </button>
        <div className="screen-bar-steps">
          {prev ? (
            <Link href={`/screens/${prev.slug}`} className="screen-bar-step prev" aria-label={`Previous: ${prev.title}`}>
              <ArrowRightIcon />
            </Link>
          ) : (
            <span className="screen-bar-step prev is-disabled" aria-hidden>
              <ArrowRightIcon />
            </span>
          )}
          {next ? (
            <Link href={`/screens/${next.slug}`} className="screen-bar-step" aria-label={`Next: ${next.title}`}>
              <ArrowRightIcon />
            </Link>
          ) : (
            <span className="screen-bar-step is-disabled" aria-hidden>
              <ArrowRightIcon />
            </span>
          )}
        </div>
      </div>

      {/* ---------- Mobile sheet (portalled: ancestors are transformed by page transitions) ---------- */}
      {mounted &&
        createPortal(
      <AnimatePresence>
        {sheet && (
          <motion.div
            className="screen-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSheet(false)}
          >
            <motion.div
              className="screen-sheet"
              role="dialog"
              aria-label="Browse screens"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%", transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              drag="y"
              dragControls={drag}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={onSheetDragEnd}
            >
              {/* Drag starts only from the handle so the list below scrolls freely */}
              <div className="screen-sheet-head" onPointerDown={(e) => drag.start(e)}>
                <div className="screen-sheet-grab" />
                <div className="screen-sheet-title">
                  <strong>Browse screens</strong>
                  <button onClick={() => setSheet(false)} aria-label="Close">
                    <CloseIcon />
                  </button>
                </div>
              </div>
              <div className="screen-sheet-scroll" data-lenis-prevent>
                <ScreenList active={active} pillId="sheet-pill" onNavigate={() => setSheet(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

/** Previous / next screen cards at the end of the article (docs-style pager). */
export function ScreenPager({ slug }: { slug: string }) {
  const i = screens.findIndex((s) => s.slug === slug);
  const prev = screens[i - 1];
  const next = screens[i + 1];
  return (
    <nav className="pager" aria-label="Screen pagination">
      {prev ? (
        <Link href={`/screens/${prev.slug}`} className="pager-card prev">
          <span>Previous</span>
          <strong>
            <ArrowRightIcon /> {prev.title}
          </strong>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={`/screens/${next.slug}`} className="pager-card next">
          <span>Next</span>
          <strong>
            {next.title} <ArrowRightIcon />
          </strong>
        </Link>
      )}
    </nav>
  );
}

