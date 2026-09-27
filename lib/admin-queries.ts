import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { apps, screenProps, screens } from "@/db/schema";

/* Uncached reads for the admin panel (it must always see the latest drafts). Only call after requireAdmin(). */

export type AdminScreenRow = {
  id: number;
  slug: string;
  title: string;
  label: string;
  status: "draft" | "building" | "live" | "failed";
  position: number;
  updatedAt: Date;
};

export type AdminApp = {
  id: number;
  slug: string;
  name: string;
  category: string;
  accent: string;
  tagline: string;
  position: number;
  screens: AdminScreenRow[];
};

const screenCols = {
  id: true,
  slug: true,
  title: true,
  label: true,
  status: true,
  position: true,
  updatedAt: true,
} as const;

export async function adminApps(): Promise<AdminApp[]> {
  if (!db) return [];
  return db.query.apps.findMany({
    orderBy: [asc(apps.position), asc(apps.id)],
    columns: { id: true, slug: true, name: true, category: true, accent: true, tagline: true, position: true },
    with: { screens: { columns: screenCols, orderBy: [asc(screens.position), asc(screens.id)] } },
  });
}

export async function adminApp(id: number): Promise<AdminApp | null> {
  if (!db || !Number.isInteger(id)) return null;
  const app = await db.query.apps.findFirst({
    where: eq(apps.id, id),
    columns: { id: true, slug: true, name: true, category: true, accent: true, tagline: true, position: true },
    with: { screens: { columns: screenCols, orderBy: [asc(screens.position), asc(screens.id)] } },
  });
  return app ?? null;
}

export async function adminRecentScreens(limit = 8) {
  if (!db) return [];
  return db.query.screens.findMany({
    orderBy: [desc(screens.updatedAt)],
    limit,
    columns: screenCols,
    with: { app: { columns: { id: true, name: true, accent: true } } },
  });
}

/** Everything the screen editor needs, including the full Flutter source (admin only). */
export async function adminScreen(id: number) {
  if (!db || !Number.isInteger(id)) return null;
  const s = await db.query.screens.findFirst({
    where: eq(screens.id, id),
    with: {
      app: { columns: { id: true, name: true, slug: true, accent: true } },
      sources: true,
      props: { orderBy: [asc(screenProps.position)] },
      tags: { with: { tag: true } },
    },
  });
  return s ?? null;
}

export type AdminScreen = NonNullable<Awaited<ReturnType<typeof adminScreen>>>;
