"use client";

import { motion } from "framer-motion";
import type { LockedFile } from "@/lib/code-types";
import { ArrowRightIcon, CheckIcon, FlutterIcon, LockIcon, ReactIcon } from "../icons";
import { useApp } from "../Providers";
import { useAuthState } from "../auth/AuthProvider";

const ease = [0.16, 1, 0.3, 1] as const;

/** Syntax-coloured token classes for the ghost code (kw = keyword, ty = type, fn = call, st = string, pu = punctuation). */
const TOKENS = ["kw", "ty", "fn", "st", "pu", "ty", "pu", "fn"] as const;

/** Deterministic "code-shaped" ghost line — indentation + 1–4 coloured tokens. Contains no real source. */
function ghostLine(i: number) {
  const seed = (i * 2654435761) >>> 0;
  if (i % 9 === 4) return { indent: 0, tokens: [] as { t: string; w: number }[] };
  const depth = [0, 1, 2, 2, 3, 2, 1, 2][i % 8];
  const count = 1 + (seed % 4);
  const tokens = Array.from({ length: count }, (_, k) => ({
    t: TOKENS[(seed >> (k * 3)) % TOKENS.length],
    w: 3 + ((seed >> (k * 5)) % 11),
  }));
  return { indent: depth * 2, tokens };
}

const PERKS = ["Full Dart source, copy-ready", "One-command install with the CLI", "Every Flutter screen — free forever"];

function Emblem({ loading, size = "lg" }: { loading: boolean; size?: "lg" | "sm" }) {
  return (
    <span className={`lock-emblem ${size}`} aria-hidden>
      <span className="lock-emblem-ring" />
      <span className="lock-emblem-tile">
        <FlutterIcon />
      </span>
      <span className={`lock-emblem-badge${loading ? " is-loading" : ""}`}>{loading ? <span className="auth-spinner" /> : <LockIcon />}</span>
    </span>
  );
}

export default function LockedCode({ file, loading, compact }: { file: LockedFile; loading: boolean; compact: boolean }) {
  const { openAuth } = useAuthState();
  const { setFramework } = useApp();
  const unlock = () => openAuth("flutter");

  return (
    <div className={`code-locked${compact ? " is-compact" : ""}`}>
      {/* Sticky, zero-height rail keeps the card in view however long the (ghost) file is */}
      <div className="code-lock-rail">
        <div className="code-lock-veil" aria-hidden />
        <motion.div
          className="lock-card"
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease }}
        >
          {compact ? (
            <>
              <Emblem loading={loading} size="sm" />
              <div className="lock-card-text">
                <strong>{loading ? "Unlocking Flutter code…" : "Flutter source is members-only"}</strong>
                <span>
                  {file.lines} lines of Dart · free with an account
                </span>
              </div>
              {!loading && (
                <button className="lock-primary sm" onClick={unlock}>
                  <LockIcon /> Unlock
                </button>
              )}
            </>
          ) : (
            <>
              <Emblem loading={loading} />
              <span className="lock-chip">
                <i />
                Members only · {file.lines} lines of Dart
              </span>
              <h4>{loading ? "Unlocking the Flutter source…" : "Unlock the Flutter source"}</h4>
              <p className="lock-lead">Free forever. Sign in with Google or email — it takes about ten seconds.</p>
              {!loading && (
                <>
                  <ul className="lock-perks">
                    {PERKS.map((p, i) => (
                      <motion.li
                        key={p}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease }}
                      >
                        <span>
                          <CheckIcon />
                        </span>
                        {p}
                      </motion.li>
                    ))}
                  </ul>
                  <button className="lock-primary" onClick={unlock}>
                    Sign in to unlock
                    <ArrowRightIcon />
                  </button>
                  <button className="lock-secondary" onClick={() => setFramework("rn")}>
                    <ReactIcon /> View React Native code — free
                  </button>
                </>
              )}
            </>
          )}
        </motion.div>
      </div>

      <pre className="code-ghost" aria-hidden>
        {Array.from({ length: file.lines }, (_, i) => {
          const { indent, tokens } = ghostLine(i);
          return (
            <span key={i} className="code-ghost-line" style={{ paddingLeft: `calc(3ch + 32px + ${indent}ch)` }}>
              {tokens.map((tk, k) => (
                <i key={k} className={`g-${tk.t}`} style={{ width: `${tk.w}ch` }} />
              ))}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
