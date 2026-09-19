import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { CLINIC_INFO } from "@/constants";
import { whatsappAnchorProps } from "@/lib/whatsapp";
import { SocialIcons } from "./SocialIcons";

export function ContactInfo() {
  return (
    <div className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-lg shadow-black/5 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
          Contact Information
        </h2>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
              <MapPin className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-0.5">
                Visit Us
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {CLINIC_INFO.address}
              </p>
              <a
                href={CLINIC_INFO.socials.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-primary hover:underline underline-offset-2 mt-1 inline-block font-medium"
              >
                Get Directions →
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-11 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 border border-border shadow-xs">
              <Phone className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-0.5">
                Call Us
              </h3>
              <a
                href={`tel:${CLINIC_INFO.phoneTel}`}
                className="text-xs sm:text-sm text-muted-foreground hover:text-accent-foreground transition-colors"
              >
                {CLINIC_INFO.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
              <MessageCircle className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-0.5">
                WhatsApp Us
              </h3>
              <a
                {...whatsappAnchorProps(CLINIC_INFO.whatsappNumber)}
                className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Message our front desk
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
              <Clock className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-0.5">
                Response Time
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {CLINIC_INFO.responseTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SocialIcons />
    </div>
  );
}
