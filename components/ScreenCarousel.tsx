"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo, type Variants } from "framer-motion";
import type { FlowStep } from "@/lib/content-types";
import { Device, SCREEN_H, SCREEN_W, useDeviceScale, type Platform } from "./device/Device";
import ScreenView from "./device/ScreenView";
import { ArrowRightIcon } from "./icons";

/*
 * Mobbin-style single-screen card with an ultra-smooth flow carousel.
 * Direction-aware: the outgoing screen tilts away in 3D, blurs and recedes while the incoming one
 * springs in from the opposite side. Arrows, dots, keyboard (←/→) and swipe all drive it.
 */

const SPRING = { type: "spring", stiffness: 240, damping: 30, mass: 0.9 } as const;
const EXIT_EASE = [0.32, 0.72, 0, 1] as const;

const slide: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "72%" : "-72%",
    rotateY: dir > 0 ? -24 : 24,
    scale: 0.86,
    opacity: 0,
    filter: "blur(8px)",
  }),
  center: {
    x: "0%",
    rotateY: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      ...SPRING,
      opacity: { duration: 0.35, ease: "easeOut" },
      filter: { duration: 0.45, ease: "easeOut" },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-72%" : "72%",
    rotateY: dir > 0 ? 24 : -24,
    scale: 0.86,
    opacity: 0,
    filter: "blur(8px)",
    transition: { duration: 0.5, ease: EXIT_EASE },
  }),
};

type Props = {
  id: string;
  href: string;
  label: string;
  flow: FlowStep[];
  platform: Platform;
  playing: boolean;
  accent: string;
};

export default function ScreenCarousel({ id, href, label, flow, platform, playing, accent }: Props) {
  const { ref, scale } = useDeviceScale(0.85, SCREEN_W, SCREEN_H);
  const [[index, dir], setPage] = useState<[number, number]>([0, 0]);
  const dragged = useRef(false);
  const s = scale ?? 0.4;
  const last = flow.length - 1;

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(last, next));
    if (clamped === index) return;
    setPage([clamped, clamped > index ? 1 : -1]);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -60) go(index + 1);
    else if (swipe > 60) go(index - 1);
  };

  const step = flow[index];

  return (
    <div
      className="carousel"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <Link
        href={href}
        className="tile-link"
        aria-label={`${label} — screen ${index + 1} of ${flow.length}`}
        draggable={false}
        onClick={(e) => {
          // A swipe must never register as a click-through
          if (dragged.current) {
            e.preventDefault();
            dragged.current = false;
          }
        }}
      >
        <div className="device-stage" ref={ref}>
          <div
            className={`carousel-frame${scale === null ? " is-measuring" : ""}`}
            data-platform={platform}
            style={{ width: SCREEN_W * s, height: SCREEN_H * s, "--s": s } as React.CSSProperties}
          >
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={index}
                className="carousel-slide"
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                dragSnapToOrigin
                onDragStart={() => (dragged.current = true)}
                onDragEnd={onDragEnd}
              >
                <div style={{ transform: `scale(${s})`, transformOrigin: "0 0" }}>
                  <Device bare platform={platform} tone={step.tone} playing={playing} accent={accent}>
                    <ScreenView step={step} />
                  </Device>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Link>

      {flow.length > 1 && (
        <>
          <div className="carousel-dots" role="tablist" aria-label="Screens">
            {flow.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Screen ${i + 1}`}
                onClick={() => go(i)}
              >
                {i === index && (
                  <motion.span layoutId={`dot-${id}`} className="carousel-dot-active" transition={{ type: "spring", stiffness: 520, damping: 36 }} />
                )}
              </button>
            ))}
          </div>

          <div className="carousel-nav">
          <AnimatePresence>
            {index > 0 && (
              <motion.button
                key="prev"
                className="carousel-arrow prev"
                aria-label="Previous screen"
                onClick={() => go(index - 1)}
                initial={{ opacity: 0, x: 8, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.9 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
              >
                <ArrowRightIcon />
              </motion.button>
            )}
            {index < last && (
              <motion.button
                key="next"
                className="carousel-arrow next"
                aria-label="Next screen"
                onClick={() => go(index + 1)}
                initial={{ opacity: 0, x: -8, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8, scale: 0.9 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
              >
                <ArrowRightIcon />
              </motion.button>
            )}
          </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
