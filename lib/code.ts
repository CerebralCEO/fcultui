/**
 * Build-time code pipeline (server only): reads the Flutter / React Native sources in `content/code`,
 * personalises them for a screen (component name, accent colour) and pre-highlights them with Shiki.
 * The client never ships a highlighter — it receives ready HTML.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createHighlighter, type Highlighter } from "shiki";
import type { ScreenDesign } from "./data";
import { designMeta, pascal, snake } from "./screen-meta";

export type Lang = "dart" | "tsx" | "ts" | "bash" | "yaml";

export type CodeFile = {
  filename: string;
  lang: Lang;
  code: string;
  html: string;
};

export type ScreenCode = {
  name: string;
  flutter: CodeFile;
  rn: CodeFile;
  flutterUsage: CodeFile;
  rnUsage: CodeFile;
};

const ROOT = path.join(process.cwd(), "content", "code");

let highlighter: Promise<Highlighter> | null = null;
const getHighlighter = () =>
  (highlighter ??= createHighlighter({
    themes: ["github-dark-default", "github-light-default"],
    langs: ["dart", "tsx", "ts", "bash", "yaml"],
  }));

export async function highlight(code: string, lang: Lang) {
  const hl = await getHighlighter();
  return hl.codeToHtml(code.trimEnd(), {
    lang,
    themes: { dark: "github-dark-default", light: "github-light-default" },
    defaultColor: false,
  });
}

async function file(filename: string, lang: Lang, code: string): Promise<CodeFile> {
  return { filename, lang, code: code.trimEnd(), html: await highlight(code, lang) };
}

const fill = (src: string, name: string, title: string, accent: string) =>
  src.replaceAll("__NAME__", name).replaceAll("__TITLE__", title).replaceAll("__ACCENT__", accent.replace("#", "").toUpperCase());

/** Code for one design, personalised as `<name>Screen`. */
export async function getScreenCode(design: ScreenDesign, title: string, accent: string): Promise<ScreenCode> {
  const name = pascal(title);
  const [dart, tsx] = await Promise.all([
    readFile(path.join(ROOT, design, "screen.dart"), "utf8"),
    readFile(path.join(ROOT, design, "Screen.tsx"), "utf8"),
  ]);

  const dartFile = `lib/screens/${snake(title)}_screen.dart`;
  const tsxFile = `src/screens/${name}Screen.tsx`;

  const [flutter, rn, flutterUsage, rnUsage] = await Promise.all([
    file(dartFile, "dart", fill(dart, name, title, accent)),
    file(tsxFile, "tsx", fill(tsx, name, title, accent)),
    file(
      "lib/main.dart",
      "dart",
      `import 'package:flutter/material.dart';
import 'screens/${snake(title)}_screen.dart';

void main() => runApp(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(fontFamily: 'Inter'),
        home: const ${name}Screen(),
      ),
    );`,
    ),
    file(
      "App.tsx",
      "tsx",
      `import { SafeAreaProvider } from "react-native-safe-area-context";
import { ${name}Screen } from "./src/screens/${name}Screen";

export default function App() {
  return (
    <SafeAreaProvider>
      <${name}Screen />
    </SafeAreaProvider>
  );
}`,
    ),
  ]);

  return { name, flutter, rn, flutterUsage, rnUsage };
}

/** Shared token files + install snippets (same for every screen). */
export async function getSharedCode(design: ScreenDesign) {
  const [dartTokens, tsTokens] = await Promise.all([
    readFile(path.join(ROOT, "_shared", "tokens.dart"), "utf8"),
    readFile(path.join(ROOT, "_shared", "tokens.ts"), "utf8"),
  ]);
  const deps = designMeta[design].rnDeps;

  const [flutterTokens, rnTokens, flutterDeps, rnDeps, fonts] = await Promise.all([
    file("lib/fcult/tokens.dart", "dart", dartTokens),
    file("src/fcult/tokens.ts", "ts", tsTokens),
    file("Terminal", "bash", "flutter pub get"),
    file("Terminal", "bash", `npx expo install ${deps.join(" ")}`),
    file(
      "pubspec.yaml",
      "yaml",
      `flutter:
  fonts:
    - family: Inter
      fonts:
        - asset: assets/fonts/Inter-Variable.ttf`,
    ),
  ]);

  return { flutterTokens, rnTokens, flutterDeps, rnDeps, fonts };
}

export async function cliCommand(slug: string) {
  const [flutter, rn] = await Promise.all([
    file("Terminal", "bash", `npx fcultui@latest add ${slug} --flutter`),
    file("Terminal", "bash", `npx fcultui@latest add ${slug} --react-native`),
  ]);
  return { flutter, rn };
}
