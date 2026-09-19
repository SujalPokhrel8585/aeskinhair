// bookingpage

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react"
import Seo from "@/components/seo/Seo";
import { seoForPath } from "@/constants/seo";
import { WHATSAPP_NUMBER, CLINIC_INFO } from "@/constants";
import { openWhatsApp } from "@/lib/whatsapp";
import {
  CLINIC_OPEN_HOUR,
  CLINIC_CLOSE_HOUR,
  formatHour12,
} from "@/lib/clinicStatus";
import { doctorData } from "@/features/doctors/data/doctorsData";
import { SERVICES as ALL_SERVICES } from "@/services/servicesService";
import {
  Calendar,
  Clock,
  Phone,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Stethoscope,
} from "lucide-react";

// ── Services (real treatment pages + consultation fallback) ──
const SERVICES = [
  ...ALL_SERVICES.map((s) => s.title),
  "General Consultation",
  "Other",
];

// Maps /book?service=<service id> onto the dropdown labels above.
const SERVICE_TITLE_BY_ID = new Map(ALL_SERVICES.map((s) => [s.id, s.title]));

// ── Doctors (real clinic roster) ──
const DOCTORS = ["Any available doctor", ...doctorData.map((d) => d.name)];

interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  preferredDoctor: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

const INITIAL_FORM: BookingFormData = {
  name: "",
  phone: "",
  email: "",
  service: "",
  preferredDoctor: "Any available doctor",
  preferredDate: "",
  preferredTime: "",
  notes: "",
};

// ── Clinic hours (single source: src/lib/clinicStatus.ts) ──
const OPEN_TIME = `${String(CLINIC_OPEN_HOUR).padStart(2, "0")}:00`; // "11:00"
const CLOSE_TIME = `${String(CLINIC_CLOSE_HOUR).padStart(2, "0")}:00`; // "18:00"
const HOURS_LABEL = `${formatHour12(CLINIC_OPEN_HOUR)} – ${formatHour12(CLINIC_CLOSE_HOUR)}`;

// ── Validation ──
const validators: Record<string, (v: string) => string> = {
  name: (v) => {
    const trimmed = v.trim();
    const nameCharacterCheck = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!trimmed) return "Your name is required.";
    if (/^[0-9]/.test(trimmed)) return "Name cannot start with a number.";
    if (!nameCharacterCheck.test(trimmed))
      return "Please enter a valid name (e.g. Sujal Pokherel).";
    return "";
  },
  phone: (v) => {
    if (!v.trim()) return "Phone / WhatsApp number is required.";
    const digits = v.replace(/\D/g, "");
    if (digits.length < 9) return "Please enter a valid phone number.";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(v.trim()))
      return "Please enter a valid email address.";
    return "";
  },
  service: (v) => (!v ? "Please select a service." : ""),
  preferredDoctor: () => "", // optional
  preferredDate: (v) => {
    if (!v) return "Preferred date is required.";
    const selected = new Date(v);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) return "Please choose a future date.";
    return "";
  },
  preferredTime: (v) => {
    if (!v) return ""; // optional — but if given, must be within clinic hours
    const [h, m] = v.split(":").map(Number);
    const minutes = h * 60 + m;
    if (
      Number.isNaN(minutes) ||
      minutes < CLINIC_OPEN_HOUR * 60 ||
      minutes > CLINIC_CLOSE_HOUR * 60
    ) {
      return `Clinic hours are ${HOURS_LABEL} (Sun–Fri). Please pick a time within them.`;
    }
    return "";
  },
  notes: () => "",
};

function buildWhatsAppMessage(form: BookingFormData): string {
  const lines = [
    `New Appointment Request – AestheticEssence Clinic`,
    ``,
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    form.email ? `Email: ${form.email}` : null,
    `Service: ${form.service}`,
    `Preferred Doctor: ${form.preferredDoctor}`,
    `Preferred Date: ${form.preferredDate}`,
    form.preferredTime ? `Preferred Time: ${form.preferredTime}` : null,
    ``,
    form.notes ? `Notes:\n${form.notes}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export default function BookAppointmentPage() {
  const [searchParams] = useSearchParams();
  const preselectedService = useMemo(() => {
    const key = searchParams.get("service");
    if (!key) return "";
    // Accept both service ids ("hydrafacial") and titles ("HydraFacial").
    return SERVICE_TITLE_BY_ID.get(key) ?? (SERVICES.includes(key) ? key : "");
  }, [searchParams]);

  const preselectedDoctor = useMemo(() => {
    const doctor = searchParams.get("doctor");
    return doctor && DOCTORS.includes(doctor)
      ? doctor
      : "Any available doctor";
  }, [searchParams]);

  const [form, setForm] = useState<BookingFormData>({
    ...INITIAL_FORM,
    service: preselectedService,
    preferredDoctor: preselectedDoctor,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);

  // Deep links (/book?doctor=… / /book?service=…) pre-select a doctor or
  // service: scroll straight to the form on load so the pre-selected field
  // is in view (mobile included). Plain /book loads normally from the top.
  const formRef = useRef<HTMLDivElement>(null);
  const hasPreset =
    Boolean(preselectedService) ||
    preselectedDoctor !== "Any available doctor";
  useEffect(() => {
    if (!hasPreset) return;
    const id = window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
    return () => window.clearTimeout(id);
  }, [hasPreset]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
  }

  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    },
    [],
  );

  function getError(field: string): string {
    return (
      validators[field]?.(form[field as keyof BookingFormData] || "") || ""
    );
  }

  const allValid = [
    "name",
    "phone",
    "service",
    "preferredDate",
    "preferredTime",
  ].every((k) => !getError(k));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const allTouched: Record<string, boolean> = {};
    [
      "name",
      "phone",
      "service",
      "preferredDate",
      "preferredTime",
      "email",
    ].forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);

    if (!allValid) {
      setFormError("Please fix the errors below before submitting.");
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 450));

    const waMessage = buildWhatsAppMessage(form);
    openWhatsApp(WHATSAPP_NUMBER, waMessage);

    setSubmitting(false);
    setSent(true);
    setForm(INITIAL_FORM);
    setTouched({});
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <main id="main" className="page-gradient-bg-alt w-full min-h-[92vh] text-foreground overflow-hidden relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <Seo {...seoForPath("/book")} />
      {/* Ambient glow */}
      <div className="ambient-blobs-container">
        <div className="ambient-blob ambient-blob-sky-top" />
        <div className="ambient-blob ambient-blob-blue-top" />
        <div className="ambient-blob ambient-blob-amber-bottom" />
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/80 border border-border text-primary text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="size-3.5 text-primary" />
            <span>Book Your Visit</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-sans font-bold tracking-tight text-foreground leading-tight mb-4">
            Book an Appointment
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed">
            Choose your preferred service, doctor and time. We’ll confirm the
            exact slot with you on WhatsApp within a few hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT – Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-lg shadow-black/5 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                  How it works
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
                      <Stethoscope className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground mb-0.5">
                        1. Tell us what you need
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Select the service, preferred doctor and date.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground mb-0.5">
                        2. We confirm on WhatsApp
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Our team will message you to lock in the exact slot.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-11 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 border border-border shadow-xs">
                      <Calendar className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground mb-0.5">
                        3. Visit us
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        City Square Mall (3rd Floor), Samakhushi Road, Kathmandu, Nepal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
                      <Clock className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground mb-0.5">
                        Response Time
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Usually within a few hours (max 24 hrs)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Prefer to call?
                </span>
                <a
                  href={`tel:${CLINIC_INFO.phoneTel}`}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  +977 976-7648659 · 01-4978659
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT – Form */}
          <div ref={formRef} className="lg:col-span-7 flex flex-col justify-center scroll-mt-24">
            <div className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-lg shadow-black/5 w-full">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-10 px-4 flex flex-col items-center justify-center"
                  >
                    <div className="size-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center mb-4 shadow-xs">
                      <CheckCircle2 className="size-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      WhatsApp opened!
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
                      We’ve pre-filled your appointment request. Just hit{" "}
                      <strong>Send</strong> in WhatsApp and our team will
                      confirm the time with you shortly.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Book Another Appointment
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                          Request Appointment
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          Fill the form, we’ll open WhatsApp with your request
                          ready to send.
                        </p>
                      </div>
                      <div className="size-10 rounded-full bg-muted text-foreground flex items-center justify-center border border-border shadow-xs">
                        <Send className="size-4.5" />
                      </div>
                    </div>

                    {formError && (
                      <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium mb-5">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-4"
                    >
                      {/* Name + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label
                            htmlFor="name"
                            className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                          >
                            Full Name *
                          </label>
                          <input
                            id="name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g. Anisha Shrestha"
                            autoComplete="name"
                            className={`w-full px-4 py-2.5 rounded-2xl border text-sm transition-all placeholder:text-muted-foreground focus:outline-none dark:[color-scheme:dark] ${
                              touched.name && getError("name")
                                ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                : "bg-muted border-black/15 dark:border-white/20 focus:ring-2 focus:ring-ring/20 focus:border-ring"
                            }`}
                          />
                          {touched.name && getError("name") && (
                            <p className="text-[11px] text-rose-600 font-medium mt-1">
                              {getError("name")}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="phone"
                            className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                          >
                            Phone / WhatsApp *
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="+977 98xxxxxxxx"
                            autoComplete="tel"
                            className={`w-full px-4 py-2.5 rounded-2xl border text-sm transition-all placeholder:text-muted-foreground focus:outline-none dark:[color-scheme:dark] ${
                              touched.phone && getError("phone")
                                ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                : "bg-muted border-black/15 dark:border-white/20 focus:ring-2 focus:ring-ring/20 focus:border-ring"
                            }`}
                          />
                          {touched.phone && getError("phone") && (
                            <p className="text-[11px] text-rose-600 font-medium mt-1">
                              {getError("phone")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="email"
                          className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                        >
                          Email{" "}
                          <span className="text-muted-foreground normal-case tracking-normal font-normal">
                            (optional)
                          </span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className={`w-full px-4 py-2.5 rounded-2xl border text-sm transition-all placeholder:text-muted-foreground focus:outline-none dark:[color-scheme:dark] ${
                            touched.email && getError("email")
                              ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                              : "bg-muted border-black/15 dark:border-white/20 focus:ring-2 focus:ring-ring/20 focus:border-ring"
                          }`}
                        />
                        {touched.email && getError("email") && (
                          <p className="text-[11px] text-rose-600 font-medium mt-1">
                            {getError("email")}
                          </p>
                        )}
                      </div>

                      {/* Service */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="service"
                          className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                        >
                          Service *
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={form.service}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-2.5 rounded-2xl border text-sm focus:outline-none transition-all cursor-pointer dark:[color-scheme:dark] ${
                            touched.service && getError("service")
                              ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                              : "bg-muted border-black/15 dark:border-white/20 focus:ring-2 focus:ring-ring/20 focus:border-ring"
                          }`}
                        >
                          <option value="">Select a service</option>
                          {SERVICES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {touched.service && getError("service") && (
                          <p className="text-[11px] text-rose-600 font-medium mt-1">
                            {getError("service")}
                          </p>
                        )}
                      </div>

                      {/* Preferred Doctor – NEW */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="preferredDoctor"
                          className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                        >
                          Preferred Doctor{" "}
                          <span className="text-muted-foreground normal-case tracking-normal font-normal">
                            (optional)
                          </span>
                        </label>
                        <div className="relative">
                          <select
                            id="preferredDoctor"
                            name="preferredDoctor"
                            value={form.preferredDoctor}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-2xl bg-muted border border-black/15 dark:border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all cursor-pointer appearance-none dark:[color-scheme:dark]"
                          >
                            {DOCTORS.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Date + Time */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label
                            htmlFor="preferredDate"
                            className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                          >
                            Preferred Date *
                          </label>
                          <input
                            id="preferredDate"
                            type="date"
                            name="preferredDate"
                            value={form.preferredDate}
                            min={today}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none dark:[color-scheme:dark] ${
                              touched.preferredDate && getError("preferredDate")
                                ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                : "bg-muted border-black/15 dark:border-white/20 focus:ring-2 focus:ring-ring/20 focus:border-ring"
                            }`}
                          />
                          {touched.preferredDate &&
                            getError("preferredDate") && (
                              <p className="text-[11px] text-rose-600 font-medium mt-1">
                                {getError("preferredDate")}
                              </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="preferredTime"
                            className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                          >
                            Preferred Time{" "}
                            <span className="text-muted-foreground normal-case tracking-normal font-normal">
                              (optional)
                            </span>
                          </label>
                          <input
                            id="preferredTime"
                            type="time"
                            name="preferredTime"
                            value={form.preferredTime}
                            min={OPEN_TIME}
                            max={CLOSE_TIME}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2.5 rounded-2xl border text-sm focus:outline-none dark:[color-scheme:dark] transition-all ${
                              touched.preferredTime && getError("preferredTime")
                                ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                : "bg-muted border-black/15 dark:border-white/20 focus:ring-2 focus:ring-ring/20 focus:border-ring"
                            }`}
                          />
                          {touched.preferredTime &&
                          getError("preferredTime") ? (
                            <p className="text-[11px] text-rose-600 font-medium mt-1">
                              {getError("preferredTime")}
                            </p>
                          ) : (
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Clinic hours: {HOURS_LABEL} (Sun–Fri)
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="notes"
                          className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                        >
                          Notes / Special Requests{" "}
                          <span className="text-muted-foreground normal-case tracking-normal font-normal">
                            (optional)
                          </span>
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={form.notes}
                          onChange={handleChange}
                          placeholder="Any allergies, preferred doctor details, or other requests..."
                          className="w-full px-4 py-3 rounded-2xl bg-muted border border-black/15 dark:border-white/20 text-sm transition-all resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={submitting || !allValid}
                        className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2
    disabled:bg-primary/40 disabled:text-muted-foreground disabled:shadow-none disabled:hover:bg-primary/40 disabled:cursor-not-allowed disabled:opacity-100
    dark:disabled:text-white"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Opening WhatsApp...</span>
                          </>
                        ) : (
                          <>
                            <Send className="size-4" />
                            <span>Request via WhatsApp</span>
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
