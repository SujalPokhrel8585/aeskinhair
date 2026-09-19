import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Star,
  Phone,
  Search,
  X,
} from "lucide-react";
import { SERVICES } from "@/services/servicesService";
import { GOOGLE_REVIEWS_URL } from "@/features/home/data/testimonialsData";
import { CLINIC_INFO } from "@/constants";
import Seo from "@/components/seo/Seo";
import { seoForPath, breadcrumbSchema } from "@/constants/seo";

// ── Group definitions (matches your navbar) ──
const GROUPS = [
  { id: "all", label: "All Services" },
  { id: "facial", label: "Facial" },
  { id: "hair", label: "Hair" },
  { id: "skin", label: "Skin" },
  { id: "anti-aging", label: "Anti-Aging" },
] as const;

type GroupId = (typeof GROUPS)[number]["id"];

export default function ServicesIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL so /services?group=hair works from navbar
  const initialGroup = (searchParams.get("group") as GroupId) || "all";
  const [activeGroup, setActiveGroup] = useState<GroupId>(
    GROUPS.some((g) => g.id === initialGroup) ? initialGroup : "all",
  );
  const [query, setQuery] = useState("");

  // Keep URL in sync when group changes
  useEffect(() => {
    if (activeGroup === "all") {
      searchParams.delete("group");
    } else {
      searchParams.set("group", activeGroup);
    }
    setSearchParams(searchParams, { replace: true });
  }, [activeGroup]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtered list
  const filtered = useMemo(() => {
    return SERVICES.filter((s) => {
      const matchesGroup =
        activeGroup === "all" ? true : s.navId === activeGroup;

      const q = query.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.benefits.some((b) => b.toLowerCase().includes(q));

      return matchesGroup && matchesSearch;
    });
  }, [activeGroup, query]);

  function handleGroupClick(id: GroupId) {
    setActiveGroup(id);
  }

  function clearFilters() {
    setActiveGroup("all");
    setQuery("");
  }

  return (
    <main id="main" className="page-gradient-bg w-full text-foreground overflow-hidden relative">
      <Seo
        {...seoForPath("/services")}
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
          ]),
        ]}
      />
      {/* Breadcrumb (visible + BreadcrumbList JSON-LD for search engines) */}
      <nav
        aria-label="Breadcrumb"
        className="px-4 pt-6 text-sm text-muted-foreground sm:px-6 lg:px-8"
      >
        <ol className="mx-auto flex max-w-4xl items-center gap-2">
          <li>
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            Services
          </li>
        </ol>
      </nav>
      {/* Ambient glows */}
      <div className="ambient-blobs-container">
        <div className="ambient-blob ambient-blob-sky-lg" />
        <div className="ambient-blob ambient-blob-blue-md" />
        <div className="ambient-blob ambient-blob-rose-md" />
      </div>

      {/* HERO */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/90 border border-border text-primary text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Medical-Grade Aesthetic Treatments</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-4"
          >
            Our Clinical Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed max-w-3xl mx-auto"
          >
            Evidence-based dermatology and aesthetic care delivered by
            board-certified specialists at our Samakhushi, Kathmandu clinic.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" />
              NMC Registered Specialists
            </span>
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Star className="size-4 text-amber-400 fill-amber-400" />
              4.9/5 Patient Rating
            </a>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" />
              FDA-Approved Technology
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" />
              100+ Patients Treated
            </span>
          </motion.div>
        </div>
      </section>

      {/* FILTERS + SEARCH */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Group pills */}
          <div className="flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <button
                key={g.id}
                onClick={() => handleGroupClick(g.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  activeGroup === g.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-foreground border-border hover:border-ring hover:bg-muted"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search treatments"
              placeholder="Search treatments..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring placeholder:text-muted-foreground"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Active filter summary */}
        {(activeGroup !== "all" || query) && (
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              Showing {filtered.length} of {SERVICES.length} services
            </span>
            <button
              onClick={clearFilters}
              className="text-primary hover:text-primary font-medium underline-offset-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* SERVICES GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-semibold text-foreground mb-2">
              No services found
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Try a different group or search term.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
            >
              Show all services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className={`group relative rounded-3xl overflow-hidden border shadow-md shadow-black/5 hover:shadow-xl transition-all duration-300 flex flex-col ${
                      service.featured
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border"
                    }`}
                  >
                    {/* Photo */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div
                        className={`absolute inset-0 ${
                          service.featured
                            ? "bg-gradient-to-t from-zinc-900/90 via-zinc-900/30 to-transparent"
                            : "bg-gradient-to-t from-zinc-950/50 via-transparent to-transparent"
                        }`}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-card/95 text-foreground text-[10px] font-bold shadow-xs border border-border">
                          {service.category}
                        </span>
                      </div>
                      {service.badge && (
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              service.featured
                                ? "bg-primary/40 text-primary-foreground border-primary/50"
                                : "bg-primary/10 text-primary border-primary/20"
                            }`}
                          >
                            {service.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`size-10 rounded-2xl flex items-center justify-center border transition-colors duration-300 ${
                            service.featured
                              ? "bg-primary/15 text-primary border-primary/30 group-hover:bg-primary group-hover:text-white"
                              : "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-white"
                          }`}
                        >
                          <Icon className="size-5" />
                        </div>
                        <span
                          className={`flex items-center gap-1 text-[11px] font-semibold ${
                            service.featured
                              ? "text-primary-foreground/60"
                              : "text-muted-foreground"
                          }`}
                        >
                          <Clock className="size-3" />
                          {service.duration}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold tracking-tight mb-1">
                        {service.title}
                      </h2>
                      <p
                        className={`text-xs font-semibold mb-3 ${
                          service.featured
                            ? "text-secondary-foreground"
                            : "text-primary"
                        }`}
                      >
                        {service.tagline}
                      </p>
                      <p
                        className={`text-sm leading-relaxed mb-4 flex-grow ${
                          service.featured
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {service.description}
                      </p>

                      <ul className="space-y-1.5 mb-5">
                        {service.benefits.map((b, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-xs"
                          >
                            <CheckCircle2
                              className={`size-3.5 shrink-0 ${
                                service.featured
                                  ? "text-primary-foreground"
                                  : "text-primary"
                              }`}
                            />
                            <span
                              className={
                                service.featured
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }
                            >
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Booking CTA (pre-fills the service in /book) +
                          details link, stacked so the labels never wrap */}
                      <div className="mt-auto grid grid-cols-1 gap-2.5 pt-1">
                        <Link
                          to={`/book?service=${service.id}`}
                          className={`book-cta-pulse inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-semibold text-sm transition-all duration-200 border ${
                            service.featured
                              ? "bg-primary-foreground text-primary border-transparent hover:bg-primary-foreground/90"
                              : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                          }`}
                        >
                          <CalendarCheck className="size-4 shrink-0" />
                          <span>Book This Treatment</span>
                        </Link>
                        <Link
                          to={`/services/${service.id}`}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-semibold text-sm transition-all duration-200 border ${
                            service.featured
                              ? "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                              : "border-border bg-card text-foreground hover:bg-muted"
                          }`}
                        >
                          <span>View Details</span>
                          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* BOTTOM CTA (same as before) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="cta-card mt-16 rounded-3xl bg-primary text-primary-foreground p-8 sm:p-12 relative overflow-hidden shadow-xl"
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
                Not sure which treatment is right for you?
              </h2>
              <p className="mt-1 text-sm text-primary-foreground/60 max-w-lg">
                Book a personalized consultation with our doctors. We&apos;ll
                assess your skin or hair goals and recommend the ideal
                clinical pathway.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/book"
                className="px-6 py-3 rounded-full bg-primary-foreground text-primary font-bold text-sm hover:bg-primary-foreground/90 transition-colors inline-flex items-center gap-2 justify-center whitespace-nowrap"
              >
                <CheckCircle2 className="size-4 text-primary" />
                Book Consultation
              </Link>
              <a
                href={`tel:${CLINIC_INFO.phoneTel}`}
                className="px-6 py-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground font-semibold text-sm border border-primary-foreground/20 backdrop-blur-xs transition-all inline-flex items-center gap-2 justify-center whitespace-nowrap"
              >
                <Phone className="size-4 text-primary-foreground" />
                +977 976-7648659
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
