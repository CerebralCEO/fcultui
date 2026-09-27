"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookmarkIcon, CloseIcon, MoonIcon, SunIcon } from "./icons";
import { useApp } from "./Providers";
import { modeForPath } from "./Header";

const ease = [0.16, 1, 0.3, 1] as const;

const main = [
  { href: "/websites", label: "Websites" },
  { href: "/templates", label: "Templates" },
  { href: "/tools", label: "Tools" },
];
const site = [
  { href: "/about", label: "About" },
  { href: "/about", label: "Submit" },
  { href: "/about", label: "Sponsorship" },
  { href: "/about", label: "Contact" },
];

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { theme, setTheme, openSearch } = useApp();

  // Close on navigation (runs only when the path actually changes)
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <div className="mobile-menu-inner">
            <motion.div
              className="mobile-menu-panel"
              onClick={(e) => e.stopPropagation()}
              initial={{ x: 30, opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 30, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="mobile-menu-header">
                <Link href="/" className="mobile-menu-bookmarks-button">
                  <BookmarkIcon />
                  Bookmarks
                </Link>
                <span className="divider" />
                <button
                  className="search-link"
                  onClick={() => {
                    onClose();
                    openSearch(modeForPath(pathname));
                  }}
                >
                  Search
                </button>
                <button id="mobile-menu-close-button" aria-label="Close menu" onClick={onClose}>
                  <CloseIcon />
                </button>
              </div>

              <div className="mobile-menu-body" data-lenis-prevent>
                <nav className="mobile-menu-main">
                  <ul className="menu">
                    {main.map((l, i) => (
                      <motion.li
                        key={l.href}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.05, duration: 0.6, ease }}
                      >
                        <Link href={l.href}>{l.label}</Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
                <div className="mobile-menu-site">
                  <div className="mobile-menu-secondary">
                    <span className="label">Site</span>
                    <ul className="menu">
                      {site.map((l) => (
                        <li key={l.label}>
                          <Link href={l.href}>{l.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mobile-menu-footer" style={{ marginTop: "calc(var(--page--spacing) * 1.5)" }}>
                    <span>Theme</span>
                    <button id="mobile-menu-theme-button" aria-label="Toggle theme">
                      <strong className={theme === "dark" ? "active" : ""} onClick={() => setTheme("dark")}>
                        <MoonIcon />
                      </strong>
                      <strong className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")}>
                        <SunIcon />
                      </strong>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
