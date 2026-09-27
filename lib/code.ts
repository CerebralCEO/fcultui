/**
 * Code pipeline (server only): turns a screen's uploaded Flutter / React Native sources (Neon) into
 * ready-to-render CodeFiles. Sources are highlighted at save time by the admin panel; anything missing
 * `highlighted` HTML is highlighted here with Shiki. The client never ships a highlighter.
 */
import "server-only";
import { createHighlighter, type Highlighter } from "shiki";
import type { CodeFile, Lang } from "./code-types";
import type { ScreenDetail, SourceSet, StepDetail } from "./content";

export type { CodeFile, Lang } from "./code-types";

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

async function file(filename: string, lang: Lang, code: string, html?: string | null): Promise<CodeFile> {
  return { filename, lang, code: code.trimEnd(), html: html ?? (await highlight(code, lang)) };
}

export const pascal = (s: string) =>
  s
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");

export const snake = (s: string) => pascal(s).replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

const langOf = (path: string): Lang => {
  const ext = path.split(".").pop()?.toLowerCase();
  if (ext === "dart") return "dart";
  if (ext === "ts") return "ts";
  if (ext === "yaml" || ext === "yml") return "yaml";
  return "tsx";
};

const main = (set: SourceSet | null, fallback: { path: string; note: string }) => {
  const f = set?.files[0];
  return f
    ? file(f.path, langOf(f.path), f.content, f.html)
    : file(fallback.path, langOf(fallback.path), fallback.note);
};

export type StepCode = {
  name: string;
  flutter: CodeFile;
  rn: CodeFile;
  flutterUsage: CodeFile;
  rnUsage: CodeFile;
  flutterDeps: CodeFile;
  rnDeps: CodeFile;
};

async function stepCode(step: StepDetail): Promise<StepCode> {
  const name = pascal(step.title);
  const dartPath = `lib/screens/${snake(step.title)}_screen.dart`;
  const tsxPath = `src/screens/${name}Screen.tsx`;

  const [flutter, rn, flutterUsage, rnUsage, flutterDeps, rnDeps] = await Promise.all([
    main(step.flutter, { path: dartPath, note: "// Flutter source has not been uploaded for this screen yet." }),
    main(step.rn, { path: tsxPath, note: "// React Native source has not been uploaded for this screen yet." }),
    file(
      "lib/main.dart",
      "dart",
      step.flutter?.usage ||
        `import 'package:flutter/material.dart';
import 'screens/${snake(step.title)}_screen.dart';

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
      step.rn?.usage ||
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
    file("Terminal", "bash", step.flutter?.deps.length ? `flutter pub add ${step.flutter.deps.join(" ")}` : "flutter pub get"),
    file(
      "Terminal",
      "bash",
      `npx expo install ${(step.rn?.deps.length ? step.rn.deps : ["react-native-safe-area-context"]).join(" ")}`,
    ),
  ]);

  return { name, flutter, rn, flutterUsage, rnUsage, flutterDeps, rnDeps };
}

export async function cliCommand(slug: string) {
  const [flutter, rn] = await Promise.all([
    file("Terminal", "bash", `npx fcultui@latest add ${slug} --flutter`),
    file("Terminal", "bash", `npx fcultui@latest add ${slug} --react-native`),
  ]);
  return { flutter, rn };
}

/** Everything the details page shows for one app: code for every step of its flow + the CLI command. */
export async function getScreenBundle(detail: ScreenDetail) {
  const [steps, cli] = await Promise.all([Promise.all(detail.steps.map(stepCode)), cliCommand(detail.slug)]);
  return { steps, cli };
}

export type ScreenBundle = Awaited<ReturnType<typeof getScreenBundle>>;

/** Keys shared by the page's LockedFile stubs and /api/code/[slug]. */
export const flutterKey = (i: number, part: "source" | "usage") => `s${i}-${part}`;

/** The Flutter files gated behind sign-in, keyed so LockedFile stubs can be swapped for the real code. */
export function flutterFiles(b: ScreenBundle): Record<string, CodeFile> {
  return Object.fromEntries(
    b.steps.flatMap((s, i) => [
      [flutterKey(i, "source"), s.flutter],
      [flutterKey(i, "usage"), s.flutterUsage],
    ]),
  );
}
