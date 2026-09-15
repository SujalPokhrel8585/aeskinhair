// WhatsApp deep-link helpers.
//
// Reliability notes (from real-device testing):
// - `whatsapp://send?phone=…&text=…` opens the app on many phones but
//   silently DROPS the pre-filled text on others (user lands in a blank
//   chat), doesn't resolve at all on some devices, and can trigger a
//   one-time "open with?" chooser — do not use it.
// - `https://wa.me/…` is the official Click-to-Chat link and carries the
//   text reliably, but only hands off to the app when navigated in the
//   SAME tab; new-tab opens are what landed users on the "Install WhatsApp"
//   web page.
// - Android additionally gets an explicit `intent://` URL targeting the
//   WhatsApp package: it opens the app directly (no app-link verification
//   or chooser involved) and falls back to the wa.me web page automatically
//   when the app isn't installed.

const MOBILE_UA =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export function isAndroidDevice(): boolean {
  return (
    typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent)
  );
}

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  if (MOBILE_UA.test(navigator.userAgent)) return true;
  // iPadOS 13+ masquerades as desktop Safari with multi-touch support.
  return /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
}

function waMeUrl(number: string, text: string): string {
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${number}${query}`;
}

/** Android app hand-off; falls back to the wa.me web page when app missing. */
function androidIntentUrl(number: string, text: string): string {
  const fallback = encodeURIComponent(waMeUrl(number, text));
  const message = text ? `;S.text=${encodeURIComponent(text)}` : "";
  return `intent://send/${number}#Intent;scheme=whatsapp;package=com.whatsapp${message};S.browser_fallback_url=${fallback};end`;
}

/** Device-appropriate WhatsApp href for plain <a> links. */
export function whatsappUrl(number: string, text = ""): string {
  return isAndroidDevice()
    ? androidIntentUrl(number, text)
    : waMeUrl(number, text);
}

/**
 * Opens WhatsApp from a form submit. Phones navigate the SAME tab (required
 * for the app hand-off — new-tab opens show the "Install WhatsApp" page);
 * desktop opens wa.me in a new tab.
 */
export function openWhatsApp(number: string, text = ""): void {
  if (isMobileDevice()) {
    window.location.href = whatsappUrl(number, text);
    return;
  }
  window.open(waMeUrl(number, text), "_blank", "noopener,noreferrer");
}