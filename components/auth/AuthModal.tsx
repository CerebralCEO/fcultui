"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { site } from "@/lib/site";
import { CheckIcon, CloseIcon, FlutterIcon, LogoIcon } from "../icons";
import { getLenis } from "../SmoothScroll";
import { useAuthState, type AuthReason } from "./AuthProvider";

const ease = [0.16, 1, 0.3, 1] as const;
const CODE_LEN = 6;
const RESEND_AFTER = 30;

type Step = "email" | "code";

type Handlers = {
  google: () => Promise<string | null>;
  sendCode: (email: string) => Promise<string | null>;
  verify: (code: string) => Promise<string | null>;
  resend: () => Promise<string | null>;
};

/* ---------------------------------------------------------------- */
/* Clerk wiring (only rendered when keys exist)                      */
/* ---------------------------------------------------------------- */

const errCode = (e: unknown) =>
  (e as { errors?: { code?: string }[] })?.errors?.[0]?.code ?? (e as { code?: string })?.code ?? "";
const errMsg = (e: unknown) =>
  (e as { errors?: { longMessage?: string; message?: string }[] })?.errors?.[0]?.longMessage ??
  (e as { longMessage?: string })?.longMessage ??
  (e as { message?: string })?.message ??
  "Something went wrong. Please try again.";

function ClerkForm({ reason }: { reason: AuthReason }) {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const mode = useRef<"signIn" | "signUp">("signIn");

  const handlers: Handlers = {
    google: async () => {
      const { error } = await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: window.location.href,
        redirectCallbackUrl: `${window.location.origin}/sso-callback`,
      });
      return error ? errMsg(error) : null;
    },
    sendCode: async (email) => {
      // Existing account → sign-in code; new email → sign-up code. One flow for both.
      const created = await signIn.create({ identifier: email });
      if (created.error) {
        if (errCode(created.error) !== "form_identifier_not_found") return errMsg(created.error);
        mode.current = "signUp";
        const su = await signUp.create({ emailAddress: email });
        if (su.error) return errMsg(su.error);
        const sent = await signUp.verifications.sendEmailCode();
        return sent.error ? errMsg(sent.error) : null;
      }
      mode.current = "signIn";
      const sent = await signIn.emailCode.sendCode();
      return sent.error ? errMsg(sent.error) : null;
    },
    verify: async (code) => {
      if (mode.current === "signIn") {
        const v = await signIn.emailCode.verifyCode({ code });
        if (v.error) return errMsg(v.error);
        const f = await signIn.finalize();
        return f.error ? errMsg(f.error) : null;
      }
      const v = await signUp.verifications.verifyEmailCode({ code });
      if (v.error) return errMsg(v.error);
      const f = await signUp.finalize();
      return f.error ? errMsg(f.error) : null;
    },
    resend: async () => {
      const r = mode.current === "signIn" ? await signIn.emailCode.sendCode() : await signUp.verifications.sendEmailCode();
      return r.error ? errMsg(r.error) : null;
    },
  };

  return <AuthForm handlers={handlers} reason={reason} />;
}

function DisabledForm({ reason }: { reason: AuthReason }) {
  const msg = "Sign-in isn't configured yet. Add the Clerk keys to .env.local to enable it.";
  const off = async () => msg;
  return <AuthForm handlers={{ google: off, sendCode: off, verify: off, resend: off }} reason={reason} notice={msg} />;
}

/* ---------------------------------------------------------------- */
/* Presentational form                                              */
/* ---------------------------------------------------------------- */

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7Z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1Z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9Z" />
  </svg>
);

function Spinner() {
  return <span className="auth-spinner" aria-hidden />;
}

function OtpInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => refs.current[0]?.focus(), []);

  const setAt = (i: number, digit: string) => {
    const next = (value.padEnd(CODE_LEN, " ").slice(0, i) + digit + value.padEnd(CODE_LEN, " ").slice(i + 1)).replace(/\s+$/, "");
    onChange(next);
  };

  return (
    <div className="auth-otp" onPaste={(e) => {
      const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LEN);
      if (!digits) return;
      e.preventDefault();
      onChange(digits);
      refs.current[Math.min(digits.length, CODE_LEN - 1)]?.focus();
    }}>
      {Array.from({ length: CODE_LEN }, (_, i) => (
        <motion.input
          key={i}
          ref={(el) => void (refs.current[i] = el)}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          value={value[i]?.trim() ?? ""}
          aria-label={`Digit ${i + 1}`}
          className={value[i] && value[i] !== " " ? "filled" : undefined}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 * i, duration: 0.5, ease }}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "").slice(-1);
            if (!d) return;
            setAt(i, d);
            refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              if (value[i] && value[i] !== " ") setAt(i, " ");
              else if (i > 0) {
                setAt(i - 1, " ");
                refs.current[i - 1]?.focus();
              }
            } else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            else if (e.key === "ArrowRight" && i < CODE_LEN - 1) refs.current[i + 1]?.focus();
          }}
        />
      ))}
    </div>
  );
}

function AuthForm({ handlers, reason, notice }: { handlers: Handlers; reason: AuthReason; notice?: string }) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<null | "google" | "email" | "code">(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const run = async (kind: "google" | "email" | "code", fn: () => Promise<string | null>) => {
    setBusy(kind);
    setError(null);
    const e = await fn();
    setBusy(null);
    if (e) setError(e);
    return !e;
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (await run("email", () => handlers.sendCode(email.trim()))) {
      setCode("");
      setStep("code");
      setCooldown(RESEND_AFTER);
    }
  };

  // Verify automatically once all digits are in
  useEffect(() => {
    if (step !== "code" || code.replace(/\s/g, "").length !== CODE_LEN || busy) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void run("code", () => handlers.verify(code)).then((ok) => !ok && setCode(""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, step]);

  const flutter = reason === "flutter";

  return (
    <>
    <AnimatePresence mode="wait" initial={false}>
      {step === "email" ? (
        <motion.div
          key="email"
          className="auth-step"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.35, ease }}
        >
          <div className="auth-head">
            <span className="auth-mark">{flutter ? <FlutterIcon /> : <LogoIcon />}</span>
            <h2>{flutter ? "Unlock Flutter code" : `Sign in to ${site.name}`}</h2>
            <p>
              {flutter
                ? "Flutter source is free for members. Sign in or create a free account to copy it."
                : "Welcome back. Sign in or create a free account."}
            </p>
          </div>

          <button className="auth-google" onClick={() => run("google", handlers.google)} disabled={busy !== null}>
            {busy === "google" ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="auth-or">
            <span>or</span>
          </div>

          <form className="auth-email" onSubmit={submitEmail} noValidate>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              autoFocus
            />
            <button type="submit" className="auth-primary" disabled={busy !== null}>
              {busy === "email" ? <Spinner /> : "Continue with email"}
            </button>
          </form>
          {/* Clerk bot protection mounts its challenge here when required */}
          <div id="clerk-captcha" />
        </motion.div>
      ) : (
        <motion.div
          key="code"
          className="auth-step"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.35, ease }}
        >
          <div className="auth-head">
            <span className="auth-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="m22 7-10 6L2 7" />
              </svg>
            </span>
            <h2>Check your email</h2>
            <p>
              Enter the 6-digit code we sent to <strong>{email}</strong>
            </p>
          </div>
          <OtpInput value={code} onChange={setCode} disabled={busy === "code"} />
          <div className="auth-code-row">
            <button className="auth-link" onClick={() => { setStep("email"); setError(null); }}>
              Use a different email
            </button>
            <button
              className="auth-link"
              disabled={cooldown > 0 || busy !== null}
              onClick={async () => (await run("email", handlers.resend)) && setCooldown(RESEND_AFTER)}
            >
              {cooldown > 0 ? `Resend in 0:${String(cooldown).padStart(2, "0")}` : "Resend code"}
            </button>
          </div>
          {busy === "code" && (
            <p className="auth-verifying">
              <Spinner /> Verifying…
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>

      <AnimatePresence>
        {(error || notice) && (
          <motion.p
            key={error ?? notice}
            className={`auth-error${!error ? " is-notice" : ""}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
          >
            {error ?? notice}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------------------------------------------------------- */
/* Modal shell                                                       */
/* ---------------------------------------------------------------- */

export default function AuthModal() {
  const { modal, closeAuth, enabled, signedIn } = useAuthState();
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Signed in while open → success tick, then close
  useEffect(() => {
    if (!modal.open || !signedIn) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(true);
    const t = setTimeout(() => {
      closeAuth();
      setDone(false);
    }, 1100);
    return () => clearTimeout(t);
  }, [modal.open, signedIn, closeAuth]);

  useEffect(() => {
    if (!modal.open) return;
    getLenis()?.stop();
    document.body.classList.add("scroll-disabled");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAuth();
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      document.body.classList.remove("scroll-disabled");
      window.removeEventListener("keydown", onKey);
    };
  }, [modal.open, closeAuth]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {modal.open && (
        <motion.div
          className="auth-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => e.target === e.currentTarget && closeAuth()}
        >
          <motion.div
            className="auth-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Sign in"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          >
            <button className="auth-close" onClick={closeAuth} aria-label="Close">
              <CloseIcon />
            </button>

            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.div
                  key="done"
                  className="auth-done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                >
                  <span>
                    <CheckIcon />
                  </span>
                  <strong>You&apos;re in</strong>
                  <p>{modal.reason === "flutter" ? "Flutter code unlocked." : "Welcome to F-Cult UI."}</p>
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0 }}>
                  {enabled ? <ClerkForm reason={modal.reason} /> : <DisabledForm reason={modal.reason} />}
                </motion.div>
              )}
            </AnimatePresence>

            {!done && (
              <p className="auth-legal">
                By continuing you agree to our <a href="/about">Terms</a> and <a href="/about">Privacy Policy</a>.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
