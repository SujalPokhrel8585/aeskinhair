import { Link } from "react-router-dom";
import { Users, ArrowRight, ArrowUpRight, AtSign } from "lucide-react";
import { DOCTOR_TEAM } from "@/features/about/data/index";

export default function DoctorTeam() {
  return (
    <section className="relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card/90 border border-border text-accent-foreground text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Users className="size-3.5 text-accent-foreground" />
            <span>Specialist Medical Team</span>
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Led by NMC-Registered Specialists
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
            Consultant dermatologists collaborating for your complete skin and
            hair care.
          </p>
        </div>

        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 shadow-sm self-start md:self-auto"
        >
          <span>Consult Our Doctors</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {DOCTOR_TEAM.map((doctor, idx) => (
          <div
            key={idx}
            className="bg-card rounded-3xl overflow-hidden border border-border shadow-md shadow-zinc-900/5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Photo with Overlay Badge */}
              <div className="relative aspect-4/3 overflow-hidden bg-muted">
                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex w-full h-full items-center justify-center bg-gradient-to-br from-primary to-[#7a5c0a]">
                    <span className="text-5xl font-bold tracking-wide text-white">
                      {doctor.name
                        .replace("Dr. ", "")
                        .split(" ")
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-card/95 text-accent-foreground text-[10px] font-bold shadow-xs border border-border">
                    {doctor.reg}
                  </span>
                </div>
                {doctor.instagram && (
                  <a
                    href={doctor.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${doctor.name} on Instagram`}
                    className="absolute top-3 right-3 size-8 rounded-full bg-card/95 border border-border text-foreground flex items-center justify-center shadow-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <AtSign className="size-4" />
                  </a>
                )}
              </div>

              <div className="p-6">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-1">
                  {doctor.role}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {doctor.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium mb-3">
                  {doctor.qualifications}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  {doctor.bio}
                </p>

                {/* Specialties Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {doctor.specialties.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <Link
                to={`/book?doctor=${encodeURIComponent(doctor.name)}`}
                className="w-full py-2.5 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Book with Dr. {doctor.name.split(" ")[1]}</span>
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom link to full team / consultation */}
      <div className="mt-8 p-4 rounded-2xl bg-card/80 border border-border text-center flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto shadow-xs">
        <div className="flex items-center gap-3 text-left">
          <div className="size-10 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Users className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">
              Looking to meet our full clinical team?
            </h4>
            <p className="text-xs text-muted-foreground">
              Have questions about a treatment or availability? Our front desk
              will be happy to help you plan your visit.
            </p>
          </div>
        </div>
        <Link
          to="/contact"
          className="px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold whitespace-nowrap transition-colors"
        >
          Contact Team
        </Link>
      </div>
    </section>
  );
}
