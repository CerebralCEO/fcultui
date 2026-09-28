"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Reorder, useDragControls } from "framer-motion";
import { addScreen, reorderScreens } from "@/app/admin/actions";
import type { ScreenProgress } from "@/lib/admin-queries";
import { ArrowRightIcon } from "../icons";
import { Spinner, StatusBadge, useToast } from "./ui";

const Grip = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    {[6, 12, 18].flatMap((y) => [9, 15].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />))}
  </svg>
);

function Row({ s, index, onDrop }: { s: ScreenProgress; index: number; onDrop: () => void }) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={s}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDrop}
      className="admin-flow-row"
      whileDrag={{ scale: 1.01, zIndex: 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    >
      <button type="button" className="admin-grip" onPointerDown={(e) => controls.start(e)} aria-label={`Drag ${s.label}`}>
        <Grip />
      </button>
      <em className="admin-flow-index">{String(index + 1).padStart(2, "0")}</em>
      <span className="admin-flow-text">
        <strong>{s.label}</strong>
        <span>{s.title}</span>
      </span>
      <span className="admin-code-state" aria-label="Code">
        <i className={s.hasFlutter ? "on" : undefined} /> Flutter
        <i className={s.hasRn ? "on" : undefined} /> RN
      </span>
      <StatusBadge status={s.status} />
      <Link href={`/admin/screens/${s.id}`} className="tool-btn">
        Edit <ArrowRightIcon />
      </Link>
    </Reorder.Item>
  );
}

/** The app's flow: drag to reorder (index 0 is the gallery cover), open a screen, add a new one. */
export default function FlowList({ appId, screens }: { appId: number; screens: ScreenProgress[] }) {
  const router = useRouter();
  const { toast, show } = useToast();
  const [items, setItems] = useState(screens);
  const [adding, startAdd] = useTransition();
  const [synced, setSynced] = useState(screens);

  // Server data changed (e.g. after a save elsewhere) — adopt it
  if (synced !== screens) {
    setSynced(screens);
    setItems(screens);
  }

  const persist = async () => {
    const ids = items.map((s) => s.id);
    if (ids.join() === screens.map((s) => s.id).join()) return;
    const r = await reorderScreens(appId, ids);
    show(r.ok ? "Order saved" : r.error, r.ok ? "ok" : "error");
    if (r.ok) router.refresh();
  };

  const add = () =>
    startAdd(async () => {
      const r = await addScreen(appId);
      if (r.ok) router.push(`/admin/screens/${r.id}`);
      else show(r.error, "error");
    });

  return (
    <div className="admin-card admin-flow">
      {items.length === 0 ? (
        <p className="admin-empty-line">No screens yet. The first screen you add becomes the gallery cover.</p>
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="admin-flow-list">
          {items.map((s, i) => (
            <Row key={s.id} s={s} index={i} onDrop={persist} />
          ))}
        </Reorder.Group>
      )}
      <div className="admin-actions">
        <span className="admin-hint">Drag to reorder. Screen 01 is the cover in the gallery.</span>
        <button type="button" className="admin-primary" onClick={add} disabled={adding}>
          {adding ? <Spinner /> : "Add screen"}
        </button>
      </div>
      {toast}
    </div>
  );
}
