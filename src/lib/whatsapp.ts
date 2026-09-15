// WhatsApp deep-link helpers.
//
// Reliability notes (from real-device testing across iPhone 8/Brave and a
// low-end Samsung/Chrome):
// - `whatsapp://send?phone=…&text=…` silently DROPS the pre-filled text on
//   many Android WhatsApp versions and doesn't resolve at all on some
//   devices. Do not use.
// - Android `intent://send/<number>…` URIs don't match how modern WhatsApp
//   handles the `whatsapp://` scheme (the phone belongs in the query, not
//   the path) — taps do nothing on real devices. Do not use.
// - `https://wa.me/…` is the official Click-to-Chat link and carries the
//   text reliably. On phones it hands off to the installed app when
//   navigated in the SAME tab; new-tab opens (target=_blank / window.open)
//   are what land users on the "Install WhatsApp" web page.

const MOBILE_UA =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  if (MOBILE_UA.test(navigator.userAgent)) return true;
  // iPadOS 13+ masquerades as desktop Safari with multi-touch support.
  return /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
}

/** Official Click-to-Chat URL with an optional pre-filled message. */
export function whatsappUrl(number: string, text = ""): string {
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${number}${query}`;
}

/**
 * Props to spread on an <a> that opens WhatsApp. On phones the link is
 * same-tab AND the click is routed through openWhatsApp(): some mobile
 * browsers (Brave on iOS, for one) break the universal-link hand-off for
 * direct wa.me taps — they load the api.whatsapp.com web page instead, whose
 * "Open WhatsApp" button is then blocked too. Navigating via location.href
 * from the click handler (the same path the booking/contact forms use, which
 * is verified working on those devices) opens the app reliably. Desktop keeps
 * the plain new-tab link so the site stays open.
 */
export function whatsappAnchorProps(
  number: string,
  text = "",
): {
  href: string;
  target?: string;
  rel?: string;
  onClick: (event: { preventDefault(): void }) => void;
} {
  return {
    href: whatsappUrl(number, text),
    onClick: (event) => {
      if (isMobileDevice()) {
        event.preventDefault();
        openWhatsApp(number, text);
      }
    },
    ...(isMobileDevice()
      ? {}
      : { target: "_blank", rel: "noopener noreferrer" }),
  };
}

/**
 * Opens WhatsApp from a form submit. Phones navigate the SAME tab (required
 * for the app hand-off); desktop opens wa.me in a new tab.
 */
export function openWhatsApp(number: string, text = ""): void {
  if (isMobileDevice()) {
    window.location.href = whatsappUrl(number, text);
    return;
  }
  window.open(whatsappUrl(number, text), "_blank", "noopener,noreferrer");
}