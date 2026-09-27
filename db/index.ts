import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/** True when DATABASE_URL is set; pages fall back to empty content without it. */
export const dbEnabled = Boolean(process.env.DATABASE_URL);

export const db = dbEnabled ? drizzle(neon(process.env.DATABASE_URL!), { schema }) : null;
