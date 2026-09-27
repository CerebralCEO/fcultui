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

export const searchMenus: Record<SearchMode, { label: string; items: Count[] }> = {
  screens: {
    label: "Categories",
    items: parse(
      "Authentication|48,Booking|22,Calendar|19,Chat|41,Checkout|27,Crypto|18,Dashboard|64,E-commerce|96,Education|23,Empty states|15,Finance|57,Fitness|34,Food & delivery|29,Health|21,Maps|17,Meditation|12,Music|26,Notifications|14,Onboarding|73,Paywall|16,Podcast|9,Productivity|31,Profile|38,Settings|25,Social|44,Splash|11,Travel|30,Weather|13"
    ),
  },
  templates: {
    label: "App kits",
    items: parse("Crypto|3,E-commerce|8,Finance|6,Fitness|5,Food & delivery|4,Meditation|2,Music|4,Productivity|5,Social|6,Travel|4,Weather|2"),
  },
  tools: {
    label: "Types",
    items: parse(
      "Analytics|3,Audio|2,Brand management|3,Color|3,Communication|1,Content sharing|1,Customer support|3,Design|12,Development|5,Feedback|2,Fonts|4,Forms|1,Framer|5,Icons|4,Job & career|1,Mockups|3,No-code builders|5,Passwords|1,Payments & sales|4,Photography|1,Portfolio & discovery|2,Productivity|10,SAAS|5,Screen recording|3,SEO & marketing|5,Social media|5,Squarespace|1,Time tracking|2,Webflow|3"
    ),
  },
};

export const slug = (s: string) =>
  s.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* ================= Screens (mobile UI library) ================= */

/** Demo screen designs rendered in HTML until real Flutter/RN captures replace them (see docs/PLAN.md). */
export type ScreenDesign =
  | "onboarding"
  | "auth"
  | "finance"
  | "music"
  | "shop"
  | "chat"
  | "fitness"
  | "travel"
  | "meditation"
  | "weather"
  | "settings"
  | "delivery";

export type Screen = {
  slug: string;
  title: string;
  category: string;
  /** One-line subtitle under the title (Mobbin-style). */
  tagline: string;
  design: ScreenDesign;
  accent: string;
  time: string;
  badge?: "New" | "Updated";
  /** Code is locked behind All-Access. */
  pro?: boolean;
  /** Screens shown by the card carousel (first one = cover). */
  flow: ScreenDesign[];
};

/** Related screens that make up each app's preview flow (placeholder until real apps ship). */
const flows: Record<ScreenDesign, ScreenDesign[]> = {
  onboarding: ["onboarding", "auth", "fitness", "settings"],
  auth: ["auth", "onboarding", "finance", "settings"],
  finance: ["finance", "auth", "chat", "settings"],
  music: ["music", "onboarding", "chat", "settings"],
  shop: ["shop", "onboarding", "delivery", "auth"],
  chat: ["chat", "auth", "settings", "onboarding"],
  fitness: ["fitness", "meditation", "onboarding", "settings"],
  travel: ["travel", "weather", "auth", "chat"],
  meditation: ["meditation", "onboarding", "fitness", "settings"],
  weather: ["weather", "travel", "settings", "onboarding"],
  settings: ["settings", "auth", "chat", "finance"],
  delivery: ["delivery", "shop", "chat", "auth"],
};

export type Promo = { promo: true; title: string; href: string };

const extras: Record<string, Pick<Screen, "tagline"> & Pick<Partial<Screen>, "badge" | "pro">> = {
  "Bloom Onboarding": { tagline: "Habit tracker welcome flow", badge: "New" },
  "Nova Sign In": { tagline: "Email & social login", badge: "New" },
  "Ledger Overview": { tagline: "Banking dashboard & spending", badge: "Updated" },
  "Vinyl Player": { tagline: "Now playing with live EQ", badge: "New" },
  "Aura Product": { tagline: "Product detail & add to bag", pro: true },
  "Hello Chat": { tagline: "1:1 messaging thread", badge: "Updated" },
  "Pulse Rings": { tagline: "Daily activity rings", pro: true },
  "Nordic Explore": { tagline: "Destination discovery feed" },
  "Still Breathe": { tagline: "Guided breathing session", pro: true },
  "Sky Weather": { tagline: "Current conditions & hourly" },
  "Quiet Settings": { tagline: "Grouped settings with toggles" },
  "Dash Tracking": { tagline: "Live courier tracking map", badge: "Updated", pro: true },
  "Petal Onboarding": { tagline: "Wellness app introduction" },
  "Vault Sign In": { tagline: "Secure password login", pro: true },
  "Coin Wallet": { tagline: "Crypto portfolio overview" },
  "Echo Podcast": { tagline: "Podcast episode player", pro: true },
  "Terra Store": { tagline: "Eco goods product page" },
  "Squad Messages": { tagline: "Group chat conversation", pro: true },
  "Stride Activity": { tagline: "Workout summary & streaks" },
  "Alpine Booking": { tagline: "Mountain trip booking", pro: true },
  "Calm Focus": { tagline: "Focus timer & ambience" },
  "Drizzle Forecast": { tagline: "Rainy day forecast", pro: true },
  "Parcel Tracking": { tagline: "Package delivery status" },
};

const s = (title: string, category: string, design: ScreenDesign, accent: string, time: string): Screen => ({
  slug: slug(title),
  title,
  category,
  design,
  accent,
  time,
  flow: flows[design],
  ...extras[title],
});

export const screens: Screen[] = [
  s("Bloom Onboarding", "Onboarding", "onboarding", "#FF7A45", "1 day ago"),
  s("Nova Sign In", "Authentication", "auth", "#7C5CFF", "1 day ago"),
  s("Ledger Overview", "Finance", "finance", "#6D5DF6", "2 days ago"),
  s("Vinyl Player", "Music", "music", "#FF4D6D", "3 days ago"),
  s("Aura Product", "E-commerce", "shop", "#E0703A", "4 days ago"),
  s("Hello Chat", "Chat", "chat", "#2F80ED", "5 days ago"),
  s("Pulse Rings", "Fitness", "fitness", "#FA114F", "6 days ago"),
  s("Nordic Explore", "Travel", "travel", "#2B7A78", "1 week ago"),
  s("Still Breathe", "Meditation", "meditation", "#3CC7B3", "1 week ago"),
  s("Sky Weather", "Weather", "weather", "#3B82F6", "1 week ago"),
  s("Quiet Settings", "Settings", "settings", "#34C759", "2 weeks ago"),
  s("Dash Tracking", "Food & delivery", "delivery", "#FF5A1F", "2 weeks ago"),
  s("Petal Onboarding", "Onboarding", "onboarding", "#D946EF", "2 weeks ago"),
  s("Vault Sign In", "Authentication", "auth", "#10B981", "2 weeks ago"),
  s("Coin Wallet", "Crypto", "finance", "#0EA5E9", "2 weeks ago"),
  s("Echo Podcast", "Podcast", "music", "#F59E0B", "2 weeks ago"),
  s("Terra Store", "E-commerce", "shop", "#3F8F5A", "3 weeks ago"),
  s("Squad Messages", "Social", "chat", "#8B5CF6", "3 weeks ago"),
  s("Stride Activity", "Fitness", "fitness", "#A6FF00", "3 weeks ago"),
  s("Alpine Booking", "Booking", "travel", "#B45309", "3 weeks ago"),
  s("Calm Focus", "Meditation", "meditation", "#818CF8", "3 weeks ago"),
  s("Drizzle Forecast", "Weather", "weather", "#0F766E", "3 weeks ago"),
  s("Parcel Tracking", "Maps", "delivery", "#2563EB", "3 weeks ago"),
];

export const promo: Promo = {
  promo: true,
  title: "Get every screen in Flutter & React Native. Go All-Access.",
  href: "/about",
};

/** Grid order: the promo occupies slot 4 (pinned to the last column of row 1 by CSS, like the original sponsor). */
export const screenGrid: (Screen | Promo)[] = [...screens.slice(0, 3), promo, ...screens.slice(3)];

export const screenTags = [
  "Onboarding", "Authentication", "Dashboard", "Finance", "E-commerce", "Chat", "Social", "Music", "Fitness",
  "Travel", "Meditation", "Weather", "Settings", "Food & delivery", "Maps", "Crypto", "Booking", "Checkout",
  "Profile", "Paywall", "Notifications", "Empty states", "Splash", "Calendar", "Productivity", "Education",
  "Health", "Podcast",
];

/* ================= App kits (multi-screen templates) ================= */

export type AppKit = {
  slug: string;
  title: string;
  category: string;
  screens: [ScreenDesign, ScreenDesign, ScreenDesign];
  accent: string;
};

const k = (title: string, category: string, screens: AppKit["screens"], accent: string): AppKit => ({
  slug: slug(title),
  title,
  category,
  screens,
  accent,
});

export const appKits: AppKit[] = [
  k("Ledger", "Finance", ["auth", "finance", "settings"], "#6D5DF6"),
  k("Aura", "E-commerce", ["onboarding", "shop", "delivery"], "#E0703A"),
  k("Vinyl", "Music", ["music", "chat", "settings"], "#FF4D6D"),
  k("Pulse", "Fitness", ["onboarding", "fitness", "meditation"], "#FA114F"),
  k("Nordic", "Travel", ["travel", "weather", "auth"], "#2B7A78"),
  k("Hello", "Social", ["auth", "chat", "settings"], "#2F80ED"),
  k("Still", "Meditation", ["meditation", "onboarding", "settings"], "#3CC7B3"),
  k("Dash", "Food & delivery", ["shop", "delivery", "chat"], "#FF5A1F"),
  k("Coin", "Crypto", ["auth", "finance", "chat"], "#0EA5E9"),
  k("Sky", "Weather", ["weather", "travel", "settings"], "#3B82F6"),
  k("Terra", "E-commerce", ["shop", "onboarding", "delivery"], "#3F8F5A"),
  k("Echo", "Music", ["music", "onboarding", "auth"], "#F59E0B"),
];

export const kitTags = ["Finance", "E-commerce", "Music", "Fitness", "Travel", "Social", "Meditation", "Food & delivery", "Crypto", "Weather", "Productivity"];
