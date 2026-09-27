"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AppKit, Promo, Screen } from "@/lib/data";
import { BookmarkIcon, CheckIcon, CodeIcon, CopyIcon, FlutterIcon, LockIcon, ReactIcon } from "./icons";
import { useApp, type Framework } from "./Providers";
import { DeviceFan } from "./device/Device";
import ScreenCarousel from "./ScreenCarousel";
import { screenRegistry } from "./screens";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Preview playback: mouse hover on pointer devices, "centred in viewport" on touch devices.
 * Same trigger contract the future <video> previews will use (see docs/PLAN.md §2.1).
 */
function usePlayback<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: hover)").matches) return;
    const io = new IntersectionObserver(([e]) => setPlaying(e.isIntersecting), {
      rootMargin: "-35% 0px -35% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handlers = {
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setPlaying(true),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && setPlaying(false),
  };
  return { ref, playing, handlers };
}

/* ---------------- Tile controls ---------------- */

function BookmarkButton({ id }: { id: string }) {
  const { bookmarks, toggleBookmark } = useApp();
  const active = bookmarks.includes(id);
  return (
    <motion.button
      className={`tile-bar-icon bookmark-button${active ? " bookmarked" : ""}`}
      aria-label={active ? "Remove bookmark" : "Save"}
      aria-pressed={active}
      onClick={() => toggleBookmark(id)}
      whileTap={{ scale: 0.86 }}
      transition={{ type: "spring", stiffness: 600, damping: 20 }}
    >
      <BookmarkIcon />
    </motion.button>
  );
}

/** Flutter ⇄ React Native switch — global preference, shared with the code page. */
function FrameworkSwitch() {
  const { framework, setFramework } = useApp();
  const opts: { id: Framework; label: string; Icon: typeof FlutterIcon }[] = [
    { id: "flutter", label: "Flutter", Icon: FlutterIcon },
    { id: "rn", label: "RN", Icon: ReactIcon },
  ];
  return (
    <div className="fw-switch" data-fw={framework} role="radiogroup" aria-label="Framework">
      <span className="fw-pill" aria-hidden />
      {opts.map(({ id, label, Icon }) => (
        <button
          key={id}
          role="radio"
          aria-checked={framework === id}
          className={framework === id ? "active" : undefined}
          onClick={() => setFramework(id)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </div>
  );
}

function CopyButton({ slug }: { slug: string }) {
  const { framework } = useApp();
  const [copied, setCopied] = useState(false);
  const cmd = `npx fcultui add ${slug} --${framework === "rn" ? "react-native" : "flutter"}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button className="tile-bar-btn" onClick={copy} title={cmd}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "ok" : "copy"}
          className="tile-bar-btn-inner"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.22, ease }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function TileBar({ slug, pro, saveId }: { slug: string; pro?: boolean; saveId?: string }) {
  return (
    <div className="tile-bar">
      <FrameworkSwitch />
      <span className="tile-bar-divider" />
      {pro ? (
        <Link href="/about" className="tile-bar-btn pro">
          <span className="tile-bar-btn-inner">
            <LockIcon />
            Unlock
          </span>
        </Link>
      ) : (
        <CopyButton slug={slug} />
      )}
      <Link href="/screens" className="tile-bar-icon" aria-label="View code">
        <CodeIcon />
      </Link>
      {saveId && <BookmarkButton id={saveId} />}
    </div>
  );
}

function TileBadges({ badge, pro }: { badge?: string; pro?: boolean }) {
  if (!badge && !pro) return null;
  return (
    <div className="tile-badges">
      {pro && (
        <span className="tile-lock" title="All-Access">
          <LockIcon />
        </span>
      )}
      {badge && <span className="tile-badge">{badge}</span>}
    </div>
  );
}

function AppMeta({ title, tagline, accent, href }: { title: string; tagline: string; accent: string; href: string }) {
  return (
    <div className="app-meta">
      <Link href={href} className="app-icon" style={{ "--accent": accent } as React.CSSProperties} aria-hidden tabIndex={-1}>
        {title[0]}
      </Link>
      <div className="app-meta-text">
        <h3>
          <Link href={href}>{title}</Link>
        </h3>
        <p>{tagline}</p>
      </div>
    </div>
  );
}

/* ---------------- Cards ---------------- */

export function ScreenCard({ screen }: { screen: Screen }) {
  const { platform } = useApp();
  const { ref, playing, handlers } = usePlayback<HTMLDivElement>();

  return (
    <div className={`post screen${playing ? " is-playing" : ""}`} data-card ref={ref} {...handlers}>
      <div className="media tile">
        <ScreenCarousel
          id={screen.slug}
          href="/screens"
          label={screen.title}
          flow={screen.flow}
          platform={platform}
          playing={playing}
          accent={screen.accent}
        />
        <TileBadges badge={screen.badge} pro={screen.pro} />
        <TileBar slug={screen.slug} pro={screen.pro} saveId={`s-${screen.slug}`} />
      </div>
      <AppMeta title={screen.title} tagline={screen.tagline} accent={screen.accent} href="/screens" />
    </div>
  );
}

export function PromoCard({ promo }: { promo: Promo }) {
  return (
    <div className="post sponsor promo" data-card>
      <div className="media tile">
        <Link href={promo.href} className="tile-link">
          <div className="promo-art">
            <span className="promo-kicker">All-Access</span>
            <strong>
              Every screen.
              <br />
              Both frameworks.
            </strong>
            <span className="promo-chips">
              <em>
                <FlutterIcon /> Flutter
              </em>
              <em>
                <ReactIcon /> React Native
              </em>
            </span>
          </div>
        </Link>
      </div>
      <div className="app-meta">
        <Link href={promo.href} className="app-icon promo-icon" aria-hidden tabIndex={-1}>
          <LockIcon />
        </Link>
        <div className="app-meta-text">
          <h3>
            <Link href={promo.href}>All-Access</Link>
          </h3>
          <p>{promo.title}</p>
        </div>
      </div>
    </div>
  );
}

export function KitCard({ kit }: { kit: AppKit }) {
  const { platform } = useApp();
  const { ref, playing, handlers } = usePlayback<HTMLDivElement>();
  const id = `k-${kit.slug}`;
  const items = kit.screens.map((d) => {
    const { tone, Component } = screenRegistry[d];
    return { tone, node: <Component /> };
  });

  return (
    <div className={`post template kit${playing ? " is-playing" : ""}`} data-card ref={ref} {...handlers}>
      <div className="media tile">
        <Link href="/templates" className="tile-link" aria-label={`${kit.title} app kit`}>
          <DeviceFan bare items={items} platform={platform} playing={playing} accent={kit.accent} fit={0.78} />
        </Link>
        <TileBadges badge="3 screens" />
        <TileBar slug={kit.slug} saveId={id} />
      </div>
      <AppMeta title={kit.title} tagline={`${kit.category} app kit`} accent={kit.accent} href="/templates" />
    </div>
  );
}
