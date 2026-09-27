/** Client-safe code types (lib/code.ts is server-only because it reads the filesystem). */

export type Lang = "dart" | "tsx" | "ts" | "bash" | "yaml";

export type CodeFile = {
  filename: string;
  lang: Lang;
  code: string;
  html: string;
};

/**
 * Stand-in for Flutter source that the viewer isn't allowed to see yet.
 * Carries no code — only what's needed to draw a same-height placeholder.
 */
export type LockedFile = {
  locked: true;
  /** Key into the /api/code/[slug] response. */
  key: string;
  filename: string;
  lang: Lang;
  lines: number;
};

export type FlutterFile = CodeFile | LockedFile;

export const isLocked = (f: FlutterFile | undefined): f is LockedFile => Boolean(f && "locked" in f);

export const lockFile = (f: CodeFile, key: string): LockedFile => ({
  locked: true,
  key,
  filename: f.filename,
  lang: f.lang,
  lines: f.code.split("\n").length,
});
