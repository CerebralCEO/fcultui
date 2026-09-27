"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { searchLogos, uploadLogo, type LogoHit } from "@/app/admin/actions";
import { CloseIcon, SearchIcon } from "../icons";
import { getLenis } from "../SmoothScroll";
import { Spinner } from "./ui";

export const logoUrl = (id: number) => `/api/logos/${id}`;

const SIZE = 256;

const toHex = (r: number, g: number, b: number) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase();

/** Dominant saturated colour of an image (ignores transparent, near-white, near-black and grey pixels). */
function dominantColour(ctx: CanvasRenderingContext2D): string {
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
  const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
  let fr = 0, fg = 0, fb = 0, fn = 0;
  for (let i = 0; i < data.length; i += 16) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 200) continue;
    fr += r; fg += g; fb += b; fn++;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max < 40 || min > 225 || max - min < 40) continue;
    // Bucket by coarse hue so one strong colour wins over a gradient's average
    const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
    const cur = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    buckets.set(key, { n: cur.n + 1, r: cur.r + r, g: cur.g + g, b: cur.b + b });
  }
  const top = [...buckets.values()].sort((x, y) => y.n - x.n)[0];
  if (top) return toHex(Math.round(top.r / top.n), Math.round(top.g / top.n), Math.round(top.b / top.n));
  return fn ? toHex(Math.round(fr / fn), Math.round(fg / fn), Math.round(fb / fn)) : "#6D5DF6";
}

/** Resizes a raster to a 256px WebP (SVGs are kept as-is) and extracts the accent colour. */
async function prepare(file: File): Promise<{ mime: string; data: string; accent: string }> {
  const isSvg = file.type === "image/svg+xml";
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const w = img.naturalWidth || SIZE, h = img.naturalHeight || SIZE;
    // Cover-crop to a square (app icons are square)
    const s = Math.max(SIZE / w, SIZE / h);
    ctx.drawImage(img, (SIZE - w * s) / 2, (SIZE - h * s) / 2, w * s, h * s);
    const accent = dominantColour(ctx);
    if (isSvg) {
      const text = await file.text();
      return { mime: "image/svg+xml", data: btoa(unescape(encodeURIComponent(text))), accent };
    }
    const dataUrl = canvas.toDataURL("image/webp", 0.9);
    return { mime: "image/webp", data: dataUrl.split(",")[1], accent };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Logo field: current logo tile + Upload + Library (searchable modal). */
export default function LogoPicker({
  value,
  name,
  onChange,
  onError,
}: {
  value: number | null;
  /** App name — used as the default logo name on upload. */
  name: string;
  onChange: (logo: LogoHit) => void;
  onError: (message: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, startUpload] = useTransition();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const upload = (file: File | undefined) => {
    if (!file) return;
    startUpload(async () => {
      try {
        const prepared = await prepare(file);
        const r = await uploadLogo({ name: name.trim() || file.name.replace(/\.[^.]+$/, ""), ...prepared });
        if (r.ok) onChange(r.logo);
        else onError(r.error);
      } catch {
        onError("Couldn't read that image.");
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  return (
    <div className="logo-field">
      <span
        className={`logo-tile${value ? "" : " is-empty"}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files[0]);
        }}
      >
        {uploading ? (
          <Spinner />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl(value)} alt="" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="9" cy="9" r="1.6" />
            <path d="m21 15-4.5-4.5L8 19" />
          </svg>
        )}
      </span>
      <div className="logo-actions">
        <button type="button" className="tool-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <span>Upload</span>
        </button>
        <button type="button" className="tool-btn" onClick={() => setOpen(true)}>
          <span>
            <SearchIcon /> Library
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          hidden
          onChange={(e) => upload(e.target.files?.[0])}
        />
      </div>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <LibraryModal
                selected={value}
                onClose={() => setOpen(false)}
                onPick={(l) => {
                  onChange(l);
                  setOpen(false);
                }}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

function LibraryModal({ selected, onPick, onClose }: { selected: number | null; onPick: (l: LogoHit) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<LogoHit[] | null>(null);

  // Debounced search
  useEffect(() => {
    let live = true;
    const t = setTimeout(async () => {
      const r = await searchLogos(q);
      if (live) setHits(r);
    }, q ? 180 : 0);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    getLenis()?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
    };
  }, [onClose]);

  return (
    <motion.div
      className="logo-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="logo-panel"
        role="dialog"
        aria-label="Logo library"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
      >
        <div className="logo-panel-head">
          <label className="nav-filter">
            <SearchIcon />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search logos" aria-label="Search logos" />
            {hits && <kbd>{hits.length}</kbd>}
          </label>
          <button type="button" className="auth-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="logo-grid" data-lenis-prevent>
          {hits === null ? (
            <p className="logo-empty">
              <Spinner />
            </p>
          ) : hits.length === 0 ? (
            <p className="logo-empty">{q ? `No logos match “${q}”.` : "The library is empty — upload a logo to start it."}</p>
          ) : (
            hits.map((l, i) => (
              <motion.button
                key={l.id}
                type="button"
                className={`logo-item${l.id === selected ? " active" : ""}`}
                onClick={() => onPick(l)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 24) * 0.012, duration: 0.3 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl(l.id)} alt="" loading="lazy" />
                <span>{l.name}</span>
              </motion.button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
