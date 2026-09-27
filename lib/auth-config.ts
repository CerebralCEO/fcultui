/**
 * Auth is powered by Clerk, but the site must keep working before keys exist (local dev, previews).
 * Without keys: everyone is signed out, the auth modal explains that sign-in isn't configured,
 * and Flutter code stays locked.
 */
export const authEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
