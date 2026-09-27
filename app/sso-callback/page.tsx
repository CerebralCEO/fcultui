"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { authEnabled } from "@/lib/auth-config";

/**
 * Google OAuth lands here. Clerk finishes the session and redirects to the `redirectUrl`
 * passed to `signIn.sso()` — i.e. the exact page the user started from.
 */
export default function SSOCallbackPage() {
  return (
    <div className="sso-callback">
      <span className="auth-spinner" aria-hidden />
      <p>Signing you in…</p>
      {authEnabled && <AuthenticateWithRedirectCallback />}
      <div id="clerk-captcha" />
    </div>
  );
}
