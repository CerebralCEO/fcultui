"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Grid wrapper: cards rise in row-by-row as they enter the viewport (ScrollTrigger.batch),
 * with a gentle scale + de-blur for that Apple product-page feel.
 */
export default function PostsGrid({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(cards, { opacity: 0, y: 48, scale: 0.97 });
        ScrollTrigger.batch(cards, {
          start: "top 94%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.2,
              ease: "expo.out",
              stagger: { each: 0.07, from: "start" },
              overwrite: true,
              clearProps: "transform",
            }),
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
