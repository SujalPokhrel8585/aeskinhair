// Static doctor roster and filter categories for the doctors page.
// Only verified, real clinic doctors are listed here.

import type { Doctor } from "@/types";

export const doctorData: Doctor[] = [
  {
    id: 1,
    name: "Dr. Shraddha Chudal",
    specialty: "Consultant Dermatologist",
    category: "Clinical Dermatology",
    instagram: "https://www.instagram.com/dr.shraddhachudal",
    bio: "Consultant dermatologist managing general and clinical dermatology — acne, pigmentation and melasma, hair fall, and anti-aging care — with evidence-based, patient-first treatment plans.",
    imageUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Dr. Pramesh Koirala",
    specialty: "Consultant Dermatologist",
    category: "Aesthetic Dermatology",
    instagram: "https://www.instagram.com/drprameshkoirala",
    bio: "Consultant dermatologist focused on medical and aesthetic dermatology — laser treatments, PRP & GFC regenerative therapy, scar revision, and surgical dermatology.",
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600&auto=format&fit=crop",
  },
];

// use real images later

export const categoryData = ["Clinical Dermatology", "Aesthetic Dermatology"];
