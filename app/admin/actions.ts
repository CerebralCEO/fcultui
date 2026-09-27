"use server";

import { revalidatePath, updateTag } from "next/cache";
import { and, desc, eq, ilike, inArray, max, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { apps, logos, screenProps, screenSources, screens, screenTags, tags } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { highlight } from "@/lib/code";
import type { Lang } from "@/lib/code-types";
import { CONTENT_TAG } from "@/lib/content";
import type { PropRow } from "@/lib/content-types";
import { slug as slugify } from "@/lib/data";

export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX = /^#[0-9a-fA-F]{6}$/;

/** Public pages read through the "content" tag; the admin rail + pages are dynamic. */
function refresh() {
  updateTag(CONTENT_TAG);
  revalidatePath("/admin", "layout");
}

function fail(e: unknown): { ok: false; error: string } {
  const code = (e as { code?: string; cause?: { code?: string } })?.cause?.code ?? (e as { code?: string })?.code;
  if (code === "23505") return { ok: false, error: "That slug is already in use." };
  console.error(e);
  return { ok: false, error: "Something went wrong. Check the server log." };
}

const need = () => {
  if (!db) throw new Error("DATABASE_URL is not configured");
  return db;
};

/* ------------------------------------------------------------------ */
/* Apps                                                                */
/* ------------------------------------------------------------------ */

/** `accent` is derived from the logo (dominant colour) — there is no manual colour field. */
export type AppInput = { name: string; slug: string; category: string; accent: string; tagline: string; logoId: number | null };

function cleanApp(input: AppInput): AppInput | string {
  const name = input.name.trim();
  const slug = (input.slug.trim() || slugify(name)).toLowerCase();
  const category = input.category.trim();
  const accent = input.accent.trim();
  if (!name) return "Give the app a name.";
  if (!SLUG.test(slug)) return "Slug may only use a–z, 0–9 and single dashes.";
  if (!category) return "Pick a category.";
  if (!HEX.test(accent)) return "Accent must be a hex colour like #6D5DF6.";
  const logoId = Number.isInteger(input.logoId) ? input.logoId : null;
  return { name, slug, category, accent: accent.toUpperCase(), tagline: input.tagline.trim(), logoId };
}

export async function createApp(input: AppInput): Promise<Result<{ id: number }>> {
  await requireAdmin();
  const data = cleanApp(input);
  if (typeof data === "string") return { ok: false, error: data };
  try {
    const d = need();
    const [{ top }] = await d.select({ top: max(apps.position) }).from(apps);
    const [row] = await d
      .insert(apps)
      .values({ ...data, position: (top ?? -1) + 1 })
      .returning({ id: apps.id });
    refresh();
    return { ok: true, id: row.id };
  } catch (e) {
    return fail(e);
  }
}

export async function updateApp(id: number, input: AppInput): Promise<Result> {
  await requireAdmin();
  const data = cleanApp(input);
  if (typeof data === "string") return { ok: false, error: data };
  try {
    await need().update(apps).set(data).where(eq(apps.id, id));
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteApp(id: number): Promise<Result> {
  await requireAdmin();
  try {
    await need().delete(apps).where(eq(apps.id, id));
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ------------------------------------------------------------------ */
/* Logo library                                                        */
/* ------------------------------------------------------------------ */

export type LogoHit = { id: number; name: string; accent: string };

const LOGO_MIMES = new Set(["image/webp", "image/png", "image/jpeg", "image/svg+xml"]);
const LOGO_MAX_BYTES = 400_000;

/** Stores a logo the browser already resized (≤256px WebP) or an SVG as-is. */
export async function uploadLogo(input: { name: string; mime: string; data: string; accent: string }): Promise<Result<{ logo: LogoHit }>> {
  await requireAdmin();
  const name = input.name.trim().slice(0, 80);
  if (!name) return { ok: false, error: "Give the logo a name." };
  if (!LOGO_MIMES.has(input.mime)) return { ok: false, error: "Use a PNG, JPG, WebP or SVG file." };
  if (!/^[A-Za-z0-9+/=]+$/.test(input.data) || Buffer.byteLength(input.data, "base64") > LOGO_MAX_BYTES)
    return { ok: false, error: "That image is too large (max 400 KB)." };
  const accent = HEX.test(input.accent) ? input.accent.toUpperCase() : "#6D5DF6";
  try {
    const [row] = await need()
      .insert(logos)
      .values({ name, keywords: name.toLowerCase(), mime: input.mime, data: input.data, accent })
      .returning({ id: logos.id, name: logos.name, accent: logos.accent });
    return { ok: true, logo: row };
  } catch (e) {
    return fail(e);
  }
}

/** Library search by name / keywords (newest first). */
export async function searchLogos(query: string): Promise<LogoHit[]> {
  await requireAdmin();
  if (!db) return [];
  const q = query.trim().toLowerCase().slice(0, 60);
  const cols = { id: logos.id, name: logos.name, accent: logos.accent };
  const base = db.select(cols).from(logos);
  const rows = q
    ? await base.where(or(ilike(logos.name, `%${q}%`), ilike(logos.keywords, `%${q}%`))).orderBy(desc(logos.id)).limit(60)
    : await base.orderBy(desc(logos.id)).limit(60);
  return rows;
}

export async function deleteLogo(id: number): Promise<Result> {
  await requireAdmin();
  try {
    await need().delete(logos).where(eq(logos.id, id));
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ------------------------------------------------------------------ */
/* Screens                                                             */
/* ------------------------------------------------------------------ */

export async function addScreen(appId: number): Promise<Result<{ id: number }>> {
  await requireAdmin();
  try {
    const d = need();
    const app = await d.query.apps.findFirst({ where: eq(apps.id, appId), columns: { slug: true, name: true } });
    if (!app) return { ok: false, error: "App not found." };
    const [{ top }] = await d.select({ top: max(screens.position) }).from(screens).where(eq(screens.appId, appId));
    const position = (top ?? -1) + 1;
    const n = position + 1;
    const [row] = await d
      .insert(screens)
      .values({
        appId,
        slug: `${app.slug}-${Date.now().toString(36)}`,
        title: `${app.name} screen ${n}`,
        label: `Screen ${n}`,
        position,
      })
      .returning({ id: screens.id });
    refresh();
    return { ok: true, id: row.id };
  } catch (e) {
    return fail(e);
  }
}

export async function reorderScreens(appId: number, ids: number[]): Promise<Result> {
  await requireAdmin();
  try {
    const d = need();
    await Promise.all(
      ids.map((id, position) => d.update(screens).set({ position }).where(and(eq(screens.id, id), eq(screens.appId, appId)))),
    );
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export type SourceInput = { path: string; code: string; usage: string; deps: string[] };

export type ScreenInput = {
  title: string;
  label: string;
  slug: string;
  tagline: string;
  description: string;
  tone: "light" | "dark";
  badge: "" | "new" | "updated";
  tags: string[];
  flutter: SourceInput;
  rn: SourceInput;
  props: PropRow[];
};

const langOf = (path: string): Lang => {
  const ext = path.split(".").pop()?.toLowerCase();
  return ext === "dart" ? "dart" : ext === "ts" ? "ts" : ext === "yaml" || ext === "yml" ? "yaml" : "tsx";
};

async function saveSource(screenId: number, framework: "flutter" | "rn", src: SourceInput) {
  const d = need();
  const code = src.code.replace(/\s+$/, "");
  if (!code) {
    await d.delete(screenSources).where(and(eq(screenSources.screenId, screenId), eq(screenSources.framework, framework)));
    return;
  }
  const path = src.path.trim() || (framework === "flutter" ? "lib/screens/screen.dart" : "src/screens/Screen.tsx");
  // Highlighted at save time so public pages never run Shiki for published code
  const html = await highlight(code, langOf(path));
  const values = {
    files: [{ path, content: code }],
    highlighted: [{ path, html }],
    usage: src.usage.replace(/\s+$/, ""),
    deps: src.deps.map((x) => x.trim()).filter(Boolean),
  };
  await d
    .insert(screenSources)
    .values({ screenId, framework, ...values })
    .onConflictDoUpdate({
      target: [screenSources.screenId, screenSources.framework],
      set: { ...values, version: sql`${screenSources.version} + 1` },
    });
}

export async function saveScreen(id: number, input: ScreenInput): Promise<Result> {
  await requireAdmin();
  const title = input.title.trim();
  const label = input.label.trim();
  const slug = (input.slug.trim() || slugify(title)).toLowerCase();
  if (!title) return { ok: false, error: "Give the screen a title." };
  if (!label) return { ok: false, error: "Give the screen a short label (e.g. “Sign in”)." };
  if (!SLUG.test(slug)) return { ok: false, error: "Slug may only use a–z, 0–9 and single dashes." };
  const props = input.props.filter((p) => p.name.trim());
  if (props.some((p) => !p.flutter.trim() || !p.rn.trim())) return { ok: false, error: "Every prop needs a Flutter and a React Native type." };

  try {
    const d = need();
    await d
      .update(screens)
      .set({
        title,
        label,
        slug,
        tagline: input.tagline.trim(),
        description: input.description.trim(),
        tone: input.tone,
        badge: input.badge || null,
      })
      .where(eq(screens.id, id));

    await Promise.all([saveSource(id, "flutter", input.flutter), saveSource(id, "rn", input.rn)]);

    await d.delete(screenProps).where(eq(screenProps.screenId, id));
    if (props.length)
      await d.insert(screenProps).values(
        props.map((p, position) => ({
          screenId: id,
          name: p.name.trim(),
          flutterType: p.flutter.trim(),
          rnType: p.rn.trim(),
          defaultValue: p.default.trim(),
          description: p.description.trim(),
          position,
        })),
      );

    const names = [...new Set(input.tags.map((t) => t.trim()).filter(Boolean))];
    await d.delete(screenTags).where(eq(screenTags.screenId, id));
    if (names.length) {
      const wanted = names.map((name) => ({ name, slug: slugify(name) })).filter((t) => t.slug);
      await d.insert(tags).values(wanted).onConflictDoNothing({ target: tags.slug });
      const rows = await d.select({ id: tags.id }).from(tags).where(inArray(tags.slug, wanted.map((t) => t.slug)));
      if (rows.length) await d.insert(screenTags).values(rows.map((t) => ({ screenId: id, tagId: t.id }))).onConflictDoNothing();
    }

    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function setScreenStatus(id: number, status: "draft" | "live"): Promise<Result> {
  await requireAdmin();
  try {
    const d = need();
    if (status === "live") {
      const sources = await d.select({ fw: screenSources.framework }).from(screenSources).where(eq(screenSources.screenId, id));
      const has = new Set(sources.map((s) => s.fw));
      if (!has.has("flutter") || !has.has("rn"))
        return { ok: false, error: "Save both the Flutter and the React Native source before publishing." };
    }
    await d
      .update(screens)
      .set({ status, ...(status === "live" ? { publishedAt: new Date() } : {}) })
      .where(eq(screens.id, id));
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteScreen(id: number): Promise<Result> {
  await requireAdmin();
  try {
    await need().delete(screens).where(eq(screens.id, id));
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
