---
version: alpha
name: fcult-ui-design-analysis
description: FCult UI is a dark-first gallery of mobile screens. The black canvas stays quiet so the screens themselves carry all the color. Its shell is a pixel-exact port of minimal.gallery. The page has almost no chrome: one typeface (Inter variable), 17px body text, soft pill-shaped grey controls and hairline dividers. Each card shows a live, CSS-drawn iOS or Android device that plays its animation on hover. There is no brand accent color on the site. Grey steps set the hierarchy, and the only saturated color comes from the screens inside the devices and from one lime All-Access promo tile. The site has no drop shadows and no decorative gradients, apart from the device hardware and that promo.

colors:
  # --- Dark theme (default; html without .light) ---
  canvas: "#000000"                 # --color--body
  body: "#b3b3b3"                   # --color--font (default text)
  ink: "#ffffff"                    # --color--font-contrast (headings, active, links on hover)
  ink-soft: "#d9d9d9"               # --color--font-contrast-50
  muted: "#939393"                  # --color--font-low-contrast (notes, descriptions, footer bar)
  error: "#ff7373"                  # --color--font-red
  hairline: "#242424"               # --color--border
  hairline-strong: "#333333"        # --color--border-strong
  surface-subtle: "#181818"         # --color--background-subtle / card media / modal / inputs
  surface: "#1f1f1f"                # --color--background (tag pills, pagination)
  surface-25: "#242424"             # --color--background-contrast-25 (CTA pill, ESC label)
  surface-50: "#2c2c2c"             # --color--background-contrast-50 (active pill, icon buttons)
  surface-100: "#353535"            # --color--background-contrast (hover of surface-50)
  surface-150: "#3e3e3e"            # --color--background-contrast-150
  header: "rgba(0,0,0,0.92)"        # --color--header-background
  backdrop: "rgba(0,0,0,0.82)"      # --color--modal-backdrop
  button-text: "#d8d8d8"            # --color--button
  button-bg: "rgba(255,255,255,0.2)"
  button-bg-hover: "rgba(255,255,255,0.3)"
  promo-lime: "#d6ff3f"             # All-Access promo gradient start
  promo-green: "#9dfc5f"
  promo-mint: "#45e0a8"
  on-promo: "#0b0b0b"               # --color--promo-ink
  glass: "rgba(24,24,24,0.72)"      # tile toolbar / save button (blur 16px, saturate 170%)
  glass-border: "rgba(255,255,255,0.08)"
  glass-fill: "rgba(255,255,255,0.12)" # buttons inside the glass bar (0.2 on hover)
  code-background: "#0c0c0c"        # --color--code-background (#fafafa in light)
  badge-new: "{colors.promo-lime}"  # nav "New" badge
  badge-updated: "#8be9df"          # --color--badge-updated, nav "Updated" badge
  # --- Light theme overrides (html.light) ---
  light-canvas: "#ffffff"
  light-body: "#4c4c4c"
  light-ink: "#000000"
  light-muted: "#6c6c6c"
  light-hairline: "#eeeeee"
  light-surface: "#f3f3f3"
  light-surface-25: "#e7e7e7"
  light-surface-50: "#dddddd"
  light-thumbnail: "#efefef"
  # --- Device hardware (not UI chrome) ---
  device-bezel: "#050505"
  device-titanium: "linear-gradient(145deg,#5b5b60,#2a2a2d 18%,#1b1b1d 50%,#2c2c2f 82%,#616166)"
  device-pixel: "linear-gradient(145deg,#3a3c40,#1d1e21 30%,#16171a 60%,#2b2d31)"

typography:
  display-intro:
    fontFamily: "Inter (variable 100–900, v5.3.0 latin, self-hosted), sans-serif"
    fontSize: "clamp(37px, 1.4vw, 39px) ≥1500 · clamp(34px, 3vw, 36px) <1500 · clamp(32px, 4vw, 34px) <992 · clamp(27px, 6.2vw, 32px) <768"
    fontWeight: 510
    lineHeight: 1.12
    letterSpacing: -0.032em
  subheading:
    fontFamily: "Inter"
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.01em
  lead:
    fontFamily: "Inter"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  card-title-tool:
    fontFamily: "Inter"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.01em
  tile-name:
    fontFamily: "Inter"
    fontSize: 16px
    fontWeight: 510
    lineHeight: 1.3
    letterSpacing: -0.01em
  body:
    fontFamily: "Inter"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.01em
  body-page:
    fontFamily: "Inter"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: -0.01em
  button-sm:
    fontFamily: "Inter"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.01em
  note:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.01em
  tile-tagline:
    fontFamily: "Inter"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.01em
  toolbar:
    fontFamily: "Inter"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.01em
  meta:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.01em
  kbd:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.08em

rounded:
  none: 0px
  kbd: 4px
  menu-item: 5px
  input: 6px
  image: 7px
  app-icon: 10px
  badge: 8px
  tile: 24px          # --border-radius--tile
  tool-card: 10px
  modal: 14px
  tool-icon: 14px
  pill: 60px
  full: 50%
  device-ios-frame: 68px
  device-ios-screen: 56px
  device-android-frame: 50px
  device-android-screen: 38px
  bare-ios-screen: 52px
  bare-android-screen: 34px

spacing:
  page: 40px          # --page--spacing (20px below 992px)
  page-half: 20px
  xxs: 5px            # header link padding
  xs: 6px             # tag-pill gap
  sm: 10px            # newsletter wrapper padding, meta gap
  md: 15px            # card text margin-top
  lg: 26px            # modal spacing
  xl: 44px            # grid row gap (page + 4)
  section: 70px       # pagination top padding (page + 30)
  header-height: 72px # 57px <992, 54px <768

components:
  header:
    backgroundColor: "{colors.header}"
    textColor: "{colors.body}"
    typography: "{typography.body}"
    height: "{spacing.header-height}"
    padding: "19px 35px"
  header-link-current:
    textColor: "{colors.ink}"
  header-cta:
    backgroundColor: "{colors.surface-25}"
    rounded: "{rounded.pill}"
    padding: "5px 12px"
  header-cta-hover:
    backgroundColor: "{colors.surface-50}"
  tag-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "5px 12px"
  tag-pill-hover:
    backgroundColor: "{colors.surface-50}"
    textColor: "{colors.ink}"
  tag-pill-all:
    backgroundColor: "{colors.surface-50}"
  platform-toggle:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "3px"
  platform-toggle-selected:
    backgroundColor: "{colors.surface-50}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
  screen-tile:
    backgroundColor: "{colors.surface-subtle}"
    rounded: "{rounded.tile}"
    aspectRatio: "13 / 18"
    content: "frameless screen at 85% of tile height"
  screen-tile-hover:
    backgroundColor: "{colors.surface}"
  kit-tile:
    backgroundColor: "{colors.surface-subtle}"
    rounded: "{rounded.tile}"
    aspectRatio: "9 / 5"
  tile-badge:
    backgroundColor: "{colors.surface-100}"
    textColor: "{colors.ink}"
    fontSize: 13px
    fontWeight: 510
    rounded: "{rounded.badge}"
    padding: "6px 8px"
  tile-lock:
    backgroundColor: "{colors.surface-100}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 25px
  carousel-arrow:
    backgroundColor: "{colors.glass}"
    border: "1px solid {colors.glass-border}"
    rounded: "{rounded.full}"
    size: 40px
    position: "vertically centred, 14px from the tile edge"
  carousel-dot:
    backgroundColor: "rgba(255,255,255,0.24)"
    active: "{colors.ink}"
    size: 6px
    hitArea: 12px
  tile-save:
    backgroundColor: "{colors.glass}"
    border: "1px solid {colors.glass-border}"
    rounded: "{rounded.full}"
    size: 34px
  tile-toolbar:
    backgroundColor: "{colors.glass}"
    border: "1px solid {colors.glass-border}"
    typography: "{typography.toolbar}"
    rounded: "{rounded.pill}"
    padding: "4px"
  tile-toolbar-button:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: 28px
    padding: "0 11px"
  tile-toolbar-unlock:
    backgroundColor: "linear-gradient(135deg, {colors.promo-lime}, {colors.promo-mint})"
    textColor: "{colors.on-promo}"
  app-icon:
    backgroundColor: "accent gradient (+18% white to -22% black)"
    textColor: "#ffffff"
    rounded: "{rounded.app-icon}"
    size: 40px
  tile-name:
    textColor: "{colors.ink}"
    typography: "{typography.tile-name}"
  tile-tagline:
    textColor: "{colors.muted}"
    typography: "{typography.tile-tagline}"
  media-icon-button:
    backgroundColor: "{colors.surface-50}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 38px
  media-icon-button-hover:
    backgroundColor: "{colors.surface-100}"
  tool-card:
    backgroundColor: "{colors.surface-subtle}"
    rounded: "{rounded.tool-card}"
    padding: "26.667px"
  newsletter-wrapper:
    backgroundColor: "{colors.surface-subtle}"
    rounded: "{rounded.pill}"
    padding: "10px"
  newsletter-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 18px"
  newsletter-submit:
    backgroundColor: "{colors.surface-50}"
    textColor: "{colors.button-text}"
    rounded: "{rounded.full}"
    size: 45px
  digest-button:
    backgroundColor: "{colors.surface-25}"
    textColor: "{colors.button-text}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.pill}"
    padding: "8px 22px"
  button-mini:
    backgroundColor: "{colors.button-bg}"
    textColor: "{colors.button-text}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
  pagination-number:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
    minWidth: 33px
  pagination-number-current:
    backgroundColor: "{colors.surface-50}"
    textColor: "{colors.ink}"
  search-modal:
    backgroundColor: "{colors.surface-subtle}"
    rounded: "{rounded.modal}"
    width: 500px
    maxHeight: 500px
    top: 120px
  search-menu-item-hover:
    backgroundColor: "{colors.surface-25}"
    rounded: "{rounded.menu-item}"
    padding: "7px 13px"
  promo-tile:
    backgroundColor: "linear-gradient(160deg, {colors.promo-lime}, {colors.promo-green} 55%, {colors.promo-mint})"
    textColor: "{colors.on-promo}"
  footer:
    textColor: "{colors.body}"
    borderTop: "1px solid {colors.hairline}"
    padding: "{spacing.page}"
---

## Overview

FCult UI is a gallery shell: a black canvas, grey type and a grid of phone mockups. The shell is a 1:1 port of minimal.gallery. Its rules were read from the original stylesheet and checked against the live site with measurements that matched to the pixel. Nothing in the chrome competes with the content. There are no brand-colored buttons, no shadows and no decorative gradients, so each screen's own palette is the most colorful thing on the page.

The product-specific layer sits on top of that shell. Each card holds a **CSS-drawn device** (iPhone-style or Pixel-style). Inside it, a screen renders at its true logical size of 390 × 844 and the whole device is scaled down uniformly. Hovering a card plays the screen's animation. A global **iOS / Android** switch morphs every frame; for example, the Dynamic Island shrinks into a punch-hole camera. Whatever you build next must keep this split: the shell stays greyscale and quiet, and color lives inside the devices.

## Colors

### Brand & Accent
There is **no UI accent color**. Emphasis comes from stepping up the grey ladder: `{colors.body}` becomes `{colors.ink}`, and `{colors.surface}` becomes `{colors.surface-50}`. The only saturated color in the chrome is the All-Access promo tile (`{colors.promo-lime}` → `{colors.promo-mint}`). It is reserved for monetisation and appears at most once per grid.

### Surface
- `{colors.canvas}`: the page. The sticky filters bar also uses it, so the bar reads as part of the page.
- `{colors.surface-subtle}`: card media wells, tool cards, the search modal and the newsletter capsule.
- `{colors.surface}`: resting tag pills, pagination numbers and the platform-toggle track.
- `{colors.surface-25}`: header CTA and the ESC label. `{colors.surface-50}`: the active/selected pill and the 38px icon buttons. `{colors.surface-100}`: hover for `surface-50` elements.
- `{colors.header}`: the fixed header, a 92% black that lets content faintly show through when it scrolls under.

### Text
- `{colors.ink}`: headings, card titles, the current nav item and link hover.
- `{colors.body}`: default text, including nav links, pills and footer links.
- `{colors.muted}`: the newsletter note, tool descriptions and the footer bar.
- `{colors.ink-soft}`: rarely used; mobile menu links.

### Hairlines & Borders
- `{colors.hairline}`: the footer top border, the search input divider, and the border that appears on the sticky filters bar when it is revealed.
- `{colors.hairline-strong}`: the mobile menu divider.
- Tiles have no border. Frameless screens inside them get a 1px `rgba(255,255,255,.08)` ring (`rgba(0,0,0,.08)` in light mode).
- The glass toolbar and save button use `{colors.glass-border}`.

### Brand Gradient
The UI has no decorative gradients. The only exceptions are:
1. The promo tile gradient.
2. The device hardware (`{colors.device-titanium}`, `{colors.device-pixel}`).
3. A very faint radial well at the bottom of each mockup card (`surface-25` fading into `surface-subtle`).
4. The 12px edge fades on the horizontally scrolling tag row.

### Semantic
`{colors.error}` is defined for form errors but no error state has been built yet (see Known Gaps).

### Light theme
Pressing Alt+M or using the footer switch toggles `html.light`, which remaps the same tokens (`{colors.light-*}`). Components never hard-code dark values; they always read the CSS variables.

## Typography

### Font Family
The site uses a single family: **Inter variable** (v5.3.0, latin, `app/fonts/inter-latin-wght-normal.woff2`). It is loaded through `next/font/local` as `--font-inter`. The variable axis is required because headings use weight **510** (520 in light mode). The only monospace text is the `Alt + M` kbd.

### Hierarchy
| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| display-intro | clamp 27–39px | 510 | 1.12 | -0.032em | Home hero h1, listing h1, About h1 |
| lead | 20px | 400 | 1.4 | 0 | About intro paragraph (white) |
| subheading | 19px | 400 | 1.4 | -0.01em | Listing h2 under the hero |
| card-title-tool | 18px | 400 | 1.4 | -0.01em | Tool card name |
| body | 17px (16px <992) | 400 | 1.4 | -0.01em | Everything else: nav, pills, card titles, footer |
| body-page | 17px | 400 | 1.55 | -0.01em | Long-form pages (About) |
| button-sm | 15px | 400 | 1 | -0.01em | Digest button, platform toggle, search-mode button |
| tile-name | 16px | 510 | 1.3 | -0.01em | Screen/kit name under a tile |
| tile-tagline | 15px | 400 | 1.3 | -0.01em | One-line subtitle under a tile |
| note / meta | 14px | 400 | 1.3 / 1.4 | -0.01em | Newsletter note, tool category |
| toolbar | 13px | 400 | 1 | -0.01em | Glass toolbar (Flutter / RN, Copy) |
| kbd | 12px mono | 400 | 1 | -0.08em | Keyboard hints |

### Principles
- Body text is **17px**, not 16px, and it only drops to 16px below 992px.
- Only two weights appear in the chrome: **400** and **510**. `strong` and `b` are reset to 400. Do not add 500, 600 or 700 to the site UI (screens inside devices are exempt).
- Every heading is tightly tracked (-0.032em). Body text uses -0.01em.
- Card titles never wrap above 743px; they truncate with an ellipsis.
- Hero headings use `text-wrap: balance` with `max-width: 24ch`.

### Note on Font Substitutes
Inter is open source and self-hosted, so no substitute is needed. Always load the variable file; static weights cannot produce 510.

## Layout

### Spacing System
Everything derives from `{spacing.page}`, which is 40px (20px below 992px):
- The header horizontal padding is `page − 5px`.
- Grid gaps are `page + 4px` for rows and `page` for columns.
- Pagination top padding is `page + 30px`.
- Footer padding is `page`, and the footer's top margin is `page + 20px`.
- Hero vertical padding is `clamp(page, 2.8vw, page × 2)`.

### Grid & Container
- The shell is full-bleed with `{spacing.page}` gutters and no max-width, except long-form `.page` content, which is capped at 580px.
- **Screen grid** (`.posts.screens`): 4 columns at 1500px and above, 3 from 1081–1499px, 2 from 744–1080px, and 1 below that. The promo occupies row 1 in the last column.
- **App-kit grid** (`.posts.templates`) uses the same columns, with 9:5 media and a fan of three devices.
- **Tools grid**: 4 columns at 1181px and above, 3 at 1181–1499px (inherited), 2 at 1180px and below, and 1 at 767px and below. At 2560px and above it has 5 columns.

### Whitespace Philosophy
The page is quietly generous. The hero has about 40px of vertical padding, and the grid starts right after the 20px-padded filter bar. The density comes from the grid itself: cards are close together and hold no copy beyond a title and a category. The footer breaks this rule with larger 60px blocks.

## Elevation & Depth
| Level | Treatment | Use |
|---|---|---|
| 0 Flat | none | Everything in the shell |
| 1 Translucent | 92% black header | Fixed header |
| 2 Backdrop | 82% black overlay | Search modal, mobile menu |
| Glass | `{colors.glass}` + blur 16 / saturate 170%, shadow `0 12px 30px -12px rgba(0,0,0,.6)` | Tile toolbar and carousel arrows (hover only) |
| Lift | `0 28px 50px -26px rgba(0,0,0,.85)` | Frameless screen while its tile is hovered |
| Hardware | `0 30px 60px -20px rgba(0,0,0,.6)` | Framed device only |

The shell uses **no drop shadows at rest**. Shadows appear only on hover interactions (lift and glass), and under framed device hardware.

### Decorative Depth
Card media carries a faint radial well that suggests a floor for the phone to stand on. On hover the device lifts by `translateY(-6px)`, and a 25% black gradient fades in over the media.

## Shapes

### Border Radius Scale
| Token | Value | Use |
|---|---|---|
| kbd | 4px | Keyboard hint chip |
| menu-item | 5px | Search modal rows |
| input | 6px | Plain inputs |
| image | 7px | Legacy media wells (tools page) |
| app-icon | 10px | 36px app icon under tiles |
| badge | 8px | "New" / "Updated" tile badges |
| tile | 24px | Screen, kit and promo tiles |
| bare-ios / bare-android | 52 / 34px | Frameless screens inside tiles |
| tool-card | 10px | Tool cards |
| modal / tool-icon | 14px | Search panel, 56px tool icons, app-kit menu |
| pill | 60px | Every button, pill, toggle, capsule and pagination item |
| full | 50% | 38px, 36px and 45px icon buttons |
| device-ios-* | 68 / 56px | iPhone frame and screen |
| device-android-* | 50 / 38px | Pixel frame and screen |

### Photography Geometry
The gallery contains no photography. Its imagery is live screen renders:
- **Screen tiles** (Mobbin-style): the tile has a **13:18** aspect ratio and holds one **frameless** screen at a time (`<ScreenCarousel>`, 390 × 844) at 85% of the tile height. The screen gets iOS (52px) or Android (34px) corners and a 1px hairline ring drawn in real px.
- **Kit tiles**: 9:5, holding a `<DeviceFan bare>` of three screens at 78% of the tile height. The side screens are rotated ±9° and scaled to 0.9, then spread to ±12° on hover.
- The framed `<Device>` (414 × 868 canvas with bezel and buttons) is kept for hero or detail-page use. Never size screens with relative units.

## Components

### Top Navigation
**`header`**: fixed and 72px tall. Left: Screens, Templates, Tools. Center: the brand name from `site.name` in `{colors.ink}`. Right: Search, About, the **`header-cta`** ("Submit") pill, and a bookmark icon with a 4px dot that appears when bookmarks exist. The current route's link turns `{colors.ink}` (**`header-link-current`**). On load the header slides down 24px with a fade (0.9s, expo-out). Below 992px the left menu hides and a two-line burger opens the mobile menu panel (360px wide, slides in 30px from the right).

### Buttons
- **`newsletter-submit`**: a 45px circle with an arrow icon. On hover the arrow nudges right 2px.
- **`digest-button`**: a text pill joined to a 38px circle with a send icon. On hover the icon rotates 45°.
- **`button-mini`**: a translucent white pill, used for "Get in touch".
- **`media-icon-button`**: a 38px circle placed inside card media, holding bookmark and code (`</>`) actions. It is hidden until hover and rises 6px as it fades in.

### Cards & Containers
Gallery cards follow Mobbin's anatomy: **tile, then meta row**.
- **`screen-tile`**: `{colors.surface-subtle}`, `{rounded.tile}`, 13:18. It shows **one screen** from the app's `flow` (4 screens). On hover it lightens to **`screen-tile-hover`** and the screen lifts (`translateY(-4px) scale(1.018)`, with a soft 28/50 shadow). A 32% black floor shade fades in at the bottom so the toolbar stays legible.
  - Top-left, **always visible**: **`tile-lock`** (for Pro screens) and/or **`tile-badge`** ("New" / "Updated" / "3 screens").
  - Top-right, **on hover**: **`carousel-dot`** pagination. The active dot glides with a framer `layoutId` spring (520/36), and each dot jumps to its screen.
  - Edge-centred, **on hover**: **`carousel-arrow`** next (right) and prev (left, only after the first screen). Each arrow springs in from 8px, shrinks to .88 when pressed, and its icon nudges 2px on hover. There is no looping: the next arrow disappears on the last screen.
  - **Carousel motion** (`components/ScreenCarousel.tsx`, framer-motion, direction-aware):
    - Enter: from x ±72%, rotateY ∓24°, scale .86, opacity 0, blur 8px, animated with a spring (240/30, mass .9). Opacity animates over .35s and blur over .45s.
    - Exit: to x ∓72%, rotateY ±24°, scale .86, blur 8px, over 0.5s `cubic-bezier(.32,.72,0,1)`.
    - The frame has 1400px perspective, and the tile clips the travel.
    - Swipe (offset + 0.2 × velocity > 60px) and ←/→ keys also step through; a swipe never triggers the tile link.
  - Bottom center, **on hover**: **`tile-toolbar`**, a glass capsule that rises 10px and scales from .96 to 1 (0.55s expo). It contains:
    1. The Flutter | RN switch (the global `framework` preference; a 50% pill slides between the options).
    2. A divider.
    3. **`tile-toolbar-button`** "Copy", which copies `npx fcultui add <slug> --flutter|--react-native` and morphs into ✓ "Copied". For Pro screens this becomes **`tile-toolbar-unlock`**.
    4. A 28px `</>` "view code" circle.
    5. A 28px save (bookmark) circle, which fills when saved.
  - On touch devices the dots and arrows are always visible, and the toolbar shows while the card is playing.
- **Meta row**: 16px below the tile, with a 10px gap. It holds a 40px **`app-icon`** (the accent gradient with the screen's initial), **`tile-name`** (16/510, ink) and **`tile-tagline`** (15px, muted, one line with an ellipsis).
- **`kit-tile`**: the same anatomy at 9:5. The meta row reads "{Kit}" over "{Category} app kit".
- **`promo-tile`**: pinned to the last column of row 1, with a lime gradient, a 26–38px 650-weight headline and Flutter/RN chips. Its meta row uses a lime lock app-icon.
- **`tool-card`** (tools page only): 56px icon (radius 14), 18px name, 14px category at 70% opacity, a 36px arrow button, a `{colors.muted}` description and a domain link pinned to the bottom.

### Inputs & Forms
- **`newsletter-wrapper`** + **`newsletter-input`**: a pill capsule holding a black pill input and a round submit button. A 900ms spinner plays, then the form crossfades into "Thanks, please confirm via email."
- Search input: borderless, with 20px vertical padding and a `{colors.hairline}` bottom border for the section.

### Tags / Badges
**`tag-pill`**: `{colors.surface}` background with `{colors.body}` text, padded 5px 12px, with a 6px gap. On hover it switches to **`tag-pill-hover`**. **`tag-pill-all`** is the darker "All types" button that opens the search modal.

### Tab / Filter
- **Filters bar**: sticky, but it only appears under the header after you scroll *up* past it. It slides in with `filtersShow` (0.2s) and gains a hairline top border. The tag row scrolls horizontally with 12px gradient fades at the edges.
- **`platform-toggle`**: a segmented control reading "iOS | Android" with Apple and Android glyphs. A framer-motion `layoutId` pill (spring 500/38) slides between the two options. The choice is stored in `localStorage["mg-platform"]` and applies to every device on the site.

### Signature Components
- **Device** (`components/device/Device.tsx`): `platform` is "ios" or "android" and `tone` is "light" or "dark". The tone sets the status-bar and home-indicator colors. The screen's `--accent` is passed in as a prop, and `playing` sets the `[data-playing]` attribute. Switching platform animates the frame radius, gradient, camera shape, status bar layout and buttons over 0.6s `cubic-bezier(.65,0,.35,1)`.
- **Screens** (`components/screens/`): 390 × 844 logical px, sized in real px. Every animation is declared **only** under `.device[data-playing]`, so a preview restarts from the beginning on every hover.
- **Playback trigger**: on pointer devices a preview plays on hover. On touch devices it plays while the card sits in the middle 30% of the viewport (IntersectionObserver).
- **Search modal**: 500px wide, 120px from the top, radius 14. It opens with a spring (380/34) from y30 and scale .98, and closes on ESC. The mode switch (Screens / Templates / Tools) opens a small 150px menu. The category list items stagger in by 18ms each.

### Screen Detail Page (`/screens/[slug]`)
This page follows the Aceternity component-page anatomy, built only from FCult tokens:
- **Grid**: a `264px` sticky left rail, then `.detail-body`. The body contains the content column (max 880px, **centred** with `justify-self: center` so the gaps on both sides stay equal) and a `190px` "On this page" TOC at 1300px and above. The body starts 56px after the rail, with a 48px gap before the TOC. Below 992px only the content column remains.
- **Persistent shell**: the rail lives in `app/screens/(detail)/layout.tsx`, so it never remounts between screens (it keeps its scroll position, and the active pill springs from item to item). The article fades and rises 14px (0.6s expo) via `(detail)/template.tsx`.
- **Left rail** (`.detail-sidebar`, cult-ui inspired, **no colour dots**):
  - Content is masked with 22px/36px fades at the top and bottom, and the rail has a hairline right border.
  - At the top, a `nav-filter` (38px, radius 10, live filtering, screen count kbd).
  - A **GET STARTED** section: 16px line icons in `{colors.muted}` that turn ink on hover.
  - A **SCREENS** section with a count chip. Section headings are 12px/510 uppercase with 0.1em tracking, in ink.
  - **Category = collapsible header**: 16px/510 ink, then a 12px muted count and a 14px chevron. The chevron rotates −90° when collapsed (0.45s expo), and the group height springs (380/40).
  - Items (14.5px `{colors.body}`) hang off a **1px `hairline-strong` tree guide**. On hover a `{colors.surface}` wash fades in and the title nudges 2px right.
  - The active item gets a **framer `layoutId` pill** (gradient `surface-25` → `surface`, 1px `hairline-strong` inset ring, spring 420/38). Its title is 510, and a **2px ink marker with a soft glow sits on the guide** and travels with the pill.
  - **Badges are tinted glass**: 11px/510, 6px radius, text in the badge colour on a 12% fill with a 30% inset ring. **New** uses `{colors.badge-new}` and **Updated** uses `{colors.badge-updated}`; in light mode the text darkens 55%. Pro screens show a 12px muted lock.
  - **Hover peek** (pointer devices ≥992px): a 188px glass card appears 16px to the right of the rail with a live frameless preview (364px tall) plus title and tagline.
    - The first reveal waits 220ms, then the card follows the hovered item vertically with a spring (360/34). Screens swap inside it with a 14px rise.
    - It closes 140ms after the pointer leaves the list or the rail scrolls. It is portalled to `<body>`.
  - The lime All-Access card closes the rail.
- **Mobile (<992px)**:
  - A sticky, blurred **screen bar** sits under the header. It holds a 50px button (grid icon, category over title, chevron) that opens the sheet, plus 42px previous/next step buttons.
  - The **bottom sheet** is portalled to `<body>`, springs up (380/38) and has a max height of 86dvh. It can be dragged down from its handle (dragging closes it past 120px or a flick), and ESC or a backdrop tap also closes it. It reuses the same list at 16px.
- **Pager**: previous/next cards (hairline border, `surface-subtle`, 17px/510 title; the arrow nudges 3px on hover). They sit two per row, stacking below 600px.
- **Header**:
  - A breadcrumb (15px) and an h1 at `{typography.display-intro}` size, left-aligned, revealed with SplitText.
  - A 19px lead paragraph.
  - Chips (14px pills on `{colors.surface}`). Framework chips use `surface-25` with ink text; Pro screens get a lime chip.
- **Preview panel**:
  - A `Segmented` Preview | Code control on the left. Every segmented control is a `{colors.surface}` track with a `{colors.surface-50}` spring pill (500/40).
  - On the right: the iOS/Android toggle, the solid Flutter/React Native switch, a "Copy prompt" `tool-btn` (36px, `surface-25`) and a 36px fullscreen `tool-icon`.
  - The panel itself is 680px tall (600px for examples, 560px on mobile), `{colors.surface-subtle}` with a floor radial, hairline border and 18px radius. It holds a framed `<Device>` at 86% fit.
  - A glass "Replay" pill sits bottom-left and remounts the device so one-shot animations replay.
  - Switching tabs crossfades: preview blur-scales, code slides 12px, over 0.45s expo.
  - Fullscreen opens a blurred backdrop portal with a 92% device; ESC closes it.
- **Code block** (`.code`):
  - `{colors.code-background}`, hairline border, 14px radius, and a 44px header with the file name in 13px mono plus a Copy button.
  - Highlighting is done at build time by Shiki (github dark/light dual theme via `--shiki-*` vars), in 13px/1.7 mono with muted line numbers.
  - **Framework pairs render both panes in one grid cell**; the inactive pane is hidden by `html[data-fw]`, so switching never shifts layout or flashes on load.
  - Long files collapse to 340px behind a fade and an "Expand" `button-mini`.
- **Installation**: CLI | Manual segmented control, then a numbered step timeline (hairline left rule, 30px `surface-25` number bubbles with a canvas ring). Manual steps are: dependencies, tokens, source and usage.
- **Screens in this flow**: one `PreviewPanel` per remaining flow screen, each under a 20px/510 h3.
- **Props**: a hairline-bordered table (14px muted headers, 15px cells, 13px mono `code` chips on `{colors.surface}`) with Flutter and React Native type columns. On phones each row becomes a stacked card (label column 104px + value).
- **Phone layout (≤767px)**:
  - Preview/Code tabs stretch to full width, and the tools become one swipeable row that bleeds to the edges with fades.
  - The panel is 540px tall (500px for examples).
  - Code is 12px, the timeline is tighter, and section headings are 22px.
- **More screens**: a 3-column `.posts.screens` grid of regular screen tiles.
- **TOC**: a hairline left rule; the active item gets a 2px ink marker that slides with a framer `layoutId` spring.

### Explore Wall (`/explore`, formerly Templates)
An immersive, applama-style wall of **every screen of every flow** (92 tiles). The site header and footer are hidden and the wall draws its own floating bar. Code: `components/explore/ExploreWall.tsx`.
- **Grid**:
  - Full-bleed columns: `cols = round((vw − gap) / 270)`, clamped to 2–9, with gaps of 30px, 20px below 1100px and 12px below 640px.
  - Tiles are **frameless** 390 × 844 screens scaled to the column width, radius `colW × 0.075`, with a 1px inset ring.
  - Visible heights rotate through 844 / 700 / 540 / 760 / 620 logical px for a masonry rhythm.
  - The tile order is a seeded, deterministic shuffle.
- **Infinite engine**:
  - Each column track holds its tile sequence twice and is translated by `-(((current × speed + phase) mod H) + H) mod H`, which wraps **both upward and downward** forever.
  - Column speeds vary 0.84–1.14 for parallax.
  - Inputs: wheel, pointer/touch drag (1.25× with momentum), and ↑ ↓ / PageUp / PageDown / Space.
  - Smoothing is frame-rate independent (lerp 0.1 at 60fps) and runs on the GSAP ticker; React never re-renders per frame.
  - An idle drift of 26px/s eases to 0 while interacting or hovering, and is disabled under reduced motion.
- **Tile hover**: scales to 1.03 with a deep shadow, plays the screen's animation, and fades in a bottom meta strip (30px app icon, 14px/510 title, 12px category). Pro tiles show a glass lock. A drag never opens a tile.
- **Entrance**: columns rise or fall 90px alternately with a de-blur (1.4s expo, staggered from the centre).
- **Floating bar**: glass pills (`rgba(18,18,18,.62)`, blur 22 / saturate 180%).
  - Left: the brand pill (48px).
  - Centre: a search pill (max 470px) with live multi-word filtering, a result count and the `/` shortcut (it overrides the global search modal on this page).
  - Right: a 48px close circle (history back) and a white "Get started" pill.
  - On phones only the brand icon, search and close remain, at 44px.
- 150px (top) and 110px (bottom) canvas fades.

### Footer
**`footer`**: a hairline top border, the logo mark with a one-line pitch, then three menus (Site / Resources / Social) whose headings are `{colors.body}` at 60% opacity. The bottom bar holds the © line, the social links (below 1500px) and the `Alt + M` theme switch. Columns fade up with a 70ms stagger on scroll.

## Do's and Don'ts

### Do
- Read every color from the CSS variables in `app/globals.css`. Both themes are driven only by `html.light`.
- Use `{typography.body}` (17px/400) for any new UI text, and `{typography.display-intro}` for page titles.
- Make every new control a `{rounded.pill}`, using `{colors.surface}` at rest and `{colors.surface-50}` when active.
- Put screen content inside a `<Device>` and size it in logical px on the 390 × 844 canvas.
- Gate every screen animation behind `.device[data-playing]`.
- Use the motion tokens: `--ease-out-expo` `cubic-bezier(0.16,1,0.3,1)` for reveals (1.1–1.25s), springs for modals and toggles, and 0.2–0.3s ease for color changes.
- Mark new grid items `data-card` so `PostsGrid` gives them the batched scroll reveal. Mark hero elements `data-reveal`.
- Respect `prefers-reduced-motion`; every GSAP block runs inside `gsap.matchMedia()`.

### Don't
- Don't add an accent color, colored buttons or colored links to the shell.
- Don't use font weights other than 400 and 510 in the shell, or any family other than Inter.
- Don't add resting shadows to tiles, pills or modals. Shadows are for hover lift and glass only.
- Don't put more than one toolbar row on a tile, and don't show tile controls at rest (badges are the only exception).
- Don't make framework or platform a per-card setting. Both are global preferences.
- Don't change the grid breakpoints (1500 / 1081 / 744) or the gutter formula.
- Don't draw the device with images. It stays CSS, so it remains crisp and can morph between platforms.
- Don't put status bars or safe areas inside captured screen assets. The device frame supplies them.
- Don't hard-code the brand name. Use `site.name` from `lib/site.ts`.

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| xs | ≤520px | Modal becomes a bottom sheet; platform-toggle labels hide (icons only); mobile menu goes full-screen |
| sm | ≤743px | Grid collapses to 1 column; titles wrap; promo moves to row 3 |
| md | ≤767px | Header 54px; search icon replaces the "Search" label; card icon buttons always visible |
| lg | ≤991px | `page` 20px, body 16px, header 57px; burger menu; footer stacks |
| lg+ | ≤1080px | 2 columns |
| xl | ≤1140px | "About" hidden in the header |
| xl+ | ≤1499px | 3 columns; hero clamp 34–36px; footer social column moves to the bar |
| 2xl | ≥1500px | 4 columns |

### Touch Targets
Icon buttons are 37–38px, header buttons are at least 38px tall on mobile, and the platform-toggle segments are 28px tall inside a 34px track. The 28px segments are a known exception inherited from the pill height.

### Collapsing Strategy
- **Nav**: moves into the mobile panel below 992px.
- **Filters**: the tag row scrolls horizontally; "All types" and the platform toggle stay pinned on the right.
- **Grid**: columns drop 4 → 3 → 2 → 1.
- **Footer**: three columns become stacked rows.

### Image Behavior
Devices re-measure with ResizeObserver and scale to fit. Remote images (tool icons) use `FadeImg`, which lazy-loads, decodes asynchronously and fades in.

## Iteration Guide
1. Before building any page, read this file and `app/globals.css`, then reuse the existing class families (`.posts`, `.post`, `.media`, `.tags-menu`, `.page`, `.posts-header`).
2. New variants get a new component entry in the YAML above, with a kebab-case suffix such as `-active` or `-selected`.
3. New screens: add a design to `components/screens` (placeholder) or real captures (see `docs/PLAN.md`). Never change `Device` for a single screen's sake.
4. When the shell needs emphasis, step up the grey ladder before reaching for anything new.
5. Any new motion must use an existing easing token and support replay: hover to play, leave to reset.

## Known Gaps
- No error, validation or empty states have been built yet (`{colors.error}` exists but is unused).
- The detail page's flow examples reuse the demo HTML screens; live Flutter/RN hosts (PLAN §2.2–2.3) are not wired yet.
- `npx fcultui` CLI commands are displayed but the CLI does not exist yet.
- The light theme is ported from the original's tokens, but the device mockups and promo tile have not been separately tuned for it.
- Tag filtering, pagination and bookmarks exist only as UI; they are not wired to data yet.
- The Explore wall renders live HTML screens (184 tiles incl. the wrap copy). Once real captures exist, tiles should switch to poster images and hover videos (PLAN §2.1).
- Demo screens are HTML placeholders; the real screens will be captured Flutter/RN renders.
