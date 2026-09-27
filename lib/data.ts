import type { Promo } from "./content-types";

const MG = "https://minimal.gallery/wp-content/uploads";

export type Tool = {
  title: string;
  category: string;
  icon: string;
  description: string;
  link?: string;
  promo?: { code: string; off: string };
};

export const tools: Tool[] = [
  { title: "FontBase", category: "Fonts", icon: `${MG}/2026/07/tool-icon-fontbase.png`, description: "The font manager made by designers, for designers. Lightning fast, with a beautiful interface, and totally free", link: "fontba.se" },
  { title: "Supaste", category: "Productivity", icon: `${MG}/2026/07/supaste.png`, description: "Save your clipboard and screenshots in a visual history, automatically grouped by type, app, and custom categories", link: "supaste.com" },
  { title: "DropLeaf", category: "Content sharing", icon: `${MG}/2026/04/tool-icon-dropleaf.png`, description: "Turn your local Markdown files into clean, shareable web pages with access control and commenting", link: "dropleaf.app" },
  { title: "Readymag", category: "No-code builders", icon: "https://minimal.gallery/wp-content/themes/minimalgallery/assets/img/gjest/readymag-tool.png", description: "Create landing pages, presentations, editorials, e-shops or portfolios without code", promo: { off: "20% off", code: "\"MinimalGallery\"" } },
  { title: "worldglide", category: "Job & career", icon: `${MG}/2026/03/worldglide.gif`, description: "Hand-picked remote roles for designers, illustrators, motion artists & creative technologists", link: "worldglide.careers" },
  { title: "Droplist", category: "Productivity", icon: `${MG}/2026/03/tool-icons-droplist.jpg`, description: "A simple notes app that works like digital notecards. Capture daily tasks, notes, and ideas in a calm, minimal space", link: "dropli.st" },
  { title: "Mockuuups Studio", category: "Mockups", icon: `${MG}/2026/03/mockuuups_logo.jpeg`, description: "Super-easy mockup generator with more than 4500 high-quality scenes. Available as a desktop app or Figma plugin", link: "mockuuups.studio" },
  { title: "AI Jingle Maker", category: "Audio", icon: `${MG}/2026/02/Ai-jingle-Maker-logo.webp`, description: "Create radio jingles, commercial audio ads, and podcast intros from text — voice + music + broadcast-ready MP3", link: "aijinglemaker.net" },
  { title: "Hexful", category: "Color", icon: `${MG}/2026/01/hexful-logo.avif`, description: "A minimal color tool for exploring hex colors and palettes quickly and simply", link: "hexful.com" },
  { title: "DataFast", category: "Analytics", icon: `${MG}/2026/01/Frame-1691032786.png`, description: "Revenue-first web analytics tool", link: "datafa.st" },
  { title: "Sinqlo", category: "Brand management", icon: `${MG}/2025/11/sinqlo-logo.jpg`, description: "Logo Delivery & Sharing for Design Studios", link: "sinqlo.com" },
  { title: "No Code Flow", category: "Webflow", icon: `${MG}/2025/12/637e3a9fd9011720c3a9fd46_Thumbnail-New.png`, description: "Interactive map with Location pins for Webflow", link: "nocodeflow.net" },
  { title: "Helploom", category: "Customer support", icon: `${MG}/2025/12/HelpLoom-logo.png`, description: "Website chat to provide live customer support", link: "helploom.com" },
  { title: "Faxfix", category: "Communication", icon: `${MG}/2025/10/Faxfix-logo-1-630x630.png`, description: "Send an online fax instantly without the hassle of creating an account or subscription", link: "faxfix.com" },
  { title: "Mocku", category: "Mockups", icon: `${MG}/2025/10/mocku-630x630.jpg`, description: "Create stunning AI-powered mockups and video mockups in seconds", link: "mocku.co" },
  { title: "Frames", category: "Photography", icon: `${MG}/2025/07/withframes-logo.jpg`, description: "An app for film photography notes & metadata", link: "withframes.com" },
  { title: "Huddlekit", category: "Feedback", icon: `${MG}/2025/08/huddle-icon-630x630.jpg`, description: "A next‑gen website annotation and QA tool for designers and developers", link: "huddlekit.com" },
  { title: "No-Code Shader", category: "Design", icon: `${MG}/2025/07/No-Code-Shader.jpg`, description: "Explore a remixable library of insane Unicorn Studio effects. No code. No stress", link: "nocodeshader.com" },
  { title: "Muzli Me", category: "Portfolio & discovery", icon: `${MG}/2025/07/muzli.jpg`, description: "Muzli instantly delivers cutting-edge design projects and news each time a new tab is open in your browser", link: "me.muz.li" },
  { title: "Realtime Colors", category: "Color", icon: `${MG}/2025/07/Frame-1691032854.jpg`, description: "Visualize your color choices on a real website for designing, developing, and creating a brand style guide", link: "realtimecolors.com" },
  { title: "MICRtype", category: "Fonts", icon: `${MG}/2025/07/WhatsApp-Image-2025-07-11-at-09.18.57.jpeg`, description: "A specialized font for printing checks and other finance related documents", link: "micrtype.com" },
  { title: "Cap", category: "Screen recording", icon: `${MG}/2025/07/cap.png`, description: "Open source alternative to Loom, to create beautiful, shareable screen recordings", link: "go.cap.so" },
  { title: "Saas Explainer Videos", category: "SAAS", icon: `${MG}/2025/07/explainervideos.png`, description: "A curation of the best SaaS explainer videos", link: "saasexplainervideos.com" },
  { title: "PostingCat", category: "Social media", icon: `${MG}/2025/05/posting-cat.webp`, description: "Simplify your social media management and scheduling", link: "postingcat.com" },
];

export const toolTags = [
  "Analytics", "Audio", "Design", "Productivity", "No-code builders", "Development", "SEO & marketing", "Framer",
  "Webflow", "Color", "Icons", "Social media", "Brand management", "Customer support", "Fonts", "Feedback",
  "Squarespace", "Communication", "Content sharing", "Forms", "Job & career", "Mockups", "Passwords",
  "Payments & sales", "Photography", "Portfolio & discovery", "SAAS", "Screen recording", "Time tracking",
];

type Count = [name: string, count: number];

const parse = (s: string): Count[] =>
  s.split(",").map((p) => {
    const [n, c] = p.split("|");
    return [n, Number(c)];
  });

export type SearchMode = "screens" | "templates" | "tools";

/** Tool types for the search modal (screen categories come from live content). */
export const toolsMenu: { label: string; items: Count[] } = {
  label: "Types",
  items: parse(
    "Analytics|3,Audio|2,Brand management|3,Color|3,Communication|1,Content sharing|1,Customer support|3,Design|12,Development|5,Feedback|2,Fonts|4,Forms|1,Framer|5,Icons|4,Job & career|1,Mockups|3,No-code builders|5,Passwords|1,Payments & sales|4,Photography|1,Portfolio & discovery|2,Productivity|10,SAAS|5,Screen recording|3,SEO & marketing|5,Social media|5,Squarespace|1,Time tracking|2,Webflow|3"
  ),
};

export const slug = (s: string) =>
  s.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* ================= Screens ================= */
// Screens, apps and categories live in Neon (lib/content.ts). Only the static promo tile stays here.

export const promo: Promo = {
  promo: true,
  title: "React Native is free for everyone. Sign in free to copy the Flutter code too.",
  href: "/screens",
};
