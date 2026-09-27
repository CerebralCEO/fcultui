"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Promo, Screen } from "@/lib/content-types";
import { BookmarkIcon, CheckIcon, CodeIcon, CopyIcon, FlutterIcon, LockIcon, ReactIcon } from "./icons";
import FrameworkSwitch from "./FrameworkSwitch";
import { useApp } from "./Providers";
import { useAuthState } from "./auth/AuthProvider";
import ScreenCarousel from "./ScreenCarousel";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Preview playback: mouse hover on pointer devices, "centred in viewport" on touch devices.
 * The live React Native web renders will use this same trigger contract (see docs/PLAN.md §2.1).
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

function TileBar({ slug, saveId, codeHref = "/screens" }: { slug: string; saveId?: string; codeHref?: string }) {
  const { framework } = useApp();
  const { signedIn, openAuth } = useAuthState();
  // React Native code is free; Flutter code is members-only
  const locked = framework === "flutter" && !signedIn;
  return (
    <div className="tile-bar">
      <FrameworkSwitch />
      <span className="tile-bar-divider" />
      {locked ? (
        <button className="tile-bar-btn pro" onClick={() => openAuth("flutter")}>
          <span className="tile-bar-btn-inner">
            <LockIcon />
            Unlock
          </span>
        </button>
      ) : (
        <CopyButton slug={slug} />
      )}
      <Link href={codeHref} className="tile-bar-icon" aria-label="View code">
        <CodeIcon />
      </Link>
      {saveId && <BookmarkButton id={saveId} />}
    </div>
  );
}

function TileBadges({ badge }: { badge?: string }) {
  if (!badge) return null;
  return (
    <div className="tile-badges">
      <span className="tile-badge">{badge}</span>
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
          href={`/screens/${screen.slug}`}
          label={screen.title}
          flow={screen.flow}
          platform={platform}
          playing={playing}
          accent={screen.accent}
        />
        <TileBadges badge={screen.badge} />
        <TileBar slug={screen.slug} saveId={`s-${screen.slug}`} codeHref={`/screens/${screen.slug}#code`} />
      </div>
      <AppMeta title={screen.title} tagline={screen.tagline} accent={screen.accent} href={`/screens/${screen.slug}`} />
    </div>
  );
}

export function PromoCard({ promo }: { promo: Promo }) {
  const { signedIn, openAuth } = useAuthState();
  const onClick = (e: React.MouseEvent) => {
    if (signedIn) return;
    e.preventDefault();
    openAuth("flutter");
  };
  return (
    <div className="post sponsor promo" data-card>
      <div className="media tile">
        <Link href={promo.href} className="tile-link" onClick={onClick}>
          <div className="promo-art">
            <span className="promo-kicker">{signedIn ? "Member" : "Free account"}</span>
            <strong>
              Flutter code,
              <br />
              unlocked.
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
        <Link href={promo.href} className="app-icon promo-icon" aria-hidden tabIndex={-1} onClick={onClick}>
          <LockIcon />
        </Link>
        <div className="app-meta-text">
          <h3>
            <Link href={promo.href} onClick={onClick}>
              {signedIn ? "You're a member" : "Join free"}
            </Link>
          </h3>
          <p>{promo.title}</p>
        </div>
      </div>
    </div>
  );
}
