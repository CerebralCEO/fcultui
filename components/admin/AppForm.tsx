"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createApp, deleteApp, updateApp, type AppInput } from "@/app/admin/actions";
import { slug as slugify } from "@/lib/data";
import { ConfirmButton, Field, Spinner, useToast } from "./ui";
import LogoPicker, { logoUrl } from "./LogoPicker";

const SUGGESTED = [
  "Onboarding", "Authentication", "Dashboard", "Finance", "E-commerce", "Chat", "Social", "Music", "Fitness", "Travel",
  "Meditation", "Weather", "Settings", "Food & delivery", "Maps", "Crypto", "Booking", "Checkout", "Profile", "Paywall",
];

export default function AppForm({
  app,
  categories,
}: {
  app?: AppInput & { id: number };
  categories: string[];
}) {
  const router = useRouter();
  const { toast, show } = useToast();
  const [pending, start] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [v, setV] = useState<AppInput>(
    app ?? { name: "", slug: "", category: "", accent: "#6D5DF6", tagline: "", logoId: null },
  );
  // Slug follows the name until it is edited by hand
  const [slugTouched, setSlugTouched] = useState(Boolean(app));

  const set = (k: keyof AppInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setV((prev) => ({
      ...prev,
      [k]: value,
      ...(k === "name" && !slugTouched ? { slug: slugify(value) } : {}),
    }));
    if (k === "slug") setSlugTouched(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      if (app) {
        const r = await updateApp(app.id, v);
        show(r.ok ? "App saved" : r.error, r.ok ? "ok" : "error");
        if (r.ok) router.refresh();
      } else {
        const r = await createApp(v);
        if (r.ok) router.push(`/admin/apps/${r.id}`);
        else show(r.error, "error");
      }
    });
  };

  const options = [...new Set([...categories, ...SUGGESTED])].sort();

  return (
    <form className="admin-card admin-form" onSubmit={submit}>
      <div className="admin-form-grid">
        <Field label="Name">
          <input className="admin-input" value={v.name} onChange={set("name")} placeholder="Ledger" autoFocus={!app} />
        </Field>
        <Field label="Slug" hint={`/screens/${v.slug || "…"}`}>
          <input className="admin-input mono" value={v.slug} onChange={set("slug")} placeholder="ledger" />
        </Field>
        <Field label="Category">
          <input className="admin-input" value={v.category} onChange={set("category")} placeholder="Finance" list="admin-categories" />
          <datalist id="admin-categories">
            {options.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Logo" hint="Upload or pick from the library. The accent colour is taken from the logo.">
          <LogoPicker
            value={v.logoId}
            name={v.name}
            onChange={(l) => setV((p) => ({ ...p, logoId: l.id, accent: l.accent }))}
            onError={(m) => show(m, "error")}
          />
        </Field>
        <Field label="Tagline" hint="One line under the card title, e.g. “Banking dashboard & spending”." wide>
          <input className="admin-input" value={v.tagline} onChange={set("tagline")} placeholder="What this app flow does" />
        </Field>
      </div>

      {/* Live preview of the gallery card's meta row */}
      <div className="admin-preview-meta">
        <span className="admin-label">Card preview</span>
        <div className="app-meta">
          <span className={`app-icon${v.logoId ? " has-logo" : ""}`} style={{ "--accent": v.accent } as React.CSSProperties}>
            {v.logoId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl(v.logoId)} alt="" />
            ) : (
              (v.name || "A")[0]
            )}
          </span>
          <div className="app-meta-text">
            <h3>{v.name || "App name"}</h3>
            <p>{v.tagline || "Tagline"}</p>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        {app && (
          <ConfirmButton
            label="Delete app"
            confirm="Delete app and all its screens?"
            busy={deleting}
            onConfirm={() =>
              startDelete(async () => {
                const r = await deleteApp(app.id);
                if (r.ok) router.push("/admin/apps");
                else show(r.error, "error");
              })
            }
          />
        )}
        <button type="submit" className="admin-primary" disabled={pending}>
          {pending ? <Spinner /> : app ? "Save changes" : "Create app"}
        </button>
      </div>
      {toast}
    </form>
  );
}
