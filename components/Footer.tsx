"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LogoIcon } from "./icons";
import { useApp } from "./Providers";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const site = [
  ["About", "/about"],
  ["Submit to gallery", "/about"],
  ["Sponsorship", "/about"],
  ["Subscribe to digest", "/"],
  ["Bookmarks", "/"],
  ["Contact", "/about"],
  ["Legal & privacy", "/about"],
];
const resources = [
  ["Website design inspiration", "/websites"],
  ["Website templates", "/templates"],
  ["Tools for creatives", "/tools"],
  ["Agency website design", "/websites"],
  ["E-commerce design inspiration", "/websites"],
  ["Portfolio design inspiration", "/websites"],
  ["One page websites", "/websites"],
];
const social = [
  ["X/Twitter", "https://x.com/minimal_gallery"],
  ["Pinterest", "https://pinterest.com/minimal_gallery/website-design-inspiration/"],
  ["Instagram", "https://www.instagram.com/minimalgalleryweb/"],
  ["LinkedIn", "https://linkedin.com/minimal_gallery"],
];

export default function Footer() {
  const { theme, toggleTheme } = useApp();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".footer-info, .footer-menu, .footer-bar", {
          opacity: 0,
          y: 24,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ref.current, start: "top 92%" },
        });
      });
    },
    { scope: ref }
  );

  return (
    <footer className="footer" ref={ref}>
      <div className="footer-inner">
        <div className="footer-main">
          <div className="footer-info-col">
            <div className="footer-info">
              <LogoIcon />
              <p>Minimal Gallery is a curated source of website design inspiration for creatives. Since 2013.</p>
            </div>
          </div>
          <div className="footer-menus-col">
            <div className="footer-menu footer-menu-site">
              <h4>Site</h4>
              <ul className="menu">
                {site.map(([l, h]) => (
                  <li key={l}>
                    <Link href={h}>{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-menu footer-menu-resources">
              <h4>Resources</h4>
              <ul className="menu">
                {resources.map(([l, h]) => (
                  <li key={l}>
                    <Link href={h}>{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-menu footer-menu-social">
              <h4>Social</h4>
              <ul className="menu">
                {social.map(([l, h]) => (
                  <li key={l}>
                    <a href={h} target="_blank" rel="noreferrer">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bar">
          <div className="footer-bar-left">
            <p>© Minimal Gallery 2013-2026</p>
          </div>
          <div className="footer-bar-right">
            <ul className="footer-bar-menu-social">
              {social.slice(0, 3).map(([l, h]) => (
                <li key={l}>
                  <a href={h} target="_blank" rel="noreferrer">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <p className="footer-bar-info">
              A project founded by <Link href="/about">Piet</Link>
            </p>
            <button id="footer-bar-theme-button" onClick={toggleTheme}>
              <span>
                <kbd>Alt</kbd> + <kbd>M</kbd>
              </span>
              <strong>{theme === "dark" ? "Light" : "Dark"}</strong>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
