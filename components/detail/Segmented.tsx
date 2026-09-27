"use client";

import { motion } from "framer-motion";

type Option<T extends string> = { id: T; label: string; icon?: React.ReactNode };

/** Pill segmented control with a spring-sliding active indicator (scoped by `layoutId`). */
export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  layoutId,
  label,
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  layoutId: string;
  label: string;
}) {
  return (
    <div className="seg" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} role="tab" aria-selected={value === o.id} className={value === o.id ? "active" : undefined} onClick={() => onChange(o.id)}>
          {value === o.id && <motion.span layoutId={layoutId} className="seg-pill" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
          {o.icon}
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}
