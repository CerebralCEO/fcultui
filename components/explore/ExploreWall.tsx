"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import type { FlowStep, Screen } from "@/lib/content-types";
import { site } from "@/lib/site";
import { Device, SCREEN_W } from "../device/Device";
import ScreenView from "../device/ScreenView";
import { useApp } from "../Providers";
import { CloseIcon, LogoIcon, SearchIcon } from "../icons";

/* ------------------------------------------------------------------ */
/* Data: every screen of every flow becomes a tile                     */
/* ------------------------------------------------------------------ */

type Tile = {
  id: string;
  screen: Screen;
  step: FlowStep;
  title: string;
  href: string;
  /** Visible height of the 844-px canvas (full, tall crop, short crop). */
  crop: number;
  search: string;
};

const CROPS = [844, 700, 844, 540, 760, 844, 620];

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildTiles(screens: Screen[]): Tile[] {
  const tiles = screens.flatMap((s) =>
    s.flow.map((step, i) => {
      const title = i === 0 ? s.title : `${s.title} · ${step.label}`;
      return {
        id: `${s.slug}-${i}`,
        screen: s,
        step,
        title,
        href: i === 0 ? `/screens/${s.slug}` : `/screens/${s.slug}?screen=${i}`,
        crop: 844,
        search: `${title} ${step.title} ${s.category} ${s.tagline} ${step.label}`.toLowerCase(),
      };
    }),
  );
  // Deterministic shuffle so SSR and client agree, then a varied rhythm of crops
  const rand = mulberry32(7);
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles.map((t, i) => ({ ...t, crop: CROPS[i % CROPS.length] }));
}

/** Parallax: each column travels at its own pace. */
const SPEEDS = [1, 0.84, 1.14, 0.92, 1.08, 0.88, 1.12, 0.95, 1.05];

type Layout = {
  cols: number;
  colW: number;
  gap: number;
  scale: number;
  columns: Tile[][];
  /** Height of one repeat of each column (the track holds two). */
  heights: number[];
};

function computeLayout(width: number, height: number, tiles: Tile[]): Layout | null {
  if (!width || tiles.length === 0) return null;
  const gap = width < 640 ? 12 : width < 1100 ? 20 : 30;
  const cols = Math.max(2, Math.min(9, Math.round((width - gap) / 270)));
  const colW = (width - gap * (cols + 1)) / cols;
  const scale = colW / SCREEN_W;

  const columns: Tile[][] = Array.from({ length: cols }, () => []);
  tiles.forEach((t, i) => columns[i % cols].push(t));

  const tileH = (t: Tile) => t.crop * scale + gap;
  const heights = columns.map((col, c) => {
    // Too few tiles (e.g. a narrow search)? Borrow from the pool so every column overflows the viewport.
    let k = c;
    while (col.reduce((h, t) => h + tileH(t), 0) < height * 1.15) {
      col.push(tiles[k % tiles.length]);
      k += cols;
    }
    return col.reduce((h, t) => h + tileH(t), 0);
  });

  return { cols, colW, gap, scale, columns, heights };
}

/* ------------------------------------------------------------------ */
/* Tile                                                                */
/* ------------------------------------------------------------------ */

const WallTile = memo(function WallTile({
  tile,
  hoverKey,
  scale,
  width,
  playing,
  onHover,
  onClickCapture,
}: {
  tile: Tile;
  hoverKey: string;
  scale: number;
  width: number;
  playing: boolean;
  onHover: (key: string | null) => void;
  onClickCapture: (e: React.MouseEvent) => void;
}) {
  const { platform } = useApp();
  const h = tile.crop * scale;

  return (
    <Link
      href={tile.href}
      className={`wall-tile${playing ? " is-playing" : ""}`}
      style={{ width, height: h }}
      draggable={false}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(hoverKey)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onHover(null)}
      onClickCapture={onClickCapture}
      aria-label={`${tile.title} — ${tile.screen.tagline}`}
    >
      <div className="wall-tile-canvas" style={{ transform: `scale(${scale})` }}>
        <Device bare platform={platform} tone={tile.step.tone} playing={playing} accent={tile.screen.accent}>
          <ScreenView step={tile.step} />
        </Device>
      </div>
      <span className="wall-meta">
        <i className={tile.screen.logo ? "has-logo" : undefined} style={{ "--accent": tile.screen.accent } as React.CSSProperties}>
          {tile.screen.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tile.screen.logo} alt="" />
          ) : (
            tile.screen.title[0]
          )}
        </i>
        <span>
          <strong>{tile.title}</strong>
          <em>{tile.screen.category}</em>
        </span>
      </span>
    </Link>
  );
});

/* ------------------------------------------------------------------ */
/* Wall                                                                */
/* ------------------------------------------------------------------ */

export default function ExploreWall({ screens }: { screens: Screen[] }) {
  const ALL_TILES = useMemo(() => buildTiles(screens), [screens]);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);

  // Motion state lives in refs — the ticker never re-renders React
  const motionState = useRef({ target: 0, current: 0, drift: 1, interacting: false, hovering: false });
  const drag = useRef({ active: false, startY: 0, startTarget: 0, lastY: 0, lastT: 0, velocity: 0, moved: 0 });

  const q = query.trim().toLowerCase();
  const tiles = useMemo(() => (q ? ALL_TILES.filter((t) => q.split(/\s+/).every((w) => t.search.includes(w))) : ALL_TILES), [q, ALL_TILES]);
  const layout = useMemo(() => computeLayout(size.w, size.h, tiles), [size, tiles]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!mounted) return;
    const measure = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mounted]);

  useEffect(() => {
    motionState.current.hovering = hovered !== null;
  }, [hovered]);

  /* ---- The infinite engine ---- */
  useEffect(() => {
    if (!layout) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DRIFT = reduce ? 0 : 26; // px / s of idle travel
    const phases = layout.heights.map((h, i) => (i % 2 ? h * 0.37 : h * 0.12) + i * 83);

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 64) / 1000;
      const m = motionState.current;
      // Idle drift eases out while the user interacts or hovers a tile, then eases back in
      const want = m.interacting || m.hovering ? 0 : 1;
      m.drift += (want - m.drift) * (1 - Math.pow(0.02, dt));
      m.target += DRIFT * m.drift * dt;
      // Frame-rate independent smoothing (Lenis-like)
      m.current += (m.target - m.current) * (1 - Math.pow(1 - 0.1, dt * 60));

      layout.heights.forEach((H, i) => {
        const el = tracks.current[i];
        if (!el) return;
        const travel = m.current * SPEEDS[i % SPEEDS.length] + phases[i];
        const y = -(((travel % H) + H) % H); // wraps both ways: scroll up forever, scroll down forever
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [layout]);

  /* ---- Entrance ---- */
  useEffect(() => {
    if (!layout || !wallRef.current) return;
    const cols = wallRef.current.querySelectorAll(".wall-col-reveal");
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        cols,
        { opacity: 0, y: (i) => (i % 2 ? -90 : 90), filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "expo.out", stagger: { each: 0.05, from: "center" }, clearProps: "filter" },
      );
    });
    return () => mm.revert();
    // Only on first layout / column-count change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout?.cols]);

  /* ---- Input: wheel, drag/touch, keyboard ---- */
  useEffect(() => {
    const el = wallRef.current;
    if (!el || !layout) return;
    const m = motionState.current;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      clearTimeout(idle);
      idle = setTimeout(() => (m.interacting = false), 900);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? window.innerHeight : 1;
      m.target += e.deltaY * unit;
      m.interacting = true;
      settle();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      const step = { ArrowDown: 120, ArrowUp: -120, PageDown: window.innerHeight * 0.8, PageUp: -window.innerHeight * 0.8, " ": window.innerHeight * 0.8 }[e.key];
      if (step === undefined) return;
      e.preventDefault();
      m.target += e.shiftKey && e.key === " " ? -step : step;
      m.interacting = true;
      settle();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      clearTimeout(idle);
    };
  }, [layout]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const d = drag.current;
    d.active = true;
    d.startY = d.lastY = e.clientY;
    d.startTarget = motionState.current.target;
    d.lastT = performance.now();
    d.velocity = 0;
    d.moved = 0;
    motionState.current.interacting = true;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    const now = performance.now();
    const dy = e.clientY - d.lastY;
    d.velocity = dy / Math.max(1, now - d.lastT);
    d.lastY = e.clientY;
    d.lastT = now;
    d.moved = Math.max(d.moved, Math.abs(e.clientY - d.startY));
    if (d.moved > 6) (e.currentTarget as HTMLElement).classList.add("is-dragging");
    motionState.current.target = d.startTarget - (e.clientY - d.startY) * 1.25;
  };
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    (e.currentTarget as HTMLElement).classList.remove("is-dragging");
    // Momentum
    motionState.current.target -= d.velocity * 420;
    setTimeout(() => (motionState.current.interacting = false), 900);
  };
  // A drag must never open a tile
  const onTileClickCapture = useCallback((e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  /* ---- Search shortcuts: "/" focuses the wall search (beats the global search modal) ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).tagName === "INPUT";
      if (e.key === "/" && !typing) {
        e.preventDefault();
        e.stopImmediatePropagation();
        searchRef.current?.focus();
      } else if (e.key === "Escape" && typing) {
        if (query) setQuery("");
        else searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [query]);

  if (!mounted) return <div className="wall" aria-busy />;

  return createPortal(
    <div className="wall" ref={wallRef}>
      <div
        className="wall-stage"
        style={layout ? ({ "--gap": `${layout.gap}px`, "--col-w": `${layout.colW}px` } as React.CSSProperties) : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {layout?.columns.map((col, c) => (
          <div key={`${layout.cols}-${c}`} className="wall-col">
            <div className="wall-col-reveal">
              <div className="wall-col-track" ref={(el) => void (tracks.current[c] = el)}>
                {[0, 1].map((rep) =>
                  col.map((t, i) => {
                    const key = `${rep}-${i}-${t.id}`;
                    return (
                      <WallTile
                        key={key}
                        tile={t}
                        hoverKey={key}
                        scale={layout.scale}
                        width={layout.colW}
                        playing={hovered === key}
                        onHover={setHovered}
                        onClickCapture={onTileClickCapture}
                      />
                    );
                  }),
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="wall-fade top" aria-hidden />
      <div className="wall-fade bottom" aria-hidden />

      <AnimatePresence>
        {!q && ALL_TILES.length === 0 && (
          <motion.div className="wall-empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <strong>No screens yet</strong>
            <span>New Flutter &amp; React Native screens are on their way.</span>
          </motion.div>
        )}
        {q && tiles.length === 0 && (
          <motion.div className="wall-empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <strong>No screens match “{query}”</strong>
            <span>Try “finance”, “dark”, “onboarding” or “chat”.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        className="wall-bar"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <Link href="/" className="wall-brand glass">
          <LogoIcon />
          <span>{site.name}</span>
        </Link>

        <label className={`wall-search glass${focused ? " is-focused" : ""}`}>
          <SearchIcon />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Try “dark finance”"
            aria-label="Search all screens"
          />
          {query ? (
            <span className="wall-count">{tiles.length}</span>
          ) : (
            <kbd>/</kbd>
          )}
        </label>

        <div className="wall-actions">
          <button className="wall-close glass" onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))} aria-label="Close explore">
            <CloseIcon />
          </button>
          <Link href="/screens" className="wall-cta">
            Get started
          </Link>
        </div>
      </motion.header>
    </div>,
    document.body,
  );
}
