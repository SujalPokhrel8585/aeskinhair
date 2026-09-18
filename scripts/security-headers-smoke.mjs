// Verifies the security headers (see vite.config.ts preview-security-headers,
// vercel.json, public/_headers) do not break any page. Loads every route
// through the preview server WITH the production CSP active (service worker
// included) and fails on any CSP violation, missing JSON-LD, unloaded web
// fonts, or 503 responses (the service worker\'s "offline" fallback — a
// sign the worker\'s own CSP is too strict).
//
// Usage: node scripts/security-headers-smoke.mjs
// Requires a locally installed Chrome or Edge (playwright-core drives the
// system browser via channel, nothing is downloaded).

import { preview } from "vite";
import { chromium } from "playwright-core";

const PORT = 4199;
const BASE = `http://localhost:${PORT}`;

async function launchBrowser() {
  for (const channel of ["msedge", "chrome", "msedge-beta", "chrome-canary"]) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch (err) {
      console.log(`channel ${channel} not available: ${err.message.split("\n")[0]}`);
    }
  }
  console.error("No system Chrome/Edge found for playwright-core.");
  process.exit(1);
}

const server = await preview({
  preview: { port: PORT, strictPort: true },
  logLevel: "silent",
});
console.log(`preview server (with production headers) on ${BASE}`);

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const violations = [];
const httpErrors = [];
let fontsCssStatus = null;
const otherMessages = [];
page.on("console", (msg) => {
  const text = msg.text();
  if (
    text.includes("Content Security Policy") ||
    text.includes("Refused to ") ||
    text.includes("violates the following")
  ) {
    violations.push(text);
  } else if (msg.type() === "error" || msg.type() === "warning") {
    otherMessages.push(`[${msg.type()}] ${text.slice(0, 200)}`);
  }
});
page.on("pageerror", (err) => otherMessages.push(`[pageerror] ${String(err).slice(0, 200)}`));
page.on("response", (res) => {
  if (res.url().includes("fonts.googleapis.com")) fontsCssStatus = res.status();
  if (res.status() >= 400) {
    const url = res.url();
    const entry = `[HTTP ${res.status()}] ${url}`;
    // Same-origin failures (incl. the service worker\'s 503 offline fallback)
    // mean our headers broke something. External 4xx/5xx (Unsplash hotlinks,
    // Google endpoints) are pre-existing site behavior — report only.
    if (url.startsWith(BASE)) httpErrors.push(entry);
    else otherMessages.push(entry);
  }
});

const routes = [
  "/",
  "/about",
  "/services",
  "/services?group=hair",
  "/services?group=skin",
  "/book?service=hydrafacial",
  "/book?service=garbage-input&doctor=Not-A-Doctor",
  "/doctors",
  "/gallery",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/definitely-not-a-real-page",
  "/offline.html",
];

let allOk = true;
for (const route of routes) {
  const resp = await page.goto(BASE + route, {
    waitUntil: "load",
    timeout: 45000,
  });
  await page.waitForTimeout(1200);
  const headers = resp ? resp.headers() : {};
  if (!headers["content-security-policy"] || !headers["x-frame-options"]) {
    allOk = false;
    console.log(`FAIL ${route}: missing CSP/X-Frame-Options headers`);
  } else {
    console.log(`OK ${route} (status ${resp ? resp.status() : "?"}, CSP active)`);
  }
}

// /sw.js must get its dedicated (more permissive connect-src) CSP.
const swResp = await page.request.get(BASE + "/sw.js");
const swCsp = swResp.headers()["content-security-policy"] || "";
if (swCsp.includes("https://images.unsplash.com")) {
  console.log("OK /sw.js has dedicated worker CSP");
} else {
  allOk = false;
  console.log(`FAIL /sw.js CSP is not the worker-specific one: ${swCsp.slice(0, 120)}`);
}

// JSON-LD must survive CSP (script-src allows it; it feeds SEO schema).
// Checked on /doctors: / can crash-unmount its Seo when the external
// raw.githack HDR is unreachable (pre-existing degradation), which removes
// its JSON-LD as a side effect of Seo's unmount cleanup — unrelated to CSP.
await page.goto(BASE + "/doctors", { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(2000);
const ldCount = await page.evaluate(
  () => document.querySelectorAll('script[type="application/ld+json"]').length,
);
console.log(`JSON-LD script blocks on /doctors: ${ldCount}`);
if (ldCount < 1) {
  allOk = false;
  console.log("FAIL: JSON-LD missing on /doctors (CSP is stripping structured data)");
}

// Web fonts must actually load from fonts.gstatic.com (font-src + style-src).
// document.fonts.load() forces the woff2 fetch, independent of page content.
const fontLoaded = await page.evaluate(async () => {
  const faces = await document.fonts.load("16px 'Playfair Display'", "AestheticEssence");
  return faces.length > 0 && faces.every((face) => face.status === "loaded");
});
console.log(`Playfair Display woff2 loaded under CSP: ${fontLoaded}`);
if (!fontLoaded) {
  allOk = false;
  console.log("FAIL: web font did not load under CSP");
}

// offline.html\'s inline onclick="location.reload()" must still work.
await page.goto(BASE + "/offline.html", { waitUntil: "load", timeout: 45000 });
await page.click("button");
await page.waitForLoadState("load");
console.log("offline.html retry button click: no CSP violation");

console.log("---");
console.log(`CSP violations: ${violations.length}`);
violations.forEach((v) => console.log(`VIOLATION: ${v.slice(0, 250)}`));
console.log(`same-origin HTTP errors: ${httpErrors.length}`);
httpErrors.forEach((e) => console.log(`HTTP-ERROR: ${e}`));
console.log(`other console/network messages: ${otherMessages.length} (informational)`);
otherMessages.slice(0, 30).forEach((m) => console.log(`INFO: ${m}`));

await browser.close();
await new Promise((resolve) => server.httpServer.close(resolve));

if (violations.length > 0 || httpErrors.length > 0 || !allOk) {
  console.error("RESULT: FAIL");
  process.exit(1);
}
console.log("RESULT: PASS — headers break nothing");
process.exit(0);
