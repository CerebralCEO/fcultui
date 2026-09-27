import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { screens } from "@/lib/data";
import { designMeta, pascal } from "@/lib/screen-meta";
import { cliCommand, getScreenCode, getSharedCode } from "@/lib/code";
import { site } from "@/lib/site";
import PreviewPanel from "@/components/detail/PreviewPanel";
import Installation from "@/components/detail/Installation";
import Toc from "@/components/detail/Toc";
import DetailReveal from "@/components/detail/DetailReveal";
import { ScreenPager } from "@/components/detail/ScreenNav";
import PostsGrid from "@/components/PostsGrid";
import { ScreenCard } from "@/components/ScreenCards";

export function generateStaticParams() {
  return screens.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/screens/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const screen = screens.find((s) => s.slug === slug);
  if (!screen) return {};
  return {
    title: `${screen.title} – Flutter & React Native screen | ${site.name}`,
    description: designMeta[screen.design].description,
  };
}

const TOC = [
  { id: "preview", label: "Preview" },
  { id: "installation", label: "Installation" },
  { id: "flow", label: "Screens in this flow" },
  { id: "props", label: "Props" },
  { id: "more", label: "More screens" },
];

const promptFor = (title: string, description: string, accent: string) =>
  `Build the "${title}" mobile screen from ${site.name}. ${description}
Canvas: 390×844 logical px with safe areas. Accent colour ${accent}. Font: Inter.
Use the FCult tokens (radius 16 field / 18 button / 28 card, spacing 6·10·16·24·32, easing cubic-bezier(0.16,1,0.3,1)).
Deliver it for both Flutter and React Native (Expo + Reanimated) with pixel-identical layout and animation timings.`;

export default async function ScreenPage({ params }: PageProps<"/screens/[slug]">) {
  const { slug } = await params;
  const screen = screens.find((s) => s.slug === slug);
  if (!screen) notFound();

  const meta = designMeta[screen.design];
  const appName = screen.title.split(" ")[0];

  const [code, shared, cli, flowCode] = await Promise.all([
    getScreenCode(screen.design, screen.title, screen.accent),
    getSharedCode(screen.design),
    cliCommand(screen.slug),
    Promise.all(
      screen.flow.slice(1).map((d) => {
        const title = `${appName} ${designMeta[d].label}`;
        return getScreenCode(d, title, screen.accent).then((c) => ({ design: d, title, code: c }));
      }),
    ),
  ]);

  const related = screens.filter((s) => s.slug !== screen.slug && s.design !== screen.design).slice(0, 3);
  const sameCategory = screens.filter((s) => s.slug !== screen.slug && s.category === screen.category);
  const more = [...sameCategory, ...related].slice(0, 3);

  return (
    <>
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
            {meta.description}
          </p>
          <div className="detail-chips" data-reveal>
            {meta.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
            <span className="chip-fw">Flutter</span>
            <span className="chip-fw">React Native</span>
            {screen.pro && <span className="chip-pro">All-Access</span>}
          </div>
        </DetailReveal>

        <section id="preview" className="detail-section first">
          <PreviewPanel
            id="main"
            primary
            design={screen.design}
            accent={screen.accent}
            flutter={code.flutter}
            rn={code.rn}
            prompt={promptFor(screen.title, meta.description, screen.accent)}
          />
        </section>

        <section id="installation" className="detail-section">
          <h2>Installation</h2>
          <Installation
            data={{
              cli,
              deps: { flutter: shared.fonts, rn: shared.rnDeps },
              tokens: { flutter: shared.flutterTokens, rn: shared.rnTokens },
              source: { flutter: code.flutter, rn: code.rn },
              usage: { flutter: code.flutterUsage, rn: code.rnUsage },
            }}
          />
        </section>

        <section id="flow" className="detail-section">
          <h2>Screens in this flow</h2>
          <p className="detail-sub">
            {appName} ships as a {screen.flow.length}-screen flow. Every step is its own drop-in component.
          </p>
          {flowCode.map((f, i) => (
            <div key={f.design} className="example">
              <h3>{designMeta[f.design].label}</h3>
              <PreviewPanel
                id={`flow-${i}`}
                design={f.design}
                accent={screen.accent}
                flutter={f.code.flutter}
                rn={f.code.rn}
                prompt={promptFor(f.title, designMeta[f.design].description, screen.accent)}
              />
            </div>
          ))}
        </section>

        <section id="props" className="detail-section">
          <h2>Props</h2>
          <div className="props-wrap">
            <table className="props">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Flutter</th>
                  <th>React Native</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {meta.props.map((p) => (
                  <tr key={p.name}>
                    <td data-label="Prop">
                      <code>{p.name}</code>
                    </td>
                    <td data-label="Flutter">
                      <code>{p.flutter}</code>
                    </td>
                    <td data-label="React Native">
                      <code>{p.rn}</code>
                    </td>
                    <td data-label="Default">{p.default === "Screen accent" ? <code>{screen.accent}</code> : p.default}</td>
                    <td data-label="Description">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="detail-note">
            Component: <code>{pascal(screen.title)}Screen</code> — identical API in both frameworks. Wrap your React Native app in{" "}
            <code>SafeAreaProvider</code>; Flutter needs no extra setup.
          </p>
        </section>

        <ScreenPager slug={screen.slug} />

        <section id="more" className="detail-section">
          <h2>More screens</h2>
          <PostsGrid className="posts screens detail-grid">
            {more.map((s) => (
              <ScreenCard key={s.slug} screen={s} />
            ))}
          </PostsGrid>
        </section>
      </article>

      <aside className="detail-toc">
        <Toc items={TOC} />
      </aside>
    </>
  );
}
