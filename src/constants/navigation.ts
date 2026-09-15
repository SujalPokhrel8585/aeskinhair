// Site-wide navigation routes and menu links.

import { CLINIC_INFO } from "./clinic";
import { whatsappUrl } from "@/lib/whatsapp";

export interface NavItem {
  title: string;
  href: string;
}

export interface FooterMenuItem {
  title: string;
  links: {
    text: string;
    url: string;
    external?: boolean;
  }[];
}

export const NAV_LINKS: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Gallery", href: "/gallery" },
  { title: "About Us", href: "/about" },
  { title: "Doctors", href: "/doctors" },
  { title: "Contact", href: "/contact" },
];

export const SERVICE_LINKS: NavItem[] = [
  { title: "Facial Treatments", href: "/services?group=facial" },
  { title: "Hair Solutions", href: "/services?group=hair" },
  { title: "Skin Corrections", href: "/services?group=skin" },
  { title: "Anti-Aging", href: "/services?group=anti-aging" },
];

export const DEFAULT_FOOTER_MENU_ITEMS: FooterMenuItem[] = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "/" },
      { text: "Services", url: "/services" },
      { text: "Gallery", url: "/gallery" },
      { text: "About Us", url: "/about" },
      { text: "Doctors", url: "/doctors" },
      { text: "Contact", url: "/contact" },
      { text: "Book Appointment", url: "/book" },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        text: "Facebook",
        url: "https://www.facebook.com/profile.php?id=61560382797664",
        external: true,
      },
      {
        text: "Instagram",
        url: "https://www.instagram.com/aestheticessence.np",
        external: true,
      },
      {
        text: "TikTok",
        url: "https://www.tiktok.com/@aestheticessence.np",
        external: true,
      },
      {
        text: "YouTube",
        url: CLINIC_INFO.socials.youtube,
        external: true,
      },
      {
        text: "Google Maps",
        url: "https://www.google.com/maps/place/Aesthetic+Essence+Skin+and+Hair+Clinic/@27.7353999,85.3178899,17z/data=!4m6!3m5!1s0x39eb1960445007ff:0x4b83485b2b2cb147!8m2!3d27.7353999!4d85.3178899!16s%2Fg%2F11wqy376v5",
        external: true,
      },
      {
        text: "WhatsApp",
        url: whatsappUrl(CLINIC_INFO.whatsappNumber),
        external: true,
      },
    ],
  },
];
