"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { addScreen, deleteScreen, saveScreen, setScreenStatus, type ScreenInput, type SourceInput } from "@/app/admin/actions";
import type { PropRow } from "@/lib/content-types";
import { ScaledDevice } from "../device/Device";
import ScreenView from "../device/ScreenView";
import Segmented from "../detail/Segmented";
import PlatformToggle from "../PlatformToggle";
import { useApp } from "../Providers";
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon, CloseIcon, FlutterIcon, ReactIcon } from "../icons";
import CodeEditor, { monacoLanguage } from "./CodeEditor";
import { ConfirmButton, Field, Spinner, StatusBadge, useToast, type Status } from "./ui";
import { Stepper, type StepItem } from "./Steps";

/** The upload flow for one screen. Every step stays reachable; "Continue" saves and moves on. */
export type EditorStep = "details" | "flutter" | "rn" | "props" | "publish";
type Fw = "flutter" | "rn";

const ORDER: EditorStep[] = ["details", "flutter", "rn", "props", "publish"];
const STEP_LABEL: Record<EditorStep, string> = {
  details: "Details",
  flutter: "Flutter",
  rn: "React Native",
  props: "Props",
  publish: "Review & publish",
};

const ease = [0.16, 1, 0.3, 1] as const;
const EMPTY_PROP: PropRow = { name: "", flutter: "", rn: "", default: "", description: "" };

const defaultPath = (fw: Fw, title: string) => {
  const words = title.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(" ").filter(Boolean);
  const pascal = words.map((w) => w[0].toUpperCase() + w.slice(1)).join("") || "Screen";
  const snake = pascal.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
  return fw === "flutter" ? `lib/screens/${snake}_screen.dart` : `src/screens/${pascal}Screen.tsx`;
};

export default function ScreenEditor({
  id,
  status,
  app,
  initial,
  initialStep = "details",
  flow,
}: {
  id: number;
  status: Status;
  app: { id: number; name: string; slug: string; accent: string };
  initial: ScreenInput;
  initialStep?: EditorStep;
  /** Position in the app's flow and the screen after this one. */
  flow: { index: number; total: number; next: { id: number; label: string } | null };
}) {
  const router = useRouter();
  const { platform } = useApp();
  const { toast, show } = useToast();
  const [tab, setTab] = useState<EditorStep>(initialStep);
  const fw: Fw = tab === "rn" ? "rn" : "flutter";
  const [adding, startAdd] = useTransition();
  const [v, setV] = useState<ScreenInput>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [saving, startSave] = useTransition();
  const [publishing, startPublish] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [tagDraft, setTagDraft] = useState("");

  const dirty = useMemo(() => JSON.stringify(v) !== saved, [v, saved]);

  const patch = <K extends keyof ScreenInput>(k: K, value: ScreenInput[K]) => setV((p) => ({ ...p, [k]: value }));
  const patchSrc = (f: Fw, s: Partial<SourceInput>) => setV((p) => ({ ...p, [f]: { ...p[f], ...s } }));

  const save = useCallback(
    (then?: () => void) =>
      startSave(async () => {
        const r = await saveScreen(id, v);
        if (!r.ok) return show(r.error, "error");
        setSaved(JSON.stringify(v));
        show("Saved");
        router.refresh();
        then?.();
      }),
    [id, v, router, show],
  );

  // ⌘/Ctrl+S saves; leaving with unsaved edits asks first
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty) save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [dirty, save]);

  const publish = (next: "live" | "draft") =>
    startPublish(async () => {
      if (dirty) {
        const r = await saveScreen(id, v);
        if (!r.ok) return show(r.error, "error");
        setSaved(JSON.stringify(v));
      }
      const r = await setScreenStatus(id, next);
      if (!r.ok) return show(r.error, "error");
      show(next === "live" ? "Published — it's live on the site" : "Moved back to draft");
      router.refresh();
    });

  const addTag = () => {
    const t = tagDraft.trim().replace(/,$/, "");
    if (t && !v.tags.includes(t)) patch("tags", [...v.tags, t]);
    setTagDraft("");
  };

  const src = v[fw];
  const path = src.path || defaultPath(fw, v.title);
  const hasCode = { flutter: Boolean(v.flutter.code.trim()), rn: Boolean(v.rn.code.trim()) };
  const preview = { slug: v.slug, label: v.label || "Screen", title: v.title, tone: v.tone, bundleUrl: null };

  // Step completeness (props are optional)
  const detailsDone = Boolean(v.title.trim() && v.label.trim() && v.slug.trim());
  const ready = detailsDone && hasCode.flutter && hasCode.rn;
  const steps: StepItem<EditorStep>[] = [
    { id: "details", label: "Details", hint: "Title, label, tone", state: detailsDone ? "done" : "todo" },
    { id: "flutter", label: "Flutter", hint: "Dart source", state: hasCode.flutter ? "done" : "todo" },
    { id: "rn", label: "React Native", hint: "TSX source", state: hasCode.rn ? "done" : "todo" },
    { id: "props", label: "Props", hint: "Optional", state: v.props.length ? "done" : "optional" },
    { id: "publish", label: "Publish", hint: status === "live" ? "Live" : "Review", state: status === "live" && !dirty ? "done" : "todo" },
  ];
  const at = ORDER.indexOf(tab);
  const nextStep = ORDER[at + 1];
  const prevStep = ORDER[at - 1];

  // Continue saves pending edits first, then moves on
  const go = (to: EditorStep) => {
    const move = () => {
      setTab(to);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    if (dirty) save(move);
    else move();
  };

  const addNext = () =>
    startAdd(async () => {
      const r = await addScreen(app.id);
      if (r.ok) router.push(`/admin/screens/${r.id}`);
      else show(r.error, "error");
    });

  return (
    <div className="admin-editor-page">
      {/* ---------- Head ---------- */}
      <header className="admin-head">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/admin">Admin</Link>
          <span>/</span>
          <Link href="/admin/apps">Apps</Link>
          <span>/</span>
          <Link href={`/admin/apps/${app.id}`}>{app.name}</Link>
          <span>/</span>
          <strong>{v.label || "Screen"}</strong>
        </nav>
        <div className="admin-head-row">
          <h1>
            {v.title || "Untitled screen"} <StatusBadge status={status} />
          </h1>
          <div className="admin-head-actions">
            <AnimatePresence>
              {dirty && (
                <motion.span
                  className="admin-dirty"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.25, ease }}
                >
                  <i /> Unsaved
                </motion.span>
              )}
            </AnimatePresence>
            {status === "live" && (
              <Link href={`/screens/${app.slug}`} className="tool-btn" target="_blank">
                <span>
                  View <ArrowUpRightIcon />
                </span>
              </Link>
            )}
            <button type="button" className="tool-btn" onClick={() => save()} disabled={saving || !dirty}>
              <span>{saving ? <Spinner /> : "Save"}</span>
            </button>
          </div>
        </div>
        <p className="admin-flow-pos">
          Screen {String(flow.index + 1).padStart(2, "0")} of {String(flow.total).padStart(2, "0")} in {app.name}
          {flow.index === 0 && " · gallery cover"}
        </p>
        <Stepper steps={steps} active={tab} onSelect={go} layoutId="admin-editor-step" />
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease }}
        >
          {/* ---------- Details ---------- */}
          {tab === "details" && (
            <div className="admin-split">
              <div className="admin-card admin-form">
                <div className="admin-form-grid">
                  <Field label="Title" hint="Full name, used for the component (e.g. “Ledger Sign In” → LedgerSignInScreen).">
                    <input className="admin-input" value={v.title} onChange={(e) => patch("title", e.target.value)} />
                  </Field>
                  <Field label="Label" hint="Short step name in the flow strip.">
                    <input className="admin-input" value={v.label} onChange={(e) => patch("label", e.target.value)} placeholder="Sign in" />
                  </Field>
                  <Field label="Slug">
                    <input className="admin-input mono" value={v.slug} onChange={(e) => patch("slug", e.target.value)} />
                  </Field>
                  <Field label="Tagline">
                    <input className="admin-input" value={v.tagline} onChange={(e) => patch("tagline", e.target.value)} placeholder="Email & social login" />
                  </Field>
                  <Field label="Description" hint="Lead paragraph on the detail page (cover screen) and the AI prompt." wide>
                    <textarea className="admin-input" rows={3} value={v.description} onChange={(e) => patch("description", e.target.value)} />
                  </Field>
                  <Field label="Tone" hint="Status bar & home indicator colour.">
                    <Segmented<"dark" | "light">
                      label="Tone"
                      layoutId="admin-tone"
                      value={v.tone}
                      onChange={(t) => patch("tone", t)}
                      options={[
                        { id: "dark", label: "Dark" },
                        { id: "light", label: "Light" },
                      ]}
                    />
                  </Field>
                  <Field label="Badge">
                    <Segmented<"" | "new" | "updated">
                      label="Badge"
                      layoutId="admin-badge"
                      value={v.badge}
                      onChange={(b) => patch("badge", b)}
                      options={[
                        { id: "", label: "None" },
                        { id: "new", label: "New" },
                        { id: "updated", label: "Updated" },
                      ]}
                    />
                  </Field>
                  <Field label="Tags" hint="Press Enter or comma to add." wide>
                    <span className="admin-tags">
                      {v.tags.map((t) => (
                        <span key={t} className="admin-tag">
                          {t}
                          <button type="button" aria-label={`Remove ${t}`} onClick={() => patch("tags", v.tags.filter((x) => x !== t))}>
                            <CloseIcon />
                          </button>
                        </span>
                      ))}
                      <input
                        value={tagDraft}
                        onChange={(e) => setTagDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addTag();
                          } else if (e.key === "Backspace" && !tagDraft && v.tags.length) patch("tags", v.tags.slice(0, -1));
                        }}
                        onBlur={addTag}
                        placeholder={v.tags.length ? "" : "Dashboard, Chart…"}
                      />
                    </span>
                  </Field>
                </div>
                <div className="admin-actions">
                  <ConfirmButton
                    label="Delete screen"
                    confirm="Delete this screen for good?"
                    busy={deleting}
                    onConfirm={() =>
                      startDelete(async () => {
                        const r = await deleteScreen(id);
                        if (r.ok) router.push(`/admin/apps/${app.id}`);
                        else show(r.error, "error");
                      })
                    }
                  />
                </div>
              </div>

              <aside className="admin-card admin-device">
                <div className="admin-device-head">
                  <span className="admin-label">Preview</span>
                  <PlatformToggle id="admin" />
                </div>
                <div className="admin-device-stage">
                  <ScaledDevice platform={platform} tone={v.tone} playing accent={app.accent} fit={0.94}>
                    <ScreenView step={preview} />
                  </ScaledDevice>
                </div>
                <p className="admin-hint">Live renders arrive with the React Native and Flutter pipelines.</p>
              </aside>
            </div>
          )}

          {/* ---------- Code ---------- */}
          {(tab === "flutter" || tab === "rn") && (
            <div className="admin-card admin-code">
              <div className="admin-step-intro">
                <span className="admin-step-icon">{fw === "flutter" ? <FlutterIcon /> : <ReactIcon />}</span>
                <span>
                  <strong>{fw === "flutter" ? "Flutter source" : "React Native source"}</strong>
                  <em>
                    {fw === "flutter"
                      ? "Paste the Dart widget, or drop the .dart file onto the editor. It stays members-only on the site."
                      : "Paste the Expo component, or drop the .tsx file onto the editor. It is public on the site."}
                  </em>
                </span>
                <span className="admin-code-state">
                  <i className={hasCode.flutter ? "on" : undefined} /> Flutter
                  <i className={hasCode.rn ? "on" : undefined} /> React Native
                </span>
              </div>

              <div className="admin-form-grid">
                <Field label="File path">
                  <input
                    className="admin-input mono"
                    value={src.path}
                    placeholder={defaultPath(fw, v.title)}
                    onChange={(e) => patchSrc(fw, { path: e.target.value })}
                  />
                </Field>
                <Field label={fw === "flutter" ? "pub packages" : "Expo packages"} hint="Comma separated.">
                  <input
                    className="admin-input mono"
                    value={src.deps.join(", ")}
                    placeholder={fw === "flutter" ? "google_fonts" : "react-native-reanimated, expo-linear-gradient"}
                    onChange={(e) => patchSrc(fw, { deps: e.target.value.split(",").map((x) => x.trimStart()) })}
                  />
                </Field>
              </div>

              <div className="admin-code-block">
                <span className="admin-label">
                  Source <em>Drop a {fw === "flutter" ? ".dart" : ".tsx"} file onto the editor to load it</em>
                </span>
                <CodeEditor
                  key={`${fw}-source`}
                  path={`${id}/${fw}/${path}`}
                  language={monacoLanguage(path)}
                  height={560}
                  value={src.code}
                  onChange={(code) => patchSrc(fw, { code })}
                  onDropFile={(name, text) => patchSrc(fw, { code: text, ...(src.path ? {} : { path: defaultPath(fw, v.title).replace(/[^/]+$/, name) }) })}
                />
              </div>

              <div className="admin-code-block">
                <span className="admin-label">
                  Usage <em>Optional — defaults to a {fw === "flutter" ? "main.dart" : "App.tsx"} that renders the screen</em>
                </span>
                <CodeEditor
                  key={`${fw}-usage`}
                  path={`${id}/${fw}/usage`}
                  language={fw === "flutter" ? "dart" : "typescript"}
                  height={200}
                  value={src.usage}
                  onChange={(usage) => patchSrc(fw, { usage })}
                />
              </div>
            </div>
          )}

          {/* ---------- Props ---------- */}
          {tab === "props" && (
            <div className="admin-card admin-props">
              {v.props.length === 0 ? (
                <p className="admin-empty-line">No props yet. Screens without props are dropped in as is.</p>
              ) : (
                <div className="admin-props-grid">
                  <span className="admin-label">Name</span>
                  <span className="admin-label">Flutter type</span>
                  <span className="admin-label">React Native type</span>
                  <span className="admin-label">Default</span>
                  <span className="admin-label">Description</span>
                  <span />
                  {v.props.map((p, i) => {
                    const setP = (k: keyof PropRow) => (e: React.ChangeEvent<HTMLInputElement>) =>
                      patch(
                        "props",
                        v.props.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)),
                      );
                    return (
                      <motion.div
                        key={i}
                        className="admin-props-row"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease }}
                      >
                        <input className="admin-input mono" value={p.name} onChange={setP("name")} placeholder="accent" aria-label="Name" />
                        <input className="admin-input mono" value={p.flutter} onChange={setP("flutter")} placeholder="Color" aria-label="Flutter type" />
                        <input className="admin-input mono" value={p.rn} onChange={setP("rn")} placeholder="string" aria-label="React Native type" />
                        <input className="admin-input mono" value={p.default} onChange={setP("default")} placeholder="#6D5DF6" aria-label="Default" />
                        <input className="admin-input" value={p.description} onChange={setP("description")} placeholder="What it controls" aria-label="Description" />
                        <button
                          type="button"
                          className="admin-icon-btn"
                          aria-label={`Remove ${p.name || "prop"}`}
                          onClick={() => patch("props", v.props.filter((_, j) => j !== i))}
                        >
                          <CloseIcon />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              <div className="admin-actions">
                <span className="admin-hint">Same API in both frameworks — one row per parameter.</span>
                <button type="button" className="tool-btn" onClick={() => patch("props", [...v.props, { ...EMPTY_PROP }])}>
                  <span>Add prop</span>
                </button>
              </div>
            </div>
          )}

          {/* ---------- Review & publish ---------- */}
          {tab === "publish" && (
            <div className="admin-card admin-review">
              <ul className="admin-checklist">
                {(
                  [
                    { ok: detailsDone, label: "Details", note: detailsDone ? `${v.title} · ${v.label}` : "Title, label and slug are required", to: "details" },
                    { ok: hasCode.flutter, label: "Flutter source", note: hasCode.flutter ? `${v.flutter.code.split("\n").length} lines` : "Required", to: "flutter" },
                    { ok: hasCode.rn, label: "React Native source", note: hasCode.rn ? `${v.rn.code.split("\n").length} lines` : "Required", to: "rn" },
                    { ok: true, optional: !v.props.length, label: "Props", note: v.props.length ? `${v.props.length} props` : "None — optional", to: "props" },
                  ] as { ok: boolean; optional?: boolean; label: string; note: string; to: EditorStep }[]
                ).map((c) => (
                  <li key={c.label} className={c.ok ? (c.optional ? "is-optional" : "is-done") : "is-todo"}>
                    <span className="admin-step-num">{c.ok && !c.optional ? <CheckIcon /> : c.optional ? "–" : "!"}</span>
                    <span className="admin-step-text">
                      <strong>{c.label}</strong>
                      <em>{c.note}</em>
                    </span>
                    <button type="button" className="tool-btn" onClick={() => go(c.to)}>
                      <span>{c.ok ? "Edit" : "Add"}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {status === "live" && !dirty ? (
                <div className="admin-review-done">
                  <strong>
                    <CheckIcon /> Live on the site
                  </strong>
                  <p>Edits you save go live straight away.</p>
                  <div className="admin-actions">
                    <button type="button" className="admin-danger" onClick={() => publish("draft")} disabled={publishing}>
                      {publishing ? <Spinner /> : "Unpublish"}
                    </button>
                    <Link href={`/screens/${app.slug}${flow.index > 0 ? `?screen=${flow.index}` : ""}`} className="tool-btn" target="_blank">
                      <span>
                        View on site <ArrowUpRightIcon />
                      </span>
                    </Link>
                    {flow.next ? (
                      <Link href={`/admin/screens/${flow.next.id}`} className="admin-primary sm">
                        Next screen: {flow.next.label} <ArrowRightIcon />
                      </Link>
                    ) : (
                      <button type="button" className="admin-primary sm" onClick={addNext} disabled={adding}>
                        {adding ? <Spinner /> : <>Add another screen <ArrowRightIcon /></>}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="admin-actions">
                  <span className="admin-hint">
                    {ready ? "Everything required is in place. Publishing makes this screen public." : "Finish the required steps to publish."}
                  </span>
                  <Link href={`/admin/apps/${app.id}`} className="tool-btn">
                    <span>Back to app</span>
                  </Link>
                  <button type="button" className="admin-primary" onClick={() => publish("live")} disabled={publishing || !ready}>
                    {publishing ? <Spinner /> : status === "live" ? "Save & keep live" : "Publish screen"}
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {tab !== "publish" && (
        <nav className="admin-step-nav" aria-label="Step navigation">
          {prevStep ? (
            <button type="button" className="tool-btn" onClick={() => go(prevStep)}>
              <span>← {STEP_LABEL[prevStep]}</span>
            </button>
          ) : (
            <Link href={`/admin/apps/${app.id}`} className="tool-btn">
              <span>← {app.name}</span>
            </Link>
          )}
          <span className="admin-step-count">
            Step {at + 1} of {ORDER.length}
          </span>
          {nextStep && (
            <button type="button" className="admin-primary" onClick={() => go(nextStep)} disabled={saving}>
              {saving ? <Spinner /> : <>{dirty ? "Save & continue" : "Continue"}<span className="step-long"> to {STEP_LABEL[nextStep]}</span> <ArrowRightIcon /></>}
            </button>
          )}
        </nav>
      )}
      {toast}
    </div>
  );
}
