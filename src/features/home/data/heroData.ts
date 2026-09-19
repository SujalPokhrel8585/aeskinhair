// Floating badge links and icons for the home page hero section.

import { Phone, MapPin } from "lucide-react";
import { CLINIC_INFO } from "@/constants";
import { Facebook, Instagram, TikTok } from "./heroIcons";

export const FLOATING_BADGES = [
  {
    href: `tel:${CLINIC_INFO.phoneTel}`,
    icon: Phone,
    label: "Phone / WhatsApp",
    badgeClass: "badge-1",
  },
  {
    href: CLINIC_INFO.socials.facebook,
    icon: Facebook,
    label: "Facebook",
    badgeClass: "badge-2",
  },
  {
    href: CLINIC_INFO.socials.instagram,
    icon: Instagram,
    label: "Instagram",
    badgeClass: "badge-3",
  },
  {
    href: CLINIC_INFO.socials.tiktok,
    icon: TikTok,
    label: "TikTok",
    badgeClass: "badge-5",
  },
  {
    href: CLINIC_INFO.socials.maps,
    icon: MapPin,
    label: "Google Maps Location",
    badgeClass: "badge-4",
  },
] as const;
