"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import AuthModal from "./AuthModal";

export type AuthReason = "flutter" | "default";

export type AuthUser = { name: string; email: string; imageUrl?: string };

type AuthCtx = {
  /** Clerk keys are configured. */
  enabled: boolean;
  loaded: boolean;
  signedIn: boolean;
  user: AuthUser | null;
  openAuth: (reason?: AuthReason) => void;
  closeAuth: () => void;
  modal: { open: boolean; reason: AuthReason };
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export const useAuthState = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuthState must be used inside <AuthProvider>");
  return c;
};

type Base = Pick<AuthCtx, "enabled" | "openAuth" | "closeAuth" | "modal">;

/** Reads the live Clerk session. Only rendered inside <ClerkProvider>. */
function ClerkSession({ base, children }: { base: Base; children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();

  const value = useMemo<AuthCtx>(
    () => ({
      ...base,
      loaded: isLoaded,
      signedIn: Boolean(isSignedIn),
      user: user
        ? {
            name: user.fullName || user.firstName || user.primaryEmailAddress?.emailAddress?.split("@")[0] || "Member",
            email: user.primaryEmailAddress?.emailAddress ?? "",
            imageUrl: user.hasImage ? user.imageUrl : undefined,
          }
        : null,
      signOut: () => clerk.signOut(),
    }),
    [base, isLoaded, isSignedIn, user, clerk],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export default function AuthProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const [modal, setModal] = useState<{ open: boolean; reason: AuthReason }>({ open: false, reason: "default" });
  const openAuth = useCallback((reason: AuthReason = "default") => setModal({ open: true, reason }), []);
  const closeAuth = useCallback(() => setModal((m) => ({ ...m, open: false })), []);
  const base = useMemo<Base>(() => ({ enabled, openAuth, closeAuth, modal }), [enabled, openAuth, closeAuth, modal]);

  if (enabled) {
    return (
      <ClerkSession base={base}>
        {children}
        <AuthModal />
      </ClerkSession>
    );
  }

  return (
    <Ctx.Provider value={{ ...base, loaded: true, signedIn: false, user: null, signOut: async () => {} }}>
      {children}
      <AuthModal />
    </Ctx.Provider>
  );
}
