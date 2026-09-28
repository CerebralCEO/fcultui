import type { JourneyStep } from "@/components/admin/Steps";
import type { AppProgress } from "./admin-queries";

/** The upload flow for one app: details → screens → code for every screen → publish. */
export function appJourney(app: AppProgress | null): JourneyStep[] {
  const screens = app?.screens ?? [];
  const n = screens.length;
  const coded = screens.filter((s) => s.hasFlutter && s.hasRn);
  const live = screens.filter((s) => s.status === "live");
  const missingCode = screens.find((s) => !s.hasFlutter || !s.hasRn);
  const unpublished = screens.find((s) => s.status !== "live");
  const detailsDone = Boolean(app && app.logoId && app.tagline);

  return [
    {
      id: "details",
      label: "App details",
      hint: app ? (detailsDone ? "Name, category, logo, tagline" : "Add a logo and tagline") : "Name, category, logo",
      state: detailsDone ? "done" : "todo",
      cta: app ? { href: "#details", label: "Finish app details" } : undefined,
    },
    {
      id: "screens",
      label: "Add screens",
      hint: n ? `${n} ${n === 1 ? "screen" : "screens"} in the flow` : "Screen 01 is the gallery cover",
      state: n > 0 ? "done" : "todo",
      cta: app ? { href: "#flow", label: "Add the first screen", addScreenFor: app.id } : undefined,
    },
    {
      id: "code",
      label: "Code",
      hint: n ? `Flutter + React Native · ${coded.length} of ${n} done` : "Flutter + React Native for every screen",
      state: n > 0 && coded.length === n ? "done" : "todo",
      cta: missingCode
        ? {
            href: `/admin/screens/${missingCode.id}?step=${missingCode.hasFlutter ? "rn" : "flutter"}`,
            label: `Add code to “${missingCode.label}”`,
          }
        : undefined,
    },
    {
      id: "publish",
      label: "Publish",
      hint: n ? `${live.length} of ${n} screens live` : "Goes live on the site",
      state: n > 0 && live.length === n ? "done" : "todo",
      cta: unpublished ? { href: `/admin/screens/${unpublished.id}?step=publish`, label: `Publish “${unpublished.label}”` } : undefined,
    },
  ];
}
