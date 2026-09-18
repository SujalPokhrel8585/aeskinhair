import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type PreviewServer } from "vite";

// Security headers served by `npm run preview`, mirroring vercel.json and
// public/_headers so the exact production CSP is exercised locally. Keep all
// three in sync.
// - script-src allows 'unsafe-inline': the site injects JSON-LD (Seo.tsx) via
//   the DOM, which a hash/nonce-based script-src would block-and-strip on a
//   static host (no per-request nonces). There are no injection sinks; see
//   HANDOVER.md for the full rationale.
// - /sw.js gets a separate CSP: the service worker fetches fonts, Unsplash
//   images and the drei HDR itself, so its connect-src must allow those
//   origins or every revalidation 503s.
// - HSTS is intentionally omitted in preview: setting it on localhost can pin
//   http->https upgrades for other local dev servers.
const securityHeaders: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://images.unsplash.com https://cdn.21st.dev; connect-src 'self'; frame-src 'self' https://www.google.com https://maps.google.com; worker-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
};

const swSecurityHeaders: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://images.unsplash.com https://cdn.21st.dev",
};

const previewSecurityHeaders = {
  name: "preview-security-headers",
  configurePreviewServer(server: PreviewServer) {
    server.middlewares.use((req, res, next) => {
      const path = (req.url || "/").split("?")[0];
      const headers =
        path === "/sw.js" ? swSecurityHeaders : securityHeaders;
      for (const [key, value] of Object.entries(headers)) {
        res.setHeader(key, value);
      }
      next();
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), previewSecurityHeaders],
  build: {
    // The three.js hero chunk (~1MB, loaded async after first paint) is a
    // known, intentional outlier — raise the warning bar rather than split
    // it further. Revisit if other chunks grow past this too.
    chunkSizeWarningLimit: 1100,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    watch: {
      // On Windows, fs.watch can crash the dev server with a fatal EBUSY
      // error when a file is locked by another process (e.g. an image open
      // in a viewer, cloud sync, or antivirus scan). Polling-based watching
      // avoids this, and public/ assets don't need HMR watching anyway
      // (they are served statically and picked up on refresh).
      usePolling: true,
      interval: 500,
      // dist/ and *.tsbuildinfo are written by npm run build / tsc -b: watching
      // them made every build while the dev server ran trigger HMR churn
      // (reload storms, degraded fast-refresh state, blank pages) - ignore them.
      ignored: ["**/public/**", "**/dist/**", "**/node_modules/**", "**/*.tsbuildinfo"],
    },
  },
  // ✅ Allows Cloudflare Tunnel URLs to access your preview server
  preview: {
    allowedHosts: true,
  },
});
