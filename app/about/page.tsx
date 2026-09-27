import type { Metadata } from "next";
import Link from "next/link";
import AboutReveal from "@/components/AboutReveal";
import CopyEmail from "@/components/CopyEmail";
import { LogoIcon } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `About – ${site.name}` };

export default function AboutPage() {
  return (
    <AboutReveal>
      <h1 data-reveal>About</h1>
      <h3 data-reveal>
        {site.name} is a library of ready-to-ship mobile screens. Every screen comes with pixel-identical Flutter and React
        Native source code.
      </h3>
      <p className="author" data-reveal>
        <LogoIcon style={{ width: 48, height: 48, flexShrink: 0, fill: "var(--color--font-contrast)", position: "relative", top: 4 }} />
        <span>
          Flip one switch to get the React Native code. Flip it back to get Flutter. The design, layout and animations
          never change.
        </span>
      </p>
      <p data-reveal>
        Hover any screen to preview its animations, then open it to copy the source, install it with our CLI, or run it
        live in the browser.
      </p>
      <p data-reveal>
        New screens and complete app kits are added every week — onboarding, auth, dashboards, commerce, chat and much
        more.
      </p>
      <p data-reveal>
        Have a screen you&apos;d love to see? You&apos;re welcome to <Link href="/about">request it</Link> for a future
        drop.
      </p>
      <div className="contact" data-reveal>
        <a className="button-mini" href={`mailto:${site.email}`}>
          Get in touch
        </a>
        <CopyEmail email={site.email} />
      </div>
    </AboutReveal>
  );
}
