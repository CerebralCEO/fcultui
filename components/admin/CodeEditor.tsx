"use client";

import { useState } from "react";
import Editor, { type BeforeMount } from "@monaco-editor/react";
import { useApp } from "../Providers";
import { Spinner } from "./ui";

/** Themes mirror the site's code blocks: `--color--code-background`, muted gutter, no chrome. */
const beforeMount: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("fcult-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#0c0c0c",
      "editor.lineHighlightBackground": "#161616",
      "editor.lineHighlightBorder": "#00000000",
      "editorLineNumber.foreground": "#3e3e3e",
      "editorLineNumber.activeForeground": "#939393",
      "editorGutter.background": "#0c0c0c",
      "editor.selectionBackground": "#2c2c2c",
      "editorIndentGuide.background1": "#1f1f1f",
      "editorWidget.background": "#181818",
      "editorWidget.border": "#333333",
      "scrollbarSlider.background": "#ffffff14",
      "scrollbarSlider.hoverBackground": "#ffffff24",
    },
  });
  monaco.editor.defineTheme("fcult-light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#fafafa",
      "editor.lineHighlightBackground": "#f1f1f1",
      "editor.lineHighlightBorder": "#00000000",
      "editorLineNumber.foreground": "#cbcbcb",
      "editorLineNumber.activeForeground": "#6c6c6c",
      "editorGutter.background": "#fafafa",
    },
  });
  // Uploaded screens import packages Monaco can't resolve — highlight only, no diagnostics
  const ts = monaco.languages.typescript;
  ts.typescriptDefaults.setDiagnosticsOptions({ noSemanticValidation: true, noSyntaxValidation: true });
  ts.typescriptDefaults.setCompilerOptions({ jsx: ts.JsxEmit.Preserve, allowNonTsExtensions: true });
};

export const monacoLanguage = (path: string) => {
  const ext = path.split(".").pop()?.toLowerCase();
  if (ext === "dart") return "dart";
  if (ext === "yaml" || ext === "yml") return "yaml";
  return "typescript";
};

export default function CodeEditor({
  value,
  onChange,
  language,
  height,
  path,
  onDropFile,
}: {
  value: string;
  onChange: (v: string) => void;
  language: string;
  height: number;
  /** Model URI — keeps one undo stack per file. */
  path: string;
  /** Drag a .dart / .tsx file onto the editor to load it. */
  onDropFile?: (name: string, text: string) => void;
}) {
  const { theme } = useApp();
  const [over, setOver] = useState(false);

  return (
    <div
      className={`admin-editor${over ? " is-over" : ""}`}
      style={{ height }}
      data-lenis-prevent
      onDragOver={(e) => {
        if (!onDropFile || !e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={async (e) => {
        if (!onDropFile) return;
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files[0];
        if (f) onDropFile(f.name, await f.text());
      }}
    >
      <Editor
        path={path}
        value={value}
        language={language}
        theme={theme === "light" ? "fcult-light" : "fcult-dark"}
        beforeMount={beforeMount}
        onChange={(v) => onChange(v ?? "")}
        loading={
          <span className="admin-editor-loading">
            <Spinner /> Loading editor…
          </span>
        }
        options={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: 13,
          lineHeight: 22,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          renderLineHighlight: "line",
          padding: { top: 14, bottom: 14 },
          tabSize: 2,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
          automaticLayout: true,
        }}
      />
      {over && <div className="admin-editor-drop">Drop to load the file</div>}
    </div>
  );
}
