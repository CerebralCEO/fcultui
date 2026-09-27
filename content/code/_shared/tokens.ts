// src/fcult/tokens.ts — shared by every FCult UI screen.
// Mirrors flutter/lib/fcult/tokens.dart 1:1 so both frameworks render identical UI.
import { Easing } from "react-native-reanimated";

export const colors = {
  ink: "#111111",
  inkMuted: "rgba(0,0,0,0.5)",
  paper: "#FFFFFF",
  night: "#0B0B0D",
  nightMuted: "rgba(255,255,255,0.55)",
  nightCard: "rgba(255,255,255,0.08)",
  positive: "#3DDC97",
} as const;

export const space = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 } as const;

export const radius = { field: 16, button: 18, card: 28, pill: 999 } as const;

export const motion = {
  /** cubic-bezier(0.16, 1, 0.3, 1) — the FCult "expo out" curve. */
  easeOutExpo: Easing.bezier(0.16, 1, 0.3, 1),
  fast: 350,
  medium: 1100,
} as const;

export const type = {
  family: "Inter",
  display: { fontFamily: "Inter", fontSize: 34, fontWeight: "600", letterSpacing: -1.2, lineHeight: 37 },
  title: { fontFamily: "Inter", fontSize: 27, fontWeight: "600", letterSpacing: -0.9, lineHeight: 30 },
  body: { fontFamily: "Inter", fontSize: 15, lineHeight: 20, letterSpacing: -0.15 },
  small: { fontFamily: "Inter", fontSize: 13, lineHeight: 18 },
  button: { fontFamily: "Inter", fontSize: 16, fontWeight: "600" },
} as const;
