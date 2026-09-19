// Static gallery image data for the gallery feature page.
import type { GalleryItem } from "@/types";

export type { GalleryItem };

/**
 * ============================================================================
 * HOW TO ADD MORE IMAGES:
 * ----------------------------------------------------------------------------
 * 1. Simply add a new object to the `GALLERY_ITEMS` array below.
 * 2. You can use external URLs (Unsplash, Cloudinary, AWS S3, etc.)
 *    OR local images from your project:
 *    Example:
 *      import myPhoto from "@/assets/my-photo.jpg";
 *      ...
 *      {
 *        id: "unique-id-13",
 *        src: myPhoto, // or "https://..."
 *        title: "Treatment Name",
 *        subtitle: "Short description of the result",
 *        category: "Skin Rejuvenation", // "Skin Rejuvenation" | "Hair Care" | "Aesthetics" | "Clinical"
 *        year: "2026"
 *      }
 * ============================================================================
 */

export const GALLERY_ITEMS: GalleryItem[] = [
  // --- Hero U-Shape Feature Cards (First 7 items) ---
  {
    id: "ae-01",
    src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop",
    title: "Expert Hands at Work",
    subtitle: "Our dermatologist performing a supervised procedure",
    category: "Clinical",
    year: "2026",
    aspectRatio: "portrait",
    featured: true,
  },
  {
    id: "ae-02",
    src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    title: "HydraFacial Therapy",
    subtitle: "Deep-cleansing, hydrating care for an instant glow",
    category: "Skin Rejuvenation",
    year: "2026",
    aspectRatio: "square",
  },
  {
    id: "ae-03",
    src: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop",
    title: "Precision Laser Technology",
    subtitle: "Targeted laser energy for stubborn skin concerns",
    category: "Aesthetics",
    year: "2026",
    aspectRatio: "tall",
    featured: true,
  },
  {
    id: "ae-04",
    src: "/services/co2-laser.webp",
    title: "Safe, Supervised Laser Care",
    subtitle: "Protective eyewear and strict protocols at every step",
    category: "Clinical",
    year: "2026",
    aspectRatio: "portrait",
  },
  {
    id: "ae-05",
    src: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    title: "Ultrasonic Deep-Cleansing Facial",
    subtitle: "Sonic scrubber technology lifting impurities from pores",
    category: "Skin Rejuvenation",
    year: "2026",
    aspectRatio: "tall",
    featured: true,
  },
  {
    id: "ae-06",
    src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    title: "Comfortable Laser Sessions",
    subtitle: "Patients relax while our trained team handles the tech",
    category: "Aesthetics",
    year: "2026",
    aspectRatio: "portrait",
  },
  {
    id: "ae-07",
    src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    title: "Dermatologist-Led Treatments",
    subtitle: "Medical-grade lasers operated by experienced specialists",
    category: "Clinical",
    year: "2026",
    aspectRatio: "square",
  },

  // --- Row 2 & Extended Works (Auto-rendered in dynamic rows below Hero) ---
  {
    id: "ae-08",
    src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=800&auto=format&fit=crop",
    title: "Regenerative Hair Treatments",
    subtitle: "PRP & GFC therapy boosting natural hair density",
    category: "Hair Care",
    year: "2026",
    aspectRatio: "portrait",
  },
  {
    id: "ae-09",
    src: "/services/laser-hair-removal.webp",
    title: "Laser Hair Removal",
    subtitle: "Long-term reduction, safe for all skin tones",
    category: "Aesthetics",
    year: "2026",
    aspectRatio: "portrait",
  },
  {
    id: "ae-10",
    src: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop",
    title: "Fractional Acne & Scar Laser",
    subtitle: "Resurfacing treatment for clearer, smoother skin",
    category: "Clinical",
    year: "2025",
    aspectRatio: "landscape",
  },
  {
    id: "ae-11",
    src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    title: "LED Light Therapy",
    subtitle: "Red-light phototherapy to calm and rejuvenate skin",
    category: "Skin Rejuvenation",
    year: "2026",
    aspectRatio: "landscape",
  },
  {
    id: "ae-12",
    src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=800&auto=format&fit=crop",
    title: "Regenerative Hair Treatments",
    subtitle: "Targeted hairline care to restore natural density",
    category: "Hair Care",
    year: "2026",
    aspectRatio: "landscape",
  },
  {
    id: "ae-13",
    src: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop",
    title: "Facial Rejuvenation",
    subtitle: "Nourishing medical facials tailored to your skin",
    category: "Skin Rejuvenation",
    year: "2025",
    aspectRatio: "portrait",
  },
  {
    id: "ae-14",
    src: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    title: "Chemical Peeling Session",
    subtitle: "Medical-grade peels renewing texture and tone",
    category: "Skin Rejuvenation",
    year: "2026",
    aspectRatio: "portrait",
  },
  {
    id: "ae-15",
    src: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop",
    title: "Microneedling",
    subtitle: "Collagen-induction therapy for smoother skin",
    category: "Aesthetics",
    year: "2026",
    aspectRatio: "landscape",
  },
];
