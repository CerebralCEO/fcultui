"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeFile, LockedFile } from "@/lib/code-types";
import type { FlowStep, PropRow } from "@/lib/content-types";
import { ScaledDevice } from "../device/Device";
import ScreenView from "../device/ScreenView";
import { useApp } from "../Providers";
import PlatformToggle from "../PlatformToggle";
import { CloseIcon } from "../icons";
import { getLenis } from "../SmoothScroll";
import CodePanel from "./CodePanel";
import Installation from "./Installation";

export type WorkspaceItem = {
  step: FlowStep;
  /** Component name, e.g. "LedgerOverview" (→ LedgerOverviewScreen). */
  name: string;
  label: string;
  props: PropRow[];
  prompt: string;
  rn: CodeFile;
  flutter: LockedFile;
  rnUsage: CodeFile;
  flutterUsage: LockedFile;
  rnDeps: CodeFile;
  flutterDeps: CodeFile;
};

type Pair = { flutter: CodeFile | LockedFile; rn: CodeFile };

const ease = [0.16, 1, 0.3, 1] as const;
const num = (i: number) => String(i + 1).padStart(2, "0");

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
  </svg>
);
const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6" />
    <path d="M9 21H3v-6" />
    <path d="m21 3-7 7" />
    <path d="m3 21 7-7" />
  </svg>
);
const ReplayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Drag-to-scroll with momentum (mouse only — touch keeps native scroll) */
/* ------------------------------------------------------------------ */

function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let v = 0;
    let down = false;
    let moved = false;
    let raf = 0;

    const sync = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
    };
    const glide = () => {
      v *= 0.94;
      el.scrollLeft -= v;
      if (Math.abs(v) > 0.4) raf = requestAnimationFrame(glide);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      cancelAnimationFrame(raf);
      down = true;
      moved = false;
      startX = lastX = e.clientX;
      startLeft = el.scrollLeft;
      lastT = performance.now();
      v = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.classList.add("is-dragging");
      }
      if (!moved) return;
      e.preventDefault();
      el.scrollLeft = startLeft - dx;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      v = ((e.clientX - lastX) / dt) * 16;
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (!moved) return;
      el.classList.remove("is-dragging");
      if (performance.now() - lastT < 80) raf = requestAnimationFrame(glide);
    };
    // A drag must not also select the tile it started on
    const onClick = (e: MouseEvent) => {
      if (!moved) return;
      e.stopPropagation();
      e.preventDefault();
      moved = false;
    };
    const noNativeDrag = (e: DragEvent) => e.preventDefault();

    sync();
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", noNativeDrag);
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", noNativeDrag);
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, []);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const tile = el.querySelector<HTMLElement>(".flow-item");
    const step = tile ? tile.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return { ref, edges, page };
}

/* ------------------------------------------------------------------ */
/* Flow strip: every screen of the app, big and borderless              */
/* ------------------------------------------------------------------ */

function FlowStrip({
  items,
  selected,
  onSelect,
  onExpand,
  accent,
}: {
  items: WorkspaceItem[];
  selected: number;
  onSelect: (i: number) => void;
  onExpand: (i: number) => void;
  accent: string;
}) {
  const { platform } = useApp();
  const { ref, edges, page } = useDragScroll();
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const focusTile = (i: number) => {
    const tile = refs.current[i];
    tile?.querySelector<HTMLButtonElement>(".flow-select")?.focus({ preventScroll: true });
    tile?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  };

  const onKey = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = Math.min(items.length - 1, Math.max(0, selected + dir));
    onSelect(next);
    focusTile(next);
  };

  return (
    <div className="flow">
      <div className="flow-head">
        <div className="flow-title">
          <h2>Screens</h2>
          <span>{items.length} in this flow · select one to see its code</span>
        </div>
        <div className="flow-controls">
          <PlatformToggle id="flow" />
          <button className="flow-arrow" onClick={() => page(-1)} disabled={edges.start} aria-label="Scroll screens left">
            <Chevron dir="left" />
          </button>
          <button className="flow-arrow" onClick={() => page(1)} disabled={edges.end} aria-label="Scroll screens right">
            <Chevron dir="right" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className={`flow-strip${edges.start ? " at-start" : ""}${edges.end ? " at-end" : ""}`}
        data-platform={platform}
        role="tablist"
        aria-label="Screens in this flow"
        onKeyDown={onKey}
      >
        {items.map((it, i) => {
          const active = i === selected;
          return (
            <motion.div
              key={it.step.slug}
              ref={(el) => void (refs.current[i] = el)}
              className={`flow-item${active ? " active" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.06 * i, ease }}
            >
              <div className="flow-thumb">
                {active && <motion.span layoutId="flow-ring" className="flow-ring" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                <button
                  className="flow-select"
                  role="tab"
                  aria-selected={active}
                  aria-label={`${num(i)} ${it.label}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => onSelect(i)}
                >
                  <ScaledDevice bare platform={platform} tone={it.step.tone} playing={active} accent={accent} fit={1}>
                    <ScreenView step={it.step} />
                  </ScaledDevice>
                </button>
                <button className="flow-expand" onClick={() => onExpand(i)} aria-label={`Open ${it.label} full size`} tabIndex={-1}>
                  <ExpandIcon />
                </button>
              </div>
              <div className="flow-meta">
                <strong>
                  <em>{num(i)}</em>
                  {it.label}
                </strong>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.span
                      className="flow-viewing"
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.25 }}
                    >
                      <i /> Viewing code
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fullscreen viewer: framed device, ←/→ through the flow               */
/* ------------------------------------------------------------------ */

function Viewer({
  items,
  index,
  accent,
  onIndex,
  onClose,
}: {
  items: WorkspaceItem[];
  index: number;
  accent: string;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const { platform } = useApp();
  const [run, setRun] = useState(0);
  const it = items[index];
  const go = useCallback((d: number) => onIndex(Math.min(items.length - 1, Math.max(0, index + d))), [index, items.length, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Freeze page scroll while open
  useEffect(() => {
    getLenis()?.stop();
    document.body.classList.add("scroll-disabled");
    return () => {
      getLenis()?.start();
      document.body.classList.remove("scroll-disabled");
    };
  }, []);

  return (
    <motion.div
      className="preview-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="preview-full-inner"
        initial={{ scale: 0.94, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 16, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${it.step.slug}-${run}`}
            className="viewer-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease }}
          >
            <ScaledDevice platform={platform} tone={it.step.tone} playing accent={accent} fit={0.92}>
              <ScreenView step={it.step} />
            </ScaledDevice>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="viewer-bar">
        <button className="flow-arrow" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous screen">
          <Chevron dir="left" />
        </button>
        <span className="viewer-caption">
          <em>
            {num(index)} / {num(items.length - 1)}
          </em>
          {it.label}
        </span>
        <button className="flow-arrow" onClick={() => go(1)} disabled={index === items.length - 1} aria-label="Next screen">
          <Chevron dir="right" />
        </button>
        <button className="flow-arrow" onClick={() => setRun((r) => r + 1)} aria-label="Replay animation">
          <ReplayIcon />
        </button>
      </div>

      <div className="modal-close">
        <button className="modal-close-button" onClick={onClose} aria-label="Close fullscreen">
          <kbd className="modal-esc-label">ESC</kbd>
          <CloseIcon />
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Workspace                                                           */
/* ------------------------------------------------------------------ */

export default function ScreenWorkspace({
  items,
  accent,
  cli,
}: {
  items: WorkspaceItem[];
  accent: string;
  cli: Pair;
}) {
  const [selected, setSelected] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const item = items[selected];

  // Deep link: /screens/<slug>?screen=2 (Explore tiles and shared links)
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMounted(true);
    const n = Number(new URLSearchParams(window.location.search).get("screen"));
    if (Number.isInteger(n) && n > 0 && n < items.length) setSelected(n);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [items.length]);

  const select = useCallback((i: number) => {
    setSelected(i);
    const url = new URL(window.location.href);
    if (i === 0) url.searchParams.delete("screen");
    else url.searchParams.set("screen", String(i));
    window.history.replaceState(window.history.state, "", url);
  }, []);

  const viewAt = useCallback(
    (i: number) => {
      setViewer(i);
      select(i);
    },
    [select],
  );
  const closeViewer = useCallback(() => setViewer(null), []);

  return (
    <>
      <section id="preview" className="detail-section first">
        <FlowStrip items={items} selected={selected} onSelect={select} onExpand={viewAt} accent={accent} />
        <div id="code" className="code-anchor">
          <CodePanel index={selected} label={item.label} flutter={item.flutter} rn={item.rn} prompt={item.prompt} />
        </div>
      </section>

      <section id="installation" className="detail-section">
        <h2>
          Installation <span className="detail-h2-sub">· {item.label}</span>
        </h2>
        <Installation
          data={{
            cli,
            deps: { flutter: item.flutterDeps, rn: item.rnDeps },
            source: { flutter: item.flutter, rn: item.rn },
            usage: { flutter: item.flutterUsage, rn: item.rnUsage },
          }}
        />
      </section>

      <section id="props" className="detail-section">
        <h2>
          Props <span className="detail-h2-sub">· {item.label}</span>
        </h2>
        <motion.div key={item.step.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
          {item.props.length === 0 ? (
            <p className="detail-note">This screen takes no props — drop it in as is.</p>
          ) : (
          <div className="props-wrap">
            <table className="props">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Flutter</th>
                  <th>React Native</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {item.props.map((p) => (
                  <tr key={p.name}>
                    <td data-label="Prop">
                      <code>{p.name}</code>
                    </td>
                    <td data-label="Flutter">
                      <code>{p.flutter}</code>
                    </td>
                    <td data-label="React Native">
                      <code>{p.rn}</code>
                    </td>
                    <td data-label="Default">{p.default === "Screen accent" ? <code>{accent}</code> : p.default}</td>
                    <td data-label="Description">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          <p className="detail-note">
            Component: <code>{item.name}Screen</code> — identical API in both frameworks. Wrap your React Native app in{" "}
            <code>SafeAreaProvider</code>; Flutter needs no extra setup.
          </p>
        </motion.div>
      </section>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {viewer !== null && <Viewer items={items} index={viewer} accent={accent} onIndex={viewAt} onClose={closeViewer} />}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
