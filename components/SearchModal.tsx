"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { slug, toolsMenu, tools, type SearchMode } from "@/lib/data";
import type { Screen } from "@/lib/content-types";
import { ChevronsUpDownIcon, CloseIcon, DotsIcon, SearchIcon } from "./icons";
import { useApp } from "./Providers";
import FadeImg from "./FadeImg";

const ease = [0.16, 1, 0.3, 1] as const;
const modes: SearchMode[] = ["screens", "templates", "tools"];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const base = (m: SearchMode) => (m === "templates" ? "/explore" : `/${m}`);

type Result = { title: string; thumb?: string; swatch?: string; meta?: string; href?: string };

type Menu = { label: string; items: [name: string, count: number][] };

/** Category menus built from live content (screens: apps per category, explore: screens per category). */
function contentMenus(screens: Screen[]): Record<SearchMode, Menu> {
  const count = (weight: (s: Screen) => number) => {
    const m = new Map<string, number>();
    screens.forEach((s) => m.set(s.category, (m.get(s.category) ?? 0) + weight(s)));
    return [...m].sort(([a], [b]) => a.localeCompare(b));
  };
  return {
    screens: { label: "Categories", items: count(() => 1) },
    templates: { label: "Categories", items: count((s) => s.flow.length) },
    tools: toolsMenu,
  };
}

function resultsFor(mode: SearchMode, q: string, screens: Screen[]): Result[] {
  const has = (s: string) => s.toLowerCase().includes(q);
  if (mode === "screens")
    return screens
      .filter((s) => has(s.title) || has(s.category) || has(s.tagline))
      .map((s) => ({ title: s.title, swatch: s.accent, meta: s.category, href: `/screens/${s.slug}` }));
  if (mode === "templates")
    return screens.flatMap((s) =>
      s.flow
        .map((step, i) => ({ step, i }))
        .filter(({ step }) => has(step.title) || has(step.label) || has(s.category))
        .map(({ step, i }) => ({
          title: step.title,
          swatch: s.accent,
          meta: `${s.title} · ${step.label}`,
          href: i === 0 ? `/screens/${s.slug}` : `/screens/${s.slug}?screen=${i}`,
        })),
    );
  return tools.filter((t) => has(t.title) || has(t.category)).map((t) => ({ title: t.title, thumb: t.icon, meta: t.category }));
}

export default function SearchModal({ screens }: { screens: Screen[] }) {
  const { searchOpen, closeSearch, searchMode, openSearch } = useApp();
  const [query, setQuery] = useState("");
  const [modeMenu, setModeMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state each time the modal closes
  useEffect(() => {
    if (!searchOpen) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setQuery("");
      setModeMenu(false);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (modeMenu) setModeMenu(false);
        else closeSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("scroll-disabled");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("scroll-disabled");
    };
  }, [searchOpen, modeMenu, closeSearch]);

  const q = query.trim().toLowerCase();
  const menus = useMemo(() => contentMenus(screens), [screens]);
  const menu = menus[searchMode];
  const tagHits = useMemo(() => (q ? menu.items.filter(([n]) => n.toLowerCase().includes(q)) : []), [q, menu]);
  const postHits = useMemo(() => (q ? resultsFor(searchMode, q, screens) : []), [q, searchMode, screens]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          id="filters-panel"
          className={`modal${q ? " has-search-results" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => e.target === e.currentTarget && closeSearch()}
        >
          <div className="modal-close">
            <button className="modal-close-button" onClick={closeSearch} aria-label="Close search">
              <kbd className="modal-esc-label">ESC</kbd>
              <CloseIcon />
            </button>
          </div>

          <motion.div
            className="modal-inner"
            onMouseDown={(e) => e.target === e.currentTarget && closeSearch()}
            initial={{ y: 30, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.98, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.9 }}
            onAnimationComplete={() => inputRef.current?.focus()}
          >
            <div id="filters-panel-inner">
              <div className="filters-panel-search">
                <div className="filters-panel-search-inner">
                  <SearchIcon />
                  <input
                    ref={inputRef}
                    type="text"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search ${searchMode}…`}
                    aria-label={`Search ${searchMode}`}
                  />
                  <button id="filters-panel-search-clear" aria-label="Clear search" onClick={() => setQuery("")}>
                    <CloseIcon />
                  </button>
                  <div className="search-mode-wrap">
                    <button
                      id="filters-panel-search-mode-button"
                      className={modeMenu ? "active" : undefined}
                      onClick={() => setModeMenu((v) => !v)}
                      aria-expanded={modeMenu}
                    >
                      <span>{cap(searchMode)}</span>
                      <ChevronsUpDownIcon />
                      <DotsIcon />
                    </button>
                    <AnimatePresence>
                      {modeMenu && (
                        <motion.div
                          id="filters-panel-search-mode-panel"
                          initial={{ opacity: 0, y: -6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.96 }}
                          transition={{ duration: 0.25, ease }}
                          style={{ transformOrigin: "top right" }}
                        >
                          {modes.map((m) => (
                            <button
                              key={m}
                              className={m === searchMode ? "active" : undefined}
                              onClick={() => {
                                openSearch(m);
                                setModeMenu(false);
                                inputRef.current?.focus();
                              }}
                            >
                              <span>{cap(m)}</span>
                              {m === searchMode && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="filters-menu-wrapper">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.ul
                    key={`${searchMode}-${q ? "q" : "list"}`}
                    className="filters-menu"
                    data-lenis-prevent
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    {!q ? (
                      <>
                        <li>
                          <strong>
                            <span>{menu.label}</span>
                          </strong>
                        </li>
                        {menu.items.map(([name, count], i) => (
                          <motion.li
                            key={name}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(i, 14) * 0.018, duration: 0.5, ease }}
                          >
                            <Link href={`${base(searchMode)}?tag=${slug(name)}`} onClick={closeSearch}>
                              <span>{name}</span>
                              <em>{count}</em>
                            </Link>
                          </motion.li>
                        ))}
                      </>
                    ) : (
                      <>
                        {tagHits.length > 0 && (
                          <li className="search-results-group">
                            <h3>{menu.label}</h3>
                            <ul className="search-results-list">
                              {tagHits.map(([name, count]) => (
                                <li key={name}>
                                  <Link href={`${base(searchMode)}?tag=${slug(name)}`} onClick={closeSearch}>
                                    <span>{name}</span>
                                    <em className="result-meta">{count}</em>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        )}
                        <li className="search-results-group">
                          <h3>{cap(searchMode)}</h3>
                          {postHits.length ? (
                            <ul className="search-results-list">
                              {postHits.map((r) => (
                                <li key={r.title}>
                                  <Link href={r.href ?? base(searchMode)} onClick={closeSearch}>
                                    <span className="search-result-thumb" style={r.swatch ? { background: r.swatch } : undefined}>
                                      {r.thumb && <FadeImg src={r.thumb} alt="" />}
                                    </span>
                                    <span>{r.title}</span>
                                    {r.meta && <em className="result-meta">{r.meta}</em>}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="search-results-group-empty">No results for “{query}”</p>
                          )}
                        </li>
                      </>
                    )}
                  </motion.ul>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
