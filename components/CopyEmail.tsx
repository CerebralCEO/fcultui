"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button onClick={copy}>
      <span className="mailto-copy">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "c" : "e"}
            style={{ display: "inline-block" }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {copied ? "Copied" : "Copy email"}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
