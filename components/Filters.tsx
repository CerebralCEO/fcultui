"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { slug, type SearchMode } from "@/lib/data";
import { useApp } from "./Providers";
import PlatformToggle from "./PlatformToggle";

gsap.registerPlugin(useGSAP);

type Sticky = "" | "is-showing" | "is-hiding";

export default function Filters({
  tags,
  mode,
  showAll = true,
  showPlatform = false,
}: {
  tags: string[];
  mode: SearchMode;
  showAll?: boolean;
  showPlatform?: boolean;
}) {
  const { openSearch } = useApp();
  const anchorRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [sticky, setSticky] = useState<Sticky>("");
  const [scrolled, setScrolled] = useState(false);
  const [scrolledEnd, setScrolledEnd] = useState(false);

  // Original behaviour: once you've scrolled past the pills, scrolling *up* slides them in under the header,
  // scrolling down slides them away again.
  useEffect(() => {
    let lastY = window.scrollY;
    let state: Sticky = "";
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const set = (s: Sticky) => {
      if (s === state) return;
      state = s;
      setSticky(s);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const anchor = anchorRef.current;
      if (!anchor) return;
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header--height")) || 72;
      const passed = anchor.getBoundingClientRect().top + 60 < header;
      const up = y < lastY - 2;
      const down = y > lastY + 2;

      if (!passed && anchor.getBoundingClientRect().top >= header) {
        clearTimeout(hideTimer);
        set("");
      } else if (passed && up) {
        clearTimeout(hideTimer);
        set("is-showing");
      } else if (down && state === "is-showing") {
        set("is-hiding");
        hideTimer = setTimeout(() => set(""), 200);
      }
      if (up || down) lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(hideTimer);
    };
  }, []);

  // Edge gradients for the horizontally scrollable list
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const update = () => {
      setScrolled(el.scrollLeft > 2);
      setScrolledEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Pills cascade in from the left, slightly after the hero
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tags-menu li", {
          opacity: 0,
          x: -14,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.025,
          delay: 0.45,
          clearProps: "transform,opacity",
        });
      });
    },
    { scope: sectionRef }
  );

  const base = mode === "templates" ? "/explore" : `/${mode}`;

  return (
    <>
      <div ref={anchorRef} aria-hidden />
      <section
        ref={sectionRef}
        className={["filters", sticky, scrolled && "tags-scrolled", scrolledEnd && "tags-scrolled-end"].filter(Boolean).join(" ")}
      >
        <div className="tags">
          <div className="tags-menu-wrapper">
            <ul className="tags-menu tags-menu-list" ref={listRef} data-lenis-prevent-wheel>
              {tags.map((t) => (
                <li key={t} className="tag">
                  <Link href={`${base}?tag=${slug(t)}`} scroll={false}>
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {showPlatform && <PlatformToggle id="filters" />}
          {showAll && (
            <ul className="tags-menu tags-menu-button">
              <li>
                <button onClick={() => openSearch(mode)}>
                  <span>All types</span>
                </button>
              </li>
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
