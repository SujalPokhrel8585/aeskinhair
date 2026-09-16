# AestheticEssence Skin & Hair Clinic

Marketing website for **AestheticEssence Skin & Hair Clinic** - a dermatology and aesthetic care clinic in Samakhushi, Kathmandu. Built with React, TypeScript, and Vite.

## Features

- **Home** - 3D hero (React Three Fiber) that adapts to the device performance tier, live open/closed badge (Nepal time), services overview, doctor flipbook, testimonials, before/after slider, signature package
- **Services** - filterable catalog (search + treatment groups) and detail pages (`/services/:id`)
- **Gallery** - tabbed image gallery with lightbox
- **Doctors** - category-filtered doctor roster
- **About** - clinic story, stats, facilities, team preview
- **Contact** - validated form that opens WhatsApp with a pre-filled message
- **Book** - appointment request form via WhatsApp; supports `?service=` and `?doctor=` prefill
- **Legal** - Privacy Policy and Terms pages
- **404** - friendly not-found page for unknown routes
- **Dark / light theme**, mobile action bar (Call / WhatsApp / Book), back-to-top button, offline support via a service worker

## Tech Stack

| Layer | Tools |
|-------|-------|
| Framework | React 19, TypeScript |
| Build | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 |
| Animation | Motion (Framer Motion) |
| 3D | Three.js, React Three Fiber, Drei |
| UI primitives | Base UI, Radix Slot, Lucide icons |
| Offline | Custom service worker (vanilla JS) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & run

```bash
npm install
npm run dev
```

Open http://localhost:5173

### All scripts

```bash
npm run dev                  # Dev server (http://localhost:5173)
npm run build                # Type-check (tsc -b) + production build -> dist/
npm run preview              # Serve the production build locally (port 4173)
npm run lint                 # ESLint
npm run compress:images      # Regenerate compressed WebP assets (sharp)
npm run capture:stethoscope  # Re-capture the static stethoscope fallback image
node scripts/verify-mobile-nav.cjs   # Mobile menu regression check
node scripts/verify-timeline.cjs     # Home timeline reveal check (server on :5199)
```

`verify-mobile-nav.cjs` targets `http://localhost:5199` by default; point it anywhere with `TEST_URL`:

```bash
$env:TEST_URL = "http://localhost:4180/"; node scripts/verify-mobile-nav.cjs
```

## Routes

| Path | Page |
|------|------|
| `/`, `/home` | Home |
| `/services` | Services index (supports `?group=facial\|hair\|skin\|anti-aging`) |
| `/services/:id` | Service detail |
| `/gallery` | Gallery |
| `/doctors` | Doctors |
| `/about` | About |
| `/contact` | Contact |
| `/book` | Book appointment |
| `/privacy-policy` | Privacy Policy |
| `/terms` | Terms of Service |
| `*` | 404 Not Found |

## Project Structure

```
src/
|-- assets/                  # Optimized images (stethoscope fallbacks, torn paper, before/after)
|-- components/
|   |-- common/              # Navbar, Footer, Button, Card, BackToTop, MobileActionBar
|   |-- navigation/          # Base UI navigation menu primitives
|   |-- seo/                 # <Seo> head-tag manager
|   |-- theme/               # ThemeProvider + ThemeToggle
|   |-- three/               # 3D hero (HeroCanvas, Scene, Stethoscope)
|   `-- ui/                  # shadcn-style primitives (accordion, ...)
|-- constants/               # clinic info, navigation, SEO metadata, JSON-LD builders
|-- features/                # One folder per route: components/, data/, page file
|   |-- about/ booking/ contact/ doctors/ gallery/
|   |-- home/ legal/ not-found/ services/
|-- lib/                     # clinicStatus (open/closed), deviceCapability (perf tiers), utils
|-- router/                  # Route table + RouteFallback
|-- services/                # Data-access layer (static today, API-ready)
`-- types/                   # Shared TypeScript interfaces
public/
|-- sw.js                    # Service worker
|-- offline.html             # Offline shell
|-- clinic/ doctors/ gallery/ results/ reviews/ services/   # Images (WebP)
`-- robots.txt  sitemap.xml  _redirects
scripts/                     # Asset + verification scripts
```

## Underlying features - what you should know

### 1. Theme system
`src/components/theme/ThemeProvider.tsx`. Persisted as `ae-theme` in localStorage; falls back to the OS `prefers-color-scheme`. Switching toggles a `.dark` class on `<html>`. All colors are semantic tokens in `src/index.css` (`:root` and `.dark`) - never hardcode zinc/slate grays; use `text-foreground`, `bg-card`, `border-border`, etc. so dark mode keeps working.

### 2. Adaptive performance tiers
`src/lib/deviceCapability.ts` classifies the device as `high`, `medium` or `low` (GPU/CPU/memory signals, reduced-motion, data-saver) and can be forced with `?perf=high|medium|low`. Low tier swaps the 3D hero for a static stethoscope image (`HeroStaticModel`); medium trims fixed-bar blur; every tier pauses hero animations off-screen (`.hero-offscreen`). CSS hooks: `.perf-low`, `.perf-mid` in `src/index.css`.

### 3. Service worker (`public/sw.js`)
Registered only in production builds (`src/main.tsx`). Strategies: cache-first for hashed `/assets/*`, images, fonts and the 3D model; network-first for page navigations, falling back to cache, then the app shell, then `public/offline.html`; non-page requests get a plain 503 when offline and **never HTML** (HTML once poisoned the 3D loader). Cache namespace is `CACHE_VERSION = "ae-v2"` - bump it whenever you change what the worker caches so old caches purge on activate.

### 4. Lazy routes + RouteFallback
Every route except Home is `React.lazy` in `src/router/Router.tsx` behind a visible `RouteFallback` spinner. Do **not** go back to `fallback={null}` - a null fallback renders a blank page while a chunk loads (the original "page goes blank" complaint).

### 5. Mobile menu InertZone fillers (do not remove)
The whitespace between mobile-menu links is filled by `InertZone` divs in `Navbar.tsx`. Chromium touch hit-testing retargets a tap that lands on bare, click-less whitespace onto the nearest link **and rewrites the tap coordinates into it**, so removing the fillers (or going back to bare `space-y` gaps) makes gap taps silently navigate again - and on a slow connection that looks like the page going blank. The fillers carry real `onclick` event-handler properties; delegated React listeners do not prevent the retargeting. Keep them.

### 6. WhatsApp-first flows
There is no backend. Contact and booking build `https://wa.me/` deep links with URL-encoded message bodies (number in `src/constants/clinic.ts`). `/book` reads `?service=` (id or title) and `?doctor=` to prefill; `/services` reads `?group=`. The mobile action bar links straight to call / WhatsApp / booking.

### 7. Clinic hours / open-closed badge
`src/lib/clinicStatus.ts` computes open/closed in Nepal time (UTC+5:45). `CLINIC_OPEN_HOUR` / `CLINIC_CLOSE_HOUR` are the single source for the hero badge and the JSON-LD opening hours; `businessHours` in `src/constants/clinic.ts` must match.

### 8. SEO system
Each page renders `<Seo>` (`src/components/seo/Seo.tsx`) with metadata from `src/constants/seo.ts` (titles, descriptions, canonical, Open Graph, Twitter). JSON-LD builders (MedicalClinic, Physician, MedicalProcedure) live in the same file and are injected and removed per route. `public/sitemap.xml` and `public/robots.txt` must be updated when routes change. The canonical domain is `siteUrl` in `src/constants/clinic.ts`.

### 9. Pinned preload hashes (index.html)
`index.html` preloads the hero fallback images by their content-hashed names (e.g. `/assets/stethoscope-light-BailOwvS.webp`). If you replace those images, copy the new hashed names from the build output into `index.html`, otherwise the preloads 404 silently.

### 10. Hosting configs
`vercel.json` (rewrite everything to `/index.html`) and `public/_redirects` (Netlify) are included. Any static host works as long as SPA fallback is configured. `vite preview` allows arbitrary hosts (`preview.allowedHosts`) for tunnel testing.

## Editing guide (where to change what)

| What | File |
|------|------|
| Clinic name, phone, address, socials, WhatsApp | `src/constants/clinic.ts` (single source used by navbar, footer, forms, schema, service worker) |
| Nav links, footer menus | `src/constants/navigation.ts` |
| Treatments (cards, detail pages, dropdown, footer, booking select) | `src/features/services/data/servicesData.ts` |
| Doctors | `src/features/doctors/data/doctorsData.ts` (also feeds the booking select + Physician schema) |
| Testimonials / reviews | `src/features/home/data/testimonialsData.ts` |
| SEO copy | `src/constants/seo.ts` (+ per-page `<Seo>` props) |
| Business hours | `src/lib/clinicStatus.ts` (+ `businessHours` in `clinic.ts`) |
| Legal text | `src/features/legal/` |

Images live under `public/` as WebP (`services/`, `gallery/`, `doctors/`, `results/`, `reviews/`, `clinic/`). `npm run compress:images` regenerates compressed variants; the results slider uses 400/800/1200w variants.

## Deployment

```bash
npm run build
```

Deploy `dist/` to any static host with SPA fallback (configs included for Vercel + Netlify). Keep the service worker in mind: it is cache-first for hashed assets, so content updates ship via fresh HTML and new asset hashes; if you change the worker itself, bump `CACHE_VERSION`.

## License

Private - AestheticEssence Skin & Hair Clinic.
