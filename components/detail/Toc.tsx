"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLenis } from "../SmoothScroll";

/** "On this page" with scroll-spy; the active marker glides between items. */
export default function Toc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -96 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="toc" aria-label="On this page">
      <p className="toc-title">On this page</p>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            <button className={active === i.id ? "active" : undefined} onClick={() => go(i.id)}>
              {active === i.id && <motion.span layoutId="toc-marker" className="toc-marker" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
              {i.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
