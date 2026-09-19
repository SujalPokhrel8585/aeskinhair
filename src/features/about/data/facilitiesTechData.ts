// Data for the "World-Class Clinical Equipment & Suites" section on the About page.

export interface FacilityTechItem {
  title: string;
  specs: string;
  caption: string;
  image: string;
  category: string;
}

export const FACILITIES_TECH: FacilityTechItem[] = [
  {
    title: "CO2 Fractional Laser",
    specs: "Edge Systems / Lumenis, Imported from USA",
    caption:
      "High-precision micro-ablative laser technology engineered for deep acne scar revision, collagen remodeling, and comprehensive skin texture resurfacing.",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
    category: "Laser Surgery",
  },
  {
    title: "HydraFacial Elite MD",
    specs: "Syndeo System, Imported from USA",
    caption:
      "Authentic medical-grade vortex-infusion device that gently exfoliates, cleanses pores, and delivers targeted nutrient serums deep into dermal layers.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    category: "Facial Aesthetics",
  },
  {
    title: "FotoFinder Trichovision",
    specs: "FotoFinder Systems, Imported from Germany",
    caption:
      "Digital epiluminescence dermatoscopic imaging for microscopic scalp analysis, follicular density calculation, and precision hair-care planning.",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
    category: "Trichology Diagnostics",
  },
  {
    title: "Q-Switched Nd:YAG Laser Unit",
    specs: "Lutronic Spectra, Imported from South Korea",
    caption:
      "Dual-wavelength photoacoustic laser engineered for targeted melasma shattering, stubborn hyperpigmentation removal, and skin rejuvenation.",
    image:
      "https://images.unsplash.com/photo-1583912267670-6575ad472688?q=80&w=800&auto=format&fit=crop",
    category: "Pigmentation Care",
  },
  {
    title: "Sterile Minor Surgical Suite",
    specs: "HEPA Filtration & Medical Sterilization",
    caption:
      "Strict hospital-grade sterilized environment designed specifically for seamless, infection-free minor dermatological procedures.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
    category: "Clinical Facility",
  },
  {
    title: "Private Consultation Suites",
    specs: "Confidential, Calm & Modern Ambiance",
    caption:
      "Dedicated one-on-one diagnostic lounges where doctor and patient explore tailored treatment goals in absolute comfort and discretion.",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop",
    category: "Patient Comfort",
  },
];
