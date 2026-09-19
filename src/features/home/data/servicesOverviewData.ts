// Home page services overview cards shown in the services section.

import {
  Sparkles,
  Zap,
  ShieldCheck,
  UserCheck,
  Activity,
  Sun,
} from "lucide-react";
import type { ServiceItem } from "@/types";

export const SERVICES_OVERVIEW: ServiceItem[] = [
  {
    id: "hydrafacial",
    title: "HydraFacial",
    valueProp: "Deep Cleanse, Extract & Hydrate Instantly",
    icon: Sparkles,
    featured: false,
    badge: "Most Popular",
  },
  {
    id: "laser-hair-removal",
    title: "Laser Hair Reduction",
    valueProp: "Long-Lasting Smoothness with Advanced Tech",
    icon: Zap,
  },
  {
    id: "botox",
    title: "Aesthetic Injections",
    valueProp: "Botox & Fillers - Smooth & Restore Contour",
    icon: ShieldCheck,
  },
  {
    id: "prp",
    title: "PRP & GFC",
    valueProp: "Regenerative Care for Face & Hair",
    icon: UserCheck,
    featured: false,
  },
  {
    id: "acne-treatment",
    title: "Acne Treatment",
    valueProp: "Target Breakouts & Clear Skin Blemishes",
    icon: Activity,
  },
  {
    id: "melasma",
    title: "Melasma",
    valueProp: "Even Out Pigmentation & Brighten Tone",
    icon: Sun,
  },
];
