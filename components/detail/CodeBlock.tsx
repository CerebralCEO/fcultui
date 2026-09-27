"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { isLocked, type CodeFile, type FlutterFile } from "@/lib/code-types";
import { CheckIcon, CopyIcon, FlutterIcon, LockIcon, ReactIcon } from "../icons";
import { useApp } from "../Providers";
import { useAuthState } from "../auth/AuthProvider";
import { useFlutterCode } from "./FlutterCode";
import LockedCode from "./LockedCode";

type Props = {
  /** A framework pair (switches with the global Flutter ⇄ RN preference) or a single file. */
  flutter?: FlutterFile;
  rn?: CodeFile;
  file?: CodeFile;
  /** Collapse long files behind an "Expand" button. */
  collapsible?: boolean;
  /** Fill the parent's height and scroll internally (used inside the preview panel). */
  fill?: boolean;
  className?: string;
};

const COLLAPSED = 340;

function LangIcon({ file }: { file: FlutterFile }) {
  if (file.lang === "dart" || file.lang === "yaml") return <FlutterIcon />;
  if (file.lang === "tsx" || file.lang === "ts") return <ReactIcon />;
  return <span className="code-prompt">$</span>;
}

export default function CodeBlock({ flutter, rn, file, collapsible, fill, className = "" }: Props) {
  const { framework } = useApp();
  const { openAuth } = useAuthState();
  const unlocked = useFlutterCode();
  const pair = !file;

  // Swap a locked stub for the real file once /api/code has delivered it
  const fl: FlutterFile | undefined = flutter && isLocked(flutter) ? (unlocked.files?.[flutter.key] ?? flutter) : flutter;
  const active: FlutterFile = file ?? (framework === "rn" ? rn : fl)!;
  const activeLocked = isLocked(active);

  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [fullHeight, setFullHeight] = useState<number | null>(null);

  // Measure the tallest pane so expanding animates to an exact height
  useLayoutEffect(() => {
    if (!collapsible || !bodyRef.current) return;
    const el = bodyRef.current;
    const measure = () => setFullHeight(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.firstElementChild as Element);
    return () => ro.disconnect();
  }, [collapsible]);

  const canCollapse = collapsible && (fullHeight ?? Infinity) > COLLAPSED + 40;

  const copy = async () => {
    if (isLocked(active)) return openAuth("flutter");
    try {
      await navigator.clipboard.writeText(active.code);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const panes: [string, FlutterFile][] = pair ? [["flutter", fl!], ["rn", rn!]] : [["single", file!]];

  return (
    <div className={`code ${fill ? "code-fill" : ""} ${className}`}>
      <div className="code-head">
        <div className="code-files">
          {panes.map(([key, f]) => (
            <span key={key} className="code-file code-pane" data-fw-pane={pair ? key : undefined}>
              <LangIcon file={f} />
              {f.filename}
              {isLocked(f) && (
                <em className="code-file-lock">
                  <LockIcon /> Members
                </em>
              )}
            </span>
          ))}
        </div>
        <button className="code-copy" onClick={copy} aria-label={activeLocked ? "Sign in to copy" : "Copy code"}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "ok" : activeLocked ? "lock" : "copy"}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {copied ? <CheckIcon /> : activeLocked ? <LockIcon /> : <CopyIcon />}
              {copied ? "Copied" : activeLocked ? "Unlock" : "Copy"}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <div
        ref={bodyRef}
        className={`code-body${canCollapse && !expanded ? " is-collapsed" : ""}`}
        style={canCollapse ? { maxHeight: expanded ? (fullHeight ?? undefined) : COLLAPSED } : undefined}
        data-lenis-prevent={fill ? "" : undefined}
      >
        <div className="code-panes">
          {panes.map(([key, f]) =>
            isLocked(f) ? (
              <div key={key} className="code-pane" data-fw-pane={pair ? key : undefined}>
                <LockedCode file={f} loading={unlocked.status === "loading"} compact={!fill} />
              </div>
            ) : (
              <motion.div
                key={`${key}-open`}
                className="code-pane"
                data-fw-pane={pair ? key : undefined}
                initial={key === "flutter" && flutter && isLocked(flutter) ? { opacity: 0, filter: "blur(6px)" } : false}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5 }}
                dangerouslySetInnerHTML={{ __html: f.html }}
              />
            ),
          )}
        </div>
        {canCollapse && !expanded && !activeLocked && (
          <div className="code-expand">
            <button className="button-mini" onClick={() => setExpanded(true)}>
              Expand
            </button>
          </div>
        )}
      </div>
      {canCollapse && expanded && (
        <button className="code-collapse" onClick={() => setExpanded(false)}>
          Collapse
        </button>
      )}
    </div>
  );
}
