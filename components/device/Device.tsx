"use client";

import { useLayoutEffect, useRef, useState } from "react";
import "./device.css";

export type Platform = "ios" | "android";
export type Tone = "light" | "dark";

export const DEVICE_W = 414;
export const DEVICE_H = 868;
/** Frameless ("bare") mode: just the 390 × 844 screen, Mobbin-style. */
export const SCREEN_W = 390;
export const SCREEN_H = 844;

type DeviceProps = {
  platform: Platform;
  tone: Tone;
  playing?: boolean;
  accent?: string;
  /** Frameless screen (no bezel / buttons / camera) — used by gallery tiles. */
  bare?: boolean;
  children: React.ReactNode;
};

const Signal = () => (
  <svg className="ic-signal" viewBox="0 0 18 12" fill="currentColor">
    <rect x="0" y="8" width="3" height="4" rx="1" />
    <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
    <rect x="10" y="3" width="3" height="9" rx="1" />
    <rect x="15" y="0" width="3" height="12" rx="1" />
  </svg>
);
const Wifi = () => (
  <svg className="ic-wifi" viewBox="0 0 16 12" fill="currentColor">
    <path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8 .6 10.2 10.2 0 0 0 .8 3.5L2 4.7a8.5 8.5 0 0 1 6-2.4Z" />
    <path d="M8 5.7c1.4 0 2.6.5 3.6 1.4l1.2-1.2A6.8 6.8 0 0 0 8 4a6.8 6.8 0 0 0-4.8 1.9l1.2 1.2A5.1 5.1 0 0 1 8 5.7Z" />
    <path d="M8 9.1c.5 0 .9.2 1.2.5L8 11.4 6.8 9.6c.3-.3.7-.5 1.2-.5Z" />
  </svg>
);
const Battery = () => (
  <svg className="ic-battery" viewBox="0 0 28 13" fill="none">
    <rect x="0.5" y="0.5" width="24" height="12" rx="3.8" stroke="currentColor" opacity="0.4" />
    <rect x="2" y="2" width="21" height="9" rx="2.5" fill="currentColor" />
    <path d="M26 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity="0.45" />
  </svg>
);
const AndroidSignal = () => (
  <svg className="ic-signal" viewBox="0 0 12 12" fill="currentColor">
    <path d="M12 0v12H0L12 0Z" />
  </svg>
);
const AndroidBattery = () => (
  <svg className="ic-battery" viewBox="0 0 8 13" fill="currentColor">
    <rect x="2.5" y="0" width="3" height="1.5" rx="0.5" />
    <rect x="0" y="1.5" width="8" height="11.5" rx="1.5" />
  </svg>
);

/** A single phone mockup at design size (414×868). Scale it with <ScaledDevice>. */
export function Device({ platform, tone, playing, accent, bare, children }: DeviceProps) {
  return (
    <div
      className={bare ? "device device-bare" : "device"}
      data-platform={platform}
      data-tone={tone}
      data-playing={playing ? "" : undefined}
      style={accent ? ({ "--accent": accent } as React.CSSProperties) : undefined}
    >
      {!bare && (
        <>
          <span className="device-btn l b1" />
          <span className="device-btn l b2" />
          <span className="device-btn l b3" />
          <span className="device-btn r b4" />
          <span className="device-btn r b5" />
          <div className="device-frame" />
        </>
      )}
      <div className="device-screen">
        <div className="device-content">{children}</div>
        <div className="device-status">
          <span>
            <span className="time-ios">9:41</span>
            <span className="time-android">12:30</span>
          </span>
          <span className="icons">
            <span className="ios-only icons">
              <Signal />
              <Wifi />
              <Battery />
            </span>
            <span className="android-only icons">
              <Wifi />
              <AndroidSignal />
              <AndroidBattery />
            </span>
          </span>
        </div>
        {!bare && <div className="device-camera" />}
        <div className="device-home" />
      </div>
    </div>
  );
}

/**
 * Measures its stage and scales design-size devices to fit (default 86% of the stage height).
 * Everything inside the device stays in real design pixels — just like a Flutter/RN logical canvas.
 */
export function useDeviceScale(fit = 0.86, w = DEVICE_W, h = DEVICE_H) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      setScale(Math.min((height * fit) / h, (width * fit) / w));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit, w, h]);

  return { ref, scale };
}

export function ScaledDevice(props: DeviceProps & { fit?: number }) {
  const { fit, ...device } = props;
  const W = device.bare ? SCREEN_W : DEVICE_W;
  const H = device.bare ? SCREEN_H : DEVICE_H;
  const { ref, scale } = useDeviceScale(fit, W, H);
  const s = scale ?? 0.4;
  return (
    <div className="device-stage" ref={ref}>
      <div
        className={`device-scaler${device.bare ? " is-bare" : ""}${scale === null ? " is-measuring" : ""}`}
        data-platform={device.platform}
        style={{ width: W * s, height: H * s, "--s": s } as React.CSSProperties}
      >
        <div style={{ transform: `scale(${s})`, transformOrigin: "0 0" }}>
          <Device {...device} />
        </div>
      </div>
    </div>
  );
}

/** Three devices fanned out — used by app-kit (template) cards. */
export function DeviceFan({
  items,
  platform,
  playing,
  accent,
  bare,
  fit = 0.8,
}: {
  items: { tone: Tone; node: React.ReactNode }[];
  platform: Platform;
  playing?: boolean;
  accent?: string;
  bare?: boolean;
  fit?: number;
}) {
  const W = bare ? SCREEN_W : DEVICE_W;
  const H = bare ? SCREEN_H : DEVICE_H;
  const { ref, scale } = useDeviceScale(fit, W, H);
  const s = scale ?? 0.3;
  const w = W * s;
  const h = H * s;
  return (
    <div className="device-stage device-fan" ref={ref}>
      {items.map((it, i) => (
        <div
          key={i}
          className={`device-scaler${bare ? " is-bare" : ""}${scale === null ? " is-measuring" : ""}`}
          data-platform={platform}
          style={{ width: w, height: h, left: "50%", top: "50%", marginLeft: -w / 2, marginTop: -h / 2, "--s": s } as React.CSSProperties}
        >
          <div style={{ transform: `scale(${s})`, transformOrigin: "0 0" }}>
            <Device platform={platform} tone={it.tone} playing={playing} accent={accent} bare={bare}>
              {it.node}
            </Device>
          </div>
        </div>
      ))}
    </div>
  );
}
