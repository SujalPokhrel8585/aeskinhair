// Per-route SEO metadata. The <Seo /> component applies these to the document
// head (title, description, canonical, Open Graph) on every navigation.

import { CLINIC_INFO } from "@/constants/clinic";
import {
  CLINIC_OPEN_HOUR,
  CLINIC_CLOSE_HOUR,
} from "@/lib/clinicStatus";
import { doctorData } from "@/features/doctors/data/doctorsData";
import type { Service } from "@/types";

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

const BRAND = CLINIC_INFO.name;
const LOCATION = "Samakhushi, Kathmandu";

export const STATIC_SEO: Record<string, SeoMeta> = {
  "/": {
    title: `${BRAND} | Dermatologist & Skin Clinic in ${LOCATION}`,
    description:
      "Advanced skin & hair clinic at City Square Mall, Samakhushi, Kathmandu. HydraFacial, acne & scar treatment, laser hair reduction, Botox, PRP & GFC and melasma care by NMC-registered dermatologists. Book on WhatsApp.",
    path: "/",
    ogImage: "/clinic/front-desk.png",
  },
  "/services": {
    title: `Skin & Hair Treatments in Kathmandu | ${BRAND}`,
    description:
      "Medical-grade dermatology treatments in Samakhushi, Kathmandu - HydraFacial, acne & scar care, laser hair reduction, Botox & fillers, PRP & GFC, melasma treatment and medi peels.",
    path: "/services",
  },
  "/doctors": {
    title: `Our Dermatologists | ${BRAND}`,
    description:
      "Meet our NMC-registered consultant dermatologists in Samakhushi, Kathmandu - Dr. Shraddha Chudal and Dr. Pramesh Koirala.",
    path: "/doctors",
  },
  "/about": {
    title: `About ${BRAND} | Skin & Hair Clinic in ${LOCATION}`,
    description:
      "Learn about AestheticEssence Skin & Hair Clinic, a dermatologist-led skin and hair clinic in Samakhushi, Kathmandu offering safe, evidence-based treatments with sterilized, single-use consumables.",
    path: "/about",
  },
  "/gallery": {
    title: `Clinic Gallery | ${BRAND}`,
    description:
      "Inside AestheticEssence Skin & Hair Clinic, Samakhushi, real photos of our dermatology treatments, laser care, HydraFacial sessions and regenerative hair care procedures.",
    path: "/gallery",
  },
  "/contact": {
    title: `Contact & Location | ${BRAND}`,
    description:
      "Visit us at City Square Mall (3rd Floor), Samakhushi Road, Kathmandu. Call +977 976-7648659 or 01-4978659, or message us on WhatsApp - we typically respond within 24 hours.",
    path: "/contact",
  },
  "/book": {
    title: `Book an Appointment | ${BRAND}`,
    description:
      "Book a dermatology appointment in Samakhushi, Kathmandu. Choose your treatment, doctor, date and time, we confirm your slot on WhatsApp within a few hours.",
    path: "/book",
  },
  "/privacy-policy": {
    title: `Privacy Policy | ${BRAND}`,
    description:
      "How AestheticEssence Skin & Hair Clinic handles the personal information you share through our website and WhatsApp appointment requests.",
    path: "/privacy-policy",
  },
  "/terms": {
    title: `Terms of Service | ${BRAND}`,
    description:
      "Terms of use for the AestheticEssence Skin & Hair Clinic website and the appointment request service it provides.",
    path: "/terms",
  },
};

export function seoForPath(path: string): SeoMeta {
  return STATIC_SEO[path] ?? STATIC_SEO["/"];
}

export function serviceSeo(service: Service): SeoMeta {
  return {
    title: `${service.title} in Kathmandu | ${BRAND}`,
    description: `${service.tagline}. ${service.description} Performed by NMC-registered dermatologists at ${BRAND}, ${LOCATION}. Book on WhatsApp.`,
    path: `/services/${service.id}`,
    ogImage: service.image.startsWith("http") ? undefined : service.image,
  };
}

// ── JSON-LD schema builders ──

export function medicalClinicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: CLINIC_INFO.name,
    url: CLINIC_INFO.siteUrl,
    image: `${CLINIC_INFO.siteUrl}/og-image.png`,
    telephone: `+977${CLINIC_INFO.phoneRaw}`,
    priceRange: "NPR 2,500+",
    medicalSpecialty: "Dermatology",
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC_INFO.addressStreet,
      addressLocality: CLINIC_INFO.addressLocality,
      addressRegion: "Bagmati",
      addressCountry: CLINIC_INFO.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CLINIC_INFO.geo.lat,
      longitude: CLINIC_INFO.geo.lng,
    },
    hasMap: CLINIC_INFO.socials.maps,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: `${String(CLINIC_OPEN_HOUR).padStart(2, "0")}:00`,
      closes: `${String(CLINIC_CLOSE_HOUR).padStart(2, "0")}:00`,
    },
    sameAs: [
      CLINIC_INFO.socials.facebook,
      CLINIC_INFO.socials.instagram,
      CLINIC_INFO.socials.tiktok,
      CLINIC_INFO.socials.youtube,
    ],
  };
}

/** FAQPage schema for pages that render an FAQ accordion. */
export function faqPageSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function physiciansSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": doctorData.map((doctor) => ({
      "@type": "Physician",
      name: doctor.name,
      jobTitle: doctor.specialty,
      description: doctor.bio,
      ...(doctor.instagram ? { sameAs: [doctor.instagram] } : {}),
      url: `${CLINIC_INFO.siteUrl}/doctors`,
      medicalSpecialty: "Dermatology",
      worksFor: {
        "@type": "MedicalClinic",
        name: CLINIC_INFO.name,
        telephone: `+977${CLINIC_INFO.phoneRaw}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: CLINIC_INFO.addressStreet,
          addressLocality: CLINIC_INFO.addressLocality,
          addressCountry: CLINIC_INFO.addressCountry,
        },
      },
    })),
  };
}

/** BreadcrumbList schema for pages with a visible breadcrumb trail. */
export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${CLINIC_INFO.siteUrl}${crumb.url}`,
    })),
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.description,
    procedureType: "https://schema.org/TherapeuticProcedure",
    bodyLocation: service.category === "Hair Care" ? "Scalp" : "Skin",
    howPerformed: `In-clinic treatment at ${CLINIC_INFO.name}, ${CLINIC_INFO.address}. Typical session: ${service.duration}.`,
    provider: {
      "@type": "MedicalClinic",
      name: CLINIC_INFO.name,
      telephone: `+977${CLINIC_INFO.phoneRaw}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: CLINIC_INFO.addressStreet,
        addressLocality: CLINIC_INFO.addressLocality,
        addressCountry: CLINIC_INFO.addressCountry,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: CLINIC_INFO.geo.lat,
        longitude: CLINIC_INFO.geo.lng,
      },
    },
  };
}
