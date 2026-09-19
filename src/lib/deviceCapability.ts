// Adaptive performance tier, computed synchronously before first render so
// the right hero variant (3D vs static) is chosen without any flash.
//
// Tiers:
//   high   - full experience: 3D with shadows, antialiasing, all animations
//   medium - 3D kept fully interactive but cheaper (lower dpr, no shadows)
//   low    - no WebGL work at all: static stethoscope photo, no blur, no
//            canvas animations. Used for old phones, data-saver, no-WebGL
//            and reduced-motion users.
//
// Escape hatch for testing: add ?perf=high|medium|low to any URL.

export type PerfTier = "high" | "medium" | "low";

const STORAGE_KEY = "ae-perf-tier";

function detectTier(): PerfTier {
  if (typeof window === "undefined") return "high";

  // Manual override wins (also persisted for the session).
  const forced = new URLSearchParams(window.location.search).get("perf");
  if (forced === "high" || forced === "medium" || forced === "low") {
    try {
      sessionStorage.setItem(STORAGE_KEY, forced);
    } catch {
      /* private mode */
    }
    return forced;
  }
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved === "high" || saved === "medium" || saved === "low") return saved;
  } catch {
    /* ignore */
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  // Data-saver or very slow connections get the lightest experience.
  const conn = nav.connection;
  if (conn?.saveData) return "low";
  if (conn?.effectiveType && /(^2g$|^slow-)/.test(conn.effectiveType)) {
    return "low";
  }

  // Users who ask for less motion get less motion (and no 3D spin).
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "low";
  }

  let score = 0;
  const cores = nav.hardwareConcurrency ?? 4;
  score += cores >= 8 ? 3 : cores >= 6 ? 2 : cores >= 4 ? 1 : 0;

  // deviceMemory is capped at 8 by spec; old phones report 2-4.
  const mem = nav.deviceMemory ?? 4;
  score += mem >= 8 ? 3 : mem >= 6 ? 2 : mem >= 4 ? 1 : 0;

  // GPU class check - catches old integrated/low-end mobile GPUs.
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ??
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "low"; // no WebGL → nothing to accelerate with
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg
      ? (gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string)
      : "";
    const weakGpu =
      /(mali-g[1-5][0-9]|adreno[^a-z0-9]*(4[0-9]{2}|5[0-9]{2}|6[01][0-9])|powervr|swiftshader|llvmpipe|intel.*(hd|uhd) graphics (2|3|4|5|6)[0-9]{2})/i;
    if (weakGpu.test(renderer)) score -= 2;
  } catch {
    /* WebGL probe failed - fall through to CPU score */
  }

  const isSmallScreen = window.matchMedia("(max-width: 640px)").matches;

  if (score >= 5) return "high";
  // Small screens with a decent-but-not-great score: keep 3D but cheapen it.
  if (score >= 3) return isSmallScreen ? "medium" : "high";
  return "low";
}

let cachedTier: PerfTier | null = null;

export function getPerfTier(): PerfTier {
  if (cachedTier === null) {
    cachedTier = detectTier();
    // Root classes drive the CSS-side reductions (blur removal, etc.).
    if (cachedTier === "low") {
      document.documentElement.classList.add("perf-low");
    } else if (cachedTier === "medium") {
      document.documentElement.classList.add("perf-mid");
    }
  }
  return cachedTier;
}
