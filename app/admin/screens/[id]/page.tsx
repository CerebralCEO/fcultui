import { notFound } from "next/navigation";
import ScreenEditor from "@/components/admin/ScreenEditor";
import { requireAdmin } from "@/lib/admin";
import { adminAppProgress, adminScreen } from "@/lib/admin-queries";
import type { ScreenInput, SourceInput } from "../../actions";
import type { EditorStep } from "@/components/admin/ScreenEditor";

const STEPS: EditorStep[] = ["details", "flutter", "rn", "props", "publish"];

export default async function AdminScreenPage({ params, searchParams }: PageProps<"/admin/screens/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { step } = await searchParams;
  const s = await adminScreen(Number(id));
  if (!s) notFound();

  // Where this screen sits in its app's flow, and what comes after it
  const app = await adminAppProgress(s.app.id);
  const siblings = app?.screens ?? [];
  const index = siblings.findIndex((x) => x.id === s.id);
  const next = siblings[index + 1];
  const initialStep = STEPS.includes(step as EditorStep) ? (step as EditorStep) : "details";

  const source = (fw: "flutter" | "rn"): SourceInput => {
    const src = s.sources.find((x) => x.framework === fw);
    const file = src?.files[0];
    return { path: file?.path ?? "", code: file?.content ?? "", usage: src?.usage ?? "", deps: src?.deps ?? [] };
  };

  const initial: ScreenInput = {
    title: s.title,
    label: s.label,
    slug: s.slug,
    tagline: s.tagline,
    description: s.description,
    tone: s.tone,
    badge: s.badge ?? "",
    tags: s.tags.map((t) => t.tag.name),
    flutter: source("flutter"),
    rn: source("rn"),
    props: s.props.map((p) => ({ name: p.name, flutter: p.flutterType, rn: p.rnType, default: p.defaultValue, description: p.description })),
  };

  return (
    <main className="admin-main wide">
      <ScreenEditor
        key={s.id}
        id={s.id}
        status={s.status}
        app={s.app}
        initial={initial}
        initialStep={initialStep}
        flow={{ index, total: siblings.length, next: next ? { id: next.id, label: next.label } : null }}
      />
    </main>
  );
}
