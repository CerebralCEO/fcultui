"use client";

import { FlutterIcon, ReactIcon } from "./icons";
import { useApp, type Framework } from "./Providers";

const OPTIONS: { id: Framework; label: string; long: string; Icon: typeof FlutterIcon }[] = [
  { id: "flutter", label: "Flutter", long: "Flutter", Icon: FlutterIcon },
  { id: "rn", label: "RN", long: "React Native", Icon: ReactIcon },
];

/**
 * Flutter ⇄ React Native switch — a single global preference shared by every tile and code page.
 * `variant="bar"` is the compact glass-toolbar version; `variant="solid"` is the full-label page version.
 */
export default function FrameworkSwitch({ variant = "bar" }: { variant?: "bar" | "solid" }) {
  const { framework, setFramework } = useApp();
  return (
    <div className={`fw-switch fw-switch-${variant}`} data-fw={framework} role="radiogroup" aria-label="Framework">
      <span className="fw-pill" aria-hidden />
      {OPTIONS.map(({ id, label, long, Icon }) => (
        <button
          key={id}
          role="radio"
          aria-checked={framework === id}
          className={framework === id ? "active" : undefined}
          onClick={() => setFramework(id)}
        >
          <Icon />
          {variant === "solid" ? long : label}
        </button>
      ))}
    </div>
  );
}
