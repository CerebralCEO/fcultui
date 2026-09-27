"use client";

import type { FlowStep } from "@/lib/content-types";

/**
 * What renders inside a <Device> for one flow step.
 * Live renders arrive with the pipelines (docs/PLAN.md: step D = React Native web bundle, step E = Flutter
 * multi-view host). Until a step has a build, it shows a neutral "preview building" surface — never an image.
 */
export default function ScreenView({ step }: { step: FlowStep }) {
  return (
    <div className="screen-pending">
      <div className="screen-pending-mark" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <strong>{step.label}</strong>
      <em>Live preview is building</em>
    </div>
  );
}
