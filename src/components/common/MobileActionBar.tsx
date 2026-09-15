import { Link } from "react-router-dom";
import { Calendar, MessageCircle, Phone } from "lucide-react";
import { CLINIC_INFO } from "@/constants";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Always-visible contact bar for phones/tablets: one-tap call, WhatsApp chat
 * and booking. Hidden on desktop (lg+) where the navbar CTA is visible.
 */
export function MobileActionBar() {
  return (
    <div
      className="blurred-fixed-bar fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-3 mb-3 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card/95 p-2 shadow-xl backdrop-blur-md">
        <a
          href={`tel:${CLINIC_INFO.phoneRaw}`}
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          aria-label={`Call ${CLINIC_INFO.name}`}
        >
          <Phone className="size-4.5 text-dark" />
          Call
        </a>
        <a
          href={whatsappUrl(CLINIC_INFO.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-[#25D366] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1fb857]"
          aria-label="Chat with us on WhatsApp"
        >
          <MessageCircle className="size-4.5" />
          WhatsApp
        </a>
        <Link
          to="/book"
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          aria-label="Book an appointment"
        >
          <Calendar className="size-4.5" />
          Book
        </Link>
      </div>
    </div>
  );
}

export default MobileActionBar;
