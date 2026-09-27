import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { authEnabled } from "@/lib/auth-config";

/**
 * Next 16 "proxy" (formerly middleware). Clerk attaches the session so route handlers can call `auth()`.
 * Without Clerk keys it is a no-op, so the site still runs.
 * Admin protection (/admin) is added in roadmap step B/C.
 */
export default authEnabled ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
