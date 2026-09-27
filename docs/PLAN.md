# FCult UI — Product & Architecture Plan

> লক্ষ্য: হাজার হাজার ready-to-implement mobile screen। প্রতিটার **Flutter ও React Native** code থাকবে,
> একটা toggle দিয়ে দুটোর মধ্যে switch করা যাবে। UI, layout আর animation হুবহু একই থাকবে।
> Grid-এ hover করলে animation preview হবে, আর click করলে Aceternity-style code page খুলবে (আমাদের branding-এ)।

---

## 1. মূল সমস্যা

| চাই | কঠিন কেন |
|---|---|
| Grid-এ হাজারো screen, hover-এ animation | হাজারটা live Flutter/RN app চালালে browser মারা যাবে |
| Flutter screen Next.js-এ দেখানো | Flutter web ~2MB engine (CanvasKit/Skwasm) নিয়ে আসে, আর প্রতিটা screen-এর জন্য আলাদা iframe চালানো অসম্ভব |
| "UI literally unchanged" দুই framework-এ | দুটো আলাদা codebase, তাই drift হবেই, যদি না মেশিন দিয়ে যাচাই করা হয় |
| iOS আর Android দুই frame | একই screen-কে দুটো device-এ দেখাতে হবে |

## 2. Genius কৌশল: তিন স্তরের rendering

মূল আইডিয়া: **যেখানে যতটুকু দরকার, ঠিক ততটুকু runtime।**

```
┌───────────────────────────── Grid (হাজারো card) ─────────────────────────────┐
│  CSS device frame (আমাদের নিজের, crisp, iOS⇄Android morph)                    │
│    └─ poster.avif  →  hover করলে loop.webm/mp4 (৩–৬ সেকেন্ড, ~২০০KB)          │
│       কোনো Flutter/RN runtime নেই। শুধু image আর video।                          │
└──────────────────────────────────────────────────────────────────────────────┘
┌───────────────────────────── Detail page (একটা screen) ──────────────────────┐
│  Poster সাথে সাথে দেখায়। তারপর idle/hover হলে LIVE interactive preview:     │
│    Flutter → একটাই pre-built "flutter-host" engine, multi-view embedding     │
│    React Native → "rn-host" (Expo web export), lazy iframe                   │
│  "Run on your phone" → QR (Expo Snack / Flutter)                             │
└──────────────────────────────────────────────────────────────────────────────┘
┌───────────────────────────── Code (দুই framework) ───────────────────────────┐
│  Build-time-এ Shiki দিয়ে pre-highlight করা HTML, তাই client JS শূন্য।          │
│  Toggle শুধু code swap করে, preview একবিন্দুও নড়ে না।                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Grid: pre-rendered capture + CSS device frame
- Screen-এর capture নেওয়া হবে **status bar বা device ছাড়া**, শুধু 390 × 844 logical content (@2x = 780 × 1688)।
- Device frame, status bar, notch/island আর home indicator আমাদের CSS `<Device>` component আঁকবে (**এটা এখনই বানানো আছে**)।
  → **একটাই asset iOS আর Android দুই frame-এ কাজ করে।** Frame toggle instant, আর asset দ্বিগুণ হয় না।
- Asset: `poster.avif` (~৪০KB) + `loop.webm` (AV1) + `loop.mp4` (H.264 fallback)।
- Hover-এর নিয়ম এখনকার HTML demo-র মতোই: `playing` true হলে `video.currentTime = 0; video.play()`।
  Touch device-এ card viewport-এর মাঝখানে এলে play হবে। (`usePlayback` hook আগে থেকেই এই contract মেনে চলে।)
- Video `preload="none"`। শুধু poster lazy-load হয়। ফলে হাজার card থাকলেও page হালকা থাকে।

### 2.2 Detail page-এ Live Flutter: *একটাই engine, অনেক view*
- `apps/flutter-host`: একটা Flutter web app, যাতে **সব screen compile করা থাকে**।
  - প্রতিটা screen `deferred as` import হবে। Dart web **deferred loading** প্রতিটা screen-এর code আলাদা chunk-এ ভাগ করে, তাই শুধু যে screen দরকার সেটাই download হয়।
  - Registry codegen: `tool/gen_registry.dart` `content/screens/*/flutter/` scan করে `registry.g.dart` বানায়।
  - Flutter-এর **multi-view embedding** (`multiViewEnabled: true`) ব্যবহার করা হবে: `app.addView({ hostElement, initialData: { screen: "ledger-overview", platform: "ios" } })`।
    → iframe ছাড়াই আমাদের CSS device-এর screen area-র ভেতরে সরাসরি Flutter render হবে। Page-এ একাধিক preview থাকলেও (Examples section) engine **একবারই** load হয়।
  - Renderer: WasmGC সমর্থিত browser-এ Skwasm, বাকিগুলোতে CanvasKit। `/flutter-host/*` immutable cache + service worker। ফলে দ্বিতীয় visit থেকে প্রায় সাথে সাথে load হয়।
  - `platform` initialData দিলে Flutter `TargetPlatform` override হয়, তাই scroll physics আর ripple-ও iOS/Android অনুযায়ী ঠিক থাকে।
- Load কৌশল: প্রথমে poster দেখায়। `requestIdleCallback` বা hover হলে engine prefetch হয়। Ready হলে poster থেকে live view-এ crossfade।

### 2.3 Detail page-এ Live React Native
- `apps/rn-host`: Expo Router web export (react-native-web + Reanimated web)। Route `/[screen]`।
- Next-এর ভেতরে সরাসরি react-native-web চালানো সম্ভব, কিন্তু Reanimated, Gesture Handler আর Expo modules-এর bundler config Next-এর সাথে বারবার ভাঙে। তাই **isolated host + iframe** নেওয়া হলো (`postMessage` দিয়ে platform/theme sync)।
- Default preview Flutter-এ চলবে, কারণ UI তো একই। একটা ছোট "Rendered with: Flutter | RN" switch রাখা হবে, যাতে সন্দেহ থাকলে user নিজেই যাচাই করতে পারে।

### 2.4 "UI literally unchanged": মেশিন দিয়ে প্রমাণ (Parity CI)
1. **Shared design tokens**: `packages/tokens/tokens.json` থেকে Style Dictionary দিয়ে তৈরি হয়:
   - `flutter/lib/tokens.g.dart` (`AppColors`, `AppSpacing`, `AppRadius`, `AppMotion` (`Cubic(0.16,1,0.3,1)`))
   - `react-native/tokens.ts` (`colors`, `spacing`, `radius`, `motion` (`Easing.bezier(0.16,1,0.3,1)`))
   - একই font file দুই দিকে bundle হবে।
2. **Capture pipeline** (GitHub Actions):
   - Flutter host আর RN host দুটোই headless Chromium-এ (Playwright) 390 × 844 @2x-এ চলবে।
   - প্রতিটা screen-এর capture নেওয়া হবে:
     - Static poster: t = 0 আর animation-এর শেষে।
     - 4s video: CDP screencast থেকে ffmpeg দিয়ে AV1/H.264।
   - Flutter আর RN-এর frame-গুলো **pixel-diff** (pixelmatch/SSIM) করা হবে। ফল লেখা হবে `parity.json` (score) আর `diff.png`-এ।
   - Threshold পার না হলে PR fail করবে। Detail page-এ badge দেখাবে: **"Parity 99.2%"**, যা একটা trust signal।
3. **Phase 2 (অথেন্টিক native capture)**: macOS runner-এ iOS Simulator আর Android Emulator চলবে, Maestro দিয়ে flow চালানো হবে, `simctl io recordVideo` / `adb screenrecord` দিয়ে record হবে। এতে native font rendering আর আসল blur পাওয়া যায়।

---

## 3. Content model (single source of truth)

```
content/screens/ledger-overview/
├── meta.json            # title, slug, category, tags, tone, accent, deps, platforms, createdAt, pro
├── flutter/
│   ├── lib/ledger_overview_screen.dart
│   └── lib/widgets/…
├── react-native/
│   ├── LedgerOverviewScreen.tsx
│   └── components/…
├── examples/            # optional variants (Aceternity-র "Examples" section-এর জন্য)
└── preview/             # CI-generated, commit হবে না → CDN (R2/Vercel Blob)
    ├── poster.avif  loop.webm  loop.mp4  parity.json
```

`scripts/build-content.ts` (prebuild step) তৈরি করে:
- `public/manifest.json`: grid-এর জন্য হালকা list (slug, title, category, accent, poster URL)। Filter, pagination আর search index এখান থেকে আসে।
- `.content/screens/<slug>.json`: দুই ভাষার Shiki-highlighted HTML (dual theme, CSS vars), file tree, dependency list, install commands।
- Flutter আর RN host-এর registry file।

Scale: হাজার হাজার screen।
- Detail page-এ `generateStaticParams` দিয়ে জনপ্রিয় N-টা prerender হবে, বাকিগুলো on-demand + cached (Next 16 caching)।
- Grid হবে server-side pagination + `?tag=` filter।
- Search: Orama/FlexSearch index, শুধু search modal খুললে lazy-load হবে।

---

## 4. Detail / Code page (Aceternity layout, আমাদের branding)

Route: `/screens/[slug]` (আর kit-এর জন্য `/templates/[slug]`)। সব DESIGN.md token দিয়ে বানানো হবে।

1. Breadcrumb `Screens / Ledger Overview`, তারপর h1 (`display-intro`), এক লাইনের description আর tag pills।
2. **Preview panel** (`surface-subtle`, radius 14):
   - বাম দিকে tabs `Preview | Code`।
   - ডান দিকে toolbar: **framework toggle `Flutter ⇄ React Native`**, `iOS | Android` frame toggle, "Copy prompt" (AI prompt দিয়ে screen customize করার জন্য), fullscreen।
   - Preview-তে CSS device-এর ভেতরে live Flutter view থাকবে।
3. **Installation**: `CLI | Manual` tabs।
   - CLI: `npx fcultui add ledger-overview`। CLI project type নিজেই detect করে (`pubspec.yaml` থাকলে Flutter, `package.json` + react-native থাকলে RN), file বসিয়ে দেয় আর dependency install করে (`flutter pub add …` / `npx expo install …`)। shadcn-registry-র মতো।
   - Manual: step-by-step instructions (dependencies, token file, source file) আর প্রতিটা code block-এ Copy ও Expand।
4. **Examples**: variant preview আর code।
5. **Props / Parameters** টেবিল: Flutter constructor params আর RN props পাশাপাশি।
6. **Parity badge**, changelog আর "Related screens" grid।

Toggle-এর আচরণ:
- Preference `cookie` + `localStorage`-এ থাকবে। Server cookie পড়ে সঠিক ভাষার code **প্রথমেই** render করবে, তাই flash হবে না।
- Toggle করলে শুধু code block crossfade হবে (framer `AnimatePresence`)। Preview, layout আর height **একটুও নড়বে না** (দুই ভাষার block-এর height আলাদা হলে `min-height` lock থাকবে)।
- Shortcut: `F` = Flutter, `R` = React Native।

---

## 5. Repo structure (যখন real screens আসবে)

```
fcultui/                      (pnpm + Turborepo monorepo)
├── apps/
│   ├── web/                  ← এখনকার Next.js app এখানে move হবে
│   ├── flutter-host/         ← সব screen-এর Flutter web host (multi-view)
│   └── rn-host/              ← Expo Router web host
├── packages/
│   ├── tokens/               ← tokens.json → Dart + TS
│   ├── cli/                  ← `npx fcultui add`
│   └── capture/              ← Playwright capture + parity diff
└── content/screens/…         ← source of truth
```

---

## 6. Roadmap

| Phase | কাজ | Status |
|---|---|---|
| 0 | Minimal Gallery-র pixel-perfect shell, animation, CSS iOS/Android device, mockup cards, DESIGN.md, CLAUDE.md, এই plan | ✅ সম্পন্ন |
| 1 | Content model + `/screens/[slug]` detail page (demo content দিয়ে)। Shiki code blocks, Flutter/RN toggle, Preview/Code tabs, Installation section | ✅ সম্পন্ন (২৩টা static page, ১২টা design × ২ framework-এর code) |
| 2 | Monorepo + tokens package + প্রথম ৫টা real screen (Flutter + RN) | |
| 3 | Capture pipeline: poster/loop video, CSS device-এ `<video>` দিয়ে hover preview, parity diff CI | |
| 4 | Live preview: flutter-host (multi-view, deferred), rn-host, QR/Snack | |
| 5 | CLI registry, search index, tag/pagination data wiring, bookmarks page, All-Access (pro লক, auth, payment) | |

## 7. যে সিদ্ধান্তগুলো আপনার কাছ থেকে দরকার
1. **Brand name** (এখন `FCult UI` placeholder, `lib/site.ts`-এ এক লাইনে বদলানো যায়)।
2. Free vs Pro: কোন screen-এর code সবার জন্য খোলা থাকবে?
3. React Native target: Expo (সুপারিশ, কারণ Snack/QR আর web host সহজ) নাকি bare RN CLI?
4. Asset hosting: Cloudflare R2 (সস্তা egress, সুপারিশ) নাকি Vercel Blob?
