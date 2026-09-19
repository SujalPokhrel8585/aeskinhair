import { useEffect } from "react";
import { CLINIC_INFO } from "@/constants/clinic";
import type { SeoMeta } from "@/constants/seo";

interface SeoProps extends Partial<SeoMeta> {
  /** JSON-LD objects to inject as structured data. */
  jsonLd?: object[];
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function absoluteUrl(path: string) {
  const base = CLINIC_INFO.siteUrl.replace(/\/$/, "");
  return path === "/" ? `${base}/` : `${base}${path}`;
}

/**
 * Applies per-route SEO head tags (title, description, canonical, Open Graph).
 * Render it once inside each page component. JSON-LD objects are injected as
 * structured-data scripts and removed when the page unmounts.
 */
export function Seo({
  title = CLINIC_INFO.name,
  description = CLINIC_INFO.tagline,
  path = "/",
  jsonLd,
}: SeoProps) {
  const canonical = absoluteUrl(path);
  // One social preview card for every route: the generated 1200x630 brand
  // card. The og:image:width/height tags below MUST match its real size,
  // so never point this at an arbitrary photo (sizes/aspect would disagree).
  const image = `${CLINIC_INFO.siteUrl}/og-image.png`;

  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertCanonical(canonical);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", CLINIC_INFO.name);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");
    upsertMeta(
      "property",
      "og:image:alt",
      `${CLINIC_INFO.name} - Skin & Hair Clinic, Samakhushi, Kathmandu`,
    );
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
  }, [title, description, canonical, image]);

  // Inject JSON-LD scripts (removed on unmount so routes don't leak schema).
  useEffect(() => {
    if (!jsonLd?.length) return;
    const scripts = jsonLd.map((data) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonLd = "true";
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
      return script;
    });
    return () => scripts.forEach((s) => s.remove());
  }, [jsonLd]);

  return null;
}

export default Seo;
