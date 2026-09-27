"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeFile, FlutterFile } from "@/lib/code-types";
import FrameworkSwitch from "../FrameworkSwitch";
import CodeBlock from "./CodeBlock";
import { CheckIcon, CodeIcon } from "../icons";

const ease = [0.16, 1, 0.3, 1] as const;

/** Source of the selected flow screen: framework switch, copy prompt and a fixed-height, internally scrolling code block. */
export default function CodePanel({
  index,
  label,
  flutter,
  rn,
  prompt,
}: {
  index: number;
  label: string;
  flutter: FlutterFile;
  rn: CodeFile;
  prompt: string;
}) {
  const [prompted, setPrompted] = useState(false);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {}
    setPrompted(true);
    setTimeout(() => setPrompted(false), 1500);
  };

  return (
    <div className="code-panel">
      <div className="preview-bar">
        <p className="code-panel-title">
          <CodeIcon />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease }}
            >
              <em>{String(index + 1).padStart(2, "0")}</em>
              {label}
            </motion.span>
          </AnimatePresence>
        </p>
        <div className="preview-tools">
          <div className="seg seg-fw">
            <FrameworkSwitch variant="solid" />
          </div>
          <button className="tool-btn" onClick={copyPrompt}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={prompted ? "ok" : "p"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                {prompted && <CheckIcon />}
                {prompted ? (
                  "Copied"
                ) : (
                  <>
                    <span className="tool-long">Copy prompt</span>
                    <span className="tool-short">Prompt</span>
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="preview-panel is-code">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={label}
            className="preview-code"
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease }}
          >
            <CodeBlock flutter={flutter} rn={rn} fill />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
