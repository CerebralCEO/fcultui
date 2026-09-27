"use client";

import { useRef } from "react";
import { useHeroReveal } from "./useHeroReveal";

export default function AboutReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useHeroReveal(ref);
  return (
    <div className="page page-about" ref={ref}>
      {children}
    </div>
  );
}
