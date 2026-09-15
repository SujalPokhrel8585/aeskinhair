// Generic, clinic-level FAQ for the homepage (the per-treatment FAQs live in
// src/features/services/data/faqData.ts). Same FaqItem shape so the FAQPage
// JSON-LD builder and the accordion component can share it.
import type { FaqItem } from "@/features/services/data/faqData";
import { CLINIC_INFO } from "@/constants/clinic";

export const HOME_FAQS: FaqItem[] = [
  {
    question: "How do I book an appointment",
    answer:
      "The fastest way is WhatsApp — send us a message or use the booking form on this website and our front desk will confirm your slot, usually within a few hours. You can also call us during clinic hours to book by phone.",
  },
  {
    question: "Do I need a consultation before getting a treatment",
    answer:
      "Yes. Every treatment starts with a dermatologist consultation so your skin or scalp condition is properly assessed first. The doctor then recommends the right procedure, session count and home-care routine for you — never the other way around.",
  },
  {
    question: "How much do treatments cost",
    answer:
      "Prices vary by procedure and the areas treated — for example, HydraFacial sessions typically start from around NPR 2,500 while laser hair reduction is priced per body area. Your dermatologist confirms the exact cost and treatment plan during consultation, with no hidden charges.",
  },
  {
    question: "Where are you located and when are you open",
    answer: `${CLINIC_INFO.address} We are open ${CLINIC_INFO.businessHours.replace(" (Sun–Fri)", "")}, Sunday to Friday. The clinic is closed on Saturdays.`,
  },
  {
    question: "How quickly will you reply on WhatsApp",
    answer:
      "We typically respond within a few hours, and always within 24 hours. If you message us outside clinic hours, we will get back to you first thing the next working day.",
  },
  {
    question: "Do you treat men and teenagers too",
    answer:
      "Yes. Our dermatologists treat patients of all ages and skin types — acne and acne scars in teenagers, hair loss in men, pigmentation and anti-aging care for adults. Treatments are always tailored to the individual after assessment.",
  },
];