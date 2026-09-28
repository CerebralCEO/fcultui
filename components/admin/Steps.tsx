"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { addScreen } from "@/app/admin/actions";
import { Spinner } from "./ui";
import { ArrowRightIcon, CheckIcon } from "../icons";

export type StepState = "done" | "todo" | "optional";
export type StepItem<T extends string = string> = { id: T; label: string; hint?: string; state: StepState };

const PILL = { type: "spring", stiffness: 500, damping: 40 } as const;

/**
 * Numbered stepper: done steps show a check, the active one carries the sliding pill.
 * Every step stays clickable — the order is a guide, not a lock.
 */
export function Stepper<T extends string>({
  steps,
  active,
  onSelect,
  layoutId,
}: {
  steps: StepItem<T>[];
  active: T;
  onSelect: (id: T) => void;
  layoutId: string;
}) {
  const i = steps.findIndex((s) => s.id === active);
  return (
    <ol className="admin-stepper" aria-label="Steps">
      {steps.map((s, n) => (
        <li key={s.id} className={`is-${s.state}${s.id === active ? " is-active" : ""}${n < i ? " is-past" : ""}`}>
          <button type="button" onClick={() => onSelect(s.id)} aria-current={s.id === active ? "step" : undefined}>
            {s.id === active && <motion.span layoutId={layoutId} className="admin-stepper-pill" transition={PILL} />}
            <span className="admin-step-num">{s.state === "done" ? <CheckIcon /> : n + 1}</span>
            <span className="admin-step-text">
              <strong>{s.label}</strong>
              {s.hint && <em>{s.hint}</em>}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

/** `addScreenFor` turns the call to action into "create a screen for this app and open it". */
export type JourneyStep = StepItem & { cta?: { href: string; label: string; addScreenFor?: number } };

/** App launch checklist: progress bar, the four steps, and one "next step" call to action. */
export function AppJourney({ steps, done }: { steps: JourneyStep[]; done?: { href: string; label: string } }) {
  const router = useRouter();
  const [adding, start] = useTransition();
  const complete = steps.filter((s) => s.state === "done").length;
  const current = steps.find((s) => s.state !== "done");
  const cta = current?.cta;
  const addScreenFor = cta?.addScreenFor;
  return (
    <section className="admin-card admin-journey" aria-label="Launch checklist">
      <div className="admin-journey-head">
        <span>
          <strong>{current ? "Launch checklist" : "Live on the site"}</strong>
          <em>
            {complete} of {steps.length} steps done
          </em>
        </span>
        {cta && addScreenFor ? (
          <button
            type="button"
            className="admin-primary sm"
            disabled={adding}
            onClick={() =>
              start(async () => {
                const r = await addScreen(addScreenFor);
                if (r.ok) router.push(`/admin/screens/${r.id}`);
              })
            }
          >
            {adding ? <Spinner /> : <>{cta.label} <ArrowRightIcon /></>}
          </button>
        ) : cta ? (
          <Link href={cta.href} className="admin-primary sm">
            {cta.label} <ArrowRightIcon />
          </Link>
        ) : (
          done && (
            <Link href={done.href} className="tool-btn" target="_blank">
              <span>{done.label}</span>
            </Link>
          )
        )}
      </div>
      <div className="admin-journey-bar" aria-hidden>
        <motion.i initial={false} animate={{ width: `${(complete / steps.length) * 100}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
      </div>
      <ol className="admin-journey-steps">
        {steps.map((s, n) => (
          <li key={s.id} className={`is-${s.state}${s === current ? " is-current" : ""}`}>
            <span className="admin-step-num">{s.state === "done" ? <CheckIcon /> : n + 1}</span>
            <span className="admin-step-text">
              <strong>{s.label}</strong>
              {s.hint && <em>{s.hint}</em>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
