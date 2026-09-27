import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { authEnabled } from "@/lib/auth-config";
import { getScreen } from "@/lib/content";
import { flutterFiles, getScreenBundle } from "@/lib/code";

/**
 * Flutter source is members-only: it is never embedded in the page, only served here
 * to a signed-in Clerk session. React Native code stays public in the page HTML.
 */
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/code/[slug]">) {
  if (!authEnabled) return NextResponse.json({ error: "auth_not_configured" }, { status: 401 });

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await ctx.params;
  const screen = await getScreen(slug);
  if (!screen) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const files = flutterFiles(await getScreenBundle(screen));
  return NextResponse.json({ files }, { headers: { "Cache-Control": "private, no-store" } });
}
