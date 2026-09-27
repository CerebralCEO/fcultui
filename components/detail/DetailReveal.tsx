"use client";

import { useRef } from "react";
import { useHeroReveal } from "../useHeroReveal";

/** Page header entrance — same SplitText line reveal as the gallery hero. */
export default function DetailReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useHeroReveal(ref);
  return (
    <header className="detail-head" ref={ref}>
      {children}
    </header>
  );
}
