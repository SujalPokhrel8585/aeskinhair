// Data for the "Why Patients Choose AestheticEssence" section on the About page.

import { Activity, Sparkles, ShieldCheck, Award, type LucideIcon } from "lucide-react";

export interface WhyChooseUsPoint {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  badgeColor: string;
}

export const WHY_CHOOSE_US_POINTS: WhyChooseUsPoint[] = [
  {
    icon: Activity,
    title: "Regenerative PRP & GFC Therapy",
    tagline: "Natural Growth Factors for Hair & Skin",
    description:
      "Our regenerative protocols use your own platelet-rich plasma and growth factor concentrate to stimulate hair follicles, slow hair loss and rejuvenate facial skin - a safe, natural option guided by our dermatologists with attentive aftercare.",
    badge: "Regenerative Care",
    badgeColor: "bg-accent text-accent-foreground border-border",
  },
  {
    icon: Sparkles,
    title: "Medical HydraFacial Protocols",
    tagline: "Deep Cellular Cleansing & Instant Glow",
    description:
      "Using authentic patented vortex-fusion technology, our medical hydrafacial treatments deep-cleanse congested pores, extract stubborn impurities, and infuse medical-grade peptides and antioxidants. Experience instantaneous hydration, smoothed texture, and radiant skin with zero downtime.",
    badge: "Clinical Aesthetics",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: ShieldCheck,
    title: "Customized Acne & Scar Healing",
    tagline: "Targeted Multi-Modal Dermatological Regimens",
    description:
      "No two skin types are identical. We create tailored clinical pathways combining prescription topical regimens, chemical peels, subcision, and fractional laser resurfacing to clear active breakouts and repair deep atrophic acne scars at the root dermal layer.",
    badge: "Evidence-Based",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: Award,
    title: "Anti-Aging & Botox Treatments",
    tagline: "Subtle, Youthful Balance with Natural Expressions",
    description:
      "Our anti-aging therapies prioritize delicate facial balance that honors your unique bone structure. Using US-FDA approved neuromodulators and premium dermal fillers, we soften fine lines, restore lost volume, and lift facial contours while preserving natural emotional expressions.",
    badge: "FDA-Approved Protocols",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
  },
];
