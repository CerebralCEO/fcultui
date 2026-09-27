"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { CodeFile } from "@/lib/code-types";
import { useAuthState } from "../auth/AuthProvider";

type Status = "locked" | "loading" | "ready" | "error";
type State = { status: Status; files: Record<string, CodeFile> | null };

const Ctx = createContext<State>({ status: "locked", files: null });
export const useFlutterCode = () => useContext(Ctx);

/**
 * Fetches this page's members-only Flutter source once the visitor is signed in.
 * Signed out → every Flutter pane renders a same-height locked placeholder.
 */
export default function FlutterCodeProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const { signedIn, loaded } = useAuthState();
  const [state, setState] = useState<State>({ status: "locked", files: null });

  useEffect(() => {
    if (!loaded) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!signedIn) {
      setState({ status: "locked", files: null });
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading" }));
    /* eslint-enable react-hooks/set-state-in-effect */
    fetch(`/api/code/${slug}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { files: Record<string, CodeFile> }) => !cancelled && setState({ status: "ready", files: d.files }))
      .catch(() => !cancelled && setState({ status: "error", files: null }));
    return () => {
      cancelled = true;
    };
  }, [slug, signedIn, loaded]);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}
