import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getScreen, getScreens } from "@/lib/content";
import { flutterKey, getScreenBundle } from "@/lib/code";
import { lockFile } from "@/lib/code-types";
import FlutterCodeProvider from "@/components/detail/FlutterCode";
import { site } from "@/lib/site";
import ScreenWorkspace, { type WorkspaceItem } from "@/components/detail/ScreenWorkspace";
import Toc from "@/components/detail/Toc";
import DetailReveal from "@/components/detail/DetailReveal";
import { ScreenPager } from "@/components/detail/ScreenNav";
import PostsGrid from "@/components/PostsGrid";
import { ScreenCard } from "@/components/ScreenCards";

// Published apps are prerendered; new ones render on first request and are cached under the "content" tag.
export async function generateStaticParams() {
  return (await getScreens()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/screens/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const screen = await getScreen(slug);
  if (!screen) return {};
  return {
    title: `${screen.title} – Flutter & React Native screen | ${site.name}`,
    description: screen.description || screen.tagline,
  };
}

const TOC = [
  { id: "preview", label: "Screens & code" },
  { id: "installation", label: "Installation" },
  { id: "props", label: "Props" },
  { id: "more", label: "More screens" },
];

const promptFor = (title: string, description: string, accent: string) =>
  `Build the "${title}" mobile screen from ${site.name}. ${description}
Canvas: 390×844 logical px with safe areas. Accent colour ${accent}. Font: Inter.
Use the F-Cult UI tokens (radius 16 field / 18 button / 28 card, spacing 6·10·16·24·32, easing cubic-bezier(0.16,1,0.3,1)).
Deliver it for both Flutter and React Native (Expo + Reanimated) with pixel-identical layout and animation timings.`;

export default async function ScreenPage({ params }: PageProps<"/screens/[slug]">) {
  const { slug } = await params;
  const [screen, all] = await Promise.all([getScreen(slug), getScreens()]);
  if (!screen) notFound();

  // Flutter source is members-only: the page only carries LockedFile stubs (no code).
  // Signed-in visitors receive the real files from /api/code/[slug] (see FlutterCodeProvider).
  const { steps, cli } = await getScreenBundle(screen);

  // One item per screen in the flow (index 0 = cover). The strip on top switches between them.
  const items: WorkspaceItem[] = screen.steps.map((st, i) => {
    const code = steps[i];
    return {
      step: screen.flow[i],
      name: code.name,
      label: st.label,
      props: st.props,
      prompt: promptFor(st.title, st.description || screen.tagline, screen.accent),
      rn: code.rn,
      flutter: lockFile(code.flutter, flutterKey(i, "source")),
      rnUsage: code.rnUsage,
      flutterUsage: lockFile(code.flutterUsage, flutterKey(i, "usage")),
      rnDeps: code.rnDeps,
      flutterDeps: code.flutterDeps,
    };
  });

  const index = all.findIndex((s) => s.slug === screen.slug);
  const others = all.filter((s) => s.slug !== screen.slug);
  const more = [...others.filter((s) => s.category === screen.category), ...others.filter((s) => s.category !== screen.category)].slice(0, 3);

  return (
    <FlutterCodeProvider slug={screen.slug}>
      <article className="detail-main">
        <DetailReveal>
          <nav className="crumbs" aria-label="Breadcrumb" data-reveal>
            <Link href="/screens">Screens</Link>
            <span>/</span>
            <Link href={`/screens?tag=${screen.category.toLowerCase()}`}>{screen.category}</Link>
            <span>/</span>
            <strong>{screen.title}</strong>
          </nav>
          <h1 data-reveal>{screen.title}</h1>
          <p className="detail-lead" data-reveal>
            {screen.description || screen.tagline}
          </p>
          <div className="detail-chips" data-reveal>
            {screen.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
            <span className="chip-fw">Flutter</span>
            <span className="chip-fw">React Native</span>
          </div>
        </DetailReveal>

        <ScreenWorkspace items={items} accent={screen.accent} cli={cli} />

        <ScreenPager prev={all[index - 1]} next={all[index + 1]} />

        {more.length > 0 && (
          <section id="more" className="detail-section">
            <h2>More screens</h2>
            <PostsGrid className="posts screens detail-grid">
              {more.map((s) => (
                <ScreenCard key={s.slug} screen={s} />
              ))}
            </PostsGrid>
          </section>
        )}
      </article>

      <aside className="detail-toc">
        <Toc items={more.length > 0 ? TOC : TOC.slice(0, -1)} />
      </aside>
    </FlutterCodeProvider>
  );
}
