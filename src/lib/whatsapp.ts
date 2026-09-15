// WhatsApp deep-link helpers.
//
// A plain `https://wa.me/…` link is served as a web page: the browser is
// supposed to hand the navigation off to the installed app, but that hand-off
// silently fails in in-app browsers, several Android browsers, and on desktops
// without a WhatsApp Web session — WhatsApp then shows its "Install WhatsApp"
// page instead of the chat. Mobile devices therefore get the native
// `whatsapp://send` scheme (opens the installed app directly, wa.me as a
// fallback), while desktop keeps the wa.me web link.

const MOBILE_UA =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  if (MOBILE_UA.test(navigator.userAgent)) return true;
  // iPadOS 13+ masquerades as desktop Safari with multi-touch support.
  return /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
}

/**
 * Device-appropriate WhatsApp deep link with an optional pre-filled message.
 * Empty `text` opens the chat with the number without a draft.
 */
export function whatsappUrl(number: string, text = ""): string {
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return isMobileDevice()
    ? `whatsapp://send?phone=${number}${query}`
    : `https://wa.me/${number}${query}`;
}

/**
 * Opens WhatsApp from a programmatic flow (form submits). On mobile it tries
 * the native app scheme first and falls back to the wa.me web page if the app
 * didn't take over within a beat, so the flow never dead-ends. On desktop it
 * opens wa.me in a new tab as before.
 */
export function openWhatsApp(number: string, text = ""): void {
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  if (isMobileDevice()) {
    const appUrl = `whatsapp://send?phone=${number}${query}`;
    const webUrl = `https://wa.me/${number}${query}`;

    let cancelled = false;
    const fallback = window.setTimeout(() => {
      // The app opening backgrounds this page (visibilitychange fires). If the
      // page is still visible the scheme didn't resolve — go to wa.me.
      if (!cancelled && !document.hidden) window.location.href = webUrl;
    }, 1250);
    const onHidden = () => {
      cancelled = true;
      window.clearTimeout(fallback);
      document.removeEventListener("visibilitychange", onHidden);
    };
    document.addEventListener("visibilitychange", onHidden);
    window.location.href = appUrl;
    return;
  }
  window.open(
    `https://wa.me/${number}${query}`,
    "_blank",
    "noopener,noreferrer",
  );
}