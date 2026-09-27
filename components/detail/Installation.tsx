"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeFile, FlutterFile } from "@/lib/code-types";
import Segmented from "./Segmented";
import CodeBlock from "./CodeBlock";

type Pair = { flutter: FlutterFile; rn: CodeFile };

export type InstallData = {
  cli: Pair;
  deps: Pair;
  /** Shared design tokens — optional until tokens ship with the content (docs/PLAN.md §5 design_tokens). */
  tokens?: Pair;
  source: Pair;
  usage: Pair;
};

const ease = [0.16, 1, 0.3, 1] as const;

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="step">
      <h3>{title}</h3>
      {children}
    </li>
  );
}

export default function Installation({ data }: { data: InstallData }) {
  const [mode, setMode] = useState<"cli" | "manual">("cli");

  return (
    <div className="install">
      <Segmented
        label="Installation method"
        layoutId="install-mode"
        value={mode}
        onChange={setMode}
        options={[
          { id: "cli", label: "CLI" },
          { id: "manual", label: "Manual" },
        ]}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.ol
          key={mode}
          className="steps"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease }}
        >
          {mode === "cli" ? (
            <>
              <Step title="Run the following command">
                <p className="step-note">Detects your Flutter or React Native project, adds the screen and its design tokens, and installs dependencies.</p>
                <CodeBlock {...data.cli} />
              </Step>
            </>
          ) : (
            <>
              <Step title="Install dependencies">
                <CodeBlock {...data.deps} />
              </Step>
              {data.tokens && (
                <Step title="Add the design tokens">
                  <p className="step-note">Shared by every screen — add it once. Both frameworks read identical values.</p>
                  <CodeBlock {...data.tokens} collapsible />
                </Step>
              )}
              <Step title="Copy the source code">
                <CodeBlock {...data.source} collapsible />
              </Step>
              <Step title="Use it">
                <CodeBlock {...data.usage} />
              </Step>
            </>
          )}
        </motion.ol>
      </AnimatePresence>
    </div>
  );
}
