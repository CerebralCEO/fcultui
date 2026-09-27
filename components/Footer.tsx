"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LogoIcon } from "./icons";
import { useApp } from "./Providers";
import { site } from "@/lib/site";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const siteLinks = [
  ["About", "/about"],
  ["Submit to gallery", "/about"],
  ["Sponsorship", "/about"],
  ["Subscribe to digest", "/"],
  ["Bookmarks", "/"],
  ["Contact", "/about"],
  ["Legal & privacy", "/about"],
];
const resources = [
  ["Flutter screens", "/screens"],
  ["React Native screens", "/screens"],
  ["Explore all screens", "/explore"],
  ["Tools for developers", "/tools"],
  ["Onboarding screens", "/screens?tag=onboarding"],
  ["E-commerce screens", "/screens?tag=e-commerce"],
  ["Finance screens", "/screens?tag=finance"],
];
const social = [
  ["X/Twitter", site.social.x],
  ["GitHub", site.social.github],
  ["Instagram", site.social.instagram],
  ["LinkedIn", site.social.linkedin],
];

export default function Footer() {
  const { theme, toggleTheme } = useApp();
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

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

  if (pathname.startsWith("/explore")) return null;

  return (
    <footer className="footer" ref={ref}>
      <div className="footer-inner">
        <div className="footer-main">
          <div className="footer-info-col">
            <div className="footer-info">
              <LogoIcon />
              <p>{site.name} is a library of ready-to-ship mobile screens in Flutter and React Native. Since {site.since}.</p>
            </div>
          </div>
          <div className="footer-menus-col">
            <div className="footer-menu footer-menu-site">
              <h4>Site</h4>
              <ul className="menu">
                {siteLinks.map(([l, h]) => (
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
            <p>© {site.name} {site.since}</p>
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
              Built for Flutter &amp; React Native
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
