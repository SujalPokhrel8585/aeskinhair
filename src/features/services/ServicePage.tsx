import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Phone,
  ClipboardList,
  Stethoscope,
  Syringe,
  HeartHandshake,
} from "lucide-react";
import { SERVICES } from "@/services/servicesService";
import FAQSection from "./components/FAQSection";
import Seo from "@/components/seo/Seo";
import { serviceSeo, serviceSchema } from "@/constants/seo";
import { CLINIC_INFO } from "@/constants/clinic";
import { whatsappAnchorProps } from "@/lib/whatsapp";

// Generic 4-step treatment journey shown on every service page. This is
// deliberately non-clinical (no dosages/protocols), just the patient
// experience flow, since that detail isn't part of the services data.
const PROCESS_STEPS = [
  {
    icon: ClipboardList,
    title: "Consultation & Assessment",
    description:
      "We start with a one-on-one consultation to understand your goals and assess your skin or hair.",
  },
  {
    icon: Stethoscope,
    title: "Personalized Plan",
    description:
      "Your specialist designs a treatment plan tailored to your concerns, skin type, and desired outcome.",
  },
  {
    icon: Syringe,
    title: "In-Clinic Treatment",
    description:
      "The procedure is carried out by our board-certified team using the equipment listed for this service.",
  },
  {
    icon: HeartHandshake,
    title: "Aftercare & Follow-Up",
    description:
      "We share aftercare guidance and schedule any follow-up sessions needed to maintain your results.",
  },
];

export default function ServicePage() {
  const { id } = useParams<{ id: string }>();
  const service = SERVICES.find((s) => s.id === id);

  // ── Not found state ──
  if (!service) {
    return (
      <main id="main" className="page-gradient-bg w-full min-h-[80vh] flex items-center justify-center text-foreground px-4">
        <Seo
          title={`Treatment Not Found | ${CLINIC_INFO.name}`}
          description="The treatment page you are looking for could not be found. Browse all skin and hair treatments at our Samakhushi, Kathmandu clinic."
          path="/services"
        />
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Service not found
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            We couldn&apos;t find a treatment matching that link. It may have
            been renamed or removed.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to All Services
          </Link>
        </div>
      </main>
    );
  }

  const Icon = service.icon;
  const bookHref = `/book?service=${service.id}`;
  const whatsappProps = whatsappAnchorProps(
    CLINIC_INFO.whatsappNumber,
    `Hi AestheticEssence Clinic, I'm not sure which treatment is right for me. Can you help?`,
  );
  const related = SERVICES.filter(
    (s) => s.id !== service.id && s.category === service.category,
  )
    .concat(
      SERVICES.filter(
        (s) => s.id !== service.id && s.category !== service.category,
      ),
    )
    .slice(0, 3);

  return (
    <main id="main" className="page-gradient-bg w-full text-foreground overflow-hidden relative">
      <Seo {...serviceSeo(service)} jsonLd={[serviceSchema(service)]} />
      {/* Ambient Background Glow Blobs */}
      <div className="ambient-blobs-container">
        <div className="ambient-blob ambient-blob-sky-lg" />
        <div className="ambient-blob ambient-blob-blue-md" />
        <div className="ambient-blob ambient-blob-rose-md" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-12 md:pb-24">
        {/* Back link */}
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" /> Back to All Services
        </Link>

        {/* HERO, image + key facts */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-14"
        >
          {/* Image */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-border shadow-lg shadow-black/5 min-h-[280px]">
            <img
              src={service.image}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-card/95 text-foreground text-[11px] font-bold shadow-xs border border-border">
                {service.category}
              </span>
              {service.badge && (
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold">
                  {service.badge}
                </span>
              )}
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white text-xs font-semibold">
              <Clock className="size-3.5" />
              {service.duration}
            </div>
            {service.price && (
              <div className="absolute bottom-4 right-4 text-white text-xs font-semibold">
                {service.price}
              </div>
            )}
          </div>

          {/* Key facts */}
          <div className="lg:col-span-7 bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-lg shadow-black/5 flex flex-col justify-center">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-xs mb-5">
              <Icon className="size-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
              {service.title}
            </h1>
            <p className="text-sm font-semibold text-primary mb-4">
              {service.tagline}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              {service.description}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to={bookHref}
                className="book-cta-pulse inline-flex w-full items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-colors sm:w-auto"
              >
                Book This Treatment
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="tel:9767648659"
                className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 rounded-full bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm border border-border transition-colors sm:w-auto"
              >
                <Phone className="size-4 text-accent-foreground" />
                +977 976-7648659
              </a>
              <a
                {...whatsappProps}
                className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-border transition-colors text-foreground hover:border-ring sm:w-auto"
              >
                Not sure which treatment? Chat with us
              </a>
            </div>
          </div>
        </motion.section>

        {/* KEY BENEFITS */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
            What to Expect
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-card rounded-2xl p-5 border border-border shadow-xs"
              >
                <div className="size-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0 border border-border">
                  <CheckCircle2 className="size-4.5" />
                </div>
                <span className="text-sm text-foreground leading-relaxed pt-1">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* TREATMENT JOURNEY */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
            Your Treatment Journey
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={i}
                  className="relative bg-card rounded-2xl p-5 border border-border shadow-xs"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                      <StepIcon className="size-4.5" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* RELATED SERVICES */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => {
                const RIcon = r.icon;
                return (
                  <Link
                    key={r.id}
                    to={`/services/${r.id}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border shadow-xs hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                          <RIcon className="size-3.5" />
                        </div>
                        <h3 className="text-sm font-bold text-foreground">
                          {r.title}
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                        View Details
                        <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* FREQUENTLY ASKED QUESTIONS */}
        <FAQSection serviceId={service.id} />

        {/* BOTTOM CTA STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="cta-card rounded-3xl bg-primary text-primary-foreground p-8 sm:p-12 relative overflow-hidden shadow-xl"
        >
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground text-xs font-semibold uppercase tracking-wider mb-2">
                <CheckCircle2 className="size-3.5" />
                Consultation with Doctors
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-foreground">
                Ready to book your {service.title.toLowerCase()}?
              </h2>
              <p className="mt-1 text-sm text-primary-foreground/60 max-w-lg">
                Talk to our doctors about your goals, and we&apos;ll confirm
                this treatment is the right fit before you book.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to={bookHref}
                className="book-cta-pulse px-6 py-3 rounded-full bg-primary-foreground text-primary font-bold text-sm hover:bg-primary-foreground/90 transition-colors inline-flex items-center gap-2 justify-center whitespace-nowrap"
              >
                <CheckCircle2 className="size-4 text-primary" />
                Book This Treatment
              </Link>
              <a
                {...whatsappProps}
                className="px-6 py-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground font-semibold text-sm border border-primary-foreground/20 backdrop-blur-xs transition-all inline-flex items-center gap-2 justify-center whitespace-nowrap"
              >
                Chat With Us on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
