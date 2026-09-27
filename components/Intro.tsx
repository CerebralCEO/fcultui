"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon, SendIcon } from "./icons";
import { useHeroReveal } from "./useHeroReveal";

export default function Intro() {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "submitting" | "success">("idle");
  useHeroReveal(ref);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    setTimeout(() => setState("success"), 900);
  };

  return (
    <section className="intro" ref={ref}>
      <div className="intro-heading">
        <h1 data-reveal>For the love of beautiful &amp; functional websites</h1>
        <div className="newsletter">
          <div className="newsletter-wrapper" data-reveal>
            <p className="newsletter-heading">Receive a weekly digest via email</p>
            <div className="newsletter-form-wrapper">
              <AnimatePresence mode="wait" initial={false}>
                {state !== "success" ? (
                  <motion.form
                    key="form"
                    id="newsletter-form"
                    className={state === "submitting" ? "submitting" : undefined}
                    onSubmit={onSubmit}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="newsletter-form-input-wrapper">
                      <input type="email" name="email" placeholder="Email address" autoComplete="off" required />
                    </div>
                    <button type="submit" aria-label="Subscribe">
                      <ArrowRightIcon />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="ok"
                    className="newsletter-form-success-notice"
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p>Thanks, please confirm via email.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="newsletter-note" data-reveal>
            <p>
              <SendIcon /> Published once per week, unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
