// Site-wide clinic information and contact details.

export const CLINIC_INFO = {
  name: "AestheticEssence Skin & Hair Clinic",
  shortName: "AestheticEssence Clinic",
  tagline: "Reveal, Renew, Rejuvenate: Advanced dermatology & hair care at City Square Mall, Samakhushi, Kathmandu.",
  // Canonical production origin used for canonical URLs, sitemap and schema.
  // TODO: replace with the final domain before going live — must be updated
  // together with index.html (canonical + og:image), public/robots.txt and
  // public/sitemap.xml so all four agree on ONE origin (HANDOVER §7).
  siteUrl: "https://www.aestheticessence.com.np",
  // Full visitor-facing address (landmark included so patients can find us).
  address: "City Square Mall (3rd Floor), Samakhushi Road, Kathmandu, Nepal",
  addressShort: "City Square Mall (3rd Floor), Samakhushi Road, Kathmandu, Nepal",
  addressStreet: "City Square Mall (3rd Floor)",
  addressLocality: "Samakhushi, Kathmandu",
  addressCountry: "NP",
  phone: "+977 976-7648659",
  phoneRaw: "9767648659",
  // E.164 form for tel: links — without the +977 country code, call taps fail
  // or mis-dial for visitors whose dialer is not Nepal-region.
  phoneTel: "+9779767648659",
  landline: "01-4978659",
  whatsappNumber: "9779767648659",
  email: "aesthetic.essence@outlook.com",
  businessHours: "11:00 AM – 6:00 PM (Sun–Fri)",
  responseTime: "Typically responds within 24 hours",
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61560382797664",
    instagram: "https://www.instagram.com/aestheticessence.np",
    tiktok: "https://www.tiktok.com/@aestheticessence.np",
    youtube: "https://www.youtube.com/@AestheticEssenceClinic",
    maps: "https://www.google.com/maps/place/Aesthetic+Essence+Skin+and+Hair+Clinic/@27.7353999,85.3178899,17z/data=!4m6!3m5!1s0x39eb1960445007ff:0x4b83485b2b2cb147!8m2!3d27.7353999!4d85.3178899!16s%2Fg%2F11wqy376v5",
    whatsapp: "https://wa.me/9779767648659",
  },
  // Exact coordinates for the embedded map (Google Maps place: Aesthetic Essence Skin and Hair Clinic)
  geo: { lat: 27.7353999, lng: 85.3178899 },
  mapsEmbed: "https://www.google.com/maps?q=27.7353999,85.3178899&z=17&hl=en&output=embed",
} as const;

export const WHATSAPP_NUMBER = CLINIC_INFO.whatsappNumber;

