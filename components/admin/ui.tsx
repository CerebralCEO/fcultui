"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon } from "../icons";

const ease = [0.16, 1, 0.3, 1] as const;

export type Status = "draft" | "building" | "live" | "failed";

/** Tinted glass badge (same family as the public rail's New / Updated badges). */
export function StatusBadge({ status }: { status: Status }) {
  const label = { draft: "Draft", building: "Building", live: "Live", failed: "Failed" }[status];
  return <em className={`nav-badge admin-status is-${status}`}>{label}</em>;
}

export function Field({
  label,
  hint,
  children,
  wide,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`admin-field${wide ? " wide" : ""}`}>
      <span className="admin-label">{label}</span>
      {children}
      {hint && <span className="admin-hint">{hint}</span>}
    </label>
  );
}

export function Spinner() {
  return <span className="auth-spinner" aria-hidden />;
}

/* ---------------- Toast ---------------- */

type Toast = { id: number; tone: "ok" | "error"; text: string };

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const [mounted, setMounted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => clearTimeout(timer.current);
  }, []);

  const show = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    clearTimeout(timer.current);
    setToast({ id: Date.now(), tone, text });
    timer.current = setTimeout(() => setToast(null), tone === "error" ? 4200 : 2200);
  }, []);

  const node = mounted
    ? createPortal(
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              className={`admin-toast is-${toast.tone}`}
              role="status"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
            >
              {toast.tone === "ok" ? <CheckIcon /> : <i />}
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return { toast: node, show };
}

/* ---------------- Two-step destructive button ---------------- */

export function ConfirmButton({ label, confirm, onConfirm, busy }: { label: string; confirm: string; onConfirm: () => void; busy?: boolean }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3500);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      type="button"
      className={`admin-danger${armed ? " armed" : ""}`}
      disabled={busy}
      onClick={() => (armed ? onConfirm() : setArmed(true))}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={armed ? "c" : "l"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease }}
        >
          {busy ? <Spinner /> : armed ? confirm : label}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
