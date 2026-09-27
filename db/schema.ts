import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* Content model — see docs/PLAN.md §5. An app is a flow; each screen is one step of it with Flutter + RN sources. */

export const toneEnum = pgEnum("tone", ["light", "dark"]);
export const badgeEnum = pgEnum("badge", ["new", "updated"]);
export const statusEnum = pgEnum("screen_status", ["draft", "building", "live", "failed"]);
export const frameworkEnum = pgEnum("framework", ["flutter", "rn"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const apps = pgTable("apps", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  accent: text("accent").notNull().default("#6D5DF6"),
  tagline: text("tagline").notNull().default(""),
  position: integer("position").notNull().default(0),
  ...timestamps,
});

export const screens = pgTable("screens", {
  id: serial("id").primaryKey(),
  appId: integer("app_id")
    .notNull()
    .references(() => apps.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  /** Short step name inside the flow, e.g. "Sign in". */
  label: text("label").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  tone: toneEnum("tone").notNull().default("dark"),
  badge: badgeEnum("badge"),
  isPro: boolean("is_pro").notNull().default(false),
  status: statusEnum("status").notNull().default("draft"),
  /** Order inside the app's flow (0 = cover screen). */
  position: integer("position").notNull().default(0),
  parityScore: integer("parity_score"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...timestamps,
});

export type SourceFile = { path: string; content: string };
export type HighlightedFile = { path: string; html: string };

export const screenSources = pgTable(
  "screen_sources",
  {
    id: serial("id").primaryKey(),
    screenId: integer("screen_id")
      .notNull()
      .references(() => screens.id, { onDelete: "cascade" }),
    framework: frameworkEnum("framework").notNull(),
    files: jsonb("files").$type<SourceFile[]>().notNull().default([]),
    highlighted: jsonb("highlighted").$type<HighlightedFile[]>().notNull().default([]),
    /** Usage snippet shown in Installation → Usage. */
    usage: text("usage").notNull().default(""),
    deps: jsonb("deps").$type<string[]>().notNull().default([]),
    rnBundleUrl: text("rn_bundle_url"),
    version: integer("version").notNull().default(1),
    updatedAt: timestamps.updatedAt,
  },
  (t) => [uniqueIndex("screen_sources_screen_framework").on(t.screenId, t.framework)],
);

export const screenProps = pgTable("screen_props", {
  id: serial("id").primaryKey(),
  screenId: integer("screen_id")
    .notNull()
    .references(() => screens.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  flutterType: text("flutter_type").notNull(),
  rnType: text("rn_type").notNull(),
  defaultValue: text("default_value").notNull().default(""),
  description: text("description").notNull().default(""),
  position: integer("position").notNull().default(0),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export const screenTags = pgTable(
  "screen_tags",
  {
    screenId: integer("screen_id")
      .notNull()
      .references(() => screens.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.screenId, t.tagId] })],
);

/* Relations (for db.query.*) */
export const appsRelations = relations(apps, ({ many }) => ({ screens: many(screens) }));
export const screensRelations = relations(screens, ({ one, many }) => ({
  app: one(apps, { fields: [screens.appId], references: [apps.id] }),
  sources: many(screenSources),
  props: many(screenProps),
  tags: many(screenTags),
}));
export const screenSourcesRelations = relations(screenSources, ({ one }) => ({
  screen: one(screens, { fields: [screenSources.screenId], references: [screens.id] }),
}));
export const screenPropsRelations = relations(screenProps, ({ one }) => ({
  screen: one(screens, { fields: [screenProps.screenId], references: [screens.id] }),
}));
export const tagsRelations = relations(tags, ({ many }) => ({ screens: many(screenTags) }));
export const screenTagsRelations = relations(screenTags, ({ one }) => ({
  screen: one(screens, { fields: [screenTags.screenId], references: [screens.id] }),
  tag: one(tags, { fields: [screenTags.tagId], references: [tags.id] }),
}));
