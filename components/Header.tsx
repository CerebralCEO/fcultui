"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { BookmarkIcon, SearchIcon } from "./icons";
import { useApp } from "./Providers";
import MobileMenu from "./MobileMenu";
import { site } from "@/lib/site";
import type { SearchMode } from "@/lib/data";

const left = [
  { href: "/screens", label: "Screens" },
  { href: "/explore", label: "Explore" },
  { href: "/tools", label: "Tools" },
];

export const modeForPath = (p: string): SearchMode =>
  p.startsWith("/explore") ? "templates" : p.startsWith("/tools") ? "tools" : "screens";

export default function Header() {
  const pathname = usePathname();
  const { openSearch, bookmarks } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  // Explore is immersive: it draws its own floating bar
  if (pathname.startsWith("/explore")) return null;

  return (
    <>
      <motion.header
        className="header"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="header-inner">
          <button className="mobile-menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <span className="mobile-menu-button-icon">
              <span />
              <span />
            </span>
          </button>

          <div className="header-menu-left">
            <ul className="menu">
              {left.map((l) => (
                <li key={l.href} className={pathname.startsWith(l.href) ? "current" : undefined}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="header-menu-center">
            <ul className="menu">
              <li>
                <Link href="/">{site.name}</Link>
              </li>
            </ul>
          </div>

          <div className="header-menu-right">
            <ul className="menu">
              <li id="menu-item-search">
                <button onClick={() => openSearch(modeForPath(pathname))}>
                  <SearchIcon />
                  <span>Search</span>
                </button>
              </li>
              <li className={pathname.startsWith("/about") ? "current" : undefined}>
                <Link href="/about">About</Link>
              </li>
              <li className="cta">
                <Link href="/about">Submit</Link>
              </li>
              <li id="menu-item-bookmarks">
                <Link href="/" aria-label="Bookmarks">
                  <BookmarkIcon />
                  <span>Bookmarks</span>
                  {bookmarks.length > 0 && (
                    <motion.em
                      id="header-menu-bookmarks-count"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    />
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
