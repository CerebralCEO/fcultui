import { notFound } from "next/navigation";
import ScreenEditor from "@/components/admin/ScreenEditor";
import { requireAdmin } from "@/lib/admin";
import { adminScreen } from "@/lib/admin-queries";
import type { ScreenInput, SourceInput } from "../../actions";

export default async function AdminScreenPage({ params }: PageProps<"/admin/screens/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const s = await adminScreen(Number(id));
  if (!s) notFound();

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
      <ScreenEditor key={s.id} id={s.id} status={s.status} app={s.app} initial={initial} />
    </main>
  );
}
