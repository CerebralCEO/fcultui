/* Client-safe shapes of the content the site renders (read from Neon by lib/content.ts). */

export type Tone = "light" | "dark";

/** One step of an app's flow — a single 390 × 844 screen. */
export type FlowStep = {
  slug: string;
  /** Short step name, e.g. "Sign in". */
  label: string;
  title: string;
  tone: Tone;
  /** Compiled React Native web bundle (roadmap step D). Null until the pipeline has built it. */
  bundleUrl: string | null;
};

/** An app card in the gallery: cover screen + the rest of its flow. `slug` is the app's slug (/screens/<slug>). */
export type Screen = {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  accent: string;
  /** App logo URL (/api/logos/<id>); null falls back to the accent monogram. */
  logo: string | null;
  badge?: "New" | "Updated";
  flow: FlowStep[];
};

export type Promo = { promo: true; title: string; href: string };

export type PropRow = {
  name: string;
  flutter: string;
  rn: string;
  default: string;
  description: string;
};
