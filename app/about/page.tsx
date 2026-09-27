import type { Metadata } from "next";
import Link from "next/link";
import AboutReveal from "@/components/AboutReveal";
import CopyEmail from "@/components/CopyEmail";

export const metadata: Metadata = { title: "About Minimal Gallery – Website design inspiration - Minimal Gallery" };

export default function AboutPage() {
  return (
    <AboutReveal>
      <h1 data-reveal>About</h1>
      <h3 data-reveal>
        Minimal Gallery is a curated source of website design inspiration aiming to support people in their creative process.
        Running since 2013.
      </h3>
      <p className="author" data-reveal>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://minimal.gallery/wp-content/themes/minimalgallery/assets/img/avatar.png" alt="" referrerPolicy="no-referrer" />
        <span>
          The site was originally brought to life as a passion project by{" "}
          <a href="https://x.com/PietTerheyden" target="_blank" rel="noreferrer">
            Piet Therheyden
          </a>{" "}
          (acquired in 2026).
        </span>
      </p>
      <p data-reveal>
        Seeing the need for a website gallery to help designers with inspiration for client projects, he started building the
        first version back in early 2013.
      </p>
      <p data-reveal>
        Minimal Gallery has since become one of the leading web design galleries, followed by tens of thousands of designers,
        developers, agencies, marketing specialists and entrepreneurs all over the world.
      </p>
      <p data-reveal>
        If you have created or know a beautiful website, template or a useful tool, you&apos;re welcome to{" "}
        <Link href="/about">Submit</Link> it for consideration.
      </p>
      <div className="contact" data-reveal>
        <a className="button-mini" href="mailto:hello@example.com">
          Get in touch
        </a>
        <CopyEmail email="hello@example.com" />
      </div>
    </AboutReveal>
  );
}
