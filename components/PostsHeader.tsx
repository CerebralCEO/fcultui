"use client";

import Link from "next/link";
import { useRef } from "react";
import { SendIcon } from "./icons";
import { useHeroReveal } from "./useHeroReveal";

export default function PostsHeader({ title, subtitle }: { title: [string, string]; subtitle: string }) {
  const ref = useRef<HTMLElement>(null);
  useHeroReveal(ref);

  return (
    <section className="posts-header" ref={ref}>
      <div className="posts-header-heading">
        <h1 data-reveal>
          {title[0]} <br />
          {title[1]}
        </h1>
        <h2 data-reveal>{subtitle}</h2>
        <div className="posts-header-button subscribe" data-reveal>
          <Link href="/" className="button">
            <span>Get weekly digest</span>
            <i>
              <SendIcon />
            </i>
          </Link>
        </div>
      </div>
    </section>
  );
}
