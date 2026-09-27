import Link from "next/link";
import { screens } from "@/lib/data";
import { site } from "@/lib/site";

/** Left rail: every screen grouped by category (server component — no JS). */
export default function Sidebar({ active }: { active: string }) {
  const groups = new Map<string, typeof screens>();
  for (const s of screens) groups.set(s.category, [...(groups.get(s.category) ?? []), s]);

  return (
    <aside className="detail-sidebar" data-lenis-prevent>
      <nav aria-label="Screens">
        {[...groups].map(([category, items]) => (
          <div key={category} className="side-group">
            <p className="side-label">{category}</p>
            <ul>
              {items.map((s) => (
                <li key={s.slug}>
                  <Link href={`/screens/${s.slug}`} className={s.slug === active ? "active" : undefined}>
                    <i style={{ background: s.accent }} />
                    <span>{s.title}</span>
                    {s.badge === "New" && <em>New</em>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="side-promo">
        <div className="side-promo-art">
          <strong>All-Access</strong>
        </div>
        <p className="side-promo-title">Ship faster with {site.name}</p>
        <p className="side-promo-copy">Every screen and app kit, in Flutter and React Native, for a one-time payment.</p>
        <Link href="/about" className="side-promo-btn">
          Get All-Access
        </Link>
      </div>
    </aside>
  );
}
