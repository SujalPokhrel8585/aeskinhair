import { motion } from "motion/react";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HOME_FAQS } from "../data/homeFaqData";

// Generic clinic FAQ for the homepage (the per-treatment FAQs live on the
// service pages). Same accordion + semantic color tokens as the service FAQ
// sections, so dark mode, light mode and small screens all work for free.
export function HomeFAQ() {
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center md:px-8">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
          <HelpCircle className="size-3.5" />
          Frequently Asked Questions
        </span>

        <h2 className="text-3xl leading-tight font-semibold tracking-tight text-foreground md:text-4xl">
          Everything Patients Ask
          <br />
          Before Booking
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-left bg-card rounded-2xl border border-border shadow-xs px-6 sm:px-8"
        >
          <Accordion type="single" collapsible>
            {HOME_FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`home-faq-${i}`}>
                <AccordionTrigger>
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}