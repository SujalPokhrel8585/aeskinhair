import {
  Award,
  Users,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import { CLINIC_INFO } from "@/constants";
import { DOCTOR_TEAM } from "@/features/about/data";

const STATS = [
  { icon: Clock, value: "10+ Years", label: "Clinical Experience" },
  { icon: Users, value: "100+", label: "Patients Treated" },
  { icon: Award, value: "2", label: "Specialist Dermatologists" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-muted relative overflow-hidden" id="about">
      <div className="w-full px-4 lg:px-12 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-soft-badge mb-3 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground shadow-sm">
            Why Choose AestheticEssence
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Expert Care Rooted in Science & Trust
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Led by specialist dermatologists in Samakhushi, Kathmandu, combining
            cutting-edge technology with personalized medical treatments.
          </p>
        </div>

        {/* Main Grid: Doctor Profile + Proof of Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Doctor Bio Card (Authority Builder) - both dermatologists */}
          <div className="lg:col-span-7 bg-card rounded-3xl p-8 shadow-sm border border-border flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-accent-foreground uppercase tracking-wider">
                Consultant Dermatologists
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start mt-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-inner">
                    <img
                      src={DOCTOR_TEAM[0].image}
                      alt="Dr. Shraddha Chudal"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Dr. Shraddha Chudal
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      MBBS, MD (Dermatology & Venereology)
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-accent-foreground" />
                      <span>NMC Registered Specialist</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-inner">
                    <img
                      src={DOCTOR_TEAM[1].image}
                      alt="Dr. Pramesh Koirala"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Dr. Pramesh Koirala
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      MBBS, MD (Dermatology & Venereology)
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-accent-foreground" />
                      <span>NMC Registered Specialist</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Dr. Shraddha Chudal and Dr. Pramesh Koirala are our consultant
                dermatologists for medical and cosmetic dermatology - from acne
                and pigmentation care to HydraFacial, chemical peels, PRP & GFC
                therapy, and anti-aging treatments tailored to Nepali skin.
              </p>

              {/* Highlights Checklist */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-sm text-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                  <span>Regenerative PRP & GFC Therapy</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                  <span>Medical HydraFacial Protocols</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                  <span>Customized Acne & Scar Healing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                  <span>Pigmentation & Anti-Aging Care</span>
                </li>
              </ul>
            </div>

            {/* Trust Metrics Bar inside card */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              {STATS.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-foreground font-bold text-lg">
                      <Icon className="h-4 w-4 text-muted-foreground hidden sm:inline-block" />
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Patient Story Card (Proof of Results) */}
          <div className="lg:col-span-5 bg-card text-card-foreground rounded-3xl p-8 shadow-sm flex flex-col justify-between relative overflow-hidden border border-primary/40">
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Patient Stories
                  </span>
                  <h3 className="text-xl font-bold mt-1">
                    Acne & Pigmentation Care
                  </h3>
                </div>
                <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                  Real Results
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-video mb-6 border border-border">
                <img
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop"
                  alt="Glowing skin after dermatology treatment"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Our patients come to us for stubborn acne, melasma and hair
                fall. With careful diagnosis and multi-session plans designed
                by our dermatologists, clearer skin and visible steady
                improvement follow.
              </p>
            </div>

            <a
              href={CLINIC_INFO.socials.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium transition-colors hover:bg-primary/90"
            >
              <span>Book Consultation with Our Doctors</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
