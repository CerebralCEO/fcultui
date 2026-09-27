"use client";

import { motion } from "framer-motion";
import { AndroidIcon, AppleIcon } from "./icons";
import { useApp } from "./Providers";
import type { Platform } from "./device/Device";

const OPTIONS: { id: Platform; label: string; Icon: typeof AppleIcon }[] = [
  { id: "ios", label: "iOS", Icon: AppleIcon },
  { id: "android", label: "Android", Icon: AndroidIcon },
];

/** iOS / Android device-frame switch. `id` scopes the sliding pill so several toggles can share a page. */
export default function PlatformToggle({ id }: { id: string }) {
  const { platform, setPlatform } = useApp();
  return (
    <div className="platform-toggle" role="radiogroup" aria-label="Device frame">
      {OPTIONS.map(({ id: p, label, Icon }) => (
        <button key={p} role="radio" aria-checked={platform === p} className={platform === p ? "active" : undefined} onClick={() => setPlatform(p)}>
          {platform === p && (
            <motion.span layoutId={`platform-pill-${id}`} className="pill" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
          )}
          <Icon />
          <span className="label">{label}</span>
        </button>
      ))}
    </div>
  );
}
