"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { SearchMode } from "@/lib/data";
import type { Platform } from "./device/Device";

type Theme = "dark" | "light";
export type Framework = "flutter" | "rn";

type Ctx = {
  searchOpen: boolean;
  searchMode: SearchMode;
  openSearch: (mode?: SearchMode) => void;
  closeSearch: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  platform: Platform;
  setPlatform: (p: Platform) => void;
  framework: Framework;
  setFramework: (f: Framework) => void;
};

const AppContext = createContext<Ctx | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <Providers>");
  return ctx;
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("screens");
  const [theme, setThemeState] = useState<Theme>("dark");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [platform, setPlatformState] = useState<Platform>("ios");
  const [framework, setFrameworkState] = useState<Framework>("flutter");

  // Hydrate persisted state after mount (the inline script in layout already set the html class)
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setThemeState(document.documentElement.classList.contains("light") ? "light" : "dark");
    setBookmarks(read<string[]>("mg-bookmarks", []));
    setPlatformState(read<Platform>("mg-platform", "ios"));
    setFrameworkState(read<Framework>("mg-framework", "flutter"));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setTheme = useCallback((t: Theme) => {
    const html = document.documentElement;
    // Kill transitions for a frame so every token swaps at once (same trick as the original site)
    html.classList.add("no-transitions");
    html.classList.toggle("light", t === "light");
    write("mg-theme", t);
    setThemeState(t);
    requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove("no-transitions")));
  }, []);

  const toggleTheme = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

  const setPlatform = useCallback((p: Platform) => {
    write("mg-platform", p);
    setPlatformState(p);
  }, []);

  const setFramework = useCallback((f: Framework) => {
    write("mg-framework", f);
    document.documentElement.dataset.fw = f;
    setFrameworkState(f);
  }, []);

  const openSearch = useCallback((mode?: SearchMode) => {
    if (mode) setSearchMode(mode);
    setSearchOpen(true);
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      write("mg-bookmarks", next);
      return next;
    });
  }, []);

  // Global shortcuts: Alt+M theme, "/" or Cmd/Ctrl+K search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (e.altKey && e.code === "KeyM") {
        e.preventDefault();
        toggleTheme();
      } else if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleTheme]);

  const value = useMemo(
    () => ({
      searchOpen, searchMode, openSearch, closeSearch, theme, setTheme, toggleTheme,
      bookmarks, toggleBookmark, platform, setPlatform, framework, setFramework,
    }),
    [
      searchOpen, searchMode, openSearch, closeSearch, theme, setTheme, toggleTheme,
      bookmarks, toggleBookmark, platform, setPlatform, framework, setFramework,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
