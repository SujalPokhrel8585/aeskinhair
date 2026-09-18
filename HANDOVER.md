# HANDOVER — AestheticEssence Skin & Hair Clinic Website

> Read this fully before touching anything. This site is live-facing (patients book
> appointments through it) and has one fragile subsystem: the **service worker**
> (`public/sw.js`). Most of the "site broke" scenarios below trace back to it.

## 1. What this site is (and is not)

- **Static React SPA** (Vite + React 19 + Tailwind 4 + TypeScript). No backend, no
  database, no API keys, no server-side anything.
- **All contact/booking flows go to WhatsApp** via `https://wa.me/` deep links built
  in `src/lib/whatsapp.ts`. The form does not send anything anywhere; it opens
  WhatsApp with a pre-filled message. If WhatsApp closes before "Send", nothing is
  delivered — by design, and disclosed to users on the page and in the legal pages.
- Because there is no backend, **there is nothing to "go down" server-side**. If the
  site is up, it works. Downtime = hosting downtime only.

## 2. Client facts (single source of truth is `src/constants/clinic.ts`)

| Item | Value |
|---|---|
| Clinic | AestheticEssence Skin & Hair Clinic |
| Address | City Square Mall (3rd Floor), Samakhushi Road, Kathmandu |
| Phone | +977 976-7648659 |
| WhatsApp | 9779767648659 (`wa.me/9779767648659`) |
| Hours | 11:00 AM – 6:00 PM, Sun–Fri, closed Saturday |
| Domain (planned) | aestheticessence.com.np — **see §7 before going live** |

Almost every visitor-facing detail (name, address, phone, socials, map pin, geo
coordinates, hours) comes from `CLINIC_INFO` in `src/constants/clinic.ts`.
**If the clinic ever changes its phone/WhatsApp number, this one file is 95% of the
fix** — but also grep for the old number, because it is repeated in:
- `public/sitemap.xml` / canonical URLs use the **domain**, not the number (fine)
- `index.html` (meta descriptions mention booking on WhatsApp, no number)
- Anywhere a literal `wa.me/9779767648659` or `9767648659` string appears
  (run: `grep -r "9767648659\|976-7648659" src/ index.html`)

## 3. Commands

```bash
npm install          # ALWAYS use this. Never `npm update` (see §6.3).
npm run dev          # local dev (service worker NOT active in dev — normal)
npm run build        # tsc + vite build → dist/  (run this before every deploy)
npm run preview      # serve dist/ locally to sanity-check a production build
npm run lint         # eslint
```

Deploy = upload the **entire** `dist/` folder to the static host with SPA fallback.
`vercel.json` and `public/_redirects` (Netlify) are already configured.

## 4. Where content lives (edit here, nowhere else)

| Content | File |
|---|---|
| Clinic name/address/phone/socials/map | `src/constants/clinic.ts` |
| SEO titles/descriptions/schema | `src/constants/seo.ts`, `src/components/seo/Seo.tsx`, `index.html` |
| Services (titles, prices, images, copy) | `src/features/services/data/servicesData.ts` |
| Doctors | `src/features/doctors/data/` |
| Gallery | `src/features/gallery/data/` |
| Testimonials/reviews (hardcoded, not live Google reviews) | `src/features/home/data/` |
| Legal pages | `src/features/legal/*.tsx` |
| Sitemap (update if pages are added/removed!) | `public/sitemap.xml` |
| Robots | `public/robots.txt` |
| Open/closed badge hours | `src/lib/clinicStatus.ts` (`CLINIC_OPEN_HOUR` / `CLINIC_CLOSE_HOUR`) **AND** the `businessHours` display string in `clinic.ts` — update BOTH or the badge and the text will disagree |

## 5. ⚠ The service worker — read this twice

`public/sw.js` is registered only in production (`src/main.tsx`). It makes repeat
visits instant and enables the offline page, but it **caches aggressively**:

- Cache-first (forever) for hashed `/assets/*`, images, Google Fonts, the 3D `.glb` model.
- Network-first for page navigations, falling back to cache → app shell → `offline.html`.

Rules that keep it safe:

1. **The page HTML is what ships updates.** New deploys produce new hashed asset
   names + fresh HTML, so users get the new version on their next full page load.
   Normal deploys need **no SW changes**.
2. **If you edit `sw.js` itself, you MUST bump `CACHE_VERSION`** (currently
   `"ae-v2"` — go to `ae-v3`, then `ae-v4`, …). Otherwise returning visitors stay
   pinned to the old cached worker and
   the site looks "stuck on an old version" even though the deploy succeeded.
3. **Never deploy a partial `dist/`.** A stale HTML referencing purged hashed assets
   = blank pages. Always deploy the whole freshly-built folder atomically.
4. Historical gotcha (already solved, don't regress it): serving HTML for non-page
   requests once "poisoned" the 3D model loader. The worker now returns a plain 503
   (never HTML) for offline non-page requests. Keep it that way.
5. In dev, the SW is intentionally not registered. Don't "fix" that.

**If the site "shows old content" after a deploy:** it is almost always the SW cache.
Fix: bump `CACHE_VERSION`, redeploy. For a single stuck user, DevTools → Application →
Service Workers → Unregister + "Clear storage", then reload.


## 5.5 Security headers (CSP) — read before touching external sources or inline code

Response headers (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS
and a Content-Security-Policy) are configured in three places that MUST stay in sync:

- `vercel.json` (Vercel; `/sw.js` has its own, more permissive CSP rule there)
- `public/_headers` (Netlify / Cloudflare Pages; same `/*` + `/sw.js` layout)
- the `preview-security-headers` plugin in `vite.config.ts` (so `npm run preview`
  serves the exact production headers — HSTS is omitted locally on purpose)

Facts that matter when editing:

1. **Every external source is allow-listed.** fonts.googleapis.com (styles),
   fonts.gstatic.com (fonts), images.unsplash.com + cdn.21st.dev (images),
   (hero HDR is self-hosted at `public/hdri/` — no external HDR host anymore),
   www.google.com (map iframe). Adding any new external image/script/font/iframe
   source requires updating the CSP in ALL THREE files or it breaks in production
   only — local dev (no headers) will look fine.
2. **script-src is `'self' 'unsafe-inline' 'wasm-unsafe-eval'` — deliberate.**
   `Seo.tsx` injects JSON-LD via the DOM, and Chrome blocks-AND-STRIPS those data
   blocks under a hash/nonce-based script-src (verified — it silently kills all
   SEO structured data; static hosts cannot do per-request nonces).
   'wasm-unsafe-eval' is required by the GLB decoder (draco/meshoptimizer).
   There are no injection sinks in this codebase (query params are allow-listed),
   and frame-ancestors 'none', object-src 'none', base-uri 'self' and connect-src
   restrictions still apply.
3. **`/sw.js` carries its own CSP.** The worker fetches fonts, Unsplash images,
   the 21st.dev SVGs and the HDR itself; without those connect-src origins every
   SW revalidation 503s and offline/first-visit asset caching breaks.
4. **After any header or external-source change, run**
   `node scripts/security-headers-smoke.mjs` — it drives a real browser (local
   Chrome/Edge) through every route WITH the production CSP and fails on any CSP
   violation, missing JSON-LD, font failure or 503. It must print `RESULT: PASS`.

Known external issues the smoke test reports as INFO (pre-existing, NOT CSP):
- (resolved) The drei default preset used to fetch its HDR from raw.githack.com,
  which intermittently 403/503'd — and because the hero had no error boundary,
  that failure unmounted the whole page ("homepage loads then disappears").
  The HDR is now self-hosted (public/hdri/), SW-cached, and the hero is wrapped
  in an error boundary that falls back to the static model.
- Two Unsplash photo IDs 404 (§6.1) — replace with local images when noticed.

## 6. Things that can break WITHOUT anyone touching the code

Honest list, ranked by likelihood:

1. **Unsplash hotlinked images (~30 of them).** Service and facility card images in
   `servicesData.ts` / `facilitiesTechData.ts` load directly from
   `images.unsplash.com`. If Unsplash removes/blocks those photo IDs, those images
   404 (broken cards — not a crash). **Best permanent fix:** download the images,
   run `npm run compress:images`, serve from `public/` like the other photos.
2. **The WhatsApp number going dead.** Everything funnels to one number. If the
   clinic changes SIMs and doesn't say so, bookings silently go nowhere. Confirm
   the number with the client at handover.
3. **Google Fonts.** `index.html` loads Playfair Display + Valley Sans from
   fonts.googleapis.com (both verified live at handover). If unreachable, the site
   falls back to system fonts (cosmetic only; the SW caches fonts after first
   visit). Low risk; nothing to do.
4. **Google Maps embed.** Keyless `output=embed` URL — no API key exists, so it can
   never expire or start billing. Low risk; nothing to do.
5. **Hosting account itself.** Domain not renewed, hosting project deleted, card
   expired — the only thing that can take the site fully down. Calendar the renewals.
6. **Three.js hero.** The 3D stethoscope (~1 MB chunk, `HeroCanvas`) is the heaviest,
   most browser-sensitive part. It degrades gracefully on weak devices
   (`src/lib/deviceCapability.ts`; force-test with `?perf=low|medium|high`). If it
   fails, the page still loads as a static hero. See the Navbar `InertZone` warning
   in README.md before touching layout.

That is the complete list. **If nobody touches the code and hosting + the WhatsApp
number stay alive, there is no realistic failure mode left.** No API keys exist to
expire; no backend exists to crash; no runtime dependencies — all JS is bundled at
build time and served as static files.

## 7. ⚠ BEFORE GO-LIVE: domain consistency

`src/constants/clinic.ts` has:

```ts
siteUrl: "https://aestheticessence.com.np", // TODO: replace with the final domain
```

while `public/robots.txt` and `public/sitemap.xml` use
`https://www.aestheticessence.com.np` (with www). Canonical tags, JSON-LD schema and
the sitemap must all agree on ONE final domain. When the domain is confirmed:

- [ ] Set `siteUrl` in `clinic.ts` (feeds canonical URLs + JSON-LD in `src/constants/seo.ts`)
- [ ] Fix every `<loc>` in `public/sitemap.xml` to the same origin
- [ ] Fix the `Sitemap:` line in `public/robots.txt`
- [ ] Add an apex ↔ www redirect on the hosting platform

If the site lives on a temporary `.vercel.app` URL, visitors are fine but SEO
canonicals point at the wrong domain — fix before launch.

## 8. Routine update procedure (the only workflow you need)

```
1. edit src/... content files
2. npm run build      # must pass — this also type-checks everything
3. npm run preview    # click through the changed pages once
4. deploy the ENTIRE dist/ folder
5. commit + push
```

There are **no automated tests** (deliberate, for a static brochure site — the
build's TypeScript check + a manual click-through is the safety net). Don't add
heavy test infrastructure; if you ever touch `sw.js` or `clinicStatus.ts`, verify
manually in `npm run preview`.

## 9. Known-good environment & repo facts

- **Never delete or skip `package-lock.json`.** It freezes the exact dependency
  versions this build was verified with. `npm install` respects it; `npm update`
  ignores it and can pull breaking majors — don't use `npm update`.
- Node: the current LTS at handover. Vite 8 + TS 6 + React 19 are on the latest
  majors; a fresh `npm install` with the lockfile reproduces the exact build.
- Repo: `https://github.com/SujalPokhrel8585/aeskinhair.git`
  - `main` — source of truth
  - `privacy-deploy` — kept in sync with `main` at handover; push the same commit
    to both unless told otherwise.
- `Details.txt` in the repo root is scratch notes from a *different* client project
  (Skin & Hair Hub Nepal) — ignore it; it does not describe this site.
- Scripts you may never need: `compress:images`, `generate:favicon`,
  `capture:stethoscope` (3D model → poster image; needs local Chrome/Edge).

## 10. Quick emergency playbook

| Symptom | Fix |
|---|---|
| Site shows old content after deploy | Bump `CACHE_VERSION` in `sw.js`, redeploy |
| Blank white page on one device | DevTools → Application → Service Workers → Unregister + Clear storage; if reproducible for everyone, check console for a failed hashed asset (partial deploy — redeploy full `dist/`) |
| 3D hero missing / blank hero (page itself stays) | Test `?perf=high`; check `/stethoscope_animation.glb` AND `/hdri/potsdamer_platz_1k.hdr` return 200; if SW-related, bump `CACHE_VERSION`. If the WHOLE page blanks: that was the old bug (unbounded 3D error) — fixed by `HeroErrorBoundary` + self-hosted HDR; verify both are in place |
| WhatsApp opens the wrong number | Update `clinic.ts`, `grep -r "old number" src/ index.html`, rebuild, redeploy |
| Open/closed badge wrong | `clinicStatus.ts` hours + `clinic.ts` `businessHours` string must match; badge is Nepal time (Asia/Kathmandu), correct worldwide |
| Map/sitemap point at wrong domain | §7 |
| A service image is broken | Unsplash hotlink died — download a replacement into `public/`, update the `image` field in `servicesData.ts` |
| Site completely down | Hosting/domain problem, not code — check the hosting dashboard and domain renewal |