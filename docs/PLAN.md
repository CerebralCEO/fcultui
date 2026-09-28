# F-Cult UI — Product & Architecture Plan

> লক্ষ্য: হাজার হাজার ready-to-implement mobile screen। প্রতিটার **Flutter ও React Native (Expo)** code থাকবে।
> একটা toggle দিয়ে দুটোর মধ্যে switch করা যাবে, আর UI, layout ও animation হুবহু একই থাকবে।
> **কোনো screenshot বা video থাকবে না।** সব preview আসল code চালিয়ে দেখানো হবে।
> নতুন screen যোগ আর update হবে **Admin panel** থেকে, code deploy ছাড়াই।

---

## 0. চূড়ান্ত সিদ্ধান্ত

| বিষয় | সিদ্ধান্ত |
|---|---|
| Hosting | **Vercel** (serverless functions + ISR)। Cloudflare ব্যবহার হবে না |
| Database | **Neon Postgres + Drizzle ORM**। GitHub-কে database হিসেবে ব্যবহার হবে না |
| Auth | **Clerk**। Sign-in/Sign-up modal-এর design **আমাদের নিজস্ব** (DESIGN.md অনুযায়ী) |
| Brand | **F-Cult UI** |
| Code access | **React Native code সবার জন্য free।** **Flutter code শুধু signed-in member-দের জন্য** (free account, login modal) |
| Sign-in পদ্ধতি | **Email OTP + Google** (GitHub নয়) |
| Admin | শুধু একজন: owner (Clerk `publicMetadata.role = "admin"`) |
| React Native | **Expo** (+ Reanimated, react-native-web) |
| Flutter preview | **Multi-view embedding (primary) + iframe (fallback)**, details page-এ |
| Grid / Explore preview | **React Native-এর live web render** (react-native-web, DOM) |
| Code highlight | **Shiki**, admin-এ save করার সময় (HTML আকারে DB-তে থাকবে) |
| খরচ | Build আর launch পর্যন্ত **$0** (নিচে §11-এর সতর্কতা দেখুন) |

---

## 1. মূল সমস্যা

| চাই | কঠিন কেন |
|---|---|
| Grid আর Explore-এ শত শত **live** screen | শত শত Flutter canvas একসাথে চালালে browser আটকে যাবে |
| Flutter screen Next.js-এর ভেতরে দেখানো | Next.js সরাসরি Dart চালাতে পারে না। Flutter web নিজের engine (~২–৪MB) নিয়ে আসে |
| Admin থেকে upload করলেই live | Dart browser বা Vercel function-এ compile করা যায় না। একটা build worker লাগবে |
| দুই framework-এ "UI literally unchanged" | দুটো আলাদা codebase, তাই মেশিন দিয়ে যাচাই না করলে পার্থক্য তৈরি হবেই |

---

## 2. Rendering কৌশল: যেখানে যতটুকু দরকার, ঠিক ততটুকু runtime

```
┌──────────────────────── Grid / Explore wall (শত শত tile) ────────────────────────┐
│  React Native code → react-native-web → আসল DOM render                            │
│  হালকা, অনেকগুলো একসাথে চলে। hover বা দৃশ্যমান হলে animation চলে।                │
│  iOS/Android frame আমাদের CSS <Device> আঁকে (আগেই বানানো আছে)।                     │
└──────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────── Details page (একটা screen + তার flow) ───────────────────┐
│  Default: React Native live render (সাথে সাথে দেখায়)                             │
│  Flutter বাছলে → একটাই Flutter engine, multi-view দিয়ে প্রতিটা preview-এ একটা view │
│  Multi-view ব্যর্থ হলে → একই host-এর route iframe-এ (fallback)                   │
└──────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────── Code (দুই framework) ───────────────────────────────────┐
│  Admin-এ save করার সময় Shiki highlight → DB-তে HTML। Public page-এ highlight-এর │
│  কোনো খরচ নেই। Toggle শুধু code বদলায়, preview আর layout একটুও নড়ে না।         │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 React Native: সব জায়গায় live web render
- প্রতিটা screen-এর TSX **Babel (Reanimated/worklets plugin) → esbuild** দিয়ে একটা ESM bundle হয় (admin-এ save করার সময়, Vercel function-এ)।
- Bundle থাকে **Vercel Blob**-এ। Site `import()` দিয়ে load করে, আর shared dependency (react, react-native-web, reanimated, expo-linear-gradient, vector-icons, svg) আমাদের নিজস্ব import map থেকে একবারই নামে।
- Grid আর Explore-এ tile দৃশ্যমান হলে mount হয়, দূরে গেলে unmount হয় (virtualization)। Animation চলে শুধু hover-এ বা (touch device-এ) screen-এর মাঝখানে এলে। এখনকার `usePlayback` আর `data-playing` contract একই থাকবে।
- `components/device/ScreenView.tsx`-এর "preview building" অবস্থা এই render দিয়ে বদলে যাবে।

### 2.2 Flutter: Multi-view embedding (primary)
আপনার দেওয়া দুই option-এর তুলনা:

| | Iframe per route | Multi-view embedding |
|---|---|---|
| Setup | সবচেয়ে সহজ | একটু বেশি কাজ |
| Isolation (CSS, font, crash) | পুরো আলাদা ✅ | একই page-এ |
| একই page-এ ৪টা preview | ৪টা আলাদা engine boot হয় ❌ | **একটাই engine, ৪টা view** ✅ |
| Screen বদলানো | প্রতিবার নতুন করে boot | Engine চালুই থাকে, নতুন view প্রায় সাথে সাথে ✅ |
| Theme/platform sync | `postMessage` | সরাসরি `initialData` |

**পরিকল্পনা:**
1. **Flutter host** একটা আলাদা static Vercel project। এতে সব screen compile করা থাকে, প্রতিটা `deferred as` import হিসেবে, তাই যে screen দরকার শুধু তার code নামে।
2. Main site-এ **Vercel rewrite** `/flutter/:path*` → flutter-host deployment। সব same-origin থাকে, CORS-এর ঝামেলা নেই, browser cache ঠিকমতো কাজ করে।
3. `flutter.js` loader চলে `multiViewEnabled: true` দিয়ে, তারপর `app.addView({ hostElement, initialData: { screen, platform, accent } })`।
   `platform` দিলে Flutter-এর `TargetPlatform` override হয়, তাই scroll physics আর ripple-ও iOS/Android অনুযায়ী ঠিক থাকে।
4. **Engine একবারই load হয়, details page-এর layout-এ** (`app/screens/(detail)/layout.tsx` screen বদলালে remount হয় না)। এক screen থেকে আরেকটায় গেলে শুধু `removeView` → `addView` হয়।
5. **Lazy load:** preview panel দৃশ্যমান হলে আর user Flutter বাছলে তবেই engine নামে (idle-এ prefetch করা হয়)। তার আগ পর্যন্ত React Native render দেখায়।
6. **Fallback:** multi-view ব্যর্থ হলে `/flutter/?screen=<slug>&platform=ios` iframe-এ খোলে।
7. Renderer: WasmGC সমর্থিত browser-এ skwasm, বাকিগুলোতে CanvasKit। Site-এ COOP/COEP header লাগানো হবে না (এতে Clerk-এর মতো third-party ভাঙতে পারে), তাই skwasm single-threaded চলবে।

**Admin-এর জন্য বাড়তি option:** Flutter code লেখার সময় CI build-এর অপেক্ষা না করে **DartPad embed**-এ তাৎক্ষণিক আসল preview দেখা যাবে। DartPad শুধু single-file নেয়, তাই tokens file আর screen-এর code জোড়া দিয়ে একটা file পাঠানো হবে। Public site-এ এটা ব্যবহার হবে না।

### 2.3 "UI literally unchanged": মেশিন দিয়ে যাচাই (parity)
- **Shared tokens:** DB-তে একটা `tokens.json`। এখান থেকে `tokens.dart` আর `tokens.ts` generate হয় (এখনকার `content/code/_shared/` এর format অনুযায়ী)।
- **Parity test:** Flutter build-এর পর CI-তে Playwright দিয়ে দুই render (react-native-web DOM আর Flutter canvas) 390 × 844-এ capture করে pixel-diff (pixelmatch/SSIM) করা হবে। এই ছবিগুলো শুধু test-এর জন্য, **site-এ কখনো দেখানো হবে না**। Score DB-তে থাকবে, আর admin panel-এ ও details page-এ "Parity 99.2%" badge হিসেবে দেখাবে।

---

## 3. Architecture

```
Admin (/admin, Clerk + role=admin)
  │  Monaco editor: Dart + TSX + meta
  │  ├─ React Native preview: browser-এ esbuild-wasm দিয়ে তাৎক্ষণিক
  │  └─ Flutter preview: DartPad embed (draft) / CI build শেষে আসল host
  ▼
Server Actions (Vercel Functions)
  ├─ Zod দিয়ে validate
  ├─ Neon-এ save (Drizzle): source, meta, Shiki highlight করা HTML
  ├─ React Native: Babel → esbuild → ESM bundle → Vercel Blob → screen_sources.rn_bundle_url
  └─ Flutter: GitHub API → repository_dispatch → builder repo-র workflow
                    │
                    ▼
     Public "builder" repo (শুধু host template আর workflow থাকে, code থাকে Neon-এ)
       1. Neon থেকে সব published Flutter source + tokens নেয় (read-only DB role)
       2. registry codegen → flutter analyze → flutter build web --wasm --release
       3. Parity test (Playwright)
       4. vercel deploy --prebuilt → flutter-host project
       5. POST /api/builds/callback (HMAC সই করা) → build status + parity score
                    │
                    ▼
Main site: revalidateTag("screen:<slug>") / revalidateTag("screens")
  → React Native update ~১০ সেকেন্ডে live, Flutter update ~৪–৬ মিনিটে live
```

**Builder repo public কেন:** GitHub Actions public repo-তে **unlimited free minutes** দেয়। Repo-তে কোনো screen code থাকে না, build-এর সময় DB থেকে আনা হয়। শর্ত: workflow log-এ কোনো source code print করা যাবে না। DB credential থাকবে শুধু GitHub Secrets-এ, আর সেটা read-only role।

---

## 4. Tech stack

| কাজ | Tool |
|---|---|
| Site আর API | Next.js 16 (App Router) on **Vercel**: serverless functions, ISR, `cacheTag` / `revalidateTag` |
| Database | **Neon Postgres** (serverless driver `@neondatabase/serverless`) + **Drizzle ORM** + drizzle-kit (migration) |
| Auth | **Clerk** (`@clerk/nextjs`): নিজস্ব modal UI, `useSignIn` / `useSignUp` hook দিয়ে; Next 16-এর `proxy.ts`-এ `clerkMiddleware` |
| File storage | **Vercel Blob**: React Native bundle, font, vendor ESM |
| React Native preview | react-native-web, Reanimated (web), expo-linear-gradient, @expo/vector-icons, react-native-svg |
| React Native compile | @babel/core (+ Reanimated/worklets plugin) → esbuild (server); esbuild-wasm (admin browser) |
| Flutter preview | Flutter Web (Wasm) multi-view host, আলাদা Vercel project + rewrite; iframe fallback |
| Flutter build | GitHub Actions (public builder repo) + Vercel CLI |
| Admin editor | Monaco Editor |
| Highlight | Shiki (dual theme, save-time) |
| Validation | Zod |
| Animation (UI) | এখনকার Framer Motion + GSAP + Lenis |
| পরে | Payment: Lemon Squeezy / Paddle (Clerk user-এর সাথে যুক্ত); CLI: npm-এ `fcultui`; Search: Orama; Email: MailerLite / Buttondown |

---

## 5. Database schema (Drizzle, প্রথম খসড়া)

```ts
// db/schema.ts (আনুমানিক রূপ)
apps            id, slug (unique), name, category, accent, tagline, position, created_at, updated_at
screens         id, app_id → apps, slug (unique), title, label ("Sign in"), tagline, tone ("light"|"dark"),
                badge ("new"|"updated"|null), is_pro, status ("draft"|"building"|"live"|"failed"),
                position (flow-এর ক্রম), parity_score, published_at, created_at, updated_at
screen_sources  id, screen_id → screens, framework ("flutter"|"rn"), files jsonb [{ path, content }],
                highlighted jsonb [{ path, html }], rn_bundle_url, version, updated_at
                unique (screen_id, framework)
screen_props    id, screen_id, name, flutter_type, rn_type, default_value, description, position
tags            id, slug, name
screen_tags     screen_id, tag_id
builds          id, target ("flutter"|"rn"), status ("queued"|"running"|"success"|"failed"),
                triggered_by, run_url, error, started_at, finished_at
design_tokens   id, version, json jsonb, created_at  (সবচেয়ে নতুনটা active)
-- পরে
users           clerk_id (pk), email, created_at   (Clerk webhook দিয়ে sync)
bookmarks       user_id, screen_id, created_at
purchases       user_id, provider, order_id, plan, created_at
```

- Grid-এর জন্য হালকা query (slug, title, tagline, category, accent, badge, is_pro, rn_bundle_url) আর details page-এর জন্য পূর্ণ query (sources, props, flow)। দুটো আলাদা cache tag-এ থাকবে।
- Demo data আর `content/code/*` আর নেই (2026-09-28 মুছে ফেলা হয়েছে)। DB খালি দিয়ে শুরু, আসল screen admin panel থেকে upload হবে। `tokens`, `builds` আর `design_tokens` table পরের ধাপে যোগ হবে।

---

## 6. Auth (Clerk, নিজস্ব design)

- **Modal:** আমাদের নিজস্ব component (`components/auth/AuthModal.tsx`), Framer Motion spring, DESIGN.md token। Clerk-এর UI component ব্যবহার হবে না, শুধু hook (`useSignIn`, `useSignUp`, OAuth redirect)।
- **Sign-in পদ্ধতি:** Email OTP আর Google। একটা email flow-তেই নতুন user-এর sign-up আর পুরনো user-এর sign-in দুটোই হয়।
- **Admin:** Clerk dashboard-এ নিজের user-এ `publicMetadata.role = "admin"` দিতে হবে।
  - `proxy.ts`: `/admin(.*)` আর `/api/admin(.*)`-এ `clerkMiddleware` দিয়ে admin ছাড়া বাকিদের redirect।
  - প্রতিটা Server Action-এর শুরুতে আবার role যাচাই হবে (defence in depth)।
- **Code access নিয়ম (✅ তৈরি):**
  - React Native code page-এর HTML-এ থাকে, সবাই দেখতে ও copy করতে পারে।
  - Flutter code **কখনো static HTML-এ যায় না।** Page-এ শুধু same-height locked stub (`LockedFile`: filename + line সংখ্যা, কোনো code নয়) থাকে।
  - Login করলে `FlutterCodeProvider` `/api/code/[slug]`-কে ডাকে। সেই route Clerk-এর `auth()` দিয়ে যাচাই করে আসল Flutter file পাঠায় (`Cache-Control: private, no-store`)।
  - Signed-out অবস্থায় Flutter-এর Copy/Unlock চাপলে login modal খোলে (`openAuth("flutter")`)।
- **Clerk ছাড়াও site চলে:** key না থাকলে (`lib/auth-config.ts`) `proxy.ts` no-op থাকে, সবাই signed-out, আর modal জানায় যে sign-in এখনো configure হয়নি।
- **Clerk Dashboard setup:**
  - Email address + Email verification code চালু করতে হবে। Password আর name field বন্ধ রাখতে হবে, যাতে sign-up শুধু email-এ শেষ হয়।
  - Google social connection চালু করতে হবে।
  - Custom flow-এর জন্য Clerk-এর bot protection (`#clerk-captcha`) modal-এ রাখা আছে।

---

## 7. Admin panel (`/admin`)

| Page | কাজ |
|---|---|
| **Dashboard** | মোট screen, draft / live / failed সংখ্যা, শেষ build-এর অবস্থা |
| **Apps** | App তৈরি/সম্পাদনা (নাম, category, accent), flow-এ screen-এর ক্রম (drag to reorder) |
| **Screens → Edit** | Meta form (title, tagline, tone, tags, badge, Pro) · Dart আর TSX পাশাপাশি Monaco-তে · একাধিক file (tab) · zip বা drag-drop upload · Props table editor |
| **Live preview (editor-এর পাশে)** | React Native: টাইপ করার সাথে সাথে esbuild-wasm দিয়ে compile হয়ে phone frame-এ · Flutter: DartPad embed (draft) অথবা শেষ build |
| **Publish** | Save draft · Publish (React Native bundle + Flutter build চালু) · Unpublish · Version history থেকে rollback |
| **Builds** | চলমান আর আগের build, GitHub Actions run-এর link, error, parity score |
| **Tokens** | `tokens.json` সম্পাদনা (পরিবর্তনে সব screen-এর rebuild) |

Admin-এর UI-ও এখনকার DESIGN.md token দিয়ে বানানো হবে (dark, greyscale, pill control)।

---

## 8. Screen লেখার নিয়ম (contract)

1. প্রতিটা screen দুটো আসল playground project-এ আগে লেখা আর device-এ যাচাই করা হবে:
   - `playgrounds/expo`: Expo Go-তে QR scan করে phone-এ চালানো।
   - `playgrounds/flutter`: simulator বা device-এ চালানো।
2. Public API দুই দিকে একই: `<Name>Screen({ accent, ...props })` (Flutter-এ constructor param)। এখনকার `content/code/*` এই pattern-এই লেখা।
3. Token বাধ্যতামূলক: color, spacing, radius, motion সব `tokens.dart` / `tokens.ts` থেকে।
4. Animation-এর সময় আর easing দুই দিকে একই (যেমন `FcMotion.easeOutExpo` ⇄ `motion.easeOutExpo`)।
5. **Web-compatible package-ই শুধু চলবে:** Reanimated, gesture-handler, svg, linear-gradient, vector-icons, safe-area-context। Camera বা map-এর মতো শুধু-native module হলে preview-এর জন্য web mock লাগবে।
6. Network call চলবে না। সব mock data screen-এর ভেতরে, যাতে preview প্রতিবার একই রকম হয়।
7. Status bar আর safe area screen আঁকবে না। সেটা preview-এর device frame দেবে।

---

## 9. Code showcase

- rehype-pretty-code নিজেও ভেতরে Shiki ব্যবহার করে, আর আমাদের এখানে Shiki আগে থেকেই আছে। তাই MDX লাগবে না।
- **Save করার সময়** Shiki দুই theme-এ (dark/light CSS var) highlight করে HTML DB-তে রাখে।
- Details page-এর এখনকার সব আচরণ একই থাকবে:
  - দুই framework-এর code একই grid cell-এ stack করা, `html[data-fw]` দিয়ে দেখানো বা লুকানো। লুকানো pane-এর height ০, তাই block ঠিক দৃশ্যমান code-এর শেষ লাইন পর্যন্ত থাকে। Load-এর সময় flash হয় না।
  - Copy, Expand/Collapse, Installation (CLI | Manual), Props table, flow-এর বাকি screen।

---

## 10. Repo structure

```
fcultui/                         (pnpm workspace)
├── app/                         ← Next.js (site + /admin + /api)
├── components/                  ← এখনকার UI (+ auth/, admin/, preview/)
├── db/
│   ├── schema.ts                ← Drizzle schema
│   ├── index.ts                 ← Neon client
│   └── seed.ts                  ← এখনকার demo data + content/code → DB
├── drizzle/                     ← migration file (drizzle-kit)
├── lib/
│   ├── rn-compile.ts            ← Babel + esbuild (server)
│   ├── highlight.ts             ← Shiki
│   └── flutter-build.ts         ← repository_dispatch trigger + callback verify
├── proxy.ts                     ← Clerk (Next 16-এ middleware-এর নতুন নাম)
├── playgrounds/
│   ├── expo/                    ← screen লেখা আর device-এ যাচাই
│   └── flutter/
└── public/vendor/               ← react-native-web ইত্যাদির ESM (import map)

fcultui-flutter-builder/         (আলাদা, PUBLIC repo)
├── host/                        ← Flutter multi-view host template
├── tool/gen_registry.dart       ← DB থেকে আনা source দিয়ে registry তৈরি
└── .github/workflows/build.yml
```

### Environment variables
| নাম | কোথায় |
|---|---|
| `DATABASE_URL` | Vercel + local (`.env.local`) |
| `DATABASE_URL_READONLY` | শুধু builder repo-র GitHub Secret |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Vercel + local |
| `BLOB_READ_WRITE_TOKEN` | Vercel + local |
| `GITHUB_DISPATCH_TOKEN` | Vercel (fine-grained, শুধু builder repo-তে dispatch) |
| `BUILD_CALLBACK_SECRET` | Vercel + builder repo (HMAC) |
| `VERCEL_TOKEN`, `FLUTTER_HOST_PROJECT_ID` | শুধু builder repo |

Secret কখনো chat বা repo-তে যাবে না।

---

## 11. সতর্কতা আর ঝুঁকি

1. **Vercel Hobby plan commercial ব্যবহারে নিষিদ্ধ।** Build আর launch-এর আগ পর্যন্ত $0-তে চলবে। All-Access বিক্রি শুরু করলে Vercel-এর নিয়ম অনুযায়ী Pro plan লাগবে (মাসে $20)। Neon, Clerk আর Blob-এর free tier শুরুর পর্যায়ের জন্য যথেষ্ট, তবে usage বাড়লে limit দেখতে হবে।
2. **React Native-কে server-এ compile করা সবচেয়ে ঝুঁকির অংশ।** Reanimated-এর Babel plugin আর import map দিয়ে `react-native` → `react-native-web` resolve, এগুলো **ধাপ D-এর শুরুতে একটা spike** দিয়ে প্রমাণ করতে হবে।
   বিকল্প: React Native-ও CI-তে Expo web export দিয়ে build করা। তবে তখন grid-এ iframe লাগবে, যা ভারী।
3. **Flutter update সাথে সাথে আসবে না।** Dart compile-এর জন্য CI লাগে, তাই প্রতিটা Flutter update ~৪–৬ মিনিট পরে live হয়। Admin-এ DartPad দিয়ে draft আগে দেখা যাবে।
4. **Builder repo public।** Code DB-তে থাকে, কিন্তু build-এর সময় runner-এ নামে। Log-এ print করা যাবে না, আর deploy করা host-এ compiled JS/Wasm যাবেই (web-এ চালাতে হলে এটা এড়ানো যায় না)।
5. **Flutter code-এর সুরক্ষা।**
   - Source HTML আর copy শুধু signed-in হলে server থেকে পাঠানো হয় (✅ তৈরি)।
   - তবে Flutter-এর compiled preview (Wasm/JS) সবার browser-এ যায়। Minified হলেও একেবারে ১০০% লুকানো যায় না।
   - Code DB-তে গেলে (ধাপ A/C) `/api/code` DB থেকে পড়বে, সুরক্ষার নিয়ম একই থাকবে।
6. **Grid-এর performance।** React Native live render হালকা হলেও শত শত tile একসাথে ভারী। Virtualization (দৃশ্যমান tile ছাড়া unmount) বাধ্যতামূলক।

---

## 12. Roadmap

| ধাপ | কাজ | Status |
|---|---|---|
| 0 | Minimal Gallery-র pixel-perfect shell, animation, CSS iOS/Android device, Mobbin-style card + carousel, DESIGN.md, CLAUDE.md | ✅ সম্পন্ন |
| 1 | `/screens/[slug]` details page (Aceternity layout), Shiki code, Flutter/RN toggle, Installation, Props; premium sidebar + mobile sheet; Explore infinite wall | ✅ সম্পন্ন (demo content দিয়ে) |
| **A** | Drizzle + Neon: schema, migration, সব data DB থেকে (`lib/content.ts`), `content` tag দিয়ে cache | ✅ সম্পন্ন (2026-09-28)। Demo/mock content মুছে ফেলা হয়েছে, seed হবে না। আসল screen admin থেকে উঠবে |
| **B** | Clerk: নিজস্ব design-এর auth modal (Email OTP + Google), `proxy.ts`, header/mobile account menu, Flutter code lock + `/api/code`, owner-only admin (`ADMIN_USER_IDS`) | ✅ সম্পন্ন (owner sign-in পরীক্ষিত, 2026-09-28) |
| **C** | Admin panel: dashboard, apps, screen editor (meta + Monaco Dart/TSX + upload + props), save/publish, Shiki save-time highlight, version history | 🟡 প্রায় সম্পন্ন (2026-09-28): dashboard, Apps table (search/filter/sort/delete), app CRUD (logo upload + searchable logo library, accent logo থেকে), guided upload flow (launch checklist + ৫-ধাপের screen stepper), drag-reorder flow, screen editor (details, Monaco + file drop, props, tags), publish/unpublish, save-time highlight। বাকি: একাধিক file, zip upload, version history, tokens editor |
| **D** | React Native pipeline: **spike** → server compile → Blob → import map → grid, Explore আর details page-এ আসল React Native render (HTML placeholder বাদ) + virtualization; admin-এ esbuild-wasm live preview | |
| **E** | Flutter: builder repo, workflow, multi-view host, Vercel rewrite, details page-এ live embed + iframe fallback, build callback; admin-এ DartPad draft preview | |
| **F** | প্রথম ৩টা আসল screen দুই framework-এ লিখে playground-এ যাচাই, admin থেকে publish করে পুরো flow end-to-end পরীক্ষা; parity test চালু | |
| G | `npx fcultui add` CLI, Orama search, tag filter আর pagination wiring, bookmarks, All-Access (payment) | |

---

## 13. সিদ্ধান্ত

✅ নেওয়া হয়েছে:
- Brand: **F-Cult UI**
- React Native code free, Flutter code login করে (free account)
- Sign-in: Email OTP + Google

⏳ শুরুর জন্য দরকার (`.env.local`-এ, chat-এ নয়):
- Neon `DATABASE_URL` (ধাপ A)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (ধাপ B-এর end-to-end পরীক্ষা)
