import "server-only";
import { unstable_cache } from "next/cache";
import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { apps, screenProps, screens, screenTags, tags } from "@/db/schema";
import type { FlowStep, PropRow, Screen } from "./content-types";

/**
 * Everything the site renders comes from Neon. Reads are cached under the "content" tag; the admin
 * panel calls revalidateTag("content") after a publish. Without DATABASE_URL every list is empty.
 * Only `live` screens are public. An app appears once it has at least one live screen.
 */

export const CONTENT_TAG = "content";

/** Production reads go through the data cache; in `next dev` they hit Neon directly so edits show up at once. */
const cached = <A extends unknown[], R>(fn: (...args: A) => Promise<R>, keys: string[], tags: string[]) =>
  process.env.NODE_ENV === "development" ? fn : unstable_cache(fn, keys, { tags });

const badgeLabel = { new: "New", updated: "Updated" } as const;

async function loadScreens(): Promise<Screen[]> {
  if (!db) return [];
  const rows = await db.query.apps.findMany({
    orderBy: [asc(apps.position), asc(apps.id)],
    with: {
      screens: {
        where: eq(screens.status, "live"),
        orderBy: [asc(screens.position), asc(screens.id)],
      },
    },
  });
  return rows
    .filter((a) => a.screens.length > 0)
    .map((a) => {
      const cover = a.screens[0];
      return {
        slug: a.slug,
        title: a.name,
        category: a.category,
        tagline: a.tagline || cover.tagline,
        accent: a.accent,
        badge: cover.badge ? badgeLabel[cover.badge] : undefined,
        flow: a.screens.map(
          (s): FlowStep => ({ slug: s.slug, label: s.label, title: s.title, tone: s.tone, bundleUrl: null }),
        ),
      };
    });
}

/** Every public app card, in gallery order. */
export const getScreens = cached(loadScreens, ["screens"], [CONTENT_TAG]);

/** Categories that actually have content (filter bar, search). */
export const getCategories = cached(
  async () => [...new Set((await loadScreens()).map((s) => s.category))].sort(),
  ["categories"],
  [CONTENT_TAG],
);

export type SourceSet = {
  files: { path: string; content: string; html: string | null }[];
  usage: string;
  deps: string[];
};

export type StepDetail = FlowStep & {
  description: string;
  tags: string[];
  props: PropRow[];
  rn: SourceSet | null;
  flutter: SourceSet | null;
};

export type ScreenDetail = Screen & { description: string; tags: string[]; steps: StepDetail[] };

async function loadScreen(slug: string): Promise<ScreenDetail | null> {
  if (!db) return null;
  const app = await db.query.apps.findFirst({
    where: eq(apps.slug, slug),
    with: {
      screens: {
        where: eq(screens.status, "live"),
        orderBy: [asc(screens.position), asc(screens.id)],
        with: {
          sources: true,
          props: { orderBy: [asc(screenProps.position)] },
        },
      },
    },
  });
  if (!app || app.screens.length === 0) return null;

  const ids = app.screens.map((s) => s.id);
  const tagRows = await db
    .select({ screenId: screenTags.screenId, name: tags.name })
    .from(screenTags)
    .innerJoin(tags, eq(screenTags.tagId, tags.id))
    .where(inArray(screenTags.screenId, ids));

  const source = (s: (typeof app.screens)[number], fw: "rn" | "flutter"): SourceSet | null => {
    const src = s.sources.find((x) => x.framework === fw);
    if (!src || src.files.length === 0) return null;
    return {
      files: src.files.map((f) => ({ ...f, html: src.highlighted.find((h) => h.path === f.path)?.html ?? null })),
      usage: src.usage,
      deps: src.deps,
    };
  };

  const steps: StepDetail[] = app.screens.map((s) => ({
    slug: s.slug,
    label: s.label,
    title: s.title,
    tone: s.tone,
    bundleUrl: s.sources.find((x) => x.framework === "rn")?.rnBundleUrl ?? null,
    description: s.description,
    tags: tagRows.filter((t) => t.screenId === s.id).map((t) => t.name),
    props: s.props.map((p) => ({
      name: p.name,
      flutter: p.flutterType,
      rn: p.rnType,
      default: p.defaultValue,
      description: p.description,
    })),
    rn: source(s, "rn"),
    flutter: source(s, "flutter"),
  }));

  const cover = app.screens[0];
  return {
    slug: app.slug,
    title: app.name,
    category: app.category,
    tagline: app.tagline || cover.tagline,
    accent: app.accent,
    badge: cover.badge ? badgeLabel[cover.badge] : undefined,
    description: cover.description || app.tagline,
    tags: [...new Set(steps.flatMap((s) => s.tags))],
    flow: steps.map(({ slug, label, title, tone, bundleUrl }) => ({ slug, label, title, tone, bundleUrl })),
    steps,
  };
}

/** Full detail (sources, props, tags) for one app. Includes Flutter source — never pass it to the client as-is. */
export const getScreen = (slug: string) =>
  cached(() => loadScreen(slug), ["screen", slug], [CONTENT_TAG, `screen:${slug}`])();
