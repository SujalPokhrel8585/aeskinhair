import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  Microscope,
  Stethoscope,
  HeartHandshake,
} from "lucide-react";

export default function OurStory() {
  return (
    <section className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left: 2-3 Short Paragraphs */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Stethoscope className="size-4" /> Our Story &amp; Mission
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Crafting Confidence Through Medical Expertise in Samakhushi
            </h2>
          </div>

          {/* 3 Digestible Paragraphs */}
          <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
            <p>
              Founded at City Square Mall in the heart of Samakhushi,
              Kathmandu, AestheticEssence Skin &amp; Hair Clinic was born out of
              a dedication to bring ethical, world-class dermatological
              science and aesthetic care to Nepal in an atmosphere of serene,
              patient-centered comfort.
            </p>
            <p>
              Our mission is grounded in evidence-based medicine: we believe
              true skin health is achieved through thorough scientific
              diagnosis, FDA-approved technology, and custom-tailored regimens
              rather than one-size-fits-all fixes.
            </p>
            <p>
              Today, AestheticEssence specializes in advanced skin treatments -
              medical hydrafacials, PRP &amp; GFC regenerative therapy,
              personalized acne and scar correction, melasma control, laser
              procedures, and non-surgical facial rejuvenation - serving both
              local residents and international visitors with uncompromising
              standards.
            </p>
          </div>

          {/* Core Philosophy Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-xs">
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 font-bold">
                <ShieldCheck className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground">
                Medical Safety First
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Strict hospital sterilization &amp; NMC certified experts.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-xs">
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 font-bold">
                <Microscope className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground">
                Imported Technology
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                USA &amp; German engineered clinical devices.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-xs">
              <div className="size-8 rounded-xl bg-accent text-accent-foreground flex items-center justify-center mb-2 font-bold">
                <HeartHandshake className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground">
                Tailored Care
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Customized protocols for every unique skin tone.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Clinic Feature Visual Card */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-border bg-card">
            <div className="relative aspect-4/3 overflow-hidden">
              <img
                src="/clinic/front-desk.png"
                alt="Reception of AestheticEssence Skin & Hair Clinic, Samakhushi"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-1">
                  📍 City Square Mall, Samakhushi, Kathmandu
                </span>
                <h3 className="text-base font-bold">
                  AestheticEssence Skin &amp; Hair Clinic
                </h3>
                <p className="text-xs text-zinc-200">
                  Modern clinical ambiance built for relaxation and results.
                </p>
              </div>
            </div>

            <div className="p-5 bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary-foreground/20 text-primary-foreground flex items-center justify-center border border-primary-foreground/30">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary-foreground/70">
                    Open Sun - Fri
                  </p>
                  <p className="text-sm font-bold text-primary-foreground">
                    11:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
              <Link
                to="/contact"
                className="px-4 py-2 rounded-full bg-primary-foreground text-primary text-xs font-semibold hover:bg-primary-foreground/90 transition-colors inline-flex items-center gap-1"
              >
                <span>Visit Us</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
