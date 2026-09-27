@AGENTS.md

# F-Cult UI — project rules

F-Cult UI is a gallery of ready-to-ship mobile screens. Every screen ships with Flutter **and** React Native code that
produces identical UI. The web shell is a pixel-exact port of minimal.gallery (Next.js 16 App Router, React 19, Framer
Motion, GSAP, Lenis, Tailwind v4 utilities without preflight).

## Read before touching UI
1. `DESIGN.md` is the design law. Every color, size, radius, easing and component spec lives there. Build from its
   tokens only. If something new is genuinely needed, add it to DESIGN.md's YAML first and say why.
2. `docs/PLAN.md` holds the product architecture and roadmap (rendering tiers, content model, detail page, CLI).
3. The Next.js docs in `node_modules/next/dist/docs/` (see AGENTS.md). This Next version has breaking changes.

## Non-negotiables
- **Shell stays greyscale.** No accent color, no shadows and no gradients in site chrome. Color lives only inside the
  device screens and the single promo tile.
- **Typography:** Inter variable only (`app/fonts/`). The shell uses weights 400 and 510 only. Body text is 17px (16px below 992px).
- **All shell styles go in `app/globals.css`**, using the existing class families (`.header`, `.filters`, `.tags-menu`,
  `.posts`, `.post`, `.media`, `.posts-header`, `.page`, `.pagination`, `.footer`, `.modal`). Colors always come from
  CSS variables so `html.light` keeps working. Do not add CSS modules or inline hex values in the shell.
- **Breakpoints are fixed:** 1500 / 1081 / 992 / 768 / 744 / 520. Gutters derive from `--page--spacing`.
- **Branding** comes from `lib/site.ts` (`site.name` and friends). Never hard-code the brand string.
- **Pixel-perfect means measured.** After a layout change, verify in the browser pane (computed styles and bounding
  boxes), not just by eye.

## Devices & screens
- `components/device/Device.tsx`: `<Device>`, `<ScaledDevice>`, `<DeviceFan>`. The design canvas is **414 × 868** with a
  **390 × 844** screen. Size device parts in px only; scaling is done by `useDeviceScale`.
- The device frame supplies status bar, camera, home indicator and safe areas (`--safe-top` / `--safe-bottom`).
  Screen code (HTML demo, React Native, Flutter) must NOT draw them.
- Screen tiles show one frameless screen at a time via `<ScreenCarousel>` (arrows, dots, swipe and ←/→ step through
  `screen.flow`). Kit tiles use `<DeviceFan bare>`. Screens are always 390 × 844. Follow the
  Mobbin-style anatomy in DESIGN.md → Cards & Containers (tile, badges, glass save and toolbar, meta row).
  The framed device stays available for hero and detail views.
- `platform` ("ios" | "android") and `framework` ("flutter" | "rn") are global app state (`useApp()`, persisted in
  localStorage). Never make either a per-card setting. The code page must read the same `framework` value.
- Screen animations must be declared only under `.device[data-playing]` so previews replay on hover. Playback is
  triggered by `usePlayback` in `components/ScreenCards.tsx` (hover on pointer devices, centred-in-view on touch).
- Every screen renders through `components/device/ScreenView.tsx`. Until the live React Native web render (step D) and
  Flutter multi-view host (step E) exist, it shows a neutral "Live preview is building" surface. No mock UI, screenshots
  or videos, ever.

## Screen source code & detail page
- **All content lives in Neon** (Drizzle schema in `db/schema.ts`, migrations in `db/migrations`, `pnpm db:generate` /
  `pnpm db:migrate`). An app (`apps`) is one gallery card and one `/screens/<app-slug>` page. Its `screens` (ordered by
  `position`) are the flow steps, and each has `screen_sources` (flutter / rn files, usage, deps) and `screen_props`.
  Only `status = 'live'` screens are public.
- Read content only through `lib/content.ts` (`getScreens`, `getCategories`, `getScreen`). It is server-only, cached under
  the `content` tag in production (the admin must `revalidateTag("content")` after a publish), and uncached in `next dev`.
  Client components receive content as props. `lib/code.ts` turns sources into highlighted `CodeFile`s.
- Both implementations of a design must stay pixel- and timing-identical (same tokens, same durations/easings).
- `/screens/[slug]` lives in the `app/screens/(detail)/` route group: `layout.tsx` holds the persistent rail + mobile
  bar/sheet (`components/detail/ScreenNav.tsx`), `template.tsx` animates the article. Anything `position: fixed`
  under page transitions must be portalled to `document.body` (ancestors carry transforms).
- `/screens/[slug]` prerenders every published app (`generateStaticParams` from the DB); new slugs render on demand.
  Flutter lock keys are `s<i>-source` / `s<i>-usage` (`flutterKey()` in `lib/code.ts`).
- Framework-dependent code renders both panes; visibility is driven by `html[data-fw]` (set before paint by the boot
  script and by `setFramework`). Never switch code by conditional rendering — it would flash on load. The inactive pane
  is `height: 0`, so each block is exactly as tall as the visible file.

## Auth & code access
- Clerk (v7 signal API) drives auth; **all auth UI is ours** (`components/auth/AuthModal.tsx`). Never render Clerk's
  prebuilt `<SignIn/>` components. Methods: Email OTP + Google only.
- Access rule: **React Native code is public; Flutter code is members-only.** Flutter source must never be embedded in
  page HTML — pages ship `LockedFile` stubs (`lib/code-types.ts`), and the real files come from `/api/code/[slug]`
  after `auth()`. Any new Flutter code surface must go through `useFlutterCode()` / `CodeBlock`.
- Everything must keep working without Clerk keys (`lib/auth-config.ts`): no ClerkProvider, proxy is a no-op,
  everyone is signed out.

## Admin panel (`/admin`)
- Owner-only: `lib/admin.ts` allows only the Clerk user IDs in `ADMIN_USER_IDS`; everyone else gets a 404.
  **Every admin page and every server action in `app/admin/actions.ts` must call `requireAdmin()` itself** — the
  layout check does not protect actions.
- Admin reads go through `lib/admin-queries.ts` (uncached, includes Flutter source). Mutations are server actions that
  highlight code with Shiki at save time and call `updateTag("content")` so the public site updates at once.
- Publishing a screen requires both Flutter and React Native source. Only `live` screens are public.
- The UI reuses the site shell: `.detail` grid + `.detail-sidebar` rail with `.nav-*` classes, auth-style inputs,
  `.tool-btn` / `Segmented` controls, `.admin-*` classes in `app/globals.css`. Monaco (`@monaco-editor/react`, CDN)
  is themed to `--color--code-background`.

## Explore wall
- `/explore` (the old `/templates`, redirected in `next.config.ts`) is immersive: `Header`, `Footer` return null there,
  Lenis is stopped, and `ExploreWall` portals a fixed wall to `<body>`. Its scroll is a custom infinite engine on the
  GSAP ticker (refs + direct transforms — never React state per frame).
- Every screen of every flow is a tile; links go to `/screens/<slug>` (`?screen=<i>` for non-cover screens, which selects that screen in the detail page's flow strip).

## Motion
- Reveals use GSAP with `expo.out` / `--ease-out-expo` `cubic-bezier(0.16,1,0.3,1)`, 1.1–1.25s, always inside
  `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
- Hero text uses `useHeroReveal` (SplitText line masks) with `data-reveal`. Grid items use `data-card`, and
  `PostsGrid` batch-reveals them.
- Modals and toggles use framer-motion springs (existing values: 380/34 modal, 500/38 toggle pill).
- Lenis owns scrolling. Scrollable inner panels need `data-lenis-prevent`.

## Workflow
- Package manager: **pnpm**. Checks before finishing: `npx tsc --noEmit`, `pnpm lint`, `pnpm build`.
- Dev server config lives in `.claude/launch.json` (`dev`, port 3000).
- Images: remote images go through `FadeImg`. Plain `<img>` is intentional (no next/image optimisation of third-party assets).
