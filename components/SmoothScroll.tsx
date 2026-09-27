"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "./Providers";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const getLenis = () => lenis;

/**
 * Apple-style inertial scrolling. Lenis drives the scroll, GSAP's ticker drives Lenis,
 * so ScrollTrigger reveals stay frame-perfectly in sync with the smoothed position.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const { searchOpen } = useApp();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Freeze page scroll while a modal is open, and on Explore (the wall runs its own infinite engine)
  useEffect(() => {
    if (searchOpen || pathname.startsWith("/explore")) lenis?.stop();
    else lenis?.start();
  }, [searchOpen, pathname]);

  // Reset to top on route change — or glide to the #section a link asked for
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    const id = window.location.hash.slice(1);
    if (!id || id === "code") return; // #code is handled by the preview panel itself
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.4 });
      else el.scrollIntoView({ behavior: "smooth" });
    }, 450);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
