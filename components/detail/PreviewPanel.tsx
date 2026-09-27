"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeFile } from "@/lib/code";
import type { ScreenDesign } from "@/lib/data";
import { ScaledDevice } from "../device/Device";
import { screenRegistry } from "../screens";
import { useApp } from "../Providers";
import FrameworkSwitch from "../FrameworkSwitch";
import PlatformToggle from "../PlatformToggle";
import Segmented from "./Segmented";
import CodeBlock from "./CodeBlock";
import { CheckIcon, CloseIcon, CodeIcon, EyeIcon } from "../icons";
import { getLenis } from "../SmoothScroll";

type Tab = "preview" | "code";

const ease = [0.16, 1, 0.3, 1] as const;

const ReplayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
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

export default function PreviewPanel({
  id,
  design,
  accent,
  flutter,
  rn,
  prompt,
  primary = false,
}: {
  id: string;
  design: ScreenDesign;
  accent: string;
  flutter: CodeFile;
  rn: CodeFile;
  prompt: string;
  /** The page's main panel: honours `#code` deep links. */
  primary?: boolean;
}) {
  const { platform } = useApp();
  const [tab, setTab] = useState<Tab>("preview");
  const [run, setRun] = useState(0);
  const [full, setFull] = useState(false);
  const [prompted, setPrompted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { tone, Component } = screenRegistry[design];

  // Deep link from the gallery's </> button; portal only after mount (no hydration mismatch)
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMounted(true);
    if (primary && window.location.hash === "#code") setTab("code");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [primary]);

  // Fullscreen: ESC closes, page scroll freezes
  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    window.addEventListener("keydown", onKey);
    getLenis()?.stop();
    document.body.classList.add("scroll-disabled");
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.body.classList.remove("scroll-disabled");
    };
  }, [full]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {}
    setPrompted(true);
    setTimeout(() => setPrompted(false), 1500);
  };

  const device = (fit: number) => (
    <ScaledDevice key={`${run}-${platform}`} platform={platform} tone={tone} playing accent={accent} fit={fit}>
      <Component />
    </ScaledDevice>
  );

  return (
    <div className="preview" ref={rootRef}>
      <div className="preview-bar">
        <Segmented<Tab>
          label="View"
          layoutId={`tab-${id}`}
          value={tab}
          onChange={setTab}
          options={[
            { id: "preview", label: "Preview", icon: <EyeIcon /> },
            { id: "code", label: "Code", icon: <CodeIcon /> },
          ]}
        />
        <div className="preview-tools">
          <PlatformToggle id={`panel-${id}`} />
          <div className="seg seg-fw">
            <FrameworkSwitch variant="solid" />
          </div>
          <button className="tool-btn" onClick={copyPrompt}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={prompted ? "ok" : "p"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                {prompted && <CheckIcon />}
                {prompted ? "Copied" : "Copy prompt"}
              </motion.span>
            </AnimatePresence>
          </button>
          <button className="tool-icon" onClick={() => setFull(true)} aria-label="Fullscreen preview">
            <ExpandIcon />
          </button>
        </div>
      </div>

      <div className="preview-panel">
        <AnimatePresence mode="wait" initial={false}>
          {tab === "preview" ? (
            <motion.div
              key="preview"
              className="preview-stage"
              initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease }}
            >
              {device(0.86)}
              <button className="preview-replay" onClick={() => setRun((r) => r + 1)}>
                <ReplayIcon />
                Replay
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              className="preview-code"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease }}
            >
              <CodeBlock flutter={flutter} rn={rn} fill />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {full && (
              <motion.div
                className="preview-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onMouseDown={(e) => e.target === e.currentTarget && setFull(false)}
              >
                <motion.div
                  className="preview-full-inner"
                  initial={{ scale: 0.94, y: 24, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.96, y: 16, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                >
                  {device(0.92)}
                </motion.div>
                <div className="modal-close">
                  <button className="modal-close-button" onClick={() => setFull(false)} aria-label="Close fullscreen">
                    <kbd className="modal-esc-label">ESC</kbd>
                    <CloseIcon />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
