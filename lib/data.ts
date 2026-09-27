const CDN = "https://21ef0880.delivery.rocketcdn.me/wp-content/uploads";
const MG = "https://minimal.gallery/wp-content/uploads";

export type Website = {
  title: string;
  image: string;
  time?: string;
  url?: string;
  sponsor?: boolean;
};

export type Template = {
  title: string;
  image: string;
  platform?: string;
};

export type Tool = {
  title: string;
  category: string;
  icon: string;
  description: string;
  link?: string;
  promo?: { code: string; off: string };
};

export const websites: Website[] = [
  { title: "Provider Studio", image: `${CDN}/2026/09/provider.studio-900x500.jpg`, time: "1 day ago", url: "http://provider.studio" },
  { title: "ESR Bespoke", image: `${CDN}/2026/08/esrbespoke-900x500.jpg`, time: "1 day ago", url: "https://www.esrbespoke.au" },
  { title: "Nomad Labs", image: `${CDN}/2026/08/nomadlabs.es_-900x500.jpg`, time: "2 days ago", url: "https://nomadlabs.es" },
  {
    title: "Show your work to the design community. Submit your website.",
    image: "https://21ef0880.delivery.rocketcdn.me/wp-content/themes/minimalgallery/assets/img/gjest/readymag-sep-2026.jpg",
    url: "https://readymag.com/websites-of-the-year/",
    sponsor: true,
  },
  { title: "BSWT", image: `${CDN}/2026/08/bswt.tv_-900x500.jpg`, time: "3 days ago", url: "https://bswt.tv" },
  { title: "The Reach", image: `${CDN}/2026/08/thereach.travel-900x500.jpg`, time: "4 days ago", url: "https://thereach.travel" },
  { title: "Joshua Baker", image: `${CDN}/2026/08/joshuabaker.com_-900x500.jpg`, time: "5 days ago", url: "https://www.joshuabaker.com" },
  { title: "TakeControl", image: `${CDN}/2026/08/gettakecontrol-900x500.jpg`, time: "6 days ago", url: "https://gettakecontrol.app/en/" },
  { title: "United Flags of Fashion", image: `${CDN}/2026/08/uff.cfda_.com_-900x500.jpg`, time: "1 week ago", url: "https://uff.cfda.com" },
  { title: "LinkLetter", image: `${CDN}/2026/08/linkletter.press_-900x500.jpg`, time: "1 week ago", url: "http://linkletter.press" },
  { title: "Driftime Impact Report", image: `${CDN}/2026/08/2025.driftime.com_-900x500.jpg`, time: "1 week ago", url: "https://2025.driftime.com" },
  { title: "Kiara Di Gregorio", image: `${CDN}/2026/08/kiaradigregorio.com_-900x500.jpg`, time: "2 weeks ago", url: "https://kiaradigregorio.com" },
  { title: "Onœra", image: `${CDN}/2026/08/onoera.com_-900x500.jpg`, time: "2 weeks ago", url: "https://onoera.com" },
  { title: "Sonderdays", image: `${CDN}/2026/08/sonderdays.com_-900x500.jpg`, time: "2 weeks ago", url: "https://www.sonderdays.com" },
  { title: "Watts Pet", image: `${CDN}/2026/08/wattspet.com_-900x500.jpg`, time: "2 weeks ago", url: "https://wattspet.com" },
  { title: "Goodside", image: `${CDN}/2026/08/goodside.studio-900x500.jpg`, time: "2 weeks ago", url: "https://www.goodside.studio" },
  { title: "Eternal Blue", image: `${CDN}/2026/08/eternalblue.co_.nz_-900x500.jpg`, time: "2 weeks ago", url: "https://eternalblue.co.nz" },
  { title: "Buena", image: `${CDN}/2026/08/buena.com_-900x500.jpg`, time: "2 weeks ago", url: "https://buena.com/en/home" },
  { title: "Samuel Räikkönen", image: `${CDN}/2026/08/honest.fi_-900x500.jpg`, time: "3 weeks ago", url: "https://honest.fi" },
  { title: "Gabriel Beaugonin", image: `${CDN}/2026/08/gabrielbeaugonin.com_-900x500.jpg`, time: "3 weeks ago", url: "https://www.gabrielbeaugonin.com" },
  { title: "Boc.Studio", image: `${CDN}/2026/08/boc.studio-900x500.jpg`, time: "3 weeks ago", url: "https://boc.studio" },
  { title: "Cozy Journal", image: `${CDN}/2026/08/cozyjournal.app_-900x500.jpg`, time: "3 weeks ago", url: "https://cozyjournal.app" },
  { title: "Denmu", image: `${CDN}/2026/08/denmu.com_-900x500.jpg`, time: "3 weeks ago", url: "https://denmu.com" },
  { title: "Philip Readman", image: `${CDN}/2026/07/philipreadman.com_-900x500.jpg`, time: "3 weeks ago", url: "https://www.philipreadman.com" },
];

export const templates: Template[] = [
  { title: "Archiste", platform: "Framer", image: `${MG}/2026/07/framer-archiste-900x500.jpg` },
  { title: "Floffice", platform: "Framer", image: `${MG}/2026/07/framer-floffice-900x500.jpg` },
  { title: "Sorae", platform: "Framer", image: `${MG}/2026/07/framer-sorae-900x500.jpg` },
  { title: "Orchid", platform: "Framer", image: `${MG}/2026/07/framer-orchid-900x500.jpg` },
  { title: "Maravilla", platform: "Framer", image: `${MG}/2026/07/framer-maravilla-900x500.jpg` },
  { title: "People Work", platform: "Framer", image: `${MG}/2026/07/framer-peoplework-900x500.jpg` },
  { title: "Percy Studio", platform: "Framer", image: `${MG}/2026/07/framer-percyjackson-900x500.jpg` },
  { title: "Salient", platform: "Framer", image: `${MG}/2026/07/framer-salient-900x500.jpg` },
  { title: "Rep Republic", platform: "Framer", image: `${MG}/2026/07/framer-rep-republic-900x500.jpg` },
  { title: "Stayor", platform: "Framer", image: `${MG}/2026/07/framer-stayor-900x500.jpg` },
  { title: "Oakline", platform: "Framer", image: `${MG}/2026/07/framer-oakline-900x500.jpg` },
  { title: "Das Studio", platform: "Framer", image: `${MG}/2026/07/framer-dasstudio-900x500.jpg` },
  { title: "Presensio", platform: "Framer", image: `${MG}/2026/07/framer-presensio-900x500.jpg` },
  { title: "Millls", platform: "Readymag", image: `${MG}/2026/07/readymag-mills-900x500.jpg` },
  { title: "Aurevia", platform: "Framer", image: `${MG}/2026/03/aureviatravels.framer.website_-900x500.png` },
  { title: "Field Theory", platform: "Framer", image: `${MG}/2026/02/fieldtheory.framer.website_-1-900x500.png` },
  { title: "RAWLINE", platform: "Framer", image: `${MG}/2026/02/rawline.framer.website_-900x500.png` },
  { title: "BrandKit", platform: "Framer", image: `${MG}/2026/02/brandkitpro.framer.website_-900x500.png` },
  { title: "NOIRI", platform: "Framer", image: `${MG}/2026/02/noiristudio.framer.website_-900x500.png` },
  { title: "SAVORY", platform: "Framer", image: `${MG}/2026/02/savoryblog.framer.website_-900x500.png` },
  { title: "Neuronix", platform: "Framer", image: `${MG}/2026/01/neuronix.framer.ai_-900x500.png` },
  { title: "Bruja", platform: "Framer", image: `${MG}/2026/01/bruja.framer.website_-900x500.png` },
  { title: "Fortify Hugo", image: `${MG}/2026/01/fortify-hugo.vercel.app_-900x500.png` },
];

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

export const websiteTags = [
  "AI", "Portfolio", "Personal", "Startup", "One page", "Agency", "E-commerce", "Branding", "Tools", "Fashion",
  "SAAS", "Finance", "Type foundry", "Non-profit & charity", "Crypto & web3", "Architecture & interior design",
  "Animation", "Consulting", "Programming", "Software", "Online Gallery", "Directory", "Food & drink",
  "Museum & gallery", "Real estate", "Photography", "Entertainment", "Product", "App", "Music", "Science",
  "Education", "Healthcare", "Blog", "Production Studio", "Research", "Pricing",
];

export const templateTags = [
  "Readymag", "Framer", "Webflow", "WordPress", "JavaScript", "Squarespace", "Shopify", "Super", "Tailwind", "Bootstrap", "Astro",
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

export type SearchMode = "websites" | "templates" | "tools";

export const searchMenus: Record<SearchMode, { label: string; items: Count[] }> = {
  websites: {
    label: "Types",
    items: parse(
      "Advertising|8,Agency|756,AI|55,Animation|22,Annual Report|1,App|60,Architecture & interior design|119,Art|6,Audio|8,Automotive|5,B2B|3,Blog|46,Book|7,Branding|84,Catalogue|5,Coaching|4,Code Library|2,Consulting|17,Crypto & web3|20,Directory|19,Documentary|2,E-commerce|142,Editorial|13,Education|27,Entertainment|17,Environmental|9,Fashion|17,Festival & conference|10,Finance|33,Food & drink|39,Games & gaming|4,Healthcare|26,Hiring|2,Hotel & venue|9,Law Firm|3,Legal|2,Magazine|6,Manufacturing|1,Museum & gallery|17,Music|35,Non-profit & charity|19,One page|123,Online Gallery|22,Personal|802,Pets|1,Photography|74,Platform|13,Podcast|6,Portfolio|979,Pricing|96,Product|86,Production Studio|40,Programming|17,Publisher|4,Real estate|24,Record Label|3,Research|17,SAAS|59,Science|23,Security|2,Software|17,Sports|14,Startup|127,Tools|80,Travel|8,Type foundry|24,Venture Capital|5,Wedding|1,Workshop|5,Writer|7"
    ),
  },
  templates: {
    label: "Platforms",
    items: parse("Astro|5,Bootstrap|1,Framer|123,JavaScript|1,Readymag|22,Shopify|4,Squarespace|4,Super|1,Tailwind|2,Webflow|18,WordPress|1"),
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
