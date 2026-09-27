import { eq } from "drizzle-orm";
import { db } from "@/db";
import { logos } from "@/db/schema";

/** Serves a library logo. A logo row never changes after upload, so it is cached for a year. */
export async function GET(_req: Request, ctx: RouteContext<"/api/logos/[id]">) {
  const id = Number((await ctx.params).id);
  if (!db || !Number.isInteger(id)) return new Response("Not found", { status: 404 });

  const [row] = await db.select({ mime: logos.mime, data: logos.data }).from(logos).where(eq(logos.id, id)).limit(1);
  if (!row) return new Response("Not found", { status: 404 });

  return new Response(Buffer.from(row.data, "base64"), {
    headers: {
      "Content-Type": row.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      // Uploaded SVGs render as images only — no scripts, no external loads
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
    },
  });
}
