"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, useGSAP);

/**
 * Apple-style hero entrance:
 * 1. h1 is split into masked lines that rise into place with a soft de-blur.
 * 2. Every other [data-reveal] child fades up in sequence.
 */
export function useHeroReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const heading = root.querySelector("h1");
      const rest = gsap.utils.toArray<HTMLElement>("[data-reveal]:not(h1)", root);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([heading, ...rest], { opacity: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ delay: 0.15 });
        if (heading) {
          // Lock the natural box width so the split wrappers can't shrink the layout around it
          gsap.set(heading, { opacity: 1, width: heading.getBoundingClientRect().width });
          const split = SplitText.create(heading, { type: "lines", mask: "lines", linesClass: "split-line" });
          tl.from(split.lines, {
            yPercent: 105,
            filter: "blur(6px)",
            duration: 1.25,
            ease: "expo.out",
            stagger: 0.09,
          });
          // Restore the original markup once done → text-wrap:balance and resizing behave exactly like the original
          tl.eventCallback("onComplete", () => {
            split.revert();
            gsap.set(heading, { clearProps: "width" });
          });
        }
        tl.fromTo(
          rest,
          { opacity: 0, y: 18, filter: "blur(4px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "expo.out", stagger: 0.08, clearProps: "filter,transform" },
          heading ? "-=0.95" : 0
        );
      });
    },
    { scope }
  );
}
