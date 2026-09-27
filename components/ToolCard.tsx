"use client";

import Link from "next/link";
import type { Tool } from "@/lib/data";
import { slug } from "@/lib/data";
import { ArrowUpRightIcon } from "./icons";
import FadeImg from "./FadeImg";

export function ToolCard({ post }: { post: Tool }) {
  const href = post.link ? `https://${post.link}` : "https://readymag.com";
  return (
    <div className={`post tool${post.promo ? " sponsor" : ""}`} data-card>
      <div className="post-tool-header">
        <div className="post-tool-thumbnail">
          <a href={href} target="_blank" rel="noreferrer">
            <FadeImg src={post.icon} alt={`${post.title} logo`} />
          </a>
        </div>
        <div className="post-tool-heading">
          <h3>
            <a href={href} target="_blank" rel="noreferrer">
              {post.title}
            </a>
          </h3>
          <span>
            <Link href={`/tools?tag=${slug(post.category)}`}>{post.category}</Link>
          </span>
        </div>
        <a href={href} target="_blank" rel="noreferrer" className="post-tool-button" aria-label={`Visit ${post.title}`}>
          <ArrowUpRightIcon />
        </a>
      </div>
      <p className="post-tool-description">{post.description}</p>
      {post.promo ? (
        <span className="post-tool-promo">
          Get <strong>{post.promo.off}</strong> with code <strong>{post.promo.code}</strong>
        </span>
      ) : (
        <a href={href} target="_blank" rel="noreferrer" className="post-tool-link">
          <span>{post.link}</span>
          <ArrowUpRightIcon />
        </a>
      )}
    </div>
  );
}
