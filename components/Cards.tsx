"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Template, Tool, Website } from "@/lib/data";
import { slug } from "@/lib/data";
import { ArrowUpRightIcon, BookmarkIcon, EyeIcon } from "./icons";
import { useApp } from "./Providers";
import FadeImg from "./FadeImg";

function BookmarkButton({ id }: { id: string }) {
  const { bookmarks, toggleBookmark } = useApp();
  const active = bookmarks.includes(id);
  return (
    <motion.button
      className={`bookmark-button${active ? " bookmarked" : ""}`}
      aria-label={active ? "Remove bookmark" : "Bookmark"}
      aria-pressed={active}
      onClick={() => toggleBookmark(id)}
      whileTap={{ scale: 0.86 }}
      transition={{ type: "spring", stiffness: 600, damping: 20 }}
    >
      <BookmarkIcon />
    </motion.button>
  );
}

export function WebsiteCard({ post }: { post: Website }) {
  const { bookmarks } = useApp();
  const id = `w-${slug(post.title)}`;

  if (post.sponsor) {
    return (
      <div className="post sponsor" data-card>
        <div className="media">
          <a href={post.url} target="_blank" rel="noreferrer">
            <FadeImg src={post.image} alt="" />
          </a>
        </div>
        <div className="text">
          <h3>
            <a href={post.url} target="_blank" rel="noreferrer">
              {post.title}
            </a>
          </h3>
          <span className="sponsored-label">Sponsored</span>
        </div>
      </div>
    );
  }

  return (
    <div className="post website" data-card>
      <div className="media">
        <Link href="/websites">
          <FadeImg src={post.image} alt={`${post.title} website`} />
        </Link>
        <div className={`media-buttons${bookmarks.includes(id) ? " has-active" : ""}`}>
          <BookmarkButton id={id} />
          <a href={post.url} target="_blank" rel="noreferrer" aria-label={`Visit ${post.title}`}>
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>
      <div className="text">
        <h3>
          <Link href="/websites">{post.title}</Link>
        </h3>
        <time className="post-time">{post.time}</time>
      </div>
    </div>
  );
}

export function TemplateCard({ post }: { post: Template }) {
  return (
    <div className="post template" data-card>
      <div className="media">
        <Link href="/templates">
          <FadeImg src={post.image} alt={`${post.title} template`} />
        </Link>
        <div className="media-buttons">
          <a href="#" aria-label="Preview">
            <EyeIcon />
          </a>
          <a href="#" aria-label="Get template">
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>
      <div className="text">
        <h3>
          <Link href="/templates">{post.title}</Link>
          {post.platform && (
            <>
              {" "}
              <span>for</span>{" "}
              <Link href={`/templates?tag=${slug(post.platform)}`} className="platform">
                {post.platform}
              </Link>
            </>
          )}
        </h3>
      </div>
    </div>
  );
}

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
